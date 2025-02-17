import { Role } from "@prisma/client";
import { logger } from "../../infrastructure/config/logger";
import {
  UserWithEmailAlreadyExistsException,
  UserWithEmailNotFoundException,
} from "../../../src/infrastructure/exceptions/user/userExceptions";
import { Register } from "../../../src/interfaces/dtos/authDTO";
import { InternalServerError } from "../../../src/infrastructure/exceptions/exceptions";
import { UserVM } from "../../../src/interfaces/response/user";
import { AuthUser } from "../../../src/infrastructure/types";
import ProfileService from "./profileService";
import { ProfileNotFoundException } from "../../../src/infrastructure/exceptions/profile/profileExceptions";
import { UserRepository } from "../../../src/domain/repository/userRepository";
import { UserCreationData } from "../../../src/interfaces/dtos/userDTO";
import { ProfileCreationData } from "../../../src/interfaces/dtos/profileDTO";
import { ProfileRepository } from "../../../src/domain/repository/profileRepository";
import { UserModel } from "../../../src/domain/models/user";

const bcrypt = require("bcrypt");

export class UserServices {
  static async createUser(data: Register, role: Role): Promise<void> {
    const userExists = await UserRepository.existsByEmail(data.email);
    if (userExists) {
      throw new UserWithEmailAlreadyExistsException(data.email);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const userData: UserCreationData = {
      email: data.email,
      password: hashedPassword,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await UserRepository.create(userData);
    } catch (err) {
      logger.error("Error while saving user: ", err);
      throw new InternalServerError();
    }

    const createdUser = await UserRepository.findByEmail(data.email);
    const profileData: ProfileCreationData = {
      firstName: data.first_name,
      lastName: data.last_name,
      phoneNumber: data.phone_number,
      userId: createdUser.id,
    };

    ProfileService.createProfile(profileData).catch((error) => {
      logger.error(
        `Failed to create profile for user ${createdUser.id}:`,
        error
      );
    });
  }

  static async getCurrentUser(authUser: AuthUser): Promise<UserModel> {
    const user = await UserRepository.findByEmail(authUser.name);
    if (!user) {
      throw new UserWithEmailNotFoundException(authUser.name);
    }
    return user;
  }

  static async getOnlineUserProfile(authUser: AuthUser): Promise<UserVM> {
    const user = await UserRepository.findByEmail(authUser.name);
    if (!user) {
      throw new UserWithEmailNotFoundException(authUser.name);
    }

    const profile = await ProfileRepository.findByUserId(user.id);
    if (!profile) {
      throw new ProfileNotFoundException(
        "Profile not found for current online user!"
      );
    }

    const userVM: UserVM = {
      email: user.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
      role: user.role,
    };

    return userVM;
  }

  static async getAllUsers(start: number, limit: number): Promise<UserModel[]> {
    return await UserRepository.getAllUsers(start, limit);
  }
}
