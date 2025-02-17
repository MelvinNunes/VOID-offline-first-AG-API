import { InternalServerError } from "../../../src/infrastructure/exceptions/exceptions";
import { logger } from "../../../src/infrastructure/config/logger";
import {
  BadRequestCreatingProductException,
  CannotHaveActionInProductException,
} from "../../../src/infrastructure/exceptions/product/productExceptions";
import { AuthUser } from "../../../src/infrastructure/types";
import {
  ProductCreationData,
  ProductRequestData,
} from "../../../src/interfaces/dtos/productDTO";
import { UserServices } from "./userService";
import { $Enums, ProductType } from "@prisma/client";
import { ProductRepository } from "../../../src/domain/repository/productRepository";

export default class ProductService {
  static async createProduct(createdBy: AuthUser, data: ProductRequestData) {
    await this.validateProductData(data);

    const onlineUser = await UserServices.getCurrentUser(createdBy);
    const productType = await this.getProductTypeCreating(data);

    if (!onlineUser.canCreateProduct(productType)) {
      throw new CannotHaveActionInProductException(
        `You dont have enought permission to create this type of product: ${productType}`
      );
    }

    const price = await this.calculatePrice(productType, data);
    const quantity = await this.calculateQuantity(productType, data);

    const product: ProductCreationData = {
      name: data.name,
      description: data.description,
      price: price,
      quantity: quantity,
      type: productType,
      userId: onlineUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await ProductRepository.create(product);
    } catch (err) {
      logger.error(`Error creating the main product, err: ${err}`);
      throw new InternalServerError();
    }
  }

  private static async getProductTypeCreating(
    data: ProductRequestData
  ): Promise<$Enums.ProductType> {
    return data.components && data.components.length > 0
      ? ProductType.COMPOSITE
      : ProductType.SIMPLE;
  }

  private static async validateProductData(data: ProductRequestData) {
    const isSimpleProductInfoAvailable = data.price && data.quantity;
    if (!data.components && !isSimpleProductInfoAvailable)
      throw new BadRequestCreatingProductException();
  }

  private static async calculatePrice(
    productType: $Enums.ProductType,
    data: ProductRequestData
  ): Promise<number> {
    if (productType === ProductType.SIMPLE) {
      return data.price;
    }
    return 0; // to be calc
  }

  private static async calculateQuantity(
    productType: $Enums.ProductType,
    data: ProductRequestData
  ): Promise<number> {
    if (productType === ProductType.SIMPLE) {
      return data.quantity;
    }
    return null; // to be calc
  }
}
