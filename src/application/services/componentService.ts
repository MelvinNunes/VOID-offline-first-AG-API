import { logger } from "../../../src/infrastructure/config/logger";
import { ComponentRepository } from "../../../src/domain/repository/componentRepository";
import { Component } from "../../../src/interfaces/dtos/productDTO";
import { CreateComponentData } from "../../../src/interfaces/dtos/componentDTOs";

export default class ComponentService {
  // composite is the product that will hold the components
  static async createOrUpdateManyComponents(
    compositeId: string,
    data: Component[]
  ): Promise<void> {
    data.forEach(async (item) => {
      try {
        const componet: CreateComponentData = {
          quantity: item.quantity,
          compositeId: compositeId,
          productId: item.productId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await ComponentRepository.create(componet);
      } catch (err) {
        logger.error(`Error creating component with data: ${data}.`);
      }
    });
  }
}
