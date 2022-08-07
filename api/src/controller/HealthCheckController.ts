import Router from 'koa-router';
import BaseService from '../service/BaseService';
import { HealthEntity } from '../entity/Health';
import { getConfig } from '../Configs';
import { Environment } from '../Constants';
import ErrnoException = NodeJS.ErrnoException;
import * as path from 'path';
import CalendarService from '../service/CalendarService';

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const router = new Router();
const service = new BaseService();
const calendarService = new CalendarService();

router.redirect('', '/connection-check');

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client: any, callback: any) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code: string) => {
    rl.close();
    oAuth2Client.getToken(code, (err: ErrnoException | null, token: any) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (error: any) => {
        if (error) return console.error(error);
        return console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
      return console.log('done');
    });
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials: any, callback: any) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0],
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err: any, token: any) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
    return console.log('done');
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth: any) {
  const calendar = google.calendar({ version: 'v3', auth });
  const start = (new Date('2022-5-29')).toISOString();
  console.log('start:\n', start);
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date('2022-5-29')).toISOString(),
    maxResults: 50,
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
}
router.get('/test', async (ctx) => {
  // Load client secrets from a local file.
  const credentials = path.resolve(__dirname, './credentials.json');
  console.log('credentials:\n', credentials);
  fs.readFile(credentials, (err: any, content: any) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
    return console.log('done');
  });

  service.generate200Ok(ctx);
});

router.get('/calendar', async (ctx) => {
  service.generate200Ok(ctx);
});
router.get('/url', async (ctx) => {
  const url = await calendarService.getAuthorizeUrl();
  service.generate200Ok(ctx, { url });
});

router.get('/connection-check', async (ctx) => {
  const healthEntity = new HealthEntity({
    message: 'connection check test',
  });
  try {
    await healthEntity.save();
    const insertedHealthEntity = await HealthEntity.findOne({ id: healthEntity.id }).exec();
    const data = {
      serviceName: getConfig().serviceName,
      environment: getConfig().env,
      versionNumber: getConfig().versionNumber,
      versionCode: getConfig().versionCode,
      db: '',
      dbStatus: insertedHealthEntity ? 'connected' : 'disconnected',
    };
    if (getConfig().env !== Environment.UNIT_TEST_DOCKER
      && getConfig().env !== Environment.UNIT_TEST) {
      const dbConnection = process.env.DB_CONNECTION as string;
      data.db = dbConnection.substr(dbConnection.indexOf('@') + 1);
    }
    service.generate200Ok(ctx, data);
  } catch (e) {
    service.generate200Ok(ctx, {
      serviceName: getConfig().serviceName,
      environment: getConfig().env,
      versionNumber: getConfig().versionNumber,
      versionCode: getConfig().versionCode,
      dbStatus: e,
    });
  }
});

export default router;
