import { $Enums, Product } from "@prisma/client";

export class ProductModel implements Product {
  name: string;
  id: string;
  description: string;
  price: number;
  quantity: number;
  userId: string;
  type: $Enums.ProductType;
  createdAt: Date;
  updatedAt: Date;

  constructor(product: Product) {
    this.name = product.name;
    this.id = product.id;
    this.description = product.description;
    this.price = product.price;
    this.quantity = product.quantity;
    this.userId = product.userId;
    this.type = product.type;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}
