import { model, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Environment } from '../Constants';
import { getConfig } from '../Configs';

const collectionName = 'calendar_token';

export interface CalendarToken {
  accessToken: string;
  refreshToken: string;
  scope: string;
  tokenType: string;
  expiryDate: number;
  calendarName: string;
}

const calendarTokenSchema = new Schema<CalendarToken>({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  scope: { type: String, required: true },
  tokenType: { type: String, required: true },
  expiryDate: { type: Number, required: true },
  calendarName: { type: String, required: true },
});

export const CalendarTokenEntity = model<CalendarToken>(
  getConfig().env === Environment.UNIT_TEST
    ? `${collectionName}-${uuid()}`
    : `${collectionName}`, calendarTokenSchema,
);
