//https://api.open-meteo.com/v1/forecast
import {getTemperature,defaultUrlt} from './modes/temperature.js';
import {getHumidity,defaultUrlh} from './modes/humidity.js';

window.currentChart=null;

let linkMode="temperature_2m";
const selectedMode=document.getElementById('mode');
const ctx=document.getElementById('myChart').getContext('2d');
let start=0,end=24;
let url=defaultUrlt;

let latcoords,longcoords;
let modetitlediv=document.querySelector('.modetitle');
selectedMode.addEventListener('change',()=>{
    if(selectedMode.value=="Temperature"){
        modetitlediv.innerHTML="Temperature °C:";
        linkMode="temperature_2m";
    }
    else if(selectedMode.value=="Humidity"){
        modetitlediv.innerHTML="RelativeHumidity %:";
        linkMode="relative_humidity_2m";
    } 
    console.log(selectedMode.value);
    setupPage();
    putButtons();
});

const setupPage=async()=>{
    if(latcoords && longcoords){
        if(linkMode==="temperature_2m"){
            url=`https://api.open-meteo.com/v1/forecast?latitude=${parseFloat(latcoords.value)}&longitude=${parseFloat(longcoords.value)}&hourly=${linkMode}`;
            await getTemperature(url,start,end,ctx);
        }
        else if(linkMode==="relative_humidity_2m"){
            url=`https://api.open-meteo.com/v1/forecast?latitude=${parseFloat(latcoords.value)}&longitude=${parseFloat(longcoords.value)}&hourly=${linkMode}`;
            await getHumidity(url,start,end,ctx);
        }
    }
    else{
        if(linkMode==="temperature_2m"){
            url=defaultUrlt;
            await getTemperature(url,start,end,ctx);
        }
        else if(linkMode==="relative_humidity_2m"){
            url=defaultUrlh;
            await getHumidity(url,start,end,ctx);
        }
    }
}
const putButtons=async()=>{
    let daysbuttondiv=document.querySelector('.daysdiv');
    let buttonui="";
    let response=await fetch(url);
    let data=await response.json();
    for(let i=0;i<7;i++){
        buttonui+=`<button class="day" id=${i*24}>${data.hourly.time[i*24].slice(0,10)}</button>`;
    }
    daysbuttondiv.innerHTML=buttonui;

    let dateButton=document.querySelectorAll('.day');
    dateButton.forEach((option)=>{
        option.addEventListener('click',async()=>{
            start=parseInt(option.id);
            end=start+24;
            await setupPage();
            let dateshowing="";
            dateshowing+=option.innerText;
            document.querySelector('.dateshow').innerHTML=dateshowing;
        });
    });
}
document.addEventListener('DOMContentLoaded',async()=>{
    await setupPage();
    await putButtons();
});

let buttonhtml=document.querySelector('.mainbutton');

buttonhtml.addEventListener('click',async()=>{
    latcoords=document.querySelector('.js-latinput');
    longcoords=document.querySelector('.js-longinput');
    url=`https://api.open-meteo.com/v1/forecast?latitude=${parseFloat(latcoords.value)}&longitude=${parseFloat(longcoords.value)}&hourly=${linkMode}`;
    await setupPage();
    await putButtons();
});