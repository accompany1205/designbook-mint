import React, { useState, useEffect, useRef } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';
import { Toast } from 'primereact/toast';
import '../auth.css';
export default function Login() {
    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('login', {isLoggedIn});
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn])

    const [email, setEmail] = useState('');
    const [key, setKey] = useState('');

    const handleSumbit = async (event) => {
        event.preventDefault();
        const res = await login(email, key);
        if(!res){
            toast.current.show({ severity: 'error', summary: 'Sign In info incorrect!', detail: `Name: Error`, life: 3000 });
        }
        setEmail('');
        setKey('');
    }
    const handleChange = (event) => {
        if(event.target.name === 'email'){
            setEmail(()=>event.target.value)
        }else{
            setKey(()=>event.target.value);
        }
    };

    return (
        <div className="auth-wrapper">
            <Toast ref={toast} />
            <div className="auth-inner">
                <form onSubmit={handleSumbit}>
                    <h3>Sign In</h3>
                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            name ="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Company Key</label>
                        <input
                            type="text"
                            name="key"
                            className="form-control"
                            placeholder="Enter key"
                            value={key}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <div className="custom-control custom-checkbox">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck1"
                            />
                            <label className="custom-control-label" htmlFor="customCheck1">
                                Remember me
                            </label>
                        </div>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-secondary">
                            Submit
                        </button>
                    </div>
                    <p className="forgot-password text-right">
                        create a new  <a href={process.env.REACT_APP_REGISTER_URL}>account?</a>
                    </p>
                </form>
            </div>
        </div>
    )
}