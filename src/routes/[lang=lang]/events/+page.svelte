<script lang="ts">
    import { Section } from "@ergodot/ui-kit";
    import Switch from "$lib/components/Switch.svelte";
    import Button from "$lib/components/Button.svelte";
    import { page } from "$app/state";
    import { t } from "$lib/i18n/i18n";
    import { goto } from "$app/navigation";
    import Carousel from "$lib/components/Carousel.svelte";

    let { data } = $props();
    let eventType = $state(0);
    let futureEvents = $derived(
        data.futureEvents
            .filter((event) => {
                return event.type === eventType;
            })
            .slice(0, 2),
    );
    let pastEvents = $derived(
        data.pastEvents
            .filter((event) => {
                return event.type === eventType;
            })
            .slice(0, 3),
    );

    console.log(data);

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
</script>

<Section
    marginTop={false}
    marginBottom={false}
    padding="none"
    class="app-content-wrapper w-full"
>
    <div class="greating">
        <h2>{@html data.pageContent[0].content.Heading}</h2>
        <p>{@html data.pageContent[0].content.Lead}</p>

        <Switch
            bind:eventType
            options={["Product Design Talks", "Business Breakfasts"]}
        />
    </div>
</Section>

<div class="event-wrapper">
    <!-- Hero Section -->
    <section class="hero next-event">
        <div class="hero-content">
            <div class="hero-meta">
                <p>{formatDateTime(data.upcomingEvent.dateTime)}</p>
                <p>{data.upcomingEvent.location}</p>
            </div>
            <h1>{data.upcomingEvent.title}</h1>
            <p class="hero-short">
                {data.upcomingEvent.subtitle}
            </p>
            <div>
                <Button label="Regisztálok" variant="highlighted" />
                <Button
                    label="Részletek"
                    variant="secondary"
                    onclick={() => goto(data.upcomingEvent.slug)}
                />
            </div>
        </div>
        <div class="hero-image">
            <img
                src={data.upcomingEvent.featuredImageUrl}
                alt="Talks"
                class="desktop-image"
            />
        </div>
    </section>

    <section class="container future-events">
        <h2>Upcoming events</h2>
        <div class="events">
            {#each futureEvents as event}
                <a href={`events/${event.slug}/`}>
                    <div class="event">
                        <div style="min-height: 302px;">
                            <span class="location">{event.location}</span>
                            <div class="event-image">
                                <img src={event.featuredImageUrl} alt="event" />
                            </div>
                        </div>
                        <div class="event-info">
                            <p class="date">{formatDate(event.dateTime)}</p>
                            <p class="title">{event.title}</p>
                            <p class="desc">{@html event.description}</p>
                        </div>
                    </div>
                </a>
            {:else}
                <h3>{$t("events.noEvents")}</h3>
            {/each}
        </div>
    </section>

    <section class="container past-events">
        <h2>Past events</h2>
        <div class="events">
            {#each pastEvents as event}
                <a href={`events/${event.slug}/`}>
                    <div class="event">
                        <div style="min-height: 302px;">
                            <span class="location">{event.location}</span>
                            <div class="event-image">
                                <img src={event.featuredImageUrl} alt="event" />
                            </div>
                        </div>
                        <div class="event-info">
                            <p class="date">{formatDate(event.dateTime)}</p>
                            <p class="title">{event.title}</p>
                            <p class="desc">{event.description}</p>
                        </div>
                    </div>
                </a>
            {:else}
                <h3>{$t("events.noEvents")}</h3>
            {/each}
        </div>
    </section>

    <section class="container team">
        <div class="texts">
            <h2>{data.pageContent[0].content.teamTitle}</h2>
            <p>{data.pageContent[0].content.teamDesc}</p>
        </div>
        <div>
            <Carousel dots={false} perPage={1} loop={false}>
                {#each data.teamMembers as member}
                    <div class="member">
                        <img class="memberImg" src="{member.profileImageUrl}" alt={member.displayName}>
                        <a href="{member.linkedInUrl}" target="_blank"><p class="memberName">{member.displayName}</p></a>
                        <p class="memberPosition">{member.position}</p>
                    </div>
                {/each}
                <span slot="left-control"></span>
                <span slot="right-control"></span>
            </Carousel>
        </div>
    </section>

    <section class="container join">
        <div class="texts">
            <h2>{data.pageContent[0].content.skillsTitle}</h2>
            <p>
                {data.pageContent[0].content.skillsDesc}
            </p>
        </div>

        <div class="skills">
            {#each data.pageContent as skill}
                <div class="card">
                    <p class="emoji">{skill.content.skillsCardIcon}</p>
                    <h4 class="title">{skill.content.skillsCardTitle}</h4>
                    <p class="desc">{skill.content.skillsCardDesc}</p>
                </div>
            {/each}
        </div>
    </section>

    <section class="subscirbe">
        <div class="left">
            <h1>Want to Read More About UX, Banking & Fintech?</h1>
            <div class="presenter">
                <img alt="fasz" src="https://picsum.photos/64" />
                <div style="padding: 8px 0;">
                    <p class="name">Maria Amidi Nouri</p>
                    <p class="position">UX Architect</p>
                </div>
            </div>
        </div>
        <div class="right">
            <p>
                Subscribe to our biweekly newsletter and get the latest of our
                news and thoughts!
            </p>
            <input
                type="email"
                id="email"
                name="email"
                placeholder={$t("registration.fields.your.position")}
            />
            <p>
                By pressing Subscribe, you agree to our Terms and Conditions and
                Privacy Policy.
            </p>

            <div>
                <Button label="Subscribe" variant="highlighted" />
                <Button label="Earlier Newsletters" variant="text" />
            </div>
        </div>
    </section>
</div>
