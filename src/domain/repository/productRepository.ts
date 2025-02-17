import { PrismaClient, Product, ProductType } from "@prisma/client";
import { ProductCreationData } from "../../../src/interfaces/dtos/productDTO";
import { ProductModel } from "../models/product";

const prisma = new PrismaClient();

export class ProductRepository {
  static async create(data: ProductCreationData): Promise<Product> {
    return await prisma.product.create({
      data: data,
    });
  }

  static async all(
    start: number,
    limit: number,
    types: ProductType[]
  ): Promise<Product[]> {
    return await prisma.product.findMany({
      where: {
        type: {
          in: types,
        },
      },
      take: limit,
      skip: start,
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

  static async findById(id: string): Promise<ProductModel> {
    const product = await prisma.product.findFirst({
      where: {
        id: id,
      },
    });
    return product ? new ProductModel(product) : null;
  }

  static async deleteById(id: string): Promise<void> {
    await prisma.product.delete({
      where: {
        id: id,
      },
    });
  }
}
