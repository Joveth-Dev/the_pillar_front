import { getData, setData } from './api_fetch.js';

// remove this later
if(sessionStorage.getItem('change_pass')){
    document.getElementById('v-pills-security-tab').click();
    sessionStorage.removeItem('change_pass');
}

if(!(sessionStorage.getItem('access') && sessionStorage.getItem('refresh'))){
    window.location.href = 'http://127.0.0.1:5501';
}

document.getElementById('logout_button').addEventListener('click', function() {
    document.getElementById('confirm_logout').addEventListener('click', function() {
        sessionStorage.clear();
        sessionStorage.setItem('login', true);
        window.location.href = 'http://127.0.0.1:5501/index.html';
    })  
})


// --------- FOR POPULATING FORM WITH CURRENT USER's DATA --------------
document.addEventListener('DOMContentLoaded', displayAccount);
const current_user_api = 'http://127.0.0.1:8000/auth/users/me/';

export function displayAccount(){
    try {
        const access = sessionStorage.getItem('access');
    
        if (access){
            
            const options = {
                headers: {
                    Authorization: `JWT ${access}`,
                },
            }
            
            getData(current_user_api, options)
            .then(data => {
                if(data.error) {
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

                    setData(refresh_api, refresh_options)
                    .then(data => {
                        if(data.error){
                            console.log(data.error);
                        }else{
                            console.log('new access');
                            sessionStorage.setItem('access', data.access);
                            displayAccount();
                        }
                    })
                    .catch(error => console.error(error));
                }else{
                    // set avatar
                    let avatar;
                    if(!data.avatar){
                        if(data.sex === 'M'){
                            avatar = '../img/default_avatar_imgs/default_male.jpg';
                        }
                        if(data.sex === 'F'){
                            avatar = '../img/default_avatar_imgs/default_female.jpg';
                        }
                        if(data.sex === 'N'){
                            avatar = '../img/default_avatar_imgs/default_no_sex.jpg';
                        }
                    }else{
                        avatar = data.avatar;
                    }

                    // display avatar
                    document.getElementById('account_avatar').innerHTML = `
                        <img src="${avatar}" alt="${avatar.substring(avatar.lastIndexOf('/') + 1)}">
                    `;

                    // display name
                    const display_name = document.getElementById('accountName');
                    
                    // display username
                    document.getElementById('userName').textContent = `@${data.username}`;
                    display_name.textContent = `${data.first_name} ${data.last_name}`;

                    // preload personal info to inputs
                    document.getElementById('Last-name').value = data.last_name;
                    document.getElementById('First-name').value = data.first_name;
                    document.getElementById('Middle-initial').value = data.middle_initial;
                    document.getElementById('email').value = data.email;
                    document.getElementById('Birthdate').value = data.reader.birthdate;
                    document.getElementById('select-sex').value = data.sex;
                    document.getElementById('City-municipality').value = data.reader.city;
                    document.getElementById('country').value = data.reader.country;
                }
            })
            .catch(error => console.error(error));
        }
    }
    catch(error){
        console.error(error);
    }
}
// ---------------------------------------------------------------------

// ------------------ FOR HANDLING ACCOUNT UPDATE ----------------------
document.getElementById('add_info_form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const edit_account_button = document.getElementById('edit_button');

    const email = document.getElementById('email');
    const last_name = document.getElementById('Last-name');
    const first_name = document.getElementById('First-name');
    const middle_initial = document.getElementById('Middle-initial');
    const sex = document.getElementById('select-sex');
    const birthdate = document.getElementById('Birthdate');
    const city = document.getElementById('City-municipality');
    const country = document.getElementById('country');
    
    if(edit_account_button.textContent === 'Edit'){
        edit_account_button.textContent = 'Save';
        
        email.disabled = false;
        last_name.disabled = false;
        first_name.disabled = false;
        middle_initial.disabled = false;
        sex.disabled = false;
        birthdate.disabled = false;
        city.disabled = false;
        country.disabled = false;
        
    }else if(edit_account_button.textContent === 'Save'){
        try{
            const account_update = {
                email : email.value,
                last_name : last_name.value,
                first_name : first_name.value,
                middle_initial : middle_initial.value,
                sex : sex.value,
                reader : {
                    birthdate: (birthdate.value !== '') ? birthdate.value : null,
                    city : city.value,
                    country : country.value
                }
            }
            
            updateAccount(current_user_api, account_update);
        }catch(error){
            console.error(error);
        }
    }
})
// ---------------------------------------------------------------------


// ------------------ FOR HANDLING AVATAR UPDATE ----------------------
const upload_input = document.getElementById('profilePictureUploadInput');
const upload_button = document.getElementById('confirm_edit_avatar');

upload_input.addEventListener('input', (event) => {
    if(upload_input.value.trim() !== ''){
        upload_button.disabled = false;
    }else{
        upload_button.disabled = true;
    }
});

upload_button.addEventListener('click', uploadAvatar);

export function uploadAvatar(){
    // disable upload button first
    upload_button.disabled = true;

    let picture_input = document.getElementById('profilePictureUploadInput');
    
    let picture = picture_input.files[0];

    let form_data = new FormData()

    form_data.append('avatar', picture);

    updateAccount(current_user_api, form_data, true);
}
// ---------------------------------------------------------------------

// ---------- FOR APPLYING CHANGES IN CURRENT USER's ACCOUNT -----------
export function updateAccount(api_url, user_update, is_form_data=false){
    try{
        const access = sessionStorage.getItem('access');
        if(access){
            let options;
            // set user_update
            if(!is_form_data){
                options = {
                    method: 'PATCH',
                    headers: {
                        Authorization : `JWT ${access}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user_update)
                }
            }else{
                options = {
                    method: 'PATCH',
                    headers: {
                        Authorization : `JWT ${access}`,
                    },
                    body: user_update
                }
            }
            
            setData(api_url, options)
            .then(data => {
                if(data.error){
                    // get new access token
                    const refresh_api = 'http://127.0.0.1:8000/auth/jwt/refresh/';
                    
                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body : JSON.stringify({
                            'refresh' : sessionStorage.getItem('refresh')
                        })
                    }

                    setData(refresh_api, options)
                    .then(data => {
                        if(data.error){
                            console.log(data.error);
                        }else{
                            console.log('new access');
                            sessionStorage.setItem('access', data.access);
                            updateAccount(current_user_api, user_update);
                        }
                    })
                    .catch(error => console.error(error));
                }else{
                    // display message in add info
                    document.getElementById('edit_button').disabled = true;
                    document.getElementById('update_error').setAttribute('class', 'alert alert-success d-flex form-control align-items-center mt-1 d-block')
                    document.getElementById('update_error_message').textContent = 'Updated successfully!';
                    
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }
            })
            .catch(error => console.error(error));
        }
    }catch(error){
        console.error(error);
    }
}
// ---------------------------------------------------------------------

// ------------------- FOR HANDLING CHANGE PASSWORD --------------------
const change_password_button = document.getElementById('change_password_button');
const change_pass_form = document.getElementById('change_pass_container');
change_password_button.addEventListener('click', function(){
    change_pass_form.setAttribute('class', 'mt-3 border rounded p-2 bg-light');
})

const cancel_change_pass = document.getElementById('cancel_change_pass');
cancel_change_pass.addEventListener('click', function(){
    change_pass_form.setAttribute('class', 'mt-3 border rounded p-2 bg-light d-none');
})

document.getElementById('change_pass_form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const new_pass = document.getElementById('New-Password');
    const confirm_pass = document.getElementById('Confirm-password');
    const current_pass = document.getElementById('Current-Password');
    const password_update = {
        new_password: new_pass.value,
        re_new_password: confirm_pass.value,
        current_password: current_pass.value
    }

    updatePassword(password_update);
})
// ---------------------------------------------------------------------


// ----------------------- FOR UPDATE PASSWORD -------------------------
export function updatePassword(change_pass_data){
    try{
        const change_pass_api = 'http://127.0.0.1:8000/auth/users/set_password/';
        const access = sessionStorage.getItem('access');
        if(access){
            const options = {
                method: 'POST',
                headers: {
                    Authorization: `JWT ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(change_pass_data)
            }
            
            setData(change_pass_api, options)
            .then(data => {
                const change_pass_error = document.getElementById('change_pass_error');
                const change_pass_error_message = document.getElementById('change_pass_error_message');
                if(data.error && data.error=== 401){
                    // get new access token
                    const refresh_api = 'http://127.0.0.1:8000/auth/jwt/refresh/';
                    
                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body : JSON.stringify({
                            'refresh' : sessionStorage.getItem('refresh')
                        })
                    }

                    setData(refresh_api, options)
                    .then(data => {
                        if(data.error){
                            console.log(data.error);
                        }else{
                            console.log('new access');
                            sessionStorage.setItem('access', data.access);
                            updatePassword(change_pass_data);
                        }
                    })
                    .catch(error => console.error(error));
                }
                if(data.error){
                    // display errors to user
                    if(data.data.current_password){
                        change_pass_error.setAttribute('class', 'alert alert-danger d-flex form-control mt-1');
                        change_pass_error_message.textContent = data.data.current_password.join(' ');
                        document.getElementById('change_pass_save').disabled = false;
                    }
                    if(data.data.new_password){
                        change_pass_error.setAttribute('class', 'alert alert-danger d-flex form-control mt-1');
                        change_pass_error_message.textContent = data.data.new_password.join(' ');
                        document.getElementById('change_pass_save').disabled = false;
                    }
                    if(data.data.non_field_errors){
                        change_pass_error.setAttribute('class', 'alert alert-danger d-flex form-control mt-1');
                        change_pass_error_message.textContent = data.data.non_field_errors.join(' ');
                        document.getElementById('change_pass_save').disabled = false;
                    }
                }else{
                    change_pass_error.setAttribute('class', 'alert alert-success d-flex form-control mt-1');
                    change_pass_error_message.textContent = 'Updated successfully!';
                    document.getElementById('change_pass_save').disabled = false;
        
                    setTimeout(function() {
                        sessionStorage.setItem('change_pass', true);
                        location.reload();
                    }, 1000);
                }
            })
            .catch(error => console.log(error));
        }
    }catch(error){
        console.error(error);
    }
}
// ---------------------------------------------------------------------

// ----------------------- FOR DELETING ACCOUNT ------------------------
const deactivate_acc_submit = document.getElementById('deactivate_acc_submit');
const deactivate_acc_input = document.getElementById('password');
document.getElementById('deactivate_acc_button').addEventListener('click', function() {
    document.getElementById('deactivate_acc_form').setAttribute('class', 'mt-3 border rounded p-2 bg-light');
})

document.getElementById('deactivate_acc_cancel').addEventListener('click', function() {
    document.getElementById('deactivate_acc_form').setAttribute('class', 'mt-3 border rounded p-2 bg-light d-none');
    deactivate_acc_input.value = '';
    deactivate_acc_submit.disabled = true;
    document.getElementById('deactivate_acc_error').setAttribute('class', 'alert alert-danger d-flex form-control mt-1 d-none');
    document.getElementById('deactivate_acc_error_message').textContent = '';
})

document.getElementById('deactivate_acc_form').addEventListener('submit', (event) => {
    event.preventDefault();
    new bootstrap.Modal(document.getElementById('DeleteAccount')).show();
})

deactivate_acc_input.addEventListener('input', (event) => {
    if(deactivate_acc_input.value.trim() !== ''){
        deactivate_acc_submit.disabled = false;
    }else{
    }
});

document.getElementById('cancel_confirm').addEventListener('click', function() {
    deactivate_acc_input.value = '';
    deactivate_acc_submit.disabled = true;
})

document.getElementById('confirm_delete').addEventListener('click', function() {
    
    try{
        const access = sessionStorage.getItem('access');
        if(access){
            const options = {
                method: 'DELETE',
                headers: {
                    Authorization : `JWT ${access}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_password : deactivate_acc_input.value
                })
            }

            setData(current_user_api, options)
            .then(data => {
                if(data.error){
                    console.log(data.data.current_password);
                    deactivate_acc_input.value = '';
                    document.getElementById('deactivate_acc_error').setAttribute('class', 'alert alert-danger d-flex form-control mt-1');
                    document.getElementById('deactivate_acc_error_message').textContent = data.data.current_password;
                }else{
                    document.getElementById('deactivate_acc_error').setAttribute('class', 'alert alert-danger d-flex form-control mt-1');
                    document.getElementById('deactivate_acc_error_message').textContent = 'Account deleted!';

                    setTimeout(function() {
                        sessionStorage.clear();
                        sessionStorage.setItem('login', true);
                        window.location.href = 'http://127.0.0.1:5501';
                    }, 1000);
                }
                console.log(data);
            })
            .catch(error => console.error(error));
        }
    }catch(error){
        console.error(error);
    }
})
// ---------------------------------------------------------------------