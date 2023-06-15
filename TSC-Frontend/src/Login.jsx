
import React, { useState } from 'react'

export const Login = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, password)
    }

    return (
        <div className='auth-form-container'>
            <h2>Login</h2>
            <form className='login-form' onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input value={email} type="email" placeholder="email@mail.com" id="email" name="email"/>

                <label htmlFor="password">Password</label>
                <input value={password} type="password" placeholder="********" id="password" name="password"/>

                <button type="submit"> Login </button>

            </form>
            
            <button className='link-btn' onClick={() => props.onFormSwitch('register')}> Don't have an account? Register here. </button>

        </div>
    )
}