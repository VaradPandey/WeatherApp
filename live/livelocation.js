let latbox=document.querySelector('.js-latinput');
let longbox=document.querySelector('.js-longinput');
let getLiveButton=document.querySelector('.livebutton');
let submitButton=document.querySelector('.mainbutton');

let marker;
let marker2;
let map;

document.addEventListener('DOMContentLoaded',()=>{
    map=L.map('map').setView([10, 10], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    map.on('click',(e)=>{
        console.log(`${e.latlng.lat},${e.latlng.lng}`);
        if (marker2) {
            marker2.remove();
            marker2=null;
        }
        marker2=L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        marker2.bindPopup(`
            Latitude: ${e.latlng.lat}<br>
            Longitude: ${e.latlng.lng}<br>
            <button class="popbutton" data-lat="${e.latlng.lat}" data-lng="${e.latlng.lng}">Use Location</button>
        `).openPopup();
    });
    document.querySelector('#map').addEventListener('click',(event)=>{
        if (event.target && event.target.classList.contains('popbutton')) {
            const lat=event.target.getAttribute('data-lat');
            const lng=event.target.getAttribute('data-lng');
            latbox.value=lat;
            longbox.value=lng;
            console.log('Button clicked');
        }
    });
});


getLiveButton.addEventListener('click',()=>{
    navigator.geolocation.getCurrentPosition(
        (position)=>{
            latbox.value=position.coords.latitude;
            longbox.value=position.coords.longitude;
        },
        (error)=>console.error(error.message)
    );
});

submitButton.addEventListener('click',()=>{
    if(latbox.value && longbox.value){
        if(marker){
            marker.remove();
            marker=null;
        }
        map.setView([parseFloat(latbox.value), parseFloat(longbox.value)], 13);
        marker=L.marker([parseFloat(latbox.value), parseFloat(longbox.value)]).addTo(map);
        marker.bindPopup(`Latitude: ${latbox.value}<br>Longitude: ${longbox.value}`).openPopup();
    }
    else{
        console.log('Invalid inputs to set up map');
    }
});
