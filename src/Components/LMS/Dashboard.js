import React from 'react';
import configUnitCards from '../../config/unitCards';
import configUserProgess from '../../config/userProgress';
import LmsCard from '../Reusable/LmsCard';
import '../../Styles/LmsCardsStyles.css';
import LessonContent from './LessonContent';
import { connect } from 'react-redux';
import { getLmsContent } from '../../redux/actions/lmsContent';
import { getUserProgress } from '../../redux/actions/userProgress';


class Dashboard extends React.Component {
  constructor(props){
    super(props)
    this.state= {
      active: null,
      tasks: [],
      readyForRender: false,
      currentUnit: '',
      currentUnitName: '', /* set equal to active for now*/
      currentLesson: '',
      currentLessonName: '', /*not in yet*/
      currentLessonObj: {},
      currentQuestion: '', /*not in yet string num*/
      currentQuestionName: '',
      currentQuestionObj: {},
    }
    this.selectCardOnClick = this.selectCardOnClick.bind(this)
    this.combineUserDataAndTaskData = this.combineUserDataAndTaskData.bind(this);
    this.nextLesson = this.nextLesson.bind(this);
    this.prevLesson = this.prevLesson.bind(this);
    this.getActiveLesson = this.getActiveLesson.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
  }



  // this must update when a unit is finished (not just
  // initial rendering) - see if this works
  componentDidMount(){
    this.combineUserDataAndTaskData()
    // this.props.getLmsContent();
    // this.props.fetchUserProgress();
  }

  combineUserDataAndTaskData(){
    // temp data to simulate server
    let tasks = Object.keys(configUserProgess.userProgress);
    // taskArr combines server data with local data
    let taskArr = [];

    // find units on react but not in DB. add to tasks arr.
    // now we can update react and it renders automatically
    // we must post this to server later
    configUnitCards.forEach(card => {
      if(tasks.indexOf(card.id) === -1){
        tasks.push(card.id)
      }
    })

    // match up server data and local data to make one array
    // of task objecs which include a "completed" value (boolean)
    tasks.forEach(task => {
      configUnitCards.forEach(card => {
        if(card.id === task) {
          let key = card.id;
          taskArr.push({
            userProgress: {
              name: key,
              isCompleted: configUserProgess.userProgress[task].unitCompleted,
              isLocked: configUserProgess.userProgress[task].unitLocked,
              lessons: configUserProgess.userProgress[task].lessons
            },
            title: card.title,
            description: card.description,
            image: card.image,
            active: false,
            lessons: card.lessons,
            id: card.id
          })
        }
      })
    })


    let activeUnitName = null;
    // sets the initial active unit
    let currentUnit;
    for(let i = 1; i < taskArr.length; i++){
      if(taskArr[i].userProgress.isCompleted === false && taskArr[i-1].userProgress.isCompleted === true){
        activeUnitName = taskArr[i].title;
        currentUnit = i.toString();
        i = tasks.length;
      }
    }

    this.setState({
      ...this.state,
      tasks: taskArr,
      readyForRender: true,
      active: activeUnitName,
      currentUnit: currentUnit,
      currentUnitName: activeUnitName
    })
  }

  // updates state.lesson only when necessary
  componentDidUpdate(prevProps, prevState){
    if(this.state.active !== prevState.active){
          // this.getInitialActiveLesson();
          this.getActiveLesson();
    }
  }





  // puts the active/selected lesson in state
  getInitialActiveLesson(){
    // this.state.tasks.forEach(task => {
    //
    //   if(task.title === this.state.active){
    //     // this block finds the first lesson from userProgress that
    //     // isn't complete.
    //
    //     let lessons = task.userProgress.lessons;
    //     console.log("LESSONS", lessons)
    //     let initialCurrentLesson = "0" /* temp solution */
    //
    //
    //     this.setState({
    //       ...this.state,
    //       currentLesson: initialCurrentLesson,
    //       currentLessonName: initialCurrentLesson[0]
    //     })
    //
    //
    //
    //
    //
    //
    //     let firstIncompleteLesson = null;
    //
    //     let contentLessons = this.state.tasks[parseInt(this.state.currentUnit)].lessons;
    //
    //     // set the current lesson - temp - should use lowest unitLocked
    //
    //
    //
    //     console.log("lessons", lessons[this.state.currentLessonName])
    //
    //     for(let i = contentLessons.length - 1; i >= 0; i--){
    //       let questions = contentLessons[i].questions;
    //       for(let j = questions.length -1; j >= 0; j--){
    //         // console.log('question', questions[j])
    //
    //       }
    //     }
    //     console.log('compare lessons and content', this.state.currentLesson, lessons, contentLessons[0])
    //
    //     for(let lesson in lessons){
    //       // console.log("lesson", lessons[lesson])
    //     }
    //     // for(let i = lessonsKeys.length -1; i >= 0; i--){
    //       // let lessonKey = Object.keys(lessons[i]);
    //       // console.log("lessonKey", lessonKey)
    //       // if(lessons[i][lessonKey]===false){
    //       //   firstIncompleteLesson=lessonKey[0];
    //       // }
    //     // }
    //     // determines what the inital currentLesson will be
    //     task.lessons.forEach((lesson, index) => {
    //       console.log("currentLesson", lesson.id, firstIncompleteLesson)
    //       if (lesson.id === firstIncompleteLesson){
    //         console.log('inside set currentLesson')
    //         this.setState({
    //           ...this.state,
    //           currentLesson: index.toString()
    //         })
    //       }
    //     })
    //   }
    // })
    // this.forceUpdate();
  }


  getActiveLesson(){
    // find first incomplete lesson within active unit

    this.state.tasks.forEach(task => {
      let firstIncompleteLesson = null;
      let firstIncompleteQuestion = null;
      let i; // lesson index
      let j; // question index
      let finalIndexI;
      let finalIndexJ;

      if(task.title === this.state.active){

        let lessonsProgress = configUserProgess.userProgress[task.id].lessons;

        for(i = task.lessons.length - 1; i >=0; i--){
          let lessonId = task.lessons[i].id;
          if(!lessonsProgress[lessonId].lessonCompleted) {
            firstIncompleteLesson = task.lessons[i];
            finalIndexI = i.toString();
          }

          let questions = task.lessons[i].questions;

          // find first incomplete question
          for(j = questions.length-1; j >=0; j--){
            if(!lessonsProgress[firstIncompleteLesson.id].questions[questions[j].id]){
              firstIncompleteQuestion = questions[j]
              finalIndexJ = j.toString()
            }
          }
        }

        console.log('firstIncompleteQuestion', firstIncompleteQuestion)
        this.setState({
          ...this.state,
          active: task.title,
          currentLesson: finalIndexI,
          currentLessonObj: firstIncompleteLesson,
          currentLessonName: firstIncompleteLesson.title,
          currentQuestion: finalIndexJ,
          currentQuestionName: firstIncompleteQuestion.title,
          currentQuestionObj: firstIncompleteQuestion
        })
      }
    })
  }





  // sets current unit
  selectCardOnClick(value){
    let { tasks } = this.state;
    let index;
    tasks.forEach((task, i) => {

      if(task.title === value && !task.userProgress.isLocked){
        // console.log("why no chang?", task.title, value)
        index = i.toString();
        this.setState({
          ...this.state,
          active: value,
          currentUnit: index
        })
      }
    })
  }

  nextLesson(){
    let currentLesson = this.state.currentLesson;
    let targetLesson = (parseInt(currentLesson, 10) + 1).toString();
    // console.log("nextLesson", configUnitCards[this.state.currentUnit].lessons[this.state.currentLesson])
    console.log("lessonindex", currentLesson, targetLesson)
    this.setState({
      ...this.state,
      currentLesson: targetLesson,
      currentLessonObj: configUnitCards[this.state.currentUnit].lessons[this.state.currentLesson]
    })
  }

  prevLesson(){
    let currentLesson = this.state.currentLesson;
    let targetLesson = (parseInt(currentLesson, 10) - 1).toString();
    console.log("lessonindex", currentLesson, targetLesson)
    this.setState({
      ...this.state,
      currentLesson: targetLesson,
      currentLessonObj: configUnitCards[this.state.currentUnit].lessons[this.state.currentLesson]
    })
  }

  nextQuestion(){
    let currentQuestion = this.state.currentQuestion;
    let targetQuestion = (parseInt(currentQuestion, 10) + 1).toString();
    this.setState({
      ...this.state,
      currentQuestion: targetQuestion,
      currentQuestionObj: configUnitCards[this.state.currentUnit].lessons[this.state.currentLesson].questions[targetQuestion]
    })
  }

  prevQuestion(){
    let currentQuestion = this.state.currentQuestion;
    let targetQuestion = (parseInt(currentQuestion, 10) - 1).toString();
    this.setState({
      ...this.state,
      currentQuestion: targetQuestion,
      currentQuestionObj: configUnitCards[this.state.currentUnit].lessons[this.state.currentLesson].questions[targetQuestion]
    })
  }





  getLengthOfCurrentLessonArray(){
    if(this.state.currentUnit){
      return this.state.tasks[this.state.currentUnit].lessons.length;
    }
  }

  render() {

    this.getLengthOfCurrentLessonArray()
    let { active, tasks, readyForRender, currentUnit, currentLesson, currentLessonObj, currentQuestion, currentQuestionObj } = this.state;

    let lmsCards = null;

    if(readyForRender){

      lmsCards = tasks.map((card, i) => {
        return <LmsCard
          title={configUnitCards[i].title}
          description={configUnitCards[i].description}
          image={configUnitCards[i].image}
          onClick={this.selectCardOnClick}
          value={configUnitCards[i].title}
          active={active === configUnitCards[i].title ? true : false}
          isCompleted={card.userProgress.isCompleted}
          locked={tasks[i].userProgress.isLocked}
          key={card.id}
        />
      })
    }

    if(readyForRender){
      // console.log("userProgress", tasks[currentUnit].userProgress.lessons[currentLesson])
      // TO DO - MAKE THIS CONSOLE GO TO THE CheckTasks COMPONENT AND AFFECT WHETHER THE BUTTON IS DISABLED OR NOT



      // console.log('state', this.state)
      return(
        <div className="background">
          <div id="spacer"></div>
          <div className="unitCardsContainer">
                  {lmsCards}
          </div>




          <div className="lessonContentContainer">
            {currentLesson ? <LessonContent
                unit={configUnitCards[currentUnit]}
                lesson={configUnitCards}
                nextLesson={this.nextLesson}
                prevLesson={this.prevLesson}
                nextQuestion={this.nextQuestion}
                prevQuestion={this.prevQuestion}
                currentUnit={currentUnit}
                currentLesson={currentLesson}
                currentLessonObj={currentLessonObj}
                currentQuestion={currentQuestion}
                currentQuestionObj={currentQuestionObj}
                noOfLessons={this.getLengthOfCurrentLessonArray()}
              /> : 'Select a unit to begin'}
          </div>
        </div>
      )
    }
    return <div>loading...</div>
  }
}

const mapStateToProps = state => ({
  book: state.lmsContent.book,
  userProgress: state.userProgress
});

const mapDispatchToProps = dispatch => {
    return {
      getLmsContent : () => {
        dispatch(getLmsContent())
      },
      fetchUserProgress : () => {
        dispatch(getUserProgress(1))
      }
    }
    // return {
    //     getExceptions: (formData) => {
    //         dispatch(actions.getExceptions(formData, '/exceptions'))
    //     }
    // }
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
