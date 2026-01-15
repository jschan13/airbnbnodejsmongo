
//const Favourite = require('../models/favourite');
const Home = require('../models/home');
const user = require('../models/user');

exports.getAddHome=(req,res,next)=>
{
  res.render('host/edit-home',{pageTitle:'Add New Home',currentPage:'addHome',
     editing:false,
      isLoggedIn:req.isLoggedIn,
    user:req.session.user,
  })
    
}


exports.getEditHome=(req,res,next)=>
{
  const homeId=req.params.homeId;
  const editing=req.query.editing==='true';

  Home.findById(homeId).then(home=>
    {
      if(!home)
      {
        console.log("Home not found");
        return res.redirect('/host/host-home-list');
      }
      res.render('host/edit-home',{
        home:home,
        pageTitle:'Edit your  Home',currentPage:'host-homes', editing:editing,
         isLoggedIn:req.isLoggedIn,
          user:req.session.user,
  })
  })
    
}



exports.postAddHome=(req,res,next)=>
{
  const{houseName,price,location,rating,photoUrl,description}=req.body;
 const home=new Home({houseName,price,location,rating,photoUrl,description});
 home.save().then(()=>{
  console.log("home saved successfully");
 })
   res.redirect('/host/host-home-list');
}




exports.getHostHomes= (req,res,next)=>
{
    Home.find().then(registeredHomes=>{
  res.render('host/host-home-list',{
  registeredHomes:registeredHomes,pageTitle:'Host Homes List',currentPage:'host-homes',
   isLoggedIn:req.isLoggedIn,
    user:req.session.user,
})
})
  }



exports.postEditHome=(req,res,next)=>
{
  const{id,houseName,price,location,rating,photoUrl,description}=req.body;
 Home.findById(id).then((home)=>
{home.houseName=houseName;
 home.price=price;
 home.location=location
 home.rating=rating
  home.photoUrl=photoUrl
  home.description=description

 home.save().then(result=>{
  console.log(result);
 }).catch(err=>{
  console.log("error while updating",err)
 })
 res.redirect('/host/host-home-list')
}).catch(err=>{
  console.log("error while finding  home",err)
 })
}

exports.postDeleteHome=(req,res,next)=>
{
  const homeId=req.params.homeId;
  //console.log("Deleting Home with id:",homeId);
  Home.findByIdAndDelete(homeId).then(()=>{
    res.redirect('/host/host-home-list');
          }).catch(error=>{
         
            console.log("error in deleting",error);
          
        })
  
  }


