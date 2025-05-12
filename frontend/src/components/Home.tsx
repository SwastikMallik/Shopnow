import { useState, useEffect } from "react"
import Header from "./Header"

const Home = () => {
    const [product, setProduct] = useState([]);
    const [openModal, setOpenModal] = useState(false)
    const [selectionID, setSelectionID] = useState(null)
    const [data, setData] = useState({})
    const [error, setError] = useState({})


    const getAllProducts = async function(){
        const res = await fetch("http://localhost:5002/api/products")
                    .then((res)=>res.json())
                    .then((res)=>setProduct(res.data))     
    }
    //console.log(product, " products") 

    useEffect(()=>{
        getAllProducts()
    }, [])

    useEffect(()=>{
        const handleClickOutside = (event) =>{
            if(openModal && event.target.className=="modal"){
                setOpenModal(false)
            }
        }
        window.addEventListener("click", handleClickOutside)
        return () => window.removeEventListener("click", handleClickOutside)
    }, [openModal])

    //Edit Product detail

    // Get the modal
    const editFormModal = async function(id){
        setSelectionID(id)
        try{ 
            // fetch product data from DB using product ID
            const res = await fetch(`http://localhost:5002/api/products/${id}`)
            if(!res.ok){
                throw new Error(`Server error: ${res.status}`)
            } else {
                const resJson = await res.json()
                setData(resJson)
                setOpenModal(true)
            }
        } catch(error){
            console.log("Logs : ", error)
        }
        
    }
    //console.log("response data", data)
    const closeModal = function(){
        setOpenModal(false)
    }

    //edit form

    const handleChange = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        //console.log(`name: ${name} & value: ${value}`)
        setData((prev)=>({
            ...prev,
            [name]: value
        }))
    }

    const validationEditForm = function (){
        let logError = {}
        if(data.pname==""){
            logError.pname = "Product Name can't be blank"
            console.log("Product Name")
        } else if(data.category == ""){
            logError.category = "Please Select any category"
        } else if(data.quantity==0){
            logError.quantity = "Please add some quantity"
        } else if(data.price == 0){
            logError.price = "Please add some price"
        }

        setError(logError)
        console.log(error, "state error")
        return error
    }

    const editFormData = async (e) => {
        e.preventDefault();
        const errorLength = Object.keys(validationEditForm()).length
        if(errorLength == 0){
            console.log("ready form Update API call")
            try{
                const updatedFormData = await fetch(`http://localhost:5002/api/products/${data._id}`,{
                    method : "PUT",
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if(updatedFormData.ok){
                    const responseData = await updatedFormData.json()
                    setOpenModal(false)
                    console.log(responseData, "Form updated")
                    // Refresh product list after edit
                    getAllProducts()
                } else {
                    throw new Error(`${updatedFormData.status}`)
                }
            } catch(error){
                console.error("The error caused by", error)
            }
        }
    }
    return (
        <>
            <h1>Home Page</h1>
            <Header />
            {
                product.map(item=>
                    <ul className="ul-list" key={item._id}>
                        <li>{item.pname}</li>
                        <li>{item.category}</li>
                        <li>{item.quantity}</li>
                        <li>{item.price}</li>
                        <li><a onClick={editFormModal.bind(null, item._id)}>Edit</a></li>
                    </ul>
                )
            }
            
            { 
                openModal && (<div id="myModal" className="modal">

                    <div className="modal-content">
                        <span onClick={closeModal} className="close">&times;</span>
                        <p className="blck">{selectionID}</p>

                        <form onSubmit={editFormData}>
                            <input type="hidden" name="_id" defaultValue={data._id}/>
                            <label className="blck" htmlFor="pname">
                                Product Name : 
                            </label>
                            <input type="text" name="pname" id="pname" defaultValue={data.pname} onChange={handleChange}/><br/>
                            {
                                (error.pname) ? <p className="error-msg">{error.pname}</p>: ""
                            }
                            
                            <label className="blck" htmlFor="cat">
                                Category : 
                            </label>
                            <select name="category" id="cat" value={data.category} onChange={handleChange}>
                                <option>Select Category</option>
                                <option value="Cloth">Cloth</option>
                                <option value="Food">Food</option>
                                <option value="Beauty Product">Beauty Product</option>
                            </select><br/>
                            {
                                (error.category) ? <p className="error-msg">{error.category}</p>: ""
                            }
                            <label className="blck" htmlFor="quantity">
                                Quantity : 
                            </label>
                            <input type="text" name="quantity" id="quantity" defaultValue={data.quantity} onChange={handleChange}/><br/>
                            {
                                (error.quantity) ? <p className="error-msg">{error.quantity}</p>: ""
                            }
                            <label className="blck" htmlFor="price">
                                Price : 
                            </label>
                            <input type="text" name="price" id="price" defaultValue={data.price} onChange={handleChange}/>
                            {
                                (error.price) ? <p className="error-msg">{error.price}</p>: ""
                            }
                            <br/>
                            <br/>
                            <button> Submit </button>
                        </form>
                    </div>

                </div>) 
            }
        </>
    )
}

export default Home