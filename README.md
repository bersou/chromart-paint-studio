# 🎨 Chromart Paint Studio

**PWA inteligente de reconhecimento cromático e simulação de pintura em tempo real.**  
Captura cores do ambiente via câmera, calcula a correspondência mais próxima em um catálogo de tintas usando o espaço de cor CIE76 (Euclidiano 3D), simula a aplicação visual com blending matemático por camadas e estima o consumo de material por área.

---

## Badges

![Status](https://img.shields.io/badge/Status-Ativo-emerald?style=for-the-badge)
![Licença](https://img.shields.io/badge/Licença-MIT-blue?style=for-the-badge)
![Plataforma](https://img.shields.io/badge/Plataforma-Mobile_%7C_Web_%7C_PWA-teal?style=for-the-badge)
![Responsividade](https://img.shields.io/badge/Responsividade-100%25-brightgreen?style=for-the-badge)
![Ambiente](https://img.shields.io/badge/Ambiente-Termux_%2F_Vite-orange?style=for-the-badge)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

---

## Funcionalidades Chave

| Funcionalidade | Descrição |
|---|---|
| **Captura por Câmera** | Acesso à câmera do dispositivo via `getUserMedia()` para leitura de cor dominante em tempo real. |
| **Motor de Cores CIE76** | Algoritmo de diferença cromática simplificada usando distância Euclidiana 3D no espaço RGB contra um catálogo interno de tintas. |
| **Simulador de Pintura Virtual** | Sobreposição da cor selecionada sobre a imagem da câmera usando os blend modes CSS nativos `mix-blend-mode: multiply` e `color-burn` para simular camadas de tinta real. |
| **Calculadora de Consumo** | Interface para informar área (m²) e número de demãos; retorna litros estimados com base na cobertura por demão da tinta selecionada. |
| **Suporte PWA** | `manifest.json` e service worker para instalação como aplicativo nativo em dispositivos móveis e desktop com experiência offline parcial. |

---

## Árvore de Diretórios

```text
chromart-paint-studio/
├── public/
│   ├── favicon.ico
│   ├── icon-512x512.png
│   ├── og-image.png
│   └── manifest.json
├── src/
│   ├── assets/
│   ├── components/
│   │   └── chromart-studio/
│   │       └── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Princípios Matemáticos da Engine

### CIE76 Simplificado — Distância Euclidiana 3D

O motor de cores utiliza o espaço RGB como um cubo tridimensional. A diferença percebida entre duas cores é modelada pela distância Euclidiana clássica entre seus vetores:

$$
\Delta E = \sqrt{(R_2 - R_1)^2 + (G_2 - G_1)^2 + (B_2 - B_1)^2}
$$

Quanto menor o valor de \(\Delta E\), mais próxima visualmente a cor candidata está da cor alvo. O catálogo é percorrido em \(O(n)\) e a tinta com o menor \(\Delta E\) é selecionada como melhor correspondência.

### Física dos Blend Modes na Simulação

- **`mix-blend-mode: multiply`** — Multiplica os valores dos canais RGB da cor de sobreposição pelos da camada inferior (imagem da câmera). O resultado escurece proporcionalmente, simulando o comportamento físico de pigmentos translúcidos sobrepostos: cada camada absorve (subtrai) parte da luz refletida. Matematicamente: \(C_{\text{resultado}} = C_{\text{fundo}} \times C_{\text{sobreposição}} \,/\, 255\).

- **`mix-blend-mode: color-burn`** — Escurece o fundo aumentando o contraste com a cor de sobreposição. Simula o acúmulo de tinta em áreas de maior densidade de pigmento, onde a superfície subjacente progressivamente deixa de refletir luz. Mais agressivo que o `multiply`, é usado para destacar bordas e variações de textura após a aplicação virtual.

---

## Inicialização e Execução Local

```bash
# 1. Instalar dependências do projeto
npm install

# 2. Instalar ícones (lucide-react)
npm install lucide-react

# 3. Iniciar servidor de desenvolvimento Vite
npm run dev
```

O servidor será iniciado em `http://localhost:5173` (ou no IP local da rede, já que `host: true` está configurado no `vite.config.ts`).

---

## Contribuição

O código-fonte principal (`App.tsx`) deve seguir os princípios **Clean Code** e **SOLID**:

- **Responsabilidade Única (SRP):** Cada hook customizado e utilitário deve encapsular exatamente uma preocupação (ex.: `useCamera`, `useColorMatch`, `usePaintCalculator`).
- **Aberto/Fechado (OCP):** O catálogo de cores deve ser extensível via arquivo de dados sem modificação do motor de comparação.
- **Substituição de Liskov (LSP):** Implementações de blend mode devem ser intercambiáveis através de uma interface comum `BlendStrategy`.
- **Segregação de Interfaces (ISP):** Componentes devem consumir apenas as propriedades de que necessitam; evitar `AppProps` monolíticas.
- **Inversão de Dependência (DIP):** Módulos de alto nível (simulador, calculadora) devem depender de abstrações (interfaces `ColorMatcher`, `ConsumptionEstimator`), não de implementações concretas.

**Padrões recomendados:** Custom Hooks para lógica de estado/efeito, componentes puros para renderização, e utilitários puros (`pure functions`) para os cálculos matemáticos da engine.

---
