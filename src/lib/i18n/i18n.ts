import { derived } from 'svelte/store';
import { page } from '$app/stores';

export type Locale = 'hu' | 'en';

export const locales: Locale[] = ['hu', 'en'];

export const translations = {
    hu: {
        nav: {
            productDesignTalks: 'Product Design Talks',
            program: 'Program',
            contact: 'Kapcsolat',
            register: 'REGISZTRÁLOK',
            eventMenuUpcoming: 'Közelgő események',
            eventMenuPast: 'Korábbi események'
        },
        event: {
            program: "Programme",
        },
        events: {
            noEvents: 'Nincsenek megjeleníthető események.'
        },
        registration: {
            title: 'Regisztrálj',
            subtitle: 'Gyorsan töltődnek a helyek. Regisztrálj most!',
            fields: {
                lastName: 'Vezetéknév',
                firstName: 'Keresztnév',
                company: 'Cég',
                position: 'Beosztás',
                email: 'E-mail',
                phone: 'Telefon',
                city: "Város",
                your: {
                    lastName: 'Vezetékneved',
                    firstName: 'Keresztneved',
                    company: 'A cég neve ahol dolgozol',
                    position: 'A cég neve ahol dolgozol',
                    email: 'your.email@example.com',
                    phone: '+36 30 123 4567',
                }
            },
            important: 'Fontos megjegyzés:',
            disclaimer: 'A regisztrációval hozzájárulsz ahhoz, hogy az eseményről kapcsolódási és marketing célú kommunikációt küldjünk számodra. A létrehozásról bármikor leiratkozhatsz.',
            submit: 'Beküldés',
            required: '*',
            optional: '(Opcionális)',
            submitting: 'Küldés...',
            success: '✓ Sikeres regisztráció!',
            newRegistration: 'Új regisztráció',
            errors: {
                lastName: 'A vezetéknév legalább 2 karakter kell legyen',
                firstName: 'A keresztnév legalább 2 karakter kell legyen',
                company: 'A cég neve legalább 2 karakter kell legyen',
                email: 'Kérjük, adjon meg egy érvényes email címet',
                phone: 'Kérjük, adjon meg egy érvényes telefonszámot',
                city: "Kérjük, válasszon várost",
                general: 'Hiba történt. Kérjük, próbálja újra.'
            }
        },
    },
    en: {
        nav: {
            productDesignTalks: 'Product Design Talks',
            program: 'Programme',
            contact: 'Contact',
            register: 'REGISTER',
            eventMenuUpcoming: 'Upcoming events',
            eventMenuPast: 'Past events'
        },
        event: {
            program: "Programme",
        },
        events: {
            noEvents: 'There is no available events.'
        },
        registration: {
            title: 'Register',
            subtitle: 'Spaces are filling up fast. Register now!',
            fields: {
                lastName: 'Last Name',
                firstName: 'First Name',
                company: 'Company',
                position: 'Position',
                email: 'E-mail',
                phone: 'Phone',
                city: "City",
                your: {
                    lastName: 'Your Last Name',
                    firstName: 'Your First Name',
                    company: 'Company, where you work',
                    position: 'Your position',
                    email: 'your.email@example.com',
                    phone: '+36 30 123 4567',
                }
            },
            important: 'Fontos megjegyzés:',
            disclaimer: 'By registering, you agree to receive event-related and marketing communications from us. You can unsubscribe at any time.',
            submit: 'Submit',
            required: '*',
            optional: '(Optional)',
            submitting: 'Submitting...',
            success: '✓ Registration successful!',
            newRegistration: 'New Registration',
            errors: {
                lastName: 'Last name must be at least 2 characters',
                firstName: 'First name must be at least 2 characters',
                company: 'Company name must be at least 2 characters',
                email: 'Please enter a valid email address',
                phone: 'Please enter a valid phone number',
                city: 'Please choose a city',
                general: 'An error occurred. Please try again.'
            }
        },
    }
} as const;

// Helper function for translation
function translate(locale: Locale, key: string, vars: Record<string, string> = {}): string {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
        value = value?.[k];
    }

    if (typeof value !== 'string') return key;

    let result = value;
    for (const [k, v] of Object.entries(vars)) {
        result = result.replace(`{${k}}`, v);
    }

    return result;
}

// Global reactive locale store from URL params
export const locale = derived(
    page,
    ($page) => ($page.params.lang as Locale) || 'hu'
);

// Global translation store
export const t = derived(
    locale,
    ($locale) => (key: string, vars: Record<string, string> = {}) => {
        return translate($locale, key, vars);
    }
);