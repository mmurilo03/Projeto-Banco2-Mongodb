let map;
let marker;
let markers = [];
let isClicked;
let mapPin;
let mapPinShowEvent;
let mapPinFocusEvent;

let inputEvent = document.querySelector('#titulo');


/*Divs*/
let form = document.querySelector('.form-register')
let listEvents = document.querySelector('.event-list');



async function initMap() {
  //@ts-ignore

  const { Map } = await google.maps.importLibrary("maps");


  map = new Map(document.getElementById("map"), {
    center: { lat: -6.88778, lng: -38.55700 },
    zoom: 14,
    disableDefaultUI: true
  });

  map.addListener("click", (event) => {
    isClicked = true;
    showForm();
    marker.position = { lat: event.latLng.lat(), lng: event.latLng.lng() }
    marker.setPosition(event.latLng)
  })

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
let buttonSave = document.querySelector('#buttonEvent')
buttonSave.addEventListener('click', () => {
  salvar();
})

async function salvar() {
  const obj = {
    titulo: inputEvent.value,
    descricao: document.querySelector('#descricao').value,
    dataInicio: document.querySelector('#dataIni').value,
    dataTermino: document.querySelector('#dataFim').value,
    lat: marker.getPosition().lat(),
    lng: marker.getPosition().lng()
  };


  fetch("http://localhost:3000/pontos", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj)
  }).then(response => {
    sucessButton()
  })
    .catch(error => {
      errorButton()

    });
  isClicked = false;
}

/*Mostrar lista*/
let showListButton = document.querySelector('#menuBarButton')

showListButton.addEventListener('click', () => {
  listEvents.classList.remove('hide')
  mostrar();
})

let buttonExitList = document.querySelector('#exitListButton')
buttonExitList.addEventListener('click', () => {
  listEvents.classList.add('hide')
})

async function mostrar() {
  const response = await fetch("http://localhost:3000/pontos", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  const eventos = await response.json()

  mapPinShowEvent = {
    url: "./img/map-pin-show-event.svg", // url
    scaledSize: new google.maps.Size(30, 40), // scaled size
  };

  mapPinFocusEvent = {
    url: "./img/map-pin-focus-event.svg", // url
    scaledSize: new google.maps.Size(30, 40), // scaled size
  };

  for (let evento of eventos) {
    // console.log("LAT: " + evento.localizacao.split(" ")[1]);
    let markerSalvo = new google.maps.Marker({
      position: { lat: Number(evento.localizacao.split(" ")[1]), lng: Number(evento.localizacao.split(" ")[0]) },
      map,
      titulo: evento.titulo,
      descricao: evento.descricao,
      dataInicio: evento.dataInicio,
      dataTermino: evento.dataTermino,
      icon: mapPinShowEvent,
    })
    createCard(evento, eventos.indexOf(evento))
    markers.push(markerSalvo)
  }
}

/*Form*/
function showForm() {
  form.classList.remove('hide')
}

let exitForm = document.querySelector('#exitForm')
exitForm.addEventListener('click', () => {
  form.classList.add('hide')
})

/*Card*/
function createCard(object) {
  let divCards = document.querySelector('.cards')

  let card = document.createElement('div')
  card.classList.add('card')
  divCards.appendChild(card)

  let title = document.createElement('div')
  title.classList.add('card-title')
  title.textContent = object.titulo
  card.appendChild(title)

  let desc = document.createElement('div')
  desc.classList.add('desc')
  desc.textContent = object.descricao
  card.appendChild(desc)

  let datasDiv = document.createElement('div')
  datasDiv.classList.add('dates')
  datasDiv.textContent = `Data Inicio: ${object.dataInicio} Data Fim: ${object.dataTermino}`
  card.appendChild(datasDiv)

  let divButton = document.createElement('div')
  divButton.classList.add('showButton')
  let showButton = document.createElement('button')
  showButton.setAttribute('id', 'showButton')
  showButton.textContent = 'Mostrar'
  divButton.appendChild(showButton)
  card.appendChild(divButton)
}