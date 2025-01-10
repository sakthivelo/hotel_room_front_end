const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const hotels = require('./hotels/hotels');
const bookings = require('./bookings/bookings')



const app = express();


app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        ifEquals: (arg1, arg2, options) => {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
        }
    },
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}));
// Set up Handlebars as the template engine
//app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended:false}))
app.use(express.json());


app.use('/hotels', hotels);
app.use('/bookings', bookings);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
