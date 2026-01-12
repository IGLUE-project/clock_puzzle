export const DEFAULT_APP_SETTINGS = {
  skin: "STANDARD",
  actionWhenLoadingIfSolved: false,
  useSeconds: true,
  initialTime: "5:30:00", //Initial time in format "HH:MM:SS" or "HH:MM"
  backgroundImg: "images/basic_background.png",
  hourImg: "images/basic_hourhand.png",
  minuteImg: "images/basic_minutehand.png",
  secondImg: "images/basic_secondhand.png",
  clockImg: "images/basic_clock.png",
  clockCenterImg: "images/basic_clockcenter.png",
  tickAudio: "sounds/tick.wav",
  winAudio: "sounds/win.wav",
};

export const THEMES = {
  STANDARD: "STANDARD",
  RETRO: "RETRO",
  FUTURISTIC: "FUTURISTIC",
};

export const ICONS = ["circle", "triangle", "square", "pentagon", "star", "hexagon"];

export const THEME_ASSETS = {
  [THEMES.STANDARD]: {
    backgroundImg: "images/basic_background.png",
    hourImg: "images/basic_hourhand.png",
    minuteImg: "images/basic_minutehand.png",
    secondImg: "images/basic_secondhand.png",
    clockImg: "images/basic_clock.png",
    clockCenterImg: "images/basic_clockcenter.png",
    tickAudio: "sounds/tick.wav",
    winAudio: "sounds/win.wav",
  },
  [THEMES.RETRO]: {
    backgroundImg: "images/retro_background.png",
    hourImg: "images/retro_hourhand.png",
    minuteImg: "images/retro_minutehand.png",
    secondImg: "images/retro_secondhand.png",
    clockImg: "images/retro_clock.png",
    clockCenterImg: "images/retro_clockcenter.png",
    tickAudio: "sounds/tick.wav",
    winAudio: "sounds/win.wav",
  },
  [THEMES.FUTURISTIC]: {
    backgroundImg: "images/futuristic_background.png",
    hourImg: "",
    minuteImg: "",
    secondImg: "",
    clockImg: "images/futuristic_clock.png",
    clockCenterImg: "images/futuristic_clockcenter.png",
    tickAudio: "sounds/tick.wav",
    winAudio: "sounds/win.wav",
  },
};

export const ESCAPP_CLIENT_SETTINGS = {
  imagesPath: "./images/",
};

export const MAIN_SCREEN = "MAIN_SCREEN";