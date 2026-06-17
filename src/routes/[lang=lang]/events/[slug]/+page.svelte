<script lang="ts">
    import { locale, t } from "$lib/i18n/i18n";
    import Footer from "$lib/components/Footer/Footer.svelte";
    import { PrimaryNavigation, Section } from "@ergodot/ui-kit";
    import Registration from "$lib/components/Registration.svelte";
    import Button from "$lib/components/Button.svelte";
    import Tag from "$lib/components/Tag.svelte";
    import CalendarIcon from "$lib/assets/calendar.svg";
    import PinIcon from "$lib/assets/pin.svg";
    import { page } from "$app/state";
    import defaultSpeakerLogo from "$lib/assets/ergomania-logo-colored-on-dark-big.svg";

    let { data } = $props();

    const languages = [
        { title: "EN", value: "en" },
        { title: "HU", value: "hu" },
    ];

    function formatDate(date) {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString(
            page.params.lang === "hu" ? "hu-HU" : "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            },
        );
    }

    function formatTime(date) {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleTimeString(
            page.params.lang === "hu" ? "hu-HU" : "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
            },
        );
    }

    function formatDateTime(date) {
        if (!date) return "";
        return `${formatDate(date)}, ${formatTime(date)}`;
    }

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

<Section
    marginTop={false}
    marginBottom={false}
    padding="none"
    class="app-content-wrapper w-full"
>
    <PrimaryNavigation menuItems={data.menuItems} {languages} sticky={true} />
</Section>

<div class="event-wrapper">
    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>{data.event.title}</h1>
            <div class="hero-meta">
                <p>{formatDateTime(data.event.dateTime)}</p>
                <p>{data.event.location}</p>
            </div>
            <Button
                label="Regisztálok"
                variant="highlighted"
                onclick={() => scrollToId("eventRegistration")}
            />
            <Button label="Hozzáadom a naptáramhoz" variant="text" />
        </div>
        <div class="hero-image">
            <img
                src="//eregocdn-b22b.kxcdn.com/ergomania-talks/desktop/bg@3x.png"
                alt="Talks"
                class="desktop-image"
            />
            <img
                src="//eregocdn-b22b.kxcdn.com/ergomania-talks/mobile/bg@3x-mobile.png"
                alt="Talks"
                class="mobile-image"
            />
        </div>
    </section>

    <!-- general info -->
    {#if data.event.featuredImageUrl}
        <div class="container">
            <div class="half">
                <div class="general-info-desc">
                    {#if data.event.subtitle}
                        <h2>{data.event.subtitle}</h2>
                    {/if}
                    {#if data.event.description}
                        {@html data.event.description}
                    {/if}
                </div>
            </div>

            <div class="half">
                <img
                    src={data.event.featuredImageUrl}
                    alt={data.event.title}
                    class="event-image"
                />
            </div>
        </div>
    {/if}

    <!-- longer description ??? -->
    <div class="container">
        <div class="three-quarter">
            <div class="longer-desc">
                <h3>{data.event.title}</h3>
                {#if data.event.description}
                    {@html data.event.description}
                {/if}
            </div>
        </div>
        <div class="quarter">
            <Tag
                title="Date"
                text={formatDateTime(data.event.dateTime)}
                icon={CalendarIcon}
            />
            <Tag title="Location" text={data.event.location} icon={PinIcon} />

            <div class="btn-holder">
                <Button
                    label="Regisztálok"
                    variant="highlighted"
                    onclick={() => scrollToId("eventRegistration")}
                />
                <Button label="Megosztom" variant="secondary" />
            </div>
        </div>
    </div>

    <!-- Timeline/Schedule Section -->
    {#if data.event.programs && data.event.programs.length > 0}
        <section class="timeline">
            <div class="container">
                <h2>
                    {$t("event.program")}
                </h2>
                {#each data.event.programs as program}
                    <div class="timeline-item">
                        <div class="timeline-time">
                            {formatTime(program.date)}
                        </div>
                        <div class="timeline-content">
                            {#if program.logoUrl}
                                <div class="timeline-icon">
                                    <img
                                        src={program.logoUrl}
                                        alt={program.title}
                                    />
                                </div>
                            {/if}

                            <h3>{program.title}</h3>

                            {#if program.subtitle}
                                <p>{program.subtitle}</p>
                            {/if}

                            {#if program.speakers && program.speakers.length > 0}
                                <div class="speakers">
                                    {#each program.speakers as speaker}
                                        <div class="speaker">
                                            {#if speaker.imageUrl}
                                                <img
                                                    src={speaker.imageUrl}
                                                    alt={speaker.name}
                                                />
                                            {/if}
                                            <h4>{speaker.name}</h4>
                                            <div class="spacer"></div>
                                            {#if speaker.description}
                                                <span
                                                    >{speaker.description}</span
                                                >
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                            {:else}
                                <div class="speakers">
                                    <div class="speaker default-speaker">
                                        <img
                                            src={defaultSpeakerLogo}
                                            alt="Ergománia"
                                        />
                                    </div>
                                </div>
                            {/if}

                            {#if program.content}
                                {@html program.content}
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </section>
    {/if}

    <Registration eventId={data.event.id} />
</div>

<Footer
    content={data?.footerContent}
    contactPersons={data?.footerContactPersons}
/>
