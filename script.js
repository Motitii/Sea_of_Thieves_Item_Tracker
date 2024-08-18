function loadItems(Jsonlang) {
    fetch(Jsonlang)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(items => {
            if (!Array.isArray(items)) {
                throw new Error('Data format error: Expected an array of items.');
            }

            const itemGrid = document.querySelector('.item-grid');
            if (!itemGrid) {
                throw new Error('Item grid container not found in the DOM.');
            }
            window.allItems = items;
            displayItems(items);
        })
        .catch(error => {
            console.error('Error loading items:', error.message);
        });
}

function displayItems(items) {
    const itemGrid = document.querySelector('.item-grid');
    itemGrid.innerHTML = '';

    const fragment = document.createDocumentFragment();

    items.forEach(item => {
        if (!item.image || !item.name || !item.condition || !item.location || !item.price) {
            console.warn('Skipping item due to missing data:', item);
            return;
        }

        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');

        itemCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <h2 class="item-name">${item.name}</h2>
            <p class="item-condition">${item.condition}</p>
            <div class="item-details">
                <span class="item-location">${item.location}</span>
                <span class="item-price">${item.price} <img src="${item.image_gold}" alt="Gold" class="coin-icon"></span>
            </div>
        `;

        fragment.appendChild(itemCard);
    });

    itemGrid.appendChild(fragment);
}

document.addEventListener('DOMContentLoaded', () => {
    loadItems("items_fr.json");

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredItems = window.allItems.filter(item => item.name.toLowerCase().includes(searchTerm));
        displayItems(filteredItems);
    });
});

function changeLanguage(language) {
    localStorage.setItem('language', language);
    const fileName = `items_${language}.json`;
    clearItems();
    loadItems(fileName);
}

function clearItems() {
    const itemGrid = document.querySelector('.item-grid');
    if (itemGrid) {
        itemGrid.innerHTML = '';
    } else {
        console.warn('Item grid container not found in the DOM.');
    }
}
