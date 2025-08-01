# Guía de Despliegue - Entorno de Desarrollo

Esta guía explica cómo configurar y ejecutar la aplicación Selene en un entorno de desarrollo local.

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm (viene incluido con Node.js)
- MongoDB (local o conexión a base de datos remota)
- Git

## 🚀 Pasos de Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/teoeme/selene
cd selene
```

### 2. Configurar el Backend

#### Instalar Dependencias
```bash
npm install
```

#### Configurar Variables de Entorno
1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```

2. Crea el archivo de configuración basándote en el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
   
3. Edita el archivo `.env` con tus configuraciones locales:
   - Configuración de base de datos MongoDB
   - Puerto del servidor
   - Secretos JWT
   - Otras variables específicas del entorno

#### Iniciar el Backend
```bash
npm run dev
```

#### Datos de Prueba (Opcional)
Para agregar datos de prueba a la base de datos:
```bash
npm run seed:dev
```

### 3. Configurar el Frontend

#### Instalar Dependencias
```bash
cd frontend
npm install
```

#### Configurar Variables de Entorno
1. Crea el archivo de configuración basándote en el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` con la URL del backend local (generalmente `http://localhost:3000`)

#### Iniciar el Frontend
```bash
npm run dev
```

### 4. Acceder a la Aplicación

Una vez que tanto el backend como el frontend estén ejecutándose:

- **Frontend**: Abre tu navegador y ve a `http://localhost:5173` (o el puerto que indique Vite)
- **Backend API**: Disponible en `http://localhost:3000` (o el puerto configurado)

## Comandos Útiles

### Backend
- `npm run dev` - Ejecutar en modo desarrollo con hot reload
- `npm run build` - Compilar el proyecto
- `npm run test` - Ejecutar tests
- `npm run seed:dev` - Poblar la base de datos con datos de prueba

### Frontend
- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Compilar para producción
- `npm run preview` - Vista previa de la versión compilada

