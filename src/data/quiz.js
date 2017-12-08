// utilities
import _shuffle from 'lodash/shuffle';
import _uniq from 'lodash/uniq';
// data
import { Maps, WonderWeapons } from './maps.js';
import Perks from './perk_a_cola.js';

/*
Question Types:
- Question
  - text
  - audio + Text
  - image + Text
- Answers
  - multiple choice, single answer
- Answer Input Methods
  - Button (multiple choice, single answer / true-or-false)
*/

// Question tags/categories
const Tags = {
    General: 0,
    Gobblegums: 1,
    Cookbook: 2,
    Maps: 3,
    Weapons: 4,
    Story: 5,
};

const questionTypes = {
    text: 0,
    audio_text: 1,
    image_text: 2,
};
const answerTypes = {
    mc_single: 0,
    trueOrFalse: 1,
};

class QuestionTemplate {
    constructor(type, generator) {
        this.type = type;
        this.generate = () => {
            const { question, checkAnswer } = generator();
            this.question = question; // TODO: use some object cloning for deep copy?
            this.checkAnswer = checkAnswer;
        }
    }
}

// pick random choices from random things
function pickRandomFrom(things, ofWhat, numChoices) {
    let selected, others, choice, otherChoices;
    do {
        // pick random things from list
        [selected, ...others] = pickRandomIn(things, numChoices);
        // selected = thing with answer, others = other things as choices
        choice = ofWhat(selected);
        otherChoices = _uniq(others.map(ofWhat)); // also de-duplicate choices
        // repeat if: choice is undefined OR
        // choice is in otherChoices OR otherChoices contains undefined
    } while (typeof choice === 'undefined' || otherChoices.includes(choice) ||
        otherChoices.indexOf(undefined) !== -1);
    return {
        selected: selected,
        choice: choice,
        others: otherChoices
    };
}
// pick n/count elements from array/object
function pickRandomIn(collection, count) {
    let array = collection;
    // convert object to array of object values
    if (!Array.isArray(collection) && typeof collection === 'object') {
        array = Object.values(collection);
    }
    // bound array size to 'count'
    count = count > array.length ? array.length : count;
    const pickedIdx = [];
    let randIdx;
    while (pickedIdx.length < count) { // pick until 'count' is reached
        do { // get random array index not picked before
            randIdx = Math.floor(Math.random() * array.length);
        } while (pickedIdx.indexOf(randIdx) !== -1);
        pickedIdx.push(randIdx);
    }
    return pickedIdx.map(idx => array[idx]); // map array items back according to indices
}

// list of question templates for generating questions
const questionTemplates = [
    // Special enemy of map
    new QuestionTemplate(questionTypes.text, () => {
        const pickRandomEnemy = map => pickRandomIn(map.special_enemies, 1)[0].name;
        const enemyIsInBoth = (selected, others) =>
            others.some(enemy => selected.special_enemies.includes(enemy));
        do {
            var { selected: selectedMap, choice, others } = pickRandomFrom(Maps, pickRandomEnemy, 4);
        } while (enemyIsInBoth(selectedMap, [choice, ...others]));
        return {
            question: {
                text: `Which one of these enemies is featured in ${selectedMap.name}?`,
                choices: [choice, ...others],
            },
            checkAnswer: input => input === choice
        };
    }),
    // Perk jingle audio
    new QuestionTemplate(questionTypes.audio_text, () => {
        const { selected: perk, others } = pickRandomFrom(Perks, perk => perk.name, 4);
        return {
            question: {
                text: `Which Perk-a-Cola does this jingle belongs to?`,
                audioFile: perk.jingleAudioFile,
                choices: [perk.name, ...others],
            },
            checkAnswer: input => input === perk.name
        };
    }),
    // Picture of map
    new QuestionTemplate(questionTypes.image_text, () => {
        const { selected: map, others } = pickRandomFrom(Maps, map => map.name, 4);
        return {
            question: {
                text: `Which map is this?`,
                image: pickRandomIn(map.images, 1)[0],
                choices: [map.name, ...others]
            },
            checkAnswer: input => input === map.name
        };
    }),
    // Picture of wonder weapon
    new QuestionTemplate(questionTypes.image_text, () => {
        const { selected: wonder_weapon, others } =
            pickRandomFrom(WonderWeapons, ww => ww.img && ww.name, 4);
        return {
            question: {
                text: `Which wonder weapon is this?`,
                image: wonder_weapon.img,
                choices: [wonder_weapon.name, ...others]
            },
            checkAnswer: input => input === wonder_weapon.name
        };
    }),
];
// question templates, only used once (don't repeat these questions)
const oneTimeQuestionTemplate = [
    // Starting pistol of map TODO: always picking SoE??
    new QuestionTemplate(questionTypes.text, () => {
        const { selected: map, others } =
            pickRandomFrom(Maps, map => map.starting_pistol, 4);
        return {
            question: {
                text: `What is the starting pistol in ${map.name}?`,
                choices: [map.starting_pistol, ...others],
            },
            checkAnswer: input => input === map.starting_pistol
        };
    }),
    // Plunger melee weapon in 'Der Eisendrache'
    new QuestionTemplate(questionTypes.text, () => {
        let otherMaps; // only use the 3 other choices from 4 random picks
        do { // pick random maps other than 'Der Eisendrache'
            otherMaps = pickRandomFrom(Maps, map => map.name, 4).others;
        } while (otherMaps.some(mapName => mapName === Maps.de.name));
        return {
            question: {
                text: `Which map does the Plunger melee weapon belongs to?`,
                choices: [Maps.de.name, ...otherMaps], // fill in Der Eisendrache
            },
            checkAnswer: input => input === Maps.de.name
        };
    }),
];

// Question data for UI component
function generateQuestions(numQuestions) {
    let id = 0;
    let questions = [];
    // Add one-time questions (at most half of all questions)
    let numOneTimeQuestions = Math.floor(1 + Math.random() * (oneTimeQuestionTemplate.length / 2));
    questions = questions.concat(pickRandomIn(oneTimeQuestionTemplate, numOneTimeQuestions));
    // Add other questions
    while (questions.length < numQuestions) { // until numQuestions is met
        let picks = pickRandomIn(questionTemplates, numQuestions - questions.length);
        questions = questions.concat(picks);
    }
    // shuffle and generate questions
    return _shuffle(questions).map(template => {
        template.generate(); // generate question from template
        // shuffle question choices
        template.question.choices = _shuffle(template.question.choices);
        return {
            id: id++, // question ID, for answer checking
            type: template.type,
            question: template.question,
            checkAnswer: template.checkAnswer
        };
    });
}

let questions;
// get (choice) array index of correct answer
function getCorrectAnswerIdx(questionID) {
    const questionMeta = questions.find(question => question.id === questionID);
    return questionMeta.question.choices.findIndex(choice => questionMeta.checkAnswer(choice));
}
// create quiz questions with question generators w/o answers
function makeQuestionsForQuiz(numQuestions) {
    // generate questions for quiz
    questions = generateQuestions(numQuestions || questionTemplates.length);
    // make questions-only list for quiz component
    return questions.map(q => ({
        id: q.id,
        type: q.type,
        question: q.question
    }));
}

export default {
    getQuestions: numQuestions => makeQuestionsForQuiz(numQuestions),
    getCorrectAnswerIdx: getCorrectAnswerIdx,
    questionTypes: questionTypes
};