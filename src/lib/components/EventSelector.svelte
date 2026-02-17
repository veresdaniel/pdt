<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { locale } from "$lib/i18n/i18n";
    import { get } from "svelte/store";

    let { events = [] } = $props();

    let isOpen = $state(false);
    let currentEvent = $derived(
        events.find((e) => e.slug === page.params.slug),
    );
    let currentTitle = $derived(currentEvent?.title || "Select Other Event");

    function selectEvent(slug: string) {
        isOpen = false;
        goto(`/${get(locale)}/events/${slug}`);
    }

    function toggleDropdown() {
        isOpen = !isOpen;
    }

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".event-selector")) {
            isOpen = false;
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="event-selector">
    <button
        class="event-selector-trigger"
        class:open={isOpen}
        onclick={(e) => {
            e.stopPropagation();
            toggleDropdown();
        }}
    >
        <span class="event-title">{currentTitle}</span>
        <svg
            class="chevron"
            class:rotated={isOpen}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
        >
            <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    </button>

    {#if isOpen}
        <div class="event-dropdown">
            <div class="event-list">
                {#each events as event}
                    <button
                        class="event-item"
                        class:active={event.slug === currentEvent.slug}
                        onclick={(e) => {
                            e.stopPropagation();
                            selectEvent(event.slug);
                        }}
                    >
                        <span class="event-item-title">{event.title}</span>
                        {#if event.slug === currentEvent.slug}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path 
                                    d="M13 4L6 11L3 8" 
                                    stroke="currentColor" 
                                    stroke-width="2" 
                                    stroke-linecap="round" 
                                    stroke-linejoin="round"
                                />
                            </svg>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .event-selector {
        position: relative;
    }

    .event-selector-trigger {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 200px;
        justify-content: space-between;
    }

    .event-selector-trigger:hover {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.5);
    }

    .event-selector-trigger.open {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.5);
    }

    .event-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        text-align: left;
    }

    .chevron {
        flex-shrink: 0;
        transition: transform 0.3s ease;
    }

    .chevron.rotated {
        transform: rotate(180deg);
    }

    .event-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        z-index: 100;
        animation: slideDown 0.2s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .event-list {
        max-height: 300px;
        overflow-y: auto;
    }

    .event-list::-webkit-scrollbar {
        width: 6px;
    }

    .event-list::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    .event-list::-webkit-scrollbar-thumb {
        background: #ff7a59;
        border-radius: 3px;
    }

    .event-list::-webkit-scrollbar-thumb:hover {
        background: #ff6342;
    }

    .event-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 16px;
        background: #fff;
        border: none;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background 0.2s ease;
        color: #333;
        font-size: 14px;
        text-align: left;
    }

    .event-item:last-child {
        border-bottom: none;
    }

    .event-item:hover {
        background: #f8f9fa;
    }

    .event-item.active {
        background: #fff5f2;
        color: #ff7a59;
        font-weight: 600;
    }

    .event-item-title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* Mobile adjustments */
    @media (max-width: 768px) {
        .event-selector-trigger {
            min-width: 160px;
            font-size: 13px;
            padding: 6px 12px;
        }

        .event-dropdown {
            position: fixed;
            left: 10px;
            right: 10px;
            top: auto;
            max-width: calc(100vw - 20px);
        }
    }
</style>
