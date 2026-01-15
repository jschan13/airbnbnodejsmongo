const { check, validationResult } = require("express-validator")
const User=require('../models/user');
const bcrypt=require('bcryptjs');
const { use } = require("react");
const user = require("../models/user");



exports.getLogin=(req,res,next)=>
{
  res.render('auth/login',{pageTitle:'Login',currentPage:'login',
     editing:false,
     isLoggedIn:false,
    errors:[], 
     oldInput:
     {email:''},
  user:{}
    })    
}



exports.getSignup=(req,res,next)=>
{
  res.render('auth/signup',{pageTitle:'Signup',currentPage:'signup',
     editing:false,
     isLoggedIn:false,
     errors:[], 
     oldInput:{firstName:'',lastName:'',email:'',userType:''},
     user:{},

  })    
}





exports.postLogin=async(req,res,next)=>
{
console.log(req.body);
const {email,password}=req.body;
 
 // const errors=validationResult(req);
const user=await User.findOne({email});
  if(!user)
  {
    return res.status(422).render('auth/login',{
      pageTitle:'Login',
      currentPage:'login',
      isLoggedIn:false,
      errors:['Invalid email or password'],
      oldInput:{email},
    user:{}
    })
  }
 

const isMatch=await bcrypt.compare(password,user.password);
 if(!isMatch)
 {
   return res.status(422).render('auth/login',{
     pageTitle:'Login',
     currentPage:'login',
     isLoggedIn:false,
      errors:['Invalid  password'],
      oldInput:{email},     
    user:{}
   })
 }

 console.log('User logged in successfully');
  req.session.user=user;  
await req.session.save();


  req.session.isLoggedIn=true;
 // res.cookie('isLoggedIn',true);
  res.redirect("/");
 
}



exports.postSignup=[
  check('firstName')
  .trim()
  .isLength({min:2})
  .withMessage('First Name must be at least 2 characters long')
  .matches(/^[A-Za-z\s]+$/)
  .withMessage('First Name must contain only alphabets'),

    check('lastName')
  .trim()
  .isLength({min:2})
  .withMessage('Last Name must be at least 2 characters long')
  .matches(/^[A-Za-z\s]*$/)
  .withMessage('Last Name must contain only alphabets'),

  check('email')
  .isEmail()
  .withMessage('Please enter a valid email address')
  .normalizeEmail(),

  check('password')
  .isLength({min:8})
  .withMessage('Password must be at least 8 characters long')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[\W_]/)
  .withMessage('Password must contain at least one special character')  ,

  check('confirmPassword')
  .trim()
  .custom((value,{req})=>{
    if(value!==req.body.password)
    {
      throw new Error('Passwords do not match');
    }
    return true;
  }),

  check('userType')
  .notEmpty()
  .withMessage('User Type is required')
  .isIn(['guest','host'])
  .withMessage('Invalid User Type'),

  check('terms')
  .notEmpty()
  .withMessage('You must accept the terms and conditions')
  .custom((value)=>{
    if(value!=='on')
    {
      throw new Error('You must accept the terms and conditions');
    }
    return true;
  }), 
  
  
  
  
  (req,res,next)=>
{


  const {firstName,lastName,email,password,userType}=req.body;
  const errors=validationResult(req);

  if(!errors.isEmpty())
  {
    return res.status(422).render('auth/signup',{
      pageTitle:'Signup',
      currentPage:'signup',
      isLoggedIn:false,
      errors:errors.array().map(err=>err.msg),
      oldInput:{firstName,lastName,email,password,userType},
       user:{}
    })
  }
  //console.log(req.body);
  //req.session.isLoggedIn=true;
 // res.cookie('isLoggedIn',true);

bcrypt.hash(password, 12)
  .then(hashedPassword => {
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      userType: userType
    })
  return user.save()}).then(result=>{
  console.log('User created successfully');
  res.redirect('/login');
})
.catch(err=>{
 return res.status(422).render('auth/signup',{
      pageTitle:'Signup',
      currentPage:'signup',
      isLoggedIn:false,
      errors:[err.message],
      oldInput:{firstName,lastName,email,password,userType},
      user:{}
    })
})

}]


exports.postLogout=(req,res,next)=>
{
  
  req.session.destroy(()=>{res.redirect("/login");
  })
  
} 
