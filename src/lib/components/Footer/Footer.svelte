<style lang="scss">
	@reference "#app.css";

	footer {
		@apply text-white p-0;
		background-color: var(--color-neutral-ultradark) !important;

		.footer-content {
			@apply py-10;
		}

		:global(.contact-form-block h2) {
			font-size: 1.75rem;
			line-height: 2rem;
			letter-spacing: 0;
			font-weight: 500;
		}

		@media (min-width: 1024px) {
			:global(.contact-form-block h2) {
				font-size: 3rem;
				line-height: 3.25rem;
			}
		}

		.footer-navigation {
			@apply pt-12;
			background-color: var(--color-neutral-ultradark) !important;
			color: #fff;

			* {
				color: #fff !important;
			}

			a:hover {
				opacity: 0.9;
			}

			:global(path) {
				fill: #fff;
			}

			.main-wrapper {
				@apply flex items-start justify-between flex-wrap sm:flex-nowrap gap-y-8 sm:gap-y-0;

				.brand-logo {
					@apply basis-full mb-8 grow sm:basis-0 sm:grow-0 sm:mb-0;
				}

				.title {
					@apply font-bold;
				}

				ul {
					li {
						@apply my-4 cursor-pointer;

						&:last-of-type {
							@apply mb-0;
						}
					}
				}

				& > div {
					@apply basis-[49%] sm:basis-1;
				}

				.offices-wrapper {
					@apply flex flex-col basis-1/2 sm:basis-auto;
					.offices {
						@apply flex flex-wrap sm:flex-nowrap sm:gap-8;

						.office {
							.title {
								@apply mb-4;
							}
							@apply my-4;
						}
					}
				}
			}
		}

		.sep {
			@apply mt-10 border-t border-solid border-x-0 border-b-0;
			border-color: #323854;
		}

		.bottom-links-wrapper {
			@apply flex flex-wrap items-center justify-between py-10;

			.bottom-links {
				@apply mt-8 sm:mt-0;

				ul {
					@apply flex gap-2 sm:gap-8 text-white;
				}
			}
		}
	}
</style>

<script lang="ts">
	import { t } from '$lib/i18n/i18n';
	import type { ContactPerson } from '@ergodot/ui-kit';
	import { ContactFormBlock } from '@ergodot/ui-kit';
	import FooterSocial from './FooterSocial.svelte';
	import Logo from '$lib/assets/ergomania-logo.svelte';
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

	const ergomaniaHref = (path: string) => toErgomaniaSiteUrl(path, locale, ergomaniaSiteBase);

	function handleContactSubmit(_data: { name: string; email: string; message: string }) {
		// TODO: submit to API (e.g. same as old contact form)
	}
</script>

<footer>
	<div class="footer-content app-content-wrapper px-10">
		<div class="section">
			<ContactFormBlock
				contentPaddingX="none"
				titlePart1={footerData.titlePart1}
				titlePart2={footerData.titlePart2}
				{contactPersons}
				phone={footerData.phone}
				email={footerData.email}
				namePlaceholder={footerData.namePlaceholder}
				emailPlaceholder={footerData.emailPlaceholder}
				messagePlaceholder={footerData.messagePlaceholder}
				privacyLabelHtml={footerData.privacyLabelHtml}
				submitButtonLabel={footerData.submitButtonLabel}
				onSubmit={handleContactSubmit}
			/>
		</div>

		<section class="footer-navigation text-body-sm text-white">
			<div class="section main-wrapper">
				<a href={ergomaniaHref('/')} class="brand-logo text-white">
					<Logo />
				</a>
				<div class="text-white">
					<div class="title text-body-sm">{$t('COMMON.SERVICES')}</div>
					<ul class="text-body-sm text-white">
						<li><a href={ergomaniaHref('/ux-services/#discover')} class="text-white">{$t('UX_SERVICES.SERVICE_CATEGORIES.DISCOVER')}</a></li>
						<li><a href={ergomaniaHref('/ux-services/#define')} class="text-white">{$t('UX_SERVICES.SERVICE_CATEGORIES.DEFINE')}</a></li>
						<li><a href={ergomaniaHref('/ux-services/#design')} class="text-white">{$t('UX_SERVICES.SERVICE_CATEGORIES.DESIGN')}</a></li>
						<li><a href={ergomaniaHref('/ux-services/#develop')} class="text-white">{$t('UX_SERVICES.SERVICE_CATEGORIES.DEVELOP')}</a></li>
						<li><a href={ergomaniaHref('/ux-services/#education')} class="text-white">{$t('UX_SERVICES.SERVICE_CATEGORIES.EDUCATION')}</a></li>
						<li><a href={ergomaniaHref('/ux-services/')} class="text-white">{$t('UX_SERVICES.SERVICE_CATEGORIES.AI')}</a></li>
					</ul>
				</div>
				<div class="text-white">
					<div class="title text-body-sm">{$t('COMMON.COMPANY')}</div>
					<ul class="text-body-sm text-white">
						<li><a href={ergomaniaHref('/ux-team/')} class="text-white">{$t('COMMON.TEAM')}</a></li>
						<li><a href={ergomaniaHref('/imprint/')} class="text-white">{$t('COMMON.IMPRINT')}</a></li>
					</ul>
				</div>
				<div class="text-white">
					<div class="title text-body-sm">{$t('COMMON.LEARN')}</div>
					<ul class="text-body-sm text-white">
						<li><a href={ergomaniaHref('/ux-and-product-design-blog/')} class="text-white">{$t('COMMON.BLOG')}</a></li>
						<li></li>
					</ul>
				</div>
				<div class="offices-wrapper text-white">
					<div class="title text-body-sm">{$t('COMMON.OFFICES')}</div>
					<div class="offices">
						<div class="office text-body-sm">
							<div class="title">{$t('OFFICE_ADDRESS.BUDAPEST')}</div>
							<div>{@html $t('OFFICE_ADDRESS.BUDAPEST_ADDRESS')}</div>
						</div>
						<div class="office text-body-sm">
							<div class="title">{$t('OFFICE_ADDRESS.AMSTERDAM')}</div>
							<div>{@html $t('OFFICE_ADDRESS.AMSTERDAM_ADDRESS')}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="section sep"></div>
			<section class="section bottom-links-wrapper">
				<FooterSocial />
				<div class="bottom-links text-white">
					<ul class="text-body-sm text-white">
						<li><a href={ergomaniaHref('/privacy-policy/')} class="break-all text-white">{$t('COMMON.PRIVACY_POLICY')}</a></li>
						<li><a href={ergomaniaHref('/imprint/')} class="text-white">{$t('COMMON.IMPRINT')}</a></li>
						<li>&copy; {new Date().getFullYear()} {$t('COMMON.COMPANY_NAME')}</li>
					</ul>
				</div>
			</section>
		</section>
	</div>
</footer>
