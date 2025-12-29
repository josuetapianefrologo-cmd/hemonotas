# 🩺 HemoNotas v2.0 - Guía de Despliegue

Sistema de Notas de Hemodiálisis con integración HemoHL7 para múltiples usuarios.

## 📊 Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                        │
│         React App - Soporta usuarios ilimitados             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Médico 1│ │ Médico 2│ │ Médico 3│ │   ...   │  8-10+    │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
└───────┼───────────┼───────────┼───────────┼─────────────────┘
        │           │           │           │
        └───────────┴─────┬─────┴───────────┘
                          │ WebSocket + REST API
┌─────────────────────────┼───────────────────────────────────┐
│           RAILWAY (Backend + Workers)                       │
│                         ▼                                   │
│  ┌──────────────────────────────────────┐                  │
│  │     Express API + Socket.IO          │                  │
│  │   - Autenticación JWT                │                  │
│  │   - Cola de notas                    │                  │
│  │   - WebSocket tiempo real            │                  │
│  └──────────────────────────────────────┘                  │
│                         │                                   │
│  ┌──────────────────────┼──────────────────────┐           │
│  │         Puppeteer Workers (x4)              │           │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│           │
│  │  │Alba Ctr│ │Alba Brs│ │Alba Dol│ │Renalmed││           │
│  │  └────────┘ └────────┘ └────────┘ └────────┘│           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
                    ┌──────────┐
                    │ HemoHL7  │
                    │  Server  │
                    └──────────┘
```

## 🚀 Paso 1: Desplegar Backend en Railway

### 1.1 Crear repositorio en GitHub

```bash
# En la carpeta backend/
cd backend
git init
git add .
git commit -m "🩺 HemoNotas Backend v2.0"

# Crear repo en GitHub (manual o con gh cli)
gh repo create hemonotas-backend --private --source=. --push
# O manualmente:
git remote add origin https://github.com/TU_USUARIO/hemonotas-backend.git
git branch -M main
git push -u origin main
```

### 1.2 Configurar Railway

1. Ve a [railway.app](https://railway.app)
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza y selecciona `hemonotas-backend`
5. Railway detectará el Dockerfile automáticamente

### 1.3 Configurar Variables de Entorno en Railway

En la sección **Variables**, agregar:

| Variable | Valor |
|----------|-------|
| `PORT` | `3001` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `tu-clave-secreta-muy-larga-cambiar-esto` |
| `FRONTEND_URL` | `https://hemonotas.vercel.app` (URL de Vercel) |
| `HEMOHL7_USER` | `JTAPIA` (o tu usuario) |
| `HEMOHL7_PASS` | `tu_password` |
| `HEADLESS` | `true` |

### 1.4 Obtener URL del Backend

Una vez desplegado, Railway te dará una URL como:
```
https://hemonotas-backend-production.up.railway.app
```

Copia esta URL para el siguiente paso.

---

## 🌐 Paso 2: Desplegar Frontend en Vercel

### 2.1 Crear repositorio en GitHub

```bash
# En la carpeta frontend/
cd frontend
git init
git add .
git commit -m "🩺 HemoNotas Frontend v2.0"

gh repo create hemonotas --public --source=. --push
# O manualmente:
git remote add origin https://github.com/TU_USUARIO/hemonotas.git
git branch -M main
git push -u origin main
```

### 2.2 Configurar Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Add New Project"**
3. Importa el repositorio `hemonotas`
4. En **Environment Variables**, agregar:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://hemonotas-backend-production.up.railway.app` |

5. Click en **"Deploy"**

### 2.3 URL Final

Vercel te dará una URL como:
```
https://hemonotas.vercel.app
```

---

## 🔗 Paso 3: Conectar Frontend con Backend

### 3.1 Actualizar CORS en Railway

En las variables de Railway, actualizar:
```
FRONTEND_URL=https://hemonotas.vercel.app
```

### 3.2 (Opcional) Dominio Personalizado

**En Vercel:**
1. Settings → Domains
2. Agregar tu dominio: `notas.clinicaalba.com`
3. Configurar DNS según instrucciones

**En Railway:**
1. Settings → Domains
2. Agregar: `api.clinicaalba.com`
3. Configurar DNS

---

## 👥 Capacidad Multi-Usuario

| Componente | Capacidad | Notas |
|------------|-----------|-------|
| Frontend (Vercel) | Ilimitado | Cada navegador es independiente |
| Backend API (Railway) | 50+ conexiones | WebSocket para tiempo real |
| Workers HemoHL7 | 4 paralelos | 1 por clínica, configurables |

### Escalar Workers

Si necesitas más capacidad, en Railway puedes crear múltiples instancias del worker:

```bash
# En railway.json, agregar servicio adicional
{
  "services": {
    "api": { ... },
    "worker-alba": { "command": "node workers/hemohl7-worker.js" },
    "worker-renal": { "command": "node workers/hemohl7-worker.js" }
  }
}
```

---

## 🔧 Selectores HemoHL7 (Referencia)

Estos selectores fueron extraídos de conversaciones previas y están implementados en el worker:

```javascript
// LOGIN
usuario: '#USUARIO, input[name="USUARIO"]'
password: '#PASSWORD, input[name="PASSWORD"]'
btnEntrar: 'input[name="cmdEntrar"]'

// CLÍNICA
clinicaSelect: '#IWCOMBOBOX1'
// Valores: 0=Renalmedic, 1=Alba Dolores, 2=Alba Centro, 3=Alba Brisas

// BUSCAR PACIENTE
btnBuscar: '#BUSCARPAC'
campoBusqueda: '#IWEDIT1'
btnMostrar: '#MOSTRAR'
btnAceptar: '#ACEPTAR'

// NOTAS MÉDICAS
btnNotasMedicas: '#EVOLUCIONREPMED'
btnNueva: '#NUEVA'
tipoNota: '#TIPOCB' (value=1 para Evolución)
textareaNota: '#IWDBMEMO1'
btnGuardar: '#ACEPTAR'
```

---

## 🧪 Testing Local

### Backend
```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
# Editar con VITE_API_URL=http://localhost:3001
npm install
npm run dev
```

### Test de Worker
```bash
cd backend
HEMOHL7_USER=JTAPIA HEMOHL7_PASS=tu_pass node workers/hemohl7-worker.js
```

---

## 📱 Uso de la Aplicación

### Flujo Normal
1. **Login**: Ingresar credenciales (se validan con el backend)
2. **Seleccionar clínica**: Alba Centro, Brisas, Dolores, o Renalmedic
3. **Seleccionar paciente**: Buscar por expediente o nombre
4. **Llenar nota**: Completar el formulario de hemodiálisis
5. **Generar nota**: Previsualizar y confirmar
6. **Cola de pendientes**: Las notas se guardan localmente
7. **Subir a HemoHL7**: Click en "Subir a HemoHL7" cuando haya conexión

### Modo Offline
- La app funciona sin conexión al backend
- Las notas se guardan localmente
- Se sincronizan automáticamente cuando hay conexión

### Indicadores de Estado
- 🟢 Verde: Conectado al servidor
- 🟠 Naranja: Modo offline
- Barra de progreso: Subida a HemoHL7 en curso

---

## 🔒 Seguridad

- JWT para autenticación (expira en 24h)
- CORS configurado solo para el frontend
- Credenciales HemoHL7 encriptadas en el servidor
- HTTPS obligatorio en producción
- WebSocket autenticado

---

## 📞 Soporte

**Desarrollado por:**
Dr. Josué Wigberto Tapia López
Nefrólogo - Centro Médico Nacional del Bajío, IMSS

---

## 📝 Checklist de Despliegue

- [ ] Backend en Railway desplegado
- [ ] Variables de entorno configuradas en Railway
- [ ] URL del backend obtenida
- [ ] Frontend en Vercel desplegado
- [ ] VITE_API_URL configurado en Vercel
- [ ] FRONTEND_URL actualizado en Railway
- [ ] Test de login exitoso
- [ ] Test de subida a HemoHL7 exitoso
- [ ] (Opcional) Dominio personalizado configurado
