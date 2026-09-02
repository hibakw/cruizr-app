// CRUIZR - Production Interactive Application Logic

document.addEventListener("DOMContentLoaded", () => {
  // 1. App State
  const state = {
    selectedCity: "Bangalore",
    selectedHub: "Christ University & Koramangala Hub",
    selectedHubId: "blr-christ",
    activeTab: "weekend",
    activeCategory: "all",
    selectedTransmission: "all",
    selectedFuel: "all",
    maxPrice: 7000,
    searchQuery: "",
    sortBy: "recommended",
    
    // Auth State (persisted in localStorage)
    auth: getStoredAuth(),

    // Booking Form State
    bookingDetails: {
      pickupLocation: "Christ University & Koramangala Hub",
      pickupDate: getTomorrowDateFormatted(),
      pickupTime: "10:00 AM",
      dropDate: getDayAfterTomorrowFormatted(),
      dropTime: "10:00 AM",
      doorstepDelivery: true,
      durationDays: 2
    },

    // Active Car for Checkout Modal
    selectedCar: null,
    friendCount: 4,
    appliedCoupon: null,
    protectionPlan: "standard",
    includeDoorstepDelivery: true,

    // Host calculator state
    hostCarType: "suv",
    hostDays: 15,

    // Auth OTP state
    otpTimer: null,
    otpSecondsRemaining: 30
  };

  // Initial Boot
  initAuth();
  initNavigation();
  initHeroWidget();
  initPromoRail();
  initCarCatalog();
  initSplitFareWidget();
  initHostCalculator();
  initRoadTrips();
  initTestimonials();
  initFAQs();
  initWaitlist();
  initFooterModals();
  initModals();

  /* ==========================================================================
     1. AUTHENTICATION & SESSION MANAGEMENT (localStorage)
     ========================================================================== */
  function getStoredAuth() {
    try {
      const stored = localStorage.getItem("CRUIZR_AUTH");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Storage error", e);
    }
    return { isLoggedIn: false, user: null };
  }

  function saveAuth(authData) {
    state.auth = authData;
    try {
      localStorage.setItem("CRUIZR_AUTH", JSON.stringify(authData));
    } catch (e) {
      console.warn("Storage error", e);
    }
    renderAuthNavbar();
  }

  function initAuth() {
    renderAuthNavbar();

    // Step 1 -> Send OTP
    const sendOtpBtn = document.getElementById("send-otp-btn");
    const phoneInput = document.getElementById("auth-phone-input");
    const step1 = document.getElementById("auth-form-step-1");
    const step2 = document.getElementById("auth-form-step-2");
    const phoneDisplay = document.getElementById("otp-phone-display");

    if (sendOtpBtn && phoneInput) {
      sendOtpBtn.addEventListener("click", () => {
        const val = phoneInput.value.trim();
        if (val.length < 10) {
          showToast("⚠️ Please enter a valid 10-digit mobile number", "error");
          return;
        }
        if (phoneDisplay) phoneDisplay.textContent = `+91 ${val}`;
        step1.classList.add("hidden");
        step2.classList.remove("hidden");
        startOtpTimer();
        showToast("📩 OTP code sent to your mobile: 123456", "success");
      });
    }

    // Auto-fill test code
    const autofillBtn = document.getElementById("autofill-otp-btn");
    if (autofillBtn) {
      autofillBtn.addEventListener("click", () => {
        const digits = ["1", "2", "3", "4", "5", "6"];
        digits.forEach((d, idx) => {
          const el = document.getElementById(`otp-digit-${idx + 1}`);
          if (el) el.value = d;
        });
      });
    }

    // Back to phone input
    const backBtn = document.getElementById("back-to-phone-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        step2.classList.add("hidden");
        step1.classList.remove("hidden");
        clearInterval(state.otpTimer);
      });
    }

    // OTP Input auto-focus progression
    const otpInputs = document.querySelectorAll(".otp-input");
    otpInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        if (input.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value.length === 0 && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
    });

    // Verify OTP Action
    const verifyOtpBtn = document.getElementById("verify-otp-btn");
    if (verifyOtpBtn) {
      verifyOtpBtn.addEventListener("click", () => {
        let enteredOtp = "";
        otpInputs.forEach(inp => enteredOtp += inp.value);
        if (enteredOtp.length < 6) {
          showToast("⚠️ Please enter the 6-digit OTP (e.g. 123456)", "error");
          return;
        }

        const phoneVal = phoneInput ? phoneInput.value : "9876543210";
        const dummyUser = {
          name: "Alex Verma",
          phone: `+91 ${phoneVal}`,
          email: "alex.v@christuniversity.in",
          college: state.selectedHub.split("&")[0].trim(),
          verifiedStudent: true,
          avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
        };

        saveAuth({ isLoggedIn: true, user: dummyUser });
        document.getElementById("login-modal")?.classList.add("hidden");
        step2.classList.add("hidden");
        step1.classList.remove("hidden");
        clearInterval(state.otpTimer);
        showToast("🎉 Verified & Logged in as Student (25% Discount Active)", "success");
      });
    }

    // Google 1-Click Login
    const googleBtn = document.getElementById("auth-google-btn");
    if (googleBtn) {
      googleBtn.addEventListener("click", () => {
        const dummyUser = {
          name: "Alex Verma",
          phone: "+91 98765 43210",
          email: "alex.v@christuniversity.in",
          college: state.selectedHub.split("&")[0].trim(),
          verifiedStudent: true,
          avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
        };
        saveAuth({ isLoggedIn: true, user: dummyUser });
        document.getElementById("login-modal")?.classList.add("hidden");
        showToast("🎉 Signed in with College Email (Alex Verma)", "success");
      });
    }
  }

  function startOtpTimer() {
    clearInterval(state.otpTimer);
    state.otpSecondsRemaining = 30;
    const label = document.getElementById("otp-timer-label");
    state.otpTimer = setInterval(() => {
      state.otpSecondsRemaining--;
      if (label) label.textContent = `Resend in ${state.otpSecondsRemaining}s`;
      if (state.otpSecondsRemaining <= 0) {
        clearInterval(state.otpTimer);
        if (label) label.innerHTML = `<button type="button" class="text-[#FFE600] font-bold underline" onclick="showToast('OTP resent: 123456', 'info')">Resend Code</button>`;
      }
    }, 1000);
  }

  function renderAuthNavbar() {
    const desktopContainer = document.getElementById("auth-nav-container");
    const mobileContainer = document.getElementById("mobile-auth-btn-container");

    if (state.auth.isLoggedIn && state.auth.user) {
      const u = state.auth.user;
      const loggedInHtml = `
        <div class="relative group">
          <button type="button" id="user-menu-btn" class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gray-900 border border-[#FFE600]/40 hover:border-[#FFE600] transition">
            <img src="${u.avatar}" alt="${u.name}" class="w-7 h-7 rounded-lg object-cover border border-[#FFE600]" />
            <div class="text-left hidden sm:block">
              <p class="text-xs font-bold text-white flex items-center gap-1">
                ${u.name} <i data-lucide="badge-check" class="w-3.5 h-3.5 text-[#FFE600]"></i>
              </p>
              <p class="text-[10px] text-amber-300 font-semibold">Student Verified</p>
            </div>
            <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition"></i>
          </button>

          <!-- Dropdown Menu -->
          <div class="glass-dropdown absolute right-0 mt-2 w-56 rounded-2xl p-2 border border-gray-700 hidden group-hover:block transition shadow-2xl z-50">
            <div class="px-3 py-2 border-b border-gray-800">
              <p class="text-xs font-bold text-white">${u.name}</p>
              <p class="text-[10px] text-gray-400 truncate">${u.email}</p>
              <span class="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">25% Student Pass Active</span>
            </div>
            <button type="button" class="w-full text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition flex items-center gap-2" onclick="showToast('📋 You have 1 active upcoming reservation (#CRZ-882194)', 'info')">
              <i data-lucide="ticket" class="w-3.5 h-3.5 text-[#FFE600]"></i> My Bookings (1)
            </button>
            <button type="button" id="signout-btn" class="w-full text-left px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition flex items-center gap-2">
              <i data-lucide="log-out" class="w-3.5 h-3.5"></i> Sign Out
            </button>
          </div>
        </div>
      `;

      if (desktopContainer) desktopContainer.innerHTML = loggedInHtml;
      if (mobileContainer) {
        mobileContainer.innerHTML = `
          <div class="space-y-2">
            <div class="p-3 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-3">
              <img src="${u.avatar}" alt="${u.name}" class="w-9 h-9 rounded-lg object-cover border border-[#FFE600]" />
              <div>
                <p class="text-xs font-bold text-white">${u.name}</p>
                <p class="text-[10px] text-amber-300">🎓 ${u.college}</p>
              </div>
            </div>
            <button type="button" id="mobile-signout-btn" class="w-full py-2.5 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-800/50 font-bold text-xs">
              Sign Out
            </button>
          </div>
        `;
      }
    } else {
      const loggedOutHtml = `
        <button type="button" class="open-login-btn hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#9D4EDD]/20 to-[#FFE600]/20 border border-[#FFE600]/30 text-white text-xs font-bold hover:border-[#FFE600] transition">
          <span class="text-sm">🎓</span>
          <span>Student Pass (25% OFF)</span>
        </button>

        <button type="button" class="open-login-btn px-4 py-2 rounded-xl bg-[#FFE600] text-[#07090E] font-extrabold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#FFE600]/25 flex items-center gap-1.5">
          <i data-lucide="user" class="w-3.5 h-3.5 text-[#07090E]"></i> Sign In
        </button>
      `;
      if (desktopContainer) desktopContainer.innerHTML = loggedOutHtml;
      if (mobileContainer) {
        mobileContainer.innerHTML = `
          <button type="button" class="open-login-btn w-full py-3 rounded-xl bg-[#FFE600] text-black font-bold text-xs uppercase tracking-wider">
            Student Login / Sign Up
          </button>
        `;
      }
    }

    // Attach signout handler
    document.getElementById("signout-btn")?.addEventListener("click", () => {
      saveAuth({ isLoggedIn: false, user: null });
      showToast("👋 Signed out successfully", "info");
    });
    document.getElementById("mobile-signout-btn")?.addEventListener("click", () => {
      saveAuth({ isLoggedIn: false, user: null });
      showToast("👋 Signed out successfully", "info");
    });

    // Reattach open-login-btn handlers
    document.querySelectorAll(".open-login-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.getElementById("login-modal")?.classList.remove("hidden");
      });
    });

    lucide.createIcons();
  }

  /* ==========================================================================
     2. NAVIGATION & REAL CITY/CAMPUS SWITCHER LOGIC
     ========================================================================== */
  function initNavigation() {
    const campusDropdownBtn = document.getElementById("campus-dropdown-btn");
    const mobileCampusBtn = document.getElementById("mobile-campus-btn");
    const heroHubTrigger = document.getElementById("hero-hub-picker-trigger");
    const campusModal = document.getElementById("campus-modal");
    const closeCampusModal = document.getElementById("close-campus-modal");
    const campusListContainer = document.getElementById("campus-list");
    const currentCampusLabel = document.getElementById("current-campus-label");

    if (currentCampusLabel) {
      currentCampusLabel.textContent = `${state.selectedCity} (${state.selectedHub.split("&")[0]})`;
    }

    function renderCampusList() {
      if (!campusListContainer) return;
      campusListContainer.innerHTML = APP_DATA.campusHubs.map(hub => {
        const isSelected = (hub.name === state.selectedHub);
        return `
          <button type="button" class="campus-option flex items-center justify-between p-3.5 rounded-xl border ${isSelected ? 'border-[#FFE600] bg-[#121826]' : 'border-gray-800'} hover:border-[#FFE600] hover:bg-[#121826] transition text-left group w-full" data-id="${hub.id}" data-city="${hub.city}" data-name="${hub.name}">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-[#FFE600]/10 flex items-center justify-center text-[#FFE600] group-hover:scale-110 transition">
                <i data-lucide="graduation-cap" class="w-5 h-5"></i>
              </div>
              <div>
                <p class="text-white font-medium text-sm group-hover:text-[#FFE600] transition">${hub.name}</p>
                <p class="text-gray-400 text-xs">${hub.city} • ${hub.count} campus cars available</p>
              </div>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${isSelected ? 'bg-[#FFE600] text-black font-bold' : 'bg-gray-800/80 text-gray-300 border border-gray-700'}">
              ${isSelected ? 'Selected' : 'Select Hub'}
            </span>
          </button>
        `;
      }).join("");

      // Add click handlers to options
      campusListContainer.querySelectorAll(".campus-option").forEach(btn => {
        btn.addEventListener("click", () => {
          const city = btn.getAttribute("data-city");
          const name = btn.getAttribute("data-name");
          const id = btn.getAttribute("data-id");
          
          state.selectedCity = city;
          state.selectedHub = name;
          state.selectedHubId = id;
          state.bookingDetails.pickupLocation = name;
          
          if (currentCampusLabel) {
            currentCampusLabel.textContent = `${city} (${name.split("&")[0]})`;
          }
          
          const heroLocationInput = document.getElementById("hero-pickup-location");
          if (heroLocationInput) {
            heroLocationInput.value = name;
          }

          campusModal.classList.add("hidden");
          showToast(`📍 Switched to ${name} (${city})`, "success");
          filterAndRenderCars();
          renderCampusList();
        });
      });
      lucide.createIcons();
    }

    renderCampusList();

    if (campusDropdownBtn && campusModal) {
      campusDropdownBtn.addEventListener("click", () => campusModal.classList.remove("hidden"));
    }
    if (mobileCampusBtn && campusModal) {
      mobileCampusBtn.addEventListener("click", () => {
        document.getElementById("mobile-drawer")?.classList.add("translate-x-full");
        campusModal.classList.remove("hidden");
      });
    }
    if (heroHubTrigger && campusModal) {
      heroHubTrigger.addEventListener("click", () => campusModal.classList.remove("hidden"));
    }
    if (closeCampusModal && campusModal) {
      closeCampusModal.addEventListener("click", () => campusModal.classList.add("hidden"));
    }

    // Quick footer hub buttons
    document.querySelectorAll(".hub-quick-link").forEach(btn => {
      btn.addEventListener("click", () => {
        const city = btn.getAttribute("data-city");
        const hub = btn.getAttribute("data-hub");
        if (city && hub) {
          state.selectedCity = city;
          state.selectedHub = hub;
          state.bookingDetails.pickupLocation = hub;
          if (currentCampusLabel) {
            currentCampusLabel.textContent = `${city} (${hub.split("&")[0]})`;
          }
          const heroLocationInput = document.getElementById("hero-pickup-location");
          if (heroLocationInput) heroLocationInput.value = hub;
          showToast(`📍 Selected ${hub}`, "success");
          filterAndRenderCars();
          document.getElementById("fleet-section")?.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Mobile drawer toggle
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const closeMobileDrawer = document.getElementById("close-mobile-drawer");

    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener("click", () => mobileDrawer.classList.remove("translate-x-full"));
    }
    if (closeMobileDrawer && mobileDrawer) {
      closeMobileDrawer.addEventListener("click", () => mobileDrawer.classList.add("translate-x-full"));
    }
    document.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", () => mobileDrawer?.classList.add("translate-x-full"));
    });
  }

  /* ==========================================================================
     3. HERO TRIP WIDGET & SEARCH ENGINE
     ========================================================================== */
  function initHeroWidget() {
    const tabBtns = document.querySelectorAll(".hero-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => {
          b.classList.remove("active", "bg-[#FFE600]/15", "text-[#FFE600]", "border-[#FFE600]");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active", "bg-[#FFE600]/15", "text-[#FFE600]", "border-[#FFE600]");
        btn.setAttribute("aria-selected", "true");
        state.activeTab = btn.getAttribute("data-tab");

        const tabNote = document.getElementById("tab-dynamic-note");
        if (tabNote) {
          if (state.activeTab === "night") {
            tabNote.innerHTML = "🌙 <strong>Midnight Special:</strong> 8:00 PM to 6:00 AM flat ₹499 pack active!";
          } else if (state.activeTab === "hourly") {
            tabNote.innerHTML = "⏱️ <strong>Quick Bunk Mode:</strong> Hourly flex bookings starting @ ₹99/hr!";
          } else if (state.activeTab === "semester") {
            tabNote.innerHTML = "🏖️ <strong>Semester Roadtrip:</strong> 30% OFF applied for multi-day trips!";
          } else {
            tabNote.innerHTML = "⚡ <strong>Weekend Squad Pack:</strong> Zero Security Deposit with College ID!";
          }
        }
      });
    });

    const doorstepToggle = document.getElementById("hero-doorstep-toggle");
    if (doorstepToggle) {
      doorstepToggle.addEventListener("change", (e) => {
        state.bookingDetails.doorstepDelivery = e.target.checked;
        showToast(e.target.checked ? "🏠 Hostel / Doorstep delivery enabled (+₹249)" : "📍 Campus Hub pickup selected (Free)");
      });
    }

    const heroSearchBtn = document.getElementById("hero-search-btn");
    if (heroSearchBtn) {
      heroSearchBtn.addEventListener("click", () => {
        const fleetSection = document.getElementById("fleet-section");
        if (fleetSection) {
          fleetSection.scrollIntoView({ behavior: "smooth" });
          showToast(`🔍 Showing cars ready near ${state.selectedHub}`);
        }
      });
    }
  }

  /* ==========================================================================
     4. PROMO RAIL
     ========================================================================== */
  function initPromoRail() {
    const promoContainer = document.getElementById("promo-carousel");
    if (!promoContainer) return;

    promoContainer.innerHTML = APP_DATA.promoCodes.map(promo => `
      <div class="glass-card flex-shrink-0 w-80 p-4 rounded-2xl border border-gray-800 hover:border-[#FFE600]/50 transition relative overflow-hidden group">
        <div class="absolute -right-8 -top-8 w-24 h-24 bg-[#FFE600]/10 rounded-full blur-xl group-hover:bg-[#FFE600]/20 transition"></div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/30">${promo.tag}</span>
          <button type="button" class="copy-coupon-btn text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition" data-code="${promo.code}">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i> Copy
          </button>
        </div>
        <h3 class="text-white font-bold text-base mb-1">${promo.title}</h3>
        <p class="text-gray-400 text-xs mb-3 line-clamp-2">${promo.desc}</p>
        <div class="flex items-center justify-between pt-2 border-t border-gray-800/80">
          <code class="text-sm font-mono text-[#FFE600] bg-[#FFE600]/10 px-2 py-0.5 rounded border border-[#FFE600]/30 font-bold">${promo.code}</code>
          <button type="button" class="apply-coupon-btn text-xs font-bold text-[#FFE600] hover:underline" data-code="${promo.code}">Apply Code →</button>
        </div>
      </div>
    `).join("");

    promoContainer.querySelectorAll(".copy-coupon-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-code");
        navigator.clipboard?.writeText(code);
        showToast(`📋 Copied code ${code}! Apply at checkout.`);
      });
    });

    promoContainer.querySelectorAll(".apply-coupon-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-code");
        state.appliedCoupon = APP_DATA.promoCodes.find(p => p.code === code);
        showToast(`🎉 Coupon ${code} applied! Check car prices.`, "success");
      });
    });
  }

  /* ==========================================================================
     5. CAR CATALOG & LIVE DATA-DRIVEN FILTER ENGINE
     ========================================================================== */
  function initCarCatalog() {
    const categoryPills = document.querySelectorAll(".category-pill");
    categoryPills.forEach(pill => {
      pill.addEventListener("click", () => {
        categoryPills.forEach(p => {
          p.classList.remove("active", "bg-[#FFE600]", "text-[#07090E]", "font-bold");
          p.classList.add("bg-gray-800/80", "text-gray-300");
        });
        pill.classList.remove("bg-gray-800/80", "text-gray-300");
        pill.classList.add("active", "bg-[#FFE600]", "text-[#07090E]", "font-bold");
        state.activeCategory = pill.getAttribute("data-category");
        filterAndRenderCars();
      });
    });

    const transmissionSelect = document.getElementById("filter-transmission");
    if (transmissionSelect) {
      transmissionSelect.addEventListener("change", (e) => {
        state.selectedTransmission = e.target.value;
        filterAndRenderCars();
      });
    }

    const fuelSelect = document.getElementById("filter-fuel");
    if (fuelSelect) {
      fuelSelect.addEventListener("change", (e) => {
        state.selectedFuel = e.target.value;
        filterAndRenderCars();
      });
    }

    const priceSlider = document.getElementById("price-range-slider");
    const priceLabel = document.getElementById("price-range-value");
    if (priceSlider && priceLabel) {
      priceSlider.addEventListener("input", (e) => {
        state.maxPrice = parseInt(e.target.value);
        priceLabel.textContent = `₹${state.maxPrice.toLocaleString("en-IN")}/day`;
        filterAndRenderCars();
      });
    }

    const sortSelect = document.getElementById("filter-sort");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        state.sortBy = e.target.value;
        filterAndRenderCars();
      });
    }

    filterAndRenderCars();
  }

  function filterAndRenderCars() {
    const fleetGrid = document.getElementById("fleet-grid");
    const carsCountLabel = document.getElementById("cars-count-label");
    if (!fleetGrid) return;

    let filtered = APP_DATA.cars.filter(car => {
      // Category match
      if (state.activeCategory !== "all" && car.category !== state.activeCategory) return false;
      // Transmission match
      if (state.selectedTransmission !== "all" && car.transmission.toLowerCase() !== state.selectedTransmission.toLowerCase()) return false;
      // Fuel match
      if (state.selectedFuel !== "all" && car.fuel.toLowerCase() !== state.selectedFuel.toLowerCase()) return false;
      // Price match
      if (car.pricePerDay > state.maxPrice) return false;
      return true;
    });

    // Sort by city match first if applicable, then user sort
    if (state.sortBy === "price-low") {
      filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (state.sortBy === "price-high") {
      filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (state.sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: Prioritize current selected city
      filtered.sort((a, b) => {
        const aMatches = (a.city === state.selectedCity) ? 1 : 0;
        const bMatches = (b.city === state.selectedCity) ? 1 : 0;
        return bMatches - aMatches;
      });
    }

    if (carsCountLabel) {
      carsCountLabel.textContent = `Showing ${filtered.length} cars available (${state.selectedCity} Hub)`;
    }

    if (filtered.length === 0) {
      fleetGrid.innerHTML = `
        <div class="col-span-full py-16 text-center glass-card rounded-2xl border border-gray-800">
          <div class="w-16 h-16 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 mx-auto mb-4">
            <i data-lucide="car" class="w-8 h-8"></i>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">No Cars Found Matching Filters</h3>
          <p class="text-gray-400 text-xs max-w-md mx-auto mb-6">Try raising your price slider or resetting fuel and transmission filters.</p>
          <button type="button" id="reset-filters-btn" class="px-6 py-2.5 rounded-xl bg-[#FFE600] text-[#07090E] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition">Reset All Filters</button>
        </div>
      `;
      document.getElementById("reset-filters-btn")?.addEventListener("click", () => {
        state.activeCategory = "all";
        state.selectedTransmission = "all";
        state.selectedFuel = "all";
        state.maxPrice = 7000;
        const slider = document.getElementById("price-range-slider");
        if (slider) slider.value = 7000;
        const priceLabel = document.getElementById("price-range-value");
        if (priceLabel) priceLabel.textContent = "₹7,000/day";
        initCarCatalog();
      });
      lucide.createIcons();
      return;
    }

    fleetGrid.innerHTML = filtered.map(car => {
      const splitCost = Math.ceil(car.pricePerDay / 4);
      const isLocalCity = (car.city === state.selectedCity);

      return `
        <div class="car-card-container glass-card rounded-2xl border border-gray-800 hover:border-[#FFE600]/50 transition-all duration-300 flex flex-col group">
          
          <!-- Interactive Floating Hover Bubble -->
          <div class="info-bubble" aria-hidden="true">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-[#FFE600]"></i>
            <span>${car.quickBubble}</span>
          </div>

          <!-- Car Image Header -->
          <div class="relative h-48 overflow-hidden bg-gray-900">
            <img src="${car.image}" alt="${car.name} self-drive car" class="w-full h-full object-cover group-hover:scale-108 transition duration-500" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent"></div>
            
            <!-- Badges -->
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 z-20">
              <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#07090E]/85 backdrop-blur-md text-[#FFE600] border border-[#FFE600]/30 shadow-md">${car.badge}</span>
              ${car.zeroDeposit ? `<span class="text-xs font-bold px-2 py-1 rounded-full bg-amber-950/85 backdrop-blur-md text-amber-300 border border-amber-500/30">₹0 Deposit</span>` : ""}
            </div>

            <!-- Rating & Quick Peek trigger -->
            <div class="absolute top-3 right-3 flex items-center gap-1.5 z-20">
              <button type="button" class="quick-peek-btn quick-peek-trigger px-2.5 py-1 rounded-full bg-black/80 hover:bg-[#FFE600] hover:text-black backdrop-blur-md text-[11px] font-bold text-gray-200 border border-gray-700 shadow-lg flex items-center gap-1 transition" data-car-id="${car.id}" aria-label="Quick specs for ${car.name}">
                <i data-lucide="info" class="w-3 h-3"></i> Specs
              </button>
              <div class="flex items-center gap-1 bg-[#07090E]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-gray-700">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i>
                <span class="text-xs font-bold text-white">${car.rating}</span>
              </div>
            </div>

            <!-- Distance & Campus tag -->
            <div class="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-gray-300 z-10">
              <span class="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md text-[11px] ${isLocalCity ? 'text-[#FFE600]' : 'text-gray-300'}">
                <i data-lucide="map-pin" class="w-3 h-3 text-[#FFE600]"></i> ${isLocalCity ? car.location : `${car.city} Hub`}
              </span>
            </div>
          </div>

          <!-- Car Info Body -->
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h3 class="text-lg font-bold text-white group-hover:text-[#FFE600] transition">${car.name}</h3>
                  <p class="text-xs text-gray-400">${car.year} • ${car.categoryName}</p>
                </div>
              </div>

              <!-- Quick Specs Grid -->
              <div class="grid grid-cols-3 gap-2 my-3 py-2 px-3 rounded-xl bg-gray-900/60 border border-gray-800/80 text-center">
                <div>
                  <p class="text-[10px] uppercase text-gray-400 font-semibold">Fuel</p>
                  <p class="text-xs font-bold text-gray-200 mt-0.5">${car.fuel}</p>
                </div>
                <div class="border-x border-gray-800">
                  <p class="text-[10px] uppercase text-gray-400 font-semibold">Shift</p>
                  <p class="text-xs font-bold text-gray-200 mt-0.5">${car.transmission}</p>
                </div>
                <div>
                  <p class="text-[10px] uppercase text-gray-400 font-semibold">Seats</p>
                  <p class="text-xs font-bold text-gray-200 mt-0.5">${car.seats} Seater</p>
                </div>
              </div>

              <!-- Features tags -->
              <div class="flex flex-wrap gap-1.5 mb-4">
                ${car.features.slice(0, 2).map(f => `
                  <span class="text-[11px] px-2 py-0.5 rounded bg-gray-800/60 text-gray-300 border border-gray-700/50 flex items-center gap-1">
                    <i data-lucide="check" class="w-3 h-3 text-[#FFE600]"></i> ${f}
                  </span>
                `).join("")}
              </div>
            </div>

            <!-- Pricing & Action -->
            <div class="pt-3 border-t border-gray-800/80 flex items-center justify-between">
              <div>
                <div class="flex items-baseline gap-1">
                  <span class="text-xl font-extrabold text-white">₹${car.pricePerDay.toLocaleString("en-IN")}</span>
                  <span class="text-xs text-gray-400 font-medium">/day</span>
                </div>
                <p class="text-[11px] text-[#FFE600] font-semibold flex items-center gap-1 mt-0.5">
                  <i data-lucide="users" class="w-3 h-3"></i> ₹${splitCost}/person (4 friends)
                </p>
              </div>

              <button type="button" class="book-now-btn px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFE600] to-[#FF9900] text-[#07090E] font-extrabold text-sm hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#FFE600]/20 flex items-center gap-1.5" data-car-id="${car.id}" aria-label="Book ${car.name}">
                Book <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    fleetGrid.querySelectorAll(".book-now-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const carId = btn.getAttribute("data-car-id");
        openBookingModal(carId);
      });
    });

    fleetGrid.querySelectorAll(".quick-peek-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const carId = btn.getAttribute("data-car-id");
        openQuickPeekModal(carId);
      });
    });

    lucide.createIcons();
  }

  /* ==========================================================================
     6. SQUAD SPLIT-CALCULATOR MATH & LOGIC
     ========================================================================== */
  function initSplitFareWidget() {
    const friendSlider = document.getElementById("calc-friend-slider");
    const friendCountLabel = document.getElementById("calc-friend-count");
    const daysSlider = document.getElementById("calc-days-slider");
    const daysCountLabel = document.getElementById("calc-days-count");
    const perPersonResult = document.getElementById("calc-per-person-result");
    const totalEstResult = document.getElementById("calc-total-est-result");

    function updateCalc() {
      const friends = Math.max(1, parseInt(friendSlider?.value || 4));
      const days = Math.max(1, parseInt(daysSlider?.value || 2));
      
      if (friendCountLabel) friendCountLabel.textContent = `${friends} Friend${friends > 1 ? 's' : ''}`;
      if (daysCountLabel) daysCountLabel.textContent = `${days} Day${days > 1 ? 's' : ''}`;

      // Accurate Math Formula:
      // Base rent: ₹1,799/day, Fuel estimate: ₹800/day, Toll/FASTag: ₹400/day
      const dailyRent = 1799;
      const dailyFuel = 800;
      const dailyToll = 400;
      
      const total = (dailyRent + dailyFuel + dailyToll) * days;
      const perPerson = Math.ceil(total / friends);

      if (totalEstResult) totalEstResult.textContent = total.toLocaleString("en-IN");
      if (perPersonResult) perPersonResult.textContent = `₹${perPerson.toLocaleString("en-IN")}`;
    }

    if (friendSlider) friendSlider.addEventListener("input", updateCalc);
    if (daysSlider) daysSlider.addEventListener("input", updateCalc);
    updateCalc();
  }

  /* ==========================================================================
     7. BOOKING CHECKOUT MODAL & CONFIRMATION
     ========================================================================== */
  function openBookingModal(carId) {
    const car = APP_DATA.cars.find(c => c.id === carId);
    if (!car) return;
    state.selectedCar = car;

    // Auto apply student coupon if user is logged in
    if (state.auth.isLoggedIn && !state.appliedCoupon) {
      state.appliedCoupon = APP_DATA.promoCodes.find(p => p.code === "STUDENT25");
    }

    const modal = document.getElementById("booking-modal");
    if (!modal) return;

    renderBookingModalContent();
    modal.classList.remove("hidden");
    lucide.createIcons();
  }

  function renderBookingModalContent() {
    const modalBody = document.getElementById("booking-modal-body");
    const car = state.selectedCar;
    if (!modalBody || !car) return;

    const days = state.bookingDetails.durationDays || 2;
    const baseFare = car.pricePerDay * days;
    const doorstepFee = state.includeDoorstepDelivery ? 249 : 0;
    const protectionFee = state.protectionPlan === "zero-liability" ? (199 * days) : 0;
    
    let promoDiscount = 0;
    if (state.appliedCoupon) {
      if (state.appliedCoupon.type === "percent") {
        promoDiscount = Math.min((baseFare * state.appliedCoupon.discount) / 100, state.appliedCoupon.maxDiscount || 9999);
      } else {
        promoDiscount = state.appliedCoupon.discount;
      }
    }

    const subtotal = baseFare + doorstepFee + protectionFee - promoDiscount;
    const gst = Math.round(subtotal * 0.18);
    const totalAmount = Math.max(subtotal + gst, 499);
    const perPersonShare = Math.ceil(totalAmount / state.friendCount);

    modalBody.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left: Car Details & Trip Configuration -->
        <div class="lg:col-span-7 space-y-5">
          <!-- Car Banner Card -->
          <div class="flex items-center gap-4 p-4 rounded-2xl bg-gray-900/80 border border-gray-800">
            <img src="${car.image}" alt="${car.name}" class="w-24 h-20 rounded-xl object-cover" />
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold px-2 py-0.5 rounded bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/30">${car.categoryName}</span>
                <span class="text-xs text-gray-400">• ${car.year}</span>
              </div>
              <h3 class="text-lg font-bold text-white">${car.name}</h3>
              <p class="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#FFE600]"></i> ${car.location}
              </p>
            </div>
          </div>

          <!-- Trip Dates & Times -->
          <div class="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-3">
            <h4 class="text-xs font-bold text-gray-300 uppercase tracking-wider">Trip Schedule (${days} Days)</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div class="p-3 rounded-xl bg-gray-800/50 border border-gray-700/60">
                <p class="text-[11px] text-gray-400 font-semibold">PICKUP</p>
                <p class="font-bold text-white mt-1">${state.bookingDetails.pickupDate}</p>
                <p class="text-xs text-gray-400">${state.bookingDetails.pickupTime}</p>
              </div>
              <div class="p-3 rounded-xl bg-gray-800/50 border border-gray-700/60">
                <p class="text-[11px] text-gray-400 font-semibold">DROP-OFF</p>
                <p class="font-bold text-white mt-1">${state.bookingDetails.dropDate}</p>
                <p class="text-xs text-gray-400">${state.bookingDetails.dropTime}</p>
              </div>
            </div>
          </div>

          <!-- Live Split Fare Selector -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-[#121826] to-[#0D111A] border border-[#FFE600]/30 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-[#FFE600]/20 flex items-center justify-center text-[#FFE600]">
                  <i data-lucide="users" class="w-4 h-4"></i>
                </div>
                <h4 class="text-sm font-bold text-white">Split with College Friends</h4>
              </div>
              <span class="text-xs font-mono font-bold text-[#FFE600] bg-[#FFE600]/10 px-2.5 py-1 rounded-full border border-[#FFE600]/30">
                ₹${perPersonShare} / friend
              </span>
            </div>
            
            <p class="text-xs text-gray-400">Drag to adjust squad count & see your individual student share:</p>
            <div class="flex items-center gap-4">
              <input type="range" id="modal-friend-slider" min="1" max="${car.seats}" value="${state.friendCount}" class="w-full accent-[#FFE600]" aria-label="Friend count slider" />
              <span class="text-sm font-bold text-white min-w-[50px] text-right font-mono" id="modal-friend-count-label">${state.friendCount} People</span>
            </div>
          </div>

          <!-- Add-ons & Damage Protection -->
          <div class="space-y-2">
            <h4 class="text-xs font-bold text-gray-300 uppercase tracking-wider">Student Add-ons & Protection</h4>
            
            <label class="flex items-center justify-between p-3 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 cursor-pointer">
              <div class="flex items-center gap-3">
                <input type="checkbox" id="modal-doorstep-check" ${state.includeDoorstepDelivery ? 'checked' : ''} class="w-4 h-4 rounded text-[#FFE600] bg-gray-800 border-gray-700 focus:ring-0" />
                <div>
                  <p class="text-xs font-bold text-white">Deliver to Hostel / PG Gate</p>
                  <p class="text-[11px] text-gray-400">Sanitized delivery 15m before trip</p>
                </div>
              </div>
              <span class="text-xs font-bold text-[#FFE600]">+₹249</span>
            </label>

            <label class="flex items-center justify-between p-3 rounded-xl bg-gray-900/60 border ${state.protectionPlan === 'zero-liability' ? 'border-[#FFE600]' : 'border-gray-800'} cursor-pointer">
              <div class="flex items-center gap-3">
                <input type="checkbox" id="modal-protection-check" ${state.protectionPlan === 'zero-liability' ? 'checked' : ''} class="w-4 h-4 rounded text-[#FFE600] bg-gray-800 border-gray-700 focus:ring-0" />
                <div>
                  <p class="text-xs font-bold text-white">Zero Liability Student Protection</p>
                  <p class="text-[11px] text-gray-400">100% peace of mind against scratches/dents</p>
                </div>
              </div>
              <span class="text-xs font-bold text-[#FFE600]">+₹199/day</span>
            </label>
          </div>
        </div>

        <!-- Right: Fare Summary & Checkout -->
        <div class="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-gray-900/90 border border-gray-800">
          <div>
            <h4 class="text-sm font-bold text-white mb-4 pb-2 border-b border-gray-800">Fare Breakdown</h4>
            
            <!-- Promo input box -->
            <div class="mb-4">
              <div class="flex gap-2">
                <input type="text" id="modal-coupon-input" value="${state.appliedCoupon ? state.appliedCoupon.code : 'STUDENT25'}" placeholder="Enter Promo Code" class="flex-1 px-3 py-2 text-xs uppercase font-mono font-bold bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#FFE600]" />
                <button type="button" id="modal-apply-coupon-btn" class="px-4 py-2 rounded-xl bg-[#FFE600]/20 border border-[#FFE600] text-[#FFE600] text-xs font-bold hover:bg-[#FFE600] hover:text-[#07090E] transition">Apply</button>
              </div>
              ${state.appliedCoupon ? `
                <p class="text-[11px] text-amber-400 font-semibold mt-1 flex items-center gap-1">
                  <i data-lucide="check-circle" class="w-3 h-3"></i> Code ${state.appliedCoupon.code} applied!
                </p>
              ` : ''}
            </div>

            <!-- Breakdown rows -->
            <div class="space-y-2.5 text-xs text-gray-300 pb-4 border-b border-gray-800">
              <div class="flex justify-between">
                <span>Base Fare (${days} Days)</span>
                <span class="font-bold text-white">₹${baseFare.toLocaleString("en-IN")}</span>
              </div>
              ${state.includeDoorstepDelivery ? `
                <div class="flex justify-between">
                  <span>Hostel Doorstep Delivery</span>
                  <span class="font-bold text-white">₹249</span>
                </div>
              ` : ''}
              ${state.protectionPlan === 'zero-liability' ? `
                <div class="flex justify-between">
                  <span>Zero Liability Cover</span>
                  <span class="font-bold text-white">₹${(199 * days).toLocaleString("en-IN")}</span>
                </div>
              ` : ''}
              ${promoDiscount > 0 ? `
                <div class="flex justify-between text-[#FFE600] font-bold">
                  <span>Student Discount (${state.appliedCoupon?.code || 'STUDENT25'})</span>
                  <span>-₹${promoDiscount.toLocaleString("en-IN")}</span>
                </div>
              ` : ''}
              <div class="flex justify-between">
                <span>Taxes & GST (18%)</span>
                <span class="font-bold text-white">₹${gst.toLocaleString("en-IN")}</span>
              </div>
              <div class="flex justify-between text-amber-400">
                <span>Security Deposit (Student Pass)</span>
                <span class="font-bold">₹0 FREE</span>
              </div>
            </div>

            <!-- Total -->
            <div class="pt-4 mb-4">
              <div class="flex items-baseline justify-between mb-1">
                <span class="text-sm font-bold text-white">Total Amount</span>
                <span class="text-2xl font-black text-gradient-lime font-heading">₹${totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div class="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700/60 flex items-center justify-between text-xs">
                <span class="text-gray-400">Split between ${state.friendCount} friends:</span>
                <span class="font-extrabold text-[#FFE600] text-sm">₹${perPersonShare} each</span>
              </div>
            </div>
          </div>

          <!-- Checkout CTAs -->
          <div class="space-y-2 pt-2">
            <button type="button" id="confirm-reservation-btn" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFE600] via-[#FFD000] to-[#FF9900] text-[#07090E] font-black text-sm uppercase tracking-wider hover:brightness-110 active:scale-98 transition shadow-lg shadow-[#FFE600]/30 flex items-center justify-center gap-2">
              <i data-lucide="zap" class="w-4 h-4"></i> Confirm & Book Ride
            </button>
            <p class="text-[10px] text-center text-gray-400">Free Cancellation up to 6 hours before pickup • Instant UPI / Cards</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById("modal-friend-slider")?.addEventListener("input", (e) => {
      state.friendCount = parseInt(e.target.value);
      renderBookingModalContent();
    });

    document.getElementById("modal-doorstep-check")?.addEventListener("change", (e) => {
      state.includeDoorstepDelivery = e.target.checked;
      renderBookingModalContent();
    });

    document.getElementById("modal-protection-check")?.addEventListener("change", (e) => {
      state.protectionPlan = e.target.checked ? "zero-liability" : "standard";
      renderBookingModalContent();
    });

    document.getElementById("modal-apply-coupon-btn")?.addEventListener("click", () => {
      const inputCode = document.getElementById("modal-coupon-input")?.value.trim().toUpperCase();
      const found = APP_DATA.promoCodes.find(p => p.code === inputCode);
      if (found) {
        state.appliedCoupon = found;
        showToast(`🎉 Coupon ${found.code} applied!`, "success");
      } else {
        showToast(`❌ Invalid promo code '${inputCode}'`, "error");
      }
      renderBookingModalContent();
    });

    document.getElementById("confirm-reservation-btn")?.addEventListener("click", () => {
      if (!state.auth.isLoggedIn) {
        showToast("ℹ️ Please sign in to finalize student booking verification", "info");
        document.getElementById("login-modal")?.classList.remove("hidden");
        return;
      }
      document.getElementById("booking-modal").classList.add("hidden");
      openConfirmationModal(totalAmount, perPersonShare);
    });

    lucide.createIcons();
  }

  function openConfirmationModal(total, perPerson) {
    const confirmationModal = document.getElementById("confirmation-modal");
    const confirmationContent = document.getElementById("confirmation-modal-content");
    const car = state.selectedCar;
    if (!confirmationModal || !confirmationContent || !car) return;

    const bookingId = "CRZ-" + Math.floor(100000 + Math.random() * 900000);

    confirmationContent.innerHTML = `
      <div class="text-center p-6 space-y-4">
        <div class="w-16 h-16 rounded-full bg-[#FFE600]/20 border border-[#FFE600] flex items-center justify-center text-[#FFE600] mx-auto animate-bounce">
          <i data-lucide="check-circle-2" class="w-8 h-8"></i>
        </div>
        
        <div>
          <span class="text-xs font-mono font-bold px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">Booking ID: ${bookingId}</span>
          <h3 class="text-2xl font-black text-white mt-2">Trip Confirmed! Pack Your Bags 🎉</h3>
          <p class="text-xs text-gray-400 mt-1">Car keyless access details sent to your WhatsApp & ${state.auth.user?.email || 'email'}.</p>
        </div>

        <!-- Ticket Card -->
        <div class="p-4 rounded-2xl bg-gray-900 border border-gray-800 text-left space-y-3">
          <div class="flex items-center justify-between pb-3 border-b border-gray-800">
            <div>
              <p class="text-xs text-gray-400">VEHICLE</p>
              <h4 class="text-sm font-bold text-white">${car.name} (${car.year})</h4>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">TOTAL FARE</p>
              <h4 class="text-sm font-bold text-[#FFE600]">₹${total.toLocaleString("en-IN")}</h4>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p class="text-[10px] text-gray-400">PICKUP LOCATION</p>
              <p class="font-medium text-white">${state.selectedHub}</p>
            </div>
            <div>
              <p class="text-[10px] text-gray-400">PER FRIEND SHARE</p>
              <p class="font-bold text-[#FFE600]">₹${perPerson} (${state.friendCount} Friends)</p>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-gray-800/70 border border-gray-700 flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs text-gray-300">
              <i data-lucide="key" class="w-4 h-4 text-[#FFE600]"></i>
              <span>Keyless App Unlock Ready</span>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">ACTIVE</span>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button type="button" id="share-whatsapp-btn" class="flex-1 py-3 rounded-xl bg-[#25D366] text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110 transition">
            <i data-lucide="share-2" class="w-4 h-4"></i> Split on WhatsApp
          </button>
          <button type="button" id="done-ticket-btn" class="px-6 py-3 rounded-xl bg-gray-800 text-white font-bold text-xs hover:bg-gray-700 transition">
            Done
          </button>
        </div>
      </div>
    `;

    confirmationModal.classList.remove("hidden");

    document.getElementById("share-whatsapp-btn")?.addEventListener("click", () => {
      const text = encodeURIComponent(`Hey squad! I've booked our self-drive car (${car.name}) on CRUIZR for our road trip! 🚗💨 Total is ₹${total}, each person's share is ₹${perPerson}. Let's roll!`);
      window.open(`https://wa.me/?text=${text}`, "_blank");
    });

    document.getElementById("done-ticket-btn")?.addEventListener("click", () => {
      confirmationModal.classList.add("hidden");
    });

    lucide.createIcons();
  }

  /* ==========================================================================
     8. QUICK PEEK MODAL
     ========================================================================== */
  function openQuickPeekModal(carId) {
    const car = APP_DATA.cars.find(c => c.id === carId);
    if (!car) return;

    const modal = document.getElementById("info-modal");
    const modalTitle = document.getElementById("info-modal-title");
    const modalBody = document.getElementById("info-modal-body");
    if (!modal || !modalTitle || !modalBody) return;

    modalTitle.textContent = `${car.name} (${car.year})`;
    modalBody.innerHTML = `
      <img src="${car.image}" alt="${car.name}" class="w-full h-44 rounded-2xl object-cover border border-gray-800 mb-2" />
      <div class="p-3 rounded-xl bg-[#FFE600]/10 border border-[#FFE600]/30 text-xs font-bold text-[#FFE600] flex items-center gap-2">
        <i data-lucide="zap" class="w-4 h-4"></i>
        <span>${car.quickBubble}</span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="p-3 rounded-xl bg-gray-900 border border-gray-800">
          <p class="text-[10px] text-gray-400 uppercase font-semibold">Fuel Economy</p>
          <p class="font-bold text-white mt-0.5">${car.specs?.mileage || '20 km/l'}</p>
        </div>
        <div class="p-3 rounded-xl bg-gray-900 border border-gray-800">
          <p class="text-[10px] text-gray-400 uppercase font-semibold">Luggage Boot</p>
          <p class="font-bold text-white mt-0.5">${car.specs?.boot || '350 Litres'}</p>
        </div>
        <div class="p-3 rounded-xl bg-gray-900 border border-gray-800">
          <p class="text-[10px] text-gray-400 uppercase font-semibold">Top Highway Speed</p>
          <p class="font-bold text-white mt-0.5">${car.specs?.speed || '165 km/h'}</p>
        </div>
        <div class="p-3 rounded-xl bg-gray-900 border border-gray-800">
          <p class="text-[10px] text-gray-400 uppercase font-semibold">Audio System</p>
          <p class="font-bold text-white mt-0.5">${car.specs?.sound || 'Bluetooth Surround'}</p>
        </div>
      </div>

      <p class="text-xs text-gray-400 leading-relaxed">${car.desc}</p>

      <button type="button" id="quick-peek-book-btn" class="w-full py-3 rounded-xl bg-[#FFE600] text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition shadow-lg shadow-[#FFE600]/20">
        Book This Ride (₹${car.pricePerDay}/day) →
      </button>
    `;

    modal.classList.remove("hidden");
    lucide.createIcons();

    document.getElementById("quick-peek-book-btn")?.addEventListener("click", () => {
      modal.classList.add("hidden");
      openBookingModal(car.id);
    });
  }

  /* ==========================================================================
     9. STUDENT HOST CALCULATOR
     ========================================================================== */
  function initHostCalculator() {
    const carPills = document.querySelectorAll(".host-car-pill");
    const daysSlider = document.getElementById("host-days-slider");
    const daysLabel = document.getElementById("host-days-label");
    const earningsLabel = document.getElementById("host-earnings-result");

    const rateTable = {
      hatchback: 1200,
      sedan: 1800,
      suv: 2500,
      luxury: 4500
    };

    function updateHostEarnings() {
      const dailyRate = rateTable[state.hostCarType] || 2000;
      const days = state.hostDays;
      const total = Math.round(dailyRate * days * 0.75); // 75% host payout share

      if (daysLabel) daysLabel.textContent = `${days} Days / Month`;
      if (earningsLabel) earningsLabel.textContent = `₹${total.toLocaleString("en-IN")}`;
    }

    carPills.forEach(pill => {
      pill.addEventListener("click", () => {
        carPills.forEach(p => {
          p.classList.remove("active", "bg-[#FFE600]", "text-[#07090E]", "font-bold");
          p.classList.add("bg-gray-800", "text-gray-300");
        });
        pill.classList.remove("bg-gray-800", "text-gray-300");
        pill.classList.add("active", "bg-[#FFE600]", "text-[#07090E]", "font-bold");
        state.hostCarType = pill.getAttribute("data-type");
        updateHostEarnings();
      });
    });

    if (daysSlider) {
      daysSlider.addEventListener("input", (e) => {
        state.hostDays = parseInt(e.target.value);
        updateHostEarnings();
      });
    }

    updateHostEarnings();
  }

  /* ==========================================================================
     10. ROAD TRIPS, TESTIMONIALS & FAQS
     ========================================================================== */
  function initRoadTrips() {
    const container = document.getElementById("roadtrips-grid");
    if (!container) return;

    container.innerHTML = APP_DATA.roadTrips.map(trip => `
      <div class="glass-card rounded-2xl overflow-hidden border border-gray-800 hover:border-[#FFE600]/50 transition group flex flex-col justify-between">
        <div class="relative h-48 overflow-hidden bg-gray-900">
          <img src="${trip.image}" alt="${trip.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent"></div>
          <span class="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#07090E]/80 backdrop-blur-md text-[#FFE600] border border-[#FFE600]/30">
            ${trip.tag}
          </span>
          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
            <span class="font-bold flex items-center gap-1"><i data-lucide="navigation" class="w-3.5 h-3.5 text-[#FFE600]"></i> ${trip.distance}</span>
            <span class="text-gray-300 flex items-center gap-1"><i data-lucide="clock" class="w-3.5 h-3.5 text-[#FFE600]"></i> ${trip.time} drive</span>
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-base font-bold text-white mb-1 group-hover:text-[#FFE600] transition">${trip.title}</h3>
            <p class="text-xs text-gray-400 mb-3">${trip.vibe}</p>
          </div>
          <div class="pt-3 border-t border-gray-800 flex items-center justify-between">
            <span class="text-[11px] text-gray-300">Best with: <strong class="text-[#FFE600]">${trip.recommendedCar}</strong></span>
            <button type="button" class="explore-trip-btn text-xs font-bold text-[#FFE600] hover:underline flex items-center gap-1">
              Find Cars →
            </button>
          </div>
        </div>
      </div>
    `).join("");

    container.querySelectorAll(".explore-trip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.getElementById("fleet-section")?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function initTestimonials() {
    const container = document.getElementById("testimonials-grid");
    if (!container) return;

    container.innerHTML = APP_DATA.studentReviews.map(rev => `
      <div class="glass-card p-5 rounded-2xl border border-gray-800 flex flex-col justify-between hover:border-[#FFE600]/30 transition">
        <div>
          <div class="flex items-center gap-1 mb-3 text-amber-400">
            ${Array(rev.rating).fill('<i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>').join("")}
          </div>
          <p class="text-xs text-gray-300 italic mb-4">"${rev.comment}"</p>
        </div>
        <div class="pt-3 border-t border-gray-800/80 flex items-center gap-3">
          <img src="${rev.avatar}" alt="${rev.name}" class="w-10 h-10 rounded-full object-cover border border-[#FFE600]/40" />
          <div>
            <h3 class="text-xs font-bold text-white">${rev.name}</h3>
            <p class="text-[11px] text-[#FFE600] font-medium">${rev.college}</p>
            <p class="text-[10px] text-gray-400">${rev.car} • ${rev.trip}</p>
          </div>
        </div>
      </div>
    `).join("");
  }

  function initFAQs() {
    const container = document.getElementById("faqs-accordion");
    if (!container) return;

    container.innerHTML = APP_DATA.faqs.map(faq => `
      <div class="faq-item rounded-2xl bg-gray-900/60 border border-gray-800 overflow-hidden transition">
        <button type="button" class="faq-toggle w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-[#FFE600] transition">
          <span>${faq.q}</span>
          <i data-lucide="chevron-down" class="faq-icon w-4 h-4 text-gray-400 transition-transform"></i>
        </button>
        <div class="faq-answer hidden px-4 pb-4 text-xs text-gray-400 border-t border-gray-800/50 pt-3 leading-relaxed">
          ${faq.a}
        </div>
      </div>
    `).join("");

    container.querySelectorAll(".faq-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const answer = item.querySelector(".faq-answer");
        const icon = item.querySelector(".faq-icon");
        const isOpen = !answer.classList.contains("hidden");

        container.querySelectorAll(".faq-answer").forEach(a => a.classList.add("hidden"));
        container.querySelectorAll(".faq-icon").forEach(i => i.classList.remove("rotate-180"));

        if (!isOpen) {
          answer.classList.remove("hidden");
          icon.classList.add("rotate-180");
        }
      });
    });
  }

  /* ==========================================================================
     11. WAITLIST & FOOTER MODALS
     ========================================================================= */
  function initWaitlist() {
    const waitlistForm = document.getElementById("beta-waitlist-form");
    const waitlistInput = document.getElementById("waitlist-email");
    const successMsg = document.getElementById("waitlist-success-msg");

    if (waitlistForm && waitlistInput) {
      waitlistForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = waitlistInput.value.trim();
        if (!val) return;
        if (successMsg) successMsg.classList.remove("hidden");
        waitlistForm.reset();
        showToast("🚀 You're on the CRUIZR Mobile App VIP Beta Waitlist!", "success");
      });
    }
  }

  function initFooterModals() {
    const infoModal = document.getElementById("info-modal");
    const modalTitle = document.getElementById("info-modal-title");
    const modalBody = document.getElementById("info-modal-body");

    function openInfo(title, content) {
      if (!infoModal || !modalTitle || !modalBody) return;
      modalTitle.textContent = title;
      modalBody.innerHTML = content;
      infoModal.classList.remove("hidden");
      lucide.createIcons();
    }

    document.querySelectorAll(".open-ambassador-btn").forEach(b => {
      b.addEventListener("click", () => {
        openInfo("🎓 Campus Ambassador Program", `
          <p>Represent CRUIZR on your university campus and earn exclusive perks, free weekend drives, and leadership rewards!</p>
          <div class="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-2 my-2">
            <p class="font-bold text-white">Ambassador Perks:</p>
            <p>• ₹5,000 monthly drive credits for campus roadtrips</p>
            <p>• VIP passes to all CRUIZR sponsored college fests</p>
            <p>• Official Certificate of Internship & Recommendation letter</p>
          </div>
          <form class="space-y-2 pt-2" onsubmit="event.preventDefault(); showToast('Ambassador application submitted! We will reach out on WhatsApp.', 'success'); document.getElementById('info-modal').classList.add('hidden');">
            <input type="text" placeholder="Your College / Department" required class="w-full p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs focus:outline-none focus:border-[#FFE600]" />
            <input type="tel" placeholder="Mobile / WhatsApp Number" required class="w-full p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs focus:outline-none focus:border-[#FFE600]" />
            <button type="submit" class="w-full py-3 rounded-xl bg-[#FFE600] text-black font-bold text-xs uppercase hover:brightness-110">Apply to Represent Your Campus</button>
          </form>
        `);
      });
    });

    document.querySelectorAll(".open-sponsorship-btn").forEach(b => {
      b.addEventListener("click", () => {
        openInfo("🎉 College Fest Sponsorship", `
          <p>Looking for a title or mobility sponsor for your annual college cultural or tech fest? CRUIZR sponsors 100+ fests every semester.</p>
          <div class="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1 my-2">
            <p>• Cash sponsorship & prize pool contributions</p>
            <p>• Official car showcase with selfie booths & DJ lighting</p>
            <p>• Discount coupons for all attendees</p>
          </div>
          <form class="space-y-2 pt-2" onsubmit="event.preventDefault(); showToast('Sponsorship inquiry received! Our campus relations team will email you.', 'success'); document.getElementById('info-modal').classList.add('hidden');">
            <input type="text" placeholder="Fest Name & College" required class="w-full p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs focus:outline-none focus:border-[#FFE600]" />
            <input type="email" placeholder="Official Student Council Email" required class="w-full p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs focus:outline-none focus:border-[#FFE600]" />
            <button type="submit" class="w-full py-3 rounded-xl bg-[#FFE600] text-black font-bold text-xs uppercase hover:brightness-110">Submit Sponsorship Deck</button>
          </form>
        `);
      });
    });

    document.querySelectorAll(".open-policy-btn").forEach(b => {
      b.addEventListener("click", () => {
        openInfo("🛡️ Zero Security Deposit Policy", `
          <p>At CRUIZR, we believe student road trips shouldn't be blocked by massive deposit holds.</p>
          <div class="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-2 my-2">
            <p><strong>1. Eligibility:</strong> Any student with a valid government Driving License and a College Student ID or active .edu email qualifies for 100% Zero Deposit.</p>
            <p><strong>2. No Credit Card Needed:</strong> You don't need a credit card with locked credit limits. UPI / Debit cards work seamlessly.</p>
            <p><strong>3. Transparent Assessment:</strong> Pre-trip digital photos are recorded via app before unlock to ensure no unfair charges.</p>
          </div>
        `);
      });
    });

    document.querySelectorAll(".open-roadside-btn").forEach(b => {
      b.addEventListener("click", () => {
        openInfo("🚨 24/7 Roadside Assistance & SOS", `
          <p>Every CRUIZR self-drive rental is backed by 24/7 nationwide roadside assistance and SOS emergency support.</p>
          <div class="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-2 my-2">
            <p>• <strong>Flat Tyre & Battery Jumpstart:</strong> 30-45 minute dispatch anywhere on major highways.</p>
            <p>• <strong>Towing & Replacement Car:</strong> Instant vehicle replacement if mechanical breakdown occurs.</p>
            <p>• <strong>Toll-Free Helpline:</strong> +91 1800-CRUIZR (24x7 Active)</p>
          </div>
        `);
      });
    });

    document.querySelectorAll(".open-terms-btn").forEach(b => {
      b.addEventListener("click", () => {
        openInfo("📄 Terms of Use & Cancellation Policy", `
          <p>Fair, transparent terms designed for student flexibility:</p>
          <div class="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-2 my-2">
            <p>• <strong>Free Cancellation:</strong> 100% refund if cancelled at least 6 hours before trip start.</p>
            <p>• <strong>Fuel Policy:</strong> Return car with same fuel level as pickup (or opt for Fuel Included plan).</p>
            <p>• <strong>Interstate Permits:</strong> All CRUIZR vehicles possess valid All-India Tourist Permits for seamless border crossings.</p>
          </div>
        `);
      });
    });

    document.querySelectorAll(".open-damage-btn").forEach(b => {
      b.addEventListener("click", () => {
        openInfo("🚗 Damage Protection Coverage", `
          <p>Choose your comfort level during checkout:</p>
          <div class="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-2 my-2">
            <p>• <strong>Standard Cover (Included Free):</strong> Financial liability capped at ₹5,000 in case of major accidental damage.</p>
            <p>• <strong>Zero Liability Protection (+₹199/day):</strong> 100% ₹0 liability for all minor scratches, bumper scuffs, and glass damage.</p>
          </div>
        `);
      });
    });

    document.querySelectorAll(".open-support-btn").forEach(b => {
      b.addEventListener("click", () => {
        openInfo("💬 Student Help & Support", `
          <p>Have questions about your booking, keyless unlock, or student verification?</p>
          <div class="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-2 my-2">
            <p>• <strong>WhatsApp Support:</strong> +91 98765 CRZ-HELP (Instant response)</p>
            <p>• <strong>Email Support:</strong> help@cruizr.app</p>
            <p>• <strong>Campus Help Desks:</strong> Available at major university partner gates.</p>
          </div>
        `);
      });
    });
  }

  /* ==========================================================================
     12. GENERAL MODALS & DIALOGS
     ========================================================================= */
  function initModals() {
    const closeLoginBtn = document.getElementById("close-login-modal");
    const loginModal = document.getElementById("login-modal");
    if (closeLoginBtn && loginModal) {
      closeLoginBtn.addEventListener("click", () => loginModal.classList.add("hidden"));
    }

    const closeBookingBtn = document.getElementById("close-booking-modal");
    const bookingModal = document.getElementById("booking-modal");
    if (closeBookingBtn && bookingModal) {
      closeBookingBtn.addEventListener("click", () => bookingModal.classList.add("hidden"));
    }

    const closeHostBtn = document.getElementById("close-host-modal");
    const hostModal = document.getElementById("host-modal");
    if (closeHostBtn && hostModal) {
      closeHostBtn.addEventListener("click", () => hostModal.classList.add("hidden"));
    }

    const closeInfoBtn = document.getElementById("close-info-modal");
    const infoModal = document.getElementById("info-modal");
    if (closeInfoBtn && infoModal) {
      closeInfoBtn.addEventListener("click", () => infoModal.classList.add("hidden"));
    }

    document.querySelectorAll(".open-host-modal-btn").forEach(btn => {
      btn.addEventListener("click", () => hostModal?.classList.remove("hidden"));
    });

    document.getElementById("host-lead-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      hostModal?.classList.add("hidden");
      showToast("🚗 Host listing submitted! Our campus manager will call you within 2 hours.", "success");
    });

    document.querySelectorAll(".modal-backdrop").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
      });
    });
  }

  /* ==========================================================================
     HELPERS & UTILS
     ========================================================================= */
  function getTomorrowDateFormatted() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" });
  }

  function getDayAfterTomorrowFormatted() {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" });
  }

  function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    
    let icon = "info";
    if (type === "success") icon = "check-circle";
    if (type === "error") icon = "alert-triangle";

    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-4 h-4 ${type === 'success' ? 'text-[#FFE600]' : (type === 'error' ? 'text-rose-400' : 'text-[#FFE600]')} flex-shrink-0"></i>
      <span class="flex-1">${message}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
