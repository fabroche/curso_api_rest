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
    const imgElement = document.getElementById('cat-img');
    const imgElement2 = document.getElementById('cat-img-2');
    const imgElement3 = document.getElementById('cat-img-3');
    const reloadButtonElement = document.getElementById('button-reload-cat-img');
    const spinnerRamdomCatElement = document.getElementById('spinner-cat-img');
    const spinnerFavRamdomCatElement = document.getElementById('spinner-fav-cat-img');
    const favButtonElement_1 = document.getElementById('favButton-cat-img')
    const favButtonElement_2 = document.getElementById('favButton-cat-img-2')
    const favButtonElement_3 = document.getElementById('favButton-cat-img-3')


    // EventListeners
    reloadButtonElement.addEventListener('click', () => fetchRamdomCuteCats(PAGE, LIMIT));
    favButtonElement_1.addEventListener('click', (e) => handleFavoriteCuteCat(e))
    favButtonElement_2.addEventListener('click', (e) => handleFavoriteCuteCat(e))
    favButtonElement_3.addEventListener('click', (e) => handleFavoriteCuteCat(e))

    // App
    fetchRamdomCuteCats(PAGE, LIMIT);
    fetchFavoritesRamdomCuteCats(PAGE, LIMIT);


    // Functions
    async function fetchRamdomCuteCats(page = 0, limit = 1) {
        spinnerStatus(spinnerRamdomCatElement, true);
        const randomCuteCats = await getCuteCatImg(`${API}/images/search?limit=${limit}&page=${page}`);
        spinnerStatus(spinnerRamdomCatElement, false);

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
            imgElement.src = randomCuteCats[0].url;
            imgElement2.src = randomCuteCats[1].url;
            imgElement3.src = randomCuteCats[2].url;
        }

    }
    async function fetchFavoritesRamdomCuteCats(page = 0, limit = 1) {

        spinnerStatus(spinnerFavRamdomCatElement, true);

        const favCuteCat = await getCuteCatImg(`${API}/favourites?limit=${limit}&page=${page}`);
        spinnerStatus(spinnerFavRamdomCatElement, false);
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
        }
        console.log(favCuteCat)
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

    function spinnerStatus(spinnerElement, isShow) {
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

        classList.find(value => value === "like")
            ? e.target.classList.remove("like")
            : e.target.classList.add("like")

    }
}

document.addEventListener('DOMContentLoaded', main)