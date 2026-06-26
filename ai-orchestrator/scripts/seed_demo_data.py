import os
import datetime as dt
from pymongo import MongoClient

def seed_demo_data():
    """
    Seeds the MongoDB database with three distinct personas for the Hackathon Demo.
    1. Student Demo
    2. Founder Demo
    3. Software Engineer Demo
    """
    print("Connecting to MongoDB...")
    # For local demo, assuming default MongoDB port. Use env var in production.
    uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
    client = MongoClient(uri)
    db = client["antigravity"]
    
    print("Clearing existing demo data...")
    db.users.delete_many({"is_demo": True})
    db.tasks.delete_many({"user_id": {"$in": ["demo_student", "demo_founder", "demo_engineer"]}})
    db.focus_blocks.delete_many({"user_id": {"$in": ["demo_student", "demo_founder", "demo_engineer"]}})
    db.notification_intents.delete_many({"user_id": {"$in": ["demo_student", "demo_founder", "demo_engineer"]}})

    # Persona 1: Student
    db.users.insert_one({"_id": "demo_student", "is_demo": True, "name": "Alex (Student)"})
    db.tasks.insert_many([
        {"user_id": "demo_student", "title": "Finish Physics Assignment", "priority": "HIGH", "estimated_minutes": 120, "progress": 0},
        {"user_id": "demo_student", "title": "Study for Calculus Exam", "priority": "CRITICAL", "estimated_minutes": 180, "progress": 20},
    ])
    
    # Persona 2: Founder
    db.users.insert_one({"_id": "demo_founder", "is_demo": True, "name": "Sarah (Founder)"})
    db.tasks.insert_many([
        {"user_id": "demo_founder", "title": "Finalize Investor Pitch Deck", "priority": "CRITICAL", "estimated_minutes": 90, "progress": 50},
        {"user_id": "demo_founder", "title": "Interview Senior Engineer", "priority": "HIGH", "estimated_minutes": 60, "progress": 0},
    ])
    
    # Persona 3: Software Engineer (Showcasing RECOVERY mode)
    now = dt.datetime.now(dt.UTC)
    db.users.insert_one({"_id": "demo_engineer", "is_demo": True, "name": "David (Software Engineer)"})
    db.tasks.insert_many([
        {"user_id": "demo_engineer", "title": "Fix Prod Bug #402", "priority": "CRITICAL", "estimated_minutes": 60, "progress": 0},
    ])
    db.focus_blocks.insert_one({
        "user_id": "demo_engineer",
        "title": "Fix Prod Bug #402",
        "status": "APPROVED", # Simulating it was already accepted
        "startTime": (now - dt.timedelta(minutes=30)).isoformat(), # Started 30 mins ago
        "endTime": (now + dt.timedelta(minutes=30)).isoformat()
    })
    # Staging a recovery notification intent for the Engineer
    db.notification_intents.insert_one({
        "user_id": "demo_engineer",
        "title": "Schedule Adjusted Successfully",
        "body": "Looks like an emergency meeting popped up. Don't worry, I found another 2-hour slot at 4 PM. Completing it then will keep your entire week on track. Want to move it?",
        "type": "RECOVERY",
        "priority": "HIGH",
        "confidence": 0.98,
        "whyAmISeeingThis": "A calendar conflict broke your schedule, and I found a safe recovery path.",
        "suggestedAction": "approve_recovery",
        "timestamp": now.isoformat()
    })

    print("Successfully seeded Student, Founder, and Software Engineer personas!")

if __name__ == "__main__":
    seed_demo_data()
