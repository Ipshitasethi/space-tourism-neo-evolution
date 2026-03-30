import urllib.request
import json
from datetime import datetime

# Firebase Config
PROJECT_ID = "spacetourism-b3e5a"
API_KEY = "AIzaSyBOhux_lS_GkwlFlJcVKFSzvzv3FJtybt4"

MISSIONS = [
    {
        "id": "MSN-001",
        "destination": "Mars Colony Alpha",
        "departure": "2026-09-15T00:00:00Z",
        "seats_available": 12,
        "status": "Active",
        "price_usd": 120000,
        "duration_days": 180,
        "difficulty": "Medium",
        "tagline": "First permanent human settlement on Mars"
    },
    {
        "id": "MSN-002",
        "destination": "Saturn Ring Hotel",
        "departure": "2026-11-01T00:00:00Z",
        "seats_available": 0,
        "status": "Full",
        "price_usd": 450000,
        "duration_days": 365,
        "difficulty": "Hard",
        "tagline": "Float between the rings in zero gravity"
    },
    {
        "id": "MSN-003",
        "destination": "Europa Station",
        "departure": "2026-12-20T00:00:00Z",
        "seats_available": 8,
        "status": "Active",
        "price_usd": 380000,
        "duration_days": 290,
        "difficulty": "Hard",
        "tagline": "Beneath the ice, an ocean awaits"
    },
    {
        "id": "MSN-004",
        "destination": "Titan Outpost",
        "departure": "2027-02-10T00:00:00Z",
        "seats_available": 3,
        "status": "Upcoming",
        "price_usd": 310000,
        "duration_days": 240,
        "difficulty": "Medium",
        "tagline": "Explore Saturn's largest moon"
    },
    {
        "id": "MSN-005",
        "destination": "Kepler-22b Gateway",
        "departure": "2027-04-05T00:00:00Z",
        "seats_available": 0,
        "status": "Full",
        "price_usd": 1200000,
        "duration_days": 730,
        "difficulty": "Hard",
        "tagline": "Humanity's first interstellar passage"
    },
    {
        "id": "MSN-006",
        "destination": "Lunar Base Zero",
        "departure": "2026-08-30T00:00:00Z",
        "seats_available": 20,
        "status": "Active",
        "price_usd": 120000,
        "duration_days": 7,
        "difficulty": "Easy",
        "tagline": "Your first step beyond Earth"
    }
]

def seed_mission(mission):
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/missions?key={API_KEY}&documentId={mission['id']}"
    
    doc_fields = {
        "id": {"stringValue": mission["id"]},
        "destination": {"stringValue": mission["destination"]},
        "departure": {"timestampValue": mission["departure"]},
        "seats_available": {"integerValue": str(mission["seats_available"])},
        "status": {"stringValue": mission["status"]},
        "price_usd": {"integerValue": str(mission["price_usd"])},
        "duration_days": {"integerValue": str(mission["duration_days"])},
        "difficulty": {"stringValue": mission["difficulty"]},
        "tagline": {"stringValue": mission["tagline"]},
        "created_at": {"timestampValue": datetime.utcnow().isoformat() + "Z"}
    }
    
    payload = json.dumps({"fields": doc_fields}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.getcode() == 200:
                print(f"[SUCCESS] Seeded {mission['id']}")
    except urllib.error.HTTPError as e:
        if e.code == 409:
            print(f"[INFO] {mission['id']} already exists, skipping.")
        else:
            print(f"[ERROR] Failed to seed {mission['id']}. Status: {e.code}")
            print(e.read().decode())
    except Exception as e:
        print(f"[ERROR] Error seeding {mission['id']}: {e}")

if __name__ == "__main__":
    print(f"Initializing Seeding for Project: {PROJECT_ID}")
    for m in MISSIONS:
        seed_mission(m)
    print("Seeding Complete.")
