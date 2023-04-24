// ------ A CLASS FOR WRAPPING FUNCTIONS TO POPULATE THE ARTICLE CATEGORIES ------
export class ArticleCategory {
    static populateSection = populateSection;
}


// ----------------- EDITORIAL DATA FUNCTION FOR DATA INTEGRATION ----------------
function populateSection(data, category){
    // get parent div of article section
    const article_categories_container = document.getElementById('article_categories_container');

    // create category div
    const category_container = document.createElement('div');
    category_container.setAttribute('class', 'category-box');
    category_container.innerHTML = `
    <div class="category-head">
    <span class="category-name">${category}</span>
    <a class="link-style" href="/html-files/listView.html?category=${category.toLowerCase()}"><span class="category-more">MORE > </span></a>
        </div>
    `;

    // loop through the items in the data and populate category div
    const no_img_ul = document.createElement('ul');
    for (const item of data){
        // set date published
        let date_object = new Date(item.date_published);
        const date_string = date_object.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        
        // set article image
        let article_image;
        if (item.article_images.length === 0){
            // set the image based on the article's category
            if(category === 'EDITORIAL'){
                article_image = 'img/default_article_imgs/default_editorial.png';
            }
            if(category === 'NEWS'){
                article_image = 'img/default_article_imgs/default_news.png';
            }
            if(category === 'FEATURE'){
                article_image = 'img/default_article_imgs/default_feature.png';
            }
            if(category === 'OPINION'){
                article_image = 'img/default_article_imgs/default_opinion.png';
            }
            if(category === 'CULTURE'){
                article_image = 'img/default_article_imgs/default_culture.png';
            }
            if(category === 'NEWS FEATURE'){
                article_image = 'img/default_article_imgs/default_news_feature.png';
            }
            if(category === 'COLUMN'){
                article_image = 'img/default_article_imgs/default_column.png';
            }
            if(category === 'SPORTS'){
                article_image = 'img/default_article_imgs/default_sports.png';
            }
            if(category === 'LITERARY'){
                article_image = 'img/default_article_imgs/default_literary.png';
            }
        }else{
            article_image = item.article_images[0].image;
        }

        if (item.is_highlight){
            category_container.innerHTML += `
                <a class="link-style" href="html-files/readView.html" onclick="sessionStorage.setItem('article_id', ${item.id})">
                    <div class="highlight-article">
                        <div class="highlight-article-img">
                            <img src="${article_image}" alt="">
                        </div>
                        <div class="highlight-article-info">
                            <h5 class="highlight-article-title">${item.title_or_headline}</h5>
                            <small class="highlight-date">${date_string}</small>
                        </div>
                    </div>
                </a>
            `;
        }else{
            no_img_ul.setAttribute('class', 'article-list');
            no_img_ul.innerHTML += `
                <a class="link-style" href="html-files/readView.html" onclick="sessionStorage.setItem('article_id', ${item.id})">
                    <li>
                        <span class="article-list-title">
                        ${item.title_or_headline}
                        </span>
                        <span class="published-date">${date_string}</span>
                    </li>
                </a>
            `;

            category_container.appendChild(no_img_ul);
        }
        article_categories_container.appendChild(category_container);
    }
}
// -------------------------------------------------------------------------------