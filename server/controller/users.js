require('dotenv').config();
const {User, validate} = require('../models/user');
const nodemailer = require('nodemailer');
// const {Verification, validateVerification} = require('../models/verification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

exports.getallusers = async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
  }

exports.createuser = async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
      
  let user = await User.findOne({email: req.body.email})

  if(user) res.status(400).send('User already exists');

  user = new User(_.pick(req.body,['name','email','password']));

  const getSalt = await bcrypt.genSalt(Math.round(Math.random()*10))
  user.password = await bcrypt.hash(user.password, getSalt)   
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ['_id', 'name', 'email']));
}

// exports.signup = async (req, res)=> {
//   console.log(req.body);
//   const {name, email, password} = req.body;
//   User.findOne({email}).exec((err, user)=> {
//     if(user) return res.status(400).json({error:"user with this email address already exists"});
//     let newUser = new User({name, email, password});
//     newUser.save((err,success)=>{
//       if(err)
//       { 
//         console.log("Error in signup: " + err);
//         return res.status(400), json({error:err});
//       }
//       res.json({
//         message: "signup success"
//       });
//     });
//   })
// }


exports.signup = async (req, res)=> {
  console.log(req.body);
  const {name, email, password} = req.body;
  User.findOne({email}).exec(async (err, user)=> {
    if(user) return res.status(400).json({error:"user with this email address already exists"});
    
    const token = jwt.sign({name, email, password},process.env.SECRET, {expiresIn:'20m'});
    console.log(token);

    let mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.USER,
          pass: process.env.PASSWORD
      }
  });

  let mailDetails = {
    from: process.env.USER,
    to: req.body.email,
    subject: 'Account activation link',
    html: `
    <h2>Please click on given link to activate your account</h2>
    <br>
    <a href="${process.env.CLIENT_URL}/authentication/activate/${token}">${process.env.CLIENT_URL}/authentication/activate/${token}</a>
    `
};

await mailTransporter.sendMail(mailDetails, function(err, data) {
  if(err) {
      res.status(400).send('Error Occurs : ' + err.message);
  } else {
      res.status(200).send({message:'Email sent successfully kindly activate your account'});
  }
})

// let newUser = new User({name, email, password});
//     newUser.save((err,success)=>{
//       if(err)
//       { 
//         console.log("Error in signup: " + err);
//         return res.status(400), json({error:err});
//       }
//       res.json({
//         message: "signup success"
//       });
//     })

})}
   

    // let newUser = new User({name, email, password});
    // newUser.save((err,success)=>{
    //   if(err)
    //   { 
    //     console.log("Error in signup: " + err);
    //     return res.status(400), json({error:err});
    //   }
    //   res.json({
    //     message: "signup success"
    //   });
    // })

    exports.emailactivate = async (req,res) => {
      const {token} = req.body;
      if(token){
        jwt.verify(token, process.env.SECRET,(err, decodedToken)=>{
            if(err) return res.status(400).send({message:'incorrect or expired link'});
    const {name,email, password} = decodedToken;
    User.findOne({email}).exec((err, user)=> {
    if(user) return res.status(400).json({error:"user with this email address already exists"});
    let newUser = new User({name, email, password});
    newUser.save((err,success)=>{
      if(err)
      { 
        console.log("Error in signup: " + err);
        return res.status(400).json({error:err});
      }
      res.json({
        message: "signup success"
      });
    });
  })
        })
        // res.status(200).send({message:"User registered successfully."});       
      }else{
        res.status(400).send({error: "signup error"});
      }
    }