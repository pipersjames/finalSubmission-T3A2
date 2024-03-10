const {
    comparePassword,
    generateJwt,
    verifyToken,
    getUserIdFromToken
} = require('../utils/userAuthFunctions.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock console.error to prevent it from being logged during testing
console.error = jest.fn();

describe('Authentication Functions', () => {
    describe('comparePassword', () => {
        test('should return true if password matches', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const result = await comparePassword('password123', hashedPassword);
            expect(result).toBe(true);
        });

        test('should return false if password does not match', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const result = await comparePassword('wrongpassword', hashedPassword);
            expect(result).toBe(false);
        });
    });

    describe('generateJwt', () => {
        test('should generate a JWT token', () => {
            const token = generateJwt('user123');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-key');
            expect(decoded.userId).toBe('user123');
        });
    });

    describe('getUserIdFromToken', () => {
        test('should extract userId from a valid JWT token', () => {
            const token = jwt.sign({ userId: 'user123' }, process.env.JWT_SECRET || 'test-key');
            const userId = getUserIdFromToken(token);
            expect(userId).toBe('user123');
        });

        test('should return null if token is missing', () => {
            const userId = getUserIdFromToken(null);
            expect(userId).toBe(null);
        });

        test('should return null if token is invalid', () => {
            const userId = getUserIdFromToken('invalidtoken');
            expect(userId).toBe(null);
        });
    });

    describe('verifyToken', () => {
        test('should return 401 if token is missing', () => {
            const request = { headers: {} };
            const response = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
            const next = jest.fn();
            verifyToken(request, response, next);
            expect(response.status).toHaveBeenCalledWith(401);
            expect(next).not.toHaveBeenCalled();
        });

        test('should return 403 if token is invalid', () => {
            const request = { headers: { jwt: 'invalidtoken' } };
            const response = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
            const next = jest.fn();
            verifyToken(request, response, next);
            expect(response.status).toHaveBeenCalledWith(403);
            expect(next).not.toHaveBeenCalled();
        });

        test('should call next if token is valid', () => {
            const token = jwt.sign({ userId: 'user123' }, process.env.JWT_SECRET || 'test-key');
            const request = { headers: { jwt: token } };
            const response = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
            const next = jest.fn();
            verifyToken(request, response, next);
            expect(response.status).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
        });
    });
});