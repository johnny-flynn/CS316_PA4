const express = require('express');
const path = require('path');
const conf = require('conf');
// create our express app
const app = express();
// create our data store for user information
const data = new conf();
app.use(express.json());
app.use(express.urlencoded({
 extended: false
}));
app.route('/login')
.get((req, res) => {
res.sendFile(path.join(__dirname, 'login.html'));
})
.post((req, res) => {
// some debug info
console.log(req.body);
// TODO implement me
});
app.listen(3000, () => {
console.log('express app running at http://localhost:3000/')
});