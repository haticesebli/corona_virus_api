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
    axios.get(url)
        .then(response => {
            const htmlData = response.data;
            const countryCases = getCountryCases(htmlData);
            const mainCases = getMainCases(htmlData);
            res.status(200).json({
                mainCases: mainCases,
                countryCases: countryCases
            });
        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        });
});

function getMainCases(html) {
    const data = []; // Boş bir array oluşturuyoruz
    const dom = new JSDOM(html); // Yeni bir JSDOM instanceı alıyoruz
    const cases = dom.window.document.querySelectorAll('.maincounter-number span'); // dom'dan gelen nodelar arasında gezerek o modülün içerisindeki maincounter classının icindeki span etiketlerini çekiyorum.
    const coronavirusCases = cases[0].textContent;
    const deaths = cases[1].textContent;
    const recovered = cases[2].textContent;
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
    return data;
}

function getCountryCases(html) {
    const data = [];
    const dom = new JSDOM(html);
    const countries = dom.window.document.querySelectorAll('.main_table_countries_div tbody tr');
    countries.forEach(function (country) {
        const cells = country.cells;
        data.push({
            country: cells[0].textContent,
            totalCases: cells[1].textContent,
            newCases: cells[2].textContent,
            totalDeaths: cells[3].textContent,
            newDeaths: cells[4].textContent,
            totalRecovered: cells[5].textContent,
            activeCases: cells[6].textContent,
            serious: cells[7].textContent
        });
    })
    return data;
}

app.listen(3000, () => {
    console.log('Uygulama çalıştırıldı...');
});
