
const openButton = document.querySelector("#open-gift");
const continueButton = document.querySelector("#continue-button");

const bouquet = document.querySelector("#bouquet");
const birthdayMessage = document.querySelector("#birthday-message");
const finalMessage = document.querySelector("#final-message");
const petalField = document.querySelector(".petal-field");

let musicPlayer;
let musicReady = false;
let musicPlaying = false;

const musicButton = document.querySelector("#music-toggle");

// YouTube calls this function when its player API is ready.
window.onYouTubeIframeAPIReady = function () {
  musicPlayer = new YT.Player("music-frame", {
    events: {
      onReady: function () {
        musicReady = true;
      },
      onStateChange: function (event) {
        musicPlaying = event.data === YT.PlayerState.PLAYING;
        musicButton.textContent = musicPlaying
          ? "♫ Pause music"
          : "♫ Play music";
        musicButton.setAttribute(
          "aria-label",
          musicPlaying ? "Pause music" : "Play music"
        );
      }
    }
  });
};

function playMusic() {
  if (!musicReady || !musicPlayer) {
    musicButton.textContent = "♫ Music loading…";
    return;
  }

  musicPlayer.playVideo();
}

function toggleMusic() {
  if (!musicReady || !musicPlayer) {
    musicButton.textContent = "♫ Music loading…";
    return;
  }

  if (musicPlaying) {
    musicPlayer.pauseVideo();
  } else {
    musicPlayer.playVideo();
  }
}

musicButton.addEventListener("click", toggleMusic);


let petalsStarted = false;

// First interaction: bloom the bouquet and reveal the birthday wish.
openButton.addEventListener("click", () => {
  playMusic();
  bouquet.classList.add("blooming");

  // Reveal the first message after the flowers have time to bloom.
  window.setTimeout(() => {
    birthdayMessage.hidden = false;

    birthdayMessage.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }, 2600);

  // Update the button to show that the gift has been opened.
  openButton.innerHTML = "Your flowers are blooming ♥";
  openButton.disabled = true;

  // Create falling petals once.
  if (!petalsStarted) {
    petalsStarted = true;
    createPetals(28);
  }
});

// Second interaction: reveal the personal closing message.
continueButton.addEventListener("click", () => {
  finalMessage.hidden = false;
  continueButton.hidden = true;

  finalMessage.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  // A few more petals add a little extra magic.
  createPetals(12);
});

// Create lightweight falling petal characters.
function createPetals(amount) {
  const symbols = ["✿", "❀", "✧"];

  for (let i = 0; i < amount; i++) {
    const petal = document.createElement("span");

    petal.className = "petal";
    petal.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    petal.style.left = `${Math.random() * 100}vw`;

    petal.style.fontSize =
      `${12 + Math.random() * 14}px`;

    petal.style.setProperty(
      "--drift",
      `${Math.random() * 180 - 90}px`
    );

    petal.style.animationDuration =
      `${5 + Math.random() * 6}s`;

    petal.style.animationDelay =
      `${Math.random() * 2}s`;

    petalField.appendChild(petal);

    // Remove each petal after its animation ends.
    petal.addEventListener("animationend", () => {
      petal.remove();
    });
  }
}
