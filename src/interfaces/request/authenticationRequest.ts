import { z } from "zod";

export const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export const Role = z.enum(["MANAGER", "USER"]);
export type Role = z.infer<typeof Role>;

export const RegistrationRequest = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string().min(5),
  type: Role,
});
