/* Oufa cookie consent — minimal, dependency-free, DSGVO-konform.
   Persists choice in localStorage under "oufa-cookie-consent" with values
   "accepted" | "essential" (essential = only strictly necessary). */
(function () {
  var KEY = 'oufa-cookie-consent';

  function getConsent() {
    try { return localStorage.getItem(KEY); } catch (_) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(KEY, value); } catch (_) {}
    document.documentElement.setAttribute('data-cookie-consent', value);
    var b = document.getElementById('oufa-cookie-banner');
    if (b) b.classList.add('is-hidden');
    window.dispatchEvent(new CustomEvent('oufa:cookie-consent', { detail: value }));
  }

  function inject() {
    if (document.getElementById('oufa-cookie-banner')) return;

    var style = document.createElement('style');
    style.textContent = '\
      #oufa-cookie-banner {\
        position: fixed;\
        left: 16px; right: 16px; bottom: 16px;\
        z-index: 80;\
        max-width: 720px;\
        margin: 0 auto;\
        padding: 22px 26px;\
        border-radius: 18px;\
        background: rgba(253,248,243,.96);\
        backdrop-filter: blur(16px) saturate(140%);\
        -webkit-backdrop-filter: blur(16px) saturate(140%);\
        border: 1px solid rgba(201,88,103,.28);\
        box-shadow: 0 24px 60px -20px rgba(92,42,58,.30), 0 0 0 1px rgba(201,88,103,.08), inset 0 1px 0 rgba(255,255,255,.6);\
        color: #3d1f24;\
        font-family: "Montserrat", "Inter", system-ui, -apple-system, sans-serif;\
        display: grid;\
        grid-template-columns: 1fr auto;\
        gap: 20px 18px;\
        align-items: center;\
        transform: translateY(0);\
        opacity: 1;\
        transition: transform .45s cubic-bezier(.22,1,.36,1), opacity .35s ease;\
      }\
      #oufa-cookie-banner.is-entering {\
        transform: translateY(120%);\
        opacity: 0;\
      }\
      #oufa-cookie-banner.is-hidden {\
        transform: translateY(120%);\
        opacity: 0;\
        pointer-events: none;\
      }\
      #oufa-cookie-banner::before {\
        content: "";\
        position: absolute;\
        left: 26px; top: 24px;\
        width: 6px; height: 6px;\
        border-radius: 50%;\
        background: #c95867;\
        box-shadow: 0 0 14px rgba(201,88,103,.55);\
        opacity: .9;\
      }\
      #oufa-cookie-banner .ocb-content { padding-left: 22px; }\
      #oufa-cookie-banner .ocb-title {\
        font-family: "Cormorant", "Playfair Display", Georgia, serif;\
        font-size: 19px;\
        font-weight: 500;\
        color: #c95867;\
        letter-spacing: .015em;\
        margin: 0 0 4px;\
      }\
      #oufa-cookie-banner .ocb-text {\
        font-size: 13px;\
        line-height: 1.6;\
        color: #8a6770;\
        margin: 0;\
      }\
      #oufa-cookie-banner .ocb-text a {\
        color: #c95867;\
        text-decoration: none;\
        border-bottom: 1px solid rgba(201,88,103,.4);\
        transition: border-color .2s ease, color .2s ease;\
      }\
      #oufa-cookie-banner .ocb-text a:hover {\
        color: #a83f4f;\
        border-bottom-color: #a83f4f;\
      }\
      #oufa-cookie-banner .ocb-actions {\
        display: flex;\
        gap: 10px;\
        flex-shrink: 0;\
      }\
      #oufa-cookie-banner .ocb-btn {\
        font-family: inherit;\
        font-size: 12px;\
        font-weight: 600;\
        letter-spacing: .12em;\
        text-transform: uppercase;\
        padding: 12px 22px;\
        border-radius: 999px;\
        border: 0;\
        cursor: pointer;\
        transition: transform .2s ease, box-shadow .2s ease, background .2s ease, color .2s ease, border-color .2s ease;\
        white-space: nowrap;\
      }\
      #oufa-cookie-banner .ocb-btn-gold {\
        background: linear-gradient(135deg, #e89aa6, #c95867 60%, #a83f4f);\
        color: #fff;\
        box-shadow: 0 8px 22px -8px rgba(201,88,103,.55), inset 0 1px 0 rgba(255,255,255,.25);\
      }\
      #oufa-cookie-banner .ocb-btn-gold:hover {\
        transform: translateY(-1px);\
        box-shadow: 0 14px 28px -8px rgba(201,88,103,.65);\
      }\
      #oufa-cookie-banner .ocb-btn-ghost {\
        background: #fff;\
        color: #8a6770;\
        border: 1px solid rgba(92,42,58,.16);\
      }\
      #oufa-cookie-banner .ocb-btn-ghost:hover {\
        border-color: #c95867;\
        color: #c95867;\
        background: rgba(201,88,103,.04);\
      }\
      @media (max-width: 720px) {\
        #oufa-cookie-banner {\
          grid-template-columns: 1fr;\
          padding: 22px 22px;\
        }\
        #oufa-cookie-banner .ocb-actions {\
          width: 100%;\
        }\
        #oufa-cookie-banner .ocb-btn {\
          flex: 1;\
          padding: 13px 16px;\
        }\
      }\
      @media (prefers-reduced-motion: reduce) {\
        #oufa-cookie-banner { transition: none; }\
      }';
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'oufa-cookie-banner';
    banner.className = 'is-entering';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie-Hinweis');
    banner.innerHTML =
      '<div class="ocb-content">' +
        '<p class="ocb-title">Ein Schluck Tee, ein paar Cookies?</p>' +
        '<p class="ocb-text">Wir verwenden nur technisch notwendige Cookies, damit die Website sauber funktioniert. ' +
        'Keine Werbe-Tracker, kein Profiling. Details in unserer ' +
        '<a href="/datenschutz.html">Datenschutzerklärung</a>.</p>' +
      '</div>' +
      '<div class="ocb-actions">' +
        '<button class="ocb-btn ocb-btn-ghost" type="button" data-consent="essential">Nur Notwendige</button>' +
        '<button class="ocb-btn ocb-btn-gold" type="button" data-consent="accepted">Verstanden</button>' +
      '</div>';
    document.body.appendChild(banner);

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (!btn) return;
      setConsent(btn.getAttribute('data-consent'));
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.remove('is-entering');
      });
    });
  }

  function init() {
    var consent = getConsent();
    if (consent) {
      document.documentElement.setAttribute('data-cookie-consent', consent);
      return;
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inject);
    } else {
      inject();
    }
  }

  window.oufaCookies = {
    open: function () {
      try { localStorage.removeItem(KEY); } catch (_) {}
      document.documentElement.removeAttribute('data-cookie-consent');
      var b = document.getElementById('oufa-cookie-banner');
      if (b) b.remove();
      inject();
    },
    consent: getConsent,
  };

  init();
})();
