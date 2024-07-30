// src/services/employeeService.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const addEmployee = async (employeeData) => {
  try {
    // Asegúrate de que la colección 'empleados' exista y esté correctamente configurada en Firestore
    const docRef = await addDoc(collection(db, 'empleados'), employeeData);
    console.log('Empleado agregado con ID:', docRef.id);
  } catch (error) {
    console.error('Error adding document:', error);
    throw new Error('Error al agregar el empleado.');
  }
};
