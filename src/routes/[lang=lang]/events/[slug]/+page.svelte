<script lang="ts">
    import { locale, t } from "$lib/i18n/i18n";
    import { Section } from "@ergodot/ui-kit";
    import Registration from "$lib/components/Registration.svelte";
    import Button from "$lib/components/Button.svelte";
    import CalendarIcon from "$lib/assets/calendar.svg";
    import PinIcon from "$lib/assets/pin.svg";
    import { page } from "$app/state";
    import { PUBLIC_ERGOMANIA_SITE_URL } from "$env/static/public";

    let { data } = $props();

    /** Event type tag (Figma): 0 = Product Design Talks, 1 = Business Breakfast */
    const eventTypeLabel = $derived(
        String(data.event.type) === "1" ? $t("eventHero.typeBb") : $t("eventHero.typePdt"),
    );

    /** Intro block: one shared text per event type from the CMS (admin → Content → Event page) */
    const introSuffix = $derived(String(data.event.type) === "1" ? "Bb" : "Pdt");
    const introTitle = $derived(String(data.pageContent?.[`eventIntroTitle${introSuffix}`] ?? "").trim());
    const introText = $derived(String(data.pageContent?.[`eventIntroText${introSuffix}`] ?? "").trim());

    function formatDate(date) {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString(
            page.params.lang === "hu" ? "hu-HU" : "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
            },
        );
    }

    function formatTime(date) {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleTimeString(
            page.params.lang === "hu" ? "hu-HU" : "en-US",
            {
                hour: "numeric",
                minute: "2-digit",
            },
        );
    }

    function formatDateTime(date) {
        if (!date) return "";
        return `${formatDate(date)}, ${formatTime(date)}`;
    }

    /** Share: the native share sheet where available (mobile), otherwise copy the page link */
    let shareCopied = $state(false);
    async function shareEvent() {
        const url = location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: data.event.title, url });
                return;
            }
            await navigator.clipboard.writeText(url);
            shareCopied = true;
            setTimeout(() => (shareCopied = false), 2000);
        } catch {
            /* share sheet closed, or clipboard not available */
        }
    }

    /** Past event cards: short date like Figma ("Feb. 12, 2025" / "2025. febr. 12.") */
    function formatShortDate(date) {
        if (!date) return "";
        return new Date(date).toLocaleDateString(page.params.lang === "hu" ? "hu-HU" : "en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    /** "All events" → the events listing on the main site */
    const allEventsUrl = $derived(
        `${PUBLIC_ERGOMANIA_SITE_URL.replace(/\/$/, "")}/${page.params.lang}/events/`,
    );

    function scrollToId(id) {
        const element = document.getElementById(id);
        element?.scrollIntoView({
            behavior: "smooth",
        });
    }
</script>

<svelte:head>
    <title>{data.event.title} - Product Design Talks | Ergománia</title>
    <meta
        name="description"
        content={data.event.subtitle || data.event.title}
    />
    <meta
        property="og:title"
        content="{data.event.title} - Product Design Talks"
    />
    <meta property="og:type" content="event" />
    <meta property="og:description" content={data.event.subtitle} />
</svelte:head>

<!-- Hero (Figma "Event page • Desktop"): card on the wide rail like the main site's home hero, text 115px in -->
<section class="event-hero wide-content-rail">
    <div class="event-hero-card">
        <picture class="event-hero-image">
            <source
                media="(max-width: 63.99rem)"
                srcset="//eregocdn-b22b.kxcdn.com/ergomania-talks/mobile/bg@3x-mobile.png"
            />
            <img src="//eregocdn-b22b.kxcdn.com/ergomania-talks/desktop/bg@3x.png" alt="" />
        </picture>
        <div class="event-hero-content">
            <span class="event-hero-tag">{eventTypeLabel}</span>
            <h1>{data.event.title}</h1>
            <div class="event-hero-meta">
                <p>{formatDateTime(data.event.dateTime)}</p>
                <p>{data.event.location}</p>
            </div>
            <div class="event-hero-actions">
                <Button
                    label={$t("eventHero.register")}
                    variant="highlighted"
                    onclick={() => scrollToId("eventRegistration")}
                />
                <Button label={$t("eventHero.addToCalendar")} variant="text" />
            </div>
        </div>
    </div>
</section>

<!-- Intro (Figma "Miről szólnak üzleti reggelijeink?"): the type's shared intro from the CMS + the event's image -->
{#if introTitle || introText}
    <section class="wide-content-rail">
        <div class="event-intro event-inset">
            <div class="event-intro-text">
                {#if introTitle}
                    <h2>{introTitle}</h2>
                {/if}
                {#if introText}
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -- CMS rich text -->
                    <div class="event-intro-body">{@html introText}</div>
                {/if}
            </div>
            {#if data.event.featuredImageUrl}
                <img class="event-intro-image" src={data.event.featuredImageUrl} alt={data.event.title} />
            {/if}
        </div>
    </section>
{/if}

<!-- Description + programme | sticky side panel (Figma): the main site's wide rail, the columns inset like the hero text -->
<div class="wide-content-rail">
    <div class="event-main event-inset">
        <div class="event-main-content">
            <section class="event-description">
                <h2>{data.event.title}</h2>
                {#if data.event.description}
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -- CMS rich text (admin → Events → Description) -->
                    <div class="event-description-body">{@html data.event.description}</div>
                {/if}
            </section>

            <!-- Programme (Figma): time | icon, title, short text, speakers; data: admin → Events → Programs (+ Speakers) -->
            {#if data.event.programs && data.event.programs.length > 0}
                <section class="event-programme">
                    <h2>{$t("event.program")}</h2>
                    <ol class="event-programme-list">
                        {#each data.event.programs as program}
                            <li class="event-programme-item">
                                <div class="event-programme-time">{formatTime(program.date)}</div>
                                <div class="event-programme-body">
                                    {#if program.logoUrl}
                                        <img class="event-programme-icon" src={program.logoUrl} alt="" />
                                    {/if}
                                    <h3>{program.title}</h3>
                                    {#if program.subtitle}
                                        <p class="event-programme-text">{program.subtitle}</p>
                                    {/if}
                                    {#if program.speakers && program.speakers.length > 0}
                                        <ul class="event-programme-speakers">
                                            {#each program.speakers as speaker}
                                                <li>
                                                    {#if speaker.imageUrl}
                                                        <img src={speaker.imageUrl} alt={speaker.name} />
                                                    {/if}
                                                    <span class="event-speaker-name">{speaker.name}</span>
                                                    {#if speaker.description}
                                                        <span class="event-speaker-sep" aria-hidden="true">—</span>
                                                        <span class="event-speaker-desc">{speaker.description}</span>
                                                    {/if}
                                                </li>
                                            {/each}
                                        </ul>
                                    {/if}
                                </div>
                            </li>
                        {/each}
                    </ol>
                </section>
            {/if}
        </div>

        <!-- Side panel (Figma): date + location cards, register + share; sticky next to the description and programme
             (it stops where this grid ends, i.e. before the registration form) -->
        <aside class="event-aside">
            <div class="event-aside-card">
                <img src={CalendarIcon} alt="" />
                <div>
                    <div class="event-aside-label">{$t("eventAside.date")}</div>
                    <div class="event-aside-value">{formatDateTime(data.event.dateTime)}</div>
                </div>
            </div>
            {#if data.event.location}
                <div class="event-aside-card">
                    <img src={PinIcon} alt="" />
                    <div>
                        <div class="event-aside-label">{$t("eventAside.location")}</div>
                        <div class="event-aside-value">{data.event.location}</div>
                    </div>
                </div>
            {/if}

            <div class="event-aside-actions">
                <Button
                    label={$t("eventHero.register")}
                    variant="highlighted"
                    onclick={() => scrollToId("eventRegistration")}
                />
                <Button
                    label={shareCopied ? $t("eventAside.linkCopied") : $t("eventAside.share")}
                    variant="secondary"
                    onclick={shareEvent}
                />
            </div>
        </aside>
    </div>
</div>

<!-- Registration (Figma): pink card on the rail, form on the left, illustration on the right -->
<Registration eventId={data.event.id} />

<!-- Past events (Figma): the two latest past events of the same type (admin → Events), + link to all events -->
{#if data.pastEvents?.length}
    <section class="wide-content-rail">
        <div class="event-past event-inset">
            <h2>{$t("eventPast.title")}</h2>
            <div class="event-past-grid">
                {#each data.pastEvents as past (past.id)}
                    <a class="event-past-card" href={`/${page.params.lang}/events/${past.slug}/`}>
                        <div class="event-past-image">
                            {#if past.featuredImageUrl}
                                <img src={past.featuredImageUrl} alt="" loading="lazy" />
                            {/if}
                            {#if past.location}
                                <span class="event-past-tag">{past.location}</span>
                            {/if}
                        </div>
                        <p class="event-past-date">{formatShortDate(past.dateTime)}</p>
                        <h3>{past.title}</h3>
                        {#if past.subtitle}
                            <p class="event-past-subtitle">{past.subtitle}</p>
                        {/if}
                    </a>
                {/each}
            </div>
            <div class="event-past-actions">
                <a class="event-past-all" href={allEventsUrl}>{$t("eventPast.all")}</a>
            </div>
        </div>
    </section>
{/if}
