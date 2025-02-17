import { $Enums } from "@prisma/client";

export interface ProductCreationData {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  type: $Enums.ProductType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductUpdateData {
  name: string;
  description: string;
  price: number;
  quantity: number;
  type: $Enums.ProductType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Component {
  productId: string;
  quantity: number;
}

export interface ProductCreateRequestData {
  id: string;
  name: string;
  description: string;
  price?: number;
  quantity?: number;
  components?: Component[];
}

export interface ProductUpdateRequestData {
  name: string;
  description: string;
  price?: number;
  quantity?: number;
  components?: Component[];
}
