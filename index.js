const http = require('http');
const express = require('express');
const app = express();
const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const url = 'https://www.worldometers.info/coronavirus/';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.write('Merhaba Dünya!');
    res.end();
});

app.get('/', (req, res, next) => {
    res.send('Merhaba Dünya!');
    axios.get(url)
        .then(response => {
            getNodes(response.data);
        })
        .catch(error => {
            console.error(error);
        });
});

app.listen(3000, () => {
    console.log('Uygulama çalıştırıldı...');
});

function getNodes(html) {
    const data = []; // Boş bir array oluşturuyoruz
    const dom = new JSDOM(html); // Yeni bir JSDOM instanceı alıyoruz
    const numbers = dom.window.document.querySelectorAll('.maincounter-number span'); // dom'dan gelen nodelar arasında gezerek o modülün içerisindeki a etiketlerini çekiyorum.
    const coronavirusCases = numbers[0].textContent;
    const deaths = numbers[1].textContent;
    const recovered = numbers[2].textContent;
    data.push({
        title: "Corona Virus Cases",
        content: coronavirusCases
    }, {
        title: "Deaths",
        content: deaths
    }, {
        title: "Recovered",
        content: recovered
    });
    console.log(data); // Arrayin son halini yazdırıyorum. Burada elinize gelen data ile ne yapacağınız size kalmış :)
}
