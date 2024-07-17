import { transport } from '../lib/init.nodemailer';
import { replacePlaceholder } from '../util/replaceHtml';
import { IEmailService } from './interface/iEmail.service';

import crypto from 'crypto';
import { verifyTemplate } from '../template/sendMail.template';
import { LibraryResponse, SendEmailV3_1 } from 'node-mailjet';
import { mailjet } from '../lib/init.mailjet';
export class EmailService implements IEmailService {
  private static Instance: EmailService;
  public static getInstance(): IEmailService {
    if (!this.Instance) {
      this.Instance = new EmailService();
    }
    return this.Instance;
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

  public async sendMailJect({
    html,
    toEmail,
    subject,
    text,
    attachment = undefined,
  }: {
    html: any;
    toEmail: string;
    subject: string;
    text: string;
    attachment?: SendEmailV3_1.InlinedAttachment[];
  }): Promise<any> {
    const data: SendEmailV3_1.Body = {
      Messages: [
        {
          From: {
            Email: '"Court4u" <loctodale.service@gmail.com>',
          },
          To: [
            {
              Email: toEmail,
            },
          ],
          Subject: subject,
          HTMLPart: html,
          TextPart: text,
          InlinedAttachments: attachment,
        },
      ],
    };
    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
      .post('send', { version: 'v3.1' })
      .request(data);
    const { Status } = result.body.Messages[0];
  }

  public async sendEmailToken({ email }: { email: string }): Promise<any> {
    try {
      //1. get Token
      // const token = await this._otpService.newOtp({
      //   email,
      // });

      const token = this.generateRandomToken();
      //2. get template
      const template = verifyTemplate;
      const host = process.env.HOST;
      //3. replace content
      const params = {
        link_verify: `${host}/api/auth/welcome_back?token=${token}`,
      };
      const content = replacePlaceholder(template, params);
      console.log('send email link verify');
      this.sendMailJect({
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

  public async sendEmailTokenStaff({ email }: { email: string }): Promise<any> {
    try {
      //1. get Token
      const token = this.generateRandomToken();
      //2. get template
      const template = verifyTemplate;
      const host = process.env.HOST;
      //3. replace content
      const params = {
        link_verify: `${host}/api/auth/staff/welcome_back?token=${token}`,
      };
      const content = replacePlaceholder(template, params);
      console.log('send email link verify');
      this.sendMailJect({
        html: content,
        toEmail: email,
        subject: 'Verify your email to become a staff',
        text: 'Verify',
      }).catch((error) => {
        throw new Error(error);
      });
      return token;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  public async sendEmailConfirmation({
    email,
    content,
    subject,
    attachment,
  }: {
    subject: string;
    email: string;
    content: string;
    attachment: SendEmailV3_1.InlinedAttachment[];
  }): Promise<any> {
    try {
      const token = this.generateRandomToken();
      //2. get template
      const template = verifyTemplate;
      //3. replace content
      const params = {
        // link_verify: `http://localhost:8080/api/auth/welcome_back?token=${token}`,
      };
      // const content = replacePlaceholder(template, params);
      console.log('send email confirmation');
      await this.sendMailJect({
        html: content,
        toEmail: email,
        subject,
        text: 'Court4u',
        attachment,
      }).catch((error) => {
        throw new Error(error);
      });
      return token;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
