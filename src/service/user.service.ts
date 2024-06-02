import { users } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';
import { IUserService } from './iUser.service';
import {
  NotFoundError,
  NotImplementError,
} from '../handleError/error.response';
import { IEmailService } from './iEmail.service';
import { EmailService } from './email.service';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

export class UserService implements IUserService {
  public async getUserById(id: string): Promise<users | undefined> {
    var user: users | null = null;
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
