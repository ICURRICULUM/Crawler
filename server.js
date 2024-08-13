const {createJson}=require('./bin/crawler')


// server.js
const restify = require('restify');

// 서버 생성
const server = restify.createServer({
    name: 'seok-server',
    version: '1.0.0'
});

// 미들웨어 설정
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// 기본 라우팅
server.get('/', (req, res, next) => {
    res.send('Hello, Restify!');
    next();
});


// 예제 라우팅 - POST 요청
server.get('/data/:depertment',createJson);

// 서버 시작
server.listen(8080, () => {
    console.log('%s listening at %s', server.name, server.url);
});
