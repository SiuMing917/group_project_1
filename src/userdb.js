/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
import fs from 'fs/promises';
import client from './dbclient.js';
import { fetch_seats } from './ticketdb.js';

init_db();

async function init_db() {
  try {
    const users = client.db('lab5db').collection('users');

    const count = await users.countDocuments();
    if (count === 0) {
      const data = await fs.readFile('users.json', 'utf-8');
      const userObjects = JSON.parse(data);
      const result = await users.insertMany(userObjects);
      console.log(`Added ${result.insertedCount} users`);
    }
  } catch (err) {
    console.error('Unable to initialize the database!');
  }
}

init_db().catch(console.dir);

init_ticketdb();

async function init_ticketdb() {
  try {
    const tickets = client.db('lab5db').collection('tickets');

    const count = await tickets.countDocuments();
    if (count === 0) {
      const data = await fs.readFile('tickets.json', 'utf-8');
      const ticketObjects = JSON.parse(data);
      const result = await tickets.insertMany(ticketObjects);
      console.log(`Added ${result.insertedCount} tickets`);
    }
  } catch (err) {
    console.error('Unable to initialize the database!');
  }
}

init_ticketdb().catch(console.dir);

init_traindb();

async function init_traindb() {
  try {
    const trains = client.db('lab5db').collection('trains');

    const count = await trains.countDocuments();
    if (count === 0) {
      const data = await fs.readFile('trains.json', 'utf-8');
      const trainObjects = JSON.parse(data);
      const result = await trains.insertMany(trainObjects);
      console.log(`Added ${result.insertedCount} trains`);
    }
  } catch (err) {
    console.error('Unable to initialize the database!');
  }
}

init_traindb().catch(console.dir);

export async function validate_user(username, password) {
  if (!username || !password) {
    return false;
  }

  try {
    const users = client.db('lab5db').collection('users');
    const user = await users.findOne({ username, password });

    if (!user) {
      return false;
    }

    return user;
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    return false;
  }
}

export async function update_user(image, username, password, email, phone, role, enabled) {
  try {
    const users = client.db('lab5db').collection('users');

    const result = await users.updateOne(
      { username: username },
      { $set: { image, username, password, email, phone, role, enabled } },
      { upsert: true }
    );

    if (result.upsertedCount == 1) {
      console.log('Added 1 user');
    } else {
      console.log('Added 0 user');
    }

    return true;
  } catch (error) {
    console.error('Unable to update the database!');
    return false;
  }
}

export async function fetch_user(username) {
  try {
    const users = client.db('lab5db').collection('users');

    const user = await users.findOne({ username: username });

    return user;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

export async function username_exist(username) {
  try {
    const user = await fetch_user(username);
    //return user ? true : false;
    return user != null;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return false;
  }
}

export async function update_info(image, username, email, phone, role, enabled) {
  try {
    const users = client.db('lab5db').collection('users');

    const result = await users.updateOne(
      { username: username },
      { $set: { image, username, email, phone, role, enabled } },
      { upsert: true }
    );

    if (result.upsertedCount == 1) {
      console.log('Added 1 user');
    } else {
      console.log('Added 0 user');
    }

    return true;
  } catch (error) {
    console.error('Unable to update the database!');
    return false;
  }
}

//validate_user('alice', 'xyz').then((res) => console.log(res));
//validate_user('alice', 'ecila').then((res) => console.log(res));

//update_user('bob', 'bob4321', 'student', true).then((res) => console.log(res));
//update_user('23020776D', '23020776D', 'user', false).then((res) => console.log(res));

//fetch_user('anyone').then((res) => console.log(res));
//fetch_user('23020776d').then((res) => console.log(res));
//fetch_seats('trainA', 'carriage1', '2023-12-02', '10').then((res) => console.log(res));

//username_exist('anyone').then((res) => console.log(res));
//username_exist('23020776D').then((res) => console.log(res));

export async function search_username(username) {
  try {
    const users = client.db('lab5db').collection('users');

    const user = await users.findOne({ username: username });

    return user;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

export async function search_phone(phone) {
  try {
    const users = client.db('lab5db').collection('users');

    const user = await users.findOne({ phone: phone });

    return user;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

export async function search_email(email) {
  try {
    const users = client.db('lab5db').collection('users');

    const user = await users.findOne({ email: email });

    return user;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

export async function search_password(username, email, phone) {
  try {
    const users = client.db('lab5db').collection('users');

    const user = await users.findOne({
      username: username,
      email: email,
      phone: phone,
    });
    return user;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

export async function validate_userinfo(username, email, phone) {
  if (!username || !email || !phone) {
    return false;
  }

  try {
    const users = client.db('lab5db').collection('users');
    const user = await search_password(username, email, phone);

    if (!user) {
      return false;
    }

    return user;
  } catch (error) {
    console.error('Unable to fetch from database!', error);
    return false;
  }
}
