const express = require('express');
const userController = require('./user.controller');
const verifyJWT = require('../middleware/verifyJWT');
const verifyAdmin = require('../middleware/verifyAdmin');
const router = express.Router();

router.post('/api/v1/admin/patient',verifyJWT, verifyAdmin, userController.createUser);
router.get('/api/v1/admin/patients',verifyJWT, verifyAdmin, userController.getUsers);
router.get('/api/v1/admin/patient/:id', userController.getUser);
router.patch('/api/v1/admin/patient/:id', verifyJWT , verifyAdmin, userController.updateUser);
router.patch('/api/v1/admin/patient/status/:id', verifyJWT , verifyAdmin, userController.updateStatus);
router.delete('/api/v1/admin/patient/:id', verifyJWT , verifyAdmin, userController.deleteUser);

module.exports = router;