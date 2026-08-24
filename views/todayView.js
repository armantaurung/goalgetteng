/* ==========================================================================
   GoalForge - Today Focus View Module
   ========================================================================== */

import { Storage } from '../storage.js';

export function renderTodayView(container, onAction) {
  const habits = Storage.getHabits();
  const goals = Storage.getGoals();
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate today's stats
  const totalHabitsToday = habits.length;
  const completedHabitsToday = habits.filter(h => h.completedDates && h.completedDates.includes(todayStr)).length;
  const percentToday = totalHabitsToday > 0 ? Math.round((completedHabitsToday / totalHabitsToday) * 100) : 0;

  // Active Streaks sum
  let activeStreaks = 0;
  habits.forEach(h => {
    const s = Storage.calculateHabitStreak(h);
    if (s.current > 0) activeStreaks++;
  });

  // Get active subgoals due soon or uncompleted
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

  container.innerHTML = `
    <div class="header-bar">
      <div class="page-title">
        <h1>Fokus Hari Ini 🎯</h1>
        <p>Tetapkan niat, selesaikan kebiasaan harian, dan dekatkan diri pada Goal Anda.</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" id="btn-add-habit-today">
          <i data-lucide="plus-circle"></i> Tambah Habit
        </button>
      </div>
    </div>

    <!-- Quick Stats Bar -->
    <div class="grid-3" style="margin-bottom: 32px;">
      <div class="glass-card stat-card">
        <div class="stat-icon" style="background: rgba(99, 102, 241, 0.2); color: #818cf8;">
          <i data-lucide="check-circle-2"></i>
        </div>
        <div class="stat-info">
          <div class="value">${completedHabitsToday} / ${totalHabitsToday}</div>
          <div class="label">Habit Selesai Hari Ini (${percentToday}%)</div>
          <div class="progress-bar-bg" style="width: 140px;">
            <div class="progress-bar-fill" style="width: ${percentToday}%; background: var(--grad-primary);"></div>
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

    <!-- Main Content Split -->
    <div class="grid-2">
      <!-- Left Column: Daily Habits Checklist -->
      <div class="glass-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3>Kebiasaan Harian (${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })})</h3>
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

          return `
            <div class="check-item ${isDone ? 'completed' : ''}" data-habit-id="${h.id}">
              <div class="custom-checkbox btn-toggle-habit" data-id="${h.id}">
                ${isDone ? '<i data-lucide="check" style="width: 14px; height: 14px;"></i>' : ''}
              </div>
              <div style="flex: 1;">
                <div class="check-text" style="font-weight: 600;">${h.title}</div>
                <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
                  <span class="badge badge-${h.category}">${h.category}</span>
                  ${linkedGoal ? `<span style="font-size: 0.75rem; color: var(--text-dim);">🎯 ${linkedGoal.title}</span>` : ''}
                </div>
              </div>
              <div class="streak-badge">
                <i data-lucide="flame" style="width: 16px; height: 16px;"></i> ${streak.current} d
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Right Column: Sub-Goals & Milestones Focus -->
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
          <div class="check-item" data-goal-id="${sg.goalId}" data-subgoal-id="${sg.id}">
            <div class="custom-checkbox btn-toggle-subgoal" data-goal-id="${sg.goalId}" data-subgoal-id="${sg.id}"></div>
            <div style="flex: 1;">
              <div class="check-text" style="font-weight: 600;">${sg.title}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                Tujuan: <strong style="color: ${sg.goalColor};">${sg.goalTitle}</strong> • Target: ${sg.dueDate || 'Tanpa Tanggal'}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Attach Event Listeners
  container.querySelector('#btn-add-habit-today')?.addEventListener('click', () => onAction('open-habit-modal'));
  container.querySelector('#btn-goto-goals')?.addEventListener('click', () => onAction('switch-tab', 'goals'));

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
          if (window.confetti) window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
        }
        Storage.saveHabits(currentHabits);
        renderTodayView(container, onAction);
        if (window.lucide) window.lucide.createIcons();
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
          if (sg.completed && window.confetti) {
            window.confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          }
          Storage.saveGoals(currentGoals);
          renderTodayView(container, onAction);
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}
