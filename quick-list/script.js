class ShoppingItem {
	constructor(name, id = Date.now().toString(), isCompleted = false) {
		this.id = id;
		this.name = name.trim();
		this.isCompleted = isCompleted;
	}
}

class StateModel {
	#items = [];
	static #STORAGE_KEY = 'shoppingListItems';

	constructor() {
		this.loadItems();
	}

	loadItems() {
		try {
			const storedItems = localStorage.getItem(StateModel.#STORAGE_KEY);
			if (storedItems) {
				this.#items = JSON.parse(storedItems).map(
					(item) => new ShoppingItem(item.name, item.id, item.isCompleted)
				);
			} else {
				this.#items = [
					new ShoppingItem('Pão de forma'),
					new ShoppingItem('Café preto'),
					new ShoppingItem('Suco de laranja'),
					new ShoppingItem('Bolacha'),
				];
			}
		} catch (error) {
			console.error('Erro ao carregar dados do localStorage:', error);
			this.#items = [
				new ShoppingItem('Pão de forma'),
				new ShoppingItem('Café preto'),
				new ShoppingItem('Suco de laranja'),
				new ShoppingItem('Bolacha'),
			];
		}
	}

	saveItems() {
		try {
			localStorage.setItem(StateModel.#STORAGE_KEY, JSON.stringify(this.#items));
		} catch (error) {
			console.error('Erro ao salvar dados no localStorage:', error);
		}
	}

	getItems() {
		return [...this.#items];
	}

	addItem(name) {
		const normalizedName = name.trim();
		if (!normalizedName) return null;

		const newItem = new ShoppingItem(normalizedName);
		this.#items.push(newItem);
		this.saveItems();
		return newItem;
	}

	removeItem(id) {
		const initialLength = this.#items.length;
		this.#items = this.#items.filter((item) => item.id !== id);

		if (this.#items.length < initialLength) {
			this.saveItems();
			return true;
		}
		return false;
	}

	toggleItemCompleted(id) {
		const item = this.#items.find((item) => item.id === id);
		if (item) {
			item.isCompleted = !item.isCompleted;
			this.saveItems();
			return item.isCompleted;
		}
		return false;
	}
}

class AlertService {
	#container;
	#timeoutId;
	static #TIMEOUT = 3000;

	constructor(containerId) {
		this.#container = document.getElementById(containerId);
	}

	showAlert(message, type) {
		if (!this.#container) return;

		this.clearAlerts();

		const alertElement = this.createAlertElement(message, type);
		this.#container.appendChild(alertElement);

		requestAnimationFrame(() => alertElement.classList.add('show'));

		this.#timeoutId = setTimeout(() => this.removeAlert(alertElement), AlertService.#TIMEOUT);
	}

	createAlertElement(message, type) {
		const icon = type === 'success' ? '🚨' : '⚠';

		const alertDiv = document.createElement('div');
		alertDiv.className = `alert ${type}`;
		alertDiv.innerHTML = `
            <span class="alert-icon">${icon}</span>
            <span class="alert-message">${message}</span>
            <button class="alert-close" aria-label="Fechar notificação">X</button>
        `;

		alertDiv
			.querySelector('.alert-close')
			.addEventListener('click', () => this.removeAlert(alertDiv));

		return alertDiv;
	}

	removeAlert(alertElement) {
		alertElement.classList.remove('show');

		setTimeout(() => {
			if (alertElement.parentElement) {
				alertElement.remove();
			}
			if (this.#timeoutId) {
				clearTimeout(this.#timeoutId);
				this.#timeoutId = null;
			}
		}, 300);
	}

	clearAlerts() {
		if (this.#timeoutId) {
			clearTimeout(this.#timeoutId);
			this.#timeoutId = null;
		}
		while (this.#container && this.#container.firstChild) {
			this.#container.removeChild(this.#container.firstChild);
		}
	}
}

class UIController {
	#listElement;

	constructor(listId) {
		this.#listElement = document.getElementById(listId);
	}

	static createItemHtml(item) {
		const trashIcon = '🗑';
		return `
            <li class="list-item ${item.isCompleted ? 'completed' : ''}" data-id="${item.id}">
                <div class="item-content">
                    <input 
                        type="checkbox" 
                        class="item-checkbox" 
                        data-action="toggle" 
                        ${item.isCompleted ? 'checked' : ''} 
                        aria-label="Marcar ${item.name} como concluído"
                    >
                    <span class="item-name">${item.name}</span>
                </div>
                <button 
                    class="remove-button" 
                    data-action="remove" 
                    aria-label="Remover ${item.name}"
                >
                    ${trashIcon}
                </button>
            </li>
        `;
	}

	renderList(items) {
		if (!this.#listElement) return;

		const listHtml = items.map((item) => UIController.createItemHtml(item)).join('');

		this.#listElement.innerHTML = listHtml;
	}

	addItemToDOM(item) {
		if (!this.#listElement) return;

		this.#listElement.insertAdjacentHTML('beforeend', UIController.createItemHtml(item));
	}

	removeItemFromDOM(id) {
		const itemElement = this.#listElement.querySelector(`[data-id="${id}"]`);
		if (itemElement) {
			itemElement.remove();
		}
	}

	toggleItemClass(id) {
		const itemElement = this.#listElement.querySelector(`[data-id="${id}"]`);
		if (itemElement) {
			itemElement.classList.toggle('completed');
		}
	}

	getListElement() {
		return this.#listElement;
	}
}

class App {
	#model;
	#ui;
	#alert;
	#form;
	#input;

	constructor() {
		this.#model = new StateModel();
		this.#ui = new UIController('shoppingList');
		this.#alert = new AlertService('alertContainer');
		this.#form = document.getElementById('addItemForm');
		this.#input = document.getElementById('itemInput');
	}

	init() {
		this.#ui.renderList(this.#model.getItems());

		this.#form.addEventListener('submit', this.handleAddItem.bind(this));

		this.#ui.getListElement().addEventListener('click', this.handleListClick.bind(this));

		document.querySelector('.back-button').addEventListener('click', () => {
			console.log('Botão "Voltar" clicado. (Nenhuma navegação implementada neste escopo)');
		});
	}

	handleListClick(event) {
		const target = event.target;

		const listItem = target.closest('.list-item');
		if (!listItem) return;

		const itemId = listItem.dataset.id;
		const action = target.dataset.action;

		if (action === 'remove') {
			this.handleRemoveItem(itemId, listItem);
		} else if (action === 'toggle') {
			this.handleToggleCompleted(itemId, listItem);
		} else if (target.classList.contains('item-name')) {
			const checkbox = listItem.querySelector('.item-checkbox');
			if (checkbox) {
				checkbox.checked = !checkbox.checked;
				this.handleToggleCompleted(itemId, listItem);
			}
		}
	}

	handleAddItem(event) {
		event.preventDefault();

		const itemName = this.#input.value;
		const newItem = this.#model.addItem(itemName);

		if (newItem) {
			this.#ui.addItemToDOM(newItem);
			this.#input.value = '';
			this.#input.focus();
			console.log(`Item adicionado: ${newItem.name}`);
		} else {
			this.#alert.showAlert('🚨 Por favor, digite um nome para o item.', 'error');
			console.warn('Tentativa de adicionar item vazio.');
		}
	}

	handleRemoveItem(itemId, listItemElement) {
		const item = this.#model.getItems().find((i) => i.id === itemId);

		if (this.#model.removeItem(itemId)) {
			this.#ui.removeItemFromDOM(itemId);
			this.#alert.showAlert(`O item "${item.name}" foi removido da lista.`, 'success');
			console.log(`Item removido: ${item.name}`);
		} else {
			this.#alert.showAlert('⚠ Erro ao remover o item. Tente novamente.', 'error');
			console.error(`Falha ao remover item com ID: ${itemId}`);
		}
	}

	handleToggleCompleted(itemId, listItemElement) {
		const newStatus = this.#model.toggleItemCompleted(itemId);

		listItemElement.classList.toggle('completed', newStatus);
		console.log(`Status de conclusão alternado para o item ID: ${itemId}`);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const app = new App();
	app.init();
});
