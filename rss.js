let Parser = require('rss-parser');
const fs = require('fs')
const mysql = require('mysql')

let parser = new Parser();
let conteudo = "";

(async () => {
        
    // SUNO = https://www.suno.com.br/noticias/feed/
  
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

})();


function salvarNoticia(categoria, titulo, capa, link){
    return connectionBanco(`INSERT INTO news (categoria, titulo, capa, link, dataPostagem) VALUES ('${categoria}', '${titulo}', '${capa}', '${link}', CURDATE());`)
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

