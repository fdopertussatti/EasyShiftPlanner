// Inicializar componentes
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Inicializando aplicação...');
        
        // Inicializar UI
        UI.init();
        console.log('UI inicializada');
        
        // Inicializar Schedule
        Schedule.init();
        console.log('Schedule inicializado');
        
        // Inicializar Calendar
        window.calendar = new Calendar();
        console.log('Calendar inicializado');
        
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
    }
});

document.getElementById('exportPDF').addEventListener('click', () => ExportManager.exportToPDF());
document.getElementById('exportExcel').addEventListener('click', () => ExportManager.exportToExcel());
document.getElementById('exportCSV').addEventListener('click', () => ExportManager.exportToCSV());
document.getElementById('shareEmail').addEventListener('click', () => ExportManager.shareByEmail()); 