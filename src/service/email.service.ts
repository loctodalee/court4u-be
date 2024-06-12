import {
  BadRequestError,
  NotFoundError,
} from '../handleResponse/error.response';
import { transport } from '../lib/init.nodemailer';
import { replacePlaceholder } from '../util/replaceHtml';
import { IEmailService } from './interface/iEmail.service';
// import { IOtpService } from './iOtp.service';
import { ITemplateService } from './interface/iTemplate.service';
// import { OtpSerivce } from './otp.service';
import { TemplateService } from './template.service';
import crypto from 'crypto';
export class EmailService implements IEmailService {
  // private _otpService: IOtpService;
  private _templateService: ITemplateService;
  constructor() {
    // this._otpService = new OtpSerivce();
    this._templateService = new TemplateService();
  }
  private generateRandomToken(): number {
    const token = crypto.randomInt(0, Math.pow(2, 32));
    return token;
  }
  public async sendEmailLinkVerify({
    html,
    toEmail,
    subject,
    text,
  }: {
    html: any;
    toEmail: string;
    subject: string;
    text: string;
  }): Promise<any> {
    try {
      const mailOptions = {
        from: '"Court4u" <thang336655@gmail.com>',
        to: toEmail,
        subject,
        text,
        html,
      };
      transport.sendMail(mailOptions, (err, info) => {
        console.log(info);
        if (err) {
          console.error(err);
        }
        console.log('Message sent:: ', info.messageId);
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async sendEmailToken({ email }: { email: string }): Promise<any> {
    try {
      //1. get Token
      // const token = await this._otpService.newOtp({
      //   email,
      // });

      const token = this.generateRandomToken();
      //2. get template
      const template = await this._templateService.getTemplate({
        name: 'HTML EMAIL TOKEN',
      });
      if (!template) {
        throw new NotFoundError('Not found template');
      }

      //3. replace content
      const params = {
        link_verify: `http://localhost:3000/v1/api/auth/welcome_back?token=${token}`,
      };
      const content = replacePlaceholder(template.tem_html, params);
      console.log('send email link verify');
      this.sendEmailLinkVerify({
        html: content,
        toEmail: email,
        subject: 'Verify your email',
        text: 'Verify',
      }).catch((error) => {
        throw new Error(error);
      });
      return token;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
