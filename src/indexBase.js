let map;
let marker;
let markers = [];
let listEvents = document.querySelector('.event-list');
let isClicked;
let mapPin;
let mapPinShowEvent;
let mapPinFocusEvent;

let inputEvent = document.querySelector('#titulo');


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
    // console.log(`lat: ${event.latLng.lat()}, lng: ${event.latLng.lng()}`);
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

let buttonSave = document.querySelector('#save-event');
buttonSave.addEventListener('click', async () => {
  if (isClicked) {
    if (inputEvent.value !== '') {
      await salvar()
      // await mostrar()
      // await mostrar()
    }
    else {
      inputWarning()
    }

  } else {
    createMarkerWarning()
  }
});

let buttonMostrar = document.querySelector('#show-event');
buttonMostrar.addEventListener('click', () => {
  mostrar()
});


async function salvar() {
  const obj = {
    titulo: inputEvent.value,
    descricao: document.querySelector('#descricao').value,
    dataInicio: document.querySelector('#dataInicio').value,
    dataTermino: document.querySelector('#dataTermino').value,
    lat: marker.getPosition().lat(),
    lng: marker.getPosition().lng()
  };

  // console.log(obj);

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

async function mostrar() {
  if (markers.length === 0) {

    const response = await fetch("http://localhost:3000/pontos", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const eventos = await response.json()
    console.log(eventos[0]);

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
        title: evento.titulo,
        icon: mapPinShowEvent,
      })
      createCard(evento, eventos.indexOf(evento))
      markers.push(markerSalvo)
    }
    if (markers.length > 0) {
      document.querySelector("#show-event-text").textContent = "Ocultar eventos"
      listEvents.classList.remove('hide')
      let divButtonList = document.querySelector('.hide-event-button')
      let buttonHideList = document.createElement('button')
      buttonHideList.id = 'hide-event'
      buttonHideList.textContent = 'Ocultar lista'
      divButtonList.appendChild(buttonHideList)

      let showList = true;

      buttonHideList.addEventListener('click', () => {
        if (showList) {
          listEvents.classList.add('hide')
          buttonHideList.textContent = 'Mostrar lista'
          showList = false
        } else {
          listEvents.classList.remove('hide')
          buttonHideList.textContent = 'Ocultar lista'
          showList = true
        }

      })
    }
  } else {
    for (let markerSalvo of markers) {
      markerSalvo.setMap(null)
      let card = document.querySelector('.event-card');
      listEvents.removeChild(card)
    }
    markers = []
    document.querySelector("#show-event-text").textContent = "Mostrar eventos"
    listEvents.classList.add('hide')
    let divButtonList = document.querySelector('.hide-event-button')
    let buttonHide = document.querySelector('#hide-event')
    divButtonList.removeChild(buttonHide)
  }
}

function createCard(evento, index) {
  let card = document.createElement('div')
  card.classList.add('event-card')

  let iconDiv = document.createElement('div')
  iconDiv.classList.add('icon-event-list')
  let icon = document.createElement('img')
  icon.src = './img/icon-event-list.svg'

  let descEvent = document.createElement('h3')
  descEvent.textContent = evento.titulo

  let eventDescDiv = document.createElement('div')
  eventDescDiv.classList.add('event-desc')

  let buttonDiv = document.createElement('div')
  buttonDiv.classList.add('button-go-to-event')
  let buttonGoToEvent = document.createElement('button')
  buttonGoToEvent.id = 'go-to-event'
  buttonGoToEvent.textContent = 'Ver'

  buttonGoToEvent.addEventListener('click', () => {
    map.setCenter(markers[index].getPosition())
    for (let markerSalvo of markers) {
      markerSalvo.setIcon(mapPinShowEvent)
    }
    markers[index].setIcon(mapPinFocusEvent)
  })

  listEvents.appendChild(card)
  card.appendChild(iconDiv)
  card.appendChild(eventDescDiv)
  card.appendChild(buttonDiv)
  iconDiv.appendChild(icon)
  eventDescDiv.appendChild(descEvent)



  buttonDiv.appendChild(buttonGoToEvent)
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