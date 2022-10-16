function listenForClicks() {
  document.addEventListener("click", (e) => {
    if (e.target.id == "blagueActif") {
      if (e.target.checked) {
        activerExtension();
      }
      else {
        desactiverExtension();
      }
    }

    else if (e.target.nodeName == 'SPAN') {
      selected = e.target.id
      if (selected == "blagueDev") {
        selectionnerBlagueType("dev");
      }
      else if (selected == "blagueBlondes") {
        selectionnerBlagueType("blondes");
      }
      else if (selected == "blagueNormales") {
        selectionnerBlagueType("global");
      }
      else if (selected == "blague18Plus") {
        selectionnerBlagueType("limit");
      }
      else if (selected == "blagueBeaufs") {
        selectionnerBlagueType("beauf");
      }
    }
  });
}

function selectionnerBlagueType(type) {
  document.querySelectorAll("span[class*='selectedType']").forEach((selector) => {
    selector.classList.remove('selectedType');
  }
  );

  switch (type) {
    case 'dev':
      document.querySelector("#imgSelected").src = "dev.png";
      document.querySelector("#blagueDev").classList.add('selectedType');
      envoyerTypeBlagueAuBackground("dev");
      break;
    case 'blondes':
      document.querySelector("#imgSelected").src = "blondes.png";
      document.querySelector("#blagueBlondes").classList.add('selectedType');
      envoyerTypeBlagueAuBackground("blondes");
      break;
    case 'global':
      document.querySelector("#imgSelected").src = "blagues.gif";
      document.querySelector("#blagueNormales").classList.add('selectedType');
      envoyerTypeBlagueAuBackground("global");
      break;
    case 'limit':
      document.querySelector("#imgSelected").src = "18plus.gif";
      document.querySelector("#blague18Plus").classList.add('selectedType');
      envoyerTypeBlagueAuBackground("limit");
      break;
    case 'beauf':
      document.querySelector("#imgSelected").src = "beauf.jpg";
      document.querySelector("#blagueBeaufs").classList.add('selectedType');
      envoyerTypeBlagueAuBackground("beauf");
      break;
  }

  document.querySelector("div[class*='cliquez']").classList.remove('hidden');

}

function envoyerTypeBlagueAuBackground(type) {
  browser.runtime.sendMessage({ "typeBlaguePopup": type });
  document.querySelector("#imgSelected").classList.remove('hidden');
}

function desactiverExtension() {
  document.querySelector("div[class*='cliquez']").classList.add('hidden');

  document.querySelector("div[class='state']").textContent = 'Mode blagues désactivé';
  document.querySelector("#blagueActif").checked = false;
  document.querySelector("div[class*='choice']").classList.add('hidden');
  envoyerEtatExtensionBackground(false);
}

function activerExtension() {
  document.querySelector("div[class*='cliquez']").classList.remove('hidden');
  document.querySelector("div[class='state']").textContent = 'Mode blagues activé';
  document.querySelector("#blagueActif").checked = true;
  document.querySelector("div[class*='choice']").classList.remove('hidden');
  envoyerEtatExtensionBackground(true);
}

async function recupererEtatExtensionBackground() {
  response = await browser.runtime.sendMessage({ "demandeStatutExtension": 1 });
  state = response.response;
  if (state) {
    activerExtension();
  }
  else {
    desactiverExtension();
  }
}

async function recupererTypeBlagueBackground() {
  response = await browser.runtime.sendMessage({ "demandeTypeBlague": 1 });
  type = response.response;

  if (type) { selectionnerBlagueType(type); }

}

function envoyerEtatExtensionBackground(state) {
  if (state) { message = 'activation'; }
  else { message = 'desactivation'; }

  browser.runtime.sendMessage({ "statutExtension": message });
}

recupererEtatExtensionBackground().then(recupererTypeBlagueBackground).then(listenForClicks);