import { BadRequestError, NotFoundError } from '../handleError/error.response';
import { transport } from '../lib/init.nodemailer';
import { replacePlaceholder } from '../util/replaceHtml';
import { IEmailService } from './iEmail.service';
import { IOtpService } from './iOtp.service';
import { ITemplateService } from './iTemplate.service';
import { OtpSerivce } from './otp.service';
import { TemplateService } from './template.service';
export class EmailService implements IEmailService {
  private _otpService: IOtpService;
  private _templateService: ITemplateService;
  constructor() {
    this._otpService = new OtpSerivce();
    this._templateService = new TemplateService();
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
      const token = await this._otpService.newOtp({
        email,
      });

      //2. get template
      const template = await this._templateService.getTemplate({
        name: 'HTML EMAIL TOKEN',
      });
      if (!template) {
        throw new NotFoundError('Not found template');
      }

      //3. replace content
      const params = {
        link_verify: `http://localhost:3055/v1/api/user/welcome_back?token=${token.otpToken}`,
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
      return 1;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
