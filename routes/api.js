const express = require("express");
const app = express()
const route = express.Router();
const request = require("request");
const Cake = require("./../model/Modal");
const Category = require("./../model/CategoryModal");
const Order = require('./../model/Order')
const data = require("./../model/data1");
const cakes = data.cakeData;
const categories = data.categories;
const multer = require("multer");
const path = require("path");
const _ = require("lodash");
const { initializePayment, verifyPayment } = require("./../paystack")(
  request
);
const { response } = require("express");

//const MySecretKey = "Bearer sk_test_xxxx";




route.post('/pay', ((req, res) => {
   
  const form = {
    full_name: req.body.full_name,
     amount : req.body.amount,
  email : req.body.email
  };
    initializePayment(form, (error, body)=>{
        if(error){
            //handle errors
          console.log(error);
          res.status(404).json({msg: error })
            return;
      }
      const response = JSON.parse(body);
  
      res.send(response.data.authorization_url)
    });
}))

route.get("/paystack/callback", (req, res) => {
  const ref = req.query.reference;

  verifyPayment(ref, (error, body) => {
    if (error) {
   
      return res.redirect("/error");
    }
    const response = JSON.parse(body);
    console.log(response)
    res.json(response)
  });
});
   



  

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Init Upload

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

route.post("/cakes", upload, (req, res) => {
  
  if (req.file == undefined) {
    res.json({
      msg: "Error: No File Selected!",
    });
  } else {
    const cake = new Cake({
      name: req.body.name,
      amount: req.body.amount,
      image: req.file.path,
      category: req.body.category,
    });

    cake
      .save()
      .then((data) => {
         if (data) {
           res.json(data);
         } else {
           res.status(404).send("cake not saved");
         }
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  }
});

route.get("/cakes", (req, res) => {
  Cake.find()
    .then((data) => {
       if (data) {
         res.json(data);
       } else {
         res.status(404).send("cakes doesnt exist");
       }
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.get("/types/:category", (req, res) => {

  Cake.find({ category: req.params.category })
    .then((data) => {
      if (data) {
         res.json(data);
      } else {
        res.status(404).send('category doesnt exist')
      }
     
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.post("/cakes/category", (req, res) => {
  const category = new Category({
    name: req.body.name,
  });

  category
    .save()
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).send("category not saved");
      }
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

route.get("/cakes/categories", (req, res) => {
  Category.find()
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).send("categories doesnt exist");
      }
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

//for saving orders to db
route.post('/orders', ((req, res) => {

  const order = new Order({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone,
    address: req.body.address,
    state: req.body.state,
    lga: req.body.lga,
    payment_type: req.body.payment_type,
    delievery_type: req.body.delievery_type,
    cart: req.body.cart,
    status: 'not paid',
    order_id: req.body.order_id,
  });

  order.save().then((data) => {
    if (data) {
      res.json(data);
    } else {
      res.status(404).send("order not saved");
    }
  }).catch((err) =>{
    res.status(404).json({msg: err})
  })
}))

//for updating orders

route.patch('/orders/:id', ((req, res) => {
  Order.updateOne(
    { order_id: req.params.id },
    {
      $set: {
        status: 'paid'
      },
    }
  )
    .then((data) => {
      console.log(data)
     if (data) {
       res.json(data);
     } else {
       res.status(404).send("order doesnt exist");
     }
    })
    .catch((err) => {
      res.status(404).json({err})
    });
}))

module.exports = route;
