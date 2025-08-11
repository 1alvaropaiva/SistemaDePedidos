// ========================================
// CONFIGURAÇÕES GLOBAIS E CONSTANTES
// ========================================

// URL base da API (ajuste conforme sua API)
const API_BASE_URL = 'http://localhost:8080'; // Altere para a URL da sua API

// Endpoints da API
const API_ENDPOINTS = {
    users: '/users',
    products: '/products',
    orders: '/orders',
    categories: '/categories'
};

// Estados globais da aplicação
const appState = {
    currentSection: 'users',
    currentUser: null, // Para edição de usuários
    isLoading: false
};

// ========================================
// UTILITÁRIOS E FUNÇÕES AUXILIARES
// ========================================

/**
 * Função para fazer requisições HTTP genéricas
 * @param {string} url - URL da requisição
 * @param {Object} options - Opções da requisição (method, body, headers)
 * @returns {Promise} - Promise com a resposta
 */
async function apiRequest(url, options = {}) {
    try {
        // Configurações padrão da requisição
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        // Mescla as opções padrão com as fornecidas
        const requestOptions = { ...defaultOptions, ...options };

        // Se há body, converte para JSON
        if (requestOptions.body && typeof requestOptions.body === 'object') {
            requestOptions.body = JSON.stringify(requestOptions.body);
        }

        console.log(`Fazendo requisição para: ${url}`, requestOptions);

        // Faz a requisição
        const response = await fetch(url, requestOptions);

        // Verifica se a resposta é ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Retorna os dados JSON
        return await response.json();

    } catch (error) {
        console.error('Erro na requisição API:', error);
        throw error;
    }
}

/**
 * Função para mostrar/esconder loading
 * @param {string} sectionId - ID da seção
 * @param {boolean} show - Se deve mostrar ou esconder
 */
function toggleLoading(sectionId, show) {
    const loadingElement = document.getElementById(`${sectionId}-loading`);
    const dataElement = document.getElementById(`${sectionId}-table`) || 
                       document.getElementById(`${sectionId}-grid`);
    
    if (loadingElement && dataElement) {
        if (show) {
            loadingElement.style.display = 'flex';
            dataElement.style.display = 'none';
        } else {
            loadingElement.style.display = 'none';
            dataElement.style.display = 'block';
        }
    }
}

/**
 * Função para mostrar mensagens de erro
 * @param {string} sectionId - ID da seção
 * @param {string} message - Mensagem de erro
 */
function showError(sectionId, message) {
    const errorElement = document.getElementById(`${sectionId}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * Função para esconder mensagens de erro
 * @param {string} sectionId - ID da seção
 */
function hideError(sectionId) {
    const errorElement = document.getElementById(`${sectionId}-error`);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

/**
 * Função para mostrar mensagens de sucesso
 * @param {string} message - Mensagem de sucesso
 */
function showSuccess(message) {
    // Cria uma notificação temporária
    const notification = document.createElement('div');
    notification.className = 'success-message';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '3000';
    notification.style.animation = 'slideIn 0.3s ease';

    document.body.appendChild(notification);

    // Remove após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ========================================
// SISTEMA DE NAVEGAÇÃO
// ========================================

/**
 * Função para alternar entre seções
 * @param {string} sectionName - Nome da seção para ativar
 */
function switchSection(sectionName) {
    // Remove classe active de todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove classe active de todos os botões de navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Adiciona classe active na seção selecionada
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Adiciona classe active no botão selecionado
    const targetButton = document.querySelector(`[data-section="${sectionName}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }

    // Atualiza o estado global
    appState.currentSection = sectionName;

    // Carrega os dados da seção
    loadSectionData(sectionName);
}

/**
 * Função para carregar dados específicos de cada seção
 * @param {string} sectionName - Nome da seção
 */
function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'users':
            loadUsers();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'categories':
            loadCategories();
            break;
        default:
            console.warn('Seção não reconhecida:', sectionName);
    }
}

// ========================================
// GERENCIAMENTO DE USUÁRIOS (CRUD)
// ========================================

/**
 * Função para carregar lista de usuários
 */
async function loadUsers() {
    try {
        // Mostra loading e esconde erros
        toggleLoading('users', true);
        hideError('users');

        // Faz a requisição para a API
        const users = await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.users}`);

        // Renderiza a tabela de usuários
        renderUsersTable(users);

    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        showError('users', 'Erro ao carregar usuários. Tente novamente.');
    } finally {
        toggleLoading('users', false);
    }
}

/**
 * Função para renderizar tabela de usuários
 * @param {Array} users - Array de usuários
 */
function renderUsersTable(users) {
    const tableContainer = document.getElementById('users-table');
    
    if (!users || users.length === 0) {
        tableContainer.innerHTML = '<p class="text-center text-muted">Nenhum usuário encontrado.</p>';
        return;
    }

    // Cria a estrutura da tabela
    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.id || 'N/A'}</td>
                        <td>${user.name || 'N/A'}</td>
                        <td>${user.email || 'N/A'}</td>
                        <td>${user.phone || 'N/A'}</td>
                        <td class="table-actions">
                            <button class="btn btn-sm btn-primary" onclick="viewUser(${user.id})">
                                Ver
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="editUser(${user.id})">
                                Editar
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                                Excluir
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
}

/**
 * Função para visualizar detalhes de um usuário
 * @param {number} userId - ID do usuário
 */
async function viewUser(userId) {
    try {
        const user = await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.users}/${userId}`);
        
        // Preenche o modal de detalhes
        document.getElementById('details-title').textContent = 'Detalhes do Usuário';
        document.getElementById('details-content').innerHTML = `
            <div class="user-details">
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Nome:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Telefone:</strong> ${user.phone || 'Não informado'}</p>
            </div>
        `;
        
        // Abre o modal
        openModal('details-modal');
        
    } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        showError('users', 'Erro ao carregar detalhes do usuário.');
    }
}

/**
 * Função para editar um usuário
 * @param {number} userId - ID do usuário
 */
async function editUser(userId) {
    try {
        // Carrega os dados do usuário
        const user = await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.users}/${userId}`);
        
        // Armazena o usuário atual no estado
        appState.currentUser = user;
        
        // Preenche o formulário
        document.getElementById('modal-title').textContent = 'Editar Usuário';
        document.getElementById('user-name').value = user.name || '';
        document.getElementById('user-email').value = user.email || '';
        document.getElementById('user-phone').value = user.phone || '';
        
        // Abre o modal
        openModal('user-modal');
        
    } catch (error) {
        console.error('Erro ao carregar usuário para edição:', error);
        showError('users', 'Erro ao carregar dados do usuário.');
    }
}

/**
 * Função para excluir um usuário
 * @param {number} userId - ID do usuário
 */
async function deleteUser(userId) {
    // Configura o modal de confirmação
    document.getElementById('confirm-message').textContent = 
        'Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.';

    // Abre o modal de confirmação
    openModal('confirm-modal');

    const confirmButton = document.getElementById('confirm-delete');

    // Remove qualquer listener anterior
    const newConfirmButton = confirmButton.cloneNode(true);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);

    newConfirmButton.addEventListener('click', async () => {
        try {
            newConfirmButton.disabled = true;

            await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.users}/${userId}`, {
                method: 'DELETE'
            });

            closeModal('confirm-modal');
            showSuccess('Usuário excluído com sucesso!');
            loadUsers();
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            showError('users', 'Erro ao excluir usuário. Tente novamente.');
        } finally {
            newConfirmButton.disabled = false;
        }
    });
}


/**
 * Função para criar um novo usuário
 */
function createUser() {
    // Limpa o estado atual
    appState.currentUser = null;
    
    // Limpa o formulário
    document.getElementById('modal-title').textContent = 'Novo Usuário';
    document.getElementById('user-form').reset();
    
    // Abre o modal
    openModal('user-modal');
}

// ========================================
// CARREGAMENTO DE PRODUTOS
// ========================================

/**
 * Função para carregar lista de produtos
 */
async function loadProducts() {
    try {
        toggleLoading('products', true);
        hideError('products');

        const products = await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.products}`);
        renderProductsGrid(products);

    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showError('products', 'Erro ao carregar produtos. Tente novamente.');
    } finally {
        toggleLoading('products', false);
    }
}

/**
 * Função para renderizar grid de produtos
 * @param {Array} products - Array de produtos
 */
function renderProductsGrid(products) {
    const gridContainer = document.getElementById('products-grid');
    
    if (!products || products.length === 0) {
        gridContainer.innerHTML = '<p class="text-center text-muted">Nenhum produto encontrado.</p>';
        return;
    }

    const gridHTML = products.map(product => `
        <div class="grid-card">
            <div class="grid-card-header">
                <h4 class="grid-card-title">${product.name || 'Produto sem nome'}</h4>
            </div>
            <div class="grid-card-body">
                <p class="grid-card-text"><strong>ID:</strong> ${product.id || 'N/A'}</p>
                <p class="grid-card-text"><strong>Preço:</strong> R$ ${product.price || '0.00'}</p>
                <p class="grid-card-text"><strong>Descrição:</strong> ${product.description || 'Sem descrição'}</p>
                <p class="grid-card-text"><strong>Categoria:</strong> ${product.category || 'N/A'}</p>
            </div>
            <div class="grid-card-actions">
                <button class="btn btn-sm btn-primary" onclick="viewProduct(${product.id})">
                    Ver Detalhes
                </button>
            </div>
        </div>
    `).join('');

    gridContainer.innerHTML = gridHTML;
}

/**
 * Função para visualizar detalhes de um produto
 * @param {number} productId - ID do produto
 */
async function viewProduct(productId) {
    try {
        const product = await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.products}/${productId}`);
        
        document.getElementById('details-title').textContent = 'Detalhes do Produto';
        document.getElementById('details-content').innerHTML = `
            <div class="product-details">
                <p><strong>ID:</strong> ${product.id}</p>
                <p><strong>Nome:</strong> ${product.name}</p>
                <p><strong>Preço:</strong> R$ ${product.price || '0.00'}</p>
                <p><strong>Descrição:</strong> ${product.description || 'Sem descrição'}</p>
                <p><strong>Categoria:</strong> ${product.category || 'N/A'}</p>
            </div>
        `;
        
        openModal('details-modal');
        
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        showError('products', 'Erro ao carregar detalhes do produto.');
    }
}

// ========================================
// CARREGAMENTO DE PEDIDOS
// ========================================

/**
 * Função para carregar lista de pedidos
 */
async function loadOrders() {
    try {
        toggleLoading('orders', true);
        hideError('orders');

        const orders = await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.orders}`);
        renderOrdersTable(orders);

    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        showError('orders', 'Erro ao carregar pedidos. Tente novamente.');
    } finally {
        toggleLoading('orders', false);
    }
}

/**
 * Função para renderizar tabela de pedidos
 * @param {Array} orders - Array de pedidos
 */
function renderOrdersTable(orders) {
    const tableContainer = document.getElementById('orders-table');
    
    if (!orders || orders.length === 0) {
        tableContainer.innerHTML = '<p class="text-center text-muted">Nenhum pedido encontrado.</p>';
        return;
    }

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td>${order.id || 'N/A'}</td>
                        <td>${order.customer || 'N/A'}</td>
                        <td>${order.date || 'N/A'}</td>
                        <td>${order.status || 'N/A'}</td>
                        <td>R$ ${order.total || '0.00'}</td>
                        <td class="table-actions">
                            <button class="btn btn-sm btn-primary" onclick="viewOrder(${order.id})">
                                Ver Detalhes
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
}

/**
 * Função para visualizar detalhes de um pedido
 * @param {number} orderId - ID do pedido
 */
async function viewOrder(orderId) {
    try {
        const order = await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.orders}/${orderId}`);
        
        document.getElementById('details-title').textContent = 'Detalhes do Pedido';
        document.getElementById('details-content').innerHTML = `
            <div class="order-details">
                <p><strong>ID:</strong> ${order.id}</p>
                <p><strong>Cliente:</strong> ${order.customer || 'N/A'}</p>
                <p><strong>Data:</strong> ${order.date || 'N/A'}</p>
                <p><strong>Status:</strong> ${order.status || 'N/A'}</p>
                <p><strong>Total:</strong> R$ ${order.total || '0.00'}</p>
                <p><strong>Itens:</strong> ${order.items || 'N/A'}</p>
            </div>
        `;
        
        openModal('details-modal');
        
    } catch (error) {
        console.error('Erro ao carregar pedido:', error);
        showError('orders', 'Erro ao carregar detalhes do pedido.');
    }
}

// ========================================
// CARREGAMENTO DE CATEGORIAS
// ========================================

/**
 * Função para carregar lista de categorias
 */
async function loadCategories() {
    try {
        toggleLoading('categories', true);
        hideError('categories');

        const categories = await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.categories}`);
        renderCategoriesGrid(categories);

    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        showError('categories', 'Erro ao carregar categorias. Tente novamente.');
    } finally {
        toggleLoading('categories', false);
    }
}

/**
 * Função para renderizar grid de categorias
 * @param {Array} categories - Array de categorias
 */
function renderCategoriesGrid(categories) {
    const gridContainer = document.getElementById('categories-grid');
    
    if (!categories || categories.length === 0) {
        gridContainer.innerHTML = '<p class="text-center text-muted">Nenhuma categoria encontrada.</p>';
        return;
    }

    const gridHTML = categories.map(category => `
        <div class="grid-card">
            <div class="grid-card-header">
                <h4 class="grid-card-title">${category.name || 'Categoria sem nome'}</h4>
            </div>
            <div class="grid-card-body">
                <p class="grid-card-text"><strong>ID:</strong> ${category.id || 'N/A'}</p>
                <p class="grid-card-text"><strong>Descrição:</strong> ${category.description || 'Sem descrição'}</p>
            </div>
            <div class="grid-card-actions">
                <button class="btn btn-sm btn-primary" onclick="viewCategory(${category.id})">
                    Ver Detalhes
                </button>
            </div>
        </div>
    `).join('');

    gridContainer.innerHTML = gridHTML;
}

/**
 * Função para visualizar detalhes de uma categoria
 * @param {number} categoryId - ID da categoria
 */
async function viewCategory(categoryId) {
    try {
        const category = await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.categories}/${categoryId}`);
        
        document.getElementById('details-title').textContent = 'Detalhes da Categoria';
        document.getElementById('details-content').innerHTML = `
            <div class="category-details">
                <p><strong>ID:</strong> ${category.id}</p>
                <p><strong>Nome:</strong> ${category.name}</p>
                <p><strong>Descrição:</strong> ${category.description || 'Sem descrição'}</p>
            </div>
        `;
        
        openModal('details-modal');
        
    } catch (error) {
        console.error('Erro ao carregar categoria:', error);
        showError('categories', 'Erro ao carregar detalhes da categoria.');
    }
}

// ========================================
// SISTEMA DE MODAIS
// ========================================

/**
 * Função para abrir um modal
 * @param {string} modalId - ID do modal
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modal-overlay');
    
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
        
        // Foca no primeiro input do modal (se existir)
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }
}

/**
 * Função para fechar um modal
 * @param {string} modalId - ID do modal
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modal-overlay');
    
    if (modal) {
        modal.classList.remove('active');
    }
    
    if (overlay) {
        overlay.classList.remove('active');
    }
}

/**
 * Função para fechar todos os modais
 */
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Função para inicializar todos os event listeners
 */
function initializeEventListeners() {
    // Event listeners para navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.target.getAttribute('data-section');
            if (section) {
                switchSection(section);
            }
        });
    });

    // Event listener para botão "Novo Usuário"
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', createUser);
    }

    // Event listeners para fechar modais
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Event listener para overlay (fechar modal ao clicar fora)
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeAllModals);
    }

    // Event listener para formulário de usuário
    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    }

    // Event listeners para botões de cancelar
    document.querySelectorAll('#modal-cancel, #confirm-cancel').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Event listener para tecla ESC (fechar modais)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

/**
 * Função para lidar com o envio do formulário de usuário
 * @param {Event} e - Evento do formulário
 */
async function handleUserSubmit(e) {
    e.preventDefault();
    
    // Coleta os dados do formulário
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };

    try {
        if (appState.currentUser) {
            // Atualizar usuário existente
            await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.users}/${appState.currentUser.id}`, {
                method: 'PUT',
                body: userData
            });
            showSuccess('Usuário atualizado com sucesso!');
        } else {
            // Criar novo usuário
            await apiRequest(`${API_BASE_URL}${API_ENDPOINTS.users}`, {
                method: 'POST',
                body: userData
            });
            showSuccess('Usuário criado com sucesso!');
        }

        // Fecha o modal
        closeModal('user-modal');
        
        // Recarrega a lista de usuários
        loadUsers();
        
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        showError('users', 'Erro ao salvar usuário. Tente novamente.');
    }
}

// ========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ========================================

/**
 * Função principal de inicialização
 */
function initializeApp() {
    console.log('Inicializando aplicação...');
    
    // Inicializa os event listeners
    initializeEventListeners();
    
    // Carrega a seção inicial (usuários)
    loadSectionData('users');
    
    console.log('Aplicação inicializada com sucesso!');
}

// Aguarda o DOM estar pronto e inicializa a aplicação
document.addEventListener('DOMContentLoaded', initializeApp);

// ========================================
// ANIMAÇÕES CSS ADICIONAIS
// ========================================

// Adiciona animação de slide-in para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
