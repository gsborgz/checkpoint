import { UserLanguage, UserTheme } from '@prisma/client';
import * as Yup from 'yup';

const passwordMinLength = 6;

export const clientSignupSchema = Yup.object().shape({
  email: Yup.string().email(JSON.stringify({ key: 'text.invalid_email' })).required(JSON.stringify({ key: 'text.email_required' })),
  password: Yup.string().min(passwordMinLength, JSON.stringify({ key: 'text.password_min_length', args: { value: passwordMinLength } })).required(JSON.stringify({ key: 'text.password_required' })),
  password_confirmation: Yup.string().min(passwordMinLength, JSON.stringify({ key: 'text.password_min_length', args: { value: passwordMinLength } })).required('text.password_confirmation_required').equals([Yup.ref('password')], JSON.stringify({ key: 'text.passwords_do_not_match' })),
});

export const serverSignupSchema = Yup.object().shape({
  email: Yup.string().email(JSON.stringify({ key: 'text.invalid_email' })).required(JSON.stringify({ key: 'text.email_required' })),
  password: Yup.string().min(passwordMinLength, JSON.stringify({ key: 'text.password_min_length', args: { value: passwordMinLength } })).required(JSON.stringify({ key: 'text.password_required' })),
  password_confirmation: Yup.string().min(passwordMinLength, JSON.stringify({ key: 'text.password_min_length', args: { value: passwordMinLength } })).required('text.password_confirmation_required').equals([Yup.ref('password')], JSON.stringify({ key: 'text.passwords_do_not_match' })),
  theme: Yup.string().optional().oneOf(Object.values(UserTheme), JSON.stringify({ key: 'text.invalid_theme' })),
  language: Yup.string().optional().oneOf(Object.values(UserLanguage), 'text.invalid_language'),
});