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

    // EventListeners
    reloadButtonElement.addEventListener('click', () => updateCuteCatImg(PAGE, LIMIT));

    // App
    updateCuteCatImg(PAGE, LIMIT);


    // Functions
    async function updateCuteCatImg(page = 0, limit = 1) {
        spinnerStatus(true);
        const cuteCat = await getCuteCatImg(`${API}/images/search?limit=${limit}`);
        spinnerStatus(false);
        console.log(cuteCat)
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
}

document.addEventListener('DOMContentLoaded', main)