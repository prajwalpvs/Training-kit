/**
 * Web Accessibility Training Toolkit - Accessibility Checker
 * 
 * This script performs basic accessibility checks on the page and provides
 * guidance for content creators to improve accessibility.
 */

class AccessibilityChecker {
    constructor() {
        this.results = {
            errors: [],
            warnings: [],
            info: []
        };
    }

    /**
     * Run all accessibility checks on the current page
     * @returns {Object} Results of the accessibility checks
     */
    checkPage() {
        this.resetResults();
        
        // Run all checks
        this.checkImages();
        this.checkHeadings();
        this.checkLinks();
        this.checkContrast();
        this.checkForms();
        this.checkTables();
        this.checkKeyboardAccess();
        this.checkARIA();
        
        return this.results;
    }
    
    /**
     * Reset results before running checks
     */
    resetResults() {
        this.results = {
            errors: [],
            warnings: [],
            info: []
        };
    }
    
    /**
     * Check all images for alt text
     */
    checkImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
            // Check if image has alt attribute
            if (!img.hasAttribute('alt')) {
                this.results.errors.push({
                    type: 'image',
                    element: img,
                    description: `Image #${index + 1} is missing alt text`,
                    impact: 'high',
                    position: this.getElementPosition(img),
                    recommendation: 'Add descriptive alt text to the image'
                });
            } else if (img.alt === '' && !this.isDecorativeImage(img)) {
                // Empty alt text but not marked as decorative
                this.results.warnings.push({
                    type: 'image',
                    element: img,
                    description: `Image #${index + 1} has empty alt text but may not be decorative`,
                    impact: 'medium',
                    position: this.getElementPosition(img),
                    recommendation: 'Add descriptive alt text if the image conveys information'
                });
            }
            
            // Check for very long alt text
            if (img.alt && img.alt.length > 125) {
                this.results.warnings.push({
                    type: 'image',
                    element: img,
                    description: `Image #${index + 1} has very long alt text (${img.alt.length} chars)`,
                    impact: 'low',
                    position: this.getElementPosition(img),
                    recommendation: 'Consider making alt text more concise or use a figure with caption'
                });
            }
        });
    }
    
    /**
     * Check if an image is marked as decorative
     * @param {HTMLElement} img - The image element to check
     * @returns {boolean} Whether the image is decorative
     */
    isDecorativeImage(img) {
        return img.getAttribute('role') === 'presentation' || 
               img.getAttribute('aria-hidden') === 'true';
    }
    
    /**
     * Check heading structure
     */
    checkHeadings() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let previousLevel = 0;
        let h1Count = 0;
        
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.substring(1));
            
            // Count h1 elements
            if (level === 1) {
                h1Count++;
            }
            
            // Check for skipped heading levels
            if (level > previousLevel + 1 && index > 0) {
                this.results.errors.push({
                    type: 'heading',
                    element: heading,
                    description: `Heading structure skips from H${previousLevel} to H${level}`,
                    impact: 'high',
                    position: this.getElementPosition(heading),
                    recommendation: `Use sequential heading levels. Consider using H${previousLevel + 1} instead.`
                });
            }
            
            // Check for empty headings
            if (heading.textContent.trim() === '') {
                this.results.errors.push({
                    type: 'heading',
                    element: heading,
                    description: `Empty heading (${heading.tagName})`,
                    impact: 'high',
                    position: this.getElementPosition(heading),
                    recommendation: 'Add text content to the heading or remove it'
                });
            }
            
            previousLevel = level;
        });
        
        // Check for missing h1
        if (h1Count === 0) {
            this.results.errors.push({
                type: 'heading',
                element: document.body,
                description: 'Page is missing an H1 heading',
                impact: 'high',
                recommendation: 'Add an H1 heading that describes the main content of the page'
            });
        } else if (h1Count > 1) {
            this.results.warnings.push({
                type: 'heading',
                element: document.body,
                description: `Page has multiple H1 headings (${h1Count})`,
                impact: 'medium',
                recommendation: 'Consider using only one H1 heading for the main title of the page'
            });
        }
    }
    
    /**
     * Check links for accessibility issues
     */
    checkLinks() {
        const links = document.querySelectorAll('a');
        
        links.forEach((link, index) => {
            // Check for empty links
            if (!link.textContent.trim() && !link.hasAttribute('aria-label') && 
                !link.querySelector('img[alt]')) {
                this.results.errors.push({
                    type: 'link',
                    element: link,
                    description: `Link #${index + 1} has no text content`,
                    impact: 'high',
                    position: this.getElementPosition(link),
                    recommendation: 'Add descriptive text to the link or use aria-label'
                });
            }
            
            // Check for generic link text
            const linkText = (link.textContent || '').trim().toLowerCase();
            if (['click here', 'read more', 'more', 'link', 'here'].includes(linkText)) {
                this.results.warnings.push({
                    type: 'link',
                    element: link,
                    description: `Link uses generic text: "${linkText}"`,
                    impact: 'medium',
                    position: this.getElementPosition(link),
                    recommendation: 'Use descriptive link text that makes sense out of context'
                });
            }
            
            // Check for target="_blank" without warning
            if (link.getAttribute('target') === '_blank' && !link.getAttribute('aria-description')?.includes('new window')) {
                this.results.warnings.push({
                    type: 'link',
                    element: link,
                    description: 'Link opens in new window without warning',
                    impact: 'medium',
                    position: this.getElementPosition(link),
                    recommendation: 'Add indication that link opens in a new window using aria-description'
                });
            }
        });
    }
    
    /**
     * Check for sufficient color contrast
     * Note: This is a basic implementation and would need a more sophisticated
     * algorithm for accurate contrast checking
     */
    checkContrast() {
        // For a comprehensive check, you would need to:
        // 1. Get computed styles for text and background
        // 2. Calculate contrast ratio using WCAG formula
        // 3. Check against appropriate ratio (4.5:1 for normal text, 3:1 for large text)
        
        this.results.info.push({
            type: 'contrast',
            description: 'Basic contrast check only - use a dedicated tool for comprehensive testing',
            impact: 'info',
            recommendation: 'Use a tool like the WebAIM Color Contrast Checker for accurate results'
        });
        
        // Check for text using CSS with !important that might override accessibility settings
        const styleSheets = document.styleSheets;
        let importantColorDeclarations = false;
        
        try {
            for (let i = 0; i < styleSheets.length; i++) {
                const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                if (!rules) continue;
                
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j];
                    if (!rule.style) continue;
                    
                    if ((rule.style.color && rule.style.color.includes('!important')) ||
                        (rule.style.backgroundColor && rule.style.backgroundColor.includes('!important'))) {
                        importantColorDeclarations = true;
                        break;
                    }
                }
                
                if (importantColorDeclarations) break;
            }
        } catch (e) {
            // CORS issues may prevent accessing some stylesheets
            console.warn('Could not check all stylesheets for !important color declarations', e);
        }
        
        if (importantColorDeclarations) {
            this.results.warnings.push({
                type: 'contrast',
                description: 'Found !important color declarations that may override user settings',
                impact: 'medium',
                recommendation: 'Avoid using !important for color and background-color declarations'
            });
        }
    }
    
    /**
     * Check form elements for accessibility issues
     */
    checkForms() {
        const formElements = document.querySelectorAll('input, select, textarea');
        const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"]');
        
        // Check form controls
        formElements.forEach((element) => {
            // Skip hidden, submit, button, and image inputs
            if (['hidden', 'submit', 'button', 'image'].includes(element.type)) {
                return;
            }
            
            // Check for labels
            const id = element.getAttribute('id');
            if (!id) {
                this.results.errors.push({
                    type: 'form',
                    element: element,
                    description: `Form control (${element.tagName.toLowerCase()}) is missing an ID`,
                    impact: 'high',
                    position: this.getElementPosition(element),
                    recommendation: 'Add an ID to the form control and associate it with a label'
                });
            } else {
                const label = document.querySelector(`label[for="${id}"]`);
                if (!label && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
                    this.results.errors.push({
                        type: 'form',
                        element: element,
                        description: `Form control with ID "${id}" does not have an associated label`,
                        impact: 'high',
                        position: this.getElementPosition(element),
                        recommendation: 'Add a label element with a for attribute matching the input ID'
                    });
                }
            }
            
            // Check required fields
            if (element.hasAttribute('required') && !element.hasAttribute('aria-required')) {
                this.results.warnings.push({
                    type: 'form',
                    element: element,
                    description: 'Required form field without aria-required attribute',
                    impact: 'low',
                    position: this.getElementPosition(element),
                    recommendation: 'Add aria-required="true" for better screen reader support'
                });
            }
        });
        
        // Check buttons
        buttons.forEach((button) => {
            if (!button.textContent.trim() && !button.hasAttribute('aria-label') && 
                !button.hasAttribute('aria-labelledby') && !button.value) {
                this.results.errors.push({
                    type: 'form',
                    element: button,
                    description: 'Button has no accessible name',
                    impact: 'high',
                    position: this.getElementPosition(button),
                    recommendation: 'Add text content, value, or aria-label to the button'
                });
            }
        });
    }
    
    /**
     * Check tables for accessibility issues
     */
    checkTables() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach((table, index) => {
            // Check for caption
            if (!table.querySelector('caption')) {
                this.results.warnings.push({
                    type: 'table',
                    element: table,
                    description: `Table #${index + 1} has no caption`,
                    impact: 'medium',
                    position: this.getElementPosition(table),
                    recommendation: 'Add a caption element to describe the table content'
                });
            }
            
            // Check for headers
            const headers = table.querySelectorAll('th');
            if (headers.length === 0) {
                this.results.errors.push({
                    type: 'table',
                    element: table,
                    description: `Table #${index + 1} has no header cells (th)`,
                    impact: 'high',
                    position: this.getElementPosition(table),
                    recommendation: 'Add th elements for all column and/or row headers'
                });
            }
            
            // Check for scope attribute on headers
            headers.forEach(header => {
                if (!header.hasAttribute('scope')) {
                    this.results.warnings.push({
                        type: 'table',
                        element: header,
                        description: 'Table header cell is missing scope attribute',
                        impact: 'medium',
                        position: this.getElementPosition(header),
                        recommendation: 'Add scope="col" for column headers or scope="row" for row headers'
                    });
                }
            });
        });
    }
    
    /**
     * Check for keyboard accessibility issues
     */
    checkKeyboardAccess() {
        // Check for tabindex greater than 0
        const elementsWithTabindex = document.querySelectorAll('[tabindex]');
        
        elementsWithTabindex.forEach(element => {
            const tabindex = parseInt(element.getAttribute('tabindex'));
            if (tabindex > 0) {
                this.results.warnings.push({
                    type: 'keyboard',
                    element: element,
                    description: `Element has tabindex="${tabindex}"`,
                    impact: 'medium',
                    position: this.getElementPosition(element),
                    recommendation: 'Avoid using tabindex values greater than 0 as they disrupt the natural tab order'
                });
            }
        });
        
        // Check for click handlers without keyboard event handlers
        const clickableElements = document.querySelectorAll('[onclick]');
        
        clickableElements.forEach(element => {
            if (!element.hasAttribute('onkeydown') && !element.hasAttribute('onkeyup') && 
                !element.hasAttribute('onkeypress') && element.tagName.toLowerCase() !== 'a' && 
                element.tagName.toLowerCase() !== 'button' && element.tagName.toLowerCase() !== 'input') {
                this.results.warnings.push({
                    type: 'keyboard',
                    element: element,
                    description: 'Element has click handler without keyboard event handler',
                    impact: 'high',
                    position: this.getElementPosition(element),
                    recommendation: 'Add keyboard event handlers (onkeydown) or use a button/link element instead'
                });
            }
        });
    }
    
    /**
     * Check ARIA attributes for common issues
     */
    checkARIA() {
        // Check for invalid ARIA roles
        const validRoles = [
            'alert', 'alertdialog', 'application', 'article', 'banner', 'button', 
            'cell', 'checkbox', 'columnheader', 'combobox', 'complementary', 
            'contentinfo', 'definition', 'dialog', 'directory', 'document', 
            'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading', 
            'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 
            'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 
            'menuitemradio', 'navigation', 'note', 'option', 'presentation', 
            'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup', 
            'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 
            'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 
            'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 
            'tooltip', 'tree', 'treegrid', 'treeitem'
        ];
        
        const elementsWithRole = document.querySelectorAll('[role]');
        
        elementsWithRole.forEach(element => {
            const role = element.getAttribute('role');
            if (!validRoles.includes(role)) {
                this.results.errors.push({
                    type: 'aria',
                    element: element,
                    description: `Invalid ARIA role: "${role}"`,
                    impact: 'high',
                    position: this.getElementPosition(element),
                    recommendation: 'Use a valid ARIA role or remove the attribute'
                });
            }
        });
        
        // Check for aria-hidden="true" on focusable elements
        const hiddenElements = document.querySelectorAll('[aria-hidden="true"]');
        
        hiddenElements.forEach(element => {
            if (this.isFocusable(element)) {
                this.results.errors.push({
                    type: 'aria',
                    element: element,
                    description: 'aria-hidden="true" used on a focusable element',
                    impact: 'high',
                    position: this.getElementPosition(element),
                    recommendation: 'Remove aria-hidden or make the element unfocusable'
                });
            }
        });
    }
    
    /**
     * Check if an element is focusable
     * @param {HTMLElement} element - The element to check
     * @returns {boolean} Whether the element is focusable
     */
    isFocusable(element) {
        const focusableElements = ['a', 'button', 'input', 'select', 'textarea', 'video', 'audio'];
        return focusableElements.includes(element.tagName.toLowerCase()) || 
               element.hasAttribute('tabindex');
    }
    
    /**
     * Get the position of an element in the document
     * @param {HTMLElement} element - The element to get the position for
     * @returns {Object} The position information
     */
    getElementPosition(element) {
        if (!element || !element.getBoundingClientRect) {
            return { description: 'Unknown' };
        }
        
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        const top = Math.round(rect.top + scrollTop);
        const left = Math.round(rect.left + scrollLeft);
        
        let path = '';
        let currentElement = element;
        
        while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
            let selector = currentElement.tagName.toLowerCase();
            
            if (currentElement.id) {
                selector += `#${currentElement.id}`;
            } else if (currentElement.className) {
                selector += `.${currentElement.className.split(' ')[0]}`;
            }
            
            path = selector + (path ? ' > ' + path : '');
            currentElement = currentElement.parentNode;
        }
        
        return {
            top,
            left,
            path,
            description: `${path} at (${left}, ${top})`
        };
    }
    
    /**
     * Display the accessibility check results on the page
     * @param {Object} results - The accessibility check results
     */
    displayResults(results = null) {
        if (!results) {
            results = this.results;
        }
        
        // Create results container if it doesn't exist
        let resultsContainer = document.getElementById('accessibility-results');
        
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.id = 'accessibility-results';
            resultsContainer.className = 'a11y-results';
            
            // Add styles
            const styles = `
                .a11y-results {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    max-width: 400px;
                    max-height: 80vh;
                    overflow: auto;
                    background: #fff;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    z-index: 10000;
                    padding: 15px;
                    font-family: sans-serif;
                }
                .a11y-results h2 {
                    margin-top: 0;
                }
                .a11y-results-summary {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                .a11y-results-count {
                    padding: 5px 10px;
                    border-radius: 3px;
                    font-weight: bold;
                }
                .a11y-errors {
                    background: #ffdddd;
                    color: #c00;
                }
                .a11y-warnings {
                    background: #ffffdd;
                    color: #880;
                }
                .a11y-info {
                    background: #ddffff;
                    color: #088;
                }
                .a11y-issue {
                    margin-bottom: 15px;
                    padding: 10px;
                    border-radius: 3px;
                }
                .a11y-error {
                    background: #fff8f8;
                    border-left: 3px solid #c00;
                }
                .a11y-warning {
                    background: #fffff8;
                    border-left: 3px solid #880;
                }
                .a11y-info-item {
                    background: #f8ffff;
                    border-left: 3px solid #088;
                }
                .a11y-issue-description {
                    font-weight: bold;
                }
                .a11y-issue-impact {
                    display: inline-block;
                    padding: 2px 5px;
                    border-radius: 3px;
                    font-size: 0.8em;
                    margin-left: 5px;
                }
                .a11y-issue-impact.high {
                    background: #c00;
                    color: white;
                }
                .a11y-issue-impact.medium {
                    background: #880;
                    color: white;
                }
                .a11y-issue-impact.low {
                    background: #088;
                    color: white;
                }
                .a11y-issue-position {
                    font-size: 0.8em;
                    color: #666;
                    margin: 5px 0;
                }
                .a11y-issue-recommendation {
                    margin-top: 5px;
                }
                .a11y-close {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                }
            `;
            
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
            
            document.body.appendChild(resultsContainer);
        }
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'a11y-close';
        closeButton.textContent = '×';
        closeButton.setAttribute('aria-label', 'Close accessibility results');
        closeButton.addEventListener('click', () => {
            resultsContainer.remove();
        });
        resultsContainer.appendChild(closeButton);
        
        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Accessibility Check Results';
        resultsContainer.appendChild(title);
        
        // Add summary
        const summary = document.createElement('div');
        summary.className = 'a11y-results-summary';
        
        const errorCount = document.createElement('div');
        errorCount.className = 'a11y-results-count a11y-errors';
        errorCount.textContent = `${results.errors.length} Errors`;
        summary.appendChild(errorCount);
        
        const warningCount = document.createElement('div');
        warningCount.className = 'a11y-results-count a11y-warnings';
        warningCount.textContent = `${results.warnings.length} Warnings`;
        summary.appendChild(warningCount);
        
        const infoCount = document.createElement('div');
        infoCount.className = 'a11y-results-count a11y-info';
        infoCount.textContent = `${results.info.length} Info`;
        summary.appendChild(infoCount);
        
        resultsContainer.appendChild(summary);
        
        // Add errors
        if (results.errors.length > 0) {
            const errorsTitle = document.createElement('h3');
            errorsTitle.textContent = 'Errors';
            resultsContainer.appendChild(errorsTitle);
            
            results.errors.forEach(error => {
                resultsContainer.appendChild(this.createIssueElement(error, 'error'));
            });
        }
        
        // Add warnings
        if (results.warnings.length > 0) {
            const warningsTitle = document.createElement('h3');
            warningsTitle.textContent = 'Warnings';
            resultsContainer.appendChild(warningsTitle);
            
            results.warnings.forEach(warning => {
                resultsContainer.appendChild(this.createIssueElement(warning, 'warning'));
            });
        }
        
        // Add info
        if (results.info.length > 0) {
            const infoTitle = document.createElement('h3');
            infoTitle.textContent = 'Information';
            resultsContainer.appendChild(infoTitle);
            
            results.info.forEach(info => {
                resultsContainer.appendChild(this.createIssueElement(info, 'info-item'));
            });
        }
    }
    
    /**
     * Create an element for an accessibility issue
     * @param {Object} issue - The issue information
     * @param {string} type - The type of issue (error, warning, info-item)
     * @returns {HTMLElement} The issue element
     */
    createIssueElement(issue, type) {
        const element = document.createElement('div');
        element.className = `a11y-issue a11y-${type}`;
        
        const description = document.createElement('div');
        description.className = 'a11y-issue-description';
        description.textContent = issue.description;
        
        const impact = document.createElement('span');
        impact.className = `a11y-issue-impact ${issue.impact}`;
        impact.textContent = issue.impact;
        description.appendChild(impact);
        
        element.appendChild(description);
        
        if (issue.position) {
            const position = document.createElement('div');
            position.className = 'a11y-issue-position';
            position.textContent = issue.position.description;
            element.appendChild(position);
        }
        
        if (issue.recommendation) {
            const recommendation = document.createElement('div');
            recommendation.className = 'a11y-issue-recommendation';
            recommendation.textContent = issue.recommendation;
            element.appendChild(recommendation);
        }
        
        return element;
    }
}

// Initialize the accessibility checker
const a11yChecker = new AccessibilityChecker();

// Add a keyboard shortcut to run the accessibility checker (Alt+A)
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 'a') {
        const results = a11yChecker.checkPage();
        a11yChecker.displayResults(results);
    }
});

// Add button to run accessibility checker
document.addEventListener('DOMContentLoaded', function() {
    // Add "Check Accessibility" button to accessibility settings panel
    const settingsPanel = document.getElementById('accessibility-settings');
    
    if (settingsPanel) {
        const container = settingsPanel.querySelector('.container');
        
        if (container) {
            const checkButton = document.createElement('button');
            checkButton.className = 'button primary';
            checkButton.textContent = 'Check Page Accessibility';
            checkButton.setAttribute('aria-label', 'Run accessibility check on current page');
            
            checkButton.addEventListener('click', function() {
                const results = a11yChecker.checkPage();
                a11yChecker.displayResults(results);
            });
            
            // Create a section for the button
            const buttonSection = document.createElement('div');
            buttonSection.className = 'a11y-checker-button';
            buttonSection.style.marginTop = '20px';
            buttonSection.appendChild(checkButton);
            
            container.appendChild(buttonSection);
        }
    }
});