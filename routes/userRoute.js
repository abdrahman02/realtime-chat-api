import express from "express";
import {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  searchUsers,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);
router.get("/search-users", searchUsers);

export default router;
