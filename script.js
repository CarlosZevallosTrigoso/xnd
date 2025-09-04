document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');

    // Se utiliza la delegación de eventos para manejar todos los clics eficientemente.
    // Escuchamos clics en el contenedor principal en lugar de en cada enlace individual.
    mainContainer.addEventListener('click', async (event) => {
        // Verificamos si el elemento clickeado es un enlace (etiqueta <a>).
        if (event.target.tagName === 'A') {
            event.preventDefault(); // Prevenimos la acción por defecto del enlace (navegar a otra página).

            const url = event.target.href;

            try {
                // Usamos fetch para obtener el contenido del archivo HTML enlazado.
                // 'await' pausa la ejecución hasta que la promesa de fetch se resuelva.
                const response = await fetch(url);
                if (!response.ok) {
                    // Si hay un error en la respuesta (ej: 404 No Encontrado), lanzamos un error.
                    throw new Error(`Error al cargar el recurso: ${response.statusText}`);
                }
                const contentHTML = await response.text();

                // Creamos un nuevo elemento 'article' para que sea nuestro nuevo panel.
                const newPanel = document.createElement('article');
                newPanel.classList.add('panel');
                newPanel.innerHTML = contentHTML;

                // Añadimos el nuevo panel al final del contenedor principal.
                mainContainer.appendChild(newPanel);

                // Hacemos scroll horizontal suavemente para que el nuevo panel sea visible.
                // 'behavior: smooth' crea la animación de desplazamiento.
                // 'inline: start' alinea el inicio del panel con el inicio del área visible.
                newPanel.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });

            } catch (error) {
                console.error('No se pudo cargar el panel:', error);
                // Opcional: Mostrar un mensaje de error al usuario en un panel.
                const errorPanel = document.createElement('article');
                errorPanel.classList.add('panel');
                errorPanel.innerHTML = `<h2>Error</h2><p>No se pudo cargar el contenido. Por favor, revisa la consola para más detalles.</p>`;
                mainContainer.appendChild(errorPanel);
                errorPanel.scrollIntoView({ behavior: 'smooth', inline: 'start' });
            }
        }
    });
});
