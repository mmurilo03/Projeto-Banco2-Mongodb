let map;
let marker;
let markers = [];
let isClicked;
let mapPin;
let mapPinShowEvent;
let mapPinFocusEvent;
let showList = false;


/*Elements*/
let form = document.querySelector('.form-register');
let inputEvent = document.querySelector('#titulo');
let listEvents = document.querySelector('.event-list');
let descricao = document.querySelector('#descricao');
let dataInicio = document.querySelector('#dataIni');
let dataTermino = document.querySelector('#dataFim');



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
    let coordinates = document.querySelector('#coordinates')
    coordinates.textContent = `${event.latLng.lat()}, ${event.latLng.lng()}`
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
buttonSave.addEventListener('click', async () => {
  if(inputEvent.value === ''){
    inputWarning();
  }else if(isClicked === false){
    createMarkerWarning();
  }else{
    if(isClicked && !showList){
      await salvar();
      await mostrar();
      await mostrar();
    }
  
    if(isClicked && showList){
      await mostrar();
      removeCardEvents();
      showCardEvents();
      await salvar();
      await mostrar();
    }

  }
  
})

async function salvar() {
  const obj = {
    titulo: inputEvent.value,
    descricao: descricao.value,
    dataInicio: dataInicio.value,
    dataTermino: dataTermino.value,
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

let showListButton = document.querySelector('#menuBarButton')


showListButton.addEventListener('click', () => {
  removeCardEvents();
  showList = true;
  listEvents.classList.remove('hide')
  mostrar();
  showCardEvents();
})

function showCardEvents(){
  for (let markerSalvo of markers) {
    markerSalvo.setMap(null)
    let card = document.createElement('div');
    card.classList.add('card')
  }
}

let buttonExitList = document.querySelector('#exitListButton')
buttonExitList.addEventListener('click', () => {
  showList = false;
  listEvents.classList.add('hide')
  removeCardEvents();
})

function removeCardEvents(){
  for (let markerSalvo of markers) {
    markerSalvo.setMap(null)
    let cards = document.querySelector('.cards');
    let card = document.querySelector('.card')
    cards.removeChild(card)
  }
  markers = [];
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

function sucessButton() {
  setTimeout(() => {
    buttonSave.style.background = '#011F39'; //blue
    buttonSave.textContent = 'Salvar evento';
    buttonSave.style.cursor = 'pointer'
    buttonSave.disabled = false;
  }, 2000);
  buttonSave.style.transition = '0.2s ease-in'
  buttonSave.style.background = '#53a653'; //green
  buttonSave.textContent = 'Salvo!'
  buttonSave.style.cursor = 'not-allowed'
  buttonSave.disabled = true;


  inputEvent.value = '';
  descricao.value = '';
  dataInicio.value = '';
  dataTermino.value = '';
}

function createMarkerWarning() {
  setTimeout(() => {
    buttonSave.style.background = '#011F39'; //blue
    buttonSave.textContent = 'Salvar evento';
    buttonSave.style.cursor = 'pointer'
    buttonSave.disabled = false;
  }, 2000);
  buttonSave.style.transition = '0.2s ease-in'
  buttonSave.style.background = '#A9A9A9'; //yellow
  buttonSave.textContent = 'Crie um marcador'
  buttonSave.style.cursor = 'not-allowed'
  buttonSave.disabled = true;
}

function inputWarning() {
  setTimeout(() => {
    buttonSave.style.background = '#011F39'; //blue
    buttonSave.textContent = 'Salvar evento';
    buttonSave.style.cursor = 'pointer'
    buttonSave.disabled = false;
  }, 2000);
  buttonSave.style.transition = '0.2s ease-in'
  buttonSave.style.background = '#ff3333'; //yellow
  buttonSave.textContent = 'Digite o nome'
  buttonSave.style.cursor = 'not-allowed'
  buttonSave.disabled = true;
}

function errorButton(){
  setTimeout(() => {
    buttonSave.style.background = '#011F39'; //blue
    buttonSave.textContent = 'Salvar evento';
    buttonSave.style.cursor = 'pointer'
    buttonSave.disabled = false;
  }, 3000);
  buttonSave.style.transition = '0.3s ease-in'
  buttonSave.style.background = '#ff3333'; //red
  buttonSave.textContent = 'Erro!'
  buttonSave.style.cursor = 'not-allowed'
  buttonSave.disabled = true;
}