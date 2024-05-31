import { users } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';
import { IUserService } from './iUser.service';
import { NotImplementError } from '../handleError/error.response';
import { IEmailService } from './iEmail.service';
import { EmailService } from './email.service';

export class UserService implements IUserService {
  private _emailService: IEmailService;
  constructor() {
    this._emailService = new EmailService();
  }
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

  // new customer
  public async newUser({ email }: { email: string }): Promise<any> {
    const user = await UserRepository.getInstance().getUserByEmail({ email });
    if (user) {
      throw new NotImplementError('Email already existed');
    }
    // send mail
    const result = await this._emailService.sendEmailToken({ email });
    console.log(result);

    return {
      message: 'Verify email user',
      data: result,
    };
  }
}
