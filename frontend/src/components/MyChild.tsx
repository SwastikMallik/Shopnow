const MyChild = ({ products }) => {
    

    return (
        <>
            <h1>Child Page</h1>
            <div onClick={()=> console.log("Hello, this is child")}>
                My event
            </div>
            <div onClick={products}>
                My click
            </div>
        </>
    )
}

export default MyChild