"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
const email_1 = require("../utils/email");
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { email, password, fullName, phone } = req.body;
        // Validation
        if (!email || !password || !fullName) {
            throw new errorHandler_1.AppError('Please provide all required fields', 400);
        }
        // Check if user exists
        const existingUser = await database_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new errorHandler_1.AppError('Email already registered', 400);
        }
        // Hash password
        const passwordHash = await (0, password_1.hashPassword)(password);
        // Create user
        const user = await database_1.prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName,
                phone,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });
        // Generate token
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        // Send welcome email
        try {
            await (0, email_1.sendEmail)({
                to: user.email,
                subject: 'Welcome to ORA Jewellery',
                html: (0, email_1.getWelcomeEmailTemplate)(user.fullName),
            });
        }
        catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }
        res.status(201).json({
            success: true,
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Validation
        if (!email || !password) {
            throw new errorHandler_1.AppError('Please provide email and password', 400);
        }
        // Find user
        const user = await database_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        // Check password
        const isPasswordValid = await (0, password_1.comparePassword)(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        // Generate token
        const token = (0, jwt_1.generateToken)({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    phone: user.phone,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        const user = await database_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
                isVerified: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const { fullName, phone } = req.body;
        const user = await database_1.prisma.user.update({
            where: { id: req.user.id },
            data: {
                ...(fullName && { fullName }),
                ...(phone && { phone }),
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: true,
            },
        });
        res.json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new errorHandler_1.AppError('Email is required', 400);
        }
        const user = await database_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal if user exists for security
            return res.json({
                success: true,
                message: 'If the email exists, a reset link has been sent',
            });
        }
        // Generate reset token (crypto random)
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenHash = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        // Token expires in 1 hour
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        // Delete any existing reset tokens for this user
        await database_1.prisma.passwordReset.deleteMany({
            where: { userId: user.id },
        });
        // Create password reset record
        await database_1.prisma.passwordReset.create({
            data: {
                userId: user.id,
                token: resetTokenHash,
                expiresAt,
            },
        });
        // Send reset email
        const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
        try {
            await (0, email_1.sendEmail)({
                to: user.email,
                subject: 'Reset Your ORA Password',
                html: (0, email_1.getPasswordResetEmailTemplate)(user.fullName, resetUrl),
            });
        }
        catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            throw new errorHandler_1.AppError('Failed to send reset email. Please try again.', 500);
        }
        res.json({
            success: true,
            message: 'Password reset instructions sent to email',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
    try {
        const { token, email, newPassword, confirmPassword } = req.body;
        if (!token || !email || !newPassword) {
            throw new errorHandler_1.AppError('Missing required fields', 400);
        }
        if (newPassword !== confirmPassword) {
            throw new errorHandler_1.AppError('Passwords do not match', 400);
        }
        if (newPassword.length < 6) {
            throw new errorHandler_1.AppError('Password must be at least 6 characters', 400);
        }
        // Find user
        const user = await database_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new errorHandler_1.AppError('Invalid reset request', 400);
        }
        // Hash the token to compare
        const resetTokenHash = crypto_1.default.createHash('sha256').update(token).digest('hex');
        // Find valid reset token
        const passwordReset = await database_1.prisma.passwordReset.findFirst({
            where: {
                userId: user.id,
                token: resetTokenHash,
                expiresAt: { gt: new Date() }, // Not expired
            },
        });
        if (!passwordReset) {
            throw new errorHandler_1.AppError('Invalid or expired reset token', 400);
        }
        // Hash new password
        const passwordHash = await (0, password_1.hashPassword)(newPassword);
        // Update user password and delete reset token
        await database_1.prisma.$transaction([
            database_1.prisma.user.update({
                where: { id: user.id },
                data: { passwordHash },
            }),
            database_1.prisma.passwordReset.delete({
                where: { id: passwordReset.id },
            }),
        ]);
        res.json({
            success: true,
            message: 'Password reset successful. You can now login with your new password.',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.controller.js.map