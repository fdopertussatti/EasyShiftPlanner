class Schedule {
    static dialog = null;
    static selectedDate = null;
    static messages = new Set();

    static init() {
        const dialogElement = document.querySelector('.mdc-dialog');
        this.dialog = new mdc.dialog.MDCDialog(dialogElement);
        this.setupEventListeners();
    }

    static setupEventListeners() {
        document.getElementById('addEntry').addEventListener('click', () => this.addEntry());
        document.getElementById('saveSchedule').addEventListener('click', () => this.saveSchedules());
        this.dialog.listen('MDCDialog:closed', () => {
            this.selectedDate = null;
            document.querySelector('.schedule-entries').innerHTML = '';
        });
    }

    static createTimeField(label, timeValue = '', periodValue = 'AM', timeClass, periodClass) {
        const field = document.createElement('div');
        field.className = 'time-field';

        const fieldLabel = document.createElement('span');
        fieldLabel.className = 'time-field-label';
        fieldLabel.textContent = label;

        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'time-field-group';

        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.className = `time-input ${timeClass}`;
        timeInput.value = timeValue;
        timeInput.required = true;
        
        timeInput.setAttribute('aria-label', `${label} - Formato 24 horas`);
        timeInput.setAttribute('pattern', '[0-9]{2}:[0-9]{2}');
        timeInput.setAttribute('placeholder', '--:--');

        const periodSelect = document.createElement('select');
        periodSelect.className = `period-select ${periodClass}`;
        ['AM', 'PM'].forEach(period => {
            const option = document.createElement('option');
            option.value = period;
            option.textContent = period;
            option.selected = period === periodValue;
            periodSelect.appendChild(option);
        });

        // Função para validar os horários
        const validateTimes = (entry) => {
            const startTime = entry.querySelector('.start-time').value;
            const startPeriod = entry.querySelector('.start-period').value;
            const endTime = entry.querySelector('.end-time').value;
            const endPeriod = entry.querySelector('.end-period').value;

            if (startTime && endTime) {
                const [startHour, startMinute] = startTime.split(':').map(Number);
                const [endHour, endMinute] = endTime.split(':').map(Number);

                let start24h = startHour;
                let end24h = endHour;

                // Converter para formato 24h
                if (startPeriod === 'PM' && startHour !== 12) start24h += 12;
                if (startPeriod === 'AM' && startHour === 12) start24h = 0;
                if (endPeriod === 'PM' && endHour !== 12) end24h += 12;
                if (endPeriod === 'AM' && endHour === 12) end24h = 0;

                const startTotal = start24h * 60 + startMinute;
                const endTotal = end24h * 60 + endMinute;

                if (endTotal <= startTotal) {
                    // Feedback visual de erro
                    entry.classList.add('schedule-entry--shake');
                    this.showFeedback('O horário final deve ser maior que o horário inicial', 'warning');
                    
                    // Remove a classe de animação
                    setTimeout(() => {
                        entry.classList.remove('schedule-entry--shake');
                    }, 400);

                    return false;
                }
            }
            return true;
        };

        // Adicionar eventos de validação
        const addTimeValidation = (input, select) => {
            const validateAndUpdate = () => {
                const entry = input.closest('.schedule-entry');
                if (entry) {
                    validateTimes(entry);
                }
            };

            input.addEventListener('change', validateAndUpdate);
            input.addEventListener('blur', validateAndUpdate);
            select.addEventListener('change', validateAndUpdate);
        };

        // Aplicar validação após montar o campo
        fieldGroup.appendChild(timeInput);
        fieldGroup.appendChild(periodSelect);
        field.appendChild(fieldLabel);
        field.appendChild(fieldGroup);

        // Adiciona a validação após um pequeno delay para garantir que os elementos estejam no DOM
        setTimeout(() => {
            addTimeValidation(timeInput, periodSelect);
        }, 0);

        return field;
    }

    static createEmployeeField(value = '') {
        const field = document.createElement('div');
        field.className = 'employee-field';

        const fieldLabel = document.createElement('span');
        fieldLabel.className = 'time-field-label';
        fieldLabel.textContent = 'Funcionário';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'employee-input';
        input.placeholder = 'Nome do funcionário';
        input.value = value;
        input.required = true;

        field.appendChild(fieldLabel);
        field.appendChild(input);

        return field;
    }

    static addEntry(data = null) {
        const entry = document.createElement('div');
        entry.className = 'schedule-entry';

        // Campo de início
        const startField = this.createTimeField(
            'Início',
            data?.startTime || '',
            data?.startPeriod || 'AM',
            'start-time',
            'start-period'
        );

        // Campo de fim
        const endField = this.createTimeField(
            'Fim',
            data?.endTime || '',
            data?.endPeriod || 'PM',
            'end-time',
            'end-period'
        );

        // Campo de funcionário
        const employeeField = this.createEmployeeField(data?.employee || '');

        // Botão remover com validação
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-entry';
        removeButton.innerHTML = '<span class="material-icons">remove_circle</span>';
        removeButton.title = 'Remover entrada';
        
        // Nova lógica para o botão remover
        removeButton.onclick = () => {
            const entries = document.querySelectorAll('.schedule-entry');
            if (entries.length === 1) {
                // Limpa os campos
                entry.querySelector('.start-time').value = '';
                entry.querySelector('.start-period').value = 'AM';
                entry.querySelector('.end-time').value = '';
                entry.querySelector('.end-period').value = 'PM';
                entry.querySelector('.employee-input').value = '';
                
                // Feedback visual
                entry.classList.add('schedule-entry--shake');
                this.showIconFeedback(entry, 'warning');
                this.showStatusBadge(entry, 'Campos limpos');
                this.addRippleEffect(entry, 'error');
                
                // Remove classes de animação
                setTimeout(() => {
                    entry.classList.remove('schedule-entry--shake');
                }, 400);
            } else {
                entry.classList.add('schedule-entry--highlight');
                setTimeout(() => entry.remove(), 300);
            }
        };

        entry.appendChild(startField);
        entry.appendChild(endField);
        entry.appendChild(employeeField);
        entry.appendChild(removeButton);

        document.querySelector('.schedule-entries').appendChild(entry);
    }

    static openModal(date) {
        this.selectedDate = date;
        const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        document.getElementById('selectedDate').textContent = formattedDate;
        document.querySelector('.schedule-entries').innerHTML = '';

        const schedules = Storage.getSchedule(date);
        if (schedules.length > 0) {
            schedules.forEach(schedule => this.addEntry(schedule));
        } else {
            this.addEntry();
        }

        this.dialog.open();
    }

    static saveSchedules() {
        const entries = document.querySelectorAll('.schedule-entry');
        let isValid = true;

        entries.forEach(entry => {
            if (!this.validateTimes(entry)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showFeedback('Por favor, corrija os horários inválidos antes de salvar.', 'warning');
            return;
        }

        const schedules = Array.from(entries).map(entry => ({
            startTime: entry.querySelector('.start-time').value,
            startPeriod: entry.querySelector('.start-period').value,
            endTime: entry.querySelector('.end-time').value,
            endPeriod: entry.querySelector('.end-period').value,
            employee: entry.querySelector('.employee-input').value
        })).filter(schedule => schedule.startTime && schedule.endTime && schedule.employee);

        if (schedules.length > 0) {
            Storage.saveSchedule(this.selectedDate, schedules);
            calendar.renderCalendar();
            this.dialog.close();
            // Feedback de sucesso após salvar
            const messageArea = document.createElement('div');
            messageArea.className = 'feedback-messages';
            document.querySelector('.container').appendChild(messageArea);
            
            const successMessage = document.createElement('div');
            successMessage.className = 'feedback-message feedback-message--info';
            successMessage.innerHTML = `
                <span class="material-icons feedback-message__icon">check_circle</span>
                <span class="feedback-message__content">Escala salva com sucesso!</span>
                <button class="feedback-message__close material-icons">close</button>
            `;
            
            messageArea.appendChild(successMessage);
            
            // Auto-remove após 3 segundos
            setTimeout(() => {
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(-10px)';
                setTimeout(() => messageArea.remove(), 300);
            }, 3000);
            
            // Adiciona evento para fechar manualmente
            successMessage.querySelector('.feedback-message__close').onclick = () => {
                messageArea.remove();
            };
        } else {
            this.showFeedback('Por favor, preencha pelo menos uma escala válida.', 'warning');
        }
    }

    static showIconFeedback(entry, type = 'warning') {
        const feedback = document.createElement('div');
        feedback.className = 'feedback-icon';
        
        const icons = {
            warning: 'warning',
            error: 'error',
            success: 'check_circle',
            info: 'info'
        };

        feedback.innerHTML = `
            <span class="material-icons feedback-icon__symbol">
                ${icons[type]}
            </span>
        `;

        entry.appendChild(feedback);
        
        // Remove após a animação
        setTimeout(() => feedback.remove(), 1500);
    }

    static addRippleEffect(element, color = 'error') {
        const ripple = document.createElement('div');
        ripple.className = `mdc-ripple mdc-ripple--${color}`;
        element.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.classList.add('mdc-ripple--active');
            setTimeout(() => ripple.remove(), 1000);
        });
    }

    static showStatusBadge(entry, message, type = 'warning') {
        const badge = document.createElement('div');
        badge.className = `status-badge status-badge--${type}`;
        badge.textContent = message;
        
        entry.appendChild(badge);
        
        setTimeout(() => {
            badge.classList.add('status-badge--hide');
            setTimeout(() => badge.remove(), 300);
        }, 2000);
    }

    static showFeedback(message, type = 'warning') {
        // Verifica se a mensagem já existe
        if (this.messages.has(message)) return;
        
        // Adiciona a mensagem ao conjunto
        this.messages.add(message);

        // Cria ou obtém a área de mensagens
        let messagesArea = document.querySelector('.feedback-messages');
        if (!messagesArea) {
            messagesArea = document.createElement('div');
            messagesArea.className = 'feedback-messages';
            const formContent = document.querySelector('.mdc-dialog__content');
            formContent.insertBefore(messagesArea, formContent.firstChild);
        }

        // Cria a mensagem
        const messageElement = document.createElement('div');
        messageElement.className = `feedback-message feedback-message--${type}`;
        messageElement.innerHTML = `
            <span class="material-icons feedback-message__icon">
                ${type === 'warning' ? 'warning' : 'info'}
            </span>
            <span class="feedback-message__content">${message}</span>
            <button class="feedback-message__close material-icons">close</button>
        `;

        // Adiciona evento para remover a mensagem
        messageElement.querySelector('.feedback-message__close').onclick = () => {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                messageElement.remove();
                this.messages.delete(message);
                
                // Remove a área de mensagens se estiver vazia
                if (messagesArea.children.length === 0) {
                    messagesArea.remove();
                }
            }, 300);
        };

        messagesArea.appendChild(messageElement);
    }

    static validateTimes(entry) {
        const startTime = entry.querySelector('.start-time').value;
        const startPeriod = entry.querySelector('.start-period').value;
        const endTime = entry.querySelector('.end-time').value;
        const endPeriod = entry.querySelector('.end-period').value;

        if (startTime && endTime) {
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);

            let start24h = startHour;
            let end24h = endHour;

            if (startPeriod === 'PM' && startHour !== 12) start24h += 12;
            if (startPeriod === 'AM' && startHour === 12) start24h = 0;
            if (endPeriod === 'PM' && endHour !== 12) end24h += 12;
            if (endPeriod === 'AM' && endHour === 12) end24h = 0;

            const startTotal = start24h * 60 + startMinute;
            const endTotal = end24h * 60 + endMinute;

            if (endTotal <= startTotal) {
                entry.classList.add('schedule-entry--shake');
                this.showFeedback('O horário final deve ser maior que o horário inicial', 'warning');
                
                setTimeout(() => {
                    entry.classList.remove('schedule-entry--shake');
                }, 400);

                return false;
            }
        }
        return true;
    }
} 