import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function adminSeeder() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_USERNAME },
    update: {},
    create: {
      email: process.env.ADMIN_USERNAME,
      password: hashedPassword,
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log("Admin User seeded successfully!");
}

adminSeeder()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
