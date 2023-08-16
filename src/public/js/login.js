const form = document.getElementById('loginForm');

form.addEventListener('submit', (e) => {

      e.preventDefault();

      const data = new FormData(form);

      const obj = {}

      data.forEach((value, key) => {
            obj[key] = ['email'].includes(key) ? value.toLowerCase() : value;
      });

      fetch('/api/sessions/login', {

            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                  'Content-Type': 'application/json',
                  'authorization': `Bearer ${localStorage.getItem('token')}`
            }

      }).then(response => {

            if (response.status === 200) {

                  response.json().then(data => {

                        localStorage.setItem('token', data.token);

                        window.location.href = '/';

                  });

            } else {

                  response.json().then(data => {

                        console.log(data);

                  });

            }

      });

});

const loginGitHub = document.getElementById('loginGitHub');