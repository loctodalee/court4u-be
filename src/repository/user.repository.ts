import { users } from "@prisma/client";
import prisma from "../lib/prisma";
import { IUserRepository } from "./iUser.repository";

export class UserRepository implements IUserRepository {
  private static Instance: UserRepository;
  public static getInstance(): UserRepository {
    if (!UserRepository.Instance) {
      UserRepository.Instance = new UserRepository();
    }
    return UserRepository.Instance;
  }

  //get user by id
  public async getUserById(id: string): Promise<users | null> {
    return await prisma.users.findFirst();
  }
  // get user by email
  public async getUserByEmail({
    email,
  }: {
    email: string;
  }): Promise<users | null> {
    return await prisma.users.findFirst({
      where: {
        email,
      },
    });
  }
}
