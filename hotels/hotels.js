const router = require('express').Router();
const fetch = require("node-fetch");
const API_URL = "http://localhost:3001/";


router.get('/hotels', (req, res) => {
    const location = req.query.location?req.query.location:'';
    fetch(API_URL+'hotel/hotels?location='+location,{
        method:'GET',
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    .then(response=>response.json())
    .then(data=>{
        const hotels = data.hotels;
        if(location){
            res.render('partials/hotelListPartial',  {hotels, layout: false} );
        } else {
            res.render('hotels', { title: 'Available hotels' ,hotels});
        }
        
    })
    .catch(error=>{
        res.render('hotels', { title: 'Available hotels' ,error:error});
    })
    
});


module.exports = router;

