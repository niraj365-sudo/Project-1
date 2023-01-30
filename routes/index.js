const express = require("express");
const router = express.Router();
const { ensureAuthenticated} = require('../config/auth');
const Image = require("../models/Image");
const upload = require('../handler/multer')
const cloudinary = require('cloudinary')
const path = require('path')
//router.get('/',(req,res)=>res.render('welcome'))
function escapeRegex(text) {
  var exp = /([A-Z])\w+/g
  return text.replace(exp, '\$&');
}
//Welcome Page
router.get("/", async(req, res) => {
  // const images = await Image.find()
  // res.render('welcome', {
  //   images
  // })
  // console.log(images);
  Image.find().exec(async function (err, results) {
     var imageCount = results.length;
     const id = results._id;
 
  if (req.query.search) {
    console.log(req.query.search);
    const regex = new RegExp(escapeRegex(req.query.search), "gi"); // g= global ; i=ignore case or smth
    await Image.find(
      { $or: [{ address: regex }] },
     //{ address: regex  },
      async function (err, images) {
        console.log(images)
        if (err) {
          throw err;
        } else {
          if (images.length < 1) {
            req.flash(
              "error_msg",
              "Sorry! Address not found,please try again"
            );
            res.redirect("/");
          } else {
            res.render("welcome", {
              //imageCount,
              images: images, 
              //user: req.user
            });
          }
        }
      }
    ).clone();
  } else {
    console.log("error");
    // To view all images
    const images = await Image.find({});
   // console.log(images);
    res.render("welcome", {
     // imageCount,
      images,
     // user: req.user,
    });
  }
})
});

// ensureAuthenticated
//Dashboard Admin
router.get("/dashboard", ensureAuthenticated, async (req,res)=>{
 if (req.query.search) {
   console.log(req.query.search);
   const regex = new RegExp(escapeRegex(req.query.search), "gi"); // g= global ; i=ignore case or smth
   await Image.find(
     { $or: [{ address: regex }] },
    //{ address: regex  },
     async function (err, images) {
       console.log(images)
       if (err) {
         throw err;
       } else {
         if (images.length < 1) {
           req.flash(
             "error_msg",
             "Sorry! Address not found,please try again"
           );
           res.redirect("/dashboard");
         } else {
           res.render("dashboard", {
             //imageCount,
             images: images, //just doctors yo line ma incase --->const doctors
             //user: req.user, //which is done above
           });
         }
       }
     }
   ).clone();
 } else {
   console.log("error");
   // To view all images
   const images = await Image.find({});
  // console.log(images);
   res.render("dashboard", {
    // imageCount,
     images,
    // user: req.user,
   });
 }
})

//Dashboard Detail for User
router.get('/image/:id', async(req,res)=>{
  console.log(req.params.id);
  const imgId = req.params.id
  const image = await Image.findById(req.params.id)
    res.render('User-portfolio-details', {image})
})

//Viewing images as admin
router.get('/image/admin/:id',ensureAuthenticated, async(req,res)=>{
  console.log(req.params.id);
  const imgId = req.params.id
  const image = await Image.findById(req.params.id)
    res.render('Admin-portfolio-details', {image})
})

//Delete Images by Admin
router.get('/image/admin/delete/:id', async(req, res)=>{
  console.log(req.params.id);
  const imgId = req.params.id
  const image = await Image.findById(req.params.id)
  await image.deleteOne()  
  res.redirect('/dashboard')
})

//Update 
router.post('/image/admin/update/:id',upload.single('myImage'), async(req, res)=>{
  try {
      const imgId = req.params.id
      const image = await Image.findById(imgId)
      const result = await cloudinary.v2.uploader.upload(req.file.path)
      await image.updateOne({
      imageURL: result.secure_url,
       price : req.body.price,
       address: req.body.address,
       contact: req.body.contact,
       description: req.body.description
      })
     
      ,(err, data)=>{
        if(err){
          console.log(err);
        }
        else{
        console.log(data);
        }
      }
      
       res.redirect('/dashboard')
      console.log(image._id);
     // res.json({msg: "Success", image})

  } catch (error) {
      console.log(error);
       res.redirect('/dashboard')
      //res.json({msg: "Error"})
      
  }
})

module.exports = router;
