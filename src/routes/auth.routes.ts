import { Router } from "express";
import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.get("/verify/:token", verifyEmail);

router.post("/reset-password", resetPassword);
export default router;