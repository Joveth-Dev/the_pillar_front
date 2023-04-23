import { getData } from './api_fetch.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const category = urlParams.get('category').toUpperCase();

document.getElementById('articles_category').textContent = category;

const article_id = sessionStorage.getItem('article_id');
const articles_api = 'http://127.0.0.1:8000/publication/articles/';

let category_api = '';
let category_default_image = '';
if(category === 'EDITORIAL'){
    category_api = articles_api + `?category=E`;
    category_default_image = '/img/default_article_imgs/default_editorial.png';
    document.getElementById('editorial').setAttribute('class', 'active');
    document.getElementById('editorial1').setAttribute('class', 'active');
}
if(category === 'NEWS'){
    category_api = articles_api + `?category=N`;
    category_default_image = '/img/default_article_imgs/default_news.png';
    document.getElementById('news').setAttribute('class', 'active');
    document.getElementById('news1').setAttribute('class', 'active');
}
if(category === 'FEATURE'){
    category_api = articles_api + `?category=F`;
    category_default_image = '/img/default_article_imgs/default_feature.png';
    document.getElementById('feature').setAttribute('class', 'active');
    document.getElementById('feature1').setAttribute('class', 'active');
}
if(category === 'OPINION'){
    category_api = articles_api + `?category=O`;
    category_default_image = '/img/default_article_imgs/default_opinion.png';
    document.getElementById('opinion').setAttribute('class', 'active');
    document.getElementById('opinion1').setAttribute('class', 'active');
}
if(category === 'CULTURE'){
    category_api = articles_api + `?category=C`;
    category_default_image = '/img/default_article_imgs/default_culture.png';
    document.getElementById('culture').setAttribute('class', 'active');
    document.getElementById('culture1').setAttribute('class', 'active');
}
if(category === 'NEWS FEATURE'){
    category_api = articles_api + `?category=NF`;
    category_default_image = '/img/default_article_imgs/default_news_feature.png';
    document.getElementById('news_feature').setAttribute('class', 'active');
    document.getElementById('news_feature1').setAttribute('class', 'active');
}
if(category === 'COLUMN'){
    category_api = articles_api + `?category=CL`;
    category_default_image = '/img/default_article_imgs/default_column.png';
    document.getElementById('column').setAttribute('class', 'active');
    document.getElementById('column1').setAttribute('class', 'active');
}
if(category === 'SPORTS'){
    category_api = articles_api + `?category=S`;
    category_default_image = '/img/default_article_imgs/default_sports.png';
    document.getElementById('sports').setAttribute('class', 'active');
    document.getElementById('sports1').setAttribute('class', 'active');
}
if(category === 'LITERARY'){
    category_api = articles_api + `?category=L`;
    category_default_image = '/img/default_article_imgs/default_literary.png';
    document.getElementById('literary').setAttribute('class', 'active');
    document.getElementById('literary1').setAttribute('class', 'active');
}

getData(category_api)
.then(data => {
    if(data.error){
        console.log(data.error);
        console.log(data.data);
    }else{
        for(const article of data){
            if(article.is_highlight){
                // display highlight image
                if(article.article_images.length !== 0){
                    document.getElementById('article_image_highlight').setAttribute('src', article.article_images[0].image);
                }else{
                    document.getElementById('article_image_highlight').setAttribute('src', category_default_image);
                }
                // display highlight title
                document.getElementById('article_title_highlight').textContent = article.title_or_headline;
                // display first author or contributor
                if(article.authors.length !== 0){
                    document.getElementById('article_author_highlight').textContent = article.authors[0].full_name;
                }else if(article.contributors.length !== 0){
                    document.getElementById('article_author_highlight').textContent = article.contributors[0].name_or_pen_name;
                }else{
                    document.getElementById('article_author_highlight').setAttribute('class', 'fw-bold text-primary d-none');
                }
                // display date_published
                document.getElementById('date_published_highlight').textContent = article.date_published;

                // set link to readView
                const article_hightlight_container = document.getElementById('article_hightlight_container');
                article_hightlight_container.setAttribute('onclick', `sessionStorage.setItem('article_id', ${article.id}), sessionStorage.removeItem('update_id')`);
            }else{
                const article_category_container = document.getElementById('article_category_container');
                let article_image = '';
                let no_author = '';
                // display article image
                if(article.article_images.length !== 0){
                    article_image = article.article_images[0].image;
                }else{
                    article_image = category_default_image;
                }
                let first_writer = '';
                // display first author or contributor
                if(article.authors.length !== 0){
                    first_writer = article.authors[0].full_name;
                }else if(article.contributors.length !== 0){
                    first_writer = article.contributors[0].name_or_pen_name;
                }else{
                    no_author = 'd-none';
                }

                article_category_container.innerHTML += `
                    <a href="readView.html" class="col catergory-article link-style" onclick="sessionStorage.setItem('article_id', ${article.id}), sessionStorage.removeItem('update_id')">
                        <div class="category-article-img">
                            <img src="${article_image}" alt="Article image">
                        </div>
                        <div class="article-details font">
                            <span class="article-title">${article.title_or_headline}</span>
                            <small class="article-author fw-bold text-primary ${no_author}">${first_writer}</small>
                            <small class="article-date-pub">${article.date_published}</small>
                        </div>
                    </a>
                `;
            }
        }
    }
})
.catch(error => console.error(error));

// --------------------- FOR POPULATING LATEST ARTICLES -------------------------
const latest_articles_container = document.getElementById('latest_articles_container');

getData(articles_api)
.then(data => {
    const indexToRemove = data.findIndex(obj => obj.id === parseInt(article_id));

    if (indexToRemove !== -1) {
        data.splice(indexToRemove, 1);
    }

    data = data.slice(0, 10);

    for(const article of data){
        latest_articles_container.innerHTML += `
            <a href="readView.html" class="link-style" onclick="sessionStorage.setItem('article_id', ${article.id}), sessionStorage.removeItem('update_id')">
                <li class="latest_article_item">${article.title_or_headline}
                    <br>
                    <span class="published-date">${article.date_published}</span>
                </li>
            </a>
        `;
    }
})
.catch(error => console.log(error));
// ------------------------------------------------------------------------------
