let timerInterval = null;
const TIMER = document.getElementById("timer");

/**
 * Форматирует время из секунд в строку вида "MM:SS".
 * @param {number} seconds - Количество секунд.
 * @returns {string} Отформатированное время.
 */
function formatTime(seconds) {
    const secMin = 60;
    const MIN = String(Math.floor(seconds / Number(secMin))).padStart(2, '0');
    const SEC = String(seconds % Number(secMin)).padStart(2, '0');
    return `${MIN}:${SEC}`;
}

/**
 * Запускает таймер обратного отсчёта на 5 минут.
 * При истечении времени автоматически вызывает функцию Test().
 */
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    let timeLeft = 300;
    const milliSec = 1000;
    TIMER.textContent = formatTime(timeLeft);

    timerInterval = setInterval(() => {
        timeLeft--;
        TIMER.textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            Test();
        }
    }, milliSec);
}

/**
 * Останавливает таймер обратного отсчёта, если он был запущен.
 */
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

/**
 * Собирает все ответы пользователя из формы.
 * @returns {Array} Массив ответов: [ANS1, ANS2, ..., ANS8].
 */
function getAnswers() {
    const ANS1 = document.querySelector('input[name="a1"]:checked')?.value ?? null;
    const ANS2 = Array.from(document.querySelectorAll('input[name="a2"]:checked'))
                      .map(el => el.value);
    const ANS3 = document.querySelector('input[name="a3"]:checked')?.value ?? null;
    const ANS4 = Array.from(document.querySelectorAll('input[name="a4"]:checked'))
                      .map(el => el.value);
    const ANS5 = document.querySelector('select[name="a5"]')?.value ?? "";
    const ANS6 = document.querySelector('select[name="a6"]')?.value ?? "";
    const ANS7 = document.querySelector('input[name="a7"]')?.value ?? "";
    const ANS8 = document.querySelector('input[name="a8"]')?.value ?? "";
    return [ANS1, ANS2, ANS3, ANS4, ANS5, ANS6, ANS7, ANS8];
}

/**
 * Добавляет строку с результатом ответа в таблицу.
 * @param {Object} res - Объект с результатом вопроса.
 */
function addRow(res) {
    const TBODY = document.getElementById("resultsTable").getElementsByTagName("tbody")[0];
    const newRow = TBODY.insertRow(TBODY.rows.length);

    const cellData = [
        res.id,
        res.text,
        Array.isArray(res.answer) ? res.answer.join(', ') : res.answer,
        Array.isArray(res.correct) ? res.correct.join(', ') : res.correct,
        res.mark
    ];
    cellData.forEach((content, index) => {
        const CELL = newRow.insertCell(index);
        CELL.innerHTML = content;
    });

    newRow.style.backgroundColor = res.mark === 1 ? '#d4edda' : '#f8d7da';
}

/**
 * Проверяет все ответы пользователя, выводит результат в таблицу
 * и подсчитывает итоговый балл. Останавливает таймер.
 */
function Test() {
    stopTimer();

    const TBODY = document.getElementById("resultsTable").getElementsByTagName("tbody")[0];
    TBODY.innerHTML = "";
    const totalDiv = document.getElementById("total");

    const ANSWER = getAnswers();

    const TABLE = [
        {
            id: "1",
            text: 'Зачем?',
            answer: ANSWER[0],       
            correct: 'Потому что',
            mark: 0
        },
        {
            id: "2",
            text: "Какие из этих слов начинаются с гласного звука?",
            answer: ANSWER[1],     
            correct: ["аист", "осень"],
            mark: 0
        },
        {
            id: "3",
            text: 'Какой первый звук в слове "Школа"?',
            answer: ANSWER[2],       
            correct: 'ш',
            mark: 0
        },
        {
            id: "4",
            text: "В каких словах все согласные звуки твёрдые?",
            answer: ANSWER[3],       
            correct: ["мыло", "жираф", "цирк"],
            mark: 0
        },
        {
            id: "5",
            text: 'В каком слове есть мягкий согласный звук: "кот", "лень","парк"?',
            answer: ANSWER[4],     
            correct: 'лень',
            mark: 0
        },
        {
            id: "6",
            text: 'В каком слове все согласный звуки твёрдые: "мир", "дуб", "лень"?',
            answer: ANSWER[5],       
            correct: 'дуб',
            mark: 0
        },
        {
            id: "7",
            text: 'Сколько слогов в слове "книга"?',
            answer: ANSWER[6],        
            correct: "2",
            mark: 0
        },
        {
            id: "8",
            text: 'Какой последний звук в слове "стол"?',
            answer: ANSWER[7],        
            correct: "л",
            mark: 0
        }
    ];

    let totalScore = 0;

    TABLE.forEach(q => {
        const ID = parseInt(q.id);

        let isAnswered;
        if (ID === 2 || ID === 4) {
            isAnswered = Array.isArray(q.answer) && q.answer.length > 0;
        } else if (ID === 1 || ID === 3) {
            isAnswered = q.answer !== null && q.answer !== undefined;
        } else if (ID === 5 || ID === 6) {
            isAnswered = q.answer !== "";
        } else if (ID === 7 || ID === 8) {
            isAnswered = typeof q.answer === "string" && q.answer !== "";
        }

        if (!isAnswered) {
            q.answer = "Ответ не дан";
            q.mark = 0;
            addRow(q);
            return;
        }

        let correctAnswer = q.correct;

        if (ID === 2 || ID === 4) {
            if (q.answer.length === correctAnswer.length &&
                q.answer.every((val, idx) => val === correctAnswer[idx])) {
                q.mark = 1;
                totalScore++;
            } else {
                q.mark = 0;
            }
        } else {
            const userAnswer = String(q.answer);
            const correctStr = String(correctAnswer);
            if (userAnswer === correctStr) {
                q.mark = 1;
                totalScore++;
            } else {
                q.mark = 0;
            }
        }

        addRow(q);
    });

    if (totalDiv) {
        totalDiv.innerHTML = `ИТОГО: ${totalScore} из ${TABLE.length}`;
    }

    
    const STOP = document.getElementById("stop");
    STOP.disabled = true;
    
    const ANS = document.querySelectorAll('input, select');
    ANS.forEach(an => {
        an.disabled = true;
    });
}

window.addEventListener('DOMContentLoaded', () => {
    startTimer();
});
