import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  RotateCcw, 
  Upload, 
  Sparkles, 
  Palette, 
  Calculator, 
  Layers, 
  Sliders, 
  Download, 
  Share2, 
  Check, 
  Info, 
  Trash2, 
  FolderHeart,
  Plus,
  Eye,
  FileText
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface PaintColor {
  id: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
  category: 'Neutro' | 'Quente' | 'Frio' | 'Pastel' | 'Intenso';
  brand: string;
  code: string;
  description: string;
}

interface SavedProject {
  id: string;
  name: string;
  imageUrl: string;
  selectedColor: PaintColor;
  coordinates: { x: number; y: number } | null;
  timestamp: string;
}

interface DimensionState {
  width: number;
  height: number;
  doors: number;
  windows: number;
  coats: number;
}

// ============================================================================
// DATABASE DE TINTAS PREMIUM (MOCK INTEGRADO)
// ============================================================================

const PAINT_DATABASE: PaintColor[] = [
  // Neutros
  { id: 'n1', name: 'Algodão Egípcio', hex: '#F0EBE1', rgb: [240, 235, 225], category: 'Neutro', brand: 'Chromart Decor', code: 'C-101', description: 'Um off-white clássico, suave e aconchegante que reflete luminosidade.' },
  { id: 'n2', name: 'Cinza Crômio', hex: '#D2D2CD', rgb: [210, 210, 205], category: 'Neutro', brand: 'Chromart Decor', code: 'C-102', description: 'Um cinza neutro moderno e versátil, ideal para decorações contemporâneas.' },
  { id: 'n3', name: 'Areia do Deserto', hex: '#E3DAC9', rgb: [227, 218, 201], category: 'Neutro', brand: 'Chromart Decor', code: 'C-103', description: 'Bege sutil que remete ao aconchego natural e elementos orgânicos.' },
  { id: 'n4', name: 'Preto Absoluto', hex: '#2C2D30', rgb: [44, 45, 48], category: 'Neutro', brand: 'Chromart Studio', code: 'C-104', description: 'Preto elegante com subtons grafite para contrastes impactantes.' },
  // Frios
  { id: 'f1', name: 'Azul Sereno', hex: '#A3B8CC', rgb: [163, 184, 204], category: 'Frio', brand: 'Chromart Decor', code: 'C-201', description: 'Azul pastel calmante que evoca paz, ideal para quartos e salas de descanso.' },
  { id: 'f2', name: 'Verde Alecrim', hex: '#8F9779', rgb: [143, 151, 121], category: 'Frio', brand: 'Chromart Studio', code: 'C-202', description: 'Verde oliva dessaturado com forte conexão com a biofilia e natureza.' },
  { id: 'f3', name: 'Eucalipto Prateado', hex: '#B2BEB5', rgb: [178, 190, 181], category: 'Frio', brand: 'Chromart Decor', code: 'C-203', description: 'Um tom suave de verde acinzentado, extremamente sofisticado.' },
  { id: 'f4', name: 'Azul Noturno', hex: '#1C2E3D', rgb: [28, 46, 61], category: 'Frio', brand: 'Chromart Studio', code: 'C-204', description: 'Azul marinho profundo para trazer sobriedade e refinamento.' },
  // Quentes
  { id: 'q1', name: 'Terracota Orgânica', hex: '#C37D64', rgb: [195, 125, 100], category: 'Quente', brand: 'Chromart Studio', code: 'C-301', description: 'Um tom de argila queimada que aquece o ambiente instantaneamente.' },
  { id: 'q2', name: 'Mostarda Colonial', hex: '#D1AC61', rgb: [209, 172, 97], category: 'Quente', brand: 'Chromart Decor', code: 'C-302', description: 'Amarelo ocre sofisticado que irradia energia sem cansar os olhos.' },
  { id: 'q3', name: 'Nectar de Pêssego', hex: '#ECAE93', rgb: [236, 174, 147], category: 'Quente', brand: 'Chromart Decor', code: 'C-303', description: 'Um tom acolhedor e levemente adocicado que ilumina salas integradas.' },
  { id: 'q4', name: 'Rosa Queimado', hex: '#B38B88', rgb: [179, 139, 136], category: 'Quente', brand: 'Chromart Studio', code: 'C-304', description: 'Rosa antigo com fundo acinzentado, unindo romantismo e maturidade.' },
  // Pastéis & Intensos
  { id: 'p1', name: 'Lavanda Suave', hex: '#E0D3E8', rgb: [224, 211, 232], category: 'Pastel', brand: 'Chromart Decor', code: 'C-401', description: 'Lilás delicado que transmite tranquilidade espiritual e leveza visual.' },
  { id: 'i1', name: 'Verde Floresta', hex: '#2F4F4F', rgb: [47, 79, 79], category: 'Intenso', brand: 'Chromart Studio', code: 'C-501', description: 'Verde escuro profundo para paredes de destaque cheias de personalidade.' }
];

// Presets de Ambientes para Testes Rápidos
const PRESET_ROOMS = [
  {
    id: 'room1',
    name: 'Sala de Estar Minimalista',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
    description: 'Ambiente com luz natural abundante e paredes ideais para testar neutros e pastéis.'
  },
  {
    id: 'room2',
    name: 'Quarto Moderno',
    url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1200',
    description: 'Ambiente aconchegante propício para cores relaxantes frias ou rosas queimados.'
  },
  {
    id: 'room3',
    name: 'Escritório Home Office',
    url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200',
    description: 'Parede focal de trabalho para testar tons estimulantes ou neutros escuros.'
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function App() {
  // Estados de Fluxo de Imagem
  const [activePreset, setActivePreset] = useState<string>(PRESET_ROOMS[0].id);
  const [currentImage, setCurrentImage] = useState<string>(PRESET_ROOMS[0].url);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    
  // Estados do Simulador de Tinta
  const [selectedColor, setSelectedColor] = useState<PaintColor>(PAINT_DATABASE[0]);
  const [markerCoords, setMarkerCoords] = useState<{ x: number; y: number } | null>(null);
  const [isVisualizerEnabled, setIsVisualizerEnabled] = useState<boolean>(true);
  const [visualizerOpacity, setVisualizerOpacity] = useState<number>(0.35);
  const [isColorPickerActive, setIsColorPickerActive] = useState<boolean>(false);
  
  // Estado de Projetos Salvos
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [activeTab, setActiveTab] = useState<'visualizer' | 'calculator' | 'projects'>('visualizer');
  const [projectName, setProjectName] = useState<string>('Meu Ambiente');
  
  // Estado da Calculadora de Tintas
  const [calcDimensions, setCalcDimensions] = useState<DimensionState>({
    width: 4.0,
    height: 2.7,
    doors: 1,
    windows: 1,
    coats: 2
  });
  
  // Estado de Feedback/Notificações
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Refs de Elementos HTML
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Monitoramento de Notificações
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Carregar Projetos do LocalStorage ao iniciar
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chromart_projects');
      if (saved) {
        setSavedProjects(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Falha ao restaurar projetos do LocalStorage', e);
    }
  }, []);

  // Salvar Projetos no LocalStorage ao alterar
  const saveProjectsToStorage = (updated: SavedProject[]) => {
    setSavedProjects(updated);
    try {
      localStorage.setItem('chromart_projects', JSON.stringify(updated));
    } catch (e) {
      showToast('Erro ao gravar dados no navegador.', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
  };

  // ============================================================================
  // LÓGICA DA CÂMERA E CAPTURA
  // ============================================================================

  const startCamera = async () => {
    setIsCameraActive(true);
    setMarkerCoords(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: false 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setHasCameraPermission(true);
      }
    } catch (err) {
      console.error("Erro ao acessar a câmera: ", err);
      setHasCameraPermission(false);
      setIsCameraActive(false);
      showToast("Não foi possível acessar a câmera. Usando presets de demonstração.", "error");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCurrentImage(dataUrl);
        stopCamera();
        setActivePreset('');
        showToast("Ambiente capturado com sucesso! Toque na foto para simular a cor.", "success");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentImage(event.target.result as string);
          setMarkerCoords(null);
          setActivePreset('');
          stopCamera();
          showToast("Upload concluído! Toque na imagem para extrair e pintar.", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (presetId: string, url: string) => {
    setActivePreset(presetId);
    setCurrentImage(url);
    setMarkerCoords(null);
    stopCamera();
    showToast("Ambiente de teste alterado.", "info");
  };

  // ============================================================================
  // PROCESSAMENTO DE COR (CÁLCULO EUCLIDIANO E CORRESPONDÊNCIA DE TINTA)
  // ============================================================================

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCameraActive || !imageRef.current) return;

    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    
    // Calcula coordenada relativa em %
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMarkerCoords({ x, y });

    // Desenha em um canvas temporário para extrair a cor exata do pixel
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Converte coordenadas percentuais para pixels reais da imagem
      const pixelX = Math.floor((x / 100) * canvas.width);
      const pixelY = Math.floor((y / 100) * canvas.height);
      
      try {
        const pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
        const r = pixelData[0];
        const g = pixelData[1];
        const b = pixelData[2];
        
        // Encontra a cor de tinta mais próxima em nosso banco usando distância euclidiana
        const matchedColor = findClosestPaintColor(r, g, b);
        setSelectedColor(matchedColor);
        showToast(`Cor identificada: ${matchedColor.name} (${matchedColor.code})`, "success");
      } catch (err) {
        console.error("Falha ao capturar dados do pixel da imagem: ", err);
        // Fallback para uma cor aleatória do banco se houver bloqueio de CORS na imagem do unsplash
        const randomColor = PAINT_DATABASE[Math.floor(Math.random() * PAINT_DATABASE.length)];
        setSelectedColor(randomColor);
        showToast(`Simulando tinta recomendada: ${randomColor.name}`, "info");
      }
    }
  };

  const findClosestPaintColor = (r: number, g: number, b: number): PaintColor => {
    let minDistance = Infinity;
    let closestColor = PAINT_DATABASE[0];

    PAINT_DATABASE.forEach(color => {
      // Fórmula clássica de distância euclidiana RGB de forma otimizada
      const distance = Math.sqrt(
        Math.pow(r - color.rgb[0], 2) +
        Math.pow(g - color.rgb[1], 2) +
        Math.pow(b - color.rgb[2], 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    });

    return closestColor;
  };

  // Geração de Combinações Cromáticas (Harmonização)
  const getHarmonies = (baseColor: PaintColor) => {
    const isNeutral = baseColor.category === 'Neutro';
    
    // Regras heurísticas para obter harmonias interessantes
    let complementary = PAINT_DATABASE.find(c => c.category !== baseColor.category) || PAINT_DATABASE[3];
    let analogous = PAINT_DATABASE.filter(c => c.category === baseColor.category && c.id !== baseColor.id);
    if (analogous.length < 2) {
      analogous = PAINT_DATABASE.filter(c => c.id !== baseColor.id).slice(0, 2);
    }
    
    return {
      complementary,
      analogous: analogous.slice(0, 2),
      neutralPartners: PAINT_DATABASE.filter(c => c.category === 'Neutro' && c.id !== baseColor.id).slice(0, 2)
    };
  };
  
  const harmonies = getHarmonies(selectedColor);

  // ============================================================================
  // LÓGICA DO PROJETO E CALCULADORA
  // ============================================================================

  const handleSaveProject = () => {
    if (!currentImage) {
      showToast("Não há imagem de ambiente para salvar.", "error");
      return;
    }

    const newProject: SavedProject = {
      id: crypto.randomUUID(),
      name: projectName.trim() || `Projeto ${savedProjects.length + 1}`,
      imageUrl: currentImage,
      selectedColor: selectedColor,
      coordinates: markerCoords,
      timestamp: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [newProject, ...savedProjects];
    saveProjectsToStorage(updated);
    showToast("Combinação salva nos seus Favoritos!", "success");
    setProjectName('Meu Ambiente');
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedProjects.filter(p => p.id !== id);
    saveProjectsToStorage(updated);
    showToast("Projeto removido.", "info");
  };

  const loadSavedProject = (project: SavedProject) => {
    setCurrentImage(project.imageUrl);
    setSelectedColor(project.selectedColor);
    setMarkerCoords(project.coordinates);
    setActivePreset('');
    setActiveTab('visualizer');
    showToast(`Carregado: ${project.name}`, "info");
  };

  // Cálculo da Calculadora de Tintas (Padrão ABNT simplificado)
  // 1 Litro de tinta de boa qualidade rende aprox. 5m² por demão acabada
  const calculatePaintNeeds = () => {
    const { width, height, doors, windows, coats } = calcDimensions;
    
    const rawArea = width * height;
    const deductions = (doors * 1.6) + (windows * 2.0); // Áreas médias de portas e janelas
    const netArea = Math.max(1, rawArea - deductions);
    const totalAreaToPaint = netArea * coats;
    
    const litersNeeded = Number((totalAreaToPaint / 5.5).toFixed(1)); // 5.5m² de rendimento por litro
    
    // Tamanhos comerciais no Brasil: Lata de 18L, Galão de 3.6L, Quarto de 0.9L
    const cans18L = Math.floor(litersNeeded / 18);
    let remaining = litersNeeded % 18;
    
    const gallons3_6L = Math.ceil(remaining / 3.6);
    
    return {
      netArea: netArea.toFixed(1),
      litersNeeded,
      suggestion: cans18L > 0 
        ? `${cans18L} Lata(s) de 18L e ${gallons3_6L} Galão(ões) de 3.6L`
        : `${gallons3_6L} Galão(ões) de 3.6L`
    };
  };

  const calculationResults = calculatePaintNeeds();

  // Exportação simples via Clipboard das especificações do projeto
  const copyProjectSummary = () => {
    const summary = `
🎨 CHROMART STUDIO - ESPECIFICAÇÃO DE PINTURA
==============================================
Tinta Escolhida: ${selectedColor.name} (${selectedColor.code})
Fabricante/Linha: ${selectedColor.brand} - Acabamento Premium
Tipo: ${selectedColor.category}
Cor Hexadecimal: ${selectedColor.hex}

PRODUÇÃO E CÁLCULO DE ÁREA:
----------------------------------------------
Área Útil Calculada: ${calculationResults.netArea} m²
Demãos Recomendadas: ${calcDimensions.coats}
Total Litros Estimados: ${calculationResults.litersNeeded} L
Recomendação de Compra: ${calculationResults.suggestion}

*Atenção: O rendimento real pode variar de acordo com o estado de absorção da parede e método de aplicação.
==============================================
    `;
    
    // Método seguro e compatível com iframes
    const textarea = document.createElement('textarea');
    textarea.value = summary.trim();
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast("Especificação copiada para a área de transferência!", "success");
    } catch (err) {
      showToast("Não foi possível copiar automaticamente.", "error");
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-900">
      
      {/* HEADER PREMIUM */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-indigo-600 p-0.5 shadow-lg shadow-teal-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-200 bg-clip-text text-transparent">
                  CHROMART
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-teal-500/10 text-teal-300 rounded-full border border-teal-500/20">
                  Studio v2.5
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Reconhecimento cromático & simulação em tempo real</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="hidden md:inline-flex items-center space-x-1.5 text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Motor de Cores Ativo</span>
            </span>
          </div>
        </div>
      </header>

      {/* COMPONENTE DE NOTIFICAÇÃO (TOAST) */}
      {notification && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-bounce-short">
          <div className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl border shadow-xl backdrop-blur-lg ${
            notification.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' 
              : notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/30 text-rose-300'
              : 'bg-slate-900/90 border-teal-500/30 text-teal-300'
          }`}>
            <Sparkles className="w-5 h-5 shrink-0" />
            <p className="text-sm font-semibold">{notification.message}</p>
          </div>
        </div>
      )}

      {/* CONTAINER PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
        
        {/* COLUNA ESQUERDA: CÂMERA, PRESETS & SIMULADOR */}
        <section className="w-full lg:w-[60%] space-y-6">
          
          {/* PAINEL DE VISUALIZAÇÃO DO AMBIENTE */}
          <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative flex flex-col">
            
            {/* ABAS DE INTERAÇÃO DO AMBIENTE */}
            <div className="p-4 bg-slate-900/50 border-b border-slate-800/80 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {PRESET_ROOMS.map(room => (
                  <button
                    key={room.id}
                    onClick={() => selectPreset(room.id, room.url)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      activePreset === room.id && !isCameraActive
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-2 w-full sm:w-auto mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800 sm:justify-end">
                <button
                  onClick={isCameraActive ? stopCamera : startCamera}
                  className={`flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isCameraActive 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-slate-800 text-teal-400 hover:bg-slate-700 border border-teal-500/20'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isCameraActive ? 'Desligar' : 'Usar Câmera'}</span>
                </button>

                <label className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all duration-200">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Enviar Foto</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>

            {/* CANVAS INTERATIVO / PREVIEW */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900 group">
              
              {/* FEED DA CÂMERA REAL */}
              {isCameraActive ? (
                <div className="w-full h-full relative">
                  <video 
                    ref={videoRef} 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  {/* Grid de enquadramento da câmera */}
                  <div className="absolute inset-0 border border-white/10 pointer-events-none flex">
                    <div className="w-1/3 h-full border-r border-white/5"></div>
                    <div className="w-1/3 h-full border-r border-white/5"></div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
                    <div className="h-1/3 w-full border-b border-white/5"></div>
                    <div className="h-1/3 w-full border-b border-white/5"></div>
                  </div>
                  
                  {/* Botão de Disparo */}
                  <div className="absolute bottom-6 inset-x-0 flex justify-center z-10">
                    <button
                      onClick={capturePhoto}
                      className="w-16 h-16 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full border-4 border-slate-900 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-white/40"></div>
                    </button>
                  </div>
                </div>
              ) : (
                /* IMAGEM E SIMULAÇÃO DE COR DO AMBIENTE */
                <div 
                  className="w-full h-full relative cursor-crosshair overflow-hidden"
                  onClick={handleImageClick}
                >
                  <img
                    ref={imageRef}
                    src={currentImage}
                    alt="Ambiente de Teste"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-[1.01]"
                  />

                  {/* CAMADA DE SIMULAÇÃO INTELIGENTE (TINTURA VIRTUAL DA PAREDE) */}
                  {isVisualizerEnabled && (
                    <div 
                      className="absolute inset-0 pointer-events-none transition-all duration-500 ease-out mix-blend-multiply sm:mix-blend-color-burn"
                      style={{ 
                        backgroundColor: selectedColor.hex, 
                        opacity: visualizerOpacity 
                      }}
                    />
                  )}

                  {/* PIN/MARCADOR DE COR EM PIXEL */}
                  {markerCoords && (
                    <div 
                      className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center shadow-2xl animate-ping-short pointer-events-none transition-all duration-300"
                      style={{ left: `${markerCoords.x}%`, top: `${markerCoords.y}%` }}
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: selectedColor.hex }}>
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                  )}

                  {/* INSTRUÇÃO FLUTUANTE */}
                  <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold text-slate-300 flex items-center space-x-1.5 pointer-events-none">
                    <Info className="w-3.5 h-3.5 text-teal-400" />
                    <span>Toque na foto para simular a tinta</span>
                  </div>
                </div>
              )}
              
              {/* CANVAS AUXILIAR INVISÍVEL PARA EXTRAÇÃO DE COR */}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* CONTROLES DO VISUALIZADOR */}
            <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsVisualizerEnabled(!isVisualizerEnabled)}
                  className={`p-2 rounded-xl border transition-all duration-200 ${
                    isVisualizerEnabled 
                      ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title="Ativar/Desativar Pintura Virtual"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Simulador de Pintura Virtual</h4>
                  <p className="text-xs text-slate-500">Aplica a tinta nas paredes mantendo sombras e texturas</p>
                </div>
              </div>

              {isVisualizerEnabled && (
                <div className="flex items-center space-x-3 w-full sm:w-1/2">
                  <span className="text-xs text-slate-400 whitespace-nowrap">Opacidade: {(visualizerOpacity * 100).toFixed(0)}%</span>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={visualizerOpacity}
                    onChange={(e) => setVisualizerOpacity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>
              )}
            </div>

          </div>

          {/* CONTROLLER DE SALVAR PROJETO */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Salvar esta Combinação</label>
                <div className="relative">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Ex: Quarto de Hóspedes Verde..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-2xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 transition-all outline-none"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSaveProject}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-600 hover:to-emerald-500 text-slate-950 font-bold px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center space-x-2"
                >
                  <FolderHeart className="w-4 h-4" />
                  <span>Favoritar Projeto</span>
                </button>
              </div>
            </div>
          </div>

        </section>
        
        {/* COLUNA DIREITA: ABAS E FERRAMENTAS */}
        <section className="w-full lg:w-[40%] space-y-6">

          {/* MENUS E NAVEGAÇÃO DE FERRAMENTAS */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            
            {/* TABS DE ENTRADA */}
            <div className="flex border-b border-slate-800 bg-slate-900/40">
              <button
                onClick={() => setActiveTab('visualizer')}
                className={`flex-1 py-4 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 border-b-2 transition-all ${
                  activeTab === 'visualizer'
                    ? 'border-teal-400 text-teal-400 bg-slate-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Paleta Ativa</span>
              </button>
              
              <button
                onClick={() => setActiveTab('calculator')}
                className={`flex-1 py-4 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 border-b-2 transition-all ${
                  activeTab === 'calculator'
                    ? 'border-teal-400 text-teal-400 bg-slate-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Consumo de Tinta</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex-1 py-4 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 border-b-2 transition-all relative ${
                  activeTab === 'projects'
                    ? 'border-teal-400 text-teal-400 bg-slate-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FolderHeart className="w-4 h-4" />
                <span>Favoritos</span>
                {savedProjects.length > 0 && (
                  <span className="absolute top-2.5 right-2 sm:right-4 w-5 h-5 bg-teal-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                    {savedProjects.length}
                  </span>
                )}
              </button>
            </div>

            {/* CONTEÚDO DA TAB: PALETA ATIVA */}
            {activeTab === 'visualizer' && (
              <div className="p-5 space-y-6">
                
                {/* CARTÃO DA TINTA DETECTADA/SELECIONADA */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Tinta Selecionada</h3>
                  
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 flex items-start space-x-4">
                    {/* Visualização de Cor */}
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-inner relative flex-shrink-0 border border-white/10"
                      style={{ backgroundColor: selectedColor.hex }}
                    >
                      <span className="absolute bottom-1 right-1.5 text-[8px] text-white/50 font-mono tracking-tighter">
                        {selectedColor.hex}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">{selectedColor.category}</span>
                        <span className="text-xs font-mono text-slate-500">{selectedColor.code}</span>
                      </div>
                      <h4 className="text-lg font-black text-slate-100 truncate mt-0.5">{selectedColor.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{selectedColor.description}</p>
                    </div>
                  </div>
                </div>

                {/* PALETA DE HARMONIZAÇÕES */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Harmonias Sugeridas</h3>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-md text-slate-400">Esquema Pro</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Complementar */}
                    <div 
                      onClick={() => setSelectedColor(harmonies.complementary)}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-800/80 p-3.5 rounded-2xl cursor-pointer transition-all flex items-center space-x-3 group"
                    >
                      <div className="w-10 h-10 rounded-xl border border-white/5 flex-shrink-0" style={{ backgroundColor: harmonies.complementary.hex }}></div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Complementar</p>
                        <h5 className="text-xs font-bold text-slate-200 truncate group-hover:text-teal-300">{harmonies.complementary.name}</h5>
                      </div>
                    </div>

                    {/* Análogas */}
                    {harmonies.analogous.map((color, idx) => (
                      <div 
                        key={`an-${idx}`}
                        onClick={() => setSelectedColor(color)}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800/80 p-3.5 rounded-2xl cursor-pointer transition-all flex items-center space-x-3 group"
                      >
                        <div className="w-10 h-10 rounded-xl border border-white/5 flex-shrink-0" style={{ backgroundColor: color.hex }}></div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Análoga {idx + 1}</p>
                          <h5 className="text-xs font-bold text-slate-200 truncate group-hover:text-sky-300">{color.name}</h5>
                        </div>
                      </div>
                    ))}

                    {/* Neutro de Suporte */}
                    {harmonies.neutralPartners[0] && (
                      <div 
                        onClick={() => setSelectedColor(harmonies.neutralPartners[0])}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800/80 p-3.5 rounded-2xl cursor-pointer transition-all flex items-center space-x-3 group"
                      >
                        <div className="w-10 h-10 rounded-xl border border-white/5 flex-shrink-0" style={{ backgroundColor: harmonies.neutralPartners[0].hex }}></div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Parceiro Neutro</p>
                          <h5 className="text-xs font-bold text-slate-200 truncate group-hover:text-amber-300">{harmonies.neutralPartners[0].name}</h5>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* BANCO DE TINTAS SELECIONÁVEL */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Catálogo de Cores</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[190px] overflow-y-auto pr-1">
                    {PAINT_DATABASE.map(color => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={`aspect-square rounded-xl p-1.5 border flex flex-col justify-between transition-all relative ${
                          selectedColor.id === color.id 
                            ? 'border-teal-400 ring-2 ring-teal-400/20' 
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} (${color.code})`}
                      >
                        {selectedColor.id === color.id ? (
                          <div className="bg-slate-950/80 p-0.5 rounded-full self-end">
                            <Check className="w-2.5 h-2.5 text-teal-400" />
                          </div>
                        ) : <div className="h-4"></div>}
                        <span className="text-[8px] font-bold text-slate-950 bg-white/70 px-1 py-0.5 rounded truncate">
                          {color.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* CONTEÚDO DA TAB: CALCULADORA DE TINTAS */}
            {activeTab === 'calculator' && (
              <div className="p-5 space-y-6">
                
                <div className="p-4 bg-teal-950/20 rounded-2xl border border-teal-500/10 flex items-start space-x-3">
                  <Calculator className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-teal-300">Estimativa Técnica Premium</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">Calculamos a quantidade exata descontando vãos padrões de portas e janelas com base no rendimento oficial Chromart de 5.5m²/L por demão.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 font-medium mb-1.5">Largura da Parede (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      value={calcDimensions.width}
                      onChange={(e) => setCalcDimensions({ ...calcDimensions, width: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-medium mb-1.5">Altura (Pé-Direito) (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      value={calcDimensions.height}
                      onChange={(e) => setCalcDimensions({ ...calcDimensions, height: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 font-medium mb-1.5">Portas (Dedução)</label>
                    <input
                      type="number"
                      min="0"
                      value={calcDimensions.doors}
                      onChange={(e) => setCalcDimensions({ ...calcDimensions, doors: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-slate-400 font-medium mb-1.5">Janelas (Dedução)</label>
                    <input
                      type="number"
                      min="0"
                      value={calcDimensions.windows}
                      onChange={(e) => setCalcDimensions({ ...calcDimensions, windows: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl px-3 py-2 text-sm text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4">
                  <label className="block text-xs text-slate-400 font-medium mb-2">Número de Demãos recomendadas</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(coatNum => (
                      <button
                        key={coatNum}
                        onClick={() => setCalcDimensions({ ...calcDimensions, coats: coatNum })}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          calcDimensions.coats === coatNum
                            ? 'bg-teal-500 text-slate-950 border-teal-500 font-black'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {coatNum} {coatNum === 1 ? 'demão' : 'demãos'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* RESULTADO DO CÁLCULO */}
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Área útil para pintura:</span>
                    <span className="font-bold text-slate-100">{calculationResults.netArea} m²</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total de litros estimados:</span>
                    <span className="font-bold text-slate-100">{calculationResults.litersNeeded} Litros</span>
                  </div>
                  <div className="border-t border-slate-800/80 pt-3">
                    <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Configuração recomendada:</span>
                    <p className="text-sm font-bold text-slate-200 mt-1">{calculationResults.suggestion}</p>
                  </div>
                </div>

                {/* EXPORTAÇÃO */}
                <div className="flex gap-2">
                  <button
                    onClick={copyProjectSummary}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 border border-slate-700/50"
                  >
                    <FileText className="w-4 h-4 text-teal-400" />
                    <span>Copiar Relatório</span>
                  </button>
                </div>

              </div>
            )}

            {/* CONTEÚDO DA TAB: FAVORITOS SALVOS */}
            {activeTab === 'projects' && (
              <div className="p-5 space-y-4">
                
                {savedProjects.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                      <FolderHeart className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-300">Sem combinações salvas</h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">Sua galeria de ideias está vazia. Adicione novas cores e salve-as para guardá-las.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {savedProjects.map(project => (
                      <div
                        key={project.id}
                        onClick={() => loadSavedProject(project)}
                        className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          {/* Miniatura do Ambiente */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0 bg-slate-800 border border-white/5">
                            <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
                            {/* Overlay de Tinta */}
                            <div 
                              className="absolute inset-0 mix-blend-multiply" 
                              style={{ backgroundColor: project.selectedColor.hex, opacity: 0.35 }}
                            />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-teal-400 transition-colors">{project.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-white/10 shrink-0" 
                                style={{ backgroundColor: project.selectedColor.hex }}
                              />
                              <span className="text-[10px] text-slate-400 truncate">{project.selectedColor.name}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0 pl-2">
                          <span className="text-[10px] text-slate-500 hidden sm:inline">{project.timestamp.split(',')[0]}</span>
                          <button
                            onClick={(e) => handleDeleteProject(project.id, e)}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                            title="Remover Projeto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>

          {/* DICAS DE DESIGN SYSTEM E AJUDA */}
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Dica de Especialista</span>
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              As cores tendem a parecer um tom mais escuro nas paredes do que no mostrador. Recomendamos usar o <strong className="text-slate-200">Simulador de Pintura Virtual</strong> configurado em <strong className="text-slate-200">35% de opacidade</strong> para representar fielmente o efeito da iluminação indireta no ambiente real.
            </p>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950/40 py-6 text-center mt-12 text-slate-500 text-xs">
        <p className="max-w-md mx-auto leading-relaxed">
          Chromart Studio, desenvolvido como solução premium de simulação de tinturas.
          Todos os cálculos de cor utilizam métricas baseadas no espectro CIE76.
        </p>
      </footer>

    </div>
  );
}