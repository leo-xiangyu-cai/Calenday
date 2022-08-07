import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useNavigate, useSearchParams} from "react-router-dom";
import {CalenderRepository} from "../repositories/CalenderRepository";

interface NewCalendarAccountProps {

}

export const NewCalendarAccount: React.FC<NewCalendarAccountProps> = (props) => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [params] = useSearchParams();
  return <Main>
    <div>Create a name for your calendar</div>
    <div>{params.get('token')}</div>
    <input type='text'
           value={name}
           onChange={(event) => {
             setName(event.target.value);
           }}/>
    <button onClick={async () => {
      CalenderRepository.createNewCalender(name, params.get('code'))
        .then(() => {
          alert("Yes");
        })
        .catch(() => {
          alert('No');
        })
        .finally(() => {
          navigate('/calendars');
        });
    }
    }>Save
    </button>
    <button>Cancel</button>
  </Main>
}
const Main = styled('div')`
  width: max(30vw, 700px);
  height: 50vh;
  margin: 25vh auto auto auto;
  background-color: aquamarine;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

