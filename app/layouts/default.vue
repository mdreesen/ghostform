<template>
  <div class="bg-transparent antialiased min-h-fit min-w-fit">
    <slot />
  </div>
</template>

<style>
/* Ensure the body doesn't have a background so the host site shows through */
html, body {
  background: transparent !important;
  overflow: hidden; /* The parent iframe handles the height */
}
</style>