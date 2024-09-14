const addToFavorites = (book, button) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const bookIndex = favorites.findIndex(fav => fav.key === book.key);
    
        if (bookIndex === -1) {
            // Add to favorites
            favorites.push(book);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            console.log(`Added to favorites: ${book.title}`);
            button.classList.add('red-button'); // Change button color to red
        } else {
            // Remove from favorites
            favorites.splice(bookIndex, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            console.log(`Removed from favorites: ${book.title}`);
            button.classList.remove('red-button'); // Change button color back to default
        }
    };
    
    
    const searchBooks = async (query) => {
        const loaderContainer = document.querySelector('.loader-container');
        const errorMessage = document.getElementById('error-message');
        loaderContainer.style.display = 'flex'; // Show loader
        errorMessage.style.display = 'none'; // Hide error message
    
        try {
            const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
            const data = await response.json();
            const books = data.docs;
    
            const gridContainer = document.querySelector('.grid-container');
            gridContainer.innerHTML = ''; // Clear previous results
    
            if (books.length === 0) {
                errorMessage.style.display = 'block'; // Show error message
            } else {
                books.forEach((book) => {
                    const gridItem = document.createElement('div');
                    gridItem.classList.add('grid-item');
                    gridItem.dataset.key = book.key; // Store the book key for later use
    
                    const img = document.createElement('img');
                    img.dataset.src = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : 'default-cover.jpg'; // Use a default image if no cover is available
                    img.alt = `Book Poster`;
    
                    const title = document.createElement('h3');
                    title.textContent = book.title;
    
                    const author = document.createElement('p');
                    author.textContent = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
    
                    const favButton = document.createElement('button');
                    favButton.innerHTML='<i class="fa-solid fa-heart"></i>';
                    favButton.onclick = (event) => {
                        event.stopPropagation(); // Prevent the click event from bubbling up to the grid item
                        addToFavorites(book, favButton);
                    };
    
                    gridItem.appendChild(img);
                    gridItem.appendChild(title);
                    gridItem.appendChild(author);
                    gridItem.appendChild(favButton);
                    gridContainer.appendChild(gridItem);
    
                
                });
    
                lazyLoadImages();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            errorMessage.style.display = 'block'; // Show error message
            errorMessage.textContent = 'An error occurred while fetching data. Please try again later.';
        } finally {
            loaderContainer.style.display = 'none'; // Hide loader
        }
    };
    
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('.grid-item img');
    
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('lazy-loaded');
                    observer.unobserve(img);
                }
            });
        });
    
        images.forEach(img => {
            observer.observe(img);
        });
    };
    
    const displayFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const gridContainer = document.querySelector('.grid-container');
        gridContainer.innerHTML = ''; // Clear previous results
    
        if (favorites.length === 0) {
            gridContainer.innerHTML = '<p>No favorite books found.</p>';
        } else {
            favorites.forEach((book) => {
                const gridItem = document.createElement('div');
                gridItem.classList.add('grid-item');
    
                const img = document.createElement('img');
                img.src = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : 'default-cover.jpg'; // Use a default image if no cover is available
                img.alt = `Book Poster`;
    
                const title = document.createElement('h3');
                title.textContent = book.title;
    
                const author = document.createElement('p');
                author.textContent = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
    
                gridItem.appendChild(img);
                gridItem.appendChild(title);
                gridItem.appendChild(author);
                gridContainer.appendChild(gridItem);
            });
        }
    };
    
    document.getElementById('favorites-icon').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        displayFavorites();
    });
    
    const searchIcons = document.querySelector("#searchIcons");
    
    searchIcons.addEventListener("click", () => {
        const searchField = document.querySelector("#search-box").value;
        searchBooks(searchField);
    });
    

    // Function to fetch book details when clicked on a book
const fetchBookDetails = async (bookKey) => {
    const loaderContainer = document.querySelector('.loader-container');
    const errorMessage = document.getElementById('error-message');
    loaderContainer.style.display = 'flex'; // Show loader
    errorMessage.style.display = 'none'; // Hide error message

    try {
        // Fetch the book details from Open Library API
        const response = await fetch(`https://openlibrary.org${bookKey}.json`);
        const bookData = await response.json();

        // Check if there is a readable version (via ebooks or availability)
        let readableLink = null;
        if (bookData.ebooks && bookData.ebooks.length > 0 && bookData.ebooks[0].preview_url) {
            readableLink = bookData.ebooks[0].preview_url;
        } else if (bookData.availability && bookData.availability.read_url) {
            readableLink = bookData.availability.read_url;
        }

        // If the book is readable, display it
        if (readableLink) {
            displayBookContent(readableLink, bookData);
        } else {
            // If not readable, show metadata and a link to the Open Library page
            displayBookMetadata(bookData);
        }

    } catch (error) {
        console.error('Error fetching book details or content:', error);
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'An error occurred while fetching the book. Please try again later.';
    } finally {
        loaderContainer.style.display = 'none'; // Hide loader
    }
};

// Function to display book content if it's readable
const displayBookContent = (url, book) => {
    const bookDetailsContainer = document.getElementById('book-details');
    const bookContent = document.getElementById('book-content');

    // Insert the iframe for reading the book inside the modal
    bookContent.innerHTML = `
        <h2>${book.title}</h2>
        <h4>Author: ${book.authors ? book.authors.map(author => author.name).join(', ') : 'Unknown Author'}</h4>
        <iframe src="${url}" width="100%" height="600px"></iframe>
        <p><a href="${url}" target="_blank">Open the book in a new tab</a></p>
    `;
    
    bookDetailsContainer.style.display = 'block';
    bookDetailsContainer.classList.add('active');
};

// Function to display book metadata if it's not readable
const displayBookMetadata = (book) => {
    const bookDetailsContainer = document.getElementById('book-details');
    const bookContent = document.getElementById('book-content');

    // Insert metadata and a link to Open Library page
    const openLibraryLink = `https://openlibrary.org${book.key}`;
    bookContent.innerHTML = `
        <h2>${book.title}</h2>
        <h4>Author: ${book.authors ? book.authors.map(author => author.name).join(', ') : 'Unknown Author'}</h4>
        <p>${book.description ? (typeof book.description === 'string' ? book.description : book.description.value) : 'No description available.'}</p>
        <p><a href="${openLibraryLink}" target="_blank">View this book on Open Library</a></p>
    `;

    bookDetailsContainer.style.display = 'block';
    bookDetailsContainer.classList.add('active');
};

// Event listener for book clicks
document.querySelector('.grid-container').addEventListener('click', (event) => {
    const gridItem = event.target.closest('.grid-item');
    if (gridItem) {
        const bookKey = gridItem.dataset.key;
        fetchBookDetails(bookKey);
    }
});

// Close button event
document.getElementById('close-details').addEventListener('click', () => {
    const bookDetailsContainer = document.getElementById('book-details');
    bookDetailsContainer.style.display = 'none';
    bookDetailsContainer.classList.remove('active');
});
