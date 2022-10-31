const http = require('http')

const server = http.createServer((req,res) => {
  res.write('<h1>Hello Node!</h1>')
  res.write('<p>Hello server!</p>') //html 문서를 따로 작성하고 fs로 읽어와서 사용가능
  res.end('<h1>Hi!</h1>')
})
  .listen(8080)

  server.on('error', (error) => {
    console.error(error)
  })
  server.on('listening',  () => {
    console.log('8080번 포트에서 서버 대기 중입니다')
  })