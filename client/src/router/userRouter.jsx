import { Routes, Route } from 'react-router-dom';
import Layout from '../pages/Layout'; // Make sure the path is correct
import PhotoDetail from '../pages/PhotoDetail';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AboutUs from '../pages/AboutUs';
import PhotoGrid from '../components/PhotoGrid';

function UserRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PhotoGrid />} />
        <Route path="photo/:id" element={<PhotoDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="about" element={<AboutUs />} />
      </Route>
    </Routes>
  );
}

export default UserRouter;
