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
CONTENTS.en = (() => {
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
      { d: 1, t: 'A floor-cleaning machine goes past, slowly, driven by somebody whose face you never quite see.' },
      { d: 1, t: 'Somebody has found a plug socket, and eleven people are standing around it like a fire.' },
      { d: 1, t: 'The arrivals board says nothing about your flight. It says nothing about any flight.' },
      { d: 1, t: 'A child is asleep on a luggage trolley. There is no luggage.' },
      { d: 2, t: 'There are fewer people in the hall than there were. You did not see anyone leave.' },
      { d: 2, t: 'The fluorescent tube above the bag counter has started to tick.' },
      { d: 2, t: 'Every few minutes someone stands up, walks to the doors, and comes back.' },
      { d: 3, t: 'The STAFF door is open a hand\'s width. You did not see it open.' },
      { d: 3, t: 'For a moment every phone in the hall lights up at once, and then they all go dark.' },
      { d: 3, t: 'Somebody is standing at the shutters of the duty free with their back to the hall. They are wearing navy.' },
    ],
    room: [
      { d: 2, t: 'The heating makes a sound like someone thinking about knocking.' },
      { d: 2, t: 'The kettle has a little light. It is the only thing in the room that is on your side.' },
      { d: 2, t: 'Somebody in the corridor is dragging a wheeled case they cannot possibly have.' },
      { d: 2, t: 'Your reflection in the black window is wearing yesterday\'s clothes. Everyone is.' },
      { d: 3, t: 'A car goes past on the road outside, slowly, and does not turn in.' },
      { d: 3, t: 'Through the wall, next door, a television is showing the same nothing as yours.' },
      { d: 3, t: 'The room is 214. The card says 214. You keep checking, as if it might have moved.' },
      { d: 3, t: 'Somebody in the corridor stops outside your door, and then goes on.' },
      { d: 4, t: 'The light under the door goes out, and then comes back, and then goes out.' },
      { d: 4, t: 'Somewhere below, an engine is running. It has been running for a while.' },
      { d: 4, t: 'The phone lights up with nothing. No message. Just the screen, looking at you.' },
      { d: 4, t: 'You hear a knock, two doors down. Even, patient. Then one door down.' },
      { d: 5, t: 'There is someone in the car park. There has been for some time.' },
      { d: 5, t: 'The curtain moves. There is no window open.' },
      { d: 5, t: 'The room phone rings once and stops.' },
    ],
    corridor: [
      { d: 2, t: 'Carpet the colour of a bruise. A trolley of towels parked at the far end, abandoned mid-shift.' },
      { d: 2, t: 'Every door has a number. Every number has a line of light under it.' },
      { d: 3, t: 'The ice machine grinds, stops, grinds.' },
      { d: 3, t: 'The light at the far end of the corridor is off. It was on.' },
      { d: 3, t: 'Somebody laughs behind one of the doors, and stops halfway through.' },
      { d: 4, t: 'The carpet outside 216 is wet.' },
      { d: 4, t: 'You can hear the lift moving between floors. Nobody has called it.' },
      { d: 4, t: 'The fire door at the end is propped open with a shoe.' },
      { d: 5, t: 'The doors down the corridor stand open, one after another, and the rooms behind them are made up. Nobody was ever in them.' },
      { d: 5, t: 'At the far end, someone in navy is knocking on a door, evenly, and moving on to the next.' },
    ],
    lobby: [
      { d: 2, t: 'The night clerk is doing a crossword in a language you don\'t know. She has not filled anything in.' },
      { d: 2, t: 'A tour poster: GLACIERS · WHALES · NORTHERN LIGHTS. Nobody in this lobby will see any of these.' },
      { d: 2, t: 'Two passengers asleep upright on the sofa, holding their phones like candles.' },
      { d: 3, t: 'The coffee machine\'s red light blinks in a rhythm that is almost a word.' },
      { d: 3, t: 'The glass doors slide open for nobody, and close again.' },
      { d: 3, t: 'The printed sign has a new water stain on it. It is drying into a shape.' },
      { d: 4, t: 'Out in the car park: headlights, idling. They do not turn off.' },
      { d: 4, t: 'The night clerk looks past you, at the doors, and then back at her crossword.' },
      { d: 4, t: 'One of the sleeping passengers has gone. Their phone is still on the sofa, face up, showing an email.' },
      { d: 5, t: () => 'The clerk says, without looking up, ' + LX('“He asked for you.”') },
      { d: 5, t: 'The doors slide open. Cold air. Nobody comes in. They stay open.' },
    ],
    carpark: [
      { d: 2, t: 'Wind. Lava fields. A road going one way into the dark and the other way into a slightly different dark.' },
      { d: 2, t: 'The hotel behind you is lit like an aquarium.' },
      { d: 3, t: 'Gravel. A single lamp. Rain that cannot decide.' },
      { d: 3, t: 'A coach-shaped darkness at the far end of the car park, engine off. Or on.' },
      { d: 4, t: 'The coach at the far end has its interior lights on. Every seat is taken.' },
      { d: 4, t: 'Someone is standing beside the coach door, very straight, hands folded.' },
      { d: 5, t: 'He is looking at the hotel. At one window. You know which.' },
    ],
    morning: [
      { d: 2, t: 'Breakfast is being cleared. It was never really served.' },
      { d: 2, t: 'Somebody has arranged the tiny jam pots into a line, by colour.' },
      { d: 2, t: 'The toddler is explaining something important to a radiator.' },
      { d: 3, t: 'There are fewer people at breakfast than there were in the lobby last night. Different hotels, everyone says. Different hotels.' },
      { d: 3, t: 'A man at the next table has received four emails with four different times. He is reading them aloud like weather.' },
      { d: 3, t: 'Outside, in daylight, the car park looks like a car park. It has a coach in it.' },
      { d: 4, t: 'Nobody is talking any more. Everybody is watching the doors.' },
      { d: 4, t: 'The night clerk is still on. She has not changed. She is doing the same crossword.' },
    ],
    airport: [
      { d: 3, t: 'The departure board updates. Your flight moves down one row. Nothing moves up.' },
      { d: 3, t: 'A woman at the front of the queue has been there so long she has taken her shoes off.' },
      { d: 3, t: 'The one counter has a bell. Nobody presses it. Somebody presses it. Nothing.' },
      { d: 4, t: 'The doors to outside say ARRIVALS ONLY. They were not locked earlier.' },
      { d: 4, t: 'The queue is shorter than it was. Nobody has been served.' },
      { d: 4, t: 'A man in a navy uniform walks the length of the queue, counting, and goes back through a door.' },
      { d: 5, t: 'The shops are shuttering, one by one, in order, toward you.' },
      { d: 5, t: 'Your name is called over the PA. Then it isn\'t. Nobody else heard it.' },
      { d: 5, t: 'The board says LOS ANGELES and, for one second, something else.' },
      { d: 6, t: 'Nobody is in the queue now but you and the people you recognise. The rest have gone somewhere.' },
      { d: 6, t: 'The counter agent is looking at you. He has been for a while. He is smiling.' },
    ],
  };

  /* ================================================================ chatbot
     Ally is the channel that always lies — but lies *specifically*. As dread
     rises it starts to know where you are. */
  const tail = (G) => {
    const d = G.D;
    if (d >= 5) return '\n\n' + G.pick(['Why are you still here?', 'The majority of customers have boarded.', 'We can see that you are still there.']);
    if (d >= 3) return '\n\n' + G.pick(['You are still in room 214.', 'Please remain where you are.', 'Is there anything else? There is nothing else.']);
    return '';
  };
  const chat = [
    {
      label: 'Where is my hotel?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Your accommodation was Hótel Hraun. We hope you enjoyed your stay! Would you like to leave a review?' + tail(G);
        if (G.has('at_hotel')) return 'You are at Hótel Hraun, room 214. Please remain in your room until collected.' + tail(G);
        return 'Great question! Your accommodation has been arranged at the Heathrow Renaissance Lodge, Bath Road. A booking link has been emailed to you. 🛏️';
      },
    },
    {
      label: 'When is the bus?',
      answer: (G) => {
        if (G.has('at_airport2')) return 'Your coach to the aircraft departs once boarding is complete. Please board by group. 🚌' + tail(G);
        if (G.has('morning')) return 'Your transfer to the airport is confirmed for 08:00. Please be in the lobby 15 minutes early.' + tail(G);
        if (G.has('at_hotel')) return 'Your coach departs at 04:30. A member of staff will knock.' + tail(G);
        return 'Coaches have been organised for all customers. Please proceed to the coaches. 🚌';
      },
    },
    {
      label: 'What is happening?',
      answer: (G) => G.pick([
        'Your flight AB 0271 to Los Angeles is on time. ✈️',
        'I\'m here to help! Flight AB 0271 is currently operating as scheduled.',
        'Everything is proceeding normally. Is there anything else I can help with?',
      ]) + tail(G),
      do: (G) => G.nerves(2),
    },
    {
      label: 'I want to complain.',
      warn: true,
      answer: 'I\'m sorry to hear that. Your feedback has been recorded against your booking. Thank you for flying Albion Atlantic — we\'re doing our best. 🙏',
      do: (G) => G.strike(),
    },
  ];

  /* ================================================================ scenes */
  const scenes = {};

  scenes.title = {
    type: 'title',
    board: `AB 0271   LONDON LHR  →  LOS ANGELES LAX      DEPARTED 20:05\n                                              STATUS: ▮▮▮▮▮▮▮▮▮▮`,
    text: p(
      'Nine hours, nonstop, home by midnight Pacific. You drank the extra coffee. You did everything right.',
      'This is a game about being told, very politely, that everything is fine.',
      W('Inspired by a real diverted-flight thread. The airline in this game is fictional. The buses are not.'),
    ),
  };

  scenes.howto = {
    loc: 'Safety card',
    text: p(
      '<em>Read everything.</em> Your phone (on the right, or under the PHONE button) gets mail from the airline, a chatbot called Ally, texts, and photographs of any printed sign you come across. Somebody is telling the truth. It is not always who has the logo.',
      '<em>Two bars.</em> Both of them fill. Neither one ends the game. What they do is close doors: as a bar fills, some of what you could have said or done stops being available, and what is left is what is left. Small choices fill them. Sleep, food, and other people empty them, a little.',
      '<em>Noted</em> counts the complaints the airline has recorded against you. At three, they act on it — where they can.',
      'Places are rooms you can move around in. Doing things takes minutes; the clock only moves when you act. Buses come and go. Look closely at them before you get on. The right one will look like you feel.',
      'Runs take twenty to thirty minutes. There are twelve endings, and one of them is Los Angeles.',
    ),
    choices: [{ label: 'Back', next: 'title' }],
  };

  scenes.gallery = { type: 'gallery' };

  /* ---------------------------------------------------------------- Day 0 · the approach
     Boarding, the seat, the demonstration, the meal, the dark hours. Nothing
     goes wrong here. That is what it is for: four hours of a cabin working
     exactly as it should, with one man in it counting. */
  scenes.boarding = {
    art: 'gate',
    loc: 'London Heathrow · Jetbridge · Seat 31B',
    enter: (G) => { if (G.once('welcome_mail')) G.msg('email', { from: 'Albion Atlantic', subj: 'Welcome aboard AB 0271', body: 'Dear Customer,\n\nWelcome aboard Albion Atlantic flight AB 0271 to Los Angeles. Your flight is on time.\n\nOur cabin crew are here to ensure your safety and comfort. The safety of our customers is tantamount.\n\nAs a valued customer you are invited to accept a complimentary upgrade to Business Class for this flight. Business Class customers enjoy a quieter cabin and are trusted to find their own way.\n\nEnjoy your flight.', actions: [{ label: 'Accept the complimentary upgrade', if: (G) => !G.has('business') && !G.has('at_hotel'), do: (G) => { G.flag('business'); G.nerves(-2); G.dread(4); G.note('You accepted the upgrade. Nothing changed about your seat. An attendant brought a warm towel, and the purser, passing, said ' + V('“Business,”') + ' to himself, and made a small mark.'); } }] }); },
    text: (G) => p(
      G.last(),
      'The jetbridge smells of kerosene and carpet. At the aircraft door, the purser: tall, silver at the temples, a smile that was ironed with the shirt. He does not look at boarding passes. He looks at faces, one at a time, and says ' + V('“Welcome aboard”') + ' to each of them as if he will need to remember it.',
      'Row 31. An aisle seat, 31B. In 31C, a man about your age with a paperback he has already stopped reading. He nods. You nod. That is the whole conversation, and it will be for some time.',
      'Somewhere behind you, a two-year-old is being told, patiently, that the plane is not going yet. The plane is not going yet.',
    ),
    choices: [
      { label: 'Say hello to 31C.', nd: -1, dd: -1, time: 20, do: (G) => { G.flag('met31c'); G.note('He said hello back. He is going home. He said it the way people say it at the start of nine hours: home, as if it were a place the aircraft was certain to reach.'); }, next: 'takeoff' },
      { label: 'Stow your bag, sit down, fasten the belt before anyone asks.', kind: 'comply', dd: 2, time: 20, do: (G) => G.note('Belt fastened. Bag stowed. The purser, passing, glanced down at it and gave the smallest nod, the nod of a man who keeps a list.'), next: 'takeoff' },
      { label: 'Ask the purser at the door whether the flight is on time.', nd: 1, time: 20, do: (G) => G.note(V('“Everything is on time,”') + ' he said, warmly, and then — as if to be thorough — ' + V('“Everything.”') + ' He was still looking at the passengers coming in behind you.'), next: 'takeoff' },
      { label: 'Read the safety card in the seat pocket. Properly, for once.', nd: -2, time: 20, do: (G) => G.note('Brace position. Nearest exits, which may be behind you. A small drawing of a person sliding into the sea with an expression of calm. You put it back. You have never read one before, and you do not know why you did now.'), next: 'takeoff' },
    ],
  };

  scenes.takeoff = {
    art: 'cabin',
    loc: 'Runway 27L · Heathrow',
    text: p(
      'The purser does the safety demonstration himself, at the front, while the video plays behind him without sound. He does it slowly. He does it looking at each row in turn, as if checking that the exits are where the card says.',
      V('“In the unlikely event. In the unlikely event. The safety of our customers is tantamount.”') + ' It is a strange thing to say in a safety demonstration, and he says it as if it were the ordinary thing.',
      'Then the engines, and the pressure in the back of the seat, and London tilting away into orange and black. The seatbelt sign stays on for a long time after it needs to.',
    ),
    choices: [
      { label: 'Watch the demonstration to the end.', kind: 'comply', dd: 2, time: 40, do: (G) => G.note('You watched to the end. He finished on your side of the cabin, and for a moment the demonstration was being done to you specifically, and then it was over and he was walking back up the aisle, touching the tops of the seats.'), next: 'service' },
      { label: 'Look out of the window at London going.', nd: -2, time: 40, do: (G) => G.note('The M25 like a ring of amber. Then cloud. Then nothing but the wing light, blinking, and your own face in the glass, going home.'), next: 'service' },
      { label: 'Check your phone once more before airplane mode.', dd: 1, time: 40, do: (G) => { G.msg('sms', { from: 'Jo 💛', body: 'safe flight!!! text me when you land 🛫' }); G.note('One text. Jo. You wrote back <em>will do</em> and watched it fail to send, and switched the phone to airplane mode, and felt the cabin close over you like a lid.'); }, next: 'service' },
    ],
  };

  scenes.service = {
    art: 'cabin',
    loc: 'Cruise · over the Irish Sea',
    text: (G) => p(
      G.last(),
      'Dinner comes on a trolley pushed by two attendants who smile like a job. Chicken or pasta. The purser follows the trolley a few rows behind, not serving, just walking, looking at the trays, looking at the people with the trays.',
      G.has('met31c') ? 'The man in 31C has the pasta. He does not eat it. He looks at the seatback map, where a small aircraft has not yet reached the coast of Ireland.' : 'The man in 31C has the pasta. He does not eat it. He has not said a word.',
    ),
    choices: [
      { label: 'Chicken.', time: 40, nd: -2, do: (G) => G.note('The chicken was a chicken in the way the safety card\'s sea was a sea. You ate it. You were going home; you would eat properly there.'), next: 'night' },
      { label: 'Order a coffee. Then another.', nd: 6, sub: 'You are getting your body onto Pacific time and you are not giving that up.', time: 40, do: (G) => { G.flag('coffee'); G.nerves(-3); G.note('Two coffees. Airline coffee, which is to say a warm opinion. You drank them on principle. The principle was Pacific time, and the purser, passing, looked at the second cup for slightly longer than a cup deserves.'); }, next: 'night' },
      { label: 'Skip dinner. Recline. Try to sleep now.', kind: 'comply', dd: 3, nd: -3, time: 40, do: (G) => G.note('You slept, a little, the way you sleep on planes: not asleep so much as switched off. When you surfaced, the trays were gone and the cabin lights were down and somebody, up front, was standing very still in the aisle.'), next: 'night' },
      { label: 'Ask the attendant, pleasantly, whether the purser is always like this.', kind: 'conflict', nd: 4, dd: -2, time: 40, do: (G) => G.note('She laughed, once, and then did not, and looked up the aisle to where he was. ' + V('“He\'s very thorough,”') + ' she said, and gave you the pasta you had not asked for.'), next: 'night' },
    ],
  };

  scenes.night = {
    art: 'cabin',
    loc: 'Cruise · mid-Atlantic · hour four',
    enter: (G) => G.dread(2),
    text: (G) => p(
      G.last(),
      'The cabin is dark now. Screens, mostly off. The map on the seatback shows a small aircraft over a great deal of blue, with GREENLAND somewhere up and to the right, as a rumour.',
      'The purser walks the aisle. Slowly, from the front, with a small card in one hand and a pencil in the other, and at each row he stops and looks and makes a mark. He does not explain. Nobody asks. When he reaches your row he looks at you, and at 31C, and at the empty seat by the window, and writes.',
      'At the front, the curtain to the forward cabin has been drawn. There is light behind it, and people going in and out of it quickly, and then the purser standing outside it with his hands folded, facing not the curtain but the rest of you.',
    ),
    choices: [
      { label: 'Sleep, or try to.', kind: 'comply', dd: 2, nd: -3, time: 40, do: (G) => G.note('You closed your eyes. Behind them the aisle went on being walked. Somewhere near the front a woman said ' + V('“Is he all right?”') + ' and somebody said ' + V('“Please return to your seat,”') + ' and you did not open your eyes, because you were not the one being spoken to. Yet.'), next: 'cabin' },
      { label: 'Watch the map.', dd: 2, time: 40, do: (G) => G.note('The little aircraft moved so slowly it seemed to be deciding. Then, for a while, the map showed nothing at all, just blue, and a time-to-destination that stayed at 5:12 for longer than a minute lasts.'), next: 'cabin' },
      { label: 'Go to the toilet at the front. Walk past the curtain.', whyNot: 'Not past him.', dd: 4, nd: 2, dreadMax: 90, time: 40, do: (G) => { G.flag('saw_galley'); G.note('Through the gap in the curtain: somebody on the galley floor, an attendant kneeling beside them, a blanket, a hand. You cannot see what is wrong and you are not going to be told. The purser stands over them with his hands folded — watching not the floor, but the cabin, through the gap, and so watching you. ' + V('“Please return to your seat,”') + ' he said, without moving anything but his mouth.'); }, next: 'cabin' },
      { label: 'Ask 31C if he saw the card.', nd: -1, dd: -2, time: 40, do: (G) => { G.flag('met31c'); G.note(V('“Headcount,”') + ' he said. ' + V('“They do it before they land somewhere they didn\'t plan to.”') + ' He said it like a joke. Neither of you laughed. It was the first thing he had said in four hours.'); }, next: 'cabin' },
    ],
  };

  scenes.cabin = {
    art: 'cabin',
    loc: 'Somewhere south of Greenland · 37,000 ft',
    text: (G) => p(
      G.last(),
      'The seatbelt sign comes on with a sound like a spoon on a glass.',
      G.has('saw_galley') ? 'The captain: a customer is unwell. You know. They are diverting to Reykjavík. He is sorry. He says the word twice, and both times it sounds like a person saying it.' : 'The captain: a customer is unwell. They are diverting to Reykjavík. He is sorry. He says the word twice, and both times it sounds like a person saying it.',
      'The cabin does what cabins do. Somebody says, ' + V('“You have got to be joking.”') + ' Somebody three rows up presses the call button, and keeps pressing it. A man near the galley stands up and asks, in a voice built to carry, who exactly is going to pay for his connection.',
      'Nobody answers him. The call button keeps ringing.',
    ),
    choices: [
      { label: 'Say nothing. Look at the map on the seatback screen.', kind: 'comply', dd: 4, sub: 'The little plane is turning.', time: 15, do: (G) => G.note('The little plane on the map has turned north. Below it, the word GREENLAND, and below that, nothing. Around you, the complaining goes on without you.'), next: 'cabin_purser' },
      { label: 'Ask a flight attendant, politely, what happens after we land.', nd: 2, time: 15, do: (G) => { G.flag('asked_crew'); G.nerves(3); G.note('She smiled at you the way people smile at a dog in a car. ' + V('“Everything will be communicated.”') + ' She did not say by whom. Behind her, the man near the galley was still standing.'); }, next: 'cabin_purser' },
      { label: 'Add your voice. Out loud. You have a life waiting in Los Angeles.', whyNot: 'Not with him listening.', kind: 'conflict', nd: 10, dreadMax: 80, time: 15, do: (G) => { G.strike(); G.flag('objected'); G.note('You said it. Not shouting — but not quietly either, and a few heads turned, and the man near the galley pointed at you as if you were evidence. For a moment it felt like a cabin full of people agreeing.'); }, next: 'cabin_purser' },
      { label: 'Press the call button, like the others.', kind: 'conflict', nd: 4, time: 15, do: (G) => G.note('You pressed it. Yours joined the one three rows up, and another behind, until the cabin was a small orchestra of the same note, and nobody came, and nobody was going to.'), next: 'cabin_purser' },
    ],
  };

  scenes.cabin_purser = {
    art: 'cabin',
    loc: 'Somewhere south of Greenland · 37,000 ft',
    enter: (G) => G.dread(2),
    text: (G) => p(
      G.last(),
      'Then the purser takes the handset. You hear the accent before the words — warm, posh, extraordinarily patient. He has waited for the call button to stop. It has not stopped. He speaks over it.',
      V('“Ladies and gentlemen. I am in charge of this cabin, and the safety of our customers is tantamount. Anyone who resists or objects to this diversion will be offloaded in Iceland. We are doing our best.”'),
      'A hush. The man near the galley sits down. The call button goes out. Three rows back, somebody laughs once, and stops.',
      G.has('objected') && W('He is not looking at the man near the galley. He is looking at your row.'),
    ),
    choices: [
      { label: 'Sit with it.', kind: 'comply', dd: 3, time: 15, do: (G) => G.note('You sat with it. Everyone did. It is remarkable how quickly two hundred people can decide to have been patient all along.'), next: 'cabin2' },
      { label: 'Look around. See who else objected.', time: 15, do: (G) => { G.nerves(-2); G.note('Four faces, maybe five, still set. The man near the galley. A woman with a toddler. You memorise them the way you would memorise exits.'); }, next: 'cabin2' },
      { label: 'Laugh. Once.', kind: 'conflict', nd: 3, dd: -2, time: 15, do: (G) => G.note('You laughed, once, and somebody two rows back laughed with you, and then you both stopped, because the purser had put the handset down very gently and was looking down the aisle.'), next: 'cabin2' },
    ],
  };

  scenes.cabin2 = {
    art: 'cabin',
    loc: 'Descending · North Atlantic',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      (G.has('met31c') ? 'The man in 31C, quietly, says: ' : 'The man in 31C, who has said nothing since Heathrow, says: ') + V('“They can\'t actually do that. Can they?”'),
      'He means the offloading. He is looking at you as if you might know.',
      'Up the aisle the purser is walking slowly toward the back, reading seat numbers off the overhead panels the way a person reads a list they wrote themselves.',
    ),
    choices: [
      { label: '“I don\'t think they can, no.”', dd: -4, nd: -2, time: 45, do: (G) => { G.collect(1); G.flag('ally31c'); G.note('He nodded, and did not look reassured, and you were not sure you had been reassuring. But it was two of you now.'); }, next: 'cabin3' },
      { label: '“I honestly don\'t know.”', dd: -1, time: 45, do: (G) => { G.flag('ally31c'); G.note('He nodded. ' + V('“No. Me neither.”') + ' You looked at the seatback map together. The little plane was over the edge of it.'); }, next: 'cabin3' },
      { label: 'Put your headphones in.', kind: 'comply', dd: 5, nd: -2, time: 45, do: (G) => { G.nerves(2); G.note('You put your headphones in. Nothing was playing. You left them in. When you looked up, the purser was at your row, not looking at you, and then he was past.'); }, next: 'cabin3' },
      { label: 'Press the call button and ask again.', kind: 'conflict', nd: 5, dd: 2, time: 45, do: (G) => { G.nerves(4); G.flag('asked_crew'); G.note('The button lit. Nobody came. After a while it went out on its own, and the purser, three rows on, turned and looked at the panel above your head, and then at you.'); }, next: 'cabin3' },
    ],
  };

  scenes.cabin3 = {
    art: 'cabin',
    loc: 'Final approach · Keflavík',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      'The purser again, on the handset. ' + V('“On landing, please remain seated with your seatbelt fastened until the medical team has attended to our customer in the forward cabin. I will let you know when you may stand. I will let you know.”'),
      'Rain on the windows. Below, a coastline like something scraped. The lights of a town that is not Reykjavík, and then no lights.',
      'You have never landed anywhere at night where you could not see the runway until it was under you.',
    ),
    choices: [
      { label: 'Look out of the window.', whyNot: 'Blind down, he said.', dd: 5, nd: 3, dreadMax: 90, time: 25, do: (G) => { G.nerves(3); G.note('Blue lights, then orange, then blue. An ambulance with its doors open on wet tarmac, and beside it, not near it, a man in a navy uniform, standing very straight. A voice from the aisle, close to your ear: ' + V('“Blind down, please.”')); }, next: 'ground' },
      { label: 'Keep your eyes on the seatback map.', kind: 'comply', dd: 4, time: 25, do: (G) => G.note('The little plane crossed the edge of the map and, for a while, was not on any map at all. Then the screen went black and showed you your own face.'), next: 'ground' },
      { label: 'Count the rows to the nearest exit. Twice.', nd: -2, time: 25, do: (G) => { G.nerves(-2); G.note('Six rows. Six rows. It is the kind of information that is only useful if something happens, and you have started to want something to happen.'); }, next: 'ground' },
    ],
  };

  scenes.ground = {
    art: 'cabin',
    loc: 'Keflavík · on the ground · engines off',
    enter: (G) => G.dread(3),
    text: (G) => p(
      G.last(),
      'Thirty minutes on the ground. The medical team has come and gone, or has not come. Nobody has said. The seatbelt sign stays on. The purser stands at the front of the cabin with his hands folded, looking down the aisle at all of you, patiently, as if you were a queue.',
      'The man in 31C, quietly: ' + V('“I don\'t think we\'re going to LA.”'),
    ),
    choices: [
      { label: 'Stand up. Just to stretch.', whyNot: 'He said sit.', kind: 'conflict', nd: 6, dd: -3, dreadMax: 75, time: 15, do: (G) => { G.nerves(4); G.flag('stood'); G.dread(4); G.note(V('“Sit down, please.”') + ' Not loud. He did not need to be loud. Two hundred people watched you sit down.'); }, next: 'landing' },
      { label: 'Stay seated. Watch the purser watch you.', kind: 'comply', dd: 5, time: 15, do: (G) => G.note('He looked at each row in turn, and when he reached yours he did not stop, and he did not not stop.'), next: 'landing' },
      { label: 'Ask 31C what he thinks happens now.', nd: -2, time: 15, do: (G) => { G.collect(G.has('ally31c') ? 0 : 1); G.flag('ally31c'); G.note(V('“Hotel, I guess. Or they leave us here.”') + ' He laughed, and then thought about it, and stopped.'); }, next: 'landing' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 01:10 deplaning */
  scenes.landing = {
    art: 'terminal',
    loc: 'Keflavík International · Arrivals',
    enter: (G) => {
      atLeast(G, 30);
      if (G.once('landing_msgs')) {
        G.msg('email', {
          from: 'Albion Atlantic Customer Care', subj: 'Your overnight accommodation',
          body: `Dear Customer,\n\nDue to an operational diversion, your flight AB 0271 has been delayed overnight. We have arranged accommodation for you.\n\nPlease use the link below to confirm your room:\n\n<a href="#" onclick="return false">Heathrow Renaissance Lodge — Bath Road, Hounslow TW6</a>\n\nTransport to your accommodation will be provided.\n\nWe apologise for any inconvenience. We are doing our best.`,
          actions: [{ label: 'Open the booking page', if: (G) => !G.has('at_hotel') && !G.has('booked'), next: 'heathrow' }],
        });
        G.bot('Hi! I\'m Ally, your Albion Atlantic virtual assistant. I see your flight AB 0271 is on time. How can I help? ✈️');
      }
    },
    text: (G) => p(
      G.last(),
      'The seatbelt sign goes off without an announcement. That is the announcement. The terminal is lit like the inside of a fridge. A few hundred of you shuffle off the aircraft into it, past a man in a fluorescent vest who is not looking at anyone.',
      G.has('objected') && W('On the way out the purser looked at you for slightly too long.'),
      'Passport control. A long queue. Then the crew walk past it — all of them, in a line, wheelie cases in perfect step, not looking left or right — through a door marked STAFF. The door does not close behind them so much as stop being a door.',
      'The queue watches this happen. Nobody says anything. Your phone buzzes.',
    ),
    choices: [
      { label: 'Read the email. Follow the link.', kind: 'comply', dd: 8, sub: 'Accommodation. Finally.', next: 'heathrow' },
      { label: 'Text the chatbot with increasing urgency.', kind: 'comply', dd: 4, nd: 4, time: 10, do: (G) => { G.nerves(4); G.bot('I can help with that! Your flight AB 0271 is currently on time. Is there anything else? 😊'); G.note('Ally says the flight is on time. You are looking at the aircraft through the window. It has its lights off.'); }, next: 'hall' },
      { label: 'Find a human. Any human.', whyNot: 'Everyone here is in a uniform.', dd: -4, dreadMax: 85, time: 10, next: 'icelander' },
      { label: 'Wait. Someone will make an announcement.', kind: 'comply', dd: 8, sub: 'Someone always does.', time: 20, next: 'wait1' },
    ],
  };

  scenes.heathrow = {
    art: 'terminal',
    loc: 'Booking page · Heathrow Renaissance Lodge',
    text: p(
      'The page loads slowly and then all at once. A photo of a bed. A photo of a breakfast. <em>Bath Road, Hounslow, TW6.</em> Twelve minutes from Terminal 5 by courtesy shuttle.',
      'You are 1,900 kilometres from Terminal 5.',
      'There is a large button. It says CONFIRM. Below it, in smaller letters: <em>Transport to your accommodation will be provided.</em>',
    ),
    choices: [
      { label: 'Confirm.', kind: 'comply', dd: 10, sub: 'They said transport would be provided.', time: 5, do: (G) => { G.flag('booked'); G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Booking confirmed — your car is waiting', body: 'Your accommodation is confirmed.\n\nA driver is waiting for you outside Arrivals. Please look for the Albion Atlantic crest.\n\nEstimated journey time: —:—' }); }, next: 'car' },
      { label: 'Close it. You are in Iceland.', whyNot: 'It has the logo on it.', dd: -3, dreadMax: 90, time: 5, do: (G) => { G.nerves(2); G.note('You closed the booking page. The email is still there, with its logo, being patient.'); }, next: 'hall' },
    ],
  };

  scenes.car = {
    art: 'stand',
    loc: 'Keflavík · Outside Arrivals',
    text: p(
      'There is, in fact, a car. Black, long, immaculate, a small gold crest on the door. The driver holds a tablet with your name on it — your name, spelled right, which the airline has not managed once so far.',
      V('“For the Renaissance?”'),
      'He opens the rear door. Warm air. Leather. Beyond the car park the road runs off into a darkness that does not appear to have an end.',
    ),
    choices: [
      { label: 'Get in.', kind: 'comply', sub: 'Warm.', do: (G) => G.end('accommodated') },
      { label: 'No. No, thank you.', whyNot: 'He has your name.', dd: 5, dreadMax: 85, time: 5, do: (G) => { G.nerves(5); G.dread(8); G.note('The driver did not seem surprised. He closed the door, and stayed where he was, and was still there when you looked back from the doors.'); }, next: 'hall' },
    ],
  };

  scenes.icelander = {
    art: 'terminal',
    loc: 'Keflavík · Arrivals',
    text: (G) => p(
      'A woman in a uniform that is not the airline\'s — airport, maybe, or customs, or just a person who owns a fleece with a badge on it — is standing near the doors with her hands behind her back.',
      'She listens to you. She looks at your phone. She looks at the email with the logo on it.',
      V(LX('“Don\'t follow the emails,”')) + ' she says, kindly, in the voice of someone who has said it forty times tonight. ' + V(LX('“There are buses.”')),
      'You ask where. She points, in a general way, at Iceland.',
    ),
    choices: [
      { label: 'Ask her whether she speaks French.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 5, do: (G) => { G.flag('fr_asked'); G.flag('hint_icelander'); G.nerves(-4); G.dread(-4); G.note(LX('“A little. Not the emails. There are buses.”') + ' She said it in your language, carefully, like someone carrying something full.'); }, next: 'hall' },
      { label: 'Thank her. Go and find the buses.', do: (G) => { G.flag('hint_icelander'); G.nerves(-4); G.note('“There are buses,” she said. It is the most solid sentence anyone has said to you since Greenland.'); }, next: 'hall' },
    ],
  };

  scenes.wait1 = {
    art: 'terminal',
    loc: 'Keflavík · Arrivals',
    text: (G) => p(
      'Twenty minutes. The queue at passport control clears. Nobody makes an announcement.',
      'The people you flew with are drifting, in twos and threes, toward the far end of the hall, where there is a door that says nothing at all.',
      G.t >= T(1, 2, 0) && W('The lights at the near end of the hall have gone to half.'),
    ),
    choices: [
      { label: 'Wait longer. There will be an announcement.', kind: 'comply', dd: 6, sub: 'There is a public address system. You can see the speakers.', time: 25, next: (G) => (G.t >= T(1, 2, 20) ? 'wait2' : 'wait1'), do: (G) => { G.nerves(8); G.dread(8); } },
      { label: 'Follow the drift.', whyNot: 'Nobody told you to.', dreadMax: 90, time: 5, next: 'hall' },
    ],
  };

  scenes.wait2 = {
    art: 'terminal',
    loc: 'Keflavík · Arrivals',
    text: p(
      'The hall is empty now except for you, a cleaner, and the sound the ceiling makes.',
      'Your phone buzzes. An email. <em>We have organised coaches for you.</em> It does not say where. It does not say when. It is timestamped an hour ago.',
      'Behind you, the lights go to a quarter.',
    ),
    enter: (G) => { atLeast(G, 45); if (G.once('coach_mail_w')) G.msg('email', { from: 'Albion Atlantic Customer Care', subj: 'Onward transport arranged', stamp: G.t - 60, body: 'Dear Customer,\n\nWe have organised coaches to transfer you to your accommodation.\n\nPlease proceed to the coaches.\n\nWe are doing our best.' }); },
    choices: [
      { label: 'Proceed to the coaches.', kind: 'comply', time: 15, do: (G) => G.end('terminal') },
      { label: 'Run for the door that says nothing.', whyNot: 'You cannot run.', nd: 5, dreadMax: 92, time: 5, do: (G) => { G.nerves(10); G.note('You ran. Nobody stopped you. The door that said nothing opened onto cold air and sodium light and, thank God, other people.'); }, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 01:20 the hall (hub) */
  scenes.hall = {
    art: 'terminal',
    loc: 'Keflavík · Baggage hall',
    enter: (G) => {
      if (G.t >= T(1, 2, 40)) { G.go('wait2'); return; }
      if (G.once('hall_intro')) G.note(p(G.last(), p(
        'They will not release the checked bags. A man behind a counter explains this without looking up: the bags are <em>in the system</em>. You are also, presumably, in the system. It has not helped either of you.',
        'A man in a fleece wanders over. ' + V('“Hey. I guess there are going to be buses? Over there? Supposedly?”') + ' He points. Nobody announced this. There was no email, no text, no intercom. Just a man in a fleece.',
      )));
    },
    text: (G) => hub(G,
      `${G.clock(G.t)}. Arrivals hall. Everything is closed. You have no bag, no coat, no toothbrush, and a phone at ${G.battery()}%.`,
      'hall',
      G.t >= T(1, 2, 10) ? W('The hall is emptying. You should probably not be the last one in it.') : ''),
    choices: [
      { label: 'Ask about your bag. Nicely.', whyNot: 'Nothing about you is nice right now.', kind: 'comply', dd: 2, nerveMax: 70, time: 8, once: 'bag_nice', do: (G) => { G.nerves(2); G.note('The man behind the counter says the bags are in the system. You ask what system. He says: the system. You ask when. He says: when it is resolved. He has not looked up once.'); }, next: 'hall' },
      { label: 'Demand your bag. It has your toothpaste in it.', kind: 'conflict', nd: 8, sub: 'Someone has to.', time: 10, once: 'bag', do: (G) => { G.strike(); G.note('He looks up. That is the only thing that changes. ' + V('“I\'ll make a note.”') + ' He makes a note.'); }, next: 'hall' },
      { label: 'Walk the closed shops.', dd: 3, time: 12, once: 'shops', do: (G) => { G.nerves(-1); G.dread(2); G.note('Duty free: shutters. A café: chairs on tables, the coffee machine unplugged and turned to face the wall. A vending machine that takes only Icelandic cards, full of things with the letter ð in them. You stand in front of it for longer than you meant to.'); }, next: 'hall' },
      { label: 'Try the STAFF door.', whyNot: 'It says ONLY.', dreadMax: 80, time: 6, once: 'staff', do: (G) => { G.dread(8); G.nerves(5); G.note('Locked. The handle is warm, as if someone had been holding it a moment ago. You put your ear to it. There is nothing behind it. Not silence — nothing. When you step back, the sign says STAFF, and under it, smaller, you had not noticed: ONLY.'); }, next: 'hall' },
      { label: 'Watch the baggage carousel.', dd: 3, time: 8, once: 'carousel', do: (G) => { G.dread(4); G.note('It is running. One bag goes round. It is not yours. It has a navy tag with a gold crest. It goes round again, and then the carousel stops, and the bag is gone, and the belt is empty in a way that suggests it was always empty.'); }, next: 'hall' },
      { label: 'Talk to the man in the fleece.', whyNot: 'You would snap at him.', nd: -3, dd: -3, nerveMax: 90, time: 8, once: 'talk_fleece', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_hearsay'); G.note(V('“Somebody said buses. Somebody in a vest. Not one of theirs.”') + ' He looks at the email on your phone. ' + V('“Yeah, I got that one too. I\'m not going to Heathrow, man.”')); }, next: 'hall' },
      { label: 'Talk to the woman with the toddler.', whyNot: 'You would frighten the child.', nd: -2, dd: -3, nerveMax: 80, time: 8, once: 'talk_mother', do: (G) => { G.collect(1); G.nerves(-2); G.flag('hint_hearsay'); G.msg('sms', { from: '+354 ··· ····', body: 'dont get on the nice one' }); G.note('The toddler is asleep on her shoulder in a way that suggests the shoulder is load-bearing. ' + V('“A man in hi-vis told me: not the nice one. I don\'t know what it means. I\'m going with it.”') + ' As she says it, your phone buzzes with a text from a number you don\'t know.'); }, next: 'hall' },
      { label: 'Find the man from 31C.', whyNot: 'You would say something you cannot take back.', nd: -3, dd: -3, nerveMax: 95, time: 8, once: 'talk_31c', if: (G) => G.has('ally31c'), do: (G) => { G.collect(1); G.nerves(-3); G.note('He is by the doors, looking out at the dark. ' + V('“So there\'s buses,”') + ' he says. ' + V('“Great. Whose?”') + ' Neither of you knows. You decide, without saying so, to get on the same one.'); }, next: 'hall' },
      { label: 'Talk to the older couple by the window.', whyNot: 'You would start an argument.', nd: -2, dd: -2, nerveMax: 75, time: 8, once: 'talk_couple', do: (G) => { G.collect(1); G.nerves(-2); G.note('They have flown a great deal and are not worried, they say, in the voices of people who are worried. ' + V('“It\'ll be a printout,”') + ' he says. ' + V('“It always ends up being a printout.”')); }, next: 'hall' },
      { label: 'Go to the bathroom. You have been holding it since Greenland.', nd: -3, time: 12, once: 'loo', do: (G) => { G.flag('bathroom'); G.nerves(-2); G.note('Relief, of a kind. When you come out, the hall has rearranged itself: the same people, in different places, all facing the same door.'); }, next: 'hall' },
      { label: 'Go where the fleece pointed.', dd: -2, time: 5, next: 'buses1' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~02:00 bus stand 1 */
  scenes.buses1 = {
    art: 'stand',
    loc: 'Keflavík · Coach stand · outside',
    text: (G) => p(
      'Outside it is two degrees, and the wind has come a long way to meet you. Three coaches idle under the sodium lights. Your fellow passengers are moving toward them in the loose, uncertain way of people who have not been told anything.',
      G.has('bathroom') ? 'You are late. Most of the crowd has already boarded something. Doors are starting to close.' : 'Nobody is checking tickets. Nobody is checking anything.',
      G.has('hint_hearsay') && W('“Not the nice one.”'),
      W('Look before you board. Looking costs a few minutes. Boarding costs more.'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: G.pick(['#c7c3b6', '#b8b4a6', '#8d8a80']), windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'night' },
        name: G.pick(['A white coach with no livery at all', 'An off-white coach with a cracked wing mirror', 'A grey coach with a rental sticker peeling off the door']),
        sign: G.pick(['ALBION ATL → HOTEL', 'AB0271  HOTEL', 'FLIGHT PPL – HOTEL']), signStyle: 'paper',
        look: ['Driver in a hi-vis vest, eating a sandwich. He shrugs when you look at him.', G.has('bathroom') ? 'Engine running. The door is starting to close.' : 'Engine running. Door open.'],
        hidden: ['The man in the fleece is in the third row. A toddler is asleep on someone.', 'Everyone on board is wearing what they wore on the plane, and looks like it.'],
        boardLabel: G.has('bathroom') ? 'Run for it' : 'Board',
        board: { time: 5, do: (G) => { if (G.has('bathroom')) G.nerves(6); G.flag('bus1_ok'); }, next: 'ride' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'night' },
        name: 'A navy coach with a gold crest on the flank',
        sign: 'ALBION ATLANTIC WELCOMES YOU', signStyle: 'led',
        look: ['Driver in a purser\'s uniform. He is smiling at you specifically.', 'Interior lights bright and warm. Plenty of seats.'],
        hidden: ['The passengers are rested. Pressed shirts. Somebody has a fresh haircut.', 'You don\'t recognise a single face. You flew with these people for nine hours.', 'His name badge is blank.'],
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const flybus = {
        key: 'city',
        art: { livery: '#cfae36', windows: 'dim', passengers: 'luggage', sign: 'print', driver: 'plain', ground: 'night' },
        name: 'A yellow bus in city livery',
        sign: 'FLYBUS · REYKJAVÍK BSÍ', signStyle: 'print',
        look: ['Driver, bored, checking a tablet.', 'Passengers with rucksacks and wheeled bags.'],
        hidden: ['They have luggage. You do not have luggage.', 'A sticker by the door: TICKET REQUIRED.'],
        board: { time: 5, next: 'detour' },
      };
      return G.shuffle([correct, crest, flybus]);
    },
    choices: [
      { label: 'Don\'t board anything. The email said coaches. Wait for instructions.', kind: 'comply', dd: 10, sub: 'They said coaches. These may not be the coaches.', time: 35, next: 'wait2' },
    ],
  };

  scenes.detour = {
    art: 'road',
    loc: 'Route 41 · toward Reykjavík',
    text: p(
      'Forty minutes into the ride, a backpacker asks which hostel you\'re at, and you understand.',
      'The bus lets you off at a terminal in the city that smells of diesel and cinnamon. A taxi driver takes pity, and 9,800 krónur, and drives you back out into the dark to a hotel that has been told to expect you and is not sure it believes it.',
      'It is 03:35. You have the clothes you are wearing. Not even the good ones.',
    ),
    enter: (G) => { G.S.t = T(1, 3, 35); G.nerves(18); G.flag('detoured'); G.dread(8); },
    choices: [{ label: 'Go in.', next: 'hotel_arrive' }],
  };

  /* ---------------------------------------------------------------- the ride */
  scenes.ride = {
    art: 'road',
    loc: 'A road · somewhere on the Reykjanes peninsula',
    enter: (G) => {
      G.dread(4);
      if (G.once('coach_mail')) G.at(G.t + 30, 'email', { from: 'Albion Atlantic Customer Care', subj: 'Onward transport arranged', body: 'Dear Customer,\n\nWe have organised coaches to transfer you to your accommodation. Please proceed to the coaches.\n\nIf you require assistance locating the coaches, please contact us.\n\nWe are doing our best.' });
      if (G.once('coach_txt')) G.at(G.t + 45, 'sms', { from: 'AlbionATL', body: 'AB0271: Your hotel is HEATHROW RENAISSANCE LODGE. Do not reply.' });
    },
    text: (G) => p(
      'The coach goes out past the last lights, and then it keeps going.',
      'Lava fields under a low sky. No towns. No signs you can read. You do not know who has taken you or where you are going. You have either been taken tenderly into the embrace of the EU regulatory framework, or you have been kidnapped, along with a busload of exhausted people who are too polite to ask.',
      G.has('coffee') && W('Your heart is doing something. It is the coffee. It is definitely the coffee.'),
      'It is a long ride. It is starting to be a worrying length of ride.',
      'From the back, a two-year-old sighs, ' + V('“What a day.”'),
    ),
    choices: [
      { label: 'Laugh. Everyone does. Politely, and slightly panicked.', whyNot: 'It would come out wrong.', nd: -6, dd: -4, nerveMax: 85, time: 50, do: (G) => { G.nerves(-5); G.collect(1); }, next: 'hotel_arrive' },
      { label: 'Stay silent. Watch the dark.', kind: 'comply', dd: 4, time: 50, do: (G) => G.nerves(3), next: 'hotel_arrive' },
      { label: 'Go up front. Ask the driver where this bus is going.', kind: 'conflict', nd: 5, dd: 3, time: 50, do: (G) => { G.nerves(6); G.flag('asked_driver'); }, next: 'hotel_arrive' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · ~03:00 the hotel */
  scenes.hotel_arrive = {
    art: 'lobby',
    loc: 'Hótel Hraun · Reception',
    enter: (G) => {
      G.flag('at_hotel'); atLeast(G, 38);
      if (G.once('hotel_paper')) G.msg('paper', { from: 'Taped to the reception desk', subj: 'Printed sign', body: '<b>PASSENGERS ALBION ATLANTIC AB0271</b>\n\nBUS TO AIRPORT: <b>11:00</b>\n\nPlease wait in lobby.\n\n(No delivery service until 11:00 am)' });
      if (G.once('hotel_bot')) { G.at(T(1, 3, 50), 'chat', { body: 'Are you comfortable in your room? 🙂' }); G.at(T(1, 4, 15), 'chat', { body: 'Your coach departs at 04:30. A member of staff will knock.' }); }
    },
    text: (G) => p(
      G.has('asked_driver') && W('The driver never did answer. The radio played something in Icelandic that may have been the weather.'),
      'A hotel, then. Low, wide, the kind of place built for conferences that never came. The night clerk hands out key cards from a shoebox. Yours says 214.',
      'No, they do not have toothpaste. No, they do not have toothbrushes. Nothing delivers to here until eleven tomorrow morning. There is a vending machine. The clerk says this with the air of a woman handing you a life raft.',
      'Taped to the desk is a sheet of A4, in Arial, slightly water-stained. It says the bus to the airport is at 11:00. It is the first piece of information all night that has come with a time attached and no logo.',
    ),
    choices: [{ label: 'Go up to the room.', time: 8, next: 'room' }],
  };

  /* ---- the room (hub) ---- */
  const roomStatus = (G) => `Room 214. ${G.clock(G.t)}. You are too tired to sleep${G.has('toothpaste') ? '' : ', and your teeth are dirty'}${G.has('dinner') ? '' : ', and you have not eaten'}.`;

  scenes.room = {
    art: 'room',
    loc: 'Hótel Hraun · Room 214',
    enter: (G) => {
      G.flag('loc_room');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('room_intro')) G.note(p(G.last(), 'A bed, a kettle, a television, a window onto the car park, and tiny bottles of shampoo and conditioner you are already thinking about brushing your teeth with. The door has a chain. You put the chain on. Then you take it off, in case, and put it on again.'));
    },
    text: (G) => hub(G, roomStatus(G), 'room'),
    choices: (G) => [
      { label: 'Eat. Crisps and two miniature wines.', whyNot: 'Your stomach says no.', nerveMax: 90, sub: 'Girl dinner.', if: (G) => G.has('crisps') && !G.has('dinner'), time: 12, do: (G) => { G.flag('dinner'); G.nerves(-10); G.note('Salt, then wine, then salt. You eat sitting on the edge of the bed with the packet held in both hands like something that might get away. It is the best meal you have had in twenty hours, which is also the only meal.'); }, next: 'room' },
      { label: 'Stare at the tiny shampoos and consider brushing your teeth with them.', time: 4, do: (G) => { const n = G.count('shampoo'); G.nerves(n === 1 ? -1 : 1); G.note(n === 1 ? 'Shampoo. Conditioner. Body lotion. You read the ingredients. Sodium laureth sulfate is, technically, a surfactant. You put it down. You pick it up. You put it down.' : n === 2 ? 'You have been here before. The shampoo has not changed its mind and neither have you.' : 'The little bottles are lined up on the shelf, watching you. One of them has moved. You moved it. Probably you moved it.'); }, next: 'room' },
      { label: 'Shower. Put the same clothes back on.', whyNot: 'You could not stand still under it.', nerveMax: 95, time: 20, once: 'shower', do: (G) => { G.nerves(-6); G.note('Hot water, at least. Iceland has excellent hot water; it smells faintly of eggs and does not run out. You stand in it until you feel like a person, and then you put the plane back on: the trousers, the shirt, the socks, all of it slightly warmer than you.'); }, next: 'room' },
      { label: 'Turn on the television.', kind: 'comply', dd: 2, time: 6, do: (G) => { const d = G.D, n = G.count('tv'); G.dread(1); G.note(d >= 5 ? 'Channel 1: the car park. Your car park, from above, in grey. The coach in it. A figure beside the coach. You turn it off. The screen shows you the room, from above, in grey.' : d >= 4 ? 'The weather, in Icelandic, forever. Then a channel that is a fixed camera on a car park. You are fairly sure it is not this car park. There is a coach in it.' : n === 1 ? 'The weather, in Icelandic. A map of the island covered in small angry arrows. Then a still picture of the hotel with a phone number. Then the weather.' : 'You have seen this weather. It has not changed. The arrows are still angry. The hotel is still on the screen with its phone number, as if you might want to call it from inside it.'); }, next: 'room' },
      { label: 'Look out of the window, at the car park.', whyNot: 'You know what is out there.', dd: 2, dreadMax: 85, time: 3, do: (G) => { const d = G.D, n = G.count('win'); G.dread(2); if (d >= 4) G.flag('looked1'); G.nerves(d >= 4 ? 7 : 2); G.note(d >= 5 ? 'The coach is right below you now. Interior lights on. Everyone inside facing the hotel, upright, still. And by the door, hands folded, a man in navy, looking up. Not at the hotel. At your window. You let the curtain go. You do not remember pulling it.' : d >= 4 ? 'A coach is parked at the far end of the car park with its engine running and every interior light on. It is full. Nobody inside is moving. You cannot see anyone by the door, and then you can.' : n === 1 ? 'A car park. A single lamp. Gravel, wind, and beyond the lamp the dark going on for a very long way. No coach. You are relieved, and then you wonder why you were expecting one.' : 'The car park. The lamp. A pair of headlights on the road, slowing, not turning in. Your own face over all of it, pale, in yesterday\'s shirt.'); }, next: 'room' },
      { label: 'Make tea with the little sachets.', whyNot: 'Your hands would spill it.', nerveMax: 90, time: 8, once: 'tea', do: (G) => { G.nerves(-5); G.note('The kettle takes a long time and makes a sound like a small aircraft. Tea, with UHT milk from a thimble. You hold the cup with both hands. It is the first warm thing that has not been a lie.'); }, next: 'room' },
      { label: 'Check the door.', nd: 2, time: 2, do: (G) => { const n = G.count('door'); G.note(n === 1 ? 'Locked. Chain on. You check the chain. You check the lock. Fine.' : n === 2 ? 'Still locked. Still chained. You knew that.' : n === 3 ? 'You check the door again. You are aware of checking the door again. It is locked. It has always been locked. You stand with your hand on it for a while.' : 'Locked. You do not know what you are checking for any more. Whether it is locked, or whether it is still a door.'); if (n >= 3) G.dread(1); }, next: 'room' },
      { label: 'Listen at the door.', whyNot: 'You do not want to know.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(3); G.note(G.pick(d >= 4 ? ['Footsteps. Slow, even, stopping at each door. Stopping at yours. Going on.', 'A trolley, wheeled, at the far end. It stops. It does not start again.', 'Knocking, a long way down the corridor. Patient. Then nearer.'] : ['Nothing. The corridor hum. A door, far off, closing.', 'Somebody walks past, quickly, in socks. Somebody else, slowly, in shoes.', 'The ice machine, grinding, from the end of the corridor. Then a laugh, one door down, cut short.'])); }, next: 'room' },
      { label: 'Call reception from the room phone.', kind: 'comply', dd: 1, time: 5, once: 'roomphone', do: (G) => { G.dread(2); G.note('It rings for a long time. Then the clerk, sounding as if she has been asleep or has never been asleep: ' + V(LX('“Yes, 214?”')) + ' You had not said your room number. You ask about the bus. ' + V(LX('“Eleven. It says eleven. Maybe you should sleep.”'))); }, next: 'room' },
      { label: 'Look up your rights.', whyNot: 'Rights feel like a foreign country.', dd: -6, dreadMax: 85, sub: 'There is a regulation. Somebody in your mentions is sure of it.', time: 15, once: 'rights', do: (G) => { G.flag('uk261'); G.nerves(-6); G.msg('paper', { from: 'Screenshot, then a QR code you made yourself', subj: 'UK261', body: '<b>UK261 / EC261 — YOUR RIGHTS</b>\n\nOn a delay of this length the airline must provide: meals, hotel, transport, and communications.\n\nThey will fight. Claim anyway.\n\n[ QR CODE ]' }); G.note('UK261. <em>The airline must provide.</em> You read it twice. You make it into a QR code, on the hotel wifi, at three in the morning, and you do not know why, except that you are going to show it to everyone you see at breakfast.'); }, next: 'room' },
      { label: 'Post about it.', time: 8, once: 'post', do: (G) => { if (G.D >= 4) { G.nerves(4); G.note('You type it all out — the crew, the door, the email, the bus — and press post, and the little wheel turns, and turns. One bar. No bars. The post sits there, unsent, addressed to nobody.'); } else { G.nerves(-3); G.note('You post it. Lol, you write. Lmao. Within ten minutes: 1.4K likes, and forty people telling you about the hot springs. You put the phone face down on the duvet.'); } }, next: 'room' },
      { label: 'Charge the phone.', nd: 2, time: 2, once: 'charge', do: (G) => { G.nerves(3); G.note(`The charger is in the bag. The bag is in the system. The phone is at ${G.battery()}%, and it knows it, and it dims the screen to tell you.`); }, next: 'room' },
      { label: 'Try to sleep.', whyNot: 'You cannot lie still.', nerveMax: 80, time: 25, do: (G) => { if (G.t + 25 >= T(1, 4, 5)) { G.S.t = Math.max(G.t, KNOCK_AT - 25); G.note('You lie down in the plane clothes with the light on. The ceiling is very close. You are almost, almost—'); } else { G.nerves(-3); G.note(G.pick(['You lie down. Your body is on Pacific time, or on no time. The ceiling has a stain shaped like an island. You watch it for a while. Nothing.', 'Eyes closed. The engine of the coach — of a coach — somewhere below the window, or in your ears. You sit back up.', 'You get under the duvet in your clothes. It is like being a parcel. Sleep looks at you from across the room and does not come over.'])); } }, next: 'room' },
      { label: 'Go out into the corridor.', time: 2, next: 'corridor' },
    ],
  };

  /* ---- the corridor (hub) ---- */
  scenes.corridor = {
    art: 'corridor',
    loc: 'Hótel Hraun · Second floor corridor',
    enter: (G) => {
      G.flag('loc_corridor');
      if (G.t >= KNOCK_AT && !G.has('knocked')) { G.go('corridor_knock'); return; }
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('corr_intro')) G.note(p(G.last(), 'Long, low, carpeted in something the colour of a bruise. Doors: 210, 212, 214 — yours — 216, 218, on down to a fire door with a bar across it and a window of wired glass. An ice machine hums at the far end. A lift, with a paper sign on it.'));
    },
    text: (G) => hub(G, `The corridor. ${G.clock(G.t)}. Every door is closed. Yours is the one with the light on.`, 'corridor'),
    choices: (G) => [
      { label: 'The ice machine.', nd: 2, dd: 1, time: 5, do: (G) => { const n = G.count('ice'); G.note(n === 1 ? 'It roars. Ice, a great deal of ice, into a bucket you did not bring. You stand holding a fistful of it. You did not want ice. You do not know what you wanted.' : n === 2 ? 'It roars again, for you, as if it had been waiting. The ice from before has not melted. You are not sure ice should behave like that in a heated corridor.' : 'You do not put your hand in this time. You listen to it grinding. Underneath the grinding, from somewhere below, an engine.'); if (n >= 2) G.dread(1); }, next: 'corridor' },
      { label: 'Knock on 216. The fleece man\'s room.', time: 5, do: (G) => { const n = G.count('k216'); if (n === 1) { G.collect(1); G.nerves(-4); G.note('A pause, then the chain, then the fleece. He is also awake. He is also in his clothes. ' + V('“Man,”') + ' he says, and it covers everything. You agree about the bus. Eleven. The printout. He says he\'ll knock for you.'); } else if (n === 2) { G.nerves(3); G.dread(3); G.note('No answer. The light under the door is on. You knock again, evenly, and hear yourself doing it, and stop.'); } else { G.nerves(8); G.dread(5); G.note('The door is not locked. It swings. The room is made up: bed tight, towels folded into a fan, the tiny shampoos in a row. Nobody has been in it. Nobody has ever been in it. His fleece is on the chair.'); } }, next: 'corridor' },
      { label: 'The lift.', kind: 'comply', dd: 2, time: 4, do: (G) => { const d = G.D; if (d >= 4) { G.flag('lift_open'); G.dread(3); G.nerves(5); G.note('The paper sign says OUT OF ORDER, in Arial. As you read it, the lift arrives. The doors open onto an empty, well-lit box with a mirror at the back, and stay open, and wait. Nobody called it.'); } else { G.note('OUT OF ORDER, in Arial, taped at an angle. You press the button anyway. Somewhere in the building, something goes down.'); } }, next: 'corridor' },
      { label: 'Get in the lift.', kind: 'comply', if: (G) => G.has('lift_open'), do: (G) => G.end('lift') },
      { label: 'Read the fire evacuation plan on the wall.', dd: -2, time: 3, once: 'fireplan', do: (G) => { G.msg('paper', { from: 'Screwed to the corridor wall', subj: 'Fire plan', body: '<b>EVACUATION PLAN · 2ND FLOOR</b>\n\nIn case of alarm, proceed by stairs to\n<b>ASSEMBLY POINT: CAR PARK</b>\n\nDo not use the lift.\nDo not return for belongings.\n\nYOU ARE HERE ●' }); G.note('YOU ARE HERE. A red dot, at 214. Somebody has drawn a small arrow from it toward the car park in biro, and written, in a different hand, <em>bus</em>.'); }, next: 'corridor' },
      { label: 'The fire door and the stairs. Down to the car park.', whyNot: 'Not the stairs. Not in the dark.', dreadMax: 92, time: 4, next: 'carpark' },
      { label: 'Down to the lobby.', time: 3, next: 'lobby' },
      { label: 'Back into your room.', time: 2, next: 'room' },
    ],
  };

  /* ---- the lobby at night (hub) ---- */
  scenes.lobby = {
    art: 'lobby',
    loc: 'Hótel Hraun · Lobby',
    enter: (G) => {
      G.flag('loc_lobby');
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('lobby_intro')) G.note(p(G.last(), 'The lobby at night is a fish tank with the light left on. Two of your flight are asleep upright on a sofa. The night clerk is at the desk with a crossword. The printed sign, in Arial, says 11:00. A vending machine hums against the wall like a small refrigerated god.'));
    },
    text: (G) => hub(G, `The lobby. ${G.clock(G.t)}. The sign still says 11:00. ${G.t >= KNOCK_AT ? 'It is after half past four.' : 'It is not yet eleven by a long way.'}`, 'lobby'),
    choices: (G) => [
      { label: 'Ask the clerk whether she speaks French.', if: (G) => G.S.lang === 'fr' && !G.has('fr_asked'), time: 4, do: (G) => { G.flag('fr_asked'); G.nerves(-2); G.note(LX('“A little. Eleven. The sign. Please.”') + ' She said it slowly, and pointed at the sign anyway, in case the words did not hold.'); }, next: 'lobby' },
      { label: 'Ask the front desk for toothpaste.', time: 6, once: 'desk_tp', do: (G) => { G.nerves(2); G.note('She looks under the desk, sincerely, for a long time. ' + V(LX('“No. Sorry. The 10-11 has. Twenty minutes, walking.”')) + ' She looks at you, and at the doors, and at you. ' + V(LX('“Maybe not tonight.”'))); }, next: 'lobby' },
      { label: 'Ask if the sign is right.', kind: 'comply', dd: 1, time: 5, do: (G) => { const n = G.count('sign'); G.note(n === 1 ? 'She points at the sign. ' + V(LX('“Eleven.”')) + ' You ask who told her. ' + V(LX('“A passenger phoned them. They said yes.”')) + ' A pause. ' + V(LX('“Or they said something.”')) : n === 2 ? V(LX('“Eleven,”')) + ' she says, without looking up, before you have finished the question.' : 'She looks at you for a moment with an expression you cannot read, and then says, ' + V(LX('“You are in 214,”')) + ' and goes back to the crossword. You had not asked.'); if (n >= 3) G.dread(3); }, next: 'lobby' },
      { label: 'Ask whether a coach has come.', kind: 'comply', dd: 3, time: 5, do: (G) => { const d = G.D; G.dread(1); G.note(d >= 4 ? V(LX('“One is outside,”')) + ' she says. ' + V(LX('“It is not yours.”')) + ' You ask how she knows. She turns the crossword round so you can see it. It is blank.' : G.t >= KNOCK_AT ? V(LX('“Somebody came asking for you. In a uniform. I said you were asleep.”')) + ' You were not asleep. ' + V(LX('“I know.”')) : V(LX('“No coach. Eleven. Please, go up and sleep.”'))); }, next: 'lobby' },
      { label: 'The vending machine.', nd: -2, time: 5, do: (G) => { const n = G.count('vend'); if (n === 1) { G.flag('crisps'); G.nerves(-3); G.note('Crisps, paprika. Two miniature bottles of a red wine whose label is a picture of a mountain. The machine takes your card on the third try and makes a sound of deep reluctance. You hold your dinner in both hands.'); } else { G.note(n === 2 ? 'Sold out, mostly. One item left, at the bottom: a tub of skyr with a date on it you would rather not have read.' : 'The machine\'s light flickers. Every row is empty now except the skyr, which has moved up a shelf.'); if (n >= 3) G.dread(1); } }, next: 'lobby' },
      { label: 'The coffee machine.', time: 5, once: 'coffee_l', do: (G) => { G.nerves(G.has('coffee') ? 2 : -2); G.note('Coffee. What is the deal with this coffee. It tastes like it was described to the machine over the phone. You drink it standing up, looking at the doors.'); }, next: 'lobby' },
      { label: 'Wake the passengers on the sofa. Compare notes.', whyNot: 'You would wake them shouting.', nd: -4, dd: -4, nerveMax: 85, time: 8, once: 'sofa', do: (G) => { G.collect(1); G.nerves(-2); G.note('They are the couple from the window in the hall. They are not asleep. ' + V('“We got an email saying nine,”') + ' she says. ' + V('“And one saying eight. And the chat thing says something else.”') + ' You all look at the sign. ' + V(LX('“Eleven,”')) + ' he says. ' + V('“Printout.”')); }, next: 'lobby' },
      { label: 'Watch the car park through the glass.', whyNot: 'You do not want to see.', nd: 3, dreadMax: 90, time: 4, do: (G) => { const d = G.D; G.dread(2); G.nerves(d >= 4 ? 5 : 0); G.note(d >= 5 ? 'The coach is directly outside the doors now. Engine running. Interior lights on. The doors slide open for it, and stay open, and the cold comes in. Nobody gets off.' : d >= 4 ? 'At the far end of the car park, headlights, idling. A shape behind them that is the shape of a coach. The clerk does not look up. She has not looked up for some time.' : 'Gravel, one lamp, the road. A car goes past and does not slow. You are watching for something. You would like to stop.'); if (d >= 4) G.flag('looked1'); }, next: 'lobby' },
      { label: 'Go outside.', whyNot: 'The doors are the wrong way.', dd: -2, dreadMax: 88, time: 3, next: 'carpark' },
      { label: 'Back up to the corridor.', time: 3, next: 'corridor' },
    ],
  };

  /* ---- the car park at night (hub) ---- */
  scenes.carpark = {
    art: 'carpark_night',
    loc: 'Hótel Hraun · Car park',
    enter: (G) => {
      G.flag('loc_carpark'); G.dread(2);
      if (G.t >= T(1, 6, 0)) { G.flag('allnighter'); G.go('sleep'); return; }
      if (G.once('cp_intro')) G.note(p(G.last(), 'Cold. Properly cold: the kind that gets into your clothes and stays. Gravel, a lamp, a road going in two directions. The hotel behind you, lit. You have come outside for a reason you had a moment ago.'));
    },
    text: (G) => hub(G, `The car park. ${G.clock(G.t)}. The wind has come a long way to meet you.`, 'carpark'),
    choices: (G) => [
      { label: 'Walk to the far end. Toward the shape.', whyNot: 'Your feet will not.', nd: 5, dreadMax: 92, time: 6, do: (G) => { const d = G.D; G.dread(G.counted('cpwalk') ? 1 : 3); G.count('cpwalk'); if (d >= 4) { G.flag('coach_seen_cp'); G.nerves(G.counted('cpwalk') > 1 ? 3 : 6); G.note('A coach. Navy. Gold crest. Engine running, every interior light on, and behind every window a person, upright, facing the hotel. By the door a man in navy, hands folded. He does not look at you. ' + V('“Not yet,”') + ' he says, to nobody, or to you.'); } else { G.nerves(3); G.note('Nothing. A patch of gravel darker than the rest, in the shape of something that was parked there recently. The wind. You stand in the shape for a moment.'); } }, next: 'carpark' },
      { label: 'Board the coach.', kind: 'comply', if: (G) => G.has('coach_seen_cp'), do: (G) => G.end('nightcoach') },
      { label: 'Look up at your window.', time: 3, do: (G) => { G.dread(2); G.nerves(2); G.note(G.D >= 4 ? 'Second floor, fourth along. The light is on. You left it on. The curtain is open. You did not leave it open.' : 'Second floor, fourth along. The light is on. It looks like a room someone is in.'); }, next: 'carpark' },
      { label: 'Walk twenty minutes to the 10-11 for toothpaste.', whyNot: 'Not alone. Not out there.', dreadMax: 70, sub: 'Toothpaste. Socks, maybe. A change of scene.', time: 20, once: 'walk', next: 'walk' },
      { label: 'Go back in.', kind: 'comply', dd: 1, time: 3, next: 'lobby' },
    ],
  };

  scenes.walk = {
    art: 'road',
    loc: 'The road · toward the 10-11',
    text: p(
      'Wind. Lava. A road with no pavement and a white line that keeps disappearing. After eight minutes you cannot see the hotel behind you any more; after ten, you cannot see the 10-11 ahead.',
      'Then headlights, slow, from behind. A coach. It pulls level with you and stops, and the door folds open with a soft, expensive sound. Warm light. Rows of seats, and people in them, sitting very still.',
      V('“Albion passenger?”') + ' says a voice you know from a handset at 37,000 feet. ' + V('“We\'re doing our best. Hop on.”'),
    ),
    choices: [
      { label: 'Get on. It\'s warm.', kind: 'comply', do: (G) => G.end('convenience') },
      { label: 'Keep walking. Do not look at the door.', whyNot: 'You cannot turn your back on it.', dreadMax: 75, dd: -14, time: 30, do: (G) => { G.nerves(12); G.flag('toothpaste'); G.nerves(-10); G.dread(8); G.note('The coach idled beside you for a long time, and then it didn\'t. The 10-11 was lit like a shrine. Toothpaste. A toothbrush. Socks, in a three-pack, the most beautiful socks you have ever seen. You walked back with the bag held against your chest. Nothing passed you on the road. Nothing at all, which was somehow worse.'); }, next: 'carpark' },
      { label: 'Turn around. Walk back to the hotel. Fast.', kind: 'comply', dd: 6, time: 15, do: (G) => { G.nerves(8); G.dread(5); G.note('You did not run. You walked, fast, with the coach behind you, idling, keeping pace, and then not. The lobby doors slid open before you reached them.'); }, next: 'carpark' },
    ],
  };

  /* ---- the knock, three ways ---- */
  scenes.knock = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); },
    text: (G) => p(
      G.last(),
      'Someone is knocking. Not hammering — knocking, evenly, the way a person knocks who will knock all night.',
      V('“Coach for Albion Atlantic passengers. Departing now. Last call.”'),
      'The voice is patient. The voice is very, very patient.',
    ),
    choices: [
      { label: 'Open the door.', kind: 'comply', sub: 'It might be the bus.', do: (G) => G.end('nightcoach') },
      { label: 'Look through the spyhole.', dd: 6, nd: 6, time: 2, do: (G) => { G.nerves(9); G.flag('spyhole'); G.note('The corridor is empty. The carpet outside your door is wet. The knocking continues, evenly, from nowhere in particular.'); }, next: 'knock2' },
      { label: 'The sign said 11:00. Don\'t open. Don\'t answer.', whyNot: 'You cannot not answer.', nd: 5, dreadMax: 80, time: 20, do: (G) => { G.nerves(5); G.note('You sat on the bed with your back to the headboard and your eyes on the door and counted the knocks. You lost count at sixty. Then they stopped, and that was worse, for a while.'); }, next: 'window' },
    ],
  };

  scenes.knock2 = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: (G) => p(G.last(), 'Even. Patient. Nobody there.'),
    choices: [
      { label: 'Open the door anyway.', kind: 'comply', do: (G) => G.end('nightcoach') },
      { label: 'Back away from the door. Sit on the bed. Wait it out.', whyNot: 'Your hand is already on the chain.', dreadMax: 88, time: 25, do: (G) => { G.nerves(3); G.note('It stopped, eventually, the way rain stops: you did not notice the last one.'); }, next: 'window' },
    ],
  };

  scenes.corridor_knock = {
    art: 'corridor',
    loc: (G) => `Hótel Hraun · Second floor corridor · ${G.clock(G.t)}`,
    enter: (G) => { G.flag('knocked'); atLeast(G, 62); G.nerves(8); },
    text: (G) => p(
      G.last(),
      'You are in the corridor when it starts. Down at the far end, by the lift, someone in navy is knocking on a door. Evenly. Patiently. Then the next door. Then the next.',
      'He is working his way toward 214. He is working his way toward you. He has not looked up. ' + V('“Coach for Albion Atlantic passengers. Departing now. Last call.”'),
    ),
    choices: [
      { label: 'Walk past him. Back into your room. Lock it.', whyNot: 'You cannot walk toward him.', dreadMax: 80, time: 5, do: (G) => { G.nerves(10); G.dread(8); G.flag('seen'); G.note('He did not stop knocking as you passed. He did not turn. But as your key card clicked he said, pleasantly, to the door in front of him, ' + V('“Two fourteen,”') + ' and you got the chain on with hands that did not feel like yours.'); }, next: 'window' },
      { label: 'Go down the stairs. Quietly. Wait in the lobby.', whyNot: 'You cannot move.', dd: 5, dreadMax: 92, time: 15, do: (G) => { G.nerves(6); G.dread(5); G.note('The clerk did not look up when you came down. ' + V(LX('“He is looking for you,”')) + ' she said, to the crossword. You sat on the sofa with the couple and nobody said anything for a long time, and then the lobby doors slid open for nobody, and closed.'); }, next: 'window' },
      { label: 'Answer him. You are an Albion Atlantic passenger.', kind: 'comply', do: (G) => G.end('nightcoach') },
    ],
  };

  scenes.window = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    enter: (G) => { G.S.t = Math.max(G.t, T(1, 4, 50)); G.bot('Hi! I see you\'re in room 214. The coach is waiting for you in the car park. Please do not look out of the window. 🙂'); },
    text: (G) => p(
      G.last(),
      'Back in the room, or still in it. The knocking has stopped. Your phone lights the ceiling. A message from Ally.',
      W('The coach is waiting for you in the car park. Please do not look out of the window.'),
      'The curtain is a thin one. There is light coming through it, and the light is moving slightly, the way light from a running engine does.',
    ),
    choices: [
      { label: 'Look.', whyNot: 'He said not to.', dd: 10, nd: 8, dreadMax: 90, sub: 'Just a little.', time: 5, do: (G) => { G.flag('seen'); G.nerves(14); atLeast(G, 78); }, next: 'window2' },
      { label: 'Don\'t. Put the phone face down. Pull the duvet over your head.', kind: 'comply', dd: 6, time: 5, do: (G) => G.nerves(2), next: 'sleep' },
    ],
  };

  scenes.window2 = {
    art: 'room',
    loc: (G) => `Hótel Hraun · Room 214 · ${G.clock(G.t)}`,
    text: p(
      'A coach, navy, with a gold crest. Engine running. Every interior light on. It is full, and everyone in it is sitting perfectly upright, and every one of them is facing the hotel.',
      'At the door of the coach stands a man in a purser\'s uniform. As you watch, he looks up — not at the hotel. At your window.',
      'He does not wave. He does not need to. He has, you understand, noted it.',
    ),
    choices: [{ label: 'Let go of the curtain.', time: 5, next: 'sleep' }],
  };

  /* ---------------------------------------------------------------- Day 1 · 07:30 morning */
  scenes.sleep = {
    art: 'lobby',
    loc: 'Hótel Hraun · Breakfast room',
    enter: (G) => {
      G.S.t = T(1, 7, 30);
      G.flag('morning');
      G.S.dread = Math.max(20, G.S.dread - 25); // daylight helps, a little
      G.nerves(G.has('allnighter') ? 6 : G.has('coffee') ? -5 : -10);
      if (G.has('toothpaste')) G.nerves(-6);
      G.at(T(1, 7, 35), 'sms', { from: 'Jo 💛', body: 'OMG YOU\'RE IN ICELAND?? you have to do the blue lagoon. HAVE TO. it\'s like 20 min from the airport' });
      G.at(T(1, 8, 5), 'chat', { body: 'Good morning! Your transfer to the airport is confirmed for 08:00. Please be in the lobby. 🚌' });
      G.at(T(1, 9, 40), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Your transfer to the airport', stamp: T(1, 9, 40), body: 'Dear Customer,\n\nCoaches will collect you from your accommodation at 09:00 for your rebooked flight AB 0271.\n\nPlease be ready in the lobby at 08:45.\n\nWe are doing our best.' });
      G.at(T(1, 9, 55), 'chat', { body: 'Your coach is here. It\'s the nice one. 🚌' });
    },
    text: (G) => p(
      G.has('allnighter') ? 'Grey light. 07:30. You did not sleep, and you are still in Iceland.' : 'Grey light. 07:30. You slept, or something like it, and you are still in Iceland.',
      'Breakfast is skyr, bread, and a coffee that tastes like it was made by someone who had heard coffee described. The room is full of your flight. Everyone is wearing what they wore yesterday. Everyone is comparing notes: which hotel, which pickup time, which of the three conflicting messages they have chosen to believe.',
      'The printed sign is still taped to the desk. 11:00. Somebody has drawn a small heart on it.',
    ),
    choices: [{ label: 'Get a second coffee anyway.', time: 10, next: 'hotel_morning' }],
  };

  scenes.hotel_morning = {
    art: 'lobby',
    loc: 'Hótel Hraun · Lobby',
    enter: (G) => {
      if (G.t >= T(1, 10, 15)) { G.go('buses2'); return; }
      if (G.once('morn_intro')) G.note(p(G.last(), 'Basically everything has been timed to be maximally painful without giving you the freedom to go and do something pleasant in the gap. Three hours and nothing to do with them but wait for a bus that may or may not be the bus.'));
    },
    text: (G) => hub(G,
      `The lobby. ${G.clock(G.t)}. The sign says 11:00. ${G.t >= T(1, 9, 45) ? 'The email said 09:00 and arrived at 09:40. ' : G.t >= T(1, 8, 5) ? 'The chatbot said 08:00. It is past 08:00. ' : ''}Nobody has seen a bus that is yours.`,
      'morning'),
    choices: (G) => [
      { label: 'Show the UK261 QR code to every passenger you can reach.', whyNot: 'Your hands would not hold the phone still.', dd: -8, nd: -4, nerveMax: 90, sub: 'With the caveat that the airline will fight.', if: (G) => G.has('uk261'), once: 'qr1', time: 20, do: (G) => { G.collect(2); G.nerves(-5); G.note('You go table to table with the phone held out like a warrant. People photograph it. A woman with a bagel says, ' + V('“I\'m ready to be a Karen.”') + ' Somebody claps, once.'); }, next: 'hotel_morning' },
      { label: 'Compare notes with the others.', whyNot: 'You would start an argument.', dd: -5, nd: -4, nerveMax: 85, time: 20, once: 'notes1', do: (G) => { G.collect(1); G.nerves(-3); G.flag('hint_notes'); G.note('Four hotels. Six pickup times. One printout. A man in a Blazers cap: ' + V('“The crested ones aren\'t ours. Don\'t know whose they are. Not ours.”') + ' Everyone nods, as if they had known.'); }, next: 'hotel_morning' },
      { label: 'Ask reception if 11:00 is right.', kind: 'comply', dd: 2, time: 10, once: 'recep', do: (G) => { G.nerves(1); G.note('The same clerk. Still. She points at the sign. ' + V(LX('“Another passenger phoned them. They said yes.”')) + ' A pause. ' + V(LX('“Or they said something.”'))); }, next: 'hotel_morning' },
      { label: 'Go back up to the room. Shower. Wash your face, at least.', whyNot: 'You could not stand still under it.', nerveMax: 92, time: 25, once: 'morn_shower', do: (G) => { G.nerves(-5); G.note('Hot water. The same clothes. The room in daylight is just a room: the shampoos, the kettle, the window onto a car park with a coach in it. You do not look for long.'); }, next: 'hotel_morning' },
      { label: 'Talk to the toddler\'s mother.', whyNot: 'You would frighten the child.', nd: -3, dd: -3, nerveMax: 80, time: 10, once: 'morn_mother', do: (G) => { G.collect(1); G.nerves(-3); G.note(V('“She would like to be home now,”') + ' the mother says, of the toddler, who is under the table. ' + V('“So would I. Did you hear knocking last night?”') + ' You say yes. She says, ' + V('“We didn\'t open it either.”')); }, next: 'hotel_morning' },
      { label: 'Check the flight status on the airline site.', dd: 3, nd: 3, time: 8, do: (G) => { const n = G.count('status'); G.dread(2); G.note(n === 1 ? 'AB 0271 · KEF → LAX · 15:10 · ON TIME. On time for what, it does not say.' : n === 2 ? 'AB 0271 · 15:10 · ON TIME. Then, as you watch, 15:25. Then 15:10 again.' : 'The page will not load. Then it loads, and the flight is not on it. Then it is. 15:10. You put the phone away before it can change again.'); }, next: 'hotel_morning' },
      { label: 'Go outside and look for the 09:00 coach.', kind: 'comply', dd: 5, if: (G) => G.t >= T(1, 8, 50) && G.t < T(1, 10, 0), time: 10, next: 'decoy_morning' },
      { label: 'Go to the hot springs. You have always wanted to.', sub: 'It is twenty minutes away. Everyone says so.', do: (G) => G.end('tantalus') },
      { label: 'Wait in the lobby.', kind: 'comply', dd: 3, nd: 2, sub: 'Half an hour of it.', time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Half an hour. The coffee machine, the doors, the sign. A child counts to a hundred and starts again.', 'Half an hour. Somebody\'s phone alarm goes off — set for Los Angeles time — and everyone laughs, and then nobody does.', 'Half an hour. Outside, a coach comes, and is not yours, and goes. You do not get up. Neither does anyone.'])); }, next: 'hotel_morning' },
    ],
    status: (G) => (G.has('hint_notes') ? 'Hearsay: everyone got different times from the airline. Everyone is going with the printout. The crested coaches “aren\'t ours”.' : ''),
  };

  scenes.decoy_morning = {
    art: 'carpark',
    loc: 'Hótel Hraun · Car park',
    text: p(
      'There is a coach. Navy, gold crest, engine running. The LED on the front says AIRPORT TRANSFER · ALBION ATLANTIC. The purser stands at the door with his hands folded, and when he sees you he smiles as if you are exactly on time.',
      'Nobody else from the lobby has come out. Through the windows, the passengers already aboard sit upright in clean shirts and look at nothing.',
    ),
    choices: [
      { label: 'Board. The email did say 09:00.', kind: 'comply', do: (G) => G.end('crew') },
      { label: 'Go back inside. Say nothing about it to anyone.', whyNot: 'He is looking at you.', dreadMax: 85, time: 5, do: (G) => { G.nerves(6); G.dread(5); G.note('You went back in. Nobody asked. Through the glass the coach stayed where it was, with its door open, for a long time.'); }, next: 'hotel_morning' },
    ],
  };

  /* ---------------------------------------------------------------- Day 1 · 10:15 bus stand 2 */
  scenes.buses2 = {
    art: 'carpark',
    loc: 'Hótel Hraun · Car park',
    enter: (G) => { if (G.t < T(1, 10, 15)) G.S.t = T(1, 10, 15); G.dread(4); },
    text: (G) => p(
      'Somebody says there is a bus outside. You ask the receptionist if it is yours. She does not know. She points at the sign in Arial. ' + V(LX('“Maybe you should hurry.”')),
      'Imagine a video game meter, but for your nerves, ticking down into the thin shaking sliver of red.',
      'Outside: coaches. Nobody has told you which. Nothing on any of them says your flight number, except the one that does, in felt-tip.',
      G.has('hint_notes') && W('“The crested ones aren\'t ours.”'),
    ),
    buses: (G) => {
      const correct = {
        key: 'plain',
        art: { livery: '#c7c3b6', windows: 'dim', passengers: 'slumped', sign: 'paper', driver: 'hivis', ground: 'day' },
        name: 'The same white coach as last night, or one very like it',
        sign: G.pick(['AIRPORT', 'AB0271 → KEF', 'FLIGHT PPL AIRPORT']), signStyle: 'paper',
        look: ['Driver in hi-vis. Different sandwich.', 'Half full. People are still coming out of the lobby toward it.'],
        hidden: ['The fleece. The toddler. The man from 31C. Same clothes as last night, obviously, because what else would they be wearing.', 'You are not good with faces. You know these ones.'],
        board: { time: 5, do: (G) => G.flag('bus2_ok'), next: 'ride2' },
      };
      const crest = {
        key: 'crest',
        art: { livery: '#1b2a4a', stripe: '#c9a227', windows: 'warm', passengers: 'upright', sign: 'led', driver: 'purser', ground: 'day' },
        name: 'A navy coach with a gold crest',
        sign: 'AIRPORT TRANSFER · ALBION ATLANTIC', signStyle: 'led',
        look: ['The purser at the door. He waves. He knows which window was yours.', 'Warm. Quiet. Plenty of room.'],
        hidden: ['Nobody on board looks like they slept in their clothes. Nobody looks like they slept.', 'Nobody on board has a phone out.'],
        board: { kind: 'comply', do: (G) => G.end('crew') },
      };
      const lagoon = {
        key: 'lagoon',
        art: { livery: '#3e9c9a', windows: 'cold', passengers: 'few', sign: 'print', driver: 'plain', ground: 'day' },
        name: 'A turquoise minibus',
        sign: 'BLUE LAGOON SHUTTLE — Relax. You deserve it.', signStyle: 'print',
        look: ['Driver holding a stack of white towels.', 'Smells of sulphur and eucalyptus.'],
        hidden: ['Everyone aboard has clean socks.', 'It leaves in two minutes. It always leaves in two minutes.'],
        board: { do: (G) => G.end('tantalus') },
      };
      return G.shuffle([correct, crest, lagoon]);
    },
    choices: [
      { label: 'Wait. It isn\'t 11:00 yet. The sign said 11:00.', kind: 'comply', dd: 6, nd: 6, sub: 'The sign is the only thing that has been right so far.', time: 45, next: (G) => (G.t >= T(1, 11, 25) ? 'end:noshow' : 'buses2'), do: (G) => { G.nerves(8); G.dread(5); } },
    ],
  };

  scenes.ride2 = {
    art: 'road',
    loc: 'Route 41 · toward Keflavík',
    enter: (G) => {
      G.flag('left_hotel');
      if (G.once('nofood')) { if (G.rng() < 0.5) G.at(T(1, 12, 30), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Catering on your flight', body: 'Dear Customer,\n\nPlease note that due to the diversion there will be no catering service on flight AB 0271.\n\nWe recommend you purchase refreshments in the terminal.\n\nWe are doing our best.' }); }
      G.at(T(1, 12, 0), 'email', { from: 'Albion Atlantic Customer Care', subj: 'Revised departure time', body: 'Dear Customer,\n\nYour flight AB 0271 will now depart at 15:45.\n\nCheck-in opens three hours before departure.\n\nWe are doing our best.', fx: (G) => { G.S.dep = T(1, 15, 45); } });
      G.at(T(1, 13, 10), 'chat', { body: 'You have been accommodated. Why are you in a queue? 🙂' });
    },
    text: p(
      'You assume you are in the right place only because you are starting to recognise other passengers, despite not being very good with faces. The bus leaves twenty minutes late, which, by your calculations, means you will arrive at the airport a mere forty minutes before check-in even opens.',
      'A baby is howling. The mother murmurs, ' + V('“She would like to be home now,”') + ' and the whole bus laughs, sadly.',
      'Iceland goes past the window: great tap water, lovely vistas, reasonably nice people who are not necessarily helpful but do not threaten you or lie to you. Huge ups to Iceland for that. Keflavík is innocent.',
    ),
    choices: [{ label: 'Arrive.', time: 55, do: (G) => G.nerves(-4), next: 'airport' }],
  };

  /* ---------------------------------------------------------------- Day 1 · ~11:30 the airport (hub) */
  scenes.airport = {
    art: 'airport',
    loc: 'Keflavík International · Departures',
    enter: (G) => {
      G.flag('at_airport2'); atLeast(G, 45);
      if (G.once('counter_paper')) G.msg('paper', { from: 'A4 sheet, cable-tied to a tensabarrier', subj: 'Printed sign', body: '<b>ALBION ATLANTIC AB0271</b>\n\nCounter opens <b>3 HOURS</b> before departure.\n\nIf departure is delayed, counter opening is delayed.\n\nPlease queue here.' });
      if (G.once('ap_intro')) G.note(p(G.last(), 'There is one (1) Albion Atlantic counter in the airport, and a queue for it made entirely of people you now know by sight. The counter is not open. A sheet of A4 says it will open three hours before departure, and not a minute earlier, and if the flight is delayed, so is the counter.'));
      const open = G.S.dep - 180;
      if (G.t >= open && G.has('inline')) G.go('checkin');
    },
    text: (G) => {
      const open = G.S.dep - 180;
      return hub(G,
        `Departures. ${G.clock(G.t)}. The board says AB 0271 · LOS ANGELES · <em>${G.clock(G.S.dep)}</em>. ${G.t < open ? `By the arithmetic on the printout the counter opens at ${G.clock(open)}.` : G.has('inline') ? 'The shutter is going up.' : 'The counter is open. The queue is moving. You are not in it.'}`,
        'airport',
        G.has('seen') && G.D >= 5 ? W('You keep looking for a purser\'s uniform. You have not seen one. That is not the same as there not being one.') : '');
    },
    choices: (G) => [
      { label: 'Print a new boarding pass at the kiosk.', nd: 4, dd: 2, time: 8, do: (G) => { const n = G.count('kiosk'); G.nerves(3); G.note(n === 1 ? 'YOUR BOOKING CANNOT BE FOUND. You switch kiosks. You input the info. YOUR BOOKING CANNOT BE FOUND, in a different font. You truly cannot make this up.' : n === 2 ? 'The kiosk thinks about it for a long time and prints a blank card. You keep it. You do not know why.' : 'YOUR BOOKING HAS BEEN ACCOMMODATED. Then the screen goes dark and shows you your face.'); if (n >= 3) G.dread(3); }, next: 'airport' },
      { label: 'Join the queue for the one counter.', if: (G) => !G.has('inline'), time: 5, do: (G) => { G.flag('inline'); G.note('You join the queue. It is not a queue so much as a decision two hundred people have made together. Nobody in it is talking to the airline. Everybody in it is talking to each other.'); }, next: 'airport' },
      { label: 'Share the UK261 QR code down the queue.', whyNot: 'Your hands would not hold the phone still.', dd: -6, nd: -4, nerveMax: 90, if: (G) => G.has('uk261'), once: 'qr2', time: 15, do: (G) => { G.collect(2); G.nerves(-5); G.note('The code goes down the line like a password. ' + V('“I\'m ready to be a Karen,”') + ' says a man in a fleece, who is the man in the fleece.'); }, next: 'airport' },
      { label: 'Compare notes on hotels and departure times.', whyNot: 'You would start an argument.', nd: -4, dd: -4, nerveMax: 85, once: 'notes2', time: 15, do: (G) => { G.collect(1); G.nerves(-3); G.note('Everyone was sent somewhere different. Everyone was given a different time. Everyone came back anyway, because the printout said so, and here you all are, being right together.'); }, next: 'airport' },
      { label: 'Find someone in a uniform and tell them exactly what you think.', kind: 'conflict', nd: 8, time: 10, do: (G) => { G.strike(); G.note('You told a man in a uniform exactly what you think. ' + V('“We\'re doing our best.”') + ' No sorry. No sympathies. Not even performatively. He wrote something down.'); }, next: 'airport' },
      { label: 'Look for the exit. Just to see.', whyNot: 'You already know it is locked.', dd: 6, dreadMax: 85, time: 8, once: 'exit', do: (G) => { G.dread(5); G.nerves(4); G.note('The doors to outside say ARRIVALS ONLY. You came in through them. You put your hand on the glass and it does not open, and a man in a fluorescent vest, without looking at you, shakes his head.'); }, next: 'airport' },
      { label: 'Buy water. The man behind you does not trust that they won\'t run out.', whyNot: 'You would throw it.', nd: -4, nerveMax: 92, time: 10, once: 'water', do: (G) => { G.nerves(-3); G.note('Water, and a sandwich with the letter ð in it, and — because the shop has them — socks. You had socks. You buy more socks. Nobody who has been through this night would judge you.'); if (!G.has('toothpaste')) { G.flag('toothpaste'); G.nerves(-4); } }, next: 'airport' },
      { label: 'Watch the departure board.', dd: 3, nd: 3, time: 6, do: (G) => { const n = G.count('board'); G.dread(2); G.note(n === 1 ? `AB 0271 · LOS ANGELES · ${G.clock(G.S.dep)}. Then the board flips through every flight in the world and comes back to it. Same time. For now.` : n === 2 ? 'The time has not changed. The row has moved down. Everything above it is a flight to somewhere that is leaving.' : 'You watch it flip. LOS ANGELES. LOS ANGELES. For a single frame, something that is not a city. LOS ANGELES.'); }, next: 'airport' },
      { label: 'Wait.', whyNot: 'You cannot stand still.', kind: 'comply', nd: 3, dd: 3, nerveMax: 90, time: 30, do: (G) => { G.nerves(3); G.dread(2); G.note(G.pick(['Half an hour. The queue does not move because there is nothing for it to move toward. Somebody sits down on the floor and it spreads.', 'Half an hour. A cleaner goes past with a machine. When she has gone, the floor looks the same and the queue is a little shorter.', 'Half an hour. Your phone buzzes with nothing. Everyone\'s does, at once, and everyone looks, and nobody says.'])); }, next: 'airport' },
    ],
  };

  scenes.checkin = {
    art: 'airport',
    loc: 'Keflavík · The one counter',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 180); if (G.S.strikes >= 3) G.end('left'); },
    text: (G) => p(
      'The counter opens on time, which is to say at the time it had privately decided. The agent takes your passport. Nobody in a uniform has been remotely apologetic all day, even performatively, and this man will not break the streak. ' + V('“We\'re doing our best.”'),
      G.has('booked') && 'He frowns at the screen. ' + V('“Our records show you were accommodated at the Heathrow Renaissance Lodge last night.”') + ' He types something. He says it has been noted.',
      G.has('objected') && W('He glances at a small card clipped to the monitor, and then at you.'),
      G.has('seen') && W('He looks at you slightly too long. ' + V('“Room 214,”') + ' he says, not as a question.'),
      'A boarding pass, warm from the printer. Gate 12. It is real. You check it three times.',
    ),
    choices: [
      { label: 'Go to the gate.', time: 40, do: (G) => { if (G.has('booked')) G.strike(); G.nerves(-6); }, next: 'gate' },
    ],
  };

  scenes.gate = {
    art: 'gate',
    loc: 'Keflavík · Gate 12',
    enter: (G) => { G.S.t = Math.max(G.t, G.S.dep - 60); G.dread(5); G.at(G.t + 20, 'chat', { body: 'The majority of customers have boarded. 🙂' }); },
    text: p(
      'You have now been travelling for over twenty-four hours with these people. You know the fleece. You know the toddler. You know the man from 31C and the couple who were sent to a hotel in the opposite direction and the man who genuinely does not trust the airline not to run out of water.',
      'A gate agent gets on the microphone and <em>screams</em> at you to board by boarding group.',
      'And a hundred people laugh in her face. Not cruelly. Just — helplessly. You have formed a self-governing society at this point and her attempt to give it orders is, somehow, the funniest thing that has happened all day.',
    ),
    choices: [
      { label: 'Laugh with them.', whyNot: 'It would come out wrong.', nd: -6, dd: -4, nerveMax: 85, time: 10, do: (G) => { G.collect(1); G.nerves(-6); }, next: 'jetbridge' },
      { label: 'Board by group, obediently.', kind: 'comply', dd: 5, time: 10, do: (G) => G.nerves(2), next: 'jetbridge' },
      { label: 'Ask her when the flight will actually leave.', kind: 'conflict', nd: 5, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) G.end('left'); }, next: 'jetbridge' },
      { label: 'Shout back. Louder than her.', kind: 'conflict', nerveMin: 80, nd: 10, time: 10, do: (G) => { G.strike(); if (G.S.strikes >= 3) G.end('left'); else G.note('You shouted. It felt, for four seconds, magnificent. Then a man in navy appeared at your elbow, and wrote something down, and went away, and the laughter had stopped.'); }, next: 'jetbridge' },
    ],
  };

  scenes.jetbridge = {
    art: 'gate',
    loc: 'Keflavík · Jetbridge',
    text: p(
      'The line stalls on the jetbridge. It is already past the departure time on your boarding pass, and the boarding pass is the newest one. You are swapping notes with the man ahead of you on the conflicting information you have each received about what the flight will be like.',
      'Then the line moves, and you round the corner, and instead of an aircraft door there is…',
      '<em>A bus.</em>',
      W('And they needed you to board by group.'),
    ),
    choices: [{ label: 'Get on the bus.', time: 10, next: 'tarmac' }],
  };

  scenes.tarmac = {
    art: 'tarmac',
    loc: 'A bus · a highway · rolling pastures',
    enter: (G) => G.dread(5),
    text: (G) => p(
      'This bus is not taking you to another place on the tarmac. This bus is on what appears to be an actual highway, through actual rolling pastures, with actual sheep in them.',
      G.has('seen') ? 'At the front of the bus, standing, holding the rail, is a man in a purser\'s uniform. He turns. He looks at you — only you — for exactly as long as he looked at your window. ' + V('“You looked,”') + ' he says, pleasantly, and turns back.' : 'The driver does not speak. The radio plays something that might be the weather.',
      'Nobody says anything. Somebody, near the back, starts to laugh, and then stops.',
    ),
    choices: [
      { label: 'Stay on. Watch the horizon for anything with wings.', kind: 'comply', dd: 5, time: 15, next: 'plane' },
      { label: 'Go up front. Ask the driver where this bus is going.', kind: 'conflict', nd: 4, time: 15, do: (G) => { G.nerves(5); G.flag('asked_driver2'); }, next: 'plane' },
      { label: 'Demand to be let off. Now.', kind: 'conflict', sub: 'This is not the tarmac.', do: (G) => G.end('pastures') },
    ],
  };

  scenes.plane = {
    art: 'plane',
    loc: 'An apron · somewhere',
    text: (G) => p(
      G.has('asked_driver2') && W('He pointed forward, through the windscreen, at pasture. Then the pasture ended.'),
      'You think you see your airplane. So you probably have not been kidnapped.',
      'They line you up outdoors, inching along the foot of the stairs. And then it begins to rain. You laugh out loud, not least because you are already, obviously, past the departure time.',
      'Seat. Belt. The posh voice, on the handset: ' + V('“The majority of our customers have been understanding and patient.”') + ' He goes on to congratulate himself, at some length, on the safety procedures that brought you to Iceland.',
      'Then he explains how to apply for a refund. You sit up. It is for the in-flight wifi.',
      'You will not be doing that.',
    ),
    choices: [
      { label: 'Close your eyes.', do: (G) => G.end(G.S.collective >= 5 ? 'collective' : 'home') },
    ],
  };

  /* ================================================================ endings */
  const endings = {
    terminal: {
      art: 'terminal', title: 'THE TERMINAL', kind: 'bad',
      hint: 'Someone always makes an announcement.', blurb: 'You waited for the announcement.',
      text: p(
        'Nobody makes an announcement. Nobody was ever going to. At 03:10 the lights in the arrivals hall go to a quarter, and then the hall is a shape you are remembering rather than seeing.',
        'Your phone shows one bar and a new email. <em>We have organised coaches for you.</em> It doesn\'t say where. It never will.',
        'In the morning the cleaners find a boarding pass and put it in lost property. They are very good about that here.',
      ),
    },
    accommodated: {
      art: 'road', title: 'ACCOMMODATED', kind: 'bad',
      hint: 'The email had the logo on it.', blurb: 'You confirmed the booking.',
      text: p(
        'The car is warm and the seats are leather and the driver does not speak. The screen on the dash says HEATHROW RENAISSANCE LODGE · 1,894 km · ARRIVAL —:—.',
        'You watch the airport lights shrink. After a while there are no lights at all — only the sound of the tyres, and the little chime of a new email, arriving to confirm that your accommodation has been arranged.',
      ),
    },
    crew: {
      art: 'stand', title: 'THE CREW', kind: 'bad',
      hint: 'It had a crest on it. It was very nice.', blurb: 'You boarded the nice one.',
      text: p(
        'The coach smells of new upholstery and nothing else. Everyone smiles at you as you pass. Nobody is wearing yesterday\'s clothes, because nobody here has a yesterday.',
        'The purser closes the door with a soft, expensive sound. ' + V('“The majority of our customers have been understanding and patient.”') + ' He means you. You have been understanding. You have been very patient.',
        'The coach pulls out of the light, and the stand behind it is empty, and has been for some time.',
      ),
    },
    convenience: {
      art: 'road', title: 'CONVENIENCE', kind: 'bad',
      hint: 'Twenty minutes\' walk. In this state.', blurb: 'You got on, halfway to the 10-11.',
      text: p(
        'It is warm on the coach, and the seats face inward, which you did not notice until you sat down. ' + V('“We\'re doing our best,”') + ' says the purser, and the door folds shut, and the 10-11 slides past on the left with all its lights on and nobody inside.',
        'You never do get any toothpaste.',
      ),
    },
    nightcoach: {
      art: 'corridor', title: 'NIGHT COACH', kind: 'bad',
      hint: 'Last call.', blurb: 'You answered the knock.',
      text: p(
        'The corridor is empty and the carpet is wet. From the stairwell: ' + V('“Departing now.”') + ' You follow it, because it is the only instruction anyone has given you all night that came with a time attached.',
        'The coach in the car park is waiting with its interior lights on. Everyone inside is already facing the hotel. There is a seat with your name on it. There is, in fact, a small printed card with your name on it, in Arial.',
      ),
    },
    lift: {
      art: 'corridor', title: 'THE LIFT', kind: 'bad',
      hint: 'Out of order, in Arial.', blurb: 'You got into the lift that came on its own.',
      text: (G) => p(
        G.has('toothpaste') ? 'The doors close with the courtesy of a good hotel. The mirror at the back shows you: the plane clothes, the face, the little bag from the 10-11 held against your chest. The lift goes down. It goes down for longer than the building has floors.' : 'The doors close with the courtesy of a good hotel. The mirror at the back shows you: the plane clothes, the face, the hands with nothing in them. The lift goes down. It goes down for longer than the building has floors.',
        'When the doors open, it is onto warm light and rows of seats, and everyone in them turns to look at you, and smiles, and the purser says, ' + V('“Thank you for your patience,”') + ' and means it.',
      ),
    },
    tantalus: {
      art: 'carpark', title: 'TANTALUS', kind: 'bad',
      hint: 'You have always wanted to visit Iceland.', blurb: 'You went to the hot springs.',
      text: (G) => p(
        G.has('toothpaste') ? 'The water is 38°C and the sky is the colour of a used tissue and you are wearing the socks from the 10-11, the most beautiful socks you have ever seen, now full of sulphur. It is, objectively, beautiful.' : 'The water is 38°C and the sky is the colour of a used tissue and you are wearing the socks from the flight because you have no other socks. It is, objectively, beautiful.',
        'At 11:00 a bus leaves a hotel car park thirty kilometres away without you. At 11:04 an email arrives to say your coach departed at 09:00. At 11:05 the chatbot asks whether you enjoyed your stay.',
        'Sure wish you hadn\'t been holding that monkey\'s paw when you said it.',
      ),
    },
    noshow: {
      art: 'lobby', title: 'NO-SHOW', kind: 'bad',
      hint: 'The sign said 11:00.', blurb: 'You waited for the exact time on the sign.',
      text: (G) => p(
        'By 11:30 the sign has been taken down. Reception doesn\'t remember putting it up. ' + V(LX('“Are you with the airline group? They\'ve gone.”')) + ' She says it kindly.',
        'The lobby coffee machine makes a sound like something clearing its throat. Your booking, when you check, cannot be found.',
      ),
    },
    left: {
      art: 'airport', title: 'LEFT BEHIND', kind: 'bad',
      hint: 'He did say.', blurb: 'Three complaints, all noted.',
      text: p(
        V('“We\'ve noted your feedback,”') + ' says the man in the uniform, and it turns out that they have; all of it, on a small card, in a neat hand. It has three ticks on it.',
        V('“As advised on board, customers who resist or object to operational decisions may be offloaded.”') + ' He says this without any unkindness at all, which is the worst part. Then he asks the next passenger to step forward, and the queue closes over you like water.',
      ),
    },
    pastures: {
      art: 'tarmac', title: 'PASTURES', kind: 'bad',
      hint: 'This bus is on an actual highway.', blurb: 'You got off the tarmac bus.',
      text: p(
        'The bus stops, which is what you wanted. The door opens onto a lay-by, a fence, sheep, and a wind that has come a long way to meet you. ' + V('“As you wish,”') + ' says the driver, and the bus goes on without you, toward something that might, at that distance, be an aircraft.',
        'Iceland has done nothing wrong. The sheep are very nice.',
      ),
    },
    home: {
      art: 'plane', title: 'HOME (OR GREENLAND, OR HELL)', kind: 'good',
      hint: 'See you in Los Angeles.', blurb: 'You made it. Alone, mostly.',
      text: p(
        'You are in a seat. The seat is on an aircraft. The aircraft is, as far as you can tell, moving in the direction of Los Angeles.',
        'Nobody in a uniform ever said sorry. The wifi refund remains unclaimed.',
        'See you in Los Angeles in ten hours. Or in Greenland. Or in hell.',
      ),
    },
    collective: {
      art: 'plane', title: 'THE SELF-GOVERNING COLLECTIVE OF LHR–LAX', kind: 'good',
      hint: 'Hearsay is not an official channel.', blurb: 'You made it, and so did everyone you talked to.',
      text: (G) => p(
        'On the stairs somebody laughs, and then everybody does, and the rain does not matter. You have been travelling together for over twenty-eight hours. ' + (G.has('uk261') ? 'You have a QR code, a man in a fleece, ' : 'You have a man in a fleece, ') + (G.has('met31c') || G.has('ally31c') ? 'a man from 31C, ' : '') + 'and a toddler who has seen things.',
        'The most accurate and helpful information during this entire ordeal came from paper printouts in Arial and random passengers conveying hearsay. Nobody in a uniform ever said sorry. It turns out you didn\'t need them to.',
        'See you in Los Angeles. On behalf of the self-governing collective of LHR–LAX, you wish the man in intensive care well.',
      ),
    },
  };

  /* ================================================================ interface strings */
  const ui = {
    tabMail: 'Mail', tabAlly: 'Ally', tabSms: 'SMS', tabPaper: 'Paper', phone: 'PHONE',
    nerves: 'NERVES', dread: 'DREAD', noted: 'NOTED', day: 'DAY',
    board: 'Board', look: 'Look closer', lookHint: 'Costs a few minutes.',
    again: 'Fly again', endings: 'Endings', back: 'Back', howto: 'How this works', start: 'Board', design: 'Design notes',
    gameOver: 'GAME OVER', madeIt: 'YOU MADE IT — MORE OR LESS',
    subtitle: 'A HOSPITALITY HORROR · TEXT · 20–30 MINUTES',
    galleryIntro: 'Every way this can go. Locked ones are still out there.', locked: '???',
    noMail: 'No mail. That, at least, is normal.', noSms: 'No messages.', noPaper: 'Photos of printed signs you find. You will find some.',
    allyIntro: 'Ally — Albion Atlantic virtual assistant. Typically replies instantly.', inbox: '‹ Inbox',
    emailFoot: 'This is an automated message. Replies to this address are not monitored, read, or possible. Albion Atlantic — We\'re doing our best.',
    from: 'From:', sent: 'Sent', received: 'Received', arrived: 'arrived', photographed: 'Photographed',
    tMail: 'MAIL', tSms: 'SMS', tPaper: 'PAPER', tAlly: 'ALLY', tNoted: 'NOTED · The airline has recorded your feedback.',
    gateNerves: 'You couldn\'t keep your voice steady for that.', gateDread: 'You can\'t bring yourself to.',
  };

  return { start, scenes, endings, chat, ui, T, lang: 'en', broken: CONTENT_BROKEN };
})();
