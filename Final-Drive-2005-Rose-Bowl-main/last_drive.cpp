#include <iostream>
#include <cstdlib>
#include <ctime>

using namespace std;

int main() {
    srand(time(0));

    // Game state
    int yardLine = 50;     // distance to end zone
    int down = 1;
    int yardsToGo = 10;
    int timeLeft = 60;
    bool touchdown = false;

    cout << "============================================\n";
    cout << " LAST DRIVE CHAMPIONSHIP GAME\n";
    cout << " Western State vs Southern Coast\n";
    cout << "============================================\n";
    cout << "Western State has the ball.\n";
    cout << "Score: Southern Coast 28, Western State 22\n";
    cout << "60 seconds remaining.\n";
    cout << "Ball on the 50-yard line.\n\n";

    while (timeLeft > 0 && down <= 4 && !touchdown) {
        cout << "--------------------------------------------\n";
        cout << "Time Left: " << timeLeft << " seconds\n";
        cout << "Down " << down << " & " << yardsToGo;
        cout << " | Ball on the Southern Coast " << yardLine << "\n";

        cout << "\nChoose a play:\n";
        cout << "1. Short Pass\n";
        cout << "2. Deep Pass\n";
        cout << "3. Run\n";
        cout << "Choice: ";

        int choice;
        cin >> choice;

        int gain = 0;
        int playTime = rand() % 7 + 6; // 6–12 seconds

        if (choice == 1) {
            gain = rand() % 7 + 4; // 4–10 yards
            cout << "\nShort pass complete for " << gain << " yards.\n";
        }
        else if (choice == 2) {
            if (rand() % 100 < 38) {
                gain = rand() % 20 + 18; // 18–37 yards
                cout << "\nDeep ball hauled in for " << gain << " yards.\n";
            } else {
                cout << "\nDeep pass falls incomplete.\n";
                gain = 0;
            }
        }
        else if (choice == 3) {
            gain = rand() % 6 + 2; // 2–7 yards
            cout << "\nRun up the middle for " << gain << " yards.\n";
        }
        else {
            cout << "\nMiscommunication on offense. No gain.\n";
            gain = 0;
            playTime += 4;
        }

        timeLeft -= playTime;
        yardLine -= gain;
        yardsToGo -= gain;

        if (yardLine <= 0) {
            touchdown = true;
            break;
        }

        if (yardsToGo <= 0) {
            down = 1;
            yardsToGo = 10;
            cout << "First down.\n";
        } else {
            down++;
        }

        if (down > 4) {
            break;
        }
    }

    cout << "\n============================================\n";

    if (touchdown) {
        cout << "TOUCHDOWN WESTERN STATE\n";
        cout << "The crowd erupts.\n";
        cout << "Western State wins the championship.\n";
    } else if (timeLeft <= 0) {
        cout << "Time expires.\n";
        cout << "Southern Coast survives the final drive.\n";
    } else {
        cout << "Turnover on downs.\n";
        cout << "Southern Coast takes over and wins.\n";
    }

    cout << "============================================\n";
    cout << "Thanks for playing.\n";

    return 0;
}
