let currentCinemaId = null;

async function loadCinemas() {
  try {
    const cinemas = await Api.getCinemas();
    renderCinemas(cinemas);
  } catch (error) {
    console.error('Ошибка при загрузке кинотеатров:', error);
    alert(`Ошибка при загрузке кинотеатров: ${error.message}`);
  }
}

function renderCinemas(cinemas) {
  const table = document.querySelector('#cinemasTable');
  // Очищаем только тело таблицы, оставляя заголовки
  const tbody = table.querySelector('tbody');
  if (tbody) {
    tbody.remove();
  }
  
  const newTbody = document.createElement('tbody');
  
  const searchTerm = document.getElementById('cinemaSearch').value.toLowerCase();
  
  cinemas.filter(cinema => 
    cinema.name.toLowerCase().includes(searchTerm) || 
    cinema.address.toLowerCase().includes(searchTerm) ||
    cinema.phone.toLowerCase().includes(searchTerm)
  ).forEach(cinema => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${cinema.name}</td>
      <td>${cinema.address}</td>
      <td>${cinema.phone}</td>
      <td class="actions">
        <button class="btn edit-cinema" data-id="${cinema.cinema_id}">Изменить</button>
        <button class="btn btn-danger delete-cinema" data-id="${cinema.cinema_id}">Удалить</button>
      </td>
    `;
    newTbody.appendChild(tr);
  });
  
  table.appendChild(newTbody);
  
  document.querySelectorAll('.edit-cinema').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      editCinema(id);
    });
  });
  
  document.querySelectorAll('.delete-cinema').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      showConfirmModal('Вы уверены, что хотите удалить этот кинотеатр?', id, deleteCinema);
    });
  });
}

async function editCinema(id) {
  try {
    const cinema = await Api.getCinemaById(id);
    if (!cinema) {
      alert('Кинотеатр не найден');
      return;
    }
    
    currentCinemaId = id;
    document.getElementById('cinemaModalTitle').textContent = 'Изменить кинотеатр';
    document.getElementById('cinemaName').value = cinema.name;
    document.getElementById('cinemaAddress').value = cinema.address;
    document.getElementById('cinemaPhone').value = cinema.phone;
    document.getElementById('cinemaModal').style.display = 'block';
  } catch (error) {
    console.error('Ошибка при редактировании кинотеатра:', error);
    alert(`Ошибка при загрузке данных кинотеатра: ${error.message}`);
  }
}

async function saveCinema(event) {
  event.preventDefault();
  
  const cinemaData = {
    name: document.getElementById('cinemaName').value.trim(),
    address: document.getElementById('cinemaAddress').value.trim(),
    phone: document.getElementById('cinemaPhone').value.trim()
  };
  
  if (!cinemaData.name || !cinemaData.address || !cinemaData.phone) {
    alert('Пожалуйста, заполните все поля');
    return;
  }
  
  try {
    if (currentCinemaId) {
      await Api.updateCinema(currentCinemaId, cinemaData);
      alert('Кинотеатр успешно обновлен!');
    } else {
      await Api.createCinema(cinemaData);
      alert('Кинотеатр успешно создан!');
    }
    
    await loadCinemas();
    closeAllModals();
  } catch (error) {
    console.error('Ошибка при сохранении кинотеатра:', error);
    alert(`Ошибка при сохранении кинотеатра: ${error.message}`);
  }
}

async function deleteCinema(id) {
  try {
    await Api.deleteCinema(id);
    alert('Кинотеатр успешно удален!');
    await loadCinemas();
    closeAllModals();
  } catch (error) {
    console.error('Ошибка при удалении кинотеатра:', error);
    alert(`Ошибка при удалении кинотеатра: ${error.message}`);
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addCinemaBtn').addEventListener('click', () => {
    currentCinemaId = null;
    document.getElementById('cinemaModalTitle').textContent = 'Добавить кинотеатр';
    document.getElementById('cinemaName').value = '';
    document.getElementById('cinemaAddress').value = '';
    document.getElementById('cinemaPhone').value = '';
    document.getElementById('cinemaModal').style.display = 'block';
  });

  document.getElementById('cinemaForm').addEventListener('submit', saveCinema);
  document.getElementById('cinemaSearch').addEventListener('input', loadCinemas);
  
  // Инициализация загрузки данных
  loadCinemas();
});