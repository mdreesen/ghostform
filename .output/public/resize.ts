(function() {
    window.addEventListener('message', function(event) {
      // 1. Security check: Only listen for GhostForm resize signals
      if (event.data && event.data.type === 'resize') {
        // 2. Find the iframe on the customer's page
        // We look for any iframe pointing to your GhostForm domain
        const iframes = document.querySelectorAll('iframe');
        
        iframes.forEach(iframe => {
          if (iframe.src.includes('/f/')) {
            // 3. Spectral Adjustment: Match the height instantly
            iframe.style.height = event.data.height + 'px';
            iframe.style.transition = 'height 0.3s ease-out';
          }
        });
      }
    }, false);
  })();