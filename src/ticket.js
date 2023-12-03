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

const users = new Map();

const route = express();
const form = multer();

route.post('/order', form.none(), async (req, res) => {
  try {
    // get username and password
    req.session.ordered = false;

    const username = req.session.username;
    const destination = req.body.destination;
    const carriage = req.body.carriage;
    const ticketDate = req.body.ticketDate;
    const ticketTime = req.body.ticketTime;
    const seat = req.body.seat;
    const price = req.body.price;
    // check user valid
    const ticket = await ticket_exist(destination, carriage, ticketDate, ticketTime, seat);

    // valid and enabled
    if (!ticket) {
      req.session.ordered = true;
      req.session.username = username;
      req.session.destination = destination;
      req.session.carriage = carriage;
      req.session.ticketDate = ticketDate;
      req.session.ticketTime = ticketTime;
      req.session.seat = seat;
      req.session.price = price;
      req.session.timestamp = Date.now();

      res.json({
        orderstatus: 'failed',
        ticket: {
          username: req.session.username,
          destination: req.body.destination,
          carriage: req.body.carriage,
          ticketDate: req.body.ticketDate,
          ticketTime: req.body.ticketTime,
          seat: req.body.seat,
          price: req.body.price,
        },
      });

      console.log(req.session.username + 'Logged In');
    } else {
      // incorrect username or password
      res.status(401).json({
        status: 'failed',
        message: `Seat ${req.body.seat} already used by someone else`,
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

route.get('/myorder', async (req, res) => {
  try {
    if (req.session.ordered) {
      //const user = users.get(req.session.username);
      var username = req.session.username;
      var destination = req.session.destination;
      var carriage = req.session.carriage;
      var ticketDate = req.session.ticketDate;
      var ticketTime = req.session.ticketTime;
      var seat = req.session.seat;
      var price = req.session.price;
      const user = await fetch_user(username);

      // response with the user info
      res.json({
        orderstatus: 'failed',
        user: {
          username: user.username,
          destination: req.body.destination,
          carriage: req.body.carriage,
          ticketDate: req.body.ticketDate,
          ticketTime: req.body.ticketTime,
          seat: req.body.seat,
          price: req.body.price,
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

route.post('/pay', form.none(), async (req, res) => {
  if (
    !req.body.destination ||
    !req.body.carriage ||
    !req.body.ticketDate ||
    !req.body.ticketTime ||
    !req.body.seatSelect
  ) {
    res.status(400).json({ status: 'failed', message: 'Missing fields' });
  } else if (
    await ticket_exist(req.body.destination, req.body.carriage, req.body.ticketDate, req.body.ticketTime, req.body.seat)
  ) {
    res.status(400).json({ status: 'failed', message: `Seat ${req.body.seat} already used by someone else` });
  } else {
    if (
      await update_ticket(
        req.session.username,
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
          username: req.session.username,
          destination: req.body.destination,
          carriage: req.body.carriage,
          ticketDate: req.body.ticketDate,
          ticketTime: req.body.ticketTime,
          seat: req.body.seat,
          price: req.body.price,
        },
      });
    } else {
      res.status(500).json({ status: 'failed', message: 'Account created but unable to save into the database' });
    }
  }
});

route.post('/changepassword', form.none(), async (req, res) => {
  /* if (Object.keys(users).length == 0) {
    await init_userdb();
  } */

  // Check if "password" are not empty
  if (!req.body.password) {
    res.status(400).json({ status: 'failed', message: 'Missing fields' });
  } // Check if the password is at least 8 characters
  else if (req.body.password.length < 8) {
    res.status(400).json({ status: 'failed', message: 'Password must be at least 8 characters' });
  } else {
    // Insert a new user to the user database using update_user()
    if (await update_user(req.body.username, req.body.password, true)) {
      res.status(200).json({
        status: 'success',
        user: {
          username: req.body.username,
          role: req.body.role,
        },
      });
    } else {
      res.status(500).json({ status: 'failed', message: 'Account created but unable to save into the database' });
    }
  }
});

function isNumber(input) {
  return !isNaN(parseFloat(input)) && isFinite(input);
}
