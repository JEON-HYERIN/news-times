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

let totalResults = 0;
let page = 1
const pageSize = 10
const groupSize = 5;

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
    url.searchParams.set('page', page);
    url.searchParams.set('pageSize', pageSize);
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('data', data);

    if(response.status === 200) {
      if(data.articles.length === 0) {
        throw new Error('No result for this search');
      }
      articles = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
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

const paginationRender = () => {
  // totalResults -> data.totalResults 31
  // pageSize 5
  // page 2
  // groupSize 3
  // pageGroup -> Math.ceil(page / groupSize) 1
  // totalPage -> Math.ceil(totalResults / pageSize) 7
  // lastPage -> groupSize * pageGroup
  // firstPage -> lastPage - (groupSize - 1)

  const pageGroup = Math.ceil(page / groupSize);
  const totalPage = Math.ceil(totalResults / pageSize);

  let lastPage = pageGroup * groupSize;
  if(lastPage > totalPage) {
    lastPage = totalPage;
  }

  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  let paginationHTML = ``;
  if(page !== firstPage) {
    paginationHTML = `<li class="page-item"><a onclick="moveToPage(1)" class="page-link" href="#">&lt;&lt;</a></li><li class="page-item"><a onclick="moveToPage(${page - 1})" class="page-link" href="#">&lt;</a></li>`;
  } 
  for(let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${page === i ? 'active' : ''}"><a onclick="moveToPage(${i})" class="page-link" href="#">${i}</a></li>`;

  }
  if(page !== totalPage) {
    paginationHTML += `<li class="page-item"><a onclick="moveToPage(${page + 1})" class="page-link" href="#">&gt;</a></li><li class="page-item"><a onclick="moveToPage(${totalPage})" class="page-link" href="#">&gt;&gt;</a></li>`;
  }
  document.querySelector('.pagination').innerHTML = paginationHTML;
}

function moveToPage(pageNum) {
  page = pageNum;
  getNews();
}

init();