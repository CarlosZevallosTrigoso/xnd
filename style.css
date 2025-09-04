/**
 * Calcula un par de colores (para el panel y su pie de página) basado en la profundidad de navegación.
 * @param {number} depth - El nivel de profundidad del panel (0 para el panel raíz).
 * @returns {{panelColor: string, footerColor: string}}
 */
function getColorForDepth(depth) {
    const baseHue = 210; // Un azul base
    const hueIncrement = 25; // Cuánto cambia el color en cada nivel
    const saturation = 30;
    const panelLightness = 97; // Un color de fondo muy claro, casi blanco
    const footerLightness = 92; // Un tono ligeramente más oscuro para el pie de página

    // Calcula el nuevo tono, asegurándose de que se mantenga en el rango de 0-360
    const hue = (baseHue + (depth * hueIncrement)) % 360;

    return {
        panelColor: `hsl(${hue}, ${saturation}%, ${panelLightness}%)`,
        footerColor: `hsl(${hue}, ${saturation}%, ${footerLightness}%)`
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');

    // Colorear el panel inicial al cargar la página
    const initialPanel = mainContainer.querySelector('.panel');
    if (initialPanel) {
        const initialPath = JSON.parse(initialPanel.dataset.path || '[]');
        const initialDepth = initialPath.length - 1;
        const colors = getColorForDepth(initialDepth);

        initialPanel.style.backgroundColor = colors.panelColor;
        const initialFooter = initialPanel.querySelector('.panel-footer');
        if (initialFooter) {
            initialFooter.style.backgroundColor = colors.footerColor;
        }
    }

    // Listener de eventos principal
    mainContainer.addEventListener('click', async (event) => {
        const clickedElement = event.target;

        if (clickedElement.tagName === 'A' && clickedElement.href) {
            event.preventDefault();
            handleLinkClick(clickedElement);
        }

        if (clickedElement.matches('.close-btn')) {
            const panelToRemove = clickedElement.closest('.panel');
            if (panelToRemove && panelToRemove !== mainContainer.firstElementChild) {
                panelToRemove.remove();
            }
        }

        if (clickedElement.matches('.close-all-btn')) {
            let currentPanel = clickedElement.closest('.panel');
            while (currentPanel) {
                const nextPanel = currentPanel.nextElementSibling;
                if (currentPanel !== mainContainer.firstElementChild) {
                    currentPanel.remove();
                }
                currentPanel = nextPanel;
            }
        }
    });

    async function handleLinkClick(linkElement) {
        const url = linkElement.href;
        const parentPanel = linkElement.closest('.panel');
        const parentPath = JSON.parse(parentPanel.dataset.path || '[]');
        const newPageName = linkElement.textContent;
        const newPath = [...parentPath, newPageName];
        const depth = newPath.length - 1;
        const colors = getColorForDepth(depth);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error al cargar: ${response.statusText}`);
            
            const contentHTML = await response.text();
            const breadcrumbHTML = newPath.join(' &raquo; ');
            const newPanel = document.createElement('article');

            newPanel.classList.add('panel');
            newPanel.dataset.path = JSON.stringify(newPath);
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

