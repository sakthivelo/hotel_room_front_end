const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const fetch = require("node-fetch");


const API_URL = "http://localhost:3001/";
const app = express();


app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        ifEquals: (arg1, arg2, options) => {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
        }
    }
}));
// Set up Handlebars as the template engine
//app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({extended:false}))
app.use(express.json());

// Define the root route
app.get('/book/:id', (req, res) => {
    const hotelId = req.params.id;
    fetch(API_URL+'fetchHotelDetails?hotelId='+hotelId,{
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
app.get('/mybookings/:user', (req, res) => {
    const user = req.params.user;
    fetch(API_URL+'mybookings?user='+user,{
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

app.get('/hotels', (req, res) => {
    const val = req.params.location;
    fetch(API_URL+'hotels',{
        method:'GET',
        headers: {
            'Content-Type' : 'application/json'
        }
    })
    .then(response=>response.json())
    .then(data=>{
        const hotels = data.hotels;
        res.render('hotels', { title: 'Available hotels' ,hotels});
    })
    .catch(error=>{
        res.render('hotels', { title: 'Available hotels' ,error:error});
    })
    
});

app.get('/editBooking/:id', (req, res) => {
    const bookingId = req.params.id;
    fetch(API_URL+'fetchBookingDetails?id='+bookingId,{
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response=>response.json())
    .then(data=>{
        const bookedRoom = data.bookingDetails;
        res.render('index', { title: 'Hotel Room Booking', bookedRoom ,hotelId:'',  action:'updatebooking' });
    })
    .catch(error=>{
        res.render('index', { title: 'Hotel Room Booking', error:'No records found!' });
    })
    
});
app.post('/roombooking', (req, res) => {
    const roomObj = req.body;
    roomObj.userId = 'guest';
    roomObj.status = 'Booked';
    fetch(API_URL+'bookroom', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomObj)
    }
    ).then(response=>response.json())
    .then(data=>{
        console.log(data)
        res.render('index', { msg: 'Your room booked successfully!' });
    }).catch(error=>{
        console.log(error);
        res.render('index', { msg: 'Error in booking room! :'+error });
    })
    
});

app.post('/updatebooking', (req, res) => {
    const roomObj = req.body;
    roomBookingId = roomObj.roomId;
    fetch(API_URL+'updatebooking', {
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
        console.log(data);
        res.render('index', { msg: 'Your room updated successfully!' });
    })
    .catch(error => {
        console.error('Error:', error);
        res.render('index', { msg: 'Error in booking room! :' + error.message });
    });
    
});

app.get('/cancelBooking/:id', (req, res) => {
    const roomBookingId = req.params.id;
    fetch(API_URL+'cancelbooking', {
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
