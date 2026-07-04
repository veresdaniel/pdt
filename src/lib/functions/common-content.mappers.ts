import type { ContactPerson } from '@ergodot/ui-kit';
import type { FormatMissingFn } from '$lib/functions/formatMissingTranslation';
import {
	cmsKey,
	getCmsText,
	getCmsTextFromKeys,
	getUrl,
	getValueByKey,
	resolvePrivacyLabelHtml,
	type IndexedContentItem
} from '$lib/functions/cms-content.helpers';

type Content = Record<string, string> | null;

function optionalUrl(content: Content, keys: string[]): string | undefined {
	if (!content) return undefined;
	for (const key of keys) {
		const value = getValueByKey(content, key);
		if (typeof value === 'string' && value.trim().length > 0) {
			return value.trim();
		}
	}
	return undefined;
}

export function buildFooterData(content: Content, formatMissing: FormatMissingFn) {
	const page = 'common';
	const component = 'footer';

	return {
		titlePart1: getCmsText(content, 'titlePart1', cmsKey(page, component, 'titlePart1'), formatMissing),
		titlePart2: getCmsText(content, 'titlePart2', cmsKey(page, component, 'titlePart2'), formatMissing),
		phone: getCmsText(content, 'phone', cmsKey(page, component, 'phone'), formatMissing),
		email: getCmsText(content, 'email', cmsKey(page, component, 'email'), formatMissing),
		namePlaceholder: getCmsText(
			content,
			'namePlaceholder',
			cmsKey(page, component, 'namePlaceholder'),
			formatMissing
		),
		emailPlaceholder: getCmsText(
			content,
			'emailPlaceholder',
			cmsKey(page, component, 'emailPlaceholder'),
			formatMissing
		),
		messagePlaceholder: getCmsText(
			content,
			'messagePlaceholder',
			cmsKey(page, component, 'messagePlaceholder'),
			formatMissing
		),
		privacyLabelHtml: resolvePrivacyLabelHtml(content, formatMissing, page, component),
		submitButtonLabel: getCmsText(
			content,
			'submitButtonLabel',
			cmsKey(page, component, 'submitButtonLabel'),
			formatMissing
		)
	};
}

export function buildFooterContactPersons(
	items: IndexedContentItem[],
	formatMissing: FormatMissingFn,
	locale?: string | null
): ContactPerson[] {
	const page = 'common';
	const component = 'footerContactPerson';

	return items.map((item) => {
		const content = item.content;
		const cmsIndex = item.index;

		return {
			name: getCmsTextFromKeys(
				content,
				['name', 'personName'],
				cmsKey(page, component, 'name', cmsIndex),
				formatMissing
			),
			position: getCmsTextFromKeys(
				content,
				['position', 'personPosition'],
				cmsKey(page, component, 'position', cmsIndex),
				formatMissing
			),
			image: optionalUrl(content, ['image', 'imageUrl', 'personImageUrl']),
			linkedInHref: optionalUrl(content, ['linkedInHref', 'linkedInUrl']),
			bookCallLabel: getCmsTextFromKeys(
				content,
				['bookCallLabel', 'ctaLabel', 'buttonText'],
				cmsKey(page, component, 'bookCallLabel', cmsIndex),
				formatMissing
			),
			bookCallHref: getUrl(
				content,
				'bookCallHref',
				getUrl(content, 'bookCallUrl', getUrl(content, 'buttonUrl', '#', locale), locale),
				locale
			)
		};
	});
}
