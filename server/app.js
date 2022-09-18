import { connectDatabase } from "./config/database.js";
import  bodyParser  from  "body-parser";
import  express  from  "express"
import  bcrypt  from  "bcryptjs"
import cors from "cors"
import { v4  as  uuidv4 } from  'uuid';
import { generateJWT } from  "./middleware/jwtGenerator.js";
import { auth } from  "./middleware/auth.js"

const  pool = connectDatabase()
const  app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended:  true }))

pool.connect((err) => {
	if (err) {
		console.log(err)
	}
	else {
		app.listen(PORT, () => {
			console.log(`Server has started on http://localhost:${PORT}`)
		})
	}
})

app.post('/register', async (req, res) => {
    try {

        //take the email and password from the req.body
        const {
            email,
            password,
            first_name, 
            last_name
        } = req.body
        //Check if the user is already existing
        const user = await pool.query(`SELECT * FROM users WHERE
        email = $1`, [email])

        if (user.rows.length > 0) {
            res.status(401).send("User already exists")
        }

        //Setup Bcrypt for password hashing

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        //Add the new user into the database
        //generate the uuid using the uuidv4() function
        const newUser = await pool.query(`
        INSERT INTO users (uuid, email, first_name, last_name, password)
        VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [uuidv4(), email, first_name, last_name, bcryptPassword])

        //generate and return the JWT token
        const token = generateJWT(newUser.rows[0])

        res.json({
            token
        })
    } catch (error) {

        console.log(error.message)
        res.status(500).send(error.message)
    }

})

app.post('/login', async (req, res) => {
    try {

        //take the email and password from the req.body
        const {
            email,
            password
        } = req.body;

        //Check if the user is not existing
        const user = await pool.query(`SELECT * FROM users WHERE
        email = $1`, [email])

        if (user.rows.length < 0) {
            res.status(401).send("User does not exists")
        }

        //Check if the password matches using bcrypt
        const validPassword = await bcrypt.compare(password, user.rows[0].password)
        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect")
        }

        //generate and return the JWT
        const token = generateJWT(user.rows[0])
        res.json({
            token
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            msg: "Unauthenticated"
        });
    }
})

// provide the auth middleware
app.get('/verify', auth, async (req, res) => {
    try {

        //return the user object
        res.json(req.user)
    } catch (error) {
        console.error(err.message);
        res.status(500).send({
            msg: "Unauthenticated"
        });
    }
})
