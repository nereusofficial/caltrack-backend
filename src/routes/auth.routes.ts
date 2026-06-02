import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db";

const router = Router();

/**
 * SIGNUP
 */
router.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    age,
    gender,
    height,
    weight,
  } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users
      (
        firstname,
        lastname,
        email,
        password,
        age,
        gender,
        height,
        weight
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id,email,firstname,lastname,age,gender,height,weight
      `,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        age,
        gender,
        height,
        weight,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err: any) {
    console.error("SIGNUP ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1d",
      }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        firstName: user.firstname,
        lastName: user.lastname,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.error("SIGNUP ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;