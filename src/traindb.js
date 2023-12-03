/** HUI Siu Ming
    23020776D
    One-Person-Group
    (6➗4=1餘2)
    So, Train Ticket Selling System
*/
import client from './dbclient.js';

export async function update_train(destination, image, price, enabled) {
  try {
    const trains = client.db('lab5db').collection('trains');

    const result = await trains.updateOne(
      {
        destination: destination,
      },
      { $set: { destination, image, price, enabled } },
      { upsert: true }
    );

    if (result.upsertedCount == 1) {
      console.log('Added 1 train');
    } else {
      console.log('Added 0 train');
    }

    return true;
  } catch (error) {
    console.error('Unable to update the database!');
    return false;
  }
}

export async function fetch_train(destination) {
  try {
    const trains = client.db('lab5db').collection('trains');

    const train = await trains.findOne({
      destination: destination,
    });

    return train;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

export async function train_exist(destination) {
  try {
    const train = await fetch_train(destination);
    //return user ? true : false;
    return train != null;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return false;
  }
}

export async function fetch_trains() {
  try {
    const trains = client.db('lab5db').collection('trains');
    const cursor = trains.find();

    const alltrains = await cursor.toArray();
    if (alltrains == '') {
      return null;
    }
    return alltrains;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

export async function fetch_trainenabled(enabled) {
  try {
    const trains = client.db('lab5db').collection('trains');
    const cursor = trains.find({
      enabled: enabled,
    });

    const alltrains = await cursor.toArray();
    if (alltrains == '') {
      return null;
    }
    return alltrains;
  } catch (error) {
    console.error('Unable to fetch from database!');
    return null;
  }
}

export async function delete_trainenabled(enabled) {
  try {
    const trains = client.db('lab5db').collection('trains');

    const result = await trains.deleteMany({
      enabled: enabled,
    });

    console.log('deleted ' + result.deletedCount + ' train');

    return true;
  } catch (error) {
    console.error('Unable to delete the trains!');
    return false;
  }
}

export async function delete_train(destination) {
  try {
    const trains = client.db('lab5db').collection('trains');

    const result = await trains.deleteOne(
      {
        destination: destination,
      },
      { $set: { destination } },
      { delete: true }
    );

    if (result.deletedCount == 1) {
      console.log('deleted 1 train');
    } else {
      console.log('deleted 0 train');
    }

    return true;
  } catch (error) {
    console.error('Unable to delete the database!');
    return false;
  }
}

//fetch_trains().then((res) => console.log(res));
//fetch_trainid(656b51360c1f1907456e28b6).then((res) => console.log(res));
