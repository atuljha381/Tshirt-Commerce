
import React, { useState } from 'react'

export const Register = (props) => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email, username, password)
    }

    return (
        <div className='auth-form-container'>
            <h2>Register</h2>
            <form className='register-form' onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input value={email} type="email" placeholder="email@mail.com" id="email" name="email"/>

                <label htmlFor="username">Username</label>
                <input value={username} type="username" placeholder="username" id="username" name="username"/>

                <label htmlFor="password">Password</label>
                <input value={password} type="password" placeholder="********" id="password" name="password"/>

                <button type="submit"> Register </button>

            </form>

            <button className='link-btn' onClick={() => props.onFormSwitch('login')}> Already have an account? Login here. </button>

        </div>
    )
}