class AccessibilityManager {
    constructor() {
        this.currentFontSize = 'md';
        this.currentLayout = 'modern';
        this.isDarkMode = false;
        this.setupEventListeners();
        this.loadPreferences();
    }

    setupEventListeners() {
        // Controles de fonte
        document.querySelector('.decrease-font').onclick = () => this.changeFontSize('decrease');
        document.querySelector('.reset-font').onclick = () => this.changeFontSize('reset');
        document.querySelector('.increase-font').onclick = () => this.changeFontSize('increase');

        // Controle de tema
        document.getElementById('themeToggle').onclick = () => this.toggleTheme();

        // Controle de layout
        document.getElementById('layoutStyle').onchange = (e) => this.changeLayout(e.target.value);
    }

    loadPreferences() {
        const preferences = JSON.parse(localStorage.getItem('accessibility') || '{}');
        
        if (preferences.fontSize) this.setFontSize(preferences.fontSize);
        if (preferences.layout) this.changeLayout(preferences.layout);
        if (preferences.darkMode) this.setTheme(preferences.darkMode);
    }

    savePreferences() {
        const preferences = {
            fontSize: this.currentFontSize,
            layout: this.currentLayout,
            darkMode: this.isDarkMode
        };
        localStorage.setItem('accessibility', JSON.stringify(preferences));
    }

    changeFontSize(action) {
        const sizes = ['sm', 'md', 'lg', 'xl'];
        let currentIndex = sizes.indexOf(this.currentFontSize);

        if (action === 'increase' && currentIndex < sizes.length - 1) {
            currentIndex++;
        } else if (action === 'decrease' && currentIndex > 0) {
            currentIndex--;
        } else if (action === 'reset') {
            currentIndex = 1; // 'md'
        }

        this.setFontSize(sizes[currentIndex]);
    }

    setFontSize(size) {
        document.body.classList.remove(`font-size-${this.currentFontSize}`);
        this.currentFontSize = size;
        document.body.classList.add(`font-size-${size}`);
        this.savePreferences();
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.setTheme(this.isDarkMode);
    }

    setTheme(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        this.isDarkMode = isDark;
        this.savePreferences();
    }

    changeLayout(layout) {
        document.body.classList.remove(`layout-${this.currentLayout}`);
        this.currentLayout = layout;
        document.body.classList.add(`layout-${layout}`);
        this.savePreferences();
    }
}

// Inicializar gerenciador de acessibilidade
const accessibilityManager = new AccessibilityManager(); 