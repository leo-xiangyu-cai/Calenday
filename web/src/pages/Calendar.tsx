import React, {useEffect, useState} from "react";
import {CalenderRepository} from "../repositories/CalenderRepository";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";

interface CalendarProps {

}

export const Calendar: React.FC<CalendarProps> = (props) => {
  const navigate = useNavigate();
  const [calendars, setCalendars] = useState([]);
  useEffect(() => {
    console.log('useEffect');
    CalenderRepository.getCalendars().then((calendars) => {
      console.log('calendars:\n', calendars);
      setCalendars(calendars);
    });
  }, [])
  const addNewCalendar = () => {
    CalenderRepository.getNewUserUrl().then(url => {
      console.log('url:\n', url);
      // navigate("https://www.google.com.au");
      window.location.href = url;
    })
  }
  return <Main>
    <AddButton type="button" onClick={addNewCalendar} >Add a new calendar</AddButton>
    {calendars.map((calendar: any, index) => {
      return <div key={index}>{calendar.calendarName}</div>
    })}
  </Main>
};

const Main = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const AddButton = styled('button')`
  width: auto;
  height: 20px;
  margin: 50px 0;
`;
