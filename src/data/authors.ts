import type {Author} from "@/api/types";
import {l} from "@/data/localized";

/**
 * The local stand-in for the `authors` table. Phase 2 moves these rows to Supabase; the shape stays the same.
 * Years below zero are BCE. `featured` authors appear in the home page spotlight, in this order.
 */
export const AUTHORS: Author[] = [
    {
        id: "epictetus", born: 50, died: 135, approx: true, featured: 1, portrait: "/authors/epictetus.webp", scene: "/scenes/epictetus.webp",
        name: l("Epiktet", "Epictetus", "Эпиктет"),
        movement: l("Stoisizm", "Stoicism", "Стоицизм"),
        bio: l(
            "Frigiyada qul kimi doğulmuş stoik filosof. Azad edildikdən sonra Nikopolda məktəb açıb, təlimini şagirdi Arrian qələmə alıb.",
            "A Stoic philosopher born into slavery in Phrygia. Once freed he opened a school in Nicopolis; his pupil Arrian wrote down his teaching.",
            "Философ-стоик, рождённый рабом во Фригии. Получив свободу, открыл школу в Никополе; его учение записал ученик Арриан.",
        ),
        quote: {
            text: "Ταράσσει τοὺς ἀνθρώπους οὐ τὰ πράγματα, ἀλλὰ τὰ περὶ τῶν πραγμάτων δόγματα.", lang: "grc",
            translation: l(
                "İnsanları şeylərin özü deyil, onlar haqqındakı rəyləri narahat edir.",
                "Men are disturbed not by things, but by the opinions they hold about things.",
                "Людей мучают не вещи, а представления о вещах.",
            ),
        },
    },
    {
        id: "plato", born: -427, died: -347, featured: 2, portrait: "/authors/plato.webp", scene: "/scenes/plato.webp",
        name: l("Platon", "Plato", "Платон"),
        movement: l("Antik fəlsəfə", "Ancient philosophy", "Античная философия"),
        bio: l(
            "Sokratın şagirdi və Afinada Akademiyanın banisi. Ədalət, sevgi və bilik haqqında dialoqları iki min ildən çoxdur oxunur.",
            "Pupil of Socrates and founder of the Academy in Athens. His dialogues on justice, love and knowledge have been read for over two thousand years.",
            "Ученик Сократа и основатель Академии в Афинах. Его диалоги о справедливости, любви и знании читают уже более двух тысяч лет.",
        ),
        quote: {
            text: "ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ.", lang: "grc",
            translation: l("Sınanmamış həyat insan üçün yaşamağa dəyməz.", "The unexamined life is not worth living for a human being.", "Жизнь без исследования не есть жизнь для человека."),
        },
    },
    {
        id: "hegel", born: 1770, died: 1831, featured: 3, portrait: "/authors/hegel.webp", scene: "/scenes/hegel.webp",
        name: l("Georq Hegel", "G. W. F. Hegel", "Георг Гегель"),
        movement: l("Alman idealizmi", "German idealism", "Немецкий идеализм"),
        bio: l(
            "Alman idealizminin zirvəsi. Tarixi ruhun öz azadlığını dərk etməyə doğru dialektik yolu kimi təsvir edib.",
            "The summit of German idealism. He described history as the dialectical path of spirit towards knowing its own freedom.",
            "Вершина немецкого идеализма. Описал историю как диалектический путь духа к осознанию собственной свободы.",
        ),
        quote: {
            text: "Was vernünftig ist, das ist wirklich; und was wirklich ist, das ist vernünftig.", lang: "de",
            translation: l("Ağlabatan olan həqiqidir, həqiqi olan isə ağlabatandır.", "What is rational is actual, and what is actual is rational.", "Что разумно, то действительно; и что действительно, то разумно."),
        },
    },
    {
        id: "dostoevsky", born: 1821, died: 1881, featured: 4, portrait: "/authors/dostoevsky.webp", scene: "/scenes/dostoevsky.webp",
        name: l("Fyodor Dostoyevski", "Fyodor Dostoevsky", "Фёдор Достоевский"),
        movement: l("Rus realizmi", "Russian realism", "Русский реализм"),
        bio: l(
            "Rus romançısı. Günah, inam və azad iradə ilə mübarizə aparan insan ruhunu ədəbiyyatın mərkəzinə qoyub.",
            "Russian novelist who placed the human soul, wrestling with guilt, faith and free will, at the centre of literature.",
            "Русский романист, поставивший в центр литературы человеческую душу, борющуюся с виной, верой и свободой воли.",
        ),
        quote: {
            text: "Красота спасёт мир.", lang: "ru",
            translation: l("Gözəllik dünyanı xilas edəcək.", "Beauty will save the world.", "Красота спасёт мир."),
        },
    },
    {
        id: "freud", born: 1856, died: 1939, featured: 5, portrait: "/authors/freud.webp", scene: "/scenes/freud.webp",
        name: l("Ziqmund Freyd", "Sigmund Freud", "Зигмунд Фрейд"),
        movement: l("Psixoanaliz", "Psychoanalysis", "Психоанализ"),
        bio: l(
            "Vyanalı nevroloq, psixoanalizin banisi. Yuxuların, unutqanlığın və arzuların arxasında şüursuzun işlədiyini göstərib.",
            "Viennese neurologist and founder of psychoanalysis. He showed the unconscious at work behind dreams, slips and desires.",
            "Венский невролог, основатель психоанализа. Показал работу бессознательного за сновидениями, оговорками и желаниями.",
        ),
        quote: {
            text: "Wo Es war, soll Ich werden.", lang: "de",
            translation: l("«O» olan yerdə «Mən» olmalıdır.", "Where id was, there ego shall be.", "Где было Оно, должно стать Я."),
        },
    },
    {
        id: "nietzsche", born: 1844, died: 1900, featured: 6, portrait: "/authors/nietzsche.webp", scene: "/scenes/nietzsche.webp",
        name: l("Fridrix Nitsşe", "Friedrich Nietzsche", "Фридрих Ницше"),
        movement: l("Həyat fəlsəfəsi", "Philosophy of life", "Философия жизни"),
        bio: l(
            "Alman filosofu və filoloqu. Əxlaqın mənşəyini sorğulayıb, insanı öz dəyərlərini yaratmağa çağırıb.",
            "German philosopher and philologist who questioned the origins of morality and called on people to create their own values.",
            "Немецкий философ и филолог. Поставил под вопрос происхождение морали и призвал человека создавать собственные ценности.",
        ),
        quote: {
            text: "Hat man sein warum? des Lebens, so verträgt man sich fast mit jedem wie?", lang: "de",
            translation: l("Yaşamaq üçün «niyə»si olan, demək olar ki, hər «necə»yə dözər.", "He who has a why to live can bear almost any how.", "У кого есть «зачем» жить, тот вынесет почти любое «как»."),
        },
    },
    {
        id: "tolstoy", born: 1828, died: 1910, featured: 7, portrait: "/authors/tolstoy.webp", scene: "/scenes/tolstoy.webp",
        name: l("Lev Tolstoy", "Leo Tolstoy", "Лев Толстой"),
        movement: l("Rus realizmi", "Russian realism", "Русский реализм"),
        bio: l(
            "Rus yazıçısı və mütəfəkkiri. Romanlarında tarixin axınını ayrı-ayrı insanların taleyi ilə birləşdirib.",
            "Russian writer and thinker whose novels join the sweep of history to the fate of single lives.",
            "Русский писатель и мыслитель. В его романах ход истории сплетается с судьбами отдельных людей.",
        ),
        quote: {
            text: "Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему.", lang: "ru",
            translation: l(
                "Bütün xoşbəxt ailələr bir-birinə bənzəyir, hər bədbəxt ailə isə öz yolu ilə bədbəxtdir.",
                "All happy families are alike; each unhappy family is unhappy in its own way.",
                "Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему.",
            ),
        },
    },
    {
        id: "camus", born: 1913, died: 1960, featured: 8, portrait: "/authors/camus.webp", scene: "/scenes/camus.webp",
        name: l("Alber Kamyu", "Albert Camus", "Альбер Камю"),
        movement: l("Absurd fəlsəfəsi", "Philosophy of the absurd", "Философия абсурда"),
        bio: l(
            "Fransız yazıçısı və filosofu, Nobel mükafatı laureatı. Mənasız görünən dünyada insanın üsyanını və ləyaqətini yazıb.",
            "French writer and philosopher, Nobel laureate, who wrote of human revolt and dignity in a world that seems to have no meaning.",
            "Французский писатель и философ, лауреат Нобелевской премии. Писал о бунте и достоинстве человека в мире, лишённом смысла.",
        ),
        quote: {
            text: "Il faut imaginer Sisyphe heureux.", lang: "fr",
            translation: l("Sizifi xoşbəxt təsəvvür etmək lazımdır.", "One must imagine Sisyphus happy.", "Сизифа следует представлять себе счастливым."),
        },
    },
    {
        id: "kant", born: 1724, died: 1804, featured: 9, portrait: "/authors/kant.webp", scene: "/scenes/kant.webp",
        name: l("İmmanuel Kant", "Immanuel Kant", "Иммануил Кант"),
        movement: l("Alman klassik fəlsəfəsi", "German classical philosophy", "Немецкая классическая философия"),
        bio: l(
            "Kenqsberqli filosof. Biliyin hüdudlarını müəyyən edib, əxlaqı ağlın öz qanunu üzərində qurub.",
            "Philosopher of Königsberg who set out the limits of knowledge and founded morality on reason's own law.",
            "Кёнигсбергский философ. Определил границы познания и основал мораль на собственном законе разума.",
        ),
        quote: {
            text: "Habe Mut, dich deines eigenen Verstandes zu bedienen!", lang: "de",
            translation: l("Öz ağlından istifadə etməyə cəsarətin olsun!", "Have courage to use your own understanding!", "Имей мужество пользоваться собственным умом!"),
        },
    },
    {
        id: "descartes", born: 1596, died: 1650, featured: 10, portrait: "/authors/descartes.webp", scene: "/scenes/descartes.webp",
        name: l("Rene Dekart", "René Descartes", "Рене Декарт"),
        movement: l("Rasionalizm", "Rationalism", "Рационализм"),
        bio: l(
            "Fransız filosofu və riyaziyyatçısı. Hər şeyə şübhədən başlayaraq yeni fəlsəfənin əsasını qoyub.",
            "French philosopher and mathematician who began from doubting everything and laid the foundation of modern philosophy.",
            "Французский философ и математик. Начав с сомнения во всём, заложил основы философии Нового времени.",
        ),
        quote: {
            text: "Je pense, donc je suis.", lang: "fr",
            translation: l("Düşünürəm, deməli, varam.", "I think, therefore I am.", "Я мыслю, следовательно, существую."),
        },
    },
    {
        id: "kafka", born: 1883, died: 1924, featured: 11, portrait: "/authors/kafka.webp", scene: "/scenes/kafka.webp",
        name: l("Frans Kafka", "Franz Kafka", "Франц Кафка"),
        movement: l("Modernizm", "Modernism", "Модернизм"),
        bio: l(
            "Praqalı yazıçı. Bürokratiyanın labirintində itən, səbəbini bilmədən günahlandırılan insanı təsvir edib.",
            "Prague writer of people lost in the labyrinth of bureaucracy, accused without ever learning why.",
            "Пражский писатель. Изобразил человека, потерянного в лабиринте бюрократии и обвинённого без объяснения причин.",
        ),
        quote: {
            text: "Ein Buch muss die Axt sein für das gefrorene Meer in uns.", lang: "de",
            translation: l("Kitab içimizdəki donmuş dənizi sındıran balta olmalıdır.", "A book must be the axe for the frozen sea within us.", "Книга должна быть топором для замёрзшего моря внутри нас."),
        },
    },
    {
        id: "aristotle", born: -384, died: -322,
        name: l("Aristotel", "Aristotle", "Аристотель"),
        movement: l("Antik fəlsəfə", "Ancient philosophy", "Античная философия"),
        bio: l(
            "Platonun şagirdi və Makedoniyalı İsgəndərin müəllimi. Məntiqdən siyasətə qədər demək olar ki, hər elmin təməlini qoyub.",
            "Pupil of Plato and tutor of Alexander the Great, he laid the foundations of almost every science from logic to politics.",
            "Ученик Платона и наставник Александра Македонского. Заложил основы почти всех наук — от логики до политики.",
        ),
    },
    {
        id: "marcus-aurelius", born: 121, died: 180,
        name: l("Mark Avreli", "Marcus Aurelius", "Марк Аврелий"),
        movement: l("Stoisizm", "Stoicism", "Стоицизм"),
        bio: l(
            "Roma imperatoru və stoik filosof. Hərbi yürüşlər zamanı öz-özünə yazdığı qeydlər fəlsəfənin ən səmimi kitablarından birinə çevrilib.",
            "Roman emperor and Stoic whose private notes, written on campaign, became one of philosophy's most candid books.",
            "Римский император и стоик. Его личные записи, сделанные в походах, стали одной из самых искренних книг философии.",
        ),
    },
    {
        id: "seneca", born: -4, died: 65, approx: true,
        name: l("Seneka", "Seneca", "Сенека"),
        movement: l("Stoisizm", "Stoicism", "Стоицизм"),
        bio: l(
            "Roma stoiki, natiq və Neronun müşaviri. Zamanın, ölümün və dostluğun mənası haqqında məktubları bu gün də aktualdır.",
            "Roman Stoic, orator and adviser to Nero, whose letters on time, death and friendship still speak today.",
            "Римский стоик, оратор и советник Нерона. Его письма о времени, смерти и дружбе актуальны и сегодня.",
        ),
    },
    {
        id: "spinoza", born: 1632, died: 1677,
        name: l("Barux Spinoza", "Baruch Spinoza", "Бенедикт Спиноза"),
        movement: l("Rasionalizm", "Rationalism", "Рационализм"),
        bio: l(
            "Amsterdamlı filosof, linza cilalayaraq dolanıb. Tanrını və təbiəti vahid substansiya kimi həndəsi metodla izah edib.",
            "Amsterdam philosopher who earned his living grinding lenses and explained God and nature as one substance, in geometric order.",
            "Амстердамский философ, зарабатывавший шлифовкой линз. Геометрическим методом описал Бога и природу как единую субстанцию.",
        ),
    },
    {
        id: "kierkegaard", born: 1813, died: 1855,
        name: l("Sören Kyerkeqor", "Søren Kierkegaard", "Сёрен Кьеркегор"),
        movement: l("Ekzistensializm", "Existentialism", "Экзистенциализм"),
        bio: l(
            "Danimarkalı filosof və ilahiyyatçı. Seçim, iztirab və imanı fərdin daxili təcrübəsi kimi araşdıraraq ekzistensializmin yolunu açıb.",
            "Danish philosopher and theologian who explored choice, anxiety and faith as inward experience and opened the way to existentialism.",
            "Датский философ и богослов. Исследовал выбор, тревогу и веру как внутренний опыт личности и открыл путь экзистенциализму.",
        ),
    },
    {
        id: "herodotus", born: -484, died: -425, approx: true,
        name: l("Herodot", "Herodotus", "Геродот"),
        movement: l("Antik tarixşünaslıq", "Ancient historiography", "Античная историография"),
        bio: l(
            "Halikarnaslı yunan tarixçisi, «tarixin atası». Yunan-fars müharibələrini və gördüyü xalqların adətlərini qələmə alıb.",
            "Greek historian from Halicarnassus, the \"father of history\", who recorded the Greco-Persian Wars and the customs of the peoples he met.",
            "Греческий историк из Галикарнаса, «отец истории». Описал греко-персидские войны и обычаи народов, которых видел.",
        ),
    },
    {
        id: "thucydides", born: -460, died: -400, approx: true,
        name: l("Fukidid", "Thucydides", "Фукидид"),
        movement: l("Antik tarixşünaslıq", "Ancient historiography", "Античная историография"),
        bio: l(
            "Afinalı sərkərdə və tarixçi. Peloponnes müharibəsini şahid kimi təsvir edib, hadisələrin səbəbini tanrılarda deyil, insanlarda axtarıb.",
            "Athenian general and historian who chronicled the Peloponnesian War as a witness and looked for causes in people, not gods.",
            "Афинский стратег и историк. Описал Пелопоннесскую войну как очевидец и искал причины событий в людях, а не в богах.",
        ),
    },
    {
        id: "plutarch", born: 46, died: 119, approx: true,
        name: l("Plutarx", "Plutarch", "Плутарх"),
        movement: l("Antik tarixşünaslıq", "Ancient historiography", "Античная историография"),
        bio: l(
            "Xeroneyalı yunan yazıçısı. Yunan və Roma böyüklərini cüt-cüt müqayisə edərək xarakterin tarixdəki rolunu göstərib.",
            "Greek writer from Chaeronea who paired the great men of Greece and Rome to show the part character plays in history.",
            "Греческий писатель из Херонеи. Сравнивая великих греков и римлян попарно, показал роль характера в истории.",
        ),
    },
    {
        id: "tacitus", born: 56, died: 120, approx: true,
        name: l("Tatsit", "Tacitus", "Тацит"),
        movement: l("Antik tarixşünaslıq", "Ancient historiography", "Античная историография"),
        bio: l(
            "Roma senatoru və tarixçisi. İmperatorların hakimiyyətini sərt və yığcam üslubla təsvir edib.",
            "Roman senator and historian who portrayed the rule of the emperors in a stern, compressed style.",
            "Римский сенатор и историк. Описал правление императоров суровым и сжатым слогом.",
        ),
    },
    {
        id: "caesar", born: -100, died: -44,
        name: l("Yuli Sezar", "Julius Caesar", "Юлий Цезарь"),
        movement: l("Antik tarixşünaslıq", "Ancient historiography", "Античная историография"),
        bio: l(
            "Roma sərkərdəsi və diktatoru. Qalliyadakı yürüşlərini üçüncü şəxsdə, aydın və soyuqqanlı nəsrlə özü yazıb.",
            "Roman general and dictator who wrote his own account of the Gallic campaigns in clear, cool third-person prose.",
            "Римский полководец и диктатор. Сам описал свои галльские походы — ясной, сдержанной прозой от третьего лица.",
        ),
    },
    {
        id: "ibn-khaldun", born: 1332, died: 1406,
        name: l("İbn Xaldun", "Ibn Khaldun", "Ибн Хальдун"),
        movement: l("Orta əsrlər İslam düşüncəsi", "Medieval Islamic thought", "Средневековая исламская мысль"),
        bio: l(
            "Tunisli alim və dövlət xadimi. Dövlətlərin yüksəliş və tənəzzülünü izah edərək sosiologiyanın sələfi sayılır.",
            "Tunisian scholar and statesman whose account of the rise and fall of states makes him a forerunner of sociology.",
            "Тунисский учёный и государственный деятель. Объяснив возвышение и упадок государств, считается предтечей социологии.",
        ),
    },
    {
        id: "machiavelli", born: 1469, died: 1527,
        name: l("Nikkolo Makiavelli", "Niccolò Machiavelli", "Никколо Макиавелли"),
        movement: l("İntibah siyasi fikri", "Renaissance political thought", "Политическая мысль Возрождения"),
        bio: l(
            "Florensiyalı diplomat. Siyasəti əxlaqi arzulara görə deyil, olduğu kimi təsvir edən ilk müəlliflərdəndir.",
            "Florentine diplomat, among the first to describe politics as it is rather than as morality wishes it to be.",
            "Флорентийский дипломат, одним из первых описавший политику такой, какая она есть, а не какой её хочет видеть мораль.",
        ),
    },
    {
        id: "gibbon", born: 1737, died: 1794,
        name: l("Edvard Gibbon", "Edward Gibbon", "Эдуард Гиббон"),
        movement: l("Maarifçilik tarixşünaslığı", "Enlightenment historiography", "Историография Просвещения"),
        bio: l(
            "İngilis tarixçisi. Roma imperiyasının min illik tənəzzülünü ironiya və dərin araşdırma ilə izləyib.",
            "English historian who traced a thousand years of Rome's decline with irony and deep research.",
            "Английский историк. С иронией и глубиной исследования проследил тысячелетний упадок Римской империи.",
        ),
    },
    {
        id: "tocqueville", born: 1805, died: 1859,
        name: l("Aleksis de Tokvil", "Alexis de Tocqueville", "Алексис де Токвиль"),
        movement: l("Siyasi fəlsəfə", "Political philosophy", "Политическая философия"),
        bio: l(
            "Fransız siyasətçisi və mütəfəkkiri. Amerikaya səyahətindən sonra demokratiyanın güclü və təhlükəli tərəflərini təhlil edib.",
            "French statesman and thinker who, after travelling in America, analysed the strengths and dangers of democracy.",
            "Французский политик и мыслитель. После поездки в Америку проанализировал сильные и опасные стороны демократии.",
        ),
    },
    {
        id: "marco-polo", born: 1254, died: 1324,
        name: l("Marko Polo", "Marco Polo", "Марко Поло"),
        movement: l("Səyahətnamə", "Travel writing", "Путевые записки"),
        bio: l(
            "Venesiyalı tacir. İpək yolu ilə Xubilay xanın sarayına qədər səyahəti Avropaya Şərqi yeni gözlə göstərib.",
            "Venetian merchant whose journey along the Silk Road to the court of Kublai Khan showed Europe the East anew.",
            "Венецианский купец. Его путешествие по Шёлковому пути ко двору Хубилая открыло Европе Восток.",
        ),
    },
    {
        id: "xenophon", born: -430, died: -354, approx: true,
        name: l("Ksenofont", "Xenophon", "Ксенофонт"),
        movement: l("Antik tarixşünaslıq", "Ancient historiography", "Античная историография"),
        bio: l(
            "Afinalı sərkərdə və Sokratın şagirdi. On min yunan muzdlusunun Asiyadan dənizə geri çəkilişinə özü rəhbərlik edib.",
            "Athenian soldier and pupil of Socrates who helped lead ten thousand Greek mercenaries back from Asia to the sea.",
            "Афинский полководец и ученик Сократа. Сам вёл десять тысяч греческих наёмников из глубин Азии к морю.",
        ),
    },
    {
        id: "suetonius", born: 69, died: 122, approx: true,
        name: l("Svetoni", "Suetonius", "Светоний"),
        movement: l("Antik tarixşünaslıq", "Ancient historiography", "Античная историография"),
        bio: l(
            "Roma tarixçisi və imperator Adrianın katibi. Sezarların həyatını sarayın gizli detalları ilə birlikdə yazıb.",
            "Roman historian and secretary to Hadrian who wrote the lives of the Caesars along with the secrets of their court.",
            "Римский историк и секретарь императора Адриана. Описал жизнь цезарей вместе с тайнами их двора.",
        ),
    },
    {
        id: "livy", born: -59, died: 17,
        name: l("Titus Livi", "Livy", "Тит Ливий"),
        movement: l("Antik tarixşünaslıq", "Ancient historiography", "Античная историография"),
        bio: l(
            "Patavayalı Roma tarixçisi. Romanın tarixini şəhərin əfsanəvi qurulmasından öz dövrünə qədər yüz qırx iki kitabda danışıb.",
            "Roman historian from Patavium who told Rome's story from its legendary founding to his own day in 142 books.",
            "Римский историк из Патавия. Рассказал историю Рима от легендарного основания до своих дней в ста сорока двух книгах.",
        ),
    },
    {
        id: "procopius", born: 500, died: 565, approx: true,
        name: l("Prokopi", "Procopius", "Прокопий Кесарийский"),
        movement: l("Bizans tarixşünaslığı", "Byzantine historiography", "Византийская историография"),
        bio: l(
            "Qeysəriyyəli Bizans tarixçisi. Yustinianın müharibələrini rəsmi şəkildə, sarayın qalmaqallarını isə gizlində yazıb.",
            "Byzantine historian from Caesarea who chronicled Justinian's wars officially and the scandals of his court in secret.",
            "Византийский историк из Кесарии. Официально описал войны Юстиниана, а тайно — скандалы его двора.",
        ),
    },
    {
        id: "jung", born: 1875, died: 1961,
        name: l("Karl Qustav Yunq", "Carl Gustav Jung", "Карл Густав Юнг"),
        movement: l("Analitik psixologiya", "Analytical psychology", "Аналитическая психология"),
        bio: l(
            "İsveçrəli psixiatr. Kollektiv şüursuzluq və arxetiplər ideyası ilə miflər, yuxular və dinlər arasında körpü salıb.",
            "Swiss psychiatrist whose ideas of the collective unconscious and archetypes linked myths, dreams and religions.",
            "Швейцарский психиатр. Идеями коллективного бессознательного и архетипов связал мифы, сновидения и религии.",
        ),
    },
    {
        id: "adler", born: 1870, died: 1937,
        name: l("Alfred Adler", "Alfred Adler", "Альфред Адлер"),
        movement: l("Fərdi psixologiya", "Individual psychology", "Индивидуальная психология"),
        bio: l(
            "Avstriyalı psixoloq. Aşağılıq hissini və ona qarşı mübarizəni insan davranışının əsas qüvvəsi sayıb.",
            "Austrian psychologist who saw the feeling of inferiority, and the striving to overcome it, as the main force behind behaviour.",
            "Австрийский психолог. Считал чувство неполноценности и стремление его преодолеть главной силой поведения.",
        ),
    },
    {
        id: "frankl", born: 1905, died: 1997,
        name: l("Viktor Frankl", "Viktor Frankl", "Виктор Франкл"),
        movement: l("Loqoterapiya", "Logotherapy", "Логотерапия"),
        bio: l(
            "Vyanalı psixiatr, nasist düşərgələrindən sağ çıxıb. Mənanın insanı ən ağır şəraitdə belə ayaqda saxladığını göstərib.",
            "Viennese psychiatrist and survivor of the Nazi camps who showed that meaning keeps a person standing in the worst conditions.",
            "Венский психиатр, переживший нацистские лагеря. Показал, что смысл удерживает человека даже в самых тяжёлых условиях.",
        ),
    },
    {
        id: "fromm", born: 1900, died: 1980,
        name: l("Erix Fromm", "Erich Fromm", "Эрих Фромм"),
        movement: l("Humanist psixoanaliz", "Humanistic psychoanalysis", "Гуманистический психоанализ"),
        bio: l(
            "Alman-amerikan psixoloqu və filosofu. Sevgini, azadlığı və müasir cəmiyyətin insana təsirini araşdırıb.",
            "German-American psychologist and philosopher who studied love, freedom and what modern society does to people.",
            "Немецко-американский психолог и философ. Исследовал любовь, свободу и влияние современного общества на человека.",
        ),
    },
    {
        id: "william-james", born: 1842, died: 1910,
        name: l("Uilyam Ceyms", "William James", "Уильям Джеймс"),
        movement: l("Funksionalizm", "Functionalism", "Функционализм"),
        bio: l(
            "Amerikan psixologiyasının atası və praqmatizmin banilərindən. Şüuru dayanmadan axan bir çay kimi təsvir edib.",
            "Father of American psychology and a founder of pragmatism, who described consciousness as a ceaselessly flowing stream.",
            "Отец американской психологии и один из основателей прагматизма. Описал сознание как непрерывно текущий поток.",
        ),
    },
    {
        id: "horney", born: 1885, died: 1952,
        name: l("Karen Horni", "Karen Horney", "Карен Хорни"),
        movement: l("Neofreydizm", "Neo-Freudianism", "Неофрейдизм"),
        bio: l(
            "Alman-amerikan psixoanalitiki. Nevrozun kökünü bioloji instinktlərdə deyil, mədəniyyətdə və münasibətlərdə axtarıb.",
            "German-American psychoanalyst who looked for the roots of neurosis in culture and relationships, not biological instinct.",
            "Немецко-американский психоаналитик. Искала корни невроза в культуре и отношениях, а не в биологических инстинктах.",
        ),
    },
    {
        id: "le-bon", born: 1841, died: 1931,
        name: l("Qustav Lebon", "Gustave Le Bon", "Гюстав Лебон"),
        movement: l("Sosial psixologiya", "Social psychology", "Социальная психология"),
        bio: l(
            "Fransız həkimi və sosioloqu. Kütlənin içində fərdin necə dəyişdiyini təsvir edən ilk müəlliflərdəndir.",
            "French physician and sociologist, one of the first to describe how a person changes inside a crowd.",
            "Французский врач и социолог. Одним из первых описал, как меняется человек внутри толпы.",
        ),
    },
    {
        id: "pavlov", born: 1849, died: 1936,
        name: l("İvan Pavlov", "Ivan Pavlov", "Иван Павлов"),
        movement: l("Fiziologiya", "Physiology", "Физиология"),
        bio: l(
            "Rus fizioloqu, Nobel mükafatı laureatı. Şərti refleksləri kəşf edərək davranışın eksperimental öyrənilməsinin əsasını qoyub.",
            "Russian physiologist and Nobel laureate whose discovery of conditioned reflexes founded the experimental study of behaviour.",
            "Русский физиолог, лауреат Нобелевской премии. Открыв условные рефлексы, заложил основы экспериментального изучения поведения.",
        ),
    },
    {
        id: "maslow", born: 1908, died: 1970,
        name: l("Abraham Maslou", "Abraham Maslow", "Абрахам Маслоу"),
        movement: l("Humanist psixologiya", "Humanistic psychology", "Гуманистическая психология"),
        bio: l(
            "Amerikan psixoloqu. Ehtiyaclar iyerarxiyası və özünüreallaşdırma ideyası ilə tanınır.",
            "American psychologist known for the hierarchy of needs and the idea of self-actualisation.",
            "Американский психолог, известный иерархией потребностей и идеей самоактуализации.",
        ),
    },
    {
        id: "erikson", born: 1902, died: 1994,
        name: l("Erik Erikson", "Erik Erikson", "Эрик Эриксон"),
        movement: l("İnkişaf psixologiyası", "Developmental psychology", "Психология развития"),
        bio: l(
            "Alman-amerikan psixoanalitiki. İnsan həyatını səkkiz psixososial mərhələdən ibarət yol kimi təsvir edib.",
            "German-American psychoanalyst who described human life as a path through eight psychosocial stages.",
            "Немецко-американский психоаналитик. Описал жизнь человека как путь через восемь психосоциальных стадий.",
        ),
    },
    {
        id: "homer", born: -800, died: -700, approx: true,
        name: l("Homer", "Homer", "Гомер"),
        movement: l("Antik epos", "Ancient epic", "Античный эпос"),
        bio: l(
            "Qədim yunan ozanı, Avropa ədəbiyyatının ilk böyük poemalarının müəllifi sayılır.",
            "Ancient Greek bard, held to be the author of the first great poems of European literature.",
            "Древнегреческий сказитель, которому приписывают первые великие поэмы европейской литературы.",
        ),
    },
    {
        id: "dante", born: 1265, died: 1321,
        name: l("Dante Aligyeri", "Dante Alighieri", "Данте Алигьери"),
        movement: l("Orta əsrlər poeziyası", "Medieval poetry", "Средневековая поэзия"),
        bio: l(
            "Florensiyalı şair. Cəhənnəmdən cənnətə səyahətini xalq dilində yazaraq italyan ədəbi dilini yaradıb.",
            "Florentine poet who wrote his journey from Hell to Paradise in the vernacular and so created literary Italian.",
            "Флорентийский поэт. Описав путешествие из Ада в Рай на народном языке, создал итальянский литературный язык.",
        ),
    },
    {
        id: "cervantes", born: 1547, died: 1616,
        name: l("Migel de Servantes", "Miguel de Cervantes", "Мигель де Сервантес"),
        movement: l("İspan Qızıl əsri", "Spanish Golden Age", "Испанский золотой век"),
        bio: l(
            "İspan yazıçısı və əsgəri. Cəngavərlik romanlarını parodiya edərkən ilk müasir romanı yaradıb.",
            "Spanish writer and soldier who, while parodying chivalric romances, created the first modern novel.",
            "Испанский писатель и солдат. Пародируя рыцарские романы, создал первый роман Нового времени.",
        ),
    },
    {
        id: "nizami", born: 1141, died: 1209,
        name: l("Nizami Gəncəvi", "Nizami Ganjavi", "Низами Гянджеви"),
        movement: l("Klassik Şərq poeziyası", "Classical Eastern poetry", "Классическая восточная поэзия"),
        bio: l(
            "Gəncəli dahi şair. «Xəmsə»si ilə Şərq poemasının zirvəsini yaradıb, sevgi və ədaləti fəlsəfi dərinliklə tərənnüm edib.",
            "The great poet of Ganja whose Khamsa is a summit of Eastern narrative poetry, singing love and justice with philosophical depth.",
            "Великий поэт из Гянджи. Его «Хамсе» — вершина восточной поэмы, воспевающая любовь и справедливость с философской глубиной.",
        ),
    },
    {
        id: "fuzuli", born: 1494, died: 1556,
        name: l("Məhəmməd Füzuli", "Muhammad Fuzuli", "Мухаммед Физули"),
        movement: l("Klassik Şərq poeziyası", "Classical Eastern poetry", "Классическая восточная поэзия"),
        bio: l(
            "Azərbaycan şairi, Bağdadda yaşayıb. Azərbaycan, fars və ərəb dillərində yazıb, eşqin iztirabını lirikanın zirvəsinə qaldırıb.",
            "Azerbaijani poet who lived in Baghdad and wrote in Azerbaijani, Persian and Arabic, raising the anguish of love to the height of lyric poetry.",
            "Азербайджанский поэт, живший в Багдаде. Писал на азербайджанском, персидском и арабском, возведя страдание любви на вершину лирики.",
        ),
    },
];
