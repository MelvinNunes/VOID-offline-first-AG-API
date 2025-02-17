import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ProductRepository {
  static async create(data: any) {
    await prisma.product.create({
      data: data,
    });
  }
}
