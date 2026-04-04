// This script runs on the CLIENT website
(function() {
    window.addEventListener('message', function(event) {
      // Only listen for GhostForm signals
      if (event.data && event.data.type === 'resize') {
        const iframes = document.querySelectorAll('iframe');
        
        iframes.forEach(iframe => {
          // Find the iframe pointing to your GhostForm URL
          if (iframe?.src?.includes('/')) {
            // Smoothly adjust the height
            iframe.style.height = event.data.height + 'px';
            iframe.style.transition = 'height 0.3s ease-out';
          }
        });
      }
    }, false);
  })();