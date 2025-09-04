// --- Lógica del Grafo de Navegación ---
const graphNodes = new vis.DataSet();
const graphEdges = new vis.DataSet();
let network = null;

const colorOpen = { border: '#ff4d4d', background: '#ffe5e5' };
const colorClosed = { border: '#666', background: '#e0e0e0' };

const siteStructure = {
    nodes: [
        { id: "Punto de Partida" }, { id: "Proyecto Xanadu" }, { id: "¿Qué es el hipertexto?" },
        { id: "Sobre el diseño minimalista" }, { id: "Vannevar Bush" }, { id: "Ted Nelson" }
    ],
    edges: [
        { from: "Punto de Partida", to: "Proyecto Xanadu" }, { from: "Punto de Partida", to: "¿Qué es el hipertexto?" },
        { from: "Punto de Partida", to: "Sobre el diseño minimalista" }, { from: "¿Qué es el hipertexto?", to: "Vannevar Bush" },
        { from: "¿Qué es el hipertexto?", to: "Proyecto Xanadu" }, { from: "Proyecto Xanadu", to: "Ted Nelson" },
        { from: "Vannevar Bush", to: "¿Qué es el hipertexto?" }, { from: "Ted Nelson", to: "Proyecto Xanadu" }
    ]
};

function initializeFullGraph() {
    siteStructure.nodes.forEach(node => {
        graphNodes.add({ id: node.id, label: node.id, color: colorClosed });
    });
    siteStructure.edges.forEach(edge => {
        graphEdges.add({ id: `${edge.from}->${edge.to}`, from: edge.from, to: edge.to, arrows: 'to' });
    });
}

function updateNodeStatus(nodeId, isOpen) {
    if (graphNodes.get(nodeId)) {
        graphNodes.update({ id: nodeId, color: isOpen ? colorOpen : colorClosed });
    }
}

function drawGraph() {
    const container = document.getElementById('graph-container');
    const data = { nodes: graphNodes, edges: graphEdges };
    const options = {
        physics: { enabled: true, solver: 'barnesHut', barnesHut: { gravitationalConstant: -10000, centralGravity: 0.1, springLength: 150 }, stabilization: { iterations: 1500 } },
        nodes: { shape: 'box', font: { color: '#333' }, borderWidth: 2 },
        edges: { color: '#848484' }
    };
    network = new vis.Network(container, data, options);
    network.on("stabilizationIterationsDone", () => network.fit());
}

// --- Lógica de Colores ---
function getColorForDepth(depth) {
    const baseHue = 210, hueIncrement = 25, saturation = 60, panelLightness = 97, footerLightness = 92;
    const hue = (baseHue + (depth * hueIncrement)) % 360;
    return {
        panelColor: `hsl(${hue}, ${saturation}%, ${panelLightness}%)`,
        footerColor: `hsl(${hue}, ${saturation}%, ${footerLightness}%)`
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    const initialPanel = mainContainer.querySelector('.panel');

    // Inicialización del Grafo y Modal
    initializeFullGraph();
    if (initialPanel) {
        updateNodeStatus(initialPanel.dataset.id, true);
    }
    const modal = document.getElementById('graph-modal');
    const showGraphBtn = document.getElementById('show-graph-btn');
    const closeGraphBtn = document.getElementById('close-graph-btn');
    showGraphBtn.addEventListener('click', () => { drawGraph(); modal.style.display = 'flex'; });
    closeGraphBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (event) => { if (event.target === modal) modal.style.display = 'none'; });

    // Inicialización del Panel
    if (initialPanel) {
        const initialPath = JSON.parse(initialPanel.dataset.path || '[]');
        const colors = getColorForDepth(initialPath.length - 1);
        initialPanel.style.backgroundColor = colors.panelColor;
        initialPanel.querySelector('.panel-footer').style.backgroundColor = colors.footerColor;
    }

    // Listener de Eventos Principal
    mainContainer.addEventListener('click', async (event) => {
        const clickedElement = event.target;

        if (clickedElement.tagName === 'A' && clickedElement.href) {
            event.preventDefault();
            await handleLinkClick(clickedElement);
        }

        if (clickedElement.matches('.close-btn')) {
            const panelToRemove = clickedElement.closest('.panel');
            if (panelToRemove && panelToRemove !== mainContainer.firstElementChild) {
                updateNodeStatus(panelToRemove.dataset.id, false);
                panelToRemove.remove();
            }
        }

        if (clickedElement.matches('.close-all-btn')) {
            let currentPanel = clickedElement.closest('.panel');
            while (currentPanel && currentPanel !== mainContainer.firstElementChild) {
                const nextPanel = currentPanel.nextElementSibling;
                updateNodeStatus(currentPanel.dataset.id, false);
                currentPanel.remove();
                currentPanel = nextPanel;
            }
        }
    });

    async function handleLinkClick(linkElement) {
        const url = linkElement.href;
        const parentPanel = linkElement.closest('.panel');
        const parentPath = JSON.parse(parentPanel.dataset.path || '[]');
        const newPageName = linkElement.textContent;
        const newId = newPageName;
        
        updateNodeStatus(newId, true);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error al cargar: ${response.statusText}`);
            
            const contentHTML = await response.text();
            const newPath = [...parentPath, newPageName];
            const depth = newPath.length - 1;
            const colors = getColorForDepth(depth);
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

            // --- LÓGICA CORREGIDA ---
            // Simplemente inserta el nuevo panel después del panel padre,
            // sin cerrar los paneles siguientes.
            parentPanel.after(newPanel);
            
            newPanel.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });

        } catch (error) {
            updateNodeStatus(newId, false);
            console.error('No se pudo cargar el panel:', error);
        }
    }
});

