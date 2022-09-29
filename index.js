const searchURL = "https://api.github.com/search/repositories";
const searchInput = document.querySelector('.search-panel__input');
const autocompleteField = document.querySelector('.autocomplete-list');
const repositories = document.querySelector('.repository-list');

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

const removeRepo = (event) => {
    event.parentElement.remove();
}
const saveToRepostoryList = (liItem) => {
    autocompleteField.innerHTML = '';
    autocompleteField.classList.add('autocomplete-list--hidden');
    searchInput.value = ''
    const repositoryItem = document.createElement('li')
    repositoryItem.insertAdjacentHTML('afterbegin',`<div><p>Name: ${liItem.name}</p>
    <p>Owner: ${liItem.owner.login}</p><p>Stars:${liItem.stargazers_count}</p></div><i class="close" onclick="removeRepo(this)"></i>`);
    repositories.appendChild(repositoryItem);
}
const inputEventCb = async (event) => {
    if(event.target.value.length !== 0) {
        try {
            let query = await fetch(`${searchURL}?q=${event.target.value}&per_page=5`);
            const queryResult = await query.json();
            autocompleteField.innerHTML = '';
            autocompleteField.classList.remove('autocomplete-list--hidden');
            if(queryResult.items.length !== 0) {
                queryResult.items.forEach(queryItem => {
                    const liItem = document.createElement('li');
                    liItem.innerText = queryItem.name;
                    liItem.classList.add('autocomplete__item');
                    liItem.addEventListener('click', {
                        handleEvent() {
                            saveToRepostoryList(queryItem);
                          }
                    })
                    autocompleteField.appendChild(liItem);
                });
            } else {
                const liItem = document.createElement('li');
                liItem.innerText = 'Not found';
                liItem.classList.add('autocomplete__item');
                autocompleteField.appendChild(liItem);
            }


        } catch (error) {
            throw new Error(error.message);
        }
    } else {
        autocompleteField.innerHTML = '';
        autocompleteField.classList.add('autocomplete-list--hidden');
    }
}

const debouncedCb = debounce(inputEventCb, 500);

searchInput.addEventListener('input', debouncedCb);