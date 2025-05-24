static async update(id, { cinema_id, hall_code, type_id, seats }) {
  const { rows } = await pool.query(
    `UPDATE halls 
     SET cinema_id = $1, hall_code = $2, type_id = $3, seats = $4 
     WHERE hall_id = $5 
     RETURNING *`,
    [cinema_id, hall_code, type_id, seats, id]
  );
  return rows[0];
}

static async update(id, { cinema_id, hall_code, type_id, seats }) {
  const { rows } = await pool.query(
    `UPDATE halls SET
      cinema_id = $1,
      hall_code = $2,
      type_id = $3,
      seats = $4
     WHERE hall_id = $5
     RETURNING *`,
    [cinema_id, hall_code, type_id, seats, id]
  );
  return rows[0];
}

static async delete(id) {
  const { rows } = await pool.query(
    `DELETE FROM halls
     WHERE hall_id = $1
     RETURNING *`,
    [id]
  );
  return rows[0];
}