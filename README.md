# 🛒 Tienda Online - Portafolio Hito 2 (M7)

Este proyecto es una aplicación **Fullstack** desarrollada para el Módulo 7. Consiste en una tienda de ropa con un catálogo dinámico conectado a una base de datos PostgreSQL, un sistema de carrito de compras y un historial de ventas que registra transacciones en tiempo real.

## 🚀 Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3 (Grid & Flexbox), JavaScript (Fetch API).
* **Backend:** Node.js, Express.
* **Base de Datos:** PostgreSQL.
* **ORM:** Sequelize (para gestión de modelos y consultas).
* **Control de Transacciones:** SQL (TCL) para asegurar la integridad de las ventas.

## 🛠️ Funcionalidades Clave

1.  **Catálogo Dinámico:** Los productos, precios y stock se cargan directamente desde la base de datos.
2.  **Gestión de Stock:** Al realizar una compra, el sistema descuenta automáticamente las unidades del inventario.
3.  **Transacciones Seguras:** El proceso de compra utiliza transacciones para asegurar que no se descuente stock si la creación de la venta falla (y viceversa).
4.  **Historial de Ventas:** Registro detallado de todas las transacciones realizadas, mostrando fecha, ID y monto total en formato CLP.
5.  **Diseño Responsive:** Interfaz limpia y alineada para una experiencia de usuario fluida.

## 📋 Requisitos Previos

* Node.js instalado.
* PostgreSQL corriendo localmente.
* Base de datos creada (por defecto llamada `tienda`).

## 🔧 Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/jenovevaquijada/m7-portafolio.git](https://github.com/jenovevaquijada/m7-portafolio.git)
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar la Base de Datos:**
    Ejecuta el script SQL incluido en el proyecto (`database.sql`) para crear las tablas e insertar los productos iniciales.
4.  **Iniciar el servidor:**
    ```bash
    node server.js
    ```
5.  **Acceder a la aplicación:**
    Abre tu navegador en `http://localhost:3000`

## 📸 Vista Previa del Proyecto

La aplicación cuenta con una división clara entre el catálogo de productos (izquierda) y el panel de gestión de carrito e historial (derecha), permitiendo una navegación intuitiva.

---
## 👩🏻‍💻 Autora
Jenoveva Quijada
