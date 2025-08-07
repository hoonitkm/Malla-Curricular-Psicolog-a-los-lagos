document.addEventListener('DOMContentLoaded', () => {

    // 1. Estructura de la malla curricular con semestres y ramos
    const malla = {
        'SEMESTRE I': [
            'Taller de Análisis de la Realidad Regional',
            'Historia del Pensamiento Psicológico',
            'Bases Sociales del Comportamiento',
            'Bases Biológicas del Comportamiento',
            'Comunicación I',
            'Electivo'
        ],
        'SEMESTRE II': [
            'Psicología Social I',
            'Ciclo Vital I',
            'Teoría Psicoanalítica',
            'Teoría Humanista',
            'Taller de Comunicación Interpersonal',
            'Ciudadanía I',
            'Electivo'
        ],
        'SEMESTRE III': [
            'Psicología Social II',
            'Ciclo Vital II',
            'Teoría Cognitiva',
            'Teoría Sistémica',
            'Epistemología',
            'Inglés I',
            'Electivo'
        ],
        'SEMESTRE IV': [
            'Taller de Integración',
            'Neuropsicología',
            'Psicopatología Infanto - Juvenil',
            'Metodología de la Investigación I',
            'Inglés II',
            'Electivo'
        ],
        'SEMESTRE V': [
            'Psicología Organizacional',
            'Psicología Comunitaria',
            'Psicopatología de Adultos',
            'Metodología de la Investigación II',
            'Inglés III'
        ],
        'SEMESTRE VI': [
            'Psicología Clínica',
            'Psicología Educacional',
            'Evaluación Neurocognitiva',
            'Metodología de la Investigación III',
            'Inglés IV'
        ],
        'SEMESTRE VII': [
            'Seminario de Licenciatura I',
            'Evaluación Personalidad',
            'Intervención Psicoeducativa',
            'Intervención Organizacional'
        ],
        'SEMESTRE VIII': [
            'Seminario de Licenciatura II',
            'Taller de Psicodiagnóstico',
            'Intervención Clínica',
            'Intervención Comunitaria'
        ],
        'SEMESTRE IX': [
            'Práctica Profesional I',
            'Taller de Ética Profesional'
        ],
        'SEMESTRE X': [
            'Práctica Profesional II',
            'Examen de Título'
        ]
    };

    // 2. Definición de los requisitos para cada ramo
    const requisitos = {
        'Psicología Social I': ['Bases Sociales del Comportamiento'],
        'Psicología Social II': ['Psicología Social I'],
        'Ciclo Vital II': ['Ciclo Vital I'],
        'Taller de Integración': ['Teoría Psicoanalítica', 'Teoría Humanista', 'Teoría Cognitiva', 'Teoría Sistémica'],
        'Neuropsicología': ['Bases Biológicas del Comportamiento'],
        'Psicopatología Infanto - Juvenil': ['Ciclo Vital I'],
        'Metodología de la Investigación I': ['Epistemología'],
        'Inglés II': ['Inglés I'],
        'Psicología Comunitaria': ['Psicología Social II'],
        'Metodología de la Investigación II': ['Metodología de la Investigación I'],
        'Inglés III': ['Inglés II'],
        'Psicología Clínica': ['Psicopatología de Adultos'],
        'Psicología Educacional': ['Ciclo Vital I'],
        'Metodología de la Investigación III': ['Metodología de la Investigación II'],
        'Inglés IV': ['Inglés III'],
        'Seminario de Licenciatura I': ['Metodología de la Investigación III'],
        'Evaluación Personalidad': ['Evaluación Neurocognitiva'],
        'Intervención Psicoeducativa': ['Psicología Educacional'],
        'Intervención Organizacional': ['Psicología Organizacional'],
        'Seminario de Licenciatura II': ['Seminario de Licenciatura I'],
        'Taller de Psicodiagnóstico': ['Evaluación Personalidad'],
        'Intervención Clínica': ['Psicología Clínica'],
        'Intervención Comunitaria': ['Psicología Comunitaria'],
        'Práctica Profesional I': ['Seminario de Licenciatura I', 'Seminario de Licenciatura II'],
        'Taller de Ética Profesional': ['Seminario de Licenciatura I', 'Seminario de Licenciatura II'],
        'Práctica Profesional II': ['Práctica Profesional I'],
        'Examen de Título': ['Práctica Profesional II']
    };

    // 3. Obtiene los ramos aprobados guardados en localStorage o inicializa un objeto vacío
    let ramosAprobados = JSON.parse(localStorage.getItem('ramosAprobados')) || {};

    // 4. Referencia al contenedor de la malla y notificaciones en el HTML
    const gridContainer = document.querySelector('.grid-container');
    const notificationContainer = document.getElementById('notification-container');

    // 5. Función para renderizar la malla curricular
    function renderMalla() {
        gridContainer.innerHTML = ''; // Limpia el contenido anterior
        let semestreIndex = 1;
        for (const semestre in malla) {
            const semestreDiv = document.createElement('div');
            semestreDiv.classList.add('semestre');
            semestreDiv.innerHTML = `<h3 class="semestre-title">${semestre}</h3><ul class="ramo-list"></ul>`;
            
            const ramoList = semestreDiv.querySelector('.ramo-list');
            malla[semestre].forEach(ramo => {
                const ramoLi = document.createElement('li');
                ramoLi.textContent = ramo;
                ramoLi.classList.add('ramo', `semestre-${semestreIndex}`);
                ramoLi.dataset.ramoNombre = ramo; // Almacena el nombre para fácil acceso

                // Agrega la clase 'aprobado' si el ramo ya fue aprobado
                if (ramosAprobados[ramo]) {
                    ramoLi.classList.add('aprobado');
                }
                
                // Agrega la clase 'bloqueado' si sus requisitos no están cumplidos
                const ramoRequisitos = requisitos[ramo];
                if (ramoRequisitos) {
                    const requisitosCumplidos = ramoRequisitos.every(req => ramosAprobados[req]);
                    if (!requisitosCumplidos && !ramosAprobados[ramo]) {
                        ramoLi.classList.add('bloqueado');
                    }
                }

                ramoList.appendChild(ramoLi);
            });

            gridContainer.appendChild(semestreDiv);
            semestreIndex++;
        }
        // Agrega el evento de clic a todos los ramos
        document.querySelectorAll('.ramo').forEach(ramo => {
            ramo.addEventListener('click', handleRamoClick);
        });
    }

    // 6. Función para manejar el evento de clic en un ramo
    function handleRamoClick(event) {
        const ramoElement = event.target;
        const ramoNombre = ramoElement.dataset.ramoNombre;

        // Si el ramo ya está aprobado, lo desmarca
        if (ramoElement.classList.contains('aprobado')) {
            delete ramosAprobados[ramoNombre];
            localStorage.setItem('ramosAprobados', JSON.stringify(ramosAprobados));
            renderMalla(); // Vuelve a renderizar para actualizar el estado
            return;
        }

        // Verifica si el ramo tiene requisitos
        const requisitosFaltantes = requisitos[ramoNombre]?.filter(req => !ramosAprobados[req]);

        if (requisitosFaltantes && requisitosFaltantes.length > 0) {
            // Muestra un mensaje de ramos bloqueados
            const mensaje = `Ramo bloqueado. Faltan por aprobar: ${requisitosFaltantes.join(', ')}.`;
            alert(mensaje);
        } else {
            // Si no hay requisitos pendientes, se marca como aprobado
            ramosAprobados[ramoNombre] = true;
            localStorage.setItem('ramosAprobados', JSON.stringify(ramosAprobados));
            renderMalla();
            showNotification('¡Felicidades 🌟 ٩(◦`꒳´◦)۶!');
        }
    }

    // 7. Función para mostrar la notificación animada
    function showNotification(message) {
        const notificationDiv = document.createElement('div');
        notificationDiv.classList.add('notification');
        notificationDiv.textContent = message;
        notificationContainer.appendChild(notificationDiv);

        setTimeout(() => {
            notificationDiv.remove();
        }, 3000);
    }
    
    // Inicia la renderización de la malla cuando la página carga
    renderMalla();
});
