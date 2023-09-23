//NOTE - оголошення змінних
const buttons = document.querySelectorAll(".timer__switch-btn");
const settingsButton = document.querySelector(".timer__setting");
const startButton = document.querySelector(".timer__main-start");
let seconds = document.querySelector(".timer__main-seconds > input[type=number]");
let minutes = document.querySelector(".timer__main-minutes > input[type=number]");
const ring = document.querySelector(".ring");
let buttonData = {
  pomodoro: { minutes: "25", seconds: "00" },
  "short break": { minutes: "05", seconds: "00" },
  "long break": { minutes: "15", seconds: "00" },
};
minutes.value = buttonData["pomodoro"].minutes;
seconds.value = buttonData["pomodoro"].seconds;
let pomodoroInput = document.querySelector(".pomodoro");
pomodoroInput.value = buttonData["pomodoro"].minutes;
const incrementButton = document.querySelector(".pomo .timer__modal-arrow.up");
const decrementButton = document.querySelector(".pomo .timer__modal-arrow.down");
let shortInput = document.querySelector(".short-break");
shortInput.value = buttonData["short break"].minutes;
const incrementButtonShort = document.querySelector(".short .timer__modal-arrow.up");
const decrementButtonShort = document.querySelector(".short .timer__modal-arrow.down");
let longInput = document.querySelector(".long-break");
longInput.value = buttonData["long break"].minutes;
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

// Функція для активації кнопок 
function changeContent(target) { 
  // Оновлення кнопок
  const buttons = document.querySelectorAll(".timer__switch-btn");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
  target.classList.add("active");  
  
}

// Обробник подій при натисканні на кнопку
buttons.forEach((button) => {
  button.addEventListener("click", function (e) {
    // Якщо таймер запущено, відображаємо повідомлення і повертаємося
    if (running) {
      showNotification.style.display = "block";
      setTimeout(() => {
        showNotification.style.display = "none";
      }, 3000);
      return;
    }

    changeContent(e.target);

    const data = buttonData[e.target.textContent.trim()];
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
  
  if (!running) {
    modalBlock.style.display = "block";

    closeButton.addEventListener("click", () => {
      modalBlock.style.display = "none";
    });
  }
});

function updatePomodoroTimer() {
  const activeButton = document.querySelector(".timer__switch-btn.active");

  if (!activeButton) {
    return;
  }  

  const data = buttonData[activeButton.textContent.trim()];

  if (data) {
    minutes.value = data.minutes;
    seconds.value = data.seconds;
  }
}

applyButton.addEventListener("click", () => {
  buttonData["pomodoro"].minutes = pomodoroInput.value.toString();
  buttonData["short break"].minutes = shortInput.value.toString();
  buttonData["long break"].minutes = longInput.value.toString();

  updatePomodoroTimer();
  modalBlock.style.display = "none";
});

// Збільшення значення інпута на 1 з додаванням нуля та обмеженням до 60
incrementButton.addEventListener("click", () => {
  let currentValue = parseInt(pomodoroInput.value);
  if (currentValue < 60) {
    currentValue = (currentValue + 1).toString().padStart(2, "0");
    pomodoroInput.value = currentValue;
  }
});

// Зменшення значення інпута на 1 з додаванням нуля та обмеженням до 0
decrementButton.addEventListener("click", () => {
  let currentValue = parseInt(pomodoroInput.value);
  if (currentValue > 0) {
    currentValue = (currentValue - 1).toString().padStart(2, "0");
    pomodoroInput.value = currentValue;
  }
});

// Збільшення значення інпута на 1 з додаванням нуля та обмеженням до 60
incrementButtonShort.addEventListener("click", () => {
  let currentValue = parseInt(shortInput.value);
  if (currentValue < 60) {
    currentValue = (currentValue + 1).toString().padStart(2, "0");
    shortInput.value = currentValue;
  }
});

// Зменшення значення інпута на 1 з додаванням нуля та обмеженням до 0
decrementButtonShort.addEventListener("click", () => {
  let currentValue = parseInt(shortInput.value);
  if (currentValue > 0) {
    currentValue = (currentValue - 1).toString().padStart(2, "0");
    shortInput.value = currentValue;
  }
});

// Збільшення значення інпута на 1 з додаванням нуля та обмеженням до 60
incrementButtonLong.addEventListener("click", () => {
  let currentValue = parseInt(longInput.value);
  if (currentValue < 60) {
    currentValue = (currentValue + 1).toString().padStart(2, "0");
    longInput.value = currentValue;
  }
});

// Зменшення значення інпута на 1 з додаванням нуля та обмеженням до 0
decrementButtonLong.addEventListener("click", () => {
  let currentValue = parseInt(longInput.value);
  if (currentValue > 0) {
    currentValue = (currentValue - 1).toString().padStart(2, "0");
    longInput.value = currentValue;
  }
});

// function increaseInputValue(longInput, incrementButtonLong) {
//   incrementButtonLong.addEventListener('click', () => {
//     let currentValue = parseInt(longInput.value);
//     if (currentValue < 60) {
//       currentValue = (currentValue + 1).toString().padStart(2, '0');
//       longInput.value = currentValue;
//       }
//       return;
//   });
// }

// increaseInputValue(longInput, incrementButtonLong);

// function decreaseInputValue(longInput, decrementButtonLong) {
//   decrementButtonLong.addEventListener('click', () => {
//     let currentValue = parseInt(longInput.value);
//     if (currentValue > 0) {
//       currentValue = (currentValue - 1).toString().padStart(2, '0');
//       longInput.value = currentValue;
//       }
//       return;
//   });
// }

// decreaseInputValue(longInput, decrementButtonLong);

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
