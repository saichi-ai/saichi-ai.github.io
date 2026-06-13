/* =============================================
   あおば工務店 / main.js
   ============================================= */

'use strict';

/* ─────────────────────────────────────────────
   1. ヘッダー: スクロールで背景切替
────────────────────────────────────────────── */
(function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  // ヒーローがある場合のみ transparent 開始
  const hasHero = document.querySelector('.hero');

  function updateHeader() {
    if (hasHero) {
      if (window.scrollY > 40) {
        header.classList.remove('transparent');
        header.classList.add('scrolled');
      } else {
        header.classList.add('transparent');
        header.classList.remove('scrolled');
      }
    } else {
      header.classList.remove('transparent');
      header.classList.add('scrolled');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
})();


/* ─────────────────────────────────────────────
   2. モバイルメニュー開閉
────────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', function () {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // リンクをタップしたらメニューを閉じる
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();


/* ─────────────────────────────────────────────
   3. スクロール Reveal (IntersectionObserver)
────────────────────────────────────────────── */
(function initReveal() {
  // prefers-reduced-motion 対応
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(function (el) { observer.observe(el); });
})();


/* ─────────────────────────────────────────────
   4. works.html — カテゴリフィルタ
────────────────────────────────────────────── */
(function initWorkFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  const cards = document.querySelectorAll('.work-card[data-category]');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const cat = btn.dataset.filter;

      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      cards.forEach(function (card) {
        if (cat === 'all' || card.dataset.category === cat) {
          card.removeAttribute('data-hidden');
          card.style.display = '';
        } else {
          card.dataset.hidden = 'true';
          card.style.display = 'none';
        }
      });
    });
  });
})();


/* ─────────────────────────────────────────────
   5. services.html — FAQ アコーディオン
────────────────────────────────────────────── */
(function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(function (item) {
    const question = item.querySelector('.faq-q');
    if (!question) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.toggle('open');
      question.setAttribute('aria-expanded', String(isOpen));
    });
  });
})();


/* ─────────────────────────────────────────────
   6. contact.html — フォームバリデーション
────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  function showError(field, msg) {
    field.classList.add('error');
    const errEl = field.parentElement.querySelector('.form-error-msg');
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.add('show');
    }
  }

  function clearError(field) {
    field.classList.remove('error');
    const errEl = field.parentElement.querySelector('.form-error-msg');
    if (errEl) errEl.classList.remove('show');
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validatePhone(v) {
    return /^[\d\-\(\)\+\s]{10,}$/.test(v);
  }

  // リアルタイムクリア
  form.querySelectorAll('input, select, textarea').forEach(function (f) {
    f.addEventListener('input', function () { clearError(f); });
    f.addEventListener('change', function () { clearError(f); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const name    = form.querySelector('#name');
    const furigana= form.querySelector('#furigana');
    const phone   = form.querySelector('#phone');
    const email   = form.querySelector('#email');
    const type    = form.querySelector('#inquiry-type');
    const message = form.querySelector('#message');
    const privacy = form.querySelector('#privacy');

    if (!name.value.trim()) {
      showError(name, 'お名前をご入力ください。');
      valid = false;
    }

    if (!furigana.value.trim()) {
      showError(furigana, 'フリガナをご入力ください。');
      valid = false;
    } else if (!/^[ァ-ヶー\s　]+$/.test(furigana.value.trim())) {
      showError(furigana, '全角カタカナでご入力ください。');
      valid = false;
    }

    if (!phone.value.trim()) {
      showError(phone, '電話番号をご入力ください。');
      valid = false;
    } else if (!validatePhone(phone.value.trim())) {
      showError(phone, '正しい電話番号を入力してください。');
      valid = false;
    }

    if (!email.value.trim()) {
      showError(email, 'メールアドレスをご入力ください。');
      valid = false;
    } else if (!validateEmail(email.value.trim())) {
      showError(email, '正しいメールアドレスを入力してください。');
      valid = false;
    }

    if (!type.value) {
      showError(type, 'ご相談内容をお選びください。');
      valid = false;
    }

    if (!message.value.trim()) {
      showError(message, 'お問い合わせ内容をご入力ください。');
      valid = false;
    } else if (message.value.trim().length < 10) {
      showError(message, '10文字以上でご記入ください。');
      valid = false;
    }

    if (!privacy.checked) {
      const errEl = privacy.closest('.form-group').querySelector('.form-error-msg');
      if (errEl) {
        errEl.textContent = 'プライバシーポリシーへの同意が必要です。';
        errEl.classList.add('show');
      }
      valid = false;
    }

    if (valid) {
      alert('※ これはサンプルサイトのため、実際には送信されません。\n\nご入力内容を確認しました。\n実際のサイトではここでフォームが送信されます。');
      form.reset();
    }
  });
})();


/* ─────────────────────────────────────────────
   7. ページ内ナビ: 現在ページに aria-current を付与
────────────────────────────────────────────── */
(function setCurrentNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.global-nav a, .mobile-nav a').forEach(function (a) {
    const href = a.getAttribute('href') || '';
    if (href === current || (current === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();
