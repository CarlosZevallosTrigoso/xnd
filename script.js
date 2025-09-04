// --- Lógica del Grafo de Navegación (sin cambios) ---
const graphNodes = new vis.DataSet();
const graphEdges = new vis.DataSet();
let network = null;
function addNode(id) { if (!graphNodes.get(id)) { graphNodes.add({ id: id, label: id }); } }
function addEdge(from, to) { const edgeId = `${from}->${to}`; if (!graphEdges.get(edgeId)) { graphEdges.add({ id: edgeId, from: from, to: to, arrows: 'to' }); } }
function drawGraph() {
    const container = document.getElementById('graph-container');
    const data = { nodes: graphNodes, edges: graphEdges };
    const options = {
        physics: { enabled: true, solver: 'barnesHut', barnesHut: { gravitationalConstant: -10000, centralGravity: 0.1, springLength: 120, }, stabilization: { iterations: 1500, }, },
        nodes: { shape: 'box', color: '#e0eaff', font: { color: '#333' }, borderWidth: 1, borderColor: '#b3c7ff', },
        edges: { color: '#848484', },
    };
    network = new vis.Network(container, data, options);
    network.on("stabilizationIterationsDone", () => network.fit());
}

// --- Lógica de Colores (sin cambios) ---
function getColorForDepth(depth) {
    const baseHue = 210, hueIncrement = 25, saturation = 60, panelLightness = 97, footerLightness = 92;
    const hue = (baseHue + (depth * hueIncrement)) % 360;
    return {
        panelColor: `hsl(${hue}, ${saturation}%, ${panelLightness}%)`,
        footerColor: `hsl(${hue}, ${saturation}%, ${footerLightness}%)`
    };
}

// --- NUEVO: Lógica de la Cinta Cronológica ---
function createTimelineBlock(targetId, color, title) {
    const block = document.createElement('div');
    block.className = 'timeline-block';
    block.style.backgroundColor = color;
    block.dataset.targetId = targetId;
    block.title = title; // Tooltip con el nombre del panel
    return block;
}

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    const timelineContainer = document.getElementById('timeline-container');
    const initialPanel = mainContainer.querySelector('.panel');

    // --- Lógica del Grafo y Modal (sin cambios) ---
    if (initialPanel) { addNode(initialPanel.dataset.id); }
    const modal = document.getElementById('graph-modal');
    const showGraphBtn = document.getElementById('show-graph-btn');
    const closeGraphBtn = document.getElementById('close-graph-btn');
    showGraphBtn.addEventListener('click', () => { drawGraph(); modal.style.display = 'flex'; });
    closeGraphBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (event) => { if (event.target === modal) modal.style.display = 'none'; });

    // --- Inicialización del Panel y Cinta ---
    if (initialPanel) {
        const initialPath = JSON.parse(initialPanel.dataset.path || '[]');
        const initialDepth = initialPath.length - 1;
        const colors = getColorForDepth(initialDepth);
        initialPanel.style.backgroundColor = colors.panelColor;
        initialPanel.querySelector('.panel-footer').style.backgroundColor = colors.footerColor;

        // Crear el primer bloque en la cinta
        const initialBlock = createTimelineBlock(initialPanel.dataset.id, colors.panelColor, initialPanel.dataset.id);
        timelineContainer.appendChild(initialBlock);
    }
    
    // --- NUEVO: Listener para la Cinta Cronológica ---
    timelineContainer.addEventListener('click', (event) => {
        const block = event.target.closest('.timeline-block');
        if (block) {
            const targetId = block.dataset.targetId;
            const targetPanel = mainContainer.querySelector(`[data-id="${targetId}"]`);
            if (targetPanel) {
                targetPanel.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
            }
        }
    });

    // --- Listener de Eventos Principal (Modificado para sincronizar la cinta) ---
    mainContainer.addEventListener('click', async (event) => {
        const clickedElement = event.target;

        if (clickedElement.tagName === 'A' && clickedElement.href) {
            event.preventDefault();
            await handleLinkClick(clickedElement);
        }

        if (clickedElement.matches('.close-btn')) {
            const panelToRemove = clickedElement.closest('.panel');
            if (panelToRemove && panelToRemove !== mainContainer.firstElementChild) {
                const nodeIdToRemove = panelToRemove.dataset.id;
                // Sincronizar grafo y cinta
                if (nodeIdToRemove) {
                    graphNodes.remove(nodeIdToRemove);
                    const blockToRemove = timelineContainer.querySelector(`[data-target-id="${nodeIdToRemove}"]`);
                    if (blockToRemove) blockToRemove.remove();
                }
                panelToRemove.remove();
            }
        }

        if (clickedElement.matches('.close-all-btn')) {
            let currentPanel = clickedElement.closest('.panel');
            while (currentPanel && currentPanel !== mainContainer.firstElementChild) {
                const nextPanel = currentPanel.nextElementSibling;
                 const nodeIdToRemove = currentPanel.dataset.id;
                // Sincronizar grafo y cinta
                if (nodeIdToRemove) {
                    graphNodes.remove(nodeIdToRemove);
                    const blockToRemove = timelineContainer.querySelector(`[data-target-id="${nodeIdToRemove}"]`);
                    if (blockToRemove) blockToRemove.remove();
                }
                currentPanel.remove();
                currentPanel = nextPanel;
            }
        }
    });

    // --- Función handleLinkClick (Modificada para añadir a la cinta) ---
    async function handleLinkClick(linkElement) {
        const url = linkElement.href;
        const parentPanel = linkElement.closest('.panel');
        const parentId = parentPanel.dataset.id;
        const parentPath = JSON.parse(parentPanel.dataset.path || '[]');
        const newPageName = linkElement.textContent;
        const newId = newPageName;
        const newPath = [...parentPath, newPageName];
        const depth = newPath.length - 1;
        const colors = getColorForDepth(depth);

        addNode(newId);
        addEdge(parentId, newId);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error al cargar: ${response.statusText}`);
            
            const contentHTML = await response.text();
            const breadcrumbHTML = newPath.join(' &raquo; ');
            const newPanel = document.createElement('article');

            newPanel.className = 'panel panel-animated';
            newPanel.dataset.path = JSON.stringify(newPath);
            newPanel.dataset.id = newId;
            newPanel.style.backgroundColor = colors.panelColor;
            
            newPanel.innerHTML = `
                <div class="panel-controls">
                    <button class="close-btn" title="Cerrar este panel">x</button>
                    <button class="close-all-btn" title="Cerrar este y los siguientes">[x todo]</button>
                </div>
                <section class="panel-content">${contentHTML}</section>
                <footer class="panel-footer" style="background-color: ${colors.footerColor};">
                    <p class="breadcrumb">${breadcrumbHTML}</p>
                </footer>`;

            // Lógica para insertar panel
            let existingPanel = mainContainer.querySelector(`[data-id="${newId}"]`);
            while (existingPanel) {
                const next = existingPanel.nextElementSibling;
                const blockToRemove = timelineContainer.querySelector(`[data-target-id="${existingPanel.dataset.id}"]`);
                if(blockToRemove) blockToRemove.remove();
                graphNodes.remove(existingPanel.dataset.id);
                existingPanel.remove();
                existingPanel = next;
            }
            
            let nextSibling = parentPanel.nextElementSibling;
            while(nextSibling) {
                const next = nextSibling.nextElementSibling;
                const blockToRemove = timelineContainer.querySelector(`[data-target-id="${nextSibling.dataset.id}"]`);
                if(blockToRemove) blockToRemove.remove();
                graphNodes.remove(nextSibling.dataset.id);
                nextSibling.remove();
                nextSibling = next;
            }

            parentPanel.after(newPanel);
            
            // Añadir bloque a la cinta cronológica
            const newBlock = createTimelineBlock(newId, colors.panelColor, newId);
            const parentBlock = timelineContainer.querySelector(`[data-target-id="${parentId}"]`);
            if (parentBlock) {
                 parentBlock.after(newBlock);
            } else {
                 timelineContainer.appendChild(newBlock);
            }

            newPanel.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });

        } catch (error) {
            console.error('No se pudo cargar el panel:', error);
        }
    }
});

