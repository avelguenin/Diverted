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
  // the chatbot is called Ally, but the narration only calls it that once the player has opened it
  const ALLY = (G) => (G.S.chat.some((m) => m.who === 'bot' && m.read) ? 'Ally' : 'lentoyhtiön chattibotti');
  const ALLY_MSG = (G) => (G.S.chat.some((m) => m.who === 'bot' && m.read) ? 'Viesti Allylta.' : 'Viesti lentoyhtiön chattibotilta.');
  // hubs end with a nudge when the phone has something unread: what it is, the game never says here
  const NUDGE = (G) => (G.unread() > 0 ? W(G.unread() === 1 ? 'Puhelimessasi on jotain, mitä et ole lukenut.' : 'Puhelimessasi on asioita, joita et ole lukenut.') : '');
  const hub = (G, status, key, extra) => p(status, G.last(), G.amb(key, AMB[key]), extra, NUDGE(G));
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
      { d: 2, t: 'Jokaisessa ovessa on numero. Jokaisen numeron alla pimeä juova. Sinun numerosi alla valojuova.' },
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
      { d: 5, t: () => 'Virkailija sanoo nostamatta katsettaan: ' + LX('“He asked for you.”') },
      { d: 5, t: 'Ovet liukuvat auki. Kylmää ilmaa. Kukaan ei tule sisään. Ne jäävät auki.' },
    ],
    carpark: [
      { d: 2, t: 'Tuulta. Laavakenttiä. Tie, joka johtaa yhteen suuntaan pimeyteen ja toiseen suuntaan hiukan erilaiseen pimeyteen.' },
      { d: 2, t: 'Hotelli takanasi on valaistu kuin akvaario.' },
      { d: 3, t: 'Soraa. Yksi ainoa lyhtypylväs. Sadetta, joka ei saa päätettyä.' },
      { d: 3, t: 'Bussin muotoinen pimeä hahmo parkkipaikan perällä, moottori sammuksissa. Tai käynnissä.' },
      { d: 4, t: 'Parkkipaikan perällä olevassa bussissa palavat sisävalot. Jokaisella paikalla istuu joku.' },
      { d: 4, t: 'Joku seisoo bussin oven vieressä hyvin suorana, kädet ristissä edessään.' },
      { d: 5, t: 'Bussin ovella seisova mies katsoo hotellia. Yhtä ikkunaa. Tiedät kyllä, mitä.' },
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
    if (d >= 5) return '\n\n' + G.pick(['Miksi sinä olet edelleen tässä?', 'Enemmistö asiakkaat on nousseet koneeseen.', 'Me voimme nähdä että sinä olet edelleen siellä.']);
    if (d >= 3) return '\n\n' + G.pick([G.has('lind') ? 'Sinä olet edelleen huone 7.' : 'Sinä olet edelleen huone 214.', 'Ole hyvä pysy missä sinä olet.', 'Onko siellä jotain muuta? Siellä ei ole mitään muuta.']);
    return '';
  };
  const chat = [
    {
      label: 'Missä hotellini on?',
      answer: (G) => {
        if (G.has('at_airport2')) return (G.has('lind') ? 'Sinun accommodation oli Hótel Hraun. Meidän tiedot näyttävät sinä et käyttänyt sitä. Haluaisitko sinä jättää review?' : 'Sinun accommodation oli Hótel Hraun. Me toivomme sinä nautit sinun oleskelu! Haluaisitko sinä jättää review?') + tail(G);
        if (G.has('lind')) return 'Sinun accommodation on Hótel Hraun. Sinä olet Hótel Lind, huone 7. Ole hyvä palaa sinun accommodation.' + tail(G);
        if (G.has('at_hotel')) return 'Sinä olet Hótel Hraun, huone 214. Ole hyvä pysy sinun huoneessa kunnes kerätty.' + tail(G);
        return 'Hieno kysymys! Sinun accommodation on järjestetty Heathrow Renaissance Lodge, Bath Road. Booking linkki on sähköpostattu sinulle. 🛏️';
      },
    },
    {
      label: 'Milloin bussi lähtee?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Sinun bussi lentokoneeseen lähtee kun boarding on valmis. Ole hyvä nouse ryhmän mukaan. 🚌' + tail(G);
        if (G.has('morning') && G.has('lind')) return 'Sinun transfer Hótel Lind on vahvistettu 09:00. Ole hyvä odota lobbyssa. 🚌' + tail(G);
        if (G.has('morning')) return 'Sinun transfer lentokentälle on vahvistettu 08:00. Ole hyvä ole lobbyssa 15 minuuttia aikaisin.' + tail(G);
        if (G.has('lind')) return 'Ajoneuvo on järjestetty palauttamaan sinut sinun accommodation 04:30. Staff jäsen tulee koputtamaan.' + tail(G);
        if (G.has('at_hotel')) return 'Sinun bussi lähtee 04:30. Staff jäsen tulee koputtamaan.' + tail(G);
        return 'Bussit on organisoitu kaikille asiakkaat. Ole hyvä jatka busseihin. 🚌';
      },
    },
    {
      label: 'Mitä tapahtuu?',
      answer: (G) => G.pick([
        'Sinun lento AB 0271 Los Angeles on ajassa. ✈️',
        'Minä olen täällä auttamaan! Lento AB 0271 on tällä hetkellä operoiva kuten aikataulutettu.',
        'Kaikki on etenevä normaalisti. Onko siellä jotain muuta mitä minä voin auttaa kanssa?',
      ]) + tail(G),
      do: (G) => G.nerves(2),
    },
    {
      label: 'Haluan tehdä valituksen.',
      warn: true,
      answer: 'Minä olen pahoillani kuulla se. Sinun feedback on tallennettu sinun booking vastaan. Kiitos että lennät Albion Atlantic — me teemme meidän parasta. 🙏',
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
      W('Pelaa mieluiten kuulokkeilla, äänet päällä.'),
    ),
  };

  scenes.howto = {
    loc: 'Turvaohjekortti',
    text: p(
      '<em>Lue kaikki.</em> Puhelimeesi (oikealla, tai PUHELIN-painikkeen takana) tulee lentoyhtiön sähköposteja, Ally-nimisen keskustelubotin viestejä, tekstiviestejä sekä valokuvia kaikista vastaan tulevista tulostetuista kylteistä. Joku puhuu totta. Se ei aina ole se, jolla on logo.',
      '<em>Kaksi mittaria.</em> Molemmat täyttyvät. Kumpikaan ei päätä peliä. Sen sijaan ne sulkevat ovia: mittarin täyttyessä osa siitä, mitä olisit voinut sanoa tai tehdä, käy mahdottomaksi, ja jäljelle jää se, mikä jää. Pienet valinnat täyttävät mittareita. Uni, ruoka ja muut ihmiset tyhjentävät niitä – hieman.',
      '<em>Merkitty</em> laskee ne valitukset, jotka lentoyhtiö on kirjannut sinusta. Kolmannen kohdalla yhtiö ryhtyy toimiin – siellä, missä voi.',
      '<em>Akku</em> on numero puhelimen nurkassa. Se laskee. Kun se on nollassa, niin on puhelinkin, ja kaikki, mikä sen jälkeen saapuu, saapuu ei kenellekään, kunnes keksit keinon herättää sen henkiin – ja silloin kaikki saapuu yhdellä kertaa.',
      'Paikat ovat tiloja, joissa voit liikkua. Tekeminen vie minuutteja; kello käy vain, kun teet jotakin. Busseja tulee ja menee. Katso niitä tarkkaan, ennen kuin nouset kyytiin. Oikea bussi näyttää siltä, miltä sinusta tuntuu.',
      'Yksi pelikerta kestää kaksi–kolmekymmentä minuuttia. Loppuja on kolmetoista, ja yksi niistä on Los Angeles.',
    ),
    choices: [{ label: 'Takaisin', next: 'title' }],
  };

  scenes.gallery = { type: 'gallery' };

  /* ---------------------------------------------------------------- Day 0 · the approach
     Boarding, the seat, the demonstration, the meal, the dark hours. Nothing
     goes wrong here. That is what it is for: four hours of a cabin working
     exactly as it should, with one man in it counting. */
  scenes.door = {
    art: 'gate',
    loc: 'Lontoo Heathrow · Matkustajasilta · koneen ovi',
    enter: (G) => {
      if (G.once('welcome_mail')) {
        G.msg('sms', { from: 'AlbionATL', key: 'seat', body: 'AB0271: Sinun boarding pass. Istuin 31B. Ryhmä 4. Älä vastaa.' });
        G.msg('email', { from: 'Albion Atlantic', subj: 'Tervetuloa aboard AB 0271', key: 'welcome', body: 'Rakas Asiakas,\n\nTervetuloa aboard Albion Atlantic lento AB 0271 Los Angeles. Sinun lento on ajassa.\n\nSinun istuin: 31B. Sinun boarding ryhmä: 4.\n\nMeidän matkustamo staff on täällä varmistamaan sinun turvallisuus ja mukavuus. Turvallisuus meidän asiakkaiden on tantamount.\n\nArvostettuna asiakkaana sinut on kutsuttu hyväksymään ilmainen upgrade Business Class tälle lennolle. Business Class asiakkaat nauttivat hiljaisempi matkustamo ja heihin luotetaan löytämään oma tie.\n\nNauti sinun lento.', actions: [{ label: 'Hyväksy ilmainen upgrade', if: (G) => !G.has('business') && !G.has('at_hotel'), do: (G) => { G.flag('business'); G.nerves(-2); G.dread(4); G.note('Hyväksyit korotuksen. Istuimesi ei muuttunut mitenkään. Lentoemäntä toi lämpimän pyyhkeen, ja ohi kulkeva purseri sanoi ' + V('"Business",') + ' itsekseen, ja teki pienen merkinnän.'); } }] });
      }
    },
    text: (G) => p(
      G.last(),
      'Matkustajasillassa tuoksuu kerosiini ja kokolattiamatto. Koneen ovella purseri: pitkä, ohimoilta harmaantunut, hymy silitetty samalla kertaa kuin paita. Hän ei katso tarkastuskortteja. Hän katsoo kasvoja, yksi kerrallaan, ja kysyy jokaiselta kysymyksen, ja painaa vastauksen mieleensä.',
      'Puhelimesi värähti kahdesti matkalla siltaa alas. Et ole katsonut.',
      V('"Tervetuloa kyydissä. Istuin?"'),
      'Et tiedä istuinpaikkaasi. Se on puhelimessasi, kaiken muun kanssa.',
    ),
    choices: (G) => [
      { label: '"31B."', if: (G) => G.readMsg('seat') || G.readMsg('welcome'), nd: -2, time: 2, do: (G) => G.note(V('"31B. Kiitos sinulle."') + ' Hän sanoi sen kuin olisi arkistoinut sen. Hän katsoi seuraavia kasvoja.'), next: 'boarding' },
      { label: '"Kolmekymmentä-jotain. Löydän sen kyllä."', kind: 'conflict', nd: 3, dd: 1, time: 3, do: (G) => { G.flag('seat_vague'); G.note(V('"31B",') + ' hän sanoi katsomatta mihinkään. ' + V('"Kolmekymmentäyksi B. Me pidämme että meidän asiakkaat tietävät missä he ovat."') + ' Hän teki pienen merkinnän kädessään olevaan korttiin ja katsoi seuraavia kasvoja.'); }, next: 'boarding' },
      { label: '"Bisnesluokka."', kind: 'comply', if: (G) => G.has('business'), dd: 2, time: 2, do: (G) => G.note(V('"Tietenkin",') + ' hän sanoi, eikä väistänyt tieltä hetkeä pidempään kuin hetken, ja sitten väisti. ' + V('"31B. Nauti sinun lento."')), next: 'boarding' },
      { label: 'Katso ensin puhelimesta.', sub: 'Sähköposti. Tekstiviesti. Jommassakummassa se on.', time: 1, do: (G) => { G.openPhone(G.S.inbox.some((m) => m.ch === 'sms' && !m.read) ? 'sms' : 'email'); G.note('Jono hengittää takanasi. Hän odottaa. Hän on hyvin hyvä odottamaan.'); }, next: 'door' },
    ],
  };

  scenes.boarding = {
    art: 'gate',
    loc: 'Lontoo Heathrow · Matkustajasilta · Paikka 31B',
    text: (G) => p(
      G.last(),
      'Rivi 31. Käytäväpaikka, 31B. Paikalla 31C suunnilleen sinun ikäisesi mies ja pokkari, jota hän on jo lakannut lukemasta. Hän nyökkää. Sinä nyökkäät. Siinä koko keskustelu, eikä siihen tule lisää vähään aikaan.',
      'Jossain takanasi kaksivuotiaalle kerrotaan kärsivällisesti, että kone ei lähde vielä. Kone ei lähde vielä.',
    ),
    choices: [
      { label: 'Tervehdi 31C:tä.', nd: -1, dd: -1, time: 20, do: (G) => { G.flag('met31c'); G.note('Hän vastasi tervehdykseen. Hän on menossa kotiin. Hän sanoi sen niin kuin se sanotaan yhdeksän tunnin lennon alussa: kotiin, ikään kuin se olisi paikka, jonne kone varmasti pääsisi perille.'); }, next: 'takeoff' },
      { label: 'Nosta laukku hattuhyllylle, istuudu, kiinnitä turvavyö ennen kuin kukaan ehtii pyytää.', kind: 'comply', dd: 2, time: 20, do: (G) => G.note('Vyö kiinni. Laukku hyllyllä. Ohi kulkiessaan purseri vilkaisi sitä ja nyökkäsi tuskin havaittavasti – niin kuin nyökkää mies, joka pitää listaa.'), next: 'takeoff' },
      { label: 'Mene takaisin ja kysy ovella seisovalta purserilta, onko lento aikataulussa.', nd: 1, time: 20, do: (G) => G.note(V('"Kaikki on ajassa",') + ' hän sanoi lämpimästi, ja sitten – ikään kuin perusteellisuuden nimissä – ' + V('"Kaiken."') + ' Hän katsoi edelleen perässäsi sisään tulevia matkustajia.'), next: 'takeoff' },
      { label: 'Lue istuintaskun turvaohjekortti. Kunnolla, kerrankin.', nd: -2, time: 20, do: (G) => G.note('Suoja-asento. Lähimmät uloskäynnit, jotka saattavat olla takanasi. Pieni piirros ihmisestä, joka liukuu mereen tyyni ilme kasvoillaan. Panet kortin takaisin. Et ole koskaan ennen lukenut sellaista, etkä tiedä, miksi luit nyt.'), next: 'takeoff' },
    ],
  };

  scenes.takeoff = {
    art: 'cabin',
    loc: 'Kiitotie 27L · Heathrow',
    text: p(
      'Purseri hoitaa turvaesittelyn itse, matkustamon etuosassa, kun video pyörii hänen takanaan äänettömänä. Hän tekee sen hitaasti. Hän tekee sen katsoen jokaista riviä vuorollaan, ikään kuin tarkistaisi, että uloskäynnit ovat siellä, missä kortti väittää.',
      V('"Siinä epätodennäköisessä tapahtumassa matkustamon paineen menetys. Siinä epätodennäköisessä tapahtumassa laskeutuminen vedelle. Siinä epätodennäköisessä tapahtumassa. Turvallisuus meidän asiakkaiden on tantamount."') + ' Se on outo lause turvaesittelyyn, ja hän sanoo sen kuin se olisi mitä tavallisin.',
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
      'Illallinen tulee kärryllä, jota työntää kaksi lentoemäntää työhön kuuluva hymy kasvoillaan. Kanaa vai pastaa. Purseri seuraa kärryä muutaman rivin päässä; hän ei tarjoile, kävelee vain, katsoo tarjottimia, katsoo ihmisiä tarjottimien takana.',
      G.has('met31c') ? 'Paikan 31C mies otti pastan. Hän ei syö sitä. Hän katsoo selkänojan näytön karttaa, jolla pieni lentokone ei ole vielä päässyt Irlannin rannikolle.' : 'Paikan 31C mies otti pastan. Hän ei syö sitä. Hän ei ole sanonut sanaakaan.',
    ),
    choices: [
      { label: 'Kanaa.', time: 40, nd: -2, do: (G) => G.note('Kana oli kanaa samaan tapaan kuin turvaohjekortin meri on merta. Söit sen. Olit menossa kotiin; siellä söisit kunnolla.'), next: 'night' },
      { label: 'Tilaa kahvi. Sitten toinen.', nd: 6, sub: 'Olet totuttamassa elimistöäsi Tyynenmeren aikaan, etkä aio antaa periksi.', time: 40, do: (G) => { G.flag('coffee'); G.nerves(-3); G.note('Kaksi kahvia. Lentokonekahvia, toisin sanoen lämmintä mielipidettä. Joit ne periaatteen vuoksi. Periaate oli Tyynenmeren aika, ja ohi kulkiessaan purseri katsoi toista kuppia hiukan pidempään kuin kuppi ansaitsee.'); }, next: 'night' },
      { label: 'Jätä illallinen väliin. Kallista selkänoja. Yritä nukkua jo nyt.', kind: 'comply', dd: -1, nd: -3, time: 40, do: (G) => G.note('Nukuit vähän, niin kuin lentokoneessa nukutaan: et niinkään nukkunut kuin olit pois päältä. Kun tulit pintaan, tarjottimet oli viety, matkustamon valot himmennetty, ja joku seisoi edessä käytävällä aivan liikkumatta.'), next: 'night' },
      { label: 'Kysy lentoemännältä kohteliaasti, onko purseri aina tällainen.', kind: 'conflict', nd: 4, dd: -2, time: 40, do: (G) => G.note('Hän naurahti kerran, ja sitten ei enää, ja katsoi käytävää pitkin sinne, missä purseri seisoi. ' + V('"Hän on erittäin thorough",') + ' hän sanoi ja antoi sinulle pastan, jota et ollut pyytänyt.'), next: 'night' },
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
      { label: 'Nuku, tai yritä ainakin.', kind: 'comply', dd: -1, nd: -4, time: 40, do: (G) => G.note('Suljit silmäsi. Niiden takana käytävällä kävely jatkui. Jossain edempänä nainen sanoi ' + V('"Onko hän kunnossa?"') + ' ja joku sanoi ' + V('"Ole hyvä palaa sinun istuin",') + ' etkä sinä avannut silmiäsi, koska et ollut se, jolle puhuttiin. Vielä.'), next: 'cabin' },
      { label: 'Katso karttaa.', dd: 2, time: 40, do: (G) => G.note('Pieni lentokone liikkui niin hitaasti, että se näytti empivän. Sitten kartta ei hetkeen näyttänyt yhtään mitään, pelkkää sinistä, ja jäljellä oleva lentoaika pysyi lukemassa 5:12 pidempään kuin minuutti kestää.'), next: 'cabin' },
      { label: 'Mene etuosan vessaan. Kävele verhon ohi.', whyNot: 'Ei hänen ohitseen.', dd: 4, nd: 2, dreadMax: 90, time: 40, do: (G) => { G.flag('saw_galley'); G.note('Verhon raosta: joku keittiön lattialla, lentoemäntä polvillaan vieressä, peitto, käsi. Et näe, mikä on vialla, eikä sinulle kerrota. Purseri seisoo heidän yllään kädet ristissä – katsomassa ei lattiaa vaan matkustamoa, raon läpi, ja siis sinua. ' + V('"Ole hyvä palaa sinun istuin",') + ' hän sanoo liikuttamatta mitään muuta kuin suutaan.'); }, next: 'cabin' },
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
      { label: 'Kysy lentoemännältä kohteliaasti, mitä tapahtuu laskeutumisen jälkeen.', nd: 2, time: 15, do: (G) => { G.flag('asked_crew'); G.nerves(3); G.note('Hän hymyili sinulle niin kuin ihmiset hymyilevät autoon jätetylle koiralle. ' + V('"Kaikki tullaan kommunikoimaan."') + ' Hän ei sanonut, kuka. Hänen takanaan keittiön lähellä oleva mies seisoi yhä.'); }, next: 'cabin_purser' },
      { label: 'Yhdy kuoroon. Ääneen. Sinua odottaa elämä Los Angelesissa.', whyNot: 'Ei hänen kuullen.', kind: 'conflict', nd: 10, dreadMax: 80, time: 15, do: (G) => { G.strike(); G.flag('objected'); G.note('Sanoit sen. Et huutanut – mutta et hiljaakaan, ja muutama pää kääntyi, ja keittiön lähellä oleva mies osoitti sinua kuin todistuskappaletta. Hetken tuntui siltä kuin koko matkustamollinen ihmisiä olisi ollut samaa mieltä.'); }, next: 'cabin_purser' },
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
      V('"Hyvät naiset ja herrasmiehet. Minä olen vastuussa tämä matkustamo, ja turvallisuus meidän asiakkaiden on tantamount. Kuka tahansa joka vastustaa tai objektoi tätä diversion tullaan offloadaamaan Islannissa. Me teemme meidän parasta."'),
      'Hiljaisuus. Keittiön lähellä oleva mies istuutuu. Kutsunappi sammuu. Kolme riviä taaempana joku naurahtaa kerran ja vaikenee.',
      G.has('objected') && W('Hän ei katso keittiön lähellä olevaa miestä. Hän katsoo sinun riviäsi.'),
    ),
    choices: (G) => [
      { label: 'Niele se.', kind: 'comply', dd: 3, time: 15, do: (G) => G.note('Nielit sen. Kaikki nielivät. On merkillistä, kuinka nopeasti kaksisataa ihmistä voi päättää olleensa kärsivällisiä koko ajan.'), next: 'cabin2' },
      { label: G.has('objected') ? 'Katso ympärillesi. Katso, kuka muu pani vastaan.' : 'Katso ympärillesi. Katso, kuka pani vastaan.', time: 15, do: (G) => { G.nerves(-2); G.note('Neljät kasvot, ehkä viidet, yhä tiukkoina. Keittiön lähellä oleva mies. Nainen taaperon kanssa. Painat heidät mieleesi niin kuin painaisit mieleen uloskäynnit.'); }, next: 'cabin2' },
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
      'Taas purseri, luuri kädessä. ' + V('"Laskeutumisessa, ole hyvä pysy istuttuna sinun turvavyö kiinnitetty kunnes medical tiimi on hoitanut meidän asiakas etumatkustamossa. Minä annan sinun tietää kun sinä voit seisoa. Minä annan sinun tietää."'),
      'Sadetta ikkunoissa. Alhaalla rannikko kuin raaputettu jälki. Valot kaupungista, joka ei ole Reykjavík, ja sitten ei valoja lainkaan.',
      'Et ole koskaan ennen laskeutunut yöllä paikkaan, jossa kiitotie tuli näkyviin vasta, kun se oli jo allasi.',
    ),
    choices: [
      { label: 'Katso ulos ikkunasta.', whyNot: 'Ei hänen seistessään käytävällä.', dd: 5, nd: 3, dreadMax: 90, time: 25, do: (G) => { G.nerves(3); G.note('Sinisiä valoja, sitten oransseja, sitten sinisiä. Ambulanssi ovet selällään märällä asfaltilla, ja sen vieressä – ei lähellä, vaan vieressä – tummansiniseen univormuun pukeutunut mies, hyvin suorassa. Ääni käytävältä, aivan korvasi juuresta: ' + V('"Blind alas, ole hyvä."')); }, next: 'ground' },
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
      { label: 'Nouse seisomaan. Ihan vain venyttelemään.', whyNot: 'Hän sanoi: istu.', kind: 'conflict', nd: 6, dd: -3, dreadMax: 75, time: 15, do: (G) => { G.nerves(4); G.flag('stood'); G.dread(4); G.note(V('"Istu alas, ole hyvä."') + ' Ei kovaan ääneen. Hänen ei tarvinnut korottaa ääntään. Kaksisataa ihmistä katsoi, kun istuuduit.'); }, next: 'landing' },
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
          from: 'Albion Atlantic Customer Care', subj: 'Sinun yön yli accommodation', key: 'accommodation',
          body: `Rakas Asiakas,\n\nJohtuen operationaalinen diversion, sinun lento AB 0271 on viivästynyt yön yli. Me olemme järjestäneet accommodation sinulle.\n\nOle hyvä käytä linkki alla vahvistaaksesi sinun huone:\n\n<a href="#" onclick="return false">Heathrow Renaissance Lodge — Bath Road, Hounslow TW6</a>\n\nKuljetus sinun accommodation tullaan tarjoamaan.\n\nMe pahoittelemme kaikki epämukavuus. Me teemme meidän parasta.`,
          actions: [{ label: 'Avaa booking sivu', if: (G) => !G.has('at_hotel') && !G.has('booked'), next: 'heathrow' }],
        });
        G.bot('Hei! Minä olen Ally, sinun Albion Atlantic virtuaalinen assistentti. Minä näen sinun lento AB 0271 on ajassa. Miten minä voin auttaa? ✈️');
      }
    },
    text: (G) => p(
      G.last(),
      'Turvavyömerkki sammuu ilman kuulutusta. Se on se kuulutus. Terminaali on valaistu kuin jääkaapin sisus. Muutama sata teitä laahustaa koneesta sisään, ohi huomioliivimiehen, joka ei katso ketään.',
      G.has('objected') && W('Ulos mennessäsi purseri katsoi sinua hitusen liian pitkään.'),
      'Passintarkastus. Pitkä jono. Sitten miehistö kävelee sen ohi – koko miehistö, peräkanaa, vetolaukut samassa tahdissa, katsomatta oikealle eikä vasemmalle – ovesta, jossa lukee STAFF. Ovi ei niinkään sulkeudu heidän perässään kuin lakkaa olemasta ovi.',
      'Jono katsoo, kun tämä tapahtuu. Kukaan ei sano mitään. Puhelimesi värähtää, ja sitten värähtää uudestaan: sähköposti, ja se chattijuttu. Mitä ikinä he haluavat sinun seuraavaksi tekevän, se on siellä.',
    ),
    choices: [
      { label: 'Kirjoita chatbotille yhä hätäisemmin.', kind: 'comply', dd: 4, nd: 4, time: 10, do: (G) => { G.nerves(4); G.bot('Minä voin auttaa sen kanssa! Sinun lento AB 0271 on tällä hetkellä ajassa. Onko siellä jotain muuta? 😊'); G.note('Ally sanoo, että lento on aikataulussa. Katsot konetta ikkunasta. Sen valot on sammutettu.'); }, next: 'hall' },
      { label: 'Etsi joku ihminen. Ihan kuka tahansa.', whyNot: 'Kaikilla täällä on univormu.', dd: -4, dreadMax: 85, time: 10, next: 'icelander' },
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
      { label: 'Vahvista.', kind: 'comply', dd: 10, sub: 'Sanoivathan he, että kuljetus järjestetään.', time: 5, do: (G) => { G.flag('booked'); G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Booking vahvistettu — sinun auto odottaa', body: 'Sinun accommodation on vahvistettu.\n\nKuljettaja odottaa sinua ulkopuolella Arrivals. Ole hyvä etsi Albion Atlantic vaakuna.\n\nArvioitu matka aika: —:—' }); }, next: 'car' },
      { label: 'Sulje se. Olet Islannissa.', whyNot: 'Siinä on logo.', dd: -3, dreadMax: 90, time: 5, do: (G) => { G.nerves(2); G.note('Suljit varaussivun. Sähköposti on yhä paikallaan, logoineen päivineen, ja odottaa kärsivällisesti.'); }, next: 'hall' },
    ],
  };

  scenes.car = {
    art: 'stand',
    loc: 'Keflavík · Saapuvien edustalla',
    text: p(
      'Auto on tosiaan paikalla. Musta, pitkä, tahraton, ovessa pieni kultainen vaakuna. Kuljettaja pitelee tablettia, jossa lukee nimesi – nimesi, oikein kirjoitettuna, mikä on enemmän kuin mihin lentoyhtiö on tähän mennessä pystynyt.',
      V('"Renaissance varten?"'),
      'Hän avaa takaoven. Lämmintä ilmaa. Nahkaa. Parkkipaikan takana tie katoaa pimeyteen, jolla ei näytä olevan loppua.',
    ),
    choices: [
      { label: 'Nouse kyytiin.', kind: 'comply', sub: 'Lämmintä.', do: (G) => G.end('accommodated') },
      { label: 'Ei. Ei kiitos.', whyNot: 'Hänellä on nimesi.', dd: 5, dreadMax: 85, time: 5, do: (G) => { G.nerves(5); G.dread(8); G.note('Kuljettaja ei näyttänyt yllättyneeltä. Hän sulki oven, jäi seisomaan paikalleen ja seisoi siinä yhä, kun vilkaisit taaksesi ovilta.'); }, next: 'hall' },
    ],
  };

  scenes.icelander = {
    art: 'terminal',
    loc: 'Keflavík · Saapuvat',
    text: (G) => p(
      'Ovien luona seisoo kädet selän takana nainen, jonka univormu ei ole lentoyhtiön – ehkä lentoaseman, tai tullin, tai sitten hän on vain ihminen, jolla sattuu olemaan fleecetakki ja siinä merkki.',
      'Hän kuuntelee. Hän katsoo puhelintasi. Hän katsoo sähköpostia ja sen logoa.',
      V(LX('“Don\'t follow the emails,”')) + ' hän sanoo ystävällisesti, sen äänellä, joka on sanonut saman tänä yönä jo neljäkymmentä kertaa. ' + V(LX('“There are buses.”')),
      'Kysyt, missä. Hän viittaa, ylimalkaisesti, Islannin suuntaan.',
    ),
    choices: [
      { label: 'Kysy, puhuuko hän ranskaa.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 5, do: (G) => { G.flag('fr_asked'); G.flag('hint_icelander'); G.nerves(-4); G.dread(-4); G.note(LX('“A little. Not the emails. There are buses.”') + ' Hän sanoi sen sinun kielelläsi, varovasti, kuin kantaisi jotain täyttä.'); }, next: 'hall' },
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
      { label: 'Mene virran mukana.', whyNot: 'Kukaan ei käskenyt.', dreadMax: 90, time: 5, next: 'hall' },
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
    enter: (G) => { atLeast(G, 45); if (G.once('coach_mail_w')) G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Eteenpäin kuljetus järjestetty', stamp: G.t - 60, body: 'Rakas Asiakas,\n\nMe olemme organisoineet bussit transfer sinut sinun accommodation.\n\nOle hyvä jatka busseihin.\n\nMe teemme meidän parasta.' }); },
    choices: [
      { label: 'Siirry busseille.', kind: 'comply', time: 15, do: (G) => G.end('terminal') },
      { label: 'Juokse ovelle, jossa ei lue mitään.', whyNot: 'Et pysty juoksemaan.', nd: 5, dreadMax: 92, time: 5, do: (G) => { G.nerves(10); G.note('Juoksit. Kukaan ei pysäyttänyt sinua. Ovi, jossa ei lukenut mitään, avautui kylmään ilmaan, natriumlamppujen valoon ja – luojan kiitos – muiden ihmisten joukkoon.'); }, next: 'buses1' },
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
        'Kukaan ei ole kuuluttanut mitään. Tästä aulasta ei ole tullut sähköpostia, ei tekstiviestiä, ei kuulutusta. Lentosi matkustajia seisoskelee siellä täällä, kaksittain ja kolmittain: fleecetakkinen mies, nainen taaperon kanssa, vanhempi pariskunta ikkunan luona. Aulan perällä on ovi, jossa ei lue yhtään mitään.',
      )));
    },
    text: (G) => hub(G,
      `${G.clock(G.t)}. Saapuvien aula. Kaikki on kiinni. Sinulla ei ole laukkua, ei takkia, ei hammasharjaa, ja puhelimen akussa on ${G.battery()}%.`,
      'hall',
      G.t >= T(1, 2, 10) ? W('Aula tyhjenee. Sinun ei ehkä kannata jäädä sinne viimeiseksi.') : ''),
    choices: (G) => [
      { label: 'Kysy laukustasi. Kohteliaasti.', whyNot: 'Sinussa ei ole nyt mitään kohteliasta.', kind: 'comply', dd: 2, nerveMax: 70, time: 8, once: 'bag_nice', do: (G) => { G.nerves(2); G.note('Mies tiskin takana sanoo, että laukut ovat järjestelmässä. Kysyt, missä järjestelmässä. Hän sanoo: järjestelmässä. Kysyt, milloin. Hän sanoo: kun asia on selvitetty. Hän ei ole nostanut katsettaan kertaakaan.'); }, next: 'hall' },
      { label: 'Vaadi laukkuasi. Siinä on hammastahnasi.', kind: 'conflict', nd: 8, sub: 'Jonkun se on tehtävä.', time: 10, once: 'bag', do: (G) => { G.strike(); G.note('Hän nostaa katseensa. Mikään muu ei muutu. ' + V('"Minä teen muistiinpanon."') + ' Hän kirjaa sen ylös.'); }, next: 'hall' },
      { label: 'Kierrä suljetut liikkeet.', dd: 3, time: 12, once: 'shops', do: (G) => { G.nerves(-1); G.dread(2); G.note('Tax-free: rullaovet alhaalla. Kahvila: tuolit pöydillä, kahvikone irrotettuna seinästä ja käännettynä seinään päin. Automaatti, joka kelpuuttaa vain islantilaiset kortit, täynnä tuotteita, joiden nimissä on ð-kirjain. Seisot sen edessä pidempään kuin oli tarkoitus.'); }, next: 'hall' },
      { label: 'Kokeile STAFF-ovea.', whyNot: 'Siinä lukee ONLY.', dreadMax: 80, time: 6, once: 'staff', do: (G) => { G.dread(8); G.nerves(5); G.note('Lukossa. Kahva on lämmin, kuin joku olisi hetki sitten pidellyt sitä. Painat korvasi ovea vasten. Sen takana ei ole mitään. Ei hiljaisuutta – ei mitään. Kun peräännyt, kyltissä lukee STAFF, ja sen alla, pienemmällä, mitä et ollut aiemmin huomannut: ONLY.'); }, next: 'hall' },
      { label: 'Katso matkatavarahihnaa.', dd: 3, time: 8, once: 'carousel', do: (G) => { G.dread(4); G.note('Hihna pyörii. Yksi laukku kiertää. Se ei ole sinun. Siinä on tummansininen lappu ja lapussa kultainen vaakuna. Laukku kiertää toisen kierroksen, sitten hihna pysähtyy, laukku on poissa, ja hihna on tyhjä tavalla, joka antaa ymmärtää, ettei siinä ole koskaan ollutkaan mitään.'); }, next: 'hall' },
      { label: 'Juttele fleecemiehen kanssa.', whyNot: 'Tiuskaisit hänelle.', nd: -3, dd: -3, nerveMax: 90, time: 8, once: 'talk_fleece', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_hearsay'); G.note(V('"Hei. Tänne tulee kai busseja? Tuonne? Kuulemma?"') + ' Hän osoittaa epämääräisesti kohti ovea, jossa ei lue mitään. ' + V('"Joku huomioliivissä sanoi. Ei niiden porukkaa."') + ' Hän vilkaisee sähköpostia puhelimestasi. ' + V('"Joo, mä sain saman. En mä mihinkään Heathrow\'hun lähde."')); }, next: 'hall' },
      { label: 'Juttele taaperoa kantavalle naiselle.', whyNot: 'Pelästyttäisit lapsen.', nd: -2, dd: -3, nerveMax: 80, time: 8, once: 'talk_mother', do: (G) => { G.collect(1); G.nerves(-2); G.flag('hint_hearsay'); G.msg('sms', { from: '+354 ··· ····', body: 'älä mee siihen kivaan' }); G.note('Taapero nukkuu hänen olkaansa vasten tavalla, josta päätellen olkapää on kantava rakenne. ' + V('"Joku huomioliivissä sanoi mulle: ei siihen kivaan. En tiedä mitä se tarkoittaa. Mä meen sen mukaan."') + ' Samalla kun hän sanoo sen, puhelimesi värähtää: tekstiviesti tuntemattomasta numerosta.'); }, next: 'hall' },
      { label: 'Etsi mies paikalta 31C.', whyNot: 'Sanoisit jotain, mitä et voi perua.', nd: -3, dd: -3, nerveMax: 95, time: 8, once: 'talk_31c', if: (G) => G.has('ally31c'), do: (G) => { G.collect(1); G.nerves(-3); G.note('Hän seisoo ovien luona ja katselee ulos pimeään. ' + V('"Eli busseja on",') + ' hän sanoo. ' + V('"Hienoa. Kenen?"') + ' Kumpikaan teistä ei tiedä. Päätätte sanomatta sitä ääneen nousta samaan bussiin.'); }, next: 'hall' },
      { label: 'Juttele ikkunan luona seisovalle vanhemmalle pariskunnalle.', whyNot: 'Aloittaisit riidan.', nd: -2, dd: -2, nerveMax: 75, time: 8, once: 'talk_couple', do: (G) => { G.collect(1); G.nerves(-2); G.note('He ovat lentäneet paljon eivätkä ole huolissaan, he sanovat huolestuneiden ihmisten äänellä. ' + V('"Kyllä se lopulta joku tuloste on",') + ' hän sanoo. ' + V('"Aina se lopulta on joku tuloste."')); }, next: 'hall' },
      { label: 'Mene vessaan. Olet pidätellyt Grönlannista asti.', nd: -3, time: 12, once: 'loo', do: (G) => { G.flag('bathroom'); G.nerves(-2); G.note('Jonkinlaista helpotusta. Kun tulet ulos, aula on järjestynyt uusiksi: samat ihmiset eri paikoissa, kaikki kasvot samaa ovea kohti.'); }, next: 'hall' },
      { label: G.did('talk_fleece') ? 'Mene sinne, minne fleecemies osoitti.' : G.has('hint_icelander') ? 'Lähde etsimään niitä busseja, joista hän puhui.' : G.did('talk_mother') ? 'Seuraa taaperoa kantavaa naista. Hän näyttää tietävän, minne on menossa.' : 'Mene virran mukana, ovesta, jossa ei lue mitään.', dd: -2, time: 5, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~02:00 bus stand 1 */
  scenes.buses1 = {
    art: 'stand',
    loc: 'Keflavík · Bussilaituri · ulkona',
    text: (G) => p(
      'Ulkona on kaksi astetta lämmintä, ja tuuli on tullut pitkän matkan sinua vastaan. Kolme bussia käy tyhjäkäyntiä natriumlamppujen alla. Kanssamatkustajasi kulkevat niitä kohti sillä hajanaisella, epävarmalla tavalla, jolla kulkevat ihmiset, joille ei ole kerrottu mitään.',
      (G.has('bathroom') || G.t >= T(1, 2, 20)) ? 'Olet myöhässä. Suurin osa joukosta on jo noussut johonkin kyytiin. Ovet alkavat sulkeutua.' : 'Kukaan ei tarkasta lippuja. Kukaan ei tarkasta mitään.',
      G.did('talk_mother') && W('"Ei siihen kivaan."'),
      W('Katso ennen kuin nouset kyytiin. Katsominen maksaa muutaman minuutin. Kyytiin nouseminen maksaa enemmän.'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: G.pick(['#c7c3b6', '#b8b4a6', '#8d8a80']), windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'night' },
        name: G.pick(['Valkoinen bussi ilman minkäänlaisia tunnuksia', 'Luonnonvalkoinen bussi, jonka sivupeili on haljennut', 'Harmaa bussi, jonka ovesta irtoaa vuokraamon tarra']),
        sign: G.pick(['ALBION ATL → HOTEL', 'AB0271  HOTEL', 'FLIGHT PPL – HOTEL']), signStyle: 'paper',
        look: ['Huomioliivinen kuljettaja syö voileipää. Hän kohauttaa olkiaan, kun katsot häntä.', (G.has('bathroom') || G.t >= T(1, 2, 20)) ? 'Moottori käynnissä. Ovi alkaa sulkeutua.' : 'Moottori käynnissä. Ovi auki.'],
        hidden: [(G.did('talk_fleece') ? 'Fleecemies istuu kolmannella rivillä.' : 'Kolmannella rivillä istuu fleecetakkinen mies, jonka tunnistat hallista.') + ' Taapero nukkuu jonkun sylissä.', 'Kaikilla kyydissä on yllään samat vaatteet kuin koneessa, ja se näkyy.'],
        boardLabel: (G.has('bathroom') || G.t >= T(1, 2, 20)) ? 'Juokse' : 'Nouse kyytiin',
        board: { time: 5, do: (G) => { if (G.has('bathroom') || G.t >= T(1, 2, 20)) G.nerves(6); G.flag('bus1_ok'); }, next: 'ride' },
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
        board: { time: 5, next: 'bsi' },
      };
      return G.shuffle([correct, crest, flybus]);
    },
    choices: [
      { label: 'Älä nouse mihinkään. Sähköpostissa puhuttiin busseista. Odota ohjeita.', kind: 'comply', dd: 10, sub: 'Busseista puhuttiin. Nämä eivät välttämättä ole ne bussit.', time: 35, next: 'wait2' },
    ],
  };

  /* ---------------------------------------------------------------- the wrong bus: BSÍ, 02:50 */
  scenes.bsi = {
    art: 'bsi',
    loc: 'Reykjavík · BSÍ-linja-autoasema',
    enter: (G) => {
      G.S.t = Math.max(G.t, T(1, 2, 50)); G.flag('detoured'); G.nerves(10); G.dread(6);
      if (G.once('bsi_dead')) { G.S.bsiBatt = Math.max(1, G.S.batt); G.S.batt = 0; G.S.phoneDead = true; G.S.deadAt = G.t; G.flag('phone_scene'); }
    },
    text: (G) => p(
      'Neljänkymmenen minuutin ajon jälkeen reppureissaaja kysyy, missä hostellissa olet majoittunut, ja sinä ymmärrät.',
      'Bussi jättää sinut kaupungin linja-autoasemalle, joka haisee dieselille ja kanelille. Asema on sulkeutumassa. Kioski vetää rullaoveaan alas; reppureissaajat kävelevät jo pois, kohti sänkyjä, jotka ovat heidän omiaan.',
      `Kaivat puhelimen esiin katsoaksesi, missä olet. Se näyttää ${G.S.bsiBatt || 1}%, sitten kartan, sitten mustan ruudun, jossa ovat sinun kasvosi. Painat nappia. Painat uudestaan. Ei mitään. Kellonaika on mennyt sen mukana; asemalla on kello, ja kello on pysähtynyt.`,
      'Ja perimmäisellä laiturilla, moottori käynnissä, sisävalot palamassa, jokainen istuin asemaan päin: tummansininen bussi, jonka kyljessä on kultainen vaakuna.',
    ),
    buses: (G) => [{
      key: 'crest',
      art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'night' },
      name: 'Tummansininen bussi, jonka kyljessä on kultainen vaakuna, tyhjäkäynnillä perimmäisellä laiturilla',
      sign: 'ALBION ATLANTIC · YOUR ACCOMMODATION', signStyle: 'led',
      look: ['Purseri ovella, kädet ristissä, kuin hänelle olisi kerrottu, että olet tulossa.', 'Lämmin. Hiljainen. Paljon vapaita paikkoja.'],
      hidden: ['Matkustajat ovat levänneitä. Kenelläkään ei ole puhelinta kädessä. Kukaan ei sellaista tarvitse.', 'LED-kyltin määränpää ei ole paikka. Se on sana.'],
      board: { kind: 'comply', do: (G) => G.end('crew') },
    }],
    choices: [
      { label: 'Etsi taksi. Ovien luona on tolppa.', whyNot: 'Et pysty kääntämään bussille selkääsi.', dreadMax: 88, dd: -3, time: 10, next: 'taxi' },
      { label: 'Istu asemalla. Joku tulee kyllä.', kind: 'comply', dd: 6, time: 20, once: 'bsi_sit', do: (G) => { G.nerves(4); G.note('Kaksikymmentä minuuttia muovipenkillä. Siivoojat työskentelivät ympärilläsi. Bussi ei lähtenyt. Jossain vaiheessa huomioliivinen mies tuli seisomaan oviaukkoon ja sanoi, englanniksi, ei epäystävällisesti: ' + V(LX('“We are closing. Taxi is outside.”'))); }, next: 'bsi' },
    ],
  };

  /* ---- the taxi, and the only person all night who takes you where you ask ---- */
  scenes.taxi = {
    art: 'road',
    loc: 'Taksi · Reykjavík, kaupungista ulos',
    enter: (G) => { if (G.once('taxi_in')) G.note(p(G.last(), 'Taksi, lämmin, tuoksuu männyltä ja jonkun päivälliseltä. Kuljettaja on kuusissakymmenissä, radio soi hiljaa islanniksi, ehkä säätiedotusta, ja hän katsoo sinua peilistä tovin ennen kuin sanoo mitään. ' + V(LX('“Albion Atlantic?”')) + ' Et ole sanonut sanaakaan. ' + V(LX('“The clothes. Everybody off that flight looks like they slept in a chair. Where to?”')))); },
    text: (G) => p(G.last(), 'Mittari juoksee. Ulkona kaupunkia riittää kolmen kadun verran, ja sitten on pimeää.'),
    choices: (G) => [
      { label: 'Näytä hänelle sähköposti. Se, jossa on se hotelli.', time: 3, once: 'taxi_mail', do: (G) => { G.nerves(G.readMsg('accommodation') ? -2 : 2); G.note(G.readMsg('accommodation')
        ? 'Kaivat puhelimen esiin. Mustaa lasia, siinä omat kasvosi. Olit unohtanut. Mutta luit sen passintarkastuksessa, ja näet sen yhä puolittain edessäsi: Renaissance jotain. Bath Road. Hounslow. Sanot sen. ' + V(LX('“Heathrow.”')) + ' Hän nauraa, lyhyen naurun, joka ei kohdistu sinuun. ' + V(LX('“Every night somebody has that one. Every night it says Heathrow. The ones with that email, the white bus takes out past the lava, to Hraun. If that is where your people are, I can take you. It is not close, and it is not cheap.”'))
        : 'Kaivat puhelimen esiin. Mustaa lasia, siinä omat kasvosi. Olit unohtanut. Kerrot hänelle, että tuli sähköposti, jossa oli hotelli, etkä koskaan avannut sitä, etkä muista siitä sanaakaan. Hän nyökkää kuin se olisi ihan tavallinen määrä.'); if (G.readMsg('accommodation')) { G.flag('mail_clue'); G.flag('driver_where'); } }, next: 'taxi' },
      { label: 'Kysy häneltä, mitä hän tietää lennosta.', nd: -2, time: 5, once: 'taxi_week', do: (G) => { G.flag('driver_week'); G.collect(1); G.note(V(LX('“Your flight? I know your flight. Everybody who drives nights knows your flight.”')) + ' Hän laskee vapaan kätensä sormilla. ' + V(LX('“Monday it came in at one. Tuesday, one. Wednesday, Thursday, tonight. Same number, same hour, two hundred people with no coats. Every night the airline tells them a driver is waiting for them outside Arrivals. I am outside Arrivals every night, at the rank, and nobody has ever asked me to wait for anybody. Nobody from that company has rung me, or paid me, or any driver I know.”')) + ' Tauko, ja pyyhkijät. ' + V(LX('“The people, I take where they ask. The trouble is most of them don\'t know where to ask.”'))); }, next: 'taxi' },
      { label: 'Kysy häneltä, minne muut menivät.', if: (G) => G.has('driver_week'), nd: -1, time: 4, once: 'taxi_where', do: (G) => { G.flag('driver_where'); G.note(V(LX('“Out past the lava, somewhere. A white bus takes them, when there is a white bus. Which hotel — I don\'t know. There are five out there and they all look like a conference that never came.”')) + ' Hän vilkaisee sinua peilistä. ' + V(LX('“If you can tell me which one, I will take you. If you can\'t, I will take you where I take everyone who can\'t: a guesthouse in town. The woman who runs it is always awake. Small place, clean, the price is honest, and she has had one of you every night this week.”'))); }, next: 'taxi' },
      { label: 'Pyydä häntä viemään sinut sittenkin takaisin lentoasemalle.', time: 3, once: 'taxi_back', do: (G) => { G.nerves(2); G.dread(2); G.note(V(LX('“Keflavík is closed until five. I can drive you forty minutes to a locked door, if you want to pay for it.”')) + ' Hän ei kuulosta siltä, että vitsailisi. Hän ei kuulosta siltäkään, että kieltäytyisi.'); }, next: 'taxi' },
      { label: G.has('mail_clue') ? 'Hraun siis. Sinne, minne muut sen sähköpostin saaneet menivät.' : 'Kerro hänelle valkoisesta bussista. Paperikyltistä, huomioliivisestä kuljettajasta, siitä, johon et noussut.', whyNot: 'Et pystyisi puhumaan siitä sivistyneesti, ja hän on ainoa, joka on kysynyt.', nerveMax: 70, if: (G) => G.has('mail_clue') || (G.has('driver_where') && (G.S.looked['buses1:plain'] || G.did('talk_fleece') || G.did('talk_mother') || G.did('talk_couple') || G.has('ally31c'))), sub: '9 800 kruunua, hän sanoo, sinne asti. Se on pakko laittaa kortille.', time: 40, do: (G) => { G.flag('taxi_hraun'); G.S.t = T(1, 3, 35); G.nerves(6); G.dread(2); G.note(V(LX('“The white ones. Yes. That is Hraun. Forty minutes. Nine thousand eight hundred, and I would like it on the card before we leave the lights, if you don\'t mind. I have been burned this week.”')) + ' Kortti toimii. Kaupunki loppuu. Laavaa matalan taivaan alla, ja tie, jonka yksi valkoinen viiva katoaa aina uudelleen. Hän ei puhu, radio puhuu. Kello 03:35 hän kääntyy matalan, leveän, akvaarion lailla valaistun hotellin pihaan ja sanoo ' + V(LX('“Good luck,”')) + ' sellaisen miehen äänellä, joka tarkoittaa sitä eikä odota siitä olevan apua.'); }, next: 'hotel_arrive' },
      { label: 'Majatalo siis. Minne tahansa, missä on sänky ja valo palaa.', kind: 'comply', dd: 4, time: 8, do: (G) => { G.flag('gunnar'); G.note(V(LX('“Lind. Good. Three minutes.”')) + ' Neljä kulmaa, kapea ovi ja sen yllä lyhty, ja mittari, joka näyttää vähemmän kuin pelkäsit. Hän vilkuttaa ajovaloja ovelle, kahdesti, ja himmeän lasin taakse syttyy valo. ' + V(LX('“Tell her Gunnar sent you. She will know what that means by now.”'))); }, next: 'lind_arrive' },
    ],
  };

  /* ---------------------------------------------------------------- the ride */
  scenes.ride = {
    art: 'road',
    loc: 'Maantie · jossain Reykjanesin niemimaalla',
    enter: (G) => {
      G.dread(4);
      if (G.once('coach_mail')) G.at(G.t + 30, 'email', { from: 'Albion Atlantic Customer Care', subj: 'Eteenpäin kuljetus järjestetty', body: 'Rakas Asiakas,\n\nMe olemme organisoineet bussit transfer sinut sinun accommodation. Ole hyvä jatka busseihin.\n\nJos sinä tarvitset apua paikantamaan bussit, ole hyvä kontaktoi meitä.\n\nMe teemme meidän parasta.' });
      if (G.once('coach_txt')) G.at(G.t + 45, 'sms', { from: 'AlbionATL', body: 'AB0271: Sinun hotelli on HEATHROW RENAISSANCE LODGE. Älä vastaa.' });
    },
    text: (G) => p(
      'Bussi ajaa viimeistenkin valojen ohi, ja sitten se vain jatkaa matkaa.',
      'Laavakenttiä matalan taivaan alla. Ei taajamia. Ei kylttejä, joita osaisit lukea. Et tiedä, kuka sinut on vienyt tai minne olet matkalla. Sinut on joko otettu hellästi EU:n sääntelykehyksen syleilyyn, tai sitten sinut on siepattu, ja samalla bussillinen uupuneita ihmisiä, jotka ovat liian kohteliaita kysyäkseen.',
      G.has('coffee') && W('Sydämesi tekee jotain outoa. Se johtuu kahvista. Se johtuu aivan varmasti kahvista.'),
      'Matka on pitkä. Se alkaa olla huolestuttavan pitkä.',
      'Takapenkiltä kaksivuotias huokaa: ' + V('"Mikä päivä."'),
    ),
    choices: [
      { label: 'Naura. Kaikki nauravat. Kohteliaasti ja hieman paniikissa.', whyNot: 'Se tulisi ulos väärin.', nd: -6, dd: -4, nerveMax: 85, time: 50, do: (G) => { G.nerves(-5); G.collect(1); }, next: 'hotel_arrive' },
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
      if (G.once('hotel_bot')) { G.at(T(1, 3, 50), 'chat', { body: 'Oletko sinä mukava sinun huoneessa? 🙂' }); G.at(T(1, 4, 15), 'chat', { body: 'Sinun bussi lähtee 04:30. Staff jäsen tulee koputtamaan.', key: 'knock_notice' }); }
    },
    text: (G) => p(
      G.has('asked_driver') && W('Kuljettaja ei vastannut kertaakaan. Radiosta tuli jotain islanninkielistä, joka saattoi olla säätiedotus.'),
      'Hotelli siis. Matala, leveä, sellainen paikka, joka on rakennettu konferensseja varten, joita ei koskaan tullut. Yöportieeri jakaa avainkortteja kenkälaatikosta. Sinun kortissasi lukee 214.' + (G.did('talk_fleece') ? ' Fleecemies saa huoneen 216 ja nostaa avaimen sinulle näkyviin kuin arpalipun.' : ''),
      'Ei, hammastahnaa ei ole. Ei, hammasharjojakaan ei ole. Tänne ei tule mitään kuljetuksia ennen aamuyhtätoista. Automaatti on. Virkailija sanoo tämän kuin ojentaisi sinulle pelastuslautan.',
      'Tiskiin on teipattu A4-arkki, kirjoitettu Arialilla, hieman vesitahrainen. Siinä lukee, että bussi lentokentälle lähtee 11:00. Se on ensimmäinen tieto koko yönä, jossa on mukana kellonaika eikä logoa.',
    ),
    choices: [{ label: 'Mene ylös huoneeseen.', time: 8, next: 'room' }],
  };

  /* ---- the room (hub) ---- */
  const roomStatus = (G) => `Huone 214. ${G.clock(G.t)}. Olet liian väsynyt nukkumaan${G.has('toothpaste') ? '' : ', ja hampaasi ovat likaiset'}${G.has('dinner') ? '' : ', etkä ole syönyt'}${G.dead() ? ', ja puhelin on kuollut' : G.battery() <= 10 ? `, ja puhelimen akussa on ${G.battery()}%` : ''}.`;

  scenes.room = {
    art: 'room',
    loc: 'Hótel Hraun · Room 214',
    enter: (G) => {
      G.flag('loc_room');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.dead() && !G.has('phone_scene')) { G.go('phone_dies'); return; }
      if (G.once('room_intro')) G.note(p(G.last(), 'Sänky, vedenkeitin, televisio, ikkuna parkkipaikalle ja pikkuruiset shampoo- ja hoitoainepullot, joilla jo harkitset peseväsi hampaasi. Ovessa on turvaketju. Laitat ketjun päälle. Sitten otat sen pois, varmuuden vuoksi, ja laitat takaisin.'));
    },
    text: (G) => hub(G, roomStatus(G), 'room'),
    choices: (G) => [
      { label: 'Syö. Sipsejä ja kaksi pikkupulloa viiniä.', whyNot: 'Vatsasi sanoo ei.', nerveMax: 90, sub: 'Tyttöjen illallinen.', if: (G) => G.has('crisps') && !G.has('dinner'), time: 12, do: (G) => { G.flag('dinner'); G.nerves(-10); G.note('Suolaa, sitten viiniä, sitten suolaa. Syöt sängyn reunalla istuen, pussi molemmissa käsissä kuin jokin, joka saattaisi karata. Se on paras ateriasi sitten Lontoon, mikä ei ole paljon sanottu, mutta on silti jotain.'); }, next: 'room' },
      { label: 'Tuijota pikkuisia shampoopulloja ja harkitse hampaidesi pesemistä niillä.', time: 4, do: (G) => { const n = G.count('shampoo'); G.nerves(n === 1 ? -1 : 1); G.note(n === 1 ? 'Shampoo. Hoitoaine. Vartalovoide. Luet ainesosaluettelon. Natriumlauryylieetterisulfaatti on teknisesti ottaen pinta-aktiivinen aine. Lasket pullon pois. Otat sen uudestaan. Lasket sen pois.' : n === 2 ? 'Olet ollut tässä tilanteessa ennenkin. Shampoo ei ole muuttanut mieltään, etkä sinäkään.' : 'Pikkupullot seisovat rivissä hyllyllä ja katselevat sinua. Yksi niistä on siirtynyt. Sinä siirsit sen. Luultavasti sinä siirsit sen.'); }, next: 'room' },
      { label: 'Käy suihkussa. Pue samat vaatteet takaisin päälle.', whyNot: 'Et pysyisi paikallasi sen alla.', nerveMax: 95, time: 20, once: 'shower', do: (G) => { G.nerves(-6); G.dread(-3); G.note('Kuumaa vettä sentään. Islannin kuuma vesi on erinomaista; se haisee hiukan kananmunalle eikä lopu koskaan. Seisot sen alla, kunnes tunnet itsesi taas ihmiseksi, ja sitten puet lentokoneen takaisin päällesi: housut, paidan, sukat, kaikki hieman lämpimämpiä kuin sinä itse.'); }, next: 'room' },
      { label: 'Avaa televisio.', kind: 'comply', dd: 2, time: 6, do: (G) => { const d = G.D, n = G.count('tv'); G.dread(1); G.note(d >= 5 ? 'Kanava 1: parkkipaikka. Sinun parkkipaikkasi, ylhäältä kuvattuna, harmaana. Siellä on bussi. Bussin vieressä hahmo. Sammutat television. Ruudussa näkyy huone, ylhäältä kuvattuna, harmaana.' : d >= 4 ? 'Säätiedotus, islanniksi, loputtomiin. Sitten kanava, jolla näkyy pelkkä valvontakamerakuva parkkipaikasta. Olet melko varma, ettei se ole tämä parkkipaikka. Siellä on bussi.' : n === 1 ? 'Säätiedotus, islanniksi. Kartta saaresta täynnä pieniä vihaisia nuolia. Sitten valokuva hotellista puhelinnumeroineen. Sitten säätiedotus.' : 'Olet nähnyt tämän säätiedotuksen. Se ei ole muuttunut. Nuolet ovat yhä vihaisia. Hotelli on yhä ruudussa puhelinnumeroineen, ikään kuin saattaisit haluta soittaa sinne sen sisältä.'); }, next: 'room' },
      { label: 'Katsoa ikkunasta parkkipaikalle.', whyNot: 'Tiedät, mitä siellä on.', dd: 2, dreadMax: 85, time: 3, do: (G) => { const d = G.D, n = G.count('win'); G.dread(2); if (d >= 4) G.flag('looked1'); G.nerves(d >= 4 ? 7 : 2); G.note(d >= 5 ? 'Bussi on nyt suoraan ikkunasi alla. Sisävalot palavat. Kaikki sisällä istuvat kasvot hotelliin päin, selkä suorana, liikkumatta. Ja oven vieressä, kädet ristissä, tummansiniseen pukeutunut mies, joka katsoo ylös. Ei hotellia. Sinun ikkunaasi. Päästät irti verhosta. Et muista vetäneesi sitä syrjään.' : d >= 4 ? 'Parkkipaikan perällä seisoo bussi moottori käynnissä ja kaikki sisävalot päällä. Se on täynnä. Kukaan sisällä ei liiku. Oven luona ei näy ketään, ja sitten näkyy.' : n === 1 ? 'Parkkipaikka. Yksi ainoa lyhty. Soraa, tuulta, ja lyhdyn takana pimeyttä hyvin pitkälle. Ei bussia. Tunnet helpotusta, ja sitten mietit, miksi odotit bussia.' : 'Parkkipaikka. Lyhty. Ajovalot tiellä; ne hidastavat, mutta eivät käänny pihaan. Kaiken päällä omat kasvosi, kalpeat, eilisessä paidassa.'); }, next: 'room' },
      { label: 'Keitä teetä pikkupusseista.', whyNot: 'Kätesi läikyttäisivät sen.', nerveMax: 90, time: 8, once: 'tea', do: (G) => { G.nerves(-5); G.dread(-2); G.note('Vedenkeitin on hidas ja pitää ääntä kuin pieni lentokone. Teetä, ja UHT-maitoa sormustimen kokoisesta kupista. Pitelet kuppia molemmin käsin. Se on ensimmäinen lämmin asia, joka ei ole ollut valetta.'); }, next: 'room' },
      { label: 'Tarkista ovi.', nd: 2, time: 2, do: (G) => { const n = G.count('door'); G.note(n === 1 ? 'Lukossa. Ketju päällä. Tarkistat ketjun. Tarkistat lukon. Kaikki hyvin.' : n === 2 ? 'Yhä lukossa. Ketju yhä päällä. Tiesit sen kyllä.' : n === 3 ? 'Tarkistat oven uudestaan. Tiedostat tarkistavasi oven uudestaan. Se on lukossa. Se on koko ajan ollut lukossa. Seisot hetken käsi ovella.' : 'Lukossa. Et enää tiedä, mitä oikeastaan tarkistat. Sitäkö, onko se lukossa, vai sitä, onko se yhä ovi.'); if (n >= 3) G.dread(1); }, next: 'room' },
      { label: 'Kuuntele ovella.', whyNot: 'Et halua tietää.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(3); G.note(G.pick(d >= 4 ? ['Askelia. Hitaita, tasaisia; ne pysähtyvät joka ovelle. Pysähtyvät sinun ovellesi. Jatkavat matkaa.', 'Pyörillä kulkeva kärry käytävän päässä. Se pysähtyy. Se ei lähde enää liikkeelle.', 'Koputusta kaukaa käytävän päästä. Kärsivällistä. Sitten lähempää.'] : ['Ei mitään. Käytävän hurinaa. Jossain kaukana sulkeutuu ovi.', 'Joku kävelee ohi, nopeasti, sukkasillaan. Joku toinen, hitaasti, kengät jalassa.', 'Jääpalakone jauhaa käytävän päässä. Sitten naurua viereisestä huoneesta, äkkiä katkeavaa.'])); }, next: 'room' },
      { label: 'Soita vastaanottoon huoneen puhelimesta.', kind: 'comply', dd: 1, time: 5, once: 'roomphone', do: (G) => { G.dread(2); G.note('Puhelin soi pitkään. Sitten virkailija, joka kuulostaa siltä kuin olisi juuri nukkunut tai kuin ei olisi koskaan nukkunut: ' + V(LX('“Yes, 214?”')) + ' Et ollut sanonut huoneesi numeroa. Kysyt bussista. ' + V(LX('“Eleven. It says eleven. Maybe you should sleep.”'))); }, next: 'room' },
      { label: 'Ota selvää oikeuksistasi.', whyNot: 'Oikeudet tuntuvat vieraalta maalta.', dd: -6, dreadMax: 85, if: (G) => !G.dead(), sub: G.did('post') ? 'Asetus on olemassa. Joku maininnoissasi on siitä varma.' : 'Asetus on olemassa. Olet melkein varma, että asetus on olemassa.', time: 15, once: 'rights', do: (G) => { G.flag('uk261'); G.nerves(-6); G.batt(-2); G.msg('paper', { from: 'Kuvakaappaus, ja sitten itse tekemäsi QR-koodi', subj: 'UK261', body: '<b>UK261 / EY261 — OIKEUTESI</b>\n\nNäin pitkän viivästyksen sattuessa lentoyhtiön on järjestettävä: ateriat, hotelli, kuljetukset ja yhteydenpitomahdollisuus.\n\nYhtiö panee vastaan. Vaadi silti.\n\n[ QR-KOODI ]' }); G.note('UK261. <em>Lentoyhtiön on järjestettävä.</em> Luet sen kahdesti. Teet siitä QR-koodin, hotellin wifissä, kolmelta aamuyöllä, etkä tiedä miksi, paitsi että aiot näyttää sen aamiaisella jokaiselle, jonka näet.'); }, next: 'room' },
      { label: 'Kirjoita siitä päivitys.', time: 8, once: 'post', if: (G) => !G.dead(), do: (G) => { G.batt(-3); if (G.D >= 4) { G.nerves(4); G.note('Kirjoitat kaiken auki – miehistön, oven, sähköpostin, bussin – ja painat julkaise-nappia, ja pieni rengas pyörii ja pyörii. Yksi palkki. Ei yhtään palkkia. Päivitys jää siihen lähettämättä, ei kenellekään osoitettuna.'); } else { G.nerves(-3); G.note('Julkaiset sen. Lol, kirjoitat. Lmao. Kymmenessä minuutissa: 1,4 tuhatta tykkäystä ja neljäkymmentä ihmistä kertomassa sinulle kuumista lähteistä. Lasket puhelimen peitolle näyttö alaspäin.'); } }, next: 'room' },
      { label: 'Lataa puhelin.', nd: 2, time: 2, once: 'charge', if: (G) => !G.dead(), do: (G) => { G.nerves(3); G.note(`Laturi on laukussa. Laukku on järjestelmässä. Puhelimen akussa on ${G.battery()} %, ja se tietää sen, ja himmentää näytön kertoakseen sen sinulle.`); }, next: 'room' },
      { label: 'Yritä nukkua.', whyNot: 'Et pysty makaamaan paikallasi.', nerveMax: 80, time: 25, do: (G) => { if (G.t + 25 >= T(1, 4, 5)) { G.S.t = Math.max(G.t, KNOCK_AT - 25); G.nerves(-2); G.dread(-1); G.note('Käyt makuulle lentokonevaatteissasi, valo päällä. Katto on hyvin lähellä. Olet melkein, melkein—'); } else { G.nerves(-4); G.dread(-3); G.note(G.pick(['Käyt makuulle. Kehosi elää Tyynenmeren aikaa, tai ei mitään aikaa. Katossa on saaren muotoinen tahra. Katselet sitä jonkin aikaa. Ei mitään.', 'Silmät kiinni. Bussin – jonkin bussin – moottori jossain ikkunan alla, tai korvissasi. Nouset taas istumaan.', 'Ryömit peiton alle vaatteet päällä. Olo on kuin paketilla. Uni katselee sinua huoneen toiselta puolelta eikä tule lähemmäs.'])); } }, next: 'room' },
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
      if (G.dead() && !G.has('phone_scene')) { G.go('phone_dies'); return; }
      if (G.once('corr_intro')) G.note(p(G.last(), 'Pitkä, matala, lattialla mustelmanväristä kokolattiamattoa. Ovia: 210, 212, 214 – sinun – 216, 218, ja niin edelleen aina palo-ovelle asti, jossa on poikkitanko ja lankalasinen ikkuna. Käytävän päässä hurisee jääpalakone. Hissi, jonka ovessa on paperilappu.'));
    },
    text: (G) => hub(G, `Käytävä. ${G.clock(G.t)}. Kaikki ovet ovat kiinni. Sinun ovesi on se, jonka alta näkyy valoa.`, 'corridor'),
    choices: (G) => [
      { label: 'Jääpalakone.', nd: 2, dd: 1, time: 5, do: (G) => { const n = G.count('ice'); G.note(n === 1 ? 'Se jyrisee. Jäätä, valtava määrä jäätä, sankoon, jota et tuonut mukanasi. Seisot siinä kourallinen jäätä kädessäsi. Et halunnut jäätä. Et tiedä, mitä halusit.' : n === 2 ? 'Se jyrisee taas, sinua varten, kuin olisi odottanut. Äskeinen jää ei ole sulanut. Et ole varma, kuuluuko jään käyttäytyä noin lämmitetyllä käytävällä.' : 'Tällä kertaa et työnnä kättäsi sisään. Kuuntelet, kun se jauhaa. Jauhamisen alta, jostain alempaa, moottori.'); if (n >= 2) G.dread(1); }, next: 'corridor' },
      { label: G.did('talk_fleece') ? 'Koputa huoneen 216 oveen. Fleecemiehen huone.' : 'Koputa huoneen 216 oveen. Viereinen huone.', time: 5, do: (G) => { const n = G.count('k216'); if (n === 1) { G.collect(1); G.nerves(-4); G.flag('met_fleece'); G.note((G.did('talk_fleece') ? 'Tauko, sitten ketju, sitten fleece.' : 'Tauko, sitten ketju, sitten fleecetakkinen mies, jonka tunnistat hämärästi aulasta.') + ' Hänkin on hereillä. Hänelläkin on vaatteet päällä. ' + V('"Hemmetti",') + ' hän sanoo, ja siihen sisältyy kaikki. Olette bussista samaa mieltä. Yksitoista. Tuloste. Hän lupaa tulla koputtamaan.'); } else if (n === 2) { G.nerves(3); G.dread(3); G.note('Ei vastausta. Oven alta näkyy valoa. Koputat uudelleen, tasaisesti, ja kuulet oman koputuksesi, ja lakkaat.'); } else { G.nerves(8); G.dread(5); G.note('Ovi ei ole lukossa. Se aukeaa heilahtaen. Huone on siistitty: sänky pedattu kireäksi, pyyhkeet taiteltu viuhkaksi, pikkushampoot rivissä. Kukaan ei ole ollut huoneessa. Kukaan ei ole koskaan ollut huoneessa. Hänen fleecensä on tuolilla.'); } }, next: 'corridor' },
      { label: 'Hissi.', kind: 'comply', dd: 2, time: 4, do: (G) => { const d = G.D; if (d >= 4) { G.flag('lift_open'); G.dread(3); G.nerves(5); G.note('Paperilapussa lukee EPÄKUNNOSSA, Arialilla. Juuri kun luet sitä, hissi saapuu. Ovet avautuvat tyhjään, kirkkaasti valaistuun koppiin, jonka peräseinällä on peili, ja jäävät auki, ja odottavat. Kukaan ei kutsunut sitä.'); } else { G.note('EPÄKUNNOSSA, Arialilla, teipattu vinoon. Painat nappia silti. Jossain rakennuksessa jokin lähtee alaspäin.'); } }, next: 'corridor' },
      { label: 'Mene hissiin.', kind: 'comply', if: (G) => G.has('lift_open'), do: (G) => G.end('lift') },
      { label: 'Lue seinällä oleva poistumissuunnitelma.', dd: -2, time: 3, once: 'fireplan', do: (G) => { G.msg('paper', { from: 'Ruuvattu käytävän seinään', subj: 'Poistumissuunnitelma', body: '<b>EVACUATION PLAN · 2ND FLOOR</b>\n\nIn case of alarm, proceed by stairs to\n<b>ASSEMBLY POINT: CAR PARK</b>\n\nDo not use the lift.\nDo not return for belongings.\n\nYOU ARE HERE ●' }); G.note('OLET TÄSSÄ. Punainen piste, huoneen 214 kohdalla. Joku on piirtänyt siitä kuulakärkikynällä pienen nuolen kohti parkkipaikkaa ja kirjoittanut, eri käsialalla, <em>bussi</em>.'); }, next: 'corridor' },
      { label: 'Palo-ovi ja portaat. Alas parkkipaikalle.', whyNot: 'Ei portaita. Ei pimeässä.', dreadMax: 92, time: 4, next: 'carpark' },
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
      { label: 'Kysy virkailijalta, puhuuko hän ranskaa.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 4, do: (G) => { G.flag('fr_asked'); G.nerves(-2); G.note(LX('“A little. Eleven. The sign. Please.”') + ' Hän sanoi sen hitaasti ja osoitti silti kylttiä, siltä varalta etteivät sanat kantaisi.'); }, next: 'lobby' },
      { label: 'Pyydä vastaanotosta hammastahnaa.', time: 6, once: 'desk_tp', do: (G) => { G.nerves(2); G.note('Hän kurkkii tiskin alle, tosissaan, pitkään. ' + V(LX('“No. Sorry. The 10-11 will have some. Twenty minutes, walking.”')) + ' Hän katsoo sinua, ja ovia, ja sinua. ' + V(LX('“Maybe not tonight.”'))); }, next: 'lobby' },
      { label: 'Kysy, pitääkö kyltti paikkansa.', kind: 'comply', dd: 1, time: 5, do: (G) => { const n = G.count('sign'); G.note(n === 1 ? 'Hän osoittaa kylttiä. ' + V(LX('“Eleven.”')) + ' Kysyt, keneltä hän sen kuuli. ' + V(LX('“A passenger phoned them. They said yes.”')) + ' Tauko. ' + V(LX('“Or they said something.”')) : n === 2 ? V(LX('“Eleven,”')) + ' hän sanoo katsettaan nostamatta, ennen kuin olet ehtinyt kysyä loppuun.' : 'Hän katsoo sinua hetken ilmeellä, jota et osaa tulkita, ja sanoo sitten: ' + V(LX('“You are in 214,”')) + ' ja palaa ristikkonsa pariin. Et ollut kysynyt.'); if (n >= 3) G.dread(3); }, next: 'lobby' },
      { label: 'Kysy, onko bussi tullut.', kind: 'comply', dd: 3, time: 5, do: (G) => { const d = G.D; G.dread(1); G.note(d >= 4 ? V(LX('“One is outside,”')) + ' hän sanoo. ' + V(LX('“It is not yours.”')) + ' Kysyt, mistä hän sen tietää. Hän kääntää ristikon sinuun päin. Se on tyhjä.' : G.t >= KNOCK_AT ? V(LX('“Somebody came asking for you. In a uniform. I said you were asleep.”')) + ' Et nukkunut. ' + V(LX('“I know.”')) : V(LX('“No coach. Eleven. Please, go up and sleep.”'))); }, next: 'lobby' },
      { label: 'Myyntiautomaatti.', nd: -2, time: 5, do: (G) => { const n = G.count('vend'); if (n === 1) { G.flag('crisps'); G.nerves(-3); G.note('Sipsejä, paprikan makuisia. Kaksi minipulloa punaviiniä, jonka etiketissä on kuva vuoresta. Automaatti hyväksyy korttisi kolmannella yrityksellä ja päästää syvää vastahakoisuutta ilmaisevan äänen. Pitelet illallistasi molemmin käsin.'); } else { G.note(n === 2 ? 'Loppuunmyyty, melkein. Yksi tuote jäljellä, alahyllyllä: purkki skyriä, jonka päiväystä et olisi halunnut lukea.' : 'Automaatin valo lepattaa. Kaikki hyllyt ovat nyt tyhjiä, paitsi skyr, joka on siirtynyt yhtä hyllyä ylemmäs.'); if (n >= 3) G.dread(1); } }, next: 'lobby' },
      { label: 'Kahviautomaatti.', time: 5, once: 'coffee_l', do: (G) => { G.nerves(G.has('coffee') ? 2 : -2); G.note('Kahvia. Mikä tätä kahvia oikein vaivaa. Se maistuu siltä kuin se olisi kuvailtu koneelle puhelimitse. Juot sen seisaaltaan ja katselet ovia.'); }, next: 'lobby' },
      { label: 'Herätä sohvalla nukkuvat matkustajat. Vertailkaa tietoja.', whyNot: 'Herättäisit heidät huutamalla.', nd: -4, dd: -4, nerveMax: 85, time: 8, once: 'sofa', do: (G) => { G.collect(1); G.nerves(-2); G.note((G.did('talk_couple') ? 'He ovat se pariskunta hallin ikkunan luota.' : 'Vanhempi pariskunta sinun lennoltasi.') + ' He eivät nuku. ' + V('"Me saatiin sähköposti, jossa luki yhdeksän",') + ' hän sanoo. ' + V('"Ja toinen, jossa luki kahdeksan. Ja se chattijuttu sanoo jotain ihan muuta."') + ' Katsotte kaikki kylttiä. ' + V('"Yksitoista",') + ' hän sanoo. ' + V('"Tuloste."')); }, next: 'lobby' },
      { label: 'Katso parkkipaikkaa lasin läpi.', whyNot: 'Et halua nähdä.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(d >= 4 ? 5 : 0); G.note(d >= 5 ? 'Bussi seisoo nyt aivan ovien edessä. Moottori käy. Sisävalot palavat. Ovet liukuvat sen edessä auki, ja jäävät auki, ja kylmä virtaa sisään. Kukaan ei nouse kyydistä.' : d >= 4 ? 'Parkkipaikan perällä ajovalot, moottori tyhjäkäynnillä. Niiden takana hahmo, jolla on bussin muoto. Virkailija ei nosta katsettaan. Ei ole nostanut vähään aikaan.' : 'Soraa, yksi lyhtypylväs, tie. Auto ajaa ohi hidastamatta. Tähyilet jotakin. Haluaisit lakata.'); if (d >= 4) G.flag('looked1'); }, next: 'lobby' },
      { label: 'Mene ulos.', whyNot: 'Ei niistä ovista.', dd: -2, dreadMax: 88, time: 3, next: 'carpark' },
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
    text: (G) => hub(G, `Parkkipaikka. ${G.clock(G.t)}. Tuuli on tullut pitkän matkan sinua vastaan.` + (G.has('coach_seen_cp') ? ' Bussi on yhä parkkipaikan perällä.' : G.D >= 3 ? ' Parkkipaikan perällä, lyhdyn takana, jokin on pysäköitynä. Tai seisoo.' : ''), 'carpark'),
    choices: (G) => [
      { label: G.has('coach_seen_cp') ? 'Kävele taas parkkipaikan perälle. Bussia kohti.' : G.D >= 3 ? 'Kävele parkkipaikan perälle. Hahmoa kohti.' : 'Kävele parkkipaikan perälle.', whyNot: 'Jalkasi eivät suostu.', nd: 5, dreadMax: 92, time: 6, do: (G) => { const d = G.D; G.dread(G.counted('cpwalk') ? 1 : 3); G.count('cpwalk'); if (d >= 4) { G.flag('coach_seen_cp'); G.nerves(G.counted('cpwalk') > 1 ? 3 : 6); G.note('Bussi. Tummansininen. Kultainen vaakuna. Moottori käy, kaikki sisävalot palavat, ja jokaisen ikkunan takana ihminen, selkä suorana, kasvot hotelliin päin. Oven vieressä tummansiniseen pukeutunut mies, kädet ristissä. Hän ei katso sinuun. ' + V('"Vielä ei",') + ' hän sanoo, ei kenellekään, tai sinulle.'); } else { G.nerves(3); G.note('Ei mitään. Muuta tummempi läikkä soraa, sen muotoinen, mikä siinä on äskettäin seissyt pysäköitynä. Tuuli. Seisot hetken sen muodon sisällä.'); } }, next: 'carpark' },
      { label: 'Nouse bussiin.', kind: 'comply', if: (G) => G.has('coach_seen_cp'), do: (G) => { G.flag('nc_carpark'); G.end('nightcoach'); } },
      { label: 'Katso ylös ikkunaasi.', time: 3, do: (G) => { G.dread(2); G.nerves(2); G.note(G.D >= 4 ? 'Toinen kerros, neljäs ikkuna. Valo palaa. Jätit sen päälle. Verho on auki. Et jättänyt sitä auki.' : 'Toinen kerros, neljäs ikkuna. Valo palaa. Se näyttää huoneelta, jossa on joku.'); }, next: 'carpark' },
      { label: G.did('desk_tp') ? 'Kävele kahdenkymmenen minuutin matka 10-11:een hakemaan hammastahnaa.' : 'Kävele tietä pitkin. Risteyksen kyltissä lukee 10-11, 2 km.', whyNot: 'Ei yksin. Ei sinne.', dreadMax: 70, sub: 'Hammastahnaa. Ehkä sukkia. Vaihtelua maisemaan.', time: 20, once: 'walk', next: 'walk' },
      { label: 'Mene takaisin sisään.', kind: 'comply', dd: 1, time: 3, next: 'lobby' },
    ],
  };

  scenes.walk = {
    art: 'road',
    loc: 'Tie · kohti 10-11:tä',
    text: p(
      'Tuulta. Laavaa. Tie, jolla ei ole jalkakäytävää, ja valkoinen viiva, joka katoaa aina uudelleen. Kahdeksan minuutin kuluttua et enää näe hotellia takanasi; kymmenen minuutin kuluttua et vieläkään näe 10-11:tä edessäsi.',
      'Sitten ajovalot, hitaat, takaapäin. Bussi. Se ajaa rinnallesi ja pysähtyy, ja ovi taittuu auki pehmeällä, kalliin kuuloisella äänellä. Lämmintä valoa. Istuinrivejä, ja niillä ihmisiä, jotka istuvat hyvin hiljaa.',
      V('"Albion matkustaja?"') + ' sanoo ääni, jonka tunnistat kuulutuksista 37 000 jalan korkeudesta. ' + V('"Me teemme meidän parasta. Hyppää päälle."'),
    ),
    choices: [
      { label: 'Nouse kyytiin. Siellä on lämmintä.', kind: 'comply', do: (G) => G.end('convenience') },
      { label: 'Kävele eteenpäin. Älä katso oveen.', whyNot: 'Et voi kääntää sille selkääsi.', dreadMax: 75, dd: -14, time: 30, do: (G) => { G.nerves(12); G.flag('toothpaste'); G.nerves(-10); G.dread(8); G.note('Bussi seisoi vierelläsi tyhjäkäynnillä pitkään, ja sitten se ei enää seissyt. 10-11 loisti kuin pyhäkkö. Hammastahnaa. Hammasharja. Sukkia, kolmen pakkaus, kauneimmat sukat, jotka olet ikinä nähnyt. Kävelit takaisin pussi rintaa vasten puristettuna. Mikään ei ohittanut sinua tiellä. Ei yhtään mikään, ja se oli jotenkin vielä pahempaa.'); }, next: 'carpark' },
      { label: 'Käänny ympäri. Kävele takaisin hotellille. Nopeasti.', kind: 'comply', dd: 6, time: 15, do: (G) => { G.nerves(8); G.dread(5); G.note('Et juossut. Kävelit, nopeasti, bussi perässäsi tyhjäkäynnillä, samaa vauhtia, ja sitten ei enää. Aulan ovet liukuivat auki ennen kuin ehdit niiden luo.'); }, next: 'carpark' },
    ],
  };

  /* ---- the phone dies ---- */
  scenes.phone_dies = {
    art: 'phone',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('phone_scene'); G.dread(4); },
    text: (G) => p(
      G.last(),
      'Puhelin, näyttö ylöspäin peitolla, näyttää 1 %. Se on näyttänyt 1 % jo tovin, niin kuin pidätetty hengitys kestää. Katsot sitä, kun se tapahtuu: näyttö himmenee huoneen väriseksi, ja sitten ei-minkään väriseksi, ja mustassa lasissa ovat sinun kasvosi, ei-minkään valaisemina, katsomassa takaisin.',
      'Laturi on laukussa. Laukku on järjestelmässä. Seinäkello on ainoa kello, joka sinulla enää on, ja se on hotellin kello, etkä luota siihen.',
      'Mitä ikinä he seuraavaksi lähettävät, et kuule sen saapuvan. Mitä ikinä he ovat järjestäneet, he ovat järjestäneet sen puhelimelle, joka on kuollut. Makaat siinä, lentokonevaatteissasi, pimeä laatta kädessäsi, ja lämmitys miettii, koputtaisiko.',
    ),
    choices: [
      { label: 'Käännä se näyttö alaspäin. Nukahda uudelleen. Toivo, että heräät.', kind: 'comply', dd: 8, time: 20, do: (G) => { G.nerves(-2); G.note('Käännät sen näyttö alaspäin, mikä ei auta mitään, ja käyt makuulle, mikä ei auta mitään, ja kuuntelet rakennusta. Uni ei ole oikea sana sille, mikä tulee.'); }, next: 'room' },
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
      V('"Bussi Albion Atlantic matkustajille. Lähtevä nyt. Viimeinen kutsu."'),
      'Ääni on kärsivällinen. Ääni on hyvin, hyvin kärsivällinen.',
    ),
    choices: [
      { label: 'Avaa ovi.', kind: 'comply', sub: 'Se saattaa olla bussi.', do: (G) => G.end('nightcoach') },
      { label: 'Katso ovisilmästä.', dd: 6, nd: 6, time: 2, do: (G) => { G.nerves(9); G.flag('spyhole'); G.note('Käytävä on tyhjä. Matto ovesi edessä on märkä. Koputus jatkuu, tasaisena, eikä tule mistään erityisestä suunnasta.'); }, next: 'knock2' },
      { label: 'Kyltissä luki 11:00. Älä avaa. Älä vastaa.', whyNot: 'Et voi olla vastaamatta. He sanoivat, että koputtaisivat.', nd: 5, dreadMax: 80, instr: 'knock_notice', time: 20, do: (G) => { G.nerves(5); G.note('Istuit sängyllä selkä sängynpäätyä vasten ja katse ovessa ja laskit koputuksia. Kuudenkymmenen jälkeen menetit laskun. Sitten ne lakkasivat, ja se oli jonkin aikaa vielä pahempaa.'); }, next: 'window' },
    ],
  };

  scenes.knock2 = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: (G) => p(G.last(), 'Tasaista. Kärsivällistä. Ei ketään.'),
    choices: [
      { label: 'Avaa ovi silti.', kind: 'comply', do: (G) => G.end('nightcoach') },
      { label: 'Peräänny ovelta. Istu sängylle. Odota, että se loppuu.', whyNot: 'Kätesi on jo ketjulla.', dreadMax: 88, time: 25, do: (G) => { G.nerves(3); G.note('Lopulta se lakkasi, niin kuin sade lakkaa: et huomannut viimeistä koputusta.'); }, next: 'window' },
    ],
  };

  scenes.corridor_knock = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Second floor corridor · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); G.nerves(8); },
    text: (G) => p(
      G.last(),
      'Olet käytävällä, kun se alkaa. Käytävän toisessa päässä, hissin luona, joku tummansiniseen pukeutunut koputtaa oveen. Tasaisesti. Kärsivällisesti. Sitten seuraavaan oveen. Sitten seuraavaan.',
      'Hän lähestyy ovi ovelta huonetta 214. Hän lähestyy sinua. Hän ei ole nostanut katsettaan. ' + V('"Bussi Albion Atlantic matkustajille. Lähtevä nyt. Viimeinen kutsu."'),
    ),
    choices: [
      { label: 'Kävele hänen ohitseen. Takaisin huoneeseesi. Lukitse ovi.', whyNot: 'Et pysty kävelemään häntä kohti.', dreadMax: 80, time: 5, do: (G) => { G.nerves(10); G.dread(8); G.flag('seen'); G.note('Hän ei lakannut koputtamasta, kun kuljit ohi. Hän ei kääntynyt. Mutta kun avainkorttisi naksahti lukossa, hän sanoi, miellyttävään sävyyn, edessään olevalle ovelle: ' + V('"Kaksi neljätoista",') + ' ja sait turvaketjun paikalleen käsillä, jotka eivät tuntuneet omiltasi.'); }, next: 'window' },
      { label: 'Mene portaita alas. Hiljaa. Odota aulassa.', whyNot: 'Et pysty liikkumaan.', dd: 5, dreadMax: 92, time: 15, do: (G) => { G.nerves(6); G.dread(5); G.flag('hid_lobby'); G.note('Virkailija ei nostanut katsettaan, kun tulit alas. ' + V(LX('“He is looking for you,”')) + ' hän sanoi ristikolleen. Istuit sohvalla niiden kahden matkustajan vieressä, jotka siinä jo olivat, eikä kukaan sanonut pitkään aikaan mitään, ja sitten aulan ovet liukuivat auki ei kenellekään, ja sulkeutuivat.'); }, next: 'window' },
      { label: 'Vastaa hänelle. Olet Albion Atlanticin matkustaja.', kind: 'comply', do: (G) => { G.flag('nc_corridor'); G.end('nightcoach'); } },
    ],
  };

  scenes.window = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.S.t = Math.max(G.t, T(1, 4, 50)); if (!G.dead()) G.bot('Hei! Minä näen että sinä olet huone 214. Bussi odottaa sinua parkki alueella. Ole hyvä älä katso ulos ikkunasta. 🙂', 0, 'nolook'); },
    text: (G) => p(
      G.last(),
      (G.has('hid_lobby') ? 'Menit lopulta takaisin ylös, koska muuta paikkaa ei ollut, missä olla. Käytävä oli tyhjä. Koputus on lakannut. ' : 'Taas huoneessa, tai yhä siellä. Koputus on lakannut. ') + (G.dead() ? 'Puhelin on pimeänä peitolla, ja se on melkein pahempaa: mitä ikinä he sanovat, he sanovat sen ei kenellekään.' : 'Puhelimesi valaisee kattoa. ' + ALLY_MSG(G)),
      !G.dead() && (G.readMsg('nolook') ? W('Olet lukenut sen. Siinä kiellettiin katsomasta ulos ikkunasta.') : W('Et ole lukenut sitä.')),
      'Verho on ohut. Sen läpi kuultaa valoa, ja valo värähtelee hieman, niin kuin käyvän moottorin valo värähtelee.',
    ),
    choices: [
      { label: 'Katso.', whyNot: 'He kielsivät.', dd: 10, nd: 8, dreadMax: 90, instr: 'nolook', sub: 'Ihan vähän vain.', time: 5, do: (G) => { G.flag('seen'); G.flag('looked_out'); G.nerves(14); atLeast(G, 78); }, next: 'window2' },
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
      if (G.dead() || G.battery() < 20) { G.flag('borrowed_cable'); G.charge(35); }
      G.at(T(1, 7, 35), 'sms', { from: 'Jo 💛', body: 'HERRANJUMALA OOTKO SÄ ISLANNISSA?? sun on pakko käydä blue lagoonissa. PAKKO. se on tyyliin 20 min kentältä' });
      G.at(T(1, 8, 5), 'chat', { body: 'Hyvää huomenta! Sinun transfer lentokentälle on vahvistettu 08:00. Ole hyvä ole lobbyssa. 🚌', key: 'morning_chat' });
      G.at(T(1, 9, 40), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Sinun transfer lentokentälle', stamp: T(1, 9, 40), key: 'morning_mail', body: 'Rakas Asiakas,\n\nBussit keräävät sinut sinun accommodation 09:00 sinun uudelleen bookattu lento AB 0271 varten.\n\nOle hyvä ole valmis lobbyssa 08:45.\n\nMe teemme meidän parasta.' });
      G.at(T(1, 9, 55), 'chat', { body: 'Sinun bussi on täällä. Se on se kiva yksi. 🚌' });
    },
    text: (G) => p(
      G.has('allnighter') ? 'Harmaata valoa. 07:30. Et nukkunut, ja olet yhä Islannissa.' : 'Harmaata valoa. 07:30. Nukuit, tai jotain sinne päin, ja olet yhä Islannissa.',
      'Aamiaiseksi on skyriä, leipää ja kahvia, joka on kuumaa, ja ruskeaa, ja siihen se jää. Huone on täynnä lentosi väkeä. Kaikilla on eiliset vaatteet päällä. Kaikki vertailevat tietojaan: mikä hotelli, mikä noutoaika, mihin kolmesta ristiriitaisesta viestistä kukin on päättänyt uskoa.',
      G.has('borrowed_cable') && 'Jollakulla viereisessä pöydässä on johto, joka sopii. Kytket puhelimen leivänpaahtimen viereiseen pistorasiaan, ja se palaa henkiin, hitaasti, niin kuin kasvot palaavat, ja ensimmäiseksi se kertoo sinulle kaiken, mistä jäit paitsi.',
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
      `Aula. ${G.clock(G.t)}. Kyltissä lukee 11:00. ${G.readMsg('morning_mail') ? 'Sähköpostissa luki 09:00, ja se tuli perille 09:40. ' : G.readMsg('morning_chat') ? 'Chatbotti sanoi 08:00. Kello on jo yli 08:00. ' : ''}Kukaan ei ole nähnyt bussia, joka olisi sinun.`,
      'morning'),
    choices: (G) => [
      { label: 'Näytä UK261-QR-koodi jokaiselle matkustajalle, jonka tavoitat.', whyNot: 'Kätesi eivät pitäisi puhelinta paikallaan.', dd: -8, nd: -4, nerveMax: 90, sub: 'Sillä varauksella, että lentoyhtiö panee vastaan.', if: (G) => G.has('uk261'), once: 'qr1', time: 20, do: (G) => { G.collect(2); G.nerves(-5); G.note('Kierrät pöydästä pöytään puhelin ojossa kuin pidätysmääräys. Ihmiset ottavat siitä kuvan. Bageliaan syövä nainen sanoo: ' + V('"Mä oon valmis olemaan Karen."') + ' Joku taputtaa, kerran.'); }, next: 'hotel_morning' },
      { label: 'Vertaile tietoja muiden kanssa.', whyNot: 'Aloittaisit riidan.', dd: -5, nd: -4, nerveMax: 85, time: 20, once: 'notes1', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_notes'); G.note('Sähköposteissa neljä eri hotellia – ja jokainen, joka sellaisen sai, on nyt tässä samassa. Kuusi noutoaikaa. Yksi tuloste. Mies, jolla on Blazers-lippis: ' + V('"Ne vaakunalliset ei oo meidän. En tiedä kenen ne on. Ei meidän."') + ' Kaikki nyökkäilevät, kuin olisivat tienneet.'); }, next: 'hotel_morning' },
      { label: 'Kysy vastaanotosta, pitääkö 11:00 paikkansa.', kind: 'comply', dd: 2, time: 10, once: 'recep', do: (G) => { G.nerves(1); G.note('Sama virkailija. Edelleen. Hän osoittaa kylttiä. ' + V(LX('“Another passenger phoned them. They said yes.”')) + ' Tauko. ' + V(LX('“Or they said something.”'))); }, next: 'hotel_morning' },
      { label: 'Mene takaisin huoneeseen. Suihkuun. Pese edes kasvosi.', whyNot: 'Et pysyisi paikallasi sen alla.', nerveMax: 92, time: 25, once: 'morn_shower', do: (G) => { G.nerves(-5); G.dread(-2); G.note('Kuumaa vettä. Samat vaatteet. Päivänvalossa huone on vain huone: shampoot, vedenkeitin, ikkuna parkkipaikalle, jolla seisoo bussi. Et katso pitkään.'); }, next: 'hotel_morning' },
      { label: 'Juttele taaperon äidin kanssa.', whyNot: 'Pelästyttäisit lapsen.', nd: -3, dd: -3, nerveMax: 80, time: 10, once: 'morn_mother', do: (G) => { G.collect(1); G.nerves(-3); G.note(V('"Hän haluaisi olla jo kotona",') + ' äiti sanoo taaperosta, joka on pöydän alla. ' + V('"Niin minäkin. Kuulitko sinä viime yönä koputusta?"') + (G.has('knocked') ? ' Sanot, että kuulit. Hän sanoo: ' + V('"Ei mekään avattu."') : ' Sanot, että olit alakerrassa. Hän katsoo sinua kuin se olisi ollut valinta. ' + V('"Me ei avattu."'))); }, next: 'hotel_morning' },
      { label: 'Tarkista lennon tilanne lentoyhtiön sivuilta.', dd: 3, nd: 3, time: 8, if: (G) => !G.dead(), do: (G) => { const n = G.count('status'); G.dread(2); G.batt(-1); G.note(n === 1 ? 'AB 0271 · KEF → LAX · 15:10 · AIKATAULUSSA. Minkä aikataulun mukaan, sitä ei kerrota.' : n === 2 ? 'AB 0271 · 15:10 · AIKATAULUSSA. Sitten, silmiesi edessä, 15:25. Sitten taas 15:10.' : 'Sivu ei lataudu. Sitten se latautuu, eikä lentoa näy. Sitten näkyy. 15:10. Panet puhelimen pois ennen kuin se ehtii taas muuttua.'); }, next: 'hotel_morning' },
      { label: G.readMsg('morning_mail') ? 'Mene ulos katsomaan, näkyykö klo 09:00 bussia.' : 'Mene ulos katsomaan, näkyykö klo 08:00 bussia.', kind: 'comply', dd: 5, if: (G) => (G.readMsg('morning_chat') || G.readMsg('morning_mail')) && G.t < T(1, 10, 0), time: 10, next: 'decoy_morning' },
      { label: 'Mene kuumille lähteille. Olet aina halunnut sinne.', sub: 'Lentoasemalle on kaksikymmentä minuuttia. Kaikki sanovat niin.', do: (G) => G.end('tantalus') },
      { label: 'Odota aulassa.', kind: 'comply', dd: 3, nd: 2, sub: 'Puoli tuntia tätä.', time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Puoli tuntia. Kahviautomaatti, ovet, kyltti. Lapsi laskee sataan ja aloittaa alusta.', 'Puoli tuntia. Jonkun puhelimen herätys soi – Los Angelesin aikaan asetettuna – ja kaikki nauravat, ja sitten ei kukaan.', 'Puoli tuntia. Ulkona tulee bussi, joka ei ole sinun, ja lähtee. Et nouse. Ei nouse kukaan muukaan.'])); }, next: 'hotel_morning' },
    ],
    status: (G) => (G.has('hint_notes') ? 'Kuulopuheita: kaikki saivat lentoyhtiöltä eri ajan. Kaikki luottavat tulosteeseen. Vaakunalliset bussit "ei oo meidän".' : ''),
  };

  scenes.decoy_morning = {
    art: 'carpark',
    loc: 'Hótel Hraun · Parkkipaikka',
    text: (G) => p(
      'Bussi on siellä. Tummansininen, kultainen vaakuna, moottori käy. Keulan LED-kyltissä lukee AIRPORT TRANSFER · ALBION ATLANTIC. Purseri seisoo ovella kädet ristissä, ja kun hän näkee sinut, hän hymyilee kuin olisit täsmälleen ajoissa.',
      'Kukaan muu ei ole tullut aulasta ulos. Ikkunoista näkyy, kuinka jo kyydissä olevat matkustajat istuvat selkä suorana puhtaissa paidoissa ja katsovat tyhjyyteen.',
    ),
    choices: (G) => [
      { label: G.readMsg('morning_mail') ? 'Nouse kyytiin. Sähköpostissahan luki 09:00.' : 'Nouse kyytiin. Chatbottihan sanoi 08:00.', kind: 'comply', do: (G) => G.end('crew') },
      { label: 'Mene takaisin sisään. Älä sano siitä kenellekään mitään.', whyNot: 'Hän katsoo sinua.', dreadMax: 85, time: 5, do: (G) => { G.nerves(6); G.dread(5); G.note('Menit takaisin sisään. Kukaan ei kysynyt mitään. Lasin takana bussi seisoi paikallaan, ovi auki, pitkään.'); }, next: 'hotel_morning' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 10:15 bus stand 2 */
  scenes.buses2 = {
    art: 'carpark',
    loc: 'Hótel Hraun · Parkkipaikka',
    enter: (G) => { if (G.t < T(1, 10, 15)) G.S.t = T(1, 10, 15); G.dread(4); },
    text: (G) => p(
      'Joku sanoo, että ulkona on bussi. Kysyt vastaanottovirkailijalta, onko se sinun. Hän ei tiedä. Hän osoittaa Arialilla tulostettua kylttiä. ' + V(LX('“Maybe you should hurry.”')),
      'Kuvittele videopelin mittari, mutta hermoillesi, ja sen yläpäässä ohut, värisevä punainen viipale.',
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
        hidden: [(G.did('talk_fleece') || G.has('met_fleece') ? 'Fleece. ' : 'Fleecemies hallista. ') + 'Taapero. Mies paikalta 31C. Samat vaatteet kuin eilen, tietysti, mitä muutakaan heillä olisi päällään.', 'Sinulla on huono kasvomuisti. Nämä tunnet.'],
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
      if (G.once('nofood')) { if (G.rng() < 0.5) G.at(T(1, 12, 30), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Catering sinun lennolla', body: 'Rakas Asiakas,\n\nOle hyvä huomioi että johtuen diversion ei tule olemaan catering palvelu lennolla AB 0271.\n\nMe suosittelemme sinä ostat virvokkeita terminaalissa.\n\nMe teemme meidän parasta.' }); }
      G.at(T(1, 12, 0), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Revisioitu lähtö aika', body: 'Rakas Asiakas,\n\nSinun lento AB 0271 tulee nyt lähtemään 15:45.\n\nCheck-in avautuu kolme tuntia ennen lähtö.\n\nMe teemme meidän parasta.', fx: (G) => { G.S.dep = T(1, 15, 45); } });
      G.at(T(1, 13, 10), 'chat', { body: 'Sinä olet ollut majoitettu. Miksi sinä olet jono? 🙂' });
    },
    text: (G) => p(
      'Päättelet olevasi oikeassa paikassa vain siitä, että alat tunnistaa muita matkustajia, vaikka kasvomuistisi on huono. Bussi lähtee kaksikymmentä minuuttia myöhässä, mikä laskujesi mukaan tarkoittaa, että ehdit lentokentälle vaivaiset neljäkymmentä minuuttia ennen kuin lähtöselvitys edes alkaa.',
      'Taapero ulvoo. ' + (G.did('morn_mother') ? 'Äiti sanoo sen uudestaan, tällä kertaa koko bussille: ' : 'Äiti mutisee: ') + V('"Hän haluaisi olla jo kotona",') + ' ja koko bussi nauraa, surumielisesti.',
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
      { label: 'Välitä UK261-QR-koodi eteenpäin jonossa.', whyNot: 'Kätesi eivät pitäisi puhelinta paikallaan.', dd: -6, nd: -4, nerveMax: 90, if: (G) => G.has('uk261'), once: 'qr2', time: 15, do: (G) => { G.collect(2); G.nerves(-5); G.note('Koodi kulkee jonossa kädestä käteen kuin salasana. ' + V('"Olen valmis ryhtymään Kareniksi",') + ' sanoo fleecetakkinen mies, joka on se fleecemies.'); }, next: 'airport' },
      { label: 'Vaihda muiden kanssa tietoja hotelleista ja lähtöajoista.', whyNot: 'Aloittaisit riidan.', nd: -4, dd: -4, nerveMax: 85, once: 'notes2', time: 15, do: (G) => { G.collect(1); G.nerves(-3); G.note('Jokaisen sähköposti lähetti eri paikkaan. Jokaisen bussi toi samaan hotelliin. Jokaiselle annettiin eri aika, ja kaikki tulivat silti takaisin tulosteessa lukevaa aikaa varten, ja tässä te nyt olette, kaikki yhdessä oikeassa.'); }, next: 'airport' },
      { label: 'Etsi joku univormuun pukeutunut ja sano hänelle suoraan, mitä mieltä olet.', kind: 'conflict', nd: 8, time: 10, do: (G) => { G.strike(); G.note('Sanoit univormuun pukeutuneelle miehelle suoraan, mitä mieltä olet. ' + V('"Me teemme meidän parasta."') + ' Ei anteeksipyyntöä. Ei osanottoa. Ei edes näön vuoksi. Hän kirjoitti jotain muistiin.'); }, next: 'airport' },
      { label: 'Etsi uloskäynti. Ihan vain katsoaksesi.', whyNot: 'Tiedät jo, että se on lukossa.', dd: 6, dreadMax: 85, time: 8, once: 'exit', do: (G) => { G.dread(5); G.nerves(4); G.note('Ulko-ovissa lukee VAIN SAAPUVAT. Tulit niistä sisään. Painat kämmenesi lasia vasten, eikä ovi aukea, ja huomioliiviin pukeutunut mies pudistaa päätään sinua katsomatta.'); }, next: 'airport' },
      { label: G.has('inline') ? 'Osta vettä. Takanasi seisova mies ei luota siihen, ettei vesi lopu.' : 'Osta vettä. Joku sanoo, että vesi loppuu.', whyNot: 'Heittäisit sen.', nd: -4, nerveMax: 92, time: 10, once: 'water', do: (G) => { G.nerves(-3); G.note('Vettä, ja voileipä, jonka nimessä on ð-kirjain, ja – koska kaupassa sattuu olemaan niitä – sukkia. Sinulla oli sukkia. Ostat lisää sukkia. Kukaan tämän yön kokenut ei tuomitsisi sinua.'); if (!G.has('toothpaste')) { G.flag('toothpaste'); G.nerves(-4); } }, next: 'airport' },
      { label: 'Tarkkaile lähtevien taulua.', dd: 3, nd: 3, time: 6, do: (G) => { const n = G.count('board'); G.dread(2); G.note(n === 1 ? `AB 0271 · LOS ANGELES · ${G.clock(G.S.dep)}. Sitten taulu käy läpi kaikki maailman lennot ja palaa siihen. Sama aika. Toistaiseksi.` : n === 2 ? 'Aika ei ole muuttunut. Rivi on siirtynyt alemmas. Kaikki sen yläpuolella ovat lentoja, jotka lähtevät jonnekin.' : 'Katsot, kun taulu vaihtuu. LOS ANGELES. LOS ANGELES. Yhden ruudun ajan jotain, mikä ei ole kaupunki. LOS ANGELES.'); }, next: 'airport' },
      { label: 'Odota.', whyNot: 'Et pysty seisomaan paikallasi.', kind: 'comply', nd: 3, dd: 3, nerveMax: 90, time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Puoli tuntia. Jono ei etene, koska sillä ei ole mitään, mitä kohti edetä. Joku istuutuu lattialle, ja tapa leviää.', 'Puoli tuntia. Siivooja ajaa ohi koneellaan. Hänen mentyään lattia näyttää samalta ja jono on hieman lyhyempi.', 'Puoli tuntia. Puhelimesi värähtää, mutta siinä ei ole mitään. Kaikkien puhelimet värähtävät, yhtä aikaa, ja kaikki katsovat, eikä kukaan sano mitään.'])); }, next: 'airport' },
    ],
  };

  scenes.checkin = {
    art: 'airport',
    loc: 'Keflavík · Se ainoa tiski',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 180); if (G.has('lind')) G.dread(4); if (G.S.strikes >= 3) G.end('left'); },
    text: (G) => p(
      'Tiski avataan ajallaan, toisin sanoen silloin, kun se oli omassa hiljaisuudessaan päättänyt. Virkailija ottaa passisi. Yksikään univormuun pukeutunut ei ole koko päivänä ollut vähääkään pahoillaan, ei edes näön vuoksi, eikä tämä mies aio katkaista putkea. ' + V('"Me teemme meidän parasta."'),
      G.has('booked') && 'Hän kurtistaa kulmiaan näytölle. ' + V('"Meidän tiedot näyttävät että sinä olit majoitettu Heathrow Renaissance Lodge viime yö."') + ' Hän näppäilee jotain. Hän sanoo, että asia on merkitty muistiin.',
      G.has('lind') && 'Hän kurtistaa kulmiaan näytölle. ' + V('"Meidän tiedot näyttävät sinä et käyttänyt sinun järjestetty accommodation."') + ' Hän katsoo vaatteitasi, jotka ovat samat vaatteet kuin kaikilla muillakin, ja kasvojasi, jotka ovat puhtaammat. Hän näppäilee jotain. Hän ei sano mitä.',
      G.has('objected') && W('Hän vilkaisee näyttöön kiinnitettyä pientä korttia ja sitten sinua.'),
      G.has('seen') && W('Hän katsoo sinua hivenen liian pitkään. ' + V('"Room 214",') + ' hän sanoo, eikä se ole kysymys.'),
      'Tarkastuskortti, vielä lämmin tulostimesta. Portti 12. Se on oikea. Tarkistat sen kolmeen kertaan.',
    ),
    choices: [
      { label: 'Mene portille.', time: 40, do: (G) => { if (G.has('booked')) G.strike(); G.nerves(-6); }, next: 'gate' },
    ],
  };

  scenes.gate = {
    art: 'gate',
    loc: 'Keflavík · Portti 12',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 60); G.dread(5); G.at(G.t + 20, 'chat', { body: 'Enemmistö asiakkaat on nousseet koneeseen. 🙂' }); },
    text: (G) => p(
      'Olet matkustanut näiden ihmisten kanssa jo yli vuorokauden. Tunnet fleecen. Tunnet taaperon. Tunnet miehen paikalta 31C. ' + (G.did('notes1') || G.did('notes2') ? 'Tunnet pariskunnan, jonka sähköposti lähetti heidät hotelliin täysin vastakkaiseen suuntaan.' : 'Tunnet vanhemman pariskunnan ikkunan luota.') + (G.did('water') ? ' Tunnet miehen, joka ihan tosissaan ei luota siihen, ettei lentoyhtiöltä lopu vesi.' : ''),
      'Portin virkailija tarttuu mikrofoniin ja <em>karjuu</em> teille, että koneeseen noustaan ryhmä kerrallaan.',
      'Ja sata ihmistä nauraa hänelle päin naamaa. Ei ilkeästi. Vain – voimattomasti. Olette tässä vaiheessa muodostaneet itsehallinnollisen yhteisön, ja hänen yrityksensä komennella sitä on jostain syystä hauskinta, mitä koko päivänä on tapahtunut.',
    ),
    choices: [
      { label: 'Naura mukana.', whyNot: 'Se tulisi ulos väärin.', nd: -6, dd: -4, nerveMax: 85, time: 10, do: (G) => { G.collect(1); G.nerves(-6); }, next: 'jetbridge' },
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
      G.has('looked_out') ? 'Bussin etuosassa seisoo kaiteesta kiinni pitäen purserin univormuun pukeutunut mies. Hän kääntyy. Hän katsoo sinua – vain sinua – täsmälleen yhtä kauan kuin hän katsoi ikkunaasi. ' + V('"Sinä olet katsonut",') + ' hän sanoo ystävälliseen sävyyn ja kääntyy takaisin.' : G.has('seen') ? 'Bussin etuosassa seisoo kaiteesta kiinni pitäen purserin univormuun pukeutunut mies. Hän kääntyy. Hän katsoo sinua – vain sinua – täsmälleen yhtä kauan kuin hän koputti oveesi. ' + V('"Kaksi neljätoista",') + ' hän sanoo ystävälliseen sävyyn ja kääntyy takaisin.' : 'Kuljettaja ei puhu. Radiosta tulee jotain, joka saattaa olla säätiedotus.',
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
      'Istuin. Vyö. Se hienosteleva ääni, luurissa: ' + V('"Enemmistö meidän asiakkaista on ollut ymmärtävä ja kärsivällinen."') + ' Sitten hän onnittelee itseään, varsin pitkään, niistä turvallisuusmenettelyistä, jotka toivat teidät Islantiin.',
      'Sitten hän selittää, miten hyvitystä haetaan. Suoristat selkäsi. Kyse on lennon wifistä.',
      'Sitä et aio tehdä.',
    ),
    choices: [
      { label: 'Sulje silmäsi.', do: (G) => G.end(G.S.collective >= 5 ? 'collective' : 'home') },
    ],
  };

  /* ================================================================ Hótel Lind: the other hotel
     If the Flybus took you to the city and the taxi driver took you to the
     nearest light, you are here: a narrow guesthouse off Laugavegur that the
     airline never booked, with a clerk who speaks perfect English and has
     never heard of your flight. Everything is provided. That is the problem. */
  const lindStatus = (G) => `Huone 7. ${G.clock(G.t)}. ${G.dead() ? 'Puhelin on kuollut' : `Puhelimen akussa on ${G.battery()}%`}${G.has('lind_tp') ? '' : ', ja hampaasi ovat likaiset'}${G.has('lind_ate') ? '' : ', etkä ole syönyt'}.`;
  const LIND_AMB = {
    room: [
      { d: 1, t: 'Katu. Lyhty. Joku kävelemässä kotiin, hitaasti, kiireettä, mikä vaikuttaa säädyttömän suurelta onnelta.' },
      { d: 1, t: 'Patteri naksuu. Rakennus narisee niin kuin narisee rakennus, jossa ihmiset nukkuvat.' },
      { d: 2, t: 'Alhaalla ajaa ohi taksi, hitaasti, valo päällä, eikä pysähdy kenellekään.' },
      { d: 2, t: 'Seinän takana joku kuorsaa jollakin kielellä.' },
      { d: 3, t: 'Katu on tyhjentynyt. Se teki sen, kun et katsonut.' },
      { d: 3, t: 'Vastapäisen lyhdyn alla ei ole ketään. Sitten, hetken ajan, on.' },
      { d: 4, t: 'Bussin moottori, jossain kadulla, joka on bussille liian kapea, tyhjäkäynnillä.' },
      { d: 4, t: 'Lyhdyn alla seisova mies ei katso rakennusta. Hän katsoo yhtä ikkunaa.' },
      { d: 5, t: 'Ovesi alta näkyvä valo sammuu, ja syttyy, ja sammuu.' },
      { d: 5, t: 'Joku on portaissa. Hän on ollut portaissa jo jonkin aikaa. Hän ei tule ylös eikä mene alas.' },
    ],
    lobby: [
      { d: 1, t: 'Virkailija lukee pokkaria, jonka selkä on murtunut. Hän kääntää sivua. Se on rennoin asia, jonka olet nähnyt sitten Grönlannin.' },
      { d: 1, t: 'Esiteteline: JÄÄTIKÖT · VALAAT · REVONTULET. Joku täällä näkee nämä kaikki.' },
      { d: 2, t: 'Keittiöstä vedenkeittimen ääni ja jonkun toisen paahtoleivän tuoksu.' },
      { d: 2, t: 'Ulko-ovi on lukossa. Virkailija lukitsi sen keskiyöllä. Hän sanoo sen katsettaan nostamatta.' },
      { d: 3, t: 'Joku vieras tulee alas sukkasillaan, täyttää vesilasin ja menee takaisin ylös. Hän ei katsonut sinua. Hän katsoi ovea.' },
      { d: 3, t: 'Pokkari ei ole liikkunut. Virkailija katsoo kattoon, kohti ääntä, jota sinä et ole vielä kuullut.' },
      { d: 4, t: 'Ajovalot oven himmeän lasin läpi, tyhjäkäynnillä, eivät jatka matkaa.' },
      { d: 4, t: () => 'Virkailija sanoo pokkarilleen: ' + LX('“He asked for you. I said we had nobody of that name.”') },
      { d: 5, t: 'Ulko-ovi ei ole lukossa. Virkailija on varma, että lukitsi sen.' },
    ],
    street: [
      { d: 1, t: 'Kuuraa autojen päällä. Leipomo, joka avataan kolmen tunnin kuluttua ihmisille, jotka eivät ole sinä.' },
      { d: 2, t: 'Taksi ajaa kadun pään poikki valo päällä, hitaasti, eikä käänny tälle kadulle.' },
      { d: 2, t: 'Jossain sulkeutuu ovi, ja joku nauraa kerran, sisällä, lämpimässä huoneessa.' },
      { d: 3, t: 'Vastapäinen lyhty lepattaa, tasaantuu, lepattaa. Sen alla ei ketään. Sitten taas ei ketään, eri tavalla.' },
      { d: 3, t: 'Moottori, tyhjäkäynnillä, jossain mäen alapuolella. Se on käynyt tyhjäkäyntiä jo tovin.' },
      { d: 4, t: 'Vastapäisen lyhdyn alla seisova mies ei ole liikkunut. Hän ei katso sinua. Hän katsoo ovea, josta tulit ulos.' },
      { d: 5, t: 'Virkailija ei ole enää lasin takana. Aulan valo palaa. Aula on tyhjä.' },
    ],
    morning: [
      { d: 1, t: 'Hyvää kahvia. Oikeaa kahvia, koneesta, jolla on nimi. Pitelet sitä tovin ennen kuin juot.' },
      { d: 2, t: 'Kaksi reppureissaajaa suunnittelee päivää. Siihen liittyy jäätikkö. Kuuntelet sitä niin kuin kuuntelisi toisen planeetan säätiedotusta.' },
      { d: 2, t: 'Viereisessä pöydässä puhtaaseen paitaan pukeutunut mies lukee sähköpostia ja nyökkäilee sille.' },
      { d: 3, t: 'Ikkunan vieressä istuva nainen on ollut täällä tiistaista asti. Hän sanoo sen iloisesti. Hän sanoo, että kuljetus on vahvistettu.' },
      { d: 3, t: 'Kukaan Albionin pöydässä ei ole katsonut lähtevien lentojen taulua. He katsovat puhelimiaan, ja puhelimet käskevät heidän odottaa.' },
      { d: 4, t: 'Joku Albionin pöydässä nauraa jollekin, mitä hänen puhelimensa sanoi. Koko pöytä nauraa. Sitten he palaavat odottamaan.' },
      { d: 4, t: 'Virkailija tuo lisää skyriä. Hän on tehnyt tämän ennenkin. Hän on tehnyt tämän joka aamu tällä viikolla.' },
      { d: 5, t: 'Albionin pöydässä on yksi paikka vapaana. Siihen on katettu. Katteen vieressä on pieni kortti, jossa lukee nimesi, Arial-fontilla.' },
    ],
  };

  // the flood: everything the airline sent while the phone was dark, and the things it sends to a customer who has made alternative arrangements
  function lindFlood(G) {
    const msgs = [];
    const E = (subj, body, dd = 2) => msgs.push({ ch: 'email', from: 'Albion Atlantic Customer Care', subj, body, dd });
    const X = (body, dd = 1) => msgs.push({ ch: 'sms', from: 'AlbionATL', body, dd });
    const A = (body, dd = 1) => msgs.push({ ch: 'chat', body, dd });
    E('Sinun accommodation', 'Rakas Asiakas,\n\nMeidän tiedot näyttävät että sinä et ole tehnyt check-in sinun järjestetty accommodation.\n\nOle hyvä jatka sinun accommodation.\n\nMe teemme meidän parasta.');
    A('Me näemme sinä olet tehnyt vaihtoehtoiset järjestelyt. 🙂');
    X('AB0271: Sinä et ole sinun accommodation. Ole hyvä jatka sinun accommodation. Älä vastaa.');
    A('Sinun vaihtoehtoiset järjestelyt on noteerattu.');
    E('Vaihtoehtoiset järjestelyt — toiminta vaadittu', 'Rakas Asiakas,\n\nAsiakkaat jotka tekevät vaihtoehtoiset accommodation järjestelyt tekevät niin omalla riski ja kustannus. Albion Atlantic ei voi taata eteenpäin kuljetus asiakkaille jotka eivät ole heidän järjestetty accommodation.\n\nOle hyvä palaa sinun accommodation.\n\nMe teemme meidän parasta.', 3);
    X('AB0271: Sinun hotelli on HEATHROW RENAISSANCE LODGE. Älä vastaa.');
    A('Missä sinä olet? 🙂');
    A('Me emme ole kykeneviä paikantamaan sinua. Ole hyvä jaa sinun sijainti niin että me voimme auttaa. 📍');
    E('Me olemme olleet kykenemättömiä tavoittamaan sinut', 'Rakas Asiakas,\n\nMe olemme yrittäneet kontaktoida sinua koskien sinun eteenpäin kuljetus ja olemme olleet kykenemättömiä tavoittamaan sinut.\n\nSe on asiakkaan vastuu pysyä tavoitettava.\n\nMe teemme meidän parasta.');
    X('AB0271: Ole hyvä vahvista sinun sijainti. Vastaa sinun huone numero.');
    X('AB0271: Ole hyvä vahvista sinun sijainti.');
    X('AB0271: Ole hyvä vahvista.');
    msgs.push({ ch: 'chat', body: 'Sinä olet Hótel Lind, huone 7.', dd: 3, key: 'located' });
    A('Kiitos sinulle. 🙂');
    E('Transfer sinun accommodation — järjestetty', 'Rakas Asiakas,\n\nAjoneuvo on järjestetty palauttamaan sinut sinun accommodation.\n\nKeräys: Hótel Lind, 04:30.\n\nStaff jäsen tulee koputtamaan.\n\nMe teemme meidän parasta.', 3);
    X('AB0271: Ajoneuvo kerää sinut 04:30 sinun nykyinen sijainti. Ole hyvä ole valmis.');
    msgs.push({ ch: 'chat', body: 'Sinun transfer on vahvistettu 04:30. Ole hyvä pysy sinun huoneessa. 🚌', dd: 1, key: 'knock_notice' });
    ['Oletko sinä mukava? 🙂', 'Ole hyvä pysy missä sinä olet.', 'Onko siellä jotain muuta? Siellä ei ole mitään muuta.', 'Enemmistö asiakkaat on heidän accommodation.', 'Me voimme nähdä että sinä olet edelleen siellä.', 'Ole hyvä älä tee lisää järjestelyjä.'].forEach((t) => A(t));
    E('Tärkeä: asiakkaat ei heidän accommodation', 'Rakas Asiakas,\n\nAsiakkaat jotka eivät ole heidän järjestetty accommodation keräys aikana voidaan tallentaa no-show ja ei välttämättä accommodated uudelleen bookattu service.\n\nTämä on sinun turvallisuus varten.\n\nMe teemme meidän parasta.', 3);
    X('AB0271: Asiakkaat ei heidän accommodation voidaan tallentaa NO-SHOW. Vastaa STOP opt out varten.');
    X('STOP is not a recognised command.');
    E('Viesti sinun purser', 'Rakas Asiakas,\n\nMinä olen vastuussa tämä matkustamo, ja turvallisuus meidän asiakkaiden on tantamount.\n\nSinä olet tehnyt vaihtoehtoiset järjestelyt. Nämä on noteerattu.\n\nMe keräämme sinut 04:30.\n\nMe teemme meidän parasta.', 4);
    ['AB0271: Ole hyvä ole valmis.', 'AB0271: 04:30.', 'AB0271: Sinun transfer on ajassa.', 'AB0271: Ole hyvä jatka ovelle järjestetty aika.', 'AB0271: Me teemme meidän parasta.', 'AB0271: Do not reply.', 'AB0271: Ole hyvä ole valmis.', 'AB0271: 04:30.'].forEach((t) => X(t));
    A('Melkein siellä. 🙂');
    A('Ole hyvä jatka ovelle 04:30. Älä avaa sitä ennen. Älä avaa sitä jälkeen.', 2);
    E('Lopullinen ilmoitus', 'Rakas Asiakas,\n\nTämä on lopullinen ilmoitus.\n\nMe teemme meidän parasta.', 3);
    X('AB0271: Final notice.');
    msgs.push({ ch: 'email', from: 'Albion Atlantic Customer Care', subj: 'Sinun auto odottaa', body: 'Rakas Asiakas,\n\nAuto on järjestetty palauttamaan sinut sinun accommodation Hótel Hraun.\n\nSinun kuljettaja odottaa ulkopuolella Hótel Lind. Ole hyvä etsi Albion Atlantic vaakuna.\n\nArvioitu matka aika: —:—', dd: 3, key: 'car', actions: [{ label: 'Mene alas autoon', if: (G) => G.has('lind') && !G.has('morning'), next: 'lind_car' }] });
    A('Me tiedämme mikä huone sinä olet sisällä. 🙂', 2);
    // stamped across the dark hours, from the moment the phone died to now, so they all land at once
    const t0 = G.S.deadAt != null ? G.S.deadAt : T(1, 2, 50), t1 = Math.max(t0 + msgs.length, G.t - 4);
    msgs.forEach((m, k) => { const at = Math.floor(t0 + (t1 - t0) * (k + 1) / msgs.length); if (m.ch === 'chat') m.at = at; else m.stamp = at; G.S.backlog.push(m); });
  }

  scenes.lind_arrive = {
    art: 'guesthouse',
    loc: 'Hótel Lind · Laugavegurin kupeessa · Vastaanotto',
    enter: (G) => { G.S.t = Math.max(G.t, T(1, 3, 5)); G.flag('at_hotel'); G.flag('lind'); atLeast(G, 34); },
    text: (G) => p(
      G.last(),
      'Majatalo siis. Kapea, lämmin, komeron kokoinen vastaanotto, ja sen takana nainen, joka on hereillä, ja jolla on pokkari, ja joka katsoo sinua niin kuin ihmiset katsovat säätä. Hän puhuu niin kuin lentoyhtiö ei puhu: kokonaisin lausein, ilman logoa.',
      V(LX('“Gunnar\'s headlights. Then you are from the flight.”')) + ' Lentoyhtiö ei ole koskaan varannut häneltä mitään. Gunnar on tuonut hänelle yhden teikäläisistä joka yö tällä viikolla. Se on, jotenkin, yön paras uutinen. Hänellä on huone, 7, kaksi kerrosta ylempänä, käteisellä tai kortilla. Kortti toimii ensimmäisellä yrittämällä.',
      'Ei, tulostettua kylttiä ei ole. Ei, kukaan ei ole soittanut. ' + V(LX('“Do you need anything? Toothpaste. A charger — everybody leaves chargers. There is bread in the kitchen, and skyr. Ask. I am here all night.”')),
    ),
    choices: [
      { label: 'Kyllä. Hammastahnaa, kiitos. Ja laturi, jos jokin sopii. Ja mitä ikinä keittiöstä löytyy.', nd: -3, dd: 1, time: 8, do: (G) => { G.flag('lind_tp'); G.flag('charger'); G.flag('lind_food'); G.S.once.lind_desk_tp = true; G.S.once.lind_desk_ch = true; G.S.once.lind_desk_food = true; G.nerves(-4); G.dread(2); G.note('Puoliksi käytetty tuubi düsseldorfilaiselta mieheltä, hammasharja yhä pakkauksessaan, tarjotin leipää ja skyriä, ja laatikko: kymmeniä johtoja, kaikenlaisia, joita kokeillaan puhelimeesi yksi kerrallaan kuin avaimia. Neljäs sopii. ' + V(LX('“Keep it. Everybody leaves them.”')) + ' Menet ylös sylin täydeltä, kuin joku, joka on käynyt ostoksilla.'); }, next: 'lind_room' },
      { label: 'Pelkkä huone, toistaiseksi.', time: 6, do: (G) => G.note('Sanot hänelle, että mietit asiaa. Sinulla ei ole aavistustakaan, miksi sanoit niin. Hän nyökkää kuin olisi kuullut sen ennenkin, palaa pokkariinsa ja sanoo, katsettaan nostamatta, että hän on täällä koko yön.'), next: 'lind_room' },
    ],
  };

  scenes.lind_room = {
    art: 'street',
    loc: 'Hótel Lind · Huone 7',
    enter: (G) => {
      G.flag('loc_lind_room');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('lind_knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('lind_sleep'); return; }
      if (G.once('lind_room_intro')) G.note(p(G.last(), 'Yhden hengen sänky vinokaton alla, patteri, vedenkeitin, ikkuna kadulle. Katu, jolla on lyhty ja pysäköity auto ja, sinun katsoessasi, kotiin kävelevä ihminen. Seisot ikkunan ääressä pidempään kuin oli tarkoitus. Se on koko yön ensimmäinen ikkuna, jonka takana on jotain.'));
    },
    text: (G) => p(lindStatus(G) + (!G.has('charger') && !G.has('lind_tp') ? ' Vastaanotto on kaksi kerrosta alempana. Hän käski kysyä.' : ''), G.last(), G.amb('lind_room', LIND_AMB.room)),
    choices: (G) => [
      { label: 'Kytke puhelin lataukseen.', if: (G) => G.has('charger') && G.dead(), time: 3, next: 'lind_charge' },
      { label: 'Pese hampaasi. Ihan oikeasti pese ne.', if: (G) => G.has('lind_tp') && !G.did('brush'), once: 'brush', time: 4, do: (G) => { G.nerves(-4); G.dread(-1); G.note('Hammastahnaa, joka kuului vieraalle ihmiselle Düsseldorfista. Harjaat kaksi täyttä minuuttia ja katsot sillä aikaa itseäsi peilistä, ja kahden minuutin ajan olet ihminen, joka on huomenna menossa jonnekin.'); }, next: 'lind_room' },
      { label: 'Syö leipä ja skyr, jotka hän jätti tarjottimelle.', if: (G) => G.has('lind_food') && !G.has('lind_ate'), time: 8, do: (G) => { G.flag('lind_ate'); G.nerves(-8); G.note('Leipää, voita, purkki skyriä, jonka päiväyksen kanssa voi elää. Syöt sängyn reunalla tarjotin polvillasi. Se on paras ateriasi kahteenkymmeneen tuntiin, eikä kukaan järjestänyt sitä.'); }, next: 'lind_room' },
      { label: 'Käy suihkussa. Pue samat vaatteet takaisin päälle.', whyNot: 'Et pysyisi paikallasi sen alla.', nerveMax: 95, time: 20, once: 'lind_shower', do: (G) => { G.nerves(-6); G.dread(-3); G.note('Kuumaa vettä, joka tuoksuu hennosti munalta eikä lopu kesken. Seisot siinä, kunnes olet ihminen, ja sitten puet lentokoneen takaisin päällesi.'); }, next: 'lind_room' },
      { label: 'Keitä teetä vedenkeittimellä.', whyNot: 'Kätesi läikyttäisivät sen.', nerveMax: 90, time: 8, once: 'lind_tea', do: (G) => { G.nerves(-5); G.dread(-2); G.note('Teetä, ja siihen oikeaa maitoa yhteisen jääkaapin kannusta, johon joku on kirjoittanut nimen ja hymynaaman. Pitelet kuppia molemmin käsin. Se on ensimmäinen lämmin asia, joka ei ole ollut valhetta.'); }, next: 'lind_room' },
      { label: 'Katso ikkunasta kadulle.', whyNot: 'Tiedät nyt, mitä siellä on.', dd: 2, dreadMax: 85, time: 3, do: (G) => { const d = G.D, n = G.count('lwin'); G.dread(2); G.nerves(d >= 4 ? 6 : 1); if (d >= 4) G.flag('looked_lind'); G.note(d >= 5 ? 'Bussi on nyt kadulla, täyttää sen, peilit kämmenen päässä seinistä kummallakin puolella. Sisävalot palavat. Kaikki sisällä istuvat kasvot majataloon päin, selkä suorana, liikkumatta. Ja oven vieressä, kädet ristissä, tummansiniseen pukeutunut mies, joka katsoo ylös yhteen ikkunaan. Päästät irti verhosta.' : d >= 4 ? 'Vastapäisen lyhdyn alla tummansiniseen univormuun pukeutunut mies, hyvin suorassa, kädet ristissä. Hän ei katso majataloa. Hän katsoo ikkunaa kahden ikkunan päässä sinun ikkunastasi. Sitten yhden päässä.' : n === 1 ? 'Katu. Lyhty. Kissa muurilla, tekemättä mitään, suurenmoisesti. Voisit itkeä sen kissan takia.' : 'Katu. Lyhty. Auto ajaa hitaasti ohi, katolla valo, eikä pysähdy. On hiljaisempaa kuin äsken.'); }, next: 'lind_room' },
      { label: 'Kuuntele rakennusta.', whyNot: 'Et halua tietää.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(2); G.note(G.pick(d >= 4 ? ['Askelia portaissa. Tasaisia. Kärsivällisiä. Ne pysähtyvät sinun kerroksesi alapuoliselle tasanteelle ja jäävät sinne.', 'Ulko-ovi, kaksi kerrosta alempana, se, jonka hän lukitsi keskiyöllä, avautuu.', 'Koputusta. Ei täällä. Viereisessä talossa. Sitten tässä, alakerrassa. Sitten lähempänä.'] : ['Kuorsausta yhden seinän takaa. Hana toisen. Rakennus täynnä ihmisiä, jotka ovat huomenna menossa jonnekin.', 'Vedenkeitin keittiössä kaksi kerrosta alempana, ja joku hyräilee sille.', 'Ei mitään. Patteri. Nukkuva kaupunki, mikä on sekin ääni.'])); }, next: 'lind_room' },
      { label: 'Yritä nukkua.', whyNot: 'Et pysty makaamaan paikallasi.', nerveMax: 80, time: 25, do: (G) => { if (G.t + 25 >= T(1, 4, 5)) { G.S.t = Math.max(G.t, KNOCK_AT - 25); G.nerves(-2); G.dread(-1); G.note('Käyt makuulle lentokonevaatteissasi, valo päällä. Katto viettää sinua kohti. Olet melkein, melkein—'); } else { G.nerves(-4); G.dread(-3); G.note(G.pick(['Käyt makuulle. Kunnon sänky, kunnon hiljaisuus. Kehosi ei usko mitään siitä ja makaa siinä jännittyneenä.', 'Silmät kiinni. Auto alhaalla, hidastaa, ei pysähdy. Nouset taas istumaan.', 'Ryömit peiton alle vaatteet päällä. Jossain vedenkeitin. Uni katselee sinua kadulta eikä tule sisään.'])); } }, next: 'lind_room' },
      { label: (!G.has('charger') || !G.has('lind_tp') || !G.has('lind_food')) ? 'Mene alas vastaanottoon. Pyydä tavaroita.' : 'Mene alas vastaanottoon.', time: 2, next: 'lind_lobby' },
    ],
  };

  scenes.lind_lobby = {
    art: 'guesthouse',
    loc: 'Hótel Lind · Vastaanotto',
    enter: (G) => {
      G.flag('loc_lind_lobby');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('lind_lobby_knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('lind_sleep'); return; }
      if (G.once('lind_lobby_intro')) G.note(p(G.last(), G.has('charger') ? 'Virkailija, pokkari, oven takana keittiö, jossa palaa valo. Johtolaatikko on taas kiinni, ja taskussasi oleva johto on ainoa omistamasi asia, joka on annettu sinulle tänä yönä.' : 'Virkailija, pokkari, oven takana keittiö, jossa palaa valo, laatikko, jonka hän avaa pyytämättä. Se on täynnä johtoja. Kymmeniä. Kaikenlaisia. Niitä ovat jättäneet kaikki vieraat, jotka ovat ikinä yöpyneet täällä ja menneet kotiin.'));
    },
    text: (G) => p(`Vastaanotto. ${G.clock(G.t)}. Virkailija on yhä hereillä. Ulko-ovi on lukossa.`, G.last(), G.amb('lind_lobby', LIND_AMB.lobby)),
    choices: (G) => [
      { label: 'Kysy, puhuuko hän ranskaa.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 4, do: (G) => { G.flag('fr_asked'); G.nerves(-2); G.note(LX('“A little. Toothpaste, charger, kitchen. Sleep.”') + ' Hän sanoi sen hitaasti, naputtaen ne yksi kerrallaan pokkarin kanteen.'); }, next: 'lind_lobby' },
      { label: 'Pyydä hammastahnaa.', time: 4, once: 'lind_desk_tp', do: (G) => { G.flag('lind_tp'); G.nerves(-3); G.note('Hän kurottaa tiskin alle ja nostaa esiin tuubin, puoliksi käytetyn, vieraalta, joka lähti kiireessä. ' + V(LX('“Düsseldorf,”')) + ' hän sanoo, alkuperätietona. On myös hammasharja, yhä pakkauksessaan.'); }, next: 'lind_lobby' },
      { label: 'Pyydä laturia.', time: 4, once: 'lind_desk_ch', do: (G) => { G.flag('charger'); G.nerves(-2); G.dread(2); G.note('Laatikko. Hän penkoo sitä ja kokeilee johtoja puhelimeesi yksi kerrallaan kuin avaimia. Neljäs sopii. ' + V(LX('“Keep it. Everybody leaves them.”')) + ' Pitelet sitä hetken ennen kuin panet sen taskuusi, kuin se olisi päätös.'); }, next: 'lind_lobby' },
      { label: 'Kysy, olisiko jotain syötävää.', time: 5, once: 'lind_desk_food', do: (G) => { G.flag('lind_food'); G.nerves(-2); G.note('Hän menee keittiöön ja palaa tarjottimen kanssa: leipää, voita, purkki skyriä. ' + V(LX('“Take it up. Breakfast is at seven. Proper breakfast.”')) + ' Kukaan ei ole vuorokauteen puhunut sinulle mistään kunnollisesta.'); }, next: 'lind_lobby' },
      { label: 'Kysy, miten lentoasemalle pääsee takaisin.', dd: -3, time: 6, once: 'lind_desk_bus', do: (G) => { G.flag('know_flybus'); G.nerves(-3); G.msg('paper', { from: 'Vastaanotto, Hótel Lind', subj: 'Flybus-kortti', body: '<b>FLYBUS → KEF AIRPORT</b>\n\nFrom BSÍ terminal (10 min walk)\n\n06:00 · 07:00 · 08:00 · 09:00 · 10:00 · every hour\n\n<b>TICKET REQUIRED</b> — buy at the kiosk or online\n\n45 minutes.' }); G.note('Hän ei viittaa Islannin suuntaan. Hän kirjoittaa sen kortille: ' + V(LX('“Flybus. From BSÍ, where you came from. Ten minutes. Every hour from six. Buy the ticket first; the driver will not take you without one.”')) + ' Hän katsoo sinua. ' + V(LX('“Not the other one. The yellow one.”')) + ' Et kysynyt mistään toisesta.'); }, next: 'lind_lobby' },
      { label: 'Kysy, onko kukaan kysynyt sinua.', kind: 'comply', dd: 3, time: 4, do: (G) => { const n = G.count('lind_asked'); G.dread(1); G.note(G.t >= KNOCK_AT ? V(LX('“A man in a uniform. I told him we had nobody of that name. He said he would wait.”')) + ' Hän katsoo ovea. ' + V(LX('“I locked it.”')) : n === 1 ? V(LX('“Nobody. Nobody knows you are here.”')) + ' Hän sanoo sen lohdutukseksi, ja sitä se onkin, noin sekunnin ajan.' : V(LX('“Still nobody,”')) + ' hän sanoo, ennen kuin olet lopettanut, eikä nosta katsettaan, ja sitten nostaa.'); }, next: 'lind_lobby' },
      { label: 'Istu keittiössä sen seurassa, joka sattuu olemaan hereillä.', whyNot: 'Ärähtäisit vieraalle ihmiselle.', nd: -4, dd: -2, nerveMax: 85, time: 10, once: 'lind_kitchen', do: (G) => { G.nerves(-3); G.dread(G.D >= 3 ? 3 : -1); G.note(G.D >= 3 ? 'Puhtaaseen paitaan pukeutunut mies syömässä paahtoleipää kello kolme yöllä kuin se olisi järkevä kellonaika. ' + V('"Albion?"') + ' hän sanoo pirteästi. ' + V('"Tiistain. Me odotetaan kuljetusta. Se on vahvistettu."') + ' Hän näyttää sinulle puhelintaan. ' + ALLY(G) + ' on vahvistanut sen. Se vahvistaa sen joka aamu.' : 'Kaksi reppureissaajaa suunnittelemassa jäätikköä. He antavat sinulle keksin ja kysyvät lennosta ja sanovat ' + V('"ihan hullua"') + ' jokaisella oikealla hetkellä. Kymmenen minuutin ajan tunnet olevasi tarina, jota joku toinen kertoo.'); }, next: 'lind_lobby' },
      { label: 'Pyydä häntä soittamaan Gunnarille. Mene sittenkin siihen toiseen hotelliin. Siihen oikeaan.', kind: 'comply', dd: 4, sub: 'Neljäkymmentä minuuttia. Taas se maksu.', if: (G) => G.t < T(1, 5, 30), time: 6, do: (G) => G.note(V(LX('“Hraun? You are sure?”')) + ' Hän soittaa silti, sanoo huoneesi numeron puhelimeen kuin salasanan, palaa pokkariinsa eikä katso sinua enää ennen kuin ajovalot näkyvät.'), next: 'lind_taxi_back' },
      { label: 'Pyydä häntä avaamaan ovi. Käy haukkaamassa happea.', whyNot: 'Ei sinne kadulle.', dreadMax: 85, dd: -2, time: 3, do: (G) => G.note('Hän avaa oven sanaakaan sanomatta ja lukitsee sen uudelleen perässäsi, ja jää seisomaan lasin taakse pokkari kädessä, katsomaan, niin kuin katsotaan lasta puutarhassa.'), next: 'lind_street' },
      { label: 'Takaisin ylös huoneeseen 7.', time: 2, next: 'lind_room' },
    ],
  };

  /* ---- the street outside Lind (hub) ---- */
  scenes.lind_street = {
    art: 'street',
    loc: 'Laugavegur · Hótel Lindin edustalla',
    enter: (G) => {
      G.dread(1);
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.flag('from_street'); G.go('lind_lobby_knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('lind_sleep'); return; }
      if (G.once('lind_street_intro')) G.note(p(G.last(), 'Katu. Kylmä, mutta kaupungin kylmä, jossa on seiniä. Suljettuja baareja, leipomo, jonka valot ovat sammuksissa ja tuoksu yhä tallella, lyhty, pysäköityjä autoja kuurassa. Ei ketään. Sitten, kadun päässä, joku, kävelemässä toiseen suuntaan, kiireettä, ja jossain on ovi, joka on hänen omansa.'));
    },
    text: (G) => p(`Katu. ${G.clock(G.t)}. Ovi takanasi on lukossa, ja hän on sen takana.` + (G.has('lind_car') ? (G.readMsg('car') ? ' Kadunreunassa, moottori käynnissä, musta auto, jonka ovessa on pieni kultainen vaakuna, se sähköpostin auto.' : ' Kadunreunassa, moottori käynnissä, musta auto, jonka ovessa on pieni kultainen vaakuna. Kukaan ei ole kertonut sinulle, mitä varten se on. Tai joku on, etkä sinä ole lukenut sitä.') : ''), G.last(), G.amb('lind_street', LIND_AMB.street)),
    choices: (G) => [
      { label: 'Kävele kulmaan. Katso mäkeä alas.', whyNot: 'Jalkasi eivät suostu.', nd: 3, dreadMax: 90, time: 6, do: (G) => { const d = G.D; G.dread(d >= 4 ? 3 : 1); G.nerves(d >= 4 ? 5 : 2); if (d >= 4) G.flag('coach_seen_street'); G.note(d >= 5 ? 'Mäen alla, missä katu levenee sataman suuntaan, bussi on pysäköity sen pään poikki, tummansininen, kultainen vaakuna, kaikki sisävalot palamassa. Sen ohi ei pääse muuten kuin sen läpi. Mies sen ovella, kädet ristissä, katsoo mäkeä ylös, sinua, kuin olisit myöhässä.' : d >= 4 ? 'Mäen alla, missä katu levenee, jotain pitkää ja tummaa moottori käynnissä, ja sen kyljessä lämpimän valon kaistale, joka on ikkunoita. Se on liian iso kadulle. Se on kadulla silti.' : 'Mäen alla katu avautuu satamaa kohti, ja satama on tummempaa pimeää, jonka toisella puolella palaa valoja. Taksi ajaa mäen alapään poikki kyltti valaistuna, menossa jonnekin muualle.'); }, next: 'lind_street' },
      { label: 'Kävele alas sen luo.', kind: 'comply', if: (G) => G.has('coach_seen_street'), do: (G) => { G.flag('nc_lind'); G.flag('nc_street'); G.end('nightcoach'); } },
      { label: 'Auto kadunreunassa. Se sähköpostin auto. Nouse kyytiin.', kind: 'comply', if: (G) => G.has('lind_car') && G.readMsg('car'), sub: 'Sen tabletissa on sinun nimesi.', do: (G) => G.end('accommodated') },
      { label: 'Katso ylös ikkunaasi.', time: 3, do: (G) => { G.dread(1); G.nerves(1); G.note(G.D >= 4 ? 'Toinen kerros, se pieni vinokaton alla. Valo palaa. Jätit sen palamaan. Verho on auki. Et jättänyt sitä auki.' : 'Toinen kerros, se pieni vinokaton alla. Valo palaa. Täältä alhaalta se näyttää huoneelta, jossa joku on turvassa.'); }, next: 'lind_street' },
      { label: 'Seiso lyhdyn alla ja hengitä.', nd: -3, dd: 1, time: 5, once: 'lind_breathe', do: (G) => { G.nerves(-4); G.dread(1); G.note('Kylmää ilmaa, kunnolla kylmää, ja taivas, jolla on yksi tähti, joka on luultavasti lentokone. Minuutin ajan olet ihminen, joka seisoo kadulla kaupungissa, eikä mikään odota sinua missään.'); }, next: 'lind_street' },
      { label: 'Koputa lasiin. Mene takaisin sisään.', time: 2, next: 'lind_lobby' },
    ],
  };

  scenes.lind_charge = {
    art: 'phone',
    loc: (G) => `Hótel Lind · Huone 7 · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('charged'); G.flag('lind_car'); if (G.once('flood')) lindFlood(G); G.S.floodN = G.charge(100); },
    text: (G) => p(
      'Johto. Pistorasia sängyn vieressä. Pieni salama, ja näyttö, joka syttyy harmaana, ja kello, joka on kulkenut ilman sinua.',
      'Sitten se alkaa. Värähdys, ja värähdys, ja värähdys, ja näyttö täyttyy ylhäältä alas kaikesta, minkä he lähettivät, kun olit pimeänä: sähköposti, tekstiviesti, chat, sähköposti, sähköposti, tekstiviesti, punaisessa ympyrässä nouseva luku kuin kuume. Se ei lakkaa. Lasket puhelimen sängylle, ja se liikkuu peittoa pitkin, väristen, muutaman millimetrin kerrallaan, sinua kohti.',
      `${G.S.floodN || 0} ilmoitusta. Viimeisin on neljän minuutin takaa. Siinä sanotaan, että he tietävät, missä huoneessa olet.`,
    ),
    choices: [
      { label: 'Lue ne. Kaikki.', kind: 'comply', dd: 2, time: 10, do: (G) => { G.openPhone('email'); G.note('Luet ne. Kaikki.'); }, next: 'lind_room' },
      { label: 'Käännä se näyttö alaspäin. Anna sen latautua. Älä lue niitä.', whyNot: 'Et pysty olemaan katsomatta.', dreadMax: 80, nd: 4, time: 5, do: (G) => { G.note('Lasket sen näyttö alaspäin lattialle pistorasian viereen, missä se jatkaa värinäänsä, vaimeasti, kuin jokin tyynyn alla.'); }, next: 'lind_room' },
      { label: 'Vedä johto irti. Anna sen olla kuollut.', whyNot: 'Siinä on nyt sinun nimesi.', dreadMax: 70, instr: 'located', dd: -4, time: 2, do: (G) => { G.S.phoneDead = true; G.S.batt = 0; G.flag('unplugged'); G.nerves(5); G.note('Vedät johdon irti. Näyttö pysyy sekunnin, punainen luku siinä, ja sammuu. Sen jälkeinen hiljaisuus on huoneen paras asia, etkä luota siihen.'); }, next: 'lind_room' },
    ],
  };

  scenes.lind_car = {
    art: 'street',
    loc: 'Laugavegur · Hótel Lindin edustalla',
    text: (G) => p(
      'Virkailija avaa sinulle oven sanaakaan sanomatta. Kadunreunassa, missä ei ollut mitään, on auto: musta, pitkä, tahraton, ovessa pieni kultainen vaakuna, moottori käynnissä, pakokaasu seisoo pakkasessa kuin hengitys. Kuljettaja pitelee tablettia, jossa lukee nimesi – oikein kirjoitettuna.',
      V('"Hótel Hrauniin?"'),
      'Hän avaa takaoven. Lämmintä ilmaa. Nahkaa. Takanasi, lasin takana, virkailija seisoo pokkari rintaa vasten ja pudistaa päätään, hitaasti, kerran.',
    ),
    choices: [
      { label: 'Nouse kyytiin. Se on, loppujen lopuksi, se oikea hotelli.', kind: 'comply', sub: 'Lämmintä.', do: (G) => G.end('accommodated') },
      { label: 'Ei. Ei kiitos.', whyNot: 'Hänellä on nimesi.', dd: 5, dreadMax: 85, time: 4, do: (G) => { G.nerves(5); G.dread(8); G.note('Kuljettaja ei vaikuttanut yllättyneeltä. Hän sulki oven, jäi paikoilleen ja oli siinä yhä, kun virkailija lukitsi oven perässäsi ja käänsi avainta kahdesti.'); }, next: 'lind_lobby' },
    ],
  };

  scenes.lind_taxi_back = {
    art: 'road',
    loc: 'Gunnarin taksi · Tie 41 · kaupungista ulos',
    enter: (G) => { G.flag('left_lind'); G.flag('lind', false); G.S.t = Math.max(G.t + 40, T(1, 4, 10)); G.dread(6); G.nerves(4); },
    text: (G) => p(
      'Gunnar, taas, radio hiljaisella. Hän ei kysy miksi. ' + V(LX('“Hraun. Yes. Everyone goes in the end.”')) + ' Hän ei kuulosta siltä, että hyväksyisi. Hän ajaa silti.',
      'Kaupunki loppuu. Laavaa matalan taivaan alla, tie, jonka yksi valkoinen viiva katoaa aina uudelleen. Kahdesti takaa nousee ajovaloja, jotka jäävät sinne, täsmälleen tarpeeksi kauas, ja sitten ne ovat poissa, ja se on pahempaa.',
      'Matalan, leveän, akvaarion lailla valaistun hotellin pihassa hän veloittaa maksun kortilta ja sanoo ' + V(LX('“Good luck,”')) + ' ja odottaa, valot päällä, kunnes olet sisällä.',
    ),
    choices: [{ label: 'Mene sisään.', time: 3, next: 'hotel_arrive' }],
  };

  scenes.lind_knock = {
    art: 'street',
    loc: (G) => `Hótel Lind · Huone 7 · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); },
    text: (G) => p(
      G.last(),
      'Joku koputtaa. Kaksi kerrosta ylhäällä lukitussa talossa, sellaisen huoneen oveen, johon kukaan ei varannut sinua. Tasaisesti, niin kuin koputtaa ihminen, joka aikoo koputtaa koko yön.',
      V('"Transfer sinun accommodation. Albion Atlantic. Lähtevä nyt."'),
      'Ääni on kärsivällinen. Ääni tietää huoneen numeron. Ääni sanoo sen, siltä varalta, että olisit unohtanut: ' + V('"Seitsemän."'),
    ),
    choices: (G) => [
      { label: 'Avaa ovi.', kind: 'comply', sub: 'Se on, loppujen lopuksi, sinun kuljetuksesi.', do: (G) => { G.flag('nc_lind'); G.end('nightcoach'); } },
      { label: G.counted('lind_asked') ? 'Älä. Hän sanoi, ettei kukaan ollut kysynyt sinua.' : 'Älä. Kukaan ei varannut sinua tähän huoneeseen.', whyNot: 'Et voi olla vastaamatta. He käskivät olla valmiina.', nd: 5, dreadMax: 80, instr: 'knock_notice', time: 20, do: (G) => { G.nerves(5); G.note('Istuit sängyllä selkä seinää vasten ja laskit. Viidenkymmenen jälkeen menetit laskun. Kun se lakkasi, kukaan ei kuulunut laskeutuvan portaita.'); }, next: 'lind_window' },
      { label: 'Katso ovisilmästä.', dd: 6, nd: 6, time: 2, do: (G) => { G.nerves(9); G.flag('spyhole'); G.note('Tasanne on tyhjä. Lankut ovesi edessä ovat tummat, kuin märät. Koputus jatkuu, tasaisena, eikä tule mistään erityisestä suunnasta.'); }, next: 'lind_knock2' },
      { label: 'Nosta huoneen puhelimen luuri. Kysy häneltä, kenet hän päästi sisään.', whyNot: 'Kätesi ei pysyisi luurissa.', nd: 4, nerveMax: 85, time: 4, do: (G) => { G.nerves(4); G.dread(4); G.note('Se soi kerran. ' + V(LX('“Seven? Yes. Nobody. I locked the door at midnight, I have been sitting here, nobody has come in.”')) + ' Tauko, jonka aikana kuulette molemmat koputuksen, puhelimen läpi ja oven läpi. ' + V(LX('“Don\'t open it. I am coming up.”')) + ' Kuulet hänet portaissa. Koputus ei lakkaa hänen vuokseen. Sitten se lakkaa, ja hän on ovesi takana, yksin, sanomassa hiljaa huoneesi numeroa, eikä tasanteella ole ketään muuta.'); }, next: 'lind_window' },
    ],
  };

  scenes.lind_knock2 = {
    art: 'street',
    loc: (G) => `Hótel Lind · Huone 7 · ${G.clock(G.t)}`,
    text: (G) => p(G.last(), 'Tasaista. Kärsivällistä. Ei ketään.'),
    choices: [
      { label: 'Avaa ovi silti.', kind: 'comply', do: (G) => { G.flag('nc_lind'); G.end('nightcoach'); } },
      { label: 'Peräänny ovelta. Istu sängylle. Odota, että se loppuu.', whyNot: 'Kätesi on jo säpissä.', dreadMax: 88, time: 25, do: (G) => { G.nerves(3); G.note('Lopulta se lakkasi, niin kuin sade lakkaa: et huomannut viimeistä koputusta. Kukaan ei kuulunut laskeutuvan portaita.'); }, next: 'lind_window' },
    ],
  };

  scenes.lind_lobby_knock = {
    art: 'guesthouse',
    loc: (G) => `Hótel Lind · Vastaanotto · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); G.nerves(6); },
    text: (G) => p(
      G.last(),
      G.has('from_street') ? 'Koputat lasiin, ja hän päästää sinut sisään ja kääntää avainta perässäsi, ja silloin se alkaa. Yläkerrassa. Kaksi kerrosta ylempänä. Koputusta, tasaista ja kärsivällistä, oveen, ja virkailija katsoo kattoon, ja sitten oveen, jonka juuri lukitsi, ja sitten sinuun.' : 'Olet vastaanotossa, kun se alkaa. Yläkerrassa. Kaksi kerrosta ylempänä. Koputusta, tasaista ja kärsivällistä, oveen, ja virkailija katsoo kattoon, ja sitten ulko-oveen, joka on lukossa, ja sitten sinuun.',
      V(LX('“That is seven,”')) + ' hän sanoo. ' + V(LX('“Nobody came in.”')),
      'Portaiden yläpäästä, porraskäytävää pitkin kantautuen, miellyttävään sävyyn: ' + V('"Transfer sinun accommodation. Lähtevä nyt."'),
    ),
    choices: [
      { label: 'Mene ylös. Olet Albion Atlanticin matkustaja.', kind: 'comply', do: (G) => { G.flag('nc_lind'); G.end('nightcoach'); } },
      { label: 'Jää tänne alas. Hänen kanssaan. Valot päällä.', whyNot: 'Et pysty liikkumaan.', dd: 5, dreadMax: 92, time: 20, do: (G) => { G.nerves(4); G.dread(5); G.flag('hid_lobby'); G.note('Istuit portailla selkä seinää vasten, ja hän istui tiskin takana, eikä kumpikaan teistä sanonut mitään, ja hetken päästä koputus lakkasi, eikä kukaan tullut alas.'); }, next: 'lind_window' },
    ],
  };

  scenes.lind_window = {
    art: 'street',
    loc: (G) => `Hótel Lind · Huone 7 · ${G.clock(G.t)}`,
    enter: (G) => { G.S.t = Math.max(G.t, T(1, 4, 50)); if (!G.dead()) G.bot('Hei! Minä näen että sinä olet huone 7. Sinun transfer odottaa kadussa. Ole hyvä älä katso ulos ikkunasta. 🙂', 2, 'nolook'); },
    text: (G) => p(
      G.last(),
      G.has('hid_lobby') ? 'Menit lopulta takaisin ylös. Tasanne oli tyhjä. Koputus on lakannut.' : 'Koputus on lakannut.',
      G.dead() ? 'Puhelin on pimeänä lattialla pistorasian vieressä, ja se on melkein pahempaa: mitä ikinä he sanovat, he sanovat sen ei kenellekään.' : 'Puhelimesi valaisee vinokattoa. ' + ALLY_MSG(G) + ' ' + (G.readMsg('nolook') ? W('Olet lukenut sen. Siinä kiellettiin katsomasta ulos ikkunasta.') : W('Et ole lukenut sitä.')),
      'Verho on ohut. Sen läpi tulee valoa alhaalta, ja valo liikkuu hieman, niin kuin käyvän moottorin valo liikkuu, kadulla, joka on liian kapea sille, mikä sitä käyttää.',
    ),
    choices: [
      { label: 'Katso.', whyNot: 'He kielsivät.', dd: 10, nd: 8, dreadMax: 90, instr: 'nolook', sub: 'Ihan vähän vain.', time: 5, do: (G) => { G.flag('seen'); G.flag('seen_lind'); G.flag('looked_out'); G.nerves(14); atLeast(G, 78); }, next: 'lind_window2' },
      { label: 'Älä. Vedä peitto pään yli.', kind: 'comply', dd: 6, time: 5, do: (G) => G.nerves(2), next: 'lind_sleep' },
    ],
  };

  scenes.lind_window2 = {
    art: 'street',
    loc: (G) => `Hótel Lind · Huone 7 · ${G.clock(G.t)}`,
    text: p(
      'Bussi, tummansininen, kultainen vaakuna, täyttää kadun seinästä seinään, peilit kämmenen päässä seinistä kummallakin puolella. Moottori käy. Kaikki sisävalot palavat. Se on täynnä, ja kaikki istuvat selkä suorana, ja jokainen on kääntynyt majataloon päin.',
      'Bussin ovella seisoo mies purserin univormussa. Sinun katsoessasi hän nostaa katseensa – ei rakennukseen. Sinun ikkunaasi. Vastapäisen lyhdyn alla virkailijan pokkari makaa jalkakäytävällä avoinna, kansi ylöspäin, eikä virkailija ole siellä.',
      'Hän ei vilkuta. Ei tarvitse. Hän on, ymmärrät, pannut asian merkille.',
    ),
    choices: [{ label: 'Päästä irti verhosta.', time: 5, next: 'lind_sleep' }],
  };

  scenes.lind_sleep = {
    art: 'guesthouse',
    loc: 'Hótel Lind · Aamiaishuone',
    enter: (G) => {
      G.S.t = T(1, 7, 30); G.flag('morning');
      G.S.dread = Math.max(20, G.S.dread - 25);
      G.nerves(G.has('allnighter') ? 6 : -10);
      if (G.has('lind_tp')) G.nerves(-4);
      if (G.dead()) { G.flag('lind_morning_cable'); if (G.once('flood')) lindFlood(G); G.charge(100); }
      G.at(T(1, 7, 35), 'sms', { from: 'Jo 💛', body: 'HERRANJUMALA OOTKO SÄ ISLANNISSA?? sun on pakko käydä blue lagoonissa. PAKKO. se on tyyliin 20 min kentältä' });
      G.at(T(1, 8, 5), 'chat', { body: 'Hyvää huomenta! Sinun transfer Hótel Lind lentokentälle on vahvistettu 09:00. Ole hyvä odota lobbyssa. 🚌', dd: 1, key: 'morning_chat' });
      G.at(T(1, 9, 40), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Sinun transfer lentokentälle', stamp: T(1, 9, 40), key: 'morning_mail', body: 'Rakas Asiakas,\n\nBussit keräävät sinut sinun accommodation 09:00 sinun uudelleen bookattu lento AB 0271 varten.\n\nOle hyvä ole valmis lobbyssa 08:45.\n\nMe teemme meidän parasta.', dd: 2 });
      G.at(T(1, 9, 55), 'chat', { body: 'Sinun transfer on täällä. Se on se kiva yksi. 🚌', dd: 1 });
    },
    text: (G) => p(
      G.has('allnighter') ? 'Harmaata valoa. 07:30. Et nukkunut, ja olet yhä Islannissa, majatalossa, jota lentoyhtiö ei koskaan varannut.' : 'Harmaata valoa. 07:30. Nukuit, tai jotain sinne päin, sängyssä, jota kukaan ei järjestänyt, ja olet yhä Islannissa.',
      'Aamiaiseksi on leipää, skyriä, munia ja kahvia, jonka joku on tarkoittanut. Kaksi reppureissaajaa suunnittelee jäätikköä. Ja ikkunan vieressä pitkässä pöydässä kahdeksan hengen seurue puhtaissa paidoissa ja puhtaissa sukissa, katsomassa puhelimiaan, nyökkäilemässä niille.',
      V('"Albion?"') + ' sanoo yksi heistä iloisesti nähdessään vaatteesi. ' + V('"Tiistain. Ja nuo kaksi on torstain. Me odotetaan kuljetusta. Se on vahvistettu."') + ' Hän kääntää puhelimensa sinuun päin. ' + ALLY(G) + ' on vahvistanut sen. Se on vahvistanut sen joka aamu. Kukaan pöydässä ei ole katsonut lähtevien lentojen taulua.',
      G.has('lind_morning_cable') && (G.has('charger') ? 'Kytket puhelimen leivänpaahtimen viereiseen pistorasiaan, koska on aamu ja koska on pakko. Se palaa henkiin, ja ensimmäiseksi se kertoo sinulle kaiken, mistä jäit paitsi.' : 'Virkailija laskee pyytämättä johdon pöydälle lautasesi viereen. Puhelin palaa henkiin, ja ensimmäiseksi se kertoo sinulle kaiken, mistä jäit paitsi.'),
    ),
    choices: [{ label: 'Hae silti kahvi.', time: 10, next: 'lind_morning' }],
  };

  scenes.lind_morning = {
    art: 'guesthouse',
    loc: 'Hótel Lind · Aamiaishuone',
    enter: (G) => {
      if (G.t >= T(1, 10, 15) && !G.has('lind_decoy')) { G.go('lind_decoy'); return; }
      if (G.once('lind_morn_intro')) G.note(p(G.last(), 'Albionin pöydällä on rytmi: puhelin, nyökkäys, kahvi, puhelin. Kenelläkään ei ole laukkua. Kenelläkään ei ole suunnitelmaa kuljetuksen jälkeen. Virkailija täyttää skyrkulhon niin kuin ruokkisi jotain, jonka on päättänyt pitää.'));
    },
    text: (G) => p(
      `Aamiaishuone. ${G.clock(G.t)}. ${G.readMsg('morning_mail') ? 'Sähköpostissa luki 09:00, ja se tuli perille 09:40. ' : G.readMsg('morning_chat') ? 'Chattibotti lupasi kuljetuksen kello 09:00 hotellista, jota se ei koskaan varannut. ' : ''}${G.has('know_flybus') ? 'Kortissa lukee, että Flybus lähtee BSÍ:ltä joka tunti.' : 'Kukaan täällä ei ole maininnut bussia.'}`,
      G.last(), G.amb('lind_morning', LIND_AMB.morning)),
    choices: (G) => [
      { label: 'Kysy vastaanotosta, miten lentoasemalle pääsee takaisin.', dd: -3, time: 6, if: (G) => !G.has('know_flybus'), do: (G) => { G.flag('know_flybus'); G.nerves(-3); G.msg('paper', { from: 'Vastaanotto, Hótel Lind', subj: 'Flybus-kortti', body: '<b>FLYBUS → KEF AIRPORT</b>\n\nFrom BSÍ terminal (10 min walk)\n\n06:00 · 07:00 · 08:00 · 09:00 · 10:00 · every hour\n\n<b>TICKET REQUIRED</b> — buy at the kiosk or online\n\n45 minutes.' }); G.note('Hän kirjoittaa sen kortille. ' + V(LX('“Flybus. From BSÍ, where you came from. Ten minutes. Every hour. Buy the ticket first.”')) + ' Hän vilkaisee pitkää pöytää. ' + V(LX('“The yellow one. Not the other one.”'))); }, next: 'lind_morning' },
      { label: 'Juttele tiistain matkustajien kanssa.', whyNot: 'Aloittaisit riidan.', nd: -3, dd: 2, nerveMax: 85, time: 12, once: 'lind_tuesday', do: (G) => { G.nerves(-2); G.dread(3); G.note('He ovat ihastuttavia. He ovat levänneitä. He ovat olleet levänneitä tiistaista asti. ' + V('"Se on vahvistettu yhdeksäksi",') + ' sanoo nainen, jolla on hyvin puhdas kaulus. ' + V('"Eilen se oli vahvistettu yhdeksäksi. Lentoyhtiö tekee parhaansa."') + ' Kysyt, onko kukaan ajatellut ottaa ihan vain Flybusin. He katsovat sinua niin kuin ihmiset katsovat sellaista, joka on ehdottanut kävelemistä Amerikkaan.'); }, next: 'lind_morning' },
      { label: 'Mene takaisin ylös. Suihkuun. Pese edes kasvosi.', whyNot: 'Et pysyisi paikallasi sen alla.', nerveMax: 92, time: 25, once: 'lind_morn_shower', do: (G) => { G.nerves(-5); G.dread(-2); G.note('Kuumaa vettä. Samat vaatteet. Päivänvalossa huone on mukava huone mukavassa majatalossa, ja katu ulkona on katu, jolla on leipomo eikä mitään pysäköitynä, minkä ei pitäisi olla.'); }, next: 'lind_morning' },
      { label: 'Tarkista lennon tilanne lentoyhtiön sivuilta.', dd: 3, nd: 3, time: 8, if: (G) => !G.dead(), do: (G) => { const n = G.count('status'); G.dread(2); G.batt(-1); G.note(n === 1 ? 'AB 0271 · KEF → LAX · 15:10 · AIKATAULUSSA. Sen alla, pienemmin kirjaimin: KULJETUKSESI ON VAHVISTETTU.' : 'AB 0271 · 15:10 · AIKATAULUSSA. Sivu tietää, missä hotellissa olet. Eilen se ei tiennyt.'); }, next: 'lind_morning' },
      { label: 'Mene kuumille lähteille. Olet aina halunnut sinne.', sub: 'Lentoasemalle on kaksikymmentä minuuttia. Kaikki sanovat niin.', do: (G) => G.end('tantalus') },
      { label: (G.readMsg('morning_chat') || G.readMsg('morning_mail')) ? 'Odota aulassa kuljetusta. Se on vahvistettu.' : 'Odota aulassa muiden kanssa.', kind: 'comply', dd: 5, nd: 2, sub: 'Puoli tuntia tätä.', time: 30, do: (G) => { G.nerves(2); G.dread(3); G.note(G.pick(['Puoli tuntia. Albionin pöytä ei liikahda. Yksi heistä hakee kahvin ja palaa samalle tuolille, kuin se olisi hänelle osoitettu.', 'Puoli tuntia. Ulkona keltainen bussi ajaa kadun päässä ohi, eikä kukaan pitkässä pöydässä käännä päätään.', 'Puoli tuntia. Jokainen puhelin pitkässä pöydässä sanoo, yhtä aikaa, että kuljetus on tulossa, ja koko pöytä hymyilee yhtä aikaa.'])); }, next: 'lind_morning' },
      { label: 'Kävele BSÍ:lle. Kymmenen minuuttia. Osta lippu siihen keltaiseen.', if: (G) => G.has('know_flybus'), dd: -2, time: 12, next: 'lind_buses' },
      { label: 'Kävele takaisin linja-autoasemalle ja katso, mitä siellä on.', if: (G) => !G.has('know_flybus'), time: 12, next: 'lind_buses' },
    ],
  };

  scenes.lind_decoy = {
    art: 'street',
    loc: 'Hótel Lind · katu ulkona',
    enter: (G) => { G.flag('lind_decoy'); G.dread(4); },
    text: (G) => p(
      'Joku pitkässä pöydässä sanoo: ' + V('"Se on täällä."') + ' Kahdeksan ihmistä nousee yhtä aikaa seisomaan, kuin seurakunta.',
      'Ulkona: bussi, tummansininen, kultainen vaakuna, täyttää kadun seinästä seinään, LED-kyltissä TRANSFER · ALBION ATLANTIC · CONFIRMED. Purseri seisoo ovella kädet ristissä, ja kun hän näkee sinut, hän hymyilee kuin olisit täsmälleen ajoissa, mitä, ensimmäistä kertaa kahteen päivään, oletkin.',
      'Tiistain matkustajat kulkevat jonossa ohitsesi ja ylös portaita, ja istuutuvat, ja kääntyvät majataloon päin, ja ovat liikkumatta. Virkailija seisoo oviaukossa pokkari rintaa vasten. Hän ei vilkuta.',
    ),
    choices: [
      { label: 'Nouse kyytiin. Se on vahvistettu. Kaikki sanovat niin.', kind: 'comply', do: (G) => G.end('arrangements') },
      { label: 'Kävele toiseen suuntaan. Kohti BSÍ:tä. Älä katso taaksesi.', whyNot: 'Hän katsoo sinua.', dreadMax: 85, time: 12, do: (G) => { G.nerves(8); G.dread(4); G.note('Kävelit. Kukaan ei pysäyttänyt sinua. Takanasi bussi seisoi paikallaan ovi auki pitkään, ja sitten katu oli vain katu, ja sinä olit sillä, yksin, ja sinulla oli suunta.'); }, next: 'lind_buses' },
    ],
  };

  scenes.lind_buses = {
    art: 'bsi',
    loc: 'Reykjavík · BSÍ-linja-autoasema · aamu',
    enter: (G) => { G.flag('left_hotel'); G.dread(2); if (G.t < T(1, 8, 0)) G.S.t = T(1, 8, 0); },
    text: (G) => p(
      'BSÍ on päivänvalossa linja-autoasema: kioski, joka myy lippuja ja kanelia, taulu, joka toimii, reppureissaajia, jotka tietävät, minne ovat menossa. Voisit olla yksi heistä. Sinulla on lentokone päälläsi.',
      G.has('know_flybus') ? 'Kioski myy sinulle lipun ensimmäisellä yrittämällä. Kortti alkaa tottua tähän.' : 'Sinulla ei ole lippua. Et ole varma, mihin näistä sellainen tarvitaan.',
      'Ulkona: busseja. Yhdessäkään ei lue lentosi numeroa, paitsi siinä yhdessä, jossa lukee, kullalla.',
      G.has('know_flybus') && W(LX('“The yellow one. Not the other one.”')),
    ),
    buses: (G) => {
      const flybus = {
        key: 'city',
        art: { livery: '#cfae36', windows: 'dim', passengers: 'luggage', sign: 'print', driver: 'plain', ground: 'day' },
        name: 'Keltainen bussi paikallisliikenteen väreissä',
        sign: 'FLYBUS · KEF AIRPORT', signStyle: 'print',
        look: ['Kuljettaja, pitkästynyt, skannaa lippuja puhelimista.', 'Matkustajia reppuineen ja vetolaukkuineen, ja yksi ilman mitään, eilisessä paidassaan, joka nyökkää sinulle.'],
        hidden: ['Tarra oven vieressä: LIPPU PAKOLLINEN. Kuljettaja on tosissaan.', 'Kukaan kyydissä ei odota mitään. He ovat menossa lentoasemalle, mikä on koko idea.'],
        boardLabel: G.has('know_flybus') ? 'Nouse kyytiin' : 'Nouse kyytiin ilman lippua',
        board: { time: 10, do: (G) => { G.flag('bus2_ok'); if (!G.has('know_flybus')) { G.nerves(6); G.S.t += 20; G.note('Kuljettaja osoittaa kioskia katsettaan nostamatta. Ostat lipun. Juokset. Hän odottaa, hädin tuskin.'); } }, next: 'ride3' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'day' },
        name: 'Tummansininen bussi, jonka kyljessä on kultainen vaakuna, perimmäisellä laiturilla, kuin se ei olisi koskaan lähtenytkään',
        sign: 'AIRPORT TRANSFER · ALBION ATLANTIC', signStyle: 'led',
        look: ['Purseri ovella. Hän tietää, mikä ikkuna oli sinun.', 'Lämmin. Hiljainen. Paljon tilaa.'],
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
      return G.shuffle([flybus, crest, lagoon]);
    },
    choices: [
      { label: 'Odota seuraavaa. Aina tulee seuraava.', kind: 'comply', dd: 5, nd: 4, time: 60, next: (G) => (G.t >= T(1, 12, 30) ? 'end:noshow' : 'lind_buses'), do: (G) => { G.nerves(5); G.dread(4); } },
    ],
  };

  scenes.ride3 = {
    art: 'road',
    loc: 'Tie 41 · kohti Keflavíkia',
    enter: (G) => {
      G.at(T(1, 12, 0), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Revisioitu lähtö aika', body: 'Rakas Asiakas,\n\nSinun lento AB 0271 tulee nyt lähtemään 15:45.\n\nCheck-in avautuu kolme tuntia ennen lähtö.\n\nMe teemme meidän parasta.', fx: (G) => { G.S.dep = T(1, 15, 45); } });
      G.at(T(1, 13, 10), 'chat', { body: 'Sinä et ollut sinun accommodation. Miksi sinä olet jono? 🙂' });
    },
    text: (G) => p(
      'Lippu, istuin, bussi, joka menee sinne, minne sanoo. Eilisessä paidassaan oleva mies istuu käytävän toisella puolella eikä sano mitään, ja sitten, kahdenkymmenen minuutin kuluttua: ' + V('"Torstain. Hraun. Otin Flybusin. Kaikki muut odottaa kuljetusta."') + ' Hän katsoo ulos ikkunasta. ' + V('"Mietin koko ajan, että olisi pitänyt odottaa."'),
      'Islanti lipuu ohi: laavaa, erinomaista hanavettä, kohtalaisen mukavia ihmisiä, jotka eivät uhkaile eivätkä valehtele sinulle. Kuljettaja ei tarkista kenenkään nimeä. Islannille täydet pisteet siitä. Keflavík on syytön.',
    ),
    choices: [{ label: 'Saavu perille.', time: 45, do: (G) => { G.nerves(-4); G.collect(1); }, next: 'airport' }],
  };

  /* ================================================================ endings */
  const endings = {
    terminal: {
      art: 'terminal', title: 'TERMINAALI', kind: 'bad',
      hint: 'Aina joku kuuluttaa jotain.', blurb: 'Odotit kuulutusta.',
      text: p(
        'Kukaan ei kuuluta mitään. Kukaan ei aikonutkaan. Kello 03:10 saapuvien hallin viimeisetkin valot sammuvat, ja sen jälkeen halli on hahmo, jonka pikemminkin muistat kuin näet.',
        'Puhelimessasi on yksi palkki kenttää ja uusi sähköposti. <em>Olemme järjestäneet teille bussikuljetuksen.</em> Siinä ei sanota minne. Eikä koskaan sanota.',
        'Aamulla siivoojat löytävät tarkastuskortin ja vievät sen löytötavaroihin. Täällä ollaan siinä suhteessa hyvin tunnollisia.',
      ),
    },
    accommodated: {
      art: 'road', title: 'MAJOITETTU', kind: 'bad',
      hint: 'Sähköpostissa oli logo.', blurb: 'Vahvistit varauksen.',
      text: (G) => p(
        'Auto on lämmin, istuimet ovat nahkaa eikä kuljettaja puhu. Kojelaudan näytössä lukee ' + (G.has('lind') ? 'HÓTEL HRAUN · —— km · SAAPUMINEN —:—.' : 'HEATHROW RENAISSANCE LODGE · 1 894 km · SAAPUMINEN —:—.'),
        (G.has('lind') ? 'Katsot, kuinka kaupungin valot kutistuvat.' : 'Katsot, kuinka lentoaseman valot kutistuvat.') + ' Hetken päästä valoja ei ole enää lainkaan – vain renkaiden ääni ja uuden sähköpostin pieni kilahdus, joka saapuu vahvistamaan, että majoituksesi on järjestetty.',
      ),
    },
    crew: {
      art: 'stand', title: 'MIEHISTÖ', kind: 'bad',
      hint: 'Siinä oli vaakuna. Se oli oikein hieno.', blurb: 'Nousit siihen hienoon.',
      text: (G) => p(
        'Bussissa tuoksuu uusi verhoilu eikä mikään muu. Kaikki hymyilevät sinulle, kun kuljet ohi. Kenelläkään ei ole eilisiä vaatteita päällään, koska kenelläkään täällä ei ole eilistä.',
        'Purseri sulkee oven pehmeällä, kalliin kuuloisella äänellä. ' + V('"Enemmistö meidän asiakkaista on ollut ymmärtävä ja kärsivällinen."') + ' Hän tarkoittaa sinua. Olet ollut ymmärtäväinen. Olet ollut hyvin kärsivällinen.',
        (G.has('lind') || (G.has('detoured') && !G.has('at_hotel'))) ? 'Bussi ajaa ulos valosta, ja sen jättämä laituri on tyhjä, ja on ollut jo jonkin aikaa.' : G.has('at_hotel') ? 'Bussi ajaa ulos valosta, ja sen jättämä parkkipaikka on tyhjä, ja on ollut jo jonkin aikaa.' : 'Bussi ajaa ulos valosta, ja sen jättämä pysäkki on tyhjä, ja on ollut jo jonkin aikaa.',
      ),
    },
    convenience: {
      art: 'road', title: 'MUKAVUUS', kind: 'bad',
      hint: 'Kahdenkymmenen minuutin kävely. Tässä kunnossa.', blurb: 'Nousit kyytiin puolimatkassa 10-11:een.',
      text: p(
        'Bussissa on lämmin, ja istuimet ovat sisäänpäin, mitä et huomannut ennen kuin istuuduit. ' + V('"Me teemme meidän parasta",') + ' sanoo purseri, ja ovi taittuu kiinni, ja 10-11 lipuu ohi vasemmalla puolella, kaikki valot päällä eikä ketään sisällä.',
        'Sitä hammastahnaa et saa koskaan.',
      ),
    },
    nightcoach: {
      art: 'corridor', title: 'YÖBUSSI', kind: 'bad',
      hint: 'Viimeinen kutsu.', blurb: 'Avasit koputtajalle.',
      text: (G) => p(
        G.has('nc_street') ? 'Kävelet mäkeä alas. Mies ovella astuu syrjään sinua katsomatta. ' + V('"Lähtevä nyt",') + ' hän sanoo kadulle, ja sinä menet, koska se on ainoa koko yönä saamasi ohje, johon liittyi kellonaika, ja koska he tiesivät huoneen.' : G.has('nc_lind') ? 'Tasanne on tyhjä ja portaat ovat tyhjät ja ulko-ovi, jonka hän lukitsi, on auki kadulle. Kadulta: ' + V('"Lähtevä nyt."') + ' Seuraat sitä, koska se on ainoa koko yönä saamasi ohje, johon liittyi kellonaika, ja koska he tiesivät huoneen.' : G.has('nc_carpark') ? 'Kävelet bussin ovelle. Tummansiniseen pukeutunut mies astuu syrjään sinua katsomatta. ' + V('"Lähtevä nyt",') + ' hän sanoo hotellille, ja se on ainoa koko yönä saamasi ohje, johon liittyi kellonaika.' : G.has('nc_corridor') ? 'Hän lakkaa koputtamasta. Hän ei käänny. ' + V('"Lähtevä nyt",') + ' hän sanoo edessään olevalle ovelle ja kävelee porraskäytävään, ja sinä seuraat, koska se on ainoa koko yönä saamasi ohje, johon liittyi kellonaika.' : 'Käytävä on tyhjä ja kokolattiamatto märkä. Porraskäytävästä kuuluu: ' + V('"Lähtevä nyt."') + ' Seuraat ääntä, koska se on ainoa koko yönä saamasi ohje, johon liittyi kellonaika.',
        G.has('nc_lind') ? 'Bussi täyttää kadun seinästä seinään, sisävalot päällä. Kaikki sisällä ovat jo kääntyneet majataloon päin. Sinulle on varattu paikka. Paikalla on itse asiassa pieni tulostettu kortti, jossa lukee nimesi, Arial-fontilla, ja sen alla, pienemmällä: <em>vaihtoehtoiset järjestelyt</em>.' : 'Bussi odottaa parkkipaikalla sisävalot päällä. Kaikki sisällä ovat jo kääntyneet hotelliin päin. Sinulle on varattu paikka. Paikalla on itse asiassa pieni tulostettu kortti, jossa lukee nimesi, Arial-fontilla.',
      ),
    },
    lift: {
      art: 'corridor', title: 'HISSI', kind: 'bad',
      hint: 'Epäkunnossa, Arial-fontilla.', blurb: 'Astuit hissiin, joka tuli kutsumatta.',
      text: (G) => p(
        G.has('toothpaste') ? 'Ovet sulkeutuvat hyvän hotellin kohteliaisuudella. Peräseinän peili näyttää sinut: lentokonevaatteet, kasvot, 10-11:n pienen pussin rintaasi vasten puristettuna. Hissi laskeutuu. Se laskeutuu pidempään kuin rakennuksessa on kerroksia.' : 'Ovet sulkeutuvat hyvän hotellin kohteliaisuudella. Peräseinän peili näyttää sinut: lentokonevaatteet, kasvot, tyhjät kädet. Hissi laskeutuu. Se laskeutuu pidempään kuin rakennuksessa on kerroksia.',
        'Kun ovet aukeavat, edessä on lämmintä valoa ja istuinrivejä, ja kaikki niillä istuvat kääntyvät katsomaan sinua ja hymyilevät, ja purseri sanoo: ' + V('"Kiitos sinun kärsivällisyys",') + ' ja tarkoittaa sitä.',
      ),
    },
    tantalus: {
      art: 'carpark', title: 'TANTALOS', kind: 'bad',
      hint: 'Olet aina halunnut käydä Islannissa.', blurb: 'Menit kuumille lähteille.',
      text: (G) => p(
        G.has('toothpaste') ? 'Vesi on 38-asteista, taivas on käytetyn nenäliinan värinen, ja sinulla on jalassa 10-11:n sukat, kauneimmat sukat, jotka olet koskaan nähnyt, nyt täynnä rikkiä. Se on, objektiivisesti, kaunista.' : 'Vesi on 38-asteista, taivas on käytetyn nenäliinan värinen, ja sinulla on jalassasi lennolta jääneet sukat, koska muita sukkia sinulla ei ole. Se on, objektiivisesti katsoen, kaunista.',
        G.has('lind') ? 'Kello 09:00, 10:00 ja 11:00 keltaiset bussit lähtevät BSÍ:ltä ilman sinua, lipuilla, joita et ostanut. Kello 11:04 saapuu sähköposti, jonka mukaan kuljetuksesi lähti kello 09:00. Kello 11:05 chattibotti kysyy, viihdyitkö.' : 'Kello 11:00 bussi lähtee kolmenkymmenen kilometrin päässä olevan hotellin parkkipaikalta ilman sinua. Kello 11:04 saapuu sähköposti, jonka mukaan bussisi lähti kello 09:00. Kello 11:05 chatbot kysyy, viihdyitkö.',
        'Kunpa et olisi pidellyt apinankäpälää, kun sanoit, että olet aina halunnut käydä Islannissa.',
      ),
    },
    noshow: {
      art: 'lobby', title: 'NO-SHOW', kind: 'bad',
      hint: 'Kyltissä luki 11:00.', blurb: 'Odotit täsmälleen kyltin ilmoittamaa aikaa.',
      text: (G) => p(
        G.has('lind') ? 'Puoli yhteen mennessä neljä keltaista bussia on tullut ja mennyt ovet avoinna, eikä se perimmäisellä laiturilla oleva ole liikahtanut. Mies sen ovella katsoo kelloaan, mitä hänen ei olisi tarvinnut tehdä. ' + V('"Lento matkustajat?"') + ' hän sanoo miellyttävään sävyyn. ' + V('"He ovat lähteneet pois."') : 'Kello 11:30 mennessä kyltti on viety pois. Vastaanotossa ei muisteta, että sitä olisi koskaan laitettu. ' + V(LX('“Are you with the airline group? They\'ve gone.”')) + ' Hän sanoo sen ystävällisesti.',
        G.has('lind') ? 'Kioski myy korvapuusteja ihmisille, joilla on jokin paikka, minne mennä. Kun tarkistat, varaustasi ei löydy.' : 'Aulan kahviautomaatista kuuluu ääni kuin jokin rykisi. Kun tarkistat, varaustasi ei löydy.',
      ),
    },
    left: {
      art: 'airport', title: 'JÄLKEEN JÄÄNYT', kind: 'bad',
      hint: 'Sanoihan hän.', blurb: 'Kolme valitusta, kaikki merkitty.',
      text: p(
        V('"Me olemme noteeranneet sinun feedback",') + ' sanoo univormuun pukeutunut mies, ja käy ilmi, että niin on todella tehty; kaikki, pienelle kortille, siistillä käsialalla. Kortissa on kolme ruksia.',
        V('"Kuten neuvottu koneessa, asiakkaat jotka vastustavat tai objektoivat operationaalisia päätöksiä voidaan offloadata."') + ' Hän sanoo tämän vailla minkäänlaista pahansuopuutta, mikä on pahinta. Sitten hän pyytää seuraavaa matkustajaa astumaan esiin, ja jono sulkeutuu ylläsi kuin vesi.',
      ),
    },
    pastures: {
      art: 'tarmac', title: 'LAITUMET', kind: 'bad',
      hint: 'Tämä bussi ajaa oikeaa maantietä.', blurb: 'Jäit pois asematason bussista.',
      text: p(
        'Bussi pysähtyy, kuten halusit. Ovi avautuu levikkeelle, aidalle, lampaille ja tuulelle, joka on tullut pitkän matkan sinua tapaamaan. ' + V('"Kuten sinä toivot",') + ' sanoo kuljettaja, ja bussi jatkaa matkaa ilman sinua kohti jotain, joka saattaa tuolta etäisyydeltä katsottuna olla lentokone.',
        'Islanti ei ole tehnyt mitään väärää. Lampaat ovat oikein mukavia.',
      ),
    },
    arrangements: {
      art: 'street', title: 'VAIHTOEHTOISET JÄRJESTELYT', kind: 'bad',
      hint: 'Se oli vahvistettu. Kaikki sanoivat niin.', blurb: 'Odotit kuljetusta hotellista, jota lentoyhtiö ei koskaan varannut.',
      text: (G) => p(
        'Bussissa ei tuoksu mikään. Kaikilla kyydissä on hammastahnaa ja puhtaat sukat ja täysi akku, ja he nyökkäävät sinulle, kun kuljet ohi, koska olet nyt yksi heistä: tiistain, torstain, ja nyt sinun. Virkailija seisoo oviaukossa pokkari rintaa vasten eikä vilkuta. Hän on nähnyt tämän ennenkin. Hän tuo skyrin esiin huomenna.',
        'Kaikkien puhelimissa yhtä aikaa: ' + ALLY(G) + ': ' + V('"Kiitos sinun kärsivällisyys. Sinun transfer on vahvistettu."') + ' Bussi ajaa BSÍ:n ohi, ohi keltaisen bussin, jonka ovi on auki, ohi lentoaseman risteyksen, ja jatkaa matkaa, laavan taakse, kohti hotellia, joka odottaa sinua.',
        'Olet vihdoin täsmälleen siellä, minne sinut oli järjestetty.',
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
      text: (G) => p(
        'Portailla joku nauraa, ja sitten kaikki nauravat, eikä sateella ole väliä. Olette matkustaneet yhdessä yli vuorokauden. ' + (G.has('uk261') ? 'Sinulla on QR-koodi, fleecemies, ' : 'Sinulla on fleecemies, ') + (G.has('met31c') || G.has('ally31c') ? 'mies paikalta 31C, ' : '') + 'ja taapero, joka on nähnyt asioita.',
        'Koko tämän koettelemuksen tarkimmat ja hyödyllisimmät tiedot tulivat Arial-fontilla tulostetuista papereista ja satunnaisilta matkustajilta, jotka välittivät huhupuheita. Kukaan univormuun pukeutunut ei pyytänyt kertaakaan anteeksi. Kävi ilmi, ettet tarvinnutkaan sitä.',
        'Nähdään Los Angelesissa. LHR–LAX:n itsehallinnollisen yhteisön puolesta toivotat etumatkustamon asiakkaalle pikaista paranemista – hän on kuulemma tehohoidossa, erään lentoyhtiöllä työskentelevän serkun mukaan, eikä kukaan tiedä, kuinka luotettavaa se on.',
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
    tFlood: '{n} uutta ilmoitusta.', phoneDead: 'Ei virtaa',
  };

  return { start, scenes, endings, chat, ui, T, lang: 'fi', broken: CONTENT_BROKEN };
})();
