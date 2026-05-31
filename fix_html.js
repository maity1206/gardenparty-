const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Repair Concept section
const targetConcept = '普段、仕事で忙しく働いているあなた。あるいは、育児や家事に追われ、自分のことをつい後回しにしがちなママさん。そんな方々が、ひとときだけでも忙しい「役割」から離れ、「わたし自身」に戻るた            <!-- ⑤ 人生ストーリー漫画シアターセクション -->';
const replacementConcept = `普段、仕事で忙しく働いているあなた。あるいは、育児や家事に追われ、自分のことをつい後回しにしがちなママさん。そんな方々が、ひとときだけでも忙しい「役割」から離れ、「わたし自身」に戻るための場所として、このパーティーを企画しました。
                            </p>
                            <div class="highlight-box">
                                <strong>ときめきは、最高のセルフケア。</strong>
                                美しいものに囲まれ、香り高いハーブと、身体に優しいロースイーツを味わう。そんな特別な時間を過ごすことで、明日からの日々に優しさと元気をチャージできます。
                            </div>
                        </div>
                        <div class="about-visual">
                            <div class="art-frame">
                                <div class="art-inner">
                                    <span class="art-word">Teanoir</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ⑤ 人生ストーリー漫画シアターセクション -->`;

if (content.includes(targetConcept)) {
    content = content.replace(targetConcept, replacementConcept);
    console.log('Concept section successfully repaired!');
} else {
    console.log('Warning: Concept section target not found!');
}

// 2. Remove duplicate slideshow section
const targetDupStart = 'adge">Scene 13: 運命の出会いと一本の線 (48歳)</span>';
const targetDupEnd = '<!-- ⑥ プロフィールセクション (主催者紹介) -->';

const startIdx = content.indexOf(targetDupStart);
const endIdx = content.indexOf(targetDupEnd);

if (startIdx !== -1 && endIdx !== -1) {
    content = content.slice(0, startIdx) + '\n\n            ' + content.slice(endIdx);
    console.log('Duplicate slideshow section successfully cleaned up!');
} else {
    console.log(`Warning: Duplicate indices not found: start=${startIdx}, end=${endIdx}`);
}

// 3. Edit Scene 12 text to remove caregiver (介護) reference
const oldScene12Text = '娘の受験期と祖母の租界が重なり心身共に疲弊。「娘が大事で両親を大事に思えない複雑な気持ち」に悩み、何もできない自分自身に深く葛藤しました。';
const newScene12Text = '娘の中学受験期、仕事と家庭の両立で余裕がなく心身共に疲弊。「もっと娘に寄り添いたいのに、思うようにできない」と自分自身に深く葛藤しました。';

const oldScene12Alt = 'alt="介護と受験の葛藤"';
const newScene12Alt = 'alt="仕事と中学受験の葛藤"';

if (content.includes(oldScene12Text)) {
    content = content.replace(oldScene12Text, newScene12Text);
    console.log('Scene 12 text successfully updated to remove caregiver reference!');
} else {
    console.log('Warning: Scene 12 old text not found!');
}

if (content.includes(oldScene12Alt)) {
    content = content.replace(oldScene12Alt, newScene12Alt);
    console.log('Scene 12 alt attribute successfully updated!');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('index.html fully and cleanly updated!');
