/**
 * Web Accessibility Training Toolkit - Main JavaScript
 * Handles overall site functionality including accessibility settings
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize accessibility settings
    initAccessibilitySettings();
    
    // Initialize keyboard focus detection
    initKeyboardFocus();
    
    // Add skip link to the page
    addSkipLink();
});

/**
 * Initialize accessibility settings panel and controls
 */
function initAccessibilitySettings() {
    const settingsToggle = document.querySelector('.settings-toggle');
    const settingsPanel = document.getElementById('accessibility-settings');
    
    // Toggle settings panel
    if (settingsToggle && settingsPanel) {
        settingsToggle.addEventListener('click', function() {
            const isExpanded = settingsToggle.getAttribute('aria-expanded') === 'true';
            settingsToggle.setAttribute('aria-expanded', !isExpanded);
            settingsPanel.hidden = isExpanded;
        });
    }
    
    // Font size control
    const fontSizeControl = document.getElementById('font-size');
    if (fontSizeControl) {
        // Load saved setting if available
        const savedFontSize = localStorage.getItem('a11y-font-size');
        if (savedFontSize) {
            fontSizeControl.value = savedFontSize;
            updateFontSize(savedFontSize);
        }
        
        fontSizeControl.addEventListener('input', function() {
            const size = this.value;
            updateFontSize(size);
            localStorage.setItem('a11y-font-size', size);
        });
    }
    
    // High contrast mode
    const contrastControl = document.getElementById('contrast');
    if (contrastControl) {
        // Load saved setting if available
        const savedContrast = localStorage.getItem('a11y-high-contrast') === 'true';
        if (savedContrast) {
            contrastControl.checked = true;
            document.body.classList.add('high-contrast');
        }
        
        contrastControl.addEventListener('change', function() {
            document.body.classList.toggle('high-contrast', this.checked);
            localStorage.setItem('a11y-high-contrast', this.checked);
        });
    }
    
    // Reduce motion
    const motionControl = document.getElementById('reduce-motion');
    if (motionControl) {
        // Load saved setting if available
        const savedMotion = localStorage.getItem('a11y-reduce-motion') === 'true';
        if (savedMotion) {
            motionControl.checked = true;
            document.body.classList.add('reduce-motion');
        }
        
        // Also check for prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            motionControl.checked = true;
            document.body.classList.add('reduce-motion');
        }
        
        motionControl.addEventListener('change', function() {
            document.body.classList.toggle('reduce-motion', this.checked);
            localStorage.setItem('a11y-reduce-motion', this.checked);
        });
    }
    
    // Dyslexia-friendly font
    const dyslexiaFontControl = document.getElementById('dyslexia-font');
    if (dyslexiaFontControl) {
        // Load saved setting if available
        const savedDyslexiaFont = localStorage.getItem('a11y-dyslexia-font') === 'true';
        if (savedDyslexiaFont) {
            dyslexiaFontControl.checked = true;
            document.body.classList.add('dyslexia-font');
        }
        
        dyslexiaFontControl.addEventListener('change', function() {
            document.body.classList.toggle('dyslexia-font', this.checked);
            localStorage.setItem('a11y-dyslexia-font', this.checked);
        });
    }
}

/**
 * Update font size based on the control value
 * @param {string} size - Font size percentage value
 */
function updateFontSize(size) {
    // Remove any existing font size classes
    document.body.classList.forEach(className => {
        if (className.startsWith('font-size-')) {
            document.body.classList.remove(className);
        }
    });
    
    // Add the new font size class
    document.body.classList.add(`font-size-${size}`);
}

/**
 * Initialize keyboard focus detection
 * This helps differentiate between mouse and keyboard focus for styling
 */
function initKeyboardFocus() {
    // Add class for keyboard users
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-focus');
        }
    });
    
    // Remove class when mouse is used
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-focus');
    });
}

/**
 * Add skip link to the page for keyboard users
 */
function addSkipLink() {
    const mainContent = document.getElementById('main-content');
    
    if (mainContent) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

/**
 * Handle smooth scrolling for anchor links
 */
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    if (!href || !href.startsWith('#')) return;
    
    const targetId = href.slice(1);
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) return;
    
    e.preventDefault();
    
    // Smooth scroll to target element
    const reduceMotion = document.body.classList.contains('reduce-motion') || 
                         window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (reduceMotion) {
        // Instant scroll for reduce motion preference
        targetElement.scrollIntoView();
    } else {
        // Smooth scroll
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update URL
    history.pushState(null, null, href);
    
    // Focus the target element if it's not focusable
    if (!targetElement.tabIndex) {
        targetElement.tabIndex = -1;
    }
    targetElement.focus();
});