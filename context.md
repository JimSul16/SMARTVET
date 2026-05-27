# SmartVET - Contexto del Proyecto

## Información general

- **Proyecto:** Plataforma de Rutas de Aprendizaje - ESFOT
- **Stack:** Node.js + Express 5 + Prisma + PostgreSQL (Supabase) | React 19 + Vite + Tailwind v4
- **Repositorio:** `C:\Users\Asus Tuf\Documents\Sprint\ProyectoWeb`

---

## Sprint 1 - Módulo de Autenticación

### Backend (`Backend/`)

#### Comandos
```bash
cd Backend
npm run dev    # nodemon src/server.js (puerto 3000)
npm start      # node src/server.js
```

#### Estructura
```
Backend/
├── src/
│   ├── controllers/
│   │   └── auth.controller.js      # Lógica de cada endpoint
│   ├── middlewares/
│   │   └── auth.middleware.js       # verifyToken (JWT)
│   ├── routes/
│   │   └── auth.routes.js           # Definición de rutas
│   ├── services/
│   │   ├── auth.service.js          # Lógica de registro (Prisma + bcrypt)
│   │   └── email.service.js         # Nodemailer (Gmail SMTP)
│   └── server.js                    # Entry point (Express + CORS + dotenv)
├── prisma/
│   └── schema.prisma                # Modelo User
├── .env                             # Variables de entorno
└── package.json
```

#### Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|:----:|-------------|
| POST | `/api/auth/register` | ❌ | Registro con firstName, lastName, email (@epn.edu.ec), password (min 8) |
| GET | `/api/auth/verify/:token` | ❌ | Verificar cuenta por token |
| POST | `/api/auth/login` | ❌ | Login email+password → devuelve JWT + user |
| POST | `/api/auth/forgot-password` | ❌ | Envía correo con link de recuperación |
| POST | `/api/auth/reset-password/:token` | ❌ | Restablece contraseña (valida expiración 1h) |
| GET | `/api/auth/profile` | ✅ | Perfil del usuario autenticado |
| PUT | `/api/auth/profile` | ✅ | Actualizar perfil (firstName, lastName, learningStyle, currentSemester) |
| PUT | `/api/auth/change-password` | ✅ | Cambiar contraseña (requiere currentPassword + newPassword) |

#### Middleware de autenticación
- `verifyToken` en `auth.middleware.js` — extrae token del header `Authorization: Bearer <token>`, verifica con `JWT_SECRET`, inyecta `req.user = { id, role }`
- Token JWT expira en 7 días (`expiresIn: '7d'`)
- **No hay middleware de roles** — todos los usuarios autenticados tienen el mismo nivel de acceso

#### Modelo User (Prisma)
```prisma
model User {
  id                Int       @id @default(autoincrement())
  firstName         String    @db.VarChar(50)
  lastName          String    @db.VarChar(50)
  email             String    @unique @db.VarChar(100)
  password          String
  role              Role      @default(STUDENT)     // STUDENT | ADMIN
  isVerified        Boolean   @default(false)
  verificationToken String?   @unique
  resetToken        String?   @unique
  resetTokenExpires DateTime?
  learningStyle     String?   @db.VarChar(50)       // VISUAL | AUDITIVO | KINESTESICO | LECTURA
  currentSemester   Int?      @default(1)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

#### Variables de entorno (`.env`)
```
DATABASE_URL      # PostgreSQL connection string (Supabase)
DIRECT_URL        # Direct connection string
JWT_SECRET        # Clave secreta para firmar JWT
PORT=3000
SMTP_USER         # Correo Gmail para envío
SMTP_PASS         # App password de Gmail
FRONTEND_URL      # http://localhost:5173
```

---

### Frontend (`Frontend/`)

#### Comandos
```bash
cd Frontend
npm run dev      # Vite dev server (puerto 5173)
npm run build    # Build producción
npm run lint     # ESLint
```

#### Estructura
```
Frontend/
├── src/
│   ├── api/
│   │   ├── client.js               # Axios instance (no usado actualmente)
│   │   └── authService.js          # Cliente HTTP para auth
│   ├── context/
│   │   └── AuthProvider.jsx        # AuthContext (token + user en localStorage)
│   ├── hooks/
│   │   └── useFetch.js             # Hook genérico con axios + toast + auth header
│   ├── pages/
│   │   ├── Landing.jsx             # Página de inicio (pública)
│   │   ├── Login.jsx               # Inicio de sesión
│   │   ├── Register.jsx            # Registro
│   │   ├── Confirm.jsx             # Verificación de cuenta
│   │   ├── Forgot.jsx              # Recuperación de contraseña
│   │   ├── Reset.jsx               # Restablecer contraseña
│   │   ├── Dashboard.jsx           # Panel principal (protegido)
│   │   ├── Profile.jsx             # Ver perfil (protegido)
│   │   ├── EditProfile.jsx         # Editar perfil (protegido)
│   │   └── ChangePassword.jsx      # Cambiar contraseña (protegido)
│   ├── routes/
│   │   ├── PrivateRoute.jsx        # Redirige a /login si no hay token
│   │   └── PublicRoute.jsx         # Redirige a /dashboard si hay token
│   ├── App.jsx                     # Router principal
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Tailwind v4 + animación fade-in-up
├── index.html
├── .env                            # VITE_BACKEND_URL=http://localhost:3000/api
├── vite.config.js
├── tailwind.config.js              # Obsoleto (Tailwind v4 usa CSS)
├── postcss.config.js
├── eslint.config.js
└── package.json
```

#### Rutas del frontend

| Ruta | Componente | Acceso |
|------|-----------|--------|
| `/` | Landing | Público |
| `/login` | Login | Público (redirige a /dashboard si ya autenticado) |
| `/register` | Register | Público (redirige a /dashboard si ya autenticado) |
| `/forgot` | Forgot | Público |
| `/reset-password/:token` | Reset | Público |
| `/confirm/:token` | Confirm | Público |
| `/dashboard` | Dashboard | Privado (requiere token) |
| `/profile` | Profile | Privado |
| `/edit-profile` | EditProfile | Privado |
| `/change-password` | ChangePassword | Privado |
| `/*` | 404 | Público |

#### Contexto de autenticación (`AuthProvider`)
- Al iniciar la app, lee `token` y `user` de `localStorage` de forma lazy en `useState`
- `loginAuth(token, user)` → guarda en localStorage y estado
- `logoutAuth()` → limpia localStorage y estado
- `auth` = `{ token, user }` o `{}`

#### Hook `useFetch`
```js
const { fetchDataBackend, loading } = useFetch();
fetchDataBackend(url, data, method, headers);
// Automáticamente: agrega VITE_BACKEND_URL, auth header con token, toasts
```

---

### Dependencias

**Backend:** `@prisma/client`, `bcrypt`, `cors`, `dotenv`, `express`, `jsonwebtoken`, `nodemailer`, `prisma`
**Frontend:** `axios`, `react`, `react-dom`, `react-hook-form`, `react-icons`, `react-router-dom`, `react-toastify`

---

### Lo que falta para próximos sprints
- Middleware de roles (ADMIN vs STUDENT)
- CRUD de rutas de aprendizaje
- Test de estilo de aprendizaje
- Páginas de learning paths
- Manejo de 401 en frontend (logout automático si token expira)
