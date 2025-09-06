const buttonTheme = document.querySelector(`[data-js-button-theme]`)

const totalGames = document.querySelector(`[data-js-total-games]`)
const totalWins = document.querySelector(`[data-js-total-wins]`)
const totalLosses = document.querySelector(`[data-js-total-losses]`)

const statisticsList = document.querySelector(`[data-js-statistics-list]`)
const gameNumber = document.querySelector(`[data-js-game-number]`)
const gameAttempts = document.querySelector(`[data-js-game-attempts]`)
const clearDataButton = document.querySelector(`[data-js-clear-data-button]`)

const attemptsFill = document.querySelector(`[data-js-attempts-fill]`)

const gameButton = document.querySelector(`[data-js-game-button]`)
const gameCardDescription = document.querySelector(`[data-js-game-card-description]`)

const gameCardIcons = document.querySelectorAll(`[data-js-game-card-icon]`)

const gameForm = document.querySelector(`[data-js-game-form]`)
const gameInput = document.querySelector(`[data-js-game-input]`)
const formButton = document.querySelector(`[data-js-form-button]`)
const messageError = document.querySelector(`[data-js-message-error]`)

const emptyMessage = document.querySelector(`[data-js-empty-message]`)

let secretNumber = null
let maxAttempts = 10
let currentGame = 0
let winGames = 0
let loseGames = 0
let gameResultValue = null
let attemptsLeft = null
let gameOverFlag = false
let isPlaying = false
let usedNumbers = []

let minValue = 0
let maxValue = 1000

const colorsAttemptsFill = [
    '#FF4D4D',
    '#FF704D',
    '#FF944D',
    '#FFB84D',
    '#FFDC4D',
    '#FFE84D',
    '#DFFF4D',
    '#BFFF4D',
    '#9FFF4D',
    '#4DFF4D'
];


function getRandomNumber(min, max) {
    min = Math.ceil(min / 10);
    max = Math.floor(max / 10);

    return (Math.floor(Math.random() * (max - min + 1)) + min) * 10;
}

function showIcon (name) {
    gameCardIcons.forEach(icon => {
        icon.classList.toggle('is-shown', icon.dataset.jsGameCardIcon === name);
    })
}

function upgradeAttemptsFill (attemptsLeft) {
    const percent = (attemptsLeft / maxAttempts) * 100
    attemptsFill.style.width = percent + "%"
    const colorIndex = Math.max(0, Math.min(maxAttempts - 1, attemptsLeft - 1))
    attemptsFill.style.backgroundColor = colorsAttemptsFill[colorIndex]
}

function newGame () {
    gameButton.classList.add('active')
    gameCardDescription.textContent = "Начните игру!"
    gameButton.textContent = "Начать новую игру!"
    attemptsLeft = maxAttempts
    upgradeAttemptsFill(attemptsLeft)
    gameOverFlag = false
    usedNumbers = []
    attemptsFill.style.width = "100%"
    gameInput.disabled = true
    formButton.disabled = true
    gameInput.value = ''
    isPlaying = false
    showIcon("start")
    emptyMessageToggle()
}

function startGame() {
    gameButton.classList.remove('active')
    secretNumber = getRandomNumber(minValue, maxValue)
    gameCardDescription.textContent = "Число загадно, введите ваше число!"
    gameInput.disabled = false
    formButton.disabled = false
    isPlaying = true
}

function gameWin () {
    showIcon("win")
    gameCardDescription.textContent = `Вы отгадали число! \n Загаданное число: ${secretNumber}.`
    gameButton.classList.add('active')
    gameButton.textContent = "Сыграем еще раз!"
    gameResultValue = true
    isPlaying = false
    winGames += 1
    currentGame += 1
    
    addGameCard(currentGame, maxAttempts - attemptsLeft, 'Победа')
    
    totalGames.textContent = `${currentGame}`
    totalWins.textContent = `${winGames}`

    gameOverFlag = true
    gameInput.disabled = true
    formButton.disabled = true

    if (gameNumber && gameResult && gameAttempts) {
        gameNumber.textContent = `${currentGame}`
        gameAttempts.textContent = maxAttempts - attemptsLeft
    }

    emptyMessageToggle()

    saveStatistics()
}

function gameLose() {
    showIcon("lose")
    gameCardDescription.textContent = `Вы не отгадали число! \n Загаданное число: ${secretNumber}.`
    gameButton.classList.add('active')
    gameButton.textContent = "Сыграем еще раз!"
    gameResultValue = false
    isPlaying = false
    loseGames += 1
    currentGame += 1

    addGameCard(currentGame, maxAttempts - attemptsLeft, 'Поражение')

    totalGames.textContent = `${currentGame}`
    totalLosses.textContent = `${loseGames}`

    gameOverFlag = true
    gameInput.disabled = true
    formButton.disabled = true

    if (gameNumber && gameResult && gameAttempts) {
        gameNumber.textContent = `${currentGame}`
        gameAttempts.textContent = maxAttempts - attemptsLeft
    }

    emptyMessageToggle()

    saveStatistics()
}

function moreNumber () {
    showIcon("arrow-up")
    gameCardDescription.textContent = `Загаданное число больше!`
    attemptsLeft--
    upgradeAttemptsFill(attemptsLeft)

    if (attemptsLeft <= 0) {
        gameLose()
    }
}

function lessNumber() {
    showIcon("arrow-down")
    gameCardDescription.textContent = `Загаданное число меньше!`
    attemptsLeft--
    upgradeAttemptsFill(attemptsLeft)

    if (attemptsLeft <= 0) {
        gameLose()
    }
}

function handleGuess(playerNumber) {
    if (!isPlaying) return

    if (
        (playerNumber >= minValue && playerNumber <= maxValue)  && 
        (playerNumber % 10 === 0) && 
        (!usedNumbers.includes(playerNumber))
    ) {
        usedNumbers.push(playerNumber)

        if (playerNumber === secretNumber) {
            gameWin()
        } else if (playerNumber < secretNumber) {
            moreNumber()
        }  else if (playerNumber > secretNumber) {
            lessNumber()
        }
    }
}

function addGameCard(number, attempts, result) {
    const li = document.createElement('li')
    li.classList.add('session-statistics__item')

    li.innerHTML = `
        <div class="session-statistics__item-title title">
            <h4>Игра № <span data-js-game-number>${number}</span></h4>
        </div>
        <div class="session-statistics__item-body">
            <p>Исход: <span data-js-game-result>${result}</span></p>
            <p>Попыток: <span data-js-game-attempts>${attempts}</span></p>
        </div>
    `

    const spanResult = li.querySelector('.session-statistics__item-body p:first-child span')

    if (result === 'Победа') {
        spanResult.classList.add('win-color')
    } else if (result === 'Поражение') {
        spanResult.classList.add('lose-color')
    }

    statisticsList.appendChild(li)
    return li
}

function emptyMessageToggle() {
    hasItems = statisticsList.querySelectorAll('li').length
    if (hasItems === 0) {
        emptyMessage.textContent = `Пока нет недавних игр :(`
        statisticsList.style.justifyContent = 'center'
    } else {
        emptyMessage.textContent = ''
        statisticsList.style.justifyContent = 'start'
    }
}

function validateForm() {
    const value = gameInput.value

    if (isNaN(+value) || value.trim() === '') {
        shakeField(gameInput)
        showError("Введите число!")
        return
    }

    if (+value < minValue || +value > maxValue) {
        shakeField(gameInput)
        showError("Число должно быть от 0 до 1000!")
        return
    }

    if (+value % 10 !== 0) {
        shakeField(gameInput)
        showError("Число должно быть кратно 10!")
        return
    }

    if (usedNumbers.includes(+value)) {
        shakeField(gameInput)
        showError(`Вы уже вводили число ${value}`)
        return
    }

    clearError()
    handleGuess(+value)
    gameInput.value = ''
    gameInput.focus()
}

function showError(message) {
    gameInput.classList.add('input-error')
    messageError.classList.add('message-error')
    formButton.classList.add('input-error')
    messageError.textContent = message
    
}

function clearError() {
    gameInput.classList.remove('input-error')
    messageError.classList.remove('message-error')
    formButton.classList.remove('input-error')
    messageError.textContent = ''
}

function shakeField(field) {
    field.classList.add('shake-animation');
    field.addEventListener('animationend', () => {
        field.classList.remove('shake-animation');
    }, { once: true });
}

function saveStatistics() {
    const data = {
        currentGame,
        winGames,
        loseGames,
        history: []
    }

    const items = statisticsList.querySelectorAll('.session-statistics__item');
    items.forEach(item => {
        const gameNumber = item.querySelector('[data-js-game-number]').textContent;
        const result = item.querySelector('[data-js-game-result]').textContent;
        const attempts = item.querySelector('[data-js-game-attempts]').textContent;
        data.history.push({ gameNumber, result, attempts });
    });

    localStorage.setItem('gameStats', JSON.stringify(data));
}

function loadStatistics() {
    const saved = localStorage.getItem('gameStats')
    if (!saved) return

    const data = JSON.parse(saved)

    currentGame = data.currentGame
    winGames = data.winGames
    loseGames = data.loseGames

    totalGames.textContent = currentGame
    totalWins.textContent = winGames
    totalLosses.textContent = loseGames

    data.history.forEach(game => {
        addGameCard(game.gameNumber, game.attempts, game.result);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadStatistics()
    emptyMessageToggle()
})

newGame()

gameButton.addEventListener('click', () => {
    newGame()
    startGame()
})

gameForm.addEventListener('submit', (event) => {
    event.preventDefault()
    validateForm()
})

const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
        document.body.classList.toggle('dark-theme', savedTheme === 'dark')
    }

buttonTheme.addEventListener('click', () => {
    const isDark = document.body.classList.toggle(`dark-theme`)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
})

gameInput.addEventListener('input', () => {
    const value = gameInput.value.trim();

    if (isNaN(+value) || value.trim() === '' 
        || +value < minValue || +value > maxValue || +value % 10 !== 0 
        || usedNumbers.includes(+value)) {
        clearError()
    }
});

clearDataButton.addEventListener('click', () => {
    localStorage.removeItem('gameStats')
    location.reload()
})