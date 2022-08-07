import { model, Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Environment } from '../Constants';
import { getConfig } from '../Configs';

const collectionName = 'Health';

export interface Health {
  id: string;
  message: string;
}

const healthSchema = new Schema<Health>({
  id: { type: String, default: () => uuid() },
  message: { type: String, required: true },
});

export const HealthEntity = model<Health>(
  getConfig().env === Environment.UNIT_TEST
    ? `${collectionName}-${uuid()}`
    : `${collectionName}`, healthSchema,
);
