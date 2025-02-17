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
  ProductCreateRequestData,
  ProductUpdateRequestData,
  Component,
  ProductUpdateData,
  ProductFilters,
} from "../../../src/interfaces/dtos/productDTO";
import { UserServices } from "./userService";
import { $Enums, Product, ProductType } from "@prisma/client";
import { ProductRepository } from "../../../src/domain/repository/productRepository";
import ComponentService from "./componentService";
import { ProductModel } from "../../../src/domain/models/product";

export default class ProductService {
  static async createProduct(
    createdBy: AuthUser,
    data: ProductCreateRequestData
  ) {
    await this.validateProductData(data);

    const onlineUser = await UserServices.getCurrentUser(createdBy);
    const productType = await this.getProductTypeCreating(data);

    if (!onlineUser.canCreateProduct(productType)) {
      throw new CannotHaveActionInProductException(
        `You dont have enought permission to create this type of product: ${productType}`
      );
    }

    var componentProducts: Product[] = [];
    if (data.components && data.components.length > 0) {
      const ids = data.components.map((component) => component.productId);
      componentProducts = await ProductRepository.allInIds(ids);
    }

    const price = await this.calculatePrice(
      productType,
      data,
      componentProducts
    );
    const quantity = await this.calculateQuantity(
      productType,
      data,
      componentProducts
    );

    const product: ProductCreationData = {
      id: data.id,
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

    this.saveManyComponents(productType, data.components, createdProduct.id);
  }

  static async getAllProducts(
    authUser: AuthUser,
    filters: ProductFilters
  ): Promise<ProductModel[]> {
    const onlineUser = await UserServices.getCurrentUser(authUser);
    const products = await ProductRepository.all(
      filters,
      onlineUser.typesThatCanView()
    );
    return products.map((product) => new ProductModel(product));
  }

  static async updateProduct(
    productId: string,
    updatedBy: AuthUser,
    data: ProductUpdateRequestData
  ): Promise<ProductModel> {
    await this.findProductById(productId);
    await this.validateProductData(data);

    const onlineUser = await UserServices.getCurrentUser(updatedBy);
    const productType = await this.getProductTypeCreating(data);

    if (!onlineUser.canUpdateProduct()) {
      throw new CannotHaveActionInProductException(
        `You dont have enought permission to edit a product!`
      );
    }

    var componentProducts: Product[] = [];
    if (data.components && data.components.length > 0) {
      const ids = data.components.map((component) => component.productId);
      componentProducts = await ProductRepository.allInIds(ids);
    }

    const price = await this.calculatePrice(
      productType,
      data,
      componentProducts
    );
    const quantity = await this.calculateQuantity(
      productType,
      data,
      componentProducts
    );

    const updateData: ProductUpdateData = {
      name: data.name,
      description: data.description,
      price: price,
      quantity: quantity,
      type: productType,
      userId: onlineUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    var updatedProduct: Product;

    try {
      updatedProduct = await ProductRepository.update(productId, updateData);
    } catch (err) {
      logger.error(`Error creating the main product, err: ${err}`);
      throw new InternalServerError();
    }

    this.saveManyComponents(productType, data.components, productId);

    return updatedProduct;
  }

  static async getProductDetails(
    authUser: AuthUser,
    productId: string
  ): Promise<ProductModel> {
    const onlineUser = await UserServices.getCurrentUser(authUser);
    const product = await this.findProductById(productId);

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
    data: ProductCreateRequestData | ProductUpdateRequestData
  ): Promise<$Enums.ProductType> {
    return data.components && data.components.length > 0
      ? ProductType.COMPOSITE
      : ProductType.SIMPLE;
  }

  private static async validateProductData(
    data: ProductCreateRequestData | ProductUpdateRequestData
  ) {
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

  private static async findProductById(
    productId: string
  ): Promise<ProductModel> {
    const product = await ProductRepository.findById(productId);

    if (!product) {
      throw new ProductNotFoundException(
        `The product with the id: ${productId} was not found in our services!`
      );
    }

    return product;
  }

  private static async calculatePrice(
    productType: $Enums.ProductType,
    data: ProductCreateRequestData | ProductUpdateRequestData,
    componentProducts?: Product[]
  ): Promise<number> {
    if (productType === ProductType.SIMPLE) {
      return data.price;
    }
    if (!componentProducts || !data.components) {
      return 0;
    }
    const productPriceMap = new Map(
      componentProducts.map((product) => [product.id, product.price])
    );

    const totalPrice = data.components.reduce((sum, component) => {
      const productPrice = productPriceMap.get(component.productId) || 0;
      return sum + component.quantity * productPrice;
    }, 0);

    return totalPrice;
  }

  private static async calculateQuantity(
    productType: $Enums.ProductType,
    data: ProductCreateRequestData | ProductUpdateRequestData,
    componentProducts?: Product[]
  ): Promise<number> {
    if (productType === ProductType.SIMPLE) {
      return data.quantity;
    }

    if (
      !componentProducts ||
      !data.components ||
      data.components.length === 0
    ) {
      return 0;
    }

    const productQuantityMap = new Map(
      componentProducts.map((product) => [product.id, product.quantity])
    );

    const possibleQuantities = data.components.map((component) => {
      const availableQuantity =
        productQuantityMap.get(component.productId) || 0;
      const requiredQuantity = component.quantity;

      if (requiredQuantity === 0) return Infinity;

      return Math.floor(availableQuantity / requiredQuantity);
    });

    const finiteQuantities = possibleQuantities.filter((q) => q !== Infinity);
    return finiteQuantities.length > 0 ? Math.min(...finiteQuantities) : 0;
  }

  private static async existsById(id: string): Promise<boolean> {
    return await ProductRepository.existsById(id);
  }

  private static saveManyComponents(
    productType: $Enums.ProductType,
    components: Component[],
    holderProductId: string
  ) {
    if (productType === ProductType.COMPOSITE) {
      // creates or updates
      ComponentService.createOrUpdateManyComponents(holderProductId, components)
        .then(() => {
          logger.info(
            `Sucessfully created or updated all components in the product id: ${holderProductId}! `
          );
        })
        .catch((err) => {
          logger.error(
            `Error saving components for the product with id: ${holderProductId} and with data: ${JSON.stringify(
              components
            )}`
          );
          logger.error(`Error saving was: ${err}`);
        });
    }
  }
}
