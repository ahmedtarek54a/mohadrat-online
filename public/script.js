// function عشان تمنع المتغيرات من الظهور في global scope
(function () {
  const path = window.location.pathname;

  // --- TOAST NOTIFICATION HELPER ---
  window.showToast = function (message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span><button class="toast-close">&times;</button>`;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.style.animation = 'fadeOutToast 0.5s forwards';
      toast.addEventListener('animationend', () => toast.remove());
    }, 3000);

    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
  };


  // --- TRANSLATION LOGIC ---
  // ... (Translation object is omitted here, stick to modifying logic around it if needed or assume user keeps it)
  // Since I cannot match "..." without deleting the translations, I will skip replacing the translation object and focus on the Auth handlers below it.
  // BUT the instructions say "Replace alert...". I need to be careful with "startLine".
  // I will assume the translation logic is fine and only Target the Auth Handlers specifically.

  // Wait, I need to insert showToast globally mostly. 
  // Let's Insert showToast at the very top first.

  // Actually, let's target the Auth logic block specifically.


  // --- TRANSLATION LOGIC ---
  const translations = {
    en: {
      siteName: "Mohadrat Online",
      home: "Home",
      about: "About",
      courses: "Courses",
      forum: "Forum",
      contact: "Contact",
      login: "Log in",
      signup: "Sign Up",
      heroTitle: "Mohadrat Online Platform",
      heroDesc: "Learn easily anytime, through recorded lectures and interactive discussions.",
      startNow: "Start Now",
      features: "Features",
      popular: "Popular Courses",
      footerLinks: "Quick Links",
      footerContact: "Contact",
      adminPanel: "Admin Panel",
      profile: "Profile",
      logout: "Logout",
      // Auth Keys
      loginTitle: "Login",
      signupTitle: "Sign Up",
      fullNamePlaceholder: "Full Name",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      confirmPasswordPlaceholder: "Confirm Password",
      rolePlaceholder: "Select Account Type",
      loginBtn: "Login",
      signupBtn: "Create Account",
      haveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      studentRole: "Student",
      adminRole: "Admin",
      langBtn: "AR",

      videoLectures: "Video Lectures",
      videoDesc: "Upload or watch recorded lessons with descriptions and downloadable notes.",
      assignments: "Assignments",
      assignDesc: "Students submit work online; instructors can review and give feedback.",
      discussion: "Discussion Forum",
      discussDesc: "Interactive Q&A with upvotes and instructor replies to keep learners engaged.",
      view: "View",
      paid: "Paid",
      free: "Free",
      updated: "Updated",
      copyright: "© 2025 Mohadrat Online— Made by El Sheikh"
    },
    ar: {
      siteName: "محاضرات أونلاين",
      home: "الرئيسية",
      about: "من نحن",
      courses: "الكورسات",
      forum: "المنتدى",
      contact: "تواصل معنا",
      login: "دخول",
      signup: "تسجيل",
      heroTitle: "منصة محاضرات أونلاين",
      heroDesc: "تعلم بسهولة في أي وقت، من خلال محاضرات مسجلة ومناقشات تفاعلية تساعدك على التفوق.",
      startNow: "ابدأ الآن",
      features: "المميزات",
      popular: "أشهر الكورسات",
      footerLinks: "روابط سريعة",
      footerContact: "تواصل معنا",
      adminPanel: "لوحة التحكم",
      profile: "ملفي",
      logout: "خروج",
      // Auth Keys
      loginTitle: "تسجيل الدخول",
      signupTitle: "إنشاء حساب",
      fullNamePlaceholder: "الاسم الكامل",
      emailPlaceholder: "البريد الإلكتروني",
      passwordPlaceholder: "كلمة المرور",
      confirmPasswordPlaceholder: "تأكيد كلمة المرور",
      rolePlaceholder: "اختر نوع الحساب",
      loginBtn: "دخول",
      signupBtn: "إنشاء حساب",
      haveAccount: "لديك حساب بالفعل؟",
      noAccount: "ليس لديك حساب؟",
      studentRole: "طالب (Student)",
      adminRole: "مسؤول (Admin)",
      langBtn: "EN",

      videoLectures: "محاضرات فيديو",
      videoDesc: "شاهد أو ارفع دروساً مسجلة مع شروحات وملاحظات قابلة للتنزيل.",
      assignments: "واجبات ومهام",
      assignDesc: "يقوم الطلاب بتسليم الواجبات أونلاين ليتمكن المعلم من مراجعتها.",
      discussion: "منتدى النقاش",
      discussDesc: "أسئلة وأجوبة تفاعلية مع إمكانية التصويت والردود لزيادة التفاعل.",
      view: "عرض",
      paid: "مدفوع",
      free: "مجاني",
      updated: "آخر تحديث",
      copyright: "© 2025 محاضرات أونلاين — تطوير الشيخ"
    }
  };

  function setLanguage(lang) {
    localStorage.setItem('edu_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update Toggle Button Text
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) {
      langBtn.textContent = lang === 'ar' ? 'EN' : 'AR';
    }

    // Update Text Elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Update Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });
  }

  // Init
  const savedLang = localStorage.getItem('edu_lang') || 'en';
  setLanguage(savedLang);

  // Toggle Event
  const langBtn = document.getElementById('lang-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const current = localStorage.getItem('edu_lang') || 'en';
      const next = current === 'ar' ? 'en' : 'ar';
      setLanguage(next);
    });
  }

  // --- END TRANSLATION LOGIC ---

  // Handle Sign Up 
  if (path.includes('signup.html')) {
    const signupForm = document.querySelector('.auth-container form');
    if (signupForm) {
      signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const inputs = signupForm.querySelectorAll('input');
        const fullName = inputs[0].value.trim();
        const email = inputs[1].value.trim();
        const password = inputs[2].value.trim();
        const confirmPassword = inputs[3].value.trim();
        const roleSelect = signupForm.querySelector('#role');
        const role = roleSelect ? roleSelect.value : 'student';

        if (!fullName || !email || !password || !confirmPassword) {
          showToast('الرجاء ملء جميع الحقول.', 'error');
          return;
        }
        if (password.length < 6) {
          showToast('يجب أن لا تقل كلمة المرور عن 6 أحرف.', 'error');
          return;
        }
        if (password !== confirmPassword) {
          showToast('كلمتا المرور غير متطابقتين.', 'error');
          return;
        }

        try {
          const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password, role })
          });
          const data = await res.json();

          if (res.ok) {
            showToast('تم إنشاء الحساب بنجاح! جاري التحويل...', 'success');
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
          } else {
            showToast(data.error || 'حدث خطأ أثناء التسجيل', 'error');
          }
        } catch (err) {
          console.error(err);
          showToast('خطأ في الاتصال بالخادم', 'error');
        }
      });
    }
  }

  // Handle Log In (login.html)
  if (path.includes('login.html')) {
    const loginForm = document.querySelector('.auth-container form');
    if (loginForm) {
      loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const inputs = loginForm.querySelectorAll('input');
        const email = inputs[0].value.trim();
        const password = inputs[1].value.trim();

        if (!email || !password) {
          showToast('الرجاء إدخال البريد الإلكتروني وكلمة المرور.', 'error');
          return;
        }

        try {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();

          if (res.ok) {
            localStorage.setItem('edu_is_logged_in', 'true');
            localStorage.setItem('edu_current_user_email', data.user.email);
            localStorage.setItem('edu_user_data', JSON.stringify(data.user)); // Store role

            showToast(`أهلاً بك يا ${data.user.name}! جاري الدخول...`, 'success');
            setTimeout(() => { window.location.href = 'index.html'; }, 1500);
          } else {
            showToast(data.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', 'error');
          }
        } catch (err) {
          console.error(err);
          showToast('خطأ في الاتصال بالخادم', 'error');
        }
      });
    }
  }

  // --- COURSES PAGE LOGIC ---
  if (path.includes('courses.html')) {
    const container = document.getElementById('courses-container');
    if (container) {
      fetch('/api/courses')
        .then(res => res.json())
        .then(courses => {
          container.innerHTML = '';
          const currentUser = JSON.parse(localStorage.getItem('edu_user_data') || '{}');
          const isAdmin = currentUser.role === 'admin';

          // Admin Controls Injection
     if (isAdmin) {
    const adminControls = document.getElementById('admin-controls');
    if (adminControls) {
        // استخدمنا الـ HTML الجديد مع الحفاظ على روابط الـ href القديمة
        adminControls.innerHTML = `
            <div class="admin-panel">
                
                <div class="admin-label">
                    <i class="fa-solid fa-user-gear"></i>
                    <span>لوحة تحكم المشرف</span>
                </div>

                <div class="admin-actions">
                    
                    <a href="admin.html#add-course-form" class="admin-btn btn-add-course" style="text-decoration: none;">
                        <i class="fa-solid fa-plus"></i> إضافة كورس
                    </a>

                    <a href="admin.html#add-video-form" class="admin-btn btn-add-video" style="text-decoration: none;">
                        <i class="fa-solid fa-video"></i> إضافة فيديو
                    </a>

                    <a href="admin.html#add-assignment-form" class="admin-btn btn-add-assign" style="text-decoration: none;">
                        <i class="fa-solid fa-file-pen"></i> إضافة واجب
                    </a>

                </div>
            </div>
        `;
    }
}

          courses.forEach(course => {
            const article = document.createElement('article');
            article.className = 'course-card';
            article.innerHTML = `
                        <div class="course-img-wrapper" style="background:#ddd;height:200px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                            <img src="${course.image}" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.parentElement.innerHTML='<div style=\'width:100%;height:100%;background:#333;color:#fff;display:flex;align-items:center;justify-content:center;\'>${course.title}</div>'"/>
                        </div>
                        <div class="course-body">
                          <h4>${course.title}</h4>
                          <p>${course.description}</p>
                          <div class="course-actions">
                            <span class="price">${course.price}</span>
                            <a class="btn small" href="${course.link}">Open</a>
                            ${isAdmin ? `<button class="btn-delete" onclick="deleteCourse('${course.id}')" style="background:red;border:none;color:white;padding:5px;margin-left:5px;cursor:pointer">Delete</button>` : ''}
                          </div>
                        </div>
                    `;
            container.appendChild(article);
          });
        })
        .catch(err => {
          console.error(err);
          container.innerHTML = '<p>Error loading courses.</p>';
        });
    }

    // Global function for delete button
    window.deleteCourse = async (id) => {
      if (confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
        try {
          const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showToast('تم حذف الكورس بنجاح', 'success');
            setTimeout(() => { location.reload(); }, 1500);
          } else {
            showToast('خطأ في حذف الكورس', 'error');
          }
        } catch (err) {
          console.error(err);
          showToast('خطأ في الاتصال', 'error');
        }
      }
    };
  }

  // --- END OF AUTHENTICATION LOGIC ---
})();



// 1. MOBILE NAV MENU
(function () {
  const menuBtn = document.getElementById('menu-btn');
  const navList = document.getElementById('nav-list');

  if (menuBtn && navList) {
    menuBtn.addEventListener('click', () => {
      navList.classList.toggle('show');
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!expanded));
    });

    // Close nav on link click (mobile)
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navList.classList.contains('show')) navList.classList.remove('show');
      });
    });
  }
})();
/* =========================================
   كود عداد الأرقام (Statistics Counter)
   ========================================= */
const counters = document.querySelectorAll('.counter');

// دالة التحريك
const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            // الرقم المستهدف (اللي مكتوب في data-target)
            const target = +counter.getAttribute('data-target');
            // الرقم الحالي
            const count = +counter.innerText;
            
            // سرعة العد (كل ما الرقم زاد، الحركة أبطأ)
            const speed = target / 100; // قسمنا على 100 خطوة

            // لو لسه موصلناش للرقم النهائي
            if (count < target) {
                counter.innerText = Math.ceil(count + speed);
                setTimeout(updateCount, 20); // كرر العملية كل 20 مللي ثانية
            } else {
                counter.innerText = target; // أثبت عند الرقم النهائي
            }
        };
        updateCount();
    });
};

// تشغيل العداد فقط لما يظهر في الشاشة (Intersection Observer)
// عشان الحركة متبدأش غير لما المستخدم ينزل للقسم ده
const sectionObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        animateCounters();
        sectionObserver.disconnect(); // وقف المراقبة بعد ما الحركة اشتغلت مرة
    }
}, { threshold: 0.5 }); // يشتغل لما نص القسم يظهر

// ابدأ مراقبة قسم الإحصائيات
const statsSection = document.querySelector('.stats-section');
if(statsSection) {
    sectionObserver.observe(statsSection);
}
// 2. FORUM - Logic moved to forum.html (Backend Integration)
// Previous LocalStorage implementation removed to avoid conflicts.

// 3. CONTACT FORM - client-side demo
(function () {
  const contactForm = document.getElementById('contact-form');
  const resultEl = document.getElementById('contact-result');

  if (contactForm && resultEl) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        resultEl.textContent = 'الرجاء ملء جميع الحقول.';
        resultEl.style.color = '#ffb4b4';
        return;
      }

      resultEl.textContent = `شكراً لك يا ${name}! رسالتك محفوظة محلياً (تجريبي).`;
      resultEl.style.color = '#8ef6d6';
      contactForm.reset();
    });
  }
})();

// 4. SLIDER LOGIC
(function () {
  const slides = document.querySelectorAll('.slide');
  const next = document.getElementById('next');
  const prev = document.getElementById('prev');

  if (slides.length === 0 || !next || !prev) return;

  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === index);
    });
  }

  showSlide(current);

  next.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  });

  prev.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  });

  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 5000);

})();


// 5. AUTH UI HANDLER & LOGOUT LOGIC (Header update)
(function () {
  const logoutBtn = document.getElementById('logout-btn');
  const profileLink = document.getElementById('user-profile-link');
  const isLoggedIn = localStorage.getItem('edu_is_logged_in') === 'true';
  const loginLinks = document.querySelectorAll('.nav-list a[href="login.html"], .nav-list a[href="signup.html"]');

  function updateAuthUI() {
    if (!logoutBtn || !profileLink) return;
    const userData = JSON.parse(localStorage.getItem('edu_user_data') || '{}');

    if (isLoggedIn) {
      logoutBtn.style.display = 'inline-flex';

      // If admin, show Admin Panel link instead of just #
      if (userData.role === 'admin') {
        profileLink.textContent = 'Admin Panel';
        profileLink.href = 'admin.html';
      } else {
        profileLink.textContent = 'Profile';
        profileLink.href = 'profile.html';
      }

      loginLinks.forEach(link => {
        if (link.parentElement) {
          link.parentElement.style.display = 'none';
        }
      });
    } else {
      logoutBtn.style.display = 'none';
      profileLink.textContent = 'Login'; // Fallback
      profileLink.href = 'login.html';
      loginLinks.forEach(link => {
        if (link.parentElement) {
          link.parentElement.style.display = 'block';
        }
      });
    }
  }

  function handleLogout(e) {
    e.preventDefault();
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      localStorage.removeItem('edu_is_logged_in');
      localStorage.removeItem('edu_current_user_email');

      const userEmail = localStorage.getItem('edu_current_user_email');
      if (userEmail) localStorage.removeItem(`edu_purchased_${userEmail}`);

      window.location.href = 'index.html';
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  updateAuthUI();
})();


// 6. START NOW BUTTON SCROLL LOGIC
(function () {
  const startBtn = document.getElementById('start-now-btn');

  if (startBtn) {
    startBtn.addEventListener('click', function () {
      const targetSection = document.getElementById('popular');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
})();


// 7. PAID ACCESS SIMULATION LOGIC (نظام الدفع)
function checkCourseAccess(courseId) {
  const userEmail = localStorage.getItem('edu_current_user_email');
  if (!userEmail) return false;
  const purchasedCourses = JSON.parse(localStorage.getItem(`edu_purchased_${userEmail}`) || '[]');
  return purchasedCourses.includes(courseId);
}

function purchaseCourseFinalize(courseId, courseName) {
  const userEmail = localStorage.getItem('edu_current_user_email');
  if (!userEmail) {
    alert('حدث خطأ. الرجاء تسجيل الدخول.');
    window.location.href = 'login.html';
    return;
  }

  const purchasedCourses = JSON.parse(localStorage.getItem(`edu_purchased_${userEmail}`) || '[]');
  if (!purchasedCourses.includes(courseId)) {
    purchasedCourses.push(courseId);
    localStorage.setItem(`edu_purchased_${userEmail}`, JSON.stringify(purchasedCourses));
  }

  localStorage.removeItem('course_to_pay_for');

  alert(`تمت عملية الدفع بنجاح! يمكنك الآن مشاهدة دورة "${courseName}".`);
  window.location.href = 'course-detail-limits.html';
}

function purchaseCourse(courseId, courseName) {
  if (checkCourseAccess(courseId)) return;

  const userEmail = localStorage.getItem('edu_current_user_email');
  if (!userEmail) {
    alert('الرجاء تسجيل الدخول أولاً لإتمام عملية الشراء.');
    window.location.href = 'login.html';
    return false;
  }

  localStorage.setItem('course_to_pay_for', JSON.stringify({ id: courseId, name: courseName }));

  window.location.href = 'payment.html';
  return true;
}


// دالة لمعالجة الدخول للصفحة وتشغيل المنطق
(function () {
  const accessBtn = document.getElementById('access-control-btn');
  const userLoggedIn = localStorage.getItem('edu_is_logged_in') === 'true';

  if (accessBtn) {
    const courseId = accessBtn.getAttribute('data-course-id');
    const courseName = accessBtn.getAttribute('data-course-name');

    const hasAccess = checkCourseAccess(courseId);

    if (hasAccess) {
      return;
    }

    if (userLoggedIn) {
      // ✅ تم دمج كود Try/Catch هنا لالتقاط أي خطأ يمنع التحويل
      accessBtn.textContent = 'شراء الدورة (99$)';
      accessBtn.addEventListener('click', (e) => {
        e.preventDefault();

        try {
          console.log("Attempting Purchase Redirection...");
          purchaseCourse(courseId, courseName);
        } catch (error) {
          console.error("Critical Purchase Error:", error);
          alert("حدث خطأ حرج! لم يتم التحويل. يرجى مراجعة Console.");
        }
      });
    } else {
      accessBtn.textContent = 'تسجيل الدخول للمشاهدة';
      accessBtn.href = 'login.html';
      accessBtn.classList.add('ghost');
    }
  }
})();