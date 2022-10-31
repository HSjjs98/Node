const EventEmitter = require('events')
const myEvent = new EventEmitter()
myEvent.addListener('event1', () => {
  console.log('이벤트 1')
})
myEvent.emit('event1') //이벤트 호출

process.addListener('exit', () => {
  console.log('exit 이벤트 연결')
})
process.addListener('exit', (code) => {
  console.log('종료 코드: ' + code)
})
process.addListener('uncaughtException', (err) => {
  console.log('에러 메시지: ' + err)
})
nonexistentFunc()
