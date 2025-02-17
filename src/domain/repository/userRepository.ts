import { PrismaClient } from ".prisma/client";
import { UserModel } from "../models/user";
import { UserCreationData } from "../../../src/interfaces/dtos/userDTO";

const prisma = new PrismaClient();

export class UserRepository {
  static async create(userData: UserCreationData): Promise<void> {
    await prisma.user.create({
      data: userData,
    });
  }

  static async getAllUsers(
    start: number = 0,
    limit: number = 15
  ): Promise<UserModel[]> {
    const users = await prisma.user.findMany({
      skip: start,
      take: limit,
    });
    return users.map((user) => new UserModel(user));
  }

  static async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email: email },
    });
    return count > 0;
  }

  static async findByEmail(email: string): Promise<UserModel | null> {
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    return user ? new UserModel(user) : null;
  }

  static async findById(id: string): Promise<UserModel | null> {
    const user = await prisma.user.findFirst({
      where: { id: id },
    });
    return user ? new UserModel(user) : null;
  }
}
