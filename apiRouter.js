// Imports

var express = require('express');
var adminCtrl = require('./routes/adminCtrl');
var clientsCtrl = require('./routes/clientsCtrl');

//Router

exports.router = (function() {
    var apiRouter = express.Router();
    
    //Ensemble des routes utilisables dans l'API :
    apiRouter.route('/users/register/').post(clientsCtrl.register);
    apiRouter.route('/users/login/').post(clientsCtrl.login);
    apiRouter.route('/users/me/').post(clientsCtrl.getUserProfile);
    apiRouter.route('/users/me/changePassword/').put(clientsCtrl.changePassword);
    apiRouter.route('/users/me/changePersonnalData/').post(clientsCtrl.changePersonnalData);
    apiRouter.route('/users/me/cancelReservation/').put(clientsCtrl.cancelReservation);
    apiRouter.route('/users/me/myReservations/').get(clientsCtrl.getMyReservations);
    apiRouter.route('/users/me/myReservations/newReservation/').post(clientsCtrl.newReservation);
    apiRouter.route('/admin/creation/voiture/').post(adminCtrl.voitureCreator);
    apiRouter.route('/admin/creation/gare/').post(adminCtrl.gareCreator);
    apiRouter.route('/admin/creation/reduction/').post(adminCtrl.reductionCreator);
    apiRouter.route('/admin/creation/train/').post(adminCtrl.trainCreator);
    apiRouter.route('/admin/creation/trajet/').post(adminCtrl.trajetCreator);
    apiRouter.route('/search/gares/').get(clientsCtrl.searchGares);
    apiRouter.route('/search/reductions/').get(clientsCtrl.searchReductions);
    apiRouter.route('/search/trajets/').post(clientsCtrl.searchTrajets);
    apiRouter.route('/admin/search/trains/').post(adminCtrl.searchTrain);
    apiRouter.route('/admin/search/voitures/').post(adminCtrl.searchVoiture);

    return apiRouter;
})();