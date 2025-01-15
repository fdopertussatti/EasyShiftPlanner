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
    saveSchedule(date, schedule) {
        const schedules = JSON.parse(localStorage.getItem(this.keys.schedules)) || {};
        schedules[date] = schedule.map(entry => ({
            ...entry,
            date
        }));
        localStorage.setItem(this.keys.schedules, JSON.stringify(schedules));
    },

    // Carregar escala
    getSchedule(date) {
        const schedules = JSON.parse(localStorage.getItem(this.keys.schedules)) || {};
        return schedules[date] || [];
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
    },

    getAllSchedules() {
        const schedules = localStorage.getItem('schedules');
        return schedules ? JSON.parse(schedules) : {};
    },

    deleteSchedule(date) {
        const allSchedules = this.getAllSchedules();
        delete allSchedules[date];
        localStorage.setItem('schedules', JSON.stringify(allSchedules));
    },

    // Adicionar dados de exemplo
    addExampleData() {
        const names = [
            'John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'Chris Brown',
            'Jessica Wilson', 'David Martinez', 'Sarah Lee', 'James Anderson', 'Laura Thomas'
        ];

        const exampleData = [];

        for (let day = 1; day <= 31; day++) {
            const dateStr = `2025-01-${String(day).padStart(2, '0')}`;
            const numEntries = Math.floor(Math.random() * 3) + 5; // Entre 5 e 7 registros

            for (let i = 0; i < numEntries; i++) {
                const name = names[Math.floor(Math.random() * names.length)];
                const startHour = Math.floor(Math.random() * 8) + 8; // Entre 8 e 15
                const endHour = startHour + 8; // Turno de 8 horas

                exampleData.push({
                    date: dateStr,
                    employee: name,
                    startTime: `${String(startHour).padStart(2, '0')}:00`,
                    startPeriod: startHour < 12 ? 'AM' : 'PM',
                    endTime: `${String(endHour % 12 || 12).padStart(2, '0')}:00`,
                    endPeriod: endHour < 24 ? 'PM' : 'AM'
                });
            }
        }

        exampleData.forEach(entry => {
            const schedules = this.getSchedule(entry.date);
            schedules.push(entry);
            this.saveSchedule(entry.date, schedules);
        });

        alert('Dados de exemplo adicionados com sucesso!');
    }
}; 