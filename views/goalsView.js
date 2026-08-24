/* ==========================================================================
   GoalForge - Goals & Sub-Goals Manager View
   ========================================================================== */

import { Storage } from '../storage.js';

export function renderGoalsView(container, onAction) {
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
              <!-- Goal Card Header -->
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div>
                  <span class="badge badge-${g.category}">${g.category}</span>
                  <h3 style="font-size: 1.3rem; margin-top: 8px;">${g.title}</h3>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 1.5rem; font-weight: 800; color: ${g.color || '#6366f1'};">${progressPct}%</span>
                  <button class="btn-delete-goal" data-id="${g.id}" title="Hapus Goal" style="color: var(--text-dim); padding: 4px;">
                    <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
                  </button>
                </div>
              </div>

              <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">
                ${g.description || 'Tidak ada deskripsi.'}
              </p>

              <!-- Progress Bar -->
              <div class="progress-bar-bg" style="margin-bottom: 20px;">
                <div class="progress-bar-fill" style="width: ${progressPct}%; background: ${g.color || 'var(--grad-primary)'};"></div>
              </div>

              <!-- Meta Footer -->
              <div style="display: flex; gap: 16px; font-size: 0.8rem; color: var(--text-dim); margin-bottom: 20px; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">
                <div><i data-lucide="calendar" style="width: 14px; height: 14px; display: inline;"></i> Target: ${g.targetDate || 'TBA'}</div>
                <div><i data-lucide="check-square" style="width: 14px; height: 14px; display: inline;"></i> Sub-Goal: ${completedSubCount}/${subGoals.length}</div>
                <div><i data-lucide="repeat" style="width: 14px; height: 14px; display: inline;"></i> Habit: ${linkedHabitsCount}</div>
              </div>

              <!-- Sub-Goals Section -->
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
                    <button class="btn-delete-subgoal" data-goal-id="${g.id}" data-subgoal-id="${sg.id}" style="color: var(--text-dim); margin-left: 8px;">
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

  // Listeners
  container.querySelector('#btn-add-goal')?.addEventListener('click', () => onAction('open-goal-modal'));
  container.querySelector('#btn-empty-add-goal')?.addEventListener('click', () => onAction('open-goal-modal'));

  container.querySelectorAll('.btn-add-subgoal').forEach(btn => {
    btn.addEventListener('click', () => {
      const goalId = btn.dataset.goalId;
      onAction('open-subgoal-modal', goalId);
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
          if (sg.completed && window.confetti) {
            window.confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          }
          Storage.saveGoals(currentGoals);
          renderGoalsView(container, onAction);
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
        renderGoalsView(container, onAction);
      }
    });
  });

  container.querySelectorAll('.btn-delete-goal').forEach(btn => {
    btn.addEventListener('click', () => {
      const goalId = btn.dataset.id;
      if (confirm('Apakah Anda yakin ingin menghapus Goal ini?')) {
        const currentGoals = Storage.getGoals().filter(g => g.id !== goalId);
        Storage.saveGoals(currentGoals);
        renderGoalsView(container, onAction);
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}
