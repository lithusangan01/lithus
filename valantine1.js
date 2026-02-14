(() => {
      const SCENE_IDS = {
        login: 'scene-login',
        intro: 'scene-intro',
        celebrate: 'scene-celebrate',
        message: 'scene-message',
        memories: 'scene-memories'
      };

      const scenes = Array.from(document.querySelectorAll('.scene'));
      const loginForm = document.getElementById('loginForm');
      const loginUser = document.getElementById('loginUser');
      const loginPass = document.getElementById('loginPass');
      const loginError = document.getElementById('loginError');
      const logoutBtn = document.getElementById('logoutBtn');
      const envelope = document.getElementById('envelope');
      const letterCard = document.getElementById('letterCard');
      const letterClose = document.getElementById('letterClose');
      const bgMusic = document.getElementById('bgMusic');
      const LOGIN_USER = 'i love you';
      const LOGIN_PASS = '2615';

      let currentScene = 'login';
      let musicRetryBound = false;

      function normalizeUserName(value) {
        return value.trim().toLowerCase().replace(/\s+/g, ' ');
      }

      function showScene(targetId) {
        const activeSceneId = SCENE_IDS[targetId];
        if (!activeSceneId) {
          return;
        }

        currentScene = targetId;
        scenes.forEach((scene) => {
          scene.classList.toggle('active', scene.id === activeSceneId);
        });

        if (targetId !== 'message') {
          closeLetter();
        }
      }

      function openLetter() {
        if (!envelope || !letterCard) return;
        envelope.classList.add('open');
        letterCard.classList.add('show');
      }

      function closeLetter() {
        if (!envelope || !letterCard) return;
        envelope.classList.remove('open');
        letterCard.classList.remove('show');
      }

      function stopMusic() {
        if (!bgMusic) return;
        bgMusic.pause();
        bgMusic.currentTime = 0;
      }

      async function ensureMusic() {
        if (!bgMusic) return;
        bgMusic.loop = true;
        bgMusic.muted = false;
        bgMusic.volume = 1;
        if (!bgMusic.paused) return;

        try {
          await bgMusic.play();
        } catch (_) {
          if (loginError) {
            loginError.textContent = 'Song autoplay block aagudhu. Screen-la once click pannunga.';
          }

          if (!musicRetryBound) {
            musicRetryBound = true;
            const retryPlay = async () => {
              try {
                await bgMusic.play();
                if (loginError) loginError.textContent = '';
                musicRetryBound = false;
              } catch (_) {
                // keep silent; user can try again
              }
            };
            document.addEventListener('click', retryPlay, { once: true });
            document.addEventListener('touchstart', retryPlay, { once: true });
          }
        }
      }

      if (bgMusic) {
        bgMusic.addEventListener('error', () => {
          if (loginError) {
            loginError.textContent = 'Song load aagala. anbil-avan.mp4 same folder-la irukkanum.';
          }
        });
      }

      if (loginForm && loginUser && loginPass && loginError) {
        loginForm.addEventListener('submit', (event) => {
          event.preventDefault();
          const user = normalizeUserName(loginUser.value);
          const pass = loginPass.value.trim();

          if (user === LOGIN_USER && pass === LOGIN_PASS) {
            loginError.textContent = '';
            showScene('intro');
            ensureMusic();
            return;
          }

          loginError.textContent = 'Your Not My Girl';
        });

        [loginUser, loginPass].forEach((input) => {
          input.addEventListener('input', () => {
            loginError.textContent = '';
          });
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          showScene('login');
          if (loginForm) loginForm.reset();
          if (loginError) loginError.textContent = '';
          stopMusic();
        });
      }

      document.querySelectorAll('.js-next').forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.target;
          if (!target) return;
          showScene(target);
        });
      });

      document.querySelectorAll('.js-back').forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.target;
          if (!target) return;
          showScene(target);
          if (target === 'message') {
            openLetter();
          }
        });
      });

      if (envelope) {
        envelope.addEventListener('click', () => {
          if (!envelope.classList.contains('open')) {
            openLetter();
          }
        });
      }

      if (letterClose) {
        letterClose.addEventListener('click', (event) => {
          event.stopPropagation();
          closeLetter();
        });
      }

      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && currentScene === 'message') {
          closeLetter();
        }
      });

      window.addEventListener('beforeunload', () => {
        stopMusic();
      });

      function seedHearts() {
        const rain = document.getElementById('heartRain');
        if (!rain) return;
        rain.innerHTML = '';

        for (let i = 0; i < 34; i += 1) {
          const heart = document.createElement('span');
          heart.style.left = Math.random() * 100 + '%';
          heart.style.animationDuration = 6 + Math.random() * 6 + 's';
          heart.style.animationDelay = Math.random() * 8 + 's';
          heart.style.opacity = (0.25 + Math.random() * 0.55).toString();
          rain.appendChild(heart);
        }
      }

      function seedCelebrateLights() {
        const row = document.getElementById('loveLights');
        if (!row) return;
        row.innerHTML = '';

        const colors = ['#f95898', '#64d7ff', '#ffd45e', '#9feeb9', '#ff8cc3'];
        for (let i = 0; i < 20; i += 1) {
          const dot = document.createElement('span');
          dot.style.background = colors[i % colors.length];
          row.appendChild(dot);
        }
      }

      function seedBunting() {
        const bunting = document.getElementById('bunting');
        if (!bunting) return;
        bunting.innerHTML = '';

        for (let i = 0; i < 14; i += 1) {
          const tri = document.createElement('i');
          bunting.appendChild(tri);
        }
      }

      function seedBalloons() {
        const wrap = document.getElementById('floorBalloons');
        if (!wrap) return;
        wrap.innerHTML = '';

        const colors = ['#ff76ab', '#7adbf6', '#ffd86a', '#f4a1e2', '#98e8bf'];
        for (let i = 0; i < 9; i += 1) {
          const balloon = document.createElement('b');
          balloon.style.background = colors[i % colors.length];
          wrap.appendChild(balloon);
        }
      }

      seedHearts();
      seedCelebrateLights();
      seedBunting();
      seedBalloons();
      showScene('login');
    })();
