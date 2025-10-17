import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private twilioClient: twilio.Twilio;
  private twilioPhoneNumber: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>(
      'notification.twilio.accountSid',
    );
    const authToken = this.configService.get<string>(
      'notification.twilio.authToken',
    );
    const phoneNumber = this.configService.get<string>(
      'notification.twilio.phoneNumber',
    );

    if (!accountSid || !authToken || !phoneNumber) {
      this.logger.error(
        'Twilio credentials are not fully configured. SMS sending may fail.',
      );
      // Optionally throw an error or disable the service if credentials are critical
    } else {
      this.twilioClient = new twilio.Twilio(accountSid, authToken);
      this.twilioPhoneNumber = phoneNumber;
    }
  }

  async sendSms(to: string, body: string): Promise<any> {
    if (!this.twilioClient) {
      this.logger.error(
        'Twilio client not initialized due to missing credentials.',
      );
      throw new Error('Twilio service not available.');
    }
    try {
      const message = await this.twilioClient.messages.create({
        body,
        to,
        from: this.twilioPhoneNumber,
      });
      this.logger.log(`SMS sent to ${to}: ${message.sid}`);
      return message;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Failed to send SMS to ${to}: ${error.message}`);
      } else {
        this.logger.error(
          `Failed to send SMS to ${to}: An unknown error occurred`,
        );
      }
      throw error;
    }
  }
}
