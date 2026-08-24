/* ==========================================================================
   GoalForge - Storage & Data Persistence Module
   ========================================================================== */

const STORAGE_KEYS = {
  GOALS: 'goalforge_goals_v1',
  HABITS: 'goalforge_habits_v1'
};

// Initial Realistic Sample Data
const SAMPLE_GOALS = [
  {
    id: 'g-1',
    title: 'Ketenangan & Ketakwaan Spiritual',
    category: 'spiritual',
    description: 'Meningkatkan kualitas ibadah, meditasi harian, dan kedekatan dengan Sang Pencipta.',
    targetDate: '2026-12-31',
    color: '#a855f7',
    subGoals: [
      { id: 'sg-101', title: 'Membaca Kitab Suci / Al-Qur\'an 1 Juz tiap minggu', completed: true, dueDate: '2026-09-30' },
      { id: 'sg-102', title: 'Ikut kajian / sesi meditasi mingguan', completed: false, dueDate: '2026-10-15' },
      { id: 'sg-103', title: 'Rutin bersedekah / berbagi setiap hari Jumat', completed: true, dueDate: '2026-12-31' }
    ]
  },
  {
    id: 'g-2',
    title: 'Maraton 10K & Tubuh Bugar 2026',
    category: 'health',
    description: 'Mencapai kondisi fisik prima, daya tahan tinggi, dan pola makan bernutrisi.',
    targetDate: '2026-11-20',
    color: '#10b981',
    subGoals: [
      { id: 'sg-201', title: 'Latihan lari bertahap 5 km tanpa berhenti', completed: true, dueDate: '2026-08-30' },
      { id: 'sg-202', title: 'Capai target 10 km dalam waktu < 60 menit', completed: false, dueDate: '2026-11-20' },
      { id: 'sg-203', title: 'Kurangi konsumsi gula pasir hingga < 25g/hari', completed: false, dueDate: '2026-09-15' }
    ]
  },
  {
    id: 'g-3',
    title: 'Meluncurkan Produk Web App Mandiri',
    category: 'career',
    description: 'Membangun dan meluncurkan aplikasi SaaS modern beretika tinggi.',
    targetDate: '2026-10-01',
    color: '#f59e0b',
    subGoals: [
      { id: 'sg-301', title: 'Riset pasar & validasi ide aplikasi', completed: true, dueDate: '2026-07-15' },
      { id: 'sg-302', title: 'Desain UI/UX Glassmorphism & Prototyping', completed: true, dueDate: '2026-08-20' },
      { id: 'sg-303', title: 'Pengembangan versi Beta & Uji Pengguna', completed: false, dueDate: '2026-09-25' }
    ]
  }
];

// Helper to get formatted date string YYYY-MM-DD
function getTodayStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

const SAMPLE_HABITS = [
  {
    id: 'h-1',
    goalId: 'g-1', // Linked to Spiritual Goal
    title: 'Ibadah / Meditasi Subuh Tepat Waktu',
    category: 'spiritual',
    frequency: 'daily',
    completedDates: [getTodayStr(-3), getTodayStr(-2), getTodayStr(-1), getTodayStr(0)],
    color: '#a855f7'
  },
  {
    id: 'h-2',
    goalId: 'g-1',
    title: 'Membaca Kitab Suci / Buku Refleksi (15 Menit)',
    category: 'spiritual',
    frequency: 'daily',
    completedDates: [getTodayStr(-2), getTodayStr(-1), getTodayStr(0)],
    color: '#ec4899'
  },
  {
    id: 'h-3',
    goalId: 'g-2', // Linked to Health Goal
    title: 'Lari Pagi / Workout 30 Menit',
    category: 'health',
    frequency: 'daily',
    completedDates: [getTodayStr(-4), getTodayStr(-2), getTodayStr(-1)],
    color: '#10b981'
  },
  {
    id: 'h-4',
    goalId: 'g-3', // Linked to Career Goal
    title: 'Fokus Coding & Belajar Tech (2 Jam)',
    category: 'career',
    frequency: 'daily',
    completedDates: [getTodayStr(-3), getTodayStr(-2), getTodayStr(-1), getTodayStr(0)],
    color: '#f59e0b'
  },
  {
    id: 'h-5',
    goalId: '', // Standalone
    title: 'Minum 2.5 Liter Air Putih',
    category: 'health',
    frequency: 'daily',
    completedDates: [getTodayStr(-1), getTodayStr(0)],
    color: '#06b6d4'
  }
];

export const Storage = {
  getGoals() {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!data) {
      this.saveGoals(SAMPLE_GOALS);
      return SAMPLE_GOALS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing goals:', e);
      return SAMPLE_GOALS;
    }
  },

  saveGoals(goals) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  getHabits() {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!data) {
      this.saveHabits(SAMPLE_HABITS);
      return SAMPLE_HABITS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Error parsing habits:', e);
      return SAMPLE_HABITS;
    }
  },

  saveHabits(habits) {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  },

  // Calculate overall goal completion % based on subgoals and linked habit performance
  calculateGoalProgress(goal, habits = []) {
    if (!goal) return 0;
    
    // Sub-goal progress
    let subGoalPercent = 0;
    if (goal.subGoals && goal.subGoals.length > 0) {
      const completedCount = goal.subGoals.filter(s => s.completed).length;
      subGoalPercent = (completedCount / goal.subGoals.length) * 100;
    }

    // Linked habits progress (past 7 days completion rate)
    const linkedHabits = habits.filter(h => h.goalId === goal.id);
    let habitPercent = 0;

    if (linkedHabits.length > 0) {
      const past7Days = [];
      for (let i = 0; i < 7; i++) {
        past7Days.push(getTodayStr(-i));
      }
      let totalCompletions = 0;
      const maxPossible = linkedHabits.length * 7;
      
      linkedHabits.forEach(h => {
        past7Days.forEach(d => {
          if (h.completedDates && h.completedDates.includes(d)) {
            totalCompletions++;
          }
        });
      });
      habitPercent = (totalCompletions / maxPossible) * 100;
    }

    if (goal.subGoals && goal.subGoals.length > 0 && linkedHabits.length > 0) {
      return Math.round((subGoalPercent * 0.7) + (habitPercent * 0.3));
    } else if (goal.subGoals && goal.subGoals.length > 0) {
      return Math.round(subGoalPercent);
    } else if (linkedHabits.length > 0) {
      return Math.round(habitPercent);
    }
    return 0;
  },

  // Calculate Streak for a Habit
  calculateHabitStreak(habit) {
    if (!habit || !habit.completedDates) return { current: 0, best: 0 };
    const datesSet = new Set(habit.completedDates);
    
    let currentStreak = 0;
    let checkDate = new Date();
    
    // If completed today, start counting from today. If not, start check from yesterday
    const todayStr = getTodayStr(0);
    const yesterdayStr = getTodayStr(-1);

    if (!datesSet.has(todayStr) && !datesSet.has(yesterdayStr)) {
      currentStreak = 0;
    } else {
      let offset = datesSet.has(todayStr) ? 0 : -1;
      while (datesSet.has(getTodayStr(offset))) {
        currentStreak++;
        offset--;
      }
    }

    // Calculate Best Streak
    const sortedDates = Array.from(datesSet).sort();
    let bestStreak = 0;
    let tempStreak = 0;
    let prevTime = null;

    sortedDates.forEach(dStr => {
      const currentTime = new Date(dStr).getTime();
      if (prevTime === null) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((currentTime - prevTime) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      prevTime = currentTime;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    });

    return { current: currentStreak, best: Math.max(currentStreak, bestStreak) };
  },

  // Backup Data to JSON File
  exportJSON() {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      goals: this.getGoals(),
      habits: this.getHabits()
    };
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goalforge_backup_${getTodayStr(0)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Restore Data from JSON File
  importJSON(fileContent) {
    try {
      const parsed = JSON.parse(fileContent);
      if (parsed.goals && Array.isArray(parsed.goals)) {
        this.saveGoals(parsed.goals);
      }
      if (parsed.habits && Array.isArray(parsed.habits)) {
        this.saveHabits(parsed.habits);
      }
      return { success: true };
    } catch (e) {
      console.error('Import error:', e);
      return { success: false, error: e.message };
    }
  },

  // Reset to initial sample data
  resetAll() {
    this.saveGoals(SAMPLE_GOALS);
    this.saveHabits(SAMPLE_HABITS);
  }
};
