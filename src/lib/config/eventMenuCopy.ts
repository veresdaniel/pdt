import type { LocaleCode } from '$lib/types/locale.type';

export type EventMenuCategoryCopy = {
  title: string;
  subtitle: string;
  description: string;
};

export type EventMenuCopy = {
  pdt: EventMenuCategoryCopy;
  bb: EventMenuCategoryCopy;
};

const EVENT_MENU_COPY: Record<LocaleCode, EventMenuCopy> = {
  en: {
    pdt: {
      title: 'Product Design Talks',
      subtitle: 'Product Design Talks',
      description:
        'Our Product Design Talks bring together designers, product teams, and business leaders to explore real-world UX challenges, share practical insights, and learn from industry experts.'
    },
    bb: {
      title: 'Business Breakfasts',
      subtitle: 'Business Breakfasts',
      description:
        'Business Breakfasts are intimate morning sessions where we discuss product, UX, and digital strategy with decision-makers in a focused, conversational setting.'
    }
  },
  hu: {
    pdt: {
      title: 'Product Design Talks',
      subtitle: 'Product Design Talks',
      description:
        'A Product Design Talks eseményeinken designerek, termékcsapatok és üzleti döntéshozók találkoznak: valós UX kihívásokról, gyakorlati tanulságokról és iparági trendekről beszélgetünk.'
    },
    bb: {
      title: 'Business Breakfasts',
      subtitle: 'Business Breakfasts',
      description:
        'A Business Breakfast reggeli eseményeinken szűk körben, közvetlen hangnemben beszélgetünk termék-, UX- és digitális stratégiai témákról döntéshozókkal.'
    }
  },
  de: {
    pdt: {
      title: 'Product Design Talks',
      subtitle: 'Product Design Talks',
      description:
        'Bei unseren Product Design Talks tauschen sich Designer, Produktteams und Entscheider über reale UX-Herausforderungen, praxisnahe Erkenntnisse und Branchentrends aus.'
    },
    bb: {
      title: 'Business Breakfasts',
      subtitle: 'Business Breakfasts',
      description:
        'Business Breakfasts sind kompakte Morgenformate, in denen wir mit Entscheidern in kleiner Runde über Produkt-, UX- und Digitalstrategie sprechen.'
    }
  },
  nl: {
    pdt: {
      title: 'Product Design Talks',
      subtitle: 'Product Design Talks',
      description:
        'During Product Design Talks, designers, product teams, and business leaders discuss real UX challenges, practical insights, and trends from the field.'
    },
    bb: {
      title: 'Business Breakfasts',
      subtitle: 'Business Breakfasts',
      description:
        'Business Breakfasts are small morning sessions where we talk with decision-makers about product, UX, and digital strategy in an informal setting.'
    }
  }
};

export function getEventMenuCopy(locale: LocaleCode): EventMenuCopy {
  return EVENT_MENU_COPY[locale] ?? EVENT_MENU_COPY.en;
}
