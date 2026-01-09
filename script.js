// HTMLの要素（部品）を取得して変数に入れる
const questionInput = document.getElementById('question');
const answerInput = document.getElementById('answer');
const addBtn = document.getElementById('add-btn');
const cardsContainer = document.getElementById('cards-container');

// アプリ起動時：以前保存したデータがあれば読み込む。なければ空っぽのリストにする。
let cardsData = JSON.parse(localStorage.getItem('cards')) || [];

// ページを開いた瞬間に、保存されているカードを画面に描画する
init();

function init() {
    cardsData.forEach(card => {
        createCardElement(card.question, card.answer);
    });
}

// 「カードを追加」ボタンを押したときの動作
addBtn.addEventListener('click', () => {
    const questionText = questionInput.value;
    const answerText = answerInput.value;

    // もし空欄があったらアラートを出して何もしない
    if(questionText.trim() === '' || answerText.trim() === '') {
        alert('問題と答えの両方を入力してください！');
        return;
    }

    // 1. データの管理：新しいカード情報をリストに追加
    const newCard = { question: questionText, answer: answerText };
    cardsData.push(newCard);

    // 2. 保存：ブラウザの保存領域（ローカルストレージ）に書き込む
    saveToLocalStorage();

    // 3. 表示：画面にカードを表示させる
    createCardElement(questionText, answerText);

    // 4. 後始末：入力欄を空にする
    questionInput.value = '';
    answerInput.value = '';
});

// 画面にカードのHTMLを作る関数
function createCardElement(q, a) {
    // <div>タグを新しく作る
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card'); // class="card" をつける（CSSが適用される）

    // カードの中身のHTMLを作る
    cardDiv.innerHTML = `
        <h3>${q}</h3>
        <p class="answer">${a}</p>
    `;

    // クリックしたときの動作（答えを表示/非表示 切り替え）
    cardDiv.addEventListener('click', () => {
        cardDiv.classList.toggle('show-answer');
    });

    // 完成したカードを画面（コンテナ）に追加する
    cardsContainer.appendChild(cardDiv);
}

// データを永続的に保存する関数
function saveToLocalStorage() {
    // 配列などのデータはそのまま保存できないので、JSON（文字）に変換して保存する
    localStorage.setItem('cards', JSON.stringify(cardsData));
}