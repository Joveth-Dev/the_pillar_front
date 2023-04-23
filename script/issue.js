import { getData } from './api_fetch.js';

window.onload = function () {
    displayIssues(issues_api);
}

// --------------------- FOR POPULATING LATEST ARTICLES -------------------------
const article_id = sessionStorage.getItem('article_id');
const articles_api = 'http://127.0.0.1:8000/publication/articles/';
const latest_articles_container = document.getElementById('latest_articles_container');
let issues_api = 'http://127.0.0.1:8000/publication/issues';

getData(articles_api)
    .then(data => {
        const indexToRemove = data.findIndex(obj => obj.id === parseInt(article_id));

        if (indexToRemove !== -1) {
            data.splice(indexToRemove, 1);
        }

        data = data.slice(0, 10);

        for (const article of data) {
            latest_articles_container.innerHTML += `
            <a href="readView.html" class="link-style" onclick="sessionStorage.setItem('article_id', ${article.id}), sessionStorage.removeItem('update_id')">
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

function displayIssues(api) {
    getData(api)
        .then(async data => {
            const issue_container = document.getElementById('issue_container');
            issue_container.innerHTML = '';

            for (const issue of data) {
                // set issue category
                let category = '';
                if (issue.category === 'LF') {
                    category = 'LITERARY FOLIO';
                }
                if (issue.category === 'T') {
                    category = 'TABLOID';
                }
                if (issue.category === 'SM') {
                    category = 'SPORTS MAGAZINE';
                }
                if (issue.category === 'N') {
                    category = 'NEWSLETTER';
                }
                issue_container.innerHTML += `
                <a href="archiveREAD.html" class="col-5 col-md-3 issue-col link-style" onclick="sessionStorage.setItem('issue_id', ${issue.id}), sessionStorage.setItem('issue_file', '${issue.issue_file.file}')">
                    <img src="${issue.issue_file.image_for_thumbnail}" alt="Issue thumbnail">
                    <div class="issue-title">VOL. ${issue.volume_number} | ISSUE : ${issue.issue_number}</div>
                        <span class="issue-category fw-bold"> ${category}</span>
                    <div class="issue-date-pub">${issue.date_published}</div>
                </a>
            `;
            }
        })
        .catch(error => console.error(error));
}

document.getElementById('all_issues').addEventListener('click', function () {
    displayIssues(issues_api)
})

document.getElementById('LF').addEventListener('click', function () {
    displayIssues(`${issues_api}?category=LF`);
})

document.getElementById('N').addEventListener('click', function () {
    displayIssues(`${issues_api}?category=N`);
})

document.getElementById('SM').addEventListener('click', function () {
    displayIssues(`${issues_api}?category=SM`);
})

document.getElementById('T').addEventListener('click', function () {
    displayIssues(`${issues_api}?category=T`);
})