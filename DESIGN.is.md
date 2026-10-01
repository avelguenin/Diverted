# DIVERTED – hönnunarskýrsla

> *„spjallmenni british airways, tölvupóstur british airways og SMS british airways: eitt segir alltaf satt, eitt lýgur alltaf og eitt“*
> – þráðurinn, tíst 29 af 67, ólokið

Þetta skjal útskýrir hvað leikurinn er að reyna að gera og hvers vegna hver hluti hans er smíðaður eins og hann er. Það er skrifað fyrir þann sem vill breyta leiknum, og bendir því líka á kóðann.

## 1. Forsendan, og það sem upprunaþráðurinn gaf okkur

Verkefnislýsingin: hryllingsleikur þar sem flugið þitt London–LA lendir í Reykjavík án skýringa og án áætlunar, dulmálsleg skilaboð og dularfullar rútur fylgja í kjölfarið, og félagið hótar að skilja þig eftir ef þú kvartar. Rangur póstur, röng rúta, röng kvörtun: leiknum lokið.

Meðfylgjandi þráður er ekki hryllingssaga. Hann er mjög fyndin, mjög þreytt frásögn af því þegar raunverulegu flugi var beint annað. En sé hann lesinn sem *kerfishönnun* er hann næstum fullbúið leikjahönnunarskjal, því höfundurinn tekur sífellt eftir sömu þremur hlutunum:

1. **Upplýsingar koma ekki þaðan sem þær ættu að koma.** Opinberar boðleiðir (tölvupóstur, SMS, spjallmenni) eru seinar, mótsagnakenndar eða líkamlega ómögulegar („klukkan 9:40 fengum við tölvupóst um að rútur myndu sækja okkur klukkan 9:00“). Áreiðanlegu heimildirnar eru *vatnsblettótt A4-útprentun í Arial* og *tilviljunarkenndir farþegar sem bera orðróm á milli*.
2. **Eina leiðin til að vita að þú sért á réttum stað er að þekkja aðra farþega aftur**, „þrátt fyrir að muna andlit illa“, og að taka eftir að þeir eru í sömu fötum og í gærkvöldi.
3. **Yfirvaldið er kurteist, drottnandi, biðst aldrei afsökunar og hótar opinskátt** („Ég ræð hér og öryggi viðskiptavina okkar er tantamount“; „hann myndi skilja fólk eftir á Íslandi ef það streittist á móti eða mótmælti“).

Auk þess ein lína sem er bókstaflega viðmótslýsing: *„ímyndið ykkur tölvuleikjamæli, nema fyrir taugarnar í mér, sem tifar niður í ‚þunna skjálfandi rauða sneið‘-svæðið.“*

Hvert einasta atriði í leikkerfinu er ein af þessum athugunum, gerð bókstafleg. Hryllingnum er ekki bætt ofan á gamanið; hann er það sem gamanið snýst þegar um, þegar hughreystingarnar eru fjarlægðar.

### Þráður → leikur: kort yfir atriðin

Leikurinn hefst fjörutíu mínútum á undan þræðinum, við hliðið, því hryllingurinn þarf sitt *á undan*: farþegarými sem er eðlilegt nógu lengi til að leikmaðurinn hafi sæti, sessunaut, máltíð og rútínu til að missa. Hvert einasta atriði síðari ógnarinnar er gróðursett þar í saklausri mynd – orðalagið í öryggiskynningunni, talningarspjaldið, sá vani yfirflugþjónsins að horfa á fólk frekar en pappíra – þannig að þegar ógnin kemur er hún þekkt aftur frekar en kynnt til sögunnar.

| Þráður | Leikur |
|---|---|
| Venjulegt flug þar til það hættir að vera það; fluginu beint annað vegna læknisneyðartilviks; farið úr vél að nóttu; áhöfnin horfin við vegabréfaeftirlitið | `boarding` → `takeoff` → `service` → `night`: fjórar klukkustundir af flugvél sem virkar nákvæmlega eins og hún á að gera, með yfirflugþjóni sem heilsar andlitum en ekki brottfararspjöldum, sýnir öryggisbúnaðinn sjálfur („öryggi viðskiptavina okkar er tantamount“ sagt eins og ekkert sé sjálfsagðara), gengur á eftir matarvagninum án þess að bera fram, og gengur um dimman ganginn með lítið spjald og telur; tjald dregið fyrir fremst. Svo `cabin`, og síðar `landing` – áhöfnin gengur í gegnum dyr „sem lokast ekki svo mikið sem hætta að vera dyr“ |
| Farþegar mótmæla leiðarbreytingunni; yfirflugþjónninn bregst við með því að hóta að skilja eftir hvern þann sem mótmælir | `cabin` → `cabin_purser`: tilkynning flugstjórans æsir upp farþegarýmið (maður við eldhúsið, kallhnappur sem þagnar ekki), leikmaðurinn getur tekið þátt, og hótunin kemur *sem afleiðingin* – auk **SKRÁÐ**-punktanna og `objected`-flaggsins sem fylgir þér eftir |
| Tölvupóstur býður hótel *á Heathrow* | `heathrow`/`car` – endirinn KOMIÐ FYRIR |
| Engin innrituð taska, allt lokað, enginn matur og ekkert tannkrem | Hótelnæturmiðstöðin: snakk og lítil vínflaska („girl dinner“), örsmá sjampó, 20 mínútna gangan í 10-11 |
| „Einkennisklæddir Íslendingar sem sögðu okkur að fylgja ekki leiðbeiningunum í tölvupóstunum heldur fara upp í rúturnar“ | `icelander` – „Ekki fylgja tölvupóstunum. Það eru rútur.“ |
| Rútur af óþekktum uppruna, enginn tilkynnti þær, einn náungi í flísjakka sagði „að því er sagt er“ | Rútuskoðunarsenurnar; orðrómur sem auðlind |
| Rútuferðin er óþægilega löng; smábarn andvarpar „þvílíkur dagur“ | `ride` |
| Tölvupóstur um „rútur“ berst 30 mínútum eftir að farið var um borð, án staðsetningar | Tímasett skilaboðakerfi: `G.at(t + 30, 'email', …)`, tímastimplað áður en það berst |
| Arial-útprentunin segir 11:00; tölvupóstur klukkan 9:40 segir 9:00; spjallmennið segir eitthvað annað | Flipinn **Pappír** á móti **Pósti** á móti **Ally**; tálrútan klukkan 09:00; MÆTTI EKKI ef þú bíður eftir nákvæmlega prentaða tímanum |
| „Það var rúta fyrir utan… ‚kannski ættirðu að flýta þér‘“ – að þekkja farþega aftur er eina staðfestingin | `buses2`: rétta rútan er sú með fólki í fötunum frá í gær |
| Uppástungur um heitar laugar úr svörunum | Endirinn TANTALUS og skilaboðin frá Jo |
| Algengum spurningum um UK261 breytt í QR-kóða sem öllum farþegum er sýndur; „ég er tilbúin að vera karen“ | `uk261`-flaggið og mælirinn **SAMSTAÐA**; að deila því er *örugga* leiðin til að kvarta |
| Sjálfsafgreiðsluvélin bilar tvisvar; eitt afgreiðsluborð; opnar nákvæmlega 3 klst. fyrir brottför; brottförin færist sífellt aftar | Miðstöðin `airport`, breytan `dep` og tölvupósturinn klukkan 12:00 um „endurskoðaða brottför“ sem færir afgreiðsluborðið |
| Hliðvörður öskrar um hópnúmer, hundrað manns hlæja | `gate` |
| Landgangur → rúta → alvöru þjóðvegur gegnum beitilönd → „ég held ég sjái flugvélina okkar“ → rigning | `jetbridge`, `tarmac`, `plane` |
| „Meirihluti viðskiptavina hefur sýnt skilning og þolinmæði“; endurgreiðslan á þráðlausa netinu | Góðu endarnir |
| „Sjáumst í portland… eða á grænlandi. eða í helvíti.“ | HEIM (EÐA GRÆNLAND, EÐA HELVÍTI) |

Nöfn og flugfélagið eru skálduð (Albion Atlantic, „Við erum að gera okkar best“). Áfangastaðurinn er Los Angeles samkvæmt verkefnislýsingunni. Keflavík er saklaus.

## 2. Það sem fengið var að láni úr viðmiðunarleikjunum tveimur

### Úr *No, I'm Not a Human*: skimun eftir kennimerkjum

Kjarnalykkja þess leiks er: eitthvað kemur að dyrum þínum og þykist vera það sem þú þarft; þú skoðar það eftir litlum líkamlegum kennimerkjum; þú hleypir því inn eða ekki; reglurnar um hvað telst kennimerki eru skammtaðar í dropatali gegnum óáreiðanlega útsendingu; að hafa rangt fyrir sér er banvænt; umferðir eru stuttar og endunum er safnað.

DIVERTED varpar þessu eitt á móti einu yfir á rútur:

- **Gesturinn er rúta.** Hver rútusena (`buses1`, `buses2`, auk gildranna með einni rútu, `decoy_morning` og `walk`) sýnir 2–3 farartæki með nafni, skilti, tveimur sýnilegum smáatriðum og tveimur eða þremur **földum smáatriðum** sem *Skoða nánar* afhjúpar, og það kostar mínútur. Að fara um borð er óafturkræfa athöfnin.
- **Kennimerkin eru hluti af sögunni og samkvæm sjálfum sér í gegnum allan leikinn.** Rétta rútan er alltaf: með handskrifað skilti eða skilti með tússi (Arial/pappír, aldrei LED); með bílstjóra í endurskinsvesti sem er sama um þig; með fólk um borð sem þú þekkir aftur, í fötunum sem það flaug í. Ranga rútan er alltaf: með skjaldarmerkið og LED-skjáinn; með bílstjóra í einkennisbúningi *horfnu áhafnarinnar* sem brosir til þín sérstaklega; með úthvílda ókunnuga í hreinum skyrtum, sem eru ekki með símana uppi. Þriðji kosturinn (Flybus, skutlan að Bláa lóninu) er ekta rútan sem er samt ekki þín, og kennimerki hennar er að farþegarnir eru með farangur eða í hreinum sokkum – hluti sem þig skortir áberandi.
- **Útsendingin sem kennir reglurnar er orðrómur.** Í NINAH er það sjónvarpið. Hér er það Íslendingurinn, maðurinn í flísjakkanum, konan með smábarnið, maðurinn með Blazers-derhúfuna og nafnlaust SMS úr +354-númeri: „ekki fara uppí þá fínu“. Að tala við fólk hækkar falda samstöðutölu og opnar vísbendingarlínur undir senutextanum. Opinberu boðleiðirnar eru aftur á móti *lyga*-rásin. Leikmaðurinn þarf að læra að merkið er kennimerki hættunnar – og snúa þannig við traustsstigveldinu sem vörumerki flugfélagsins er hannað til að koma inn hjá fólki.
- **Smáatriðin eru slembiröðuð í hverri umferð** (röð, litamerking, orðalag pappírsskiltisins) með slembitölugjafa með fræi, þannig að svarið verður ekki lagt á minnið sem „sú til vinstri“; það þarf að *lesa* það. `G.pick` / `G.shuffle` í `content.js`.
- **Varanlegur dauði, stuttar umferðir, endasafn.** Umferð tekur 20–30 mínútur. Tólf endar, tíu slæmir, geymdir í `localStorage` og sýndir sem læst spjöld með vísbendingu í einni línu, þannig að safnið sjálft er mjúk leiðsögn („Einhver tilkynnir alltaf eitthvað.“ / „Hún var með skjaldarmerki. Hún var mjög fín.“).

### Úr *Don't Look Outside*: herbergið, þarfirnar, reglan

Framlag þess leiks er lögun miðþáttarins: þú kemst hvergi; þú hefur litlar hversdagslegar þarfir (borða, sofa, halda sönsum); nóttin er hættutíminn; og það er yfirlýst regla sem allur leikurinn snýst í raun um – hvort þú brjótir hana.

- **Herbergin.** Hótelið er fjórar miðstöðvarsenur – `room`, `corridor`, `lobby`, `carpark` – sem þú ferð á milli, auk leiðarinnar í 10-11. Aðgerðalistarnir *eru* birgðaskrá þráðarins yfir litlar hörmungar: ekkert tannkrem, örsmáu sjampóin, snakk-og-lítil-vínflaska, að fletta upp réttindum sínum, að pósta um þetta, ísvélin, krossgáta næturvarðarins. Ekkert hér er þraut; þetta er áferð, og hver aðgerð skilar annarri málsgrein (§5), þannig að sama herbergið er aldrei sama herbergið tvisvar.
- **Þarfirnar eru ekki lífsbaráttuhermir.** Það er engin hungurklukka. Matur, te, sturta, annað fólk og svefn skipta aðeins máli vegna þess að þau draga mælana tvo örlítið niður (§4b); að gera ekkert er alltaf leyfilegt og ekkert hér sveltir þig.
- **Reglan.** „Vinsamlegast ekki líta út um gluggann“, sem spjallmennið flytur klukkan 04:50, er eina berorða skírskotunin í *Don't Look Outside*. Að horfa er *ekki* banvænt – það væri ódýrt bragð – en það setur `seen`, sem yfirflugþjónninn vísar til síðar, í rútunni á flughlaðinu: „Þú horfðir.“ Kostnaðurinn er uggur sem fylgir þér áfram, ekki leikslok. Bankið klukkan 04:30 („Rúta fyrir Albion Atlantic farþegar. Brottför núna. Síðasta kall.“) er raunverulega prófraun næturinnar: það er tíminn sem *spjallmennið* gaf upp, og aðeins pappírsskiltið stangast á við hann.
- **Nóttin sem hættutíminn.** Sérhvert banvænt val á hótelinu er að nóttu til (gangan, bankið – sem finnur þig hvar sem þú ert, í herberginu eða á ganginum – rútan á bílastæðinu, lyftan sem kemur af sjálfu sér; glugginn er sá sem er ekki banvænn). Morgunninn er tiltölulega öruggur þar til rúturnar koma, og þannig taktar viðmiðunarleikurinn þetta líka: húsverk, svo dyrnar.

## 3. Boðleiðirnar þrjár („eitt segir alltaf satt, eitt lýgur alltaf og eitt“)

Þráðurinn kláraði aldrei setninguna. Leikurinn gerir það, nokkurn veginn:

| Boðleið | Hegðun | Hvernig hún er smíðuð |
|---|---|---|
| **Póstur** (Albion Atlantic, með skjaldarmerki) | Alltaf *seinn* og um rangan hlut. Sendingartími og móttökutími eru sýndir hvor í sínu lagi þannig að leikmaðurinn sjái tölvupóstinn um rútuna klukkan 09:00 berast klukkan 09:40. | `G.at()` með `stamp` fyrr en afhendingu; póstsýnin prentar hvort tveggja. |
| **Ally** (spjallmenni) | *Lýgur* alltaf, en nákvæmlega og gagnlega: það nefnir gildruna sem þú ert að fara að ganga í (rúta 03:40, flutningur 08:00, „herbergi 214, ekki líta út um gluggann“). Einnig fljótlegasta leiðin til að verða SKRÁÐ. | `CONTENT.chat` – svörin eru föll af stöðunni; „Ég vil kvarta“ kallar á `G.strike()`. |
| **SMS** | Strjál. Tvö frá flugfélaginu (röng), eitt frá vini (heitar laugar), eitt úr óþekktu númeri (rétt). | Venjulegar bólur; óþekkta númerið er eina ótvíræða vísbending leiksins og hún er viljandi afneitanleg. |
| **Pappír** | *Sannleikurinn.* Allt sem er prentað í Arial og límt á eitthvað. Leikmaðurinn tekur mynd af því og það fer í flipa sem er settur í ekta Arial með vatnsbletti. | `renderPaper()` í `engine.js`; `.paper-sheet` í CSS. |

Hönnunarmarkmiðið er að við aðra rútusenuna sé leikmaðurinn farinn að kíkja fyrst á Pappírsflipann og lesa skjaldarmerkið sem ógn. Sá viðsnúningur – að merkta, hannaða, fagmannlega orðaða boðleiðin sé sú hættulega; ljóta, handgerða sú örugga – er kenning leiksins og kemur beint úr tísti 32: „hundruð annarra sem kjósa að treysta vatnsblettóttu útprentuninni í arial frekar en tölvupóstunum með BA-merkinu, af því að við vitum öll betur.“

## 4. Að kvarta

Verkefnislýsingin segir að *röng kvörtun* sé fallstaða. Þráðurinn leggur til flokkunina:

- Að kvarta **við flugfélagið** – í farþegarýminu, við spjallmennið, við afgreiðsluborðið, við hliðið eða með því að heimta töskuna sína – er **SKRÁÐ**. Einn punktur hverju sinni. Yfirflugþjónninn skrifar á lítið spjald. Við þrjá bregst flugfélagið við *þar sem það getur* – við innritunarborðið eða hliðið, aldrei á hótelinu – og þá kemur SKILIN EFTIR: „viðskiptavinir sem streitast á móti eða mótmæla rekstrarlegar ákvarðanir geta verið affermdir“, sagt án nokkurrar óvildar.
- Að kvarta **hvert við annað** – bera saman bækur, deila UK261-QR-kóðanum, hlæja að hliðverðinum – er talið í hljóði. Það er eina tegundin sem hjálpar. Hún opnar vísbendingar og, við 5+, betri endinn, SJÁLFSTJÓRNARSAMFÉLAGIÐ LHR–LAX, sem er orðalag þráðarins sjálfs um það sem farþegarnir urðu.

Það er ein falin kvörtun: að staðfesta Heathrow-hótelið og fara svo *ekki* upp í bílinn setur `booked`, og innritunarfulltrúinn bendir síðar á að „skrár okkar sýna að þér var komið fyrir“ – skráning sem þú vannst þér inn tólf tímum fyrr með því að treysta tölvupósti. Það er afleiðingin af „að treysta röngum pósti“ fyrir leikmenn sem sluppu við þá augljósu.

## 4b. Mælarnir tveir: hvað þeir gera og, sem meira máli skiptir, hvað þeir gera ekki

Fyrstu drögin höfðu taugastiku sem tæmdist og drap þig, og hættulegir kostir voru merktir með rauðu. Hvort tveggja er farið. Reglurnar núna:

- **Tveir mælar, báðir fyllast, hvorugur bindur enda á leikinn.** TAUGAR fyllast við átök og streitu; UGGUR fyllist við hlýðni og við að horfa á hluti sem þér var sagt að horfa ekki á. Lítil val hreyfa þá um nokkur stig. Tíminn hreyfir þá örlítið (taugar +1 á hverjum 40 mínútum vakandi; uggur +1 á hverjum 30 mínútum milli miðnættis og dögunar). Svefn, matur, sturta, hlátur og annað fólk draga þá niður. Þeir þrír sem gerast inni í herberginu draga *báða* mælana niður, misjafnlega mikið, þannig að enginn þeirra er ókeypis núllstilling: sturtan mest (−6 taugar, −3 uggur), teið næstmest (−5, −2), að reyna að sofa minnst (−4, −3; og aðeins −2, −1 þegar bankið er þegar á leiðinni, af því að þú varst alveg, alveg að sofna). Það er hvergi í leiknum neitt „mælir nær hámarki → dauði“-augnablik.
- **Eina áhrif þeirra eru að loka kostum.** Hvert val getur borið `nerveMax` eða `dreadMax`. Þegar mælir er kominn yfir þá tölu er kosturinn enn á listanum, en yfirstrikaður og óvirkur, með ástæðu í einni línu sem er skrifuð fyrir þann kost (`whyNot`): sá sem er á taugum getur ekki legið kyrr, myndi hella niður teinu, myndi hreyta ónotum í manninn í flísjakkanum; sá sem er bugaður getur ekki flett upp réttindum sínum, getur ekki snúið baki í rútuna, getur ekki gengið í átt að manninum sem bankar. Ástæðurnar nefna aldrei mæli, en hvor fjölskylda heldur sínum keim – skjálfti og skapofsi öðrum megin, lömun og hlýðni hinum megin – þannig að hægt er að læra á þær. Háar taugar taka burt rólegu, þolinmóðu, félagslyndu kostina og skilja átakakostina eftir. Hár uggur tekur burt þrjósku, sjálfstæðu kostina og skilur hlýðnu kostina eftir. Þannig drepa mælarnir þig aldrei; þeir skilja þig eftir með valkostina sem þú hefðir hvort eð er valið ef þú værir svona á taugum eða svona bugaður, og *sumir* þeirra eru banvænir.
- **Enginn einn fallpunktur.** Þröskuldarnir eru fyrir hvern kost fyrir sig og viljandi ójafnir: að tala við eldri hjónin þarf taugar ≤75, flísjakkamanninn ≤90; að hafna bankinu þarf ugg ≤80, að bakka frá gægjugatinu ≤88, að ganga í 10-11 ≤70, brunastigann ≤92. Leikmaður sem hefur verið að mestu hlýðinn alla nóttina kemur að bankinu með ugg í áttatíu og eitthvað og kemst að því að „ekki opna“ er horfið – en „líta í gegnum gægjugatið“ er enn til staðar, og að baki því eitt tækifæri í viðbót. Hver trekt hefur fleiri en einn vegg, og hver veggur er á öðrum stað.
- **Tvenns konar kostir, tvö stef, aldrei merkt.** Átakakostir (`kind: 'conflict'`) bera stef taugastikunnar: rauða vinstri brún sem þykknar og textaskugga sem roðnar eftir því sem taugarnar hækka, og á efstu þrepunum skjálfa þeir. Hlýðniskostir (`kind: 'comply'`) bera stef uggsstikunnar: dökkbláa slikju flugfélagsins og gullinn bjarma sem magnast eftir því sem uggurinn vex, gullið ✦ í stað örvarinnar, og textinn stækkar örlítið. Stikurnar nota sömu liti, þannig að eftir eina eða tvær umferðir getur leikmaðurinn áttað sig á hvaða stika stjórnar hvorri fjölskyldu – leikurinn segir það aldrei. Það er kennslulykkjan sem verkefnislýsingin bað um: þú lærir í gegnum umferðirnar hvers konar kostur hver hlutur er, áður en þú lærir hvort hann er góður eða slæmur.
- **Hvorug fjölskyldan er „sú slæma“.** Sumir hlýðniskostir eru réttir (sitja kyrr í rútunni á flughlaðinu, fara um borð eftir hópum, ekki horfa út um gluggann, bíða eftir afgreiðsluborðinu); sumir átakakostir eru réttir eða skaðlausir (mótmæla í farþegarýminu, heimta töskuna, spyrja bílstjórann). Sumir af hvorri tegund eru leikslok (opna dyrnar, fara í lyftuna, fara upp í rútuna með skjaldarmerkinu; heimta að fá að fara út úr rútunni á flughlaðinu). Stefið segir þér *lundarfar* valsins, ekki útkomu þess.
- **Endurtekning er ódýr.** Að gera það sama tvisvar á sama stað kostar helmingi minna á mælunum (`engine.js`, `choose()`), þannig að leikmaður sem athugar dyrnar fjórum sinnum er kvíðinn, ekki dauðadæmdur.
- **Stilling.** Sjálfvirkar prófunarreglur (`tools/playtest.js`: hlýðin, átakasækin, slembin, „skynsöm“ og handskrifuð varfærin leið) voru keyrðar á öllum þremur tungumálunum. Varfærin umferð endar með taugar í kringum 0–10 og ugg um 60 án þess að nokkur kostur hafi nokkurn tíma lokast; hrein hlýðniumferð kemur að bankinu með ugg 70–100 og er yfirleitt trektuð í NÆTURRÚTU eða LYFTUNA; átakaumferð nær taugum 75–100, missir getuna til að hlæja við hliðið eða bíða við afgreiðsluborðið, og safnar SKRÁÐ-punktum fram að innritun. Slembikönnuðir sem pota í hvert dimmt horn metta báðar stikurnar fyrir 04:00, sem er ætluð refsing fyrir að fara með hótelið eins og gátlista.

## 5. Texti sem endurtekur sig aldrei

Miðstöðvarsenur byggja málsgrein sína úr þremur hlutum (`hub()` í `content.js`): stuttri fastri stöðulínu sem segir hvar þú ert og hvað amar að þér (*„Herbergi 214. 03:40. Þú getur ekki sofið fyrir þreytu, og tennurnar í þér eru skítugar, og þú hefur ekkert borðað.“*), útkomu þess sem þú varst að gera (`G.note()`, sett af aðgerðinni), og einni umhverfislínu sem dregin er úr safni fyrir þann stað. Umhverfislínur bera uggsþrep; valið kýs línur á eða rétt undir núverandi þrepi og endurtekur aldrei þá síðustu sem notuð var, þannig að sama anddyrið á uggsþrepi 2 er krossgáta og ferðaplakat, og á þrepi 5 segir næturvörðurinn „Hann spurði eftir þér“ án þess að líta upp. Endurtakanlegar aðgerðir (að athuga dyrnar, sjónvarpið, gluggann, ísvélina, sjálfsalann) lykla útkomu sína á því hve oft þú hefur gert þær og á uggnum, þannig að fjórða dyraathugunin les öðruvísi en sú fyrsta. Ekkert í miðstöð birtir sömu málsgrein tvisvar í röð.

Tvær reglur um textann sjálfan, hvor um sig sett eftir villu:

- **Prósinn hikar aldrei um stöðu.** Hvar sem textinn er háður því sem leikmaðurinn gerði – pokinn úr 10-11, sokkarnir, QR-kóðinn, maðurinn úr 31C – leysir hann úr skilyrðinu og segir það sem er satt, aldrei „ef þú átt það“. Þetta er regla núna, og lyftuendirinn var villan sem gerði hana að reglu.
- **Prósinn veit aldrei það sem leikmaðurinn veit ekki.** Fylgireglan, úr næstu lotu af villum: textinn má aðeins nota það sem *þessi* umferð hefur sýnt leikmanninum. Salurinn bauð áður „Fara þangað sem flíspeysan benti“ hvort sem þú hafðir talað við hann eða ekki, og rútustæðið hvíslaði „Ekki þá fínu“ að leikmönnum sem höfðu aldrei hitt konuna með smábarnið. Nú er leiðin út úr salnum orðuð eftir því sem þú komst að þar (bending flíspeysunnar, „það eru rútur“ Íslendingsins, móðirin sem virðist vita hvert hún er að fara, eða bara straumurinn gegnum hurðina sem segir ekki neitt); vísbendingin undir rútunum birtist aðeins ef móðirin sagði hana; 216 er „herbergi flíspeysumannsins“ aðeins ef þú sást hann fá lykilinn, og „herbergið við hliðina“ annars; gengið er „í 10-11“ aðeins ef næturvörðurinn nefndi búðina, og „að skiltinu við gatnamótin“ ef ekki; morgunrútan sem þú ferð út að svipast um eftir er sú klukkan 08:00 þar til tölvupósturinn um 09:00 hefur í raun borist; parið í sófanum er „parið frá glugganum“ aðeins ef þú hittir þau í salnum; endirinn NÆTURRÚTA opnast úr herberginu, af ganginum eða af bílastæðinu, eftir því hvar þú varst; ÁHÖFNIN rennur út af rútustæði eða bílastæði eftir því hvert hún fór með þig; og „Ganga út að fjærendanum. Í átt að skuggamyndinni.“ á bílastæðinu er aðeins orðað þannig þegar stöðulínan hefur sett þar skuggamynd (frá uggsþrepi 3), og verður „í átt að rútunni“ þegar þú hefur séð hana. Vélin fékk `G.did(key)` fyrir þetta – próf á því hvort aðgerð sem gerist aðeins einu sinni hafi átt sér stað – þannig að efnið geti spurt „talaðirðu við hann“ án þess að búa til flagg fyrir hvert einasta samtal. Yfirferðin náði til hverrar senu; prófunarsafnið keyrir nú hverja þessara greina í báðar áttir.

## 5b. Stigmögnun

Uggurinn stýrir líka framsetningunni, í sex þrepum (`data-dread` á rótarstakinu, sett út frá mælinum):

- Síðan dökknar: vinjettan þrengist, skannlínurnar þykkna, titillinn flöktir hraðar, á þrepi 5 titrar senutextinn, á þrepi 6 verður staðsetningarlínan rauð.
- Klukkan lýgur: frá þrepi 3 sýnir hún á nokkurra sekúndna fresti `--:--` eða tíma frá því fyrir mörgum klukkustundum í fimmtung úr sekúndu.
- Myndirnar hrörna: frá þrepi 3 birtist vera í dökkbláu með hvítan kraga við jaðar senuvinjettanna, oftar eftir því sem uggurinn vex; frá þrepi 4 detta rammar stöku sinnum í svart; endurteiknunartíðnin hækkar.
- Spjallmennið færist nær: frá þrepi 3 fá svör Ally aðra línu (*„Þú ert ennþá í herbergi 214.“*, *„Vinsamlegast vera áfram þar sem þú ert.“*); á þrepi 5, *„Af hverju ert þú enn hér?“*
- Rafhlaða símans fellur úr 31% á Heathrow niður í einn tölustaf við hliðið, og það er ekkert hleðslutæki, því hleðslutækið er í töskunni, og taskan er í kerfinu.
- Dagsbirtan hjálpar: að sofa (eða mistakast það) klukkan 07:30 tekur 25 stig af uggnum. Flugvöllurinn og hliðið setja hluta þeirra aftur.

## 5c. Fjögur tungumál, fjórar reinar

Leikurinn er til á ensku, frönsku, íslensku og finnsku. Valið er gert í fyrstu senu leiksins: farið um borð á Heathrow, fjórar reinar, fjögur skilti (*Lane A · English / Voie B · Français / Rein C · Íslenska / Kaista D · Suomi*), hliðvörður sem öskrar um reinar – spegilmynd hliðvarðarins í Keflavík sem öskrar um hópa fjórtán klukkustundum síðar. Að velja rein ákveður tungumálið sem flugfélagið hefur lofað að þjóna þér á.

Hvers vegna þessi fjögur, svo það sé skráð: enska af því að upprunaþráðurinn er á ensku; franska af því að höfundurinn er franskur og vill sýna fjölskyldu sinni leikinn; finnska af því að höfundurinn, í lok langs dags, trúði því í stutta stund að Reykjavík væri í Finnlandi, og útgáfunni var haldið sem minnisvarða um það; íslenska af því að Reykjavík er, þegar betur er að gáð, á Íslandi.

Hver talar hvað er hluti af hönnuninni, ekki tilviljun þýðingar:

- **Flugfélagið talar tungumálið þitt illa.** Í frönsku og íslensku útgáfunum eru tölvupóstarnir, spjallmennið, tilkynningar yfirflugþjónsins og starfsfólkið við afgreiðsluborðið á vélþýddri, hálfbrotinni frönsku eða íslensku – ensk orðaröð, röng föll, „tantamount“ óþýtt, slagorðið tökuþýtt sem *Nous faisons notre meilleur* / *Við erum að gera okkar best*. „Við erum stolt að þjóna þig í tungumál þíns vals“ er loforð flugfélagsins, og þetta er það sem loforðið er virði. Það er líka lítið hryllingsbragð: eina röddin með vald er sú sem getur ekki alveg talað við þig.
- **Heimamenn tala vel.** Í íslensku útgáfunni tala konan á flugvellinum og næturvörðurinn almennilega íslensku – þau eru heiðarlegu raddirnar, og þau eru heima hjá sér. Í frönsku útgáfunni svara þau á ensku (franskur ferðalangur í Keflavík yrði ávarpaður á ensku), sem er skilin eftir óþýdd inni í frönsku frásögninni; ef þú spyrð þau hvort þau tali frönsku skipta þau yfir í stamandi, vinalega frönsku það sem eftir er nætur (*« Onze. C'est écrit onze. Peut-être vous dormir. »*). Spurningin er raunverulegur kostur á flugvellinum og í anddyrinu, aðeins í frönsku útgáfunni.
- **Finnska útgáfan** er bein þýðing, endurskoðuð með tilliti til eðlilegs máls eftir að finnskur lesandi benti á enskuslettur í fyrstu drögunum; íslenska og franska frásögnin fengu sömu yfirferð (franskan fylgir líka reglunni um stutt þankastrik með bilum, « – », aldrei langt þankastrik, utan eigin texta flugfélagsins). Allar þrjár ættu samt að vera lesnar yfir af innfæddum áður en nokkrum eru sýndar þær í alvöru.

Tæknilega séð er `content.js` heimildin sem gildir; hinar þrjár skrárnar eru framleiddar úr henni með því að skipta út hverjum strengjafasta gegnum orðabók (`tools/i18n.py`, `tools/dict_*.json`), þannig að útgáfurnar fjórar geta ekki rekið í sundur í rökvísi, aðeins í prósa. Línur sem heimamenn segja eru vafðar í `LX(...)` í frumkóðanum; framleiðandinn skilur þær eftir á ensku fyrir frönsku, og franska skráin ber aðra litla töflu (`tools/dict_fr_broken.json`) fyrir stamandi-frönsku afbrigðið. Vélin heldur `CONTENTS`-skrá og skiptir um virka innihaldið þegar rein er valin; reinasenan sjálf býr í `engine.js` af því að hún er eina senan sem þarf að vera til áður en tungumál er til.

**Titilskjárinn** er eini staðurinn þar sem gestur kemur áður en tungumál er valið, svo hann hegðar sér eins og upplýsingaskjár á flugvelli: á nokkurra sekúndna fresti flettir hann í gegnum tungumálin fjögur – undirtitil, kynningartexta og hnappa – með flettispjaldahreyfingu, og hættir að fletta um leið og rein er valin. Ekkert á honum segir „veldu tungumál“; hann heldur bara áfram að sýna þér þitt eigið þar til þú ferð um borð.

## 6. Tónn

Þráðurinn er skrifaður með þurrum húmor, og þurrleiki er rétta tóntegundin fyrir ugg. Því:

- **Ástæðan fyrir leiðarbreytingunni er aldrei útskýrð umfram það sem þráðurinn hafði.** Þráðurinn hefur hana aðeins eftir öðrum: „læknisneyðartilvik“, yfirflugþjónn sem gefur í skyn að farþeginn sé á fyrsta farrými, og í lokin „að sögn á gjörgæslu – ég veit ekki hversu trúverðug sú uppfærsla er“. Leikurinn heldur nákvæmlega því: flugstjórinn segir að viðskiptavinur sé lasinn, tjald er dregið fyrir, ef þú gengur fram hjá því sérðu einhvern á eldhúsgólfinu og teppi og þér er ekki sagt hvað er að, og góði endirinn óskar „manninum á gjörgæslunni“ góðs bata eftir orðrómi. Ekkert er nokkurn tíma staðfest, og enginn endir útskýrir það.
- **Engin bregðuatriði, ekkert blóð, ekkert yfirnáttúrulegt er nokkurn tíma staðfest.** Áhöfnin „hverfur“. Rútufarþegarnir eru „úthvíldir“. Teppið er blautt. Yfirflugþjónninn lítur upp í gluggann þinn. Berorðara verður það ekki. Ímyndunarafl leikmannsins sér um afganginn, sem er bæði ódýrara og óhugnanlegra.
- **Rödd flugfélagsins breytist aldrei.** Hver einasta hótun er flutt á máli þjónustuversins. „Við erum að gera okkar best“ birtist í farþegarýminu, í neðanmáli hvers tölvupósts, við rútudyrnar í myrkrinu og við innritunarborðið. Sú síðasta er í dagsbirtu og henni er ætlað að vera verst.
- **Raunverulegir brandarar eru látnir standa** – önnur sjálfsafgreiðsluvélin, girl dinner, endurgreiðslan á þráðlausa netinu – af því að þeir eru það sem manneskja tekur í raun eftir á 26. klukkutímanum, og af því að hláturinn *er* lífsbjargarkerfið. Hver hlátur í leiknum tekur nokkur stig af báðum mælunum.
- **Ísland er ekki ógnin.** Þráðurinn er afdráttarlaus um þetta og leikurinn líka: Íslendingurinn er fyrsta heiðarlega röddin, 10-11 er „upplýst eins og helgiskrín“, endirinn HAGARNIR hefur mjög fallegar kindur.

## 7. Sjónræn hönnun

Báðir viðmiðunarleikirnir eru í lágri upplausn, gruggugir, og leyfa þér að *horfa* á það sem þú ert að taka ákvörðun um. Grafíkin hér fylgir því, með einni takmörkun: engar myndaskrár. Allt er teiknað reikniritlega í `art.js` á örsmáan striga (160×72 fyrir senur, 128×64 fyrir rútur) og skalað upp með `image-rendering: pixelated`, þannig að kóðasafnið er áfram sex textaskrár og útlitið samkvæmt sjálfu sér í hvaða stærð sem er.

- **Senuvinjettur.** Hver sena og endir ber `art`-lykil sem velur málara: farþegarýmið með kveiktu beltaljósi, ísskápslýst flugstöðin með dyrunum sem segja ekkert, rútustæðið undir natríumlampanum, vegurinn gegnum hraunið, glugginn á herbergi 214 (sem sýnir rútuna á bílastæðinu aðeins ef þú hefur horft), gangurinn með blauta teppinu, anddyrið með A4-skiltinu, brottfarartaflan með einni rauðri línu, landgangurinn sem endar í rútu, hagarnir, flugvélin í rigningunni. Þær eru endurteiknaðar tvisvar á sekúndu með nýju fræi, þannig að ljósaperur flökta, rigning fellur og fólk hreyfist – *Don't Look Outside*-bragðið með kyrrmynd sem er ekki alveg kyrr. Endurteiknun stöðvast undir `prefers-reduced-motion`.
- **Rútumyndir.** Hvert rútuspjald hefur mynd sem er framleidd úr lítilli lýsingu (`livery`, `windows`, `passengers`, `sign`, `driver`). Þetta er gægjugat *No, I'm Not a Human*: kennimerkin eru sýnileg áður en þú lest orð, ef þú veist hvert á að horfa. Rútan með skjaldarmerkinu hefur hlýja, bjarta glugga og eina eins uppréttu skuggamynd í hverjum glugga. Venjulega rútan hefur daufa glugga og farþega sem hanga í mismunandi hæð, suma glugga tóma, einn með tveimur manneskjum. Flybus hefur farangursgrindur. Lónskutlan hefur handklæði. Bílstjórinn er í endurskinsvesti, dökkbláum jakka með hvítum kraga, eða engu sérstöku. Ekkert af þessu er merkt; önnur umferð kennir þér að lesa það.
- **Ramminn.** Eitt dökkt þema, viljandi: klukkan er tvö að nóttu á lokuðum flugvelli í hverri senu. Fletir eru hlýtt næstum-svart með 4px-punktamynstri; spjöld hafa tveggja pixla skáhorn með hörðum skugga, eins og svargluggi frá tíunda áratugnum sem hefur verið skilinn eftir í reykherbergi. Meginmál er sett í VT323 (skjáletri) í 21px vegna læsileika, merkingar og titlar í Press Start 2P, hvort tveggja frá Google Fonts með Courier til vara. Báðir mælarnir eru bútaðar stikur: taugar í rauðu, skjálfandi efst; uggur í dökkbláu-yfir-í-gull flugfélagsins, glóandi efst. Vinjetta yfir alla síðuna dekkir hornin og daufar skannlínur liggja yfir öllu. Síminn heldur sinni eigin nútímalegu kerfisleturstillingu viljandi: hann er eini hreini, fyrirtækjalegi, vel hannaði hluturinn í leiknum, og hann er sá sem lýgur að þér.

## 7b. Hljóðhönnun

Allt er hljóðgervt í `audio.js` með Web Audio API – suð, nokkrir sveiflugjafar, síur – þannig að enn eru engar miðlunarskrár. Hljóðið fer af stað við fyrsta smell (vafrar krefjast bendingar) og ♪-stýring í efstu stikunni þaggar það, og það er munað milli heimsókna.

Hver senulykill hefur sitt eigið hljóðumhverfi, sem er þverblandað yfir tvær sekúndur þegar sena breytist:

- **Farþegarými**: 55 Hz hreyfildrunur undir brúnu suði, daufur hvinur, og annað veifið beltahljóðið – „skeiðin á glasinu“ – sem fer líka af stað þegar komið er inn í leiðarbreytingarsenuna.
- **Hliðið á Heathrow og landgangurinn**: kliður úr sal, tvítóna kallkerfishljómur öðru hverju.
- **Komusalurinn í Keflavík**: flúrljósasuð á 50 og 100 Hz, daufur salarómur, peran yfir töskuborðinu tifar á nokkurra sekúndna fresti, og stöku sinnum fer gólfþvottavélin hjá (hæg bylgja af síuðu suði).
- **Rútustæðið**: vindur (bandsíað brúnt suð með tveimur hægum lágtíðnisveiflum), 32 Hz dísillausagangur með ferningsbylgjuhökti, rigning.
- **Vegurinn**: hreyfildrunur, veghljóð, hægt gnauð.
- **Herbergi 214**: hitalögnin á 60 Hz, lágur ómur, og á um hálfrar mínútu fresti lítill smellur frá ganginum.
- **Gangurinn**: næstum þögn, ísvélin sem malar í tvær sekúndur í senn, og, sjaldan, lyftukapallinn – þriggja sekúndna þríhyrningstónn.
- **Anddyrið**: suð kaffivélarinnar, glerdyrnar sem renna upp fyrir engan.
- **Bílastæðið**: harðari vindur, möl.
- **Brottfararsalurinn**: kliður, flúrljósakantur, flettispjaldataflan sem flettir (fjórtán smellir), kallkerfishljómurinn.
- **Rútan á flughlaðinu**: hreyfill og rigning á þaki. **Hlaðið**: rigning á málmi og þota sem spólar upp.
- **Tómið** (tóma titilvinjettan og dimmasti endirinn): 30 Hz drunur og hægt hjartsláttardunk.

Ofan á senuna bætir **uggurinn** við ósamstilltu pari af sínusbylgjum í kringum 40 Hz, en styrkur þeirra hækkar með þrepinu (þöglar á þrepum 0–1, heyranlegar frá 2) og tónhæðin lækkar eftir því sem þrepið hækkar; frá þrepi 5 bætist varla merkjanlegt 9 kHz væl við. **Taugarnar** fá slagverk: hjartslátt, lágpassaðan og fremur fundinn en heyrðan, sem taugaþrepið (0–4, eitt fyrir hver 25 stig) stýrir á sama hátt og uggsþrepið stýrir drununum. Þrep 0–1: ekkert. Þrep 2: hægt dunk-dunk á 60 slögum á mínútu, lágt í blöndunni. Þrep 3: 78, hærra, og þurrt tif milli slaga – nögl á tönn, penni á borði. Þrep 4 (stikan full): 96, enn hærra, og rangt – slög hrasa, tvöfaldast, eða allt saman tekur á rás í einn takt og jafnar sig svo. Púlsinn hættir aldrei af sjálfu sér; aðeins mælirinn sem lækkar hægir á honum, þannig að svefn, te og sturta eru hlutir sem þú heyrir virka. Lögin tvö voru valin þannig að þau yrðu óruglanleg hvort við annað í myrkrinu: uggurinn er tónn og tónhæð, taugarnar eru taktur. Stök hljóðmerki eru sett af stað af vélinni: tvöfalt suð fyrir hver skilaboð, fimm jöfn dunk þegar bankasenurnar opnast (það er sama bankið hvort sem þú ert í herberginu eða á ganginum), ferningsbylgjublipp þegar flugfélagið skráir þig, lágt dunk og deyjandi 55 Hz tónn við slæman endi, rísandi tvítónn við góðan, og flettispjaldaskröltið þegar titiltaflan skiptir um tungumál.

## 8. Viðmót

- **Tvær rúður: heimurinn og síminn.** Þráðurinn var skrifaður *í síma, í aðstæðunum*, þannig að síminn er varanleg aukapersóna. Á borðtölvu er hann fastur dálkur með rafhlöðu sem tæmist yfir daginn; í farsíma er hann botnblað á bak við SÍMI-hnapp með merki fyrir ólesið. Sprettiskilaboð tilkynna komur þannig að leikmaðurinn finnur suðið á sama augnabliki og sögumaðurinn.
- **Brottfarartöflufagurfræðin.** Rafgult á svörtu, jafnbreitt letur, dauf skannlína, titill sem flöktir á nokkurra sekúndna fresti. Tölvupóstur fær dökkbláa-og-gullna haus flugfélagsins; spjallmennið fær ávalar bólur og emoji; pappír fær Arial og blett. Hver boðleið *lítur út* eins og traustverðugleikastig hennar, sem er brandarinn.
- **Hljóðstýring**: ♪ í efstu stikunni. Slökkt sjálfgefið aðeins ef þú slökktir á því síðast.
- **Business Class**: velkomintölvupósturinn við brottför býður ókeypis uppfærslu. Þiggðu hana og ekkert breytist um sætið þitt – en rútuspjöldin missa öll skrifuð kennimerki sín (nafn, skilti, Skoða nánar-línurnar) og skilja þig eftir með pixlamyndirnar einar til að lesa, nákvæmlega eins og orðalag flugfélagsins lofaði: „treyst til að finna sína eigin leið“. Það kostar örlítinn ugg að þiggja. Þetta er erfiðleikastigið, valið innan sögunnar og aldrei nefnt sem slíkt.
- **Klukkan er alltaf sýnileg** af því að hvert einasta hryllingsatriði í heimildinni er tímasetningaratriði (tölvupósturinn klukkan 9:40 um 9:00; afgreiðsluborðið nákvæmlega 3 klukkustundum fyrir). Tíminn líður aðeins í gegnum val; það er engin rauntímapressa, þannig að það er alltaf ókeypis að lesa.
- **Aðgengi:** pixlaletur fellur aftur á Courier ef ekki næst í Google Fonts; meginmál er 21px vegna læsileika skjáletursins; engar upplýsingar eru bornar með lit einum saman; `prefers-reduced-motion` slekkur á allri hreyfingu, þar með talið endurteiknun vinjettanna; `aria-live` á stöðustikunni og sprettiskilaboðunum; valkostir sem hægt er að fókusa með lyklaborði; strigar eru `aria-hidden` af því að hvert sjónrænt kennimerki er líka skrifað á spjaldið.

## 9. Tæknilegar ákvarðanir

- **Hreint HTML/CSS/JS, engin smíð.** Krafan er GitHub Pages; það einfaldasta sem fer þangað eru kyrrstæðar skrár, og textaleikur þarf enga umgjörð. `engine.js` veit ekkert um söguna; `content.js` er sagan og veit ekkert um DOM; `art.js` og `audio.js` vita ekkert um hvorugt og mála aðeins, eða spila, það sem beðið er um.
- **Senur eru venjulegir hlutir með föllum sem gildi.** Texti, staðsetning, valkostir og jafnvel rútulistar geta verið `(G) => …` þannig að þau bregðist við tíma og flöggum. Þetta heldur skilyrtri frásögn á einum stað í stað þess að dreifa senuafbrigðum út um allt.
- **Örlítil biðröð fyrir tímasett skilaboð** (`S.sched`, tæmd af `advance()`) er það sem lætur brandarann „tölvupóstur berst 30 mínútum eftir að þú fórst um borð“ virka sem kerfi frekar en sem prósalínu.
- **Slembitölugjafi með fræi fyrir hverja umferð** (`mulberry32`) þannig að umferð sé endurskapanleg út frá fræi sínu ef þú vilt einhvern tíma bæta við „deila þessari umferð“-möguleika.
- **`localStorage` aðeins fyrir endasafnið, umferðateljara og síðasta tungumál**, varið með `try/catch` fyrir huliðsglugga. Engin vistun í miðri umferð: umferðir taka 20 mínútur og varanlegur dauði er tilgangurinn.

## 10. Hönnunarskýrslan sjálf

Þetta skjal er hluti af hönnuninni, og það er afhent eins og leikurinn: `design.html` er framleitt úr Markdown-skjalinu í stíl leiksins sjálfs, er til á öllum fjórum tungumálunum, opnast á því tungumáli sem viðmótið sýnir þegar þú smellir á hlekkinn á titilskjánum, og ber sýnilegan skiptara efst (EN · FR · ÍS · FI). Þýðingarnar voru gerðar með sömu tólum og sömu yfirferð og leiktextinn; enskan er heimildin sem gildir, og þar sem þeim ber ekki saman hefur enskan rétt fyrir sér.
