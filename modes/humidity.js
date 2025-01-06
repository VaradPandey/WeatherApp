export let defaultUrlh="https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&hourly=relative_humidity_2m";
export const getHumidity=async(url,start,end,ctx)=>{
    try{
        let response=await fetch(url);
        let data=await response.json();
        console.log(data);
        console.log(data.hourly.relative_humidity_2m.slice(start,end));
        console.log(data.hourly.time.slice(start,end));
        displayHumidity(ctx,data.hourly.relative_humidity_2m.slice(start,end),data.hourly.time.slice(start,end));
    }
    catch(error){
        let showfield = document.querySelector('.apidata');
        showfield.innerHTML="Latitude must be in range of -90 to 90°<br>Longitude must be in range of -180 to 180°";
        console.log(error);
    }
}

const displayHumidity=(ctx,hum,time)=>{
    let showfield=document.querySelector('.apidata');
    showfield.innerHTML="";
    let newTime=[];
    let m=0;
    for(let i=0;i<time.length;i++){
        if(time[i]){
            newTime[m++]=time[i].slice(11,16);
        } else {
            newTime[m++]="N/A";
        }
    }
    if(window.currentChart){
        window.currentChart.destroy();
    }
    window.currentChart=new Chart(ctx,{
        type: "line",
        data:{
        labels: newTime, //xaxis
        datasets: [{
            label: 'Humidity',
            backgroundColor: 'rgba(62, 4, 79, 0.95)',
            borderColor: 'rgb(142, 212, 255)',
            data: hum, //yaxis
            fill: false,
            pointHoverBackgroundColor: 'rgb(142, 212, 255)', // Highlight color on hover
            pointHoverBorderColor: 'rgb(62, 4, 79)', // Border color on hover
        }]},
        plugins:[{
            beforeDraw:(chart)=>{
                chart.canvas.getContext('2d').fillStyle='rgb(242, 249, 255)';
                chart.canvas.getContext('2d').fillRect(0, 0, chart.width, chart.height);
            }
        }]
    });
}



