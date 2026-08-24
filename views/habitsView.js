/* ==========================================================================
   GoalForge - Daily Habit Tracker View
   ========================================================================== */

import { Storage } from '../storage.js';

export function renderHabitsView(container, onAction, activeCategoryFilter = 'all') {
  let habits = Storage.getHabits();
  const goals = Storage.getGoals();

  if (activeCategoryFilter !== 'all') {
    habits = habits.filter(h => h.category === activeCategoryFilter);
  }

  // Generate last 7 days array
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('id-ID', { weekday: 'narrow' }),
      dayNum: d.getDate(),
      isToday: i === 0
    });
  }

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'spiritual', label: 'Spiritual' },
    { id: 'health', label: 'Kesehatan' },
    { id: 'career', label: 'Karir' },
    { id: 'finance', label: 'Keuangan' },
    { id: 'personal', label: 'Pengembangan Diri' },
    { id: 'creativity', label: 'Kreativitas' }
  ];

  container.innerHTML = `
    <div class="header-bar">
      <div class="page-title">
        <h1>Pelacak Habit Harian ⚡</h1>
        <p>Konsistensi adalah kunci. Bangun kebiasaan kecil harian yang mengantarkan Anda ke Goal.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" id="btn-add-habit">
          <i data-lucide="plus"></i> Tambah Habit Baru
        </button>
      </div>
    </div>

    <!-- Category Filter Bar -->
    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
      ${categories.map(cat => `
        <button class="btn ${cat.id === activeCategoryFilter ? 'btn-primary' : 'btn-secondary'} btn-filter-cat" data-cat="${cat.id}" style="padding: 6px 14px; font-size: 0.85rem;">
          ${cat.label}
        </button>
      `).join('')}
    </div>

    ${habits.length === 0 ? `
      <div class="glass-card empty-state">
        <div class="empty-icon">🌱</div>
        <h3>Belum Ada Habit Dalam Kategori Ini</h3>
        <p>Tambahkan kebiasaan harian baru untuk mulai melatih konsistensi.</p>
        <button class="btn btn-primary" id="btn-empty-add-habit" style="margin-top: 16px;">
          <i data-lucide="plus"></i> Tambah Habit Sekarang
        </button>
      </div>
    ` : `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${habits.map(h => {
          const streak = Storage.calculateHabitStreak(h);
          const linkedGoal = goals.find(g => g.id === h.goalId);

          return `
            <div class="glass-card" style="padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
              <!-- Left Info -->
              <div style="flex: 1; min-width: 240px;">
                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
                  <span class="badge badge-${h.category}">${h.category}</span>
                  ${linkedGoal ? `<span style="font-size: 0.75rem; color: var(--text-dim);">🎯 ${linkedGoal.title}</span>` : ''}
                </div>
                <h3 style="font-size: 1.15rem;">${h.title}</h3>
                <div style="display: flex; gap: 16px; margin-top: 6px; font-size: 0.8rem; color: var(--text-muted);">
                  <div class="streak-badge"><i data-lucide="flame" style="width: 14px;"></i> Streak: ${streak.current} Hari</div>
                  <div>Rekor Terbaik: ${streak.best} Hari</div>
                </div>
              </div>

              <!-- Right Matrix 7 Days Check-in -->
              <div style="display: flex; align-items: center; gap: 12px;">
                <div class="habit-days">
                  ${last7Days.map(day => {
                    const isCompleted = h.completedDates && h.completedDates.includes(day.dateStr);
                    return `
                      <button class="day-pill ${isCompleted ? 'done' : ''} btn-toggle-date" data-habit-id="${h.id}" data-date="${day.dateStr}" title="${day.dateStr}">
                        <span>${day.dayName}</span>
                        <strong style="font-size: 0.85rem;">${day.dayNum}</strong>
                      </button>
                    `;
                  }).join('')}
                </div>

                <button class="btn-delete-habit" data-id="${h.id}" title="Hapus Habit" style="color: var(--text-dim); padding: 8px; margin-left: 8px;">
                  <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `}
  `;

  // Event Listeners
  container.querySelector('#btn-add-habit')?.addEventListener('click', () => onAction('open-habit-modal'));
  container.querySelector('#btn-empty-add-habit')?.addEventListener('click', () => onAction('open-habit-modal'));

  container.querySelectorAll('.btn-filter-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      renderHabitsView(container, onAction, cat);
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
          if (window.confetti) window.confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
        }
        Storage.saveHabits(currentHabits);
        renderHabitsView(container, onAction, activeCategoryFilter);
      }
    });
  });

  container.querySelectorAll('.btn-delete-habit').forEach(btn => {
    btn.addEventListener('click', () => {
      const habitId = btn.dataset.id;
      if (confirm('Apakah Anda yakin ingin menghapus habit ini?')) {
        const currentHabits = Storage.getHabits().filter(h => h.id !== habitId);
        Storage.saveHabits(currentHabits);
        renderHabitsView(container, onAction, activeCategoryFilter);
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}
