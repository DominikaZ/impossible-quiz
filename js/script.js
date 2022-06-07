const rootUrl = 'https://dominikaz.github.io/impossible-quiz/data/'

let density;
let companies;
let familyStatus;
let years_range;
let spending;
let crime;
let education;
let groceries;
let places;
let income;
let socialTax;
let enviro;
let research;
let travel;

const restartBtn = document.getElementById('restart-btn')
const nextBtn = document.getElementById('next-btn')

const questionBoxElem = document.getElementById('box')
const questionElem = document.getElementById('question')
const answerBtnsElem = document.getElementById('answer-btns')

const scoreElem = document.getElementById('score')
const barElem = document.getElementById('bar')

const MAX_QUESTIONS = 20
let alreadyAnswered = false
let questions = []
let currentQuestionIndex = 0

// START GAME
loadAllData().then(startGame)
            .then(addListeners)
            .then(displayQuestionBox)
            .catch(err => console.log(err));


// QUESTIONS /////////////////////////////////////////////////////////////////////////////////

async function loadAllData() {
    density = await loadData('hustota.json');
    companies = await loadData('firmy.json');
    familyStatus = await loadData('stav.json');
    years_range = await loadData('vek.json');
    spending = await loadData('spotreba.json');
    crime = await loadData('kriminalita.json');
    education = await loadData('vzdelanie.json');
    groceries = await loadData('potraviny.json');
    places = await loadData('pocet_obci.json');
    income = await loadData('pracovny_prijem.json');
    socialTax = await loadData('socialne_dane.json');
    enviro = await loadData('zivotne_prostredie.json');
    research = await loadData('vyskum.json');
    travel = await loadData('cestovny_ruch.json');
}

async function loadData(filename) {
    let path = rootUrl + filename;
    const response = await fetch(path);
    const data = await response.json();
    return data;
}

function putTogetherQuestion(question, choices, answer) {
    return {
        question: question,
        choices: choices,
        correct: answer};
}

function makeMinMax(min_text, max_text) {
    let whichOne = Math.floor(Math.random() * 2);
    if (whichOne == 0) {
        return [min_text, Math.min];
    } else {
        return [max_text, Math.max];
    }
}

function generateRandomUniqueIndexes(max) {
    let numbers = new Set()
    while (numbers.size !== 4) {
        let number = Math.floor(Math.random() * (max + 1));
        numbers.add(number)
    }
    return numbers
}

function generateRandomUniquePairs(max1, max2) {
    let numbers = []

    while (numbers.length != 4) {
        let number1 = Math.floor(Math.random() * (max1 + 1));
        let number2 = Math.floor(Math.random() * (max2 + 1));
        let number = [number1, number2]

        let includes = numbers.some(subarray => subarray.every((v, i) => v === number[i]));

        if (!includes) {
            numbers.push(number)
        }
    }
    return numbers
}

function createQuestionCategories(question, data, categories, name, func) {
    let choiceIndexes = generateRandomUniquePairs(data.length - 1, categories.length - 1)
    let choices = []
    let answers = []

    for (const choiceIndex of choiceIndexes) {
        let dataIndex = choiceIndex[0]
        let yearIndex = choiceIndex[1]
        
        let concreteData = data[dataIndex]        
        let year = categories[yearIndex]

        let choice = year + ':' + ' ' + concreteData[name]
        choices.push(choice)
        answers.push(concreteData[year])
    }

    let i = answers.indexOf(func(...answers))
    let answer = choices[i]
    
    let result = putTogetherQuestion(question, choices, answer)
    return result
}

function createQuestion(question, data, choiceName, answerName, func) {
    let choiceIndexes = generateRandomUniqueIndexes(data.length - 1)
    let choices = []
    let answers = []

    for (const index of choiceIndexes) {
        let concreteData = data[index]
        choices.push(concreteData[choiceName])
        answers.push(concreteData[answerName])
    }

    let i = answers.indexOf(func(...answers))
    let answer = choices[i]
    
    let result = putTogetherQuestion(question, choices, answer)
    return result
}

function makeQuestionDensity() {
    const [text, func] = makeMinMax('najmenšia', 'najväčšia')

    let question = 'Kde je ' + text + ' hustota obyvateľstva'
    return createQuestion(question, density, 'Obec', 'Hustota', func)
}

function makeQuestionCountPlace() {
    const [text, func] = makeMinMax('najmenej', 'najviac')

    let question = 'V ktorom okrese je ' + text + ' obcí'
    return createQuestion(question, places, 'Miesto', 'Pocet', func)
}

function makeQuestionIncome() {
    const [text, func] = makeMinMax('najnižší', 'najvyšší')

    let question = 'V ktorom kraji bol ' + text + ' priemerný pracovný príjem'
    return createQuestion(question, income, 'Kraj', 'Pracovné príjmy', func)
}

function makeQuestionStatus() {
    const [text, func] = makeMinMax('najmenej', 'najviac')

    let question = 'Ktorá skupina bola ' + text + ' početná'
    let years = ['2021', '2020', '2019', '2018', '2017', '2012', '2008', '2000']
    return createQuestionCategories(question, familyStatus, years, 'Stav', func)
}

function makeQuestionSocialTax() {
    const [text, func] = makeMinMax('najnižšie', 'najvyššie')
 
    let question = 'V ktorom kraji boli spomedzi všetkých odpovedí ' + text + '...'
    let categories = ['Sociálne príjmy', 'Dane a odvody']
    return createQuestionCategories(question, socialTax, categories, 'Kraj', func)
}

function makeQuestionCompanies() {
    const [text, func] = makeMinMax('najmenej', 'najčastejšie')

    let question = 'Ktorý typ právneho subjektu sa vyskytoval ' + text
    let years = ['2021', '2020', '2019', '2018']
    return createQuestionCategories(question, companies, years, 'Spolocnost', func)
}

function makeQuestionAge() {
    const [text, func] = makeMinMax('najmenej početná', 'najviac početná')

    let question = 'Ktorá veková skupina bola ' + text
    let years = ['2021', '2020', '2019', '2018', '2017', '2012', '2008',
                '2000', '1990', '1960', '1945']
    return createQuestionCategories(question, years_range, years, 'Roky', func)
}

function makeQuestionTravel() {
    const [text, func] = makeMinMax('najnižšie', 'najvyššie')

    let question = 'V ktorom kraji boli ' + text + ' tržby v cestovnom ruchu za daný rok'
    let years = ['2020', '2019', '2018']
    return createQuestionCategories(question, travel, years, 'Kraj', func)
}

function makeQuestionEnviro() {
    const [text, func] = makeMinMax('najmenšie', 'najväčšie')

    let question = 'V ktorom kraji boli ' + text + ' emisie'
    let years = ['2019', '2018', '2017', '2016', '2011', '2008', '2006', '2004', '2001']
    return createQuestionCategories(question, enviro, years, 'Kraj', func)
}

function makeQuestionResearch() {
    const [text, func] = makeMinMax('najmenej', 'najviac')

    let question = 'Do ktorého odvetvia výskumu pre daný rok bolo percentuálne zafinancovaných ' + text + ' peňažných prostriedkov'
    let years = ['2020', '2019', '2018', '2017', '2016', '2012', '2008', '2006',
                 '2004', '2002']
    return createQuestionCategories(question, research, years, 'Odvetvie', func)
}

function makeQuestionSpending() {
    const [text, func] = makeMinMax('najmenej', 'najviac')

    let question = 'V ktorej kategorii utrácali ľudia  ' + text
    let years = ['2019', '2018', '2017', '2016', '2012', '2008', '2006', '2004']
    return createQuestionCategories(question, spending, years, 'Spotreba', func)
}

function makeQuestionCrime() {
    const [text, func] = makeMinMax('najmenej', 'najviac')

    let question = 'V ktorom kraji bolo spáchaných ' + text + ' trestných činov'
    let years = ['2020', '2019', '2018', '2017', '2016', '2012', '2008', '2006', '2004', '2001']
    return createQuestionCategories(question, crime, years, 'Kraj', func)
}

function makeQuestionEducation() {
    const [text, func] = makeMinMax('najmenej častá', 'najčastejšia')

    let question = 'Ktorá z týchto kategórií konečného dosiahnutia vzdelania bola ' + text
    let categories = ['Trnavský kraj', 'Nitriansky kraj', 'Trenčiansky kraj', 'Bratislavský kraj',
                    'Žilinský kraj', 'Banskobystrický kraj', 'Košický kraj', 'Prešovský kraj']
    return createQuestionCategories(question, education, categories, 'Dosiahnuté vzdelanie', func)
}

function makeQuestionGroceries() {
    const [text, func] = makeMinMax('najmenej', 'najviac')

    let question = 'Ktorú kategóriu potravín nakupovali ľudia ' + text
    let years = ['2020', '2019', '2018', '2017', '2016', '2012', '2008', '2004', '2001', '2000']
    return createQuestionCategories(question, groceries, years, 'Potraviny', func)
}


// QUIZ LOGIC ////////////////////////////////////////////////////////////////////////////////

function addListeners() {
    restartBtn.addEventListener('click',  () => {
        startGame()
    })
    
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++
        setQuestion()
    })
}

function startGame() {
    restartBtn.classList.add('hide')
    nextBtn.classList.remove('hide')

    scoreElem.innerText = 0
    barElem.style.background = "#004992"

    resetQuestions()
    setQuestion()
}

function displayQuestionBox() {
    questionBoxElem.classList.remove('hide')
}

function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]]
    }
}

function resetQuestions() {
    questions = []
    let func = [makeQuestionDensity, makeQuestionDensity, makeQuestionStatus,
        makeQuestionCompanies, makeQuestionAge, makeQuestionAge, makeQuestionSpending,
        makeQuestionCrime, makeQuestionEducation, makeQuestionEducation,
        makeQuestionGroceries, makeQuestionGroceries, makeQuestionCountPlace,
        makeQuestionCountPlace, makeQuestionIncome, makeQuestionSocialTax,
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
            nextBtn.classList.remove('cover')
        } else {
            // end
            restartBtn.classList.remove('hide')
            nextBtn.classList.add('hide')
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
    nextBtn.classList.add('cover')

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