import { getData } from './api_fetch.js';


// publication endpoint
let articles_api = 'http://127.0.0.1:8000/publication/articles/';

const url_params = new URLSearchParams(window.location.search);
let search_value;

// get search_container_style
const search_container = document.getElementById('search_container');

// Check if the "search" parameter has a value
if (url_params.has('search') && url_params.get('search').trim().length === 0) {
    // Remove the "search" parameter from the URL
    url_params.delete('search');
    
    // Replace the current URL with the updated one
    const newUrl = window.location.origin + window.location.pathname + '?' + url_params.toString();
    window.history.replaceState({path: newUrl}, '', newUrl);

    search_container.style.height = '50vh';
}
else if (url_params.has('search') && url_params.get('search').trim().length !== 0) {
    search_value = url_params.get('search');

    // set value of search_input to search_value
    document.getElementById('search_input').value = search_value;

    // concatenate articles_api with the search value
    articles_api = `${articles_api}?search=${search_value}`;

    getData(articles_api)
    .then(data => {
        // set value of results_count based on the data's length
        document.getElementById('results_count').innerText = data.length.toString() + ' results found';
        
        // modify search_container's height based on data's length
        // dire pa in mao
        if(data.length < 2) search_container.style.height = '50vh';
        
        // loop and display results
        for (const item of data){
            // set authors/contributors
            const authors_temp = new Array(3);
            if(item.authors.length !== 0){
                for (const [index, author] of item.authors.entries())
                authors_temp[index] = author.full_name;
            }
            if(item.contributors.length !== 0 && authors_temp.includes(undefined)){
                for (const contributor of item.contributors){
                    for (let i = 0; i < authors_temp.length; i++) {
                        if (authors_temp[i] == null) {  // check for null or undefined
                            // check if contributor is not already included in authors
                            if (!authors_temp.includes(contributor.name_or_pen_name))
                                authors_temp[i] = contributor.name_or_pen_name;
                        }
                    }
                }
            }
            const authors_final = authors_temp.filter((value) => value !== null);

            // set article image
            let article_image = '';
            if (item.article_images.length === 0){
                // set the image based on the article's category
                if(item.category === 'E'){
                    article_image = '/img/default_article_imgs/default_editorial.png';
                }
                if(item.category === 'N'){
                    article_image = '/img/default_article_imgs/default_news.png';
                }
                if(item.category === 'F'){
                    article_image = '/img/default_article_imgs/default_feature.png';
                }
                if(item.category === 'O'){
                    article_image = '/img/default_article_imgs/default_opinion.png';
                }
                if(item.category === 'C'){
                    article_image = '/img/default_article_imgs/default_culture.png';
                }
                if(item.category === 'NF'){
                    article_image = '/img/default_article_imgs/default_news_feature.png';
                }
                if(item.category === 'CL'){
                    article_image = '/img/default_article_imgs/default_column.png';
                }
                if(item.category === 'S'){
                    article_image = '/img/default_article_imgs/default_sports.png';
                }
                if(item.category === 'L'){
                    article_image = '/img/default_article_imgs/default_literary.png';
                }
            }else{
                article_image = item.article_images[0].image;
            }

            // set alt text for article_image
            const article_image_alt = article_image.substring(article_image.lastIndexOf('/') + 1);

            // display article data
            search_container.innerHTML += `
                <a class="col link-style" href="http://127.0.0.1:5501/html-files/readView.html" onclick="sessionStorage.setItem('article_id', ${item.id})"> 
                <img src="${article_image}" alt="${article_image_alt}">
                    <div class="article-details font">
                        <h4 class="article-title">${item.title_or_headline}</h4>
                        <small class="article-author fw-bold text-primary">${authors_final.join(', ')}</small>
                        <small class="article-date-pub">${item.date_published}</small>
                    </div>
                </a>
            `;
        }
    })
    .catch(error => console.error(error));
}