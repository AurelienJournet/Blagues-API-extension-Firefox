var blagueEnCours = false
var typeBlagueContent = ""
var statutExtensionActive = false

async function blague() {
  await récupérerTypeBlagueDepuisBackground();

  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTAyOTcwMTAyMTE2MjgxMTQyNCIsImxpbWl0IjoxMDAsImtleSI6InlGWkc4VldXSGQ3NVZBRjY4VWFLRVhnZmI2S1VXMDJ2VEVnWkJSaGZYSlVvZWNjSWhEIiwiY3JlYXRlZF9hdCI6IjIwMjItMTAtMTJUMTA6MjU6MjMrMDA6MDAiLCJpYXQiOjE2NjU1NzAzMjN9.eUvOmnhenNh_6JbI51ZR4Qa6oLT-kOhjy36hp0DKGM0";
  url = "https://www.blagues-api.fr/api/type/" + typeBlagueContent + "/random";

  if (blagueEnCours == false && typeBlagueContent != "") {

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
  else if (typeBlagueContent == "") {
    direTexte("Veuillez sélectionner un type de blague dans la pop heupe de l'extension")
    direTexte("Merci bisous")
  }
}

async function récupérerTypeBlagueDepuisBackground() {
  response = await browser.runtime.sendMessage({ "demandeTypeBlague": 1 });
  changerTypeBlague(response.response)
}

async function récupérerStatutExtensionDepuisBackground() {
  response = await browser.runtime.sendMessage({ "demandeStatutExtension": 1 });
  state = response.response;
  statutExtensionActive = state;
}

function changerTypeBlague(type) {
  typeBlagueContent = type;
}

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

document.addEventListener("click", main)
async function main() {
  await récupérerStatutExtensionDepuisBackground();
  if (statutExtensionActive) {
    blague();
  }
}

