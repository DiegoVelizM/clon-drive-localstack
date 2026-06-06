# Clon de Drive con LocalStack

## Descripción

Aplicación web tipo clon simplificado de Google Drive que permite cargar, visualizar y descargar archivos utilizando un almacenamiento tipo Amazon S3 emulado localmente mediante LocalStack.

El proyecto fue desarrollado utilizando React para el frontend, NestJS para el backend, Docker para la containerización y Terraform para la creación de infraestructura como código.

---

## Tecnologías utilizadas

* React + TypeScript
* NestJS
* Docker
* Docker Compose
* Terraform
* LocalStack (S3)
* AWS SDK v3

---

## Arquitectura

```text
Usuario
   │
   ▼
Frontend (React)
   │ HTTP
   ▼
Backend (NestJS)
   │
   ▼
LocalStack S3

Terraform
   │
   ▼
Creación del bucket S3
```

---

## Funcionalidades

* Carga múltiple de archivos.
* Drag & Drop.
* Visualización de los últimos 3 archivos cargados.
* Descarga de archivos.
* Almacenamiento en bucket S3 mediante LocalStack.
* Infraestructura definida con Terraform.
* Ejecución mediante Docker Compose.

---

## Requisitos

Antes de ejecutar el proyecto se debe tener instalado:

* Docker Desktop
* Terraform
* Git
* Node.js 22 o superior (solo para desarrollo local)

---

## Variables de entorno

El proyecto utiliza variables de entorno para configurar la conexión del backend con LocalStack S3.

### Backend

| Variable      | Descripción                                       | Valor en Docker          |
| ------------- | ------------------------------------------------- | ------------------------ |
| `S3_ENDPOINT` | Endpoint del servicio S3 utilizado por el backend | `http://localstack:4566` |

En `docker-compose.yml` ya viene configurada:

```yml
environment:
  - S3_ENDPOINT=http://localstack:4566
```

Para ejecución local fuera de Docker, el backend utiliza por defecto:

```text
http://localhost:4566
```

por lo que no es obligatorio definir la variable manualmente.

---

## Ejecución del proyecto

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd clon-drive-localstack
```

### 2. Crear infraestructura con Terraform

Desde la carpeta `infra`:

```bash
cd infra
terraform init
terraform apply
```

Cuando Terraform solicite confirmación, escribir:

```text
yes
```

Estos comandos crean el bucket S3 utilizado por la aplicación dentro de LocalStack.

### 3. Levantar los servicios con Docker Compose

Volver a la raíz del proyecto:

```bash
cd ..
docker compose up -d --build
```

Este comando levanta los siguientes servicios:

* LocalStack
* Backend NestJS
* Frontend React

---

## Acceso a la aplicación

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:3001
```

### Verificación de LocalStack

```text
http://localhost:4566/_localstack/health
```

Este endpoint permite verificar el estado de los servicios de LocalStack.

Para este proyecto, el servicio importante es S3, por lo que debería aparecer una respuesta similar a:

```json
{
  "services": {
    "s3": "running"
  }
}
```

Lo anterior confirma que LocalStack está operativo y que el servicio S3 se encuentra disponible para el almacenamiento de archivos.

---

## Endpoints del backend

### Subir archivos

```http
POST /files/upload
```

Este endpoint recibe uno o más archivos desde el frontend y los almacena en el bucket S3 de LocalStack.

### Obtener archivos recientes

```http
GET /files/recent
```

Este endpoint retorna los últimos 3 archivos cargados.

ó

```http
GET /files/recent?limit=12
```

la cantidad de archivos con limite definido también, 12 sólo es un ejemplo.

### Descargar archivo

```http
GET /files/download/{key}
```

## Variables de entorno

El proyecto utiliza variables de entorno para configurar la conexión del backend con LocalStack S3.

### Backend

| Variable | Descripción | Valor en Docker |
|---|---|---|
| `S3_ENDPOINT` | Endpoint del servicio S3 utilizado por el backend | `http://localstack:4566` |

En `docker-compose.yml` ya viene configurada:

```yml
environment:
  - S3_ENDPOINT=http://localstack:4566
```
---

## Autor

Diego Veliz

Repositorio desarrollado para actividad académica utilizando Docker, Terraform y LocalStack.
