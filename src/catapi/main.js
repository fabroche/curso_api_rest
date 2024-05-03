function main() {
    // CONST
    const PAGE = 0;
    const LIMIT = 3;

    // APIs
    const API = "https://api.thecatapi.com/v1"

    // DOM Elements
    const pictureRandomCuteCatsElement = document.getElementById('picture-randomCuteCats')
    const pictureFavoriteCuteCatsElement = document.getElementById('picture-FavoritesCuteCats')
    const spanRandomCatErrorMsgElement = document.getElementById('random-cat-error-msg');
    const spanFavoriteCatErrorMsgElement = document.getElementById('favorite-cat-error-msg');
    const reloadButtonElement = document.getElementById('button-reload-cat-img');
    const spinnerRamdomCatElement = document.getElementById('spinner-cat-img');
    const spinnerFavRamdomCatElement = document.getElementById('spinner-fav-cat-img');


    // EventListeners
    reloadButtonElement.addEventListener('click', () => fetchRamdomCuteCats(PAGE, LIMIT));

    // App
    fetchRamdomCuteCats(PAGE, LIMIT);
    fetchFavoritesRamdomCuteCats();


    // Functions
    async function fetchRamdomCuteCats(page = 0, limit = 1) {
        handleSpinnerStatus(spinnerRamdomCatElement, true);
        const randomCuteCats = await getCuteCatImg(`${API}/images/search?limit=${limit}&page=${page}`);
        handleSpinnerStatus(spinnerRamdomCatElement, false);

        if (randomCuteCats.length === 0) {

            pictureRandomCuteCatsElement.classList.add('v-hidden')
            spanRandomCatErrorMsgElement.classList.remove('d-hidden')
            spanRandomCatErrorMsgElement.innerText = `☹ Aún no tenemos imagenes de gatitos.`

        } else if (randomCuteCats === false) {

            pictureRandomCuteCatsElement.classList.add('v-hidden')
            spanRandomCatErrorMsgElement.classList.remove('d-hidden')
            spanRandomCatErrorMsgElement.innerText = `☹ Lo sentimos, hubo un error al obtener tus gatitos. Intentalo mas tarde.`

        } else {

            spanRandomCatErrorMsgElement.classList.add('d-hidden')
            pictureRandomCuteCatsElement.classList.remove('v-hidden')
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
            `
            handleAddOnClickEventToLikeButtons()
        }

    }

    async function fetchFavoritesRamdomCuteCats() {

        handleSpinnerStatus(spinnerFavRamdomCatElement, true);
        const favCuteCat = await getCuteCatImg(`${API}/favourites`);
        handleSpinnerStatus(spinnerFavRamdomCatElement, false);

        if (favCuteCat.length === 0) {

            pictureFavoriteCuteCatsElement.classList.add('v-hidden')
            spanFavoriteCatErrorMsgElement.classList.remove('error-msg')
            spanFavoriteCatErrorMsgElement.classList.remove('d-hidden')
            spanFavoriteCatErrorMsgElement.innerText = `Aún no Tienes gatitos favoritos.`

        } else if (favCuteCat === false) {
            pictureFavoriteCuteCatsElement.classList.add('v-hidden')
            spanFavoriteCatErrorMsgElement.classList.remove('d-hidden')
            spanFavoriteCatErrorMsgElement.classList.add('error-msg')
            spanFavoriteCatErrorMsgElement.innerText = `☹ Lo sentimos, hubo un Error al obtener tu lista de gatitos favoritos. Intentalo mas tarde.`

        } else {
            spanFavoriteCatErrorMsgElement.classList.add('d-hidden')
            pictureFavoriteCuteCatsElement.classList.remove('v-hidden')
            pictureFavoriteCuteCatsElement.innerHTML = `
            ${favCuteCat.reverse().map(cuteCat => `
            <article>
                <img 
                alt="Foto de gatito aleatorio"
                id=${cuteCat.image.id}
                src=${cuteCat.image.url}
                >
                
                <button 
                class="like-button like"
                id=favButton-${cuteCat.image.id}
                >
                </button>
            </article>
            `).join('')}
<!--            <div class="gradient-bg"></div>-->
            `
            handleAddOnClickEventToLikeButtons()
        }

    }

    async function getCuteCatImg(urlApi) {

        const res = await fetch(urlApi, {
            headers: {
                "x-api-key": "live_iN04OIXyxdLc5sNnKDP1FxwcjVPLbv5RKBullRyGgXvLNlztrj1ObBSPbfW1SDoM"
            }
        });

        if (res.status !== 200) {
            return false;

        } else {
            return res.json()
        }
    }

    async function setFavoriteImg(data) {

        const favCuteCat = await postFavoriteCuteCatImg(`${API}/favourites`, data);

        fetchFavoritesRamdomCuteCats()
    }

    async function postFavoriteCuteCatImg(urlApi, data) {

        const res = await fetch(urlApi, {
            method: 'POST',
            headers: {
                "x-api-key": "live_iN04OIXyxdLc5sNnKDP1FxwcjVPLbv5RKBullRyGgXvLNlztrj1ObBSPbfW1SDoM",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (res.status !== 200) {
            return false;

        } else {
            return res.json()
        }
    }

    function handleAddOnClickEventToLikeButtons() {
        for (let button of document.getElementsByClassName('like-button')) {
            if (!button.hasAttribute('onclick-event-assigned')) {
                button.addEventListener('click', (e) => handleFavoriteCuteCat(e))
                button.setAttribute('onclick-event-assigned', 'true')
            }
        }
    }

    function handleSpinnerStatus(spinnerElement, isShow) {
        isShow
            ? spinnerElement.classList.add("show")
            : spinnerElement.classList.remove("show")
    }

    const handleFavoriteCuteCat = (e) => {
        e.preventDefault()

        const classList = new Array(0)
        for (const value of e.target.classList.values()) {
            classList.push(value)
        }

        if (classList.find(value => value === "like")) {
            e.target.classList.remove("like")
        } else {
            e.target.classList.add("like")
            // el id se obtiene al quitarle el indicador favButton- al elemento HTML
            setFavoriteImg({
                "image_id": `${e.target.id.split('favButton-')[1]}`,
                "sub_id": "fabroche"
            })
        }


    }
}

document.addEventListener('DOMContentLoaded', main)