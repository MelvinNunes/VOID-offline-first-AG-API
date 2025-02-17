import { Role } from "@prisma/client";

export type UserVM = {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  role: Role;
};
