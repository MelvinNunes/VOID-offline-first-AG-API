import { $Enums, User } from "@prisma/client";

export class UserModel implements User {
  id: string;
  email: string;
  password: string;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  canCreateProduct(productType: $Enums.ProductType) {
    if (this.role === $Enums.Role.MANAGER) {
      return true;
    }
    return (
      this.role === $Enums.Role.USER &&
      productType === $Enums.ProductType.SIMPLE
    );
  }

  canViewProduct(productType: $Enums.ProductType) {
    if (this.role === $Enums.Role.MANAGER) {
      return true;
    }
    return (
      this.role === $Enums.Role.USER &&
      productType === $Enums.ProductType.COMPOSITE
    );
  }

  typesThatCanView() {
    if (this.role === $Enums.Role.MANAGER) {
      return [$Enums.ProductType.COMPOSITE, $Enums.ProductType.SIMPLE];
    }
    return [$Enums.ProductType.COMPOSITE];
  }

  canUpdateProduct() {
    return this.role === $Enums.Role.MANAGER;
  }

  canDeleteProduct() {
    return this.role === $Enums.Role.MANAGER;
  }
}
