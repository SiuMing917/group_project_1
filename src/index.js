/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
import express from 'express';
import session from 'express-session';
import login from './login.js';
import './userdb.js';
import './ticketdb.js';
import './traindb.js';
import mongostore from 'connect-mongo';
import client from './dbclient.js';
import path from 'path';

const app = express();

app.use(
  session({
    secret: '23020776d_eie4432_lab5',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
    store: mongostore.create({
      client,
      dbName: 'lab5db',
      collectionName: 'session',
    }),
  })
);

const PREAUTH_KEY = 'huisiuming09177190gnimuisiuh';
app.use((req, res, next) => {
  if (!req.session?.allow_access) {
    if (req.query?.authkey === PREAUTH_KEY) {
      req.session.allow_access = true;
    } else {
      res.status(401).json({
        status: 'failed',
        message: 'Unauthorized',
      });
    }
  }
  next();
});

app.get('/', (req, res) => {
  if (req.session.logged) {
    res.redirect('/account.html');
  } else {
    res.redirect('/login.html');
  }
  const now = new Date().toLocaleString('en-HK', { timeZone: 'Asia/Hong_Kong' });
  console.log('Current Date & Time (HKT):', now);
  console.log('Server started at http://127.0.0.1:8080');
});
app.use('/', express.static(path.join(process.cwd(), '/static')));

app.listen(8080, () => {
  const now = new Date().toLocaleString('en-HK', { timeZone: 'Asia/Hong_Kong' });
  console.log('Current Date & Time (HKT):', now);
  console.log('Server started at http://127.0.0.1:8080');
});

app.use('/auth', login);
