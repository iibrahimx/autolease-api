import { AppDataSource } from "../config/database.js";
import { User } from "../entities/User.js";

// Get the TypeORM repository for the User entity
const userRepository = () => AppDataSource.getRepository(User);

// ============================================
// CUSTOM REPOSITORY METHODS
// ============================================

export const UserRepository = {
  // Finds a single user by their UUID primary key
  async findById(id: string): Promise<User | null> {
    return userRepository().findOne({
      where: { id: id },
    });
  },

  // Used during login to find a user by their email address
  async findByEmail(email: string): Promise<User | null> {
    return userRepository().findOne({
      where: { email },
    });
  },

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    return userRepository().findOne({
      where: { emailVerificationToken: token },
    });
  },

  async findByPasswordResetToken(token: string): Promise<User | null> {
    return userRepository().findOne({
      where: { passwordResetToken: token },
    });
  },

  // Used for Google OAuth - finds users who signed up with Google
  async findByGoogleId(googleId: string): Promise<User | null> {
    return userRepository().findOne({
      where: { googleId },
    });
  },

  // Create a new user record in the database
  async create(userData: Partial<User>): Promise<User> {
    const user = userRepository().create(userData);
    return userRepository().save(user);
  },

  // Update user | Update specific fields on a user record
  async update(id: string, userData: Partial<User>): Promise<void> {
    await userRepository().update(id, userData);
  },

  // Soft delete | Instead of actually deleting the user, they just get deactivated
  async softDelete(id: string): Promise<void> {
    await userRepository().update(id, { isActive: false });
  },

  // Stores the refresh token when a user logs in
  async saveRefreshToken(id: string, token: string): Promise<void> {
    await userRepository().update(id, { refreshToken: token });
  },

  // Removes the refresh token when a user logs out
  async clearRefreshToken(id: string): Promise<void> {
    await userRepository().update(id, { refreshToken: null as any });
  },

  // Mark email as verified | Called after a user clicks the email verification link
  async verifyEmail(id: string): Promise<void> {
    await userRepository().update(id, { isEmailVerified: true });
  },

  // Change password | Updates just the password field
  async changePassword(id: string, hashedPassword: string): Promise<void> {
    await userRepository().update(id, { password: hashedPassword });
  },
};
