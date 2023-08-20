
import React, { useState } from 'react'

export const Register = (props) => {
    const [phone, setPhone] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className='auth-form-container'>
            <h2>Register</h2>
            <form className='register-form' onSubmit={handleSubmit}>
                <label htmlFor="phone">Phone</label>
                <input value={phone} type="phone" placeholder="+91-XXXXX-XXXXX" id="phone" name="phone"/>

                <button type="submit"> Sign Up </button>

            </form>

            <button className='link-btn' onClick={() => props.onFormSwitch('login')}> Already have an account? Login here. </button>

        </div>
    )
}