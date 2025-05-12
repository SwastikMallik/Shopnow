import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import AddProduct from './components/AddProduct'
import Signup from './components/Login/Signup'
import Login from './components/Login/Login'

function App() {
  const router = createBrowserRouter([
    {
      path : '/',
      element : <Home />
    },
    {
      path : 'dashboard/add-product',
      element : <AddProduct />
    },
    {
      path : 'signup',
      element :<Signup />
    },
    {
      path : 'login',
      element : <Login />
    }
  ])
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
