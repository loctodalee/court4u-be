"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const init_nodemailer_1 = require("../lib/init.nodemailer");
const replaceHtml_1 = require("../util/replaceHtml");
const crypto_1 = __importDefault(require("crypto"));
const sendMail_template_1 = require("../template/sendMail.template");
const init_mailjet_1 = require("../lib/init.mailjet");
class EmailService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new EmailService();
        }
        return this.Instance;
    }
    generateRandomToken() {
        const token = crypto_1.default.randomInt(0, Math.pow(2, 32));
        return token;
    }
    sendEmailLinkVerify(_a) {
        return __awaiter(this, arguments, void 0, function* ({ html, toEmail, subject, text, }) {
            try {
                const mailOptions = {
                    from: '"Court4u" <thang336655@gmail.com>',
                    to: toEmail,
                    subject,
                    text,
                    html,
                };
                init_nodemailer_1.transport.sendMail(mailOptions, (err, info) => {
                    console.log(info);
                    if (err) {
                        console.error(err);
                    }
                    console.log('Message sent:: ', info.messageId);
                });
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    sendMailJect(_a) {
        return __awaiter(this, arguments, void 0, function* ({ html, toEmail, subject, text, attachment = undefined, }) {
            const data = {
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
            const result = yield init_mailjet_1.mailjet
                .post('send', { version: 'v3.1' })
                .request(data);
            const { Status } = result.body.Messages[0];
        });
    }
    sendEmailToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email }) {
            try {
                //1. get Token
                // const token = await this._otpService.newOtp({
                //   email,
                // });
                const token = this.generateRandomToken();
                //2. get template
                const template = sendMail_template_1.verifyTemplate;
                //3. replace content
                const params = {
                    link_verify: `http://localhost:8080/api/auth/welcome_back?token=${token}`,
                };
                const content = (0, replaceHtml_1.replacePlaceholder)(template, params);
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
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    sendEmailConfirmation(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, content, subject, attachment, }) {
            try {
                const token = this.generateRandomToken();
                //2. get template
                const template = sendMail_template_1.verifyTemplate;
                //3. replace content
                const params = {
                // link_verify: `http://localhost:8080/api/auth/welcome_back?token=${token}`,
                };
                // const content = replacePlaceholder(template, params);
                console.log('send email confirmation');
                yield this.sendMailJect({
                    html: content,
                    toEmail: email,
                    subject,
                    text: 'Court4u',
                    attachment,
                }).catch((error) => {
                    throw new Error(error);
                });
                return token;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.EmailService = EmailService;
