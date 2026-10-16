<script lang="ts">
	/* The footer itself lives in the UI kit (SiteFooter), the same as on the main site; this wrapper only feeds it
	   the CMS contact texts (Common / Footer), our link labels and links pointing to the main site. */
	import { t } from '$lib/i18n/i18n';
	import type { ContactPerson, SiteFooterLabels } from '@ergodot/ui-kit';
	import { SiteFooter } from '@ergodot/ui-kit';
	import type { buildFooterData } from '$lib/functions/common-content.mappers';
	import { toErgomaniaSiteUrl } from '$lib/functions/ergomaniaSiteUrl';
	import type { LocaleCode } from '$lib/types/locale.type';

	let {
		footerData,
		contactPersons = [],
		ergomaniaSiteBase,
		locale
	}: {
		footerData: ReturnType<typeof buildFooterData>;
		contactPersons?: ContactPerson[];
		ergomaniaSiteBase: string;
		locale: LocaleCode;
	} = $props();

	/** Footer links go to the main site (localised), e.g. /ux-team/ → https://ergomania.eu/hu/ux-team/ */
	const ergomaniaHref = (path: string) => toErgomaniaSiteUrl(path, locale, ergomaniaSiteBase);

	const privacyLabelHtml = $derived.by(() => {
		const fromCms = footerData.privacyLabelHtml?.trim() ?? '';
		if (!fromCms || fromCms.includes('common.footer.privacyLabelHtml')) {
			// Same as the main site: sending the message itself is the consent (no checkbox)
			return $t('footer.contactConsentHtml').replaceAll('{privacyUrl}', ergomaniaHref('/privacy-policy/'));
		}
		return fromCms;
	});

	const labels: SiteFooterLabels = $derived({
		services: $t('footer.services'),
		discover: $t('footer.discover'),
		define: $t('footer.define'),
		design: $t('footer.design'),
		develop: $t('footer.develop'),
		education: $t('footer.education'),
		ai: $t('footer.ai'),
		company: $t('footer.company'),
		team: $t('footer.team'),
		imprint: $t('footer.imprint'),
		learn: $t('footer.learn'),
		blog: $t('footer.blog'),
		offices: $t('footer.offices'),
		amsterdam: $t('footer.amsterdam'),
		amsterdamAddressHtml: $t('footer.amsterdamAddress'),
		budapest: $t('footer.budapest'),
		budapestAddressHtml: $t('footer.budapestAddress'),
		privacyPolicy: $t('footer.privacyPolicy'),
		companyName: $t('footer.companyName')
	});

	function handleContactSubmit(_data: { name: string; email: string; message: string }) {
		// TODO: submit to API (e.g. same as old contact form)
	}
</script>

<SiteFooter
	contact={{
		titlePart1: footerData.titlePart1,
		titlePart2: footerData.titlePart2,
		phone: footerData.phone,
		email: footerData.email,
		namePlaceholder: footerData.namePlaceholder,
		emailPlaceholder: footerData.emailPlaceholder,
		messagePlaceholder: footerData.messagePlaceholder,
		privacyLabelHtml,
		submitButtonLabel: footerData.submitButtonLabel
	}}
	{contactPersons}
	{labels}
	href={ergomaniaHref}
	logoHref={ergomaniaHref('/')}
	onContactSubmit={handleContactSubmit}
/>
