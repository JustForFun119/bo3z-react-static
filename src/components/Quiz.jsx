import React from 'react';
import PropTypes from 'prop-types';
// React Router 'withRouter' wrap for URL identification
import { withRouter } from 'react-router';
// UI components
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider'; // Q&A : question-answer divider
import RaisedButton from 'material-ui/RaisedButton'; // Q&A : answer choices
import AudioPlayer from './AudioPlayer' // custom audio player for audio+text question
import LinearProgress from 'material-ui/LinearProgress'; // quiz progress

// import style from '!style-loader!css-loader!sass-loader!../sass/quiz.scss' // SCSS stylesheet

import QuizData from '../data/quiz'; // Quiz data

const styles = {
    Paper: {
        width: '90%',
        margin: 'auto',
        marginTop: 64,
        padding: 24,
        textAlign: 'center'
    },
    QuestionContainer: {
        display: 'block',
        height: 'auto',
        width: '90%',
        margin: 'auto',
        marginTop: 8,
        padding: 16,
        textAlign: 'center',
    },
    Question: {
        Container: {
            marginBottom: 8,
            padding: 8,
            textAlign: 'center',
        }
    },
    Answer: {
        Container: {
            marginTop: 8,
            padding: 4,
            textAlign: 'center',
        },
        Choice: {
            width: '90%',
            marginBottom: 8,
            padding: 4,
            textAlign: 'center'
        },
        Correct: {
            backgroundColor: 'green',
            labelColor: 'white'
        },
        Wrong: {
            backgroundColor: 'red',
            labelColor: 'white'
        }
    }
};

// Question text component
function QuestionText(props) {
    return (
        <div style={styles.Question.Container}>{props.question.text}</div>
    );
}
QuestionText.propTypes = {
    question: PropTypes.object
};
// Question answer : multiple choices(buttons) component
function AnswerMultipleChoices(props) {
    return (
        <div style={styles.Answer.Container}>
            {props.question.choices.map((choice, idx) => (
                <RaisedButton key={idx}
                    label={choice}
                    onClick={props.onChoiceClick.bind(this, idx)}
                    style={styles.Answer.Choice}
                    {...props.buttonStyles[idx]} />
            ))}
        </div>
    );
}
AnswerMultipleChoices.propTypes = {
    question: PropTypes.object,
    onChoiceClick: PropTypes.func,
    buttonStyles: PropTypes.array
};
// Question type : text
function TextQuestion(props) {
    const { question } = props
    return (
        <div>
            <QuestionText question={question} />
            <Divider />
            <AnswerMultipleChoices question={question}
                onChoiceClick={props.onChoiceClick}
                buttonStyles={props.buttonStyles} />
        </div>
    );
}
TextQuestion.propTypes = {
    question: PropTypes.object,
    onChoiceClick: PropTypes.func,
    buttonStyles: PropTypes.array
};
// Question type : audio + text
function AudioTextQuestion(props) {
    const { question } = props;

    return (
        <div>
            <QuestionText question={question} />
            <AudioPlayer audioFile={question.audioFile} volume={0.2}
                style={{ marginBottom: 16 }} />
            <Divider />
            <AnswerMultipleChoices question={question}
                onChoiceClick={props.onChoiceClick}
                buttonStyles={props.buttonStyles} />
        </div>
    );
}
AudioTextQuestion.propTypes = {
    question: PropTypes.object,
    onChoiceClick: PropTypes.func,
    buttonStyles: PropTypes.array
};
// Question type : image + text
function ImageTextQuestion(props) {
    const { question } = props;

    return (
        <div>
            <QuestionText question={question} />
            <img src={question.image} style={{
                maxWidth: '100%',
                maxHeight: '100%',
                marginBottom: 16
            }} />
            <Divider />
            <AnswerMultipleChoices question={question}
                onChoiceClick={props.onChoiceClick}
                buttonStyles={props.buttonStyles} />
        </div>
    );
}
ImageTextQuestion.propTypes = {
    question: PropTypes.object,
    onChoiceClick: PropTypes.func,
    buttonStyles: PropTypes.array
};
// Question & answer component
function QandA(props) {

    function renderQuestion() {
        // quiz question types 'enum'
        const QuestionTypes = QuizData.questionTypes;
        // question meta object
        const questionMeta = props.questions[props.questionIdx];
        // common question props
        const questionProps = {
            question: questionMeta.question,
            onChoiceClick: onChoiceClick.bind(this),
            buttonStyles: getAnswerButtonStyles(questionMeta) // answers/choices button styles
        };
        // use question component for different types of questions
        let Question;
        switch (questionMeta.type) {
            case QuestionTypes.text: Question = TextQuestion; break;
            case QuestionTypes.audio_text: Question = AudioTextQuestion; break;
            case QuestionTypes.image_text: Question = ImageTextQuestion; break;
        }
        return <Question {...questionProps} />;
    }

    function getAnswerButtonStyles(questionMeta) {
        const answerIdx = getAnswerIdx(); // array index of selected answer/choice
        // make button styles (array) to show correct/wrong answers
        const btnStyles = Array(questionMeta.question.choices.length).fill({});
        if (typeof answerIdx !== 'undefined') { // if an answer has been selected
            // show choice as wrong answer, if user selects wrong answer
            if (answerIdx !== correctIdx) btnStyles[answerIdx] = styles.Answer.Wrong;
            // highlight correct answer
            const correctIdx = QuizData.getCorrectAnswerIdx(questionMeta.id);
            btnStyles[correctIdx] = styles.Answer.Correct;
        }
        return btnStyles;
    }

    function onChoiceClick(choiceIdx) {
        const answerIdx = getAnswerIdx();
        if (typeof answerIdx === 'undefined') { // question not answered yet
            // callback to Quiz component for state change
            props.onQuestionAnswered(props.questionIdx, choiceIdx);
        }
    }

    function getAnswerIdx() { return props.answerIdxs[props.questionIdx]; }

    return (
        <Paper style={styles.QuestionContainer}>
            {renderQuestion()}
        </Paper>
    );
}
QandA.propTypes = {
    questions: PropTypes.array,
    questionIdx: PropTypes.number,
    answerIdxs: PropTypes.array,
    onQuestionAnswered: PropTypes.func
};

// Main quiz component
class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: null, // array of questions in quiz
            questionIdx: -1, // (current) question index
            chosenAnswerIdxs: null, // array indices of chosen answers
            correctCount: 0 // count number of correct answers
        };
    }

    startQuiz() {
        this.setState({
            questions: QuizData.getQuestions(10), // get quiz questions from data
            questionIdx: 0, // start with first question
            chosenAnswerIdxs: [], // init chosen answer indices
            correctCount: 0
        });
    }

    onQuestionAnswered(idx, choiceIdx) {
        // record chosen answer index
        const answerIdxs = this.state.chosenAnswerIdxs;
        answerIdxs[idx] = choiceIdx;
        this.setState({ answers: answerIdxs });
        // record correct answer count
        if (choiceIdx === QuizData.getCorrectAnswerIdx(idx))
            this.setState({ correctCount: this.state.correctCount + 1 });
        // next question after delay
        setTimeout(() => { this.nextQuestion(); }, 2000);
    }

    nextQuestion() {
        this.setState({ questionIdx: this.state.questionIdx + 1 });
    }

    render() {
        const { questionIdx } = this.state;

        if (questionIdx < 0) { // quiz not started yet
            return (
                <div>
                    <Paper style={styles.Paper}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ textAlign: 'center', margin: 16 }}>
                                <span>Black Ops 3 Zombies Quiz</span>
                            </div>
                            <RaisedButton label="Start" primary={true}
                                onClick={() => { this.startQuiz() }}
                                style={{ margin: 16 }} />
                        </div>
                    </Paper>
                </div>
            );
        } else { // quiz started
            const quizProgress = this.state.questionIdx / this.state.questions.length * 100;
            // quiz in progress
            if (questionIdx >= 0 && questionIdx < this.state.questions.length) {
                return (
                    <div>
                        <LinearProgress mode="determinate" value={quizProgress} />
                        <QandA questions={this.state.questions}
                            questionIdx={this.state.questionIdx}
                            answerIdxs={this.state.chosenAnswerIdxs}
                            onQuestionAnswered={this.onQuestionAnswered.bind(this)} />
                    </div>
                );
            } else { // quiz done
                return (
                    <div>
                        <LinearProgress mode="determinate" value={quizProgress} />
                        <Paper style={styles.Paper}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ textAlign: 'center', margin: 16 }}>
                                    <span>Black Ops 3 Zombies Quiz</span><br /><br />
                                    <span style={{ fontSize: 18 }}>
                                        You got {this.state.correctCount} out of {this.state.questions.length} correct!
                                    </span><br /><br />
                                    <span>Thanks for playing!</span>
                                </div>
                                <RaisedButton label="Start Again" primary={true}
                                    onClick={() => { this.startQuiz() }}
                                    style={{ margin: 16 }} />
                            </div>
                        </Paper>
                    </div>
                );
            }
        }
    }
}

export default Quiz;