import { describe, it, expect, beforeAll } from 'vitest';
import { encrypt, decrypt } from '../utils/encryption.js';
import crypto from 'crypto';

describe('Encryption Utils', () => {
  beforeAll(() => {
    // Generate a valid 32-byte key in base64
    process.env.ENCRYPTION_KEY = crypto.randomBytes(32).toString('base64');
  });

  it('should encrypt and decrypt a string successfully', () => {
    const originalText = 'Hello, Secret World!';
    
    const encrypted = encrypt(originalText);
    expect(encrypted).not.toBe(originalText);
    expect(encrypted.split(':')).toHaveLength(3); // iv, tag, ciphertext
    
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(originalText);
  });

  it('should fail to decrypt with wrong format', () => {
    expect(() => decrypt('invalid:format')).toThrow('Invalid encrypted text format');
  });

  it('should throw error if ENCRYPTION_KEY is missing', () => {
    const backupKey = process.env.ENCRYPTION_KEY;
    delete process.env.ENCRYPTION_KEY;
    
    expect(() => encrypt('test')).toThrow('ENCRYPTION_KEY environment variable is not set');
    
    process.env.ENCRYPTION_KEY = backupKey;
  });
});
