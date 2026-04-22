import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const sendOTP = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/otp/send_otp/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('OTP sent to your email!');
                setStep(2);
            } else {
                setError(data.error || 'Failed to send OTP');
            }
        } catch (error) {
            setError('Something went wrong');
        }
    };

    const verifyOTPAndRegister = async () => {
        const verifyResponse = await fetch('http://localhost:8000/api/otp/verify_otp/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email, otp: otp })
        });
        
        const verifyData = await verifyResponse.json();
        
        if (!verifyData.verified) {
            setError(verifyData.error || 'Invalid OTP');
            return false;
        }
        
        const registerResponse = await fetch('http://localhost:8000/api/register/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
        });
        
        const registerData = await registerResponse.json();
        
        if (registerResponse.ok) {
            return true;
        } else {
            setError(registerData.error || 'Registration failed');
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        await sendOTP();
        setLoading(false);
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const success = await verifyOTPAndRegister();
        
        if (success) {
            alert('Account created successfully! Please login.');
            navigate('/login');
        }
        
        setLoading(false);
    };

    if (step === 2) {
        return (
            <div style={{ padding: '80px', minHeight: '60vh', maxWidth: '500px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Verify OTP</h2>
                <p>OTP sent to {formData.email}</p>
                
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                
                <form onSubmit={handleOTPSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Enter OTP</label>
                        <input
                            type="text"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6 digit OTP"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: '#088178',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            borderRadius: '4px'
                        }}
                    >
                        {loading ? 'Verifying...' : 'Verify & Register'}
                    </button>
                </form>
                
                <button onClick={sendOTP} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#088178', cursor: 'pointer' }}>
                    Resend OTP
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '80px', minHeight: '60vh', maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Sign Up</h2>
            
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
                    <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '15px',
                        background: '#088178',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        borderRadius: '4px'
                    }}
                >
                    {loading ? 'Sending OTP...' : 'Sign Up'}
                </button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

export default SignupPage;