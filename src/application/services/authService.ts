import { UserWithEmailNotFoundException } from "../../../src/infrastructure/exceptions/user/userExceptions";
import { Login } from "../../../src/interfaces/dtos/authDTO";
import { BadCredentialsException } from "../../../src/infrastructure/exceptions/auth/authenticationExceptions";
import { UserRepository } from "../../../src/domain/repository/userRepository";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export default class AuthService {
  static async login(data: Login): Promise<string> {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      throw new UserWithEmailNotFoundException(data.email);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new BadCredentialsException(
        "Invalid credentials were inserted. Please check your data and try again."
      );
    }

    return this.generateAccessToken(data.email);
  }

  static generateAccessToken(email: string): string {
    return jwt.sign({ name: email }, process.env.TOKEN_SECRET, {
      expiresIn: "48h",
    });
  }
}
