import { UserLanguage, UserTheme } from '@prisma/client';
import * as Yup from 'yup';
import buildTranslationJson from '@/utils/build-translation-json';

const usernameMinLength = 3;
const usernameMaxLength = 10;
const usernameRegex = /^[a-zA-Z0-9_]*$/;
const passwordMinLength = 6;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

export const clientSignupSchema = Yup.object().shape({
  username: Yup.string()
    .matches(usernameRegex, buildTranslationJson('text.username_format'))
    .min(usernameMinLength, buildTranslationJson('text.username_length', { min: usernameMinLength, max: usernameMaxLength }))
    .max(usernameMaxLength, buildTranslationJson('text.username_length', { min: usernameMinLength, max: usernameMaxLength }))
    .required(buildTranslationJson('text.username_required')),
  password: Yup.string()
    .min(passwordMinLength, buildTranslationJson('text.password_min_length', { value: passwordMinLength }))
    .matches(passwordRegex, buildTranslationJson('text.password_format'))
    .required(buildTranslationJson('text.password_required')),
  password_confirmation: Yup.string()
    .min(passwordMinLength, buildTranslationJson('text.password_min_length', { value: passwordMinLength }))
    .matches(passwordRegex, buildTranslationJson('text.password_format'))
    .equals([Yup.ref('password')], buildTranslationJson('text.passwords_do_not_match'))
    .required('text.password_confirmation_required'),
});

export const serverSignupSchema = Yup.object().shape({
  username: Yup.string().matches(usernameRegex, "text.username_format").required(buildTranslationJson('text.username_format')).required(buildTranslationJson('text.username_required')),
  password: Yup.string().min(passwordMinLength, buildTranslationJson('text.password_min_length', { value: passwordMinLength })).matches(passwordRegex, buildTranslationJson('text.password_format')).required(buildTranslationJson('text.password_required')),
  password_confirmation: Yup.string().min(passwordMinLength, buildTranslationJson('text.password_min_length', { value: passwordMinLength })).matches(passwordRegex, buildTranslationJson('text.password_format')).required('text.password_confirmation_required').equals([Yup.ref('password')], buildTranslationJson('text.passwords_do_not_match')),
  theme: Yup.string().optional().oneOf(Object.values(UserTheme), buildTranslationJson('text.invalid_theme')),
  language: Yup.string().optional().oneOf(Object.values(UserLanguage), 'text.invalid_language'),
});
