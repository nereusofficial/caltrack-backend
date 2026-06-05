import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/db";
import { sendVerificationEmail, sendResetPasswordEmail, } from "../services/email.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    await pool.query(`
      DELETE FROM pending_users
      WHERE expires_at < NOW()
    `);

    const existingUser = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = uuidv4();

    const expiresAt = new Date(
      Date.now() + 1000 * 60 * 60
    ); // 1 hour

    const existingPending = await pool.query(
      `
      SELECT *
      FROM pending_users
      WHERE email = $1
      `,
      [email]
    );

    if (existingPending.rows.length > 0) {
      await pool.query(
        `
        UPDATE pending_users
        SET
          firstname = $1,
          lastname = $2,
          password = $3,
          verification_token = $4,
          expires_at = $5
        WHERE email = $6
        `,
        [
          firstName,
          lastName,
          hashedPassword,
          token,
          expiresAt,
          email,
        ]
      );

      await sendVerificationEmail(email, token);

      return res.status(200).json({
        success: true,
        message: "Verification email resent.",
      });
    }

    await pool.query(
      `
      INSERT INTO pending_users
      (
        firstname,
        lastname,
        email,
        password,
        verification_token,
        expires_at
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        token,
        expiresAt,
      ]
    );

    await sendVerificationEmail(email, token);

    return res.status(201).json({
      success: true,
      message:
        "Verification email sent. Please verify your account.",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const { token } = req.params;

    const pendingUser = await pool.query(
      `
      SELECT *
      FROM pending_users
      WHERE verification_token = $1
      `,
      [token]
    );

    if (pendingUser.rows.length === 0) {
      return res
        .status(400)
        .send("Invalid verification link.");
    }

    const user = pendingUser.rows[0];

    if (
      user.expires_at &&
      new Date() > new Date(user.expires_at)
    ) {
      await pool.query(
        `
        DELETE FROM pending_users
        WHERE verification_token = $1
        `,
        [token]
      );

      return res
        .status(400)
        .send("Verification link has expired.");
    }

    await pool.query(
      `
      INSERT INTO users
      (
        firstname,
        lastname,
        email,
        password
      )
      VALUES ($1,$2,$3,$4)
      `,
      [
        user.firstname,
        user.lastname,
        user.email,
        user.password,
      ]
    );

    await pool.query(
      `
      DELETE FROM pending_users
      WHERE verification_token = $1
      `,
      [token]
    );

    return res.redirect(
      "http://localhost:5173/verify-success"
    );
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    const user = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found with that email.",
      });
    }

    const token = uuidv4();

    const expiresAt = new Date(
      Date.now() + 1000 * 60 * 60
    );

    await pool.query(
      `
      UPDATE users
      SET
        reset_token = $1,
        reset_token_expires = $2
      WHERE email = $3
      `,
      [token, expiresAt, email]
    );

    await sendResetPasswordEmail(email, token);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent.",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { token, password } = req.body;

    const user = await pool.query(
      `
      SELECT *
      FROM users
      WHERE reset_token = $1
      `,
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token.",
      });
    }

    const account = user.rows[0];

    if (
      account.reset_token_expires &&
      new Date() >
        new Date(account.reset_token_expires)
    ) {
      return res.status(400).json({
        success: false,
        message: "Reset token expired.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await pool.query(
      `
      UPDATE users
      SET
        password = $1,
        reset_token = NULL,
        reset_token_expires = NULL
      WHERE id = $2
      `,
      [hashedPassword, account.id]
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};