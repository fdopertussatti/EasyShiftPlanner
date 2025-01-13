class UI {
    static init() {
        this.initializeMDC();
        this.loadSettings();
        this.setupThemeToggle();
        this.setupFontSizeControls();
        this.setupLanguageSelector();
        this.setupCompanyInfo();
    }

    static initializeMDC() {
        // Inicializar todos os botões
        const buttons = document.querySelectorAll('.mdc-button');
        buttons.forEach(button => new mdc.ripple.MDCRipple(button));

        // Inicializar campos de texto
        const textFields = document.querySelectorAll('.mdc-text-field');
        textFields.forEach(textField => new mdc.textField.MDCTextField(textField));

        // Inicializar selects
        const selects = document.querySelectorAll('.mdc-select');
        selects.forEach(select => {
            const mdcSelect = new mdc.select.MDCSelect(select);
            // Guardar referência para uso posterior
            if (select.classList.contains('language-select')) {
                this.languageSelect = mdcSelect;
            }
        });

        // Inicializar ripple em ícones
        const iconButtons = document.querySelectorAll('.mdc-icon-button');
        iconButtons.forEach(icon => new mdc.ripple.MDCRipple(icon));
    }

    static loadSettings() {
        const settings = Storage.getSettings();
        document.documentElement.setAttribute('data-theme', settings.theme);
        document.body.style.fontSize = settings.fontSize;
        
        // Atualizar select de idioma
        if (this.languageSelect) {
            this.languageSelect.value = settings.language;
        }
    }

    static setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            Storage.saveSettings({
                ...Storage.getSettings(),
                theme: newTheme
            });
        });
    }

    static setupFontSizeControls() {
        const baseFontSize = 16; // px
        let currentSize = baseFontSize;

        document.getElementById('decreaseFont').onclick = () => {
            if (currentSize > 12) {
                currentSize -= 2;
                this.updateFontSize(currentSize);
            }
        };

        document.getElementById('resetFont').onclick = () => {
            currentSize = baseFontSize;
            this.updateFontSize(currentSize);
        };

        document.getElementById('increaseFont').onclick = () => {
            if (currentSize < 24) {
                currentSize += 2;
                this.updateFontSize(currentSize);
            }
        };
    }

    static updateFontSize(size) {
        document.body.style.fontSize = `${size}px`;
        Storage.saveSettings({
            ...Storage.getSettings(),
            fontSize: `${size}px`
        });
    }

    static setupLanguageSelector() {
        if (this.languageSelect) {
            this.languageSelect.listen('MDCSelect:change', () => {
                Storage.saveSettings({
                    ...Storage.getSettings(),
                    language: this.languageSelect.value
                });
                // TODO: Implementar mudança de idioma
            });
        }
    }

    static setupCompanyInfo() {
        const companyName = document.getElementById('companyName');
        const company = Storage.getCompany();
        
        companyName.value = company.name;
        
        companyName.addEventListener('change', (e) => {
            Storage.saveCompany({
                ...Storage.getCompany(),
                name: e.target.value
            });
        });
    }
} 