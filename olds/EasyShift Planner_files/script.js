// Configuração do Google API
const CLIENT_ID = 'SEU_CLIENT_ID';
const API_KEY = 'SUA_API_KEY';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// Definição dos meses em inglês
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

let currentDate = new Date();
let scheduleData = {};
let locationInfo = {
    name: 'Company Name',
    address: 'Company Address'
};

// Adicionar dados de exemplo
const sampleEmployees = [
    "John Smith", "Emma Wilson", "Michael Chen", "Sarah Davis",
    "Carlos Rodriguez", "Anna Kowalski", "David Kim", "Maria Garcia",
    "James Johnson", "Lisa Anderson", "Thomas Brown", "Sophie Martin"
];

const sampleShifts = {
    MORNING: { time: "07:00", color: "#FFD700" },
    AFTERNOON: { time: "14:00", color: "#87CEEB" },
    NIGHT: { time: "22:00", color: "#4B0082" },
    EXTRA: { time: "10:00", color: "#98FB98" }
};

// Adicionar no início do arquivo
const SHIFT_TYPES = {
    MORNING: { name: 'Manhã', color: '#FFD700' },
    AFTERNOON: { name: 'Tarde', color: '#87CEEB' },
    NIGHT: { name: 'Noite', color: '#4B0082' },
    EXTRA: { name: 'Extra', color: '#98FB98' }
};

const notificationManager = new NotificationManager();

// Adicionar variável global
const i18n = window.i18n;

// Adicionar função de mudança de idioma
function changeLanguage(locale) {
    i18n.setLocale(locale);
    updateInterface();
}

function updateInterface() {
    // Atualizar título
    document.querySelector('h1').textContent = i18n.t('title');
    
    // Atualizar botões
    document.getElementById('printBtn').textContent = i18n.t('buttons.print');
    document.getElementById('shareBtn').textContent = i18n.t('buttons.share');
    
    // Atualizar dias da semana
    const weekdays = document.querySelectorAll('.weekdays div');
    weekdays.forEach((day, index) => {
        day.textContent = i18n.t('weekDays')[index];
    });
    
    // Atualizar modal
    document.querySelector('.modal h3').textContent = i18n.t('modal.title');
    document.querySelector('.employee-input').placeholder = i18n.t('modal.employee');
    
    // Atualizar botões de exportação
    document.querySelectorAll('.export-actions button').forEach(btn => {
        const format = btn.getAttribute('data-format');
        btn.textContent = i18n.t(`buttons.export.${format}`);
    });
    
    // Atualizar opções de turno
    const shiftSelect = document.querySelector('.shift-type');
    Object.entries(i18n.t('shifts')).forEach(([value, text]) => {
        const option = shiftSelect.querySelector(`option[value="${value}"]`);
        if (option) option.textContent = text;
    });
    
    // Atualizar placeholders dos campos de localização
    document.getElementById('workplaceName').placeholder = i18n.t('location.name');
    document.getElementById('workplaceAddress').placeholder = i18n.t('location.address');
    
    renderCalendar();
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Gerar dados de exemplo iniciais
    generateSampleData();
    renderCalendar();
    initializeGoogleAPI();
    setupEventListeners();
    setupLocationInfo();
    document.body.classList.add('layout-modern');
});

function initializeGoogleAPI() {
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        });
    });
}

function setupEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    document.getElementById('printBtn').addEventListener('click', () => {
        window.print();
    });

    document.getElementById('shareBtn').addEventListener('click', shareCalendar);
}

function generateSampleData() {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Limpar dados existentes
    scheduleData = {};
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = new Date(currentYear, currentMonth - 1, day).getDay();
        if (dayOfWeek === 0) continue;

        const dateKey = `${currentYear}-${currentDate.getMonth() + 1}-${day}`;
        const numShifts = Math.floor(Math.random() * 3) + 2;
        const shifts = [];

        const usedEmployees = new Set();
        // Gerar apenas um tipo de turno por funcionário
        for (let i = 0; i < numShifts; i++) {
            const shiftTypes = Object.entries(sampleShifts);
            const [shiftType, shiftInfo] = shiftTypes[i % shiftTypes.length];
            let employee;
            do {
                employee = sampleEmployees[Math.floor(Math.random() * sampleEmployees.length)];
            } while (usedEmployees.has(employee));
            usedEmployees.add(employee);

            shifts.push({
                time: shiftInfo.time,
                employee: employee,
                shiftType: shiftType,
                backgroundColor: shiftInfo.color
            });
        }

        scheduleData[dateKey] = shifts;
    }

    // Forçar renderização do calendário após gerar dados
    renderCalendar();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Gerar dados de exemplo se não houver dados
    if (Object.keys(scheduleData).length === 0) {
        generateSampleData();
    }
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    document.getElementById('currentMonth').textContent = `${months[month]} ${year}`;
    
    const daysContainer = document.getElementById('days');
    daysContainer.innerHTML = '';
    
    // Preencher dias do mês anterior
    for (let i = 0; i < firstDay.getDay(); i++) {
        daysContainer.appendChild(createDayElement(null));
    }
    
    // Preencher dias do mês atual
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = createDayElement(day);
        const dateKey = `${year}-${month + 1}-${day}`;
        if (scheduleData[dateKey]) {
            renderScheduleForDay(dateKey, dayElement.querySelector('.schedule-list'));
        }
        daysContainer.appendChild(dayElement);
    }
}

function createDayElement(day) {
    const div = document.createElement('div');
    div.className = 'day';
    
    if (day) {
        // Criar exemplo estático de escalas
        const sampleSchedules = `
            <div class="schedule-list space-y-2 mt-2">
                <div class="schedule-item" style="border-left: 4px solid #FFD700">
                    <div class="time">07:00</div>
                    <div class="employee">John Smith</div>
                    <div class="shift-type text-xs opacity-75">Morning</div>
                </div>
                <div class="schedule-item" style="border-left: 4px solid #87CEEB">
                    <div class="time">14:00</div>
                    <div class="employee">Emma Wilson</div>
                    <div class="shift-type text-xs opacity-75">Afternoon</div>
                </div>
                <div class="schedule-item" style="border-left: 4px solid #4B0082">
                    <div class="time">22:00</div>
                    <div class="employee">Michael Chen</div>
                    <div class="shift-type text-xs opacity-75">Night</div>
                </div>
            </div>
        `;

        div.innerHTML = `
            <span class="day-number">${day}</span>
            ${day % 7 !== 0 ? sampleSchedules : '<div class="schedule-list"></div>'}
        `;
        
        div.addEventListener('click', () => openScheduleModal(day));
    }
    
    return div;
}

function openScheduleModal(day) {
    const modal = document.getElementById('scheduleModal');
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    
    document.getElementById('selectedDate').textContent = 
        `${day}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    
    // Limpar entradas anteriores
    const form = document.querySelector('.schedule-form');
    form.innerHTML = `
        <div class="schedule-entry">
            <input type="time" class="time-input">
            <input type="text" placeholder="Nome do funcionário" class="employee-input">
            <button class="remove-entry">-</button>
        </div>
        <button id="addEntry">+ Adicionar funcionário</button>
        <button id="saveSchedule">Salvar</button>
    `;
    
    // Carregar dados existentes
    if (scheduleData[dateKey]) {
        scheduleData[dateKey].forEach((schedule, index) => {
            if (index > 0) addScheduleEntry();
            const entries = document.querySelectorAll('.schedule-entry');
            const lastEntry = entries[entries.length - 1];
            lastEntry.querySelector('.time-input').value = schedule.time;
            lastEntry.querySelector('.employee-input').value = schedule.employee;
        });
    }
    
    modal.style.display = 'block';
    
    // Event listeners
    document.querySelector('.close').onclick = () => modal.style.display = 'none';
    document.getElementById('addEntry').onclick = addScheduleEntry;
    document.getElementById('saveSchedule').onclick = () => saveSchedule(dateKey, day);
}

function addScheduleEntry() {
    const entry = document.createElement('div');
    entry.className = 'schedule-entry';
    entry.innerHTML = `
        <input type="time" class="time-input">
        <input type="text" placeholder="Nome do funcionário" class="employee-input">
        <button class="remove-entry">-</button>
    `;
    
    const form = document.querySelector('.schedule-form');
    form.insertBefore(entry, document.getElementById('addEntry'));
    
    entry.querySelector('.remove-entry').onclick = () => entry.remove();
}

function saveSchedule(dateKey, day) {
    const entries = document.querySelectorAll('.schedule-entry');
    const schedules = Array.from(entries).map(entry => ({
        time: entry.querySelector('.time-input').value,
        employee: entry.querySelector('.employee-input').value,
        shiftType: entry.querySelector('.shift-type').value,
        backgroundColor: SHIFT_TYPES[entry.querySelector('.shift-type').value].color
    })).filter(schedule => schedule.time && schedule.employee);
    
    scheduleData[dateKey] = schedules;
    
    // Atualizar visualização
    const scheduleList = document.getElementById(`schedule-${day}`);
    renderScheduleForDay(dateKey, scheduleList);
    
    // Enviar notificações
    notificationManager.sendBulkNotifications(schedules);
    
    // Salvar no Google Drive
    saveToGoogleDrive();
    
    document.getElementById('scheduleModal').style.display = 'none';
}

function renderScheduleForDay(dateKey, container) {
    if (!scheduleData[dateKey]) return;
    
    container.innerHTML = scheduleData[dateKey]
        .map(schedule => `
            <div class="schedule-item" style="border-left: 4px solid ${schedule.backgroundColor}">
                <div class="time">${schedule.time}</div>
                <div class="employee">${schedule.employee}</div>
                <div class="shift-type text-xs opacity-75">
                    ${schedule.shiftType.charAt(0) + schedule.shiftType.slice(1).toLowerCase()}
                </div>
            </div>
        `).join('');
    
    // Adicionar classes para melhor visualização
    container.classList.add('schedule-list', 'space-y-2', 'mt-2');
}

async function saveToGoogleDrive() {
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        await gapi.auth2.getAuthInstance().signIn();
    }
    
    const fileContent = JSON.stringify({
        scheduleData,
        locationInfo
    });
    
    const file = new Blob([fileContent], {type: 'application/json'});
    
    const metadata = {
        name: 'schedule_data.json',
        mimeType: 'application/json'
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
    form.append('file', file);
    
    try {
        await gapi.client.drive.files.create({
            resource: metadata,
            media: {
                mimeType: 'application/json',
                body: fileContent
            }
        });
    } catch (error) {
        console.error('Erro ao salvar no Google Drive:', error);
    }
}

function shareCalendar() {
    if (navigator.share) {
        navigator.share({
            title: 'EasyShift Planner',
            text: 'Check your shift schedule',
            url: window.location.href
        });
    } else {
        const shareUrl = window.location.href;
        const emailSubject = 'EasyShift Planner Schedule';
        const emailBody = `Check your shift schedule on EasyShift Planner: ${shareUrl}`;
        
        window.open(`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`);
    }
}

async function exportSchedule(format) {
    const exporters = {
        pdf: exportToPDF,
        excel: exportToExcel,
        csv: exportToCSV
    };

    if (exporters[format]) {
        await exporters[format](scheduleData);
    }
}

function exportToPDF(data) {
    const doc = new jsPDF();
    // Implementar lógica de exportação para PDF
    doc.save('schedule.pdf');
}

function exportToExcel(data) {
    const ws = XLSX.utils.json_to_sheet(flattenScheduleData(data));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schedule");
    XLSX.writeFile(wb, 'schedule.xlsx');
}

function exportToCSV(data) {
    const csv = Papa.unparse(flattenScheduleData(data));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'schedule.csv';
    link.click();
}

function flattenScheduleData(data) {
    return Object.entries(data).flatMap(([date, schedules]) =>
        schedules.map(schedule => ({
            date,
            ...schedule
        }))
    );
}

// Adicionar observer para mudanças de idioma
i18n.addObserver(() => {
    updateInterface();
});

function setupLocationInfo() {
    const nameInput = document.getElementById('workplaceName');
    const addressInput = document.getElementById('workplaceAddress');
    const addressDisplay = document.querySelector('.address-display');

    // Carregar dados salvos
    const savedInfo = localStorage.getItem('locationInfo');
    if (savedInfo) {
        locationInfo = JSON.parse(savedInfo);
        nameInput.value = locationInfo.name;
        addressInput.value = locationInfo.address;
    }

    // Atualizar display do endereço
    updateAddressDisplay();

    // Adicionar event listeners
    nameInput.addEventListener('input', () => {
        locationInfo.name = nameInput.value;
        saveLocationInfo();
        updateAddressDisplay();
    });

    addressInput.addEventListener('input', () => {
        locationInfo.address = addressInput.value;
        saveLocationInfo();
        updateAddressDisplay();
    });
}

function saveLocationInfo() {
    localStorage.setItem('locationInfo', JSON.stringify(locationInfo));
}

function updateAddressDisplay() {
    const addressDisplay = document.querySelector('.address-display');
    addressDisplay.innerHTML = `
        <strong>${locationInfo.name}</strong><br>
        ${locationInfo.address}
    `;
}

function updateMonthDisplay() {
    const currentMonthElement = document.getElementById('currentMonth');
    currentMonthElement.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
} 