import { Link } from "react-router-dom";

const Nav = () => {
    return (
        <>
            <div>
                <ul className="nav-list">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                    <li><Link to="/dashboard/add-product">Add Product</Link></li>
                </ul>
            </div>
        </>
    )
}

export default Nav;