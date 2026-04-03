<template>
  <div class="transparent-layout">
    <slot />
  </div>
</template>

<style>
/* This targets the actual browser window inside the iframe */
html, body {
  background-color: transparent !important;
  background: transparent !important;
}

.transparent-layout {
  background: transparent !important;
}
</style>