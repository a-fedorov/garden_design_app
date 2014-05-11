var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

// Логгирование
var morgan  = require('morgan')
// Компактный вид лога
app.use(morgan('short'));

app.listen(3000);
console.log('Listening localhost on port 3000 ...');

// Установка максимального размера JSON файла
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser());

// Загрузка всех статических файлов из каталога public
app.use(express.static(__dirname + '/public'));

// Извлечение из JSON содержимого изображения
function parseDataURL(body) {
  var match = /data:([^;]+);base64,(.*)/.exec(body);
  if(!match)
    return null;

  // Выделение заголовка и тела изображения
  return {
    contentType: match[1],
    data: new Buffer(match[2], 'base64')
  };
}

// Получение изображения с клиента
app.post('/upload', function (req, res) {
  // console.log(req.get('host'));
  var upload = parseDataURL(req.body.data);
	if (upload) {
		console.log('Server get image data');
	}

  var fileName = 'temp.png';
  var url = req.protocol + '://' + req.get('host') + '/' + fileName;
	// Запись изображения на сервере во временный файл
  fs.writeFile('public/' + fileName, upload.data, function(err){
  	console.log('Sending image to client');
  	// Возврат готового изображения клиенту
    res.send([url]);
  });
});