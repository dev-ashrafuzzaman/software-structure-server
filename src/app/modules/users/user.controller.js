const { ObjectId } = require('mongodb');
const { getDatabase } = require('../../../utils/database');

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

exports.getUsers = async (req, res) => {
  try {
    const db = getDatabase();
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const db = getDatabase();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await db.collection('users').findOne(query);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const {user} = req.body;
  const db = getDatabase();
  try {
    const result = await db.collection('users').updateOne(filter, { $set: user });
    res.send(result)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const {data} = req.body;
  const db = getDatabase();
  try {
    const result = await db.collection('users').updateOne(filter, { $set: data });
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