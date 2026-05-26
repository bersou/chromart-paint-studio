import { describe, it, expect } from 'vitest';
import { calculatePaintNeeds, PAINT_CONSTANTS } from '../calculatePaint';
import type { DimensionState } from '../calculatePaint';

describe('calculatePaintNeeds', () => {
  // ==========================================================================
  // CÁLCULOS BÁSICOS
  // ==========================================================================

  it('deve calcular área bruta corretamente (largura × altura)', () => {
    const result = calculatePaintNeeds({
      width: 4,
      height: 2.7,
      doors: 0,
      windows: 0,
      coats: 1,
    });

    expect(result.rawArea).toBe(10.8);
    expect(result.netArea).toBe('10.8');
  });

  it('deve descontar portas e janelas da área bruta', () => {
    const result = calculatePaintNeeds({
      width: 5,
      height: 3,
      doors: 1,
      windows: 2,
      coats: 1,
    });

    const expectedNet = 15 - (1 * PAINT_CONSTANTS.DOOR_DEDUCTION + 2 * PAINT_CONSTANTS.WINDOW_DEDUCTION);
    expect(result.rawArea).toBe(15);
    expect(parseFloat(result.netArea)).toBeCloseTo(expectedNet, 1);
  });

  it('deve multiplicar área líquida pelo número de demãos', () => {
    const result = calculatePaintNeeds({
      width: 4,
      height: 2.5,
      doors: 0,
      windows: 0,
      coats: 3,
    });

    const rawArea = 10;
    const expectedLiters = Number((rawArea * 3 / PAINT_CONSTANTS.YIELD_PER_LITER).toFixed(1));
    expect(result.litersNeeded).toBe(expectedLiters);
    expect(result.netArea).toBe('10.0');
  });

  // ==========================================================================
  // CASOS DE BORDA
  // ==========================================================================

  it('deve garantir área mínima de 1m² quando descontos excedem área bruta', () => {
    const result = calculatePaintNeeds({
      width: 1,
      height: 1,
      doors: 5,
      windows: 5,
      coats: 1,
    });

    expect(parseFloat(result.netArea)).toBe(1);
  });

  it('deve funcionar com dimensões zero (protegendo contra divisão)', () => {
    const result = calculatePaintNeeds({
      width: 0,
      height: 0,
      doors: 0,
      windows: 0,
      coats: 1,
    });

    expect(result.rawArea).toBe(0);
    expect(parseFloat(result.netArea)).toBe(1);
    expect(result.litersNeeded).toBeGreaterThan(0);
  });

  it('deve funcionar com largura/altura mínima de 1', () => {
    const result = calculatePaintNeeds({
      width: 1,
      height: 1,
      doors: 0,
      windows: 0,
      coats: 1,
    });

    expect(result.rawArea).toBe(1);
    expect(result.litersNeeded).toBeCloseTo(1 / PAINT_CONSTANTS.YIELD_PER_LITER, 1);
  });

  // ==========================================================================
  // CÁLCULO DE LITROS E SUGESTÃO DE EMBALAGENS
  // ==========================================================================

  it('deve sugerir galões de 3.6L para áreas pequenas', () => {
    const result = calculatePaintNeeds({
      width: 2,
      height: 2,
      doors: 0,
      windows: 0,
      coats: 1,
    });

    expect(result.cans18L).toBe(0);
    expect(result.gallons3_6L).toBeGreaterThanOrEqual(1);
    expect(result.suggestion).toContain('Galão(ões)');
    expect(result.suggestion).not.toContain('Lata(s) de 18L');
  });

  it('deve sugerir latas de 18L para áreas grandes', () => {
    const result = calculatePaintNeeds({
      width: 10,
      height: 5,
      doors: 0,
      windows: 0,
      coats: 2,
    });

    expect(result.cans18L).toBeGreaterThanOrEqual(1);
    expect(result.suggestion).toContain('Lata(s) de 18L');
  });

  it('deve combinar latas de 18L e galões de 3.6L corretamente', () => {
    const result = calculatePaintNeeds({
      width: 6,
      height: 3,
      doors: 0,
      windows: 0,
      coats: 4,
    });

    const grossArea = 18;
    const liters = Number((grossArea * 4 / PAINT_CONSTANTS.YIELD_PER_LITER).toFixed(1));
    const expectedCans = Math.floor(liters / 18);
    const remaining = liters % 18;
    const expectedGallons = Math.ceil(remaining / 3.6);

    expect(result.cans18L).toBe(expectedCans);
    expect(result.gallons3_6L).toBe(expectedGallons);
  });

  it('deve sempre ter pelo menos 1 galão quando litersNeeded > 0', () => {
    const result = calculatePaintNeeds({
      width: 1.5,
      height: 1.5,
      doors: 0,
      windows: 0,
      coats: 1,
    });

    expect(result.litersNeeded).toBeGreaterThan(0);
    expect(result.gallons3_6L).toBeGreaterThanOrEqual(1);
  });

  // ==========================================================================
  // CONSISTÊNCIA MATEMÁTICA
  // ==========================================================================

  it('deve ser consistente: mesma entrada produz mesma saída', () => {
    const dims: DimensionState = { width: 4.5, height: 2.7, doors: 1, windows: 2, coats: 2 };

    const result1 = calculatePaintNeeds(dims);
    const result2 = calculatePaintNeeds(dims);

    expect(result1).toEqual(result2);
  });

  it('deve ser linear com o número de demãos (para área fixa)', () => {
    const base: DimensionState = { width: 5, height: 2.5, doors: 0, windows: 0, coats: 1 };
    const baseResult = calculatePaintNeeds(base);

    const doubleResult = calculatePaintNeeds({ ...base, coats: 2 });

    const baseLiters = baseResult.litersNeeded;
    const doubleLiters = Number((baseLiters * 2).toFixed(1));
    // Pode ter diferença de arredondamento
    expect(doubleResult.litersNeeded).toBeCloseTo(doubleLiters, 0);
  });

  it('deve reduzir área líquida quando portas/janelas aumentam', () => {
    const base: DimensionState = { width: 5, height: 3, doors: 0, windows: 0, coats: 1 };
    const withDeductions: DimensionState = { width: 5, height: 3, doors: 2, windows: 2, coats: 1 };

    const baseResult = calculatePaintNeeds(base);
    const deductionsResult = calculatePaintNeeds(withDeductions);

    expect(parseFloat(deductionsResult.netArea)).toBeLessThan(parseFloat(baseResult.netArea));
  });

  // ==========================================================================
  // VALORES CONSTANTES
  // ==========================================================================

  it('deve usar constantes de desconto corretas (porta=1.6, janela=2.0)', () => {
    expect(PAINT_CONSTANTS.DOOR_DEDUCTION).toBe(1.6);
    expect(PAINT_CONSTANTS.WINDOW_DEDUCTION).toBe(2.0);
    expect(PAINT_CONSTANTS.YIELD_PER_LITER).toBe(5.5);
    expect(PAINT_CONSTANTS.CAN_18L).toBe(18);
    expect(PAINT_CONSTANTS.GALLON_3_6L).toBe(3.6);
  });

  // ==========================================================================
  // CENÁRIOS REAIS
  // ==========================================================================

  it('deve calcular área para sala de estar típica (4m × 2.7m, 1 porta, 1 janela, 2 demãos)', () => {
    const result = calculatePaintNeeds({
      width: 4,
      height: 2.7,
      doors: 1,
      windows: 1,
      coats: 2,
    });

    const expectedNet = Math.max(1, 10.8 - (1.6 + 2.0));
    const expectedLiters = Number((expectedNet * 2 / 5.5).toFixed(1));
    const expectedCans = Math.floor(expectedLiters / 18);
    const expectedRemaining = expectedLiters % 18;
    const expectedGallons = Math.ceil(expectedRemaining / 3.6);

    expect(parseFloat(result.netArea)).toBeCloseTo(expectedNet, 1);
    expect(result.litersNeeded).toBe(expectedLiters);
    expect(result.cans18L).toBe(expectedCans);
    expect(result.gallons3_6L).toBe(expectedGallons);
  });

  it('deve calcular para parede pequena (quarto de serviço)', () => {
    const result = calculatePaintNeeds({
      width: 2.5,
      height: 2.5,
      doors: 1,
      windows: 0,
      coats: 2,
    });

    expect(parseFloat(result.netArea)).toBeCloseTo(Math.max(1, 6.25 - 1.6), 1);
    expect(result.cans18L).toBe(0);
    expect(result.gallons3_6L).toBeGreaterThanOrEqual(1);
    expect(result.suggestion).not.toContain('Lata(s) de 18L');
  });
});
