import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAllTables1700000000000 implements MigrationInterface {
  name = "CreateAllTables1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID generation
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create enum types
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('customer', 'car_owner', 'admin')`);
    await queryRunner.query(`CREATE TYPE "public"."cars_enginetype_enum" AS ENUM('v4', 'v6', 'v8', 'v12', 'electric', 'hybrid')`);
    await queryRunner.query(`CREATE TYPE "public"."cars_fueltype_enum" AS ENUM('petrol', 'diesel', 'electric', 'hybrid')`);
    await queryRunner.query(`CREATE TYPE "public"."cars_transmission_enum" AS ENUM('manual', 'automatic')`);
    await queryRunner.query(`CREATE TYPE "public"."cars_status_enum" AS ENUM('available', 'rented', 'suspended', 'paused', 'maintenance')`);
    await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('pending', 'awaiting_payment', 'paid', 'active', 'completed', 'cancelled')`);
    await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'completed', 'failed', 'refunded')`);
    await queryRunner.query(`CREATE TYPE "public"."payments_method_enum" AS ENUM('stripe')`);
    await queryRunner.query(`CREATE TYPE "public"."transactions_type_enum" AS ENUM('credit', 'debit', 'withdrawal', 'commission')`);
    await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('pending', 'completed', 'failed')`);
    await queryRunner.query(`CREATE TYPE "public"."withdrawals_status_enum" AS ENUM('pending', 'approved', 'rejected')`);

    // Users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" varchar(255) NOT NULL UNIQUE,
        "password" varchar(255) NOT NULL,
        "firstName" varchar(100) NOT NULL,
        "lastName" varchar(100) NOT NULL,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer',
        "isEmailVerified" boolean NOT NULL DEFAULT false,
        "isActive" boolean NOT NULL DEFAULT true,
        "phoneNumber" varchar(20),
        "profilePicture" varchar(500),
        "address" text,
        "refreshToken" varchar(500),
        "googleId" varchar(255),
        "emailVerificationToken" varchar(255),
        "emailVerificationTokenExpires" timestamp,
        "passwordResetToken" varchar(255),
        "passwordResetTokenExpires" timestamp,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Cars table
    await queryRunner.query(`
      CREATE TABLE "cars" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "brand" varchar(100) NOT NULL,
        "model" varchar(100) NOT NULL,
        "year" integer NOT NULL,
        "vin" varchar(17) NOT NULL UNIQUE,
        "description" varchar(500) NOT NULL,
        "engineType" "public"."cars_enginetype_enum" NOT NULL,
        "fuelType" "public"."cars_fueltype_enum" NOT NULL,
        "transmission" "public"."cars_transmission_enum" NOT NULL,
        "dailyPrice" numeric(10,2) NOT NULL,
        "images" text,
        "address" text NOT NULL,
        "latitude" numeric(10,7),
        "longitude" numeric(10,7),
        "status" "public"."cars_status_enum" NOT NULL DEFAULT 'available',
        "ownerId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cars" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cars_owner" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Bookings table
    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "startDate" date NOT NULL,
        "endDate" date NOT NULL,
        "totalPrice" numeric(10,2) NOT NULL,
        "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'pending',
        "customerId" uuid,
        "carId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bookings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_bookings_customer" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_bookings_car" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE SET NULL
      )
    `);

    // Payments table
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "stripePaymentIntentId" varchar(255) NOT NULL UNIQUE,
        "amount" numeric(10,2) NOT NULL,
        "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending',
        "method" "public"."payments_method_enum" NOT NULL DEFAULT 'stripe',
        "bookingId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_payments_booking" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE SET NULL
      )
    `);

    // Reviews table
    await queryRunner.query(`
      CREATE TABLE "reviews" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "rating" integer NOT NULL,
        "comment" text,
        "customerId" uuid,
        "carId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_reviews" PRIMARY KEY ("id"),
        CONSTRAINT "FK_reviews_customer" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_reviews_car" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE SET NULL
      )
    `);

    // Wallets table
    await queryRunner.query(`
      CREATE TABLE "wallets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "pendingBalance" numeric(10,2) NOT NULL DEFAULT 0,
        "availableBalance" numeric(10,2) NOT NULL DEFAULT 0,
        "totalEarned" numeric(10,2) NOT NULL DEFAULT 0,
        "userId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_wallets" PRIMARY KEY ("id"),
        CONSTRAINT "FK_wallets_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Transactions table
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "amount" numeric(10,2) NOT NULL,
        "type" "public"."transactions_type_enum" NOT NULL,
        "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'completed',
        "description" varchar(500),
        "walletId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_transactions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_transactions_wallet" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE SET NULL
      )
    `);

    // Bank accounts table
    await queryRunner.query(`
      CREATE TABLE "bank_accounts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bankName" varchar(100) NOT NULL,
        "accountNumber" varchar(20) NOT NULL,
        "accountName" varchar(100) NOT NULL,
        "userId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bank_accounts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_bank_accounts_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Withdrawals table
    await queryRunner.query(`
      CREATE TABLE "withdrawals" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "amount" numeric(10,2) NOT NULL,
        "status" "public"."withdrawals_status_enum" NOT NULL DEFAULT 'pending',
        "userId" uuid,
        "bankAccountId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_withdrawals" PRIMARY KEY ("id"),
        CONSTRAINT "FK_withdrawals_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_withdrawals_bank_account" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE SET NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "withdrawals"`);
    await queryRunner.query(`DROP TABLE "bank_accounts"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "wallets"`);
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TABLE "cars"`);
    await queryRunner.query(`DROP TABLE "users"`);
    
    // Drop enum types
    await queryRunner.query(`DROP TYPE "public"."withdrawals_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payments_method_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."cars_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."cars_transmission_enum"`);
    await queryRunner.query(`DROP TYPE "public"."cars_fueltype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."cars_enginetype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}