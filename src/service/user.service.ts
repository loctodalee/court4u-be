import { User } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';

export interface IUserService {
  getUserById(id: string): Promise<User | undefined>;
}

export class UserService implements IUserService {
  public async getUserById(id: string): Promise<User | undefined> {
    var user: User | null = null;
    await UserRepository.getInstance()
      .getUserById(id)
      .then((u) => {
        user = u;
      });
    if (user != null) {
      return user;
    }
  }
}
