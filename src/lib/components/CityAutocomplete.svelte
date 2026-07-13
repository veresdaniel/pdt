<script lang="ts">
    import { PUBLIC_API_BASE_URL } from '$env/static/public';
    import { t } from '$lib/i18n/i18n';

    interface City {
        id: number;
        name: string;
    }

    let { 
        value = $bindable(), 
        error, 
        onSelect 
    }: { 
        value: City | null, 
        error: string, 
        onSelect: (city: City) => void
    } = $props();
    
    let suggestions: City[] = $state([]);
    let isLoading = $state(false);
    let showDropdown = $state(false);
    let searchTimeout: ReturnType<typeof setTimeout>;
    let inputValue = $state('');
    
    $effect(() => {
        if (value?.name) {
            inputValue = value.name;
        }
    });
    
    async function searchCities(query: string) {
        if (query.length < 2) {
            suggestions = [];
            showDropdown = false;
            return;
        }
        
        isLoading = true;
        
        try {
            const response = await fetch(
                `${PUBLIC_API_BASE_URL}/autocomplete/cities?search=${encodeURIComponent(query)}`
            );
            
            if (response.ok) {
                suggestions = await response.json();
                showDropdown = suggestions.length > 0;
            }
        } catch (err) {
            console.error('City search error:', err);
            suggestions = [];
            showDropdown = false;
        } finally {
            isLoading = false;
        }
    }
    
    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        inputValue = target.value;
        
        value = null;
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchCities(inputValue);
        }, 300);
    }
    
    function selectCity(city: City) {
        value = city;
        inputValue = city.name;
        showDropdown = false;
        suggestions = [];
        onSelect(city);
    }
    
    function handleBlur() {
        // Delay to allow click on suggestion
        setTimeout(() => {
            showDropdown = false;
            // If no city selected, clear the input
            if (!value) {
                inputValue = '';
            }
        }, 200);
    }
    
    function handleFocus() {
        if (suggestions.length > 0) {
            showDropdown = true;
        }
    }
</script>

<div class="city-autocomplete">
    <label for="city">
        {$t('registration.fields.city')}<span class="required">{$t('registration.required')}</span>
    </label>
    
    <div class="input-wrapper form-group">
        <input
            type="text"
            id="city"
            name="city"
            value={inputValue}
            oninput={handleInput}
            onfocus={handleFocus}
            onblur={handleBlur}
            placeholder={$t('registration.fields.city')}
            class:error
            autocomplete="off"
        />
        
        {#if isLoading}
            <div class="loading-spinner"></div>
        {/if}
        
        {#if showDropdown && suggestions.length > 0}
            <div class="suggestions-dropdown">
                {#each suggestions as city}
                    <button
                        type="button"
                        class="suggestion-item"
                        onclick={() => selectCity(city)}
                    >
                        {city.name}
                    </button>
                {/each}
            </div>
        {/if}
    </div>
    
    {#if error}
        <span class="error-text">{error}</span>
    {/if}
</div>

<style>
    .city-autocomplete {
        display: flex;
        flex-direction: column;
        gap: 8px;
        position: relative;
    }
    
    label {
        font-size: 14px;
        font-weight: 600;
        color: #333;
    }
    
    .required {
        color: #FF7A59;
        margin-left: 4px;
    }
    
    .input-wrapper {
        position: relative;
    }
    
    input:focus-visible {
        outline: unset;
    }
    
    input.error {
        border-color: #ff4444;
        background-color: #fff5f5;
    }
    
    .loading-spinner {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #FF7A59;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: translateY(-50%) rotate(0deg); }
        100% { transform: translateY(-50%) rotate(360deg); }
    }
    
    .suggestions-dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;
        z-index: 10;
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
    
    .suggestion-item {
        width: 100%;
        padding: 12px 16px;
        text-align: left;
        background: #fff;
        border: none;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background 0.2s ease;
        font-size: 14px;
        color: #333;
    }
    
    .suggestion-item:last-child {
        border-bottom: none;
    }
    
    .suggestion-item:hover {
        background: #f8f9fa;
    }
    
    .suggestions-dropdown::-webkit-scrollbar {
        width: 6px;
    }
    
    .suggestions-dropdown::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    
    .suggestions-dropdown::-webkit-scrollbar-thumb {
        background: #FF7A59;
        border-radius: 3px;
    }
    
    .error-text {
        display: block;
        color: #ff4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
</style>