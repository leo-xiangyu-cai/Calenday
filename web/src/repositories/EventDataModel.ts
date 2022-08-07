export interface EventDataModel {
  summary: string;
  description: string;
  start: EventDateTimeDataModel
  end: EventDateTimeDataModel
}

export interface EventDateTimeDataModel {
  dateTime: string;
  timeZone: string;
}
