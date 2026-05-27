# SmartVET - Plataforma de Rutas de Aprendizaje

Plataforma web para la generación de rutas de aprendizaje personalizadas para estudiantes de la ESFOT, impulsada por inteligencia artificial.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19 + Vite + Tailwind CSS v4 |
| **Backend** | Node.js + Express 5 |
| **Base de datos** | PostgreSQL (Supabase) + Prisma ORM |
| **Autenticación** | JWT + bcrypt |
| **Correos** | Nodemailer (Gmail SMTP) |

## Requisitos previos

- Node.js 18+
- npm 9+
- Una cuenta en [Supabase](https://supabase.com) (o cualquier PostgreSQL)

## Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd ProyectoWeb
```

## Configuración del Backend

```bash
cd Backend
npm install
```

### Variables de entorno

Copia el archivo `.env.example` (o crea uno nuevo) con la siguiente estructura:

```env
DATABASE_URL="postgresql://usuario:password@host:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://usuario:password@host:5432/postgres"
JWT_SECRET="supersecret"
PORT=3000
SMTP_USER="tucorreo@gmail.com"
SMTP_PASS="tu-app-password-gmail"
FRONTEND_URL="http://localhost:5173"
```

> **Nota:** `SMTP_PASS` no es la contraseña de Gmail, es un **App Password** que se genera en la configuración de seguridad de Google.

### Generar Prisma Client y sincronizar BD

```bash
npx prisma generate
npx prisma db push
```

### Ejecutar Backend

```bash
npm run dev
```

El servidor se inicia en **http://localhost:3000**

## Configuración del Frontend

```bash
cd Frontend
npm install
```

### Variables de entorno

Crea un archivo `.env` con:

```env
VITE_BACKEND_URL=http://localhost:3000/api
```

### Ejecutar Frontend

```bash
npm run dev
```

La aplicación se abre en **http://localhost:5173**

## Rutas del Frontend

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Landing page | Público |
| `/login` | Inicio de sesión | Público |
| `/register` | Registro de usuario | Público |
| `/confirm/:token` | Verificar cuenta | Público |
| `/forgot` | Recuperar contraseña | Público |
| `/reset-password/:token` | Restablecer contraseña | Público |
| `/dashboard` | Panel principal | Privado |
| `/profile` | Ver perfil | Privado |
| `/edit-profile` | Editar perfil | Privado |
| `/change-password` | Cambiar contraseña | Privado |

## Endpoints de la API

| Método | Ruta | Auth | Descripción |
|--------|------|:----:|-------------|
| POST | `/api/auth/register` | ❌ | Registro de usuario |
| GET | `/api/auth/verify/:token` | ❌ | Verificar cuenta |
| POST | `/api/auth/login` | ❌ | Inicio de sesión |
| POST | `/api/auth/forgot-password` | ❌ | Solicitar recuperación |
| POST | `/api/auth/reset-password/:token` | ❌ | Restablecer contraseña |
| GET | `/api/auth/profile` | ✅ | Obtener perfil |
| PUT | `/api/auth/profile` | ✅ | Actualizar perfil |
| PUT | `/api/auth/change-password` | ✅ | Cambiar contraseña |

## Comandos útiles

### Backend
```bash
npm run dev    # Desarrollo con nodemon (hot reload)
npm start      # Producción
```

### Frontend
```bash
npm run dev    # Desarrollo con Vite
npm run build  # Build de producción
npm run lint   # Verificar código
```
