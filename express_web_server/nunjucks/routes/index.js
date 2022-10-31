const express = require('express');

const router = express.Router();

// GET / 라우터
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' }); //views 폴더 내부 index.html을 읽어옴, prop {title: 'Express'}
});

module.exports = router;
