/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
import fs from 'fs/promises';
import client from './dbclient.js';

export async function update_ticket(username, destination, carriage, ticketDate, ticketTime, seat, price, enabled) {
  try {
    const tickets = client.db('lab5db').collection('tickets');

    const result = await tickets.updateOne(
      {
        username: username,
        destination: destination,
        carriage: carriage,
        ticketDate: ticketDate,
        ticketTime: ticketTime,
        seat: seat,
      },
      { $set: { username, destination, carriage, ticketDate, ticketTime, seat, price, enabled } },
      { upsert: true }
    );

    if (result.upsertedCount == 1) {
      console.log('Added 1 ticket');
    } else {
      console.log('Added 0 ticket');
    }

    return true;
  } catch (error) {
    console.error('Unable to update the database!');
    return false;
  }
}

export async function fetch_ticket(destination, carriage, ticketDate, ticketTime, seat) {
  try {
    const tickets = client.db('lab5db').collection('tickets');

    const ticket = await tickets.findOne({
      destination: destination,
      carriage: carriage,
      ticketDate: ticketDate,
      ticketTime: ticketTime,
      seat: seat,
    });

    return ticket;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

export async function ticket_exist(destination, carriage, ticketDate, ticketTime, seat) {
  try {
    const ticket = await fetch_ticket(destination, carriage, ticketDate, ticketTime, seat);
    //return user ? true : false;
    return ticket != null;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return false;
  }
}

export async function fetch_seats(destination, carriage, ticketDate, ticketTime) {
  try {
    const tickets = client.db('lab5db').collection('tickets');
    const cursor = tickets.find({
      destination: destination,
      carriage: carriage,
      ticketDate: ticketDate,
      ticketTime: ticketTime,
    });

    const seats = await cursor.toArray();
    if (seats == '') {
      return null;
    }
    return seats;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

export async function fetch_history(username) {
  try {
    const tickets = client.db('lab5db').collection('tickets');
    const cursor = tickets.find({
      username: username,
    });

    const ticket = await cursor.toArray();
    if (ticket == '') {
      return null;
    }
    return ticket;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

//fetch_seats('trainA', 'carriage1', '2023-12-02', '10').then((res) => console.log(res));

export async function fetch_ticketdestination(destination) {
  try {
    const tickets = client.db('lab5db').collection('tickets');
    const cursor = tickets.find({
      destination: destination,
    });

    const alltickets = await cursor.toArray();
    if (alltickets == '') {
      return null;
    }
    return alltickets;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

export async function fetch_ticketDateTime(ticketDate, ticketTime) {
  try {
    const tickets = client.db('lab5db').collection('tickets');
    const cursor = tickets.find({
      ticketDate: ticketDate,
      ticketTime: ticketTime,
    });

    const alltickets = await cursor.toArray();
    if (alltickets == '') {
      return null;
    }
    return alltickets;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

export async function fetch_allhistory() {
  try {
    const tickets = client.db('lab5db').collection('tickets');
    const cursor = tickets.find();

    const ticket = await cursor.toArray();
    if (ticket == '') {
      return null;
    }
    return ticket;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}
