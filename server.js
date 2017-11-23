const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const chat = require('./model/chat.model');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const db = "mongodb://localhost:27017/chatApp";

mongoose.Promise = global.Promise;
mongoose.connection.openUri(db);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=>{
     res.sendFile('index.html');
});

// app.post('/', (req, res)=>{
//     chat.find().exec((err, chat)=>{
//     	if(err){
//     		res.sendStatus(404);
//     	}else{
//     		res.json(chat);
//     	}
//     });
// });

// app.get('/load-archive', (req, res)=>{
//     chat.find().exec((err, chat)=>{
//     	if(err){
//     		res.sendStatus(404);
//     	}else{
//     		res.json(chat);
//     	}
//     });
// });


app.delete('/clear-chat', (req, res)=>{
     chat.remove({}, (err, chat)=> {
     	if(err){
     		console.log(err);
     		return;
     	}

     console.log('collection is removed...')
     });
});

io.on('connection', (socket)=>{
	console.log('Connected');
	socket.on('chat', (msg)=> {
        io.emit('chat', msg)
		chat.create(msg).catch(err=> console.log(err));
	});
	socket.on('disconnect', ()=> console.log('Disconnected'));
    chat.find().exec((err, chat)=>{
        if(err){return;}
        io.emit('chat-archive', chat);
    });
});

server.listen(port, ()=> console.log('Server is running on port ' + port));
