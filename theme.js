// theme.js - Enhanced Theme Customizer for Mary Zhao's Website
(function() {
    'use strict';
    
    // Define preset themes
    const themes = {
        'light': {
            name: ' Light',
            colors: {
                '--bg-color': '#ffffff',
                '--text-color': '#333333',
                '--accent-color': '#4a90e2',
                '--card-bg': '#f8f9fa',
                '--border-color': '#dee2e6'
            }
        },
        'dark': {
            name: ' Dark',
            colors: {
                '--bg-color': '#1a1a1a',
                '--text-color': '#f0f0f0',
                '--accent-color': '#64b5f6',
                '--card-bg': '#2d2d2d',
                '--border-color': '#444444'
            }
        }
    };

    // Font options with descriptive names
    const fontOptions = [
        { 
            name: 'Modern Clean', 
            value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            preview: 'Clean and professional'
        },
        { 
            name: 'Classic Serif', 
            value: "'Georgia', 'Times New Roman', serif",
            preview: 'Traditional and formal'
        },
        { 
            name: 'Friendly Round', 
            value: "'Comic Sans MS', 'Chalkboard SE', cursive",
            preview: 'Casual and approachable'
        }
    ];

    // Background color options with descriptive names
    const bgColorOptions = [
        { name: 'Pure White', value: '#ffffff', preview: 'Clean and bright' },
        { name: 'Soft Cream', value: '#fef9f7', preview: 'Warm and gentle' },
        { name: 'Light Gray', value: '#f8f9fa', preview: 'Neutral and modern' },
        { name: 'Pale Blue', value: '#f0f8ff', preview: 'Calm and cool' },
        { name: 'Mint Green', value: '#f0fff0', preview: 'Fresh and natural' },
        { name: 'Lavender', value: '#f5f0ff', preview: 'Soft and creative' },
        { name: 'Warm Beige', value: '#fdf5e6', preview: 'Cozy and comfortable' },
        { name: 'Dark Charcoal', value: '#2d2d2d', preview: 'Professional dark' },
        { name: 'Deep Navy', value: '#1a237e', preview: 'Rich and deep' },
        { name: 'Forest Green', value: '#1b5e20', preview: 'Natural and earthy' }
    ];

    // Text color options with descriptive names
    const textColorOptions = [
        { name: 'Deep Black', value: '#333333', preview: 'Standard and readable' },
        { name: 'Charcoal Gray', value: '#555555', preview: 'Soft and professional' },
        { name: 'Navy Blue', value: '#1a237e', preview: 'Trustworthy' },
        { name: 'Forest Green', value: '#1b5e20', preview: 'Natural' },
        { name: 'Burgundy', value: '#880e4f', preview: 'Elegant' },
        { name: 'Dark Brown', value: '#4e342e', preview: 'Warm and classic' },
        { name: 'Pure White', value: '#ffffff', preview: 'Light theme text' },
        { name: 'Soft Gray', value: '#e0e0e0', preview: 'Light on dark' },
        { name: 'Cream', value: '#f5f5f5', preview: 'Soft light' },
        { name: 'Light Blue', value: '#bbdefb', preview: 'Cool light' }
    ];

    // Create theme customizer
    function createThemeCustomizer() {
        const customizer = document.createElement('div');
        customizer.id = 'themeCustomizer';
        customizer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-color);
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            display: none;
            max-width: 320px;
            width: 90%;
            border: 2px solid var(--accent-color);
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        customizer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: var(--text-color);">Customize Your Theme</h3>
                <button id="closeCustomizer" style="background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text-color);">✕</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: var(--text-color);">Preset Themes:</label>
                <select id="themeSelect" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-color);">
                    ${Object.entries(themes).map(([key, theme]) => `
                        <option value="${key}">${theme.name}</option>
                    `).join('')}
                    <option value="custom"> Custom Theme</option>
                </select>
            </div>
            
            <div id="customOptions" style="display: none;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: var(--text-color);">Font Style:</label>
                    <select id="fontSelect" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-color);">
                        ${fontOptions.map(font => `
                            <option value="${font.value}">${font.name} - ${font.preview}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: var(--text-color);">Background Color:</label>
                    <select id="bgColorSelect" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-color);">
                        ${bgColorOptions.map(color => `
                            <option value="${color.value}">${color.name} - ${color.preview}</option>
                        `).join('')}
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: var(--text-color);">Text Color:</label>
                    <select id="textColorSelect" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-color);">
                        ${textColorOptions.map(color => `
                            <option value="${color.value}">${color.name} - ${color.preview}</option>
                        `).join('')}
                    </select>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button id="applyTheme" style="flex: 1; padding: 12px; background: var(--accent-color); 
                        color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    Apply Theme
                </button>
                <button id="resetTheme" style="padding: 12px 20px; background: #666; 
                        color: white; border: none; border-radius: 6px; cursor: pointer;">
                    Reset
                </button>
            </div>
        `;
        
        return customizer;
    }

    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.id = 'themeToggle';
    themeToggle.innerHTML = ' Customize Theme';
    themeToggle.style.cssText = `
        background: var(--accent-color);
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        margin: 10px auto;
        display: block;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
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
    function applyTheme(themeKey, fontValue, bgColor, textColor) {
        const root = document.documentElement;
        
        if (themeKey !== 'custom') {
            // Apply preset theme
            const theme = themes[themeKey];
            Object.entries(theme.colors).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
            
            // Save to localStorage
            localStorage.setItem('selectedTheme', themeKey);
            localStorage.removeItem('customFont');
            localStorage.removeItem('customBgColor');
            localStorage.removeItem('customTextColor');
        } else {
            // Apply custom theme
            root.style.setProperty('--bg-color', bgColor);
            root.style.setProperty('--text-color', textColor);
            root.style.setProperty('--font-family', fontValue);
            
            // Update accent color based on background for contrast
            const isLightBg = isColorLight(bgColor);
            const accentColor = isLightBg ? '#4a90e2' : '#64b5f6';
            root.style.setProperty('--accent-color', accentColor);
            
            // Update card and border colors
            const cardBg = isLightBg ? lightenColor(bgColor, 10) : darkenColor(bgColor, 10);
            const borderColor = isLightBg ? darkenColor(bgColor, 15) : lightenColor(bgColor, 15);
            root.style.setProperty('--card-bg', cardBg);
            root.style.setProperty('--border-color', borderColor);
            
            // Save to localStorage
            localStorage.setItem('selectedTheme', 'custom');
            localStorage.setItem('customFont', fontValue);
            localStorage.setItem('customBgColor', bgColor);
            localStorage.setItem('customTextColor', textColor);
        }
        
        closeThemeCustomizer();
    }

    // Helper function to check if a color is light
    function isColorLight(color) {
        // Convert hex to RGB
        let r, g, b;
        if (color.startsWith('#')) {
            r = parseInt(color.substr(1, 2), 16);
            g = parseInt(color.substr(3, 2), 16);
            b = parseInt(color.substr(5, 2), 16);
        } else {
            // Handle named colors or other formats if needed
            return true; // Default to light
        }
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
    }

    // Helper function to lighten a color
    function lightenColor(color, percent) {
        let r, g, b;
        if (color.startsWith('#')) {
            r = parseInt(color.substr(1, 2), 16);
            g = parseInt(color.substr(3, 2), 16);
            b = parseInt(color.substr(5, 2), 16);
        } else {
            return color; // Return original if not hex
        }
        
        r = Math.min(255, r + (255 - r) * percent / 100);
        g = Math.min(255, g + (255 - g) * percent / 100);
        b = Math.min(255, b + (255 - b) * percent / 100);
        
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    }

    // Helper function to darken a color
    function darkenColor(color, percent) {
        let r, g, b;
        if (color.startsWith('#')) {
            r = parseInt(color.substr(1, 2), 16);
            g = parseInt(color.substr(3, 2), 16);
            b = parseInt(color.substr(5, 2), 16);
        } else {
            return color; // Return original if not hex
        }
        
        r = Math.max(0, r * (1 - percent / 100));
        g = Math.max(0, g * (1 - percent / 100));
        b = Math.max(0, b * (1 - percent / 100));
        
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    }

    function openThemeCustomizer() {
        // Load saved settings
        const savedTheme = localStorage.getItem('selectedTheme') || 'light';
        const savedFont = localStorage.getItem('customFont') || fontOptions[0].value;
        const savedBgColor = localStorage.getItem('customBgColor') || bgColorOptions[0].value;
        const savedTextColor = localStorage.getItem('customTextColor') || textColorOptions[0].value;
        
        document.getElementById('themeSelect').value = savedTheme;
        document.getElementById('fontSelect').value = savedFont;
        document.getElementById('bgColorSelect').value = savedBgColor;
        document.getElementById('textColorSelect').value = savedTextColor;
        
        // Show/hide custom options based on theme selection
        toggleCustomOptions(savedTheme === 'custom');
        
        document.getElementById('themeCustomizer').style.display = 'block';
        document.getElementById('themeOverlay').style.display = 'block';
    }

    function closeThemeCustomizer() {
        document.getElementById('themeCustomizer').style.display = 'none';
        document.getElementById('themeOverlay').style.display = 'none';
    }

    function toggleCustomOptions(show) {
        document.getElementById('customOptions').style.display = show ? 'block' : 'none';
    }

    function resetTheme() {
        localStorage.removeItem('selectedTheme');
        localStorage.removeItem('customFont');
        localStorage.removeItem('customBgColor');
        localStorage.removeItem('customTextColor');
        applyTheme('light');
    }

    // Initialize theme system
    function initThemeSystem() {
        const footer = document.querySelector('footer');
        if (!footer) return;
        
        // Add theme toggle to footer
        footer.appendChild(themeToggle);
        
        // Add customizer and overlay to body
        document.body.appendChild(overlay);
        document.body.appendChild(createThemeCustomizer());
        
        // Event listeners
        themeToggle.addEventListener('click', openThemeCustomizer);
        overlay.addEventListener('click', closeThemeCustomizer);
        document.getElementById('closeCustomizer').addEventListener('click', closeThemeCustomizer);
        document.getElementById('resetTheme').addEventListener('click', resetTheme);
        
        document.getElementById('themeSelect').addEventListener('change', function() {
            toggleCustomOptions(this.value === 'custom');
        });
        
        document.getElementById('applyTheme').addEventListener('click', () => {
            const themeKey = document.getElementById('themeSelect').value;
            const fontValue = document.getElementById('fontSelect').value;
            const bgColor = document.getElementById('bgColorSelect').value;
            const textColor = document.getElementById('textColorSelect').value;
            applyTheme(themeKey, fontValue, bgColor, textColor);
        });
        
        // Apply saved theme on load
        const savedTheme = localStorage.getItem('selectedTheme') || 'light';
        if (savedTheme === 'custom') {
            const savedFont = localStorage.getItem('customFont') || fontOptions[0].value;
            const savedBgColor = localStorage.getItem('customBgColor') || bgColorOptions[0].value;
            const savedTextColor = localStorage.getItem('customTextColor') || textColorOptions[0].value;
            applyTheme('custom', savedFont, savedBgColor, savedTextColor);
        } else {
            applyTheme(savedTheme);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeSystem);
    } else {
        initThemeSystem();
    }

})();



















// // theme.js - Simplified Theme Customizer
// (function() {
//     'use strict';
    
//     // Define 3 simple themes
//     const themes = {
//         'eco-green': {
//             name: '🌿 Eco Green',
//             colors: {
//                 '--primary-green': '#2e8b57',
//                 '--dark-green': '#1a5c3a', 
//                 '--light-green': '#4caf50',
//                 '--mint-green': '#e8f5e8',
//                 '--forest-green': '#2d5a2d',
//                 '--text-color': '#333333',
//                 '--light-text': '#ffffff',
//                 '--bg-color': '#f8fff8',
//                 '--card-bg': '#ffffff'
//             }
//         },
//         'sky-blue': {
//             name: '☁️ Sky Blue', 
//             colors: {
//                 '--primary-green': '#3498db',      // Blue primary
//                 '--dark-green': '#2980b9',         // Darker blue for header
//                 '--light-green': '#5dade2',        // Lighter blue
//                 '--mint-green': '#ebf5fb',         // Very light blue
//                 '--forest-green': '#21618c',       // Dark blue for headings
//                 '--text-color': '#2c3e50',         // Dark blue-gray text
//                 '--light-text': '#ffffff',         // White text
//                 '--bg-color': '#f8fbfd',           // Light blue background
//                 '--card-bg': '#ffffff'             // White cards
//             }
//         },
//         'dark-night': {
//             name: '🌙 Dark Night',
//             colors: {
//                 '--primary-green': '#27ae60',      // Green accent
//                 '--dark-green': '#1a5c3a',         // Dark green header
//                 '--light-green': '#2ecc71',        // Bright green
//                 '--mint-green': '#1e3a1e',         // Dark green background
//                 '--forest-green': '#27ae60',       // Green headings
//                 '--text-color': '#ecf0f1',         // Light text
//                 '--light-text': '#ffffff',         // White text
//                 '--bg-color': '#1a1a1a',          // Dark background
//                 '--card-bg': '#2d2d2d'            // Dark cards
//             }
//         }
//     };

//     // Simple font options
//     const fontOptions = [
//         { name: 'Modern Clean', value: "'Inter', 'Helvetica Neue', Arial, sans-serif" },
//         { name: 'Classic Serif', value: "'Georgia', 'Times New Roman', serif" },
//         { name: 'Friendly Round', value: "'Comic Sans MS', 'Chalkboard SE', cursive" }
//     ];

//     // Create minimal theme customizer
//     function createThemeCustomizer() {
//         const customizer = document.createElement('div');
//         customizer.id = 'themeCustomizer';
//         customizer.style.cssText = `
//             position: fixed;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//             background: var(--bg-color);
//             padding: 20px;
//             border-radius: 10px;
//             box-shadow: 0 4px 20px rgba(0,0,0,0.3);
//             z-index: 10000;
//             display: none;
//             max-width: 280px;
//             border: 2px solid var(--primary-green);
//         `;
        
//         customizer.innerHTML = `
//             <h3 style="margin: 0 0 15px 0; color: var(--text-color); text-align: center;">Choose Theme</h3>
            
//             <div style="margin-bottom: 15px;">
//                 <label style="display: block; margin-bottom: 8px; font-weight: bold; ">Theme:</label>
//                 <select id="themeSelect" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
//                     ${Object.entries(themes).map(([key, theme]) => `
//                         <option value="${key}">${theme.name}</option>
//                     `).join('')}
//                 </select>
//             </div>
            
//             <div style="margin-bottom: 15px;">
//                 <label style="display: block; margin-bottom: 8px; font-weight: bold;">Font:</label>
//                 <select id="fontSelect" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
//                     ${fontOptions.map(font => `
//                         <option value="${font.value}">${font.name}</option>
//                     `).join('')}
//                 </select>
//             </div>
            
//             <button id="applyTheme" style="width: 100%; padding: 10px; background: var(--primary-green); 
//                     color: white; border: none; border-radius: 5px; margin-bottom: 5px;">
//                 Apply Theme
//             </button>
//             <button id="closeCustomizer" style="width: 100%; padding: 10px; background: #666; 
//                     color: white; border: none; border-radius: 5px;">
//                 Close
//             </button>
//         `;
        
//         return customizer;
//     }

//     // Create theme toggle button
//     const themeToggle = document.createElement('button');
//     themeToggle.id = 'themeToggle';
//     themeToggle.innerHTML = '🎨 Themes';
//     themeToggle.style.cssText = `
//         background: var(--primary-green);
//         color: white;
//         border: none;
//         padding: 8px 16px;
//         border-radius: 20px;
//         cursor: pointer;
//         font-size: 14px;
//         margin-left: 10px;
//     `;

//     // Overlay for modal
//     const overlay = document.createElement('div');
//     overlay.id = 'themeOverlay';
//     overlay.style.cssText = `
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background: rgba(0,0,0,0.5);
//         z-index: 9999;
//         display: none;
//     `;

//     // Apply theme function
//     function applyTheme(themeKey, fontValue) {
//         const theme = themes[themeKey];
//         const root = document.documentElement;
        
//         // Apply all colors
//         Object.entries(theme.colors).forEach(([property, value]) => {
//             root.style.setProperty(property, value);
//         });
        
//         // Apply font
//         if (fontValue) {
//             root.style.setProperty('--font-family-primary', fontValue);
//             root.style.setProperty('--font-family-heading', fontValue);
//         }
        
//         // Save to localStorage
//         localStorage.setItem('selectedTheme', themeKey);
//         localStorage.setItem('selectedFont', fontValue);
        
//         closeThemeCustomizer();
//     }

//     function openThemeCustomizer() {
//         // Load saved settings
//         const savedTheme = localStorage.getItem('selectedTheme') || 'eco-green';
//         const savedFont = localStorage.getItem('selectedFont') || fontOptions[0].value;
        
//         document.getElementById('themeSelect').value = savedTheme;
//         document.getElementById('fontSelect').value = savedFont;
        
//         document.getElementById('themeCustomizer').style.display = 'block';
//         document.getElementById('themeOverlay').style.display = 'block';
//     }

//     function closeThemeCustomizer() {
//         document.getElementById('themeCustomizer').style.display = 'none';
//         document.getElementById('themeOverlay').style.display = 'none';
//     }

//     // Initialize theme system
//     function initThemeSystem() {
//         const footer = document.querySelector('footer');
//         if (!footer) return;
        
//         // Create footer content wrapper
//         const footerContent = document.createElement('div');
//         footerContent.className = 'footer-content';
//         footerContent.style.cssText = `
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             gap: 10px;
//         `;
        
//         // Move existing content
//         while (footer.firstChild) {
//             footerContent.appendChild(footer.firstChild);
//         }
        
//         // Add theme toggle
//         footerContent.appendChild(themeToggle);
//         footer.appendChild(footerContent);
        
//         // Add customizer and overlay to body
//         document.body.appendChild(overlay);
//         document.body.appendChild(createThemeCustomizer());
        
//         // Event listeners
//         themeToggle.addEventListener('click', openThemeCustomizer);
//         overlay.addEventListener('click', closeThemeCustomizer);
//         document.getElementById('closeCustomizer').addEventListener('click', closeThemeCustomizer);
//         document.getElementById('applyTheme').addEventListener('click', () => {
//             const themeKey = document.getElementById('themeSelect').value;
//             const fontValue = document.getElementById('fontSelect').value;
//             applyTheme(themeKey, fontValue);
//         });
        
//         // Apply saved theme on load
//         const savedTheme = localStorage.getItem('selectedTheme') || 'eco-green';
//         const savedFont = localStorage.getItem('selectedFont') || fontOptions[0].value;
//         applyTheme(savedTheme, savedFont);
//     }

//     // Initialize when DOM is ready
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', initThemeSystem);
//     } else {
//         initThemeSystem();
//     }

// })();
