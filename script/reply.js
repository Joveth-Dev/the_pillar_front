let current_reply = '';

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

function enableEditReply(reply_id){
    try{
        if(sessionStorage.getItem('access') && sessionStorage.getItem('refresh')){
            const input_element = document.getElementById(`reply_message_${reply_id}`);

            current_reply = input_element.value;

            // check if the icon is an edit button
            const button = document.getElementById(`reply_icon_${reply_id}`);
            if(button.getAttribute('class') === 'bi bi-pencil-square'){
                // change edit icon to save icon
                button.setAttribute('class', 'bi bi-check2-square');
                button.setAttribute('title', 'Save');
        
                // enable message editing
                input_element.setAttribute('class', 'reply-to-comment m-0 text-secondary');
                input_element.disabled = false;
                input_element.focus();
                input_element.setSelectionRange(input_element.value.length, input_element.value.length);
    
                // display cancel editing button
                document.getElementById(`cancel_reply_${reply_id}`).setAttribute('class', 'bi bi-x-square');
                // hide delete comment button
                document.getElementById(`delete_reply_${reply_id}`).setAttribute('class', 'bi bi-trash d-none');
            }
            else if(button.getAttribute('class') === 'bi bi-check2-square'){
                if (input_element.value.trim() === '') {
                    input_element.reportValidity();
                }else{
                    editReply(reply_id);
                }
            }
    
        }else{
            document.getElementById('modal-btn').click();
        }
    }catch(error){
        console.error(error);
    }
}

function editReply(reply_id){
    try{
        if(sessionStorage.getItem('access') && sessionStorage.getItem('refresh')){
            const access = sessionStorage.getItem('access');
            
            if(access){
                const reply_url = `http://127.0.0.1:8000/reaction/replies/${reply_id}/`;
                const message = document.getElementById(`reply_message_${reply_id}`).value;
                const encodedReply = encodeURIComponent(message)
                
                const body = {
                    message: encodedReply
                }
                const options = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `JWT ${access}`,
                    },
                    body: JSON.stringify(body)
                }
                
                fetchData(reply_url, options)
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
                                editReply(reply_id);
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

function cancelEditReply(reply_id){
    const button = document.getElementById(`reply_icon_${reply_id}`);
    // change edit icon to save icon
    button.setAttribute('class', 'bi bi-pencil-square');
    button.setAttribute('title', 'Edit comment');

    // enable message editing
    const input_element = document.getElementById(`reply_message_${reply_id}`);
    input_element.value = current_reply;
    input_element.setAttribute('class', 'reply-to-comment m-0');
    input_element.disabled = true;

    // hide cancel editing button
    document.getElementById(`cancel_reply_${reply_id}`).setAttribute('class', 'bi bi-x-square d-none');
    // display delete comment button
    document.getElementById(`delete_reply_${reply_id}`).setAttribute('class', 'bi bi-trash');
}

function deleteReply(reply_id){
    try{
        if(sessionStorage.getItem('access') && sessionStorage.getItem('refresh')){
            const access = sessionStorage.getItem('access');
            
            if(access){
                const reply_url = `http://127.0.0.1:8000/reaction/replies/${reply_id}/`;
                const options = {
                    method: 'DELETE',
                    headers: {
                        Authorization: `JWT ${access}`,
                    }
                }
                
                fetchData(reply_url, options)
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
                                deleteReply(reply_id);
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

function confirmDeleteReplyModal(reply_id){
    const modal = document.getElementById('deleteReplyModal');
    modal.style.display = 'block';

    document.getElementById('cancel_delete_reply').addEventListener('click', function(){
        modal.style.display = 'none';
    })

    document.getElementById('confirm_delete_reply').addEventListener('click', function() {
        deleteReply(reply_id);
    })
}