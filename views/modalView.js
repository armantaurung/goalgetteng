/* ==========================================================================
   GoalForge - Modal Forms Manager Module
   ========================================================================== */

import { Storage } from '../storage.js';

export function setupModals(onSave) {
  const backdrop = document.getElementById('modal-backdrop');
  const modalContainer = document.getElementById('modal-card-content');

  function openModal(htmlContent) {
    modalContainer.innerHTML = htmlContent;
    backdrop.classList.add('open');
    if (window.lucide) window.lucide.createIcons();

    // Attach close listener
    const closeBtn = modalContainer.querySelector('.close-btn');
    closeBtn?.addEventListener('click', closeModal);
  }

  function closeModal() {
    backdrop.classList.remove('open');
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  return {
    openGoalModal() {
      const html = `
        <div class="modal-header">
          <h3>Buat Goal Utama Baru 🎯</h3>
          <button class="close-btn">&times;</button>
        </div>
        <form id="form-goal">
          <div class="form-group">
            <label>Judul Goal Utama</label>
            <input type="text" id="goal-title" class="form-control" placeholder="Contoh: Menjadi Ahli Fullstack & Bugar 2026" required />
          </div>

          <div class="form-group">
            <label>Kategori</label>
            <select id="goal-category" class="form-control" required>
              <option value="spiritual">Spiritual & Ibadah</option>
              <option value="health">Kesehatan & Kebugaran</option>
              <option value="career">Karir & Bisnis</option>
              <option value="finance">Keuangan</option>
              <option value="personal">Pengembangan Diri</option>
              <option value="creativity">Kreativitas</option>
            </select>
          </div>

          <div class="form-group">
            <label>Target Tanggal Selesai</label>
            <input type="date" id="goal-date" class="form-control" required />
          </div>

          <div class="form-group">
            <label>Warna Penanda</label>
            <input type="color" id="goal-color" class="form-control" value="#6366f1" style="height: 42px; padding: 4px;" />
          </div>

          <div class="form-group">
            <label>Deskripsi / Niat Utama</label>
            <textarea id="goal-desc" class="form-control" placeholder="Tuliskan motivasi utama atau alasan di balik goal ini..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <button type="button" class="btn btn-secondary close-btn">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Goal</button>
          </div>
        </form>
      `;
      openModal(html);

      document.getElementById('form-goal')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newGoal = {
          id: 'g-' + Date.now(),
          title: document.getElementById('goal-title').value,
          category: document.getElementById('goal-category').value,
          targetDate: document.getElementById('goal-date').value,
          color: document.getElementById('goal-color').value,
          description: document.getElementById('goal-desc').value,
          subGoals: []
        };
        const currentGoals = Storage.getGoals();
        currentGoals.push(newGoal);
        Storage.saveGoals(currentGoals);
        closeModal();
        onSave();
      });
    },

    openSubGoalModal(goalId) {
      const goals = Storage.getGoals();
      const targetGoal = goals.find(g => g.id === goalId);
      if (!targetGoal) return;

      const html = `
        <div class="modal-header">
          <h3>Tambah Sub-Goal / Milestone 📌</h3>
          <button class="close-btn">&times;</button>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
          Untuk Goal: <strong style="color: ${targetGoal.color};">${targetGoal.title}</strong>
        </p>
        <form id="form-subgoal">
          <div class="form-group">
            <label>Judul Sub-Goal / Milestone</label>
            <input type="text" id="subgoal-title" class="form-control" placeholder="Contoh: Menyelesaikan Bab 1 / Latihan 5km" required />
          </div>

          <div class="form-group">
            <label>Target Tanggal Milestone</label>
            <input type="date" id="subgoal-date" class="form-control" />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <button type="button" class="btn btn-secondary close-btn">Batal</button>
            <button type="submit" class="btn btn-primary">Tambah Sub-Goal</button>
          </div>
        </form>
      `;
      openModal(html);

      document.getElementById('form-subgoal')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const subGoal = {
          id: 'sg-' + Date.now(),
          title: document.getElementById('subgoal-title').value,
          dueDate: document.getElementById('subgoal-date').value,
          completed: false
        };
        if (!targetGoal.subGoals) targetGoal.subGoals = [];
        targetGoal.subGoals.push(subGoal);
        Storage.saveGoals(goals);
        closeModal();
        onSave();
      });
    },

    openHabitModal() {
      const goals = Storage.getGoals();

      const html = `
        <div class="modal-header">
          <h3>Tambah Habit Harian Baru 🌱</h3>
          <button class="close-btn">&times;</button>
        </div>
        <form id="form-habit">
          <div class="form-group">
            <label>Nama Kebiasaan / Habit</label>
            <input type="text" id="habit-title" class="form-control" placeholder="Contoh: Solat Tepat Waktu / Membaca 15 Menit" required />
          </div>

          <div class="form-group">
            <label>Tautkan ke Goal Utama (Opsional)</label>
            <select id="habit-goal-id" class="form-control">
              <option value="">-- Mandiri / Standalone --</option>
              ${goals.map(g => `<option value="${g.id}">${g.title} (${g.category})</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label>Kategori Habit</label>
            <select id="habit-category" class="form-control" required>
              <option value="spiritual">Spiritual & Ibadah</option>
              <option value="health">Kesehatan & Kebugaran</option>
              <option value="career">Karir & Bisnis</option>
              <option value="finance">Keuangan</option>
              <option value="personal">Pengembangan Diri</option>
              <option value="creativity">Kreativitas</option>
            </select>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <button type="button" class="btn btn-secondary close-btn">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Habit</button>
          </div>
        </form>
      `;
      openModal(html);

      // Auto update category if goal selected
      const selectGoal = document.getElementById('habit-goal-id');
      const selectCat = document.getElementById('habit-category');
      selectGoal.addEventListener('change', () => {
        const selectedG = goals.find(g => g.id === selectGoal.value);
        if (selectedG) {
          selectCat.value = selectedG.category;
        }
      });

      document.getElementById('form-habit')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const newHabit = {
          id: 'h-' + Date.now(),
          goalId: document.getElementById('habit-goal-id').value,
          title: document.getElementById('habit-title').value,
          category: document.getElementById('habit-category').value,
          frequency: 'daily',
          completedDates: []
        };
        const currentHabits = Storage.getHabits();
        currentHabits.push(newHabit);
        Storage.saveHabits(currentHabits);
        closeModal();
        onSave();
      });
    }
  };
}
