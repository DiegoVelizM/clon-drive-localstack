# Clon de Drive con LocalStack

## Descripción

Aplicación web que permite cargar, visualizar y descargar archivos utilizando un almacenamiento tipo Amazon S3 emulado localmente mediante LocalStack.

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

---

## Requisitos

* Docker Desktop
* Terraform
* Git

---

## Ejecución

### 1. Clonar repositorio

```bash
git clone <url-del-repositorio>
cd clon-drive-localstack
```

### 2. Crear infraestructura

```bash
cd infra
terraform init
terraform apply
```

### 3. Levantar servicios

Desde la raíz:

```bash
docker compose up -d --build
```

---

## Acceso

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:3001
```

---

## Endpoints

### Subir archivos

```http
POST /files/upload
```

### Obtener archivos recientes

```http
GET /files/recent
```

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

---

## Autor

Diego Veliz

Repositorio desarrollado para actividad académica utilizando Docker, Terraform y LocalStack.
