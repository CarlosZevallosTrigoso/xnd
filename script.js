document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');

    // Usamos un solo event listener para todo el contenedor
    mainContainer.addEventListener('click', async (event) => {
        const clickedElement = event.target;

        // --- MANEJO DE CLIC EN ENLACE ---
        if (clickedElement.tagName === 'A' && clickedElement.href) {
            event.preventDefault();
            handleLinkClick(clickedElement);
        }

        // --- MANEJO DE CLIC EN BOTÓN DE CIERRE INDIVIDUAL ---
        if (clickedElement.matches('.close-btn')) {
            const panelToRemove = clickedElement.closest('.panel');
            // Asegurarse de no cerrar el primer panel
            if (panelToRemove && panelToRemove !== mainContainer.firstElementChild) {
                panelToRemove.remove();
            }
        }

        // --- MANEJO DE CLIC EN BOTÓN DE CIERRE MÚLTIPLE ---
        if (clickedElement.matches('.close-all-btn')) {
            let currentPanel = clickedElement.closest('.panel');
            while (currentPanel) {
                const nextPanel = currentPanel.nextElementSibling;
                // Asegurarse de no cerrar el primer panel
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

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error al cargar: ${response.statusText}`);
            
            const contentHTML = await response.text();
            const breadcrumbHTML = newPath.join(' &raquo; ');

            const newPanel = document.createElement('article');
            newPanel.classList.add('panel');
            newPanel.dataset.path = JSON.stringify(newPath);
            
            // --- NUEVO: Texto de los botones actualizado ---
            newPanel.innerHTML = `
                <div class="panel-controls">
                    <button class="close-btn" title="Cerrar este panel">x</button>
                    <button class="close-all-btn" title="Cerrar este y los siguientes">[x todo]</button>
                </div>
                <section class="panel-content">
                    ${contentHTML}
                </section>
                <footer class="panel-footer">
                    <p class="breadcrumb">${breadcrumbHTML}</p>
                </footer>
            `;

            // --- NUEVO: Lógica de inserción del panel ---
            // Si el panel padre es el último, simplemente añadimos el nuevo al final.
            if (!parentPanel.nextElementSibling) {
                mainContainer.appendChild(newPanel);
            } else {
                // Si no, lo insertamos justo después del panel padre, "empujando" los demás.
                parentPanel.after(newPanel);
            }

            newPanel.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });

        } catch (error) {
            console.error('No se pudo cargar el panel:', error);
        }
    }
});

