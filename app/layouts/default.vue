<template>
  <div class="layout">
    <slot />
  </div>
</template>

<style>
/* Zero out the browser defaults for the iframe */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  overflow: hidden; /* Important: The parent handles scrolling */
}

/* Ensure Nuxt doesn't add background colors */
#__nuxt, .layout {
  background: transparent !important;
  min-height: unset !important;
}
</style>