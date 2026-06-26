# DATABASE DESIGN DOCUMENT

---
Part-1

# Project Information

**Project Name:** The Last-Minute Life Saver

**Database:** MongoDB Atlas

**ODM:** Mongoose

**Version:** 3.0 (Final)

**Status:** Locked

---

# Purpose

The database serves as the single source of truth for the application and the shared memory layer for the AI multi-agent system.

It is designed to:

* Persist user data
* Store productivity information
* Maintain AI context
* Enable explainable AI
* Support future scalability
* Prevent data inconsistencies
* Provide efficient query performance

The database is optimized for MongoDB's document-oriented model while maintaining strong typing and validation through Mongoose.

---

# Database Design Principles

The database follows these principles:

* Single Source of Truth
* Document-Oriented Design
* Shared Memory Pattern
* Minimal Data Duplication
* Strict Schema Validation
* Indexed Query Paths
* Auditability
* Future Scalability
* Explainable AI Support

Collections represent business domains rather than UI screens.

---

# Technology

Database

MongoDB Atlas

ODM

Mongoose

Validation

Mongoose Schema Validation

Authentication Source

Firebase Authentication

---

# Identifier Strategy

## User Identifier

The application uses the Firebase Authentication UID as the permanent identifier for every user.

```text
userId : String
```

This value must always match

```text
Firebase Auth UID
```

No secondary user identifier should exist.

---

## Internal Identifiers

All internal business entities use MongoDB ObjectId.

Examples

```text
Task

Goal

Habit

Recommendation

Reflection

Notification
```

Reason

* Native MongoDB support
* Faster indexing
* Smaller storage
* Efficient aggregation
* Simpler references

---

# Collection Overview

The MVP consists of the following collections.

| Collection          | Purpose                         |
| ------------------- | ------------------------------- |
| users               | User profile and preferences    |
| tasks               | Core task management            |
| goals               | Long-term and short-term goals  |
| habits              | Habit tracking                  |
| calendarSync        | Google Calendar synchronization |
| aiRecommendations   | AI-generated suggestions        |
| reflections         | Daily and weekly reflections    |
| productivityMetrics | Aggregated analytics            |
| notifications       | Notification history            |

Each collection has exactly one responsibility.

---

# users Collection

## Purpose

Stores user profile information.

Authentication is handled by Firebase.

Passwords are never stored in MongoDB.

---

## Fields

| Field                | Type                  | Required |
| -------------------- | --------------------- | -------- |
| userId               | String (Firebase UID) | Yes      |
| email                | String                | Yes      |
| fullName             | String                | Yes      |
| profilePhoto         | String                | No       |
| timezone             | String                | Yes      |
| preferences          | Object                | Yes      |
| workingHours         | Object                | Yes      |
| notificationSettings | Object                | Yes      |
| connectedAccounts    | Object                | No       |
| createdAt            | Date                  | Yes      |
| updatedAt            | Date                  | Yes      |

---

## Working Hours Structure

```json
{
  "start": "09:00",
  "end": "17:00"
}
```

---

## Indexes

Unique

```text
email
```

Indexes

```text
userId

createdAt
```

---

# tasks Collection

## Purpose

The central collection of the application.

Every AI agent reads from this collection.

---

## Fields

| Field                    | Type              |
| ------------------------ | ----------------- |
| _id                      | ObjectId          |
| userId                   | String            |
| title                    | String            |
| description              | String            |
| priority                 | Enum              |
| status                   | Enum              |
| category                 | Enum              |
| deadline                 | Date              |
| estimatedDurationMinutes | Number            |
| progress                 | Number            |
| aiRiskScore              | Number            |
| completionProbability    | Number            |
| dependencies             | ObjectId[]        |
| lockedByAgent            | String (Nullable) |
| createdAt                | Date              |
| updatedAt                | Date              |
| deletedAt                | Date (Nullable)   |

---

## Enums

Priority

```text
LOW

MEDIUM

HIGH

CRITICAL
```

Status

```text
TODO

IN_PROGRESS

COMPLETED

OVERDUE
```

---

## Validation Rules

Estimated Duration

```text
>= 1 minute
```

Progress

```text
0–100
```

Risk Score

```text
0.0–1.0
```

Completion Probability

```text
0.0–1.0
```

Deadline

Must always be greater than

```text
createdAt
```

---

## AI Locking

When the Orchestrator modifies a task

```text
lockedByAgent

=

ORCHESTRATOR
```

This prevents race conditions while AI planning is in progress.

The lock must be released immediately after completion.

---

## Indexes

Compound

```text
userId + deadline

userId + priority

userId + status

userId + category
```

Single

```text
deadline

priority

status
```

---

# goals Collection

Stores long-term objectives.

---

## Fields

| Field       | Type       |
| ----------- | ---------- |
| _id         | ObjectId   |
| userId      | String     |
| title       | String     |
| description | String     |
| goalType    | Enum       |
| progress    | Number     |
| deadline    | Date       |
| linkedTasks | ObjectId[] |
| createdAt   | Date       |
| updatedAt   | Date       |

---

Goal Types

```text
SHORT_TERM

LONG_TERM

ACADEMIC

CAREER

PERSONAL
```

---

# habits Collection

Tracks recurring productivity habits.

---

## Fields

| Field           | Type     |
| --------------- | -------- |
| _id             | ObjectId |
| userId          | String   |
| title           | String   |
| frequencyDays   | Number[] |
| currentStreak   | Number   |
| longestStreak   | Number   |
| reminderEnabled | Boolean  |
| createdAt       | Date     |
| updatedAt       | Date     |

---

Example

```text
[1,2,3,4,5]
```

Monday

↓

Friday

---

Validation

Frequency values

```text
0

↓

6
```

represent

Sunday

↓

Saturday

Part-2

# calendarSync Collection

## Purpose

Stores Google Calendar synchronization metadata.

This collection does **not** duplicate all Google Calendar events.

It stores only the information required to synchronize efficiently and maintain application state.

---

## Fields

| Field               | Type     |
| ------------------- | -------- |
| _id                 | ObjectId |
| userId              | String   |
| googleCalendarId    | String   |
| syncToken           | String   |
| lastSyncTime        | Date     |
| autoScheduleEnabled | Boolean  |
| syncStatus          | Enum     |
| createdAt           | Date     |
| updatedAt           | Date     |

---

## Sync Status Enum

```text
CONNECTED

DISCONNECTED

SYNCING

ERROR
```

---

## Indexes

Compound

```text
userId + syncStatus
```

---

# aiRecommendations Collection

## Purpose

Stores recommendations generated by the AI that require user review or action.

This collection provides explainability, auditability, and Human-in-the-Loop control.

---

## Fields

| Field          | Type                |
| -------------- | ------------------- |
| _id            | ObjectId            |
| userId         | String              |
| sourceAgent    | Enum                |
| actionType     | Enum                |
| targetId       | ObjectId (Nullable) |
| recommendation | String              |
| reasoning      | String              |
| confidence     | Number              |
| status         | Enum                |
| expiresAt      | Date (Nullable)     |
| createdAt      | Date                |
| updatedAt      | Date                |

---

## Source Agent Enum

```text
PLANNER

SCHEDULER

RISK_ANALYZER

CONTEXT

COACH

EXECUTOR
```

---

## Action Type Enum

```text
SPLIT_TASK

CHANGE_PRIORITY

CREATE_FOCUS_SESSION

RESCHEDULE_TASK

START_FOCUS_SESSION

GENERATE_OUTLINE

CREATE_CHECKLIST

DRAFT_EMAIL
```

---

## Recommendation Status Enum

```text
PENDING

ACCEPTED

REJECTED

DISMISSED

EXPIRED
```

---

## Validation

Confidence

```text
0.0 ≤ confidence ≤ 1.0
```

Reasoning is mandatory for every recommendation.

Every recommendation must be traceable to exactly one source agent.

---

## Indexes

Compound

```text
userId + status

userId + sourceAgent
```

---

# reflections Collection

## Purpose

Stores daily and weekly reflections.

The Reflection Agent uses this information to improve future planning and identify recurring productivity patterns.

---

## Fields

| Field          | Type     |
| -------------- | -------- |
| _id            | ObjectId |
| userId         | String   |
| reflectionDate | Date     |
| completedTasks | Number   |
| missedTasks    | Number   |
| blockers       | String[] |
| achievements   | String[] |
| aiSummary      | String   |
| createdAt      | Date     |

---

## Business Rules

Only one daily reflection may exist per user per day.

The Reflection Agent must never overwrite historical reflections.

---

## Indexes

Compound

```text
userId + reflectionDate
```

---

# productivityMetrics Collection

## Purpose

Stores aggregated productivity statistics.

This collection is updated by scheduled background jobs rather than during every user interaction.

---

## Fields

| Field                | Type     |
| -------------------- | -------- |
| _id                  | ObjectId |
| userId               | String   |
| weekStartDate        | Date     |
| tasksCompletedOnTime | Number   |
| tasksOverdue         | Number   |
| focusHoursCompleted  | Number   |
| habitCompletionRate  | Number   |
| productivityScore    | Number   |
| createdAt            | Date     |

---

## Validation

Productivity Score

```text
0–100
```

Habit Completion Rate

```text
0–100
```

---

## Indexes

Compound

```text
userId + weekStartDate
```

---

# notifications Collection

## Purpose

Stores notification history.

The Reminder Agent uses this collection to avoid duplicate or excessive notifications.

---

## Fields

| Field            | Type     |
| ---------------- | -------- |
| _id              | ObjectId |
| userId           | String   |
| title            | String   |
| body             | String   |
| notificationType | Enum     |
| priority         | Enum     |
| delivered        | Boolean  |
| read             | Boolean  |
| createdAt        | Date     |

---

## Notification Type Enum

```text
DEADLINE

FOCUS

HABIT

CALENDAR

AI_RECOMMENDATION

SYSTEM
```

---

## Priority Enum

```text
LOW

MEDIUM

HIGH

CRITICAL
```

---

## TTL Policy

Notification history older than 30 days may be automatically deleted using a TTL index, unless retained for analytics.

---

## Indexes

Compound

```text
userId + read

userId + notificationType
```

---

# Shared Memory Model

MongoDB acts as the shared memory layer for the AI system.

Specialist agents never communicate directly with each other.

Instead, they exchange information by reading and writing structured data through shared collections.

Logical memory domains include:

* User Memory
* Task Memory
* Goal State
* Habit State
* Calendar Context
* Recommendation History
* Reflection History
* Productivity Metrics

This architecture improves consistency, observability, and scalability.

---

# Logical Relationships

The application uses a document-oriented model with logical references.

Relationships include:

* One User → Many Tasks
* One User → Many Goals
* One User → Many Habits
* One User → Many Recommendations
* One User → Many Reflections
* One User → Many Notifications
* One User → Many Productivity Metric Records

Large collections should reference related documents using identifiers rather than embedding unbounded arrays.

---

# Data Lifecycle

User-created data is retained until explicitly deleted.

Operational AI data should have defined retention policies.

Examples:

* Expired recommendations may be archived or removed.
* Old notification records may expire automatically.
* Historical reflections and productivity metrics should be retained to improve long-term AI recommendations.

---

# Audit Strategy

Every collection should include timestamps where applicable.

The application should maintain a clear history of:

* AI-generated recommendations
* User acceptance or rejection of recommendations
* Task state changes
* Calendar synchronization events

This audit trail supports explainability and debugging while preserving user trust.

Part-3

# Global Validation Rules

Every collection must enforce validation through Mongoose schemas.

## Required Fields

Fields marked as required must reject null or undefined values.

Validation occurs on both:

* Create
* Update

operations.

---

## String Validation

Rules:

* Trim leading/trailing whitespace
* Reject empty strings where required
* Apply reasonable maximum lengths
* Sanitize potentially unsafe input

---

## Number Validation

Examples:

Risk Score

0.0 ≤ value ≤ 1.0

Completion Probability

0.0 ≤ value ≤ 1.0

Progress

0 ≤ value ≤ 100

Estimated Duration

value ≥ 1 minute

Negative values are not permitted unless explicitly required.

---

## Date Validation

Rules:

* createdAt is automatically generated
* updatedAt is automatically updated
* deadline must be greater than createdAt
* reflectionDate cannot be in the future

---

# Enum Enforcement

Every Enum defined in this document is mandatory.

Example:

Valid

```text
TODO
```

Invalid

```text
Done
```

The backend must reject invalid Enum values before writing to MongoDB.

---

# Soft Delete Strategy

Business records should not be permanently removed immediately.

Collections such as:

* tasks
* goals
* habits

should support soft deletion.

Recommended fields:

```text
isDeleted : Boolean

deletedAt : Date
```

Deleted records should not appear in normal application queries.

---

# Mongoose Guidelines

All schemas should include:

* timestamps: true
* strict mode enabled
* schema validation
* indexes declared in schema
* reusable sub-schemas where appropriate

Avoid dynamic schema fields unless intentionally documented.

---

# Transaction Strategy

MongoDB transactions should be used only when multiple related updates must succeed together.

Example:

Accept AI Recommendation

↓

Update Task

↓

Create Calendar Event

↓

Log Recommendation Status

↓

Commit Transaction

If any step fails, the transaction should roll back.

Avoid unnecessary transactions to preserve performance.

---

# Concurrency Control

To reduce race conditions:

* Use optimistic concurrency where appropriate.
* Use `lockedByAgent` only during short-lived AI planning operations.
* Release locks immediately after processing.

The user should never remain locked out because of an abandoned AI operation.

---

# Shared Memory Protocol

The AI system communicates only through the database and orchestrator.

Rules:

* Specialist agents never call each other directly.
* Each agent reads the latest state from Shared Memory.
* Each agent writes only the data it owns.
* The Orchestrator coordinates execution order.
* Historical data must never be overwritten without reason.

This keeps the AI system deterministic and easier to debug.

---

# Error Handling

Database errors should:

* Return consistent API responses.
* Never expose internal database details.
* Log diagnostic information securely.
* Preserve data integrity.

Examples include:

* duplicate key errors
* validation failures
* connection failures
* transaction failures

---

# Performance Guidelines

Optimize for the most common queries.

Recommended practices:

* Use compound indexes for frequent filters.
* Avoid unbounded arrays.
* Paginate large result sets.
* Project only required fields.
* Use aggregation pipelines for analytics.
* Profile slow queries before optimization.

Performance improvements should be driven by measurements rather than assumptions.

---

# Backup and Recovery

The deployment environment should support:

* Automated database backups.
* Point-in-time recovery where available.
* Restore testing during development.

Critical productivity data should be recoverable.

---

# Security Guidelines

Database credentials:

* Stored only in environment variables.
* Never committed to source control.
* Never exposed to frontend code.

All database access must occur through authenticated backend APIs.

The frontend must never connect directly to MongoDB.

---

# Privacy Principles

Collect only the data required for application functionality.

Users should have the ability to:

* Export their data.
* Delete their account.
* Remove connected integrations.
* Disable AI personalization where applicable.

Personal information must not be used outside the documented product functionality.

---

# Migration Strategy

Future schema changes should be versioned.

Recommendations:

* Introduce new fields without breaking existing documents.
* Avoid destructive migrations during active development.
* Provide migration scripts for structural changes.

Backward compatibility should be maintained whenever practical.

---

# Future Database Extensions

The architecture allows future collections such as:

* aiConversations
* teamWorkspaces
* sharedProjects
* attachments
* achievements
* auditLogs
* integrationSettings

These collections are intentionally excluded from the MVP.

---

# Database Quality Checklist

Before deployment, verify:

✓ All schemas validated.

✓ Required indexes created.

✓ Enum validation enforced.

✓ Soft delete implemented.

✓ Authentication integrated.

✓ Compound indexes tested.

✓ Transactions verified.

✓ AI locking tested.

✓ Shared Memory workflow validated.

✓ Security review completed.

---

# Final Notes

This database design is intentionally optimized for an AI-first productivity platform.

The database is not only persistent storage but also the Shared Memory layer that enables the Orchestrator and Specialist Agents to collaborate safely.

Every schema, validation rule, index, and relationship has been chosen to balance:

* Simplicity
* Performance
* Explainability
* Maintainability
* Scalability

This document is considered the authoritative database specification for the MVP.

Changes should only be made if implementation reveals a genuine architectural issue.
