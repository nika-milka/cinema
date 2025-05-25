// Получаем ID кинотеатра из URL
const urlParams = new URLSearchParams(window.location.search);
const cinemaId = urlParams.get('cinemaId');

// Функция для загрузки сеансов
async function loadSessions() {
    try {
        const loadingMessage = document.getElementById('loadingMessage');
        const errorMessage = document.getElementById('errorMessage');
        
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        
        const response = await fetch(`http://localhost:3000/api/sessions/${cinemaId}`);
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки сеансов');
        }
        
        const sessions = await response.json();
        displaySessions(sessions);
        
        // Загружаем название кинотеатра
        await loadCinemaName(cinemaId);
    } catch (error) {
        showError(`Ошибка: ${error.message}`);
    }
}

function displaySessions(sessions) {
    const tableBody = document.getElementById('sessionTableBody');
    const loadingMessage = document.getElementById('loadingMessage');
    const sessionTable = document.getElementById('sessionTable');
    
    tableBody.innerHTML = '';
    
    sessions.forEach(session => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${session.movie_title}</td>
            <td>${session.genre_name}</td>
            <td>${session.hall_code} ${session.hall_type_name ? `(${session.hall_type_name})` : ''}</td>
            <td>${new Date(session.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
            <td>${new Date(session.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
            <td>${session.duration} мин.</td>
            <td>${session.price.toFixed(2)} руб.</td>
            <td>${session.seats}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    loadingMessage.style.display = 'none';
    sessionTable.style.display = 'table';
}

// Функция для загрузки названия кинотеатра
async function loadCinemaName(cinemaId) {
    try {
        const response = await fetch(`http://localhost:3000/api/cinemas/${cinemaId}`);
        if (response.ok) {
            const cinema = await response.json();
            document.getElementById('cinemaTitle').textContent = `Сеансы кинотеатра "${cinema.name}"`;
        }
    } catch (error) {
        console.error('Ошибка загрузки названия кинотеатра:', error);
    }
}

// Функция для отображения сеансов
function displaySessions(sessions) {
    const tableBody = document.getElementById('sessionTableBody');
    const loadingMessage = document.getElementById('loadingMessage');
    const sessionTable = document.getElementById('sessionTable');
    
    tableBody.innerHTML = '';
    
    sessions.forEach(session => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${session.movie_title}</td>
            <td>${session.genre_name}</td>
            <td>${session.hall_code} ${session.hall_type_name ? `(${session.hall_type_name})` : ''}</td>
            <td>${new Date(session.start_time).toLocaleTimeString()}</td>
            <td>${new Date(session.end_time).toLocaleTimeString()}</td>
            <td>${session.duration} мин.</td>
            <td>${session.price.toFixed(2)} руб.</td>
            <td>${session.seats} мест</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    loadingMessage.style.display = 'none';
    sessionTable.style.display = 'table';
}

// Функция для отображения сообщения
function showMessage(message) {
    const loadingMessage = document.getElementById('loadingMessage');
    loadingMessage.textContent = message;
}

// Функция для отображения ошибки
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    document.getElementById('loadingMessage').style.display = 'none';
}

// Кнопка "Назад" - возврат на предыдущую страницу
document.getElementById('backBtn').addEventListener('click', () => {
    // Возвращаемся на страницу кинотеатров
    window.location.href = 'cinema.html';
    
    // Альтернативный вариант - возврат в истории браузера
    // window.history.back();
});

// Загрузка данных при открытии страницы
document.addEventListener('DOMContentLoaded', () => {
    if (!cinemaId) {
        showError('Не указан ID кинотеатра');
        return;
    }
    
    loadSessions();
});