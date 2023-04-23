// prevent page from scrolling up when closing modal
const modal = document.getElementById('modal-btn');
const closeButton = document.getElementById('close_modal');
let current_comment = '';

closeButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default behavior of the event
    modal.style.display = 'none'; // Hide the modal
});

async function fetchData(api_url, options){
    try{
        const response = await fetch(api_url, options)

        if(response.status === 204){
            return response;
        }else if(!response.ok) {
            // console.clear();
            return {
                error: response.status,
                data: await response.json(),
            };
        }
        return await response.json();
    }catch(error){
        console.error(error);
    }
}

function displayReplyForm(comment_id){
    // display reply form
    const reply_form = document.getElementById(`comment_${comment_id}`);

    reply_form.innerHTML = `
        <div class="row d-flex flex-column mt-3 font justify-content-end">
            <div class="col reply-container">
                <form action="" class="p-1">
                    <input type="text" placeholder="Write a reply..." class="commenting_section" id="reply_input" required>
                    <div class="btn-post">
                        <button type="button" class="btn text-light btn-secondary me-1" onclick="replyToComment(${comment_id})">Post</button>
                        <button type="button" class="btn text-light btn-secondary" onclick="cancelReply('comment_${comment_id}')">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    reply_form.setAttribute('class', '');
}

function replyToComment(comment_id){
    try{
        if(sessionStorage.getItem('access') && sessionStorage.getItem('refresh')){
            const message = document.getElementById('reply_input').value;
            const encodedReply = encodeURIComponent(message);

            if (message.trim() === '') {
                message.reportValidity();
            } else {
                const access = sessionStorage.getItem('access');
        
                if(access){
                    const replies_url = `http://127.0.0.1:8000/reaction/replies/`;

                    const body = {
                        comment: comment_id,
                        message: encodedReply
                    }

                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `JWT ${access}`,
                        },
                        body: JSON.stringify(body)
                    }
                    
                    fetchData(replies_url, options)
                    .then(data => {
                        if(data.error){
                            console.log(data.error);
                            console.log(data.data);
                            // get new access token
                            const refresh_api = 'http://127.0.0.1:8000/auth/jwt/refresh/';
            
                            const refresh_options = {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body : JSON.stringify({
                                    'refresh' : sessionStorage.getItem('refresh')
                                })
                            }
                            
                            fetchData(refresh_api, refresh_options)
                            .then(data => {
                                if(data.error){
                                    console.log(data.error);
                                }else{
                                    console.log('new access');
                                    sessionStorage.setItem('access', data.access);
                                    replyToComment(comment_id);
                                }
                            })
                            .catch(error => console.error(error));
                        }else{
                            location.reload();
                        }
                    })
                    .catch(error => console.error(error));
                }else{
                    location.reload();
                }
            }
        }else{
            document.getElementById('modal-btn').click();
        }
    }catch(error){
        console.error(error);
    }
}

function cancelReply(reply_form_id){
    document.getElementById(reply_form_id).setAttribute('class', 'd-none');
}

function enableEditComment(comment_id){
    try{
        if(sessionStorage.getItem('access') && sessionStorage.getItem('refresh')){
            const input_element = document.getElementById(`message_${comment_id}`);

            current_comment = input_element.value;

            // check if the icon is an edit button
            const button = document.getElementById(`icon_${comment_id}`);
            if(button.getAttribute('class') === 'bi bi-pencil-square'){
                // change edit icon to save icon
                button.setAttribute('class', 'bi bi-check2-square');
                button.setAttribute('title', 'Save');
        
                // enable message editing
                input_element.setAttribute('class', 'posted-comment text-secondary');
                input_element.disabled = false;
                input_element.focus();
                input_element.setSelectionRange(input_element.value.length, input_element.value.length);
    
                // display cancel editing button
                document.getElementById(`cancel_${comment_id}`).setAttribute('class', 'bi bi-x-square');
                // hide delete comment button
                document.getElementById(`delete_${comment_id}`).setAttribute('class', 'bi bi-trash d-none');
            }
            else if(button.getAttribute('class') === 'bi bi-check2-square'){
                if (input_element.value.trim() === '') {
                    input_element.reportValidity();
                }else{
                    editComment(comment_id);
                }
            }
    
        }else{
            document.getElementById('modal-btn').click();
        }
    }catch(error){
        console.error(error);
    }
}

function editComment(comment_id){
    try{
        if(sessionStorage.getItem('access') && sessionStorage.getItem('refresh')){
            const access = sessionStorage.getItem('access');
            
            if(access){
                const comment_url = `http://127.0.0.1:8000/reaction/comments/${comment_id}/`;
                const message = document.getElementById(`message_${comment_id}`).value;
                const encodedComment = encodeURIComponent(message)
                
                const body = {
                    message: encodedComment
                }
                const options = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${access}`,
                    },
                    body: JSON.stringify(body)
                }
                
                fetchData(comment_url, options)
                .then(data => {
                    if(data.error){
                        console.log(data.error);
                        console.log(data.data);
                        // get new access token
                        const refresh_api = 'http://127.0.0.1:8000/auth/jwt/refresh/';
        
                        const refresh_options = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body : JSON.stringify({
                                'refresh' : sessionStorage.getItem('refresh')
                            })
                        }
                        
                        fetchData(refresh_api, refresh_options)
                        .then(data => {
                            if(data.error){
                                console.log(data.error);
                            }else{
                                console.log('new access');
                                sessionStorage.setItem('access', data.access);
                                editComment(comment_id);
                            }
                        })
                        .catch(error => console.error(error));
                    }else{
                        location.reload();
                    }
                })
                .catch(error => console.error(error));
            }else{
                location.reload();
            }
        }else{
            document.getElementById('modal-btn').click();
        }
    }catch(error){
        console.error(error);
    }
}

function cancelEditComment(comment_id){
    const button = document.getElementById(`icon_${comment_id}`);
    // change edit icon to save icon
    button.setAttribute('class', 'bi bi-pencil-square');
    button.setAttribute('title', 'Edit comment');

    // enable message editing
    const input_element = document.getElementById(`message_${comment_id}`);
    input_element.value = current_comment;
    input_element.setAttribute('class', 'posted-comment');
    input_element.disabled = true;

    // hide cancel editing button
    document.getElementById(`cancel_${comment_id}`).setAttribute('class', 'bi bi-x-square d-none');
    // display delete comment button
    document.getElementById(`delete_${comment_id}`).setAttribute('class', 'bi bi-trash');
}

function deleteComment(comment_id){
    try{
        if(sessionStorage.getItem('access') && sessionStorage.getItem('refresh')){
            const access = sessionStorage.getItem('access');
            
            if(access){
                const comment_url = `http://127.0.0.1:8000/reaction/comments/${comment_id}/`;
                const options = {
                    method: 'DELETE',
                    headers: {
                        Authorization: `JWT ${access}`,
                    }
                }
                
                fetchData(comment_url, options)
                .then(data => {
                    if(data.error){
                        console.log(data.error);
                        console.log(data.data);
                        // get new access token
                        const refresh_api = 'http://127.0.0.1:8000/auth/jwt/refresh/';
        
                        const refresh_options = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body : JSON.stringify({
                                'refresh' : sessionStorage.getItem('refresh')
                            })
                        }
                        
                        fetchData(refresh_api, refresh_options)
                        .then(data => {
                            if(data.error){
                                console.log(data.error);
                            }else{
                                console.log('new access');
                                sessionStorage.setItem('access', data.access);
                                deleteComment(comment_id);
                            }
                        })
                        .catch(error => console.error(error));
                    }else{
                        location.reload();
                    }
                })
                .catch(error => console.error(error));
            }else{
                location.reload();
            }
        }else{
            document.getElementById('modal-btn').click();
        }
    }catch(error){
        console.error(error);
    }
}

function confirmDeleteCommentModal(comment_id){
    const modal = document.getElementById('deleteCommentModal');
    modal.style.display = 'block';

    document.getElementById('cancel_delete_comment').addEventListener('click', function(){
        modal.style.display = 'none';
    })

    document.getElementById('confirm_delete_comment').addEventListener('click', function() {
        deleteComment(comment_id);
    })
}
