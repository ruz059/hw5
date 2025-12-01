// theme.js - Simplified Theme Customizer
(function() {
    'use strict';
    
    // Define 3 simple themes
    const themes = {
        'eco-green': {
            name: '🌿 Eco Green',
            colors: {
                '--primary-green': '#2e8b57',
                '--dark-green': '#1a5c3a', 
                '--light-green': '#4caf50',
                '--mint-green': '#e8f5e8',
                '--forest-green': '#2d5a2d',
                '--text-color': '#333333',
                '--light-text': '#ffffff',
                '--bg-color': '#f8fff8',
                '--card-bg': '#ffffff'
            }
        },
        'sky-blue': {
            name: '☁️ Sky Blue', 
            colors: {
                '--primary-green': '#3498db',      // Blue primary
                '--dark-green': '#2980b9',         // Darker blue for header
                '--light-green': '#5dade2',        // Lighter blue
                '--mint-green': '#ebf5fb',         // Very light blue
                '--forest-green': '#21618c',       // Dark blue for headings
                '--text-color': '#2c3e50',         // Dark blue-gray text
                '--light-text': '#ffffff',         // White text
                '--bg-color': '#f8fbfd',           // Light blue background
                '--card-bg': '#ffffff'             // White cards
            }
        },
        'dark-night': {
            name: '🌙 Dark Night',
            colors: {
                '--primary-green': '#27ae60',      // Green accent
                '--dark-green': '#1a5c3a',         // Dark green header
                '--light-green': '#2ecc71',        // Bright green
                '--mint-green': '#1e3a1e',         // Dark green background
                '--forest-green': '#27ae60',       // Green headings
                '--text-color': '#ecf0f1',         // Light text
                '--light-text': '#ffffff',         // White text
                '--bg-color': '#1a1a1a',          // Dark background
                '--card-bg': '#2d2d2d'            // Dark cards
            }
        }
    };

    // Simple font options
    const fontOptions = [
        { name: 'Modern Clean', value: "'Inter', 'Helvetica Neue', Arial, sans-serif" },
        { name: 'Classic Serif', value: "'Georgia', 'Times New Roman', serif" },
        { name: 'Friendly Round', value: "'Comic Sans MS', 'Chalkboard SE', cursive" }
    ];

    // Create minimal theme customizer
    function createThemeCustomizer() {
        const customizer = document.createElement('div');
        customizer.id = 'themeCustomizer';
        customizer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-color);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            display: none;
            max-width: 280px;
            border: 2px solid var(--primary-green);
        `;
        
        customizer.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: var(--text-color); text-align: center;">Choose Theme</h3>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; ">Theme:</label>
                <select id="themeSelect" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                    ${Object.entries(themes).map(([key, theme]) => `
                        <option value="${key}">${theme.name}</option>
                    `).join('')}
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Font:</label>
                <select id="fontSelect" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                    ${fontOptions.map(font => `
                        <option value="${font.value}">${font.name}</option>
                    `).join('')}
                </select>
            </div>
            
            <button id="applyTheme" style="width: 100%; padding: 10px; background: var(--primary-green); 
                    color: white; border: none; border-radius: 5px; margin-bottom: 5px;">
                Apply Theme
            </button>
            <button id="closeCustomizer" style="width: 100%; padding: 10px; background: #666; 
                    color: white; border: none; border-radius: 5px;">
                Close
            </button>
        `;
        
        return customizer;
    }

    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.id = 'themeToggle';
    themeToggle.innerHTML = '🎨 Themes';
    themeToggle.style.cssText = `
        background: var(--primary-green);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        margin-left: 10px;
    `;

    // Overlay for modal
    const overlay = document.createElement('div');
    overlay.id = 'themeOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        display: none;
    `;

    // Apply theme function
    function applyTheme(themeKey, fontValue) {
        const theme = themes[themeKey];
        const root = document.documentElement;
        
        // Apply all colors
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        
        // Apply font
        if (fontValue) {
            root.style.setProperty('--font-family-primary', fontValue);
            root.style.setProperty('--font-family-heading', fontValue);
        }
        
        // Save to localStorage
        localStorage.setItem('selectedTheme', themeKey);
        localStorage.setItem('selectedFont', fontValue);
        
        closeThemeCustomizer();
    }

    function openThemeCustomizer() {
        // Load saved settings
        const savedTheme = localStorage.getItem('selectedTheme') || 'eco-green';
        const savedFont = localStorage.getItem('selectedFont') || fontOptions[0].value;
        
        document.getElementById('themeSelect').value = savedTheme;
        document.getElementById('fontSelect').value = savedFont;
        
        document.getElementById('themeCustomizer').style.display = 'block';
        document.getElementById('themeOverlay').style.display = 'block';
    }

    function closeThemeCustomizer() {
        document.getElementById('themeCustomizer').style.display = 'none';
        document.getElementById('themeOverlay').style.display = 'none';
    }

    // Initialize theme system
    function initThemeSystem() {
        const footer = document.querySelector('footer');
        if (!footer) return;
        
        // Create footer content wrapper
        const footerContent = document.createElement('div');
        footerContent.className = 'footer-content';
        footerContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        `;
        
        // Move existing content
        while (footer.firstChild) {
            footerContent.appendChild(footer.firstChild);
        }
        
        // Add theme toggle
        footerContent.appendChild(themeToggle);
        footer.appendChild(footerContent);
        
        // Add customizer and overlay to body
        document.body.appendChild(overlay);
        document.body.appendChild(createThemeCustomizer());
        
        // Event listeners
        themeToggle.addEventListener('click', openThemeCustomizer);
        overlay.addEventListener('click', closeThemeCustomizer);
        document.getElementById('closeCustomizer').addEventListener('click', closeThemeCustomizer);
        document.getElementById('applyTheme').addEventListener('click', () => {
            const themeKey = document.getElementById('themeSelect').value;
            const fontValue = document.getElementById('fontSelect').value;
            applyTheme(themeKey, fontValue);
        });
        
        // Apply saved theme on load
        const savedTheme = localStorage.getItem('selectedTheme') || 'eco-green';
        const savedFont = localStorage.getItem('selectedFont') || fontOptions[0].value;
        applyTheme(savedTheme, savedFont);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeSystem);
    } else {
        initThemeSystem();
    }

})();
