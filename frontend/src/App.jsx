import React, { useState, useEffect, useCallback } from 'react';
import { LOGOS, CLINICAS_CONFIG } from './logos';

// ============================================
// DATOS DE CONFIGURACIÓN Y CATÁLOGOS
// ============================================

const SAMPLE_PATIENTS = [
  {
    expediente: 'LE1361',
    nombre: 'CAPETILLO MA SOLEDAD',
    fechaNacimiento: '22/12/1951',
    edad: 74,
    sexo: 'Femenino',
    diagnosticos: ['Enfermedad renal crónica KDIGO G5D secundario a Nefropatía Diabética', 'Hipertensión Arterial Sistémica', 'Desnutrición proteico-calórica'],
    alergias: 'Negadas',
    grupoSanguineo: 'No documentado',
    accesoVascular: { tipo: 'cateter_temporal', sitio: 'yugular_izquierda', fecha: '01/12/2023' },
    pesoSeco: 38,
    talla: 1.50,
    pesoSalidaPrevia: 38.5,
    inicioHD: 'Julio 2024',
    ingresoClinica: '22/07/2024',
    bacteriemia: false,
    candidatoTrasplante: false,
    estadoNutricional: 'desnutricion_severa',
    // Parámetros de última sesión (se precargan)
    ultimaSesion: {
      filtro: 'F160',
      tiempoSesion: 150,
      qb: 350,
      qd: 500,
      na: 138,
      k: 2,
      ca: 3,
      hco3: 35,
      temperatura: 36,
      hepBolo: 1000,
      hepInfusion: 500,
      conductividad: 138
    },
    // Medicamentos actuales
    medicamentos: [
      { id: 1, nombre: 'Eritropoyetina', dosis: '12,000 UI', frecuencia: 'Semanal', via: 'SC', indicaciones: 'Aplicar post-hemodiálisis' },
      { id: 2, nombre: 'Carbonato de calcio', dosis: '500 mg', frecuencia: 'Cada 8 horas', via: 'VO', indicaciones: 'Con alimentos' },
      { id: 3, nombre: 'Omeprazol', dosis: '20 mg', frecuencia: 'Cada 24 horas', via: 'VO', indicaciones: 'En ayuno' },
      { id: 4, nombre: 'Losartán', dosis: '50 mg', frecuencia: 'Cada 12 horas', via: 'VO', indicaciones: '' },
      { id: 5, nombre: 'Amlodipino', dosis: '10 mg', frecuencia: 'Cada 24 horas', via: 'VO', indicaciones: 'Por la noche' }
    ],
    ultimosLabs: {
      fecha: '10/12/2025',
      hemoglobina: 14.80,
      hematocrito: 47.80,
      vcm: 84.90,
      hcm: 26.30,
      plaquetas: 286,
      leucocitos: 4.22,
      glucosa: 106,
      urea: 64.20,
      creatinina: 4.98,
      albumina: 4.10,
      calcio: 9.40,
      fosforo: 4.2,
      potasio: 5.40,
      sodio: 135,
      pth: 450,
      ferritina: 200,
      saturacionTransferrina: 25,
      pcr: 3.15,
      ktv: 1.4,
      urr: 68
    }
  },
  {
    expediente: 'LE0025',
    nombre: 'GARCÍA LÓPEZ JUAN ANTONIO',
    fechaNacimiento: '15/03/1965',
    edad: 60,
    sexo: 'Masculino',
    diagnosticos: ['Enfermedad renal crónica KDIGO G5D secundario a Nefropatía Hipertensiva', 'Diabetes Mellitus tipo 2'],
    alergias: 'Penicilina',
    grupoSanguineo: 'O+',
    accesoVascular: { tipo: 'favi', sitio: 'radiocefálica_izquierda', fecha: '15/06/2022' },
    pesoSeco: 72,
    talla: 1.70,
    pesoSalidaPrevia: 72.5,
    inicioHD: 'Enero 2023',
    ingresoClinica: '15/01/2023',
    bacteriemia: false,
    candidatoTrasplante: true,
    estadoNutricional: 'normal',
    ultimaSesion: {
      filtro: 'F200',
      tiempoSesion: 180,
      qb: 400,
      qd: 500,
      na: 138,
      k: 2,
      ca: 3,
      hco3: 35,
      temperatura: 36,
      hepBolo: 1500,
      hepInfusion: 1000,
      conductividad: 138
    },
    medicamentos: [
      { id: 1, nombre: 'Eritropoyetina', dosis: '8,000 UI', frecuencia: 'Semanal', via: 'SC', indicaciones: '' },
      { id: 2, nombre: 'Sevelámero', dosis: '800 mg', frecuencia: 'Cada 8 horas', via: 'VO', indicaciones: 'Con alimentos' },
      { id: 3, nombre: 'Metformina', dosis: '850 mg', frecuencia: 'Cada 12 horas', via: 'VO', indicaciones: '' },
      { id: 4, nombre: 'Atorvastatina', dosis: '20 mg', frecuencia: 'Cada 24 horas', via: 'VO', indicaciones: 'Por la noche' }
    ],
    ultimosLabs: {
      fecha: '15/12/2025',
      hemoglobina: 11.2,
      hematocrito: 35.5,
      vcm: 88.0,
      hcm: 28.0,
      plaquetas: 220,
      leucocitos: 6.5,
      glucosa: 145,
      urea: 120,
      creatinina: 8.5,
      albumina: 3.8,
      calcio: 9.0,
      fosforo: 5.8,
      potasio: 4.8,
      sodio: 138,
      pth: 380,
      ferritina: 350,
      saturacionTransferrina: 30,
      pcr: 1.2,
      ktv: 1.5,
      urr: 72
    }
  }
];

const DOCTORS = [
  { id: 1, nombre: 'Dr. Cesar Ivan Garcia Gomez', cedula: '13836204', especialidad: 'Nefrología' },
  { id: 2, nombre: 'Dra. Jazmín Del Rocío Fernández Juárez', cedula: '14574040', especialidad: 'Nefrología' },
  { id: 3, nombre: 'Dr. Josué Wigberto Tapia López', cedula: '9940966', ssa: '5614', cmn: '1267', especialidad: 'Nefrología' }
];

const CLINICAS = CLINICAS_CONFIG;

// Función auxiliar para obtener el logo de una clínica
const getClinicaLogo = (clinica) => {
  if (clinica && clinica.logo && LOGOS[clinica.logo]) {
    return LOGOS[clinica.logo];
  }
  return null;
};

const FILTROS = [
  { categoria: 'Fresenius F-Series', items: ['F160', 'F180', 'F200'] },
  { categoria: 'Fresenius FX-Series', items: ['FX60', 'FX80', 'FX100'] },
  { categoria: 'Fresenius Optiflux', items: ['Optiflux 160NR', 'Optiflux 180NR', 'Optiflux 200NR'] },
  { categoria: 'Baxter Revaclear', items: ['Revaclear 300', 'Revaclear 400'] },
  { categoria: 'Nipro Elisio', items: ['Elisio 15H', 'Elisio 17H', 'Elisio 21H'] },
  { categoria: 'B. Braun Xevonta', items: ['Xevonta 15', 'Xevonta 18', 'Xevonta 23'] },
  { categoria: 'B. Braun Diacap', items: ['Diacap Pro 15H', 'Diacap Pro 19H'] },
  { categoria: 'Gambro/Baxter Polyflux', items: ['Polyflux 14L', 'Polyflux 17L', 'Polyflux 21L'] },
  { categoria: 'Toray Toraysulfone', items: ['TS-1.6SL', 'TS-1.8SL', 'TS-2.1SL'] }
];

const TIEMPOS_SESION = [120, 150, 180, 195, 210, 240];
const SALAS = [1, 2, 3, 4, 5, 6];
const TURNOS = [1, 2, 3, 4, 5];

const MEDICAMENTOS_CATALOGO = [
  // Antihipertensivos
  { categoria: 'Antihipertensivos', nombre: 'Losartán', presentaciones: ['25 mg', '50 mg', '100 mg'] },
  { categoria: 'Antihipertensivos', nombre: 'Telmisartán', presentaciones: ['40 mg', '80 mg'] },
  { categoria: 'Antihipertensivos', nombre: 'Amlodipino', presentaciones: ['5 mg', '10 mg'] },
  { categoria: 'Antihipertensivos', nombre: 'Nifedipino', presentaciones: ['10 mg', '30 mg'] },
  { categoria: 'Antihipertensivos', nombre: 'Metoprolol', presentaciones: ['25 mg', '50 mg', '100 mg'] },
  { categoria: 'Antihipertensivos', nombre: 'Carvedilol', presentaciones: ['6.25 mg', '12.5 mg', '25 mg'] },
  { categoria: 'Antihipertensivos', nombre: 'Prazosina', presentaciones: ['1 mg', '2 mg'] },
  { categoria: 'Antihipertensivos', nombre: 'Clonidina', presentaciones: ['0.1 mg', '0.15 mg'] },
  // Quelantes de fósforo
  { categoria: 'Quelantes de fósforo', nombre: 'Carbonato de calcio', presentaciones: ['500 mg', '600 mg', '1000 mg'] },
  { categoria: 'Quelantes de fósforo', nombre: 'Acetato de calcio', presentaciones: ['667 mg'] },
  { categoria: 'Quelantes de fósforo', nombre: 'Sevelámero', presentaciones: ['400 mg', '800 mg'] },
  { categoria: 'Quelantes de fósforo', nombre: 'Carbonato de lantano', presentaciones: ['500 mg', '750 mg', '1000 mg'] },
  // Vitamina D y análogos
  { categoria: 'Vitamina D', nombre: 'Calcitriol', presentaciones: ['0.25 mcg', '0.5 mcg'] },
  { categoria: 'Vitamina D', nombre: 'Alfacalcidol', presentaciones: ['0.25 mcg', '0.5 mcg', '1 mcg'] },
  { categoria: 'Vitamina D', nombre: 'Paricalcitol', presentaciones: ['1 mcg', '2 mcg', '5 mcg/ml IV'] },
  // EPO y hierro
  { categoria: 'Antianémicos', nombre: 'Eritropoyetina alfa', presentaciones: ['2000 UI', '4000 UI', '10000 UI'] },
  { categoria: 'Antianémicos', nombre: 'Eritropoyetina beta', presentaciones: ['2000 UI', '4000 UI', '10000 UI'] },
  { categoria: 'Antianémicos', nombre: 'Darbepoetina', presentaciones: ['20 mcg', '40 mcg', '60 mcg'] },
  { categoria: 'Antianémicos', nombre: 'Hierro sacarato', presentaciones: ['100 mg/5ml IV'] },
  { categoria: 'Antianémicos', nombre: 'Hierro dextrano', presentaciones: ['100 mg/2ml IV'] },
  { categoria: 'Antianémicos', nombre: 'Sulfato ferroso', presentaciones: ['200 mg', '300 mg'] },
  // Otros
  { categoria: 'Gastroprotectores', nombre: 'Omeprazol', presentaciones: ['20 mg', '40 mg'] },
  { categoria: 'Gastroprotectores', nombre: 'Pantoprazol', presentaciones: ['20 mg', '40 mg'] },
  { categoria: 'Antidiabéticos', nombre: 'Metformina', presentaciones: ['500 mg', '850 mg', '1000 mg'] },
  { categoria: 'Antidiabéticos', nombre: 'Glibenclamida', presentaciones: ['5 mg'] },
  { categoria: 'Hipolipemiantes', nombre: 'Atorvastatina', presentaciones: ['10 mg', '20 mg', '40 mg'] },
  { categoria: 'Hipolipemiantes', nombre: 'Rosuvastatina', presentaciones: ['5 mg', '10 mg', '20 mg'] },
  { categoria: 'Antiagregantes', nombre: 'Ácido acetilsalicílico', presentaciones: ['100 mg', '150 mg'] },
  { categoria: 'Antiagregantes', nombre: 'Clopidogrel', presentaciones: ['75 mg'] },
  { categoria: 'Analgésicos', nombre: 'Paracetamol', presentaciones: ['500 mg', '750 mg'] },
  { categoria: 'Analgésicos', nombre: 'Tramadol', presentaciones: ['50 mg', '100 mg'] },
  { categoria: 'Antihistamínicos', nombre: 'Loratadina', presentaciones: ['10 mg'] },
  { categoria: 'Antihistamínicos', nombre: 'Cetirizina', presentaciones: ['10 mg'] }
];

const VIAS_ADMINISTRACION = ['VO', 'SC', 'IV', 'IM', 'Tópica', 'Oftálmica', 'Ótica', 'Inhalada', 'SL', 'Rectal'];
const FRECUENCIAS = ['Cada 6 horas', 'Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas', 'Cada 48 horas', 'Cada 72 horas', 'Semanal', 'Quincenal', 'Mensual', 'PRN', 'Dosis única'];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function HemoNotasApp() {
  // Estados principales
  const [currentView, setCurrentView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ usuario: '', password: '' });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState(SAMPLE_PATIENTS);
  const [doctors, setDoctors] = useState(DOCTORS);
  const [clinicaActual, setClinicaActual] = useState(CLINICAS[0]);
  const [pendingNotes, setPendingNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({});
  const [generatedNote, setGeneratedNote] = useState(null);
  
  // Estados para modales
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showMedicamentosModal, setShowMedicamentosModal] = useState(false);
  const [showRecetaModal, setShowRecetaModal] = useState(false);
  const [showAgregarMedModal, setShowAgregarMedModal] = useState(false);
  
  // Estados para medicamentos
  const [medicamentosExpandidos, setMedicamentosExpandidos] = useState(false);
  const [medicamentosPaciente, setMedicamentosPaciente] = useState([]);
  const [medicamentosReceta, setMedicamentosReceta] = useState([]);
  const [nuevoMedicamento, setNuevoMedicamento] = useState({
    nombre: '',
    dosis: '',
    frecuencia: '',
    via: 'VO',
    duracion: '',
    indicaciones: ''
  });
  
  const [newDoctor, setNewDoctor] = useState({ nombre: '', cedula: '', ssa: '', cmn: '', especialidad: '' });

  // Inicializar formulario cuando se selecciona paciente
  useEffect(() => {
    if (selectedPatient) {
      initializeForm(selectedPatient);
      setMedicamentosPaciente([...selectedPatient.medicamentos]);
    }
  }, [selectedPatient]);

  const initializeForm = (patient) => {
    const now = new Date();
    const ultimaSesion = patient.ultimaSesion || {};
    
    setFormData({
      // Datos básicos
      sala: 1,
      turno: 1,
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().slice(0, 5),
      
      // Acceso vascular (precargado)
      tipoAcceso: patient.accesoVascular?.tipo || 'cateter_temporal',
      sitioAcceso: patient.accesoVascular?.sitio || 'yugular_derecha',
      fechaAcceso: patient.accesoVascular?.fecha || '',
      
      // Condiciones catéter
      condicionParche: 'pegado_limpio',
      sitioInsercion: 'limpio',
      tipoSecrecion: 'ninguna',
      fijacionCateter: 'con_puntos',
      otrosAcceso: '',
      
      // Condiciones FAVI/injerto
      thrill: true,
      soplo: true,
      hematoma: false,
      edema: false,
      eritema: false,
      aneurisma: false,
      zonasPuncion: 'adecuadas',
      
      // Antecedentes
      alergias: patient.alergias || 'Negadas',
      grupoSanguineo: patient.grupoSanguineo || 'No documentado',
      transfusiones: false,
      transfusionesFecha: '',
      
      // Estado nutricional
      estadoNutricional: patient.estadoNutricional || 'normal',
      talla: patient.talla || 0,
      imc: 0,
      
      // Síntomas intradiálisis
      sintomasIntradialisis: {
        asintomatico: true,
        calambres: false,
        fiebre: false,
        escalofrios: false,
        sangrado: false,
        melena: false,
        cefalea: false,
        malestarGeneral: false,
        nausea: false,
        vomito: false,
        hipotension: false,
        hipertension: false,
        mareo: false,
        disnea: false,
        dolorPrecordial: false,
        dolorAbdominal: false,
        prurito: false,
        convulsiones: false,
        arritmia: false
      },
      
      // Complicaciones específicas
      complicacionesEspecificas: {
        sindromeDesequilibrio: false,
        hemolisis: false,
        embolia: false,
        coagulacionCircuito: false,
        roturaFiltro: false,
        extravasacion: false,
        trombosisAcceso: false,
        infeccionAcceso: false,
        disfuncionAcceso: false,
        hemorragiaPostPuncion: false
      },
      
      // Pesos
      pesoSeco: patient.pesoSeco || 0,
      pesoSalidaPrevia: patient.pesoSalidaPrevia || 0,
      pesoIngreso: 0,
      ufPrescrita: 0,
      
      // Signos vitales
      taIngreso: { sistolica: '', diastolica: '' },
      taEgreso: { sistolica: '', diastolica: '' },
      fcIngreso: '',
      fcEgreso: '',
      frIngreso: '',
      frEgreso: '',
      tempIngreso: '36',
      tempEgreso: '36',
      spo2Ingreso: '',
      spo2Egreso: '',
      
      // Exploración física
      exploracionFisica: {
        consciente: true,
        orientado: true,
        glasgow: 15,
        palidez: false,
        ictericia: false,
        deshidratacion: false,
        edemaFacial: false,
        ingurgitacionYugular: false,
        // Campos pulmonares
        camposVentilados: true,
        hipoventilados: false,
        estertores: false,
        estertoresLocalizacion: '',
        estertoresTipo: '',
        sibilancias: false,
        // Cardiovascular
        ruidosCardiacos: 'ritmicos',
        soplosCardiacos: false,
        frotePericardico: false,
        // Abdomen
        abdomenBlando: true,
        abdomenDoloroso: false,
        peristalsis: true,
        visceromegalias: false,
        irritacionPeritoneal: false,
        ascitis: false,
        // Extremidades
        edemaInferior: false,
        gradoEdema: '',
        llenado: 'menor_2seg',
        pulsos: 'presentes',
        extremidadesIntegras: true
      },
      
      // Parámetros de diálisis (PRECARGADOS de última sesión, excepto UF)
      tiempoSesion: ultimaSesion.tiempoSesion || 180,
      filtro: ultimaSesion.filtro || 'F160',
      qb: ultimaSesion.qb || 350,
      qd: ultimaSesion.qd || 500,
      na: ultimaSesion.na || 138,
      k: ultimaSesion.k || 2,
      ca: ultimaSesion.ca || 3,
      hco3: ultimaSesion.hco3 || 35,
      temperatura: ultimaSesion.temperatura || 36,
      hepBolo: ultimaSesion.hepBolo || 1000,
      hepInfusion: ultimaSesion.hepInfusion || 500,
      conductividad: ultimaSesion.conductividad || 138,
      perfilNa: false,
      perfilUF: false,
      
      // Sellado catéter
      selloCateter: true,
      tipoSellado: 'citrato',
      selladoArterial: 1.6,
      selladoVenoso: 1.6,
      
      // Indicadores de adecuación (últimos disponibles)
      ktv: patient.ultimosLabs?.ktv || '',
      urr: patient.ultimosLabs?.urr || '',
      
      // Metas KDIGO
      metasKDIGO: {
        hbEnMeta: patient.ultimosLabs?.hemoglobina >= 10 && patient.ultimosLabs?.hemoglobina <= 12,
        caEnMeta: patient.ultimosLabs?.calcio >= 8.4 && patient.ultimosLabs?.calcio <= 9.5,
        pEnMeta: patient.ultimosLabs?.fosforo >= 3.5 && patient.ultimosLabs?.fosforo <= 5.5,
        albEnMeta: patient.ultimosLabs?.albumina >= 3.5
      },
      
      // Estado del paciente
      bacteriemia: patient.bacteriemia || false,
      candidatoTrasplante: patient.candidatoTrasplante || false,
      uresiResidual: 'no_cuantificada',
      uresiCuantificada: '',
      
      // Evolución
      evolucionSesion: 'estable',
      complicaciones: false,
      tipoComplicacion: '',
      
      // Notas extras
      notasExtras: '',
      
      // Médico
      medicoId: doctors[0]?.id || 1
    });
  };

  // Cálculos automáticos
  const calcularGananciaID = () => {
    const ganancia = (formData.pesoIngreso || 0) - (formData.pesoSalidaPrevia || 0);
    return ganancia > 0 ? ganancia.toFixed(2) : '0.00';
  };

  const calcularUFMaxima = () => {
    const pesoSeco = formData.pesoSeco || 0;
    const tiempoHoras = (formData.tiempoSesion || 180) / 60;
    return ((13 * pesoSeco * tiempoHoras) / 1000).toFixed(2);
  };

  const calcularIMC = () => {
    const peso = formData.pesoSeco || 0;
    const talla = formData.talla || 0;
    if (peso > 0 && talla > 0) {
      return (peso / (talla * talla)).toFixed(1);
    }
    return '0.0';
  };

  // Handlers - Login simplificado (los logos están embebidos)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (credentials.usuario && credentials.password) {
      // En producción, aquí iría la autenticación real con HemoHL7
      // Por ahora, simplemente validamos que haya credenciales
      setIsAuthenticated(true);
      setCurrentView('patients');
    }
  };

  const filteredPatients = patients.filter(p => 
    p.expediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agregar medicamento al paciente
  const agregarMedicamentoPaciente = () => {
    if (nuevoMedicamento.nombre && nuevoMedicamento.dosis) {
      const nuevo = {
        id: Date.now(),
        ...nuevoMedicamento
      };
      setMedicamentosPaciente([...medicamentosPaciente, nuevo]);
      setNuevoMedicamento({ nombre: '', dosis: '', frecuencia: '', via: 'VO', duracion: '', indicaciones: '' });
      setShowAgregarMedModal(false);
    }
  };

  // Eliminar medicamento
  const eliminarMedicamento = (id) => {
    setMedicamentosPaciente(medicamentosPaciente.filter(m => m.id !== id));
  };

  // Editar medicamento
  const editarMedicamento = (id, campo, valor) => {
    setMedicamentosPaciente(medicamentosPaciente.map(m => 
      m.id === id ? { ...m, [campo]: valor } : m
    ));
  };

  // Agregar medicamento a receta
  const agregarAReceta = (med) => {
    if (!medicamentosReceta.find(m => m.id === med.id)) {
      setMedicamentosReceta([...medicamentosReceta, { ...med, duracion: '30 días' }]);
    }
  };

  // Eliminar de receta
  const eliminarDeReceta = (id) => {
    setMedicamentosReceta(medicamentosReceta.filter(m => m.id !== id));
  };

  // Generar nota
  const generateNote = () => {
    const doctor = doctors.find(d => d.id === formData.medicoId);
    const patient = selectedPatient;
    
    // Construir texto de síntomas
    const sintomasActivos = Object.entries(formData.sintomasIntradialisis)
      .filter(([key, value]) => value && key !== 'asintomatico')
      .map(([key]) => {
        const nombres = {
          calambres: 'calambres', fiebre: 'fiebre', escalofrios: 'escalofríos',
          sangrado: 'sangrado', melena: 'melena', cefalea: 'cefalea',
          malestarGeneral: 'malestar general', nausea: 'náusea', vomito: 'vómito',
          hipotension: 'hipotensión', hipertension: 'hipertensión', mareo: 'mareo',
          disnea: 'disnea', dolorPrecordial: 'dolor precordial', dolorAbdominal: 'dolor abdominal',
          prurito: 'prurito', convulsiones: 'convulsiones', arritmia: 'arritmia'
        };
        return nombres[key] || key;
      });

    const sintomasTexto = sintomasActivos.length > 0 ? sintomasActivos.join(', ') : 'asintomático';

    // Complicaciones específicas
    const complicacionesActivas = Object.entries(formData.complicacionesEspecificas)
      .filter(([key, value]) => value)
      .map(([key]) => {
        const nombres = {
          sindromeDesequilibrio: 'síndrome de desequilibrio', hemolisis: 'hemólisis',
          embolia: 'embolia aérea', coagulacionCircuito: 'coagulación del circuito',
          roturaFiltro: 'rotura de filtro', extravasacion: 'extravasación',
          trombosisAcceso: 'trombosis del acceso', infeccionAcceso: 'infección del acceso',
          disfuncionAcceso: 'disfunción del acceso', hemorragiaPostPuncion: 'hemorragia post-punción'
        };
        return nombres[key] || key;
      });

    // Tipo de acceso vascular texto
    const accesoTexto = {
      cateter_temporal: 'Catéter temporal',
      cateter_tunelizado: 'Catéter tunelizado',
      favi: 'Fístula arteriovenosa autóloga',
      injerto: 'Injerto arteriovenoso'
    }[formData.tipoAcceso] || formData.tipoAcceso;

    const sitioTexto = {
      yugular_derecha: 'yugular derecha', yugular_izquierda: 'yugular izquierda',
      subclavio_derecho: 'subclavio derecho', subclavio_izquierdo: 'subclavio izquierdo',
      femoral_derecho: 'femoral derecho', femoral_izquierdo: 'femoral izquierdo',
      radiocefálica_derecha: 'radiocefálica derecha', radiocefálica_izquierda: 'radiocefálica izquierda',
      humerocefálica_derecha: 'húmero-cefálica derecha', humerocefálica_izquierda: 'húmero-cefálica izquierda',
      humerobasílica_derecha: 'húmero-basílica derecha', humerobasílica_izquierda: 'húmero-basílica izquierda'
    }[formData.sitioAcceso] || formData.sitioAcceso;

    // Exploración física
    const ef = formData.exploracionFisica;
    let efTexto = `${ef.consciente ? 'Consciente' : 'Somnoliento'}, ${ef.orientado ? 'orientado en tiempo y espacio' : 'desorientado'}`;
    if (ef.glasgow < 15) efTexto += ` (Glasgow ${ef.glasgow})`;
    efTexto += `, piel y tegumentos ${ef.palidez ? 'con palidez' : 'sin palidez'}${ef.ictericia ? ', ictericia' : ''}${ef.deshidratacion ? ', deshidratación' : ''}.`;
    
    efTexto += ` Campos pulmonares ${ef.camposVentilados ? 'bien ventilados' : ''}${ef.hipoventilados ? 'hipoventilados' : ''}`;
    if (ef.estertores) efTexto += `, estertores ${ef.estertoresTipo || ''} ${ef.estertoresLocalizacion || 'bilaterales'}`;
    if (ef.sibilancias) efTexto += `, sibilancias`;
    efTexto += '.';
    
    efTexto += ` Ruidos cardiacos ${ef.ruidosCardiacos}${ef.soplosCardiacos ? ', soplos presentes' : ', sin soplos'}${ef.frotePericardico ? ', frote pericárdico presente' : ''}.`;
    efTexto += ` Abdomen ${ef.abdomenBlando ? 'blando' : 'rígido'}${ef.abdomenDoloroso ? ', doloroso' : ', no doloroso'}, ${ef.peristalsis ? 'peristalsis presente' : 'sin peristalsis'}${ef.visceromegalias ? ', visceromegalias' : ', no visceromegalias'}${ef.irritacionPeritoneal ? ', con irritación peritoneal' : ', sin irritación peritoneal'}${ef.ascitis ? ', ascitis presente' : ''}.`;
    efTexto += ` Miembros inferiores ${ef.edemaInferior ? `con edema ${ef.gradoEdema}` : 'sin edema'}, llenado capilar ${ef.llenado === 'menor_2seg' ? '<2 seg' : '>2 seg'}, pulsos ${ef.pulsos}. ${accesoTexto} ${sitioTexto} funcional.`;

    // Estado nutricional
    const estadoNutTexto = {
      normal: 'Estado nutricional normal',
      desnutricion_leve: 'Desnutrición leve',
      desnutricion_moderada: 'Desnutrición moderada',
      desnutricion_severa: 'Desnutrición severa',
      sobrepeso: 'Sobrepeso',
      obesidad: 'Obesidad'
    }[formData.estadoNutricional] || '';

    const gananciaID = calcularGananciaID();
    const imc = calcularIMC();
    
    const note = {
      id: Date.now(),
      paciente: patient,
      fecha: formData.fecha,
      hora: formData.hora,
      sala: formData.sala,
      turno: formData.turno,
      texto: `NOTA DIARIA\t\tSALA ${formData.sala} TURNO ${formData.turno}\t\t${formData.fecha}

Diagnósticos: ${patient.diagnosticos.join('. ')}.

${patient.nombre}, ${patient.sexo.toLowerCase()} de ${patient.edad} años quien acude a sesión de Hemodiálisis. ${sintomasTexto === 'asintomático' ? 'Sin síntomas referidos' : `Refiere ${sintomasTexto}`}. ${formData.evolucionSesion === 'estable' ? 'Sin complicaciones y egreso estable' : `Con complicaciones: ${complicacionesActivas.length > 0 ? complicacionesActivas.join(', ') : formData.tipoComplicacion}`}.

Antecedentes: Alergias: ${formData.alergias}. Grupo sanguíneo: ${formData.grupoSanguineo}. ${estadoNutTexto}${imc > 0 ? ` (IMC ${imc} kg/m²)` : ''}.

Signos vitales ingreso: FC ${formData.fcIngreso} lpm, FR ${formData.frIngreso} rpm, TA ${formData.taIngreso.sistolica}/${formData.taIngreso.diastolica} mmHg, SpO2 ${formData.spo2Ingreso}%, Temp ${formData.tempIngreso}°C.
Signos vitales egreso: FC ${formData.fcEgreso} lpm, FR ${formData.frEgreso} rpm, TA ${formData.taEgreso.sistolica}/${formData.taEgreso.diastolica} mmHg, SpO2 ${formData.spo2Egreso}%, Temp ${formData.tempEgreso}°C.

EF: ${efTexto}
Uresis residual ${formData.uresiResidual === 'no_cuantificada' ? 'no cuantificada' : formData.uresiResidual === 'cuantificada' ? formData.uresiCuantificada + ' ml/día' : formData.uresiResidual}. Bacteriemia: ${formData.bacteriemia ? 'Sí' : 'No'}. Candidato a trasplante: ${formData.candidatoTrasplante ? 'Sí' : 'No'}.

${formData.notasExtras ? `Notas adicionales: ${formData.notasExtras}\n\n` : ''}Paciente ${formData.evolucionSesion === 'estable' ? 'estable durante sesión' : 'con incidencias durante sesión'}. Angioacceso funcional. Peso seco: ${formData.pesoSeco} kg. Peso al ingreso: ${formData.pesoIngreso} kg. Ganancia interdialítica: ${gananciaID} kg. UF prescrita: ${formData.ufPrescrita} ml.

${patient.ultimosLabs ? `Laboratorios ${patient.ultimosLabs.fecha}: Hb ${patient.ultimosLabs.hemoglobina} g/dL, Hto ${patient.ultimosLabs.hematocrito}%, Plaquetas ${patient.ultimosLabs.plaquetas}, Leucocitos ${patient.ultimosLabs.leucocitos}, Glucosa ${patient.ultimosLabs.glucosa} mg/dL, Urea ${patient.ultimosLabs.urea} mg/dL, Cr ${patient.ultimosLabs.creatinina} mg/dL, Alb ${patient.ultimosLabs.albumina} g/dL, Ca ${patient.ultimosLabs.calcio} mg/dL, P ${patient.ultimosLabs.fosforo} mg/dL, K ${patient.ultimosLabs.potasio} mEq/L, Na ${patient.ultimosLabs.sodio} mEq/L${patient.ultimosLabs.pth ? `, PTH ${patient.ultimosLabs.pth} pg/mL` : ''}${patient.ultimosLabs.ferritina ? `, Ferritina ${patient.ultimosLabs.ferritina} ng/mL` : ''}.` : ''}
${formData.ktv ? `Indicadores de adecuación: Kt/V ${formData.ktv}, URR ${formData.urr}%.` : ''}

Plan: Acudir a 3 sesiones de hemodiálisis por semana (${formData.tiempoSesion} minutos). ${formData.filtro}, QB ${formData.qb} ml/min, QD ${formData.qd} ml/min. Na ${formData.na}, K ${formData.k}, Ca ${formData.ca}, HCO3 ${formData.hco3}, Temp ${formData.temperatura}°C. Heparina Bolo ${formData.hepBolo} UI, Infusión ${formData.hepInfusion} UI/h. Cuidados de angio-acceso. Restricción de líquidos orales y dieta para nefrópata.

Medicamentos actuales: ${medicamentosPaciente.map(m => `${m.nombre} ${m.dosis} ${m.via} ${m.frecuencia}`).join('; ')}.

${doctor.nombre}. Céd. Prof. ${doctor.cedula}${doctor.ssa ? `, SSA ${doctor.ssa}` : ''}${doctor.cmn ? `, CMN ${doctor.cmn}` : ''}.`,
      doctor: doctor,
      status: 'pending',
      medicamentos: medicamentosPaciente
    };

    setGeneratedNote(note);
    setCurrentView('preview');
  };

  // Agregar nota a pendientes
  const addToPending = () => {
    setPendingNotes([...pendingNotes, generatedNote]);
    setGeneratedNote(null);
    setSelectedPatient(null);
    setCurrentView('patients');
  };

  // Subir notas
  const uploadNotes = async () => {
    for (let note of pendingNotes) {
      note.status = 'uploaded';
    }
    alert(`Se han subido ${pendingNotes.length} notas al HemoHL7`);
    setPendingNotes([]);
  };

  // Agregar médico
  const addDoctor = () => {
    if (newDoctor.nombre && newDoctor.cedula) {
      setDoctors([...doctors, { ...newDoctor, id: Date.now() }]);
      setNewDoctor({ nombre: '', cedula: '', ssa: '', cmn: '', especialidad: '' });
      setShowDoctorModal(false);
    }
  };

  // Generar receta PDF
  const generarReceta = () => {
    const doctor = doctors.find(d => d.id === formData.medicoId);
    const fechaActual = new Date().toLocaleDateString('es-MX', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const horaActual = new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit', minute: '2-digit'
    });

    // Generar HTML de receta según NOM-004-SSA3-2012
    const recetaHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receta Médica - ${selectedPatient.nombre}</title>
  <style>
    @page { size: letter; margin: 1.5cm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Arial, sans-serif; 
      font-size: 11pt; 
      line-height: 1.4;
      color: #1a1a1a;
    }
    .receta-container {
      max-width: 21.5cm;
      margin: 0 auto;
      padding: 1cm;
      border: 2px solid #0066cc;
      border-radius: 8px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0066cc;
      padding-bottom: 15px;
      margin-bottom: 15px;
    }
    .logo {
      max-width: 150px;
      max-height: 80px;
      object-fit: contain;
    }
    .logo-placeholder {
      width: 120px;
      height: 60px;
      background: linear-gradient(135deg, #0066cc, #004499);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 10pt;
    }
    .clinic-info {
      text-align: right;
      flex: 1;
      margin-left: 20px;
    }
    .clinic-name {
      font-size: 16pt;
      font-weight: bold;
      color: #0066cc;
    }
    .clinic-details {
      font-size: 9pt;
      color: #555;
      margin-top: 5px;
    }
    .receta-title {
      text-align: center;
      font-size: 18pt;
      font-weight: bold;
      color: #0066cc;
      margin: 15px 0;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .patient-info {
      background: #f5f9ff;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    .info-label {
      font-weight: bold;
      min-width: 120px;
      color: #333;
    }
    .info-value {
      flex: 1;
    }
    .fecha-hora {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 10px;
      background: #e8f0fe;
      border-radius: 4px;
    }
    .medicamentos-section {
      margin: 20px 0;
    }
    .medicamentos-title {
      font-size: 12pt;
      font-weight: bold;
      color: #0066cc;
      border-bottom: 1px solid #0066cc;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }
    .medicamento-item {
      padding: 12px;
      margin-bottom: 10px;
      background: #fafafa;
      border-left: 4px solid #0066cc;
      border-radius: 0 4px 4px 0;
    }
    .med-nombre {
      font-weight: bold;
      font-size: 11pt;
      color: #1a1a1a;
    }
    .med-detalles {
      font-size: 10pt;
      color: #444;
      margin-top: 5px;
    }
    .med-indicaciones {
      font-size: 9pt;
      color: #666;
      font-style: italic;
      margin-top: 5px;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
    .firma-section {
      text-align: center;
      margin-top: 40px;
    }
    .firma-linea {
      width: 250px;
      border-top: 1px solid #333;
      margin: 0 auto 10px auto;
    }
    .doctor-info {
      font-size: 10pt;
    }
    .cedula {
      font-size: 9pt;
      color: #555;
    }
    .aviso-legal {
      margin-top: 30px;
      padding: 10px;
      background: #fff3cd;
      border-radius: 4px;
      font-size: 8pt;
      color: #856404;
      text-align: center;
    }
    .numero-receta {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 9pt;
      color: #888;
    }
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .receta-container { border: 2px solid #0066cc !important; }
    }
  </style>
</head>
<body>
  <div class="receta-container">
    <div class="numero-receta">Folio: ${Date.now()}</div>
    
    <div class="header">
      ${getClinicaLogo(clinicaActual) ? 
        `<img src="${getClinicaLogo(clinicaActual)}" alt="Logo Clínica" class="logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
         <div class="logo-placeholder" style="display:none;">${clinicaActual.nombre.substring(0, 10)}</div>` :
        `<div class="logo-placeholder">${clinicaActual.nombre.substring(0, 10)}</div>`
      }
      <div class="clinic-info">
        <div class="clinic-name">${clinicaActual.nombre}</div>
        <div class="clinic-details">
          ${clinicaActual.direccion}<br>
          Tel: ${clinicaActual.telefono}<br>
          Responsable Sanitario: ${clinicaActual.responsable}
        </div>
      </div>
    </div>

    <div class="receta-title">Receta Médica</div>

    <div class="fecha-hora">
      <div><strong>Fecha:</strong> ${fechaActual}</div>
      <div><strong>Hora:</strong> ${horaActual}</div>
    </div>

    <div class="patient-info">
      <div class="info-row">
        <span class="info-label">Paciente:</span>
        <span class="info-value">${selectedPatient.nombre}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Edad:</span>
        <span class="info-value">${selectedPatient.edad} años</span>
      </div>
      <div class="info-row">
        <span class="info-label">Sexo:</span>
        <span class="info-value">${selectedPatient.sexo}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Expediente:</span>
        <span class="info-value">${selectedPatient.expediente}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Diagnóstico:</span>
        <span class="info-value">${selectedPatient.diagnosticos[0]}</span>
      </div>
    </div>

    <div class="medicamentos-section">
      <div class="medicamentos-title">Rp/</div>
      ${medicamentosReceta.map((med, index) => `
        <div class="medicamento-item">
          <div class="med-nombre">${index + 1}. ${med.nombre} ${med.dosis}</div>
          <div class="med-detalles">
            Vía: ${med.via} | Frecuencia: ${med.frecuencia} | Duración: ${med.duracion || '30 días'}
          </div>
          ${med.indicaciones ? `<div class="med-indicaciones">Indicaciones: ${med.indicaciones}</div>` : ''}
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <div class="firma-section">
        <div class="firma-linea"></div>
        <div class="doctor-info">${doctor.nombre}</div>
        <div class="cedula">
          Céd. Prof. ${doctor.cedula}
          ${doctor.ssa ? ` | SSA ${doctor.ssa}` : ''}
          ${doctor.cmn ? ` | CMN ${doctor.cmn}` : ''}
        </div>
        <div class="cedula">${doctor.especialidad || 'Nefrología'}</div>
      </div>
    </div>

    <div class="aviso-legal">
      Esta receta es válida por 30 días a partir de su expedición. 
      Conforme a la NOM-004-SSA3-2012 del Expediente Clínico.
    </div>
  </div>
</body>
</html>
    `;

    // Abrir en nueva ventana para imprimir
    const ventana = window.open('', '_blank');
    ventana.document.write(recetaHTML);
    ventana.document.close();
    ventana.focus();
    setTimeout(() => ventana.print(), 500);
  };

  // ============================================
  // ESTILOS
  // ============================================
  const styles = {
    app: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #1a365d 50%, #0d2137 100%)',
      fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#e2e8f0'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '16px'
    },
    header: {
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexWrap: 'wrap',
      gap: '12px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px'
    },
    logoText: {
      fontSize: '20px',
      fontWeight: '700',
      background: 'linear-gradient(90deg, #38bdf8, #22d3ee)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    card: {
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      border: '1px solid rgba(56, 189, 248, 0.15)',
      padding: '20px',
      marginBottom: '16px'
    },
    cardCollapsible: {
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      border: '1px solid rgba(56, 189, 248, 0.15)',
      marginBottom: '16px',
      overflow: 'hidden'
    },
    cardHeader: {
      padding: '16px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      background: 'rgba(14, 165, 233, 0.1)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.1)'
    },
    cardContent: {
      padding: '20px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '10px',
      color: '#e2e8f0',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.2s'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '10px',
      color: '#e2e8f0',
      fontSize: '15px',
      outline: 'none',
      cursor: 'pointer'
    },
    button: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      border: 'none',
      borderRadius: '10px',
      color: 'white',
      fontWeight: '600',
      fontSize: '15px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    buttonSecondary: {
      padding: '10px 20px',
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '10px',
      color: '#94a3b8',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer'
    },
    buttonSuccess: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      border: 'none',
      borderRadius: '10px',
      color: 'white',
      fontWeight: '600',
      fontSize: '15px',
      cursor: 'pointer'
    },
    buttonWarning: {
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      border: 'none',
      borderRadius: '10px',
      color: 'white',
      fontWeight: '600',
      fontSize: '15px',
      cursor: 'pointer'
    },
    buttonDanger: {
      padding: '8px 16px',
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.5)',
      borderRadius: '8px',
      color: '#f87171',
      fontSize: '13px',
      cursor: 'pointer'
    },
    buttonSmall: {
      padding: '6px 12px',
      background: 'rgba(14, 165, 233, 0.2)',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '6px',
      color: '#38bdf8',
      fontSize: '12px',
      cursor: 'pointer'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 14px',
      background: 'rgba(30, 41, 59, 0.5)',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: '1px solid transparent'
    },
    checkboxActive: {
      background: 'rgba(14, 165, 233, 0.15)',
      border: '1px solid rgba(56, 189, 248, 0.4)'
    },
    label: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#94a3b8',
      marginBottom: '8px',
      display: 'block',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#38bdf8',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    grid: { display: 'grid', gap: '12px' },
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' },
    patientCard: {
      background: 'rgba(30, 41, 59, 0.6)',
      borderRadius: '12px',
      padding: '16px',
      cursor: 'pointer',
      border: '1px solid rgba(56, 189, 248, 0.1)',
      transition: 'all 0.2s'
    },
    badge: {
      display: 'inline-flex',
      padding: '4px 10px',
      background: 'rgba(14, 165, 233, 0.2)',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#38bdf8'
    },
    badgeSuccess: {
      display: 'inline-flex',
      padding: '4px 10px',
      background: 'rgba(16, 185, 129, 0.2)',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#34d399'
    },
    badgeWarning: {
      display: 'inline-flex',
      padding: '4px 10px',
      background: 'rgba(245, 158, 11, 0.2)',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#fbbf24'
    },
    badgeDanger: {
      display: 'inline-flex',
      padding: '4px 10px',
      background: 'rgba(239, 68, 68, 0.2)',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#f87171'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '10px',
      color: '#e2e8f0',
      fontSize: '14px',
      outline: 'none',
      resize: 'vertical',
      minHeight: '100px',
      fontFamily: 'inherit'
    },
    notePreview: {
      background: 'rgba(30, 41, 59, 0.8)',
      borderRadius: '12px',
      padding: '20px',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '12px',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap',
      maxHeight: '500px',
      overflowY: 'auto'
    },
    nav: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    navButton: {
      padding: '8px 16px',
      background: 'transparent',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '8px',
      color: '#94a3b8',
      fontSize: '14px',
      cursor: 'pointer'
    },
    navButtonActive: {
      background: 'rgba(14, 165, 233, 0.2)',
      borderColor: '#38bdf8',
      color: '#38bdf8'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    },
    modalContent: {
      background: '#0f172a',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      border: '1px solid rgba(56, 189, 248, 0.2)'
    },
    modalLarge: {
      background: '#0f172a',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '900px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      border: '1px solid rgba(56, 189, 248, 0.2)'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 0',
      borderBottom: '1px solid rgba(56, 189, 248, 0.1)'
    },
    calculatedValue: {
      background: 'rgba(16, 185, 129, 0.15)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '8px',
      padding: '12px 16px',
      color: '#34d399',
      fontWeight: '600'
    },
    metaEnMeta: {
      background: 'rgba(16, 185, 129, 0.15)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      color: '#34d399'
    },
    metaFueraMeta: {
      background: 'rgba(239, 68, 68, 0.15)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: '#f87171'
    },
    medicamentoCard: {
      background: 'rgba(30, 41, 59, 0.6)',
      borderRadius: '10px',
      padding: '14px',
      marginBottom: '10px',
      border: '1px solid rgba(56, 189, 248, 0.1)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
      color: '#94a3b8',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid rgba(56, 189, 248, 0.1)',
      fontSize: '14px'
    }
  };

  // ============================================
  // COMPONENTES
  // ============================================

  // Checkbox personalizado
  const CheckboxItem = ({ label, checked, onChange, disabled }) => (
    <div
      style={{ ...styles.checkbox, ...(checked ? styles.checkboxActive : {}), opacity: disabled ? 0.5 : 1 }}
      onClick={() => !disabled && onChange(!checked)}
    >
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '6px',
        border: checked ? 'none' : '2px solid rgba(56, 189, 248, 0.4)',
        background: checked ? 'linear-gradient(135deg, #0ea5e9, #06b6d4)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {checked && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
      </div>
      <span style={{ fontSize: '14px' }}>{label}</span>
    </div>
  );

  // Indicador de meta KDIGO
  const MetaIndicator = ({ label, enMeta, valor }) => (
    <div style={{
      ...styles.calculatedValue,
      ...(enMeta ? styles.metaEnMeta : styles.metaFueraMeta),
      padding: '10px 14px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ fontSize: '12px' }}>{label}</span>
      <span style={{ fontWeight: '700' }}>{valor} {enMeta ? '✓' : '⚠'}</span>
    </div>
  );

  // ============================================
  // VISTAS
  // ============================================

  // Login
  const LoginView = () => {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ ...styles.card, maxWidth: '450px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ ...styles.logoIcon, width: '72px', height: '72px', fontSize: '36px', margin: '0 auto 16px' }}>🩺</div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>HemoNotas</h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Sistema de Notas de Hemodiálisis</p>
            <p style={{ color: '#38bdf8', fontSize: '12px', marginTop: '4px' }}>Versión 2.0 con Recetas Médicas</p>
          </div>
          
          <form onSubmit={handleLogin}>
            {/* Selector de clínica */}
            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>Clínica</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {CLINICAS.map(clinica => (
                  <div
                    key={clinica.id}
                    onClick={() => setClinicaActual(clinica)}
                    style={{
                      padding: '12px',
                      background: clinicaActual.id === clinica.id 
                        ? 'rgba(14, 165, 233, 0.2)' 
                        : 'rgba(30, 41, 59, 0.5)',
                      border: clinicaActual.id === clinica.id 
                        ? '2px solid #38bdf8' 
                        : '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    {getClinicaLogo(clinica) && (
                      <img 
                        src={getClinicaLogo(clinica)} 
                        alt={clinica.nombre} 
                        style={{ 
                          maxWidth: '100px', 
                          maxHeight: '40px', 
                          marginBottom: '8px',
                          filter: clinicaActual.id === clinica.id ? 'none' : 'grayscale(50%)'
                        }}
                      />
                    )}
                    <p style={{ 
                      fontSize: '11px', 
                      color: clinicaActual.id === clinica.id ? '#38bdf8' : '#94a3b8',
                      fontWeight: clinicaActual.id === clinica.id ? '600' : '400'
                    }}>
                      {clinica.nombre}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Usuario HemoHL7</label>
              <input
                type="text"
                style={styles.input}
                placeholder="Ingresa tu usuario"
                value={credentials.usuario}
                onChange={(e) => setCredentials({ ...credentials, usuario: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={styles.label}>Contraseña</label>
              <input
                type="password"
                style={styles.input}
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
            
            <button type="submit" style={{ ...styles.button, width: '100%', justifyContent: 'center' }}>
              Iniciar Sesión
            </button>
          </form>
          
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '16px', textAlign: 'center' }}>
            El logo de la clínica seleccionada se usará en las recetas médicas
          </p>
        </div>
      </div>
    );
  };

  // Pacientes
  const PatientsView = () => (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={styles.sectionTitle}>📋 Seleccionar Paciente</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button style={styles.buttonSecondary} onClick={() => setShowDoctorModal(true)}>👨‍⚕️ Médicos</button>
            {pendingNotes.length > 0 && (
              <button style={styles.button} onClick={() => setCurrentView('pending')}>
                📄 Pendientes ({pendingNotes.length})
              </button>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            style={styles.input}
            placeholder="🔍 Buscar por expediente o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={styles.grid}>
          {filteredPatients.map(patient => (
            <div
              key={patient.expediente}
              style={styles.patientCard}
              onClick={() => { setSelectedPatient(patient); setCurrentView('form'); }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span style={styles.badge}>{patient.expediente}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginTop: '8px' }}>{patient.nombre}</h3>
                </div>
                <span style={{ fontSize: '24px', color: '#38bdf8' }}>→</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>
                <p>{patient.edad} años • {patient.sexo} • HD desde {patient.inicioHD}</p>
                <p style={{ marginTop: '4px' }}>{patient.diagnosticos[0].substring(0, 50)}...</p>
                <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={patient.candidatoTrasplante ? styles.badgeSuccess : styles.badgeWarning}>
                    {patient.candidatoTrasplante ? '✓ Trasplante' : '✗ No trasplante'}
                  </span>
                  <span style={styles.badge}>{patient.accesoVascular.tipo === 'favi' ? 'FAVI' : 'Catéter'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Formulario principal
  const FormView = () => {
    if (!selectedPatient) return null;
    const labs = selectedPatient.ultimosLabs || {};

    return (
      <div style={styles.container}>
        {/* Info del paciente */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={styles.badge}>{selectedPatient.expediente}</span>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginTop: '8px' }}>{selectedPatient.nombre}</h2>
              <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
                {selectedPatient.edad} años • {selectedPatient.sexo} • Inicio HD: {selectedPatient.inicioHD}
              </p>
              <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '13px' }}>
                {selectedPatient.diagnosticos.join(' | ')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button style={styles.buttonSecondary} onClick={() => { setSelectedPatient(null); setCurrentView('patients'); }}>
                ← Cambiar
              </button>
            </div>
          </div>
        </div>

        {/* Metas KDIGO */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🎯 Seguimiento Metas KDIGO (Labs: {labs.fecha})</h3>
          <div style={styles.grid4}>
            <MetaIndicator label="Hemoglobina (10-12)" enMeta={labs.hemoglobina >= 10 && labs.hemoglobina <= 12} valor={`${labs.hemoglobina} g/dL`} />
            <MetaIndicator label="Albúmina (≥3.5)" enMeta={labs.albumina >= 3.5} valor={`${labs.albumina} g/dL`} />
            <MetaIndicator label="Calcio (8.4-9.5)" enMeta={labs.calcio >= 8.4 && labs.calcio <= 9.5} valor={`${labs.calcio} mg/dL`} />
            <MetaIndicator label="Fósforo (3.5-5.5)" enMeta={labs.fosforo >= 3.5 && labs.fosforo <= 5.5} valor={`${labs.fosforo} mg/dL`} />
            <MetaIndicator label="Potasio (3.5-5.5)" enMeta={labs.potasio >= 3.5 && labs.potasio <= 5.5} valor={`${labs.potasio} mEq/L`} />
            {labs.ktv && <MetaIndicator label="Kt/V (≥1.2)" enMeta={labs.ktv >= 1.2} valor={labs.ktv} />}
          </div>
        </div>

        {/* Sala, Turno, Fecha */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📅 Datos de la Sesión</h3>
          <div style={styles.grid3}>
            <div>
              <label style={styles.label}>Sala</label>
              <select style={styles.select} value={formData.sala} onChange={(e) => setFormData({ ...formData, sala: parseInt(e.target.value) })}>
                {SALAS.map(s => <option key={s} value={s}>Sala {s}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Turno</label>
              <select style={styles.select} value={formData.turno} onChange={(e) => setFormData({ ...formData, turno: parseInt(e.target.value) })}>
                {TURNOS.map(t => <option key={t} value={t}>Turno {t}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Fecha</label>
              <input type="date" style={styles.input} value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} />
            </div>
            <div>
              <label style={styles.label}>Hora</label>
              <input type="time" style={styles.input} value={formData.hora} onChange={(e) => setFormData({ ...formData, hora: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Antecedentes */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📋 Antecedentes</h3>
          <div style={styles.grid3}>
            <div>
              <label style={styles.label}>Alergias</label>
              <input type="text" style={styles.input} value={formData.alergias} onChange={(e) => setFormData({ ...formData, alergias: e.target.value })} />
            </div>
            <div>
              <label style={styles.label}>Grupo Sanguíneo</label>
              <select style={styles.select} value={formData.grupoSanguineo} onChange={(e) => setFormData({ ...formData, grupoSanguineo: e.target.value })}>
                <option value="No documentado">No documentado</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Estado Nutricional</label>
              <select style={styles.select} value={formData.estadoNutricional} onChange={(e) => setFormData({ ...formData, estadoNutricional: e.target.value })}>
                <option value="normal">Normal</option>
                <option value="desnutricion_leve">Desnutrición leve</option>
                <option value="desnutricion_moderada">Desnutrición moderada</option>
                <option value="desnutricion_severa">Desnutrición severa</option>
                <option value="sobrepeso">Sobrepeso</option>
                <option value="obesidad">Obesidad</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Talla (m)</label>
              <input type="number" step="0.01" style={styles.input} value={formData.talla} onChange={(e) => setFormData({ ...formData, talla: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label style={styles.label}>IMC Calculado</label>
              <div style={styles.calculatedValue}>{calcularIMC()} kg/m²</div>
            </div>
          </div>
        </div>

        {/* Acceso Vascular */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>💉 Acceso Vascular</h3>
          <div style={styles.grid3}>
            <div>
              <label style={styles.label}>Tipo de Acceso</label>
              <select style={styles.select} value={formData.tipoAcceso} onChange={(e) => setFormData({ ...formData, tipoAcceso: e.target.value })}>
                <option value="cateter_temporal">Catéter Temporal</option>
                <option value="cateter_tunelizado">Catéter Tunelizado</option>
                <option value="favi">FAVI (Fístula)</option>
                <option value="injerto">Injerto</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Sitio</label>
              <select style={styles.select} value={formData.sitioAcceso} onChange={(e) => setFormData({ ...formData, sitioAcceso: e.target.value })}>
                {formData.tipoAcceso.includes('cateter') ? (
                  <>
                    <option value="yugular_derecha">Yugular Derecha</option>
                    <option value="yugular_izquierda">Yugular Izquierda</option>
                    <option value="subclavio_derecho">Subclavio Derecho</option>
                    <option value="subclavio_izquierdo">Subclavio Izquierdo</option>
                    <option value="femoral_derecho">Femoral Derecho</option>
                    <option value="femoral_izquierdo">Femoral Izquierdo</option>
                  </>
                ) : (
                  <>
                    <option value="radiocefálica_derecha">Radiocefálica Derecha</option>
                    <option value="radiocefálica_izquierda">Radiocefálica Izquierda</option>
                    <option value="humerocefálica_derecha">Húmero-cefálica Derecha</option>
                    <option value="humerocefálica_izquierda">Húmero-cefálica Izquierda</option>
                    <option value="humerobasílica_derecha">Húmero-basílica Derecha</option>
                    <option value="humerobasílica_izquierda">Húmero-basílica Izquierda</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label style={styles.label}>Fecha de Colocación</label>
              <input type="text" style={styles.input} value={formData.fechaAcceso} onChange={(e) => setFormData({ ...formData, fechaAcceso: e.target.value })} placeholder="DD/MM/AAAA" />
            </div>
          </div>

          {/* Condiciones del catéter */}
          {formData.tipoAcceso.includes('cateter') && (
            <div style={{ marginTop: '20px' }}>
              <label style={styles.label}>Condiciones del Catéter</label>
              <div style={styles.grid3}>
                <div>
                  <label style={{ ...styles.label, fontSize: '11px' }}>Parche</label>
                  <select style={styles.select} value={formData.condicionParche} onChange={(e) => setFormData({ ...formData, condicionParche: e.target.value })}>
                    <option value="pegado_limpio">Pegado, Limpio</option>
                    <option value="despegado">Despegado</option>
                    <option value="con_secrecion">Con Secreción</option>
                    <option value="manipulado">Manipulado</option>
                    <option value="humedo">Húmedo</option>
                  </select>
                </div>
                <div>
                  <label style={{ ...styles.label, fontSize: '11px' }}>Sitio de Inserción</label>
                  <select style={styles.select} value={formData.sitioInsercion} onChange={(e) => setFormData({ ...formData, sitioInsercion: e.target.value })}>
                    <option value="limpio">Limpio</option>
                    <option value="eritema">Eritema</option>
                    <option value="secrecion_serosa">Secreción Serosa</option>
                    <option value="secrecion_purulenta">Secreción Purulenta</option>
                    <option value="secrecion_hematica">Secreción Hemática</option>
                    <option value="fetido">Fétido</option>
                  </select>
                </div>
                <div>
                  <label style={{ ...styles.label, fontSize: '11px' }}>Fijación</label>
                  <select style={styles.select} value={formData.fijacionCateter} onChange={(e) => setFormData({ ...formData, fijacionCateter: e.target.value })}>
                    <option value="con_puntos">Con Puntos</option>
                    <option value="sin_puntos">Sin Puntos</option>
                    <option value="suturaless">Suturaless</option>
                    <option value="puntos_dehiscentes">Puntos Dehiscentes</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Condiciones FAVI/Injerto */}
          {(formData.tipoAcceso === 'favi' || formData.tipoAcceso === 'injerto') && (
            <div style={{ marginTop: '20px' }}>
              <label style={styles.label}>Condiciones del Acceso</label>
              <div style={styles.grid2}>
                <CheckboxItem label="Thrill presente" checked={formData.thrill} onChange={(v) => setFormData({ ...formData, thrill: v })} />
                <CheckboxItem label="Soplo presente" checked={formData.soplo} onChange={(v) => setFormData({ ...formData, soplo: v })} />
                <CheckboxItem label="Hematoma" checked={formData.hematoma} onChange={(v) => setFormData({ ...formData, hematoma: v })} />
                <CheckboxItem label="Edema" checked={formData.edema} onChange={(v) => setFormData({ ...formData, edema: v })} />
                <CheckboxItem label="Eritema" checked={formData.eritema} onChange={(v) => setFormData({ ...formData, eritema: v })} />
                <CheckboxItem label="Aneurisma" checked={formData.aneurisma} onChange={(v) => setFormData({ ...formData, aneurisma: v })} />
              </div>
              <div style={{ marginTop: '12px' }}>
                <label style={styles.label}>Zonas de Punción</label>
                <select style={styles.select} value={formData.zonasPuncion} onChange={(e) => setFormData({ ...formData, zonasPuncion: e.target.value })}>
                  <option value="adecuadas">Adecuadas</option>
                  <option value="limitadas">Limitadas</option>
                  <option value="cicatrices_multiples">Cicatrices múltiples</option>
                  <option value="buttonhole">Técnica Buttonhole</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Síntomas Intradiálisis */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🩹 Interrogatorio - Síntomas</h3>
          <div style={styles.grid2}>
            <CheckboxItem 
              label="Asintomático" 
              checked={formData.sintomasIntradialisis?.asintomatico} 
              onChange={(v) => {
                if (v) {
                  const sintomasReset = {};
                  Object.keys(formData.sintomasIntradialisis).forEach(k => sintomasReset[k] = false);
                  sintomasReset.asintomatico = true;
                  setFormData({ ...formData, sintomasIntradialisis: sintomasReset });
                } else {
                  setFormData({ ...formData, sintomasIntradialisis: { ...formData.sintomasIntradialisis, asintomatico: v } });
                }
              }} 
            />
            {['calambres', 'fiebre', 'escalofrios', 'sangrado', 'melena', 'cefalea', 'malestarGeneral', 'nausea', 'vomito', 'hipotension', 'hipertension', 'mareo', 'disnea', 'dolorPrecordial', 'dolorAbdominal', 'prurito', 'convulsiones', 'arritmia'].map(sintoma => (
              <CheckboxItem 
                key={sintoma}
                label={sintoma.charAt(0).toUpperCase() + sintoma.slice(1).replace(/([A-Z])/g, ' $1')} 
                checked={formData.sintomasIntradialisis?.[sintoma]} 
                onChange={(v) => setFormData({ ...formData, sintomasIntradialisis: { ...formData.sintomasIntradialisis, [sintoma]: v, asintomatico: false } })} 
              />
            ))}
          </div>
        </div>

        {/* Complicaciones Específicas */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>⚠️ Complicaciones Específicas</h3>
          <div style={styles.grid2}>
            {Object.entries({
              sindromeDesequilibrio: 'Síndrome de desequilibrio',
              hemolisis: 'Hemólisis',
              embolia: 'Embolia aérea',
              coagulacionCircuito: 'Coagulación del circuito',
              roturaFiltro: 'Rotura de filtro',
              extravasacion: 'Extravasación',
              trombosisAcceso: 'Trombosis del acceso',
              infeccionAcceso: 'Infección del acceso',
              disfuncionAcceso: 'Disfunción del acceso',
              hemorragiaPostPuncion: 'Hemorragia post-punción'
            }).map(([key, label]) => (
              <CheckboxItem 
                key={key}
                label={label} 
                checked={formData.complicacionesEspecificas?.[key]} 
                onChange={(v) => setFormData({ ...formData, complicacionesEspecificas: { ...formData.complicacionesEspecificas, [key]: v } })} 
              />
            ))}
          </div>
        </div>

        {/* Pesos y UF */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>⚖️ Pesos y Ultrafiltración</h3>
          <div style={styles.grid3}>
            <div>
              <label style={styles.label}>Peso Seco (kg)</label>
              <input type="number" step="0.1" style={styles.input} value={formData.pesoSeco} onChange={(e) => setFormData({ ...formData, pesoSeco: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label style={styles.label}>Peso Salida Previa (kg)</label>
              <input type="number" step="0.1" style={styles.input} value={formData.pesoSalidaPrevia} onChange={(e) => setFormData({ ...formData, pesoSalidaPrevia: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label style={styles.label}>Peso al Ingreso (kg)</label>
              <input type="number" step="0.1" style={styles.input} value={formData.pesoIngreso} onChange={(e) => setFormData({ ...formData, pesoIngreso: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>

          <div style={{ ...styles.grid3, marginTop: '16px' }}>
            <div>
              <label style={styles.label}>Ganancia Interdialítica</label>
              <div style={styles.calculatedValue}>{calcularGananciaID()} kg</div>
            </div>
            <div>
              <label style={styles.label}>UF Máx. Sugerida (&lt;13 ml/kg/h)</label>
              <div style={styles.calculatedValue}>{calcularUFMaxima()} L</div>
            </div>
            <div>
              <label style={styles.label}>UF Prescrita (ml)</label>
              <input type="number" step="100" style={styles.input} value={formData.ufPrescrita} onChange={(e) => setFormData({ ...formData, ufPrescrita: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
        </div>

        {/* Signos Vitales */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>❤️ Signos Vitales</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ ...styles.label, marginBottom: '12px', color: '#38bdf8' }}>📥 Al Ingreso</label>
            <div style={styles.grid3}>
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>TA (mmHg)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="number" style={{ ...styles.input, width: '80px' }} placeholder="Sist" value={formData.taIngreso?.sistolica} onChange={(e) => setFormData({ ...formData, taIngreso: { ...formData.taIngreso, sistolica: e.target.value } })} />
                  <span>/</span>
                  <input type="number" style={{ ...styles.input, width: '80px' }} placeholder="Diast" value={formData.taIngreso?.diastolica} onChange={(e) => setFormData({ ...formData, taIngreso: { ...formData.taIngreso, diastolica: e.target.value } })} />
                </div>
              </div>
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>FC (lpm)</label>
                <input type="number" style={styles.input} value={formData.fcIngreso} onChange={(e) => setFormData({ ...formData, fcIngreso: e.target.value })} />
              </div>
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>FR (rpm)</label>
                <input type="number" style={styles.input} value={formData.frIngreso} onChange={(e) => setFormData({ ...formData, frIngreso: e.target.value })} />
              </div>
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>Temp (°C)</label>
                <input type="number" step="0.1" style={styles.input} value={formData.tempIngreso} onChange={(e) => setFormData({ ...formData, tempIngreso: e.target.value })} />
              </div>
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>SpO2 (%)</label>
                <input type="number" style={styles.input} value={formData.spo2Ingreso} onChange={(e) => setFormData({ ...formData, spo2Ingreso: e.target.value })} />
              </div>
            </div>
          </div>

          <div>
            <label style={{ ...styles.label, marginBottom: '12px', color: '#34d399' }}>📤 Al Egreso</label>
            <div style={styles.grid3}>
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>TA (mmHg)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="number" style={{ ...styles.input, width: '80px' }} placeholder="Sist" value={formData.taEgreso?.sistolica} onChange={(e) => setFormData({ ...formData, taEgreso: { ...formData.taEgreso, sistolica: e.target.value } })} />
                  <span>/</span>
                  <input type="number" style={{ ...styles.input, width: '80px' }} placeholder="Diast" value={formData.taEgreso?.diastolica} onChange={(e) => setFormData({ ...formData, taEgreso: { ...formData.taEgreso, diastolica: e.target.value } })} />
                </div>
              </div>
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>FC (lpm)</label>
                <input type="number" style={styles.input} value={formData.fcEgreso} onChange={(e) => setFormData({ ...formData, fcEgreso: e.target.value })} />
              </div>
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>FR (rpm)</label>
                <input type="number" style={styles.input} value={formData.frEgreso} onChange={(e) => setFormData({ ...formData, frEgreso: e.target.value })} />
              </div>
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>Temp (°C)</label>
                <input type="number" step="0.1" style={styles.input} value={formData.tempEgreso} onChange={(e) => setFormData({ ...formData, tempEgreso: e.target.value })} />
              </div>
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>SpO2 (%)</label>
                <input type="number" style={styles.input} value={formData.spo2Egreso} onChange={(e) => setFormData({ ...formData, spo2Egreso: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        {/* Exploración Física */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🔍 Exploración Física</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ ...styles.label, marginBottom: '12px' }}>Estado General</label>
            <div style={styles.grid2}>
              <CheckboxItem label="Consciente" checked={formData.exploracionFisica?.consciente} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, consciente: v } })} />
              <CheckboxItem label="Orientado" checked={formData.exploracionFisica?.orientado} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, orientado: v } })} />
              <CheckboxItem label="Palidez" checked={formData.exploracionFisica?.palidez} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, palidez: v } })} />
              <CheckboxItem label="Ictericia" checked={formData.exploracionFisica?.ictericia} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, ictericia: v } })} />
              <CheckboxItem label="Deshidratación" checked={formData.exploracionFisica?.deshidratacion} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, deshidratacion: v } })} />
              <CheckboxItem label="Edema Facial" checked={formData.exploracionFisica?.edemaFacial} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, edemaFacial: v } })} />
              <CheckboxItem label="Ingurgitación Yugular" checked={formData.exploracionFisica?.ingurgitacionYugular} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, ingurgitacionYugular: v } })} />
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>Glasgow</label>
                <select style={styles.select} value={formData.exploracionFisica?.glasgow} onChange={(e) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, glasgow: parseInt(e.target.value) } })}>
                  {[15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ ...styles.label, marginBottom: '12px' }}>Campos Pulmonares</label>
            <div style={styles.grid2}>
              <CheckboxItem label="Bien Ventilados" checked={formData.exploracionFisica?.camposVentilados} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, camposVentilados: v, hipoventilados: v ? false : formData.exploracionFisica?.hipoventilados } })} />
              <CheckboxItem label="Hipoventilados" checked={formData.exploracionFisica?.hipoventilados} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, hipoventilados: v, camposVentilados: v ? false : formData.exploracionFisica?.camposVentilados } })} />
              <CheckboxItem label="Estertores" checked={formData.exploracionFisica?.estertores} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, estertores: v } })} />
              <CheckboxItem label="Sibilancias" checked={formData.exploracionFisica?.sibilancias} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, sibilancias: v } })} />
            </div>
            {formData.exploracionFisica?.estertores && (
              <div style={{ ...styles.grid2, marginTop: '12px' }}>
                <select style={styles.select} value={formData.exploracionFisica?.estertoresTipo} onChange={(e) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, estertoresTipo: e.target.value } })}>
                  <option value="">Tipo de estertores</option>
                  <option value="crepitantes">Crepitantes</option>
                  <option value="subcrepitantes">Subcrepitantes</option>
                  <option value="roncantes">Roncantes</option>
                </select>
                <select style={styles.select} value={formData.exploracionFisica?.estertoresLocalizacion} onChange={(e) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, estertoresLocalizacion: e.target.value } })}>
                  <option value="">Localización</option>
                  <option value="bilaterales">Bilaterales</option>
                  <option value="derecho">Hemitórax Derecho</option>
                  <option value="izquierdo">Hemitórax Izquierdo</option>
                  <option value="bases">Bases pulmonares</option>
                  <option value="apices">Ápices</option>
                </select>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ ...styles.label, marginBottom: '12px' }}>Cardiovascular</label>
            <div style={styles.grid2}>
              <select style={styles.select} value={formData.exploracionFisica?.ruidosCardiacos} onChange={(e) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, ruidosCardiacos: e.target.value } })}>
                <option value="ritmicos">Ruidos Rítmicos</option>
                <option value="arritmicos">Ruidos Arrítmicos</option>
                <option value="taquicardicos">Taquicárdicos</option>
                <option value="bradicardicos">Bradicárdicos</option>
              </select>
              <CheckboxItem label="Soplos Cardiacos" checked={formData.exploracionFisica?.soplosCardiacos} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, soplosCardiacos: v } })} />
              <CheckboxItem label="Frote Pericárdico" checked={formData.exploracionFisica?.frotePericardico} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, frotePericardico: v } })} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ ...styles.label, marginBottom: '12px' }}>Abdomen</label>
            <div style={styles.grid2}>
              <CheckboxItem label="Blando" checked={formData.exploracionFisica?.abdomenBlando} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, abdomenBlando: v } })} />
              <CheckboxItem label="Doloroso" checked={formData.exploracionFisica?.abdomenDoloroso} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, abdomenDoloroso: v } })} />
              <CheckboxItem label="Peristalsis Presente" checked={formData.exploracionFisica?.peristalsis} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, peristalsis: v } })} />
              <CheckboxItem label="Visceromegalias" checked={formData.exploracionFisica?.visceromegalias} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, visceromegalias: v } })} />
              <CheckboxItem label="Irritación Peritoneal" checked={formData.exploracionFisica?.irritacionPeritoneal} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, irritacionPeritoneal: v } })} />
              <CheckboxItem label="Ascitis" checked={formData.exploracionFisica?.ascitis} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, ascitis: v } })} />
            </div>
          </div>

          <div>
            <label style={{ ...styles.label, marginBottom: '12px' }}>Extremidades</label>
            <div style={styles.grid2}>
              <CheckboxItem label="Edema Inferior" checked={formData.exploracionFisica?.edemaInferior} onChange={(v) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, edemaInferior: v } })} />
              {formData.exploracionFisica?.edemaInferior && (
                <select style={styles.select} value={formData.exploracionFisica?.gradoEdema} onChange={(e) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, gradoEdema: e.target.value } })}>
                  <option value="">Grado</option>
                  <option value="+">+ (Leve)</option>
                  <option value="++">++ (Moderado)</option>
                  <option value="+++">+++ (Severo)</option>
                  <option value="++++">++++ (Anasarca)</option>
                </select>
              )}
              <select style={styles.select} value={formData.exploracionFisica?.llenado} onChange={(e) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, llenado: e.target.value } })}>
                <option value="menor_2seg">Llenado capilar &lt;2 seg</option>
                <option value="mayor_2seg">Llenado capilar &gt;2 seg</option>
              </select>
              <select style={styles.select} value={formData.exploracionFisica?.pulsos} onChange={(e) => setFormData({ ...formData, exploracionFisica: { ...formData.exploracionFisica, pulsos: e.target.value } })}>
                <option value="presentes">Pulsos presentes</option>
                <option value="disminuidos">Pulsos disminuidos</option>
                <option value="ausentes">Pulsos ausentes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Parámetros de Diálisis (Precargados) */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>⚙️ Parámetros de Diálisis <span style={{ fontSize: '12px', fontWeight: '400', color: '#94a3b8' }}>(Precargados de última sesión)</span></h3>
          <div style={styles.grid3}>
            <div>
              <label style={styles.label}>Tiempo de Sesión</label>
              <select style={styles.select} value={formData.tiempoSesion} onChange={(e) => setFormData({ ...formData, tiempoSesion: parseInt(e.target.value) })}>
                {TIEMPOS_SESION.map(t => <option key={t} value={t}>{t} min ({(t/60).toFixed(1)} hrs)</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Filtro (Dializador)</label>
              <select style={styles.select} value={formData.filtro} onChange={(e) => setFormData({ ...formData, filtro: e.target.value })}>
                {FILTROS.map(cat => (
                  <optgroup key={cat.categoria} label={cat.categoria}>
                    {cat.items.map(f => <option key={f} value={f}>{f}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.label}>QB (ml/min)</label>
              <input type="number" step="10" style={styles.input} value={formData.qb} onChange={(e) => setFormData({ ...formData, qb: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label style={styles.label}>QD (ml/min)</label>
              <input type="number" step="50" style={styles.input} value={formData.qd} onChange={(e) => setFormData({ ...formData, qd: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label style={styles.label}>Na (mEq/L)</label>
              <input type="number" style={styles.input} value={formData.na} onChange={(e) => setFormData({ ...formData, na: parseInt(e.target.value) || 138 })} />
            </div>
            <div>
              <label style={styles.label}>K (mEq/L)</label>
              <input type="number" step="0.5" style={styles.input} value={formData.k} onChange={(e) => setFormData({ ...formData, k: parseFloat(e.target.value) || 2 })} />
            </div>
            <div>
              <label style={styles.label}>Ca (mEq/L)</label>
              <input type="number" step="0.5" style={styles.input} value={formData.ca} onChange={(e) => setFormData({ ...formData, ca: parseFloat(e.target.value) || 3 })} />
            </div>
            <div>
              <label style={styles.label}>HCO3 (mEq/L)</label>
              <input type="number" style={styles.input} value={formData.hco3} onChange={(e) => setFormData({ ...formData, hco3: parseInt(e.target.value) || 35 })} />
            </div>
            <div>
              <label style={styles.label}>Temp. Dializante (°C)</label>
              <input type="number" step="0.5" style={styles.input} value={formData.temperatura} onChange={(e) => setFormData({ ...formData, temperatura: parseFloat(e.target.value) || 36 })} />
            </div>
            <div>
              <label style={styles.label}>Hep. Bolo (UI)</label>
              <input type="number" step="500" style={styles.input} value={formData.hepBolo} onChange={(e) => setFormData({ ...formData, hepBolo: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label style={styles.label}>Hep. Infusión (UI/h)</label>
              <input type="number" step="100" style={styles.input} value={formData.hepInfusion} onChange={(e) => setFormData({ ...formData, hepInfusion: parseInt(e.target.value) || 0 })} />
            </div>
          </div>

          <div style={{ ...styles.grid2, marginTop: '16px' }}>
            <CheckboxItem label="Perfil de Sodio" checked={formData.perfilNa} onChange={(v) => setFormData({ ...formData, perfilNa: v })} />
            <CheckboxItem label="Perfil de UF" checked={formData.perfilUF} onChange={(v) => setFormData({ ...formData, perfilUF: v })} />
          </div>

          {formData.tipoAcceso?.includes('cateter') && (
            <div style={{ marginTop: '16px' }}>
              <label style={styles.label}>Sellado de Catéter</label>
              <div style={styles.grid3}>
                <select style={styles.select} value={formData.tipoSellado} onChange={(e) => setFormData({ ...formData, tipoSellado: e.target.value })}>
                  <option value="citrato">Citrato de Sodio</option>
                  <option value="heparina">Heparina</option>
                  <option value="citralock">Citra-Lock 46.7%</option>
                </select>
                <div>
                  <label style={{ ...styles.label, fontSize: '11px' }}>Arterial (ml)</label>
                  <input type="number" step="0.1" style={styles.input} value={formData.selladoArterial} onChange={(e) => setFormData({ ...formData, selladoArterial: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label style={{ ...styles.label, fontSize: '11px' }}>Venoso (ml)</label>
                  <input type="number" step="0.1" style={styles.input} value={formData.selladoVenoso} onChange={(e) => setFormData({ ...formData, selladoVenoso: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
            </div>
          )}

          {/* Indicadores de adecuación */}
          <div style={{ marginTop: '16px' }}>
            <label style={styles.label}>Indicadores de Adecuación (Últimos disponibles)</label>
            <div style={styles.grid2}>
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>Kt/V</label>
                <input type="number" step="0.1" style={styles.input} value={formData.ktv} onChange={(e) => setFormData({ ...formData, ktv: e.target.value })} placeholder="≥1.2" />
              </div>
              <div>
                <label style={{ ...styles.label, fontSize: '11px' }}>URR (%)</label>
                <input type="number" style={styles.input} value={formData.urr} onChange={(e) => setFormData({ ...formData, urr: e.target.value })} placeholder="≥65%" />
              </div>
            </div>
          </div>
        </div>

        {/* Medicamentos (Colapsable) */}
        <div style={styles.cardCollapsible}>
          <div 
            style={styles.cardHeader}
            onClick={() => setMedicamentosExpandidos(!medicamentosExpandidos)}
          >
            <h3 style={{ ...styles.sectionTitle, marginBottom: 0 }}>💊 Medicamentos Actuales ({medicamentosPaciente.length})</h3>
            <span style={{ fontSize: '24px', transition: 'transform 0.3s', transform: medicamentosExpandidos ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
          </div>
          
          {medicamentosExpandidos && (
            <div style={styles.cardContent}>
              {medicamentosPaciente.map((med, index) => (
                <div key={med.id} style={styles.medicamentoCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <strong style={{ color: '#38bdf8' }}>{index + 1}. {med.nombre}</strong>
                      <span style={{ marginLeft: '10px', color: '#94a3b8' }}>{med.dosis}</span>
                    </div>
                    <button style={styles.buttonDanger} onClick={() => eliminarMedicamento(med.id)}>✕</button>
                  </div>
                  <div style={styles.grid3}>
                    <input 
                      type="text" 
                      style={{ ...styles.input, padding: '8px 12px', fontSize: '13px' }} 
                      value={med.dosis} 
                      onChange={(e) => editarMedicamento(med.id, 'dosis', e.target.value)}
                      placeholder="Dosis"
                    />
                    <select 
                      style={{ ...styles.select, padding: '8px 12px', fontSize: '13px' }}
                      value={med.via}
                      onChange={(e) => editarMedicamento(med.id, 'via', e.target.value)}
                    >
                      {VIAS_ADMINISTRACION.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <select 
                      style={{ ...styles.select, padding: '8px 12px', fontSize: '13px' }}
                      value={med.frecuencia}
                      onChange={(e) => editarMedicamento(med.id, 'frecuencia', e.target.value)}
                    >
                      <option value="">Frecuencia</option>
                      {FRECUENCIAS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <input 
                    type="text" 
                    style={{ ...styles.input, padding: '8px 12px', fontSize: '13px', marginTop: '8px' }} 
                    value={med.indicaciones || ''} 
                    onChange={(e) => editarMedicamento(med.id, 'indicaciones', e.target.value)}
                    placeholder="Indicaciones especiales..."
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                <button style={styles.button} onClick={() => setShowAgregarMedModal(true)}>
                  ➕ Agregar Medicamento
                </button>
                <button style={styles.buttonWarning} onClick={() => { setMedicamentosReceta([...medicamentosPaciente]); setShowRecetaModal(true); }}>
                  📝 Generar Receta
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Estado del Paciente */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📊 Estado del Paciente</h3>
          <div style={styles.grid2}>
            <CheckboxItem label="Bacteriemia" checked={formData.bacteriemia} onChange={(v) => setFormData({ ...formData, bacteriemia: v })} />
            <CheckboxItem label="Candidato a Trasplante" checked={formData.candidatoTrasplante} onChange={(v) => setFormData({ ...formData, candidatoTrasplante: v })} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <label style={styles.label}>Uresis Residual</label>
            <div style={styles.grid2}>
              <select style={styles.select} value={formData.uresiResidual} onChange={(e) => setFormData({ ...formData, uresiResidual: e.target.value })}>
                <option value="no_cuantificada">No cuantificada</option>
                <option value="anurico">Anúrico</option>
                <option value="cuantificada">Cuantificada</option>
              </select>
              {formData.uresiResidual === 'cuantificada' && (
                <input type="text" style={styles.input} placeholder="ml/día" value={formData.uresiCuantificada} onChange={(e) => setFormData({ ...formData, uresiCuantificada: e.target.value })} />
              )}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={styles.label}>Evolución de la Sesión</label>
            <div style={styles.grid2}>
              <CheckboxItem label="Estable, sin complicaciones" checked={formData.evolucionSesion === 'estable'} onChange={() => setFormData({ ...formData, evolucionSesion: 'estable', complicaciones: false })} />
              <CheckboxItem label="Con incidencias" checked={formData.evolucionSesion === 'complicaciones'} onChange={() => setFormData({ ...formData, evolucionSesion: 'complicaciones', complicaciones: true })} />
            </div>
            {formData.complicaciones && (
              <textarea style={{ ...styles.textarea, marginTop: '12px' }} placeholder="Describir complicaciones e intervenciones..." value={formData.tipoComplicacion} onChange={(e) => setFormData({ ...formData, tipoComplicacion: e.target.value })} />
            )}
          </div>
        </div>

        {/* Notas Extras */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📝 Notas Adicionales</h3>
          <textarea
            style={styles.textarea}
            placeholder="Información adicional: diarrea, escalofríos, solicita menos tiempo de sesión, pendientes de laboratorio, interconsultas, etc..."
            value={formData.notasExtras}
            onChange={(e) => setFormData({ ...formData, notasExtras: e.target.value })}
          />
        </div>

        {/* Médico */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>👨‍⚕️ Médico de Turno</h3>
          <select style={styles.select} value={formData.medicoId} onChange={(e) => setFormData({ ...formData, medicoId: parseInt(e.target.value) })}>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.nombre} - Céd. {d.cedula}</option>
            ))}
          </select>
        </div>

        {/* Botones de acción */}
        <div style={{ ...styles.card, display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button style={styles.buttonSecondary} onClick={() => { setSelectedPatient(null); setCurrentView('patients'); }}>
            Cancelar
          </button>
          <button style={styles.buttonWarning} onClick={() => { setMedicamentosReceta([...medicamentosPaciente]); setShowRecetaModal(true); }}>
            📝 Generar Receta
          </button>
          <button style={styles.button} onClick={generateNote}>
            ✨ Generar Nota de Hemodiálisis
          </button>
        </div>
      </div>
    );
  };

  // Vista Preview
  const PreviewView = () => (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>📄 Vista Previa de la Nota</h2>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={styles.badge}>{generatedNote?.paciente.expediente}</span>
          <span style={styles.badgeSuccess}>{generatedNote?.fecha}</span>
          <span style={styles.badge}>Sala {generatedNote?.sala} Turno {generatedNote?.turno}</span>
        </div>
        
        <div style={styles.notePreview}>{generatedNote?.texto}</div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px', flexWrap: 'wrap' }}>
          <button style={styles.buttonSecondary} onClick={() => setCurrentView('form')}>✏️ Editar</button>
          <button style={styles.buttonSuccess} onClick={addToPending}>✓ Guardar en Pendientes</button>
        </div>
      </div>
    </div>
  );

  // Vista Pendientes
  const PendingView = () => (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={styles.sectionTitle}>📋 Notas Pendientes ({pendingNotes.length})</h2>
          <button style={styles.buttonSecondary} onClick={() => setCurrentView('patients')}>← Volver</button>
        </div>

        {pendingNotes.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No hay notas pendientes</p>
        ) : (
          <>
            <div style={styles.grid}>
              {pendingNotes.map((note, index) => (
                <div key={note.id} style={styles.patientCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={styles.badge}>{note.paciente.expediente}</span>
                      <h4 style={{ marginTop: '8px', fontSize: '14px' }}>{note.paciente.nombre}</h4>
                      <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                        {note.fecha} - Sala {note.sala} Turno {note.turno}
                      </p>
                    </div>
                    <button style={styles.buttonDanger} onClick={() => setPendingNotes(pendingNotes.filter((_, i) => i !== index))}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button style={styles.buttonSuccess} onClick={uploadNotes}>
                📤 Subir {pendingNotes.length} Notas al HemoHL7
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Modal Médicos
  const DoctorModal = () => (
    <div style={styles.modal} onClick={() => setShowDoctorModal(false)}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: '20px' }}>👨‍⚕️ Gestionar Médicos</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Médicos Registrados:</h4>
          {doctors.map(d => (
            <div key={d.id} style={{ ...styles.infoRow, padding: '12px 0' }}>
              <span>{d.nombre}</span>
              <span style={{ color: '#64748b' }}>Céd. {d.cedula}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(56, 189, 248, 0.2)', paddingTop: '20px' }}>
          <h4 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Agregar Nuevo:</h4>
          <div style={styles.grid}>
            <input type="text" style={styles.input} placeholder="Nombre completo" value={newDoctor.nombre} onChange={(e) => setNewDoctor({ ...newDoctor, nombre: e.target.value })} />
            <input type="text" style={styles.input} placeholder="Cédula Profesional" value={newDoctor.cedula} onChange={(e) => setNewDoctor({ ...newDoctor, cedula: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input type="text" style={styles.input} placeholder="SSA (opcional)" value={newDoctor.ssa} onChange={(e) => setNewDoctor({ ...newDoctor, ssa: e.target.value })} />
              <input type="text" style={styles.input} placeholder="CMN (opcional)" value={newDoctor.cmn} onChange={(e) => setNewDoctor({ ...newDoctor, cmn: e.target.value })} />
            </div>
            <input type="text" style={styles.input} placeholder="Especialidad" value={newDoctor.especialidad} onChange={(e) => setNewDoctor({ ...newDoctor, especialidad: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button style={styles.buttonSecondary} onClick={() => setShowDoctorModal(false)}>Cerrar</button>
            <button style={styles.button} onClick={addDoctor}>Agregar Médico</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal Agregar Medicamento
  const AgregarMedicamentoModal = () => (
    <div style={styles.modal} onClick={() => setShowAgregarMedModal(false)}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: '20px' }}>➕ Agregar Medicamento</h3>
        
        <div style={styles.grid}>
          <div>
            <label style={styles.label}>Medicamento</label>
            <input 
              type="text" 
              style={styles.input} 
              placeholder="Nombre del medicamento"
              value={nuevoMedicamento.nombre}
              onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, nombre: e.target.value })}
              list="medicamentos-list"
            />
            <datalist id="medicamentos-list">
              {MEDICAMENTOS_CATALOGO.map(m => (
                <option key={m.nombre} value={m.nombre}>{m.categoria}</option>
              ))}
            </datalist>
          </div>
          <div>
            <label style={styles.label}>Dosis</label>
            <input 
              type="text" 
              style={styles.input} 
              placeholder="ej. 500 mg"
              value={nuevoMedicamento.dosis}
              onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, dosis: e.target.value })}
            />
          </div>
          <div>
            <label style={styles.label}>Vía de Administración</label>
            <select style={styles.select} value={nuevoMedicamento.via} onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, via: e.target.value })}>
              {VIAS_ADMINISTRACION.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>Frecuencia</label>
            <select style={styles.select} value={nuevoMedicamento.frecuencia} onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, frecuencia: e.target.value })}>
              <option value="">Seleccionar</option>
              {FRECUENCIAS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>Indicaciones</label>
            <input 
              type="text" 
              style={styles.input} 
              placeholder="Indicaciones especiales..."
              value={nuevoMedicamento.indicaciones}
              onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, indicaciones: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button style={styles.buttonSecondary} onClick={() => setShowAgregarMedModal(false)}>Cancelar</button>
          <button style={styles.button} onClick={agregarMedicamentoPaciente}>Agregar</button>
        </div>
      </div>
    </div>
  );

  // Modal Receta
  const RecetaModal = () => (
    <div style={styles.modal} onClick={() => setShowRecetaModal(false)}>
      <div style={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: '20px' }}>📝 Generar Receta Médica</h3>
        
        <p style={{ color: '#94a3b8', marginBottom: '16px', fontSize: '14px' }}>
          Selecciona los medicamentos que deseas incluir en la receta. Conforme a NOM-004-SSA3-2012.
        </p>

        {/* Medicamentos disponibles */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>Medicamentos del Paciente:</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {medicamentosPaciente.map(med => (
              <button
                key={med.id}
                style={{
                  ...styles.buttonSmall,
                  background: medicamentosReceta.find(m => m.id === med.id) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(14, 165, 233, 0.2)',
                  borderColor: medicamentosReceta.find(m => m.id === med.id) ? '#34d399' : 'rgba(56, 189, 248, 0.3)'
                }}
                onClick={() => {
                  if (medicamentosReceta.find(m => m.id === med.id)) {
                    eliminarDeReceta(med.id);
                  } else {
                    agregarAReceta(med);
                  }
                }}
              >
                {medicamentosReceta.find(m => m.id === med.id) ? '✓' : '+'} {med.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Agregar medicamento nuevo a receta */}
        <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '10px' }}>
          <label style={styles.label}>Agregar medicamento adicional a la receta:</label>
          <div style={{ ...styles.grid3, marginTop: '8px' }}>
            <input 
              type="text" 
              style={styles.input} 
              placeholder="Medicamento"
              value={nuevoMedicamento.nombre}
              onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, nombre: e.target.value })}
              list="medicamentos-list-receta"
            />
            <datalist id="medicamentos-list-receta">
              {MEDICAMENTOS_CATALOGO.map(m => <option key={m.nombre} value={m.nombre} />)}
            </datalist>
            <input 
              type="text" 
              style={styles.input} 
              placeholder="Dosis"
              value={nuevoMedicamento.dosis}
              onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, dosis: e.target.value })}
            />
            <select style={styles.select} value={nuevoMedicamento.via} onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, via: e.target.value })}>
              {VIAS_ADMINISTRACION.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select style={styles.select} value={nuevoMedicamento.frecuencia} onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, frecuencia: e.target.value })}>
              <option value="">Frecuencia</option>
              {FRECUENCIAS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <input 
              type="text" 
              style={styles.input} 
              placeholder="Duración (ej. 30 días)"
              value={nuevoMedicamento.duracion}
              onChange={(e) => setNuevoMedicamento({ ...nuevoMedicamento, duracion: e.target.value })}
            />
            <button style={styles.buttonSmall} onClick={() => {
              if (nuevoMedicamento.nombre && nuevoMedicamento.dosis) {
                setMedicamentosReceta([...medicamentosReceta, { ...nuevoMedicamento, id: Date.now() }]);
                setNuevoMedicamento({ nombre: '', dosis: '', frecuencia: '', via: 'VO', duracion: '', indicaciones: '' });
              }
            }}>
              ➕ Agregar a Receta
            </button>
          </div>
        </div>

        {/* Medicamentos en la receta */}
        <div style={{ marginBottom: '20px' }}>
          <label style={styles.label}>Medicamentos en la Receta ({medicamentosReceta.length}):</label>
          {medicamentosReceta.length === 0 ? (
            <p style={{ color: '#64748b', padding: '20px', textAlign: 'center' }}>No hay medicamentos seleccionados</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Medicamento</th>
                  <th style={styles.th}>Dosis</th>
                  <th style={styles.th}>Vía</th>
                  <th style={styles.th}>Frecuencia</th>
                  <th style={styles.th}>Duración</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {medicamentosReceta.map((med, index) => (
                  <tr key={med.id}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}><strong>{med.nombre}</strong></td>
                    <td style={styles.td}>{med.dosis}</td>
                    <td style={styles.td}>{med.via}</td>
                    <td style={styles.td}>{med.frecuencia}</td>
                    <td style={styles.td}>
                      <input 
                        type="text" 
                        style={{ ...styles.input, padding: '6px 10px', fontSize: '12px', width: '100px' }}
                        value={med.duracion || ''}
                        onChange={(e) => {
                          setMedicamentosReceta(medicamentosReceta.map(m => 
                            m.id === med.id ? { ...m, duracion: e.target.value } : m
                          ));
                        }}
                        placeholder="30 días"
                      />
                    </td>
                    <td style={styles.td}>
                      <button style={{ ...styles.buttonDanger, padding: '4px 8px' }} onClick={() => eliminarDeReceta(med.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button style={styles.buttonSecondary} onClick={() => setShowRecetaModal(false)}>Cancelar</button>
          <button 
            style={styles.buttonSuccess} 
            onClick={() => {
              generarReceta();
              setShowRecetaModal(false);
            }}
            disabled={medicamentosReceta.length === 0}
          >
            🖨️ Imprimir Receta
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================
  // RENDER PRINCIPAL
  // ============================================

  return (
    <div style={styles.app}>
      {isAuthenticated && (
        <header style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🩺</div>
            <div>
              <span style={styles.logoText}>HemoNotas</span>
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>v2.0</span>
            </div>
          </div>
          <div style={styles.nav}>
            <button
              style={{ ...styles.navButton, ...(currentView === 'patients' || currentView === 'form' ? styles.navButtonActive : {}) }}
              onClick={() => { setCurrentView('patients'); setSelectedPatient(null); }}
            >
              Pacientes
            </button>
            {pendingNotes.length > 0 && (
              <button
                style={{ ...styles.navButton, ...(currentView === 'pending' ? styles.navButtonActive : {}) }}
                onClick={() => setCurrentView('pending')}
              >
                Pendientes ({pendingNotes.length})
              </button>
            )}
            <button style={styles.navButton} onClick={() => { setIsAuthenticated(false); setCurrentView('login'); }}>
              Salir
            </button>
          </div>
        </header>
      )}

      {currentView === 'login' && <LoginView />}
      {currentView === 'patients' && <PatientsView />}
      {currentView === 'form' && <FormView />}
      {currentView === 'preview' && <PreviewView />}
      {currentView === 'pending' && <PendingView />}

      {showDoctorModal && <DoctorModal />}
      {showAgregarMedModal && <AgregarMedicamentoModal />}
      {showRecetaModal && <RecetaModal />}
    </div>
  );
}
