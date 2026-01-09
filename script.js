// --- HTML要素の取得 ---
const questionInput = document.getElementById('question');
const imiInput = document.getElementById('imi');
const setsuzokuInput = document.getElementById('setsuzoku');
const typeInput = document.getElementById('k-type');

const kMizen = document.getElementById('k-mizen');
const kRenyo = document.getElementById('k-renyo');
const kShushi = document.getElementById('k-shushi');
const kRentai = document.getElementById('k-rentai');
const kIzen = document.getElementById('k-izen');
const kMeirei = document.getElementById('k-meirei');

const addBtn = document.getElementById('add-btn');
const cardsContainer = document.getElementById('cards-container');

// クイズ用
const editArea = document.getElementById('edit-area');
const studyArea = document.getElementById('study-area');
const startBtn = document.getElementById('start-btn');
const retryMissBtn = document.getElementById('retry-miss-btn');
const resetDataBtn = document.getElementById('reset-data-btn');
const quitBtn = document.getElementById('quit-btn');

const quizQuestionCard = document.getElementById('quiz-question-card');
const step1 = document.getElementById('quiz-step-1');
const step2 = document.getElementById('quiz-step-2');
const step3 = document.getElementById('quiz-step-3');

const quizInputSetsu = document.getElementById('quiz-input-setsu');
const quizInputType = document.getElementById('quiz-input-type');
const fbSetsu = document.getElementById('fb-setsu');
const fbType = document.getElementById('fb-type');
const checkStep1Btn = document.getElementById('check-step1-btn');
const goStep2Btn = document.getElementById('go-step2-btn'); // 追加

const quizKInputs = document.querySelectorAll('.quiz-k-input');
const checkStep2Btn = document.getElementById('check-step2-btn');
const goStep3Btn = document.getElementById('go-step3-btn'); // 追加

const finalAnswerDisplay = document.getElementById('final-answer-display');
const nextCardBtn = document.getElementById('next-card-btn');

// --- プリセットデータ ---
const PRESET_DATA = [
    { q: "る", imi: "受身・尊敬・可能・自発", setsu: "未然形", type: "下二段", k: ["れ", "れ", "る", "るる", "るれ", "れよ"] },
    { q: "らる", imi: "受身・尊敬・可能・自発", setsu: "未然形", type: "下二段", k: ["られ", "られ", "らる", "らるる", "らるれ", "られよ"] },
    { q: "す", imi: "使役・尊敬", setsu: "未然形", type: "四段", k: ["せ", "せ", "す", "する", "すれ", "せよ"] },
    { q: "さす", imi: "使役・尊敬", setsu: "未然形", type: "下二段", k: ["させ", "させ", "さす", "さする", "さすれ", "させよ"] },
    { q: "しむ", imi: "使役・尊敬", setsu: "未然形", type: "下二段", k: ["しめ", "しめ", "しむ", "しむる", "しむれ", "しめよ"] },
    { q: "む", imi: "推量・意志・勧誘・仮定・婉曲", setsu: "未然形", type: "四段", k: ["―", "―", "む", "む", "―", "―"] },
    { q: "むず", imi: "推量・意志・勧誘・仮定・婉曲", setsu: "未然形", type: "サ変", k: ["―", "―", "むず", "むず", "―", "―"] },
    { q: "ず", imi: "打消", setsu: "未然形", type: "特殊", k: ["ず/ざら", "ず/ざり", "ず", "ぬ/ざる", "ね/ざれ", "―/ざれ"] },
    { q: "じ", imi: "打消意志・打消推量", setsu: "未然形", type: "無変化", k: ["じ", "じ", "じ", "じ", "じ", "―"] },
    { q: "まし", imi: "反実仮想・ためらい", setsu: "未然形", type: "特殊", k: ["まし", "まし", "まし", "まし", "―", "―"] },
    { q: "まほし", imi: "願望", setsu: "未然形", type: "形容詞", k: ["まほしく", "まほしく", "まほし", "まほしき", "まほしけれ", "―"] },
    { q: "き", imi: "過去（直接経験）", setsu: "連用形", type: "特殊", k: ["(せ)", "き", "き", "し", "しか", "―"] },
    { q: "けり", imi: "過去・詠嘆", setsu: "連用形", type: "ラ変", k: ["―", "けり", "けり", "ける", "けれ", "―"] },
    { q: "つ", imi: "完了・強意", setsu: "連用形", type: "下二段", k: ["て", "て", "つ", "つる", "つれ", "てよ"] },
    { q: "ぬ", imi: "完了・強意", setsu: "連用形", type: "ナ変", k: ["ね", "ね", "ぬ", "ぬる", "ぬれ", "ねよ"] },
    { q: "たり（完了）", imi: "完了・存続", setsu: "連用形", type: "ラ変", k: ["たら", "たり", "たり", "たる", "たれ", "たれ"] },
    { q: "べし", imi: "推量・意志・可能・当然・命令", setsu: "終止形", type: "形容詞", k: ["べから", "べく", "べし", "べき", "べけれ", "―"] },
    { q: "まじ", imi: "打消推量・不可能・禁止", setsu: "終止形", type: "形容詞", k: ["まじから", "まじく", "まじ", "まじき", "まじけれ", "―"] },
    { q: "らむ", imi: "現在推量・原因推量・伝聞・婉曲", setsu: "終止形", type: "四段", k: ["―", "―", "らむ", "らむ", "―", "―"] },
    { q: "らし", imi: "推定", setsu: "終止形", type: "無変化", k: ["らし", "らし", "らし", "らし", "らし", "らし"] },
    { q: "なり（断定）", imi: "断定・存在", setsu: "体言", type: "形容動詞", k: ["なら", "なり", "なり", "なる", "なれ", "なれ"] },
    { q: "たり（断定）", imi: "断定", setsu: "体言", type: "形容動詞", k: ["たら", "たり", "たり", "たる", "たれ", "たれ"] },
    { q: "ごとし", imi: "比況・例示", setsu: "連体形", type: "形容詞", k: ["ごとく", "ごとく", "ごとし", "ごとき", "ごとけれ", "―"] }
];

// --- データ読み込み ---
let cardsData = null;
try {
    const rawData = localStorage.getItem('cards');
    if (rawData) {
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].k) {
            cardsData = parsed;
        }
    }
} catch (e) { console.error(e); }

if (!cardsData) {
    cardsData = PRESET_DATA.map(d => ({ ...d, stats: { correct: 0, miss: 0 } }));
    saveToLocalStorage();
} else {
    cardsData = cardsData.map(d => {
        if (!d.stats) d.stats = { correct: 0, miss: 0 };
        return d;
    });
}

let studyQueue = [];
let currentStudyIndex = 0;
let currentCardData = null;
let currentMistakeCount = 0;

init();

function init() {
    cardsContainer.innerHTML = '';
    cardsData.forEach((card, index) => {
        if (card && card.k) {
            createCardElement(card, index, cardsContainer);
        }
    });
}

// リセットボタン
resetDataBtn.addEventListener('click', () => {
    if(confirm('全てのデータを初期化してよろしいですか？\n学習記録も消去されます。')) {
        cardsData = PRESET_DATA.map(d => ({ ...d, stats: { correct: 0, miss: 0 } }));
        saveToLocalStorage();
        init();
        alert('データを初期化しました');
    }
});

// カード追加
addBtn.addEventListener('click', () => {
    const q = questionInput.value.trim();
    const setsu = setsuzokuInput.value;
    const type = typeInput.value;
    const imi = imiInput.value.trim();
    const k = [
        kMizen.value.trim(), kRenyo.value.trim(), kShushi.value.trim(),
        kRentai.value.trim(), kIzen.value.trim(), kMeirei.value.trim()
    ];

    if(!q || !setsu || !type) { alert('見出し、接続、活用の種類は必須です'); return; }

    const newCard = { q, imi, setsu, type, k, stats: { correct: 0, miss: 0 } };
    cardsData.push(newCard);
    saveToLocalStorage();
    init();

    // クリア
    questionInput.value = ''; imiInput.value = '';
    setsuzokuInput.value = ''; typeInput.value = '';
    kMizen.value = ''; kRenyo.value = ''; kShushi.value = '';
    kRentai.value = ''; kIzen.value = ''; kMeirei.value = '';
    questionInput.focus();
});

// カード作成
function createCardElement(data, index, container) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    
    const stats = data.stats || { correct: 0, miss: 0 };
    let statsHtml = `<div class="stats-label stats-none">未学習</div>`;
    if (stats.correct + stats.miss > 0) {
        if (stats.miss === 0) {
            statsHtml = `<div class="stats-label stats-good">完璧! (${stats.correct})</div>`;
        } else {
            statsHtml = `<div class="stats-label stats-bad">ミス: ${stats.miss}</div>`;
        }
    }

    cardDiv.innerHTML = `
        <button class="delete-btn">×</button>
        <h3>${data.q}</h3>
        ${statsHtml}
        <p class="detail" style="margin-top:5px;">接続：${data.setsu}</p>
        <p class="detail">種類：${data.type}</p>
        <p class="answer">
【意味】${data.imi}
【活用】
未然：${data.k[0]||''} 連用：${data.k[1]||''} 終止：${data.k[2]||''}
連体：${data.k[3]||''} 已然：${data.k[4]||''} 命令：${data.k[5]||''}
        </p>
    `;
    cardDiv.addEventListener('click', () => cardDiv.classList.toggle('show-answer'));
    cardDiv.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if(confirm('削除しますか？')) { cardsData.splice(index, 1); saveToLocalStorage(); init(); }
    });
    container.appendChild(cardDiv);
}

// --- クイズロジック ---
startBtn.addEventListener('click', () => startQuiz(false));
retryMissBtn.addEventListener('click', () => startQuiz(true));

function startQuiz(onlyMiss) {
    if (cardsData.length === 0) { alert('札がありません'); return; }

    let targetCards = [...cardsData];
    if (onlyMiss) {
        targetCards = targetCards.filter(card => card.stats && card.stats.miss > 0);
        if (targetCards.length === 0) {
            alert('間違えたカードはありません！'); return;
        }
    }

    studyQueue = targetCards.sort(() => Math.random() - 0.5);
    
    editArea.classList.add('hidden');
    studyArea.classList.remove('hidden');
    startBtn.disabled = true;
    retryMissBtn.disabled = true;
    if(resetDataBtn) resetDataBtn.style.display = 'none';

    currentStudyIndex = 0;
    showQuiz();
}

function showQuiz() {
    if (currentStudyIndex >= studyQueue.length) {
        if(confirm('学習が終了しました！リストに戻りますか？')) { quitStudy(); return; }
        else { studyQueue.sort(() => Math.random() - 0.5); currentStudyIndex = 0; }
    }

    currentCardData = studyQueue[currentStudyIndex];
    if (!currentCardData || !currentCardData.k) { currentStudyIndex++; showQuiz(); return; }
    
    currentMistakeCount = 0;

    quizQuestionCard.innerHTML = `<h3>${currentCardData.q}</h3>`;
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');
    
    quizInputSetsu.value = ''; quizInputSetsu.className = 'quiz-input'; quizInputSetsu.disabled = false;
    quizInputType.value = ''; quizInputType.className = 'quiz-input'; quizInputType.disabled = false;
    fbSetsu.textContent = ''; fbType.textContent = '';
    
    quizKInputs.forEach(input => {
        input.value = ''; input.className = 'quiz-k-input'; input.disabled = false;
        input.nextElementSibling.textContent = '';
    });
    
    // ボタンの表示リセット
    checkStep1Btn.classList.remove('hidden');
    goStep2Btn.classList.add('hidden');
    checkStep2Btn.classList.remove('hidden');
    goStep3Btn.classList.add('hidden');
}

// --- Step1 答え合わせ ---
checkStep1Btn.addEventListener('click', () => {
    const userSetsu = normalizeText(quizInputSetsu.value);
    const ansSetsu = normalizeText(currentCardData.setsu);
    const userType = normalizeText(quizInputType.value);
    const ansType = normalizeText(currentCardData.type);

    let isWrong = false;

    if (checkMatch(userSetsu, ansSetsu)) {
        quizInputSetsu.classList.add('correct-field');
        fbSetsu.textContent = "⭕️"; fbSetsu.className = "feedback-msg correct";
    } else {
        quizInputSetsu.classList.add('wrong-field');
        fbSetsu.textContent = `❌ 正解: ${currentCardData.setsu}`; fbSetsu.className = "feedback-msg wrong";
        isWrong = true;
    }

    if (checkMatch(userType, ansType)) {
        quizInputType.classList.add('correct-field');
        fbType.textContent = "⭕️"; fbType.className = "feedback-msg correct";
    } else {
        quizInputType.classList.add('wrong-field');
        fbType.textContent = `❌ 正解: ${currentCardData.type}`; fbType.className = "feedback-msg wrong";
        isWrong = true;
    }

    if (isWrong) currentMistakeCount++;

    quizInputSetsu.disabled = true;
    quizInputType.disabled = true;

    // タイマー削除: ボタン切り替えのみ
    checkStep1Btn.classList.add('hidden');
    goStep2Btn.classList.remove('hidden');
});

// Step1 -> Step2 遷移
goStep2Btn.addEventListener('click', () => {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
    quizKInputs[0].focus();
});

// --- Step2 答え合わせ ---
checkStep2Btn.addEventListener('click', () => {
    let isWrong = false;

    quizKInputs.forEach((input, index) => {
        const userVal = normalizeText(input.value);
        const ansVal = normalizeText(currentCardData.k[index]);
        const feedback = input.nextElementSibling;
        const answers = ansVal.split('/');
        const isMatch = answers.some(ans => checkMatch(userVal, ans));

        if (isMatch) {
            input.classList.add('correct-field');
        } else {
            input.classList.add('wrong-field');
            feedback.textContent = currentCardData.k[index];
            isWrong = true;
        }
        input.disabled = true;
    });

    if (isWrong) currentMistakeCount++;
    updateStats(currentCardData, currentMistakeCount);

    // タイマー削除: ボタン切り替えのみ
    checkStep2Btn.classList.add('hidden');
    goStep3Btn.classList.remove('hidden');

    finalAnswerDisplay.innerText = `【正解】
接続：${currentCardData.setsu}
種類：${currentCardData.type}

【意味】
${currentCardData.imi}

【活用】
未然：${currentCardData.k[0]}
連用：${currentCardData.k[1]}
終止：${currentCardData.k[2]}
連体：${currentCardData.k[3]}
已然：${currentCardData.k[4]}
命令：${currentCardData.k[5]}`;
});

// Step2 -> Step3 遷移
goStep3Btn.addEventListener('click', () => {
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
});

function updateStats(card, mistakeCount) {
    if (!card.stats) card.stats = { correct: 0, miss: 0 };
    if (mistakeCount === 0) card.stats.correct++;
    else card.stats.miss++;
    saveToLocalStorage();
}

function normalizeText(text) {
    if(!text) return "";
    return text.replace(/\s+/g, '').replace(/・/g, '').replace(/、/g, '');
}

function checkMatch(user, answer) {
    if (user === answer) return true;
    if (answer.includes(user) && user.length >= 2) return true; 
    return false;
}

nextCardBtn.addEventListener('click', () => {
    currentStudyIndex++;
    showQuiz();
});

quitBtn.addEventListener('click', quitStudy);

function quitStudy() {
    studyArea.classList.add('hidden');
    editArea.classList.remove('hidden');
    startBtn.disabled = false;
    retryMissBtn.disabled = false;
    if(resetDataBtn) resetDataBtn.style.display = 'block';
    init();
}

function saveToLocalStorage() {
    localStorage.setItem('cards', JSON.stringify(cardsData));
}