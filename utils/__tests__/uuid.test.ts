/**
 * GitHub Issue: #2
 * Title: Core Todo Data Types & Utilities
 * Spec: https://github.com/iaminawe/todo-app-test/issues/2
 */

import { generateUUID, isValidUUID, generateShortId } from "../uuid";

describe("UUID Utilities", () => {
  describe("generateUUID", () => {
    it("should generate a valid UUID v4", () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it("should generate unique UUIDs", () => {
      const uuids = new Set();
      for (let i = 0; i < 100; i++) {
        uuids.add(generateUUID());
      }
      expect(uuids.size).toBe(100);
    });

    it("should have correct UUID v4 version bits", () => {
      const uuid = generateUUID();
      const versionChar = uuid[14];
      expect(versionChar).toBe("4");
    });
  });

  describe("isValidUUID", () => {
    it("should validate correct UUID v4", () => {
      const validUuid = "550e8400-e29b-41d4-a716-446655440000";
      expect(isValidUUID(validUuid)).toBe(true);
    });

    it("should reject invalid UUIDs", () => {
      expect(isValidUUID("not-a-uuid")).toBe(false);
      expect(isValidUUID("550e8400-e29b-11d4-a716-446655440000")).toBe(false); // v1 UUID
      expect(isValidUUID("550e8400e29b41d4a716446655440000")).toBe(false); // no hyphens
      expect(isValidUUID("")).toBe(false);
      expect(isValidUUID("550e8400-e29b-41d4-a716")).toBe(false); // too short
    });

    it("should be case insensitive", () => {
      expect(isValidUUID("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
      expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    });
  });

  describe("generateShortId", () => {
    it("should generate an 8-character string", () => {
      const shortId = generateShortId();
      expect(shortId).toHaveLength(8);
    });

    it("should generate hex characters only", () => {
      const shortId = generateShortId();
      expect(shortId).toMatch(/^[0-9a-f]{8}$/i);
    });

    it("should generate unique short IDs", () => {
      const shortIds = new Set();
      for (let i = 0; i < 100; i++) {
        shortIds.add(generateShortId());
      }
      // Allow for some collisions in short IDs, but should be mostly unique
      expect(shortIds.size).toBeGreaterThan(95);
    });
  });
});