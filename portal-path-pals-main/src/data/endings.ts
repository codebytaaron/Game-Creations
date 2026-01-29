import { Ending, Stats } from '@/types/game';

export const endings: Ending[] = [
  {
    id: 'quiet-commit',
    label: 'The Quiet Commit',
    description: 'You navigated the chaos with grace. Low stress, solid fit, minimal drama. You found a home without making headlines—and sometimes, that\'s the best outcome. The real work starts now.',
    requirements: {
      stats: {
        stress: { max: 40 },
        fit: { min: 60 },
        hype: { max: 50 },
      },
    },
    priority: 10,
  },
  {
    id: 'big-splash',
    label: 'Big Splash, Big Risk',
    description: 'You went for the biggest stage, the brightest lights. The hype is real, but so is the pressure. You\'ll either be a legend or a cautionary tale. No in-between.',
    requirements: {
      stats: {
        hype: { min: 80 },
        stress: { min: 50 },
      },
    },
    priority: 20,
  },
  {
    id: 'burned-out',
    label: 'Burned Out',
    description: 'The portal took everything out of you. By the end, you were running on fumes, making decisions just to make them stop. You committed, but you\'re not sure why. Recovery will take time.',
    requirements: {
      stats: {
        stress: { min: 80 },
        energy: { max: 30 },
      },
    },
    priority: 30,
  },
  {
    id: 'late-surprise',
    label: 'Late Offer Surprise',
    description: 'Just when you thought the window was closing, lightning struck. A program you never expected came calling, and you took the leap. Fortune favors the bold—or the lucky.',
    requirements: {
      flags: ['blueblood-bound'],
    },
    priority: 25,
  },
  {
    id: 'player-first',
    label: 'The Player\'s Player',
    description: 'You prioritized fit and development over flash and cash. Coaches describe you as "mature beyond your years." The NFL scouts are already taking notes.',
    requirements: {
      stats: {
        fit: { min: 75 },
        reputation: { min: 70 },
      },
      flags: ['student-first'],
    },
    priority: 15,
  },
  {
    id: 'nil-king',
    label: 'The NIL King',
    description: 'You maximized every dollar, leveraged every offer, played the game like a CEO. Whether you\'ll ball out on the field as well as the bank account... that\'s still TBD.',
    requirements: {
      stats: {
        hype: { min: 70 },
      },
      flags: ['big-nil'],
    },
    priority: 18,
  },
  {
    id: 'underdog-story',
    label: 'The Underdog Story',
    description: 'You chose substance over style, going where you were wanted most. The spotlight isn\'t as bright, but the opportunity is real. Chip on your shoulder, everything to prove.',
    requirements: {
      stats: {
        fit: { min: 65 },
        hype: { max: 40 },
      },
      flags: ['underdog-path'],
    },
    priority: 16,
  },
  {
    id: 'controversial',
    label: 'The Controversial Figure',
    description: 'You made waves, burned bridges, and probably tweeted some things you\'ll regret. Your name is known—just not always for the right reasons. Talent talks, but so does baggage.',
    requirements: {
      stats: {
        reputation: { max: 35 },
        hype: { min: 60 },
      },
      flags: ['controversial'],
    },
    priority: 22,
  },
  {
    id: 'family-first',
    label: 'Family First',
    description: 'In the end, the people who knew you longest knew you best. You chose stability, proximity, and love over prestige. Mom\'s happy. Dad\'s proud. You\'re at peace.',
    requirements: {
      stats: {
        stress: { max: 50 },
        fit: { min: 55 },
      },
      flags: ['family-support', 'logical-choice'],
    },
    priority: 14,
  },
  {
    id: 'still-searching',
    label: 'Still Searching',
    description: 'The day ended without a decision. You\'re still in the portal, still weighing options, still uncertain. It\'s not failure—it\'s patience. Or maybe it\'s paralysis. Only time will tell.',
    requirements: {
      flags: ['stayed-in-portal'],
    },
    priority: 28,
  },
  {
    id: 'honor-bound',
    label: 'The Honorable Commit',
    description: 'When the flashier offer came, you stayed true to your word. Coaches across the country took note. In a world of broken promises, you kept yours. Respect earned.',
    requirements: {
      stats: {
        reputation: { min: 75 },
      },
      flags: ['honorable'],
    },
    priority: 12,
  },
  {
    id: 'coin-flip-chaos',
    label: 'Fate\'s Coin Flip',
    description: 'You literally left your future to chance. Heads or tails? Who knows. But here you are, committed to a school because a quarter said so. At least you\'ll never second-guess yourself.',
    requirements: {
      flags: ['coin-flip'],
    },
    priority: 35,
  },
  {
    id: 'reunion-tour',
    label: 'The Reunion Tour',
    description: 'You\'re teaming up with your old best friend at a place that feels like home. The chemistry is already there. The vibes are immaculate. Sometimes the best stories are written with familiar faces.',
    requirements: {
      flags: ['reunion-possible', 'nostalgia-commit'],
    },
    priority: 13,
  },
  {
    id: 'calculated-climb',
    label: 'The Calculated Climb',
    description: 'Every decision was data-driven, every move strategic. You optimized for development, playing time, and long-term success. The spreadsheet said yes, and so did you.',
    requirements: {
      stats: {
        fit: { min: 70 },
        stress: { max: 50 },
        reputation: { min: 60 },
      },
      notFlags: ['coin-flip', 'controversial', 'clapped-back'],
    },
    priority: 8,
  },
  {
    id: 'default',
    label: 'Portal Survivor',
    description: 'You made it through the gauntlet. Not without scars, not without stories. You committed somewhere—or maybe you\'re still figuring it out. But you survived the portal. Now, go earn it.',
    requirements: {},
    priority: 100, // lowest priority, always fallback
  },
];

export function determineEnding(stats: Stats, flags: string[]): Ending {
  const qualifying = endings.filter((ending) => {
    // Check stat requirements
    if (ending.requirements.stats) {
      for (const [stat, req] of Object.entries(ending.requirements.stats)) {
        const value = stats[stat as keyof Stats];
        if (req.min !== undefined && value < req.min) return false;
        if (req.max !== undefined && value > req.max) return false;
      }
    }

    // Check required flags
    if (ending.requirements.flags) {
      for (const flag of ending.requirements.flags) {
        if (!flags.includes(flag)) return false;
      }
    }

    // Check forbidden flags
    if (ending.requirements.notFlags) {
      for (const flag of ending.requirements.notFlags) {
        if (flags.includes(flag)) return false;
      }
    }

    return true;
  });

  // Sort by priority (lower = higher priority) and return the first
  qualifying.sort((a, b) => a.priority - b.priority);
  return qualifying[0] || endings.find((e) => e.id === 'default')!;
}
