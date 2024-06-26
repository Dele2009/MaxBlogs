export const handleFormSubmission = async (form, url) => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form submission
        // Show loader
        const submitBtnText = document.getElementById('text')
        const loader = document.getElementById('loader')
        const mainAlert = document.getElementById('alert')
        const useElement = document.getElementById('infoIcon');
        const message = document.getElementById('Message');

        submitBtnText.style.display = 'none';
        loader.style.display = 'block';

        // Form data
        const formData = new FormData(form);
        const blogElement = document.getElementById('my-blog');
        if (blogElement) {
            formData.delete('blog')
            const blogContent = tinymce.get('my-blog').getContent().toString();

            formData.append('blog', blogContent);

        }




        try {
            let transferInfo;
            if (form.id === 'LoginForm') {
                const email = form.querySelector('#email').value;
                const password = form.querySelector('#password').value;
                const Body = {
                    email: email,
                    password: password
                };
                transferInfo = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Body)
                }

            } else {
                // For other forms, use FormData
                transferInfo = {
                    method: 'POST',
                    body: formData
                }

            }


            const response = await fetch(url, transferInfo);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Handle success response
            console.log('Success:', data);


            let count = 0;
            let k = setInterval(() => {
                if (count === 5) {
                    clearInterval(k);
                    loader.style.display = 'none';
                    submitBtnText.style.display = 'inline';
                    mainAlert.style.visibility = 'visible';
                    message.textContent = data.message;
                    if (data.error === true) {
                        mainAlert.classList.add('alert-danger');
                        useElement.setAttribute('xlink:href', '#exclamation-triangle-fill');
                    } else {
                        mainAlert.classList.remove('alert-danger');
                        mainAlert.classList.add('alert-success');
                        useElement.setAttribute('xlink:href', '#check-circle-fill');
                    }
                }
                count++;
            }, 1000);

            // Redirect after a delay if necessary
            if (data.error === false && data.redirectTo) {
                setTimeout(() => {
                    window.location.href = data.redirectTo;
                }, 8000);
            }
        } catch (error) {
            console.log(error);
        }
    });
}