<script lang="ts">
    const p = $props<{
        variant?: "primary" | "secondary" | "highlighted" | "text";
        size?: "sm" | "md" | "lg";
        background?: "light" | "dark";
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        class?: string;
        state?: "default" | "hover";
        label?: string;
        onclick?: (e: MouseEvent) => void;
        children?: any;
    }>();

    let {
        variant = "primary",
        size = "lg",
        background = "light",
        disabled = false,
        type = "button",
        class: klass = "",
        state = "default",
        label = "Button",
        onclick,
        children,
    } = p;

    let classes = `${variant} ${background}`;
</script>

<button class="btn {classes}" {type} {disabled} {onclick}>
    {label}
</button>

<style>
    .btn {
        border-radius: 12px;
        padding: 13px 24px;
        line-height: 22px;
        max-height: 48px;
        color: white;
        font-size: 16px;
        font-weight: 600;
        background-color: var(--color-neutral-ultradark);
        min-width: 145px;
        width: min-content;

        &:hover {
            cursor: pointer;
        }

        &.secondary {
           color: var(--color-neutral-ultradark);
           border: 2px solid;
           border-color: var(--color-neutral-ultradark);
           background-color: transparent;

           &:hover {
            border-color: var(--color-orange);
        }

        }

        &.highlighted {
            background-color: var(--color-orange);

            &:hover {
                color: var(--color-orange-mid);
            }
        }

        &.text {
            color: var(--color-neutral-ultradark);
            background-color: transparent;

            &:hover {
                color: var(--color-neutral-dark);
            }
        }
    }
</style>
