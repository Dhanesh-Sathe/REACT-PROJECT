// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import TeamRegistrations from './TeamRegistration';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegistrationForm />} />
      <Route path="/team-registration" element={<TeamRegistrations />} />
    </Routes>
  );
}

export default App;
