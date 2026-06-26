# Demo Script

## Preparation
1. Ensure Docker, Node.js, and MongoDB are running.
2. Ensure you have run `python scripts/seed_demo_data.py`.
3. Open the Frontend in your browser (e.g., `http://localhost:3000`).
4. Have your Google Calendar open in an adjacent tab.

## Act I: The Overwhelmed User
1. Log in as **David (Software Engineer)**.
2. Point out the dashboard. There is a massive "Fix Prod Bug #402" task. It's marked CRITICAL. 
3. *Narrative*: "David is stressed. He has 1 hour to fix this bug."

## Act II: AI Orchestration (The WOW moment)
1. Click the **"Plan & Schedule"** button.
2. Emphasize the Skeleton loading state. "Right now, 3 specialized AI agents are negotiating David's schedule."
3. The UI updates instantly. Show that the Planner broke the bug into smaller steps, the Risk Analyzer rated it a 92% risk, and the Scheduler placed a 1-hour Focus Block on the UI.
4. Hover over the **Info Icon**. Read the Explainable AI string: *"Scheduled for morning peak cognitive load."*

## Act III: The AI Guardian (Recovery Mode)
1. Go to Google Calendar. Manually create a 1-hour event called **"Emergency All Hands"** right on top of David's Focus Block.
2. Return to the dashboard. Wait a few seconds (or trigger the Webhook button).
3. **BING!** A notification appears on the screen (or on your phone via FCM).
4. Read it aloud: *"Looks like an emergency meeting popped up. Don't worry, I found another 2-hour slot at 4 PM."*
5. Click the **"Approve Reschedule"** button on the notification.
6. Refresh Google Calendar. The block has magically moved to 4 PM.

## Conclusion
* "That is the AI Guardian. It doesn't just make a schedule; it fiercely protects it."
* End Demo.
