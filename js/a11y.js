/* CRUIZR - Accessibility helpers (#34)
 * Loaded on every page. Works alongside app.js without changing its logic:
 *  - modals: Escape to close, focus trap, focus returns to the trigger
 *  - decorative Lucide icons are hidden from screen readers
 */
(function () {
  "use strict";

  var FOCUSABLE =
    'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),' +
    'select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function isShown(el) {
    return !el.closest(".hidden");
  }
  function focusables(root) {
    return Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), isShown);
  }

  /* ---------------------------------------------------------------- modals */
  var openStack = []; // { modal, trigger }

  function onModalToggle(modal) {
    var open = !modal.classList.contains("hidden");
    var idx = openStack.findIndex(function (e) { return e.modal === modal; });

    if (open && idx === -1) {
      openStack.push({ modal: modal, trigger: document.activeElement });
      var items = focusables(modal);
      var target = items.find(function (el) { return /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName); }) || items[0];
      if (target) target.focus();
    } else if (!open && idx !== -1) {
      var entry = openStack.splice(idx, 1)[0];
      var t = entry.trigger;
      if (t && document.contains(t) && typeof t.focus === "function") t.focus();
    }
  }

  function watchModals() {
    var observer = new MutationObserver(function (records) {
      records.forEach(function (r) { onModalToggle(r.target); });
    });
    document.querySelectorAll(".modal-backdrop").forEach(function (m) {
      observer.observe(m, { attributes: true, attributeFilter: ["class"] });
    });
  }

  function closeTopModal() {
    if (!openStack.length) return false;
    var modal = openStack[openStack.length - 1].modal;
    var closeBtn = modal.querySelector('[id^="close-"], [aria-label^="Close"]');
    if (closeBtn) closeBtn.click(); // reuse app.js cleanup (timers, form reset)
    if (!modal.classList.contains("hidden")) modal.classList.add("hidden");
    return true;
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && closeTopModal()) {
      e.preventDefault();
      return;
    }
    if (e.key !== "Tab" || !openStack.length) return;
    var modal = openStack[openStack.length - 1].modal;
    var items = focusables(modal);
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (!modal.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* ------------------------------------------------- decorative Lucide icons */
  function hideIcons() {
    document.querySelectorAll("svg.lucide:not([aria-hidden])").forEach(function (svg) {
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
    });
  }
  var iconQueued = false;
  function queueHideIcons() {
    if (iconQueued) return;
    iconQueued = true;
    requestAnimationFrame(function () { iconQueued = false; hideIcons(); });
  }

  function init() {
    watchModals();
    hideIcons();
    new MutationObserver(queueHideIcons).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
