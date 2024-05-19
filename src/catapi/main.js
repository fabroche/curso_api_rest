function main() {
    // CONST
    const PAGE = 0;
    const LIMIT = 3;

    // APIs
    const catApi = axios.create({
        baseURL: 'https://api.thecatapi.com/v1'
    });

    catApi.defaults.headers.common['x-api-key'] = 'live_iN04OIXyxdLc5sNnKDP1FxwcjVPLbv5RKBullRyGgXvLNlztrj1ObBSPbfW1SDoM'

    const API = "https://api.thecatapi.com/v1"

    // DOM Elements (Globales)
    const pictureRandomCuteCatsElement = document.getElementById('picture-randomCuteCats')
    const pictureFavoriteCuteCatsElement = document.getElementById('picture-FavoritesCuteCats')
    const spanRandomCatErrorMsgElement = document.getElementById('random-cat-error-msg');
    const spanFavoriteCatErrorMsgElement = document.getElementById('favorite-cat-error-msg');
    const reloadButtonElement = document.getElementById('button-reload-cat-img');
    const spinnerRamdomCatElement = document.getElementById('spinner-cat-img');
    const spinnerFavRamdomCatElement = document.getElementById('spinner-fav-cat-img');
    const uploadFormCuteCatElement = document.getElementById('form-upload-cute-cat');
    const spinnerFormCuteCatElement = document.getElementById('spinner-form-cat-img')
    const formInputFileCuteCatElement = document.getElementById('file');

    // EventListeners
    reloadButtonElement.addEventListener('click', () => fetchRamdomCuteCats(PAGE, LIMIT));
    uploadFormCuteCatElement.addEventListener('submit', (e) => handleFormSubmit(e));
    formInputFileCuteCatElement.addEventListener('change', (e) => handleFileInputChange(e));

    // App
    fetchRamdomCuteCats(PAGE, LIMIT);
    fetchFavoritesRamdomCuteCats();

    // Functions
    /**
     * Asynchronously fetches random cute cat images.
     *
     * @param {number} page - The page number to fetch.
     * @param {number} limit - The limit of images to fetch.
     */
    async function fetchRamdomCuteCats(page = 0, limit = 1) {
        // Show spinner
        handleSpinnerStatus(spinnerRamdomCatElement, true);

        // Fetch random cute cat images
        const randomCuteCats = await getCuteCatImg(`${API}/images/search?limit=${limit}&page=${page}`);

        // Hide spinner
        handleSpinnerStatus(spinnerRamdomCatElement, false);

        // Check if there are no random cute cat images
        if (randomCuteCats.length === 0) {
            pictureRandomCuteCatsElement.classList.add('v-hidden');
            spanRandomCatErrorMsgElement.classList.remove('d-hidden');
            spanRandomCatErrorMsgElement.innerText = `☹ Aún no tenemos imagenes de gatitos.`;
        }
        // Check if there was an error fetching random cute cat images
        else if (randomCuteCats === false) {
            pictureRandomCuteCatsElement.classList.add('v-hidden');
            spanRandomCatErrorMsgElement.classList.remove('d-hidden');
            spanRandomCatErrorMsgElement.innerText = `☹ Lo sentimos, hubo un error al obtener tus gatitos. Inténtalo más tarde.`;
        }
        // Display the random cute cat images
        else {
            // Hide error message
            spanRandomCatErrorMsgElement.classList.add('d-hidden');
            // Show random cute cat images
            pictureRandomCuteCatsElement.classList.remove('v-hidden');
            // Render random cute cat images
            pictureRandomCuteCatsElement.innerHTML = `
            ${randomCuteCats.map(cuteCat => `
                <article>
                    <img 
                        alt=${"Foto de gatito aleatorio"}
                        id=${cuteCat.id}
                        src=${cuteCat.url}
                    >
                    
                    <button 
                        class=like-button
                        id=favButton-${cuteCat.id}
                    >
                    </button>
                </article>
            `).join('')}
        `;
            // Add onclick event to like buttons
            handleAddOnClickEventToLikeButtons();
        }
    }

    /**
     * Fetches random cute cat images from the favorites API and updates the UI accordingly.
     *
     * @returns {Promise<void>} A promise that resolves when the UI is updated.
     */
    async function fetchFavoritesRamdomCuteCats() {
        // Show spinner
        handleSpinnerStatus(spinnerFavRamdomCatElement, true);

        // Fetch random cute cat images from the favorites API
        const favCuteCat = await getCuteCatImg(`${API}/favourites`);

        // Hide spinner
        handleSpinnerStatus(spinnerFavRamdomCatElement, false);

        // Check if there are no favorite cute cat images
        if (favCuteCat.length === 0) {
            // Hide the picture container and show the error message
            pictureFavoriteCuteCatsElement.classList.add('v-hidden');
            spanFavoriteCatErrorMsgElement.classList.remove('error-msg');
            spanFavoriteCatErrorMsgElement.classList.remove('d-hidden');
            spanFavoriteCatErrorMsgElement.innerText = `Aún no Tienes gatitos favoritos.`;
        } else if (favCuteCat === false) {
            // Hide the picture container and show the error message
            pictureFavoriteCuteCatsElement.classList.add('v-hidden');
            spanFavoriteCatErrorMsgElement.classList.remove('d-hidden');
            spanFavoriteCatErrorMsgElement.classList.add('error-msg');
            spanFavoriteCatErrorMsgElement.innerText = `☹ Lo sentimos, hubo un Error al obtener tu lista de gatitos favoritos. Intentalo mas tarde.`;
        } else {
            // Show the picture container and update the UI with the favorite cute cat images
            spanFavoriteCatErrorMsgElement.classList.add('d-hidden');
            pictureFavoriteCuteCatsElement.classList.remove('v-hidden');

            pictureFavoriteCuteCatsElement.innerHTML = `
        ${favCuteCat.reverse().map(cuteCat => `
        <article>
            <img 
            alt="Foto de gatito aleatorio"
            id=${cuteCat.id}
            src=${cuteCat.image.url}
            >
            
            <button 
            class="like-button like"
            id=favButton-${cuteCat.image.id}-${cuteCat.id}
            >
            </button>
        </article>
        `).join('')}
        `;
            handleAddOnClickEventToLikeButtons();
        }
    }

    /**
     * Sets the favorite image for a cat and updates the button ID.
     *
     * @param {Object} data - The data for the favorite cat image.
     * @param {string} buttonId - The ID of the button for the cat.
     * @returns {Promise<void>} - A promise that resolves when the favorite image is set and the button ID is updated.
     */
    async function setFavoriteImg(data, buttonId) {
        // Post the favorite cat image to the API
        const newFavoriteCat = await postFavoriteCuteCatImg(`${API}/favourites`, data);

        // Update the button ID to include the unique favorite ID
        const button = document.getElementById(buttonId);
        button.id = `${button.id.split('-').slice(0, 2).join('-')}-${newFavoriteCat.id}`;

        // Fetch the updated favorite cat images
        fetchFavoritesRamdomCuteCats();
    }

    /**
     * Removes a favorite cat image from the favorites API and fetches random cute cat images.
     *
     * @param {string} cuteCatImgId - The ID of the cat image to remove from favorites.
     * @returns {Promise<void>} - A promise that resolves when the favorite image is removed and the UI is updated.
     */
    async function removeFavoriteImg(cuteCatImgId) {
        // Delete the favorite cat image from the favorites API
        await deleteFavoriteCuteCatImg(`${API}/favourites/${cuteCatImgId}`);

        // Fetch random cute cat images from the favorites API and update the UI
        fetchFavoritesRamdomCuteCats();
    }

    /**
     * Fetches a cute cat image from the specified URL.
     *
     * @param {string} urlApi - The URL of the API endpoint to fetch the cat image from.
     * @returns {Promise<Object|boolean>} - A promise that resolves to the JSON response containing the cat image data if the request is successful, or false if the request fails.
     */
    async function getCuteCatImg(urlApi) {
        // Send a GET request to the specified URL with the API key in the headers
        const res = await fetch(urlApi, {
            headers: {
                "x-api-key": "live_iN04OIXyxdLc5sNnKDP1FxwcjVPLbv5RKBullRyGgXvLNlztrj1ObBSPbfW1SDoM"
            }
        });

        // Check if the response status is not 200
        if (res.status !== 200) {
            // Return false if the request fails
            return false;
        } else {
            // Parse the response body as JSON and return it
            return res.json();
        }
    }

    /**
     * Sends a POST request to the specified URL to post a favorite cat image.
     *
     * @param {string} urlApi - The URL of the API endpoint to post the cat image to.
     * @param {Object} data - The data to be sent in the request body.
     * @returns {Promise<Object|boolean>} - A promise that resolves to the JSON response containing the cat image data if the request is successful, or false if the request fails.
     */
    async function postFavoriteCuteCatImg(urlApi, data) {
        try {
            // Send a POST request to the specified URL with the API key and data in the headers and body
            const res = await fetch(urlApi, {
                method: 'POST',
                headers: {
                    "x-api-key": "live_iN04OIXyxdLc5sNnKDP1FxwcjVPLbv5RKBullRyGgXvLNlztrj1ObBSPbfW1SDoM",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            // Check if the response status is not 200
            if (res.status !== 200) {
                // Return false if the request fails
                return false;
            } else {
                // Parse the response body as JSON and return it
                return res.json();
            }
        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error posting favorite cat image:', error);
            return false;
        }
    }

    /**
     * Deletes a favorite cute cat image.
     *
     * @param {string} urlApi - The URL of the API endpoint to delete the cat image from.
     * @returns {Promise<Object|boolean>} - A promise that resolves to the JSON response containing the deleted cat image data if the request is successful, or false if the request fails.
     */
    async function deleteFavoriteCuteCatImg(urlApi) {
        try {
            // Send a DELETE request to the specified URL with the API key in the headers
            const res = await fetch(urlApi, {
                method: 'DELETE',
                headers: {
                    "x-api-key": "live_iN04OIXyxdLc5sNnKDP1FxwcjVPLbv5RKBullRyGgXvLNlztrj1ObBSPbfW1SDoM",
                    "Content-Type": "application/json"
                },
            });

            // Check if the response status is not 200
            if (res.status !== 200) {
                // Return false if the request fails
                return false;
            } else {
                // Parse the response body as JSON and return it
                return res.json();
            }
        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error deleting favorite cat image:', error);
            return false;
        }
    }

    // Status Handlers
    /**
     * Adds an onclick event to the like buttons if it hasn't been assigned already.
     * The event handler calls the handleFavoriteCuteCat function.
     */
    function handleAddOnClickEventToLikeButtons() {
        // Loop through all the elements with the class 'like-button'
        for (let button of document.getElementsByClassName('like-button')) {
            // Check if the onclick event has not been assigned to the button
            if (!button.hasAttribute('onclick-event-assigned')) {
                // Add the onclick event to the button
                button.addEventListener('click', (e) => handleFavoriteCuteCat(e))
                // Set the attribute 'onclick-event-assigned' to 'true' to indicate that the event has been assigned
                button.setAttribute('onclick-event-assigned', 'true')
            }
        }
    }

    /**
     * Toggles the visibility of a spinner element based on the value of the `isShow` parameter.
     * @param {HTMLElement} spinnerElement - The spinner element to toggle.
     * @param {boolean} isShow - Indicates whether the spinner should be shown or hidden.
     */
    function handleSpinnerStatus(spinnerElement, isShow) {
        // If `isShow` is true, add the "show" class to the spinner element to make it visible.
        // Otherwise, remove the "show" class to hide the spinner element.
        isShow ? spinnerElement.classList.add("show") : spinnerElement.classList.remove("show");
    }

    /**
     * Handles the click event on a favorite cat button.
     * If the button is already liked, it removes the "like" class and updates the state of the button in the "random cats" section.
     * If the button is not yet liked, it adds the "like" class and updates the state of the button in the "random cats" section.
     * @param {Event} e - The click event.
     */
    const handleFavoriteCuteCat = (e) => {
        e.preventDefault()

        // Get the class list of the clicked button
        const classList = Array.from(e.target.classList.values())

        // Check if the button is already liked
        if (classList.includes("like")) {
            // Remove the "like" class from the clicked button
            e.target.classList.remove("like")

            // Get the id of the clicked button and extract the random cat image id
            const randomCatImgId = e.target.id.split('-')[1]

            // Find the element with the same id in the "random cats" section
            const catImgElementInSectionRandom = document.getElementById(`${e.target.id}`) || document.getElementById(`favButton-${randomCatImgId}`)

            // If the element is found, remove the "like" class from it
            if (catImgElementInSectionRandom) {
                catImgElementInSectionRandom.classList.remove("like")
            }

            // Get the id of the clicked button and extract the cat image id
            const catImgId = e.target.id.split('-')[2]

            // Remove the favorite image
            removeFavoriteImg(catImgId)
        } else {
            // Add the "like" class to the clicked button
            e.target.classList.add("like")

            // Get the id of the clicked button and extract the random cat image id
            const randomCatImgId = e.target.id.split('-')[1]

            // Set the favorite image
            setFavoriteImg({
                "image_id": `${randomCatImgId}`,
                "sub_id": "fabroche"
            }, e.target.id)
        }
    }

    /**
     * Handles the form submission event.
     * Prevents the default form submission behavior, shows a spinner, uploads the cat photo, and logs the response.
     * @param {Event} e - The form submission event.
     */
    async function handleFormSubmit(e) {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Show the spinner
        handleSpinnerStatus(spinnerFormCuteCatElement, true);

        // Upload the cat photo and get the response
        const res = await uploadCuteCatPhoto(e);

        // Hide the spinner
        handleSpinnerStatus(spinnerFormCuteCatElement, false);

        // Log the response
        console.log(res);
    }

    /**
     * Uploads a cute cat photo to the API.
     * @param {Event} e - The form submission event.
     * @returns {Promise<Object|boolean>} - A promise that resolves to the JSON response containing the cat image data if the request is successful, or false if the request fails.
     */
    async function uploadCuteCatPhoto(e) {
        // Create a FormData object from the form submission event target
        const formData = new FormData(e.target);

        // Send a POST request to the API endpoint to upload the cat photo
        const {res, status} = catApi.post('images/upload', formData)
        // const res = await fetch(`${API}/images/upload`, {
        //     method: 'POST',
        //     headers: {
        //         "x-api-key": "live_iN04OIXyxdLc5sNnKDP1FxwcjVPLbv5RKBullRyGgXvLNlztrj1ObBSPbfW1SDoM",
        //     },
        //     body: formData
        // });

        // Check if the response status is not 200
        if (status !== 200) {
            // Return false if the request fails
            return false;
        } else {
            // Parse the response body as JSON and return it
            return res;
        }
    }

    /**
     * Handles the change event of the file input.
     * Updates the label with the selected file's name and preview.
     *
     * @param {Event} e - The change event.
     */
    function handleFileInputChange(e) {
        // Get the label element
        const label = document.getElementById('label-for-file');
        label.classList.add('flex-column');

        // Create a FileReader object
        const reader = new FileReader();

        // Set the onload event handler for the reader
        reader.onload = function (event) {
            // Update the label with the file name and preview
            label.innerHTML = `
            <h3>${e.target.files[0].name}</h3>
            <img src="${event.target.result}" alt="${e.target.files[0].name}" class="upload-file-preview"/>
        `;
        };

        // Read the file as a data URL
        reader.readAsDataURL(e.target.files[0]);
    }
}

// Wait for the DOM to be fully loaded before executing the main function
// This ensures that all the elements are available for the main function
document.addEventListener('DOMContentLoaded', main)