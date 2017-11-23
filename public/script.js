var form = document.querySelector('form');
var showMessages = document.querySelector('.show-msg');
var clear = document.querySelector('.clear-btn');

var socket = io();

form.addEventListener('submit', handleMsg);

function handleMsg(e){
	e.preventDefault();
	var msg = { message:e.target.message.value, name:e.target.name.value};
    socket.emit('chat', msg);
    e.target.message.value = '';
    return false;
};

socket.on('chat-archive', msg=> displayChat(msg));
socket.on('chat', msg=> displayMsg(msg));

function displayMsg(data){
	var li = document.createElement('li');
	li.textContent = `${data.name}: ${data.message}`;
	showMessages.appendChild(li);
}

function displayChat(data){
	showMessages.innerHTML = '';
	if(data.length){
        data.forEach(el=> {
           showMessages.innerHTML += `<li>${el.name}: ${el.message}</li>`; 
        });
	}
};

clear.addEventListener('click', ()=> fetch('/clear-chat',{ method:"delete"}).then(res=> res.json()).then(()=> showMessages.innerHTML = '').catch(err=> console.log(err)));



