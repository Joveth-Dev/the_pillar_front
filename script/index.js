import { getData } from './api_fetch.js';
import { ArticleCategory } from './article_category.js';

// ------------- ENABLE SEARCH BUTTON WHEN INPUT HAS VALUE -------------
const search_input = document.getElementById('search_input');
const search_button = document.getElementById('search_button');

search_input.addEventListener('input', function(){
    if(this.value.trim().length > 0){
        search_button.disabled = false;
    }else {
        search_button.disabled = true;
    }
});
// ---------------------------------------------------------------------


// publication endpoint
const publication_api = "http://127.0.0.1:8000/publication/";

// ----------- POPULATING BANNER CONTAINER WITH BANNERS DATA -----------
const banners_api = publication_api + "banners/";

getData(banners_api)
.then(data => {
    const banner_container = document.getElementById('banner_container');
    const banner_indicator_container = document.getElementById('banner_indicator_container');

    for (const [index, item] of data.entries()){
        // set article category
        let category = item.article.category.toUpperCase();
        if (category == 'N'){
            category = 'NEWS';
        }
        if (category == 'NF'){
            category = 'NEWS FEATURE';
        }
        if (category == 'F'){
            category = 'FEATURE';
        }
        if (category == 'O'){
            category = 'OPINION';
        }
        if (category == 'C'){
            category = 'CULTURE';
        }
        if (category == 'E'){
            category = 'EDITORIAL';
        }
        if (category == 'L'){
            category = 'LITERARY';
        }
        if (category == 'S'){
            category = 'SPORTS';
        }

        // get file name of banner's image for alt text
        let banner_image_file_name = item.image.substring(item.image.lastIndexOf('/') + 1)
        
        // integrating data
        // if first item set it to active
        if(index === 0){
            banner_indicator_container.innerHTML += `
                <button type="button" data-bs-target="#bannerAreaCarousel" data-bs-slide-to="${index}" class="active" aria-current="true" aria-label="Slide ${index+1}"></button>
            `;
            banner_container.innerHTML += `
                <a class="carousel-item active" href="http://127.0.0.1:5501/html-files/readView.html" onclick="sessionStorage.setItem('article_id', ${item.article.id}), sessionStorage.removeItem('update_id')">
                    <div class="gradient"></div>
                    <img src="${item.image}" class="d-block carousel-image" alt="${banner_image_file_name}">
                    <div class="carousel-caption d-md-block">
                        <span class="carousel-category">${category}</span>
                        <h2 class="title-headline">${item.article.title_or_headline}</h2>
                    </div>
                </a>
            `;
        }
        else{
            banner_indicator_container.innerHTML += `
                <button type="button" data-bs-target="#bannerAreaCarousel" data-bs-slide-to="${index}" aria-label="Slide ${index+1}"></button>
            `;
            banner_container.innerHTML += `
                <a class="carousel-item" href="http://127.0.0.1:5501/html-files/readView.html" onclick="sessionStorage.setItem('article_id', ${item.article.id}), sessionStorage.removeItem('update_id')">
                    <div class="gradient"></div>
                    <img src="${item.image}" class="d-block carousel-image" alt="${banner_image_file_name}">
                    <div class="carousel-caption d-md-block">
                        <span class="carousel-category">${category}</span>
                        <h2 class="title-headline">${item.article.title_or_headline}</h2>
                    </div>
                </a>
            `;
        }
    }
})
.catch(error => console.error(error));
// ---------------------------------------------------------------------

// ----------- POPULATING UPDATES CONTAINER WITH UPDATES' DATA -----------
const updates_api = publication_api + "updates/";

getData(updates_api)
.then(data => {
    for(const item of data){
        const update_container = document.getElementById('updates_container');
        let date_object = new Date(item.date_posted);
        const date_string = date_object.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        update_container.innerHTML += `
            <a href="/html-files/readView.html" onclick="sessionStorage.setItem('update_id', ${item.id}), sessionStorage.removeItem('article_id')">                  
                <div>
                    ${item.title}
                    <br>
                    <span class="published-date">${date_string}</span>
                </div>
            </a>
        `;
    }
})
.catch(error => console.error(error));
// ---------------------------------------------------------------------


// ----------- POPULATING DIGITAL RELEASES CONTAINER WITH ISSUES' DATA -----------
const issues_api = publication_api + "issues/";

getData(issues_api)
.then(data => {
    for (const item of data){
        const issues_container = document.getElementById('issues_container');
        let date_object = new Date(item.date_published);
        const date_string = date_object.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        
        issues_container.innerHTML += `
            <a href="html-files/archiveRead.html" onclick="sessionStorage.setItem('issue_id', ${item.id})">                 
                <div>
                    VOL. ${item.volume_number} | ISSUE : ${item.issue_number}
                    <br>
                    <span class="published-date">${date_string}</span>
                </div>
            </a>
        `;
    }
})
.catch(error => console.error(error));
// -------------------------------------------------------------------------------


// ----------------- POPULATING HOME's ARTICLE CATEGORY SECTION ------------------
const articles_api = publication_api + 'articles/';
getData(articles_api)
.then(data => {
    // group articles by category and get 5 articles each category
    const editorial_articles_data = data.filter(article => article.category === 'E').slice(0, 5);
    const news_articles_data = data.filter(article => article.category === 'N').slice(0, 5);
    const feature_articles_data = data.filter(article => article.category === 'F').slice(0, 5);
    const opinion_articles_data = data.filter(article => article.category === 'O').slice(0, 5);
    const culture_articles_data = data.filter(article => article.category === 'C').slice(0, 5);
    const newsfeature_articles_data = data.filter(article => article.category === 'NF').slice(0, 5);
    const column_articles_data = data.filter(article => article.category === 'CL').slice(0, 5);
    const sports_articles_data = data.filter(article => article.category === 'S').slice(0, 5);
    const literary_articles_data = data.filter(article => article.category === 'L').slice(0, 5);

    // populate article categories section
    ArticleCategory.populateSection(editorial_articles_data, 'EDITORIAL');
    ArticleCategory.populateSection(news_articles_data, 'NEWS');
    ArticleCategory.populateSection(feature_articles_data, 'FEATURE');
    ArticleCategory.populateSection(opinion_articles_data, 'OPINION');
    ArticleCategory.populateSection(culture_articles_data, 'CULTURE');
    ArticleCategory.populateSection(newsfeature_articles_data, 'NEWS FEATURE');
    ArticleCategory.populateSection(column_articles_data, 'COLUMN');
    ArticleCategory.populateSection(sports_articles_data, 'SPORTS');
    ArticleCategory.populateSection(literary_articles_data, 'LITERARY');
})
.catch(error => console.error(error));
// -------------------------------------------------------------------------------