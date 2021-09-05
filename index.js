const express = require('express')
const app = express()

const bodyParser = require('body-parser');

const DB = require('./Database/connection')

app.use(bodyParser.urlencoded({extended:false}))

app.set('view engine','ejs');


app.use(express.static(__dirname + '/public'));


app.get('/',(req,res)=>{
    
    res.render('index')
})

app.post('/update', async (req,res)=>{
    const pessoa ={
        nome: req.body.nome,
        sobrenome:req.body.sobrenome,
        cpf:req.body.cpf,
        data:req.body.data,
        sexo:req.body.sexo
    }
    const id = req.body.id 

await    DB.update(pessoa).where({id:id}).table('users').then(()=>{

        res.redirect('/lista')

    }).catch((err)=>{

        res.json(err)
    
    })
})


app.get('/editar/:id', async (req,res)=>{

    const id = req.params.id

    const result = await DB.select('*').where({id:id}).table('users')

    if(result != undefined){
        res.render('editar',{
            pessoas:result
        })
    }else{
        res.send('Usuario não encontrado')
    }

})

app.get('/lista/:sexo?', async (req,res)=>{

    const sexo = req.params.sexo

    if(sexo != undefined){

        const result =   await  DB.select('*').where({sexo:sexo}).table('users')

        res.render('lista',{
            pessoas:result
        })

    }else{
        
    const result =   await  DB.select('*').table('users')

        res.render('lista',{
            pessoas:result
        })
    }

        

})

app.post('/',async (req,res)=>{
    const pessoa ={
        nome: req.body.nome,
        sobrenome:req.body.sobrenome,
        cpf:req.body.cpf,
        data:req.body.data,
        sexo:req.body.sexo
    }

await    DB.insert(pessoa).table('users').then(()=>{
        res.redirect('/lista')

    }).catch((err)=>{

        res.json(err)
    
    })


})


app.listen(9897,() => console.log('http://localhost:9897'))