import { PrismaClient, Product } from "@prisma/client";
import { ProductCreationData } from "../../../src/interfaces/dtos/productDTO";

const prisma = new PrismaClient();

export class ProductRepository {
  static async create(data: ProductCreationData): Promise<Product> {
    return await prisma.product.create({
      data: data,
    });
  }

  static async existsById(id: string): Promise<boolean> {
    const count = await prisma.product.count({
      where: {
        id: id,
      },
    });
    return count != 0;
  }
}
