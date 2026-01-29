import { useEffect } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { Gamepad2, Terminal, AlertTriangle, Keyboard } from "lucide-react";

const cppCode = `// final_drive.cpp - A text-based football game
// Inspired by legendary championship comebacks
// C++17 | Single file | Cross-platform

#include <iostream>
#include <string>
#include <random>
#include <chrono>
#include <thread>
#include <iomanip>

using namespace std;

// Game state
struct GameState {
    int yardsToGo = 80;
    int down = 1;
    int yardsForFirst = 10;
    int timeLeft = 120; // seconds
    int score = 0;
    int opponentScore = 7;
    bool gameOver = false;
};

// Random number generator
int rollDice(int min, int max) {
    static random_device rd;
    static mt19937 gen(rd());
    uniform_int_distribution<> dist(min, max);
    return dist(gen);
}

void clearScreen() {
    #ifdef _WIN32
        system("cls");
    #else
        system("clear");
    #endif
}

void displayField(const GameState& gs) {
    cout << "\\n";
    cout << "╔════════════════════════════════════════════════════════╗\\n";
    cout << "║  🏈 FINAL DRIVE - Championship Edition                 ║\\n";
    cout << "╠════════════════════════════════════════════════════════╣\\n";
    cout << "║  VISITOR: " << setw(2) << gs.opponentScore 
         << "     |     HOME: " << setw(2) << gs.score << "                    ║\\n";
    cout << "║  TIME: " << setw(3) << gs.timeLeft << "s    |     " 
         << gs.down << " & " << gs.yardsForFirst 
         << " | " << gs.yardsToGo << " yds to goal         ║\\n";
    cout << "╚════════════════════════════════════════════════════════╝\\n";
    
    // Visual field representation
    int position = 80 - gs.yardsToGo;
    cout << "\\n  [";
    for (int i = 0; i < 40; i++) {
        if (i == position / 2) cout << "🏈";
        else if (i % 5 == 0) cout << "|";
        else cout << "-";
    }
    cout << "] ENDZONE\\n\\n";
}

void showPlayOptions() {
    cout << "Choose your play:\\n";
    cout << "  [R] Run   - Safe 2-5 yards, low risk\\n";
    cout << "  [S] Short - Quick pass 3-8 yards, medium risk\\n";
    cout << "  [D] Deep  - Long bomb 10-40 yards, high risk\\n";
    cout << "  [Q] Quit game\\n";
    cout << "\\n> ";
}

pair<int, string> executePlay(char choice) {
    int yards = 0;
    string result;
    int roll = rollDice(1, 100);
    
    switch (tolower(choice)) {
        case 'r': // Run play
            if (roll <= 85) {
                yards = rollDice(2, 5);
                result = "Solid run up the middle!";
            } else if (roll <= 95) {
                yards = rollDice(-2, 1);
                result = "Stuffed at the line!";
            } else {
                yards = -rollDice(1, 3);
                result = "FUMBLE recovered, but lost yards!";
            }
            break;
            
        case 's': // Short pass
            if (roll <= 70) {
                yards = rollDice(4, 10);
                result = "Caught! Nice gain!";
            } else if (roll <= 85) {
                yards = 0;
                result = "Incomplete pass!";
            } else if (roll <= 95) {
                yards = rollDice(-3, 0);
                result = "Sacked!";
            } else {
                yards = 0;
                result = "INTERCEPTED! Turnover! (Game Over)";
                return {-999, result};
            }
            break;
            
        case 'd': // Deep pass
            if (roll <= 35) {
                yards = rollDice(15, 45);
                result = "CAUGHT! BIG PLAY DOWN THE FIELD!";
            } else if (roll <= 75) {
                yards = 0;
                result = "Overthrown! Incomplete!";
            } else if (roll <= 90) {
                yards = rollDice(-5, -1);
                result = "Sacked while looking deep!";
            } else {
                yards = 0;
                result = "PICKED OFF! Game Over!";
                return {-999, result};
            }
            break;
            
        default:
            return {0, "Invalid play!"};
    }
    
    return {yards, result};
}

void updateGameState(GameState& gs, int yards) {
    gs.yardsToGo -= yards;
    gs.yardsForFirst -= yards;
    gs.timeLeft -= rollDice(5, 15);
    
    // Check for touchdown
    if (gs.yardsToGo <= 0) {
        gs.score += 7;
        gs.gameOver = true;
        return;
    }
    
    // Check for first down
    if (gs.yardsForFirst <= 0) {
        gs.down = 1;
        gs.yardsForFirst = min(10, gs.yardsToGo);
        cout << "\\n  >>> FIRST DOWN! <<<\\n";
    } else {
        gs.down++;
        if (gs.down > 4) {
            cout << "\\n  TURNOVER ON DOWNS!\\n";
            gs.gameOver = true;
        }
    }
    
    // Check time
    if (gs.timeLeft <= 0) {
        gs.timeLeft = 0;
        gs.gameOver = true;
    }
}

int main() {
    GameState game;
    
    clearScreen();
    cout << "\\n";
    cout << "  ╔═══════════════════════════════════════════════╗\\n";
    cout << "  ║     🏈 FINAL DRIVE: CHAMPIONSHIP EDITION 🏈   ║\\n";
    cout << "  ╠═══════════════════════════════════════════════╣\\n";
    cout << "  ║  Down by 7 with 2 minutes left.               ║\\n";
    cout << "  ║  80 yards to glory.                           ║\\n";
    cout << "  ║  Can you lead the comeback?                   ║\\n";
    cout << "  ╚═══════════════════════════════════════════════╝\\n";
    cout << "\\n  Press ENTER to start the drive...";
    cin.ignore();
    
    while (!game.gameOver) {
        clearScreen();
        displayField(game);
        showPlayOptions();
        
        char choice;
        cin >> choice;
        
        if (tolower(choice) == 'q') {
            cout << "\\nGame abandoned.\\n";
            return 0;
        }
        
        auto [yards, result] = executePlay(choice);
        
        cout << "\\n  " << result << " (" << (yards > 0 ? "+" : "") << yards << " yards)\\n";
        
        if (yards == -999) { // Turnover
            game.gameOver = true;
            cout << "\\n  The defense wins it!\\n";
        } else {
            updateGameState(game, yards);
        }
        
        this_thread::sleep_for(chrono::milliseconds(1500));
    }
    
    // End game screen
    clearScreen();
    cout << "\\n\\n";
    if (game.score > game.opponentScore) {
        cout << "  ╔═══════════════════════════════════════════════╗\\n";
        cout << "  ║            🏆 TOUCHDOWN! YOU WIN! 🏆          ║\\n";
        cout << "  ║      THE COMEBACK IS COMPLETE!                ║\\n";
        cout << "  ╚═══════════════════════════════════════════════╝\\n";
    } else if (game.timeLeft <= 0) {
        cout << "  ╔═══════════════════════════════════════════════╗\\n";
        cout << "  ║         ⏰ TIME EXPIRED - YOU LOSE ⏰         ║\\n";
        cout << "  ║       So close, yet so far...                 ║\\n";
        cout << "  ╚═══════════════════════════════════════════════╝\\n";
    } else {
        cout << "  ╔═══════════════════════════════════════════════╗\\n";
        cout << "  ║            GAME OVER - YOU LOSE               ║\\n";
        cout << "  ║       Better luck next time, coach!           ║\\n";
        cout << "  ╚═══════════════════════════════════════════════╝\\n";
    }
    
    cout << "\\n  Final: HOME " << game.score << " - " << game.opponentScore << " VISITOR\\n\\n";
    
    return 0;
}`;

const Index = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen bg-background" style={{ background: "var(--hero-gradient)" }}>
      {/* Hero Section */}
      <header className="section-container text-center">
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Gamepad2 className="w-4 h-4" />
            C++17 Console Game
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Final Drive
          <span className="text-gradient block text-3xl md:text-4xl mt-2">
            Championship Edition
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
          A text-based football game inspired by legendary championship comebacks. 
          Lead your team on an 80-yard drive with 2 minutes left. Can you score?
        </p>
      </header>

      {/* Game Description */}
      <section className="section-container">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h2 className="section-title flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              About the Game
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You're down by 7 points with 2 minutes on the clock. Starting at your own 20-yard line, 
              you must orchestrate the perfect drive to tie or win the game. Choose between safe runs, 
              quick passes, or risky deep throws—each with different odds of success.
            </p>
            <ul className="mt-6 space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">▸</span>
                Risk vs. reward play-calling system
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">▸</span>
                ASCII field visualization
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">▸</span>
                Turnovers, sacks, and big plays
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">▸</span>
                Cross-platform (Win/Mac/Linux)
              </li>
            </ul>
          </div>

          <div className="glass-card p-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <h2 className="section-title flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Keyboard className="w-5 h-5 text-primary" />
              </div>
              Controls
            </h2>
            <div className="space-y-4">
              {[
                { key: "R", desc: "Run play", detail: "Safe 2-5 yards, 85% success" },
                { key: "S", desc: "Short pass", detail: "Medium 4-10 yards, 70% success" },
                { key: "D", desc: "Deep pass", detail: "Risky 15-45 yards, 35% success" },
                { key: "Q", desc: "Quit game", detail: "Exit to terminal" },
              ].map((control) => (
                <div key={control.key} className="flex items-center gap-4">
                  <kbd className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary border border-border font-mono font-semibold text-foreground">
                    {control.key}
                  </kbd>
                  <div>
                    <div className="font-medium text-foreground">{control.desc}</div>
                    <div className="text-sm text-muted-foreground">{control.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Code Block */}
      <section className="section-container">
        <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <h2 className="section-title">Source Code</h2>
          <p className="section-subtitle">
            Copy the full C++17 source code below. Single file, no dependencies.
          </p>
        </div>
        <div className="animate-fade-in glow-accent rounded-xl" style={{ animationDelay: "0.7s" }}>
          <CodeBlock code={cppCode} language="cpp" />
        </div>
      </section>

      {/* Build Instructions */}
      <section className="section-container">
        <h2 className="section-title text-center mb-8 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          Build & Run
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              platform: "Windows",
              icon: "🪟",
              commands: ["g++ -std=c++17 -o final_drive.exe final_drive.cpp", "./final_drive.exe"],
              note: "Requires MinGW or MSVC with C++17 support",
            },
            {
              platform: "macOS",
              icon: "🍎",
              commands: ["clang++ -std=c++17 -o final_drive final_drive.cpp", "./final_drive"],
              note: "Xcode command line tools required",
            },
            {
              platform: "Linux",
              icon: "🐧",
              commands: ["g++ -std=c++17 -o final_drive final_drive.cpp", "./final_drive"],
              note: "GCC 7+ or Clang 5+ recommended",
            },
          ].map((item, i) => (
            <div
              key={item.platform}
              className="glass-card p-6 animate-fade-in"
              style={{ animationDelay: `${0.9 + i * 0.1}s` }}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-4">{item.platform}</h3>
              <div className="space-y-2 mb-4">
                {item.commands.map((cmd, j) => (
                  <code
                    key={j}
                    className="block text-sm font-mono bg-secondary/50 rounded-lg px-3 py-2 text-foreground overflow-x-auto"
                  >
                    {cmd}
                  </code>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="section-container">
        <div className="glass-card p-8 border-primary/20 animate-fade-in" style={{ animationDelay: "1.2s" }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 shrink-0">
              <AlertTriangle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                This is a fan-made project created purely for educational and entertainment purposes. 
                It is not affiliated with, endorsed by, or connected to the NCAA, any university, 
                or any collegiate athletic program. All gameplay elements are fictional. 
                The game concept is inspired by the drama of championship football but does not 
                depict or reference any real teams, players, or specific events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-container text-center border-t border-border/50">
        <p className="text-muted-foreground text-sm">
          Built with C++17 • Open source • Made for the love of the game
        </p>
      </footer>
    </div>
  );
};

export default Index;
