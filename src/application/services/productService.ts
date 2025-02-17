import { InternalServerError } from "../../../src/infrastructure/exceptions/exceptions";
import { logger } from "../../../src/infrastructure/config/logger";
import {
  BadRequestCreatingProductException,
  CannotHaveActionInProductException,
  ProductNotFoundException,
} from "../../../src/infrastructure/exceptions/product/productExceptions";
import { AuthUser } from "../../../src/infrastructure/types";
import {
  ProductCreationData,
  ProductRequestData,
} from "../../../src/interfaces/dtos/productDTO";
import { UserServices } from "./userService";
import { $Enums, Product, ProductType } from "@prisma/client";
import { ProductRepository } from "../../../src/domain/repository/productRepository";
import ComponentService from "./componentService";
import { ProductModel } from "../../../src/domain/models/product";

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

    var createdProduct: Product;

    try {
      createdProduct = await ProductRepository.create(product);
    } catch (err) {
      logger.error(`Error creating the main product, err: ${err}`);
      throw new InternalServerError();
    }

    if (productType === ProductType.COMPOSITE) {
      ComponentService.createManyComponents(createdProduct.id, data.components)
        .then(() => {
          logger.info(`Sucessfully created all components in the product! `);
        })
        .catch((err) => {
          logger.error(
            `Error saving components for the product with data: ${data}`
          );
          logger.error(`Error saving was: ${err}`);
        });
    }
  }

  static async getAllProducts(
    authUser: AuthUser,
    start: number,
    limit: number
  ): Promise<ProductModel[]> {
    const onlineUser = await UserServices.getCurrentUser(authUser);
    const products = await ProductRepository.all(
      start,
      limit,
      onlineUser.typesThatCanView()
    );
    return products.map((product) => new ProductModel(product));
  }

  static async getProductDetails(
    authUser: AuthUser,
    productId: string
  ): Promise<ProductModel> {
    const onlineUser = await UserServices.getCurrentUser(authUser);
    const product = await ProductRepository.findById(productId);

    if (!product) {
      throw new ProductNotFoundException(
        `The product with the id: ${productId} was not found in our services!`
      );
    }

    if (!onlineUser.canViewProduct(product.type)) {
      throw new CannotHaveActionInProductException(
        `You dont have enought permission to view this type of product: ${product.type}`
      );
    }

    return product;
  }

  static async deleteProduct(authUser: AuthUser, productId: string) {
    const onlineUser = await UserServices.getCurrentUser(authUser);
    if (!onlineUser.canDeleteProduct()) {
      throw new CannotHaveActionInProductException(
        `You dont have enought permission to delete products!`
      );
    }

    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new ProductNotFoundException(
        `The product with the id: ${productId} was not found in our services!`
      );
    }

    try {
      await ProductRepository.deleteById(productId);
    } catch (err) {
      logger.error(
        `Error trying to delete the product with id: ${productId}, err: ${err}`
      );
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

    if (data.components && data.components.length > 0) {
      await Promise.all(
        data.components.map(async (component) => {
          const exists = await this.existsById(component.productId);
          if (!exists) {
            throw new ProductNotFoundException(
              `The product with the given id: ${component.productId}, in components, was not found!`
            );
          }
        })
      );
    }
  }

  private static async calculatePrice(
    productType: $Enums.ProductType,
    data: ProductRequestData,
    componentProducts?: ProductModel[]
  ): Promise<number> {
    if (productType === ProductType.SIMPLE) {
      return data.price;
    }
    // return data.components.map((componet) => {
    //   return componet.quantity * 0;
    // })
    return 0; // to be calc
  }

  private static async calculateQuantity(
    productType: $Enums.ProductType,
    data: ProductRequestData,
    componentProducts?: ProductModel[]
  ): Promise<number> {
    if (productType === ProductType.SIMPLE) {
      return data.quantity;
    }

    return 0; // to be calc
  }

  private static async existsById(id: string): Promise<boolean> {
    return await ProductRepository.existsById(id);
  }
}
