import React from 'react';
import {NewCalendarAccount} from "./pages/NewCalendarAccount";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {WeeklyCalendar} from "./components/WeeklyCalendar";
import {Calendar} from "./pages/Calendar";
import {CalendarStore} from "./components/CalendarStore";
import 'react-calendar/dist/Calendar.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<>Home</>}> </Route>
        <Route path="/new-account" element={<NewCalendarAccount/>}> </Route>
        <Route path="/calendar" element={<WeeklyCalendar calendarStore={CalendarStore}/>}> </Route>
        <Route path="/calendars" element={<Calendar/>}> </Route>
        <Route path="*" element={<>404</>}/>
      </Routes>
    </BrowserRouter>);
}

export default App;
