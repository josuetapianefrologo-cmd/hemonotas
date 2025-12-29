// ============================================================================
// HemoNotas Backend - API Server
// Sistema de Notas de Hemodiálisis con integración HemoHL7
// Dr. Josué Wigberto Tapia López - CMN Bajío IMSS
// ============================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'hemonotas-secret-key-change-in-production';

// ============================================================================
// BASE DE DATOS EN MEMORIA (Para desarrollo - usar PostgreSQL en producción)
// ============================================================================

const db = {
  users: [
    {
      id: '1',
      email: 'jtapia@alba.com',
      password: '$2a$10$xVWsXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // "alba10*" hasheado
      name: 'Dr. Josué Wigberto Tapia López',
      cedula: '9940966',
      clinica_id: 'alba_centro',
      hemohl7_user: 'JTAPIA',
      hemohl7_pass_encrypted: '', // Se encripta al guardar
      created_at: new Date()
    }
  ],
  pacientes: [],
  notas: [],
  queue: [], // Cola de notas pendientes para subir a HemoHL7
  sessions: {} // Sesiones activas de HemoHL7
};

// Clínicas disponibles
const CLINICAS = {
  'alba_centro': { id: 'alba_centro', nombre: 'ALBA LEÓN CENTRO', hemohl7_value: '2' },
  'alba_brisas': { id: 'alba_brisas', nombre: 'ALBA MÉDICA BRISAS', hemohl7_value: '3' },
  'alba_dolores': { id: 'alba_dolores', nombre: 'ALBA DOLORES HIDALGO', hemohl7_value: '1' },
  'renalmedic': { id: 'renalmedic', nombre: 'RENALMEDIC LEÓN', hemohl7_value: '0' }
};

// Selectores de HemoHL7 (extraídos de conversaciones previas)
const HEMOHL7_SELECTORS = {
  // Login
  frame: 'mainFrame',
  usuario: { id: 'USUARIO', name: 'USUARIO', class: 'USUARIOCSS' },
  password: { id: 'PASSWORD', name: 'PASSWORD' },
  btnEntrar: { name: 'cmdEntrar', id: 'cmdEntrar' },
  
  // Selector de clínica
  clinica: { id: 'IWCOMBOBOX1', name: 'IWCOMBOBOX1' },
  
  // Buscar paciente
  btnBuscar: { id: 'BUSCARPAC', name: 'BUSCARPAC' },
  campoBusqueda: { id: 'IWEDIT1', name: 'IWEDIT1' },
  btnMostrar: { id: 'MOSTRAR', name: 'MOSTRAR' },
  btnAceptar: { id: 'ACEPTAR', name: 'ACEPTAR' },
  
  // Notas médicas
  btnNotasMedicas: { id: 'EVOLUCIONREPMED', name: 'EVOLUCIONREPMED' },
  btnNueva: { id: 'NUEVA', name: 'NUEVA', class: 'NUEVACSS' },
  tipoNota: { id: 'TIPOCB', name: 'TIPOCB' }, // value=1 para Evolución
  textareaNota: { id: 'IWDBMEMO1', name: 'IWDBMEMO1' },
  btnGuardar: { id: 'ACEPTAR', name: 'ACEPTAR', class: 'ACEPTARCSS' },
  
  // Logo
  logo: { id: 'LOGOCLIN', class: 'LOGOCLINCSS' }
};

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// ============================================================================
// RUTAS - AUTENTICACIÓN
// ============================================================================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // En desarrollo, aceptar cualquier credencial
    if (process.env.NODE_ENV !== 'production') {
      const token = jwt.sign(
        { id: '1', email, name: 'Dr. Demo', clinica_id: 'alba_centro' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      return res.json({
        success: true,
        token,
        user: { id: '1', email, name: 'Dr. Demo', clinica_id: 'alba_centro' }
      });
    }
    
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, clinica_id: user.clinica_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, clinica_id: user.clinica_id }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Verificar token
app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ============================================================================
// RUTAS - PACIENTES
// ============================================================================

// Listar pacientes
app.get('/api/pacientes', authMiddleware, (req, res) => {
  const pacientes = db.pacientes.filter(p => p.clinica_id === req.user.clinica_id);
  res.json({ pacientes });
});

// Crear/actualizar paciente
app.post('/api/pacientes', authMiddleware, (req, res) => {
  const { expediente, nombre, datos } = req.body;
  
  let paciente = db.pacientes.find(p => p.expediente === expediente);
  
  if (paciente) {
    // Actualizar
    Object.assign(paciente, { nombre, ...datos, updated_at: new Date() });
  } else {
    // Crear
    paciente = {
      id: uuidv4(),
      expediente,
      nombre,
      clinica_id: req.user.clinica_id,
      ...datos,
      created_at: new Date(),
      updated_at: new Date()
    };
    db.pacientes.push(paciente);
  }
  
  res.json({ success: true, paciente });
});

// Obtener paciente por expediente
app.get('/api/pacientes/:expediente', authMiddleware, (req, res) => {
  const paciente = db.pacientes.find(p => p.expediente === req.params.expediente);
  if (!paciente) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }
  res.json({ paciente });
});

// ============================================================================
// RUTAS - NOTAS
// ============================================================================

// Listar notas (pendientes y subidas)
app.get('/api/notas', authMiddleware, (req, res) => {
  const { status, expediente } = req.query;
  
  let notas = db.notas.filter(n => n.user_id === req.user.id);
  
  if (status) {
    notas = notas.filter(n => n.status === status);
  }
  
  if (expediente) {
    notas = notas.filter(n => n.expediente === expediente);
  }
  
  res.json({ notas });
});

// Crear nota (guardar en cola)
app.post('/api/notas', authMiddleware, (req, res) => {
  const { expediente, paciente_nombre, contenido, fecha, clinica_id } = req.body;
  
  const nota = {
    id: uuidv4(),
    user_id: req.user.id,
    expediente,
    paciente_nombre,
    contenido,
    fecha: fecha || new Date().toISOString().split('T')[0],
    clinica_id: clinica_id || req.user.clinica_id,
    status: 'pending', // pending, uploading, uploaded, error
    error_message: null,
    hemohl7_id: null,
    created_at: new Date(),
    uploaded_at: null
  };
  
  db.notas.push(nota);
  
  // Notificar por WebSocket
  io.to(req.user.id).emit('nota_created', nota);
  
  res.json({ success: true, nota });
});

// Actualizar nota
app.put('/api/notas/:id', authMiddleware, (req, res) => {
  const nota = db.notas.find(n => n.id === req.params.id && n.user_id === req.user.id);
  
  if (!nota) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }
  
  const { contenido, fecha } = req.body;
  
  if (nota.status === 'uploaded') {
    return res.status(400).json({ error: 'No se puede editar una nota ya subida' });
  }
  
  nota.contenido = contenido || nota.contenido;
  nota.fecha = fecha || nota.fecha;
  nota.updated_at = new Date();
  
  res.json({ success: true, nota });
});

// Eliminar nota
app.delete('/api/notas/:id', authMiddleware, (req, res) => {
  const index = db.notas.findIndex(n => n.id === req.params.id && n.user_id === req.user.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }
  
  const nota = db.notas[index];
  
  if (nota.status === 'uploaded') {
    return res.status(400).json({ error: 'No se puede eliminar una nota ya subida' });
  }
  
  db.notas.splice(index, 1);
  
  res.json({ success: true });
});

// ============================================================================
// RUTAS - COLA DE SUBIDA A HEMOHL7
// ============================================================================

// Agregar notas a la cola de subida
app.post('/api/queue/add', authMiddleware, (req, res) => {
  const { nota_ids } = req.body;
  
  const notasToQueue = db.notas.filter(n => 
    nota_ids.includes(n.id) && 
    n.user_id === req.user.id && 
    n.status === 'pending'
  );
  
  if (notasToQueue.length === 0) {
    return res.status(400).json({ error: 'No hay notas válidas para subir' });
  }
  
  // Agregar a la cola
  const queueItem = {
    id: uuidv4(),
    user_id: req.user.id,
    notas: notasToQueue.map(n => n.id),
    clinica_id: notasToQueue[0].clinica_id,
    status: 'queued', // queued, processing, completed, error
    progress: 0,
    total: notasToQueue.length,
    created_at: new Date(),
    started_at: null,
    completed_at: null
  };
  
  db.queue.push(queueItem);
  
  // Marcar notas como "en cola"
  notasToQueue.forEach(n => n.status = 'queued');
  
  // Notificar por WebSocket
  io.to(req.user.id).emit('queue_updated', queueItem);
  
  res.json({ success: true, queue_item: queueItem });
});

// Obtener estado de la cola
app.get('/api/queue/status', authMiddleware, (req, res) => {
  const queueItems = db.queue.filter(q => q.user_id === req.user.id);
  res.json({ queue: queueItems });
});

// ============================================================================
// RUTAS - CONFIGURACIÓN HEMOHL7
// ============================================================================

// Guardar credenciales HemoHL7
app.post('/api/hemohl7/credentials', authMiddleware, (req, res) => {
  const { hemohl7_user, hemohl7_pass } = req.body;
  
  // En producción, encriptar la contraseña
  const user = db.users.find(u => u.id === req.user.id);
  if (user) {
    user.hemohl7_user = hemohl7_user;
    user.hemohl7_pass_encrypted = hemohl7_pass; // TODO: Encriptar
  }
  
  res.json({ success: true });
});

// Test de conexión HemoHL7
app.post('/api/hemohl7/test', authMiddleware, async (req, res) => {
  const { hemohl7_user, hemohl7_pass, clinica_id } = req.body;
  
  // TODO: Implementar test real con Puppeteer
  // Por ahora, simular respuesta
  
  res.json({
    success: true,
    message: 'Conexión exitosa (simulada)',
    clinica: CLINICAS[clinica_id]?.nombre || 'Desconocida'
  });
});

// Obtener selectores HemoHL7 (para debug)
app.get('/api/hemohl7/selectors', authMiddleware, (req, res) => {
  res.json({ selectors: HEMOHL7_SELECTORS });
});

// ============================================================================
// RUTAS - CLÍNICAS
// ============================================================================

app.get('/api/clinicas', (req, res) => {
  res.json({ clinicas: Object.values(CLINICAS) });
});

// ============================================================================
// WEBSOCKET - TIEMPO REAL
// ============================================================================

io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);
  
  // Autenticar socket
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.join(decoded.id); // Unir al room del usuario
      socket.user = decoded;
      socket.emit('authenticated', { success: true });
      console.log(`✅ Usuario ${decoded.email} autenticado en WebSocket`);
    } catch (error) {
      socket.emit('authenticated', { success: false, error: 'Token inválido' });
    }
  });
  
  // Suscribirse a actualizaciones de nota específica
  socket.on('subscribe_nota', (nota_id) => {
    socket.join(`nota_${nota_id}`);
  });
  
  // Suscribirse a actualizaciones de cola
  socket.on('subscribe_queue', (queue_id) => {
    socket.join(`queue_${queue_id}`);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Cliente desconectado:', socket.id);
  });
});

// Función para emitir progreso de subida
function emitUploadProgress(userId, queueId, progress, message) {
  io.to(userId).emit('upload_progress', { queue_id: queueId, progress, message });
  io.to(`queue_${queueId}`).emit('progress', { progress, message });
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    db: {
      users: db.users.length,
      pacientes: db.pacientes.length,
      notas: db.notas.length,
      queue: db.queue.length
    }
  });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    🩺 HemoNotas Backend v2.0                   ║
╠════════════════════════════════════════════════════════════════╣
║  Servidor:     http://localhost:${PORT}                          ║
║  WebSocket:    ws://localhost:${PORT}                            ║
║  Health:       http://localhost:${PORT}/api/health               ║
╠════════════════════════════════════════════════════════════════╣
║  Dr. Josué Wigberto Tapia López - CMN Bajío IMSS               ║
╚════════════════════════════════════════════════════════════════╝
  `);
});

// Export para workers
module.exports = { db, HEMOHL7_SELECTORS, CLINICAS, emitUploadProgress, io };
