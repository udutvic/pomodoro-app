//NOTE - оголошення змінних
const buttons = document.querySelectorAll(".timer__switch-btn");
const settingsButton = document.querySelector(".timer__setting");
const startButton = document.querySelector(".timer__main-start");
const seconds = document.querySelector(".timer__main-seconds > input[type=text]");
const minutes = document.querySelector(".timer__main-minutes > input[type=text]");

var value = Number("25");
minutes.value = value;
const ring = document.querySelector(".ring");
const buttonData = {
  pomodoro: { minutes: "25", seconds: "00" },
  "short break": { minutes: "05", seconds: "00" },
  "long break": { minutes: "15", seconds: "00" },
};
const pomodoroInput = document.querySelector(".pomodoro");
const incrementButton = document.querySelector(".pomo .timer__modal-arrow.up");
const decrementButton = document.querySelector(".pomo .timer__modal-arrow.down");
const shortInput = document.querySelector(".short-break");
const incrementButtonShort = document.querySelector(".short .timer__modal-arrow.up");
const decrementButtonShort = document.querySelector(".short .timer__modal-arrow.down");
const longInput = document.querySelector(".long-break");
const incrementButtonLong = document.querySelector(".long .timer__modal-arrow.up");
const decrementButtonLong = document.querySelector(".long .timer__modal-arrow.down");
const modalBlock = document.querySelector(".hidden");
const closeButton = document.querySelector(".timer__modal-close");
const showNotification = document.querySelector(".timer__notification");
const applyButton = document.querySelector(".timer__modal-btn");
let startTime = 0;
let timer = null;
let running = false;
let originalMinutes = 0;
let originalSeconds = 0;
let totalSeconds;

//NOTE - функція для активації кнопок
function changeContent(targetElement) {
  const buttons = document.querySelectorAll(".timer__switch-btn");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
  targetElement.classList.add("active");
}

//NOTE - обробник подій при натисканні на кнопку
buttons.forEach((button) => {
  button.addEventListener("click", function (e) {
    if (running) {
      showNotification.style.display = "block";
      setTimeout(() => {
        showNotification.style.display = "none";
      }, 3000);
      return;
    }

    changeContent(e.target);
    const buttonText = e.target.textContent.trim();

    const data = buttonData[buttonText];
    if (data) {
      minutes.value = data.minutes;
      seconds.value = data.seconds;
    }
  });
});

//NOTE - обробник подій для кнопки старт/пауза
startButton.addEventListener("click", () => {
  if (!running) {
    startTimer();
  } else if (running) {
    pauseTimer();
  }
});

//NOTE - старт таймера
const startTimer = () => {
  running = true;
  startButton.innerText = "Pause";
  startTime = Date.now();
  const secondsValue = parseInt(seconds.value);
  const minutesValue = parseInt(minutes.value);
  totalSeconds = secondsValue + minutesValue * 60;
  timer = setInterval(() => {
    const currentTime = Date.now();
    const diff = currentTime - startTime;
    const secondsLeft = totalSeconds - Math.floor(diff / 1000);
    const minutesLeft = Math.floor(secondsLeft / 60);
    seconds.value = padNumber(secondsLeft % 60);
    minutes.value = padNumber(minutesLeft);
    console.log(secondsLeft);
    if (secondsLeft === 0 && minutesLeft <= 0) {
      finishTimer();
    }
  }, 1000);
};

//NOTE - пауза таймера
const pauseTimer = () => {
  running = false;
  startButton.innerText = "Start";
  clearInterval(timer);
};

//NOTE - фініш таймера
const finishTimer = () => {
  clearInterval(timer);
  ring.classList.add("ending");
  console.log(ring.classList);
  clearInterval(timer);
  setTimeout(() => {
    alert("Time's up!");
    resetTimer();
  }, 0);
};

//NOTE - Обробник подій для кнопки налаштування
settingsButton.addEventListener("click", () => {
  if (running) {
    showNotification.style.display = "block";
    setTimeout(() => {
      showNotification.style.display = "none";
    }, 3000);
    // pauseTimer();
    return;
  }
  // seconds.disabled = false;
  // minutes.disabled = false;
  if (!running) {
    modalBlock.style.display = "block";

    closeButton.addEventListener("click", () => {
      modalBlock.style.display = "none";
    });
  }
});

applyButton.addEventListener("click", () => {
  buttonData["pomodoro"].minutes = pomodoroInput.value;
  console.log(buttonData);
  return
});

// Збільшення значення інпута на 1 з додаванням нуля та обмеженням до 60
incrementButton.addEventListener("click", () => {
  let currentValue = parseInt(pomodoroInput.value);
  if (currentValue < 60) {
      currentValue = (currentValue + 1).toString().padStart(2, '0');
      pomodoroInput.value = currentValue;
      buttonData["pomodoro"].minutes = currentValue;
  }
});

// Зменшення значення інпута на 1 з додаванням нуля та обмеженням до 0
decrementButton.addEventListener("click", () => {
  let currentValue = parseInt(pomodoroInput.value);
  if (currentValue > 0) {
      currentValue = (currentValue - 1).toString().padStart(2, '0');
      pomodoroInput.value = currentValue;
      buttonData["pomodoro"].minutes = currentValue;
  }
});

// Збільшення значення інпута на 1 з додаванням нуля та обмеженням до 60
incrementButtonShort.addEventListener("click", () => {
  let currentValue = parseInt(shortInput.value);
  if (currentValue < 60) {
      currentValue = (currentValue + 1).toString().padStart(2, '0');
      shortInput.value = currentValue;
      buttonData["short break"].minutes = currentValue;
  }
});

// Зменшення значення інпута на 1 з додаванням нуля та обмеженням до 0
decrementButtonShort.addEventListener("click", () => {
  let currentValue = parseInt(shortInput.value);
  if (currentValue > 0) {
      currentValue = (currentValue - 1).toString().padStart(2, '0');
      shortInput.value = currentValue;
      buttonData["short break"].minutes = currentValue;
  }
});

// Збільшення значення інпута на 1 з додаванням нуля та обмеженням до 60
incrementButtonLong.addEventListener("click", () => {
  let currentValue = parseInt(longInput.value);
  if (currentValue < 60) {
      currentValue = (currentValue + 1).toString().padStart(2, '0');
      longInput.value = currentValue;
      buttonData["long break"].minutes = currentValue;
  }
});

// Зменшення значення інпута на 1 з додаванням нуля та обмеженням до 0
decrementButtonLong.addEventListener("click", () => {
  let currentValue = parseInt(longInput.value);
  if (currentValue > 0) {
      currentValue = (currentValue - 1).toString().padStart(2, '0');
      longInput.value = currentValue;
      buttonData["long break"].minutes = currentValue;
  }
});


//NOTE - змінна яка контролює введення тільки цифр
const validateTimeInput = (e) => {
  const validatedInput = e.target.value.replace(/[^0-9]/g, "").substring(0, 2);
  e.target.value = validatedInput;
};

minutes.addEventListener("keyup", validateTimeInput);
seconds.addEventListener("keyup", validateTimeInput);

//NOTE - скидання таймера
const resetTimer = () => {
  clearInterval(timer);
  seconds.value = originalSeconds;
  minutes.value = originalMinutes;
  startButton.innerText = "Start";
  ring.classList.remove("ending");
  running = false;
};

const padNumber = (number) => {
  if (number < 10) {
    return "0" + number;
  }
  return number;
};

const setOriginalTime = () => {
  originalMinutes = padNumber(parseInt(minutes.value));
  originalSeconds = padNumber(parseInt(seconds.value));
};

setOriginalTime();
resetTimer();
