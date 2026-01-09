"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
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
        const user = await database_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal if user exists
            return res.json({
                success: true,
                message: 'If the email exists, a reset link has been sent',
            });
        }
        // TODO: Generate reset token and send email
        // For now, just acknowledge
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
        // TODO: Implement token verification and password reset
        res.json({
            success: true,
            message: 'Password reset successful',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.controller.js.map