const router = require('express').Router();
const fetch = require("node-fetch");
const API_URL = "http://localhost:3001/";


// Define the root route
router.get('/book/:id', (req, res) => {
    const hotelId = req.params.id;
    fetch(API_URL+'hotel/fetchHotelDetails?hotelId='+hotelId,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response=>response.json())
    .then(data=>{
        res.render('index', { title: 'Hotel Room Booking', data ,hotelId, action:'roombooking' });
    })
    .catch(error=>{
        res.render('index', { title: 'Hotel Room Booking', error:'No records found!' });
    })
    
});
router.get('/mybookings/:user', (req, res) => {
    const user = req.params.user;
    fetch(API_URL+'booking/mybookings?user='+user,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response=>response.json())
    .then(data=>{
        res.render('mybookings', { title: 'My Bookings', data });
    })
    .catch(error=>{
        res.render('index', { title: 'Hotel Room Booking', error:'No records found!' });
    })
    
});


router.get('/editBooking/:id', (req, res) => {
    const bookingId = req.params.id;
    fetch(API_URL+'booking/fetchBookingDetails?id='+bookingId,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response=>response.json())
    .then(data=>{
        res.render('index', { title: 'Hotel Room Booking', data, hotelId:'',  action:'updatebooking' });
    })
    .catch(error=>{
        res.render('index', { title: 'Hotel Room Booking', error:'No records found!' });
    })
    
});
router.post('/roombooking', (req, res) => {
    const roomObj = req.body;
    roomObj.userId = 'guest';
    roomObj.status = 'Booked';
    fetch(API_URL+'booking/bookroom', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomObj)
    }
    ).then(response=>response.json())
    .then(data=>{
        res.render('index', { msg: 'Your room booked successfully!' });
    }).catch(error=>{
        res.render('index', { errMsg: 'Error in booking room! :'+error });
    })
    
});

router.post('/updatebooking', (req, res) => {
    const roomObj = req.body;
    roomBookingId = roomObj.roomId;
    fetch(API_URL+'booking/updatebooking', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: roomBookingId,
            roomDetails: {
                numberOfRooms: roomObj.numberOfRooms,
                checkInDate: roomObj.checkInDate,
                checkOutDate: roomObj.checkOutDate,
            }
        })
    }
    ).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        res.render('index', { msg: 'Your room updated successfully!' });
    })
    .catch(error => {
        res.render('index', { msg: 'Error in booking room! :' + error.message });
    });
    
});

router.get('/cancelBooking/:id', (req, res) => {
    const roomBookingId = req.params.id;
    fetch(API_URL+'booking/cancelbooking', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: roomBookingId,
            roomDetails: {
                status:'Cancelled',
            }
        })
    }
    ).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        res.render('index', { msg: 'Your room updated successfully!' });
    })
    .catch(error => {
        res.render('index', { msg: 'Error in booking room! :' + error.message });
    });
    
});

module.exports = router;
