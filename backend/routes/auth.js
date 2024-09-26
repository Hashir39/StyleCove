const jwt = require('jsonwebtoken')

const express = require('express')
const Product = require('../models/productschema')
const router = express.Router();
const User = require('../models/Userschema')



// //Image Storage Engine
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '../upload/images'));
//     },
//     filename: (req, file, cb) => {
//         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })

// const upload = multer({ storage: storage })

// //Create upload endpoint for images
// const imagesPath = path.join(__dirname, '../upload/images');
// console.log('Serving images from:', imagesPath); // Log the path being used
// router.use('/images', express.static(imagesPath));


// router.post('/upload', upload.single('product'), (req, res) => {
//     res.json({
//         success: 1,
//         image_url: `http://localhost:${port}/images/${req.file.filename}`
//     })
// })






router.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({}); // all products in one array
        let id;
        if (products.length > 0) {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.id + 1;
        } else {
            id = 1;
        }

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price
        });

        await product.save();
        console.log("Saved");

        res.json({
            success: true,
            name: req.body.name
        });
    } catch (error) {
        console.error("Error saving product:", error.message);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
});


//creating api for deleting products
router.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id})
    console.log("removed")
     res.json({
        success:true,
        name:req.body.name,
     })
})

//creating api for getting all products
router.get('/allproducts',async(req,res)=>{
    let products = await Product.find({})
    console.log("all products fetched")
    res.send(products)
})


//creating api for newcollection data
router.get('/newcollections',async(req,res)=>{
    let products = await Product.find({})
    let newcollections = products.slice(1).slice(-8)
    res.send(newcollections)
})

//creating endpoint for popular in women
router.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"})
    let popular_in_women = products.slice(0,4)
    res.send(popular_in_women)
})

//creating endpoint for fetching user
const fetchuser = async (req,res,next)=>{
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error:"Please authenticate using valid token"})
    }
    else{
        try {
            const data = jwt.verify(token,"secret_ecom")
            req.user = data.user
            next()
        } catch (error) {
            res.status(401).send({error:"Please authenticate using valid token"})
        }
    }
}
//creating endpoint for adding products in cartdata
router.post('/addtocart', fetchuser,async(req,res)=>{
    
    let userdata = await User.findOne({_id:req.user.id})
    userdata.cartData[req.body.itemId] += 1
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData})
    res.json({ message: "Product added to cart" })
})

////creating endpoint to remove products from cartdata
router.post('/removefromcart', fetchuser,async(req,res)=>{
    
    let userdata = await User.findOne({_id:req.user.id})
    if(userdata.cartData[req.body.itemId] >0)
    userdata.cartData[req.body.itemId] -= 1
    await User.findOneAndUpdate({_id:req.user.id},{cartData:userdata.cartData})
    res.json({ message: "Product removed to cart" })
})

////creating endpoint to get cartdata
router.post('/getcart', fetchuser,async(req,res)=>{
    console.log("get cart")
    let userdata = await User.findOne({_id:req.user.id})
    res.json(userdata.cartData)
})

//endpoint for registering the user
router.post('/signup',async(req,res)=>{
    let check = await User.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,error:"exisiting user"})
    }
    let cart = {};
    for(let i=0;i<300;i++){
        cart[i]=0
    }
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save()
    const data={
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,'secret_ecom')
    res.json({success:true,token})
})


//creating endpoint for user login 
router.post('/login',async(req,res)=>{
    let user = await User.findOne({email:req.body.email})
    if(user){
        const passcompare = req.body.password===user.password
        if(passcompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom')
            res.json({success:true,token})
        }
        else{
            res.json({success:false,error:"Wrong password"});
        }
    }
    else{
        res.json({success:false,error:"wrong email"});
    }
})


module.exports = router;