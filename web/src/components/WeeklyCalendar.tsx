import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import DateManager from "../utils/DateManager";
import {CalenderRepository} from "../repositories/CalenderRepository";
import {CalendarStoreImpl, IEvent} from "./CalendarStore";
import {observer} from 'mobx-react';
import {EventDetail} from "./EventDetail";
import {CalendarSideBar} from "./CalendarSideBar";

interface CalendarProps {

}

const width = 90;
const height = 80;
const itemHeight = height / 10;
const itemWith = width / 8;
const baseTop = itemHeight;
const baseLeft = itemWith;

interface CalendarProps {
  calendarStore: CalendarStoreImpl
}

export const WeeklyCalendar: React.FC<CalendarProps> = observer(({calendarStore}) => {
  const today = new Date();
  const totalItemCount = 8 * 24;
  const tableRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weekDays, setWeekDays] = useState(DateManager.getWeekDays(today));
  useEffect(() => {
    (tableRef.current as any).scrollTo({
      top: window.innerHeight * (itemHeight * 9.5) / 100
    });
    refreshCalendar();
  }, []);

  const mergeEvents = (allEvents: IEvent[]) => {
    for (let i = 1; i < allEvents.length; i++) {
      const preEvent = allEvents[i - 1];
      const currentEvent = allEvents[i];
      if (preEvent && currentEvent) {
        if (isConflict(preEvent, currentEvent)) {
          const numberOfConflict = (itemWith / preEvent.width + 1)
          for (let j = 0; j < numberOfConflict; j++) {
            const item = allEvents[i - numberOfConflict + j + 1];
            item.width = itemWith / numberOfConflict;
            item.left = baseLeft + (item.startTime.getDay() - 1) * itemWith + itemWith * j / numberOfConflict;
          }
        } else {
          for (let j = i - 2; j >= 0; j--) {
            const item = allEvents[j];
            if (isConflict(item, currentEvent)) {
              currentEvent.width = item.width;
              currentEvent.left = item.left + item.width;
              break;
            }
          }
        }
      }
    }
  }
  const isConflict = (firstEvent: IEvent, secondEvent: IEvent): boolean => {
    return firstEvent.left >= secondEvent.left && firstEvent.left <= secondEvent.left + itemWith
      && secondEvent.top - firstEvent.top < firstEvent.height
  }
  const refreshCalendar = (selectedMonday: Date = new Date()) => {
    setIsLoading(true);
    const newWeekDay = DateManager.getWeekDays(selectedMonday);
    setWeekDays(newWeekDay);
    CalenderRepository.getCalendars().then(async calendars => {
        const allEvents: IEvent[] = []
        for (const calendar of calendars) {
          const it = await CalenderRepository.getEvents(
            calendar._id,
            `${newWeekDay[0].getFullYear()}-${newWeekDay[0].getMonth() + 1}-${newWeekDay[0].getDate()}`,
            `${newWeekDay[6].getFullYear()}-${newWeekDay[6].getMonth() + 1}-${newWeekDay[6].getDate()}`,
          );
          it.forEach((event: any) => {
              const start = new Date(event.start.dateTime);
              const end = new Date(event.end.dateTime);
              const duration = (end.getTime() - start.getTime()) / (3600 * 1000);
              let fontSize = 1
              if (duration >= 0 && duration < 0.1) {
                fontSize = 0
              } else if (duration >= 0.1 && duration < 0.5) {
                fontSize = 0.9
              } else if (duration >= 0.5 && duration < 1) {
                fontSize = 0.95
              } else if (duration >= 1 && duration < 2) {
                fontSize = 1
              } else if (duration >= 2 && duration < 24) {
                fontSize = 1.2
              }
              const eventViewModel: IEvent = {
                left: baseLeft + (start.getDay() - 1) * itemWith,
                top: baseTop + (start.getHours() - 1 + start.getMinutes() / 60) * itemHeight,
                originalLeft: baseLeft + (start.getDay() - 1) * itemWith,
                originalTop: baseTop + (start.getHours() - 1 + start.getMinutes() / 60) * itemHeight,
                summary: event.summary,
                description: event.description,
                width: itemWith,
                height: duration * itemHeight,
                originalWidth: itemWith,
                originalHeight: duration * itemHeight,
                fontSize: fontSize,
                start: start.toTimeString(),
                end: end.toTimeString(),
                startTime: start,
                endTime: end,
                color: calendar.calendarName === 'leocxy17@gmail.com' ? '#F87431' : '#13b97e',
                isHighlighted: false,
                isOpened: false,
                calendarName: calendar.calendarName
              }
              allEvents.push(eventViewModel)
            }
          )
          ;
        }
        allEvents.sort((a, b) => {
          if (a.left < b.left) return -1;
          if (a.left > b.left) return 1;
          if (a.top < b.top) return -1;
          if (a.top > b.top) return 1;
          if (a.height > b.height) return -1;
          if (a.height < b.height) return 1;
          return 0;
        })
        mergeEvents(allEvents);
        calendarStore.setEvents(allEvents);
        setIsLoading(false);
      }
    )
    ;
  }
  return <Body>
    <LeftSection>
      <CalendarSideBar
        selectedMonday={weekDays[0]}
        onSelectedMondayChanged={(selectedMonday) => {
          refreshCalendar(selectedMonday)
        }}
      />
    </LeftSection>
    <Main>
      {
        isLoading && <Loading>Loading...</Loading>
      }
      <TableHeader>
        <BaseBox style={{border: 'none'}}/>
        {
          weekDays.map((item, index) => {
            return <HeaderBox key={index} style={{
              color: item.toDateString() === today.toDateString() ? 'blue' : 'black'
            }}>
              <HeaderDay> {DateManager.getMonthShortText(item.getMonth())} {item.getDate()} </HeaderDay>
              <HeaderWeek> {DateManager.getWeekShortText(item.getDay())} </HeaderWeek>
            </HeaderBox>
          })
        }
      </TableHeader>
      <TableBody ref={tableRef} onClick={() => {
        calendarStore.closeAllEvents();
      }}>
        <GridContainer>
          {
            [...Array(totalItemCount)].map((elementInArray, index) => (
              index % 8 !== 0
                ? <BaseBox key={index}/>
                : <TimeBox key={index}>
                  <Time style={{
                    transform: index / 8 === 0 ? 'translateY(0)' : 'translateY(-50%)'
                  }}>
                    {`${String(index / 8).padStart(2, '0')}:00`}
                  </Time>
                </TimeBox>
            ))
          }
        </GridContainer>
        {
          !isLoading && calendarStore.events?.map((event, index) => {
            return <EventContainer
              key={index}
              style={{
                top: `${event.top}vh`,
                left: `${event.left}vw`,
                height: `${event.height}vh`,
                width: `${event.width}vw`,
                zIndex: event.isOpened ? '100' : '1',
              }}
            >
              <EventView
                style={{
                  backgroundColor: event.color,
                  color: 'white',
                  boxShadow: event.isOpened ? '0 0 15px gray' : 'None',
                  border: 'solid 2px white',
                  fontSize: `${event.fontSize}em`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  calendarStore.openEvent(index);
                }}
              >
                <EventTitle>
                  {event.summary}
                </EventTitle>
                <EventTime>
                  {DateManager.getTimeText(event.startTime)}
                </EventTime>
              </EventView>
              {event.isOpened &&
                <EventDetail
                  title={event.summary}
                  description={event.description}
                  left={event.width}
                  start={event.startTime}
                  end={event.endTime}
                  onClose={() => {
                    calendarStore.closeEvent(index)
                  }}
                  calendar={event.calendarName}
                  color={event.color}
                />
              }
            </EventContainer>
          })
        }
      </TableBody>
    </Main>
  </Body>

})
const Body = styled('div')`
  width: 100%;
  display: flex;
  font-family: Roboto, Arial, sans-serif;;
`;
const Loading = styled('div')`
  font-size: 1.5em;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const Main = styled('div')`
`;
const LeftSection = styled('div')`
  width: ${100 - width}vw;
  margin-top: 5vh;
  height: 90vh;
  z-index: 100;
`;
const TableHeader = styled('div')`
  width: ${width}vw;
  margin: 0 auto;
  display: flex;
  text-overflow: ellipsis;
`;
const TableBody = styled('div')`
  width: ${width}vw;
  height: ${height}vh;
  margin: 0 auto;
  position: relative;
  overflow-y: scroll;
`;
const BaseBox = styled('div')`
  display: flex;
  flex-direction: column;
  width: ${itemWith}vw;
  height: ${itemHeight}vh;
  text-align: center;
  justify-content: center;
  align-items: center;
  border: solid 1px #e9ebec;
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box; /* Firefox, other Gecko */
  box-sizing: border-box; /* Opera/IE 8+ */
  background-color: transparent;
`;
const HeaderBox = styled(BaseBox)`
  border: none;
`;
const TimeBox = styled(BaseBox)`
  border: none;
  justify-content: start;
  align-items: end;
  text-align: right;
  padding-right: 5px;
`;
const GridContainer = styled('div')`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(8, auto);
  gap: 0;
`;
const HeaderWeek = styled('div')`
  font-size: 1.4em;
`;
const HeaderDay = styled('div')`
  font-size: 1em;
`;
const EventContainer = styled(BaseBox)`
  width: ${itemWith}vw;
  position: absolute;
  z-index: 9;
  border: none;
  background-color: transparent;
`;
const EventView = styled('div')`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: default;
  width: 100%;
  height: 100%;
  margin: 2px 0;
  border-radius: 5px;
  -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
  -moz-box-sizing: border-box; /* Firefox, other Gecko */
  box-sizing: border-box; /* Opera/IE 8+ */
  z-index: 5;
`;
const EventTitle = styled('div')`
  width: 90%;
  font-size: 1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  justify-content: center;
`;
const EventTime = styled('div')`
  width: 90%;
  font-size: 0.8em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
`;
const Time = styled('div')`
  transform: translateY(-50%);
  position: absolute;
  font-size: 1em;
  z-index: 5;
`;
