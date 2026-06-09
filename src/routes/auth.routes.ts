import { Router } from "express";
import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleAuth,
  facebookAuth,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify/:token", verifyEmail);
router.post("/google", googleAuth);
router.post("/facebook", facebookAuth);

export default router;