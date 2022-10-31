const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const dotenv = require('dotenv')

dotenv.config()
const indexRouter = require('./routes')
const userRouter = require('./routes/user')

const app = express()

app.set('port', process.env.PORT || 3000)

app.use(morgan('combined')) //클라이언트 요청에 대한 정보를 터미널에 표시해줌
// app.use('요청 경로', express.static('실제 경로'))
//Express에서 정적 파일을 제공할 때 사용하는 미들웨어
app.use('/', express.static(path.join(__dirname, 'public')))
//public 내부에서 해당 파일을 찾으면 클라이언트에게 그대로 전송하고 끝남 next() 없음
//찾지 못하는 경우 next()로 다음 미들웨어로 넘어감
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'jamespassword',
  cokkie: {
    httpOnly: true
  },
}))
app.use('/', (req, res, next) => {
  if (req.session.id) {
    express.static(path.join(__dirname, 'public'))(req, res, next)
  } else{
    next()
  }
})
// app.use 안에서 넣는 함수는 익스프레스가 알아서 (req, res, next)를 붙여 호출
// 그런데 미들웨어 안에 두는 express.static은 누가 따로 (req, res, next)를 붙이는 게 없으므로 직접 (req, res, next)를 붙여 호출
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// app.use((req,res, next) => {
//   console.log('모든 요청에 실행되고 싶어요')
//   next()
// }, (req, res) => { //에러 항상 발생시키는 상황; 에러 치러 미들웨어가 동작
//   try{
//     console.log(asdf)
//   } catch(error){
//     next(error) //next 안에 인수가 들어가면 error 처리 미들웨어로 넘어감(에러로 인식) 만약 'route'인 경우 다음 라우터로 넘어감
//   }
// }) //모든 요청에 대하여 실행된 후 next()를 통해 알맞은 응답에 대한 처리를 함


app.get('/', (req, res, next) => {
  req.session.id = 'hello'
  console.log(req.cookies) //{mycookie : 'test'}
  res.cookie('James', encodeURIComponent('password'), {
    expires: new Date(),
    httpOnly: true,
    path: '/'
  })
  // res.clearCookie('mycookie', encodeURIComponent('test'))
  res.sendFile(path.join(__dirname, 'index.html'))
  if (true){
    next('route')
  } else{
    next()
  }
}, (req, res) => {
  console.log('실행되나요?')
})

app.use((req, res, next) => {
  req.data = 'James비번' //미들웨어 간 데이터 주고 받기
})

app.get('/', (req, res) => {
  console.log('실행되지롱')
  req.data //James비번

})

app.post('/', (req, res) => {
  res.send('hello express')
})

app.get('/about', (req, res) => {
  res.send('hello express')
})

app.get('/about/:id', (req, res) => {
  res.send(`hello express ${req.params.id}`) //와일드카드 사용
})

app.use((req, res, next) => {
  res.status(404).send('404 에러 발생')
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send('서버 에러')
}) //에러 처리 미들웨어

app.listen(app.get('port'), () => {
  console.log('익스프레스 서버 실행')
})