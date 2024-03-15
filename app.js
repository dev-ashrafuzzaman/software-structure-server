const express = require('express');
require('dotenv').config();
const app = express();
const axios = require('axios');
const ip = require('ip');
const cors = require('cors');
const fs = require('fs-extra')
const PORT = process.env.PORT || 3000;
const cron = require('node-cron');

const { getDatabase } = require('./src/utils/database');
const { connectToDatabase } = require('./src/utils/database');
const authRoutes = require('./src/app/v1/modules/middleware/jwtAuth.route');
const otpRoutes = require('./src/app/v1/modules/otpVerification/otp.route');
const uploadRoutes = require('./src/app/v1/modules/multerUpload/multer.controller');


const userRoutes = require('./src/app/v1/modules/users/user.route');

app.use(express.json());
app.use(cors());
app.use('/public', express.static('public'));



// Connect to the database
connectToDatabase()
    .then(() => {
        // Use userRoutes after connecting to the database
        app.use(authRoutes);
        app.use(otpRoutes);

        app.use(userRoutes);

  //----------Update the bill status Due for all users start----------//

  cron.schedule('0 0 3 * *', async () => {
      try {
        const db = getDatabase();
        const updateBillStatus = {
            $set: {
                billStatus: 'Due'
            }
        };
        
        const result = await db.collection('customers').updateMany({}, updateBillStatus);

        console.log(`Bill status updated for ${result.modifiedCount} users on the 4th of the month.`);


    } catch (error) {
        console.error('Error updating bill status:', error);
    }
});

//----------Update the bill status Due for all users End----------//



        // ---------------Image Upload APIS Start-----------//
        app.post("/public/upload", uploadRoutes.single("image"), (req, res) => {
            const imageUrl = "/public/upload/" + req.file.filename;
            res.send({ imageUrl });
        });

        // Image Delete API
        app.delete("/public/upload/:filename", (req, res) => {
            const filename = req.params.filename;
            const filePath = "./public/upload/" + filename;

            // Check if the file exists
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    return res.status(404).send({ error: 'File not found.' });
                }

                // Delete the file
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        return res.status(500).send({ error: 'Error deleting file.' });
                    }
                    res.send({ message: true });
                });
            });
        });
        // ---------------Image Upload APIS End-----------//

        app.get('/', (req, res) => {
            res.status(201).send({ serverRunning: true, ip: ip.address(), message: 'Surokkha GPS Server is Running', DevelopingStart: "20-10-2023" })

        })

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the database:", error);
    });