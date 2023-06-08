
let buttonShowList = document.querySelector('#menuBarButton')
let buttonExitList = document.querySelector('#exitListButton')
let listEvents = document.querySelector('.event-list')
let menuBar = document.querySelector('.menu-bar')

let clickOne = 0

buttonShowList.addEventListener('click', () => {
    listEvents.classList.remove('hide')
    buttonShowList.classList.add('hide')
})

buttonExitList.addEventListener('click', () => {
    listEvents.classList.add('hide')
    buttonShowList.classList.remove('hide')
})

