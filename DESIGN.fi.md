# DIVERTED – suunnittelumuistio

> *"british airwaysin chattibotti, british airwaysin sähköposti ja british airwaysin tekstiviesti: yksi puhuu aina totta, yksi valehtelee aina, ja yksi"*
> – ketju, viesti 29/67, kesken jäänyt

Tässä muistiossa kerrotaan, mihin peli pyrkii ja miksi sen jokainen osa on rakennettu niin kuin on. Se on kirjoitettu sille, joka haluaa muuttaa peliä, joten siinä viitataan myös koodiin.

## 1. Lähtökohta ja se, mitä alkuperäinen ketju antoi

Toimeksianto: kauhupeli, jossa lentosi Lontoosta Los Angelesiin laskeutuu Reykjavíkiin ilman selitystä ja ilman suunnitelmaa, perässä seuraa arvoituksellisia viestejä ja salaperäisiä busseja, ja yhtiö uhkaa jättää sinut oman onnesi nojaan, jos valitat. Väärä viesti, väärä bussi, väärä valitus: peli on ohi.

Liitteenä oleva ketju ei ole kauhutarina. Se on hyvin hauska ja hyvin väsynyt kertomus siitä, kun lento oikeasti ohjattiin varakentälle. Mutta jos sen lukee *järjestelmäsuunnitelmana*, se on melkein valmis pelidokumentti, koska kirjoittaja panee yhä uudelleen merkille samat kolme asiaa:

1. **Tieto ei tule sieltä, mistä sen pitäisi.** Viralliset kanavat (sähköposti, tekstiviesti, chattibotti) ovat myöhässä, ristiriitaisia tai fyysisesti mahdottomia ("kello 9.40 saimme sähköpostin, jonka mukaan bussit hakisivat meidät kello 9.00"). Luotettavia lähteitä ovat *vesitahrainen, Arial-fontilla tulostettu A4-arkki* ja *satunnaiset matkustajat, jotka välittävät kuulopuheita*.
2. **Ainoa tapa tietää olevansa oikeassa paikassa on tunnistaa muut matkustajat**, "vaikka en ole kovin hyvä muistamaan kasvoja", ja huomata, että heillä on samat vaatteet kuin eilen illalla.
3. **Auktoriteetti on kohtelias, käskevä, ei koskaan pahoillaan ja avoimesti uhkaava** ("minä vastaan tästä, ja asiakkaidemme turvallisuus on kaikkein tärkeintä"; "hän jättäisi ihmiset Islantiin, jos he vastustaisivat tai panisivat vastaan").

Lisäksi yksi rivi, joka on kirjaimellisesti käyttöliittymän määrittely: *"kuvitelkaa videopelin mittari, mutta minun hermoilleni, hupenemassa kohti 'ohuen, värisevän punaisen viipaleen' aluetta."*

Jokainen pelin mekaniikka on yksi näistä havainnoista otettuna kirjaimellisesti. Kauhua ei ole lisätty komedian päälle; se on sitä, mistä komediassa jo on kyse, kun rauhoittelut on karsittu pois.

### Ketju → pelin käänteet

Peli alkaa neljäkymmentä minuuttia ennen ketjua, portilla, koska kauhu tarvitsee *sen, mikä oli ennen*: matkustamon, joka on tavallinen niin pitkään, että pelaajalla on istuin, vierustoveri, ateria ja rutiini, jotka menettää. Jokainen myöhemmän uhan aines istutetaan sinne viattomassa muodossa – turvallisuusesittelyn sanamuoto, päälaskukortti, purserin tapa katsoa ihmisiä eikä papereita – niin että kun uhka tulee, se tunnistetaan sen sijaan, että se esiteltäisiin.

| Ketju | Peli |
|---|---|
| Tavallinen lento, kunnes se ei enää ole; ohjataan varakentälle sairastapauksen vuoksi; matkustajat puretaan koneesta yöllä; miehistö katoaa passintarkastuksessa | `boarding` → `takeoff` → `service` → `night`: neljä tuntia lentokonetta, joka toimii täsmälleen niin kuin pitää, ja purseri, joka tervehtii kasvoja eikä tarkastuskortteja, tekee turvallisuusesittelyn itse ("asiakkaidemme turvallisuus on kaikkein tärkeintä" sanottuna kuin mikä tahansa arkinen asia), kulkee ruokakärryn perässä tarjoilematta ja kävelee pimeää käytävää pieni kortti kädessä laskien; verho vedettynä eteen. Sitten `cabin` ja myöhemmin `landing` – miehistö kävelee ovesta, "joka ei niinkään sulkeudu kuin lakkaa olemasta ovi" |
| Matkustajat vastustavat varakentälle ohjaamista; purseri vastaa uhkaamalla jättää maahan jokaisen, joka panee vastaan | `cabin` → `cabin_purser`: kapteenin kuulutus kuohuttaa matkustamon (mies keittiön luona, kutsunappi, joka ei lakkaa soimasta), pelaaja voi yhtyä joukkoon, ja uhkaus tulee *seurauksena* – lisäksi **MERKITTY**-merkinnät ja `objected`-lippu, joka seuraa sinua |
| Sähköposti tarjoaa hotellia *Heathrow'ssa* | `heathrow`/`car` – MAJOITETTU-loppu |
| Ei ruumalaukkuja, kaikki kiinni, ei ruokaa eikä hammastahnaa | Hotelliyön solmukohtaus: sipsejä ja pikkupullo viiniä ("tyttöjen illallinen"), pikkuiset shampoot, kahdenkymmenen minuutin kävely 10-11:een |
| "Univormuihin pukeutuneet islantilaiset käskivät olla noudattamatta sähköpostien ohjeita ja nousta sen sijaan busseihin" | `icelander` – "Älkää menkö sähköpostien perässä. Busseja on." |
| Busseja, joiden alkuperää kukaan ei tiedä; kukaan ei kuuluttanut niitä; yksi fleecetakkinen mies sanoi "kuulemma" | Bussientarkastelukohtaukset; kuulopuhe voimavarana |
| Bussimatka on huolestuttavan pitkä; taapero huokaa "mikä päivä" | `ride` |
| Sähköposti "busseista" tulee 30 minuuttia sen jälkeen, kun bussiin on jo noustu, eikä siinä ole paikkaa | Ajastettujen viestien järjestelmä: `G.at(t + 30, 'email', …)`, leimattu ennen saapumistaan |
| Arial-tuloste sanoo 11.00; sähköposti kello 9.40 sanoo 9.00; chattibotti sanoo jotain muuta | **Paperi**-välilehti vastaan **Posti** vastaan **Ally**; kello 9.00:n harhautusbussi; NO-SHOW, jos odotat täsmälleen tulosteeseen painettuun aikaan |
| "Ulkona oli bussi… 'ehkä kannattaisi pitää kiirettä'" – muiden matkustajien tunnistaminen on ainoa varmistus | `buses2`: oikea bussi on se, jossa istuu ihmisiä eilisissä vaatteissaan |
| Kuumien lähteiden suosituksia vastauksissa | TANTALOS-loppu ja Jon tekstiviesti |
| UK261-ohjeet muutettuna QR-koodiksi ja näytettynä jokaiselle matkustajalle; "olen valmis olemaan karen" | `uk261`-lippu ja **YHTEISÖ**-mittari; sen jakaminen on *turvallinen* tapa valittaa |
| Automaatti pettää kahdesti; yksi tiski; avataan täsmälleen 3 tuntia ennen lähtöä; lähtöaika siirtyy yhä edemmäs | `airport`-solmukohtaus, `dep`-muuttuja ja kello 12.00:n sähköposti "uudesta lähtöajasta", joka siirtää tiskin avaamista |
| Portin virkailija huutaa nousuryhmistä, sata ihmistä nauraa | `gate` |
| Matkustajasilta → bussi → oikea maantie laidunten halki → "taidan nähdä meidän koneemme" → sadetta | `jetbridge`, `tarmac`, `plane` |
| "Suurin osa asiakkaista on suhtautunut ymmärtäväisesti ja kärsivällisesti"; wifi-hyvitys | Hyvät loput |
| "Nähdään portlandissa… tai grönlannissa. tai helvetissä." | KOTIIN (TAI GRÖNLANTIIN, TAI HELVETTIIN) |

Nimet ja lentoyhtiö ovat keksittyjä (Albion Atlantic, "Teemme parhaamme"). Määränpää on toimeksiannon mukaisesti Los Angeles. Keflavík on syytön.

## 2. Mitä kahdesta esikuvapelistä lainattiin

### *No, I'm Not a Human*: seulonta tunnusmerkkien perusteella

Sen pelin ydinsilmukka on tämä: ovellesi saapuu jotakin, joka väittää olevansa se, mitä tarvitset; tutkit siitä pieniä fyysisiä tunnusmerkkejä; päästät sen sisään tai et; säännöt siitä, mikä lasketaan tunnusmerkiksi, annostellaan epäluotettavan lähetyksen kautta; erehtyminen on kohtalokasta; pelikerrat ovat lyhyitä, ja loppuja kerätään kokoelmaan.

DIVERTED siirtää tämän yksi yhteen busseihin:

- **Vieras on bussi.** Jokainen bussikohtaus (`buses1`, `buses2` sekä yhden bussin ansat `decoy_morning` ja `walk`) esittelee 2–3 ajoneuvoa, joilla on nimi, kyltti, kaksi näkyvää yksityiskohtaa ja kaksi tai kolme **piilotettua yksityiskohtaa**, jotka paljastuvat toiminnolla *Katso tarkemmin*, mikä maksaa minuutteja. Bussiin nouseminen on peruuttamaton teko.
- **Tunnusmerkit ovat osa tarinan maailmaa ja pysyvät samoina koko pelin ajan.** Oikeassa bussissa on aina käsin tai tussilla kirjoitettu kyltti (Arial tai paperi, ei koskaan LED-näyttö); kuljettaja huomioliivissä, jota et kiinnosta; ja ihmisiä, jotka tunnistat, niissä vaatteissa, joissa he lensivät. Väärässä bussissa on aina vaakuna ja LED-näyttö; kuljettaja *kadonneen miehistön* univormussa, hymyilemässä nimenomaan sinulle; ja levänneitä vieraita ihmisiä puhtaissa paidoissa, ilman puhelinta kädessä. Kolmas vaihtoehto (Flybus, Blue Lagoonin kuljetusbussi) on aito bussi, joka ei ole sinun, ja sen tunnusmerkki on se, että sen matkustajilla on matkatavaroita tai puhtaat sukat – asioita, jotka sinulta silmiinpistävästi puuttuvat.
- **Lähetys, joka opettaa säännöt, on kuulopuhetta.** NINAH:ssa se on televisio. Täällä se on islantilainen, fleecetakkinen mies, nainen taaperon kanssa, mies Blazers-lippiksessä ja nimetön tekstiviesti +354-numerosta: "älä mee siihen kivaan". Ihmisten kanssa puhuminen kasvattaa piilotettua yhteisölaskuria ja avaa vihjerivejä kohtaustekstin alle. Viralliset kanavat ovat sitä vastoin *valehtelun* kanava. Pelaajan on opittava, että logo on vaaran tunnusmerkki – mikä kääntää päälaelleen sen luottamusjärjestyksen, jonka lentoyhtiön brändi on suunniteltu istuttamaan.
- **Yksityiskohdat arvotaan jokaisella pelikerralla** (järjestys, väritys, paperikyltin sanamuoto) siemenluvulla alustetulla satunnaislukugeneraattorilla, jotta vastausta ei voi opetella ulkoa muodossa "se vasemmanpuoleinen"; se on *luettava*. `G.pick` / `G.shuffle` tiedostossa `content.js`.
- **Pysyvä kuolema, lyhyet pelikerrat, loppujen galleria.** Yksi pelikerta kestää 20–30 minuuttia. Kaksitoista loppua, joista kymmenen huonoja, tallennetaan `localStorage`-muistiin ja näytetään lukittuina kortteina, joissa on yhden rivin vihje, joten galleria itsessään on hienovarainen opas ("Aina joku kuuluttaa jotain." / "Siinä oli vaakuna. Se oli oikein hieno.").

### *Don't Look Outside*: huone, tarpeet, sääntö

Tämän pelin anti on keskimmäisen näytöksen muoto: olet suljettuna sisään; sinulla on pieniä arkisia tarpeita (syödä, nukkua, pysyä koossa); yö on vaaran hetki; ja on olemassa ääneen lausuttu sääntö, josta koko pelissä on oikeastaan kyse: rikotko sen vai et.

- **Huoneet.** Hotelli koostuu neljästä solmukohtauksesta – `room`, `corridor`, `lobby`, `carpark` – joiden välillä liikut, sekä tiestä 10-11:een. Toimintoluettelot *ovat* ketjun luettelo pienistä kurjuuksista: ei hammastahnaa, pikkuiset shampoot, sipsit ja pikkupullo viiniä, omien oikeuksien tarkistaminen, tilanteesta somettaminen, jääpalakone, yövirkailijan ristikko. Mikään täällä ei ole pulma; se on tekstuuria, ja jokainen toiminto palauttaa eri kappaleen (§5), joten sama huone ei ole koskaan kahdesti sama huone.
- **Tarpeet eivät ole selviytymissimulaatio.** Nälkäkelloa ei ole. Ruoka, tee, suihku, muut ihmiset ja uni merkitsevät vain siksi, että ne laskevat kahta mittaria hieman (§4b); mitään tekemättä oleminen on aina sallittua, eikä mikään täällä näännytä sinua.
- **Sääntö.** "Ethän katso ulos ikkunasta", jonka chattibotti sanoo kello 4.50, on pelin ainoa suora kunnianosoitus *Don't Look Outsidelle*. Katsominen *ei* ole kohtalokasta – se olisi halpa temppu – mutta se asettaa lipun `seen`, johon purseri viittaa myöhemmin asematason bussissa: "Sinä katsoit." Hinta on kauhu, jota kannat mukanasi, ei pelin loppuminen. Koputus kello 4.30 ("Bussi Albion Atlanticin matkustajille. Lähtee nyt. Viimeinen kutsu.") on yön varsinainen koe: se on *chattibotin* ilmoittama aika, ja vain paperikyltti on eri mieltä.
- **Yö vaaran hetkenä.** Jokainen hotellin kohtalokas valinta on öinen (kävely, koputus – joka löytää sinut, olitpa huoneessa tai käytävällä – bussi parkkipaikalla, hissi, joka saapuu itsestään; ikkuna on se, joka ei ole kohtalokas). Aamu on suhteellisen turvallinen siihen asti, kunnes bussit tulevat, ja juuri niin esikuvapelikin rytmittää: ensin askareet, sitten ovi.

## 3. Kolme kanavaa ("yksi puhuu aina totta, yksi valehtelee aina, ja yksi")

Ketju ei koskaan saanut lausetta loppuun. Peli saa, suurin piirtein:

| Kanava | Käytös | Miten se on rakennettu |
|---|---|---|
| **Posti** (Albion Atlantic, vaakunan kera) | Aina *myöhässä* ja väärästä asiasta. Lähetys- ja vastaanottoaika näytetään erikseen, jotta pelaaja näkee kello 9.00:n bussisähköpostin saapuvan kello 9.40. | `G.at()`, jossa `stamp` on toimitusta aikaisempi; sähköpostinäkymä tulostaa molemmat. |
| **Ally** (chattibotti) | *Valehtelee* aina, mutta täsmällisesti ja hyödyllisesti: se nimeää ansan, johon olet juuri astumassa (bussi kello 3.40, kuljetus kello 8.00, "huone 214, ethän katso ulos ikkunasta"). Myös nopein tapa tulla MERKITYKSI. | `CONTENT.chat` – vastaukset ovat tilan funktioita; "Haluan tehdä valituksen" kutsuu funktiota `G.strike()`. |
| **SMS** | Harvakseltaan. Kaksi lentoyhtiöltä (väärin), yksi ystävältä (kuumat lähteet), yksi tuntemattomasta numerosta (oikein). | Tavallisia puhekuplia; tuntematon numero on pelin ainoa yksiselitteinen vihje, ja se on tarkoituksella kiistettävissä. |
| **Paperi** | *Totuus.* Kaikki, mikä on tulostettu Arialilla ja teipattu johonkin. Pelaaja valokuvaa sen, ja se päätyy välilehdelle, joka on ladottu oikealla Arialilla ja vesitahralla. | `renderPaper()` tiedostossa `engine.js`; `.paper-sheet` CSS:ssä. |

Suunnittelun tavoite on, että toiseen bussikohtaukseen mennessä pelaaja tarkistaa ensin Paperi-välilehden ja lukee vaakunan uhkana. Tämä käänteisyys – brändätty, muotoiltu, ammattimaisesti sanoitettu kanava on vaarallinen ja ruma, käsin tehty kanava turvallinen – on pelin perusväite, ja se tulee suoraan viestistä 32: "satoja muita ihmisiä, jotka luottavat mieluummin vesitahraiseen arial-fontilla tehtyyn tulosteeseen kuin sähköposteihin, joissa on BA:n logo, koska me kaikki tiedämme paremmin."

## 4. Valittaminen

Toimeksiannon mukaan *väärän valituksen tekeminen* on epäonnistumistila. Ketju tarjoaa luokittelun:

- Valittaminen **lentoyhtiölle** – matkustamossa, chattibotille, tiskillä, portilla tai vaatimalla laukkuaan – **MERKITÄÄN**. Yksi merkintä kustakin. Purseri kirjoittaa pienelle kortille. Kolmannella lentoyhtiö toimii *siellä, missä voi* – lähtöselvitystiskillä tai portilla, ei koskaan hotellissa – ja tuloksena on JÄLKEEN JÄÄNYT: "asiakkaat, jotka vastustavat operatiivisia päätöksiä tai asettuvat niitä vastaan, voidaan poistaa lennolta", sanottuna ilman minkäänlaista epäystävällisyyttä.
- Valittaminen **toisillenne** – havaintojen vertailu, UK261-QR-koodin jakaminen, portin virkailijalle nauraminen – lasketaan hiljaisesti. Se on ainoa laji, josta on apua. Se avaa vihjeitä ja johtaa viidellä tai useammalla parempaan loppuun, LHR–LAX:N ITSEHALLINNOLLINEN YHTEISÖ, joka on ketjun oma nimitys sille, mitä matkustajista tuli.

Yksi valitus on piilotettu: jos vahvistat Heathrow'n hotellin etkä sitten *nouse* autoon, asettuu lippu `booked`, ja lähtöselvityksen virkailija huomauttaa myöhemmin, että "tietojemme mukaan sinut majoitettiin" – merkintä, jonka ansaitsit kaksitoista tuntia aiemmin luottamalla sähköpostiin. Se on "luota väärään viestiin" -seuraus niille pelaajille, jotka väistivät välittömän seurauksen.

## 4b. Kaksi mittaria: mitä ne tekevät ja, mikä tärkeämpää, mitä ne eivät tee

Ensimmäisessä luonnoksessa oli hermopalkki, joka tyhjeni ja tappoi sinut, sekä punaisella merkityt vaaralliset vaihtoehdot. Molemmat on poistettu. Säännöt ovat nyt nämä:

- **Kaksi mittaria, molemmat täyttyvät, kumpikaan ei päätä peliä.** HERMOT täyttyy yhteenotoista ja stressistä; KAUHU täyttyy myöntyväisyydestä ja siitä, että katsot asioita, joita sinua kiellettiin katsomasta. Pienet valinnat liikuttavat niitä muutaman pisteen. Aika liikuttaa niitä hieman (hermot +1 jokaista 40 valveilla vietettyä minuuttia kohti; kauhu +1 jokaista 30 minuuttia kohti keskiyön ja aamunkoiton välillä). Uni, ruoka, suihku, nauru ja muut ihmiset laskevat niitä. Missään pelissä ei ole hetkeä, jossa "mittari täyttyy → kuolema".
- **Niiden ainoa vaikutus on sulkea vaihtoehtoja.** Jokaiselle valinnalle voi antaa arvon `nerveMax` tai `dreadMax`. Kun mittari on ylittänyt sen luvun, vaihtoehto on yhä luettelossa, mutta yliviivattuna ja poissa käytöstä, ja sen kohdalla on juuri sitä vaihtoehtoa varten kirjoitettu yhden rivin perustelu (`whyNot`): hermoraunio ei pysty makaamaan paikallaan, läikyttäisi teen, ärähtäisi fleecemiehelle; lannistettu ei pysty tarkistamaan oikeuksiaan, ei pysty kääntämään bussille selkäänsä, ei pysty kävelemään kohti koputtavaa miestä. Perustelut eivät koskaan nimeä mittaria, mutta kumpikin ryhmä säilyttää oman sävynsä – vapina ja äkkipikaisuus toisella puolella, lamaannus ja tottelevaisuus toisella – joten ne ovat opittavissa. Korkeat hermot vievät rauhalliset, kärsivälliset ja seuralliset vaihtoehdot ja jättävät jäljelle yhteenottoon johtavat. Korkea kauhu vie uhmakkaat, itsenäiset vaihtoehdot ja jättää jäljelle myöntyväiset. Mittarit eivät siis koskaan tapa sinua; ne jättävät sinulle ne valinnat, jotka olisit joka tapauksessa tehnyt, jos olisit noin hermoraunio tai noin lannistettu – ja *osa* niistä on kohtalokkaita.
- **Ei yhtä ainoaa epäonnistumispistettä.** Kynnysarvot ovat vaihtoehtokohtaisia ja tarkoituksella epätasaisia: vanhemman pariskunnan puhutteleminen vaatii hermot ≤75, fleecemiehen ≤90; koputuksesta kieltäytyminen vaatii kauhun ≤80, ovisilmältä perääntyminen ≤88, kävely 10-11:een ≤70, paloportaat ≤92. Pelaaja, joka on ollut koko yön enimmäkseen myöntyväinen, saapuu koputuksen luo kauhu kahdeksissakymmenissä ja huomaa, että "älä avaa" on kadonnut – mutta "katso ovisilmästä" on yhä jäljellä, ja sen takana on vielä yksi mahdollisuus. Jokaisessa suppilossa on useampi kuin yksi seinä, ja jokainen seinä on eri kohdassa.
- **Kahdenlaisia vaihtoehtoja, kaksi tunnusmotiivia, ei koskaan nimilappuja.** Yhteenottoon johtavat vaihtoehdot (`kind: 'conflict'`) kantavat hermopalkin motiivia: punainen vasen reuna, joka paksunee, ja tekstin varjo, joka punertuu hermojen noustessa, ja ylimmillä tasoilla ne vapisevat. Myöntyväiset vaihtoehdot (`kind: 'comply'`) kantavat kauhupalkin motiivia: lentoyhtiön laivastonsininen sävytys ja kultainen hehku, jotka voimistuvat kauhun noustessa, kultainen ✦ nuolen tilalla, ja teksti kasvaa hieman. Palkit käyttävät samoja värejä, joten parin pelikerran jälkeen pelaaja voi päätellä, kumpi palkki hallitsee kumpaa ryhmää – peli ei sano sitä koskaan. Se on toimeksiannon pyytämä opetussilmukka: opit pelikertojen myötä, minkä laatuinen kukin vaihtoehto on, ennen kuin opit, onko se hyvä vai huono.
- **Kumpikaan ryhmä ei ole "se huono".** Osa myöntyväisistä vaihtoehdoista on oikein (pysy istumassa asematason bussissa, nouse koneeseen ryhmittäin, älä katso ulos ikkunasta, odota tiskin avautumista); osa yhteenottoon johtavista on oikein tai harmittomia (pane vastaan matkustamossa, vaadi laukkuasi, kysy kuljettajalta). Molemmista ryhmistä osa päättää pelin (avaa ovi, mene hissiin, nouse vaakunabussiin; vaadi päästä pois asematason bussista). Motiivi kertoo valinnan *luonteenlaadun*, ei sen lopputulosta.
- **Toisto on halpaa.** Saman asian tekeminen kahdesti samassa paikassa maksaa mittareilla puolet vähemmän (`engine.js`, `choose()`), joten pelaaja, joka tarkistaa oven neljä kertaa, on hermostunut, ei tuomittu.
- **Viritys.** Automaattiset pelitestauskäytännöt (`tools/playtest.js`: myöntyväinen, yhteenottoon hakeutuva, satunnainen, "järkevä" sekä käsin kirjoitettu varovainen reitti) ajettiin kaikilla kolmella kielellä. Varovainen pelikerta päättyy hermoihin 0–10 ja kauhuun 60 ilman, että yksikään vaihtoehto sulkeutuu; puhtaasti myöntyväinen pelikerta saapuu koputuksen luo kauhu 70–100 ja ohjautuu yleensä YÖBUSSIIN tai HISSIIN; yhteenottoon hakeutuva pelikerta nousee hermoihin 75–100, menettää kyvyn nauraa portilla tai odottaa tiskillä ja kerää MERKITTY-merkintöjä lähtöselvitykseen asti. Satunnaiset tutkimusmatkailijat, jotka tonkivat jokaisen pimeän nurkan, kyllästävät molemmat palkit kello neljään mennessä, mikä on tarkoitettu rangaistus siitä, että hotellia kohdellaan tarkistuslistana.

## 5. Teksti, joka ei koskaan toistu

Solmukohtaukset kokoavat kappaleensa kolmesta osasta (`hub()` tiedostossa `content.js`): lyhyestä kiinteästä tilarivistä, joka kertoo, missä olet ja mikä sinussa on vialla (*"Huone 214. 03:40. Olet liian väsynyt nukkumaan, ja hampaasi ovat likaiset, etkä ole syönyt."*), sen tuloksesta, mitä juuri teit (`G.note()`, jonka toiminto asettaa), ja yhdestä tunnelmarivistä, joka poimitaan kyseisen paikan varannosta. Tunnelmariveillä on kauhun taso; poimija suosii rivejä nykyisellä tasolla tai juuri sen alapuolella eikä koskaan toista viimeksi käytettyä, joten sama aula on kauhun tasolla 2 ristikko ja retkimainos, ja tasolla 5 virkailija sanoo katsettaan nostamatta "Hän kysyi sinua". Toistettavat toiminnot (oven, television, ikkunan, jääpalakoneen, myyntiautomaatin tarkistaminen) valitsevat tuloksensa sen mukaan, montako kertaa olet tehnyt ne ja mikä kauhun taso on, joten neljäs ovientarkistus lukee eri tavalla kuin ensimmäinen. Mikään solmukohtaus ei tuota samaa kappaletta kahdesti peräkkäin.

## 5b. Kiihtyminen

Kauhu ohjaa myös esitystapaa kuudessa tasossa (`data-dread` juurielementissä, asetettuna mittarin mukaan):

- Sivu pimenee: vinjetointi kuroutuu sisäänpäin, pyyhkäisyjuovat paksunevat, otsikko välkkyy nopeammin, tasolla 5 kohtausteksti värähtelee, tasolla 6 sijaintirivi muuttuu punaiseksi.
- Kello valehtelee: tasosta 3 alkaen se näyttää muutaman sekunnin välein viidesosasekunnin ajan `--:--` tai ajan tuntien takaa.
- Kuvat rappeutuvat: tasosta 3 alkaen kohtausvinjettien reunaan ilmestyy laivastonsininen hahmo, jolla on valkoinen kaulus, sitä useammin, mitä korkeammalle kauhu nousee; tasosta 4 alkaen ruudut putoavat toisinaan mustiksi; piirtonopeus kasvaa.
- Chattibotti tulee lähemmäs: tasosta 3 alkaen Allyn vastauksiin ilmestyy toinen rivi (*"Olet yhä huoneessa 214."*, *"Pysy paikallasi."*); tasolla 5: *"Miksi olet yhä täällä?"*
- Puhelimen akku laskee Heathrow'n 31 prosentista yksinumeroisiin lukemiin portille mennessä, eikä laturia ole, koska laturi on laukussa, ja laukku on järjestelmässä.
- Päivänvalo auttaa: nukkuminen (tai sen epäonnistuminen) kello 7.30 vähentää kauhua 25 pistettä. Lentoasema ja portti palauttavat osan siitä.

## 5c. Neljä kieltä, neljä kaistaa

Peli on olemassa englanniksi, ranskaksi, islanniksi ja suomeksi. Valinta tehdään pelin ensimmäisessä kohtauksessa: koneeseen nousu Heathrow'lla, neljä kaistaa, neljä kylttiä (*Lane A · English / Voie B · Français / Rein C · Íslenska / Kaista D · Suomi*), portin virkailija huutamassa kaistoista – peilikuva Keflavíkin portin virkailijasta, joka huutaa ryhmistä neljätoista tuntia myöhemmin. Kaistan valitseminen asettaa kielen, jolla lentoyhtiö on luvannut palvella sinua.

Miksi juuri nämä neljä, tiedoksi: englanti, koska alkuperäinen ketju on englanninkielinen; ranska, koska tekijä on ranskalainen ja haluaa näyttää pelin perheelleen; suomi, koska tekijä uskoi pitkän päivän päätteeksi hetken, että Reykjavík on Suomessa, ja versio säilytettiin sen muistomerkkinä; islanti, koska Reykjavík on tarkemmin ajatellen Islannissa.

Se, kuka puhuu mitäkin, on osa suunnittelua eikä käännöksen sattumaa:

- **Lentoyhtiö puhuu kieltäsi huonosti.** Ranskan- ja islanninkielisissä versioissa sähköpostit, chattibotti, purserin kuulutukset ja tiskin henkilökunta on kirjoitettu konekäännetyllä, puolirikkinäisellä ranskalla tai islannilla – englannin sanajärjestys, väärät sijamuodot, "tantamount" jätetty kääntämättä, iskulause käännöslainattu muotoon *Nous faisons notre meilleur* / *Við erum að gera okkar best*. "Palvelemme teitä ylpeänä valitsemallanne kielellä" on lentoyhtiön lupaus, ja tämän arvoinen se lupaus on. Se on myös pieni kauhukeino: ainoa ääni, jolla on valtaa, on se, joka ei oikein osaa puhua sinulle.
- **Paikalliset puhuvat hyvin.** Islanninkielisessä versiossa lentoaseman nainen ja yövirkailija puhuvat kunnollista islantia – he ovat rehelliset äänet, ja he ovat kotonaan. Ranskankielisessä versiossa he vastaavat englanniksi (ranskalaista matkustajaa puhuteltaisiin Keflavíkissa englanniksi), ja se jätetään ranskankielisen kerronnan sisällä kääntämättä; jos kysyt heiltä, puhuvatko he ranskaa, he vaihtavat loppuyöksi takeltelevaan, ystävälliseen ranskaan (*« Onze. C'est écrit onze. Peut-être vous dormir. »*). Kysyminen on oikea vaihtoehto lentoasemalla ja aulassa, vain ranskankielisessä versiossa.
- **Suomenkielinen versio** on suora käännös, jonka luontevuutta tarkistettiin, kun suomalainen lukija huomautti ensimmäisen luonnoksen anglismeista; islannin- ja ranskankielinen kerronta kävi läpi saman tarkistuskierroksen (ranska noudattaa lisäksi välilyönnein erotetun lyhyen ajatusviivan käytäntöä, « – », ei koskaan pitkää ajatusviivaa, lentoyhtiön omien tekstien ulkopuolella). Kaikki kolme pitäisi silti luetuttaa äidinkielisellä lukijalla, ennen kuin niitä näytetään kenellekään tosissaan.

Mekaanisesti `content.js` on totuuden lähde; kolme muuta tiedostoa tuotetaan siitä korvaamalla jokainen merkkijonoliteraali sanakirjan avulla (`tools/i18n.py`, `tools/dict_*.json`), joten neljä versiota eivät voi erkaantua toisistaan logiikassa, vain proosassa. Paikallisten puhumat repliikit on kääritty lähdekoodissa muotoon `LX(...)`; generaattori jättää ne ranskaa varten englanniksi, ja ranskankielinen tiedosto kantaa toista pientä taulukkoa (`tools/dict_fr_broken.json`) takeltelevan ranskan muunnelmaa varten. Moottori pitää yllä `CONTENTS`-rekisteriä ja vaihtaa aktiivisen sisällön, kun kaista valitaan; itse kaistakohtaus asuu tiedostossa `engine.js`, koska se on ainoa kohtaus, jonka on oltava olemassa ennen kuin kieltä on.

**Aloitusnäyttö** on ainoa paikka, johon kävijä saapuu ennen kielen valitsemista, joten se käyttäytyy kuin lentoaseman infotaulu: muutaman sekunnin välein se selaa läpi neljä kieltä – alaotsikon, esittelytekstin ja painikkeet – läppätauluanimaatiolla ja lakkaa selaamasta sillä hetkellä, kun kaista valitaan. Missään siinä ei lue "valitse kieli"; se vain näyttää sinulle yhä uudelleen omaasi, kunnes nouset koneeseen.

## 6. Sävy

Ketju on ilmeetön, ja ilmeettömyys on oikea rekisteri kauhulle. Siispä:

- **Varakentälle ohjaamisen syytä ei koskaan selitetä sen pidemmälle kuin ketjussa.** Ketjussakin se on aina toisen käden tietoa: "sairastapaus", purseri, joka antaa ymmärtää matkustajan olevan ensimmäisessä luokassa, ja lopussa "kuulemma tehohoidossa – en tiedä, kuinka luotettava tämä tieto on". Peli pitää täsmälleen tästä kiinni: kapteeni sanoo, että eräs asiakas on huonovointinen, verho vedetään eteen, jos kävelet sen ohi, näet jonkun keittiön lattialla ja peiton etkä saa tietää, mikä on vialla, ja hyvä loppu toivottaa "tehohoidossa olevalle miehelle" pikaista paranemista kuulopuheen varassa. Mitään ei koskaan vahvisteta, eikä mikään loppu selitä sitä.
- **Ei säikäytyksiä, ei verta, mitään yliluonnollista ei koskaan vahvisteta.** Miehistö "katoaa". Bussin matkustajat ovat "levänneitä". Matto on märkä. Purseri katsoo ylös ikkunaasi. Sen suorasanaisemmaksi se ei mene. Pelaajan mielikuvitus hoitaa loput, mikä on halvempaa ja pelottavampaa.
- **Lentoyhtiön ääni ei koskaan muutu.** Jokainen uhkaus esitetään asiakaspalvelukielellä. "Teemme parhaamme" esiintyy matkustamossa, jokaisen sähköpostin allekirjoituksessa, bussin ovella pimeässä ja lähtöselvitystiskillä. Viimeinen niistä sanotaan päivänvalossa, ja sen on tarkoitus olla pahin.
- **Oikeat vitsit on säilytetty sellaisinaan** – toinen automaatti, tyttöjen illallinen, wifi-hyvitys – koska juuri ne ihminen oikeasti huomaa tunnilla 26, ja koska nauru *on* selviytymismekaniikka. Jokainen pelin nauru vähentää molempia mittareita muutamalla pisteellä.
- **Islanti ei ole uhka.** Ketju on tästä ehdoton, ja niin on pelikin: islantilainen on ensimmäinen rehellinen ääni, 10-11 "loistaa kuin pyhäkkö", ja LAITUMET-lopussa on oikein mukavia lampaita.

## 7. Visuaalinen ilme

Molemmat esikuvapelit ovat matalaresoluutioisia ja hämyisiä, ja ne antavat sinun *katsoa* sitä, mistä olet päättämässä. Grafiikka noudattaa tätä yhdellä rajoitteella: ei kuvatiedostoja. Kaikki piirretään ohjelmallisesti tiedostossa `art.js` pikkuruiselle piirtoalustalle (160×72 kohtauksille, 128×64 busseille) ja skaalataan ylös määrityksellä `image-rendering: pixelated`, joten varasto pysyy kuutena tekstitiedostona ja ilme pysyy samana kaikenkokoisena.

- **Kohtausvinjetit.** Jokaisella kohtauksella ja lopulla on `art`-avain, joka valitsee piirtäjän: matkustamo palavine turvavyövaloineen, jääkaappivalossa kylpevä terminaali ovineen, joka ei sano mitään, natriumlamppujen valaisema bussipysäkki, tie laavakentän halki, huoneen 214 ikkuna (joka näyttää bussin parkkipaikalla vain, jos olet katsonut), käytävä märkine mattoineen, aula A4-kyltteineen, lähtöaikataulu yhdellä punaisella rivillä, matkustajasilta, joka päättyy bussiin, laitumet, lentokone sateessa. Ne piirretään uudelleen kahdesti sekunnissa uudella siemenluvulla, joten loisteputket välkkyvät, sade sataa ja ihmiset liikahtelevat – *Don't Look Outsiden* temppu: pysäytyskuva, joka ei ole aivan pysähtynyt. Uudelleenpiirto pysähtyy, kun `prefers-reduced-motion` on käytössä.
- **Bussimuotokuvat.** Jokaisen bussikortin kuvitus tuotetaan pienestä määrittelystä (`livery`, `windows`, `passengers`, `sign`, `driver`). Tämä on *No, I'm Not a Humanin* ovisilmä: tunnusmerkit näkyvät ennen kuin luet sanaakaan, jos osaat katsoa. Vaakunabussissa on lämpimät, kirkkaat ikkunat ja jokaisessa ikkunassa yksi samanlainen, suorassa istuva siluetti. Tavallisessa bussissa on himmeät ikkunat ja eri korkeuksilla lysähtäneitä matkustajia, osa ikkunoista tyhjiä, yhdessä kaksi ihmistä. Flybusissa on matkatavaratelineet. Laguunin kuljetusbussissa on pyyhkeitä. Kuljettajalla on huomioliivi, laivastonsininen takki valkoisella kauluksella tai ei mitään erityistä. Mitään tästä ei ole nimetty; toinen pelikerta opettaa lukemaan sen.
- **Kehys.** Yksi ainoa tumma teema, tarkoituksella: jokaisessa kohtauksessa on kello kaksi yöllä suljetulla lentoasemalla. Pinnat ovat lämpimän lähes mustia, ja niissä on neljän pikselin rasterikuvio; paneeleissa on kahden pikselin viiste ja kova varjo, kuin 1990-luvun valintaikkuna, joka on jätetty tupakkahuoneeseen. Leipäteksti on ladottu VT323-fontilla (päätekirjasin) 21 pikselin koossa luettavuuden vuoksi, nimilaput ja otsikot Press Start 2P -fontilla, molemmat Google Fontsista Courier-varafontein. Molemmat mittarit ovat lohkopalkkeja: hermot punaisena, yläpäässä vapisten; kauhu lentoyhtiön laivastonsinisestä kultaan, yläpäässä hehkuen. Koko sivun vinjetointi tummentaa kulmat, ja kaiken päällä on himmeät pyyhkäisyjuovat. Puhelin säilyttää tarkoituksella oman nykyaikaisen järjestelmäfonttinsa: se on pelin ainoa puhdas, yhtiömäinen, hyvin muotoiltu esine, ja juuri se valehtelee sinulle.

## 7b. Äänisuunnittelu

Kaikki syntetisoidaan tiedostossa `audio.js` Web Audio -rajapinnalla – kohinaa, muutama oskillaattori, suodattimia – joten mediatiedostoja ei edelleenkään ole. Ääni käynnistyy ensimmäisestä napsautuksesta (selaimet vaativat eleen), ja yläpalkin ♪-painike mykistää sen; valinta muistetaan käyntikertojen välillä.

Jokaisella kohtausavaimella on oma äänimaisemansa, joka ristihäivytetään kahden sekunnin aikana kohtauksen vaihtuessa:

- **Matkustamo**: 55 hertsin moottorin humina ruskean kohinan alla, heikko suhina ja silloin tällöin turvavyömerkkiääni – "lusikka lasiin" – joka soi myös varakentälle ohjaamisen kohtaukseen saavuttaessa.
- **Heathrow'n portti ja matkustajasilta**: hallin sorina, silloin tällöin kaksisävelinen kuulutusmerkkiääni.
- **Keflavíkin saapuvat**: loisteputken surina 50 ja 100 hertsissä, heikko hallin kaiku, laukkutiskin yläpuolella oleva putki, joka naksahtaa muutaman sekunnin välein, ja silloin tällöin ohi ajava lattianpesukone (suodatetun kohinan hidas paisuminen).
- **Bussipysäkki**: tuulta (kaistanpäästösuodatettua ruskeaa kohinaa kahdella hitaalla LFO:lla), 32 hertsin dieselin tyhjäkäynti kanttiaaltoisella nykimisellä, sadetta.
- **Tie**: moottorin humina, tiemelu, hidas jyrinä.
- **Huone 214**: lämmitys 60 hertsissä, matala kaiku ja noin puolen minuutin välein pieni naksahdus käytävästä.
- **Käytävä**: lähes hiljaisuus, jääpalakone, joka jauhaa kaksi sekuntia kerrallaan, ja harvoin hissin vaijeri – kolmen sekunnin kolmioaaltoääni.
- **Aula**: kahvikoneen hurina, lasiovet, jotka liukuvat auki ei kenellekään.
- **Parkkipaikka**: kovempaa tuulta, soraa.
- **Lähtevät**: sorinaa, loisteputken särmä, läppätaulu, joka kääntyy (neljätoista naksahdusta), kuulutusmerkkiääni.
- **Asematason bussi**: moottori ja sade katolla. **Asemataso**: sade metallia vasten ja suihkumoottorin kiihdytys.
- **Tyhjyys** (tyhjä aloitusnäytön vinjetti ja pimein loppu): 30 hertsin humina ja hidas sydämenlyönnin jumputus.

Kohtauksen päälle **kauhu** lisää kaksi hieman eri vireessä olevaa siniaaltoa noin 40 hertsin tienoilla; niiden voimakkuus nousee tason myötä (hiljaa tasoilla 0–1, kuuluvissa tasosta 2 alkaen) ja sävelkorkeus laskee tason noustessa; tasosta 5 alkaen mukaan tulee tuskin kuuluva 9 kilohertsin vinkuna. Moottori laukaisee kertaäänet: kaksipulssinen värinä jokaisesta viestistä, viisi tasaista jyskähdystä koputuskohtausten avautuessa (koputus on sama, olitpa huoneessa tai käytävällä), kanttiaaltopiippaus, kun lentoyhtiö merkitsee sinut, matala jyskähdys ja sammuva 55 hertsin ääni huonossa lopussa, nouseva kaksisävelinen hyvässä, sekä läppätaulun rätinä, kun aloitusnäytön taulu vaihtaa kieltä.

## 8. Käyttöliittymä

- **Kaksi ruutua: maailma ja puhelin.** Ketju kirjoitettiin *puhelimella, tilanteen keskellä*, joten puhelin on pysyvä toinen henkilöhahmo. Työpöydällä se on kiinteä sarake, jonka akku hupenee päivän mittaan; mobiililaitteella se on alareunasta nouseva paneeli PUHELIN-painikkeen takana, ja painikkeessa on lukemattomien viestien merkki. Ponnahdusilmoitukset kertovat saapuneista viesteistä, jotta pelaaja tuntee värinän samalla hetkellä kuin kertoja.
- **Lähtöaikataulun estetiikka.** Meripihkaa mustalla, tasalevyinen kirjasin, himmeä pyyhkäisyjuova, otsikko, joka välähtää muutaman sekunnin välein. Sähköposti saa lentoyhtiön laivastonsinisen ja kullan sävyisen otsakkeen; chattibotti saa pyöreäkulmaiset puhekuplat ja emojit; paperi saa Arialin ja tahran. Jokainen kanava *näyttää* luotettavuutensa tasolta, mikä on vitsin ydin.
- **Äänen säätö**: yläpalkin ♪. Oletuksena pois päältä vain, jos kytkit sen viimeksi pois.
- **Bisnesluokka**: koneeseen nousun tervetuloviesti tarjoaa maksutonta korotusta. Jos hyväksyt sen, istuimessasi ei muutu mikään – mutta bussikortit menettävät kaikki kirjoitetut tunnusmerkkinsä (nimen, kyltin, Katso tarkemmin -rivit) ja jättävät sinulle luettavaksi pelkät pikselimuotokuvat, täsmälleen niin kuin lentoyhtiön sanamuoto lupasi: "heidän luotetaan löytävän oman tiensä". Hyväksyminen maksaa hieman kauhua. Se on pelin vaikeustaso, valittuna tarinan sisällä eikä koskaan sellaiseksi nimettynä.
- **Kello on aina näkyvissä**, koska jokainen lähdeaineiston kauhunkäänne on ajoituskäänne (kello 9.40:n sähköposti kello 9.00:sta; tiski täsmälleen 3 tuntia ennen). Aika etenee vain valintojen kautta; tosiaikaista painetta ei ole, joten lukeminen on aina ilmaista.
- **Saavutettavuus:** pikselifontit korvautuvat Courierilla, jos Google Fonts ei ole tavoitettavissa; leipäteksti on 21 pikseliä päätekirjasimen luettavuuden vuoksi; mitään tietoa ei välitetä pelkän värin varassa; `prefers-reduced-motion` poistaa käytöstä kaikki animaatiot, myös vinjettien uudelleenpiirrot; `aria-live` tilapalkissa ja ponnahdusilmoituksissa; valinnat ovat näppäimistöllä kohdistettavissa; piirtoalustat ovat `aria-hidden`, koska jokainen visuaalinen tunnusmerkki on myös kirjoitettu korttiin.

## 9. Tekniset valinnat

- **Pelkkää HTML:ää, CSS:ää ja JavaScriptiä, ei käännösvaihetta.** Vaatimuksena on GitHub Pages; yksinkertaisin sinne julkaistava asia ovat staattiset tiedostot, eikä tekstipeli tarvitse sovelluskehystä. `engine.js` ei tiedä tarinasta mitään; `content.js` on tarina eikä tiedä DOM:ista mitään; `art.js` ja `audio.js` eivät tiedä mitään kummastakaan ja vain piirtävät tai soittavat sen, mitä niiltä pyydetään.
- **Kohtaukset ovat tavallisia olioita, joiden kentät voivat olla funktioita.** Teksti, sijainti, valinnat ja jopa bussiluettelot voivat olla muotoa `(G) => …`, jolloin ne reagoivat aikaan ja lippuihin. Näin ehdollinen kerronta pysyy yhdessä paikassa sen sijaan, että kohtauksista tehtäisiin hajallaan olevia muunnelmia.
- **Pikkuruinen ajastettujen viestien jono** (`S.sched`, jonka `advance()` purkaa) on se, mikä saa vitsin "sähköposti tulee 30 minuuttia sen jälkeen, kun nousit bussiin" toimimaan mekaanisesti eikä vain proosarivinä.
- **Siemenluvulla alustettu satunnaislukugeneraattori jokaista pelikertaa kohti** (`mulberry32`), jotta pelikerta on toistettavissa siemenluvustaan, jos joskus haluat lisätä toiminnon "jaa tämä pelikerta".
- **`localStorage` vain loppujen galleriaa, pelikertalaskuria ja viimeksi valittua kieltä varten**, suojattuna `try/catch`-rakenteella yksityisen selausikkunan varalta. Ei keskeneräisen pelin tallennusta: pelikerta kestää 20 minuuttia, ja pysyvä kuolema on koko idea.

## 10. Harkitut asiat ja se, mitä päätettiin

- **Kuoleman jälkeinen "mitä tapahtui" -erittely, joka näyttää tunnusmerkin, jonka ohitit** – hylätty. Suorat ohjeet ovat pelin hengen vastaisia. Loppujen galleria säilyttää yhden rivin vihjeensä, ja sen pidemmälle peli ei suostu selittämään itseään; loput jää toiselle pelikerralle.
- **Ääni** – tehty (§7b), yksi äänimaisema kohtausta kohti yhden yhtenäisen huminan sijaan.
- **Toinen yö pelaajille, jotka myöhästyvät lennolta menettämättä henkeään** – hylätty. Lennolta myöhästyminen on loppu ja pysyy sellaisena. Huonot loput vihjaavat johonkin epämääräiseen ja pahaenteiseen (alas otettu kyltti, varaus, jota ei löydy, kahvikone, joka rykäisee) ja pysähtyvät siihen; niitä ei koskaan pehmennetä jatkoksi.
- **"Bisnesluokka"-vaikeustaso, joka poistaa bussikorteista kirjoitetut tunnusmerkit** – tehty, tervetuloviestin maksuttomana korotuksena (§8).
- **Proosa ei koskaan jätä tilaa auki.** Aina kun teksti riippuu siitä, mitä pelaaja teki – pussi 10-11:stä, sukat, QR-koodi, mies paikalta 31C – se ratkaisee ehdon ja sanoo sen, mikä on totta, ei koskaan "jos sinulla on se". Tämä on nyt sääntö, ja hissiloppu oli se vika, josta sääntö syntyi.

## 11. Suunnittelumuistio itse

Tämä muistio on osa suunnittelua, ja se toimitetaan samalla tavalla kuin peli: `design.html` tuotetaan Markdownista pelin omaan tyyliin, se on olemassa kaikilla neljällä kielellä, avautuu sillä kielellä, jota käyttöliittymä näyttää, kun napsautat aloitusnäytön linkkiä, ja sen yläreunassa on näkyvä kielenvaihdin (EN · FR · ÍS · FI). Käännökset tehtiin samoilla työkaluilla ja samalla tarkistuskierroksella kuin pelin teksti; englanti on totuuden lähde, ja siellä, missä ne ovat eri mieltä, englanti on oikeassa.
