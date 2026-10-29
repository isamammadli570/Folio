import type {Book} from "@/api/types";
import {l} from "@/data/localized";

/**
 * The local stand-in for the `books` table: 60 titles, 15 in each category. Prices are in manat.
 * Phase 2 moves these rows to Supabase; the shape stays the same.
 */
export const BOOKS: Book[] = [
    // ───────── Philosophy ─────────
    {
        id: "the-republic", authorId: "plato", category: "philosophy", price: 18.9, stock: 24, pages: 416, year: -375, approxYear: true, ornament: "column", tag: "bestseller",
        title: l("Dövlət", "The Republic", "Государство"),
        description: l(
            "Ədalət nədir və ideal dövlət necə qurulmalıdır? Mağara alleqoriyası da daxil olmaqla Qərb fəlsəfəsinin təməl dialoqu.",
            "What is justice, and how should the ideal state be built? The founding dialogue of Western philosophy, cave allegory included.",
            "Что такое справедливость и каким должно быть идеальное государство? Основополагающий диалог западной философии, включая миф о пещере.",
        ),
    },
    {
        id: "symposium", authorId: "plato", category: "philosophy", price: 12.5, stock: 18, pages: 160, year: -385, approxYear: true, ornament: "star",
        title: l("Simpozium", "Symposium", "Пир"),
        description: l(
            "Bir ziyafət gecəsində Sokrat və dostları Eros haqqında danışır: bədənin gözəlliyindən Gözəlliyin özünə qədər.",
            "At a drinking party Socrates and his friends speak of Eros, from the beauty of a body to Beauty itself.",
            "На пиру Сократ и его друзья говорят об Эросе — от красоты тела до самой Красоты.",
        ),
    },
    {
        id: "apology", authorId: "plato", category: "philosophy", price: 9.5, stock: 30, pages: 96, year: -399, approxYear: true, ornament: "laurel",
        title: l("Sokratın müdafiəsi", "The Apology of Socrates", "Апология Сократа"),
        description: l(
            "Ölüm hökmü qarşısında Sokratın Afina məhkəməsindəki çıxışı: fəlsəfi həyatın ən cəsarətli müdafiəsi.",
            "Socrates' speech to the Athenian court as it condemns him: the boldest defence of the philosophical life.",
            "Речь Сократа перед афинским судом, приговорившим его к смерти: самая смелая защита философской жизни.",
        ),
    },
    {
        id: "nicomachean-ethics", authorId: "aristotle", category: "philosophy", price: 21.5, stock: 14, pages: 352, year: -340, approxYear: true, ornament: "sun",
        title: l("Nikomax etikası", "Nicomachean Ethics", "Никомахова этика"),
        description: l(
            "Xoşbəxtlik fəzilətli fəaliyyətdir: Aristotelin xarakter, dostluq və «qızıl orta» haqqında dərsləri.",
            "Happiness is virtuous activity: Aristotle's lectures on character, friendship and the golden mean.",
            "Счастье — это добродетельная деятельность: лекции Аристотеля о характере, дружбе и золотой середине.",
        ),
    },
    {
        id: "politics", authorId: "aristotle", category: "philosophy", price: 19.9, stock: 9, pages: 320, year: -350, approxYear: true, ornament: "column",
        title: l("Siyasət", "Politics", "Политика"),
        description: l(
            "«İnsan siyasi varlıqdır»: ailədən polisə qədər idarəetmə formalarının ilk sistemli təhlili.",
            "\"Man is a political animal\": the first systematic study of forms of rule, from household to city-state.",
            "«Человек — существо политическое»: первый систематический анализ форм правления — от семьи до полиса.",
        ),
    },
    {
        id: "enchiridion", authorId: "epictetus", category: "philosophy", price: 9.9, stock: 40, pages: 88, year: 125, approxYear: true, ornament: "laurel", tag: "new",
        title: l("Enxiridion", "Enchiridion", "Энхиридион"),
        description: l(
            "Stoisizmin cib kitabçası: bizdən asılı olanla olmayanı ayırmağın yığcam və sərt təlimatı.",
            "The pocket handbook of Stoicism: a terse guide to telling what is up to us from what is not.",
            "Карманное руководство стоицизма: краткое наставление о том, как отличать зависящее от нас от не зависящего.",
        ),
    },
    {
        id: "meditations", authorId: "marcus-aurelius", category: "philosophy", price: 13.9, oldPrice: 17.5, stock: 35, pages: 224, year: 180, approxYear: true, ornament: "laurel", tag: "bestseller",
        title: l("Düşüncələr", "Meditations", "Размышления"),
        description: l(
            "Roma imperatorunun yalnız özü üçün yazdığı qeydlər: vəzifə, ölüm və sakitlik haqqında.",
            "Notes a Roman emperor wrote only for himself, on duty, death and calm.",
            "Записи римского императора, сделанные только для себя: о долге, смерти и спокойствии.",
        ),
    },
    {
        id: "letters-to-lucilius", authorId: "seneca", category: "philosophy", price: 22.9, stock: 12, pages: 448, year: 65, approxYear: true, ornament: "quill",
        title: l("Lusiliyə əxlaqi məktublar", "Letters to Lucilius", "Нравственные письма к Луцилию"),
        description: l(
            "Gənc dosta yazılmış yüz iyirmi dörd məktub: zamanı qorumaq, qorxunu yenmək və yaxşı yaşamaq haqqında.",
            "One hundred and twenty-four letters to a younger friend on guarding time, mastering fear and living well.",
            "Сто двадцать четыре письма младшему другу — о том, как беречь время, побеждать страх и жить достойно.",
        ),
    },
    {
        id: "discourse-on-method", authorId: "descartes", category: "philosophy", price: 11.5, stock: 20, pages: 128, year: 1637, ornament: "compass",
        title: l("Metod haqqında mühakimə", "Discourse on the Method", "Рассуждение о методе"),
        description: l(
            "Ağlı düzgün istiqamətləndirmək üçün dörd qayda və «Düşünürəm, deməli, varam» kəşfinə aparan yol.",
            "Four rules for rightly conducting reason, and the road to \"I think, therefore I am\".",
            "Четыре правила для верного руководства разумом и путь к открытию «Я мыслю, следовательно, существую».",
        ),
    },
    {
        id: "ethics", authorId: "spinoza", category: "philosophy", price: 24.9, stock: 7, pages: 368, year: 1677, ornament: "compass",
        title: l("Etika", "Ethics", "Этика"),
        description: l(
            "Həndəsi qaydada sübut olunmuş fəlsəfə: Tanrı, ağıl, ehtiraslar və insan azadlığı haqqında.",
            "Philosophy demonstrated in geometric order: on God, the mind, the passions and human freedom.",
            "Философия, доказанная в геометрическом порядке: о Боге, уме, аффектах и человеческой свободе.",
        ),
    },
    {
        id: "critique-of-pure-reason", authorId: "kant", category: "philosophy", price: 32, stock: 6, pages: 784, year: 1781, ornament: "star",
        title: l("Xalis ağlın tənqidi", "Critique of Pure Reason", "Критика чистого разума"),
        description: l(
            "Nəyi bilə bilərik? Məkan, zaman və kateqoriyaların təcrübəni necə formalaşdırdığını göstərən çevriliş.",
            "What can we know? The revolution showing how space, time and the categories shape experience.",
            "Что мы можем знать? Переворот, показавший, как пространство, время и категории формируют опыт.",
        ),
    },
    {
        id: "phenomenology-of-spirit", authorId: "hegel", category: "philosophy", price: 24.5, oldPrice: 29, stock: 8, pages: 640, year: 1807, ornament: "sun",
        title: l("Ruhun fenomenologiyası", "Phenomenology of Spirit", "Феноменология духа"),
        description: l(
            "Şüurun sadə hiss qavrayışından mütləq biliyə qədər yolu; ağa və qul dialektikası da buradadır.",
            "Consciousness on its way from bare sensation to absolute knowing, master and slave dialectic included.",
            "Путь сознания от чувственной достоверности к абсолютному знанию, включая диалектику господина и раба.",
        ),
    },
    {
        id: "thus-spoke-zarathustra", authorId: "nietzsche", category: "philosophy", price: 17.9, stock: 22, pages: 352, year: 1883, ornament: "star", tag: "bestseller",
        title: l("Zərdüşt belə deyirdi", "Thus Spoke Zarathustra", "Так говорил Заратустра"),
        description: l(
            "Dağdan enən peyğəmbərin poetik nitqləri: fövqəlinsan, əbədi qayıdış və dəyərlərin yenidən qiymətləndirilməsi.",
            "The poetic speeches of a prophet come down from the mountain: the overman, eternal return and the revaluation of values.",
            "Поэтические речи пророка, спустившегося с гор: сверхчеловек, вечное возвращение и переоценка ценностей.",
        ),
    },
    {
        id: "beyond-good-and-evil", authorId: "nietzsche", category: "philosophy", price: 16.5, stock: 15, pages: 256, year: 1886, ornament: "sun",
        title: l("Xeyir və şərdən o yana", "Beyond Good and Evil", "По ту сторону добра и зла"),
        description: l(
            "Gələcəyin fəlsəfəsinə müqəddimə: həqiqət iradəsini və əxlaqın gizli köklərini ifşa edən aforizmlər.",
            "Prelude to a philosophy of the future: aphorisms exposing the will to truth and the hidden roots of morality.",
            "Прелюдия к философии будущего: афоризмы, обнажающие волю к истине и скрытые корни морали.",
        ),
    },
    {
        id: "fear-and-trembling", authorId: "kierkegaard", category: "philosophy", price: 12.9, stock: 0, pages: 176, year: 1843, ornament: "eye",
        title: l("Qorxu və titrəyiş", "Fear and Trembling", "Страх и трепет"),
        description: l(
            "İbrahimin qurbanı üzərində düşüncə: imanın ağlın və əxlaqın hüdudlarından kənara çıxan sıçrayışı.",
            "A meditation on the sacrifice of Abraham: faith as a leap beyond the limits of reason and ethics.",
            "Размышление о жертвоприношении Авраама: вера как прыжок за пределы разума и этики.",
        ),
    },

    // ───────── History ─────────
    {
        id: "histories", authorId: "herodotus", category: "history", price: 19.5, stock: 16, pages: 720, year: -430, approxYear: true, ornament: "amphora",
        title: l("Tarix", "The Histories", "История"),
        description: l(
            "Yunanlarla farslar arasındakı böyük müharibə və qədim dünyanın xalqları haqqında ilk tarix kitabı.",
            "The first book of history: the great war of Greeks and Persians and the peoples of the ancient world.",
            "Первая книга истории: великая война греков и персов и народы древнего мира.",
        ),
    },
    {
        id: "peloponnesian-war", authorId: "thucydides", category: "history", price: 22.9, stock: 10, pages: 640, year: -400, approxYear: true, ornament: "amphora",
        title: l("Peloponnes müharibəsinin tarixi", "History of the Peloponnesian War", "История Пелопоннесской войны"),
        description: l(
            "Afina ilə Spartanın iyirmi yeddi illik müharibəsi; Periklin dəfn nitqi və Melos dialoqu ilə.",
            "Twenty-seven years of war between Athens and Sparta, with Pericles' funeral oration and the Melian dialogue.",
            "Двадцатисемилетняя война Афин и Спарты — с надгробной речью Перикла и мелосским диалогом.",
        ),
    },
    {
        id: "parallel-lives", authorId: "plutarch", category: "history", price: 26.5, stock: 11, pages: 704, year: 100, approxYear: true, ornament: "laurel",
        title: l("Paralel həyatlar", "Parallel Lives", "Сравнительные жизнеописания"),
        description: l(
            "İsgəndər və Sezar, Demosfen və Siseron: yunan və Roma böyüklərinin cüt-cüt bioqrafiyaları.",
            "Alexander and Caesar, Demosthenes and Cicero: the great Greeks and Romans in paired biographies.",
            "Александр и Цезарь, Демосфен и Цицерон: парные биографии великих греков и римлян.",
        ),
    },
    {
        id: "annals", authorId: "tacitus", category: "history", price: 21, stock: 8, pages: 464, year: 117, approxYear: true, ornament: "column",
        title: l("Annallar", "The Annals", "Анналы"),
        description: l(
            "Tiberidən Neronadək Roma: hakimiyyətin necə korlandığını göstərən soyuq və dəqiq salnamə.",
            "Rome from Tiberius to Nero: a cold, exact chronicle of how power corrupts.",
            "Рим от Тиберия до Нерона: холодная и точная летопись того, как власть развращает.",
        ),
    },
    {
        id: "gallic-war", authorId: "caesar", category: "history", price: 14.9, stock: 19, pages: 288, year: -50, approxYear: true, ornament: "laurel",
        title: l("Qall müharibəsi haqqında qeydlər", "Commentaries on the Gallic War", "Записки о Галльской войне"),
        description: l(
            "Sezarın öz qələmindən Qalliyanın fəthi: hərbi hesabat və ustalıqla qurulmuş siyasi təbliğat.",
            "The conquest of Gaul in Caesar's own words: a military report and a masterly piece of political self-promotion.",
            "Завоевание Галлии, описанное самим Цезарем: военный отчёт и мастерская политическая самореклама.",
        ),
    },
    {
        id: "muqaddimah", authorId: "ibn-khaldun", category: "history", price: 26, stock: 9, pages: 512, year: 1377, ornament: "star", tag: "new",
        title: l("Müqəddimə", "The Muqaddimah", "Мукаддима"),
        description: l(
            "Tarixə elm kimi giriş: əsəbiyyə, sülalələrin dövrü və iqtisadiyyatın cəmiyyətə təsiri.",
            "An introduction to history as a science: group solidarity, the cycle of dynasties and the economy's hold on society.",
            "Введение в историю как науку: асабия, цикл династий и влияние экономики на общество.",
        ),
    },
    {
        id: "the-prince", authorId: "machiavelli", category: "history", price: 11.9, oldPrice: 15, stock: 28, pages: 144, year: 1532, ornament: "column",
        title: l("Hökmdar", "The Prince", "Государь"),
        description: l(
            "Hakimiyyəti necə əldə etmək və saxlamaq: «sevilməkdənsə qorxulmaq daha etibarlıdır» deyən kiçik, təhlükəli kitab.",
            "How to win power and keep it: the small, dangerous book that says it is safer to be feared than loved.",
            "Как получить власть и удержать её: небольшая опасная книга о том, что внушать страх надёжнее, чем любовь.",
        ),
    },
    {
        id: "decline-and-fall", authorId: "gibbon", category: "history", price: 34, stock: 4, pages: 1104, year: 1776, ornament: "column",
        title: l("Roma imperiyasının tənəzzülü və süqutu", "The Decline and Fall of the Roman Empire", "История упадка и разрушения Римской империи"),
        description: l(
            "Antoninlərdən Konstantinopolun düşməsinə qədər: ingilis nəsrinin şah əsəri sayılan monumental tarix.",
            "From the Antonines to the fall of Constantinople: a monumental history and a masterpiece of English prose.",
            "От Антонинов до падения Константинополя: монументальная история и шедевр английской прозы.",
        ),
    },
    {
        id: "democracy-in-america", authorId: "tocqueville", category: "history", price: 27.5, stock: 7, pages: 896, year: 1835, ornament: "compass",
        title: l("Amerikada demokratiya", "Democracy in America", "Демократия в Америке"),
        description: l(
            "Gənc respublikaya baxan fransız gözü: bərabərlik, çoxluğun tiraniyası və vətəndaş birlikləri.",
            "A French eye on the young republic: equality, the tyranny of the majority and civic associations.",
            "Взгляд француза на молодую республику: равенство, тирания большинства и гражданские ассоциации.",
        ),
    },
    {
        id: "philosophy-of-history", authorId: "hegel", category: "history", price: 20.5, stock: 10, pages: 480, year: 1837, ornament: "amphora",
        title: l("Tarix fəlsəfəsi", "Lectures on the Philosophy of History", "Философия истории"),
        description: l(
            "Şərqdən Qərbə dünya tarixi: Hegelin azadlıq şüurunun inkişafı haqqında Berlin mühazirələri.",
            "World history from East to West: Hegel's Berlin lectures on the progress of the consciousness of freedom.",
            "Всемирная история от Востока к Западу: берлинские лекции Гегеля о развитии сознания свободы.",
        ),
    },
    {
        id: "travels-of-marco-polo", authorId: "marco-polo", category: "history", price: 18.5, stock: 13, pages: 368, year: 1300, approxYear: true, ornament: "compass",
        title: l("Marko Polonun səyahətləri", "The Travels of Marco Polo", "Книга о разнообразии мира"),
        description: l(
            "Venesiyadan Xanbalıqa: İpək yolunun şəhərləri, Xubilay xanın sarayı və Avropanın heç görmədiyi Şərq.",
            "From Venice to Khanbaliq: the cities of the Silk Road, Kublai Khan's court and an East Europe had never seen.",
            "Из Венеции в Ханбалык: города Шёлкового пути, двор Хубилая и Восток, которого Европа не видела.",
        ),
    },
    {
        id: "anabasis", authorId: "xenophon", category: "history", price: 15.5, stock: 12, pages: 272, year: -370, approxYear: true, ornament: "amphora",
        title: l("Anabasis", "Anabasis", "Анабасис"),
        description: l(
            "On min yunan muzdlusu düşmən torpağında başsız qalır: «Thalatta! Thalatta!» nidasına qədər geri dönüş yolu.",
            "Ten thousand Greek mercenaries stranded in enemy land, and the march home to the cry of \"Thalatta! Thalatta!\".",
            "Десять тысяч греческих наёмников без командиров во вражеской земле — и путь домой до крика «Таласса! Таласса!».",
        ),
    },
    {
        id: "twelve-caesars", authorId: "suetonius", category: "history", price: 17.5, oldPrice: 21, stock: 14, pages: 384, year: 121, approxYear: true, ornament: "laurel",
        title: l("On iki Sezarın həyatı", "The Twelve Caesars", "Жизнь двенадцати цезарей"),
        description: l(
            "Yuli Sezardan Domisianadək: Roma hökmdarlarının həm siyasəti, həm də gizli qüsurları.",
            "From Julius Caesar to Domitian: the politics of Rome's rulers and their secret vices.",
            "От Юлия Цезаря до Домициана: политика римских правителей и их тайные пороки.",
        ),
    },
    {
        id: "history-of-rome", authorId: "livy", category: "history", price: 23.5, stock: 6, pages: 576, year: -27, approxYear: true, ornament: "column",
        title: l("Roma tarixi", "The History of Rome", "История Рима от основания города"),
        description: l(
            "Romul və Remdən Hannibala qədər: Romanın yüksəlişini əfsanə və ibrət dili ilə danışan tarix.",
            "From Romulus and Remus to Hannibal: Rome's rise told in the language of legend and example.",
            "От Ромула и Рема до Ганнибала: возвышение Рима, рассказанное языком легенды и примера.",
        ),
    },
    {
        id: "secret-history", authorId: "procopius", category: "history", price: 13.5, stock: 3, pages: 208, year: 550, approxYear: true, ornament: "eye",
        title: l("Gizli tarix", "The Secret History", "Тайная история"),
        description: l(
            "Rəsmi tarixçinin gizlində yazdığı kitab: Yustinian və Teodoranın sarayı haqqında qalmaqallı həqiqətlər.",
            "The book an official historian wrote in secret: scandalous truths about the court of Justinian and Theodora.",
            "Книга, тайно написанная официальным историком: скандальная правда о дворе Юстиниана и Феодоры.",
        ),
    },

    // ───────── Psychology ─────────
    {
        id: "interpretation-of-dreams", authorId: "freud", category: "psychology", price: 21, stock: 17, pages: 624, year: 1899, ornament: "eye", tag: "bestseller",
        title: l("Yuxuların yozumu", "The Interpretation of Dreams", "Толкование сновидений"),
        description: l(
            "Yuxu arzunun gerçəkləşməsidir: psixoanalizin doğulduğu kitab və şüursuza aparan «kral yolu».",
            "A dream is the fulfilment of a wish: the book in which psychoanalysis was born, the royal road to the unconscious.",
            "Сновидение — исполнение желания: книга, в которой родился психоанализ, «царская дорога» к бессознательному.",
        ),
    },
    {
        id: "civilization-and-its-discontents", authorId: "freud", category: "psychology", price: 13.5, stock: 21, pages: 144, year: 1930, ornament: "sun",
        title: l("Mədəniyyətdən narazılıq", "Civilization and Its Discontents", "Недовольство культурой"),
        description: l(
            "Sivilizasiya instinktlərdən imtina üzərində qurulub: insanın cəmiyyətdə niyə xoşbəxt ola bilmədiyi haqqında.",
            "Civilisation is built on renouncing instinct: why people cannot be wholly happy within society.",
            "Цивилизация построена на отказе от влечений: почему человек не может быть вполне счастлив в обществе.",
        ),
    },
    {
        id: "introductory-lectures", authorId: "freud", category: "psychology", price: 19.9, oldPrice: 24, stock: 11, pages: 512, year: 1917, ornament: "eye",
        title: l("Psixoanalizə giriş", "Introductory Lectures on Psychoanalysis", "Введение в психоанализ"),
        description: l(
            "Vyana Universitetində oxunan mühazirələr: dil sürçmələrindən nevrozlara qədər psixoanalizin aydın xəritəsi.",
            "Lectures given at the University of Vienna: a clear map of psychoanalysis, from slips of the tongue to neurosis.",
            "Лекции, прочитанные в Венском университете: ясная карта психоанализа — от оговорок до неврозов.",
        ),
    },
    {
        id: "archetypes", authorId: "jung", category: "psychology", price: 27.5, stock: 8, pages: 480, year: 1959, ornament: "eye",
        title: l("Arxetiplər və kollektiv şüursuzluq", "The Archetypes and the Collective Unconscious", "Архетипы и коллективное бессознательное"),
        description: l(
            "Ana, Kölgə, Anima və Qəhrəman: bütün insanlığın ortaq şüursuz obrazları.",
            "Mother, Shadow, Anima and Hero: the unconscious images all humanity shares.",
            "Мать, Тень, Анима и Герой: общие бессознательные образы всего человечества.",
        ),
    },
    {
        id: "man-and-his-symbols", authorId: "jung", category: "psychology", price: 24, stock: 10, pages: 320, year: 1964, ornament: "sun",
        title: l("İnsan və onun simvolları", "Man and His Symbols", "Человек и его символы"),
        description: l(
            "Yunqun geniş oxucu üçün yazdığı son kitab: yuxular, miflər və simvolların dili.",
            "Jung's last book, written for the general reader: the language of dreams, myths and symbols.",
            "Последняя книга Юнга, написанная для широкого читателя: язык сновидений, мифов и символов.",
        ),
    },
    {
        id: "understanding-human-nature", authorId: "adler", category: "psychology", price: 15.9, stock: 13, pages: 256, year: 1927, ornament: "compass",
        title: l("İnsan təbiətini anlamaq", "Understanding Human Nature", "Понимание природы человека"),
        description: l(
            "Xarakter necə formalaşır? Aşağılıq hissi, güc istəyi və sosial maraq haqqında məşhur mühazirələr.",
            "How is character formed? Popular lectures on inferiority, the striving for power and social interest.",
            "Как формируется характер? Знаменитые лекции о чувстве неполноценности, стремлении к власти и социальном интересе.",
        ),
    },
    {
        id: "mans-search-for-meaning", authorId: "frankl", category: "psychology", price: 14.5, stock: 32, pages: 192, year: 1946, ornament: "laurel", tag: "bestseller",
        title: l("İnsanın məna axtarışı", "Man's Search for Meaning", "Человек в поисках смысла"),
        description: l(
            "Osvensimdən sağ çıxan psixiatrın xatirələri və loqoterapiya: ən ağır şəraitdə belə yaşamağa dəyən səbəb.",
            "An Auschwitz survivor's memoir and logotherapy: a reason worth living for even in the worst conditions.",
            "Воспоминания психиатра, пережившего Освенцим, и логотерапия: причина жить даже в самых тяжёлых условиях.",
        ),
    },
    {
        id: "the-art-of-loving", authorId: "fromm", category: "psychology", price: 13.9, stock: 26, pages: 160, year: 1956, ornament: "sun", tag: "new",
        title: l("Sevmək sənəti", "The Art of Loving", "Искусство любить"),
        description: l(
            "Sevgi təsadüfən düşülən hiss deyil, öyrənilən bacarıqdır: qayğı, məsuliyyət, hörmət və bilik.",
            "Love is not something we fall into but an art to be learned: care, responsibility, respect and knowledge.",
            "Любовь — не чувство, в которое случайно попадают, а искусство, которому учатся: забота, ответственность, уважение и знание.",
        ),
    },
    {
        id: "escape-from-freedom", authorId: "fromm", category: "psychology", price: 16.9, stock: 12, pages: 304, year: 1941, ornament: "eye",
        title: l("Azadlıqdan qaçış", "Escape from Freedom", "Бегство от свободы"),
        description: l(
            "İnsanlar niyə öz azadlıqlarından imtina edib avtoritarizmə sığınır? Faşizm illərində yazılmış diaqnoz.",
            "Why do people give up their freedom and take refuge in authority? A diagnosis written in the years of fascism.",
            "Почему люди отказываются от свободы и ищут убежища в авторитаризме? Диагноз, поставленный в годы фашизма.",
        ),
    },
    {
        id: "principles-of-psychology", authorId: "william-james", category: "psychology", price: 29.5, stock: 5, pages: 928, year: 1890, ornament: "compass",
        title: l("Psixologiyanın prinsipləri", "The Principles of Psychology", "Принципы психологии"),
        description: l(
            "Vərdiş, diqqət, iradə və «şüur axını»: psixologiyanı müstəqil elmə çevirən klassik.",
            "Habit, attention, will and the stream of consciousness: the classic that made psychology a science of its own.",
            "Привычка, внимание, воля и «поток сознания»: классика, сделавшая психологию самостоятельной наукой.",
        ),
    },
    {
        id: "neurotic-personality", authorId: "horney", category: "psychology", price: 15.5, stock: 9, pages: 240, year: 1937, ornament: "eye",
        title: l("Zəmanəmizin nevrotik şəxsiyyəti", "The Neurotic Personality of Our Time", "Невротическая личность нашего времени"),
        description: l(
            "Narahatlıq, sevgi ehtiyacı və rəqabət: nevrozun mədəniyyətdən doğduğunu göstərən cəsarətli kitab.",
            "Anxiety, the need for love and competition: a bold book showing how neurosis grows out of culture.",
            "Тревога, потребность в любви и соперничество: смелая книга о том, как невроз рождается из культуры.",
        ),
    },
    {
        id: "the-crowd", authorId: "le-bon", category: "psychology", price: 11.9, stock: 20, pages: 176, year: 1895, ornament: "column",
        title: l("Kütlə psixologiyası", "The Crowd: A Study of the Popular Mind", "Психология народов и масс"),
        description: l(
            "Kütlədə fərd yox olur: təlqin, yoluxma və liderlərin gücü haqqında qısa, təsirli tədqiqat.",
            "In a crowd the individual vanishes: a short, influential study of suggestion, contagion and the power of leaders.",
            "В толпе личность исчезает: короткое и влиятельное исследование внушения, заражения и власти вождей.",
        ),
    },
    {
        id: "conditioned-reflexes", authorId: "pavlov", category: "psychology", price: 18.9, stock: 6, pages: 432, year: 1927, ornament: "compass",
        title: l("Şərti reflekslər", "Conditioned Reflexes", "Условные рефлексы"),
        description: l(
            "Zəng səsi və tüpürcək: beyin qabığının işini eksperimentlə öyrənən mühazirələr.",
            "A bell and saliva: lectures that studied the work of the cerebral cortex by experiment.",
            "Звонок и слюноотделение: лекции, экспериментально изучающие работу коры головного мозга.",
        ),
    },
    {
        id: "motivation-and-personality", authorId: "maslow", category: "psychology", price: 19.5, stock: 15, pages: 368, year: 1954, ornament: "sun",
        title: l("Motivasiya və şəxsiyyət", "Motivation and Personality", "Мотивация и личность"),
        description: l(
            "Fizioloji ehtiyaclardan özünüreallaşdırmaya: insan motivasiyasının məşhur piramidası.",
            "From bodily needs to self-actualisation: the famous pyramid of human motivation.",
            "От физиологических потребностей к самоактуализации: знаменитая пирамида человеческой мотивации.",
        ),
    },
    {
        id: "childhood-and-society", authorId: "erikson", category: "psychology", price: 20.9, stock: 8, pages: 448, year: 1950, ornament: "laurel",
        title: l("Uşaqlıq və cəmiyyət", "Childhood and Society", "Детство и общество"),
        description: l(
            "Etimaddan müdrikliyə: şəxsiyyətin həyat boyu keçdiyi səkkiz mərhələ və kimlik böhranı.",
            "From trust to wisdom: the eight stages a personality passes through in life, and the identity crisis.",
            "От доверия к мудрости: восемь стадий, через которые проходит личность, и кризис идентичности.",
        ),
    },

    // ───────── Literature ─────────
    {
        id: "crime-and-punishment", authorId: "dostoevsky", category: "literature", price: 23.9, stock: 27, pages: 608, year: 1866, ornament: "quill", tag: "bestseller",
        title: l("Cinayət və cəza", "Crime and Punishment", "Преступление и наказание"),
        description: l(
            "Kasıb tələbə Raskolnikov «fövqəladə insan» nəzəriyyəsini sınamaq üçün qətl törədir: vicdanın romanı.",
            "Raskolnikov, a poor student, kills to test his theory of the extraordinary man: a novel of conscience.",
            "Бедный студент Раскольников совершает убийство, чтобы проверить теорию о «необыкновенном человеке»: роман о совести.",
        ),
    },
    {
        id: "brothers-karamazov", authorId: "dostoevsky", category: "literature", price: 28.5, stock: 14, pages: 896, year: 1880, ornament: "star",
        title: l("Karamazov qardaşları", "The Brothers Karamazov", "Братья Карамазовы"),
        description: l(
            "Ata qətli, üç qardaş və «Böyük inkvizitor»: Dostoyevskinin iman və azadlıq haqqında son böyük romanı.",
            "A father's murder, three brothers and the Grand Inquisitor: Dostoevsky's last great novel of faith and freedom.",
            "Отцеубийство, три брата и «Великий инквизитор»: последний великий роман Достоевского о вере и свободе.",
        ),
    },
    {
        id: "the-idiot", authorId: "dostoevsky", category: "literature", price: 21.9, stock: 12, pages: 704, year: 1869, ornament: "laurel",
        title: l("İdiot", "The Idiot", "Идиот"),
        description: l(
            "Saf qəlbli knyaz Mışkin Peterburq cəmiyyətinə düşür: «tamamilə gözəl insan»ı təsvir etmək cəhdi.",
            "Pure-hearted Prince Myshkin enters Petersburg society: an attempt to portray a wholly beautiful man.",
            "Чистосердечный князь Мышкин попадает в петербургское общество: попытка изобразить «положительно прекрасного человека».",
        ),
    },
    {
        id: "notes-from-underground", authorId: "dostoevsky", category: "literature", price: 12.5, stock: 19, pages: 160, year: 1864, ornament: "key",
        title: l("Yeraltından qeydlər", "Notes from Underground", "Записки из подполья"),
        description: l(
            "Ağlın hökmünə üsyan edən acı bir qəhrəmanın etirafı: ekzistensializmin ilk səsi.",
            "The confession of a bitter man who rebels against the rule of reason: the first voice of existentialism.",
            "Исповедь озлобленного человека, восставшего против диктата разума: первый голос экзистенциализма.",
        ),
    },
    {
        id: "war-and-peace", authorId: "tolstoy", category: "literature", price: 32, oldPrice: 38, stock: 9, pages: 1296, year: 1869, ornament: "quill",
        title: l("Hərb və sülh", "War and Peace", "Война и мир"),
        description: l(
            "Napoleon müharibələri dövründə rus ailələrinin taleyi: tarix, sevgi və həyatın mənası haqqında epopeya.",
            "Russian families through the Napoleonic wars: an epic of history, love and the meaning of life.",
            "Судьбы русских семей в эпоху наполеоновских войн: эпопея об истории, любви и смысле жизни.",
        ),
    },
    {
        id: "anna-karenina", authorId: "tolstoy", category: "literature", price: 26.5, stock: 13, pages: 864, year: 1878, ornament: "laurel",
        title: l("Anna Karenina", "Anna Karenina", "Анна Каренина"),
        description: l(
            "Yasaq sevgi və ictimai riyakarlıq: Annanın faciəsi və Levinin məna axtarışı yan-yana.",
            "Forbidden love and social hypocrisy: Anna's tragedy and Levin's search for meaning side by side.",
            "Запретная любовь и светское лицемерие: трагедия Анны и поиски смысла Левина бок о бок.",
        ),
    },
    {
        id: "the-trial", authorId: "kafka", category: "literature", price: 15.9, stock: 16, pages: 272, year: 1925, ornament: "key",
        title: l("Məhkəmə", "The Trial", "Процесс"),
        description: l(
            "Yozef K. bir səhər səbəbsiz həbs olunur: anlaşılmaz hakimiyyət qarşısında insan.",
            "Josef K. is arrested one morning for no reason: a man before an incomprehensible authority.",
            "Однажды утром Йозефа К. арестовывают без причины: человек перед непостижимой властью.",
        ),
    },
    {
        id: "the-metamorphosis", authorId: "kafka", category: "literature", price: 9.9, stock: 31, pages: 96, year: 1915, ornament: "eye", tag: "new",
        title: l("Çevrilmə", "The Metamorphosis", "Превращение"),
        description: l(
            "Qreqor Zamza bir səhər nəhəng həşərata çevrilmiş halda oyanır və ailəsi onu tanımaqdan imtina edir.",
            "Gregor Samsa wakes one morning transformed into a monstrous insect, and his family stops seeing him.",
            "Грегор Замза однажды утром просыпается чудовищным насекомым, и семья отказывается его узнавать.",
        ),
    },
    {
        id: "the-stranger", authorId: "camus", category: "literature", price: 12.9, stock: 24, pages: 128, year: 1942, ornament: "sun",
        title: l("Yad", "The Stranger", "Посторонний"),
        description: l(
            "«Bu gün anam öldü. Bəlkə də dünən». Əlcəzair günəşi altında absurdun ən soyuq romanı.",
            "\"Mother died today. Or maybe yesterday.\" The coldest novel of the absurd, under the Algerian sun.",
            "«Сегодня умерла мама. А может, вчера». Самый холодный роман абсурда под алжирским солнцем.",
        ),
    },
    {
        id: "the-plague", authorId: "camus", category: "literature", price: 16.9, stock: 2, pages: 320, year: 1947, ornament: "column",
        title: l("Taun", "The Plague", "Чума"),
        description: l(
            "Bağlı Oran şəhərində epidemiya: həkim Riyönün timsalında həmrəylik və insan ləyaqəti.",
            "An epidemic in the sealed city of Oran: solidarity and human dignity in the figure of Dr Rieux.",
            "Эпидемия в закрытом городе Оране: солидарность и человеческое достоинство на примере доктора Риё.",
        ),
    },
    {
        id: "the-odyssey", authorId: "homer", category: "literature", price: 18.5, stock: 15, pages: 448, year: -700, approxYear: true, ornament: "amphora",
        title: l("Odisseya", "The Odyssey", "Одиссея"),
        description: l(
            "Troya müharibəsindən sonra Odisseyin İtakaya on illik qayıdışı: Avropa ədəbiyyatının ilk macəra poeması.",
            "Odysseus' ten-year voyage home to Ithaca after Troy: the first adventure poem of European literature.",
            "Десятилетнее возвращение Одиссея на Итаку после Троянской войны: первая приключенческая поэма Европы.",
        ),
    },
    {
        id: "divine-comedy", authorId: "dante", category: "literature", price: 29.5, stock: 7, pages: 832, year: 1320, ornament: "star",
        title: l("İlahi komediya", "The Divine Comedy", "Божественная комедия"),
        description: l(
            "Vergiliyin bələdçiliyi ilə cəhənnəm, araf və cənnətdən keçən yol: orta əsrlər dünyasının şeir xəritəsi.",
            "Through Hell, Purgatory and Paradise with Virgil as guide: the medieval world mapped in verse.",
            "Путь через Ад, Чистилище и Рай под водительством Вергилия: средневековый мир, нанесённый на карту стихом.",
        ),
    },
    {
        id: "don-quixote", authorId: "cervantes", category: "literature", price: 27, stock: 10, pages: 1056, year: 1605, ornament: "quill",
        title: l("Don Kixot", "Don Quixote", "Дон Кихот"),
        description: l(
            "Cəngavərlik romanlarından başı xarab olmuş hidalqo və sadiq Sanço Pansa: ilk müasir roman.",
            "A gentleman driven mad by chivalric romances and his faithful Sancho Panza: the first modern novel.",
            "Идальго, помешавшийся на рыцарских романах, и верный Санчо Панса: первый роман Нового времени.",
        ),
    },
    {
        id: "khosrow-and-shirin", authorId: "nizami", category: "literature", price: 22.5, stock: 11, pages: 416, year: 1180, approxYear: true, ornament: "laurel",
        title: l("Xosrov və Şirin", "Khosrow and Shirin", "Хосров и Ширин"),
        description: l(
            "«Xəmsə»nin ikinci poeması: Sasani şahı Xosrovla şahzadə Şirinin sevgisi və Fərhadın fədakarlığı.",
            "The second poem of the Khamsa: the love of the Sasanian king Khosrow and Princess Shirin, and Farhad's devotion.",
            "Вторая поэма «Хамсе»: любовь сасанидского шаха Хосрова и царевны Ширин и самоотверженность Фархада.",
        ),
    },
    {
        id: "leyli-and-majnun", authorId: "fuzuli", category: "literature", price: 19.9, stock: 18, pages: 288, year: 1536, approxYear: true, ornament: "quill", tag: "new",
        title: l("Leyli və Məcnun", "Leyli and Majnun", "Лейли и Меджнун"),
        description: l(
            "Qeysin Leyliyə eşqi onu Məcnuna çevirir: Azərbaycan dilində yazılmış ən böyük məhəbbət dastanı.",
            "Qays' love for Leyli turns him into Majnun: the greatest love poem written in Azerbaijani.",
            "Любовь Кайса к Лейли превращает его в Меджнуна: величайшая поэма о любви на азербайджанском языке.",
        ),
    },
];
