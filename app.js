const handlebars = require('express-handlebars');
const express = require('express');
const path = require('path');
const conf = require('conf');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const uuidv4 = require('uuid/v4');


const users = {
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
    },
    id: {
        type: 'string'
    }
};

const handlebars_inst = handlebars.create({
    extname: '.handlebars',
    compilerOptions: {
        prevenIndent: true
    },
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
});
const app = express();
app.use(cookieParser('secret'));
app.use(session({ secret: 'secret' }));
app.use(flash());
app.engine('handlebars', handlebars_inst.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views', 'pages'));

// create our data store for user information
const data = new conf(users);
console.log(data.store)
app.use(express.json());
app.use(express.urlencoded({
 extended: false
}));
app.get('/login', function (req, res) {
    res.status(200).render('login')
  })
app.get('/new', function (req, res) {
    res.status(200).render('new')
  })
app.route('/new')
    .get((req,res) =>{
        res.status(200).sendFile(path.join(__dirname, 'new.html'));
    })
    .post((req, res) => {
       console.log(req.body); 

       const email = data.get(req.body.email);
       const username = data.get(req.body.name);

       //Check that passwords match
       if (req.body.password !== req.body.verified_password) {
           res.status(406).render('new', {
               passmatch: {
                   level: 'warning',
                   title: '406',
                   message: 'Passwords do not match'
               }
           })
    }
       //Check if user already exists
       else if (email !== undefined){
           res.status(406).render('new', {
               emailuse: {
                   level: 'warning',
                   title: '406',
                   message: 'Email already in use!'
               }
           })
       }

       //Check if user already exists
       else if (username !== undefined){
            res.status(406).render('new', {
                userexists: {
                    level: 'warning',
                    title: '406',
                    message: 'User already exists!'
                }
            })
        }       

       //send success
       else {
           newuser = uuidv4();
           //add user to store
           data.set(newuser, {
               username: req.body.name,
               email: req.body.email,
               password: req.body.password,
               phone: req.body.phone,
               id: newuser
           })

           res.status(201).redirect('login')
       }
    })


app.route('/user')
    .get((req, res) => {
        res.status(404).json({
            message: '404 page does not exist'
        })
    });

app.route('/login')
    .get((req, res) => {
        res.status(200).sendFile(path.join(__dirname, 'login.html'));
    })
    .post((req, res) => {
        allusers = Object.values(data.store);
        console.log('store', Object.values(data.store));
        const user = allusers.find(user => user.email === req.body.email)
        console.log(user);
        //check that user exists
        if (user === undefined || user.password !== req.body.password) {
            res.status(401).render('login', {
                login: {
                    level: 'danger',
                    title: '401',
                    message: 'Incorrect email/password!'
                }
            })
        }
        //User exists
        else res.status(202).redirect(`/user/${user.id}`)
    });

app.route('/user/:user_id')
    .get((req,res) =>{
        const user = data.get(req.params.user_id)
        res.status(202).render('user', {
            name: user.username,
            email: user.email,
            phone: user.phone,
            updated: true
        })
    })
    .post((req, res) => {
        console.log(req.body); 
 
        const user = data.get(req.params.user_id);
        grabemail = user.email
        const email = data.get(grabemail);
 
            //add user to store
            data.set(req.params.user_id, {
                username: req.body.name,
                email: req.body.email,
                password: user.password,
                phone: req.body.phone,
                id: req.params.user_id
            })
        });
app.post((req, res) => {
    res.send('post request')
// some debug info
console.log(req.body);
});
app.listen(3000, () => {
console.log('express app running at http://localhost:3000/')
});