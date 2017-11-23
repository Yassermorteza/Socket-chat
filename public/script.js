var form = document.querySelector('form');
var showMessages = document.querySelector('.show-msg');
var clear = document.querySelector('.clear-btn');

var socket = io();

fetch('/load-archive').then(res=> res.json()).then(displayChat).catch(err=> console.log(err));

form.addEventListener('submit', handleMsg);

function handleMsg(e){
	e.preventDefault();
	var msg = { message:e.target.message.value, name:e.target.name.value};
    socket.emit('chat', msg);
    e.target.message.value = '';
    fetch('/', {method: 'POST', body:{}}).then(res=> res.json()).then(displayChat).catch(err=> console.log(err));
    return false;
};

function displayChat(data){
     data.forEach(el=> {
           showMessages.innerHTML += `<li>${el.name}: ${el.message}`; 
     });  
};

clear.addEventListener('click', ()=> fetch('/clear-chat',{ method:"delete"}).then(res=> res.json()).then(()=> showMessages.innerHTML = '').catch(err=> console.log(err)));



