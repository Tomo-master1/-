export interface Staff {
  id: number;
  name: string;
  maxShifts: number;
  unavailableDays: number[];
  preferences: {
    preferredDays: number[];
    preferredShiftsCount: number;
  };
}

export interface ShiftRule {
  id: number;
  minStaff: number;
  maxStaff: number;
  dayType: 'weekday' | 'weekend';
}