
const DEBUG_MODE = false; // Mude para true para ativar o modo debug
const IMAGE_DEBUG = false; // Debug específico para imagens

function debugLog(message, data = null) {
    if (DEBUG_MODE) {
        if (data) {
            console.log(`[DEBUG] ${message}:`, data);
        } else {
            console.log(`[DEBUG] ${message}`);
        }
    }
}

function imageDebugLog(message, data = null) {
    if (IMAGE_DEBUG) {
        if (data) {
            console.log(`[IMAGE DEBUG] ${message}:`, data);
        } else {
            console.log(`[IMAGE DEBUG] ${message}`);
        }
    }
}

// ==================== VALIDAÇÃO E CORREÇÃO DE URLs ====================
function validateAndFixImageUrl(url) {
    if (!url) {
        imageDebugLog('URL vazia ou undefined');
        return null;
    }
    
    // Remove espaços extras e caracteres especiais
    url = url.trim().replace(/[\n\r\t]/g, '');
    
    imageDebugLog('URL original', url);
    
    // Verifica se é uma URL válida
    if (!url.match(/^https?:\/\/.+/)) {
        imageDebugLog('URL sem protocolo detectada');
        
        // Se não tem protocolo, adiciona https
        if (url.startsWith('//')) {
            url = 'https:' + url;
        } else if (!url.startsWith('http')) {
            url = 'https://' + url;
        }
        
        imageDebugLog('URL corrigida com protocolo', url);
    }
    
    return url;
}

// ==================== SISTEMA DE SELEÇÃO MÚLTIPLA ====================
let selectedProducts = new Set();

// ==================== CONFIGURAÇÃO DOS EVENT LISTENERS ====================
function setupProductEventListeners() {
    console.log('=== CONFIGURANDO EVENT LISTENERS ===');
    
    // REMOVE TODOS OS EVENT LISTENERS EXISTENTES PARA EVITAR DUPLICATAS
    document.removeEventListener('click', handleProductClick);
    document.removeEventListener('change', handleCheckboxChange);
    
    // ADICIONA EVENT DELEGATION PARA CLIQUES NOS CARDS
    document.addEventListener('click', handleProductClick);
    
    // ADICIONA EVENT DELEGATION PARA CHECKBOXES
    document.addEventListener('change', handleCheckboxChange);
    
    console.log('✓ Event listeners configurados com sucesso');
}

// HANDLER PARA CLIQUES NOS CARDS
function handleProductClick(e) {
    // Verifica se o clique foi em um card de produto (mas não no checkbox)
    const card = e.target.closest('.product-card');
    if (card && !e.target.closest('.product-checkbox') && !e.target.closest('.checkbox-label')) {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = card.getAttribute('data-product-id');
        console.log(`🖱️ CLIQUE NO CARD ${productId}`);
        toggleProductSelection(productId);
    }
}

// HANDLER PARA MUDANÇAS NOS CHECKBOXES
function handleCheckboxChange(e) {
    if (e.target.matches('.product-checkbox')) {
        e.stopPropagation();
        
        const productId = e.target.getAttribute('data-product-id');
        console.log(`☑️ CHECKBOX ALTERADO ${productId} - Checked: ${e.target.checked}`);
        
        // Sincroniza com o estado do Set baseado no checkbox
        if (e.target.checked) {
            selectedProducts.add(productId);
        } else {
            selectedProducts.delete(productId);
        }
        
        // Atualiza visualmente sem chamadas recursivas
        updateVisualState(productId);
        updateSelectionCounter();
        updateBulkActionButtons();
    }
}

// FUNÇÃO PRINCIPAL DE TOGGLE (SEM EVENT LISTENERS INTERNOS)
function toggleProductSelection(productId) {
    console.log(`=== TOGGLE PRODUTO ${productId} ===`);
    console.log(`Estado atual: ${selectedProducts.has(productId) ? 'selecionado' : 'não selecionado'}`);
    
    // Alterna o estado de seleção
    if (selectedProducts.has(productId)) {
        selectedProducts.delete(productId);
        console.log(`✓ Produto ${productId} REMOVIDO da seleção`);
    } else {
        selectedProducts.add(productId);
        console.log(`✓ Produto ${productId} ADICIONADO à seleção`);
    }
    
    console.log(`Total selecionados: ${selectedProducts.size}`);
    console.log('Produtos selecionados:', Array.from(selectedProducts));
    
    // Atualiza apenas o visual deste produto específico
    updateVisualState(productId);
    updateSelectionCounter();
    updateBulkActionButtons();
}

// ATUALIZA APENAS O ESTADO VISUAL DE UM PRODUTO ESPECÍFICO
function updateVisualState(productId) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    const checkbox = document.querySelector(`[data-product-id="${productId}"].product-checkbox`);
    
    if (card && checkbox) {
        const isSelected = selectedProducts.has(productId);
        
        // Remove event listeners temporariamente para evitar loops
        const checkboxClone = checkbox.cloneNode(true);
        checkbox.parentNode.replaceChild(checkboxClone, checkbox);
        
        if (isSelected) {
            card.classList.add('selected');
            checkboxClone.checked = true;
            console.log(`  ✓ Card ${productId} marcado visualmente`);
        } else {
            card.classList.remove('selected');
            checkboxClone.checked = false;
            console.log(`  ✗ Card ${productId} desmarcado visualmente`);
        }
        
        // Garante que os elementos permaneçam clicáveis
        card.style.pointerEvents = 'auto';
        checkboxClone.style.pointerEvents = 'auto';
    }
}

// ATUALIZA TODOS OS PRODUTOS (USADO EM OPERAÇÕES EM MASSA)
function updateAllVisualStates() {
    console.log('=== ATUALIZANDO TODOS OS ESTADOS VISUAIS ===');
    
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        const checkbox = card.querySelector('.product-checkbox');
        
        if (checkbox) {
            const isSelected = selectedProducts.has(productId);
            
            // Clona o checkbox para remover event listeners antigos
            const checkboxClone = checkbox.cloneNode(true);
            checkbox.parentNode.replaceChild(checkboxClone, checkbox);
            
            if (isSelected) {
                card.classList.add('selected');
                checkboxClone.checked = true;
            } else {
                card.classList.remove('selected');
                checkboxClone.checked = false;
            }
            
            // Garante clicabilidade
            card.style.pointerEvents = 'auto';
            checkboxClone.style.pointerEvents = 'auto';
        }
    });
    
    // RECONFIGURAR EVENT LISTENERS APÓS MANIPULAÇÃO EM MASSA
    setTimeout(() => {
        setupProductEventListeners();
    }, 100);
}

function updateSelectionCounter() {
    const selectionCounter = document.getElementById('selectionCounter');
    if (selectionCounter) {
        selectionCounter.textContent = selectedProducts.size;
        console.log(`Contador atualizado: ${selectedProducts.size}`);
    }
}

function updateBulkActionButtons() {
    const bulkActions = document.getElementById('bulkActions');
    
    if (bulkActions) {
        if (selectedProducts.size > 0) {
            bulkActions.style.display = 'flex';
            bulkActions.classList.add('animate-slide-up');
        } else {
            bulkActions.style.display = 'none';
            bulkActions.classList.remove('animate-slide-up');
        }
    }
}

function selectAllProducts() {
    console.log('=== SELECIONANDO TODOS OS PRODUTOS ===');
    const checkboxes = document.querySelectorAll('.product-checkbox');
    console.log(`Encontrados ${checkboxes.length} checkboxes`);
    
    // LIMPA E ADICIONA TODOS OS PRODUTOS
    selectedProducts.clear();
    checkboxes.forEach(checkbox => {
        const productId = checkbox.getAttribute('data-product-id');
        selectedProducts.add(productId);
        console.log(`Adicionado: ${productId}`);
    });
    
    console.log(`Total selecionados: ${selectedProducts.size}`);
    console.log('Produtos selecionados:', Array.from(selectedProducts));
    
    // ATUALIZA TODOS DE UMA VEZ
    updateAllVisualStates();
    updateSelectionCounter();
    updateBulkActionButtons();
}

function deselectAllProducts() {
    console.log('=== DESELECIONANDO TODOS OS PRODUTOS ===');
    console.log(`Produtos selecionados antes: ${selectedProducts.size}`);
    
    selectedProducts.clear();
    
    console.log(`Produtos selecionados depois: ${selectedProducts.size}`);
    
    // ATUALIZA TODOS DE UMA VEZ
    updateAllVisualStates();
    updateSelectionCounter();
    updateBulkActionButtons();
}

// FUNÇÃO PARA RECONFIGURAR TUDO DO ZERO
function reinitializeProductSelection() {
    console.log('=== REINICIALIZANDO SELEÇÃO DE PRODUTOS ===');
    
    // Limpa seleção atual
    selectedProducts.clear();
    
    // Remove todas as classes selected
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
        card.style.cssText = '';
    });
    
    // Desmarca todos os checkboxes
    document.querySelectorAll('.product-checkbox').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.style.cssText = '';
    });
    
    // Reconfigura event listeners
    setupProductEventListeners();
    
    // Atualiza contadores
    updateSelectionCounter();
    updateBulkActionButtons();
    
    console.log('✓ Reinicialização concluída');
}

function approveSelectedProducts() {
    if (selectedProducts.size === 0) {
        showToast('Selecione pelo menos um produto para aprovar', 'warning');
        return;
    }
    
    const selectedCards = Array.from(selectedProducts).map(id => {
        const card = document.querySelector(`[data-product-id="${id}"]`);
        return {
            id: id,
            titulo: card.querySelector('.product-title').textContent,
            preco: card.querySelector('.product-price').textContent,
            marketplace: card.querySelector('.marketplace-badge').textContent
        };
    });
    
    selectedCards.forEach(product => {
        addApprovedItem(product.id, product.titulo, product.preco, product.marketplace);
    });
    
    selectedCards.forEach(product => {
        const card = document.querySelector(`[data-product-id="${product.id}"]`);
        if (card) {
            card.classList.add('removing');
            setTimeout(() => card.remove(), 300);
        }
    });
    
    selectedProducts.clear();
    updateSelectionCounter();
    updateBulkActionButtons();
    updateApprovedCount();
    
    showToast(`${selectedCards.length} produto(s) aprovado(s) com sucesso!`, 'success');
}

function rejectSelectedProducts() {
    if (selectedProducts.size === 0) {
        showToast('Selecione pelo menos um produto para reprovar', 'warning');
        return;
    }
    
    const selectedCards = Array.from(selectedProducts);
    
    selectedCards.forEach(id => {
        const card = document.querySelector(`[data-product-id="${id}"]`);
        if (card) {
            card.classList.add('removing');
            setTimeout(() => card.remove(), 300);
        }
    });
    
    selectedProducts.clear();
    updateSelectionCounter();
    updateBulkActionButtons();
    
    showToast(`${selectedCards.length} produto(s) reprovado(s)`, 'info');
}

// ==================== INICIALIZAÇÃO ====================
// CONFIGURA OS EVENT LISTENERS QUANDO A PÁGINA CARREGA
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIALIZANDO SELEÇÃO DE PRODUTOS ===');
    setupProductEventListeners();
});

// TAMBÉM PERMITE RECONFIGURAÇÃO MANUAL
window.reinitializeProductSelection = reinitializeProductSelection;
window.setupProductEventListeners = setupProductEventListeners;

// FUNÇÃO DE TESTE PARA DEBUG
window.testEventListeners = function() {
    console.log('=== TESTANDO EVENT LISTENERS ===');
    const cards = document.querySelectorAll('.product-card');
    console.log(`Cards encontrados: ${cards.length}`);
    
    cards.forEach((card, index) => {
        console.log(`Card ${index + 1}:`, {
            productId: card.getAttribute('data-product-id'),
            hasEventListener: card.onclick !== null,
            pointerEvents: getComputedStyle(card).pointerEvents,
            classes: card.className
        });
    });
};
// ==================== SISTEMA DE TOAST ====================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast após 3 segundos
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// ==================== FUNÇÃO PRINCIPAL MELHORADA ====================
async function displaySearchResults(results, term) {
    debugLog('=== INICIANDO EXIBIÇÃO DE RESULTADOS ===');
    
    // Limpa seleção anterior quando novos resultados são exibidos
    selectedProducts.clear();
    
    const section = document.getElementById('searchResultsSection');
    const content = document.getElementById('searchResultsContent');
    const searchTerm = document.getElementById('searchTerm');
    const resultCount = document.getElementById('resultCount');

    searchTerm.textContent = term;
    resultCount.textContent = `${results.length} itens encontrados`;
    
    if (results.length > 0) {
        let html = '';
        
        // Adiciona barra de ações em lote
        html += `
            <div class="bulk-actions-container">
                <div class="bulk-actions-header">
                    <div class="selection-controls">
                        <button class="btn btn-outline-primary btn-sm" onclick="selectAllProducts()">
                            <i class="fas fa-check-double"></i> Selecionar Todos
                        </button>
                        <button class="btn btn-outline-secondary btn-sm" onclick="deselectAllProducts()">
                            <i class="fas fa-times"></i> Limpar Seleção
                        </button>
                        <span class="selection-counter">
                            <i class="fas fa-check-square"></i>
                            <span id="selectionCounter">0</span> selecionado(s)
                        </span>
                    </div>
                </div>
                
                <div id="bulkActions" class="bulk-actions" style="display: none;">
                    <div class="bulk-actions-content">
                        <span class="bulk-actions-label">
                            <i class="fas fa-tasks"></i>
                            Ações em lote para <strong id="bulkCount">0</strong> item(s)
                        </span>
                        <div class="bulk-actions-buttons">
                            <button class="btn btn-success" onclick="approveSelectedProducts()">
                                <i class="fas fa-check"></i> Aprovar Selecionados
                            </button>
                            <button class="btn btn-danger" onclick="rejectSelectedProducts()">
                                <i class="fas fa-times"></i> Reprovar Selecionados
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Grid de produtos
        html += '<div class="products-grid">';
        
        results.forEach((oferta, index) => {
            // Calcula a nota (ex: 9/10)
            let nota = Math.round((oferta.avaliacao || 0) * 2);
            
            // Valida a URL da imagem
            const imageUrl = validateAndFixImageUrl(oferta.imagem);
            
            html += `
                <div class="product-card" data-product-id="${oferta.id || index}" data-product-index="${index}">
                    <div class="product-selection">
                        <div class="checkbox-wrapper">
                            <input type="checkbox" 
                                   class="product-checkbox" 
                                   value="${oferta.id || index}"
                                   data-product-id="${oferta.id || index}">
                            <label class="checkbox-label"></label>
                        </div>
                    </div>
                    
                    <div class="product-header">
                        <span class="marketplace-badge marketplace-${(oferta.marketplace || '').toLowerCase()}">${oferta.marketplace || 'Desconhecido'}</span>
                        <span class="rating-badge">Nota: ${nota}/10</span>
                    </div>
                    
                    <div class="product-body">
                        <div class="image-container">
                            ${imageUrl ? 
                                `<img src="${imageUrl}" 
                                     class="product-image" 
                                     alt="${(oferta.titulo || 'Produto').replace(/"/g, '&quot;')}" 
                                     loading="lazy"
                                     onerror="this.parentElement.innerHTML='<div class=\\'no-image image-error\\'><i class=\\'fas fa-exclamation-triangle\\'></i><small>Erro ao carregar imagem</small></div>'">` : 
                                `<div class="no-image">
                                    <i class="fas fa-image"></i>
                                    <small>Sem imagem disponível</small></div>`
                            }
                        </div>
                        <div class="product-title">${oferta.titulo || 'Sem título'}</div>
                        <div class="product-price">${oferta.preco || 'Preço não disponível'}</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        content.innerHTML = html;
        
        // Adiciona event listeners aos checkboxes
        const checkboxes = content.querySelectorAll('.product-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const productId = this.getAttribute('data-product-id');
                console.log(`Evento change disparado para produto: ${productId}`);
                toggleProductSelection(productId);
            });
        });
        
        // Atualiza contador de ações em lote
        const bulkCount = document.getElementById('bulkCount');
        if (bulkCount) {
            bulkCount.textContent = selectedProducts.size;
        }
        
    } else {
        content.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h5>Nenhum resultado encontrado</h5>
                <p class="text-muted">Não foram encontradas ofertas para "${term}"</p>
            </div>
        `;
    }
    
    console.log('Exibindo seção de resultados');
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
    console.log('Seção exibida com sucesso');
}

// Funções auxiliares existentes
function addApprovedItem(id, titulo, preco, marketplace) {
    const approvedItems = document.getElementById('approvedItems');
    
    const itemHtml = `
        <div class="approved-item">
            <div class="approved-item-text">
                ${titulo} | ${preco} | ${marketplace}
            </div>
            <span class="remove-approved" onclick="removeApprovedItem(this)">Remover</span>
        </div>
    `;
    
    approvedItems.insertAdjacentHTML('beforeend', itemHtml);
}

function removeApprovedItem(element) {
    element.closest('.approved-item').remove();
    updateApprovedCount();
}

function updateApprovedCount() {
    const count = document.querySelectorAll('.approved-item').length;
    document.getElementById('approvedCount').textContent = count;
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
    // Resto da inicialização existente...
    const agendarButtons = document.querySelectorAll('button[name="agendar"]');
    agendarButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('frequencia-section').style.display = 'block';
        });
    });
    
    document.addEventListener('mousedown', function(event) {
        const agendamento = document.getElementById('frequencia-section');
        if (agendamento && agendamento.style.display === 'block') {
            if (!agendamento.contains(event.target) && !event.target.matches('button[name="agendar"]')) {
                agendamento.style.display = 'none';
            }
        }
    });
    
    const form = document.getElementById('searchForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            const submitter = e.submitter;
            const termo = document.getElementById('termo').value.trim();
            
            if (!termo) {
                e.preventDefault();
                showToast('Por favor, informe um termo de pesquisa', 'warning');
                return;
            }
            
            if (submitter && submitter.name === 'buscar_agora') {
                e.preventDefault();
                
                // Mostra loading
                const loadingElement = document.getElementById('loadingOverlay');
                if (loadingElement) {
                    loadingElement.style.display = 'flex';
                    console.log('Loading overlay exibido');
                } else {
                    console.error('Loading overlay não encontrado');
                }
                
                debugLog('Iniciando busca imediata para termo:', termo);
                
                // Envia requisição AJAX
                fetch('/buscar_imediato', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `termo=${encodeURIComponent(termo)}`
                })
                .then(response => {
                    debugLog('Resposta recebida:', response.status);
                    return response.json();
                })
                .then(data => {
                    // Esconde loading
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                        console.log('Loading overlay ocultado');
                    }
                    
                    if (data.success) {
                        displaySearchResults(data.resultados, termo);
                    } else {
                        console.error('Erro na busca:', data.error);
                        showToast('Erro na busca: ' + data.error, 'error');
                    }
                })
                .catch(error => {
                    // Esconde loading
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                        console.log('Loading overlay ocultado (erro)');
                    }
                    
                    console.error('Erro na requisição:', error);
                    showToast('Erro na requisição: ' + error.message, 'error');
                });
            }
        });
    }
});
