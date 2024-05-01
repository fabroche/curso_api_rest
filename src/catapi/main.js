function main() {

    // APIs
    const API = "https://api.thecatapi.com/v1"

    // DOM Elements
    const imgElement = document.getElementById('cat-img');
    const imgErrorMsgElement = document.getElementById('cat-img-error-msg');
    const reloadButtonElement = document.getElementById('button-reload-cat-img')
    const spinnerElement = document.getElementById('spinner-cat-img')

    // EventListeners
    reloadButtonElement.addEventListener('click', updateCuteCatImg)

    // App
    updateCuteCatImg()

    async function updateCuteCatImg() {
        spinnerStatus(true);
        const cuteCat = await getCuteCatImg(`${API}/images/search`)
        spinnerStatus(false)
        imgElement.src = cuteCat[0].url
    }

    async function getCuteCatImg(urlApi) {
        try {
            const res = await fetch(urlApi)
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