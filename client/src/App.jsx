import { useState, useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import UserContext from './contexts/UserContext';
import HomePage from './components/HomePage';
import PlanningPage from './components/PlanningPage';
import ExecutionPage from './components/ExecutionPage';
import ResultPage from './components/ResultPage';
import LoginForm from './components/LoginForm';

function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);
  if (!user) return <Navigate to="/login" />;
  return children;
}

function App() {

  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />}></Route>
          <Route path='login' element={<LoginForm />}></Route>
          <Route path='planning' element={<ProtectedRoute><PlanningPage /></ProtectedRoute>} />
          <Route path='executing' element={<ProtectedRoute><ExecutionPage /></ProtectedRoute>} />
          <Route path='result' element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </UserContext.Provider>
  )
}

export default App;
