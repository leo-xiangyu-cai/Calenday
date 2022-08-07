export default class CalendarRequest {
  constructor(rawBody: string) {
    const body = JSON.parse(rawBody);
    this.code = body.code;
    this.calendarName = body.calendarName;
  }

  code: string;

  calendarName: string;
}
