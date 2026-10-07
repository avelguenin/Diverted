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
CONTENTS.fr = (() => {
  const T = (d, h, m = 0) => d * 1440 + h * 60 + m;
  const p = (...xs) => xs.filter(Boolean).join('\n\n');
  const V = (s) => `<span class="voice">${s}</span>`;        // a voice, usually posh
  const W = (s) => `<span class="whisper">${s}</span>`;      // an aside
  // LX marks a line spoken by a local (the airport woman, the night clerk).
  // In the English, Icelandic and Finnish versions it is simply translated. In
  // the French version the generator leaves it in English, and if the player
  // has asked whether they speak French, CONTENT_BROKEN supplies a halting French.
  const CONTENT_BROKEN = {"“He asked for you.”": "« Il a demandé… vous. »", "“Don't follow the emails,”": "« Pas suivre les mails, »", "“There are buses.”": "« Il y a des bus. »", "“Yes, 214?”": "« Oui, 214 ? »", "“Eleven. It says eleven. Maybe you should sleep.”": "« Onze. C'est écrit onze. Peut-être vous dormir. »", "“No. Sorry. The 10-11 has. Twenty minutes, walking.”": "« Non. Désolée. Le 10-11, oui. Vingt minutes, à pied. »", "“Maybe not tonight.”": "« Peut-être pas ce nuit. »", "“Eleven.”": "« Onze. »", "“A passenger phoned them. They said yes.”": "« Un passager a téléphoné eux. Ils ont dit oui. »", "“Or they said something.”": "« Ou ils ont dit… quelque chose. »", "“Eleven,”": "« Onze, »", "“You are in 214,”": "« Vous êtes dans 214, »", "“One is outside,”": "« Un est dehors, »", "“It is not yours.”": "« Il est pas le vôtre. »", "“Somebody came asking for you. In a uniform. I said you were asleep.”": "« Quelqu'un est venu, il demande vous. En uniforme. J'ai dit vous dormez. »", "“I know.”": "« Je sais. »", "“No coach. Eleven. Please, go up and sleep.”": "« Pas de car. Onze. S'il vous plaît, monter et dormir. »", "“He is looking for you,”": "« Il cherche vous, »", "“Another passenger phoned them. They said yes.”": "« Un autre passager a téléphoné. Ils ont dit oui. »", "“Maybe you should hurry.”": "« Peut-être vous… vite. »", "“Are you with the airline group? They've gone.”": "« Vous êtes avec le groupe de l'avion ? Ils sont partis. »", "“A little. Not the emails. There are buses.”": "« Un peu. Pas les mails. Il y a des bus. »", "“A little. Eleven. The sign. Please.”": "« Un peu. Onze. Le panneau. S'il vous plaît. »", "“We are closing. Taxi is outside.”": "« Nous fermons. Taxi est dehors. »", "“Albion?”": "« Albion ? »", "“Which hotel?”": "« Quel hôtel ? »", "“Heathrow. Yes. They all have this one.”": "« Heathrow. Oui. Tous, ils ont celui-là. »", "“Your flight? Same flight. Every night this week.”": "« Votre vol ? Même vol. Chaque nuit, cette semaine. »", "“Same number, same time, same people — same clothes, I think. The airline says a driver is waiting. The driver is never me. Nobody from the airline has paid anybody.”": "« Même numéro, même heure, mêmes gens – mêmes vêtements, je crois. La compagnie dit un chauffeur attend. Le chauffeur, jamais moi. Personne de la compagnie a payé personne. »", "“The others go somewhere out past the lava. A different hotel every night, I think. Which one, I don't know.”": "« Les autres, ils vont quelque part après la lave. Un hôtel différent chaque nuit, je crois. Lequel, je sais pas. »", "“The white ones. Hraun. Yes.”": "« Les blancs. Hraun. Oui. »", "“Good luck,”": "« Bonne chance, »", "“Lind. It is small. She is awake.”": "« Lind. C'est petit. Elle est réveillée. »", "“He asked for you. I said we had nobody of that name.”": "« Il a demandé vous. J'ai dit nous avons personne de ce nom. »", "“Albion? No. They don't book with us.”": "« Albion ? Non. Ils réservent pas chez nous. »", "“Do you need anything? Toothpaste? A charger? Everybody leaves chargers.”": "« Vous avez besoin quelque chose ? Dentifrice ? Chargeur ? Tout le monde laisse les chargeurs. »", "“A little. Toothpaste, charger, kitchen. Sleep.”": "« Un peu. Dentifrice, chargeur, cuisine. Dormir. »", "“Düsseldorf,”": "« Düsseldorf, »", "“Keep it. Everybody leaves them.”": "« Garder. Tout le monde laisse. »", "“Take it up. Breakfast is at seven. Proper breakfast.”": "« Monter avec. Petit-déjeuner à sept heures. Vrai petit-déjeuner. »", "“Flybus. From BSÍ, where you came from. Ten minutes. Every hour from six. Buy the ticket first; the driver will not take you without.”": "« Flybus. De BSÍ, où vous êtes venu. Dix minutes. Chaque heure, depuis six. Acheter le ticket avant ; le chauffeur prend pas vous sans. »", "“Not the other one. The yellow one.”": "« Pas l'autre. Le jaune. »", "“A man in a uniform. I told him we had nobody of that name. He said he would wait.”": "« Un homme en uniforme. J'ai dit nous avons personne de ce nom. Il a dit il attend. »", "“I locked it.”": "« J'ai fermé à clé. »", "“Nobody. Nobody knows you are here.”": "« Personne. Personne sait vous êtes ici. »", "“Still nobody,”": "« Toujours personne, »", "“Nobody. I locked it. I have been here.”": "« Personne. J'ai fermé à clé. J'étais ici. »", "“He said he would wait.”": "« Il a dit il attend. »", "“That is seven,”": "« C'est la sept, »", "“Nobody came in.”": "« Personne est entré. »", "“Flybus. From BSÍ, where you came from. Ten minutes. Every hour. Buy the ticket first.”": "« Flybus. De BSÍ, où vous êtes venu. Dix minutes. Chaque heure. Acheter le ticket avant. »", "“The yellow one. Not the other one.”": "« Le jaune. Pas l'autre. »", "“Albion Atlantic?”": "« Albion Atlantic ? »", "“The clothes. Everybody off that flight looks like they slept in a chair. Where to?”": "« Les vêtements. Tout le monde de ce vol, on dirait ils ont dormi dans une chaise. Où aller ? »", "“Heathrow.”": "« Heathrow. »", "“Every night somebody shows me this one. Every night it says Heathrow. I can take you to the airport and you can fly there, if you like. Otherwise it is not a very useful email.”": "« Chaque nuit, quelqu'un me montre ça. Chaque nuit, ça dit Heathrow. Je peux vous amener à l'aéroport, et vous prendre l'avion là-bas, si vous voulez. Sinon, pas très utile, ce mail. »", "“Your flight? I know your flight. Everybody who drives nights knows your flight.”": "« Votre vol ? Je connais votre vol. Tous ceux qui conduisent la nuit connaissent votre vol. »", "“Monday it came in at one. Tuesday, one. Wednesday, Thursday, tonight. Same number, same hour, two hundred people with no coats. Every night the airline tells them a car is waiting outside. Every night I am outside, and I am not the car. Nobody from that company has rung me, or paid me, or anybody I know.”": "« Lundi, il arrive à une heure. Mardi, une heure. Mercredi, jeudi, ce soir. Même numéro, même heure, deux cents personnes sans manteau. Chaque nuit, la compagnie dit à eux : une voiture attend dehors. Chaque nuit, je suis dehors, et je suis pas la voiture. Personne de cette compagnie a appelé moi, ou payé moi, ou personne que je connais. »", "“The people, I take where they ask. The trouble is most of them don't know where to ask.”": "« Les gens, je les amène où ils demandent. Le problème, la plupart savent pas où demander. »", "“Out past the lava, somewhere. A white bus takes them, when there is a white bus. Which hotel — I don't know. There are five out there and they all look like a conference that never came.”": "« Après la lave, quelque part. Un bus blanc les prend, quand il y a un bus blanc. Quel hôtel – je sais pas. Il y a cinq là-bas, et tous ressemblent à un congrès qui est jamais venu. »", "“If you can tell me which one, I will take you. If you can't, I will take you where I take everyone who can't: a guesthouse in town. The woman who runs it is always awake. Small place, clean, the price is honest, and she has had one of you every night this week.”": "« Si vous pouvez dire lequel, je vous amène. Si vous pouvez pas, je vous amène où j'amène tous ceux qui peuvent pas : une pension en ville. La dame qui tient ça, toujours réveillée. Petit, propre, prix honnête, et elle a eu un de vous chaque nuit cette semaine. »", "“Keflavík is closed until five. I can drive you forty minutes to a locked door, if you want to pay for it.”": "« Keflavík est fermé jusqu'à cinq heures. Je peux conduire vous quarante minutes jusqu'à une porte fermée, si vous voulez payer pour ça. »", "“The white ones. Yes. That is Hraun. Forty minutes. Nine thousand eight hundred, and I would like it on the card before we leave the lights, if you don't mind. I have been burned this week.”": "« Les blancs. Oui. Ça, c'est Hraun. Quarante minutes. Neuf mille huit cents, et je préfère la carte avant de quitter les lumières, si ça dérange pas. Cette semaine, on m'a eu. »", "“Lind. Good. Three minutes.”": "« Lind. Bien. Trois minutes. »", "“Tell her Gunnar sent you. She will know what that means by now.”": "« Dire à elle : Gunnar vous envoie. Maintenant, elle sait ce que ça veut dire. »", "“Gunnar's headlights. Then you are from the flight.”": "« Les phares de Gunnar. Alors vous êtes du vol. »", "“Do you need anything? Toothpaste. A charger — everybody leaves chargers. There is bread in the kitchen, and skyr. Ask. I am here all night.”": "« Vous avez besoin quelque chose ? Dentifrice. Chargeur – tout le monde laisse les chargeurs. Il y a du pain dans la cuisine, et skyr. Demander. Je suis ici toute la nuit. »", "“Seven? Yes. Nobody. I locked the door at midnight, I have been sitting here, nobody has come in.”": "« Sept ? Oui. Personne. J'ai fermé la porte à clé à minuit, je suis assise ici, personne est entré. »", "“Don't open it. I am coming up.”": "« Pas ouvrir. Je monte. »", "“Hraun? You are sure?”": "« Hraun ? Vous êtes sûr ? »", "“Hraun. Yes. Everyone goes in the end.”": "« Hraun. Oui. Tout le monde y va, à la fin. »", "“Monday it came in at one. Tuesday, one. Wednesday, Thursday, tonight. Same number, same hour, two hundred people with no coats. Every night the airline tells them a driver is waiting for them outside Arrivals. I am outside Arrivals every night, at the rank, and nobody has ever asked me to wait for anybody. Nobody from that company has rung me, or paid me, or any driver I know.”": "« Lundi, il arrive à une heure. Mardi, une heure. Mercredi, jeudi, ce soir. Même numéro, même heure, deux cents personnes sans manteau. Chaque nuit, la compagnie dit à eux : un chauffeur attend dehors, aux Arrivées. Moi, je suis dehors aux Arrivées chaque nuit, à la station, et personne a jamais demandé moi d'attendre personne. Personne de cette compagnie a appelé moi, ou payé moi, ou aucun chauffeur que je connais. »", "“Every night somebody tells me this one. Every night it says Heathrow. I can take you to the airport and you can fly there, if you like. Otherwise it is not a very useful email.”": "« Chaque nuit, quelqu'un me dit ça. Chaque nuit, ça dit Heathrow. Je peux vous amener à l'aéroport, et vous prendre l'avion là-bas, si vous voulez. Sinon, pas très utile, ce mail. »", "“No. Sorry. The 10-11 will have some. Twenty minutes, walking.”": "« Non. Désolée. Le 10-11, ils ont. Vingt minutes, à pied. »", "“Flybus. From BSÍ, where you came from. Ten minutes. Every hour from six. Buy the ticket first; the driver will not take you without one.”": "« Flybus. De BSÍ, où vous êtes venu. Dix minutes. Chaque heure, depuis six. Acheter le ticket avant ; le chauffeur prend pas vous sans ticket. »", "“Every night somebody has that one. Every night it says Heathrow. The ones with that email, the white bus takes out past the lava, to Hraun. If that is where your people are, I can take you. It is not close, and it is not cheap.”": "« Chaque nuit quelqu'un a celui-là. Chaque nuit ça dit Heathrow. Les gens avec ce mail, le bus blanc emmène après la lave, à Hraun. Si vos gens sont là-bas, je peux emmener. Pas près, et pas pas cher. »", "“Your airline has to rebook you. Landside, there is a desk. It opens at six.”": "« Votre compagnie, elle doit vous réserver encore. De l'autre côté, il y a un bureau. Il ouvre à six. »", "“In or out? I'm going.”": "« Dedans ou dehors ? Je pars. »", "“Hotel,”": "« Hôtel, »", "“Hotel. Yours, I think. Somebody's.”": "« Hôtel. Le vôtre, je pense. De quelqu'un. »"};
  const LX = (s) => { try { const S = (typeof Game !== 'undefined' ? Game : window.Game).state; if (S && S.flags.fr_asked && CONTENT_BROKEN[s]) return CONTENT_BROKEN[s]; } catch (e) { /* ignore */ } return s; };
  const atLeast = (G, v) => { if (G.S.dread < v) G.S.dread = v; }; // v in percent
  // the chatbot is called Ally, but the narration only calls it that once the player has opened it
  const ALLY = (G) => (G.S.chat.some((m) => m.who === 'bot' && m.read) ? 'Ally' : 'le chatbot de la compagnie');
  const ALLY_MSG = (G) => (G.S.chat.some((m) => m.who === 'bot' && m.read) ? 'Un message d\'Ally.' : 'Un message du chatbot de la compagnie.');
  // hubs end with a nudge when the phone has something unread: what it is, the game never says here
  // when the phone holds something unread, the room implies it and never says it
  const NUDGE_POOL = [
    'Votre téléphone est allumé, écran vers le haut, et l\'est depuis un moment.',
    'Le téléphone vibre une fois contre votre jambe, puis se tait, à la manière d\'une chose qui a dit ce qu\'elle avait à dire.',
    'Le téléphone de quelqu\'un d\'autre sonne avec la même sonnerie que le vôtre. Puis le vôtre.',
    'L\'écran de votre téléphone est allumé. Vous ne l\'avez pas allumé.',
    'Votre téléphone, dans votre main, est chaud, comme il l\'est quand il a travaillé.',
    'Le voyant de notification clignote, patiemment, au bord de votre champ de vision.',
  ];
  const NUDGE = (G) => (G.unread() > 0 ? W(G.amb('nudge', NUDGE_POOL.map((t) => ({ d: 0, t })))) : '');
  const hub = (G, status, key, extra) => p(status, G.last(), G.amb(key, AMB[key]), extra, NUDGE(G));
  const KNOCK_AT = T(1, 4, 30);

  const start = { scene: 'lane', t: T(0, 19, 20), nerves: 18, dread: 8, dep: T(1, 15, 10) };

  /* ================================================================ ambient pools */
  const AMB = {
    hall: [
      { d: 1, t: 'Une autolaveuse passe, lentement, conduite par quelqu\'un dont vous ne voyez jamais tout à fait le visage.' },
      { d: 1, t: 'Quelqu\'un a trouvé une prise de courant, et onze personnes se pressent autour comme autour d\'un feu.' },
      { d: 1, t: 'Le tableau des arrivées ne dit rien de votre vol. Il ne dit rien d\'aucun vol.' },
      { d: 1, t: 'Un enfant dort sur un chariot à bagages. Il n\'y a pas de bagages.' },
      { d: 2, t: 'Il y a moins de monde dans le hall qu\'avant. Vous n\'avez vu personne partir.' },
      { d: 2, t: 'Le tube fluorescent au-dessus du comptoir des bagages s\'est mis à cliqueter.' },
      { d: 2, t: 'Toutes les deux ou trois minutes, quelqu\'un se lève, va jusqu\'aux portes, et revient.' },
      { d: 3, t: 'La porte STAFF est entrouverte, de la largeur d\'une main. Vous ne l\'avez pas vue s\'ouvrir.' },
      { d: 3, t: 'Pendant un instant, tous les téléphones du hall s\'allument en même temps, puis s\'éteignent tous.' },
      { d: 3, t: 'Quelqu\'un se tient devant le rideau baissé du duty free, dos au hall. Il est en bleu marine.' },
    ],
    room: [
      { d: 2, t: 'Le chauffage fait le bruit de quelqu\'un qui hésiterait à frapper.' },
      { d: 2, t: 'La bouilloire a un petit voyant. C\'est la seule chose dans la chambre qui soit de votre côté.' },
      { d: 2, t: 'Dans le couloir, quelqu\'un traîne une valise à roulettes qu\'il ne peut absolument pas avoir.' },
      { d: 2, t: 'Votre reflet dans la vitre noire porte les vêtements de la veille. Tout le monde les porte.' },
      { d: 3, t: 'Dehors, une voiture passe sur la route, lentement, et ne bifurque pas.' },
      { d: 3, t: 'De l\'autre côté du mur, chez le voisin, une télévision diffuse le même rien que la vôtre.' },
      { d: 3, t: 'La chambre est la 214. La carte dit 214. Vous n\'arrêtez pas de vérifier, comme si elle avait pu bouger.' },
      { d: 3, t: 'Dans le couloir, quelqu\'un s\'arrête devant votre porte, puis continue.' },
      { d: 4, t: 'La lumière sous la porte s\'éteint, puis revient, puis s\'éteint.' },
      { d: 4, t: 'Quelque part en bas, un moteur tourne. Il tourne depuis un moment.' },
      { d: 4, t: 'Le téléphone s\'allume pour rien. Pas de message. Juste l\'écran, qui vous regarde.' },
      { d: 4, t: 'Vous entendez frapper, deux portes plus loin. Régulier, patient. Puis une porte plus loin.' },
      { d: 5, t: 'Il y a quelqu\'un sur le parking. Depuis un moment déjà.' },
      { d: 5, t: 'Le rideau bouge. Aucune fenêtre n\'est ouverte.' },
      { d: 5, t: 'Le téléphone de la chambre sonne une fois et s\'arrête.' },
    ],
    corridor: [
      { d: 2, t: 'Une moquette couleur d\'hématome. Un chariot de serviettes garé tout au bout, abandonné en pleine tournée.' },
      { d: 2, t: 'Chaque porte a un numéro. Sous chaque numéro, un trait d\'ombre. Sous le vôtre, un trait de lumière.' },
      { d: 3, t: 'La machine à glaçons grince, s\'arrête, grince.' },
      { d: 3, t: 'La lumière au bout du couloir est éteinte. Elle était allumée.' },
      { d: 3, t: 'Quelqu\'un rit derrière une des portes, et s\'arrête au milieu.' },
      { d: 4, t: 'La moquette devant la 216 est mouillée.' },
      { d: 4, t: 'Vous entendez l\'ascenseur circuler entre les étages. Personne ne l\'a appelé.' },
      { d: 4, t: 'La porte coupe-feu, au fond, est calée avec une chaussure.' },
      { d: 5, t: 'Le long du couloir, les portes sont ouvertes, l\'une après l\'autre, et derrière elles les chambres sont faites. Personne n\'y est jamais entré.' },
      { d: 5, t: 'Tout au bout, quelqu\'un en bleu marine frappe à une porte, régulièrement, puis passe à la suivante.' },
    ],
    lobby: [
      { d: 2, t: 'La réceptionniste de nuit fait des mots croisés dans une langue que vous ne connaissez pas. Elle n\'a pas rempli une seule case.' },
      { d: 2, t: 'Une affiche d\'excursions : GLACIERS · BALEINES · AURORES BORÉALES. Personne dans ce hall ne verra rien de tout ça.' },
      { d: 2, t: 'Deux passagers endormis, assis bien droits sur le canapé, leur téléphone à la main comme un cierge.' },
      { d: 3, t: 'Le voyant rouge de la machine à café clignote sur un rythme qui est presque un mot.' },
      { d: 3, t: 'Les portes vitrées s\'ouvrent devant personne, et se referment.' },
      { d: 3, t: 'Le panneau imprimé porte une nouvelle auréole. Elle sèche en prenant forme.' },
      { d: 4, t: 'Dehors, sur le parking : des phares, moteur au ralenti. Ils ne s\'éteignent pas.' },
      { d: 4, t: 'La réceptionniste de nuit regarde par-dessus votre épaule, vers les portes, puis revient à ses mots croisés.' },
      { d: 4, t: 'Un des passagers endormis n\'est plus là. Son téléphone est resté sur le canapé, écran vers le haut, ouvert sur un mail.' },
      { d: 5, t: () => 'La réceptionniste dit, sans lever les yeux : ' + LX('“He asked for you.”') },
      { d: 5, t: 'Les portes s\'ouvrent. Air froid. Personne n\'entre. Elles restent ouvertes.' },
    ],
    carpark: [
      { d: 2, t: 'Du vent. Des champs de lave. Une route qui part d\'un côté dans le noir et de l\'autre dans un noir légèrement différent.' },
      { d: 2, t: 'L\'hôtel derrière vous est éclairé comme un aquarium.' },
      { d: 3, t: 'Du gravier. Un seul lampadaire. Une pluie qui n\'arrive pas à se décider.' },
      { d: 3, t: 'Une masse noire en forme de car, tout au bout du parking, moteur coupé. Ou pas.' },
      { d: 4, t: 'Le car au fond du parking a l\'intérieur allumé. Toutes les places sont prises.' },
      { d: 4, t: 'Quelqu\'un se tient à côté de la porte du car, très droit, les mains jointes.' },
      { d: 5, t: 'L\'homme près de la porte du car regarde l\'hôtel. Une fenêtre en particulier. Vous savez laquelle.' },
    ],
    morning: [
      { d: 2, t: 'On débarrasse le petit-déjeuner. Il n\'a jamais vraiment été servi.' },
      { d: 2, t: 'Quelqu\'un a aligné les petits pots de confiture, par couleur.' },
      { d: 2, t: 'Le petit explique quelque chose d\'important à un radiateur.' },
      { d: 3, t: 'Il y a moins de monde au petit-déjeuner que dans le hall hier soir. Ils sont dans d\'autres hôtels, dit tout le monde. D\'autres hôtels.' },
      { d: 3, t: 'Un homme à la table voisine a reçu quatre mails avec quatre horaires différents. Il les lit à voix haute comme le bulletin de la météo marine.' },
      { d: 3, t: 'Dehors, à la lumière du jour, le parking ressemble à un parking. Il y a un car dessus.' },
      { d: 4, t: 'Plus personne ne parle. Tout le monde surveille les portes.' },
      { d: 4, t: 'La réceptionniste de nuit est toujours de service. Elle n\'a pas changé. Elle fait la même grille.' },
    ],
    airport: [
      { d: 3, t: 'Le tableau des départs se met à jour. Votre vol descend d\'une ligne. Rien ne monte.' },
      { d: 3, t: 'Une femme en tête de file est là depuis si longtemps qu\'elle a enlevé ses chaussures.' },
      { d: 3, t: 'L\'unique comptoir a une sonnette. Personne n\'appuie. Quelqu\'un appuie. Rien.' },
      { d: 4, t: 'Les portes vers l\'extérieur indiquent ARRIVALS ONLY. Elles n\'étaient pas verrouillées tout à l\'heure.' },
      { d: 4, t: 'La file a raccourci. Personne n\'a été servi.' },
      { d: 4, t: 'Un homme en uniforme bleu marine longe toute la file en comptant, puis disparaît par une porte.' },
      { d: 5, t: 'Les boutiques baissent le rideau, une à une, dans l\'ordre, en se rapprochant de vous.' },
      { d: 5, t: 'On appelle votre nom au haut-parleur. Puis non. Personne d\'autre ne l\'a entendu.' },
      { d: 5, t: 'Le tableau dit LOS ANGELES et, pendant une seconde, autre chose.' },
      { d: 6, t: 'Il n\'y a plus dans la file que vous et les gens que vous reconnaissez. Les autres sont partis quelque part.' },
      { d: 6, t: 'L\'agent au comptoir vous regarde. Depuis un moment. Il sourit.' },
    ],
  };

  /* ================================================================ chatbot
     Ally is the channel that always lies — but lies *specifically*. As dread
     rises it starts to know where you are. */
  const tail = (G) => {
    const d = G.D;
    if (d >= 5) return '\n\n' + G.pick(['Pourquoi êtes-vous toujours ici ?', 'La majorité des clients ont embarqué.', 'Nous pouvons voir que vous êtes toujours là.']);
    if (d >= 3) return '\n\n' + G.pick([G.has('lind') ? 'Vous êtes toujours dans chambre 7.' : 'Vous êtes toujours dans chambre 214.', 'S\'il vous plaît rester où vous êtes.', 'Y a-t-il autre chose ? Il n\'y a pas autre chose.']);
    return '';
  };
  const chat = [
    {
      label: 'Mon vol est-il à l\'heure ?',
      if: (G) => !G.has('diverted'),
      answer: (G) => G.pick(['Oui ! Le vol AB 0271 à Los Angeles est à temps. ✈️', 'Le vol AB 0271 est opérant comme planifié. Ayez un grand vol ! 😊', 'Tout est à temps. Tout.']),
    },
    {
      label: 'Quel est le mot de passe du wifi ?',
      if: (G) => !G.has('diverted'),
      answer: 'Le wifi en vol est disponible pour acheter depuis l\'écran du dossier de siège. Les remboursements pour le wifi sont processés dans les 28 jours. 📶',
    },
    {
      label: 'Où est mon hôtel ?',
      if: (G) => G.has('diverted'),
      answer: (G) => {
        if (G.has('at_airport2')) return (G.has('lind') ? 'Votre hébergement était Hótel Hraun. Nos enregistrements montrent vous ne l\'avez pas utilisé. Voulez-vous laisser une revue ?' : 'Votre hébergement était Hótel Hraun. Nous espérons vous avez apprécié votre séjour ! Voulez-vous laisser une revue ?') + tail(G);
        if (G.has('lind')) return 'Votre hébergement est Hótel Hraun. Vous êtes à Hótel Lind, chambre 7. S\'il vous plaît retourner à votre hébergement.' + tail(G);
        if (G.has('at_hotel')) return 'Vous êtes à Hótel Hraun, chambre 214. S\'il vous plaît rester dans votre chambre jusqu\'à collecté.' + tail(G);
        return 'Grande question ! Votre hébergement a été arrangé au Heathrow Renaissance Lodge, Bath Road. Un lien de réservation vous a été e-mailé. 🛏️';
      },
    },
    {
      label: 'Le bus est à quelle heure ?',
      if: (G) => G.has('diverted'),
      answer: (G) => {
        if (G.has('at_airport2')) return 'Votre car vers l\'aéronef départ une fois l\'embarquement est complet. S\'il vous plaît embarquer par groupe. 🚌' + tail(G);
        if (G.has('morning') && G.has('lind')) return 'Votre transfert depuis Hótel Lind est confirmé pour 09:00. S\'il vous plaît attendre dans le lobby. 🚌' + tail(G);
        if (G.has('morning')) return 'Votre transfert à l\'aéroport est confirmé pour 08:00. S\'il vous plaît être dans le lobby 15 minutes tôt.' + tail(G);
        if (G.has('lind')) return 'Un véhicule a été arrangé pour vous retourner à votre hébergement à 04:30. Un membre du staff va frapper.' + tail(G);
        if (G.has('at_hotel')) return 'Votre car départ à 04:30. Un membre du staff va frapper.' + tail(G);
        return 'Des cars ont été organisés pour tous clients. S\'il vous plaît procéder aux cars. 🚌';
      },
    },
    {
      label: 'Que se passe-t-il ?',
      if: (G) => G.has('diverted'),
      answer: (G) => G.pick([
        'Votre vol AB 0271 à Los Angeles est à temps. ✈️',
        'Je suis ici pour aider ! Le vol AB 0271 opère actuellement comme programmé.',
        'Tout procède normalement. Y a-t-il autre chose je peux aider avec ?',
      ]) + tail(G),
      do: (G) => G.nerves(2),
    },
    {
      label: 'Je veux faire une réclamation.',
      warn: true,
      answer: (G) => (G.count('botcomplaint') === 1 ? 'Je suis désolé d\'entendre cela. Votre feedback a été enregistré. Merci de voler Albion Atlantic – nous faisons notre meilleur. 🙏' : 'Votre feedback a déjà été enregistré. Est-ce qu\'il y a quelque chose d\'autre ? 🙏'),
      do: (G) => { G.nerves(3); G.dread(2); G.flag('complained_bot'); },
    },
  ];

  /* ================================================================ scenes */
  const scenes = {};

  scenes.title = {
    type: 'title',
    board: `AB 0271   LONDRES LHR  →  LOS ANGELES LAX      PARTI 20:05\n                                              STATUT : ▮▮▮▮▮▮▮▮▮▮`,
    text: p(
      'Neuf heures, sans escale, chez vous avant minuit, heure du Pacifique. Vous avez bu le café de plus. Vous avez tout fait comme il faut.',
      'C\'est un jeu où l\'on s\'entend dire, très poliment, que tout va bien.',
      W('Inspiré d\'un fil de discussion bien réel sur un vol dérouté. La compagnie aérienne de ce jeu est fictive. Les bus, non.'),
      W('À jouer de préférence avec des écouteurs, et le son allumé.'),
    ),
  };

  scenes.howto = {
    loc: 'Consignes de sécurité',
    text: p(
      '<em>Lisez tout.</em> Votre téléphone (à droite, ou sous le bouton TÉLÉPHONE) reçoit les mails de la compagnie, les messages d\'un chatbot nommé Ally, des SMS, et des photographies de tous les panneaux imprimés que vous croisez. Quelqu\'un dit la vérité. Ce n\'est pas toujours celui qui porte le logo.',
      '<em>Deux jauges.</em> Les deux se remplissent. Ni l\'une ni l\'autre ne met fin à la partie. Ce qu\'elles font, c\'est fermer des portes : à mesure qu\'une jauge se remplit, une partie de ce que vous auriez pu dire ou faire n\'est plus possible, et ce qui reste est ce qui reste. Les petits choix les remplissent. Le sommeil, la nourriture et les autres gens les vident, un peu.',
      '<em>Noté</em> compte les réclamations que la compagnie a enregistrées à votre encontre. À trois, elle passe à l\'acte – là où elle le peut.',
      '<em>La batterie</em> est un nombre dans le coin du téléphone. Il descend. Quand il arrive à rien, le téléphone aussi, et tout ce qui arrive ensuite arrive à personne, jusqu\'à ce que vous trouviez le moyen de le ranimer – et alors tout arrive d\'un coup.',
      'Les lieux sont des espaces où vous pouvez vous déplacer. Chaque action prend des minutes ; l\'horloge n\'avance que lorsque vous agissez. Des bus passent et repartent. Regardez-les bien avant de monter. Le bon aura la tête que vous avez.',
      'Une partie dure vingt à trente minutes. Il y a six fins, et deux d\'entre elles sont Los Angeles.',
    ),
    choices: [{ label: 'Retour', next: 'title' }],
  };

  scenes.gallery = { type: 'gallery' };

  /* ---------------------------------------------------------------- Day 0 · the approach
     Boarding, the seat, the demonstration, the meal, the dark hours. Nothing
     goes wrong here. That is what it is for: four hours of a cabin working
     exactly as it should, with one man in it counting. */
  scenes.door = {
    art: 'gate',
    loc: 'Londres Heathrow · Passerelle · la porte de l\'avion',
    enter: (G) => {
      if (G.once('welcome_mail')) {
        G.msg('sms', { from: 'AlbionATL', key: 'seat', body: 'AB0271 : Votre carte d\'embarquement. Siège 31B. Groupe 4. Ne pas répondre.' });
        G.msg('email', { from: 'Albion Atlantic', subj: 'Bienvenue à bord AB 0271', key: 'welcome', body: 'Cher Client,\n\nBienvenue à bord vol Albion Atlantic AB 0271 à Los Angeles. Votre vol est à temps.\n\nVotre siège : 31B. Votre groupe d\'embarquement : 4.\n\nNotre équipage de cabine est ici pour assurer votre sécurité et confort. La sécurité de nos clients est tantamount.\n\nComme client valorisé vous êtes invité à accepter une mise à niveau complimentaire en Classe Affaires pour ce vol. Les clients Classe Affaires apprécient une cabine plus calme et sont confiés de trouver leur propre chemin.\n\nAppréciez votre vol.', actions: [{ label: 'Accepter la mise à niveau complimentaire', if: (G) => !G.has('business') && !G.has('at_hotel'), do: (G) => { G.flag('business'); G.nerves(-2); G.dread(4); G.note('Vous avez accepté le surclassement. Rien n\'a changé pour votre siège. Une hôtesse vous a apporté une serviette chaude, et le chef de cabine, en passant, a dit ' + V('« Affaires, »') + ' pour lui-même, et a fait une petite marque.'); } }] });
      }
      if (G.once('door_intro')) G.note(p(G.last(),
        'La passerelle sent le kérosène et la moquette. À la porte de l\'avion, le chef de cabine : grand, les tempes argentées, un sourire repassé avec la chemise. Il ne regarde pas les cartes d\'embarquement. Il regarde les visages, un par un, pose à chacun une question, et retient la réponse.',
        'À mi-chemin de la passerelle, une femme en bleu marine de la compagnie vous a arrêté, porte-bloc et sourire : en tant que client privilégié, accepteriez-vous un surclassement gratuit en Classe Affaires ? Cabine plus calme. On vous fait confiance pour trouver votre chemin. Elle n\'a pas dit vers où.',
        'Votre téléphone a vibré deux fois en descendant la passerelle.',
        V('« Bienvenue à bord. Siège ? »')));
    },
    text: (G) => p(G.last(), G.counted('door_wait') ? '' : 'Vous ne connaissez pas votre siège. ' + V('« Prenez votre temps, »') + ' dit-il. ' + V('« Ça va être sur votre téléphone. »')),
    choices: (G) => [
      { label: '« 31B. »', if: (G) => G.readMsg('seat') || G.readMsg('welcome'), nd: -2, time: 2, do: (G) => G.note(V('« 31B. Merci. »') + ' Il l\'a dit comme s\'il le classait. Il a regardé le visage suivant.'), next: 'boarding' },
      { label: '« Trente et quelques. Je trouverai. »', kind: 'conflict', nd: 3, dd: 1, time: 3, do: (G) => { G.flag('seat_vague'); G.note(V('« 31B, »') + ' a-t-il dit, sans rien regarder. ' + V('« Trente et un B. Nous aimons nos clients savoir où ils sont. »') + ' Il a fait une petite marque sur une carte dans sa main, et s\'est écarté.'); }, next: 'boarding' },
      { label: '« Classe Affaires, apparemment. »', kind: 'comply', if: (G) => G.has('business'), dd: 2, time: 2, do: (G) => G.note(V('« Bien sûr, »') + ' a-t-il dit, et il est resté dans votre chemin un battement de plus que nécessaire, puis s\'est écarté. ' + V('« 31B. Appréciez votre vol. »')), next: 'boarding' },
      { label: 'Dire oui à la femme au porte-bloc. Accepter le surclassement.', kind: 'comply', if: (G) => !G.has('business'), dd: 4, nd: -2, time: 2, once: 'queue_upgrade', do: (G) => { G.flag('business'); G.note('Vous avez dit oui. Elle a écrit quelque chose sur le porte-bloc sans baisser les yeux, et a dit ' + V('« Adorable, »') + ' et le chef de cabine, à deux mètres de là, a dit ' + V('« Affaires, »') + ' pour lui-même, et a fait une petite marque. Rien n\'a changé pour votre siège.'); }, next: 'door' },
      { label: 'Le chercher. Le mail, ou le SMS.', time: 2, do: (G) => { const n = G.count('door_wait'); if (n >= 2) { G.flag('seat_slow'); G.note('Vous cherchez encore quand il dit, aimablement, ' + V('« 31B. »') + ' Il l\'a lu sur sa propre carte. ' + V('« Trente et un B. Appréciez votre vol. »') + ' Il s\'écarte. La file expire derrière vous.'); G.go('boarding'); } else { G.openPhone(G.S.inbox.some((m) => m.ch === 'sms' && !m.read) ? 'sms' : 'email'); G.note('La file respire derrière vous. Il attend. Il est très doué pour attendre.'); } }, next: 'door' },
    ],
  };

  scenes.boarding = {
    art: 'gate',
    loc: 'Londres Heathrow · Passerelle · Siège 31B',
    text: (G) => p(
      G.last(),
      'Rang 31. Un siège couloir, le 31B. En 31C, un homme à peu près de votre âge, avec un livre de poche qu\'il a déjà cessé de lire. Il vous salue d\'un signe de tête. Vous faites de même. C\'est toute la conversation, et ça le restera un moment.',
      'Quelque part derrière vous, on explique patiemment à un enfant de deux ans que l\'avion ne part pas encore. L\'avion ne part pas encore.',
    ),
    choices: [
      { label: 'Dire bonjour au 31C.', nd: -1, dd: -1, time: 20, do: (G) => { G.flag('met31c'); G.note('Il a répondu bonjour. Il rentre chez lui. Il l\'a dit comme on le dit au début de neuf heures de vol : chez lui, comme si c\'était un endroit où l\'avion ne pouvait manquer d\'arriver.'); }, next: 'takeoff' },
      { label: 'Ranger votre sac, vous asseoir, attacher la ceinture avant qu\'on vous le demande.', kind: 'comply', dd: 2, time: 20, do: (G) => G.note('Ceinture attachée. Sac rangé. Le chef de cabine, en passant, y a jeté un coup d\'œil et a eu un imperceptible hochement de tête, le hochement d\'un homme qui tient une liste.'), next: 'takeoff' },
      { label: 'Retourner demander au chef de cabine, à la porte, si le vol est à l\'heure.', nd: 1, time: 20, do: (G) => G.note(V('« Tout est à temps, »') + ' a-t-il dit, chaleureusement, puis – comme par acquit de conscience – ' + V('« Tout. »') + ' Il regardait toujours les passagers qui entraient derrière vous.'), next: 'takeoff' },
      { label: 'Lire les consignes de sécurité rangées dans la pochette du siège. Sérieusement, pour une fois.', nd: -2, time: 20, do: (G) => G.note('Position de sécurité. Issues les plus proches, qui peuvent se trouver derrière vous. Un petit dessin de quelqu\'un glissant dans la mer, l\'air serein. Vous la rangez. Vous n\'en aviez jamais lu une, et vous ne savez pas pourquoi vous l\'avez fait cette fois.'), next: 'takeoff' },
    ],
  };

  scenes.takeoff = {
    art: 'cabin',
    loc: 'Piste 27L · Heathrow',
    text: (G) => p(
      G.last(),
      'Le chef de cabine fait lui-même la démonstration de sécurité, à l\'avant, pendant que la vidéo passe derrière lui sans le son. Il la fait lentement. Il la fait en regardant chaque rang tour à tour, comme pour vérifier que les issues sont bien là où la fiche l\'indique.',
      V('« Dans l\'événement improbable d\'une perte de pression de cabine. Dans l\'événement improbable d\'un atterrissage sur l\'eau. Dans l\'événement improbable. La sécurité de nos clients est tantamount. »') + ' C\'est une chose étrange à dire dans une démonstration de sécurité, et il la dit comme si c\'était la réplique habituelle.',
      'Puis les moteurs, et la pression dans le dossier, et Londres qui bascule et s\'éloigne dans l\'orange et le noir. Le voyant des ceintures reste allumé bien plus longtemps que nécessaire.',
    ),
    choices: [
      { label: 'Regarder la démonstration jusqu\'au bout.', kind: 'comply', dd: 2, time: 40, do: (G) => G.note('Vous avez regardé jusqu\'au bout. Il a terminé de votre côté de la cabine, et pendant un instant, c\'est à vous, précisément, que la démonstration s\'adressait, puis c\'était fini et il remontait l\'allée en effleurant le dossier des sièges.'), next: 'service' },
      { label: 'Regarder Londres s\'éloigner par le hublot.', nd: -2, time: 40, do: (G) => G.note('La M25 comme un anneau d\'ambre. Puis les nuages. Puis plus rien que le feu de l\'aile, qui clignote, et votre propre visage dans le hublot, qui rentre chez lui.'), next: 'service' },
      { label: 'Jeter un dernier coup d\'œil au téléphone avant de passer en mode avion.', dd: 1, time: 40, do: (G) => { G.msg('sms', { from: 'Jo 💛', body: 'bon vol !!! écris-moi quand tu atterris 🛫' }); G.note('Un SMS. Jo. Vous avez répondu <em>promis</em>, regardé l\'envoi échouer, passé le téléphone en mode avion, et senti la cabine se refermer sur vous comme un couvercle.'); }, next: 'service' },
    ],
  };

  scenes.service = {
    art: 'cabin',
    loc: 'Croisière · au-dessus de la mer d\'Irlande',
    text: (G) => p(
      G.last(),
      'Le dîner arrive sur un chariot poussé par deux hôtesses qui portent le sourire fourni avec le poste. Poulet ou pâtes. Le chef de cabine suit le chariot à quelques rangs de distance, sans servir, juste marcher, regarder les plateaux, regarder les gens derrière les plateaux.',
      G.has('met31c') ? 'L\'homme du 31C a pris les pâtes. Il ne les mange pas. Il regarde la carte sur l\'écran, où un petit avion n\'a pas encore atteint la côte de l\'Irlande.' : 'L\'homme du 31C a pris les pâtes. Il ne les mange pas. Il n\'a pas dit un mot.',
    ),
    choices: [
      { label: 'Poulet.', time: 40, nd: -2, do: (G) => G.note('Le poulet était du poulet au sens où la mer d\'une fiche de sécurité est une mer. Vous l\'avez mangé. Vous rentriez chez vous ; vous mangeriez correctement là-bas.'), next: 'night' },
      { label: 'Commander un café. Puis un autre.', nd: 6, sub: 'Vous êtes en train de caler votre corps sur l\'heure du Pacifique et il n\'est pas question d\'y renoncer.', time: 40, do: (G) => { G.flag('coffee'); G.nerves(-3); G.note('Deux cafés. Du café de compagnie aérienne, c\'est-à-dire marron, et chaud. Vous les avez bus par principe. Le principe, c\'était l\'heure du Pacifique, et le chef de cabine, en passant, a regardé la seconde tasse un peu plus longtemps qu\'une tasse ne le mérite.'); }, next: 'night' },
      { label: 'Sauter le dîner. Incliner le siège. Essayer de dormir maintenant.', kind: 'comply', dd: -1, nd: -3, time: 40, do: (G) => G.note('Vous avez dormi, un peu, comme on dort en avion : moins endormi qu\'éteint. Quand vous avez refait surface, les plateaux avaient disparu, les lumières étaient baissées, et quelqu\'un, à l\'avant, se tenait parfaitement immobile dans l\'allée.'), next: 'night' },
      { label: 'Demander aimablement à l\'hôtesse si le chef de cabine est toujours comme ça.', kind: 'conflict', nd: 4, dd: -2, time: 40, do: (G) => G.note('Elle a ri, une fois, puis s\'est arrêtée, et a regardé vers l\'avant, là où il se trouvait. ' + V('« Il est très consciencieux »,') + ' a-t-elle dit, et elle vous a donné les pâtes que vous n\'aviez pas demandées.'), next: 'night' },
    ],
  };

  scenes.night = {
    art: 'cabin',
    loc: 'Croisière · milieu de l\'Atlantique · quatrième heure',
    enter: (G) => G.dread(2),
    text: (G) => p(
      G.last(),
      'La cabine est sombre à présent. Les écrans, éteints pour la plupart. La carte sur le dossier montre un petit avion au-dessus d\'une grande quantité de bleu, avec GROENLAND quelque part en haut à droite, plus rumeur que lieu.',
      'Le chef de cabine parcourt l\'allée. Lentement, depuis l\'avant, une petite fiche dans une main et un crayon dans l\'autre, et à chaque rang il s\'arrête, regarde, et fait une marque. Il n\'explique rien. Personne ne demande rien. Arrivé à votre rang, il vous regarde, puis le 31C, puis le siège vide côté hublot, et écrit.',
      'À l\'avant, on a tiré le rideau de la cabine avant. Il y a de la lumière derrière, et des gens qui y entrent et en sortent en hâte, puis le chef de cabine planté devant, les mains jointes, tourné non pas vers le rideau mais vers vous autres.',
    ),
    choices: [
      { label: 'Dormir, ou essayer.', kind: 'comply', dd: -1, nd: -4, time: 40, do: (G) => G.note('Vous avez fermé les yeux. Derrière vos paupières, on continuait d\'arpenter l\'allée. Quelque part vers l\'avant, une femme a dit ' + V('« Est-ce qu\'il va bien ? »') + ' et quelqu\'un a dit ' + V('« S\'il vous plaît retourner à votre siège, »') + ' et vous n\'avez pas ouvert les yeux, parce que ce n\'était pas à vous qu\'on parlait. Pas encore.'), next: 'cabin' },
      { label: 'Regarder la carte.', dd: 2, time: 40, do: (G) => G.note('Le petit avion avançait si lentement qu\'il semblait hésiter. Puis, pendant un moment, la carte n\'a plus rien montré du tout, juste du bleu, et un temps restant figé à 5:12 plus longtemps qu\'une minute ne dure.'), next: 'cabin' },
      { label: 'Aller aux toilettes à l\'avant. Passer devant le rideau.', whyNot: 'Pas en passant devant lui.', dd: 4, nd: 2, dreadMax: 90, time: 40, do: (G) => { G.flag('saw_galley'); G.note('Par l\'entrebâillement du rideau : quelqu\'un au sol dans l\'office, une hôtesse agenouillée à côté, une couverture, une main. Vous ne voyez pas ce qui ne va pas et on ne vous le dira pas. Le chef de cabine se tient au-dessus d\'eux, les mains jointes – regardant non pas le sol, mais la cabine, par l\'entrebâillement, et donc vous. ' + V('« S\'il vous plaît retourner à votre siège, »') + ' dit-il, sans rien bouger d\'autre que la bouche.'); }, next: 'cabin' },
      { label: 'Demander au 31C s\'il a vu la fiche.', nd: -1, dd: -2, time: 40, do: (G) => { G.flag('met31c'); G.note(V('« Un comptage »,') + ' a-t-il dit. ' + V('« Ils font ça avant d\'atterrir là où ils n\'avaient pas prévu d\'atterrir. »') + ' Il a dit ça sur le ton de la plaisanterie. Aucun de vous deux n\'a ri. C\'était la première chose qu\'il disait en quatre heures.'); }, next: 'cabin' },
    ],
  };

  scenes.cabin = {
    art: 'cabin',
    loc: 'Quelque part au sud du Groenland · 37 000 pieds',
    enter: (G) => G.flag('diverted'),
    text: (G) => p(
      G.last(),
      'Le voyant « attachez vos ceintures » s\'allume avec un bruit de cuillère contre un verre.',
      G.has('saw_galley') ? 'Le commandant : un client est souffrant. Vous le savez. L\'avion se déroute sur Reykjavík. Il est désolé. Il dit le mot deux fois, et les deux fois, on dirait un être humain qui le dit.' : 'Le commandant : un client est souffrant. L\'avion se déroute sur Reykjavík. Il est désolé. Il dit le mot deux fois, et les deux fois, on dirait un être humain qui le dit.',
      'La cabine fait ce que font les cabines. Quelqu\'un dit : ' + V('« Dites-moi que c\'est une blague. »') + ' Quelqu\'un, trois rangs devant, appuie sur le bouton d\'appel, et n\'arrête plus. Un homme près de l\'office se lève et demande, d\'une voix faite pour porter, qui, au juste, va lui payer sa correspondance.',
      'Personne ne lui répond. Le bouton d\'appel continue de sonner.',
    ),
    choices: [
      { label: 'Ne rien dire. Regarder la carte sur l\'écran du siège.', kind: 'comply', dd: 4, sub: 'Le petit avion vire.', time: 15, do: (G) => G.note('Le petit avion sur la carte a viré au nord. En dessous, le mot GROENLAND, et plus bas, rien. Autour de vous, les récriminations se poursuivent sans vous.'), next: 'cabin_purser' },
      { label: 'Demander poliment à une hôtesse ce qui se passera après l\'atterrissage.', nd: 2, time: 15, do: (G) => { G.flag('asked_crew'); G.nerves(3); G.note('Elle vous a souri comme on sourit à un chien dans une voiture. ' + V('« Tout sera communiqué. »') + ' Elle n\'a pas dit par qui. Derrière elle, l\'homme près de l\'office était toujours debout.'); }, next: 'cabin_purser' },
      { label: 'Joindre votre voix au chœur. Tout haut. Vous avez une vie qui vous attend à Los Angeles.', whyNot: 'Pas avec lui qui écoute.', kind: 'conflict', nd: 10, dreadMax: 80, time: 15, do: (G) => { G.strike(); G.flag('objected'); G.note('Vous l\'avez dit. Sans crier – mais pas à voix basse non plus, et quelques têtes se sont tournées, et l\'homme près de l\'office vous a désigné du doigt comme une pièce à conviction. Pendant un instant, on aurait dit une cabine entière tombée d\'accord.'); }, next: 'cabin_purser' },
      { label: 'Appuyer sur le bouton d\'appel, comme les autres.', kind: 'conflict', nd: 4, time: 15, do: (G) => G.note('Vous avez appuyé. Le vôtre a rejoint celui de trois rangs devant, et un autre derrière, jusqu\'à ce que la cabine ne soit plus qu\'un petit orchestre jouant une seule note, et personne n\'est venu, et personne n\'allait venir.'), next: 'cabin_purser' },
    ],
  };

  scenes.cabin_purser = {
    art: 'cabin',
    loc: 'Quelque part au sud du Groenland · 37 000 pieds',
    enter: (G) => G.dread(2),
    text: (G) => p(
      G.last(),
      'Puis le chef de cabine prend le combiné. Vous entendez l\'accent avant les mots – chaleureux, distingué, extraordinairement patient. Il a attendu que le bouton d\'appel s\'arrête. Il ne s\'est pas arrêté. Il parle par-dessus.',
      V('« Mesdames et messieurs. Je suis en charge de cette cabine, et la sécurité de nos clients est tantamount. Toute personne qui résiste ou objecte à cette diversion sera déchargée en Islande. Nous faisons notre meilleur. »'),
      'Un silence. L\'homme près de l\'office se rassied. Le bouton d\'appel s\'éteint. Trois rangs derrière, quelqu\'un rit une fois, et s\'arrête.',
      G.has('objected') && W('Il ne regarde pas l\'homme près de l\'office. Il regarde votre rang.'),
    ),
    choices: (G) => [
      { label: 'Encaisser.', kind: 'comply', dd: 3, time: 15, do: (G) => G.note('Vous avez encaissé. Tout le monde a encaissé. C\'est remarquable, la vitesse à laquelle deux cents personnes peuvent décider qu\'elles ont été patientes depuis le début.'), next: 'cabin2' },
      { label: G.has('objected') ? 'Regarder autour de vous. Voir qui d\'autre a protesté.' : 'Regarder autour de vous. Voir qui a protesté.', time: 15, do: (G) => { G.nerves(-2); G.note('Quatre visages, cinq peut-être, encore fermés. L\'homme près de l\'office. Une femme avec un petit. Vous les mémorisez comme on mémorise les issues.'); }, next: 'cabin2' },
      { label: 'Rire. Une fois.', kind: 'conflict', nd: 3, dd: -2, time: 15, do: (G) => G.note('Vous avez ri, une fois, et quelqu\'un deux rangs derrière a ri avec vous, puis vous vous êtes arrêtés tous les deux, parce que le chef de cabine avait reposé le combiné très délicatement et regardait vers le fond de l\'allée.'), next: 'cabin2' },
    ],
  };

  scenes.cabin2 = {
    art: 'cabin',
    loc: 'En descente · Atlantique Nord',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      (G.has('met31c') ? 'L\'homme du 31C dit, à voix basse : ' : 'L\'homme du 31C, qui n\'a rien dit depuis Heathrow, dit : ') + V('« Ils ne peuvent pas faire ça, quand même. Si ? »'),
      'Il parle du débarquement. Il vous regarde comme si vous pouviez le savoir.',
      'Dans l\'allée, le chef de cabine avance lentement vers l\'arrière, lisant les numéros de sièges sur les panneaux au-dessus des rangs comme on relit une liste écrite de sa main.',
    ),
    choices: [
      { label: '« Je ne crois pas qu\'ils puissent, non. »', dd: -4, nd: -2, time: 45, do: (G) => { G.collect(1); G.flag('ally31c'); G.note('Il a hoché la tête, sans avoir l\'air rassuré, et vous n\'étiez pas sûr d\'avoir été rassurant. Mais vous étiez deux, maintenant.'); }, next: 'cabin3' },
      { label: '« Franchement, je ne sais pas. »', dd: -1, time: 45, do: (G) => { G.flag('ally31c'); G.note('Il a hoché la tête. ' + V('« Non. Moi non plus. »') + ' Vous avez regardé la carte sur l\'écran, ensemble. Le petit avion était tout au bord.'); }, next: 'cabin3' },
      { label: 'Mettre vos écouteurs.', kind: 'comply', dd: 5, nd: -2, time: 45, do: (G) => { G.nerves(2); G.note('Vous avez mis vos écouteurs. Ils ne diffusaient rien. Vous les avez gardés. Quand vous avez levé les yeux, le chef de cabine était à la hauteur de votre rang, sans vous regarder, et puis il était passé.'); }, next: 'cabin3' },
      { label: 'Appuyer sur le bouton d\'appel et redemander.', kind: 'conflict', nd: 5, dd: 2, time: 45, do: (G) => { G.nerves(4); G.flag('asked_crew'); G.note('Le bouton s\'est allumé. Personne n\'est venu. Au bout d\'un moment, il s\'est éteint tout seul, et le chef de cabine, trois rangs plus loin, s\'est retourné et a regardé le panneau au-dessus de votre tête, puis vous.'); }, next: 'cabin3' },
    ],
  };

  scenes.cabin3 = {
    art: 'cabin',
    loc: 'Approche finale · Keflavík',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      'Le chef de cabine, de nouveau, au combiné. ' + V('« À l\'atterrissage, s\'il vous plaît rester assis avec votre ceinture fermée jusqu\'à ce que l\'équipe médicale a attendu notre client dans la cabine avant. Je vous laisserai savoir quand vous pouvez vous lever. Je vous laisserai savoir. »'),
      'De la pluie sur les hublots. En dessous, un littoral qui a l\'air d\'avoir été raclé. Les lumières d\'une ville qui n\'est pas Reykjavík, puis plus de lumières du tout.',
      'Vous n\'aviez encore jamais atterri nulle part, de nuit, sans voir la piste avant qu\'elle ne soit sous vous.',
    ),
    choices: [
      { label: 'Regarder par le hublot.', whyNot: 'Pas avec lui dans l\'allée.', dd: 5, nd: 3, dreadMax: 90, time: 25, do: (G) => { G.nerves(3); G.note('Des lumières bleues, puis orange, puis bleues. Une ambulance, portes ouvertes, sur le tarmac mouillé, et à côté d\'elle, mais pas avec elle, un homme en uniforme bleu marine, debout, très droit. Une voix dans l\'allée, tout près de votre oreille : ' + V('« Le store en bas, s\'il vous plaît. »')); }, next: 'ground' },
      { label: 'Garder les yeux rivés sur la carte de l\'écran.', kind: 'comply', dd: 4, time: 25, do: (G) => G.note('Le petit avion a franchi le bord de la carte et, pendant un moment, n\'a figuré sur aucune carte du tout. Puis l\'écran est devenu noir et vous a montré votre propre visage.'), next: 'ground' },
      { label: 'Compter les rangs jusqu\'à la sortie la plus proche. Deux fois.', nd: -2, time: 25, do: (G) => { G.nerves(-2); G.note('Six rangs. Six rangs. C\'est le genre d\'information qui n\'est utile que s\'il se passe quelque chose, et vous avez commencé à vouloir qu\'il se passe quelque chose.'); }, next: 'ground' },
    ],
  };

  scenes.ground = {
    art: 'cabin',
    loc: 'Keflavík · au sol · moteurs coupés',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      'Trente minutes au sol. L\'équipe médicale est venue et repartie, ou n\'est pas venue. Personne ne l\'a dit. Le signal des ceintures reste allumé. Le chef de cabine se tient à l\'avant de la cabine, les mains croisées, et vous regarde tous, du haut de l\'allée, patiemment, comme si vous étiez une file d\'attente.',
      'L\'homme du 31C, à voix basse : ' + V('« Je ne crois pas qu\'on aille à LA. »'),
    ),
    choices: [
      { label: 'Se lever. Juste pour s\'étirer.', whyNot: 'Il a dit : assis.', kind: 'conflict', nd: 6, dd: -3, dreadMax: 75, time: 15, do: (G) => { G.nerves(4); G.flag('stood'); G.dread(4); G.note(V('« Asseyez-vous en bas, s\'il vous plaît. »') + ' Pas fort. Il n\'avait pas besoin de parler fort. Deux cents personnes vous ont regardé vous rasseoir.'); }, next: 'landing' },
      { label: 'Rester assis. Regarder le chef de cabine vous regarder.', kind: 'comply', dd: 5, time: 15, do: (G) => G.note('Il a regardé chaque rangée à tour de rôle, et en arrivant à la vôtre il ne s\'est pas arrêté, pas exactement. Mais il a ralenti, et vous le saviez tous les deux.'), next: 'landing' },
      { label: 'Demander au 31C ce qui va se passer, selon lui.', nd: -2, time: 15, do: (G) => { G.collect(G.has('ally31c') ? 0 : 1); G.flag('ally31c'); G.note(V('« Un hôtel, j\'imagine. Ou ils nous laissent ici. »') + ' Il a ri, puis y a réfléchi, et s\'est arrêté.'); }, next: 'landing' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 01:10 deplaning */
  scenes.landing = {
    art: 'terminal',
    loc: 'Aéroport international de Keflavík · Arrivées',
    enter: (G) => {
      atLeast(G, 30);
      if (G.once('landing_msgs')) {
        G.msg('email', {
          from: 'Albion Atlantic Customer Care', subj: 'Votre hébergement de nuit', key: 'accommodation',
          body: `Cher Client,\n\nEn raison d'un déroutement opérationnel, votre vol AB 0271 est retardé jusqu'à demain. Nous avons organisé un hébergement pour vous.\n\nVeuillez utiliser le lien ci-dessous pour confirmer votre chambre :\n\n<a href="#" onclick="return false">Heathrow Renaissance Lodge – Bath Road, Hounslow TW6</a>\n\nLe transport vers votre hébergement sera assuré.\n\nNous vous prions de nous excuser pour la gêne occasionnée. Nous faisons de notre mieux.`,
          actions: [{ label: 'Ouvrir la page de réservation', if: (G) => !G.has('at_hotel') && !G.has('booked'), next: 'heathrow' }],
        });
        G.bot('Salut ! Je suis Ally, votre assistant virtuel Albion Atlantic. Je vois votre vol AB 0271 est à temps. Comment je peux aider ? ✈️');
      }
    },
    text: (G) => p(
      G.last(),
      'Le signal des ceintures s\'éteint sans annonce. C\'est ça, l\'annonce. Le terminal est éclairé comme l\'intérieur d\'un frigo. Quelques centaines d\'entre vous quittent l\'avion en traînant les pieds et s\'y engouffrent, devant un homme en gilet fluo qui ne regarde personne.',
      G.has('objected') && W('En sortant, le chef de cabine vous a regardé un peu trop longtemps.'),
      'Contrôle des passeports. Une longue file. Puis l\'équipage passe devant – au complet, en file indienne, valises à roulettes au pas cadencé, sans un regard à droite ni à gauche – et franchit une porte marquée STAFF. Derrière eux, la porte ne se referme pas vraiment : elle cesse plutôt d\'être une porte.',
      'La file regarde la scène. Personne ne dit rien. Votre téléphone vibre, puis vibre encore : un mail, et le truc du chat. Quoi qu\'ils veuillent que vous fassiez ensuite, c\'est là-dedans.',
    ),
    choices: [
      { label: 'Rejoindre la file du contrôle des passeports. S\'occuper du téléphone là-bas.', kind: 'comply', dd: 3, time: 10, do: (G) => G.note('La file a avancé comme avancent les files. Par la fenêtre, l\'avion avait ses feux éteints.'), next: 'hall' },
      { label: 'Trouver un humain. N\'importe lequel.', whyNot: 'Tout le monde ici est en uniforme.', dd: -4, dreadMax: 85, time: 10, next: 'icelander' },
      { label: 'Attendre. Quelqu\'un va faire une annonce.', kind: 'comply', dd: 8, sub: 'Quelqu\'un en fait toujours une.', time: 20, next: 'wait1' },
    ],
  };

  scenes.heathrow = {
    art: 'terminal',
    loc: 'Page de réservation · Heathrow Renaissance Lodge',
    text: p(
      'La page se charge lentement, puis d\'un coup. Une photo de lit. Une photo de petit-déjeuner. <em>Bath Road, Hounslow, TW6.</em> À douze minutes du Terminal 5 par navette gratuite.',
      'Vous êtes à 1 900 kilomètres du Terminal 5.',
      'Il y a un gros bouton. Il dit CONFIRMER. En dessous, en plus petit : <em>Le transport vers votre hébergement sera assuré.</em>',
    ),
    choices: [
      { label: 'Confirmer.', kind: 'comply', dd: 10, sub: 'Ils ont dit que le transport serait assuré.', time: 5, do: (G) => { G.flag('booked'); G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Réservation confirmée — votre voiture attend', body: 'Votre hébergement est confirmé.\n\nUn chauffeur vous attend à la sortie des Arrivées. Veuillez repérer l\'écusson Albion Atlantic.\n\nDurée estimée du trajet : –:–' }); }, next: 'car' },
      { label: 'Fermer. Vous êtes en Islande.', whyNot: 'Il y a le logo dessus.', dd: -3, dreadMax: 90, time: 5, do: (G) => { G.nerves(2); G.note('Vous avez fermé la page de réservation. Le mail est toujours là, avec son logo, patient.'); }, next: 'hall' },
    ],
  };

  scenes.car = {
    art: 'stand',
    loc: 'Keflavík · Devant les Arrivées',
    text: p(
      'Il y a bel et bien une voiture. Noire, longue, immaculée, un petit écusson doré sur la portière. Le chauffeur tient une tablette avec votre nom dessus – votre nom, correctement orthographié, ce qui est plus que ce que la compagnie a réussi jusqu\'ici.',
      V('« Pour le Renaissance ? »'),
      'Il ouvre la portière arrière. Air chaud. Cuir. Au-delà du parking, la route file dans une obscurité qui ne semble pas avoir de fin.',
    ),
    choices: [
      { label: 'Monter.', kind: 'comply', sub: 'Au chaud.', do: (G) => { G.flag('via_car'); G.end('crew'); } },
      { label: 'Non. Non, merci.', whyNot: 'Il a votre nom.', dd: 5, dreadMax: 85, time: 5, do: (G) => { G.nerves(5); G.dread(8); G.note('Le chauffeur n\'a pas eu l\'air surpris. Il a refermé la portière, il est resté là où il était, et il y était encore quand vous vous êtes retourné, une fois aux portes.'); }, next: 'hall' },
    ],
  };

  scenes.icelander = {
    art: 'terminal',
    loc: 'Keflavík · Arrivées',
    text: (G) => p(
      'Une femme en uniforme – pas celui de la compagnie ; l\'aéroport, peut-être, ou la douane, ou simplement quelqu\'un qui possède une polaire avec un badge dessus – se tient près des portes, les mains dans le dos.',
      'Elle vous écoute. Elle regarde votre téléphone. Elle regarde le mail avec le logo.',
      V(LX('“Don\'t follow the emails,”')) + ' dit-elle, gentiment, avec la voix de quelqu\'un qui l\'a déjà dit quarante fois ce soir. ' + V(LX('“There are buses.”')),
      'Vous demandez où. Elle désigne, d\'un geste vague, l\'Islande.',
    ),
    choices: [
      { label: 'Lui demander si elle parle français.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 5, do: (G) => { G.flag('fr_asked'); G.flag('hint_icelander'); G.nerves(-4); G.dread(-4); G.note(LX('“A little. Not the emails. There are buses.”') + ' Elle l\'a dit dans votre langue, avec précaution, comme quelqu\'un qui porte quelque chose de rempli à ras bord.'); }, next: 'hall' },
      { label: 'La remercier. Aller trouver les bus.', do: (G) => { G.flag('hint_icelander'); G.nerves(-4); G.note('« Il y a des bus », a-t-elle dit. C\'est la phrase la plus solide qu\'on vous ait dite depuis le Groenland.'); }, next: 'hall' },
    ],
  };

  scenes.wait1 = {
    art: 'terminal',
    loc: 'Keflavík · Arrivées',
    text: (G) => p(
      G.counted('wait1') >= 1 ? 'Encore vingt minutes. Les haut-parleurs restent muets. Il y a moins de monde dans le hall chaque fois que vous levez les yeux, et ceux qui restent vous regardent, comme si l\'annonce, c\'était peut-être vous.' : 'Vingt minutes. La file au contrôle des passeports se vide. Personne ne fait d\'annonce.',
      G.counted('wait1') >= 1 ? 'Le fond du hall est presque vide maintenant. La porte qui ne dit rien est toujours ouverte.' : 'Les gens de votre vol dérivent, par deux ou par trois, vers le fond du hall, où se trouve une porte qui ne dit rien du tout.',
      G.t >= T(1, 2, 0) && W('Les lumières, de ce côté du hall, sont passées à mi-puissance.'),
    ),
    choices: [
      { label: 'Attendre encore. Il y aura une annonce.', kind: 'comply', dd: 6, sub: 'Il y a un système de sonorisation. Vous voyez les haut-parleurs.', time: 25, next: (G) => (G.t >= T(1, 2, 20) ? 'wait2' : 'wait1'), do: (G) => { G.count('wait1'); G.nerves(8); G.dread(8); } },
      { label: 'Suivre le mouvement.', whyNot: 'Personne ne vous l\'a dit.', dreadMax: 90, time: 5, next: 'hall' },
    ],
  };

  scenes.wait2 = {
    art: 'terminal',
    loc: 'Keflavík · Arrivées',
    text: p(
      'Le hall est vide maintenant, à part vous, un agent d\'entretien, et le bruit que fait le plafond.',
      'Votre téléphone vibre. Un mail. <em>Nous avons organisé des cars pour vous.</em> Il ne dit pas où. Il ne dit pas quand. Il est daté d\'il y a une heure.',
      'Derrière vous, les lumières passent au quart.',
    ),
    enter: (G) => { atLeast(G, 45); if (G.once('coach_mail_w')) G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Transport onward arrangé', stamp: G.t - 60, body: 'Cher Client,\n\nNous avons organisé des cars pour vous transférer à votre hébergement.\n\nVeuillez vous rendre aux cars.\n\nNous faisons de notre mieux.' }); },
    choices: [
      { label: 'Se rendre aux cars.', kind: 'comply', time: 15, do: (G) => { G.flag('via_terminal'); G.end('crew'); } },
      { label: 'Courir vers la porte qui ne dit rien.', whyNot: 'Vous ne pouvez pas courir.', nd: 5, dreadMax: 92, time: 5, once: 'run_door', do: (G) => { G.nerves(10); G.note('Vous avez couru. Personne ne vous a arrêté. La porte qui ne disait rien donnait sur de l\'air froid, une lumière au sodium et, Dieu merci, d\'autres gens.'); }, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 01:20 the hall (hub) */
  scenes.hall = {
    art: 'terminal',
    loc: 'Keflavík · Hall des bagages',
    enter: (G) => {
      if (G.t >= T(1, 2, 40)) { G.go('wait2'); return; }
      if (G.once('hall_intro')) G.note(p(G.last(), p(
        'Ils ne veulent pas rendre les bagages en soute. Un homme derrière un comptoir l\'explique sans lever les yeux : les bagages sont <em>dans le système</em>. Vous aussi, vraisemblablement, vous êtes dans le système. Ça ne vous a aidés ni l\'un ni l\'autre.',
        'Personne n\'a rien annoncé. Aucun mail à propos de ce hall, pas de SMS, pas de haut-parleur. Des gens de votre vol y traînent, par deux ou par trois : un homme en polaire, une femme avec un petit, un couple âgé près de la vitre. Tout au fond, il y a une porte qui ne dit rien du tout.',
      )));
    },
    text: (G) => hub(G,
      `${G.clock(G.t)}. Hall des arrivées. Tout est fermé. Vous n'avez ni sac, ni manteau, ni brosse à dents, et un téléphone à ${G.battery()}%.`,
      'hall',
      G.t >= T(1, 2, 10) ? W('Le hall se vide. Mieux vaudrait, sans doute, ne pas y être le dernier.') : ''),
    choices: (G) => [
      { label: 'Réclamer votre sac. Poliment.', whyNot: 'Rien en vous n\'est gentil, là.', kind: 'comply', dd: 2, nerveMax: 70, time: 8, once: 'bag_nice', do: (G) => { G.nerves(2); G.note('L\'homme derrière le comptoir dit que les bagages sont dans le système. Vous demandez quel système. Il dit : le système. Vous demandez quand. Il dit : quand ce sera résolu. Il n\'a pas levé les yeux une seule fois.'); }, next: 'hall' },
      { label: 'Exiger votre sac. Il y a votre dentifrice dedans.', kind: 'conflict', nd: 8, sub: 'Il faut bien que quelqu\'un le fasse.', time: 10, once: 'bag', do: (G) => { G.strike(); G.note('Il lève les yeux. C\'est la seule chose qui change. ' + V('« Je vais faire une note. »') + ' Il prend note.'); }, next: 'hall' },
      { label: 'Longer les boutiques fermées.', dd: 3, time: 12, once: 'shops', do: (G) => { G.nerves(-1); G.dread(2); G.note('Le duty free : rideaux baissés. Un café : chaises sur les tables, la machine à café débranchée et tournée vers le mur. Un distributeur qui n\'accepte que les cartes islandaises, plein de choses avec la lettre ð dedans. Vous restez devant plus longtemps que vous ne le vouliez.'); }, next: 'hall' },
      { label: 'Essayer la porte STAFF.', whyNot: 'C\'est écrit ONLY.', dreadMax: 80, time: 6, once: 'staff', do: (G) => { G.dread(8); G.nerves(5); G.note('Verrouillée. La poignée est tiède, comme si quelqu\'un la tenait encore un instant plus tôt. Vous y collez l\'oreille. Il n\'y a rien derrière. Pas du silence – rien. Quand vous reculez, le panneau dit STAFF, et en dessous, en plus petit, ce que vous n\'aviez pas remarqué : ONLY.'); }, next: 'hall' },
      { label: 'Regarder le tapis à bagages.', dd: 3, time: 8, once: 'carousel', do: (G) => { G.dread(4); G.note('Il tourne. Un seul sac défile. Ce n\'est pas le vôtre. Il a une étiquette bleu marine avec un écusson doré. Il refait un tour, puis le tapis s\'arrête, et le sac a disparu, et le tapis est vide d\'une manière qui suggère qu\'il l\'a toujours été.'); }, next: 'hall' },
      { label: 'Parler à l\'homme en polaire.', whyNot: 'Vous lui aboieriez dessus.', nd: -3, dd: -3, nerveMax: 90, time: 8, once: 'talk_fleece', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_hearsay'); G.note(V('« Hé. Il paraît qu\'il y aurait des bus ? Par là-bas ? Soi-disant ? »') + ' Il montre, vaguement, la porte qui ne dit rien. ' + V('« Quelqu\'un en gilet l\'a dit. Pas un des leurs. »') + ' Il regarde le mail sur votre téléphone. ' + V('« Ouais, je l\'ai reçu aussi. Je vais pas à Heathrow, mec. »')); }, next: 'hall' },
      { label: 'Parler à la femme avec le petit.', whyNot: 'Vous feriez peur à l\'enfant.', nd: -2, dd: -3, nerveMax: 80, time: 8, once: 'talk_mother', do: (G) => { G.collect(1); G.nerves(-2); G.flag('hint_hearsay'); G.msg('sms', { from: '+354 ··· ····', body: 'monte pas dans le beau' }); G.note('Le bambin dort sur son épaule comme si l\'épaule faisait office de mur porteur. ' + V('« Un homme en gilet fluo m\'a dit : pas le beau. Je ne sais pas ce que ça veut dire. Je m\'en tiens à ça. »') + ' Au moment où elle le dit, votre téléphone vibre : un SMS d\'un numéro inconnu.'); }, next: 'hall' },
      { label: 'Retrouver l\'homme du 31C.', whyNot: 'Vous diriez quelque chose d\'irrattrapable.', nd: -3, dd: -3, nerveMax: 95, time: 8, once: 'talk_31c', if: (G) => G.has('ally31c'), do: (G) => { G.collect(1); G.nerves(-3); G.note('Il est près des portes, à regarder le noir dehors. ' + V('« Donc il y a des bus, »') + ' dit-il. ' + V('« Super. À qui ? »') + ' Ni l\'un ni l\'autre ne le sait. Vous décidez, sans le dire, de monter dans le même.'); }, next: 'hall' },
      { label: 'Parler au couple âgé près de la vitre.', whyNot: 'Vous déclencheriez une dispute.', nd: -2, dd: -2, nerveMax: 75, time: 8, once: 'talk_couple', do: (G) => { G.collect(1); G.nerves(-2); G.note('Ils ont beaucoup pris l\'avion et ne sont pas inquiets, disent-ils, de la voix de gens qui le sont. ' + V('« Ça finira par une feuille imprimée, »') + ' dit-il. ' + V('« Ça finit toujours par une feuille imprimée. »')); }, next: 'hall' },
      { label: 'Aller aux toilettes. Vous vous retenez depuis le Groenland.', nd: -3, time: 12, once: 'loo', do: (G) => { G.flag('bathroom'); G.nerves(-2); G.note('Un soulagement, en quelque sorte. Quand vous ressortez, le hall s\'est réorganisé : les mêmes gens, à d\'autres endroits, tous tournés vers la même porte.'); }, next: 'hall' },
      { label: G.did('talk_fleece') ? 'Aller dans la direction indiquée par la polaire.' : G.has('hint_icelander') ? 'Aller trouver les bus dont elle a parlé.' : G.did('talk_mother') ? 'Suivre la femme avec le petit. Elle a l\'air de savoir où elle va.' : 'Suivre le mouvement, par la porte qui ne dit rien.', dd: -2, time: 5, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~02:00 bus stand 1 */
  // the white coach leaves. Once you are late (the bathroom, or 02:20), it gives you eight minutes; looking at
  // another coach while its door is closing is how you spend them
  const BUS1_LATE = (G) => G.has('bathroom') || G.t >= T(1, 2, 20) || G.did('wait_coaches');
  const BUS1_GONE = (G) => BUS1_LATE(G) && G.S.bus1Leave != null && G.t >= G.S.bus1Leave;
  const BUS1_CHECK = (G) => { if (!BUS1_GONE(G)) return; if (G.S.buses.buses1) G.S.buses.buses1 = G.S.buses.buses1.filter((b) => b.key !== 'plain'); if (G.once('bus1_gone_note')) { G.flag('bus1_gone'); G.dread(8); G.nerves(6); G.note((G.last() ? G.last() + ' ' : '') + 'Le car blanc est parti. Vous l\'avez regardé partir, finalement : la porte se repliant sur un homme en polaire qui ne s\'est pas retourné, les feux arrière devenant rouges, puis petits, puis plus rien, le long d\'une route où ne brillait aucune autre lumière. Les deux qui restent ont le moteur qui tourne, et l\'un des deux est très beau.'); } };
  scenes.buses1 = {
    art: 'stand',
    loc: 'Keflavík · Arrêt des cars · dehors',
    enter: (G) => { if (BUS1_LATE(G) && G.S.bus1Leave == null) G.S.bus1Leave = G.t + 8; BUS1_CHECK(G); },
    afterLook: (G) => BUS1_CHECK(G),
    text: (G) => p(
      G.last(),
      BUS1_GONE(G) ? 'Dehors, il fait deux degrés, et le vent a fait un long chemin pour venir à votre rencontre. Deux cars tournent au ralenti sous les lampes au sodium, maintenant, là où il y en avait trois.' : G.did('wait_coaches') ? 'Dehors, il fait deux degrés, et le vent a fait un long chemin pour venir à votre rencontre. Trois cars tournent au ralenti sous les lampes au sodium, et la plupart des gens de votre vol sont déjà dans l\'un d\'eux, ou partis.' : 'Dehors, il fait deux degrés, et le vent a fait un long chemin pour venir à votre rencontre. Trois cars tournent au ralenti sous les lampes au sodium. Vos compagnons de vol s\'avancent vers eux avec la démarche flottante, hésitante, des gens à qui on n\'a rien dit.',
      BUS1_GONE(G) ? 'Le jaune est un bus de ville, et il veut un ticket. Le bleu marine, c\'est vous qu\'il veut.' : BUS1_LATE(G) ? 'Vous êtes en retard. Le gros de la foule est déjà monté dans quelque chose. Les portes commencent à se fermer. Le car banal n\'attendra pas que vous vous décidiez.' : 'Personne ne contrôle les billets. Personne ne contrôle rien.',
      G.did('talk_mother') && W('« Pas le beau. »'),
      W('Regardez avant de monter. Regarder coûte quelques minutes. Monter coûte davantage.'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: G.pick(['#c7c3b6', '#b8b4a6', '#8d8a80']), windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'night' },
        name: G.pick(['Un car blanc sans aucune livrée', 'Un car blanc cassé avec un rétroviseur fêlé', 'Un car gris avec un autocollant de location qui se décolle de la portière']),
        sign: G.pick(['ALBION ATL → HOTEL', 'AB0271  HOTEL', 'FLIGHT PPL – HOTEL']), signStyle: 'paper',
        look: ['Chauffeur en gilet fluo, en train de manger un sandwich. Il hausse les épaules quand vous le regardez.', BUS1_LATE(G) ? 'Moteur en marche. La porte commence à se fermer.' : 'Moteur en marche. Porte ouverte.'],
        lookGo: (G) => (BUS1_LATE(G) ? 'bus1_door' : null), lookTime: 2,
        hidden: [(G.did('talk_fleece') ? 'L\'homme en polaire est au troisième rang.' : 'Un homme en polaire que vous reconnaissez du hall est au troisième rang.') + ' Un petit dort sur quelqu\'un.', 'Tout le monde à bord porte ce qu\'il portait dans l\'avion, et ça se voit.'],
        boardLabel: (G) => (BUS1_LATE(G) ? 'Courir' : 'Monter'),
        board: { time: 5, do: (G) => { if (BUS1_LATE(G)) G.nerves(6); G.flag('bus1_ok'); }, next: 'ride' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'night' },
        name: 'Un car bleu marine avec un écusson doré sur le flanc',
        sign: 'ALBION ATLANTIC WELCOMES YOU', signStyle: 'led',
        look: ['Chauffeur en uniforme de chef de cabine. Il vous sourit, à vous en particulier.', 'Éclairage intérieur vif et chaud. Plein de places libres.'],
        hidden: ['Les passagers sont reposés. Chemises repassées. Quelqu\'un sort de chez le coiffeur.', 'Vous ne reconnaissez pas un seul visage. Vous avez passé neuf heures en vol avec ces gens.', 'Son badge est vierge.'],
        lookTime: (G) => (BUS1_LATE(G) ? 9 : 3),
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const flybus = {
        key: 'city',
        art: { livery: '#cfae36', windows: 'dim', passengers: 'luggage', sign: 'print', driver: 'plain', ground: 'night' },
        name: 'Un bus jaune aux couleurs de la ville',
        sign: 'FLYBUS · REYKJAVÍK BSÍ', signStyle: 'print',
        look: ['Chauffeur, blasé, qui consulte une tablette.', 'Des passagers avec sacs à dos et valises à roulettes.'],
        hidden: ['Ils ont des bagages. Vous n\'avez pas de bagages.', 'Un autocollant près de la porte : TICKET OBLIGATOIRE.'],
        lookTime: (G) => (BUS1_LATE(G) ? 9 : 3),
        board: { time: 5, next: 'bsi' },
      };
      return BUS1_GONE(G) ? G.shuffle([crest, flybus]) : G.shuffle([correct, crest, flybus]);
    },
    choices: [
      { label: 'Ne monter dans rien. Le mail parlait de cars. Attendre les instructions.', kind: 'comply', dd: 10, sub: 'Ils ont dit des cars. Ceux-là ne sont peut-être pas les cars.', time: 35, once: 'wait_coaches', next: 'wait2' },
    ],
  };

  scenes.bus1_door = {
    art: 'stand',
    loc: 'Keflavík · Arrêt des cars · le car banal',
    text: (G) => p(
      'Vous vous en approchez. Un carton écrit au feutre dans le pare-brise, un chauffeur en gilet fluo avec un demi-sandwich, et derrière les vitres, affalés à des hauteurs diverses, des gens que vous regardez depuis neuf heures. La porte est à moitié fermée. Il l\'ouvre complètement d\'un coup de levier, vous regarde, et dit, la bouche encombrée de sandwich,',
      V(LX('“In or out? I\'m going.”')),
      G.did('talk_fleece') ? 'Du troisième rang, l\'homme en polaire lève une main.' : 'Au troisième rang, un homme en polaire que vous reconnaissez à moitié lève une main, vers vous ou vers la vitre.',
    ),
    choices: (G) => [
      { label: 'Dedans.', time: 2, do: (G) => { G.nerves(4); G.flag('bus1_ok'); G.note('Vous montez. La porte se replie derrière vous avec un bruit de décision prise. ' + V(LX('“Hotel,”')) + ' dit le chauffeur, au pare-brise, et démarre avant que vous ayez eu le temps de vous asseoir.'); }, next: 'ride' },
      { label: 'Lui demander d\'abord où il va.', kind: 'conflict', nd: 4, time: 3, do: (G) => { G.nerves(4); G.dread(4); G.S.bus1Leave = G.t; G.note(V(LX('“Hotel. Yours, I think. Somebody\'s.”')) + ' Il vous regarde, puis sa montre, puis la route, et la porte se replie pendant que vous vous demandez encore si c\'était une réponse, et le car démarre, et l\'homme en polaire, cette fois, se retourne.'); }, next: 'buses1' },
      { label: 'Pas encore. Voir les deux autres d\'abord.', kind: 'comply', dd: 6, time: 3, do: (G) => { G.S.bus1Leave = G.t; G.note('Vous reculez. Il hausse les épaules, comme il les a haussées tout à l\'heure, et la porte se replie, et le car démarre avec les seules personnes en Islande dont vous connaissez le visage. Les deux autres sont toujours là. L\'un des deux est très beau.'); }, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- the wrong bus: BSÍ, 02:50 */
  scenes.bsi = {
    art: 'bsi',
    loc: 'Reykjavík · Gare routière BSÍ',
    enter: (G) => {
      G.S.t = Math.max(G.t, T(1, 2, 50)); G.flag('detoured'); G.nerves(10); G.dread(6);
      if (G.once('bsi_dead')) { G.S.bsiBatt = Math.max(1, G.S.batt); G.S.batt = 0; G.S.phoneDead = true; G.S.deadAt = G.t; G.flag('phone_scene'); }
    },
    text: (G) => p(
      'Quarante minutes après le départ, un routard vous demande dans quelle auberge vous êtes, et vous comprenez.',
      'Le bus vous dépose à une gare routière en ville qui sent le diesel et la cannelle. Elle ferme. Un kiosque baisse son rideau ; les routards s\'éloignent déjà, en direction de lits qui sont à eux.',
      `Vous sortez le téléphone pour chercher où vous êtes. Il affiche ${G.S.bsiBatt || 1} %, puis la carte, puis un écran noir avec votre visage dedans. Vous appuyez sur le bouton. Vous appuyez encore. Rien. L'heure est partie avec lui ; la gare a une horloge, et l'horloge s'est arrêtée.`,
      'Et sur le quai du fond, moteur en marche, lumières allumées à l\'intérieur, chaque siège tourné vers la gare : un car bleu marine avec un écusson doré.',
    ),
    buses: (G) => [{
      key: 'crest',
      art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'night' },
      name: 'Un car bleu marine avec un écusson doré, au ralenti sur le quai du fond',
      sign: 'ALBION ATLANTIC · YOUR ACCOMMODATION', signStyle: 'led',
      look: ['Le chef de cabine à la porte, les mains croisées, comme si on lui avait dit que vous veniez.', 'Chaud. Silencieux. Plein de sièges.'],
      hidden: ['Les passagers sont reposés. Personne n\'a son téléphone à la main. Personne n\'en a besoin.', 'La destination sur l\'afficheur LED n\'est pas un lieu. C\'est un mot.'],
      board: { kind: 'comply', do: (G) => G.end('crew') },
    }],
    choices: [
      { label: 'Trouver un taxi. Il y a une station près des portes.', whyNot: 'Vous ne pouvez pas tourner le dos au car.', dreadMax: 88, dd: -3, time: 10, next: 'taxi' },
      { label: 'S\'asseoir dans la gare. Quelqu\'un viendra.', kind: 'comply', dd: 6, time: 20, once: 'bsi_sit', do: (G) => { G.nerves(4); G.note('Vingt minutes sur un siège en plastique. Les agents d\'entretien ont nettoyé autour de vous. Le car n\'est pas parti. À un moment, un homme en gilet fluo est venu se poster dans l\'embrasure de la porte et a dit, en anglais, sans méchanceté : ' + V(LX('“We are closing. Taxi is outside.”'))); }, next: 'bsi' },
    ],
  };

  /* ---- the taxi, and the only person all night who takes you where you ask ---- */
  scenes.taxi = {
    art: 'road',
    loc: 'Un taxi · Reykjavík, vers la sortie',
    enter: (G) => { if (G.once('taxi_in')) G.note(p(G.last(), 'Un taxi, chaud, qui sent le pin et le dîner de quelqu\'un. Le chauffeur a la soixantaine, une radio en sourdine en islandais qui est peut-être la météo, et il vous regarde un moment dans le rétroviseur avant de dire quoi que ce soit. ' + V(LX('“Albion Atlantic?”')) + ' Vous n\'avez pas dit un mot. ' + V(LX('“The clothes. Everybody off that flight looks like they slept in a chair. Where to?”')))); },
    text: (G) => p(G.last(), 'Le compteur tourne. Dehors, la ville a trois rues de profondeur, et ensuite c\'est le noir.'),
    choices: (G) => [
      { label: 'Lui montrer le mail. Celui avec l\'hôtel dedans.', time: 3, once: 'taxi_mail', do: (G) => { G.nerves(G.readMsg('accommodation') ? -2 : 2); G.note(G.readMsg('accommodation')
        ? 'Vous sortez le téléphone. Du verre noir, votre propre visage dedans. Vous aviez oublié. Mais vous aviez lu la chose au contrôle des passeports, et vous la voyez encore à moitié : un Renaissance quelque chose. Bath Road. Hounslow. Vous le dites. ' + V(LX('“Heathrow.”')) + ' Il rit, un rire bref qui n\'est pas dirigé contre vous. ' + V(LX('“Every night somebody has that one. Every night it says Heathrow. The ones with that email, the white bus takes out past the lava, to Hraun. If that is where your people are, I can take you. It is not close, and it is not cheap.”'))
        : 'Vous sortez le téléphone. Du verre noir, votre propre visage dedans. Vous aviez oublié. Vous lui dites qu\'il y avait un mail, avec un hôtel dedans, que vous ne l\'avez jamais ouvert, et que vous n\'en retenez pas un mot. Il hoche la tête comme s\'il entendait ça presque tous les soirs.'); if (G.readMsg('accommodation')) { G.flag('mail_clue'); G.flag('driver_where'); } }, next: 'taxi' },
      { label: 'Lui demander ce qu\'il sait du vol.', nd: -2, time: 5, once: 'taxi_week', do: (G) => { G.flag('driver_week'); G.collect(1); G.note(V(LX('“Your flight? I know your flight. Everybody who drives nights knows your flight.”')) + ' Il compte sur les doigts de sa main libre. ' + V(LX('“Monday it came in at one. Tuesday, one. Wednesday, Thursday, tonight. Same number, same hour, two hundred people with no coats. Every night the airline tells them a driver is waiting for them outside Arrivals. I am outside Arrivals every night, at the rank, and nobody has ever asked me to wait for anybody. Nobody from that company has rung me, or paid me, or any driver I know.”')) + ' Un silence, et les essuie-glaces. ' + V(LX('“The people, I take where they ask. The trouble is most of them don\'t know where to ask.”'))); }, next: 'taxi' },
      { label: 'Lui demander où sont allés les autres.', if: (G) => G.has('driver_week'), nd: -1, time: 4, once: 'taxi_where', do: (G) => { G.flag('driver_where'); G.note(V(LX('“Out past the lava, somewhere. A white bus takes them, when there is a white bus. Which hotel — I don\'t know. There are five out there and they all look like a conference that never came.”')) + ' Il vous jette un coup d\'œil dans le rétroviseur. ' + V(LX('“If you can tell me which one, I will take you. If you can\'t, I will take you where I take everyone who can\'t: a guesthouse in town. The woman who runs it is always awake. Small place, clean, the price is honest, and she has had one of you every night this week.”'))); }, next: 'taxi' },
      { label: 'Lui demander de vous ramener à l\'aéroport, plutôt.', time: 3, once: 'taxi_back', do: (G) => { G.nerves(2); G.dread(2); G.note(V(LX('“Keflavík is closed until five. I can drive you forty minutes to a locked door, if you want to pay for it.”')) + ' Il n\'a pas l\'air de plaisanter. Il n\'a pas l\'air non plus de quelqu\'un qui refuserait.'); }, next: 'taxi' },
      { label: G.has('mail_clue') ? 'Hraun, alors. Là où sont allés les autres qui avaient ce mail.' : 'Lui parler du car blanc. Le panneau en papier, le chauffeur en gilet fluo, celui dans lequel vous n\'êtes pas monté.', whyNot: 'Vous ne resteriez pas poli, et il est le seul à avoir demandé.', nerveMax: 70, if: (G) => G.has('mail_clue') || (G.has('driver_where') && ((G.S.looked['buses1:plain'] && !G.has('business')) || G.did('talk_fleece') || G.did('talk_mother') || G.did('talk_couple') || G.has('ally31c'))), sub: '9 800 couronnes, dit-il, pour aller là-bas. Il faudra que ça passe sur la carte.', time: 40, do: (G) => { G.flag('taxi_hraun'); G.S.t = T(1, 3, 35); G.nerves(6); G.dread(2); G.note(V(LX('“The white ones. Yes. That is Hraun. Forty minutes. Nine thousand eight hundred, and I would like it on the card before we leave the lights, if you don\'t mind. I have been burned this week.”')) + ' La carte passe. La ville s\'arrête. De la lave, sous un ciel bas, et une route avec une seule ligne blanche qui n\'arrête pas de disparaître. Il ne parle pas, et la radio, si. À 03:35, il tourne vers un hôtel bas et large, éclairé comme un aquarium, et dit ' + V(LX('“Good luck,”')) + ' de la voix d\'un homme qui le pense et ne s\'attend pas à ce que ça serve.'); }, next: 'hotel_arrive' },
      { label: 'La pension, alors. N\'importe où avec un lit et une lumière allumée.', kind: 'comply', dd: 4, time: 8, do: (G) => { G.flag('gunnar'); G.note(V(LX('“Lind. Good. Three minutes.”')) + ' Quatre coins de rue, une porte étroite avec une lampe au-dessus, et un compteur qui affiche moins que vous ne le craigniez. Il fait un appel de phares vers la porte, deux fois, et une lumière s\'allume derrière le verre dépoli. ' + V(LX('“Tell her Gunnar sent you. She will know what that means by now.”'))); }, next: 'lind_arrive' },
    ],
  };

  /* ---------------------------------------------------------------- the ride */
  scenes.ride = {
    art: 'road',
    loc: 'Une route · quelque part sur la péninsule de Reykjanes',
    enter: (G) => {
      G.dread(4);
      if (G.once('coach_mail')) G.at(G.t + 30, 'email', { from: 'Albion Atlantic Customer Care', subj: 'Transport onward arrangé', body: 'Cher Client,\n\nNous avons organisé des cars pour vous transférer à votre hébergement. Veuillez vous rendre aux cars.\n\nSi vous avez besoin d\'aide pour localiser les cars, veuillez nous contacter.\n\nNous faisons de notre mieux.' });
      if (G.once('coach_txt')) G.at(G.t + 45, 'sms', { from: 'AlbionATL', body: 'AB0271 : Votre hôtel est HEATHROW RENAISSANCE LODGE. Ne pas répondre.' });
    },
    text: (G) => p(
      'Le car dépasse les dernières lumières, et puis il continue.',
      'Des champs de lave sous un ciel bas. Pas de villes. Pas de panneaux que vous puissiez lire. Vous ne savez pas qui vous a emmené ni où vous allez. Soit vous avez été tendrement accueilli dans le giron du cadre réglementaire européen, soit vous avez été enlevé, avec un car entier de gens épuisés et trop polis pour poser la question.',
      G.has('coffee') && W('Votre cœur fait quelque chose. C\'est le café. C\'est forcément le café.'),
      'Le trajet est long. Il commence à l\'être de façon inquiétante.',
      'Au fond, un enfant de deux ans soupire : ' + V('« Quelle journée. »'),
    ),
    choices: [
      { label: 'Rire. Tout le monde rit. Poliment, et un peu paniqué.', whyNot: 'Ça sortirait de travers.', nd: -6, dd: -4, nerveMax: 85, time: 50, do: (G) => { G.nerves(-5); G.collect(1); }, next: 'hotel_arrive' },
      { label: 'Rester silencieux. Regarder le noir.', kind: 'comply', dd: 4, time: 50, do: (G) => G.nerves(3), next: 'hotel_arrive' },
      { label: 'Aller devant. Demander au chauffeur où va ce car.', kind: 'conflict', nd: 5, dd: 3, time: 50, do: (G) => { G.nerves(6); G.flag('asked_driver'); }, next: 'hotel_arrive' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~03:00 the hotel */
  scenes.hotel_arrive = {
    art: 'lobby',
    loc: 'Hótel Hraun · Réception',
    enter: (G) => {
      G.flag('at_hotel'); atLeast(G, 38);
      if (G.once('hotel_paper')) G.msg('paper', { from: 'Scotché au comptoir de la réception', subj: 'Panneau imprimé', body: '<b>PASSENGERS ALBION ATLANTIC AB0271</b>\n\nBUS TO AIRPORT: <b>11:00</b>\n\nPlease wait in lobby.\n\n(No delivery service until 11:00 am)' });
      if (G.once('hotel_bot')) { G.at(T(1, 3, 50), 'chat', { body: 'Êtes-vous confortable dans votre chambre ? 🙂' }); G.at(T(1, 4, 15), 'chat', { body: 'Votre car départ à 04:30. Un membre du staff va frapper.', key: 'knock_notice' }); }
    },
    text: (G) => p(
      G.has('asked_driver') && W('Le chauffeur n\'a jamais répondu. La radio passait quelque chose en islandais qui était peut-être la météo.'),
      (G.has('taxi_hraun') || G.has('left_lind'))
        ? 'Un hôtel, donc. Bas, large, le genre d\'endroit construit pour des congrès qui ne sont jamais venus, et à cette heure éclairé comme un aquarium où il n\'y aurait personne. Le hall est vide. La boîte à chaussures des cartes de chambre est posée sur le comptoir, avec une seule carte dedans, et la réceptionniste de nuit, à qui on a manifestement dit d\'en attendre encore un, vous la tend sans vous demander votre nom. Elle dit 214.' + (G.did('talk_fleece') ? ' Quelque part au-dessus de vous, l\'homme en polaire dort dans la 216.' : '')
        : 'Un hôtel, donc. Bas, large, le genre d\'endroit construit pour des congrès qui ne sont jamais venus. La réceptionniste de nuit distribue les cartes de chambre en les tirant d\'une boîte à chaussures. La vôtre dit 214.' + (G.did('talk_fleece') ? ' L\'homme en polaire reçoit la 216, et vous la brandit comme un ticket de tombola.' : ''),
      'Non, ils n\'ont pas de dentifrice. Non, ils n\'ont pas de brosses à dents. Rien ne livre ici avant onze heures du matin. Il y a un distributeur. La réceptionniste dit cela de l\'air d\'une femme qui vous tend un canot de sauvetage.',
      'Scotchée au comptoir, une feuille A4, en Arial, légèrement auréolée d\'eau. Elle dit que le bus pour l\'aéroport est à 11h00. C\'est la première information de la nuit qui arrive avec une heure et sans logo.',
    ),
    choices: [{ label: 'Monter à la chambre.', time: 8, next: 'room' }],
  };

  /* ---- the room (hub) ---- */
  const roomStatus = (G) => `Chambre 214. ${G.clock(G.t)}. Vous êtes trop fatigué pour dormir${G.has('toothpaste') ? '' : ', et vos dents sont sales'}${G.has('dinner') ? '' : ', et vous n\'avez rien mangé'}${G.dead() ? ', et le téléphone est mort' : G.battery() <= 10 ? `, et le téléphone est à ${G.battery()}%` : ''}.`;

  scenes.room = {
    art: 'room',
    loc: 'Hótel Hraun · Room 214',
    enter: (G) => {
      G.flag('loc_room');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.dead() && !G.has('phone_scene')) { G.go('phone_dies'); return; }
      if (G.once('room_intro')) G.note(p(G.last(), 'Un lit, une bouilloire, une télévision, une fenêtre sur le parking, et de minuscules flacons de shampoing et d\'après-shampoing avec lesquels vous envisagez déjà de vous brosser les dents. La porte a une chaîne. Vous mettez la chaîne. Puis vous l\'enlevez, au cas où, et vous la remettez.'));
    },
    text: (G) => hub(G, roomStatus(G), 'room'),
    choices: (G) => [
      { label: 'Manger. Des chips et deux mignonnettes de vin.', whyNot: 'Votre estomac dit non.', nerveMax: 90, sub: 'Dîner de fille.', if: (G) => G.has('crisps') && !G.has('dinner'), time: 12, do: (G) => { G.flag('dinner'); G.nerves(-10); G.note('Du sel, puis du vin, puis du sel. Vous mangez assis au bord du lit, le paquet tenu à deux mains comme quelque chose qui pourrait s\'échapper. C\'est le meilleur repas que vous ayez fait depuis Londres, ce qui ne veut pas dire grand-chose, et veut dire quelque chose.'); }, next: 'room' },
      { label: 'Se brosser les dents. Vraiment les brosser.', if: (G) => G.has('toothpaste') && !G.did('brush_hraun'), once: 'brush_hraun', time: 4, do: (G) => { G.nerves(-4); G.dread(-1); G.note('Du dentifrice venu d\'un autel à deux kilomètres au bout d\'une route obscure. Vous brossez pendant deux bonnes minutes en vous regardant dans le miroir, et pendant deux minutes vous êtes quelqu\'un qui va quelque part demain.'); }, next: 'room' },
      { label: 'Se brosser les dents.', if: (G) => !G.has('toothpaste'), time: 4, do: (G) => { const n = G.count('shampoo'); G.nerves(n === 1 ? -1 : 1); G.dread(1); G.note(n === 1 ? 'Il n\'y a pas de dentifrice. Il n\'y a pas de brosse à dents. Il y a de petits flacons sur l\'étagère, et vous les fixez, et vous réfléchissez. Shampoing. Après-shampoing. Lait pour le corps. Vous lisez les ingrédients. Le laureth sulfate de sodium est, techniquement, un tensioactif. Vous le reposez. Vous le reprenez. Vous le reposez.' : n === 2 ? 'Vous êtes déjà passé par là. Le shampoing n\'a pas changé d\'avis, et vous non plus.' : 'Les petits flacons sont alignés sur l\'étagère et vous regardent. L\'un d\'eux a bougé. C\'est vous qui l\'avez déplacé. Probablement vous.'); }, next: 'room' },
      { label: 'Prendre une douche. Remettre les mêmes vêtements.', whyNot: 'Vous ne tiendriez pas en place dessous.', nerveMax: 95, time: 20, once: 'shower', do: (G) => { G.nerves(-6); G.dread(-3); G.note('De l\'eau chaude, au moins. L\'Islande a une excellente eau chaude ; elle sent légèrement l\'œuf et ne s\'épuise jamais. Vous restez dessous jusqu\'à vous sentir redevenir quelqu\'un, puis vous renfilez l\'avion : le pantalon, la chemise, les chaussettes, le tout légèrement plus chaud que vous.'); }, next: 'room' },
      { label: 'Allumer la télévision.', kind: 'comply', dd: 2, time: 6, do: (G) => { const d = G.D, n = G.count('tv'); G.dread(1); G.note(d >= 5 ? 'Chaîne 1 : le parking. Votre parking, vu d\'en haut, en gris. Le car dedans. Une silhouette à côté du car. Vous éteignez. L\'écran vous montre la chambre, vue d\'en haut, en gris.' : d >= 4 ? 'La météo, en islandais, à perpétuité. Puis une chaîne qui n\'est qu\'une caméra fixe braquée sur un parking. Vous êtes à peu près sûr que ce n\'est pas ce parking-ci. Il y a un car dedans.' : n === 1 ? 'La météo, en islandais. Une carte de l\'île couverte de petites flèches furieuses. Puis une image fixe de l\'hôtel avec un numéro de téléphone. Puis la météo.' : 'Vous avez déjà vu cette météo. Elle n\'a pas changé. Les flèches sont toujours furieuses. L\'hôtel est toujours à l\'écran avec son numéro, comme si vous pouviez avoir envie de l\'appeler de l\'intérieur.'); }, next: 'room' },
      { label: 'Regarder par la fenêtre, vers le parking.', whyNot: 'Vous savez ce qu\'il y a dehors.', dd: 2, dreadMax: 85, time: 3, do: (G) => { const d = G.D, n = G.count('win'); G.dread(2); if (d >= 4) G.flag('looked1'); G.nerves(d >= 4 ? 7 : 2); G.note(d >= 5 ? 'Le car est juste en dessous, maintenant. Éclairage intérieur allumé. Tout le monde à l\'intérieur tourné vers l\'hôtel, droit, immobile. Et près de la porte, les mains croisées, un homme en bleu marine, qui regarde en l\'air. Pas l\'hôtel. Votre fenêtre. Vous lâchez le rideau. Vous ne vous souvenez pas de l\'avoir écarté.' : d >= 4 ? 'Un car est garé tout au bout du parking, moteur en marche, toutes les lumières intérieures allumées. Il est plein. Personne, à l\'intérieur, ne bouge. Vous ne voyez personne près de la porte, et puis si.' : n === 1 ? 'Un parking. Un seul lampadaire. Du gravier, du vent, et au-delà du lampadaire, le noir qui continue très loin. Pas de car. Vous êtes soulagé, puis vous vous demandez pourquoi vous en attendiez un.' : 'Le parking. Le lampadaire. Deux phares sur la route, qui ralentissent, qui ne tournent pas pour entrer. Votre propre visage par-dessus tout ça, pâle, dans la chemise d\'hier.'); }, next: 'room' },
      { label: 'Faire du thé avec les petits sachets.', whyNot: 'Vos mains le renverseraient.', nerveMax: 90, time: 8, once: 'tea', do: (G) => { G.nerves(-5); G.dread(-2); G.note('La bouilloire met longtemps et fait un bruit de petit avion. Du thé, avec du lait UHT d\'un dé à coudre. Vous tenez la tasse à deux mains. C\'est la première chose chaude de la nuit qui ne vous demande rien.'); }, next: 'room' },
      { label: 'Vérifier la porte.', nd: 2, time: 2, do: (G) => { const n = G.count('door'); G.note(n === 1 ? 'Fermée à clé. Chaîne mise. Vous vérifiez la chaîne. Vous vérifiez le verrou. Bon.' : n === 2 ? 'Toujours fermée. Toujours la chaîne. Vous le saviez.' : n === 3 ? 'Vous vérifiez encore la porte. Vous avez conscience de vérifier encore la porte. Elle est fermée. Elle a toujours été fermée. Vous restez la main dessus un moment.' : 'Fermée. Vous ne savez plus ce que vous vérifiez. Si elle est fermée, ou si c\'est encore une porte.'); if (n >= 3) G.dread(1); }, next: 'room' },
      { label: 'Écouter à la porte.', whyNot: 'Vous ne voulez pas savoir.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(3); G.note(G.pick(d >= 4 ? ['Des pas. Lents, réguliers, qui s\'arrêtent à chaque porte. Qui s\'arrêtent à la vôtre. Qui repartent.', 'Un chariot, à roulettes, tout au bout. Il s\'arrête. Il ne repart pas.', 'On frappe, loin dans le couloir. Patiemment. Puis plus près.'] : ['Rien. Le bourdonnement du couloir. Une porte, au loin, qui se ferme.', 'Quelqu\'un passe, vite, en chaussettes. Quelqu\'un d\'autre, lentement, en chaussures.', 'La machine à glaçons, qui broie, au bout du couloir. Puis un rire, une porte plus loin, coupé net.'])); }, next: 'room' },
      { label: 'Appeler la réception depuis le téléphone de la chambre.', kind: 'comply', dd: 1, time: 5, once: 'roomphone', do: (G) => { G.dread(2); G.note('Ça sonne longtemps. Puis la réceptionniste, qui a l\'air d\'avoir dormi ou de n\'avoir jamais dormi : ' + V(LX('“Yes, 214?”')) + ' Vous n\'aviez pas dit votre numéro de chambre. Vous vous renseignez sur le bus. ' + V(LX('“Eleven. It says eleven. Maybe you should sleep.”'))); }, next: 'room' },
      { label: 'Vérifier vos droits.', if: (G) => G.dead(), dd: 2, time: 1, do: (G) => { G.note('Vous prenez le téléphone pour vérifier, et c\'est une dalle noire avec votre visage dedans, et vous le reposez.'); }, next: 'room' },
      { label: 'En faire un post.', if: (G) => G.dead(), dd: 2, time: 1, do: (G) => { G.note('Vous avez tout le texte composé dans votre tête, et rien où le taper.'); }, next: 'room' },
      { label: 'Vérifier vos droits.', whyNot: 'Les droits, c\'est un pays étranger, là.', dd: -6, dreadMax: 85, if: (G) => !G.dead(), sub: G.did('post') ? 'Il y a un règlement. Quelqu\'un dans vos mentions en est sûr.' : 'Il y a un règlement. Vous êtes presque sûr qu\'il y a un règlement.', time: 15, once: 'rights', do: (G) => { G.flag('uk261'); G.nerves(-6); G.batt(-2); G.msg('email', { from: 'Moi', self: true, subj: 'UK261 (QR)', key: 'uk261', body: '<b>UK261 – CE QU\'ILS VOUS DOIVENT</b>\n\nLe règlement (CE) n° 261/2004, conservé dans le droit britannique sous le nom d\'UK261. Une capture d\'écran du résumé, puis les articles qui comptent ce soir.\n\n<b>Article 9 – droit à une prise en charge.</b> Pendant que vous attendez, la compagnie aérienne doit vous offrir gratuitement : des repas et des rafraîchissements en suffisance compte tenu du délai d\'attente ; un hébergement à l\'hôtel lorsqu\'un séjour d\'une ou plusieurs nuits s\'avère nécessaire ; le transport entre l\'aéroport et le lieu d\'hébergement ; et deux appels téléphoniques ou courriels.\n\n<b>Article 4 – refus d\'embarquement.</b> Si une compagnie refuse l\'embarquement à des passagers contre leur volonté, elle doit les indemniser immédiatement et leur proposer un réacheminement ou un remboursement.\n\n<b>Article 7 – indemnisation.</b> £520 par passager pour un vol de plus de 3 500 km.\n\n<b>Article 14.</b> Un avis affiché à l\'enregistrement doit vous en informer, et si vous le demandez, on doit vous en remettre le texte.\n\nIls contesteront. Réclamez quand même.\n\n[ QR CODE ]\n\n(envoyé à vous-même, pour pouvoir le retrouver)' }); G.note('Règlement 261. Article 9 : <em>des repas et des rafraîchissements en suffisance compte tenu du délai d\'attente ; un hébergement à l\'hôtel lorsqu\'un séjour s\'avère nécessaire ; le transport entre l\'aéroport et le lieu d\'hébergement ; deux appels téléphoniques.</em> Vous le lisez deux fois. Vous lisez l\'article 4, sur le refus d\'embarquement, une fois, et le mettez de côté pour plus tard. Vous faites de la page un QR code, sur le wifi de l\'hôtel, au milieu de la nuit, et vous vous l\'envoyez par mail, ce que vous faites avec les choses que vous aurez besoin de retrouver plus tard, et vous ne savez pas pourquoi, sinon que vous allez le montrer à tous ceux que vous croiserez au petit-déjeuner.'); }, next: 'room' },
      { label: 'En faire un post.', time: 8, once: 'post', if: (G) => !G.dead(), do: (G) => { G.batt(-3); if (G.D >= 4) { G.nerves(4); G.note('Vous tapez tout – l\'équipage, la porte, le mail, le bus – et vous appuyez sur publier, et la petite roue tourne, et tourne. Une barre. Zéro barre. Le message reste là, non envoyé, adressé à personne.'); } else { G.nerves(-3); G.note('Vous le postez. Lol, écrivez-vous. Mdr. En dix minutes : 1,4K likes, et quarante personnes qui vous parlent des sources chaudes. Vous posez le téléphone écran contre la couette.'); } }, next: 'room' },
      { label: 'Charger le téléphone.', nd: 2, dd: 2, time: 2, once: 'charge', if: (G) => !G.dead(), do: (G) => { G.nerves(3); G.note(`Le chargeur est dans le sac. Le sac est dans le système. Le téléphone est à ${G.battery()} %, et il le sait, et il baisse l'écran pour vous le dire.`); }, next: 'room' },
      { label: 'Charger le téléphone.', dd: 2, time: 2, if: (G) => G.dead() && G.did('charge'), do: (G) => { G.note('Vous regardez la prise près du lit, puis le téléphone, puis la prise. Le chargeur est toujours dans le sac. Le sac est toujours dans le système.'); }, next: 'room' },
      { label: 'Essayer de dormir.', whyNot: 'Vous ne tenez pas allongé.', nerveMax: 80, time: 25, do: (G) => { if (G.t + 25 >= T(1, 4, 5)) { G.S.t = Math.max(G.t, KNOCK_AT - 25); G.nerves(-2); G.note('Vous vous allongez dans vos vêtements d\'avion, lumière allumée. Le plafond est très proche. Vous êtes presque, presque –'); } else { G.nerves(-4); G.dread(1); G.note(G.pick(['Vous vous allongez. Votre corps est à l\'heure du Pacifique, ou à aucune heure. Le plafond a une tache en forme d\'île. Vous la regardez un moment. Rien.', 'Yeux fermés. Le moteur du car – d\'un car – quelque part sous la fenêtre, ou dans vos oreilles. Vous vous redressez.', 'Vous vous glissez sous la couette tout habillé. On dirait un colis. Le sommeil vous regarde depuis l\'autre bout de la chambre et ne s\'approche pas.'])); } }, next: 'room' },
      { label: 'Sortir dans le couloir.', time: 2, next: 'corridor' },
    ],
  };

  /* ---- the corridor (hub) ---- */
  scenes.corridor = {
    art: 'corridor',
    loc: 'Hótel Hraun · Couloir du deuxième étage',
    enter: (G) => {
      G.flag('loc_corridor');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('corridor_knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.dead() && !G.has('phone_scene')) { G.flag('died_corridor'); G.go('phone_dies'); return; }
      if (G.once('corr_intro')) G.note(p(G.last(), 'Long, bas, moquetté de quelque chose couleur d\'hématome. Des portes : 210, 212, 214 – la vôtre – 216, 218, et ainsi de suite jusqu\'à une porte coupe-feu munie d\'une barre et d\'un hublot de verre armé. Une machine à glaçons ronronne tout au bout. Un ascenseur, avec une feuille collée dessus.'));
    },
    text: (G) => hub(G, `Le couloir. ${G.clock(G.t)}. Toutes les portes sont fermées. La vôtre est celle où la lumière est allumée.`, 'corridor'),
    choices: (G) => [
      { label: 'La machine à glaçons.', nd: 2, dd: 1, time: 5, do: (G) => { const n = G.count('ice'); G.note(n === 1 ? 'Elle rugit. De la glace, beaucoup de glace, dans un seau que vous n\'avez pas apporté. Vous restez là, une poignée à la main. Vous ne vouliez pas de glace. Vous ne savez pas ce que vous vouliez.' : n === 2 ? 'Elle rugit encore, pour vous, comme si elle attendait. La glace d\'avant n\'a pas fondu. Vous n\'êtes pas certain que la glace soit censée se comporter ainsi dans un couloir chauffé.' : 'Vous ne mettez pas la main dedans, cette fois. Vous l\'écoutez broyer. Sous le broiement, quelque part en dessous, un moteur.'); if (n >= 2) G.dread(1); }, next: 'corridor' },
      { label: G.did('talk_fleece') ? 'Frapper à la 216. La chambre de l\'homme en polaire.' : 'Frapper à la 216. La porte d\'à côté.', time: 5, do: (G) => { const n = G.count('k216'); if (n === 1) { G.collect(1); G.nerves(-4); G.flag('met_fleece'); G.note((G.did('talk_fleece') ? 'Un silence, puis la chaîne, puis la polaire.' : 'Un silence, puis la chaîne, puis un homme en polaire que vous reconnaissez vaguement du hall.') + ' Il est réveillé lui aussi. Lui aussi est habillé. ' + V('« Mec »,') + ' dit-il, et ça dit tout. Vous tombez d\'accord sur le bus. Onze heures. La feuille imprimée. Il dit qu\'il viendra frapper chez vous.'); } else if (n === 2) { G.nerves(3); G.dread(3); G.note('Pas de réponse. La lumière sous la porte est allumée. Vous frappez encore, à coups réguliers, vous vous entendez faire, et vous arrêtez.'); } else { G.nerves(8); G.dread(5); G.note('La porte n\'est pas verrouillée. Elle s\'ouvre. La chambre est faite : lit au carré, serviettes pliées en éventail, les mini-shampoings en rang. Personne n\'y est entré. Personne n\'y est jamais entré. Sa polaire est sur la chaise.'); } }, next: 'corridor' },
      { label: 'L\'ascenseur.', kind: 'comply', dd: 2, time: 4, do: (G) => { const d = G.D; if (d >= 4) { G.flag('lift_open'); G.dread(3); G.nerves(5); G.note('La feuille dit HORS SERVICE, en Arial. Pendant que vous la lisez, l\'ascenseur arrive. Les portes s\'ouvrent sur une cabine vide, bien éclairée, avec un miroir au fond, et restent ouvertes, et attendent. Personne ne l\'a appelé.'); } else { G.note('HORS SERVICE, en Arial, scotché de travers. Vous appuyez quand même. Quelque part dans le bâtiment, quelque chose descend.'); } }, next: 'corridor' },
      { label: 'Entrer dans l\'ascenseur.', kind: 'comply', if: (G) => G.has('lift_open'), do: (G) => G.end('lift') },
      { label: 'Lire le plan d\'évacuation affiché au mur.', dd: -2, time: 3, once: 'fireplan', do: (G) => { G.msg('paper', { from: 'Vissé au mur du couloir', subj: 'Plan d\'évacuation', body: '<b>EVACUATION PLAN · 2ND FLOOR</b>\n\nIn case of alarm, proceed by stairs to\n<b>ASSEMBLY POINT: CAR PARK</b>\n\nDo not use the lift.\nDo not return for belongings.\n\nYOU ARE HERE ●' }); G.note('VOUS ÊTES ICI. Un point rouge, à la 214. Quelqu\'un a tracé au bic une petite flèche, du point vers le parking, et écrit, d\'une autre main : <em>bus</em>.'); }, next: 'corridor' },
      { label: 'La porte coupe-feu et l\'escalier. Descendre au parking.', whyNot: 'Pas l\'escalier. Pas dans le noir.', dreadMax: 92, time: 4, next: 'carpark' },
      { label: 'Descendre au hall.', time: 3, next: 'lobby' },
      { label: 'Retourner dans votre chambre.', time: 2, next: 'room' },
    ],
  };

  /* ---- the lobby at night (hub) ---- */
  scenes.lobby = {
    art: 'lobby',
    loc: 'Hótel Hraun · Hall',
    enter: (G) => {
      G.flag('loc_lobby');
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('lobby_intro')) G.note(p(G.last(), 'Le hall, la nuit, est un aquarium dont on a laissé la lumière allumée. Deux passagers de votre vol dorment assis sur un canapé. La réceptionniste de nuit est au comptoir avec ses mots croisés. Le panneau imprimé, en Arial, dit 11h00. Un distributeur ronronne contre le mur comme un petit dieu réfrigéré.'));
    },
    text: (G) => hub(G, `Le hall. ${G.clock(G.t)}. Le panneau dit toujours 11h00. ${G.t >= KNOCK_AT ? 'Il est quatre heures et demie passées.' : 'Onze heures, c\'est loin.'}`, 'lobby'),
    choices: (G) => [
      { label: 'Demander à la réceptionniste si elle parle français.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 4, do: (G) => { G.flag('fr_asked'); G.nerves(-2); G.note(LX('“A little. Eleven. The sign. Please.”') + ' Elle l\'a dit lentement, et a quand même désigné le panneau, au cas où les mots ne tiendraient pas.'); }, next: 'lobby' },
      { label: 'Demander du dentifrice à la réception.', time: 6, once: 'desk_tp', do: (G) => { G.nerves(2); G.note('Elle cherche sous le comptoir, sincèrement, longtemps. ' + V(LX('“No. Sorry. The 10-11 will have some. Twenty minutes, walking.”')) + ' Elle vous regarde, puis les portes, puis vous. ' + V(LX('“Maybe not tonight.”'))); }, next: 'lobby' },
      { label: 'Demander si le panneau dit vrai.', kind: 'comply', dd: 1, time: 5, do: (G) => { const n = G.count('sign'); G.note(n === 1 ? 'Elle désigne le panneau. ' + V(LX('“Eleven.”')) + ' Vous demandez qui le lui a dit. ' + V(LX('“A passenger phoned them. They said yes.”')) + ' Un silence. ' + V(LX('“Or they said something.”')) : n === 2 ? V(LX('“Eleven,”')) + ' dit-elle, sans lever les yeux, avant que vous ayez fini la question.' : 'Elle vous regarde un instant avec une expression que vous n\'arrivez pas à déchiffrer, puis dit : ' + V(LX('“You are in 214,”')) + ' et retourne à ses mots croisés. Vous n\'aviez rien demandé.'); if (n >= 3) G.dread(3); }, next: 'lobby' },
      { label: 'Demander si un car est passé.', kind: 'comply', dd: 3, time: 5, do: (G) => { const d = G.D; G.dread(1); G.note(d >= 4 ? V(LX('“One is outside,”')) + ' dit-elle. ' + V(LX('“It is not yours.”')) + ' Vous demandez comment elle le sait. Elle tourne la grille vers vous pour que vous la voyiez. Elle est vierge.' : G.t >= KNOCK_AT ? V(LX('“Somebody came asking for you. In a uniform. I said you were asleep.”')) + ' Vous ne dormiez pas. ' + V(LX('“I know.”')) : V(LX('“No coach. Eleven. Please, go up and sleep.”'))); }, next: 'lobby' },
      { label: 'Le distributeur.', nd: -2, time: 5, do: (G) => { const n = G.count('vend'); if (n === 1) { G.flag('crisps'); G.nerves(-3); G.note('Des chips au paprika. Deux mignonnettes d\'un vin rouge dont l\'étiquette représente une montagne. La machine prend votre carte au troisième essai et émet un son de profonde réticence. Vous tenez votre dîner à deux mains.'); } else { G.note(n === 2 ? 'Presque tout est épuisé. Il reste un seul article, tout en bas : un pot de skyr dont vous auriez préféré ne pas lire la date.' : 'La lumière de la machine vacille. Tous les rayons sont vides maintenant, sauf le skyr, qui est monté d\'un rayon.'); if (n >= 3) G.dread(1); } }, next: 'lobby' },
      { label: 'La machine à café.', time: 5, once: 'coffee_l', do: (G) => { G.nerves(G.has('coffee') ? 2 : -2); G.note('Du café, en quelque sorte. Il a le goût d\'un café qu\'on aurait décrit à la machine par téléphone. Vous le buvez debout, en regardant les portes.'); }, next: 'lobby' },
      { label: 'Réveiller les passagers du canapé. Échanger vos informations.', whyNot: 'Vous les réveilleriez en criant.', nd: -4, dd: -4, nerveMax: 85, time: 8, once: 'sofa', do: (G) => { G.collect(1); G.nerves(-2); G.note((G.did('talk_couple') ? 'C\'est le couple de la vitre, dans le hall.' : 'Un couple âgé de votre vol.') + ' Ils ne dorment pas. ' + V('« On a eu un mail qui disait neuf heures »,') + ' dit-elle. ' + V('« Et un qui disait huit. Et le truc du chat dit encore autre chose. »') + ' Vous regardez tous le panneau. ' + V('« Onze heures, »') + ' dit-il. ' + V('« La feuille. »')); }, next: 'lobby' },
      { label: 'Regarder le parking à travers la vitre.', whyNot: 'Vous ne voulez pas voir.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(d >= 4 ? 5 : 0); G.note(d >= 5 ? 'Le car est juste devant les portes maintenant. Moteur en marche. Éclairage intérieur allumé. Les portes s\'ouvrent pour lui, et restent ouvertes, et le froid entre. Personne ne descend.' : d >= 4 ? 'Tout au bout du parking, des phares, un moteur au ralenti. Une forme derrière, qui a la forme d\'un car. La réceptionniste ne lève pas les yeux. Elle ne les a pas levés depuis un moment.' : 'Du gravier, un lampadaire, la route. Une voiture passe sans ralentir. Vous guettez quelque chose. Vous aimeriez pouvoir vous arrêter.'); if (d >= 4) G.flag('looked1'); }, next: 'lobby' },
      { label: 'Sortir.', whyNot: 'Pas par ces portes-là.', dd: -2, dreadMax: 88, time: 3, next: 'carpark' },
      { label: 'Remonter au couloir.', time: 3, next: 'corridor' },
    ],
  };

  /* ---- the car park at night (hub) ---- */
  scenes.carpark = {
    art: 'carpark_night',
    loc: 'Hótel Hraun · Parking',
    enter: (G) => {
      G.flag('loc_carpark'); G.dread(2);
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('cp_intro')) G.note(p(G.last(), 'Froid. Un vrai froid : de ceux qui passent à travers les vêtements et s\'y installent. Du gravier, un lampadaire, une route qui part dans deux directions. L\'hôtel derrière vous, éclairé. Vous êtes sorti pour une raison que vous aviez encore il y a un instant.'));
    },
    text: (G) => hub(G, `Le parking. ${G.clock(G.t)}. Le vent est venu de loin pour vous accueillir.` + (G.has('coach_seen_cp') ? ' Le car est toujours tout au bout.' : G.D >= 3 ? ' Tout au bout, passé le lampadaire, quelque chose est garé. Ou debout.' : ''), 'carpark'),
    choices: (G) => [
      { label: G.has('coach_seen_cp') ? 'Retourner jusqu\'au bout. Vers le car.' : G.D >= 3 ? 'Marcher jusqu\'au bout. Vers la forme.' : 'Marcher jusqu\'au bout du parking.', whyNot: 'Vos pieds refusent.', nd: 5, dreadMax: 92, time: 6, do: (G) => { const d = G.D; G.dread(G.counted('cpwalk') ? 1 : 3); G.count('cpwalk'); if (d >= 4) { G.flag('coach_seen_cp'); G.nerves(G.counted('cpwalk') > 1 ? 3 : 6); G.note('Un car. Bleu marine. Écusson doré. Moteur en marche, toutes les lumières allumées à l\'intérieur, et derrière chaque vitre quelqu\'un, assis droit, tourné vers l\'hôtel. Près de la porte, un homme en bleu marine, les mains croisées. Il ne vous regarde pas. ' + V('« Pas encore, »') + ' dit-il, à personne, ou à vous.'); } else { G.nerves(3); G.note('Rien. Une plaque de gravier plus sombre que le reste, à la forme de quelque chose qui était garé là il y a peu. Le vent. Vous restez un moment dans la forme.'); } }, next: 'carpark' },
      { label: 'Monter dans le car.', kind: 'comply', if: (G) => G.has('coach_seen_cp'), do: (G) => { G.flag('nc_carpark'); G.flag('via_knock'); G.end('crew'); } },
      { label: 'Lever les yeux vers votre fenêtre.', time: 3, do: (G) => { G.dread(2); G.nerves(2); G.note(G.D >= 4 ? 'Deuxième étage, quatrième fenêtre. La lumière est allumée. Vous l\'avez laissée allumée. Le rideau est ouvert. Vous ne l\'avez pas laissé ouvert.' : 'Deuxième étage, quatrième fenêtre. La lumière est allumée. On dirait une chambre où il y a quelqu\'un.'); }, next: 'carpark' },
      { label: G.did('desk_tp') ? 'Marcher vingt minutes jusqu\'au 10-11 pour du dentifrice.' : 'Partir le long de la route. Le panneau au carrefour dit 10-11, 2 km.', whyNot: 'Pas seul. Pas là-dehors.', dreadMax: 70, sub: 'Du dentifrice. Des chaussettes, peut-être. Changer d\'air.', time: 20, once: 'walk', next: 'walk' },
      { label: 'Rentrer.', kind: 'comply', dd: 1, time: 3, next: 'lobby' },
    ],
  };

  scenes.walk = {
    art: 'road',
    loc: 'La route · vers le 10-11',
    text: p(
      'Du vent. De la lave. Une route sans trottoir et une ligne blanche qui n\'arrête pas de disparaître. Après huit minutes, vous ne voyez plus l\'hôtel derrière vous ; après dix, vous ne voyez toujours pas le 10-11 devant.',
      'Puis des phares, lents, venant de derrière. Un car. Il arrive à votre hauteur et s\'arrête, et la porte se replie avec un bruit feutré, un bruit de luxe. Une lumière chaude. Des rangées de sièges, et des gens dedans, assis, parfaitement immobiles.',
      V('« Passager Albion ? »') + ' dit une voix que vous avez entendue dans un combiné à 37 000 pieds. ' + V('« Nous faisons notre meilleur. Sautez dedans. »'),
    ),
    choices: [
      { label: 'Monter. Il y fait chaud.', kind: 'comply', do: (G) => { G.flag('via_walk'); G.end('crew'); } },
      { label: 'Continuer à marcher. Ne pas regarder la porte.', whyNot: 'Vous ne pouvez pas lui tourner le dos.', dreadMax: 75, dd: -14, time: 30, do: (G) => { G.nerves(12); G.flag('toothpaste'); G.nerves(-10); G.dread(8); G.note('Le car est resté au ralenti à côté de vous un long moment, et puis plus. Le 10-11 était éclairé comme un autel. Du dentifrice. Une brosse à dents. Des chaussettes, par trois, les plus belles chaussettes que vous ayez jamais vues. Vous êtes rentré le sac serré contre la poitrine. Rien ne vous a croisé sur la route. Rien du tout, ce qui, allez savoir pourquoi, était pire.'); }, next: 'carpark' },
      { label: 'Faire demi-tour. Retourner à l\'hôtel. Vite.', kind: 'comply', dd: 6, time: 15, do: (G) => { G.nerves(8); G.dread(5); G.note('Vous n\'avez pas couru. Vous avez marché, vite, le car derrière vous, au ralenti, à votre rythme, et puis plus. Les portes du hall se sont ouvertes avant que vous les atteigniez.'); }, next: 'carpark' },
    ],
  };

  /* ---- the phone dies ---- */
  scenes.phone_dies = {
    art: 'phone',
    loc: (G) => `Hótel Hraun · ${G.has('died_corridor') ? 'Couloir' : 'Chambre 214'} · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('phone_scene'); G.dread(4); if (!G.has('died_corridor')) G.flag(/sleep/i.test(G.S.lastChoice || '') ? 'died_bed' : 'died_room'); },
    text: (G) => p(
      G.last(),
      G.has('died_corridor') ? 'Le téléphone, dans votre main, dans le couloir, affiche 1 %. Il affiche 1 % depuis un moment, comme dure une respiration retenue. Vous le regardez quand ça arrive : l\'écran s\'assombrit jusqu\'à la couleur de la moquette, puis jusqu\'à la couleur de rien, et dans le verre noir il y a votre visage, éclairé par le panneau de sortie, qui vous regarde.'
        : G.has('died_bed') ? 'Le téléphone, écran vers le haut sur la couette, affiche 1 %. Il affiche 1 % depuis un moment, comme dure une respiration retenue. Vous le regardez quand ça arrive : l\'écran s\'assombrit jusqu\'à la couleur de la chambre, puis jusqu\'à la couleur de rien, et dans le verre noir il y a votre visage, éclairé par rien, qui vous regarde.'
        : 'Vous reprenez le téléphone, et il affiche 1 %. Il affiche 1 % depuis un moment, comme dure une respiration retenue. Vous le regardez quand ça arrive : l\'écran s\'assombrit jusqu\'à la couleur de la chambre, puis jusqu\'à la couleur de rien, et dans le verre noir il y a votre visage, éclairé par rien, qui vous regarde.',
      'Le chargeur est dans le sac. Le sac est dans le système. L\'horloge au mur est la seule qu\'il vous reste, et c\'est une horloge d\'hôtel, et vous ne lui faites pas confiance.',
      G.has('died_corridor') ? 'Quoi qu\'ils envoient ensuite, vous ne l\'entendrez pas arriver. Quoi qu\'ils aient arrangé, ils l\'ont arrangé avec un téléphone qui est mort. Vous restez debout là, dans vos vêtements d\'avion, la dalle noire dans la main, et au bout du couloir la machine à glaçons y réfléchit.'
        : G.has('died_bed') ? 'Quoi qu\'ils envoient ensuite, vous ne l\'entendrez pas arriver. Quoi qu\'ils aient arrangé, ils l\'ont arrangé avec un téléphone qui est mort. Vous restez allongé là, dans vos vêtements d\'avion, la dalle noire dans la main, et le chauffage songe à frapper.'
        : 'Quoi qu\'ils envoient ensuite, vous ne l\'entendrez pas arriver. Quoi qu\'ils aient arrangé, ils l\'ont arrangé avec un téléphone qui est mort. Vous restez debout là, dans vos vêtements d\'avion, la dalle noire dans la main, et le chauffage songe à frapper.',
    ),
    // you go back to what you were doing; past a certain dread, the bed is the only instruction left
    choices: (G) => G.has('died_corridor') ? [
      { label: 'Le mettre dans la poche. Rester là, dans le couloir.', whyNot: 'Le couloir n\'est pas un endroit où rester avec un téléphone mort. Vos pieds ont décidé.', dreadMax: 80, dd: 4, time: 2, do: (G) => { G.note('Vous le mettez dans votre poche, où il est plus lourd qu\'avant, et restez où vous êtes, dans le couloir, avec pour seule compagnie le panneau de sortie et la machine à glaçons.'); }, next: 'corridor' },
      { label: 'Le mettre dans la poche. Retourner à la chambre. S\'allonger. Espérer se réveiller.', kind: 'comply', dd: 8, time: 20, do: (G) => { G.nerves(-2); G.note('Vous le mettez dans votre poche, ce qui ne sert à rien, et vous retournez à la 214, et vous vous allongez dans vos vêtements d\'avion, et vous écoutez le bâtiment. Dormir n\'est pas le mot pour ce qui vient.'); }, next: 'room' },
    ] : G.has('died_bed') ? [
      { label: 'Le retourner face contre la couette. Se lever. Allumer la lumière.', whyNot: 'Vous ne pouvez pas vous lever. Le lit vous tient, et le noir tient le lit.', dreadMax: 80, dd: 4, time: 2, do: (G) => { G.note('Vous le retournez face contre la couette, vous vous levez et vous allumez le plafonnier, ce qui rend la chambre pire et plus petite, et vous restez debout au milieu, en chaussettes.'); }, next: 'room' },
      { label: 'Le retourner face contre la couette. Se rendormir. Espérer se réveiller.', kind: 'comply', dd: 8, time: 20, do: (G) => { G.nerves(-2); G.note('Vous le retournez, ce qui ne sert à rien, et vous vous rallongez, ce qui ne sert à rien, et vous écoutez le bâtiment. Dormir n\'est pas le mot pour ce qui vient.'); }, next: 'room' },
    ] : [
      { label: 'Le retourner. Continuer.', whyNot: 'Vous ne pouvez rien continuer du tout. Le lit est la seule consigne qui reste.', dreadMax: 80, dd: 4, time: 2, do: (G) => { G.note('Vous le posez face contre l\'étagère, près de la bouilloire, et reprenez ce que vous étiez en train de faire, dont vous n\'arrivez plus à vous souvenir.'); }, next: 'room' },
      { label: 'Le retourner face contre la couette. S\'allonger. Espérer se réveiller.', kind: 'comply', dd: 8, time: 20, do: (G) => { G.nerves(-2); G.note('Vous le posez face contre le lit, ce qui ne sert à rien, et vous vous allongez dans vos vêtements d\'avion, ce qui ne sert à rien, et vous écoutez le bâtiment. Dormir n\'est pas le mot pour ce qui vient.'); }, next: 'room' },
    ],
  };

  /* ---- the knock, three ways ---- */
  scenes.knock = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); },
    text: (G) => p(
      G.last(),
      'Quelqu\'un frappe. Pas en tambourinant – en frappant, à coups réguliers, comme frappe quelqu\'un qui frappera toute la nuit.',
      V('« Car pour passagers Albion Atlantic. Départ maintenant. Dernier appel. »'),
      'La voix est patiente. La voix est très, très patiente.',
    ),
    choices: [
      { label: 'Ouvrir la porte.', kind: 'comply', sub: 'C\'est peut-être le bus.', do: (G) => { G.flag('via_knock'); G.end('crew'); } },
      { label: 'Regarder par le judas.', dd: 6, nd: 6, time: 2, do: (G) => { G.nerves(9); G.flag('spyhole'); G.note('Le couloir est vide. La moquette devant votre porte est mouillée. Les coups continuent, réguliers, venus de nulle part en particulier.'); }, next: 'knock2' },
      { label: 'Le panneau disait 11h00. Ne pas ouvrir. Ne pas répondre.', whyNot: 'Vous ne pouvez pas ne pas répondre. Ils ont dit qu\'ils frapperaient.', nd: 5, dreadMax: 80, instr: 'knock_notice', time: 20, do: (G) => { G.nerves(5); G.note('Vous êtes resté assis sur le lit, dos à la tête de lit, les yeux sur la porte, à compter les coups. Vous avez perdu le compte à soixante. Puis ils se sont arrêtés, et c\'était pire, pendant un moment.'); }, next: 'window' },
    ],
  };

  scenes.knock2 = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: (G) => p(G.last(), 'Régulier. Patient. Personne.'),
    choices: [
      { label: 'Ouvrir la porte quand même.', kind: 'comply', do: (G) => { G.flag('via_knock'); G.end('crew'); } },
      { label: 'S\'éloigner de la porte. S\'asseoir sur le lit. Attendre que ça passe.', whyNot: 'Votre main est déjà sur la chaîne.', dreadMax: 88, time: 25, do: (G) => { G.nerves(3); G.note('Ça s\'est arrêté, à la fin, comme la pluie s\'arrête : vous n\'avez pas remarqué le dernier.'); }, next: 'window' },
    ],
  };

  scenes.corridor_knock = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Second floor corridor · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); G.nerves(8); },
    text: (G) => p(
      G.last(),
      'Vous êtes dans le couloir quand ça commence. Tout au bout, près de l\'ascenseur, quelqu\'un en bleu marine frappe à une porte. Régulièrement. Patiemment. Puis la porte suivante. Puis la suivante.',
      'Il avance vers la 214. Il avance vers vous. Il n\'a pas levé les yeux. ' + V('« Car pour passagers Albion Atlantic. Départ maintenant. Dernier appel. »'),
    ),
    choices: [
      { label: 'Passer devant lui. Rentrer dans votre chambre. Verrouiller.', whyNot: 'Vous ne pouvez pas marcher vers lui.', dreadMax: 80, time: 5, do: (G) => { G.nerves(10); G.dread(8); G.flag('seen'); G.note('Il n\'a pas cessé de frapper quand vous êtes passé. Il ne s\'est pas retourné. Mais au clic de votre carte, il a dit, aimablement, à la porte devant lui : ' + V('« Deux quatorze, »') + ' et vous avez mis la chaîne avec des mains qui ne vous semblaient pas les vôtres.'); }, next: 'window' },
      { label: 'Descendre l\'escalier. Sans bruit. Attendre dans le hall.', whyNot: 'Vous ne pouvez pas bouger.', dd: 5, dreadMax: 92, time: 15, do: (G) => { G.nerves(6); G.dread(5); G.flag('hid_lobby'); G.note('La réceptionniste n\'a pas levé les yeux quand vous êtes descendu. ' + V(LX('“He is looking for you,”')) + ' a-t-elle dit, aux mots croisés. Vous vous êtes assis sur le canapé avec les deux passagers qui s\'y trouvaient déjà et personne n\'a rien dit pendant longtemps, puis les portes du hall se sont ouvertes pour personne, et refermées.'); }, next: 'window' },
      { label: 'Lui répondre. Vous êtes un passager Albion Atlantic.', kind: 'comply', do: (G) => { G.flag('nc_corridor'); G.flag('via_knock'); G.end('crew'); } },
    ],
  };

  scenes.window = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.S.t = Math.max(G.t, T(1, 4, 50)); if (!G.dead()) G.bot('Salut ! Je vois vous êtes dans chambre 214. Le car attend pour vous dans le parking. S\'il vous plaît ne pas regarder hors de la fenêtre. 🙂', 0, 'nolook'); },
    text: (G) => p(
      G.last(),
      (G.has('hid_lobby') ? 'Vous êtes remonté, finalement, parce qu\'il n\'y avait nulle part ailleurs où être. Le couloir était vide. Les coups ont cessé. ' : 'De retour dans la chambre, ou toujours dedans. Les coups ont cessé. ') + (G.dead() ? 'Le téléphone est éteint sur la couette, et c\'est presque pire : quoi qu\'ils disent, ils le disent à personne.' : 'Votre téléphone éclaire le plafond. ' + ALLY_MSG(G)),
      !G.dead() && (G.readMsg('nolook') ? W('Ne regardez pas par la fenêtre, disait-il. S\'il vous plaît.') : W('Il éclaire le plafond, s\'éteint, et l\'éclaire de nouveau.')),
      'Le rideau est fin. Il y a de la lumière qui passe à travers, et la lumière bouge légèrement, comme bouge la lumière d\'un moteur qui tourne.',
    ),
    choices: [
      { label: 'Regarder.', whyNot: 'Ils ont dit de ne pas le faire.', dd: 10, nd: 8, dreadMax: 90, instr: 'nolook', sub: 'Juste un peu.', time: 5, do: (G) => { G.flag('seen'); G.flag('looked_out'); G.nerves(14); atLeast(G, 78); }, next: 'window2' },
      { label: 'Non. Poser le téléphone écran contre le lit. Tirer la couette par-dessus votre tête.', kind: 'comply', dd: 6, time: 5, do: (G) => G.nerves(2), next: 'sleep' },
    ],
  };

  scenes.window2 = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: p(
      'Un car, bleu marine, avec un écusson doré. Moteur en marche. Toutes les lumières allumées à l\'intérieur. Il est plein, et tout le monde dedans est assis parfaitement droit, et chacun d\'eux est tourné vers l\'hôtel.',
      'À la porte du car se tient un homme en uniforme de chef de cabine. Sous vos yeux, il lève la tête – pas vers l\'hôtel. Vers votre fenêtre.',
      'Il ne fait pas signe. Il n\'en a pas besoin. Il vous a vu, et vous l\'avez vu vous voir, et c\'est désormais une chose qui existe.',
    ),
    choices: [{ label: 'Lâcher le rideau.', time: 5, next: 'sleep' }],
  };

  /* ---------------------------------------------------------------- Day 1 · 07:30 morning */
  scenes.sleep = {
    art: 'lobby',
    loc: 'Hótel Hraun · Salle du petit-déjeuner',
    enter: (G) => {
      G.S.t = T(1, 7, 30);
      G.flag('morning');
      G.S.dread = Math.max(20, G.S.dread - 25); // daylight helps, a little
      G.nerves(G.has('allnighter') ? 6 : G.has('coffee') ? -5 : -10);
      if (G.has('toothpaste')) G.nerves(-6);
      if (G.dead() || G.battery() < 20) { G.flag('borrowed_cable'); G.charge(35); }
      G.at(T(1, 7, 35), 'sms', { from: 'Jo 💛', body: 'OMG T\'ES EN ISLANDE ?? faut absolument que tu fasses le blue lagoon. ABSOLUMENT. c\'est genre 20 min de l\'aéroport' });
      G.at(T(1, 8, 5), 'chat', { body: 'Bon matin ! Votre transfert à l\'aéroport est confirmé pour 08:00. S\'il vous plaît être dans le lobby. 🚌', key: 'morning_chat' });
      G.at(T(1, 9, 40), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Votre transfert à l\'aéroport', stamp: T(1, 9, 40), key: 'morning_mail', body: 'Cher client,\n\nDes cars viendront vous chercher à votre hébergement à 09:00 pour votre vol réacheminé AB 0271.\n\nMerci de vous présenter dans le hall à 08:45.\n\nNous faisons de notre mieux.' });
      G.at(T(1, 9, 55), 'chat', { body: 'Votre car est ici. C\'est le gentil. 🚌' });
    },
    text: (G) => p(
      G.has('allnighter') ? 'Lumière grise. 07h30. Vous n\'avez pas dormi, et vous êtes toujours en Islande.' : 'Lumière grise. 07h30. Vous avez dormi, ou quelque chose comme ça, et vous êtes toujours en Islande.',
      'Le petit-déjeuner, c\'est du skyr, du pain, et un café qui est chaud, et marron, et s\'en tient là. La salle est pleine de votre vol. Tout le monde porte ce qu\'il portait hier. Tout le monde échange ses informations : quel hôtel, quelle heure de ramassage, lequel des trois messages contradictoires chacun a choisi de croire.',
      G.has('borrowed_cable') && 'Quelqu\'un à la table voisine a un câble qui convient. Vous branchez le téléphone sur la prise près du grille-pain et il revient lentement, comme la couleur revient à un visage, et la première chose qu\'il fait est de vous dire tout ce que vous avez manqué.',
      'Le panneau imprimé est toujours scotché au comptoir. 11h00. Quelqu\'un a dessiné un petit cœur dessus.',
    ),
    choices: [{ label: 'Prendre un deuxième café quand même.', time: 10, next: 'hotel_morning' }],
  };

  /* ---- the departure creeps: a world event, not a message. At noon the flight moves to 15:45, wherever you are,
     and the counter, which opens three hours before departure, moves with it. The email about it is only the airline catching up. */
  const REVISE = (G) => {
    if (G.has('revised') || G.t < T(1, 12, 0)) return;
    G.flag('revised'); G.S.dep = T(1, 15, 45);
    const sc = G.S.scene;
    const line = (sc === 'airport' || sc === 'checkin')
      ? 'À midi pile, le tableau fait défiler ses lignes une à une et revient à la vôtre, et l\'heure qui y figure n\'est pas celle qui y figurait. AB 0271 · LOS ANGELES · <em>15:45</em>. Personne ne l\'annonce. Un son parcourt la file, qui n\'est pas tant un grognement que deux cents personnes faisant le même calcul : le comptoir ouvre trois heures avant le départ, et le départ vient de bouger, donc le comptoir vient de bouger. ' + (G.did('talk_fleece') ? 'L\'homme en polaire dit ' + V('« Forcément »,') + ' à personne.' : 'Quelqu\'un, vers l\'avant, rit, une fois.')
      : (sc === 'springs')
      ? 'Quelque part derrière la vapeur, à midi pile, votre vol bouge. Vous ne l\'entendez pas bouger. L\'enregistrement, qui ferme une heure avant le départ, vient de fermer trente-cinq minutes plus tard que prévu, ce qui fait plus de temps dans l\'eau, ce qui est le problème.'
      : (sc === 'offloaded')
      ? 'À midi pile, le tableau derrière la vitre fait défiler ses lignes, et revient avec une autre heure dessus. 15:45. Votre vol a été retardé. Il n\'est toujours pas le vôtre.'
      : 'À midi pile, quelque part, une heure de départ change. ' + (G.dead() ? 'Votre téléphone, qui vous l\'aurait dit, est éteint.' : 'Votre téléphone vibre : la compagnie rattrape son retard. 15:45 désormais. Enregistrement trois heures avant. Ils font de leur mieux.');
    G.note(p(G.last(), line));
    G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Temps de départ révisé', body: 'Cher Client,\n\nVotre vol AB 0271 partira désormais à 15:45.\n\nL\'enregistrement ouvre trois heures avant le départ.\n\nNous faisons de notre mieux.' });
  };

  scenes.hotel_morning = {
    art: 'lobby',
    loc: 'Hótel Hraun · Hall',
    enter: (G) => { REVISE(G);
      if (G.t >= T(1, 10, 15)) { G.go('buses2'); return; }
      if (G.once('morn_intro')) G.note(p(G.last(), 'Tout a été minuté pour être aussi pénible que possible sans laisser aucun intervalle assez long pour aller faire quelque chose d\'agréable. Trois heures, et rien à en faire sinon attendre un bus qui est peut-être le bus, ou peut-être pas.'));
    },
    text: (G) => hub(G,
      `Le hall. ${G.clock(G.t)}. Le panneau dit 11h00. ${G.readMsg('morning_mail') ? 'Le mail disait 09h00 et il est arrivé à 09h40. ' : G.readMsg('morning_chat') ? 'Le chatbot disait 08h00. Il est plus de 08h00. ' : ''}Personne n'a vu de bus qui soit le vôtre.`,
      'morning'),
    choices: (G) => [
      { label: 'Montrer le QR code UK261 à tous les passagers à votre portée.', if: (G) => G.has('uk261') && G.dead(), dd: 2, time: 2, do: (G) => { G.note('Vous sortez le téléphone pour leur montrer, et c\'est une dalle noire, et vous leur parlez du règlement à la place, de mémoire, ce qui ressemble à quelque chose qu\'une personne dans votre état inventerait.'); }, next: 'hotel_morning' },
      { label: 'Montrer le QR code UK261 à tous les passagers à votre portée.', whyNot: 'Vos mains ne tiendraient pas le téléphone immobile.', dd: -8, nd: -4, nerveMax: 90, sub: 'En précisant que la compagnie contestera.', if: (G) => G.has('uk261') && !G.dead(), once: 'qr1', time: 20, do: (G) => { G.collect(2); G.nerves(-5); G.note('Vous allez de table en table, le téléphone tendu comme un mandat. Les gens le photographient. Une femme avec un bagel dit : ' + V('« Je suis prête à jouer les Karen. »') + ' Quelqu\'un applaudit, une fois.'); }, next: 'hotel_morning' },
      { label: 'Échanger vos informations avec les autres.', whyNot: 'Vous déclencheriez une dispute.', dd: -5, nd: -4, nerveMax: 85, time: 20, once: 'notes1', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_notes'); G.note('Quatre hôtels différents, dans les mails – et tous ceux qui les ont reçus sont dans celui-ci. Six horaires de ramassage. Une feuille imprimée. Un homme avec une casquette des Blazers : ' + V('« Ceux avec l\'écusson, c\'est pas les nôtres. Je sais pas à qui ils sont. Pas les nôtres. »') + ' Tout le monde hoche la tête, comme s\'ils l\'avaient toujours su. L\'homme en polaire s\'appelle Dev, il s\'avère, et il a la polaire depuis Heathrow, et il sera enterré avec.'); G.flag('fleece_name'); }, next: 'hotel_morning' },
      { label: 'Demander à la réception si 11h00 est la bonne heure.', kind: 'comply', dd: 2, time: 10, once: 'recep', do: (G) => { G.nerves(1); G.note('La même réceptionniste. Toujours. Elle désigne le panneau. ' + V(LX('“Another passenger phoned them. They said yes.”')) + ' Un silence. ' + V(LX('“Or they said something.”'))); }, next: 'hotel_morning' },
      { label: 'Remonter à la chambre. Prendre une douche. Se passer au moins de l\'eau sur le visage.', whyNot: 'Vous ne tiendriez pas en place dessous.', nerveMax: 92, time: 25, once: 'morn_shower', do: (G) => { G.nerves(-5); G.dread(-2); G.note('De l\'eau chaude. Les mêmes vêtements. La chambre, à la lumière du jour, n\'est qu\'une chambre : les shampoings, la bouilloire, la fenêtre sur un parking avec un car dedans. Vous ne regardez pas longtemps.'); }, next: 'hotel_morning' },
      { label: 'Parler à la mère de l\'enfant.', whyNot: 'Vous feriez peur à l\'enfant.', nd: -3, dd: -3, nerveMax: 80, time: 10, once: 'morn_mother', do: (G) => { G.collect(1); G.nerves(-3); G.note(V('« Elle voudrait être à la maison, maintenant »,') + ' dit la mère, à propos de la petite, qui est sous la table. ' + V('« Moi aussi. Vous avez entendu frapper, cette nuit ? »') + (G.has('knocked') ? ' Vous dites oui. Elle dit : ' + V('« Nous non plus, on n\'a pas ouvert. »') : ' Vous dites que vous étiez en bas. Elle vous regarde comme si ç\'avait été un choix. ' + V('« On n\'a pas ouvert. »'))); }, next: 'hotel_morning' },
      { label: 'Vérifier le statut du vol sur le site de la compagnie.', if: (G) => G.dead(), dd: 2, time: 1, do: (G) => { G.note('Le site de la compagnie est sur le téléphone. Le téléphone est une dalle noire. Vous le remettez dans votre poche, où il est plus lourd qu\'avant.'); }, next: 'hotel_morning' },
      { label: 'Vérifier le statut du vol sur le site de la compagnie.', dd: 3, nd: 3, time: 8, if: (G) => !G.dead(), do: (G) => { const n = G.count('status'); G.dread(2); G.batt(-1); G.note(n === 1 ? 'AB 0271 · KEF → LAX · 15h10 · À L\'HEURE. À l\'heure pour quoi, le site ne le dit pas.' : n === 2 ? 'AB 0271 · 15h10 · À L\'HEURE. Puis, sous vos yeux, 15h25. Puis 15h10 à nouveau.' : 'La page ne charge pas. Puis elle charge, et le vol n\'y est pas. Puis il y est. 15h10. Vous rangez le téléphone avant que ça ne change encore.'); }, next: 'hotel_morning' },
      { label: G.readMsg('morning_mail') ? 'Sortir chercher le car de 09h00.' : 'Sortir chercher le car de 08h00.', kind: 'comply', dd: 5, if: (G) => (G.readMsg('morning_chat') || G.readMsg('morning_mail')) && G.t < T(1, 10, 0), time: 10, next: 'decoy_morning' },
      { label: 'Aller aux sources chaudes. Vous en avez toujours rêvé.', sub: 'C\'est à vingt minutes de l\'aéroport. Tout le monde le dit.', time: 40, do: (G) => G.flag('springs_from_hotel'), next: 'springs' },
      { label: 'Attendre dans le hall.', kind: 'comply', dd: 3, nd: 2, sub: 'Une demi-heure.', time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Une demi-heure. La machine à café, les portes, le panneau. Un enfant compte jusqu\'à cent et recommence.', 'Une demi-heure. L\'alarme du téléphone de quelqu\'un se déclenche – réglée sur l\'heure de Los Angeles – et tout le monde rit, puis plus personne.', 'Une demi-heure. Dehors, un car arrive, n\'est pas le vôtre, et repart. Vous ne vous levez pas. Personne ne se lève.'])); }, next: 'hotel_morning' },
    ],
    status: (G) => (G.has('hint_notes') ? 'Ce qui se dit : tout le monde a reçu des heures différentes de la compagnie. Tout le monde s\'en tient à la feuille imprimée. Les cars avec l\'écusson, « c\'est pas les nôtres ».' : ''),
  };

  scenes.decoy_morning = {
    art: 'carpark',
    enter: (G) => { REVISE(G); },
    loc: 'Hótel Hraun · Parking',
    text: (G) => p(
      'Il y a un car. Bleu marine, écusson doré, moteur en marche. L\'afficheur LED à l\'avant dit AIRPORT TRANSFER · ALBION ATLANTIC. Le chef de cabine se tient à la porte, les mains croisées, et quand il vous voit, il sourit comme si vous étiez pile à l\'heure.',
      'Personne d\'autre n\'est sorti du hall. À travers les vitres, les passagers déjà à bord sont assis bien droits dans des chemises propres et regardent le vide.',
    ),
    choices: (G) => [
      { label: G.readMsg('morning_mail') ? 'Monter. Le mail disait bien 09h00.' : 'Monter. Le chatbot disait bien 08h00.', kind: 'comply', do: (G) => G.end('crew') },
      { label: 'Rentrer. N\'en parler à personne.', whyNot: 'Il vous regarde.', dreadMax: 85, time: 5, do: (G) => { G.nerves(6); G.dread(5); G.note('Vous êtes rentré. Personne n\'a demandé. À travers la vitre, le car est resté où il était, porte ouverte, longtemps.'); }, next: 'hotel_morning' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 10:15 bus stand 2 */
  const BUS2_CHECK = (G) => { if (G.t < T(1, 11, 25)) return; if (G.S.buses.buses2) G.S.buses.buses2 = G.S.buses.buses2.filter((b) => b.key !== 'plain'); if (G.once('bus2_gone_note')) { G.flag('bus2_gone'); G.dread(8); G.nerves(6); G.note((G.last() ? G.last() + ' ' : '') + 'Le car banal est parti. Vous ne l\'avez pas vu partir ; vous regardiez autre chose, et quand vous avez tourné la tête il y avait du gravier là où il s\'était tenu, et le visage de la mère de l\'enfant dans une vitre arrière, de plus en plus petit. Il reste deux cars. L\'un des deux est très beau, et l\'un des deux est turquoise.'); } };
  scenes.buses2 = {
    art: 'carpark',
    loc: 'Hótel Hraun · Parking',
    // the plain coach waits a long time, by the standards of the night: until 11:25. Looking costs minutes; waiting costs more
    enter: (G) => { REVISE(G); if (G.t < T(1, 10, 15)) G.S.t = T(1, 10, 15); G.dread(4); BUS2_CHECK(G); },
    afterLook: (G) => BUS2_CHECK(G),
    text: (G) => p(
      G.last(),
      G.t >= T(1, 11, 25) ? 'Le parking, au mauvais bout de la matinée. Le panneau en Arial est toujours sur le comptoir, à l\'intérieur, et il dit toujours onze, et il ne vous est plus d\'aucune utilité.' : 'Quelqu\'un dit qu\'il y a un bus dehors. Vous demandez à la réceptionniste si c\'est le vôtre. Elle ne sait pas. Elle désigne le panneau en Arial. ' + V(LX('“Maybe you should hurry.”')),
      G.t >= T(1, 11, 0) ? 'Il est onze heures passées. Le panneau dit toujours onze heures. La réceptionniste est partie quelque part, et le hall a ce silence particulier d\'une pièce que tous les autres ont quittée.' : G.S.nerves >= 60 ? 'Imaginez une jauge de jeu vidéo, mais pour vos nerfs, et le mince filet de rouge tremblotant tout en haut.' : 'Vous êtes, vous le remarquez, tout à fait calme. C\'est le calme de quelqu\'un qui a décidé de faire confiance à une feuille A4, et qui le sait.',
      G.t >= T(1, 11, 25) ? 'Dehors : deux cars. Aucun des deux ne porte quoi que ce soit au feutre.' : 'Dehors : des cars. Personne ne vous a dit lequel. Les panneaux disent AÉROPORT de trois façons différentes, et l\'une des trois est au feutre.',
      G.has('hint_notes') && W('« Ceux avec l\'écusson, c\'est pas les nôtres. »'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: '#c7c3b6', windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'day' },
        name: 'Le même car banal qu\'hier soir, ou un qui lui ressemble beaucoup',
        sign: G.pick(['AIRPORT', 'AB0271 → KEF', 'FLIGHT PPL AIRPORT']), signStyle: 'paper',
        look: ['Chauffeur en gilet fluo. Sandwich différent.', 'À moitié plein. Des gens continuent de sortir du hall dans sa direction.'],
        hidden: [(G.did('talk_fleece') || G.has('met_fleece') ? 'La polaire. ' : 'L\'homme en polaire du hall. ') + 'L\'enfant. L\'homme du 31C. Les mêmes vêtements qu\'hier soir, évidemment, qu\'est-ce qu\'ils porteraient d\'autre.', 'Vous n\'êtes pas physionomiste. Ceux-là, vous les connaissez.'],
        board: { time: 5, do: (G) => G.flag('bus2_ok'), next: 'ride2' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'day' },
        name: 'Un car bleu marine avec un écusson doré',
        sign: 'AIRPORT TRANSFER · ALBION ATLANTIC', signStyle: 'led',
        look: [G.has('seen') ? 'Le chef de cabine à la porte. Il vous fait signe. Il sait laquelle était votre fenêtre.' : 'Le chef de cabine à la porte. Il fait signe, à l\'hôtel en général, et à vous en particulier.', 'Chaud. Silencieux. Plein de place.'],
        hidden: ['Personne à bord n\'a l\'air d\'avoir dormi habillé. Personne n\'a l\'air d\'avoir dormi.', 'Personne à bord n\'a son téléphone à la main.'],
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const lagoon = {
        key: 'lagoon',
        art: { livery: '#3e9c9a', windows: 'cold', passengers: 'few', sign: 'print', driver: 'plain', ground: 'day' },
        name: 'Un minibus turquoise',
        sign: 'BLUE LAGOON SHUTTLE — Relax. You deserve it.', signStyle: 'print',
        look: ['Le chauffeur tient une pile de serviettes blanches.', 'Ça sent le soufre et l\'eucalyptus.'],
        hidden: ['Tout le monde à bord a des chaussettes propres.', 'Il part dans deux minutes. Il part toujours dans deux minutes.'],
        board: { time: 30, next: 'springs' },
      };
      return G.t >= T(1, 11, 25) ? G.shuffle([crest, lagoon]) : G.shuffle([correct, crest, lagoon]);
    },
    choices: (G) => [
      { label: G.t >= T(1, 11, 25) ? 'Attendre. Un autre viendra. Le panneau disait l\'aéroport, et vous ne monterez dans aucun de ces deux-là.' : G.t < T(1, 11, 0) ? 'Attendre. Il n\'est pas encore 11h00. Le panneau disait 11h00.' : 'Attendre encore un peu. Il est onze heures passées, et le panneau disait onze, et le panneau a eu raison jusqu\'ici.', kind: 'comply', dd: 6, nd: 6, sub: G.t >= T(1, 11, 25) ? 'Personne n\'a appelé votre vol. Personne ne l\'appellera.' : G.t < T(1, 11, 0) ? 'Le panneau est la seule chose qui ait eu raison jusqu\'ici.' : G.has('business') ? 'L\'un des cars est toujours là. Son moteur tourne. Personne n\'a appelé votre vol.' : 'Le car blanc est toujours là. Son moteur tourne. Personne n\'a appelé votre vol.', time: 45, next: (G) => (G.t >= T(1, 11, 25) ? 'end:left' : 'buses2'), do: (G) => { G.nerves(8); G.dread(5); G.note(G.t < T(1, 11, 0) ? 'Vous attendez. Le panneau disait onze. Des gens que vous reconnaissez montent quand même dans le car blanc, un par un, deux par deux, en se retournant vers le panneau au passage, comme s\'il pouvait changer d\'avis. Il ne change pas d\'avis. Vous non plus.' : 'Vous attendez au-delà de onze heures. Le car blanc est toujours là, et puis sa porte se ferme, et il est toujours là, et vous comprenez qu\'il attend encore une personne et que cette personne ne sera pas prévenue.'); if (G.t + 45 >= T(1, 11, 25)) G.flag('via_noshow'); } },
    ],
  };

  scenes.ride2 = {
    art: 'road',
    loc: 'Route 41 · vers Keflavík',
    enter: (G) => { REVISE(G);
      G.flag('left_hotel');
      if (G.once('nofood')) { if (G.rng() < 0.5) G.at(T(1, 12, 30), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Catering sur votre vol', body: 'Cher Client,\n\nVeuillez noter qu\'en raison du déroutement, aucun service de restauration ne sera assuré sur le vol AB 0271.\n\nNous vous recommandons d\'acheter de quoi vous restaurer dans le terminal.\n\nNous faisons de notre mieux.' }); }
      G.at(T(1, 13, 10), 'chat', { body: 'Vous avez été hébergé. Pourquoi êtes-vous dans une queue ? 🙂' });
    },
    text: (G) => p(
      'Vous présumez que c\'est le bon bus uniquement parce que vous commencez à reconnaître des gens dedans, et vous n\'êtes pas physionomiste. Le bus part avec vingt minutes de retard, ce qui, d\'après vos calculs, signifie que vous arriverez à l\'aéroport à peine quarante minutes avant même l\'ouverture de l\'enregistrement.',
      'Le petit hurle. ' + (G.did('morn_mother') ? 'La mère le redit, à tout le car cette fois : ' : 'La mère murmure : ') + V('« Elle voudrait être à la maison, maintenant »,') + ' et tout le bus rit, tristement.',
      'L\'Islande défile par la fenêtre : une excellente eau du robinet, beaucoup de paysage, et des gens raisonnablement aimables qui ne sont pas d\'une grande aide mais ne vous menacent pas et ne vous mentent pas. On doit ça à l\'Islande. Keflavík est innocent.',
    ),
    choices: [{ label: 'Arriver.', time: 55, do: (G) => G.nerves(-4), next: 'airport' }],
  };

  /* ---------------------------------------------------------------- Day 1 · ~11:30 the airport (hub) */
  scenes.airport = {
    art: 'airport',
    loc: 'Aéroport international de Keflavík · Départs',
    enter: (G) => { REVISE(G);
      G.flag('at_airport2'); atLeast(G, 45);
      if (G.once('counter_paper')) G.msg('paper', { from: 'Feuille A4, fixée au collier de serrage à une barrière à sangle', subj: 'Panneau imprimé', body: '<b>ALBION ATLANTIC AB0271</b>\n\nCounter opens <b>3 HOURS</b> before departure.\n\nIf departure is delayed, counter opening is delayed.\n\nPlease queue here.' });
      if (G.once('ap_intro')) G.note(p(G.last(), 'Il y a un (1) comptoir Albion Atlantic dans l\'aéroport, et devant, une file entièrement composée de gens que vous connaissez désormais de vue. Le comptoir n\'est pas ouvert. Une feuille A4 annonce qu\'il ouvrira trois heures avant le départ, pas une minute plus tôt, et que si le vol est retardé, le comptoir l\'est aussi.'));
      const open = G.S.dep - 180;
      if (G.t >= open && G.has('inline')) G.go('checkin');
    },
    text: (G) => {
      const open = G.S.dep - 180;
      return hub(G,
        `Départs. ${G.clock(G.t)}. Le tableau affiche AB 0271 · LOS ANGELES · <em>${G.clock(G.S.dep)}</em>. ${G.t < open ? `D'après le calcul de la feuille, le comptoir ouvre à ${G.clock(open)}.` : G.has('inline') ? 'Le rideau se lève.' : 'Le comptoir est ouvert. La file avance. Vous n\'y êtes pas.'}`,
        'airport',
        G.has('seen') && G.D >= 5 ? W('Vous cherchez toujours un uniforme de chef de cabine. Vous n\'en avez pas vu. Ce n\'est pas la même chose que s\'il n\'y en avait pas.') : '');
    },
    choices: (G) => [
      { label: G.counted('kiosk') >= 2 ? 'Essayer la borne une dernière fois. Vous savez ce qu\'elle dira.' : 'Imprimer une nouvelle carte d\'embarquement à la borne.', if: (G) => G.counted('kiosk') < 3, nd: 4, dd: 2, time: 8, do: (G) => { const n = G.count('kiosk'); G.nerves(3); G.note(n === 1 ? 'VOTRE RÉSERVATION EST INTROUVABLE. Vous essayez la borne suivante. Vous retapez tout. VOTRE RÉSERVATION EST INTROUVABLE, dans une autre police.' : n === 2 ? 'La borne réfléchit longtemps et imprime une carte vierge. Vous la gardez. Vous ne savez pas pourquoi.' : 'VOTRE RÉSERVATION A ÉTÉ HÉBERGÉE. Puis l\'écran vire au noir et vous renvoie votre visage.'); if (n >= 3) G.dread(3); }, next: 'airport' },
      { label: 'Rejoindre la file de l\'unique comptoir.', if: (G) => !G.has('inline'), time: 5, do: (G) => { G.flag('inline'); G.note('Vous rejoignez la file. Ce n\'est pas tant une file qu\'une décision prise ensemble par deux cents personnes. Personne n\'y parle à la compagnie. Tout le monde y parle à tout le monde.'); }, next: 'airport' },
      { label: 'Faire circuler le QR code UK261 dans la file.', if: (G) => G.has('uk261') && G.dead(), dd: 2, time: 2, do: (G) => { G.note('Vous tendez la main vers le téléphone et il est mort, et vous dites le mot règlement à la file, et la file hoche la tête comme on hoche la tête devant un homme avec une pancarte.'); }, next: 'airport' },
      { label: 'Faire circuler le QR code UK261 dans la file.', whyNot: 'Vos mains ne tiendraient pas le téléphone immobile.', dd: -6, nd: -4, nerveMax: 90, if: (G) => G.has('uk261') && !G.dead(), once: 'qr2', time: 15, do: (G) => { G.collect(2); G.nerves(-5); G.note('Le code passe de main en main le long de la file, comme un mot de passe. ' + V('« Je suis prêt à jouer les Karen »,') + ' dit un homme en polaire, qui est l\'homme en polaire.'); }, next: 'airport' },
      { label: 'Comparer les hôtels et les heures de départ.', whyNot: 'Vous déclencheriez une dispute.', nd: -4, dd: -4, nerveMax: 85, once: 'notes2', time: 15, do: (G) => { G.collect(1); G.nerves(-3); G.note('Le mail de chacun l\'envoyait dans un endroit différent. Le bus de chacun l\'a amené au même hôtel. Chacun a reçu une heure différente, et tout le monde est revenu pour celle de la feuille, et vous voilà tous là, à avoir raison ensemble.' + (G.has('fleece_name') ? '' : ' L\'homme en polaire s\'appelle Dev. Vous voyagiez avec lui depuis un jour et demi sans le savoir.')); G.flag('fleece_name'); }, next: 'airport' },
      { label: G.S.nerves >= 95 ? 'Trouver l\'uniforme. Le lui dire, avec la voix qui vous reste.' : G.counted('complain_ap') === 0 ? 'Trouver quelqu\'un en uniforme et lui dire exactement ce que vous pensez.' : G.counted('complain_ap') === 1 ? 'Retrouver l\'uniforme. Le lui redire. Il l\'a noté la dernière fois.' : 'Le lui dire une troisième fois. La sécurité regarde par ici depuis la deuxième.', kind: 'conflict', nd: 8, sub: G.counted('complain_ap') >= 2 ? 'Il y a une limite. C\'est celle-ci.' : G.S.strikes >= 2 ? 'Déjà noté deux fois.' : G.S.strikes === 1 ? 'Déjà noté une fois.' : undefined, time: 10, do: (G) => { const n = G.count('complain_ap'); G.strike(); if (n >= 2) G.dread(6);   /* the second time, you feel the card turn over */ if (n >= 3 || G.S.nerves >= 95) { G.flag('lb_escort'); G.go('left_behind'); } else G.note(n === 1 ? 'Vous avez dit à un homme en uniforme exactement ce que vous pensiez. ' + V('« Nous faisons notre meilleur. »') + ' Pas d\'excuses. Pas de compassion. Même pas pour la forme. Il a noté quelque chose.' : 'Vous le lui avez redit. Il n\'a pas levé les yeux cette fois ; il a retourné la carte et écrit au dos. Près des portes, deux personnes en noir avec des radios avaient cessé de se parler.'); }, next: 'airport' },
      { label: 'Chercher la sortie. Juste pour voir.', whyNot: 'Vous savez déjà qu\'elle est verrouillée.', dd: 6, dreadMax: 85, time: 8, once: 'exit', do: (G) => { G.dread(5); G.nerves(4); G.note('Les portes qui donnent sur l\'extérieur indiquent ARRIVÉES UNIQUEMENT. Vous êtes entré par là. Vous posez la main sur la vitre, elle ne s\'ouvre pas, et un homme en gilet fluo, sans vous regarder, secoue la tête.'); }, next: 'airport' },
      { label: G.has('inline') ? 'Acheter de l\'eau. L\'homme derrière vous ne fait pas confiance à la compagnie pour ne pas tomber à court.' : 'Acheter de l\'eau. Quelqu\'un dit qu\'il n\'y en aura bientôt plus.', whyNot: 'Vous la jetteriez.', nd: -4, nerveMax: 92, time: 10, once: 'water', do: (G) => { G.nerves(-3); G.note('De l\'eau, un sandwich avec la lettre ð dedans, et – parce que la boutique en a – des chaussettes. Vous aviez des chaussettes. Vous en rachetez. Personne, parmi ceux qui ont traversé cette nuit, ne vous jugerait.'); if (!G.has('toothpaste')) { G.flag('toothpaste'); G.nerves(-4); } }, next: 'airport' },
      { label: 'Regarder le tableau des départs.', dd: 3, nd: 3, time: 6, do: (G) => { const n = G.count('board'); G.dread(2); G.note(n === 1 ? `AB 0271 · LOS ANGELES · ${G.clock(G.S.dep)}. Puis le tableau fait défiler tous les vols du monde et revient dessus. Même heure. Pour l'instant.` : n === 2 ? 'L\'heure n\'a pas changé. La ligne a descendu d\'un cran. Tout ce qui est au-dessus, c\'est un vol pour quelque part, qui part.' : 'Vous le regardez défiler. LOS ANGELES. LOS ANGELES. Le temps d\'une image, quelque chose qui n\'est pas une ville. LOS ANGELES.'); }, next: 'airport' },
      { label: 'S\'asseoir par terre contre un pilier. Fermer les yeux.', whyNot: 'Vous ne pouvez pas vous asseoir. Si vous vous asseyez, vous ne vous relèverez pas.', dreadMax: 92, nd: -6, dd: 2, time: 20, do: (G) => { const n = G.count('pillar'); G.note(n === 1 ? 'Le sol est froid à travers le pantalon d\'avion. Vous fermez les yeux et l\'aéroport continue sans vous, ce qu\'il allait faire de toute façon, et pendant vingt minutes c\'est un soulagement et non une menace.' : 'Le pilier, de nouveau. Quelqu\'un a laissé un manteau par terre à côté de vous et s\'en est allé. Vous n\'ouvrez pas les yeux pour voir à qui il est.'); }, next: 'airport' },
      { label: 'Attendre.', whyNot: 'Vous ne tenez pas en place.', kind: 'comply', nd: 3, dd: 3, nerveMax: 90, time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Une demi-heure. La file n\'avance pas parce qu\'il n\'y a rien vers quoi avancer. Quelqu\'un s\'assied par terre et ça se propage.', 'Une demi-heure. Une agente d\'entretien passe avec une machine. Une fois qu\'elle est partie, le sol est pareil et la file, un peu plus courte.', 'Une demi-heure. Votre téléphone vibre pour rien. Ceux de tout le monde, en même temps, et tout le monde regarde, et personne ne dit rien.'])); }, next: 'airport' },
    ],
  };

  scenes.checkin = {
    art: 'airport',
    loc: 'Keflavík · L\'unique comptoir',
    enter: (G) => { REVISE(G); G.S.t = Math.max(G.t, G.S.dep - 180); if (G.has('lind')) G.dread(4); if (G.S.strikes >= 3) { G.flag('lb_checkin'); G.go('left_behind'); } },
    text: (G) => p(
      'Le comptoir ouvre à l\'heure, c\'est-à-dire à l\'heure qu\'il avait décidée en privé. L\'agent prend votre passeport. Personne en uniforme n\'a dit pardon de toute la journée, même pas pour la forme, et cet homme ne sera pas le premier. ' + V('« Nous faisons notre meilleur. »'),
      G.has('booked') && 'Il fronce les sourcils devant l\'écran. ' + V('« D\'après nos dossiers, vous avez été hébergé au Heathrow Renaissance Lodge la nuit dernière. »') + ' Il tape quelque chose. Il dit que c\'est noté.',
      G.has('lind') && 'Il fronce les sourcils devant l\'écran. ' + V('« Nos enregistrements montrent vous n\'avez pas utilisé votre hébergement arrangé. »') + ' Il regarde vos vêtements, qui sont les mêmes que ceux de tout le monde, et votre visage, qui est plus propre. Il tape quelque chose. Il ne dit pas quoi.',
      G.has('objected') && W('Il jette un œil à une petite carte accrochée au moniteur, puis à vous.'),
      G.has('seen') && W('Il vous regarde un peu trop longtemps. ' + V('« Chambre 214, »') + ' dit-il, et ce n\'est pas une question.'),
      'Une carte d\'embarquement, encore tiède de l\'imprimante. Porte 12. Elle est bien réelle. Vous la vérifiez trois fois.',
    ),
    choices: [
      { label: 'Aller à la porte d\'embarquement.', time: 40, do: (G) => { if (G.has('booked')) G.strike(); G.nerves(-6); }, next: 'gate' },
    ],
  };

  scenes.gate = {
    art: 'gate',
    loc: 'Keflavík · Porte 12',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 60); G.dread(5); G.at(G.t + 20, 'chat', { body: 'La majorité des clients ont embarqué. 🙂' }); },
    text: (G) => p(
      'Vous voyagez maintenant depuis plus de vingt-quatre heures avec ces gens. Vous connaissez la polaire. Vous connaissez le bambin. Vous connaissez l\'homme du 31C. ' + (G.did('notes1') || G.did('notes2') ? 'Vous connaissez le couple dont le mail les envoyait dans un hôtel dans la direction opposée.' : 'Vous connaissez le couple âgé de la vitre.') + (G.did('water') ? ' Vous connaissez l\'homme qui, sincèrement, ne fait pas confiance à la compagnie pour ne pas tomber à court d\'eau.' : ''),
      'Une agente de porte prend le micro et vous <em>hurle</em> d\'embarquer par groupe d\'embarquement.',
      'Et cent personnes lui rient au nez. Pas méchamment. Juste – sans pouvoir s\'en empêcher. Vous êtes désormais une société autonome, et sa tentative de lui donner des ordres est, allez savoir pourquoi, la chose la plus drôle qui soit arrivée de toute la journée.',
    ),
    choices: [
      { label: 'Rire avec eux.', whyNot: 'Ça sortirait de travers.', nd: -6, dd: -4, nerveMax: 85, time: 10, do: (G) => { G.collect(1); G.nerves(-6); G.note('Vous riez. C\'est la première chose facile de toute la journée.'); }, next: 'standoff' },
      { label: 'Se mettre en file par groupe, docilement.', kind: 'comply', dd: 5, time: 10, do: (G) => { G.nerves(2); G.note('Vous trouvez votre groupe. Vous vous y tenez.'); }, next: 'standoff' },
      { label: 'Lui demander quand le vol partira vraiment.', kind: 'conflict', nd: 5, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) { G.flag('lb_gate'); G.go('left_behind'); } else G.note(V('« Quand l\'embarquement est complet, »') + ' a-t-elle dit, dans le micro, à vous, et a écrit quelque chose sur le dos de sa main.'); }, next: 'standoff' },
      { label: 'Lui crier dessus. Plus fort qu\'elle.', kind: 'conflict', nerveMin: 80, nd: 10, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) { G.flag('lb_gate'); G.go('left_behind'); } else G.note('Vous avez crié. Pendant quatre secondes, c\'était magnifique. Puis un homme en bleu marine a surgi à vos côtés, a noté quelque chose, et s\'en est allé, et les rires s\'étaient tus.'); }, next: 'standoff' },
    ],
  };

  /* ---- the stand-off: the rested passengers have your seats ---- */
  const CROWD = (G) => G.S.collective;
  const WIN_CROWD = (G) => {
    G.flag('won_collective'); G.flag('via_crowd'); G.collect(2); G.nerves(-8); G.dread(-10);
    G.note(p(
      'Personne ne crie. C\'est ça, la chose. Cent personnes dans les vêtements de la veille disent les mêmes quatre ou cinq choses, l\'une après l\'autre, d\'une voix ordinaire, et ne s\'arrêtent pas. ' + V('« La sécurité de nos clients est tantamount »,') + ' dit le chef de cabine, à eux tous, de la voix qui a fonctionné toute la nuit, et pour la première fois elle ne porte pas. ' + V('« Quels clients ? »') + ' dit la mère, et le petit le dit aussi, et le petit, lui, fait rire.',
      'L\'agente de porte repose le micro. L\'homme en bleu marine avec la radio regarde la salle, fait le calcul et s\'en va. On demande aux chemises propres, poliment, d\'attendre, et elles attendent, toutes en même temps, le regard droit devant. La file avance. C\'est votre file. À la porte, le chef de cabine s\'écarte et regarde, pour la première fois, les papiers plutôt que les visages, et ne fait aucune marque.',
    ));
  };
  const WIN_PROTECTED = (G) => {
    G.flag('won_collective'); G.flag('via_protected'); G.collect(2); G.nerves(-6); G.dread(-8);
    G.note(p(
      'Et puis ils ne peuvent pas vous déplacer. La polaire est devant vous. La mère est à côté de lui avec le petit sur la hanche, et le petit regarde l\'agent de sécurité avec un immense intérêt. L\'homme du 31C. Le couple de la vitre. L\'homme qui ne leur faisait pas confiance pour l\'eau. Cent personnes dans les vêtements de la veille, entre vous et la porte, sans toucher personne, sans crier, simplement debout là où elles sont et sans s\'arrêter.',
      'L\'agent de sécurité regarde le chef de cabine. Le chef de cabine regarde la carte dans sa main, et la salle, et la carte, et vous le regardez comprendre qu\'il n\'y a pas de numéro sur la carte pour ça. Le micro est reposé. On demande aux chemises propres, poliment, d\'attendre. La main lâche votre coude. La file avance, et vous y êtes, et quelqu\'un derrière vous dit ' + V('« Karen »,') + ' avec beaucoup d\'affection, et à la porte le chef de cabine ne fait aucune marque.',
    ));
  };
  scenes.standoff = {
    art: 'gate',
    loc: 'Keflavík · Porte 12 · embarquement',
    enter: (G) => { G.dread(3); G.flag('standoff'); },
    text: (G) => p(
      G.last(),
      'Puis l\'embarquement commence, et il commence par des gens que vous n\'avez jamais vus. Ils arrivent par le hall en une file silencieuse : chemises propres, chaussettes propres, les pochettes bleu marine de la compagnie sous le bras. Les passagers de mardi. Ceux de jeudi. La voix de l\'agente de porte change pour eux. Ils ont des cartes d\'embarquement pour AB 0271, et les cartes portent des numéros de siège, et celui qui passe le plus près de vous a le 31B.',
      'Au-dessus du comptoir, le tableau fait défiler ses lignes une à une et revient à la vôtre : AB 0271 · LOS ANGELES · <em>EMBARQUEMENT · CLIENTS HÉBERGÉS</em>. ' + V('« Les clients qui ont été accommodés vont embarquer en premier »,') + ' dit-elle, dans le micro, de la voix qu\'elle emploie pour les gens sur qui elle ne hurle pas. ' + V('« Les clients restants seront accommodés sur un service plus tard. »') + ' Personne ne prononce le mot débarqué. Elle n\'a pas besoin de le faire. Les enregistrements disent lesquels d\'entre vous sont les passagers, et les enregistrements sont dans une pochette bleu marine, et vous êtes dans la chemise d\'hier.',
      CROWD(G) >= 10 ? 'Autour de vous, le collectif est devenu très silencieux, comme une foule se tait juste avant de faire quelque chose. La polaire vous regarde. La mère a le petit sur la hanche et l\'autre main libre. L\'homme du 31C a retiré sa casquette, ce que vous ne l\'avez jamais vu faire.'
        : CROWD(G) >= 7 ? 'Autour de vous, les gens se regardent. La polaire. La mère. Le couple de la vitre. Personne n\'a encore rien dit. Quelqu\'un va le faire, si quelqu\'un d\'autre le fait.'
        : CROWD(G) >= 4 ? 'Autour de vous, quelques personnes se regardent, et davantage regardent leur téléphone. Le rire a quitté la salle, et rien n\'est venu le remplacer.'
        : 'Autour de vous, cent personnes regardent leur téléphone. Vous ne connaissez aucune d\'elles assez bien pour savoir ce qu\'elles pensent. Le rire a quitté la salle.',
    ),
    choices: (G) => [
      { label: 'Ne rien dire vous-même. Regarder l\'homme en polaire. Laisser la foule trouver sa voix.', whyNot: 'Vous ne pouvez regarder personne. Vous regardez le sol.', dreadMax: 85, time: 5,
        do: (G) => {
          if (CROWD(G) >= 7) {
            G.note('Vous regardez l\'homme en polaire, et il vous regarde, et pendant une seconde rien ne se passe. Puis il le dit, pas fort, à personne en particulier : ' + V('« Comptez-nous. »') + ' Et la mère, sans se retourner : ' + V('« Les mêmes vêtements qu\'hier soir. Regardez-nous. Regardez-les. »'));
          } else {
            G.flag('via_gate_quiet'); G.dread(10);
            G.note('Vous regardez l\'homme en polaire. Il regarde son téléphone. La mère regarde le petit. Le couple de la vitre regarde la vitre. Personne ne le dit, parce que personne n\'a parlé à personne, et une foule qui n\'a pas parlé n\'est qu\'une file d\'attente. Les chemises propres embarquent, toutes, et la porte au bout de la passerelle les avale, et l\'agente de porte dit ' + V('« Les clients restants »,') + ' dans le micro, et vous êtes un client restant.');
            G.end('left');
          }
        }, next: 'standoff_crowd' },
      { label: 'Faire un scandale. Assez fort pour que toute la porte l\'entende.', kind: 'conflict', whyNot: 'Vous ne pourriez pas élever la voix ici. Pas ici.', dreadMax: 80, nd: 8, time: 5,
        do: (G) => { G.strike(); G.note('Vous le dites, tout, au volume qu\'a employé l\'agente de porte : le vol, l\'hôtel, les coups à la porte, les vêtements, le siège que cet homme transporte dans une pochette bleu marine. La salle d\'embarquement l\'entend. La salle d\'embarquement se tait. Et deux personnes en noir avec des radios arrivent à votre coude sans avoir eu l\'air de marcher jusque-là, et le saisissent.'); }, next: 'standoff_fuss' },
      { label: 'Aller au comptoir. Plaider votre propre cause, calmement.', whyNotN: 'Vous n\'arriveriez pas calmement au bout de la première phrase.', whyNotD: 'Vous ne pouvez pas aller au comptoir. Le comptoir, c\'est là où ils notent les choses.', nerveMax: 85, dreadMax: 92, time: 12,
        do: (G) => {
          const k = G.S.strikes;
          const card = k >= 2 ? 'Elle retourne une petite carte. Deux coches. Elle les regarde, puis vous, plus longtemps que vous ne le voudriez.' : k === 1 ? 'Elle retourne une petite carte. Une coche. Elle la regarde, et laisse passer.' : 'Elle retourne une petite carte. Elle est vierge. Elle semble presque déçue.';
          const rec = G.has('booked') ? ' ' + V('« Nos enregistrements montrent vous avez été accommodé au Heathrow Renaissance Lodge. »') + ' Vous dites que non. Vous le dites comme vous le diriez à un collègue.' : G.has('lind') ? ' ' + V('« Nos enregistrements montrent vous n\'avez pas utilisé votre hébergement arrangé. »') + ' Vous dites que vous en avez trouvé un avec une porte qui fermait à clé, et une réceptionniste qui vous a dit la vérité, et vous le dites sans la moindre chaleur.' : ' ' + V('« Nos enregistrements montrent vous avez été accommodé à Hótel Hraun »,') + ' dit-elle, et vous dites oui, et ne dites rien de plus sur Hótel Hraun.';
          const reg = G.has('uk261') ? ' Vous mentionnez, poliment, que refuser l\'embarquement à un passager contre sa volonté a un chiffre attaché, dans le règlement, et que vous préféreriez ne pas avoir à le chercher devant elle. Elle préférerait ça aussi.' : '';
          let pushed = false;
          if (G.S.nerves > 70) { pushed = true; G.strike(); }
          if (G.S.strikes >= 3) {
            G.flag('lb_gate'); G.note(p('Vous allez au comptoir et dites ce que vous avez à dire, calmement, et ça sort moins calmement que vous ne le vouliez.', card + rec, 'Elle fait une troisième marque.')); G.go('left_behind'); return;
          }
          G.flag('won_home'); G.flag('via_desk'); G.nerves(-4); G.dread(2);
          G.note(p(
            'Vous allez au comptoir pendant que les chemises propres embarquent, et vous dites ce que vous avez à dire : le numéro de vol, le siège, l\'hôtel, la nuit, dans l\'ordre, de la voix que vous emploieriez avec un collègue.' + (pushed ? ' Ça sort un peu plus dur que vous ne le vouliez, vers la fin, et elle note quelque chose, et vous la laissez faire.' : ''),
            card + rec + reg,
            'Elle tape. Elle tape longtemps. Derrière elle, le chef de cabine de votre vol sort par la porte de la passerelle avec sa carte, et vous regarde, et regarde son écran, et rentre. Une carte d\'embarquement sort de l\'imprimante, tiède, avec 31B dessus, et elle vous la tend sans lever les yeux, et dit ' + V('« La majorité de nos clients ont été compréhensifs et patients. »') + ' Vous dites merci. Vous vous entendez le dire. Derrière vous, la porte est devenue silencieuse d\'une manière que vous ne vous retournez pas pour regarder.',
          ));
        }, next: 'jetbridge' },
      { label: 'Attendre. Ils ont dit que vous seriez hébergé sur un service ultérieur.', kind: 'comply', dd: 8, time: 10,
        do: (G) => { G.flag('via_gate_later'); G.note('Vous attendez. Les chemises propres embarquent, et la porte se ferme, et le micro dit que le service ultérieur sera annoncé. Il est annoncé à six heures le lendemain matin, côté ville, par une femme avec un écusson sur son comptoir, qui vous sourit, à vous précisément.'); G.end('left'); } },
    ],
  };

  // beat two, the crowd's way: the airline answers, and the crowd has to hold
  scenes.standoff_crowd = {
    art: 'gate',
    loc: 'Keflavík · Porte 12 · embarquement',
    enter: (G) => { G.dread(2); },
    text: (G) => p(
      G.last(),
      'Puis l\'homme du 31C, la casquette à la main, dit que la feuille disait onze et que la feuille avait raison, et quelqu\'un au fond dit qu\'il en a une photo. ' + (G.has('uk261') ? 'Quelqu\'un d\'autre lit l\'article 4 du règlement sur un téléphone, le passage sur le refus d\'embarquement contre votre volonté, et le chiffre à la fin, et cent personnes entendent le chiffre.' : 'Quelqu\'un d\'autre dit le mot règlement, et n\'en connaît pas le numéro, et le dit quand même.') + ' Ce n\'est pas fort. C\'est cent personnes qui disent des choses vraies de la voix qu\'elles prendraient à un arrêt de bus.',
      'Et la compagnie répond. La porte de la passerelle s\'ouvre et le chef de cabine de votre vol en sort, en uniforme, la petite carte à la main, et les chemises propres se tournent vers lui toutes en même temps, comme un champ se tourne dans le vent, puis se tournent vers vous. Lui non plus n\'élève pas la voix. ' + V('« Je suis en charge de cette cabine »,') + ' dit-il, ' + V('« et la sécurité de nos clients est tantamount. »') + ' Deux personnes en noir sont apparues aux bords de la foule, là où il y a des bords. Le tableau fait défiler ses lignes à nouveau, et revient identique.',
      CROWD(G) >= 10 ? 'Personne autour de vous n\'a reculé. La polaire a les bras croisés. La mère a fait passer le petit sur l\'autre hanche, qui est la hanche la plus proche du chef de cabine.' : 'Des gens près de vous ont reculé. Pas beaucoup. Assez pour que vous voyiez le sol là où ils étaient.',
    ),
    choices: (G) => [
      { label: 'Tenir. Ne rien dire. Les laisser continuer à le dire.', whyNot: 'Vous ne pouvez pas rester là. Il vous regarde.', dreadMax: 88, time: 5, do: (G) => { WIN_CROWD(G); }, next: 'jetbridge' },
      { label: 'Joindre votre voix au chœur. Doucement. Le panneau disait onze, et vous avez la photo.', if: (G) => G.did('hotel_paper') || G.has('uk261'), whyNot: 'Votre voix sortirait comme autre chose.', nerveMax: 80, time: 5, do: (G) => { G.collect(1); G.nerves(-3); WIN_CROWD(G); }, next: 'jetbridge' },
      { label: 'Reculer. Laisser ça à quelqu\'un d\'autre.', kind: 'comply', dd: 10, time: 5,
        do: (G) => { G.flag('via_gate_quiet'); G.note('Vous reculez, et la polaire vous voit le faire, et la mère vous voit le faire, et la chose qui allait se produire ne se produit pas. Trois ou quatre voix encore, puis les voix ordinaires, puis les téléphones. Le chef de cabine fait une marque, et n\'a pas besoin de dire à quoi elle sert. Les chemises propres embarquent.'); G.end('left'); } },
    ],
  };

  // beat two, the loud way: security has your elbow, and either the crowd closes or it does not
  scenes.standoff_fuss = {
    art: 'gate',
    loc: 'Keflavík · Porte 12 · embarquement',
    enter: (G) => { G.dread(4); G.nerves(4); },
    text: (G) => p(
      G.last(),
      'La porte de la passerelle s\'ouvre et le chef de cabine de votre vol en sort, en uniforme, la petite carte à la main, et les chemises propres se tournent vers lui toutes en même temps, comme un champ se tourne dans le vent, puis se tournent vers vous. ' + V('« Comme indiqué à bord »,') + ' dit-il, à vous, aimablement, ' + V('« les clients qui résistent ou font objection aux décisions opérationnelles peuvent être débarqués. »') + ' La main sur votre coude se resserre d\'exactement ce qu\'il faut pour signifier que le prochain mot sera un pas.',
      CROWD(G) >= 10 ? 'Autour de vous, personne n\'a reculé. La polaire a décroisé les bras. La mère a passé le petit à l\'homme du 31C, qui le prend comme quelqu\'un qui l\'a déjà fait, et elle a maintenant les deux mains libres.'
        : CROWD(G) >= 7 ? 'Autour de vous, les gens se regardent. La polaire vous regarde. Personne n\'a encore bougé. Quelqu\'un le ferait peut-être, si quelqu\'un d\'autre le faisait.'
        : 'Autour de vous, les gens regardent le sol, comme le fait une foule qui a décidé qu\'elle est une file d\'attente. La polaire regarde son téléphone.',
    ),
    choices: (G) => [
      { label: 'Continuer. Plus fort. Tout, en face.', kind: 'conflict', nd: 6, time: 5,
        do: (G) => {
          if (CROWD(G) >= 10) { WIN_PROTECTED(G); }
          else { G.flag('via_gate_escort'); G.nerves(6); G.note('Vous continuez, en face, et il vous laisse faire, et quand vous n\'avez plus rien il dit ' + V('« Merci, »') + ' et fait une marque, et cette fois personne n\'est devant vous. Quelques personnes lèvent les yeux. La polaire regarde le sol. On vous emmène, un de chaque côté, devant les chemises propres et par une porte dont vous ignoriez que c\'était une porte.'); G.end('left'); }
        }, next: 'jetbridge' },
      { label: 'S\'arrêter. Regarder l\'homme en polaire. Dire son nom. Dev. Le seul que vous ayez appris.', if: (G) => G.has('fleece_name'), whyNot: 'Vous ne pouvez regarder personne. Vous regardez la main sur votre bras.', dreadMax: 85, time: 5,
        do: (G) => {
          if (CROWD(G) >= 8) { WIN_PROTECTED(G); }
          else { G.flag('via_gate_escort'); G.note('Vous dites son nom. Il lève les yeux, et pendant une seconde vous croyez qu\'il va le faire, et puis il regarde son téléphone, et vous comprenez qu\'un nom n\'est pas une foule. On vous emmène, un de chaque côté, devant les chemises propres et par une porte dont vous ignoriez que c\'était une porte.'); G.end('left'); }
        }, next: 'jetbridge' },
      { label: 'S\'arrêter. Les laisser vous emmener.', kind: 'comply', dd: 8, time: 5,
        do: (G) => { G.flag('via_gate_escort'); G.note('Vous vous arrêtez. La main sur votre coude se relâche d\'exactement ce qu\'il faut pour signifier que vous avez été compris. On vous emmène, un de chaque côté, devant les chemises propres, qui ne vous regardent pas, et la polaire, qui vous regarde, et par une porte dont vous ignoriez que c\'était une porte.'); G.end('left'); } },
    ],
  };

  scenes.jetbridge = {
    art: 'gate',
    loc: 'Keflavík · Passerelle',
    text: (G) => p(
      G.last(),
      'La file s\'arrête sur la passerelle. L\'heure de départ inscrite sur votre carte d\'embarquement est déjà passée, et c\'est la carte la plus récente. Vous échangez vos notes avec l\'homme devant vous. On vous a dit à chacun quelque chose de différent sur ce que sera le vol.',
      'Puis la file avance, vous tournez au coin, et au lieu d\'une porte d\'avion il y a…',
      '<em>Un bus.</em>',
      W('Et il fallait absolument que vous embarquiez par groupe.'),
    ),
    choices: [{ label: 'Monter dans le bus.', time: 10, next: 'tarmac' }],
  };

  scenes.tarmac = {
    art: 'tarmac',
    loc: 'Un bus · une grande route · des pâturages vallonnés',
    enter: (G) => G.dread(5),
    text: (G) => p(
      'Ce bus ne vous emmène pas vers une autre partie du tarmac. Ce bus roule sur ce qui semble être une vraie grande route, à travers de vrais pâturages vallonnés, avec de vrais moutons dedans.',
      G.has('looked_out') ? 'À l\'avant du bus, debout, une main sur la barre, un homme en uniforme de chef de cabine. Il se retourne. Il vous regarde – vous, et vous seul – exactement aussi longtemps qu\'il avait regardé votre hublot. ' + V('« Vous avez regardé, »') + ' dit-il, aimablement, et se retourne.' : G.has('seen') ? 'À l\'avant du bus, debout, la main sur la barre, un homme en uniforme de chef de cabine. Il se retourne. Il vous regarde – vous seul – exactement aussi longtemps qu\'il a frappé à votre porte. ' + V('« Deux quatorze, »') + ' dit-il, aimablement, et se retourne.' : 'Le chauffeur ne parle pas. La radio passe quelque chose qui pourrait être la météo.',
      'Personne ne dit rien. Quelqu\'un, vers le fond, commence à rire, et s\'arrête.',
    ),
    choices: [
      { label: 'Rester à bord. Guetter à l\'horizon quoi que ce soit qui ait des ailes.', kind: 'comply', dd: 5, time: 15, next: 'plane' },
      { label: 'Aller devant. Demander au chauffeur où va ce car.', kind: 'conflict', nd: 4, time: 15, do: (G) => { G.nerves(5); G.flag('asked_driver2'); }, next: 'plane' },
      { label: 'Exiger de descendre. Maintenant.', kind: 'conflict', sub: 'Ce n\'est pas le tarmac.', do: (G) => { G.flag('via_pastures'); G.end('left'); } },
    ],
  };

  scenes.plane = {
    art: 'plane',
    loc: 'Une aire de trafic · quelque part',
    text: (G) => p(
      G.has('asked_driver2') && W('Il a désigné, devant, à travers le pare-brise, le pâturage. Puis le pâturage a pris fin.'),
      'Vous croyez apercevoir votre avion. Vous n\'avez donc probablement pas été enlevé.',
      'On vous fait faire la queue dehors, à petits pas, au pied de l\'escalier. Et puis il se met à pleuvoir. Vous riez tout haut, notamment parce que l\'heure de départ est déjà, évidemment, passée.',
      'Siège. Ceinture. La voix distinguée, à l\'interphone : ' + V('« La majorité de nos clients ont été compréhensifs et patients. »') + ' Il enchaîne en se félicitant, assez longuement, des procédures de sécurité qui vous ont conduits en Islande.',
      'Puis il explique comment demander un remboursement. Vous vous redressez. C\'est pour le wifi à bord.',
      'Vous ne le ferez pas.',
    ),
    choices: [
      { label: 'Fermer les yeux.', do: (G) => G.end(G.has('won_collective') ? 'collective' : 'home') },
    ],
  };

  /* ================================================================ Hótel Lind: the other hotel
     If the Flybus took you to the city and the taxi driver took you to the
     nearest light, you are here: a narrow guesthouse off Laugavegur that the
     airline never booked, with a clerk who speaks perfect English and has
     never heard of your flight. Everything is provided. That is the problem. */
  const lindStatus = (G) => `Chambre 7. ${G.clock(G.t)}. ${G.dead() ? 'Le téléphone est mort' : `Le téléphone est à ${G.battery()}%`}${G.has('lind_tp') ? '' : ', et vos dents sont sales'}${G.has('lind_ate') ? '' : ', et vous n\'avez rien mangé'}.`;
  const LIND_AMB = {
    room: [
      { d: 1, t: 'Une rue. Un lampadaire. Quelqu\'un qui rentre chez lui, sans se presser, ce qui paraît ce soir plus de chance qu\'une seule personne ne devrait avoir le droit d\'en avoir.' },
      { d: 1, t: 'Le radiateur cliquette. Le bâtiment craque comme craque un bâtiment où des gens dorment.' },
      { d: 2, t: 'Un taxi passe en bas, lentement, lumière allumée, et ne s\'arrête pour personne.' },
      { d: 2, t: 'À travers le mur, quelqu\'un ronfle avec un accent.' },
      { d: 3, t: 'La rue s\'est vidée. Elle l\'a fait pendant que vous ne regardiez pas.' },
      { d: 3, t: 'Sous le lampadaire d\'en face, personne. Puis, un instant, pas personne.' },
      { d: 4, t: 'Un moteur de car, quelque part dans une rue trop étroite pour un car, au ralenti.' },
      { d: 4, t: 'L\'homme sous le lampadaire ne regarde pas le bâtiment. Il regarde une fenêtre.' },
      { d: 5, t: 'La lumière sous votre porte s\'éteint, et revient, et s\'éteint.' },
      { d: 5, t: 'Quelqu\'un est dans l\'escalier. Il y est depuis un certain temps. Il ne monte pas et ne descend pas.' },
    ],
    lobby: [
      { d: 1, t: 'La réceptionniste lit un livre de poche au dos cassé. Elle tourne une page. C\'est la chose la plus détendue que vous ayez vue depuis le Groenland.' },
      { d: 1, t: 'Un présentoir de dépliants : GLACIERS · BALEINES · AURORES BORÉALES. Quelqu\'un, ici, verra tout ça.' },
      { d: 2, t: 'De la cuisine, une bouilloire, et l\'odeur du toast de quelqu\'un d\'autre.' },
      { d: 2, t: 'La porte d\'entrée est verrouillée. La réceptionniste l\'a verrouillée à minuit. Elle le dit sans lever les yeux.' },
      { d: 3, t: 'Un client descend en chaussettes, remplit un verre d\'eau, et remonte. Il ne vous a pas regardé. Il a regardé la porte.' },
      { d: 3, t: 'Le livre de poche n\'a pas bougé. La réceptionniste regarde le plafond, vers un bruit que vous n\'avez pas encore entendu.' },
      { d: 4, t: 'Des phares à travers le verre dépoli de la porte, au ralenti, qui ne repartent pas.' },
      { d: 4, t: () => 'La réceptionniste dit, à son livre de poche : ' + LX('“He asked for you. I said we had nobody of that name.”') },
      { d: 5, t: 'La porte d\'entrée est déverrouillée. La réceptionniste est sûre de l\'avoir verrouillée.' },
    ],
    street: [
      { d: 1, t: 'Du givre sur les voitures. Une boulangerie qui ouvrira dans trois heures pour des gens qui ne sont pas vous.' },
      { d: 2, t: 'Un taxi traverse le bout de la rue, lumière allumée, lentement, et ne tourne pas.' },
      { d: 2, t: 'Quelque part une porte se ferme, et quelqu\'un rit une fois, à l\'intérieur, dans une pièce chaude.' },
      { d: 3, t: 'Le lampadaire d\'en face vacille, se stabilise, vacille. Dessous, personne. Puis personne encore, autrement.' },
      { d: 3, t: 'Un moteur, au ralenti, quelque part en bas de la colline. Il tourne au ralenti depuis un moment.' },
      { d: 4, t: 'L\'homme sous le lampadaire d\'en face n\'a pas bougé. Il ne vous regarde pas. Il regarde la porte par laquelle vous êtes sorti.' },
      { d: 5, t: 'La réceptionniste n\'est plus derrière la vitre. La lumière du hall est allumée. Le hall est vide.' },
    ],
    morning: [
      { d: 1, t: 'Du bon café. Du vrai café, sorti d\'une machine qui a un nom. Vous le tenez un moment avant de le boire.' },
      { d: 2, t: 'Deux routards planifient leur journée. Il y a un glacier dedans. Vous les écoutez comme vous écouteriez la météo d\'une autre planète.' },
      { d: 2, t: 'À la table d\'à côté, un homme en chemise propre lit un mail et hoche la tête devant.' },
      { d: 3, t: 'La femme près de la fenêtre est ici depuis mardi. Elle le dit gaiement. Elle dit que le transfert est confirmé.' },
      { d: 3, t: 'Personne à la table Albion n\'a regardé le tableau des départs. Ils regardent leurs téléphones, et leurs téléphones leur disent d\'attendre.' },
      { d: 4, t: 'Quelqu\'un à la table Albion rit d\'une chose que son téléphone a dite. Toute la table rit. Puis ils se remettent à attendre.' },
      { d: 4, t: 'La réceptionniste ressert du skyr. Elle l\'a déjà fait. Elle l\'a fait tous les matins cette semaine.' },
      { d: 5, t: 'Il y a une place libre à la table Albion. Le couvert est mis. Il y a un petit carton avec votre nom dessus, en Arial.' },
    ],
  };

  // the flood: everything the airline sent while the phone was dark, and the things it sends to a customer who has made alternative arrangements
  function lindFlood(G) {
    const msgs = [];
    const E = (subj, body, dd = 2) => msgs.push({ ch: 'email', from: 'Albion Atlantic Customer Care', subj, body, dd });
    const X = (body, dd = 1) => msgs.push({ ch: 'sms', from: 'AlbionATL', body, dd });
    const A = (body, dd = 1) => msgs.push({ ch: 'chat', body, dd });
    E('Votre hébergement', 'Cher Client,\n\nNos enregistrements montrent que vous n\'avez pas fait le check-in à votre hébergement arrangé.\n\nS\'il vous plaît procéder à votre hébergement.\n\nNous faisons de notre mieux.');
    A('Nous voyons vous avez fait des arrangements alternatifs. 🙂');
    X('AB0271 : Vous n\'êtes pas à votre hébergement. S\'il vous plaît procéder à votre hébergement. Ne pas répondre.');
    A('Vos arrangements alternatifs ont été notés.');
    E('Arrangements alternatifs – action requise', 'Cher Client,\n\nLes clients qui font des arrangements d\'hébergement alternatifs le font à leur propre risque et dépense. Albion Atlantic ne peut pas garantir le transport onward pour les clients qui ne sont pas à leur hébergement arrangé.\n\nS\'il vous plaît retourner à votre hébergement.\n\nNous faisons de notre mieux.', 3);
    X('AB0271 : Votre hôtel est HEATHROW RENAISSANCE LODGE. Ne pas répondre.');
    A('Où êtes-vous ? 🙂');
    A('Nous sommes incapables de vous localiser. S\'il vous plaît partager votre location pour que nous pouvons aider. 📍');
    E('Nous avons été incapables de vous joindre', 'Cher Client,\n\nNous avons tenté de vous contacter concernant votre transport onward et avons été incapables de vous joindre.\n\nC\'est la responsabilité du client de rester contactable.\n\nNous faisons de notre mieux.');
    X('AB0271 : S\'il vous plaît confirmer votre location. Répondre avec votre numéro de chambre.');
    X('AB0271 : S\'il vous plaît confirmer votre location.');
    X('AB0271 : S\'il vous plaît confirmer.');
    msgs.push({ ch: 'chat', body: 'Vous êtes à Hótel Lind, chambre 7.', dd: 3, key: 'located' });
    A('Merci. 🙂', 0);
    E('Transfert à votre hébergement – arrangé', 'Cher Client,\n\nUn véhicule a été arrangé pour vous retourner à votre hébergement.\n\nCollection : Hótel Lind, 04:30.\n\nUn membre du staff va frapper.\n\nNous faisons de notre mieux.', 3);
    X('AB0271 : Un véhicule va vous collecter à 04:30 depuis votre location actuelle. S\'il vous plaît être prêt.');
    msgs.push({ ch: 'chat', body: 'Votre transfert est confirmé pour 04:30. S\'il vous plaît rester dans votre chambre. 🚌', dd: 1, key: 'knock_notice' });
    ['Êtes-vous confortable ? 🙂', 'S\'il vous plaît rester où vous êtes.', 'Y a-t-il autre chose ? Il n\'y a pas autre chose.', 'La majorité des clients sont à leur hébergement.', 'Nous pouvons voir que vous êtes toujours là.', 'S\'il vous plaît ne pas faire d\'autres arrangements.'].forEach((t) => A(t, 0));   // the chatter costs nothing: it is the same sentence, and you know it by now
    E('Important : clients pas à leur hébergement', 'Cher Client,\n\nLes clients qui ne sont pas à leur hébergement arrangé au moment de la collection peuvent être enregistrés comme no-shows et peuvent ne pas être accommodés sur le service réacheminé.\n\nCeci est pour votre sécurité.\n\nNous faisons de notre mieux.', 3);
    X('AB0271 : Les clients pas à leur hébergement peuvent être enregistrés comme NO-SHOW. Répondre STOP pour vous désinscrire.');
    X('STOP is not a recognised command.', 0);
    E('Un message de votre chef de cabine', 'Cher Client,\n\nJe suis en charge de cette cabine, et la sécurité de nos clients est tantamount.\n\nVous avez fait des arrangements alternatifs. Ceux-ci ont été notés.\n\nNous allons vous collecter à 04:30.\n\nNous faisons de notre mieux.', 4);
    ['AB0271 : S\'il vous plaît être prêt.', 'AB0271: 04:30.', 'AB0271 : Votre transfert est à temps.', 'AB0271 : S\'il vous plaît procéder à la porte à l\'heure arrangée.', 'AB0271 : Nous faisons de notre mieux.', 'AB0271: Do not reply.', 'AB0271 : S\'il vous plaît être prêt.', 'AB0271: 04:30.'].forEach((t) => X(t, 0));   // eight texts, one meaning
    A('Presque là. 🙂', 0);
    A('S\'il vous plaît procéder à la porte à 04:30. Ne pas l\'ouvrir avant. Ne pas l\'ouvrir après.', 2);
    E('Avis final', 'Cher Client,\n\nCeci est un avis final.\n\nNous faisons de notre mieux.', 3);
    X('AB0271: Final notice.');
    msgs.push({ ch: 'email', from: 'Albion Atlantic Customer Care', subj: 'Votre voiture attend', body: 'Cher Client,\n\nUne voiture a été arrangée pour vous retourner à votre hébergement à Hótel Hraun.\n\nVotre chauffeur attend dehors Hótel Lind. S\'il vous plaît chercher l\'écusson Albion Atlantic.\n\nTemps de trajet estimé : –:–', dd: 3, key: 'car', actions: [{ label: 'Descendre à la voiture', if: (G) => G.has('lind') && !G.has('morning'), next: 'lind_car' }] });
    A('Nous savons dans quelle chambre vous êtes. 🙂', 2);
    // stamped across the dark hours, from the moment the phone died to now, so they all land at once
    const t0 = G.S.deadAt != null ? G.S.deadAt : T(1, 2, 50), t1 = Math.max(t0 + msgs.length, G.t - 4);
    msgs.forEach((m, k) => { const at = Math.floor(t0 + (t1 - t0) * (k + 1) / msgs.length); if (m.ch === 'chat') m.at = at; else m.stamp = at; G.S.backlog.push(m); });
  }

  scenes.lind_arrive = {
    art: 'guesthouse',
    loc: 'Hótel Lind · près de Laugavegur · Réception',
    enter: (G) => { G.S.t = Math.max(G.t, T(1, 3, 5)); G.flag('at_hotel'); G.flag('lind'); atLeast(G, 34); },
    text: (G) => p(
      G.last(),
      'Une pension, donc. Étroite, chaude, une réception grande comme un placard, et derrière, une femme qui est réveillée, qui a un livre de poche, et qui vous regarde comme on regarde le temps qu\'il fait. Elle parle comme la compagnie ne parle pas : en phrases entières, sans logo dessus.',
      V(LX('“Gunnar\'s headlights. Then you are from the flight.”')) + ' La compagnie n\'a jamais réservé chez elle. Gunnar lui a amené un des vôtres chaque nuit cette semaine. C\'est, bizarrement, la meilleure nouvelle de la nuit. Elle a une chambre, la 7, deux étages plus haut, espèces ou carte. La carte passe du premier coup.',
      'Non, il n\'y a pas de panneau imprimé. Non, personne n\'a téléphoné. ' + V(LX('“Do you need anything? Toothpaste. A charger — everybody leaves chargers. There is bread in the kitchen, and skyr. Ask. I am here all night.”')),
    ),
    choices: [
      { label: 'Oui. Du dentifrice, s\'il vous plaît. Et un chargeur, s\'il y en a un qui va. Et ce qu\'il y a dans la cuisine.', nd: -3, dd: 1, time: 8, do: (G) => { G.flag('lind_tp'); G.flag('charger'); G.flag('lind_food'); G.S.once.lind_desk_tp = true; G.S.once.lind_desk_ch = true; G.S.once.lind_desk_food = true; G.nerves(-4); G.dread(2); G.note('Un tube à moitié utilisé laissé par un homme de Düsseldorf, une brosse à dents encore sous emballage, un plateau de pain et de skyr, et le tiroir : des dizaines de câbles, de toutes sortes, essayés sur votre téléphone un par un, comme des clés. Le quatrième va. ' + V(LX('“Keep it. Everybody leaves them.”')) + ' Vous montez les bras chargés, comme quelqu\'un qui revient des courses.'); }, next: 'lind_room' },
      { label: 'Juste la chambre, pour l\'instant.', time: 6, do: (G) => G.note('Vous lui dites que vous allez y réfléchir. Vous n\'avez aucune idée de pourquoi vous avez dit ça. Elle hoche la tête comme si elle l\'avait déjà entendu, retourne à son livre de poche, et dit, sans lever les yeux, qu\'elle est là toute la nuit.'), next: 'lind_room' },
    ],
  };

  scenes.lind_room = {
    art: 'street',
    loc: 'Hótel Lind · Chambre 7',
    enter: (G) => {
      G.flag('loc_lind_room');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('lind_knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('lind_sleep'); return; }
      if (G.once('lind_room_intro')) G.note(p(G.last(), 'Un lit une place sous un plafond mansardé, un radiateur, une bouilloire, une fenêtre sur une rue. Une rue, avec un lampadaire et une voiture garée et, sous vos yeux, quelqu\'un qui rentre chez lui. Vous restez à la fenêtre plus longtemps que vous ne le vouliez. C\'est la première fenêtre de la nuit avec quelque chose derrière.'));
    },
    text: (G) => p(lindStatus(G) + (!G.has('charger') && !G.has('lind_tp') ? ' La réception est deux étages plus bas. Elle a dit de demander.' : ''), G.last(), G.amb('lind_room', LIND_AMB.room)),
    choices: (G) => [
      { label: 'Brancher le téléphone.', if: (G) => G.has('charger') && G.dead(), time: 3, next: 'lind_charge' },
      { label: 'Brancher le téléphone.', if: (G) => !G.has('charger') && G.dead(), dd: 2, time: 2, do: (G) => { G.note('Il y a une prise près du lit, et un téléphone, et rien entre les deux. Elle a dit de demander.'); }, next: 'lind_room' },
      { label: 'Se brosser les dents. Vraiment les brosser.', if: (G) => G.has('lind_tp') && !G.did('brush'), once: 'brush', time: 4, do: (G) => { G.nerves(-4); G.dread(-1); G.note('Du dentifrice qui a appartenu à un inconnu de Düsseldorf. Vous brossez pendant deux bonnes minutes en vous regardant dans le miroir, et pendant deux minutes vous êtes quelqu\'un qui va quelque part demain.'); }, next: 'lind_room' },
      { label: 'Manger le pain et le skyr qu\'elle a laissés sur le plateau.', if: (G) => G.has('lind_food') && !G.has('lind_ate'), time: 8, do: (G) => { G.flag('lind_ate'); G.nerves(-8); G.note('Du pain, du beurre, un pot de skyr avec une date que vous pouvez accepter. Vous mangez au bord du lit, le plateau sur les genoux. C\'est le meilleur repas que vous ayez fait en vingt heures, et personne ne l\'a arrangé.'); }, next: 'lind_room' },
      { label: 'Prendre une douche. Remettre les mêmes vêtements.', whyNot: 'Vous ne tiendriez pas en place dessous.', nerveMax: 95, time: 20, once: 'lind_shower', do: (G) => { G.nerves(-6); G.dread(-3); G.note('De l\'eau chaude qui sent légèrement l\'œuf et ne s\'arrête pas. Vous restez dessous jusqu\'à redevenir quelqu\'un, puis vous remettez l\'avion sur vous.'); }, next: 'lind_room' },
      { label: 'Faire du thé avec la bouilloire.', whyNot: 'Vos mains le renverseraient.', nerveMax: 90, time: 8, once: 'lind_tea', do: (G) => { G.nerves(-5); G.dread(-2); G.note('Du thé, avec du vrai lait d\'un pichet du frigo commun, que quelqu\'un a étiqueté d\'un prénom et d\'un smiley. Vous le tenez à deux mains. C\'est la première chose chaude depuis Heathrow qui ne porte pas d\'écusson.'); }, next: 'lind_room' },
      { label: 'Regarder par la fenêtre, vers la rue.', whyNot: 'Vous savez ce qu\'il y a dehors, maintenant.', dd: 2, dreadMax: 85, time: 3, do: (G) => { const d = G.D, n = G.count('lwin'); G.dread(2); G.nerves(d >= 4 ? 6 : 1); if (d >= 4) G.flag('looked_lind'); G.note(d >= 5 ? 'Le car est dans la rue maintenant, il la remplit, ses rétroviseurs à une main des murs de chaque côté. Lumières allumées à l\'intérieur. Tout le monde dedans tourné vers la pension, droit, immobile. Et près de la porte, les mains croisées, un homme en bleu marine, qui lève les yeux vers une fenêtre. Vous lâchez le rideau.' : d >= 4 ? 'Sous le lampadaire d\'en face, un homme en uniforme bleu marine, très droit, les mains croisées. Il ne regarde pas la pension. Il regarde la fenêtre à deux de la vôtre. Puis à une.' : n === 1 ? 'Une rue. Un lampadaire. Un chat sur un mur, qui ne fait rien, magnifiquement. Vous pourriez pleurer à cause du chat.' : 'La rue. Le lampadaire. Une voiture passe lentement, avec une lumière sur le toit, et ne s\'arrête pas. C\'est plus calme qu\'avant.'); }, next: 'lind_room' },
      { label: 'Écouter le bâtiment.', whyNot: 'Vous ne voulez pas savoir.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(2); G.note(G.pick(d >= 4 ? ['Des pas dans l\'escalier. Réguliers. Patients. Qui s\'arrêtent sur le palier en dessous du vôtre, et y restent.', 'La porte d\'entrée, deux étages plus bas, celle qu\'elle a verrouillée à minuit, qui s\'ouvre.', 'Des coups. Pas ici. L\'immeuble d\'à côté. Puis celui-ci, en bas. Puis plus près.'] : ['Des ronflements à travers un mur. Un robinet à travers un autre. Un bâtiment plein de gens qui vont quelque part demain.', 'La bouilloire dans la cuisine, deux étages plus bas, et quelqu\'un qui fredonne devant.', 'Rien. Un radiateur. Une ville endormie, ce qui est un son.'])); }, next: 'lind_room' },
      { label: 'Essayer de dormir.', whyNot: 'Vous ne tenez pas allongé.', nerveMax: 80, time: 25, do: (G) => { if (G.t + 25 >= T(1, 4, 5)) { G.S.t = Math.max(G.t, KNOCK_AT - 25); G.nerves(-2); G.note('Vous vous allongez dans vos vêtements d\'avion, lumière allumée. Le plafond penche vers vous. Vous êtes presque, presque –'); } else { G.nerves(-4); G.dread(1); G.note(G.pick(['Vous vous allongez. Un vrai lit, un vrai silence. Votre corps n\'en croit rien et reste là, aux aguets.', 'Yeux fermés. Une voiture en bas, qui ralentit, qui ne s\'arrête pas. Vous vous redressez.', 'Vous vous glissez sous la couette tout habillé. Quelque part, une bouilloire. Le sommeil vous regarde depuis la rue et n\'entre pas.'])); } }, next: 'lind_room' },
      { label: (!G.has('charger') || !G.has('lind_tp') || !G.has('lind_food')) ? 'Descendre à la réception. Demander des choses.' : 'Descendre à la réception.', time: 2, next: 'lind_lobby' },
    ],
  };

  scenes.lind_lobby = {
    art: 'guesthouse',
    loc: 'Hótel Lind · Réception',
    enter: (G) => {
      G.flag('loc_lind_lobby');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('lind_lobby_knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('lind_sleep'); return; }
      if (G.once('lind_lobby_intro')) G.note(p(G.last(), G.has('charger') ? 'La réceptionniste, le livre de poche, une cuisine derrière une porte avec la lumière allumée. Le tiroir à câbles est refermé, et celui dans votre poche est la seule chose qu\'on vous ait donnée de toute la nuit dont vous ayez eu envie.' : 'La réceptionniste, le livre de poche, une cuisine derrière une porte avec la lumière allumée, un tiroir qu\'elle ouvre sans qu\'on le lui demande. Il est plein de câbles. Des dizaines. De toutes sortes. Laissés par tous les clients qui ont séjourné ici et sont rentrés chez eux.'));
    },
    text: (G) => p(`Réception. ${G.clock(G.t)}. La réceptionniste est toujours réveillée. La porte d'entrée est verrouillée.`, G.last(), G.amb('lind_lobby', LIND_AMB.lobby)),
    choices: (G) => [
      { label: 'Demander si elle parle français.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 4, do: (G) => { G.flag('fr_asked'); G.nerves(-2); G.note(LX('“A little. Toothpaste, charger, kitchen. Sleep.”') + ' Elle l\'a dit lentement, en les comptant sur le livre de poche.'); }, next: 'lind_lobby' },
      { label: 'Demander du dentifrice.', time: 4, once: 'lind_desk_tp', do: (G) => { G.flag('lind_tp'); G.nerves(-3); G.note('Elle fouille sous le comptoir et en sort un tube, à moitié utilisé, laissé par un client parti en hâte. ' + V(LX('“Düsseldorf,”')) + ' dit-elle, en guise de provenance. Il y a aussi une brosse à dents, encore sous emballage.'); }, next: 'lind_lobby' },
      { label: 'Demander un chargeur.', time: 4, once: 'lind_desk_ch', do: (G) => { G.flag('charger'); G.nerves(-2); G.dread(2); G.note('Le tiroir. Elle farfouille, essaie les câbles sur votre téléphone un par un, comme des clés. Le quatrième va. ' + V(LX('“Keep it. Everybody leaves them.”')) + ' Vous le tenez un instant avant de le mettre dans votre poche, comme si c\'était une décision.'); }, next: 'lind_lobby' },
      { label: 'Demander s\'il y a quelque chose à manger.', time: 5, once: 'lind_desk_food', do: (G) => { G.flag('lind_food'); G.nerves(-2); G.note('Elle va dans la cuisine et revient avec un plateau : du pain, du beurre, un pot de skyr. ' + V(LX('“Take it up. Breakfast is at seven. Proper breakfast.”')) + ' Personne ne vous a dit le mot vrai depuis Londres.'); }, next: 'lind_lobby' },
      { label: 'Demander comment retourner à l\'aéroport.', dd: -3, time: 6, once: 'lind_desk_bus', do: (G) => { G.flag('know_flybus'); G.nerves(-3); G.msg('paper', { from: 'Réception, Hótel Lind', subj: 'Carte Flybus', body: '<b>FLYBUS → KEF AIRPORT</b>\n\nFrom BSÍ terminal (10 min walk)\n\n06:00 · 07:00 · 08:00 · 09:00 · 10:00 · every hour\n\n<b>TICKET REQUIRED</b> — buy at the kiosk or online\n\n45 minutes.' }); G.note('Elle ne montre pas l\'Islande du doigt. Elle l\'écrit sur une carte : ' + V(LX('“Flybus. From BSÍ, where you came from. Ten minutes. Every hour from six. Buy the ticket first; the driver will not take you without one.”')) + ' Elle vous regarde. ' + V(LX('“Not the other one. The yellow one.”')) + ' Vous n\'aviez pas parlé d\'un autre.'); }, next: 'lind_lobby' },
      { label: 'Demander si quelqu\'un vous a demandé.', kind: 'comply', dd: 3, time: 4, do: (G) => { const n = G.count('lind_asked'); G.dread(1); G.note(G.t >= KNOCK_AT ? V(LX('“A man in a uniform. I told him we had nobody of that name. He said he would wait.”')) + ' Elle regarde la porte. ' + V(LX('“I locked it.”')) : n === 1 ? V(LX('“Nobody. Nobody knows you are here.”')) + ' Elle le dit pour rassurer, et ça rassure, pendant une seconde environ.' : V(LX('“Still nobody,”')) + ' dit-elle, avant que vous ayez fini, sans lever les yeux, et puis elle les lève.'); }, next: 'lind_lobby' },
      { label: 'S\'asseoir dans la cuisine avec ceux qui sont réveillés.', whyNot: 'Vous aboieriez sur un inconnu.', nd: -4, dd: -2, nerveMax: 85, time: 10, once: 'lind_kitchen', do: (G) => { G.nerves(-3); G.dread(G.D >= 3 ? 3 : -1); G.note(G.D >= 3 ? 'Un homme en chemise propre, qui mange un toast à trois heures du matin comme si c\'était une heure raisonnable. ' + V('« Albion ? »') + ' dit-il, gaiement. ' + V('« Ceux de mardi. On attend le transfert. C\'est confirmé. »') + ' Il vous montre son téléphone. ' + ALLY(G) + ' l\'a confirmé. Il le confirme tous les matins.' : 'Deux routards, qui planifient un glacier. Ils vous donnent un biscuit, vous interrogent sur le vol et disent ' + V('« c\'est dingue »') + ' à chaque moment opportun. Pendant dix minutes, vous vous sentez comme une histoire que quelqu\'un d\'autre raconte.'); }, next: 'lind_lobby' },
      { label: 'Lui demander d\'appeler Gunnar. Aller à l\'autre hôtel, finalement. Le bon.', kind: 'comply', dd: 4, sub: 'Quarante minutes. La course, encore.', if: (G) => G.t < T(1, 5, 30), time: 6, do: (G) => G.note(V(LX('“Hraun? You are sure?”')) + ' Elle l\'appelle quand même, et dit votre numéro de chambre dans le combiné comme si c\'était un mot de passe, et retourne à son livre de poche, et ne vous regarde plus jusqu\'aux phares.'), next: 'lind_taxi_back' },
      { label: 'Lui demander de déverrouiller la porte. Sortir prendre l\'air.', whyNot: 'Pas dans cette rue-là.', dreadMax: 85, dd: -2, time: 3, do: (G) => G.note('Elle déverrouille sans un mot et referme à clé derrière vous, et reste derrière la vitre avec son livre de poche, à regarder, comme on surveillerait un enfant dans un jardin.'), next: 'lind_street' },
      { label: 'Remonter à la chambre 7.', time: 2, next: 'lind_room' },
    ],
  };

  /* ---- the street outside Lind (hub) ---- */
  scenes.lind_street = {
    art: 'street',
    loc: 'Laugavegur · devant Hótel Lind',
    enter: (G) => {
      G.dread(1);
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.flag('from_street'); G.go('lind_lobby_knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('lind_sleep'); return; }
      if (G.once('lind_street_intro')) G.note(p(G.last(), 'Une rue. Froide, mais d\'un froid de ville, avec des murs dedans. Des bars fermés, une boulangerie éteinte dont l\'odeur traîne encore, un lampadaire, des voitures garées sous le givre. Personne. Puis, tout au bout, quelqu\'un, qui marche dans l\'autre sens, sans se presser, avec quelque part une porte qui est à lui.'));
    },
    text: (G) => p(`La rue. ${G.clock(G.t)}. La porte derrière vous est verrouillée, et elle est derrière.` + (G.has('lind_car') ? (G.readMsg('car') ? ' Au bord du trottoir, moteur en marche, une voiture noire avec un petit écusson doré sur la portière, celle du mail.' : ' Au bord du trottoir, moteur en marche, une voiture noire avec un petit écusson doré sur la portière. Personne ne vous a dit à quoi elle sert. Ou quelqu\'un l\'a fait, et vous ne l\'avez pas lu.') : ''), G.last(), G.amb('lind_street', LIND_AMB.street)),
    choices: (G) => [
      { label: 'Marcher jusqu\'au coin. Regarder en bas de la colline.', whyNot: 'Vos pieds refusent.', nd: 3, dreadMax: 90, time: 6, do: (G) => { const d = G.D; G.dread(d >= 4 ? 3 : 1); G.nerves(d >= 4 ? 5 : 2); if (d >= 4) G.flag('coach_seen_street'); G.note(d >= 5 ? 'En bas de la colline, là où la rue s\'élargit vers le port, un car est garé en travers, bleu marine, écusson doré, toutes les lumières allumées à l\'intérieur. Il n\'y a pas moyen de passer sans passer par lui. Un homme à sa porte, les mains croisées, regarde en haut de la colline, vers vous, comme si vous étiez en retard.' : d >= 4 ? 'En bas de la colline, là où la rue s\'élargit, quelque chose de long et de sombre, moteur en marche, avec une bande de lumière chaude le long du flanc, qui est des vitres. C\'est trop gros pour la rue. C\'est dans la rue quand même.' : 'En bas de la colline, la rue s\'ouvre vers le port, et le port est un noir plus noir avec des lumières de l\'autre côté. Un taxi traverse le bas de la colline, enseigne allumée, en route pour ailleurs.'); }, next: 'lind_street' },
      { label: 'Descendre jusqu\'à lui.', kind: 'comply', if: (G) => G.has('coach_seen_street'), do: (G) => { G.flag('nc_lind'); G.flag('nc_street'); G.flag('via_knock'); G.end('crew'); } },
      { label: 'La voiture au bord du trottoir. Celle du mail. Monter.', kind: 'comply', if: (G) => G.has('lind_car') && G.readMsg('car'), sub: 'Elle a votre nom sur une tablette.', do: (G) => { G.flag('via_car'); G.end('crew'); } },
      { label: 'Lever les yeux vers votre fenêtre.', time: 3, do: (G) => { G.dread(1); G.nerves(1); G.note(G.D >= 4 ? 'Deuxième étage, la petite sous la pente du toit. La lumière est allumée. Vous l\'avez laissée allumée. Le rideau est ouvert. Vous ne l\'avez pas laissé ouvert.' : 'Deuxième étage, la petite sous la pente du toit. La lumière est allumée. Vue d\'ici, on dirait une chambre où quelqu\'un est en sécurité.'); }, next: 'lind_street' },
      { label: 'Se tenir sous le lampadaire et respirer.', nd: -3, dd: 1, time: 5, once: 'lind_breathe', do: (G) => { G.nerves(-4); G.dread(1); G.note('De l\'air froid, vraiment froid, et un ciel avec une seule étoile dedans qui est probablement un avion. Pendant une minute, vous êtes quelqu\'un debout dans une rue d\'une ville, et rien ne vous attend nulle part.'); }, next: 'lind_street' },
      { label: 'Frapper à la vitre. Rentrer.', time: 2, next: 'lind_lobby' },
    ],
  };

  scenes.lind_charge = {
    art: 'phone',
    loc: (G) => `Hótel Lind · Chambre 7 · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('charged'); G.flag('lind_car'); if (G.once('flood')) lindFlood(G); G.S.floodN = G.charge(100); },
    text: (G) => p(
      'Le câble. La prise près du lit. Le petit éclair, et l\'écran qui s\'allume en gris, et l\'horloge, qui a continué sans vous.',
      'Puis ça commence. Une vibration, et une vibration, et une vibration, et l\'écran qui se remplit du haut vers le bas de tout ce qu\'ils ont envoyé pendant que vous étiez éteint : mail, SMS, chat, mail, mail, SMS, un nombre qui grimpe dans un cercle rouge comme une fièvre. Ça ne s\'arrête pas. Vous le posez sur le lit et il se déplace sur la couette, en vibrant, quelques millimètres à la fois, vers vous.',
      `${G.S.floodN || 0} notifications. La dernière date d'il y a quatre minutes. Elle dit qu'ils savent dans quelle chambre vous êtes.`,
    ),
    choices: [
      { label: 'Les lire.', kind: 'comply', time: 2, do: (G) => { G.openPhone('email'); }, next: 'lind_read' },
      { label: 'Le retourner. Le laisser charger. Ne pas les lire.', whyNot: 'Vous ne pouvez pas ne pas regarder.', dreadMax: 80, nd: 4, time: 5, do: (G) => { G.note('Vous le posez face contre le sol près de la prise, où il continue de vibrer, étouffé, comme quelque chose sous un oreiller.'); }, next: 'lind_room' },
      { label: 'Débrancher le câble. Le laisser mort.', whyNot: 'Il a votre nom dedans, maintenant.', dreadMax: 70, instr: 'located', dd: -4, time: 2, do: (G) => { G.S.phoneDead = true; G.S.batt = 0; G.flag('unplugged'); G.nerves(5); G.note('Vous débranchez le câble. L\'écran tient une seconde, avec son nombre rouge, et s\'éteint. Le silence qui suit est la meilleure chose dans la chambre, et vous ne lui faites pas confiance.'); }, next: 'lind_room' },
    ],
  };

  // once you start, you read all of it: the only way out of this scene is an empty badge
  scenes.lind_read = {
    art: 'phone',
    loc: (G) => `Hótel Lind · Chambre 7 · ${G.clock(G.t)}`,
    text: (G) => p(
      'Vous les lisez. Le mail, puis le SMS, puis le chat, puis le mail de nouveau, parce que le nombre rouge ne baisse pas tant qu\'on ne les ouvre pas un par un, et maintenant vous avez commencé.',
      G.unread() > 0 ? `${G.unread()} encore à lire. Ils sont courts. Ils sont tous pareils, et tous légèrement différents, et celui qu'il vous reste à ouvrir est toujours celui qui compte.` : 'Le nombre rouge a disparu. Le téléphone est chaud. Ils savent dans quelle chambre vous êtes, et maintenant vous savez qu\'ils le savent, ce qui est la chose que vous auriez pu ne pas savoir.',
    ),
    choices: (G) => [
      { label: 'Le poser.', if: (G) => G.unread() === 0, time: 1, do: (G) => { G.note('Vous le posez, écran vers le haut, près de la prise. Il n\'a plus rien à vous dire, et il ne cesse pas de luire.'); }, next: 'lind_room' },
      { label: 'Arrêter de lire.', if: (G) => G.unread() > 0, kind: 'conflict', whyNot: 'Vous ne pouvez pas vous arrêter. Le nombre rouge ne vous laissera pas faire.', dreadMax: 60, nd: 3, time: 1, do: (G) => { G.note(`Vous vous arrêtez, avec ${G.unread()} d'entre eux encore non ouverts, ce qui vous coûte plus que ça ne devrait. Le téléphone continue de luire près de la prise, avec son nombre rouge, et vous lui tournez le dos, ce qui vous coûte aussi plus que ça ne devrait.`); }, next: 'lind_room' },
    ],
  };

  scenes.lind_car = {
    art: 'street',
    loc: 'Laugavegur · devant Hótel Lind',
    text: (G) => p(
      'La réceptionniste vous déverrouille la porte sans un mot. Au bord du trottoir, là où il n\'y avait rien, il y a une voiture : noire, longue, immaculée, un petit écusson doré sur la portière, moteur en marche, l\'échappement suspendu dans le froid comme une haleine. Le chauffeur tient une tablette avec votre nom dessus – correctement orthographié.',
      V('« Pour Hótel Hraun ? »'),
      'Il ouvre la portière arrière. De l\'air chaud. Du cuir. Derrière vous, à travers la vitre, la réceptionniste se tient debout, le livre de poche contre la poitrine, et elle secoue la tête, lentement, une fois.',
    ),
    choices: [
      { label: 'Monter. C\'est, après tout, le bon hôtel.', kind: 'comply', sub: 'Au chaud.', do: (G) => { G.flag('via_car'); G.end('crew'); } },
      { label: 'Non. Non, merci.', whyNot: 'Il a votre nom.', dd: 5, dreadMax: 85, time: 4, do: (G) => { G.nerves(5); G.dread(8); G.note('Le chauffeur n\'a pas eu l\'air surpris. Il a refermé la portière, et il est resté où il était, et il y était encore quand la réceptionniste a verrouillé la porte derrière vous et tourné la clé deux fois.'); }, next: 'lind_lobby' },
    ],
  };

  scenes.lind_taxi_back = {
    art: 'road',
    loc: 'Le taxi de Gunnar · Route 41 · vers la sortie',
    enter: (G) => { G.flag('left_lind'); G.flag('lind', false); G.S.t = Math.max(G.t + 40, T(1, 4, 10)); G.dread(6); G.nerves(4); },
    text: (G) => p(
      'Gunnar, de nouveau, la radio en sourdine. Il ne demande pas pourquoi. ' + V(LX('“Hraun. Yes. Everyone goes in the end.”')) + ' Il n\'a pas l\'air d\'approuver. Il conduit quand même.',
      'La ville s\'arrête. De la lave, sous un ciel bas, une route avec une seule ligne blanche qui n\'arrête pas de disparaître. Deux fois, des phares surgissent derrière et restent là, exactement assez loin, et puis ils disparaissent, et c\'est pire.',
      'À l\'hôtel bas et large, éclairé comme un aquarium, il prend la course sur la carte et dit ' + V(LX('“Good luck,”')) + ' et attend, phares allumés, jusqu\'à ce que vous soyez à l\'intérieur.',
    ),
    choices: [{ label: 'Entrer.', time: 3, next: 'hotel_arrive' }],
  };

  scenes.lind_knock = {
    art: 'street',
    loc: (G) => `Hótel Lind · Chambre 7 · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); },
    text: (G) => p(
      G.last(),
      'Quelqu\'un frappe. Deux étages plus haut dans un bâtiment verrouillé, à la porte d\'une chambre où personne ne vous a réservé. À coups réguliers, comme frappe quelqu\'un qui frappera toute la nuit.',
      V('« Transfert à votre hébergement. Albion Atlantic. Départ maintenant. »'),
      'La voix est patiente. La voix connaît le numéro de la chambre. La voix le dit, au cas où vous l\'auriez oublié : ' + V('« Sept. »'),
    ),
    choices: (G) => [
      { label: 'Ouvrir la porte.', kind: 'comply', sub: 'C\'est, après tout, votre transfert.', do: (G) => { G.flag('nc_lind'); G.flag('via_knock'); G.end('crew'); } },
      { label: G.counted('lind_asked') ? 'Non. Elle a dit que personne ne vous avait demandé.' : 'Non. Personne ne vous a réservé cette chambre.', whyNot: 'Vous ne pouvez pas ne pas répondre. Ils ont dit d\'être prêt.', nd: 5, dreadMax: 80, instr: 'knock_notice', time: 20, do: (G) => { G.nerves(5); G.note('Vous vous êtes assis sur le lit, le dos au mur, et vous avez compté. Vous avez perdu le compte à cinquante. Quand ça s\'est arrêté, il n\'y a eu aucun bruit de quelqu\'un qui redescendait l\'escalier.'); }, next: 'lind_window' },
      { label: 'Regarder par le judas.', dd: 6, nd: 6, time: 2, do: (G) => { G.nerves(9); G.flag('spyhole'); G.note('Le palier est vide. Les lattes devant votre porte sont sombres, comme mouillées. Les coups continuent, réguliers, venus de nulle part en particulier.'); }, next: 'lind_knock2' },
      { label: 'Décrocher le téléphone de la chambre. Lui demander qui elle a laissé entrer.', whyNot: 'Votre main ne le tiendrait pas.', nd: 4, nerveMax: 85, time: 4, do: (G) => { G.nerves(4); G.dread(4); G.note('Ça sonne une fois. ' + V(LX('“Seven? Yes. Nobody. I locked the door at midnight, I have been sitting here, nobody has come in.”')) + ' Un silence, pendant lequel vous entendez tous les deux les coups, à travers le téléphone et à travers la porte. ' + V(LX('“Don\'t open it. I am coming up.”')) + ' Vous l\'entendez dans l\'escalier. Les coups ne s\'arrêtent pas pour elle. Puis ils s\'arrêtent, et elle est devant votre porte, seule, à dire doucement votre numéro de chambre, et il n\'y a absolument personne d\'autre sur le palier.'); }, next: 'lind_window' },
    ],
  };

  scenes.lind_knock2 = {
    art: 'street',
    loc: (G) => `Hótel Lind · Chambre 7 · ${G.clock(G.t)}`,
    text: (G) => p(G.last(), 'Régulier. Patient. Personne.'),
    choices: [
      { label: 'Ouvrir la porte quand même.', kind: 'comply', do: (G) => { G.flag('nc_lind'); G.flag('via_knock'); G.end('crew'); } },
      { label: 'S\'éloigner de la porte. S\'asseoir sur le lit. Attendre que ça passe.', whyNot: 'Votre main est déjà sur le loquet.', dreadMax: 88, time: 25, do: (G) => { G.nerves(3); G.note('Ça s\'est arrêté, finalement, comme s\'arrête la pluie : vous n\'avez pas remarqué le dernier coup. Il n\'y a eu aucun bruit de quelqu\'un qui descendait l\'escalier.'); }, next: 'lind_window' },
    ],
  };

  scenes.lind_lobby_knock = {
    art: 'guesthouse',
    loc: (G) => `Hótel Lind · Réception · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); G.nerves(6); },
    text: (G) => p(
      G.last(),
      G.has('from_street') ? 'Vous frappez à la vitre, elle vous fait entrer et tourne la clé derrière vous, et c\'est là que ça commence. En haut. Deux étages plus haut. Des coups, réguliers et patients, à une porte, et la réceptionniste lève les yeux vers le plafond, puis vers la porte qu\'elle vient de verrouiller, puis vers vous.' : 'Vous êtes à la réception quand ça commence. En haut. Deux étages plus haut. Des coups, réguliers et patients, à une porte, et la réceptionniste lève les yeux vers le plafond, puis vers la porte d\'entrée, qui est verrouillée, puis vers vous.',
      V(LX('“That is seven,”')) + ' dit-elle. ' + V(LX('“Nobody came in.”')),
      'Du haut de l\'escalier, porté par la cage d\'escalier, aimablement : ' + V('« Transfert à votre hébergement. Départ maintenant. »'),
    ),
    choices: [
      { label: 'Monter. Vous êtes un passager Albion Atlantic.', kind: 'comply', do: (G) => { G.flag('nc_lind'); G.flag('via_knock'); G.end('crew'); } },
      { label: 'Rester en bas. Avec elle. Avec la lumière allumée.', whyNot: 'Vous ne pouvez pas bouger.', dd: 5, dreadMax: 92, time: 20, do: (G) => { G.nerves(4); G.dread(5); G.flag('hid_lobby'); G.note('Vous vous êtes assis dans l\'escalier, le dos au mur, et elle est restée assise derrière le comptoir, et aucun de vous n\'a rien dit, et au bout d\'un moment les coups ont cessé, et personne n\'est descendu.'); }, next: 'lind_window' },
    ],
  };

  scenes.lind_window = {
    art: 'street',
    loc: (G) => `Hótel Lind · Chambre 7 · ${G.clock(G.t)}`,
    enter: (G) => { G.S.t = Math.max(G.t, T(1, 4, 50)); if (!G.dead()) G.bot('Salut ! Je vois vous êtes dans chambre 7. Votre transfert attend dans la rue. S\'il vous plaît ne pas regarder hors de la fenêtre. 🙂', 2, 'nolook'); },
    text: (G) => p(
      G.last(),
      G.has('hid_lobby') ? 'Vous êtes remonté, finalement. Le palier était vide. Les coups ont cessé.' : 'Les coups ont cessé.',
      G.dead() ? 'Le téléphone est éteint par terre près de la prise, et c\'est presque pire : quoi qu\'ils disent, ils le disent à personne.' : 'Votre téléphone éclaire le plafond mansardé. ' + ALLY_MSG(G) + ' ' + (G.readMsg('nolook') ? W('Ne regardez pas par la fenêtre, disait-il. S\'il vous plaît.') : W('Il éclaire le plafond, s\'éteint, et l\'éclaire de nouveau.')),
      'Le rideau est mince. Il y a de la lumière qui passe à travers, venue d\'en bas, et la lumière bouge légèrement, comme bouge la lumière d\'un moteur qui tourne, dans une rue trop étroite pour la chose qui le fait tourner.',
    ),
    choices: [
      { label: 'Regarder.', whyNot: 'Ils ont dit de ne pas le faire.', dd: 10, nd: 8, dreadMax: 90, instr: 'nolook', sub: 'Juste un peu.', time: 5, do: (G) => { G.flag('seen'); G.flag('seen_lind'); G.flag('looked_out'); G.nerves(14); atLeast(G, 78); }, next: 'lind_window2' },
      { label: 'Non. Tirer la couette par-dessus la tête.', kind: 'comply', dd: 6, time: 5, do: (G) => G.nerves(2), next: 'lind_sleep' },
    ],
  };

  scenes.lind_window2 = {
    art: 'street',
    loc: (G) => `Hótel Lind · Chambre 7 · ${G.clock(G.t)}`,
    text: p(
      'Un car, bleu marine, avec un écusson doré, qui remplit la rue d\'un mur à l\'autre, ses rétroviseurs à une main des murs de chaque côté. Moteur en marche. Toutes les lumières allumées à l\'intérieur. Il est plein, et tout le monde dedans est assis parfaitement droit, et chacun d\'eux est tourné vers la pension.',
      'À la porte du car se tient un homme en uniforme de chef de cabine. Sous vos yeux, il lève la tête – pas vers le bâtiment. Vers votre fenêtre. Sous le lampadaire d\'en face, le livre de poche de la réceptionniste est posé ouvert sur le trottoir, à plat ventre, et la réceptionniste n\'est pas là.',
      'Il ne fait pas signe. Il n\'en a pas besoin. Il vous a vu, et vous l\'avez vu vous voir, et c\'est désormais une chose qui existe.',
    ),
    choices: [{ label: 'Lâcher le rideau.', time: 5, next: 'lind_sleep' }],
  };

  scenes.lind_sleep = {
    art: 'guesthouse',
    loc: 'Hótel Lind · Salle du petit-déjeuner',
    enter: (G) => {
      G.S.t = T(1, 7, 30); G.flag('morning');
      G.S.dread = Math.max(20, G.S.dread - 25);
      G.nerves(G.has('allnighter') ? 6 : -10);
      if (G.has('lind_tp')) G.nerves(-4);
      if (G.dead()) { G.flag('lind_morning_cable'); if (G.once('flood')) lindFlood(G); G.charge(100); }
      G.at(T(1, 7, 35), 'sms', { from: 'Jo 💛', body: 'OMG T\'ES EN ISLANDE ?? faut absolument que tu fasses le blue lagoon. ABSOLUMENT. c\'est genre 20 min de l\'aéroport' });
      G.at(T(1, 8, 5), 'chat', { body: 'Bon matin ! Votre transfert depuis Hótel Lind à l\'aéroport est confirmé pour 09:00. S\'il vous plaît attendre dans le lobby. 🚌', dd: 1, key: 'morning_chat' });
      G.at(T(1, 9, 40), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Votre transfert à l\'aéroport', stamp: T(1, 9, 40), key: 'morning_mail', body: 'Cher client,\n\nDes cars viendront vous chercher à votre hébergement à 09:00 pour votre vol réacheminé AB 0271.\n\nMerci de vous présenter dans le hall à 08:45.\n\nNous faisons de notre mieux.', dd: 2 });
      G.at(T(1, 9, 55), 'chat', { body: 'Votre transfert est ici. C\'est le gentil. 🚌', dd: 1 });
    },
    text: (G) => p(
      G.has('allnighter') ? 'Lumière grise. 07:30. Vous n\'avez pas dormi, et vous êtes toujours en Islande, dans une pension que la compagnie n\'a jamais réservée.' : 'Lumière grise. 07:30. Vous avez dormi, ou quelque chose d\'approchant, dans un lit que personne n\'avait arrangé, et vous êtes toujours en Islande.',
      'Le petit-déjeuner, c\'est du pain, du skyr, des œufs, et un café que quelqu\'un a fait exprès. Deux routards planifient un glacier. Et à la longue table près de la fenêtre, un groupe de huit en chemises propres et chaussettes propres, qui regardent leurs téléphones, et hochent la tête devant.',
      V('« Albion ? »') + ' dit l\'un d\'eux, gaiement, en voyant vos vêtements. ' + V('« Ceux de mardi. Et ceux de jeudi, ces deux-là. On attend le transfert. C\'est confirmé. »') + ' Il tourne son téléphone vers vous. ' + ALLY(G) + ' l\'a confirmé. Il l\'a confirmé tous les matins. Personne à la table n\'a regardé le tableau des départs.',
      G.has('lind_morning_cable') && (G.has('charger') ? 'Vous branchez le téléphone sur la prise près du grille-pain, parce que c\'est le matin et parce qu\'il le faut. Il revient, et la première chose qu\'il fait, c\'est vous dire tout ce que vous avez manqué.' : 'La réceptionniste, sans qu\'on le lui demande, pose un câble sur la table à côté de votre assiette. Le téléphone revient, et la première chose qu\'il fait, c\'est vous dire tout ce que vous avez manqué.'),
    ),
    choices: [{ label: 'Prendre un café quand même.', time: 10, next: 'lind_morning' }],
  };

  scenes.lind_morning = {
    art: 'guesthouse',
    loc: 'Hótel Lind · Salle du petit-déjeuner',
    enter: (G) => { REVISE(G);
      if (G.t >= T(1, 10, 15) && !G.has('lind_decoy')) { G.go('lind_decoy'); return; }
      if (G.once('lind_morn_intro')) G.note(p(G.last(), 'La table Albion a un rythme : téléphone, hochement de tête, café, téléphone. Personne n\'a de sac. Personne n\'a de projet au-delà du transfert. La réceptionniste ressert le skyr comme on nourrirait quelque chose qu\'on a décidé de garder.'));
    },
    text: (G) => p(
      `La salle du petit-déjeuner. ${G.clock(G.t)}. ${G.readMsg('morning_mail') ? 'Le mail disait 09h00 et il est arrivé à 09h40. ' : G.readMsg('morning_chat') ? 'Le chatbot a promis un transfert à 09:00 depuis un hôtel qu\'il n\'a jamais réservé. ' : ''}${G.has('know_flybus') ? 'La carte dit que le Flybus part toutes les heures de BSÍ.' : 'Personne ici n\'a parlé d\'un bus.'}`,
      G.last(), G.amb('lind_morning', LIND_AMB.morning)),
    choices: (G) => [
      { label: 'Demander à la réception comment retourner à l\'aéroport.', dd: -3, time: 6, if: (G) => !G.has('know_flybus'), do: (G) => { G.flag('know_flybus'); G.nerves(-3); G.msg('paper', { from: 'Réception, Hótel Lind', subj: 'Carte Flybus', body: '<b>FLYBUS → KEF AIRPORT</b>\n\nFrom BSÍ terminal (10 min walk)\n\n06:00 · 07:00 · 08:00 · 09:00 · 10:00 · every hour\n\n<b>TICKET REQUIRED</b> — buy at the kiosk or online\n\n45 minutes.' }); G.note('Elle l\'écrit sur une carte. ' + V(LX('“Flybus. From BSÍ, where you came from. Ten minutes. Every hour. Buy the ticket first.”')) + ' Elle jette un œil à la longue table. ' + V(LX('“The yellow one. Not the other one.”'))); }, next: 'lind_morning' },
      { label: 'Parler aux passagers de mardi.', whyNot: 'Vous déclencheriez une dispute.', nd: -3, dd: 2, nerveMax: 85, time: 12, once: 'lind_tuesday', do: (G) => { G.nerves(-2); G.dread(3); G.note('Ils sont charmants. Ils sont reposés. Ils sont reposés depuis mardi. ' + V('« C\'est confirmé pour neuf heures, »') + ' dit une femme au col très propre. ' + V('« C\'était confirmé pour neuf heures hier. La compagnie fait de son mieux. »') + ' Vous demandez si quelqu\'un a pensé à simplement prendre le Flybus. Ils vous regardent comme on regarde quelqu\'un qui aurait proposé d\'aller en Amérique à pied.'); }, next: 'lind_morning' },
      { label: 'Remonter. Prendre une douche. Se laver le visage, au moins.', whyNot: 'Vous ne tiendriez pas en place dessous.', nerveMax: 92, time: 25, once: 'lind_morn_shower', do: (G) => { G.nerves(-5); G.dread(-2); G.note('De l\'eau chaude. Les mêmes vêtements. La chambre, à la lumière du jour, est une jolie chambre dans une jolie pension, et la rue dehors est une rue, avec une boulangerie, et rien de garé qui ne devrait pas l\'être.'); }, next: 'lind_morning' },
      { label: 'Vérifier le statut du vol sur le site de la compagnie.', if: (G) => G.dead(), dd: 2, time: 1, do: (G) => { G.note('Le site de la compagnie est sur le téléphone. Le téléphone est une dalle noire. Vous le remettez dans votre poche, où il est plus lourd qu\'avant.'); }, next: 'lind_morning' },
      { label: 'Vérifier le statut du vol sur le site de la compagnie.', dd: 3, nd: 3, time: 8, if: (G) => !G.dead(), do: (G) => { const n = G.count('status'); G.dread(2); G.batt(-1); G.note(n === 1 ? 'AB 0271 · KEF → LAX · 15:10 · À L\'HEURE. En dessous, en plus petit : VOTRE TRANSFERT EST CONFIRMÉ.' : 'AB 0271 · 15:10 · À L\'HEURE. La page sait dans quel hôtel vous êtes. Hier, elle ne le savait pas.'); }, next: 'lind_morning' },
      { label: 'Aller aux sources chaudes. Vous en avez toujours rêvé.', sub: 'C\'est à vingt minutes de l\'aéroport. Tout le monde le dit.', time: 40, do: (G) => G.flag('springs_from_hotel'), next: 'springs' },
      { label: (G.readMsg('morning_chat') || G.readMsg('morning_mail')) ? 'Attendre le transfert dans le hall. Il est confirmé.' : 'Attendre dans le hall avec les autres.', kind: 'comply', dd: 5, nd: 2, sub: 'Une demi-heure.', time: 30, do: (G) => { G.nerves(2); G.dread(3); G.note(G.pick(['Une demi-heure. La table Albion ne bouge pas. L\'un d\'eux va chercher un café et revient à la même chaise, comme si elle lui avait été attribuée.', 'Une demi-heure. Dehors, un bus jaune passe au bout de la rue, et personne à la longue table ne tourne la tête.', 'Une demi-heure. Tous les téléphones de la longue table disent, en même temps, que le transfert est en route, et toute la table sourit en même temps.'])); }, next: 'lind_morning' },
      { label: 'Marcher jusqu\'à BSÍ. Dix minutes. Acheter un ticket pour le jaune.', if: (G) => G.has('know_flybus'), dd: -2, time: 12, next: 'lind_buses' },
      { label: 'Retourner à pied à la gare routière et voir ce qu\'il y a.', if: (G) => !G.has('know_flybus'), time: 12, next: 'lind_buses' },
    ],
  };

  scenes.lind_decoy = {
    art: 'street',
    loc: 'Hótel Lind · la rue devant',
    enter: (G) => { REVISE(G); G.flag('lind_decoy'); G.dread(4); },
    text: (G) => p(
      'Quelqu\'un à la longue table dit : ' + V('« Il est là. »') + ' Huit personnes se lèvent d\'un coup, comme une assemblée de fidèles.',
      'Dehors : un car, bleu marine, écusson doré, qui remplit la rue d\'un mur à l\'autre, son afficheur LED disant TRANSFER · ALBION ATLANTIC · CONFIRMED. Le chef de cabine se tient à la porte, les mains croisées, et quand il vous voit, il sourit comme si vous étiez pile à l\'heure, ce que, pour la première fois en deux jours, vous êtes.',
      'Les passagers de mardi défilent devant vous et montent les marches, et s\'assoient, et se tournent vers la pension, et restent immobiles. La réceptionniste se tient dans l\'embrasure de la porte, le livre de poche contre la poitrine. Elle ne fait pas signe.',
    ),
    choices: [
      { label: 'Monter. C\'est confirmé. Tout le monde le dit.', kind: 'comply', do: (G) => { G.flag('via_lind_morning'); G.end('crew'); } },
      { label: 'Partir dans l\'autre sens. Vers BSÍ. Ne pas se retourner.', whyNot: 'Il vous regarde.', dreadMax: 85, time: 12, do: (G) => { G.nerves(8); G.dread(4); G.note('Vous avez marché. Personne ne vous a arrêté. Derrière vous, le car est resté là où il était, porte ouverte, pendant longtemps, et puis la rue n\'a plus été qu\'une rue, et vous étiez dessus, seul, avec une direction.'); }, next: 'lind_buses' },
    ],
  };

  scenes.lind_buses = {
    art: 'bsi',
    loc: 'Reykjavík · Gare routière BSÍ · matin',
    enter: (G) => { REVISE(G); G.flag('left_hotel'); G.dread(2); if (G.t < T(1, 8, 0)) G.S.t = T(1, 8, 0); },
    text: (G) => p(
      'BSÍ en plein jour est une gare routière : un kiosque qui vend des tickets et de la cannelle, un tableau qui fonctionne, des routards qui savent où ils vont. Vous pourriez être l\'un d\'eux. Vous portez l\'avion sur vous.',
      G.has('know_flybus') ? 'Le kiosque vous vend un ticket du premier coup. La carte commence à s\'y habituer.' : 'Vous n\'avez pas de ticket. Vous n\'êtes pas sûr lequel de ceux-là en exige un.',
      'Dehors : des bus. Aucun ne porte votre numéro de vol, sauf celui qui le porte, en lettres d\'or.',
      G.has('know_flybus') && W(LX('“The yellow one. Not the other one.”')),
    ),
    buses: (G) => {
      const flybus = {
        key: 'city',
        art: { livery: '#cfae36', windows: 'dim', passengers: 'luggage', sign: 'print', driver: 'plain', ground: 'day' },
        name: 'Un bus jaune aux couleurs de la ville',
        sign: 'FLYBUS · KEF AIRPORT', signStyle: 'print',
        look: ['Chauffeur, blasé, qui scanne des tickets sur des téléphones.', 'Des passagers avec des sacs à dos et des valises à roulettes, et un sans rien du tout, dans la chemise d\'hier, qui vous salue d\'un signe de tête.'],
        hidden: ['Un autocollant près de la porte : TICKET OBLIGATOIRE. Le chauffeur ne plaisante pas.', 'Personne à bord n\'attend quoi que ce soit. Ils vont à l\'aéroport, ce qui est toute l\'idée.'],
        boardLabel: G.has('know_flybus') ? 'Monter' : 'Monter sans ticket',
        board: { time: 10, do: (G) => { G.flag('bus2_ok'); if (!G.has('know_flybus')) { G.nerves(6); G.S.t += 20; G.note('Le chauffeur désigne le kiosque sans lever les yeux. Vous achetez un ticket. Vous courez. Il attend, à peine.'); } }, next: 'ride3' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'day' },
        name: 'Un car bleu marine avec un écusson doré, sur le quai du fond, comme s\'il n\'était jamais parti',
        sign: 'AIRPORT TRANSFER · ALBION ATLANTIC', signStyle: 'led',
        look: [G.has('seen') ? 'Le chef de cabine à la porte. Il sait laquelle était votre fenêtre.' : 'Le chef de cabine à la porte. Il regarde le bâtiment comme s\'il savait laquelle était votre fenêtre.', 'Chaud. Silencieux. Plein de place.'],
        hidden: ['Personne à bord n\'a l\'air d\'avoir dormi habillé. Personne n\'a l\'air d\'avoir dormi.', 'Personne à bord n\'a son téléphone à la main.'],
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const lagoon = {
        key: 'lagoon',
        art: { livery: '#3e9c9a', windows: 'cold', passengers: 'few', sign: 'print', driver: 'plain', ground: 'day' },
        name: 'Un minibus turquoise',
        sign: 'BLUE LAGOON SHUTTLE — Relax. You deserve it.', signStyle: 'print',
        look: ['Le chauffeur tient une pile de serviettes blanches.', 'Ça sent le soufre et l\'eucalyptus.'],
        hidden: ['Tout le monde à bord a des chaussettes propres.', 'Il part dans deux minutes. Il part toujours dans deux minutes.'],
        board: { time: 30, next: 'springs' },
      };
      return G.shuffle([flybus, crest, lagoon]);
    },
    choices: [
      { label: 'Attendre le suivant. Il y a toujours un suivant.', kind: 'comply', dd: 5, nd: 4, time: 60, next: (G) => (G.t >= T(1, 12, 30) ? 'end:left' : 'lind_buses'), do: (G) => { G.nerves(5); G.dread(4); if (G.t + 60 >= T(1, 12, 30)) G.flag('via_noshow'); } },
    ],
  };

  scenes.ride3 = {
    art: 'road',
    loc: 'Route 41 · vers Keflavík',
    enter: (G) => { REVISE(G);
      G.at(T(1, 13, 10), 'chat', { body: 'Vous n\'étiez pas à votre hébergement. Pourquoi êtes-vous dans une queue ? 🙂' });
    },
    text: (G) => p(
      'Un ticket, un siège, un bus qui va là où il dit. L\'homme à la chemise d\'hier s\'assoit de l\'autre côté de l\'allée et ne dit rien, et puis, au bout de vingt minutes : ' + V('« Ceux de jeudi. Hraun. J\'ai pris le Flybus. Tous les autres attendent le transfert. »') + ' Il regarde par la vitre. ' + V('« Je n\'arrête pas de me dire que j\'aurais dû attendre. »'),
      'L\'Islande défile : de la lave, une excellente eau du robinet, des gens raisonnablement aimables qui ne vous menacent pas et ne vous mentent pas. Le chauffeur ne vérifie le nom de personne. On doit ça à l\'Islande. Keflavík est innocent.',
    ),
    choices: [{ label: 'Arriver.', time: 45, do: (G) => { G.nerves(-4); G.collect(1); }, next: 'airport' }],
  };

  /* ================================================================ the springs
     Warm water, grey sky, twenty minutes from the airport. Every dip takes the
     nerves down and the dread up. You can get out while the dread is low; the
     shuttle runs until check-in closes; after that the only way out is LAZARUS. */
  const SPRINGS_AMB = [
    { d: 0, t: 'De la vapeur. Un ciel gris. Quelqu\'un qui rit, quelque part dans le blanc, puis plus rien.' },
    { d: 1, t: 'Un couple aux serviettes propres et aux chaussettes propres, qui se sèche en parlant d\'un glacier qu\'ils verront demain.' },
    { d: 2, t: 'L\'eau a la couleur d\'une bouteille de lait et la température exacte de n\'avoir à penser à rien.' },
    { d: 2, t: 'Une navette arrive, et certains sortent de l\'eau pour elle, lentement, et d\'autres non.' },
    { d: 3, t: 'L\'homme à deux mètres regarde la même nappe de vapeur depuis longtemps. Il a un joli sourire. Il ne s\'en est servi sur personne.' },
    { d: 3, t: 'Personne dans l\'eau n\'a de téléphone à la main. Personne dans l\'eau n\'a de téléphone.' },
    { d: 4, t: 'Une femme passe en flottant sur le dos, les yeux ouverts. Elle est ici depuis mardi, dit-elle, gaiement, quand vous croisez son regard. Elle ne dit pas quel mardi.' },
    { d: 4, t: 'La navette vient et repart. Personne n\'est sorti pour elle. Le chauffeur ne semblait attendre personne.' },
    { d: 5, t: 'Vous ne vous rappelez plus, un instant, à quoi servait l\'aéroport.' },
    { d: 5, t: 'La vapeur s\'écarte et de l\'autre côté de l\'eau il y a un homme en uniforme bleu marine, dans l\'eau jusqu\'à la poitrine, les mains croisées à la surface. Il ne vous regarde pas. Il regarde le ciel, comme vous.' },
  ];
  scenes.springs = {
    art: 'lagoon',
    loc: 'Les sources chaudes · à vingt minutes de l\'aéroport',
    enter: (G) => { REVISE(G);
      G.flag('at_springs'); G.S.t = Math.max(G.t, T(1, 9, 30));
      if (G.once('springs_intro')) G.note(p(G.last(), 'Un parking, une passerelle en bois, un vestiaire qui sent le soufre et l\'eucalyptus, une serviette qui coûte plus cher que les chaussettes. Puis l\'eau : pâle, chaude, immense, fumant vers un ciel gris, de la lave sur ses bords et des gens dedans, très immobiles, comme on se tient dans une eau qu\'on ne veut pas quitter.'));
      if (G.t >= G.S.dep - 60 && !G.has('springs_late')) { G.flag('springs_late'); G.note(p(G.last(), G.has('in_water') ? 'Une navette part sans vous. Vous la regardez partir, depuis l\'eau, et comprenez, depuis l\'eau, que c\'était celle qui comptait.' : 'Une navette part sans vous. Vous la regardez partir, depuis la passerelle, chaussures aux pieds, et comprenez que c\'était celle qui comptait.')); }
      // the flight itself leaving, with you still in the water, is the decision made for you
      if (G.t >= G.S.dep && G.has('in_water')) { G.flag('via_stayed'); G.flag('via_flightgone'); G.end('lazarus'); return; }
    },
    text: (G) => p(
      `Les sources. ${G.clock(G.t)}. ${G.t >= G.S.dep - 60 ? 'L\'enregistrement du vol AB 0271 est clos.' : `L'enregistrement ferme à ${G.clock(G.S.dep - 60)}. La navette passe toutes les demi-heures.`}${G.has('in_water') ? ' Vous êtes dans l\'eau.' : ''}`,
      G.last(), G.amb('springs', SPRINGS_AMB), NUDGE(G)),
    choices: (G) => [
      { label: G.has('in_water') ? 'Rester encore un peu.' : 'Monter.', kind: 'comply', dd: 6, time: 20, do: (G) => { const n = G.count('dip'); G.flag('in_water'); G.nerves(n === 1 ? -12 : -7); G.dread(n === 1 ? 4 : 7); G.note(n === 1 ? 'Trente-huit degrés. Chaque muscle que vous possédez lâche quelque chose qu\'il retenait depuis Heathrow. Vous émettez un son. Personne ne s\'en formalise. Personne n\'écoute.' : n === 2 ? 'Plus longtemps. Le ciel ne fait rien. La vapeur se referme et s\'ouvre. Vos doigts sont ceux d\'une personne bien plus âgée, et vous les regardez avec intérêt, et pas grand-chose d\'autre.' : 'Vous restez. C\'est plus facile que l\'alternative, qui est un mot que vous n\'arrivez pas tout à fait à retrouver.'); if (G.S.dread >= 88) { G.flag('via_stayed'); G.end('lazarus'); } }, next: 'springs' },
      { label: 'Flotter. Fermer les yeux.', kind: 'comply', if: (G) => G.has('in_water'), dd: 8, time: 25, do: (G) => { G.nerves(-8); G.dread(8); G.note(G.D >= 4 ? 'Vous flottez. Les yeux fermés, l\'eau n\'a plus de bords, et vous non plus, au bout d\'un moment. Quelque chose est dit, près de vous, avec la voix distinguée, et ce n\'est pas à vous que c\'est dit, et c\'est très bien ainsi.' : 'Vous flottez. Vos oreilles passent sous l\'eau et le monde devient un bourdonnement, et le bourdonnement n\'est pas celui de la compagnie, et c\'est la meilleure chose que vous ayez entendue depuis deux jours.'); if (G.S.dread >= 85) { G.flag('via_floated'); G.end('lazarus'); } }, next: 'springs' },
      { label: 'Un verre au bar dans l\'eau.', nd: -4, dd: 3, time: 10, once: 'swimbar', do: (G) => { G.nerves(-4); G.dread(3); G.note('Quelque chose de bleu, dans un gobelet en plastique, bu debout dans l\'eau chaude sous un ciel froid. Ça coûte le prix d\'un taxi. Vous le tenez à deux mains, ce qui semble être ce que vous faites, maintenant.'); }, next: 'springs' },
      { label: 'Regarder les autres baigneurs.', time: 6, do: (G) => { const d = G.D; G.dread(2); G.note(d >= 4 ? 'Ils sont pâles, et immobiles, et souriants, et aucun d\'eux ne regarde quoi que ce soit. Un homme en chemise propre, allez savoir comment, dans l\'eau. Une femme avec le col d\'un chemisier au-dessus de la surface. Vous n\'en reconnaissez aucun, et tous vous font un signe de tête comme s\'ils vous reconnaissaient.' : d >= 2 ? 'Des touristes. Des couples. Quelqu\'un qui photographie rien. Quelques personnes qui, comme vous, portent l\'eau à la place de leurs vêtements, et ont le même regard.' : 'Des touristes, surtout, heureux les uns envers les autres. Vous les regardez comme vous regarderiez un film sur des vacances.'); }, next: 'springs' },
      { label: !G.has('in_water') ? (G.t >= G.S.dep - 60 ? 'S\'en aller. La dernière navette est partie, mais s\'en aller.' : 'S\'en aller. Trouver la navette pour l\'aéroport.') : G.t >= G.S.dep - 60 ? 'Sortir. La dernière navette est partie, mais sortir.' : 'Sortir. Trouver la navette pour l\'aéroport.', gate: (G) => (G.has('in_water') && G.S.dread > 72 ? 'Vous ne pouvez pas sortir. L\'eau est chaude, et vous êtes très fatigué, et personne ne vous l\'a demandé.' : null), nd: 4, time: 40, do: (G) => { if (G.t >= G.S.dep - 60) { G.flag('via_springs'); G.end('left'); } else { G.flag('left_hotel'); G.nerves(6); G.dread(-6); G.note(G.has('in_water') ? 'Dehors. Froid, instantanément, et vivant. La serviette, les vêtements, la tenue d\'avion remise sur une peau qui sent l\'œuf. La navette est jaune, avec une machine à tickets et un chauffeur qui ne connaît pas votre nom, et vous n\'avez jamais aimé personne autant.' : 'Vous n\'êtes jamais entré dans l\'eau. Vous êtes resté au bord, dans vos vêtements d\'avion, à regarder la vapeur, puis vous avez refait le chemin par la passerelle en bois jusqu\'au parking, où la navette est jaune, avec une machine à tickets et un chauffeur qui ne connaît pas votre nom.'); } }, next: (G) => (G.t >= G.S.dep - 60 ? 'springs' : 'airport') },
    ],
  };

  /* ================================================================ LEFT BEHIND, played out
     Three complaints noted, and a uniform acts on it. You get to argue, once,
     if you are the kind of person who still can: calm, and not yet obedient. */
  scenes.left_behind = {
    art: 'airport',
    loc: (G) => (G.has('lb_gate') ? 'Keflavík · Porte 12' : G.has('lb_escort') ? 'Keflavík · Départs · près de l\'unique comptoir' : 'Keflavík · L\'unique comptoir'),
    enter: (G) => { G.dread(4); },
    text: (G) => p(
      G.last(),
      G.has('lb_escort') ? 'Deux personnes en noir avec des radios sont arrivées à votre coude sans avoir eu l\'air de marcher jusque-là. L\'homme en uniforme a une petite carte. Il n\'a pas besoin de la regarder.' : G.has('lb_gate') ? 'L\'agente de porte repose le micro. Un homme en uniforme bleu marine est apparu à côté d\'elle, une petite carte à la main, et il n\'a pas besoin de la regarder.' : 'L\'agent cesse de taper. Il retourne une petite carte sur le comptoir, la lit, et n\'en a pas besoin.',
      V('« Nous avons noté votre feedback, »') + ' dit-il, et il s\'avère que oui : tout y est, d\'une écriture soignée. Elle porte trois coches.',
      V('« Comme indiqué à bord, les clients qui résistent ou font objection aux décisions opérationnelles peuvent être débarqués. Votre réservation a été accommodée. »') + ' Il dit cela sans la moindre méchanceté.',
      'Il n\'a pas fini. Il attend de voir ce que vous allez faire.',
    ),
    choices: (G) => [
      { label: 'Plaider votre cause. Calmement, et dans son intégralité.', whyNotN: 'Vous ne resteriez pas calme au-delà de la première phrase.', whyNotD: 'On ne discute pas avec un uniforme. Plus maintenant.', nerveMax: 70, dreadMax: 65, nd: -4, time: 8, do: (G) => { G.flag('argued'); G.S.strikes = 2; G.collect(1); G.note('Vous le dites. Tout, dans l\'ordre, de la voix que vous prendriez avec un collègue : le déroutement, l\'hôtel à Hounslow, les cars que personne n\'a annoncés, les coups à la porte, l\'imprimé qui avait raison. Vous n\'élevez pas la voix une seule fois. Derrière vous, quelqu\'un dit ' + V('« Elle a raison, »') + ' et quelqu\'un d\'autre dit ' + V('« Il a raison. »') + ' L\'uniforme écoute jusqu\'au bout. Puis il tire un trait, très proprement, sur l\'une des coches. ' + V('« Deux, »') + ' dit-il. ' + V('« Je voudrais m\'arrêter là. »')); }, next: (G) => (G.has('lb_gate') ? (G.has('standoff') ? (G.flag('won_home'), G.flag('via_desk'), 'jetbridge') : 'standoff') : 'gate') },
      { label: 'Plaider votre cause. Fort. Dans son intégralité.', kind: 'conflict', nd: 8, time: 6, do: (G) => { G.flag('shouted_lb'); G.note('Vous le dites. Tout, pas dans l\'ordre, et pas doucement, et une partie concerne sa mère. Les gens se retournent. Personne ne dit que vous avez raison. L\'uniforme attend que vous ayez fini, et vous finissez, à la longue, parce qu\'il ne reste plus rien, et il dit ' + V('« Merci, »') + ' et fait une quatrième marque, qui n\'était pas nécessaire, et qu\'il fait quand même.'); }, next: 'offloaded' },
      { label: 'L\'accepter.', kind: 'comply', dd: 8, time: 4, do: (G) => { G.flag('accepted_lb'); G.note('Vous l\'acceptez. Vous vous entendez l\'accepter, d\'une voix qui ressemble à celle de quelqu\'un de raisonnable. L\'uniforme hoche la tête, comme si vous aviez réussi une épreuve.'); }, next: 'offloaded' },
    ],
  };

  scenes.offloaded = {
    art: 'airport',
    loc: 'Keflavík · Côté ville · Arrivées',
    enter: (G) => { REVISE(G);
      G.flag('offloaded_now'); G.dread(6);
      if (G.once('off_intro')) G.note(p(G.last(), 'Ils vous escortent, un de chaque côté, sans vous toucher, par une porte dont vous ignoriez que c\'était une porte, le long d\'un couloir sans fenêtres, et dehors par les portes qui disent ARRIVALS ONLY, qui s\'ouvrent pour eux. Puis ils repassent de l\'autre côté, et les portes se referment, et vous êtes du mauvais côté, dans le hall où vous êtes arrivé, qui est vide, et éclairé comme l\'intérieur d\'un frigo.'));
    },
    text: (G) => p(`Arrivées. ${G.clock(G.t)}. Le tableau des départs, à travers la vitre, dit AB 0271 · LOS ANGELES · ${G.clock(G.S.dep)}.`, G.last(), G.amb('offloaded', AMB.hall), NUDGE(G)),
    choices: (G) => [
      { label: 'Essayer les portes.', time: 3, once: 'off_doors', do: (G) => { G.nerves(4); G.note('Elles ne s\'ouvrent pas pour vous. Un homme en gilet fluo, de l\'autre côté, vous regarde à travers la vitre et secoue la tête, lentement, une fois, et retourne à ce qu\'il faisait, c\'est-à-dire rien.'); }, next: 'offloaded' },
      { label: 'Demander à l\'homme en gilet fluo ce que vous êtes censé faire maintenant.', nd: -2, time: 5, once: 'off_ask', do: (G) => { G.note('Il vient jusqu\'à la vitre, ce qui est gentil de sa part. ' + V(LX('“Your airline has to rebook you. Landside, there is a desk. It opens at six.”')) + ' Vous demandez quel comptoir. Il regarde l\'écusson sur le panneau derrière lui, puis vous, et ne dit rien, ce qui est une réponse.'); }, next: 'offloaded' },
      { label: 'Chercher les autres à travers la vitre.', time: 4, once: 'off_look', do: (G) => { G.dread(4); G.note('La file est toujours là. La polaire. Le bambin, endormi sur une épaule. L\'homme du 31C, qui lève les yeux, vous voit, et les baisse. Personne ne fait signe. Ce n\'est pas qu\'ils ne veulent pas. C\'est qu\'ils ont été notés eux aussi, une fois chacun, et qu\'ils savent maintenant à quoi ressemble deux.'); }, next: 'offloaded' },
      { label: 'Appeler Jo.', if: (G) => G.dead(), dd: 2, time: 1, do: (G) => { G.note('Vous sortez le téléphone pour appeler Jo, et vous vous souvenez, et vous le rangez. Il y a une cabine téléphonique près des portes. Elle prend des cartes que vous n\'avez pas.'); }, next: 'offloaded' },
      { label: 'Appeler Jo.', if: (G) => !G.dead(), time: 5, once: 'off_jo', do: (G) => { G.batt(-2); G.nerves(-3); G.note('Messagerie. C\'est le milieu de la nuit à Los Angeles. Vous dites que vous allez bien. Vous dites que l\'Islande est magnifique. Vous dites que vous expliquerez. Vous n\'êtes pas sûr de le faire.'); }, next: 'offloaded' },
      { label: 'S\'asseoir par terre, près des portes, et attendre six heures.', kind: 'comply', dd: 6, time: 20, do: (G) => { G.flag('via_offloaded'); G.end('left'); } },
    ],
  };

  /* ================================================================ endings */
  const endings = {
    crew: {
      art: 'stand', title: 'L\'ÉQUIPAGE', kind: 'bad',
      hint: 'Il avait un écusson. Il était très beau.', blurb: 'Vous les avez suivis : le car, la voiture, les coups à la porte, le transfert. C\'était le même véhicule à chaque fois.',
      text: (G) => p(
        G.has('via_car') ? 'La voiture est chaude et les sièges sont en cuir et le chauffeur ne parle pas. L\'écran du tableau de bord dit HÓTEL HRAUN · –– km · ARRIVÉE –:–. Au bout d\'un moment vous n\'entendez plus aucune route sous les pneus. Seulement les pneus.'
          : G.has('via_knock') ? 'Vous suivez la voix, parce que c\'est la seule instruction qu\'on vous ait donnée de toute la nuit qui soit venue avec une heure, et parce qu\'ils connaissaient la chambre. Le car attend, lumières intérieures allumées, et l\'homme en bleu marine s\'écarte sans vous regarder, et dit ' + V('« Départ maintenant »,') + ' à personne.'
          : G.has('via_walk') ? 'Il fait chaud dans le car, et les sièges sont tournés vers l\'intérieur, ce que vous n\'aviez pas remarqué avant de vous asseoir. Le 10-11 défile à gauche, toutes lumières allumées et personne dedans. Vous n\'aurez jamais votre dentifrice.'
          : G.has('via_terminal') ? 'Les cars qui ont été organisés pour vous attendent au fond du hall vide, là où une porte qui ne disait rien était ouverte. Il n\'y en a qu\'un, il porte un écusson, et tous ceux qui sont dedans vous attendaient, vous précisément.'
          : G.has('via_lind_morning') ? 'Les passagers de mardi gravissent les marches devant vous et s\'assoient, face à la pension, immobiles. La réceptionniste se tient sur le seuil, le livre de poche contre la poitrine, et ne fait pas signe. Elle a déjà vu ça. Elle sortira le skyr demain.'
          : 'Le car sent la sellerie neuve et rien d\'autre. Le chef de cabine referme la porte derrière vous avec un bruit doux et luxueux.',
        'Tout le monde à bord se tourne pour vous regarder passer, tous en même temps, comme un champ se tourne dans le vent, et sourit, tous en même temps, et se retourne. Personne ne porte les vêtements de la veille, parce que personne ici n\'a de veille. Personne n\'a de téléphone à la main. Personne n\'a de téléphone. L\'homme assis à côté de votre place regarde déjà devant lui, les mains sur les genoux, et quand vous vous asseyez il dit, aimablement, sans se tourner, ' + V('« Nous avons été dits que vous veniez. »'),
        V('« La majorité de nos clients ont été compréhensifs et patients, »') + ' dit le chef de cabine, depuis l\'avant, et c\'est de vous qu\'il parle. Vous avez été compréhensif. Vous avez été très patient.',
        'Le car quitte la lumière. Les vitres deviennent noires comme le deviennent des vitres quand il n\'y a rien derrière : pas la nuit, qui a des lampadaires et une route, mais un noir dans lequel les phares n\'entrent pas. L\'homme à côté de vous sourit toujours. Vous sentez que vous commencez à sourire aussi.',
      ),
    },
    left: {
      art: 'airport', title: 'RESTÉ À QUAI', kind: 'bad',
      hint: 'Il l\'avait bien dit.', blurb: 'Le vol est parti. Pas vous. Les dossiers disent que vous avez été hébergé.',
      text: (G) => p(
        G.has('via_gate_quiet') ? 'Les chemises propres ont embarqué. La porte s\'est fermée. À travers la vitre, l\'avion a reculé, hublots allumés, et dans les hublots, en rangs, il y avait des gens en chemise propre tournés vers l\'avant, et dans la salle d\'embarquement il y avait cent personnes dans les vêtements de la veille qui n\'avaient rien dit, et qui maintenant disaient beaucoup, entre elles, trop tard.'
          : G.has('via_gate_escort') ? 'Ils vous emmènent côté ville, un de chaque côté, sans vous toucher. À travers la vitre, derrière vous, les chemises propres embarquent. Personne ne vous suit. Personne n\'allait jamais le faire : vous ne leur aviez pas donné de raison de connaître votre nom.'
          : G.has('via_gate_later') ? 'Le service ultérieur est annoncé à six heures. C\'est le service de demain, qui est le même service, qui arrive à une heure du matin avec deux cents personnes sans manteau à bord.'
          : G.has('via_pastures') ? 'Le bus s\'arrête ; c\'est ce que vous vouliez. La porte s\'ouvre sur un bas-côté, une clôture, des moutons, et un vent qui vient de loin, à votre rencontre. ' + V('« Comme vous voudrez »,') + ' dit le chauffeur, et le bus repart sans vous, vers quelque chose qui pourrait, à cette distance, être un avion. Vous marchez. Il n\'y a rien vers quoi marcher sur une très longue distance.'
          : G.has('via_noshow') ? (G.has('lind') ? 'À midi et demi, quatre bus jaunes sont venus et repartis, portes ouvertes, et celui du quai du fond n\'a pas bougé. L\'homme à sa porte regarde sa montre, ce dont il n\'avait pas besoin. ' + V('« Passagers de vol ? »') + ' dit-il, aimablement. ' + V('« Ils ont parti. »') : 'À 11h30, le panneau a disparu. La réception ne se souvient pas de l\'avoir affiché. ' + V(LX('“Are you with the airline group? They\'ve gone.”')) + ' Elle le dit gentiment. Elle l\'a déjà dit.')
          : G.has('via_springs') ? 'La navette qui comptait est partie pendant que vous étiez dans l\'eau. Vous êtes debout sur le parking dans la tenue d\'avion, sentant l\'œuf, et vous regardez le ciel là où serait l\'avion si vous pouviez le voir, et vous ne pouvez pas le voir.'
          : 'Six heures. Un comptoir ouvre, côté ville, avec un écusson dessus, et derrière, une femme qui vous sourit, à vous précisément. ' + V('« Vous avez été hébergé, »') + ' dit-elle, en regardant un écran que vous ne pouvez pas voir. ' + V('« Nos enregistrements le montrent. Nous pouvons vous re-réserver sur le service de demain. »') + ' Vous demandez quel hôtel. Elle vous le dit. Vous n\'en avez jamais entendu parler. Si.',
        'Voici ce que disent les dossiers, et ce que disent les dossiers est ce qui s\'est passé : votre vol AB 0271 est parti à l\'heure, avec à son bord ses clients compréhensifs et patients. Vous avez été hébergé. Une voiture attendait. Des cars ont été organisés. Un membre du personnel a frappé. Votre avis a été noté. La compagnie a fait de son mieux.',
        'Demain à une heure du matin, le même vol arrivera, avec deux cents personnes sans manteau à son bord, et un chef de cabine qui regarde les visages. Demain il y aura un hôtel, et des coups à la porte, et un car pour ceux qui ont été patients. Vous savez dans quel car vous serez. Vous savez, maintenant, comment être patient.',
      ),
    },
    lazarus: {
      art: 'lagoon', title: 'LAZARUS', kind: 'bad',
      hint: 'Vous avez toujours voulu visiter l\'Islande.', blurb: 'Vous êtes resté dans l\'eau.',
      text: (G) => p(
        G.has('via_flightgone') ? 'À un moment, pendant que vous regardiez les autres baigneurs, votre vol est parti. Vous n\'avez rien décidé. C\'est ainsi que ça s\'est décidé : l\'eau était chaude, et vous regardiez, et le ciel ne faisait rien, et la vapeur se refermait et s\'ouvrait, et puis il était plus tard que l\'heure de départ, et puis ce n\'était plus une question.'
          : 'Vous décidez, quelque part dans la chaleur, que vous ne sortirez pas. Ce n\'est pas une décision comme l\'étaient les autres – le bus, la porte, le mail. C\'est plutôt comme remarquer quelque chose qui était déjà vrai. Le ciel ne fait rien. La vapeur se referme et s\'ouvre.',
        'À 11:00, un bus quitte le parking d\'un hôtel à trente kilomètres de là sans vous. À 11:04, un mail arrive, sur un téléphone dans un casier, pour dire que votre transfert est parti à 09:00. À 11:05, le chatbot demande si vous avez apprécié votre séjour. Vous n\'entendez rien de tout cela. Vous ne tenez rien. Pour la première fois depuis deux jours, vous ne tenez rien.',
        'La femme qui est ici depuis mardi passe en flottant sur le dos et sourit, et vous souriez, et il y a un homme en bleu marine de l\'autre côté de l\'eau, les mains croisées à la surface, qui regarde le ciel, et il ne vous regarde pas, et il n\'en a pas besoin. Demain la navette viendra et certains sortiront pour elle, et vous les regarderez partir, depuis l\'eau, sans parvenir à vous rappeler pour quoi.',
      ),
    },
    lift: {
      art: 'corridor', title: 'L\'ASCENSEUR', kind: 'bad',
      hint: 'Hors service, en Arial.', blurb: 'Vous êtes entré dans l\'ascenseur qui est arrivé tout seul.',
      text: (G) => p(
        G.has('toothpaste') ? 'Les portes se ferment avec la courtoisie d\'un bon hôtel. Le miroir du fond vous montre : les vêtements d\'avion, le visage, le petit sac du 10-11 serré contre la poitrine. L\'ascenseur descend. Il descend plus longtemps que le bâtiment n\'a d\'étages.' : 'Les portes se ferment avec la courtoisie d\'un bon hôtel. Le miroir du fond vous montre : les vêtements d\'avion, le visage, les mains vides. L\'ascenseur descend. Il descend plus longtemps que le bâtiment n\'a d\'étages.',
        'Les chiffres au-dessus de la porte font 2, 1, 0, puis cessent d\'être des chiffres. L\'ascenseur ne s\'arrête pas. Il y a de la musique, au bout d\'un moment, du genre qu\'on vous passe quand vous êtes en attente, puis une voix, chaleureuse, distinguée, extraordinairement patiente : ' + V('« Merci pour votre patience. La majorité de nos clients ont été compréhensifs. »'),
        'Quand les portes s\'ouvrent, c\'est sur une lumière chaude et des rangées de sièges, et tous ceux qui y sont assis se tournent vers vous, et sourient, et le chef de cabine dit : ' + V('« Merci pour votre patience, »') + ' et le pense, et les portes se referment derrière vous avec la courtoisie d\'un bon hôtel.',
      ),
    },
    home: {
      art: 'plane', title: 'CHEZ VOUS (OU AU GROENLAND, OU EN ENFER)', kind: 'good',
      hint: 'Vous êtes allé au comptoir vous-même.', blurb: 'Vous y êtes arrivé. Seul, pour l\'essentiel.',
      text: (G) => p(
        'Vous êtes dans un siège. Le siège est dans un avion. L\'avion se déplace, pour autant que vous puissiez en juger, en direction de Los Angeles. Les rangs un à vingt sont des chemises propres, tournées vers l\'avant. Vous êtes au 31B, qui est à vous, parce que vous l\'avez demandé calmement et qu\'elle vous l\'a donné, et vous ne vous êtes pas retourné vers la porte en le prenant.',
        'Personne en uniforme n\'a jamais dit pardon. Le remboursement du wifi n\'a toujours pas été réclamé. L\'homme du 31C est trois rangs derrière, et vous ne lui avez pas dit au revoir, et lui non plus, et ça va. Vous ne savez pas combien des autres sont montés. Vous n\'avez pas compté.',
        'Rendez-vous à Los Angeles dans dix heures. Ou au Groenland. Ou en enfer.',
      ),
    },
    collective: {
      art: 'plane', title: 'LE COLLECTIF AUTOGÉRÉ DE LHR–LAX', kind: 'good',
      hint: 'Le ouï-dire n\'est pas un canal officiel.', blurb: 'Vous y êtes arrivé, et tous ceux à qui vous avez parlé aussi.',
      text: (G) => p(
        (G.has('via_protected') ? 'Sur l\'escalier, la polaire dit ' + V('« Karen »,') + ' encore, et la mère rit, puis tout le monde, et la pluie n\'a plus d\'importance. Ils se sont mis devant vous. Vous ne l\'oublierez pas, et on ne vous laissera pas l\'oublier : le petit connaît votre nom, maintenant. ' : 'Sur l\'escalier, quelqu\'un dit ' + V('« Comptez-nous »,') + ' encore, et c\'est drôle maintenant, et tout le monde rit, et la pluie n\'a plus d\'importance. Personne n\'a crié. Cent personnes ont dit quatre choses vraies d\'une voix ordinaire jusqu\'à ce que le micro soit reposé. ') + 'Vous voyagez ensemble depuis plus d\'une journée. ' + (G.has('uk261') ? 'Vous avez un QR code, un homme en polaire, ' : 'Vous avez un homme en polaire, ') + (G.has('met31c') || G.has('ally31c') ? 'un homme du 31C, ' : '') + 'et un enfant qui a vu des choses.',
        'La seule information qui valait quelque chose, dans toute cette affaire, est venue d\'un imprimé en Arial et d\'inconnus se repassant des ouï-dire. Personne en uniforme n\'a jamais dit pardon. Il s\'avère que vous n\'en aviez pas besoin.',
        'Rendez-vous à Los Angeles. Au nom du collectif autonome LHR–LAX, vous souhaitez bonne chance au client de la cabine avant – soi-disant en soins intensifs, d\'après le cousin de quelqu\'un à la compagnie, et personne ne sait trop quel crédit accorder à ça.',
      ),
    },
  };

  /* ================================================================ interface strings */
  const ui = {
    tabMail: 'Mails', tabAlly: 'Ally', tabSms: 'SMS', tabPaper: 'Papier', phone: 'TÉLÉPHONE',
    nerves: 'NERFS', dread: 'EFFROI', noted: 'NOTÉ', day: 'JOUR',
    board: 'Monter', look: 'Regarder de plus près', lookHint: 'Coûte quelques minutes.',
    businessNote: 'Les clients Classe Affaires sont confiés de trouver leur propre chemin.',
    again: 'Reprendre l\'avion', endings: 'Fins', back: 'Retour', howto: 'Comment ça marche', start: 'Monter', design: 'Notes de conception',
    gameOver: 'GAME OVER', madeIt: 'VOUS Y ÊTES ARRIVÉ – PLUS OU MOINS',
    subtitle: 'UNE HORREUR HÔTELIÈRE · TEXTE · 20–30 MINUTES',
    galleryIntro: 'Toutes les manières dont ça peut finir. Les verrouillées sont toujours là, quelque part.', locked: '???',
    noMail: 'Pas de mail.', noSms: 'Pas de messages.', noPaper: 'Photos des panneaux imprimés que vous trouvez. Vous en trouverez.',
    allyIntro: 'Ally – assistante virtuelle Albion Atlantic. Répond généralement instantanément.', inbox: '‹ Boîte de réception',
    emailFoot: 'Ceci est un message automatique. Les réponses à cette adresse ne sont ni surveillées, ni lues, ni possibles. Albion Atlantic – Nous faisons de notre mieux.',
    from: 'De :', sent: 'Envoyé', received: 'Reçu', arrived: 'arrivé', photographed: 'Photographié',
    tMail: 'MAIL', tSms: 'SMS', tPaper: 'PAPIER', tAlly: 'ALLY', tNoted: 'NOTÉ · La compagnie a enregistré votre feedback.',
    gateNerves: 'Vous n\'arriveriez pas à garder la voix ferme pour ça.', gateDread: 'Vous n\'arrivez pas à vous y résoudre.',
    tFlood: '{n} nouvelles notifications.', phoneDead: 'Pas de batterie',
  };

  return { start, scenes, endings, chat, ui, T, lang: 'fr', broken: CONTENT_BROKEN };
})();
