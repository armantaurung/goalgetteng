/* ==========================================================================
   GoalForge - Unified Self-Contained Application Bundle
   (Compatible with direct file:// protocol in all web browsers)
   ========================================================================== */

(function () {
  'use strict';

  // =========================================================================
  // 1. DATA STORAGE & PERSISTENCE LAYER
  // =========================================================================
  const STORAGE_KEYS = {
    GOALS: 'goalforge_goals_v1',
    HABITS: 'goalforge_habits_v1',
    GOOGLE_CLIENT_ID: 'goalforge_gclient_id_v1',
    SIDEBAR_COLLAPSED: 'goalforge_sidebar_collapsed_v1'
  };

  function getTodayStr(offsetDays = 0) {
    const d = new Date();
    if (offsetDays !== 0) {
      d.setDate(d.getDate() + offsetDays);
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getFormattedFullDateStr() {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

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

  // NOTE: SAMPLE_HABITS does NOT include getTodayStr(0) so today always starts fresh and unchecked!
  const SAMPLE_HABITS = [
    // Spiritual Habits
    {
      id: 'h-1',
      goalId: 'g-1',
      title: 'Shalat Subuh Berjamaah di Mesjid',
      category: 'spiritual',
      durationMinutes: 15,
      implementationPlan: 'Setiap kali azan Subuh berkumandang, saya langsung wudhu dan berjalan ke Mesjid terdekat.',
      frequency: 'daily',
      completedDates: [getTodayStr(-4), getTodayStr(-3), getTodayStr(-2), getTodayStr(-1)],
      color: '#a855f7'
    },
    {
      id: 'h-2',
      goalId: 'g-1',
      title: 'Shalat Dhuha & Dzikir Pagi',
      category: 'spiritual',
      durationMinutes: 15,
      implementationPlan: 'Setiap jam 07:30 pagi, luangkan waktu 15 menit untuk Shalat Dhuha & membaca dzikir.',
      frequency: 'daily',
      completedDates: [getTodayStr(-3), getTodayStr(-2), getTodayStr(-1)],
      color: '#ec4899'
    },
    {
      id: 'h-3',
      goalId: 'g-1',
      title: 'Membaca Kitab Suci / Al-Qur\'an',
      category: 'spiritual',
      durationMinutes: 20,
      implementationPlan: 'Setiap jam 05:30 pagi setelah Shalat Subuh, saya duduk membaca 10 halaman di ruang utama.',
      frequency: 'daily',
      completedDates: [getTodayStr(-2), getTodayStr(-1)],
      color: '#a855f7'
    },
    // Health / Physical Habits
    {
      id: 'h-4',
      goalId: 'g-2',
      title: 'Berjalan / Jogging Pagi',
      category: 'health',
      durationMinutes: 30,
      implementationPlan: 'Setiap jam 06:00 pagi, saya memakai sepatu lari lalu berjalan / jogging 3 km di sekitar rumah.',
      frequency: 'daily',
      completedDates: [getTodayStr(-4), getTodayStr(-3), getTodayStr(-2), getTodayStr(-1)],
      color: '#10b981'
    },
    {
      id: 'h-5',
      goalId: 'g-2',
      title: 'Minum Air Putih 2.5 Liter',
      category: 'health',
      durationMinutes: 2,
      implementationPlan: 'Setiap kali bangun tidur dan sebelum makan siang, saya minum 1 gelas besar air putih hangat.',
      frequency: 'daily',
      completedDates: [getTodayStr(-5), getTodayStr(-4), getTodayStr(-3), getTodayStr(-2), getTodayStr(-1)],
      color: '#10b981'
    },
    // Mindset & Personal Development
    {
      id: 'h-6',
      goalId: 'g-3',
      title: 'Afirmasi Positif & Visualisasi Success',
      category: 'personal',
      durationMinutes: 10,
      implementationPlan: 'Setiap jam 07:00 pagi sebelum bekerja, ucapkan afirmasi positif dan visualisasikan target hari ini.',
      frequency: 'daily',
      completedDates: [getTodayStr(-3), getTodayStr(-2), getTodayStr(-1)],
      color: '#f43f5e'
    },
    {
      id: 'h-7',
      goalId: 'g-3',
      title: 'Membaca Buku & Artikel Tech',
      category: 'career',
      durationMinutes: 20,
      implementationPlan: 'Setiap jam 20:00 malam setelah makan malam, saya membuka buku tech di meja kerja.',
      frequency: 'daily',
      completedDates: [getTodayStr(-3), getTodayStr(-2), getTodayStr(-1)],
      color: '#f59e0b'
    },
    {
      id: 'h-8',
      goalId: 'g-3',
      title: 'Menyusun Rencana & Jadwal Harian',
      category: 'career',
      durationMinutes: 10,
      implementationPlan: 'Setiap jam 21:30 malam, luangkan 10 menit untuk merancang to-do list besok di aplikasi GoalForge.',
      frequency: 'daily',
      completedDates: [getTodayStr(-2), getTodayStr(-1)],
      color: '#3b82f6'
    }
  ];

  const Storage = {
    getGoals() {
      let data = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!data) {
        data = localStorage.getItem('goalforge_goals_v2');
      }
      if (!data) {
        this.saveGoals(SAMPLE_GOALS);
        return SAMPLE_GOALS;
      }
      try {
        return JSON.parse(data);
      } catch (e) {
        return SAMPLE_GOALS;
      }
    },

    saveGoals(goals) {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      localStorage.setItem('goalforge_goals_v2', JSON.stringify(goals));
    },

    getHabits() {
      let data = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (!data) {
        data = localStorage.getItem('goalforge_habits_v2');
      }
      if (!data) {
        this.saveHabits(SAMPLE_HABITS);
        return SAMPLE_HABITS;
      }
      try {
        const habits = JSON.parse(data);
        return habits;
      } catch (e) {
        return SAMPLE_HABITS;
      }
    },

    saveHabits(habits) {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
      localStorage.setItem('goalforge_habits_v2', JSON.stringify(habits));
    },

    isSidebarCollapsed() {
      return localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === 'true';
    },

    setSidebarCollapsed(collapsed) {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed ? 'true' : 'false');
    },

    duplicateHabit(habitId) {
      const currentHabits = this.getHabits();
      const idx = currentHabits.findIndex(h => h.id === habitId);
      if (idx > -1) {
        const original = currentHabits[idx];
        const duplicated = {
          ...original,
          id: 'h-' + Date.now(),
          title: `${original.title} (Salinan)`,
          completedDates: []
        };
        currentHabits.splice(idx + 1, 0, duplicated);
        this.saveHabits(currentHabits);
        return true;
      }
      return false;
    },

    calculateGoalProgress(goal, habits = []) {
      if (!goal) return 0;
      let subGoalPercent = 0;
      if (goal.subGoals && goal.subGoals.length > 0) {
        const completedCount = goal.subGoals.filter(s => s.completed).length;
        subGoalPercent = (completedCount / goal.subGoals.length) * 100;
      }

      const linkedHabits = habits.filter(h => h.goalId === goal.id);
      let habitPercent = 0;

      if (linkedHabits.length > 0) {
        const past7Days = [];
        for (let i = 0; i < 7; i++) past7Days.push(getTodayStr(-i));
        let totalCompletions = 0;
        const maxPossible = linkedHabits.length * 7;
        linkedHabits.forEach(h => {
          past7Days.forEach(d => {
            if (h.completedDates && h.completedDates.includes(d)) totalCompletions++;
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

    calculateHabitStreak(habit) {
      if (!habit || !habit.completedDates) return { current: 0, best: 0 };
      const datesSet = new Set(habit.completedDates);
      let currentStreak = 0;
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
          if (diffDays === 1) tempStreak++;
          else tempStreak = 1;
        }
        prevTime = currentTime;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      });

      return { current: currentStreak, best: Math.max(currentStreak, bestStreak) };
    },

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

    importJSON(fileContent) {
      try {
        const parsed = JSON.parse(fileContent);
        if (parsed.goals && Array.isArray(parsed.goals)) this.saveGoals(parsed.goals);
        if (parsed.habits && Array.isArray(parsed.habits)) this.saveHabits(parsed.habits);
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    resetAll() {
      this.saveGoals(SAMPLE_GOALS);
      this.saveHabits(SAMPLE_HABITS);
    }
  };

  const GoogleCalendar = {
    getDirectEventUrl(habit, linkedGoalTitle = '') {
      const title = habit.title;
      const implPlan = habit.implementationPlan ? `\nRencana Implementasi: ${habit.implementationPlan}` : '';
      const details = `Habit Harian dari GoalForge App.\nTarget Durasi: ${habit.durationMinutes || 15} Menit\nKategori: ${habit.category}${implPlan}\n${linkedGoalTitle ? 'Terkait Goal: ' + linkedGoalTitle : ''}`;
      const recurrence = 'RRULE:FREQ=DAILY';
      
      const now = new Date();
      now.setHours(7, 0, 0, 0);
      const startStr = now.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const dur = habit.durationMinutes || 15;
      now.setMinutes(now.getMinutes() + dur);
      const endStr = now.toISOString().replace(/-|:|\.\d\d\d/g, '');

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&dates=${startStr}/${endStr}&recur=${encodeURIComponent(recurrence)}`;
    },

    exportICalendar(habits, goals) {
      let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//GoalForge//Habit & Goal Tracker//ID',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:GoalForge Habits & Goals'
      ];

      const nowStr = new Date().toISOString().replace(/-|:|\.\d\d\d/g, '');

      habits.forEach((h, index) => {
        const linkedGoal = goals.find(g => g.id === h.goalId);
        const goalInfo = linkedGoal ? ` (Goal: ${linkedGoal.title})` : '';
        const implPlan = h.implementationPlan ? ` - Rencana: ${h.implementationPlan}` : '';
        icsContent.push('BEGIN:VEVENT');
        icsContent.push(`UID:habit-${h.id || index}@goalforge.app`);
        icsContent.push(`DTSTAMP:${nowStr}`);
        icsContent.push(`DTSTART:${nowStr.slice(0, 8)}T070000Z`);
        icsContent.push(`DTEND:${nowStr.slice(0, 8)}T073000Z`);
        icsContent.push(`SUMMARY:🎯 ${h.title}${goalInfo}`);
        icsContent.push(`DESCRIPTION:Rutinitas harian GoalForge (${h.category}) - ${h.durationMinutes || 15} Menit${implPlan}`);
        icsContent.push('RRULE:FREQ=DAILY');
        icsContent.push('STATUS:CONFIRMED');
        icsContent.push('END:VEVENT');
      });

      goals.forEach((g) => {
        if (g.targetDate) {
          const dateClean = g.targetDate.replace(/-/g, '');
          icsContent.push('BEGIN:VEVENT');
          icsContent.push(`UID:goal-${g.id}@goalforge.app`);
          icsContent.push(`DTSTAMP:${nowStr}`);
          icsContent.push(`DTSTART;VALUE=DATE:${dateClean}`);
          icsContent.push(`DTEND;VALUE=DATE:${dateClean}`);
          icsContent.push(`SUMMARY:🚀 Target Selesai Goal: ${g.title}`);
          icsContent.push(`DESCRIPTION:${g.description || 'Target Goal Utama GoalForge'}`);
          icsContent.push('STATUS:CONFIRMED');
          icsContent.push('END:VEVENT');
        }
      });

      icsContent.push('END:VCALENDAR');

      const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `goalforge_calendar.ics`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  function fireConfetti() {
    if (typeof window.confetti === 'function') {
      window.confetti({ particleCount: 65, spread: 80, origin: { y: 0.7 } });
    }
  }

  // =========================================================================
  // DYNAMIC SVG ORANGE CITRUS TREE GENERATOR
  // =========================================================================
  function renderOrangeTreeSVG(progressPct) {
    const pct = Math.min(100, Math.max(0, progressPct));

    if (pct < 25) {
      return `
        <svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="115" rx="40" ry="10" fill="#3e2723" opacity="0.8"/>
          <ellipse cx="60" cy="113" rx="34" ry="7" fill="#5d4037"/>
          <path d="M60 112 Q58 85 60 75 Q62 65 60 55" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
          <path d="M60 75 C45 65 35 75 45 85 C55 85 58 78 60 75 Z" fill="#34d399"/>
          <path d="M60 65 C75 55 85 65 75 75 C65 75 62 68 60 65 Z" fill="#10b981"/>
          <circle cx="60" cy="53" r="5" fill="#a7f3d0"/>
        </svg>
      `;
    } else if (pct < 50) {
      return `
        <svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="116" rx="42" ry="10" fill="#3e2723" opacity="0.8"/>
          <path d="M55 116 C55 90 53 70 60 50 L65 50 C70 70 65 90 65 116 Z" fill="#6d4c41"/>
          <circle cx="60" cy="45" r="30" fill="#047857"/>
          <circle cx="45" cy="50" r="22" fill="#059669"/>
          <circle cx="75" cy="50" r="22" fill="#10b981"/>
          <circle cx="60" cy="35" r="24" fill="#34d399"/>
        </svg>
      `;
    } else if (pct < 75) {
      return `
        <svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="116" rx="44" ry="10" fill="#3e2723" opacity="0.85"/>
          <path d="M53 116 C53 85 50 65 58 42 L62 42 C70 65 67 85 67 116 Z" fill="#5d4037"/>
          <circle cx="60" cy="42" r="34" fill="#047857"/>
          <circle cx="40" cy="48" r="24" fill="#059669"/>
          <circle cx="80" cy="48" r="24" fill="#10b981"/>
          <circle cx="60" cy="28" r="26" fill="#34d399"/>
          <circle cx="45" cy="35" r="4" fill="#ffffff"/>
          <circle cx="72" cy="32" r="4" fill="#ffffff"/>
          <circle cx="58" cy="48" r="4.5" fill="#ffffff"/>
          <circle cx="35" cy="52" r="5" fill="#84cc16"/>
          <circle cx="82" cy="50" r="5" fill="#84cc16"/>
        </svg>
      `;
    } else if (pct < 100) {
      return `
        <svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="116" rx="46" ry="10" fill="#3e2723" opacity="0.9"/>
          <path d="M52 116 C52 82 48 60 57 38 L63 38 C72 60 68 82 68 116 Z" fill="#4e342e"/>
          <circle cx="60" cy="40" r="36" fill="#047857"/>
          <circle cx="38" cy="46" r="26" fill="#059669"/>
          <circle cx="82" cy="46" r="26" fill="#10b981"/>
          <circle cx="60" cy="24" r="28" fill="#34d399"/>
          <circle cx="36" cy="45" r="7" fill="#f59e0b"/>
          <circle cx="36" cy="44" r="2" fill="#fef08a"/>
          <circle cx="80" cy="42" r="7.5" fill="#fb923c"/>
          <circle cx="80" cy="41" r="2" fill="#ffedd5"/>
          <circle cx="58" cy="48" r="8" fill="#f97316"/>
          <circle cx="58" cy="46" r="2.5" fill="#fff7ed"/>
          <circle cx="68" cy="28" r="7" fill="#fbbf24"/>
        </svg>
      `;
    } else {
      return `
        <svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="45" r="48" fill="url(#orangeAura)" opacity="0.6"/>
          <defs>
            <radialGradient id="orangeAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ff9f43" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#ff5252" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="ripeOrangeGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#ffe066"/>
              <stop offset="40%" stop-color="#ff9f43"/>
              <stop offset="100%" stop-color="#e65100"/>
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="116" rx="48" ry="11" fill="#3e2723"/>
          <ellipse cx="60" cy="114" rx="40" ry="7" fill="#5d4037"/>
          <path d="M50 116 C50 80 46 55 56 34 L64 34 C74 55 70 80 70 116 Z" fill="#4e342e"/>
          <path d="M58 55 Q42 45 35 48" stroke="#3e2723" stroke-width="3" stroke-linecap="round"/>
          <path d="M62 55 Q78 45 85 48" stroke="#3e2723" stroke-width="3" stroke-linecap="round"/>
          <circle cx="60" cy="38" r="38" fill="#047857"/>
          <circle cx="36" cy="46" r="28" fill="#059669"/>
          <circle cx="84" cy="46" r="28" fill="#10b981"/>
          <circle cx="60" cy="22" r="30" fill="#34d399"/>
          <circle cx="35" cy="45" r="8.5" fill="url(#ripeOrangeGrad)" class="orange-fruit-glow"/>
          <circle cx="82" cy="42" r="9" fill="url(#ripeOrangeGrad)" class="orange-fruit-glow"/>
          <circle cx="58" cy="52" r="9.5" fill="url(#ripeOrangeGrad)" class="orange-fruit-glow"/>
          <circle cx="68" cy="26" r="8" fill="url(#ripeOrangeGrad)" class="orange-fruit-glow"/>
          <circle cx="48" cy="32" r="8" fill="url(#ripeOrangeGrad)" class="orange-fruit-glow"/>
          <circle cx="25" cy="56" r="7.5" fill="url(#ripeOrangeGrad)" class="orange-fruit-glow"/>
          <circle cx="94" cy="54" r="7.5" fill="url(#ripeOrangeGrad)" class="orange-fruit-glow"/>
          <circle cx="44" cy="60" r="8" fill="url(#ripeOrangeGrad)" class="orange-fruit-glow"/>
          <circle cx="76" cy="60" r="8" fill="url(#ripeOrangeGrad)" class="orange-fruit-glow"/>
        </svg>
      `;
    }
  }

  function getOrangeTreeStatusInfo(percent) {
    if (percent >= 100) {
      return {
        badgeText: '🍊 PANEN JERUK SEMPURNA! (100%)',
        cssClass: 'perfect',
        title: 'Pohon Jeruk Berbuah Lebat & Manis! 🍊🎉',
        desc: 'Selamat! Seluruh kebiasaan harian Anda telah tuntas 100%. Pohon jeruk Anda kini berbuah lebat dan siap dipanen!'
      };
    } else if (percent >= 75) {
      return {
        badgeText: `🍊 Pohon Berbuah (${percent}%)`,
        cssClass: '',
        title: 'Pohon Jeruk Mulai Matang & Rindang 🍊',
        desc: 'Hampir sempurna! Buah jeruk Anda sudah mulai ranum dan berwarna oranye keemasan. Selesaikan sisa habit hari ini!'
      };
    } else if (percent >= 50) {
      return {
        badgeText: `🌸 Pohon Berbunga (${percent}%)`,
        cssClass: '',
        title: 'Bunga Jeruk Bermekaran Indah 🌸',
        desc: 'Konsistensi Anda membuat pohon jeruk berbunga lebat! Teruskan langkah Anda untuk menghasilkan buah yang manis.'
      };
    } else if (percent >= 25) {
      return {
        badgeText: `🌱 Pohon Tumbuh Subur (${percent}%)`,
        cssClass: '',
        title: 'Pohon Jeruk Muda Tumbuh Tinggi 🌱',
        desc: 'Bibit habit Anda telah tumbuh menjadi pohon muda yang kuat. Teruskan rutinitas harian Anda!'
      };
    } else {
      return {
        badgeText: `🌱 Tunas Baru Tumbuh (${percent}%)`,
        cssClass: '',
        title: 'Tunas Kebiasaan Baru Disiram 🌱',
        desc: 'Setiap habit yang Anda centang menyiram tunas jeruk ini. Lakukan kebiasaan pertama Anda hari ini!'
      };
    }
  }

  function renderOrangeTreeGardenWidget(percentToday, totalCount, completedCount) {
    const status = getOrangeTreeStatusInfo(percentToday);
    const svgCode = renderOrangeTreeSVG(percentToday);

    return `
      <div class="orange-tree-card" style="margin-bottom: 28px;" id="orange-tree-widget">
        <div class="orange-tree-svg-container" id="orange-tree-svg-btn" title="Klik pohon untuk merayakan panen jeruk!">
          ${svgCode}
        </div>
        <div class="orange-tree-info">
          <div style="display: flex; items-center: gap: 10px; margin-bottom: 8px;">
            <span class="orange-tree-status-badge ${status.cssClass}">${status.badgeText}</span>
            <span style="font-size: 0.8rem; color: var(--text-dim); margin-left: auto;">${completedCount} dari ${totalCount} Habit Selesai</span>
          </div>
          <h2 style="font-size: 1.35rem; color: var(--text-main); margin-bottom: 4px;">${status.title}</h2>
          <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.4;">${status.desc}</p>
          
          <div class="progress-bar-bg" style="height: 10px; margin-top: 14px;">
            <div class="progress-bar-fill" style="width: ${percentToday}%; background: linear-gradient(90deg, #10b981, #ff9f43, #ff5252);"></div>
          </div>
        </div>
      </div>
    `;
  }

  let draggedHabitId = null;
  let calendarActiveYear = new Date().getFullYear();
  let calendarActiveMonth = new Date().getMonth(); // 0-indexed
  let lastRenderedDateStr = getTodayStr(0);

  // =========================================================================
  // 2. TODAY FOCUS VIEW
  // =========================================================================
  function renderTodayView(container, onAction) {
    const habits = Storage.getHabits();
    const goals = Storage.getGoals();
    const todayStr = getTodayStr(0);
    const fullDateText = getFormattedFullDateStr();

    const totalHabitsToday = habits.length;
    const completedHabitsToday = habits.filter(h => h.completedDates && h.completedDates.includes(todayStr)).length;
    const percentToday = totalHabitsToday > 0 ? Math.round((completedHabitsToday / totalHabitsToday) * 100) : 0;

    let activeStreaks = 0;
    habits.forEach(h => {
      const s = Storage.calculateHabitStreak(h);
      if (s.current > 0) activeStreaks++;
    });

    const pendingSubGoals = [];
    goals.forEach(g => {
      if (g.subGoals) {
        g.subGoals.forEach(sg => {
          if (!sg.completed) {
            pendingSubGoals.push({ ...sg, goalTitle: g.title, goalId: g.id, goalColor: g.color });
          }
        });
      }
    });

    const orangeGardenHTML = renderOrangeTreeGardenWidget(percentToday, totalHabitsToday, completedHabitsToday);

    container.innerHTML = `
      <div class="header-bar">
        <div class="page-title">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <h1>Fokus Hari Ini 🎯</h1>
            <span style="font-size: 0.78rem; font-weight: 700; padding: 4px 10px; border-radius: var(--radius-full); background: rgba(16, 185, 129, 0.18); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; display: inline-flex; align-items: center; gap: 6px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></span>
              Fresh Daily Rollover
            </span>
          </div>
          <p style="color: var(--text-main); font-weight: 600; font-size: 1.05rem;">📅 ${fullDateText}</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-google" id="btn-export-gcal-today">
            <i data-lucide="calendar"></i> Ke Google Calendar
          </button>
          <button class="btn btn-primary" id="btn-add-habit-today">
            <i data-lucide="plus-circle"></i> Tambah Habit
          </button>
        </div>
      </div>

      <!-- Pohon Jeruk Visual Kebiasaan -->
      ${orangeGardenHTML}

      <div class="grid-3" style="margin-bottom: 32px;">
        <div class="glass-card stat-card">
          <div class="stat-icon" style="background: rgba(255, 159, 67, 0.2); color: #ff9f43;">
            <i data-lucide="citrus" style="width: 24px; height: 24px;"></i>
          </div>
          <div class="stat-info">
            <div class="value">${completedHabitsToday} / ${totalHabitsToday}</div>
            <div class="label">Habit Selesai Hari Ini (${percentToday}%)</div>
            <div class="progress-bar-bg" style="width: 140px;">
              <div class="progress-bar-fill" style="width: ${percentToday}%; background: var(--grad-orange);"></div>
            </div>
          </div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-icon" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">
            <i data-lucide="flame"></i>
          </div>
          <div class="stat-info">
            <div class="value">${activeStreaks} Habit</div>
            <div class="label">Streak Beruntun Aktif</div>
          </div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-icon" style="background: rgba(168, 85, 247, 0.2); color: #c084fc;">
            <i data-lucide="sparkles"></i>
          </div>
          <div class="stat-info">
            <div class="value">${goals.length} Goal</div>
            <div class="label">Tujuan Utama Berjalan</div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3>Checklist Hari Ini (${new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })})</h3>
            <span class="badge badge-spiritual">${percentToday}% Tuntas</span>
          </div>

          ${habits.length === 0 ? `
            <div class="empty-state">
              <div class="empty-icon">📝</div>
              <p>Belum ada habit harian. Tambahkan habit pertama Anda!</p>
            </div>
          ` : habits.map(h => {
            const isDone = h.completedDates && h.completedDates.includes(todayStr);
            const streak = Storage.calculateHabitStreak(h);
            const linkedGoal = goals.find(g => g.id === h.goalId);
            const gcalUrl = GoogleCalendar.getDirectEventUrl(h, linkedGoal ? linkedGoal.title : '');

            return `
              <div class="check-item habit-card-draggable ${isDone ? 'completed' : ''}" 
                   draggable="true" 
                   data-id="${h.id}" 
                   style="flex-direction: column; align-items: stretch; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div class="drag-handle" title="Tarik untuk memindahkan urutan">
                    <i data-lucide="grip-vertical" style="width: 18px; height: 18px;"></i>
                  </div>

                  <div class="custom-checkbox btn-toggle-habit" data-id="${h.id}">
                    ${isDone ? '<i data-lucide="check" style="width: 14px; height: 14px;"></i>' : ''}
                  </div>
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <div class="check-text" style="font-weight: 600;">${h.title}</div>
                      <span class="duration-pill">${h.durationMinutes || 15} menit</span>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
                      <span class="badge badge-${h.category}">${h.category}</span>
                      ${linkedGoal ? `<span style="font-size: 0.75rem; color: var(--text-dim);">🎯 ${linkedGoal.title}</span>` : ''}
                    </div>
                  </div>

                  <a href="${gcalUrl}" target="_blank" class="btn-gcal" title="Tambah ke Google Calendar">
                    <i data-lucide="calendar-plus" style="width: 16px; height: 16px;"></i>
                  </a>

                  <button class="btn-duplicate-habit" data-id="${h.id}" title="Duplikat Habit Ini" style="color: var(--text-dim); padding: 4px;">
                    <i data-lucide="copy" style="width: 16px; height: 16px;"></i>
                  </button>

                  <button class="btn-edit-habit" data-id="${h.id}" title="Edit Habit" style="color: var(--text-dim); padding: 4px;">
                    <i data-lucide="pencil" style="width: 16px; height: 16px;"></i>
                  </button>

                  <button class="btn-delete-habit" data-id="${h.id}" title="Hapus Habit" style="color: var(--text-dim); padding: 4px;">
                    <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                  </button>

                  <div class="streak-badge">
                    <i data-lucide="flame" style="width: 16px; height: 16px;"></i> ${streak.current} d
                  </div>
                </div>

                <!-- Habit Implementation Plan Row -->
                ${h.implementationPlan ? `
                  <div class="implementation-plan-box btn-edit-habit" data-id="${h.id}" title="Klik untuk mengedit Habit Implementation Plan">
                    💡 <strong style="color: #6ee7b7;">Plan:</strong> ${h.implementationPlan}
                  </div>
                ` : `
                  <div class="implementation-plan-box implementation-plan-empty btn-edit-habit" data-id="${h.id}">
                    💡 + Isi Habit Implementation Plan ("Saya akan [AKSI] pada [WAKTU] di [LOKASI]")
                  </div>
                `}
              </div>
            `;
          }).join('')}
        </div>

        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3>Target Sub-Goal / Milestone 🎯</h3>
            <button class="btn btn-secondary" style="padding: 4px 12px; font-size: 0.8rem;" id="btn-goto-goals">
              Lihat Semua Goal
            </button>
          </div>

          ${pendingSubGoals.length === 0 ? `
            <div class="empty-state">
              <div class="empty-icon">🎉</div>
              <p>Semua sub-goal telah selesai atau belum dibuat!</p>
            </div>
          ` : pendingSubGoals.slice(0, 5).map(sg => `
            <div class="check-item">
              <div class="custom-checkbox btn-toggle-subgoal" data-goal-id="${sg.goalId}" data-subgoal-id="${sg.id}"></div>
              <div style="flex: 1;">
                <div class="check-text" style="font-weight: 600;">${sg.title}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                  Tujuan: <strong style="color: ${sg.goalColor};">${sg.goalTitle}</strong> • Target: ${sg.dueDate || 'Tanpa Tanggal'}
                </div>
              </div>
              <button class="btn-edit-subgoal" data-goal-id="${sg.goalId}" data-subgoal-id="${sg.id}" title="Edit Sub-Goal" style="color: var(--text-dim); margin-left: 6px;">
                <i data-lucide="pencil" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelector('#orange-tree-svg-btn')?.addEventListener('click', () => {
      fireConfetti();
    });

    container.querySelector('#btn-add-habit-today')?.addEventListener('click', () => onAction('open-habit-modal'));
    container.querySelector('#btn-goto-goals')?.addEventListener('click', () => onAction('switch-tab', 'goals'));
    container.querySelector('#btn-export-gcal-today')?.addEventListener('click', () => {
      GoogleCalendar.exportICalendar(habits, goals);
    });

    container.querySelectorAll('.btn-toggle-habit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const habitId = btn.dataset.id;
        const currentHabits = Storage.getHabits();
        const h = currentHabits.find(item => item.id === habitId);
        if (h) {
          if (!h.completedDates) h.completedDates = [];
          const idx = h.completedDates.indexOf(todayStr);
          if (idx > -1) {
            h.completedDates.splice(idx, 1);
          } else {
            h.completedDates.push(todayStr);
            fireConfetti();
          }
          Storage.saveHabits(currentHabits);
          onAction('render-current-tab');
        }
      });
    });

    container.querySelectorAll('.btn-duplicate-habit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (Storage.duplicateHabit(btn.dataset.id)) {
          fireConfetti();
          onAction('render-current-tab');
        }
      });
    });

    container.querySelectorAll('.btn-edit-habit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const habitId = btn.dataset.id;
        const habitToEdit = Storage.getHabits().find(h => h.id === habitId);
        if (habitToEdit) {
          onAction('open-habit-modal', habitToEdit);
        }
      });
    });

    container.querySelectorAll('.btn-delete-habit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Apakah Anda yakin ingin menghapus habit ini?')) {
          const currentHabits = Storage.getHabits().filter(h => h.id !== btn.dataset.id);
          Storage.saveHabits(currentHabits);
          onAction('render-current-tab');
        }
      });
    });

    container.querySelectorAll('.btn-toggle-subgoal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const { goalId, subgoalId } = btn.dataset;
        const currentGoals = Storage.getGoals();
        const goal = currentGoals.find(g => g.id === goalId);
        if (goal && goal.subGoals) {
          const sg = goal.subGoals.find(s => s.id === subgoalId);
          if (sg) {
            sg.completed = !sg.completed;
            if (sg.completed) fireConfetti();
            Storage.saveGoals(currentGoals);
            onAction('render-current-tab');
          }
        }
      });
    });

    container.querySelectorAll('.btn-edit-subgoal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const { goalId, subgoalId } = btn.dataset;
        const currentGoals = Storage.getGoals();
        const goal = currentGoals.find(g => g.id === goalId);
        if (goal && goal.subGoals) {
          const sg = goal.subGoals.find(s => s.id === subgoalId);
          if (sg) {
            onAction('open-subgoal-modal', { goalId, subGoal: sg });
          }
        }
      });
    });

    // Drag and Drop Event Listeners for Today View
    const todayHabitCards = container.querySelectorAll('.habit-card-draggable');
    todayHabitCards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        draggedHabitId = card.dataset.id;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.dataset.id);
      });

      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (card.dataset.id !== draggedHabitId) {
          card.classList.add('drag-over');
        }
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
      });

      card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.classList.remove('drag-over');
        const targetHabitId = card.dataset.id;
        if (!draggedHabitId || draggedHabitId === targetHabitId) return;

        const currentHabits = Storage.getHabits();
        const fromIdx = currentHabits.findIndex(h => h.id === draggedHabitId);
        const toIdx = currentHabits.findIndex(h => h.id === targetHabitId);

        if (fromIdx > -1 && toIdx > -1) {
          const [movedHabit] = currentHabits.splice(fromIdx, 1);
          currentHabits.splice(toIdx, 0, movedHabit);
          Storage.saveHabits(currentHabits);
          renderTodayView(container, onAction);
        }
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        todayHabitCards.forEach(c => c.classList.remove('drag-over'));
        draggedHabitId = null;
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // 3. GOALS & SUB-GOALS VIEW
  // =========================================================================
  function renderGoalsView(container, onAction) {
    const goals = Storage.getGoals();
    const habits = Storage.getHabits();

    container.innerHTML = `
      <div class="header-bar">
        <div class="page-title">
          <h1>Daftar Goal & Sub-Goal 🚀</h1>
          <p>Kelola tujuan utama, pecah menjadi milestone konkret, dan selesaikan langkah demi langkah.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" id="btn-add-goal">
            <i data-lucide="plus"></i> Buat Goal Baru
          </button>
        </div>
      </div>

      ${goals.length === 0 ? `
        <div class="glass-card empty-state">
          <div class="empty-icon">🎯</div>
          <h3>Belum Ada Goal Utama</h3>
          <p>Mulai perjalanan sukses Anda dengan menetapkan tujuan utama pertama Anda.</p>
          <button class="btn btn-primary" style="margin-top: 16px;" id="btn-empty-add-goal">
            <i data-lucide="plus"></i> Tambah Goal Sekarang
          </button>
        </div>
      ` : `
        <div class="grid-2">
          ${goals.map(g => {
            const progressPct = Storage.calculateGoalProgress(g, habits);
            const subGoals = g.subGoals || [];
            const completedSubCount = subGoals.filter(s => s.completed).length;
            const linkedHabitsCount = habits.filter(h => h.goalId === g.id).length;

            return `
              <div class="glass-card" style="border-top: 4px solid ${g.color || '#6366f1'};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                  <div>
                    <span class="badge badge-${g.category}">${g.category}</span>
                    <h3 style="font-size: 1.3rem; margin-top: 8px;">${g.title}</h3>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.5rem; font-weight: 800; color: ${g.color || '#6366f1'};">${progressPct}%</span>
                    
                    <button class="btn-edit-goal" data-id="${g.id}" title="Edit Goal Utama" style="color: var(--text-dim); padding: 4px;">
                      <i data-lucide="pencil" style="width: 18px; height: 18px;"></i>
                    </button>

                    <button class="btn-delete-goal" data-id="${g.id}" title="Hapus Goal" style="color: var(--text-dim); padding: 4px;">
                      <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                    </button>
                  </div>
                </div>

                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">
                  ${g.description || 'Tidak ada deskripsi.'}
                </p>

                <div class="progress-bar-bg" style="margin-bottom: 20px;">
                  <div class="progress-bar-fill" style="width: ${progressPct}%; background: ${g.color || 'var(--grad-primary)'};"></div>
                </div>

                <div style="display: flex; gap: 16px; font-size: 0.8rem; color: var(--text-dim); margin-bottom: 20px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">
                  <div>Target: ${g.targetDate || 'TBA'}</div>
                  <div>Sub-Goal: ${completedSubCount}/${subGoals.length}</div>
                  <div>Habit: ${linkedHabitsCount}</div>
                </div>

                <div style="margin-top: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="font-size: 0.95rem; color: var(--text-muted);">Tujuan-tujuan Kecil (Sub-Goals)</h4>
                    <button class="btn-add-subgoal" data-goal-id="${g.id}" style="font-size: 0.8rem; color: #818cf8; font-weight: 600;">
                      + Sub-Goal
                    </button>
                  </div>

                  ${subGoals.length === 0 ? `
                    <div style="font-size: 0.85rem; color: var(--text-dim); font-style: italic; margin-bottom: 8px;">
                      Belum ada sub-goal. Tambahkan milestone kecil untuk goal ini!
                    </div>
                  ` : subGoals.map(sg => `
                    <div class="check-item ${sg.completed ? 'completed' : ''}">
                      <div class="custom-checkbox btn-toggle-subgoal" data-goal-id="${g.id}" data-subgoal-id="${sg.id}">
                        ${sg.completed ? '<i data-lucide="check" style="width: 14px; height: 14px;"></i>' : ''}
                      </div>
                      <span class="check-text" style="flex: 1; font-size: 0.9rem;">${sg.title}</span>
                      ${sg.dueDate ? `<span style="font-size: 0.75rem; color: var(--text-dim);">${sg.dueDate}</span>` : ''}
                      
                      <button class="btn-edit-subgoal" data-goal-id="${g.id}" data-subgoal-id="${sg.id}" title="Edit Sub-Goal" style="color: var(--text-dim); margin-left: 6px;">
                        <i data-lucide="pencil" style="width: 14px; height: 14px;"></i>
                      </button>

                      <button class="btn-delete-subgoal" data-goal-id="${g.id}" data-subgoal-id="${sg.id}" style="color: var(--text-dim); margin-left: 6px;">
                        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;

    container.querySelector('#btn-add-goal')?.addEventListener('click', () => onAction('open-goal-modal'));
    container.querySelector('#btn-empty-add-goal')?.addEventListener('click', () => onAction('open-goal-modal'));

    container.querySelectorAll('.btn-edit-goal').forEach(btn => {
      btn.addEventListener('click', () => {
        const goalToEdit = Storage.getGoals().find(g => g.id === btn.dataset.id);
        if (goalToEdit) {
          onAction('open-goal-modal', goalToEdit);
        }
      });
    });

    container.querySelectorAll('.btn-add-subgoal').forEach(btn => {
      btn.addEventListener('click', () => {
        onAction('open-subgoal-modal', { goalId: btn.dataset.goalId, subGoal: null });
      });
    });

    container.querySelectorAll('.btn-edit-subgoal').forEach(btn => {
      btn.addEventListener('click', () => {
        const { goalId, subgoalId } = btn.dataset;
        const currentGoals = Storage.getGoals();
        const goal = currentGoals.find(g => g.id === goalId);
        if (goal && goal.subGoals) {
          const sg = goal.subGoals.find(s => s.id === subgoalId);
          if (sg) {
            onAction('open-subgoal-modal', { goalId, subGoal: sg });
          }
        }
      });
    });

    container.querySelectorAll('.btn-toggle-subgoal').forEach(btn => {
      btn.addEventListener('click', () => {
        const { goalId, subgoalId } = btn.dataset;
        const currentGoals = Storage.getGoals();
        const goal = currentGoals.find(g => g.id === goalId);
        if (goal && goal.subGoals) {
          const sg = goal.subGoals.find(s => s.id === subgoalId);
          if (sg) {
            sg.completed = !sg.completed;
            if (sg.completed) fireConfetti();
            Storage.saveGoals(currentGoals);
            onAction('render-current-tab');
          }
        }
      });
    });

    container.querySelectorAll('.btn-delete-subgoal').forEach(btn => {
      btn.addEventListener('click', () => {
        const { goalId, subgoalId } = btn.dataset;
        const currentGoals = Storage.getGoals();
        const goal = currentGoals.find(g => g.id === goalId);
        if (goal && goal.subGoals) {
          goal.subGoals = goal.subGoals.filter(s => s.id !== subgoalId);
          Storage.saveGoals(currentGoals);
          onAction('render-current-tab');
        }
      });
    });

    container.querySelectorAll('.btn-delete-goal').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin menghapus Goal ini?')) {
          const currentGoals = Storage.getGoals().filter(g => g.id !== btn.dataset.id);
          Storage.saveGoals(currentGoals);
          onAction('render-current-tab');
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // 4. HABITS TRACKER VIEW (CATEGORY GROUP MATRIX WITH ORANGE TREE WIDGET)
  // =========================================================================
  function renderHabitsView(container, onAction, activeCategoryFilter = 'all') {
    let allHabits = Storage.getHabits();
    const goals = Storage.getGoals();
    const todayStr = getTodayStr(0);

    let displayHabits = allHabits;
    if (activeCategoryFilter !== 'all') {
      displayHabits = allHabits.filter(h => h.category === activeCategoryFilter);
    }

    const totalHabitsToday = allHabits.length;
    const completedHabitsToday = allHabits.filter(h => h.completedDates && h.completedDates.includes(todayStr)).length;
    const percentToday = totalHabitsToday > 0 ? Math.round((completedHabitsToday / totalHabitsToday) * 100) : 0;

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push({
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('id-ID', { weekday: 'narrow' }),
        dayNum: d.getDate()
      });
    }

    const categories = [
      { id: 'all', label: 'Semua Kategori' },
      { id: 'spiritual', label: 'Spiritual Habit' },
      { id: 'health', label: 'Physical / Health Habit' },
      { id: 'career', label: 'Intellectual / Career' },
      { id: 'finance', label: 'Keuangan' },
      { id: 'personal', label: 'Emotional / Personal' },
      { id: 'creativity', label: 'Creativity / Custom' }
    ];

    const categoryGroups = [
      { key: 'spiritual', label: 'Spiritual Habit', cssClass: 'category-vertical-spiritual' },
      { key: 'health', label: 'Physical Habit', cssClass: 'category-vertical-health' },
      { key: 'career', label: 'Intellectual Habit', cssClass: 'category-vertical-career' },
      { key: 'personal', label: 'Emotional Habit', cssClass: 'category-vertical-personal' },
      { key: 'finance', label: 'Finance Habit', cssClass: 'category-vertical-finance' },
      { key: 'creativity', label: 'Custom Habit', cssClass: 'category-vertical-creativity' }
    ];

    const orangeGardenHTML = renderOrangeTreeGardenWidget(percentToday, totalHabitsToday, completedHabitsToday);

    container.innerHTML = `
      <div class="header-bar">
        <div class="page-title">
          <h1>Matriks Kelompok Habit ⚡</h1>
          <p>Tarik, duplikat, edit, atau hapus bilah habit untuk menyusun rutinitas harian terbaik Anda.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-google" id="btn-export-ical-habits">
            <i data-lucide="calendar"></i> Ekspor Ke Google Calendar
          </button>
          <button class="btn btn-primary" id="btn-add-habit">
            <i data-lucide="plus"></i> Tambah Habit Baru
          </button>
        </div>
      </div>

      <!-- Pohon Jeruk Visual Kebiasaan -->
      ${orangeGardenHTML}

      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px;">
        ${categories.map(cat => `
          <button class="btn ${cat.id === activeCategoryFilter ? 'btn-primary' : 'btn-secondary'} btn-filter-cat" data-cat="${cat.id}" style="padding: 6px 14px; font-size: 0.85rem;">
            ${cat.label}
          </button>
        `).join('')}
      </div>

      ${displayHabits.length === 0 ? `
        <div class="glass-card empty-state">
          <div class="empty-icon">🌱</div>
          <h3>Belum Ada Habit Dalam Kategori Ini</h3>
          <p>Tambahkan kebiasaan harian baru untuk mulai melatih konsistensi.</p>
          <button class="btn btn-primary" id="btn-empty-add-habit" style="margin-top: 16px;">
            <i data-lucide="plus"></i> Tambah Habit Sekarang
          </button>
        </div>
      ` : `
        <div id="habits-matrix-wrapper">
          ${categoryGroups.map(grp => {
            const groupHabits = displayHabits.filter(h => h.category === grp.key);
            if (groupHabits.length === 0) return '';

            return `
              <div class="category-group-box">
                <div class="category-vertical-label ${grp.cssClass}">
                  ${grp.label}
                </div>

                <div class="category-group-content">
                  ${groupHabits.map((h) => {
                    const linkedGoal = goals.find(g => g.id === h.goalId);
                    const gcalUrl = GoogleCalendar.getDirectEventUrl(h, linkedGoal ? linkedGoal.title : '');
                    const isDoneToday = h.completedDates && h.completedDates.includes(getTodayStr(0));

                    return `
                      <div class="check-item habit-card-draggable ${isDoneToday ? 'completed' : ''}" 
                           draggable="true" 
                           data-id="${h.id}"
                           style="margin-bottom: 0; padding: 14px 18px; flex-direction: column; align-items: stretch; gap: 10px;">
                        
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                          <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 260px;">
                            <div class="drag-handle" title="Tarik untuk memindahkan urutan">
                              <i data-lucide="grip-vertical" style="width: 18px; height: 18px;"></i>
                            </div>
                            
                            <div class="custom-checkbox btn-toggle-habit-matrix" data-id="${h.id}">
                              ${isDoneToday ? '<i data-lucide="check" style="width: 14px; height: 14px;"></i>' : ''}
                            </div>

                            <div style="flex: 1;">
                              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                                <span class="check-text" style="font-weight: 700; font-size: 1rem;">${h.title}</span>
                                <span class="duration-pill">${h.durationMinutes || 15} menit</span>
                              </div>
                              ${linkedGoal ? `<div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 2px;">🎯 Goal: ${linkedGoal.title}</div>` : ''}
                            </div>
                          </div>

                          <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="habit-days">
                              ${last7Days.map(day => {
                                const isCompleted = h.completedDates && h.completedDates.includes(day.dateStr);
                                return `
                                  <button class="day-pill ${isCompleted ? 'done' : ''} btn-toggle-date" data-habit-id="${h.id}" data-date="${day.dateStr}" title="${day.dateStr}">
                                    <span>${day.dayName}</span>
                                    <strong style="font-size: 0.8rem;">${day.dayNum}</strong>
                                  </button>
                                `;
                              }).join('')}
                            </div>

                            <a href="${gcalUrl}" target="_blank" class="btn-gcal" title="Tambah ke Google Calendar">
                              <i data-lucide="calendar-plus" style="width: 18px; height: 18px;"></i>
                            </a>

                            <button class="btn-duplicate-habit" data-id="${h.id}" title="Duplikat Habit Ini" style="color: var(--text-dim); padding: 4px;">
                              <i data-lucide="copy" style="width: 18px; height: 18px;"></i>
                            </button>

                            <button class="btn-edit-habit" data-id="${h.id}" title="Edit Habit & Rencana Implementasi" style="color: var(--text-dim); padding: 4px;">
                              <i data-lucide="pencil" style="width: 18px; height: 18px;"></i>
                            </button>

                            <button class="btn-delete-habit" data-id="${h.id}" title="Hapus Habit" style="color: var(--text-dim); padding: 4px;">
                              <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                            </button>
                          </div>
                        </div>

                        <!-- Habit Implementation Plan Row -->
                        ${h.implementationPlan ? `
                          <div class="implementation-plan-box btn-edit-habit" data-id="${h.id}" title="Klik untuk mengedit Habit Implementation Plan">
                            💡 <strong style="color: #6ee7b7;">Rencana Implementasi:</strong> ${h.implementationPlan}
                          </div>
                        ` : `
                          <div class="implementation-plan-box implementation-plan-empty btn-edit-habit" data-id="${h.id}">
                            💡 + Isi Habit Implementation Plan ("Saya akan [AKSI] pada [WAKTU] di [LOKASI]")
                          </div>
                        `}
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;

    container.querySelector('#orange-tree-svg-btn')?.addEventListener('click', () => {
      fireConfetti();
    });

    container.querySelector('#btn-add-habit')?.addEventListener('click', () => onAction('open-habit-modal'));
    container.querySelector('#btn-empty-add-habit')?.addEventListener('click', () => onAction('open-habit-modal'));
    container.querySelector('#btn-export-ical-habits')?.addEventListener('click', () => {
      GoogleCalendar.exportICalendar(allHabits, goals);
    });

    container.querySelectorAll('.btn-filter-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        renderHabitsView(container, onAction, btn.dataset.cat);
      });
    });

    container.querySelectorAll('.btn-toggle-habit-matrix').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const habitId = btn.dataset.id;
        const currentHabits = Storage.getHabits();
        const h = currentHabits.find(item => item.id === habitId);
        if (h) {
          if (!h.completedDates) h.completedDates = [];
          const idx = h.completedDates.indexOf(todayStr);
          if (idx > -1) {
            h.completedDates.splice(idx, 1);
          } else {
            h.completedDates.push(todayStr);
            fireConfetti();
          }
          Storage.saveHabits(currentHabits);
          renderHabitsView(container, onAction, activeCategoryFilter);
        }
      });
    });

    container.querySelectorAll('.btn-toggle-date').forEach(btn => {
      btn.addEventListener('click', () => {
        const { habitId, date } = btn.dataset;
        const currentHabits = Storage.getHabits();
        const h = currentHabits.find(item => item.id === habitId);
        if (h) {
          if (!h.completedDates) h.completedDates = [];
          const idx = h.completedDates.indexOf(date);
          if (idx > -1) {
            h.completedDates.splice(idx, 1);
          } else {
            h.completedDates.push(date);
            fireConfetti();
          }
          Storage.saveHabits(currentHabits);
          renderHabitsView(container, onAction, activeCategoryFilter);
        }
      });
    });

    container.querySelectorAll('.btn-duplicate-habit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (Storage.duplicateHabit(btn.dataset.id)) {
          fireConfetti();
          renderHabitsView(container, onAction, activeCategoryFilter);
        }
      });
    });

    container.querySelectorAll('.btn-edit-habit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const habitId = btn.dataset.id;
        const habitToEdit = Storage.getHabits().find(h => h.id === habitId);
        if (habitToEdit) {
          onAction('open-habit-modal', habitToEdit);
        }
      });
    });

    container.querySelectorAll('.btn-delete-habit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Apakah Anda yakin ingin menghapus habit ini?')) {
          const currentHabits = Storage.getHabits().filter(h => h.id !== btn.dataset.id);
          Storage.saveHabits(currentHabits);
          renderHabitsView(container, onAction, activeCategoryFilter);
        }
      });
    });

    // Drag & Drop
    const habitCards = container.querySelectorAll('.habit-card-draggable');
    habitCards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        draggedHabitId = card.dataset.id;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.dataset.id);
      });

      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (card.dataset.id !== draggedHabitId) {
          card.classList.add('drag-over');
        }
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
      });

      card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.classList.remove('drag-over');
        const targetHabitId = card.dataset.id;
        if (!draggedHabitId || draggedHabitId === targetHabitId) return;

        const currentHabits = Storage.getHabits();
        const fromIdx = currentHabits.findIndex(h => h.id === draggedHabitId);
        const toIdx = currentHabits.findIndex(h => h.id === targetHabitId);

        if (fromIdx > -1 && toIdx > -1) {
          const [movedHabit] = currentHabits.splice(fromIdx, 1);
          currentHabits.splice(toIdx, 0, movedHabit);
          Storage.saveHabits(currentHabits);
          renderHabitsView(container, onAction, activeCategoryFilter);
        }
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        habitCards.forEach(c => c.classList.remove('drag-over'));
        draggedHabitId = null;
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // 5. PROGRES RINGKAS HABIT VIEW (WITH MINI ORANGE TREE PER HABIT)
  // =========================================================================
  function renderCompactProgressView(container, onAction) {
    const habits = Storage.getHabits();
    const goals = Storage.getGoals();

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push({
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('id-ID', { weekday: 'narrow' }),
        dayNum: d.getDate()
      });
    }

    let totalCheckInsAllTime = 0;
    let totalMinutesInvested = 0;

    habits.forEach(h => {
      const count = (h.completedDates || []).length;
      totalCheckInsAllTime += count;
      totalMinutesInvested += count * (h.durationMinutes || 15);
    });

    const hoursInvested = (totalMinutesInvested / 60).toFixed(1);

    container.innerHTML = `
      <div class="header-bar">
        <div class="page-title">
          <h1>Progres Ringkas Habit 📈</h1>
          <p>Pantau perkembangan tanggal dan akumulasi total seluruh habit secara bersih tanpa instruksi tambahan.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" id="btn-add-habit-compact">
            <i data-lucide="plus"></i> Tambah Habit
          </button>
        </div>
      </div>

      <div class="grid-3" style="margin-bottom: 28px;">
        <div class="glass-card stat-card">
          <div class="stat-icon" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">
            <i data-lucide="check-check"></i>
          </div>
          <div class="stat-info">
            <div class="value">${totalCheckInsAllTime} Selesai</div>
            <div class="label">Total Akumulasi Check-in</div>
          </div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-icon" style="background: rgba(99, 102, 241, 0.2); color: #818cf8;">
            <i data-lucide="clock"></i>
          </div>
          <div class="stat-info">
            <div class="value">${hoursInvested} Jam</div>
            <div class="label">Total Investasi Waktu Habit</div>
          </div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-icon" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">
            <i data-lucide="calendar"></i>
          </div>
          <div class="stat-info">
            <div class="value">${habits.length} Habit</div>
            <div class="label">Total Kebiasaan Terdaftar</div>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border-glass);">
          <h3 style="font-size: 1.25rem;">Daftar Kebiasaan & Visualisasi Pohon Jeruk 🍊</h3>
          <span style="font-size: 0.85rem; color: var(--text-muted);">Urutan berdasarkan daftar utama • Seret untuk mengatur</span>
        </div>

        ${habits.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">📊</div>
            <p>Belum ada habit terdaftar. Tambahkan habit pertama Anda!</p>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${habits.map(h => {
              const linkedGoal = goals.find(g => g.id === h.goalId);
              const streak = Storage.calculateHabitStreak(h);
              const totalCompleted = (h.completedDates || []).length;
              const totalMinutes = totalCompleted * (h.durationMinutes || 15);
              const isDoneToday = h.completedDates && h.completedDates.includes(getTodayStr(0));

              const baselineTarget = 30;
              const accumPct = Math.min(100, Math.round((totalCompleted / baselineTarget) * 100));
              const miniTreeSVG = renderOrangeTreeSVG(accumPct);

              return `
                <div class="check-item habit-card-draggable ${isDoneToday ? 'completed' : ''}" 
                     draggable="true" 
                     data-id="${h.id}" 
                     style="padding: 16px 20px; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
                  
                  <div style="display: flex; align-items: center; gap: 14px; min-width: 280px; flex: 1.2;">
                    <div class="drag-handle" title="Tarik untuk memindahkan urutan">
                      <i data-lucide="grip-vertical" style="width: 18px; height: 18px;"></i>
                    </div>

                    <!-- Mini Orange Tree Indicator -->
                    <div style="width: 46px; height: 46px; cursor: pointer; flex-shrink: 0;" class="btn-tree-celebrate" title="Pohon Jeruk Habit (${accumPct}% berbuah)">
                      ${miniTreeSVG}
                    </div>

                    <div class="custom-checkbox btn-toggle-compact-habit" data-id="${h.id}">
                      ${isDoneToday ? '<i data-lucide="check" style="width: 14px; height: 14px;"></i>' : ''}
                    </div>

                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span class="check-text" style="font-weight: 700; font-size: 1.05rem;">${h.title}</span>
                        <span class="duration-pill">${h.durationMinutes || 15}m</span>
                      </div>

                      <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
                        <span class="badge badge-${h.category}">${h.category}</span>
                        ${linkedGoal ? `<span style="font-size: 0.78rem; color: var(--text-dim);">🎯 ${linkedGoal.title}</span>` : ''}
                      </div>
                    </div>
                  </div>

                  <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                    <span style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Progres Tanggal (7 Hari)</span>
                    <div class="habit-days">
                      ${last7Days.map(day => {
                        const isCompleted = h.completedDates && h.completedDates.includes(day.dateStr);
                        return `
                          <button class="day-pill ${isCompleted ? 'done' : ''} btn-toggle-compact-date" data-habit-id="${h.id}" data-date="${day.dateStr}" title="${day.dateStr}">
                            <span>${day.dayName}</span>
                            <strong style="font-size: 0.8rem;">${day.dayNum}</strong>
                          </button>
                        `;
                      }).join('')}
                    </div>
                  </div>

                  <div style="display: flex; flex-direction: column; min-width: 200px; flex: 0.8; justify-content: center; gap: 6px; background: rgba(15, 23, 42, 0.4); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
                      <span style="color: var(--text-muted);">Akumulasi: <strong style="color: #6ee7b7;">${totalCompleted} Hari</strong></span>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span class="streak-badge"><i data-lucide="flame" style="width: 14px; height: 14px;"></i> ${streak.current}d</span>
                        <button class="btn-duplicate-habit" data-id="${h.id}" title="Duplikat Habit Ini" style="color: var(--text-dim); padding: 2px;">
                          <i data-lucide="copy" style="width: 15px; height: 15px;"></i>
                        </button>
                        <button class="btn-edit-habit" data-id="${h.id}" title="Edit Habit" style="color: var(--text-dim); padding: 2px;">
                          <i data-lucide="pencil" style="width: 15px; height: 15px;"></i>
                        </button>
                        <button class="btn-delete-habit" data-id="${h.id}" title="Hapus Habit" style="color: var(--text-dim); padding: 2px;">
                          <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
                        </button>
                      </div>
                    </div>

                    <div class="progress-bar-bg" style="margin-top: 0; height: 7px;">
                      <div class="progress-bar-fill" style="width: ${accumPct}%; background: linear-gradient(90deg, #10b981, #ff9f43, #ff5252);"></div>
                    </div>

                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-dim);">
                      <span>${totalMinutes} Menit Berlatih</span>
                      <span>${accumPct}% Pohon Berbuah</span>
                    </div>
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    container.querySelectorAll('.btn-tree-celebrate').forEach(btn => {
      btn.addEventListener('click', () => {
        fireConfetti();
      });
    });

    container.querySelector('#btn-add-habit-compact')?.addEventListener('click', () => onAction('open-habit-modal'));

    container.querySelectorAll('.btn-toggle-compact-habit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const habitId = btn.dataset.id;
        const currentHabits = Storage.getHabits();
        const h = currentHabits.find(item => item.id === habitId);
        const todayStr = getTodayStr(0);
        if (h) {
          if (!h.completedDates) h.completedDates = [];
          const idx = h.completedDates.indexOf(todayStr);
          if (idx > -1) {
            h.completedDates.splice(idx, 1);
          } else {
            h.completedDates.push(todayStr);
            fireConfetti();
          }
          Storage.saveHabits(currentHabits);
          renderCompactProgressView(container, onAction);
        }
      });
    });

    container.querySelectorAll('.btn-toggle-compact-date').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const { habitId, date } = btn.dataset;
        const currentHabits = Storage.getHabits();
        const h = currentHabits.find(item => item.id === habitId);
        if (h) {
          if (!h.completedDates) h.completedDates = [];
          const idx = h.completedDates.indexOf(date);
          if (idx > -1) {
            h.completedDates.splice(idx, 1);
          } else {
            h.completedDates.push(date);
            fireConfetti();
          }
          Storage.saveHabits(currentHabits);
          renderCompactProgressView(container, onAction);
        }
      });
    });

    container.querySelectorAll('.btn-duplicate-habit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (Storage.duplicateHabit(btn.dataset.id)) {
          fireConfetti();
          renderCompactProgressView(container, onAction);
        }
      });
    });

    container.querySelectorAll('.btn-edit-habit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const habitId = btn.dataset.id;
        const habitToEdit = Storage.getHabits().find(h => h.id === habitId);
        if (habitToEdit) {
          onAction('open-habit-modal', habitToEdit);
        }
      });
    });

    container.querySelectorAll('.btn-delete-habit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Apakah Anda yakin ingin menghapus habit ini?')) {
          const currentHabits = Storage.getHabits().filter(h => h.id !== btn.dataset.id);
          Storage.saveHabits(currentHabits);
          renderCompactProgressView(container, onAction);
        }
      });
    });

    // Drag and Drop
    const compactCards = container.querySelectorAll('.habit-card-draggable');
    compactCards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        draggedHabitId = card.dataset.id;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.dataset.id);
      });

      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (card.dataset.id !== draggedHabitId) {
          card.classList.add('drag-over');
        }
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
      });

      card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.classList.remove('drag-over');
        const targetHabitId = card.dataset.id;
        if (!draggedHabitId || draggedHabitId === targetHabitId) return;

        const currentHabits = Storage.getHabits();
        const fromIdx = currentHabits.findIndex(h => h.id === draggedHabitId);
        const toIdx = currentHabits.findIndex(h => h.id === targetHabitId);

        if (fromIdx > -1 && toIdx > -1) {
          const [movedHabit] = currentHabits.splice(fromIdx, 1);
          currentHabits.splice(toIdx, 0, movedHabit);
          Storage.saveHabits(currentHabits);
          renderCompactProgressView(container, onAction);
        }
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        compactCards.forEach(c => c.classList.remove('drag-over'));
        draggedHabitId = null;
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // 6. FULL REAL-TIME MONTHLY HABIT CALENDAR VIEW
  // =========================================================================
  function renderFullCalendarView(container, onAction) {
    const habits = Storage.getHabits();
    const goals = Storage.getGoals();
    const todayStr = getTodayStr(0);

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const year = calendarActiveYear;
    const month = calendarActiveMonth;

    const firstDayIndex = new Date(year, month, 1).getDay();
    // Shift Sunday (0) to 6 for Sen-Min calendar
    const startingCol = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    // Previous month total days
    const prevMonthDays = new Date(year, month, 0).getDate();

    const calendarCells = [];

    // 1. Previous Month Leading Days
    for (let i = startingCol - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateStr = prevDate.toISOString().split('T')[0];
      calendarCells.push({ dayNum, dateStr, isOtherMonth: true });
    }

    // 2. Current Month Days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      calendarCells.push({ dayNum: d, dateStr, isOtherMonth: false });
    }

    // 3. Next Month Trailing Days to complete 35 or 42 grid slots
    const totalSlots = calendarCells.length > 35 ? 42 : 35;
    const remainingSlots = totalSlots - calendarCells.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateStr = nextDate.toISOString().split('T')[0];
      calendarCells.push({ dayNum: i, dateStr, isOtherMonth: true });
    }

    container.innerHTML = `
      <div class="header-bar">
        <div class="page-title">
          <h1>Kalender Rutinitas Real-time 📅</h1>
          <p>Pantau seluruh kebiasaan Anda dalam kalender penuh. Klik habit pada tanggal tertentu untuk mencentang/membatalkannya secara langsung!</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" id="btn-add-habit-cal">
            <i data-lucide="plus"></i> Tambah Habit
          </button>
        </div>
      </div>

      <!-- Month Header Controls -->
      <div class="full-calendar-header">
        <div class="calendar-month-title">
          <i data-lucide="calendar" style="color: #ff9f43;"></i>
          <span>${monthNames[month]} ${year}</span>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary" id="btn-cal-prev" style="padding: 8px 14px;">
            <i data-lucide="chevron-left"></i> Sebelum
          </button>
          <button class="btn btn-secondary" id="btn-cal-today" style="padding: 8px 14px;">
            Hari Ini
          </button>
          <button class="btn btn-secondary" id="btn-cal-next" style="padding: 8px 14px;">
            Sesudah <i data-lucide="chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Weekday Headers -->
      <div class="calendar-weekdays-row">
        <div>Senin</div>
        <div>Selasa</div>
        <div>Rabu</div>
        <div>Kamis</div>
        <div>Jumat</div>
        <div>Sabtu</div>
        <div>Minggu</div>
      </div>

      <!-- Full Month Grid -->
      <div class="calendar-month-grid">
        ${calendarCells.map(cell => {
          const isToday = cell.dateStr === todayStr;
          const completedHabitsOnDate = habits.filter(h => h.completedDates && h.completedDates.includes(cell.dateStr));
          const completedCount = completedHabitsOnDate.length;
          const totalHabits = habits.length;
          const isPerfect = totalHabits > 0 && completedCount === totalHabits && !cell.isOtherMonth;

          return `
            <div class="calendar-day-cell ${cell.isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isPerfect ? 'perfect-day' : ''}">
              <div class="day-cell-header">
                <div class="day-number">${cell.dayNum}</div>
                <div class="day-completion-badge">
                  ${isPerfect ? '🍊 100%' : `${completedCount}/${totalHabits}`}
                </div>
              </div>

              <div class="day-habits-list">
                ${habits.map(h => {
                  const isDone = h.completedDates && h.completedDates.includes(cell.dateStr);
                  return `
                    <div class="calendar-habit-pill ${isDone ? 'done' : ''} btn-toggle-cal-habit" 
                         data-habit-id="${h.id}" 
                         data-date="${cell.dateStr}" 
                         title="${h.title} (${isDone ? 'Selesai' : 'Belum Selesai'})">
                      <span style="font-size: 0.7rem;">${isDone ? '✓' : '○'}</span>
                      <span style="flex: 1; overflow: hidden; text-overflow: ellipsis;">${h.title}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelector('#btn-add-habit-cal')?.addEventListener('click', () => onAction('open-habit-modal'));

    container.querySelector('#btn-cal-prev')?.addEventListener('click', () => {
      calendarActiveMonth--;
      if (calendarActiveMonth < 0) {
        calendarActiveMonth = 11;
        calendarActiveYear--;
      }
      renderFullCalendarView(container, onAction);
    });

    container.querySelector('#btn-cal-next')?.addEventListener('click', () => {
      calendarActiveMonth++;
      if (calendarActiveMonth > 11) {
        calendarActiveMonth = 0;
        calendarActiveYear++;
      }
      renderFullCalendarView(container, onAction);
    });

    container.querySelector('#btn-cal-today')?.addEventListener('click', () => {
      calendarActiveYear = new Date().getFullYear();
      calendarActiveMonth = new Date().getMonth();
      renderFullCalendarView(container, onAction);
    });

    container.querySelectorAll('.btn-toggle-cal-habit').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const { habitId, date } = pill.dataset;
        const currentHabits = Storage.getHabits();
        const h = currentHabits.find(item => item.id === habitId);
        if (h) {
          if (!h.completedDates) h.completedDates = [];
          const idx = h.completedDates.indexOf(date);
          if (idx > -1) {
            h.completedDates.splice(idx, 1);
          } else {
            h.completedDates.push(date);
            fireConfetti();
          }
          Storage.saveHabits(currentHabits);
          renderFullCalendarView(container, onAction);
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // 7. ANALYTICS & GOOGLE CALENDAR SYNC VIEW
  // =========================================================================
  function renderAnalyticsView(container, onAction) {
    const goals = Storage.getGoals();
    const habits = Storage.getHabits();

    const catStats = {
      spiritual: { count: 0, label: 'Spiritual', color: '#a855f7' },
      health: { count: 0, label: 'Kesehatan', color: '#10b981' },
      career: { count: 0, label: 'Karir', color: '#f59e0b' },
      finance: { count: 0, label: 'Keuangan', color: '#06b6d4' },
      personal: { count: 0, label: 'Pengembangan Diri', color: '#f43f5e' },
      creativity: { count: 0, label: 'Kreativitas', color: '#e879f9' }
    };

    goals.forEach(g => {
      if (catStats[g.category]) catStats[g.category].count++;
    });

    let totalCompletions7Days = 0;
    for (let i = 0; i < 7; i++) {
      const dateStr = getTodayStr(-i);
      habits.forEach(h => {
        if (h.completedDates && h.completedDates.includes(dateStr)) totalCompletions7Days++;
      });
    }

    const maxPossibleCompletions = habits.length * 7;
    const consistencyRate = maxPossibleCompletions > 0 ? Math.round((totalCompletions7Days / maxPossibleCompletions) * 100) : 0;

    container.innerHTML = `
      <div class="header-bar">
        <div class="page-title">
          <h1>Analisis & Integrasi Google Calendar 📊</h1>
          <p>Hubungkan habit Anda langsung ke Google Calendar atau unduh berkas kalender .ics.</p>
        </div>
      </div>

      <div class="grid-3" style="margin-bottom: 32px;">
        <div class="glass-card stat-card">
          <div class="stat-icon" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">
            <i data-lucide="line-chart"></i>
          </div>
          <div class="stat-info">
            <div class="value">${consistencyRate}%</div>
            <div class="label">Konsistensi Mingguan</div>
          </div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-icon" style="background: rgba(99, 102, 241, 0.2); color: #818cf8;">
            <i data-lucide="target"></i>
          </div>
          <div class="stat-info">
            <div class="value">${goals.length} Goal</div>
            <div class="label">Total Tujuan Utama</div>
          </div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-icon" style="background: rgba(232, 121, 249, 0.2); color: #f0abfc;">
            <i data-lucide="check-check"></i>
          </div>
          <div class="stat-info">
            <div class="value">${habits.length} Habit</div>
            <div class="label">Rutinitas Aktif</div>
          </div>
        </div>
      </div>

      <!-- Google Calendar Connection Card -->
      <div class="glass-card" style="margin-bottom: 24px; border: 1px solid rgba(66, 133, 244, 0.3);">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: rgba(66, 133, 244, 0.2); display: flex; align-items: center; justify-content: center; color: #60a5fa;">
            <i data-lucide="calendar" style="width: 24px; height: 24px;"></i>
          </div>
          <div>
            <h3 style="font-size: 1.2rem; color: #93c5fd;">Integrasi Google Calendar 📅</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem;">Tampilkan seluruh rutinitas Habit & Target Goal di aplikasi Google Calendar Anda.</p>
          </div>
        </div>

        <div class="grid-2" style="gap: 16px;">
          <div style="background: rgba(15, 23, 42, 0.6); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
            <h4 style="font-size: 0.95rem; margin-bottom: 8px; color: var(--text-main);">Opsi 1: Ekspor Berkas Kalender (.ics)</h4>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 14px;">
              Unduh berkas <code>.ics</code> lalu impor ke Google Calendar (Menu Setelan -> Impor & Ekspor) dalam sekali klik.
            </p>
            <button class="btn btn-google" id="btn-export-ical-analytics" style="width: 100%; justify-content: center;">
              <i data-lucide="download"></i> Unduh Berkas Google Calendar (.ics)
            </button>
          </div>

          <div style="background: rgba(15, 23, 42, 0.6); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
            <h4 style="font-size: 0.95rem; margin-bottom: 8px; color: var(--text-main);">Opsi 2: Buka Web Google Calendar</h4>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 14px;">
              Gunakan ikon <code>+ Calendar</code> pada tiap kartu habit untuk menambahkan acara harian berulang secara langsung.
            </p>
            <a href="https://calendar.google.com" target="_blank" class="btn btn-secondary" style="width: 100%; justify-content: center;">
              <i data-lucide="external-link"></i> Buka Google Calendar Web
            </a>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="glass-card">
          <h3 style="margin-bottom: 20px;">Distribusi Kategori Goal</h3>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${Object.keys(catStats).map(key => {
              const cat = catStats[key];
              const pct = goals.length > 0 ? Math.round((cat.count / goals.length) * 100) : 0;
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 600; margin-bottom: 4px;">
                    <span style="color: ${cat.color};">${cat.label}</span>
                    <span>${cat.count} Goal (${pct}%)</span>
                  </div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${pct}%; background: ${cat.color};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="glass-card">
          <h3 style="margin-bottom: 12px;">Penyimpanan & Cadangan (JSON) 💾</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">
            Seluruh data disimpan secara otomatis di browser Anda (\`localStorage\`). Anda dapat mengunduh berkas cadangan JSON atau memuat data cadangan kapan saja.
          </p>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            <button class="btn btn-primary" id="btn-export-json" style="justify-content: center;">
              <i data-lucide="download"></i> Ekspor Data Backup (JSON)
            </button>

            <label class="btn btn-secondary" style="justify-content: center; cursor: pointer;">
              <i data-lucide="upload"></i> Impor Data Backup (JSON)
              <input type="file" id="file-import-json" accept=".json" style="display: none;" />
            </label>

            <button class="btn btn-secondary" id="btn-reset-sample" style="justify-content: center; color: #f87171; border-color: rgba(248, 113, 113, 0.3); margin-top: 12px;">
              <i data-lucide="rotate-ccw"></i> Reset Ke Data Sampel Bawaan
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-export-ical-analytics')?.addEventListener('click', () => {
      GoogleCalendar.exportICalendar(habits, goals);
    });

    container.querySelector('#btn-export-json')?.addEventListener('click', () => {
      Storage.exportJSON();
    });

    const fileInput = container.querySelector('#file-import-json');
    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = Storage.importJSON(event.target.result);
          if (res.success) {
            alert('Berhasil mengimpor data backup JSON!');
            onAction('render-current-tab');
          } else {
            alert('Gagal mengimpor JSON: ' + res.error);
          }
        };
        reader.readAsText(file);
      }
    });

    container.querySelector('#btn-reset-sample')?.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin mereset seluruh data ke sampel awal? Data saat ini akan digantikan.')) {
        Storage.resetAll();
        alert('Data berhasil di-reset ke sampel bawaan.');
        onAction('render-current-tab');
      }
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // =========================================================================
  // 8. MODAL FORMS CONTROLLER (WITH EDIT GOAL & EDIT SUB-GOAL SUPPORT)
  // =========================================================================
  function setupModals(onSave) {
    const backdrop = document.getElementById('modal-backdrop');
    const modalContainer = document.getElementById('modal-card-content');

    function openModal(htmlContent) {
      modalContainer.innerHTML = htmlContent;
      backdrop.classList.add('open');
      if (window.lucide) window.lucide.createIcons();

      modalContainer.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
      });
    }

    function closeModal() {
      backdrop.classList.remove('open');
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    return {
      openGoalModal(goalToEdit = null) {
        const isEditing = !!goalToEdit;
        const html = `
          <div class="modal-header">
            <h3>${isEditing ? 'Edit Goal Utama ✏️' : 'Buat Goal Utama Baru 🎯'}</h3>
            <button class="close-btn">&times;</button>
          </div>
          <form id="form-goal">
            <div class="form-group">
              <label>Judul Goal Utama</label>
              <input type="text" id="goal-title" class="form-control" placeholder="Contoh: Menjadi Ahli Fullstack & Bugar 2026" value="${isEditing ? goalToEdit.title : ''}" required />
            </div>

            <div class="form-group">
              <label>Kategori</label>
              <select id="goal-category" class="form-control" required>
                <option value="spiritual" ${isEditing && goalToEdit.category === 'spiritual' ? 'selected' : ''}>Spiritual & Ibadah</option>
                <option value="health" ${isEditing && goalToEdit.category === 'health' ? 'selected' : ''}>Kesehatan & Kebugaran</option>
                <option value="career" ${isEditing && goalToEdit.category === 'career' ? 'selected' : ''}>Karir & Bisnis</option>
                <option value="finance" ${isEditing && goalToEdit.category === 'finance' ? 'selected' : ''}>Keuangan</option>
                <option value="personal" ${isEditing && goalToEdit.category === 'personal' ? 'selected' : ''}>Pengembangan Diri</option>
                <option value="creativity" ${isEditing && goalToEdit.category === 'creativity' ? 'selected' : ''}>Kreativitas</option>
              </select>
            </div>

            <div class="form-group">
              <label>Target Tanggal Selesai</label>
              <input type="date" id="goal-date" class="form-control" value="${isEditing ? (goalToEdit.targetDate || '') : ''}" required />
            </div>

            <div class="form-group">
              <label>Warna Penanda</label>
              <input type="color" id="goal-color" class="form-control" value="${isEditing ? (goalToEdit.color || '#6366f1') : '#6366f1'}" style="height: 42px; padding: 4px;" />
            </div>

            <div class="form-group">
              <label>Deskripsi / Niat Utama</label>
              <textarea id="goal-desc" class="form-control" placeholder="Tuliskan motivasi utama atau alasan di balik goal ini...">${isEditing ? (goalToEdit.description || '') : ''}</textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
              <button type="button" class="btn btn-secondary close-btn">Batal</button>
              <button type="submit" class="btn btn-primary">${isEditing ? 'Simpan Perubahan' : 'Simpan Goal'}</button>
            </div>
          </form>
        `;
        openModal(html);

        document.getElementById('form-goal')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const currentGoals = Storage.getGoals();
          if (isEditing) {
            const g = currentGoals.find(item => item.id === goalToEdit.id);
            if (g) {
              g.title = document.getElementById('goal-title').value;
              g.category = document.getElementById('goal-category').value;
              g.targetDate = document.getElementById('goal-date').value;
              g.color = document.getElementById('goal-color').value;
              g.description = document.getElementById('goal-desc').value;
            }
          } else {
            const newGoal = {
              id: 'g-' + Date.now(),
              title: document.getElementById('goal-title').value,
              category: document.getElementById('goal-category').value,
              targetDate: document.getElementById('goal-date').value,
              color: document.getElementById('goal-color').value,
              description: document.getElementById('goal-desc').value,
              subGoals: []
            };
            currentGoals.push(newGoal);
          }
          Storage.saveGoals(currentGoals);
          closeModal();
          onSave();
        });
      },

      openSubGoalModal(payload) {
        const goalId = typeof payload === 'string' ? payload : payload.goalId;
        const subGoalToEdit = typeof payload === 'object' ? payload.subGoal : null;
        const isEditing = !!subGoalToEdit;

        const goals = Storage.getGoals();
        const targetGoal = goals.find(g => g.id === goalId);
        if (!targetGoal) return;

        const html = `
          <div class="modal-header">
            <h3>${isEditing ? 'Edit Sub-Goal / Milestone ✏️' : 'Tambah Sub-Goal / Milestone 📌'}</h3>
            <button class="close-btn">&times;</button>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
            Untuk Goal: <strong style="color: ${targetGoal.color};">${targetGoal.title}</strong>
          </p>
          <form id="form-subgoal">
            <div class="form-group">
              <label>Judul Sub-Goal / Milestone</label>
              <input type="text" id="subgoal-title" class="form-control" placeholder="Contoh: Menyelesaikan Bab 1 / Latihan 5km" value="${isEditing ? subGoalToEdit.title : ''}" required />
            </div>

            <div class="form-group">
              <label>Target Tanggal Milestone</label>
              <input type="date" id="subgoal-date" class="form-control" value="${isEditing ? (subGoalToEdit.dueDate || '') : ''}" />
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
              <button type="button" class="btn btn-secondary close-btn">Batal</button>
              <button type="submit" class="btn btn-primary">${isEditing ? 'Simpan Perubahan' : 'Tambah Sub-Goal'}</button>
            </div>
          </form>
        `;
        openModal(html);

        document.getElementById('form-subgoal')?.addEventListener('submit', (e) => {
          e.preventDefault();
          if (!targetGoal.subGoals) targetGoal.subGoals = [];

          if (isEditing) {
            const sg = targetGoal.subGoals.find(s => s.id === subGoalToEdit.id);
            if (sg) {
              sg.title = document.getElementById('subgoal-title').value;
              sg.dueDate = document.getElementById('subgoal-date').value;
            }
          } else {
            const subGoal = {
              id: 'sg-' + Date.now(),
              title: document.getElementById('subgoal-title').value,
              dueDate: document.getElementById('subgoal-date').value,
              completed: false
            };
            targetGoal.subGoals.push(subGoal);
          }

          Storage.saveGoals(goals);
          closeModal();
          onSave();
        });
      },

      openHabitModal(habitToEdit = null) {
        const goals = Storage.getGoals();
        const isEditing = !!habitToEdit;
        const defaultDur = isEditing ? (habitToEdit.durationMinutes || 15) : 15;
        const defaultImpl = isEditing ? (habitToEdit.implementationPlan || '') : '';

        const html = `
          <div class="modal-header">
            <h3>${isEditing ? 'Edit Habit ✏️' : 'Tambah Habit Harian Baru 🌱'}</h3>
            <button class="close-btn">&times;</button>
          </div>
          <form id="form-habit">
            <div class="form-group">
              <label>Nama Kebiasaan / Habit</label>
              <input type="text" id="habit-title" class="form-control" placeholder="Contoh: Shalat Subuh Berjamaah di Mesjid" value="${isEditing ? habitToEdit.title : ''}" required />
            </div>

            <div class="form-group">
              <label>💡 Habit Implementation Plan (Rencana Pelaksanaan)</label>
              <textarea id="habit-impl-plan" class="form-control" placeholder="Contoh: Setiap kali azan Subuh berkumandang, saya langsung wudhu dan berjalan ke Mesjid terdekat. (Saya akan [AKSI] pada [WAKTU] di [LOKASI])">${defaultImpl}</textarea>
            </div>

            <div class="form-group">
              <label>Target Durasi (Menit)</label>
              <select id="habit-duration" class="form-control" required>
                <option value="2" ${defaultDur === 2 ? 'selected' : ''}>2 Menit</option>
                <option value="5" ${defaultDur === 5 ? 'selected' : ''}>5 Menit</option>
                <option value="10" ${defaultDur === 10 ? 'selected' : ''}>10 Menit</option>
                <option value="15" ${defaultDur === 15 ? 'selected' : ''}>15 Menit</option>
                <option value="20" ${defaultDur === 20 ? 'selected' : ''}>20 Menit</option>
                <option value="30" ${defaultDur === 30 ? 'selected' : ''}>30 Menit</option>
                <option value="45" ${defaultDur === 45 ? 'selected' : ''}>45 Menit</option>
                <option value="60" ${defaultDur === 60 ? 'selected' : ''}>60 Menit</option>
              </select>
            </div>

            <div class="form-group">
              <label>Kategori Habit</label>
              <select id="habit-category" class="form-control" required>
                <option value="spiritual" ${isEditing && habitToEdit.category === 'spiritual' ? 'selected' : ''}>Spiritual Habit</option>
                <option value="health" ${isEditing && habitToEdit.category === 'health' ? 'selected' : ''}>Physical / Health Habit</option>
                <option value="career" ${isEditing && habitToEdit.category === 'career' ? 'selected' : ''}>Intellectual / Career</option>
                <option value="personal" ${isEditing && habitToEdit.category === 'personal' ? 'selected' : ''}>Emotional / Personal</option>
                <option value="finance" ${isEditing && habitToEdit.category === 'finance' ? 'selected' : ''}>Keuangan</option>
                <option value="creativity" ${isEditing && habitToEdit.category === 'creativity' ? 'selected' : ''}>Creativity / Custom</option>
              </select>
            </div>

            <div class="form-group">
              <label>Tautkan ke Goal Utama (Opsional)</label>
              <select id="habit-goal-id" class="form-control">
                <option value="">-- Mandiri / Standalone --</option>
                ${goals.map(g => `
                  <option value="${g.id}" ${isEditing && habitToEdit.goalId === g.id ? 'selected' : ''}>
                    ${g.title} (${g.category})
                  </option>
                `).join('')}
              </select>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
              <button type="button" class="btn btn-secondary close-btn">Batal</button>
              <button type="submit" class="btn btn-primary">${isEditing ? 'Simpan Perubahan' : 'Simpan Habit'}</button>
            </div>
          </form>
        `;
        openModal(html);

        const selectGoal = document.getElementById('habit-goal-id');
        const selectCat = document.getElementById('habit-category');
        selectGoal.addEventListener('change', () => {
          const selectedG = goals.find(g => g.id === selectGoal.value);
          if (selectedG) selectCat.value = selectedG.category;
        });

        document.getElementById('form-habit')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const currentHabits = Storage.getHabits();
          const durVal = parseInt(document.getElementById('habit-duration').value, 10) || 15;
          const implVal = document.getElementById('habit-impl-plan').value.trim();

          if (isEditing) {
            const h = currentHabits.find(item => item.id === habitToEdit.id);
            if (h) {
              h.title = document.getElementById('habit-title').value;
              h.implementationPlan = implVal;
              h.durationMinutes = durVal;
              h.goalId = document.getElementById('habit-goal-id').value;
              h.category = document.getElementById('habit-category').value;
            }
          } else {
            const newHabit = {
              id: 'h-' + Date.now(),
              goalId: document.getElementById('habit-goal-id').value,
              title: document.getElementById('habit-title').value,
              implementationPlan: implVal,
              category: document.getElementById('habit-category').value,
              durationMinutes: durVal,
              frequency: 'daily',
              completedDates: []
            };
            currentHabits.push(newHabit);
          }

          Storage.saveHabits(currentHabits);
          closeModal();
          onSave();
        });
      }
    };
  }

  // =========================================================================
  // 9. APP CONTROLLER
  // =========================================================================
  class App {
    constructor() {
      this.currentTab = 'today';
      this.mainContent = document.getElementById('view-content');
      this.sidebarNav = document.getElementById('sidebar-nav');
      this.modals = setupModals(() => this.renderCurrentTab());

      this.initSidebar();
      this.initSidebarToggle();
      this.initDailyAutoRefresh();
      this.renderCurrentTab();
    }

    initSidebar() {
      const navItems = [
        { id: 'today', label: 'Fokus Hari Ini', icon: 'compass' },
        { id: 'goals', label: 'Daftar Goal Utama', icon: 'target' },
        { id: 'habits', label: 'Matriks Kelompok Habit', icon: 'zap' },
        { id: 'compact-progress', label: 'Progres Ringkas Habit', icon: 'trending-up' },
        { id: 'calendar', label: 'Kalender Rutinitas', icon: 'calendar-days' },
        { id: 'analytics', label: 'Analisis & Google Cal', icon: 'bar-chart-3' }
      ];

      this.sidebarNav.innerHTML = navItems.map(item => `
        <button class="nav-item ${item.id === this.currentTab ? 'active' : ''}" data-tab="${item.id}" data-tooltip="${item.label}">
          <i data-lucide="${item.icon}"></i>
          <span>${item.label}</span>
        </button>
      `).join('');

      this.sidebarNav.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
          this.switchTab(btn.dataset.tab);
        });
      });

      if (window.lucide) window.lucide.createIcons();
    }

    initSidebarToggle() {
      const toggleBtn = document.getElementById('btn-toggle-sidebar');
      const isCollapsed = Storage.isSidebarCollapsed();

      if (isCollapsed) {
        document.body.classList.add('sidebar-collapsed');
        this.updateToggleIcon(true);
      } else {
        document.body.classList.remove('sidebar-collapsed');
        this.updateToggleIcon(false);
      }

      toggleBtn?.addEventListener('click', () => {
        const currentlyCollapsed = document.body.classList.toggle('sidebar-collapsed');
        Storage.setSidebarCollapsed(currentlyCollapsed);
        this.updateToggleIcon(currentlyCollapsed);
      });
    }

    initDailyAutoRefresh() {
      window.addEventListener('focus', () => {
        const todayStr = getTodayStr(0);
        if (todayStr !== lastRenderedDateStr) {
          lastRenderedDateStr = todayStr;
          this.renderCurrentTab();
        }
      });

      setInterval(() => {
        const todayStr = getTodayStr(0);
        if (todayStr !== lastRenderedDateStr) {
          lastRenderedDateStr = todayStr;
          this.renderCurrentTab();
        }
      }, 30000);
    }

    updateToggleIcon(collapsed) {
      const iconEl = document.getElementById('sidebar-toggle-icon');
      if (iconEl) {
        iconEl.setAttribute('data-lucide', collapsed ? 'chevron-right' : 'chevron-left');
        if (window.lucide) window.lucide.createIcons();
      }
    }

    switchTab(tabId) {
      this.currentTab = tabId;
      this.sidebarNav.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.dataset.tab === tabId) btn.classList.add('active');
        else btn.classList.remove('active');
      });
      this.renderCurrentTab();
    }

    updateQuickStats() {
      const habits = Storage.getHabits();
      const todayStr = getTodayStr(0);
      const completedToday = habits.filter(h => h.completedDates && h.completedDates.includes(todayStr)).length;
      const valEl = document.getElementById('quick-stats-val');
      if (valEl) {
        valEl.textContent = `${completedToday}/${habits.length}`;
      }
    }

    renderCurrentTab() {
      lastRenderedDateStr = getTodayStr(0);

      const handleAction = (action, payload) => {
        if (action === 'open-goal-modal') this.modals.openGoalModal(payload);
        else if (action === 'open-subgoal-modal') this.modals.openSubGoalModal(payload);
        else if (action === 'open-habit-modal') this.modals.openHabitModal(payload);
        else if (action === 'switch-tab') this.switchTab(payload);
        else if (action === 'render-current-tab') this.renderCurrentTab();
      };

      switch (this.currentTab) {
        case 'today':
          renderTodayView(this.mainContent, handleAction);
          break;
        case 'goals':
          renderGoalsView(this.mainContent, handleAction);
          break;
        case 'habits':
          renderHabitsView(this.mainContent, handleAction);
          break;
        case 'compact-progress':
          renderCompactProgressView(this.mainContent, handleAction);
          break;
        case 'calendar':
          renderFullCalendarView(this.mainContent, handleAction);
          break;
        case 'analytics':
          renderAnalyticsView(this.mainContent, handleAction);
          break;
        default:
          renderTodayView(this.mainContent, handleAction);
      }

      this.updateQuickStats();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
  });
})();
