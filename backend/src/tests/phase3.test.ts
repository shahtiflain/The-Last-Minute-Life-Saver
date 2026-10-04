import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { User } from '../models/User.js';
import { FocusBlock } from '../models/FocusBlock.js';
import { Task } from '../models/Task.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

// Mock mongoose models
vi.mock('../models/User.js', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    User: {
      findOne: vi.fn(),
      findOneAndUpdate: vi.fn(),
    }
  };
});

vi.mock('../models/FocusBlock.js', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    FocusBlock: {
      find: vi.fn(),
    }
  };
});

vi.mock('../models/Task.js', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    Task: {
      find: vi.fn(),
    }
  };
});

// Mock auth middleware
vi.mock('../middlewares/auth.middleware.js', () => ({
  requireAuth: vi.fn((req, res, next) => {
    req.user = { userId: 'test-user-id', email: 'test@example.com' };
    next();
  }),
}));

process.env.ENCRYPTION_KEY = 'c2VjcmV0a2V5c2VjcmV0a2V5c2VjcmV0a2V5c2VjcmV0';

describe('Phase 3 Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return Google Auth URL', async () => {
    const res = await request(app).get('/api/auth/google/url');
    expect(res.status).toBe(200);
    expect(res.body.url).toContain('accounts.google.com');
  });

  it('should fetch pending focus blocks', async () => {
    (FocusBlock.find as any).mockReturnValue({
      sort: vi.fn().mockResolvedValue([
        { _id: 'block1', title: 'Test Block', status: 'PENDING_APPROVAL' },
      ]),
    });

    const res = await request(app).get('/api/focus-blocks/pending');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Test Block');
  });

  it('should fail schedule approval if Google Calendar is not connected', async () => {
    (User.findOne as any).mockResolvedValue({
      userId: 'test-user-id',
      connectedAccounts: {},
    });

    const res = await request(app).post('/api/ai/schedule/approve').send({
      blocks: [{ _id: 'block1', title: 'Test Block' }],
      oauthTokens: {},
    });
    
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Google Calendar is not connected');
  });
});
