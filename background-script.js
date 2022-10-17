let typeBlagueBackground = ""
let modeBlagueActif = false
let blagueEnCours = false

function direTexte(texte) {
  let voices, utterance;
  voices = speechSynthesis.getVoices();
  utterance = new SpeechSynthesisUtterance(texte);
  utterance.pitch = 0.4;
  utterance.volume = 1;
  utterance.rate = 1.5;
  utterance.lang = 'fr-FR';
  utterance.voice = voices[0];
  speechSynthesis.speak(utterance);
}

function changerTypeDeBlagueBackground(type) {
  if (typeBlagueBackground != type) {
    typeBlagueBackground = type;
    switch (type) {
      case 'dev':
        direTexte("Vouz avez sélectionné : humour de développeur")
        break;
      case 'limit':
        direTexte("Vouz avez sélectionné : humour 18 et plusse")
        break;
      case 'blondes':
        direTexte("Vouz avez sélectionné : blagues blondes")
        break;
      case 'beauf':
        direTexte("Vouz avez sélectionné : humour de beaufs")
        break;
      case 'global':
        direTexte("Vouz avez sélectionné : blagues nulles")
        break;
    }
  }

}

function changerStatutExtension(state) {
  if (state == 'activation' && modeBlagueActif == false) {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.runtime.getURL("icons/start.gif"),
      "title": "⚠️⚠️⚠️",
      "message": "Attention ! mode blague activé !\nclic 🖱️ = blague 🤡"
    });
    direTexte("C'est parti mon kiki");
    if (typeBlagueBackground == ""){
      direTexte("Veuillez sélectionner un type de blague dans la pop heupe de l'extension")
      direTexte("Merci bisous")
    }

    modeBlagueActif = true
  }
  else if (state == 'desactivation' && modeBlagueActif == true) {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.runtime.getURL("icons/bye.gif"),
      "title": "👋❤️👋",
      "message": "Mode blague désactivé !"
    });
    modeBlagueActif = false
    direTexte("A plusse, des bisous")
  }
}

// TODO : passer potenitellement en pas async
function blague() {
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTAyOTcwMTAyMTE2MjgxMTQyNCIsImxpbWl0IjoxMDAsImtleSI6InlGWkc4VldXSGQ3NVZBRjY4VWFLRVhnZmI2S1VXMDJ2VEVnWkJSaGZYSlVvZWNjSWhEIiwiY3JlYXRlZF9hdCI6IjIwMjItMTAtMTJUMTA6MjU6MjMrMDA6MDAiLCJpYXQiOjE2NjU1NzAzMjN9.eUvOmnhenNh_6JbI51ZR4Qa6oLT-kOhjy36hp0DKGM0";
  url = "https://www.blagues-api.fr/api/type/" + typeBlagueBackground + "/random";

  if (modeBlagueActif){
    if (blagueEnCours == false && typeBlagueBackground != "") {

      blagueEnCours = true
      header = 'Bearer ' + token
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", url, false);
      xmlHttp.setRequestHeader('Authorization', header);
      xmlHttp.send(null);
      response = xmlHttp.response;
      parseJson = JSON.parse(response);
  
      direTexte(parseJson.joke);
      direTexte(parseJson.answer);
      direTexte("hem déaire lol PétéDéaire");
  
      blagueEnCours = false
    }
  }
}


async function recevoirMessages(message) {



  if (message.typeBlaguePopup) {
    console.log('message reçu : typeBlaguePopup')
    changerTypeDeBlagueBackground(message.typeBlaguePopup)
  }
  else if (message.statutExtension) {
    console.log('message reçu : statutExtension')
    changerStatutExtension(message.statutExtension)
  }
  else if (message.demandeTypeBlague) {
    console.log('message reçu : demandeTypeBlague')
    return Promise.resolve({ response: typeBlagueBackground });
  }
  else if (message.demandeStatutExtension) {
    console.log('message reçu : demandeStatutExtension')
    return Promise.resolve({ response: modeBlagueActif });
  }
  else if (message.demandeBlague) {
    console.log('message reçu : demandeBlague')
    if (!blagueEnCours){
      console.log('blague lancée')
      blague();
    }
  }
}


// TODO : tester avec plusieurs listeners

browser.runtime.onMessage.addListener(recevoirMessages);