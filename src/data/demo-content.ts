export type ContentCategory =
  | "news"
  | "culture"
  | "history"
  | "events"
  | "transport"
  | "evergreen"
  | "music"
  | "sports"
  | "crime"
  | "science";

export const CATEGORY_LABELS: Record<ContentCategory, string> = {
  news: "naujienos",
  culture: "kultūra",
  history: "istorija",
  events: "renginiai",
  transport: "transportas",
  evergreen: "amžina",
  music: "muzika",
  sports: "sportas",
  crime: "kriminalai",
  science: "mokslas",
};

export type GeoPoint = {
  lat: number;
  lng: number;
  label?: string;
};

export type CandidateItem = {
  id: string;
  title: string;
  summary: string;
  /** Full article body for re-summarizing; not narrated as-is */
  fullText?: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  /** Geographic tags matched against route corridors */
  locations: string[];
  category: ContentCategory;
  /** Pre-assigned source confidence 0–100 */
  sourceConfidence: number;
  /** Optional WGS84 points for map pins (same CRS as JUDU GTFS) */
  geo?: GeoPoint[];
  /** Optional local audio path; missing = demo preview only */
  audioSrc?: string;
  curated?: boolean;
};

/**
 * Shared candidate pool. Same items are scored for every route —
 * selection differences come from corridor, preference, topic, and text budget.
 * publishedAt values are relative to a fixed "demo now" so freshness is stable.
 * Pool: 15 LRT + 15 Go Vilnius (/visos-naujienos); 1G + 2G corridors.
 */
export const DEMO_NOW = "2026-10-10T10:00:00+03:00";

export const CANDIDATES: CandidateItem[] = [
  {
    id: "c8e307c4-e346-4db9-8240-3cc6ce59d157",
    title: "Nenusileidžia net levandų laukams: Santariškės virto gėlių rojumi, tūkstančiai žiedų – padėka medikams...",
    summary: "Vilniuje, Santariškėse esantis transporto žiedas tapo tikru gėlių rojumi – čia sužydėjo ir keleivių akį džiugina vienas didžiausių Vilniaus gėlynų. Kaip nurodo Vilniaus miesto savivaldybė, augalų žiedai – padėka medikams, ilgą laiką sunkiai kovojusiems su pandemija.",
    fullText: "Violetiniai, rausvi, mėlyni žiedai – Santariškių transporto žiedo viduryje ir prieigose žydi tūkstančiai spalvingiausių augalų. Kaip feisbuke nurodė Vilniaus miesto savivaldybė, netoliese Santarų klinikų įrengtas vienas didžiausių gėlynų mieste, jo plotas – net 1116 kv. metrų. Įspūdingi gėlių žiedai siunčia jautrią žinutę. „Per 9000 jame [gėlyne] žaliuojančių augalų yra padėka medikams, kurie kovojo su pandemija“, – nurodoma savivaldybės feisbuko įraše. Šio projekto autorė – Ugnė Guogytė. Šiuo metu dar žydinčias tulpes gėlyne greitai pakeis česnakų ir katžolių žiedai. Vėliau sulauksime vilkdalgių, ežiuolių, monardų, siūbuojančių žolynų. Rudenį pakartotinai sužydės katžolės, pasirodys astrų ir vilkpupių žiedynai. Įspūdingo gėlyno vaizdai – LRT.lt nuotraukų galerijoje.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/laisvalaikis/13/1714677/nenusileidzia-net-levandu-laukams-santariskes-virto-geliu-rojumi-tukstanciai-ziedu-padeka-medikams",
    publishedAt: "2022-06-08T14:40:00+00:00",
    locations: ["santariskes", "northern-vilnius"],
    category: "evergreen",
    sourceConfidence: 100,
    geo: [
      { lat: 54.752, lng: 25.28, label: "Santariškės" }
    ],
  },
  {
    id: "de2d8a63-3523-45e8-816d-bcf027273766",
    title: "Pirmą kartą Baltijos šalyse: Vilnius laimėjo teisę rengti Europos vaikų ortopedų kongresą",
    summary: "2029 metais Vilnius priims prestižinį Europos vaikų ortopedų draugijos (EPOS) metinį kongresą.",
    fullText: "2029 metais Vilnius priims prestižinį Europos vaikų ortopedų draugijos (EPOS) metinį kongresą. Teisė rengti kongresą Vilniui suteikta po kelerius metus trukusio Lietuvos vaikų ortopedų bendruomenės bei Vilniaus miesto turizmo ir verslo plėtros agentūros „Go Vilnius“ bendradarbiavimo. Teisė organizuoti tarptautinių asociacijų kongresus dažniausiai suteikiama konkurencinės atrankos būdu – miestai vertinami pagal infrastruktūrą, organizacines galimybes, mokslo potencialą ir vietos ekspertų aktyvumą tarptautinėje profesinėje bendruomenėje. EPOS yra viena svarbiausių Europos profesinių organizacijų, vienijanti specialistus, dirbančius vaikų raumenų ir kaulų sistemos sveikatos srityje. Kasmet vykstantis kongresas yra pagrindinė platforma pristatyti naujausius mokslinius tyrimus, aptarti pažangiausius gydymo metodus ir stiprinti tarptautinį bendradarbiavimą. „Tai svarbus visos Lietuvos vaikų ortopedų bendruomenės įvertinimas. Tokie sprendimai nepriimami po vieno gero pristatymo – juos lemia daugelį metų kuriamas profesinis autoritetas, aktyvus dalyvavimas EPOS veikloje ir tarptautinių kolegų pasitikėjimas. Lietuvos vaikų ortopedų bendruomenė nuosekliai įsitraukia į draugijos veiklą, mokslinius projektus ir darbo grupes, todėl tai, kad 2029 metų kongresas vyks Vilniuje, yra visos mūsų bendruomenės pripažinimas“, – sako Vilniaus kandidatūros paraišką rengęs vaikų ortopedas traumatologas dr. Giedrius Bernotavičius. Anot gydytojo, tokie tarptautiniai susitikimai dažnai tampa naujų mokslinių tyrimų, klinikinių iniciatyvų ir tarptautinių projektų pradžia. Vaikų ortopedijoje nemažai ligų yra retos, todėl vienos šalies patirties dažnai nepakanka – bendradarbiaujant tarptautiniu mastu galima sukaupti daugiau duomenų, kurti pažangesnes gydymo rekomendacijas ir greičiau diegti naujus sprendimus, kurie ilgainiui pasiekia pacientus. Pasak „Go Vilnius“ Konferencijų biuro vadovės Vitos Žilinskaitės, ši sėkmė dar kartą patvirtina, kad tarptautines konferencijas į miestus atveda stiprios vietos profesinės bendruomenės. „Stiprios tarptautinės konferencijos prasideda nuo stiprių vietos ekspertų bendruomenių. Būtent jų autoritetas ir aktyvus įsitraukimas tarptautinėse organizacijose atver",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/vilnius-laimejo-teise-rengti-europos-vaiku-ortopedu-kongresa",
    publishedAt: "2026-09-01T10:00:00+03:00",
    locations: ["santariskes", "northern-vilnius"],
    category: "science",
    sourceConfidence: 100,
    geo: [
      { lat: 54.752, lng: 25.28, label: "Santariškės" }
    ],
    curated: true,
  },
  {
    id: "29b16dfb-70b6-406e-b15d-68a56be66c1c",
    title: "Architektė apie medines Šnipiškes: tai yra ne periferija, o miesto tapatybės branduolys",
    summary: "„Šiandien Šnipiškės – kontrastų ir spartaus virsmo rajonas. Čia susikerta keli miesto sluoksniai: medinės architektūros paveldas ir tarp sovietinių daugiabučių bei buvusių pramoninių teritorijų iškilę 21 a. dangoraižiai“, – Viniaus miesto muziejaus parengtoje publikacijoje sako architektė Evelina Bartusevičiūtė.",
    fullText: "„Šiandien Šnipiškės – kontrastų ir spartaus virsmo rajonas. Čia susikerta keli miesto sluoksniai: medinės architektūros paveldas ir tarp sovietinių daugiabučių bei buvusių pramoninių teritorijų iškilę 21 a. dangoraižiai“, – Viniaus miesto muziejaus parengtoje publikacijoje sako architektė Evelina Bartusevičiūtė. Pernai Šnipiškėse vykusios Europos paveldo dienos kvietė pamatyti šį miesto rajoną nauju kampu ir ypatingą dėmesį skyrė šnipiškiečių bendruomenei. Vilniaus miesto muziejaus Medinės architektūros centras kartu su vietos gyventojais čia kūrė dviejų dienų renginių programą, kurioje paveldas tapo istorijos liudininku ir gyvu šiuolaikinės bendruomenės veikėju. Šiemet Europos paveldo dienos rugsėjo 19 d. sugrįžta į Šnipiškes ir šį unikalų rajoną tyrinės per senųjų ir naujųjų amatų temą. Apie bendruomenę bei medinę architektūrą, tapusią gyvu miesto sluoksniu ir aktyviu bendruomenės veikėju, – pokalbis su Vilniaus miesto muziejaus bendruomenių projektų kuratore, architekte Evelina Bartusevičiūte ir sociologu bei darbo su bendruomenėmis ekspertu Pauliumi Godvadu. – Kaip apibūdintumėte Šnipiškes šiandien – koks tai rajonas miesto kontekste? E. Bartusevičiūtė: Šiandien Šnipiškės – kontrastų ir spartaus virsmo rajonas. Čia susikerta keli miesto sluoksniai: medinės architektūros paveldas ir tarp sovietinių daugiabučių bei buvusių pramoninių teritorijų iškilę 21 a. dangoraižiai. Manau, Šnipiškės atspindi miesto kaitą. Tai vieta, kur praeitis, dabartis ir ateitis ne tik egzistuoja drauge, bet ir aktyviai formuoja viena kitą.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/kultura/12/3054286/architekte-apie-medines-snipiskes-tai-yra-ne-periferija-o-miesto-tapatybes-branduolys",
    publishedAt: "2026-09-19T07:13:00+00:00",
    locations: ["snipiskes", "northern-vilnius"],
    category: "culture",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6995, lng: 25.2762, label: "Medinės Šnipiškės" }
    ],
  },
  {
    id: "d123e031-a593-4c13-a7c9-e4ff30b4ea34",
    title: "„KRS“ už 9,6 mln. eurų statys naują darželį Šnipiškėse",
    summary: "Sostinės Šnipiškėse, buvusių garažų teritorijoje, iškils naujas lopšelis-darželis – jį statys bendrovė „KRS“, pranešė Vilniaus vystymo kompanija.",
    fullText: "Sostinės Šnipiškėse, buvusių garažų teritorijoje, iškils naujas lopšelis-darželis – jį statys bendrovė „KRS“, pranešė Vilniaus vystymo kompanija. Viešajame pirkime žemiausią kainą pasiūliusi įmonė įsipareigojo darželį pastatyti už 9,61 mln. eurų (be PVM). Planuojama, kad naujo lopšelio-darželio Kernavės gatvėje statyba prasidės jau rugpjūtį, o visi darbai truks pusantrų metų. Numatoma, kad naująjį darželį galės lankyti apie 280 mažųjų vilniečių. Jame veiks 14 priešmokyklinio ir ikimokyklinio ugdymo grupių, dirbs apie 60 darbuotojų. Šiuo metu taip pat rengiamasi ir darželio sklypą ribojančių Kernavės ir Linkmenų gatvių atkarpų remontui. Šalia būsimos ugdymo įstaigos ketinama įrengti žiedinę sankryžą, laikino sustojimo vietas automobiliams, patogius pėsčiųjų takus ir saugias perėjas.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/svietimas/45/2999090/krs-uz-9-6-mln-euru-statys-nauja-darzeli-snipiskese",
    publishedAt: "2026-07-23T07:07:00+00:00",
    locations: ["snipiskes", "northern-vilnius"],
    category: "news",
    sourceConfidence: 100,
    geo: [
      { lat: 54.7005, lng: 25.2758, label: "Šnipiškės · darželis" }
    ],
  },
  {
    id: "aceb602b-8dad-41f0-b63d-4d4918422ec4",
    title: "Niujorkas Kalvarijų gatvėje: iš šiukšlių prikeltas istorinis butas, alsuojantis modernumu",
    summary: "Kadaise Šnipiškės buvo Vilniaus priemiestis, gyvenęs savo ritmu, tačiau šiandien čia – pats miesto centras. Viena pagrindinių Kalvarijų gatvė judri ir gana triukšminga, o joje stovinčiuose namuose gausu kontrastų – čia ir krosnimi besišildantys kaimynai, ir modernią estetiką sukūrę gyventojai.",
    fullText: "Kadaise Šnipiškės buvo Vilniaus priemiestis, gyvenęs savo ritmu, tačiau šiandien čia – pats miesto centras. Viena pagrindinių Kalvarijų gatvė judri ir gana triukšminga, o joje stovinčiuose namuose gausu kontrastų – čia ir krosnimi besišildantys kaimynai, ir modernią estetiką sukūrę gyventojai. LRT.lt laidoje „Interjero terjeras“ Dovas Serapinas svečiuojasi beveik prieš 130 metų statytame name, kuriame architektė Viktorija Puodžiūtė-Jurkšaitė kartu su vyru Andriumi rado svajonių namus. Pasižvalgyti po Kalvarijų gatvėje įsikūrusius namus galite čia:",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/laisvalaikis/13/2906142/niujorkas-kalvariju-gatveje-is-siuksliu-prikeltas-istorinis-butas-alsuojantis-modernumu",
    publishedAt: "2026-04-25T11:11:00+00:00",
    locations: ["kalvariju", "snipiskes", "northern-vilnius"],
    category: "culture",
    sourceConfidence: 100,
    geo: [
      { lat: 54.7045, lng: 25.2748, label: "Kalvarijų g." }
    ],
  },
  {
    id: "29e96195-0ec7-4e75-a63c-5b632c41e0b6",
    title: "Vilnius 6 gidų akimis: gatvės, kurios žavi, stebina ir atspindi miesto veidą",
    summary: "Sostinės gidų paprašėme atskleisti, kurios Vilniaus gatvės juos žavi labiausiai, slepia daugiausia istorijų ir stebina išskirtinumu. Kviečiame pažvelgti į Vilnių jų akimis – per gatves, kurios atskleidžia ir asmeninį santykį su miestu, ir bendrą sostinės charakterį.",
    fullText: "Sostinės gidų paprašėme atskleisti, kurios Vilniaus gatvės juos žavi labiausiai, slepia daugiausia istorijų ir stebina išskirtinumu. Kviečiame pažvelgti į Vilnių jų akimis – per gatves, kurios atskleidžia ir asmeninį santykį su miestu, ir bendrą sostinės charakterį. Nuo trumpesnių iki ilgesnių, nuo vingiuotų iki einančių kone tiesia linija, nuo ramesnių iki nuolat šurmuliuojančių – Vilniuje gatvių yra visokių, o ar paprasta išsirinkti vieną mėgstamiausią? Sostinės gidai išskyrė kelias, kurios jiems patinka labiausiai. „Šiandien tai būtų M. K. Čiurlionio gatvė. Einant ja, akys visuomet džiaugiasi J. Montvilos kolonijos pastatais, buvusia junkerių mokykla, Vilniaus universiteto observatorija, o tada pasitinka Vingio parkas, kuriame gera pasivaikščioti, kai norisi pailsėti nuo miesto šurmulio“, – sako gidas Andrius Pavelko .",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/laisvalaikis/13/2965298/vilnius-6-gidu-akimis-gatves-kurios-zavi-stebina-ir-atspindi-miesto-veida",
    publishedAt: "2026-06-21T15:22:00+00:00",
    locations: ["old-town", "vilnius-centre", "kalvariju"],
    category: "evergreen",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6855, lng: 25.2878, label: "Vilniaus gatvės" }
    ],
  },
  {
    id: "f5f3a9b3-f57f-451a-a713-9fd556c335fe",
    title: "Parodą Šnipiškėse atidariusi Riaukė: ateities kartoms turime perduoti ne tik namo fasadą",
    summary: "Europos paveldo dienų Šnipiškėse metu, rugsėjo 19 d., Šnipiškių medinuke, Vilniaus miesto muziejaus Medinės architektūros centro erdvėje, skirtoje šnipiškiečiams, atidaryta Linos Riaukės paroda „(Ne)eilinė šnipiškiečio diena“. Parodoje autorė kviečia ne tik žiūrėti, bet ir klausytis, uosti bei liesti – patirti Šnipiškes gyvai, rašoma muziejaus pranešime žiniasklaidai.",
    fullText: "Europos paveldo dienų Šnipiškėse metu, rugsėjo 19 d., Šnipiškių medinuke, Vilniaus miesto muziejaus Medinės architektūros centro erdvėje, skirtoje šnipiškiečiams, atidaryta Linos Riaukės paroda „(Ne)eilinė šnipiškiečio diena“. Parodoje autorė kviečia ne tik žiūrėti, bet ir klausytis, uosti bei liesti – patirti Šnipiškes gyvai, rašoma muziejaus pranešime žiniasklaidai. Apie rajono gyvybę, gyvą paveldą ir Šnipiškių kaitą – pokalbis su šnipiškiete, parodos autore L. Riauke. – Šnipiškėse gyvenu apie trisdešimt metų. Man tai – namų jausmas, kuriame gyvi ir mano pačios prisiminimai: močiutės kaimas, mama, tėvukas. Jų jau nebėra, bet gyvendama čia jaučiu, kad visa tai tebėra gyva manyje. Net savo būstą išsirinkau išgirdusi, kaip užgiedojo kaimynės Monikos gaidys. Miesto centre! Kažkada suvokiau keistą, bet man labai svarbų dalyką: nors gimiau Vilniuje, mieste, miestas yra gamtoje, o ne gamta mieste. Šnipiškėse gamta dar tebėra visiškai gyva. Turime savo ežiuką kieme, žiemą sutinku lapę, ateinančią su didele pūsta uodega. Kaimynai irgi turi savų globotinių, pasišnekame apie juos. Šiemet iš kaimynės Česlavos darželio prisikasiau senovinių veislių bijūnų.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/kultura/12/3075375/paroda-snipiskese-atidariusi-riauke-ateities-kartoms-turime-perduoti-ne-tik-namo-fasada",
    publishedAt: "2026-10-07T13:58:00+00:00",
    locations: ["snipiskes", "business-district"],
    category: "culture",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6985, lng: 25.2775, label: "Šnipiškės" }
    ],
  },
  {
    id: "51a59807-29e1-45fb-86c0-5c7823290122",
    title: "Superkompiuterio neužtenka: kokį vaidmenį Lietuvos DI ambicijose gali atlikti tarptautinės konferencijos?",
    summary: "Rugpjūčio pabaigoje Vilnius vėl taps tarptautinės dirbtinio intelekto bendruomenės susitikimo vieta. Rugpjūčio 24-30 d. čia vyks „Declarative AI 2026“, vienijantis tris tarptautinius renginius ir ekspertus, kurie dirba su vienais aktualiausių šiandienos DI",
    fullText: "Rugpjūčio pabaigoje Vilnius vėl taps tarptautinės dirbtinio intelekto bendruomenės susitikimo vieta. Rugpjūčio 24-30 d. čia vyks „Declarative AI 2026“, vienijantis tris tarptautinius renginius ir ekspertus, kurie dirba su vienais aktualiausių šiandienos DI Su šiais klausimais vis dažniau susiduriame ir kasdieniame gyvenime. Jei DI sistema padeda vertinti kredito riziką, parinkti gydymą ar priimti sprendimus viešajame sektoriuje, svarbus tampa ne tik jos pateiktas atsakymas, bet ir galimybė suprasti, kodėl toks sprendimas buvo priimtas. Tačiau Vilniui tokių konferencijų vertė nesibaigia jų programa ar kelioms dienoms atvykstančiais dalyviais. Lietuvai investuojant į DI infrastruktūrą, vis aktualesnis tampa kitas klausimas – kas ir kaip šias technologines galimybes pavers naujais tyrimais, produktais ir verslais? Lietuva kuria nacionalinį dirbtinio intelekto fabriką „LitAI“, tapsiantį Europos DI fabrikų tinklo dalimi. Jis turėtų suteikti mokslui, verslui ir viešajam sektoriui prieigą prie pažangios DI skaičiavimo infrastruktūros, duomenų ir ekspertinių paslaugų. Lietuvos dirbtinio intelekto asociacijos prezidentas dr. Linas Petkevičius sako, kad tokia infrastruktūra yra didelis žingsnis, tačiau jos potencialui išnaudoti reikės ne mažiau svarbaus resurso – talento ir kompetencijų. „Galime turėti labai galingą skaičiavimo infrastruktūrą, tačiau pati savaime ji inovacijų nesukurs. Reikia talentų, kurie moka ją panaudoti – tyrėjų, inžinierių, doktorantų, įmonių, kuriančių naujus DI sprendimus. Tarptautinės konferencijos leidžia dalį pasaulinės kompetencijos atsivežti į Vilnių, taip čia susitinka žmonės, kurie kuria naujausias technologijas, ir vietos bendruomenė, kuri gali tas žinias perimti ir pritaikyti“, – teigia dr. L. Petkevičius. Vilnius tarptautines DI bendruomenes pritraukia jau ne pirmus metus. Kartu su Lietuvos dirbtinio intelekto asociacija miestas yra laimėjęs keturis tarptautinių DI ir mašininio mokymosi renginių konkursus, o jau pritraukti renginiai į Vilnių subūrė arba šiemet dar suburs daugiau kaip 1,5 tūkst. pasaulinių šios srities ekspertų. Kai DI konferencijoje sprendžiama sunkvežimio problema Vienas ryškiausių pavyzdžių – prieš porą metų Vilniuje s",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/superkompiuterio-neuztenka",
    publishedAt: "2026-09-01T10:00:00+03:00",
    locations: ["snipiskes", "business-district", "vilnius-centre"],
    category: "science",
    sourceConfidence: 100,
    geo: [
      { lat: 54.698, lng: 25.278, label: "Verslo rajonas" }
    ],
    curated: true,
  },
  {
    id: "f38a553b-b48a-4fad-8311-423f085d498b",
    title: "Protestuotojai apie statybas prie Neries: Vilnius nebėra žalias, jis pilkas ir rudas",
    summary: "Trečiadienį Vilniuje prie savivaldybės vyko protestas prieš planuojamą Neries pakrantės urbanizaciją, kurios metu prie upės atsiras statiniai bei automobilių stovėjimo aikštelės, bus kertami medžiai.",
    fullText: "Trečiadienį Vilniuje prie savivaldybės vyko protestas prieš planuojamą Neries pakrantės urbanizaciją, kurios metu prie upės atsiras statiniai bei automobilių stovėjimo aikštelės, bus kertami medžiai. Per smarkią liūtį į protestą susirinko apie pusantro šimto vilniečių. Protesto organizatoriai yra nevyriausybinės ekologijos ir klimato organizacijos „Fridays For Future Lietuva“, „Extinction Rebellion Lietuva“, Gegužės 1-osios profesinė sąjunga. „Fridays For Future Lietuva“ atstovė Viltė Zaveckaitė kalbėjo, kad ne veltui protestas vyksta Europą alinant rekordinei kaitrai, tai verčia susimąstyti apie medžių svarbą.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/lietuvoje/2/2977319/protestuotojai-apie-statybas-prie-neries-vilnius-nebera-zalias-jis-pilkas-ir-rudas",
    publishedAt: "2026-07-01T15:12:00+00:00",
    locations: ["neris", "snipiskes", "vilnius-centre"],
    category: "news",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6935, lng: 25.2775, label: "Neries krantinė" }
    ],
  },
  {
    id: "2ad77fdf-d191-4e74-a01e-edeea79e258d",
    title: "Vilnius – tarp „The New York Times“ kelionių rekomendacijų: kuo miestas sužavėjo leidinio žurnalistus?",
    summary: "Vienas įtakingiausių pasaulio leidinių „The New York Times“ pakvietė skaitytojus savaitgaliui į Vilnių. „36 Hours“ kelionių rubrikoje publikuotas išsamus maršrutas po Lietuvos sostinę – nuo istorinių vietų ir muziejų iki restoranų, barų, viešbučių bei meno",
    fullText: "Vienas įtakingiausių pasaulio leidinių „The New York Times“ pakvietė skaitytojus savaitgaliui į Vilnių. „36 Hours“ kelionių rubrikoje publikuotas išsamus maršrutas po Lietuvos sostinę – nuo istorinių vietų ir muziejų iki restoranų, barų, viešbučių bei meno „Milijonai žmonių visame pasaulyje kelionių kryptis renkasi remdamiesi patikimų kelionių žurnalistų rekomendacijomis. Todėl mums svarbu ne tik priimti tokių leidinių atstovus Vilniuje, bet ir padėti jiems pažinti miestą autentiškai – parodyti jo charakterį, supažindinti su žmonėmis, kultūra ir patirtimis, kurių neatrasi turistiniuose giduose. Būtent taip gimsta autentiškos istorijos, turinčios kur kas didesnį poveikį pritraukiant turistus. Džiaugiamės, kad Vilnius pateko į vieną įtakingiausių pasaulio kelionių rubrikų, ir tikime, kad ši publikacija paskatins dar daugiau žmonių atrasti mūsų miestą“, – sako Vilniaus miesto turizmo ir verslo plėtros agentūros „Go Vilnius“ komunikacijos vadovė Eglė Girdzijauskaitė. Straipsnyje Vilnius apibūdinamas kaip miestas, kuriame šiuolaikinė gastronomija dera su vietinėmis tradicijomis, technologijų sektoriaus augimas suteikia naujos energijos istoriniam senamiesčiui, o naujos miesto iniciatyvos – elektriniai laiveliai Neryje bei modernizuotas oro uostas – papildo sparčiai besikeičiantį sostinės veidą. Leidinys taip pat atkreipia dėmesį į augantį Vilniaus matomumą tarptautiniuose kino projektuose. Skaitytojams siūlomas 36 valandų maršrutas apima svarbiausius miesto objektus – Valdovų rūmus, Gedimino pilies bokštą, Aušros vartus, Lukiškių kalėjimą, Užupį, MO muziejų ir Šiuolaikinio meno centrą. Greta kultūros objektų rekomenduojama pasivaikščioti senamiesčio gatvėmis, leistis į kelionę elektriniu laiveliu Nerimi, o miesto atmosferą pažinti ne tik lankant muziejus, bet ir užsukant į vietinių pamėgtas erdves. Didelis dėmesys publikacijoje skiriamas ir Vilniaus gastronomijai. „The New York Times“ skaitytojams rekomenduoja paragauti lietuviškos virtuvės klasikų – cepelinų ir šaltibarščių, apsilankyti restoranuose, pavyzdžiui, „Džiaugsmas“, „Demoloftas“, „Etno dvaras“, o vakaro pabaigai užsukti į barus „Šnekutis“, „Alchemikas“ bei kitas miesto gastronomines erdves. Nakvynei leidin",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/vilnius-tarp-the-new-york-times-kelioniu-rekomendaciju",
    publishedAt: "2026-09-01T10:00:00+03:00",
    locations: ["old-town", "vilnius-centre", "neris"],
    category: "evergreen",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6867, lng: 25.2907, label: "Senamiestis" }
    ],
    curated: true,
  },
  {
    id: "0ba808b6-a6cd-421d-b57f-b7d35549e0bd",
    title: "Vilniuje atsiras trys naujos viešojo transporto stotelės",
    summary: "Vilniuje nuo šeštadienio keičiasi dalies viešojo transporto maršrutų tvarka, pranešė savivaldybės įmonė „Judu“.",
    fullText: "Vilniuje nuo šeštadienio keičiasi dalies viešojo transporto maršrutų tvarka, pranešė savivaldybės įmonė „Judu“. Pokyčiai susiję su 119 ir 123 maršrutų autobusais. Anot „Judu“, nuo šeštadienio 119 maršrutu kursuos talpesni autobusai, o 123 maršruto autobusai nuo šiol važiuos iki Riovonių.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/eismas/7/3078008/vilniuje-atsiras-trys-naujos-viesojo-transporto-stoteles",
    publishedAt: "2026-10-10T03:48:00+00:00",
    locations: ["stotis", "new-town", "vilnius-centre"],
    category: "transport",
    sourceConfidence: 100,
    geo: [
      { lat: 54.672, lng: 25.28, label: "Vilniaus transportas" }
    ],
  },
  {
    id: "824db897-2260-4446-8ad5-52593ac6771d",
    title: "Festivalyje „Vilnius Jazz“ – Lietuvos džiazo novatorių idėjos",
    summary: "Artėjanti 38-oji šiuolaikinio džiazo ir improvizacinės muzikos šventė „Vilnius Jazz“ tarp žanro pasaulinių aktualijų pažers ir Lietuvos įdomiausių improvizuotojų kūrybos naujienų, rašoma organizatorių pranešime žiniasklaidai.",
    fullText: "Artėjanti 38-oji šiuolaikinio džiazo ir improvizacinės muzikos šventė „Vilnius Jazz“ tarp žanro pasaulinių aktualijų pažers ir Lietuvos įdomiausių improvizuotojų kūrybos naujienų, rašoma organizatorių pranešime žiniasklaidai. Spalio 15 d. Vilniaus senojo teatro scenoje specialiai festivaliui sukurtą autorinę kompoziciją „Kai kalba sugrįžta į savo muzikinę atmintį“ pristatys kompozitorius ir pianistas Tomas Kutavičius su bendraminčių kvartetu. Pasak autoriaus, projektą įkvėpė poeto Mindaugo Milašiaus-Montės eilėraštis „Kamis“ ir garsaus semiotiko bei rašytojo Umberto Eco filosofinė įžvalga apie kalbos ištakas. Kas slypi už žodžio, prieš jam tampant reikšme? Muzikantai bandys atsakyti į šį klausimą, pasitelkę garsą, kvėpavimą, ritmą, vibraciją. Tiltu tarp archajiško kalbos suvokimo ir šiuolaikinės improvizacinės muzikos taps M. Milašiaus-Montės eilėraštis apie japonų mitinę būtybę, krutėjimu sukeliančią žemės drebėjimus, tapsiančią kūrinyje garsine nematomos jėgos metafora. M. Milašiaus-Montės eilės – tai poezijos laisvasis džiazas, įtraukiantis netikėtais posūkiais, žongliravimu raidžių skambesiais ir prasmėmis. Stiprus garsinis fonas čia kartais yra ne mažiau svarbus už loginę eilėraščio prasmę. Spalio 17 d. neįprastos sudėties kvartetą „Ward no. 4“ pristatys saksofonininkas, Lietuvos muzikos ir teatro akademijos pedagogas Liudas Mockūnas. Jis pakvietė kartu groti kolegą multiinstrumentininką Arną Mikalkėną ir jųdviejų buvusius studentus tūbininkus – Simoną Kaupinį ir Miką Kurtinaitį. Šis kvartetas debiutavo 2024-aisiais Hadersfildo šiuolaikinės muzikos festivalyje Anglijoje.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/kultura/12/3077071/festivalyje-vilnius-jazz-lietuvos-dziazo-novatoriu-idejos",
    publishedAt: "2026-10-09T06:27:00+00:00",
    locations: ["old-town", "vilnius-centre", "stotis"],
    category: "music",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6786, lng: 25.2818, label: "Vilniaus senasis teatras" }
    ],
  },
  {
    id: "bf153cb0-0067-4dc6-bda1-43ca8312baea",
    title: "MO muziejuje – nauja tarptautinė paroda: į atidarymą rinkosi kviestiniai meno gerbėjai",
    summary: "Ketvirtadienio vakarą MO muziejuje, Vilniuje, įvyko naujos didžiosios parodos „Ar tai tikra? Menas, technologijos ir mes“ (kuratoriai Marius Armonas, Jurijus Dobriakovas, Eglė Rindzevičiūtė, Philippas Ziegleris) pristatymas kviestiniams meno gerbėjams.",
    fullText: "Ketvirtadienio vakarą MO muziejuje, Vilniuje, įvyko naujos didžiosios parodos „Ar tai tikra? Menas, technologijos ir mes“ (kuratoriai Marius Armonas, Jurijus Dobriakovas, Eglė Rindzevičiūtė, Philippas Ziegleris) pristatymas kviestiniams meno gerbėjams. Paroda rengiama drauge su viena didžiausių Europos medijų meno institucijų – ZKM | Karlsrūhės meno ir medijų centru. MO vadovė Milda Ivanauskienė sako, kad nuo pat pradžių vystant idėją kartu su ZKM komanda buvo aišku, jog tai neturi būti dar viena paroda apie technologijas. „Pasirodė kur kas svarbiau ir aktualiau patyrinėti, ką technologijos pasako apie mus pačius. Šiandien jos tapo beveik nematomu mūsų kasdienybės sluoksniu, keisdamos ne tik tai, kaip dirbame, bendraujame ar kuriame, bet ir tai, kaip patiriame tikrovę. Todėl ši paroda pirmiausia yra apie žmogų“, – pasakoja M. Ivanauskienė.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/kultura/12/3076158/mo-muziejuje-nauja-tarptautine-paroda-i-atidaryma-rinkosi-kviestiniai-meno-gerbejai",
    publishedAt: "2026-10-08T17:15:00+00:00",
    locations: ["new-town", "vilnius-centre", "stotis"],
    category: "culture",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6795, lng: 25.2778, label: "MO muziejus" }
    ],
  },
  {
    id: "30061c39-0d72-40b6-aafa-a919e4e54c63",
    title: "Naujas tarptautinis Vilniaus pozicionavimas: sostinė, kurioje išskirtinius rezultatus pasiekti lengviau",
    summary: "Vilniaus miesto verslo ir turizmo plėtros agentūra „Go Vilnius“ pristato naują tarptautinį Vilniaus pozicionavimą – strateginę kryptį",
    fullText: "Vilniaus miesto verslo ir turizmo plėtros agentūra „Go Vilnius“ pristato naują tarptautinį Vilniaus pozicionavimą – strateginę kryptį Kuriant naująją kryptį į procesą įsitraukė daugiau nei 600 žmonių – vilniečiai, tikslinių auditorijų atstovai iš užsienio, „Investuok Lietuvoje“, „Keliauk Lietuvoje“, Vilniaus miesto savivaldybės, verslo, turizmo, renginių, akademinės, kūrybinės ir gastronomijos bendruomenių atstovai. Pozicionavimas formuotas remiantis apklausomis, fokus grupių diskusijomis, giluminiais interviu ir strateginėmis sesijomis. „Vilniui nereikia konkuruoti dydžiu su didžiausiais Europos miestais. Mūsų stiprybė – kompaktiškas ir žmogui pritaikytas miesto mastelis: trumpesni atstumai, glaudesni ryšiai, lengvesnis pasiekiamumas, greitesni sprendimai. Visa tai reiškia mažiau kliūčių, todėl čia išskirtinius rezultatus pasiekti yra lengviau. Norime, kad šis Vilniaus pranašumas taptų aiškiai atpažįstamas tarptautiniu mastu“, – sako „Go Vilnius“ vadovė Dovilė Aleksandravičienė. Naujosios pozicionavimo krypties kūrybinė išraiška – šūkis „Vilnius: Never Ordinary“. Jis apibūdina Vilnių kaip neįprastą miestą, kuriame išskirtinius rezultatus pasiekti lengviau, nes atstumai jame trumpesni, o žmonės, galimybės ir sprendimai – arčiau. Kiekvienai auditorijai ši kryptis išreiškiama jai aktualiu vertės pasiūlymu. Investuotojams Vilnius bus pristatomas kaip miestas, kuriame technologijų verslui lengviau augti – dėl greitesnių sprendimų, koncentruotos inovacijų ekosistemos bei talentų pasiūlos: „Vilnius: where global tech comes to scale up.“ (liet. Vilniuje technologijų verslas auga greičiau) Užsienio talentams – kaip miestas, kuriame karjerą galima kurti greičiau išlaikant gyvenimo kokybę – dėl augančios ekosistemos, lengvai pasiekiamų galimybių ir kompaktiško, patogaus gyventi miesto: „Vilnius: Europe’s most livable career accelerator.“ (liet. Vilniuje karjera greitėja be perdegimo). Konferencijų organizatoriams – kaip kompaktiškas miestas, kuriame dėl trumpų atstumų ir lengvai pasiekiamų partnerių renginius organizuoti paprasčiau, miestą įtraukti į programą lengviau, o kurti įsimintiną dalyvių patirtį ir ilgiau išliekančią renginio vertę – daugiau galimybių. „Vilnius: w",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/naujas-tarptautinis-vilniaus-pozicionavimas",
    publishedAt: "2026-09-01T10:00:00+03:00",
    locations: ["vilnius-centre", "old-town"],
    category: "news",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6872, lng: 25.2797, label: "Vilniaus centras" }
    ],
    curated: true,
  },
  {
    id: "996a94a2-077c-421b-a1aa-ed973680a16d",
    title: "Pasaulinė turizmo diena: kokio Vilniaus šiandien ieško pasaulio keliautojai",
    summary: "Rugsėjo 27-ąją minima Pasaulinė turizmo diena – proga pažvelgti ne tik į kelionių statistiką, bet ir į tai, ko šiandien ieško miesto svečiai.",
    fullText: "Rugsėjo 27-ąją minima Pasaulinė turizmo diena – proga pažvelgti ne tik į kelionių statistiką, bet ir į tai, ko šiandien ieško miesto svečiai. Pasas „Go Vilnius“ Turizmo skyriaus vadovės Vilmos Daubarienės, „Meet a Local“ leidžia miesto svečiams Vilnių pažinti vietinių akimis, o patiems vilniečiams – iš naujo pamatyti savo miestą. Turistų istorijos dažnai atskleidžia, kad tai, kas vietiniams atrodo įprasta, svečiams neretai tampa įsimintiniausiais kelionės atradimais. Pavyzdžiui, vienas turistas iš Islandijos daugiausia dėmesio skyrė Vilniaus medžiams ir miesto žalumai. Kiti svečiai nuolat mini miesto švarą, tvarką ir žaliąsias erdves, stebisi kompaktiškame centre esančia bažnyčių gausa. Keliautojus domina ir netikėtos kasdienybės detalės. Viešnia iš Italijos didžiausią įspūdį padarė tai, kad automobiliai sustoja prie pėsčiųjų perėjų, o turistų pora iš Meksikos, vaikščiodama po Senamiestį, susižavėjo Prezidentūros kieme pamačius robotą žoliapjovę. Ne mažiau svarbi ir gastronomija. Į Vilnių atvykusios viešnios iš Italijos aktyviai ieškojo tradicinio lietuviško maisto, ragavo žirnius su spirgučiais ir norėjo geriau pažinti vietos virtuvę. Tokios patirtys rodo, kad keliautojams vis dažniau rūpi ne tik tai, ką galima pamatyti, bet ir tai, ką galima pajusti, paragauti ar patirti kartu su vietiniais. „Šios istorijos primena, kad šiandien kelionė vis mažiau yra lankytinų vietų sąrašo įvykdymas. Keliautojai nori prasmingų atradimų, žmogiško ryšio ir galimybės pažinti vietą iš vidaus. Kartais tam, kad iš naujo pamatytume savo miestą, tereikia pažvelgti į jį svečio akimis“, – sako Vilniaus miesto verslo ir turizmo plėtros agentūros „Go Vilnius“ Turizmo skyriaus vadovė Vilma Daubarienė. Pasaulinės turizmo dienos proga Vilniaus turizmo informacijos centre (TIC) pristatomas ir naujas audiovizualinis pasakojimas „Vilnius, įkvepiantis naujų jėgų“ („Let Vilnius Recharge You“). Jis kvies miesto svečius Vilnių pažinti per gamtos, kultūros ir poilsio patirtis. Vaizdo projekcijos ant TIC sienų bei lubų ir specialiai sukurtas garsinis pasakojimas atskleis Vilnių kaip žalią vandens ir kalvų miestą, kuriame gamta yra ne kažkas tolimo, o kasdienio gyvenimo dalis. Parkai ir miškai, Vilni",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/pasauline-turizmo-diena",
    publishedAt: "2026-09-01T10:00:00+03:00",
    locations: ["old-town", "vilnius-centre"],
    category: "evergreen",
    sourceConfidence: 100,
    geo: [
      { lat: 54.682, lng: 25.288, label: "Senamiestis" }
    ],
    curated: true,
  },
  {
    id: "cfe1b64b-7baa-41d9-862d-fa0331d2bee5",
    title: "Prie 100 metrų stalo susėdęs Vilnius pasveikino pirmųjų „Vilnius Is My City Awards“ laureatus",
    summary: "Vilniaus Bernardinų sodas šeštadienį tapo vieta, kur prie vieno stalo susitiko skirtingos kultūros, kalbos ir žmonių istorijos. Penktą kartą vyko tarptautinės bendruomenės šventė „Vilnius Is My City“.",
    fullText: "Vilniaus Bernardinų sodas šeštadienį tapo vieta, kur prie vieno stalo susitiko skirtingos kultūros, kalbos ir žmonių istorijos. Penktą kartą vyko tarptautinės bendruomenės šventė „Vilnius Is My City“. Prie bendro, net 100 metrų ilgio, stalo susėdo minia žmonių – Vilniuje gyvenančių skirtingų šalių bendruomenių atstovai, apdovanojimų nominantai, verslo, kultūros ir gastronomijos iniciatyvų kūrėjai, nuomonės formuotojai bei miesto gyventojai ir svečiai. Šventėje savo nacionalinius patiekalus pristatė kelios dešimtys Lietuvos sostinėje gyvenančių užsienio bendruomenių. Čia buvo galima paragauti įvairiausių gėrybių – nuo filipinietiškų desertų, persiškų šafrano gėrimų ir vokiškų riestainių iki škotiškų kiaušinių, čilietiškų pyragėlių, uzbekiško plovo ar vietnamietiškų vaišių. Aplink simbolinį stalą vyko kalbos žaidimai, pokalbiai ir edukacijos, taip pat šokiai bei dainos. „Vilnius – tarptautinis miestas, kurį kuria vis didesnė ir įvairesnė bendruomenė, o „Vilnius is My City“ jau tapo gražia šios augančios bendruomenės tradicija. Smagu matyti, kad kartu su miestu auga ir ši šventė – kasmet prie jos prisijungia vis daugiau žmonių, norinčių dalintis savo kultūra, idėjomis ir meile Vilniui “, – sako Vilniaus miesto verslo ir turizmo plėtros agentūros „Go Vilnius“ vadovė Dovilė Aleksandravičienė. Vienu svarbiausių šiųmečio renginio akcentų tapo pirmieji „Vilnius Is My City Awards“ apdovanojimai. Jais miestas padėkojo užsienio kilmės vilniečiams ir jų kuriamoms iniciatyvoms, kurios prisideda prie sostinės ekonominio, kultūrinio ir gastronominio gyvenimo bei garsina Vilnių tarptautinėje erdvėje. Nominacijos „Už verslą, kuriantį Vilnių“ apdovanojimas buvo skirtas Nyderalanduose gimusiam socialinio restorano „Pirmas blynas“ įkūrėjui Timui van Wijkui. Jo įsteigtame restorane žmonės su negalia gauna realias darbo ir profesinio tobulėjimo galimybes. Ši iniciatyva prisideda prie atviresnio požiūrio į negalią ir rodo, kad socialinė atsakomybė gali tapti sėkmingo verslo pagrindu. Nominacijos „Už kultūrinį Vilnių“ apdovanojimą pelnė organizacija „SPEAK Lithuania“, kuri padeda iš užsienio atvykusiems žmonėms lengviau įsilieti į miesto gyvenimą. Organizuojamos nemokamos kalbų mokymos",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/prie-100-metru-stalo-susedo-vilnius",
    publishedAt: "2026-09-01T10:00:00+03:00",
    locations: ["vilnius-centre", "old-town"],
    category: "events",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6855, lng: 25.2878, label: "Vilniaus centras" }
    ],
    curated: true,
  },
  {
    id: "fc850daa-4a2e-46b9-8b26-c3cf6f8d3f4d",
    title: "Šią vasarą Šaltibarščių traukiniu keliavo rekordinis skaičius keleivių",
    summary: "Nuo gegužės vidurio kursavusio Šaltibarščių traukinio sezonas baigėsi. Šią vasarą LTG grupės keleivių vežimo bendrovės „LTG Link“ ir Vilniaus miesto verslo ir turizmo plėtros agentūros „Go Vilnius“ traukiniu keliavo apie 64 000 keleivių.",
    fullText: "Nuo gegužės vidurio kursavusio Šaltibarščių traukinio sezonas baigėsi. Šią vasarą LTG grupės keleivių vežimo bendrovės „LTG Link“ ir Vilniaus miesto verslo ir turizmo plėtros agentūros „Go Vilnius“ traukiniu keliavo apie 64 000 keleivių. „Rekordinis keleivių skaičius rodo, kad Šaltibarščių traukinys, nors dekoruojamas dar tik antrus metus, jau tapo neatsiejama vasaros tradicija. Ši iniciatyva sėkmingai sujungia tvarų keliavimą ir išskirtinę kelionės patirtį, įkvėptą vieno ryškiausių Vilniaus renginių, todėl kasmet sulaukia vis didesnio keleivių dėmesio“, – sako LTG Link vadovė Kristina Meidė. Šiemet viduriniame traukinio vagone keleivius pasitiko vingiuojanti šaltibarščių upė, rožiniais akcentais dekoruotos sienos ir lubos bei išskirtinai papuošti langai. Šis teminis riedmuo – tai simbolinis kvietimas į Vilniuje vykstantį šaltibarščių festivalį „Vilnius Pink Soup Fest“. Pasak „Go Vilnius“ vadovės Dovilės Aleksandravičienės, ketvirtą kartą organizuotame festivalyje sudalyvavo beveik 34 tūkst. svečių iš užsienio, o Šaltibarščių traukinys tapo ne tik kvietimu apsilankyti šventėje, bet ir tarptautinį dėmesį pritraukiančia iniciatyva. „Šiemet kaimynei Lenkijai, mūsų strateginei turizmo rinkai, suorganizavome išskirtinę kelionę, kurią ypač įvertino žiniasklaida – apie Šaltibarščių traukinį parašė didžiausi Lenkijos naujienų portalai, vadindami jį unikaliu pasaulyje. Tai padėjo vien Lenkijoje potencialiai pasiekti 53 mln. auditoriją ir skleisti rožinę festivalio nuotaiką, įtraukiant Vilnių į vasaros kelionių žemėlapį“, – teigia D. Aleksandravičienė. Nors traukinys kursavo tarptautiniu maršrutu Vilnius–Mockava–Vilnius, rožine šaltibarščių tematika papuoštu vagonu galėjo keliauti ne tik Lenkijos kryptimi vykstantys keleiviai. Traukinys taip pat stojo Lentvaryje, Žasliuose, Kaišiadoryse, Kaune, Kazlų Rūdoje ir Marijampolėje. Šaltibarščių traukinys, kursavęs nuo gegužės 15 iki rugpjūčio 16 d., nuriedėjo beveik 90 00 kilometrų.",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/sia-vasara-saltibarsciu-traukiniu-keliavo-rekordinis-skaicius",
    publishedAt: "2026-09-01T10:00:00+03:00",
    locations: ["stotis", "new-town", "vilnius-centre"],
    category: "transport",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6705, lng: 25.284, label: "Vilniaus geležinkelio stotis" }
    ],
    curated: true,
  },
  {
    id: "b9f33e77-f5bb-4bf5-ac62-80cec31314f9",
    title: "Serialo „Ted Lasso“ žvaigždei J. Sudeikiui – oficialus pasiūlymas treniruoti Vilniaus „Žalgirio“ moterų futbolo komandą",
    summary: "Kas būtų, jei kultinio serialo „Ted Lasso“ žvaigždė Jasonas Sudeikis iš tiesų apsivilktų trenerio kostiumą ir išvestų futbolo komandą į aikštę... Vilniuje? Gali būti, kad jau netrukus ši iš pirmo žvilgsnio beprotiškai atrodanti idėja virs realybe.",
    fullText: "Kas būtų, jei kultinio serialo „Ted Lasso“ žvaigždė Jasonas Sudeikis iš tiesų apsivilktų trenerio kostiumą ir išvestų futbolo komandą į aikštę... Vilniuje? Gali būti, kad jau netrukus ši iš pirmo žvilgsnio beprotiškai atrodanti idėja virs realybe. Futbolo klubas „Vilniaus Žalgiris“, miesto verslo ir turizmo plėtros agentūra „Go Vilnius“ bei „Laisvės TV“ suvienijo jėgas netikėtai ir ambicingai iniciatyvai. Jau ketvirtąjį sezoną skaičiuojančio „Apple TV“ serialo „Ted Lasso“ žvaigždei Jasonui Sudeikiui išsiųstas oficialus kvietimas rudenį atvykti į Lietuvą ir bent savaitei tapti realiu Vilniaus „Žalgirio“ moterų komandos vyriausiuoju treneriu bei vadovauti komandai A lygos rungtynėse. J. Sudeikiui ir visai „Ted Lasso“ komandai skirtą kvietimą imtis naujų pareigų Vilniuje galima pamatyti ČIA . Kultinis „Apple TV“ serialas „Ted Lasso“ – pelnęs 139 nominacijas, iškovojęs 40 apdovanojimų ir tapęs pasauliniu fenomenu – ketvirtajame sezone atveria naują lapą: pagrindinis herojus imasi treniruoti moterų futbolo komandą. Reaguodamas į tai, Vilnius nusprendė lietuvių kilmės aktoriui pasiūlyti tikrą patirtį – atvykti į Lietuvos sostinę ir perimti moterų A lygos favoritės vadžias. J. Sudeikiui ir jo kuriamam personažui pažadėta visiška taktinė laisvė ir profesionalaus trenerių štabo užnugaris, kad Holivudo žvaigždės debiutas realiame futbole nevirstų pernelyg tikroviška „Ted Lasso“ serija. Jeigu J. Sudeikis priimtų kvietimą, Vilnius pasiruošęs jam pasiūlyti ne tik futbolą. Kadangi seriale trenerio Tedo Lasso dešinioji ranka Coach Beard garsėja meile keistoms vietoms, miestui teks pasirūpinti ir atitinkama programa už stadiono ribų. Futbolo klubo „Vilniaus Žalgiris“ prezidentas ir „Laisvės TV“ įkūrėjas Andrius Tapinas sako, kad ši idėja, visų pirma, gimė iš noro atkreipti daugiau dėmesio į moterų sportą, bet kartu tai ir puiki proga milijonams serialo gerbėjų visame pasaulyje parodyti Vilniaus drąsą bei kūrybiškumą. „Žinote tą garsųjį Tedo Lasso geltoną užrašą rūbinėje – „Believe“? Mes Vilniuje Tedu tikime visu 100 procentų, todėl jam ir legendiniam Coach Beard siūlome tikrą iššūkį, tikrą komandą ir tikras A lygos rungtynes. Komanda pasiruošusi, stadionas pasiruošęs, o Vilnius",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/serialo-ted-lasso-zvaigzdei-j-sudeikiui-oficialus-pasiulymas",
    publishedAt: "2026-09-01T10:00:00+03:00",
    locations: ["vilnius-centre", "new-town"],
    category: "sports",
    sourceConfidence: 100,
    geo: [
      { lat: 54.687, lng: 25.28, label: "Vilnius" }
    ],
    curated: true,
  },
  {
    id: "3e5aaa0a-f62b-486e-86d1-a478311b4c40",
    title: "Turizmo generuojama ekonominė nauda Vilniuje pernai išaugo iki 833 mln. eurų: užsieniečiai mieste užsibūna ilgiau, išleidžia daugiau",
    summary: "Lietuvos sostinėje svečiai iš užsienio praleido gerokai daugiau laiko, rodo naujausi apgyvendinimo statistikos duomenys. Sostinėje praėjusiais metais apsilankiusių užsienio turistų skaičius augo beveik 2 proc., tuo tarpu, nakvynių skaičius šoktelėjo 39,4%.",
    fullText: "Lietuvos sostinėje svečiai iš užsienio praleido gerokai daugiau laiko, rodo naujausi apgyvendinimo statistikos duomenys. Sostinėje praėjusiais metais apsilankiusių užsienio turistų skaičius augo beveik 2 proc., tuo tarpu, nakvynių skaičius šoktelėjo 39,4%. Praėjusiais metais Vilnius iš viso priėmė beveik 1,177 mln. turistų. Užsienio turistai sudarė 72 proc. visų sostinės svečių – jų skaičius, palyginti su 2024 m., augo 1,8 proc. ir pasiekė 848 tūkst., kai visoje šalyje sulaukta 1,62 mln. svečių iš užsienio. Skaičiuojant visus turistus, bendras jų skaičius buvo 4,9 proc. mažesnis nei užpernai – šį pokytį lėmė 19,6 proc. sumažėjęs vietos turistų skaičius. Tačiau svarbiausi augimo rodikliai – nakvynių skaičius ir viešnagės trukmė – kilo reikšmingai. Itin ryškus proveržis 2025 m. fiksuotas nakvynių skaičiaus rodiklyje. Vilniuje apsilankę užsienio turistai pernai mieste užsisakė daugiau kaip 2,15 mln. nakvynių – net 39,4 proc. daugiau nei 2024-aisiais. Vidutinė viešnagės Vilniuje trukmė išaugo nuo 1,85 iki 2,41 paros. „Praėjusiais metais matėme aiškią tendenciją – svečiai iš užsienio Vilniuje leido kur kas daugiau laiko, o tai miestui yra svarbiausia. Ilgesnė viešnagė reiškia, kad turistai daugiau išleidžia viešbučiuose, restoranuose, kultūros ir pramogų objektuose, o tai tiesiogiai prisideda prie miesto ekonomikos augimo“, – sako Vilniaus miesto turizmo ir verslo plėtros agentūros „Go Vilnius“ Turizmo skyriaus vadovė Vilma Daubarienė. Išaugus užsienio turistų viešnagės Vilniuje trukmei, padidėjo ir Lietuvos sostinėje jų išleidžiamos pinigų sumos. Pernai vidutinės vieno turisto kelionės išlaidos sudarė 393 eurus, o ekonominė nauda miestui siekė 833 mln. eurų. Daugiausiai užsienio turistų į Vilnių 2025 m. atvyko iš Lenkijos (104 tūkst., +3,9 proc.), Vokietijos (beveik 85 tūkst., +3,2 proc.) ir Latvijos (62,5 tūkst., +10,8 proc.). Ryškus pakilimas fiksuotas ir kitose atvykstamojo turizmo rinkose. Iš jų išsiskyrė Ispanija (+28,4 proc.), Suomija (+35 proc.) ir Italija (+10,3 proc.). Daugiau nei dvigubai – nuo 9,52 tūkst. užpernai iki beveik 19,2 tūkst. pernai – išaugo turistų iš Izraelio skaičius. „Matome, kad Vilnius vis dažniau patenka į keliautojų, ieškančių autentišk",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/turizmo-generuojama-ekonomine-nauda-vilniuje-pernai-isaugo",
    publishedAt: "2026-09-01T10:00:00+03:00",
    locations: ["old-town", "vilnius-centre", "stotis"],
    category: "news",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6858, lng: 25.2875, label: "Vilniaus centras" }
    ],
    curated: true,
  },
  {
    id: "99517258-cc85-4119-af45-6d100254d11b",
    title: "Rekordinis šaltibarščių festivalis: „Vilnius Pink Soup Fest“ šiemet pritraukė beveik 180 tūkst. dalyvių",
    summary: "Praėjusį savaitgalį visas Vilnius vėl pražydo rožine spalva, o šaltibarščių festivalis „Vilnius Pink Soup Fest“ dar kartą įrodė, kad jau yra tapęs vienu svarbiausių sostinės renginių. Per tris dienas festivalis iš viso pritraukė 176,65 tūkst. lankytojų.",
    fullText: "Praėjusį savaitgalį visas Vilnius vėl pražydo rožine spalva, o šaltibarščių festivalis „Vilnius Pink Soup Fest“ dar kartą įrodė, kad jau yra tapęs vienu svarbiausių sostinės renginių. Per tris dienas festivalis iš viso pritraukė 176,65 tūkst. lankytojų. Per ketverius metus Vilniaus turizmo ir verslo plėtros agentūros „Go Vilnius“ organizuojamas festivalis nuo 15 tūkst. dalyvių pirmaisiais metais išaugo daugiau nei dešimt kartų. Kitąmet laukia jau jubiliejinis penktasis „Vilnius Pink Soup Fest“. „Galima drąsiai sakyti, kad prieš keletą metų kaip žaisminga miesto iniciatyva prasidėjęs festivalis šiandien yra tapęs tikru tarptautiniu reiškiniu. Šiemet sulaukėme rekordinio lankytojų skaičiaus, didžiulio užsienio žiniasklaidos dėmesio ir dar kartą įsitikinome, kad šaltibarščiai gali būti puikia priežastimi atrasti Vilnių. „Vilnius Pink Soup Fest“ jau seniai nebėra tik smagus vienos dienos renginys – jis virto stipriu miesto tradicijos ženklu, rimtu ekonominiu impulsu sostinės verslams ir puikiu turizmo varikliu“, – sako „Go Vilnius“ vadovė Dovilė Aleksandravičienė. Pirminiai duomenys rodo, kad per tris dienas „Vilnius Pink Soup Fest“ sukurta bendra ekonominė vertė gali siekti apie 10 mln. eurų. Tai reiškia, kad festivalio ekonominė nauda jau prilygsta didelių tarptautinių konferencijų ar sporto renginių poveikiui miestui. Prie festivalio prisijungė daugiau nei 330 Vilniaus vietų, tarp jų restoranai, kavinės, barai, viešbučiai, muziejai, parduotuvės ir kitos miesto erdvės – tai didžiausias verslo ir bendruomenių įsitraukimas festivalio istorijoje. Vien festivalio teritorijoje vilniečiai ir miesto svečiai per savaitgalį suvalgė beveik 7 tonas šaltibarščių arba maždaug tiek, kiek vienam žmogui jų užtektų ragauti kasdien beveik 20 metų. Vienais ryškiausių savaitgalio akcentų tapo rožinis paradas Neries pakrante ir upe bei „IKI šaltibarščių ėjimo varžybos“ – į juos susirinko po keliolika tūkstančių nuotaikingai pasipuošusių dalyvių, o varžybų organizatoriai išdalijo virš 50 tūkst. vaisių, daržovių, šaltibarščių ingredientų ir kartu keliavusiems renginio dalyvių augintiniams skirtų skanėstų. „Vilnius Pink Soup Fest“ plačiai nuskambėjo ir užsienio žiniasklaidoje. Festivalyj",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/pink-soup-fest-siemet-pritrauke-beveik-180-tukst-dalyviu",
    publishedAt: "2026-09-01T10:00:00+03:00",
    locations: ["old-town", "vilnius-centre", "cathedral"],
    category: "events",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6855, lng: 25.2878, label: "Katedros aikštė" }
    ],
    curated: true,
  },
  {
    id: "1022b382-b92a-4509-84fc-7803e57295c3",
    title: "Pašilaičiuose atnaujinta viešoji erdvė – bendruomenės laukia šventė",
    summary: "Antradienį, balandžio 28 d., 18 val. vilniečiai kviečiami į atnaujintos viešosios erdvės atidarymą Medeinos g. 8A. Šalia atnaujinto prekybos centro, tarp daugiabučių, sutvarkyta ir apželdinta teritorija atveriama gyventojams kaip nauja vieta susitikti, pabūti kartu ir leisti laiką savo rajone, rašoma Vilniaus miesto savivaldybės pranešime žiniasklaidai.",
    fullText: "Sutvarkytoje teritorijoje numatyta vieta ūkininkų produkcijos prekybai, įrengti takai, poilsio vietos, daugiau želdinių, o pats skveras kurtas taip, kad būtų patrauklus kasdieniam bendruomenės naudojimui. „Vilniuje nuosekliai kuriamos tokios viešosios erdvės, kurios būtų ne tik tvarkingos ir žalios, bet ir iš tiesų reikalingos žmonėms. Medeinos gatvėje atnaujinta teritorija yra dar vienas pavyzdys, kaip tarp daugiabučių galima sukurti jaukią, gyvą ir bendruomenę telkiančią vietą. Miestas keičiasi ne tik per didelius projektus, bet ir per tokius pokyčius, kurie gerina žmonių kasdienybę visai šalia namų“, – sako Vilniaus miesto meras Valdas Benkunskas. Atidarymo metu lankytojų lauks edukacijos ir veiklos visai šeimai. Renginyje bus galima išbandyti JUDU medinį žaidimą ir daugiau sužinoti apie darnų judėjimą mieste, sudalyvauti Mildos Paukštės vėjo malūnėlių edukacijoje, pasitikrinti žinias apie judumą laimės rate, įsiamžinti foto būdelėje, apsilankyti palapinėje, kur dirbtuvių meistrai padės paruošti dviratį šiltajam sezonui ir pasidalins naudingais priežiūros patarimais, o taip pat prisijungti prie ekskursijos po Pašilaičių rajoną. Jos metu dalyviai galės geriau pažinti vieną originaliausių Vilniaus rajonų, jo išskirtinį planavimą, architektūrą ir vietos istorijas. Prie šventės prisideda ir kaimynystėje veikiantys verslai: gyventojams bus siūloma sulčių, batonėlių, vaisių ir picos, o keturkojai bus kviečiami į šlapio maisto degustaciją.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/laisvalaikis/13/2911277/pasilaiciuose-atnaujinta-viesoji-erdve-bendruomenes-laukia-svente",
    publishedAt: "2026-04-27T12:22:00+00:00",
    locations: ["pasilaiciai", "laisves-pr", "northern-vilnius"],
    category: "events",
    sourceConfidence: 100,
    geo: [
      { lat: 54.7245, lng: 25.2185, label: "Pašilaičiai · Medeinos g." }
    ],
  },
  {
    id: "b48e9e23-715d-4ef7-9a8f-ad2b923e56e0",
    title: "Išduotas statybos leidimas mokyklos Justiniškėse rekonstrukcijai",
    summary: "Artimiausiu metu neatpažįstamai keisis dar viena sostinės mokykla – Vilniaus miesto savivaldybė išdavė statybą leidžiantį dokumentą „Vyturio“ pradinei mokyklai, esančiai Taikos g. 189, rekonstruoti. Planuojama, kad Vilniaus viešojo intereso objektų plėtros ir valdymo bendrovės Vilniaus vystymo kompanija užsakymu atlikus rekonstrukcijos darbus, įstaigoje galės mokytis 384 moksle",
    fullText: "„Vilnius sparčiai auga, mokykloje jau nebetelpa bendruomenė, todėl mokyklos išplėtimas būtinas. Mūsų tikslas – užtikrinti patogią, modernią mokymosi erdvę, skatinančią drąsiai, kūrybiškai mąstyti ir veikti. Naujų mokyklų poreikis viršija miesto galimybes, todėl nuosekliai atnaujiname ir senesnės statybos ugdymo įstaigas, kad jos atitiktų šiandieninius standartus“, – sako Vilniaus miesto meras Valdas Benkunskas. Rekonstruoto pastato bendras plotas išaugs daugiau nei dvigubai nuo 2119 kv. m iki 5115 kv. m. Pastatas bus dviejų aukštų, jo energinis naudingumas atitiks A++ klasę. Ugdymo įstaigos rūsio patalpose suprojektuota priedanga. Kartu su mokyklos pastato rekonstrukcija numatoma įrengti krepšinio, futbolo aikšteles, vaikų žaidimų aikšteles aktyviai bendruomenės ir mokyklos veiklai. „Šis statybos leidimo gavimas yra fantastiška naujiena – pagaliau puikios mokyklos Justiniškėse vaikai galės mokytis kokybiškose erdvėse. Šiuo metu dėliojame paskutinius akcentus dėl laikino moksleivių perkėlimo rekonstrukcijos metu ir tikiuosi, kad po kelerių metų „Vyturio“ pradinė mokykla virs aukščiausius standartus atitinkančia ugdymo įstaiga. O be esamų mokyklų remontų per artimiausius kelerius metus Vilniuje pastatysime 4 naujas mokyklas ir 5 darželius – tokio statybų proveržio laukėme 30 metų“, – teigia Vilniaus miesto vicemeras Vytautas Mitalas. Rekonstruojant pastatą, planuojama griauti mokyklos šiaurinį sparną ir pastato centrą, išlaikyti tris įstaigos dviejų aukštų korpusus. Projekte numatyta statyti naujus priestatus. Naujose patalpose ketinama įrengti sporto salę ir bendrą renginių zoną su amfiteatru, papildomas klasių erdves. Numatoma, jog ne ugdymo metu atnaujintomis mokyklos valgyklos, bibliotekos, sporto salės ir aulos patalpomis galės naudotis bendruomenė. „Gautas statybos leidimas atveria galimybę mokyklai tapti modernia ir funkcionalia erdve, pritaikyta šiuolaikiniams ugdymo metodams bei bendruomenės lūkesčiams. Mokiniai čia galės mokytis saugioje, patogioje ir pažangioje aplinkoje. Artimiausiu metu ketinama tikslinti tolimesnį projekto įgyvendinimo planą“,– teigia projektą įgyvendinančios Vilniaus vystymo kompanijos vadovė Laura Joffė. Projektu ketinama iš esmės ",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/svietimas/45/2814230/isduotas-statybos-leidimas-mokyklos-justiniskese-rekonstrukcijai",
    publishedAt: "2026-01-22T11:01:00+00:00",
    locations: ["justiniskes", "laisves-pr"],
    category: "news",
    sourceConfidence: 100,
    geo: [
      { lat: 54.7168, lng: 25.2265, label: "Justiniškės · Vyturio mokykla" }
    ],
  },
  {
    id: "a0670028-e639-4260-9153-a1f8f77d8b42",
    title: "Nauja gamtos oazė sostinėje: Šeškinėje, šalia Nacionalinio stadiono, iškils Mamutų slėnis",
    summary: "Statybų bendrovė „Infes“ už 10,98 mln. eurų (su PVM) įrengs didžiąją dalį maždaug 17 mln. eurų vertės vadinamojo Mamutų slėnio Vilniaus Šeškinės šlaitų geomorfologiniame draustinyje, šalia statomo Nacionalinio stadiono komplekso, penktadienį pranešė Vilniaus vystymo kompanija (VVK).",
    fullText: "Įmonė bus atsakinga už pirmųjų trijų etapų darbus: įrengs pėsčiųjų takus, laiptus, regyklas, pėsčiųjų tiltą, edukacines ir poilsio aikšteles, kitą infrastruktūrą, susisiekimo jungtis ir pagrindinį įėjimą į parką nuo Geležinio Vilko gatvės. Paskutiniuoju – ketvirtuoju – etapu bus įrengtas pėsčiųjų ir dviračių takas ties Ukmergės gatve, tam bus skelbiamas atskiras konkursas. „Ši didelė teritorija greta intensyvaus eismo gatvių, prekybos centrų ir būsimojo daugiafunkcio komplekso su Nacionaliniu stadionu yra gamtos oazė mieste [...] Be to, Mamutų slėnio takai bus susieti su stadiono infrastruktūra“, – pranešime sakė Vilniaus meras Valdas Benkunskas. Anot VVK, pirmuosius rangos darbus numatoma pradėti iki šių metų pabaigos, o baigti – iki 2028-ųjų antrojo ketvirčio. „Apie 32 hektarų Mamutų slėnį vienu iš takų bus galima pereiti maždaug per valandą. Ledynmečio istorija čia bus pasakojama ne tik stendais – geologinio laiko mastelį lankytojai galės pažinti per specialiai sukurtas edukacines patirtis“, – sakė VVK projektavimo ir statybos valdymo departamento vadovas Jonas Stravinskas. VVK anksčiau BNS teigė, jog viso projekto vertė sieks apie 17 mln. eurų (su PVM), iš kurių 5,4 mln. eurų bus finansuojama ES lėšomis. Vilniaus Šeškinės šlaitų geomorfologinis draustinis įsteigtas 1996 metais siekiant išsaugoti ledyno tirpsmo vandenų srautų suklotų sluoksniuotų nuosėdų Neries slėnio šlaitų fragmentą.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/laisvalaikis/13/3049263/nauja-gamtos-oaze-sostineje-seskineje-salia-nacionalinio-stadiono-iskils-mamutu-slenis",
    publishedAt: "2026-09-11T11:21:00+00:00",
    locations: ["seskine", "laisves-pr"],
    category: "news",
    sourceConfidence: 100,
    geo: [
      { lat: 54.7145, lng: 25.242, label: "Šeškinė · Mamutų slėnis" }
    ],
  },
  {
    id: "3bf6ff50-3eb4-4e94-b2c6-ad92af08b3fc",
    title: "Šeškinės poliklinika atvėrė naujas patalpas: sieks didinti paslaugų prieinamumą vaikams",
    summary: "Sostinės Šeškinės poliklinika atvėrė naują Vaikų raidos centrą, kuriuo sieks didinti psichikos sveikatos priežiūros prieinamumą vaikams ir paaugliams bei atliepti didėjantį vaikų ankstyvosios raidos reabilitacijos paslaugų poreikį, praneša Vilniaus miesto savivaldybė.",
    fullText: "„Augant paslaugų poreikiui esamose poliklinikos patalpose nebeturėjome galimybių užtikrinti visų sąlygų tolesnei plėtrai, todėl priėmėme sprendimą įkurti naujas erdves. Šis sprendimas leidžia ne tik teikti daugiau paslaugų, bet ir vaikams, jų šeimoms sukurti patogesnę, šiuolaikišką ir jų poreikiams pritaikytą aplinką“, – sostinės savivaldybės interneto svetainėje cituojamas Šeškinės poliklinikos direktorius Mindaugas Sinkevičius. Nurodoma, kad naujose patalpose, nuo birželio įsikūrusiose prekybos centre „Pikas“, veikia gydytojo socialinio pediatro konsultacijos bei įkurtas Vaikų raidos sutrikimų ankstyvosios reabilitacijos dienos stacionaras (VRSAR), kurio paslaugos teikiamos vaikams iki 7 metų. „Naujose patalpose teikiamos ambulatorinės vaikų ir paauglių psichikos sveikatos priežiūros paslaugos, dirba gydytojai vaikų ir paauglių psichiatrai, medicinos psichologai, psichikos sveikatos slaugytojai, socialiniai darbuotojai. Vaikai centre gali gauti ir kalbos korekcijos paslaugas, konsultacijas teikia klinikinis logopedas“, – nurodo Vilniaus miesto savivaldybės administracija. „Patalpose įrengta 10 specialistų kabinetų, 2 kineziterapijos salės ir ergoterapijos salė su sensorine erdve. Čia dirba 25 įvairių sričių specialistai, o vienu metu paslaugos gali būti teikiamos 13–19 vaikų, užtikrinant kokybišką, individualiems poreikiams pritaikytą pagalbą“, – pažymima pranešime. Taip pat priduriama, kad naujos erdvės kurtos vadovaujantis šeimai draugiškos sveikatos priežiūros principais – prioritetas teiktas vaikų emocinio komforto, jaukumo ir privatumo užtikrinimui. „Patalpos pritaikytos įvairaus amžiaus vaikų poreikiams – jose įrengti ergonomiški, vaikams tinkami baldai, o aplinka sukurta laikantis universalaus dizaino principų, užtikrinančių patogumą ir prieinamumą visiems lankytojams“, – teigia Vilniaus miesto savivaldybė. „Siekiant palengvinti orientavimąsi erdvėse ir sumažinti vaikų patiriamą nerimą, įdiegtos vizualinės struktūros kortelės, padedančios aiškiau suprasti aplinką ir numatyti apsilankymo eigą“, – pažymima pranešime.",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/sveikata/682/2958166/seskines-poliklinika-atvere-naujas-patalpas-sieks-didinti-paslaugu-prieinamuma-vaikams",
    publishedAt: "2026-06-12T09:11:00+00:00",
    locations: ["seskine", "laisves-pr"],
    category: "news",
    sourceConfidence: 100,
    geo: [
      { lat: 54.7115, lng: 25.2552, label: "Šeškinės poliklinika" }
    ],
  },
  {
    id: "747e66b9-c817-409d-828b-648fdbb94ea6",
    title: "Paprasta gyventojos idėja pievą Karoliniškių obelyne pavertė tikra poilsio oaze",
    summary: "Karoliniškės turi savo prekybos centrų, turgų, polikliniką, ugdymo įstaigas, fontaną, obelų sodą, o dabar ir netradicinę poilsio erdvę – su saulės gultais ir unikalia panorama į televizijos bokštą. Vilnietės Natalijos idėja iš esmės pakeitė poilsį vietinių pamėgtoje pievelėje, rašoma Vilniaus miesto savivaldybės pranešime žiniasklaidai.",
    fullText: "„Mes ir esame savo aplinkos kūrėjai. Nereikia laukti, kol kažkas ateis ir viską padarys už mus. Iš Karoliniškių beveik nereikia niekur išvažiuoti, daugelį kasdienių paslaugų turime vietoje. Sužinojusi apie galimybę siūlyti idėjas miestui, prisėdau su kavos puodeliu ir susimąsčiau, ko žmonėms mūsų rajone trūksta. Supratau, kad trūksta būtent įrengtų poilsio vietų gamtoje“, – sako vilnietė Natalija Struckienė. Karoliniškėse ji gyvena nuo 2001-ųjų, o šis rajonas tapęs ne tik jos, bet ir visos šeimos namais. Nors Karoliniškės vis dar neretai vadinamos sovietiniu miegamuoju rajonu, šiandien šis rajonas yra visai kitoks, todėl gyventoją labai sužavėjo galimybė prisidėti prie rajono pokyčio, siūlant savo idėjas gyvenamajai aplinkai dalyvaujamojo biudžeto programoje „Dalyvauk! Vilnius“. Mintis apie gultus karoliniškietei gimė visai natūraliai – obelų sodas yra vienas mėgstamiausių jos šeimos pasivaikščiojimų maršrutų. Kasmet Natalija matydavo žmones, kurie ateina į pievą pasideginti ar tiesiog pailsėti, tačiau visada pastebėdavo, kad ne kiekvienam norisi gultis tiesiai ant žolės, o tai nėra ir labai patogu. Unikali vieta pati padiktavo 360 laipsnių kampu besisukančių gultų idėją – iš vienos pusės atsiveria miesto panorama, iš kitos – televizijos bokštas. Idėjos autorei norėjosi, kad kiekvienas galėtų pasirinkti gražiausią sau vaizdą, atsisukti į saulę arba pavėsį. Obelynas visuomet buvo Karoliniškių traukos vieta, kur vyksta renginiai, sporto iniciatyvos ir susitikimai, tačiau norėjosi šioje erdvėje jaukumo ir šiuolaikiškų poilsio sprendimų. Pavyzdžiui, pavasarį patogiai įsitaisyti ir stebėti įspūdingą obelų žydėjimą, vasarą – atsipalaiduoti su knyga ir lepintis saulės spinduliais po obelų lajomis, o rudenį – stebėti krentančius spalvingus lapus. N. Struckienė iki šiol žavisi vietos gyventojų įsitraukimu ir palaikymu. „Karoliniškiečiai yra puiki komanda!“ – sako pašnekovė. Už saulės gultų Karoliniškių obelyne idėją balsavo per 100 šio rajono gyventojų. Tačiau didžiausias įvertinimas jai ne pats idėjos laimėjimas, o tai, kad šiandien gultai nuolat naudojami, žmonėms jie patinka. „Nuolat matau čia besiilsinčius įvairaus amžiaus žmones – vyresnieji sustoja po pasivaikščioj",
    sourceName: "LRT",
    sourceUrl: "https://www.lrt.lt/naujienos/laisvalaikis/13/2996178/paprasta-gyventojos-ideja-pieva-karoliniskiu-obelyne-paverte-tikra-poilsio-oaze",
    publishedAt: "2026-07-20T10:03:00+00:00",
    locations: ["karoliniskes", "laisves-pr"],
    category: "evergreen",
    sourceConfidence: 100,
    geo: [
      { lat: 54.6895, lng: 25.2148, label: "Karoliniškių obelynas" }
    ],
  },
  {
    id: "4aef4259-6bfb-441f-af5b-bf04a9c7ca87",
    title: "„Bentley Systems“ plečia veiklą Lietuvoje ir atidaro naują biurą Vilniuje",
    summary: "Infrastruktūros inžinerijos programinės įrangos kūrėja „Bentley Systems“ paskelbė plečianti savo veiklą Vilniuje. Per artimiausius trejus metus įmonė planuoja beveik trečdaliu padidinti Lietuvoje dirbančią beveik 300 specialistų komandą, samdant specialis",
    fullText: "Infrastruktūros inžinerijos programinės įrangos kūrėja „Bentley Systems“ paskelbė plečianti savo veiklą Vilniuje. Per artimiausius trejus metus įmonė planuoja beveik trečdaliu padidinti Lietuvoje dirbančią beveik 300 specialistų komandą, samdant specialis „Bentley Systems“ Lietuvoje veikia jau daugiau nei du dešimtmečius. Vilniuje ir Kaune dirbančios inžinierių komandos vysto svarbiausius bendrovės sprendimus: projektų įgyvendinimui skirtą programinę įrangą „ProjectWise“, statybų modeliavimui skirtą „SYNCHRO 4D“ ir „iTwin Platform“ – pamatinę „Bentley“ skaitmeninių dvynių strategijos technologiją. Lietuvoje kuriama programinė įranga yra reikšminga įgyvendinant vienus ambicingiausių pasaulio projektų – nuo dirbtinio intelekto megaduomenų centrų projektavimo iki sudėtingų transporto tinklų statybos, įskaitant europinės reikšmės greitojo geležinkelio projektą „Rail Baltica“. Baltijos šalyse yra aukštos kvalifikacijos inžinerijos specialistų ir pažangi reguliacinė aplinka technologijų plėtrai. „Mūsų plėtra Lietuvoje yra aiškus įrodymas, kokią reikšmingą vertę per pastaruosius dvidešimt metų bendrovei sukūrė čia dirbanti komanda. Lietuvoje radome klestinčią inovacijų ekosistemą, stiprius talentus ir bendradarbiavimo dvasią, tapusią vienu mūsų sėkmės veiksnių. Plėsdami veiklą Vilniuje, įgyjame prieigą prie čia susitelkusių dirbtinio intelekto ir programinės įrangos kūrimo kompetencijų, būtinų pasaulinei išmaniųjų infrastruktūros sprendimų paklausai patenkinti,“ – teigia Julien Moutte, „Bentley Systems“ technologijų vadovas. Siekdama prisidėti prie vietos talentų ugdymo, „Bentley Systems“ toliau plečia glaudų bendradarbiavimą su mokslo įstaigomis. Įmonė vysto strategines partnerystes su Kauno technologijos universitetu ir kitais pirmaujančiais Lietuvos universitetais, taip integruodama „Bentley“ skaitmeninių dvynių technologiją į studijų programas. Ši mokslo ir praktikos sąsaja užtikrina, kad absolventai į darbo rinką ateitų turėdami itin paklausių naujos kartos debesija ir dirbtiniu intelektu grįstos inžinerijos kompetencijų. „Bendrovės „Bentley Systems“ sprendimas plėsti veiklą Lietuvoje parodo mūsų technologijų sektoriaus stiprybę ir brandą. Tai, jog pasaulinis infr",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/bentley-systems-atidaro-nauja-biura-vilniuje",
    publishedAt: "2026-08-01T10:00:00+03:00",
    locations: ["stotis", "new-town", "laisves-pr"],
    category: "news",
    sourceConfidence: 100,
    geo: [
      { lat: 54.672, lng: 25.28, label: "Vilnius · verslas" }
    ],
    curated: true,
  },
  {
    id: "724071a7-c07e-4b1a-acb1-745a177bbb22",
    title: "Skelbiami konkurso „Rožinis Vilnius“ laimėtojai – ryškūs kaip ir patys šaltibarščiai",
    summary: "Šių metų šaltibarščių festivalis „Vilnius Pink Soup Fest“ dar kartą parodė, kad Vilnius moka stebinti. Šventės metu rožiniai akcentai persikėlė į miesto vitrinas, fasadus ir kiemus, o šventinę nuotaiką kūrė ne tik organizatoriai, bet ir patys vilniečiai",
    fullText: "Šių metų šaltibarščių festivalis „Vilnius Pink Soup Fest“ dar kartą parodė, kad Vilnius moka stebinti. Šventės metu rožiniai akcentai persikėlė į miesto vitrinas, fasadus ir kiemus, o šventinę nuotaiką kūrė ne tik organizatoriai, bet ir patys vilniečiai Vilniaus miesto turizmo ir verslo plėtros agentūros „Go Vilnius“ organizuojamas festivalis šiemet sulaukė beveik 177 tūkst. lankytojų – kone dvigubai daugiau nei pernai. Prie šventės prisijungė virš 330 Vilniaus vietų, o dalis jų dalyvavo ir konkurse „Rožinis Vilnius“, kvietusiame kūrybiškai interpretuoti festivalio temą bei prisidėti prie šventinės miesto atmosferos. Per kelias savaites skirtingose miesto vietose atsirado dešimtys kūrybiškai papuoštų erdvių – nuo ryškių instaliacijų iki subtilių, bet dėmesį patraukiančių detalių. Jos tapo ne tik festivalio dalimi, bet ir traukos taškais, kuriuos lankytojai fotografavo, dalijosi socialiniuose tinkluose ir įtraukė į savo maršrutus po miestą. „Šiemet „Rožinis Vilnius“ aiškiai parodė, kad gyventojai ne tik stebi festivalį, jame dalyvauja, bet ir patys jį kuria, o tai yra viena iš priežasčių, kodėl „Vilnius Pink Soup Fest“ auga – jis suburia miestą. Festivalio akimirkos plačiai pasklido socialiniuose tinkluose, apie renginį užsienio žiniasklaidoje jau paskelbta daugybė publikacijų. Vadinasi, kad kartu su festivaliu tarptautinį dėmesį pelnė ir miestiečių bei verslų kurtos iniciatyvos“, – sako „Go Vilnius“ komunikacijos vadovė Eglė Girdzijauskaitė. Konkursas „Rožinis Vilnius“ sulaukė didelio susidomėjimo – balsavimas vyko naujienų portale „Delfi“, kuris šiemet prisijungė kaip konkurso ir informacinis partneris. Skaitytojai aktyviai rinko favoritus, o trys daugiausiai balsų surinkusios vietos buvo pripažintos kūrybiškiausiomis. Konkurso dalyviai festivalio temą interpretavo itin įvairiai. Vienur lankytojus pasitiko rožinių kamuoliukų pripildytas kubilas, rožinių šaukštų dekoracijos, kitur – milžiniška šaltibarščių spalvomis dekoruota dažų paletė ar žaismingas šaltibarščių bankomatas, kuriame paskambinus varpeliu iš langelio pasirodydavo ranka su dubenėliu sriubos. Mieste taip pat buvo galima išvysti rožinėmis šviesomis nušvitusį Vilniaus TV bokštą, geležinkelio stotį, š",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/skelbiami-konkurso-rozinis-vilnius-laimetojai",
    publishedAt: "2026-08-01T10:00:00+03:00",
    locations: ["stotis", "seskine", "laisves-pr"],
    category: "events",
    sourceConfidence: 100,
    geo: [
      { lat: 54.71, lng: 25.24, label: "Laisvės pr. koridorius" }
    ],
    curated: true,
  },
  {
    id: "d3758b28-af84-421a-b2e5-7ea0ac69a709",
    title: "Sostinė pradeda naują tradiciją: miestui nusipelniusiems užsieniečiams – „Vilnius Is My City“ apdovanojimai",
    summary: "Lietuvos sostinė pradeda naują tradiciją – užsienyje gimę vilniečiai bus įvertinti už indėlį į Vilniaus verslą, kultūrą, gastronomiją ir miesto vardo garsinimą pasaulyje. Jau nuo šiandien visi gyventojai kviečiami siūlyti nominantus.",
    fullText: "Lietuvos sostinė pradeda naują tradiciją – užsienyje gimę vilniečiai bus įvertinti už indėlį į Vilniaus verslą, kultūrą, gastronomiją ir miesto vardo garsinimą pasaulyje. Jau nuo šiandien visi gyventojai kviečiami siūlyti nominantus. „Vilnius Is My City“ jau tapo kasmetine miesto švente, suburiančia skirtingų šalių ir kultūrų bendruomenes Bernardinų sode. Pernai renginyje dalyvavo daugiau nei 30 iš įvairių pasaulio valstybių į Vilnių atvykusių bendruomenių. Šiemet šventę papildys naujas akcentas – pirmą kartą bus įteikti „Vilnius Is My City Awards“ apdovanojimai. Jais miestas dėkos iš užsienio į Vilnių atvykusiems ir čia savo gyvenimą kuriantiems žmonėms, kurie savo darbu, verslais, kūryba ar iniciatyvomis prisideda prie Lietuvos sostinės augimo. „Nuo Gedimino laikų Vilnius buvo ir yra miestas, kuris kviečia atvykti, kurti ir čia įleisti šaknis. Šiandien mūsų sostinę renkasi žmonės iš viso pasaulio – jie čia steigia verslus, restoranus, įgyvendina kultūros iniciatyvas, dirba ir kartu su lietuviais kuria šiuolaikinio Vilniaus veidą. Su mūsų „International House Vilnius“ centru prireikus padedame žengti pirmus žingsnius, o dabar norime, kad užsienio talentų indėlis taptų labiau matomas ir įvertintas“, – sako Vilniaus miesto verslo ir turizmo plėtros agentūros „Go Vilnius“ vadovė Dovilė Aleksandravičienė. „Vilnius Is My City Awards“ apdovanojimai bus skiriami keturiose kategorijose, atspindinčiose skirtingus būdus, kuriais užsienio kilmės vilniečiai ar jų atstovaujamos organizacijos prisideda prie miesto gyvenimo. „Už verslą, kuriantį Vilnių“ kategorijoje bus vertinami žmonės ar įmonės, Vilniuje vystančios verslus, kuriančios darbo vietas, investuojančios, diegiančios inovacijas ir prisidedančios prie miesto ekonominio gyvenimo. „Už kultūrinį Vilnių“ apdovanojimas atiteks už reikšmingą veiklą meno ir kultūros srityse bei indėlį į daugiakultūrinį Vilniaus identitetą. „Už skanų Vilnių“ bus įvertinti gastronomijos srities talentai – Vilniuje veikiančių kavinių, restoranų, barų ar kitų gastronominių iniciatyvų kūrėjai, prisidedantys prie miesto gastronominės kultūros. Tuo metu „Vilniaus ambasadoriaus“ kategorija bus skirta žmogui, kuris aktyviai garsina Vilniaus vardą ",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/sostine-pradeda-nauja-tradicija-vilnius-is-my-city-apdovanojimai",
    publishedAt: "2026-08-01T10:00:00+03:00",
    locations: ["santariskes", "stotis", "laisves-pr"],
    category: "events",
    sourceConfidence: 100,
    geo: [
      { lat: 54.72, lng: 25.23, label: "Vilnius · Laisvės pr." }
    ],
    curated: true,
  },
  {
    id: "0d809e28-fbdd-4f4d-acf0-c829fcc574cd",
    title: "Vilniuje prie vieno stalo susitiks pasaulis: „Vilnius Is My City“ kvies pažinti miestą per žmones, kultūras ir skonius",
    summary: "Rugsėjo 5-ąją Bernardinų sodas taps vieta, kurioje prie bendro stalo susitiks skirtingos pasaulio kultūros, kalbos, skoniai ir žmonės. Penktą kartą vyks tarptautinės bendruomenės šventė „Vilnius Is My City“.",
    fullText: "Rugsėjo 5-ąją Bernardinų sodas taps vieta, kurioje prie bendro stalo susitiks skirtingos pasaulio kultūros, kalbos, skoniai ir žmonės. Penktą kartą vyks tarptautinės bendruomenės šventė „Vilnius Is My City“. Visą dieną, nuo 11 iki 20 val., vyksiančios nemokamos šventės pagrindiniu motyvu šiemet pasirinktas bendras stalas. Jis taps ne vien fizine renginio erdve, bet ir universalia metafora – prie stalo lengviau užmegzti pokalbį, paklausti apie kitos šalies tradicijas, išmokti žodį kita kalba ar tiesiog susitikti su žmogumi, kurio kasdienybėje galbūt niekada nebūtum sutikęs. Bendras stalas bus vieta, prie kurios skirtingos kultūros susitiks ne tik simboliškai. Festivalio dalyviai kvies susipažinti su įvairių šalių maistu, patiekalų istorijomis ir tradicijomis, o dalis bendruomenių bei restoranų pristatys savo patiekalus. „Vilnius yra miestas, kuriame nuolat susitinka skirtingos patirtys. Norime, kad šventėje šis susitikimas būtų kuo paprastesnis ir natūralesnis. Todėl kviečiame ne stebėti vieniems kitus iš šalies, o susėsti prie bendro stalo. Per maistą, kalbą, muziką, judesį ir bendras veiklas galima labai greitai atrasti tai, kas mus jungia“, – sako Indrė Laučienė, Vilniaus miesto verslo ir turizmo plėtros agentūros „Go Vilnius“ Užsienio talentų skyriaus vadovė. Šiemet šventė išplėtė savo dalyvių ratą: joje susiburs skirtingų šalių bendruomenės, organizacijos, Vilniuje veikiančios įmonės ir restoranai. Iš viso Bernardinų sode bus galima sutikti kelių dešimčių valstybių atstovus iš beveik visų pasaulio žemynų. Bendruomenės į šventę atsineš ne tik savo istorijas, bet ir pasiūlys jas patirti patiems. Pavyzdžiui, Azerbaidžano bendruomenė kvies susipažinti su tradiciniais ornamentais ir kilimų simboliais, Indijos atstovai organizuos jogos veiklas ir piešinių ant kūno chna dažais dirbtuves, persų bendruomenė pristatys siuvinėjimo, dekoravimo veidrodėliais ir persiškos kaligrafijos tradicijas, o ukrainiečiai mokys gaminti tradicines motankas – rankų darbo lėles, siejamas su šeima, apsauga ir gerove. Norintys daugiau judesio galės mokytis Lotynų Amerikos, totorių šokių, taip pat išbandyti tradicinį „Tinikling“ šokį, kuriam kvies Filipinų bendruomenė. Ji Bernardinų sode ",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/vilniuje-prie-vieno-stalo-susitiks-pasaulis-vilnius-is-my-city",
    publishedAt: "2026-08-01T10:00:00+03:00",
    locations: ["pasilaiciai", "seskine", "stotis"],
    category: "events",
    sourceConfidence: 100,
    geo: [
      { lat: 54.715, lng: 25.235, label: "Vilnius · 2G koridorius" }
    ],
    curated: true,
  },
  {
    id: "d2842eff-2fd9-4348-823e-aabfe0ceba24",
    title: "Pirmą kartą Vilniuje – apdovanojimai miesto kūrėjams iš viso pasaulio: balsuokite už nominantus",
    summary: "Vilnius kasdien kuriamas ne tik čia gimusių, bet ir iš įvairių pasaulio šalių atvykusių žmonių. Vieni jų sostinėje augina globalius verslus, kiti buria bendruomenes, kuria restoranus, garsina miesto kultūrą ar pristato Vilnių už Lietuvos ribų.",
    fullText: "Vilnius kasdien kuriamas ne tik čia gimusių, bet ir iš įvairių pasaulio šalių atvykusių žmonių. Vieni jų sostinėje augina globalius verslus, kiti buria bendruomenes, kuria restoranus, garsina miesto kultūrą ar pristato Vilnių už Lietuvos ribų. Šiandien prasideda viešas balsavimas , kuriame visi gali atiduoti savo balsą, už jų nuomonę, sostinei labiausiai nusipelnius užsienio kilmės vilniečius, jų įsteigtus verslus ar įkurtas iniciatyvas. Vilniaus miesto verslo ir turizmo plėtros agentūrai „Go Vilnius“ prieš dvi savaites pakvietus teikti nominantus naujiesiems apdovanojimams, iš viso buvo sulaukta beveik 800 gyventojų pasiūlymų, iš jų komisija išrinko po tris finalininkus besivaržančius keturiose kategorijose. „Kiekvienas iš pasiūlytų ir į finalinius trejetukus patekusių nominantų įrodo, kad Vilnius yra vieta, kurioje idėjos randa namus. Užsienio talentai bei verslai tampa neatsiejama mūsų miesto tapatybės dalimi, o Vilnių kuria labai skirtingos žmonių istorijos. „Vilnius Is My City Awards“ – tai būdas pastebėti ir padėkoti tiems, kurie mūsų sostinę pasirinko ne tik kaip vietą gyventi, bet ir kaip miestą, kurį jie patys aktyviai augina“, – sako Indrė Laučienė, „Go Vilnius“ Užsienio talentų skyriaus vadovė. Kategorijos „Už verslą, kuriantį Vilnių“ nominantai atspindi skirtingas sostinės ekonominio gyvenimo puses – nuo sostinėje išaugusio globalaus verslo iki socialinio restorano ir tarptautinės žaidimų kūrimo bendruomenės. Vienas ryškiausių Vilniaus technologijų ekosistemos vardų – „Vinted“ . Lietuvos sostinėje gimusi įmonė iš vietinio startuolio išaugo į vieną žinomiausių Europos technologijų bendrovių, o jos pagrindinė būstinė iki šiol veikia Vilniuje. „Vinted“ kuria aukštos kvalifikacijos darbo vietas, pritraukia tarptautinius talentus ir padeda Vilniui pasaulio akyse įsitvirtinti kaip miestui, kuriame gali gimti globalūs verslai. Šalia rikiuojasi Nyderlanduose gimęs Timas van Wijkas , Vilniuje įkūręs socialinį restoraną „Pirmas blynas“ – čia žmonės su negalia įgauna realias darbo bei profesinio tobulėjimo galimybes. Ši iniciatyva keičia ne tik konkrečių žmonių gyvenimus, bet ir patį miestą – skatina atviresnį požiūrį į negalią ir rodo, kad socialinė atsakomybė",
    sourceName: "Go Vilnius",
    sourceUrl: "https://www.govilnius.lt/visos-naujienos/pirma-karta-vilniuje-apdovanojimai-miesto-kurejams-is-uzsienio",
    publishedAt: "2026-08-01T10:00:00+03:00",
    locations: ["justiniskes", "karoliniskes", "laisves-pr"],
    category: "events",
    sourceConfidence: 100,
    geo: [
      { lat: 54.705, lng: 25.225, label: "Laisvės prospektas" }
    ],
    curated: true,
  }
];
