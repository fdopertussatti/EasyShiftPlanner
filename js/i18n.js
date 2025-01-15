class I18n {
    static translations = {
        en: {
            "appTitle": "EasyShift Planner",
            "addEmployee": "Add Employee",
            "exportPDF": "Export PDF",
            "exportExcel": "Export Excel",
            "exportCSV": "Export CSV",
            "shareEmail": "Share via Email",
            "addExampleData": "Add Example Data",
            "exampleDataAdded": "Example data added for the current month!",
            "invalidTime": "End time must be greater than start time",
            "save": "Save",
            "cancel": "Cancel",
            "companyName": "Company Name",
            "language": "Language",
            "daysOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "editSchedule": "Edit Schedule",
            "deleteSchedule": "Delete Schedule",
            "confirmDelete": "Are you sure you want to delete this schedule?",
            "scheduleSaved": "Schedule saved successfully!",
            "scheduleDeleted": "Schedule deleted successfully!",
            "printDate": "Print Date"
        },
        pt: {
            "appTitle": "EasyShift Planner",
            "addEmployee": "Adicionar Funcionário",
            "exportPDF": "Exportar PDF",
            "exportExcel": "Exportar Excel",
            "exportCSV": "Exportar CSV",
            "shareEmail": "Compartilhar por Email",
            "addExampleData": "Adicionar Dados de Exemplo",
            "exampleDataAdded": "Dados de exemplo adicionados para o mês atual!",
            "invalidTime": "O horário final deve ser maior que o horário inicial",
            "save": "Salvar",
            "cancel": "Cancelar",
            "companyName": "Nome da Empresa",
            "language": "Idioma",
            "daysOfWeek": ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
            "months": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            "editSchedule": "Editar Escala",
            "deleteSchedule": "Excluir Escala",
            "confirmDelete": "Tem certeza de que deseja excluir esta escala?",
            "scheduleSaved": "Escala salva com sucesso!",
            "scheduleDeleted": "Escala excluída com sucesso!",
            "printDate": "Print Date"
        },
        es: {
            "appTitle": "EasyShift Planner",
            "addEmployee": "Agregar Empleado",
            "exportPDF": "Exportar PDF",
            "exportExcel": "Exportar Excel",
            "exportCSV": "Exportar CSV",
            "shareEmail": "Compartir por Correo",
            "addExampleData": "Agregar Datos de Ejemplo",
            "exampleDataAdded": "¡Datos de ejemplo agregados para el mes actual!",
            "invalidTime": "La hora de finalización debe ser mayor que la hora de inicio",
            "save": "Guardar",
            "cancel": "Cancelar",
            "companyName": "Nombre de la Empresa",
            "language": "Idioma",
            "daysOfWeek": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            "editSchedule": "Editar Horario",
            "deleteSchedule": "Eliminar Horario",
            "confirmDelete": "¿Está seguro de que desea eliminar este horario?",
            "scheduleSaved": "¡Horario guardado con éxito!",
            "scheduleDeleted": "¡Horario eliminado con éxito!",
            "printDate": "Print Date"
        }
    };

    static currentLanguage = 'en';

    static loadTranslations(language) {
        this.currentLanguage = language;
        this.applyTranslations();
    }

    static applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[this.currentLanguage][key]) {
                element.textContent = this.translations[this.currentLanguage][key];
            }
        });
    }

    static translate(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
} 