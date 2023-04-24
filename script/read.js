import { getData, setData } from './api_fetch.js';

// ------------- ENABLE SEARCH BUTTON WHEN INPUT HAS VALUE -------------
const search_input = document.getElementById('search_input');
const search_button = document.getElementById('search_button');
const search_input_mobile = document.getElementById('search_input_mobile');
const search_button_mobile = document.getElementById('search_button_mobile');

search_input.addEventListener('input', function(){
    if(this.value.trim().length > 0){
        search_button.disabled = false;
    }else {
        search_button.disabled = true;
    }
});

search_input_mobile.addEventListener('input', function(){
    if(this.value.trim().length > 0){
        search_button_mobile.disabled = false;
    }else {
        search_button_mobile.disabled = true;
    }
});
// ---------------------------------------------------------------------

window.onload = function () {
    displayLikes();
    displayComments();
}

const article_category = document.getElementById('article_category');
const article_title = document.getElementById('article_title');
const author_container = document.getElementById('author_container');
const article_date_published = document.getElementById('article_date_published');
const article_body = document.getElementById('article_body');

let detail_api;

const article_id = sessionStorage.getItem('article_id');
const update_id = sessionStorage.getItem('update_id');
const article_api = 'http://127.0.0.1:8000/publication/articles/';


// ------------------------- FOR DISPLAYING ARTICLE -----------------------------
if (article_id) {
    detail_api = article_api + article_id + '/';

    getData(detail_api)
        .then(data => {
            // set article category
            let category = data.category.toUpperCase();
            if (category == 'N') {
                category = 'NEWS';
            }
            if (category == 'NF') {
                category = 'NEWS FEATURE';
            }
            if (category == 'F') {
                category = 'FEATURE';
            }
            if (category == 'O') {
                category = 'OPINION';
            }
            if (category == 'C') {
                category = 'CULTURE';
            }
            if (category == 'E') {
                category = 'EDITORIAL';
            }
            if (category == 'CL') {
                category = 'COLUMN';
            }
            if (category == 'S') {
                category = 'SPORTS';
            }
            if (category == 'L') {
                category = 'LITERARY';
            }

            // displaying category
            article_category.textContent = category;
            // displaying title
            // enable display of title first
            article_title.setAttribute('class', 'category-highlight-title pt-3 font');
            article_title.textContent = data.title_or_headline;

            // display authors
            if (data.authors.length !== 0) {
                for (const author of data.authors) {
                    author_container.innerHTML += `
                    <div class="author">
                        <small class="fw-bold text-primary">${author.full_name}</small>
                    </div>
                `;
                }
            }
            if (data.contributors.length !== 0) {
                for (const contributor of data.contributors) {
                    author_container.innerHTML += `
                    <div class="author">
                    <small class="fw-bold text-primary">${contributor.name_or_pen_name}</small>
                    </div>
                `;
                }
            }

            // display date_published
            article_date_published.textContent = data.date_published;

            // set article's body
            const paragraphs = data.body.split("\r\n\r\n");

            // set article images
            if (data.article_images.length !== 0) {
                let article_images = data.article_images;
                // if paragraphs are more than the article_images
                if (paragraphs.length >= article_images.length) {
                    for (const [index, article_image] of article_images.entries()) {
                        let image_caption = article_image.image_caption;
                        if(image_caption === null) image_caption = '';
                        article_body.innerHTML += `
                        <p class="article-body m-auto">${paragraphs[index]}</p>
                        <div class="article-img">
                            <img src="${article_image.image}" alt="Article image">
                            <p class="image-caption font">${image_caption}</p>
                        </div>
                        `;
                        paragraphs.splice(index, 1);
                    }
                    for (const paragraph of paragraphs) {
                        article_body.innerHTML += `
                        <p class="article-body">${paragraph}</p>
                        `;
                    }
                }
                // if article_images are more that paragraphs
                else {
                    for (const [index, paragraph] of paragraphs.entries()) {
                        let image_caption = article_images[index].image_caption;
                        if(image_caption === null) image_caption = '';
                        article_body.innerHTML += `
                        <p class="article-body">${paragraph}</p>
                        <div class="article-img">
                            <img src="${article_images[index].image}" alt="Article image">
                            <p class="image-caption font">${image_caption}</p>
                        </div>
                    `;
                        article_images.splice(index, 1);
                    }
                    for (const article_image of article_images) {
                        let image_caption = article_image.image_caption;
                        if(image_caption === null) image_caption = '';
                        article_body.innerHTML += `
                            <div class="article-img">
                                <img src="${article_image.image}" alt="Article image">
                                <p class="image-caption font">${image_caption}</p>
                            </div>
                        `;
                    }
                }
            } else {
                let article_default_image = '';
                // set default article image
                if (category == 'NEWS') {
                    article_default_image = '/img/default_article_imgs/default_news.png';
                }
                if (category == 'NEWS FEATURE') {
                    article_default_image = '/img/default_article_imgs/default_news_feature.png';
                }
                if (category == 'FEATURE') {
                    article_default_image = '/img/default_article_imgs/default_feature.png';
                }
                if (category == 'OPINION') {
                    article_default_image = '/img/default_article_imgs/default_opinion.png';
                }
                if (category == 'CULTURE') {
                    article_default_image = '/img/default_article_imgs/default_culture.png';
                }
                if (category == 'EDITORIAL') {
                    article_default_image = '/img/default_article_imgs/default_editorial.png';
                }
                if (category == 'COLUMN') {
                    article_default_image = '/img/default_article_imgs/default_column.png';
                }
                if (category == 'SPORTS') {
                    article_default_image = '/img/default_article_imgs/default_sports.png';
                }
                if (category == 'LITERARY') {
                    article_default_image = '/img/default_article_imgs/default_literary.png';
                }
                    article_body.innerHTML += `
                        <div class="article-img">
                            <img src="${article_default_image}" alt="Article image">
                        </div>
                    `;
                for (const paragraph of paragraphs) {
                    article_body.innerHTML += `
                        <p class="article-body">${paragraph}</p>
                    `;
                }
            }
        })
        .catch(error => console.error(error));
}
else if (update_id) {
    detail_api = `http://127.0.0.1:8000/publication/updates/${update_id}/`;

    getData(detail_api)
        .then(data => {
            // displaying category and title
            article_category.textContent = 'UPDATE';
            if (data.title) {
                article_title.setAttribute('class', 'category-highlight-title pt-3 font');
                article_title.textContent = data.title;
            }

            // displaying author  
            author_container.innerHTML += `
            <div class="author">
                <small class="fw-bold text-primary">The Pillar</small>
            </div>
        `;

            // displaying body and update image
            if (data.image && data.image_caption) {
                article_body.innerHTML = `
                <div class="article-img">
                    <img src="${data.image}" alt="Article image">
                    <p class="image-caption font">${data.image_caption}</p>
                </div>
                <p class="article-body">${data.description}</p>
            `;
            }
            else if (data.image) {
                article_body.innerHTML = `
                <div class="article-img">
                    <img src="${data.image}" alt="Article image">
                </div>
                <p class="article-body">${data.description}</p>
            `;
            } else {
                article_body.innerHTML = `
                <div class="article-img">
                    <img src="/img/default_article_imgs/default_update.png" alt="Article image">
                </div>
                <p class="article-body">${data.description}</p>
            `;
            }
        })
}
else {
    window.location.href = 'http://127.0.0.1:5501/index.html';
}
// ------------------------------------------------------------------------------

// --------------------- FOR POPULATING LATEST ARTICLES -------------------------
const latest_articles_container = document.getElementById('latest_articles_container');

getData(article_api)
    .then(data => {
        const indexToRemove = data.findIndex(obj => obj.id === parseInt(article_id));

        if (indexToRemove !== -1) {
            data.splice(indexToRemove, 1);
        }

        data = data.slice(0, 10);

        for (const article of data) {
            latest_articles_container.innerHTML += `
            <a href="" class="link-style" onclick="sessionStorage.setItem('article_id', ${article.id}), sessionStorage.removeItem('update_id')">
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

// --------------------------- FOR DISPLAYING LIKES -----------------------------
let likes_api = '';
if (article_id) {
    likes_api = `http://127.0.0.1:8000/reaction/likes/?object_id=${article_id}&content_type=8`;
} else {
    likes_api = `http://127.0.0.1:8000/reaction/likes/?object_id=${update_id}&content_type=13`;
}

function displayLikes() {
    try {
        getData(likes_api)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                    console.log(data.data);
                } else {
                    // display likes count of the article
                    const likes_count_element = document.getElementById('nummberOfLikesArticles');
                    const likes_count = data.filter(obj => obj.is_liked === true).length;
                    likes_count_element.textContent = `${likes_count} likes`;

                    const user_id = sessionStorage.getItem('user_id');
                    if (user_id) {
                        for (const like of data) {
                            if (like.user_id === parseInt(user_id)) {
                                sessionStorage.setItem('like_id', like.id)
                                if (like.is_liked) {
                                    document.getElementById('thumbs_up').setAttribute('class', 'bi bi-hand-thumbs-up-fill text-secondary cursor');
                                }
                                else if (!like.is_liked) {
                                    document.getElementById('thumbs_down').setAttribute('class', 'bi bi-hand-thumbs-down-fill text-secondary cursor');
                                }
                            }
                        }
                    }
                }
            })
            .catch(error => console.log(error));
    } catch (error) {
        console.error(error);
    }
}
// ------------------------------------------------------------------------------


// ------------------- LISTENER FOR LIKING/DISLIKING ARTICLE --------------------
const like_button = document.getElementById('thumbs_up');
const dislike_button = document.getElementById('thumbs_down');
like_button.addEventListener('click', function () {
    // check if the user is loggin in
    if (sessionStorage.getItem('access') && sessionStorage.getItem('refresh')) {
        const like_id = sessionStorage.getItem('like_id');
        // check if like button is already liked by user
        if (like_button.getAttribute('class') === 'bi bi-hand-thumbs-up-fill text-secondary cursor') {
            // delete like on article
            if (like_id) {
                removeLikeArticle(like_id);
                like_button.setAttribute('class', 'bi bi-hand-thumbs-up text-secondary cursor');
            } else {
                location.reload();
            }
        }
        else if (
            like_button.getAttribute('class') === 'bi bi-hand-thumbs-up text-secondary cursor' &&
            dislike_button.getAttribute('class') === 'bi bi-hand-thumbs-down-fill text-secondary cursor'
        ) {
            if (like_id) {
                // like the article
                editLikeArticle(true, like_id);
                like_button.setAttribute('class', 'bi bi-hand-thumbs-up-fill text-secondary cursor');
                dislike_button.setAttribute('class', 'bi bi-hand-thumbs-down text-secondary cursor');
            } else {
                location.reload();
            }
        }
        else if (like_button.getAttribute('class') === 'bi bi-hand-thumbs-up text-secondary cursor') {
            // like the article
            if (article_id) {
                likeArticle(true, article_id);
                like_button.setAttribute('class', 'bi bi-hand-thumbs-up-fill text-secondary cursor');
            } else {
                likeArticle(true, update_id);
                like_button.setAttribute('class', 'bi bi-hand-thumbs-up-fill text-secondary cursor');
            }
        }
    } else {
        document.getElementById('modal-btn').click();
    }
})

dislike_button.addEventListener('click', function () {
    // check if the user is loggin in
    if (sessionStorage.getItem('access') && sessionStorage.getItem('refresh')) {
        const like_id = sessionStorage.getItem('like_id');
        // check if like button is already liked by user
        if (dislike_button.getAttribute('class') === 'bi bi-hand-thumbs-down-fill text-secondary cursor') {
            // delete like on article
            if (like_id) {
                removeLikeArticle(like_id);
                dislike_button.setAttribute('class', 'bi bi-hand-thumbs-down text-secondary cursor');
            } else {
                location.reload();
            }
        }
        else if (
            dislike_button.getAttribute('class') === 'bi bi-hand-thumbs-down text-secondary cursor' &&
            like_button.getAttribute('class') === 'bi bi-hand-thumbs-up-fill text-secondary cursor'
        ) {
            if (like_id) {
                // like the article
                editLikeArticle(false, like_id);
                dislike_button.setAttribute('class', 'bi bi-hand-thumbs-down-fill text-secondary cursor');
                like_button.setAttribute('class', 'bi bi-hand-thumbs-up text-secondary cursor');
            } else {
                location.reload();
            }
        }
        else if (dislike_button.getAttribute('class') === 'bi bi-hand-thumbs-down text-secondary cursor') {
            if (article_id) {
                likeArticle(true, article_id);
                dislike_button.setAttribute('class', 'bi bi-hand-thumbs-down-fill text-secondary cursor');
            } else {
                likeArticle(true, update_id);
                dislike_button.setAttribute('class', 'bi bi-hand-thumbs-down-fill text-secondary cursor');
            }
        }
    } else {
        document.getElementById('modal-btn').click();
    }
})
// ------------------------------------------------------------------------------

// ----------------------------- FOR LIKING ARTICLE -----------------------------
function likeArticle(is_liked, object_id) {
    let content_type;
    if (article_id) {
        content_type = 8
    } else {
        content_type = 13;
    }
    try {
        const access = sessionStorage.getItem('access');
        if (access) {
            const likes_api = 'http://127.0.0.1:8000/reaction/likes/';

            const options = {
                method: 'POST',
                headers: {
                    Authorization: `JWT ${access}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content_type: content_type,
                    object_id: object_id,
                    is_liked: is_liked
                })
            }

            setData(likes_api, options)
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                        console.log(data.data);
                        // get new access token
                        const refresh_api = 'http://127.0.0.1:8000/auth/jwt/refresh/';

                        const refresh_options = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                'refresh': sessionStorage.getItem('refresh')
                            })
                        }

                        setData(refresh_api, refresh_options)
                            .then(data => {
                                if (data.error) {
                                    console.log(data.error);
                                } else {
                                    console.log('new access');
                                    sessionStorage.setItem('access', data.access);
                                    likeArticle(is_liked, object_id);
                                }
                            })
                            .catch(error => console.error(error));
                    } else {
                        displayLikes();
                    }
                })
                .catch(error => console.error(error))
        } else {
            location.reload();
        }
    } catch (error) {
        console.error(error);
    }

}
// ------------------------------------------------------------------------------

// ------------------------ FOR REMOVING ARTICLE LIKE ---------------------------
function removeLikeArticle(like_id) {
    try {
        const access = sessionStorage.getItem('access');
        if (access) {
            const likes_api = `http://127.0.0.1:8000/reaction/likes/${like_id}`;

            const options = {
                method: 'DELETE',
                headers: {
                    Authorization: `JWT ${access}`,
                }
            }

            setData(likes_api, options)
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                        console.log(data.data);
                        // get new access token
                        const refresh_api = 'http://127.0.0.1:8000/auth/jwt/refresh/';

                        const refresh_options = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                'refresh': sessionStorage.getItem('refresh')
                            })
                        }

                        setData(refresh_api, refresh_options)
                            .then(data => {
                                if (data.error) {
                                    console.log(data.error);
                                } else {
                                    console.log('new access');
                                    sessionStorage.setItem('access', data.access);
                                    removeLikeArticle(like_id);
                                }
                            })
                            .catch(error => console.error(error));
                    } else {
                        sessionStorage.removeItem('like_id');
                        displayLikes();
                    }
                })
                .catch(error => console.error(error))
        } else {
            location.reload();
        }
    } catch (error) {
        console.error(error);
    }
}
// ------------------------------------------------------------------------------

// ------------------------ FOR EDITING ARTICLE LIKE ----------------------------
function editLikeArticle(is_liked, like_id) {
    try {
        const access = sessionStorage.getItem('access');
        if (access) {
            const likes_api = `http://127.0.0.1:8000/reaction/likes/${like_id}/`;

            const options = {
                method: 'PATCH',
                headers: {
                    Authorization: `JWT ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    is_liked: is_liked
                })
            }

            setData(likes_api, options)
                .then(data => {
                    if (data.error) {
                        console.log(data.error);
                        console.log(data.data);
                        // get new access token
                        const refresh_api = 'http://127.0.0.1:8000/auth/jwt/refresh/';

                        const refresh_options = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                'refresh': sessionStorage.getItem('refresh')
                            })
                        }

                        setData(refresh_api, refresh_options)
                            .then(data => {
                                if (data.error) {
                                    console.log(data.error);
                                } else {
                                    console.log('new access');
                                    sessionStorage.setItem('access', data.access);
                                    editLikeArticle(is_liked, like_id);
                                }
                            })
                            .catch(error => console.error(error));
                    } else {
                        displayLikes();
                    }
                })
                .catch(error => console.error(error))
        } else {
            location.reload();
        }
    } catch (error) {
        console.error(error);
    }
}
// ------------------------------------------------------------------------------

// ------------------------ FOR DISPLAYING COMMENTS -----------------------------
function displayComments(comment_api = null) {
    if (comment_api === null) {
        if (article_id) {
            comment_api = `http://127.0.0.1:8000/reaction/comments?object_id=${article_id}`;
        } else {
            comment_api = `http://127.0.0.1:8000/reaction/comments?object_id=${update_id}`;
        }
    }
    try {
        getData(comment_api)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                    console.log(data.data);
                } else {
                    const comments_container = document.getElementById('comments_container');
                    
                    for (const comment of data.results) {
                        const message = decodeURIComponent(comment.message);
                        if(sessionStorage.getItem('user_id') && (sessionStorage.getItem('user_id') === comment.user.id.toString())){
                            comments_container.innerHTML += `
                                <div class="col comment">
                                    <div class="d-flex justify-content-between">
                                        <small class="fw-bold text-primary font">${comment.user.full_name}</small>
                                        <span type="button" class="text-primary edit-comment pe-2">
                                            <i class="bi bi-pencil-square text-success" onclick="enableEditComment(${comment.id})" id="icon_${comment.id}" title="Edit comment"></i>
                                            <i class="bi bi-x-square text-danger d-none" onclick="cancelEditComment(${comment.id})" id="cancel_${comment.id}" title="Cancel editing comment"></i>
                                            <i type="button" class="bi bi-trash text-danger" onclick="confirmDeleteCommentModal(${comment.id})" id="delete_${comment.id}" title="Delete comment"></i>
                                        </span>
                                    </div>
                                    <input class="posted-comment" value="${message}" id="message_${comment.id}" disabled required></input>
                                    <div class="d-flex align-items-center">
                                        <span class="ps-5 m-0 reply-btn fw-bold" onclick="displayReplyForm(${comment.id})">Reply</span>
                                        <span class="date-comment">${comment.comment_date}</span>
                                    </div>
                                </div>
                                <div class="d-none" id="comment_${comment.id}"></div>
                            `;
                        }else{
                            comments_container.innerHTML += `
                                <div class="col comment">
                                    <div class="d-flex justify-content-between">
                                        <small class="fw-bold text-primary font">${comment.user.full_name}</small>
                                    </div>
                                    <p class="posted-comment">${message}</p>
                                    <div class="d-flex align-items-center">
                                        <span class="ps-5 m-0 reply-btn fw-bold" onclick="displayReplyForm(${comment.id})">Reply</span>
                                        <span class="date-comment">${comment.comment_date}</span>
                                    </div>
                                </div>
                                <div class="d-none" id="comment_${comment.id}"></div>
                            `;
                        }
                        // edit icon
                        for (const reply of comment.replies) {
                            const reply_message = decodeURIComponent(reply.message);
                            if(sessionStorage.getItem('user_id') && (sessionStorage.getItem('user_id') === reply.user.id.toString())){
                                comments_container.innerHTML += `
                                <div class="col d-flex justify-content-end p-0">
                                    <div class="reply-container">
                                        <span class="fw-bold text-primary font text-center">${reply.user.full_name}</span>
                                        <span class="reply-to-comment-name">replied to <span class="fw-bold text-primary">${comment.user.full_name}</span>
                                        <i class="bi bi-pencil-square text-success" onclick="enableEditReply(${reply.id})" id="reply_icon_${reply.id}" title="Edit reply"></i>
                                        <i class="bi bi-x-square d-none" onclick="cancelEditReply(${reply.id})" id="cancel_reply_${reply.id}" title="Cancel editing reply"></i>
                                        <i type="button" class="bi bi-trash text-danger" onclick="confirmDeleteReplyModal(${reply.id})" id="delete_reply_${reply.id}" title="Delete reply"></i>
    
                                        <input class="reply-to-comment m-0" value="${reply_message}" id="reply_message_${reply.id}" disabled required></input>
                                        <span class="date-comment">${reply.reply_date}</span>
                                    </div>
                                </div>
                            `;
                            }else{
                                comments_container.innerHTML += `
                                <div class="col d-flex justify-content-end p-0">
                                    <div class="reply-container">
                                        <span class="fw-bold text-primary font text-center">${reply.user.full_name}</span>
                                        <span class="reply-to-comment-name">replied to <span class="fw-bold text-primary">${comment.user.full_name}</span>
                                        <p class="reply-to-comment m-0">${reply_message}</p>
                                        <span class="date-comment">${reply.reply_date}</span>
                                    </div>
                                </div>
                            `;  
                            }
                        }
                    }
                    // store the data.next if exists
                    if (data.next) {
                        sessionStorage.setItem('next', data.next);
                    } else {
                        sessionStorage.removeItem('next');
                        document.getElementById('load_more').setAttribute('class', 'btn btn-secondary text-white container-80 m-auto d-none');
                    }
                }
            })
            .catch(error => console.log(error));
    } catch (error) {
        console.error(error);
    }
}
// ------------------------------------------------------------------------------

// ------------------------ FOR LOADING MORE COMMENTS ---------------------------
document.getElementById('load_more').addEventListener('click', function () {
    if (sessionStorage.getItem('next')) {
        displayComments(sessionStorage.getItem('next'));
    } else {
        document.getElementById('load_more').setAttribute('class', 'btn btn-secondary text-white container-80 m-auto d-none');
    }
})
// ------------------------------------------------------------------------------

// ------------------- LISTENER FOR ADDING COMMENTS -----------------------------
document.getElementById('comment_form').addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('noice');
    if (sessionStorage.getItem('access') && sessionStorage.getItem('refresh')) {
        if (article_id) {
            postComment(article_id);
        } else {
            postComment(update_id);
        }
    } else {
        document.getElementById('modal-btn').click();
    }
})
// ------------------------------------------------------------------------------

// ------------------------ FOR ADDING COMMENTS ---------------------------------
function postComment(object_id) {
    let content_type;
    if (article_id) {
        content_type = 8;
    } else {
        content_type = 13;
    }
    // post comment
    try {
        const comments_api = 'http://127.0.0.1:8000/reaction/comments/';
        const comment = document.getElementById('comment').value;
        const encodedComment = encodeURIComponent(comment);

        const options = {
            method: 'POST',
            headers: {
                Authorization: `JWT ${sessionStorage.getItem('access')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content_type: content_type,
                object_id: object_id,
                message: encodedComment
            })
        }

        setData(comments_api, options)
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                    console.log(data.data);
                    // get new access token
                    const refresh_api = 'http://127.0.0.1:8000/auth/jwt/refresh/';

                    const refresh_options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'refresh': sessionStorage.getItem('refresh')
                        })
                    }

                    setData(refresh_api, refresh_options)
                        .then(data => {
                            if (data.error) {
                                console.log(data.error);
                            } else {
                                console.log('new access');
                                sessionStorage.setItem('access', data.access);
                                postComment(object_id);
                            }
                        })
                        .catch(error => console.error(error));
                } else {
                    location.reload();
                }
            })
    } catch (error) {
        console.error(error);
    }
}
// ------------------------------------------------------------------------------
