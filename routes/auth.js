const express = require('express')
const User = require ('./../model/User')
const authRouter = express.Router()
const {handleRegistrationValidation} = require('./../model/validation')
const { handleLoginValidation } = require("./../model/validation");
const { handleAccountUpdateValidation } = require("./../model/validation");
const jwt = require('jsonwebtoken')
const nodeMailer = require('nodemailer')
const bcrypt = require("bcrypt");
const verify = require('./verifyToken')


const transporter = nodeMailer.createTransport({

  host: 'smtp.gmail.com',
  
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  secure: false,
  port: 587,
});



authRouter.get('/', ((req, res) => {
    res.send('hello world')
    
}))

authRouter.post("/register", (req, res) => {
    const error = handleRegistrationValidation(req.body)

    if (error.error) {
        res.status(200).json({ msg: error.error.details[0].message });
     
    } else {

        const found = User.findOne({ email: req.body.email }).then((data) => {
         
            if (data) {
                 
               res.status(200).json({ msg: "Email already exists" });
            } else {
                bcrypt.genSalt(10, (err, salt)=> {
                  bcrypt.hash(req.body.password, salt, (err, hash)=> {
                    // Store hash in your password DB.
                      if (err) {
                          
                      } else {
                          const user = new User({
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            email: req.body.email,
                            password: hash,
                            phone: req.body.phone,
                          });

                          user
                            .save()
                            .then((data) => {
                              res.send({msg: 'please check your email to confirm'});
                             
                              const token = jwt.sign({ _id: data._id }, process.env.TOKEN_SECRET)
                              const URL = `http://localhost:4000/user/confirm_email/${token}`;
                              transporter.sendMail({
                                from: process.env.EMAIL,
                                to: data.email,
                                subject: 'Confirm Email',
                                html: `Please click this link to confirm your email ${URL}`
                              }).then((data) => {
                                console.log(data)
                              }).catch((err) => {
                                console.log(err)
                              })
                            })
                            .catch((err) => {
                              console.log(err);
                              res.send(err);
                            });
                      }
                        
                  });
                });
             
             }
        })

        
    }    
});

authRouter.patch("/user_account/:id", (req, res) => {
  const error = handleAccountUpdateValidation(req.body);

  if (error.error) {
    res.status(200).json({ msg: error.error.details[0].message });
     
  } else {
 User.updateOne(
     {_id: req.params.id },
     {
       $set: {
         first_name: req.body.first_name,
         last_name: req.body.last_name,
         address: req.body.address,
         phone: req.body.phone,
         state: req.body.state,
         lga: req.body.lga,
       },
     }
   )
     .then((data) => {
       //console.log(data);
       if (data) {
         res.json({msg: 'successfully updated', data});
       } else {
         res.send({msg: "user doesnt exist"});
       }
     })
     .catch((err) => {
       res.status(404).json({ err });
     });
  }


 
});

authRouter.post("/login", (req, res) => {
    const error = handleLoginValidation(req.body);
    if (error.error) {
         res.status(200).json({ msg: error.error.details[0].message });
    } else {
         User.findOne({ email: req.body.email })
           .then((data) => {            
             if (data) {
               if (data.confirmed == true) {
                      bcrypt.compare(
                        req.body.password,
                        data.password,
                        (err, result) => {
                          // result == true
                          if (result) {
                            const token = jwt.sign(
                              { _id: data._id },
                              process.env.TOKEN_SECRET
                            );
                            //res.header('auth-token', token);
                            res.json({token: token });
                          } else {
                            res.json({ msg: "wrong password" });
                          }
                        }
                      );
               }
               else {
                 res.json({msg: 'verify email first'})
               }
           
             } else {
               res.json({ msg: "no user with such email" });
             }
           })
           .catch(() => {});
    } 
});




authRouter.get("/user-account", verify, (req, res) => {   
    User.findById(req.user._id).then((data) =>{
        if (data) {
            res.json(data)
        } else {
            res.status(200).json({msg: 'user not found'})
        }
    }).catch(() => {
        
    })
    
});

authRouter.get("/confirm_email/:token", (req, res) => {
    const token = req.params.token;

    if (token) {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);

      if (verified) {
      User.updateOne(
        { _id: verified._id},
        {
          $set: {
           confirmed: true
          },
        }
      ).then((data) => {
        res.send({msg: 'successfully confirmed email'})
      }).catch((err)=>{})
      } else {
        res.send({msg: "invalid"});
      }
    } else {
      res.send({ msg: "access denied" });
    }
});

module.exports = authRouter