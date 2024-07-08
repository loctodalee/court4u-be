import { SendEmailV3_1 } from 'node-mailjet';

export interface IEmailService {
  sendEmailLinkVerify({
    html,
    toEmail,
    subject,
    text,
  }: {
    html: any;
    toEmail: string;
    subject: string;
    text: string;
  }): Promise<any>;

  sendEmailToken({ email }: { email: string }): Promise<any>;
  sendEmailConfirmation({
    email,
    content,
    subject,
    attachment,
  }: {
    subject: string;
    email: string;
    content: string;
    attachment: SendEmailV3_1.InlinedAttachment[];
  }): Promise<any>;
}
