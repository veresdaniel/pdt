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
        footer: {
            copyright: '©2026 Ergománia',
            sections: {
                ergomania: {
                    title: 'Ergománia',
                    links: {
                        ourWork: 'Munkáink',
                        aboutUs: 'Rólunk',
                        services: 'Szolgáltatások'
                    }
                },
                followUs: {
                    title: 'Kövess minket',
                    links: {
                        facebook: 'Facebook',
                        twitter: 'Twitter',
                        linkedin: 'LinkedIn',
                        instagram: 'Instagram',
                        medium: 'Medium',
                        googlePlus: 'Google+'
                    }
                },
                contact: {
                    title: 'Kapcsolat'
                }
            }
        },

        "COMMON": {
            "PRIVACY_POLICY": "Adatvédelmi irányelvek",
            "COMPANY_NAME": "Ergomania kft.",
            "IMPRINT": "Impresszum",
            "SERVICES": "Szolgáltatások",
            "COMPANY": "Rólunk",
            "LEARN": "Tudástár",
            "OFFICES": "Irodák",
            "BLOG": "Blog",
            "TEAM": "Csapat",
        },
        "UX_SERVICES": {
            "TITLE": "UX Szolgáltatások",
            "DESCRIPTION": "Az UX-hez való megközelítésünk túlmutat a vizuális tervezésen. Teljes körű felelősséget vállalunk, kezdve a kezdeti az érdekeltek interjújával, folytatva minden szakaszon keresztül, és végül egy csiszolt digitális termék. ",
            "SERVICE_CATEGORIES": {
                "DEFINE": "Meghatároz",
                "DESIGN": "Tervezés",
                "DEVELOP": "Fejlesztés",
                "DISCOVER": "Felfedezés",
                "EDUCATION": "Oktatás",
                "AI": "AI"
            }
        },
        "OFFICE_ADDRESS": {
            "BUDAPEST": "Budapest",
            "BUDAPEST_ADDRESS": "1114 Bartók Béla u. 39.",
            "AMSTERDAM": "Amszterdam",
            "AMSTERDAM_ADDRESS": "Herengracht 124-128, 1015 BT <br /> Amszterdam, Hollandia"
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
        footer: {
            copyright: '©2026 Ergománia',
            sections: {
                ergomania: {
                    title: 'Ergománia',
                    links: {
                        ourWork: 'Our work',
                        aboutUs: 'About Us',
                        services: 'Services'
                    }
                },
                followUs: {
                    title: 'Follow Us',
                    links: {
                        facebook: 'Facebook',
                        twitter: 'Twitter',
                        linkedin: 'LinkedIn',
                        instagram: 'Instagram',
                        medium: 'Medium',
                        googlePlus: 'Google+'
                    }
                },
                contact: {
                    title: 'Contact'
                }
            }
        },
        "COMMON": {
            "BLOG": "Blog",
            "COMPANY_NAME": "Ergomania kft.",
            "COMPANY": "Company",
            "IMPRINT": "Imprint",
            "LEARN": "Learn",
            "OFFICES": "Offices",
            "PRIVACY_POLICY": "Privacy Policy",
            "SERVICES": "Services",
            "TEAM": "Team",
        },
        "OFFICE_ADDRESS": {
            "BUDAPEST": "Budapest",
            "BUDAPEST_ADDRESS": "1114 Bartók Béla street 39.",
            "AMSTERDAM": "Amsterdam",
            "AMSTERDAM_ADDRESS": "Herengracht 124-128, 1015 BT <br /> Amsterdam, Netherlands"
        }, "UX_SERVICES": {
            "TITLE": "UX Services",
            "DESCRIPTION": "Our approach to UX extends beyond designing visuals. We embrace end-to-end responsibility, starting from the initial stakeholder interview and continuing through every stage, culminating in a polished digital product.",
            "SERVICE_CATEGORIES": {
                "DEFINE": "Define",
                "DESIGN": "Design",
                "DEVELOP": "Develop",
                "DISCOVER": "Discover",
                "EDUCATION": "Education",
                "AI": "AI"
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