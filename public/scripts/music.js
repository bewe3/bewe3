window.addEventListener('DOMContentLoaded', (event) => {
  fetch('/music') // Assuming this route matches your server-side route
    .then((response) => response.json())
    .then((data) => {
      const musicContainer = document.getElementById('music-container');

      console.log(data);

      data.forEach((piece) => {
        // Card
        const card = document.createElement('div');
        card.classList.add('card');

        // Card Image
        const cardImage = document.createElement('div');
        cardImage.classList.add('card-image');
        const imageLink = document.createElement('a');
        imageLink.href = 'page.html'; // Replace 'page.html' with the link to the piece's page
        const image = document.createElement('img');

        // Set the preview image URL to the Google Cloud Storage URL
        const sanitizedTitle = piece.title.replace(/\s+/g, '-').toLowerCase();
        const imageUrl = `https://storage.googleapis.com/welton-music-images/${sanitizedTitle}.jpg`;
        image.src = imageUrl;
        image.alt = piece.title + ' Preview'; // Replace 'piece.title' with the actual title
        image.style.width = '100%';
        image.style.height = 'auto';
        imageLink.appendChild(image);
        cardImage.appendChild(imageLink);
        card.appendChild(cardImage);

        // Card Content
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        const title = document.createElement('h2');
        title.classList.add('card-title');
        title.textContent = piece.title; // Replace 'piece.title' with the actual title
        const subtitle = document.createElement('h3');
        subtitle.classList.add('card-subtitle');
        subtitle.textContent = piece.subtitle; // Replace 'piece.subtitle' with the actual subtitle
        const description = document.createElement('div');
        description.classList.add('card-description');
        const descriptionText = document.createElement('p');
        descriptionText.textContent = piece.description; // Replace 'piece.description' with the actual description
        description.appendChild(descriptionText);
        cardContent.appendChild(title);
        cardContent.appendChild(subtitle);
        cardContent.appendChild(description);

        // Audio Player
        const audioContainer = document.createElement('div');
        audioContainer.classList.add('card-audio');
        const audio = document.createElement('audio');
        audio.controls = true;

        // Set the audio source URL to the Google Cloud Storage URL
        const audioSourceUrl = `https://storage.googleapis.com/welton-music/${sanitizedTitle}.mp3`;
        const audioSource = document.createElement('source');
        audioSource.src = audioSourceUrl;
        audioSource.type = 'audio/mpeg';
        audio.appendChild(audioSource);
        audioContainer.appendChild(audio);
        cardContent.appendChild(audioContainer);

        // Buy Button (Gumroad Product Link)
        const buyContainer = document.createElement('div');
        buyContainer.classList.add('card-buy');
        const buyButton = document.createElement('a');
        buyButton.classList.add('buy-button');
        buyButton.href = `https://bewe3.gumroad.com/l/${sanitizedTitle}`; // Replace 'piece.gumroadLink' with the Gumroad product link for the piece
        buyButton.textContent = 'Buy PDF'; // You can customize the button text as needed
        buyContainer.appendChild(buyButton);
        cardContent.appendChild(buyContainer);

        // Tags
        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('card-tags');
        piece.tags.forEach((tag) => {
          const tagElement = document.createElement('span');
          tagElement.classList.add('tag');
          tagElement.textContent = tag; // Assuming 'piece.tags' is an array of tags for each piece
          tagsContainer.appendChild(tagElement);
        });
        cardContent.appendChild(tagsContainer);

        card.appendChild(cardContent);
        musicContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error('Failed to fetch music data:', error);
    });
});
