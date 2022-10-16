let typeBlagueBackground = ""
let modeBlagueActif = false

function envoiTypeBlagueAContent(type) {
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then((allTabs) => {
    for (let tab of allTabs) {
      browser.tabs.sendMessage(
        tab.id,
        { typeBlagueBackground: type }
      );
    }
  })
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
      "message": "Attention ! mode blague activé !\n1 clic 🖱️ = 1 blague 🤡"
    });
    direTexte("C'est parti mon kiki");
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

function recevoirMessages(message) {
  if (message.typeBlaguePopup) {
    changerTypeDeBlagueBackground(message.typeBlaguePopup)
  }
  else if (message.statutExtension) {
    changerStatutExtension(message.statutExtension)
  }
  else if (message.demandeTypeBlague) {
    return Promise.resolve({ response: typeBlagueBackground });
  }
  else if (message.demandeStatutExtension) {
    return Promise.resolve({ response: modeBlagueActif });
  }
}

browser.runtime.onMessage.addListener(recevoirMessages);