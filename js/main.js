const API_KEY = `78462abb0f094416b661b51f2711b8c9`;

let url = new URL(
  `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
);
let articles = [];

const searchIcon = document.querySelector('.search-icon');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const menus = document.querySelector('.menus');

searchIcon.addEventListener('click', () => {
  document.querySelector('.search').classList.toggle('active');
});
searchInput.addEventListener('keydown', (event) => {
  if (event.code === 'Enter') {
    getNewsByKeyword(event);
  }
});
searchBtn.addEventListener('click', getNewsByKeyword);
menus.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    getNewsByCategory(event);
  }
});

const getNews = async () => {
  const response = await fetch(url);
  const data = await response.json();

  articles = data.articles;
  render();
};
const getLatestNews = () => {
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
  );

  getNews();
};

getLatestNews();

function getNewsByCategory(event) {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
  );

  getNews();
}

function getNewsByKeyword() {
  const keyword = searchInput.value;
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
  );

  getNews();
  searchInput.value = '';
}

function render() {
  let resultHTML = ``;
  articles
    .map((article) => {
      resultHTML += `<div class='row news'>
    <div class='col-lg-4'>
      <img
        src=${
          article.urlToImage ||
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU'
        }
        alt=''
        aria-hidden='true'
      />
    </div>
    <div class='col-lg-8'>
      <h2>${article.title || '내용없음'}</h2>
      <p>${
        article.description === null
          ? '내용없음'
          : article.description.length > 200
          ? article.description.substring(0, 200) + '...'
          : article.description
      }</p>
      <span>${article.source.name || 'no source'} ${moment(
        '20231112',
        'YYYYMMDD'
      ).fromNow()}</span>
    </div>
  </div>`;
    })
    .join();
  document.getElementById('news-board').innerHTML = resultHTML;
}
