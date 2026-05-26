export interface PaintColor {
  id: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
  category: 'Neutro' | 'Quente' | 'Frio' | 'Pastel' | 'Intenso';
  brand: string;
  code: string;
  description: string;
}

export const PAINT_DATABASE: PaintColor[] = [
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
