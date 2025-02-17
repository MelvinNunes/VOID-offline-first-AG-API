import { PrismaClient } from "@prisma/client";
import { CreateComponentData } from "../../../src/interfaces/dtos/componentDTOs";

const prisma = new PrismaClient();

export class ComponentRepository {
  static async create(data: CreateComponentData) {
    await prisma.component.create({
      data: data,
    });
  }
}
