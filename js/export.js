class ExportManager {
    static async exportToPDF() {
        try {
            // Importa dinamicamente a biblioteca jsPDF
            const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            const doc = new jsPDF.jsPDF();
            
            const schedules = Storage.getAllSchedules();
            const title = 'EasyShift Planner - Relatório de Escalas';
            
            doc.setFontSize(16);
            doc.text(title, 20, 20);
            
            let yPos = 40;
            Object.entries(schedules).forEach(([date, daySchedules]) => {
                const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                doc.setFontSize(12);
                doc.text(formattedDate, 20, yPos);
                yPos += 10;
                
                daySchedules.forEach(schedule => {
                    const scheduleText = `${schedule.employee}: ${schedule.startTime}${schedule.startPeriod} - ${schedule.endTime}${schedule.endPeriod}`;
                    doc.setFontSize(10);
                    doc.text(scheduleText, 30, yPos);
                    yPos += 7;
                    
                    if (yPos > 280) {
                        doc.addPage();
                        yPos = 20;
                    }
                });
                
                yPos += 5;
            });
            
            doc.save('escalas.pdf');
        } catch (error) {
            console.error('Erro ao exportar para PDF:', error);
        }
    }
    
    static exportToExcel() {
        // Importa o XLSX
        const XLSX = window.XLSX;
        const schedules = Storage.getAllSchedules();
        
        // Prepara os dados para o Excel
        const rows = [['Data', 'Funcionário', 'Início', 'Fim']];
        
        Object.entries(schedules).forEach(([date, daySchedules]) => {
            const formattedDate = new Date(date).toLocaleDateString('pt-BR');
            
            daySchedules.forEach(schedule => {
                rows.push([
                    formattedDate,
                    schedule.employee,
                    `${schedule.startTime}${schedule.startPeriod}`,
                    `${schedule.endTime}${schedule.endPeriod}`
                ]);
            });
        });
        
        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Escalas");
        
        XLSX.writeFile(wb, 'escalas.xlsx');
    }
    
    static exportToCSV() {
        const schedules = Storage.getAllSchedules();
        let csvContent = 'Data,Funcionário,Início,Fim\n';
        
        Object.entries(schedules).forEach(([date, daySchedules]) => {
            const formattedDate = new Date(date).toLocaleDateString('pt-BR');
            
            daySchedules.forEach(schedule => {
                csvContent += `${formattedDate},${schedule.employee},${schedule.startTime}${schedule.startPeriod},${schedule.endTime}${schedule.endPeriod}\n`;
            });
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'escalas.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    static shareByEmail() {
        const schedules = Storage.getAllSchedules();
        let emailBody = 'Escalas de Trabalho:\n\n';
        
        Object.entries(schedules).forEach(([date, daySchedules]) => {
            const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            emailBody += `${formattedDate}\n`;
            daySchedules.forEach(schedule => {
                emailBody += `- ${schedule.employee}: ${schedule.startTime}${schedule.startPeriod} - ${schedule.endTime}${schedule.endPeriod}\n`;
            });
            emailBody += '\n';
        });
        
        const mailtoLink = `mailto:?subject=EasyShift Planner - Escalas&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
    }
} 