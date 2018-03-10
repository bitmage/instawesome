import React from 'react';
import { Checkbox } from 'react-mdl';
import '../../Styles/LmsComponentsStyles.css';

export const CheckBox = ({isCheckMarked, checkBox}) => {
  return (
    <Checkbox
      type="checkbox"
      checked={isCheckMarked}
      onChange={checkBox}
    />
  )
}



export const LessonIcon = ({lesson, currentValues, userProg, i}) => {

  const iconClickHandler = (e) => {
    if(!userProg[currentValues.currentUnitObj.id].lessons[lesson.id].lessonLocked){
      console.log("Was clicked", e)
    }

  }

  return(
    <div
      className="lessonIconContainer"
      onClick={e => iconClickHandler(e)}
    >
      <div
        className={userProg[currentValues.currentUnitObj.id].lessons[lesson.id].lessonLocked ? "red" : "green"}
      ></div>
      {lesson.id}
    </div>
)}
