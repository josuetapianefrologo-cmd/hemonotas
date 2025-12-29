# 🩺 HemoNotas v2.0 - Full Stack

Sistema completo de Notas de Hemodiálisis con integración automática a HemoHL7.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/Frontend-React_18-61dafb)
![Node](https://img.shields.io/badge/Backend-Node_20-339933)
![Puppeteer](https://img.shields.io/badge/Automation-Puppeteer-40B5A4)

---

## 📋 Características

### Frontend (Vercel)
- ✅ Generación de notas conforme a NOM-004-SSA3-2012
- ✅ Sistema de recetas médicas con logos embebidos
- ✅ Pre-carga de parámetros de sesión anterior
- ✅ Gestión de medicamentos del paciente
- ✅ Seguimiento de metas KDIGO
- ✅ Diseño responsivo (móvil, tablet, desktop)
- ✅ Soporte para **8-10 usuarios simultáneos**

### Backend (Railway)
- ✅ API REST para manejo de notas y pacientes
- ✅ WebSocket para actualizaciones en tiempo real
- ✅ Cola de trabajos para subida a HemoHL7
- ✅ Worker con Puppeteer para automatización
- ✅ JWT para autenticación segura

### Integración HemoHL7
- ✅ Login automático
- ✅ Selección de clínica
- ✅ Búsqueda de paciente por expediente
- ✅ Creación de notas de evolución
- ✅ Selección de fecha

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                 VERCEL (Frontend React)                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Médico 1│ │ Médico 2│ │ Médico 3│ │   ...   │  (8-10)   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
└───────┼───────────┼───────────┼───────────┼─────────────────┘
        │           │           │           │
        └───────────┴─────┬─────┴───────────┘
                          │ HTTPS/WSS
┌─────────────────────────┼───────────────────────────────────┐
│            RAILWAY (Backend Node.js)                        │
│                         ▼                                   │
│  ┌──────────────────────────────────────┐                  │
│  │     Express API + WebSocket          │                  │
│  │  • /api/auth     - Autenticación     │                  │
│  │  • /api/notas    - CRUD notas        │                  │
│  │  • /api/queue    - Cola de subida    │                  │
│  │  • /api/hemohl7  - Config HemoHL7    │                  │
│  └──────────────────────────────────────┘                  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────┐                  │
│  │     Worker Puppeteer (Chrome)        │                  │
│  │  • Login a HemoHL7                   │                  │
│  │  • Subir notas automáticamente       │                  │
│  │  • Reportar progreso via WebSocket   │                  │
│  └──────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
                 ┌──────────────┐
                 │   HemoHL7    │
                 │ (Web Server) │
                 └──────────────┘
```

---

## 🏥 Clínicas Configuradas

| ID | Clínica | HemoHL7 Value | Logo |
|----|---------|---------------|------|
| `alba_centro` | ALBA LEÓN CENTRO | 2 | ✅ |
| `alba_brisas` | ALBA MÉDICA BRISAS | 3 | ✅ |
| `alba_dolores` | ALBA DOLORES HIDALGO | 1 | ✅ |
| `renalmedic` | RENALMEDIC LEÓN | 0 | ✅ |

---

## 🚀 Despliegue Rápido

### Paso 1: Subir a GitHub

```bash
# Clonar o extraer el proyecto
cd hemonotas-full

# Inicializar repositorio
git init
git add .
git commit -m "🩺 HemoNotas v2.0 - Full Stack"

# Crear repos en GitHub (uno para frontend, uno para backend)
# O usar monorepo con subdirectorios
```

### Paso 2: Desplegar Frontend en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Import → Selecciona `frontend/`
3. Variables de entorno:
   ```
   VITE_API_URL=https://tu-backend.railway.app
   ```
4. Deploy

### Paso 3: Desplegar Backend en Railway

1. Ve a [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Selecciona `backend/`
4. Variables de entorno:
   ```
   NODE_ENV=production
   JWT_SECRET=tu-secreto-muy-seguro-aqui
   FRONTEND_URL=https://tu-frontend.vercel.app
   HEMOHL7_USER=JTAPIA
   HEMOHL7_PASS=tu_password
   ```
5. Deploy

---

## 💻 Desarrollo Local

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/verify` | Verificar token |

### Pacientes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pacientes` | Listar pacientes |
| GET | `/api/pacientes/:exp` | Obtener por expediente |
| POST | `/api/pacientes` | Crear/actualizar paciente |

### Notas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/notas` | Listar notas |
| POST | `/api/notas` | Crear nota |
| PUT | `/api/notas/:id` | Actualizar nota |
| DELETE | `/api/notas/:id` | Eliminar nota |

### Cola HemoHL7
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/queue/add` | Agregar notas a cola |
| GET | `/api/queue/status` | Estado de la cola |

### Configuración
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/clinicas` | Listar clínicas |
| POST | `/api/hemohl7/credentials` | Guardar credenciales |
| POST | `/api/hemohl7/test` | Probar conexión |

---

## 🔌 WebSocket Events

### Del servidor al cliente

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `nota_created` | `{ nota }` | Nueva nota creada |
| `nota_updated` | `{ nota }` | Nota actualizada |
| `queue_updated` | `{ queue_item }` | Cola actualizada |
| `upload_progress` | `{ queue_id, progress, message }` | Progreso de subida |

---

## 🔧 Selectores HemoHL7

Extraídos de conversaciones previas:

```javascript
// Login
USUARIO: '#USUARIO, input[name="USUARIO"]'
PASSWORD: '#PASSWORD, input[name="PASSWORD"]'
cmdEntrar: 'input[name="cmdEntrar"]'

// Clínica
IWCOMBOBOX1: '#IWCOMBOBOX1' // 0=Renalmedic, 1=Dolores, 2=Centro, 3=Brisas

// Buscar paciente
BUSCARPAC: '#BUSCARPAC'
IWEDIT1: '#IWEDIT1' // Campo de búsqueda
MOSTRAR: '#MOSTRAR'
ACEPTAR: '#ACEPTAR'

// Notas médicas
EVOLUCIONREPMED: '#EVOLUCIONREPMED'
NUEVA: '#NUEVA'
TIPOCB: '#TIPOCB' // value=1 para Evolución
IWDBMEMO1: '#IWDBMEMO1' // Textarea de la nota
ACEPTAR: '#ACEPTAR' // Guardar
```

---

## 📊 Capacidad para 8-10 usuarios

| Componente | Capacidad | Notas |
|------------|-----------|-------|
| Frontend (Vercel) | ∞ usuarios | CDN global, cada navegador es independiente |
| Backend API | ~100 req/s | Suficiente para 10 usuarios |
| WebSocket | ~100 conexiones | Sin problema |
| Worker HemoHL7 | Cola serializada | Una subida a la vez, pero procesa en background |

---

## 🛡️ Seguridad

- ✅ JWT para autenticación
- ✅ CORS configurado
- ✅ Helmet para headers seguros
- ✅ HTTPS obligatorio en producción

---

## 👨‍⚕️ Autor

**Dr. Josué Wigberto Tapia López**  
Nefrólogo - Centro Médico Nacional del Bajío, IMSS
