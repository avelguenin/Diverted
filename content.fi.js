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
CONTENTS.fi = (() => {
  const T = (d, h, m = 0) => d * 1440 + h * 60 + m;
  const p = (...xs) => xs.filter(Boolean).join('\n\n');
  const V = (s) => `<span class="voice">${s}</span>`;        // a voice, usually posh
  const W = (s) => `<span class="whisper">${s}</span>`;      // an aside
  const atLeast = (G, v) => { if (G.S.dread < v) G.S.dread = v; }; // v in percent
  const hub = (G, status, key, extra) => p(status, G.last(), G.amb(key, AMB[key]), extra);
  const KNOCK_AT = T(1, 4, 30);

  const start = { scene: 'lane', t: T(0, 19, 20), nerves: 18, dread: 8, dep: T(1, 15, 10) };

  /* ================================================================ ambient pools */
  const AMB = {
    hall: [
      { d: 1, t: 'Lattianpesukone ajaa hitaasti ohi. Kuljettajan kasvoja et koskaan aivan näe.' },
      { d: 1, t: 'Joku on löytänyt pistorasian, ja yksitoista ihmistä seisoo sen ympärillä kuin nuotiolla.' },
      { d: 1, t: 'Saapuvien taulu ei kerro lennostasi mitään. Se ei kerro mistään lennosta mitään.' },
      { d: 1, t: 'Lapsi nukkuu matkatavarakärryssä. Matkatavaroita ei ole.' },
      { d: 2, t: 'Hallissa on vähemmän ihmisiä kuin äsken. Et nähnyt kenenkään lähtevän.' },
      { d: 2, t: 'Loisteputki matkatavaratiskin yläpuolella on alkanut naksua.' },
      { d: 2, t: 'Muutaman minuutin välein joku nousee, kävelee oville ja tulee takaisin.' },
      { d: 3, t: 'STAFF-ovi on raollaan, kämmenen leveydeltä. Et nähnyt sen aukeavan.' },
      { d: 3, t: 'Hetken ajan kaikki hallin puhelimet syttyvät yhtä aikaa, ja sitten ne kaikki pimenevät.' },
      { d: 3, t: 'Joku seisoo tax-free-myymälän rullaovien edessä selin halliin. Hänellä on tummansininen puku.' },
    ],
    room: [
      { d: 2, t: 'Lämmitys pitää ääntä, kuin joku harkitsisi koputtamista.' },
      { d: 2, t: 'Vedenkeittimessä on pieni valo. Se on ainoa asia huoneessa, joka on sinun puolellasi.' },
      { d: 2, t: 'Joku raahaa käytävällä pyörällistä laukkua, jota hänellä ei mitenkään voi olla.' },
      { d: 2, t: 'Heijastuksellasi mustassa ikkunassa on eiliset vaatteet. Kaikilla on.' },
      { d: 3, t: 'Auto ajaa tiellä hitaasti ohi eikä käänny pihaan.' },
      { d: 3, t: 'Seinän takana, naapurissa, televisio näyttää samaa ei-mitään kuin sinun.' },
      { d: 3, t: 'Huone on 214. Kortissa lukee 214. Tarkistat sen yhä uudelleen, ikään kuin se olisi voinut siirtyä.' },
      { d: 3, t: 'Joku pysähtyy käytävällä ovesi kohdalle ja jatkaa sitten matkaa.' },
      { d: 4, t: 'Valo oven alla sammuu, syttyy taas, ja sammuu.' },
      { d: 4, t: 'Jossain alhaalla käy moottori. Se on käynyt jo jonkin aikaa.' },
      { d: 4, t: 'Puhelin syttyy tyhjänä. Ei viestiä. Vain näyttö, joka katsoo sinua.' },
      { d: 4, t: 'Kuulet koputuksen kaksi ovea alempaa. Tasainen, kärsivällinen. Sitten yksi ovi alempaa.' },
      { d: 5, t: 'Parkkipaikalla on joku. Hän on ollut siellä jo jonkin aikaa.' },
      { d: 5, t: 'Verho liikkuu. Yksikään ikkuna ei ole auki.' },
      { d: 5, t: 'Huoneen puhelin soi kerran ja vaikenee.' },
    ],
    corridor: [
      { d: 2, t: 'Mustelmanvärinen kokolattiamatto. Pyyhekärry pysäköitynä käytävän päähän, hylättynä kesken vuoron.' },
      { d: 2, t: 'Joka ovessa on numero. Joka numeron alla on valojuova.' },
      { d: 3, t: 'Jääpalakone jauhaa, pysähtyy, jauhaa.' },
      { d: 3, t: 'Valo käytävän päässä on sammunut. Se paloi äsken.' },
      { d: 3, t: 'Joku nauraa jonkin oven takana ja lopettaa kesken.' },
      { d: 4, t: 'Matto huoneen 216 edessä on märkä.' },
      { d: 4, t: 'Kuulet hissin liikkuvan kerrosten välillä. Kukaan ei ole kutsunut sitä.' },
      { d: 4, t: 'Käytävän päässä oleva palo-ovi on kiilattu auki kengällä.' },
      { d: 5, t: 'Ovet pitkin käytävää ovat auki, yksi toisensa jälkeen, ja niiden takana huoneet on sijattu. Kukaan ei ole koskaan ollut niissä.' },
      { d: 5, t: 'Käytävän päässä joku tummansinisissä koputtaa oveen, tasaisesti, ja siirtyy seuraavaan.' },
    ],
    lobby: [
      { d: 2, t: 'Yövastaanottovirkailija täyttää ristikkoa kielellä, jota et osaa. Hän ei ole täyttänyt yhtään ruutua.' },
      { d: 2, t: 'Matkatoimiston juliste: JÄÄTIKÖT · VALAAT · REVONTULET. Kukaan tässä aulassa ei näe niistä yhtäkään.' },
      { d: 2, t: 'Kaksi matkustajaa nukkuu pystyasennossa sohvalla, puhelimet käsissään kuin kynttilät.' },
      { d: 3, t: 'Kahviautomaatin punainen valo vilkkuu rytmissä, joka on melkein sana.' },
      { d: 3, t: 'Lasiovet liukuvat auki ei kenellekään ja sulkeutuvat taas.' },
      { d: 3, t: 'Tulostetussa kyltissä on uusi vesitahra. Se kuivuu jonkin muotoiseksi.' },
      { d: 4, t: 'Ulkona parkkipaikalla: ajovalot, moottori tyhjäkäynnillä. Ne eivät sammu.' },
      { d: 4, t: 'Yövirkailija katsoo ohitsesi oville ja sitten takaisin ristikkoonsa.' },
      { d: 4, t: 'Yksi nukkuvista matkustajista on poissa. Hänen puhelimensa on yhä sohvalla, näyttö ylöspäin, sähköposti auki.' },
      { d: 5, t: 'Virkailija sanoo nostamatta katsettaan: "Hän kysyi sinua."' },
      { d: 5, t: 'Ovet liukuvat auki. Kylmää ilmaa. Kukaan ei tule sisään. Ne jäävät auki.' },
    ],
    carpark: [
      { d: 2, t: 'Tuulta. Laavakenttiä. Tie, joka menee toiseen suuntaan pimeään ja toiseen suuntaan hieman erilaiseen pimeään.' },
      { d: 2, t: 'Hotelli takanasi on valaistu kuin akvaario.' },
      { d: 3, t: 'Soraa. Yksi lyhty. Sadetta, joka ei osaa päättää.' },
      { d: 3, t: 'Bussinmuotoinen pimeys parkkipaikan perällä, moottori sammuksissa. Tai käynnissä.' },
      { d: 4, t: 'Parkkipaikan perällä olevan bussin sisävalot palavat. Joka paikka on täynnä.' },
      { d: 4, t: 'Joku seisoo bussin oven vieressä, hyvin suorana, kädet ristissä.' },
      { d: 5, t: 'Hän katsoo hotellia. Yhtä ikkunaa. Tiedät mitä.' },
    ],
    morning: [
      { d: 2, t: 'Aamiaista korjataan pois. Sitä ei oikeastaan koskaan tarjoiltukaan.' },
      { d: 2, t: 'Joku on järjestänyt pienet hillopurkit riviin, värin mukaan.' },
      { d: 2, t: 'Taapero selittää jotain tärkeää lämpöpatterille.' },
      { d: 3, t: 'Aamiaisella on vähemmän väkeä kuin aulassa eilen illalla. Eri hotelleja, kaikki sanovat. Eri hotelleja.' },
      { d: 3, t: 'Viereisen pöydän mies on saanut neljä sähköpostia, joissa on neljä eri aikaa. Hän lukee niitä ääneen kuin säätiedotusta.' },
      { d: 3, t: 'Ulkona, päivänvalossa, parkkipaikka näyttää parkkipaikalta. Siellä on bussi.' },
      { d: 4, t: 'Kukaan ei enää puhu. Kaikki tarkkailevat ovia.' },
      { d: 4, t: 'Yövirkailija on yhä vuorossa. Hän ei ole vaihtunut. Hän täyttää samaa ristikkoa.' },
    ],
    airport: [
      { d: 3, t: 'Lähtevien taulu päivittyy. Lentosi siirtyy rivin alaspäin. Mikään ei siirry ylöspäin.' },
      { d: 3, t: 'Jonon kärjessä oleva nainen on ollut siinä niin kauan, että hän on ottanut kengät jalastaan.' },
      { d: 3, t: 'Ainoalla tiskillä on soittokello. Kukaan ei paina sitä. Joku painaa sitä. Ei mitään.' },
      { d: 4, t: 'Ulko-ovissa lukee VAIN SAAPUVAT. Ne eivät olleet lukossa aiemmin.' },
      { d: 4, t: 'Jono on lyhyempi kuin äsken. Ketään ei ole palveltu.' },
      { d: 4, t: 'Tummansiniseen univormuun pukeutunut mies kävelee jonon päästä päähän laskien, ja palaa ovesta.' },
      { d: 5, t: 'Liikkeet laskevat rullaovensa, yksi kerrallaan, järjestyksessä, sinua kohti.' },
      { d: 5, t: 'Nimesi kuulutetaan. Sitten ei kuulutetakaan. Kukaan muu ei kuullut sitä.' },
      { d: 5, t: 'Taulussa lukee LOS ANGELES ja, yhden sekunnin ajan, jotain muuta.' },
      { d: 6, t: 'Jonossa ei ole enää ketään muita kuin sinä ja ne, jotka tunnistat. Muut ovat menneet jonnekin.' },
      { d: 6, t: 'Tiskivirkailija katsoo sinua. Hän on katsonut jo jonkin aikaa. Hän hymyilee.' },
    ],
  };

  /* ================================================================ chatbot
     Ally is the channel that always lies — but lies *specifically*. As dread
     rises it starts to know where you are. */
  const tail = (G) => {
    const d = G.D;
    if (d >= 5) return '\n\n' + G.pick(['Miksi olet yhä täällä?', 'Suurin osa asiakkaista on jo koneessa.', 'Näemme, että olet yhä siellä.']);
    if (d >= 3) return '\n\n' + G.pick(['Olet yhä huoneessa 214.', 'Pysy siellä missä olet.', 'Voinko auttaa jossain muussa? Mitään muuta ei ole.']);
    return '';
  };
  const chat = [
    {
      label: 'Missä hotellini on?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Majoituksesi oli Hótel Hraun. Toivottavasti nautit vierailustasi! Haluaisitko jättää arvion?' + tail(G);
        if (G.has('at_hotel')) return 'Olet Hótel Hraunissa, huoneessa 214. Pysy huoneessasi, kunnes sinut noudetaan.' + tail(G);
        return 'Hyvä kysymys! Majoituksesi on varattu Heathrow Renaissance Lodgesta, Bath Road. Varauslinkki on lähetetty sähköpostiisi. 🛏️';
      },
    },
    {
      label: 'Milloin bussi lähtee?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Bussisi koneelle lähtee, kun boardaus on valmis. Nouse kyytiin ryhmittäin. 🚌' + tail(G);
        if (G.has('morning')) return 'Kuljetuksesi lentokentälle on vahvistettu klo 08:00. Ole aulassa 15 minuuttia etuajassa.' + tail(G);
        if (G.has('at_hotel')) return 'Bussisi lähtee klo 04:30. Henkilökunnan jäsen koputtaa oveesi.' + tail(G);
        return 'Busseja on järjestetty kaikille asiakkaille. Siirry busseille. 🚌';
      },
    },
    {
      label: 'Mitä tapahtuu?',
      answer: (G) => G.pick([
        'Lentosi AB 0271 Los Angelesiin on aikataulussa. ✈️',
        'Olen täällä auttamassa! Lento AB 0271 lennetään tällä hetkellä aikataulun mukaisesti.',
        'Kaikki etenee normaalisti. Voinko auttaa jossain muussa?',
      ]) + tail(G),
      do: (G) => G.nerves(2),
    },
    {
      label: 'Haluan tehdä valituksen.',
      warn: true,
      answer: 'Ikävä kuulla. Palautteesi on kirjattu varaukseesi. Kiitos, että lennät Albion Atlanticilla – teemme parhaamme. 🙏',
      do: (G) => G.strike(),
    },
  ];

  /* ================================================================ scenes */
  const scenes = {};

  scenes.title = {
    type: 'title',
    board: `AB 0271   LONTOO LHR  →  LOS ANGELES LAX      LÄHTENYT 20:05\n                                              TILA: ▮▮▮▮▮▮▮▮▮▮`,
    text: p(
      'Yhdeksän tuntia, suoraan, kotona ennen keskiyötä Tyynenmeren aikaa. Joit sen ylimääräisen kahvin. Teit kaiken oikein.',
      'Tämä on peli siitä, kuinka sinulle kerrotaan, hyvin kohteliaasti, että kaikki on hyvin.',
      W('Innoittajana tosielämän ketju lennon uudelleenreitityksestä. Pelin lentoyhtiö on kuvitteellinen. Bussit eivät ole.'),
    ),
  };

  scenes.howto = {
    loc: 'Turvaohjekortti',
    text: p(
      '<em>Lue kaikki.</em> Puhelimesi (oikealla, tai PUHELIN-painikkeen takana) vastaanottaa lentoyhtiön sähköpostit, Ally-nimisen chatbotin viestit, tekstiviestit sekä valokuvat kaikista tulostetuista kylteistä, joita kohtaat. Joku puhuu totta. Se ei ole aina se, jolla on logo.',
      '<em>Kaksi mittaria.</em> Molemmat täyttyvät. Kumpikaan ei lopeta peliä. Ne sulkevat ovia: kun mittari täyttyy, osa siitä, mitä olisit voinut sanoa tai tehdä, lakkaa olemasta mahdollista, ja jäljelle jää se, mikä jää. Pienet valinnat täyttävät niitä. Uni, ruoka ja muut ihmiset tyhjentävät niitä, hieman.',
      '<em>Merkitty</em> laskee valitukset, jotka lentoyhtiö on kirjannut sinusta. Kolmannella ne toimivat – siellä missä voivat.',
      'Paikat ovat huoneita, joissa voit liikkua. Tekeminen vie minuutteja; kello kuluu vain kun toimit. Busseja tulee ja menee. Katso niitä tarkkaan ennen kuin nouset kyytiin. Oikea näyttää siltä, miltä sinusta tuntuu.',
      'Pelikerta kestää kahdestakymmenestä kolmeenkymmeneen minuuttia. Loppuja on kaksitoista, ja yksi niistä on Los Angeles.',
    ),
    choices: [{ label: 'Takaisin', next: 'title' }],
  };

  scenes.gallery = { type: 'gallery' };

  /* ---------------------------------------------------------------- Day 0 · the approach
     Boarding, the seat, the demonstration, the meal, the dark hours. Nothing
     goes wrong here. That is what it is for: four hours of a cabin working
     exactly as it should, with one man in it counting. */
  scenes.boarding = {
    art: 'gate',
    loc: 'Lontoo Heathrow · Matkustajasilta · Paikka 31B',
    enter: (G) => { if (G.once('welcome_mail')) G.msg('email', { from: 'Albion Atlantic', subj: 'Tervetuloa lennolle AB 0271', body: 'Hyvä asiakas,\n\nTervetuloa Albion Atlanticin lennolle AB 0271 Los Angelesiin. Lentosi on aikataulussa.\n\nMatkustamohenkilökuntamme huolehtii turvallisuudestasi ja mukavuudestasi. Asiakkaidemme turvallisuus on kaikkein tärkeintä.\n\nMiellyttävää lentoa.' }); },
    text: p(
      'Matkustajasilta haisee kerosiinilta ja kokolattiamatolta. Koneen ovella purseri: pitkä, ohimoilta harmaantunut, hymy, joka on silitetty paidan mukana. Hän ei katso tarkastuskortteja. Hän katsoo kasvoja, yksi kerrallaan, ja sanoo ' + V('"Tervetuloa"') + ' jokaiselle, ikään kuin hänen pitäisi muistaa se.',
      'Rivi 31. Käytäväpaikka, 31B. Paikalla 31C suunnilleen ikäisesi mies, jolla on pokkari, jonka lukemisen hän on jo lopettanut. Hän nyökkää. Sinä nyökkäät. Siinä koko keskustelu, ja niin on vielä pitkään.',
      'Jossain takanasi kaksivuotiaalle kerrotaan kärsivällisesti, että kone ei lähde vielä. Kone ei lähde vielä.',
    ),
    choices: [
      { label: 'Tervehdi 31C:tä.', nd: -1, dd: -1, time: 20, do: (G) => { G.flag('met31c'); G.note('Hän tervehti takaisin. Hän on menossa kotiin. Hän sanoi sen niin kuin se sanotaan yhdeksän tunnin alussa: kotiin, ikään kuin se olisi paikka, jonne kone varmasti pääsee.'); }, next: 'takeoff' },
      { label: 'Nosta laukku hyllylle, istu alas, kiinnitä vyö ennen kuin kukaan pyytää.', kind: 'comply', dd: 2, time: 20, do: (G) => G.note('Vyö kiinni. Laukku hyllyllä. Ohi kulkeva purseri vilkaisi sitä ja nyökkäsi aavistuksen verran, niin kuin nyökkää mies, joka pitää listaa.'), next: 'takeoff' },
      { label: 'Kysy ovella seisovalta purserilta, onko lento aikataulussa.', nd: 1, time: 20, do: (G) => G.note(V('"Kaikki on aikataulussa",') + ' hän sanoi lämpimästi, ja sitten – ikään kuin perusteellisuuden vuoksi – ' + V('"Kaikki."') + ' Hän katsoi yhä takanasi sisään tulevia matkustajia.'), next: 'takeoff' },
      { label: 'Lue istuintaskun turvaohjekortti. Kunnolla, kerrankin.', nd: -2, time: 20, do: (G) => G.note('Suoja-asento. Lähimmät uloskäynnit, jotka saattavat olla takanasi. Pieni piirros ihmisestä liukumassa mereen tyynellä ilmeellä. Laitat sen takaisin. Et ole koskaan ennen lukenut sellaista, etkä tiedä, miksi luit nyt.'), next: 'takeoff' },
    ],
  };

  scenes.takeoff = {
    art: 'cabin',
    loc: 'Kiitotie 27L · Heathrow',
    text: p(
      'Purseri tekee turvaesittelyn itse, edessä, kun video pyörii hänen takanaan ilman ääntä. Hän tekee sen hitaasti. Hän tekee sen katsoen jokaista riviä vuorollaan, kuin tarkistaisi, että uloskäynnit ovat siellä, missä kortti sanoo.',
      V('"Siinä epätodennäköisessä tapauksessa. Siinä epätodennäköisessä tapauksessa. Asiakkaidemme turvallisuus on kaikkein tärkeintä."') + ' Se on outo asia sanottavaksi turvaesittelyssä, ja hän sanoo sen kuin se olisi se tavallinen asia.',
      'Sitten moottorit, ja paine selkänojassa, ja Lontoo kallistumassa pois oranssiin ja mustaan. Turvavyövalo palaa vielä pitkään sen jälkeen, kun sen pitäisi.',
    ),
    choices: [
      { label: 'Katso esittely loppuun.', kind: 'comply', dd: 2, time: 40, do: (G) => G.note('Katsoit loppuun. Hän lopetti sinun puolellasi matkustamoa, ja hetken esittely tehtiin nimenomaan sinulle, ja sitten se oli ohi ja hän käveli takaisin käytävää pitkin koskettaen istuinten selkänojia.'), next: 'service' },
      { label: 'Katso ikkunasta, kuinka Lontoo jää taakse.', nd: -2, time: 40, do: (G) => G.note('M25 kuin meripihkainen rengas. Sitten pilveä. Sitten ei mitään muuta kuin siiven valo vilkkumassa, ja omat kasvosi lasissa, matkalla kotiin.'), next: 'service' },
      { label: 'Tarkista puhelin vielä kerran ennen lentotilaa.', dd: 1, time: 40, do: (G) => { G.msg('sms', { from: 'Jo 💛', body: 'hyvää lentoa!!! laita viestiä kun laskeudut 🛫' }); G.note('Yksi viesti. Jo. Kirjoitit takaisin <em>laitan</em>, katsoit, kuinka lähetys epäonnistui, laitoit puhelimen lentotilaan ja tunsit, kuinka matkustamo sulkeutui ylläsi kuin kansi.'); }, next: 'service' },
    ],
  };

  scenes.service = {
    art: 'cabin',
    loc: 'Matkalento · Irlanninmeren yllä',
    text: (G) => p(
      G.last(),
      'Illallinen tulee kärryllä, jota työntää kaksi lentoemäntää, jotka hymyilevät kuin työkseen. Kanaa vai pastaa. Purseri seuraa kärryä muutaman rivin päässä, ei tarjoile, kävelee vain, katsoo tarjottimia, katsoo ihmisiä tarjottimineen.',
      G.has('met31c') ? 'Mies paikalla 31C otti pastan. Hän ei syö sitä. Hän katsoo istuimen karttaa, jossa pieni lentokone ei ole vielä saavuttanut Irlannin rannikkoa.' : 'Mies paikalla 31C otti pastan. Hän ei syö sitä. Hän ei ole sanonut sanaakaan.',
    ),
    choices: [
      { label: 'Kanaa.', time: 40, nd: -2, do: (G) => G.note('Kana oli kanaa samalla tavalla kuin turvakortin meri oli merta. Söit sen. Olit menossa kotiin; siellä söisit kunnolla.'), next: 'night' },
      { label: 'Tilaa kahvi. Sitten toinen.', nd: 6, sub: 'Olet siirtämässä kehoasi Tyynenmeren aikaan etkä aio luopua siitä.', time: 40, do: (G) => { G.flag('coffee'); G.nerves(-3); G.note('Kaksi kahvia. Lentokonekahvia, toisin sanoen lämmin mielipide. Joit ne periaatteesta. Periaate oli Tyynenmeren aika, ja ohi kulkeva purseri katsoi toista kuppia hieman kauemmin kuin kuppi ansaitsee.'); }, next: 'night' },
      { label: 'Jätä illallinen väliin. Kallista istuin. Yritä nukkua nyt.', kind: 'comply', dd: 3, nd: -3, time: 40, do: (G) => G.note('Nukuit, vähän, niin kuin lentokoneissa nukutaan: et niinkään unessa kuin sammutettuna. Kun heräsit, tarjottimet olivat poissa, matkustamon valot himmennetty, ja joku edessä seisoi käytävällä hyvin hiljaa.'), next: 'night' },
      { label: 'Kysy lentoemännältä kohteliaasti, onko purseri aina tällainen.', kind: 'conflict', nd: 4, dd: -2, time: 40, do: (G) => G.note('Hän naurahti kerran, eikä sitten enää nauranut, ja katsoi käytävää pitkin sinne, missä purseri oli. ' + V('"Hän on hyvin perusteellinen",') + ' hän sanoi ja antoi sinulle pastan, jota et ollut pyytänyt.'), next: 'night' },
    ],
  };

  scenes.night = {
    art: 'cabin',
    loc: 'Matkalento · keskellä Atlanttia · neljäs tunti',
    enter: (G) => G.dread(2),
    text: (G) => p(
      G.last(),
      'Matkustamo on nyt pimeä. Näytöt enimmäkseen sammuksissa. Istuimen kartta näyttää pienen lentokoneen valtavan sinisen yllä, ja GRÖNLANTI jossain ylhäällä oikealla, huhun tasolla.',
      'Purseri kävelee käytävää. Hitaasti, edestä, pieni kortti toisessa kädessä ja lyijykynä toisessa, ja joka rivillä hän pysähtyy, katsoo ja tekee merkinnän. Hän ei selitä. Kukaan ei kysy. Kun hän tulee sinun rivillesi, hän katsoo sinua, ja 31C:tä, ja tyhjää ikkunapaikkaa, ja kirjoittaa.',
      'Edessä etumatkustamon verho on vedetty kiinni. Sen takana on valoa, ja ihmisiä, jotka kulkevat sen läpi nopeasti, ja sitten purseri seisomassa sen edessä kädet ristissä, kasvot ei verhoon vaan teihin muihin päin.',
    ),
    choices: [
      { label: 'Nuku, tai yritä.', kind: 'comply', dd: 2, nd: -3, time: 40, do: (G) => G.note('Suljit silmäsi. Niiden takana käytävää käveltiin edelleen. Jossain edessä nainen sanoi ' + V('"Onko hän kunnossa?"') + ' ja joku sanoi ' + V('"Palatkaa paikallenne",') + ' etkä avannut silmiäsi, koska sinulle ei puhuttu. Vielä.'), next: 'cabin' },
      { label: 'Katso karttaa.', dd: 2, time: 40, do: (G) => G.note('Pieni lentokone liikkui niin hitaasti, että se näytti harkitsevan. Sitten kartta ei hetkeen näyttänyt mitään, pelkkää sinistä, ja jäljellä oleva lentoaika pysyi lukemassa 5:12 kauemmin kuin minuutti kestää.'), next: 'cabin' },
      { label: 'Mene edessä olevaan vessaan. Kävele verhon ohi.', dd: 4, nd: 2, dreadMax: 90, time: 40, do: (G) => { G.flag('saw_galley'); G.note('Verhon raosta: mies keittiön lattialla, lentoemäntä polvillaan hänen vieressään käsi hänen rinnallaan, ja purseri seisomassa heidän molempien yllä kädet ristissä – katsomassa ei miestä, vaan matkustamoa, raon läpi, ja siis sinua. ' + V('"Palatkaa paikallenne",') + ' hän sanoi liikuttamatta mitään muuta kuin suutaan.'); }, next: 'cabin' },
      { label: 'Kysy 31C:ltä, näkikö hän kortin.', nd: -1, dd: -2, time: 40, do: (G) => { G.flag('met31c'); G.note(V('"Pääluku",') + ' hän sanoi. ' + V('"Sen ne tekevät ennen kuin laskeutuvat jonnekin, minne ei ollut tarkoitus."') + ' Hän sanoi sen kuin vitsin. Kumpikaan ei nauranut. Se oli ensimmäinen asia, jonka hän oli sanonut neljään tuntiin.'); }, next: 'cabin' },
    ],
  };

  scenes.cabin = {
    art: 'cabin',
    loc: 'Jossain Grönlannin eteläpuolella · 37 000 jalkaa',
    text: (G) => p(
      G.last(),
      'Turvavyövalo syttyy äänellä, joka on kuin lusikka lasia vasten.',
      G.has('saw_galley') ? 'Kapteeni: yksi asiakas on sairastunut. Sinä tiedät. Kone ohjataan Reykjavíkiin. Hän on pahoillaan. Hän sanoo sen kahdesti, ja molemmilla kerroilla se kuulostaa ihmisen sanomalta.' : 'Kapteeni: yksi asiakas on sairastunut. Kone ohjataan Reykjavíkiin. Hän on pahoillaan. Hän sanoo sen kahdesti, ja molemmilla kerroilla se kuulostaa ihmisen sanomalta.',
      'Matkustamo tekee sen, mitä matkustamot tekevät. Joku sanoo: ' + V('"Ei voi olla totta."') + ' Joku kolme riviä edempänä painaa kutsunappia, ja jatkaa painamista. Mies keittiön lähellä nousee seisomaan ja kysyy kantavaksi tarkoitetulla äänellä, kuka tarkalleen ottaen maksaa hänen jatkolentonsa.',
      'Kukaan ei vastaa hänelle. Kutsunappi soi edelleen.',
    ),
    choices: [
      { label: 'Älä sano mitään. Katso karttaa istuimen näytöltä.', kind: 'comply', dd: 4, sub: 'Pieni lentokone kääntyy.', time: 15, do: (G) => G.note('Pieni lentokone kartalla on kääntynyt pohjoiseen. Sen alla sana GRÖNLANTI, ja sen alla ei mitään. Ympärilläsi valittaminen jatkuu ilman sinua.'), next: 'cabin_purser' },
      { label: 'Kysy lentoemännältä kohteliaasti, mitä tapahtuu laskeutumisen jälkeen.', nd: 2, time: 15, do: (G) => { G.flag('asked_crew'); G.nerves(3); G.note('Hän hymyili sinulle niin kuin autossa istuvalle koiralle hymyillään. ' + V('"Kaikesta tiedotetaan."') + ' Hän ei sanonut kuka tiedottaa. Hänen takanaan keittiön lähellä oleva mies seisoi yhä.'); }, next: 'cabin_purser' },
      { label: 'Liity kuoroon. Ääneen. Sinulla on elämä odottamassa Los Angelesissa.', kind: 'conflict', nd: 10, dreadMax: 80, time: 15, do: (G) => { G.strike(); G.flag('objected'); G.note('Sanoit sen. Et huutanut – mutta et sanonut hiljaakaan, ja muutama pää kääntyi, ja keittiön lähellä oleva mies osoitti sinua kuin todistuskappaletta. Hetken tuntui kuin koko matkustamo olisi ollut samaa mieltä.'); }, next: 'cabin_purser' },
      { label: 'Paina kutsunappia, niin kuin muutkin.', kind: 'conflict', nd: 4, time: 15, do: (G) => G.note('Painoit sitä. Sinun nappisi liittyi siihen kolme riviä edempänä ja toiseen takana, kunnes matkustamo oli pieni orkesteri, joka soitti yhtä nuottia, eikä kukaan tullut, eikä kukaan ollut tulossa.'), next: 'cabin_purser' },
    ],
  };

  scenes.cabin_purser = {
    art: 'cabin',
    loc: 'Jossain Grönlannin eteläpuolella · 37 000 jalkaa',
    enter: (G) => G.dread(2),
    text: (G) => p(
      G.last(),
      'Sitten purseri ottaa luurin. Kuulet aksentin ennen sanoja – lämmin, hienostunut, tavattoman kärsivällinen. Hän on odottanut, että kutsunappi lakkaisi soimasta. Se ei ole lakannut. Hän puhuu sen yli.',
      V('"Hyvät naiset ja herrat. Minä vastaan tästä matkustamosta, ja asiakkaidemme turvallisuus on kaikkein tärkeintä. Jokainen, joka vastustaa tätä uudelleenreititystä tai panee sen vastaan, poistetaan koneesta Islannissa. Teemme parhaamme."'),
      'Hiljaisuus. Keittiön lähellä oleva mies istuutuu. Kutsunappi sammuu. Kolme riviä taaempana joku naurahtaa kerran ja vaikenee.',
      G.has('objected') && W('Hän ei katso keittiön lähellä olevaa miestä. Hän katsoo sinun riviäsi.'),
    ),
    choices: [
      { label: 'Niele se.', kind: 'comply', dd: 3, time: 15, do: (G) => G.note('Nielit sen. Kaikki nielivät. On merkillistä, kuinka nopeasti kaksisataa ihmistä voi päättää olleensa kärsivällisiä koko ajan.'), next: 'cabin2' },
      { label: 'Katso ympärillesi. Katso, kuka muu vastusti.', time: 15, do: (G) => { G.nerves(-2); G.note('Neljät kasvot, ehkä viidet, yhä jäykkinä. Mies keittiön lähellä. Nainen, jolla on taapero. Painat heidät mieleesi niin kuin painaisit mieleen uloskäynnit.'); }, next: 'cabin2' },
      { label: 'Naura. Kerran.', kind: 'conflict', nd: 3, dd: -2, time: 15, do: (G) => G.note('Nauroit, kerran, ja joku kaksi riviä taaempana nauroi kanssasi, ja sitten lopetitte molemmat, koska purseri oli laskenut luurin hyvin hellävaraisesti ja katsoi käytävää pitkin.'), next: 'cabin2' },
    ],
  };

  scenes.cabin2 = {
    art: 'cabin',
    loc: 'Laskeutumassa · Pohjois-Atlantti',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      (G.has('met31c') ? 'Mies paikalla 31C sanoo hiljaa: ' : 'Mies paikalla 31C, joka ei ole sanonut sanaakaan Heathrow\'n jälkeen, sanoo: ') + V('"Eivät ne oikeasti voi tehdä niin. Voivatko?"'),
      'Hän tarkoittaa koneesta poistamista. Hän katsoo sinua ikään kuin sinä saattaisit tietää.',
      'Käytävällä purseri kävelee hitaasti kohti perää lukien istuinnumeroita paneeleista niin kuin ihminen lukee listaa, jonka on itse kirjoittanut.',
    ),
    choices: [
      { label: '"En usko, että voivat, ei."', dd: -4, nd: -2, time: 45, do: (G) => { G.collect(1); G.flag('ally31c'); G.note('Hän nyökkäsi eikä näyttänyt rauhoittuneelta, etkä ollut varma, olitko ollut rauhoittava. Mutta nyt teitä oli kaksi.'); }, next: 'cabin3' },
      { label: '"En rehellisesti tiedä."', dd: -1, time: 45, do: (G) => { G.flag('ally31c'); G.note('Hän nyökkäsi. ' + V('"Niin. En minäkään."') + ' Katsoitte istuimen karttaa yhdessä. Pieni lentokone oli sen reunalla.'); }, next: 'cabin3' },
      { label: 'Laita kuulokkeet korviin.', kind: 'comply', dd: 5, nd: -2, time: 45, do: (G) => { G.nerves(2); G.note('Laitoit kuulokkeet korviin. Mitään ei soinut. Jätit ne paikoilleen. Kun nostit katseesi, purseri oli rivisi kohdalla katsomatta sinua, ja sitten hän oli mennyt ohi.'); }, next: 'cabin3' },
      { label: 'Paina kutsunappia ja kysy uudelleen.', kind: 'conflict', nd: 5, dd: 2, time: 45, do: (G) => { G.nerves(4); G.flag('asked_crew'); G.note('Nappi syttyi. Kukaan ei tullut. Hetken päästä se sammui itsestään, ja purseri, kolme riviä edempänä, kääntyi ja katsoi paneelia pääsi yläpuolella, ja sitten sinua.'); }, next: 'cabin3' },
    ],
  };

  scenes.cabin3 = {
    art: 'cabin',
    loc: 'Loppulähestyminen · Keflavík',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      'Purseri taas, luurissa. ' + V('"Laskeutumisen jälkeen pysykää istuimillanne turvavyöt kiinnitettyinä, kunnes ensihoitohenkilöstö on huolehtinut asiakkaastamme etumatkustamossa. Ilmoitan, kun voitte nousta. Minä ilmoitan."'),
      'Sadetta ikkunoissa. Alhaalla rannikko kuin jotain raavittua. Kaupungin valot, joka ei ole Reykjavík, ja sitten ei valoja.',
      'Et ole koskaan laskeutunut minnekään yöllä niin, ettet nähnyt kiitotietä ennen kuin se oli allasi.',
    ),
    choices: [
      { label: 'Katso ulos ikkunasta.', dd: 5, nd: 3, dreadMax: 90, time: 25, do: (G) => { G.nerves(3); G.note('Sinisiä valoja, sitten oransseja, sitten sinisiä. Ambulanssi ovet auki märällä asfaltilla, ja sen vieressä – ei lähellä, vieressä – tummansiniseen univormuun pukeutunut mies seisomassa hyvin suorana. Ääni käytävältä, lähellä korvaasi: ' + V('"Kaihdin alas, kiitos."')); }, next: 'ground' },
      { label: 'Pidä katse istuimen kartassa.', kind: 'comply', dd: 4, time: 25, do: (G) => G.note('Pieni lentokone ylitti kartan reunan eikä ollut hetkeen millään kartalla. Sitten näyttö pimeni ja näytti sinulle omat kasvosi.'), next: 'ground' },
      { label: 'Laske rivit lähimmälle uloskäynnille. Kahdesti.', nd: -2, time: 25, do: (G) => { G.nerves(-2); G.note('Kuusi riviä. Kuusi riviä. Se on sellaista tietoa, josta on hyötyä vain jos jotain tapahtuu, ja olet alkanut toivoa, että jotain tapahtuisi.'); }, next: 'ground' },
    ],
  };

  scenes.ground = {
    art: 'cabin',
    loc: 'Keflavík · maassa · moottorit sammuksissa',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      'Kolmekymmentä minuuttia maassa. Ensihoitajat ovat tulleet ja menneet, tai eivät ole tulleet. Kukaan ei ole sanonut. Turvavyövalo palaa yhä. Purseri seisoo matkustamon etuosassa kädet ristissä ja katsoo käytävää pitkin teitä kaikkia, kärsivällisesti, kuin olisitte jono.',
      'Mies paikalla 31C, hiljaa: ' + V('"En usko, että me olemme menossa LA:han."'),
    ),
    choices: [
      { label: 'Nouse seisomaan. Ihan vain venytelläksesi.', kind: 'conflict', nd: 6, dd: -3, dreadMax: 75, time: 15, do: (G) => { G.nerves(4); G.flag('stood'); G.dread(4); G.note(V('"Istukaa alas, kiitos."') + ' Ei kovaa. Hänen ei tarvinnut puhua kovaa. Kaksisataa ihmistä katsoi, kun istuit alas.'); }, next: 'landing' },
      { label: 'Pysy istumassa. Katso, kuinka purseri katsoo sinua.', kind: 'comply', dd: 5, time: 15, do: (G) => G.note('Hän katsoi jokaista riviä vuorollaan, ja kun hän tuli sinun rivillesi, hän ei pysähtynyt, eikä hän myöskään ollut pysähtymättä.'), next: 'landing' },
      { label: 'Kysy 31C:ltä, mitä hän luulee nyt tapahtuvan.', nd: -2, time: 15, do: (G) => { G.collect(G.has('ally31c') ? 0 : 1); G.flag('ally31c'); G.note(V('"Hotelli, kai. Tai ne jättävät meidät tänne."') + ' Hän nauroi, mietti sitten asiaa ja lopetti.'); }, next: 'landing' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 01:10 deplaning */
  scenes.landing = {
    art: 'terminal',
    loc: 'Keflavíkin kansainvälinen lentoasema · Saapuvat',
    enter: (G) => {
      atLeast(G, 30);
      if (G.once('landing_msgs')) {
        G.msg('email', {
          from: 'Albion Atlantic Customer Care', subj: 'Majoituksesi yöksi',
          body: `Hyvä asiakas,\n\nOperatiivisen uudelleenreitityksen vuoksi lentosi AB 0271 on viivästynyt yön yli. Olemme järjestäneet sinulle majoituksen.\n\nVahvista huoneesi alla olevasta linkistä:\n\n<a href="#" onclick="return false">Heathrow Renaissance Lodge — Bath Road, Hounslow TW6</a>\n\nKuljetus majoitukseesi järjestetään.\n\nPahoittelemme aiheutunutta vaivaa. Teemme parhaamme.`,
          actions: [{ label: 'Avaa varaussivu', if: (G) => !G.has('at_hotel') && !G.has('booked'), next: 'heathrow' }],
        });
        G.bot('Hei! Olen Ally, Albion Atlanticin virtuaaliavustaja. Näen, että lentosi AB 0271 on aikataulussa. Kuinka voin auttaa? ✈️');
      }
    },
    text: (G) => p(
      G.last(),
      'Turvavyövalo sammuu ilman kuulutusta. Se on kuulutus. Terminaali on valaistu kuin jääkaapin sisus. Muutama sata teistä laahustaa koneesta sinne, ohi huomioliiviin pukeutuneen miehen, joka ei katso ketään.',
      G.has('objected') && W('Ulos mennessäsi purseri katsoi sinua hieman liian kauan.'),
      'Passintarkastus. Pitkä jono. Sitten miehistö kävelee sen ohi – kaikki, jonossa, pyörälaukut samassa tahdissa, katsomatta oikealle tai vasemmalle – ovesta, jossa lukee STAFF. Ovi ei niinkään sulkeudu heidän takanaan kuin lakkaa olemasta ovi.',
      'Jono katsoo, kun tämä tapahtuu. Kukaan ei sano mitään. Puhelimesi värähtää.',
    ),
    choices: [
      { label: 'Lue sähköposti. Seuraa linkkiä.', kind: 'comply', dd: 8, sub: 'Majoitus. Vihdoin.', next: 'heathrow' },
      { label: 'Kirjoita chatbotille yhä kiireellisemmin.', kind: 'comply', dd: 4, nd: 4, time: 10, do: (G) => { G.nerves(4); G.bot('Voin auttaa siinä! Lentosi AB 0271 on tällä hetkellä aikataulussa. Jotain muuta? 😊'); G.note('Ally sanoo, että lento on aikataulussa. Katsot konetta ikkunan läpi. Sen valot ovat sammuksissa.'); }, next: 'hall' },
      { label: 'Etsi ihminen. Kuka tahansa ihminen.', dd: -4, dreadMax: 85, time: 10, next: 'icelander' },
      { label: 'Odota. Joku tekee kohta kuulutuksen.', kind: 'comply', dd: 8, sub: 'Joku tekee aina.', time: 20, next: 'wait1' },
    ],
  };

  scenes.heathrow = {
    art: 'terminal',
    loc: 'Varaussivu · Heathrow Renaissance Lodge',
    text: p(
      'Sivu latautuu hitaasti ja sitten kerralla. Kuva sängystä. Kuva aamiaisesta. <em>Bath Road, Hounslow, TW6.</em> Kaksitoista minuuttia terminaalista 5 ilmaisella sukkulabussilla.',
      'Olet 1 900 kilometrin päässä terminaalista 5.',
      'Siinä on iso painike. Siinä lukee VAHVISTA. Sen alla, pienemmällä: <em>Kuljetus majoitukseesi järjestetään.</em>',
    ),
    choices: [
      { label: 'Vahvista.', kind: 'comply', dd: 10, sub: 'He sanoivat, että kuljetus järjestetään.', time: 5, do: (G) => { G.flag('booked'); G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Varaus vahvistettu — autosi odottaa', body: 'Majoituksesi on vahvistettu.\n\nKuljettaja odottaa sinua saapuvien ulkopuolella. Etsi Albion Atlanticin vaakunaa.\n\nArvioitu matka-aika: —:—' }); }, next: 'car' },
      { label: 'Sulje se. Olet Islannissa.', dd: -3, dreadMax: 90, time: 5, do: (G) => { G.nerves(2); G.note('Suljit varaussivun. Sähköposti on yhä siellä, logoineen, kärsivällisenä.'); }, next: 'hall' },
    ],
  };

  scenes.car = {
    art: 'stand',
    loc: 'Keflavík · Saapuvien ulkopuolella',
    text: p(
      'Auto siellä tosiaan on. Musta, pitkä, tahraton, pieni kultainen vaakuna ovessa. Kuljettaja pitelee tablettia, jossa on nimesi – nimesi, oikein kirjoitettuna, mihin lentoyhtiö ei ole tähän mennessä kertaakaan pystynyt.',
      V('"Renaissanceen?"'),
      'Hän avaa takaoven. Lämmintä ilmaa. Nahkaa. Parkkipaikan takana tie katoaa pimeyteen, jolla ei näytä olevan loppua.',
    ),
    choices: [
      { label: 'Nouse kyytiin.', kind: 'comply', sub: 'Lämmintä.', do: (G) => G.end('accommodated') },
      { label: 'Ei. Ei kiitos.', dd: 5, dreadMax: 85, time: 5, do: (G) => { G.nerves(5); G.dread(8); G.note('Kuljettaja ei vaikuttanut yllättyneeltä. Hän sulki oven, jäi paikoilleen ja oli siinä yhä, kun katsoit taaksesi ovilta.'); }, next: 'hall' },
    ],
  };

  scenes.icelander = {
    art: 'terminal',
    loc: 'Keflavík · Saapuvat',
    text: p(
      'Nainen univormussa, joka ei ole lentoyhtiön – lentokentän ehkä, tai tullin, tai vain ihminen, jolla on fleece ja siinä nimikyltti – seisoo ovien lähellä kädet selän takana.',
      'Hän kuuntelee sinua. Hän katsoo puhelintasi. Hän katsoo sähköpostia, jossa on logo.',
      V('"Älkää seuratko sähköposteja",') + ' hän sanoo ystävällisesti, sellaisen ihmisen äänellä, joka on sanonut sen tänä iltana neljäkymmentä kertaa. ' + V('"Busseja on."'),
      'Kysyt missä. Hän osoittaa, yleisluontoisesti, Islantia.',
    ),
    choices: [
      { label: 'Kiitä häntä. Mene etsimään bussit.', do: (G) => { G.flag('hint_icelander'); G.nerves(-4); G.note('"Busseja on", hän sanoi. Se on vankin lause, jonka kukaan on sanonut sinulle Grönlannin jälkeen.'); }, next: 'hall' },
    ],
  };

  scenes.wait1 = {
    art: 'terminal',
    loc: 'Keflavík · Saapuvat',
    text: (G) => p(
      'Kaksikymmentä minuuttia. Passintarkastuksen jono hupenee. Kukaan ei tee kuulutusta.',
      'Ihmiset, joiden kanssa lensit, ajelehtivat kaksin ja kolmisin kohti hallin perää, jossa on ovi, jossa ei lue yhtään mitään.',
      G.t >= T(1, 2, 0) && W('Hallin tämän pään valot ovat himmentyneet puoleen.'),
    ),
    choices: [
      { label: 'Odota vielä. Kuulutus tulee kyllä.', kind: 'comply', dd: 6, sub: 'Täällä on kuulutusjärjestelmä. Näet kaiuttimet.', time: 25, next: (G) => (G.t >= T(1, 2, 20) ? 'wait2' : 'wait1'), do: (G) => { G.nerves(8); G.dread(8); } },
      { label: 'Seuraa virtaa.', dreadMax: 90, time: 5, next: 'hall' },
    ],
  };

  scenes.wait2 = {
    art: 'terminal',
    loc: 'Keflavík · Saapuvat',
    text: p(
      'Halli on nyt tyhjä, lukuun ottamatta sinua, siivoojaa ja ääntä, jota katto pitää.',
      'Puhelimesi värähtää. Sähköposti. <em>Olemme järjestäneet teille bussit.</em> Se ei kerro minne. Se ei kerro milloin. Sen aikaleima on tunnin takaa.',
      'Takanasi valot himmenevät neljäsosaan.',
    ),
    enter: (G) => { atLeast(G, 45); if (G.once('coach_mail_w')) G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Jatkokuljetus järjestetty', stamp: G.t - 60, body: 'Hyvä asiakas,\n\nOlemme järjestäneet bussit kuljettamaan sinut majoitukseesi.\n\nSiirry busseille.\n\nTeemme parhaamme.' }); },
    choices: [
      { label: 'Siirry busseille.', kind: 'comply', time: 15, do: (G) => G.end('terminal') },
      { label: 'Juokse ovelle, jossa ei lue mitään.', nd: 5, dreadMax: 92, time: 5, do: (G) => { G.nerves(10); G.note('Juoksit. Kukaan ei estänyt. Ovi, jossa ei lukenut mitään, avautui kylmään ilmaan ja natriumvaloon ja, luojan kiitos, muihin ihmisiin.'); }, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 01:20 the hall (hub) */
  scenes.hall = {
    art: 'terminal',
    loc: 'Keflavík · Matkatavarahalli',
    enter: (G) => {
      if (G.t >= T(1, 2, 40)) { G.go('wait2'); return; }
      if (G.once('hall_intro')) G.note(p(
        'He eivät luovuta ruumaan menneitä laukkuja. Mies tiskin takana selittää tämän nostamatta katsettaan: laukut ovat <em>järjestelmässä</em>. Sinäkin olet oletettavasti järjestelmässä. Se ei ole auttanut kumpaakaan.',
        'Fleeceen pukeutunut mies kävelee luoksesi. ' + V('"Hei. Taitaa olla tulossa busseja? Tuolla? Kuulemma?"') + ' Hän osoittaa. Kukaan ei kuuluttanut tätä. Ei sähköpostia, ei tekstiviestiä, ei kaiutinta. Vain fleeceen pukeutunut mies.',
      ));
    },
    text: (G) => hub(G,
      `${G.clock(G.t)}. Saapuvien halli. Kaikki on kiinni. Sinulla ei ole laukkua, ei takkia, ei hammasharjaa, ja puhelimessa on ${G.battery()}%.`,
      'hall',
      G.t >= T(1, 2, 10) ? W('Halli tyhjenee. Sinun ei luultavasti kannata olla siellä viimeinen.') : ''),
    choices: [
      { label: 'Kysy laukustasi. Kohteliaasti.', kind: 'comply', dd: 2, nerveMax: 70, time: 8, once: 'bag_nice', do: (G) => { G.nerves(2); G.note('Mies tiskin takana sanoo, että laukut ovat järjestelmässä. Kysyt, missä järjestelmässä. Hän sanoo: järjestelmässä. Kysyt milloin. Hän sanoo: kun asia on ratkaistu. Hän ei ole nostanut katsettaan kertaakaan.'); }, next: 'hall' },
      { label: 'Vaadi laukkuasi. Hammastahnasi on siinä.', kind: 'conflict', nd: 8, sub: 'Jonkun se on tehtävä.', time: 10, once: 'bag', do: (G) => { G.strike(); G.note('Hän nostaa katseensa. Se on ainoa asia, joka muuttuu. ' + V('"Teen merkinnän."') + ' Hän tekee merkinnän.'); }, next: 'hall' },
      { label: 'Kävele suljettujen liikkeiden ohi.', dd: 3, time: 12, once: 'shops', do: (G) => { G.nerves(-1); G.dread(2); G.note('Tax-free: rullaovet alhaalla. Kahvila: tuolit pöydillä, kahvikone irti seinästä ja käännettynä seinään päin. Automaatti, joka hyväksyy vain islantilaiset kortit, täynnä tuotteita, joiden nimissä on ð-kirjain. Seisot sen edessä kauemmin kuin oli tarkoitus.'); }, next: 'hall' },
      { label: 'Kokeile STAFF-ovea.', dreadMax: 80, time: 6, once: 'staff', do: (G) => { G.dread(8); G.nerves(5); G.note('Lukossa. Kahva on lämmin, kuin joku olisi juuri pidellyt sitä. Painat korvasi oveen. Sen takana ei ole mitään. Ei hiljaisuutta – ei mitään. Kun astut taaksepäin, kyltissä lukee STAFF, ja sen alla, pienemmällä, mitä et ollut huomannut: ONLY.'); }, next: 'hall' },
      { label: 'Katso matkatavarahihnaa.', dd: 3, time: 8, once: 'carousel', do: (G) => { G.dread(4); G.note('Se pyörii. Yksi laukku kiertää. Se ei ole sinun. Siinä on tummansininen lappu, jossa on kultainen vaakuna. Se kiertää uudestaan, sitten hihna pysähtyy, laukku on poissa, ja hihna on tyhjä tavalla, joka vihjaa, että se on aina ollut tyhjä.'); }, next: 'hall' },
      { label: 'Puhu fleecemiehelle.', nd: -3, dd: -3, nerveMax: 90, time: 8, once: 'talk_fleece', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_hearsay'); G.note(V('"Joku puhui busseista. Joku liivissä. Ei heikäläinen."') + ' Hän katsoo sähköpostia puhelimestasi. ' + V('"Joo, sain saman. Minä en mene Heathrow\'hun."')); }, next: 'hall' },
      { label: 'Puhu naiselle, jolla on taapero.', nd: -2, dd: -3, nerveMax: 80, time: 8, once: 'talk_mother', do: (G) => { G.collect(1); G.nerves(-2); G.flag('hint_hearsay'); G.msg('sms', { from: '+354 ··· ····', body: 'älä nouse siihen kivaan' }); G.note('Taapero nukkuu hänen olkapäällään tavalla, joka vihjaa olkapään olevan kantava rakenne. ' + V('"Huomioliivimies sanoi minulle: ei siihen kivaan. En tiedä mitä se tarkoittaa. Menen sillä."') + ' Hänen sanoessaan sen puhelimesi värähtää: tekstiviesti numerosta, jota et tunne.'); }, next: 'hall' },
      { label: 'Etsi mies paikalta 31C.', nd: -3, dd: -3, nerveMax: 95, time: 8, once: 'talk_31c', if: (G) => G.has('ally31c'), do: (G) => { G.collect(1); G.nerves(-3); G.note('Hän on ovien luona katsomassa ulos pimeään. ' + V('"Eli busseja on",') + ' hän sanoo. ' + V('"Hienoa. Kenen?"') + ' Kumpikaan ei tiedä. Päätätte, sanomatta sitä ääneen, nousta samaan.'); }, next: 'hall' },
      { label: 'Puhu vanhemmalle pariskunnalle ikkunan luona.', nd: -2, dd: -2, nerveMax: 75, time: 8, once: 'talk_couple', do: (G) => { G.collect(1); G.nerves(-2); G.note('He ovat lentäneet paljon eivätkä ole huolissaan, he sanovat, huolestuneiden ihmisten äänellä. ' + V('"Se on lopulta joku tuloste",') + ' hän sanoo. ' + V('"Se on aina lopulta joku tuloste."')); }, next: 'hall' },
      { label: 'Mene vessaan. Olet pidätellyt Grönlannista asti.', nd: -3, time: 12, once: 'loo', do: (G) => { G.flag('bathroom'); G.nerves(-2); G.note('Jonkinlainen helpotus. Kun tulet ulos, halli on järjestäytynyt uudelleen: samat ihmiset eri paikoissa, kaikki kääntyneinä samaa ovea kohti.'); }, next: 'hall' },
      { label: 'Mene sinne, minne fleece osoitti.', dd: -2, time: 5, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~02:00 bus stand 1 */
  scenes.buses1 = {
    art: 'stand',
    loc: 'Keflavík · Bussipysäkki · ulkona',
    text: (G) => p(
      'Ulkona on kaksi astetta, ja tuuli on tullut pitkän matkan sinua vastaan. Kolme bussia käy tyhjäkäynnillä natriumlamppujen alla. Kanssamatkustajasi liikkuvat niitä kohti sillä löyhällä, epävarmalla tavalla, jolla liikkuvat ihmiset, joille ei ole kerrottu mitään.',
      G.has('bathroom') ? 'Olet myöhässä. Suurin osa väestä on jo noussut johonkin. Ovet alkavat sulkeutua.' : 'Kukaan ei tarkasta lippuja. Kukaan ei tarkasta mitään.',
      G.has('hint_hearsay') && W('"Ei siihen kivaan."'),
      W('Katso ennen kuin nouset kyytiin. Katsominen maksaa muutaman minuutin. Kyytiin nouseminen maksaa enemmän.'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: G.pick(['#c7c3b6', '#b8b4a6', '#8d8a80']), windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'night' },
        name: G.pick(['Valkoinen bussi ilman minkäänlaisia tunnuksia', 'Luonnonvalkoinen bussi, jonka sivupeili on haljennut', 'Harmaa bussi, jonka ovesta irtoaa vuokraamon tarra']),
        sign: G.pick(['ALBION ATL → HOTEL', 'AB0271  HOTEL', 'FLIGHT PPL – HOTEL']), signStyle: 'paper',
        look: ['Kuljettaja huomioliivissä, syömässä voileipää. Hän kohauttaa olkiaan, kun katsot häntä.', G.has('bathroom') ? 'Moottori käynnissä. Ovi alkaa sulkeutua.' : 'Moottori käynnissä. Ovi auki.'],
        hidden: ['Fleecemies istuu kolmannella rivillä. Taapero nukkuu jonkun sylissä.', 'Kaikilla kyydissä on samat vaatteet kuin koneessa, ja se näkyy.'],
        boardLabel: G.has('bathroom') ? 'Juokse' : 'Nouse kyytiin',
        board: { time: 5, do: (G) => { if (G.has('bathroom')) G.nerves(6); G.flag('bus1_ok'); }, next: 'ride' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'night' },
        name: 'Tummansininen bussi, jonka kyljessä on kultainen vaakuna',
        sign: 'ALBION ATLANTIC WELCOMES YOU', signStyle: 'led',
        look: ['Kuljettajalla on purserin univormu. Hän hymyilee nimenomaan sinulle.', 'Sisävalot kirkkaat ja lämpimät. Paljon vapaita paikkoja.'],
        hidden: ['Matkustajat ovat levänneitä. Silitetyt paidat. Jollakulla on tuore hiustenleikkuu.', 'Et tunnista ainoatakaan kasvoa. Lensit näiden ihmisten kanssa yhdeksän tuntia.', 'Hänen nimikylttinsä on tyhjä.'],
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const flybus = {
        key: 'city',
        art: { livery: '#cfae36', windows: 'dim', passengers: 'luggage', sign: 'print', driver: 'plain', ground: 'night' },
        name: 'Keltainen kaupungin väreihin maalattu bussi',
        sign: 'FLYBUS · REYKJAVÍK BSÍ', signStyle: 'print',
        look: ['Kuljettaja, kyllästynyt, selailee tablettia.', 'Matkustajilla on reppuja ja pyörällisiä laukkuja.'],
        hidden: ['Heillä on matkatavaroita. Sinulla ei ole matkatavaroita.', 'Tarra oven vieressä: LIPPU VAADITAAN.'],
        board: { time: 5, next: 'detour' },
      };
      return G.shuffle([correct, crest, flybus]);
    },
    choices: [
      { label: 'Älä nouse mihinkään. Sähköpostissa sanottiin bussit. Odota ohjeita.', kind: 'comply', dd: 10, sub: 'He sanoivat bussit. Nämä eivät välttämättä ole ne bussit.', time: 35, next: 'wait2' },
    ],
  };

  scenes.detour = {
    art: 'road',
    loc: 'Tie 41 · kohti Reykjavíkia',
    text: p(
      'Neljäkymmentä minuuttia matkaa, ja reppureissaaja kysyy, missä hostellissa olet, ja ymmärrät.',
      'Bussi jättää sinut kaupungin terminaaliin, joka haisee dieseliltä ja kanelilta. Taksikuski säälii sinua, ja 9 800 kruunua, ja ajaa sinut takaisin pimeään hotelliin, jolle on kerrottu odottaa sinua ja joka ei ole varma, uskooko sitä.',
      'Kello on 03:35. Sinulla on vaatteet, jotka ovat päälläsi. Eivät edes ne hyvät.',
    ),
    enter: (G) => { G.S.t = T(1, 3, 35); G.nerves(18); G.flag('detoured'); G.dread(8); },
    choices: [{ label: 'Mene sisään.', next: 'hotel_arrive' }],
  };

  /* ---------------------------------------------------------------- the ride */
  scenes.ride = {
    art: 'road',
    loc: 'Tie · jossain Reykjanesin niemimaalla',
    enter: (G) => {
      G.dread(4);
      if (G.once('coach_mail')) G.at(G.t + 30, 'email', { from: 'Albion Atlantic Customer Care', subj: 'Jatkokuljetus järjestetty', body: 'Hyvä asiakas,\n\nOlemme järjestäneet bussit kuljettamaan sinut majoitukseesi. Siirry busseille.\n\nJos tarvitset apua bussien löytämisessä, ota meihin yhteyttä.\n\nTeemme parhaamme.' });
      if (G.once('coach_txt')) G.at(G.t + 45, 'sms', { from: 'AlbionATL', body: 'AB0271: Hotellisi on HEATHROW RENAISSANCE LODGE. Älä vastaa tähän viestiin.' });
    },
    text: (G) => p(
      'Bussi ajaa viimeisten valojen ohi, ja sitten se jatkaa.',
      'Laavakenttiä matalan taivaan alla. Ei kaupunkeja. Ei kylttejä, joita osaisit lukea. Et tiedä, kuka on ottanut sinut tai minne olet menossa. Sinut on joko otettu hellästi EU:n sääntelykehyksen syliin, tai sinut on kidnapattu yhdessä bussillisen uupuneita ihmisiä kanssa, jotka ovat liian kohteliaita kysyäkseen.',
      G.has('coffee') && W('Sydämesi tekee jotain. Se on kahvi. Se on varmasti kahvi.'),
      'Matka on pitkä. Siitä on alkanut tulla huolestuttavan pitkä matka.',
      'Takaa kaksivuotias huokaisee: ' + V('"Mikä päivä."'),
    ),
    choices: [
      { label: 'Naura. Kaikki nauravat. Kohteliaasti ja hieman paniikissa.', nd: -6, dd: -4, nerveMax: 85, time: 50, do: (G) => { G.nerves(-5); G.collect(1); }, next: 'hotel_arrive' },
      { label: 'Pysy hiljaa. Katso pimeyttä.', kind: 'comply', dd: 4, time: 50, do: (G) => G.nerves(3), next: 'hotel_arrive' },
      { label: 'Mene eteen. Kysy kuljettajalta, minne tämä bussi on menossa.', kind: 'conflict', nd: 5, dd: 3, time: 50, do: (G) => { G.nerves(6); G.flag('asked_driver'); }, next: 'hotel_arrive' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~03:00 the hotel */
  scenes.hotel_arrive = {
    art: 'lobby',
    loc: 'Hótel Hraun · Vastaanotto',
    enter: (G) => {
      G.flag('at_hotel'); atLeast(G, 38);
      if (G.once('hotel_paper')) G.msg('paper', { from: 'Teipattu vastaanottotiskiin', subj: 'Tulostettu kyltti', body: '<b>PASSENGERS ALBION ATLANTIC AB0271</b>\n\nBUS TO AIRPORT: <b>11:00</b>\n\nPlease wait in lobby.\n\n(No delivery service until 11:00 am)' });
      if (G.once('hotel_bot')) { G.at(T(1, 3, 50), 'chat', { body: 'Onko huoneessasi mukavaa? 🙂' }); G.at(T(1, 4, 15), 'chat', { body: 'Bussisi lähtee klo 04:30. Henkilökunnan jäsen koputtaa oveesi.' }); }
    },
    text: (G) => p(
      G.has('asked_driver') && W('Kuljettaja ei koskaan vastannut. Radiosta tuli jotain islanniksi, joka saattoi olla säätiedotus.'),
      'Hotelli, siis. Matala, leveä, sellainen paikka, joka on rakennettu konferensseja varten, jotka eivät koskaan tulleet. Yövirkailija jakaa avainkortteja kenkälaatikosta. Sinun korttisi sanoo 214.',
      'Ei, heillä ei ole hammastahnaa. Ei, heillä ei ole hammasharjoja. Mikään ei toimita tänne ennen huomisaamun yhtätoista. On myyntiautomaatti. Virkailija sanoo tämän kuin nainen, joka ojentaa sinulle pelastuslautan.',
      'Tiskiin on teipattu A4-arkki, Arial-fontilla, hieman vesitahrainen. Siinä lukee, että bussi lentokentälle lähtee 11:00. Se on koko yön ensimmäinen tieto, jossa on kellonaika eikä logoa.',
    ),
    choices: [{ label: 'Mene huoneeseen.', time: 8, next: 'room' }],
  };

  /* ---- the room (hub) ---- */
  const roomStatus = (G) => `Huone 214. ${G.clock(G.t)}. Olet liian väsynyt nukkumaan${G.has('toothpaste') ? '' : ', ja hampaasi ovat likaiset'}${G.has('dinner') ? '' : ', etkä ole syönyt'}.`;

  scenes.room = {
    art: 'room',
    loc: 'Hótel Hraun · Room 214',
    enter: (G) => {
      G.flag('loc_room');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('room_intro')) G.note('Sänky, vedenkeitin, televisio, ikkuna parkkipaikalle, ja pikkuruiset shampoo- ja hoitoainepullot, joilla harkitset jo hampaidesi pesemistä. Ovessa on ketju. Laitat ketjun kiinni. Sitten otat sen irti, varmuuden vuoksi, ja laitat sen taas kiinni.');
    },
    text: (G) => hub(G, roomStatus(G), 'room'),
    choices: (G) => [
      { label: 'Syö. Sipsejä ja kaksi pikkupulloa viiniä.', nerveMax: 90, sub: 'Tyttöjen illallinen.', if: (G) => G.has('crisps') && !G.has('dinner'), time: 12, do: (G) => { G.flag('dinner'); G.nerves(-10); G.note('Suolaa, sitten viiniä, sitten suolaa. Syöt sängyn reunalla istuen pussi molemmissa käsissä kuin jokin, joka voisi karata. Se on paras ateria kahteenkymmeneen tuntiin, ja myös ainoa.'); }, next: 'room' },
      { label: 'Tuijota pikkushampoita ja harkitse hampaiden pesua niillä.', time: 4, do: (G) => { const n = G.count('shampoo'); G.nerves(n === 1 ? -1 : 1); G.note(n === 1 ? 'Shampoo. Hoitoaine. Vartalovoide. Luet ainesosat. Natriumlauryylieetterisulfaatti on teknisesti pinta-aktiivinen aine. Lasket sen alas. Otat sen käteen. Lasket sen alas.' : n === 2 ? 'Olet ollut täällä ennenkin. Shampoo ei ole muuttanut mieltään, etkä sinäkään.' : 'Pienet pullot ovat rivissä hyllyllä ja katsovat sinua. Yksi niistä on siirtynyt. Sinä siirsit sen. Luultavasti sinä siirsit sen.'); }, next: 'room' },
      { label: 'Käy suihkussa. Pue samat vaatteet takaisin päälle.', nerveMax: 95, time: 20, once: 'shower', do: (G) => { G.nerves(-6); G.note('Kuumaa vettä, ainakin. Islannissa on erinomaista kuumaa vettä; se haisee hieman kananmunalta eikä lopu koskaan. Seisot siinä, kunnes tunnet olevasi ihminen, ja sitten puet lentokoneen takaisin päälle: housut, paidan, sukat, kaikki hieman lämpimämpinä kuin sinä.'); }, next: 'room' },
      { label: 'Laita televisio päälle.', kind: 'comply', dd: 2, time: 6, do: (G) => { const d = G.D, n = G.count('tv'); G.dread(1); G.note(d >= 5 ? 'Kanava 1: parkkipaikka. Sinun parkkipaikkasi, ylhäältä, harmaana. Bussi siellä. Hahmo bussin vieressä. Sammutat television. Näyttö näyttää huoneen, ylhäältä, harmaana.' : d >= 4 ? 'Säätiedotus, islanniksi, ikuisesti. Sitten kanava, joka on kiinteä kamera parkkipaikalla. Olet melko varma, että se ei ole tämä parkkipaikka. Siellä on bussi.' : n === 1 ? 'Säätiedotus, islanniksi. Saaren kartta täynnä pieniä vihaisia nuolia. Sitten pysäytyskuva hotellista puhelinnumeroineen. Sitten säätiedotus.' : 'Olet nähnyt tämän sään. Se ei ole muuttunut. Nuolet ovat yhä vihaisia. Hotelli on yhä näytöllä puhelinnumeroineen, ikään kuin haluaisit soittaa sinne sen sisältä.'); }, next: 'room' },
      { label: 'Katso ulos ikkunasta.', dd: 2, dreadMax: 85, time: 3, do: (G) => { const d = G.D, n = G.count('win'); G.dread(2); if (d >= 4) G.flag('looked1'); G.nerves(d >= 4 ? 7 : 2); G.note(d >= 5 ? 'Bussi on nyt suoraan allasi. Sisävalot palavat. Kaikki sisällä kasvot hotelliin päin, suorassa, liikkumatta. Ja oven vieressä, kädet ristissä, tummansininen mies, katse ylhäällä. Ei hotellissa. Sinun ikkunassasi. Päästät verhosta irti. Et muista vetäneesi sitä.' : d >= 4 ? 'Bussi seisoo parkkipaikan perällä moottori käynnissä ja kaikki sisävalot palaen. Se on täynnä. Kukaan sisällä ei liiku. Et näe ketään oven luona, ja sitten näet.' : n === 1 ? 'Parkkipaikka. Yksi lyhty. Soraa, tuulta, ja lyhdyn takana pimeys, joka jatkuu hyvin kauas. Ei bussia. Helpotut, ja sitten mietit, miksi odotit sellaista.' : 'Parkkipaikka. Lyhty. Ajovalopari tiellä, hidastaa, ei käänny. Omat kasvosi kaiken sen päällä, kalpeina, eilisessä paidassa.'); }, next: 'room' },
      { label: 'Keitä teetä pikkupusseista.', nerveMax: 90, time: 8, once: 'tea', do: (G) => { G.nerves(-5); G.note('Vedenkeitin kestää kauan ja pitää ääntä kuin pieni lentokone. Teetä, UHT-maitoa sormustimesta. Pitelet kuppia molemmin käsin. Se on ensimmäinen lämmin asia, joka ei ole ollut valhe.'); }, next: 'room' },
      { label: 'Tarkista ovi.', nd: 2, time: 2, do: (G) => { const n = G.count('door'); G.note(n === 1 ? 'Lukossa. Ketju kiinni. Tarkistat ketjun. Tarkistat lukon. Hyvä.' : n === 2 ? 'Yhä lukossa. Yhä ketjussa. Tiesit sen.' : n === 3 ? 'Tarkistat oven taas. Tiedostat tarkistavasi oven taas. Se on lukossa. Se on aina ollut lukossa. Seisot käsi ovella jonkin aikaa.' : 'Lukossa. Et enää tiedä, mitä tarkistat. Onko se lukossa, vai onko se yhä ovi.'); if (n >= 3) G.dread(1); }, next: 'room' },
      { label: 'Kuuntele ovella.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(3); G.note(G.pick(d >= 4 ? ['Askelia. Hitaita, tasaisia, pysähtyvät joka ovelle. Pysähtyvät sinun ovellesi. Jatkavat.', 'Kärry, pyörillä, käytävän päässä. Se pysähtyy. Se ei lähde uudelleen liikkeelle.', 'Koputusta, kaukana käytävällä. Kärsivällistä. Sitten lähempänä.'] : ['Ei mitään. Käytävän hurina. Ovi, kaukana, sulkeutuu.', 'Joku kävelee ohi, nopeasti, sukkasillaan. Joku toinen, hitaasti, kengissä.', 'Jääpalakone jauhaa käytävän päässä. Sitten nauru, yhden oven päässä, katkaistuna kesken.'])); }, next: 'room' },
      { label: 'Soita vastaanottoon huoneen puhelimesta.', kind: 'comply', dd: 1, time: 5, once: 'roomphone', do: (G) => { G.dread(2); G.note('Se soi pitkään. Sitten virkailija, kuulostaen siltä kuin olisi nukkunut tai ei olisi koskaan nukkunut: ' + V('"Niin, 214?"') + ' Et ollut sanonut huoneesi numeroa. Kysyt bussista. ' + V('"Yksitoista. Siinä lukee yksitoista. Ehkä sinun pitäisi nukkua."')); }, next: 'room' },
      { label: 'Selvitä oikeutesi.', dd: -6, dreadMax: 85, sub: 'On olemassa asetus. Joku maininnoissasi on varma siitä.', time: 15, once: 'rights', do: (G) => { G.flag('uk261'); G.nerves(-6); G.msg('paper', { from: 'Kuvakaappaus, sitten QR-koodi, jonka teit itse', subj: 'UK261', body: '<b>UK261 / EY261 — OIKEUTESI</b>\n\nNäin pitkässä viivästyksessä lentoyhtiön on tarjottava: ateriat, hotelli, kuljetus ja viestintämahdollisuudet.\n\nHe taistelevat vastaan. Vaadi silti.\n\n[ QR-KOODI ]' }); G.note('UK261. <em>Lentoyhtiön on tarjottava.</em> Luet sen kahdesti. Teet siitä QR-koodin, hotellin wifissä, kello kolme aamuyöllä, etkä tiedä miksi, paitsi että aiot näyttää sen kaikille, jotka näet aamiaisella.'); }, next: 'room' },
      { label: 'Postaa siitä.', time: 8, once: 'post', do: (G) => { if (G.D >= 4) { G.nerves(4); G.note('Kirjoitat kaiken – miehistön, oven, sähköpostin, bussin – ja painat julkaise, ja pieni rengas pyörii, ja pyörii. Yksi palkki. Ei palkkeja. Postaus jää siihen, lähettämättä, osoitettuna ei kenellekään.'); } else { G.nerves(-3); G.note('Postaat sen. Lol, kirjoitat. Lmao. Kymmenessä minuutissa: 1,4 tuhatta tykkäystä ja neljäkymmentä ihmistä kertomassa kuumista lähteistä. Laitat puhelimen näyttö alaspäin peitolle.'); } }, next: 'room' },
      { label: 'Lataa puhelin.', nd: 2, time: 2, once: 'charge', do: (G) => { G.nerves(3); G.note(`Laturi on laukussa. Laukku on järjestelmässä. Puhelimessa on ${G.battery()} %, ja se tietää sen, ja himmentää näytön kertoakseen sen sinulle.`); }, next: 'room' },
      { label: 'Yritä nukkua.', nerveMax: 80, time: 25, do: (G) => { if (G.t + 25 >= T(1, 4, 5)) { G.S.t = Math.max(G.t, KNOCK_AT - 25); G.note('Makaat lentokonevaatteissa valo päällä. Katto on hyvin lähellä. Olet melkein, melkein—'); } else { G.nerves(-3); G.note(G.pick(['Makaat. Kehosi on Tyynenmeren ajassa, tai ei missään ajassa. Katossa on saaren muotoinen tahra. Katsot sitä jonkin aikaa. Ei mitään.', 'Silmät kiinni. Bussin – jonkin bussin – moottori jossain ikkunan alla, tai korvissasi. Nouset takaisin istumaan.', 'Ryömit peiton alle vaatteet päällä. Se on kuin olisi paketti. Uni katsoo sinua huoneen toisesta päästä eikä tule luoksesi.'])); } }, next: 'room' },
      { label: 'Mene ulos käytävälle.', time: 2, next: 'corridor' },
    ],
  };

  /* ---- the corridor (hub) ---- */
  scenes.corridor = {
    art: 'corridor',
    loc: 'Hótel Hraun · Toisen kerroksen käytävä',
    enter: (G) => {
      G.flag('loc_corridor');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('corridor_knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('corr_intro')) G.note('Pitkä, matala, matoitettu jollain mustelmanvärisellä. Ovia: 210, 212, 214 – sinun – 216, 218, aina palo-ovelle asti, jossa on tanko ja lankalasi-ikkuna. Jääpalakone hurisee käytävän päässä. Hissi, jossa on paperilappu.');
    },
    text: (G) => hub(G, `Käytävä. ${G.clock(G.t)}. Joka ovi on kiinni. Sinun ovesi on se, jonka alla palaa valo.`, 'corridor'),
    choices: (G) => [
      { label: 'Jääpalakone.', nd: 2, dd: 1, time: 5, do: (G) => { const n = G.count('ice'); G.note(n === 1 ? 'Se karjuu. Jäätä, valtavasti jäätä, ämpäriin, jota et tuonut. Seisot kourallinen jäätä kädessäsi. Et halunnut jäätä. Et tiedä, mitä halusit.' : n === 2 ? 'Se karjuu taas, sinulle, kuin se olisi odottanut. Edellinen jää ei ole sulanut. Et ole varma, pitäisikö jään käyttäytyä noin lämmitetyllä käytävällä.' : 'Tällä kertaa et laita kättäsi sisään. Kuuntelet sen jauhamista. Jauhamisen alla, jostain alhaalta, moottori.'); if (n >= 2) G.dread(1); }, next: 'corridor' },
      { label: 'Koputa oveen 216. Fleecemiehen huone.', time: 5, do: (G) => { const n = G.count('k216'); if (n === 1) { G.collect(1); G.nerves(-4); G.note('Tauko, sitten ketju, sitten fleece. Hänkin on hereillä. Hänelläkin on vaatteet päällä. ' + V('"Hemmetti",') + ' hän sanoo, ja se kattaa kaiken. Olette samaa mieltä bussista. Yksitoista. Tuloste. Hän sanoo koputtavansa sinulle.'); } else if (n === 2) { G.nerves(3); G.dread(3); G.note('Ei vastausta. Oven alla palaa valo. Koputat uudelleen, tasaisesti, ja kuulet itsesi tekevän sen, ja lopetat.'); } else { G.nerves(8); G.dread(5); G.note('Ovi ei ole lukossa. Se heilahtaa auki. Huone on sijattu: lakana kireällä, pyyhkeet taiteltuina viuhkaksi, pikkushampoot rivissä. Kukaan ei ole ollut siellä. Kukaan ei ole koskaan ollut siellä. Hänen fleecensä on tuolilla.'); } }, next: 'corridor' },
      { label: 'Hissi.', kind: 'comply', dd: 2, time: 4, do: (G) => { const d = G.D; if (d >= 4) { G.flag('lift_open'); G.dread(3); G.nerves(5); G.note('Paperilapussa lukee EPÄKUNNOSSA, Arial-fontilla. Kun luet sen, hissi saapuu. Ovet avautuvat tyhjään, hyvin valaistuun koppiin, jonka perällä on peili, ja jäävät auki, ja odottavat. Kukaan ei kutsunut sitä.'); } else { G.note('EPÄKUNNOSSA, Arial-fontilla, teipattuna vinoon. Painat nappia silti. Jossain rakennuksessa jokin laskeutuu.'); } }, next: 'corridor' },
      { label: 'Mene hissiin.', kind: 'comply', if: (G) => G.has('lift_open'), do: (G) => G.end('lift') },
      { label: 'Lue seinällä oleva poistumissuunnitelma.', dd: -2, time: 3, once: 'fireplan', do: (G) => { G.msg('paper', { from: 'Ruuvattu käytävän seinään', subj: 'Poistumissuunnitelma', body: '<b>EVACUATION PLAN · 2ND FLOOR</b>\n\nIn case of alarm, proceed by stairs to\n<b>ASSEMBLY POINT: CAR PARK</b>\n\nDo not use the lift.\nDo not return for belongings.\n\nYOU ARE HERE ●' }); G.note('OLET TÄSSÄ. Punainen piste, huoneen 214 kohdalla. Joku on piirtänyt siitä kuulakärkikynällä pienen nuolen parkkipaikalle päin ja kirjoittanut, toisella käsialalla: <em>bussi</em>.'); }, next: 'corridor' },
      { label: 'Palo-ovi ja portaat. Alas parkkipaikalle.', dreadMax: 92, time: 4, next: 'carpark' },
      { label: 'Alas aulaan.', time: 3, next: 'lobby' },
      { label: 'Takaisin huoneeseesi.', time: 2, next: 'room' },
    ],
  };

  /* ---- the lobby at night (hub) ---- */
  scenes.lobby = {
    art: 'lobby',
    loc: 'Hótel Hraun · Aula',
    enter: (G) => {
      G.flag('loc_lobby');
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('lobby_intro')) G.note('Aula on yöllä akvaario, jonka valo on jätetty päälle. Kaksi lentosi matkustajaa nukkuu pystyasennossa sohvalla. Yövirkailija on tiskillä ristikon kanssa. Tulostetussa kyltissä, Arial-fontilla, lukee 11:00. Myyntiautomaatti hurisee seinustalla kuin pieni jäähdytetty jumala.');
    },
    text: (G) => hub(G, `Aula. ${G.clock(G.t)}. Kyltissä lukee yhä 11:00. ${G.t >= KNOCK_AT ? 'Kello on yli puoli viiden.' : 'Yhteentoista on vielä pitkä aika.'}`, 'lobby'),
    choices: (G) => [
      { label: 'Pyydä vastaanotosta hammastahnaa.', time: 6, once: 'desk_tp', do: (G) => { G.nerves(2); G.note('Hän etsii tiskin alta, vilpittömästi, pitkään. ' + V('"Ei. Valitan. 10-11:ssä on. Kaksikymmentä minuuttia kävellen."') + ' Hän katsoo sinua, ja ovia, ja sinua. ' + V('"Ehkä ei tänä yönä."')); }, next: 'lobby' },
      { label: 'Kysy, pitääkö kyltti paikkansa.', kind: 'comply', dd: 1, time: 5, do: (G) => { const n = G.count('sign'); G.note(n === 1 ? 'Hän osoittaa kylttiä. ' + V('"Yksitoista."') + ' Kysyt, kuka sen hänelle kertoi. ' + V('"Yksi matkustaja soitti heille. He sanoivat kyllä."') + ' Tauko. ' + V('"Tai he sanoivat jotain."') : n === 2 ? V('"Yksitoista",') + ' hän sanoo katsettaan nostamatta, ennen kuin olet saanut kysymyksen loppuun.' : 'Hän katsoo sinua hetken ilmeellä, jota et osaa lukea, ja sanoo sitten: ' + V('"Olet huoneessa 214",') + ' ja palaa ristikkoonsa. Et ollut kysynyt.'); if (n >= 3) G.dread(3); }, next: 'lobby' },
      { label: 'Kysy, onko bussi tullut.', kind: 'comply', dd: 3, time: 5, do: (G) => { const d = G.D; G.dread(1); G.note(d >= 4 ? V('"Yksi on ulkona",') + ' hän sanoo. ' + V('"Se ei ole sinun."') + ' Kysyt, mistä hän tietää. Hän kääntää ristikon niin, että näet sen. Se on tyhjä.' : G.t >= KNOCK_AT ? V('"Joku tuli kysymään sinua. Univormussa. Sanoin, että nukut."') + ' Et nukkunut. ' + V('"Tiedän."') : V('"Ei bussia. Yksitoista. Ole hyvä, mene ylös nukkumaan."')); }, next: 'lobby' },
      { label: 'Myyntiautomaatti.', nd: -2, time: 5, do: (G) => { const n = G.count('vend'); if (n === 1) { G.flag('crisps'); G.nerves(-3); G.note('Sipsejä, paprika. Kaksi pikkupulloa punaviiniä, jonka etiketissä on kuva vuoresta. Automaatti hyväksyy korttisi kolmannella yrityksellä ja päästää syvän vastahakoisen äänen. Pitelet illallistasi molemmin käsin.'); } else { G.note(n === 2 ? 'Melkein kaikki loppu. Yksi tuote jäljellä, alimmalla hyllyllä: purkki skyriä, jonka päiväyksen olisit mieluummin jättänyt lukematta.' : 'Automaatin valo välkkyy. Joka hylly on nyt tyhjä paitsi skyr, joka on siirtynyt hyllyä ylemmäs.'); if (n >= 3) G.dread(1); } }, next: 'lobby' },
      { label: 'Kahviautomaatti.', time: 5, once: 'coffee_l', do: (G) => { G.nerves(G.has('coffee') ? 2 : -2); G.note('Kahvia. Mikä tässä kahvissa oikein on. Se maistuu siltä, kuin se olisi kuvailtu automaatille puhelimessa. Juot sen seisten, katsoen ovia.'); }, next: 'lobby' },
      { label: 'Herätä sohvalla nukkuvat matkustajat. Vertailkaa tietoja.', nd: -4, dd: -4, nerveMax: 85, time: 8, once: 'sofa', do: (G) => { G.collect(1); G.nerves(-2); G.note('He ovat se pariskunta hallin ikkunan luota. He eivät nuku. ' + V('"Me saatiin sähköposti, jossa sanottiin yhdeksän",') + ' hän sanoo. ' + V('"Ja yksi, jossa sanottiin kahdeksan. Ja se chat-juttu sanoo jotain muuta."') + ' Katsotte kaikki kylttiä. ' + V('"Yksitoista",') + ' hän sanoo. ' + V('"Tuloste."')); }, next: 'lobby' },
      { label: 'Katso parkkipaikkaa lasin läpi.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(d >= 4 ? 5 : 0); G.note(d >= 5 ? 'Bussi on nyt suoraan ovien edessä. Moottori käynnissä. Sisävalot palavat. Ovet liukuvat sille auki, ja jäävät auki, ja kylmä tulee sisään. Kukaan ei nouse kyydistä.' : d >= 4 ? 'Parkkipaikan perällä ajovalot, tyhjäkäynnillä. Niiden takana hahmo, joka on bussin muotoinen. Virkailija ei nosta katsettaan. Hän ei ole nostanut sitä vähään aikaan.' : 'Soraa, yksi lyhty, tie. Auto ajaa ohi hidastamatta. Tarkkailet jotain. Haluaisit lopettaa.'); if (d >= 4) G.flag('looked1'); }, next: 'lobby' },
      { label: 'Mene ulos.', dd: -2, dreadMax: 88, time: 3, next: 'carpark' },
      { label: 'Takaisin ylös käytävälle.', time: 3, next: 'corridor' },
    ],
  };

  /* ---- the car park at night (hub) ---- */
  scenes.carpark = {
    art: 'carpark_night',
    loc: 'Hótel Hraun · Parkkipaikka',
    enter: (G) => {
      G.flag('loc_carpark'); G.dread(2);
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('cp_intro')) G.note('Kylmä. Kunnolla kylmä: sellainen, joka menee vaatteisiin ja jää sinne. Soraa, lyhty, tie kahteen suuntaan. Hotelli takanasi, valaistuna. Tulit ulos syystä, joka sinulla oli hetki sitten.');
    },
    text: (G) => hub(G, `Parkkipaikka. ${G.clock(G.t)}. Tuuli on tullut pitkän matkan sinua vastaan.`, 'carpark'),
    choices: (G) => [
      { label: 'Kävele perälle. Sitä hahmoa kohti.', nd: 5, dreadMax: 92, time: 6, do: (G) => { const d = G.D; G.dread(G.counted('cpwalk') ? 1 : 3); G.count('cpwalk'); if (d >= 4) { G.flag('coach_seen_cp'); G.nerves(G.counted('cpwalk') > 1 ? 3 : 6); G.note('Bussi. Tummansininen. Kultainen vaakuna. Moottori käynnissä, kaikki sisävalot palaen, ja jokaisen ikkunan takana ihminen, suorassa, kasvot hotelliin päin. Oven vieressä tummansininen mies, kädet ristissä. Hän ei katso sinua. ' + V('"Ei vielä",') + ' hän sanoo, ei kenellekään, tai sinulle.'); } else { G.nerves(3); G.note('Ei mitään. Läikkä soraa, joka on muuta tummempi, jonkin sellaisen muotoinen, joka oli äskettäin pysäköitynä siihen. Tuuli. Seisot hetken siinä muodossa.'); } }, next: 'carpark' },
      { label: 'Nouse bussiin.', kind: 'comply', if: (G) => G.has('coach_seen_cp'), do: (G) => G.end('nightcoach') },
      { label: 'Katso ylös ikkunaasi.', time: 3, do: (G) => { G.dread(2); G.nerves(2); G.note(G.D >= 4 ? 'Toinen kerros, neljäs ikkuna. Valo palaa. Jätit sen päälle. Verho on auki. Et jättänyt sitä auki.' : 'Toinen kerros, neljäs ikkuna. Valo palaa. Se näyttää huoneelta, jossa on joku.'); }, next: 'carpark' },
      { label: 'Kävele kaksikymmentä minuuttia 10-11:een hakemaan hammastahnaa.', dreadMax: 70, sub: 'Hammastahnaa. Sukkia, ehkä. Maisemanvaihdosta.', time: 20, once: 'walk', next: 'walk' },
      { label: 'Mene takaisin sisään.', kind: 'comply', dd: 1, time: 3, next: 'lobby' },
    ],
  };

  scenes.walk = {
    art: 'road',
    loc: 'Tie · kohti 10-11:tä',
    text: p(
      'Tuulta. Laavaa. Tie ilman jalkakäytävää ja valkoinen viiva, joka katoaa yhä uudestaan. Kahdeksan minuutin jälkeen et enää näe hotellia takanasi; kymmenen jälkeen et näe 10-11:tä edessäsi.',
      'Sitten ajovalot, hitaasti, takaa. Bussi. Se ajaa rinnallesi ja pysähtyy, ja ovi taittuu auki pehmeällä, kalliilla äänellä. Lämmintä valoa. Rivejä istuimia, ja niissä ihmisiä, hyvin hiljaa istuen.',
      V('"Albionin matkustaja?"') + ' sanoo ääni, jonka tunnet luurista 37 000 jalan korkeudesta. ' + V('"Teemme parhaamme. Hyppää kyytiin."'),
    ),
    choices: [
      { label: 'Nouse kyytiin. Siellä on lämmintä.', kind: 'comply', do: (G) => G.end('convenience') },
      { label: 'Jatka kävelemistä. Älä katso ovea.', dreadMax: 75, dd: -14, time: 30, do: (G) => { G.nerves(12); G.flag('toothpaste'); G.nerves(-10); G.dread(8); G.note('Bussi kävi tyhjäkäynnillä vierelläsi pitkään, ja sitten ei enää. 10-11 oli valaistu kuin pyhättö. Hammastahnaa. Hammasharja. Sukkia, kolmen pakkaus, kauneimmat sukat, jotka olet koskaan nähnyt. Kävelit takaisin pussi rintaasi vasten puristettuna. Mikään ei ohittanut sinua tiellä. Ei yhtään mikään, mikä oli jotenkin pahempaa.'); }, next: 'carpark' },
      { label: 'Käänny ympäri. Kävele takaisin hotellille. Nopeasti.', kind: 'comply', dd: 6, time: 15, do: (G) => { G.nerves(8); G.dread(5); G.note('Et juossut. Kävelit, nopeasti, bussi takanasi tyhjäkäynnillä, samaa tahtia, ja sitten ei enää. Aulan ovet liukuivat auki ennen kuin ehdit niille.'); }, next: 'carpark' },
    ],
  };

  /* ---- the knock, three ways ---- */
  scenes.knock = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); },
    text: (G) => p(
      G.last(),
      'Joku koputtaa. Ei hakkaa – koputtaa, tasaisesti, niin kuin koputtaa ihminen, joka koputtaa koko yön.',
      V('"Bussi Albion Atlanticin matkustajille. Lähtee nyt. Viimeinen kutsu."'),
      'Ääni on kärsivällinen. Ääni on hyvin, hyvin kärsivällinen.',
    ),
    choices: [
      { label: 'Avaa ovi.', kind: 'comply', sub: 'Se saattaa olla bussi.', do: (G) => G.end('nightcoach') },
      { label: 'Katso ovisilmästä.', dd: 6, nd: 6, time: 2, do: (G) => { G.nerves(9); G.flag('spyhole'); G.note('Käytävä on tyhjä. Matto ovesi edessä on märkä. Koputus jatkuu, tasaisena, ei mistään erityisestä suunnasta.'); }, next: 'knock2' },
      { label: 'Kyltissä luki 11:00. Älä avaa. Älä vastaa.', nd: 5, dreadMax: 80, time: 20, do: (G) => { G.nerves(5); G.note('Istuit sängyllä selkä sängynpäätyä vasten, katse ovessa, ja laskit koputuksia. Menetit laskun kuudessakymmenessä. Sitten ne loppuivat, ja se oli hetken aikaa pahempaa.'); }, next: 'window' },
    ],
  };

  scenes.knock2 = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: (G) => p(G.last(), 'Tasaista. Kärsivällistä. Ei ketään.'),
    choices: [
      { label: 'Avaa ovi silti.', kind: 'comply', do: (G) => G.end('nightcoach') },
      { label: 'Peräänny ovelta. Istu sängylle. Odota, että se menee ohi.', dreadMax: 88, time: 25, do: (G) => { G.nerves(3); G.note('Se loppui lopulta, niin kuin sade loppuu: et huomannut viimeistä.'); }, next: 'window' },
    ],
  };

  scenes.corridor_knock = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Second floor corridor · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); G.nerves(8); },
    text: (G) => p(
      G.last(),
      'Olet käytävällä, kun se alkaa. Käytävän päässä, hissin luona, joku tummansinisissä koputtaa oveen. Tasaisesti. Kärsivällisesti. Sitten seuraavaan oveen. Sitten seuraavaan.',
      'Hän etenee kohti huonetta 214. Hän etenee kohti sinua. Hän ei ole nostanut katsettaan. ' + V('"Bussi Albion Atlanticin matkustajille. Lähtee nyt. Viimeinen kutsu."'),
    ),
    choices: [
      { label: 'Kävele hänen ohitseen. Takaisin huoneeseesi. Lukitse ovi.', dreadMax: 80, time: 5, do: (G) => { G.nerves(10); G.dread(8); G.flag('seen'); G.note('Hän ei lakannut koputtamasta, kun kävelit ohi. Hän ei kääntynyt. Mutta kun avainkorttisi naksahti, hän sanoi, ystävällisesti, edessään olevalle ovelle: ' + V('"Kaksi neljätoista",') + ' ja sait ketjun kiinni käsillä, jotka eivät tuntuneet omiltasi.'); }, next: 'window' },
      { label: 'Mene portaita alas. Hiljaa. Odota aulassa.', dd: 5, dreadMax: 92, time: 15, do: (G) => { G.nerves(6); G.dread(5); G.note('Virkailija ei nostanut katsettaan, kun tulit alas. ' + V('"Hän etsii sinua",') + ' hän sanoi ristikolle. Istuit sohvalle pariskunnan viereen, eikä kukaan sanonut mitään pitkään aikaan, ja sitten aulan ovet liukuivat auki ei kenellekään, ja sulkeutuivat.'); }, next: 'window' },
      { label: 'Vastaa hänelle. Olet Albion Atlanticin matkustaja.', kind: 'comply', do: (G) => G.end('nightcoach') },
    ],
  };

  scenes.window = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.S.t = Math.max(G.t, T(1, 4, 50)); G.bot('Hei! Näen, että olet huoneessa 214. Bussi odottaa sinua parkkipaikalla. Älä katso ulos ikkunasta. 🙂'); },
    text: (G) => p(
      G.last(),
      'Takaisin huoneessa, tai yhä siellä. Koputus on loppunut. Puhelimesi valaisee katon. Viesti Allylta.',
      W('Bussi odottaa sinua parkkipaikalla. Älä katso ulos ikkunasta.'),
      'Verho on ohut. Sen läpi tulee valoa, ja valo liikkuu hieman, niin kuin käyvän moottorin valo liikkuu.',
    ),
    choices: [
      { label: 'Katso.', dd: 10, nd: 8, dreadMax: 90, sub: 'Ihan vähän vain.', time: 5, do: (G) => { G.flag('seen'); G.nerves(14); atLeast(G, 78); }, next: 'window2' },
      { label: 'Älä. Laita puhelin näyttö alaspäin. Vedä peitto pään yli.', kind: 'comply', dd: 6, time: 5, do: (G) => G.nerves(2), next: 'sleep' },
    ],
  };

  scenes.window2 = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: p(
      'Bussi, tummansininen, kultainen vaakuna. Moottori käynnissä. Kaikki sisävalot palavat. Se on täynnä, ja kaikki siinä istuvat täysin suorassa, ja jokainen heistä on kääntynyt hotelliin päin.',
      'Bussin ovella seisoo purserin univormuun pukeutunut mies. Katsoessasi hän nostaa katseensa – ei hotelliin. Sinun ikkunaasi.',
      'Hän ei vilkuta. Hänen ei tarvitse. Hän on, ymmärrät sen, merkinnyt sen muistiin.',
    ),
    choices: [{ label: 'Päästä verhosta irti.', time: 5, next: 'sleep' }],
  };

  /* ---------------------------------------------------------------- Day 1 · 07:30 morning */
  scenes.sleep = {
    art: 'lobby',
    loc: 'Hótel Hraun · Aamiaishuone',
    enter: (G) => {
      G.S.t = T(1, 7, 30);
      G.flag('morning');
      G.S.dread = Math.max(20, G.S.dread - 25); // daylight helps, a little
      G.nerves(G.has('allnighter') ? 6 : G.has('coffee') ? -5 : -10);
      if (G.has('toothpaste')) G.nerves(-6);
      G.at(T(1, 7, 35), 'sms', { from: 'Jo 💛', body: 'HERRANJUMALA OOTKO ISLANNISSA?? sun on pakko käydä blue lagoonilla. PAKKO. se on tyyliin 20 min kentältä' });
      G.at(T(1, 8, 5), 'chat', { body: 'Hyvää huomenta! Kuljetuksesi lentokentälle on vahvistettu klo 08:00. Ole aulassa. 🚌' });
      G.at(T(1, 9, 40), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Kuljetuksesi lentokentälle', stamp: T(1, 9, 40), body: 'Hyvä asiakas,\n\nBussit noutavat sinut majoituksestasi klo 09:00 uudelleen varatulle lennollesi AB 0271.\n\nOle valmiina aulassa klo 08:45.\n\nTeemme parhaamme.' });
      G.at(T(1, 9, 55), 'chat', { body: 'Bussisi on täällä. Se on se kiva. 🚌' });
    },
    text: (G) => p(
      G.has('allnighter') ? 'Harmaata valoa. 07:30. Et nukkunut, ja olet yhä Islannissa.' : 'Harmaata valoa. 07:30. Nukuit, tai jotain sinne päin, ja olet yhä Islannissa.',
      'Aamiaiseksi on skyriä, leipää ja kahvia, joka maistuu siltä kuin sen olisi tehnyt joku, jolle kahvia on joskus kuvailtu. Huone on täynnä lentoasi. Kaikilla on eiliset vaatteet. Kaikki vertailevat tietojaan: mikä hotelli, mikä noutoaika, mihin kolmesta ristiriitaisesta viestistä kukin on päättänyt uskoa.',
      'Tulostettu kyltti on yhä teipattuna tiskiin. 11:00. Joku on piirtänyt siihen pienen sydämen.',
    ),
    choices: [{ label: 'Ota silti toinen kahvi.', time: 10, next: 'hotel_morning' }],
  };

  scenes.hotel_morning = {
    art: 'lobby',
    loc: 'Hótel Hraun · Aula',
    enter: (G) => {
      if (G.t >= T(1, 10, 15)) { G.go('buses2'); return; }
      if (G.once('morn_intro')) G.note('Käytännössä kaikki on ajoitettu niin, että se on mahdollisimman tuskallista antamatta sinulle vapautta mennä tekemään jotain mukavaa välissä. Kolme tuntia, eikä niillä ole muuta tekemistä kuin odottaa bussia, joka saattaa olla tai olla olematta se bussi.');
    },
    text: (G) => hub(G,
      `Aula. ${G.clock(G.t)}. Kyltissä lukee 11:00. ${G.t >= T(1, 9, 45) ? 'Sähköpostissa sanottiin 09:00, ja se saapui 09:40. ' : G.t >= T(1, 8, 5) ? 'Chatbot sanoi 08:00. Kello on yli 08:00. ' : ''}Kukaan ei ole nähnyt bussia, joka olisi sinun.`,
      'morning'),
    choices: (G) => [
      { label: 'Näytä UK261-QR-koodia jokaiselle matkustajalle, jonka tavoitat.', dd: -8, nd: -4, nerveMax: 90, sub: 'Sillä varauksella, että lentoyhtiö taistelee vastaan.', if: (G) => G.has('uk261'), once: 'qr1', time: 20, do: (G) => { G.collect(2); G.nerves(-5); G.note('Kierrät pöydästä pöytään puhelin ojennettuna kuin etsintälupa. Ihmiset kuvaavat sen. Nainen, jolla on bagel, sanoo: ' + V('"Olen valmis olemaan Karen."') + ' Joku taputtaa, kerran.'); }, next: 'hotel_morning' },
      { label: 'Vertaile tietoja muiden kanssa.', dd: -5, nd: -4, nerveMax: 85, time: 20, once: 'notes1', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_notes'); G.note('Neljä hotellia. Kuusi noutoaikaa. Yksi tuloste. Mies Blazers-lippiksessä: ' + V('"Ne vaakunalliset eivät ole meidän. En tiedä kenen ne on. Ei meidän."') + ' Kaikki nyökkäilevät, kuin olisivat tienneet.'); }, next: 'hotel_morning' },
      { label: 'Kysy vastaanotosta, pitääkö 11:00 paikkansa.', kind: 'comply', dd: 2, time: 10, once: 'recep', do: (G) => { G.nerves(1); G.note('Sama virkailija. Yhä. Hän osoittaa kylttiä. ' + V('"Toinen matkustaja soitti heille. He sanoivat kyllä."') + ' Tauko. ' + V('"Tai he sanoivat jotain."')); }, next: 'hotel_morning' },
      { label: 'Mene takaisin huoneeseen. Suihkuun. Pese edes kasvosi.', nerveMax: 92, time: 25, once: 'morn_shower', do: (G) => { G.nerves(-5); G.note('Kuumaa vettä. Samat vaatteet. Huone päivänvalossa on vain huone: shampoot, vedenkeitin, ikkuna parkkipaikalle, jolla on bussi. Et katso pitkään.'); }, next: 'hotel_morning' },
      { label: 'Puhu taaperon äidille.', nd: -3, dd: -3, nerveMax: 80, time: 10, once: 'morn_mother', do: (G) => { G.collect(1); G.nerves(-3); G.note(V('"Hän haluaisi olla nyt kotona",') + ' äiti sanoo taaperosta, joka on pöydän alla. ' + V('"Niin minäkin. Kuulitko koputusta viime yönä?"') + ' Sanot kyllä. Hän sanoo: ' + V('"Me ei myöskään avattu."')); }, next: 'hotel_morning' },
      { label: 'Tarkista lennon tila lentoyhtiön sivulta.', dd: 3, nd: 3, time: 8, do: (G) => { const n = G.count('status'); G.dread(2); G.note(n === 1 ? 'AB 0271 · KEF → LAX · 15:10 · AIKATAULUSSA. Missä aikataulussa, sitä ei sanota.' : n === 2 ? 'AB 0271 · 15:10 · AIKATAULUSSA. Sitten, katsoessasi, 15:25. Sitten taas 15:10.' : 'Sivu ei lataudu. Sitten se latautuu, eikä lentoa ole siinä. Sitten on. 15:10. Laitat puhelimen pois ennen kuin se ehtii muuttua taas.'); }, next: 'hotel_morning' },
      { label: 'Mene ulos etsimään klo 09:00 bussia.', kind: 'comply', dd: 5, if: (G) => G.t >= T(1, 8, 50) && G.t < T(1, 10, 0), time: 10, next: 'decoy_morning' },
      { label: 'Mene kuumille lähteille. Olet aina halunnut.', sub: 'Se on kahdenkymmenen minuutin päässä. Kaikki sanovat niin.', do: (G) => G.end('tantalus') },
      { label: 'Odota aulassa.', kind: 'comply', dd: 3, nd: 2, sub: 'Puoli tuntia.', time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Puoli tuntia. Kahviautomaatti, ovet, kyltti. Lapsi laskee sataan ja aloittaa alusta.', 'Puoli tuntia. Jonkun puhelimen herätys soi – asetettuna Los Angelesin aikaan – ja kaikki nauravat, ja sitten kukaan ei naura.', 'Puoli tuntia. Ulkona bussi tulee, ei ole sinun, ja lähtee. Et nouse. Ei nouse kukaan muukaan.'])); }, next: 'hotel_morning' },
    ],
    status: (G) => (G.has('hint_notes') ? 'Huhupuhetta: kaikki saivat lentoyhtiöltä eri ajat. Kaikki menevät tulosteen mukaan. Vaakunalliset bussit "eivät ole meidän".' : ''),
  };

  scenes.decoy_morning = {
    art: 'carpark',
    loc: 'Hótel Hraun · Parkkipaikka',
    text: p(
      'Siellä on bussi. Tummansininen, kultainen vaakuna, moottori käynnissä. Keulan LED-näytössä lukee AIRPORT TRANSFER · ALBION ATLANTIC. Purseri seisoo ovella kädet ristissä, ja nähdessään sinut hän hymyilee, kuin olisit täsmälleen ajoissa.',
      'Kukaan muu aulasta ei ole tullut ulos. Ikkunoiden läpi näet, että kyydissä jo olevat matkustajat istuvat suorassa puhtaissa paidoissaan ja katsovat ei mihinkään.',
    ),
    choices: [
      { label: 'Nouse kyytiin. Sähköpostissa sanottiin 09:00.', kind: 'comply', do: (G) => G.end('crew') },
      { label: 'Mene takaisin sisään. Älä puhu siitä kenellekään.', dreadMax: 85, time: 5, do: (G) => { G.nerves(6); G.dread(5); G.note('Menit takaisin sisään. Kukaan ei kysynyt. Lasin takana bussi pysyi paikallaan, ovi auki, pitkään.'); }, next: 'hotel_morning' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 10:15 bus stand 2 */
  scenes.buses2 = {
    art: 'carpark',
    loc: 'Hótel Hraun · Parkkipaikka',
    enter: (G) => { if (G.t < T(1, 10, 15)) G.S.t = T(1, 10, 15); G.dread(4); },
    text: (G) => p(
      'Joku sanoo, että ulkona on bussi. Kysyt vastaanottovirkailijalta, onko se sinun. Hän ei tiedä. Hän osoittaa Arial-kylttiä. ' + V('"Ehkä sinun kannattaisi kiirehtiä."'),
      'Kuvittele videopelin mittari, mutta hermoillesi, laskemassa ohueksi, vapisevaksi punaiseksi siruksi.',
      'Ulkona: busseja. Kukaan ei ole kertonut, mikä. Missään niistä ei lue lentosi numeroa, paitsi siinä, jossa lukee, tussilla.',
      G.has('hint_notes') && W('"Ne vaakunalliset eivät ole meidän."'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: '#c7c3b6', windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'day' },
        name: 'Sama valkoinen bussi kuin eilen illalla, tai hyvin samanlainen',
        sign: G.pick(['AIRPORT', 'AB0271 → KEF', 'FLIGHT PPL AIRPORT']), signStyle: 'paper',
        look: ['Kuljettaja huomioliivissä. Eri voileipä.', 'Puolillaan. Ihmisiä tulee yhä aulasta sitä kohti.'],
        hidden: ['Fleece. Taapero. Mies paikalta 31C. Samat vaatteet kuin eilen, tietenkin, mitä muutakaan heillä olisi.', 'Et ole hyvä muistamaan kasvoja. Nämä tunnet.'],
        board: { time: 5, do: (G) => G.flag('bus2_ok'), next: 'ride2' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'day' },
        name: 'Tummansininen bussi kultaisella vaakunalla',
        sign: 'AIRPORT TRANSFER · ALBION ATLANTIC', signStyle: 'led',
        look: ['Purseri ovella. Hän vilkuttaa. Hän tietää, mikä ikkuna oli sinun.', 'Lämmin. Hiljainen. Paljon tilaa.'],
        hidden: ['Kukaan kyydissä ei näytä nukkuneen vaatteet päällä. Kukaan ei näytä nukkuneen.', 'Kenelläkään kyydissä ei ole puhelinta esillä.'],
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const lagoon = {
        key: 'lagoon',
        art: { livery: '#3e9c9a', windows: 'cold', passengers: 'few', sign: 'print', driver: 'plain', ground: 'day' },
        name: 'Turkoosi pikkubussi',
        sign: 'BLUE LAGOON SHUTTLE — Relax. You deserve it.', signStyle: 'print',
        look: ['Kuljettaja pitelee pinoa valkoisia pyyhkeitä.', 'Haisee rikiltä ja eukalyptukselta.'],
        hidden: ['Kaikilla kyydissä on puhtaat sukat.', 'Se lähtee kahden minuutin päästä. Se lähtee aina kahden minuutin päästä.'],
        board: { do: (G) => G.end('tantalus') },
      };
      return G.shuffle([correct, crest, lagoon]);
    },
    choices: [
      { label: 'Odota. Ei ole vielä 11:00. Kyltissä luki 11:00.', kind: 'comply', dd: 6, nd: 6, sub: 'Kyltti on ainoa asia, joka on tähän mennessä ollut oikeassa.', time: 45, next: (G) => (G.t >= T(1, 11, 25) ? 'end:noshow' : 'buses2'), do: (G) => { G.nerves(8); G.dread(5); } },
    ],
  };

  scenes.ride2 = {
    art: 'road',
    loc: 'Tie 41 · kohti Keflavíkia',
    enter: (G) => {
      G.flag('left_hotel');
      if (G.once('nofood')) { if (G.rng() < 0.5) G.at(T(1, 12, 30), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Tarjoilu lennollasi', body: 'Hyvä asiakas,\n\nHuomioithan, että uudelleenreitityksen vuoksi lennolla AB 0271 ei ole tarjoilua.\n\nSuosittelemme ostamaan virvokkeita terminaalista.\n\nTeemme parhaamme.' }); }
      G.at(T(1, 12, 0), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Muuttunut lähtöaika', body: 'Hyvä asiakas,\n\nLentosi AB 0271 lähtee nyt klo 15:45.\n\nLähtöselvitys avautuu kolme tuntia ennen lähtöä.\n\nTeemme parhaamme.', fx: (G) => { G.S.dep = T(1, 15, 45); } });
      G.at(T(1, 13, 10), 'chat', { body: 'Sinut on majoitettu. Miksi seisot jonossa? 🙂' });
    },
    text: p(
      'Oletat olevasi oikeassa paikassa vain siksi, että alat tunnistaa muita matkustajia, vaikket ole hyvä muistamaan kasvoja. Bussi lähtee kaksikymmentä minuuttia myöhässä, mikä laskujesi mukaan tarkoittaa, että saavut lentokentälle vaivaiset neljäkymmentä minuuttia ennen kuin lähtöselvitys edes avautuu.',
      'Vauva parkuu. Äiti mutisee: ' + V('"Hän haluaisi olla nyt kotona",') + ' ja koko bussi nauraa, surullisesti.',
      'Islanti vilisee ikkunan takana: loistavaa hanavettä, kauniita maisemia, kohtuullisen mukavia ihmisiä, jotka eivät välttämättä ole avuksi mutta eivät uhkaile eivätkä valehtele. Iso kiitos Islannille siitä. Keflavík on syytön.',
    ),
    choices: [{ label: 'Saavu perille.', time: 55, do: (G) => G.nerves(-4), next: 'airport' }],
  };

  /* ---------------------------------------------------------------- Day 1 · ~11:30 the airport (hub) */
  scenes.airport = {
    art: 'airport',
    loc: 'Keflavíkin kansainvälinen lentoasema · Lähtevät',
    enter: (G) => {
      G.flag('at_airport2'); atLeast(G, 45);
      if (G.once('counter_paper')) G.msg('paper', { from: 'A4-arkki, nippusiteellä kiinnitettynä jonoaitaan', subj: 'Tulostettu kyltti', body: '<b>ALBION ATLANTIC AB0271</b>\n\nCounter opens <b>3 HOURS</b> before departure.\n\nIf departure is delayed, counter opening is delayed.\n\nPlease queue here.' });
      if (G.once('ap_intro')) G.note('Lentokentällä on yksi (1) Albion Atlanticin tiski, ja sen edessä jono, joka koostuu kokonaan ihmisistä, jotka nyt tunnet ulkonäöltä. Tiski ei ole auki. A4-arkki sanoo, että se avautuu kolme tuntia ennen lähtöä, ei minuuttiakaan aiemmin, ja jos lento myöhästyy, myöhästyy tiskikin.');
      const open = G.S.dep - 180;
      if (G.t >= open && G.has('inline')) G.go('checkin');
    },
    text: (G) => {
      const open = G.S.dep - 180;
      return hub(G,
        `Lähtevät. ${G.clock(G.t)}. Taulussa lukee AB 0271 · LOS ANGELES · <em>${G.clock(G.S.dep)}</em>. ${G.t < open ? `Tulosteen aritmetiikan mukaan tiski avautuu klo ${G.clock(open)}.` : G.has('inline') ? 'Rullaovi nousee.' : 'Tiski on auki. Jono liikkuu. Sinä et ole siinä.'}`,
        'airport',
        G.has('seen') && G.D >= 5 ? W('Etsit yhä purserin univormua katseellasi. Et ole nähnyt sellaista. Se ei ole sama asia kuin ettei sellaista olisi.') : '');
    },
    choices: (G) => [
      { label: 'Tulosta uusi tarkastuskortti automaatista.', nd: 4, dd: 2, time: 8, do: (G) => { const n = G.count('kiosk'); G.nerves(3); G.note(n === 1 ? 'VARAUSTASI EI LÖYDY. Vaihdat automaattia. Syötät tiedot. VARAUSTASI EI LÖYDY, eri fontilla. Tätä ei voisi keksiä.' : n === 2 ? 'Automaatti miettii pitkään ja tulostaa tyhjän kortin. Pidät sen. Et tiedä miksi.' : 'VARAUKSESI ON MAJOITETTU. Sitten näyttö pimenee ja näyttää sinulle kasvosi.'); if (n >= 3) G.dread(3); }, next: 'airport' },
      { label: 'Mene jonoon ainoalle tiskille.', if: (G) => !G.has('inline'), time: 5, do: (G) => { G.flag('inline'); G.note('Menet jonoon. Se ei ole niinkään jono kuin päätös, jonka kaksisataa ihmistä on tehnyt yhdessä. Kukaan siinä ei puhu lentoyhtiölle. Kaikki siinä puhuvat toisilleen.'); }, next: 'airport' },
      { label: 'Jaa UK261-QR-koodi jonoa pitkin.', dd: -6, nd: -4, nerveMax: 90, if: (G) => G.has('uk261'), once: 'qr2', time: 15, do: (G) => { G.collect(2); G.nerves(-5); G.note('Koodi kulkee jonoa pitkin kuin salasana. ' + V('"Olen valmis olemaan Karen",') + ' sanoo fleeceen pukeutunut mies, joka on se fleecemies.'); }, next: 'airport' },
      { label: 'Vertailkaa hotelleja ja lähtöaikoja.', nd: -4, dd: -4, nerveMax: 85, once: 'notes2', time: 15, do: (G) => { G.collect(1); G.nerves(-3); G.note('Kaikki lähetettiin eri paikkaan. Kaikille annettiin eri aika. Kaikki tulivat silti takaisin, koska tulosteessa sanottiin niin, ja tässä te kaikki olette, oikeassa yhdessä.'); }, next: 'airport' },
      { label: 'Etsi joku univormussa ja kerro hänelle tarkalleen, mitä mieltä olet.', kind: 'conflict', nd: 8, time: 10, do: (G) => { G.strike(); G.note('Kerroit univormuun pukeutuneelle miehelle tarkalleen, mitä mieltä olet. ' + V('"Teemme parhaamme."') + ' Ei anteeksipyyntöä. Ei myötätuntoa. Ei edes esityksenä. Hän kirjoitti jotain ylös.'); }, next: 'airport' },
      { label: 'Etsi uloskäynti. Ihan vain nähdäksesi.', dd: 6, dreadMax: 85, time: 8, once: 'exit', do: (G) => { G.dread(5); G.nerves(4); G.note('Ulko-ovissa lukee VAIN SAAPUVAT. Tulit sisään niistä. Painat kätesi lasiin, eikä se aukea, ja huomioliiviin pukeutunut mies pudistaa päätään katsomatta sinua.'); }, next: 'airport' },
      { label: 'Osta vettä. Takanasi oleva mies ei luota siihen, ettei se lopu kesken.', nd: -4, nerveMax: 92, time: 10, once: 'water', do: (G) => { G.nerves(-3); G.note('Vettä, ja voileipä, jonka nimessä on ð-kirjain, ja – koska kaupassa on niitä – sukkia. Sinulla oli sukkia. Ostat lisää sukkia. Kukaan tämän yön läpikäynyt ei tuomitsisi sinua.'); if (!G.has('toothpaste')) { G.flag('toothpaste'); G.nerves(-4); } }, next: 'airport' },
      { label: 'Katso lähtevien taulua.', dd: 3, nd: 3, time: 6, do: (G) => { const n = G.count('board'); G.dread(2); G.note(n === 1 ? `AB 0271 · LOS ANGELES · ${G.clock(G.S.dep)}. Sitten taulu selaa läpi kaikki maailman lennot ja palaa siihen. Sama aika. Toistaiseksi.` : n === 2 ? 'Aika ei ole muuttunut. Rivi on siirtynyt alaspäin. Kaikki sen yläpuolella on lentoja jonnekin, jotka lähtevät.' : 'Katsot sen vaihtuvan. LOS ANGELES. LOS ANGELES. Yhden ruudun ajan jotain, mikä ei ole kaupunki. LOS ANGELES.'); }, next: 'airport' },
      { label: 'Odota.', kind: 'comply', nd: 3, dd: 3, nerveMax: 90, time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Puoli tuntia. Jono ei liiku, koska ei ole mitään, mitä kohti liikkua. Joku istuutuu lattialle, ja se leviää.', 'Puoli tuntia. Siivooja ajaa ohi koneellaan. Kun hän on mennyt, lattia näyttää samalta ja jono on hieman lyhyempi.', 'Puoli tuntia. Puhelimesi värähtää tyhjää. Kaikkien värähtää, yhtä aikaa, ja kaikki katsovat, eikä kukaan sano mitään.'])); }, next: 'airport' },
    ],
  };

  scenes.checkin = {
    art: 'airport',
    loc: 'Keflavík · Se ainoa tiski',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 180); if (G.S.strikes >= 3) G.end('left'); },
    text: (G) => p(
      'Tiski avautuu ajallaan, toisin sanoen sinä aikana, jonka se oli yksityisesti päättänyt. Virkailija ottaa passisi. Kukaan univormussa ei ole koko päivänä ollut vähääkään pahoillaan, ei edes esityksenä, eikä tämä mies katkaise putkea. ' + V('"Teemme parhaamme."'),
      G.has('booked') && 'Hän rypistää kulmiaan näytölle. ' + V('"Tietojemme mukaan sinut majoitettiin Heathrow Renaissance Lodgeen viime yönä."') + ' Hän näppäilee jotain. Hän sanoo, että se on merkitty.',
      G.has('objected') && W('Hän vilkaisee näyttöön kiinnitettyä pientä korttia ja sitten sinua.'),
      G.has('seen') && W('Hän katsoo sinua hieman liian kauan. ' + V('"Huone 214",') + ' hän sanoo, ei kysymyksenä.'),
      'Tarkastuskortti, lämmin tulostimesta. Portti 12. Se on todellinen. Tarkistat sen kolmesti.',
    ),
    choices: [
      { label: 'Mene portille.', time: 40, do: (G) => { if (G.has('booked')) G.strike(); G.nerves(-6); }, next: 'gate' },
    ],
  };

  scenes.gate = {
    art: 'gate',
    loc: 'Keflavík · Portti 12',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 60); G.dread(5); G.at(G.t + 20, 'chat', { body: 'Suurin osa asiakkaista on jo koneessa. 🙂' }); },
    text: p(
      'Olet nyt matkustanut yli vuorokauden näiden ihmisten kanssa. Tunnet fleecen. Tunnet taaperon. Tunnet miehen paikalta 31C ja pariskunnan, joka lähetettiin hotelliin vastakkaiseen suuntaan, ja miehen, joka aidosti ei luota siihen, ettei lentoyhtiöltä lopu vesi.',
      'Portin virkailija tarttuu mikrofoniin ja <em>huutaa</em> teille, että koneeseen noustaan ryhmittäin.',
      'Ja sata ihmistä nauraa hänelle päin naamaa. Ei ilkeästi. Vain – avuttomasti. Olette tässä vaiheessa muodostaneet itsehallinnollisen yhteisön, ja hänen yrityksensä komentaa sitä on jostain syystä koko päivän hauskin asia.',
    ),
    choices: [
      { label: 'Naura heidän kanssaan.', nd: -6, dd: -4, nerveMax: 85, time: 10, do: (G) => { G.collect(1); G.nerves(-6); }, next: 'jetbridge' },
      { label: 'Nouse koneeseen ryhmittäin, kiltisti.', kind: 'comply', dd: 5, time: 10, do: (G) => G.nerves(2), next: 'jetbridge' },
      { label: 'Kysy häneltä, milloin lento oikeasti lähtee.', kind: 'conflict', nd: 5, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) G.end('left'); }, next: 'jetbridge' },
      { label: 'Huuda takaisin. Kovempaa kuin hän.', kind: 'conflict', nerveMin: 80, nd: 10, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) G.end('left'); else G.note('Huusit. Neljän sekunnin ajan se tuntui suurenmoiselta. Sitten tummansininen mies ilmestyi kyynärpääsi viereen, kirjoitti jotain ylös ja meni pois, ja nauru oli loppunut.'); }, next: 'jetbridge' },
    ],
  };

  scenes.jetbridge = {
    art: 'gate',
    loc: 'Keflavík · Matkustajasilta',
    text: p(
      'Jono pysähtyy matkustajasillalle. Tarkastuskorttisi lähtöaika on jo ohi, ja tarkastuskortti on se uusin. Vaihdat edelläsi olevan miehen kanssa tietoja siitä, mitä ristiriitaista kumpikin on kuullut lennon olosuhteista.',
      'Sitten jono liikkuu, käännyt kulman taakse, ja koneen oven sijasta siellä on…',
      '<em>Bussi.</em>',
      W('Ja heidän piti saada teidät nousemaan ryhmittäin.'),
    ),
    choices: [{ label: 'Nouse bussiin.', time: 10, next: 'tarmac' }],
  };

  scenes.tarmac = {
    art: 'tarmac',
    loc: 'Bussi · maantie · kumpuilevia laitumia',
    enter: (G) => G.dread(5),
    text: (G) => p(
      'Tämä bussi ei vie sinua toiseen paikkaan asematasolla. Tämä bussi ajaa jotain, mikä näyttää oikealta maantieltä, oikeiden kumpuilevien laidunten halki, joilla on oikeita lampaita.',
      G.has('seen') ? 'Bussin etuosassa, seisten, kaiteesta kiinni pitäen, on purserin univormuun pukeutunut mies. Hän kääntyy. Hän katsoo sinua – vain sinua – täsmälleen niin kauan kuin hän katsoi ikkunaasi. ' + V('"Sinä katsoit",') + ' hän sanoo miellyttävästi ja kääntyy takaisin.' : 'Kuljettaja ei puhu. Radiosta tulee jotain, joka saattaa olla säätiedotus.',
      'Kukaan ei sano mitään. Joku, lähellä perää, alkaa nauraa ja lopettaa.',
    ),
    choices: [
      { label: 'Pysy kyydissä. Tähyile taivaanrantaa siltä varalta, että jollakin olisi siivet.', kind: 'comply', dd: 5, time: 15, next: 'plane' },
      { label: 'Mene eteen. Kysy kuljettajalta, minne tämä bussi on menossa.', kind: 'conflict', nd: 4, time: 15, do: (G) => { G.nerves(5); G.flag('asked_driver2'); }, next: 'plane' },
      { label: 'Vaadi päästä pois. Nyt.', kind: 'conflict', sub: 'Tämä ei ole asemataso.', do: (G) => G.end('pastures') },
    ],
  };

  scenes.plane = {
    art: 'plane',
    loc: 'Asemataso · jossain',
    text: (G) => p(
      G.has('asked_driver2') && W('Hän osoitti eteenpäin, tuulilasin läpi, laidunta. Sitten laidun loppui.'),
      'Luulet näkeväsi lentokoneesi. Sinua ei siis luultavasti ole kidnapattu.',
      'Teidät järjestetään jonoon ulos, hivuttautumaan portaiden juurelle. Ja sitten alkaa sataa. Naurat ääneen, eikä vähiten siksi, että olette jo, ilmiselvästi, lähtöajan tuolla puolen.',
      'Istuin. Vyö. Se hienostunut ääni, luurissa: ' + V('"Suurin osa asiakkaistamme on ollut ymmärtäväisiä ja kärsivällisiä."') + ' Hän jatkaa onnittelemalla itseään, melko pitkään, turvallisuusmenettelyistä, jotka toivat teidät Islantiin.',
      'Sitten hän selittää, kuinka hyvitystä haetaan. Nouset istumaan. Se koskee lennon wifiä.',
      'Et aio tehdä sitä.',
    ),
    choices: [
      { label: 'Sulje silmäsi.', do: (G) => G.end(G.S.collective >= 5 ? 'collective' : 'home') },
    ],
  };

  /* ================================================================ endings */
  const endings = {
    terminal: {
      art: 'terminal', title: 'TERMINAALI', kind: 'bad',
      hint: 'Joku tekee aina kuulutuksen.', blurb: 'Odotit kuulutusta.',
      text: p(
        'Kukaan ei tee kuulutusta. Kukaan ei ollut koskaan aikonutkaan. Kello 03:10 saapuvien hallin valot himmenevät neljäsosaan, ja sitten halli on muoto, jonka pikemminkin muistat kuin näet.',
        'Puhelimesi näyttää yhden palkin ja uuden sähköpostin. <em>Olemme järjestäneet teille bussit.</em> Se ei kerro minne. Se ei koskaan kerro.',
        'Aamulla siivoojat löytävät tarkastuskortin ja vievät sen löytötavaroihin. He ovat siinä hyvin tunnollisia täällä.',
      ),
    },
    accommodated: {
      art: 'road', title: 'MAJOITETTU', kind: 'bad',
      hint: 'Sähköpostissa oli logo.', blurb: 'Vahvistit varauksen.',
      text: p(
        'Auto on lämmin, istuimet ovat nahkaa eikä kuljettaja puhu. Kojelaudan näytössä lukee HEATHROW RENAISSANCE LODGE · 1 894 km · SAAPUMINEN —:—.',
        'Katsot lentokentän valojen kutistuvan. Hetken päästä valoja ei ole lainkaan – vain renkaiden ääni, ja uuden sähköpostin pieni kilahdus, joka saapuu vahvistamaan, että majoituksesi on järjestetty.',
      ),
    },
    crew: {
      art: 'stand', title: 'MIEHISTÖ', kind: 'bad',
      hint: 'Siinä oli vaakuna. Se oli hyvin kiva.', blurb: 'Nousit siihen kivaan.',
      text: p(
        'Bussi tuoksuu uudelta verhoilulta eikä miltään muulta. Kaikki hymyilevät sinulle, kun kuljet ohi. Kenelläkään ei ole eilisiä vaatteita, koska kenelläkään täällä ei ole eilistä.',
        'Purseri sulkee oven pehmeällä, kalliilla äänellä. ' + V('"Suurin osa asiakkaistamme on ollut ymmärtäväisiä ja kärsivällisiä."') + ' Hän tarkoittaa sinua. Olet ollut ymmärtäväinen. Olet ollut hyvin kärsivällinen.',
        'Bussi ajaa pois valosta, ja pysäkki sen takana on tyhjä, ja on ollut jo jonkin aikaa.',
      ),
    },
    convenience: {
      art: 'road', title: 'MUKAVUUS', kind: 'bad',
      hint: 'Kahdenkymmenen minuutin kävely. Tässä kunnossa.', blurb: 'Nousit kyytiin, puolimatkassa 10-11:een.',
      text: p(
        'Bussissa on lämmintä, ja istuimet ovat sisäänpäin, mitä et huomannut ennen kuin istuit alas. ' + V('"Teemme parhaamme",') + ' sanoo purseri, ja ovi taittuu kiinni, ja 10-11 liukuu ohi vasemmalla, kaikki valot päällä eikä ketään sisällä.',
        'Et koskaan saa sitä hammastahnaa.',
      ),
    },
    nightcoach: {
      art: 'corridor', title: 'YÖBUSSI', kind: 'bad',
      hint: 'Viimeinen kutsu.', blurb: 'Vastasit koputukseen.',
      text: p(
        'Käytävä on tyhjä ja matto märkä. Porraskäytävästä: ' + V('"Lähtee nyt."') + ' Seuraat sitä, koska se on koko yön ainoa ohje, jonka mukana tuli kellonaika.',
        'Bussi parkkipaikalla odottaa sisävalot palaen. Kaikki sisällä ovat jo kääntyneet hotelliin päin. Siellä on paikka, jossa on nimesi. Siellä on, itse asiassa, pieni tulostettu kortti, jossa on nimesi, Arial-fontilla.',
      ),
    },
    lift: {
      art: 'corridor', title: 'HISSI', kind: 'bad',
      hint: 'Epäkunnossa, Arial-fontilla.', blurb: 'Menit hissiin, joka tuli itsestään.',
      text: p(
        'Ovet sulkeutuvat hyvän hotellin kohteliaisuudella. Peräseinän peili näyttää sinut: lentokonevaatteet, kasvot, pieni 10-11:n pussi, jos sinulla on se. Hissi laskeutuu. Se laskeutuu pidempään kuin rakennuksessa on kerroksia.',
        'Kun ovet aukeavat, edessä on lämmintä valoa ja rivejä istuimia, ja kaikki niissä kääntyvät katsomaan sinua, ja hymyilevät, ja purseri sanoo: ' + V('"Kiitos kärsivällisyydestäsi",') + ' ja tarkoittaa sitä.',
      ),
    },
    tantalus: {
      art: 'carpark', title: 'TANTALOS', kind: 'bad',
      hint: 'Olet aina halunnut käydä Islannissa.', blurb: 'Menit kuumille lähteille.',
      text: p(
        'Vesi on 38-asteista, taivas on käytetyn nenäliinan värinen, ja sinulla on jalassa lennon sukat, koska sinulla ei ole muita sukkia. Se on, objektiivisesti, kaunista.',
        'Kello 11:00 bussi lähtee erään hotellin parkkipaikalta kolmenkymmenen kilometrin päästä ilman sinua. Kello 11:04 saapuu sähköposti, jossa sanotaan, että bussisi lähti 09:00. Kello 11:05 chatbot kysyy, nautitko vierailustasi.',
        'Olisitpa vain ollut pitelemättä sitä apinankäpälää, kun sanoit sen.',
      ),
    },
    noshow: {
      art: 'lobby', title: 'NO-SHOW', kind: 'bad',
      hint: 'Kyltissä luki 11:00.', blurb: 'Odotit kyltin tarkkaa aikaa.',
      text: p(
        'Kello 11:30 kyltti on otettu pois. Vastaanotto ei muista laittaneensa sitä. ' + V('"Oletko sen lentoyhtiön ryhmän kanssa? He ovat lähteneet."') + ' Hän sanoo sen ystävällisesti.',
        'Aulan kahviautomaatti pitää ääntä kuin jokin, joka rykii kurkkuaan. Varaustasi, kun tarkistat, ei löydy.',
      ),
    },
    left: {
      art: 'airport', title: 'JÄTETTY JÄLKEEN', kind: 'bad',
      hint: 'Hän kyllä sanoi.', blurb: 'Kolme valitusta, kaikki merkitty.',
      text: p(
        V('"Olemme merkinneet palautteesi",') + ' sanoo univormuun pukeutunut mies, ja käy ilmi, että niin on tehty; kaikki, pienelle kortille, siistillä käsialalla. Siinä on kolme rastia.',
        V('"Kuten koneessa ilmoitettiin, asiakkaat, jotka vastustavat operatiivisia päätöksiä tai panevat niitä vastaan, voidaan poistaa."') + ' Hän sanoo tämän ilman minkäänlaista epäystävällisyyttä, mikä on pahinta. Sitten hän pyytää seuraavaa matkustajaa astumaan esiin, ja jono sulkeutuu ylläsi kuin vesi.',
      ),
    },
    pastures: {
      art: 'tarmac', title: 'LAITUMET', kind: 'bad',
      hint: 'Tämä bussi on oikealla maantiellä.', blurb: 'Nousit pois asematason bussista.',
      text: p(
        'Bussi pysähtyy, mitä halusitkin. Ovi avautuu levikkeelle, aidalle, lampaille ja tuulelle, joka on tullut pitkän matkan sinua vastaan. ' + V('"Kuten haluat",') + ' sanoo kuljettaja, ja bussi jatkaa ilman sinua kohti jotain, joka saattaa tuolta etäisyydeltä olla lentokone.',
        'Islanti ei ole tehnyt mitään väärää. Lampaat ovat hyvin mukavia.',
      ),
    },
    home: {
      art: 'plane', title: 'KOTIIN (TAI GRÖNLANTIIN, TAI HELVETTIIN)', kind: 'good',
      hint: 'Nähdään Los Angelesissa.', blurb: 'Pääsit perille. Yksin, enimmäkseen.',
      text: p(
        'Olet istuimella. Istuin on lentokoneessa. Lentokone liikkuu, sikäli kuin voit päätellä, Los Angelesin suuntaan.',
        'Kukaan univormussa ei koskaan pyytänyt anteeksi. Wifi-hyvitys jää hakematta.',
        'Nähdään Los Angelesissa kymmenen tunnin päästä. Tai Grönlannissa. Tai helvetissä.',
      ),
    },
    collective: {
      art: 'plane', title: 'LHR–LAX:N ITSEHALLINNOLLINEN YHTEISÖ', kind: 'good',
      hint: 'Huhupuhe ei ole virallinen kanava.', blurb: 'Pääsit perille, ja niin pääsivät kaikki, joille puhuit.',
      text: p(
        'Portailla joku nauraa, ja sitten kaikki nauravat, eikä sateella ole väliä. Olette matkustaneet yhdessä yli kaksikymmentäkahdeksan tuntia. Sinulla on QR-koodi, fleecemies, mies paikalta 31C ja taapero, joka on nähnyt asioita.',
        'Tarkimmat ja hyödyllisimmät tiedot koko tämän koettelemuksen aikana tulivat Arial-fontilla tulostetuista papereista ja satunnaisten matkustajien välittämästä huhupuheesta. Kukaan univormussa ei koskaan pyytänyt anteeksi. Kävi ilmi, ettet tarvinnut sitä.',
        'Nähdään Los Angelesissa. LHR–LAX:n itsehallinnollisen yhteisön puolesta toivotat tehohoidossa olevalle miehelle pikaista paranemista.',
      ),
    },
  };

  /* ================================================================ interface strings */
  const ui = {
    tabMail: 'Posti', tabAlly: 'Ally', tabSms: 'SMS', tabPaper: 'Paperi', phone: 'PUHELIN',
    nerves: 'HERMOT', dread: 'KAUHU', noted: 'MERKITTY', day: 'PÄIVÄ',
    board: 'Nouse kyytiin', look: 'Katso tarkemmin', lookHint: 'Vie muutaman minuutin.',
    again: 'Lennä uudestaan', endings: 'Loput', back: 'Takaisin', howto: 'Näin tämä toimii', start: 'Nouse kyytiin',
    gameOver: 'PELI OHI', madeIt: 'PÄÄSIT PERILLE — SUUNNILLEEN',
    subtitle: 'MAJOITUSKAUHUA · TEKSTIÄ · 20–30 MINUUTTIA',
    galleryIntro: 'Kaikki tavat, joilla tämä voi päättyä. Lukitut ovat yhä tuolla jossain.', locked: '???',
    noMail: 'Ei postia. Se ainakin on normaalia.', noSms: 'Ei viestejä.', noPaper: 'Kuvia tulostetuista kylteistä, joita löydät. Löydät kyllä.',
    allyIntro: 'Ally — Albion Atlanticin virtuaaliavustaja. Vastaa yleensä välittömästi.', inbox: '‹ Saapuneet',
    emailFoot: 'Tämä on automaattinen viesti. Tähän osoitteeseen lähetettyjä vastauksia ei valvota, lueta, eivätkä ne ole mahdollisia. Albion Atlantic — Teemme parhaamme.',
    from: 'Lähettäjä:', sent: 'Lähetetty', received: 'Vastaanotettu', arrived: 'saapui', photographed: 'Kuvattu',
    tMail: 'POSTI', tSms: 'SMS', tPaper: 'PAPERI', tAlly: 'ALLY', tNoted: 'MERKITTY · Lentoyhtiö on kirjannut palautteesi.',
    gateNerves: 'Et pystyisi pitämään ääntäsi vakaana.', gateDread: 'Et saa itseäsi tekemään sitä.',
  };

  return { start, scenes, endings, chat, ui, T, lang: 'fi' };
})();
