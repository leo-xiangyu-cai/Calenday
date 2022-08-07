import { IsBoolean, IsString, Length } from 'class-validator';

export default class HealthCheckRequest {
  constructor(rawBody: string) {
    const body = JSON.parse(rawBody);
    this.message = body.message;
    this.isCheckingDatabase = body.isCheckingDatabase;
  }

  @IsString()
  @Length(6, 100)
  message!: string;

  @IsBoolean()
  isCheckingDatabase: boolean = false;
}
