var express = require('express');
var router = express.Router();
const auth = require('../controller/apicontroller/auth');
const admin = require('../controller/admincontroller/admin');
const cms = require('../controller/admincontroller/cms');
const provider = require('../controller/admincontroller/providerlist');
const category = require('../controller/category/category');
const service = require('../controller/admincontroller/servicelist');
const booking = require('../controller/admincontroller/booking');
const contactus = require('../controller/admincontroller/contactus');


/* GET home page. */
router.post('/create', auth.createUser );
router.post('/get', auth.get);

// router to render 
router.get('/dashboard', admin.dashboard);
router.get('/login', admin.login);

//router to login dashboard
router.post('/loginpost',admin.loginpost);

// router for profile
router.get('/profile', admin.profile);
router.post('/profileupdate',admin.edit_profile);
router.get('/password', admin.password);
router.post('/updatepassword',admin.updatepassword);
router.get('/logout', admin.logout);

// router for userlist
router.get('/userlist', admin.user_list);
router.get('/view/:id', admin.view);
router.post('/delete/:id',admin.user_delete);
router.post('/status', admin.user_status);
router.post('/images', admin.images);

//router for cms
router.get('/privacy', cms.privacy);
router.post('/privacy', cms.privacy_update);
router.get('/aboutus', cms.aboutus);
router.post('/aboutus', cms.aboutusupdate);
router.get('/term',cms.term);
router.post('/term', cms.terms);

// router for provider list
router.get('/providerlist', provider.provider_list);
router.get('/workerlist', admin.Worker_list);

// router for category
router.post('/category', category.createcategory );
router.get('/categorylist',category.Categorylist);
router.post('/statuschange', category.status);
router.post('/deletes/:id',category.delete);
router.get('/categoryview/:id',category.categoryview);
router.get('/addcategory',category.addcategory);

// router for service
router.post('/service', service.createservice);
router.get('/servicelist', service.getservice);
router.post('/servicestatus', service.status);
router.post('/deleted/:id', service.delete);
router.get('/serviceview/:id', service.serviceview);
router.get('/serviceadd',service.serviceadd);


// router for booking
router.post('/booking', booking.createBooking );
router.get('/bookinglist',booking.getBooking);
router.post('/bookingstatus', booking.bookingstatus);
router.post('/deletebooking/:id',booking.deletebooking);
router.get('/bookingview/:id', booking.bookingview);


// router for contactus
router.post('/createcontactus',contactus.createcontactus);
router.get('/contactus',contactus.getcontactus);
router.post('/deletecontact/:id',contactus.deletecontact);
router.get('/viewcontact/:id',contactus.contactview);


module.exports = router;
