import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import MainLayout from './components/MainLayout';

function App() {

  return (
    <Container>
      <Routes>
        <Route path='/' element={<MainLayout />}>

        </Route>
      </Routes>
    </Container>
  )
}

export default App;
