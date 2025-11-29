/**
 * Interface/Type para o modelo de Item de Compra.
 * Embora não seja estritamente necessário em JS puro,
 * ajuda a clareza e testabilidade, seguindo as diretrizes de "Contratos claros".
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
 * Responsabilidade Única (SRP): Gerenciar os dados da lista e a persistência.
 */
class StateModel {
	/**
	 * @type {ShoppingItem[]}
	 */
	#items = [];
	static #STORAGE_KEY = 'shoppingListItems';

	constructor() {
		this.loadItems();
	}

	/**
	 * Carrega os itens do localStorage.
	 */
	loadItems() {
		try {
			const storedItems = localStorage.getItem(StateModel.#STORAGE_KEY);
			if (storedItems) {
				// Mapeia para garantir que sejam instâncias de ShoppingItem (re-hidratação)
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
			// Fallback para lista inicial em caso de erro de parsing
			this.#items = [
				new ShoppingItem('Pão de forma'),
				new ShoppingItem('Café preto'),
				new ShoppingItem('Suco de laranja'),
				new ShoppingItem('Bolacha'),
			];
		}
	}

	/**
	 * Persiste o estado atual da lista no localStorage.
	 */
	saveItems() {
		try {
			localStorage.setItem(StateModel.#STORAGE_KEY, JSON.stringify(this.#items));
		} catch (error) {
			console.error('Erro ao salvar dados no localStorage:', error);
		}
	}

	/**
	 * Retorna uma cópia do array de itens para evitar modificação externa.
	 * @returns {ShoppingItem[]}
	 */
	getItems() {
		return [...this.#items];
	}

	/**
	 * Adiciona um novo item à lista.
	 * @param {string} name
	 * @returns {ShoppingItem | null} O novo item, ou null se a adição falhar.
	 */
	addItem(name) {
		const normalizedName = name.trim();
		if (!normalizedName) {
			// Tratamento de erro robusto: impede adição de itens vazios
			return null;
		}

		const newItem = new ShoppingItem(normalizedName);
		this.#items.push(newItem);
		this.saveItems();
		return newItem;
	}

	/**
	 * Remove um item da lista pelo ID.
	 * @param {string} id
	 * @returns {boolean} True se o item foi removido, false caso contrário.
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
	 * Alterna o status de conclusão de um item.
	 * @param {string} id
	 * @returns {boolean} True se o status foi alterado, false caso contrário.
	 */
	toggleItemCompleted(id) {
		const item = this.#items.find((item) => item.id === id);
		if (item) {
			item.isCompleted = !item.isCompleted;
			this.saveItems();
			return true;
		}
		return false;
	}
}

/**
 * Módulo 2: AlertService (Serviço para Feedback ao Usuário)
 * Responsabilidade Única (SRP): Gerenciar a exibição temporária de alertas (toasts).
 * DRY: Centraliza a lógica de criação, exibição e remoção de alertas.
 */
class AlertService {
	/** @type {HTMLElement} */
	#container;
	#timeoutId;
	static #TIMEOUT = 3000; // 3 segundos

	/**
	 * @param {string} containerId ID do elemento que hospeda os alertas.
	 */
	constructor(containerId) {
		this.#container = document.getElementById(containerId);
		if (!this.#container) {
			console.error(`Contêiner de alerta com ID "${containerId}" não encontrado.`);
		}
	}

	/**
	 * Cria e exibe o alerta.
	 * @param {string} message A mensagem a ser exibida.
	 * @param {'success' | 'error'} type Tipo de alerta para estilização.
	 */
	showAlert(message, type) {
		if (!this.#container) return;

		// Limpa alertas existentes e qualquer timeout pendente
		this.clearAlerts();

		const alertElement = this.createAlertElement(message, type);
		this.#container.appendChild(alertElement);

		// Força o reflow para garantir a transição de opacity: 0 para 1
		requestAnimationFrame(() => alertElement.classList.add('show'));

		// Configura o timer para remover automaticamente
		this.#timeoutId = setTimeout(() => this.removeAlert(alertElement), AlertService.#TIMEOUT);
	}

	/**
	 * Cria o elemento HTML do alerta.
	 * @param {string} message
	 * @param {'success' | 'error'} type
	 * @returns {HTMLElement}
	 */
	createAlertElement(message, type) {
		const icon = type === 'success' ? '✔' : '⚠'; // Símbolo de checado ou aviso

		const alertDiv = document.createElement('div');
		alertDiv.className = `alert ${type}`;
		alertDiv.innerHTML = `
            <span class="alert-icon">${icon}</span>
            <span class="alert-message">${message}</span>
            <button class="alert-close" aria-label="Fechar notificação">X</button>
        `;

		// Adiciona listener para fechar manualmente
		alertDiv
			.querySelector('.alert-close')
			.addEventListener('click', () => this.removeAlert(alertDiv));

		return alertDiv;
	}

	/**
	 * Remove o elemento de alerta do DOM.
	 * @param {HTMLElement} alertElement
	 */
	removeAlert(alertElement) {
		// Inicia a transição de saída
		alertElement.classList.remove('show');

		// Remove do DOM após a transição (300ms)
		setTimeout(() => {
			if (alertElement.parentElement) {
				alertElement.remove();
			}
			// Limpa o timeout, pois o alerta foi removido manualmente ou automaticamente
			if (this.#timeoutId) {
				clearTimeout(this.#timeoutId);
				this.#timeoutId = null;
			}
		}, 300);
	}

	/**
	 * Limpa todos os alertas atualmente visíveis e pendentes de remoção.
	 */
	clearAlerts() {
		if (this.#timeoutId) {
			clearTimeout(this.#timeoutId);
			this.#timeoutId = null;
		}
		// Remove todos os filhos do container de alerta imediatamente
		while (this.#container && this.#container.firstChild) {
			this.#container.removeChild(this.#container.firstChild);
		}
	}
}

/**
 * Módulo 3: UIController (Controle da Interface e Renderização)
 * Responsabilidade Única (SRP): Manipulação do DOM e renderização dos itens.
 */
class UIController {
	/** @type {HTMLElement} */
	#listElement;

	/**
	 * @param {string} listId ID do elemento <ul>.
	 */
	constructor(listId) {
		this.#listElement = document.getElementById(listId);
		if (!this.#listElement) {
			console.error(`Elemento de lista com ID "${listId}" não encontrado.`);
		}
	}

	/**
	 * Cria o elemento <li> para um item.
	 * @param {ShoppingItem} item O item a ser renderizado.
	 * @returns {HTMLElement} O elemento <li>.
	 */
	createItemElement(item) {
		const listItem = document.createElement('li');
		listItem.className = `list-item ${item.isCompleted ? 'completed' : ''}`;
		listItem.dataset.id = item.id;

		// Usando o ícone de lixeira (Unicode) para maior compatibilidade e performance (sem requisição de imagem)
		const trashIcon = '🗑';

		listItem.innerHTML = `
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
        `;
		return listItem;
	}

	/**
	 * Renderiza a lista completa, substituindo o conteúdo atual (O(n)).
	 * @param {ShoppingItem[]} items
	 * @param {function(string): void} onToggle Função de callback para alternar status.
	 * @param {function(string): void} onRemove Função de callback para remover item.
	 */
	renderList(items, onToggle, onRemove) {
		if (!this.#listElement) return;

		// Usar DocumentFragment para melhor performance (evita manipulação de DOM item por item)
		const fragment = document.createDocumentFragment();

		items.forEach((item) => {
			const element = this.createItemElement(item);

			// Adiciona listeners aos botões e checkboxes
			element
				.querySelector('[data-action="toggle"]')
				.addEventListener('change', () => onToggle(item.id));
			element
				.querySelector('[data-action="remove"]')
				.addEventListener('click', () => onRemove(item.id));

			fragment.appendChild(element);
		});

		// Limpa a lista existente e insere o novo fragmento
		this.#listElement.innerHTML = '';
		this.#listElement.appendChild(fragment);
	}

	/**
	 * Adiciona um único novo item ao DOM (melhor performance para adição).
	 * @param {ShoppingItem} item
	 * @param {function(string): void} onToggle
	 * @param {function(string): void} onRemove
	 */
	addItemToDOM(item, onToggle, onRemove) {
		if (!this.#listElement) return;

		const element = this.createItemElement(item);
		element
			.querySelector('[data-action="toggle"]')
			.addEventListener('change', () => onToggle(item.id));
		element
			.querySelector('[data-action="remove"]')
			.addEventListener('click', () => onRemove(item.id));

		this.#listElement.appendChild(element);
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
	 * Alterna a classe 'completed' no DOM.
	 * @param {string} id
	 */
	toggleItemClass(id) {
		const itemElement = this.#listElement.querySelector(`[data-id="${id}"]`);
		if (itemElement) {
			itemElement.classList.toggle('completed');
		}
	}
}

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

	/**
	 * Inicializa o aplicativo: carrega o estado e configura os eventos.
	 */
	init() {
		// 1. Renderiza a lista inicial
		this.render();

		// 2. Configura o formulário de adição
		this.#form.addEventListener('submit', this.handleAddItem.bind(this));

		// 3. O botão de "Voltar" não tem lógica de navegação real neste escopo,
		// mas é adicionado por requisito.
		document.querySelector('.back-button').addEventListener('click', () => {
			console.log('Botão "Voltar" clicado. (Nenhuma navegação implementada neste escopo)');
		});

		console.log('Aplicação inicializada com sucesso.');
	}

	/**
	 * Redesenha a lista completa.
	 */
	render() {
		// Passa os callbacks (métodos de App) para o UIController
		this.#ui.renderList(
			this.#model.getItems(),
			this.handleToggleCompleted.bind(this),
			this.handleRemoveItem.bind(this)
		);
	}

	/**
	 * Manipula a adição de um novo item.
	 * @param {Event} event
	 */
	handleAddItem(event) {
		event.preventDefault(); // Impede o recarregamento da página

		const itemName = this.#input.value;
		const newItem = this.#model.addItem(itemName);

		if (newItem) {
			// Lógica de Sucesso
			this.#ui.addItemToDOM(
				newItem,
				this.handleToggleCompleted.bind(this),
				this.handleRemoveItem.bind(this)
			);
			this.#input.value = ''; // Limpa o campo de input
			this.#input.focus(); // Foco de volta no input para melhor UX
			console.log(`Item adicionado: ${newItem.name}`);
		} else {
			// Lógica de Erro (campo vazio)
			this.#alert.showAlert('Por favor, digite um nome para o item.', 'error');
			console.warn('Tentativa de adicionar item vazio.');
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
			this.#alert.showAlert(`"${item.name}" foi removido da lista.`, 'success');
			console.log(`Item removido: ${item.name}`);
		} else {
			this.#alert.showAlert('Erro ao remover o item. Tente novamente.', 'error');
			console.error(`Falha ao remover item com ID: ${itemId}`);
		}
	}

	handleToggleCompleted(itemId) {
		if (this.#model.toggleItemCompleted(itemId)) {
			this.#ui.toggleItemClass(itemId);
			console.log(`Status de conclusão alternado para o item ID: ${itemId}`);
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const app = new App();
	app.init();
});
