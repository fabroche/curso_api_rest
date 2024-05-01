function main() {
    // CONST
    const PAGE = 0;
    const LIMIT = 3;

    // APIs
    const API = "https://api.thecatapi.com/v1"

    // DOM Elements
    const imgElement = document.getElementById('cat-img');
    const imgElement2 = document.getElementById('cat-img-2');
    const imgElement3 = document.getElementById('cat-img-3');
    const imgErrorMsgElement = document.getElementById('cat-img-error-msg');
    const reloadButtonElement = document.getElementById('button-reload-cat-img');
    const spinnerElement = document.getElementById('spinner-cat-img');
    const favButtonElement_1 = document.getElementById('favButton-cat-img')
    const favButtonElement_2 = document.getElementById('favButton-cat-img-2')
    const favButtonElement_3 = document.getElementById('favButton-cat-img-3')


    // EventListeners
    reloadButtonElement.addEventListener('click', () => updateCuteCatImg(PAGE, LIMIT));
    favButtonElement_1.addEventListener('click', (e) => handleFavoriteCuteCat(e))
    favButtonElement_2.addEventListener('click', (e) => handleFavoriteCuteCat(e))
    favButtonElement_3.addEventListener('click', (e) => handleFavoriteCuteCat(e))

    // App
    updateCuteCatImg(PAGE, LIMIT);


    // Functions
    async function updateCuteCatImg(page = 0, limit = 1) {
        spinnerStatus(true);
        const cuteCat = await getCuteCatImg(`${API}/images/search?limit=${limit}&page=${page}`);
        spinnerStatus(false);
        imgElement.src = cuteCat[0].url;
        imgElement2.src = cuteCat[1].url;
        imgElement3.src = cuteCat[2].url;
    }

    async function getCuteCatImg(urlApi) {
        try {
            const res = await fetch(urlApi, {
                headers: {
                    "x-api-key": "live_iN04OIXyxdLc5sNnKDP1FxwcjVPLbv5RKBullRyGgXvLNlztrj1ObBSPbfW1SDoM"
                }
            })
            return res.json()
        } catch (error) {
            imgErrorMsgElement.innerText = "☹ No pudimos encontrar un gatito"
        }
    }

    function spinnerStatus(isShow) {
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