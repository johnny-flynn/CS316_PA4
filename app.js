const handlebars = require('express-handlebars');
const express = require('express');
const path = require('path');
const conf = require('conf');

/*const users = {
    username: {
        type: 'string'
    },
    email: {
        type: 'string'
    },
    password: {
        type: 'string'
    },
    phone: {
        type: 'number'
    }
};*/

const handlebars_inst = handlebars.create({
    extname: '.handlebars',
    compilerOptions: {
        prevenIndent: true
    },
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
});
const app = express();
app.engine('handlebars', handlebars_inst.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views', 'pages'));
// create our express app

// create our data store for user information
const data = new conf();
//data.set('email', 'test')
//data.set('username', 'test')
//data.set('password', 'test')
console.log(data.store)
app.use(express.json());
app.use(express.urlencoded({
 extended: false
}));
app.route('/new')
    .get((req,res) =>{
        res.sendFile(path.join(__dirname, 'new.html'));
    })
    .post((req, res) => {
       console.log(req.body); 

       const user = data.get(req.body.email);

       //Check that passwords match
       if (req.body.password !== req.body.verified_password) {
        res.json({
            message: 'passwords do not match'
        })
    }
       //Check if user already exists
       else if (user !== undefined){
           res.json({
               message: 'User already exisits'
           })
       }

       //send success
       else {
           //add user to store
           data.set(req.body.email, {
               username: req.body.name,
               email: req.body.email,
               password: req.body.password,
               phone: req.body.phone
           })
           res.json({
               message: 'success!'
           })
       }
    })


app.route('/user')
    .get((req,res) =>{
        res.render('user')
    })
app.route('/login')
    .get((req, res) => {
        res.status(200).sendFile(path.join(__dirname, 'login.html'));
    })
    .post((req, res) => {
        const user = data.get(req.body.email);
        console.log(user);
        //check that user exists
        if (user === undefined || user.password !== req.body.password) {
            res.json({
                message: 'email/password pair not found'
            })
        }
        //User exists
        else res.json({
            message: 'success!'
        })
    });

app.route('/user/:user_id')
    .get((req, res) => {
        res.send(req.params.user_id);
    })
app.post((req, res) => {
    res.send('post request')
// some debug info
console.log(req.body);
//document.getElementByID("login").submit();
});
app.listen(3000, () => {
console.log('express app running at http://localhost:3000/')
});