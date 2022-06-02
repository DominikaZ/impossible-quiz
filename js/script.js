import { makeQuestionDensity, makeQuestionStatus, makeQuestionCompanies, 
    makeQuestionAge, makeQuestionSpending, makeQuestionCrime, makeQuestionEducation,
    makeQuestionGroceries, makeQuestionCountPlace, makeQuestionIncome, makeQuestionSocialTax, 
    makeQuestionEnviro, makeQuestionResearch, makeQuestionTravel } from './questions.js';

const startBtn = document.getElementById('start-btn')
const restartBtn = document.getElementById('restart-btn')
const nextBtn = document.getElementById('next-btn')

const box = document.getElementById('box')
const questionBoxElem = document.getElementById('question-box')
const questionElem = document.getElementById('question')
const answerBtnsElem = document.getElementById('answer-btns')

const scoreElem = document.getElementById('score')
const barElem = document.getElementById('bar')

const MAX_QUESTIONS = 20
let alreadyAnswered = false
let questions = []
let currentQuestionIndex = 0


startBtn.addEventListener('click',  () => {
    startBtn.classList.add('hide')
    box.classList.remove('hide')
    startGame()
})

restartBtn.addEventListener('click',  () => {
    startGame()
})

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++
    setQuestion()
})


function startGame() {
    restartBtn.classList.add('hide')
    questionBoxElem.classList.remove('hide')

    scoreElem.innerText = 0
    barElem.style.background = "#004992"

    resetQuestions()
    setQuestion()
}

function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]]
    }
}

function resetQuestions() {
    questions = []
    let func = [makeQuestionDensity, makeQuestionDensity, makeQuestionStatus, makeQuestionCompanies, makeQuestionAge,
        makeQuestionAge, makeQuestionAge, makeQuestionSpending, makeQuestionCrime, makeQuestionEducation, makeQuestionEducation,
        makeQuestionGroceries, makeQuestionGroceries, makeQuestionCountPlace, makeQuestionIncome, makeQuestionSocialTax, 
        makeQuestionEnviro, makeQuestionEnviro, makeQuestionResearch, makeQuestionTravel]

    for (const concreteFunc of func) {
        questions.push(concreteFunc())
    }

    shuffleQuestions()
    currentQuestionIndex = 0;
}

function setQuestion() {
    resetState()
    displayQuestion(questions[currentQuestionIndex])
}

function displayQuestion(question) {
    questionElem.innerText = question.question + '?'

    for (const choice of question.choices){
        const button = document.createElement('button')
        button.classList.add('btn')
        button.innerText = choice
        if (choice == question.correct) {
            // add string if correct
            button.dataset.correct = 'y'
        }
        button.addEventListener('click', selectAnswer)
        answerBtnsElem.appendChild(button)
    }

    barElem.style.width = `${((currentQuestionIndex + 1) / MAX_QUESTIONS) * 100}%`
    barElem.innerText = currentQuestionIndex + 1 + '/' + MAX_QUESTIONS  
}

function selectAnswer(e) {
    if (! alreadyAnswered) {
        const correct = e.target.dataset.correct
        setCorrectClass(scoreElem, correct)

        if (correct) { // is not None
            scoreElem.innerText = parseInt(scoreElem.innerText) + 1
        }

        Array.from(answerBtnsElem.children).forEach(button => {
            setCorrectClass(button, button.dataset.correct)
        })

        if (questions.length > currentQuestionIndex + 1) {
            nextBtn.classList.remove('hide')
        } else {
            // end
            restartBtn.classList.remove('hide')
            barElem.style.width = `100%`
            barElem.style.background = "#ffee32"
            barElem.innerText = ''
            scoreElem.innerText = scoreElem.innerText + '/' + MAX_QUESTIONS
        }

        alreadyAnswered = true; 
    }
}

function resetState() {
    alreadyAnswered = false;

    // score to normal color
    removeCorrectClass(scoreElem)
    nextBtn.classList.add('hide')

    // remove all previous button answers
    while (answerBtnsElem.firstChild) {
        answerBtnsElem.removeChild(answerBtnsElem.lastChild)
    }
}

function setCorrectClass(element, correct) {
    removeCorrectClass(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('incorrect')
    }
}

function removeCorrectClass(element) {
    element.classList.remove('correct')
    element.classList.remove('incorrect')
}