import { getData, setData } from './api_fetch.js';

document.addEventListener('DOMContentLoaded', displayProfile);

export function displayProfile(){
    try {
        const access = sessionStorage.getItem('access');
    
        if (access){
            const current_user_api = 'http://127.0.0.1:8000/auth/users/me/';
            
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
                            sessionStorage.clear();
                        }else{
                            sessionStorage.setItem('access', data.access);
                            displayProfile();
                        }
                    })
                    .catch(error => console.error(error));
                }else{
                    // get user_id
                    sessionStorage.setItem('user_id', data.id);

                    // set avatar
                    let avatar;
                    if(!data.avatar){
                        if(window.location.href === 'http://127.0.0.1:5501/'){
                            if(data.sex === 'M'){
                                avatar = './img/default_avatar_imgs/default_male.jpg';
                            }
                            if(data.sex === 'F'){
                                avatar = './img/default_avatar_imgs/default_female.jpg';
                            }
                            if(data.sex === 'N'){
                                avatar = './img/default_avatar_imgs/default_no_sex.jpg';
                            }
                        }else{
                            if(data.sex === 'M'){
                                avatar = '/img/default_avatar_imgs/default_male.jpg';
                            }
                            if(data.sex === 'F'){
                                avatar = '/img/default_avatar_imgs/default_female.jpg';
                            }
                            if(data.sex === 'N'){
                                avatar = '/img/default_avatar_imgs/default_no_sex.jpg';
                            }
                        }
                    }else{
                        avatar = data.avatar;
                    }

                    const profile_container = document.getElementById('profile-btn-div');
                    let avatar_file_name = avatar.substring(avatar.lastIndexOf('/') + 1)
                    
                    // set target location of button
                    let target_link = 'userProfile.html';
                    if (window.location.href === 'http://127.0.0.1:5501/index.html') {
                        target_link = 'html-files/userProfile.html';
                    }

                    profile_container.innerHTML = `
                        <button 
                            type="button" 
                            class="btn p-0" 
                            title="My account" 
                            onclick="location.href='${target_link}'"
                            >
                            <img class="profile-container" src="${avatar}" alt="${avatar_file_name}">
                        </button>
                    `;
                }
            })
            .catch(error => console.error(error));
        }
    }
    catch(error){
        console.error(error);
    }
}