import { setData } from './api_fetch.js';

const email_input = document.getElementById('email');
const continue_button = document.getElementById('continue_button');
document.getElementById('reset_password_form').addEventListener('submit', (event) => {
    event.preventDefault();

    try{
        continue_button.disabled = true;
        
        const forgot_password_api = 'http://127.0.0.1:8000/auth/users/reset_password/';
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email_input.value
            })
        }
        
        setData(forgot_password_api, options)
        .then(data => { 
            if(data.error){
                if(data.data.email){
                    document.getElementById('forgot_password_error').setAttribute('class', 'alert alert-danger d-flex align-items-center')
                    document.getElementById('forgot_password_error_message').textContent = data.data.email;
                    
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }
            }else{
                document.getElementById('FindAccount').setAttribute('class', 'forgot-pass-main');
                document.getElementById('reset_link_sent').setAttribute('class', 'forgot-pass-main active');
            }
        })
        .catch(error => console.error(error));
    }catch(error){
        console.error(error);
    }
})

document.getElementById('login_link').addEventListener('click', function() {
    sessionStorage.clear();
    sessionStorage.setItem('login', true);
    window.location.href = 'http://127.0.0.1:5501';
})