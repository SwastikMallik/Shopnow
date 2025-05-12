import { useState } from "react"
import Header from "./Header"

const AddProduct = () => {
    const [product, setProduct] = useState({
        pname: "",
        category: "",
        quantity: 0,
        price: 0
    })

    const [error, setError] = useState({})

    const handleChange = (e) => {
        const {name, value} = e.target;

        setProduct((prev)=>({
            ...prev,
            [name]: value
        }))
    }

    const validateFormData = () => {
        const getErrors = {}
        if(!product.pname) getErrors.name="Product name can't be blank" 
        if(!product.category) getErrors.category="Product category can't be blank" 
        if(product.quantity==0) getErrors.quantity="Product quantity can't be blank"
        if(product.price == 0) getErrors.price="Product price can't be blank" 

        setError(getErrors)

        console.warn(getErrors)
        return getErrors
    }



    const saveProduct = async function(e){
        e.preventDefault();
        const valLength = Object.keys(validateFormData()).length
        if(valLength === 0){
            try{
                const res = await fetch("http://localhost:5002/api/products", {
                    method: 'post',
                    body: JSON.stringify(
                        product
                    ),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                
                const json = await res.json();
                if(json.status != 200){
                    throw new Error(`Error is ${json.status}`)
                }
                console.log(json);
            } catch(err) {
                console.error(`${err.status} Error message`);
            }
        } else {
            console.warn("Validation failed")
        }
    }
    return (
        <>
            <h1>Add Product Page</h1>
            <Header />
            <form style={styles.form} onSubmit={saveProduct}>
                <label>Product name:</label>
                <input type="text" name="pname" defaultValue={product.pname} onChange={handleChange}/>
                {
                   error.name && <div style={styles.error}>{error.name}</div>
                }
                <label>Select Category:</label>
                <select name="category" onChange={handleChange}>
                    <option>Select Category</option>
                    <option value="Cloth">Cloth</option>
                    <option value="Food">Food</option>
                    <option value="Beauty Product">Beauty Product</option>
                </select>
                {
                    error.category && <div style={styles.error}>{error.category}</div>
                }
                <label>Enter Quantity</label>
                <input type="number" name="quantity" defaultValue={product.quantity} onChange={handleChange} />
                {
                    error.quantity && <div style={styles.error}>{error.quantity}</div>
                }
                <label>Unit Price:</label>
                <input type="number" name="price" defaultValue={product.price} onChange={handleChange}/>
                {
                    error.price && <div style={styles.error}>{error.price}</div>
                }
                <button>Submit</button>
            </form> 
        </>
    )
}

const styles = {
    form: {
      display: "flex",
      flexDirection: "column",
      maxWidth: "400px",
      margin: "0 auto",
      gap: "10px",
    },
    error: {
      color: "red",
      fontSize: "0.8rem",
    },
  };

export default AddProduct