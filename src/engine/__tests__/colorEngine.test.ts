import { describe, it, expect } from 'vitest';
import { findClosestPaintColor, rgbToLab, deltaE2000 } from '../colorEngine';

describe('colorEngine', () => {
  describe('rgbToLab', () => {
    it('deve converter RGB puro para LAB', () => {
      const white = rgbToLab(255, 255, 255);
      expect(white[0]).toBeCloseTo(100, 1);
      expect(white[1]).toBeCloseTo(0, 1);
      expect(white[2]).toBeCloseTo(0, 1);

      const black = rgbToLab(0, 0, 0);
      expect(black[0]).toBeCloseTo(0, 1);
      expect(black[1]).toBeCloseTo(0, 1);
      expect(black[2]).toBeCloseTo(0, 1);
    });
  });

  describe('deltaE2000', () => {
    it('deve retornar 0 para a mesma cor', () => {
      const color: [number, number, number] = [50, 10, -20];
      expect(deltaE2000(color, color)).toBe(0);
    });

    it('deve calcular uma diferença de cor perceptualmente correta', () => {
      const color1: [number, number, number] = [50, 10, 20];
      const color2: [number, number, number] = [50, 12, 22];
      expect(deltaE2000(color1, color2)).toBeGreaterThan(0);
      expect(deltaE2000(color1, color2)).toBeLessThan(5);
    });
  });

  describe('findClosestPaintColor', () => {
    it('deve mapear corretamente uma parede azul-petróleo (teal) para uma cor fria apropriada e não Verde Alecrim', () => {
      // Tom azul-petróleo saturado/vibrante da parede (RGB de teste próximo ao teal real)
      const tealWallRGB = { r: 65, g: 128, b: 141 }; 

      const result = findClosestPaintColor(tealWallRGB.r, tealWallRGB.g, tealWallRGB.b);

      // O resultado deve ser uma cor fria e próxima de azul ou verde floresta, não Verde Alecrim (C-202 / #8F9779)
      expect(result.code).not.toBe('C-202'); // Não pode ser Verde Alecrim
      expect(['Frio', 'Intenso']).toContain(result.category); // Deve ser Frio ou Intenso (ex: Verde Floresta / Azul Sereno)
    });

    it('deve mapear uma cor neutra clara para Algodão Egípcio ou Cinza Crômio', () => {
      const neutralLightRGB = { r: 242, g: 238, b: 230 };
      const result = findClosestPaintColor(neutralLightRGB.r, neutralLightRGB.g, neutralLightRGB.b);
      expect(result.code).toBe('C-101'); // Algodão Egípcio
    });
  });
});
