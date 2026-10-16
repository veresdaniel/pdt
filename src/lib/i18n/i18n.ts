import { derived } from 'svelte/store';
import { page } from '$app/stores';

export type Locale = 'hu' | 'en';

export const locales: Locale[] = ['hu', 'en'];

export const translations = {
    hu: {
        eventHero: {
            register: 'Regisztrálok',
            addToCalendar: 'Hozzáadom a naptáramhoz',
            typePdt: 'Product Design Talks',
            typeBb: 'Business Breakfast'
        },
        eventPast: {
            title: 'Korábbi események',
            all: 'Összes esemény'
        },
        eventAside: {
            date: 'Időpont',
            location: 'Helyszín',
            share: 'Megosztom',
            linkCopied: 'Link másolva'
        },
        footer: {
            // Same texts as the main site (frontend/src/lib/i18n/hu.json) – the footer is the shared ui-kit SiteFooter
            services: 'Szolgáltatások',
            discover: 'Felfedezés',
            define: 'Meghatároz',
            design: 'Tervezés',
            develop: 'Fejlesztés',
            education: 'Oktatás',
            ai: 'AI',
            company: 'Rólunk',
            team: 'Csapat',
            imprint: 'Impresszum',
            learn: 'Tudástár',
            blog: 'Blog',
            offices: 'Irodák',
            amsterdam: 'Amszterdam',
            amsterdamAddress: 'Kraijenhoffstraat 137A, 1018RG<br /> Amszterdam, Hollandia',
            budapest: 'Budapest',
            budapestAddress: '1114 Bartók Béla u. 39.',
            privacyPolicy: 'Adatvédelmi irányelvek',
            companyName: 'Ergomania kft.',
            contactConsentHtml: 'Az Üzenet küldése gomb megnyomásával elfogadod a <a href="{privacyUrl}">Felhasználási feltételeket</a> és az <a href="{privacyUrl}">Adatvédelmi szabályzatot</a>.'
        },
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
            // Texts of the Figma "Event page • Desktop" registration block (2026-10)
            title: 'Regisztráció',
            subtitle: 'A férőhelyek száma korlátozott, ne maradj le!',
            fields: {
                lastName: 'Vezetéknév',
                firstName: 'Utónév',
                company: 'Cég',
                position: 'Beosztás',
                email: 'Munkahelyi e-mail',
                phone: 'Telefon',
                city: "Város",
                your: {
                    lastName: 'Vezetékneved',
                    firstName: 'Utóneved',
                    company: 'A cég neve, ahol dolgozol',
                    position: 'A beosztásod',
                    email: 'your.mail@example.com',
                    phone: '+36 30 123 4567',
                }
            },
            terms: 'A regisztrációval elfogadod az <a href="{privacyUrl}">Adatkezelési Tájékoztatót</a> és az <a href="{privacyUrl}">Adatvédelmi szabályzatot.</a>',
            important: 'Fontos megjegyzés:',
            note1: 'A részvétel a regisztráció visszaigazolásához kötött. Kérjük, csak akkor érkezz az eseményre, ha megerősítettük a helyed.',
            note2: 'A regisztrációval hozzájárulsz hírleveleink és marketingcélú üzeneteink küldéséhez (amelyekről bármikor leiratkozhatsz), és tudomásul veszed, hogy az eseményen kép- és hangfelvétel készülhet rólad.',
            submit: 'Regisztrálok',
            required: '*',
            optional: '(Opcionális)',
            submitting: 'Küldés...',
            success: '✓ Sikeres regisztráció!',
            newRegistration: 'Új regisztráció',
            errors: {
                lastName: 'A vezetéknév legalább 2 karakter legyen.',
                firstName: 'Az utónév legalább 2 karakter legyen.',
                company: 'A cég neve legalább 2 karakter legyen.',
                email: 'Adj meg egy érvényes e-mail-címet.',
                phone: 'Adj meg egy érvényes telefonszámot.',
                city: "Válassz egy várost a listából.",
                general: 'Hiba történt. Kérjük, próbáld újra.'
            }
        },
    },
    en: {
        eventHero: {
            register: 'Register',
            addToCalendar: 'Add to my calendar',
            typePdt: 'Product Design Talks',
            typeBb: 'Business Breakfast'
        },
        eventPast: {
            title: 'Past events',
            all: 'All events'
        },
        eventAside: {
            date: 'Date',
            location: 'Location',
            share: 'Share',
            linkCopied: 'Link copied'
        },
        footer: {
            // Same texts as the main site (frontend/src/lib/i18n/en.json) – the footer is the shared ui-kit SiteFooter
            services: 'Services',
            discover: 'Discover',
            define: 'Define',
            design: 'Design',
            develop: 'Develop',
            education: 'Education',
            ai: 'AI',
            company: 'Company',
            team: 'Team',
            imprint: 'Imprint',
            learn: 'Learn',
            blog: 'Blog',
            offices: 'Offices',
            amsterdam: 'Amsterdam',
            amsterdamAddress: 'Kraijenhoffstraat 137A, 1018RG<br /> Amsterdam, Netherlands',
            budapest: 'Budapest',
            budapestAddress: '1114 Bartók Béla street 39.',
            privacyPolicy: 'Privacy Policy',
            companyName: 'Ergomania kft.',
            contactConsentHtml: 'By pressing Send message, you agree to our <a href="{privacyUrl}">Terms and Conditions</a> and <a href="{privacyUrl}">Privacy Policy</a>.'
        },
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
            title: 'Registration',
            subtitle: 'Places are limited – don’t miss out!',
            fields: {
                lastName: 'Last name',
                firstName: 'First name',
                company: 'Company',
                position: 'Position',
                email: 'Work e-mail',
                phone: 'Phone',
                city: "City",
                your: {
                    lastName: 'Your last name',
                    firstName: 'Your first name',
                    company: 'The company you work for',
                    position: 'Your position',
                    email: 'your.mail@example.com',
                    phone: '+36 30 123 4567',
                }
            },
            terms: 'By registering, you accept our <a href="{privacyUrl}">Privacy Notice</a> and <a href="{privacyUrl}">Privacy Policy.</a>',
            important: 'Important:',
            note1: 'Participation is subject to the confirmation of your registration. Please only come to the event once we have confirmed your place.',
            note2: 'By registering, you agree to receive our newsletters and marketing messages (you can unsubscribe at any time) and acknowledge that photos and audio recordings may be taken of you at the event.',
            submit: 'Register',
            required: '*',
            optional: '(Optional)',
            submitting: 'Submitting...',
            success: '✓ Registration successful!',
            newRegistration: 'New registration',
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