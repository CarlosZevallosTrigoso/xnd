// --- INICIO: Lógica del Grafo de Navegación ---

// Almacenamos los datos del grafo
const graphNodes = new vis.DataSet();
const graphEdges = new vis.DataSet();

// Función para añadir un nodo (una página) al grafo si no existe
function addNode(id) {
    if (!graphNodes.get(id)) {
        graphNodes.add({ id: id, label: id });
    }
}

// Función para añadir una arista (un enlace) entre dos páginas
function addEdge(from, to) {
    // Evitamos añadir aristas duplicadas
    const edgeId = `${from}->${to}`;
    if (!graphEdges.get(edgeId)) {
        graphEdges.add({ id: edgeId, from: from, to: to, arrows: 'to' });
    }
}

// Función que dibuja el grafo en el contenedor
function drawGraph() {
    const container = document.getElementById('graph-container');
    const data = { nodes: graphNodes, edges: graphEdges };
    const options = {
        layout: {
            hierarchical: {
                enabled: true,
                direction: 'LR', // De Izquierda a Derecha
                sortMethod: 'directed',
            },
        },
        physics: {
            enabled: false, // Desactivamos físicas para un layout más estable
        },
        nodes: {
            shape: 'box',
            color: '#e0eaff',
            font: {
                color: '#333'
            },
            borderWidth: 1,
            borderColor: '#b3c7ff',
        },
        edges: {
            color: '#848484',
        },
    };
    new vis.Network(container, data, options);
}

// --- FIN: Lógica del Grafo de Navegación ---


// Función para calcular colores
function getColorForDepth(depth) {
    const baseHue = 210, hueIncrement = 25, saturation = 30, panelLightness = 97, footerLightness = 92;
    const hue = (baseHue + (depth * hueIncrement)) % 360;
    return {
        panelColor: `hsl(${hue}, ${saturation}%, ${panelLightness}%)`,
        footerColor: `hsl(${hue}, ${saturation}%, ${footerLightness}%)`
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    const initialPanel = mainContainer.querySelector('.panel');

    // --- INICIO: Inicialización del Grafo y Modal ---

    // Añadir el nodo inicial del grafo
    if (initialPanel) {
        const initialId = initialPanel.dataset.id;
        addNode(initialId);
    }
    
    // Elementos del Modal
    const modal = document.getElementById('graph-modal');
    const showGraphBtn = document.getElementById('show-graph-btn');
    const closeGraphBtn = document.getElementById('close-graph-btn');

    showGraphBtn.addEventListener('click', () => {
        drawGraph();
        modal.style.display = 'flex';
    });

    closeGraphBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cerrar el modal si se hace clic fuera del contenido
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // --- FIN: Inicialización del Grafo y Modal ---

    // Colorear panel inicial
    if (initialPanel) {
        const initialPath = JSON.parse(initialPanel.dataset.path || '[]');
        const initialDepth = initialPath.length - 1;
        const colors = getColorForDepth(initialDepth);
        initialPanel.style.backgroundColor = colors.panelColor;
        const initialFooter = initialPanel.querySelector('.panel-footer');
        if (initialFooter) initialFooter.style.backgroundColor = colors.footerColor;
    }

    // Listener de eventos principal
    mainContainer.addEventListener('click', async (event) => {
        const clickedElement = event.target;

        if (clickedElement.tagName === 'A' && clickedElement.href) {
            event.preventDefault();
            await handleLinkClick(clickedElement);
        }

        if (clickedElement.matches('.close-btn')) {
            const panelToRemove = clickedElement.closest('.panel');
            if (panelToRemove && panelToRemove !== mainContainer.firstElementChild) panelToRemove.remove();
        }

        if (clickedElement.matches('.close-all-btn')) {
            let currentPanel = clickedElement.closest('.panel');
            while (currentPanel) {
                const nextPanel = currentPanel.nextElementSibling;
                if (currentPanel !== mainContainer.firstElementChild) currentPanel.remove();
                currentPanel = nextPanel;
            }
        }
    });

    async function handleLinkClick(linkElement) {
        const url = linkElement.href;
        const parentPanel = linkElement.closest('.panel');
        const parentId = parentPanel.dataset.id;
        
        const parentPath = JSON.parse(parentPanel.dataset.path || '[]');
        const newPageName = linkElement.textContent;
        const newId = newPageName; // Usamos el texto del enlace como ID único
        const newPath = [...parentPath, newPageName];
        const depth = newPath.length - 1;
        const colors = getColorForDepth(depth);

        // --- Actualización del Grafo ---
        addNode(newId);
        addEdge(parentId, newId);
        // -----------------------------

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error al cargar: ${response.statusText}`);
            
            const contentHTML = await response.text();
            const breadcrumbHTML = newPath.join(' &raquo; ');
            const newPanel = document.createElement('article');

            newPanel.classList.add('panel');
            newPanel.dataset.path = JSON.stringify(newPath);
            newPanel.dataset.id = newId; // Guardamos el ID en el panel
            newPanel.style.backgroundColor = colors.panelColor;
            
            newPanel.innerHTML = `
                <div class="panel-controls">
                    <button class="close-btn" title="Cerrar este panel">x</button>
                    <button class="close-all-btn" title="Cerrar este y los siguientes">[x todo]</button>
                </div>
                <section class="panel-content">
                    ${contentHTML}
                </section>
                <footer class="panel-footer" style="background-color: ${colors.footerColor};">
                    <p class="breadcrumb">${breadcrumbHTML}</p>
                </footer>
            `;

            if (!parentPanel.nextElementSibling) {
                mainContainer.appendChild(newPanel);
            } else {
                parentPanel.after(newPanel);
            }

            newPanel.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });

        } catch (error) {
            console.error('No se pudo cargar el panel:', error);
        }
    }
});

