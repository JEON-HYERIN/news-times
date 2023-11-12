const API_KEY = `ee66bb688cdd4644aabb7ce2f5785fa4`;

let newsList = [];
const menus = document.querySelectorAll('.menus button');
const searchBtn = document.querySelector('.search-btn');
let url = new URL(
  `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
);
let totalResults = 0;
let page = 1;
const pageSize = 3;
const groupSize = 5;

menus.forEach(menu => menu.addEventListener('click', (event) => getNewsByCategory(event)));

const getNews = async () => {
  try{
    url.searchParams.set('page', page); // &page=page
    url.searchParams.set('pageSize', pageSize);

    const response = await fetch(url);
    const data = await response.json();

    if(response.status === 200) {
      if(data.articles.length === 0) {
        throw new Error('No result for this search');
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
      console.log(data);
    } else {
      throw new Error(data.message);
    }
  }catch(error) {
    errorRender(error.message);
  }
}


const getLatestNews = async () => {
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
  );

  getNews();
};

const getNewsByKeyword = async () => {
  const keyword = document.querySelector('.search-input').value;

  page = 1;

  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&Q=${keyword}&apiKey=${API_KEY}`);

  getNews();
}

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();

  page = 1;

  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`);

  getNews();
}

const render = () => {
  const newsHTML = newsList.map(
    (news) => `
  <div class="row news">
    <div class="col-lg-4">
      <img class="news-img"
        src=${
        news.urlToImage == null ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU' : news.urlToImage
        }
        alt=""
      />
    </div>
    <div class="col-lg-8">
      <h2 class="news-title">${news.title}</h2>
      <p class="news-desc">${
        news.description == null || news.description == '' ? '내용없음' : news.description.length > 200 ? news.description.substring(0, 200) + '...' : news.description
      }</p>
      <span>${news.source.name} ${moment().startOf('day').fromNow()}</span>
    </div>
  </div>`
  ).join('');
  
  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>`;
  document.querySelector('#news-board').innerHTML = errorHTML;
}

const paginationRender = () => {
  let paginationHTML = ``;
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage  = pageGroup *  groupSize;
  // 마지막 페이지 그룹이 그룹사이즈 보다 작다? lastPage = totalPages
  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  
  if(lastPage > totalPages) {
    lastPage = totalPages;
  }

  if(firstPage >= 6) {
    paginationHTML = `
    <li class="page-item" onclick="moveToPage(1)"><a class="page-link" href="#none">&lt;&lt;</a></li>
    <li class="page-item" onclick="moveToPage(${page - 1})"><a class="page-link" href="#">&lt;</a></li>`;
  }

  for(let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${i === page ? 'active' : ''}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }

  if(lastPage < totalPages) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})"><a class="page-link" href="#none">&gt;</a></li><li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" href="#">&gt;&gt;</a></li>`;
  }

  document.querySelector('.pagination').innerHTML = paginationHTML; 
{/* <nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav> */}
}

const moveToPage = (pageNum) => {
  console.log('move', pageNum);
  page = pageNum;
  getNews();
}

getLatestNews();