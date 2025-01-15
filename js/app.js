// Inicializar componentes
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Inicializando aplicação...');
        
        // Carregar traduções iniciais em inglês
        I18n.loadTranslations('en');

        // Inicializar UI
        UI.init();
        console.log('UI inicializada');
        
        // Inicializar Schedule
        Schedule.init();
        console.log('Schedule inicializado');
        
        // Inicializar Calendar
        window.calendar = new Calendar();
        console.log('Calendar inicializado');
        
        // Adicionar dados de exemplo ao carregar a aplicação
        if (!localStorage.getItem(Storage.keys.schedules)) {
            Storage.addExampleData();
        }

        // Remover event listener para dados de exemplo
        // document.getElementById('addExampleData').addEventListener('click', () => {
        //     Storage.addExampleData();
        // });

        // Mudar idioma
        document.querySelectorAll('.mdc-list-item').forEach(item => {
            item.addEventListener('click', (event) => {
                const selectedLanguage = event.currentTarget.getAttribute('data-value');
                if (selectedLanguage) {
                    I18n.loadTranslations(selectedLanguage);
                }
            });
        });

        document.getElementById('togglePrintView').addEventListener('click', () => {
            generatePrintView();

            const printView = document.querySelector('.print-calendar');
            const standardView = document.querySelector('.calendar');
            const printButton = document.getElementById('printButton');
            const returnButton = document.getElementById('returnButton');
            const togglePrintViewButton = document.getElementById('togglePrintView');

            if (printView && standardView) {
                if (printView.style.display === 'none' || printView.style.display === '') {
                    printView.style.display = 'block';
                    standardView.style.display = 'none';
                    printButton.style.display = 'inline-block';
                    returnButton.style.display = 'inline-block';
                    togglePrintViewButton.style.display = 'none';
                } else {
                    printView.style.display = 'none';
                    standardView.style.display = 'block';
                    printButton.style.display = 'none';
                    returnButton.style.display = 'none';
                    togglePrintViewButton.style.display = 'inline-block';
                }
            } else {
                console.error('Elementos de visualização não encontrados.');
            }
        });

        document.getElementById('printButton').addEventListener('click', () => {
            window.print();
        });

        document.getElementById('returnButton').addEventListener('click', () => {
            const printView = document.querySelector('.print-calendar');
            const standardView = document.querySelector('.calendar');
            const printButton = document.getElementById('printButton');
            const returnButton = document.getElementById('returnButton');
            const togglePrintViewButton = document.getElementById('togglePrintView');

            if (printView && standardView) {
                printView.style.display = 'none';
                standardView.style.display = 'block';
                printButton.style.display = 'none';
                returnButton.style.display = 'none';
                togglePrintViewButton.style.display = 'inline-block';
            }
        });

        // Remover event listener para imprimir página
        // document.getElementById('printPage').addEventListener('click', () => {
        //     window.print();
        // });

        // Funções para ajustar o tamanho da fonte
        function adjustFontSize(action) {
            const body = document.body;
            const currentFontSize = parseFloat(window.getComputedStyle(body).fontSize);
            let newFontSize;

            switch (action) {
                case 'increase':
                    newFontSize = currentFontSize * 1.1; // Aumenta em 10%
                    break;
                case 'decrease':
                    newFontSize = currentFontSize * 0.9; // Diminui em 10%
                    break;
                case 'reset':
                    newFontSize = 16; // Redefine para 16px
                    break;
                default:
                    return;
            }

            body.style.fontSize = `${newFontSize}px`;
        }

        // Adicionar event listeners para os botões de controle de fonte
        document.getElementById('increaseFont').addEventListener('click', () => adjustFontSize('increase'));
        document.getElementById('decreaseFont').addEventListener('click', () => adjustFontSize('decrease'));
        document.getElementById('resetFont').addEventListener('click', () => adjustFontSize('reset'));

        // Função para download dos dados
        document.getElementById('downloadData').addEventListener('click', () => {
            const schedules = JSON.parse(localStorage.getItem(Storage.keys.schedules) || '{}');
            const companyName = document.getElementById('companyName').value || 'Company';
            const dates = Object.keys(schedules).sort();
            if (dates.length === 0) {
                alert('Nenhum dado disponível para download.');
                return;
            }
            const startDate = dates[0];
            const endDate = dates[dates.length - 1];
            const fileName = `${startDate} to ${endDate} - ${companyName}.esp`;

            const blob = new Blob([JSON.stringify(schedules)], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
        });

        // Função para upload dos dados
        document.getElementById('uploadData').addEventListener('click', () => {
            document.getElementById('uploadFileInput').click();
        });

        document.getElementById('uploadFileInput').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file || !file.name.endsWith('.esp')) {
                alert('Por favor, selecione um arquivo .esp válido.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (typeof data !== 'object') throw new Error('Formato de dados inválido.');
                    localStorage.setItem(Storage.keys.schedules, JSON.stringify(data));
                    alert('Dados importados com sucesso!');
                    location.reload(); // Recarrega a página para aplicar os dados importados
                } catch (error) {
                    alert('Erro ao importar dados: ' + error.message);
                }
            };
            reader.readAsText(file);
        });

    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
    }
}); 