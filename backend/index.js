const port = 4000
const express = require('express')
const app = express()
const cors = require('cors')
const { type } = require('os')
const connectToMongo = require('./database')
const router = express.Router();
const path = require('path')
const multer = require('multer')

connectToMongo();
app.use(express.json())
app.use(cors())

app.use('/api/auth', require('./routes/auth'))


app.get("/", (req, res) => {
    res.send("Express App is Running")
})

//Image Storage Engine
const storage = multer.diskStorage({
    destination:'./upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Create upload endpoint for images
const imagesPath = path.join(__dirname, 'upload/images');
console.log('Serving images from:', imagesPath); // Log the path being used
app.use('/images', express.static(imagesPath));


app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on port " + port)
    }
    else {
        console.log("Error " + error on running)
    }
})
