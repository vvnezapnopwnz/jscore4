const searchURL = "https://api.github.com/search/repositories";
const searchInput = document.querySelector('.search-panel__input');
const autocompleteField = document.querySelector('.autocomplete-list');
const repositories = document.querySelector('.repository-list');

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

const removeRepo = (e) => {
    e.parentElement.remove();
}
const saveToRepostoryList = (e, item) => {
    autocompleteField.innerHTML = '';
    autocompleteField.classList.add('autocomplete-list--hidden');
    searchInput.value = ''
    const repositoryItem = document.createElement('li')
    repositoryItem.insertAdjacentHTML('afterbegin',`<div><p>${item.name}</p>
    <p>${item.owner.login}</p><p>${item.stargazers_count}</p></div><i class="close" onclick="removeRepo(this)"></i>`);
    repositories.appendChild(repositoryItem);
}
const inputEventCb = async (e) => {
    if(e.target.value.length !== 0) {
        try {
            let query = await fetch(`${searchURL}?q=${e.target.value}&per_page=5`);
            const queryResult = await query.json();
            autocompleteField.innerHTML = '';
            autocompleteField.classList.remove('autocomplete-list--hidden');
            queryResult.items.forEach(item => {
                const liItem = document.createElement('li');
                liItem.innerText = item.name;
                liItem.classList.add('autocomplete__item');
                liItem.addEventListener('click', {
                    handleEvent(event) {
                        saveToRepostoryList(event, item);
                      }
                })
                autocompleteField.appendChild(liItem);
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

const debouncedCb = debounce(inputEventCb, 500);

searchInput.addEventListener('input', debouncedCb);