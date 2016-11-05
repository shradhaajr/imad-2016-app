console.log('Loaded!');

//submit username/password
var submit=document.getElementById('submit_btn_login');
submit.onclick= function() {
    //make a request to the server and send the name
    
     //create request
    var request = new XMLHttpRequest();
    
    //capture the response and store it variable
    request.onreadystatechange = function () {
        if(request.readyState == XMLHttpRequest.DONE) {
            //take some action
            if(request.status == 200) {
                console.log('user logged in');
                alert('loged in successfully');
            }else if(request.status === 403) {
                alert('username/password is incorrect');
            }else if(request.status === 500){
                alert('something went wrong on the server');
            }
        }
    };
    
    //make request
    var username= document.getElementById('username').value;
    var password= document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open('POST', 'http://shradhaajr.imad.hasura-app.io/login', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({username: username, password: password}));
};

//--------------------------------------------------------------------------------------

//submit comment

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
                //capture a list of comments and render it as a list
                var comments= request.responseText;
                comments=JSON.parse(comments);
                var list='';
                
                for(var i=comments.length-1;i>=0; i--)
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
    commentInput.value="";
};