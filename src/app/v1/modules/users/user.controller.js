const { ObjectId } = require('mongodb');
const { getDatabase } = require('../../../../utils/database');

exports.createUser = async (req, res) => {
  const { user } = req.body;
  const db = getDatabase();
  try {
    const result = await db.collection('users').insertOne(user);
    res.send(result)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// exports.getUsers = async (req, res) => {
//   try {
//     const db = getDatabase();
//     const result = await db.collection('customers').find().toArray();
//     res.send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = '' } = req.query;
    const db = getDatabase();
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const totalCount = await db.collection('customers').countDocuments(query);
    const result = await db.collection('customers')
      .find(query)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .toArray();
      
    res.json({ totalCount, data: result  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getaccounts = async (req, res) => {
  try {
    const db = getDatabase();
    const result = await db.collection('accounts').find().toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.setUsersDueStatus = async (req, res) => {
  try {
    const db = getDatabase();
    const updateBillStatus = {
      $set: {
        billStatus: 'Due'
      }
    };
    const result = await db.collection('users').updateMany({}, updateBillStatus);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error No Update' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const db = getDatabase();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await db.collection('users').findOne(query);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const { user } = req.body;
  const db = getDatabase();
  try {
    const findUser = await db.collection('users').findOne(filter);

    const previusUser = { userName: findUser.userName }
    const updateUserName = { userName: user.userName }

    if (findUser) {
      const connectCheck = await db.collection('connections').find(previusUser).toArray();
      if (connectCheck) {
        await db.collection('connections').updateMany(previusUser, { $set: updateUserName });
      }

      const billsCheck = await db.collection('bills').find(previusUser).toArray();
      if (billsCheck) {
        await db.collection('bills').updateMany(previusUser, { $set: updateUserName });
      }
      const result = await db.collection('users').updateOne(filter, { $set: user });
      res.send(result)

    } else {
      res.send('user Not Found')
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error no update' });
  }
};

exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const { statusData } = req.body;
  console.log(statusData);
  const db = getDatabase();
  try {
    const result = await db.collection('users').updateOne(filter, { $set: statusData });
    res.send(result)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const db = getDatabase();
  const query = { _id: new ObjectId(id) };
  try {
    const result = await db.collection('users').deleteOne(query);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};