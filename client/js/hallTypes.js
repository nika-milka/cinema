let currentHallTypeId = null;

async function loadHallTypes() {
  try {
    const hallTypes = await Api.getHallTypes();
    renderHallTypes(hallTypes);
  } catch (error) {
    console.error('Ошибка при загрузке типов залов:', error);
    alert(`Ошибка при загрузке типов залов: ${error.message}`);
  }
}

function renderHallTypes(hallTypes) {
  const table = document.querySelector('#hallTypesTable');
  // Очищаем только тело таблицы, оставляя заголовки
  const tbody = table.querySelector('tbody');
  if (tbody) {
    tbody.remove();
  }
  
  const newTbody = document.createElement('tbody');
  hallTypes.forEach(type => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${type.type_name}</td>
      <td class="actions">
        <button class="btn edit-hall-type" data-id="${type.type_id}">Изменить</button>
        <button class="btn btn-danger delete-hall-type" data-id="${type.type_id}">Удалить</button>
      </td>
    `;
    newTbody.appendChild(tr);
  });
  
  table.appendChild(newTbody);
  
  // Навешиваем обработчики событий
  document.querySelectorAll('.edit-hall-type').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      editHallType(id);
    });
  });
  
  document.querySelectorAll('.delete-hall-type').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.getAttribute('data-id'));
      showConfirmModal('Вы уверены, что хотите удалить этот тип зала?', id, deleteHallType);
    });
  });
}

async function editHallType(id) {
  try {
    const hallType = await Api.getHallTypeById(id);
    if (!hallType) {
      alert('Тип зала не найден');
      return;
    }
    
    currentHallTypeId = id;
    document.getElementById('hallTypeModalTitle').textContent = 'Изменить тип зала';
    document.getElementById('hallTypeName').value = hallType.type_name;
    document.getElementById('hallTypeModal').style.display = 'block';
  } catch (error) {
    console.error('Ошибка при редактировании типа зала:', error);
    alert(`Ошибка при загрузке данных типа зала: ${error.message}`);
  }
}

async function saveHallType(event) {
  event.preventDefault();
  
  const hallTypeData = {
    type_name: document.getElementById('hallTypeName').value.trim()
  };
  
  if (!hallTypeData.type_name) {
    alert('Пожалуйста, введите название типа зала');
    return;
  }
  
  try {
    if (currentHallTypeId) {
      await Api.updateHallType(currentHallTypeId, hallTypeData);
      alert('Тип зала успешно обновлен!');
    } else {
      await Api.createHallType(hallTypeData);
      alert('Тип зала успешно создан!');
    }
    
    await loadHallTypes();
    closeAllModals();
  } catch (error) {
    console.error('Ошибка при сохранении типа зала:', error);
    alert(`Ошибка при сохранении типа зала: ${error.message}`);
  }
}

async function deleteHallType(id) {
  try {
    await Api.deleteHallType(id);
    alert('Тип зала успешно удален!');
    await loadHallTypes();
    closeAllModals();
  } catch (error) {
    console.error('Ошибка при удалении типа зала:', error);
    alert(`Ошибка при удалении типа зала: ${error.message}`);
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addHallTypeBtn').addEventListener('click', () => {
    currentHallTypeId = null;
    document.getElementById('hallTypeModalTitle').textContent = 'Добавить тип зала';
    document.getElementById('hallTypeName').value = '';
    document.getElementById('hallTypeModal').style.display = 'block';
  });

  document.getElementById('hallTypeForm').addEventListener('submit', saveHallType);
  
  // Инициализация загрузки данных
  loadHallTypes();
});