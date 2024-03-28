import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";

const JWT_SECRET_KEY = "Helloworld91@";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface getUserPayload {
  email: string;
  password: string;
}

export class UserService {
  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      },
    });
  }

  private static getUserByEmail(email: string){
    return prismaClient.user.findUnique({where: {email}})
  }

  private static hashPassword(password: string, salt: string){
    const makeHashPassowrd = createHmac("sha256", salt).update(password).digest("hex");
    return makeHashPassowrd;
  }

  public static async getUserToken(payload: getUserPayload) {
    const {email, password } = payload;
    const user = await UserService.getUserByEmail(email);
    if(!user) throw new Error("404: User does not exist");
    const userSalt = user.salt;
   const hashPassword = await UserService.hashPassword(password, userSalt);
    if(hashPassword !== user.password) throw new Error("401: Unauthorized User");

    // create token for user
    const token = JWT.sign({id: user.id, email: user.email},JWT_SECRET_KEY )
    return token;
  }

  public static decodeJWTtoken(token: string){
    return JWT.verify(token, JWT_SECRET_KEY);
  }
}
