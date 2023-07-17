document
  .getElementById('contact-form')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    var name = document.getElementById('name').value;
    var subject = document.getElementById('subject').value;
    var content = document.getElementById('content').value;

    var templateParams = {
      from_name: name,
      to_name: 'Bryan Welton III', // Replace with your name or the recipient's name
      subject: subject,
      message: content,
    };

    emailjs
      .send(
        'service_8utybef',
        'template_b3ny6m9',
        templateParams,
        'MCmAloQkfrOQxVNMm'
      )
      .then(
        function (response) {
          console.log('Email sent successfully!', response);
          alert('Email sent successfully!');
          document.getElementById('contact-form').reset(); // Reset the form after successful submission
        },
        function (error) {
          console.error('Error sending email:', error);
          alert(
            'An error occurred while sending the email. Please try again later.'
          );
        }
      );
  });
