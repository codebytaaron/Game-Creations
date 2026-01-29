import random
from dataclasses import dataclass
from portal_game.content import EVENTS, SCENES, TITLE, wrap

@dataclass
class State:
    name: str
    position: str
    sanity: int = 70
    score: int = 0
    followers: int = 0
    offers: int = 0
    committed: bool = False

def clamp(x: int, lo: int, hi: int) -> int:
    return max(lo, min(hi, x))

def read_nonempty(prompt: str, fallback: str) -> str:
    s = input(prompt).strip()
    return s if s else fallback

def ask_choice(prompt: str, options: list[str]) -> int:
    print(wrap(prompt))
    for i, opt in enumerate(options, 1):
        print(f"  {i}) {opt}")
    while True:
        choice = input("Pick a number: ").strip()
        if choice.isdigit():
            idx = int(choice)
            if 1 <= idx <= len(options):
                return idx
        print("Pick one of the numbers listed.")

def apply_delta(state: State, delta: dict) -> None:
    state.sanity += int(delta.get("sanity", 0))
    state.score += int(delta.get("score", 0))
    state.followers += int(delta.get("followers", 0))
    state.offers += int(delta.get("offers", 0))
    state.sanity = clamp(state.sanity, 0, 100)
    state.score = clamp(state.score, -50, 50)
    state.followers = max(0, state.followers)
    state.offers = max(0, state.offers)

def show_state(state: State) -> None:
    bars = int(state.sanity / 5)
    print(f"\nSanity:  [{'#' * bars}{'.' * (20 - bars)}] {state.sanity}/100")
    print(f"Portal Score: {state.score} | Followers: {state.followers} | Offers: {state.offers}")

def random_event(state: State) -> None:
    msg, delta = random.choice(EVENTS)
    print("\n--- Random Portal Moment ---")
    print(wrap(msg))
    apply_delta(state, delta)

def ending(state: State) -> str:
    if state.sanity <= 15:
        return "ENDING: You survived, but the word 'opportunity' now raises your blood pressure."
    if state.score >= 18 and state.sanity >= 40:
        return "ENDING: Clean work. Good fit, good leverage, and you kept it together."
    if state.followers >= 50000:
        return "ENDING: You did not pick a school, but you did become a content brand."
    return "ENDING: Solid day. Not legendary. Not a disaster. That counts."

def run_game() -> None:
    print("\n" + "=" * 70)
    print(f"  {TITLE}")
    print("  A tiny choice game about one day in the transfer portal.")
    print("=" * 70 + "\n")

    name = read_nonempty("Player name: ", "Future Considerations")
    position = read_nonempty("Position (QB/WR/LB/etc): ", "ATH")

    state = State(
        name=name,
        position=position,
        followers=random.randint(1200, 25000),
    )

    print("\n" + wrap(
        f"Good morning, {state.name} ({state.position}). "
        "Your phone is already warm. Time to make decisions while everyone watches."
    ))

    for idx, scene in enumerate(SCENES, 1):
        print(f"\n--- Scene {idx}: {scene['time']} ---")
        choice = ask_choice(scene["prompt"], scene["options"])
        # choices are 1-based; map to delta/message
        picked = scene["results"][choice - 1]
        print("\n" + wrap(picked["text"]))
        apply_delta(state, picked["delta"])

        # small randomness between scenes
        random_event(state)
        show_state(state)

    # Final commit check based on last scene choice impact already applied
    print("\n" + "=" * 70)
    print(wrap(ending(state)))
    print("=" * 70)
    print(wrap(
        f"Final recap: {state.name} | Offers: {state.offers} | "
        f"Followers: {state.followers} | Portal Score: {state.score}"
    ))
    print()
