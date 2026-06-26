# Last-Minute Life Saver: Presentation Notes

## The Hook (1 minute)
* "How many of you have stared at a massive to-do list, frozen in panic, until it's too late?"
* Introduce the problem: Cognitive overload and scheduling paralysis.
* Introduce the solution: An autonomous AI ecosystem that acts as your personal project manager, risk assessor, and emotionally intelligent guardian.

## The Architecture (1 minute)
* Show the Mermaid diagram.
* Emphasize the **Separation of Concerns**: Node.js handles standard boring auth/CRUD. FastAPI handles heavy AI lifting.
* Emphasize **Contextual Shared Memory**: Agents don't just talk to each other; they read from and write to a centralized state, exactly like a human team passing a clipboard.

## The Core Features (2 minutes)
1. **The Planner**: Breaks down vague tasks into estimated Pomodoros.
2. **The Risk Analyzer**: Honest, brutal assessment of what you won't finish in time.
3. **The Scheduler**: Perfect Google Calendar Tetris. Emphasize that it *interleaves breaks* automatically to prevent burnout.
4. **The AI Guardian**: This is the show-stopper. It monitors your progress and calendar in the background and sends FCM push notifications. It has emotional intelligence—if you ignore it, it pivots from "Warnings" to "Encouragement."

## Explainable AI (XAI) (1 minute)
* Point out the UI elements showing `confidence` scores and `whyAmISeeingThis` tooltips.
* Explain that users don't trust black boxes. We built transparency into the core prompt schemas using Pydantic.

## Closing (30 seconds)
* Recap the Future Roadmap: Multi-user collaboration, Slack/Outlook integrations, and smartwatch syncing.
* Thank the judges.
