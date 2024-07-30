import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase'; // Asegúrate de que storage esté exportado desde firebase.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function EditEmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('');
  const [estado, setEstado] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [imagen, setImagen] = useState(null); // Para el archivo de imagen
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    async function fetchEmployee() {
      try {
        const docRef = doc(db, 'empleados', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmployee(data);
          setNombre(data.nombre);
          setPuesto(data.puesto);
          setEstado(data.estado);
          setDepartamento(data.departamento);
        } else {
          setError('Empleado no encontrado.');
        }
      } catch (error) {
        console.error('Error al obtener los datos del empleado:', error);
        setError('Error al obtener los datos del empleado.');
      }
    }

    fetchEmployee();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación básica
    if (!nombre || !puesto || !estado || !departamento) {
      setError('Todos los campos son obligatorios');
      return;
    }

    let imagenURL = employee.imagen; // Mantén la URL de imagen actual si no se sube una nueva imagen

    if (imagen) {
      // Sube la nueva imagen
      const imageRef = ref(storage, `images/${imagen.name}`);
      try {
        await uploadBytes(imageRef, imagen);
        imagenURL = await getDownloadURL(imageRef);
      } catch (error) {
        console.error('Error uploading new image:', error);
        setError('Error al subir la nueva imagen.');
        return;
      }
    }

    const employeeData = {
      nombre,
      puesto,
      estado,
      departamento,
      imagen: imagenURL,
    };

    try {
      const docRef = doc(db, 'empleados', id);
      await updateDoc(docRef, employeeData);
      setSuccess('Empleado actualizado con éxito');
      navigate('/'); // Redirige a la página principal después de la actualización
    } catch (error) {
      console.error('Error updating employee:', error);
      setError('Error al actualizar el empleado.');
    }
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Editar Empleado</h1>
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
        <button type="submit">Actualizar Empleado</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default EditEmployeeForm;
