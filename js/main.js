const API_KEY = `6e847aa220e241d291e62dc767b055c8`;

let url = new URL(
  `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
);
let articles = [];

const searchForm = document.querySelector('.search-form');
const searchIcon = document.querySelector('.search-icon');
const searchInput = document.querySelector('.search-input');
const menus = document.querySelector('.menus');
const newsBoard = document.querySelector('#news-board');

const init = function() {
  getLatestNews();
  bindEvents();
}

const bindEvents = function() {
  searchIcon.addEventListener('click', () => searchForm.classList.toggle('active'));
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    getNewsByKeyword();
  });
  menus.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      getNewsByCategory(event);
    }
  });
}

const getNews = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if(response.status === 200) {
      if(data.totalResults === 0) {
        throw new Error('No result for this search');
      }
      articles = data.articles;
      render();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestNews = () => {
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
  );

  getNews();
};

const getNewsByCategory = (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
  );

  getNews();
}

const getNewsByKeyword = () => {
  const keyword = searchInput.value;
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
  );

  getNews();
  searchInput.value = '';
}

const render = () => {
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
  newsBoard.innerHTML = resultHTML;
}

const errorRender = (errorMessage) => {
  const errorHTML = `
  <div class='alert alert-danger' role='alert'>
   ${errorMessage}
  </div>`;

  newsBoard.innerHTML = errorHTML;
}

init();