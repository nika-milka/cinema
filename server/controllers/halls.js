exports.updateHall = async (req, res) => {
  try {
    console.log('Updating hall with data:', req.body); // Логирование
    
    const updatedHall = await Hall.update(req.params.id, req.body);
    if (!updatedHall) {
      console.log('Hall not found for update:', req.params.id);
      return res.status(404).json({ error: 'Зал не найден' });
    }
    
    console.log('Successfully updated hall:', updatedHall);
    res.json(updatedHall);
  } catch (error) {
    console.error('Update hall error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Ошибка при обновлении зала' 
    });
  }
};

exports.deleteHall = async (req, res) => {
  try {
    console.log('Deleting hall with id:', req.params.id); // Логирование
    
    const deletedHall = await Hall.delete(req.params.id);
    if (!deletedHall) {
      console.log('Hall not found for deletion:', req.params.id);
      return res.status(404).json({ error: 'Зал не найден' });
    }
    
    console.log('Successfully deleted hall:', deletedHall);
    res.json({ 
      success: true,
      message: 'Зал успешно удален',
      data: deletedHall
    });
  } catch (error) {
    console.error('Delete hall error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Ошибка при удалении зала' 
    });
  }
};