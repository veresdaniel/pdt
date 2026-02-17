<script lang="ts">
    import { page } from '$app/state';
    import { goto } from '$app/navigation';

    const status = $derived(page.status);
    const message = $derived(page.error?.message ?? 'Unexpected error');

    function goHome() {
        const locale = page.params.lang ?? 'hu';
        goto(`/${locale}`);
    }
</script>

<section class="error-hero">
    <div class="error-card">

        <div class="error-code">
            {status}
        </div>

        <h1 class="error-title">
            {#if status === 404}
                This event could not be found
            {:else}
                Something went wrong
            {/if}
        </h1>

        <p class="error-message">
            {#if status === 404}
                The event you are looking for may have been removed or never existed.
            {:else}
                {message}
            {/if}
        </p>

        <div class="error-actions">
            <button class="btn-primary" onclick={goHome}>
                Back to events
            </button>
        </div>

    </div>
</section>

<style>
.error-hero {
    min-height: 100vh;
    background: linear-gradient(135deg, #FF7A59 0%, #ff9478 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
}

.error-card {
    background: #fff;
    padding: 70px 60px;
    border-radius: 16px;
    text-align: center;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.error-code {
    font-size: 72px;
    font-weight: 800;
    color: #FF7A59;
    margin-bottom: 10px;
    letter-spacing: 2px;
}

.error-title {
    font-size: 32px;
    margin-bottom: 20px;
    color: #1a1a1a;
    font-weight: 700;
}

.error-message {
    font-size: 18px;
    color: #666;
    margin-bottom: 40px;
    line-height: 1.7;
}

.error-actions {
    display: flex;
    justify-content: center;
}

.btn-primary {
    background: #FF7A59;
    color: #fff;
    padding: 14px 40px;
    border-radius: 30px;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 1px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
}

.btn-primary:hover {
    background: #ff6342;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 122, 89, 0.35);
}

/* Responsive */
@media (max-width: 768px) {
    .error-card {
        padding: 50px 30px;
    }

    .error-code {
        font-size: 52px;
    }

    .error-title {
        font-size: 26px;
    }

    .error-message {
        font-size: 16px;
    }
}
</style>
