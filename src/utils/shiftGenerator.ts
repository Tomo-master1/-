import { Staff, ShiftRule, Skill } from '../types';

interface ShiftAssignment {
  [key: string]: number[];
}

interface StaffScore {
  staffId: number;
  score: number;
}

// 通常のシフト生成アルゴリズム
export function generateShifts(
  staff: Staff[],
  rules: ShiftRule[],
  year: number,
  month: number
): ShiftAssignment {
  const assignments: ShiftAssignment = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  staff.forEach(member => {
    assignments[member.id] = [];
  });

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isFriday = date.getDay() === 5;
    const rule = rules.find(r => r.dayType === (isWeekend ? 'weekend' : 'weekday'))!;
    
    const staffScores: StaffScore[] = staff
      .filter(member => {
        const currentAssignments = assignments[member.id].length;
        const isAvailable = !member.unavailableDays.includes(day);
        const hasCapacity = currentAssignments < member.maxShifts;
        const hasRequiredSkills = !isFriday || 
          !rule.requiredSkills?.friday ||
          rule.requiredSkills.friday.some(skill => member.skills.includes(skill));
        return isAvailable && hasCapacity && hasRequiredSkills;
      })
      .map(member => {
        let score = 0;
        
        if (member.preferences.preferredDays.includes(day)) {
          score += 100;
        }

        const currentShifts = assignments[member.id].length;
        const remainingDesiredShifts = member.preferences.preferredShiftsCount - currentShifts;
        if (remainingDesiredShifts > 0) {
          score += 50;
        }

        const yesterdayAssigned = assignments[member.id].includes(day - 1);
        if (yesterdayAssigned) {
          score -= 30;
        }

        score += (member.maxShifts - currentShifts) * 10;

        // スキルボーナス
        if (isFriday && member.skills.includes('leader')) {
          score += 40;
        }

        return {
          staffId: member.id,
          score
        };
      });

    staffScores.sort((a, b) => b.score - a.score);

    const requiredStaff = Math.max(
      rule.minStaff,
      Math.min(rule.maxStaff, staffScores.length)
    );
    
    const selectedStaff = staffScores
      .slice(0, requiredStaff)
      .map(score => score.staffId);

    selectedStaff.forEach(staffId => {
      assignments[staffId].push(day);
    });
  }

  return assignments;
}

// 代替シフト生成アルゴリズム（スキルバランスを重視）
export function generateAlternativeShifts(
  staff: Staff[],
  rules: ShiftRule[],
  year: number,
  month: number
): ShiftAssignment {
  const assignments: ShiftAssignment = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  staff.forEach(member => {
    assignments[member.id] = [];
  });

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isFriday = date.getDay() === 5;
    const rule = rules.find(r => r.dayType === (isWeekend ? 'weekend' : 'weekday'))!;
    
    const staffScores: StaffScore[] = staff
      .filter(member => {
        const currentAssignments = assignments[member.id].length;
        const isAvailable = !member.unavailableDays.includes(day);
        const hasCapacity = currentAssignments < member.maxShifts;
        const hasRequiredSkills = !isFriday || 
          !rule.requiredSkills?.friday ||
          rule.requiredSkills.friday.some(skill => member.skills.includes(skill));
        return isAvailable && hasCapacity && hasRequiredSkills;
      })
      .map(member => {
        let score = 0;
        
        // スキルバランスを重視したスコアリング
        if (member.skills.includes('leader')) score += 30;
        if (member.skills.includes('hall')) score += 20;
        if (member.skills.includes('kitchen')) score += 20;

        if (member.preferences.preferredDays.includes(day)) {
          score += 50; // 希望日の重みを下げる
        }

        const currentShifts = assignments[member.id].length;
        score += (member.maxShifts - currentShifts) * 15; // 公平性の重みを上げる

        const yesterdayAssigned = assignments[member.id].includes(day - 1);
        if (yesterdayAssigned) {
          score -= 40; // 連続勤務のペナルティを上げる
        }

        return {
          staffId: member.id,
          score
        };
      });

    staffScores.sort((a, b) => b.score - a.score);

    const requiredStaff = Math.max(
      rule.minStaff,
      Math.min(rule.maxStaff, staffScores.length)
    );
    
    const selectedStaff = staffScores
      .slice(0, requiredStaff)
      .map(score => score.staffId);

    selectedStaff.forEach(staffId => {
      assignments[staffId].push(day);
    });
  }

  return assignments;
}