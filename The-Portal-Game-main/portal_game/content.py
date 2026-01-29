import textwrap

TITLE = "Status: Open"

def wrap(s: str, width: int = 78) -> str:
    return "\n".join(textwrap.wrap(s, width))

EVENTS = [
    ("A 'credible source' posts you visited 6 schools today. You were at Target.",
     {"sanity": -8, "score": -2}),
    ("A coach texts 'u up?' at 11:58 PM with 14 typos.",
     {"sanity": -5, "score": +2, "offers": +1}),
    ("Your old teammate subtweets: 'Loyalty is rare.' You were not even tagged.",
     {"sanity": -6, "score": +1}),
    ("A graphic designer DMs: 'I can put you in a lambo by 4pm.'",
     {"sanity": -4, "followers": +1200, "score": +2}),
    ("You accidentally like a rival school post. The group chat notices instantly.",
     {"sanity": -7, "score": -3}),
    ("Your mom says: 'Pick the place that will still help you if football ends.'",
     {"sanity": +8, "score": +1}),
    ("A message says 'we love your film' but it is clearly copy-pasted.",
     {"sanity": -3, "score": +2}),
    ("Someone offers you a 'totally normal internship' at their car wash.",
     {"sanity": -2, "score": +1}),
]

SCENES = [
    {
        "time": "8:03 AM",
        "prompt": "You wake up. First move?",
        "options": [
            "Post 'Respect my decision' with a black-and-white pic",
            "Call your coach and talk it out",
            "Do nothing and let rumors handle your PR",
        ],
        "results": [
            {
                "text": "Classic post. Replies are half support, half chaos.",
                "delta": {"followers": 900, "score": 4, "sanity": -6},
            },
            {
                "text": "You talk like an adult. The universe briefly calms down.",
                "delta": {"offers": 1, "score": 6, "sanity": 4},
            },
            {
                "text": "You choose peace. The internet chooses conspiracy.",
                "delta": {"score": 1, "sanity": 2},
            },
        ],
    },
    {
        "time": "12:17 PM",
        "prompt": "Three coaches text. A 'branding guy' and a trainer DM you too. What now?",
        "options": [
            "Reply to the coaches first",
            "Reply to branding: 'Make me look taller'",
            "Reply to nobody and post a vague story",
        ],
        "results": [
            {
                "text": "You answer coaches. Progress happens. Weird.",
                "delta": {"offers": 2, "score": 8, "sanity": 2},
            },
            {
                "text": "Your edit drops. You are now a different height online.",
                "delta": {"followers": 3000, "score": 3, "sanity": -5},
            },
            {
                "text": "You post 'Big things soon.' Comments include 13 eyeballs and one troll.",
                "delta": {"followers": 800, "score": 2, "sanity": -4},
            },
        ],
    },
    {
        "time": "6:45 PM",
        "prompt": "Night strategy. What are you doing?",
        "options": [
            "Schedule 3 visits this weekend",
            "Narrow to 2 schools based on actual fit",
            "Flip a coin on IG Live",
        ],
        "results": [
            {
                "text": "You become a travel influencer. TSA knows you by name.",
                "delta": {"offers": 1, "score": 4, "sanity": -10},
            },
            {
                "text": "You choose fit. The loudest people get mysteriously quiet.",
                "delta": {"offers": 1, "score": 10, "sanity": 6},
            },
            {
                "text": "The coin rolls under the couch. Chat decides that means SEC.",
                "delta": {"followers": 6000, "score": 2, "sanity": -12},
            },
        ],
    },
    {
        "time": "11:59 PM",
        "prompt": "End of day. Do you commit?",
        "options": [
            "Commit now",
            "Wait 48 hours",
            "Re-enter immediately (speedrun)",
        ],
        "results": [
            {
                "text": "You commit. Most people congratulate you. One account hates everything.",
                "delta": {"score": 8, "sanity": 3, "offers": 1},
            },
            {
                "text": "You wait. You gain options and also 12 new opinions you did not ask for.",
                "delta": {"score": 4, "sanity": 2, "offers": 1},
            },
            {
                "text": "You re-enter instantly. Historians will study your timeline.",
                "delta": {"score": -6, "sanity": -8, "followers": 9000},
            },
        ],
    },
]
