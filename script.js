const chat = document.getElementById("chat");
const input = document.getElementById("message");
const characterSelect = document.getElementById("character");

const portraits = {
    "Mahatma Gandhi": "images/gandhi.jpg",
    "Albert Einstein": "images/einstein.jpg",
    "Subhas Chandra Bose": "images/netaji.jpg",
    "Rani Lakshmibai": "images/lakshmibai.jpg",
    "Abraham Lincoln": "images/lincoln.jpg",
    "Marie Curie": "images/curie.jpg"
};

let avatar = portraits["Mahatma Gandhi"];

// ---------------------
// Change character
// ---------------------

characterSelect.addEventListener("change", function () {

    avatar = portraits[this.value];

    document.getElementById("portrait").src = avatar;

    document.getElementById("characterName").textContent = this.value;

});

// ---------------------
// Auto Scroll
// ---------------------

function scrollToBottom() {

    chat.scrollTo({
        top: chat.scrollHeight,
        behavior: "smooth"
    });

}
// ---------------------
// Text to Speech
// ---------------------

function speak(text) {

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";

    utterance.rate = 1;

    utterance.pitch = 1;

    speechSynthesis.speak(utterance);

}

// ---------------------
// Send Message
// ---------------------

async function sendMessage() {

    const message = input.value.trim();

    if (message === "") return;

    const character = characterSelect.value;

    // User message

    chat.innerHTML += `
    <div class="user-row">
        <div class="message user">
            ${message}
        </div>
    </div>
    `;

    input.value = "";
    speak(data.reply);

    scrollToBottom();

    // Typing indicator

    const typing = document.createElement("div");

    typing.className = "chat-row";

    typing.id = "typing";

    typing.innerHTML = `
        <img src="${avatar}" class="avatar">

        <div class="message bot">
            <div class="name">${character}</div>
            Typing...
        </div>
    `;

    chat.appendChild(typing);

    scrollToBottom();

    try {

        const response = await fetch(
            "https://historical-chatbot.debrupabhadra.workers.dev",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message,
                    character
                })
            }
        );

        const data = await response.json();

        document.getElementById("typing").remove();

        chat.innerHTML += `
        <div class="chat-row">

            <img src="${avatar}" class="avatar">

            <div class="message bot">

                <div class="name">${character}</div>

                ${data.reply.replace(/\n/g,"<br>")}

            </div>

        </div>
        `;

    } catch (error) {

        if(document.getElementById("typing"))
            document.getElementById("typing").remove();

        chat.innerHTML += `
        <div class="chat-row">

            <img src="${avatar}" class="avatar">

            <div class="message bot">

                <b>Error:</b> ${error.message}

            </div>

        </div>
        `;
    }

    scrollToBottom();

}

// ---------------------
// Enter key
// ---------------------

input.addEventListener("keydown", function(e){

    if(e.key==="Enter"){

        e.preventDefault();

        sendMessage();

    }

});

// ---------------------
// Speech Recognition
// ---------------------

const micButton = document.getElementById("micButton");

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

if(SpeechRecognition){

    const recognition = new SpeechRecognition();

    recognition.lang="en-US";

    recognition.interimResults=false;

    recognition.continuous=false;

    micButton.addEventListener("click",()=>{

        recognition.start();

        micButton.textContent="🎙️";

    });

    recognition.onresult=function(event){

        input.value=event.results[0][0].transcript;

    };

    recognition.onend=function(){

        micButton.textContent="🎤";

    };

    recognition.onerror=function(event){

        micButton.textContent="🎤";

        alert("Microphone Error: "+event.error);

    };

}else{

    micButton.style.display="none";

}