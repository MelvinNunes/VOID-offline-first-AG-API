import { $Enums, Product } from "@prisma/client";
import { ComponentModel } from "./component";

export class ProductModel implements Product {
  name: string;
  id: string;
  description: string;
  price: number;
  quantity: number;
  userId: string;
  type: $Enums.ProductType;
  components?: ComponentModel[];
  createdAt: Date;
  updatedAt: Date;

  constructor(product: Product, components?: ComponentModel[]) {
    this.name = product.name;
    this.id = product.id;
    this.description = product.description;
    this.price = product.price;
    this.quantity = product.quantity;
    this.userId = product.userId;
    this.type = product.type;
    this.components = components;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}
