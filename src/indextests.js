
let buttonShowList = document.querySelector('#menuBarButton')
let buttonExitList = document.querySelector('#exitListButton')
let listEvents = document.querySelector('.event-list')
let form = document.querySelector('.form-register')
let menuBar = document.querySelector('.menu-bar')
let buttonForm = document.querySelector('#exitForm')

let clickOne = 0

buttonShowList.addEventListener('click', () => {
    listEvents.classList.remove('hide')
    buttonShowList.classList.add('hide')
})

buttonExitList.addEventListener('click', () => {
    listEvents.classList.add('hide')
    buttonShowList.classList.remove('hide')
})

buttonForm.addEventListener('click', () => {
    form.classList.add('hide')
})

