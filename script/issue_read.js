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

// prevent page from scrolling up when closing modal
const modal = document.getElementById('modal-btn');
const closeButton = document.getElementById('close_modal');

closeButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default behavior of the event
    modal.style.display = 'none'; // Hide the modal
});

window.onload = function(){
    showIssue();
    displayLikes();
}

const issue_id = sessionStorage.getItem('issue_id');

function showIssue(){
    // show issue
    if(issue_id && sessionStorage.getItem('issue_file')){
        const issue_api = `http://127.0.0.1:8000/publication/issues/${issue_id}/`;
    
        getData(issue_api)
        .then(issue => {
            const issue_heading = document.getElementById('issue_heading');
            // set issue category
            let category = '';
            if(issue.category === 'LF'){
                category = 'LITERARY FOLIO';
            }
            if(issue.category === 'T'){
                category = 'TABLOID';
            }
            if(issue.category === 'SM'){
                category = 'SPORTS MAGAZINE';
            }
            if(issue.category === 'N'){
                category = 'NEWSLETTER';
            }
    
            issue_heading.innerHTML = `
                <div class="margin-bot"></div>
                <h1 class="font fw-bold text-primary text-center">VOL. ${issue.volume_number} | ISSUE : ${issue.issue_number}</h1>
                <div class="row d-flex flex-column flex-md-row font m-auto">
                    <div class="col text-center">${category}</div>
                    <div class="col text-center">${issue.date_published}</div>
                </div>
            `;
    
            document.getElementById('downloadIssue').setAttribute('href', issue.issue_file.file);
        })
        .catch(error => console.error(error));
    }else{
    window.location.href = 'http://127.0.0.1:5501/html-files/archive.html';
    }
}


// --------------------------- FOR DISPLAYING LIKES -----------------------------
let likes_api = `http://127.0.0.1:8000/reaction/likes/?object_id=${issue_id}&content_type=9`;

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
                removeLikeissue(like_id);
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
                editLikeIssue(true, like_id);
                like_button.setAttribute('class', 'bi bi-hand-thumbs-up-fill text-secondary cursor');
                dislike_button.setAttribute('class', 'bi bi-hand-thumbs-down text-secondary cursor');
            } else {
                location.reload();
            }
        }
        else if (like_button.getAttribute('class') === 'bi bi-hand-thumbs-up text-secondary cursor') {
            // like the article
            if (issue_id) {
                likeIssue(true, issue_id);
                like_button.setAttribute('class', 'bi bi-hand-thumbs-up-fill text-secondary cursor');
            }else{
                window.location.href = 'http://127.0.0.1:5501/index.html';
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
                removeLikeissue(like_id);
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
                editLikeIssue(false, like_id);
                dislike_button.setAttribute('class', 'bi bi-hand-thumbs-down-fill text-secondary cursor');
                like_button.setAttribute('class', 'bi bi-hand-thumbs-up text-secondary cursor');
            } else {
                location.reload();
            }
        }
        else if (dislike_button.getAttribute('class') === 'bi bi-hand-thumbs-down text-secondary cursor') {
            if (issue_id) {
                likeIssue(false, issue_id);
                dislike_button.setAttribute('class', 'bi bi-hand-thumbs-down-fill text-secondary cursor');
            }
        }
    } else {
        document.getElementById('modal-btn').click();
    }
})
// ------------------------------------------------------------------------------

// ----------------------------- FOR LIKING ARTICLE -----------------------------
function likeIssue(is_liked, issue_id) {
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
                    content_type: 9,
                    object_id: issue_id,
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
                                    likeIssue(is_liked, issue_id);
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
function removeLikeissue(like_id) {
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
                                    removeLikeissue(like_id);
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
function editLikeIssue(is_liked, like_id) {
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
                                    editLikeIssue(is_liked, like_id);
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