import { Router } from "express";
import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleAuth,          // add this
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify/:token", verifyEmail);
router.post("/google", googleAuth);   // add this

export default router;