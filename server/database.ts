import { PrismaClient } from "@prisma/client";

const localDatabaseUrl = `postgresql://postgres:${process.env.POSTGRES_PASSWORD ?? "postgrespassword"}@localhost:55432/postgres`;
const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : (process.env.LOCAL_DATABASE_URL ?? localDatabaseUrl);

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required in production");
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});
