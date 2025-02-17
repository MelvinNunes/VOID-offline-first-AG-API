import { $Enums } from "@prisma/client";

export interface ProductCreationData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  type: $Enums.ProductType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
