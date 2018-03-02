import React from "react";

class CheckTasks extends React.Component {

  render(){
    let { lesson, nextLesson, prevLesson, currentUnit, currentLesson, noOfLessons } = this.props;
    return(
      <div>
        <div>{lesson.title}</div>

        <div>{lesson.description}</div>

        <div>
          <span className={currentLesson === "0" ? "hidden" : ""}>
            <button
              onClick={prevLesson}
              value="next"
            >prev</button>
          </span>

          <span className={currentLesson == noOfLessons - 1 ? "hidden" : ""}>
            <button
              onClick={nextLesson}
              value="next"
            >next</button>
          </span>

        </div>

        <div>unit: {parseInt(currentUnit)+1}  current lesson: {parseInt(currentLesson)+1} of {noOfLessons}</div>

        {currentLesson === "0" ? "please begin the lesson" : ''}

        {parseInt(currentLesson)+1 === noOfLessons? "You finished the unit" : ''}

      </div>
    )
  }
}
export default CheckTasks;
