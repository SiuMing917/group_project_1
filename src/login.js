/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { validate_user } from './userdb.js';
import { update_user } from './userdb.js';
import { fetch_user } from './userdb.js';
import { username_exist } from './userdb.js';
import { update_ticket } from './ticketdb.js';
import { fetch_ticket } from './ticketdb.js';
import { ticket_exist } from './ticketdb.js';
import { fetch_seats } from './ticketdb.js';
import { update_info } from './userdb.js';
import { search_username } from './userdb.js';
import { search_email } from './userdb.js';
import { search_phone } from './userdb.js';
import { fetch_trains, train_exist } from './traindb.js';
import { fetch_history } from './ticketdb.js';
import { fetch_trainenabled } from './traindb.js';
import { fetch_train } from './traindb.js';
import { delete_train } from './traindb.js';
import { delete_trainenabled } from './traindb.js';
import { update_train } from './traindb.js';
import { search_password } from './userdb.js';
import { fetch_allhistory } from './ticketdb.js';

const users = new Map();

const route = express();
const form = multer();
route.post('/login', form.none(), async (req, res) => {
  try {
    // users empty?
    /* if (users.size == 0) {
      await init_userdb();
    } */

    // set logged false
    req.session.logged = false;

    // get username and password
    const username = req.body.username;
    const password = req.body.password;
    // check user valid
    const user = await validate_user(username, password);

    // valid and enabled
    if (user && user.enabled) {
      req.session.logged = true;
      req.session.image = user.image;
      req.session.phone = user.phone;
      req.session.email = user.email;
      req.session.username = user.username;
      req.session.role = user.role;
      req.session.timestamp = Date.now();

      // success
      res.json({
        status: 'success',
        user: {
          username: user.username,
          role: user.role,
        },
      });

      console.log(req.session.username + ' (' + req.session.role + ') Logged In');
    } else if (user && !user.enabled) {
      //disabled
      res.status(401).json({
        status: 'failed',
        message: `User '${username}' is currently disabled`,
      });
    } else {
      // incorrect username or password
      res.status(401).json({
        status: 'failed',
        message: 'Incorrect username and password',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

route.post('/logout', (req, res) => {
  try {
    // currently logged in
    if (req.session.logged) {
      // true
      console.log(req.session.username + ' (' + req.session.role + ') Logged out');
      req.session.logged = false;
      req.session.destroy();
      res.end();
    } else {
      // false send status code 401
      res.status(401).json({
        status: 'failed',
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

route.get('/me', async (req, res) => {
  try {
    // currently logged in
    if (req.session.logged) {
      //const user = users.get(req.session.username);
      var image = req.session.image;
      var usersname = req.session.username;
      const user = await fetch_user(usersname);

      // response with the user info
      res.json({
        status: 'success',
        user: {
          image: image,
          username: user.username,
          phone: user.phone,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      //response with status code 401
      res.status(401).json({
        status: 'failed',
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

export default route;

route.post('/register', form.none(), async (req, res) => {
  // Check if both are not empty
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.status(400).json({ status: 'failed', message: 'Missing fields' });
  } // Check if the username is at least 3 characters
  else if (req.body.username.length < 3) {
    res.status(400).json({ status: 'failed', message: 'Username must be at least 3 characters' });
  } // Check if the phone is 8 characters
  else if (!isNumber(req.body.phone) || req.body.phone.length != 8) {
    res.status(400).json({ status: 'failed', message: 'Phone number must be a number and the length must be 8' });
  } // Check if the username is unique among all users
  //else if (users.has(req.body.username)) {
  else if (await username_exist(req.body.username)) {
    res.status(400).json({ status: 'failed', message: `Username ${req.body.username} already exists` });
  } // Check if the password is at least 8 characters
  else if (req.body.password.length < 8) {
    res.status(400).json({ status: 'failed', message: 'Password must be at least 8 characters' });
  } else if (!validateEmail(req.body.email)) {
    res.status(400).json({ status: 'failed', message: 'Incorrect Email Format' });
  } else {
    // Insert a new user to the user database using update_user()
    if (
      await update_user(
        req.body.image,
        req.body.username,
        req.body.password,
        req.body.email,
        req.body.phone,
        'user',
        true
      )
    ) {
      res.status(200).json({
        status: 'success',
        user: {
          image: req.body.image,
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          role: req.body.role,
        },
      });
    } else {
      res.status(500).json({ status: 'failed', message: 'Account created but unable to save into the database' });
    }
  }
});

route.post('/changeinfo', form.none(), async (req, res) => {
  var password = req.body.password;
  var repeatpassword = req.body.repeatpassword;
  var email = req.session.email;
  var phone = req.session.phone;
  var image = req.session.image;
  // Check if "password" are not empty
  if (req.body.phone && isNumber(req.body.phone)) {
    phone = req.body.phone;
  }
  if (req.body.email && validateEmail(req.body.email)) {
    email = req.body.email;
  }
  if (req.body.image) {
    image = req.body.image;
  }

  if (!validateEmail(email)) {
    res.status(400).json({ status: 'failed', message: 'Incorrenct Email Format' });
  } else if (!isNumber(phone) || phone.length != 8) {
    res.status(400).json({ status: 'failed', message: 'Phone number must be a number and the length must be 8' });
  } else if (password && password.length < 8) {
    res.status(400).json({ status: 'failed', message: 'Password must be at least 8 characters' });
  } else if (password && repeatpassword && password != repeatpassword) {
    res.status(400).json({ status: 'failed', message: 'Password and Repeated Password are Different' });
  } else if (password && repeatpassword && password == repeatpassword) {
    if (await update_user(image, req.session.username, password, email, phone, req.session.role, true)) {
      res.status(200).json({
        status: 'success',
        user: {
          username: req.session.username,
          email: email,
          phone: phone,
          role: req.session.role,
        },
      });
    } else {
      res.status(500).json({ status: 'failed', message: 'Updated but unable to save into the database' });
    }
  } else {
    if (await update_info(image, req.session.username, email, phone, req.session.role, true)) {
      res.status(200).json({
        status: 'success',
        user: {
          username: req.session.username,
          email: email,
          phone: phone,
          role: req.session.role,
        },
      });
    } else {
      res.status(500).json({ status: 'failed', message: 'Updated but unable to save into the database' });
    }
  }
});

route.post('/ticket', form.none(), async (req, res) => {
  try {
    const destination = req.body.destination;
    const carriage = req.body.carriage;
    const ticketDate = req.body.ticketDate;
    const ticketTime = req.body.ticketTime;
    const seat = req.body.seat;
    const price = req.body.price;

    // valid and enabled
    if (req.body.destination || !req.body.carriage || !req.body.ticketDate || !req.body.ticketTime || !req.body.seat) {
      req.session.destination = destination;
      req.session.carriage = carriage;
      req.session.ticketDate = ticketDate;
      req.session.ticketTime = ticketTime;
      req.session.seat = seat;
      req.session.price = price;
      req.session.timestamp = Date.now();

      // success
      res.json({
        status: 'success',
        order: {
          username: req.session.username,
          destination: req.session.destination,
          carriage: req.session.carriage,
          ticketDate: req.session.ticketDate,
          ticketTime: req.session.ticketTime,
          seat: req.session.seat,
          price: req.session.price,
        },
      });
      console.log('The order was placed successfully! \n Now you will be transferred to the payment page');
    } else {
      res.status(401).json({
        status: 'failed',
        message: 'Please fill in all the information',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

route.post('/order', form.none(), async (req, res) => {
  try {
    req.session.ordered = false;

    // get username and password
    const username = req.session.username;
    const destination = req.body.destination;
    const carriage = req.body.carriage;
    const ticketDate = req.body.ticketDate;
    const ticketTime = req.body.ticketTime;
    const price = req.body.price;
    // check user valid

    // valid and enabled
    if (req.body.destination || !req.body.carriage || !req.body.ticketDate || !req.body.ticketTime || !req.body.seat) {
      req.session.destination = destination;
      req.session.carriage = carriage;
      req.session.ticketDate = ticketDate;
      req.session.ticketTime = ticketTime;
      req.session.price = price;
      req.session.timestamp = Date.now();
      req.session.ordered = true;

      // success
      res.json({
        status: 'success',
        order: {
          destination: req.session.destination,
          carriage: req.session.carriage,
          ticketDate: req.session.ticketDate,
          ticketTime: req.session.ticketTime,
          price: req.session.price,
        },
      });
      console.log('You can choose your seat now.');
    } else {
      res.status(401).json({
        status: 'failed',
        message: 'Please fill in all the information above before selecting your seat',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

route.get('/seat', async (req, res) => {
  try {
    if (req.session.ordered) {
      var destination = req.session.destination;
      var carriage = req.session.carriage;
      var ticketDate = req.session.ticketDate;
      var ticketTime = req.session.ticketTime;
      const seat = await fetch_seats(destination, carriage, ticketDate, ticketTime);

      // response with the seat info
      res.json({
        status: 'success',
        seat: seat,
      });
    } else {
      //response with status code 401
      res.status(401).json({
        status: 'failed',
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

route.get('/myorder', async (req, res) => {
  try {
    if (req.session.logged) {
      var username = req.session.username;
      var destination = req.session.destination;
      var carriage = req.session.carriage;
      var ticketDate = req.session.ticketDate;
      var ticketTime = req.session.ticketTime;
      var seat = req.session.seat;
      var price = req.session.ticketTime;

      // response with the seat info
      res.json({
        status: 'success',
        order: {
          username: req.session.username,
          destination: req.session.destination,
          carriage: req.session.carriage,
          ticketDate: req.session.ticketDate,
          ticketTime: req.session.ticketTime,
          seat: req.session.seat,
          price: req.session.price,
        },
      });
    } else {
      //response with status code 401
      res.status(401).json({
        status: 'failed',
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

route.post('/payment', form.none(), async (req, res) => {
  if (
    !req.session.destination ||
    !req.session.carriage ||
    !req.session.ticketDate ||
    !req.session.ticketTime ||
    !req.session.seat
  ) {
    res.status(400).json({ status: 'failed', message: 'Missing fields' });
  } else if (
    await ticket_exist(
      req.session.destination,
      req.session.carriage,
      req.session.ticketDate,
      req.session.ticketTime,
      req.session.seat
    )
  ) {
    res.status(400).json({ status: 'failed', message: `Seat ${req.body.seat} already used by someone else` });
  } else {
    if (
      await update_ticket(
        req.session.username,
        req.session.destination,
        req.session.carriage,
        req.session.ticketDate,
        req.session.ticketTime,
        req.session.seat,
        req.session.price,
        true
      )
    ) {
      res.status(200).json({
        status: 'success',
        ticket: {
          username: req.session.username,
          destination: req.session.destination,
          carriage: req.session.carriage,
          ticketDate: req.session.ticketDate,
          ticketTime: req.session.ticketTime,
          seat: req.session.seat,
          price: req.session.price,
        },
      });
    } else {
      res.status(500).json({ status: 'failed', message: 'Payment created but unable to save into the database' });
    }
  }
});

route.post('/adminticket', form.none(), async (req, res) => {
  const userexist = await username_exist(req.body.username);
  if (
    !req.body.username ||
    !req.body.destination ||
    !req.body.carriage ||
    !req.body.ticketDate ||
    !req.body.ticketTime ||
    !req.body.seat
  ) {
    res.status(400).json({ status: 'failed', message: 'Missing fields' });
  } else if (!userexist) {
    res.status(400).json({ status: 'failed', message: 'Username not exist' });
  } else if (
    await ticket_exist(req.body.destination, req.body.carriage, req.body.ticketDate, req.body.ticketTime, req.body.seat)
  ) {
    res.status(400).json({ status: 'failed', message: `Seat ${req.body.seat} already used by someone else` });
  } else {
    if (
      await update_ticket(
        req.body.username,
        req.body.destination,
        req.body.carriage,
        req.body.ticketDate,
        req.body.ticketTime,
        req.body.seat,
        req.body.price,
        true
      )
    ) {
      res.status(200).json({
        status: 'success',
        ticket: {
          username: req.body.username,
          destination: req.body.destination,
          carriage: req.body.carriage,
          ticketDate: req.body.ticketDate,
          ticketTime: req.body.ticketTime,
          seat: req.body.seat,
          price: req.body.price,
        },
      });
    } else {
      res.status(500).json({ status: 'failed', message: 'Ticket created but unable to save into the database' });
    }
  }
});

route.post('/adminchangeinfo', form.none(), async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var phone = req.body.phone;
  var image = req.body.image;
  var role = 'user';
  let userexit = await username_exist(username);
  // Check if "password" are not empty

  if (!validateEmail(email)) {
    res.status(400).json({ status: 'failed', message: 'Incorrenct Email Format' });
  } else if (!isNumber(phone) || phone.length != 8) {
    res.status(400).json({ status: 'failed', message: 'Phone number must be a number and the length must be 8' });
  } else if (password && password.length < 8) {
    res.status(400).json({ status: 'failed', message: 'Password must be at least 8 characters' });
  } else if (!userexit) {
    res.status(400).json({ status: 'failed', message: `Username ${req.body.username} not exists` });
  } else {
    if (await update_info(image, username, email, phone, role, true)) {
      res.status(200).json({
        status: 'success',
        user: {
          iamge: image,
          username: username,
          email: email,
          phone: phone,
          role: role,
        },
      });
    } else {
      res.status(500).json({ status: 'failed', message: 'Updated but unable to save into the database' });
    }
  }
});

route.post('/searchusername', form.none(), async (req, res) => {
  try {
    const username = req.body.username;
    const user = await search_username(username);
    // check user valid

    // valid and enabled
    if (user != null) {
      // success
      res.json({
        status: 'success',
        user: {
          image: user.image,
          username: user.username,
          password: user.password,
          email: user.email,
          phone: user.phone,
        },
      });
    } else {
      res.status(401).json({
        status: 'failed',
        message: 'Cannot Find the Username in Database!',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

route.post('/searchemail', form.none(), async (req, res) => {
  try {
    const email = req.body.email;
    const user = await search_email(email);
    // check user valid

    // valid and enabled
    if (user != null) {
      // success
      res.json({
        status: 'success',
        user: {
          image: user.image,
          username: user.username,
          password: user.password,
          email: user.email,
          phone: user.phone,
        },
      });
    } else {
      res.status(401).json({
        status: 'failed',
        message: 'Cannot Find the Email in Database!',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

route.post('/searchphone', form.none(), async (req, res) => {
  try {
    const phone = req.body.phone;
    const user = await search_phone(phone);
    // check user valid

    // valid and enabled
    if (user != null) {
      // success
      res.json({
        status: 'success',
        user: {
          image: user.image,
          username: user.username,
          password: user.password,
          email: user.email,
          phone: user.phone,
        },
      });
    } else {
      res.status(401).json({
        status: 'failed',
        message: 'Cannot Find the Phone Number in Database!',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

route.get('/trainsinfo', async (req, res) => {
  try {
    const trains = await fetch_trains();
    if (trains != null || trains != '') {
      res.json({
        status: 'success',
        trains: trains,
      });
    } else {
      //response with status code 401
      res.status(401).json({
        status: 'failed',
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

route.get('/history', async (req, res) => {
  if (req.session.logged) {
    var username = req.session.username;
    try {
      const history = await fetch_history(username);
      if (history != null || history != '') {
        res.json({
          status: 'success',
          tickets: history,
        });
      } else {
        //response with status code 401
        res.status(401).json({
          status: 'failed',
          message: 'Unauthorized',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }
});

route.get('/allhistory', async (req, res) => {
  if (req.session.logged) {
    var username = req.session.username;
    try {
      const history = await fetch_allhistory();
      if (history != null || history != '') {
        res.json({
          status: 'success',
          tickets: history,
        });
      } else {
        //response with status code 401
        res.status(401).json({
          status: 'failed',
          message: 'Unauthorized',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }
});

route.get('/traindisable', async (req, res) => {
  try {
    const trains = await fetch_trainenabled(false);
    if (trains != null || trains != '') {
      res.json({
        status: 'success',
        train: trains,
      });
    } else {
      //response with status code 401
      res.status(401).json({
        status: 'failed',
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

route.post('/searchtrain', form.none(), async (req, res) => {
  try {
    const destination = req.body.destination;
    const train = await fetch_train(destination);
    // check user valid

    // valid and enabled
    if (train != null) {
      // success
      res.json({
        status: 'success',
        train: {
          _id: train._id,
          image: train.image,
          destination: train.destination,
          price: train.price,
          enabled: train.enabled,
        },
      });
    } else {
      res.status(401).json({
        status: 'failed',
        message: 'Cannot Find the Train in Database!',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

route.post('/deletetrain', form.none(), async (req, res) => {
  const trainexist = await train_exist(req.body.destination);
  if (!req.body.destination) {
    res.status(400).json({ status: 'failed', message: 'Missing fields' });
  } else if (!trainexist) {
    res.status(400).json({ status: 'failed', message: 'Train not exist' });
  } else {
    if (await delete_train(req.body.destination)) {
      res.status(200).json({
        status: 'success',
        train: {
          destination: req.body.destination,
        },
      });
    } else {
      res.status(500).json({ status: 'failed', message: 'train deleted but unable to save into the database' });
    }
  }
});

route.post('/deletetraindisabled', form.none(), async (req, res) => {
  if (await delete_trainenabled(false)) {
    res.status(200).json({
      status: 'success',
    });
  } else {
    res.status(500).json({ status: 'failed', message: 'train deleted but unable to save into the database' });
  }
});

route.post('/upadatetrain', form.none(), async (req, res) => {
  let enabled;
  if (req.body.enabled == 'true') {
    enabled = true;
  } else {
    enabled = false;
  }
  if (!req.body.destination || !req.body.price || !req.body.image || !req.body.enabled) {
    res.status(400).json({ status: 'failed', message: 'Missing fields' });
  } else {
    if (await update_train(req.body.destination, req.body.image, req.body.price, enabled)) {
      res.status(200).json({
        status: 'success',
        train: {
          destination: req.body.destination,
          image: req.body.image,
          price: req.body.price,
          enabled: req.body.enabled,
        },
      });
    } else {
      res.status(500).json({ status: 'failed', message: 'train updated but unable to save into the database' });
    }
  }
});

route.post('/forgetpassword', form.none(), async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const phone = req.body.phone;
    const userexist = await username_exist(username);
    const matchinfo = await search_password(username, email, phone);
    // check user valid

    // valid and enabled
    if (!username || !email || !phone) {
      res.status(400).json({ status: 'failed', message: 'Missing Information fields' });
    } else if (!userexist) {
      res.status(400).json({ status: 'failed', message: 'Username not exist' });
    } else if (!matchinfo) {
      res.status(400).json({
        status: 'failed',
        message: 'The email or phone number you provided is incorrect.\nPlease confirm the information you registered.',
      });
    } else if (userexist && matchinfo) {
      const user = await fetch_user(username);
      res.status(200).json({
        status: 'success',
        user: {
          username: user.username,
          password: user.password,
          email: user.email,
          phone: user.phone,
        },
      });
    } else {
      res.status(401).json({
        status: 'failed',
        message: 'Cannot Find the Train in Database!',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isNumber(input) {
  return !isNaN(parseFloat(input)) && isFinite(input);
}
