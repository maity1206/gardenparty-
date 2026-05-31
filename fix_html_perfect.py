import os

html_path = r"index.html"

with open(html_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Repair Concept section (First mangled part)
target_concept_mangled = '普段、仕事で忙しく働いているあなた。あるいは、育児や家事に追われ、自分のことをつい後回しにしがちなママさん。そんな方々が、ひとときだけでも忙しい「役割」から離れ、「わたし自身」に戻るた            <!-- ⑤ 人生ストーリー漫画シアターセクション -->'
replacement_concept = """普段、仕事で忙しく働いているあなた。あるいは、育児や家事に追われ、自分のことをつい後回しにしがちなママさん。そんな方々が、ひとときだけでも忙しい「役割」から離れ、「わたし自身」に戻るための場所として、このパーティーを企画しました。
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

            <!-- ⑤ 人生ストーリー漫画シアターセクション -->"""

if target_concept_mangled in content:
    content = content.replace(target_concept_mangled, replacement_concept)
    print("Concept section repair prepared!")
else:
    print("Warning: Target concept mangled text not found!")

# 2. Repair Manga duplicate section (Second mangled part)
# We find where the duplicate starts right after </section> at the end of the slideshow.
# The mangled text starts with 'adge">Scene 13: 運命の出会いと一本の線'
target_dup_start = 'adge">Scene 13: 運命の出会いと一本の線 (48歳)</span>'
target_dup_end = '<!-- ⑥ プロフィールセクション (主催者紹介) -->'

start_idx = content.find(target_dup_start)
end_idx = content.find(target_dup_end)

if start_idx != -1 and end_idx != -1:
    # Remove everything from start_idx up to end_idx
    content = content[:start_idx] + "\n\n            " + content[end_idx:]
    print("Manga duplicate cleanup prepared!")
else:
    print(f"Warning: Duplicate slideshow indices not found! start_idx={start_idx}, end_idx={end_idx}")

# Write back the perfectly repaired file
with open(html_path, "w", encoding="utf-8") as f:
    f.write(content)

print("index.html fully and safely repaired!")
