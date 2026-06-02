import { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    return res.status(201).json({
      success: true,
      message: "User registered",
      user: { firstName, lastName, email },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: "dummy-token",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};