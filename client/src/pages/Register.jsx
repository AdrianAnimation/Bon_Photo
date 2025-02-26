 import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState([]);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    return newErrors;
  };

  const validatePassword = (password) => {
    const requirements = [];
    
    if (password.length < 8) {
      requirements.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      requirements.push('Must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      requirements.push('Must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      requirements.push('Must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      requirements.push('Must contain at least one special character (!@#$%^&*)');
    }
    
    return requirements;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific error when user types
    setErrors({ ...errors, [name]: '' });
    
    // Update password strength in real-time
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    const passwordErrors = validatePassword(formData.password);
    
    if (Object.keys(formErrors).length > 0 || passwordErrors.length > 0) {
      setErrors({ ...formErrors, password: passwordErrors.length > 0 ? 'Password does not meet requirements' : '' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        navigate('/login');
      } else {
        setErrors({ submit: data.message || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="form-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <div className="error-message">{errors.username}</div>}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
          
          {/* Password strength requirements */}
          {formData.password && passwordStrength.length > 0 && (
            <div className="password-requirements">
              <p>Password must:</p>
              <ul>
                {passwordStrength.map((req, index) => (
                  <li key={index} className="requirement-item">{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button type="submit">Register</button>
      </form>
      
      <p>
        Already have an account?{' '}
        <button onClick={() => navigate('/login')}>Login</button>
      </p>
    </div>
  );
}

export default Register;
