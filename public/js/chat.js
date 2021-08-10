
const socket = io()

//Elements 
const $messageForm = document.querySelector('#subm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormBottom = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#locationmessage-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const autoscroll = () => {
    //New messsage elements
    const $newMessage = $messages.lastElementChild

    //heigth of new msg
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    //Visible heigth
    const visibleHeight = $messages.offsetHeight
    //heigth of the message
    const containerHeight = $messages.scrollHeight
    //How far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
socket.on('locationMessage', (message) => {
    console.log(message.url)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormBottom.setAttribute('disabled', 'disabled')
    //disable
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        //reenable
        $messageFormBottom.removeAttribute('disabled')
        $messageFormInput.value=""
        $messageFormInput.focus()
        if(error){
            return console.error(error)
        }
        console.log('Message delivered')
    })
})
$locationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
        //disable
        $locationButton.setAttribute('disabled', 'disabled')
        navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.latitude
        }, () => {
            console.log('Geolocation shared!')
            $locationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})