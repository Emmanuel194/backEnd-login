import express from "express";
import { validateUserCreationMiddleware } from "../middlewares/validate-user-creation.middleware";
const router = express.Router();

import {
  createUser,
  getUsers,
  getUserByID,
  updateUser,
  deleteUser,
  authenticate,
} from "../controllers/user.controller";

router.post("/users", validateUserCreationMiddleware, createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserByID);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/authenticate", authenticate);

export default router;
