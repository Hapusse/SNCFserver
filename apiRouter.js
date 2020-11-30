// Imports

var express = require('express');
const adminCtrl = require('./routes/adminCtrl');
var clientsCtrl = require('./routes/clientsCtrl');

//Router

exports.router = (function() {
    var apiRouter = express.Router();
    
    //Users routes
    apiRouter.route('/users/register/').post(clientsCtrl.register);
    apiRouter.route('/users/login/').get(clientsCtrl.login);
    apiRouter.route('/users/me/').get(clientsCtrl.getUserProfile);
    apiRouter.route('/users/me/changePassword/').put(clientsCtrl.changePassword);
    apiRouter.route('/users/me/cancelReservation/').put(clientsCtrl.cancelReservation);
    apiRouter.route('/users/me/newReservation/').put(clientsCtrl.newReservation);
    apiRouter.route('/admin/creation/voiture/').post(adminCtrl.voitureCreator);
    apiRouter.route('/admin/creation/gare/').post(adminCtrl.gareCreator);
    apiRouter.route('/admin/creation/reduction/').post(adminCtrl.reductionCreator);
    apiRouter.route('/admin/creation/train/').post(adminCtrl.trainCreator);

    return apiRouter;
})();