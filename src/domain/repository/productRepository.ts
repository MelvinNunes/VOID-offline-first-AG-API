import { PrismaClient } from "@prisma/client";
import { ProductCreationData } from "../../../src/interfaces/dtos/productDTO";

const prisma = new PrismaClient();

export class ProductRepository {
  static async create(data: ProductCreationData) {
    await prisma.product.create({
      data: data,
    });
  }
}
