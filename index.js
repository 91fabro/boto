var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

//const APP_TOKEN = 'EAAFJ8ESIBBIBACOtaNmpL4PYVygnQ8w4Blv3utX7viuA6KqKgTvrPZC5WV93JeuzRRtVXYUWHPqgZCy8qiFyckPjKU6dx9kc54piEeDxsMXQZAIePVjM4eiKYtlE7pieVbv8AEkKrivJrPS0ZBkzyAnvsSpxPaKQKUUPa64u0QZDZD';
const APP_TOKEN = 'EAADMWb34uX4BAKkyGPnfhnhZBw6FpanvsRj5UDyyE37a2ZB4KU4R3xXPUAkDsanaIEiMGLoFVll0ZBdOJtAtg7ZAIEOZAiRhGCgLKwfq4zc8Wtm6FAPfZATLPG1ka4msfqYIT5StMBSjWJnnsQzxPs7oNF5zi5rW6Kwoi37ezhKwZDZD';

var app = express();
app.use(bodyParser.json());

app.listen(3000, function(){
	console.log("El servidor se encuentra en el puerto 3000");
});

app.get('/', function(req, res){
	res.send('Bienvenido al taller   bot');
});

app.get('/webhook', function(req, res){
	if(req.query['hub.verify_token'] === 'test_token_say_hello'){
		res.send(req.query['hub.challenge']);
	}else{
		res.send('Tu no tienes que entrar aqui  xx');
	}
});

app.post('/webhook', function(req, res){

	var data = req.body;
	if(data.object == 'page'){
	
		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){
				
				if(messagingEvent.message){
					receiveMessage(messagingEvent);	
				}
			
			});
		});
		res.sendStatus(200);
	}
});


function receiveMessage(event){
	var senderID = event.sender.id;
	var messageText = event.message.text;


	evaluateMessage(senderID, messageText);
}

function evaluateMessage(recipientId ,message){
	var finalMessage = '';

	if(isContain(message, 'ayuda')){
		finalMessage = 'en que te puedo ayudar';

	}else if(isContain(message, 'gato')){

	 sendMessageImage(recipientId);

	}else if(isContain(message, 'clima')){

		getWeather(function(temperature){

			message = getMessageWeather(temperature);
			sendMessageText(recipientId,message);

		});
	
	}else if(isContain(message, 'info')){

	 sendMessageTemplate(recipientId);

	}else{
		finalMessage = 'solo se repetir las cosas : ' + message;
	}
	sendMessageText(recipientId,finalMessage);
}

function sendMessageText(recipientId, message){
	var messageData = {
		recipient : {
			id : recipientId
		},
		message: {
			text: message
		}
	};
	callSendAPI(messageData);
}

function sendMessageImage(recipientId){
	var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: "http://i.imgur.com/SOFXhd6.jpg"
        }
      }
    }
  };
	callSendAPI(messageData);
}


function sendMessageTemplate(recipientId){
	var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [ elemenTemplate() ]
        }
      }
    }
  };
	callSendAPI(messageData);
}

function elemenTemplate(){
	return {
	  title: "Eduardo Ismael",
	  subtitle: "Desarrollado de Software en Código facilito",
	  item_url: "https://www.facebook.com/codigofacilito/?fref=ts",               
	  image_url: "http://i.imgur.com/SOFXhd6.jpg",
	  buttons: [ buttonTemplate() ],
  }
}

function buttonTemplate(){
	return{
		type: "web_url",
		url : "https://www.facebook.com/codigofacilito/?fref=ts",
		title : "Codigo Facilito"
	}
}

function callSendAPI(messageData){
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs : { access_token :  APP_TOKEN },
		method: 'POST',
		json: messageData
	}, function(error, response, data){

		if(error){
			console.log('No es posible enviar el mensaje');
		}else{
			console.log("El mensaje fue enviado");
		}

	});
}

function getMessageWeather(temperature){
	if (temperature > 30)
		return "Nos encontramos a "+ temperature +" Hay demaciado calor, te recomiendo que no salgas";
	return "Nos encontramos a "+ temperature +" es un bonito día para salir";
}

function getWeather(  callback ){
	request('http://api.geonames.org/findNearByWeatherJSON?lat=16.750000&lng=-93.116669&username=demo',
		function(error, response, data){
			if(!error){
				var response = JSON.parse(data);
				var temperature = response.weatherObservation.temperature;
				callback(temperature);
			}
		});
}

function isContain(sentence, word){
	return sentence.indexOf(word) > -1;
}