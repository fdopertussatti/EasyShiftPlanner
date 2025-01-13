class TimePicker {
    constructor() {
        this.currentHour = '00';
        this.currentMinute = '00';
        this.isAM = true;
        this.isHourView = true;
        this.selectedInput = null;
    }

    static init() {
        if (!document.getElementById('md-time-picker')) {
            this.createTimePickerElement();
        }
        this.instance = new TimePicker();
        this.setupEventListeners();
    }

    static createTimePickerElement() {
        const template = `
            <div id="md-time-picker" class="md-time-picker">
                <div class="md-time-picker__container">
                    <div class="md-time-picker__header">
                        <div class="md-time-picker__time">
                            <span class="md-time-picker__hour active">12</span>
                            <span class="md-time-picker__separator">:</span>
                            <span class="md-time-picker__minute">00</span>
                        </div>
                        <div class="md-time-picker__period">
                            <button class="md-time-picker__period-btn active" data-period="AM">AM</button>
                            <button class="md-time-picker__period-btn" data-period="PM">PM</button>
                        </div>
                    </div>
                    <div class="md-time-picker__clock">
                        <div class="md-time-picker__clock-face">
                            <div class="md-time-picker__clock-hand"></div>
                            ${this.createClockNumbers()}
                        </div>
                    </div>
                    <div class="md-time-picker__actions">
                        <button class="mdc-button" data-action="cancel">
                            <span class="mdc-button__ripple"></span>
                            <span class="mdc-button__label">Cancelar</span>
                        </button>
                        <button class="mdc-button mdc-button--raised" data-action="ok">
                            <span class="mdc-button__ripple"></span>
                            <span class="mdc-button__label">OK</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', template);
    }

    static createClockNumbers() {
        const hours = Array.from({ length: 12 }, (_, i) => i + 1);
        const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
        
        const hoursHtml = hours.map(hour => `
            <span class="md-time-picker__number md-time-picker__hour-number" data-hour="${hour}" 
                  style="transform: rotate(${hour * 30}deg) translate(0, -120px) rotate(-${hour * 30}deg)">
                ${hour}
            </span>
        `).join('');

        const minutesHtml = minutes.map(minute => `
            <span class="md-time-picker__number md-time-picker__minute-number hidden" data-minute="${minute}"
                  style="transform: rotate(${minute * 6}deg) translate(0, -120px) rotate(-${minute * 6}deg)">
                ${minute.toString().padStart(2, '0')}
            </span>
        `).join('');

        return hoursHtml + minutesHtml;
    }

    static setupEventListeners() {
        const picker = document.getElementById('md-time-picker');
        const clockFace = picker.querySelector('.md-time-picker__clock-face');
        
        // Alternar entre horas e minutos
        picker.querySelector('.md-time-picker__hour').addEventListener('click', () => this.switchToHours());
        picker.querySelector('.md-time-picker__minute').addEventListener('click', () => this.switchToMinutes());

        // Alternar AM/PM
        picker.querySelectorAll('.md-time-picker__period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.togglePeriod(e.target));
        });

        // Eventos do relógio
        clockFace.addEventListener('mousedown', (e) => this.startClockSelection(e));
        clockFace.addEventListener('mousemove', (e) => this.updateClockSelection(e));
        document.addEventListener('mouseup', () => this.endClockSelection());

        // Botões de ação
        picker.querySelector('[data-action="cancel"]').addEventListener('click', () => this.hide());
        picker.querySelector('[data-action="ok"]').addEventListener('click', () => this.confirm());
    }

    // ... (continua)
} 