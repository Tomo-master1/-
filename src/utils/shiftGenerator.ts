import { Staff, ShiftRule } from '../types';

interface ShiftAssignment {
  [key: string]: number[]; // staffId: assignedDays[]
}

interface StaffScore {
  staffId: number;
  score: number;
}

export function generateShifts(
  staff: Staff[],
  rules: ShiftRule[],
  year: number,
  month: number
): ShiftAssignment {
  const assignments: ShiftAssignment = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // 各スタッフの初期化
  staff.forEach(member => {
    assignments[member.id] = [];
  });

  // 各日付に対してシフトを割り当て
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const rule = rules.find(r => r.dayType === (isWeekend ? 'weekend' : 'weekday'))!;
    
    // スタッフごとのスコアを計算
    const staffScores: StaffScore[] = staff
      .filter(member => {
        const currentAssignments = assignments[member.id].length;
        const isAvailable = !member.unavailableDays.includes(day);
        const hasCapacity = currentAssignments < member.maxShifts;
        return isAvailable && hasCapacity;
      })
      .map(member => {
        let score = 0;
        
        // 希望日であればスコアを大幅に増加
        if (member.preferences.preferredDays.includes(day)) {
          score += 100;
        }

        // 希望シフト数に近づくようにスコアを調整
        const currentShifts = assignments[member.id].length;
        const remainingDesiredShifts = member.preferences.preferredShiftsCount - currentShifts;
        if (remainingDesiredShifts > 0) {
          score += 50;
        }

        // 連続勤務を避けるためのペナルティ
        const yesterdayAssigned = assignments[member.id].includes(day - 1);
        if (yesterdayAssigned) {
          score -= 30;
        }

        // 公平性のために、現在のシフト数が少ないスタッフを優先
        score += (member.maxShifts - currentShifts) * 10;

        return {
          staffId: member.id,
          score
        };
      });

    // スコアの高い順にソート
    staffScores.sort((a, b) => b.score - a.score);

    // 必要な人数を割り当て
    const requiredStaff = Math.max(
      rule.minStaff,
      Math.min(rule.maxStaff, staffScores.length)
    );
    
    const selectedStaff = staffScores
      .slice(0, requiredStaff)
      .map(score => score.staffId);

    // 割り当ての保存
    selectedStaff.forEach(staffId => {
      assignments[staffId].push(day);
    });
  }

  return assignments;
}

// 配列をシャッフルするヘルパー関数
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}