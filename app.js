const handlebars = require('express-handlebars');
const express = require('express');
const path = require('path');
//const conf = require('conf');
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
//const data = new conf();
app.use(express.json());
app.use(express.urlencoded({
 extended: false
}));
app.route('/login')
    .get((req, res) => {
        res.render('login', {
            field: 'value'
        })
    })
app.post((req, res) => {
    res.send('post request')
// some debug info
console.log(req.body);
document.getElementByID("login").submit();
});
app.listen(3000, () => {
console.log('express app running at http://localhost:3000/')
});