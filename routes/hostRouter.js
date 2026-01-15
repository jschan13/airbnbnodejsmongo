//const path=require('path')
const express=require("express");
//const { register } = require("module");
const bodyParser=require("body-parser");
const hostRouter=express.Router();
//const rootDir=require("../utils/pathUtil")




hostRouter.use(bodyParser.urlencoded());


const hostController=
require("../controllers/hostController");

hostRouter.get("/add-home",hostController.getAddHome)



hostRouter.post("/add-home",hostController.postAddHome)

hostRouter.get("/host-home-list",hostController.getHostHomes)


hostRouter.get("/edit-home/:homeId",hostController.getEditHome)


hostRouter.post("/edit-home",hostController.postEditHome)

hostRouter.post("/delete-home/:homeId",hostController.postDeleteHome)
module.exports=hostRouter;
//exports.hostRouter=hostRouter;

