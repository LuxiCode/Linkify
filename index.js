const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;

const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));

app.use(bodyParser.json());

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/r', (req,res) => {
  const id = req.query.id;
  fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
          console.error('Veri okuma hatası:', err);
          res.status(500).send('ERR: Sunucu Hatası');
          return;
      }

      try {
          const jsonData = JSON.parse(data);

          const entry = jsonData.find(entry => entry.id == id);

          if (!entry) {
              res.status(404).json({ error: 'Böyle bir ID sistemde yok!' });
              return;
          }

          res.redirect(entry.url.url);
      } catch (parseError) {
          console.error('JSON parse hatası:', parseError);
          res.status(500).send('ERR: Sunucu Hatası');
      }
  });
});;

app.post('/api/shorten', (req,res) => {
  const url = req.body;

  fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
          console.error('Veri okuma hatası:', err);
          res.status(500).send('ERR: Sunucu Hatası');
          return;
      }

      try {
          const jsonData = JSON.parse(data);

        const entry = jsonData.find(entry => entry.id == id);

          const newEntry = {
              id: jsonData.length + 1,
              url
          };

          jsonData.push(newEntry);

          fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
              if (writeErr) {
                  console.error('Veri yazma hatası:', writeErr);
                  res.status(500).send('ERR: Sunucu Hatası');
                  return;
              }

              res.status(200).json({ status: 'success', message: 'Link Kısaltıldı!', url: 'https://linkify.vercel.app/r?id=' + entry.id});
          });
      } catch (parseError) {
          console.error('JSON parse hatası:', parseError);
          res.status(500).send('ERR: Sunucu Hatası');
      }
  });
});

app.get('/api/list', (req,res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
          console.error('Veri okuma hatası:', err);
          res.status(500).send('ERR: Sunucu Hatası');
          return;
      }

      try {
          const listdata = JSON.parse(data);

          res.json({ listdata });
      } catch (parseError) {
          console.error('JSON parse hatası:', parseError);
          res.status(500).send('ERR: Sunucu Hatası');
      }
  });
});

app.get('/*', (req,res) => {
  res.sendFile(__dirname + '/public/404.html');
});;

app.listen(port, () => {
  console.log(`Sistem ${port} portunda çalışıyor.`);
});