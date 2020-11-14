const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article')
const ArticleRouter = require('./routes/articles')
const app = express();
const methodOverride = require('method-override')


mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true ,useUnifiedTopology: true, createIndexes: true})


app.set('view engine','ejs')

app.use(express.urlencoded({extended: false }))
     
app.use(methodOverride("_method"));


app.get('/', async(req, res)=>{ 
  
    // const data = [{
    //     title: 'Test Article',
    //     createdAt: new Date(),
    //     description: 'Test Description'
    // },
    // {
    //     title: 'Test1 Article1',
    //     createdAt: new Date(),
    //     description: 'Test1 Description1'
    // }
    // ]
    const data = await Article.find().sort({createdAt: 'desc'})

    res.render('articles/index', {data:data}); 
    }); 

app.use('/articles',ArticleRouter)

app.listen(5000)