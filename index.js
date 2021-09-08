const express = require('express')
const app = express()

const bodyParser = require('body-parser');

const DB = require('./Database/connection');
const { Knex } = require('knex');

app.use(bodyParser.urlencoded({extended:false}))

app.set('view engine','ejs');

const session = require('express-session')


app.use(session({
    secret:'askdjshljashdjaskdhjasdala',
   
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))



app.use(express.static(__dirname + '/public'));

function Trava(req,res,next){
    
    try {
        if(req.session.User != undefined){
            next();
        }else{
            res.redirect('/')
        }
    } catch (error) {
        res.redirect('/')

    }
}


app.get('/',(req,res)=>{
    
    res.render('index',{
        err:false,
        msg:''
    })
})

app.get('/hola',(req,res)=>{
    req.session.User={
        log:true,
        msg:'Andre Barna'
    }
    res.redirect('/lista')
})



app.post('/delete',async (req,res)=>{
    const cpf = req.body.delete
    try {
        await DB.select('*').where({cpf:cpf}).delete().table('users')

        res.redirect('/lista')     
    } catch (err) {
        res.json(err)
    }


})
app.post('/login3',async (req,res)=>{

    const {nome,cpf} = req.body
    const msg = 0 
    const err = false 

   const result =  await DB.select('*').where({cpf:cpf}).table('users')

   if(result.length <= 0){
       res.render('Login',{
           err:true,
           msg:'Usuario Não encontrado'
       })
   }else{
       if(result[0].cpf == cpf){
            if(result[0].nome== nome){
                req.session.User={
                    log:true,
                    msg:nome
                }
                res.redirect('/lista')
            }else{
                res.render('Login',{
                    err:true,
                    msg:'Nome Invalido'
                })
            }
       }else{
        res.render('Login',{
            err:true,
            msg:'Cpf Invalido '
        })
       }
   }

   res.json(result)
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


app.get('/editar/:id', Trava,async (req,res)=>{

    const id = req.params.id

    const result = await DB.select('*').where({id:id}).table('users')

    if(result != undefined){
        res.render('editar',{
            pessoas:result,
        })
    }else{
        res.send('Usuario não encontrado')
    }

})

app.get('/lista/:sexo?',Trava, async (req,res)=>{
    

    const sexo = req.params.sexo


    
       const log = Boolean(req.session.User.log)
    const  msg = req.session.User.msg

    

    if(sexo != undefined){

     

        const result =   await  DB.select('*').where({sexo:sexo}).table('users')

        res.render('lista',{
            pessoas:result,
            log:log,
            user:msg
        })

    }else{
        
    const result =   await  DB.select('*').table('users')
        res.render('lista',{
            pessoas:result,
            log:log,
            user:msg
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