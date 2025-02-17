import { PrismaClient } from "@prisma/client";
import { CreateComponentData } from "../../../src/interfaces/dtos/componentDTOs";

const prisma = new PrismaClient();

export class ComponentRepository {
  static async create(data: CreateComponentData) {
    await prisma.component.upsert({
      where: {
        compositeId_productId: {
          compositeId: data.compositeId,
          productId: data.productId,
        },
      },
      update: {
        quantity: data.quantity,
        updatedAt: new Date(),
      },
      create: {
        ...data,
      },
    });
  }
}
