/* ==========================================================================
   GoalForge - Analytics & Backup/Restore View
   ========================================================================== */

import { Storage } from '../storage.js';

export function renderAnalyticsView(container, onAction) {
  const goals = Storage.getGoals();
  const habits = Storage.getHabits();

  // Category Distribution stats
  const catStats = {
    spiritual: { count: 0, label: 'Spiritual', color: '#a855f7' },
    health: { count: 0, label: 'Kesehatan', color: '#10b981' },
    career: { count: 0, label: 'Karir', color: '#f59e0b' },
    finance: { count: 0, label: 'Keuangan', color: '#06b6d4' },
    personal: { count: 0, label: 'Pengembangan Diri', color: '#f43f5e' },
    creativity: { count: 0, label: 'Kreativitas', color: '#e879f9' }
  };

  goals.forEach(g => {
    if (catStats[g.category]) {
      catStats[g.category].count++;
    }
  });

  // Calculate Habit completion consistency
  let totalCompletions7Days = 0;
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    habits.forEach(h => {
      if (h.completedDates && h.completedDates.includes(dateStr)) {
        totalCompletions7Days++;
      }
    });
  }

  const maxPossibleCompletions = habits.length * 7;
  const consistencyRate = maxPossibleCompletions > 0 ? Math.round((totalCompletions7Days / maxPossibleCompletions) * 100) : 0;

  container.innerHTML = `
    <div class="header-bar">
      <div class="page-title">
        <h1>Analisis & Cadangan Data 📊</h1>
        <p>Evaluasi konsistensi Anda dan amankan data Anda melalui fitur ekspor/impor JSON.</p>
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

    <div class="grid-2">
      <!-- Category Breakdown Card -->
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

      <!-- Backup & Restore Data Card -->
      <div class="glass-card">
        <h3 style="margin-bottom: 12px;">Penyimpanan & Cadangan (JSON) 💾</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">
          Seluruh data disimpan secara otomatis di browser Anda (`localStorage`). Anda dapat mengunduh berkas cadangan JSON atau memuat data cadangan kapan saja.
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

  // Attach Listeners
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
