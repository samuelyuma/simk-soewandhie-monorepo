import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "@/generated/prisma";

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({
  ...(process.env.NODE_ENV !== "production" ? { adapter } : undefined),
});

export default prisma;
