// src/components/EmployeeCredential.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './EmployeeCredential.css';

function EmployeeCredential() {
  const { num_empleado } = useParams(); // Cambia 'id' por 'num_empleado'
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const employeesRef = collection(db, 'empleados');
        const q = query(employeesRef, where('num_empleado', '==', parseInt(num_empleado))); // Buscar por num_empleado
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0]; // Toma el primer documento encontrado
          setEmployee(docSnap.data());
        } else {
          setError('Empleado no encontrado');
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
        setError('Error al obtener datos del empleado.');
      }
    }

    fetchEmployee();
  }, [num_empleado]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="employee-credential">
      <h1>Credencial del Empleado</h1>
      <div className="employee-photo">
        {employee.imagen ? (
          <img src={employee.imagen} alt={`${employee.nombre}'s picture`} />
        ) : (
          <img src="https://via.placeholder.com/150" alt="Default placeholder" />
        )}
      </div>
      <div className="employee-details">
        <p><strong>Nombre:</strong> {employee.nombre}</p>
        <p><strong>Puesto:</strong> {employee.puesto}</p>
        <p><strong>Estado:</strong> {employee.estado}</p>
        <p><strong>Departamento:</strong> {employee.departamento}</p>
        <p><strong>Num Empleado:</strong> {employee.num_empleado}</p>
      </div>
    </div>
  );
}

export default EmployeeCredential;
