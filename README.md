# geopark-api


![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22-43853D?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5.x-404D59?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Ready-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![Jest Tests](https://img.shields.io/badge/Tests-60%20Passed-brightgreen?style=flat-square&logo=jest)
![License](https://img.shields.io/badge/License-AGPL--3.0-blue?style=flat-square)




## Descripción

**geopark-api** es el servicio backend central de **Geopark**, una aplicación web diseñada para que los usuarios puedan registrar, consultar y compartir la ubicación exacta de sus vehículos aparcados mediante la geolocalización de sus dispositivos móviles.

Construida sobre Node.js y Express, esta REST API ha sido desarrollada priorizando la seguridad, el rendimiento y las exigencias del software moderno. Entre sus características arquitectónicas destacan:

- **Seguridad robusta**: autenticación state-less mediante JWT, encriptación de contraseñas con bcrypt, y protección activa contra vulnerabilidades web usando Helmet, CORS estricto y Rate Limiting.

- **Fiabilidad y tipado**: validación estricta de todas las entradas (payloads) mediante esquemas de Zod, acompañada de un middleware global para el manejo unificado de errores (JSend).

- **Calidad garantizada**: lógica de negocio respaldada por una exhaustiva batería de más de 60 pruebas automatizadas (unitarias y de integración) utilizando Jest, Supertest y bases de datos en memoria para asegurar cero regresiones.




## Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Formato de Respuestas](#formato-de-respuestas)
- [Endpoints](#endpoints)
- [Tests](#tests)
- [Licencia](#licencia)
- [Contacto](#contacto)




## Tecnologías

Este proyecto utiliza las siguientes tecnologías:

- Node.js
- Express

Adicionalmente, se han empleado las siguientes dependencias principales:

- bcrypt
- cors
- dotenv
- express-rate-limit
- helmet
- jest (dev)
- jsonwebtoken
- mongodb-memory-server (dev)
- mongoose (dev)
- morgan
- nodemon (dev)
- supertest (dev)
- zod

Como ya se ha podido inferir por las dependencias, la base de datos usada para persistir es MongoDB.




## Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener instalado en tu sistema:

- **Node.js**: versión 22 o superior.
- **Git**: para clonar el repositorio.
- **MongoDB**: una instancia local en ejecución (puerto por defecto 27017).




## Instalación

Para instalar y ejecutar este proyecto localmente, sigue estos pasos:

1. Clona el repositorio:

    ```bash
    git clone https://github.com/idieguez/geopark-api.git
    ```

2. Navega al directorio del proyecto y ejecuta la instalación de dependencias:

    ```bash
    cd geopark-api
    npm install
    ```

3. **Variables de entorno**. *Nota:* para facilitar el despliegue en entornos de desarrollo y evaluación académica, el archivo `.env` se ha incluido directamente en el repositorio. No es necesaria ninguna configuración adicional de claves secretas, CORS o puertos para levantar el proyecto.

4. Inicia el servidor:
    - Modo producción: `npm run start`
    - Modo desarrollo (con hot-reload): `npm run dev`




## Uso

Para utilizar la API, realiza solicitudes HTTP a los endpoints disponibles. A continuación se muestra un ejemplo de cómo obtener información sobre un vehículo específico:

```bash
curl --location 'http://localhost:3001/api/vehicles/1234ABC' --header 'Authorization: Bearer <token>'
```




## Formato de Respuestas

La API sigue un formato de respuesta estructurado para facilitar su consumo desde aplicaciones cliente.

**Respuesta exitosa (200 OK / 201 Created)**:

```json
{
    "status": "success",
    "data": { ... }
}
```

**Respuesta de error estándar (entorno de producción)**:

```json
{
    "status": "error",
    "message": "Descripción detallada del error."
}
```

*Nota: al ejecutar la API en entorno de desarrollo (`ENV='DEV'`), las respuestas de error pueden incluir atributos adicionales (como `details` o la traza del error) orientados exclusivamente a la depuración.*




## Endpoints

A continuación se detalla el contrato de la API. Las rutas marcadas con el candado (🔒) requieren que se envíe el token JWT en la cabecera `Authorization: Bearer <token>`.

| Método | Endpoint | Descripción | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register/` | Crea un nuevo usuario. | ❌ |
| `POST` | `/api/auth/login/` | Inicia la sesión de un usuario y devuelve el Token JWT. | ❌ |
| `GET` | `/api/users/` | Obtiene los datos del usuario autenticado. | 🔒 |
| `PATCH` | `/api/users/` | Modifica los datos permitidos del usuario. | 🔒 |
| `DELETE`| `/api/users/` | Elimina la cuenta del usuario. | 🔒 |
| `POST` | `/api/vehicles/` | Crea un nuevo vehículo asociado al usuario. | 🔒 |
| `GET` | `/api/vehicles/` | Obtiene el listado de todos los vehículos del usuario. | 🔒 |
| `GET` | `/api/vehicles/{licensePlate}`| Obtiene los detalles de un vehículo específico. | 🔒 |
| `PATCH` | `/api/vehicles/{licensePlate}`| Modifica los datos (ej. notas, localización) de un vehículo. | 🔒 |
| `DELETE`| `/api/vehicles/{licensePlate}`| Elimina un vehículo específico del usuario. | 🔒 |




## Tests

La API cuenta con una batería completa de pruebas automatizadas construida con **Jest** y **Supertest**, garantizando la estabilidad del sistema y el cumplimiento de las reglas de negocio. Se utiliza `mongodb-memory-server` para ejecutar pruebas de integración rápidas y aisladas sin afectar a la base de datos de desarrollo.

Puedes ejecutar las pruebas utilizando los siguientes scripts preconfigurados:

- **Tests Unitarios**: validan esquemas (Zod) y lógica pura.

    ```bash
    npm run test:unit
    ```

- **Tests de Integración**: validan el flujo completo (Controlador > Middleware > Base de Datos).

    ```bash
    npm run test:integration
    ```

- **Batería completa (Full Suite)**: ejecuta ambas fases de manera secuencial.

    ```bash
    npm run test:full
    ```




## Licencia

Este proyecto está licenciado bajo la Licencia AGPL-3.0. Consulta el archivo [LICENSE](LICENSE) para más detalles.




## Contacto

Para cualquier consulta o sugerencia, puedes contactarnos a través de:

- Correo electrónico: john@example.com
- GitHub: [idieguez](https://github.com/idieguez)

