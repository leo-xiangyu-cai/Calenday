import React from "react";
import {observer} from "mobx-react";
import styled from "styled-components";
import {RiCloseLine, RiDeleteBin2Line, RiEditBoxLine} from "react-icons/ri";
import {TiDocumentText} from "react-icons/ti";
import {BsTextLeft} from "react-icons/bs";
import {IoMdSquare} from "react-icons/io";
import {HiOutlineMail} from "react-icons/hi";
import {MdEmail} from "react-icons/md";
import DateManager from "../utils/DateManager";


interface EventDetailProps {
  left: number,
  title: string,
  description: string,
  start: Date,
  end: Date,
  calendar: string,
  color: string
  onClose: () => void,
}

export const EventDetail: React.FC<EventDetailProps> = (props) => {
  const description = props.description?.replaceAll('\n', '<br/>')
    .replaceAll(/>http[^>]*<\/a>/g, ">link</a>")

  return <EventDetailContainer
    onClick={(e) => {
      e.stopPropagation();
    }}
    style={{
      left: `${props.left}vw`
    }}>
    <Header>
      <ButtonContainer>
        <RiEditBoxLine size={24} style={{margin: '1vh 0.5vw 1vh 0.5'}}/>
        <RiDeleteBin2Line size={24} style={{margin: '1vh 1vw 1vh 0'}}/>
      </ButtonContainer>
    </Header>
    <LineContainer>
      <IconContainer><MdEmail size={24} color={props.color}/></IconContainer>
      <Title>{props.title}</Title>
    </LineContainer>
    <LineContainer>
      <IconContainer></IconContainer>
      <Time>{DateManager.getPeriodDateText(props.start, props.end)}</Time>
    </LineContainer>
    <LineContainer>
      <IconContainer></IconContainer>
      <CalendarName style={{color: props.color}}>{props.calendar}</CalendarName>
    </LineContainer>
    {
      description &&
      <LineContainer style={{alignItems: 'start'}}>
        <IconContainer><BsTextLeft size={24}/></IconContainer>
        <Description dangerouslySetInnerHTML={{__html: description}}/>
      </LineContainer>
    }
  </EventDetailContainer>
}

const EventDetailContainer = styled('div')`
  font-family: Roboto, Arial, sans-serif;;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: start;
  min-width: 18vw;
  max-width: 20vw;
  max-height: 60vh;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 20px 20px 50px rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  border-left: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  backdrop-filter: blur(5px);
  overflow-y: scroll;
  padding: 0 0 2vh 0;
`;
const LineContainer = styled('div')`
  width: 100%;
  display: flex;
  margin-top: 10px;
  align-items: center;
`;

const IconContainer = styled('div')`
  width: 10%;
  margin-left: 5%;
  display: flex;
`;

const Title = styled('div')`
  width: 80%;
  font-size: 1.3em;
  text-align: left;
`;
const Time = styled('div')`
  width: 80%;
  font-size: 1em;
  text-align: left;
  opacity: 0.8;
`;
const CalendarName = styled('div')`
  width: 80%;
  font-size: 1em;
  text-align: left;
  opacity: 0.9;
`;
const Description = styled('div')`
  width: 80%;
  font-size: 1em;
  text-align: left;
  font-family: Roboto, Arial, sans-serif;
  letter-spacing: .2px;
  line-height: 20px;
  color: #3c4043;
`;
const Header = styled('div')`
  width: 100%;
  text-align: right;
`;
const ButtonContainer = styled('div')`
  display: inline;
`;
