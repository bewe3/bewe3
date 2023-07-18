const dotenv = require('dotenv');
dotenv.config();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  const commissionedByContainer = document.getElementById(
    'commissionedByContainer'
  );

  // Show or hide the "commissionedBy" input based on the "isCommissioned" checkbox
  const isCommissionedCheckbox = document.getElementById('isCommissioned');
  isCommissionedCheckbox.addEventListener('change', () => {
    commissionedByContainer.style.display = isCommissionedCheckbox.checked
      ? 'block'
      : 'none';
  });

  // Handle form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const password = formData.get('password');

    // Validate password here (e.g., compare with the expected password)
    if (password !== process.env.SECRET_KEY) {
      alert('Invalid password!');
      return;
    }

    // Remove the password field from the data
    formData.delete('password');

    // Send the data to the server using fetch
    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Data uploaded successfully, do something if needed
        console.log('Upload successful:', data);
        alert('Upload successful!');
      })
      .catch((error) => {
        console.error('Upload failed:', error);
        alert('Upload failed. Please try again.');
      });
  });
});
