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
}
