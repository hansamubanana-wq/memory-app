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
let studyQueue = []; // 学習用にシャッフルされたカードリスト
let currentStudyIndex = 0; // 今何枚目か

// 初期表示
init();

function init() {
    cardsContainer.innerHTML = '';
    // 編集画面の一覧表示
    cardsData.forEach((card, index) => {
        createCardElement(card.question, card.answer, index, cardsContainer, true);
    });
}

// --- カード追加機能 ---
addBtn.addEventListener('click', () => {
    const questionText = questionInput.value;
    const answerText = answerInput.value;

    if(questionText.trim() === '' || answerText.trim() === '') {
        alert('問題と答えの両方を入力してください！');
        return;
    }

    const newCard = { question: questionText, answer: answerText };
    cardsData.push(newCard);
    saveToLocalStorage();
    init();

    questionInput.value = '';
    answerInput.value = '';
});

// --- 共通：カード作成関数 ---
// isEditMode: trueなら「削除ボタン」をつける
function createCardElement(frontText, backText, index, container, isEditMode) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    // 中身のHTMLを作る
    let htmlContent = '';
    if (isEditMode) {
        htmlContent += `<button class="delete-btn">×</button>`;
    }
    
    htmlContent += `
        <h3>${frontText}</h3>
        <p class="answer">${backText}</p>
    `;
    
    cardDiv.innerHTML = htmlContent;

    // クリックで答えを表示
    cardDiv.addEventListener('click', () => {
        cardDiv.classList.toggle('show-answer');
    });

    // 削除ボタンの処理（編集モードのみ）
    if (isEditMode) {
        const delBtn = cardDiv.querySelector('.delete-btn');
        delBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // カードのクリックイベントを止める
            if(confirm('本当に削除しますか？')) {
                cardsData.splice(index, 1);
                saveToLocalStorage();
                init();
            }
        });
    }

    container.appendChild(cardDiv);
}

// --- 学習モードの処理 ---

// 「学習スタート」ボタン
startBtn.addEventListener('click', () => {
    if (cardsData.length === 0) {
        alert('カードが登録されていません。まずは追加してください。');
        return;
    }

    // 1. 画面の切り替え
    editArea.classList.add('hidden');
    studyArea.classList.remove('hidden');
    startBtn.disabled = true; // 連打防止
    reverseModeCheckbox.disabled = true;

    // 2. データをコピーしてシャッフル（ランダム順）
    // 配列をランダムに並び替えるロジック
    studyQueue = [...cardsData].sort(() => Math.random() - 0.5);
    currentStudyIndex = 0;

    // 3. 最初のカードを表示
    showStudyCard();
});

// 学習カードを表示する関数
function showStudyCard() {
    studyCardContainer.innerHTML = ''; // 前のカードを消す

    if (currentStudyIndex >= studyQueue.length) {
        // 全部終わったら
        if(confirm('一周しました！学習を終了しますか？\n（キャンセルで最初から再スタート）')) {
            quitStudyMode();
            return;
        } else {
            // 再シャッフルして継続
            studyQueue.sort(() => Math.random() - 0.5);
            currentStudyIndex = 0;
        }
    }

    const cardData = studyQueue[currentStudyIndex];
    const isReverse = reverseModeCheckbox.checked;

    // 逆モードなら「答え」を表面、「問題」を裏面にする
    const front = isReverse ? cardData.answer : cardData.question;
    const back = isReverse ? cardData.question : cardData.answer;

    // 学習用カードを作成（削除ボタンなし）
    createCardElement(front, back, null, studyCardContainer, false);
}

// 「次のカードへ」ボタン
nextCardBtn.addEventListener('click', () => {
    currentStudyIndex++;
    showStudyCard();
});

// 「学習を終了」ボタン
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