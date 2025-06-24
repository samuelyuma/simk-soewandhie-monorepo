import { PrismaClient } from "../../src/generated/prisma";
import { UserData } from "./data/user";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database begins...");

  await Promise.all(
    UserData.map(async (user) =>
      prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          ...user,
          password: await Bun.password.hash(user.password, "bcrypt"),
        },
      }),
    ),
  );
}

main()
  .catch((e) => {
    console.error(`There was an error while seeding: ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Database seeded successfully. Closing connection.");
    await prisma.$disconnect();
  });