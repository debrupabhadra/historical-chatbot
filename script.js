const chat = document.getElementById("chat");
const character = document.getElementById("character").value;
const portraits = {
  "Mahatma Gandhi": "images/gandhi.jpg",
  "Albert Einstein": "images/einstein.jpg",
  "Subhas Chandra Bose": "images/netaji.jpg",
  "Rani Lakshmibai": "images/lakshmibai.jpg",
  "Abraham Lincoln": "images/lincoln.jpg",
  "Marie Curie": "images/curie.jpg"
};
let avatar = "images/gandhi.jpg"; // Default avatar
document.getElementById("character").addEventListener("change", function () {
  document.getElementById("portrait").src = portraits[this.value];
  avatar = portraits[this.value]; // Update avatar based on selected character
  document.getElementById("characterName").textContent = this.value; // Update character name
});

async function sendMessage() {
    const character = document.getElementById("character").value;

  const input = document.getElementById("message");
  const message = input.value.trim();

  if (message === "") return;

  chat.innerHTML += `
<div class="user-row">

    <div class="message user">
        ${message}
    </div>

</div>`;  
  input.value = "";

  try {
console.log("Sending message:", message, "to character:", character);
    const response = await fetch("https://historical-chatbot.debrupabhadra.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
     body: JSON.stringify({
        message: message,
    character: character
    })
    });
    const typing = document.createElement("div");
typing.className = "typing";
typing.id = "typing";


chat.appendChild(typing);
chat.scrollTop = chat.scrollHeight;
    const data = await response.json();

    if (data.reply) {
      chat.innerHTML += `<div class="bot"><div class="avatar-container"><img src="${avatar}" class="avatar"></div><b>${character}:</b> ${data.reply}</div>`;
    } else {
      chat.innerHTML += `<div class="bot"><b>Error:</b> ${JSON.stringify(data)}</div>`;
    }

  } catch (error) {
    chat.innerHTML += `<div class="bot"><b>Error:</b> ${error.message}</div>`;
  }

  chat.scrollTop = chat.scrollHeight;
}
const input = document.getElementById("message");

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents form submission or newline
        sendMessage();
    }
});
const micButton = document.getElementById("micButton");
const messageInput = document.getElementById("message");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    micButton.addEventListener("click", () => {
        recognition.start();
        micButton.innerHTML = "🎙️";
    });

    recognition.onresult = (event) => {
        messageInput.value = event.results[0][0].transcript;
        micButton.innerHTML = "🎤";
    };

    recognition.onend = () => {
        micButton.innerHTML = "🎤";
    };

} else {
    micButton.disabled = true;
    micButton.innerHTML = "❌";
}