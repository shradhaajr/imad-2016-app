console.log('Loaded!');

//change the text of the main-text div
var element = document.getElementById('main-text');
element.innerHTML = 'This is being set by Javascript!';

//move image on clicking
var img = document.getElementById('madi');
img.onclick = function (){
    var interval = setInterval(moveRight, 100);
};