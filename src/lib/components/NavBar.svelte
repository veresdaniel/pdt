<script>
  import { t } from "$lib/i18n/i18n";
  import EventSelector from "./EventSelector.svelte";
  import LanguageSwitcher from "./LanguageSwitcher.svelte";

  let { events, menuItems } = $props();
  let menuState = $state({
    openMenu: false,
    menuIndex: null,
    submenuIndex: 0,
  });

  function openMenuOnHover(index) {
    menuState.openMenu = !menuState.openMenu;
    menuState.menuIndex = index;
    if (index === null) {
      menuState.submenuIndex = 0;
    }
  }

  function handleSubmenuIndex(index) {
    menuState.submenuIndex = index;
  }
</script>

<header class="header">
  <div class="header-container">
    <div class="logo">
      <a href="/">
        <img alt="" src="/src/lib/assets/ergomania-bk.svg" />
      </a>
    </div>
    <nav class="nav">
      <EventSelector {events} />
      {#each menuItems as item, index}
        {@const contactBtnClass =
          item.path === "/#contactForm" ? "btn btn-outline" : ""}
        {@const hasSubmenu = item.categoryChildren !== undefined}

        <div class="link-container">
          <a
            class="nav-link {contactBtnClass}"
            href={item.path}
            onmouseenter={() => openMenuOnHover(index)}
          >
            {item.text}
            {#if hasSubmenu}
              <svg
                class="chevron"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            {/if}
          </a>
          {#if hasSubmenu && menuState.menuIndex === index}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="megamenu" onmouseleave={() => openMenuOnHover(null)}>
              <div class="steps">
                {#each item.categoryChildren as categoryTitle, index}
                  <div
                    class="step {index === menuState.submenuIndex
                      ? 'active'
                      : ''}"
                    onmouseenter={() => handleSubmenuIndex(index)}
                  >
                    <span class="step-icon">{categoryTitle.icon}</span>
                    <span class="step-title">{categoryTitle.title}</span>
                  </div>
                {/each}
              </div>

              <div class="category">
                <div class="description">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADeSURBVHgB7ZY/DsIgFIcfhQ5uHgFv4J/Fsb2FiTHpEbyBV2Ex8RZdXUx6A3sEBxOTFoK8OCoKCJ36JYQF+EL4PfIIJKbbrq6ZmRkkhgBwbeYMBmIUBWMNg66KqZT3PWNMEHFu4U+sN0IJaH1QfV/ras0hnUgKE8vWDB5DZhVNTk2rlCpjyb6GIabsZ+piyZziHUPmXEehMlxPXsOPx2bOKaU1fpZ4AM3z0qXOvEWhsiDRZ5laENHcbOuD/7q3N5O0gJTgzbrdsoKREVcI9l1YC16bTKTZ8TLz2TNYz/AE/hySCa7FqyYAAAAASUVORK5CYII="
                    alt=""
                    style="left: 16px; top: 14px; position: absolute;"
                  />
                  {@html item.categoryChildren[menuState.submenuIndex]
                    .description}
                </div>
                <div class="spacer"></div>
                <div class="services">
                  {#each item.categoryChildren[menuState.submenuIndex].services as service}
                    <a href={service.url}>{service.title}</a>
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        </div>
      {/each}
      <LanguageSwitcher />
    </nav>
  </div>
</header>

<style>
  .header {
    width: 100%;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }

  .header-container {
    /*background-color: white;*/
    background-color: burlywood;
    margin: 16px 40px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    padding: 28px 24px;
    border-radius: 19px;
    max-height: 80px;
    align-items: center;
  }

  .nav {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    gap: 24px;
  }

  .link-container {
    display: flex;
    align-items: center;
  }

  .nav-link {
    font-family: "Poppins", ui-sans-serif, system-ui, sans-serif;
    color: var(--color-neutralUltraDark);
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0%;
    transition: all 200ms ease-in;
    .chevron {
      width: 12px;
      margin: 0 8px;
      transition: all 200ms ease-in;
    }

    &:hover {
      color: var(--color-orangeDefault);
      transition: all 200ms ease-in;

      .chevron {
        transform: rotate(180deg);
        transition: all 200ms ease-in;
      }
    }
  }

  .logo {
    width: 192px;
  }

  .megamenu {
    position: absolute;
    top: 100%;
    right: 0;
    width: calc(100% - 80px);
    background: #fff;
    left: 0;
    margin: 8px 40px;
    border-radius: 20px;
    padding: 24px;
    display: flex;
  }

  .steps {
    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 31px;
    margin-right: 32px;
  }

  .step-icon {
    border-radius: 48px;
    display: inline-block;
    width: 40px;
    height: 40px;
    text-align: center;
    font-size: 22px;
    line-height: 36px;
    font-weight: 500;
    font-style: Medium;
    border: 2px solid var(--color-neutralLight);
    color: var(--color-orangeDefault);
  }
  .step-title {
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: 0%;
    color: var(--color-neutralMid);
    margin: 8px;
  }

  .step.active {
    transition: all 200ms ease-in;
    .step-icon {
      transition: all 200ms ease-in;
      color: #fff;
      background-color: var(--color-orangeDefault);
      border-color: var(--color-orangeDefault);
    }
    .step-title {
      transition: all 200ms ease-in;
      color: var(--color-neutralUltraDark);
    }
  }

  .category {
    width: 70%;
    display: flex;
    background-color: var(--color-bluishgray);
    border-radius: 16px;

    .description {
      width: 35%;
      padding: 32px 40px;
      position: relative;

      font-family: Poppins;
      font-weight: 400;
      font-style: Regular;
      font-size: 16px;
      line-height: 22px;
    }

    .spacer {
      width: 2px;
      background: white;
      margin: 32px 0;
    }
    .services {
      width: 65%;
      display: flex;
      gap: 12px;
      flex-direction: column;
      padding: 32px 48px;

      a {
        font-family: Poppins;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
