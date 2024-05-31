import { users } from "@prisma/client";

export interface IUserRepository {
  getUserById(id: string): Promise<users | null>;
  getUserByEmail({ email }: { email: string }): Promise<users | null>;
}
