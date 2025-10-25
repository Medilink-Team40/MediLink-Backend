import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class NodemailerService {
  private readonly logger = new Logger(NodemailerService.name);
  private transporter: Mail;

  constructor(private configService: ConfigService) {
    const mailConfig = this.configService.get('notification.nodemailer');

    if (!mailConfig || !mailConfig.host || !mailConfig.auth.user || !mailConfig.auth.pass) {
      this.logger.error('Nodemailer configuration is incomplete. Email sending may fail.');
      // Optionally throw an error or disable the service if credentials are critical
    } else {
      this.transporter = nodemailer.createTransport({
        host: mailConfig.host,
        port: mailConfig.port,
        secure: mailConfig.secure,
        auth: {
          user: mailConfig.auth.user,
          pass: mailConfig.auth.pass,
        },
        service: mailConfig.service, // Añadir la propiedad service
      });

      this.transporter.verify((error) => {
        if (error) {
          this.logger.error('Error verifying Nodemailer transporter:', error.message);
        } else {
          this.logger.log('Nodemailer transporter ready for sending emails.');
        }
      });
    }
  }

  async sendMail(to: string, subject: string, html: string): Promise<any> {
    if (!this.transporter) {
      this.logger.error('Nodemailer transporter not initialized due to missing configuration.');
      throw new Error('Nodemailer service not available.');
    }
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('notification.nodemailer.auth.user'),
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw error;
    }
  }
}
