document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');

    mainContainer.addEventListener('click', async (event) => {
        const clickedElement = event.target;

        // --- FUNCIONALIDAD 1: Abrir nuevo panel ---
        if (clickedElement.tagName === 'A') {
            event.preventDefault();
            handleLinkClick(clickedElement);
        }

        // --- FUNCIONALIDAD 2: Cerrar panel individual ---
        if (clickedElement.matches('.close-btn')) {
            const panelToRemove = clickedElement.closest('.panel');
            if (panelToRemove) {
                panelToRemove.remove();
            }
        }

        // --- FUNCIONALIDAD 3: Cerrar panel y los siguientes ---
        if (clickedElement.matches('.close-all-btn')) {
            let currentPanel = clickedElement.closest('.panel');
            while (currentPanel) {
                const nextPanel = currentPanel.nextElementSibling;
                currentPanel.remove();
                currentPanel = nextPanel;
            }
        }
    });

    async function handleLinkClick(linkElement) {
        const url = linkElement.href;
        const parentPanel = linkElement.closest('.panel');

        // Obtener la ruta del panel padre y crear la nueva ruta
        const parentPath = JSON.parse(parentPanel.dataset.path || '[]');
        const newPageName = linkElement.textContent;
        const newPath = [...parentPath, newPageName];

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error al cargar el recurso: ${response.statusText}`);
            
            const contentHTML = await response.text();
            
            // Crear el breadcrumb en formato HTML
            const breadcrumbHTML = newPath.join(' &raquo; ');

            // Crear el nuevo panel con la estructura completa
            const newPanel = document.createElement('article');
            newPanel.classList.add('panel');
            newPanel.dataset.path = JSON.stringify(newPath); // Guardar la ruta en el nuevo panel
            
            newPanel.innerHTML = `
                <div class="panel-controls">
                    <button class="close-btn" title="Cerrar este panel">X</button>
                    <button class="close-all-btn" title="Cerrar este y los siguientes">&raquo;</button>
                </div>
                <section class="panel-content">
                    ${contentHTML}
                </section>
                <footer class="panel-footer">
                    <p class="breadcrumb">${breadcrumbHTML}</p>
                </footer>
            `;

            mainContainer.appendChild(newPanel);
            newPanel.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });

        } catch (error) {
            console.error('No se pudo cargar el panel:', error);
            // Manejo de error visual (opcional)
        }
    }
});

