import axiosInstance from "./axios";
import {EventDataModel} from "./EventDataModel";

class CalenderRepositoryImpl {
  getEvents = async (id: string, start: string, end: string) => {
    const response = await axiosInstance.get(`/calendars/${id}/event?start=${start}&end=${end}`);
    if (response.data.data.events) {
      return response.data.data.events.map((it: any) => {
        return ({
          summary: it.summary,
          description: it.description,
          start: {
            dateTime: it.start.dateTime,
            timeZone: it.start.timeZone
          },
          end: {
            dateTime: it.end.dateTime,
            timeZone: it.end.timeZone
          },
        } as EventDataModel);
      });
    }
    return [];
  }

  createNewCalender = (calendarName: string, code: string | null) =>
    new Promise<void>((resolve, reject) => {
      if (code) {
        axiosInstance.post('/calendars', {code, calendarName}).then(response => {
            response.status === 200 ? resolve() : reject();
          }
        ).catch(err => {
          reject();
        })
      } else {
        reject();
      }
    })

  getCalendars = async () => {
    const response = await axiosInstance.get('/calendars');
    return response.data.data.calendars;
  }

  getNewUserUrl = async () => {
    const response = await axiosInstance.get('/calendars/new-user-url');
    console.log('response:\n', response);
    return response.data.data.url;
  }
}

export const CalenderRepository = new CalenderRepositoryImpl();
