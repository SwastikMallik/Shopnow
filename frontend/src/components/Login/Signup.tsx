import { useEffect, useState, useRef } from "react"
import Header from "../Header"

const Signup = () => {

    const [data, setData] = useState({})
    const [error, setError] = useState({})
    const passwordRef = useRef(null)
    const thankyouRef = useRef()
    const thankYouMessage = "User Inserted Successfully"

    function handleOnChange(event){
        const { name, value, checked, type } = event.target;
        // If there's an error for this field, remove it
        setError((prev) => {
            let rest;
          
            if (name === "terms") {
              const { terms, termsMessage, ...remaining } = prev;
              rest = remaining;
            } else {
              const { [name]: _, ...remaining } = prev;
              rest = remaining;
            }
          
            return rest;
          });
        
        console.log(`Name : ${name}, Value: ${value}, Checked: ${checked}, Type: ${type}`)
        
        setData((prev)=>({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
        
    }

    function validationFormData(){
        //Terms Validation

        const errorObj = {}
        if(data.terms){
            //After the terms get loaded in the data state, need to remove it validation error from the error state
            if(error.terms){
                setError((prev)=>{
                    const {terms, termsMessage, ...rest} = prev
                    return rest

                })
            }
        } else {
            errorObj.termsMessage = "Please accept the terms and conditions"
            setError((prev)=>({
                ...prev,
                terms: false,
                termsMessage: errorObj.termsMessage
            }))
        }
        return errorObj
        
    }

    function comparePassword(e) {
        const confirmPassword = e.target.value;
    
        if (!data.password) {
            setError(prev => ({
                ...prev,
                password: "Please Enter Password"
            }));
            passwordRef.current?.focus()
        }
    
        if (data.password !== confirmPassword) {
            setError(prev => ({
                ...prev,
                confirmpassword: "Passwords do not match"
            }));
            setData((prev)=>{
                const {password, confirmpassword, ...rest} = prev
                return rest
            });
            passwordRef.current?.focus()
        }
    }
    

    useEffect(()=>{
        console.log(data, "data")
        console.log(error, "error effect")
    },[data, error])

    const handleReset = () => {
        setData({})
        setError({})
    }

    const handleSubmitSignupForm = async (event) => {
        event.preventDefault();
        const logErr = Object.keys(validationFormData()).length
        if(logErr < 1){
            try{
                //Call the API
                const apiCall = await fetch('http://localhost:5002/signup',{
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(data, (key, value)=>
                        (key==="confirmpassword") ? undefined : value
                    )
                })
                if(apiCall.ok){
                    const response = await apiCall.json()
                    console.log(response)
                    alert("Signup Successfull")
                    setData({})
                    thankyouRef.current.style.display = "block"
                } else if(apiCall.status === 400){
                    const errResponse = await apiCall.json();
                    const updatedErrors = {}

                    //Check if the error is already present in the state
                    const fields = [ 'username', 'emailid', 'password' ]

                    fields.forEach((field) => {
                        if (errResponse.errors?.[field]) {
                          updatedErrors[field] = errResponse.errors[field];
                        }
                      });
                    //Reset Data from the State

                    setData((prev) => {
                        const errkey = Object.keys(updatedErrors);
                        return Object.keys(prev).reduce((acc, key) => {
                          if (!errkey.includes(key)) {
                            acc[key] = prev[key];
                          }
                          return acc;
                        }, {});
                      });
                    

                    setError((prev)=>({
                        ...prev,
                        ...updatedErrors
                    }))
                } else {
                    throw new Error(`Unexpected error (${apiCall.status}): ${apiCall.statusText}`)
                }
            } catch(error){
                console.error(`These are the following error, ${error}`)
            }
            
        }
    }

    return (
        <>
            <h2>Welcome to Signup Page</h2>
            <Header/>
            <form onSubmit={handleSubmitSignupForm}>
                <label htmlFor="uname">Username</label><br/>
                <input type="text" id="uname" name="username" value={data.username || ''} onChange={handleOnChange}/><br/>
                {error.username && <span><strong>{error.username}</strong><br/></span>}

                <label htmlFor="email">Email ID</label><br/>
                <input type="text" id="email" name="emailid" value={data.emailid || ''} onChange={handleOnChange}/><br/>
                {error.emailid && <span><strong>{error.emailid}</strong><br/></span>}

                <label htmlFor="password">Password</label><br/>
                <input type="password" id="password" ref={passwordRef} name="password" value={data.password || ''} onChange={handleOnChange}/><br/>
                <p>
                    {error.confirmpassword && <strong>{error.confirmpassword}</strong>}
                    {error.password && <span><strong>{error.password}</strong><br/></span>}
                </p>

                <label htmlFor="cpassword"> Confirm Password </label><br/>
                <input type="password" id="cpassword" name="confirmpassword" value={data.confirmpassword || ''} onChange={handleOnChange} onBlur={comparePassword}/>
                <br/>
                <br/>
                <button>Signup</button> 
                <button onClick={handleReset}>Reset</button>
                <br/>
                <br/>
                <input type="checkbox" id="terms" name="terms" onChange={handleOnChange}/>
                <label htmlFor="terms"> Terms & Conditions</label><br/>
                { error.termsMessage && <span><strong>{error.termsMessage}</strong></span> }
                <br/>
            </form>
            <div ref={thankyouRef} className="thank-you-message">
                <h2>
                    {thankYouMessage}
                </h2>
            </div>
        </>
    )
}

export default Signup