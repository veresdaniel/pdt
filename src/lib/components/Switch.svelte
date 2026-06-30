<script>
    let {options, isPDT = $bindable(false)} =$props();
    let selected = $state("left");

    function handleClick(side) {
        selected = side;
        isPDT = (selected === "left");
    }
</script>

<div class="toggle-container">
    <div class="slider" class:right={selected === "right"}></div>

    <button
        class="toggle-btn"
        class:active={selected === "left"}
        on:click={() => (handleClick("left"))}
    >
        {options[0]}
    </button>

    <button
        class="toggle-btn"
        class:active={selected === "right"}
        on:click={() => (handleClick("right"))}
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
        height: 44px;
        color: var(--color-neutral-dark);
        background-color: var(--color-neutral-ultralight);
        font-family: Poppins;
        font-weight: 600;
        font-size: 18px;
        line-height: 20px;
        border-radius: 40px;
        padding: 4px;
        min-width: 452px;
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
