<script lang="ts">
    import { locale } from "$lib/i18n/i18n.js";
    import Footer from "$lib/components/Footer.svelte";
    import NavBar from "$lib/components/NavBar.svelte";
    import Registration from "$lib/components/Registration.svelte";

    export let data;

    function formatDate(date) {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString($locale === "hu" ? "hu-HU" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function formatTime(date) {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleTimeString($locale === "hu" ? "hu-HU" : "en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function formatDateTime(date) {
        if (!date) return "";
        return `${formatDate(date)}, ${formatTime(date)}`;
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

<NavBar events={data.events} />

<!-- Hero Section -->
<section class="hero">
    <div class="hero-content">
        <h1>{data.event.title.toUpperCase()}</h1>
        <div class="hero-meta">
            <p>{formatDateTime(data.event.dateTime)}</p>
            <p>{data.event.location}</p>
        </div>
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

<!-- Product Design Talks Section -->
<section id="productDesignTalks" class="section-content">
    <div class="container">
        {#if data.event.subtitle}
            <h3><strong>{data.event.subtitle}</strong></h3>
        {/if}
        {#if data.event.description}
            {data.event.description}
        {/if}
    </div>
</section>

<!-- Event Details Section (optional image) -->
{#if data.event.imageUrl}
    <section class="event-details">
        <div class="container">
            <img
                src={data.event.imageUrl}
                alt={data.event.title}
                class="event-image"
            />
        </div>
    </section>
{/if}

<!-- Program Section -->
{#if data.event.programs && data.event.programs.length > 0}
    <section id="program" class="section-content program-section">
        <div class="container">
            {#if data.event.header}
                <h2>{data.event.header}</h2>
            {/if}
            {#if data.event.subHeader}
                <h3>{data.event.subHeader}</h3>
            {/if}
        </div>
    </section>

    <!-- Timeline/Schedule Section -->
    <section class="timeline">
        <div class="container">
            {#each data.event.programs as program}
                <div class="timeline-item">
                    <div class="timeline-time">{formatTime(program.date)}</div>
                    <div class="timeline-content">
                        {#if program.logoUrl}
                            <div class="timeline-icon">
                                <img
                                    src={program.logoUrl}
                                    alt={program.title}
                                />
                            </div>
                        {/if}

                        <h2>{program.title}</h2>

                        {#if program.subtitle}
                            <h3>{program.subtitle}</h3>
                        {/if}

                        {#if program.speakers && program.speakers.length > 0}
                            <div class="fireside-header">
                                <h3>{program.title}</h3>
                            </div>

                            <div class="speakers">
                                {#each program.speakers as speaker}
                                    <div class="speaker">
                                        {#if speaker.imageUrl}
                                            <img
                                                src={speaker.imageUrl}
                                                alt={speaker.name}
                                            />
                                        {/if}
                                    </div>
                                {/each}
                            </div>

                            <h4>
                                {#each program.speakers as speaker, i}
                                    <b>{speaker.name}</b>{#if speaker.description}
                                        &nbsp;-  {speaker.description}{/if}{#if i < program.speakers.length - 1}<br
                                        />{/if}
                                {/each}
                            </h4>
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

<Registration eventId={data.event.id}/>

 <Footer />
