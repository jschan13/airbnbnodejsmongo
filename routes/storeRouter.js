//const path=require("path")
//const rootDir=require("../utils/pathUtil")
const bodyParser=require("body-parser");

const express=require("express");
//const { register } = require("module");
const storeRouter=express.Router();

const storeController=
require("../controllers/storeController");

storeRouter.use(bodyParser.urlencoded());

storeRouter.get("/",storeController.getIndex)

storeRouter.get("/homes",storeController.getHomes)

storeRouter.get("/bookings",storeController.getBookings)

storeRouter.post("/favourites",storeController.postAddToFavourite)


storeRouter.get("/favourites",storeController.getFavouriteList)

storeRouter.get("/homes/:homeId",storeController.getHomeDetails)


storeRouter.post("/favourites/delete/:homeId",storeController.postRemoveFromFavourite)

module.exports=storeRouter;
