const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const TelegramBot = require('node-telegram-bot-api');

const token = '6311505826:AAGrEG3BOYvDhHGORsZec4AA-vnbqOeqqDw';

const bot = new TelegramBot(token, {polling: true});

var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

bot.on('message', function(mg){
  const msg = mg.text;
  var res_all=" No Data Found ";
  const newMsg = msg.split(" ")
  if(newMsg[0]=='ADD'){
    //Insert the data to database with key
    db.collection('Info_database').add({
        ID:mg.from.id,
        attribute:newMsg[1],
        value:newMsg[2]
  }).then(()=>{
    bot.sendMessage(mg.chat.id, newMsg[1] + " stored sucessfully ")
  })

  }
  else if(newMsg[0]=='RETRIEVE'){
    if(newMsg[1]=='ALL')
    {   
        db.collection('Info_database').where('ID', '==', mg.from.id).get().then((docs)=>{
            docs.forEach((doc) => {
                if(res_all==" No Data Found ")
                {
                    res_all=doc.data().attribute + " : " + doc.data().value
                }
                else
                {
                    res_all=res_all+"\n"+doc.data().attribute + " : " + doc.data().value
                }
                });
                bot.sendMessage(mg.chat.id, res_all);
          });
    }
    else{
        db.collection('Info_database').where('ID', '==', mg.from.id).get().then((docs)=>{
            docs.forEach((doc) => {
                if(newMsg[1]==doc.data().attribute)
                {
                    bot.sendMessage(mg.chat.id, doc.data().attribute + " : " + doc.data().value)
                }
                });
          })
    }   
  }
  else{
    bot.sendMessage(mg.chat.id, "Please make sure the messages are in this format \n'ADD attributename value' \n'RETRIEVE attributename' \n'RETRIEVE ALL'")
  }
 
})