const http = require('http');
const fs = require('fs');
const url = require('url');

const myServer = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
        return res.end();
    }
    const log = `${Date.now()}: ${req.url} New Request received\n`;
    const myUrl = url.parse(req.url, true);
    console.log(myUrl);
    fs.appendFile('log.txt', log, (err, data) => {
        switch (myUrl.pathname) {
            case '/':
                res.end('Home Page');
                break;

                case '/about':
                const username = myUrl.query.myname;
                res.end(`Hi, ${username}`);
                break;

                case '/search':
                const search = myUrl.query.search_query;
                res.end("Here are the results for " + search);
                break;

            default:
                res.end('404, Page not found');
        }
    });
});

myServer.listen(8000, () => {
    console.log('Server is listening on port 8000');
});