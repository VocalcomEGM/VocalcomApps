//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var myInterval = -1;
let timer = 0;

const timerSpan = document.getElementById('timerDisplay');
const recordInput = document.getElementById('recButton');
const audioControl = document.getElementById('audio');
const uploadInput = document.getElementById('uploadButton');
const discardInput = document.getElementById('discardButton');

recordInput.addEventListener('click', recordingAction);
discardInput.addEventListener('click', discardRecording);

function recordingAction() {
	if (myInterval == -1) {

		if (timerSpan.style.opacity == '0.9') timerSpan.style.opacity = '0.2';
		else timerSpan.style.opacity = '0.9';

		myInterval = setInterval(() => {
			timer += 1000;
			timerSpan.innerHTML = msToTimeString(timer);
			if (timerSpan.style.opacity == '0.9') timerSpan.style.opacity = '0.2';
			else timerSpan.style.opacity = '0.9';
		}, 1000);
		startRecording();
	}
	else {
		clearInterval(myInterval);
		myInterval = -1;
		timer = 0;
		recordInput.classList.add('hidden');
		timerSpan.classList.add('hidden');
		audioControl.classList.remove('hidden');
		uploadInput.classList.remove('hidden');
		discardInput.classList.remove('hidden');
		stopRecording();
	}
}

function startRecording() {
	console.log("recordButton clicked");
	var constraints = { audio: true, video: false }

	//recordButton.disabled = true;
	//stopButton.disabled = false;
	//pauseButton.disabled = false

	navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format 
		//document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

		/*  assign to gumStream for later use  */
		gumStream = stream;

		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input, { numChannels: 1 })

		//start the recording process
		rec.record()

		console.log("Recording started");

	}).catch(function (err) {
		//enable the record button if getUserMedia() fails
		//recordButton.disabled = false;
		//stopButton.disabled = true;
		//pauseButton.disabled = true
	});
}

function pauseRecording() {
	console.log("pauseButton clicked rec.recording=", rec.recording);
	if (rec.recording) {
		//pause
		rec.stop();
		pauseButton.innerHTML = "Resume";
	} else {
		//resume
		rec.record()
		pauseButton.innerHTML = "Pause";

	}
}

function stopRecording() {
	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	//stopButton.disabled = true;
	//recordButton.disabled = false;
	//pauseButton.disabled = true;

	//reset button just in case the recording is stopped while paused
	//pauseButton.innerHTML = "Pause";

	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {

	var url = URL.createObjectURL(blob);
	//var li = document.createElement('li');

	//add controls to the <audio> element and add audio element to li
	//var audio = document.createElement('audio');
	audioControl.controls = true;
	audioControl.src = url;
	//li.appendChild(audio);

	//add the filename to the li
	var filename = new Date().toISOString();
	var date = new Date();
	var filename = date.getFullYear()
		+ ("0" + (date.getMonth() + 1)).slice(-2)
		+ ("0" + date.getDate()).slice(-2)
		+ ("0" + date.getHours()).slice(-2)
		+ ("0" + date.getMinutes()).slice(-2)
		+ ("0" + date.getSeconds()).slice(-2);
	var extension = ".wav";

	//var span = document.createElement('span');
	//span.innerHTML = filename + extension;
	//li.appendChild(span);

	//upload link
	//var upload = document.createElement('input');
	//upload.href = "#";
	//upload.innerHTML = "Upload";
	//upload.type = "image";
	//upload.src = "Images/upload.svg"

	uploadInput.addEventListener("click", function (event) {

		uploadInput.style.opacity = '0.2';
		discardInput.style.opacity = '0.2';
		uploadInput.disabled = true;
		discardInput.disabled = true;

		//AJAX - OK - Nombre y extension 
		//$.ajax({
		//	url: '/File/AjaxUploadAudio', 
		//	dataType: "json", 
		//	type: "POST", 
		//	contentType: 'application/json; charset=utf-8', 
		//	cache: false, 
		//	data: "{ 'filename': '" + filename + "', 'extension': '" + extension + "' }",
		//	success: function (response) {
		//		console.log(response.message);		
		//		alert(response.message);
		//	},
		//	error: function (error) {
		//		console.log('Error invocando al Web Service: ' + error);
		//		alert('Error invocando al Web Service: ' + error);
		//	}
		//});

		////XMLHttpRequest - OK - Nombre y Extension
		//var httpRequest = new XMLHttpRequest();
		//var parameters = '{ "filename": "' + filename + '", "extension": "' + extension + '" }';
		//httpRequest.open('POST', '/File/UploadAudio', true);
		//httpRequest.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
		//httpRequest.setRequestHeader('Content-Length', parameters.length);
		//httpRequest.onreadystatechange = function () {
		//	if (httpRequest.readyState == 4 && httpRequest.status == 200) {
		//		alert(httpRequest.responseText);
		//	}
		//}
		//httpRequest.send(parameters);


		////XMLHttpRequest - KO - Blob

		var formdata = new FormData();
		formdata.append("blob", blob, filename + extension);
		var httpRequest = new XMLHttpRequest();
		httpRequest.open('POST', '/File/UploadAudioBlob');
		httpRequest.send(formdata);
		httpRequest.onreadystatechange = function () {
			if (httpRequest.readyState == 4 && httpRequest.status == 200) {
				alert(httpRequest.responseText);
				discardRecording();
			}
		}
	})

	//li.appendChild(upload)//add the upload link to li

	//add the li element to the ol
	//recordingsList.appendChild(li);
}

function msToTimeString(ms) {
	let seconds = (ms / 1000) % 60;
	let minutes = Math.floor(ms / 1000 / 60) % 60;
	let hours = Math.floor(ms / 1000 / 60 / 60);

	seconds = ('0' + seconds).slice(-2);
	minutes = ('0' + minutes).slice(-2);
	hours = ('0' + hours).slice(-2);

	return `${hours}:${minutes}:${seconds}`;
}

function discardRecording() {
	timerSpan.innerHTML = '00:00:00';
	timerSpan.style.opacity = '0.9';
	recordInput.classList.remove('hidden');
	timerSpan.classList.remove('hidden');
	audioControl.classList.add('hidden');
	uploadInput.classList.add('hidden');
	discardInput.classList.add('hidden');

	uploadInput.style.opacity = '0.9';
	discardInput.style.opacity = '0.9';
	uploadInput.disabled = false;
	discardInput.disabled = false;

	//Clear audio control
	audioControl.src = "";
	audioControl.currentSrc = "";
}