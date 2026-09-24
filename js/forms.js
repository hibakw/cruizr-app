/* CRUIZR - Form validation + error states (#35)
 * Every form has three states: empty -> prompt, invalid -> inline error, valid -> success.
 * Errors are linked with aria-describedby / aria-invalid and announced via role="alert".
 * Capture-phase listeners run before app.js, so a success state is only ever
 * shown after validation passes.
 */
(function () {
  "use strict";

  /* ------------------------------------------------------- form validation */
  function errorFor(input) {
    var id = input.id + "-error";
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement("p");
      el.id = id;
      el.className = "field-error";
      el.setAttribute("role", "alert");
      var anchor = input.closest("[data-field]") || input.parentElement;
      anchor.insertAdjacentElement("afterend", el);
    }
    return el;
  }
  function showError(input, message) {
    var el = errorFor(input);
    el.textContent = message;
    el.classList.remove("hidden");
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", el.id);
    input.classList.add("field-invalid");
  }
  function clearError(input) {
    var el = document.getElementById(input.id + "-error");
    if (el) { el.textContent = ""; el.classList.add("hidden"); }
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    input.classList.remove("field-invalid");
  }
  function clearOnInput(input) {
    input.addEventListener("input", function () { clearError(input); });
  }

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var MOBILE10 = /^\d{10}$/;

  function initForms() {
    // 1) Waitlist - college email OR 10-digit mobile
    var waitlist = document.getElementById("beta-waitlist-form");
    var waitInput = document.getElementById("waitlist-email");
    if (waitlist && waitInput) {
      waitlist.noValidate = true;
      clearOnInput(waitInput);
      var waitOk = document.getElementById("waitlist-success-msg");
      if (waitOk) waitOk.setAttribute("role", "status");
      waitlist.addEventListener("submit", function (e) {
        var v = waitInput.value.trim();
        var msg = "";
        if (!v) msg = "Enter your college email or mobile number.";
        else if (!EMAIL.test(v) && !MOBILE10.test(v)) msg = "Enter a valid email (name@college.edu) or a 10-digit mobile number.";
        if (msg) {
          e.preventDefault();
          e.stopImmediatePropagation(); // stops app.js showing the success state
          if (waitOk) waitOk.classList.add("hidden");
          showError(waitInput, msg);
          waitInput.focus();
        } else {
          clearError(waitInput);
        }
      }, true);
    }

    // 2) Login - phone number step and OTP step
    var sendBtn = document.getElementById("send-otp-btn");
    var phone = document.getElementById("auth-phone-input");
    if (sendBtn && phone) {
      clearOnInput(phone);
      sendBtn.addEventListener("click", function (e) {
        var v = phone.value.trim();
        var msg = "";
        if (!v) msg = "Enter your mobile number.";
        else if (!MOBILE10.test(v)) msg = "Mobile number must be exactly 10 digits.";
        if (msg) {
          e.stopImmediatePropagation();
          showError(phone, msg);
          phone.focus();
        } else {
          clearError(phone);
        }
      }, true);
    }
    var verifyBtn = document.getElementById("verify-otp-btn");
    var otpBoxes = document.querySelectorAll(".otp-input");
    if (verifyBtn && otpBoxes.length) {
      var otpGroup = otpBoxes[0].parentElement;
      var otpErr = document.createElement("p");
      otpErr.id = "otp-error";
      otpErr.className = "field-error hidden text-center";
      otpErr.setAttribute("role", "alert");
      otpGroup.insertAdjacentElement("afterend", otpErr);
      otpBoxes.forEach(function (box, i) {
        box.setAttribute("aria-label", "OTP digit " + (i + 1) + " of " + otpBoxes.length);
        box.setAttribute("inputmode", "numeric");
        box.addEventListener("input", function () { otpErr.classList.add("hidden"); });
      });
      verifyBtn.addEventListener("click", function (e) {
        var code = Array.prototype.map.call(otpBoxes, function (b) { return b.value; }).join("");
        if (!/^\d{6}$/.test(code)) {
          e.stopImmediatePropagation();
          otpErr.textContent = code.length ? "Enter all 6 digits (numbers only)." : "Enter the 6-digit OTP.";
          otpErr.classList.remove("hidden");
          otpBoxes[Math.min(code.length, otpBoxes.length - 1)].focus();
        } else {
          otpErr.classList.add("hidden");
        }
      }, true);
    }

    // 3) Help page - support ticket
    var ticket = document.getElementById("support-ticket-form");
    if (ticket) {
      ticket.noValidate = true;
      var tName = document.getElementById("ticket-name");
      var tPhone = document.getElementById("ticket-phone");
      var tMsg = document.getElementById("ticket-message");
      [tName, tPhone, tMsg].forEach(function (f) { if (f) clearOnInput(f); });
      var tOk = document.getElementById("ticket-success-message");
      if (tOk) tOk.setAttribute("role", "status");
      ticket.addEventListener("submit", function (e) {
        var problems = [];
        if (!tName.value.trim()) problems.push([tName, "Enter your name."]);
        var p = tPhone.value.trim();
        if (!p) problems.push([tPhone, "Enter your mobile number."]);
        else if (!MOBILE10.test(p)) problems.push([tPhone, "Mobile number must be exactly 10 digits."]);
        if (!tMsg.value.trim()) problems.push([tMsg, "Tell us how we can help."]);
        [tName, tPhone, tMsg].forEach(clearError);
        if (problems.length) {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (tOk) tOk.classList.add("hidden");
          problems.forEach(function (pr) { showError(pr[0], pr[1]); });
          problems[0][0].focus();
        }
      }, true);
    }

    // 4) Host form: app.js already renders per-field errors; expose them to assistive tech
    ["name", "car", "location", "phone"].forEach(function (k) {
      var input = document.getElementById("host-" + k);
      var err = document.getElementById("host-" + k + "-error");
      if (!input || !err) return;
      err.setAttribute("role", "alert");
      input.setAttribute("aria-describedby", err.id);
      new MutationObserver(function () {
        if (err.classList.contains("hidden")) input.removeAttribute("aria-invalid");
        else input.setAttribute("aria-invalid", "true");
      }).observe(err, { attributes: true, attributeFilter: ["class"] });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initForms);
  else initForms();
})();
