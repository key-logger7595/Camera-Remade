
let videoElem = document.querySelector("video");
// 1. 
let recordBtn = document.querySelector(".record");
let captureBtnImage = document.querySelector(".click-image");
console.log(captureBtnImage);
let filterColorArr = document.querySelectorAll(".filter");

let filterOverlayDiv  = document.querySelector(".filter-overlay");
let timingDiv = document.querySelector(".timing");
let plusBtn = document.querySelector(".plus");
let minusBtn = document.querySelector(".minus");
console.log(minusBtn);
console.log(plusBtn);
let clearObjInterval;
let filterColor ; 
let isRecording = false;
let scaleLevelUp = 1;
// user  requirement send 
let constraint = {
    audio: true, video: true
}
// represent future recording
let recording = [];
let mediarecordingObjectForCurrStream;
// promise 
let usermediaPromise = navigator
    .mediaDevices.getUserMedia(constraint);
// /stream coming from required
usermediaPromise.
    then(function (stream) {
        // UI stream 
        videoElem.srcObject = stream;
        // browser
        mediarecordingObjectForCurrStream = new MediaRecorder(stream);
        // camera recording add -> recording array
        mediarecordingObjectForCurrStream.ondataavailable = function (e) {
            recording.push(e.data);
        }
        // download
        mediarecordingObjectForCurrStream.addEventListener("stop", function () {
            // recording -> url convert 
            // type -> MIME type (extension)
            const blob = new Blob(recording, { type: 'video/mp4' });
            const url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.download = "file.mp4";
            a.href = url;
            a.click();
            recording = [];
        })

    }).catch(function (err) {
        console.log(err)
        alert("please allow both microphone and camera");
    });

recordBtn.addEventListener("click", function () {
    console.log("hey there");
    if (mediarecordingObjectForCurrStream == undefined) {
        alert("First select the devices");
        return;
    }
    if (isRecording == false) {
        mediarecordingObjectForCurrStream.start();
        // recordBtn.innerText = "Recording....";
        recordBtn.classList.add("record-animation");
        startTimer();
    }
    else {
        mediarecordingObjectForCurrStream.stop();
        // recordBtn.innerText = "Record";
        recordBtn.classList.remove("record-animation");
        stopTimer();
    }
    isRecording = !isRecording
})


//code for capturing thwe image and then downloading it 
captureBtnImage.addEventListener("click",function(){
    
    console.log("i am clicking");

    let canvas = document.createElement("canvas");
    canvas.height = videoElem.videoHeight;
    canvas.width = videoElem.videoWidth;

    let tool = canvas.getContext("2d");

    //we need to do something here to set canvas height width 
    //according to zoomed image such that we download zoomed image 
    tool.scale(scaleLevelUp, scaleLevelUp);
    const x = (tool.canvas.width / scaleLevelUp - videoElem.videoWidth) / 2;
    const y = (tool.canvas.height / scaleLevelUp - videoElem.videoHeight) / 2;
    
    tool.drawImage(videoElem,0,0);
    if(filterColor){
        tool.fillStyle=filterColor;
        tool.fillRect(0,0,canvas.width,canvas.height)
    }
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.download = "file.png";
    a.href = url;
    a.click();
    a.remove();
    
})
//setting event listener on filtering options 
for(let i=0;i<filterColorArr.length;i++){
    filterColorArr[i].addEventListener("click",function(){
        filterColor = filterColorArr[i].style.backgroundColor;
        filterOverlayDiv.style.backgroundColor = filterColor;
    })
}

 let counter=0;
 function startTimer(){
 timingDiv.style.display = "block";
 function cb(){

     let days = Number.parseInt(counter/(24 * 3600));
     let remTime = (counter % (24 * 3600));
     let hours  = Number.parseInt(remTime/3600);
     remTime =  (remTime % 3600) ;
     let mins = Number.parseInt(remTime/60);
     remTime = (remTime % 60);
     let seconds = remTime;

     days = days < 10 ?`0${days}`:days ;
     hours = hours < 10 ?`0${hours}`:hours;
     mins = mins < 10?`0${mins}`:mins;
     seconds = seconds<10?`0${seconds}`:seconds;

     timingDiv.innerText = `${days}:${hours}:${mins}:${seconds}`;
     counter++;    

    }

    clearObjInterval = setInterval(cb,1000);
}
function stopTimer(){
  counter = 0;    
  timingDiv.style.display ="none";
  timingDiv.innerText="00:00:00:00"; 
  clearInterval(clearObjInterval);
 
}



minusBtn.addEventListener("click",function(){
  if(scaleLevelUp > 1){
      scaleLevelUp-=0.1;
      videoElem.style.transform = `scale(${scaleLevelUp})`;
  }

})

plusBtn.addEventListener("click",function(){
    if(scaleLevelUp < 1.7){
        scaleLevelUp+= 0.1;
        videoElem.style.transform = `scale(${scaleLevelUp})`;
    }
  
  })
  
