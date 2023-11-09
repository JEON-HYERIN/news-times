const API_KEY = `ee66bb688cdd4644aabb7ce2f5785fa4`;

let newsList = [];

const getLatestNews = async () => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
  console.log("ddd", newsList);
};

const render = () => {
  const newsHTML = newsList.map(
    (news) => `
  <div class="row news">
    <div class="col-lg-4">
      <img
        src=${news.urlToImage}
        alt=""
      />
    </div>
    <div class="col-lg-8">
      <h2>${news.title}</h2>
      <p>${news.description}</p>
      <span>${news.source.name} * ${news.publishedAt}</span>
    </div>
  </div>`
  ).join('');

  document.getElementById("news-board").innerHTML = newsHTML;
};

getLatestNews();
