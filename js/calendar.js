class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.weekDays = ['Sun', 'Mon', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
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

function generatePrintView() {
    const calendarData = getCalendarData();
    const printContainer = document.createElement('div');
    printContainer.className = 'print-calendar';

    const daysOfWeek = I18n.translate('daysOfWeek');
    const months = I18n.translate('months');
    const currentDate = new Date();
    const monthName = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    let html = `<div class="print-header">
                    <span class="company-name">${document.getElementById('companyName').value}</span>
                    <span class="month-year">${monthName} ${year}</span>
                    <span class="print-date">${I18n.translate('printDate')}: ${new Date().toLocaleDateString()}</span>
                </div>
                <table class="print-calendar-table"><thead><tr>`;

    daysOfWeek.forEach(day => {
        html += `<th>${day}</th>`;
    });

    html += '</tr></thead><tbody>';

    // Inicializa uma linha vazia para cada semana
    let weekRow = new Array(7).fill('<td></td>');

    calendarData.forEach((dayData, index) => {
        const date = new Date(dayData.date + 'T00:00:00'); // Assegura que a data é interpretada corretamente
        const dayOfWeek = date.getDay(); // Obtém o índice do dia da semana (0 = Domingo, 6 = Sábado)

        // Adiciona os registros na coluna correta
        if (!weekRow[dayOfWeek].includes('<ul>')) {
            weekRow[dayOfWeek] = `<td><strong>${dayData.date}</strong><ul>`;
        }
        dayData.entries.forEach(entry => {
            weekRow[dayOfWeek] += `<li>${entry.employee}: ${entry.startTime} - ${entry.endTime}</li>`;
        });
        weekRow[dayOfWeek] += '</ul></td>';

        // Se for sábado (último dia da semana), fecha a linha e inicia uma nova
        if (dayOfWeek === 6 || index === calendarData.length - 1) {
            html += `<tr>${weekRow.join('')}</tr>`;
            weekRow = new Array(7).fill('<td></td>'); // Reseta a linha para a próxima semana
        }
    });

    html += '</tbody></table>';
    printContainer.innerHTML = html;

    document.body.appendChild(printContainer);
}

function getCalendarData() {
    const calendarData = [];
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Ajuste para obter o primeiro dia do mês
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // Dia da semana do primeiro dia do mês

    // Logs para depuração
    console.log(`Primeiro dia do mês: ${firstDayOfMonth.toDateString()}`);
    console.log(`Dia da semana do primeiro dia do mês: ${firstDayOfWeek}`);

    for (let day = 1; day <= 30; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const entries = Storage.getSchedule(dateStr);

        calendarData.push({
            date: dateStr,
            entries: entries.map(entry => ({
                employee: entry.employee,
                startTime: `${entry.startTime} ${entry.startPeriod}`,
                endTime: `${entry.endTime} ${entry.endPeriod}`
            }))
        });
    }

    return calendarData;
} 