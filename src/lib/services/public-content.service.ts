import type { ComponentEnum } from '$lib/enums/component.enum';
import { PageEnum } from '$lib/enums/page.enum';
import { createHeadersWithAuthorization } from '$lib/functions/httpHelper';
import type { LocaleCode } from '$lib/types/locale.type';

function trimTrailingSlashes(value: string): string {
	return value.replace(/\/+$/, '');
}

export class PublicContentService {
	private readonly fetch: typeof globalThis.fetch;
	private readonly apiBaseUrl: string;

	constructor(fetchFn: typeof globalThis.fetch, apiBaseUrl: string) {
		this.fetch = fetchFn;
		this.apiBaseUrl = trimTrailingSlashes(apiBaseUrl);
	}

	async getByPageAndComponent(
		page: PageEnum,
		component: ComponentEnum,
		languageCode?: LocaleCode,
		index = 0
	): Promise<Record<string, string> | null> {
		const url = `${this.apiBaseUrl}/content/public/${page}/${component}/${index}`;
		const response = await this.fetch(url, {
			headers: createHeadersWithAuthorization(languageCode)
		});

		if (!response.ok) {
			return null;
		}

		const result = await response.json();
		return result && typeof result === 'object' ? result : null;
	}

	hasMeaningfulContent(content: Record<string, string> | null): content is Record<string, string> {
		if (!content || typeof content !== 'object') {
			return false;
		}

		return Object.values(content).some((value) => typeof value === 'string' && value.trim().length > 0);
	}

	async fetchIndexedContents(
		page: PageEnum,
		component: ComponentEnum,
		languageCode?: LocaleCode,
		maxItems = 24
	): Promise<{ index: number; content: Record<string, string> | null }[]> {
		const items: { index: number; content: Record<string, string> | null }[] = [];

		for (let index = 0; index <= maxItems; index += 1) {
			const content = await this.getByPageAndComponent(page, component, languageCode, index);
			if (!this.hasMeaningfulContent(content)) {
				break;
			}

			items.push({ index, content });
		}

		return items;
	}
}
