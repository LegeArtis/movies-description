const express = require('express');
const Movie = require('./models/Movie');
const app = express();
const DIR = 'upload';
const multer = require('multer');
const path = require('path');
const fs = require('fs');
let storage  = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
let upload = multer({storage: storage});

/**
 * Возвращает список из 10 обьектов типа Movie
 */

app.route('/all').get((req, res) => {
  Movie.find((err, data) => {
    if (err) {
      console.log('Error: ' + err);
    } else {
      res.json(data.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) {
          return -1;
        }
        if (titleB < titleA) {
          return 1;
        }
        return 0;
      }));
    }
  }).limit(10)
});

/**
 * Принимает запрос с файлом, сохраняет его в папку upload на время обработки данных,
 * после отправки информации в базу данных, файл даляется
 */
app.post('/load', upload.single('text'), function (req, res) {
  if (!req.file || (!path.extname(req.file.originalname))) {
    console.log('No file received');
    res.send();
  } else {
    console.log('File received successfully');
    res.send();
    parser(req.file);
  }
});

/**
 * Принимает параметром файл, разбирает его на обьекты типа Movie,
 * сохраняет обьекты в базу данных затем удаляет файл
 * @param file
 */
function parser (file){
  const absolutePath = path.join(__dirname, file.path);
  console.log(absolutePath);
  const read = fs.readFileSync(absolutePath, 'utf-8');
  console.log(read);
  const movieList = [];
  read.split('\n').reduce((previousValue, currentValue) => {
    if (currentValue.startsWith('Title')) {
      previousValue.title = currentValue.split(':')[1].trim();
      return previousValue;
    }
    if (currentValue.startsWith('Release')) {
      previousValue.year = currentValue.split(':')[1].trim();
    }
    if (currentValue.startsWith('Format')) {
      previousValue.format = currentValue.split(':')[1].trim();
    }
    if (currentValue.startsWith('Stars')) {
      previousValue.stars = currentValue.split(':')[1].split(',').map((elem) => elem.trim());
      const movie = new Movie(previousValue);
      movie.save();
      movieList.push(movie);
    }
    return previousValue;
  }, {});
  console.log(movieList);
  fs.unlink(absolutePath, err => {
   if (err) {
     console.log(err);
   }
  });
}

/**
 * Добавляет обьекс типа Movie в базу
 */
app.route('/add').post((req, res) => {
  const formatList = ['VHS', 'DVD', 'Blu-Ray'];
  console.log(req.body);

  if (req.body.title &&
    req.body.year <= 2020 &&
    req.body.year >= 1850 &&
    req.body.stars &&
    formatList.includes(req.body.format) &&
    req.body.title.trim() !== '' &&
    req.body.stars[0].trim() !== '') {

    let movie = new Movie(req.body);

    movie.save().then(() => {
      res.status(200).json({'movie': 'movie in added successfully'});
    }).catch(err => {
      res.status(400).send('unable to save to database');
      console.log(err);
    })
  } else {
    res.status(400).send(' Try to add incorrect object');
  }
});

/**
 * Выполняет поиск по иодному из параметров (title, name) или по обеем сразу
 * игнорируя заглавность букв.
 * Возвращает масив обьектов типа Movie[]
 */
app.route('/search/:title&:name').get((req, res) => {
  const search = {};
  if (req.params.title !== 'none') {
    search.title = {'$regex' : `^${req.params.title}$`, '$options' : 'i'};
  }

  if (req.params.name !== 'none') {
    search.stars = {'$regex' : `^${req.params.name}$`, '$options' : 'i'};
  }

  console.log(search);

  Movie.find(search, (err, data) => {
    if (err) {
      console.log('Error: ' + err);
    } else {
      console.log(data);
      res.json(data.sort((a, b) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          if (titleA < titleB) {
            return -1;
          }
          if (titleB < titleA) {
            return 1;
          }
          return 0;
      }));
    }
  })
});

/**
 * Удаляет с базы данных обьек по ID
 */
app.route('/delete').post((req, res) => {
  Movie.findOneAndDelete({_id: req.body._id}, (err) => {
    if (err) res.json(err);
    else res.json('Successfully removed');
  });

});

module.exports = app;
