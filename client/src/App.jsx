import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import MainLayout from './components/MainLayout';
import UserContext from './contexts/UserContext';

function App() {

  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Container>
        <Routes>
          <Route path='/' element={<MainLayout />}>

          </Route>
        </Routes>
      </Container>
    </UserContext.Provider>
  )
}

export default App;
