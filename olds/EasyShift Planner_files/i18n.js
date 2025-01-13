class I18n {
    constructor() {
        this.currentLanguage = 'en';
        this.init();
    }

    init() {
        this.setLanguage(this.currentLanguage);
        this.updateSelectValue();
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Atualizar direção do texto para suporte RTL
        document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
        
        this.updateTranslations();
    }

    updateSelectValue() {
        const select = document.getElementById('languageSelect');
        if (select) {
            select.value = this.currentLanguage;
        }
    }

    updateTranslations() {
        const t = translations[this.currentLanguage];
        
        // Atualizar título
        document.querySelector('.main-title').textContent = t.title;
        
        // Atualizar placeholders
        document.getElementById('workplaceName').placeholder = t.companyName;
        document.getElementById('workplaceAddress').placeholder = t.address;
        
        // Atualizar dias da semana
        const weekdays = document.querySelectorAll('.weekdays div');
        const days = [t.days.sun, t.days.mon, t.days.tue, t.days.wed, t.days.thu, t.days.fri, t.days.sat];
        weekdays.forEach((day, index) => {
            day.textContent = days[index];
        });
        
        // Atualizar botões
        document.getElementById('printBtn').title = t.print;
        document.getElementById('shareBtn').title = t.share;
        
        // Atualizar outros elementos conforme necessário
    }

    t(key) {
        const keys = key.split('.');
        let value = translations[this.currentLanguage];
        
        for (const k of keys) {
            value = value[k];
            if (!value) return key;
        }
        
        return value;
    }
}

// Inicializar i18n
const i18n = new I18n();

// Função global para mudar idioma
function changeLanguage(lang) {
    i18n.setLanguage(lang);
} 