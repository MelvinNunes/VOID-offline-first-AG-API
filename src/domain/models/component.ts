import { Component } from "@prisma/client";

export class ComponentModel implements Component {
  id: string;
  quantity: number;
  compositeId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(component: Component) {
    this.quantity = component.quantity;
    this.compositeId = component.compositeId;
    this.productId = component.productId;
    this.id = component.id;
    this.createdAt = component.createdAt;
    this.updatedAt = component.updatedAt;
  }
}
