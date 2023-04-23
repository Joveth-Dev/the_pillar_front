import { displayProfile } from './account.js';
import { setData } from './api_fetch.js';

const url_params = new URLSearchParams(window.location.search);

if(sessionStorage.getItem('login') || url_params.has('login')){
    url_params.delete('login');
    sessionStorage.removeItem('login');
    const newUrl = window.location.origin + window.location.pathname + '' + url_params.toString();
    window.history.replaceState({path: newUrl}, '', newUrl);
    document.getElementById('modal-btn').click();
}

// users endpoint
const users_api = 'http://127.0.0.1:8000/auth/jwt/create/';

// ---------------- ENABLE LOGIN BUTTON WHEN BOTH INPUT HAS VALUE -------------------
const login_button = document.getElementById('login_button');
const username_input = document.getElementById('Username');
const password_input = document.getElementById('Password');

function enableLoginButton() {
    if (username_input.value.trim() !== '' && password_input.value.trim() !== '') {
        login_button.disabled = false;
    }else {
        login_button.disabled = true;
    }
}
username_input.addEventListener('input', enableLoginButton);
password_input.addEventListener('input', enableLoginButton);
// ----------------------------------------------------------------------------------

login_button.addEventListener('click', function() {
    const user_credentials = {
        username : username_input.value,
        password : password_input.value
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify(user_credentials)
    }
    
    setData(users_api, options)
    .then(data => {
        if(data.error){
            // display error
            document.getElementById('login-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-block');
            document.getElementById('login-error').textContent = data.data.detail;
        }else{
            // simulate click on close button to remove modal
            document.getElementById('close_modal').click();
            
            // remove error displayed
            document.getElementById('login-div').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1 d-none');
            document.getElementById('login-error').textContent = '';
            
            // store access and refresh keys in sessionStorage
            sessionStorage.setItem('access', data.access);
            sessionStorage.setItem('refresh', data.refresh);
            
            displayProfile();
            location.reload();
        }
    })
    .catch(error => console.error(error));
})