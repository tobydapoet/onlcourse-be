import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });
  }
  async sendEmail(options: { to: string; sub: string; text: string }) {
    return await this.transporter.sendMail({
      from: 'OnlCourse',
      to: options.to,
      subject: options.sub,
      text: options.text,
    });
  }
}
