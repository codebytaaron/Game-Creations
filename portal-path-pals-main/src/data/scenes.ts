import { Scene, Stage, InboxMessage, Choice } from '@/types/game';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Morning Scenes
const morningScenes: Scene[] = [
  {
    id: 'morning-1',
    stage: 'morning',
    title: 'The Notification',
    narrative: `Your phone buzzes at 6:47 AM. Before you even open your eyes, you know what it is. The portal opened 12 hours ago, and your name is officially in the system. By the time you check your notifications, there are already 47 unread messages. Coaches, agents, "advisors" you've never heard of. Your old position coach texts: "Saw you entered. No hard feelings. Good luck." The coffee's cold, but the inbox is hot.`,
    messages: [
      { id: generateId(), type: 'coach', sender: 'Coach Martinez - Texas Tech', subject: 'Opportunity Knocking', preview: 'We\'ve been following your film...', tier: 'power5' },
      { id: generateId(), type: 'agent', sender: 'Elite Sports Management', subject: 'Representation Inquiry', preview: 'Our NIL team can maximize your potential...' },
      { id: generateId(), type: 'social', sender: '@PortalWatcher', subject: 'You\'re trending', preview: '🔥 Breaking: Another one enters the portal...' },
    ],
    choices: [
      { id: 'c1', text: 'Reply to every coach personally', delta: { stress: 15, reputation: 10, energy: -20 }, tooltip: '+Reputation, +Stress, -Energy' },
      { id: 'c2', text: 'Focus on Power 5 schools only', delta: { hype: 10, fit: -5, stress: 5 }, tooltip: '+Hype, -Fit, +Stress', setsFlag: 'power5-focus' },
      { id: 'c3', text: 'Let your advisor handle initial contact', delta: { stress: -10, reputation: -5, energy: 10 }, tooltip: '-Stress, -Reputation, +Energy' },
      { id: 'c4', text: 'Take a breath, prioritize top 5', delta: { fit: 10, stress: -5 }, tooltip: '+Fit, -Stress' },
    ],
  },
  {
    id: 'morning-2',
    stage: 'morning',
    title: 'Family Breakfast',
    narrative: `Mom made your favorite—scrambled eggs with hot sauce, just like before big games. But this isn't a game. Dad's quiet, scrolling through transfer news on his phone. "You sure about this?" he asks without looking up. Your little brother wants to know if you'll play for his favorite team. The eggs are getting cold while your phone keeps vibrating.`,
    messages: [
      { id: generateId(), type: 'family', sender: 'Uncle Ray', subject: 'RE: Big news', preview: 'My buddy knows a guy at Alabama. Want me to reach out?' },
      { id: generateId(), type: 'coach', sender: 'Coach Williams - Oregon State', subject: 'Fresh Start', preview: 'We build programs here, not just rosters...', tier: 'power5' },
      { id: generateId(), type: 'media', sender: 'Local Sports Radio', subject: 'Interview Request', preview: 'Our listeners would love to hear your story...' },
    ],
    choices: [
      { id: 'c1', text: 'Be honest with dad about your doubts', delta: { stress: -15, energy: 10, hype: -5 }, tooltip: '-Stress, +Energy, -Hype', setsFlag: 'family-support' },
      { id: 'c2', text: 'Promise brother you\'ll try for his team', delta: { stress: 10, hype: 15, fit: -10 }, tooltip: '+Hype, +Stress, -Fit' },
      { id: 'c3', text: 'Excuse yourself to take calls', delta: { reputation: 5, stress: 10, energy: -10 }, tooltip: '+Reputation, +Stress, -Energy' },
      { id: 'c4', text: 'Put the phone away, be present', delta: { energy: 15, stress: -10, hype: -10 }, tooltip: '+Energy, -Stress, -Hype', setsFlag: 'grounded' },
    ],
  },
  {
    id: 'morning-3',
    stage: 'morning',
    title: 'The Group Chat Explodes',
    narrative: `Your teammates—former teammates now—are blowing up the group chat. Some are supportive. "Get that bag, bro." Others are hurt. "Thought we were building something here." The star receiver who stayed sends a cryptic message: "interesting." You realize every response will be screenshot and analyzed. Welcome to the fishbowl.`,
    messages: [
      { id: generateId(), type: 'teammate', sender: 'Marcus (Former Teammate)', subject: 'Group Chat', preview: 'You saw what Cole said? That\'s messed up...' },
      { id: generateId(), type: 'social', sender: '@CFBInsider', subject: 'Quote Tweet', preview: 'Sources say locker room wasn\'t the issue...' },
      { id: generateId(), type: 'coach', sender: 'Coach Rivera - UCF', subject: 'No Pressure', preview: 'Take your time. We see your potential.', tier: 'group5' },
    ],
    choices: [
      { id: 'c1', text: 'Write a heartfelt goodbye message', delta: { reputation: 15, stress: 10, energy: -5 }, tooltip: '+Reputation, +Stress' },
      { id: 'c2', text: 'Go silent, let actions speak later', delta: { stress: -5, reputation: -5, hype: -10 }, tooltip: '-Stress, -Reputation, -Hype', setsFlag: 'silent-treatment' },
      { id: 'c3', text: 'Clap back at the haters', delta: { hype: 15, reputation: -20, stress: 15 }, tooltip: '+Hype, -Reputation, +Stress', setsFlag: 'controversial' },
      { id: 'c4', text: 'Private message the supportive ones', delta: { fit: 5, energy: -5, reputation: 5 }, tooltip: '+Fit, +Reputation, -Energy' },
    ],
  },
  {
    id: 'morning-4',
    stage: 'morning',
    title: 'The Agent Pitch',
    narrative: `An agent you've never met is already in your DMs with a PowerPoint. "I've placed 15 guys this cycle. My average NIL increase is 340%." The numbers are dazzling. The promises are bigger. But something about the pressure feels off—he wants an answer by noon. Your current advisor, the volunteer coach who's been there since high school, left a voicemail asking if you need anything.`,
    messages: [
      { id: generateId(), type: 'agent', sender: 'Prime Time Sports Group', subject: 'Exclusive Opportunity', preview: 'I have 3 P5 coaches waiting for my call...' },
      { id: generateId(), type: 'family', sender: 'Coach Davis (HS Coach)', subject: 'Checking In', preview: 'No agenda here. Just want to help however I can.' },
      { id: generateId(), type: 'coach', sender: 'Coach Thompson - Virginia Tech', subject: 'Real Talk', preview: 'Let\'s skip the BS and have a real conversation.', tier: 'power5' },
    ],
    choices: [
      { id: 'c1', text: 'Sign with the flashy agent', delta: { hype: 20, fit: -15, stress: 10 }, tooltip: '+Hype, -Fit, +Stress', setsFlag: 'big-agent' },
      { id: 'c2', text: 'Stick with your current advisor', delta: { fit: 15, hype: -10, stress: -10 }, tooltip: '+Fit, -Hype, -Stress', setsFlag: 'loyal-advisor' },
      { id: 'c3', text: 'Go solo, handle it yourself', delta: { stress: 20, reputation: 10, energy: -15 }, tooltip: '+Stress, +Reputation, -Energy', setsFlag: 'solo' },
      { id: 'c4', text: 'Ask for more time to decide', delta: { stress: 5, hype: -5 }, tooltip: '+Stress, -Hype' },
    ],
  },
  {
    id: 'morning-5',
    stage: 'morning',
    title: 'Film Session With Self',
    narrative: `You pull up your own highlights at 7 AM, trying to see what the coaches will see. 14 touchdowns, 2 All-Conference nods. But also that dropped pass in the championship. That coverage bust that went viral for the wrong reasons. The comments are still there. Will they see the whole picture, or just the lowlights?`,
    messages: [
      { id: generateId(), type: 'media', sender: 'ESPN Local', subject: 'Film Breakdown Request', preview: 'We\'re doing a portal prospect feature...' },
      { id: generateId(), type: 'coach', sender: 'Coach Barnes - Memphis', subject: 'We Do Our Homework', preview: 'I watched every snap from last season...', tier: 'group5' },
      { id: generateId(), type: 'social', sender: '@Film_Guru', subject: 'Thread Alert', preview: 'Just broke down your tape. Here\'s what I see...' },
    ],
    choices: [
      { id: 'c1', text: 'Create a new highlight reel, control the narrative', delta: { hype: 15, reputation: 5, energy: -15 }, tooltip: '+Hype, +Reputation, -Energy' },
      { id: 'c2', text: 'Address the lowlights publicly first', delta: { reputation: 20, stress: 15, hype: -5 }, tooltip: '+Reputation, +Stress, -Hype', setsFlag: 'transparent' },
      { id: 'c3', text: 'Focus on what you can control going forward', delta: { fit: 10, stress: -10, energy: 5 }, tooltip: '+Fit, -Stress, +Energy' },
      { id: 'c4', text: 'Let the film speak, avoid social media', delta: { stress: -15, hype: -10, reputation: 5 }, tooltip: '-Stress, -Hype, +Reputation', setsFlag: 'low-profile' },
    ],
  },
];

// Midday Scenes
const middayScenes: Scene[] = [
  {
    id: 'midday-1',
    stage: 'midday',
    title: 'The Zoom Carousel',
    narrative: `By noon, you've been on three Zoom calls. Each coach has a perfectly rehearsed pitch: "Family atmosphere." "Player development." "NIL opportunities." The backgrounds blur together—weight rooms and trophy cases. One coach name-drops an NFL scout. Another promises you'll start day one. Your lunch sits untouched, getting cold.`,
    messages: [
      { id: generateId(), type: 'coach', sender: 'Coach Phillips - Arizona', subject: 'Quick Follow-Up', preview: 'Great call! Let\'s get you on campus ASAP...', tier: 'power5' },
      { id: generateId(), type: 'agent', sender: 'Your Agent', subject: 'Schedule Update', preview: 'Added two more calls this afternoon...' },
      { id: generateId(), type: 'coach', sender: 'Coach Nguyen - San Diego State', subject: 'Different Approach', preview: 'I know you\'re busy. Here\'s what makes us different.', tier: 'group5' },
      { id: generateId(), type: 'social', sender: '@RecruitingNewsHQ', subject: 'Update', preview: 'Hearing buzz about your call with Arizona...' },
    ],
    choices: [
      { id: 'c1', text: 'Take every call, explore all options', delta: { stress: 20, hype: 10, energy: -25, fit: 5 }, tooltip: '+Stress, +Hype, -Energy, +Fit' },
      { id: 'c2', text: 'Cancel afternoon calls, regroup', delta: { stress: -15, hype: -10, energy: 15 }, tooltip: '-Stress, -Hype, +Energy', setsFlag: 'selective' },
      { id: 'c3', text: 'Focus on the two schools that felt right', delta: { fit: 15, stress: -5, hype: -5 }, tooltip: '+Fit, -Stress, -Hype', setsFlag: 'focused' },
      { id: 'c4', text: 'Ask tougher questions, cut through the pitches', delta: { reputation: 10, fit: 10, stress: 10 }, tooltip: '+Reputation, +Fit, +Stress', setsFlag: 'direct' },
    ],
  },
  {
    id: 'midday-2',
    stage: 'midday',
    title: 'The NIL Breakdown',
    narrative: `Your phone pings with a spreadsheet from an NIL collective. The numbers are... significant. Six figures for social media posts and appearances. But the fine print is dense—exclusivity clauses, performance bonuses tied to stats you can't control. Another collective offers less money but more freedom. Everyone wants a piece.`,
    messages: [
      { id: generateId(), type: 'agent', sender: 'Athlete Alliance Collective', subject: 'Official Offer', preview: '$150K package, contingent on commitment by Friday...' },
      { id: generateId(), type: 'agent', sender: 'Local Business Network', subject: 'Community Deal', preview: '$45K base, but we believe in long-term partnerships...' },
      { id: generateId(), type: 'family', sender: 'Dad', subject: 'Got a minute?', preview: 'Don\'t sign anything yet. Let\'s talk tonight.' },
    ],
    choices: [
      { id: 'c1', text: 'Take the big money offer', delta: { hype: 25, stress: 15, fit: -20 }, tooltip: '+Hype, +Stress, -Fit', setsFlag: 'big-nil' },
      { id: 'c2', text: 'Choose the community-focused deal', delta: { fit: 15, reputation: 10, hype: -10 }, tooltip: '+Fit, +Reputation, -Hype', setsFlag: 'community-nil' },
      { id: 'c3', text: 'Negotiate for better terms on both', delta: { stress: 20, reputation: 15, energy: -10 }, tooltip: '+Stress, +Reputation, -Energy' },
      { id: 'c4', text: 'Table NIL until you pick a school', delta: { stress: -10, fit: 10, hype: -15 }, tooltip: '-Stress, +Fit, -Hype', setsFlag: 'nil-later' },
    ],
  },
  {
    id: 'midday-3',
    stage: 'midday',
    title: 'Surprise Visit',
    narrative: `A car pulls up outside. It's a position coach from a top-15 program—no scheduled visit, just "happened to be in the area." He's got gear with the school logo, a folder full of promises, and an intensity that's equal parts flattering and overwhelming. Your mom is already making coffee.`,
    messages: [
      { id: generateId(), type: 'coach', sender: 'Coach Reynolds - LSU', subject: 'Hope This Is OK', preview: 'I know it\'s unannounced, but I had to meet you...', tier: 'power5' },
      { id: generateId(), type: 'social', sender: '@TigerNation', subject: 'Eyes Emoji', preview: 'Coach Reynolds spotted in your hometown today 👀' },
      { id: generateId(), type: 'family', sender: 'Mom', subject: 'Living Room', preview: 'He seems nice! Come downstairs!' },
    ],
    choices: [
      { id: 'c1', text: 'Roll with it, give them the full visit experience', delta: { hype: 20, stress: 10, fit: 10 }, tooltip: '+Hype, +Stress, +Fit', setsFlag: 'surprise-visit-good' },
      { id: 'c2', text: 'Be polite but set boundaries', delta: { reputation: 15, stress: -5, hype: -10 }, tooltip: '+Reputation, -Stress, -Hype' },
      { id: 'c3', text: 'See it as a red flag, cut it short', delta: { fit: -10, stress: -10, hype: -5 }, tooltip: '-Fit, -Stress, -Hype', setsFlag: 'boundary-setter' },
      { id: 'c4', text: 'Use it as leverage with other schools', delta: { hype: 15, reputation: -10, stress: 15 }, tooltip: '+Hype, -Reputation, +Stress' },
    ],
  },
  {
    id: 'midday-4',
    stage: 'midday',
    title: 'The Journalist',
    narrative: `A national reporter wants 15 minutes. "Just background, off the record." But you've seen how "off the record" works in this business. He's written hit pieces before. He's also broken positive stories that changed careers. The interview could define your narrative—or derail it.`,
    messages: [
      { id: generateId(), type: 'media', sender: 'Pete Thamel - ESPN', subject: 'Quick Chat?', preview: 'Working on a portal series. Your story is interesting...' },
      { id: generateId(), type: 'agent', sender: 'Your Agent', subject: 'Media Advisory', preview: 'Saw the ESPN request. Let me handle it.' },
      { id: generateId(), type: 'teammate', sender: 'James (Former Teammate)', subject: 'Heads up', preview: 'That reporter burned my boy last year. Be careful.' },
    ],
    choices: [
      { id: 'c1', text: 'Do the interview, control your story', delta: { reputation: 20, hype: 15, stress: 15 }, tooltip: '+Reputation, +Hype, +Stress', setsFlag: 'media-savvy' },
      { id: 'c2', text: 'Decline politely, stay focused', delta: { stress: -10, hype: -10, energy: 5 }, tooltip: '-Stress, -Hype, +Energy', setsFlag: 'media-shy' },
      { id: 'c3', text: 'Have your agent give a statement instead', delta: { reputation: 5, stress: -5, hype: 5 }, tooltip: '+Reputation, -Stress, +Hype' },
      { id: 'c4', text: 'Agree but prepare extensively first', delta: { reputation: 15, energy: -15, stress: 10 }, tooltip: '+Reputation, -Energy, +Stress' },
    ],
  },
  {
    id: 'midday-5',
    stage: 'midday',
    title: 'Doubt Creeps In',
    narrative: `In a quiet moment between calls, it hits you. What if this was a mistake? Your old room is still there. Your old teammates are practicing without you. A coach from your current school texts: "Door's still open. 48 hours." Is the grass really greener, or just different?`,
    messages: [
      { id: generateId(), type: 'coach', sender: 'Coach Adams (Current School)', subject: 'Real Talk', preview: 'I get it. But think about what we\'re building here...' },
      { id: generateId(), type: 'family', sender: 'Grandpa', subject: 'Old Wisdom', preview: 'Whatever you decide, make sure it\'s YOUR decision.' },
      { id: generateId(), type: 'teammate', sender: 'Best Friend (Teammate)', subject: 'Miss You', preview: 'Not trying to influence you, but it\'s weird without you here.' },
    ],
    choices: [
      { id: 'c1', text: 'Consider returning to your current school', delta: { fit: -15, stress: -20, hype: -25 }, tooltip: '-Fit, -Stress, -Hype', setsFlag: 'considered-return' },
      { id: 'c2', text: 'Recommit to the process, push forward', delta: { stress: 10, hype: 10, energy: -5 }, tooltip: '+Stress, +Hype, -Energy', setsFlag: 'all-in' },
      { id: 'c3', text: 'Take a walk, clear your head', delta: { stress: -15, energy: 15, fit: 5 }, tooltip: '-Stress, +Energy, +Fit' },
      { id: 'c4', text: 'Call your mentor for perspective', delta: { fit: 10, stress: -10, reputation: 5 }, tooltip: '+Fit, -Stress, +Reputation', setsFlag: 'mentor-guided' },
    ],
  },
];

// Afternoon Scenes
const afternoonScenes: Scene[] = [
  {
    id: 'afternoon-1',
    stage: 'afternoon',
    title: 'The Virtual Visit',
    narrative: `A coaching staff has set up an elaborate virtual tour. Drone footage of the stadium. Player testimonials. NIL representatives with charts. The strength coach flexes about his NFL connections. It's impressive, maybe too polished. But when a current player joins and the coaches leave, he whispers: "Ask about the depth chart. Really ask."`,
    messages: [
      { id: generateId(), type: 'coach', sender: 'Coach Mitchell - Penn State', subject: 'Tour Complete!', preview: 'What did you think? Ready to be a Nittany Lion?', tier: 'power5' },
      { id: generateId(), type: 'teammate', sender: 'Current Player (PSU)', subject: 'Real Talk', preview: 'Between us, there\'s something you should know...' },
      { id: generateId(), type: 'agent', sender: 'Your Agent', subject: 'Penn State NIL', preview: 'Their collective is legit. Top 10 in the country.' },
    ],
    choices: [
      { id: 'c1', text: 'Follow up with the player privately', delta: { fit: 20, stress: 10, hype: -5 }, tooltip: '+Fit, +Stress, -Hype', setsFlag: 'insider-info' },
      { id: 'c2', text: 'Trust the presentation, move forward', delta: { hype: 15, fit: -10, stress: -5 }, tooltip: '+Hype, -Fit, -Stress' },
      { id: 'c3', text: 'Ask tough questions directly to coaches', delta: { reputation: 15, stress: 15, fit: 10 }, tooltip: '+Reputation, +Stress, +Fit' },
      { id: 'c4', text: 'Request an in-person visit before deciding', delta: { fit: 15, energy: -10, stress: 5 }, tooltip: '+Fit, -Energy, +Stress', setsFlag: 'needs-visit' },
    ],
  },
  {
    id: 'afternoon-2',
    stage: 'afternoon',
    title: 'The Scholarship Details',
    narrative: `Time to talk specifics. One school offers a full ride with cost of living. Another offers a scholarship but the NIL is "still being worked out." A third guarantees NIL but the academic advisor mentions you'd need to change majors. The fine print matters more than the headlines.`,
    messages: [
      { id: generateId(), type: 'coach', sender: 'Coach Johnson - Oklahoma State', subject: 'Scholarship Breakdown', preview: 'Full boat: tuition, room, board, and our NIL collective...', tier: 'power5' },
      { id: generateId(), type: 'family', sender: 'Mom', subject: 'Academics?', preview: 'Have you asked about their graduation rates?' },
      { id: generateId(), type: 'agent', sender: 'Academic Advisor', subject: 'Curriculum Note', preview: 'Just a heads up about credit transfers...' },
    ],
    choices: [
      { id: 'c1', text: 'Prioritize the guaranteed full package', delta: { fit: 15, stress: -10, hype: -5 }, tooltip: '+Fit, -Stress, -Hype', setsFlag: 'security-first' },
      { id: 'c2', text: 'Bet on the bigger NIL potential', delta: { hype: 20, stress: 15, fit: -10 }, tooltip: '+Hype, +Stress, -Fit', setsFlag: 'high-upside' },
      { id: 'c3', text: 'Focus on academics and development', delta: { fit: 20, reputation: 10, hype: -15 }, tooltip: '+Fit, +Reputation, -Hype', setsFlag: 'student-first' },
      { id: 'c4', text: 'Use offers as leverage for better terms', delta: { hype: 10, reputation: -5, stress: 15 }, tooltip: '+Hype, -Reputation, +Stress' },
    ],
  },
  {
    id: 'afternoon-3',
    stage: 'afternoon',
    title: 'Social Media Storm',
    narrative: `Someone leaked your "top 3" schools before you even finalized them. Twitter is running wild with speculation. Fans are already making edits of you in different jerseys. One fanbase is claiming you as a lock; another is calling you overrated. Your mentions are a warzone.`,
    messages: [
      { id: generateId(), type: 'social', sender: '@UGAFootball', subject: 'Welcome?', preview: 'Can\'t wait to see you in red and black! 🔴⚫' },
      { id: generateId(), type: 'social', sender: '@HaterAccount', subject: 'Overrated', preview: 'Lol this guy thinks he\'s better than he is...' },
      { id: generateId(), type: 'agent', sender: 'Your Agent', subject: 'PR Emergency', preview: 'We need to get ahead of this narrative.' },
      { id: generateId(), type: 'media', sender: 'Bleacher Report', subject: 'Comment Request', preview: 'Want to address the rumors?' },
    ],
    choices: [
      { id: 'c1', text: 'Post an official update, take control', delta: { hype: 15, reputation: 10, stress: -10 }, tooltip: '+Hype, +Reputation, -Stress', setsFlag: 'controlled-narrative' },
      { id: 'c2', text: 'Stay silent, don\'t feed the beast', delta: { stress: -15, hype: -10, energy: 10 }, tooltip: '-Stress, -Hype, +Energy' },
      { id: 'c3', text: 'Clap back at the haters', delta: { hype: 20, reputation: -15, stress: 20 }, tooltip: '+Hype, -Reputation, +Stress', setsFlag: 'clapped-back' },
      { id: 'c4', text: 'Use it to your advantage, tease multiple schools', delta: { hype: 25, fit: -15, reputation: -5 }, tooltip: '+Hype, -Fit, -Reputation', setsFlag: 'played-the-game' },
    ],
  },
  {
    id: 'afternoon-4',
    stage: 'afternoon',
    title: 'The Unofficial Offer',
    narrative: `A Group of 5 school slides into your DMs with something interesting: they can't match the NIL of the big boys, but they're offering a leadership role, guaranteed starts, and a coaching staff that's sent 8 players to the NFL in 5 years. "We make players here," the coach says. "We don't just collect them."`,
    messages: [
      { id: generateId(), type: 'coach', sender: 'Coach Perry - Appalachian State', subject: 'Different Path', preview: 'The portal is full of guys chasing names. We chase development.', tier: 'group5' },
      { id: generateId(), type: 'agent', sender: 'Your Agent', subject: 'Thoughts?', preview: 'App State is interesting. Lower profile but real NFL pipeline.' },
      { id: generateId(), type: 'family', sender: 'Dad', subject: 'Saw the App State thing', preview: 'Sometimes the best move isn\'t the flashiest.' },
    ],
    choices: [
      { id: 'c1', text: 'Seriously consider the underdog offer', delta: { fit: 25, hype: -20, reputation: 5 }, tooltip: '+Fit, -Hype, +Reputation', setsFlag: 'underdog-path' },
      { id: 'c2', text: 'Politely decline, stay focused on Power 5', delta: { hype: 10, fit: -10, stress: 5 }, tooltip: '+Hype, -Fit, +Stress' },
      { id: 'c3', text: 'Use it as leverage with bigger schools', delta: { hype: 5, reputation: -10, stress: 10 }, tooltip: '+Hype, -Reputation, +Stress' },
      { id: 'c4', text: 'Ask for time to think it through', delta: { stress: 5, fit: 10, energy: -5 }, tooltip: '+Stress, +Fit, -Energy' },
    ],
  },
  {
    id: 'afternoon-5',
    stage: 'afternoon',
    title: 'The Competitor Commits',
    narrative: `Breaking news: a player at your position—same rating, same region—just committed to one of your top choices. The same school that was promising you the starting job. Your phone blows up. "You still in the mix?" "Did you know about this?" The landscape just shifted.`,
    messages: [
      { id: generateId(), type: 'media', sender: '@On3Sports', subject: 'BREAKING', preview: '⚡️ [Rival] commits to [Your Top School]. Where does this leave...' },
      { id: generateId(), type: 'coach', sender: 'Coach from Top School', subject: 'Still Want You', preview: 'Nothing changes. We want you both. Competition makes champions.' },
      { id: generateId(), type: 'agent', sender: 'Your Agent', subject: 'Pivot?', preview: 'We might need to recalibrate. Other schools are calling.' },
    ],
    choices: [
      { id: 'c1', text: 'Double down, embrace the competition', delta: { hype: 15, stress: 20, fit: -10 }, tooltip: '+Hype, +Stress, -Fit', setsFlag: 'competitive' },
      { id: 'c2', text: 'Shift focus to backup options', delta: { fit: 15, hype: -15, stress: -5 }, tooltip: '+Fit, -Hype, -Stress', setsFlag: 'adaptive' },
      { id: 'c3', text: 'Question the coach\'s honesty', delta: { reputation: 10, stress: 15, fit: -5 }, tooltip: '+Reputation, +Stress, -Fit' },
      { id: 'c4', text: 'Use it as motivation, work out harder', delta: { energy: -20, hype: 10, reputation: 10 }, tooltip: '-Energy, +Hype, +Reputation' },
    ],
  },
];

// Night Scenes
const nightScenes: Scene[] = [
  {
    id: 'night-1',
    stage: 'night',
    title: 'The Final Pitch',
    narrative: `It's 9 PM. One coach has called three times today. "I need to know tonight. We're moving to other candidates at midnight." Is it pressure tactics or genuine urgency? The offer is solid. The fit is... good enough? But "good enough" isn't what you entered the portal for.`,
    messages: [
      { id: generateId(), type: 'coach', sender: 'Coach Williams - Colorado', subject: 'Last Call', preview: 'I\'ve never wanted a player more. But I can\'t wait forever.', tier: 'power5' },
      { id: generateId(), type: 'family', sender: 'Mom', subject: 'Sleep on it', preview: 'Don\'t let anyone rush you into the biggest decision of your life.' },
      { id: generateId(), type: 'agent', sender: 'Your Agent', subject: 'Deadline', preview: 'Colorado is real. But so are Miami and USC tomorrow.' },
    ],
    choices: [
      { id: 'c1', text: 'Commit on the spot, trust your gut', delta: { stress: -20, hype: 25, fit: 5 }, tooltip: '-Stress, +Hype, +Fit', setsFlag: 'quick-commit' },
      { id: 'c2', text: 'Call the bluff, ask for more time', delta: { stress: 15, reputation: 15, fit: 10 }, tooltip: '+Stress, +Reputation, +Fit', setsFlag: 'held-firm' },
      { id: 'c3', text: 'Walk away from the pressure', delta: { fit: -10, stress: -10, reputation: 10 }, tooltip: '-Fit, -Stress, +Reputation', setsFlag: 'walked-away' },
      { id: 'c4', text: 'Counter with your own demands', delta: { hype: 10, stress: 20, reputation: -5 }, tooltip: '+Hype, +Stress, -Reputation' },
    ],
  },
  {
    id: 'night-2',
    stage: 'night',
    title: 'Family Council',
    narrative: `The living room is tense. Dad has a spreadsheet. Mom has concerns. Your sister thinks you should "follow your heart." Your brother is refreshing Twitter. Everyone has an opinion, and they're all different. This is your decision, but it affects everyone.`,
    messages: [
      { id: generateId(), type: 'family', sender: 'Dad', subject: 'The Numbers', preview: 'I ran the scenarios. Option A makes sense financially...' },
      { id: generateId(), type: 'family', sender: 'Sister', subject: 'Heart First', preview: 'Forget the money. Where do you feel at HOME?' },
      { id: generateId(), type: 'family', sender: 'Childhood Coach', subject: 'Proud of You', preview: 'Whatever you choose, you\'ve already made it further than most.' },
    ],
    choices: [
      { id: 'c1', text: 'Go with dad\'s logical choice', delta: { fit: 15, stress: -10, hype: -10 }, tooltip: '+Fit, -Stress, -Hype', setsFlag: 'logical-choice' },
      { id: 'c2', text: 'Follow your sister\'s heart advice', delta: { fit: 10, hype: 15, stress: 5 }, tooltip: '+Fit, +Hype, +Stress', setsFlag: 'heart-choice' },
      { id: 'c3', text: 'Make the decision alone, in your room', delta: { stress: 20, reputation: 5, energy: -10 }, tooltip: '+Stress, +Reputation, -Energy', setsFlag: 'solo-decision' },
      { id: 'c4', text: 'Ask everyone to trust you without explaining', delta: { stress: -5, reputation: 10, fit: 5 }, tooltip: '-Stress, +Reputation, +Fit' },
    ],
  },
  {
    id: 'night-3',
    stage: 'night',
    title: 'The Recruiter\'s Truth',
    narrative: `A former player from one of your top schools DMs you at 10 PM. "Off the record? The coach is getting fired. NIL collective is broke. Don't come here." It's explosive information—but is it true? And what do you do with it?`,
    messages: [
      { id: generateId(), type: 'teammate', sender: 'Anonymous Player', subject: 'DON\'T COMMIT', preview: 'I can\'t say who I am but trust me. This place is falling apart.' },
      { id: generateId(), type: 'coach', sender: 'Suspicious School', subject: 'Excited for Tomorrow!', preview: 'Can\'t wait to welcome you to the family!' },
      { id: generateId(), type: 'agent', sender: 'Your Agent', subject: 'Rumor Check', preview: 'Hearing some noise about that program. Investigating.' },
    ],
    choices: [
      { id: 'c1', text: 'Trust the insider, cross them off the list', delta: { fit: 15, hype: -15, stress: -10 }, tooltip: '+Fit, -Hype, -Stress', setsFlag: 'trusted-insider' },
      { id: 'c2', text: 'Investigate further before deciding', delta: { stress: 15, fit: 10, energy: -10 }, tooltip: '+Stress, +Fit, -Energy', setsFlag: 'due-diligence' },
      { id: 'c3', text: 'Ignore it, could be a jealous rival', delta: { stress: -5, fit: -10, hype: 5 }, tooltip: '-Stress, -Fit, +Hype' },
      { id: 'c4', text: 'Confront the coach directly about the rumors', delta: { reputation: 20, stress: 20, fit: 5 }, tooltip: '+Reputation, +Stress, +Fit', setsFlag: 'confrontational' },
    ],
  },
  {
    id: 'night-4',
    stage: 'night',
    title: 'The Deadline Decision',
    narrative: `It's 11:30 PM. Tomorrow, you need an answer—for them, for yourself, for your sanity. The whiteboard on your wall has two schools left. The pros and cons are balanced. The heart and head disagree. In 30 minutes, the portal day ends. What do you do?`,
    messages: [
      { id: generateId(), type: 'coach', sender: 'School A', subject: 'Ready When You Are', preview: 'No pressure. We just want the best for you.' },
      { id: generateId(), type: 'coach', sender: 'School B', subject: 'Last Chance', preview: 'Our other target commits at midnight. Need to know.' },
      { id: generateId(), type: 'family', sender: 'Mom', subject: '❤️', preview: 'Whatever you choose, we\'re proud of you.' },
    ],
    choices: [
      { id: 'c1', text: 'Choose the patient school (School A)', delta: { fit: 20, hype: -5, stress: -15 }, tooltip: '+Fit, -Hype, -Stress', setsFlag: 'patient-choice' },
      { id: 'c2', text: 'Choose the urgent school (School B)', delta: { hype: 20, fit: -5, stress: -10 }, tooltip: '+Hype, -Fit, -Stress', setsFlag: 'urgent-choice' },
      { id: 'c3', text: 'Flip a coin—let fate decide', delta: { stress: -20, reputation: -10, fit: 0 }, tooltip: '-Stress, -Reputation', setsFlag: 'coin-flip' },
      { id: 'c4', text: 'Ask for one more day from both', delta: { stress: 25, reputation: -5, fit: 5 }, tooltip: '+Stress, -Reputation, +Fit', setsFlag: 'delayed' },
    ],
  },
  {
    id: 'night-5',
    stage: 'night',
    title: 'The Quiet Moment',
    narrative: `Everyone's asleep. The house is quiet. Your phone is finally silent. In the dark, you pull up the highlight reel you made in high school—before scholarships, before pressure, before the portal. That kid just loved the game. Do you still?`,
    messages: [
      { id: generateId(), type: 'social', sender: 'Memory Notification', subject: '3 Years Ago Today', preview: 'Your first varsity touchdown. 247 likes.' },
      { id: generateId(), type: 'family', sender: 'Note to Self', subject: 'Why I Play', preview: 'A journal entry from freshman year...' },
      { id: generateId(), type: 'coach', sender: 'First Coach Ever', subject: 'Saw the News', preview: 'Remember what I told you? Play for love, not for likes.' },
    ],
    choices: [
      { id: 'c1', text: 'Choose the school that feels like home', delta: { fit: 25, hype: -10, stress: -20 }, tooltip: '+Fit, -Hype, -Stress', setsFlag: 'home-choice' },
      { id: 'c2', text: 'Choose the school that maximizes potential', delta: { hype: 20, fit: -5, stress: -5 }, tooltip: '+Hype, -Fit, -Stress', setsFlag: 'potential-choice' },
      { id: 'c3', text: 'Realize you need more time, stay in portal', delta: { stress: 10, fit: -10, energy: 15 }, tooltip: '+Stress, -Fit, +Energy', setsFlag: 'stayed-in-portal' },
      { id: 'c4', text: 'Sleep on it, trust tomorrow\'s clarity', delta: { energy: 20, stress: -15, fit: 5 }, tooltip: '+Energy, -Stress, +Fit', setsFlag: 'slept-on-it' },
    ],
  },
];

// Rare Events
const rareEvents: Scene[] = [
  {
    id: 'rare-power5-surprise',
    stage: 'afternoon',
    title: 'BREAKING: Power 5 Surprise',
    narrative: `Your phone explodes. A blue-blood program that wasn't even recruiting you just entered the chat. "We've been watching from afar. Scholarship and starting role. But we need an answer in 24 hours." Out of nowhere, everything changes.`,
    messages: [
      { id: generateId(), type: 'coach', sender: 'Coach Saban Jr. - Alabama', subject: 'PRIORITY', preview: 'I don\'t usually do this. But you\'re special.', tier: 'power5' },
      { id: generateId(), type: 'media', sender: '@CFBInsider', subject: 'WHOA', preview: 'Just got word Alabama is ALL IN on...' },
      { id: generateId(), type: 'agent', sender: 'Your Agent', subject: '!!!', preview: 'DROP EVERYTHING. CALL ME NOW.' },
    ],
    choices: [
      { id: 'c1', text: 'All in—this is the dream', delta: { hype: 35, stress: 25, fit: -10 }, tooltip: '+Hype, +Stress, -Fit', setsFlag: 'blueblood-bound' },
      { id: 'c2', text: 'Slow down, this feels too fast', delta: { fit: 15, stress: 10, hype: -5 }, tooltip: '+Fit, +Stress, -Hype' },
      { id: 'c3', text: 'Use this to negotiate with current top choice', delta: { hype: 20, reputation: -10, stress: 15 }, tooltip: '+Hype, -Reputation, +Stress' },
      { id: 'c4', text: 'Honor your original commitments', delta: { reputation: 25, hype: -20, fit: 10 }, tooltip: '+Reputation, -Hype, +Fit', setsFlag: 'honorable' },
    ],
    isRare: true,
    rareChance: 0.12,
  },
  {
    id: 'rare-nil-fallthrough',
    stage: 'midday',
    title: 'NIL Deal Falls Through',
    narrative: `The call comes at the worst time. The NIL collective that promised you six figures? Their primary donor backed out. "We can still do something, but it's going to be... significantly less." Your whole plan just got a lot more complicated.`,
    messages: [
      { id: generateId(), type: 'agent', sender: 'NIL Collective', subject: 'Urgent Update', preview: 'We need to talk. There\'s been a development...' },
      { id: generateId(), type: 'coach', sender: 'Affected School', subject: 'Still Want You', preview: 'The NIL situation is... changing. But we believe in you.' },
      { id: generateId(), type: 'family', sender: 'Dad', subject: 'Saw the News', preview: 'Money comes and goes. Make the right decision for YOU.' },
    ],
    choices: [
      { id: 'c1', text: 'Stick with them anyway, it\'s about football', delta: { fit: 20, hype: -25, reputation: 15 }, tooltip: '+Fit, -Hype, +Reputation', setsFlag: 'loyal-despite-nil' },
      { id: 'c2', text: 'Walk away, they broke a promise', delta: { stress: 15, hype: -10, fit: -15 }, tooltip: '+Stress, -Hype, -Fit', setsFlag: 'nil-burned' },
      { id: 'c3', text: 'Renegotiate, find a middle ground', delta: { stress: 20, reputation: 10, fit: 5 }, tooltip: '+Stress, +Reputation, +Fit' },
      { id: 'c4', text: 'Use this to explore other options guilt-free', delta: { hype: 10, stress: -5, fit: 5 }, tooltip: '+Hype, -Stress, +Fit' },
    ],
    isRare: true,
    rareChance: 0.10,
  },
  {
    id: 'rare-family-advice',
    stage: 'morning',
    title: 'Voice from the Past',
    narrative: `A number you don't recognize. You answer. It's an NFL player from your hometown—someone you idolized as a kid. "I was in the portal once. Almost made the wrong choice. Can I tell you what I wish someone told me?"`,
    messages: [
      { id: generateId(), type: 'family', sender: 'NFL Legend', subject: 'Incoming Call', preview: '[Missed Call] from a number you should answer...' },
      { id: generateId(), type: 'social', sender: '@LocalKid', subject: 'OMG', preview: 'Did [NFL Legend] really just call you?!' },
    ],
    choices: [
      { id: 'c1', text: 'Listen to every word', delta: { fit: 20, stress: -20, reputation: 10 }, tooltip: '+Fit, -Stress, +Reputation', setsFlag: 'mentor-moment' },
      { id: 'c2', text: 'Politely decline—this is your journey', delta: { stress: 5, reputation: 5, energy: 5 }, tooltip: '+Stress, +Reputation, +Energy' },
      { id: 'c3', text: 'Ask them to connect you with their agent', delta: { hype: 15, reputation: -5, stress: 10 }, tooltip: '+Hype, -Reputation, +Stress' },
      { id: 'c4', text: 'Thank them and share on social media', delta: { hype: 25, reputation: -15, stress: 5 }, tooltip: '+Hype, -Reputation, +Stress', setsFlag: 'clout-chaser' },
    ],
    isRare: true,
    rareChance: 0.15,
  },
  {
    id: 'rare-teammate-recruit',
    stage: 'afternoon',
    title: 'Old Teammate Pitch',
    narrative: `Your best friend from high school—now a starter at a mid-major—calls unexpectedly. "Our coach told me to call you. We're building something real here. And I already know we work well together. Think about it."`,
    messages: [
      { id: generateId(), type: 'teammate', sender: 'Best Friend (HS)', subject: 'Hear Me Out', preview: 'I know it\'s not the flashiest offer, but...' },
      { id: generateId(), type: 'coach', sender: 'Coach Jackson - Tulane', subject: 'Unique Opportunity', preview: 'Your friend speaks highly of you. Let\'s talk.', tier: 'group5' },
    ],
    choices: [
      { id: 'c1', text: 'Add them to your serious list', delta: { fit: 25, hype: -15, stress: -10 }, tooltip: '+Fit, -Hype, -Stress', setsFlag: 'reunion-possible' },
      { id: 'c2', text: 'Appreciate it, but you\'ve moved on', delta: { hype: 5, stress: 5, fit: -10 }, tooltip: '+Hype, +Stress, -Fit' },
      { id: 'c3', text: 'Visit before deciding anything', delta: { fit: 15, energy: -15, stress: 5 }, tooltip: '+Fit, -Energy, +Stress' },
      { id: 'c4', text: 'Let nostalgia guide you—commit on the spot', delta: { fit: 10, hype: -25, stress: -20 }, tooltip: '+Fit, -Hype, -Stress', setsFlag: 'nostalgia-commit' },
    ],
    isRare: true,
    rareChance: 0.12,
  },
];

export const allScenes: Scene[] = [
  ...morningScenes,
  ...middayScenes,
  ...afternoonScenes,
  ...nightScenes,
  ...rareEvents,
];

export function getRandomScene(stage: Stage, usedSceneIds: string[]): Scene {
  const stageScenes = allScenes.filter(
    (s) => s.stage === stage && !usedSceneIds.includes(s.id)
  );

  // Check for rare events first
  const rareScenes = stageScenes.filter((s) => s.isRare);
  for (const rare of rareScenes) {
    if (Math.random() < (rare.rareChance || 0.1)) {
      return rare;
    }
  }

  // Otherwise pick a normal scene
  const normalScenes = stageScenes.filter((s) => !s.isRare);
  if (normalScenes.length === 0) {
    return stageScenes[Math.floor(Math.random() * stageScenes.length)];
  }
  return normalScenes[Math.floor(Math.random() * normalScenes.length)];
}
