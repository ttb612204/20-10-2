/**
 * GÓC CHILL 20.10 — MAIN CONTROLLER
 * Concept 4: Góc học tập & Cuốn sổ tay bạn bè ấm áp, mộc mạc, không sến
 * Dành tặng: Trịnh Thị Mỹ Duyên
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. DATA: 5 ẢNH KỶ NIỆM (BASE64 AN TOÀN TRỰC TIẾP TỪ PHOTOS-DATA.JS)
  // =========================================================================
  const photosList = window.MY_DUYEN_PHOTOS || [];

  function initPhotosDOM() {
    if (!window.MY_DUYEN_PHOTOS || window.MY_DUYEN_PHOTOS.length === 0) return;
    
    // Inject Avatar
    const avatar = document.querySelector('.profile-avatar-placeholder img');
    if (avatar && window.MY_DUYEN_PHOTOS[0]) {
      avatar.src = window.MY_DUYEN_PHOTOS[0].src;
    }

    // Inject 5 polaroid cards
    window.MY_DUYEN_PHOTOS.forEach((item, idx) => {
      const cardImg = document.querySelector(`.scrap-polaroid-frame[data-lightbox-idx="${idx}"] img`);
      if (cardImg) {
        cardImg.src = item.src;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhotosDOM);
  } else {
    initPhotosDOM();
  }

  // Danh sách quẻ may mắn 20/10 hài hước, bạn bè
  const fortuneCards = [
    {
      tag: 'Quẻ Đại Cát 🌟',
      quote: 'Hôm nay 20/10 bạn được cấp quyền lười biếng 100%, từ chối mọi deadline mà không ai dám trách!'
    },
    {
      tag: 'Quẻ Tài Lộc 💰',
      quote: 'Dự báo tháng này ví tiền sẽ dày lên bất ngờ. Khi nào giàu nhớ người bạn này nha!'
    },
    {
      tag: 'Quẻ Ăn Uống 🧋',
      quote: 'Hôm nay auto được khao ăn ngon, một ly trà sữa full thạch trân châu đường đen!'
    },
    {
      tag: 'Quẻ Nhan Sắc 🌸',
      quote: 'Xinh đẹp tự nhiên không cần filter. Cứ cười nhiều là tự khắc tỏa sáng 10 điểm!'
    },
    {
      tag: 'Quẻ Tâm Trạng ☕',
      quote: 'Mọi âu lo phiền muộn xin mời tự động bay màu trong vòng một nốt nhạc. Hôm nay chỉ chill thôi!'
    },
    {
      tag: 'Quẻ Tình Bạn ✌️',
      quote: 'Bạn có một người bạn siêu tâm lý, vừa kỳ công dựng hẳn trang web này để chúc mừng bạn đó!'
    },
    {
      tag: 'Quẻ Sức Khỏe 🌿',
      quote: 'Ăn ngon ngủ kỹ, bớt thức khuya lướt điện thoại để giữ năng lượng rạng ngời mỗi ngày nhé!'
    }
  ];

  // =========================================================================
  // 2. NOTEBOOK PAGINATION CONTROLLER
  // =========================================================================
  const pages = document.querySelectorAll('.notebook-page');
  const tabs = document.querySelectorAll('.tab-item');
  const btnPrev = document.getElementById('btn-page-prev');
  const btnNext = document.getElementById('btn-page-next');
  const currPageDisplay = document.getElementById('current-page-num');
  const totalPageDisplay = document.getElementById('total-page-num');
  const btnFlipNext = document.querySelector('.btn-flip-next');

  let currentPageIdx = 0;
  const totalPages = pages.length;

  if (totalPageDisplay) totalPageDisplay.textContent = totalPages;

  function goToPage(idx) {
    if (idx < 0 || idx >= totalPages) return;
    currentPageIdx = idx;

    // Cập nhật hiển thị trang
    pages.forEach((page, i) => {
      if (i === currentPageIdx) {
        page.classList.add('is-active');
      } else {
        page.classList.remove('is-active');
      }
    });

    // Cập nhật tab bên cạnh
    tabs.forEach((tab) => {
      const pageNum = parseInt(tab.getAttribute('data-page'), 10);
      if (pageNum === currentPageIdx) {
        tab.classList.add('is-active');
      } else {
        tab.classList.remove('is-active');
      }
    });

    // Cập nhật số trang & trạng thái nút bấm
    if (currPageDisplay) currPageDisplay.textContent = currentPageIdx + 1;
    if (btnPrev) btnPrev.disabled = currentPageIdx === 0;
    if (btnNext) btnNext.disabled = currentPageIdx === totalPages - 1;

    // Cuộn nhẹ lên đầu trang sổ nếu đang ở màn hình nhỏ
    if (window.innerWidth < 768) {
      const notebook = document.querySelector('.notebook-body');
      if (notebook) {
        notebook.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  // Sự kiện nút chuyển trang
  if (btnPrev) {
    btnPrev.addEventListener('click', () => goToPage(currentPageIdx - 1));
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => goToPage(currentPageIdx + 1));
  }
  if (btnFlipNext) {
    btnFlipNext.addEventListener('click', () => goToPage(1));
  }

  // Sự kiện click tab chỉ mục
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetIdx = parseInt(tab.getAttribute('data-page'), 10);
      goToPage(targetIdx);
    });
  });

  // Điều khiển bằng phím mũi tên bàn phím
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goToPage(currentPageIdx + 1);
    else if (e.key === 'ArrowLeft') goToPage(currentPageIdx - 1);
  });

  // =========================================================================
  // 3. AUDIO & LO-FI PLAYER CONTROLLER
  // =========================================================================
  const bgAudio = document.getElementById('bg-audio');
  const playerWidget = document.getElementById('player-widget');
  const playerStateText = document.getElementById('player-state-text');
  let isPlaying = false;

  function updatePlayerUI(playing) {
    isPlaying = playing;
    if (playerWidget) {
      if (playing) playerWidget.classList.add('is-playing');
      else playerWidget.classList.remove('is-playing');
    }
    if (playerStateText) {
      playerStateText.textContent = playing ? 'Đang phát Lo-Fi ♫' : 'Chạm để phát nhạc';
    }
  }

  function toggleAudio() {
    if (!bgAudio) return;
    if (isPlaying) {
      bgAudio.pause();
      updatePlayerUI(false);
    } else {
      bgAudio.volume = 0.55;
      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          updatePlayerUI(true);
        }).catch(() => {
          // Trình duyệt chặn autoplay khi chưa có thao tác người dùng
        });
      }
    }
  }

  if (playerWidget) {
    playerWidget.addEventListener('click', toggleAudio);
  }

  // Tự động phát nhạc khi người dùng click lần đầu vào trang
  function enableAudioOnFirstTouch() {
    if (!isPlaying && bgAudio) {
      bgAudio.volume = 0.55;
      bgAudio.play().then(() => {
        updatePlayerUI(true);
      }).catch(() => {});
    }
    document.removeEventListener('click', enableAudioOnFirstTouch);
  }
  document.addEventListener('click', enableAudioOnFirstTouch, { once: true });

  // =========================================================================
  // 4. DESK LAMP & RAIN OVERLAY TOGGLES
  // =========================================================================
  const btnLamp = document.getElementById('btn-lamp');
  const lampGlow = document.getElementById('lamp-glow-effect');
  const lampStatus = document.getElementById('lamp-status');
  let isLampOn = true;

  if (btnLamp && lampGlow) {
    btnLamp.addEventListener('click', () => {
      isLampOn = !isLampOn;
      if (isLampOn) {
        lampGlow.classList.add('is-on');
        lampStatus.textContent = 'Bật';
      } else {
        lampGlow.classList.remove('is-on');
        lampStatus.textContent = 'Tắt';
      }
    });
  }

  const btnRain = document.getElementById('btn-rain');
  const rainLayer = document.getElementById('rain-layer');
  const rainStatus = document.getElementById('rain-status');
  let isRainOn = false;

  if (btnRain && rainLayer) {
    btnRain.addEventListener('click', () => {
      isRainOn = !isRainOn;
      if (isRainOn) {
        rainLayer.classList.add('is-active');
        rainStatus.textContent = 'Bật';
      } else {
        rainLayer.classList.remove('is-active');
        rainStatus.textContent = 'Tắt';
      }
    });
  }

  // =========================================================================
  // 5. FORTUNE DRAW MODAL (BỐC QUẺ 20/10)
  // =========================================================================
  const btnFortune = document.getElementById('btn-fortune');
  const fortuneModal = document.getElementById('fortune-modal');
  const btnCloseFortune = document.getElementById('btn-close-fortune');
  const btnDrawRandom = document.getElementById('btn-draw-random');
  const fortuneTagType = document.getElementById('fortune-tag-type');
  const fortuneQuoteText = document.getElementById('fortune-quote-text');
  const fortuneResultBox = document.getElementById('fortune-result-container');

  function drawRandomFortune() {
    if (!fortuneCards || fortuneCards.length === 0) return;
    const randomItem = fortuneCards[Math.floor(Math.random() * fortuneCards.length)];

    // Hiệu ứng giật nhẹ khi xáo quẻ
    if (fortuneResultBox) {
      fortuneResultBox.style.transform = 'scale(0.96)';
      setTimeout(() => {
        if (fortuneTagType) fortuneTagType.textContent = randomItem.tag;
        if (fortuneQuoteText) fortuneQuoteText.textContent = `"${randomItem.quote}"`;
        fortuneResultBox.style.transform = 'scale(1)';
      }, 150);
    }
  }

  if (btnFortune && fortuneModal) {
    btnFortune.addEventListener('click', () => {
      fortuneModal.classList.add('is-open');
      drawRandomFortune();
    });
  }

  if (btnCloseFortune && fortuneModal) {
    btnCloseFortune.addEventListener('click', () => {
      fortuneModal.classList.remove('is-open');
    });
  }

  if (btnDrawRandom) {
    btnDrawRandom.addEventListener('click', drawRandomFortune);
  }

  // Đóng modal khi bấm ra ngoài nền đen
  if (fortuneModal) {
    fortuneModal.addEventListener('click', (e) => {
      if (e.target === fortuneModal) fortuneModal.classList.remove('is-open');
    });
  }

  // =========================================================================
  // 6. INTERACTIVE COFFEE CUP BLESSING
  // =========================================================================
  const cupTrigger = document.getElementById('cup-blessing-trigger');
  const secretCupMsg = document.getElementById('cup-secret-revealed');

  if (cupTrigger && secretCupMsg) {
    cupTrigger.addEventListener('click', () => {
      if (secretCupMsg.style.display === 'none') {
        secretCupMsg.style.display = 'block';
      } else {
        secretCupMsg.style.display = 'none';
      }
    });
  }

  // =========================================================================
  // 7. LIGHTBOX FULLSCREEN ZOOM
  // =========================================================================
  const polaroids = document.querySelectorAll('.scrap-polaroid-frame');
  const lightboxModal = document.getElementById('lightbox-modal');
  const btnCloseLightbox = document.getElementById('btn-close-lightbox');
  const lightboxDisplayImg = document.getElementById('lightbox-display-img');
  const lightboxDisplayCaption = document.getElementById('lightbox-display-caption');
  const btnLightboxPrev = document.getElementById('btn-lightbox-prev');
  const btnLightboxNext = document.getElementById('btn-lightbox-next');

  let currentLightboxIdx = 0;

  function openLightbox(idx) {
    if (idx < 0 || idx >= photosList.length) return;
    currentLightboxIdx = idx;
    const item = photosList[currentLightboxIdx];

    if (lightboxDisplayImg) lightboxDisplayImg.src = item.src;
    if (lightboxDisplayCaption) lightboxDisplayCaption.textContent = item.caption;
    if (lightboxModal) lightboxModal.classList.add('is-open');
  }

  polaroids.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-lightbox-idx'), 10);
      openLightbox(idx);
    });
  });

  if (btnCloseLightbox && lightboxModal) {
    btnCloseLightbox.addEventListener('click', () => {
      lightboxModal.classList.remove('is-open');
    });
  }

  if (btnLightboxPrev) {
    btnLightboxPrev.addEventListener('click', () => {
      let nextIdx = currentLightboxIdx - 1;
      if (nextIdx < 0) nextIdx = photosList.length - 1;
      openLightbox(nextIdx);
    });
  }

  if (btnLightboxNext) {
    btnLightboxNext.addEventListener('click', () => {
      let nextIdx = currentLightboxIdx + 1;
      if (nextIdx >= photosList.length) nextIdx = 0;
      openLightbox(nextIdx);
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.remove('is-open');
    });
  }

  // Phím ESC đóng tất cả modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (fortuneModal) fortuneModal.classList.remove('is-open');
      if (lightboxModal) lightboxModal.classList.remove('is-open');
    }
  });

  // =========================================================================
  // 8. AMBIENT DUST MOTES CANVAS
  // =========================================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(35, Math.floor(width / 35));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.35 - 0.1,
        opacity: Math.random() * 0.45 + 0.15
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 230, 180, ${p.opacity})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(255, 200, 120, 0.4)';
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

})();
