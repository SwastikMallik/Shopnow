require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { setToken } = require("./service/auth")
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const authenticateToken = require('./middlewares/authMiddleware');
const secretcode = process.env.JWT_SECRET_KEY

mongoose.connect('mongodb+srv://swastik25:Mongodb2520@no-sql-learning.wfhnsdu.mongodb.net/?retryWrites=true&w=majority&appName=no-sql-learning')
.then((result) => console.log('connected to db'))
.catch((err) => console.log(err));

const User = require("./models/User");

const productRouter = require("./routes/Product")

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
//app.use(cors({ origin: "http://localhost:5173", allowedHeaders: ['Content-type', 'application-json'] }));
app.use(cors({origin: 'http://localhost:5173', credentials: true})); //while accessing the cookies from the browser alway use specific origin and credentials: true
app.use(cookieParser());


//Product

app.get("/", (req, res)=>{
    console.log(req)
    const newRes = {
        status : 200,
        data : `Hello, Welcome to MegaFarm`,
        message : "No new message"
    }
    res.send(newRes)
})

app.use('/api/products', productRouter)

//User

app.post("/signup", async (req, res)=>{
    const {username: uname, emailid: eid, password: pswd, terms} = req.body
    let error = {}


    //Username validation
    if(!uname || uname.length < 4){
        error.username = "Username should minimum length of 4"
    }
    
    //Email id validation
    if(!eid){
        error.emailid = "Email can't be empty"
    } else {
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (regex.test(eid)) {
            console.log("Valid Email address");
        } else {
            error.emailid = "Invalid Email address"
            console.log("Invalid Email address");
        }
    }

    //Password validation
    if (!pswd || pswd.length < 8) {
        error.password = "Password must be at least 8 characters long";
    } else {
        const hasLowerCase = /[a-z]/.test(pswd);
        const hasUpperCase = /[A-Z]/.test(pswd);
        const hasNumber = /[0-9]/.test(pswd);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pswd);
        const pswdStatus = { hasLowerCase, hasUpperCase, hasNumber, hasSpecialChar };
      
        if (!(hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar)) {
          error.password = "Password must contain at least 1 uppercase, 1 lowercase, 1 numeric, and 1 special character";
          error.pswdStatus = pswdStatus
        } else {
          console.log("Password is valid");
        }
    }

    //Terms & condition status Validation
    if(!terms){
        error.terms = "Please accept the terms & conditions for successful signup"
    }
      

    if(Object.keys(error).length != 0){
        return res.status(400).json({ errors: error });
    }
    
    //Save the User in Database
    //Hashing the password
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(pswd, saltRounds);
        req.body.password = hash
        const result = await User.insertOne(req.body)
        res.status(201).json({ success: true, data: result })
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: err })
    }
})

app.get("/api/profile", authenticateToken, async (req, res)=>{
    console.log(req.user, 'User Profile')
    const userId = req.user.user_id; // or whatever key you encoded in the JWT

    // Now you can use userId to fetch from DB, etc.
    const user = await User.findById(userId);
    res.json(user);
})

app.post('/login', async (req, res) => {
    console.log(secretcode, 'Inner HTML')

    //Identification of user
    const { emailid, password } = req.body
    const userData = await User.findOne({ emailid: emailid })
    console.log(userData)
    if(userData){
        try{
            // Authentication/Password validation (bcrypt.compare will again hash the password and compare it with the stored hash)
            // Another way to valided and handle, bcrypt.compare('userInputPassword', 'storedHash', (err, result) => {}) but its not recommended and don't combine both because this won't return promise so meaning of using await
            const isValidPassword = await bcrypt.compare(password, userData.password)
            if(isValidPassword){
                //const token = jwt.sign({ _id: userData._id }, process.env.SECRET_KEY
                const token = setToken(userData._id)
                console.log('Password Matched', token)
                // Set Cookie and save token safely
                res.cookie("jwt_token", token, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000
                })
                return res.status(200).json({message: 'Login Success'})
            } else {
                throw new Error("Password doesn't matched")
            }
        } catch(error){
            console.log(error)
            return res.status(401).json({message: 'Invalid Credentials'})
        }
    } else {
        return res.status(401).json({ error: "User not found" });
    }
    
})

app.listen(5002)