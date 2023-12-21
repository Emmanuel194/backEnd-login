import express, { Request, Response } from "express";

const app = express();

app.post("/", lidarComRequisicao)


function lidarComRequisicao(req: Request, res: Response) {
  res.status(401).send("Ola");
}

// const aplicacaoIniciando = () => {  // ARROW FUCNTION , modelo dela.
//   console.log("aplicação Iniciada");
//  }

app.listen(3000, () => {
  console.log("servindo rodando na porta 3000")
});

// console.log("Hello world");
