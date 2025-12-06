// lib/validations/auth.ts
import { z } from "zod";

// ===== LOGIN VALIDATION =====
export interface LoginValidationMessages {
    emailRequired: string;
    passwordRequired: string;
    invalidEmailAddress: string;
    passwordMinLength: string;
}

const defaultLoginMessages: LoginValidationMessages = {
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    invalidEmailAddress: "Please enter a valid email address",
    passwordMinLength: "Password must be at least 8 characters long"
};

export const createLoginSchema = (messages: LoginValidationMessages = defaultLoginMessages) => {
    return z.object({
        email: z
            .string()
            .min(1, messages.emailRequired)
            .email(messages.invalidEmailAddress),
        password: z
            .string()
            .min(1, messages.passwordRequired)
            .min(8, messages.passwordMinLength)
    });
};

export const loginSchema = createLoginSchema();

// ===== SIGNUP VALIDATION =====
export interface SignupValidationMessages {
    nameRequired: string;
    emailRequired: string;
    invalidEmailAddress: string;
    passwordRequired: string;
    passwordMinLengthShort: string;
    passwordsNotMatch: string;
    phoneRequired: string;
    invalidPhone: string;
}

const defaultSignupMessages: SignupValidationMessages = {
    nameRequired: "Name is required",
    emailRequired: "Email is required",
    invalidEmailAddress: "Please enter a valid email address",
    passwordRequired: "Password is required",
    passwordMinLengthShort: "Password must be at least 6 characters",
    passwordsNotMatch: "Passwords do not match",
    phoneRequired: "Phone is required",
    invalidPhone: "Please enter a valid phone number"
};

export const createSignupSchema = (messages: SignupValidationMessages = defaultSignupMessages) => {
    return z.object({
        name: z
            .string()
            .min(1, messages.nameRequired)
            .min(2, "Name must be at least 2 characters"),
        email: z
            .string()
            .min(1, messages.emailRequired)
            .email(messages.invalidEmailAddress),
        password: z
            .string()
            .min(1, messages.passwordRequired)
            .min(6, messages.passwordMinLengthShort),
        passwordConfirm: z
            .string()
            .min(1, messages.passwordRequired)
            .min(6, messages.passwordMinLengthShort),
        phone: z
            .string()
            .min(1, messages.phoneRequired)
            .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im, messages.invalidPhone)
    }).refine((data) => data.password === data.passwordConfirm, {
        message: messages.passwordsNotMatch,
        path: ["passwordConfirm"]
    });
};

export const signupSchema = createSignupSchema();

// ===== FORGOT PASSWORD VALIDATION =====
export interface ForgotPasswordValidationMessages {
    emailRequired: string;
    invalidEmailAddress: string;
    resetCodeRequired: string;
    passwordRequired: string;
    passwordMinLengthShort: string;
}

const defaultForgotPasswordMessages: ForgotPasswordValidationMessages = {
    emailRequired: "Email is required",
    invalidEmailAddress: "Please enter a valid email address",
    resetCodeRequired: "Reset code is required",
    passwordRequired: "Password is required",
    passwordMinLengthShort: "Password must be at least 6 characters"
};

export const createForgotPasswordEmailSchema = (messages: ForgotPasswordValidationMessages = defaultForgotPasswordMessages) => {
    return z.object({
        email: z
            .string()
            .min(1, messages.emailRequired)
            .email(messages.invalidEmailAddress)
    });
};

export const createResetCodeSchema = (messages: ForgotPasswordValidationMessages = defaultForgotPasswordMessages) => {
    return z.object({
        resetCode: z
            .string()
            .min(1, messages.resetCodeRequired)
            .min(6, "Reset code must be at least 6 characters")
    });
};

export const createNewPasswordSchema = (messages: ForgotPasswordValidationMessages = defaultForgotPasswordMessages) => {
    return z.object({
        newPassword: z
            .string()
            .min(1, messages.passwordRequired)
            .min(6, messages.passwordMinLengthShort)
    });
};

export const forgotPasswordEmailSchema = createForgotPasswordEmailSchema();
export const resetCodeSchema = createResetCodeSchema();
export const newPasswordSchema = createNewPasswordSchema();

// ===== TYPE EXPORTS =====
export type LoginFormData = z.infer<typeof loginSchema>;
export type LoginFormErrors = z.ZodError['formErrors']['fieldErrors'];
export type SignupFormData = z.infer<typeof signupSchema>;
export type SignupFormErrors = z.ZodError['formErrors']['fieldErrors'];
