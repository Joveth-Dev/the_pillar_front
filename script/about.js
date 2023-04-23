import { getData } from './api_fetch.js';

window.onload = function() {
    displayMembers();
}

function displayMembers(){
    const authors_api = 'http://127.0.0.1:8000/publication/authors/';

    getData(authors_api)
    .then(data => {
        for(const author of data){
            // display editorial board
            const editorialBoard = document.getElementById('editorialBoard');
            const editorialBoardPositions = ['editor-in-chief', 'associate editor', 'managing editor', 'culture editor', 'feature editor', 'news editor'];
            const AdvisersManagementPositions = ['technical adviser', 'finance manager', '	assistant finance manager', 'technical adviser'];

            if(editorialBoardPositions.includes(author.current_position.toLowerCase())){
                // set avatar for author with no pic
                let avatar = "";
                if(!author.user_avatar){
                    if(author.sex === 'M'){
                        avatar = '/img/default_avatar_imgs/default_male.jpg';
                    }
                    if(author.sex === 'F'){
                        avatar = '/img/default_avatar_imgs/default_female.jpg';
                    }
                    if(author.sex === 'N'){
                        avatar = '/img/default_avatar_imgs/default_no_sex.jpg';
                    }
                }else{
                    avatar = author.user_avatar;
                }

                editorialBoard.innerHTML += `
                    <div class="col about-col text-center">
                        <img src="${avatar}" alt="Author's profile">
                        <div class="member-info">
                            <p class="writer-name">${author.full_name}</p>
                            <p>${author.current_position}</p>
                        </div>
                    </div>
                `;
            }
            if(author.current_position.toLowerCase() === 'staff writters'){
                const staffWriter = document.getElementById('staffWriter');
                // set avatar for author with no pic
                let avatar = "";
                if(!author.user_avatar){
                    if(author.sex === 'M'){
                        avatar = '/img/default_avatar_imgs/default_male.jpg';
                    }
                    if(author.sex === 'F'){
                        avatar = '/img/default_avatar_imgs/default_female.jpg';
                    }
                    if(author.sex === 'N'){
                        avatar = '/img/default_avatar_imgs/default_no_sex.jpg';
                    }
                }else{
                    avatar = author.user_avatar;
                }

                staffWriter.innerHTML += `
                    <div class="col about-col text-center">
                        <img src="${avatar}" alt="Author's profile">
                        <div class="member-info">
                            <p class="writer-name">${author.full_name}</p>
                            <p>${author.current_position}</p>
                        </div>
                    </div>
                `;   
            }
            if(author.current_position.toLowerCase() === 'cartoonist'){
                const staffWriter = document.getElementById('cartoonists');
                // set avatar for author with no pic
                let avatar = "";
                if(!author.user_avatar){
                    if(author.sex === 'M'){
                        avatar = '/img/default_avatar_imgs/default_male.jpg';
                    }
                    if(author.sex === 'F'){
                        avatar = '/img/default_avatar_imgs/default_female.jpg';
                    }
                    if(author.sex === 'N'){
                        avatar = '/img/default_avatar_imgs/default_no_sex.jpg';
                    }
                }else{
                    avatar = author.user_avatar;
                }

                staffWriter.innerHTML += `
                    <div class="col about-col text-center">
                        <img src="${avatar}" alt="Author's profile">
                        <div class="member-info">
                            <p class="writer-name">${author.full_name}</p>
                            <p>${author.current_position}</p>
                        </div>
                    </div>
                `;   
            }
            if(author.current_position.toLowerCase() === 'photojournalist'){
                const staffWriter = document.getElementById('photojournalists');
                // set avatar for author with no pic
                let avatar = "";
                if(!author.user_avatar){
                    if(author.sex === 'M'){
                        avatar = '/img/default_avatar_imgs/default_male.jpg';
                    }
                    if(author.sex === 'F'){
                        avatar = '/img/default_avatar_imgs/default_female.jpg';
                    }
                    if(author.sex === 'N'){
                        avatar = '/img/default_avatar_imgs/default_no_sex.jpg';
                    }
                }else{
                    avatar = author.user_avatar;
                }

                staffWriter.innerHTML += `
                    <div class="col about-col text-center">
                        <img src="${avatar}" alt="Author's profile">
                        <div class="member-info">
                            <p class="writer-name">${author.full_name}</p>
                            <p>${author.current_position}</p>
                        </div>
                    </div>
                `;   
            }
            if(author.current_position.toLowerCase() === 'layout artist'){
                const staffWriter = document.getElementById('layoutArtists');
                // set avatar for author with no pic
                let avatar = "";
                if(!author.user_avatar){
                    if(author.sex === 'M'){
                        avatar = '/img/default_avatar_imgs/default_male.jpg';
                    }
                    if(author.sex === 'F'){
                        avatar = '/img/default_avatar_imgs/default_female.jpg';
                    }
                    if(author.sex === 'N'){
                        avatar = '/img/default_avatar_imgs/default_no_sex.jpg';
                    }
                }else{
                    avatar = author.user_avatar;
                }

                staffWriter.innerHTML += `
                    <div class="col about-col text-center">
                        <img src="${avatar}" alt="Author's profile">
                        <div class="member-info">
                            <p class="writer-name">${author.full_name}</p>
                            <p>${author.current_position}</p>
                        </div>
                    </div>
                `;   
            }
            if(AdvisersManagementPositions.includes(author.current_position.toLowerCase())){
                const staffWriter = document.getElementById('advisersAndManagers');
                // set avatar for author with no pic
                let avatar = "";
                if(!author.user_avatar){
                    if(author.sex === 'M'){
                        avatar = '/img/default_avatar_imgs/default_male.jpg';
                    }
                    if(author.sex === 'F'){
                        avatar = '/img/default_avatar_imgs/default_female.jpg';
                    }
                    if(author.sex === 'N'){
                        avatar = '/img/default_avatar_imgs/default_no_sex.jpg';
                    }
                }else{
                    avatar = author.user_avatar;
                }

                staffWriter.innerHTML += `
                    <div class="col about-col text-center">
                        <img src="${avatar}" alt="Author's profile">
                        <div class="member-info">
                            <p class="writer-name">${author.full_name}</p>
                            <p>${author.current_position}</p>
                        </div>
                    </div>
                `;   
            }
        }
    })
    .catch(error => console.error(error));
}