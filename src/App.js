// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import AdminPanel from './components/AdminPanel';
import AddEmployeeForm from './components/AddEmployeeForm'; // Importa el componente AddEmployeeForm
import EditEmployeeForm from './components/EditEmployeeForm'; // Importa el componente EditEmployeeForm
import EmployeeCredential from './components/EmployeeCredential'; // Importa el componente EmployeeCredential

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployeeList />} />
        <Route path="/empleados/:id" element={<EmployeeDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/credenciales" element={<EmployeeList />} />
        <Route path="/add-employee" element={<AddEmployeeForm />} /> {/* Nueva ruta para agregar empleados */}
        <Route path="/edit-employee/:id" element={<EditEmployeeForm />} /> {/* Nueva ruta para editar empleados */}
        <Route path="/empleado/:num_empleado" element={<EmployeeCredential />} /> {/* Ruta para credenciales usando num_empleado */}
      </Routes>
    </Router>
  );
}

export default App;
