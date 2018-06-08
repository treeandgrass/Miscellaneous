require('mongoose').connect('mongodb://localhost/car-management').catch(err => {
    console.log(err);
});
