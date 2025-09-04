# **🏛️ Proyecto Xanadu Minimalista: Un Explorador Hipertextual**

Este proyecto es un experimento de navegación web inspirado en la visión original del hipertexto de Ted Nelson y su **Proyecto Xanadu**. En lugar de saltar de una página a otra, cada enlace expande tu lienzo de pensamiento, abriendo un nuevo panel de contenido a la derecha. Esto permite mantener siempre el contexto original mientras se exploran nuevas ideas de forma visual y continua.  
El objetivo es crear una herramienta simple y elegante para la lectura no lineal y el descubrimiento de conexiones.  
(Aquí puedes añadir un GIF o una captura de pantalla de tu proyecto en acción)  
\`\`

## **✨ Características Principales**

* **Navegación Horizontal Infinita:** Explora el contenido en un lienzo que se expande hacia la derecha, creando un "hilo de pensamiento" visual.  
* **Carga Dinámica de Contenido:** Los paneles se cargan al instante sin necesidad de recargar la página, ofreciendo una experiencia fluida.  
* **Mapa de Navegación Interactivo:** Visualiza tu recorrido en un grafo dinámico que muestra cómo se conectan las ideas que has explorado.  
* **Gestión de Paneles:** Cierra paneles de forma individual o elimina ramas completas de tu exploración para mantener el espacio de trabajo limpio.  
* **Diseño Adaptable (Responsive):** La experiencia está optimizada para funcionar tanto en ordenadores de escritorio como en dispositivos móviles.  
* **Interfaz Minimalista:** Un diseño limpio y sin distracciones que pone el foco en el contenido.

## **🚀 Cómo Empezar**

Este proyecto está construido con **HTML, CSS y JavaScript vainilla**, sin necesidad de compiladores ni dependencias complejas.

1. **Clona o descarga el repositorio:**  
   git clone \[https://github.com/tu-usuario/tu-repositorio.git\](https://github.com/tu-usuario/tu-repositorio.git)

2. **Navega a la carpeta del proyecto:**  
   cd tu-repositorio

3. **Abre el archivo index.html** en tu navegador web. ¡Eso es todo\!

## **✍️ Cómo Personalizar y Añadir tu Propio Contenido**

La belleza de este proyecto es lo fácil que es adaptarlo. Puedes crear tu propia enciclopedia personal, un blog no lineal o una herramienta de estudio.

### **Estructura de Archivos**

/  
├── index.html         (La página principal)  
├── script.js          (Toda la lógica)  
├── style.css          (Todos los estilos)  
│  
└── /contenido/        (¡Aquí va tu contenido\!)  
    ├── pagina-1.html  
    ├── otra-pagina.html  
    └── ...

### **Para añadir una nueva página:**

1. **Crea un archivo .html** dentro de la carpeta /contenido/. Por ejemplo: mi-nuevo-tema.html.  
2. **Escribe el contenido** dentro de ese archivo. No necesitas una estructura HTML completa, solo los elementos que quieres mostrar (títulos, párrafos, etc.).  
   \<h2\>Mi Nuevo Tema\</h2\>  
   \<p\>Este es el texto de mi nuevo tema. Desde aquí puedo enlazar a otras ideas.\</p\>

3. **Enlázalo desde otra página.** Abre un archivo de contenido existente (o el index.html) y añade un enlace al nuevo archivo:  
   \<a href="contenido/mi-nuevo-tema.html"\>Explorar mi nuevo tema\</a\>

El sistema se encargará automáticamente del resto.

## **🛠️ Tecnologías Utilizadas**

* **HTML5**  
* **CSS3** (Flexbox para el layout)  
* **JavaScript Vainilla (ES6+)**  
* **vis.js Network** para la visualización del grafo de navegación.

## **Agradecimientos**

Este proyecto se inspira en las ideas de pioneros como **Vannevar Bush** (Memex), **Ted Nelson** (Proyecto Xanadu) y todos aquellos que soñaron con una web más conectada e intuitiva.
