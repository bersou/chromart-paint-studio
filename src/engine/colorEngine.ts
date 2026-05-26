import { type PaintColor, PAINT_DATABASE } from './paintDatabase';

export const rgbToLab = (r: number, g: number, b: number): [number, number, number] => {
  let rL = r / 255;
  let gL = g / 255;
  let bL = b / 255;

  rL = rL > 0.04045 ? Math.pow((rL + 0.055) / 1.055, 2.4) : rL / 12.92;
  gL = gL > 0.04045 ? Math.pow((gL + 0.055) / 1.055, 2.4) : gL / 12.92;
  bL = bL > 0.04045 ? Math.pow((bL + 0.055) / 1.055, 2.4) : bL / 12.92;

  rL *= 100;
  gL *= 100;
  bL *= 100;

  const x = rL * 0.4124 + gL * 0.3576 + bL * 0.1805;
  const y = rL * 0.2126 + gL * 0.7152 + bL * 0.0722;
  const z = rL * 0.0193 + gL * 0.1192 + bL * 0.9505;

  const refX = 95.047;
  const refY = 100.000;
  const refZ = 108.883;

  let xN = x / refX;
  let yN = y / refY;
  let zN = z / refZ;

  xN = xN > 0.008856 ? Math.pow(xN, 1/3) : (7.787 * xN) + (16 / 116);
  yN = yN > 0.008856 ? Math.pow(yN, 1/3) : (7.787 * yN) + (16 / 116);
  zN = zN > 0.008856 ? Math.pow(zN, 1/3) : (7.787 * zN) + (16 / 116);

  const labL = (116 * yN) - 16;
  const labA = 500 * (xN - yN);
  const labB = 200 * (yN - zN);

  return [labL, labA, labB];
};

export const deltaE2000 = (lab1: [number, number, number], lab2: [number, number, number]): number => {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;

  const kL = 3.0; // Desvaloriza a diferença de luminosidade causada por sombras
  const kC = 1.0;
  const kH = 1.0;

  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);

  const meanC = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(meanC, 7) / (Math.pow(meanC, 7) + 6103515625)));

  const a1Prime = a1 * (1 + G);
  const a2Prime = a2 * (1 + G);

  const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
  const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);

  let h1Prime = Math.atan2(b1, a1Prime) * 180 / Math.PI;
  if (h1Prime < 0) h1Prime += 360;

  let h2Prime = Math.atan2(b2, a2Prime) * 180 / Math.PI;
  if (h2Prime < 0) h2Prime += 360;

  const deltaLPrime = L2 - L1;
  const deltaCPrime = C2Prime - C1Prime;

  let deltahPrime = 0;
  if (C1Prime * C2Prime !== 0) {
    deltahPrime = h2Prime - h1Prime;
    if (deltahPrime > 180) deltahPrime -= 360;
    else if (deltahPrime < -180) deltahPrime += 360;
  }

  const deltaHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin(deltahPrime * Math.PI / 360);

  const meanLPrime = (L1 + L2) / 2;
  const meanCPrime = (C1Prime + C2Prime) / 2;

  let meanhPrime = 0;
  if (C1Prime * C2Prime !== 0) {
    const val = Math.abs(h1Prime - h2Prime);
    if (val <= 180) {
      meanhPrime = (h1Prime + h2Prime) / 2;
    } else {
      if (h1Prime + h2Prime < 360) {
        meanhPrime = (h1Prime + h2Prime + 360) / 2;
      } else {
        meanhPrime = (h1Prime + h2Prime - 360) / 2;
      }
    }
  }

  const T = 1 - 0.17 * Math.cos((meanhPrime - 30) * Math.PI / 180)
            + 0.24 * Math.cos(2 * meanhPrime * Math.PI / 180)
            + 0.32 * Math.cos((3 * meanhPrime + 6) * Math.PI / 180)
            - 0.20 * Math.cos((4 * meanhPrime - 63) * Math.PI / 180);

  const deltaTheta = 30 * Math.exp(-Math.pow((meanhPrime - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(meanCPrime, 7) / (Math.pow(meanCPrime, 7) + 6103515625));
  const RT = -Math.sin(2 * deltaTheta * Math.PI / 180) * RC;

  const SL = 1 + (0.015 * Math.pow(meanLPrime - 50, 2)) / Math.sqrt(20 + Math.pow(meanLPrime - 50, 2));
  const SC = 1 + 0.045 * meanCPrime;
  const SH = 1 + 0.015 * meanCPrime * T;

  const dL = deltaLPrime / (kL * SL);
  const dC = deltaCPrime / (kC * SC);
  const dH = deltaHPrime / (kH * SH);

  return Math.sqrt(dL * dL + dC * dC + dH * dH + RT * dC * dH);
};

export const findClosestPaintColor = (r: number, g: number, b: number): PaintColor => {
  const inputLab = rgbToLab(r, g, b);
  const inputChroma = Math.sqrt(inputLab[1] * inputLab[1] + inputLab[2] * inputLab[2]);

  let minDistance = Infinity;
  let closestColor = PAINT_DATABASE[0];

  PAINT_DATABASE.forEach(color => {
    const colorLab = rgbToLab(color.rgb[0], color.rgb[1], color.rgb[2]);
    const colorChroma = Math.sqrt(colorLab[1] * colorLab[1] + colorLab[2] * colorLab[2]);
    
    let distance = deltaE2000(inputLab, colorLab);

    // Preservação de saturação (chroma)
    // Se a cor selecionada for significativamente saturada, penaliza os candidatos
    // que tenham uma saturação significativamente menor, mantendo a vivacidade.
    if (inputChroma > 12) {
      const chromaDiff = inputChroma - colorChroma;
      if (chromaDiff > 0) {
        distance += chromaDiff * 1.5;
      }
    }

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  });

  return closestColor;
};
