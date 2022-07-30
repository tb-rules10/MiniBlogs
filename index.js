const path = require('path');
const methodOverride = require('method-override')
const { v4: uuid } = require('uuid'); //For generating ID's
const express = require('express');
const app = express();


app.use(express.static(path.join(__dirname, 'public')))

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
// To parse incoming JSON in POST request body:
app.use(express.json())
// To 'fake' put/patch/delete requests:
app.use(methodOverride('_method'))
// Views folder and EJS setup:
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


// Our Blogs:
var data = require('./blogs.json');

var blogs = []
    for (let i =0; i<Object.getOwnPropertyNames(data).length; i++){
        blogs.push(data[i]);
    }


app.get('/featured', (req, res) => {
    var blogs = []
    for (let i =0;i<3;i++){
        blogs.push(data[i]);
    }
    res.render('featured', {blogs});
})


app.get('/', (req, res) => {
    res.render('home', {blogs});
})

app.get('/allblogs', (req, res) => {
    // var blogs = []
    // for (let i =0; i<Object.getOwnPropertyNames(data).length; i++){
    //     blogs.push(data[i]);
    // }
    res.render('allblogs', {blogs});
})

app.get('/allblogs/:id', (req, res) => {
    const { id } = req.params;
    const blog = blogs.find(c => c.num === parseInt(id));
    // const blog = blogs.find(c => c.num === num);
    // console.log(blog);
    res.render('blogBYid', {blog});
})

app.get('/allblogs/:id/edit', (req, res) => {
    const { id } = req.params;
    const blog = blogs[id];
    res.render('blogedit', { blog })
})

app.patch('/allblogs/:id', (req, res) => {
    const { id } = req.params;
    // const blog = blogs[id];
    // const foundBlog = comments.find(c => c.id === id);
    const blog = blogs.find(c => c.num === parseInt(id));
    const newblog = req.body.blog;

    blog.content = newblog;
    //redirect back to index (or wherever you want)
    res.redirect(`/allblogs/${id}`)
})


app.delete('/allblogs/:id', (req, res) => {
    const { id } = req.params;
    // console.log(typeof(id));
    blogs = blogs.filter(c => c.num !== parseInt(id));
    // console.log(blogs);
    // console.log(blogs);
    res.redirect('/');
})

app.get('/newblog', (req, res) => {
    res.render('newblog');
})

app.post('/allblogs', (req, res) => {
    // console.log(req.body)
    const { title, content } = req.body;
    num = blogs[blogs.length-1].num +1;
    blogs.push({ title, content, num })
    res.redirect('/');
})




app.post('/search', (req, res) => {
    // console.log(req.body);
    const{search:s} = req.body;
    var found = []
    console.log(s);
    var head = `Search results for: ${s}`;
    for(let blog of blogs){
        console.log(blog);
        if ((blog.title).includes(s)){
            // console.log('***********************');
            found.push(blog);
        }
    }
    if(found.length === 0){
        found.push({ content: '', title: 'Sorry, but nothing matched your search terms. Please try again with some different keywords.' });
        head = "Nothing Found";

    }
    console.log(found);
    res.render('search', {found,head})  
})


// blogs = blogs.filter(c => c.num !== parseInt(1));
// // console.log(blogs);
// console.log(blogs);

// var abcd = "hello i am me".toUpperCase;
// if (("ME").includes("Me".toUpperCase)){
//     console.log('***********************')
// }

// data = JSON.stringify(blogs);
// blogs = blogs.filter(c => c.num !== 6)
// console.log(blogs.filter(c => c[6] !== 6));

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
})