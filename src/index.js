let map;
let marker;
let markers = [];
let isClicked;
let mapPin;
let mapPinShowEvent;
let mapPinFocusEvent;
let showList = false;
let editing;

/*Elements*/
let form = document.querySelector(".form-register");
let listEvents = document.querySelector(".event-list");

/*Elements form */
let coordinates = document.querySelector("#coordinates");
let inputEvent = document.querySelector("#titulo");
let descricao = document.querySelector("#descricao");
let dataInicio = document.querySelector("#dataIni");
let dataTermino = document.querySelector("#dataFim");

async function initMap() {
  //@ts-ignore

  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -6.88778, lng: -38.557 },
    zoom: 14,
    disableDefaultUI: true,
  });

  map.addListener("click", (event) => {
    isClicked = true;
    if (editing) {
      hideFormEdit();
      let buttonForm = document.querySelector(".button-event-form");
      buttonForm.replaceChild(buttonSave, buttonChange);
    }
    showForm();
    coordinates.textContent = `${event.latLng.lat()}, ${event.latLng.lng()}`;
    marker.position = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    marker.setPosition(event.latLng);
  });

  mapPin = {
    url: "./img/map-pin.svg", // url
    scaledSize: new google.maps.Size(30, 40), // scaled size
  };

  marker = new google.maps.Marker({
    // position: { lat: -6.88778, lng: -38.55700 },
    map,
    title: "Marcador",
    icon: mapPin,
  });
}

initMap();

/*Salvar*/
let buttonSave = document.querySelector("#buttonEvent");
let buttonChange = document.createElement("button");
buttonSave.addEventListener("click", async () => {
  buttonSave.textContent = "Salvar evento";
  if (inputEvent.value === "") {
    inputWarning();
  } else if (isClicked === false) {
    createMarkerWarning();
  } else {
    if (isClicked && !showList) {
      await salvar();
    }

    if (isClicked && showList) {
      await salvar();
      await mostrar();
      removeCardEvents();
      await mostrar();
    }
  }
});

async function salvar() {
  const obj = {
    titulo: inputEvent.value,
    descricao: descricao.value,
    lat: marker.getPosition().lat(),
    lng: marker.getPosition().lng(),
  };

  if(dataInicio.value){
    obj.dataInicio = dataInicio.value
  }
  if(dataTermino.value){
    obj.dataTermino = dataTermino.value
  }
  await fetch("http://localhost:3000/pontos", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((response) => {
      sucessButton();
    })
    .catch((error) => {
      errorButton();
    });
  isClicked = false;
}

async function editar(index) {
  const obj = {
    titulo: inputEvent.value,
    descricao: descricao.value,
    dataInicio: dataInicio.value,
    dataTermino: dataTermino.value,
    lat: markers[index].position.lat(),
    lng: markers[index].position.lng(),
  };

  await fetch(`http://localhost:3000/pontos/${markers[index].id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  })
    .then((response) => {
      sucessButton();
    })
    .catch((error) => {
      errorButton();
    });
}

/*Mostrar lista*/

async function mostrar() {
  const response = await fetch("http://localhost:3000/pontos", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const eventos = await response.json();
  console.log(eventos);

  mapPinShowEvent = {
    url: "./img/map-pin-show-event.svg", // url
    scaledSize: new google.maps.Size(30, 40), // scaled size
  };

  mapPinFocusEvent = {
    url: "./img/map-pin-focus-event.svg", // url
    scaledSize: new google.maps.Size(30, 40), // scaled size
  };

  for (let evento of eventos) {
    let markerSalvo = new google.maps.Marker({
      position: {
        lat: Number(evento.localizacao.split(" ")[1]),
        lng: Number(evento.localizacao.split(" ")[0]),
      },
      map,
      titulo: evento.titulo,
      descricao: evento.descricao,
      dataInicio: evento.dataInicio,
      dataTermino: evento.dataTermino,
      id: evento._id,
      icon: mapPinShowEvent,
    });
    createCard(evento, eventos.indexOf(evento));
    markers.push(markerSalvo);
  }
}

let showListButton = document.querySelector("#menuBarButton");

showListButton.addEventListener("click", () => {
  removeCardEvents();
  showList = true;
  listEvents.classList.remove("hide");
  mostrar();
});

let buttonExitList = document.querySelector("#exitListButton");
buttonExitList.addEventListener("click", () => {
  showList = false;
  listEvents.classList.add("hide");
  removeCardEvents();
});

function removeCardEvents() {
  for (let markerSalvo of markers) {
    markerSalvo.setMap(null);
    let cards = document.querySelector(".cards");
    let card = document.querySelector(".card");
    cards.removeChild(card);
  }
  markers = [];
}

/*Form*/
function showForm() {
  form.classList.remove("hide");
}

let exitForm = document.querySelector("#exitForm");
exitForm.addEventListener("click", () => {
  form.classList.add("hide");
});

function showFormEdit(index) {
  let divButton = document.querySelector(".button-event-form");
  if (!editing) {
    divButton.replaceChild(buttonChange, buttonSave);
  }
  editing = true;
  form.classList.remove("hide");
  buttonChange.setAttribute("id", "buttonChange");
  buttonChange.textContent = "Salvar alterações";
  coordinates.textContent = `${markers[index].position.lat()}, ${markers[
    index
  ].position.lng()}`;
  inputEvent.value = markers[index].titulo;
  descricao.value = markers[index].descricao;
  dataInicio.value = markers[index].dataInicio.substr(0, 10);
  dataTermino.value = markers[index].dataTermino.substr(0, 10);
  buttonChange.addEventListener("click", async () => {
    await editar(index);
    removeCardEvents();
    await mostrar();
    hideFormEdit();
  });
}

function hideFormEdit() {
  editing = false;
  form.classList.add("hide");
}

/*Card*/
function createCard(object, index) {
  let divCards = document.querySelector(".cards");

  let card = document.createElement("div");
  card.classList.add("card");
  divCards.appendChild(card);

  let cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header");
  card.appendChild(cardHeader);

  let title = document.createElement("div");
  title.classList.add("card-title");
  title.textContent = object.titulo;
  cardHeader.appendChild(title);

  let cardActions = document.createElement("div");
  cardActions.classList.add("card-actions");
  cardHeader.appendChild(cardActions);

  let buttonEdit = document.createElement("button");
  buttonEdit.setAttribute("id", "editButton");
  let iconEdit = document.createElement("img");
  iconEdit.setAttribute("src", "./img/edit-button.svg");
  buttonEdit.appendChild(iconEdit);
  cardActions.appendChild(buttonEdit);

  buttonEdit.addEventListener("click", () => {
    showFormEdit(index);
  });

  let buttonDelete = document.createElement("button");
  buttonDelete.setAttribute("id", "deleteButton");
  let iconDelete = document.createElement("img");
  iconDelete.setAttribute("src", "./img/delete-button.svg");
  buttonDelete.appendChild(iconDelete);
  cardActions.appendChild(buttonDelete);

  let desc = document.createElement("div");
  desc.classList.add("desc");
  desc.textContent = object.descricao;
  card.appendChild(desc);

  let datasDiv = document.createElement("div");
  datasDiv.classList.add("dates");
  datasDiv.textContent = `Data Inicio: ${object.dataInicio.substr(8, 2)}/${
    object.dataInicio.substr(5, 2)
  }/${object.dataInicio.substr(0, 4)} Data Fim: ${object.dataTermino.substr(8, 2)}/${
    object.dataTermino.substr(5, 2)
  }/${object.dataTermino.substr(0, 4)}`;
  card.appendChild(datasDiv);

  let divButton = document.createElement("div");
  divButton.classList.add("showButton");
  let showButton = document.createElement("button");
  showButton.setAttribute("id", "showButton");
  showButton.textContent = "Mostrar";
  divButton.appendChild(showButton);
  card.appendChild(divButton);

  showButton.addEventListener("click", () => {
    map.setCenter(markers[index].getPosition());
    for (let markerSalvo of markers) {
      markerSalvo.setIcon(mapPinShowEvent);
    }
    markers[index].setIcon(mapPinFocusEvent);
  });
}

function sucessButton() {
  setTimeout(() => {
    buttonSave.style.background = "#011F39"; //blue
    buttonSave.textContent = "Salvar evento";
    buttonSave.style.cursor = "pointer";
    buttonSave.disabled = false;
  }, 2000);
  buttonSave.style.transition = "0.2s ease-in";
  buttonSave.style.background = "#53a653"; //green
  buttonSave.textContent = "Salvo!";
  buttonSave.style.cursor = "not-allowed";
  buttonSave.disabled = true;

  inputEvent.value = "";
  descricao.value = "";
  dataInicio.value = "";
  dataTermino.value = "";
}

function createMarkerWarning() {
  setTimeout(() => {
    buttonSave.style.background = "#011F39"; //blue
    buttonSave.textContent = "Salvar evento";
    buttonSave.style.cursor = "pointer";
    buttonSave.disabled = false;
  }, 2000);
  buttonSave.style.transition = "0.2s ease-in";
  buttonSave.style.background = "#A9A9A9"; //yellow
  buttonSave.textContent = "Crie um marcador";
  buttonSave.style.cursor = "not-allowed";
  buttonSave.disabled = true;
}

function inputWarning() {
  setTimeout(() => {
    buttonSave.style.background = "#011F39"; //blue
    buttonSave.textContent = "Salvar evento";
    buttonSave.style.cursor = "pointer";
    buttonSave.disabled = false;
  }, 2000);
  buttonSave.style.transition = "0.2s ease-in";
  buttonSave.style.background = "#ff3333"; //yellow
  buttonSave.textContent = "Digite o nome";
  buttonSave.style.cursor = "not-allowed";
  buttonSave.disabled = true;
}

function errorButton() {
  setTimeout(() => {
    buttonSave.style.background = "#011F39"; //blue
    buttonSave.textContent = "Salvar evento";
    buttonSave.style.cursor = "pointer";
    buttonSave.disabled = false;
  }, 3000);
  buttonSave.style.transition = "0.3s ease-in";
  buttonSave.style.background = "#ff3333"; //red
  buttonSave.textContent = "Erro!";
  buttonSave.style.cursor = "not-allowed";
  buttonSave.disabled = true;
}
