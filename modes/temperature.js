    export let defaultUrlt="https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&hourly=temperature_2m";
    export const getTemperature=async(url,start,end,ctx)=>{
        try{
            let response=await fetch(url);
            let data=await response.json();
            console.log(data);
            console.log(data.hourly.temperature_2m.slice(start,end));
            console.log(data.hourly.time.slice(start,end));
            displayTemp(ctx,data.hourly.temperature_2m.slice(start,end),data.hourly.time.slice(start,end));
        }
        catch(error){
            let showfield = document.querySelector('.apidata');
            showfield.innerHTML="Error";
            console.log(error);
        }
    }

    const displayTemp=(ctx,temp,time)=>{
        let showfield=document.querySelector('.apidata');
        showfield.innerHTML="";
        let newTime=[];
        let m=0;
        for(let i=0;i<time.length;i++){
            if(time[i]){
                newTime[m++]=time[i].slice(11,16);
            }
            else{
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
                label: 'Temperature',
                backgroundColor: 'rgba(62, 4, 79, 0.95)',
                borderColor: 'rgb(142, 212, 255)',
                data: temp, //yaxis
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



