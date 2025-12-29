// ============================================================================
// HemoHL7 Worker - Robot para subir notas automáticamente
// Basado en los selectores extraídos de conversaciones previas
// Dr. Josué Wigberto Tapia López - CMN Bajío IMSS
// ============================================================================

require('dotenv').config();
const puppeteer = require('puppeteer');

// ============================================================================
// CONFIGURACIÓN DE HEMOHL7
// ============================================================================

const HEMOHL7_CONFIG = {
  baseUrl: 'https://www.hemohl7.com',
  timeout: 30000,
  navigationTimeout: 60000
};

// Selectores de HemoHL7 (extraídos de conversaciones previas)
const SELECTORS = {
  // Frame principal (a veces usa frames, a veces no)
  frame: 'mainFrame',
  
  // LOGIN
  usuario: '#USUARIO, input[name="USUARIO"], input.USUARIOCSS',
  password: '#PASSWORD, input[name="PASSWORD"]',
  btnEntrar: 'input[name="cmdEntrar"], #cmdEntrar',
  
  // SELECTOR DE CLÍNICA
  clinicaSelect: '#IWCOMBOBOX1, select[name="IWCOMBOBOX1"]',
  
  // BUSCAR PACIENTE
  btnBuscarPaciente: '#BUSCARPAC, input[name="BUSCARPAC"]',
  campoBusqueda: '#IWEDIT1, input[name="IWEDIT1"]',
  btnMostrar: '#MOSTRAR, input[name="MOSTRAR"]',
  btnAceptarBusqueda: '#ACEPTAR, input[name="ACEPTAR"]',
  
  // NOTAS MÉDICAS
  btnNotasMedicas: '#EVOLUCIONREPMED, input[name="EVOLUCIONREPMED"]',
  btnNuevaNota: '#NUEVA, input[name="NUEVA"], input.NUEVACSS',
  tipoNota: '#TIPOCB, select[name="TIPOCB"]',
  textareaNota: '#IWDBMEMO1, textarea[name="IWDBMEMO1"]',
  btnGuardarNota: '#ACEPTAR, input[name="ACEPTAR"], input.ACEPTARCSS',
  
  // Navegación
  btnRegresar: '#REGRESAR, input[name="REGRESAR"]'
};

// Valores de clínicas en HemoHL7
const CLINICA_VALUES = {
  'renalmedic': '0',
  'alba_dolores': '1',
  'alba_centro': '2',
  'alba_brisas': '3'
};

// ============================================================================
// CLASE PRINCIPAL DEL WORKER
// ============================================================================

class HemoHL7Worker {
  constructor() {
    this.browser = null;
    this.page = null;
    this.isLoggedIn = false;
    this.currentClinica = null;
    this.currentPatient = null;
  }

  /**
   * Inicializar navegador
   */
  async init() {
    console.log('🚀 Iniciando navegador...');
    
    this.browser = await puppeteer.launch({
      headless: process.env.HEADLESS !== 'false', // true por defecto en producción
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ],
      defaultViewport: { width: 1920, height: 1080 }
    });

    this.page = await this.browser.newPage();
    
    // Configurar timeouts
    this.page.setDefaultNavigationTimeout(HEMOHL7_CONFIG.navigationTimeout);
    this.page.setDefaultTimeout(HEMOHL7_CONFIG.timeout);
    
    // Interceptar diálogos (alertas)
    this.page.on('dialog', async dialog => {
      console.log(`📢 Alerta: ${dialog.message()}`);
      await dialog.accept();
    });

    console.log('✅ Navegador iniciado');
    return true;
  }

  /**
   * Cambiar al frame principal si existe
   */
  async switchToMainFrame() {
    try {
      // Primero, volver al contenido principal
      await this.page.mainFrame();
      
      // Intentar encontrar el frame "mainFrame"
      const frames = this.page.frames();
      const mainFrame = frames.find(f => f.name() === 'mainFrame');
      
      if (mainFrame) {
        console.log('🔄 Cambiando a mainFrame');
        return mainFrame;
      }
      
      // Si no hay frames, trabajar directamente con la página
      return this.page.mainFrame();
    } catch (error) {
      console.warn('⚠️ Error cambiando de frame:', error.message);
      return this.page.mainFrame();
    }
  }

  /**
   * Esperar y hacer clic en un elemento
   */
  async clickElement(selector, options = {}) {
    const frame = await this.switchToMainFrame();
    const timeout = options.timeout || 10000;
    
    try {
      await frame.waitForSelector(selector, { timeout, visible: true });
      await frame.click(selector);
      await this.wait(500);
      return true;
    } catch (error) {
      console.error(`❌ Error haciendo clic en ${selector}:`, error.message);
      return false;
    }
  }

  /**
   * Escribir en un campo
   */
  async typeInField(selector, text, options = {}) {
    const frame = await this.switchToMainFrame();
    const timeout = options.timeout || 10000;
    
    try {
      await frame.waitForSelector(selector, { timeout, visible: true });
      
      // Limpiar campo primero
      await frame.click(selector, { clickCount: 3 });
      await frame.keyboard.press('Backspace');
      
      // Escribir texto
      await frame.type(selector, text, { delay: 50 });
      await this.wait(300);
      return true;
    } catch (error) {
      console.error(`❌ Error escribiendo en ${selector}:`, error.message);
      return false;
    }
  }

  /**
   * Seleccionar opción en dropdown
   */
  async selectOption(selector, value) {
    const frame = await this.switchToMainFrame();
    
    try {
      await frame.waitForSelector(selector, { timeout: 10000 });
      await frame.select(selector, value);
      await this.wait(1000);
      return true;
    } catch (error) {
      console.error(`❌ Error seleccionando ${value} en ${selector}:`, error.message);
      return false;
    }
  }

  /**
   * Esperar
   */
  async wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * LOGIN en HemoHL7
   */
  async login(usuario, password) {
    console.log(`🔐 Iniciando sesión como ${usuario}...`);
    
    try {
      await this.page.goto(HEMOHL7_CONFIG.baseUrl, { waitUntil: 'networkidle2' });
      await this.wait(3000);

      // Cambiar al frame si existe
      await this.switchToMainFrame();

      // Ingresar usuario
      const usuarioOk = await this.typeInField(SELECTORS.usuario, usuario);
      if (!usuarioOk) {
        throw new Error('No se pudo ingresar usuario');
      }

      // Ingresar contraseña
      const passwordOk = await this.typeInField(SELECTORS.password, password);
      if (!passwordOk) {
        throw new Error('No se pudo ingresar contraseña');
      }

      // Click en Entrar
      const entrarOk = await this.clickElement(SELECTORS.btnEntrar);
      if (!entrarOk) {
        throw new Error('No se pudo hacer clic en Entrar');
      }

      await this.wait(3000);
      
      // Verificar login exitoso (buscar selector de clínica)
      const frame = await this.switchToMainFrame();
      try {
        await frame.waitForSelector(SELECTORS.clinicaSelect, { timeout: 10000 });
        this.isLoggedIn = true;
        console.log('✅ Login exitoso');
        return true;
      } catch {
        throw new Error('Login fallido - no se encontró selector de clínica');
      }
    } catch (error) {
      console.error('❌ Error en login:', error.message);
      return false;
    }
  }

  /**
   * Cambiar de clínica
   */
  async cambiarClinica(clinicaId) {
    if (!this.isLoggedIn) {
      throw new Error('No hay sesión activa');
    }

    const clinicaValue = CLINICA_VALUES[clinicaId];
    if (!clinicaValue && clinicaValue !== '0') {
      throw new Error(`Clínica desconocida: ${clinicaId}`);
    }

    console.log(`🏥 Cambiando a clínica: ${clinicaId} (value=${clinicaValue})...`);

    const ok = await this.selectOption(SELECTORS.clinicaSelect, clinicaValue);
    if (!ok) {
      throw new Error('No se pudo cambiar de clínica');
    }

    await this.wait(2000);
    this.currentClinica = clinicaId;
    console.log(`✅ Clínica cambiada a ${clinicaId}`);
    return true;
  }

  /**
   * Buscar paciente por expediente
   */
  async buscarPaciente(expediente) {
    console.log(`🔍 Buscando paciente: ${expediente}...`);

    try {
      // Click en "Buscar paciente"
      await this.clickElement(SELECTORS.btnBuscarPaciente);
      await this.wait(1500);

      // Escribir expediente
      await this.typeInField(SELECTORS.campoBusqueda, expediente);

      // Click en "Mostrar"
      await this.clickElement(SELECTORS.btnMostrar);
      await this.wait(2000);

      // Click en "Aceptar" para seleccionar paciente
      await this.clickElement(SELECTORS.btnAceptarBusqueda);
      await this.wait(2000);

      this.currentPatient = expediente;
      console.log(`✅ Paciente ${expediente} seleccionado`);
      return true;
    } catch (error) {
      console.error('❌ Error buscando paciente:', error.message);
      return false;
    }
  }

  /**
   * Ir a Notas Médicas
   */
  async irANotasMedicas() {
    console.log('📝 Navegando a Notas Médicas...');
    
    const ok = await this.clickElement(SELECTORS.btnNotasMedicas);
    if (!ok) {
      throw new Error('No se pudo acceder a Notas Médicas');
    }
    
    await this.wait(2000);
    console.log('✅ En pantalla de Notas Médicas');
    return true;
  }

  /**
   * Subir una nota
   */
  async subirNota(contenido, fecha = null) {
    console.log('📤 Subiendo nota...');

    try {
      // Click en "Nueva"
      await this.clickElement(SELECTORS.btnNuevaNota);
      await this.wait(1500);

      // Verificar tipo = Evolución (value=1)
      await this.selectOption(SELECTORS.tipoNota, '1');

      // Pegar contenido en textarea
      const frame = await this.switchToMainFrame();
      await frame.waitForSelector(SELECTORS.textareaNota, { timeout: 10000 });
      
      // Limpiar y escribir
      await frame.click(SELECTORS.textareaNota);
      await frame.evaluate((selector, text) => {
        const textarea = document.querySelector(selector);
        if (textarea) {
          textarea.value = text;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, SELECTORS.textareaNota.split(',')[0], contenido);

      await this.wait(1000);

      // TODO: Seleccionar fecha si es diferente a hoy
      // if (fecha && fecha !== today) { ... }

      // Click en "Aceptar" para guardar
      await this.clickElement(SELECTORS.btnGuardarNota);
      await this.wait(2000);

      console.log('✅ Nota guardada exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error subiendo nota:', error.message);
      return false;
    }
  }

  /**
   * Regresar a pantalla principal
   */
  async regresar() {
    await this.clickElement(SELECTORS.btnRegresar);
    await this.wait(1500);
    this.currentPatient = null;
  }

  /**
   * Cerrar navegador
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('👋 Navegador cerrado');
    }
  }

  /**
   * Procesar cola de notas
   */
  async procesarCola(notas, usuario, password, onProgress) {
    const results = {
      total: notas.length,
      exitosas: 0,
      fallidas: 0,
      detalles: []
    };

    try {
      // Inicializar
      await this.init();
      
      // Login
      const loginOk = await this.login(usuario, password);
      if (!loginOk) {
        throw new Error('No se pudo iniciar sesión en HemoHL7');
      }

      // Agrupar notas por clínica y paciente
      const notasPorClinica = {};
      for (const nota of notas) {
        const key = nota.clinica_id;
        if (!notasPorClinica[key]) {
          notasPorClinica[key] = [];
        }
        notasPorClinica[key].push(nota);
      }

      let processed = 0;

      // Procesar por clínica
      for (const [clinicaId, notasClinica] of Object.entries(notasPorClinica)) {
        console.log(`\n📍 Procesando clínica: ${clinicaId} (${notasClinica.length} notas)`);
        
        await this.cambiarClinica(clinicaId);

        // Agrupar por paciente
        const notasPorPaciente = {};
        for (const nota of notasClinica) {
          if (!notasPorPaciente[nota.expediente]) {
            notasPorPaciente[nota.expediente] = [];
          }
          notasPorPaciente[nota.expediente].push(nota);
        }

        // Procesar por paciente
        for (const [expediente, notasPaciente] of Object.entries(notasPorPaciente)) {
          console.log(`\n👤 Paciente: ${expediente} (${notasPaciente.length} notas)`);
          
          const pacienteOk = await this.buscarPaciente(expediente);
          if (!pacienteOk) {
            // Marcar todas las notas del paciente como fallidas
            for (const nota of notasPaciente) {
              results.fallidas++;
              results.detalles.push({
                nota_id: nota.id,
                success: false,
                error: `No se encontró paciente ${expediente}`
              });
              processed++;
              if (onProgress) {
                onProgress(processed, results.total, `Error: Paciente ${expediente} no encontrado`);
              }
            }
            continue;
          }

          await this.irANotasMedicas();

          // Subir cada nota
          for (const nota of notasPaciente) {
            const notaOk = await this.subirNota(nota.contenido, nota.fecha);
            
            if (notaOk) {
              results.exitosas++;
              results.detalles.push({
                nota_id: nota.id,
                success: true,
                error: null
              });
            } else {
              results.fallidas++;
              results.detalles.push({
                nota_id: nota.id,
                success: false,
                error: 'Error al subir nota'
              });
            }

            processed++;
            if (onProgress) {
              onProgress(processed, results.total, notaOk 
                ? `✅ Nota ${nota.id.slice(0,8)} subida` 
                : `❌ Error en nota ${nota.id.slice(0,8)}`
              );
            }
          }

          await this.regresar();
        }
      }

      console.log(`\n📊 Resumen: ${results.exitosas}/${results.total} notas subidas`);
      return results;

    } catch (error) {
      console.error('❌ Error procesando cola:', error.message);
      throw error;
    } finally {
      await this.close();
    }
  }
}

// ============================================================================
// EXPORTS Y CLI
// ============================================================================

module.exports = { HemoHL7Worker, SELECTORS, CLINICA_VALUES };

// Ejecutar como CLI
if (require.main === module) {
  const worker = new HemoHL7Worker();
  
  // Ejemplo de uso
  const testNotas = [
    {
      id: 'test-1',
      expediente: 'LE1361',
      clinica_id: 'alba_centro',
      contenido: 'NOTA DE PRUEBA - Paciente estable, sin complicaciones.',
      fecha: new Date().toISOString().split('T')[0]
    }
  ];

  const usuario = process.env.HEMOHL7_USER || 'JTAPIA';
  const password = process.env.HEMOHL7_PASS || '';

  if (!password) {
    console.error('❌ Falta HEMOHL7_PASS en variables de entorno');
    process.exit(1);
  }

  worker.procesarCola(testNotas, usuario, password, (current, total, msg) => {
    console.log(`[${current}/${total}] ${msg}`);
  }).then(results => {
    console.log('\n✅ Proceso completado:', results);
    process.exit(0);
  }).catch(error => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
}
