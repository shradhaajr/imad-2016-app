console.log('Loaded!');

//change the text of the main-text div
var element = document.getElementById('main-text');
element.innerHTML = 'This is being set by Javascript!';

//move image on clicking
var img = document.getElementById('madi');
function moveRight() {
  marginLeft = marginLeft +10;
  img.style.marginLeft = marginLeft + 'px';
}
img.onclick = function (){
    var interval = setInterval(moveRight, 100);
};