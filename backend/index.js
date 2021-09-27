const http = require("http");
const app = require("./app");
const server = http.createServer(app);

// Modals
const User = require("./models/UserModel");

// Middlewares
const auth = require("./middleware/auth");

// Packages
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Server is Running!');
});

app.post("/user/login", async (req, res) => {
    try {
        // Get user input
        const {
            username,
            password
        } = req.body;

        // Validate user input
        if (!(username && password)) {
            return res.status(400).send("Invalid Inputs!");
        }

        // Validate if user exist in our database
        const user = await User.findOne({
            username
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign({
                    user_id: user._id,
                    username
                },
                process.env.TOKEN_KEY, {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json({"JWT": token});
        } else {
            res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        console.log(err);
    }
});

app.post("/create/user", async (req, res) => {
    try {
        // Get user input
        const {
            username,
            password,
            name,
            phone,
            isAdmin,
            parentID,
        } = req.body;

        // Validate user input
        if (!(username && password && name && phone && isAdmin && parentID)) {
            return res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        let oldUser = await User.findOne({
            username
        });

        if (oldUser) {
            return res.status(409).send("Username Already Exist.");
        }

        oldUser = await User.findOne({
            phone
        });

        if (oldUser) {
            return res.status(409).send("Phone Already Exist.");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            username: username.toLowerCase(),
            password: encryptedPassword,
            name: name,
            phone: phone,
            isAdmin: isAdmin,
            parentID: parentID,
        });

        // Create token
        const token = jwt.sign({
                user_id: user._id,
                username
            },
            process.env.TOKEN_KEY, {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json({"JWT": token});
    } catch (err) {
        console.log(err);
    }
});

app.post("/dashboard", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));