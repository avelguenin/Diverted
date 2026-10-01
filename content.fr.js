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
  const CONTENT_BROKEN = {"“He asked for you.”": "« Il a demandé… vous. »", "“Don't follow the emails,”": "« Pas suivre les mails, »", "“There are buses.”": "« Il y a des bus. »", "“Yes, 214?”": "« Oui, 214 ? »", "“Eleven. It says eleven. Maybe you should sleep.”": "« Onze. C'est écrit onze. Peut-être vous dormir. »", "“No. Sorry. The 10-11 has. Twenty minutes, walking.”": "« Non. Désolée. Le 10-11, oui. Vingt minutes, à pied. »", "“Maybe not tonight.”": "« Peut-être pas ce nuit. »", "“Eleven.”": "« Onze. »", "“A passenger phoned them. They said yes.”": "« Un passager a téléphoné eux. Ils ont dit oui. »", "“Or they said something.”": "« Ou ils ont dit… quelque chose. »", "“Eleven,”": "« Onze, »", "“You are in 214,”": "« Vous êtes dans 214, »", "“One is outside,”": "« Un est dehors, »", "“It is not yours.”": "« Il est pas le vôtre. »", "“Somebody came asking for you. In a uniform. I said you were asleep.”": "« Quelqu'un est venu, il demande vous. En uniforme. J'ai dit vous dormez. »", "“I know.”": "« Je sais. »", "“No coach. Eleven. Please, go up and sleep.”": "« Pas de car. Onze. S'il vous plaît, monter et dormir. »", "“He is looking for you,”": "« Il cherche vous, »", "“Another passenger phoned them. They said yes.”": "« Un autre passager a téléphoné. Ils ont dit oui. »", "“Maybe you should hurry.”": "« Peut-être vous… vite. »", "“Are you with the airline group? They've gone.”": "« Vous êtes avec le groupe de l'avion ? Ils sont partis. »", "“A little. Not the emails. There are buses.”": "« Un peu. Pas les mails. Il y a des bus. »", "“A little. Eleven. The sign. Please.”": "« Un peu. Onze. Le panneau. S'il vous plaît. »"};
  const LX = (s) => { try { const S = (typeof Game !== 'undefined' ? Game : window.Game).state; if (S && S.flags.fr_asked && CONTENT_BROKEN[s]) return CONTENT_BROKEN[s]; } catch (e) { /* ignore */ } return s; };
  const atLeast = (G, v) => { if (G.S.dread < v) G.S.dread = v; }; // v in percent
  const hub = (G, status, key, extra) => p(status, G.last(), G.amb(key, AMB[key]), extra);
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
      { d: 2, t: 'Chaque porte a un numéro. Chaque numéro a un trait de lumière en dessous.' },
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
      { d: 5, t: 'Il regarde l\'hôtel. Une fenêtre en particulier. Vous savez laquelle.' },
    ],
    morning: [
      { d: 2, t: 'On débarrasse le petit-déjeuner. Il n\'a jamais vraiment été servi.' },
      { d: 2, t: 'Quelqu\'un a aligné les petits pots de confiture, par couleur.' },
      { d: 2, t: 'Le petit explique quelque chose d\'important à un radiateur.' },
      { d: 3, t: 'Il y a moins de monde au petit-déjeuner que dans le hall hier soir. Ils sont dans d\'autres hôtels, dit tout le monde. D\'autres hôtels.' },
      { d: 3, t: 'Un homme à la table voisine a reçu quatre mails avec quatre horaires différents. Il les lit à voix haute, comme la météo.' },
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
    if (d >= 3) return '\n\n' + G.pick(['Vous êtes toujours dans chambre 214.', 'S\'il vous plaît rester où vous êtes.', 'Y a-t-il autre chose ? Il n\'y a pas autre chose.']);
    return '';
  };
  const chat = [
    {
      label: 'Où est mon hôtel ?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Votre hébergement était Hótel Hraun. Nous espérons vous avez apprécié votre séjour ! Voulez-vous laisser une revue ?' + tail(G);
        if (G.has('at_hotel')) return 'Vous êtes à Hótel Hraun, chambre 214. S\'il vous plaît rester dans votre chambre jusqu\'à collecté.' + tail(G);
        return 'Grande question ! Votre hébergement a été arrangé au Heathrow Renaissance Lodge, Bath Road. Un lien de réservation vous a été e-mailé. 🛏️';
      },
    },
    {
      label: 'Le bus est à quelle heure ?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Votre car vers l\'aéronef départ une fois l\'embarquement est complet. S\'il vous plaît embarquer par groupe. 🚌' + tail(G);
        if (G.has('morning')) return 'Votre transfert à l\'aéroport est confirmé pour 08:00. S\'il vous plaît être dans le lobby 15 minutes tôt.' + tail(G);
        if (G.has('at_hotel')) return 'Votre car départ à 04:30. Un membre du staff va frapper.' + tail(G);
        return 'Des cars ont été organisés pour tous clients. S\'il vous plaît procéder aux cars. 🚌';
      },
    },
    {
      label: 'Que se passe-t-il ?',
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
      answer: 'Je suis désolé d\'entendre cela. Votre feedback a été enregistré contre votre réservation. Merci de voler Albion Atlantic — nous faisons notre meilleur. 🙏',
      do: (G) => G.strike(),
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
    ),
  };

  scenes.howto = {
    loc: 'Consignes de sécurité',
    text: p(
      '<em>Lisez tout.</em> Votre téléphone (à droite, ou sous le bouton TÉLÉPHONE) reçoit les mails de la compagnie, les messages d\'un chatbot nommé Ally, des SMS, et des photos de tous les panneaux imprimés que vous croisez. Quelqu\'un dit la vérité. Ce n\'est pas toujours celui qui porte le logo.',
      '<em>Deux jauges.</em> Les deux se remplissent. Ni l\'une ni l\'autre ne met fin à la partie. Ce qu\'elles font, c\'est fermer des portes : à mesure qu\'une jauge se remplit, une partie de ce que vous auriez pu dire ou faire n\'est plus possible, et ce qui reste est ce qui reste. Les petits choix les remplissent. Le sommeil, la nourriture et les autres gens les vident, un peu.',
      '<em>Noté</em> compte les réclamations que la compagnie a enregistrées à votre encontre. À trois, elle passe à l\'acte – là où elle le peut.',
      'Les lieux sont des espaces où vous pouvez vous déplacer. Chaque action prend des minutes ; l\'horloge n\'avance que lorsque vous agissez. Des bus passent et repartent. Regardez-les bien avant de monter. Le bon aura la tête que vous avez.',
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
    enter: (G) => { if (G.once('welcome_mail')) G.msg('email', { from: 'Albion Atlantic', subj: 'Bienvenue à bord AB 0271', body: 'Cher Client,\n\nBienvenue à bord vol Albion Atlantic AB 0271 à Los Angeles. Votre vol est à temps.\n\nNotre équipage de cabine est ici pour assurer votre sécurité et confort. La sécurité de nos clients est tantamount.\n\nComme client valorisé vous êtes invité à accepter une mise à niveau complimentaire en Classe Affaires pour ce vol. Les clients Classe Affaires apprécient une cabine plus calme et sont confiés de trouver leur propre chemin.\n\nAppréciez votre vol.', actions: [{ label: 'Accepter la mise à niveau complimentaire', if: (G) => !G.has('business') && !G.has('at_hotel'), do: (G) => { G.flag('business'); G.nerves(-2); G.dread(4); G.note('Vous avez accepté le surclassement. Rien n\'a changé pour votre siège. Une hôtesse vous a apporté une serviette chaude, et le chef de cabine, en passant, a dit ' + V('« Affaires, »') + ' pour lui-même, et a fait une petite marque.'); } }] }); },
    text: (G) => p(
      G.last(),
      'La passerelle sent le kérosène et la moquette. À la porte de l\'avion, le chef de cabine : grand, les tempes argentées, un sourire repassé avec la chemise. Il ne regarde pas les cartes d\'embarquement. Il regarde les visages, un par un, et dit ' + V('« Bienvenue à bord »') + ' à chacun, comme s\'il allait devoir s\'en souvenir.',
      'Rang 31. Un siège couloir, le 31B. En 31C, un homme à peu près de votre âge, avec un livre de poche qu\'il a déjà cessé de lire. Il vous salue d\'un signe de tête. Vous faites de même. C\'est toute la conversation, et ça le restera un moment.',
      'Quelque part derrière vous, on explique patiemment à un enfant de deux ans que l\'avion ne part pas encore. L\'avion ne part pas encore.',
    ),
    choices: [
      { label: 'Dire bonjour au 31C.', nd: -1, dd: -1, time: 20, do: (G) => { G.flag('met31c'); G.note('Il a répondu bonjour. Il rentre chez lui. Il l\'a dit comme on le dit au début de neuf heures de vol : chez lui, comme si c\'était un endroit où l\'avion ne pouvait manquer d\'arriver.'); }, next: 'takeoff' },
      { label: 'Ranger votre sac, vous asseoir, attacher la ceinture avant qu\'on vous le demande.', kind: 'comply', dd: 2, time: 20, do: (G) => G.note('Ceinture attachée. Sac rangé. Le chef de cabine, en passant, y a jeté un coup d\'œil et a eu un imperceptible hochement de tête, le hochement d\'un homme qui tient une liste.'), next: 'takeoff' },
      { label: 'Demander au chef de cabine, à la porte, si le vol est à l\'heure.', nd: 1, time: 20, do: (G) => G.note(V('« Tout est à temps, »') + ' a-t-il dit, chaleureusement, puis – comme par acquit de conscience – ' + V('« Tout. »') + ' Il regardait toujours les passagers qui entraient derrière vous.'), next: 'takeoff' },
      { label: 'Lire les consignes de sécurité rangées dans la pochette du siège. Sérieusement, pour une fois.', nd: -2, time: 20, do: (G) => G.note('Position de sécurité. Issues les plus proches, qui peuvent se trouver derrière vous. Un petit dessin de quelqu\'un glissant dans la mer, l\'air serein. Vous la rangez. Vous n\'en aviez jamais lu une, et vous ne savez pas pourquoi vous l\'avez fait cette fois.'), next: 'takeoff' },
    ],
  };

  scenes.takeoff = {
    art: 'cabin',
    loc: 'Piste 27L · Heathrow',
    text: p(
      'Le chef de cabine fait lui-même la démonstration de sécurité, à l\'avant, pendant que la vidéo passe derrière lui sans le son. Il la fait lentement. Il la fait en regardant chaque rang tour à tour, comme pour vérifier que les issues sont bien là où la fiche l\'indique.',
      V('« Dans l\'événement improbable. Dans l\'événement improbable. La sécurité de nos clients est tantamount. »') + ' C\'est une chose étrange à dire pendant une démonstration de sécurité, et il la dit comme si c\'était la chose la plus ordinaire du monde.',
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
      'Le dîner arrive sur un chariot poussé par deux hôtesses qui sourient comme on fait son travail. Poulet ou pâtes. Le chef de cabine suit le chariot à quelques rangs de distance, sans servir, juste marcher, regarder les plateaux, regarder les gens derrière les plateaux.',
      G.has('met31c') ? 'L\'homme du 31C a pris les pâtes. Il ne les mange pas. Il regarde la carte sur l\'écran, où un petit avion n\'a pas encore atteint la côte de l\'Irlande.' : 'L\'homme du 31C a pris les pâtes. Il ne les mange pas. Il n\'a pas dit un mot.',
    ),
    choices: [
      { label: 'Poulet.', time: 40, nd: -2, do: (G) => G.note('Le poulet était du poulet au sens où la mer de la fiche de sécurité était une mer. Vous l\'avez mangé. Vous rentriez chez vous ; vous mangeriez correctement là-bas.'), next: 'night' },
      { label: 'Commander un café. Puis un autre.', nd: 6, sub: 'Vous êtes en train de caler votre corps sur l\'heure du Pacifique et il n\'est pas question d\'y renoncer.', time: 40, do: (G) => { G.flag('coffee'); G.nerves(-3); G.note('Deux cafés. Du café d\'avion, c\'est-à-dire une opinion tiède. Vous les avez bus par principe. Le principe, c\'était l\'heure du Pacifique, et le chef de cabine, en passant, a regardé la deuxième tasse un peu plus longtemps qu\'une tasse ne le mérite.'); }, next: 'night' },
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
      'La cabine est plongée dans le noir, maintenant. Les écrans, presque tous éteints. La carte sur l\'écran montre un petit avion au-dessus d\'une grande quantité de bleu, avec GROENLAND quelque part en haut à droite, à l\'état de rumeur.',
      'Le chef de cabine parcourt l\'allée. Lentement, depuis l\'avant, une petite fiche dans une main et un crayon dans l\'autre, et à chaque rang il s\'arrête, regarde, et fait une marque. Il n\'explique rien. Personne ne demande rien. Arrivé à votre rang, il vous regarde, puis le 31C, puis le siège vide côté hublot, et écrit.',
      'À l\'avant, on a tiré le rideau de la cabine avant. Il y a de la lumière derrière, et des gens qui y entrent et en sortent en hâte, puis le chef de cabine planté devant, les mains jointes, tourné non pas vers le rideau mais vers vous autres.',
    ),
    choices: [
      { label: 'Dormir, ou essayer.', kind: 'comply', dd: -1, nd: -4, time: 40, do: (G) => G.note('Vous avez fermé les yeux. Derrière vos paupières, on continuait d\'arpenter l\'allée. Quelque part vers l\'avant, une femme a dit ' + V('« Est-ce qu\'il va bien ? »') + ' et quelqu\'un a dit ' + V('« S\'il vous plaît retourner à votre siège, »') + ' et vous n\'avez pas ouvert les yeux, parce que ce n\'était pas à vous qu\'on parlait. Pas encore.'), next: 'cabin' },
      { label: 'Regarder la carte.', dd: 2, time: 40, do: (G) => G.note('Le petit avion avançait si lentement qu\'il semblait hésiter. Puis, pendant un moment, la carte n\'a plus rien montré du tout, juste du bleu, et un temps restant figé à 5:12 plus longtemps qu\'une minute ne dure.'), next: 'cabin' },
      { label: 'Aller aux toilettes à l\'avant. Passer devant le rideau.', whyNot: 'Pas en passant devant lui.', dd: 4, nd: 2, dreadMax: 90, time: 40, do: (G) => { G.flag('saw_galley'); G.note('Par l\'entrebâillement du rideau : quelqu\'un au sol dans l\'office, une hôtesse agenouillée à côté, une couverture, une main. Vous ne voyez pas ce qui ne va pas et on ne vous le dira pas. Le chef de cabine se tient au-dessus d\'eux, les mains jointes – regardant non pas le sol, mais la cabine, par l\'entrebâillement, et donc vous. ' + V('« S\'il vous plaît retourner à votre siège, »') + ' a-t-il dit, sans rien bouger d\'autre que la bouche.'); }, next: 'cabin' },
      { label: 'Demander au 31C s\'il a vu la fiche.', nd: -1, dd: -2, time: 40, do: (G) => { G.flag('met31c'); G.note(V('« Un comptage »,') + ' a-t-il dit. ' + V('« Ils font ça avant d\'atterrir là où ils n\'avaient pas prévu d\'atterrir. »') + ' Il a dit ça sur le ton de la plaisanterie. Aucun de vous deux n\'a ri. C\'était la première chose qu\'il disait en quatre heures.'); }, next: 'cabin' },
    ],
  };

  scenes.cabin = {
    art: 'cabin',
    loc: 'Quelque part au sud du Groenland · 37 000 pieds',
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
    choices: [
      { label: 'Encaisser.', kind: 'comply', dd: 3, time: 15, do: (G) => G.note('Vous avez encaissé. Tout le monde a encaissé. C\'est remarquable, la vitesse à laquelle deux cents personnes peuvent décider qu\'elles ont été patientes depuis le début.'), next: 'cabin2' },
      { label: 'Regarder autour de vous. Voir qui d\'autre a protesté.', time: 15, do: (G) => { G.nerves(-2); G.note('Quatre visages, cinq peut-être, encore fermés. L\'homme près de l\'office. Une femme avec un petit. Vous les mémorisez comme on mémorise les issues.'); }, next: 'cabin2' },
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
      { label: 'Regarder par le hublot.', whyNot: 'Store baissé, a-t-il dit.', dd: 5, nd: 3, dreadMax: 90, time: 25, do: (G) => { G.nerves(3); G.note('Des lumières bleues, puis orange, puis bleues. Une ambulance, portes ouvertes, sur le tarmac mouillé, et à côté d\'elle – pas dans les parages, juste à côté – un homme en uniforme bleu marine, debout, très droit. Une voix dans l\'allée, tout près de votre oreille : ' + V('« Le store en bas, s\'il vous plaît. »')); }, next: 'ground' },
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
      { label: 'Rester assis. Regarder le chef de cabine vous regarder.', kind: 'comply', dd: 5, time: 15, do: (G) => G.note('Il a regardé les rangs un par un, et quand il est arrivé au vôtre, il ne s\'est pas arrêté, et il ne s\'est pas non plus pas arrêté.'), next: 'landing' },
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
          from: 'Albion Atlantic Customer Care', subj: 'Votre hébergement de nuit',
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
      'La file regarde la scène. Personne ne dit rien. Votre téléphone vibre.',
    ),
    choices: [
      { label: 'Lire le mail. Suivre le lien.', kind: 'comply', dd: 8, sub: 'Un hébergement. Enfin.', next: 'heathrow' },
      { label: 'Écrire au chatbot, avec une insistance croissante.', kind: 'comply', dd: 4, nd: 4, time: 10, do: (G) => { G.nerves(4); G.bot('Je peux aider avec ça ! Votre vol AB 0271 est actuellement à temps. Y a-t-il autre chose ? 😊'); G.note('Ally dit que le vol est à l\'heure. Vous regardez l\'avion par la vitre. Ses feux sont éteints.'); }, next: 'hall' },
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
      'Il y a bel et bien une voiture. Noire, longue, immaculée, un petit écusson doré sur la portière. Le chauffeur tient une tablette avec votre nom dessus – votre nom, correctement orthographié, ce que la compagnie n\'a pas réussi une seule fois jusqu\'ici.',
      V('« Pour le Renaissance ? »'),
      'Il ouvre la portière arrière. Air chaud. Cuir. Au-delà du parking, la route file dans une obscurité qui ne semble pas avoir de fin.',
    ),
    choices: [
      { label: 'Monter.', kind: 'comply', sub: 'Au chaud.', do: (G) => G.end('accommodated') },
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
      'Vingt minutes. La file au contrôle des passeports se vide. Personne ne fait d\'annonce.',
      'Les gens de votre vol dérivent, par deux ou par trois, vers le fond du hall, où se trouve une porte qui ne dit rien du tout.',
      G.t >= T(1, 2, 0) && W('Les lumières, de ce côté du hall, sont passées à mi-puissance.'),
    ),
    choices: [
      { label: 'Attendre encore. Il y aura une annonce.', kind: 'comply', dd: 6, sub: 'Il y a un système de sonorisation. Vous voyez les haut-parleurs.', time: 25, next: (G) => (G.t >= T(1, 2, 20) ? 'wait2' : 'wait1'), do: (G) => { G.nerves(8); G.dread(8); } },
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
      { label: 'Se rendre aux cars.', kind: 'comply', time: 15, do: (G) => G.end('terminal') },
      { label: 'Courir vers la porte qui ne dit rien.', whyNot: 'Vous ne pouvez pas courir.', nd: 5, dreadMax: 92, time: 5, do: (G) => { G.nerves(10); G.note('Vous avez couru. Personne ne vous a arrêté. La porte qui ne disait rien donnait sur de l\'air froid, une lumière au sodium et, Dieu merci, d\'autres gens.'); }, next: 'buses1' },
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
      { label: 'Parler à la femme avec le petit.', whyNot: 'Vous feriez peur à l\'enfant.', nd: -2, dd: -3, nerveMax: 80, time: 8, once: 'talk_mother', do: (G) => { G.collect(1); G.nerves(-2); G.flag('hint_hearsay'); G.msg('sms', { from: '+354 ··· ····', body: 'monte pas dans le beau' }); G.note('Le petit dort sur son épaule d\'une manière qui suggère que l\'épaule fait office de mur porteur. ' + V('« Un homme en gilet fluo m\'a dit : pas le beau. Je ne sais pas ce que ça veut dire. Je m\'en tiens à ça. »') + ' Au moment où elle le dit, votre téléphone vibre : un SMS d\'un numéro inconnu.'); }, next: 'hall' },
      { label: 'Retrouver l\'homme du 31C.', whyNot: 'Vous diriez quelque chose d\'irrattrapable.', nd: -3, dd: -3, nerveMax: 95, time: 8, once: 'talk_31c', if: (G) => G.has('ally31c'), do: (G) => { G.collect(1); G.nerves(-3); G.note('Il est près des portes, à regarder le noir dehors. ' + V('« Donc il y a des bus, »') + ' dit-il. ' + V('« Super. À qui ? »') + ' Ni l\'un ni l\'autre ne le sait. Vous décidez, sans le dire, de monter dans le même.'); }, next: 'hall' },
      { label: 'Parler au couple âgé près de la vitre.', whyNot: 'Vous déclencheriez une dispute.', nd: -2, dd: -2, nerveMax: 75, time: 8, once: 'talk_couple', do: (G) => { G.collect(1); G.nerves(-2); G.note('Ils ont beaucoup pris l\'avion et ne sont pas inquiets, disent-ils, de la voix de gens qui le sont. ' + V('« Ça finira par une feuille imprimée, »') + ' dit-il. ' + V('« Ça finit toujours par une feuille imprimée. »')); }, next: 'hall' },
      { label: 'Aller aux toilettes. Vous vous retenez depuis le Groenland.', nd: -3, time: 12, once: 'loo', do: (G) => { G.flag('bathroom'); G.nerves(-2); G.note('Un soulagement, en quelque sorte. Quand vous ressortez, le hall s\'est réorganisé : les mêmes gens, à d\'autres endroits, tous tournés vers la même porte.'); }, next: 'hall' },
      { label: G.did('talk_fleece') ? 'Aller dans la direction indiquée par la polaire.' : G.has('hint_icelander') ? 'Aller trouver les bus dont elle a parlé.' : G.did('talk_mother') ? 'Suivre la femme avec le petit. Elle a l\'air de savoir où elle va.' : 'Suivre le mouvement, par la porte qui ne dit rien.', dd: -2, time: 5, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~02:00 bus stand 1 */
  scenes.buses1 = {
    art: 'stand',
    loc: 'Keflavík · Arrêt des cars · dehors',
    text: (G) => p(
      'Dehors, il fait deux degrés, et le vent a fait un long chemin pour venir à votre rencontre. Trois cars tournent au ralenti sous les lampes au sodium. Vos compagnons de vol s\'avancent vers eux avec la démarche flottante, hésitante, des gens à qui on n\'a rien dit.',
      (G.has('bathroom') || G.t >= T(1, 2, 20)) ? 'Vous êtes en retard. Le gros de la foule est déjà monté dans quelque chose. Les portes commencent à se fermer.' : 'Personne ne contrôle les billets. Personne ne contrôle rien.',
      G.did('talk_mother') && W('« Pas le beau. »'),
      W('Regardez avant de monter. Regarder coûte quelques minutes. Monter coûte davantage.'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: G.pick(['#c7c3b6', '#b8b4a6', '#8d8a80']), windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'night' },
        name: G.pick(['Un car blanc sans aucune livrée', 'Un car blanc cassé avec un rétroviseur fêlé', 'Un car gris avec un autocollant de location qui se décolle de la portière']),
        sign: G.pick(['ALBION ATL → HOTEL', 'AB0271  HOTEL', 'FLIGHT PPL – HOTEL']), signStyle: 'paper',
        look: ['Chauffeur en gilet fluo, en train de manger un sandwich. Il hausse les épaules quand vous le regardez.', (G.has('bathroom') || G.t >= T(1, 2, 20)) ? 'Moteur en marche. La porte commence à se fermer.' : 'Moteur en marche. Porte ouverte.'],
        hidden: [(G.did('talk_fleece') ? 'L\'homme en polaire est au troisième rang.' : 'Un homme en polaire que vous reconnaissez du contrôle des passeports est au troisième rang.') + ' Un petit dort sur quelqu\'un.', 'Tout le monde à bord porte ce qu\'il portait dans l\'avion, et ça se voit.'],
        boardLabel: (G.has('bathroom') || G.t >= T(1, 2, 20)) ? 'Courir' : 'Monter',
        board: { time: 5, do: (G) => { if (G.has('bathroom') || G.t >= T(1, 2, 20)) G.nerves(6); G.flag('bus1_ok'); }, next: 'ride' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'night' },
        name: 'Un car bleu marine avec un écusson doré sur le flanc',
        sign: 'ALBION ATLANTIC WELCOMES YOU', signStyle: 'led',
        look: ['Chauffeur en uniforme de chef de cabine. Il vous sourit, à vous en particulier.', 'Éclairage intérieur vif et chaud. Plein de places libres.'],
        hidden: ['Les passagers sont reposés. Chemises repassées. Quelqu\'un sort de chez le coiffeur.', 'Vous ne reconnaissez pas un seul visage. Vous avez passé neuf heures en vol avec ces gens.', 'Son badge est vierge.'],
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
      { label: 'Ne monter dans rien. Le mail parlait de cars. Attendre les instructions.', kind: 'comply', dd: 10, sub: 'Ils ont dit des cars. Ceux-là ne sont peut-être pas les cars.', time: 35, next: 'wait2' },
    ],
  };

  scenes.detour = {
    art: 'road',
    loc: 'Route 41 · vers Reykjavík',
    text: p(
      'Quarante minutes après le départ, un routard vous demande dans quelle auberge vous êtes, et vous comprenez.',
      'Le bus vous dépose à une gare routière en ville qui sent le diesel et la cannelle. Un chauffeur de taxi vous prend en pitié, et 9 800 couronnes, et vous ramène dans le noir jusqu\'à un hôtel qu\'on a prévenu de votre arrivée et qui n\'est pas sûr d\'y croire.',
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
      if (G.once('coach_mail')) G.at(G.t + 30, 'email', { from: 'Albion Atlantic Customer Care', subj: 'Transport onward arrangé', body: 'Cher Client,\n\nNous avons organisé des cars pour vous transférer à votre hébergement. Veuillez vous rendre aux cars.\n\nSi vous avez besoin d\'aide pour localiser les cars, veuillez nous contacter.\n\nNous faisons de notre mieux.' });
      if (G.once('coach_txt')) G.at(G.t + 45, 'sms', { from: 'AlbionATL', body: 'AB0271 : Votre hôtel est HEATHROW RENAISSANCE LODGE. Ne pas répondre.' });
    },
    text: (G) => p(
      'Le car dépasse les dernières lumières, et puis il continue.',
      'Des champs de lave sous un ciel bas. Pas de villes. Pas de panneaux que vous puissiez lire. Vous ne savez pas qui vous a emmené ni où vous allez. Soit vous avez été tendrement accueilli dans le giron du cadre réglementaire européen, soit vous avez été enlevé, avec un car entier de gens épuisés et trop polis pour poser la question.',
      G.has('coffee') && W('Votre cœur fait quelque chose. C\'est le café. C\'est forcément le café.'),
      'Le trajet est long. Il commence à être d\'une longueur inquiétante.',
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
      if (G.once('hotel_bot')) { G.at(T(1, 3, 50), 'chat', { body: 'Êtes-vous confortable dans votre chambre ? 🙂' }); G.at(T(1, 4, 15), 'chat', { body: 'Votre car départ à 04:30. Un membre du staff va frapper.' }); }
    },
    text: (G) => p(
      G.has('asked_driver') && W('Le chauffeur n\'a jamais répondu. La radio passait quelque chose en islandais qui était peut-être la météo.'),
      'Un hôtel, donc. Bas, large, le genre d\'endroit construit pour des congrès qui ne sont jamais venus. La réceptionniste de nuit distribue les cartes de chambre en les tirant d\'une boîte à chaussures. La vôtre dit 214.' + (G.did('talk_fleece') ? ' L\'homme en polaire reçoit la 216, et vous la brandit comme un ticket de tombola.' : ''),
      'Non, ils n\'ont pas de dentifrice. Non, ils n\'ont pas de brosses à dents. Personne ne livre ici avant onze heures demain matin. Il y a un distributeur. La réceptionniste dit cela de l\'air d\'une femme qui vous tend un radeau de survie.',
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
      if (G.once('room_intro')) G.note(p(G.last(), 'Un lit, une bouilloire, une télévision, une fenêtre sur le parking, et de minuscules flacons de shampoing et d\'après-shampoing avec lesquels vous envisagez déjà de vous brosser les dents. La porte a une chaîne. Vous mettez la chaîne. Puis vous l\'enlevez, au cas où, et vous la remettez.'));
    },
    text: (G) => hub(G, roomStatus(G), 'room'),
    choices: (G) => [
      { label: 'Manger. Des chips et deux mignonnettes de vin.', whyNot: 'Votre estomac dit non.', nerveMax: 90, sub: 'Dîner de fille.', if: (G) => G.has('crisps') && !G.has('dinner'), time: 12, do: (G) => { G.flag('dinner'); G.nerves(-10); G.note('Du sel, puis du vin, puis du sel. Vous mangez assis au bord du lit, le paquet tenu à deux mains comme quelque chose qui pourrait s\'échapper. C\'est le meilleur repas que vous ayez fait depuis vingt heures, et c\'est aussi le seul.'); }, next: 'room' },
      { label: 'Fixer les mini-shampoings et envisager de vous brosser les dents avec.', time: 4, do: (G) => { const n = G.count('shampoo'); G.nerves(n === 1 ? -1 : 1); G.note(n === 1 ? 'Shampoing. Après-shampoing. Lait pour le corps. Vous lisez les ingrédients. Le laureth sulfate de sodium est, techniquement, un tensioactif. Vous le reposez. Vous le reprenez. Vous le reposez.' : n === 2 ? 'Vous êtes déjà passé par là. Le shampoing n\'a pas changé d\'avis, et vous non plus.' : 'Les petits flacons sont alignés sur l\'étagère et vous regardent. L\'un d\'eux a bougé. C\'est vous qui l\'avez déplacé. Probablement vous.'); }, next: 'room' },
      { label: 'Prendre une douche. Remettre les mêmes vêtements.', whyNot: 'Vous ne tiendriez pas en place dessous.', nerveMax: 95, time: 20, once: 'shower', do: (G) => { G.nerves(-6); G.dread(-3); G.note('De l\'eau chaude, au moins. L\'Islande a une excellente eau chaude ; elle sent légèrement l\'œuf et ne s\'épuise jamais. Vous restez dessous jusqu\'à vous sentir redevenir quelqu\'un, puis vous renfilez l\'avion : le pantalon, la chemise, les chaussettes, le tout légèrement plus chaud que vous.'); }, next: 'room' },
      { label: 'Allumer la télévision.', kind: 'comply', dd: 2, time: 6, do: (G) => { const d = G.D, n = G.count('tv'); G.dread(1); G.note(d >= 5 ? 'Chaîne 1 : le parking. Votre parking, vu d\'en haut, en gris. Le car dedans. Une silhouette à côté du car. Vous éteignez. L\'écran vous montre la chambre, vue d\'en haut, en gris.' : d >= 4 ? 'La météo, en islandais, à perpétuité. Puis une chaîne qui n\'est qu\'une caméra fixe braquée sur un parking. Vous êtes à peu près sûr que ce n\'est pas ce parking-ci. Il y a un car dedans.' : n === 1 ? 'La météo, en islandais. Une carte de l\'île couverte de petites flèches furieuses. Puis une image fixe de l\'hôtel avec un numéro de téléphone. Puis la météo.' : 'Vous avez déjà vu cette météo. Elle n\'a pas changé. Les flèches sont toujours furieuses. L\'hôtel est toujours à l\'écran avec son numéro, comme si vous pouviez avoir envie de l\'appeler de l\'intérieur.'); }, next: 'room' },
      { label: 'Regarder par la fenêtre, vers le parking.', whyNot: 'Vous savez ce qu\'il y a dehors.', dd: 2, dreadMax: 85, time: 3, do: (G) => { const d = G.D, n = G.count('win'); G.dread(2); if (d >= 4) G.flag('looked1'); G.nerves(d >= 4 ? 7 : 2); G.note(d >= 5 ? 'Le car est juste en dessous, maintenant. Éclairage intérieur allumé. Tout le monde à l\'intérieur tourné vers l\'hôtel, droit, immobile. Et près de la porte, les mains croisées, un homme en bleu marine, qui regarde en l\'air. Pas l\'hôtel. Votre fenêtre. Vous lâchez le rideau. Vous ne vous souvenez pas de l\'avoir écarté.' : d >= 4 ? 'Un car est garé tout au bout du parking, moteur en marche, toutes les lumières intérieures allumées. Il est plein. Personne, à l\'intérieur, ne bouge. Vous ne voyez personne près de la porte, et puis si.' : n === 1 ? 'Un parking. Un seul lampadaire. Du gravier, du vent, et au-delà du lampadaire, le noir qui continue très loin. Pas de car. Vous êtes soulagé, puis vous vous demandez pourquoi vous en attendiez un.' : 'Le parking. Le lampadaire. Deux phares sur la route, qui ralentissent, qui ne tournent pas pour entrer. Votre propre visage par-dessus tout ça, pâle, dans la chemise d\'hier.'); }, next: 'room' },
      { label: 'Faire du thé avec les petits sachets.', whyNot: 'Vos mains le renverseraient.', nerveMax: 90, time: 8, once: 'tea', do: (G) => { G.nerves(-5); G.dread(-2); G.note('La bouilloire met du temps et fait un bruit de petit avion. Du thé, avec du lait UHT versé d\'un dé à coudre. Vous tenez la tasse à deux mains. C\'est la première chose chaude qui ne soit pas un mensonge.'); }, next: 'room' },
      { label: 'Vérifier la porte.', nd: 2, time: 2, do: (G) => { const n = G.count('door'); G.note(n === 1 ? 'Fermée à clé. Chaîne mise. Vous vérifiez la chaîne. Vous vérifiez le verrou. Bon.' : n === 2 ? 'Toujours fermée. Toujours la chaîne. Vous le saviez.' : n === 3 ? 'Vous vérifiez encore la porte. Vous avez conscience de vérifier encore la porte. Elle est fermée. Elle a toujours été fermée. Vous restez la main dessus un moment.' : 'Fermée. Vous ne savez plus ce que vous vérifiez. Si elle est fermée, ou si c\'est encore une porte.'); if (n >= 3) G.dread(1); }, next: 'room' },
      { label: 'Écouter à la porte.', whyNot: 'Vous ne voulez pas savoir.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(3); G.note(G.pick(d >= 4 ? ['Des pas. Lents, réguliers, qui s\'arrêtent à chaque porte. Qui s\'arrêtent à la vôtre. Qui repartent.', 'Un chariot, à roulettes, tout au bout. Il s\'arrête. Il ne repart pas.', 'On frappe, loin dans le couloir. Patiemment. Puis plus près.'] : ['Rien. Le bourdonnement du couloir. Une porte, au loin, qui se ferme.', 'Quelqu\'un passe, vite, en chaussettes. Quelqu\'un d\'autre, lentement, en chaussures.', 'La machine à glaçons, qui broie, au bout du couloir. Puis un rire, une porte plus loin, coupé net.'])); }, next: 'room' },
      { label: 'Appeler la réception depuis le téléphone de la chambre.', kind: 'comply', dd: 1, time: 5, once: 'roomphone', do: (G) => { G.dread(2); G.note('Ça sonne longtemps. Puis la réceptionniste, qui a l\'air d\'avoir dormi ou de n\'avoir jamais dormi : ' + V(LX('“Yes, 214?”')) + ' Vous n\'aviez pas dit votre numéro de chambre. Vous vous renseignez sur le bus. ' + V(LX('“Eleven. It says eleven. Maybe you should sleep.”'))); }, next: 'room' },
      { label: 'Vérifier vos droits.', whyNot: 'Les droits, c\'est un pays étranger, là.', dd: -6, dreadMax: 85, sub: G.did('post') ? 'Il y a un règlement. Quelqu\'un dans vos mentions en est sûr.' : 'Il y a un règlement. Vous êtes presque sûr qu\'il y a un règlement.', time: 15, once: 'rights', do: (G) => { G.flag('uk261'); G.nerves(-6); G.msg('paper', { from: 'Capture d\'écran, puis un QR code que vous avez fait vous-même', subj: 'UK261', body: '<b>UK261 / CE261 – VOS DROITS</b>\n\nPour un retard de cette durée, la compagnie doit fournir : repas, hôtel, transport et moyens de communication.\n\nIls contesteront. Réclamez quand même.\n\n[ QR CODE ]' }); G.note('UK261. <em>La compagnie doit fournir.</em> Vous le lisez deux fois. Vous en faites un QR code, sur le wifi de l\'hôtel, à trois heures du matin, sans savoir pourquoi, sinon que vous allez le montrer à tous ceux que vous croiserez au petit-déjeuner.'); }, next: 'room' },
      { label: 'En faire un post.', time: 8, once: 'post', do: (G) => { if (G.D >= 4) { G.nerves(4); G.note('Vous tapez tout – l\'équipage, la porte, le mail, le bus – et vous appuyez sur publier, et la petite roue tourne, et tourne. Une barre. Zéro barre. Le message reste là, non envoyé, adressé à personne.'); } else { G.nerves(-3); G.note('Vous le postez. Lol, écrivez-vous. Mdr. En dix minutes : 1,4K likes, et quarante personnes qui vous parlent des sources chaudes. Vous posez le téléphone écran contre la couette.'); } }, next: 'room' },
      { label: 'Charger le téléphone.', nd: 2, time: 2, once: 'charge', do: (G) => { G.nerves(3); G.note(`Le chargeur est dans le sac. Le sac est dans le système. Le téléphone est à ${G.battery()} %, et il le sait, et il baisse l'écran pour vous le dire.`); }, next: 'room' },
      { label: 'Essayer de dormir.', whyNot: 'Vous ne tenez pas allongé.', nerveMax: 80, time: 25, do: (G) => { if (G.t + 25 >= T(1, 4, 5)) { G.S.t = Math.max(G.t, KNOCK_AT - 25); G.nerves(-2); G.dread(-1); G.note('Vous vous allongez dans vos vêtements d\'avion, lumière allumée. Le plafond est très proche. Vous êtes presque, presque –'); } else { G.nerves(-4); G.dread(-3); G.note(G.pick(['Vous vous allongez. Votre corps est à l\'heure du Pacifique, ou à aucune heure. Le plafond a une tache en forme d\'île. Vous la regardez un moment. Rien.', 'Yeux fermés. Le moteur du car – d\'un car – quelque part sous la fenêtre, ou dans vos oreilles. Vous vous redressez.', 'Vous vous glissez sous la couette tout habillé. On dirait un colis. Le sommeil vous regarde depuis l\'autre bout de la chambre et ne s\'approche pas.'])); } }, next: 'room' },
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
    text: (G) => hub(G, `Le hall. ${G.clock(G.t)}. Le panneau dit toujours 11h00. ${G.t >= KNOCK_AT ? 'Il est quatre heures et demie passées.' : 'On est encore loin de onze heures.'}`, 'lobby'),
    choices: (G) => [
      { label: 'Demander à la réceptionniste si elle parle français.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 4, do: (G) => { G.flag('fr_asked'); G.nerves(-2); G.note(LX('“A little. Eleven. The sign. Please.”') + ' Elle l\'a dit lentement, et a quand même désigné le panneau, au cas où les mots ne tiendraient pas.'); }, next: 'lobby' },
      { label: 'Demander du dentifrice à la réception.', time: 6, once: 'desk_tp', do: (G) => { G.nerves(2); G.note('Elle cherche sous le comptoir, sincèrement, longtemps. ' + V(LX('“No. Sorry. The 10-11 has. Twenty minutes, walking.”')) + ' Elle vous regarde, puis les portes, puis vous. ' + V(LX('“Maybe not tonight.”'))); }, next: 'lobby' },
      { label: 'Demander si le panneau dit vrai.', kind: 'comply', dd: 1, time: 5, do: (G) => { const n = G.count('sign'); G.note(n === 1 ? 'Elle désigne le panneau. ' + V(LX('“Eleven.”')) + ' Vous demandez qui le lui a dit. ' + V(LX('“A passenger phoned them. They said yes.”')) + ' Un silence. ' + V(LX('“Or they said something.”')) : n === 2 ? V(LX('“Eleven,”')) + ' dit-elle, sans lever les yeux, avant que vous ayez fini la question.' : 'Elle vous regarde un instant avec une expression que vous n\'arrivez pas à déchiffrer, puis dit : ' + V(LX('“You are in 214,”')) + ' et retourne à ses mots croisés. Vous n\'aviez rien demandé.'); if (n >= 3) G.dread(3); }, next: 'lobby' },
      { label: 'Demander si un car est passé.', kind: 'comply', dd: 3, time: 5, do: (G) => { const d = G.D; G.dread(1); G.note(d >= 4 ? V(LX('“One is outside,”')) + ' dit-elle. ' + V(LX('“It is not yours.”')) + ' Vous demandez comment elle le sait. Elle tourne la grille vers vous pour que vous la voyiez. Elle est vierge.' : G.t >= KNOCK_AT ? V(LX('“Somebody came asking for you. In a uniform. I said you were asleep.”')) + ' Vous ne dormiez pas. ' + V(LX('“I know.”')) : V(LX('“No coach. Eleven. Please, go up and sleep.”'))); }, next: 'lobby' },
      { label: 'Le distributeur.', nd: -2, time: 5, do: (G) => { const n = G.count('vend'); if (n === 1) { G.flag('crisps'); G.nerves(-3); G.note('Des chips au paprika. Deux mignonnettes d\'un vin rouge dont l\'étiquette représente une montagne. La machine prend votre carte au troisième essai et émet un son de profonde réticence. Vous tenez votre dîner à deux mains.'); } else { G.note(n === 2 ? 'Presque tout est épuisé. Il reste un seul article, tout en bas : un pot de skyr dont vous auriez préféré ne pas lire la date.' : 'La lumière de la machine vacille. Tous les rayons sont vides maintenant, sauf le skyr, qui est monté d\'un rayon.'); if (n >= 3) G.dread(1); } }, next: 'lobby' },
      { label: 'La machine à café.', time: 5, once: 'coffee_l', do: (G) => { G.nerves(G.has('coffee') ? 2 : -2); G.note('Du café. C\'est quoi, le problème, avec ce café. On dirait qu\'on l\'a décrit à la machine par téléphone. Vous le buvez debout, en regardant les portes.'); }, next: 'lobby' },
      { label: 'Réveiller les passagers du canapé. Échanger vos informations.', whyNot: 'Vous les réveilleriez en criant.', nd: -4, dd: -4, nerveMax: 85, time: 8, once: 'sofa', do: (G) => { G.collect(1); G.nerves(-2); G.note((G.did('talk_couple') ? 'C\'est le couple de la vitre, dans le hall.' : 'Un couple âgé de votre vol.') + ' Ils ne dorment pas. ' + V('« On a eu un mail qui disait neuf heures »,') + ' dit-elle. ' + V('« Et un qui disait huit. Et le truc du chat dit encore autre chose. »') + ' Vous regardez tous le panneau. ' + V(LX('“Eleven,”')) + ' dit-il. ' + V('« La feuille. »')); }, next: 'lobby' },
      { label: 'Regarder le parking à travers la vitre.', whyNot: 'Vous ne voulez pas voir.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(d >= 4 ? 5 : 0); G.note(d >= 5 ? 'Le car est juste devant les portes maintenant. Moteur en marche. Éclairage intérieur allumé. Les portes s\'ouvrent pour lui, et restent ouvertes, et le froid entre. Personne ne descend.' : d >= 4 ? 'Tout au bout du parking, des phares, un moteur au ralenti. Une forme derrière, qui a la forme d\'un car. La réceptionniste ne lève pas les yeux. Elle ne les a pas levés depuis un moment.' : 'Du gravier, un lampadaire, la route. Une voiture passe sans ralentir. Vous guettez quelque chose. Vous aimeriez pouvoir vous arrêter.'); if (d >= 4) G.flag('looked1'); }, next: 'lobby' },
      { label: 'Sortir.', whyNot: 'Les portes sont dans le mauvais sens.', dd: -2, dreadMax: 88, time: 3, next: 'carpark' },
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
      { label: 'Monter dans le car.', kind: 'comply', if: (G) => G.has('coach_seen_cp'), do: (G) => { G.flag('nc_carpark'); G.end('nightcoach'); } },
      { label: 'Lever les yeux vers votre fenêtre.', time: 3, do: (G) => { G.dread(2); G.nerves(2); G.note(G.D >= 4 ? 'Deuxième étage, quatrième fenêtre. La lumière est allumée. Vous l\'avez laissée allumée. Le rideau est ouvert. Vous ne l\'avez pas laissé ouvert.' : 'Deuxième étage, quatrième fenêtre. La lumière est allumée. On dirait une chambre où il y a quelqu\'un.'); }, next: 'carpark' },
      { label: G.did('desk_tp') ? 'Marcher vingt minutes jusqu\'au 10-11 pour du dentifrice.' : 'Partir le long de la route. Le panneau au carrefour dit 10-11, 2 km.', whyNot: 'Pas seul. Pas là-dehors.', dreadMax: 70, sub: 'Du dentifrice. Des chaussettes, peut-être. Changer d\'air.', time: 20, once: 'walk', next: 'walk' },
      { label: 'Rentrer.', kind: 'comply', dd: 1, time: 3, next: 'lobby' },
    ],
  };

  scenes.walk = {
    art: 'road',
    loc: 'La route · vers le 10-11',
    text: p(
      'Du vent. De la lave. Une route sans trottoir et une ligne blanche qui n\'arrête pas de disparaître. Après huit minutes vous ne voyez plus l\'hôtel derrière vous ; après dix, vous ne voyez toujours pas le 10-11 devant vous.',
      'Puis des phares, lents, venant de derrière. Un car. Il arrive à votre hauteur et s\'arrête, et la porte se replie avec un bruit feutré, un bruit de luxe. Une lumière chaude. Des rangées de sièges, et des gens dedans, assis, parfaitement immobiles.',
      V('« Passager Albion ? »') + ' dit une voix que vous avez entendue dans un combiné à 37 000 pieds. ' + V('« Nous faisons notre meilleur. Sautez dedans. »'),
    ),
    choices: [
      { label: 'Monter. Il y fait chaud.', kind: 'comply', do: (G) => G.end('convenience') },
      { label: 'Continuer à marcher. Ne pas regarder la porte.', whyNot: 'Vous ne pouvez pas lui tourner le dos.', dreadMax: 75, dd: -14, time: 30, do: (G) => { G.nerves(12); G.flag('toothpaste'); G.nerves(-10); G.dread(8); G.note('Le car est resté au ralenti à côté de vous un long moment, et puis plus. Le 10-11 était éclairé comme un autel. Du dentifrice. Une brosse à dents. Des chaussettes, par trois, les plus belles chaussettes que vous ayez jamais vues. Vous êtes rentré le sac serré contre la poitrine. Rien ne vous a croisé sur la route. Rien du tout, ce qui, allez savoir pourquoi, était pire.'); }, next: 'carpark' },
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
      'Quelqu\'un frappe. Pas en tambourinant – en frappant, à coups réguliers, comme frappe quelqu\'un qui frappera toute la nuit.',
      V('« Car pour passagers Albion Atlantic. Départ maintenant. Dernier appel. »'),
      'La voix est patiente. La voix est très, très patiente.',
    ),
    choices: [
      { label: 'Ouvrir la porte.', kind: 'comply', sub: 'C\'est peut-être le bus.', do: (G) => G.end('nightcoach') },
      { label: 'Regarder par le judas.', dd: 6, nd: 6, time: 2, do: (G) => { G.nerves(9); G.flag('spyhole'); G.note('Le couloir est vide. La moquette devant votre porte est mouillée. Les coups continuent, réguliers, venus de nulle part en particulier.'); }, next: 'knock2' },
      { label: 'Le panneau disait 11h00. Ne pas ouvrir. Ne pas répondre.', whyNot: 'Vous ne pouvez pas ne pas répondre.', nd: 5, dreadMax: 80, time: 20, do: (G) => { G.nerves(5); G.note('Vous êtes resté assis sur le lit, dos à la tête de lit, les yeux sur la porte, à compter les coups. Vous avez perdu le compte à soixante. Puis ils se sont arrêtés, et c\'était pire, pendant un moment.'); }, next: 'window' },
    ],
  };

  scenes.knock2 = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: (G) => p(G.last(), 'Régulier. Patient. Personne.'),
    choices: [
      { label: 'Ouvrir la porte quand même.', kind: 'comply', do: (G) => G.end('nightcoach') },
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
      { label: 'Lui répondre. Vous êtes un passager Albion Atlantic.', kind: 'comply', do: (G) => { G.flag('nc_corridor'); G.end('nightcoach'); } },
    ],
  };

  scenes.window = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.S.t = Math.max(G.t, T(1, 4, 50)); G.bot('Salut ! Je vois vous êtes dans chambre 214. Le car attend pour vous dans le parking. S\'il vous plaît ne pas regarder hors de la fenêtre. 🙂'); },
    text: (G) => p(
      G.last(),
      G.has('hid_lobby') ? 'Vous êtes remonté, finalement, parce qu\'il n\'y avait nulle part ailleurs où être. Le couloir était vide. Les coups ont cessé. Votre téléphone éclaire le plafond. Un message d\'Ally.' : 'De retour dans la chambre, ou toujours dedans. Les coups ont cessé. Votre téléphone éclaire le plafond. Un message d\'Ally.',
      W('Le car attend pour vous dans le parking. S\'il vous plaît ne pas regarder hors de la fenêtre.'),
      'Le rideau est fin. Il y a de la lumière qui passe à travers, et la lumière bouge légèrement, comme bouge la lumière d\'un moteur qui tourne.',
    ),
    choices: [
      { label: 'Regarder.', whyNot: 'Il a dit de ne pas le faire.', dd: 10, nd: 8, dreadMax: 90, sub: 'Juste un peu.', time: 5, do: (G) => { G.flag('seen'); G.flag('looked_out'); G.nerves(14); atLeast(G, 78); }, next: 'window2' },
      { label: 'Non. Poser le téléphone écran contre le lit. Tirer la couette par-dessus votre tête.', kind: 'comply', dd: 6, time: 5, do: (G) => G.nerves(2), next: 'sleep' },
    ],
  };

  scenes.window2 = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: p(
      'Un car, bleu marine, avec un écusson doré. Moteur en marche. Toutes les lumières allumées à l\'intérieur. Il est plein, et tout le monde dedans est assis parfaitement droit, et chacun d\'eux est tourné vers l\'hôtel.',
      'À la porte du car se tient un homme en uniforme de chef de cabine. Sous vos yeux, il lève la tête – pas vers l\'hôtel. Vers votre fenêtre.',
      'Il ne fait pas signe. Il n\'en a pas besoin. Il en a, vous le comprenez, pris note.',
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
      G.at(T(1, 8, 5), 'chat', { body: 'Bon matin ! Votre transfert à l\'aéroport est confirmé pour 08:00. S\'il vous plaît être dans le lobby. 🚌' });
      G.at(T(1, 9, 40), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Votre transfert à l\'aéroport', stamp: T(1, 9, 40), body: 'Cher client,\n\nDes cars viendront vous chercher à votre hébergement à 09:00 pour votre vol réacheminé AB 0271.\n\nMerci de vous présenter dans le hall à 08:45.\n\nNous faisons de notre mieux.' });
      G.at(T(1, 9, 55), 'chat', { body: 'Votre car est ici. C\'est le gentil. 🚌' });
    },
    text: (G) => p(
      G.has('allnighter') ? 'Lumière grise. 07h30. Vous n\'avez pas dormi, et vous êtes toujours en Islande.' : 'Lumière grise. 07h30. Vous avez dormi, ou quelque chose comme ça, et vous êtes toujours en Islande.',
      'Le petit-déjeuner, c\'est du skyr, du pain, et un café qui a le goût d\'avoir été préparé par quelqu\'un à qui l\'on aurait décrit le café. La salle est pleine de votre vol. Tout le monde porte ce qu\'il portait hier. Tout le monde échange ses informations : quel hôtel, quelle heure de ramassage, lequel des trois messages contradictoires chacun a choisi de croire.',
      'Le panneau imprimé est toujours scotché au comptoir. 11h00. Quelqu\'un a dessiné un petit cœur dessus.',
    ),
    choices: [{ label: 'Prendre un deuxième café quand même.', time: 10, next: 'hotel_morning' }],
  };

  scenes.hotel_morning = {
    art: 'lobby',
    loc: 'Hótel Hraun · Hall',
    enter: (G) => {
      if (G.t >= T(1, 10, 15)) { G.go('buses2'); return; }
      if (G.once('morn_intro')) G.note(p(G.last(), 'En gros, tout a été minuté pour être le plus pénible possible sans vous laisser la liberté d\'aller faire quelque chose d\'agréable dans l\'intervalle. Trois heures, et rien à en faire sinon attendre un bus qui est peut-être le bus, ou peut-être pas.'));
    },
    text: (G) => hub(G,
      `Le hall. ${G.clock(G.t)}. Le panneau dit 11h00. ${G.t >= T(1, 9, 45) ? 'Le mail disait 09h00 et il est arrivé à 09h40. ' : G.t >= T(1, 8, 5) ? 'Le chatbot disait 08h00. Il est plus de 08h00. ' : ''}Personne n'a vu de bus qui soit le vôtre.`,
      'morning'),
    choices: (G) => [
      { label: 'Montrer le QR code UK261 à tous les passagers à votre portée.', whyNot: 'Vos mains ne tiendraient pas le téléphone immobile.', dd: -8, nd: -4, nerveMax: 90, sub: 'En précisant que la compagnie contestera.', if: (G) => G.has('uk261'), once: 'qr1', time: 20, do: (G) => { G.collect(2); G.nerves(-5); G.note('Vous allez de table en table, le téléphone tendu comme un mandat. Les gens le photographient. Une femme avec un bagel dit : ' + V('« Je suis prête à jouer les Karen. »') + ' Quelqu\'un applaudit, une fois.'); }, next: 'hotel_morning' },
      { label: 'Échanger vos informations avec les autres.', whyNot: 'Vous déclencheriez une dispute.', dd: -5, nd: -4, nerveMax: 85, time: 20, once: 'notes1', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_notes'); G.note('Quatre hôtels différents, dans les mails – et tous ceux qui les ont reçus sont dans celui-ci. Six horaires de ramassage. Une feuille imprimée. Un homme avec une casquette des Blazers : ' + V('« Ceux avec l\'écusson, c\'est pas les nôtres. Je sais pas à qui ils sont. Pas les nôtres. »') + ' Tout le monde hoche la tête, comme s\'ils l\'avaient toujours su.'); }, next: 'hotel_morning' },
      { label: 'Demander à la réception si 11h00 est la bonne heure.', kind: 'comply', dd: 2, time: 10, once: 'recep', do: (G) => { G.nerves(1); G.note('La même réceptionniste. Toujours. Elle désigne le panneau. ' + V(LX('“Another passenger phoned them. They said yes.”')) + ' Un silence. ' + V(LX('“Or they said something.”'))); }, next: 'hotel_morning' },
      { label: 'Remonter à la chambre. Prendre une douche. Se passer au moins de l\'eau sur le visage.', whyNot: 'Vous ne tiendriez pas en place dessous.', nerveMax: 92, time: 25, once: 'morn_shower', do: (G) => { G.nerves(-5); G.dread(-2); G.note('De l\'eau chaude. Les mêmes vêtements. La chambre, à la lumière du jour, n\'est qu\'une chambre : les shampoings, la bouilloire, la fenêtre sur un parking avec un car dedans. Vous ne regardez pas longtemps.'); }, next: 'hotel_morning' },
      { label: 'Parler à la mère de l\'enfant.', whyNot: 'Vous feriez peur à l\'enfant.', nd: -3, dd: -3, nerveMax: 80, time: 10, once: 'morn_mother', do: (G) => { G.collect(1); G.nerves(-3); G.note(V('« Elle voudrait être à la maison, maintenant »,') + ' dit la mère, à propos de la petite, qui est sous la table. ' + V('« Moi aussi. Vous avez entendu frapper, cette nuit ? »') + (G.has('knocked') ? ' Vous dites oui. Elle dit : ' + V('« Nous non plus, on n\'a pas ouvert. »') : ' Vous dites que vous étiez en bas. Elle vous regarde comme si ç\'avait été un choix. ' + V('« On n\'a pas ouvert. »'))); }, next: 'hotel_morning' },
      { label: 'Vérifier le statut du vol sur le site de la compagnie.', dd: 3, nd: 3, time: 8, do: (G) => { const n = G.count('status'); G.dread(2); G.note(n === 1 ? 'AB 0271 · KEF → LAX · 15h10 · À L\'HEURE. À l\'heure pour quoi, le site ne le dit pas.' : n === 2 ? 'AB 0271 · 15h10 · À L\'HEURE. Puis, sous vos yeux, 15h25. Puis 15h10 à nouveau.' : 'La page ne charge pas. Puis elle charge, et le vol n\'y est pas. Puis il y est. 15h10. Vous rangez le téléphone avant que ça ne change encore.'); }, next: 'hotel_morning' },
      { label: G.t >= T(1, 9, 40) ? 'Sortir chercher le car de 09h00.' : 'Sortir chercher le car de 08h00.', kind: 'comply', dd: 5, if: (G) => G.t >= T(1, 8, 5) && G.t < T(1, 10, 0), time: 10, next: 'decoy_morning' },
      { label: 'Aller aux sources chaudes. Vous en avez toujours rêvé.', sub: 'C\'est à vingt minutes. Tout le monde le dit.', do: (G) => G.end('tantalus') },
      { label: 'Attendre dans le hall.', kind: 'comply', dd: 3, nd: 2, sub: 'Une demi-heure.', time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Une demi-heure. La machine à café, les portes, le panneau. Un enfant compte jusqu\'à cent et recommence.', 'Une demi-heure. L\'alarme du téléphone de quelqu\'un se déclenche – réglée sur l\'heure de Los Angeles – et tout le monde rit, puis plus personne.', 'Une demi-heure. Dehors, un car arrive, n\'est pas le vôtre, et repart. Vous ne vous levez pas. Personne ne se lève.'])); }, next: 'hotel_morning' },
    ],
    status: (G) => (G.has('hint_notes') ? 'Ce qui se dit : tout le monde a reçu des heures différentes de la compagnie. Tout le monde s\'en tient à la feuille imprimée. Les cars avec l\'écusson, « c\'est pas les nôtres ».' : ''),
  };

  scenes.decoy_morning = {
    art: 'carpark',
    loc: 'Hótel Hraun · Parking',
    text: (G) => p(
      'Il y a un car. Bleu marine, écusson doré, moteur en marche. L\'afficheur LED à l\'avant dit AIRPORT TRANSFER · ALBION ATLANTIC. Le chef de cabine se tient à la porte, les mains croisées, et quand il vous voit, il sourit comme si vous étiez pile à l\'heure.',
      'Personne d\'autre n\'est sorti du hall. À travers les vitres, les passagers déjà à bord sont assis bien droits dans des chemises propres et regardent le vide.',
    ),
    choices: (G) => [
      { label: G.t >= T(1, 9, 40) ? 'Monter. Le mail disait bien 09h00.' : 'Monter. Le chatbot disait bien 08h00.', kind: 'comply', do: (G) => G.end('crew') },
      { label: 'Rentrer. N\'en parler à personne.', whyNot: 'Il vous regarde.', dreadMax: 85, time: 5, do: (G) => { G.nerves(6); G.dread(5); G.note('Vous êtes rentré. Personne n\'a demandé. À travers la vitre, le car est resté où il était, porte ouverte, longtemps.'); }, next: 'hotel_morning' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 10:15 bus stand 2 */
  scenes.buses2 = {
    art: 'carpark',
    loc: 'Hótel Hraun · Parking',
    enter: (G) => { if (G.t < T(1, 10, 15)) G.S.t = T(1, 10, 15); G.dread(4); },
    text: (G) => p(
      'Quelqu\'un dit qu\'il y a un bus dehors. Vous demandez à la réceptionniste si c\'est le vôtre. Elle ne sait pas. Elle désigne le panneau en Arial. ' + V(LX('“Maybe you should hurry.”')),
      'Imaginez une jauge de jeu vidéo, mais pour vos nerfs, qui descend jusqu\'au mince filet de rouge tremblotant.',
      'Dehors : des cars. Personne ne vous a dit lequel. Aucun ne porte votre numéro de vol, sauf celui qui le porte, au feutre.',
      G.has('hint_notes') && W('« Ceux avec l\'écusson, c\'est pas les nôtres. »'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: '#c7c3b6', windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'day' },
        name: 'Le même car blanc qu\'hier soir, ou un qui lui ressemble beaucoup',
        sign: G.pick(['AIRPORT', 'AB0271 → KEF', 'FLIGHT PPL AIRPORT']), signStyle: 'paper',
        look: ['Chauffeur en gilet fluo. Sandwich différent.', 'À moitié plein. Des gens continuent de sortir du hall dans sa direction.'],
        hidden: [(G.did('talk_fleece') || G.has('met_fleece') ? 'La polaire. ' : 'L\'homme en polaire du contrôle des passeports. ') + 'L\'enfant. L\'homme du 31C. Les mêmes vêtements qu\'hier soir, évidemment, qu\'est-ce qu\'ils porteraient d\'autre.', 'Vous n\'êtes pas physionomiste. Ceux-là, vous les connaissez.'],
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
        look: ['Le chauffeur tient une pile de serviettes blanches.', 'Ça sent le soufre et l\'eucalyptus.'],
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
      if (G.once('nofood')) { if (G.rng() < 0.5) G.at(T(1, 12, 30), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Catering sur votre vol', body: 'Cher Client,\n\nVeuillez noter qu\'en raison du déroutement, aucun service de restauration ne sera assuré sur le vol AB 0271.\n\nNous vous recommandons d\'acheter de quoi vous restaurer dans le terminal.\n\nNous faisons de notre mieux.' }); }
      G.at(T(1, 12, 0), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Temps de départ révisé', body: 'Cher Client,\n\nVotre vol AB 0271 partira désormais à 15:45.\n\nL\'enregistrement ouvre trois heures avant le départ.\n\nNous faisons de notre mieux.', fx: (G) => { G.S.dep = T(1, 15, 45); } });
      G.at(T(1, 13, 10), 'chat', { body: 'Vous avez été hébergé. Pourquoi êtes-vous dans une queue ? 🙂' });
    },
    text: (G) => p(
      'Vous présumez que vous êtes au bon endroit, uniquement parce que vous commencez à reconnaître d\'autres passagers – alors que vous n\'êtes pas physionomiste. Le bus part avec vingt minutes de retard, ce qui, d\'après vos calculs, signifie que vous arriverez à l\'aéroport à peine quarante minutes avant même l\'ouverture de l\'enregistrement.',
      'Un bébé hurle. ' + (G.did('morn_mother') ? 'La mère le redit, à tout le car cette fois : ' : 'La mère murmure : ') + V('« Elle voudrait être à la maison, maintenant »,') + ' et tout le bus rit, tristement.',
      'L\'Islande défile par la vitre : une excellente eau du robinet, de beaux paysages, des gens plutôt aimables, pas forcément serviables, mais qui ne vous menacent pas et ne vous mentent pas. Un grand bravo à l\'Islande pour ça. Keflavík est innocente.',
    ),
    choices: [{ label: 'Arriver.', time: 55, do: (G) => G.nerves(-4), next: 'airport' }],
  };

  /* ---------------------------------------------------------------- Day 1 · ~11:30 the airport (hub) */
  scenes.airport = {
    art: 'airport',
    loc: 'Aéroport international de Keflavík · Départs',
    enter: (G) => {
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
      { label: 'Imprimer une nouvelle carte d\'embarquement à la borne.', nd: 4, dd: 2, time: 8, do: (G) => { const n = G.count('kiosk'); G.nerves(3); G.note(n === 1 ? 'RÉSERVATION INTROUVABLE. Vous changez de borne. Vous saisissez les infos. RÉSERVATION INTROUVABLE, dans une autre police. Ça ne s\'invente pas.' : n === 2 ? 'La borne réfléchit longtemps et imprime une carte vierge. Vous la gardez. Vous ne savez pas pourquoi.' : 'VOTRE RÉSERVATION A ÉTÉ HÉBERGÉE. Puis l\'écran vire au noir et vous renvoie votre visage.'); if (n >= 3) G.dread(3); }, next: 'airport' },
      { label: 'Rejoindre la file de l\'unique comptoir.', if: (G) => !G.has('inline'), time: 5, do: (G) => { G.flag('inline'); G.note('Vous rejoignez la file. Ce n\'est pas tant une file qu\'une décision prise ensemble par deux cents personnes. Personne n\'y parle à la compagnie. Tout le monde y parle à tout le monde.'); }, next: 'airport' },
      { label: 'Faire circuler le QR code UK261 dans la file.', whyNot: 'Vos mains ne tiendraient pas le téléphone immobile.', dd: -6, nd: -4, nerveMax: 90, if: (G) => G.has('uk261'), once: 'qr2', time: 15, do: (G) => { G.collect(2); G.nerves(-5); G.note('Le code passe de main en main le long de la file, comme un mot de passe. ' + V('« Je suis prêt à jouer les Karen »,') + ' dit un homme en polaire, qui est l\'homme en polaire.'); }, next: 'airport' },
      { label: 'Comparer les hôtels et les heures de départ.', whyNot: 'Vous déclencheriez une dispute.', nd: -4, dd: -4, nerveMax: 85, once: 'notes2', time: 15, do: (G) => { G.collect(1); G.nerves(-3); G.note('Le mail de chacun l\'envoyait dans un endroit différent. Le bus de chacun l\'a amené au même hôtel. Chacun a reçu une heure différente, et tout le monde est revenu pour celle de la feuille, et vous voilà tous là, à avoir raison ensemble.'); }, next: 'airport' },
      { label: 'Trouver quelqu\'un en uniforme et lui dire exactement ce que vous pensez.', kind: 'conflict', nd: 8, time: 10, do: (G) => { G.strike(); G.note('Vous avez dit à un homme en uniforme exactement ce que vous pensiez. ' + V('« Nous faisons notre meilleur. »') + ' Pas d\'excuses. Pas de compassion. Même pas pour la forme. Il a noté quelque chose.'); }, next: 'airport' },
      { label: 'Chercher la sortie. Juste pour voir.', whyNot: 'Vous savez déjà qu\'elle est verrouillée.', dd: 6, dreadMax: 85, time: 8, once: 'exit', do: (G) => { G.dread(5); G.nerves(4); G.note('Les portes qui donnent sur l\'extérieur indiquent ARRIVÉES UNIQUEMENT. Vous êtes entré par là. Vous posez la main sur la vitre, elle ne s\'ouvre pas, et un homme en gilet fluo, sans vous regarder, secoue la tête.'); }, next: 'airport' },
      { label: G.has('inline') ? 'Acheter de l\'eau. L\'homme derrière vous ne fait pas confiance à la compagnie pour ne pas tomber à court.' : 'Acheter de l\'eau. Quelqu\'un dit qu\'il n\'y en aura bientôt plus.', whyNot: 'Vous la jetteriez.', nd: -4, nerveMax: 92, time: 10, once: 'water', do: (G) => { G.nerves(-3); G.note('De l\'eau, un sandwich avec la lettre ð dedans, et – parce que la boutique en a – des chaussettes. Vous aviez des chaussettes. Vous en rachetez. Personne, parmi ceux qui ont traversé cette nuit, ne vous jugerait.'); if (!G.has('toothpaste')) { G.flag('toothpaste'); G.nerves(-4); } }, next: 'airport' },
      { label: 'Regarder le tableau des départs.', dd: 3, nd: 3, time: 6, do: (G) => { const n = G.count('board'); G.dread(2); G.note(n === 1 ? `AB 0271 · LOS ANGELES · ${G.clock(G.S.dep)}. Puis le tableau fait défiler tous les vols du monde et revient dessus. Même heure. Pour l'instant.` : n === 2 ? 'L\'heure n\'a pas changé. La ligne a descendu d\'un cran. Tout ce qui est au-dessus, c\'est un vol pour quelque part, qui part.' : 'Vous le regardez défiler. LOS ANGELES. LOS ANGELES. Le temps d\'une image, quelque chose qui n\'est pas une ville. LOS ANGELES.'); }, next: 'airport' },
      { label: 'Attendre.', whyNot: 'Vous ne tenez pas en place.', kind: 'comply', nd: 3, dd: 3, nerveMax: 90, time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Une demi-heure. La file n\'avance pas parce qu\'il n\'y a rien vers quoi avancer. Quelqu\'un s\'assied par terre et ça se propage.', 'Une demi-heure. Une agente d\'entretien passe avec une machine. Une fois qu\'elle est partie, le sol est pareil et la file, un peu plus courte.', 'Une demi-heure. Votre téléphone vibre pour rien. Ceux de tout le monde, en même temps, et tout le monde regarde, et personne ne dit rien.'])); }, next: 'airport' },
    ],
  };

  scenes.checkin = {
    art: 'airport',
    loc: 'Keflavík · L\'unique comptoir',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 180); if (G.S.strikes >= 3) G.end('left'); },
    text: (G) => p(
      'Le comptoir ouvre à l\'heure, c\'est-à-dire à l\'heure qu\'il avait décidée en son for intérieur. L\'agent prend votre passeport. Pas une personne en uniforme n\'a manifesté le moindre regret de toute la journée, même pour la forme, et cet homme ne va pas briser la série. ' + V('« Nous faisons notre meilleur. »'),
      G.has('booked') && 'Il fronce les sourcils devant l\'écran. ' + V('« D\'après nos dossiers, vous avez été hébergé au Heathrow Renaissance Lodge la nuit dernière. »') + ' Il tape quelque chose. Il dit que c\'est noté.',
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
      'Une agente d\'embarquement prend le micro et vous <em>hurle</em> d\'embarquer par groupe.',
      'Et cent personnes lui rient au nez. Pas méchamment. Juste – sans pouvoir s\'en empêcher. Vous formez désormais une société autogérée, et sa tentative de lui donner des ordres est, allez savoir pourquoi, la chose la plus drôle qui soit arrivée de toute la journée.',
    ),
    choices: [
      { label: 'Rire avec eux.', whyNot: 'Ça sortirait de travers.', nd: -6, dd: -4, nerveMax: 85, time: 10, do: (G) => { G.collect(1); G.nerves(-6); }, next: 'jetbridge' },
      { label: 'Embarquer par groupe, docilement.', kind: 'comply', dd: 5, time: 10, do: (G) => G.nerves(2), next: 'jetbridge' },
      { label: 'Lui demander quand le vol partira vraiment.', kind: 'conflict', nd: 5, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) G.end('left'); }, next: 'jetbridge' },
      { label: 'Lui crier dessus. Plus fort qu\'elle.', kind: 'conflict', nerveMin: 80, nd: 10, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) G.end('left'); else G.note('Vous avez crié. Pendant quatre secondes, c\'était magnifique. Puis un homme en bleu marine a surgi à vos côtés, a noté quelque chose, et s\'en est allé, et les rires s\'étaient tus.'); }, next: 'jetbridge' },
    ],
  };

  scenes.jetbridge = {
    art: 'gate',
    loc: 'Keflavík · Passerelle',
    text: p(
      'La file s\'arrête sur la passerelle. L\'heure de départ inscrite sur votre carte d\'embarquement est déjà passée, et c\'est la carte la plus récente. Vous échangez avec l\'homme devant vous sur les informations contradictoires que vous avez chacun reçues sur ce à quoi ressemblera le vol.',
      'Puis la file avance, vous tournez au coin, et au lieu d\'une porte d\'avion il y a…',
      '<em>Un bus.</em>',
      W('Et il fallait absolument que vous embarquiez par groupe.'),
    ),
    choices: [{ label: 'Monter dans le bus.', time: 10, next: 'tarmac' }],
  };

  scenes.tarmac = {
    art: 'tarmac',
    loc: 'Un bus · une route · des pâturages vallonnés',
    enter: (G) => G.dread(5),
    text: (G) => p(
      'Ce bus ne vous emmène pas ailleurs sur le tarmac. Ce bus est sur ce qui a tout l\'air d\'une vraie route, à travers de vrais pâturages vallonnés, avec de vrais moutons dedans.',
      G.has('looked_out') ? 'À l\'avant du bus, debout, une main sur la barre, un homme en uniforme de chef de cabine. Il se retourne. Il vous regarde – vous, et vous seul – exactement aussi longtemps qu\'il avait regardé votre hublot. ' + V('« Vous avez regardé, »') + ' dit-il, aimablement, et se retourne.' : G.has('seen') ? 'À l\'avant du bus, debout, la main sur la barre, un homme en uniforme de chef de cabine. Il se retourne. Il vous regarde – vous seul – exactement aussi longtemps qu\'il a frappé à votre porte. ' + V('« Deux quatorze, »') + ' dit-il, aimablement, et se retourne.' : 'Le chauffeur ne parle pas. La radio passe quelque chose qui pourrait être la météo.',
      'Personne ne dit rien. Quelqu\'un, vers le fond, commence à rire, et s\'arrête.',
    ),
    choices: [
      { label: 'Rester à bord. Guetter à l\'horizon quoi que ce soit qui ait des ailes.', kind: 'comply', dd: 5, time: 15, next: 'plane' },
      { label: 'Aller devant. Demander au chauffeur où va ce car.', kind: 'conflict', nd: 4, time: 15, do: (G) => { G.nerves(5); G.flag('asked_driver2'); }, next: 'plane' },
      { label: 'Exiger de descendre. Maintenant.', kind: 'conflict', sub: 'Ce n\'est pas le tarmac.', do: (G) => G.end('pastures') },
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
      { label: 'Fermer les yeux.', do: (G) => G.end(G.S.collective >= 5 ? 'collective' : 'home') },
    ],
  };

  /* ================================================================ endings */
  const endings = {
    terminal: {
      art: 'terminal', title: 'LE TERMINAL', kind: 'bad',
      hint: 'Quelqu\'un fait toujours une annonce.', blurb: 'Vous avez attendu l\'annonce.',
      text: p(
        'Personne ne fait d\'annonce. Personne n\'en a jamais eu l\'intention. À 03h10, les lumières du hall des arrivées passent au quart, et le hall devient une forme que vous vous rappelez plus que vous ne la voyez.',
        'Votre téléphone affiche une barre et un nouveau mail. <em>Nous avons organisé des cars pour vous.</em> Il ne dit pas où. Il ne le dira jamais.',
        'Le matin, les agents d\'entretien trouvent une carte d\'embarquement et la déposent aux objets trouvés. Ils sont très scrupuleux là-dessus, ici.',
      ),
    },
    accommodated: {
      art: 'road', title: 'HÉBERGÉ', kind: 'bad',
      hint: 'Le mail portait le logo.', blurb: 'Vous avez confirmé la réservation.',
      text: p(
        'Il fait chaud dans la voiture, les sièges sont en cuir et le chauffeur ne parle pas. L\'écran du tableau de bord dit HEATHROW RENAISSANCE LODGE · 1 894 km · ARRIVÉE –:–.',
        'Vous regardez les lumières de l\'aéroport rétrécir. Au bout d\'un moment, il n\'y a plus de lumières du tout – seulement le bruit des pneus, et le petit carillon d\'un nouveau mail, qui arrive pour confirmer que votre hébergement a été organisé.',
      ),
    },
    crew: {
      art: 'stand', title: 'L\'ÉQUIPAGE', kind: 'bad',
      hint: 'Il avait un écusson. Il était très beau.', blurb: 'Vous êtes monté dans le beau.',
      text: (G) => p(
        'Le car sent la sellerie neuve et rien d\'autre. Tout le monde vous sourit sur votre passage. Personne ne porte les vêtements de la veille, parce que personne ici n\'a de veille.',
        'Le chef de cabine ferme la porte avec un bruit doux et luxueux. ' + V('« La majorité de nos clients ont été compréhensifs et patients. »') + ' C\'est de vous qu\'il parle. Vous avez été compréhensif. Vous avez été très patient.',
        G.has('at_hotel') ? 'Le car quitte la lumière, et le parking derrière lui est vide, et l\'est depuis un bon moment.' : 'Le car quitte la lumière, et le quai derrière lui est vide, et l\'est depuis un bon moment.',
      ),
    },
    convenience: {
      art: 'road', title: 'COMMODITÉ', kind: 'bad',
      hint: 'Vingt minutes à pied. Dans cet état.', blurb: 'Vous êtes monté, à mi-chemin du 10-11.',
      text: p(
        'Il fait chaud dans le car, et les sièges sont tournés vers l\'intérieur, ce que vous n\'avez remarqué qu\'une fois assis. ' + V('« Nous faisons notre meilleur, »') + ' dit le chef de cabine, et la porte se replie, et le 10-11 défile sur la gauche, toutes lumières allumées, sans personne dedans.',
        'Vous n\'aurez finalement jamais votre dentifrice.',
      ),
    },
    nightcoach: {
      art: 'corridor', title: 'CAR DE NUIT', kind: 'bad',
      hint: 'Dernier appel.', blurb: 'Vous avez répondu quand on a frappé.',
      text: (G) => p(
        G.has('nc_carpark') ? 'Vous marchez jusqu\'à la porte du car. L\'homme en bleu marine s\'écarte sans vous regarder. ' + V('« Départ maintenant »,') + ' dit-il, à l\'hôtel, et c\'est la seule consigne de toute la nuit qui soit venue avec une heure.' : G.has('nc_corridor') ? 'Il cesse de frapper. Il ne se retourne pas. ' + V('« Départ maintenant »,') + ' dit-il, à la porte devant lui, puis il va vers la cage d\'escalier, et vous suivez, parce que c\'est la seule consigne de toute la nuit qui soit venue avec une heure.' : 'Le couloir est vide et la moquette est mouillée. Depuis la cage d\'escalier : ' + V('« Départ maintenant. »') + ' Vous la suivez, parce que c\'est la seule consigne qu\'on vous ait donnée de toute la nuit qui soit assortie d\'une heure.',
        'Le car sur le parking attend, lumières intérieures allumées. Tout le monde à l\'intérieur est déjà tourné vers l\'hôtel. Il y a un siège à votre nom. Il y a même, en fait, une petite carte imprimée à votre nom, en Arial.',
      ),
    },
    lift: {
      art: 'corridor', title: 'L\'ASCENSEUR', kind: 'bad',
      hint: 'Hors service, en Arial.', blurb: 'Vous êtes entré dans l\'ascenseur qui est arrivé tout seul.',
      text: (G) => p(
        G.has('toothpaste') ? 'Les portes se ferment avec la courtoisie d\'un bon hôtel. Le miroir du fond vous montre : les vêtements d\'avion, le visage, le petit sac du 10-11 serré contre la poitrine. L\'ascenseur descend. Il descend plus longtemps que le bâtiment n\'a d\'étages.' : 'Les portes se ferment avec la courtoisie d\'un bon hôtel. Le miroir du fond vous montre : les vêtements d\'avion, le visage, les mains vides. L\'ascenseur descend. Il descend plus longtemps que le bâtiment n\'a d\'étages.',
        'Quand les portes s\'ouvrent, c\'est sur une lumière chaude et des rangées de sièges, et tous ceux qui y sont assis se tournent vers vous, et sourient, et le chef de cabine dit : ' + V('« Merci pour votre patience, »') + ' et il le pense.',
      ),
    },
    tantalus: {
      art: 'carpark', title: 'TANTALE', kind: 'bad',
      hint: 'Vous avez toujours voulu visiter l\'Islande.', blurb: 'Vous êtes allé aux sources chaudes.',
      text: (G) => p(
        G.has('toothpaste') ? 'L\'eau est à 38 °C, le ciel a la couleur d\'un mouchoir usagé et vous portez les chaussettes du 10-11, les plus belles chaussettes que vous ayez jamais vues, désormais pleines de soufre. C\'est, objectivement, magnifique.' : 'L\'eau est à 38 °C, le ciel a la couleur d\'un mouchoir usagé et vous portez les chaussettes du vol parce que vous n\'avez pas d\'autres chaussettes. C\'est, objectivement, magnifique.',
        'À 11h00, un bus quitte le parking d\'un hôtel à trente kilomètres de là, sans vous. À 11h04, un mail arrive pour dire que votre car est parti à 09h00. À 11h05, le chatbot demande si vous avez apprécié votre séjour.',
        'Dommage que vous ayez tenu cette patte de singe en le disant.',
      ),
    },
    noshow: {
      art: 'lobby', title: 'NO-SHOW', kind: 'bad',
      hint: 'Le panneau disait 11h00.', blurb: 'Vous avez attendu l\'heure exacte du panneau.',
      text: (G) => p(
        'À 11h30, le panneau a disparu. La réception ne se souvient pas de l\'avoir affiché. ' + V(LX('“Are you with the airline group? They\'ve gone.”')) + ' Elle le dit gentiment.',
        'La machine à café du hall fait un bruit de quelque chose qui se racle la gorge. Votre réservation, quand vous vérifiez, est introuvable.',
      ),
    },
    left: {
      art: 'airport', title: 'RESTÉ À QUAI', kind: 'bad',
      hint: 'Il l\'avait bien dit.', blurb: 'Trois réclamations, toutes notées.',
      text: p(
        V('« Nous avons noté votre feedback, »') + ' dit l\'homme en uniforme, et il s\'avère que oui ; tout y est, sur une petite carte, d\'une écriture soignée. Elle porte trois coches.',
        V('« Comme indiqué à bord, les clients qui s\'opposent ou font objection aux décisions opérationnelles peuvent être débarqués. »') + ' Il dit cela sans la moindre méchanceté, et c\'est le pire. Puis il demande au passager suivant d\'avancer, et la file se referme sur vous comme de l\'eau.',
      ),
    },
    pastures: {
      art: 'tarmac', title: 'PÂTURAGES', kind: 'bad',
      hint: 'Ce bus est sur une vraie route.', blurb: 'Vous êtes descendu du bus du tarmac.',
      text: p(
        'Le bus s\'arrête ; c\'est ce que vous vouliez. La porte s\'ouvre sur un bas-côté, une clôture, des moutons, et un vent qui vient de loin, à votre rencontre. ' + V('« Comme vous voudrez »,') + ' dit le chauffeur, et le bus repart sans vous, vers quelque chose qui pourrait, à cette distance, être un avion.',
        'L\'Islande n\'a rien fait de mal. Les moutons sont très gentils.',
      ),
    },
    home: {
      art: 'plane', title: 'CHEZ VOUS (OU AU GROENLAND, OU EN ENFER)', kind: 'good',
      hint: 'À bientôt à Los Angeles.', blurb: 'Vous y êtes arrivé. Seul, pour l\'essentiel.',
      text: p(
        'Vous êtes dans un siège. Le siège est dans un avion. L\'avion, pour autant que vous puissiez en juger, se déplace en direction de Los Angeles.',
        'Personne en uniforme ne s\'est jamais excusé. Le remboursement du wifi n\'a toujours pas été réclamé.',
        'Rendez-vous à Los Angeles dans dix heures. Ou au Groenland. Ou en enfer.',
      ),
    },
    collective: {
      art: 'plane', title: 'LE COLLECTIF AUTOGÉRÉ DE LHR–LAX', kind: 'good',
      hint: 'Le ouï-dire n\'est pas un canal officiel.', blurb: 'Vous y êtes arrivé, et tous ceux à qui vous avez parlé aussi.',
      text: (G) => p(
        'Sur l\'escalier, quelqu\'un rit, puis tout le monde, et la pluie n\'a plus d\'importance. Vous voyagez ensemble depuis plus de vingt-huit heures. ' + (G.has('uk261') ? 'Vous avez un QR code, un homme en polaire, ' : 'Vous avez un homme en polaire, ') + (G.has('met31c') || G.has('ally31c') ? 'un homme du 31C, ' : '') + 'et un enfant qui a vu des choses.',
        'Les informations les plus exactes et les plus utiles de toute cette épreuve sont venues de feuilles imprimées en Arial et de passagers inconnus colportant des ouï-dire. Personne en uniforme ne s\'est jamais excusé. Il s\'avère que vous n\'en aviez pas besoin.',
        'À bientôt à Los Angeles. Au nom du collectif autogéré de LHR–LAX, vous souhaitez bon rétablissement à l\'homme en soins intensifs.',
      ),
    },
  };

  /* ================================================================ interface strings */
  const ui = {
    tabMail: 'Mails', tabAlly: 'Ally', tabSms: 'SMS', tabPaper: 'Papier', phone: 'TÉLÉPHONE',
    nerves: 'NERFS', dread: 'EFFROI', noted: 'NOTÉ', day: 'JOUR',
    board: 'Monter', look: 'Regarder de plus près', lookHint: 'Coûte quelques minutes.',
    again: 'Reprendre l\'avion', endings: 'Fins', back: 'Retour', howto: 'Comment ça marche', start: 'Monter', design: 'Notes de conception',
    gameOver: 'GAME OVER', madeIt: 'VOUS Y ÊTES ARRIVÉ – PLUS OU MOINS',
    subtitle: 'UNE HORREUR HÔTELIÈRE · TEXTE · 20–30 MINUTES',
    galleryIntro: 'Toutes les manières dont ça peut finir. Les verrouillées sont toujours là, quelque part.', locked: '???',
    noMail: 'Pas de mail. Ça, au moins, c\'est normal.', noSms: 'Pas de messages.', noPaper: 'Photos des panneaux imprimés que vous trouvez. Vous en trouverez.',
    allyIntro: 'Ally – assistante virtuelle Albion Atlantic. Répond généralement instantanément.', inbox: '‹ Boîte de réception',
    emailFoot: 'Ceci est un message automatique. Les réponses à cette adresse ne sont ni surveillées, ni lues, ni possibles. Albion Atlantic – Nous faisons de notre mieux.',
    from: 'De :', sent: 'Envoyé', received: 'Reçu', arrived: 'arrivé', photographed: 'Photographié',
    tMail: 'MAIL', tSms: 'SMS', tPaper: 'PAPIER', tAlly: 'ALLY', tNoted: 'NOTÉ · La compagnie a enregistré votre feedback.',
    gateNerves: 'Vous n\'arriveriez pas à garder la voix ferme pour ça.', gateDread: 'Vous n\'arrivez pas à vous y résoudre.',
  };

  return { start, scenes, endings, chat, ui, T, lang: 'fr', broken: CONTENT_BROKEN };
})();
