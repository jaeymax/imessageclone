import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home'
import Login from './pages/Login';
import Register from './pages/Register';
import ChatRoom from './components/ChatRoom';
import Profile from './pages/Profile';
import { useContext } from 'react';
import { AppContext } from './context/appContext';
import PrivateRoute from './PrivateRoute';


function App() {
  const {theme} = useContext(AppContext);
  return (
    <>
    <div className={theme === 'light'?'app default':'app dark'}>
      <Router>
      <Routes>
        <Route element = {<PrivateRoute/>}>
          <Route path = '/' exact element={<Home/>} />
          <Route path = '/profile' element = {<Profile/>}/ >
          <Route path = '/chat/:id' element = {<ChatRoom/>} />
        </Route>
        <Route path = '/register' element={<Register/>} />
        <Route path = '/login' element={<Login/>} />

      </Routes>
      </Router>
    
    </div>
    </>

    
  );
}

export default App;
