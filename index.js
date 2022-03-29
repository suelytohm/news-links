const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;


let Parser = require('rss-parser');
let parser = new Parser();
let conteudo = "";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.set('view engine', 'html');


app.post('/api/noticia', async (req, res) => {
    let categoria = req.body.categoria
    let titulo = req.body.titulo
    let capa = req.body.capa
    let link = req.body.link

    const resultado = await salvarNoticia(categoria, titulo, capa, link)
    res.json(resultado)

})


app.get('/api/hoje', async(req, res) => {
    const news = await pegarNoticias()
    res.json(news)
})


app.get('/api/atualizar', async(req, res) => {
    atualizar()
    res.json({"status": "ok"})
})




async function atualizar(){

    let feed = await parser.parseURL('https://g1.globo.com/rss/g1/economia/');


    feed.items.forEach(item => {

        let img = item.content.slice(item.content.indexOf('<img src="'),item.content.indexOf(">") -3)
        
        if(img.length > 0){
            conteudo = conteudo + item.title + ' - ' +  img + "\n\r"
            // salvarNoticia("Economia", item.title, img, item.link)
            img = img.replace('<img src="', "")
            salvarNoticia("Economia", item.title, img, item.link)    
        }

        else{
            conteudo = conteudo + item.title + "\n\r"
            salvarNoticia("Economia", item.title, "", item.link)
        }
    });    
}



function pegarNoticias(){

    try {
        return connectionBanco("SELECT * FROM news WHERE visivel = 'S' and dataPostagem = curdate() ORDER BY id DESC;")
    } catch (error) {
        
    }
}


function salvarNoticia(categoria, titulo, capa, link){
    try {
        return connectionBanco(`INSERT INTO news (categoria, titulo, capa, link, dataPostagem) VALUES ('${categoria}', '${titulo}', '${capa}', '${link}', CURDATE());`)
    } catch (error) {
        
    }
}


function connectionBanco(sqlQry){
    return new Promise((resolve, reject) => {

        const connection = mysql.createConnection({
            host     : 'sql10.freemysqlhosting.net',
            port     : 3306,
            user     : 'sql10450242',
            password : 'uVxfyAa5ic',
            database : 'sql10450242'
          });

          connection.query(sqlQry, function(error, results, fields){
            if(error) {
                console.log("erro");

                reject(
                    error
                )                
            }
            else{
                console.log(results);
                resolve(
                    results
                )
                connection.end();
            }
              
        });
    })
}



app.listen(port, function(req, res){
    console.log("Server listening on port " + port)
})