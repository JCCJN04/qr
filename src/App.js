// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import AdminPanel from './components/AdminPanel';
import AddEmployeeForm from './components/AddEmployeeForm';
import EditEmployeeForm from './components/EditEmployeeForm';
import EmployeeCredential from './components/EmployeeCredential';

function App() {
  return (
    <Router basename="/credenciales">
      <Routes>
        <Route path="/" element={<EmployeeList />} />
        <Route path="/empleados/:id" element={<EmployeeDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/credenciales" element={<EmployeeList />} />
        <Route path="/add-employee" element={<AddEmployeeForm />} />
        <Route path="/edit-employee/:id" element={<EditEmployeeForm />} />
        <Route path="/empleado/:num_empleado" element={<EmployeeCredential />} />
      </Routes>
    </Router>
  );
}

export default App;
