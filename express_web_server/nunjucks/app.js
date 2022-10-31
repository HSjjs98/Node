const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const nunjucks = require('nunjucks');

dotenv.config(); //환경 변수를 파일에 저장할 수 있게 해줌; process.env.-
const indexRouter = require('./routes/index'); //라우터 분리
const userRouter = require('./routes/user');

const app = express();
app.set('port', process.env.PORT || 3000); //환경변수 포트번호가 있는 경우 그걸 사용하고 없는 경우 3000번 포트 사용
app.set('view engine', 'html'); //템플릿 엔진을 넌적스 사용
nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public'))); //public 파일이 없으므로 next()
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //클라이언트로 부터 받은 http 요청 메시지 형식에서 body 데이터를 해석하기 위해 필요
app.use(cookieParser(process.env.COOKIE_SECRET)); //cookie parser
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error); //에러 핸들 미들웨어로 넘어감
});

app.use((err, req, res, next) => {
  // res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error'); //views 파일내부 error.html 랜더링하여 보여줌(넌적스 템플릿 엔진)
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
