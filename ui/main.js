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
                var comments= request.responseText;
                comments=JSON.parse(comments);
                var list='';
                
                for(var i=0;i<comments.length; i++)
                {
                    list += '<li>' + comments[i] + '</li>'; 
                }
                
                var ul = document.getElementById('commentlist');
                ul.innerHTML = list;
            }
        }
    };
    
    //make request
    var commentInput= document.getElementById('comment');
    var comment=commentInput.value;
    request.open('GET', 'http://shradhaajr.imad.hasura-app.io/submit-comment?comment=' + comment, true);
    request.send(null);
};