// src/components/Employee.js
import React from 'react';

function Employee({ nombre, puesto, estado, departamento, imagen, num_Empleado }) {
  return (
    <div className="employee">
      {imagen && <img src={imagen} alt={`${nombre}'s picture`} className="employee-image" />}
      <h2>{nombre}</h2>
      <p>{puesto}</p>
      <p>{estado}</p>
      <p>{departamento}</p>
      <p>{num_Empleado}</p>
    </div>
  );
}

export default Employee;
