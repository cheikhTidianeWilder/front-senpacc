// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import api from '../../../services/api.ts';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string, password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [signUpMode, setSignUpMode] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors: { email?: string, password?: string } = {};

    if (!email) {
      newErrors.email = 'Ce champ est obligatoire';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Veuillez saisir une adresse valide';
    }

    if (!password) {
      newErrors.password = 'Ce champ est obligatoire';
    } else if (password.length < 4) {
      newErrors.password = 'Veuillez saisir au minimum 4 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, role } = response.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role);

      switch (role) {
        case 'Urologue':
          navigate('/urologie');
          break;
        case 'Cardiologue':
          navigate('/cardiologie');
          break;
        case 'Gynécologue':
          navigate('/maternite');
          break;
        default:
          navigate('/');
      }
    } catch (error: any) {
      console.error('Erreur de connexion :', error);
      alert("Échec de la connexion. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') setEmail(value);
    else setPassword(value);

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSignUpClick = () => setSignUpMode(true);
  const handleSignInClick = () => setSignUpMode(false);

  return (
    <div>
      <div className={`container-fluid ${signUpMode ? 'sign-up-mode' : ''}`}>
        <div className="forms-container">
          <div className="signin-signup">
            <form className="sign-in-form" onSubmit={handleLogin}>
              <div>
                <img src="/logo-sen-pacc-ts.png" alt="Logo Senpacc" style={{ height: '200px' }} />
              </div><br /><br />
              <div className={`input-field ${errors.email ? 'is-invalid' : ''}`}>
                <i className="fas fa-user"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}

              <div className={`input-field ${errors.password ? 'is-invalid' : ''}`}>
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}

              <button type="submit" className="btnn solide" disabled={loading}>
                {loading ? 'CONNEXION...' : 'CONNEXION'}
              </button>

              {loading && (
                <div className="text-center">
                  <div className="spinner-border text-info my-4" role="status"></div>
                  <div className="my-4">
                    <span className="text-info">Un moment s'il vous plaît...</span>
                  </div>
                </div>
              )}

              <p className="social-text" style={{ color: 'white' }}>
                <strong>SENPAĆĆ</strong> pour une vie meilleure
              </p>
              <div className="social-media">
                <button type="button" className="social-icon"><i className="fab fa-facebook-f"></i></button>
                <button type="button" className="social-icon"><i className="fab fa-twitter"></i></button>
                <button type="button" className="social-icon"><i className="fab fa-google"></i></button>
                <button type="button" className="social-icon"><i className="fab fa-linkedin-in"></i></button>
              </div>
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>SENPAĆĆ</h3>
              <p>
                Un suivi patient est un processus permettant de suivre le parcours d'un patient
                tout au long de ses soins en facilitant la traçabilité de ses interactions avec
                le personnel soignant.
              </p>
              <button type="button" className="btnn transparent" onClick={handleSignUpClick}>
                <strong>À PROPOS</strong>
              </button>
            </div>
            <div className="image">
              <img src="/logo1.svg" alt="Logo Senpacc" style={{ fontSize: '20px', color: 'white', opacity: 0.7 }} />
            </div>
          </div>

          <div className="panel right-panel">
            <div className="content">
              <h3>À PROPOS</h3>
              <p>
                L'état du Sénégal, de par son grand potentiel et son expertise humain,
                est devenu le hub ouest-africain pour les services de la santé en général
                et ambitionne davantage de faire du secteur sanitaire un levier de croissance
                durable car il n'y a aucune chose qui vaille plus que la santé.
              </p>
              <button type="button" className="btnn transparent" onClick={handleSignInClick}>
                <strong>ACCUEIL</strong>
              </button>
            </div>
            <div className="image">
              <img src="/logo2.svg" alt="Logo Senpacc" style={{ fontSize: '20px', color: 'white', opacity: 0.7 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
