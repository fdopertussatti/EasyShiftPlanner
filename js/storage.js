const Storage = {
    // Chaves para o localStorage
    keys: {
        schedules: 'easyshift_schedules',
        settings: 'easyshift_settings',
        company: 'easyshift_company'
    },

    // Salvar dados
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Carregar dados
    load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    // Salvar escala
    saveSchedule(date, schedules) {
        const allSchedules = this.load(this.keys.schedules) || {};
        allSchedules[date] = schedules;
        this.save(this.keys.schedules, allSchedules);
    },

    // Carregar escala
    getSchedule(date) {
        const allSchedules = this.load(this.keys.schedules) || {};
        return allSchedules[date] || [];
    },

    // Salvar configurações
    saveSettings(settings) {
        this.save(this.keys.settings, settings);
    },

    // Carregar configurações
    getSettings() {
        return this.load(this.keys.settings) || {
            theme: 'light',
            fontSize: 'normal',
            language: 'pt'
        };
    },

    // Salvar informações da empresa
    saveCompany(data) {
        this.save(this.keys.company, data);
    },

    // Carregar informações da empresa
    getCompany() {
        return this.load(this.keys.company) || {
            name: '',
            address: ''
        };
    }
}; 