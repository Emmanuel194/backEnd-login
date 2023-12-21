import express from "express";
import { Request, Response } from "express";

const app = express();
app.use(express.json());

app.use("/");

app.use("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "sucesso!" });
});

const port = 3000;
export const initServe = () => {
  app.listen(port, () => {
    console.log(`Servidor iniciando: http://localhost:${port}`);
  });
};
