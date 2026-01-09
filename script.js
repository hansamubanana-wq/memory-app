// --- HTML要素の取得 ---
// 見出し
const questionInput = document.getElementById('question');

// 詳細パーツ（意味・接続）
const imiInput = document.getElementById('imi');
const setsuzokuInput = document.getElementById('setsuzoku');

// 詳細パーツ（活用形）
const kMizen = document.getElementById('k-mizen');
const kRenyo = document.getElementById('k-renyo');
const kShushi = document.getElementById('k-shushi');
const kRentai = document.getElementById('k-rentai');
const kIzen = document.getElementById('k-izen');
const kMeirei = document.getElementById('k-meirei');

const addBtn = document.getElementById('add-btn');
const cardsContainer = document.getElementById('cards-container');

// 学習モード用
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

init();

function init() {
    cardsContainer.innerHTML = '';
    cardsData.forEach((card, index) => {
        createCardElement(card.question, card.answer, index, cardsContainer, true);
    });
}

// --- カード追加機能（大改造） ---
addBtn.addEventListener('click', () => {
    // 1. 各入力欄から値を取得
    const qText = questionInput.value.trim();
    const imi = imiInput.value.trim();
    const setsu = setsuzokuInput.value.trim();
    
    // 活用形
    const mizen = kMizen.value.trim();
    const renyo = kRenyo.value.trim();
    const shushi = kShushi.value.trim();
    const rentai = kRentai.value.trim();
    const izen = kIzen.value.trim();
    const meirei = kMeirei.value.trim();

    // 2. バリデーション（見出しだけは必須）
    if(qText === '') {
        alert('見出し（助動詞・単語）は必ず入力してください！');
        return;
    }

    // 3. バラバラの情報を結合して「詳細（答え）」の文章を作る
    // もし入力がない項目があっても、空文字なら表示されないだけなのでOK
    let combinedAnswer = '';

    if(imi) combinedAnswer += `【意味】${imi}\n`;
    if(setsu) combinedAnswer += `【接続】${setsu}\n`;
    
    // 活用表の部分（一つでも入力があれば表示）
    if(mizen || renyo || shushi || rentai || izen || meirei) {
        combinedAnswer += `\n【活用】\n`;
        combinedAnswer += `未然：${mizen}\n`;
        combinedAnswer += `連用：${renyo}\n`;
        combinedAnswer += `終止：${shushi}\n`;
        combinedAnswer += `連体：${rentai}\n`;
        combinedAnswer += `已然：${izen}\n`;
        combinedAnswer += `命令：${meirei}`;
    }

    // 4. データを保存
    const newCard = { question: qText, answer: combinedAnswer };
    cardsData.push(newCard);
    saveToLocalStorage();
    init();

    // 5. 入力欄をクリア（全部空にする）
    questionInput.value = '';
    imiInput.value = '';
    setsuzokuInput.value = '';
    kMizen.value = '';
    kRenyo.value = '';
    kShushi.value = '';
    kRentai.value = '';
    kIzen.value = '';
    kMeirei.value = '';
    
    // 最初の入力欄にフォーカスを戻す
    questionInput.focus();
});

// --- 以下、既存機能はそのまま ---

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
            if(confirm('削除しますか？')) {
                cardsData.splice(index, 1);
                saveToLocalStorage();
                init();
            }
        });
    }

    container.appendChild(cardDiv);
}

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
        if(confirm('一周しました！学習を終了しますか？')) {
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