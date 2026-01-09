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
    // 【変更点】毎回画面をクリアしてから再描画する（削除後のズレを防ぐため）
    cardsContainer.innerHTML = '';
    
    // 全データを使ってカードを作り直す。index（何番目か）も渡す。
    cardsData.forEach((card, index) => {
        createCardElement(card.question, card.answer, index);
    });
}

// 「カードを追加」ボタンを押したときの動作
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
    
    // 【変更点】追加したら画面全体を再描画する
    init();

    questionInput.value = '';
    answerInput.value = '';
});

// 画面にカードのHTMLを作る関数（indexを受け取るように変更）
function createCardElement(q, a, index) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    // 【変更点】削除ボタン（×）のHTMLを追加
    cardDiv.innerHTML = `
        <button class="delete-btn">×</button>
        <h3>${q}</h3>
        <p class="answer">${a}</p>
    `;

    // カードをクリックしたときの動作（答え表示）
    cardDiv.addEventListener('click', () => {
        cardDiv.classList.toggle('show-answer');
    });

    // 【追加】削除ボタンをクリックしたときの動作
    const delBtn = cardDiv.querySelector('.delete-btn');
    delBtn.addEventListener('click', (event) => {
        // 重要：カード自体のクリックイベント（答え表示）を止める
        event.stopPropagation();

        if(confirm('本当に削除しますか？')) {
            // 配列からデータを削除（index番目から1つ消す）
            cardsData.splice(index, 1);
            saveToLocalStorage();
            init(); // 画面を更新して番号を振り直す
        }
    });

    cardsContainer.appendChild(cardDiv);
}

// データを永続的に保存する関数
function saveToLocalStorage() {
    localStorage.setItem('cards', JSON.stringify(cardsData));
}