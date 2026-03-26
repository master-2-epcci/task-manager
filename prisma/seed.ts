import { PrismaClient } from "../generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const dbPath = path.resolve(process.cwd(), "tasks.db").replace(/\\/g, "/");

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({
    url: `file:${dbPath}`,
  }),
});

async function main() {
  const existingUser = await prisma.user.findFirst();

  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        name: "Utilisateur par défaut",
        email: "default@taskmanager.com",
      },
    });
    console.log("✅ Utilisateur par défaut créé :", user);
  } else {
    console.log("ℹ️ Utilisateur déjà existant :", existingUser.name);
  }
}

main()
  .catch((e) => {
    console.error("❌ Erreur :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });