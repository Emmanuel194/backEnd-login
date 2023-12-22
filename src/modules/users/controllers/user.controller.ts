import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../../../../banco";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password_hash } = req.body;
    if (!name || !email || !password_hash)
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });

    const useremailExist = await AppDataSource.getRepository(User).findOneBy({
      email,
    });
    if (useremailExist)
      return res.status(400).json({ message: "Este e-mail já está em uso." });

    const hashPassword = await bcrypt.hash(password_hash, 10);
    const user = AppDataSource.getRepository(User).create({
      name,
      email,
      password_hash: hashPassword,
    });

    await AppDataSource.getRepository(User).save(user);
    res.status(201).json({ message: "usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error ao criar usuário." });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await AppDataSource.getRepository(User).find();
    if (!users)
      return res.status(404).json({ error: "usuários não encontrado." });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "erro ao tentar obter usuários" });
  }
};

export const getUserByID = async (req: Request, res: Response) => {
  try {
    const ID_user = req.params.id;
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: +ID_user },
    });
    if (!user) return res.status(400).json({ erro: "usuário não encontrado." });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "erro ao tentar obter usuário." });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const ID_user = req.params.id;
    const { name, email, password_hash } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: +ID_user } });

    if (!user)
      return res.status(404).json({ error: "usuário não encontrado." });

    user.name = name || user.name;
    user.email = email || user.email;
    user.password_hash = password_hash
      ? await bcrypt.hash(password_hash, 10)
      : user.password_hash;

    await userRepository.save(user);
    res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao tentar atualizar usuário." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const ID_user = req.params.id;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: +ID_user } });

    if (!user)
      return res.status(404).json({ error: "usuário não encontrado." });

    await userRepository.softRemove(user);
    res.status(200).json({ message: "Usuário excluído com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao tentar excluír usuário." });
  }
};

export const authenticate = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await AppDataSource.getRepository(User).findOne({
      where: { email: email },
      select: ["id", "name", "email", "password_hash"],
    });

    if (!user) {
      return res
        .status(404)
        .json({ ok: false, error: "Usuário não encontrado" });
    }

    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ ok: false, error: "Senha Inválida" });
    }

    // Gera token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return res.status(200).json({ ok: true, token });
  } catch (error) {
    console.log(error, "Erro na autenticação");
    res
      .status(500)
      .send({ ok: false, error: "erro de autenticação do usuário" });
  }
};
