// public/embed.js
(function() {
    const script = document.currentScript;
    const formId = script?.getAttribute('data-id');
    const color = script?.getAttribute('data-color') || '00F2FF';
    const radius = script?.getAttribute('data-radius') || '24px';
    const target = document.getElementById('ghostform-root');
  
    if (!target) return;
  
    const iframe = document.createElement('iframe');
    iframe.src = `https://ghostform.ai/f/${formId}?color=${color}`;
    iframe.style.width = '100%';
    iframe.style.height = '600px'; // Initial height
    iframe.style.border = 'none';
    iframe.style.borderRadius = radius;
    iframe.style.transition = 'height 0.3s ease-out';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no'; // Legacy fallback for some browsers
  
    target.appendChild(iframe);
  
    // Listen for the "Ghost-Resize" message from the Nuxt app
    window.addEventListener('message', (event) => {
      if (event.data.type === 'resize' && event.data.height) {
        iframe.style.height = event.data.height + 'px';
      }
    });
  })();