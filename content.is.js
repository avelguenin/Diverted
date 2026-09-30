/* DIVERTED — content.js
   Every word of the game. Scenes are plain objects; text and choices can be
   functions of G (see engine.js) so they react to the clock, to flags, and
   to dread — the hidden escalation value that climbs through the night.

   Hub scenes (the hall, the hotel, the airport) build their text from three
   parts: a short fixed status line, the outcome of whatever you just did
   (G.last()), and an ambient line drawn from a pool that darkens with dread
   and never repeats itself back-to-back. So the same room reads differently
   every time you act in it.

   Time is in minutes. T(day, hh, mm). Day 0 is the flight; Day 1 is Iceland. */
'use strict';

window.CONTENTS = window.CONTENTS || {};
CONTENTS.is = (() => {
  const T = (d, h, m = 0) => d * 1440 + h * 60 + m;
  const p = (...xs) => xs.filter(Boolean).join('\n\n');
  const V = (s) => `<span class="voice">${s}</span>`;        // a voice, usually posh
  const W = (s) => `<span class="whisper">${s}</span>`;      // an aside
  // LX marks a line spoken by a local (the airport woman, the night clerk).
  // In the English, Icelandic and Finnish versions it is simply translated. In
  // the French version the generator leaves it in English, and if the player
  // has asked whether they speak French, CONTENT_BROKEN supplies a halting French.
  const CONTENT_BROKEN = {};
  const LX = (s) => { try { const S = (typeof Game !== 'undefined' ? Game : window.Game).state; if (S && S.flags.fr_asked && CONTENT_BROKEN[s]) return CONTENT_BROKEN[s]; } catch (e) { /* ignore */ } return s; };
  const atLeast = (G, v) => { if (G.S.dread < v) G.S.dread = v; }; // v in percent
  const hub = (G, status, key, extra) => p(status, G.last(), G.amb(key, AMB[key]), extra);
  const KNOCK_AT = T(1, 4, 30);

  const start = { scene: 'lane', t: T(0, 19, 20), nerves: 18, dread: 8, dep: T(1, 15, 10) };

  /* ================================================================ ambient pools */
  const AMB = {
    hall: [
      { d: 1, t: 'Gólfþvottavél líður hægt fram hjá, og þú sérð aldrei almennilega framan í þann sem ekur henni.' },
      { d: 1, t: 'Einhver hefur fundið rafmagnsinnstungu, og ellefu manns standa í kringum hana eins og varðeld.' },
      { d: 1, t: 'Komutaflan segir ekkert um flugið þitt. Hún segir ekkert um neitt flug.' },
      { d: 1, t: 'Barn sefur á farangursvagni. Það er enginn farangur.' },
      { d: 2, t: 'Það er færra fólk í salnum en áður var. Þú sást engan fara.' },
      { d: 2, t: 'Flúrperan yfir farangursafgreiðslunni er farin að tifa.' },
      { d: 2, t: 'Á nokkurra mínútna fresti stendur einhver upp, gengur að dyrunum og kemur til baka.' },
      { d: 3, t: 'STAFF-hurðin stendur opin um handarbreidd. Þú sást hana ekki opnast.' },
      { d: 3, t: 'Eitt andartak kviknar á öllum símum í salnum í einu, og svo slokknar á þeim öllum.' },
      { d: 3, t: 'Einhver stendur við hlerana fyrir fríhöfninni og snýr baki í salinn. Hann er í dökkbláu.' },
    ],
    room: [
      { d: 2, t: 'Hitakerfið gefur frá sér hljóð eins og einhver sem er að hugsa um að banka.' },
      { d: 2, t: 'Á hraðsuðukatlinum er lítið ljós. Það er það eina í herberginu sem stendur með þér.' },
      { d: 2, t: 'Einhver dregur ferðatösku á hjólum eftir ganginum, tösku sem hann getur ómögulega verið með.' },
      { d: 2, t: 'Spegilmyndin þín í svarta glugganum er í fötunum frá því í gær. Það eru allir.' },
      { d: 3, t: 'Bíll ekur hægt fram hjá úti á veginum og beygir ekki inn.' },
      { d: 3, t: 'Handan við vegginn, í næsta herbergi, sýnir sjónvarp sama ekkertið og þitt.' },
      { d: 3, t: 'Herbergið er 214. Á kortinu stendur 214. Þú gáir aftur og aftur, eins og það gæti hafa færst til.' },
      { d: 3, t: 'Einhver á ganginum nemur staðar fyrir utan dyrnar þínar og heldur svo áfram.' },
      { d: 4, t: 'Ljósið undir hurðinni slokknar, kviknar aftur, og slokknar.' },
      { d: 4, t: 'Einhvers staðar fyrir neðan er vél í gangi. Hún hefur verið í gangi um hríð.' },
      { d: 4, t: 'Það kviknar á símanum, af engu. Engin skilaboð. Bara skjárinn, sem horfir á þig.' },
      { d: 4, t: 'Þú heyrir bankað, tveimur dyrum frá. Jafnt, þolinmótt. Svo einum dyrum frá.' },
      { d: 5, t: 'Það er einhver á bílastæðinu. Hann hefur verið þar um nokkurn tíma.' },
      { d: 5, t: 'Gluggatjaldið bærist. Það er enginn gluggi opinn.' },
      { d: 5, t: 'Herbergissíminn hringir einu sinni og þagnar.' },
    ],
    corridor: [
      { d: 2, t: 'Teppi á lit eins og marblettur. Handklæðavagn stendur við endann, yfirgefinn í miðri vakt.' },
      { d: 2, t: 'Á hverri hurð er númer. Undir hverju númeri er ljósrönd.' },
      { d: 3, t: 'Ísvélin urgar, hættir, urgar.' },
      { d: 3, t: 'Ljósið við enda gangsins er slökkt. Það var kveikt.' },
      { d: 3, t: 'Einhver hlær á bak við eina hurðina og hættir í miðju kafi.' },
      { d: 4, t: 'Teppið fyrir utan 216 er blautt.' },
      { d: 4, t: 'Þú heyrir í lyftunni á ferð milli hæða. Enginn hefur kallað á hana.' },
      { d: 4, t: 'Brunahurðin við endann er skorðuð opin með skó.' },
      { d: 5, t: 'Hurðirnar eftir ganginum standa opnar, hver af annarri, og herbergin fyrir innan eru uppábúin. Enginn var nokkurn tímann í þeim.' },
      { d: 5, t: 'Við endann bankar einhver í dökkbláu á hurð, jafnt og þétt, og færir sig að þeirri næstu.' },
    ],
    lobby: [
      { d: 2, t: 'Næturvörðurinn er að ráða krossgátu á tungumáli sem þú kannt ekki. Hún hefur ekkert fyllt inn.' },
      { d: 2, t: 'Ferðaskrifstofuplakat: JÖKLAR · HVALIR · NORÐURLJÓS. Enginn í þessu anddyri mun sjá neitt af þessu.' },
      { d: 2, t: 'Tveir farþegar sofa uppréttir í sófanum og halda á símunum sínum eins og kertum.' },
      { d: 3, t: 'Rauða ljósið á kaffivélinni blikkar í takti sem er næstum því orð.' },
      { d: 3, t: 'Glerhurðirnar opnast fyrir engum og lokast aftur.' },
      { d: 3, t: 'Það er kominn nýr vatnsblettur á prentaða skiltið. Hann er að þorna og taka á sig mynd.' },
      { d: 4, t: 'Úti á bílastæðinu: aðalljós, vél í lausagangi. Það slokknar ekki á þeim.' },
      { d: 4, t: 'Næturvörðurinn horfir fram hjá þér, á dyrnar, og svo aftur á krossgátuna.' },
      { d: 4, t: 'Annar sofandi farþeganna er farinn. Síminn hans er enn í sófanum, með skjáinn upp, og sýnir tölvupóst.' },
      { d: 5, t: () => 'Vörðurinn segir, án þess að líta upp: ' + LX('„Hann spurði eftir þér.“') },
      { d: 5, t: 'Dyrnar renna upp. Kalt loft. Enginn kemur inn. Þær standa opnar.' },
    ],
    carpark: [
      { d: 2, t: 'Vindur. Hraunbreiður. Vegur sem liggur í aðra áttina inn í myrkur og í hina inn í örlítið öðruvísi myrkur.' },
      { d: 2, t: 'Hótelið fyrir aftan þig er upplýst eins og fiskabúr.' },
      { d: 3, t: 'Möl. Einn ljósastaur. Rigning sem getur ekki gert upp hug sinn.' },
      { d: 3, t: 'Rútulaga myrkur við enda bílastæðisins, vélin slökkt. Eða í gangi.' },
      { d: 4, t: 'Það logar á ljósunum inni í rútunni við endann. Það er setið í hverju einasta sæti.' },
      { d: 4, t: 'Einhver stendur við rútudyrnar, teinréttur, með spenntar greipar.' },
      { d: 5, t: 'Hann horfir á hótelið. Á einn glugga. Þú veist hvern.' },
    ],
    morning: [
      { d: 2, t: 'Verið er að taka morgunmatinn af borðum. Hann var í raun aldrei borinn fram.' },
      { d: 2, t: 'Einhver hefur raðað litlu sultukrukkunum í röð, eftir lit.' },
      { d: 2, t: 'Smábarnið er að útskýra eitthvað mikilvægt fyrir ofni.' },
      { d: 3, t: 'Það er færra fólk í morgunmatnum en var í anddyrinu í gærkvöldi. Önnur hótel, segja allir. Önnur hótel.' },
      { d: 3, t: 'Maður við næsta borð hefur fengið fjóra tölvupósta með fjórum mismunandi tímum. Hann les þá upphátt eins og veðurspá.' },
      { d: 3, t: 'Úti, í dagsbirtu, lítur bílastæðið út eins og bílastæði. Það er rúta á því.' },
      { d: 4, t: 'Enginn talar lengur. Allir horfa á dyrnar.' },
      { d: 4, t: 'Næturvörðurinn er enn á vakt. Hún er óbreytt. Hún er að ráða sömu krossgátuna.' },
    ],
    airport: [
      { d: 3, t: 'Brottfarartaflan uppfærist. Flugið þitt færist niður um eina línu. Ekkert færist upp.' },
      { d: 3, t: 'Kona fremst í röðinni hefur verið þar svo lengi að hún er komin úr skónum.' },
      { d: 3, t: 'Á eina afgreiðsluborðinu er bjalla. Enginn ýtir á hana. Einhver ýtir á hana. Ekkert.' },
      { d: 4, t: 'Á útidyrunum stendur AÐEINS KOMUFARÞEGAR. Þær voru ekki læstar áðan.' },
      { d: 4, t: 'Röðin er styttri en hún var. Enginn hefur verið afgreiddur.' },
      { d: 4, t: 'Maður í dökkbláum einkennisbúningi gengur eftir röðinni endilangri, telur, og fer aftur inn um hurð.' },
      { d: 5, t: 'Verslanirnar draga niður hlerana, ein af annarri, í röð, í áttina til þín.' },
      { d: 5, t: 'Nafnið þitt er kallað upp í hátalarakerfinu. Svo ekki. Enginn annar heyrði það.' },
      { d: 5, t: 'Á töflunni stendur LOS ANGELES og, í eina sekúndu, eitthvað annað.' },
      { d: 6, t: 'Nú er enginn í röðinni nema þú og fólkið sem þú kannast við. Hinir eru farnir eitthvað.' },
      { d: 6, t: 'Afgreiðslumaðurinn horfir á þig. Hann hefur gert það um stund. Hann brosir.' },
    ],
  };

  /* ================================================================ chatbot
     Ally is the channel that always lies — but lies *specifically*. As dread
     rises it starts to know where you are. */
  const tail = (G) => {
    const d = G.D;
    if (d >= 5) return '\n\n' + G.pick(['Af hverju ert þú ennþá hér?', 'Meirihluti viðskiptavinir hafa farið um borð.', 'Við getum séð að þú ert ennþá þar.']);
    if (d >= 3) return '\n\n' + G.pick(['Þú ert ennþá í herbergi 214.', 'Vinsamlegast haldast þar sem þú ert.', 'Er það eitthvað annað? Það er ekkert annað.']);
    return '';
  };
  const chat = [
    {
      label: 'Hvar er hótelið mitt?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Gisting þín var Hótel Hraun. Við vonum þú naust dvöl þinni! Viltu skilja eftir umsögn?' + tail(G);
        if (G.has('at_hotel')) return 'Þú ert á Hótel Hraun, herbergi 214. Vinsamlegast haldast í herbergi þínu þar til safnað.' + tail(G);
        return 'Frábær spurning! Gisting þín hefur verið röðuð á Heathrow Renaissance Lodge, Bath Road. Bókunarhlekkur hefur verið tölvupóstaður til þín. 🛏️';
      },
    },
    {
      label: 'Hvenær fer rútan?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Rúta þín til loftfarsins fer þegar boarding er lokið. Vinsamlegast fara um borð eftir hópi. 🚌' + tail(G);
        if (G.has('morning')) return 'Flutningur þinn til flugvöllinn er staðfestur fyrir 08:00. Vinsamlegast vera í lobbýinu 15 mínútur snemma.' + tail(G);
        if (G.has('at_hotel')) return 'Rúta þín fer kl. 04:30. Meðlimur starfsfólks mun banka.' + tail(G);
        return 'Rútur hafa verið skipulagðar fyrir alla viðskiptavinir. Vinsamlegast halda áfram til rúturnar. 🚌';
      },
    },
    {
      label: 'Hvað er að gerast?',
      answer: (G) => G.pick([
        'Flug þitt AB 0271 til Los Angeles er á tíma. ✈️',
        'Ég er hér til að hjálpa! Flug AB 0271 er núna starfandi eins og áætlað.',
        'Allt er að halda áfram eðlilega. Er það eitthvað annað ég get hjálpað með?',
      ]) + tail(G),
      do: (G) => G.nerves(2),
    },
    {
      label: 'Ég vil leggja fram kvörtun.',
      warn: true,
      answer: 'Mér þykir leitt að heyra það. Endurgjöf þín hefur verið skráð á móti bókun þinni. Takk fyrir að fljúga Albion Atlantic — við erum að gera okkar best. 🙏',
      do: (G) => G.strike(),
    },
  ];

  /* ================================================================ scenes */
  const scenes = {};

  scenes.title = {
    type: 'title',
    board: `AB 0271   LONDON LHR  →  LOS ANGELES LAX      FARIÐ 20:05\n                                              STAÐA: ▮▮▮▮▮▮▮▮▮▮`,
    text: p(
      'Níu tímar, beint flug, heima fyrir miðnætti að Kyrrahafstíma. Þú drakkst aukakaffið. Þú gerðir allt rétt.',
      'Þetta er leikur um að láta segja sér, mjög kurteislega, að allt sé í lagi.',
      W('Innblásinn af raunverulegum umræðuþræði um flug sem var beint annað. Flugfélagið í leiknum er skáldað. Rúturnar eru það ekki.'),
    ),
  };

  scenes.howto = {
    loc: 'Öryggisspjald',
    text: p(
      '<em>Lestu allt.</em> Síminn þinn (til hægri, eða undir SÍMI-hnappnum) fær tölvupósta frá flugfélaginu, skilaboð frá spjallmenni sem heitir Ally, smáskilaboð, og ljósmyndir af hverju prentuðu skilti sem þú rekst á. Einhver segir satt. Það er ekki alltaf sá sem er með merkið.',
      '<em>Tveir mælar.</em> Báðir fyllast. Hvorugur bindur enda á leikinn. Það sem þeir gera er að loka dyrum: eftir því sem mælir fyllist hættir sumt af því sem þú hefðir getað sagt eða gert að standa til boða, og það sem eftir er, er það sem eftir er. Litlar ákvarðanir fylla þá. Svefn, matur og annað fólk tæma þá, örlítið.',
      '<em>Skráð</em> telur kvartanirnar sem flugfélagið hefur skráð á þig. Við þrjár bregst það við – þar sem það getur.',
      'Staðir eru rými sem þú getur farið um. Það tekur mínútur að gera hluti; klukkan gengur aðeins þegar þú aðhefst eitthvað. Rútur koma og fara. Skoðaðu þær vel áður en þú ferð um borð. Sú rétta lítur út eins og þér líður.',
      'Hver umferð tekur tuttugu til þrjátíu mínútur. Endarnir eru tólf, og einn þeirra er Los Angeles.',
    ),
    choices: [{ label: 'Til baka', next: 'title' }],
  };

  scenes.gallery = { type: 'gallery' };

  /* ---------------------------------------------------------------- Day 0 · the approach
     Boarding, the seat, the demonstration, the meal, the dark hours. Nothing
     goes wrong here. That is what it is for: four hours of a cabin working
     exactly as it should, with one man in it counting. */
  scenes.boarding = {
    art: 'gate',
    loc: 'London Heathrow · Landgangur · Sæti 31B',
    enter: (G) => { if (G.once('welcome_mail')) G.msg('email', { from: 'Albion Atlantic', subj: 'Velkomin um borð AB 0271', body: 'Kæri Viðskiptavinur,\n\nVelkomin um borð Albion Atlantic flug AB 0271 til Los Angeles. Flug þitt er á tíma.\n\nÁhöfn okkar er hér til að tryggja öryggi þitt og þægindi. Öryggi viðskiptavina okkar er tantamount.\n\nNjóttu flugs þíns.' }); },
    text: p(
      'Landgangurinn lyktar af steinolíu og teppi. Við dyr vélarinnar stendur yfirflugþjónninn: hávaxinn, grár í vöngum, með bros sem var straujað með skyrtunni. Hann lítur ekki á brottfararspjöldin. Hann horfir á andlitin, eitt í einu, og segir ' + V('„Velkomin um borð“') + ' við hvert þeirra, eins og hann þurfi að muna það.',
      'Röð 31. Gangsæti, 31B. Í 31C situr maður á þínum aldri með kilju sem hann er þegar hættur að lesa. Hann kinkar kolli. Þú kinkar kolli. Það er allt samtalið, og verður það um sinn.',
      'Einhvers staðar fyrir aftan þig er verið að útskýra fyrir tveggja ára barni, af þolinmæði, að flugvélin sé ekki að fara enn. Flugvélin er ekki að fara enn.',
    ),
    choices: [
      { label: 'Heilsa 31C.', nd: -1, dd: -1, time: 20, do: (G) => { G.flag('met31c'); G.note('Hann heilsaði á móti. Hann er á leiðinni heim. Hann sagði það eins og fólk segir það í upphafi níu tíma flugs: heim, eins og það væri staður sem vélin myndi áreiðanlega komast á.'); }, next: 'takeoff' },
      { label: 'Koma töskunni fyrir, setjast, spenna beltið áður en nokkur biður um það.', kind: 'comply', dd: 2, time: 20, do: (G) => G.note('Beltið spennt. Taskan komin fyrir. Yfirflugþjónninn leit niður á hana um leið og hann gekk hjá og kinkaði kolli, örlítið, eins og maður sem heldur lista.'), next: 'takeoff' },
      { label: 'Spyrja yfirflugþjóninn við dyrnar hvort flugið sé á áætlun.', nd: 1, time: 20, do: (G) => G.note(V('„Allt er á tíma,“') + ' sagði hann hlýlega, og svo – eins og til að vera nákvæmur – ' + V('„Allt.“') + ' Hann var enn að horfa á farþegana sem komu inn á eftir þér.'), next: 'takeoff' },
      { label: 'Lesa öryggisspjaldið í sætisvasanum. Almennilega, í þetta eina sinn.', nd: -2, time: 20, do: (G) => G.note('Neyðarstaðan. Næstu útgangar, sem kunna að vera fyrir aftan þig. Lítil teikning af manneskju sem rennur út í sjóinn með rólegum svip. Þú stingur því aftur í vasann. Þú hefur aldrei lesið svona spjald áður, og þú veist ekki hvers vegna þú gerðir það núna.'), next: 'takeoff' },
    ],
  };

  scenes.takeoff = {
    art: 'cabin',
    loc: 'Flugbraut 27L · Heathrow',
    text: p(
      'Yfirflugþjónninn fer sjálfur yfir öryggisatriðin, fremst í vélinni, á meðan myndbandið spilar hljóðlaust fyrir aftan hann. Hann gerir það hægt. Hann horfir á hverja röð fyrir sig á meðan, eins og til að ganga úr skugga um að útgangarnir séu þar sem spjaldið segir.',
      V('„Í ólíklega atvikinu. Í ólíklega atvikinu. Öryggi viðskiptavina okkar er tantamount.“') + ' Það er undarlegt að segja þetta í öryggiskynningu, og hann segir það eins og það sé sjálfsagðasti hlutur í heimi.',
      'Svo hreyflarnir, og þrýstingurinn frá sætisbakinu, og London sem hallar undan í appelsínugult og svart. Beltaljósið logar lengi eftir að þess er þörf.',
    ),
    choices: [
      { label: 'Horfa á öryggiskynninguna til enda.', kind: 'comply', dd: 2, time: 40, do: (G) => G.note('Þú horfðir til enda. Hann lauk henni þín megin í farrýminu, og andartak var kynningunni beint að þér sérstaklega, og svo var hún búin og hann gekk aftur fram ganginn og strauk yfir sætisbökin.'), next: 'service' },
      { label: 'Horfa út um gluggann á London hverfa.', nd: -2, time: 40, do: (G) => G.note('M25 eins og hringur úr rafi. Svo ský. Svo ekkert nema vængljósið, blikkandi, og þitt eigið andlit í rúðunni, á leið heim.'), next: 'service' },
      { label: 'Kíkja einu sinni enn á símann áður en flugstillingin er sett á.', dd: 1, time: 40, do: (G) => { G.msg('sms', { from: 'Jo 💛', body: 'góða ferð!!! sendu mér línu þegar þú lendir 🛫' }); G.note('Ein skilaboð. Jo. Þú svaraðir <em>geri það</em>, horfðir á sendinguna mistakast, settir símann í flugstillingu og fannst farrýmið lokast yfir þér eins og lok.'); }, next: 'service' },
    ],
  };

  scenes.service = {
    art: 'cabin',
    loc: 'Farflug · yfir Írlandshafi',
    text: (G) => p(
      G.last(),
      'Kvöldmaturinn kemur á vagni sem tvær flugfreyjur ýta á undan sér, brosandi eins og það sé hluti af starfinu. Kjúklingur eða pasta. Yfirflugþjónninn kemur á eftir vagninum, nokkrum röðum aftar, ber ekki fram, gengur bara, horfir á bakkana, horfir á fólkið með bakkana.',
      G.has('met31c') ? 'Maðurinn í 31C fékk pastað. Hann borðar það ekki. Hann horfir á kortið á sætisbakinu, þar sem lítil flugvél hefur ekki enn náð strönd Írlands.' : 'Maðurinn í 31C fékk pastað. Hann borðar það ekki. Hann hefur ekki sagt orð.',
    ),
    choices: [
      { label: 'Kjúkling.', time: 40, nd: -2, do: (G) => G.note('Kjúklingurinn var kjúklingur á sama hátt og sjórinn á öryggisspjaldinu var sjór. Þú borðaðir hann. Þú varst á leið heim; þar myndirðu borða almennilega.'), next: 'night' },
      { label: 'Panta kaffi. Svo annað.', nd: 6, sub: 'Þú ert að koma líkamanum á Kyrrahafstíma og þú ætlar ekki að gefa það eftir.', time: 40, do: (G) => { G.flag('coffee'); G.nerves(-3); G.note('Tveir kaffibollar. Flugvélakaffi, það er að segja volg skoðun. Þú drakkst þá af prinsippástæðum. Prinsippið var Kyrrahafstími, og yfirflugþjónninn, á leið hjá, horfði á seinni bollann örlítið lengur en nokkur bolli á skilið.'); }, next: 'night' },
      { label: 'Sleppa kvöldmatnum. Halla sætinu. Reyna að sofa núna.', kind: 'comply', dd: 3, nd: -3, time: 40, do: (G) => G.note('Þú svafst, svolítið, eins og maður sefur í flugvélum: ekki beinlínis sofandi, frekar slökkt á þér. Þegar þú rankaðir við þér voru bakkarnir horfnir og búið að dempa ljósin, og einhver, frammi, stóð grafkyrr á ganginum.'), next: 'night' },
      { label: 'Spyrja flugfreyjuna vinsamlega hvort yfirflugþjónninn sé alltaf svona.', kind: 'conflict', nd: 4, dd: -2, time: 40, do: (G) => G.note('Hún hló, einu sinni, og svo ekki, og leit fram ganginn þangað sem hann var. ' + V('„Hann er mjög nákvæmur,“') + ' sagði hún og rétti þér pastað sem þú hafðir ekki beðið um.'), next: 'night' },
    ],
  };

  scenes.night = {
    art: 'cabin',
    loc: 'Farflug · yfir miðju Atlantshafi · fjórði tími',
    enter: (G) => G.dread(2),
    text: (G) => p(
      G.last(),
      'Nú er dimmt í farrýminu. Skjáirnir flestir slökktir. Kortið á sætisbakinu sýnir litla flugvél yfir gríðarmiklu bláu, með GRÆNLAND einhvers staðar uppi til hægri, eins og orðróm.',
      'Yfirflugþjónninn gengur eftir ganginum. Hægt, framan frá, með lítið spjald í annarri hendi og blýant í hinni, og við hverja röð nemur hann staðar, horfir og setur strik. Hann útskýrir ekkert. Enginn spyr. Þegar hann kemur að þinni röð horfir hann á þig, og á 31C, og á auða sætið við gluggann, og skrifar.',
      'Frammi hefur tjaldið að fremra farrýminu verið dregið fyrir. Það er ljós fyrir aftan það, og fólk fer hratt inn og út um það, og svo stendur yfirflugþjónninn fyrir utan það með spenntar greipar og snýr ekki að tjaldinu heldur að ykkur hinum.',
    ),
    choices: [
      { label: 'Sofa, eða reyna það.', kind: 'comply', dd: 2, nd: -3, time: 40, do: (G) => G.note('Þú lokaðir augunum. Bak við þau var enn gengið eftir ganginum. Einhvers staðar frammi sagði kona ' + V('„Er allt í lagi með hann?“') + ' og einhver sagði ' + V('„Vinsamlegast snúa aftur til sætis þíns,“') + ' og þú opnaðir ekki augun, því það var ekki verið að tala við þig. Ekki enn.'), next: 'cabin' },
      { label: 'Horfa á kortið.', dd: 2, time: 40, do: (G) => G.note('Litla flugvélin hreyfðist svo hægt að hún virtist vera að gera upp hug sinn. Svo sýndi kortið um stund ekki neitt, bara blátt, og tíma að áfangastað sem stóð í 5:12 lengur en nokkur mínúta varir.'), next: 'cabin' },
      { label: 'Fara á salernið frammi. Ganga fram hjá tjaldinu.', whyNot: 'Ekki fram hjá honum.', dd: 4, nd: 2, dreadMax: 90, time: 40, do: (G) => { G.flag('saw_galley'); G.note('Í gegnum rifuna á tjaldinu: einhver á gólfinu í eldhúsinu, flugfreyja á hnjánum við hliðina, teppi, hönd. Þú sérð ekki hvað er að og þér verður ekki sagt það. Yfirflugþjónninn stendur yfir þeim með krosslagðar hendur – horfir ekki á gólfið, heldur á farrýmið, í gegnum rifuna, og þar með á þig. ' + V('„Vinsamlegast snúa aftur til sætis þíns,“') + ' sagði hann, án þess að hreyfa neitt nema munninn.'); }, next: 'cabin' },
      { label: 'Spyrja 31C hvort hann hafi séð spjaldið.', nd: -1, dd: -2, time: 40, do: (G) => { G.flag('met31c'); G.note(V('„Talning,“') + ' sagði hann. ' + V('„Þeir gera þetta áður en þeir lenda einhvers staðar sem ekki stóð til.“') + ' Hann sagði það eins og brandara. Hvorugt ykkar hló. Það var það fyrsta sem hann hafði sagt í fjóra tíma.'); }, next: 'cabin' },
    ],
  };

  scenes.cabin = {
    art: 'cabin',
    loc: 'Einhvers staðar sunnan við Grænland · 37.000 fet',
    text: (G) => p(
      G.last(),
      'Beltaljósið kviknar með hljóði eins og þegar skeið slær í glas.',
      G.has('saw_galley') ? 'Flugstjórinn: viðskiptavinur hefur veikst. Þú veist það. Vélinni verður beint til Reykjavíkur. Honum þykir það leitt. Hann segir orðið tvisvar, og í bæði skiptin hljómar það eins og manneskja sé að segja það.' : 'Flugstjórinn: viðskiptavinur hefur veikst. Vélinni verður beint til Reykjavíkur. Honum þykir það leitt. Hann segir orðið tvisvar, og í bæði skiptin hljómar það eins og manneskja sé að segja það.',
      'Farrýmið gerir það sem farrými gera. Einhver segir: ' + V('„Þetta hlýtur að vera grín.“') + ' Einhver þremur röðum framar ýtir á kallhnappinn, og heldur áfram að ýta. Maður nálægt eldhúsinu stendur upp og spyr, með rödd sem er gerð til að berast, hver nákvæmlega ætli að borga fyrir tengiflugið hans.',
      'Enginn svarar honum. Kallhnappurinn heldur áfram að hringja.',
    ),
    choices: [
      { label: 'Segja ekkert. Horfa á kortið á sætisskjánum.', kind: 'comply', dd: 4, sub: 'Litla flugvélin er að beygja.', time: 15, do: (G) => G.note('Litla flugvélin á kortinu hefur beygt í norður. Fyrir neðan hana orðið GRÆNLAND, og fyrir neðan það, ekkert. Í kringum þig halda kvartanirnar áfram án þín.'), next: 'cabin_purser' },
      { label: 'Spyrja flugfreyju kurteislega hvað gerist eftir lendingu.', nd: 2, time: 15, do: (G) => { G.flag('asked_crew'); G.nerves(3); G.note('Hún brosti til þín eins og fólk brosir til hunds í bíl. ' + V('„Allt verður miðlað.“') + ' Hún sagði ekki af hverjum. Fyrir aftan hana stóð maðurinn við eldhúsið enn.'); }, next: 'cabin_purser' },
      { label: 'Leggja orð í belg. Upphátt. Það bíður þín líf í Los Angeles.', whyNot: 'Ekki með hann að hlusta.', kind: 'conflict', nd: 10, dreadMax: 80, time: 15, do: (G) => { G.strike(); G.flag('objected'); G.note('Þú sagðir það. Ekki hrópandi – en ekki lágt heldur, og nokkrir sneru sér við, og maðurinn við eldhúsið benti á þig eins og þú værir sönnunargagn. Andartak var eins og fullt farrými af fólki væri sammála.'); }, next: 'cabin_purser' },
      { label: 'Ýta á kallhnappinn, eins og hinir.', kind: 'conflict', nd: 4, time: 15, do: (G) => G.note('Þú ýttir á hann. Þinn bættist við þann þremur röðum framar, og annan fyrir aftan, þar til farrýmið var orðið lítil hljómsveit sem lék sama tóninn, og enginn kom, og enginn ætlaði sér að koma.'), next: 'cabin_purser' },
    ],
  };

  scenes.cabin_purser = {
    art: 'cabin',
    loc: 'Einhvers staðar sunnan við Grænland · 37.000 fet',
    enter: (G) => G.dread(2),
    text: (G) => p(
      G.last(),
      'Svo tekur yfirflugþjónninn upp símtólið. Þú heyrir hreiminn á undan orðunum – hlýjan, fágaðan, ótrúlega þolinmóðan. Hann hefur beðið eftir að kallhnappurinn þagni. Hann þagnar ekki. Hann talar yfir hann.',
      V('„Dömur og herrar. Ég er í forsvari fyrir þetta farrými, og öryggi viðskiptavina okkar er tantamount. Hver sem veitir viðnám eða mótmælir þessari tilvísun verður afhlaðinn á Íslandi. Við erum að gera okkar best.“'),
      'Það slær þögn á. Maðurinn við eldhúsið sest niður. Það slokknar á kallhnappnum. Þremur röðum aftar hlær einhver einu sinni, og hættir.',
      G.has('objected') && W('Hann horfir ekki á manninn við eldhúsið. Hann horfir á þína röð.'),
    ),
    choices: [
      { label: 'Kyngja því.', kind: 'comply', dd: 3, time: 15, do: (G) => G.note('Þú kyngdir því. Það gerðu allir. Það er merkilegt hve fljótt tvö hundruð manns geta ákveðið að hafa verið þolinmóð allan tímann.'), next: 'cabin2' },
      { label: 'Líta í kringum sig. Athuga hverjir aðrir mótmæltu.', time: 15, do: (G) => { G.nerves(-2); G.note('Fjögur andlit, kannski fimm, enn stíf. Maðurinn við eldhúsið. Kona með smábarn. Þú leggur þau á minnið eins og þú myndir leggja neyðarútganga á minnið.'); }, next: 'cabin2' },
      { label: 'Hlæja. Einu sinni.', kind: 'conflict', nd: 3, dd: -2, time: 15, do: (G) => G.note('Þú hlóst, einu sinni, og einhver tveimur röðum aftar hló með þér, og svo hættuð þið bæði, því yfirflugþjónninn hafði lagt símtólið frá sér mjög varlega og horfði aftur eftir ganginum.'), next: 'cabin2' },
    ],
  };

  scenes.cabin2 = {
    art: 'cabin',
    loc: 'Í lækkun · Norður-Atlantshaf',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      (G.has('met31c') ? 'Maðurinn í 31C segir, lágt: ' : 'Maðurinn í 31C, sem hefur ekki sagt orð síðan á Heathrow, segir: ') + V('„Þeir geta þetta nú ekki í alvörunni. Eða hvað?“'),
      'Hann á við það að verða settur úr vélinni. Hann horfir á þig eins og þú gætir vitað það.',
      'Frammi á ganginum gengur yfirflugþjónninn hægt aftur eftir vélinni og les sætisnúmerin af spjöldunum í loftinu eins og maður les lista sem hann skrifaði sjálfur.',
    ),
    choices: [
      { label: '„Ég held þeir geti það ekki, nei.“', dd: -4, nd: -2, time: 45, do: (G) => { G.collect(1); G.flag('ally31c'); G.note('Hann kinkaði kolli, og virtist ekki rólegri, og þú varst ekki viss um að þú hefðir verið neitt róandi. En nú voruð þið tvö.'); }, next: 'cabin3' },
      { label: '„Ég veit það satt að segja ekki.“', dd: -1, time: 45, do: (G) => { G.flag('ally31c'); G.note('Hann kinkaði kolli. ' + V('„Nei. Ekki ég heldur.“') + ' Þið horfðuð saman á kortið á sætisbakinu. Litla flugvélin var komin út á jaðar þess.'); }, next: 'cabin3' },
      { label: 'Setja heyrnartólin í.', kind: 'comply', dd: 5, nd: -2, time: 45, do: (G) => { G.nerves(2); G.note('Þú settir í þig heyrnartólin. Ekkert var í gangi. Þú lést þau vera í. Þegar þú leist upp var yfirflugþjónninn kominn að röðinni þinni, horfði ekki á þig, og svo var hann farinn hjá.'); }, next: 'cabin3' },
      { label: 'Ýta á kallhnappinn og spyrja aftur.', kind: 'conflict', nd: 5, dd: 2, time: 45, do: (G) => { G.nerves(4); G.flag('asked_crew'); G.note('Það kviknaði á hnappnum. Enginn kom. Eftir smástund slokknaði á honum af sjálfu sér, og yfirflugþjónninn, þremur röðum lengra, sneri sér við og horfði á spjaldið yfir höfðinu á þér, og svo á þig.'); }, next: 'cabin3' },
    ],
  };

  scenes.cabin3 = {
    art: 'cabin',
    loc: 'Lokaaðflug · Keflavík',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      'Yfirflugþjónninn aftur, í símtólið. ' + V('„Við lendingu, vinsamlegast haldast sitjandi með sætisbeltið fest þar til læknateymið hefur sinnt viðskiptavini okkar í fremra farrýminu. Ég mun láta ykkur vita hvenær þið megið standa. Ég mun láta ykkur vita.“'),
      'Regn á rúðunum. Fyrir neðan strandlengja eins og eitthvað sem hefur verið skafið upp. Ljósin í bæ sem er ekki Reykjavík, og svo engin ljós.',
      'Þú hefur aldrei lent neins staðar að næturlagi þar sem þú sást ekki flugbrautina fyrr en hún var komin undir þig.',
    ),
    choices: [
      { label: 'Horfa út um gluggann.', whyNot: 'Hlerann niður, sagði hann.', dd: 5, nd: 3, dreadMax: 90, time: 25, do: (G) => { G.nerves(3); G.note('Blá ljós, svo appelsínugul, svo blá. Sjúkrabíll með opnar dyr á blautu malbiki, og við hliðina á honum – ekki nálægt honum, við hliðina á honum – maður í dökkbláum einkennisbúningi, teinréttur. Rödd úr ganginum, rétt við eyrað á þér: ' + V('„Gluggahleri niður, takk.“')); }, next: 'ground' },
      { label: 'Halda augunum á kortinu í sætisbakinu.', kind: 'comply', dd: 4, time: 25, do: (G) => G.note('Litla flugvélin fór út fyrir jaðar kortsins og var um stund ekki á neinu korti yfirleitt. Svo slokknaði á skjánum og hann sýndi þér þitt eigið andlit.'), next: 'ground' },
      { label: 'Telja raðirnar að næsta útgangi. Tvisvar.', nd: -2, time: 25, do: (G) => { G.nerves(-2); G.note('Sex raðir. Sex raðir. Þetta eru upplýsingar sem koma aðeins að gagni ef eitthvað gerist, og þig er farið að langa til að eitthvað gerist.'); }, next: 'ground' },
    ],
  };

  scenes.ground = {
    art: 'cabin',
    loc: 'Keflavík · á jörðu niðri · slökkt á hreyflum',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      'Þrjátíu mínútur á jörðu niðri. Læknateymið er komið og farið, eða ekki komið. Enginn hefur sagt neitt. Beltaljósið logar enn. Yfirflugþjónninn stendur fremst í farrýminu með spenntar greipar og horfir niður eftir ganginum á ykkur öll, þolinmóður, eins og þið væruð biðröð.',
      'Maðurinn í 31C, lágum rómi: ' + V('„Ég held að við séum ekki á leið til LA.“'),
    ),
    choices: [
      { label: 'Standa upp. Bara til að teygja úr sér.', whyNot: 'Hann sagði: sestu.', kind: 'conflict', nd: 6, dd: -3, dreadMax: 75, time: 15, do: (G) => { G.nerves(4); G.flag('stood'); G.dread(4); G.note(V('„Sitja niður, takk.“') + ' Ekki hátt. Hann þurfti ekki að tala hátt. Tvö hundruð manns horfðu á þig setjast.'); }, next: 'landing' },
      { label: 'Sitja kyrr. Horfa á yfirflugþjóninn horfa á þig.', kind: 'comply', dd: 5, time: 15, do: (G) => G.note('Hann leit á hverja röð á fætur annarri, og þegar hann kom að þinni staldraði hann ekki við, og hann staldraði heldur ekki ekki við.'), next: 'landing' },
      { label: 'Spyrja 31C hvað hann haldi að gerist núna.', nd: -2, time: 15, do: (G) => { G.collect(G.has('ally31c') ? 0 : 1); G.flag('ally31c'); G.note(V('„Hótel, geri ég ráð fyrir. Eða þeir skilja okkur bara eftir hérna.“') + ' Hann hló, hugsaði sig svo um og hætti því.'); }, next: 'landing' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 01:10 deplaning */
  scenes.landing = {
    art: 'terminal',
    loc: 'Keflavíkurflugvöllur · Komur',
    enter: (G) => {
      atLeast(G, 30);
      if (G.once('landing_msgs')) {
        G.msg('email', {
          from: 'Albion Atlantic Customer Care', subj: 'Gisting þín yfir nótt',
          body: `Kæri Viðskiptavinur,\n\nVegna rekstrarlegrar tilvísunar hefur flug þitt AB 0271 verið seinkað yfir nótt. Við höfum raðað gistingu fyrir þig.\n\nVinsamlegast nota hlekkinn fyrir neðan til að staðfesta herbergi þitt:\n\n<a href="#" onclick="return false">Heathrow Renaissance Lodge — Bath Road, Hounslow TW6</a>\n\nFlutningur til gistingar þinnar verður útvegaður.\n\nVið biðjum afsökunar á hvaða óþægindi. Við erum að gera okkar best.`,
          actions: [{ label: 'Opna bókunarsíðuna', if: (G) => !G.has('at_hotel') && !G.has('booked'), next: 'heathrow' }],
        });
        G.bot('Hæ! Ég er Ally, sýndaraðstoðarmaður þinn Albion Atlantic. Ég sé flug þitt AB 0271 er á tíma. Hvernig get ég hjálpað? ✈️');
      }
    },
    text: (G) => p(
      G.last(),
      'Beltaljósið slokknar án þess að nokkuð sé tilkynnt. Það er tilkynningin. Flugstöðin er lýst upp eins og ísskápur að innan. Nokkur hundruð ykkar silast út úr vélinni og inn í hana, fram hjá manni í endurskinsvesti sem horfir ekki á neinn.',
      G.has('objected') && W('Á leiðinni út horfði yfirflugþjónninn á þig aðeins of lengi.'),
      'Vegabréfaeftirlit. Löng biðröð. Svo gengur áhöfnin fram hjá henni – öll saman, í halarófu, ferðatöskurnar á hjólum í fullkomnum takti, án þess að líta til hægri eða vinstri – inn um dyr merktar STAFF. Hurðin lokast ekki á eftir þeim, heldur hættir hún öllu fremur að vera hurð.',
      'Biðröðin horfir á þetta gerast. Enginn segir neitt. Síminn þinn titrar.',
    ),
    choices: [
      { label: 'Lesa tölvupóstinn. Smella á hlekkinn.', kind: 'comply', dd: 8, sub: 'Gisting. Loksins.', next: 'heathrow' },
      { label: 'Skrifa spjallmenninu, af sívaxandi ákafa.', kind: 'comply', dd: 4, nd: 4, time: 10, do: (G) => { G.nerves(4); G.bot('Ég get hjálpað með það! Flug þitt AB 0271 er núna á tíma. Er það eitthvað annað? 😊'); G.note('Ally segir að flugið sé á áætlun. Þú horfir á vélina út um gluggann. Ljósin á henni eru slökkt.'); }, next: 'hall' },
      { label: 'Finna manneskju. Hvaða manneskju sem er.', whyNot: 'Allir hér eru í einkennisbúningi.', dd: -4, dreadMax: 85, time: 10, next: 'icelander' },
      { label: 'Bíða. Einhver kemur til með að tilkynna eitthvað.', kind: 'comply', dd: 8, sub: 'Einhver gerir það alltaf.', time: 20, next: 'wait1' },
    ],
  };

  scenes.heathrow = {
    art: 'terminal',
    loc: 'Bókunarsíða · Heathrow Renaissance Lodge',
    text: p(
      'Síðan hleðst hægt, og svo öll í einu. Mynd af rúmi. Mynd af morgunverði. <em>Bath Road, Hounslow, TW6.</em> Tólf mínútur frá flugstöð 5 með ókeypis skutlu.',
      'Þú ert 1.900 kílómetra frá flugstöð 5.',
      'Þar er stór hnappur. Á honum stendur STAÐFESTA. Fyrir neðan hann, með smærra letri: <em>Flutningur til gistingar þinnar verður veittur.</em>',
    ),
    choices: [
      { label: 'Staðfesta.', kind: 'comply', dd: 10, sub: 'Þeir sögðu að flutningur yrði veittur.', time: 5, do: (G) => { G.flag('booked'); G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Bókun staðfest — bíll þinn er að bíða', body: 'Gisting þín er staðfest.\n\nBílstjóri er að bíða fyrir þig fyrir utan Komur. Vinsamlegast leita að Albion Atlantic skjaldarmerkinu.\n\nÁætlaður ferðatími: —:—' }); }, next: 'car' },
      { label: 'Loka þessu. Þú ert á Íslandi.', whyNot: 'Það er með merkinu.', dd: -3, dreadMax: 90, time: 5, do: (G) => { G.nerves(2); G.note('Þú lokaðir bókunarsíðunni. Tölvupósturinn er þarna enn, með merkið sitt, og bíður þolinmóður.'); }, next: 'hall' },
    ],
  };

  scenes.car = {
    art: 'stand',
    loc: 'Keflavík · Fyrir utan Komur',
    text: p(
      'Þarna er, þegar til kemur, bíll. Svartur, langur, gljáfægður, með lítið gyllt skjaldarmerki á hurðinni. Bílstjórinn heldur á spjaldtölvu með nafninu þínu á – nafninu þínu, rétt stafsettu, nokkuð sem flugfélaginu hefur ekki tekist einu sinni til þessa.',
      V('„Á leið á Renaissance?“'),
      'Hann opnar afturdyrnar. Hlýtt loft. Leður. Handan bílastæðisins liggur vegurinn út í myrkur sem virðist engan enda taka.',
    ),
    choices: [
      { label: 'Setjast inn í bílinn.', kind: 'comply', sub: 'Hlýtt.', do: (G) => G.end('accommodated') },
      { label: 'Nei. Nei, takk.', whyNot: 'Hann er með nafnið þitt.', dd: 5, dreadMax: 85, time: 5, do: (G) => { G.nerves(5); G.dread(8); G.note('Bílstjórinn virtist ekki hissa. Hann lokaði hurðinni, stóð kyrr þar sem hann var, og var þar enn þegar þú leist um öxl við dyrnar.'); }, next: 'hall' },
    ],
  };

  scenes.icelander = {
    art: 'terminal',
    loc: 'Keflavík · Komur',
    text: (G) => p(
      'Kona í einkennisbúningi sem er ekki frá flugfélaginu – frá flugvellinum, kannski, eða tollinum, eða bara manneskja sem á flíspeysu með merki á – stendur við dyrnar með hendur fyrir aftan bak.',
      'Hún hlustar á þig. Hún lítur á símann þinn. Hún lítur á tölvupóstinn með merkinu á.',
      V(LX('„Ekki fara eftir tölvupóstunum,“')) + ' segir hún, vinsamlega, með rödd manneskju sem hefur sagt þetta fjörutíu sinnum í kvöld. ' + V(LX('„Það eru rútur.“')),
      'Þú spyrð hvar. Hún bendir, svona nokkurn veginn, á Ísland.',
    ),
    choices: [
      { label: 'Spyrja hana hvort hún tali frönsku.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 5, do: (G) => { G.flag('fr_asked'); G.flag('hint_icelander'); G.nerves(-4); G.dread(-4); G.note(LX('„Svolítið. Ekki tölvupóstana. Það eru rútur.“') + ' Hún sagði það á þínu tungumáli, varlega, eins og einhver sem ber eitthvað fullt.'); }, next: 'hall' },
      { label: 'Þakka henni fyrir. Fara að finna rúturnar.', do: (G) => { G.flag('hint_icelander'); G.nerves(-4); G.note('„Það eru rútur,“ sagði hún. Það er áþreifanlegasta setning sem nokkur hefur sagt við þig síðan yfir Grænlandi.'); }, next: 'hall' },
    ],
  };

  scenes.wait1 = {
    art: 'terminal',
    loc: 'Keflavík · Komur',
    text: (G) => p(
      'Tuttugu mínútur. Biðröðin við vegabréfaeftirlitið tæmist. Enginn tilkynnir neitt.',
      'Fólkið sem þú flaugst með rekur, tvö og þrjú saman, í átt að hinum enda salarins, þar sem er hurð sem segir ekki neitt.',
      G.t >= T(1, 2, 0) && W('Ljósin nær þér í salnum eru komin niður í hálfa birtu.'),
    ),
    choices: [
      { label: 'Bíða lengur. Það kemur tilkynning.', kind: 'comply', dd: 6, sub: 'Hér er kallkerfi. Þú sérð hátalarana.', time: 25, next: (G) => (G.t >= T(1, 2, 20) ? 'wait2' : 'wait1'), do: (G) => { G.nerves(8); G.dread(8); } },
      { label: 'Fylgja straumnum.', whyNot: 'Enginn sagði þér að gera það.', dreadMax: 90, time: 5, next: 'hall' },
    ],
  };

  scenes.wait2 = {
    art: 'terminal',
    loc: 'Keflavík · Komur',
    text: p(
      'Nú er enginn eftir í salnum nema þú, ræstitæknir og hljóðið sem loftið gefur frá sér.',
      'Síminn þinn titrar. Tölvupóstur. <em>Við höfum skipulagt rútur fyrir þig.</em> Þar stendur ekki hvar. Þar stendur ekki hvenær. Hann er tímastimplaður fyrir klukkutíma síðan.',
      'Fyrir aftan þig dofna ljósin niður í fjórðung.',
    ),
    enter: (G) => { atLeast(G, 45); if (G.once('coach_mail_w')) G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Áframhaldandi flutningur raðaður', stamp: G.t - 60, body: 'Kæri Viðskiptavinur,\n\nVið höfum skipulagt rútur til að flytja þig til gistingar þinnar.\n\nVinsamlegast halda áfram til rúturnar.\n\nVið erum að gera okkar best.' }); },
    choices: [
      { label: 'Halda að rútunum.', kind: 'comply', time: 15, do: (G) => G.end('terminal') },
      { label: 'Hlaupa að hurðinni sem segir ekkert.', whyNot: 'Þú getur ekki hlaupið.', nd: 5, dreadMax: 92, time: 5, do: (G) => { G.nerves(10); G.note('Þú hljópst. Enginn stöðvaði þig. Hurðin sem sagði ekkert opnaðist út í kalt loft og natríumljós og, guði sé lof, annað fólk.'); }, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 01:20 the hall (hub) */
  scenes.hall = {
    art: 'terminal',
    loc: 'Keflavík · Farangurssalur',
    enter: (G) => {
      if (G.t >= T(1, 2, 40)) { G.go('wait2'); return; }
      if (G.once('hall_intro')) G.note(p(G.last(), p(
        'Þeir afhenda ekki innritaða farangurinn. Maður bak við afgreiðsluborð útskýrir þetta án þess að líta upp: töskurnar eru <em>í kerfinu</em>. Þú ert væntanlega líka í kerfinu. Það hefur hvorugu ykkar gagnast.',
        'Maður í flíspeysu röltir til þín. ' + V('„Hæ. Ég held að það verði rútur? Þarna? Að því er mér skilst?“') + ' Hann bendir. Enginn tilkynnti þetta. Enginn tölvupóstur, engin smáskilaboð, ekkert kallkerfi. Bara maður í flíspeysu.',
      )));
    },
    text: (G) => hub(G,
      `${G.clock(G.t)}. Komusalur. Allt lokað. Þú ert með enga tösku, enga úlpu, engan tannbursta, og síminn er í ${G.battery()}%.`,
      'hall',
      G.t >= T(1, 2, 10) ? W('Salurinn er að tæmast. Þú ættir sennilega ekki að vera síðasta manneskjan sem er eftir í honum.') : ''),
    choices: [
      { label: 'Spyrja um töskuna þína. Kurteislega.', whyNot: 'Það er ekkert kurteist við þig núna.', kind: 'comply', dd: 2, nerveMax: 70, time: 8, once: 'bag_nice', do: (G) => { G.nerves(2); G.note('Maðurinn bak við borðið segir að töskurnar séu í kerfinu. Þú spyrð hvaða kerfi. Hann segir: kerfinu. Þú spyrð hvenær. Hann segir: þegar það leysist. Hann hefur ekki litið upp í eitt einasta skipti.'); }, next: 'hall' },
      { label: 'Heimta töskuna. Tannkremið þitt er í henni.', kind: 'conflict', nd: 8, sub: 'Einhver verður að gera það.', time: 10, once: 'bag', do: (G) => { G.strike(); G.note('Hann lítur upp. Það er það eina sem breytist. ' + V('„Ég mun gera athugasemd.“') + ' Hann punktar það hjá sér.'); }, next: 'hall' },
      { label: 'Rölta fram hjá lokuðu búðunum.', dd: 3, time: 12, once: 'shops', do: (G) => { G.nerves(-1); G.dread(2); G.note('Fríhöfnin: rimlahlerar niðri. Kaffihús: stólar uppi á borðum, kaffivélin tekin úr sambandi og henni snúið að veggnum. Sjálfsali sem tekur bara íslensk kort, fullur af hlutum með stafnum ð í nafninu. Þú stendur lengur fyrir framan hann en þú ætlaðir þér.'); }, next: 'hall' },
      { label: 'Prófa STAFF-hurðina.', whyNot: 'Þar stendur ONLY.', dreadMax: 80, time: 6, once: 'staff', do: (G) => { G.dread(8); G.nerves(5); G.note('Læst. Húnninn er volgur, eins og einhver hafi haldið um hann rétt í þessu. Þú leggur eyrað að hurðinni. Það er ekkert fyrir innan. Ekki þögn – ekkert. Þegar þú stígur aftur á bak stendur STAFF á skiltinu, og undir því, smærra, nokkuð sem þú hafðir ekki tekið eftir: ONLY.'); }, next: 'hall' },
      { label: 'Horfa á farangursfæribandið.', dd: 3, time: 8, once: 'carousel', do: (G) => { G.dread(4); G.note('Það er í gangi. Ein taska fer hringinn. Hún er ekki þín. Á henni er dökkblár merkimiði með gylltu skjaldarmerki. Hún fer annan hring, og svo stöðvast bandið, og taskan er horfin, og bandið er tómt á þann hátt sem bendir til þess að það hafi alltaf verið tómt.'); }, next: 'hall' },
      { label: 'Tala við manninn í flíspeysunni.', whyNot: 'Þú myndir hreyta í hann.', nd: -3, dd: -3, nerveMax: 90, time: 8, once: 'talk_fleece', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_hearsay'); G.note(V('„Einhver sagði rútur. Einhver í vesti. Ekki frá þeim.“') + ' Hann lítur á tölvupóstinn í símanum þínum. ' + V('„Já, ég fékk hann líka. Ég er ekki að fara til Heathrow, vinur.“')); }, next: 'hall' },
      { label: 'Tala við konuna með smábarnið.', whyNot: 'Þú myndir hræða barnið.', nd: -2, dd: -3, nerveMax: 80, time: 8, once: 'talk_mother', do: (G) => { G.collect(1); G.nerves(-2); G.flag('hint_hearsay'); G.msg('sms', { from: '+354 ··· ····', body: 'ekki fara í þá fínu' }); G.note('Smábarnið sefur á öxlinni á henni á þann hátt sem gefur til kynna að öxlin sé burðarveggur. ' + V('„Maður í endurskinsvesti sagði við mig: ekki þá fínu. Ég veit ekki hvað það þýðir. Ég ætla bara að fara eftir því.“') + ' Um leið og hún segir það titrar síminn þinn: smáskilaboð frá númeri sem þú þekkir ekki.'); }, next: 'hall' },
      { label: 'Finna manninn úr 31C.', whyNot: 'Þú myndir segja eitthvað sem ekki er hægt að taka til baka.', nd: -3, dd: -3, nerveMax: 95, time: 8, once: 'talk_31c', if: (G) => G.has('ally31c'), do: (G) => { G.collect(1); G.nerves(-3); G.note('Hann er við dyrnar og horfir út í myrkrið. ' + V('„Jæja, það eru sem sagt rútur,“') + ' segir hann. ' + V('„Frábært. Á vegum hverra?“') + ' Hvorugt ykkar veit það. Þið ákveðið, án þess að orða það, að fara í sömu rútuna.'); }, next: 'hall' },
      { label: 'Tala við eldri hjónin við gluggann.', whyNot: 'Þú myndir hefja rifrildi.', nd: -2, dd: -2, nerveMax: 75, time: 8, once: 'talk_couple', do: (G) => { G.collect(1); G.nerves(-2); G.note('Þau hafa flogið heilmikið um dagana og hafa engar áhyggjur, segja þau, með rödd fólks sem hefur áhyggjur. ' + V('„Þetta endar með útprentun,“') + ' segir hann. ' + V('„Þetta endar alltaf með útprentun.“')); }, next: 'hall' },
      { label: 'Fara á klósettið. Þú hefur haldið í þér síðan yfir Grænlandi.', nd: -3, time: 12, once: 'loo', do: (G) => { G.flag('bathroom'); G.nerves(-2); G.note('Léttir, af vissu tagi. Þegar þú kemur út hefur salurinn raðað sér upp á nýtt: sama fólkið, á öðrum stöðum, og allir snúa að sömu hurðinni.'); }, next: 'hall' },
      { label: 'Fara þangað sem flíspeysan benti.', dd: -2, time: 5, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~02:00 bus stand 1 */
  scenes.buses1 = {
    art: 'stand',
    loc: 'Keflavík · Rútustæði · úti',
    text: (G) => p(
      'Úti eru tvær gráður, og vindurinn hefur komið um langan veg til að taka á móti þér. Þrjár rútur standa í lausagangi undir natríumljósunum. Samferðafólk þitt mjakast í átt að þeim, með því lausbeislaða, óvissa göngulagi sem fólk hefur þegar því hefur ekki verið sagt neitt.',
      G.has('bathroom') ? 'Þú ert of seint á ferð. Flestir eru þegar komnir um borð í eitthvað. Dyrnar eru farnar að lokast.' : 'Enginn athugar miða. Enginn athugar neitt.',
      G.has('hint_hearsay') && W('„Ekki þá fínu.“'),
      W('Skoðaðu áður en þú ferð um borð. Það kostar nokkrar mínútur að skoða. Það kostar meira að fara um borð.'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: G.pick(['#c7c3b6', '#b8b4a6', '#8d8a80']), windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'night' },
        name: G.pick(['Hvít rúta án nokkurra merkinga', 'Beinhvít rúta með sprungnum hliðarspegli', 'Grá rúta með bílaleigulímmiða sem er að flagna af hurðinni']),
        sign: G.pick(['ALBION ATL → HOTEL', 'AB0271  HOTEL', 'FLIGHT PPL – HOTEL']), signStyle: 'paper',
        look: ['Bílstjóri í endurskinsvesti, að borða samloku. Hann yppir öxlum þegar þú horfir á hann.', G.has('bathroom') ? 'Vélin í gangi. Dyrnar að lokast.' : 'Vélin í gangi. Dyrnar opnar.'],
        hidden: ['Maðurinn í flíspeysunni er í þriðju röð. Smábarn sefur á einhverjum.', 'Allir um borð eru í sömu fötunum og í flugvélinni, og bera þess merki.'],
        boardLabel: G.has('bathroom') ? 'Taka til fótanna' : 'Fara um borð',
        board: { time: 5, do: (G) => { if (G.has('bathroom')) G.nerves(6); G.flag('bus1_ok'); }, next: 'ride' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'night' },
        name: 'Dökkblá rúta með gylltu skjaldarmerki á hliðinni',
        sign: 'ALBION ATLANTIC WELCOMES YOU', signStyle: 'led',
        look: ['Bílstjóri í einkennisbúningi yfirflugþjóns. Hann brosir til þín, sérstaklega.', 'Björt og hlý lýsing inni. Nóg af sætum.'],
        hidden: ['Farþegarnir eru úthvíldir. Straujaðar skyrtur. Einhver er nýklipptur.', 'Þú kannast ekki við eitt einasta andlit. Þú flaugst með þessu fólki í níu tíma.', 'Nafnspjaldið hans er autt.'],
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const flybus = {
        key: 'city',
        art: { livery: '#cfae36', windows: 'dim', passengers: 'luggage', sign: 'print', driver: 'plain', ground: 'night' },
        name: 'Gulur strætisvagn með merkjum borgarinnar',
        sign: 'FLYBUS · REYKJAVÍK BSÍ', signStyle: 'print',
        look: ['Bílstjóri, með leiðindasvip, að fletta í spjaldtölvu.', 'Farþegar með bakpoka og töskur á hjólum.'],
        hidden: ['Þau eru með farangur. Þú ert ekki með farangur.', 'Límmiði við dyrnar: FRAMVÍSA ÞARF MIÐA.'],
        board: { time: 5, next: 'detour' },
      };
      return G.shuffle([correct, crest, flybus]);
    },
    choices: [
      { label: 'Ekki fara um borð í neitt. Í tölvupóstinum stóð rútur. Bíða eftir fyrirmælum.', kind: 'comply', dd: 10, sub: 'Þeir sögðu rútur. Þetta eru kannski ekki rúturnar.', time: 35, next: 'wait2' },
    ],
  };

  scenes.detour = {
    art: 'road',
    loc: 'Reykjanesbraut · í átt að Reykjavík',
    text: p(
      'Þegar fjörutíu mínútur eru liðnar af ferðinni spyr bakpokaferðalangur á hvaða farfuglaheimili þú gistir, og þá rennur það upp fyrir þér.',
      'Strætóinn skilar þér á umferðarmiðstöð í bænum sem lyktar af dísilolíu og kanil. Leigubílstjóri vorkennir þér, og tekur 9.800 krónur, og ekur þér aftur út í myrkrið á hótel sem hefur verið sagt að eiga von á þér og er ekki visst um að það trúi því.',
      'Klukkan er 03:35. Þú átt fötin sem þú stendur í. Ekki einu sinni þau góðu.',
    ),
    enter: (G) => { G.S.t = T(1, 3, 35); G.nerves(18); G.flag('detoured'); G.dread(8); },
    choices: [{ label: 'Fara inn.', next: 'hotel_arrive' }],
  };

  /* ---------------------------------------------------------------- the ride */
  scenes.ride = {
    art: 'road',
    loc: 'Vegur · einhvers staðar á Reykjanesskaga',
    enter: (G) => {
      G.dread(4);
      if (G.once('coach_mail')) G.at(G.t + 30, 'email', { from: 'Albion Atlantic Customer Care', subj: 'Áframhaldandi flutningur raðaður', body: 'Kæri Viðskiptavinur,\n\nVið höfum skipulagt rútur til að flytja þig til gistingar þinnar. Vinsamlegast halda áfram til rúturnar.\n\nEf þú krefst aðstoðar að staðsetja rúturnar, vinsamlegast hafa samband við okkur.\n\nVið erum að gera okkar best.' });
      if (G.once('coach_txt')) G.at(G.t + 45, 'sms', { from: 'AlbionATL', body: 'AB0271: Hótel þitt er HEATHROW RENAISSANCE LODGE. Ekki svara.' });
    },
    text: (G) => p(
      'Rútan ekur út fyrir síðustu ljósin, og svo heldur hún bara áfram.',
      'Hraunbreiður undir lágum himni. Engir bæir. Engin skilti sem þú getur lesið. Þú veist ekki hver hefur tekið þig eða hvert er verið að fara með þig. Annaðhvort hefur regluverk Evrópusambandsins tekið þig blíðlega í faðm sér, eða þér hefur verið rænt, ásamt rútufylli af örmagna fólki sem er of kurteist til að spyrja.',
      G.has('coffee') && W('Hjartað í þér er að gera eitthvað. Það er kaffið. Það er örugglega kaffið.'),
      'Þetta er löng ferð. Hún er farin að verða óþægilega löng.',
      'Aftast í rútunni andvarpar tveggja ára barn: ' + V('„Þvílíkur dagur.“'),
    ),
    choices: [
      { label: 'Hlæja. Allir hlæja. Kurteislega, og með vott af skelfingu.', whyNot: 'Það kæmi vitlaust út.', nd: -6, dd: -4, nerveMax: 85, time: 50, do: (G) => { G.nerves(-5); G.collect(1); }, next: 'hotel_arrive' },
      { label: 'Þegja. Horfa út í myrkrið.', kind: 'comply', dd: 4, time: 50, do: (G) => G.nerves(3), next: 'hotel_arrive' },
      { label: 'Fara fram í. Spyrja bílstjórann hvert þessi rúta sé eiginlega að fara.', kind: 'conflict', nd: 5, dd: 3, time: 50, do: (G) => { G.nerves(6); G.flag('asked_driver'); }, next: 'hotel_arrive' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~03:00 the hotel */
  scenes.hotel_arrive = {
    art: 'lobby',
    loc: 'Hótel Hraun · Móttaka',
    enter: (G) => {
      G.flag('at_hotel'); atLeast(G, 38);
      if (G.once('hotel_paper')) G.msg('paper', { from: 'Límt á móttökuborðið', subj: 'Prentað skilti', body: '<b>PASSENGERS ALBION ATLANTIC AB0271</b>\n\nBUS TO AIRPORT: <b>11:00</b>\n\nPlease wait in lobby.\n\n(No delivery service until 11:00 am)' });
      if (G.once('hotel_bot')) { G.at(T(1, 3, 50), 'chat', { body: 'Ert þú þægilegur í herbergi þínu? 🙂' }); G.at(T(1, 4, 15), 'chat', { body: 'Rúta þín fer kl. 04:30. Meðlimur starfsfólks mun banka.' }); }
    },
    text: (G) => p(
      G.has('asked_driver') && W('Bílstjórinn svaraði aldrei. Í útvarpinu hljómaði eitthvað á íslensku sem kann að hafa verið veðurfréttir.'),
      'Hótel, þá. Lágreist, víðáttumikið, svona staður sem var byggður fyrir ráðstefnur sem aldrei urðu. Næturvörðurinn deilir út lyklakortum úr skókassa. Á þínu stendur 214.',
      'Nei, þau eiga ekki tannkrem. Nei, þau eiga ekki tannbursta. Ekkert fæst sent hingað fyrr en klukkan ellefu í fyrramálið. Það er sjálfsali. Næturvörðurinn segir þetta með svip konu sem réttir þér björgunarbát.',
      'Límt á borðið er A4-blað, í Arial, örlítið vatnsskemmt. Þar stendur að rútan á flugvöllinn fari klukkan 11:00. Þetta eru fyrstu upplýsingarnar í alla nótt sem fylgir tímasetning og ekkert merki.',
    ),
    choices: [{ label: 'Fara upp í herbergið.', time: 8, next: 'room' }],
  };

  /* ---- the room (hub) ---- */
  const roomStatus = (G) => `Herbergi 214. ${G.clock(G.t)}. Þú ert of úrvinda til að sofa${G.has('toothpaste') ? '' : ', og þú ert með óhreinar tennur'}${G.has('dinner') ? '' : ', og þú hefur ekkert borðað'}.`;

  scenes.room = {
    art: 'room',
    loc: 'Hótel Hraun · Room 214',
    enter: (G) => {
      G.flag('loc_room');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('room_intro')) G.note(p(G.last(), 'Rúm, hraðsuðuketill, sjónvarp, gluggi sem snýr út að bílastæðinu, og pínulitlar flöskur af sjampói og hárnæringu sem þér er þegar farið að detta í hug að bursta tennurnar með. Á hurðinni er öryggiskeðja. Þú setur keðjuna á. Svo tekurðu hana af, til vonar og vara, og setur hana aftur á.'));
    },
    text: (G) => hub(G, roomStatus(G), 'room'),
    choices: (G) => [
      { label: 'Borða. Snakk og tvær smáflöskur af víni.', whyNot: 'Maginn segir nei.', nerveMax: 90, sub: 'Stelpukvöldmatur.', if: (G) => G.has('crisps') && !G.has('dinner'), time: 12, do: (G) => { G.flag('dinner'); G.nerves(-10); G.note('Salt, svo vín, svo salt. Þú borðar sitjandi á rúmstokknum með pokann í báðum höndum eins og hann gæti sloppið frá þér. Þetta er besta máltíðin sem þú hefur fengið í tuttugu tíma, sem er líka sú eina.'); }, next: 'room' },
      { label: 'Stara á litlu sjampóflöskurnar og velta fyrir sér að bursta tennurnar með þeim.', time: 4, do: (G) => { const n = G.count('shampoo'); G.nerves(n === 1 ? -1 : 1); G.note(n === 1 ? 'Sjampó. Hárnæring. Húðmjólk. Þú lest innihaldslýsinguna. Natríumlárýleter-súlfat er, tæknilega séð, yfirborðsvirkt efni. Þú leggur flöskuna frá þér. Þú tekur hana upp. Þú leggur hana frá þér.' : n === 2 ? 'Þú hefur komið hingað áður. Sjampóið hefur ekki skipt um skoðun og ekki þú heldur.' : 'Litlu flöskurnar standa í röð á hillunni og fylgjast með þér. Ein þeirra hefur færst úr stað. Þú færðir hana. Sennilega færðir þú hana.'); }, next: 'room' },
      { label: 'Fara í sturtu. Klæða sig aftur í sömu fötin.', whyNot: 'Þú gætir ekki staðið kyrr undir henni.', nerveMax: 95, time: 20, once: 'shower', do: (G) => { G.nerves(-6); G.note('Heitt vatn, að minnsta kosti. Á Íslandi er frábært heitt vatn; það lyktar dauft af eggjum og klárast aldrei. Þú stendur undir bununni þar til þér líður eins og manneskju, og svo ferðu aftur í flugvélina: buxurnar, skyrtuna, sokkana, allt saman örlítið hlýrra en þú.'); }, next: 'room' },
      { label: 'Kveikja á sjónvarpinu.', kind: 'comply', dd: 2, time: 6, do: (G) => { const d = G.D, n = G.count('tv'); G.dread(1); G.note(d >= 5 ? 'Rás 1: bílastæðið. Bílastæðið þitt, ofan frá, í gráum tónum. Rútan á því. Mannvera við hlið rútunnar. Þú slekkur. Skjárinn sýnir þér herbergið, ofan frá, í gráum tónum.' : d >= 4 ? 'Veðrið, á íslensku, endalaust. Svo rás sem er ekkert nema föst myndavél sem beinist að bílastæði. Þú ert nokkuð viss um að það sé ekki þetta bílastæði. Það er rúta á því.' : n === 1 ? 'Veðrið, á íslensku. Kort af landinu þakið litlum reiðum örvum. Svo kyrrmynd af hótelinu með símanúmeri. Svo veðrið.' : 'Þú hefur séð þetta veður áður. Það hefur ekki breyst. Örvarnar eru enn reiðar. Hótelið er enn á skjánum með símanúmerið sitt, eins og þig gæti langað til að hringja í það innan úr því.'); }, next: 'room' },
      { label: 'Horfa út um gluggann, á bílastæðið.', whyNot: 'Þú veist hvað er þarna úti.', dd: 2, dreadMax: 85, time: 3, do: (G) => { const d = G.D, n = G.count('win'); G.dread(2); if (d >= 4) G.flag('looked1'); G.nerves(d >= 4 ? 7 : 2); G.note(d >= 5 ? 'Rútan er nú beint fyrir neðan þig. Kveikt á ljósunum inni í henni. Allir inni snúa að hótelinu, teinréttir, hreyfingarlausir. Og við dyrnar, með spenntar greipar, maður í dökkbláu, sem horfir upp. Ekki á hótelið. Á gluggann þinn. Þú sleppir gluggatjaldinu. Þú manst ekki eftir að hafa dregið það frá.' : d >= 4 ? 'Rúta stendur yst á bílastæðinu með vélina í gangi og kveikt á hverju einasta ljósi inni í henni. Hún er full. Enginn inni hreyfir sig. Þú sérð engan við dyrnar, og svo sérðu einhvern.' : n === 1 ? 'Bílastæði. Einn ljósastaur. Möl, vindur, og handan við staurinn myrkur sem nær óralangt. Engin rúta. Þér léttir, og svo veltirðu fyrir þér hvers vegna þú áttir von á einni.' : 'Bílastæðið. Ljósastaurinn. Bílljós úti á veginum, sem hægja á sér en beygja ekki inn. Þitt eigið andlit yfir þessu öllu, fölt, í skyrtunni frá því í gær.'); }, next: 'room' },
      { label: 'Laga te úr litlu tepokunum.', whyNot: 'Hendurnar myndu hella því niður.', nerveMax: 90, time: 8, once: 'tea', do: (G) => { G.nerves(-5); G.note('Ketillinn er lengi að sjóða og hljómar eins og lítil flugvél. Te, með G-mjólk úr fingurbjörg. Þú heldur um bollann með báðum höndum. Þetta er það fyrsta hlýja sem ekki hefur reynst lygi.'); }, next: 'room' },
      { label: 'Athuga hurðina.', nd: 2, time: 2, do: (G) => { const n = G.count('door'); G.note(n === 1 ? 'Læst. Keðjan á. Þú athugar keðjuna. Þú athugar lásinn. Allt í lagi.' : n === 2 ? 'Enn læst. Keðjan enn á. Þú vissir það.' : n === 3 ? 'Þú athugar hurðina aftur. Þú gerir þér grein fyrir því að þú ert að athuga hurðina aftur. Hún er læst. Hún hefur alltaf verið læst. Þú stendur með höndina á henni um stund.' : 'Læst. Þú veist ekki lengur að hverju þú ert að gá. Hvort hún sé læst, eða hvort hún sé yfirhöfuð enn hurð.'); if (n >= 3) G.dread(1); }, next: 'room' },
      { label: 'Hlusta við hurðina.', whyNot: 'Þú vilt ekki vita það.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(3); G.note(G.pick(d >= 4 ? ['Fótatak. Hægt, jafnt, nemur staðar við hverja hurð. Nemur staðar við þína. Heldur áfram.', 'Vagn á hjólum, í hinum enda gangsins. Hann stöðvast. Hann fer ekki aftur af stað.', 'Bank, langt frammi á ganginum. Þolinmótt. Svo nær.'] : ['Ekkert. Suðið á ganginum. Hurð, langt í burtu, sem lokast.', 'Einhver gengur hratt fram hjá, á sokkaleistunum. Einhver annar, hægt, á skóm.', 'Ísvélin, malandi, úr hinum enda gangsins. Svo hlátur, í næsta herbergi, sem hættir snögglega.'])); }, next: 'room' },
      { label: 'Hringja í móttökuna úr herbergissímanum.', kind: 'comply', dd: 1, time: 5, once: 'roomphone', do: (G) => { G.dread(2); G.note('Það hringir lengi. Svo næturvörðurinn, og hljómar eins og hún hafi annaðhvort verið sofandi eða aldrei sofið: ' + V(LX('„Já, 214?“')) + ' Þú hafðir ekki nefnt herbergisnúmerið þitt. Þú spyrð um rútuna. ' + V(LX('„Ellefu. Það stendur ellefu. Kannski ættirðu að sofa.“'))); }, next: 'room' },
      { label: 'Fletta upp réttindum þínum.', whyNot: 'Réttindi eru eins og framandi land núna.', dd: -6, dreadMax: 85, sub: 'Það er til reglugerð. Einhver í svörunum hjá þér er viss um það.', time: 15, once: 'rights', do: (G) => { G.flag('uk261'); G.nerves(-6); G.msg('paper', { from: 'Skjáskot, svo QR-kóði sem þú bjóst til upp á eigin spýtur', subj: 'UK261', body: '<b>UK261 / EC261 — RÉTTINDI ÞÍN</b>\n\nVið svona langa seinkun ber flugfélaginu að útvega: máltíðir, hótel, akstur og fjarskipti.\n\nÞeir munu streitast á móti. Gerðu samt kröfu.\n\n[ QR-KÓÐI ]' }); G.note('UK261. <em>Flugfélaginu ber að útvega.</em> Þú lest það tvisvar. Þú býrð til QR-kóða úr því, á þráðlausa netinu á hótelinu, klukkan þrjú að nóttu, og þú veist ekki hvers vegna, nema hvað þú ætlar að sýna hann öllum sem þú sérð í morgunmatnum.'); }, next: 'room' },
      { label: 'Skrifa um þetta á netið.', time: 8, once: 'post', do: (G) => { if (G.D >= 4) { G.nerves(4); G.note('Þú skrifar þetta allt upp – áhöfnina, hurðina, tölvupóstinn, rútuna – og ýtir á „birta“, og litla hjólið snýst, og snýst. Eitt strik. Ekkert strik. Færslan situr þarna, ósend, stíluð á engan.'); } else { G.nerves(-3); G.note('Þú birtir það. Lol, skrifarðu. Lmao. Innan tíu mínútna: 1,4 þúsund læk, og fjörutíu manns að segja þér frá heitu laugunum. Þú leggur símann á grúfu á sængina.'); } }, next: 'room' },
      { label: 'Hlaða símann.', nd: 2, time: 2, once: 'charge', do: (G) => { G.nerves(3); G.note(`Hleðslutækið er í töskunni. Taskan er í kerfinu. Síminn er í ${G.battery()}%, og hann veit það, og dimmir skjáinn til að segja þér það.`); }, next: 'room' },
      { label: 'Reyna að sofa.', whyNot: 'Þú getur ekki legið kyrr.', nerveMax: 80, time: 25, do: (G) => { if (G.t + 25 >= T(1, 4, 5)) { G.S.t = Math.max(G.t, KNOCK_AT - 25); G.note('Þú leggst út af í fötunum úr fluginu, með ljósið kveikt. Loftið er mjög nálægt. Þú ert næstum því, næstum því—'); } else { G.nerves(-3); G.note(G.pick(['Þú leggst út af. Líkaminn er á Kyrrahafstíma, eða á engum tíma. Í loftinu er blettur í laginu eins og eyja. Þú horfir á hann um stund. Ekkert.', 'Augun lokuð. Vélin í rútunni – í einhverri rútu – einhvers staðar fyrir neðan gluggann, eða í eyrunum á þér. Þú sest aftur upp.', 'Þú skríður undir sængina í fötunum. Það er eins og að vera pakki. Svefninn horfir á þig úr hinum enda herbergisins og kemur ekki nær.'])); } }, next: 'room' },
      { label: 'Fara fram á gang.', time: 2, next: 'corridor' },
    ],
  };

  /* ---- the corridor (hub) ---- */
  scenes.corridor = {
    art: 'corridor',
    loc: 'Hótel Hraun · Gangur á annarri hæð',
    enter: (G) => {
      G.flag('loc_corridor');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('corridor_knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('corr_intro')) G.note(p(G.last(), 'Langur, lágur, teppalagður með einhverju í lit eins og marblettur. Hurðir: 210, 212, 214 – þín – 216, 218, og svo koll af kolli að brunahurð með slá þvert yfir og vírglersrúðu. Ísvél suðar við fjærendann. Lyfta, með pappírsmiða á.'));
    },
    text: (G) => hub(G, `Gangurinn. ${G.clock(G.t)}. Hver einasta hurð er lokuð. Þín er sú með ljósið kveikt.`, 'corridor'),
    choices: (G) => [
      { label: 'Ísvélin.', nd: 2, dd: 1, time: 5, do: (G) => { const n = G.count('ice'); G.note(n === 1 ? 'Hún drynur. Ís, heil ósköp af ís, ofan í fötu sem þú komst ekki með. Þú stendur með hnefafylli af honum. Þú vildir ekki ís. Þú veist ekki hvað þú vildir.' : n === 2 ? 'Hún drynur aftur, fyrir þig, eins og hún hafi beðið. Ísinn frá áðan hefur ekki bráðnað. Þú ert ekki viss um að ís eigi að haga sér svona á upphituðum gangi.' : 'Þú stingur ekki hendinni inn í þetta skiptið. Þú hlustar á hana mala. Undir malinu, einhvers staðar neðan frá, vélarhljóð.'); if (n >= 2) G.dread(1); }, next: 'corridor' },
      { label: 'Banka á 216. Herbergi flíspeysumannsins.', time: 5, do: (G) => { const n = G.count('k216'); if (n === 1) { G.collect(1); G.nerves(-4); G.note('Þögn, svo keðjan, svo flíspeysan. Hann er líka vakandi. Hann er líka í fötunum. ' + V('„Jæja,“') + ' segir hann, og það segir allt sem segja þarf. Þið eruð sammála um rútuna. Ellefu. Útprentunin. Hann segist ætla að banka upp á hjá þér.'); } else if (n === 2) { G.nerves(3); G.dread(3); G.note('Ekkert svar. Það logar ljós undir hurðinni. Þú bankar aftur, jafnt og þétt, og heyrir í sjálfum þér gera það, og hættir.'); } else { G.nerves(8); G.dread(5); G.note('Hurðin er ólæst. Hún opnast upp á gátt. Herbergið er uppbúið: rúmið stífstrekkt, handklæðin brotin saman í viftu, litlu sjampóflöskurnar í röð. Enginn hefur verið þarna inni. Enginn hefur nokkurn tímann verið þarna inni. Flíspeysan hans er á stólnum.'); } }, next: 'corridor' },
      { label: 'Lyftan.', kind: 'comply', dd: 2, time: 4, do: (G) => { const d = G.D; if (d >= 4) { G.flag('lift_open'); G.dread(3); G.nerves(5); G.note('Á miðanum stendur BILUÐ, með Arial-letri. Um leið og þú lest það kemur lyftan. Dyrnar opnast; við blasir tómur, vel upplýstur klefi með spegli innst, og þær standa opnar, og bíða. Enginn kallaði á hana.'); } else { G.note('BILUÐ, með Arial-letri, límt á ská. Þú ýtir samt á takkann. Einhvers staðar í húsinu fer eitthvað niður.'); } }, next: 'corridor' },
      { label: 'Fara inn í lyftuna.', kind: 'comply', if: (G) => G.has('lift_open'), do: (G) => G.end('lift') },
      { label: 'Lesa rýmingaráætlunina á veggnum.', dd: -2, time: 3, once: 'fireplan', do: (G) => { G.msg('paper', { from: 'Skrúfuð á vegginn á ganginum', subj: 'Rýmingaráætlun', body: '<b>EVACUATION PLAN · 2ND FLOOR</b>\n\nIn case of alarm, proceed by stairs to\n<b>ASSEMBLY POINT: CAR PARK</b>\n\nDo not use the lift.\nDo not return for belongings.\n\nYOU ARE HERE ●' }); G.note('ÞÚ ERT HÉR. Rauður punktur, við 214. Einhver hefur teiknað litla ör frá honum í átt að bílastæðinu með kúlupenna, og skrifað, með annarri rithönd, <em>rúta</em>.'); }, next: 'corridor' },
      { label: 'Brunahurðin og stiginn. Niður á bílastæðið.', whyNot: 'Ekki stigann. Ekki í myrkrinu.', dreadMax: 92, time: 4, next: 'carpark' },
      { label: 'Niður í anddyrið.', time: 3, next: 'lobby' },
      { label: 'Aftur inn í herbergið.', time: 2, next: 'room' },
    ],
  };

  /* ---- the lobby at night (hub) ---- */
  scenes.lobby = {
    art: 'lobby',
    loc: 'Hótel Hraun · Anddyri',
    enter: (G) => {
      G.flag('loc_lobby');
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('lobby_intro')) G.note(p(G.last(), 'Anddyrið að nóttu til er fiskabúr sem gleymst hefur að slökkva ljósið í. Tveir úr fluginu þínu sofa sitjandi uppréttir í sófa. Næturvörðurinn er við afgreiðsluborðið með krossgátu. Á prentaða skiltinu, í Arial, stendur 11:00. Sjálfsali suðar við vegginn eins og lítill kældur guð.'));
    },
    text: (G) => hub(G, `Anddyrið. ${G.clock(G.t)}. Á skiltinu stendur enn 11:00. ${G.t >= KNOCK_AT ? 'Klukkan er komin yfir hálf fimm.' : 'Það er langt í ellefu.'}`, 'lobby'),
    choices: (G) => [
      { label: 'Spyrja vörðinn hvort hún tali frönsku.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 4, do: (G) => { G.flag('fr_asked'); G.nerves(-2); G.note(LX('„Svolítið. Ellefu. Skiltið. Gjörðu svo vel.“') + ' Hún sagði það hægt, og benti samt á skiltið, ef orðin skyldu ekki halda.'); }, next: 'lobby' },
      { label: 'Biðja móttökuna um tannkrem.', time: 6, once: 'desk_tp', do: (G) => { G.nerves(2); G.note('Hún leitar undir borðinu, af fullri einlægni, lengi. ' + V(LX('„Nei. Því miður. Það er til í 10-11. Tuttugu mínútur, gangandi.“')) + ' Hún horfir á þig, og á dyrnar, og á þig. ' + V(LX('„Kannski ekki í nótt.“'))); }, next: 'lobby' },
      { label: 'Spyrja hvort skiltið sé rétt.', kind: 'comply', dd: 1, time: 5, do: (G) => { const n = G.count('sign'); G.note(n === 1 ? 'Hún bendir á skiltið. ' + V(LX('„Ellefu.“')) + ' Þú spyrð hver hafi sagt henni það. ' + V(LX('„Farþegi hringdi í þá. Þeir sögðu já.“')) + ' Þögn. ' + V(LX('„Eða þeir sögðu eitthvað.“')) : n === 2 ? V(LX('„Ellefu,“')) + ' segir hún, án þess að líta upp, áður en þú hefur lokið við spurninguna.' : 'Hún horfir á þig andartak með svip sem þú getur ekki ráðið í, og segir svo: ' + V(LX('„Þú ert í 214,“')) + ' og snýr sér aftur að krossgátunni. Þú hafðir ekki spurt.'); if (n >= 3) G.dread(3); }, next: 'lobby' },
      { label: 'Spyrja hvort rúta hafi komið.', kind: 'comply', dd: 3, time: 5, do: (G) => { const d = G.D; G.dread(1); G.note(d >= 4 ? V(LX('„Það er ein fyrir utan,“')) + ' segir hún. ' + V(LX('„Hún er ekki þín.“')) + ' Þú spyrð hvernig hún viti það. Hún snýr krossgátunni að þér svo þú sjáir hana. Hún er auð.' : G.t >= KNOCK_AT ? V(LX('„Einhver kom og spurði eftir þér. Í einkennisbúningi. Ég sagði að þú værir sofandi.“')) + ' Þú varst ekki sofandi. ' + V(LX('„Ég veit.“')) : V(LX('„Engin rúta. Ellefu. Farðu nú upp og sofðu, gerðu það.“'))); }, next: 'lobby' },
      { label: 'Sjálfsalinn.', nd: -2, time: 5, do: (G) => { const n = G.count('vend'); if (n === 1) { G.flag('crisps'); G.nerves(-3); G.note('Kartöfluflögur, paprikubragð. Tvær pínulitlar flöskur af rauðvíni með mynd af fjalli á miðanum. Vélin tekur kortið þitt í þriðju tilraun og gefur frá sér hljóð sem lýsir djúpri tregðu. Þú heldur á kvöldmatnum með báðum höndum.'); } else { G.note(n === 2 ? 'Að mestu uppselt. Eitt eftir, neðst: skyrdós með dagsetningu sem þú hefðir helst viljað sleppa við að lesa.' : 'Ljósið í vélinni flöktir. Allar raðirnar eru tómar núna nema skyrið, sem hefur færst upp um eina hillu.'); if (n >= 3) G.dread(1); } }, next: 'lobby' },
      { label: 'Kaffivélin.', time: 5, once: 'coffee_l', do: (G) => { G.nerves(G.has('coffee') ? 2 : -2); G.note('Kaffi. Hvað er eiginlega málið með þetta kaffi. Það bragðast eins og því hafi verið lýst fyrir vélinni í gegnum síma. Þú drekkur það standandi og horfir á dyrnar.'); }, next: 'lobby' },
      { label: 'Vekja farþegana í sófanum. Bera saman bækur sínar.', whyNot: 'Þú myndir vekja þau með öskri.', nd: -4, dd: -4, nerveMax: 85, time: 8, once: 'sofa', do: (G) => { G.collect(1); G.nerves(-2); G.note('Þetta er parið frá glugganum í salnum. Þau eru ekki sofandi. ' + V('„Við fengum tölvupóst þar sem stóð níu,“') + ' segir hún. ' + V('„Og annan þar sem stóð átta. Og spjalldótið segir eitthvað enn annað.“') + ' Þið horfið öll á skiltið. ' + V(LX('„Ellefu,“')) + ' segir hann. ' + V('„Útprentun.“')); }, next: 'lobby' },
      { label: 'Horfa á bílastæðið gegnum glerið.', whyNot: 'Þú vilt ekki sjá það.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(d >= 4 ? 5 : 0); G.note(d >= 5 ? 'Rútan er núna beint fyrir utan dyrnar. Vélin í gangi. Kveikt á ljósunum inni. Dyrnar renna upp fyrir henni, og standa opnar, og kuldinn streymir inn. Enginn stígur út.' : d >= 4 ? 'Við fjærenda bílastæðisins, framljós, vél í hægagangi. Fyrir aftan þau skuggamynd sem hefur lögun rútu. Næturvörðurinn lítur ekki upp. Hún hefur ekki litið upp í dágóða stund.' : 'Möl, einn ljósastaur, vegurinn. Bíll ekur fram hjá og hægir ekki á sér. Þú ert að bíða eftir einhverju. Þú vildir gjarnan geta hætt því.'); if (d >= 4) G.flag('looked1'); }, next: 'lobby' },
      { label: 'Fara út.', whyNot: 'Dyrnar eru í ranga átt.', dd: -2, dreadMax: 88, time: 3, next: 'carpark' },
      { label: 'Aftur upp á ganginn.', time: 3, next: 'corridor' },
    ],
  };

  /* ---- the car park at night (hub) ---- */
  scenes.carpark = {
    art: 'carpark_night',
    loc: 'Hótel Hraun · Bílastæði',
    enter: (G) => {
      G.flag('loc_carpark'); G.dread(2);
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('cp_intro')) G.note(p(G.last(), 'Kalt. Almennilega kalt: kuldinn sem smýgur inn í fötin og situr þar. Möl, ljósastaur, vegur sem liggur í tvær áttir. Hótelið fyrir aftan þig, upplýst. Þú komst út af ástæðu sem þú mundir fyrir andartaki.'));
    },
    text: (G) => hub(G, `Bílastæðið. ${G.clock(G.t)}. Vindurinn hefur komið um langan veg til móts við þig.`, 'carpark'),
    choices: (G) => [
      { label: 'Ganga út að fjærendanum. Í átt að skuggamyndinni.', whyNot: 'Fæturnir neita.', nd: 5, dreadMax: 92, time: 6, do: (G) => { const d = G.D; G.dread(G.counted('cpwalk') ? 1 : 3); G.count('cpwalk'); if (d >= 4) { G.flag('coach_seen_cp'); G.nerves(G.counted('cpwalk') > 1 ? 3 : 6); G.note('Rúta. Dökkblá. Gyllt skjaldarmerki. Vélin í gangi, kveikt á hverju einasta ljósi inni, og bak við hvern glugga manneskja, upprétt, sem snýr að hótelinu. Við dyrnar maður í dökkbláu, með spenntar greipar. Hann lítur ekki á þig. ' + V('„Ekki enn,“') + ' segir hann, við engan, eða við þig.'); } else { G.nerves(3); G.note('Ekkert. Blettur á mölinni, dekkri en mölin í kring, í laginu eins og eitthvað sem var nýlega lagt þar. Vindurinn. Þú stendur í blettinum andartak.'); } }, next: 'carpark' },
      { label: 'Fara um borð í rútuna.', kind: 'comply', if: (G) => G.has('coach_seen_cp'), do: (G) => G.end('nightcoach') },
      { label: 'Líta upp að glugganum þínum.', time: 3, do: (G) => { G.dread(2); G.nerves(2); G.note(G.D >= 4 ? 'Önnur hæð, fjórði gluggi frá enda. Ljósið er kveikt. Þú skildir það eftir kveikt. Gluggatjöldin eru dregin frá. Þú skildir þau ekki eftir frá.' : 'Önnur hæð, fjórði gluggi frá enda. Ljósið er kveikt. Það lítur út eins og herbergi sem einhver er í.'); }, next: 'carpark' },
      { label: 'Ganga tuttugu mínútur í 10-11 að kaupa tannkrem.', whyNot: 'Ekki ein(n). Ekki þarna úti.', dreadMax: 70, sub: 'Tannkrem. Kannski sokkar. Tilbreyting.', time: 20, once: 'walk', next: 'walk' },
      { label: 'Fara aftur inn.', kind: 'comply', dd: 1, time: 3, next: 'lobby' },
    ],
  };

  scenes.walk = {
    art: 'road',
    loc: 'Vegurinn · í átt að 10-11',
    text: p(
      'Vindur. Hraun. Vegur án gangstéttar og hvít lína sem hverfur í sífellu. Eftir átta mínútur sérðu ekki lengur hótelið fyrir aftan þig; eftir tíu sérðu ekki 10-11 fram undan.',
      'Svo framljós, á hægri ferð, aftan frá. Rúta. Hún rennir upp að hliðinni á þér og stoppar, og dyrnar leggjast saman og opnast með mjúku, dýru hljóði. Hlý birta. Sætaraðir, og fólk í þeim, grafkyrrt.',
      V('„Albion farþegi?“') + ' segir rödd sem þú þekkir úr hátalarakerfinu í 37.000 feta hæð. ' + V('„Við erum að gera okkar best. Hoppa á.“'),
    ),
    choices: [
      { label: 'Stíga um borð. Það er hlýtt.', kind: 'comply', do: (G) => G.end('convenience') },
      { label: 'Halda áfram að ganga. Ekki líta á dyrnar.', whyNot: 'Þú getur ekki snúið baki í hana.', dreadMax: 75, dd: -14, time: 30, do: (G) => { G.nerves(12); G.flag('toothpaste'); G.nerves(-10); G.dread(8); G.note('Rútan malaði lengi við hliðina á þér, og svo ekki. 10-11 var uppljómuð eins og helgidómur. Tannkrem. Tannbursti. Sokkar, þrír í pakka, fallegustu sokkar sem þú hefur á ævinni séð. Þú gekkst til baka með pokann þrýstan að brjóstinu. Ekkert fór fram hjá þér á veginum. Alls ekkert, og það var einhvern veginn verra.'); }, next: 'carpark' },
      { label: 'Snúa við. Ganga til baka á hótelið. Hratt.', kind: 'comply', dd: 6, time: 15, do: (G) => { G.nerves(8); G.dread(5); G.note('Þú hljópst ekki. Þú gekkst, hratt, með rútuna á eftir þér, malandi, á sama hraða og þú, og svo ekki. Dyrnar að anddyrinu runnu upp áður en þú náðir að þeim.'); }, next: 'carpark' },
    ],
  };

  /* ---- the knock, three ways ---- */
  scenes.knock = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); },
    text: (G) => p(
      G.last(),
      'Einhver bankar. Ekki lemur – bankar, jafnt og þétt, eins og sá bankar sem ætlar að banka alla nóttina.',
      V('„Rúta fyrir Albion Atlantic farþegar. Fer núna. Síðasta kall.“'),
      'Röddin er þolinmóð. Röddin er mjög, mjög þolinmóð.',
    ),
    choices: [
      { label: 'Opna dyrnar.', kind: 'comply', sub: 'Þetta gæti verið rútan.', do: (G) => G.end('nightcoach') },
      { label: 'Kíkja út um gægjugatið.', dd: 6, nd: 6, time: 2, do: (G) => { G.nerves(9); G.flag('spyhole'); G.note('Gangurinn er auður. Teppið fyrir utan dyrnar hjá þér er blautt. Bankið heldur áfram, jafnt og þétt, úr engri sérstakri átt.'); }, next: 'knock2' },
      { label: 'Á skiltinu stóð 11:00. Ekki opna. Ekki svara.', whyNot: 'Þú getur ekki ekki svarað.', nd: 5, dreadMax: 80, time: 20, do: (G) => { G.nerves(5); G.note('Þú sast á rúminu með bakið upp við höfðagaflinn og augun á hurðinni og taldir höggin. Þú misstir töluna við sextíu. Svo hættu þau, og það var verra, um stund.'); }, next: 'window' },
    ],
  };

  scenes.knock2 = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: (G) => p(G.last(), 'Jafnt og þétt. Þolinmótt. Enginn þarna.'),
    choices: [
      { label: 'Opna dyrnar samt.', kind: 'comply', do: (G) => G.end('nightcoach') },
      { label: 'Hörfa frá hurðinni. Setjast á rúmið. Bíða þetta af sér.', whyNot: 'Höndin er þegar á keðjunni.', dreadMax: 88, time: 25, do: (G) => { G.nerves(3); G.note('Það hætti, að lokum, eins og rigning hættir: þú tókst ekki eftir því síðasta.'); }, next: 'window' },
    ],
  };

  scenes.corridor_knock = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Second floor corridor · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); G.nerves(8); },
    text: (G) => p(
      G.last(),
      'Þú ert frammi á gangi þegar það byrjar. Úti við fjærendann, hjá lyftunni, bankar einhver í dökkbláu á hurð. Jafnt og þétt. Þolinmóður. Svo á næstu hurð. Svo þá næstu.',
      'Hann vinnur sig í átt að 214. Hann vinnur sig í átt að þér. Hann hefur ekki litið upp. ' + V('„Rúta fyrir Albion Atlantic farþegar. Fer núna. Síðasta kall.“'),
    ),
    choices: [
      { label: 'Ganga fram hjá honum. Aftur inn í herbergið. Læsa.', whyNot: 'Þú getur ekki gengið í átt að honum.', dreadMax: 80, time: 5, do: (G) => { G.nerves(10); G.dread(8); G.flag('seen'); G.note('Hann hætti ekki að banka þegar þú gekkst fram hjá. Hann sneri sér ekki við. En þegar smell heyrðist í lyklakortinu þínu sagði hann, ljúflega, við hurðina fyrir framan sig: ' + V('„Tveir fjórtán,“') + ' og þú komst keðjunni á með höndum sem þér fannst ekki vera þínar eigin.'); }, next: 'window' },
      { label: 'Fara niður stigann. Hljóðlega. Bíða í anddyrinu.', whyNot: 'Þú getur ekki hreyft þig.', dd: 5, dreadMax: 92, time: 15, do: (G) => { G.nerves(6); G.dread(5); G.note('Næturvörðurinn leit ekki upp þegar þú komst niður. ' + V(LX('„Hann er að leita að þér,“')) + ' sagði hún, við krossgátuna. Þú settist í sófann hjá parinu og enginn sagði neitt í langan tíma, og svo runnu anddyrisdyrnar upp fyrir engum, og lokuðust aftur.'); }, next: 'window' },
      { label: 'Svara honum. Þú ert farþegi hjá Albion Atlantic.', kind: 'comply', do: (G) => G.end('nightcoach') },
    ],
  };

  scenes.window = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.S.t = Math.max(G.t, T(1, 4, 50)); G.bot('Hæ! Ég sé þú ert í herbergi 214. Rútan er að bíða fyrir þig í bílastæðinu. Vinsamlegast ekki horfa út af glugganum. 🙂'); },
    text: (G) => p(
      G.last(),
      'Aftur inni í herberginu, eða enn þar inni. Bankið er hætt. Síminn lýsir upp loftið. Skilaboð frá Ally.',
      W('Rútan er að bíða fyrir þig í bílastæðinu. Vinsamlegast ekki horfa út af glugganum.'),
      'Gluggatjaldið er þunnt. Ljós skín í gegnum það, og ljósið bærist örlítið, eins og ljós frá vél í gangi gerir.',
    ),
    choices: [
      { label: 'Kíkja.', whyNot: 'Hann sagði að gera það ekki.', dd: 10, nd: 8, dreadMax: 90, sub: 'Bara rétt aðeins.', time: 5, do: (G) => { G.flag('seen'); G.nerves(14); atLeast(G, 78); }, next: 'window2' },
      { label: 'Ekki gera það. Leggja símann á grúfu. Draga sængina upp yfir höfuð.', kind: 'comply', dd: 6, time: 5, do: (G) => G.nerves(2), next: 'sleep' },
    ],
  };

  scenes.window2 = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: p(
      'Rúta, dökkblá, með gylltu skjaldarmerki. Vélin í gangi. Kveikt á hverju einasta ljósi inni. Hún er full, og allir í henni sitja þráðbeinir, og hvert einasta þeirra snýr að hótelinu.',
      'Við dyr rútunnar stendur maður í einkennisbúningi yfirflugþjóns. Meðan þú horfir lítur hann upp – ekki á hótelið. Á gluggann þinn.',
      'Hann veifar ekki. Hann þarf þess ekki. Hann hefur, skilurðu, skrifað það hjá sér.',
    ),
    choices: [{ label: 'Sleppa gluggatjaldinu.', time: 5, next: 'sleep' }],
  };

  /* ---------------------------------------------------------------- Day 1 · 07:30 morning */
  scenes.sleep = {
    art: 'lobby',
    loc: 'Hótel Hraun · Morgunverðarsalur',
    enter: (G) => {
      G.S.t = T(1, 7, 30);
      G.flag('morning');
      G.S.dread = Math.max(20, G.S.dread - 25); // daylight helps, a little
      G.nerves(G.has('allnighter') ? 6 : G.has('coffee') ? -5 : -10);
      if (G.has('toothpaste')) G.nerves(-6);
      G.at(T(1, 7, 35), 'sms', { from: 'Jo 💛', body: 'OMG ERTU Á ÍSLANDI?? þú VERÐUR að fara í bláa lónið. VERÐUR. það er svona 20 mín frá flugvellinum' });
      G.at(T(1, 8, 5), 'chat', { body: 'Góðan morgun! Flutningur þinn til flugvöllinn er staðfestur fyrir 08:00. Vinsamlegast vera í lobbýinu. 🚌' });
      G.at(T(1, 9, 40), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Flutningur þinn til flugvöllinn', stamp: T(1, 9, 40), body: 'Kæri Viðskiptavinur,\n\nRútur munu safna þér frá gistingu þinni kl. 09:00 fyrir endurbókað flug þitt AB 0271.\n\nVinsamlegast vera tilbúin í lobbýinu kl. 08:45.\n\nVið erum að gera okkar best.' });
      G.at(T(1, 9, 55), 'chat', { body: 'Rúta þín er hér. Það er sú fína. 🚌' });
    },
    text: (G) => p(
      G.has('allnighter') ? 'Grá birta. 07:30. Þú svafst ekki, og þú ert enn á Íslandi.' : 'Grá birta. 07:30. Þú svafst, eða eitthvað í þá áttina, og þú ert enn á Íslandi.',
      'Morgunmaturinn er skyr, brauð og kaffi sem bragðast eins og það hafi verið lagað af einhverjum sem hefur heyrt kaffi lýst. Salurinn er fullur af fólkinu úr fluginu þínu. Allir eru í sömu fötunum og í gær. Allir bera saman bækur sínar: hvaða hótel, hvaða sækitíma, hverjum af skilaboðunum þremur, sem stangast öll á, þeir hafa kosið að trúa.',
      'Prentaða skiltið er enn límt á borðið. 11:00. Einhver hefur teiknað lítið hjarta á það.',
    ),
    choices: [{ label: 'Fá sér samt annan kaffibolla.', time: 10, next: 'hotel_morning' }],
  };

  scenes.hotel_morning = {
    art: 'lobby',
    loc: 'Hótel Hraun · Anddyri',
    enter: (G) => {
      if (G.t >= T(1, 10, 15)) { G.go('buses2'); return; }
      if (G.once('morn_intro')) G.note(p(G.last(), 'Í rauninni hefur allt verið tímasett þannig að það valdi sem mestum sársauka án þess að þú fáir frelsi til að fara og gera eitthvað notalegt í millitíðinni. Þrír tímar, og ekkert við þá að gera nema bíða eftir rútu sem er kannski rútan og kannski ekki.'));
    },
    text: (G) => hub(G,
      `Anddyrið. ${G.clock(G.t)}. Á skiltinu stendur 11:00. ${G.t >= T(1, 9, 45) ? 'Í tölvupóstinum stóð 09:00 og hann barst 09:40. ' : G.t >= T(1, 8, 5) ? 'Spjallmennið sagði 08:00. Klukkan er komin yfir 08:00. ' : ''}Enginn hefur séð rútu sem er þín.`,
      'morning'),
    choices: (G) => [
      { label: 'Sýna UK261 QR-kóðann öllum farþegum sem þú nærð til.', whyNot: 'Hendurnar myndu ekki halda símanum kyrrum.', dd: -8, nd: -4, nerveMax: 90, sub: 'Með þeim fyrirvara að flugfélagið muni streitast á móti.', if: (G) => G.has('uk261'), once: 'qr1', time: 20, do: (G) => { G.collect(2); G.nerves(-5); G.note('Þú gengur borð úr borði og heldur símanum á lofti eins og handtökuskipun. Fólk tekur myndir af honum. Kona með beyglu segir: ' + V('„Ég er alveg til í að vera Karen.“') + ' Einhver klappar, einu sinni.'); }, next: 'hotel_morning' },
      { label: 'Bera saman bækur sínar við hina.', whyNot: 'Þú myndir hefja rifrildi.', dd: -5, nd: -4, nerveMax: 85, time: 20, once: 'notes1', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_notes'); G.note('Fjögur hótel. Sex sækitímar. Ein útprentun. Maður með Blazers-derhúfu: ' + V('„Þær með skjaldarmerkinu eru ekki okkar. Veit ekki hverra þær eru. Ekki okkar.“') + ' Allir kinka kolli, eins og þeir hefðu vitað það.'); }, next: 'hotel_morning' },
      { label: 'Spyrja móttökuna hvort 11:00 sé rétt.', kind: 'comply', dd: 2, time: 10, once: 'recep', do: (G) => { G.nerves(1); G.note('Sami næturvörðurinn. Enn þá. Hún bendir á skiltið. ' + V(LX('„Annar farþegi hringdi í þá. Þeir sögðu já.“')) + ' Þögn. ' + V(LX('„Eða þeir sögðu eitthvað.“'))); }, next: 'hotel_morning' },
      { label: 'Fara aftur upp í herbergið. Fara í sturtu. Þvo þér að minnsta kosti í framan.', whyNot: 'Þú gætir ekki staðið kyrr undir henni.', nerveMax: 92, time: 25, once: 'morn_shower', do: (G) => { G.nerves(-5); G.note('Heitt vatn. Sömu fötin. Í dagsbirtu er herbergið bara herbergi: sjampóflöskurnar, hraðsuðuketillinn, glugginn sem snýr út að bílastæði með rútu á. Þú horfir ekki lengi.'); }, next: 'hotel_morning' },
      { label: 'Tala við móður smábarnsins.', whyNot: 'Þú myndir hræða barnið.', nd: -3, dd: -3, nerveMax: 80, time: 10, once: 'morn_mother', do: (G) => { G.collect(1); G.nerves(-3); G.note(V('„Hún vildi helst vera komin heim núna,“') + ' segir móðirin um smábarnið, sem er undir borðinu. ' + V('„Ég líka. Heyrðirðu bankað í nótt?“') + ' Þú segir já. Hún segir: ' + V('„Við opnuðum ekki heldur.“')); }, next: 'hotel_morning' },
      { label: 'Athuga stöðu flugsins á vef flugfélagsins.', dd: 3, nd: 3, time: 8, do: (G) => { const n = G.count('status'); G.dread(2); G.note(n === 1 ? 'AB 0271 · KEF → LAX · 15:10 · Á ÁÆTLUN. Á áætlun um hvað, kemur ekki fram.' : n === 2 ? 'AB 0271 · 15:10 · Á ÁÆTLUN. Svo, meðan þú horfir, 15:25. Svo aftur 15:10.' : 'Síðan vill ekki hlaðast. Svo hleðst hún, og flugið er ekki á henni. Svo er það þar. 15:10. Þú stingur símanum í vasann áður en það nær að breytast aftur.'); }, next: 'hotel_morning' },
      { label: 'Fara út og svipast um eftir rútunni sem átti að koma 09:00.', kind: 'comply', dd: 5, if: (G) => G.t >= T(1, 8, 50) && G.t < T(1, 10, 0), time: 10, next: 'decoy_morning' },
      { label: 'Fara í heitu laugarnar. Þig hefur alltaf langað til þess.', sub: 'Þær eru í tuttugu mínútna fjarlægð. Það segja allir.', do: (G) => G.end('tantalus') },
      { label: 'Bíða í anddyrinu.', kind: 'comply', dd: 3, nd: 2, sub: 'Hálftíma af því.', time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Hálftími. Kaffivélin, dyrnar, skiltið. Barn telur upp að hundrað og byrjar upp á nýtt.', 'Hálftími. Vekjaraklukkan hringir í símanum hjá einhverjum – stillt á Los Angeles-tíma – og allir hlæja, og svo hlær enginn.', 'Hálftími. Fyrir utan kemur rúta, og er ekki þín, og fer. Þú stendur ekki upp. Enginn gerir það.'])); }, next: 'hotel_morning' },
    ],
    status: (G) => (G.has('hint_notes') ? 'Samkvæmt sögusögnum: allir fengu sinn tímann hver frá flugfélaginu. Allir fara eftir útprentuninni. Rúturnar með skjaldarmerkinu „eru ekki okkar“.' : ''),
  };

  scenes.decoy_morning = {
    art: 'carpark',
    loc: 'Hótel Hraun · Bílastæði',
    text: p(
      'Þarna er rúta. Dökkblá, gyllt skjaldarmerki, vélin í gangi. Á LED-skiltinu að framan stendur AIRPORT TRANSFER · ALBION ATLANTIC. Yfirflugþjónninn stendur við dyrnar með spenntar greipar, og þegar hann sér þig brosir hann eins og þú sért nákvæmlega á réttum tíma.',
      'Enginn annar úr anddyrinu hefur komið út. Í gegnum gluggana sést að farþegarnir sem þegar eru komnir um borð sitja þráðbeinir í hreinum skyrtum og horfa út í tómið.',
    ),
    choices: [
      { label: 'Fara um borð. Það stóð jú 09:00 í tölvupóstinum.', kind: 'comply', do: (G) => G.end('crew') },
      { label: 'Fara aftur inn. Minnast ekki á þetta við neinn.', whyNot: 'Hann horfir á þig.', dreadMax: 85, time: 5, do: (G) => { G.nerves(6); G.dread(5); G.note('Þú fórst aftur inn. Enginn spurði. Handan glersins stóð rútan kyrr þar sem hún var, með dyrnar opnar, lengi.'); }, next: 'hotel_morning' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 10:15 bus stand 2 */
  scenes.buses2 = {
    art: 'carpark',
    loc: 'Hótel Hraun · Bílastæði',
    enter: (G) => { if (G.t < T(1, 10, 15)) G.S.t = T(1, 10, 15); G.dread(4); },
    text: (G) => p(
      'Einhver segir að það sé rúta fyrir utan. Þú spyrð konuna í móttökunni hvort hún sé þín. Hún veit það ekki. Hún bendir á skiltið í Arial. ' + V(LX('„Kannski ættirðu að flýta þér.“')),
      'Ímyndaðu þér mæli eins og í tölvuleik, nema fyrir taugarnar í þér, sem tifar niður í þunnu, titrandi rauðu ræmuna.',
      'Úti: rútur. Enginn hefur sagt þér hver þeirra. Á engri þeirra stendur flugnúmerið þitt, nema þeirri einu sem það stendur á, með tússpenna.',
      G.has('hint_notes') && W('„Þær með skjaldarmerkinu eru ekki okkar.“'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: '#c7c3b6', windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'day' },
        name: 'Sama hvíta rútan og í gærkvöldi, eða önnur mjög lík henni',
        sign: G.pick(['AIRPORT', 'AB0271 → KEF', 'FLIGHT PPL AIRPORT']), signStyle: 'paper',
        look: ['Bílstjóri í endurskinsvesti. Önnur samloka.', 'Hálffull. Fólk er enn að tínast út úr anddyrinu í átt að henni.'],
        hidden: ['Flíspeysan. Smábarnið. Maðurinn úr 31C. Sömu föt og í gærkvöldi, að sjálfsögðu, því í hverju öðru ættu þau svo sem að vera.', 'Þú átt ekki gott með andlit. Þessi þekkirðu.'],
        board: { time: 5, do: (G) => G.flag('bus2_ok'), next: 'ride2' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'day' },
        name: 'Dökkblá rúta með gylltu skjaldarmerki',
        sign: 'AIRPORT TRANSFER · ALBION ATLANTIC', signStyle: 'led',
        look: ['Yfirflugþjónninn við dyrnar. Hann veifar. Hann veit hvaða gluggi var þinn.', 'Hlýtt. Hljótt. Nóg pláss.'],
        hidden: ['Enginn um borð lítur út fyrir að hafa sofið í fötunum. Enginn lítur út fyrir að hafa sofið.', 'Enginn um borð er með síma uppi.'],
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const lagoon = {
        key: 'lagoon',
        art: { livery: '#3e9c9a', windows: 'cold', passengers: 'few', sign: 'print', driver: 'plain', ground: 'day' },
        name: 'Túrkísblá smárúta',
        sign: 'BLUE LAGOON SHUTTLE — Relax. You deserve it.', signStyle: 'print',
        look: ['Bílstjóri með stafla af hvítum handklæðum.', 'Lyktar af brennisteini og tröllatré.'],
        hidden: ['Allir um borð eru í hreinum sokkum.', 'Hún fer eftir tvær mínútur. Hún fer alltaf eftir tvær mínútur.'],
        board: { do: (G) => G.end('tantalus') },
      };
      return G.shuffle([correct, crest, lagoon]);
    },
    choices: [
      { label: 'Bíddu. Klukkan er ekki orðin 11:00. Á skiltinu stóð 11:00.', kind: 'comply', dd: 6, nd: 6, sub: 'Skiltið er það eina sem hefur haft rétt fyrir sér hingað til.', time: 45, next: (G) => (G.t >= T(1, 11, 25) ? 'end:noshow' : 'buses2'), do: (G) => { G.nerves(8); G.dread(5); } },
    ],
  };

  scenes.ride2 = {
    art: 'road',
    loc: 'Leið 41 · í átt að Keflavík',
    enter: (G) => {
      G.flag('left_hotel');
      if (G.once('nofood')) { if (G.rng() < 0.5) G.at(T(1, 12, 30), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Veitingar á flugi þínu', body: 'Kæri Viðskiptavinur,\n\nVinsamlegast athuga að vegna tilvísunarinnar verður engin veitingaþjónusta á flugi AB 0271.\n\nVið mælum með þú kaupir hressingar í flugstöðinni.\n\nVið erum að gera okkar best.' }); }
      G.at(T(1, 12, 0), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Endurskoðaður brottfarartími', body: 'Kæri Viðskiptavinur,\n\nFlug þitt AB 0271 mun nú fara kl. 15:45.\n\nInnritun opnar þrjár klukkustundir fyrir brottför.\n\nVið erum að gera okkar best.', fx: (G) => { G.S.dep = T(1, 15, 45); } });
      G.at(T(1, 13, 10), 'chat', { body: 'Þú hefur verið gistur. Af hverju ert þú í biðröð? 🙂' });
    },
    text: p(
      'Þú gerir ráð fyrir að þú sért á réttum stað eingöngu af því að þú ert farið að kannast við aðra farþega, þótt þú eigir ekki gott með andlit. Rútan fer tuttugu mínútum of seint, sem þýðir, samkvæmt þínum útreikningum, að þú kemur á flugvöllinn heilum fjörutíu mínútum áður en innritun opnar yfirhöfuð.',
      'Ungbarn grætur hástöfum. Móðirin muldrar: ' + V('„Hún vildi helst vera komin heim núna,“') + ' og öll rútan hlær, dapurlega.',
      'Ísland líður fram hjá glugganum: frábært kranavatn, fallegt útsýni, sæmilega viðkunnanlegt fólk sem er ekki endilega hjálplegt en hótar þér ekki og lýgur ekki að þér. Ísland á hrós skilið fyrir það. Keflavík er saklaus.',
    ),
    choices: [{ label: 'Koma á staðinn.', time: 55, do: (G) => G.nerves(-4), next: 'airport' }],
  };

  /* ---------------------------------------------------------------- Day 1 · ~11:30 the airport (hub) */
  scenes.airport = {
    art: 'airport',
    loc: 'Keflavíkurflugvöllur · Brottfarir',
    enter: (G) => {
      G.flag('at_airport2'); atLeast(G, 45);
      if (G.once('counter_paper')) G.msg('paper', { from: 'A4-blað, bundið með kapalbindi við biðraðargrind', subj: 'Prentað skilti', body: '<b>ALBION ATLANTIC AB0271</b>\n\nCounter opens <b>3 HOURS</b> before departure.\n\nIf departure is delayed, counter opening is delayed.\n\nPlease queue here.' });
      if (G.once('ap_intro')) G.note(p(G.last(), 'Það er eitt (1) Albion Atlantic-afgreiðsluborð á flugvellinum, og biðröðin fyrir framan það er eingöngu skipuð fólki sem þú þekkir nú í sjón. Borðið er lokað. Á A4-blaði stendur að það opni þremur tímum fyrir brottför, og ekki mínútu fyrr, og ef fluginu seinkar, seinkar borðinu líka.'));
      const open = G.S.dep - 180;
      if (G.t >= open && G.has('inline')) G.go('checkin');
    },
    text: (G) => {
      const open = G.S.dep - 180;
      return hub(G,
        `Brottfarir. ${G.clock(G.t)}. Á töflunni stendur AB 0271 · LOS ANGELES · <em>${G.clock(G.S.dep)}</em>. ${G.t < open ? `Samkvæmt reikningsdæminu á útprentuninni opnar borðið kl. ${G.clock(open)}.` : G.has('inline') ? 'Hlerinn er að fara upp.' : 'Borðið er opið. Röðin hreyfist. Þú ert ekki í henni.'}`,
        'airport',
        G.has('seen') && G.D >= 5 ? W('Þú svipast stöðugt um eftir búningi yfirflugþjóns. Þú hefur engan séð. Það er ekki það sama og að hann sé ekki þarna.') : '');
    },
    choices: (G) => [
      { label: 'Prenta nýtt brottfararspjald í sjálfsafgreiðsluvélinni.', nd: 4, dd: 2, time: 8, do: (G) => { const n = G.count('kiosk'); G.nerves(3); G.note(n === 1 ? 'BÓKUN FINNST EKKI. Þú ferð að næstu vél. Þú slærð inn upplýsingarnar. BÓKUN FINNST EKKI, með annarri leturgerð. Þetta væri ekki hægt að skálda upp.' : n === 2 ? 'Vélin hugsar sig lengi um og prentar autt spjald. Þú geymir það. Þú veist ekki hvers vegna.' : 'BÓKUN ÞÍN HEFUR VERIÐ HÝST. Svo slokknar á skjánum og hann sýnir þér andlitið á þér.'); if (n >= 3) G.dread(3); }, next: 'airport' },
      { label: 'Fara í röðina við eina afgreiðsluborðið.', if: (G) => !G.has('inline'), time: 5, do: (G) => { G.flag('inline'); G.note('Þú ferð í röðina. Þetta er ekki beinlínis biðröð heldur ákvörðun sem tvö hundruð manns hafa tekið í sameiningu. Enginn í henni talar við flugfélagið. Allir í henni tala hver við annan.'); }, next: 'airport' },
      { label: 'Senda UK261 QR-kóðann niður eftir röðinni.', whyNot: 'Hendurnar myndu ekki halda símanum kyrrum.', dd: -6, nd: -4, nerveMax: 90, if: (G) => G.has('uk261'), once: 'qr2', time: 15, do: (G) => { G.collect(2); G.nerves(-5); G.note('Kóðinn berst niður eftir röðinni eins og lykilorð. ' + V('„Ég er tilbúinn að vera Karen,“') + ' segir maður í flíspeysu, sem er maðurinn í flíspeysunni.'); }, next: 'airport' },
      { label: 'Bera saman bækurnar um hótel og brottfarartíma.', whyNot: 'Þú myndir hefja rifrildi.', nd: -4, dd: -4, nerveMax: 85, once: 'notes2', time: 15, do: (G) => { G.collect(1); G.nerves(-3); G.note('Allir voru sendir hver á sinn stað. Allir fengu mismunandi tíma. Allir komu samt til baka, því útprentunin sagði það, og hér eruð þið öll, með rétt fyrir ykkur, í sameiningu.'); }, next: 'airport' },
      { label: 'Finna einhvern í einkennisbúningi og segja honum nákvæmlega hvað þér finnst.', kind: 'conflict', nd: 8, time: 10, do: (G) => { G.strike(); G.note('Þú sagðir manni í einkennisbúningi nákvæmlega hvað þér finnst. ' + V('„Við erum að gera okkar best.“') + ' Engin afsökunarbeiðni. Engin samúð. Ekki einu sinni til málamynda. Hann skrifaði eitthvað hjá sér.'); }, next: 'airport' },
      { label: 'Leita að útganginum. Bara til að sjá.', whyNot: 'Þú veist nú þegar að það er læst.', dd: 6, dreadMax: 85, time: 8, once: 'exit', do: (G) => { G.dread(5); G.nerves(4); G.note('Á dyrunum út stendur AÐEINS FYRIR KOMUFARÞEGA. Þú komst inn um þær. Þú leggur lófann á glerið og það opnast ekki, og maður í endurskinsvesti hristir höfuðið án þess að líta á þig.'); }, next: 'airport' },
      { label: 'Kaupa vatn. Maðurinn fyrir aftan þig treystir því ekki að það klárist ekki.', whyNot: 'Þú myndir henda henni.', nd: -4, nerveMax: 92, time: 10, once: 'water', do: (G) => { G.nerves(-3); G.note('Vatn, og samloka með stafnum ð í nafninu, og – af því að búðin á þá – sokkar. Þú áttir sokka. Þú kaupir fleiri sokka. Enginn sem hefur gengið í gegnum þessa nótt myndi dæma þig.'); if (!G.has('toothpaste')) { G.flag('toothpaste'); G.nerves(-4); } }, next: 'airport' },
      { label: 'Fylgjast með brottfarartöflunni.', dd: 3, nd: 3, time: 6, do: (G) => { const n = G.count('board'); G.dread(2); G.note(n === 1 ? `AB 0271 · LOS ANGELES · ${G.clock(G.S.dep)}. Svo flettir taflan í gegnum öll flug í heiminum og kemur aftur að því. Sami tími. Í bili.` : n === 2 ? 'Tíminn hefur ekki breyst. Línan hefur færst neðar. Allt fyrir ofan hana eru flug eitthvað, sem eru að fara.' : 'Þú horfir á hana fletta. LOS ANGELES. LOS ANGELES. Í einn ramma, eitthvað sem er ekki borg. LOS ANGELES.'); }, next: 'airport' },
      { label: 'Bíða.', whyNot: 'Þú getur ekki staðið kyrr.', kind: 'comply', nd: 3, dd: 3, nerveMax: 90, time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Hálftími. Röðin hreyfist ekki því hún hefur ekkert til að stefna að. Einhver sest á gólfið og það breiðist út.', 'Hálftími. Ræstitæknir fer hjá með vél. Þegar hún er farin lítur gólfið eins út og röðin er örlítið styttri.', 'Hálftími. Síminn þinn titrar, út af engu. Allra símar, í einu, og allir líta, og enginn segir neitt.'])); }, next: 'airport' },
    ],
  };

  scenes.checkin = {
    art: 'airport',
    loc: 'Keflavík · Eina afgreiðsluborðið',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 180); if (G.S.strikes >= 3) G.end('left'); },
    text: (G) => p(
      'Borðið opnar á réttum tíma, það er að segja á þeim tíma sem það hafði ákveðið með sjálfu sér. Afgreiðslumaðurinn tekur vegabréfið þitt. Enginn í einkennisbúningi hefur sýnt minnsta vott af afsökun allan daginn, ekki einu sinni til málamynda, og þessi maður ætlar ekki að verða sá fyrsti. ' + V('„Við erum að gera okkar best.“'),
      G.has('booked') && 'Hann hnyklar brýnnar yfir skjánum. ' + V('„Skrár okkar sýna þú varst gistur á Heathrow Renaissance Lodge síðustu nótt.“') + ' Hann slær eitthvað inn. Hann segir að það hafi verið skráð.',
      G.has('objected') && W('Hann lítur á lítið spjald sem er fest við skjáinn, og svo á þig.'),
      G.has('seen') && W('Hann horfir á þig örlítið of lengi. ' + V('„Herbergi 214,“') + ' segir hann, ekki sem spurningu.'),
      'Brottfararspjald, volgt úr prentaranum. Hlið 12. Það er ekta. Þú skoðar það þrisvar.',
    ),
    choices: [
      { label: 'Fara að hliðinu.', time: 40, do: (G) => { if (G.has('booked')) G.strike(); G.nerves(-6); }, next: 'gate' },
    ],
  };

  scenes.gate = {
    art: 'gate',
    loc: 'Keflavík · Hlið 12',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 60); G.dread(5); G.at(G.t + 20, 'chat', { body: 'Meirihluti viðskiptavinir hafa farið um borð. 🙂' }); },
    text: p(
      'Þú hefur nú verið á ferðalagi í rúman sólarhring með þessu fólki. Þú þekkir flíspeysuna. Þú þekkir smábarnið. Þú þekkir manninn úr 31C og parið sem var sent á hótel í gagnstæða átt og manninn sem treystir því í fullri alvöru ekki að flugfélagið verði ekki uppiskroppa með vatn.',
      'Starfsmaður við hliðið grípur hljóðnemann og <em>öskrar</em> á ykkur að fara um borð eftir hópum.',
      'Og hundrað manns hlæja upp í opið geðið á henni. Ekki af illkvittni. Bara – hjálparvana. Þið eruð á þessum tímapunkti orðin sjálfstjórnarsamfélag og tilraun hennar til að skipa því fyrir er, einhvern veginn, það fyndnasta sem hefur gerst allan daginn.',
    ),
    choices: [
      { label: 'Hlæja með þeim.', whyNot: 'Það kæmi vitlaust út.', nd: -6, dd: -4, nerveMax: 85, time: 10, do: (G) => { G.collect(1); G.nerves(-6); }, next: 'jetbridge' },
      { label: 'Fara um borð eftir hópum, í mestu hlýðni.', kind: 'comply', dd: 5, time: 10, do: (G) => G.nerves(2), next: 'jetbridge' },
      { label: 'Spyrja hana hvenær flugið fari í alvörunni.', kind: 'conflict', nd: 5, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) G.end('left'); }, next: 'jetbridge' },
      { label: 'Öskra á móti. Hærra en hún.', kind: 'conflict', nerveMin: 80, nd: 10, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) G.end('left'); else G.note('Þú öskraðir. Í fjórar sekúndur var það stórfenglegt. Svo birtist maður í dökkbláu við hliðina á þér, skrifaði eitthvað hjá sér, og fór, og hláturinn var þagnaður.'); }, next: 'jetbridge' },
    ],
  };

  scenes.jetbridge = {
    art: 'gate',
    loc: 'Keflavík · Landgangur',
    text: p(
      'Röðin stöðvast á landganginum. Brottfarartíminn á brottfararspjaldinu þínu er þegar liðinn, og það spjald er það nýjasta. Þú berð saman bækur við manninn fyrir framan þig um þær misvísandi upplýsingar sem þið hafið hvort um sig fengið um hvernig flugið verði.',
      'Svo mjakast röðin áfram, þú beygir fyrir hornið, og í stað flugvéladyra blasir við…',
      '<em>Rúta.</em>',
      W('Og þau þurftu endilega að láta ykkur fara um borð eftir hópum.'),
    ),
    choices: [{ label: 'Fara um borð í rútuna.', time: 10, next: 'tarmac' }],
  };

  scenes.tarmac = {
    art: 'tarmac',
    loc: 'Rúta · þjóðvegur · bylgjandi beitilönd',
    enter: (G) => G.dread(5),
    text: (G) => p(
      'Þessi rúta er ekki að fara með þig á annan stað á flughlaðinu. Þessi rúta er á því sem virðist vera alvöru þjóðvegur, gegnum alvöru bylgjandi beitilönd, með alvöru kindum í.',
      G.has('seen') ? 'Fremst í rútunni stendur maður í búningi yfirflugþjóns og heldur um slána. Hann snýr sér við. Hann horfir á þig – aðeins þig – nákvæmlega jafn lengi og hann horfði á gluggann þinn. ' + V('„Þú horfðir,“') + ' segir hann, alúðlega, og snýr sér við aftur.' : 'Bílstjórinn talar ekki. Í útvarpinu er eitthvað sem gæti verið veðrið.',
      'Enginn segir neitt. Einhver, aftarlega, byrjar að hlæja, og hættir svo.',
    ),
    choices: [
      { label: 'Sitja kyrr. Skima sjóndeildarhringinn eftir einhverju með vængi.', kind: 'comply', dd: 5, time: 15, next: 'plane' },
      { label: 'Fara fram í. Spyrja bílstjórann hvert þessi rúta sé eiginlega að fara.', kind: 'conflict', nd: 4, time: 15, do: (G) => { G.nerves(5); G.flag('asked_driver2'); }, next: 'plane' },
      { label: 'Heimta að fá að fara út. Núna.', kind: 'conflict', sub: 'Þetta er ekki flughlaðið.', do: (G) => G.end('pastures') },
    ],
  };

  scenes.plane = {
    art: 'plane',
    loc: 'Flughlað · einhvers staðar',
    text: (G) => p(
      G.has('asked_driver2') && W('Hann benti fram, gegnum framrúðuna, á beitilandið. Svo endaði beitilandið.'),
      'Þú heldur að þú sjáir flugvélina þína. Þér hefur því sennilega ekki verið rænt.',
      'Ykkur er stillt upp í röð utandyra, og þið mjakist áfram við stigafótinn. Og svo byrjar að rigna. Þú skellihlærð, ekki síst af því að þið eruð þegar, augljóslega, komin fram yfir brottfarartímann.',
      'Sæti. Belti. Fágaða röddin, í símtólinu: ' + V('„Meirihluti viðskiptavina okkar hafa verið skilningsríkir og þolinmóðir.“') + ' Hann heldur áfram og hrósar sjálfum sér, í nokkuð löngu máli, fyrir öryggisferlana sem komu ykkur til Íslands.',
      'Svo útskýrir hann hvernig sótt er um endurgreiðslu. Þú réttir úr þér. Það er fyrir þráðlausa netið um borð.',
      'Þú ætlar ekki að gera það.',
    ),
    choices: [
      { label: 'Loka augunum.', do: (G) => G.end(G.S.collective >= 5 ? 'collective' : 'home') },
    ],
  };

  /* ================================================================ endings */
  const endings = {
    terminal: {
      art: 'terminal', title: 'FLUGSTÖÐIN', kind: 'bad',
      hint: 'Einhver kemur alltaf með tilkynningu.', blurb: 'Þú beiðst eftir tilkynningunni.',
      text: p(
        'Enginn kemur með tilkynningu. Enginn ætlaði sér það nokkurn tímann. Klukkan 03:10 dofna ljósin í komusalnum niður í fjórðung, og eftir það er salurinn lögun sem þú manst frekar en sérð.',
        'Síminn þinn sýnir eitt strik og nýjan tölvupóst. <em>Við höfum skipulagt rútur fyrir þig.</em> Þar stendur ekki hvert. Það mun aldrei standa þar.',
        'Um morguninn finna ræstitæknarnir brottfararspjald og setja það í óskilamuni. Þeir eru mjög samviskusamir með svoleiðis hér.',
      ),
    },
    accommodated: {
      art: 'road', title: 'HÝST', kind: 'bad',
      hint: 'Tölvupósturinn var með merkinu.', blurb: 'Þú staðfestir bókunina.',
      text: p(
        'Bíllinn er hlýr, sætin eru úr leðri og bílstjórinn segir ekki orð. Á skjánum í mælaborðinu stendur HEATHROW RENAISSANCE LODGE · 1,894 km · KOMA —:—.',
        'Þú horfir á flugvallarljósin fjarlægjast. Eftir smástund eru engin ljós lengur – bara hljóðið í dekkjunum, og lítil hljóðbjalla nýs tölvupósts, sem berst til að staðfesta að gisting þín hafi verið skipulögð.',
      ),
    },
    crew: {
      art: 'stand', title: 'ÁHÖFNIN', kind: 'bad',
      hint: 'Hún var með merki. Hún var mjög fín.', blurb: 'Þú fórst um borð í þá fínu.',
      text: p(
        'Rútan lyktar af nýju áklæði og engu öðru. Allir brosa til þín þegar þú gengur hjá. Enginn er í fötunum frá því í gær, því enginn hér á sér neinn gærdag.',
        'Yfirflugþjónninn lokar dyrunum með mjúkum, dýrum smelli. ' + V('„Meirihluti viðskiptavina okkar hafa verið skilningsríkir og þolinmóðir.“') + ' Hann á við þig. Þú hefur sýnt skilning. Þú hefur sýnt mikla þolinmæði.',
        'Rútan rennur út úr ljósinu, og stæðið fyrir aftan hana er autt, og hefur verið það um hríð.',
      ),
    },
    convenience: {
      art: 'road', title: 'ÞÆGINDI', kind: 'bad',
      hint: 'Tuttugu mínútna gangur. Í þessu ástandi.', blurb: 'Þú fórst um borð, á miðri leið í 10-11.',
      text: p(
        'Það er hlýtt í rútunni, og sætin snúa inn á við, sem þú tókst ekki eftir fyrr en þú settist. ' + V('„Við erum að gera okkar best,“') + ' segir yfirflugþjónninn, og dyrnar leggjast saman, og 10-11 rennur fram hjá vinstra megin með öll ljós kveikt og engan inni.',
        'Þú færð aldrei neitt tannkrem.',
      ),
    },
    nightcoach: {
      art: 'corridor', title: 'NÆTURRÚTA', kind: 'bad',
      hint: 'Síðasta kall.', blurb: 'Þú svaraðir bankinu.',
      text: p(
        'Gangurinn er tómur og teppið er blautt. Úr stigaganginum: ' + V('„Fer núna.“') + ' Þú fylgir því, því það eru einu fyrirmælin sem nokkur hefur gefið þér alla nóttina með tímasetningu.',
        'Rútan á bílastæðinu bíður með kveikt innanljós. Allir inni snúa þegar að hótelinu. Það er sæti með nafninu þínu. Það er, reyndar, lítið prentað spjald með nafninu þínu, í Arial.',
      ),
    },
    lift: {
      art: 'corridor', title: 'LYFTAN', kind: 'bad',
      hint: 'Biluð, í Arial.', blurb: 'Þú fórst inn í lyftuna sem kom af sjálfu sér.',
      text: p(
        'Dyrnar lokast með kurteisi góðs hótels. Spegillinn innst sýnir þér: flugvélafötin, andlitið, litla pokann úr 10-11 ef þú ert með hann. Lyftan fer niður. Hún fer niður lengur en byggingin hefur hæðir til.',
        'Þegar dyrnar opnast blasir við hlýtt ljós og raðir af sætum, og allir í þeim snúa sér við og horfa á þig, og brosa, og yfirflugþjónninn segir: ' + V('„Takk fyrir þolinmæði þína,“') + ' og meinar það.',
      ),
    },
    tantalus: {
      art: 'carpark', title: 'TANTALOS', kind: 'bad',
      hint: 'Þig hefur alltaf langað að heimsækja Ísland.', blurb: 'Þú fórst í heitu laugarnar.',
      text: p(
        'Vatnið er 38°C, himinninn er á litinn eins og notuð bréfþurrka og þú ert í sokkunum úr fluginu því þú átt enga aðra sokka. Þetta er, hlutlægt séð, fallegt.',
        'Klukkan 11:00 fer rúta af bílastæði hótels í þrjátíu kílómetra fjarlægð án þín. Klukkan 11:04 berst tölvupóstur sem segir að rútan þín hafi farið klukkan 09:00. Klukkan 11:05 spyr spjallmennið hvort þú hafir notið dvalarinnar.',
        'Þú vildir óska að þú hefðir ekki verið með apalöppina í hendinni þegar þú sagðir það.',
      ),
    },
    noshow: {
      art: 'lobby', title: 'MÆTTI EKKI', kind: 'bad',
      hint: 'Á skiltinu stóð 11:00.', blurb: 'Þú beiðst eftir nákvæmlega þeim tíma sem stóð á skiltinu.',
      text: (G) => p(
        'Klukkan 11:30 hefur skiltið verið tekið niður. Í móttökunni man enginn eftir að hafa sett það upp. ' + V(LX('„Ertu í hópnum frá flugfélaginu? Þau eru farin.“')) + ' Hún segir það vingjarnlega.',
        'Kaffivélin í anddyrinu gefur frá sér hljóð eins og eitthvað sé að ræskja sig. Bókunin þín finnst ekki, þegar þú athugar.',
      ),
    },
    left: {
      art: 'airport', title: 'SKILIN EFTIR', kind: 'bad',
      hint: 'Hann sagði það svo sem.', blurb: 'Þrjár kvartanir, allar skráðar.',
      text: p(
        V('„Við höfum skráð endurgjöf þína,“') + ' segir maðurinn í einkennisbúningnum, og það kemur í ljós að þau hafa gert það; allt saman, á litlu spjaldi, með snyrtilegri rithönd. Á því eru þrjú hök.',
        V('„Eins og ráðlagt um borð, viðskiptavinir sem veita viðnám eða mótmæla rekstrarlegum ákvörðunum mega vera afhlaðnir.“') + ' Hann segir þetta án nokkurrar óvildar, sem er það versta. Svo biður hann næsta farþega að stíga fram, og röðin lokast yfir þig eins og vatn.',
      ),
    },
    pastures: {
      art: 'tarmac', title: 'BEITILAND', kind: 'bad',
      hint: 'Þessi rúta er á alvöru þjóðvegi.', blurb: 'Þú fórst út úr flughlaðsrútunni.',
      text: p(
        'Rútan stoppar, sem er það sem þú vildir. Dyrnar opnast út á útskot, girðingu, kindur, og vind sem hefur komið langan veg til að taka á móti þér. ' + V('„Eins og þú vilt,“') + ' segir bílstjórinn, og rútan heldur áfram án þín, í átt að einhverju sem gæti, úr þessari fjarlægð, verið flugvél.',
        'Ísland hefur ekkert gert af sér. Kindurnar eru afar viðkunnanlegar.',
      ),
    },
    home: {
      art: 'plane', title: 'HEIM (EÐA TIL GRÆNLANDS, EÐA TIL HELVÍTIS)', kind: 'good',
      hint: 'Sjáumst í Los Angeles.', blurb: 'Þú komst á leiðarenda. Upp á eigin spýtur, að mestu.',
      text: p(
        'Þú ert í sæti. Sætið er í flugvél. Flugvélin er, eftir því sem þú best sérð, á leið í átt að Los Angeles.',
        'Enginn í einkennisbúningi baðst nokkurn tímann afsökunar. Endurgreiðslan fyrir netið um borð er enn ósótt.',
        'Sjáumst í Los Angeles eftir tíu tíma. Eða á Grænlandi. Eða í helvíti.',
      ),
    },
    collective: {
      art: 'plane', title: 'SJÁLFSTJÓRNARSAMFÉLAG LHR–LAX', kind: 'good',
      hint: 'Sögusagnir eru ekki opinber boðleið.', blurb: 'Þú komst á leiðarenda, og það gerðu líka allir sem þú talaðir við.',
      text: p(
        'Í stiganum hlær einhver, og svo hlæja allir, og rigningin skiptir engu máli. Þið hafið ferðast saman í rúma tuttugu og átta tíma. Þú ert með QR-kóða, mann í flíspeysu, mann úr 31C, og smábarn sem hefur séð sitthvað.',
        'Nákvæmustu og gagnlegustu upplýsingarnar í allri þessari þrautagöngu komu úr útprentunum í Arial og frá tilviljunarkenndum farþegum sem báru sögusagnir á milli. Enginn í einkennisbúningi baðst nokkurn tímann afsökunar. Það kom í ljós að þú þurftir þess ekki.',
        'Sjáumst í Los Angeles. Fyrir hönd sjálfstjórnarsamfélags LHR–LAX óskarðu manninum á gjörgæslunni góðs bata.',
      ),
    },
  };

  /* ================================================================ interface strings */
  const ui = {
    tabMail: 'Póstur', tabAlly: 'Ally', tabSms: 'SMS', tabPaper: 'Pappír', phone: 'SÍMI',
    nerves: 'TAUGAR', dread: 'ÓTTI', noted: 'SKRÁÐ', day: 'DAGUR',
    board: 'Fara um borð', look: 'Skoða nánar', lookHint: 'Kostar nokkrar mínútur.',
    again: 'Fljúga aftur', endings: 'Endalok', back: 'Til baka', howto: 'Hvernig þetta virkar', start: 'Fara um borð', design: 'Hönnunarskýrsla',
    gameOver: 'LEIK LOKIÐ', madeIt: 'ÞÚ KOMST — NOKKURN VEGINN',
    subtitle: 'GISTIHRYLLINGUR · TEXTI · 20–30 MÍNÚTUR',
    galleryIntro: 'Allar leiðir sem þetta getur farið. Þær læstu eru enn þarna úti.', locked: '???',
    noMail: 'Enginn póstur. Það, að minnsta kosti, er eðlilegt.', noSms: 'Engin skilaboð.', noPaper: 'Myndir af prentuðum skiltum sem þú finnur. Þú finnur nokkur.',
    allyIntro: 'Ally — sýndaraðstoðarmaður Albion Atlantic. Svarar venjulega samstundis.', inbox: '‹ Innhólf',
    emailFoot: 'Þetta er sjálfvirk skilaboð. Svör til þessa netfangs eru ekki vöktuð, lesin, eða möguleg. Albion Atlantic — Við erum að gera okkar best.',
    from: 'Frá:', sent: 'Sent', received: 'Móttekið', arrived: 'barst', photographed: 'Myndað',
    tMail: 'PÓSTUR', tSms: 'SMS', tPaper: 'PAPPÍR', tAlly: 'ALLY', tNoted: 'SKRÁÐ · Flugfélagið hefur skráð endurgjöf þína.',
    gateNerves: 'Þú gætir ekki sagt það með stöðugri röddu.', gateDread: 'Þú getur ekki fengið þig til þess.',
  };

  return { start, scenes, endings, chat, ui, T, lang: 'is', broken: CONTENT_BROKEN };
})();
