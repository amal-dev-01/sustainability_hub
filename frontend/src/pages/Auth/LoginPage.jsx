import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authSlice';
import { Form, Button, Card, Alert, Spinner, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e63946, #ff6b6b)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container>
        <Card
          className="mx-auto shadow-lg border-0"
          style={{
            maxWidth: '380px',
            borderRadius: '1rem',
            backgroundColor: '#fff',
          }}
        >
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <h3
                style={{
                  color: '#e63946',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                }}
              >
                Welcome Back
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                Please log in to your account
              </p>
            </div>

            {error && (
              <Alert
                variant="danger"
                className="py-2 text-center"
                style={{ fontSize: '0.9rem' }}
              >
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  style={{
                    borderRadius: '0.5rem',
                    borderColor: '#e63946',
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label className="fw-semibold">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  style={{
                    borderRadius: '0.5rem',
                    borderColor: '#e63946',
                  }}
                />
              </Form.Group>

              <div className="d-grid mt-4">
                <Button
                  variant="danger"
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: '#e63946',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.6rem',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#d62828')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#e63946')}
                >
                  {loading ? <Spinner size="sm" animation="border" /> : 'Login'}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <small className="text-muted">
                © {new Date().getFullYear()}
              </small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;
