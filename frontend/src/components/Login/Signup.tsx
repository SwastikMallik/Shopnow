import { useEffect, useState } from "react"
import Header from "../Header"

const Signup = () => {

    const [data, setData] = useState({})
    const [error, setError] = useState({})

    function handleOnChange(event){
        const{name, value, checked, type} = event.target
        
        console.log(`Name : ${name}, Value: ${value}, Checked: ${checked}, Type: ${type}`)
        
        setData((prev)=>({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
        
    }

    function validationFormData(){
        if(!data.terms) 
            {
                error.terms = false
            } else {
            setError((prev)=>{
                const {terms, ...rest} = prev
                return rest
            })}
        if(error.confirmpassword) {error.confirmpassword = false} else {
            setError(()=>{
                const {confirmpassword, ...rest} = error
                return rest
            })
        }
        console.log(123)
        return error
    }

    function comparePassword(e) {
        const confirmPassword = e.target.value;
    
        if (!data.password) {
            setError(prev => ({
                ...prev,
                password: "Please Enter Password"
            }));
        }
    
        if (data.password !== confirmPassword) {
            setError(prev => ({
                ...prev,
                confirmpassword: "Passwords do not match"
            }));
            setData((prev)=>{
                const {password, ...rest} = prev
                return rest
            });
        }
        console.log(321)
    }
    

    useEffect(()=>{
        console.log(data)
    },[data])

    const handleSubmitSignupForm = async (event) => {
        event.preventDefault();
        const logErr = Object.keys(validationFormData()).length
        if(!logErr){
            const {cpassword, ...rest} = data
            const userData = rest
            try{
                //Call the API
                const apiCall = await fetch('http://localhost:5002/signup',{
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                })
                if(apiCall.ok){
                    const response = await apiCall.json()
                    console.log(response)
                } else {
                    throw new Error("Something went wrong")
                }
                
                console.log("hurray you are In now", userData)
            } catch(error){
                console.error(`These are the following error, ${error}`)
            }
            
        }
        console.log("Submit and run", logErr)
    }

    return (
        <>
            <h2>Welcome to Signup Page</h2>
            <Header/>
            <form onSubmit={handleSubmitSignupForm}>
                <label htmlFor="uname">Username</label><br/>
                <input type="text" id="uname" name="username" value={data.name} onChange={handleOnChange}/><br/>

                <label htmlFor="email">Email ID</label><br/>
                <input type="email" id="email" name="emailid" value={data.email} onChange={handleOnChange}/><br/>

                <label htmlFor="password">Password</label><br/>
                <input type="password" id="password" name="password" value={data.password || ""} onChange={handleOnChange}/><br/>
                <p>
                    {error.confirmpassword && <strong>{error.confirmpassword}</strong>}
                </p>

                <label htmlFor="cpassword"> Confirm Password </label><br/>
                <input type="password" id="cpassword" name="cpassword" value={data.cpassword} onChange={handleOnChange} onBlur={comparePassword}/>
                <br/>
                <br/>
                <button>Signup</button> 
                <button>Reset</button>
                <br/>
                <br/>
                <input type="checkbox" id="terms" name="terms" onChange={handleOnChange}/>
                <label htmlFor="terms"> Terms & Conditions</label><br></br>
            </form>
        </>
    )
}

export default Signup