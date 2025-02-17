import { Profile } from "@prisma/client";

export class ProfileModel implements Profile {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;

  constructor(profile: Profile) {
    this.id = profile.id;
    this.userId = profile.userId;
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.phoneNumber = profile.phoneNumber;
  }
}
