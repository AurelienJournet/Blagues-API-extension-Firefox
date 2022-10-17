var blagueEnCours = false
var typeBlagueContent = ""
var statutExtensionActive = false

var minIntervalleEntreDemandesBlagues = 5000
var horaireDerniereBlague = Date.now() - minIntervalleEntreDemandesBlagues



function demandeBlagueAuBackground(){


  if (Date.now() - horaireDerniereBlague > minIntervalleEntreDemandesBlagues){
    browser.runtime.sendMessage({ "demandeBlague": 1 });
    horaireDerniereBlague = Date.now()
  }
  



}

document.addEventListener("click", demandeBlagueAuBackground)
