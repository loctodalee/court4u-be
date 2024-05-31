import nodemailer from 'nodemailer';
export const transport = nodemailer.createTransport({
  host: 'email-smtp.ap-southeast-1.amazonaws.com',
  port: 465,
  secure: true,
  auth: {
    user: 'AKIA6ODU6S3SNLDNT6S5',
    pass: 'BL4XQeqyRFwEmmv4/YcOYdWtSM8nL3rkZhmIHqZV/dd4',
  },
});
