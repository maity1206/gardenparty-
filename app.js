/* ==========================================================================
   The Garden Party | App Logic (Vanilla JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ブラウザの自動スクロール復元機能を無効化（リロード時の意図しないスクロールジャンプ防止）
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // ==========================================
    // 1. オープニング演出 (インビテーション封筒の開閉)
    // ==========================================
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const mainContent = document.getElementById('main-content');


    if (envelopeOverlay && mainContent) {
        envelopeOverlay.addEventListener('click', () => {
            // 封筒にフェードアウトクラスを付与
            envelopeOverlay.classList.add('fade-out');

            // メインコンテンツを表示
            mainContent.classList.remove('hidden');
            window.scrollTo(0, 0);

            // アニメーション完了後にオーバーレイ要素をDOMから非表示にする
            setTimeout(() => {
                envelopeOverlay.style.display = 'none';
            }, 1000);
        });
    }

    // Exploreボタンのスクロール制御
    const scrollToAbout = document.getElementById('scroll-to-about');
    if (scrollToAbout) {
        scrollToAbout.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ==========================================
    // 2. ときめきのガラスドーム (開閉ギミック & きらめき演出)
    // ==========================================
    const glassCards = document.querySelectorAll('.glass-card');
    const experienceSection = document.getElementById('experience');

    // 背景色切り替え用の定義（Teanoirデザインに調和する淡く透き通るようなパステルカラー）
    const backgroundColors = {
        'case-blue': '#E0F2FE',  /* バタフライピー・ブルーに調和する淡い青 */
        'case-red': '#FFE4E6',   /* ベリー紅茶に調和する淡いピンク */
        'case-gold': '#FEF3C7',  /* 太陽の光に調和する淡いゴールド */
        'default': '#faf9f6'     /* デフォルトのリネンホワイト */
    };

    glassCards.forEach(card => {
        card.addEventListener('click', () => {
            const isOpen = card.classList.contains('is-open');

            // 他のすべてのガラスケースを一度閉じる (アコーディオン風にして背景色との競合を防ぐ)
            glassCards.forEach(c => c.classList.remove('is-open'));

            if (!isOpen) {
                // 新しくクリックされたケースを開く
                card.classList.add('is-open');

                // 【特別演出 ①】開いたケースに応じてセクション背景色を優雅に変化
                if (experienceSection) {
                    const cardId = card.id;
                    experienceSection.style.backgroundColor = backgroundColors[cardId] || backgroundColors['default'];
                }

                // 【特別演出 ②】光のきらめき粒子（パーティクル）を生成
                createSparkles(card);
            } else {
                // すでに開いていたものを閉じる場合
                if (experienceSection) {
                    experienceSection.style.backgroundColor = backgroundColors['default'];
                }
            }
        });
    });

    /**
     * ガラスケースが開いた瞬間に、きらきらと輝くゴールドの光の粒子を動的に生成する関数
     * (外部ライブラリを一切使わず、軽量で高速なピュアJSパーティクルエフェクト)
     */
    function createSparkles(cardElement) {
        const domeWrapper = cardElement.querySelector('.glass-dome-wrapper');
        if (!domeWrapper) return;

        // 8つの星・ゴールド光粒子を動的生成
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');

            // 粒子のランダムな飛び散り方向と距離を設定
            const angle = (i * 45) + (Math.random() * 20 - 10); // 放射状に均等分散
            const velocity = 50 + Math.random() * 60; // 飛び散る距離
            const size = 6 + Math.random() * 8; // サイズのバラつき

            // CSSカスタムプロパティを割り当て
            sparkle.style.setProperty('--dx', `${Math.cos(angle * Math.PI / 180) * velocity}px`);
            sparkle.style.setProperty('--dy', `${Math.sin(angle * Math.PI / 180) * velocity - 20}px`);
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;

            // スパークルの初期位置をドームの中央付近に配置
            sparkle.style.position = 'absolute';
            sparkle.style.bottom = '50px';
            sparkle.style.left = 'calc(50% - 6px)';
            sparkle.style.zIndex = '12';
            sparkle.style.borderRadius = '50%';

            // 太陽の輝きを象徴するゴールドグラデーション
            sparkle.style.background = 'radial-gradient(circle, #FFF 20%, #D4AF37 100%)';
            sparkle.style.boxShadow = '0 0 10px #FEF3C7, 0 0 20px #F59E0B';

            // アニメーションスタイルの付与
            sparkle.style.animation = 'sparkleOut 1.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards';

            domeWrapper.appendChild(sparkle);

            // アニメーション終了後にDOMから削除 (メモリリーク防止)
            setTimeout(() => {
                sparkle.remove();
            }, 1200);
        }
    }

    // ==========================================
    // 3. RSVP (出席確認) フォーム制御 & セキュリティ対策
    // ==========================================
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    const displayName = document.getElementById('display-name');
    const resetFormBtn = document.getElementById('reset-form-btn');

    if (rsvpForm && rsvpSuccess) {
        rsvpForm.addEventListener('submit', (e) => {
            // ページの再読み込みを完全に防止
            e.preventDefault();

            // 入力要素の取得
            const nameInput = document.getElementById('guest-name');
            const emailInput = document.getElementById('guest-email');
            const messageInput = document.getElementById('guest-message');

            // @ts-ignore
            const guestName = nameInput ? nameInput.value.trim() : '';
            // @ts-ignore
            const guestEmail = emailInput ? emailInput.value.trim() : '';
            // @ts-ignore
            const guestMessage = messageInput ? messageInput.value.trim() : '';

            if (guestName) {
                // 【セキュリティ対策の要】innerHTMLは絶対に使わず、textContentを使用！
                // これにより、もし名前に「<script>」などの不正タグが入力されても無害な文字に変換（エスケープ）されます。
                if (displayName) {
                    displayName.textContent = guestName;
                }

                // ローカルストレージに安全に保存する
                const reservationData = {
                    name: guestName,
                    email: guestEmail,
                    message: guestMessage,
                    date: new Date().toISOString()
                };

                try {
                    localStorage.setItem('garden_party_rsvp', JSON.stringify(reservationData));
                } catch (error) {
                    console.warn('ローカルストレージへの書き込みに失敗しました:', error);
                }

                // フォーム送信完了アニメーション演出
                rsvpForm.classList.add('hidden');
                rsvpSuccess.classList.remove('hidden');
            }
        });
    }

    // 「戻る」ボタンでフォームをリセットして入力画面に戻る処理
    if (resetFormBtn && rsvpForm && rsvpSuccess) {
        resetFormBtn.addEventListener('click', () => {
            // @ts-ignore
            rsvpForm.reset();
            rsvpSuccess.classList.add('hidden');
            rsvpForm.classList.remove('hidden');
        });
    }

        // ==========================================
    // 5. 人生ストーリー漫画シアターセクション（マンガ動画プレイヤー）ロジック
    // ==========================================
    const mangaPlayBtn = document.getElementById('manga-play-btn');
    const mangaPrevBtn = document.getElementById('manga-prev-btn');
    const mangaNextBtn = document.getElementById('manga-next-btn');
    const mangaProgressFill = document.getElementById('manga-progress-fill');
    const mangaTimecode = document.getElementById('manga-timecode');
    const mangaMuteBtn = document.getElementById('manga-mute-btn');
    const mangaEqWaves = document.getElementById('manga-eq-waves');

    // モード切り替えボタン
    const storyModeBtn = document.getElementById('manga-mode-story-btn');
    const snappyModeBtn = document.getElementById('manga-mode-snappy-btn');

    let activeMode = 'story'; // 'story' (24枚スライド) または 'snappy' (32枚スライド)
    let isPlaying = false;
    let isMuted = false;
    let currentSlide = 0;
    const totalDuration = 168; // 24枚のスライドを合計168秒（各スライド7秒）で再生
    let numSlides = 24;
    let slideDuration = 7; // 各スライドの表示秒数（7秒）
    let currentTime = 0;
    let progressInterval = null;
    let typingTimers = [];
    let audioCtx = null;

    // BGMシンセサイザーの制御変数
    let bgmTimer = null;
    let bgmStep = 0;
    const bgmChords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7 (陽だまりのバラ - 優美な香り)
        [349.23, 440.00, 523.25, 659.25], // Fmaj7 (可憐なすみれ - そよ風のワルツ)
        [329.63, 392.00, 493.88, 659.25], // Em7 (ハーブテラス - 深いやすらぎ)
        [440.00, 523.25, 659.25, 880.00], // Am7 (花たちのささやき - 心のオアシス)
        [293.66, 349.23, 440.00, 523.25], // Dm7 (木漏れ日のダンス - やさしい光)
        [392.00, 440.00, 493.88, 587.33]  // G7 / Gmaj7 (木漏れ日の終わり)
    ];

    function startBGM() {
        if (isMuted) return;
        if (bgmTimer) return; // 二重起動防止

        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        bgmTimer = setInterval(() => {
            let climaxLevel = 1;
            if (currentSlide >= 4 && currentSlide < 8) climaxLevel = 2;
            else if (currentSlide >= 8 && currentSlide < 12) climaxLevel = 3;
            else if (currentSlide >= 12) climaxLevel = 4;

            const chord = bgmChords[bgmStep % bgmChords.length];
            
            chord.forEach((freq, idx) => {
                setTimeout(() => {
                    playPianoNote(freq, climaxLevel, idx);
                }, idx * 100);
            });

            if (climaxLevel >= 2) {
                playTenseHeartbeat(chord[0] / 2, climaxLevel);
            }

            bgmStep++;
        }, 1500);
    }

    function playPianoNote(baseFreq, climaxLevel, noteIndex) {
        if (!audioCtx || audioCtx.state === 'suspended') return;
        try {
            const now = audioCtx.currentTime;
            const pianoOsc = audioCtx.createOscillator();
            const pianoGain = audioCtx.createGain();
            const pianoFilter = audioCtx.createBiquadFilter();

            pianoOsc.type = 'sine';
            let pitchMultiplier = 1.0;
            if (climaxLevel === 4) pitchMultiplier = 3.0; // 壮大なオクターブブレンド

            pianoOsc.frequency.setValueAtTime(baseFreq * pitchMultiplier, now);

            pianoFilter.type = 'lowpass';
            pianoFilter.frequency.setValueAtTime(1500, now);

            pianoGain.gain.setValueAtTime(0, now);
            const pianoVol = 0.016 + (climaxLevel * 0.004);
            pianoGain.gain.linearRampToValueAtTime(pianoVol, now + 0.01); // 打鍵感のある鋭いアタック
            
            const decayTime = 1.8 + (climaxLevel * 0.3);
            pianoGain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

            pianoOsc.connect(pianoFilter);
            pianoFilter.connect(pianoGain);
            pianoGain.connect(audioCtx.destination);

            pianoOsc.start(now);
            pianoOsc.stop(now + decayTime + 0.1);

            // --- 4. 映画館の広大な反響・シマー (Cinematic Shimmer Reverb) ---
            if (climaxLevel >= 3 && (noteIndex % 4 === 0 || noteIndex % 4 === 2)) {
                const echoOsc = audioCtx.createOscillator();
                const echoGain = audioCtx.createGain();

                echoOsc.type = 'sine';
                echoOsc.frequency.setValueAtTime(baseFreq * 6.0, now + 0.15); // 幻想的な高域エコー

                echoGain.gain.setValueAtTime(0, now + 0.15);
                echoGain.gain.linearRampToValueAtTime(0.004, now + 0.25);
                echoGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

                echoOsc.connect(echoGain);
                echoGain.connect(audioCtx.destination);

                echoOsc.start(now + 0.15);
                echoOsc.stop(now + 1.6);
            }

        } catch (e) {
            // Ignore
        }
    }

    // 緊迫感を高めるピチカート（弦の撥弦）の鼓動音
    function playTenseHeartbeat(rootFreq, climaxLevel) {
        if (!audioCtx || audioCtx.state === 'suspended') return;

        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            // 緊迫感のあるチェロ・バイオリンのピチカート（Pizzicato）をシミュレート
            osc.type = 'triangle';
            // チェロの中音域で緊迫感を演出 (ベース音と同じ高さ)
            osc.frequency.setValueAtTime(rootFreq, now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(450, now); // こもった木の響き

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.012 + (climaxLevel * 0.004), now + 0.005); // 鋭く弾くアタック
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14); // 0.14秒で素早く消音し、スタッカートを表現

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) {
            // Ignore
        }
    }

    function stopBGM() {
        if (bgmTimer) {
            clearInterval(bgmTimer);
            bgmTimer = null;
        }
    }


    // 現在のモードのアクティブなスライド群を取得
    function getActiveSlides() {
        return document.querySelectorAll(activeMode === 'story' ? '.slide-story' : '.slide-snappy');
    }

    // プレイヤーの初期化・再起動
    function initPlayer() {
        const slides = getActiveSlides();
        numSlides = slides.length;
        slideDuration = totalDuration / numSlides; // story: 7s
        
        currentSlide = numSlides - 1; // 待機画面を最後のお出迎えスライドにする
        currentTime = 0;
        
        // すべてのスライドを一度隠す
        document.querySelectorAll('.manga-slide').forEach(slide => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });

        // ドットナビを動的に構築
        buildDots();

        // スライド表示(デフォルトで最後のスライド/カバーを表示)
        showSlide(numSlides - 1);

        // 再生中なら再生タイマー起動
        const screen = document.querySelector('.manga-screen');
        if (isPlaying) {
            if (screen) screen.classList.add('playing');
            startAutoplayTimer();
            startBGM();
        } else {
            if (screen) screen.classList.remove('playing');
            updateProgressUI();
            stopBGM();
        }
    }

    // ドットナビゲーションの動的生成
    function buildDots() {
        const dotsContainer = document.getElementById('manga-dots');
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';

        for (let i = 0; i < numSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('manga-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('data-slide', i.toString());

            dot.addEventListener('click', () => {
                showSlide(i);
            });

            dotsContainer.appendChild(dot);
        }
    }

    // スライドの表示切り替え
    function showSlide(index) {
        const slides = getActiveSlides();
        if (slides.length === 0) return;

        // 範囲制限
        if (index < 0) index = numSlides - 1;
        if (index >= numSlides) index = 0;

        currentSlide = index;
        
        // 待機状態で最後のお出迎えスライドを表示している時は進捗時間を0秒に保つ
        if (index === numSlides - 1 && !isPlaying && currentTime === 0) {
            currentTime = 0;
        } else {
            currentTime = currentSlide * slideDuration;
        }

        // スライドのアクティブ化
        slides.forEach((slide, idx) => {
            if (idx === index) {
                slide.style.display = 'flex';
                slide.classList.add('active');
                
                // 画像のKen Burnsアニメーションをリセットして再起動させる
                const img = slide.querySelector('.manga-img');
                if (img) {
                    const src = img.src;
                    img.src = ''; // 一度クリア
                    img.src = src; // 再設定でアニメーション再起動
                }
            } else {
                slide.style.display = 'none';
                slide.classList.remove('active');
            }
        });

        // ドットのアクティブ化
        const dots = document.querySelectorAll('#manga-dots .manga-dot');
        dots.forEach((dot, idx) => {
            if (idx === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // テキストのタイピング開始
        startTyping(index);

        // スライド切替時の和音チャイム再生
        playSlideChime(index);

        // プログレスバーと時間表示の更新
        updateProgressUI();
    }

    // タイピング風アニメーションの制御
    function startTyping(index) {
        // 既存のタイピングタイマーをクリア
        typingTimers.forEach(timer => clearTimeout(timer));
        typingTimers = [];

        const slides = getActiveSlides();
        const activeSlide = slides[index];
        if (!activeSlide) return;

        // すべてのナレーション文字を非表示にリセット
        document.querySelectorAll('.manga-text').forEach(p => {
            p.innerHTML = '';
            p.classList.remove('typing-complete');
        });

        const p = activeSlide.querySelector('.manga-text');
        if (!p) return;

        const rawText = p.getAttribute('data-text') || '';
        p.innerHTML = '';
        let charIndex = 0;
        
        // 各スライドが7秒になったため、文字送りを35msにしてより読む時間を確保します
        const typeDelay = 35;

        function typeChar() {
            if (charIndex < rawText.length) {
                const char = rawText.charAt(charIndex);
                if (char === '\n') {
                    p.innerHTML += '<br>';
                } else {
                    p.innerHTML += char;
                }
                charIndex++;
                const timer = setTimeout(typeChar, typeDelay);
                typingTimers.push(timer);
            } else {
                p.classList.add('typing-complete');
            }
        }
        typeChar();
    }

    // プログレスバーと時間のUI表示更新
    function updateProgressUI() {
        const progressPercent = (currentTime / totalDuration) * 100;
        if (mangaProgressFill) {
            mangaProgressFill.style.width = `${progressPercent}%`;
        }

        // タイムコードのフォーマット（分:秒）
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        const totalMinutes = Math.floor(totalDuration / 60);
        const totalSeconds = Math.floor(totalDuration % 60);

        if (mangaTimecode) {
            mangaTimecode.textContent = `${minutes}:${String(seconds).padStart(2, '0')} / ${totalMinutes}:${String(totalSeconds).padStart(2, '0')}`;
        }
    }

    // 自動再生のタイマー制御
    function startAutoplayTimer() {
        stopAutoplayTimer(); // 二重起動防止

        progressInterval = setInterval(() => {
            currentTime += 0.1; // 100msごとに0.1秒進める
            
            // 次のスライドへ自動遷移する閾値チェック
            const nextSlideThreshold = (currentSlide + 1) * slideDuration;
            if (currentTime >= nextSlideThreshold) {
                if (currentSlide < numSlides - 1) {
                    currentSlide++;
                    showSlide(currentSlide);
                } else {
                    // 終わりまで行ったら最初に戻る
                    currentTime = 0;
                    showSlide(0);
                }
            } else {
                updateProgressUI();
            }
        }, 100);
    }

    // タイマー停止
    function stopAutoplayTimer() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    // 再生・一時停止のトグル
    function togglePlay() {
        isPlaying = !isPlaying;

        if (isPlaying) {
            if (mangaPlayBtn) {
                mangaPlayBtn.innerHTML = '<span class="play-icon">⏸ Pause Movie</span>';
                mangaPlayBtn.style.backgroundColor = 'var(--color-primary-dark)';
            }
            if (mangaEqWaves && !isMuted) {
                mangaEqWaves.classList.add('active');
            }
            // 待機画面（お出迎えカバー）の状態で再生を押した場合、最初のスライドから再生をスタート
            if (currentSlide === numSlides - 1 && currentTime === 0) {
                showSlide(0);
            }
            startAutoplayTimer();
            startBGM(); // BGM開始
        } else {
            if (mangaPlayBtn) {
                mangaPlayBtn.innerHTML = '<span class="play-icon">▶ Play Movie</span>';
                mangaPlayBtn.style.backgroundColor = 'var(--color-primary)';
            }
            if (mangaEqWaves) {
                mangaEqWaves.classList.remove('active');
            }
            stopAutoplayTimer();
            stopBGM(); // BGM一時停止
        }
    }

    // BGM/音響のトグル制御
    function toggleMute() {
        isMuted = !isMuted;

        if (isMuted) {
            if (mangaMuteBtn) mangaMuteBtn.innerHTML = '<span class="speaker-icon">🔇 BGM OFF</span>';
            if (mangaEqWaves) mangaEqWaves.classList.remove('active');
            stopBGM(); // BGM停止
        } else {
            if (mangaMuteBtn) mangaMuteBtn.innerHTML = '<span class="speaker-icon">🔊 BGM ON</span>';
            if (mangaEqWaves && isPlaying) mangaEqWaves.classList.add('active');
            
            // 最初のチャイムを鳴らす
            playSlideChime(currentSlide);
            startBGM(); // BGM開始
        }
    }

    // Web Audio APIによるプレミアムな紙のページめくり音 ＆ クリスタルベル音再生
    function playSlideChime(slideIndex) {
        if (isMuted) return;

        try {
            // 初回クリック時にオーディオコンテキストを作成
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const now = audioCtx.currentTime;
            
            // --- 1. 紙のページめくり摩擦音 (Paper Swish Sound) ---
            const bufferSize = audioCtx.sampleRate * 0.45; // 0.45秒
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1; // 白ノイズ生成
            }

            const noiseNode = audioCtx.createBufferSource();
            noiseNode.buffer = buffer;

            const paperFilter = audioCtx.createBiquadFilter();
            paperFilter.type = 'lowpass';
            // スワイプされる紙の動的な音響変化を再現するために周波数を大きくスウィープ
            paperFilter.frequency.setValueAtTime(1400, now);
            paperFilter.frequency.exponentialRampToValueAtTime(120, now + 0.4);
            paperFilter.Q.setValueAtTime(2.0, now);

            const paperGain = audioCtx.createGain();
            paperGain.gain.setValueAtTime(0, now);
            paperGain.gain.linearRampToValueAtTime(0.015, now + 0.08); // 柔らかいアタック
            paperGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42); // 自然な減衰

            noiseNode.connect(paperFilter);
            paperFilter.connect(paperGain);
            paperGain.connect(audioCtx.destination);

            noiseNode.start(now);
            noiseNode.stop(now + 0.45);

            // --- 2. ページめくりと美しく調和する可憐な超高域クリスタルベル音 ---
            const osc = audioCtx.createOscillator();
            const bellGain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880.00, now); // A5 (透き通った高音)
            
            bellGain.gain.setValueAtTime(0, now);
            bellGain.gain.linearRampToValueAtTime(0.006, now + 0.01); 
            bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35); 
            
            osc.connect(bellGain);
            bellGain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.4);

        } catch (err) {
            console.warn('Web Audio の再生に失敗しました:', err);
        }
    }

    // ==========================================
    // イベントリスナーの登録
    // ==========================================

    // 再生ボタン
    if (mangaPlayBtn) {
        mangaPlayBtn.addEventListener('click', togglePlay);
    }

    // 音声ボタン
    if (mangaMuteBtn) {
        mangaMuteBtn.addEventListener('click', toggleMute);
    }

    // 前へボタン
    if (mangaPrevBtn) {
        mangaPrevBtn.addEventListener('click', () => {
            const targetIdx = currentSlide - 1;
            showSlide(targetIdx < 0 ? numSlides - 1 : targetIdx);
            if (isPlaying) {
                currentTime = currentSlide * slideDuration;
            }
        });
    }

    // 次へボタン
    if (mangaNextBtn) {
        mangaNextBtn.addEventListener('click', () => {
            const targetIdx = currentSlide + 1;
            showSlide(targetIdx >= numSlides ? 0 : targetIdx);
            if (isPlaying) {
                currentTime = currentSlide * slideDuration;
            }
        });
    }

    // 進捗バーのクリック制御
    const progressBar = document.querySelector('.manga-progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickRatio = clickX / width;
            const targetTime = clickRatio * totalDuration;

            // どのスライドに含まれるか判定
            const targetSlide = Math.min(Math.floor(targetTime / slideDuration), numSlides - 1);
            showSlide(targetSlide);

            // 現在時間の正確なアライメント
            currentTime = targetTime;
            updateProgressUI();
        });
    }

    // モード切り替えイベント
    if (storyModeBtn && snappyModeBtn) {
        storyModeBtn.addEventListener('click', () => {
            if (activeMode !== 'story') {
                activeMode = 'story';
                storyModeBtn.classList.add('active');
                snappyModeBtn.classList.remove('active');
                initPlayer();
            }
        });

        snappyModeBtn.addEventListener('click', () => {
            if (activeMode !== 'snappy') {
                activeMode = 'snappy';
                snappyModeBtn.classList.add('active');
                storyModeBtn.classList.remove('active');
                initPlayer();
            }
        });
    }

    // ==========================================
    // 6. IntersectionObserverによるスクロール検知＆BGM自動再生
    // ==========================================
    const storySection = document.getElementById('manga-story');
    if (storySection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // セクションに入ったらBGMを開始する
                    if (!isMuted) {
                        startBGM();
                        if (mangaEqWaves && isPlaying) {
                            mangaEqWaves.classList.add('active');
                        }
                    }
                } else {
                    // セクションから外れたらBGMを一時停止してリソースを抑える
                    stopBGM();
                    if (mangaEqWaves) {
                        mangaEqWaves.classList.remove('active');
                    }
                }
            });
        }, { threshold: 0.15 }); // 15%見えたらトリガー

        observer.observe(storySection);
    }

    // 初期起動
    initPlayer();

    // ==========================================
// 4. 【CSSアニメーションの追加】スパークル用のキーフレーム
// ==========================================
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
@keyframes sparkleOut {
    0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(var(--dx), var(--dy)) scale(0);
        opacity: 0;
    }
}
`;
document.head.appendChild(styleSheet);
});
