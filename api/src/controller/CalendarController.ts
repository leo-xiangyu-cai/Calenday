import Router from 'koa-router';
import BaseService from '../service/BaseService';
import CalendarService from '../service/CalendarService';
import CalendarRequest from '../request/CalendarRequest';

const router = new Router();
const service = new BaseService();
const calendarService = new CalendarService();

router.get('/calendars/new-user-url', async (ctx) => {
  const url = calendarService.getAuthorizeUrl();
  service.generate200Ok(ctx, { url });
});
router.post('/calendars', async (ctx) => {
  const request = new CalendarRequest(ctx.request.rawBody);
  const result = await calendarService.requestTokenByCode(request.code, request.calendarName);
  if (result) {
    service.generate200Ok(ctx);
  } else {
    service.generate400RequestInvalid(ctx);
  }
});
router.get('/calendars', async (ctx) => {
  const calendars = await calendarService.getCalendars();
  service.generate200Ok(ctx, { calendars });
});
router.get('/calendars/:calendarId/event', async (ctx) => {
  // TODO save code in database with code and codeName
  const eventList = await calendarService.getEventList(
    ctx.params.calendarId,
    ctx.request.query.start as string,
    ctx.request.query.end as string,
  );
  service.generate200Ok(ctx, { events: eventList });
});
export default router;
