/* ==========================================================================
   The Garden Party | App Logic (Vanilla JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

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

});

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
