const socket = io();
let user;
let chatBox = document.getElementById('chatBox');
let welcome = document.getElementById('welcome');

socket.emit('authenticated', user);
socket.emit('message', "Tenemos una nueva conexión!")

swal.fire({

      title: 'Bienvenido a la sala de chat',
      input: 'text',
      text: 'Ingresa tu nombre de usuario:',
      inputValidator: (value) => {
            return !value && 'Por favor, ingresa tu nombre de usuario'
      },
      allowOutsideClick: false,

}).then((result) => {

      if (result.isConfirmed) {
            user = result.value;
            socket.emit('message', `El usuario: ${user} se ha conectado`);
            welcome.innerHTML = `Bienvenido, ${user}!`;
      };

});

chatBox.addEventListener('keyup', e => {

      if (e.key === 'Enter') {

            if (chatBox.value.trim().length > 0) {

                  socket.emit('message', {
                        user: user,
                        message: chatBox.value
                  });
                  chatBox.value = "";

            };

      };

});

socket.on('messagesLogs', data => {

      let log = document.getElementById('messagesLogs');
      let messages = "";

      data.forEach(message => {

            if (message.user !== undefined && message.message !== undefined) {
                  messages = messages + `${message.user} dice: ${message.message} <br>`;
            } else {
                  return;
            };

      });

      log.innerHTML = messages;

});