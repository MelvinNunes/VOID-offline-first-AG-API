import { Role } from "@prisma/client";

export interface UserCreationData {
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
