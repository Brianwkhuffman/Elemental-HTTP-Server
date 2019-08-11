const http = require('http');
const fs = require('fs');
const PORT = 8080;
const querystring = require('querystring');
let date = new Date().toUTCString();
const admin = {
    bri: 'password',
}

const server = http.createServer((req, res) => {
    // console.log(req);
    // console.log('reqmethod', req.method);
    // console.log('requrl', req.url);
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('error', (error) => {
        console.error(error);
    })
    req.on('end', () => {
        let urlType;
        let URL = req.url;
        // GET METHOD
        if (req.method === 'GET') {
            if (req.url === '/' || req.url === '') {
                urlType = 'html';
                URL = '/index.html';
            } else {
                urlType = req.url.split('.');
                urlType = urlType[1];
            }
            fs.readdir(`./public/`, (err, files) => {
                if (files.includes(URL.slice(1)) === false) {
                    URL = `/404.html`;
                    urlType = 'html';
                }
                fs.readFile(`./public${URL}`, (err, data) => {
                    if (err) {
                        return console.log('Could not write the file.');
                    }
                    res.writeHead(200, {
                        'Date': `${date}`,
                        'Content-Type': `text/${urlType}`,
                        'Content-Length': data.toString().length,
                    })
                    res.write(data.toString());
                    res.end();
                })
            })

        }
        // POST METHOD
        if (req.method === 'POST') {
            if (req.url === '/elements') {
                let parsedInfo = querystring.parse(body);
                const template = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>The Elements - ${parsedInfo.elementName}</title>
<link rel="stylesheet" href="/styles.css">
</head>
<body>
    <h1>${parsedInfo.elementName}</h1>
    <h2>${parsedInfo.elementSymbol}</h2>
    <h3>${parsedInfo.elementAtomicNumber}</h3>
    <p>${parsedInfo.elementDescription}</p>
    <p><a href="/">back</a></p>
</body>
</html>`;
                fs.writeFile(`./public/${parsedInfo.elementName}.html`, template, (err) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('Filed Saved!');
                })
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
                let newFiles = []
                fs.readdir('./public/', (err, files) => {
                    for (let i = 0; i < files.length; i++) {
                        if (files[i] !== '.keep' && files[i] !== '404.html' && files[i] !== 'css' && files[i] !== 'index.html' && files[i] !== 'styles.css') {
                            newFiles.push(files[i]);
                        };
                    };
                    let newIndex = `<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                        <meta charset="UTF-8">
                        <title>The Elements</title>
                        <link rel="stylesheet" href="/styles.css">
                    </head>
                    
                    <body>
                        <h1>The Elements</h1>
                        <h2>These are all the known elements.</h2>
                        <h3>These are ${newFiles.length} of them.</h3>
                        <ol>`;
                    for (let i = 0; i < newFiles.length; i++) {
                        let newList = `<li>
                        <a href="/${newFiles[i]}">${newFiles[i].split('.')[0]}</a>
                    </li>`;
                        newIndex += newList;
                    };
                    let htmlEnd = `    </ol>
                    </body>
                    
                    </html>`;
                    fs.writeFile('./public/index.html', newIndex + htmlEnd, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log('Index.html updated!');
                    });
                });
                res.end();
            };
        }
        // DELETE METHOD
        if (req.method === 'DELETE') {
            fs.readdir(`./public/`, (err, files) => {
                if (files.includes(URL.slice(1)) === false) {
                    res.writeHead(500, {
                        'Date': `${date}`,
                        'Content-Type': `application/json`,
                    });
                    res.write(`{ "error" : "resource ${URL} does not exist" }`)
                    res.end();
                }
                fs.unlink(`./public${URL}`, (err) => {
                    if (err) {
                        return console.log(err);
                    }
                    let newFiles = []
                    fs.readdir('./public/', (err, files) => {
                        for (let i = 0; i < files.length; i++) {
                            if (files[i] !== '.keep' && files[i] !== '404.html' && files[i] !== 'css' && files[i] !== 'index.html' && files[i] !== 'styles.css') {
                                newFiles.push(files[i]);
                            };
                        };
                        let newIndex = `<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                        <meta charset="UTF-8">
                        <title>The Elements</title>
                        <link rel="stylesheet" href="/styles.css">
                    </head>
                    
                    <body>
                        <h1>The Elements</h1>
                        <h2>These are all the known elements.</h2>
                        <h3>These are ${newFiles.length} of them.</h3>
                        <ol>`;
                        for (let i = 0; i < newFiles.length; i++) {
                            let newList = `<li>
                        <a href="/${newFiles[i]}">${newFiles[i].split('.')[0]}</a>
                    </li>`;
                            newIndex += newList;
                        };
                        let htmlEnd = `    </ol>
                    </body>
                    
                    </html>`;
                        fs.writeFile('./public/index.html', newIndex + htmlEnd, (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log('Index.html updated!');
                        });
                    });
                });
                res.end();
            });
        };
        // PUT METHOD
        if (req.method === 'PUT') {
            fs.readdir(`./public/`, (err, files) => {
                if (files.includes(URL.slice(1)) === false) {
                    res.writeHead(500, {
                        'Date': `${date}`,
                        'Content-Type': 'application/json',
                    });
                    res.write(`{ "error" : "resource ${URL} does not exist" }`);
                    res.end()
                } else {
                    let parsedInfo = querystring.parse(body);
                    const template = `<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <title>The Elements - ${parsedInfo.elementName}</title>
                <link rel="stylesheet" href="/styles.css">
                </head>
                <body>
                    <h1>${parsedInfo.elementName}</h1>
                    <h2>${parsedInfo.elementSymbol}</h2>
                    <h3>${parsedInfo.elementAtomicNumber}</h3>
                    <p>${parsedInfo.elementDescription}</p>
                    <p><a href="/">back</a></p>
                </body>
                </html>`;
                    fs.writeFile(`./public/${parsedInfo.elementName}.html`, template, (err) => {
                        if (err) {
                            return console.log(err);
                        };
                        console.log('Filed Saved!');
                    })
                };
            });
            res.end();
        };
    });
});

server.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
});