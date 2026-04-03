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

/* This is crucial for the iframe content itself */
:where(html, body) {
  background-color: transparent !important;
  background: transparent !important;
}

/* If you are using Tailwind, you might have a default bg-white 
   on a wrapper div. Remove it or set it to bg-transparent */
.__nuxt, #__nuxt {
  background: transparent !important;
}
</style>