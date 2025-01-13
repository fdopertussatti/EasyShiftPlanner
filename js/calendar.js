class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        this.init();
    }

    init() {
        this.setupWeekDays();
        this.renderCalendar();
        this.attachEventListeners();
    }

    setupWeekDays() {
        const weekdaysContainer = document.querySelector('.weekdays');
        weekdaysContainer.innerHTML = this.weekDays
            .map(day => `<div class="weekday">${day}</div>`)
            .join('');
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Atualizar cabeçalho do mês
        const monthName = new Date(year, month).toLocaleDateString('pt-BR', { 
            month: 'long', 
            year: 'numeric' 
        });
        document.getElementById('currentMonth').textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);

        // Calcular dias do mês
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        // Limpar dias existentes
        const daysContainer = document.getElementById('days');
        daysContainer.innerHTML = '';

        // Adicionar células vazias para os dias antes do primeiro dia do mês
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            daysContainer.appendChild(emptyDay);
        }

        // Adicionar dias do mês
        for (let day = 1; day <= totalDays; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayElement.dataset.date = dateStr;

            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;

            const scheduleContainer = document.createElement('div');
            scheduleContainer.className = 'schedule-container';

            // Carregar escalas existentes
            const schedules = Storage.getSchedule(dateStr);
            if (schedules.length > 0) {
                scheduleContainer.innerHTML = this.formatSchedules(schedules);
            }

            dayElement.appendChild(dayNumber);
            dayElement.appendChild(scheduleContainer);
            daysContainer.appendChild(dayElement);
        }
    }

    formatSchedules(schedules) {
        return schedules.map(schedule => `
            <div class="schedule-item">
                <div class="schedule-time">
                    ${schedule.startTime} ${schedule.startPeriod} - ${schedule.endTime} ${schedule.endPeriod}
                </div>
                <div class="schedule-employee">${schedule.employee}</div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        // Navegação entre meses
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // Clique nos dias
        document.getElementById('days').addEventListener('click', (e) => {
            const dayElement = e.target.closest('.day');
            if (dayElement && !dayElement.classList.contains('empty')) {
                this.selectedDate = dayElement.dataset.date;
                Schedule.openModal(this.selectedDate);
            }
        });
    }
} 