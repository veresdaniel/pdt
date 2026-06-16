<script lang="ts">
    let { title, text, icon = null, link = null } = $props();
</script>

<div class="tag">
    {#if icon}
        <img class="icon" src={icon} />
    {/if}
    <div class="tag-text">
        <p class="title">{title}</p>
        <p class="text">{text}</p>
    </div>
</div>

<style>
    .tag {
        display: flex;
        background-color: var(--color-neutral-light);
        width: 100%;
        padding-top: 12px;
        padding-right: 16px;
        padding-bottom: 12px;
        padding-left: 12px;
        gap: 12px;
        opacity: 1;
        border-radius: 16px;
        margin-bottom: 8px;
    }

    .icon {
        height: max-content;
    }

    .title {
        color: var(--color-neutral-dark);
        font-weight: 600;
        font-size: 18px;
        line-height: 28px;
        letter-spacing: 0%;
        vertical-align: middle;
    }

    .text {
        color: var(--color-neutral-mid);
        font-weight: 400;
        font-size: 15px;
        line-height: 20px;
        letter-spacing: 0%;
        vertical-align: middle;
    }
</style>
