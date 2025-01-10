function filterHotels(filter){
    jQuery.ajax({
        url: '/hotels/hotels',
        method: 'GET',
        data: { location: filter },
        success: function(response) {
            console.log("response",response)
            jQuery('#hotelList').html(response);
        },
        error: function(error) {
            console.error('Error fetching hotels:', error);
        }
    });
}