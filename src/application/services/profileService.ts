import { ProfileCreationData } from "../../../src/interfaces/dtos/profileDTO";
import { ProfileRepository } from "../../../src/domain/repository/profileRepository";
import { InternalServerError } from "../../../src/infrastructure/exceptions/exceptions";
import { logger } from "../../../src/infrastructure/config/logger";

export default class ProfileService {
  static async createProfile(data: ProfileCreationData): Promise<void> {
    try {
      await ProfileRepository.create(data);
    } catch (err) {
      logger.error("Error while saving profile: ", err);
      throw new InternalServerError();
    }
  }
}
