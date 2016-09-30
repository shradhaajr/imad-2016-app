console.log('Loaded!');

var button = document.getElementById("counter");
button.onclick = function () {
    
    //create request
    var request = new XMLHttpRequest();
    
    //capture the response and store it variable
    request.onreadystatechange = function () {
        if(request.readyState == XMLHttprequest.DONE) {
            //take some action
            if(request.status == 200) {
                var counter = request.responseText;
                var span = document.getElementById("count");
                span.innerHTML = counter.toString();
            }
        }
    };
    
    //make request
    request.open('GET', 'http://shradhaajr.imad.hasura-app.io/counter', true);
    request.send(null);
    
    
};