import React from 'react';
import { SkillNode } from '@/lib/gameTypes';
import { ArrowLeft, Lock, Check, Zap } from 'lucide-react';

interface SkillTreeScreenProps {
  skillTree: SkillNode[];
  skillPoints: number;
  onUnlock: (skillId: string) => void;
  onBack: () => void;
}

export const SkillTreeScreen: React.FC<SkillTreeScreenProps> = ({
  skillTree,
  skillPoints,
  onUnlock,
  onBack,
}) => {
  const isAvailable = (skill: SkillNode): boolean => {
    if (skill.unlocked) return false;
    if (skillPoints < skill.cost) return false;
    return skill.requires.every(
      reqId => skillTree.find(s => s.id === reqId)?.unlocked
    );
  };

  // Group skills by tier
  const tier1 = skillTree.filter(s => s.requires.length === 0);
  const tier2 = skillTree.filter(s => s.requires.length === 1);
  const tier3 = skillTree.filter(s => s.requires.length > 1 || (s.requires.length === 1 && tier2.some(t => t.id === s.requires[0])));

  const renderSkillNode = (skill: SkillNode) => {
    const available = isAvailable(skill);
    const requirementsMet = skill.requires.every(
      reqId => skillTree.find(s => s.id === reqId)?.unlocked
    );

    return (
      <button
        key={skill.id}
        onClick={() => available && onUnlock(skill.id)}
        disabled={!available}
        className={`
          relative p-4 rounded-xl border-2 transition-all duration-300
          w-full max-w-[160px]
          ${skill.unlocked
            ? 'skill-node unlocked border-primary'
            : available
            ? 'skill-node available border-accent cursor-pointer hover:scale-105'
            : requirementsMet
            ? 'skill-node border-border/50 cursor-not-allowed opacity-60'
            : 'skill-node border-border/30 cursor-not-allowed opacity-40'
          }
        `}
      >
        {/* Icon */}
        <div className="text-3xl mb-2">{skill.icon}</div>
        
        {/* Name */}
        <div className="font-display text-sm text-foreground mb-1">
          {skill.name}
        </div>
        
        {/* Description */}
        <div className="text-xs text-muted-foreground font-mono">
          {skill.description}
        </div>
        
        {/* Cost / Status */}
        <div className="absolute top-2 right-2">
          {skill.unlocked ? (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          ) : !requirementsMet ? (
            <Lock className="w-4 h-4 text-muted-foreground" />
          ) : (
            <div className="flex items-center gap-1 text-xs font-mono text-accent">
              <Zap className="w-3 h-3" />
              {skill.cost}
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-auto">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-muted -z-10" />
      
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg neon-button font-display"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
            <span className="text-primary">BACK</span>
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-accent">
            <Zap className="w-5 h-5 text-accent" />
            <span className="font-display text-accent">
              {skillPoints} SKILL POINT{skillPoints !== 1 ? 'S' : ''}
            </span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center text-primary neon-text mb-8">
          SKILL TREE
        </h1>
        
        {/* Skill Tree Grid */}
        <div className="space-y-8">
          {/* Tier 1 - Base Skills */}
          <div>
            <div className="text-center text-muted-foreground text-xs font-mono mb-4">
              TIER 1 — BASE SKILLS
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {tier1.map(renderSkillNode)}
            </div>
          </div>
          
          {/* Connection lines visual */}
          <div className="flex justify-center">
            <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
          </div>
          
          {/* Tier 2 - Advanced Skills */}
          <div>
            <div className="text-center text-muted-foreground text-xs font-mono mb-4">
              TIER 2 — ADVANCED
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {tier2.map(renderSkillNode)}
            </div>
          </div>
          
          {/* Connection lines visual */}
          <div className="flex justify-center">
            <div className="w-px h-8 bg-gradient-to-b from-secondary/50 to-transparent" />
          </div>
          
          {/* Tier 3 - Master Skills */}
          {tier3.length > 0 && (
            <div>
              <div className="text-center text-muted-foreground text-xs font-mono mb-4">
                TIER 3 — MASTERY
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {tier3.map(renderSkillNode)}
              </div>
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="mt-12 p-4 rounded-xl bg-card/30 border border-border max-w-lg mx-auto">
          <div className="text-center text-muted-foreground text-xs font-mono mb-3">LEGEND</div>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-primary bg-primary/30" />
              <span className="text-muted-foreground font-mono">Unlocked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-accent animate-pulse" />
              <span className="text-muted-foreground font-mono">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-border/50 opacity-60" />
              <span className="text-muted-foreground font-mono">Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
