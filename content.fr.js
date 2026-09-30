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
  const atLeast = (G, v) => { if (G.S.dread < v) G.S.dread = v; }; // v in percent
  const hub = (G, status, key, extra) => p(status, G.last(), G.amb(key, AMB[key]), extra);
  const KNOCK_AT = T(1, 4, 30);

  const start = { scene: 'lane', t: T(0, 19, 20), nerves: 18, dread: 8, dep: T(1, 15, 10) };

  /* ================================================================ ambient pools */
  const AMB = {
    hall: [
      { d: 1, t: 'Une autolaveuse passe, lentement, conduite par quelqu\'un dont vous ne voyez jamais tout à fait le visage.' },
      { d: 1, t: 'Quelqu\'un a trouvé une prise de courant, et onze personnes se tiennent autour comme autour d\'un feu.' },
      { d: 1, t: 'Le tableau des arrivées ne dit rien de votre vol. Il ne dit rien d\'aucun vol.' },
      { d: 1, t: 'Un enfant dort sur un chariot à bagages. Il n\'y a pas de bagages.' },
      { d: 2, t: 'Il y a moins de gens dans le hall qu\'il n\'y en avait. Vous n\'avez vu personne partir.' },
      { d: 2, t: 'Le tube fluorescent au-dessus du comptoir des bagages s\'est mis à cliqueter.' },
      { d: 2, t: 'Toutes les quelques minutes, quelqu\'un se lève, marche jusqu\'aux portes, et revient.' },
      { d: 3, t: 'La porte STAFF est entrouverte, de la largeur d\'une main. Vous ne l\'avez pas vue s\'ouvrir.' },
      { d: 3, t: 'Pendant un instant, tous les téléphones du hall s\'allument en même temps, puis s\'éteignent tous.' },
      { d: 3, t: 'Quelqu\'un se tient devant les rideaux baissés du duty free, le dos tourné au hall. Il porte du bleu marine.' },
    ],
    room: [
      { d: 2, t: 'Le chauffage fait un bruit de quelqu\'un qui envisagerait de frapper.' },
      { d: 2, t: 'La bouilloire a une petite lumière. C\'est la seule chose dans la chambre qui soit de votre côté.' },
      { d: 2, t: 'Dans le couloir, quelqu\'un traîne une valise à roulettes qu\'il ne peut absolument pas avoir.' },
      { d: 2, t: 'Votre reflet dans la vitre noire porte les vêtements d\'hier. Tout le monde les porte.' },
      { d: 3, t: 'Une voiture passe sur la route, lentement, et ne tourne pas.' },
      { d: 3, t: 'À travers le mur, à côté, une télévision montre le même rien que la vôtre.' },
      { d: 3, t: 'La chambre est la 214. La carte dit 214. Vous n\'arrêtez pas de vérifier, comme si elle avait pu bouger.' },
      { d: 3, t: 'Dans le couloir, quelqu\'un s\'arrête devant votre porte, puis continue.' },
      { d: 4, t: 'La lumière sous la porte s\'éteint, puis revient, puis s\'éteint.' },
      { d: 4, t: 'Quelque part en dessous, un moteur tourne. Il tourne depuis un moment.' },
      { d: 4, t: 'Le téléphone s\'allume sur rien. Pas de message. Juste l\'écran, qui vous regarde.' },
      { d: 4, t: 'Vous entendez frapper, deux portes plus loin. Régulier, patient. Puis une porte plus loin.' },
      { d: 5, t: 'Il y a quelqu\'un sur le parking. Depuis un certain temps.' },
      { d: 5, t: 'Le rideau bouge. Aucune fenêtre n\'est ouverte.' },
      { d: 5, t: 'Le téléphone de la chambre sonne une fois et s\'arrête.' },
    ],
    corridor: [
      { d: 2, t: 'Une moquette couleur d\'ecchymose. Un chariot de serviettes garé tout au bout, abandonné en plein service.' },
      { d: 2, t: 'Chaque porte a un numéro. Chaque numéro a un trait de lumière en dessous.' },
      { d: 3, t: 'La machine à glaçons broie, s\'arrête, broie.' },
      { d: 3, t: 'La lumière au bout du couloir est éteinte. Elle était allumée.' },
      { d: 3, t: 'Quelqu\'un rit derrière une des portes, et s\'arrête à mi-chemin.' },
      { d: 4, t: 'La moquette devant la 216 est mouillée.' },
      { d: 4, t: 'Vous entendez l\'ascenseur se déplacer entre les étages. Personne ne l\'a appelé.' },
      { d: 4, t: 'La porte coupe-feu au bout est maintenue ouverte par une chaussure.' },
      { d: 5, t: 'Les portes le long du couloir sont ouvertes, l\'une après l\'autre, et les chambres derrière sont faites. Personne n\'y a jamais été.' },
      { d: 5, t: 'Tout au bout, quelqu\'un en bleu marine frappe à une porte, régulièrement, puis passe à la suivante.' },
    ],
    lobby: [
      { d: 2, t: 'La veilleuse de nuit fait des mots croisés dans une langue que vous ne connaissez pas. Elle n\'a rien rempli.' },
      { d: 2, t: 'Une affiche de tour-opérateur : GLACIERS · BALEINES · AURORES BORÉALES. Personne dans ce hall n\'en verra aucun.' },
      { d: 2, t: 'Deux passagers endormis assis sur le canapé, tenant leur téléphone comme des cierges.' },
      { d: 3, t: 'La lumière rouge de la machine à café clignote à un rythme qui est presque un mot.' },
      { d: 3, t: 'Les portes vitrées s\'ouvrent pour personne, et se referment.' },
      { d: 3, t: 'Le panneau imprimé a une nouvelle auréole d\'eau. Elle sèche en prenant une forme.' },
      { d: 4, t: 'Dehors, sur le parking : des phares, moteur au ralenti. Ils ne s\'éteignent pas.' },
      { d: 4, t: 'La veilleuse de nuit regarde derrière vous, vers les portes, puis retourne à ses mots croisés.' },
      { d: 4, t: 'Un des passagers endormis a disparu. Son téléphone est toujours sur le canapé, écran vers le haut, sur un mail.' },
      { d: 5, t: 'La réceptionniste dit, sans lever les yeux : « Il a demandé après vous. »' },
      { d: 5, t: 'Les portes s\'ouvrent. Air froid. Personne n\'entre. Elles restent ouvertes.' },
    ],
    carpark: [
      { d: 2, t: 'Du vent. Des champs de lave. Une route qui part d\'un côté dans le noir et de l\'autre dans un noir légèrement différent.' },
      { d: 2, t: 'L\'hôtel derrière vous est éclairé comme un aquarium.' },
      { d: 3, t: 'Du gravier. Un seul lampadaire. Une pluie qui n\'arrive pas à se décider.' },
      { d: 3, t: 'Une obscurité en forme de car, tout au bout du parking, moteur éteint. Ou allumé.' },
      { d: 4, t: 'Le car au bout du parking a ses lumières intérieures allumées. Tous les sièges sont pris.' },
      { d: 4, t: 'Quelqu\'un se tient à côté de la porte du car, très droit, les mains jointes.' },
      { d: 5, t: 'Il regarde l\'hôtel. Une seule fenêtre. Vous savez laquelle.' },
    ],
    morning: [
      { d: 2, t: 'On débarrasse le petit-déjeuner. Il n\'a jamais vraiment été servi.' },
      { d: 2, t: 'Quelqu\'un a aligné les mini-pots de confiture, par couleur.' },
      { d: 2, t: 'L\'enfant explique quelque chose d\'important à un radiateur.' },
      { d: 3, t: 'Il y a moins de monde au petit-déjeuner qu\'il n\'y en avait dans le hall hier soir. Des hôtels différents, dit tout le monde. Des hôtels différents.' },
      { d: 3, t: 'Un homme à la table voisine a reçu quatre mails avec quatre horaires différents. Il les lit à voix haute comme un bulletin météo.' },
      { d: 3, t: 'Dehors, à la lumière du jour, le parking ressemble à un parking. Il y a un car dedans.' },
      { d: 4, t: 'Plus personne ne parle. Tout le monde surveille les portes.' },
      { d: 4, t: 'La veilleuse de nuit est toujours là. Elle n\'a pas changé. Elle fait les mêmes mots croisés.' },
    ],
    airport: [
      { d: 3, t: 'Le tableau des départs se met à jour. Votre vol descend d\'une ligne. Rien ne monte.' },
      { d: 3, t: 'Une femme en tête de file est là depuis si longtemps qu\'elle a enlevé ses chaussures.' },
      { d: 3, t: 'L\'unique comptoir a une sonnette. Personne n\'appuie. Quelqu\'un appuie. Rien.' },
      { d: 4, t: 'Les portes vers l\'extérieur disent ARRIVÉES UNIQUEMENT. Elles n\'étaient pas verrouillées tout à l\'heure.' },
      { d: 4, t: 'La file est plus courte qu\'elle ne l\'était. Personne n\'a été servi.' },
      { d: 4, t: 'Un homme en uniforme bleu marine parcourt la file sur toute sa longueur, en comptant, puis repasse une porte.' },
      { d: 5, t: 'Les boutiques baissent leurs rideaux, une par une, dans l\'ordre, vers vous.' },
      { d: 5, t: 'Votre nom est appelé au haut-parleur. Puis non. Personne d\'autre ne l\'a entendu.' },
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
    if (d >= 5) return '\n\n' + G.pick(['Pourquoi êtes-vous encore là ?', 'La majorité des clients ont embarqué.', 'Nous voyons que vous êtes toujours là.']);
    if (d >= 3) return '\n\n' + G.pick(['Vous êtes toujours dans la chambre 214.', 'Veuillez rester où vous êtes.', 'Puis-je faire autre chose pour vous ? Il n\'y a rien d\'autre.']);
    return '';
  };
  const chat = [
    {
      label: 'Où est mon hôtel ?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Votre hébergement était l\'Hótel Hraun. Nous espérons que vous avez apprécié votre séjour ! Souhaitez-vous laisser un avis ?' + tail(G);
        if (G.has('at_hotel')) return 'Vous êtes à l\'Hótel Hraun, chambre 214. Veuillez rester dans votre chambre jusqu\'à ce qu\'on vienne vous chercher.' + tail(G);
        return 'Excellente question ! Votre hébergement a été réservé au Heathrow Renaissance Lodge, Bath Road. Un lien de réservation vous a été envoyé par mail. 🛏️';
      },
    },
    {
      label: 'Le bus est à quelle heure ?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Votre car vers l\'avion partira une fois l\'embarquement terminé. Veuillez embarquer par groupe. 🚌' + tail(G);
        if (G.has('morning')) return 'Votre transfert vers l\'aéroport est confirmé pour 08h00. Merci d\'être dans le hall 15 minutes à l\'avance.' + tail(G);
        if (G.has('at_hotel')) return 'Votre car part à 04h30. Un membre du personnel frappera à votre porte.' + tail(G);
        return 'Des cars ont été organisés pour tous les clients. Veuillez vous rendre aux cars. 🚌';
      },
    },
    {
      label: 'Que se passe-t-il ?',
      answer: (G) => G.pick([
        'Votre vol AB 0271 vers Los Angeles est à l\'heure. ✈️',
        'Je suis là pour vous aider ! Le vol AB 0271 est actuellement opéré comme prévu.',
        'Tout se déroule normalement. Puis-je faire autre chose pour vous ?',
      ]) + tail(G),
      do: (G) => G.nerves(2),
    },
    {
      label: 'Je veux faire une réclamation.',
      warn: true,
      answer: 'Je suis désolée de l\'apprendre. Votre retour a été enregistré dans votre dossier. Merci d\'avoir choisi Albion Atlantic – nous faisons de notre mieux. 🙏',
      do: (G) => G.strike(),
    },
  ];

  /* ================================================================ scenes */
  const scenes = {};

  scenes.title = {
    type: 'title',
    board: `AB 0271   LONDRES LHR  →  LOS ANGELES LAX      PARTI 20:05\n                                              STATUT : ▮▮▮▮▮▮▮▮▮▮`,
    text: p(
      'Neuf heures, sans escale, chez vous avant minuit heure du Pacifique. Vous avez bu le café en plus. Vous avez tout fait comme il faut.',
      'Ceci est un jeu sur le fait de s\'entendre dire, très poliment, que tout va bien.',
      W('Inspiré d\'un vrai fil sur un vol dérouté. La compagnie de ce jeu est fictive. Les bus ne le sont pas.'),
    ),
  };

  scenes.howto = {
    loc: 'Consignes de sécurité',
    text: p(
      '<em>Lisez tout.</em> Votre téléphone (à droite, ou sous le bouton TÉLÉPHONE) reçoit les mails de la compagnie, un chatbot nommé Ally, des SMS, et des photos de tous les panneaux imprimés que vous croisez. Quelqu\'un dit la vérité. Ce n\'est pas toujours celui qui a le logo.',
      '<em>Deux jauges.</em> Toutes deux se remplissent. Aucune ne met fin au jeu. Ce qu\'elles font, c\'est fermer des portes : à mesure qu\'une jauge se remplit, une partie de ce que vous auriez pu dire ou faire cesse d\'être disponible, et ce qui reste est ce qui reste. Les petits choix les remplissent. Le sommeil, la nourriture et les autres les vident, un peu.',
      '<em>Noté</em> compte les réclamations que la compagnie a enregistrées contre vous. À trois, elle agit – là où elle le peut.',
      'Les lieux sont des pièces où vous pouvez vous déplacer. Agir prend des minutes ; l\'horloge n\'avance que quand vous agissez. Des bus viennent et repartent. Regardez-les de près avant de monter. Le bon ressemblera à ce que vous ressentez.',
      'Une partie dure vingt à trente minutes. Il y a douze fins, et l\'une d\'elles est Los Angeles.',
    ),
    choices: [{ label: 'Retour', next: 'title' }],
  };

  scenes.gallery = { type: 'gallery' };

  /* ---------------------------------------------------------------- Day 0 · the approach
     Boarding, the seat, the demonstration, the meal, the dark hours. Nothing
     goes wrong here. That is what it is for: four hours of a cabin working
     exactly as it should, with one man in it counting. */
  scenes.boarding = {
    art: 'gate',
    loc: 'Londres Heathrow · Passerelle · Siège 31B',
    enter: (G) => { if (G.once('welcome_mail')) G.msg('email', { from: 'Albion Atlantic', subj: 'Bienvenue à bord du vol AB 0271', body: 'Chère cliente, cher client,\n\nBienvenue à bord du vol Albion Atlantic AB 0271 à destination de Los Angeles. Votre vol est à l\'heure.\n\nNotre équipage de cabine veille à votre sécurité et à votre confort. La sécurité de nos clients est primordiale.\n\nBon vol.' }); },
    text: p(
      'La passerelle sent le kérosène et la moquette. À la porte de l\'avion, le chef de cabine : grand, les tempes argentées, un sourire repassé avec la chemise. Il ne regarde pas les cartes d\'embarquement. Il regarde les visages, un par un, et dit ' + V('« Bienvenue à bord »') + ' à chacun, comme s\'il allait devoir s\'en souvenir.',
      'Rang 31. Un siège côté couloir, 31B. En 31C, un homme de votre âge avec un livre de poche qu\'il a déjà cessé de lire. Il hoche la tête. Vous hochez la tête. C\'est toute la conversation, et ça le restera un moment.',
      'Quelque part derrière vous, on explique patiemment à un enfant de deux ans que l\'avion ne part pas encore. L\'avion ne part pas encore.',
    ),
    choices: [
      { label: 'Dire bonjour au 31C.', nd: -1, dd: -1, time: 20, do: (G) => { G.flag('met31c'); G.note('Il a répondu bonjour. Il rentre chez lui. Il l\'a dit comme on le dit au début de neuf heures de vol : chez lui, comme si c\'était un endroit que l\'avion était certain d\'atteindre.'); }, next: 'takeoff' },
      { label: 'Ranger votre sac, vous asseoir, attacher la ceinture avant qu\'on vous le demande.', kind: 'comply', dd: 2, time: 20, do: (G) => G.note('Ceinture attachée. Sac rangé. Le chef de cabine, en passant, y a jeté un œil et a fait le plus petit des signes de tête, le signe de tête d\'un homme qui tient une liste.'), next: 'takeoff' },
      { label: 'Demander au chef de cabine, à la porte, si le vol est à l\'heure.', nd: 1, time: 20, do: (G) => G.note(V('« Tout est à l\'heure, »') + ' a-t-il dit, chaleureusement, puis – pour être complet – ' + V('« Tout. »') + ' Il regardait toujours les passagers qui entraient derrière vous.'), next: 'takeoff' },
      { label: 'Lire les consignes de sécurité dans la pochette du siège. Vraiment, pour une fois.', nd: -2, time: 20, do: (G) => G.note('Position de sécurité. Issues les plus proches, qui peuvent se trouver derrière vous. Un petit dessin d\'une personne glissant dans la mer avec une expression sereine. Vous la remettez en place. Vous n\'en aviez jamais lu une, et vous ne savez pas pourquoi vous l\'avez fait cette fois.'), next: 'takeoff' },
    ],
  };

  scenes.takeoff = {
    art: 'cabin',
    loc: 'Piste 27L · Heathrow',
    text: p(
      'Le chef de cabine fait lui-même la démonstration de sécurité, à l\'avant, pendant que la vidéo passe derrière lui sans le son. Il la fait lentement. Il la fait en regardant chaque rang à son tour, comme pour vérifier que les issues sont bien là où la fiche le dit.',
      V('« Dans le cas improbable. Dans le cas improbable. La sécurité de nos clients est primordiale. »') + ' C\'est une chose étrange à dire dans une démonstration de sécurité, et il la dit comme si c\'était la chose ordinaire.',
      'Puis les moteurs, et la pression dans le dossier, et Londres qui bascule dans l\'orange et le noir. Le signal des ceintures reste allumé bien plus longtemps que nécessaire.',
    ),
    choices: [
      { label: 'Regarder la démonstration jusqu\'au bout.', kind: 'comply', dd: 2, time: 40, do: (G) => G.note('Vous avez regardé jusqu\'au bout. Il a terminé de votre côté de la cabine, et pendant un instant la démonstration vous était adressée à vous précisément, puis c\'était fini et il remontait l\'allée en effleurant le haut des sièges.'), next: 'service' },
      { label: 'Regarder par le hublot Londres qui s\'en va.', nd: -2, time: 40, do: (G) => G.note('La M25 comme un anneau d\'ambre. Puis des nuages. Puis plus rien que le feu de l\'aile, qui clignote, et votre propre visage dans la vitre, qui rentre chez lui.'), next: 'service' },
      { label: 'Vérifier votre téléphone une dernière fois avant le mode avion.', dd: 1, time: 40, do: (G) => { G.msg('sms', { from: 'Jo 💛', body: 'bon vol !!! écris-moi quand tu atterris 🛫' }); G.note('Un SMS. Jo. Vous avez répondu <em>promis</em>, regardé l\'envoi échouer, passé le téléphone en mode avion, et senti la cabine se refermer sur vous comme un couvercle.'); }, next: 'service' },
    ],
  };

  scenes.service = {
    art: 'cabin',
    loc: 'Croisière · au-dessus de la mer d\'Irlande',
    text: (G) => p(
      G.last(),
      'Le dîner arrive sur un chariot poussé par deux hôtesses qui sourient comme on fait son travail. Poulet ou pâtes. Le chef de cabine suit le chariot à quelques rangs de distance, sans servir, juste en marchant, en regardant les plateaux, en regardant les gens avec les plateaux.',
      G.has('met31c') ? 'L\'homme du 31C a pris les pâtes. Il ne les mange pas. Il regarde la carte du siège, où un petit avion n\'a pas encore atteint la côte irlandaise.' : 'L\'homme du 31C a pris les pâtes. Il ne les mange pas. Il n\'a pas dit un mot.',
    ),
    choices: [
      { label: 'Poulet.', time: 40, nd: -2, do: (G) => G.note('Le poulet était un poulet comme la mer de la fiche de sécurité était une mer. Vous l\'avez mangé. Vous rentriez chez vous ; là-bas, vous mangeriez correctement.'), next: 'night' },
      { label: 'Commander un café. Puis un autre.', nd: 6, sub: 'Vous êtes en train de caler votre corps sur l\'heure du Pacifique et vous n\'allez pas lâcher ça.', time: 40, do: (G) => { G.flag('coffee'); G.nerves(-3); G.note('Deux cafés. Du café d\'avion, c\'est-à-dire une opinion tiède. Vous les avez bus par principe. Le principe, c\'était l\'heure du Pacifique, et le chef de cabine, en passant, a regardé la deuxième tasse un peu plus longtemps qu\'une tasse ne le mérite.'); }, next: 'night' },
      { label: 'Sauter le dîner. Incliner le siège. Essayer de dormir maintenant.', kind: 'comply', dd: 3, nd: -3, time: 40, do: (G) => G.note('Vous avez dormi, un peu, comme on dort en avion : pas tant endormi qu\'éteint. Quand vous avez refait surface, les plateaux avaient disparu, les lumières étaient baissées, et quelqu\'un, à l\'avant, se tenait très immobile dans l\'allée.'), next: 'night' },
      { label: 'Demander aimablement à l\'hôtesse si le chef de cabine est toujours comme ça.', kind: 'conflict', nd: 4, dd: -2, time: 40, do: (G) => G.note('Elle a ri, une fois, puis plus, et a regardé l\'allée jusqu\'à l\'endroit où il se trouvait. ' + V('« Il est très consciencieux, »') + ' a-t-elle dit, et elle vous a donné les pâtes que vous n\'aviez pas demandées.'), next: 'night' },
    ],
  };

  scenes.night = {
    art: 'cabin',
    loc: 'Croisière · milieu de l\'Atlantique · quatrième heure',
    enter: (G) => G.dread(2),
    text: (G) => p(
      G.last(),
      'La cabine est sombre maintenant. Les écrans, presque tous éteints. La carte du siège montre un petit avion au-dessus de beaucoup de bleu, avec GROENLAND quelque part en haut à droite, à l\'état de rumeur.',
      'Le chef de cabine parcourt l\'allée. Lentement, depuis l\'avant, une petite carte dans une main et un crayon dans l\'autre, et à chaque rang il s\'arrête, regarde, et fait une marque. Il n\'explique pas. Personne ne demande. Arrivé à votre rang, il vous regarde, puis le 31C, puis le siège vide côté hublot, et écrit.',
      'À l\'avant, le rideau de la cabine avant a été tiré. Il y a de la lumière derrière, et des gens qui entrent et sortent rapidement, puis le chef de cabine debout devant, les mains jointes, tourné non vers le rideau mais vers vous tous.',
    ),
    choices: [
      { label: 'Dormir, ou essayer.', kind: 'comply', dd: 2, nd: -3, time: 40, do: (G) => G.note('Vous avez fermé les yeux. Derrière eux, on continuait de parcourir l\'allée. Quelque part vers l\'avant, une femme a dit ' + V('« Est-ce qu\'il va bien ? »') + ' et quelqu\'un a dit ' + V('« Veuillez regagner votre siège, »') + ' et vous n\'avez pas ouvert les yeux, parce que ce n\'est pas à vous qu\'on parlait. Pas encore.'), next: 'cabin' },
      { label: 'Regarder la carte.', dd: 2, time: 40, do: (G) => G.note('Le petit avion avançait si lentement qu\'il semblait réfléchir. Puis, pendant un moment, la carte n\'a plus rien montré, juste du bleu, et un temps restant bloqué à 5:12 plus longtemps que ne dure une minute.'), next: 'cabin' },
      { label: 'Aller aux toilettes à l\'avant. Passer devant le rideau.', dd: 4, nd: 2, dreadMax: 90, time: 40, do: (G) => { G.flag('saw_galley'); G.note('Par l\'entrebâillement du rideau : un homme au sol dans l\'office, une hôtesse agenouillée près de lui, la main sur sa poitrine, et le chef de cabine debout au-dessus d\'eux, les mains jointes – regardant non pas l\'homme, mais la cabine, par l\'entrebâillement, et donc vous. ' + V('« Veuillez regagner votre siège, »') + ' a-t-il dit, sans bouger autre chose que la bouche.'); }, next: 'cabin' },
      { label: 'Demander au 31C s\'il a vu la carte.', nd: -1, dd: -2, time: 40, do: (G) => { G.flag('met31c'); G.note(V('« Un comptage, »') + ' a-t-il dit. ' + V('« Ils le font avant d\'atterrir quelque part où ce n\'était pas prévu. »') + ' Il l\'a dit comme une blague. Aucun de vous deux n\'a ri. C\'était la première chose qu\'il disait depuis quatre heures.'); }, next: 'cabin' },
    ],
  };

  scenes.cabin = {
    art: 'cabin',
    loc: 'Quelque part au sud du Groenland · 37 000 pieds',
    text: (G) => p(
      G.last(),
      'Le signal « attachez vos ceintures » s\'allume avec un bruit de cuillère contre un verre.',
      G.has('saw_galley') ? 'Le commandant : un client est souffrant. Vous le savez. On se déroute sur Reykjavík. Il est désolé. Il dit le mot deux fois, et les deux fois on dirait une personne qui le dit.' : 'Le commandant : un client est souffrant. On se déroute sur Reykjavík. Il est désolé. Il dit le mot deux fois, et les deux fois on dirait une personne qui le dit.',
      'La cabine fait ce que font les cabines. Quelqu\'un dit : ' + V('« C\'est une blague. »') + ' Quelqu\'un, trois rangs plus haut, appuie sur le bouton d\'appel, et continue d\'appuyer. Un homme près de l\'office se lève et demande, d\'une voix faite pour porter, qui exactement va payer sa correspondance.',
      'Personne ne lui répond. Le bouton d\'appel continue de sonner.',
    ),
    choices: [
      { label: 'Ne rien dire. Regarder la carte sur l\'écran du siège.', kind: 'comply', dd: 4, sub: 'Le petit avion tourne.', time: 15, do: (G) => G.note('Le petit avion sur la carte a viré au nord. En dessous, le mot GROENLAND, et en dessous, rien. Autour de vous, les protestations continuent sans vous.'), next: 'cabin_purser' },
      { label: 'Demander poliment à une hôtesse ce qui se passera après l\'atterrissage.', nd: 2, time: 15, do: (G) => { G.flag('asked_crew'); G.nerves(3); G.note('Elle vous a souri comme on sourit à un chien dans une voiture. ' + V('« Tout vous sera communiqué. »') + ' Elle n\'a pas dit par qui. Derrière elle, l\'homme près de l\'office était toujours debout.'); }, next: 'cabin_purser' },
      { label: 'Joindre votre voix aux autres. À voix haute. Vous avez une vie qui vous attend à Los Angeles.', kind: 'conflict', nd: 10, dreadMax: 80, time: 15, do: (G) => { G.strike(); G.flag('objected'); G.note('Vous l\'avez dit. Sans crier – mais pas doucement non plus, et quelques têtes se sont tournées, et l\'homme près de l\'office vous a désigné comme une pièce à conviction. Pendant un instant, on aurait dit une cabine entière d\'accord.'); }, next: 'cabin_purser' },
      { label: 'Appuyer sur le bouton d\'appel, comme les autres.', kind: 'conflict', nd: 4, time: 15, do: (G) => G.note('Vous avez appuyé. Le vôtre a rejoint celui de trois rangs plus haut, et un autre derrière, jusqu\'à ce que la cabine soit un petit orchestre d\'une seule note, et personne n\'est venu, et personne n\'allait venir.'), next: 'cabin_purser' },
    ],
  };

  scenes.cabin_purser = {
    art: 'cabin',
    loc: 'Quelque part au sud du Groenland · 37 000 pieds',
    enter: (G) => G.dread(2),
    text: (G) => p(
      G.last(),
      'Puis le chef de cabine prend le combiné. Vous entendez l\'accent avant les mots – chaleureux, distingué, extraordinairement patient. Il a attendu que le bouton d\'appel s\'arrête. Il ne s\'est pas arrêté. Il parle par-dessus.',
      V('« Mesdames et messieurs. Je suis responsable de cette cabine, et la sécurité de nos clients est primordiale. Toute personne qui résisterait ou s\'opposerait à ce déroutement sera débarquée en Islande. Nous faisons de notre mieux. »'),
      'Un silence. L\'homme près de l\'office se rassied. Le bouton d\'appel s\'éteint. Trois rangs derrière, quelqu\'un rit une fois, et s\'arrête.',
      G.has('objected') && W('Il ne regarde pas l\'homme près de l\'office. Il regarde votre rang.'),
    ),
    choices: [
      { label: 'Encaisser.', kind: 'comply', dd: 3, time: 15, do: (G) => G.note('Vous avez encaissé. Tout le monde a encaissé. C\'est remarquable, la vitesse à laquelle deux cents personnes peuvent décider qu\'elles ont été patientes depuis le début.'), next: 'cabin2' },
      { label: 'Regarder autour de vous. Voir qui d\'autre a protesté.', time: 15, do: (G) => { G.nerves(-2); G.note('Quatre visages, peut-être cinq, encore fermés. L\'homme près de l\'office. Une femme avec un enfant. Vous les mémorisez comme on mémorise les sorties.'); }, next: 'cabin2' },
      { label: 'Rire. Une fois.', kind: 'conflict', nd: 3, dd: -2, time: 15, do: (G) => G.note('Vous avez ri, une fois, et quelqu\'un deux rangs derrière a ri avec vous, puis vous vous êtes arrêtés tous les deux, parce que le chef de cabine avait reposé le combiné très doucement et regardait le long de l\'allée.'), next: 'cabin2' },
    ],
  };

  scenes.cabin2 = {
    art: 'cabin',
    loc: 'En descente · Atlantique Nord',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      (G.has('met31c') ? 'L\'homme du 31C dit, à voix basse : ' : 'L\'homme du 31C, qui n\'a rien dit depuis Heathrow, dit : ') + V('« Ils ne peuvent pas vraiment faire ça. Si ? »'),
      'Il parle du débarquement. Il vous regarde comme si vous pouviez savoir.',
      'Dans l\'allée, le chef de cabine avance lentement vers l\'arrière, lisant les numéros de sièges sur les panneaux au plafond comme on lit une liste qu\'on a écrite soi-même.',
    ),
    choices: [
      { label: '« Je ne crois pas qu\'ils puissent, non. »', dd: -4, nd: -2, time: 45, do: (G) => { G.collect(1); G.flag('ally31c'); G.note('Il a hoché la tête, sans avoir l\'air rassuré, et vous n\'étiez pas sûr d\'avoir été rassurant. Mais vous étiez deux, maintenant.'); }, next: 'cabin3' },
      { label: '« Franchement, je ne sais pas. »', dd: -1, time: 45, do: (G) => { G.flag('ally31c'); G.note('Il a hoché la tête. ' + V('« Non. Moi non plus. »') + ' Vous avez regardé la carte ensemble. Le petit avion était au bord.'); }, next: 'cabin3' },
      { label: 'Mettre vos écouteurs.', kind: 'comply', dd: 5, nd: -2, time: 45, do: (G) => { G.nerves(2); G.note('Vous avez mis vos écouteurs. Rien ne jouait. Vous les avez laissés. Quand vous avez levé les yeux, le chef de cabine était à votre rang, sans vous regarder, puis il était passé.'); }, next: 'cabin3' },
      { label: 'Appuyer sur le bouton d\'appel et redemander.', kind: 'conflict', nd: 5, dd: 2, time: 45, do: (G) => { G.nerves(4); G.flag('asked_crew'); G.note('Le bouton s\'est allumé. Personne n\'est venu. Au bout d\'un moment il s\'est éteint tout seul, et le chef de cabine, trois rangs plus loin, s\'est retourné et a regardé le panneau au-dessus de votre tête, puis vous.'); }, next: 'cabin3' },
    ],
  };

  scenes.cabin3 = {
    art: 'cabin',
    loc: 'Approche finale · Keflavík',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      'Le chef de cabine, encore, au combiné. ' + V('« À l\'atterrissage, veuillez rester assis, ceinture attachée, jusqu\'à ce que l\'équipe médicale se soit occupée de notre client en cabine avant. Je vous dirai quand vous pourrez vous lever. Je vous le dirai. »'),
      'De la pluie sur les hublots. En dessous, une côte comme quelque chose de raclé. Les lumières d\'une ville qui n\'est pas Reykjavík, puis plus de lumières.',
      'Vous n\'avez jamais atterri nulle part, de nuit, sans voir la piste avant qu\'elle soit sous vous.',
    ),
    choices: [
      { label: 'Regarder par le hublot.', dd: 5, nd: 3, dreadMax: 90, time: 25, do: (G) => { G.nerves(3); G.note('Des lumières bleues, puis orange, puis bleues. Une ambulance, portes ouvertes sur le tarmac mouillé, et à côté – pas près, à côté – un homme en uniforme bleu marine, debout, très droit. Une voix depuis l\'allée, tout près de votre oreille : ' + V('« Le store, s\'il vous plaît. »')); }, next: 'ground' },
      { label: 'Garder les yeux sur la carte du siège.', kind: 'comply', dd: 4, time: 25, do: (G) => G.note('Le petit avion a franchi le bord de la carte et, pendant un moment, n\'a été sur aucune carte. Puis l\'écran est devenu noir et vous a montré votre propre visage.'), next: 'ground' },
      { label: 'Compter les rangs jusqu\'à la sortie la plus proche. Deux fois.', nd: -2, time: 25, do: (G) => { G.nerves(-2); G.note('Six rangs. Six rangs. C\'est le genre d\'information qui n\'est utile que s\'il se passe quelque chose, et vous avez commencé à vouloir qu\'il se passe quelque chose.'); }, next: 'ground' },
    ],
  };

  scenes.ground = {
    art: 'cabin',
    loc: 'Keflavík · au sol · moteurs coupés',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      'Trente minutes au sol. L\'équipe médicale est venue et repartie, ou n\'est pas venue. Personne ne l\'a dit. Le signal des ceintures reste allumé. Le chef de cabine se tient à l\'avant, mains jointes, et vous regarde tous le long de l\'allée, patiemment, comme si vous étiez une file d\'attente.',
      'L\'homme du 31C, à voix basse : ' + V('« Je ne crois pas qu\'on aille à LA. »'),
    ),
    choices: [
      { label: 'Se lever. Juste pour s\'étirer.', kind: 'conflict', nd: 6, dd: -3, dreadMax: 75, time: 15, do: (G) => { G.nerves(4); G.flag('stood'); G.dread(4); G.note(V('« Asseyez-vous, s\'il vous plaît. »') + ' Pas fort. Il n\'avait pas besoin de parler fort. Deux cents personnes vous ont regardé vous rasseoir.'); }, next: 'landing' },
      { label: 'Rester assis. Regarder le chef de cabine vous regarder.', kind: 'comply', dd: 5, time: 15, do: (G) => G.note('Il a regardé chaque rang à son tour, et quand il est arrivé au vôtre il ne s\'est pas arrêté, et il ne s\'est pas non plus pas arrêté.'), next: 'landing' },
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
          from: 'Albion Atlantic Customer Care', subj: 'Votre hébergement pour la nuit',
          body: `Chère cliente, cher client,\n\nEn raison d'un déroutement opérationnel, votre vol AB 0271 est retardé jusqu'à demain. Nous avons organisé votre hébergement.\n\nVeuillez utiliser le lien ci-dessous pour confirmer votre chambre :\n\n<a href="#" onclick="return false">Heathrow Renaissance Lodge — Bath Road, Hounslow TW6</a>\n\nLe transport vers votre hébergement sera assuré.\n\nNous vous prions de nous excuser pour la gêne occasionnée. Nous faisons de notre mieux.`,
          actions: [{ label: 'Ouvrir la page de réservation', if: (G) => !G.has('at_hotel') && !G.has('booked'), next: 'heathrow' }],
        });
        G.bot('Bonjour ! Je suis Ally, votre assistante virtuelle Albion Atlantic. Je vois que votre vol AB 0271 est à l\'heure. Comment puis-je vous aider ? ✈️');
      }
    },
    text: (G) => p(
      G.last(),
      'Le signal des ceintures s\'éteint sans annonce. C\'est ça, l\'annonce. Le terminal est éclairé comme l\'intérieur d\'un frigo. Quelques centaines d\'entre vous traînent les pieds de l\'avion jusque là, devant un homme en gilet fluo qui ne regarde personne.',
      G.has('objected') && W('En sortant, le chef de cabine vous a regardé un peu trop longtemps.'),
      'Contrôle des passeports. Une longue file. Puis l\'équipage la dépasse – tous, en ligne, valises à roulettes au pas, sans regarder ni à gauche ni à droite – par une porte marquée STAFF. La porte ne se referme pas derrière eux, tant elle cesse d\'être une porte.',
      'La file regarde ça se produire. Personne ne dit rien. Votre téléphone vibre.',
    ),
    choices: [
      { label: 'Lire le mail. Suivre le lien.', kind: 'comply', dd: 8, sub: 'Un hébergement. Enfin.', next: 'heathrow' },
      { label: 'Écrire au chatbot avec une urgence croissante.', kind: 'comply', dd: 4, nd: 4, time: 10, do: (G) => { G.nerves(4); G.bot('Je peux vous aider ! Votre vol AB 0271 est actuellement à l\'heure. Autre chose ? 😊'); G.note('Ally dit que le vol est à l\'heure. Vous regardez l\'avion par la vitre. Il a ses lumières éteintes.'); }, next: 'hall' },
      { label: 'Trouver un humain. N\'importe lequel.', dd: -4, dreadMax: 85, time: 10, next: 'icelander' },
      { label: 'Attendre. Quelqu\'un va faire une annonce.', kind: 'comply', dd: 8, sub: 'Quelqu\'un en fait toujours une.', time: 20, next: 'wait1' },
    ],
  };

  scenes.heathrow = {
    art: 'terminal',
    loc: 'Page de réservation · Heathrow Renaissance Lodge',
    text: p(
      'La page charge lentement, puis d\'un coup. Une photo de lit. Une photo de petit-déjeuner. <em>Bath Road, Hounslow, TW6.</em> À douze minutes du Terminal 5 par navette gratuite.',
      'Vous êtes à 1 900 kilomètres du Terminal 5.',
      'Il y a un gros bouton. Il dit CONFIRMER. En dessous, en plus petit : <em>Le transport vers votre hébergement sera assuré.</em>',
    ),
    choices: [
      { label: 'Confirmer.', kind: 'comply', dd: 10, sub: 'Ils ont dit que le transport serait assuré.', time: 5, do: (G) => { G.flag('booked'); G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Réservation confirmée — votre voiture vous attend', body: 'Votre hébergement est confirmé.\n\nUn chauffeur vous attend devant les Arrivées. Cherchez l\'écusson Albion Atlantic.\n\nDurée estimée du trajet : —:—' }); }, next: 'car' },
      { label: 'Fermer. Vous êtes en Islande.', dd: -3, dreadMax: 90, time: 5, do: (G) => { G.nerves(2); G.note('Vous avez fermé la page de réservation. Le mail est toujours là, avec son logo, patient.'); }, next: 'hall' },
    ],
  };

  scenes.car = {
    art: 'stand',
    loc: 'Keflavík · Devant les Arrivées',
    text: p(
      'Il y a, en effet, une voiture. Noire, longue, immaculée, un petit écusson doré sur la portière. Le chauffeur tient une tablette avec votre nom dessus – votre nom, bien orthographié, ce que la compagnie n\'a pas réussi une seule fois jusqu\'ici.',
      V('« Pour le Renaissance ? »'),
      'Il ouvre la portière arrière. Air chaud. Cuir. Au-delà du parking, la route s\'en va dans une obscurité qui ne semble pas avoir de fin.',
    ),
    choices: [
      { label: 'Monter.', kind: 'comply', sub: 'Il fait chaud.', do: (G) => G.end('accommodated') },
      { label: 'Non. Non, merci.', dd: 5, dreadMax: 85, time: 5, do: (G) => { G.nerves(5); G.dread(8); G.note('Le chauffeur n\'a pas eu l\'air surpris. Il a refermé la portière, est resté où il était, et y était encore quand vous vous êtes retourné depuis les portes.'); }, next: 'hall' },
    ],
  };

  scenes.icelander = {
    art: 'terminal',
    loc: 'Keflavík · Arrivées',
    text: p(
      'Une femme dans un uniforme qui n\'est pas celui de la compagnie – aéroport, peut-être, ou douane, ou juste une personne qui possède une polaire avec un badge – se tient près des portes, les mains dans le dos.',
      'Elle vous écoute. Elle regarde votre téléphone. Elle regarde le mail avec le logo.',
      V('« Ne suivez pas les mails, »') + ' dit-elle, gentiment, de la voix de quelqu\'un qui l\'a dit quarante fois ce soir. ' + V('« Il y a des bus. »'),
      'Vous demandez où. Elle désigne, d\'un geste vague, l\'Islande.',
    ),
    choices: [
      { label: 'La remercier. Aller chercher les bus.', do: (G) => { G.flag('hint_icelander'); G.nerves(-4); G.note('« Il y a des bus », a-t-elle dit. C\'est la phrase la plus solide qu\'on vous ait dite depuis le Groenland.'); }, next: 'hall' },
    ],
  };

  scenes.wait1 = {
    art: 'terminal',
    loc: 'Keflavík · Arrivées',
    text: (G) => p(
      'Vingt minutes. La file au contrôle des passeports se vide. Personne ne fait d\'annonce.',
      'Les gens avec qui vous avez volé dérivent, par deux ou trois, vers le fond du hall, où il y a une porte qui ne dit rien du tout.',
      G.t >= T(1, 2, 0) && W('Les lumières de ce côté du hall sont passées à moitié.'),
    ),
    choices: [
      { label: 'Attendre encore. Il y aura une annonce.', kind: 'comply', dd: 6, sub: 'Il y a un système de sonorisation. Vous voyez les haut-parleurs.', time: 25, next: (G) => (G.t >= T(1, 2, 20) ? 'wait2' : 'wait1'), do: (G) => { G.nerves(8); G.dread(8); } },
      { label: 'Suivre la dérive.', dreadMax: 90, time: 5, next: 'hall' },
    ],
  };

  scenes.wait2 = {
    art: 'terminal',
    loc: 'Keflavík · Arrivées',
    text: p(
      'Le hall est vide maintenant, à part vous, un agent d\'entretien, et le bruit que fait le plafond.',
      'Votre téléphone vibre. Un mail. <em>Nous avons organisé des cars pour vous.</em> Il ne dit pas où. Il ne dit pas quand. Il est horodaté d\'il y a une heure.',
      'Derrière vous, les lumières passent au quart.',
    ),
    enter: (G) => { atLeast(G, 45); if (G.once('coach_mail_w')) G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Transport organisé', stamp: G.t - 60, body: 'Chère cliente, cher client,\n\nNous avons organisé des cars pour vous transférer vers votre hébergement.\n\nVeuillez vous rendre aux cars.\n\nNous faisons de notre mieux.' }); },
    choices: [
      { label: 'Se rendre aux cars.', kind: 'comply', time: 15, do: (G) => G.end('terminal') },
      { label: 'Courir vers la porte qui ne dit rien.', nd: 5, dreadMax: 92, time: 5, do: (G) => { G.nerves(10); G.note('Vous avez couru. Personne ne vous a arrêté. La porte qui ne disait rien donnait sur l\'air froid, la lumière au sodium et, Dieu merci, d\'autres gens.'); }, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 01:20 the hall (hub) */
  scenes.hall = {
    art: 'terminal',
    loc: 'Keflavík · Hall des bagages',
    enter: (G) => {
      if (G.t >= T(1, 2, 40)) { G.go('wait2'); return; }
      if (G.once('hall_intro')) G.note(p(
        'Ils ne rendront pas les bagages enregistrés. Un homme derrière un comptoir l\'explique sans lever les yeux : les bagages sont <em>dans le système</em>. Vous êtes aussi, vraisemblablement, dans le système. Ça n\'a aidé ni les uns ni les autres.',
        'Un homme en polaire s\'approche. ' + V('« Hé. Je crois qu\'il va y avoir des bus ? Par là ? Soi-disant ? »') + ' Il pointe du doigt. Personne n\'a annoncé ça. Pas de mail, pas de SMS, pas d\'interphone. Juste un homme en polaire.',
      ));
    },
    text: (G) => hub(G,
      `${G.clock(G.t)}. Hall des arrivées. Tout est fermé. Vous n'avez ni sac, ni manteau, ni brosse à dents, et un téléphone à ${G.battery()}%.`,
      'hall',
      G.t >= T(1, 2, 10) ? W('Le hall se vide. Vous ne devriez probablement pas y être le dernier.') : ''),
    choices: [
      { label: 'Demander votre sac. Gentiment.', kind: 'comply', dd: 2, nerveMax: 70, time: 8, once: 'bag_nice', do: (G) => { G.nerves(2); G.note('L\'homme derrière le comptoir dit que les bagages sont dans le système. Vous demandez quel système. Il dit : le système. Vous demandez quand. Il dit : quand ce sera résolu. Il n\'a pas levé les yeux une seule fois.'); }, next: 'hall' },
      { label: 'Exiger votre sac. Votre dentifrice est dedans.', kind: 'conflict', nd: 8, sub: 'Il faut bien que quelqu\'un le fasse.', time: 10, once: 'bag', do: (G) => { G.strike(); G.note('Il lève les yeux. C\'est la seule chose qui change. ' + V('« Je vais le noter. »') + ' Il le note.'); }, next: 'hall' },
      { label: 'Longer les boutiques fermées.', dd: 3, time: 12, once: 'shops', do: (G) => { G.nerves(-1); G.dread(2); G.note('Le duty free : rideaux baissés. Un café : chaises sur les tables, la machine à café débranchée et tournée vers le mur. Un distributeur qui n\'accepte que les cartes islandaises, plein de choses avec la lettre ð dedans. Vous restez devant plus longtemps que prévu.'); }, next: 'hall' },
      { label: 'Essayer la porte STAFF.', dreadMax: 80, time: 6, once: 'staff', do: (G) => { G.dread(8); G.nerves(5); G.note('Verrouillée. La poignée est tiède, comme si quelqu\'un venait de la tenir. Vous y collez l\'oreille. Il n\'y a rien derrière. Pas du silence – rien. Quand vous reculez, le panneau dit STAFF, et en dessous, plus petit, vous ne l\'aviez pas remarqué : ONLY.'); }, next: 'hall' },
      { label: 'Regarder le tapis à bagages.', dd: 3, time: 8, once: 'carousel', do: (G) => { G.dread(4); G.note('Il tourne. Un seul sac passe. Ce n\'est pas le vôtre. Il a une étiquette bleu marine avec un écusson doré. Il repasse, puis le tapis s\'arrête, et le sac a disparu, et le tapis est vide d\'une manière qui suggère qu\'il l\'a toujours été.'); }, next: 'hall' },
      { label: 'Parler à l\'homme en polaire.', nd: -3, dd: -3, nerveMax: 90, time: 8, once: 'talk_fleece', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_hearsay'); G.note(V('« Quelqu\'un a parlé de bus. Quelqu\'un en gilet. Pas un des leurs. »') + ' Il regarde le mail sur votre téléphone. ' + V('« Ouais, je l\'ai eu aussi. Je vais pas à Heathrow, mec. »')); }, next: 'hall' },
      { label: 'Parler à la femme avec l\'enfant.', nd: -2, dd: -3, nerveMax: 80, time: 8, once: 'talk_mother', do: (G) => { G.collect(1); G.nerves(-2); G.flag('hint_hearsay'); G.msg('sms', { from: '+354 ··· ····', body: 'monte pas dans le joli' }); G.note('L\'enfant dort sur son épaule d\'une manière qui suggère que l\'épaule est porteuse. ' + V('« Un homme en gilet fluo m\'a dit : pas le joli. Je ne sais pas ce que ça veut dire. Je fais avec. »') + ' Pendant qu\'elle le dit, votre téléphone vibre : un SMS d\'un numéro que vous ne connaissez pas.'); }, next: 'hall' },
      { label: 'Retrouver l\'homme du 31C.', nd: -3, dd: -3, nerveMax: 95, time: 8, once: 'talk_31c', if: (G) => G.has('ally31c'), do: (G) => { G.collect(1); G.nerves(-3); G.note('Il est près des portes, à regarder le noir dehors. ' + V('« Donc il y a des bus, »') + ' dit-il. ' + V('« Super. À qui ? »') + ' Aucun de vous deux ne sait. Vous décidez, sans le dire, de monter dans le même.'); }, next: 'hall' },
      { label: 'Parler au couple âgé près de la vitre.', nd: -2, dd: -2, nerveMax: 75, time: 8, once: 'talk_couple', do: (G) => { G.collect(1); G.nerves(-2); G.note('Ils ont beaucoup voyagé et ne sont pas inquiets, disent-ils, avec des voix de gens inquiets. ' + V('« Ça finira par une feuille imprimée, »') + ' dit-il. ' + V('« Ça finit toujours par une feuille imprimée. »')); }, next: 'hall' },
      { label: 'Aller aux toilettes. Vous vous retenez depuis le Groenland.', nd: -3, time: 12, once: 'loo', do: (G) => { G.flag('bathroom'); G.nerves(-2); G.note('Un soulagement, en quelque sorte. Quand vous ressortez, le hall s\'est réorganisé : les mêmes gens, à d\'autres endroits, tous tournés vers la même porte.'); }, next: 'hall' },
      { label: 'Aller là où la polaire a pointé.', dd: -2, time: 5, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~02:00 bus stand 1 */
  scenes.buses1 = {
    art: 'stand',
    loc: 'Keflavík · Arrêt des cars · dehors',
    text: (G) => p(
      'Dehors il fait deux degrés, et le vent est venu de loin pour vous accueillir. Trois cars tournent au ralenti sous les lampes au sodium. Vos compagnons de vol avancent vers eux de la manière flottante, incertaine, de gens à qui on n\'a rien dit.',
      G.has('bathroom') ? 'Vous êtes en retard. La plupart de la foule est déjà montée dans quelque chose. Les portes commencent à se fermer.' : 'Personne ne contrôle les billets. Personne ne contrôle rien.',
      G.has('hint_hearsay') && W('« Pas le joli. »'),
      W('Regardez avant de monter. Regarder coûte quelques minutes. Monter coûte plus.'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: G.pick(['#c7c3b6', '#b8b4a6', '#8d8a80']), windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'night' },
        name: G.pick(['Un car blanc sans aucune livrée', 'Un car blanc cassé avec un rétroviseur fêlé', 'Un car gris avec un autocollant de loueur qui se décolle de la porte']),
        sign: G.pick(['ALBION ATL → HOTEL', 'AB0271  HOTEL', 'FLIGHT PPL – HOTEL']), signStyle: 'paper',
        look: ['Chauffeur en gilet fluo, en train de manger un sandwich. Il hausse les épaules quand vous le regardez.', G.has('bathroom') ? 'Moteur allumé. La porte commence à se fermer.' : 'Moteur allumé. Porte ouverte.'],
        hidden: ['L\'homme en polaire est au troisième rang. Un enfant dort sur quelqu\'un.', 'Tout le monde à bord porte ce qu\'il portait dans l\'avion, et en a l\'air.'],
        boardLabel: G.has('bathroom') ? 'Courir' : 'Monter',
        board: { time: 5, do: (G) => { if (G.has('bathroom')) G.nerves(6); G.flag('bus1_ok'); }, next: 'ride' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'night' },
        name: 'Un car bleu marine avec un écusson doré sur le flanc',
        sign: 'ALBION ATLANTIC WELCOMES YOU', signStyle: 'led',
        look: ['Chauffeur en uniforme de chef de cabine. Il vous sourit, à vous précisément.', 'Lumières intérieures vives et chaudes. Plein de places.'],
        hidden: ['Les passagers sont reposés. Chemises repassées. Quelqu\'un a une coupe de cheveux fraîche.', 'Vous ne reconnaissez pas un seul visage. Vous avez volé neuf heures avec ces gens.', 'Son badge est vierge.'],
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const flybus = {
        key: 'city',
        art: { livery: '#cfae36', windows: 'dim', passengers: 'luggage', sign: 'print', driver: 'plain', ground: 'night' },
        name: 'Un bus jaune aux couleurs de la ville',
        sign: 'FLYBUS · REYKJAVÍK BSÍ', signStyle: 'print',
        look: ['Chauffeur, blasé, qui consulte une tablette.', 'Des passagers avec sacs à dos et valises à roulettes.'],
        hidden: ['Ils ont des bagages. Vous n\'avez pas de bagages.', 'Un autocollant près de la porte : TICKET OBLIGATOIRE.'],
        board: { time: 5, next: 'detour' },
      };
      return G.shuffle([correct, crest, flybus]);
    },
    choices: [
      { label: 'Ne monter nulle part. Le mail a dit des cars. Attendre les instructions.', kind: 'comply', dd: 10, sub: 'Ils ont dit des cars. Ce ne sont peut-être pas les cars.', time: 35, next: 'wait2' },
    ],
  };

  scenes.detour = {
    art: 'road',
    loc: 'Route 41 · vers Reykjavík',
    text: p(
      'Quarante minutes après le départ, un routard vous demande dans quelle auberge vous êtes, et vous comprenez.',
      'Le bus vous dépose à une gare routière en ville qui sent le diesel et la cannelle. Un chauffeur de taxi a pitié, et 9 800 couronnes, et vous ramène dans le noir jusqu\'à un hôtel qu\'on a prévenu de votre arrivée et qui n\'est pas sûr d\'y croire.',
      'Il est 03h35. Vous avez les vêtements que vous portez. Même pas les bons.',
    ),
    enter: (G) => { G.S.t = T(1, 3, 35); G.nerves(18); G.flag('detoured'); G.dread(8); },
    choices: [{ label: 'Entrer.', next: 'hotel_arrive' }],
  };

  /* ---------------------------------------------------------------- the ride */
  scenes.ride = {
    art: 'road',
    loc: 'Une route · quelque part sur la péninsule de Reykjanes',
    enter: (G) => {
      G.dread(4);
      if (G.once('coach_mail')) G.at(G.t + 30, 'email', { from: 'Albion Atlantic Customer Care', subj: 'Transport organisé', body: 'Chère cliente, cher client,\n\nNous avons organisé des cars pour vous transférer vers votre hébergement. Veuillez vous rendre aux cars.\n\nSi vous avez besoin d\'aide pour localiser les cars, veuillez nous contacter.\n\nNous faisons de notre mieux.' });
      if (G.once('coach_txt')) G.at(G.t + 45, 'sms', { from: 'AlbionATL', body: 'AB0271 : Votre hôtel est le HEATHROW RENAISSANCE LODGE. Ne pas répondre.' });
    },
    text: (G) => p(
      'Le car dépasse les dernières lumières, et puis il continue.',
      'Des champs de lave sous un ciel bas. Pas de villes. Pas de panneaux que vous sachiez lire. Vous ne savez pas qui vous a pris ni où vous allez. Soit vous avez été tendrement recueilli dans les bras du cadre réglementaire européen, soit vous avez été kidnappé, avec un car entier de gens épuisés et trop polis pour demander.',
      G.has('coffee') && W('Votre cœur fait quelque chose. C\'est le café. C\'est sûrement le café.'),
      'C\'est un long trajet. Ça commence à être une longueur de trajet inquiétante.',
      'Au fond, un enfant de deux ans soupire : ' + V('« Quelle journée. »'),
    ),
    choices: [
      { label: 'Rire. Tout le monde rit. Poliment, et un peu paniqué.', nd: -6, dd: -4, nerveMax: 85, time: 50, do: (G) => { G.nerves(-5); G.collect(1); }, next: 'hotel_arrive' },
      { label: 'Rester silencieux. Regarder le noir.', kind: 'comply', dd: 4, time: 50, do: (G) => G.nerves(3), next: 'hotel_arrive' },
      { label: 'Aller devant. Demander au chauffeur où va ce bus.', kind: 'conflict', nd: 5, dd: 3, time: 50, do: (G) => { G.nerves(6); G.flag('asked_driver'); }, next: 'hotel_arrive' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~03:00 the hotel */
  scenes.hotel_arrive = {
    art: 'lobby',
    loc: 'Hótel Hraun · Réception',
    enter: (G) => {
      G.flag('at_hotel'); atLeast(G, 38);
      if (G.once('hotel_paper')) G.msg('paper', { from: 'Scotché au comptoir de la réception', subj: 'Panneau imprimé', body: '<b>PASSENGERS ALBION ATLANTIC AB0271</b>\n\nBUS TO AIRPORT: <b>11:00</b>\n\nPlease wait in lobby.\n\n(No delivery service until 11:00 am)' });
      if (G.once('hotel_bot')) { G.at(T(1, 3, 50), 'chat', { body: 'Êtes-vous bien installé dans votre chambre ? 🙂' }); G.at(T(1, 4, 15), 'chat', { body: 'Votre car part à 04h30. Un membre du personnel frappera à votre porte.' }); }
    },
    text: (G) => p(
      G.has('asked_driver') && W('Le chauffeur n\'a jamais répondu. La radio passait quelque chose en islandais qui était peut-être la météo.'),
      'Un hôtel, donc. Bas, large, le genre d\'endroit construit pour des congrès qui ne sont jamais venus. La veilleuse de nuit distribue les cartes de chambre depuis une boîte à chaussures. La vôtre dit 214.',
      'Non, ils n\'ont pas de dentifrice. Non, ils n\'ont pas de brosses à dents. Rien ne livre ici avant onze heures demain matin. Il y a un distributeur. La réceptionniste le dit avec l\'air d\'une femme qui vous tend un canot de sauvetage.',
      'Scotchée au comptoir, une feuille A4, en Arial, légèrement auréolée d\'eau. Elle dit que le bus pour l\'aéroport est à 11h00. C\'est la première information de la nuit qui arrive avec une heure et sans logo.',
    ),
    choices: [{ label: 'Monter à la chambre.', time: 8, next: 'room' }],
  };

  /* ---- the room (hub) ---- */
  const roomStatus = (G) => `Chambre 214. ${G.clock(G.t)}. Vous êtes trop fatigué pour dormir${G.has('toothpaste') ? '' : ', et vos dents sont sales'}${G.has('dinner') ? '' : ', et vous n\'avez rien mangé'}.`;

  scenes.room = {
    art: 'room',
    loc: 'Hótel Hraun · Room 214',
    enter: (G) => {
      G.flag('loc_room');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('room_intro')) G.note('Un lit, une bouilloire, une télévision, une fenêtre sur le parking, et de minuscules flacons de shampoing et d\'après-shampoing avec lesquels vous envisagez déjà de vous brosser les dents. La porte a une chaîne. Vous mettez la chaîne. Puis vous l\'enlevez, au cas où, et vous la remettez.');
    },
    text: (G) => hub(G, roomStatus(G), 'room'),
    choices: (G) => [
      { label: 'Manger. Des chips et deux mignonnettes de vin.', nerveMax: 90, sub: 'Dîner de fille.', if: (G) => G.has('crisps') && !G.has('dinner'), time: 12, do: (G) => { G.flag('dinner'); G.nerves(-10); G.note('Du sel, puis du vin, puis du sel. Vous mangez assis au bord du lit, le paquet tenu à deux mains comme quelque chose qui pourrait s\'échapper. C\'est le meilleur repas que vous ayez fait en vingt heures, qui est aussi le seul.'); }, next: 'room' },
      { label: 'Fixer les mini-shampoings et envisager de vous brosser les dents avec.', time: 4, do: (G) => { const n = G.count('shampoo'); G.nerves(n === 1 ? -1 : 1); G.note(n === 1 ? 'Shampoing. Après-shampoing. Lait pour le corps. Vous lisez les ingrédients. Le laureth sulfate de sodium est, techniquement, un tensioactif. Vous le reposez. Vous le reprenez. Vous le reposez.' : n === 2 ? 'Vous êtes déjà venu ici. Le shampoing n\'a pas changé d\'avis, et vous non plus.' : 'Les petits flacons sont alignés sur l\'étagère et vous regardent. L\'un d\'eux a bougé. C\'est vous qui l\'avez bougé. Probablement.'); }, next: 'room' },
      { label: 'Prendre une douche. Remettre les mêmes vêtements.', nerveMax: 95, time: 20, once: 'shower', do: (G) => { G.nerves(-6); G.note('De l\'eau chaude, au moins. L\'Islande a une excellente eau chaude ; elle sent légèrement l\'œuf et ne s\'épuise jamais. Vous restez dessous jusqu\'à vous sentir une personne, puis vous remettez l\'avion : le pantalon, la chemise, les chaussettes, le tout légèrement plus chaud que vous.'); }, next: 'room' },
      { label: 'Allumer la télévision.', kind: 'comply', dd: 2, time: 6, do: (G) => { const d = G.D, n = G.count('tv'); G.dread(1); G.note(d >= 5 ? 'Chaîne 1 : le parking. Votre parking, vu d\'en haut, en gris. Le car dedans. Une silhouette à côté du car. Vous éteignez. L\'écran vous montre la chambre, vue d\'en haut, en gris.' : d >= 4 ? 'La météo, en islandais, pour toujours. Puis une chaîne qui est une caméra fixe sur un parking. Vous êtes à peu près sûr que ce n\'est pas ce parking-ci. Il y a un car dedans.' : n === 1 ? 'La météo, en islandais. Une carte de l\'île couverte de petites flèches furieuses. Puis une image fixe de l\'hôtel avec un numéro de téléphone. Puis la météo.' : 'Vous avez déjà vu cette météo. Elle n\'a pas changé. Les flèches sont toujours furieuses. L\'hôtel est toujours à l\'écran avec son numéro, comme si vous pouviez vouloir l\'appeler depuis l\'intérieur.'); }, next: 'room' },
      { label: 'Regarder par le hublot.', dd: 2, dreadMax: 85, time: 3, do: (G) => { const d = G.D, n = G.count('win'); G.dread(2); if (d >= 4) G.flag('looked1'); G.nerves(d >= 4 ? 7 : 2); G.note(d >= 5 ? 'Le car est juste en dessous de vous maintenant. Lumières intérieures allumées. Tout le monde dedans face à l\'hôtel, droit, immobile. Et près de la porte, mains jointes, un homme en bleu marine, qui lève les yeux. Pas vers l\'hôtel. Vers votre fenêtre. Vous lâchez le rideau. Vous ne vous souvenez pas l\'avoir tiré.' : d >= 4 ? 'Un car est garé tout au bout du parking, moteur allumé, toutes les lumières intérieures allumées. Il est plein. Personne dedans ne bouge. Vous ne voyez personne près de la porte, et puis si.' : n === 1 ? 'Un parking. Un seul lampadaire. Du gravier, du vent, et au-delà du lampadaire, le noir qui continue très loin. Pas de car. Vous êtes soulagé, puis vous vous demandez pourquoi vous en attendiez un.' : 'Le parking. Le lampadaire. Deux phares sur la route, qui ralentissent, qui ne tournent pas. Votre propre visage par-dessus tout ça, pâle, dans la chemise d\'hier.'); }, next: 'room' },
      { label: 'Faire du thé avec les petits sachets.', nerveMax: 90, time: 8, once: 'tea', do: (G) => { G.nerves(-5); G.note('La bouilloire met longtemps et fait un bruit de petit avion. Du thé, avec du lait UHT dans un dé à coudre. Vous tenez la tasse à deux mains. C\'est la première chose chaude qui ne soit pas un mensonge.'); }, next: 'room' },
      { label: 'Vérifier la porte.', nd: 2, time: 2, do: (G) => { const n = G.count('door'); G.note(n === 1 ? 'Fermée. Chaîne mise. Vous vérifiez la chaîne. Vous vérifiez le verrou. Bien.' : n === 2 ? 'Toujours fermée. Toujours la chaîne. Vous le saviez.' : n === 3 ? 'Vous vérifiez encore la porte. Vous avez conscience de vérifier encore la porte. Elle est fermée. Elle a toujours été fermée. Vous restez la main dessus un moment.' : 'Fermée. Vous ne savez plus ce que vous vérifiez. Si elle est fermée, ou si c\'est encore une porte.'); if (n >= 3) G.dread(1); }, next: 'room' },
      { label: 'Écouter à la porte.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(3); G.note(G.pick(d >= 4 ? ['Des pas. Lents, réguliers, qui s\'arrêtent à chaque porte. Qui s\'arrêtent à la vôtre. Qui continuent.', 'Un chariot, à roulettes, tout au bout. Il s\'arrête. Il ne repart pas.', 'On frappe, loin dans le couloir. Patiemment. Puis plus près.'] : ['Rien. Le bourdonnement du couloir. Une porte, au loin, qui se ferme.', 'Quelqu\'un passe, vite, en chaussettes. Quelqu\'un d\'autre, lentement, en chaussures.', 'La machine à glaçons, qui broie, au bout du couloir. Puis un rire, une porte plus loin, coupé net.'])); }, next: 'room' },
      { label: 'Appeler la réception depuis le téléphone de la chambre.', kind: 'comply', dd: 1, time: 5, once: 'roomphone', do: (G) => { G.dread(2); G.note('Ça sonne longtemps. Puis la réceptionniste, avec la voix de quelqu\'un qui dormait ou qui n\'a jamais dormi : ' + V('« Oui, 214 ? »') + ' Vous n\'aviez pas dit votre numéro de chambre. Vous demandez pour le bus. ' + V('« Onze heures. C\'est écrit onze heures. Vous devriez peut-être dormir. »')); }, next: 'room' },
      { label: 'Chercher vos droits.', dd: -6, dreadMax: 85, sub: 'Il y a un règlement. Quelqu\'un dans vos mentions en est sûr.', time: 15, once: 'rights', do: (G) => { G.flag('uk261'); G.nerves(-6); G.msg('paper', { from: 'Capture d\'écran, puis un QR code que vous avez fait vous-même', subj: 'UK261', body: '<b>UK261 / CE261 — VOS DROITS</b>\n\nPour un retard de cette durée, la compagnie doit fournir : repas, hôtel, transport et moyens de communication.\n\nIls contesteront. Réclamez quand même.\n\n[ QR CODE ]' }); G.note('UK261. <em>La compagnie doit fournir.</em> Vous le lisez deux fois. Vous en faites un QR code, sur le wifi de l\'hôtel, à trois heures du matin, sans savoir pourquoi, sinon que vous allez le montrer à tous les gens que vous verrez au petit-déjeuner.'); }, next: 'room' },
      { label: 'Poster à ce sujet.', time: 8, once: 'post', do: (G) => { if (G.D >= 4) { G.nerves(4); G.note('Vous tapez tout – l\'équipage, la porte, le mail, le bus – et vous appuyez sur publier, et la petite roue tourne, et tourne. Une barre. Zéro barre. Le message reste là, non envoyé, adressé à personne.'); } else { G.nerves(-3); G.note('Vous le postez. Lol, écrivez-vous. Mdr. En dix minutes : 1,4K likes, et quarante personnes qui vous parlent des sources chaudes. Vous posez le téléphone face contre la couette.'); } }, next: 'room' },
      { label: 'Charger le téléphone.', nd: 2, time: 2, once: 'charge', do: (G) => { G.nerves(3); G.note(`Le chargeur est dans le sac. Le sac est dans le système. Le téléphone est à ${G.battery()} %, et il le sait, et il baisse l'écran pour vous le dire.`); }, next: 'room' },
      { label: 'Essayer de dormir.', nerveMax: 80, time: 25, do: (G) => { if (G.t + 25 >= T(1, 4, 5)) { G.S.t = Math.max(G.t, KNOCK_AT - 25); G.note('Vous vous allongez dans vos vêtements d\'avion, lumière allumée. Le plafond est très proche. Vous êtes presque, presque—'); } else { G.nerves(-3); G.note(G.pick(['Vous vous allongez. Votre corps est à l\'heure du Pacifique, ou à aucune heure. Le plafond a une tache en forme d\'île. Vous la regardez un moment. Rien.', 'Yeux fermés. Le moteur du car – d\'un car – quelque part sous la fenêtre, ou dans vos oreilles. Vous vous rasseyez.', 'Vous vous glissez sous la couette tout habillé. C\'est comme être un colis. Le sommeil vous regarde depuis l\'autre bout de la chambre et ne s\'approche pas.'])); } }, next: 'room' },
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
      if (G.once('corr_intro')) G.note('Long, bas, moquetté de quelque chose couleur d\'ecchymose. Des portes : 210, 212, 214 – la vôtre – 216, 218, jusqu\'à une porte coupe-feu avec une barre et une vitre grillagée. Une machine à glaçons ronronne tout au bout. Un ascenseur, avec une feuille collée dessus.');
    },
    text: (G) => hub(G, `Le couloir. ${G.clock(G.t)}. Toutes les portes sont fermées. La vôtre est celle avec la lumière allumée.`, 'corridor'),
    choices: (G) => [
      { label: 'La machine à glaçons.', nd: 2, dd: 1, time: 5, do: (G) => { const n = G.count('ice'); G.note(n === 1 ? 'Elle rugit. De la glace, beaucoup de glace, dans un seau que vous n\'avez pas apporté. Vous restez là, une poignée à la main. Vous ne vouliez pas de glace. Vous ne savez pas ce que vous vouliez.' : n === 2 ? 'Elle rugit encore, pour vous, comme si elle attendait. La glace d\'avant n\'a pas fondu. Vous n\'êtes pas sûr que la glace devrait se comporter comme ça dans un couloir chauffé.' : 'Vous ne mettez pas la main dedans, cette fois. Vous l\'écoutez broyer. Sous le broiement, venu d\'en dessous, un moteur.'); if (n >= 2) G.dread(1); }, next: 'corridor' },
      { label: 'Frapper à la 216. La chambre de l\'homme en polaire.', time: 5, do: (G) => { const n = G.count('k216'); if (n === 1) { G.collect(1); G.nerves(-4); G.note('Un silence, puis la chaîne, puis la polaire. Il est réveillé lui aussi. Lui aussi est habillé. ' + V('« Mec, »') + ' dit-il, et ça couvre tout. Vous êtes d\'accord sur le bus. Onze heures. La feuille imprimée. Il dit qu\'il frappera chez vous.'); } else if (n === 2) { G.nerves(3); G.dread(3); G.note('Pas de réponse. La lumière sous la porte est allumée. Vous frappez encore, régulièrement, et vous vous entendez le faire, et vous arrêtez.'); } else { G.nerves(8); G.dread(5); G.note('La porte n\'est pas verrouillée. Elle s\'ouvre. La chambre est faite : lit tiré, serviettes pliées en éventail, les mini-shampoings en rang. Personne n\'y a été. Personne n\'y a jamais été. Sa polaire est sur la chaise.'); } }, next: 'corridor' },
      { label: 'L\'ascenseur.', kind: 'comply', dd: 2, time: 4, do: (G) => { const d = G.D; if (d >= 4) { G.flag('lift_open'); G.dread(3); G.nerves(5); G.note('La feuille dit HORS SERVICE, en Arial. Pendant que vous la lisez, l\'ascenseur arrive. Les portes s\'ouvrent sur une cabine vide, bien éclairée, avec un miroir au fond, et restent ouvertes, et attendent. Personne ne l\'a appelé.'); } else { G.note('HORS SERVICE, en Arial, scotché de travers. Vous appuyez quand même. Quelque part dans le bâtiment, quelque chose descend.'); } }, next: 'corridor' },
      { label: 'Entrer dans l\'ascenseur.', kind: 'comply', if: (G) => G.has('lift_open'), do: (G) => G.end('lift') },
      { label: 'Lire le plan d\'évacuation incendie au mur.', dd: -2, time: 3, once: 'fireplan', do: (G) => { G.msg('paper', { from: 'Vissé au mur du couloir', subj: 'Plan d\'évacuation', body: '<b>EVACUATION PLAN · 2ND FLOOR</b>\n\nIn case of alarm, proceed by stairs to\n<b>ASSEMBLY POINT: CAR PARK</b>\n\nDo not use the lift.\nDo not return for belongings.\n\nYOU ARE HERE ●' }); G.note('VOUS ÊTES ICI. Un point rouge, à la 214. Quelqu\'un a tracé au stylo une petite flèche depuis le point vers le parking, et écrit, d\'une autre main : <em>bus</em>.'); }, next: 'corridor' },
      { label: 'La porte coupe-feu et l\'escalier. Vers le parking.', dreadMax: 92, time: 4, next: 'carpark' },
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
      if (G.once('lobby_intro')) G.note('Le hall, la nuit, est un aquarium dont on a laissé la lumière. Deux passagers de votre vol dorment assis sur un canapé. La veilleuse de nuit est au comptoir avec des mots croisés. Le panneau imprimé, en Arial, dit 11h00. Un distributeur ronronne contre le mur comme un petit dieu réfrigéré.');
    },
    text: (G) => hub(G, `Le hall. ${G.clock(G.t)}. Le panneau dit toujours 11h00. ${G.t >= KNOCK_AT ? 'Il est plus de quatre heures et demie.' : 'Il est loin d\'être onze heures.'}`, 'lobby'),
    choices: (G) => [
      { label: 'Demander du dentifrice à la réception.', time: 6, once: 'desk_tp', do: (G) => { G.nerves(2); G.note('Elle cherche sous le comptoir, sincèrement, longtemps. ' + V('« Non. Désolée. Le 10-11 en a. Vingt minutes, à pied. »') + ' Elle vous regarde, puis les portes, puis vous. ' + V('« Peut-être pas ce soir. »')); }, next: 'lobby' },
      { label: 'Demander si le panneau est exact.', kind: 'comply', dd: 1, time: 5, do: (G) => { const n = G.count('sign'); G.note(n === 1 ? 'Elle désigne le panneau. ' + V('« Onze heures. »') + ' Vous demandez qui le lui a dit. ' + V('« Un passager les a appelés. Ils ont dit oui. »') + ' Un silence. ' + V('« Ou ils ont dit quelque chose. »') : n === 2 ? V('« Onze heures, »') + ' dit-elle, sans lever les yeux, avant que vous ayez fini la question.' : 'Elle vous regarde un instant avec une expression que vous n\'arrivez pas à lire, puis dit : ' + V('« Vous êtes à la 214, »') + ' et retourne à ses mots croisés. Vous n\'aviez rien demandé.'); if (n >= 3) G.dread(3); }, next: 'lobby' },
      { label: 'Demander si un car est passé.', kind: 'comply', dd: 3, time: 5, do: (G) => { const d = G.D; G.dread(1); G.note(d >= 4 ? V('« Il y en a un dehors, »') + ' dit-elle. ' + V('« Ce n\'est pas le vôtre. »') + ' Vous demandez comment elle le sait. Elle retourne les mots croisés pour que vous puissiez les voir. Ils sont vierges.' : G.t >= KNOCK_AT ? V('« Quelqu\'un est venu vous demander. En uniforme. J\'ai dit que vous dormiez. »') + ' Vous ne dormiez pas. ' + V('« Je sais. »') : V('« Pas de car. Onze heures. S\'il vous plaît, montez dormir. »')); }, next: 'lobby' },
      { label: 'Le distributeur.', nd: -2, time: 5, do: (G) => { const n = G.count('vend'); if (n === 1) { G.flag('crisps'); G.nerves(-3); G.note('Des chips, paprika. Deux mignonnettes d\'un vin rouge dont l\'étiquette est une image de montagne. La machine prend votre carte au troisième essai et émet un son de profonde réticence. Vous tenez votre dîner à deux mains.'); } else { G.note(n === 2 ? 'Presque tout épuisé. Un seul article, tout en bas : un pot de skyr avec une date que vous auriez préféré ne pas lire.' : 'La lumière de la machine vacille. Tous les rayons sont vides maintenant, sauf le skyr, qui a monté d\'un étage.'); if (n >= 3) G.dread(1); } }, next: 'lobby' },
      { label: 'La machine à café.', time: 5, once: 'coffee_l', do: (G) => { G.nerves(G.has('coffee') ? 2 : -2); G.note('Du café. C\'est quoi le problème avec ce café. Il a le goût de quelque chose qu\'on aurait décrit à la machine par téléphone. Vous le buvez debout, en regardant les portes.'); }, next: 'lobby' },
      { label: 'Réveiller les passagers du canapé. Comparer vos notes.', nd: -4, dd: -4, nerveMax: 85, time: 8, once: 'sofa', do: (G) => { G.collect(1); G.nerves(-2); G.note('C\'est le couple de la vitre, dans le hall. Ils ne dorment pas. ' + V('« On a eu un mail qui disait neuf heures, »') + ' dit-elle. ' + V('« Et un qui disait huit. Et le truc de chat dit autre chose. »') + ' Vous regardez tous le panneau. ' + V('« Onze heures, »') + ' dit-il. ' + V('« La feuille. »')); }, next: 'lobby' },
      { label: 'Regarder le parking à travers la vitre.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(d >= 4 ? 5 : 0); G.note(d >= 5 ? 'Le car est juste devant les portes maintenant. Moteur allumé. Lumières intérieures allumées. Les portes s\'ouvrent pour lui, et restent ouvertes, et le froid entre. Personne ne descend.' : d >= 4 ? 'Tout au bout du parking, des phares, au ralenti. Une forme derrière eux qui est la forme d\'un car. La réceptionniste ne lève pas les yeux. Elle ne les a pas levés depuis un moment.' : 'Du gravier, un lampadaire, la route. Une voiture passe sans ralentir. Vous guettez quelque chose. Vous aimeriez arrêter.'); if (d >= 4) G.flag('looked1'); }, next: 'lobby' },
      { label: 'Sortir.', dd: -2, dreadMax: 88, time: 3, next: 'carpark' },
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
      if (G.once('cp_intro')) G.note('Froid. Vraiment froid : le genre qui entre dans vos vêtements et y reste. Du gravier, un lampadaire, une route dans deux directions. L\'hôtel derrière vous, éclairé. Vous êtes sorti pour une raison que vous aviez il y a un instant.');
    },
    text: (G) => hub(G, `Le parking. ${G.clock(G.t)}. Le vent est venu de loin pour vous accueillir.`, 'carpark'),
    choices: (G) => [
      { label: 'Marcher jusqu\'au bout. Vers la forme.', nd: 5, dreadMax: 92, time: 6, do: (G) => { const d = G.D; G.dread(G.counted('cpwalk') ? 1 : 3); G.count('cpwalk'); if (d >= 4) { G.flag('coach_seen_cp'); G.nerves(G.counted('cpwalk') > 1 ? 3 : 6); G.note('Un car. Bleu marine. Écusson doré. Moteur allumé, toutes les lumières intérieures allumées, et derrière chaque vitre une personne, droite, face à l\'hôtel. Près de la porte, un homme en bleu marine, mains jointes. Il ne vous regarde pas. ' + V('« Pas encore, »') + ' dit-il, à personne, ou à vous.'); } else { G.nerves(3); G.note('Rien. Une plaque de gravier plus sombre que le reste, en forme de quelque chose qui était garé là récemment. Le vent. Vous restez un moment dans la forme.'); } }, next: 'carpark' },
      { label: 'Monter dans le car.', kind: 'comply', if: (G) => G.has('coach_seen_cp'), do: (G) => G.end('nightcoach') },
      { label: 'Lever les yeux vers votre fenêtre.', time: 3, do: (G) => { G.dread(2); G.nerves(2); G.note(G.D >= 4 ? 'Deuxième étage, quatrième fenêtre. La lumière est allumée. Vous l\'avez laissée. Le rideau est ouvert. Vous ne l\'avez pas laissé ouvert.' : 'Deuxième étage, quatrième fenêtre. La lumière est allumée. On dirait une chambre où il y a quelqu\'un.'); }, next: 'carpark' },
      { label: 'Marcher vingt minutes jusqu\'au 10-11 pour du dentifrice.', dreadMax: 70, sub: 'Du dentifrice. Des chaussettes, peut-être. Changer d\'air.', time: 20, once: 'walk', next: 'walk' },
      { label: 'Rentrer.', kind: 'comply', dd: 1, time: 3, next: 'lobby' },
    ],
  };

  scenes.walk = {
    art: 'road',
    loc: 'La route · vers le 10-11',
    text: p(
      'Du vent. De la lave. Une route sans trottoir et une ligne blanche qui n\'arrête pas de disparaître. Après huit minutes vous ne voyez plus l\'hôtel derrière vous ; après dix, vous ne voyez pas le 10-11 devant.',
      'Puis des phares, lents, par derrière. Un car. Il arrive à votre hauteur et s\'arrête, et la porte se replie avec un bruit doux et coûteux. Une lumière chaude. Des rangées de sièges, et des gens dedans, assis très immobiles.',
      V('« Passager Albion ? »') + ' dit une voix que vous connaissez d\'un combiné à 37 000 pieds. ' + V('« Nous faisons de notre mieux. Montez donc. »'),
    ),
    choices: [
      { label: 'Monter. Il fait chaud.', kind: 'comply', do: (G) => G.end('convenience') },
      { label: 'Continuer à marcher. Ne pas regarder la porte.', dreadMax: 75, dd: -14, time: 30, do: (G) => { G.nerves(12); G.flag('toothpaste'); G.nerves(-10); G.dread(8); G.note('Le car est resté au ralenti à côté de vous un long moment, puis non. Le 10-11 était éclairé comme un autel. Du dentifrice. Une brosse à dents. Des chaussettes, par trois, les plus belles chaussettes que vous ayez jamais vues. Vous êtes rentré le sac serré contre la poitrine. Rien ne vous a croisé sur la route. Rien du tout, ce qui était pire, d\'une certaine façon.'); }, next: 'carpark' },
      { label: 'Faire demi-tour. Retourner à l\'hôtel. Vite.', kind: 'comply', dd: 6, time: 15, do: (G) => { G.nerves(8); G.dread(5); G.note('Vous n\'avez pas couru. Vous avez marché, vite, le car derrière vous, au ralenti, à votre rythme, et puis plus. Les portes du hall se sont ouvertes avant que vous les atteigniez.'); }, next: 'carpark' },
    ],
  };

  /* ---- the knock, three ways ---- */
  scenes.knock = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); },
    text: (G) => p(
      G.last(),
      'Quelqu\'un frappe. Pas des coups – on frappe, régulièrement, comme frappe quelqu\'un qui frappera toute la nuit.',
      V('« Car pour les passagers Albion Atlantic. Départ immédiat. Dernier appel. »'),
      'La voix est patiente. La voix est très, très patiente.',
    ),
    choices: [
      { label: 'Ouvrir la porte.', kind: 'comply', sub: 'C\'est peut-être le bus.', do: (G) => G.end('nightcoach') },
      { label: 'Regarder par le judas.', dd: 6, nd: 6, time: 2, do: (G) => { G.nerves(9); G.flag('spyhole'); G.note('Le couloir est vide. La moquette devant votre porte est mouillée. On continue de frapper, régulièrement, de nulle part en particulier.'); }, next: 'knock2' },
      { label: 'Le panneau disait 11h00. Ne pas ouvrir. Ne pas répondre.', nd: 5, dreadMax: 80, time: 20, do: (G) => { G.nerves(5); G.note('Vous êtes resté assis sur le lit, dos à la tête de lit, les yeux sur la porte, à compter les coups. Vous avez perdu le compte à soixante. Puis ils se sont arrêtés, et c\'était pire, pendant un moment.'); }, next: 'window' },
    ],
  };

  scenes.knock2 = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: (G) => p(G.last(), 'Régulier. Patient. Personne.'),
    choices: [
      { label: 'Ouvrir la porte quand même.', kind: 'comply', do: (G) => G.end('nightcoach') },
      { label: 'S\'éloigner de la porte. S\'asseoir sur le lit. Attendre que ça passe.', dreadMax: 88, time: 25, do: (G) => { G.nerves(3); G.note('Ça s\'est arrêté, à la fin, comme la pluie s\'arrête : vous n\'avez pas remarqué le dernier.'); }, next: 'window' },
    ],
  };

  scenes.corridor_knock = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Second floor corridor · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); G.nerves(8); },
    text: (G) => p(
      G.last(),
      'Vous êtes dans le couloir quand ça commence. Tout au bout, près de l\'ascenseur, quelqu\'un en bleu marine frappe à une porte. Régulièrement. Patiemment. Puis la porte suivante. Puis la suivante.',
      'Il avance vers la 214. Il avance vers vous. Il n\'a pas levé les yeux. ' + V('« Car pour les passagers Albion Atlantic. Départ immédiat. Dernier appel. »'),
    ),
    choices: [
      { label: 'Passer devant lui. Rentrer dans votre chambre. Verrouiller.', dreadMax: 80, time: 5, do: (G) => { G.nerves(10); G.dread(8); G.flag('seen'); G.note('Il n\'a pas cessé de frapper quand vous êtes passé. Il ne s\'est pas retourné. Mais au clic de votre carte, il a dit, aimablement, à la porte devant lui : ' + V('« Deux cent quatorze, »') + ' et vous avez mis la chaîne avec des mains qui ne semblaient pas les vôtres.'); }, next: 'window' },
      { label: 'Descendre l\'escalier. Sans bruit. Attendre dans le hall.', dd: 5, dreadMax: 92, time: 15, do: (G) => { G.nerves(6); G.dread(5); G.note('La réceptionniste n\'a pas levé les yeux quand vous êtes descendu. ' + V('« Il vous cherche, »') + ' a-t-elle dit, aux mots croisés. Vous vous êtes assis sur le canapé avec le couple et personne n\'a rien dit pendant longtemps, puis les portes du hall se sont ouvertes pour personne, et refermées.'); }, next: 'window' },
      { label: 'Lui répondre. Vous êtes un passager Albion Atlantic.', kind: 'comply', do: (G) => G.end('nightcoach') },
    ],
  };

  scenes.window = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.S.t = Math.max(G.t, T(1, 4, 50)); G.bot('Bonjour ! Je vois que vous êtes dans la chambre 214. Le car vous attend sur le parking. Merci de ne pas regarder par la fenêtre. 🙂'); },
    text: (G) => p(
      G.last(),
      'De retour dans la chambre, ou toujours dedans. On a cessé de frapper. Votre téléphone éclaire le plafond. Un message d\'Ally.',
      W('Le car vous attend sur le parking. Merci de ne pas regarder par la fenêtre.'),
      'Le rideau est fin. Il y a de la lumière qui passe à travers, et la lumière bouge légèrement, comme bouge la lumière d\'un moteur qui tourne.',
    ),
    choices: [
      { label: 'Regarder.', dd: 10, nd: 8, dreadMax: 90, sub: 'Juste un peu.', time: 5, do: (G) => { G.flag('seen'); G.nerves(14); atLeast(G, 78); }, next: 'window2' },
      { label: 'Non. Poser le téléphone face contre le lit. Tirer la couette par-dessus votre tête.', kind: 'comply', dd: 6, time: 5, do: (G) => G.nerves(2), next: 'sleep' },
    ],
  };

  scenes.window2 = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: p(
      'Un car, bleu marine, avec un écusson doré. Moteur allumé. Toutes les lumières intérieures allumées. Il est plein, et tout le monde dedans est assis parfaitement droit, et chacun d\'eux est tourné vers l\'hôtel.',
      'À la porte du car se tient un homme en uniforme de chef de cabine. Sous vos yeux, il lève la tête – pas vers l\'hôtel. Vers votre fenêtre.',
      'Il ne fait pas signe. Il n\'en a pas besoin. Il l\'a, vous le comprenez, noté.',
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
      G.at(T(1, 7, 35), 'sms', { from: 'Jo 💛', body: 'OMG T\'ES EN ISLANDE ?? faut absolument que tu fasses le blue lagoon. ABSOLUMENT. c\'est genre 20 min de l\'aéroport' });
      G.at(T(1, 8, 5), 'chat', { body: 'Bonjour ! Votre transfert vers l\'aéroport est confirmé pour 08h00. Merci de vous présenter dans le hall. 🚌' });
      G.at(T(1, 9, 40), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Votre transfert vers l\'aéroport', stamp: T(1, 9, 40), body: 'Chère cliente, cher client,\n\nDes cars viendront vous chercher à votre hébergement à 09h00 pour votre vol AB 0271 reprogrammé.\n\nMerci d\'être prêt dans le hall à 08h45.\n\nNous faisons de notre mieux.' });
      G.at(T(1, 9, 55), 'chat', { body: 'Votre car est là. C\'est le joli. 🚌' });
    },
    text: (G) => p(
      G.has('allnighter') ? 'Lumière grise. 07h30. Vous n\'avez pas dormi, et vous êtes toujours en Islande.' : 'Lumière grise. 07h30. Vous avez dormi, ou quelque chose comme ça, et vous êtes toujours en Islande.',
      'Le petit-déjeuner, c\'est du skyr, du pain, et un café qui a le goût d\'avoir été fait par quelqu\'un à qui on a décrit le café. La salle est pleine de votre vol. Tout le monde porte ce qu\'il portait hier. Tout le monde compare ses notes : quel hôtel, quelle heure de départ, lequel des trois messages contradictoires on a choisi de croire.',
      'Le panneau imprimé est toujours scotché au comptoir. 11h00. Quelqu\'un a dessiné un petit cœur dessus.',
    ),
    choices: [{ label: 'Prendre un deuxième café quand même.', time: 10, next: 'hotel_morning' }],
  };

  scenes.hotel_morning = {
    art: 'lobby',
    loc: 'Hótel Hraun · Hall',
    enter: (G) => {
      if (G.t >= T(1, 10, 15)) { G.go('buses2'); return; }
      if (G.once('morn_intro')) G.note('En gros, tout a été minuté pour être le plus pénible possible sans vous laisser la liberté d\'aller faire quelque chose d\'agréable dans l\'intervalle. Trois heures, et rien à en faire sinon attendre un bus qui est peut-être ou peut-être pas le bus.');
    },
    text: (G) => hub(G,
      `Le hall. ${G.clock(G.t)}. Le panneau dit 11h00. ${G.t >= T(1, 9, 45) ? 'Le mail disait 09h00 et il est arrivé à 09h40. ' : G.t >= T(1, 8, 5) ? 'Le chatbot disait 08h00. Il est plus de 08h00. ' : ''}Personne n'a vu un bus qui soit le vôtre.`,
      'morning'),
    choices: (G) => [
      { label: 'Montrer le QR code UK261 à tous les passagers à portée.', dd: -8, nd: -4, nerveMax: 90, sub: 'En précisant que la compagnie contestera.', if: (G) => G.has('uk261'), once: 'qr1', time: 20, do: (G) => { G.collect(2); G.nerves(-5); G.note('Vous allez de table en table, le téléphone tendu comme un mandat. Les gens le photographient. Une femme avec un bagel dit : ' + V('« Je suis prête à jouer les Karen. »') + ' Quelqu\'un applaudit, une fois.'); }, next: 'hotel_morning' },
      { label: 'Comparer vos notes avec les autres.', dd: -5, nd: -4, nerveMax: 85, time: 20, once: 'notes1', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_notes'); G.note('Quatre hôtels. Six heures de départ. Une feuille imprimée. Un homme avec une casquette des Blazers : ' + V('« Ceux avec l\'écusson, c\'est pas les nôtres. Je sais pas à qui ils sont. Pas les nôtres. »') + ' Tout le monde hoche la tête, comme si on le savait déjà.'); }, next: 'hotel_morning' },
      { label: 'Demander à la réception si 11h00 est exact.', kind: 'comply', dd: 2, time: 10, once: 'recep', do: (G) => { G.nerves(1); G.note('La même réceptionniste. Toujours. Elle désigne le panneau. ' + V('« Un autre passager les a appelés. Ils ont dit oui. »') + ' Un silence. ' + V('« Ou ils ont dit quelque chose. »')); }, next: 'hotel_morning' },
      { label: 'Remonter à la chambre. Une douche. Au moins se laver le visage.', nerveMax: 92, time: 25, once: 'morn_shower', do: (G) => { G.nerves(-5); G.note('De l\'eau chaude. Les mêmes vêtements. La chambre, à la lumière du jour, n\'est qu\'une chambre : les shampoings, la bouilloire, la fenêtre sur un parking avec un car dedans. Vous ne regardez pas longtemps.'); }, next: 'hotel_morning' },
      { label: 'Parler à la mère de l\'enfant.', nd: -3, dd: -3, nerveMax: 80, time: 10, once: 'morn_mother', do: (G) => { G.collect(1); G.nerves(-3); G.note(V('« Elle voudrait être à la maison maintenant, »') + ' dit la mère, de l\'enfant, qui est sous la table. ' + V('« Moi aussi. Vous avez entendu frapper, cette nuit ? »') + ' Vous dites oui. Elle dit : ' + V('« Nous non plus, on n\'a pas ouvert. »')); }, next: 'hotel_morning' },
      { label: 'Vérifier le statut du vol sur le site de la compagnie.', dd: 3, nd: 3, time: 8, do: (G) => { const n = G.count('status'); G.dread(2); G.note(n === 1 ? 'AB 0271 · KEF → LAX · 15h10 · À L\'HEURE. À l\'heure pour quoi, ce n\'est pas dit.' : n === 2 ? 'AB 0271 · 15h10 · À L\'HEURE. Puis, sous vos yeux, 15h25. Puis 15h10 à nouveau.' : 'La page ne charge pas. Puis elle charge, et le vol n\'y est pas. Puis il y est. 15h10. Vous rangez le téléphone avant que ça change encore.'); }, next: 'hotel_morning' },
      { label: 'Sortir chercher le car de 09h00.', kind: 'comply', dd: 5, if: (G) => G.t >= T(1, 8, 50) && G.t < T(1, 10, 0), time: 10, next: 'decoy_morning' },
      { label: 'Aller aux sources chaudes. Vous en avez toujours rêvé.', sub: 'C\'est à vingt minutes. Tout le monde le dit.', do: (G) => G.end('tantalus') },
      { label: 'Attendre dans le hall.', kind: 'comply', dd: 3, nd: 2, sub: 'Une demi-heure.', time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Une demi-heure. La machine à café, les portes, le panneau. Un enfant compte jusqu\'à cent et recommence.', 'Une demi-heure. Le réveil de quelqu\'un sonne – réglé sur l\'heure de Los Angeles – et tout le monde rit, puis plus personne.', 'Une demi-heure. Dehors, un car arrive, n\'est pas le vôtre, et repart. Vous ne vous levez pas. Personne ne se lève.'])); }, next: 'hotel_morning' },
    ],
    status: (G) => (G.has('hint_notes') ? 'Ouï-dire : tout le monde a reçu des heures différentes de la compagnie. Tout le monde s\'en tient à la feuille imprimée. Les cars avec l\'écusson « c\'est pas les nôtres ».' : ''),
  };

  scenes.decoy_morning = {
    art: 'carpark',
    loc: 'Hótel Hraun · Parking',
    text: p(
      'Il y a un car. Bleu marine, écusson doré, moteur allumé. L\'afficheur LED à l\'avant dit AIRPORT TRANSFER · ALBION ATLANTIC. Le chef de cabine se tient à la porte, les mains jointes, et quand il vous voit, il sourit comme si vous étiez exactement à l\'heure.',
      'Personne d\'autre n\'est sorti du hall. À travers les vitres, les passagers déjà à bord sont assis bien droits dans des chemises propres et regardent le vide.',
    ),
    choices: [
      { label: 'Monter. Le mail disait bien 09h00.', kind: 'comply', do: (G) => G.end('crew') },
      { label: 'Rentrer. N\'en parler à personne.', dreadMax: 85, time: 5, do: (G) => { G.nerves(6); G.dread(5); G.note('Vous êtes rentré. Personne n\'a demandé. À travers la vitre, le car est resté où il était, porte ouverte, longtemps.'); }, next: 'hotel_morning' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 10:15 bus stand 2 */
  scenes.buses2 = {
    art: 'carpark',
    loc: 'Hótel Hraun · Parking',
    enter: (G) => { if (G.t < T(1, 10, 15)) G.S.t = T(1, 10, 15); G.dread(4); },
    text: (G) => p(
      'Quelqu\'un dit qu\'il y a un bus dehors. Vous demandez à la réceptionniste si c\'est le vôtre. Elle ne sait pas. Elle désigne le panneau en Arial. ' + V('« Vous devriez peut-être vous dépêcher. »'),
      'Imaginez une jauge de jeu vidéo, mais pour vos nerfs, qui descend jusque dans la zone du mince éclat rouge tremblant.',
      'Dehors : des cars. Personne ne vous a dit lequel. Aucun ne porte votre numéro de vol, sauf celui qui le porte, au feutre.',
      G.has('hint_notes') && W('« Ceux avec l\'écusson, c\'est pas les nôtres. »'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: '#c7c3b6', windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'day' },
        name: 'Le même car blanc qu\'hier soir, ou un qui lui ressemble beaucoup',
        sign: G.pick(['AIRPORT', 'AB0271 → KEF', 'FLIGHT PPL AIRPORT']), signStyle: 'paper',
        look: ['Chauffeur en gilet fluo. Sandwich différent.', 'À moitié plein. Des gens sortent encore du hall pour y aller.'],
        hidden: ['La polaire. L\'enfant. L\'homme du 31C. Les mêmes vêtements qu\'hier soir, évidemment, qu\'est-ce qu\'ils porteraient d\'autre.', 'Vous n\'êtes pas physionomiste. Ceux-là, vous les connaissez.'],
        board: { time: 5, do: (G) => G.flag('bus2_ok'), next: 'ride2' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'day' },
        name: 'Un car bleu marine avec un écusson doré',
        sign: 'AIRPORT TRANSFER · ALBION ATLANTIC', signStyle: 'led',
        look: ['Le chef de cabine à la porte. Il vous fait signe. Il sait laquelle était votre fenêtre.', 'Chaud. Silencieux. Plein de place.'],
        hidden: ['Personne à bord n\'a l\'air d\'avoir dormi habillé. Personne n\'a l\'air d\'avoir dormi.', 'Personne à bord n\'a son téléphone à la main.'],
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const lagoon = {
        key: 'lagoon',
        art: { livery: '#3e9c9a', windows: 'cold', passengers: 'few', sign: 'print', driver: 'plain', ground: 'day' },
        name: 'Un minibus turquoise',
        sign: 'BLUE LAGOON SHUTTLE — Relax. You deserve it.', signStyle: 'print',
        look: ['Chauffeur avec une pile de serviettes blanches.', 'Ça sent le soufre et l\'eucalyptus.'],
        hidden: ['Tout le monde à bord a des chaussettes propres.', 'Il part dans deux minutes. Il part toujours dans deux minutes.'],
        board: { do: (G) => G.end('tantalus') },
      };
      return G.shuffle([correct, crest, lagoon]);
    },
    choices: [
      { label: 'Attendre. Il n\'est pas encore 11h00. Le panneau disait 11h00.', kind: 'comply', dd: 6, nd: 6, sub: 'Le panneau est la seule chose qui ait eu raison jusqu\'ici.', time: 45, next: (G) => (G.t >= T(1, 11, 25) ? 'end:noshow' : 'buses2'), do: (G) => { G.nerves(8); G.dread(5); } },
    ],
  };

  scenes.ride2 = {
    art: 'road',
    loc: 'Route 41 · vers Keflavík',
    enter: (G) => {
      G.flag('left_hotel');
      if (G.once('nofood')) { if (G.rng() < 0.5) G.at(T(1, 12, 30), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Restauration à bord de votre vol', body: 'Chère cliente, cher client,\n\nVeuillez noter qu\'en raison du déroutement, aucun service de restauration ne sera assuré sur le vol AB 0271.\n\nNous vous recommandons d\'acheter de quoi vous restaurer dans le terminal.\n\nNous faisons de notre mieux.' }); }
      G.at(T(1, 12, 0), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Heure de départ révisée', body: 'Chère cliente, cher client,\n\nVotre vol AB 0271 partira désormais à 15h45.\n\nL\'enregistrement ouvre trois heures avant le départ.\n\nNous faisons de notre mieux.', fx: (G) => { G.S.dep = T(1, 15, 45); } });
      G.at(T(1, 13, 10), 'chat', { body: 'Vous avez été hébergé. Pourquoi faites-vous la queue ? 🙂' });
    },
    text: p(
      'Vous supposez être au bon endroit uniquement parce que vous commencez à reconnaître d\'autres passagers, alors que vous n\'êtes pas physionomiste. Le bus part avec vingt minutes de retard, ce qui, d\'après vos calculs, signifie que vous arriverez à l\'aéroport à peine quarante minutes avant l\'ouverture de l\'enregistrement.',
      'Un bébé hurle. La mère murmure : ' + V('« Elle voudrait être à la maison maintenant, »') + ' et tout le bus rit, tristement.',
      'L\'Islande défile par la vitre : une eau du robinet excellente, de beaux paysages, des gens raisonnablement aimables qui ne sont pas forcément utiles mais ne vous menacent pas et ne vous mentent pas. Un grand bravo à l\'Islande pour ça. Keflavík est innocent.',
    ),
    choices: [{ label: 'Arriver.', time: 55, do: (G) => G.nerves(-4), next: 'airport' }],
  };

  /* ---------------------------------------------------------------- Day 1 · ~11:30 the airport (hub) */
  scenes.airport = {
    art: 'airport',
    loc: 'Aéroport international de Keflavík · Départs',
    enter: (G) => {
      G.flag('at_airport2'); atLeast(G, 45);
      if (G.once('counter_paper')) G.msg('paper', { from: 'Feuille A4, fixée par un collier de serrage à une barrière', subj: 'Panneau imprimé', body: '<b>ALBION ATLANTIC AB0271</b>\n\nCounter opens <b>3 HOURS</b> before departure.\n\nIf departure is delayed, counter opening is delayed.\n\nPlease queue here.' });
      if (G.once('ap_intro')) G.note('Il y a un (1) comptoir Albion Atlantic dans l\'aéroport, et une file devant, entièrement composée de gens que vous connaissez maintenant de vue. Le comptoir n\'est pas ouvert. Une feuille A4 dit qu\'il ouvrira trois heures avant le départ, pas une minute plus tôt, et que si le vol est retardé, le comptoir l\'est aussi.');
      const open = G.S.dep - 180;
      if (G.t >= open && G.has('inline')) G.go('checkin');
    },
    text: (G) => {
      const open = G.S.dep - 180;
      return hub(G,
        `Départs. ${G.clock(G.t)}. Le tableau dit AB 0271 · LOS ANGELES · <em>${G.clock(G.S.dep)}</em>. ${G.t < open ? `D'après l'arithmétique de la feuille, le comptoir ouvre à ${G.clock(open)}.` : G.has('inline') ? 'Le rideau se lève.' : 'Le comptoir est ouvert. La file avance. Vous n\'y êtes pas.'}`,
        'airport',
        G.has('seen') && G.D >= 5 ? W('Vous continuez de chercher un uniforme de chef de cabine. Vous n\'en avez pas vu. Ce n\'est pas la même chose qu\'il n\'y en ait pas.') : '');
    },
    choices: (G) => [
      { label: 'Imprimer une nouvelle carte d\'embarquement à la borne.', nd: 4, dd: 2, time: 8, do: (G) => { const n = G.count('kiosk'); G.nerves(3); G.note(n === 1 ? 'RÉSERVATION INTROUVABLE. Vous changez de borne. Vous saisissez les infos. RÉSERVATION INTROUVABLE, dans une autre police. On n\'invente pas ça.' : n === 2 ? 'La borne réfléchit longtemps et imprime une carte vierge. Vous la gardez. Vous ne savez pas pourquoi.' : 'VOTRE RÉSERVATION A ÉTÉ HÉBERGÉE. Puis l\'écran s\'éteint et vous montre votre visage.'); if (n >= 3) G.dread(3); }, next: 'airport' },
      { label: 'Rejoindre la file de l\'unique comptoir.', if: (G) => !G.has('inline'), time: 5, do: (G) => { G.flag('inline'); G.note('Vous rejoignez la file. Ce n\'est pas tant une file qu\'une décision prise ensemble par deux cents personnes. Personne dedans ne parle à la compagnie. Tout le monde dedans se parle.'); }, next: 'airport' },
      { label: 'Faire circuler le QR code UK261 dans la file.', dd: -6, nd: -4, nerveMax: 90, if: (G) => G.has('uk261'), once: 'qr2', time: 15, do: (G) => { G.collect(2); G.nerves(-5); G.note('Le code descend la file comme un mot de passe. ' + V('« Je suis prêt à jouer les Karen, »') + ' dit un homme en polaire, qui est l\'homme en polaire.'); }, next: 'airport' },
      { label: 'Comparer les hôtels et les heures de départ.', nd: -4, dd: -4, nerveMax: 85, once: 'notes2', time: 15, do: (G) => { G.collect(1); G.nerves(-3); G.note('Tout le monde a été envoyé ailleurs. Tout le monde a reçu une heure différente. Tout le monde est revenu quand même, parce que la feuille le disait, et vous voilà tous, à avoir raison ensemble.'); }, next: 'airport' },
      { label: 'Trouver quelqu\'un en uniforme et lui dire exactement ce que vous pensez.', kind: 'conflict', nd: 8, time: 10, do: (G) => { G.strike(); G.note('Vous avez dit à un homme en uniforme exactement ce que vous pensez. ' + V('« Nous faisons de notre mieux. »') + ' Pas de pardon. Pas de compassion. Même pas pour la forme. Il a noté quelque chose.'); }, next: 'airport' },
      { label: 'Chercher la sortie. Juste pour voir.', dd: 6, dreadMax: 85, time: 8, once: 'exit', do: (G) => { G.dread(5); G.nerves(4); G.note('Les portes vers l\'extérieur disent ARRIVÉES UNIQUEMENT. Vous êtes entré par là. Vous posez la main sur la vitre et elle ne s\'ouvre pas, et un homme en gilet fluo, sans vous regarder, secoue la tête.'); }, next: 'airport' },
      { label: 'Acheter de l\'eau. L\'homme derrière vous ne leur fait pas confiance pour ne pas en manquer.', nd: -4, nerveMax: 92, time: 10, once: 'water', do: (G) => { G.nerves(-3); G.note('De l\'eau, un sandwich avec la lettre ð dedans, et – parce que la boutique en a – des chaussettes. Vous aviez des chaussettes. Vous en achetez d\'autres. Personne qui a traversé cette nuit ne vous jugerait.'); if (!G.has('toothpaste')) { G.flag('toothpaste'); G.nerves(-4); } }, next: 'airport' },
      { label: 'Regarder le tableau des départs.', dd: 3, nd: 3, time: 6, do: (G) => { const n = G.count('board'); G.dread(2); G.note(n === 1 ? `AB 0271 · LOS ANGELES · ${G.clock(G.S.dep)}. Puis le tableau fait défiler tous les vols du monde et revient dessus. Même heure. Pour l'instant.` : n === 2 ? 'L\'heure n\'a pas changé. La ligne est descendue. Tout ce qui est au-dessus est un vol vers quelque part qui part.' : 'Vous le regardez défiler. LOS ANGELES. LOS ANGELES. Pendant une seule image, quelque chose qui n\'est pas une ville. LOS ANGELES.'); }, next: 'airport' },
      { label: 'Attendre.', kind: 'comply', nd: 3, dd: 3, nerveMax: 90, time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Une demi-heure. La file n\'avance pas parce qu\'il n\'y a rien vers quoi avancer. Quelqu\'un s\'assied par terre et ça se propage.', 'Une demi-heure. Un agent d\'entretien passe avec une machine. Quand elle est partie, le sol est pareil et la file un peu plus courte.', 'Une demi-heure. Votre téléphone vibre sur rien. Celui de tout le monde, en même temps, et tout le monde regarde, et personne ne dit rien.'])); }, next: 'airport' },
    ],
  };

  scenes.checkin = {
    art: 'airport',
    loc: 'Keflavík · L\'unique comptoir',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 180); if (G.S.strikes >= 3) G.end('left'); },
    text: (G) => p(
      'Le comptoir ouvre à l\'heure, c\'est-à-dire à l\'heure qu\'il avait décidée en privé. L\'agent prend votre passeport. Personne en uniforme n\'a été le moins du monde désolé de toute la journée, même pour la forme, et cet homme ne rompra pas la série. ' + V('« Nous faisons de notre mieux. »'),
      G.has('booked') && 'Il fronce les sourcils devant l\'écran. ' + V('« Nos dossiers indiquent que vous avez été hébergé au Heathrow Renaissance Lodge la nuit dernière. »') + ' Il tape quelque chose. Il dit que c\'est noté.',
      G.has('objected') && W('Il jette un œil à une petite carte accrochée au moniteur, puis à vous.'),
      G.has('seen') && W('Il vous regarde un peu trop longtemps. ' + V('« Chambre 214, »') + ' dit-il, et ce n\'est pas une question.'),
      'Une carte d\'embarquement, tiède de l\'imprimante. Porte 12. Elle est réelle. Vous la vérifiez trois fois.',
    ),
    choices: [
      { label: 'Aller à la porte d\'embarquement.', time: 40, do: (G) => { if (G.has('booked')) G.strike(); G.nerves(-6); }, next: 'gate' },
    ],
  };

  scenes.gate = {
    art: 'gate',
    loc: 'Keflavík · Porte 12',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 60); G.dread(5); G.at(G.t + 20, 'chat', { body: 'La majorité des clients ont embarqué. 🙂' }); },
    text: p(
      'Vous voyagez maintenant depuis plus de vingt-quatre heures avec ces gens. Vous connaissez la polaire. Vous connaissez l\'enfant. Vous connaissez l\'homme du 31C, et le couple qu\'on a envoyé dans un hôtel à l\'opposé, et l\'homme qui ne fait sincèrement pas confiance à la compagnie pour ne pas manquer d\'eau.',
      'Une agente d\'embarquement prend le micro et vous <em>hurle</em> d\'embarquer par groupe.',
      'Et cent personnes lui rient au nez. Pas méchamment. Juste – sans pouvoir s\'en empêcher. Vous formez à ce stade une société autogérée, et sa tentative de lui donner des ordres est, on ne sait pourquoi, la chose la plus drôle de la journée.',
    ),
    choices: [
      { label: 'Rire avec eux.', nd: -6, dd: -4, nerveMax: 85, time: 10, do: (G) => { G.collect(1); G.nerves(-6); }, next: 'jetbridge' },
      { label: 'Embarquer par groupe, docilement.', kind: 'comply', dd: 5, time: 10, do: (G) => G.nerves(2), next: 'jetbridge' },
      { label: 'Lui demander quand le vol partira vraiment.', kind: 'conflict', nd: 5, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) G.end('left'); }, next: 'jetbridge' },
      { label: 'Crier en retour. Plus fort qu\'elle.', kind: 'conflict', nerveMin: 80, nd: 10, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) G.end('left'); else G.note('Vous avez crié. Pendant quatre secondes, c\'était magnifique. Puis un homme en bleu marine est apparu à votre coude, a noté quelque chose, et s\'en est allé, et les rires s\'étaient arrêtés.'); }, next: 'jetbridge' },
    ],
  };

  scenes.jetbridge = {
    art: 'gate',
    loc: 'Keflavík · Passerelle',
    text: p(
      'La file s\'arrête sur la passerelle. On a déjà dépassé l\'heure de départ de votre carte d\'embarquement, et c\'est la plus récente. Vous échangez avec l\'homme devant vous sur les informations contradictoires que chacun a reçues sur ce à quoi ressemblera le vol.',
      'Puis la file avance, vous tournez au coin, et au lieu d\'une porte d\'avion il y a…',
      '<em>Un bus.</em>',
      W('Et il fallait embarquer par groupe.'),
    ),
    choices: [{ label: 'Monter dans le bus.', time: 10, next: 'tarmac' }],
  };

  scenes.tarmac = {
    art: 'tarmac',
    loc: 'Un bus · une route · des pâturages vallonnés',
    enter: (G) => G.dread(5),
    text: (G) => p(
      'Ce bus ne vous emmène pas ailleurs sur le tarmac. Ce bus est sur ce qui a tout l\'air d\'une vraie route, à travers de vrais pâturages vallonnés, avec de vrais moutons dedans.',
      G.has('seen') ? 'À l\'avant du bus, debout, tenant la barre, un homme en uniforme de chef de cabine. Il se retourne. Il vous regarde – vous seul – exactement aussi longtemps qu\'il a regardé votre fenêtre. ' + V('« Vous avez regardé, »') + ' dit-il, aimablement, et se retourne.' : 'Le chauffeur ne parle pas. La radio passe quelque chose qui est peut-être la météo.',
      'Personne ne dit rien. Quelqu\'un, vers le fond, commence à rire, et s\'arrête.',
    ),
    choices: [
      { label: 'Rester à bord. Guetter à l\'horizon quoi que ce soit avec des ailes.', kind: 'comply', dd: 5, time: 15, next: 'plane' },
      { label: 'Aller devant. Demander au chauffeur où va ce bus.', kind: 'conflict', nd: 4, time: 15, do: (G) => { G.nerves(5); G.flag('asked_driver2'); }, next: 'plane' },
      { label: 'Exiger de descendre. Maintenant.', kind: 'conflict', sub: 'Ce n\'est pas le tarmac.', do: (G) => G.end('pastures') },
    ],
  };

  scenes.plane = {
    art: 'plane',
    loc: 'Une aire de stationnement · quelque part',
    text: (G) => p(
      G.has('asked_driver2') && W('Il a pointé devant lui, à travers le pare-brise, vers le pâturage. Puis le pâturage s\'est arrêté.'),
      'Vous croyez voir votre avion. Donc vous n\'avez probablement pas été kidnappé.',
      'On vous fait la queue dehors, pas à pas, au pied de l\'escalier. Et alors il se met à pleuvoir. Vous riez tout haut, notamment parce que vous avez déjà, évidemment, dépassé l\'heure de départ.',
      'Siège. Ceinture. La voix distinguée, au combiné : ' + V('« La majorité de nos clients se sont montrés compréhensifs et patients. »') + ' Il continue en se félicitant, assez longuement, des procédures de sécurité qui vous ont amenés en Islande.',
      'Puis il explique comment demander un remboursement. Vous vous redressez. C\'est pour le wifi à bord.',
      'Vous ne le ferez pas.',
    ),
    choices: [
      { label: 'Fermer les yeux.', do: (G) => G.end(G.S.collective >= 5 ? 'collective' : 'home') },
    ],
  };

  /* ================================================================ endings */
  const endings = {
    terminal: {
      art: 'terminal', title: 'LE TERMINAL', kind: 'bad',
      hint: 'Quelqu\'un fait toujours une annonce.', blurb: 'Vous avez attendu l\'annonce.',
      text: p(
        'Personne ne fait d\'annonce. Personne n\'allait jamais en faire. À 03h10, les lumières du hall des arrivées passent au quart, et le hall n\'est plus qu\'une forme dont vous vous souvenez plutôt que vous ne la voyez.',
        'Votre téléphone affiche une barre et un nouveau mail. <em>Nous avons organisé des cars pour vous.</em> Il ne dit pas où. Il ne le dira jamais.',
        'Le matin, les agents d\'entretien trouvent une carte d\'embarquement et la déposent aux objets trouvés. Ils sont très consciencieux pour ça, ici.',
      ),
    },
    accommodated: {
      art: 'road', title: 'HÉBERGÉ', kind: 'bad',
      hint: 'Le mail avait le logo.', blurb: 'Vous avez confirmé la réservation.',
      text: p(
        'La voiture est chaude, les sièges sont en cuir et le chauffeur ne parle pas. L\'écran du tableau de bord dit HEATHROW RENAISSANCE LODGE · 1 894 km · ARRIVÉE —:—.',
        'Vous regardez les lumières de l\'aéroport rapetisser. Au bout d\'un moment il n\'y a plus de lumières du tout – seulement le bruit des pneus, et le petit carillon d\'un nouveau mail, arrivé pour confirmer que votre hébergement a été organisé.',
      ),
    },
    crew: {
      art: 'stand', title: 'L\'ÉQUIPAGE', kind: 'bad',
      hint: 'Il avait un écusson. Il était très joli.', blurb: 'Vous êtes monté dans le joli.',
      text: p(
        'Le car sent la sellerie neuve et rien d\'autre. Tout le monde vous sourit quand vous passez. Personne ne porte les vêtements d\'hier, parce que personne ici n\'a d\'hier.',
        'Le chef de cabine ferme la porte avec un bruit doux et coûteux. ' + V('« La majorité de nos clients se sont montrés compréhensifs et patients. »') + ' C\'est de vous qu\'il parle. Vous avez été compréhensif. Vous avez été très patient.',
        'Le car sort de la lumière, et l\'arrêt derrière lui est vide, et l\'est depuis un certain temps.',
      ),
    },
    convenience: {
      art: 'road', title: 'COMMODITÉ', kind: 'bad',
      hint: 'Vingt minutes à pied. Dans cet état.', blurb: 'Vous êtes monté, à mi-chemin du 10-11.',
      text: p(
        'Il fait chaud dans le car, et les sièges sont tournés vers l\'intérieur, ce que vous n\'aviez pas remarqué avant de vous asseoir. ' + V('« Nous faisons de notre mieux, »') + ' dit le chef de cabine, et la porte se replie, et le 10-11 défile sur la gauche, toutes lumières allumées, sans personne dedans.',
        'Vous n\'aurez jamais de dentifrice.',
      ),
    },
    nightcoach: {
      art: 'corridor', title: 'CAR DE NUIT', kind: 'bad',
      hint: 'Dernier appel.', blurb: 'Vous avez répondu aux coups à la porte.',
      text: p(
        'Le couloir est vide et la moquette est mouillée. Depuis la cage d\'escalier : ' + V('« Départ immédiat. »') + ' Vous suivez, parce que c\'est la seule consigne de toute la nuit qui soit venue avec une heure.',
        'Le car sur le parking attend, lumières intérieures allumées. Tout le monde dedans est déjà tourné vers l\'hôtel. Il y a un siège à votre nom. Il y a, de fait, une petite carte imprimée à votre nom, en Arial.',
      ),
    },
    lift: {
      art: 'corridor', title: 'L\'ASCENSEUR', kind: 'bad',
      hint: 'Hors service, en Arial.', blurb: 'Vous êtes entré dans l\'ascenseur qui est venu tout seul.',
      text: p(
        'Les portes se ferment avec la courtoisie d\'un bon hôtel. Le miroir du fond vous montre : les vêtements d\'avion, le visage, le petit sac du 10-11 si vous l\'avez. L\'ascenseur descend. Il descend plus longtemps que le bâtiment n\'a d\'étages.',
        'Quand les portes s\'ouvrent, c\'est sur une lumière chaude et des rangées de sièges, et tous ceux qui y sont assis se tournent vers vous, et sourient, et le chef de cabine dit : ' + V('« Merci de votre patience, »') + ' et il le pense.',
      ),
    },
    tantalus: {
      art: 'carpark', title: 'TANTALE', kind: 'bad',
      hint: 'Vous avez toujours voulu visiter l\'Islande.', blurb: 'Vous êtes allé aux sources chaudes.',
      text: p(
        'L\'eau est à 38 °C, le ciel a la couleur d\'un mouchoir usagé et vous portez les chaussettes du vol parce que vous n\'avez pas d\'autres chaussettes. C\'est, objectivement, magnifique.',
        'À 11h00, un bus quitte le parking d\'un hôtel à trente kilomètres de là, sans vous. À 11h04, un mail arrive pour dire que votre car est parti à 09h00. À 11h05, le chatbot demande si vous avez apprécié votre séjour.',
        'Vous auriez préféré ne pas tenir cette patte de singe quand vous l\'avez dit.',
      ),
    },
    noshow: {
      art: 'lobby', title: 'NO-SHOW', kind: 'bad',
      hint: 'Le panneau disait 11h00.', blurb: 'Vous avez attendu l\'heure exacte du panneau.',
      text: p(
        'À 11h30, le panneau a été retiré. La réception ne se souvient pas de l\'avoir mis. ' + V('« Vous étiez avec le groupe de la compagnie ? Ils sont partis. »') + ' Elle le dit gentiment.',
        'La machine à café du hall fait un bruit de quelque chose qui s\'éclaircit la gorge. Votre réservation, quand vous vérifiez, est introuvable.',
      ),
    },
    left: {
      art: 'airport', title: 'LAISSÉ SUR PLACE', kind: 'bad',
      hint: 'Il l\'avait bien dit.', blurb: 'Trois réclamations, toutes notées.',
      text: p(
        V('« Nous avons noté vos remarques, »') + ' dit l\'homme en uniforme, et il se trouve que c\'est vrai ; toutes, sur une petite carte, d\'une écriture soignée. Elle porte trois coches.',
        V('« Comme annoncé à bord, les clients qui résistent ou s\'opposent aux décisions opérationnelles peuvent être débarqués. »') + ' Il dit cela sans la moindre méchanceté, ce qui est le pire. Puis il demande au passager suivant d\'avancer, et la file se referme sur vous comme de l\'eau.',
      ),
    },
    pastures: {
      art: 'tarmac', title: 'PÂTURAGES', kind: 'bad',
      hint: 'Ce bus est sur une vraie route.', blurb: 'Vous êtes descendu du bus du tarmac.',
      text: p(
        'Le bus s\'arrête, ce que vous vouliez. La porte s\'ouvre sur une aire de repos, une clôture, des moutons, et un vent venu de loin pour vous accueillir. ' + V('« Comme vous voudrez, »') + ' dit le chauffeur, et le bus repart sans vous, vers quelque chose qui pourrait, à cette distance, être un avion.',
        'L\'Islande n\'a rien fait de mal. Les moutons sont très gentils.',
      ),
    },
    home: {
      art: 'plane', title: 'CHEZ VOUS (OU AU GROENLAND, OU EN ENFER)', kind: 'good',
      hint: 'À bientôt à Los Angeles.', blurb: 'Vous y êtes arrivé. Seul, surtout.',
      text: p(
        'Vous êtes dans un siège. Le siège est dans un avion. L\'avion, pour autant que vous puissiez en juger, se déplace en direction de Los Angeles.',
        'Personne en uniforme n\'a jamais dit pardon. Le remboursement du wifi reste non réclamé.',
        'À dans dix heures à Los Angeles. Ou au Groenland. Ou en enfer.',
      ),
    },
    collective: {
      art: 'plane', title: 'LE COLLECTIF AUTOGÉRÉ DE LHR–LAX', kind: 'good',
      hint: 'Le ouï-dire n\'est pas un canal officiel.', blurb: 'Vous y êtes arrivé, et tous ceux à qui vous avez parlé aussi.',
      text: p(
        'Sur l\'escalier, quelqu\'un rit, puis tout le monde, et la pluie n\'a plus d\'importance. Vous voyagez ensemble depuis plus de vingt-huit heures. Vous avez un QR code, un homme en polaire, un homme du 31C, et un enfant qui a vu des choses.',
        'Les informations les plus exactes et les plus utiles de toute cette épreuve sont venues de feuilles imprimées en Arial et de passagers inconnus colportant des ouï-dire. Personne en uniforme n\'a jamais dit pardon. Il s\'avère que vous n\'en aviez pas besoin.',
        'À bientôt à Los Angeles. Au nom du collectif autogéré de LHR–LAX, vous souhaitez bon rétablissement à l\'homme en soins intensifs.',
      ),
    },
  };

  /* ================================================================ interface strings */
  const ui = {
    tabMail: 'Mails', tabAlly: 'Ally', tabSms: 'SMS', tabPaper: 'Papier', phone: 'TÉLÉPHONE',
    nerves: 'NERFS', dread: 'EFFROI', noted: 'NOTÉ', day: 'JOUR',
    board: 'Monter', look: 'Regarder de près', lookHint: 'Coûte quelques minutes.',
    again: 'Revoler', endings: 'Fins', back: 'Retour', howto: 'Comment ça marche', start: 'Monter',
    gameOver: 'GAME OVER', madeIt: 'VOUS Y ÊTES ARRIVÉ — PLUS OU MOINS',
    subtitle: 'UNE HORREUR HÔTELIÈRE · TEXTE · 20–30 MINUTES',
    galleryIntro: 'Toutes les façons dont ça peut finir. Celles qui sont verrouillées sont encore là-dehors.', locked: '???',
    noMail: 'Pas de mail. Ça, au moins, c\'est normal.', noSms: 'Pas de messages.', noPaper: 'Photos des panneaux imprimés que vous trouvez. Vous en trouverez.',
    allyIntro: 'Ally — assistante virtuelle Albion Atlantic. Répond généralement instantanément.', inbox: '‹ Boîte de réception',
    emailFoot: 'Ceci est un message automatique. Les réponses à cette adresse ne sont ni surveillées, ni lues, ni possibles. Albion Atlantic — Nous faisons de notre mieux.',
    from: 'De :', sent: 'Envoyé', received: 'Reçu', arrived: 'arrivé', photographed: 'Photographié',
    tMail: 'MAIL', tSms: 'SMS', tPaper: 'PAPIER', tAlly: 'ALLY', tNoted: 'NOTÉ · La compagnie a enregistré vos remarques.',
    gateNerves: 'Vous n\'arriveriez pas à garder une voix posée pour ça.', gateDread: 'Vous n\'arrivez pas à vous y résoudre.',
  };

  return { start, scenes, endings, chat, ui, T, lang: 'fr' };
})();
