const socket = new WebSocket("ws://127.0.0.1:8000/ws");

const statusDiv = document.getElementById("status");
const resultDiv = document.getElementById("result");

socket.onopen = () => {
  statusDiv.textContent = "Connected to WebSocket server";
};

socket.onmessage = (event) => {
  statusDiv.textContent = "Response received";
  resultDiv.textContent = event.data;
};

socket.onerror = () => {
  statusDiv.textContent = "WebSocket error";
};

socket.onclose = () => {
  statusDiv.textContent = "WebSocket connection closed";
};

function sendRequest(action) {
  if (socket.readyState !== WebSocket.OPEN) {
    statusDiv.textContent = "WebSocket is not connected";
    return;
  }

  statusDiv.textContent = "Loading...";
  resultDiv.textContent = "";
  socket.send(action);
}

function sendImage() {
  const input = document.getElementById("imageInput");
  const file = input.files[0];

  if (!file) {
    statusDiv.textContent = "Please select an image file";
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    const base64String = reader.result.split(",")[1];

    if (socket.readyState !== WebSocket.OPEN) {
      statusDiv.textContent = "WebSocket is not connected";
      return;
    }

    statusDiv.textContent = "Loading...";
    resultDiv.textContent = "";

    socket.send(JSON.stringify({
      action: "imageToHex",
      data: base64String
    }));
  };

  reader.onerror = function () {
    statusDiv.textContent = "File reading error";
  };

  reader.readAsDataURL(file);
}