let currentHallId = null;

async function loadHalls() {
  try {
    const halls = await Api.getHalls();
    renderHalls(halls);
  } catch (error) {
    console.error('Ошибка при загрузке залов:', error);
    alert(`Ошибка при загрузке залов: ${error.message}`);
  }
}

function renderHalls(halls) {
  const table = document.querySelector('#hallsTable');
  const tbody = table.querySelector('tbody');
  if (tbody) {
    tbody.remove();
  }
  
  const newTbody = document.createElement('tbody');
  halls.forEach(hall => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${hall.cinema_name || 'Неизвестно'}</td>
      <td>${hall.hall_code}</td>
      <td>${hall.type_name || 'Неизвестно'}</td>
      <td>${hall.seats}</td>
      <td class="actions">
        <button class="btn edit-hall" data-id="${hall.hall_id}">Изменить</button>
        <button class="btn btn-danger delete-hall" data-id="${hall.hall_id}">Удалить</button>
      </td>
    `;
    newTbody.appendChild(tr);
  });
  
  table.appendChild(newTbody);
  
  document.querySelectorAll('.edit-hall').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      editHall(id);
    });
  });
  
  document.querySelectorAll('.delete-hall').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      showConfirmModal('Вы уверены, что хотите удалить этот зал?', id, deleteHall);
    });
  });
}

async function editHall(id) {
  try {
    const [hall, cinemas, hallTypes] = await Promise.all([
      Api.getHallById(id),
      Api.getCinemasForSelect(),
      Api.getHallTypesForSelect()
    ]);

    if (!hall) {
      alert('Зал не найден');
      return;
    }

    currentHallId = id;
    document.getElementById('hallModalTitle').textContent = 'Изменить зал';
    document.getElementById('hallCode').value = hall.hall_code;
    document.getElementById('hallSeats').value = hall.seats;

    const cinemaSelect = document.getElementById('hallCinemaId');
    cinemaSelect.innerHTML = '';
    cinemas.forEach(cinema => {
      const option = document.createElement('option');
      option.value = cinema.cinema_id;
      option.textContent = cinema.name;
      option.selected = cinema.cinema_id === hall.cinema_id;
      cinemaSelect.appendChild(option);
    });

    const typeSelect = document.getElementById('hallTypeId');
    typeSelect.innerHTML = '';
    hallTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.type_id;
      option.textContent = type.type_name;
      option.selected = type.type_id === hall.type_id;
      typeSelect.appendChild(option);
    });

    document.getElementById('hallModal').style.display = 'block';
  } catch (error) {
    console.error('Ошибка при редактировании зала:', error);
    alert(`Ошибка при загрузке данных зала: ${error.message}`);
  }
}

async function saveHall(event) {
  event.preventDefault();
  
  const hallData = {
    cinema_id: parseInt(document.getElementById('hallCinemaId').value),
    hall_code: document.getElementById('hallCode').value.trim(),
    type_id: parseInt(document.getElementById('hallTypeId').value),
    seats: parseInt(document.getElementById('hallSeats').value)
  };
  
  if (!hallData.hall_code || isNaN(hallData.seats)) {
    alert('Пожалуйста, заполните все поля корректно');
    return;
  }
  
  try {
    if (currentHallId) {
      await Api.updateHall(currentHallId, hallData);
      alert('Зал успешно обновлен!');
    } else {
      await Api.createHall(hallData);
      alert('Зал успешно создан!');
    }
    
    await loadHalls();
    closeAllModals();
  } catch (error) {
    console.error('Ошибка при сохранении зала:', error);
    alert(`Ошибка при сохранении зала: ${error.message}`);
  }
}

async function deleteHall(id) {
  try {
    await Api.deleteHall(id);
    alert('Зал успешно удален!');
    await loadHalls();
    closeAllModals();
  } catch (error) {
    console.error('Ошибка при удалении зала:', error);
    alert(`Ошибка при удалении зала: ${error.message}`);
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addHallBtn').addEventListener('click', async () => {
    try {
      const [cinemas, hallTypes] = await Promise.all([
        Api.getCinemasForSelect(),
        Api.getHallTypesForSelect()
      ]);

      currentHallId = null;
      document.getElementById('hallModalTitle').textContent = 'Добавить зал';
      document.getElementById('hallCode').value = '';
      document.getElementById('hallSeats').value = '100';

      const cinemaSelect = document.getElementById('hallCinemaId');
      cinemaSelect.innerHTML = '';
      cinemas.forEach(cinema => {
        const option = document.createElement('option');
        option.value = cinema.cinema_id;
        option.textContent = cinema.name;
        cinemaSelect.appendChild(option);
      });

      const typeSelect = document.getElementById('hallTypeId');
      typeSelect.innerHTML = '';
      hallTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.type_id;
        option.textContent = type.type_name;
        typeSelect.appendChild(option);
      });

      document.getElementById('hallModal').style.display = 'block';
    } catch (error) {
      console.error('Ошибка при открытии формы зала:', error);
      alert(`Ошибка при загрузке данных для формы: ${error.message}`);
    }
  });

  document.getElementById('hallForm').addEventListener('submit', saveHall);
  loadHalls();
});