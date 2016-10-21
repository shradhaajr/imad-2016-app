console.log('Loaded!');

//submit name

var submit=document.getElementById('submit_btn');
submit.onclick= function() {
    //make a request to the server and send the name
    
     //create request
    var request = new XMLHttpRequest();
    
    //capture the response and store it variable
    request.onreadystatechange = function () {
        if(request.readyState == XMLHttpRequest.DONE) {
            //take some action
            if(request.status == 200) {
                //capture a list of names and render it as a list
                var names= request.responseText;
                names=JSON.parse(names);
                var list='';
                
                for(var i=0;i<names.length; i++)
                {
                    list += '<li>' + names[i] + '</li>'; 
                }
                
                var ul = document.getElementById('namelist');
                ul.innerHTML = list;
            }
        }
    };
    
    //make request
    var nameInput= document.getElementById('name');
    var name=nameInput.value;
    request.open('GET', 'http://shradhaajr.imad.hasura-app.io/submit-name?name=' + name, true);
    request.send(null);
};