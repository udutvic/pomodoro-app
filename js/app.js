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
const incrementButton = document.querySelector(".pomo .modal__modal-arrow.up");
const decrementButton = document.querySelector(".pomo .modal__modal-arrow.down");
let shortInput = document.querySelector(".short-break");
shortInput.value = buttonData["short break"].minutes;
const incrementButtonShort = document.querySelector(".short .modal__modal-arrow.up");
const decrementButtonShort = document.querySelector(".short .modal__modal-arrow.down");
let longInput = document.querySelector(".long-break");
longInput.value = buttonData["long break"].minutes;
const incrementButtonLong = document.querySelector(".long .modal__modal-arrow.up");
const decrementButtonLong = document.querySelector(".long .modal__modal-arrow.down");
const motionSection = document.querySelector(".modal__modal");
const modalBlock = document.querySelector(".hidden");
const closeButton = document.querySelector(".modal__modal-close");
const showNotification = document.querySelector(".timer__notification");
const applyButton = document.querySelector(".modal__modal-btn");
let circleSvg = document.querySelector(".timer__main-circle");
let mainContainer = document.querySelector(".timer__main-container");
let startTime = 0;
let timer = null;
let running = false;
let totalSeconds;
let fixedTotalTimer;
let start = null;

// Функція для зміни шрифту
function changeFont(selectedFont) {
  const htmlStyle = document.documentElement.style;
  htmlStyle.setProperty('--font-selected', `'${selectedFont}', sans-serif`);
}

// Функція для зміни кольору
function changeColor(selectedColor) {
  const htmlStyle = document.documentElement.style;
  htmlStyle.setProperty('--color-selected', selectedColor);
}

// Об'єкти з кольорами та шрифтами
const colors = {
  red: '#f87070',
  blue: '#70F3F8',
  violet: '#d881f8',
};

const fonts = {
  kumbh: 'Kumbh Sans',
  roboto: 'Roboto Slab',
  space: 'Space Mono',
};

// Встановлюємо шрифт та колір за замовчуванням
changeFont(fonts.kumbh);
changeColor(colors.red);

// Функція для оновлення шрифту
function updateFont() {
  let fontChangers = document.querySelectorAll(".modal__modal-font-input");
  fontChangers.forEach((fontChanger) => {
    fontChanger.addEventListener("change", () => {
      if (fontChanger.id === "kumbh__sans") {
        changeFont(fonts.kumbh);
      }
      if (fontChanger.id === "roboto__slab") {
        changeFont(fonts.roboto);
      }
      if (fontChanger.id === "space__mono") {
        changeFont(fonts.space);
      }
    });
  });
}

// Функція для оновлення кольору
function updateColor() {
  let colorChangers = document.querySelectorAll(".modal__modal-color-input");
  colorChangers.forEach((colorChanger) => {
    colorChanger.addEventListener("change", () => {
      if (colorChanger.id === "red") {
        changeColor(colors.red);
      }
      if (colorChanger.id === "blue") {
        changeColor(colors.blue);
      }
      if (colorChanger.id === "violet") {
        changeColor(colors.violet);
      }
    });
  });
}

// Викликаємо функції оновлення після завантаження сторінки
document.addEventListener("DOMContentLoaded", function() {
  updateFont();
  updateColor();
});


//NOTE - обчислення обсяга кола по розмірах контейнера де воно знаходитьс
const radiusInPercentage = parseFloat(circleSvg.getAttribute("r"));
const containerWidth = mainContainer.clientWidth;
const radiusInPixels = (radiusInPercentage / 100) * containerWidth;
const circumference = radiusInPixels * 2 * Math.PI;

//NOTE - створення зміної яка буде вставляти в dash-array значення обчисленого об'єма кола
let currentDasharray = circumference;
circleSvg.style.setProperty("--dash-array", `${currentDasharray}`);

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
    circleSvg.style.strokeDashoffset = 0;

    fixTotalTimer();
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

//NOTE - функція для фіксованого значення суми хвилин та секунд для роботи кола
function fixTotalTimer() {
  const secondsTime = parseInt(seconds.value);
  const minutesTime = parseInt(minutes.value);
  fixedTotalTimer = secondsTime + minutesTime * 60;
}

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

    let percentage = ((secondsLeft * 60 + minutesLeft) / (fixedTotalTimer * 60)) * 100;

    circleSvg.style.strokeDashoffset = `calc(var(--dash-array) - (var(--dash-array) * ${percentage}) / 100)`;

    if (secondsLeft === 0 && minutesLeft <= 0) {
      finishTimer();
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
  circleSvg.style.strokeDashoffset = 0;
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
    return;
  }

  if (!running) {
    motionSection.style.transform = "translate(-50%, calc(100vh - 50%))";
    motionSection.style.transition = "transform 0.6s ease-out";
    modalBlock.style.display = "block";

    setTimeout(() => {
      motionSection.style.transform = "translate(-50%, -50%)";
    }, 0);

    closeButton.addEventListener("click", () => {
      motionSection.style.transform = "translate(-50%, calc(100vh - 50%))";

      setTimeout(() => {
        modalBlock.style.display = "none";
      }, 600);
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
  fixTotalTimer();
}

//NOTE - Кнопка підвердження і закриття модального вікна
applyButton.addEventListener("click", () => {
  buttonData["pomodoro"].minutes = pomodoroInput.value.toString();
  buttonData["short break"].minutes = shortInput.value.toString();
  buttonData["long break"].minutes = longInput.value.toString();

  updatePomodoroTimer();
  circleSvg.style.strokeDashoffset = 0;

  motionSection.style.transform = "translate(-50%, calc(100vh - 50%))";

  setTimeout(() => {
    modalBlock.style.display = "none";
  }, 600);
});

//NOTE - Функція, яка збільшує значення
function increaseInputValue(input, increment) {
  increment.addEventListener("click", () => {
    let currentValue = parseInt(input.value);
    if (currentValue < 1) {
      input.value = "01";
    } else if (currentValue < 60) {
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
    if (currentValue < 1) {
      input.value = "01";
    } else if (currentValue > 1) {
      currentValue = (currentValue - 1).toString().padStart(2, "0");
      input.value = currentValue;
    }
    return;
  });
}

decreaseInputValue(pomodoroInput, decrementButton);
decreaseInputValue(shortInput, decrementButtonShort);
decreaseInputValue(longInput, decrementButtonLong);