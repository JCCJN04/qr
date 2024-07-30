// src/components/AddEmployeeForm.js
import React, { useState, useEffect } from 'react';
import { addEmployee } from '../services/employeeService'; // Asegúrate de que esta función exista y esté correcta
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../firebase'; // Asegúrate de exportar storage desde firebase.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function AddEmployeeForm() {
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('');
  const [estado, setEstado] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [imagen, setImagen] = useState(null); // Para el archivo de imagen
  const [numEmpleado, setNumEmpleado] = useState(''); // Campo para el número de empleado
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [maxNumEmpleado, setMaxNumEmpleado] = useState(0); // Estado para el máximo número de empleado

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

    // Validación básica
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
      num_empleado: maxNumEmpleado + 1 // Genera el siguiente número de empleado
    };

    try {
      await addEmployee(employeeData);
      setSuccess('Empleado agregado con éxito');
      // Limpiar campos después de agregar el empleado
      setNombre('');
      setPuesto('');
      setEstado('');
      setDepartamento('');
      setImagen(null);
    } catch (error) {
      console.error('Error adding employee:', error);
      setError('Error al agregar empleado.');
    }
  };

  return (
    <div>
      <h1>Agregar Nuevo Empleado</h1>
      <form onSubmit={handleSubmit}>
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
          onChange={(e) => setImagen(e.target.files[0])} // Maneja el archivo seleccionado
        />
        <button type="submit">Agregar Empleado</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default AddEmployeeForm;
