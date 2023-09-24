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
let circleSvg = document.querySelector(".timer__main-circle");
let mainContainer = document.querySelector(".timer__main-container");
let startTime = 0;
let timer = null;
let running = false;
let totalSeconds;

//NOTE - обчислення обсяга кола
const radiusInPercentage = parseFloat(circleSvg.getAttribute("r"));
const containerWidth = mainContainer.clientWidth;
const radiusInPixels = (radiusInPercentage / 100) * containerWidth;
const circumference = radiusInPixels * 2 * Math.PI;

//NOTE - Функція для активації кнопок
function changeContent(target) {
  const buttons = document.querySelectorAll(".timer__switch-btn");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
  target.classList.add("active");
}

//NOTE - Обробник подій при натисканні на кнопки
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

//NOTE - Функція старту таймера
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

    let currentdashArray = circumference;

    const updateCircle = () => {
      currentDashoffset =
        (currentdashArray * (totalSeconds - secondsLeft)) / totalSeconds;
      circleSvg.style.strokeDashoffset = `${currentDashoffset}px`;
      circleSvg.style.strokeDasharray = `${currentdashArray}px`;
    };

    updateCircle();

    if (secondsLeft === 0 && minutesLeft <= 0) {
      finishTimer();
      circleSvg.style.strokeDashoffset = 0;
      updatePomodoroTimer();
    }
  }, 1000);
};

//NOTE - Функція паузи таймера
const pauseTimer = () => {
  running = false;
  startButton.innerText = "Start";
  clearInterval(timer);
};

//NOTE - Функція фініша таймера
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

//NOTE - Функція форматування чисел з лідируючими нулями
const padNumber = (number) => {
  if (number < 10) {
    return "0" + number;
  }
  return number;
};

//NOTE - Функція скидання таймера
const resetTimer = () => {
  clearInterval(timer);
  startButton.innerText = "Start";
  ring.classList.remove("ending");
  running = false;
};

resetTimer();

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

//NOTE - Функція оновлення таймера при виборі хвилин
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

//NOTE - Кнопка підвердження і закриття модального вікна
applyButton.addEventListener("click", () => {
  buttonData["pomodoro"].minutes = pomodoroInput.value.toString();
  buttonData["short break"].minutes = shortInput.value.toString();
  buttonData["long break"].minutes = longInput.value.toString();

  updatePomodoroTimer();
  modalBlock.style.display = "none";
});

//NOTE - Функція, яка збільшує значення
function increaseInputValue(input, increment) {
  increment.addEventListener("click", () => {
    let currentValue = parseInt(input.value);
    if (currentValue < 60) {
      currentValue = (currentValue + 1).toString().padStart(2, "0");
      input.value = currentValue;
    }
    return;
  });
}

increaseInputValue(pomodoroInput, incrementButton);
increaseInputValue(shortInput, incrementButtonShort);
increaseInputValue(longInput, incrementButtonLong);

//NOTE - Функція, яка зменшує значення
function decreaseInputValue(input, decrement) {
  decrement.addEventListener("click", () => {
    let currentValue = parseInt(input.value);
    if (currentValue > 0) {
      currentValue = (currentValue - 1).toString().padStart(2, "0");
      input.value = currentValue;
    }
    return;
  });
}

decreaseInputValue(pomodoroInput, decrementButton);
decreaseInputValue(shortInput, decrementButtonShort);
decreaseInputValue(longInput, decrementButtonLong);
