//Copy this file to config.js and specify your own settings

export let ESCAPP_APP_SETTINGS = {
  //Settings that can be specified by the authors
  skin: "STANDARD", //skin can be "STANDARD", "RETRO" or "FUTURISTIC".
  //backgroundImg: "NONE", //background can be "NONE" or a URL.
  useSeconds: "TRUE",
  initialTime: "5:30:00", //Initial time in format "H:MM:SS" or "H:MM"

  //Settings that will be automatically specified by the Escapp server
  locale: "es",

  escappClientSettings: {
    endpoint: "https://escapp.es/api/escapeRooms/id",
    linkedPuzzleIds: [1],
    rtc: false,
  },
};