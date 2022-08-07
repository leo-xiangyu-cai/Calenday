import {action, makeObservable, observable} from "mobx";
import exp from "constants";

export interface IEvent {
  left: number;
  top: number;
  height: number;
  width: number;
  originalWidth: number;
  originalHeight: number;
  originalLeft: number;
  originalTop: number;
  summary: string;
  description: string;
  fontSize: number;
  start: string,
  end: string,
  startTime: Date,
  endTime: Date,
  color: string,
  isHighlighted: boolean,
  isOpened: boolean,
  calendarName: string,
}

export interface ICalendar {
  name: string;
  events: IEvent[];
}

export class CalendarStoreImpl {
  calendars: ICalendar[] = [];
  events: IEvent[] = [];

  constructor() {
    makeObservable(this, {
      calendars: observable,
      events: observable,
      addCalendar: action,
      setEvents: action,
      openEvent: action,
      closeEvent: action,
      closeAllEvents: action,
    });
  }

  addCalendar(calendar: ICalendar) {
    this.calendars.push(calendar);
  }

  setEvents(events: IEvent[]) {
    this.events = events;
  }

  addEvent(event: IEvent) {
    this.events.push(event)
  }

  openEvent(index: number) {
    this.events?.map((event, tempIndex) => {
      if (tempIndex === index) {
        event.isOpened = !event.isOpened;
      } else {
        event.isOpened = false;
      }
    })
  }

  closeEvent(index: number) {
    this.events[index].isOpened = false
  }

  closeAllEvents() {
    this.events.map(event => {
      event.isOpened = false;
    })
  }
}

export const CalendarStore = new CalendarStoreImpl();
