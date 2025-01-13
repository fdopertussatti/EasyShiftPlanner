function exportToPDF(data) {
    const doc = new jsPDF();
    
    // Adicionar cabeçalho
    doc.setFontSize(18);
    doc.text('Agenda de Trabalho', 105, 15, { align: 'center' });
    
    // Adicionar informações do local
    doc.setFontSize(12);
    doc.text(`${locationInfo.name}`, 105, 25, { align: 'center' });
    doc.text(`${locationInfo.address}`, 105, 30, { align: 'center' });
    
    // Adicionar dados da agenda
    let yPos = 40;
    Object.entries(data).forEach(([date, schedules]) => {
        doc.text(date, 20, yPos);
        yPos += 5;
        
        schedules.forEach(schedule => {
            doc.text(`${schedule.time} - ${schedule.employee}`, 30, yPos);
            yPos += 5;
        });
        
        yPos += 5;
    });
    
    doc.save('agenda.pdf');
} 