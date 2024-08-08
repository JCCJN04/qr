// src/components/EmployeeList.js ??
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import QRCode from 'qrcode.react';
import { Link, useNavigate } from 'react-router-dom';
import './EmployeeList.css';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const querySnapshot = await getDocs(collection(db, 'empleados'));
        const employeeData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        employeeData.sort((a, b) => a.num_empleado - b.num_empleado);
        setEmployees(employeeData);
        setCurrentIndex(employeeData.length > 0 ? 0 : null);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError('Error fetching employees.');
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const nextEmployee = () => {
    if (currentIndex !== null && currentIndex < employees.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevEmployee = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        await deleteDoc(doc(db, 'empleados', id));
        setEmployees(employees.filter(employee => employee.id !== id));
        setCurrentIndex(employees.length > 1 ? 0 : null);
      } catch (error) {
        console.error('Error deleting employee:', error);
        setError('Error al eliminar empleado.');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const employee = employees[currentIndex];
  //const qrValue = `http://localhost:3000/empleado/${encodeURIComponent(employee.num_empleado)}`;
  //const qrValue = `https://2227btpm-3000.usw3.devtunnels.ms/empleado/${encodeURIComponent(employee.num_empleado)}`;
  const qrValue = `juan carlos mendoza castillo prueba`;
  //const qrValue = `https://<jccjn04>.github.io/<credenciales>/empleado/${encodeURIComponent(employee.num_empleado)}`;


  return (
    <div className="employee-container">
      <div className="header">
        <Link to="/add-employee">
          <button>Agregar Empleado</button>
        </Link>
      </div>
      {employee ? (
        <div className="employee-card">
          <div className="employee-header">
            <h1>Credencial de Presentación</h1>
          </div>
          <div className="employee-body">
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
            <div className="employee-qr">
              <QRCode value={qrValue} />
            </div>
          </div>
          <div className="employee-footer">
            <button onClick={prevEmployee} disabled={currentIndex === 0}>
              Anterior
            </button>
            <button onClick={nextEmployee} disabled={currentIndex === employees.length - 1}>
              Siguiente
            </button>
            <button onClick={() => handleEdit(employee.id)}>Editar</button>
            <button onClick={() => handleDelete(employee.id)}>Eliminar</button>
          </div>
        </div>
      ) : (
        <p>No employees found</p>
      )}
    </div>
  );
}

export default EmployeeList;
