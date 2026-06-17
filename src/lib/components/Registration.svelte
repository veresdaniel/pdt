<script lang="ts">
    import { PUBLIC_API_BASE_URL } from "$env/static/public";
    import { locale, t } from "$lib/i18n/i18n";
    import type { EventRegistration } from "$lib/models/event-registration.model";
    import { get } from "svelte/store";
    import CityAutocomplete from "./CityAutocomplete.svelte";
    import type { City } from "$lib/models/city.model";
    import regIcon from "$lib/assets/registration-icon.png";
    import Button from "./Button.svelte";

    export let eventId: number;

    let errors: Record<string, string> = {};

    let isSubmitting = false;
    let isSuccess = false;
    let generalError = "";

    let formData = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        city: null,
    };
    function validateForm(): boolean {
        errors = {};

        if (!formData.lastName || formData.lastName.trim().length < 2) {
            errors.lastName = $t("registration.errors.lastName");
        }

        if (!formData.firstName || formData.firstName.trim().length < 2) {
            errors.firstName = $t("registration.errors.firstName");
        }

        if (!formData.company || formData.company.trim().length < 2) {
            errors.company = $t("registration.errors.company");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            errors.email = $t("registration.errors.email");
        }

        if (
            formData.phone &&
            formData.phone.length > 0 &&
            formData.phone.length < 8
        ) {
            errors.phone = $t("registration.errors.phone");
        }

        if (!formData.city || !formData.city.id) {
            errors.city = $t("registration.errors.city");
        }

        return Object.keys(errors).length === 0;
    }

    async function handleSubmit(event: Event) {
        event.preventDefault();

        generalError = "";

        if (!validateForm()) {
            return;
        }

        isSubmitting = true;
        const registration: EventRegistration = {
            eventId: eventId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            company: formData.company,
            email: formData.email,
            phone: formData.phone,
            cityId: formData.city?.id,
        };
        try {
            const response = await fetch(
                `${PUBLIC_API_BASE_URL}/event-registration`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-language": get(locale),
                    },
                    body: JSON.stringify(registration),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || $t("registration.errors.general"),
                );
            }

            isSuccess = true;

            formData = {
                lastName: "",
                firstName: "",
                company: "",
                email: "",
                phone: "",
                city: null,
            };
        } catch (err) {
            console.error("Registration error:", err);
            generalError =
                err instanceof Error
                    ? err.message
                    : $t("registration.errors.general");
        } finally {
            isSubmitting = false;
        }
    }

    function handleCitySelect(city: City) {
        formData.city = city;
        clearError("city");
    }

    function clearError(field: string) {
        if (errors[field]) {
            delete errors[field];
            errors = errors; // Trigger reactivity
        }
    }
</script>

<section id="eventRegistration" class="event-registration">
    <div class="container">
        <div class="registration-wrapper">
            <div class="registration-form-container">
                <h2>{$t("registration.title")}</h2>
                <p class="form-subtitle">{$t("registration.subtitle")}</p>

                {#if isSuccess}
                    <div class="success-message">
                        <p>{$t("registration.success")}</p>
                        <button
                            class="btn-submit-coral"
                            onclick={() => (isSuccess = false)}
                        >
                            {$t("registration.newRegistration")}
                        </button>
                    </div>
                {:else}
                    {#if generalError}
                        <div class="error-message">
                            <p>{generalError}</p>
                        </div>
                    {/if}

                    <form class="registration-form" onsubmit={handleSubmit}>
                        <div class="form-group">
                            <label for="lastName">
                                {$t("registration.fields.lastName")}<span
                                    class="required"
                                    >{$t("registration.required")}</span
                                >
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                bind:value={formData.lastName}
                                oninput={() => clearError("lastName")}
                                class:error={errors.lastName}
                                placeholder={$t(
                                    "registration.fields.your.lastName",
                                )}
                            />
                            {#if errors.lastName}
                                <span class="error-text">{errors.lastName}</span
                                >
                            {/if}
                        </div>

                        <div class="form-group">
                            <label for="firstName">
                                {$t("registration.fields.firstName")}<span
                                    class="required"
                                    >{$t("registration.required")}</span
                                >
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                bind:value={formData.firstName}
                                oninput={() => clearError("firstName")}
                                class:error={errors.firstName}
                                placeholder={$t(
                                    "registration.fields.your.firstName",
                                )}
                            />
                            {#if errors.firstName}
                                <span class="error-text"
                                    >{errors.firstName}</span
                                >
                            {/if}
                        </div>

                        <div class="form-group">
                            <label for="company">
                                {$t("registration.fields.company")}<span
                                    class="required"
                                    >{$t("registration.required")}</span
                                >
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                bind:value={formData.company}
                                oninput={() => clearError("company")}
                                class:error={errors.company}
                                placeholder={$t(
                                    "registration.fields.your.company",
                                )}
                            />
                            {#if errors.company}
                                <span class="error-text">{errors.company}</span>
                            {/if}
                        </div>

                        <div class="form-group">
                            <label for="email">
                                {$t("registration.fields.position")}<span
                                    class="optional"
                                    >{$t("registration.optional")}</span
                                >
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                bind:value={formData.position}
                                oninput={() => clearError("position")}
                                class:error={errors.position}
                                placeholder={$t(
                                    "registration.fields.your.position",
                                )}
                            />
                            {#if errors.position}
                                <span class="error-text">{errors.position}</span
                                >
                            {/if}
                        </div>

                        <div class="form-group">
                            <label for="email">
                                {$t("registration.fields.email")}<span
                                    class="required"
                                    >{$t("registration.required")}</span
                                >
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                bind:value={formData.email}
                                oninput={() => clearError("email")}
                                class:error={errors.email}
                                placeholder={$t(
                                    "registration.fields.your.email",
                                )}
                            />
                            {#if errors.email}
                                <span class="error-text">{errors.email}</span>
                            {/if}
                        </div>
                        <div class="form-group">
                            <label for="phone"
                                >{$t("registration.fields.phone")}</label
                            >
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                bind:value={formData.phone}
                                oninput={() => clearError("phone")}
                                class:error={errors.phone}
                                placeholder={$t(
                                    "registration.fields.your.phone",
                                )}
                            />
                            {#if errors.phone}
                                <span class="error-text">{errors.phone}</span>
                            {/if}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            variant="highlighted"
                            label={isSubmitting
                                ? $t("registration.submitting")
                                : $t("registration.submit")}
                        />

                        <p class="form-terms-of-use">
                            {$t("registration.disclaimer")}
                        </p>

                        <p class="form-important">{$t("registration.important")}</p>
                        <p class="form-disclaimer">
                            {$t("registration.disclaimer")}
                        </p>
                        <p class="form-disclaimer">
                            {$t("registration.disclaimer")}
                        </p>

                    </form>
                {/if}
            </div>

            <div class="registration-image">
                <img src={regIcon} alt="Event" />
            </div>
        </div>
    </div>
</section>

<style>
    .required {
        color: #ff7a59;
        margin-left: 4px;
    }

    .optional {
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        color: var(--color-neutral-gray);
    }

    .form-group input {
        color: var(--color-neutral-ultradark);
        font-size: 1rem;
        padding-bottom: 12px;
        border-bottom-width: 1px;
    }

    .form-group input:focus {
        outline: none;
    }

    input.error {
        border-color: #ff4444;
        background-color: #fff5f5;
    }

    .error-text {
        display: block;
        color: #ff4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }

    .error-message {
        background-color: #fff5f5;
        border: 1px solid #ff4444;
        border-radius: 4px;
        padding: 1rem;
        margin-bottom: 1.5rem;
        color: #ff4444;
    }

    .success-message {
        background-color: #f0fdf4;
        border: 1px solid #22c55e;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
    }

    .success-message p {
        color: #15803d;
        font-size: 1.1rem;
        margin-bottom: 1rem;
    }

</style>
