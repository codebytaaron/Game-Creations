import React from 'react';

interface BackgroundProps {
  scrollY: number;
}

export const Background: React.FC<BackgroundProps> = ({ scrollY }) => {
  // Parallax effect - different layers move at different speeds
  const cloudOffset1 = (scrollY * 0.1) % 800;
  const cloudOffset2 = (scrollY * 0.15) % 800;
  const mountainOffset = scrollY * 0.05;
  
  return (
    <div className="absolute inset-0 overflow-hidden game-gradient">
      {/* Sun/Moon */}
      <div 
        className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-gold-light to-gold shadow-lg"
        style={{
          right: '10%',
          top: 50 + (scrollY * 0.02) % 100,
        }}
      >
        <div className="absolute inset-2 rounded-full bg-gold-light/50" />
      </div>
      
      {/* Far mountains */}
      <svg 
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        style={{ 
          height: '50%',
          transform: `translateY(${mountainOffset % 50}px)`,
        }}
      >
        <path
          d="M0,200 L0,150 L50,100 L100,140 L150,80 L200,130 L250,60 L300,120 L350,90 L400,140 L400,200 Z"
          className="fill-mountain-light/30"
        />
        <path
          d="M0,200 L0,160 L80,110 L120,150 L180,90 L240,140 L300,100 L350,130 L400,110 L400,200 Z"
          className="fill-mountain-dark/20"
        />
      </svg>
      
      {/* Clouds layer 1 */}
      <div 
        className="absolute w-full"
        style={{ top: 80, transform: `translateX(${-cloudOffset1}px)` }}
      >
        {[0, 200, 400, 600].map((x, i) => (
          <Cloud key={i} x={x} size={40 + i * 10} opacity={0.6} />
        ))}
      </div>
      
      {/* Clouds layer 2 */}
      <div 
        className="absolute w-full"
        style={{ top: 180, transform: `translateX(${cloudOffset2 - 400}px)` }}
      >
        {[100, 300, 500, 700].map((x, i) => (
          <Cloud key={i} x={x} size={50 + i * 8} opacity={0.4} />
        ))}
      </div>
      
      {/* Snow particles */}
      <SnowParticles scrollY={scrollY} />
      
      {/* Distance markers */}
      {[...Array(5)].map((_, i) => {
        const markerY = (scrollY + i * 300) % 1500 - 300;
        return (
          <div
            key={i}
            className="absolute left-2 flex items-center gap-2 text-xs text-muted-foreground/50"
            style={{ top: -markerY }}
          >
            <div className="w-8 h-px bg-muted-foreground/30" />
            {Math.floor((scrollY + markerY) / 10)}m
          </div>
        );
      })}
    </div>
  );
};

const Cloud: React.FC<{ x: number; size: number; opacity: number }> = ({ x, size, opacity }) => (
  <div
    className="absolute"
    style={{ left: x, opacity }}
  >
    <svg width={size * 2} height={size} viewBox="0 0 100 50">
      <ellipse cx="30" cy="35" rx="25" ry="15" className="fill-snow" />
      <ellipse cx="50" cy="25" rx="30" ry="20" className="fill-snow" />
      <ellipse cx="75" cy="35" rx="20" ry="12" className="fill-snow" />
    </svg>
  </div>
);

const SnowParticles: React.FC<{ scrollY: number }> = ({ scrollY }) => {
  const particles = React.useMemo(() => 
    [...Array(20)].map((_, i) => ({
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
      size: 2 + Math.random() * 3,
    })),
  []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-snow/60"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            animation: `snow-fall ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes snow-fall {
          0% { transform: translateY(-20px) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
