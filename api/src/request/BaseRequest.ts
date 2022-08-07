import { IsString, Length } from 'class-validator';

export default class BaseRequest {
  constructor() {
    this.testString = 'testString';
  }

  @IsString()
  @Length(10, 10)
  testString: string;
}
