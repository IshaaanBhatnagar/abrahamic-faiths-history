/* ============================================
   Abrahamic Faiths History — Shared JavaScript
   ============================================ */

// ---------- Chapter Data ----------
const chapters = [
  { id: 1, slug: '01-ancient-origins', title: 'Ancient Origins', date: '2000-600 BCE', file: 'chapters/01-ancient-origins.html' },
  { id: 2, slug: '02-classical-antiquity', title: 'Classical Antiquity', date: '600 BCE-100 CE', file: 'chapters/02-classical-antiquity.html' },
  { id: 3, slug: '03-early-church-rabbis', title: 'Early Church & Rabbis', date: '100-600 CE', file: 'chapters/03-early-church-rabbis.html' },
  { id: 4, slug: '04-rise-of-islam', title: 'Rise of Islam', date: '600-750 CE', file: 'chapters/04-rise-of-islam.html' },
  { id: 5, slug: '05-medieval-world', title: 'Medieval World', date: '750-1300 CE', file: 'chapters/05-medieval-world.html' },
  { id: 6, slug: '06-ottoman-reformation', title: 'Ottoman & Reformation', date: '1300-1700', file: 'chapters/06-ottoman-reformation.html' },
  { id: 7, slug: '07-enlightenment-nationalism', title: 'Enlightenment & Nationalism', date: '1700-1900', file: 'chapters/07-enlightenment-nationalism.html' },
  { id: 8, slug: '08-world-wars-israel', title: 'World Wars & Israel', date: '1900-1950', file: 'chapters/08-world-wars-israel.html' },
  { id: 9, slug: '09-modern-conflicts', title: 'Modern Conflicts', date: '1950-2000', file: 'chapters/09-modern-conflicts.html' },
  { id: 10, slug: '10-twenty-first-century', title: '21st Century', date: '2000-Present', file: 'chapters/10-twenty-first-century.html' }
];

// ---------- Progress Tracking ----------
function getProgress() {
  try {
    return JSON.parse(localStorage.getItem('abrahamicProgress') || '{}');
  } catch { return {}; }
}

function markChapterRead(chapterId) {
  const progress = getProgress();
  progress[chapterId] = { read: true, timestamp: Date.now() };
  localStorage.setItem('abrahamicProgress', JSON.stringify(progress));
  updateProgressUI();
}

function isChapterRead(chapterId) {
  return getProgress()[chapterId]?.read || false;
}

function getReadCount() {
  const p = getProgress();
  return Object.values(p).filter(v => v.read).length;
}

function updateProgressUI() {
  const count = getReadCount();
  const pct = Math.round((count / chapters.length) * 100);

  // Update progress bar in nav
  const fill = document.querySelector('.progress-fill');
  if (fill) fill.style.width = pct + '%';

  const label = document.querySelector('.progress-label');
  if (label) label.textContent = count + '/' + chapters.length;

  // Update chapter card statuses on index page
  document.querySelectorAll('.chapter-card').forEach(card => {
    const id = parseInt(card.dataset.chapter);
    const status = card.querySelector('.chapter-card-status');
    if (status && isChapterRead(id)) {
      status.textContent = 'Completed';
      status.className = 'chapter-card-status completed';
    }
  });

  // Update master timeline dots
  document.querySelectorAll('.mt-era').forEach(era => {
    const id = parseInt(era.dataset.chapter);
    const dot = era.querySelector('.mt-dot');
    if (dot && isChapterRead(id)) {
      dot.classList.add('completed');
    }
  });
}

// ---------- Navigation Builder ----------
function buildNav(currentChapterId) {
  const isIndex = currentChapterId === 0;
  const pathPrefix = isIndex ? '' : '../';

  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.innerHTML = `
    <div class="nav-inner">
      <div class="nav-logo"><a href="${pathPrefix}index.html">Abrahamic Faiths</a></div>
      <div class="nav-chapters">
        ${chapters.map(ch => `
          <a class="nav-tab ${ch.id === currentChapterId ? 'active' : ''}"
             href="${pathPrefix}${ch.file}"
             title="${ch.title} (${ch.date})">
            ${ch.id}. ${ch.title}
          </a>
        `).join('')}
      </div>
      <div class="nav-progress">
        <span class="progress-label">${getReadCount()}/${chapters.length}</span>
        <div class="progress-bar"><div class="progress-fill" style="width: ${Math.round((getReadCount() / chapters.length) * 100)}%"></div></div>
      </div>
    </div>
  `;

  document.body.prepend(nav);
}

// ---------- Chapter Prev/Next Navigation ----------
function buildChapterNav(currentChapterId) {
  const idx = chapters.findIndex(c => c.id === currentChapterId);
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  const wrapper = document.createElement('div');
  wrapper.className = 'chapter-nav';

  if (prev) {
    wrapper.innerHTML += `
      <a class="chapter-nav-btn prev" href="../${prev.file}">
        <span>
          <span class="nav-direction">Previous</span><br>
          <span class="nav-title">${prev.id}. ${prev.title}</span>
        </span>
      </a>`;
  } else {
    wrapper.innerHTML += '<div></div>';
  }

  if (next) {
    wrapper.innerHTML += `
      <a class="chapter-nav-btn next" href="../${next.file}">
        <span>
          <span class="nav-direction">Next</span><br>
          <span class="nav-title">${next.id}. ${next.title}</span>
        </span>
      </a>`;
  }

  const content = document.querySelector('.content-wrapper');
  if (content) content.appendChild(wrapper);
}

// ---------- Section Tabs ----------
function initSectionTabs() {
  const tabs = document.querySelectorAll('.section-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.section;

      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update content
      document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
      const section = document.getElementById(target);
      if (section) section.classList.add('active');

      // Update hash
      history.replaceState(null, '', '#' + target);
    });
  });

  // Activate from hash
  const hash = window.location.hash.slice(1);
  if (hash) {
    const tab = document.querySelector(`.section-tab[data-section="${hash}"]`);
    if (tab) { tab.click(); return; }
  }

  // Default to first tab
  if (tabs[0]) tabs[0].click();
}

// ---------- Accordions ----------
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = header.classList.contains('open');

      // Close all others in same group
      const group = header.closest('.accordion-group');
      if (group) {
        group.querySelectorAll('.accordion-header.open').forEach(h => {
          h.classList.remove('open');
          h.nextElementSibling.classList.remove('open');
        });
      }

      if (!isOpen) {
        header.classList.add('open');
        body.classList.add('open');
      }
    });
  });
}

// ---------- Quiz System ----------
function initQuiz() {
  const quizSection = document.querySelector('.quiz-section');
  if (!quizSection) return;

  const questions = quizSection.querySelectorAll('.quiz-question');
  const submitBtn = quizSection.querySelector('.quiz-submit-btn');
  const scoreDisplay = quizSection.querySelector('.quiz-score');

  // Handle option clicks
  questions.forEach(q => {
    const options = q.querySelectorAll('.quiz-option');
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        // Deselect others in this question
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        opt.querySelector('input[type="radio"]').checked = true;
      });
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      let correct = 0;
      let total = questions.length;

      questions.forEach(q => {
        const selected = q.querySelector('.quiz-option.selected');
        const correctAnswer = q.dataset.answer;
        const feedback = q.querySelector('.quiz-feedback');

        // Reset all options
        q.querySelectorAll('.quiz-option').forEach(o => {
          o.classList.remove('correct', 'incorrect');
        });

        if (selected) {
          const value = selected.querySelector('input').value;
          if (value === correctAnswer) {
            selected.classList.add('correct');
            correct++;
            if (feedback) {
              feedback.className = 'quiz-feedback show correct';
              feedback.textContent = 'Correct!';
            }
          } else {
            selected.classList.add('incorrect');
            // Highlight correct answer
            q.querySelectorAll('.quiz-option').forEach(o => {
              if (o.querySelector('input').value === correctAnswer) {
                o.classList.add('correct');
              }
            });
            if (feedback) {
              feedback.className = 'quiz-feedback show incorrect';
              feedback.textContent = feedback.dataset.explanation || 'Not quite. See the correct answer highlighted above.';
            }
          }
        } else {
          if (feedback) {
            feedback.className = 'quiz-feedback show incorrect';
            feedback.textContent = 'No answer selected.';
          }
        }
      });

      if (scoreDisplay) {
        scoreDisplay.classList.add('show');
        const pct = Math.round((correct / total) * 100);
        scoreDisplay.textContent = `You scored ${correct}/${total} (${pct}%)`;
        if (pct >= 75) {
          scoreDisplay.style.color = 'var(--green)';
        } else if (pct >= 50) {
          scoreDisplay.style.color = 'var(--amber)';
        } else {
          scoreDisplay.style.color = 'var(--red)';
        }
      }

      submitBtn.textContent = 'Retake Quiz';
      submitBtn.addEventListener('click', () => location.reload(), { once: true });
    });
  }
}

// ---------- Scroll Reveal ----------
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ---------- Lazy Image Loading ----------
function initLazyImages() {
  const imgs = document.querySelectorAll('img[data-src]');
  if (!imgs.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => observer.observe(img));
}

// ---------- Image Error Fallback ----------
function initImageFallbacks() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      if (!this.dataset.fallbackApplied) {
        this.dataset.fallbackApplied = 'true';
        this.style.background = 'var(--secular-light)';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.style.minHeight = '120px';
        this.alt = this.alt || 'Image unavailable';
        this.style.fontSize = '0.8rem';
        this.style.color = 'var(--text-muted)';
      }
    });
  });
}

// ---------- Chapter Page Init ----------
function initChapterPage(chapterId) {
  buildNav(chapterId);
  initSectionTabs();
  initAccordions();
  initQuiz();
  initLazyImages();
  initImageFallbacks();
  initScrollReveal();
  buildChapterNav(chapterId);

  // Mark as read only when user reaches the quiz section
  const quizSection = document.querySelector('#quiz');
  if (quizSection) {
    const quizObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        markChapterRead(chapterId);
        quizObserver.disconnect();
      }
    }, { threshold: 0.3 });
    quizObserver.observe(quizSection);
  }
}

// ---------- Index Page Init ----------
function initIndexPage() {
  buildNav(0);
  updateProgressUI();
  initLazyImages();
  initImageFallbacks();
}

// ---------- Chevron SVG (for accordions) ----------
function chevronSVG() {
  return '<svg class="accordion-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>';
}
