import React, {ChangeEvent, useEffect, useState} from "react";
import styled from "styled-components";
import {HiChevronLeft, HiChevronRight} from "react-icons/hi";
import DateManager from "../utils/DateManager";
import {IoIosArrowDropleft, IoIosArrowDropright, IoIosReturnLeft} from "react-icons/io";
import Calendar, {OnChangeDateCallback, OnChangeDateRangeCallback} from 'react-calendar';

interface CalendarSideBarProps {
  selectedMonday: Date,
  onSelectedMondayChanged: (selectedMonday: Date) => void
}

export const CalendarSideBar: React.FC<CalendarSideBarProps> = (props) => {
  const [selectedMonday, setSelectedMonday] = useState(props.selectedMonday)
  const [weekNumber, setWeekNumber] = useState(DateManager.getWeekNumber(props.selectedMonday))
  const [selectedDay, setSelectedDay] = useState(new Date())
  useEffect(() => {
    setWeekNumber(DateManager.getWeekNumber(selectedMonday));
    props.onSelectedMondayChanged(selectedMonday);
  }, [selectedMonday])
  return <Main>
    <WeekSelectorContainer>
      <Button onClick={() => {
        setSelectedMonday(DateManager.getWeekDays(new Date())[0]);
        setSelectedDay(new Date());
      }}>Today</Button>
      <IoIosArrowDropleft
        size={24}
        style={{
          cursor: "pointer",
          color: "gray"
        }}
        onClick={() => {
          setSelectedMonday(new Date(
            selectedMonday.getFullYear(),
            selectedMonday.getMonth(),
            selectedMonday.getDate() - 7,
          ));
        }}
      />
      <WeekNumber>Week {weekNumber}</WeekNumber>
      <IoIosArrowDropright
        size={24}
        style={{
          cursor: "pointer",
          color: "gray"
        }}
        onClick={() => {
          setSelectedMonday(new Date(
            selectedMonday.getFullYear(),
            selectedMonday.getMonth(),
            selectedMonday.getDate() + 7,
          ));
        }}
      />
      {/*<CurrentMonth>{DateManager.getMonthShortText(props.selectedMonday.getMonth())} 2022</CurrentMonth>*/}
    </WeekSelectorContainer>
    <DatePicker
      onChange={(value: Date, event: ChangeEvent<HTMLInputElement>) => {
        setSelectedDay(value)
        console.log('value:\n', value);
        console.log('event:\n', event);
      }}
      value={selectedDay}
      // activeStartDate={DateManager.getWeekDays(selectedDay)[0]}
      onDrillDown={(x) => {
        console.log('down:\n', x);
      }}
      onDrillUp={(x) => {
        console.log('up:\n', x);
      }}
    />
  </Main>
}

const Main = styled('div')`
  height: 100%;
  width: 17vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const WeekSelectorContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
`;
const Button = styled('div')`
  height: max-content;
  padding: 2px 5px;
  border: solid 2px lightgray;
  border-radius: 5px;
  cursor: pointer;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  :hover {
    border-color: black;
  }
`;
const WeekNumber = styled('div')`
  font-size: 1em;
  white-space: nowrap;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;
const CurrentMonth = styled('div')`
  font-size: 1em;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;
const DatePicker = styled(Calendar)`
`;
