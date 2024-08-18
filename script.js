// Fonction pour charger et afficher les cartes d'objets
function loadItems() {
    fetch('items.json')
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
                        <span class="item-price">${item.price} <img src="coin_icon.png" alt="Gold" class="coin-icon"></span>
                    </div>
                `;

                fragment.appendChild(itemCard);
            });

            itemGrid.appendChild(fragment);
        })
        .catch(error => {
            console.error('Error loading items:', error.message);
        });
}

// Appel de la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', loadItems);
