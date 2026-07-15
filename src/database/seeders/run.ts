import "reflect-metadata";
import { AppDataSource } from "../../config/database.js";
import { User, UserRole } from "../../entities/User.js";
import bcrypt from "bcrypt";

async function seed() {
  await AppDataSource.initialize();
  console.log("Database connected for seeding...");

  const userRepository = AppDataSource.getRepository(User);

  // Create admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  await userRepository.save(
    userRepository.create({
      email: "admin@autolease.com",
      password: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
      isEmailVerified: true,
    }),
  );

  // Create car owner
  const ownerPassword = await bcrypt.hash("owner123", 10);
  await userRepository.save(
    userRepository.create({
      email: "testowner@autolease.com",
      password: ownerPassword,
      firstName: "Test",
      lastName: "Owner",
      role: UserRole.CAR_OWNER,
      isEmailVerified: true,
    }),
  );

  // Create customer
  const customerPassword = await bcrypt.hash("customer123", 10);
  await userRepository.save(
    userRepository.create({
      email: "testcustomer@autolease.com",
      password: customerPassword,
      firstName: "Test",
      lastName: "User",
      role: UserRole.CUSTOMER,
      isEmailVerified: true,
    }),
  );

  await AppDataSource.destroy();
  console.log("Seeding complete!");
}

seed().catch(console.error);
