const languageFiles = {
    fr: ['json/compass_fr.json', 'json/bucket_fr.json', 'json/shovel_fr.json'],
    en: ['json/compass_en.json', 'json/bucket_en.json', 'json/shovel_en.json'],
};

function loadItems(jsonFiles) {
    const promises = jsonFiles.map(file => 
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
    );

    Promise.all(promises)
        .then(allItemsArrays => {
            const allItems = allItemsArrays.flat();
            if (!Array.isArray(allItems)) {
                throw new Error('Data format error: Expected an array of items.');
            }

            const itemGrid = document.querySelector('.item-grid');
            if (!itemGrid) {
                throw new Error('Item grid container not found in the DOM.');
            }

            window.allItems = allItems;
            displayItems(allItems);
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
    const savedLanguage = localStorage.getItem('language') || 'fr';
    const filesToLoad = languageFiles[savedLanguage] || languageFiles['fr'];
    loadItems(filesToLoad);

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredItems = window.allItems.filter(item => item.name.toLowerCase().includes(searchTerm));
        displayItems(filteredItems);
    });
});

function changeLanguage(language) {
    localStorage.setItem('language', language);
    const filesToLoad = languageFiles[language] || languageFiles['fr'];
    clearItems();
    loadItems(filesToLoad);
}

function clearItems() {
    const itemGrid = document.querySelector('.item-grid');
    if (itemGrid) {
        itemGrid.innerHTML = '';
    } else {
        console.warn('Item grid container not found in the DOM.');
    }
}
