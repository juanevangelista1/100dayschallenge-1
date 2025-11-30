/**
 * Interface/Type para o modelo de Item de Compra.
 */
class ShoppingItem {
	/**
	 * @param {string} name
	 * @param {string} id
	 * @param {boolean} isCompleted
	 */
	constructor(name, id = Date.now().toString(), isCompleted = false) {
		this.id = id;
		this.name = name.trim();
		this.isCompleted = isCompleted;
	}
}

/**
 * Módulo 1: StateModel (Gerenciamento de Estado e Lógica de Negócio Pura)
 * SRP: Gerencia os dados da lista e a persistência (localStorage).
 */
class StateModel {
	/** @type {ShoppingItem[]} */
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
				// Itens pré-cadastrados (Requisito)
				this.#items = [
					new ShoppingItem('Pão de forma'),
					new ShoppingItem('Café preto'),
					new ShoppingItem('Suco de laranja'),
					new ShoppingItem('Bolacha'),
				];
			}
		} catch (error) {
			console.error('Erro ao carregar dados do localStorage:', error);
			// Fallback
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

	/**
	 * @param {string} name
	 * @returns {ShoppingItem | null}
	 */
	addItem(name) {
		const normalizedName = name.trim();
		if (!normalizedName) return null;

		const newItem = new ShoppingItem(normalizedName);
		this.#items.push(newItem);
		this.saveItems();
		return newItem;
	}

	/**
	 * @param {string} id
	 * @returns {boolean}
	 */
	removeItem(id) {
		const initialLength = this.#items.length;
		this.#items = this.#items.filter((item) => item.id !== id);

		if (this.#items.length < initialLength) {
			this.saveItems();
			return true;
		}
		return false;
	}

	/**
	 * @param {string} id
	 * @returns {boolean} O novo status de conclusão.
	 */
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

/**
 * Módulo 2: AlertService (Serviço para Feedback ao Usuário - Toast)
 * SRP: Gerencia a exibição e remoção de alertas de forma padronizada (DRY).
 */
class AlertService {
	/** @type {HTMLElement} */
	#container;
	#timeoutId;
	static #TIMEOUT = 3000;

	/**
	 * @param {string} containerId
	 */
	constructor(containerId) {
		this.#container = document.getElementById(containerId);
	}

	/**
	 * @param {string} message
	 * @param {'success' | 'error'} type
	 */
	showAlert(message, type) {
		if (!this.#container) return;

		this.clearAlerts();

		const alertElement = this.createAlertElement(message, type);
		this.#container.appendChild(alertElement);

		requestAnimationFrame(() => alertElement.classList.add('show'));

		this.#timeoutId = setTimeout(() => this.removeAlert(alertElement), AlertService.#TIMEOUT);
	}

	/**
	 * Cria o elemento HTML do alerta.
	 */
	createAlertElement(message, type) {
		// Ícone de alerta (usado na imagem) e ícone de aviso
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

/**
 * Módulo 3: UIController (Controle da Interface e Renderização)
 * SRP: Manipulação do DOM e construção do HTML.
 */
class UIController {
	/** @type {HTMLElement} */
	#listElement;

	/**
	 * @param {string} listId
	 */
	constructor(listId) {
		this.#listElement = document.getElementById(listId);
	}

	/**
	 * Cria o HTML para um item, usando data-id e data-action para Delegação.
	 * @param {ShoppingItem} item
	 * @returns {string}
	 */
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

	/**
	 * Renderiza a lista completa (O(n)).
	 * @param {ShoppingItem[]} items
	 */
	renderList(items) {
		if (!this.#listElement) return;

		// Otimização de performance: Constrói string e injeta 1x
		const listHtml = items.map((item) => UIController.createItemHtml(item)).join('');
		this.#listElement.innerHTML = listHtml;
	}

	/**
	 * Adiciona um único novo item ao DOM (O(1)).
	 * @param {ShoppingItem} item
	 */
	addItemToDOM(item) {
		if (!this.#listElement) return;
		this.#listElement.insertAdjacentHTML('beforeend', UIController.createItemHtml(item));
	}

	/**
	 * Remove um item do DOM pelo ID.
	 * @param {string} id
	 */
	removeItemFromDOM(id) {
		const itemElement = this.#listElement.querySelector(`[data-id="${id}"]`);
		if (itemElement) {
			itemElement.remove();
		}
	}

	/**
	 * Retorna o elemento da lista para vinculação de eventos (Delegação).
	 * @returns {HTMLElement}
	 */
	getListElement() {
		return this.#listElement;
	}
}

/**
 * Módulo 4: App (Módulo Principal e Coordenação)
 * SRP/DIP: Inicializa, vincula eventos e coordena StateModel e UIController.
 */
class App {
	/** @type {StateModel} */
	#model;
	/** @type {UIController} */
	#ui;
	/** @type {AlertService} */
	#alert;
	/** @type {HTMLElement} */
	#form;
	/** @type {HTMLInputElement} */
	#input;

	constructor() {
		this.#model = new StateModel();
		this.#ui = new UIController('shoppingList');
		this.#alert = new AlertService('alertContainer');
		this.#form = document.getElementById('addItemForm');
		this.#input = document.getElementById('itemInput');
	}

	init() {
		// Renderiza a lista inicial
		this.#ui.renderList(this.#model.getItems());

		// Vincula eventos
		this.#form.addEventListener('submit', this.handleAddItem.bind(this));

		// **DELEGAÇÃO DE EVENTOS**: Único listener para todos os cliques na lista
		this.#ui.getListElement().addEventListener('click', this.handleListClick.bind(this));

		document.querySelector('.back-button').addEventListener('click', () => {
			console.log('Botão "Voltar" clicado.');
		});
	}

	/**
	 * Manipulador unificado de cliques na lista.
	 * @param {Event} event
	 */
	handleListClick(event) {
		const target = event.target;

		const listItem = target.closest('.list-item');
		if (!listItem) return;

		const itemId = listItem.dataset.id;
		const action = target.dataset.action;

		if (action === 'remove') {
			this.handleRemoveItem(itemId);
		} else if (action === 'toggle') {
			this.handleToggleCompleted(itemId, listItem);
		} else if (target.classList.contains('item-name')) {
			// Permite clicar no nome do item para marcar/desmarcar (melhor UX)
			const checkbox = listItem.querySelector('.item-checkbox');
			if (checkbox) {
				checkbox.checked = !checkbox.checked;
				this.handleToggleCompleted(itemId, listItem);
			}
		}
	}

	/**
	 * Manipula a adição de um novo item.
	 * @param {Event} event
	 */
	handleAddItem(event) {
		event.preventDefault();

		const itemName = this.#input.value;
		const newItem = this.#model.addItem(itemName);

		if (newItem) {
			this.#ui.addItemToDOM(newItem);
			this.#input.value = '';
			this.#input.focus();
		} else {
			// Tratamento de erro robusto (input vazio)
			this.#alert.showAlert('⚠ Por favor, digite um nome para o item.', 'error');
		}
	}

	/**
	 * Manipula a remoção de um item.
	 * @param {string} itemId
	 */
	handleRemoveItem(itemId) {
		const item = this.#model.getItems().find((i) => i.id === itemId);

		if (this.#model.removeItem(itemId)) {
			this.#ui.removeItemFromDOM(itemId);
			// Mensagem de sucesso fiel à imagem
			this.#alert.showAlert(`O item "${item.name}" foi removido da lista.`, 'success');
		} else {
			this.#alert.showAlert('⚠ Erro ao remover o item. Tente novamente.', 'error');
		}
	}

	/**
	 * Manipula a alternância do status de conclusão.
	 * @param {string} itemId
	 * @param {HTMLElement} listItemElement
	 */
	handleToggleCompleted(itemId, listItemElement) {
		const newStatus = this.#model.toggleItemCompleted(itemId);

		// Alterna a classe CSS com base no novo status retornado do modelo
		listItemElement.classList.toggle('completed', newStatus);
	}
}

// Inicia a aplicação
document.addEventListener('DOMContentLoaded', () => {
	const app = new App();
	app.init();
});
