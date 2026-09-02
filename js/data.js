// CRUIZR - Production Dataset (City-aware fleet, Campus hubs, FAQs, Reviews, & Roadtrips)

const APP_DATA = {
  brand: {
    name: "CRUIZR",
    tagline: "Rent. Ride. Roadtrip.",
    subtext: "Pocket-friendly self-drive cars for college students, campus runs & epic road trips."
  },
  
  campusHubs: [
    { id: "blr-christ", city: "Bangalore", name: "Christ University & Koramangala Hub", count: 8, icon: "graduation-cap" },
    { id: "blr-pes", city: "Bangalore", name: "PES Univ & Electronic City Hub", count: 6, icon: "graduation-cap" },
    { id: "del-north", city: "Delhi NCR", name: "Delhi University North Campus", count: 8, icon: "graduation-cap" },
    { id: "del-south", city: "Delhi NCR", name: "Hauz Khas & South Campus Hub", count: 7, icon: "graduation-cap" },
    { id: "del-noida", city: "Delhi NCR", name: "Amity Noida & Knowledge Park", count: 6, icon: "graduation-cap" },
    { id: "pune-symbiosis", city: "Pune", name: "Symbiosis Viman Nagar Hub", count: 8, icon: "graduation-cap" },
    { id: "pune-fc", city: "Pune", name: "FC Road & MIT Kothrud Hub", count: 6, icon: "graduation-cap" },
    { id: "mum-bandra", city: "Mumbai", name: "Bandra & Mithibai / NMIMS Hub", count: 7, icon: "graduation-cap" },
    { id: "mum-powai", city: "Mumbai", name: "IIT Bombay & Powai Hub", count: 6, icon: "graduation-cap" },
    { id: "chn-vit", city: "Chennai / Vellore", name: "VIT & OMR Tech Corridor", count: 6, icon: "graduation-cap" },
    { id: "manipal", city: "Manipal", name: "Manipal University Campus Hub", count: 6, icon: "graduation-cap" },
    { id: "goa-bits", city: "Goa", name: "BITS Goa & Panjim Coastal Hub", count: 8, icon: "palmtree" },
    { id: "hyd-gachibowli", city: "Hyderabad", name: "IIIT / Gachibowli Univ Hub", count: 6, icon: "graduation-cap" }
  ],

  promoCodes: [
    {
      code: "STUDENT25",
      discount: 25,
      type: "percent",
      maxDiscount: 1500,
      title: "🎓 Student Special",
      desc: "Flat 25% OFF for college students with valid student ID / .edu email",
      tag: "POPULAR"
    },
    {
      code: "NIGHTOWL",
      discount: 400,
      type: "flat",
      minAmount: 1200,
      title: "🌙 Midnight Food Run",
      desc: "Flat ₹400 OFF for late-night drives (8 PM - 6 AM)",
      tag: "NIGHT PACK"
    },
    {
      code: "ROADTRIP",
      discount: 30,
      type: "percent",
      maxDiscount: 3500,
      title: "🏖️ Weekend Getaway",
      desc: "30% OFF on bookings of 2 days or more (Goa, Hills, Beaches)",
      tag: "WEEKEND"
    },
    {
      code: "FIRSTCRUIZE",
      discount: 500,
      type: "flat",
      minAmount: 1500,
      title: "⚡ Freshers Special",
      desc: "₹500 OFF on your first CRUIZR self-drive experience",
      tag: "NEW USER"
    }
  ],

  cars: [
    {
      id: "car-swift",
      name: "Maruti Suzuki Swift",
      year: 2024,
      city: "Bangalore",
      hubId: "blr-christ",
      category: "pocket",
      categoryName: "Pocket Saver",
      transmission: "Manual",
      fuel: "Petrol",
      seats: 5,
      pricePerHour: 99,
      pricePerDay: 1399,
      rating: 4.86,
      tripsCount: 420,
      image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
      features: ["Apple CarPlay / Android Auto", "Bluetooth Stereo", "Fastag Enabled", "Super Fuel Efficient 22 km/l"],
      location: "Christ Univ Gate 2 • 0.4 km away",
      zeroDeposit: true,
      badge: "Campus Favorite 🔥",
      quickBubble: "⚡ 22 km/l • Apple CarPlay • Free FASTag",
      specs: {
        mileage: "22.5 km/l",
        boot: "268 Litres",
        speed: "165 km/h",
        sound: "6-Speaker Stereo + Aux"
      },
      desc: "The ultimate college daily driver. Super light on the pocket, smooth in city traffic, and roomy enough for the entire study group."
    },
    {
      id: "car-thar",
      name: "Mahindra Thar 4x4 Hard-Top",
      year: 2024,
      city: "Bangalore",
      hubId: "blr-christ",
      category: "suv",
      categoryName: "Squad SUV",
      transmission: "Manual",
      fuel: "Diesel",
      seats: 4,
      pricePerHour: 220,
      pricePerDay: 3199,
      rating: 4.95,
      tripsCount: 380,
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      features: ["Convertible / Rugged 4x4", "High Ground Clearance", "Touchscreen Audio", "Hill Assist"],
      location: "Koramangala 4th Block • 1.2 km away",
      zeroDeposit: true,
      badge: "Epic Roadtrip ⛰️",
      quickBubble: "⛰️ 4x4 Offroad • 226mm Clearance • M-Hawk Power",
      specs: {
        mileage: "14.2 km/l",
        boot: "Adventure Luggage Space",
        speed: "155 km/h",
        sound: "Roof-Mounted Adventure Sound"
      },
      desc: "The undisputed king of weekend road trips. Unmatched road presence, rugged off-road vibes, and built for mountain getaways."
    },
    {
      id: "car-i20",
      name: "Hyundai i20 Sportz",
      year: 2023,
      city: "Delhi NCR",
      hubId: "del-north",
      category: "pocket",
      categoryName: "Pocket Saver",
      transmission: "Automatic",
      fuel: "Petrol",
      seats: 5,
      pricePerHour: 115,
      pricePerDay: 1699,
      rating: 4.82,
      tripsCount: 295,
      image: "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80",
      features: ["Smooth Automatic", "Wireless Phone Charger", "Bose 6-Speaker System", "Rear AC Vents"],
      location: "North Campus Metro Hub • 0.6 km away",
      zeroDeposit: true,
      badge: "Smooth Auto ⚡",
      quickBubble: "🎵 Bose Audio • Wireless Charger • Smooth CVT",
      specs: {
        mileage: "19.8 km/l",
        boot: "311 Litres",
        speed: "170 km/h",
        sound: "Bose Premium 7-Speaker"
      },
      desc: "Chic styling with crisp audio setup. Perfect for stress-free automatic cruising during rush hours and city coffee runs."
    },
    {
      id: "car-creta",
      name: "Hyundai Creta SX (Sunroof)",
      year: 2024,
      city: "Pune",
      hubId: "pune-symbiosis",
      category: "suv",
      categoryName: "Squad SUV",
      transmission: "Automatic",
      fuel: "Diesel",
      seats: 5,
      pricePerHour: 195,
      pricePerDay: 2799,
      rating: 4.91,
      tripsCount: 512,
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      features: ["Panoramic Sunroof", "Ventilated Seats", "Cruise Control", "Large 433L Boot"],
      location: "Symbiosis Viman Nagar • 0.8 km away",
      zeroDeposit: true,
      badge: "Panoramic Sunroof ✨",
      quickBubble: "✨ Panoramic Sunroof • Cruise Control • 433L Boot",
      specs: {
        mileage: "18.5 km/l",
        boot: "433 Litres (Squad Bags)",
        speed: "180 km/h",
        sound: "Surround Acoustic Sound"
      },
      desc: "Spacious luxury SUV loaded with a huge panoramic sunroof and punchy diesel engine. The top pick for Goa and hill station trips."
    },
    {
      id: "car-nexon-ev",
      name: "Tata Nexon EV Max",
      year: 2024,
      city: "Mumbai",
      hubId: "mum-powai",
      category: "ev",
      categoryName: "Electric EV",
      transmission: "Automatic",
      fuel: "Electric",
      seats: 5,
      pricePerHour: 140,
      pricePerDay: 1999,
      rating: 4.89,
      tripsCount: 210,
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
      features: ["453 km Range", "Fast Charging 0-80% in 50m", "Zero Fuel Expense", "Silent Cabin & Instant Torque"],
      location: "Powai IIT Gate • 0.5 km away",
      zeroDeposit: true,
      badge: "Zero Fuel Cost 🔋",
      quickBubble: "🔋 453km Electric Range • ₹0 Fuel • Instant Torque",
      specs: {
        mileage: "453 km / Full Charge",
        boot: "350 Litres",
        speed: "140 km/h",
        sound: "Harman 8-Speaker Studio"
      },
      desc: "Save 100% on petrol! Cruise silently with electric torque and complimentary fast charging at 5,000+ public charging stations."
    },
    {
      id: "car-virtus",
      name: "Volkswagen Virtus GT",
      year: 2024,
      city: "Bangalore",
      hubId: "blr-christ",
      category: "sedan",
      categoryName: "Vibe Sedan",
      transmission: "Automatic",
      fuel: "Petrol",
      seats: 5,
      pricePerHour: 180,
      pricePerDay: 2599,
      rating: 4.93,
      tripsCount: 340,
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
      features: ["German Engineering", "Paddle Shifters", "5-Star Global NCAP Safety", "Digital Cockpit"],
      location: "Indiranagar 100ft Rd • 1.5 km away",
      zeroDeposit: true,
      badge: "German Vibe 🏎️",
      quickBubble: "🏎️ 150 BHP Turbo • Paddle Shifters • 5-Star NCAP",
      specs: {
        mileage: "18.1 km/l",
        boot: "521 Litres (Gigantic)",
        speed: "205 km/h",
        sound: "Digital Cockpit Audio"
      },
      desc: "Built for true driving enthusiasts. High-speed highway stability, sporty red accents, and 5-star crash safety for absolute peace of mind."
    },
    {
      id: "car-scorpio-n",
      name: "Mahindra Scorpio-N (7 Seater)",
      year: 2024,
      city: "Delhi NCR",
      hubId: "del-south",
      category: "suv",
      categoryName: "Squad SUV",
      transmission: "Manual",
      fuel: "Diesel",
      seats: 7,
      pricePerHour: 240,
      pricePerDay: 3499,
      rating: 4.94,
      tripsCount: 460,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      features: ["7 Full-size Seats", "Sony 12-Speaker 3D Audio", "Massive Power 175 BHP", "Dual Zone AC"],
      location: "Hauz Khas Village • 1.1 km away",
      zeroDeposit: true,
      badge: "Big Squad 7-Seater 👥",
      quickBubble: "👥 7 Full Seats • Sony 3D Sound • 175 BHP Beast",
      specs: {
        mileage: "15.0 km/l",
        boot: "7-Seater Modular Boot",
        speed: "175 km/h",
        sound: "Sony 12-Speaker 3D Immersive"
      },
      desc: "Got the whole batch or society friends traveling together? 7 seats, monster road stance, and crazy 3D surround sound for sing-along roadtrips."
    },
    {
      id: "car-bmw",
      name: "BMW 330i M-Sport",
      year: 2023,
      city: "Mumbai",
      hubId: "mum-bandra",
      category: "luxury",
      categoryName: "Flex / Luxury",
      transmission: "Automatic",
      fuel: "Petrol",
      seats: 5,
      pricePerHour: 450,
      pricePerDay: 6499,
      rating: 4.98,
      tripsCount: 165,
      image: "https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&w=800&q=80",
      features: ["258 BHP Twin-Turbo", "Harman Kardon Surround", "M-Sport Body Styling", "Heads-Up Display"],
      location: "Bandra West Promenade • 2.0 km away",
      zeroDeposit: false,
      badge: "Graduation Flex 👑",
      quickBubble: "👑 258 BHP Twin-Turbo • Harman Kardon • M-Sport",
      specs: {
        mileage: "13.8 km/l",
        boot: "480 Litres",
        speed: "250 km/h (Track Tested)",
        sound: "Harman Kardon 16-Speaker"
      },
      desc: "Turn every head on campus. The ultimate luxury flex for college fest arrivals, graduation galas, birthday night outs, and premium dates."
    }
  ],

  roadTrips: [
    {
      title: "Bangalore ➔ Nandi Hills & Coorg",
      from: "Bangalore",
      distance: "245 km",
      time: "4.5 hrs",
      tag: "COFFEE & CLOUDS",
      recommendedCar: "Mahindra Thar 4x4",
      image: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=600&q=80",
      vibe: "Early morning fog, chai stops, lush greenery & winding forest roads."
    },
    {
      title: "Delhi ➔ Murthal Dhabas & Rishikesh",
      from: "Delhi NCR",
      distance: "230 km",
      time: "4.0 hrs",
      tag: "MIDNIGHT PARATHAS & RAFTING",
      recommendedCar: "Tata Nexon / Swift",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
      vibe: "Garma-garam parathas with white makkhan at 2 AM followed by Ganga river rafting."
    },
    {
      title: "Mumbai / Pune ➔ Lonavala & Goa",
      from: "Mumbai / Pune",
      distance: "480 km",
      time: "8.5 hrs",
      tag: "BEACH & SUNSET VIBES",
      recommendedCar: "Hyundai Creta Sunroof",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
      vibe: "Expressway cruising, waterfall viewpoints, beach shacks, and epic hostel after-parties."
    },
    {
      title: "Chennai ➔ Pondicherry ECR Coastal Run",
      from: "Chennai",
      distance: "150 km",
      time: "2.5 hrs",
      tag: "COASTAL BREEZE",
      recommendedCar: "VW Virtus GT",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      vibe: "Ocean breeze on East Coast Road, French bakeries, surfing cafes & sunrise drives."
    }
  ],

  studentReviews: [
    {
      name: "Aarav Sharma",
      college: "IIT Bombay (Powai)",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
      car: "Mahindra Thar 4x4",
      trip: "Goa Semester Break",
      rating: 5,
      comment: "Split the Thar with 4 hostel wingmates — it came down to just ₹750 each per day! Bluetooth connected instantly and zero deposit with my student ID. Unbeatable experience."
    },
    {
      name: "Sneha Nair",
      college: "Christ University (Koramangala)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      car: "Maruti Swift 2024",
      trip: "Nandi Hills Sunrise Run",
      rating: 5,
      comment: "Booked the Midnight Pack at 2 AM for a quick Nandi Hills sunrise trip. Car was dropped right outside our PG gate in 20 minutes with keyless unlock. 10/10 recommend CRUIZR!"
    },
    {
      name: "Rohan Kapoor",
      college: "SRCC, Delhi University",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      car: "Tata Nexon EV",
      trip: "Rishikesh Weekend",
      rating: 5,
      comment: "Used code STUDENT25 for an insane 25% discount. Electric range was super solid and we literally spent ₹0 on petrol because charging was free on highway hubs."
    },
    {
      name: "Tanya Deshmukh",
      college: "Symbiosis Law School, Pune",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      car: "Hyundai Creta Sunroof",
      trip: "Mahabaleshwar Roadtrip",
      rating: 5,
      comment: "The built-in split fare tool in the app made collecting money from friends so easy. No awkward payment followups. Sunroof open on the ghats was pure vibes."
    }
  ],

  faqs: [
    {
      q: "Can I rent a car with a college ID and fresh driving license?",
      a: "Yes! As long as you have a valid permanent driving license (even if issued recently) and a government ID or College Student ID / .edu email, you are eligible to drive all standard cars on CRUIZR with ZERO security deposit."
    },
    {
      q: "How does the 'Split Fare with Friends' feature work?",
      a: "When you select any car, our live Split-Fare slider lets you choose your friend count (1 to 7 people). It instantly divides the total rent, fuel, and toll costs equally so you know your exact per-person share."
    },
    {
      q: "Is doorstep delivery available directly to my hostel or PG?",
      a: "Absolutely! Toggle 'Hostel / Doorstep Delivery' during booking, enter your campus gate or hostel location, and a verified CRUIZR host or fleet executive will drop the sanitized car right at your doorstep."
    },
    {
      q: "What is the Midnight / Night Drive Pack?",
      a: "Night Drive Pack is tailored for college food runs, late night drives, and sunrise trips (8:00 PM to 6:00 AM). You get flat special pricing starting at just ₹499 with code NIGHTOWL."
    },
    {
      q: "How do I unlock the car without physical keys?",
      a: "All CRUIZR cars are equipped with Smart IoT keyless entry. Once your booking starts, simply tap 'Unlock Car' on your phone to unlock the doors and start driving."
    },
    {
      q: "Are toll gate passes (FASTag) and Aux/Bluetooth included?",
      a: "Yes! 100% of our fleet comes with an active FASTag so you never wait in toll queues. Plus, every car is verified to have working Bluetooth / Apple CarPlay / Android Auto so your road trip playlist never stops."
    }
  ]
};
