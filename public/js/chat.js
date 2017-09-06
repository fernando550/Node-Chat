var socket = io();

function scrollToBottom(){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function(){
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function(msg) {
    var formatTime = moment(msg.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        from: msg.from,
        text: msg.text,
        createdAt: formatTime
    });
    
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newGeoLocation', function(msg){
    var formatTime = moment(msg.createdAt).format('h:mm a');
    var template = jQuery('#location-template').html();
    var html = Mustache.render(template, {
        from: msg.from,
        createdAt: formatTime,
        url: msg.url
    });
    
    jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    
    var messageTextBox = jQuery('[name=message]');
    
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function (){
        messageTextBox.val('');
    });
});

var btnLocation = jQuery('#geolocation');

btnLocation.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported.');
    }
    
    btnLocation.attr('disabled', 'disabled').text('Sending...');
    
    navigator.geolocation.getCurrentPosition(function(position){
        btnLocation.removeAttr('disabled').text('Send Location');
        
        socket.emit('createGeoLoc', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, function(){
            btnLocation.removeAttr('disabled').text('Send Location');
            alert('Unable to retrieve location.')
        });
    });
})