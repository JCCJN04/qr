// src/components/AddEmployeeForm.js
import React, { useState, useEffect } from 'react';
import { addEmployee } from '../services/employeeService';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './AddEmployeeForm.css'; // Importa el archivo CSS

function AddEmployeeForm() {
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('');
  const [estado, setEstado] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [maxNumEmpleado, setMaxNumEmpleado] = useState(0);
  const navigate = useNavigate(); // Usa useNavigate

  useEffect(() => {
    async function fetchMaxNumEmpleado() {
      try {
        const querySnapshot = await getDocs(collection(db, 'empleados'));
        const employeeData = querySnapshot.docs.map(doc => doc.data());
        const maxNum = employeeData.reduce((max, emp) => Math.max(max, emp.num_empleado || 0), 0);
        setMaxNumEmpleado(maxNum);
      } catch (error) {
        console.error('Error fetching max num_empleado:', error);
      }
    }

    fetchMaxNumEmpleado();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nombre || !puesto || !estado || !departamento) {
      setError('Todos los campos son obligatorios');
      return;
    }

    let imagenURL = '';

    if (imagen) {
      const imageRef = ref(storage, `images/${imagen.name}`);
      try {
        await uploadBytes(imageRef, imagen);
        imagenURL = await getDownloadURL(imageRef);
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Error al subir la imagen.');
        return;
      }
    }

    const employeeData = {
      nombre,
      puesto,
      estado,
      departamento,
      imagen: imagenURL,
      num_empleado: maxNumEmpleado + 1
    };

    try {
      await addEmployee(employeeData);
      setSuccess('Empleado agregado con éxito');
      setNombre('');
      setPuesto('');
      setEstado('');
      setDepartamento('');
      setImagen(null);
      navigate('/'); // Redirige a la lista de empleados
    } catch (error) {
      console.error('Error adding employee:', error);
      setError('Error al agregar empleado.');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-header">Agregar Nuevo Empleado</h1>
        <form onSubmit={handleSubmit} className="form-body">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
            placeholder="Puesto"
            required
          />
          <input
            type="text"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            placeholder="Estado"
            required
          />
          <input
            type="text"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            placeholder="Departamento"
            required
          />
          <input
            type="file"
            onChange={(e) => setImagen(e.target.files[0])}
          />
          <div className="form-footer">
            <button type="submit">Agregar Empleado</button>
            <button type="button" onClick={() => navigate('/')}>Regresar</button>
          </div>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>
    </div>
  );
}

export default AddEmployeeForm;
