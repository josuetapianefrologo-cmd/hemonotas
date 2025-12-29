// ============================================================================
// HemoNotas API Client
// Maneja comunicación con el backend y WebSocket
// ============================================================================

import { io } from 'socket.io-client';

// URL del backend (se configura en vite.config.js o .env)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ============================================================================
// CLASE PRINCIPAL DEL API CLIENT
// ============================================================================

class HemoNotasAPI {
  constructor() {
    this.token = localStorage.getItem('hemonotas_token');
    this.socket = null;
    this.listeners = {};
  }

  // ==========================================================================
  // AUTENTICACIÓN
  // ==========================================================================

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('hemonotas_token', token);
    } else {
      localStorage.removeItem('hemonotas_token');
    }
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token;
  }

  async login(email, password) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.success && response.token) {
      this.setToken(response.token);
      this.connectSocket();
    }
    
    return response;
  }

  logout() {
    this.setToken(null);
    this.disconnectSocket();
  }

  async verifyToken() {
    if (!this.token) return { valid: false };
    
    try {
      const response = await this.request('/api/auth/verify');
      return response;
    } catch (error) {
      this.setToken(null);
      return { valid: false };
    }
  }

  // ==========================================================================
  // HTTP REQUESTS
  // ==========================================================================

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ==========================================================================
  // PACIENTES
  // ==========================================================================

  async getPacientes() {
    return this.request('/api/pacientes');
  }

  async getPaciente(expediente) {
    return this.request(`/api/pacientes/${expediente}`);
  }

  async savePaciente(pacienteData) {
    return this.request('/api/pacientes', {
      method: 'POST',
      body: JSON.stringify(pacienteData)
    });
  }

  // ==========================================================================
  // NOTAS
  // ==========================================================================

  async getNotas(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/api/notas?${params}`);
  }

  async createNota(notaData) {
    return this.request('/api/notas', {
      method: 'POST',
      body: JSON.stringify(notaData)
    });
  }

  async updateNota(notaId, notaData) {
    return this.request(`/api/notas/${notaId}`, {
      method: 'PUT',
      body: JSON.stringify(notaData)
    });
  }

  async deleteNota(notaId) {
    return this.request(`/api/notas/${notaId}`, {
      method: 'DELETE'
    });
  }

  // ==========================================================================
  // COLA DE SUBIDA A HEMOHL7
  // ==========================================================================

  async addToQueue(notaIds) {
    return this.request('/api/queue/add', {
      method: 'POST',
      body: JSON.stringify({ nota_ids: notaIds })
    });
  }

  async getQueueStatus() {
    return this.request('/api/queue/status');
  }

  // ==========================================================================
  // HEMOHL7
  // ==========================================================================

  async saveHemoHL7Credentials(credentials) {
    return this.request('/api/hemohl7/credentials', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async testHemoHL7Connection(credentials) {
    return this.request('/api/hemohl7/test', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  // ==========================================================================
  // CLÍNICAS
  // ==========================================================================

  async getClinicas() {
    return this.request('/api/clinicas');
  }

  // ==========================================================================
  // WEBSOCKET
  // ==========================================================================

  connectSocket() {
    if (this.socket?.connected) return;

    this.socket = io(API_URL, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('🔌 WebSocket conectado');
      if (this.token) {
        this.socket.emit('authenticate', this.token);
      }
    });

    this.socket.on('authenticated', (data) => {
      if (data.success) {
        console.log('✅ WebSocket autenticado');
      } else {
        console.error('❌ Error autenticando WebSocket:', data.error);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 WebSocket desconectado');
    });

    // Eventos de notas
    this.socket.on('nota_created', (nota) => {
      this.emit('nota_created', nota);
    });

    this.socket.on('nota_updated', (nota) => {
      this.emit('nota_updated', nota);
    });

    // Eventos de cola/subida
    this.socket.on('queue_updated', (queueItem) => {
      this.emit('queue_updated', queueItem);
    });

    this.socket.on('upload_progress', (data) => {
      this.emit('upload_progress', data);
    });
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Event emitter simple
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(cb => cb(data));
  }
}

// Singleton
const api = new HemoNotasAPI();

export default api;
export { HemoNotasAPI, API_URL };
