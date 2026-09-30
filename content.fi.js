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
      { d: 1, t: 'Lattianpesukone ajaa hitaasti ohi. Sen kuljettajan kasvoja et koskaan oikein näe.' },
      { d: 1, t: 'Joku on löytänyt pistorasian, ja sen ympärillä seisoo yksitoista ihmistä kuin nuotiolla.' },
      { d: 1, t: 'Saapuvien taulu ei sano lennostasi mitään. Se ei sano mitään yhdestäkään lennosta.' },
      { d: 1, t: 'Lapsi nukkuu matkatavarakärryssä. Matkatavaroita ei ole.' },
      { d: 2, t: 'Hallissa on vähemmän ihmisiä kuin äsken. Et nähnyt kenenkään lähtevän.' },
      { d: 2, t: 'Matkatavaratiskin yläpuolella oleva loisteputki on alkanut naksua.' },
      { d: 2, t: 'Muutaman minuutin välein joku nousee seisomaan, kävelee ovien luo ja palaa takaisin.' },
      { d: 3, t: 'STAFF-ovi on kämmenen leveydeltä raollaan. Et nähnyt sen aukeavan.' },
      { d: 3, t: 'Hetkeksi kaikki hallin puhelimet syttyvät yhtä aikaa, ja sitten ne kaikki pimenevät.' },
      { d: 3, t: 'Joku seisoo tax-free-myymälän suljetun rullaoven edessä selin halliin. Hänellä on yllään tummansinistä.' },
    ],
    room: [
      { d: 2, t: 'Lämmityksestä kuuluu ääni, kuin joku miettisi, koputtaisiko.' },
      { d: 2, t: 'Vedenkeittimessä on pieni merkkivalo. Se on huoneen ainoa asia, joka on sinun puolellasi.' },
      { d: 2, t: 'Käytävällä joku vetää perässään pyörällistä matkalaukkua, jota hänellä ei mitenkään voi olla.' },
      { d: 2, t: 'Peilikuvallasi mustassa ikkunassa on yllään eiliset vaatteet. Niin on kaikilla.' },
      { d: 3, t: 'Ulkona tiellä ajaa hitaasti auto ohi, eikä se käänny pihaan.' },
      { d: 3, t: 'Seinän takana, viereisessä huoneessa, televisio näyttää samaa tyhjää kuin sinun omasi.' },
      { d: 3, t: 'Huone on 214. Kortissa lukee 214. Tarkistat sen yhä uudelleen, aivan kuin se olisi voinut vaihtaa paikkaa.' },
      { d: 3, t: 'Joku pysähtyy käytävällä ovesi kohdalle ja jatkaa sitten matkaa.' },
      { d: 4, t: 'Oven alta näkyvä valo sammuu, syttyy taas ja sammuu.' },
      { d: 4, t: 'Jossain alhaalla käy moottori. Se on käynyt jo jonkin aikaa.' },
      { d: 4, t: 'Puhelimen näyttö syttyy tyhjään. Ei viestiä. Pelkkä näyttö, joka katsoo sinua.' },
      { d: 4, t: 'Kuulet koputuksen kahden oven päästä. Tasaista, kärsivällistä. Sitten yhden oven päästä.' },
      { d: 5, t: 'Parkkipaikalla on joku. On ollut jo jonkin aikaa.' },
      { d: 5, t: 'Verho liikahtaa. Yhtään ikkunaa ei ole auki.' },
      { d: 5, t: 'Huoneen puhelin soi kerran ja vaikenee.' },
    ],
    corridor: [
      { d: 2, t: 'Mustelman värinen kokolattiamatto. Käytävän päähän jätetty pyyhekärry, hylätty kesken työvuoron.' },
      { d: 2, t: 'Jokaisessa ovessa on numero. Jokaisen numeron alla on valojuova.' },
      { d: 3, t: 'Jääpalakone jauhaa, pysähtyy, jauhaa.' },
      { d: 3, t: 'Käytävän päässä valo on sammunut. Äsken se paloi.' },
      { d: 3, t: 'Jonkin oven takana joku nauraa ja vaikenee kesken kaiken.' },
      { d: 4, t: 'Huoneen 216 edustalla matto on märkä.' },
      { d: 4, t: 'Kuulet, kuinka hissi liikkuu kerrosten välillä. Kukaan ei ole kutsunut sitä.' },
      { d: 4, t: 'Käytävän päässä oleva palo-ovi on kiilattu auki kengällä.' },
      { d: 5, t: 'Käytävän ovet ovat auki, yksi toisensa jälkeen, ja niiden takana huoneet on siivottu ja vuoteet sijattu. Niissä ei ole koskaan ollut ketään.' },
      { d: 5, t: 'Käytävän perällä joku tummansiniseen pukeutunut koputtaa oveen, tasaisesti, ja siirtyy seuraavan luo.' },
    ],
    lobby: [
      { d: 2, t: 'Yövirkailija ratkoo ristikkoa kielellä, jota et osaa. Yhtään ruutua hän ei ole täyttänyt.' },
      { d: 2, t: 'Retkimainos: JÄÄTIKÖT · VALAAT · REVONTULET. Kukaan tässä aulassa ei tule näkemään niistä yhtäkään.' },
      { d: 2, t: 'Kaksi matkustajaa nukkuu sohvalla istualtaan, puhelin kädessä kuin kynttilä.' },
      { d: 3, t: 'Kahviautomaatin punainen merkkivalo vilkkuu rytmissä, joka on melkein sana.' },
      { d: 3, t: 'Lasiovet liukuvat auki, vaikka kukaan ei tule, ja sulkeutuvat taas.' },
      { d: 3, t: 'Tulostetussa kyltissä on uusi vesiläikkä. Kuivuessaan se saa muodon.' },
      { d: 4, t: 'Ulkona parkkipaikalla: ajovalot, moottori tyhjäkäynnillä. Ne eivät sammu.' },
      { d: 4, t: 'Yövirkailija katsoo ohitsesi ovia kohti ja palaa sitten ristikkoonsa.' },
      { d: 4, t: 'Yksi nukkuvista matkustajista on poissa. Hänen puhelimensa on yhä sohvalla, näyttö ylöspäin, sähköposti auki.' },
      { d: 5, t: () => 'Virkailija sanoo nostamatta katsettaan: ' + LX('"Hän kysyi sinua."') },
      { d: 5, t: 'Ovet liukuvat auki. Kylmää ilmaa. Kukaan ei tule sisään. Ne jäävät auki.' },
    ],
    carpark: [
      { d: 2, t: 'Tuulta. Laavakenttiä. Tie, joka johtaa yhteen suuntaan pimeyteen ja toiseen suuntaan hiukan erilaiseen pimeyteen.' },
      { d: 2, t: 'Hotelli takanasi on valaistu kuin akvaario.' },
      { d: 3, t: 'Soraa. Yksi ainoa lyhtypylväs. Sadetta, joka ei saa päätettyä.' },
      { d: 3, t: 'Bussin muotoinen pimeä hahmo parkkipaikan perällä, moottori sammuksissa. Tai käynnissä.' },
      { d: 4, t: 'Parkkipaikan perällä olevassa bussissa palavat sisävalot. Jokaisella paikalla istuu joku.' },
      { d: 4, t: 'Joku seisoo bussin oven vieressä hyvin suorana, kädet ristissä edessään.' },
      { d: 5, t: 'Hän katsoo hotellia. Yhtä ikkunaa. Tiedät kyllä, mitä.' },
    ],
    morning: [
      { d: 2, t: 'Aamiaista korjataan pois. Sitä ei oikeastaan koskaan tarjoiltukaan.' },
      { d: 2, t: 'Joku on järjestänyt pikkuruiset hillopurkit riviin värin mukaan.' },
      { d: 2, t: 'Taapero selittää jotain tärkeää lämpöpatterille.' },
      { d: 3, t: 'Aamiaisella on vähemmän väkeä kuin aulassa eilen illalla. Eri hotelleja, kaikki sanovat. Eri hotelleja.' },
      { d: 3, t: 'Viereisen pöydän mies on saanut neljä sähköpostia, joissa on neljä eri aikaa. Hän lukee niitä ääneen kuin säätiedotusta.' },
      { d: 3, t: 'Ulkona, päivänvalossa, parkkipaikka näyttää parkkipaikalta. Siellä on bussi.' },
      { d: 4, t: 'Kukaan ei puhu enää mitään. Kaikki tuijottavat ovia.' },
      { d: 4, t: 'Yövirkailija on yhä vuorossa. Hän ei ole vaihtunut. Hän ratkoo samaa ristikkoa.' },
    ],
    airport: [
      { d: 3, t: 'Lähtevien taulu päivittyy. Lentosi putoaa yhden rivin alemmas. Mikään ei nouse ylemmäs.' },
      { d: 3, t: 'Jonon kärjessä seisova nainen on ollut siinä niin kauan, että on jo riisunut kenkänsä.' },
      { d: 3, t: 'Ainoalla tiskillä on kello. Kukaan ei soita sitä. Joku soittaa sitä. Ei mitään.' },
      { d: 4, t: 'Ulko-ovissa lukee VAIN SAAPUVAT. Aiemmin ne eivät olleet lukossa.' },
      { d: 4, t: 'Jono on lyhentynyt. Ketään ei ole palveltu.' },
      { d: 4, t: 'Tummansiniseen univormuun pukeutunut mies kävelee jonon päästä päähän laskien ihmisiä ja katoaa takaisin ovesta.' },
      { d: 5, t: 'Liikkeet sulkevat rullaovensa yksi kerrallaan, järjestyksessä, sinua kohti.' },
      { d: 5, t: 'Nimesi kuulutetaan kaiuttimista. Sitten ei kuulutetakaan. Kukaan muu ei kuullut sitä.' },
      { d: 5, t: 'Taulussa lukee LOS ANGELES ja sekunnin ajan jotain muuta.' },
      { d: 6, t: 'Jonossa ei ole enää muita kuin sinä ja ne, jotka tunnistat. Loput ovat menneet jonnekin.' },
      { d: 6, t: 'Tiskin virkailija katsoo sinua. On katsonut jo jonkin aikaa. Hän hymyilee.' },
    ],
  };

  /* ================================================================ chatbot
     Ally is the channel that always lies — but lies *specifically*. As dread
     rises it starts to know where you are. */
  const tail = (G) => {
    const d = G.D;
    if (d >= 5) return '\n\n' + G.pick(['Miksi olet yhä täällä?', 'Suurin osa asiakkaista on jo koneessa.', 'Näemme, että olet yhä siellä.']);
    if (d >= 3) return '\n\n' + G.pick(['Olet yhä huoneessa 214.', 'Pysy paikallasi.', 'Onko vielä jotain muuta? Mitään muuta ei ole.']);
    return '';
  };
  const chat = [
    {
      label: 'Missä hotellini on?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Majoituksesi oli Hótel Hraun. Toivottavasti viihdyit! Haluaisitko jättää arvion?' + tail(G);
        if (G.has('at_hotel')) return 'Olet Hótel Hraunissa, huoneessa 214. Pysy huoneessasi, kunnes sinut noudetaan.' + tail(G);
        return 'Hyvä kysymys! Sinulle on järjestetty majoitus hotellista Heathrow Renaissance Lodge, Bath Road. Varauslinkki on lähetetty sinulle sähköpostitse. 🛏️';
      },
    },
    {
      label: 'Milloin bussi lähtee?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Bussisi koneelle lähtee, kun koneeseen nousu on saatu päätökseen. Nouse kyytiin oman ryhmäsi mukana. 🚌' + tail(G);
        if (G.has('morning')) return 'Kuljetuksesi lentoasemalle on vahvistettu: lähtö klo 08:00. Ole aulassa 15 minuuttia ennen lähtöä.' + tail(G);
        if (G.has('at_hotel')) return 'Bussisi lähtee klo 04:30. Henkilökuntamme tulee koputtamaan ovellesi.' + tail(G);
        return 'Kaikille asiakkaille on järjestetty bussikuljetus. Siirry busseille. 🚌';
      },
    },
    {
      label: 'Mitä tapahtuu?',
      answer: (G) => G.pick([
        'Lentosi AB 0271 Los Angelesiin on aikataulussa. ✈️',
        'Autan mielelläni! Lento AB 0271 liikennöi tällä hetkellä aikataulun mukaisesti.',
        'Kaikki sujuu normaalisti. Voinko auttaa vielä jossakin muussa?',
      ]) + tail(G),
      do: (G) => G.nerves(2),
    },
    {
      label: 'Haluan tehdä valituksen.',
      warn: true,
      answer: 'Ikävä kuulla. Palautteesi on kirjattu varauksesi tietoihin. Kiitos, että lennät Albion Atlanticilla – teemme parhaamme. 🙏',
      do: (G) => G.strike(),
    },
  ];

  /* ================================================================ scenes */
  const scenes = {};

  scenes.title = {
    type: 'title',
    board: `AB 0271   LONTOO LHR  →  LOS ANGELES LAX      LÄHTENYT 20:05\n                                              TILA: ▮▮▮▮▮▮▮▮▮▮`,
    text: p(
      'Yhdeksän tuntia ilman välilaskuja, kotona ennen keskiyötä Tyynenmeren aikaa. Joit sen ylimääräisen kahvin. Teit kaiken oikein.',
      'Tämä on peli siitä, millaista on, kun sinulle kerrotaan hyvin kohteliaasti, että kaikki on kunnossa.',
      W('Innoituksena on toiminut tosielämän keskusteluketju eräästä uudelleenreititetystä lennosta. Pelin lentoyhtiö on kuvitteellinen. Bussit eivät.'),
    ),
  };

  scenes.howto = {
    loc: 'Turvaohjekortti',
    text: p(
      '<em>Lue kaikki.</em> Puhelimeesi (oikealla, tai PUHELIN-painikkeen takana) tulee lentoyhtiön sähköposteja, Ally-nimisen keskustelubotin viestejä, tekstiviestejä sekä valokuvia kaikista vastaan tulevista tulostetuista kylteistä. Joku puhuu totta. Se ei aina ole se, jolla on logo.',
      '<em>Kaksi mittaria.</em> Molemmat täyttyvät. Kumpikaan ei päätä peliä. Sen sijaan ne sulkevat ovia: mittarin täyttyessä osa siitä, mitä olisit voinut sanoa tai tehdä, käy mahdottomaksi, ja jäljelle jää se, mikä jää. Pienet valinnat täyttävät mittareita. Uni, ruoka ja muut ihmiset tyhjentävät niitä – hieman.',
      '<em>Merkitty</em> laskee ne valitukset, jotka lentoyhtiö on kirjannut sinusta. Kolmannen kohdalla yhtiö ryhtyy toimiin – siellä, missä voi.',
      'Paikat ovat tiloja, joissa voit liikkua. Tekeminen vie minuutteja; kello käy vain, kun teet jotakin. Busseja tulee ja menee. Katso niitä tarkkaan, ennen kuin nouset kyytiin. Oikea bussi näyttää siltä, miltä sinusta tuntuu.',
      'Yksi pelikerta kestää kaksi–kolmekymmentä minuuttia. Loppuja on kaksitoista, ja yksi niistä on Los Angeles.',
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
      'Matkustajasillassa tuoksuu kerosiini ja kokolattiamatto. Koneen ovella purseri: pitkä, ohimoilta harmaantunut, hymy silitetty samalla kertaa kuin paita. Hän ei katso tarkastuskortteja. Hän katsoo kasvoja, yksi kerrallaan, ja sanoo ' + V('"Tervetuloa lennolle"') + ' jokaiselle heistä, ikään kuin hänen täytyisi painaa se mieleensä.',
      'Rivi 31. Käytäväpaikka, 31B. Paikalla 31C suunnilleen sinun ikäisesi mies ja pokkari, jota hän on jo lakannut lukemasta. Hän nyökkää. Sinä nyökkäät. Siinä koko keskustelu, eikä siihen tule lisää vähään aikaan.',
      'Jossain takanasi kaksivuotiaalle kerrotaan kärsivällisesti, että kone ei lähde vielä. Kone ei lähde vielä.',
    ),
    choices: [
      { label: 'Tervehdi 31C:tä.', nd: -1, dd: -1, time: 20, do: (G) => { G.flag('met31c'); G.note('Hän vastasi tervehdykseen. Hän on menossa kotiin. Hän sanoi sen niin kuin se sanotaan yhdeksän tunnin lennon alussa: kotiin, ikään kuin se olisi paikka, jonne kone varmasti pääsisi perille.'); }, next: 'takeoff' },
      { label: 'Nosta laukku hattuhyllylle, istuudu, kiinnitä turvavyö ennen kuin kukaan ehtii pyytää.', kind: 'comply', dd: 2, time: 20, do: (G) => G.note('Vyö kiinni. Laukku hyllyllä. Ohi kulkiessaan purseri vilkaisi sitä ja nyökkäsi tuskin havaittavasti – niin kuin nyökkää mies, joka pitää listaa.'), next: 'takeoff' },
      { label: 'Kysy ovella seisovalta purserilta, onko lento aikataulussa.', nd: 1, time: 20, do: (G) => G.note(V('"Kaikki on aikataulussa",') + ' hän sanoi lämpimästi, ja sitten – ikään kuin perusteellisuuden nimissä – ' + V('"Kaikki."') + ' Hän katsoi edelleen perässäsi sisään tulevia matkustajia.'), next: 'takeoff' },
      { label: 'Lue istuintaskun turvaohjekortti. Kunnolla, kerrankin.', nd: -2, time: 20, do: (G) => G.note('Suoja-asento. Lähimmät uloskäynnit, jotka saattavat olla takanasi. Pieni piirros ihmisestä, joka liukuu mereen tyyni ilme kasvoillaan. Panet kortin takaisin. Et ole koskaan ennen lukenut sellaista, etkä tiedä, miksi luit nyt.'), next: 'takeoff' },
    ],
  };

  scenes.takeoff = {
    art: 'cabin',
    loc: 'Kiitotie 27L · Heathrow',
    text: p(
      'Purseri hoitaa turvaesittelyn itse, matkustamon etuosassa, kun video pyörii hänen takanaan äänettömänä. Hän tekee sen hitaasti. Hän tekee sen katsoen jokaista riviä vuorollaan, ikään kuin tarkistaisi, että uloskäynnit ovat siellä, missä kortti väittää.',
      V('"Siinä epätodennäköisessä tapauksessa. Siinä epätodennäköisessä tapauksessa. Asiakkaidemme turvallisuus on kaikkein tärkeintä."') + ' Se on outo lause turvaesittelyyn, ja hän sanoo sen kuin se olisi mitä tavallisin.',
      'Sitten moottorit, ja paine selkää vasten, ja Lontoo kallistuu pois oranssiin ja mustaan. Turvavyövalo palaa vielä pitkään sen jälkeen, kun sille olisi enää tarvetta.',
    ),
    choices: [
      { label: 'Katso esittely loppuun.', kind: 'comply', dd: 2, time: 40, do: (G) => G.note('Katsoit loppuun asti. Hän päätti esittelyn sinun puolellasi matkustamoa, ja hetken ajan sitä tehtiin nimenomaan sinulle, ja sitten se oli ohi ja hän käveli takaisin käytävää pitkin hipaisten istuinten selkänojia.'), next: 'service' },
      { label: 'Katso ikkunasta, kuinka Lontoo jää taakse.', nd: -2, time: 40, do: (G) => G.note('M25 kuin meripihkanvärinen rengas. Sitten pilveä. Sitten ei muuta kuin siiven vilkkuva valo ja omat kasvosi lasissa, matkalla kotiin.'), next: 'service' },
      { label: 'Vilkaise puhelinta vielä kerran ennen lentotilaa.', dd: 1, time: 40, do: (G) => { G.msg('sms', { from: 'Jo 💛', body: 'hyvää lentoo!!! laita viestii ku oot laskeutunu 🛫' }); G.note('Yksi viesti. Jo. Vastasit <em>laitan</em>, katsoit, kun viesti jäi lähtemättä, kytkit puhelimen lentotilaan ja tunsit, kuinka matkustamo sulkeutui päällesi kuin kansi.'); }, next: 'service' },
    ],
  };

  scenes.service = {
    art: 'cabin',
    loc: 'Matkalento · Irlanninmeren yllä',
    text: (G) => p(
      G.last(),
      'Illallinen tulee kärryllä, jota työntää kaksi lentoemäntää hymyillen kuin työkseen. Kanaa vai pastaa. Purseri seuraa kärryä muutaman rivin päässä; hän ei tarjoile, kävelee vain, katsoo tarjottimia, katsoo ihmisiä tarjottimien takana.',
      G.has('met31c') ? 'Paikan 31C mies otti pastan. Hän ei syö sitä. Hän katsoo selkänojan näytön karttaa, jolla pieni lentokone ei ole vielä päässyt Irlannin rannikolle.' : 'Paikan 31C mies otti pastan. Hän ei syö sitä. Hän ei ole sanonut sanaakaan.',
    ),
    choices: [
      { label: 'Kanaa.', time: 40, nd: -2, do: (G) => G.note('Kana oli kanaa samaan tapaan kuin turvaohjekortin meri oli merta. Söit sen. Olit menossa kotiin; siellä söisit kunnolla.'), next: 'night' },
      { label: 'Tilaa kahvi. Sitten toinen.', nd: 6, sub: 'Olet totuttamassa elimistöäsi Tyynenmeren aikaan, etkä aio antaa periksi.', time: 40, do: (G) => { G.flag('coffee'); G.nerves(-3); G.note('Kaksi kahvia. Lentokonekahvia, toisin sanoen lämmintä mielipidettä. Joit ne periaatteen vuoksi. Periaate oli Tyynenmeren aika, ja ohi kulkiessaan purseri katsoi toista kuppia hiukan pidempään kuin kuppi ansaitsee.'); }, next: 'night' },
      { label: 'Jätä illallinen väliin. Kallista selkänoja. Yritä nukkua jo nyt.', kind: 'comply', dd: 3, nd: -3, time: 40, do: (G) => G.note('Nukuit vähän, niin kuin lentokoneessa nukutaan: et niinkään nukkunut kuin olit pois päältä. Kun tulit pintaan, tarjottimet oli viety, matkustamon valot himmennetty, ja joku seisoi edessä käytävällä aivan liikkumatta.'), next: 'night' },
      { label: 'Kysy lentoemännältä kohteliaasti, onko purseri aina tällainen.', kind: 'conflict', nd: 4, dd: -2, time: 40, do: (G) => G.note('Hän naurahti kerran, ja sitten ei enää, ja katsoi käytävää pitkin sinne, missä purseri seisoi. ' + V('"Hän on hyvin perusteellinen",') + ' hän sanoi ja antoi sinulle pastan, jota et ollut pyytänyt.'), next: 'night' },
    ],
  };

  scenes.night = {
    art: 'cabin',
    loc: 'Matkalento · keskellä Atlanttia · neljäs tunti',
    enter: (G) => G.dread(2),
    text: (G) => p(
      G.last(),
      'Matkustamo on nyt pimeä. Näytöt enimmäkseen sammuksissa. Selkänojan kartalla pieni lentokone leijuu suunnattoman sinisen yllä, ja jossain ylhäällä oikealla lukee GRÖNLANTI, kuin huhuna.',
      'Purseri kävelee käytävää pitkin. Hitaasti, etuosasta alkaen, pieni kortti toisessa kädessä ja lyijykynä toisessa, ja joka rivin kohdalla hän pysähtyy, katsoo ja tekee merkinnän. Hän ei selitä. Kukaan ei kysy. Sinun rivisi kohdalla hän katsoo sinua, ja 31C:tä, ja tyhjää ikkunapaikkaa, ja kirjoittaa.',
      'Edessä etumatkustamon verho on vedetty kiinni. Sen takana on valoa, ja ihmisiä kulkee sen läpi nopeasti edestakaisin, ja sitten purseri seisoo sen edessä kädet ristissä, kääntyneenä ei verhoa vaan teitä muita kohti.',
    ),
    choices: [
      { label: 'Nuku, tai yritä ainakin.', kind: 'comply', dd: 2, nd: -3, time: 40, do: (G) => G.note('Suljit silmäsi. Niiden takana käytävällä kävely jatkui. Jossain edempänä nainen sanoi ' + V('"Onko hän kunnossa?"') + ' ja joku sanoi ' + V('"Palatkaa paikallenne",') + ' etkä sinä avannut silmiäsi, koska et ollut se, jolle puhuttiin. Vielä.'), next: 'cabin' },
      { label: 'Katso karttaa.', dd: 2, time: 40, do: (G) => G.note('Pieni lentokone liikkui niin hitaasti, että se näytti empivän. Sitten kartta ei hetkeen näyttänyt yhtään mitään, pelkkää sinistä, ja jäljellä oleva lentoaika pysyi lukemassa 5:12 pidempään kuin minuutti kestää.'), next: 'cabin' },
      { label: 'Mene etuosan vessaan. Kävele verhon ohi.', dd: 4, nd: 2, dreadMax: 90, time: 40, do: (G) => { G.flag('saw_galley'); G.note('Verhon raosta: joku keittiön lattialla, lentoemäntä polvillaan vieressä, peitto, käsi. Et näe, mikä on vialla, eikä sinulle kerrota. Purseri seisoo heidän yllään kädet ristissä – katsomassa ei lattiaa vaan matkustamoa, raon läpi, ja siis sinua. ' + V('"Palatkaa paikallenne",') + ' hän sanoi liikuttamatta mitään muuta kuin suutaan.'); }, next: 'cabin' },
      { label: 'Kysy 31C:ltä, näkikö hän kortin.', nd: -1, dd: -2, time: 40, do: (G) => { G.flag('met31c'); G.note(V('"Pääluvun laskenta",') + ' hän sanoi. ' + V('"Se tehdään aina ennen kuin laskeudutaan jonnekin, minne ei ollut tarkoitus."') + ' Hän sanoi sen kuin vitsin. Kumpikaan teistä ei nauranut. Se oli ensimmäinen asia, jonka hän oli sanonut neljään tuntiin.'); }, next: 'cabin' },
    ],
  };

  scenes.cabin = {
    art: 'cabin',
    loc: 'Jossain Grönlannin eteläpuolella · 37 000 jalkaa',
    text: (G) => p(
      G.last(),
      'Turvavyövalo syttyy, ja ääni on kuin lusikan kilahdus lasiin.',
      G.has('saw_galley') ? 'Kapteeni: eräs asiakas on sairastunut. Tiedät sen jo. Kone ohjataan Reykjavíkiin. Hän on pahoillaan. Hän sanoo sanan kahdesti, ja molemmilla kerroilla se kuulostaa siltä kuin ihminen sanoisi sen.' : 'Kapteeni: eräs asiakas on sairastunut. Kone ohjataan Reykjavíkiin. Hän on pahoillaan. Hän sanoo sanan kahdesti, ja molemmilla kerroilla se kuulostaa siltä kuin ihminen sanoisi sen.',
      'Matkustamo tekee sen, mitä matkustamot tekevät. Joku sanoo: ' + V('"Ei voi olla totta."') + ' Kolme riviä edempänä joku painaa kutsunappia, ja painaa yhä. Keittiön lähellä mies nousee seisomaan ja kysyy kantavalla äänellä, kuka tarkalleen ottaen maksaa hänen jatkolentonsa.',
      'Kukaan ei vastaa hänelle. Kutsunappi soi edelleen.',
    ),
    choices: [
      { label: 'Älä sano mitään. Katso karttaa selkänojan näytöltä.', kind: 'comply', dd: 4, sub: 'Pieni lentokone kääntyy.', time: 15, do: (G) => G.note('Kartan pieni lentokone on kääntynyt pohjoiseen. Sen alla sana GRÖNLANTI, ja sen alla ei mitään. Ympärilläsi valitus jatkuu ilman sinua.'), next: 'cabin_purser' },
      { label: 'Kysy lentoemännältä kohteliaasti, mitä tapahtuu laskeutumisen jälkeen.', nd: 2, time: 15, do: (G) => { G.flag('asked_crew'); G.nerves(3); G.note('Hän hymyili sinulle niin kuin ihmiset hymyilevät autoon jätetylle koiralle. ' + V('"Kaikesta tiedotetaan."') + ' Hän ei sanonut, kuka. Hänen takanaan keittiön lähellä oleva mies seisoi yhä.'); }, next: 'cabin_purser' },
      { label: 'Yhdy kuoroon. Ääneen. Sinua odottaa elämä Los Angelesissa.', kind: 'conflict', nd: 10, dreadMax: 80, time: 15, do: (G) => { G.strike(); G.flag('objected'); G.note('Sanoit sen. Et huutanut – mutta et hiljaakaan, ja muutama pää kääntyi, ja keittiön lähellä oleva mies osoitti sinua kuin todistuskappaletta. Hetken tuntui siltä kuin koko matkustamollinen ihmisiä olisi ollut samaa mieltä.'); }, next: 'cabin_purser' },
      { label: 'Paina kutsunappia, niin kuin muutkin.', kind: 'conflict', nd: 4, time: 15, do: (G) => G.note('Painoit sitä. Sinun nappisi yhtyi siihen, joka soi kolme riviä edempänä, ja toiseen takanasi, kunnes matkustamo oli pieni orkesteri, joka soitti yhtä ainoaa säveltä, eikä kukaan tullut, eikä kukaan ollut tulossakaan.'), next: 'cabin_purser' },
    ],
  };

  scenes.cabin_purser = {
    art: 'cabin',
    loc: 'Jossain Grönlannin eteläpuolella · 37 000 jalkaa',
    enter: (G) => G.dread(2),
    text: (G) => p(
      G.last(),
      'Sitten purseri tarttuu kuulutusluuriin. Kuulet aksentin ennen sanoja – lämmin, yläluokkainen, tavattoman kärsivällinen. Hän on odottanut, että kutsunappi lakkaisi soimasta. Se ei ole lakannut. Hän puhuu sen päälle.',
      V('"Hyvät naiset ja herrat. Minä vastaan tästä matkustamosta, ja asiakkaidemme turvallisuus on kaikkein tärkeintä. Jokainen, joka vastustaa tätä uudelleenreititystä tai esittää vastalauseita, poistetaan koneesta Islannissa. Teemme parhaamme."'),
      'Hiljaisuus. Keittiön lähellä oleva mies istuutuu. Kutsunappi sammuu. Kolme riviä taaempana joku naurahtaa kerran ja vaikenee.',
      G.has('objected') && W('Hän ei katso keittiön lähellä olevaa miestä. Hän katsoo sinun riviäsi.'),
    ),
    choices: [
      { label: 'Niele se.', kind: 'comply', dd: 3, time: 15, do: (G) => G.note('Nielit sen. Kaikki nielivät. On merkillistä, kuinka nopeasti kaksisataa ihmistä voi päättää olleensa kärsivällisiä koko ajan.'), next: 'cabin2' },
      { label: 'Katso ympärillesi. Katso, kuka muu pani vastaan.', time: 15, do: (G) => { G.nerves(-2); G.note('Neljät kasvot, ehkä viidet, yhä tiukkoina. Keittiön lähellä oleva mies. Nainen taaperon kanssa. Painat heidät mieleesi niin kuin painaisit mieleen uloskäynnit.'); }, next: 'cabin2' },
      { label: 'Naura. Kerran.', kind: 'conflict', nd: 3, dd: -2, time: 15, do: (G) => G.note('Nauroit kerran, ja joku kaksi riviä taaempana nauroi mukana, ja sitten te molemmat lopetitte, koska purseri oli laskenut luurin hyvin hellävaraisesti ja katsoi käytävää pitkin.'), next: 'cabin2' },
    ],
  };

  scenes.cabin2 = {
    art: 'cabin',
    loc: 'Laskeutumassa · Pohjois-Atlantti',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      (G.has('met31c') ? 'Paikan 31C mies sanoo hiljaa: ' : 'Paikan 31C mies, joka ei ole sanonut sanaakaan Heathrow\'n jälkeen, sanoo: ') + V('"Eiväthän ne oikeasti voi tehdä niin. Vai voivatko?"'),
      'Hän tarkoittaa koneesta poistamista. Hän katsoo sinua, ikään kuin sinä ehkä tietäisit.',
      'Käytävällä purseri kävelee hitaasti kohti koneen perää ja lukee istuinnumeroita yläpaneeleista niin kuin luetaan listaa, jonka on itse kirjoittanut.',
    ),
    choices: [
      { label: '"Ei, en usko, että voivat."', dd: -4, nd: -2, time: 45, do: (G) => { G.collect(1); G.flag('ally31c'); G.note('Hän nyökkäsi eikä näyttänyt rauhoittuneelta, etkä sinä ollut varma, oliko sanomasi ollut rauhoittavaa. Mutta nyt teitä oli kaksi.'); }, next: 'cabin3' },
      { label: '"En rehellisesti sanoen tiedä."', dd: -1, time: 45, do: (G) => { G.flag('ally31c'); G.note('Hän nyökkäsi. ' + V('"Niin. En minäkään."') + ' Katsoitte yhdessä selkänojan karttaa. Pieni lentokone oli sen laidalla.'); }, next: 'cabin3' },
      { label: 'Laita kuulokkeet korviin.', kind: 'comply', dd: 5, nd: -2, time: 45, do: (G) => { G.nerves(2); G.note('Laitoit kuulokkeet korviin. Mitään ei soinut. Jätit ne korviin. Kun nostit katseesi, purseri oli rivisi kohdalla, ei katsonut sinua, ja sitten hän oli jo ohi.'); }, next: 'cabin3' },
      { label: 'Paina kutsunappia ja kysy uudelleen.', kind: 'conflict', nd: 5, dd: 2, time: 45, do: (G) => { G.nerves(4); G.flag('asked_crew'); G.note('Nappi syttyi. Kukaan ei tullut. Hetken kuluttua se sammui itsestään, ja purseri kolme riviä edempänä kääntyi ja katsoi pääsi yläpuolella olevaa paneelia, ja sitten sinua.'); }, next: 'cabin3' },
    ],
  };

  scenes.cabin3 = {
    art: 'cabin',
    loc: 'Loppulähestyminen · Keflavík',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      'Taas purseri, luuri kädessä. ' + V('"Pysykää laskeutumisen jälkeen istuimillanne turvavyöt kiinnitettyinä, kunnes ensihoitohenkilöstö on huolehtinut etumatkustamossa olevasta asiakkaastamme. Ilmoitan teille, kun voitte nousta. Minä ilmoitan."'),
      'Sadetta ikkunoissa. Alhaalla rannikko kuin raaputettu jälki. Valot kaupungista, joka ei ole Reykjavík, ja sitten ei valoja lainkaan.',
      'Et ole koskaan ennen laskeutunut yöllä paikkaan, jossa kiitotie tuli näkyviin vasta, kun se oli jo allasi.',
    ),
    choices: [
      { label: 'Katso ulos ikkunasta.', dd: 5, nd: 3, dreadMax: 90, time: 25, do: (G) => { G.nerves(3); G.note('Sinisiä valoja, sitten oransseja, sitten sinisiä. Ambulanssi ovet selällään märällä asfaltilla, ja sen vieressä – ei lähellä, vaan vieressä – tummansiniseen univormuun pukeutunut mies, hyvin suorassa. Ääni käytävältä, aivan korvasi juuresta: ' + V('"Ikkunaluukku alas, kiitos."')); }, next: 'ground' },
      { label: 'Pidä katseesi selkänojan näytön kartassa.', kind: 'comply', dd: 4, time: 25, do: (G) => G.note('Pikkuinen kone ylitti kartan reunan, eikä sitä hetkeen ollut millään kartalla. Sitten näyttö pimeni ja näytti sinulle omat kasvosi.'), next: 'ground' },
      { label: 'Laske rivit lähimmälle uloskäynnille. Kahdesti.', nd: -2, time: 25, do: (G) => { G.nerves(-2); G.note('Kuusi riviä. Kuusi riviä. Sellaisesta tiedosta on hyötyä vain, jos jotain tapahtuu, ja olet alkanut toivoa, että jotain tapahtuisi.'); }, next: 'ground' },
    ],
  };

  scenes.ground = {
    art: 'cabin',
    loc: 'Keflavík · maassa · moottorit sammuksissa',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      'Kolmekymmentä minuuttia maassa. Ensihoitajat ovat tulleet ja menneet, tai eivät ole tulleet. Kukaan ei ole sanonut mitään. Turvavyömerkki palaa yhä. Purseri seisoo matkustamon etuosassa kädet ristissä ja katselee käytävää pitkin teitä kaikkia, kärsivällisesti, kuin olisitte jono.',
      'Mies paikalla 31C, hiljaa: ' + V('"Ei me taideta olla menossa LA:han."'),
    ),
    choices: [
      { label: 'Nouse seisomaan. Ihan vain venyttelemään.', kind: 'conflict', nd: 6, dd: -3, dreadMax: 75, time: 15, do: (G) => { G.nerves(4); G.flag('stood'); G.dread(4); G.note(V('"Istuutukaa, olkaa hyvä."') + ' Ei kovaan ääneen. Hänen ei tarvinnut korottaa ääntään. Kaksisataa ihmistä katsoi, kun istuuduit.'); }, next: 'landing' },
      { label: 'Pysy paikallasi. Katso, kun purseri katsoo sinua.', kind: 'comply', dd: 5, time: 15, do: (G) => G.note('Hän katsoi jokaisen rivin vuorollaan, ja kun hän ehti sinun riviisi, hän ei pysähtynyt, eikä hän myöskään ollut pysähtymättä.'), next: 'landing' },
      { label: 'Kysy 31C:ltä, mitä hän arvelee seuraavaksi tapahtuvan.', nd: -2, time: 15, do: (G) => { G.collect(G.has('ally31c') ? 0 : 1); G.flag('ally31c'); G.note(V('"Hotelliin kai. Tai sitten ne jättää meidät tänne."') + ' Hän naurahti, mietti sitten asiaa ja lakkasi nauramasta.'); }, next: 'landing' },
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
          from: 'Albion Atlantic Customer Care', subj: 'Majoituksesi täksi yöksi',
          body: `Hyvä asiakas,\n\nLentosi AB 0271 on operatiivisista syistä ohjattu varakentälle, ja lento viivästyy yön yli. Olemme järjestäneet sinulle majoituksen.\n\nVahvista huoneesi alla olevan linkin kautta:\n\n<a href="#" onclick="return false">Heathrow Renaissance Lodge — Bath Road, Hounslow TW6</a>\n\nKuljetus majoitukseen järjestetään.\n\nPahoittelemme aiheutunutta vaivaa. Teemme parhaamme.`,
          actions: [{ label: 'Avaa varaussivu', if: (G) => !G.has('at_hotel') && !G.has('booked'), next: 'heathrow' }],
        });
        G.bot('Hei! Olen Ally, Albion Atlanticin virtuaaliassistentti. Lentosi AB 0271 näyttää olevan aikataulussa. Miten voin auttaa? ✈️');
      }
    },
    text: (G) => p(
      G.last(),
      'Turvavyömerkki sammuu ilman kuulutusta. Se on se kuulutus. Terminaali on valaistu kuin jääkaapin sisus. Muutama sata teitä laahustaa koneesta sisään, ohi huomioliivimiehen, joka ei katso ketään.',
      G.has('objected') && W('Ulos mennessäsi purseri katsoi sinua hitusen liian pitkään.'),
      'Passintarkastus. Pitkä jono. Sitten miehistö kävelee sen ohi – koko miehistö, peräkanaa, vetolaukut samassa tahdissa, katsomatta oikealle eikä vasemmalle – ovesta, jossa lukee STAFF. Ovi ei niinkään sulkeudu heidän perässään kuin lakkaa olemasta ovi.',
      'Jono katselee tätä vierestä. Kukaan ei sano mitään. Puhelimesi värähtää.',
    ),
    choices: [
      { label: 'Lue sähköposti. Avaa linkki.', kind: 'comply', dd: 8, sub: 'Majoitus. Vihdoin.', next: 'heathrow' },
      { label: 'Kirjoita chatbotille yhä hätäisemmin.', kind: 'comply', dd: 4, nd: 4, time: 10, do: (G) => { G.nerves(4); G.bot('Autan mielelläni! Lentosi AB 0271 on tällä hetkellä aikataulussa. Voinko auttaa jossain muussa? 😊'); G.note('Ally sanoo, että lento on aikataulussa. Katsot konetta ikkunasta. Sen valot on sammutettu.'); }, next: 'hall' },
      { label: 'Etsi joku ihminen. Ihan kuka tahansa.', dd: -4, dreadMax: 85, time: 10, next: 'icelander' },
      { label: 'Odota. Kyllä joku kohta kuuluttaa jotain.', kind: 'comply', dd: 8, sub: 'Aina joku kuuluttaa.', time: 20, next: 'wait1' },
    ],
  };

  scenes.heathrow = {
    art: 'terminal',
    loc: 'Varaussivu · Heathrow Renaissance Lodge',
    text: p(
      'Sivu latautuu hitaasti ja sitten yhdellä kertaa. Kuva sängystä. Kuva aamiaisesta. <em>Bath Road, Hounslow, TW6.</em> Kahdentoista minuutin matka terminaalista 5 hotellin ilmaisella kuljetuksella.',
      'Olet 1 900 kilometrin päässä terminaalista 5.',
      'Sivulla on iso painike. Siinä lukee VAHVISTA. Sen alla, pienemmällä kirjasimella: <em>Kuljetus majoitukseen järjestetään.</em>',
    ),
    choices: [
      { label: 'Vahvista.', kind: 'comply', dd: 10, sub: 'Sanoivathan he, että kuljetus järjestetään.', time: 5, do: (G) => { G.flag('booked'); G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Varaus vahvistettu — autosi odottaa', body: 'Majoituksesi on vahvistettu.\n\nKuljettaja odottaa sinua saapuvien aulan ulkopuolella. Tunnistat hänet Albion Atlanticin vaakunasta.\n\nArvioitu matka-aika: —:—' }); }, next: 'car' },
      { label: 'Sulje se. Olet Islannissa.', dd: -3, dreadMax: 90, time: 5, do: (G) => { G.nerves(2); G.note('Suljit varaussivun. Sähköposti on yhä paikallaan, logoineen päivineen, ja odottaa kärsivällisesti.'); }, next: 'hall' },
    ],
  };

  scenes.car = {
    art: 'stand',
    loc: 'Keflavík · Saapuvien edustalla',
    text: p(
      'Auto on tosiaan paikalla. Musta, pitkä, tahraton, ovessa pieni kultainen vaakuna. Kuljettaja pitelee tablettia, jossa lukee nimesi – nimesi, oikein kirjoitettuna, mihin lentoyhtiö ei ole tähän mennessä pystynyt kertaakaan.',
      V('"Renaissanceen?"'),
      'Hän avaa takaoven. Lämmintä ilmaa. Nahkaa. Parkkipaikan takana tie katoaa pimeyteen, jolla ei näytä olevan loppua.',
    ),
    choices: [
      { label: 'Nouse kyytiin.', kind: 'comply', sub: 'Lämmintä.', do: (G) => G.end('accommodated') },
      { label: 'Ei. Ei kiitos.', dd: 5, dreadMax: 85, time: 5, do: (G) => { G.nerves(5); G.dread(8); G.note('Kuljettaja ei näyttänyt yllättyneeltä. Hän sulki oven, jäi seisomaan paikalleen ja seisoi siinä yhä, kun vilkaisit taaksesi ovilta.'); }, next: 'hall' },
    ],
  };

  scenes.icelander = {
    art: 'terminal',
    loc: 'Keflavík · Saapuvat',
    text: (G) => p(
      'Ovien luona seisoo kädet selän takana nainen, jonka univormu ei ole lentoyhtiön – ehkä lentoaseman, tai tullin, tai sitten hän on vain ihminen, jolla sattuu olemaan fleecetakki ja siinä merkki.',
      'Hän kuuntelee. Hän katsoo puhelintasi. Hän katsoo sähköpostia ja sen logoa.',
      V(LX('"Älkää menkö sähköpostien perässä",')) + ' hän sanoo ystävällisesti, sen äänellä, joka on sanonut saman tänä yönä jo neljäkymmentä kertaa. ' + V(LX('"Busseja on."')),
      'Kysyt, missä. Hän viittaa, ylimalkaisesti, Islannin suuntaan.',
    ),
    choices: [
      { label: 'Kysy, puhuuko hän ranskaa.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 5, do: (G) => { G.flag('fr_asked'); G.flag('hint_icelander'); G.nerves(-4); G.dread(-4); G.note(LX('"Vähän. Ei sähköposteja. Busseja on."') + ' Hän sanoi sen sinun kielelläsi, varovasti, kuin kantaisi jotain täyttä.'); }, next: 'hall' },
      { label: 'Kiitä häntä. Lähde etsimään busseja.', do: (G) => { G.flag('hint_icelander'); G.nerves(-4); G.note('"Busseja on", hän sanoi. Se on vankin lause, jonka kukaan on sanonut sinulle sitten Grönlannin.'); }, next: 'hall' },
    ],
  };

  scenes.wait1 = {
    art: 'terminal',
    loc: 'Keflavík · Saapuvat',
    text: (G) => p(
      'Kaksikymmentä minuuttia. Passintarkastuksen jono purkautuu. Kukaan ei kuuluta mitään.',
      'Ihmiset, joiden kanssa lensit, ajelehtivat kaksittain ja kolmittain kohti aulan perää, missä on ovi, jossa ei lue yhtään mitään.',
      G.t >= T(1, 2, 0) && W('Aulan tässä päässä valot ovat himmenneet puoleen.'),
    ),
    choices: [
      { label: 'Odota vielä. Kuulutus tulee kyllä.', kind: 'comply', dd: 6, sub: 'Täällä on kuulutusjärjestelmä. Kaiuttimet näkyvät.', time: 25, next: (G) => (G.t >= T(1, 2, 20) ? 'wait2' : 'wait1'), do: (G) => { G.nerves(8); G.dread(8); } },
      { label: 'Mene virran mukana.', dreadMax: 90, time: 5, next: 'hall' },
    ],
  };

  scenes.wait2 = {
    art: 'terminal',
    loc: 'Keflavík · Saapuvat',
    text: p(
      'Aula on nyt tyhjä; jäljellä olet vain sinä, siivooja ja katon pitämä ääni.',
      'Puhelimesi värähtää. Sähköposti. <em>Olemme järjestäneet sinulle bussit.</em> Siinä ei sanota minne. Siinä ei sanota milloin. Se on lähetetty tunti sitten.',
      'Takanasi valot himmenevät neljännekseen.',
    ),
    enter: (G) => { atLeast(G, 45); if (G.once('coach_mail_w')) G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Jatkokuljetus järjestetty', stamp: G.t - 60, body: 'Hyvä asiakas,\n\nOlemme järjestäneet bussit, jotka kuljettavat sinut majoitukseesi.\n\nSiirry busseille.\n\nTeemme parhaamme.' }); },
    choices: [
      { label: 'Siirry busseille.', kind: 'comply', time: 15, do: (G) => G.end('terminal') },
      { label: 'Juokse ovelle, jossa ei lue mitään.', nd: 5, dreadMax: 92, time: 5, do: (G) => { G.nerves(10); G.note('Juoksit. Kukaan ei pysäyttänyt sinua. Ovi, jossa ei lukenut mitään, avautui kylmään ilmaan, natriumlamppujen valoon ja – luojan kiitos – muiden ihmisten joukkoon.'); }, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 01:20 the hall (hub) */
  scenes.hall = {
    art: 'terminal',
    loc: 'Keflavík · Matkatavarahalli',
    enter: (G) => {
      if (G.t >= T(1, 2, 40)) { G.go('wait2'); return; }
      if (G.once('hall_intro')) G.note(p(G.last(), p(
        'Ruumamatkatavaroita ei luovuteta. Mies tiskin takana selittää asian katsettaan nostamatta: laukut ovat <em>järjestelmässä</em>. Sinäkin olet oletettavasti järjestelmässä. Kumpaakaan teistä se ei ole auttanut.',
        'Fleecetakkinen mies kuljeksii luoksesi. ' + V('"Hei. Tänne tulee kai busseja? Tuonne? Kuulemma?"') + ' Hän osoittaa. Kukaan ei ole kuuluttanut tätä. Ei sähköpostia, ei tekstiviestiä, ei kuulutusta. Vain mies fleecetakissa.',
      )));
    },
    text: (G) => hub(G,
      `${G.clock(G.t)}. Saapuvien aula. Kaikki on kiinni. Sinulla ei ole laukkua, ei takkia, ei hammasharjaa, ja puhelimen akussa on ${G.battery()}%.`,
      'hall',
      G.t >= T(1, 2, 10) ? W('Aula tyhjenee. Sinun ei ehkä kannata jäädä sinne viimeiseksi.') : ''),
    choices: [
      { label: 'Kysy laukustasi. Kohteliaasti.', kind: 'comply', dd: 2, nerveMax: 70, time: 8, once: 'bag_nice', do: (G) => { G.nerves(2); G.note('Mies tiskin takana sanoo, että laukut ovat järjestelmässä. Kysyt, missä järjestelmässä. Hän sanoo: järjestelmässä. Kysyt, milloin. Hän sanoo: kun asia on selvitetty. Hän ei ole nostanut katsettaan kertaakaan.'); }, next: 'hall' },
      { label: 'Vaadi laukkuasi. Siinä on hammastahnasi.', kind: 'conflict', nd: 8, sub: 'Jonkun se on tehtävä.', time: 10, once: 'bag', do: (G) => { G.strike(); G.note('Hän nostaa katseensa. Mikään muu ei muutu. ' + V('"Kirjaan tämän ylös."') + ' Hän kirjaa sen ylös.'); }, next: 'hall' },
      { label: 'Kierrä suljetut liikkeet.', dd: 3, time: 12, once: 'shops', do: (G) => { G.nerves(-1); G.dread(2); G.note('Tax-free: rullaovet alhaalla. Kahvila: tuolit pöydillä, kahvikone irrotettuna seinästä ja käännettynä seinään päin. Automaatti, joka kelpuuttaa vain islantilaiset kortit, täynnä tuotteita, joiden nimissä on ð-kirjain. Seisot sen edessä pidempään kuin oli tarkoitus.'); }, next: 'hall' },
      { label: 'Kokeile STAFF-ovea.', dreadMax: 80, time: 6, once: 'staff', do: (G) => { G.dread(8); G.nerves(5); G.note('Lukossa. Kahva on lämmin, kuin joku olisi hetki sitten pidellyt sitä. Painat korvasi ovea vasten. Sen takana ei ole mitään. Ei hiljaisuutta – ei mitään. Kun peräännyt, kyltissä lukee STAFF, ja sen alla, pienemmällä, mitä et ollut aiemmin huomannut: ONLY.'); }, next: 'hall' },
      { label: 'Katso matkatavarahihnaa.', dd: 3, time: 8, once: 'carousel', do: (G) => { G.dread(4); G.note('Hihna pyörii. Yksi laukku kiertää. Se ei ole sinun. Siinä on tummansininen lappu ja lapussa kultainen vaakuna. Laukku kiertää toisen kierroksen, sitten hihna pysähtyy, laukku on poissa, ja hihna on tyhjä tavalla, joka antaa ymmärtää, ettei siinä ole koskaan ollutkaan mitään.'); }, next: 'hall' },
      { label: 'Juttele fleecemiehen kanssa.', nd: -3, dd: -3, nerveMax: 90, time: 8, once: 'talk_fleece', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_hearsay'); G.note(V('"Joku puhui busseista. Joku huomioliivissä. Ei niiden porukkaa."') + ' Hän vilkaisee sähköpostia puhelimestasi. ' + V('"Joo, mä sain saman. En mä mihinkään Heathrow\'hun lähde."')); }, next: 'hall' },
      { label: 'Juttele taaperoa kantavalle naiselle.', nd: -2, dd: -3, nerveMax: 80, time: 8, once: 'talk_mother', do: (G) => { G.collect(1); G.nerves(-2); G.flag('hint_hearsay'); G.msg('sms', { from: '+354 ··· ····', body: 'älä mee siihen kivaan' }); G.note('Taapero nukkuu hänen olkaansa vasten tavalla, josta päätellen olkapää on kantava rakenne. ' + V('"Joku huomioliivissä sanoi mulle: ei siihen kivaan. En tiedä mitä se tarkoittaa. Mä meen sen mukaan."') + ' Samalla kun hän sanoo sen, puhelimesi värähtää: tekstiviesti tuntemattomasta numerosta.'); }, next: 'hall' },
      { label: 'Etsi mies paikalta 31C.', nd: -3, dd: -3, nerveMax: 95, time: 8, once: 'talk_31c', if: (G) => G.has('ally31c'), do: (G) => { G.collect(1); G.nerves(-3); G.note('Hän seisoo ovien luona ja katselee ulos pimeään. ' + V('"Eli busseja on",') + ' hän sanoo. ' + V('"Hienoa. Kenen?"') + ' Kumpikaan teistä ei tiedä. Päätätte sanomatta sitä ääneen nousta samaan bussiin.'); }, next: 'hall' },
      { label: 'Juttele ikkunan luona seisovalle vanhemmalle pariskunnalle.', nd: -2, dd: -2, nerveMax: 75, time: 8, once: 'talk_couple', do: (G) => { G.collect(1); G.nerves(-2); G.note('He ovat lentäneet paljon eivätkä ole huolissaan, he sanovat huolestuneiden ihmisten äänellä. ' + V('"Kyllä se lopulta joku tuloste on",') + ' hän sanoo. ' + V('"Aina se lopulta on joku tuloste."')); }, next: 'hall' },
      { label: 'Mene vessaan. Olet pidätellyt Grönlannista asti.', nd: -3, time: 12, once: 'loo', do: (G) => { G.flag('bathroom'); G.nerves(-2); G.note('Jonkinlaista helpotusta. Kun tulet ulos, aula on järjestynyt uusiksi: samat ihmiset eri paikoissa, kaikki kasvot samaa ovea kohti.'); }, next: 'hall' },
      { label: 'Mene sinne, minne fleecemies osoitti.', dd: -2, time: 5, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~02:00 bus stand 1 */
  scenes.buses1 = {
    art: 'stand',
    loc: 'Keflavík · Bussilaituri · ulkona',
    text: (G) => p(
      'Ulkona on kaksi astetta lämmintä, ja tuuli on tullut pitkän matkan sinua vastaan. Kolme bussia käy tyhjäkäyntiä natriumlamppujen alla. Kanssamatkustajasi kulkevat niitä kohti sillä hajanaisella, epävarmalla tavalla, jolla kulkevat ihmiset, joille ei ole kerrottu mitään.',
      G.has('bathroom') ? 'Olet myöhässä. Suurin osa joukosta on jo noussut johonkin kyytiin. Ovet alkavat sulkeutua.' : 'Kukaan ei tarkasta lippuja. Kukaan ei tarkasta mitään.',
      G.has('hint_hearsay') && W('"Ei siihen kivaan."'),
      W('Katso ennen kuin nouset kyytiin. Katsominen maksaa muutaman minuutin. Kyytiin nouseminen maksaa enemmän.'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: G.pick(['#c7c3b6', '#b8b4a6', '#8d8a80']), windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'night' },
        name: G.pick(['Valkoinen bussi ilman minkäänlaisia tunnuksia', 'Luonnonvalkoinen bussi, jonka sivupeili on haljennut', 'Harmaa bussi, jonka ovesta irtoaa vuokraamon tarra']),
        sign: G.pick(['ALBION ATL → HOTEL', 'AB0271  HOTEL', 'FLIGHT PPL – HOTEL']), signStyle: 'paper',
        look: ['Huomioliivinen kuljettaja syö voileipää. Hän kohauttaa olkiaan, kun katsot häntä.', G.has('bathroom') ? 'Moottori käynnissä. Ovi alkaa sulkeutua.' : 'Moottori käynnissä. Ovi auki.'],
        hidden: ['Fleecemies istuu kolmannella rivillä. Taapero nukkuu jonkun sylissä.', 'Kaikilla kyydissä on yllään samat vaatteet kuin koneessa, ja se näkyy.'],
        boardLabel: G.has('bathroom') ? 'Juokse' : 'Nouse kyytiin',
        board: { time: 5, do: (G) => { if (G.has('bathroom')) G.nerves(6); G.flag('bus1_ok'); }, next: 'ride' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'night' },
        name: 'Tummansininen bussi, jonka kyljessä on kultainen vaakuna',
        sign: 'ALBION ATLANTIC WELCOMES YOU', signStyle: 'led',
        look: ['Kuljettajalla on purserin univormu. Hän hymyilee nimenomaan sinulle.', 'Sisävalot kirkkaat ja lämpimät. Paljon vapaita paikkoja.'],
        hidden: ['Matkustajat näyttävät levänneiltä. Silitetyt paidat. Joku on juuri käynyt parturissa.', 'Yhdetkään kasvot eivät ole tutut. Lensit näiden ihmisten kanssa yhdeksän tuntia.', 'Hänen nimikylttinsä on tyhjä.'],
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const flybus = {
        key: 'city',
        art: { livery: '#cfae36', windows: 'dim', passengers: 'luggage', sign: 'print', driver: 'plain', ground: 'night' },
        name: 'Keltainen bussi paikallisliikenteen väreissä',
        sign: 'FLYBUS · REYKJAVÍK BSÍ', signStyle: 'print',
        look: ['Kuljettaja selailee tablettia pitkästyneenä.', 'Matkustajia reppuineen ja vetolaukkuineen.'],
        hidden: ['Heillä on matkatavaroita. Sinulla ei ole matkatavaroita.', 'Tarra oven pielessä: LIPPU PAKOLLINEN.'],
        board: { time: 5, next: 'detour' },
      };
      return G.shuffle([correct, crest, flybus]);
    },
    choices: [
      { label: 'Älä nouse mihinkään. Sähköpostissa puhuttiin busseista. Odota ohjeita.', kind: 'comply', dd: 10, sub: 'Busseista puhuttiin. Nämä eivät välttämättä ole ne bussit.', time: 35, next: 'wait2' },
    ],
  };

  scenes.detour = {
    art: 'road',
    loc: 'Tie 41 · kohti Reykjavíkia',
    text: p(
      'Neljänkymmenen minuutin ajon jälkeen reppureissaaja kysyy, missä hostellissa olet majoittunut, ja sinä ymmärrät.',
      'Bussi jättää sinut kaupungin linja-autoasemalle, joka haisee dieselille ja kanelille. Taksikuski ottaa sinut kyytiin säälistä – ja 9 800 kruunusta – ja ajaa sinut takaisin pimeyteen, hotelliin, jolle on kerrottu odottaa sinua ja joka ei ole varma, uskooko sitä.',
      'Kello on 03:35. Sinulla on ne vaatteet, jotka ovat päälläsi. Eivätkä edes ne hyvät.',
    ),
    enter: (G) => { G.S.t = T(1, 3, 35); G.nerves(18); G.flag('detoured'); G.dread(8); },
    choices: [{ label: 'Mene sisään.', next: 'hotel_arrive' }],
  };

  /* ---------------------------------------------------------------- the ride */
  scenes.ride = {
    art: 'road',
    loc: 'Maantie · jossain Reykjanesin niemimaalla',
    enter: (G) => {
      G.dread(4);
      if (G.once('coach_mail')) G.at(G.t + 30, 'email', { from: 'Albion Atlantic Customer Care', subj: 'Jatkokuljetus järjestetty', body: 'Hyvä asiakas,\n\nOlemme järjestäneet bussit, jotka kuljettavat sinut majoitukseesi. Siirry busseille.\n\nJos tarvitset apua bussien löytämisessä, ota meihin yhteyttä.\n\nTeemme parhaamme.' });
      if (G.once('coach_txt')) G.at(G.t + 45, 'sms', { from: 'AlbionATL', body: 'AB0271: Hotellisi on HEATHROW RENAISSANCE LODGE. Älä vastaa tähän viestiin.' });
    },
    text: (G) => p(
      'Bussi ajaa viimeistenkin valojen ohi, ja sitten se vain jatkaa matkaa.',
      'Laavakenttiä matalan taivaan alla. Ei taajamia. Ei kylttejä, joita osaisit lukea. Et tiedä, kuka sinut on vienyt tai minne olet matkalla. Sinut on joko otettu hellästi EU:n sääntelykehyksen syleilyyn, tai sitten sinut on siepattu, ja samalla bussillinen uupuneita ihmisiä, jotka ovat liian kohteliaita kysyäkseen.',
      G.has('coffee') && W('Sydämesi tekee jotain outoa. Se johtuu kahvista. Se johtuu aivan varmasti kahvista.'),
      'Matka on pitkä. Se alkaa olla huolestuttavan pitkä.',
      'Takapenkiltä kaksivuotias huokaa: ' + V('"Mikä päivä."'),
    ),
    choices: [
      { label: 'Naura. Kaikki nauravat. Kohteliaasti ja hieman paniikissa.', nd: -6, dd: -4, nerveMax: 85, time: 50, do: (G) => { G.nerves(-5); G.collect(1); }, next: 'hotel_arrive' },
      { label: 'Ole hiljaa. Tuijota pimeyteen.', kind: 'comply', dd: 4, time: 50, do: (G) => G.nerves(3), next: 'hotel_arrive' },
      { label: 'Mene eteen. Kysy kuljettajalta, minne tämä bussi on menossa.', kind: 'conflict', nd: 5, dd: 3, time: 50, do: (G) => { G.nerves(6); G.flag('asked_driver'); }, next: 'hotel_arrive' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~03:00 the hotel */
  scenes.hotel_arrive = {
    art: 'lobby',
    loc: 'Hótel Hraun · Vastaanotto',
    enter: (G) => {
      G.flag('at_hotel'); atLeast(G, 38);
      if (G.once('hotel_paper')) G.msg('paper', { from: 'Teipattu vastaanottotiskiin', subj: 'Tulostettu lappu', body: '<b>PASSENGERS ALBION ATLANTIC AB0271</b>\n\nBUS TO AIRPORT: <b>11:00</b>\n\nPlease wait in lobby.\n\n(No delivery service until 11:00 am)' });
      if (G.once('hotel_bot')) { G.at(T(1, 3, 50), 'chat', { body: 'Viihdytkö huoneessasi? 🙂' }); G.at(T(1, 4, 15), 'chat', { body: 'Bussisi lähtee klo 04:30. Henkilökuntamme tulee koputtamaan ovellesi.' }); }
    },
    text: (G) => p(
      G.has('asked_driver') && W('Kuljettaja ei vastannut kertaakaan. Radiosta tuli jotain islanninkielistä, joka saattoi olla säätiedotus.'),
      'Hotelli siis. Matala, leveä, sellainen paikka, joka on rakennettu konferensseja varten, joita ei koskaan tullut. Yöportieeri jakaa avainkortteja kenkälaatikosta. Sinun kortissasi lukee 214.',
      'Ei, hammastahnaa ei ole. Ei, hammasharjojakaan ei ole. Tänne ei tule mitään kuljetuksia ennen huomisaamun yhtätoista. Automaatti on. Virkailija sanoo tämän kuin ojentaisi sinulle pelastuslautan.',
      'Tiskiin on teipattu A4-arkki, kirjoitettu Arialilla, hieman vesitahrainen. Siinä lukee, että bussi lentokentälle lähtee 11:00. Se on ensimmäinen tieto koko yönä, jossa on mukana kellonaika eikä logoa.',
    ),
    choices: [{ label: 'Mene ylös huoneeseen.', time: 8, next: 'room' }],
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
      if (G.once('room_intro')) G.note(p(G.last(), 'Sänky, vedenkeitin, televisio, ikkuna parkkipaikalle ja pikkuruiset shampoo- ja hoitoainepullot, joilla jo harkitset peseväsi hampaasi. Ovessa on turvaketju. Laitat ketjun päälle. Sitten otat sen pois, varmuuden vuoksi, ja laitat takaisin.'));
    },
    text: (G) => hub(G, roomStatus(G), 'room'),
    choices: (G) => [
      { label: 'Syö. Sipsejä ja kaksi pikkupulloa viiniä.', nerveMax: 90, sub: 'Tyttöjen illallinen.', if: (G) => G.has('crisps') && !G.has('dinner'), time: 12, do: (G) => { G.flag('dinner'); G.nerves(-10); G.note('Suolaa, sitten viiniä, sitten suolaa. Syöt sängyn reunalla istuen, pussi molemmissa käsissä kuin jokin, joka saattaisi karata. Se on paras ateriasi kahteenkymmeneen tuntiin, ja myös ainoa.'); }, next: 'room' },
      { label: 'Tuijota pikkuisia shampoopulloja ja harkitse hampaidesi pesemistä niillä.', time: 4, do: (G) => { const n = G.count('shampoo'); G.nerves(n === 1 ? -1 : 1); G.note(n === 1 ? 'Shampoo. Hoitoaine. Vartalovoide. Luet ainesosaluettelon. Natriumlauryylieetterisulfaatti on teknisesti ottaen pinta-aktiivinen aine. Lasket pullon pois. Otat sen uudestaan. Lasket sen pois.' : n === 2 ? 'Olet ollut tässä tilanteessa ennenkin. Shampoo ei ole muuttanut mieltään, etkä sinäkään.' : 'Pikkupullot seisovat rivissä hyllyllä ja katselevat sinua. Yksi niistä on siirtynyt. Sinä siirsit sen. Luultavasti sinä siirsit sen.'); }, next: 'room' },
      { label: 'Käy suihkussa. Pue samat vaatteet takaisin päälle.', nerveMax: 95, time: 20, once: 'shower', do: (G) => { G.nerves(-6); G.note('Kuumaa vettä sentään. Islannin kuuma vesi on erinomaista; se haisee hiukan kananmunalle eikä lopu koskaan. Seisot sen alla, kunnes tunnet itsesi taas ihmiseksi, ja sitten puet lentokoneen takaisin päällesi: housut, paidan, sukat, kaikki hieman lämpimämpiä kuin sinä itse.'); }, next: 'room' },
      { label: 'Avaa televisio.', kind: 'comply', dd: 2, time: 6, do: (G) => { const d = G.D, n = G.count('tv'); G.dread(1); G.note(d >= 5 ? 'Kanava 1: parkkipaikka. Sinun parkkipaikkasi, ylhäältä kuvattuna, harmaana. Siellä on bussi. Bussin vieressä hahmo. Sammutat television. Ruudussa näkyy huone, ylhäältä kuvattuna, harmaana.' : d >= 4 ? 'Säätiedotus, islanniksi, loputtomiin. Sitten kanava, jolla näkyy pelkkä valvontakamerakuva parkkipaikasta. Olet melko varma, ettei se ole tämä parkkipaikka. Siellä on bussi.' : n === 1 ? 'Säätiedotus, islanniksi. Kartta saaresta täynnä pieniä vihaisia nuolia. Sitten valokuva hotellista puhelinnumeroineen. Sitten säätiedotus.' : 'Olet nähnyt tämän säätiedotuksen. Se ei ole muuttunut. Nuolet ovat yhä vihaisia. Hotelli on yhä ruudussa puhelinnumeroineen, ikään kuin saattaisit haluta soittaa sinne sen sisältä.'); }, next: 'room' },
      { label: 'Katso ulos ikkunasta.', dd: 2, dreadMax: 85, time: 3, do: (G) => { const d = G.D, n = G.count('win'); G.dread(2); if (d >= 4) G.flag('looked1'); G.nerves(d >= 4 ? 7 : 2); G.note(d >= 5 ? 'Bussi on nyt suoraan ikkunasi alla. Sisävalot palavat. Kaikki sisällä istuvat kasvot hotelliin päin, selkä suorana, liikkumatta. Ja oven vieressä, kädet ristissä, tummansiniseen pukeutunut mies, joka katsoo ylös. Ei hotellia. Sinun ikkunaasi. Päästät irti verhosta. Et muista vetäneesi sitä syrjään.' : d >= 4 ? 'Parkkipaikan perällä seisoo bussi moottori käynnissä ja kaikki sisävalot päällä. Se on täynnä. Kukaan sisällä ei liiku. Oven luona ei näy ketään, ja sitten näkyy.' : n === 1 ? 'Parkkipaikka. Yksi ainoa lyhty. Soraa, tuulta, ja lyhdyn takana pimeyttä hyvin pitkälle. Ei bussia. Tunnet helpotusta, ja sitten mietit, miksi odotit bussia.' : 'Parkkipaikka. Lyhty. Ajovalot tiellä; ne hidastavat, mutta eivät käänny pihaan. Kaiken päällä omat kasvosi, kalpeat, eilisessä paidassa.'); }, next: 'room' },
      { label: 'Keitä teetä pikkupusseista.', nerveMax: 90, time: 8, once: 'tea', do: (G) => { G.nerves(-5); G.note('Vedenkeitin on hidas ja pitää ääntä kuin pieni lentokone. Teetä, ja UHT-maitoa sormustimen kokoisesta kupista. Pitelet kuppia molemmin käsin. Se on ensimmäinen lämmin asia, joka ei ole ollut valetta.'); }, next: 'room' },
      { label: 'Tarkista ovi.', nd: 2, time: 2, do: (G) => { const n = G.count('door'); G.note(n === 1 ? 'Lukossa. Ketju päällä. Tarkistat ketjun. Tarkistat lukon. Kaikki hyvin.' : n === 2 ? 'Yhä lukossa. Ketju yhä päällä. Tiesit sen kyllä.' : n === 3 ? 'Tarkistat oven uudestaan. Tiedostat tarkistavasi oven uudestaan. Se on lukossa. Se on koko ajan ollut lukossa. Seisot hetken käsi ovella.' : 'Lukossa. Et enää tiedä, mitä oikeastaan tarkistat. Sitäkö, onko se lukossa, vai sitä, onko se yhä ovi.'); if (n >= 3) G.dread(1); }, next: 'room' },
      { label: 'Kuuntele ovella.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(3); G.note(G.pick(d >= 4 ? ['Askelia. Hitaita, tasaisia; ne pysähtyvät joka ovelle. Pysähtyvät sinun ovellesi. Jatkavat matkaa.', 'Pyörillä kulkeva kärry käytävän päässä. Se pysähtyy. Se ei lähde enää liikkeelle.', 'Koputusta kaukaa käytävän päästä. Kärsivällistä. Sitten lähempää.'] : ['Ei mitään. Käytävän hurinaa. Jossain kaukana sulkeutuu ovi.', 'Joku kävelee ohi, nopeasti, sukkasillaan. Joku toinen, hitaasti, kengät jalassa.', 'Jääpalakone jauhaa käytävän päässä. Sitten naurua viereisestä huoneesta, äkkiä katkeavaa.'])); }, next: 'room' },
      { label: 'Soita vastaanottoon huoneen puhelimesta.', kind: 'comply', dd: 1, time: 5, once: 'roomphone', do: (G) => { G.dread(2); G.note('Puhelin soi pitkään. Sitten virkailija, joka kuulostaa siltä kuin olisi juuri nukkunut tai kuin ei olisi koskaan nukkunut: ' + V(LX('"Niin, 214?"')) + ' Et ollut sanonut huoneesi numeroa. Kysyt bussista. ' + V(LX('"Yksitoista. Siinä lukee yksitoista. Ehkä sinun pitäisi nukkua."'))); }, next: 'room' },
      { label: 'Ota selvää oikeuksistasi.', dd: -6, dreadMax: 85, sub: 'Asetus on olemassa. Joku maininnoissasi on siitä varma.', time: 15, once: 'rights', do: (G) => { G.flag('uk261'); G.nerves(-6); G.msg('paper', { from: 'Kuvakaappaus, ja sitten itse tekemäsi QR-koodi', subj: 'UK261', body: '<b>UK261 / EY261 — OIKEUTESI</b>\n\nNäin pitkän viivästyksen sattuessa lentoyhtiön on järjestettävä: ateriat, hotelli, kuljetukset ja yhteydenpitomahdollisuus.\n\nYhtiö panee vastaan. Vaadi silti.\n\n[ QR-KOODI ]' }); G.note('UK261. <em>Lentoyhtiön on järjestettävä.</em> Luet sen kahdesti. Teet siitä QR-koodin, hotellin wifissä, kolmelta aamuyöllä, etkä tiedä miksi, paitsi että aiot näyttää sen aamiaisella jokaiselle, jonka näet.'); }, next: 'room' },
      { label: 'Kirjoita siitä päivitys.', time: 8, once: 'post', do: (G) => { if (G.D >= 4) { G.nerves(4); G.note('Kirjoitat kaiken auki – miehistön, oven, sähköpostin, bussin – ja painat julkaise-nappia, ja pieni rengas pyörii ja pyörii. Yksi palkki. Ei yhtään palkkia. Päivitys jää siihen lähettämättä, ei kenellekään osoitettuna.'); } else { G.nerves(-3); G.note('Julkaiset sen. Lol, kirjoitat. Lmao. Kymmenessä minuutissa: 1,4 tuhatta tykkäystä ja neljäkymmentä ihmistä kertomassa sinulle kuumista lähteistä. Lasket puhelimen peitolle näyttö alaspäin.'); } }, next: 'room' },
      { label: 'Lataa puhelin.', nd: 2, time: 2, once: 'charge', do: (G) => { G.nerves(3); G.note(`Laturi on laukussa. Laukku on järjestelmässä. Puhelimen akussa on ${G.battery()} %, ja se tietää sen, ja himmentää näytön kertoakseen sen sinulle.`); }, next: 'room' },
      { label: 'Yritä nukkua.', nerveMax: 80, time: 25, do: (G) => { if (G.t + 25 >= T(1, 4, 5)) { G.S.t = Math.max(G.t, KNOCK_AT - 25); G.note('Käyt makuulle lentokonevaatteissasi, valo päällä. Katto on hyvin lähellä. Olet melkein, melkein—'); } else { G.nerves(-3); G.note(G.pick(['Käyt makuulle. Kehosi elää Tyynenmeren aikaa, tai ei mitään aikaa. Katossa on saaren muotoinen tahra. Katselet sitä jonkin aikaa. Ei mitään.', 'Silmät kiinni. Bussin – jonkin bussin – moottori jossain ikkunan alla, tai korvissasi. Nouset taas istumaan.', 'Ryömit peiton alle vaatteet päällä. Olo on kuin paketilla. Uni katselee sinua huoneen toiselta puolelta eikä tule lähemmäs.'])); } }, next: 'room' },
      { label: 'Mene käytävälle.', time: 2, next: 'corridor' },
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
      if (G.once('corr_intro')) G.note(p(G.last(), 'Pitkä, matala, lattialla mustelmanväristä kokolattiamattoa. Ovia: 210, 212, 214 – sinun – 216, 218, ja niin edelleen aina palo-ovelle asti, jossa on poikkitanko ja lankalasinen ikkuna. Käytävän päässä hurisee jääpalakone. Hissi, jonka ovessa on paperilappu.'));
    },
    text: (G) => hub(G, `Käytävä. ${G.clock(G.t)}. Kaikki ovet ovat kiinni. Sinun ovesi on se, jonka alta näkyy valoa.`, 'corridor'),
    choices: (G) => [
      { label: 'Jääpalakone.', nd: 2, dd: 1, time: 5, do: (G) => { const n = G.count('ice'); G.note(n === 1 ? 'Se jyrisee. Jäätä, valtava määrä jäätä, sankoon, jota et tuonut mukanasi. Seisot siinä kourallinen jäätä kädessäsi. Et halunnut jäätä. Et tiedä, mitä halusit.' : n === 2 ? 'Se jyrisee taas, sinua varten, kuin olisi odottanut. Äskeinen jää ei ole sulanut. Et ole varma, kuuluuko jään käyttäytyä noin lämmitetyllä käytävällä.' : 'Tällä kertaa et työnnä kättäsi sisään. Kuuntelet, kun se jauhaa. Jauhamisen alta, jostain alempaa, moottori.'); if (n >= 2) G.dread(1); }, next: 'corridor' },
      { label: 'Koputa huoneen 216 oveen. Fleecemiehen huone.', time: 5, do: (G) => { const n = G.count('k216'); if (n === 1) { G.collect(1); G.nerves(-4); G.note('Tauko, sitten ketju, sitten fleece. Hänkin on hereillä. Hänelläkin on vaatteet päällä. ' + V('"Hemmetti",') + ' hän sanoo, ja siihen sisältyy kaikki. Olette bussista samaa mieltä. Yksitoista. Tuloste. Hän lupaa tulla koputtamaan.'); } else if (n === 2) { G.nerves(3); G.dread(3); G.note('Ei vastausta. Oven alta näkyy valoa. Koputat uudelleen, tasaisesti, ja kuulet oman koputuksesi, ja lakkaat.'); } else { G.nerves(8); G.dread(5); G.note('Ovi ei ole lukossa. Se aukeaa heilahtaen. Huone on siistitty: sänky pedattu kireäksi, pyyhkeet taiteltu viuhkaksi, pikkushampoot rivissä. Kukaan ei ole ollut huoneessa. Kukaan ei ole koskaan ollut huoneessa. Hänen fleecensä on tuolilla.'); } }, next: 'corridor' },
      { label: 'Hissi.', kind: 'comply', dd: 2, time: 4, do: (G) => { const d = G.D; if (d >= 4) { G.flag('lift_open'); G.dread(3); G.nerves(5); G.note('Paperilapussa lukee EPÄKUNNOSSA, Arialilla. Juuri kun luet sitä, hissi saapuu. Ovet avautuvat tyhjään, kirkkaasti valaistuun koppiin, jonka peräseinällä on peili, ja jäävät auki, ja odottavat. Kukaan ei kutsunut sitä.'); } else { G.note('EPÄKUNNOSSA, Arialilla, teipattu vinoon. Painat nappia silti. Jossain rakennuksessa jokin lähtee alaspäin.'); } }, next: 'corridor' },
      { label: 'Mene hissiin.', kind: 'comply', if: (G) => G.has('lift_open'), do: (G) => G.end('lift') },
      { label: 'Lue seinällä oleva poistumissuunnitelma.', dd: -2, time: 3, once: 'fireplan', do: (G) => { G.msg('paper', { from: 'Ruuvattu käytävän seinään', subj: 'Poistumissuunnitelma', body: '<b>EVACUATION PLAN · 2ND FLOOR</b>\n\nIn case of alarm, proceed by stairs to\n<b>ASSEMBLY POINT: CAR PARK</b>\n\nDo not use the lift.\nDo not return for belongings.\n\nYOU ARE HERE ●' }); G.note('OLET TÄSSÄ. Punainen piste, huoneen 214 kohdalla. Joku on piirtänyt siitä kuulakärkikynällä pienen nuolen kohti parkkipaikkaa ja kirjoittanut, eri käsialalla, <em>bussi</em>.'); }, next: 'corridor' },
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
      if (G.once('lobby_intro')) G.note(p(G.last(), 'Aula on yöllä kuin akvaario, jonka valot on jätetty päälle. Kaksi lentosi matkustajaa nukkuu sohvalla istuallaan. Yövirkailija istuu tiskin takana ristikon ääressä. Tulostetussa kyltissä lukee Arialilla 11:00. Myyntiautomaatti hurisee seinustalla kuin pieni jäähdytetty jumala.'));
    },
    text: (G) => hub(G, `Aula. ${G.clock(G.t)}. Kyltissä lukee yhä 11:00. ${G.t >= KNOCK_AT ? 'Kello on jo yli puoli viiden.' : 'Yhteentoista on vielä pitkästi aikaa.'}`, 'lobby'),
    choices: (G) => [
      { label: 'Kysy virkailijalta, puhuuko hän ranskaa.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 4, do: (G) => { G.flag('fr_asked'); G.nerves(-2); G.note(LX('"Vähän. Yksitoista. Kyltti. Ole hyvä."') + ' Hän sanoi sen hitaasti ja osoitti silti kylttiä, siltä varalta etteivät sanat kantaisi.'); }, next: 'lobby' },
      { label: 'Pyydä vastaanotosta hammastahnaa.', time: 6, once: 'desk_tp', do: (G) => { G.nerves(2); G.note('Hän kurkkii tiskin alle, tosissaan, pitkään. ' + V(LX('"Ei. Valitan. 10-11:ssä on. Kaksikymmentä minuuttia kävellen."')) + ' Hän katsoo sinua, ja ovia, ja sinua. ' + V(LX('"Ehkä ei tänä yönä."'))); }, next: 'lobby' },
      { label: 'Kysy, pitääkö kyltti paikkansa.', kind: 'comply', dd: 1, time: 5, do: (G) => { const n = G.count('sign'); G.note(n === 1 ? 'Hän osoittaa kylttiä. ' + V(LX('"Yksitoista."')) + ' Kysyt, keneltä hän sen kuuli. ' + V(LX('"Eräs matkustaja soitti heille. He sanoivat, että kyllä."')) + ' Tauko. ' + V(LX('"Tai jotain he sanoivat."')) : n === 2 ? V(LX('"Yksitoista",')) + ' hän sanoo katsettaan nostamatta, ennen kuin olet ehtinyt kysyä loppuun.' : 'Hän katsoo sinua hetken ilmeellä, jota et osaa tulkita, ja sanoo sitten: ' + V(LX('"Olet huoneessa 214",')) + ' ja palaa ristikkonsa pariin. Et ollut kysynyt.'); if (n >= 3) G.dread(3); }, next: 'lobby' },
      { label: 'Kysy, onko bussi tullut.', kind: 'comply', dd: 3, time: 5, do: (G) => { const d = G.D; G.dread(1); G.note(d >= 4 ? V(LX('"Ulkona on yksi",')) + ' hän sanoo. ' + V(LX('"Se ei ole sinun."')) + ' Kysyt, mistä hän sen tietää. Hän kääntää ristikon sinuun päin. Se on tyhjä.' : G.t >= KNOCK_AT ? V(LX('"Joku tuli kysymään sinua. Univormussa. Sanoin, että nukut."')) + ' Et nukkunut. ' + V(LX('"Tiedän."')) : V(LX('"Ei bussia. Yksitoista. Mene nyt ylös nukkumaan, ole hyvä."'))); }, next: 'lobby' },
      { label: 'Myyntiautomaatti.', nd: -2, time: 5, do: (G) => { const n = G.count('vend'); if (n === 1) { G.flag('crisps'); G.nerves(-3); G.note('Sipsejä, paprikan makuisia. Kaksi minipulloa punaviiniä, jonka etiketissä on kuva vuoresta. Automaatti hyväksyy korttisi kolmannella yrityksellä ja päästää syvää vastahakoisuutta ilmaisevan äänen. Pitelet illallistasi molemmin käsin.'); } else { G.note(n === 2 ? 'Loppuunmyyty, melkein. Yksi tuote jäljellä, alahyllyllä: purkki skyriä, jonka päiväystä et olisi halunnut lukea.' : 'Automaatin valo lepattaa. Kaikki hyllyt ovat nyt tyhjiä, paitsi skyr, joka on siirtynyt yhtä hyllyä ylemmäs.'); if (n >= 3) G.dread(1); } }, next: 'lobby' },
      { label: 'Kahviautomaatti.', time: 5, once: 'coffee_l', do: (G) => { G.nerves(G.has('coffee') ? 2 : -2); G.note('Kahvia. Mikä tätä kahvia oikein vaivaa. Se maistuu siltä kuin se olisi kuvailtu koneelle puhelimitse. Juot sen seisaaltaan ja katselet ovia.'); }, next: 'lobby' },
      { label: 'Herätä sohvalla nukkuvat matkustajat. Vertailkaa tietoja.', nd: -4, dd: -4, nerveMax: 85, time: 8, once: 'sofa', do: (G) => { G.collect(1); G.nerves(-2); G.note('He ovat se pariskunta hallin ikkunan luota. He eivät nuku. ' + V('"Me saatiin sähköposti, jossa luki yhdeksän",') + ' hän sanoo. ' + V('"Ja toinen, jossa luki kahdeksan. Ja se chattijuttu sanoo jotain ihan muuta."') + ' Katsotte kaikki kylttiä. ' + V(LX('"Yksitoista",')) + ' hän sanoo. ' + V('"Tuloste."')); }, next: 'lobby' },
      { label: 'Katso parkkipaikkaa lasin läpi.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(d >= 4 ? 5 : 0); G.note(d >= 5 ? 'Bussi seisoo nyt aivan ovien edessä. Moottori käy. Sisävalot palavat. Ovet liukuvat sen edessä auki, ja jäävät auki, ja kylmä virtaa sisään. Kukaan ei nouse kyydistä.' : d >= 4 ? 'Parkkipaikan perällä ajovalot, moottori tyhjäkäynnillä. Niiden takana hahmo, jolla on bussin muoto. Virkailija ei nosta katsettaan. Ei ole nostanut vähään aikaan.' : 'Soraa, yksi lyhtypylväs, tie. Auto ajaa ohi hidastamatta. Tähyilet jotakin. Haluaisit lakata.'); if (d >= 4) G.flag('looked1'); }, next: 'lobby' },
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
      if (G.once('cp_intro')) G.note(p(G.last(), 'Kylmä. Oikeasti kylmä: sellainen, joka tunkeutuu vaatteiden läpi ja jää. Soraa, lyhtypylväs, kahteen suuntaan johtava tie. Hotelli takanasi, valot palaen. Tulit ulos jostakin syystä, joka sinulla vielä hetki sitten oli.'));
    },
    text: (G) => hub(G, `Parkkipaikka. ${G.clock(G.t)}. Tuuli on tullut pitkän matkan sinua vastaan.`, 'carpark'),
    choices: (G) => [
      { label: 'Kävele parkkipaikan perälle. Hahmoa kohti.', nd: 5, dreadMax: 92, time: 6, do: (G) => { const d = G.D; G.dread(G.counted('cpwalk') ? 1 : 3); G.count('cpwalk'); if (d >= 4) { G.flag('coach_seen_cp'); G.nerves(G.counted('cpwalk') > 1 ? 3 : 6); G.note('Bussi. Tummansininen. Kultainen vaakuna. Moottori käy, kaikki sisävalot palavat, ja jokaisen ikkunan takana ihminen, selkä suorana, kasvot hotelliin päin. Oven vieressä tummansiniseen pukeutunut mies, kädet ristissä. Hän ei katso sinuun. ' + V('"Ei vielä",') + ' hän sanoo, ei kenellekään, tai sinulle.'); } else { G.nerves(3); G.note('Ei mitään. Muuta tummempi läikkä soraa, sen muotoinen, mikä siinä on äskettäin seissyt pysäköitynä. Tuuli. Seisot hetken sen muodon sisällä.'); } }, next: 'carpark' },
      { label: 'Nouse bussiin.', kind: 'comply', if: (G) => G.has('coach_seen_cp'), do: (G) => G.end('nightcoach') },
      { label: 'Katso ylös ikkunaasi.', time: 3, do: (G) => { G.dread(2); G.nerves(2); G.note(G.D >= 4 ? 'Toinen kerros, neljäs ikkuna. Valo palaa. Jätit sen päälle. Verho on auki. Et jättänyt sitä auki.' : 'Toinen kerros, neljäs ikkuna. Valo palaa. Se näyttää huoneelta, jossa on joku.'); }, next: 'carpark' },
      { label: 'Kävele kahdenkymmenen minuutin matka 10-11:een hakemaan hammastahnaa.', dreadMax: 70, sub: 'Hammastahnaa. Ehkä sukkia. Vaihtelua maisemaan.', time: 20, once: 'walk', next: 'walk' },
      { label: 'Mene takaisin sisään.', kind: 'comply', dd: 1, time: 3, next: 'lobby' },
    ],
  };

  scenes.walk = {
    art: 'road',
    loc: 'Tie · kohti 10-11:tä',
    text: p(
      'Tuulta. Laavaa. Tie, jolla ei ole jalkakäytävää, ja valkoinen viiva, joka katoaa aina uudelleen. Kahdeksan minuutin kuluttua et enää näe hotellia takanasi; kymmenen minuutin kuluttua et näe 10-11:tä edessäsi.',
      'Sitten ajovalot, hitaat, takaapäin. Bussi. Se ajaa rinnallesi ja pysähtyy, ja ovi taittuu auki pehmeällä, kalliin kuuloisella äänellä. Lämmintä valoa. Istuinrivejä, ja niillä ihmisiä, jotka istuvat hyvin hiljaa.',
      V('"Albionin matkustaja?"') + ' sanoo ääni, jonka tunnistat kuulutuksista 37 000 jalan korkeudesta. ' + V('"Teemme parhaamme. Hyppää kyytiin."'),
    ),
    choices: [
      { label: 'Nouse kyytiin. Siellä on lämmintä.', kind: 'comply', do: (G) => G.end('convenience') },
      { label: 'Kävele eteenpäin. Älä katso oveen.', dreadMax: 75, dd: -14, time: 30, do: (G) => { G.nerves(12); G.flag('toothpaste'); G.nerves(-10); G.dread(8); G.note('Bussi seisoi vierelläsi tyhjäkäynnillä pitkään, ja sitten se ei enää seissyt. 10-11 loisti kuin pyhäkkö. Hammastahnaa. Hammasharja. Sukkia, kolmen pakkaus, kauneimmat sukat, jotka olet ikinä nähnyt. Kävelit takaisin pussi rintaa vasten puristettuna. Mikään ei ohittanut sinua tiellä. Ei yhtään mikään, ja se oli jotenkin vielä pahempaa.'); }, next: 'carpark' },
      { label: 'Käänny ympäri. Kävele takaisin hotellille. Nopeasti.', kind: 'comply', dd: 6, time: 15, do: (G) => { G.nerves(8); G.dread(5); G.note('Et juossut. Kävelit, nopeasti, bussi perässäsi tyhjäkäynnillä, samaa vauhtia, ja sitten ei enää. Aulan ovet liukuivat auki ennen kuin ehdit niiden luo.'); }, next: 'carpark' },
    ],
  };

  /* ---- the knock, three ways ---- */
  scenes.knock = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); },
    text: (G) => p(
      G.last(),
      'Joku koputtaa. Ei hakkaa – koputtaa, tasaisesti, niin kuin koputtaa ihminen, joka aikoo koputtaa koko yön.',
      V('"Bussi Albion Atlanticin matkustajille. Lähtee nyt. Viimeinen kutsu."'),
      'Ääni on kärsivällinen. Ääni on hyvin, hyvin kärsivällinen.',
    ),
    choices: [
      { label: 'Avaa ovi.', kind: 'comply', sub: 'Se saattaa olla bussi.', do: (G) => G.end('nightcoach') },
      { label: 'Katso ovisilmästä.', dd: 6, nd: 6, time: 2, do: (G) => { G.nerves(9); G.flag('spyhole'); G.note('Käytävä on tyhjä. Matto ovesi edessä on märkä. Koputus jatkuu, tasaisena, eikä tule mistään erityisestä suunnasta.'); }, next: 'knock2' },
      { label: 'Kyltissä luki 11:00. Älä avaa. Älä vastaa.', nd: 5, dreadMax: 80, time: 20, do: (G) => { G.nerves(5); G.note('Istuit sängyllä selkä sängynpäätyä vasten ja katse ovessa ja laskit koputuksia. Kuudenkymmenen jälkeen menetit laskun. Sitten ne lakkasivat, ja se oli jonkin aikaa vielä pahempaa.'); }, next: 'window' },
    ],
  };

  scenes.knock2 = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: (G) => p(G.last(), 'Tasaista. Kärsivällistä. Ei ketään.'),
    choices: [
      { label: 'Avaa ovi silti.', kind: 'comply', do: (G) => G.end('nightcoach') },
      { label: 'Peräänny ovelta. Istu sängylle. Odota, että se loppuu.', dreadMax: 88, time: 25, do: (G) => { G.nerves(3); G.note('Lopulta se lakkasi, niin kuin sade lakkaa: et huomannut viimeistä koputusta.'); }, next: 'window' },
    ],
  };

  scenes.corridor_knock = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Second floor corridor · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); G.nerves(8); },
    text: (G) => p(
      G.last(),
      'Olet käytävällä, kun se alkaa. Käytävän toisessa päässä, hissin luona, joku tummansiniseen pukeutunut koputtaa oveen. Tasaisesti. Kärsivällisesti. Sitten seuraavaan oveen. Sitten seuraavaan.',
      'Hän lähestyy ovi ovelta huonetta 214. Hän lähestyy sinua. Hän ei ole nostanut katsettaan. ' + V('"Bussi Albion Atlanticin matkustajille. Lähtee nyt. Viimeinen kutsu."'),
    ),
    choices: [
      { label: 'Kävele hänen ohitseen. Takaisin huoneeseesi. Lukitse ovi.', dreadMax: 80, time: 5, do: (G) => { G.nerves(10); G.dread(8); G.flag('seen'); G.note('Hän ei lakannut koputtamasta, kun kuljit ohi. Hän ei kääntynyt. Mutta kun avainkorttisi naksahti lukossa, hän sanoi, miellyttävään sävyyn, edessään olevalle ovelle: ' + V('"Kaksi neljätoista",') + ' ja sait turvaketjun paikalleen käsillä, jotka eivät tuntuneet omiltasi.'); }, next: 'window' },
      { label: 'Mene portaita alas. Hiljaa. Odota aulassa.', dd: 5, dreadMax: 92, time: 15, do: (G) => { G.nerves(6); G.dread(5); G.note('Virkailija ei nostanut katsettaan, kun tulit alas. ' + V(LX('"Hän etsii sinua",')) + ' hän sanoi ristikolleen. Istuit sohvalla pariskunnan vieressä, eikä kukaan sanonut pitkään aikaan mitään, ja sitten aulan ovet liukuivat auki ei kenellekään, ja sulkeutuivat.'); }, next: 'window' },
      { label: 'Vastaa hänelle. Olet Albion Atlanticin matkustaja.', kind: 'comply', do: (G) => G.end('nightcoach') },
    ],
  };

  scenes.window = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.S.t = Math.max(G.t, T(1, 4, 50)); G.bot('Hei! Näen, että olet huoneessa 214. Bussi odottaa sinua parkkipaikalla. Ethän katso ulos ikkunasta. 🙂'); },
    text: (G) => p(
      G.last(),
      'Taas huoneessa, tai yhä siellä. Koputus on lakannut. Puhelimesi valaisee kattoa. Viesti Allylta.',
      W('Bussi odottaa sinua parkkipaikalla. Ethän katso ulos ikkunasta.'),
      'Verho on ohut. Sen läpi kuultaa valoa, ja valo värähtelee hieman, niin kuin käyvän moottorin valo värähtelee.',
    ),
    choices: [
      { label: 'Katso.', dd: 10, nd: 8, dreadMax: 90, sub: 'Ihan vähän vain.', time: 5, do: (G) => { G.flag('seen'); G.nerves(14); atLeast(G, 78); }, next: 'window2' },
      { label: 'Älä. Käännä puhelin näyttö alaspäin. Vedä peitto pään yli.', kind: 'comply', dd: 6, time: 5, do: (G) => G.nerves(2), next: 'sleep' },
    ],
  };

  scenes.window2 = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: p(
      'Bussi, tummansininen, kultainen vaakuna. Moottori käy. Kaikki sisävalot palavat. Se on täynnä, ja kaikki istuvat selkä suorana, ja jokainen on kääntynyt hotelliin päin.',
      'Bussin ovella seisoo mies purserin univormussa. Sinun katsoessasi hän nostaa katseensa – ei hotelliin. Sinun ikkunaasi.',
      'Hän ei vilkuta. Ei tarvitse. Hän on, ymmärrät, pannut asian merkille.',
    ),
    choices: [{ label: 'Päästä irti verhosta.', time: 5, next: 'sleep' }],
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
      G.at(T(1, 7, 35), 'sms', { from: 'Jo 💛', body: 'HERRANJUMALA OOTKO SÄ ISLANNISSA?? sun on pakko käydä blue lagoonissa. PAKKO. se on tyyliin 20 min kentältä' });
      G.at(T(1, 8, 5), 'chat', { body: 'Hyvää huomenta! Kuljetuksesi lentokentälle on vahvistettu klo 08:00. Olethan aulassa. 🚌' });
      G.at(T(1, 9, 40), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Kuljetuksesi lentokentälle', stamp: T(1, 9, 40), body: 'Hyvä asiakas,\n\nBussit noutavat sinut majoituspaikastasi klo 09:00 uudelleenvaratulle lennollesi AB 0271.\n\nOlethan valmiina aulassa klo 08:45.\n\nTeemme parhaamme.' });
      G.at(T(1, 9, 55), 'chat', { body: 'Bussisi on paikalla. Se on se kiva. 🚌' });
    },
    text: (G) => p(
      G.has('allnighter') ? 'Harmaata valoa. 07:30. Et nukkunut, ja olet yhä Islannissa.' : 'Harmaata valoa. 07:30. Nukuit, tai jotain sinne päin, ja olet yhä Islannissa.',
      'Aamiaiseksi on skyriä, leipää ja kahvia, joka maistuu siltä kuin sen olisi keittänyt joku, jolle on joskus kuvailtu kahvia. Huone on täynnä lentosi väkeä. Kaikilla on eiliset vaatteet päällä. Kaikki vertailevat tietojaan: mikä hotelli, mikä noutoaika, mihin kolmesta ristiriitaisesta viestistä kukin on päättänyt uskoa.',
      'Tulostettu kyltti on yhä teipattuna tiskiin. 11:00. Joku on piirtänyt siihen pienen sydämen.',
    ),
    choices: [{ label: 'Ota silti toinen kahvi.', time: 10, next: 'hotel_morning' }],
  };

  scenes.hotel_morning = {
    art: 'lobby',
    loc: 'Hótel Hraun · Aula',
    enter: (G) => {
      if (G.t >= T(1, 10, 15)) { G.go('buses2'); return; }
      if (G.once('morn_intro')) G.note(p(G.last(), 'Käytännössä kaikki on ajoitettu niin, että se sattuu mahdollisimman paljon, mutta ei jätä sinulle vapautta mennä välillä tekemään jotain mukavaa. Kolme tuntia, eikä niillä voi tehdä muuta kuin odottaa bussia, joka saattaa olla se bussi tai sitten ei.'));
    },
    text: (G) => hub(G,
      `Aula. ${G.clock(G.t)}. Kyltissä lukee 11:00. ${G.t >= T(1, 9, 45) ? 'Sähköpostissa luki 09:00, ja se tuli perille 09:40. ' : G.t >= T(1, 8, 5) ? 'Chatbotti sanoi 08:00. Kello on jo yli 08:00. ' : ''}Kukaan ei ole nähnyt bussia, joka olisi sinun.`,
      'morning'),
    choices: (G) => [
      { label: 'Näytä UK261-QR-koodi jokaiselle matkustajalle, jonka tavoitat.', dd: -8, nd: -4, nerveMax: 90, sub: 'Sillä varauksella, että lentoyhtiö panee vastaan.', if: (G) => G.has('uk261'), once: 'qr1', time: 20, do: (G) => { G.collect(2); G.nerves(-5); G.note('Kierrät pöydästä pöytään puhelin ojossa kuin pidätysmääräys. Ihmiset ottavat siitä kuvan. Bageliaan syövä nainen sanoo: ' + V('"Mä oon valmis olemaan Karen."') + ' Joku taputtaa, kerran.'); }, next: 'hotel_morning' },
      { label: 'Vertaile tietoja muiden kanssa.', dd: -5, nd: -4, nerveMax: 85, time: 20, once: 'notes1', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_notes'); G.note('Neljä hotellia. Kuusi noutoaikaa. Yksi tuloste. Mies, jolla on Blazers-lippis: ' + V('"Ne vaakunalliset ei oo meidän. En tiedä kenen ne on. Ei meidän."') + ' Kaikki nyökkäilevät, kuin olisivat tienneet.'); }, next: 'hotel_morning' },
      { label: 'Kysy vastaanotosta, pitääkö 11:00 paikkansa.', kind: 'comply', dd: 2, time: 10, once: 'recep', do: (G) => { G.nerves(1); G.note('Sama virkailija. Edelleen. Hän osoittaa kylttiä. ' + V(LX('"Toinen matkustaja soitti heille. He sanoivat, että kyllä."')) + ' Tauko. ' + V(LX('"Tai jotain he sanoivat."'))); }, next: 'hotel_morning' },
      { label: 'Mene takaisin huoneeseen. Suihkuun. Pese edes kasvosi.', nerveMax: 92, time: 25, once: 'morn_shower', do: (G) => { G.nerves(-5); G.note('Kuumaa vettä. Samat vaatteet. Päivänvalossa huone on vain huone: shampoot, vedenkeitin, ikkuna parkkipaikalle, jolla seisoo bussi. Et katso pitkään.'); }, next: 'hotel_morning' },
      { label: 'Juttele taaperon äidin kanssa.', nd: -3, dd: -3, nerveMax: 80, time: 10, once: 'morn_mother', do: (G) => { G.collect(1); G.nerves(-3); G.note(V('"Hän haluaisi olla jo kotona",') + ' äiti sanoo taaperosta, joka on pöydän alla. ' + V('"Niin minäkin. Kuulitko sinä viime yönä koputusta?"') + ' Sanot, että kuulit. Hän sanoo: ' + V('"Ei mekään avattu."')); }, next: 'hotel_morning' },
      { label: 'Tarkista lennon tilanne lentoyhtiön sivuilta.', dd: 3, nd: 3, time: 8, do: (G) => { const n = G.count('status'); G.dread(2); G.note(n === 1 ? 'AB 0271 · KEF → LAX · 15:10 · AIKATAULUSSA. Minkä aikataulun mukaan, sitä ei kerrota.' : n === 2 ? 'AB 0271 · 15:10 · AIKATAULUSSA. Sitten, silmiesi edessä, 15:25. Sitten taas 15:10.' : 'Sivu ei lataudu. Sitten se latautuu, eikä lentoa näy. Sitten näkyy. 15:10. Panet puhelimen pois ennen kuin se ehtii taas muuttua.'); }, next: 'hotel_morning' },
      { label: 'Mene ulos katsomaan, näkyykö klo 09:00 bussia.', kind: 'comply', dd: 5, if: (G) => G.t >= T(1, 8, 50) && G.t < T(1, 10, 0), time: 10, next: 'decoy_morning' },
      { label: 'Mene kuumille lähteille. Olet aina halunnut sinne.', sub: 'Se on kahdenkymmenen minuutin päässä. Kaikki sanovat niin.', do: (G) => G.end('tantalus') },
      { label: 'Odota aulassa.', kind: 'comply', dd: 3, nd: 2, sub: 'Puoli tuntia tätä.', time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Puoli tuntia. Kahviautomaatti, ovet, kyltti. Lapsi laskee sataan ja aloittaa alusta.', 'Puoli tuntia. Jonkun puhelimen herätys soi – Los Angelesin aikaan asetettuna – ja kaikki nauravat, ja sitten ei kukaan.', 'Puoli tuntia. Ulkona tulee bussi, joka ei ole sinun, ja lähtee. Et nouse. Ei nouse kukaan muukaan.'])); }, next: 'hotel_morning' },
    ],
    status: (G) => (G.has('hint_notes') ? 'Kuulopuheita: kaikki saivat lentoyhtiöltä eri ajan. Kaikki luottavat tulosteeseen. Vaakunalliset bussit "ei oo meidän".' : ''),
  };

  scenes.decoy_morning = {
    art: 'carpark',
    loc: 'Hótel Hraun · Parkkipaikka',
    text: p(
      'Bussi on siellä. Tummansininen, kultainen vaakuna, moottori käy. Keulan LED-kyltissä lukee AIRPORT TRANSFER · ALBION ATLANTIC. Purseri seisoo ovella kädet ristissä, ja kun hän näkee sinut, hän hymyilee kuin olisit täsmälleen ajoissa.',
      'Kukaan muu ei ole tullut aulasta ulos. Ikkunoista näkyy, kuinka jo kyydissä olevat matkustajat istuvat selkä suorana puhtaissa paidoissa ja katsovat tyhjyyteen.',
    ),
    choices: [
      { label: 'Nouse kyytiin. Sähköpostissahan luki 09:00.', kind: 'comply', do: (G) => G.end('crew') },
      { label: 'Mene takaisin sisään. Älä sano siitä kenellekään mitään.', dreadMax: 85, time: 5, do: (G) => { G.nerves(6); G.dread(5); G.note('Menit takaisin sisään. Kukaan ei kysynyt mitään. Lasin takana bussi seisoi paikallaan, ovi auki, pitkään.'); }, next: 'hotel_morning' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 10:15 bus stand 2 */
  scenes.buses2 = {
    art: 'carpark',
    loc: 'Hótel Hraun · Parkkipaikka',
    enter: (G) => { if (G.t < T(1, 10, 15)) G.S.t = T(1, 10, 15); G.dread(4); },
    text: (G) => p(
      'Joku sanoo, että ulkona on bussi. Kysyt vastaanottovirkailijalta, onko se sinun. Hän ei tiedä. Hän osoittaa Arialilla tulostettua kylttiä. ' + V(LX('"Ehkä sinun kannattaisi pitää kiirettä."')),
      'Kuvittele videopelin mittari, mutta hermoillesi, hupenemassa kohti ohutta, värisevää punaista viipaletta.',
      'Ulkona: busseja. Kukaan ei ole kertonut, mikä niistä. Yhdessäkään ei lue lentosi numeroa, paitsi siinä yhdessä, jossa lukee, tussilla.',
      G.has('hint_notes') && W('"Ne vaakunalliset ei oo meidän."'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: '#c7c3b6', windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'day' },
        name: 'Sama valkoinen bussi kuin eilen illalla, tai hyvin sen näköinen',
        sign: G.pick(['AIRPORT', 'AB0271 → KEF', 'FLIGHT PPL AIRPORT']), signStyle: 'paper',
        look: ['Kuljettajalla huomioliivi. Eri voileipä.', 'Puolillaan. Aulasta tulee yhä ihmisiä sitä kohti.'],
        hidden: ['Fleece. Taapero. Mies paikalta 31C. Samat vaatteet kuin eilen, tietysti, mitä muutakaan heillä olisi päällään.', 'Sinulla on huono kasvomuisti. Nämä tunnet.'],
        board: { time: 5, do: (G) => G.flag('bus2_ok'), next: 'ride2' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'day' },
        name: 'Tummansininen bussi, jonka kyljessä on kultainen vaakuna',
        sign: 'AIRPORT TRANSFER · ALBION ATLANTIC', signStyle: 'led',
        look: ['Purseri ovella. Hän vilkuttaa. Hän tietää, mikä ikkuna oli sinun.', 'Lämmin. Hiljainen. Paljon tilaa.'],
        hidden: ['Kukaan kyydissä ei näytä siltä kuin olisi nukkunut vaatteet päällä. Kukaan ei näytä siltä kuin olisi nukkunut.', 'Kenelläkään kyydissä ei ole puhelinta esillä.'],
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const lagoon = {
        key: 'lagoon',
        art: { livery: '#3e9c9a', windows: 'cold', passengers: 'few', sign: 'print', driver: 'plain', ground: 'day' },
        name: 'Turkoosi pikkubussi',
        sign: 'BLUE LAGOON SHUTTLE — Relax. You deserve it.', signStyle: 'print',
        look: ['Kuljettaja pitelee sylissään pinoa valkoisia pyyhkeitä.', 'Haisee rikiltä ja eukalyptukselta.'],
        hidden: ['Kaikilla kyydissä on puhtaat sukat.', 'Se lähtee kahden minuutin päästä. Se lähtee aina kahden minuutin päästä.'],
        board: { do: (G) => G.end('tantalus') },
      };
      return G.shuffle([correct, crest, lagoon]);
    },
    choices: [
      { label: 'Hetkinen. Kello ei ole vielä 11:00. Kyltissä luki 11:00.', kind: 'comply', dd: 6, nd: 6, sub: 'Kyltti on ainoa, joka on tähän mennessä ollut oikeassa.', time: 45, next: (G) => (G.t >= T(1, 11, 25) ? 'end:noshow' : 'buses2'), do: (G) => { G.nerves(8); G.dread(5); } },
    ],
  };

  scenes.ride2 = {
    art: 'road',
    loc: 'Tie 41 · kohti Keflavíkia',
    enter: (G) => {
      G.flag('left_hotel');
      if (G.once('nofood')) { if (G.rng() < 0.5) G.at(T(1, 12, 30), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Tarjoilu lennollasi', body: 'Hyvä asiakas,\n\nHuomioithan, että lennon uudelleenohjauksen vuoksi lennolla AB 0271 ei ole tarjoilua.\n\nSuosittelemme, että hankit virvokkeet terminaalista.\n\nTeemme parhaamme.' }); }
      G.at(T(1, 12, 0), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Uusi lähtöaika', body: 'Hyvä asiakas,\n\nLentosi AB 0271 lähtee muutetun aikataulun mukaan klo 15:45.\n\nLähtöselvitys alkaa kolme tuntia ennen lähtöä.\n\nTeemme parhaamme.', fx: (G) => { G.S.dep = T(1, 15, 45); } });
      G.at(T(1, 13, 10), 'chat', { body: 'Sinut on majoitettu. Miksi seisot jonossa? 🙂' });
    },
    text: p(
      'Päättelet olevasi oikeassa paikassa vain siitä, että alat tunnistaa muita matkustajia, vaikka kasvomuistisi on huono. Bussi lähtee kaksikymmentä minuuttia myöhässä, mikä laskujesi mukaan tarkoittaa, että ehdit lentokentälle vaivaiset neljäkymmentä minuuttia ennen kuin lähtöselvitys edes alkaa.',
      'Vauva parkuu. Äiti mutisee: ' + V('"Hän haluaisi olla jo kotona",') + ' ja koko bussi nauraa, surumielisesti.',
      'Islanti lipuu ohi ikkunan takana: erinomaista hanavettä, kauniita maisemia, kohtalaisen mukavia ihmisiä, joista ei välttämättä ole apua mutta jotka eivät uhkaile eivätkä valehtele sinulle. Islannille täydet pisteet siitä. Keflavík on syytön.',
    ),
    choices: [{ label: 'Saavu perille.', time: 55, do: (G) => G.nerves(-4), next: 'airport' }],
  };

  /* ---------------------------------------------------------------- Day 1 · ~11:30 the airport (hub) */
  scenes.airport = {
    art: 'airport',
    loc: 'Keflavíkin kansainvälinen lentoasema · Lähtevät',
    enter: (G) => {
      G.flag('at_airport2'); atLeast(G, 45);
      if (G.once('counter_paper')) G.msg('paper', { from: 'A4-arkki, nippusiteellä kiinnitetty jonotolppaan', subj: 'Tulostettu lappu', body: '<b>ALBION ATLANTIC AB0271</b>\n\nCounter opens <b>3 HOURS</b> before departure.\n\nIf departure is delayed, counter opening is delayed.\n\nPlease queue here.' });
      if (G.once('ap_intro')) G.note(p(G.last(), 'Lentokentällä on yksi (1) Albion Atlanticin tiski, ja sen edessä jono, joka koostuu yksinomaan ihmisistä, jotka tunnet jo ulkonäöltä. Tiski ei ole auki. A4-arkissa lukee, että se avataan kolme tuntia ennen lähtöä eikä minuuttiakaan aiemmin, ja jos lento myöhästyy, myöhästyy tiskikin.'));
      const open = G.S.dep - 180;
      if (G.t >= open && G.has('inline')) G.go('checkin');
    },
    text: (G) => {
      const open = G.S.dep - 180;
      return hub(G,
        `Lähtevät. ${G.clock(G.t)}. Taulussa lukee AB 0271 · LOS ANGELES · <em>${G.clock(G.S.dep)}</em>. ${G.t < open ? `Tulosteen laskukaavan mukaan tiski avataan klo ${G.clock(open)}.` : G.has('inline') ? 'Tiskin rullakalteri nousee.' : 'Tiski on auki. Jono etenee. Sinä et ole siinä.'}`,
        'airport',
        G.has('seen') && G.D >= 5 ? W('Etsit yhä katseellasi purserin univormua. Et ole nähnyt yhtään. Se ei ole sama asia kuin se, ettei sellaista olisi.') : '');
    },
    choices: (G) => [
      { label: 'Tulosta uusi tarkastuskortti automaatilla.', nd: 4, dd: 2, time: 8, do: (G) => { const n = G.count('kiosk'); G.nerves(3); G.note(n === 1 ? 'VARAUSTASI EI LÖYDY. Vaihdat toiselle automaatille. Syötät tiedot. VARAUSTASI EI LÖYDY, eri fontilla. Tätä ei totisesti voisi keksiä.' : n === 2 ? 'Automaatti miettii pitkään ja tulostaa tyhjän kortin. Otat sen talteen. Et tiedä miksi.' : 'VARAUKSESI ON MAJOITETTU. Sitten näyttö pimenee ja näyttää sinulle omat kasvosi.'); if (n >= 3) G.dread(3); }, next: 'airport' },
      { label: 'Asetu jonoon sille ainoalle tiskille.', if: (G) => !G.has('inline'), time: 5, do: (G) => { G.flag('inline'); G.note('Asetut jonoon. Se ei ole niinkään jono kuin päätös, jonka kaksisataa ihmistä on tehnyt yhdessä. Kukaan jonossa ei puhu lentoyhtiölle. Kaikki puhuvat toisilleen.'); }, next: 'airport' },
      { label: 'Välitä UK261-QR-koodi eteenpäin jonossa.', dd: -6, nd: -4, nerveMax: 90, if: (G) => G.has('uk261'), once: 'qr2', time: 15, do: (G) => { G.collect(2); G.nerves(-5); G.note('Koodi kulkee jonossa kädestä käteen kuin salasana. ' + V('"Olen valmis ryhtymään Kareniksi",') + ' sanoo fleecetakkinen mies, joka on se fleecemies.'); }, next: 'airport' },
      { label: 'Vaihda muiden kanssa tietoja hotelleista ja lähtöajoista.', nd: -4, dd: -4, nerveMax: 85, once: 'notes2', time: 15, do: (G) => { G.collect(1); G.nerves(-3); G.note('Jokainen lähetettiin eri paikkaan. Jokaiselle annettiin eri aika. Kaikki tulivat silti takaisin, koska tulosteessa niin luki, ja tässä te nyt olette, kaikki yhdessä oikeassa.'); }, next: 'airport' },
      { label: 'Etsi joku univormuun pukeutunut ja sano hänelle suoraan, mitä mieltä olet.', kind: 'conflict', nd: 8, time: 10, do: (G) => { G.strike(); G.note('Sanoit univormuun pukeutuneelle miehelle suoraan, mitä mieltä olet. ' + V('"Teemme parhaamme."') + ' Ei anteeksipyyntöä. Ei osanottoa. Ei edes näön vuoksi. Hän kirjoitti jotain muistiin.'); }, next: 'airport' },
      { label: 'Etsi uloskäynti. Ihan vain katsoaksesi.', dd: 6, dreadMax: 85, time: 8, once: 'exit', do: (G) => { G.dread(5); G.nerves(4); G.note('Ulko-ovissa lukee VAIN SAAPUVAT. Tulit niistä sisään. Painat kämmenesi lasia vasten, eikä ovi aukea, ja huomioliiviin pukeutunut mies pudistaa päätään sinua katsomatta.'); }, next: 'airport' },
      { label: 'Osta vettä. Takanasi seisova mies ei luota siihen, ettei vesi lopu.', nd: -4, nerveMax: 92, time: 10, once: 'water', do: (G) => { G.nerves(-3); G.note('Vettä, ja voileipä, jonka nimessä on ð-kirjain, ja – koska kaupassa sattuu olemaan niitä – sukkia. Sinulla oli sukkia. Ostat lisää sukkia. Kukaan tämän yön kokenut ei tuomitsisi sinua.'); if (!G.has('toothpaste')) { G.flag('toothpaste'); G.nerves(-4); } }, next: 'airport' },
      { label: 'Tarkkaile lähtevien taulua.', dd: 3, nd: 3, time: 6, do: (G) => { const n = G.count('board'); G.dread(2); G.note(n === 1 ? `AB 0271 · LOS ANGELES · ${G.clock(G.S.dep)}. Sitten taulu käy läpi kaikki maailman lennot ja palaa siihen. Sama aika. Toistaiseksi.` : n === 2 ? 'Aika ei ole muuttunut. Rivi on siirtynyt alemmas. Kaikki sen yläpuolella ovat lentoja, jotka lähtevät jonnekin.' : 'Katsot, kun taulu vaihtuu. LOS ANGELES. LOS ANGELES. Yhden ruudun ajan jotain, mikä ei ole kaupunki. LOS ANGELES.'); }, next: 'airport' },
      { label: 'Odota.', kind: 'comply', nd: 3, dd: 3, nerveMax: 90, time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Puoli tuntia. Jono ei etene, koska sillä ei ole mitään, mitä kohti edetä. Joku istuutuu lattialle, ja tapa leviää.', 'Puoli tuntia. Siivooja ajaa ohi koneellaan. Hänen mentyään lattia näyttää samalta ja jono on hieman lyhyempi.', 'Puoli tuntia. Puhelimesi värähtää, mutta siinä ei ole mitään. Kaikkien puhelimet värähtävät, yhtä aikaa, ja kaikki katsovat, eikä kukaan sano mitään.'])); }, next: 'airport' },
    ],
  };

  scenes.checkin = {
    art: 'airport',
    loc: 'Keflavík · Se ainoa tiski',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 180); if (G.S.strikes >= 3) G.end('left'); },
    text: (G) => p(
      'Tiski avataan ajallaan, toisin sanoen silloin, kun se oli omassa hiljaisuudessaan päättänyt. Virkailija ottaa passisi. Yksikään univormuun pukeutunut ei ole koko päivänä ollut vähääkään pahoillaan, ei edes näön vuoksi, eikä tämä mies aio katkaista putkea. ' + V('"Teemme parhaamme."'),
      G.has('booked') && 'Hän kurtistaa kulmiaan näytölle. ' + V('"Tietojemme mukaan sinut majoitettiin viime yönä Heathrow Renaissance Lodgeen."') + ' Hän näppäilee jotain. Hän sanoo, että asia on merkitty muistiin.',
      G.has('objected') && W('Hän vilkaisee näyttöön kiinnitettyä pientä korttia ja sitten sinua.'),
      G.has('seen') && W('Hän katsoo sinua hivenen liian pitkään. ' + V('"Huone 214",') + ' hän sanoo, eikä se ole kysymys.'),
      'Tarkastuskortti, vielä lämmin tulostimesta. Portti 12. Se on oikea. Tarkistat sen kolmeen kertaan.',
    ),
    choices: [
      { label: 'Mene portille.', time: 40, do: (G) => { if (G.has('booked')) G.strike(); G.nerves(-6); }, next: 'gate' },
    ],
  };

  scenes.gate = {
    art: 'gate',
    loc: 'Keflavík · Portti 12',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 60); G.dread(5); G.at(G.t + 20, 'chat', { body: 'Suurin osa asiakkaista on jo noussut koneeseen. 🙂' }); },
    text: p(
      'Olet matkustanut näiden ihmisten kanssa jo yli vuorokauden. Tunnet fleecen. Tunnet taaperon. Tunnet miehen paikalta 31C ja pariskunnan, joka lähetettiin hotelliin täysin vastakkaiseen suuntaan, ja miehen, joka ihan tosissaan ei luota siihen, ettei lentoyhtiöltä lopu vesi.',
      'Portin virkailija tarttuu mikrofoniin ja <em>karjuu</em> teille, että koneeseen noustaan ryhmä kerrallaan.',
      'Ja sata ihmistä nauraa hänelle päin naamaa. Ei ilkeästi. Vain – voimattomasti. Olette tässä vaiheessa muodostaneet itsehallinnollisen yhteisön, ja hänen yrityksensä komennella sitä on jostain syystä hauskinta, mitä koko päivänä on tapahtunut.',
    ),
    choices: [
      { label: 'Naura mukana.', nd: -6, dd: -4, nerveMax: 85, time: 10, do: (G) => { G.collect(1); G.nerves(-6); }, next: 'jetbridge' },
      { label: 'Nouse koneeseen oman ryhmäsi mukana, kiltisti.', kind: 'comply', dd: 5, time: 10, do: (G) => G.nerves(2), next: 'jetbridge' },
      { label: 'Kysy häneltä, milloin lento oikeasti lähtee.', kind: 'conflict', nd: 5, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) G.end('left'); }, next: 'jetbridge' },
      { label: 'Huuda takaisin. Kovempaa kuin hän.', kind: 'conflict', nerveMin: 80, nd: 10, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) G.end('left'); else G.note('Huusit. Neljän sekunnin ajan se tuntui suurenmoiselta. Sitten viereesi ilmestyi tummansiniseen pukeutunut mies, joka kirjoitti jotain muistiin ja poistui, ja nauru oli lakannut.'); }, next: 'jetbridge' },
    ],
  };

  scenes.jetbridge = {
    art: 'gate',
    loc: 'Keflavík · Matkustajasilta',
    text: p(
      'Jono jumiutuu matkustajasillalle. Tarkastuskorttiin painettu lähtöaika on jo ohi, ja se tarkastuskortti on uusin. Vaihdat edelläsi seisovan miehen kanssa tietoja siitä, mitä keskenään ristiriitaista teille kummallekin on kerrottu tulevasta lennosta.',
      'Sitten jono liikahtaa, käännyt kulman taakse, ja koneen oven sijasta edessäsi on…',
      '<em>Bussi.</em>',
      W('Ja tähän teidän piti nousta ryhmä kerrallaan.'),
    ),
    choices: [{ label: 'Nouse bussiin.', time: 10, next: 'tarmac' }],
  };

  scenes.tarmac = {
    art: 'tarmac',
    loc: 'Bussi · maantie · kumpuilevia laitumia',
    enter: (G) => G.dread(5),
    text: (G) => p(
      'Tämä bussi ei vie sinua asematason toiseen laitaan. Tämä bussi ajaa jotain, mikä näyttää aivan oikealta maantieltä, aivan oikeiden kumpuilevien laidunten halki, joilla on aivan oikeita lampaita.',
      G.has('seen') ? 'Bussin etuosassa seisoo kaiteesta kiinni pitäen purserin univormuun pukeutunut mies. Hän kääntyy. Hän katsoo sinua – vain sinua – täsmälleen yhtä kauan kuin hän katsoi ikkunaasi. ' + V('"Sinä katsoit",') + ' hän sanoo ystävälliseen sävyyn ja kääntyy takaisin.' : 'Kuljettaja ei puhu. Radiosta tulee jotain, joka saattaa olla säätiedotus.',
      'Kukaan ei sano mitään. Joku takaosassa alkaa nauraa ja lopettaa sitten.',
    ),
    choices: [
      { label: 'Pysy kyydissä. Tähyile taivaanrantaa, näkyisikö jotain siivekästä.', kind: 'comply', dd: 5, time: 15, next: 'plane' },
      { label: 'Mene eteen. Kysy kuljettajalta, minne tämä bussi on menossa.', kind: 'conflict', nd: 4, time: 15, do: (G) => { G.nerves(5); G.flag('asked_driver2'); }, next: 'plane' },
      { label: 'Vaadi päästä ulos. Heti.', kind: 'conflict', sub: 'Tämä ei ole asemataso.', do: (G) => G.end('pastures') },
    ],
  };

  scenes.plane = {
    art: 'plane',
    loc: 'Asemataso · jossain',
    text: (G) => p(
      G.has('asked_driver2') && W('Hän osoitti eteenpäin, tuulilasin läpi, kohti laidunta. Sitten laidun loppui.'),
      'Luulet näkeväsi oman lentokoneesi. Sinua ei siis luultavasti ole siepattu.',
      'Teidät asetetaan jonoon ulkosalle, hivuttautumaan kohti portaiden juurta. Ja sitten alkaa sataa. Naurat ääneen, eikä vähiten siksi, että lähtöaika on jo, ilmiselvästi, ohi.',
      'Istuin. Vyö. Se hienosteleva ääni, luurissa: ' + V('"Suurin osa asiakkaistamme on ollut ymmärtäväisiä ja kärsivällisiä."') + ' Sitten hän onnittelee itseään, varsin pitkään, niistä turvallisuusmenettelyistä, jotka toivat teidät Islantiin.',
      'Sitten hän selittää, miten hyvitystä haetaan. Suoristat selkäsi. Kyse on lennon wifistä.',
      'Sitä et aio tehdä.',
    ),
    choices: [
      { label: 'Sulje silmäsi.', do: (G) => G.end(G.S.collective >= 5 ? 'collective' : 'home') },
    ],
  };

  /* ================================================================ endings */
  const endings = {
    terminal: {
      art: 'terminal', title: 'TERMINAALI', kind: 'bad',
      hint: 'Aina joku kuuluttaa jotain.', blurb: 'Odotit kuulutusta.',
      text: p(
        'Kukaan ei kuuluta mitään. Kukaan ei aikonutkaan. Kello 03:10 saapuvien hallin valot himmenevät neljäsosaan, ja sen jälkeen halli on hahmo, jonka pikemminkin muistat kuin näet.',
        'Puhelimessasi on yksi palkki kenttää ja uusi sähköposti. <em>Olemme järjestäneet teille bussikuljetuksen.</em> Siinä ei sanota minne. Eikä koskaan sanota.',
        'Aamulla siivoojat löytävät tarkastuskortin ja vievät sen löytötavaroihin. Täällä ollaan siinä suhteessa hyvin tunnollisia.',
      ),
    },
    accommodated: {
      art: 'road', title: 'MAJOITETTU', kind: 'bad',
      hint: 'Sähköpostissa oli logo.', blurb: 'Vahvistit varauksen.',
      text: p(
        'Auto on lämmin, istuimet ovat nahkaa eikä kuljettaja puhu. Kojelaudan näytössä lukee HEATHROW RENAISSANCE LODGE · 1 894 km · SAAPUMINEN —:—.',
        'Katsot, kuinka lentokentän valot kutistuvat. Jonkin ajan päästä valoja ei ole enää lainkaan – vain renkaiden ääni ja uuden sähköpostin pieni kilahdus, joka saapuu vahvistamaan, että majoituksesi on järjestetty.',
      ),
    },
    crew: {
      art: 'stand', title: 'MIEHISTÖ', kind: 'bad',
      hint: 'Siinä oli vaakuna. Se oli oikein hieno.', blurb: 'Nousit siihen hienoon.',
      text: p(
        'Bussissa tuoksuu uusi verhoilu eikä mikään muu. Kaikki hymyilevät sinulle, kun kuljet ohi. Kenelläkään ei ole eilisiä vaatteita päällään, koska kenelläkään täällä ei ole eilistä.',
        'Purseri sulkee oven pehmeällä, kalliin kuuloisella äänellä. ' + V('"Suurin osa asiakkaistamme on ollut ymmärtäväisiä ja kärsivällisiä."') + ' Hän tarkoittaa sinua. Olet ollut ymmärtäväinen. Olet ollut hyvin kärsivällinen.',
        'Bussi ajaa ulos valosta, ja sen jättämä pysäkki on tyhjä, ja on ollut jo jonkin aikaa.',
      ),
    },
    convenience: {
      art: 'road', title: 'MUKAVUUS', kind: 'bad',
      hint: 'Kahdenkymmenen minuutin kävely. Tässä kunnossa.', blurb: 'Nousit kyytiin puolimatkassa 10-11:een.',
      text: p(
        'Bussissa on lämmin, ja istuimet ovat sisäänpäin, mitä et huomannut ennen kuin istuuduit. ' + V('"Teemme parhaamme",') + ' sanoo purseri, ja ovi taittuu kiinni, ja 10-11 lipuu ohi vasemmalla puolella, kaikki valot päällä eikä ketään sisällä.',
        'Sitä hammastahnaa et saa koskaan.',
      ),
    },
    nightcoach: {
      art: 'corridor', title: 'YÖBUSSI', kind: 'bad',
      hint: 'Viimeinen kutsu.', blurb: 'Avasit koputtajalle.',
      text: p(
        'Käytävä on tyhjä ja kokolattiamatto märkä. Porraskäytävästä kuuluu: ' + V('"Lähdemme nyt."') + ' Seuraat ääntä, koska se on ainoa koko yönä saamasi ohje, johon liittyi kellonaika.',
        'Bussi odottaa parkkipaikalla sisävalot päällä. Kaikki sisällä ovat jo kääntyneet hotelliin päin. Sinulle on varattu paikka. Paikalla on itse asiassa pieni tulostettu kortti, jossa lukee nimesi, Arial-fontilla.',
      ),
    },
    lift: {
      art: 'corridor', title: 'HISSI', kind: 'bad',
      hint: 'Epäkunnossa, Arial-fontilla.', blurb: 'Astuit hissiin, joka tuli kutsumatta.',
      text: p(
        'Ovet sulkeutuvat hyvän hotellin kohteliaisuudella. Takaseinän peilistä näet itsesi: lentovaatteet, kasvot, pienen 10-11:n pussin, jos sellainen sinulla on. Hissi laskeutuu. Se laskeutuu pidempään kuin rakennuksessa on kerroksia.',
        'Kun ovet aukeavat, edessä on lämmintä valoa ja istuinrivejä, ja kaikki niillä istuvat kääntyvät katsomaan sinua ja hymyilevät, ja purseri sanoo: ' + V('"Kiitos kärsivällisyydestäsi",') + ' ja tarkoittaa sitä.',
      ),
    },
    tantalus: {
      art: 'carpark', title: 'TANTALOS', kind: 'bad',
      hint: 'Olet aina halunnut käydä Islannissa.', blurb: 'Menit kuumille lähteille.',
      text: p(
        'Vesi on 38-asteista, taivas on käytetyn nenäliinan värinen, ja sinulla on jalassasi lennolta jääneet sukat, koska muita sukkia sinulla ei ole. Se on, objektiivisesti katsoen, kaunista.',
        'Kello 11:00 bussi lähtee kolmenkymmenen kilometrin päässä olevan hotellin parkkipaikalta ilman sinua. Kello 11:04 saapuu sähköposti, jonka mukaan bussisi lähti kello 09:00. Kello 11:05 chatbot kysyy, viihdyitkö.',
        'Kunpa et olisi pidellyt sitä apinankäpälää sanoessasi sen.',
      ),
    },
    noshow: {
      art: 'lobby', title: 'NO-SHOW', kind: 'bad',
      hint: 'Kyltissä luki 11:00.', blurb: 'Odotit täsmälleen kyltin ilmoittamaa aikaa.',
      text: (G) => p(
        'Kello 11:30 mennessä kyltti on viety pois. Vastaanotossa ei muisteta, että sitä olisi koskaan laitettu. ' + V(LX('"Kuulutko siihen lentoyhtiön ryhmään? He lähtivät jo."')) + ' Hän sanoo sen ystävällisesti.',
        'Aulan kahviautomaatista kuuluu ääni kuin jokin rykisi. Kun tarkistat, varaustasi ei löydy.',
      ),
    },
    left: {
      art: 'airport', title: 'JÄLKEEN JÄÄNYT', kind: 'bad',
      hint: 'Sanoihan hän.', blurb: 'Kolme valitusta, kaikki merkitty.',
      text: p(
        V('"Palautteesi on merkitty muistiin",') + ' sanoo univormuun pukeutunut mies, ja käy ilmi, että niin on todella tehty; kaikki, pienelle kortille, siistillä käsialalla. Kortissa on kolme ruksia.',
        V('"Kuten koneessa ilmoitettiin, asiakkaat, jotka vastustavat operatiivisia päätöksiä tai asettuvat niitä vastaan, voidaan poistaa lennolta."') + ' Hän sanoo tämän vailla minkäänlaista pahansuopuutta, mikä on pahinta. Sitten hän pyytää seuraavaa matkustajaa astumaan esiin, ja jono sulkeutuu ylläsi kuin vesi.',
      ),
    },
    pastures: {
      art: 'tarmac', title: 'LAITUMET', kind: 'bad',
      hint: 'Tämä bussi ajaa oikeaa maantietä.', blurb: 'Jäit pois asematason bussista.',
      text: p(
        'Bussi pysähtyy, kuten halusit. Ovi avautuu levikkeelle, aidalle, lampaille ja tuulelle, joka on tullut pitkän matkan sinua tapaamaan. ' + V('"Kuten haluat",') + ' sanoo kuljettaja, ja bussi jatkaa matkaa ilman sinua kohti jotain, joka saattaa tuolta etäisyydeltä katsottuna olla lentokone.',
        'Islanti ei ole tehnyt mitään väärää. Lampaat ovat oikein mukavia.',
      ),
    },
    home: {
      art: 'plane', title: 'KOTIIN (TAI GRÖNLANTIIN, TAI HELVETTIIN)', kind: 'good',
      hint: 'Nähdään Los Angelesissa.', blurb: 'Pääsit perille. Enimmäkseen yksin.',
      text: p(
        'Istut istuimella. Istuin on lentokoneessa. Lentokone liikkuu, sikäli kuin pystyt päättelemään, Los Angelesin suuntaan.',
        'Kukaan univormuun pukeutunut ei pyytänyt kertaakaan anteeksi. Wifi-hyvitys on yhä hakematta.',
        'Nähdään Los Angelesissa kymmenen tunnin päästä. Tai Grönlannissa. Tai helvetissä.',
      ),
    },
    collective: {
      art: 'plane', title: 'LHR–LAX:N ITSEHALLINNOLLINEN YHTEISÖ', kind: 'good',
      hint: 'Huhupuhe ei ole virallinen kanava.', blurb: 'Pääsit perille, ja niin pääsivät kaikki, joiden kanssa puhuit.',
      text: p(
        'Portailla joku nauraa, ja sitten nauravat kaikki, eikä sateella ole enää väliä. Olette matkustaneet yhdessä yli kaksikymmentäkahdeksan tuntia. Sinulla on QR-koodi, fleecemies, mies paikalta 31C ja taapero, joka on nähnyt yhtä sun toista.',
        'Koko tämän koettelemuksen tarkimmat ja hyödyllisimmät tiedot tulivat Arial-fontilla tulostetuista papereista ja satunnaisilta matkustajilta, jotka välittivät huhupuheita. Kukaan univormuun pukeutunut ei pyytänyt kertaakaan anteeksi. Kävi ilmi, ettet tarvinnutkaan sitä.',
        'Nähdään Los Angelesissa. LHR–LAX:n itsehallinnollisen yhteisön puolesta toivotat tehohoidossa olevalle miehelle pikaista paranemista.',
      ),
    },
  };

  /* ================================================================ interface strings */
  const ui = {
    tabMail: 'Posti', tabAlly: 'Ally', tabSms: 'SMS', tabPaper: 'Paperi', phone: 'PUHELIN',
    nerves: 'HERMOT', dread: 'KAUHU', noted: 'MERKITTY', day: 'PÄIVÄ',
    board: 'Nouse kyytiin', look: 'Katso tarkemmin', lookHint: 'Vie muutaman minuutin.',
    again: 'Lennä uudestaan', endings: 'Loppuratkaisut', back: 'Takaisin', howto: 'Näin tämä toimii', start: 'Nouse kyytiin', design: 'Suunnittelumuistio',
    gameOver: 'PELI OHI', madeIt: 'PÄÄSIT PERILLE — SUUNNILLEEN',
    subtitle: 'MAJOITUSKAUHUA · TEKSTIPELI · 20–30 MINUUTTIA',
    galleryIntro: 'Kaikki tavat, joilla tämä voi päättyä. Lukitut odottavat yhä löytäjäänsä.', locked: '???',
    noMail: 'Ei postia. Se ainakin on normaalia.', noSms: 'Ei viestejä.', noPaper: 'Kuvia löytämistäsi tulostetuista kylteistä. Niitä löytyy kyllä.',
    allyIntro: 'Ally — Albion Atlanticin virtuaaliavustaja. Vastaa yleensä välittömästi.', inbox: '‹ Saapuneet',
    emailFoot: 'Tämä on automaattinen viesti. Tähän osoitteeseen lähetettyjä vastauksia ei seurata, ei lueta, eivätkä ne ole mahdollisia. Albion Atlantic — Teemme parhaamme.',
    from: 'Lähettäjä:', sent: 'Lähetetty', received: 'Vastaanotettu', arrived: 'saapui', photographed: 'Kuvattu',
    tMail: 'POSTI', tSms: 'SMS', tPaper: 'PAPERI', tAlly: 'ALLY', tNoted: 'MERKITTY · Lentoyhtiö on kirjannut palautteesi.',
    gateNerves: 'Äänesi ei pysyisi vakaana.', gateDread: 'Et saa sitä itsestäsi irti.',
  };

  return { start, scenes, endings, chat, ui, T, lang: 'fi', broken: CONTENT_BROKEN };
})();
