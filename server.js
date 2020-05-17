const express = require("express")
const server = express()

server.use(express.static('public'))

const Pool = require("pg").Pool
const db = new Pool({
    user: 'postgres',
    password: 'diazz',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})


server.use(express.urlencoded({ extended: true}))

const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


server.get("/", function(req, res){
    
    db.query("SELECT * FROM donors", function(err, result){
       if (err) return res.send("Erro de banco de dados.")
       
        const donors = result.rows;
       return res.render("index.html", {donors})

    })
    
})


server.post("/", function(req,res){
    //pegar dados do formulário.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // Verificar se algum campo está vazio.
    
    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    //colocar valores dentro do banco de dados (criado o banco de dados e a conexão db)
    const query = `
            INSERT INTO donors ("name","email","blood")
            VALUES ($1, $2, $3)`
    
    const values = [name, email, blood]

    db.query(query, values, function(err) {
        if (err) return res.send("erro no banco de dados")


        return res.redirect("/")

    })
      


})


// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function(){
    console.log("iniciei o servidor");    
})