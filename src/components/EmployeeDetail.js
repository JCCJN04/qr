// src/components/EmployeeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import QRCode from 'qrcode.react';
import './EmployeeDetail.css';

function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const docRef = doc(db, 'empleados', id); // Utiliza el nombre correcto de la colección
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEmployee(docSnap.data());
        } else {
          setError('No such document!');
        }
      } catch (error) {
        setError('Error fetching employee.');
      } finally {
        setLoading(false);
      }
    }

    fetchEmployee();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  //const qrValue = `http://localhost:3000/employees/${encodeURIComponent(id)}`;
  const qrValue = `https://JCCJN04.github.io/credenciales/employees/${encodeURIComponent(employee.id)}`;


  return (
    <div className="employee-detail">
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
            </div>
            <div className="employee-qr">
              <QRCode value={qrValue} />
            </div>
          </div>
        </div>
      ) : (
        <p>No employee found</p>
      )}
    </div>
  );
}

export default EmployeeDetail;
