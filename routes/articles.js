const express = require('express')
const Article = require('./../models/article')
const router = express()


router.get('/new',function(req,res) {
    res.render('articles/new',{article : new Article() })
})

router.get('/edit/:id',async(req,res)=> {
    const article = await Article.findById(req.params.id)
    console.log(article)
    res.render('articles/edit',{article : article })
})


router.get('/:slug',async(req,res)=>{
    const article = await Article.findOne( {slug:req.params.slug })
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })
})

router.post('/',async(req,res)=>{
    let article = new Article({
        title: req.body.title,
        desc: req.body.description,
        markdown: req.body.markdown
    })
    try{
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
    }catch(e){
        console.log(e)
        res.render(`articles/new`,{article:article})
    }

})

router.post('/:id',async(req,res,next)=>{
    req.article = new Article()
    next()
},saveArticleAndRedirect('edit'))


router.put('/:id',async(req,res,next)=>{
    req.article = await Article.findById(req.params.id)
    next()
},saveArticleAndRedirect('edit'))


router.delete('/:id',async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticleAndRedirect(path){
    return (req,res) => {
        let article = req.article
            article.title = req.body.title,
            article.description=  req.body.description,
            article.markdown= req.body.markdown
        try{
            article = article.save()
            res.redirect(`/articles/${article.slug}`)
        }catch(e){
            console.log(e)
            res.render(`articles/${path}`,{article:article})
        }  
    }
}

module.exports = router