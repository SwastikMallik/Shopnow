import { useState } from 'react';
import Header from "../Header"

const Login = () => {
    const [loginData, setLoginData] = useState({
        emailid: "",
        password: ""
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLoginData((prev)=>{
            return {...prev, [name]: value}
        })
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        //const { email, password } = loginData
        console.log(loginData, "logindata")
        try{
            const response = await fetch('http://localhost:5002/login', {
                method: 'POST',
                credentials: "include", 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            if(response.ok){
                const data = await response.json()
                console.log(data, "data")
            } else {
                throw new Error('Failed to login')
            }
        } catch(err){
            console.log(err, " Login error")
        }
    }

    return (
        <>
            <h2>Welcome to Login Page</h2>
            <Header />
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="emailid" value={loginData.emailid} onChange={handleChange} required />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={loginData.password} onChange={handleChange} required />

                <button type="submit">Login</button>
            </form>

        </>
    )
}

export default Login