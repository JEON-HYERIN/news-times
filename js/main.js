const API_KEY = `6e847aa220e241d291e62dc767b055c8`;

let articles = [];
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const menus = document.querySelector('.menus');
const searchIcon = document.querySelector('.search-icon');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const newsBoard = document.querySelector('#news-board');

let url = new URL(
  `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
);

const init = () => {
  getLatestNews();
  bindEvents();
}

const bindEvents = () => {
  searchIcon.addEventListener('click', () => searchForm.classList.toggle('active'));
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    getNewsByKeyword();
  });
  menus.addEventListener('click', (event) => {
    if(event.target.tagName === 'BUTTON') {
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
  
    console.log("response", response);
    console.log("data", data);

    if(response.status === 200) {
      if(data.articles.length === 0) {
        throw new Error('No result for this search');
      }
      totalResults = data.totalResults;
      articles = data.articles;
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch(error) {
    errorRender(error.message);
  }
}

const getLatestNews = () => {
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
  );

  getNews();
};

const getNewsByCategory = (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`);
  page = 1;

  getNews();
}

const getNewsByKeyword = () => {
  const keyword = searchInput.value;
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`);

  page = 1;
  searchInput.value = '';
  getNews();
}

const render = () => {
  const resultHTML = articles.map((article) => {
    return `<div class="row news">
      <div class="col-lg-4">
        <img
          src=${article.urlToImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"}
          alt=""
          aria-hidden="true"
        />
      </div>
      <div class="col-lg-8">
        <h2>${article.title || '내용없음'}</h2>
        <p>${article.description === null ? '내용없음' : article.description.length > 200 ? article.description.substring(0, 200) + '...' : article.description}</p>
        <span>${article.source.name || 'no source'} ${moment("20231112", "YYYYMMDD").fromNow()}</span>
      </div>
    </div>`;
  }).join();

  newsBoard.innerHTML = resultHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `
    <div class="alert alert-danger" role="alert">
      ${errorMessage}
    </div>`;

  newsBoard.innerHTML = errorHTML;
}

const paginationRender = () => {
  // totalResults 101
  // pageSize 10
  // page 3
  // groupSize 5
  // totalPage => Math.ceil(totalResults / pageSize) 11
  // pageGroup => Math.ceil(page / groupSize) 1
  // lastPage => pageGroup * groupSize 5
  // firstPage => lastPage - (groupSize - 1)

  const totalPage = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;
  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  let paginationHTML = ``;

  if(page > 1) {
    paginationHTML = `<li class="page-item"><a onclick="moveToPage(1)" class="page-link" href="#">&lt;&lt;</a></li><li class="page-item"><a onclick="moveToPage(${page-1})" class="page-link" href="#">&lt;</a></li>`;
  }

  if(lastPage > totalPage) {
    lastPage = totalPage;
  }

  for(let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${page === i ? 'active' : ''}"><a onclick="moveToPage(${i})" class="page-link" href="#">${i}</a></li>`;
  }

  if(page < totalPage) {
    paginationHTML+= `<li class="page-item"><a onclick="moveToPage(${page+1})" class="page-link" href="#">&gt;</a></li><li class="page-item"><a onclick="moveToPage(${totalPage})" class="page-link" href="#">&gt;&gt;</a></li>`;
  }
  
  document.querySelector('.pagination').innerHTML = paginationHTML;
}

const moveToPage = (pageNumber) => {
  page = pageNumber;
  getNews();
}

init();