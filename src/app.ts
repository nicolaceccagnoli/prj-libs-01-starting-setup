// Importo axios
import axios from 'axios';

// Dichiaro una variabile per selezionare il form dall'HTML 
const form = document.querySelector('form')!;
// Dichiaro una variabile per l'input dell'indirizzo
const addressInput = document.getElementById('address')! as HTMLInputElement;
// Dichiaro una variabile per l'API di Google Maps
const GOOGLE_API_KEY = 'AIzaSyALYiBnxlroqc8qawAoV_Tzed9pjXHcWIc';

/*
    google sarà disponibile a livello globale grazie all SDK che sto
    importando in index.html, ma per farlo sapere a TS devo 'dichiararla'
*/
declare var google:any;

// Definiamo un Type Casting per dire che tipo di risposta ci aspettiamo dalla chiamata axios
type GoogleGoecogingResponse = {
    results: {geometry: {location: {lat: number, lng:number}}}[],
    status: 'OK' | 'ZERO_RESULTS';
}

function searchAddressHandler(event : Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    // Inviamo i dati all'API di Google
    axios.get<GoogleGoecogingResponse>
    //encodeURI() rende compatibile una stringa con gli URL
    (`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
    .then(res => {
        // Se lo status della risposta è diverso da OK lanciamo un errore
        if (res.data.status !== 'OK') {
            throw new Error('Could not fetch location!')
        }
        // Dichiaro una variabile per le coordinate restituite dall'indirizzo inserito
        const coordinates = res.data.results[0].geometry.location;

        const map = new google.maps.Map(document.getElementById("map"), {
            center: coordinates,
            zoom: 16,
          });
          // Aggiungo un marker
          new google.maps.Marker({position: coordinates, map: map});
    })
    .catch(err => {
        console.log(err)
    })
}

form.addEventListener('submit', searchAddressHandler);

