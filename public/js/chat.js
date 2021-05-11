const socket = io()

//Elements
const $messageForm = document.getElementById('message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.getElementById('send-location')


socket.on('message', (message) => {
    console.log(message)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();


    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (err) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (err) {
            return console.error(err)
        }
        console.log('The message is delivered')

    })
});

document.getElementById('send-location').addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocation.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        let data = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', data, () => {
            $sendLocation.removeAttribute('disabled')
            console.log('Location shared!')
        })

    })

});