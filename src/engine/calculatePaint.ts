export interface DimensionState {
  width: number;
  height: number;
  doors: number;
  windows: number;
  coats: number;
}

export interface PaintCalculationResult {
  rawArea: number;
  netArea: string;
  litersNeeded: number;
  cans18L: number;
  gallons3_6L: number;
  suggestion: string;
}

const DOOR_DEDUCTION = 1.6;
const WINDOW_DEDUCTION = 2.0;
const YIELD_PER_LITER = 5.5;
const CAN_18L = 18;
const GALLON_3_6L = 3.6;

export function calculatePaintNeeds(dimensions: DimensionState): PaintCalculationResult {
  const { width, height, doors, windows, coats } = dimensions;

  const rawArea = width * height;
  const deductions = doors * DOOR_DEDUCTION + windows * WINDOW_DEDUCTION;
  const netArea = Math.max(1, rawArea - deductions);
  const totalAreaToPaint = netArea * coats;

  const litersNeeded = Number((totalAreaToPaint / YIELD_PER_LITER).toFixed(1));

  const cans18L = Math.floor(litersNeeded / CAN_18L);
  const remaining = litersNeeded % CAN_18L;
  const gallons3_6L = Math.ceil(remaining / GALLON_3_6L);

  const suggestion =
    cans18L > 0
      ? `${cans18L} Lata(s) de 18L e ${gallons3_6L} Galão(ões) de 3.6L`
      : `${gallons3_6L} Galão(ões) de 3.6L`;

  return {
    rawArea,
    netArea: netArea.toFixed(1),
    litersNeeded,
    cans18L,
    gallons3_6L,
    suggestion,
  };
}

export const PAINT_CONSTANTS = {
  DOOR_DEDUCTION,
  WINDOW_DEDUCTION,
  YIELD_PER_LITER,
  CAN_18L,
  GALLON_3_6L,
} as const;
