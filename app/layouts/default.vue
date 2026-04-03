<template>
  <div class="min-h-screen bg-transparent">
    <slot />
  </div>
</template>

<style>
/* Reset everything to be weightless */
html, body, #__nuxt {
  background-color: transparent !important;
  background: transparent !important;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Parent iframe handles height */
}
</style>