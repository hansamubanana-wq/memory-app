// --- HTML要素の取得 ---
const questionInput = document.getElementById('question');
const imiInput = document.getElementById('imi');
const setsuzokuInput = document.getElementById('setsuzoku'); // select
const typeInput = document.getElementById('k-type'); // select

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
const resetDataBtn = document.getElementById('reset-data-btn');
const quitBtn = document.getElementById('quit-btn');

const quizQuestionCard = document.getElementById('quiz-question-card');
const step1 = document.getElementById('quiz-step-1');
const step2 = document.getElementById('quiz-step-2');
const step3 = document.getElementById('quiz-step-3');
const optionsSetsuzoku = document.getElementById('options-setsuzoku');
const optionsType = document.getElementById('options-type');
const finalAnswerDisplay = document.getElementById('final-answer-display');
const nextCardBtn = document.getElementById('next-card-btn');

// --- 構造化されたプリセットデータ（23枚） ---
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

// 選択肢の候補リスト
const SETSUZOKU_LIST = ["未然形", "連用形", "終止形", "連体形", "已然形", "命令形", "体言"];
const TYPE_LIST = ["四段", "上一段", "下一段", "上二段", "下二段", "カ変", "サ変", "ナ変", "ラ変", "形容詞", "形容動詞", "特殊", "無変化"];

// --- データ読み込み（自動修復機能付き） ---
let cardsData = null;

try {
    const rawData = localStorage.getItem('cards');
    if (rawData) {
        const parsed = JSON.parse(rawData);
        // データチェック：配列であり、かつ最新形式（kプロパティを持っているか）を確認
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].k) {
            cardsData = parsed;
        } else {
            console.log("古いデータ形式のため、初期データを使用します");
        }
    }
} catch (e) {
    console.error("データ読み込みエラー", e);
}

// データがない、または古かった場合はプリセットを使う
if (!cardsData) {
    cardsData = [...PRESET_DATA];
    saveToLocalStorage();
}

let studyQueue = [];
let currentStudyIndex = 0;

init();

function init() {
    cardsContainer.innerHTML = '';
    cardsData.forEach((card, index) => {
        // 万が一壊れたデータが混ざっていてもエラーで止まらないようにする
        if (card && card.k) {
            createCardElement(card, index, cardsContainer);
        }
    });
}

// リセットボタン
if (resetDataBtn) {
    resetDataBtn.addEventListener('click', () => {
        if(confirm('注意：全てのデータが消え、初期データ（23枚）に戻ります。\nよろしいですか？')) {
            cardsData = [...PRESET_DATA];
            saveToLocalStorage();
            init();
            alert('データを初期化しました！');
        }
    });
}

// カード追加（構造化して保存）
addBtn.addEventListener('click', () => {
    const q = questionInput.value.trim();
    const setsu = setsuzokuInput.value;
    const type = typeInput.value;
    const imi = imiInput.value.trim();
    
    const k = [
        kMizen.value.trim(), kRenyo.value.trim(), kShushi.value.trim(),
        kRentai.value.trim(), kIzen.value.trim(), kMeirei.value.trim()
    ];

    if(!q || !setsu || !type) {
        alert('見出し、接続、活用の種類は必須です（クイズに使います）');
        return;
    }

    const newCard = { q, imi, setsu, type, k };
    cardsData.push(newCard);
    saveToLocalStorage();
    init();

    // 入力欄クリア
    questionInput.value = '';
    imiInput.value = '';
    setsuzokuInput.value = '';
    typeInput.value = '';
    kMizen.value = ''; kRenyo.value = ''; kShushi.value = '';
    kRentai.value = ''; kIzen.value = ''; kMeirei.value = '';
    questionInput.focus();
});

// リスト表示用カード作成
function createCardElement(data, index, container) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    
    // 一覧では簡易表示
    cardDiv.innerHTML = `
        <button class="delete-btn">×</button>
        <h3>${data.q}</h3>
        <p class="detail">接続：${data.setsu}</p>
        <p class="detail">種類：${data.type}</p>
        <p class="answer">
【意味】${data.imi}
【活用】
未然：${data.k[0] || ''}
連用：${data.k[1] || ''}
終止：${data.k[2] || ''}
連体：${data.k[3] || ''}
已然：${data.k[4] || ''}
命令：${data.k[5] || ''}
        </p>
    `;

    cardDiv.addEventListener('click', () => cardDiv.classList.toggle('show-answer'));

    cardDiv.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if(confirm('削除しますか？')) {
            cardsData.splice(index, 1);
            saveToLocalStorage();
            init();
        }
    });

    container.appendChild(cardDiv);
}

// --- クイズロジック ---
startBtn.addEventListener('click', () => {
    if (cardsData.length === 0) { alert('札がありません'); return; }
    editArea.classList.add('hidden');
    studyArea.classList.remove('hidden');
    startBtn.disabled = true;
    if(resetDataBtn) resetDataBtn.style.display = 'none';

    studyQueue = [...cardsData].sort(() => Math.random() - 0.5);
    currentStudyIndex = 0;
    showQuiz();
});

function showQuiz() {
    // 終了判定
    if (currentStudyIndex >= studyQueue.length) {
        if(confirm('一周しました！終了しますか？')) {
            quitStudy(); return;
        } else {
            studyQueue.sort(() => Math.random() - 0.5);
            currentStudyIndex = 0;
        }
    }

    const data = studyQueue[currentStudyIndex];
    if (!data || !data.k) {
        // 万が一壊れたデータならスキップ
        currentStudyIndex++;
        showQuiz();
        return;
    }

    // UI初期化
    quizQuestionCard.innerHTML = `<h3>${data.q}</h3>`;
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');
    finalAnswerDisplay.innerText = '';

    // Q1. 接続クイズ生成
    generateOptions(optionsSetsuzoku, SETSUZOKU_LIST, data.setsu, () => {
        // 正解したら次へ
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
    });

    // Q2. 種類クイズ生成
    generateOptions(optionsType, TYPE_LIST, data.type, () => {
        // 正解したら次へ
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
        
        // 最終答え表示
        finalAnswerDisplay.innerText = `【正解】
接続：${data.setsu}
種類：${data.type}

【意味】
${data.imi}

【活用】
未然：${data.k[0] || ''}
連用：${data.k[1] || ''}
終止：${data.k[2] || ''}
連体：${data.k[3] || ''}
已然：${data.k[4] || ''}
命令：${data.k[5] || ''}`;
    });
}

// 選択肢ボタンを生成する関数
function generateOptions(container, list, correctAnswer, onCorrect) {
    container.innerHTML = '';
    
    // 正解を含めた4択を作る
    let choices = [correctAnswer];
    let others = list.filter(item => item !== correctAnswer);
    others = others.sort(() => Math.random() - 0.5).slice(0, 3);
    choices = choices.concat(others);
    choices.sort(() => Math.random() - 0.5);

    choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.innerText = choice;
        
        btn.addEventListener('click', () => {
            if (choice === correctAnswer) {
                // 正解
                btn.classList.add('correct');
                setTimeout(onCorrect, 600);
            } else {
                // 不正解
                btn.classList.add('wrong');
            }
        });
        
        container.appendChild(btn);
    });
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
    if(resetDataBtn) resetDataBtn.style.display = 'block';
}

function saveToLocalStorage() {
    localStorage.setItem('cards', JSON.stringify(cardsData));
}