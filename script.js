// --- HTML要素の取得 ---
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const addBtn = document.getElementById('add-btn');
const cardsContainer = document.getElementById('cards-container');

// 学習モード用の要素
const editArea = document.getElementById('edit-area');
const studyArea = document.getElementById('study-area');
const startBtn = document.getElementById('start-btn');
const reverseModeCheckbox = document.getElementById('reverse-mode');
const studyCardContainer = document.getElementById('study-card-container');
const nextCardBtn = document.getElementById('next-card-btn');
const quitBtn = document.getElementById('quit-btn');

// --- データ管理 ---
let cardsData = JSON.parse(localStorage.getItem('cards')) || [];
let studyQueue = [];
let currentStudyIndex = 0;

// 初期表示
init();

function init() {
    cardsContainer.innerHTML = '';
    cardsData.forEach((card, index) => {
        createCardElement(card.question, card.answer, index, cardsContainer, true);
    });
}

// --- カード追加機能 ---
addBtn.addEventListener('click', () => {
    const questionText = questionInput.value;
    const answerText = answerInput.value;

    if(questionText.trim() === '' || answerText.trim() === '') {
        alert('見出しと詳細の両方を入力してください！');
        return;
    }

    const newCard = { question: questionText, answer: answerText };
    cardsData.push(newCard);
    saveToLocalStorage();
    init();

    // 入力欄をクリア
    questionInput.value = '';
    answerInput.value = '';
});

// --- 共通：カード作成関数 ---
function createCardElement(frontText, backText, index, container, isEditMode) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    let htmlContent = '';
    if (isEditMode) {
        htmlContent += `<button class="delete-btn">×</button>`;
    }
    
    htmlContent += `
        <h3>${frontText}</h3>
        <p class="answer">${backText}</p>
    `;
    
    cardDiv.innerHTML = htmlContent;

    cardDiv.addEventListener('click', () => {
        cardDiv.classList.toggle('show-answer');
    });

    if (isEditMode) {
        const delBtn = cardDiv.querySelector('.delete-btn');
        delBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if(confirm('この札を削除しますか？')) {
                cardsData.splice(index, 1);
                saveToLocalStorage();
                init();
            }
        });
    }

    container.appendChild(cardDiv);
}

// --- 学習モードの処理 ---
startBtn.addEventListener('click', () => {
    if (cardsData.length === 0) {
        alert('札がありません。まずは追加してください。');
        return;
    }

    editArea.classList.add('hidden');
    studyArea.classList.remove('hidden');
    startBtn.disabled = true;
    reverseModeCheckbox.disabled = true;

    studyQueue = [...cardsData].sort(() => Math.random() - 0.5);
    currentStudyIndex = 0;

    showStudyCard();
});

function showStudyCard() {
    studyCardContainer.innerHTML = '';

    if (currentStudyIndex >= studyQueue.length) {
        if(confirm('一周しました！学習を終了しますか？\n（キャンセルで最初から再スタート）')) {
            quitStudyMode();
            return;
        } else {
            studyQueue.sort(() => Math.random() - 0.5);
            currentStudyIndex = 0;
        }
    }

    const cardData = studyQueue[currentStudyIndex];
    const isReverse = reverseModeCheckbox.checked;

    const front = isReverse ? cardData.answer : cardData.question;
    const back = isReverse ? cardData.question : cardData.answer;

    createCardElement(front, back, null, studyCardContainer, false);
}

nextCardBtn.addEventListener('click', () => {
    currentStudyIndex++;
    showStudyCard();
});

quitBtn.addEventListener('click', quitStudyMode);

function quitStudyMode() {
    studyArea.classList.add('hidden');
    editArea.classList.remove('hidden');
    startBtn.disabled = false;
    reverseModeCheckbox.disabled = false;
}

function saveToLocalStorage() {
    localStorage.setItem('cards', JSON.stringify(cardsData));
}

// --- 新機能：テンプレート挿入機能 ---
// HTML側のonclickで呼び出されます
window.insertTemplate = function(type) {
    let textToInsert = "";
    
    if (type === 'katsuyo') {
        textToInsert = `【活用】
未然形：
連用形：
終止形：
連体形：
已然形：
命令形：`;
    } else if (type === 'imi') {
        textToInsert = `意味：
接続：`;
    }

    // すでに入力されている内容の後ろに追加する
    const currentText = answerInput.value;
    if (currentText.length > 0) {
        answerInput.value = currentText + "\n\n" + textToInsert;
    } else {
        answerInput.value = textToInsert;
    }
    
    // 入力欄にフォーカスを戻す
    answerInput.focus();
};