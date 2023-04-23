import { getData, setData } from './api_fetch.js';

// for the first form (acc info)
const acc_info_submit_button = document.getElementById('acc_info_submit_button');
const username = document.getElementById('Username');
const email = document.getElementById('Email-address');
const password = document.getElementById('Enter-Password');
const re_password = document.getElementById('Confirm-password');

// for the first form (personal info)
const personal_info_submit_button = document.getElementById('personal_info_submit_button');
const last_name = document.getElementById('Last-name');
const first_name = document.getElementById('First-name');
const middle_initial = document.getElementById('Middle-initial');
const sex = document.getElementById('select-sex');
const birthdate = document.getElementById('Birthdate');
const city = document.getElementById('City-municipality');
const country = document.getElementById('country');

document.getElementById('acc_info_form').addEventListener('submit', (event) => {
    event.preventDefault();
    acc_info_submit_button.disabled = true;

    const new_account = {
        username : username.value,
        email : email.value,
        password : password.value,
        re_password : re_password.value,
    }

    createAccount(new_account);
})

function createAccount(new_account){
    const users_api = 'http://127.0.0.1:8000/auth/users/';

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(new_account)
    }

    setData(users_api, options)
    .then(data => {
        if(data.error){
            console.log(data.data);
            if(data.data.email){
                acc_info_submit_button.disabled = false;
                document.getElementById('create_acc_error').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1');
                document.getElementById('create_acc_error_message').textContent = data.data.email.join(' ');
            }
            if(data.data.username){
                acc_info_submit_button.disabled = false;
                document.getElementById('create_acc_error').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1');
                document.getElementById('create_acc_error_message').textContent = data.data.username.join(' ');
            }
            if(data.data.non_field_errors){
                acc_info_submit_button.disabled = false;
                document.getElementById('create_acc_error').setAttribute('class', 'alert alert-danger d-flex align-items-center mt-1');
                document.getElementById('create_acc_error_message').textContent = data.data.non_field_errors.join(' ');
            }
        }else{
            // go to next form
            acc_info_submit_button.disabled = true;
            document.getElementById('Account-information').setAttribute('class', 'create-account-content');
            document.getElementById('Personal-information').setAttribute('class', 'create-account-content mb-3 active');
        }
    })
    .catch(error => console.error(error));
}

document.getElementById('personalInformationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    personal_info_submit_button.disabled = true;

    const account_update = {
        last_name: last_name.value,
        first_name: first_name.value,
        middle_initial: middle_initial.value,
        sex: sex.value,
        reader: {
            birthdate: (birthdate.value !== '') ? birthdate.value : null,
            city: city.value,
            country: country.value
        }
    }
    updateAccount(account_update);
})

async function updateAccount(account_update){
    try{
        const current_user_api = 'http://127.0.0.1:8000/auth/users/me/';
        const access = await getAccessToken(username.value, password.value);
        
        if(access){
            // update account
            const options = {
                method: 'PATCH',
                headers: {
                    Authorization : `JWT ${access}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(account_update)
            }

            setData(current_user_api, options)
            .then(data => {
                if(data.error){
                    console.log(data.data);
                }else{
                    console.log(data);
                    document.getElementById('personal_info_error').setAttribute('class', 'alert alert-success d-flex align-items-center mt-1');
                    document.getElementById('personal_info_error_message').textContent = 'Account created successfully!';

                    setTimeout(function() {
                        sessionStorage.setItem('login', true);
                        window.location.href = 'http://127.0.0.1:5501';
                    }, 1000);
                }
            })
        }
    }catch(error){
        console.error(error);
    }
}

async function getAccessToken(username, password){
    try{
        const access_key_api = 'http://127.0.0.1:8000/auth/jwt/create/';

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }

        // get access key first
        const data = await setData(access_key_api, options);

        if(data.error){
            console.log(data.data);
        }else{
            return data.access;
        }
        console.log(data);
    }catch(error){
        console.error(error);
    }
}