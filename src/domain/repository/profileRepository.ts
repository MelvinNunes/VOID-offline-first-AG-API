import { PrismaClient } from "@prisma/client";
import { ProfileCreationData } from "../../../src/interfaces/dtos/profileDTO";
import { ProfileModel } from "../models/profile";

const prisma = new PrismaClient();

export class ProfileRepository {
  static async create(data: ProfileCreationData): Promise<void> {
    await prisma.profile.create({
      data: data,
    });
  }

  static async findByUserId(userId: string): Promise<ProfileModel | null> {
    const profile = await prisma.profile.findFirst({
      where: { userId: userId },
    });
    return profile ? new ProfileModel(profile) : null;
  }
}
