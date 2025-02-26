 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './pages/Layout';
import Dashboard from './Dashboard/Dashboard';
import PhotoGrid from './components/PhotoGrid';
import AboutUs from './pages/AboutUs';
import PhotoDetail from './pages/PhotoDetail';
import './i18n/i18n';  // Import i18n configuration

function App() {
  return (
    <Provider store={store}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PhotoGrid />} />
            <Route path="photo/:id" element={<PhotoDetail />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<AboutUs />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
