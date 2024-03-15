const express = require('express');
const userController = require('./user.controller');
const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin');
const router = express.Router();

router.post('/api/v1/admin/user',verifyJWT, verifyAdmin, userController.createUser);
router.get('/api/v1/admin/users', verifyJWT,verifyAdmin, userController.getUsers);
router.patch('/api/v1/admin/user/:id', verifyJWT , verifyAdmin, userController.updateUser);
router.patch('/api/v1/admin/user/status/:id', verifyJWT , verifyAdmin, userController.updateStatus);
router.delete('/api/v1/admin/user/:id', verifyJWT , verifyAdmin, userController.deleteUser);


router.get('/api/v1/public/user/:id', userController.getUser);
router.get('/api/v1/public/user/pay/due', userController.setUsersDueStatus);


router.get('/api/v1/admin/accounts', verifyJWT,verifyAdmin, userController.getaccounts);


module.exports = router;