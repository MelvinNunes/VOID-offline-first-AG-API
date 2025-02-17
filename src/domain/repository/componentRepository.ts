import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ComponentRepository {
  static async create(data: any) {
    await prisma.component.create({
      data: data,
    });
  }
}
