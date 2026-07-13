import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository.js";
import { env } from "../config/env.js";
import { UserRole } from "../entities/User.js";
import { EmailService } from "./EmailService.js";
import { generateToken } from "../utils/tokenGenerator.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(env.google.clientId);

export const AuthService = {
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const existingUser = await UserRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const user = await UserRepository.create({
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: UserRole.CUSTOMER,
    });

    return user;
  },

  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("Your account has been deactivated");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    await UserRepository.saveRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  },

  generateAccessToken(userId: string, role: UserRole): string {
    return jwt.sign({ userId, role }, env.jwt.accessSecret, {
      expiresIn: env.jwt.accessExpiration,
    });
  },

  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshExpiration,
    });
  },

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.jwt.refreshSecret) as {
        userId: string;
      };

      const user = await UserRepository.findById(decoded.userId);

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error("Invalid refresh token");
      }

      const newAccessToken = this.generateAccessToken(user.id, user.role);
      const newRefreshToken = this.generateRefreshToken(user.id);

      await UserRepository.saveRefreshToken(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserRepository.changePassword(userId, hashedPassword);
  },

  async forgotPassword(email: string) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      return;
    }

    const resetToken = generateToken();
    const tokenExpiry = new Date();
    tokenExpiry.setMinutes(tokenExpiry.getMinutes() + 30);

    await UserRepository.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetTokenExpires: tokenExpiry,
    } as any);

    await EmailService.sendPasswordResetEmail(user.email, resetToken);
  },

  async resetPassword(token: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  },

  // Google OAuth login method - INSIDE the AuthService object
  async googleLogin(idToken: string) {
    // Verify the ID token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.google.clientId,
    });

    // Extract user info from the verified token
    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      throw new Error("Invalid Google token");
    }

    const { email, given_name, family_name, sub: googleId, picture } = payload;

    // Check if user already exists by Google ID
    let user = await UserRepository.findByGoogleId(googleId);

    if (!user) {
      // Check if user exists by email
      user = await UserRepository.findByEmail(email!);

      if (user) {
        // Link Google ID to existing account
        await UserRepository.update(user.id, { 
          googleId,
          profilePicture: picture || undefined,
        } as any);
      } else {
        // Create new user
        user = await UserRepository.create({
          email: email!,
          password: "",
          firstName: given_name || "",
          lastName: family_name || "",
          googleId,
          profilePicture: picture || undefined,
          isEmailVerified: true,
          role: UserRole.CUSTOMER,
        });
      }
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    await UserRepository.saveRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      accessToken,
      refreshToken,
    };
  },
};