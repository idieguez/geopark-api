# geopark-api


## Descripción

"geopark-api" es un proyecto que forma parte de "Geopark", una aplicación web que permite a sus usuarios almacenar la ubicación de sus vehículos cuando estos son aparcados haciendo uso de la geolocalización de sus dispositivos móviles. Posteriormente, esta posición almacenada puede ser consultada o, incluso, enviada a una tercera persona.

"geopark-api" constituye la columna vertebral del backend de la aplicación, diseñado meticulosamente conforme a las mejores prácticas de desarrollo de REST API.




## Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Licencia](#licencia)
- [Contacto](#contacto)




## Tecnologías

Este proyecto utiliza las siguientes tecnologías y dependencias:

- Node.js
- Express
- Express Rate Limit
- Mongoose
- Bcrypt
- dotenv
- jsonwebtoken




## Instalación

Para instalar y ejecutar este proyecto localmente, sigue estos pasos:

1. Clona el repositorio:
    ```bash
    git clone https://github.com/idieguez/geopark-api.git
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd geopark-api
    ```
3. Instala las dependencias:
    ```bash
    npm install
    ```
4. Inicia el servidor en modo normal:
    ```bash
    npm run start
    ```
    O hazlo en modo desarrollo:
    ```bash
    npm run dev
    ```

Es necesario que se tenga previamente instalado y configurado Node.js, Git y MongoDB. Puede que también sea necesaria alguna configuración adicional.




## Uso

Para utilizar la API, realiza solicitudes HTTP a los endpoints disponibles. A continuación se muestra un ejemplo de cómo obtener información sobre un vehículo específico:

```bash
curl --location 'http://localhost:3000/api/vehicles/2380MBF' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzkzODE2MDVhZmE0NjFiNGIwYWJlMjciLCJpYXQiOjE3Mzc3MjAxNzIsImV4cCI6MTczNzgwNjU3Mn0.354X9zF4YYwxGf1eIImm7CCsWnc1_7kgM3Ekji_hef8'
```



## Endpoints


### Registro de un usuario

```http
POST /api/auth/register/
```
Crea un nuevo usuario. Requiere la información del usuario en formato JSON en el body.

### Inicio de sesión de un usuario

```http
POST /api/auth/login/
```
Inicia la sesión de un usuario existente. Requiere las credenciales del usuario en formato JSON en el body.

### Consulta de datos de un usuario

```http
GET /api/users/
```
Obtiene los datos de un usuario. Requiere autenticación.

### Modificación de datos de un usuario

```http
PATCH /api/users/
```
Modifica los datos de un usuario. Requiere la información del usuario a modificar en formato JSON en el body. Requiere autenticación.

### Eliminación de un usuario

```http
DELETE /api/users/
```
Elimina un usuario. Requiere autenticación.

### Creación de un vehículo

```http
POST /api/vehicles/
```
Crea un nuevo vehículo. Requiere la información del vehículo en formato JSON en el body. Requiere autenticación.

### Consulta de datos de todos los vehículos de un usuario

```http
GET /api/vehicles/
```
Obtiene los datos de todos los vehículos de un usuario. Requiere autenticación.

### Consulta de datos del vehículo de un usuario

```http
GET /api/vehicles/{{licensePlate}}
```
Obtiene los datos del vehículo especificado de un usuario. Requiere autenticación.

### Modificación de datos del vehículo de un usuario

```http
PATCH /api/vehicles/{{licensePlate}}
```
Modifica los datos del vehículo especificado de un usuario. Requiere la información del vehículo a modificar en formato JSON en el body. Requiere autenticación.

### Eliminación del vehículo de un usuario

```http
DELETE /api/vehicles/{{licensePlate}}
```
Elimina el vehículo especificado de un usuario. Requiere autenticación.




## Licencia

Este proyecto está licenciado bajo la Licencia AGPL-3.0. Consulta el archivo [LICENSE](LICENSE) para más detalles.




## Contacto

Para cualquier consulta o sugerencia, puedes contactarnos a través de:
- Correo electrónico: john@example.com
- GitHub: [idieguez](https://github.com/idieguez)



