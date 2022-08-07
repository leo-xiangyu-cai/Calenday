import ErrnoException = NodeJS.ErrnoException;
import { CalendarToken, CalendarTokenEntity } from '../entity/CalendarToken';
import { CallbackError } from 'mongoose';

const { google } = require('googleapis');

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
];
export default class CalendarService {
  private clientSecret = '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';

  private clientId = '720363577434-f5tlcl88dod4fvohcrml31ajv651oin4.apps.googleusercontent.com';

  private redirectUri = 'http://localhost:3000/new-account';

  private oAuth2Client = new google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUri);

  getCalendars = async () => CalendarTokenEntity.find({}).exec();

  getAuthorizeUrl = () => this.oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  requestTokenByCode = async (code: string, calendarName: string) => {
    try {
      const response = await this.oAuth2Client.getToken(code);
      const { data, status } = response.res;
      if (status === 200) {
        this.oAuth2Client.setCredentials(data);
        const calendarTokenEntity = new CalendarTokenEntity({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          scope: data.scope,
          tokenType: data.token_type,
          expiryDate: data.expiry_date,
          calendarName,
        });
        await calendarTokenEntity.save();
        return true;
      }
      return false;

      console.log('response:\n', response);
      console.log('token:\n', response.tokens);
      console.log('res:\n', response.res);
      console.log('res.data:\n', response.res.data);
      console.log('res.status:\n', response.res.status);
    } catch (e) {
      return false;
    }
    // this.oAuth2Client.getToken(code, (err: ErrnoException | null, token: any) => {
    //   if (err) {
    //     throw new Error();
    //   }
    //   this.oAuth2Client.setCredentials(token);
    //   const calendarTokenEntity = new CalendarTokenEntity({
    //     accessToken: token.access_token,
    //     refreshToken: token.refresh_token,
    //     scope: token.scope,
    //     tokenType: token.token_type,
    //     expiryDate: token.expiry_date,
    //     calendarName,
    //   });
    //   calendarTokenEntity.save();
    // });
  };

  getEvents = (calendarId: string) => {
    this.authorize(calendarId, this.listEventsFunc);
  };

  private authorize = (calendarId: string, callback: any) => {
    CalendarTokenEntity.findOne({ _id: calendarId }, (err: CallbackError, result: CalendarToken) => {
      this.oAuth2Client.setCredentials({
        access_token: result.accessToken,
        refresh_token: result.refreshToken,
        scope: result.scope,
        token_type: result.tokenType,
        expiry_date: result.expiryDate,
      });
      callback();
    });
  };

  private listEventsFunc = () => {
    const auth = this.oAuth2Client;
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err: any, res: any) => {
      if (err) return console.log(`The API returned an error: ${err}`);
      const events = res.data.items;
      if (events.length) {
        console.log('Upcoming 10 events:');
        events.map((event: any) => {
          const start = event.start.dateTime || event.start.date;
          return console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log('No upcoming events found.');
      }
      return console.log('done');
    });
  };

  getEventList = async (CalendarTokenId: string, start: string, end: string) => {
    const token = await CalendarTokenEntity.findOne({ _id: CalendarTokenId }).exec();
    const auth = new google.auth.OAuth2(this.clientId, this.clientSecret, this.redirectUri);
    auth.setCredentials({
      access_token: token?.accessToken,
      refresh_token: token?.refreshToken,
      scope: token?.scope,
      token_type: token?.tokenType,
      expiry_date: token?.expiryDate,
    });
    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date(start)).toISOString(),
      timeMax: (new Date(end)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = res.data.items;
    if (events.length) {
      return events.map((event: any) => ({
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
      }));
    }
    return null;
  };
}
