<script lang="ts">
    import { goto } from '$app/navigation';
    import type { Locale } from '$lib/i18n/i18n.js';
    import { locale, locales } from '$lib/i18n/i18n.js';    
    
    let isLanguageOpen = $state(false);

    function toggleLanguage() {
        isLanguageOpen = !isLanguageOpen;
    }
    
    async function switchLocale(newLocale: Locale) {
        await goto(`/${newLocale}/`);
    }

</script>

<div class="language-switcher">
    <button onclick={toggleLanguage}>
        {$locale.toUpperCase()}
        <svg
            class="ml-1 w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"/>
        </svg>
    </button>

    {#if isLanguageOpen}
        <div class="language-container">
            {#each locales as lang}
                <button
                    class="lang-btn" 
                    class:active={$locale === lang}
                    onclick={() => switchLocale(lang)}
                >
                    {lang.toUpperCase()}
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .language-switcher {
        align-items: center;
        display: flex;
        position: relative;
    }
    .language-container {
        position: absolute;
        top: 100%;
        right: 0;
        width: 128px;
        background-color: #fff;
        border-radius: 8px;
        border: 1px solid var(--color-neutral-ultralight);

        button {
            padding: 8px 16px;
        }
    }

    button {
        width: 40px;
        display: flex;
        font-family: Poppins;
        font-weight: 400;
        font-size: 15px;
        line-height: 24px;
        letter-spacing: 0%;
        text-align: right;
        background: none;
        border: 0;
        color: var(--color-neutralDark);
    }


</style>