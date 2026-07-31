<script>
    let {options, eventType = $bindable(0)} =$props();

    function handleClick(side) {
        eventType = side;
    }
</script>

<div class="toggle-container">
    <div class="slider" class:right={eventType === 1}></div>

    <button
        class="toggle-btn"
        class:active={eventType === 0}
        on:click={() => (handleClick(0))}
    >
        {options[0]}
    </button>

    <button
        class="toggle-btn"
        class:active={eventType === 1}
        on:click={() => (handleClick(1))}
    >
        {options[1]}
    </button>
</div>

<style>
    .toggle-container {
        position: relative;
        isolation: isolate;
        display: flex;
        flex-direction: row;
        height: max-content;
        color: var(--color-neutral-dark);
        background-color: var(--color-neutral-ultralight);
        font-family: Poppins;
        font-weight: 600;
        font-size: 18px;
        line-height: 20px;
        border-radius: 40px;
        padding: 4px;
        max-width: 452px;
        width: 100%;

    }

    .slider {
        position: absolute;
        top: 4px;
        left: 4px;
        bottom: 4px;
        width: calc(50% - 4px);
        background-color: var(--color-orange);
        border-radius: 40px;
        z-index: -1;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .slider.right {
        transform: translateX(100%);
    }

    .toggle-btn {
        flex: 1;
        padding: 8px 16px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-weight: 500;
        color: #666;
        transition: color 0.3s ease;
    }

    .toggle-btn.active {
        color: #fff;
    }
</style>
