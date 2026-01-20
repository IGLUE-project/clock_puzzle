import { useContext, useEffect, useRef, useState } from "react";
import "./../assets/scss/app.scss";

import { DEFAULT_APP_SETTINGS, ESCAPP_CLIENT_SETTINGS, MAIN_SCREEN, THEME_ASSETS } from "../constants/constants.jsx";
import { GlobalContext } from "./GlobalContext.jsx";
import MainScreen from "./MainScreen.jsx";

export default function App() {
  const { escapp, setEscapp, appSettings, setAppSettings, Storage, setStorage, Utils, I18n } =
    useContext(GlobalContext);
  const hasExecutedEscappValidation = useRef(false);

  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState(MAIN_SCREEN);
  const prevScreen = useRef(screen);
  const [fail, setFail] = useState(false);
  const [solved, setSolved] = useState(false);
  const [config, setConfig] = useState({});

  useEffect(() => {
    //Init Escapp client
    if (escapp !== null) {
      return;
    }
    //Create the Escapp client instance.
    let _escapp = new ESCAPP(ESCAPP_CLIENT_SETTINGS);
    setEscapp(_escapp);
    Utils.log("Escapp client initiated with settings:", _escapp.getSettings());

    //Use the storage feature provided by Escapp client.
    setStorage(_escapp.getStorage());

    //Get app settings provided by the Escapp server.
    let _appSettings = processAppSettings(_escapp.getAppSettings());
    setAppSettings(_appSettings);
  }, []);

  useEffect(() => {
    if (!hasExecutedEscappValidation.current && escapp !== null && appSettings !== null && Storage !== null) {
      hasExecutedEscappValidation.current = true;

      //Register callbacks in Escapp client and validate user.
      escapp.registerCallback("onNewErStateCallback", function (erState) {
        try {
          Utils.log("New escape room state received from ESCAPP", erState);
          restoreAppState(erState);
        } catch (e) {
          Utils.log("Error in onNewErStateCallback", e);
        }
      });

      escapp.registerCallback("onErRestartCallback", function (erState) {
        try {
          Utils.log("Escape Room has been restarted.", erState);
          if (typeof Storage !== "undefined") {
            Storage.removeSetting("state");
          }
        } catch (e) {
          Utils.log("Error in onErRestartCallback", e);
        }
      });

      //Validate user. To be valid, a user must be authenticated and a participant of the escape room.
      escapp.validate((success, erState) => {
        try {
          Utils.log("ESCAPP validation", success, erState);
          if (success) {
            restoreAppState(erState);
            setLoading(false);
          }
        } catch (e) {
          Utils.log("Error in validate callback", e);
        }
      });
    }
  }, [escapp, appSettings, Storage]);

  useEffect(() => {
    if (screen !== prevScreen.current) {
      Utils.log("Screen ha cambiado de", prevScreen.current, "a", screen);
      prevScreen.current = screen;
    }
  }, [screen]);

  function restoreAppState(erState) {
    Utils.log("Restore application state based on escape room state:", erState);
    const _settings = escapp.getSettings();

    if (!_settings.linkedPuzzleIds || _settings.linkedPuzzleIds.length === 0) {
      setAppSettings((prevSettings) => {
        return {
          ...prevSettings,
          disableButton: true,
        };
      });
    }

    // Si el puzle está resuelto lo ponemos en posicion de resuelto
    if (escapp.getAllPuzzlesSolved() && escapp.getLastSolution()) {
      if (appSettings.actionWhenLoadingIfSolved) {
        setSolved(true);
      }
    }
  }

  function processAppSettings(_appSettings) {
    if (typeof _appSettings !== "object") {
      _appSettings = {};
    }
    if (typeof _appSettings.skin === "undefined" && typeof DEFAULT_APP_SETTINGS.skin === "string") {
      _appSettings.skin = DEFAULT_APP_SETTINGS.skin;
    }

    let skinSettings = THEME_ASSETS[_appSettings.skin] || {};

    let DEFAULT_APP_SETTINGS_SKIN = Utils.deepMerge(DEFAULT_APP_SETTINGS, skinSettings);

    // Merge _appSettings with DEFAULT_APP_SETTINGS_SKIN to obtain final app settings
    _appSettings = Utils.deepMerge(DEFAULT_APP_SETTINGS_SKIN, _appSettings);

    //Init internacionalization module
    I18n.init(_appSettings);

    _appSettings.useSecondsBoolean = ((_appSettings.useSeconds==="TRUE")||(_appSettings.useSeconds===true));

    //Change HTTP protocol to HTTPs in URLs if necessary
    _appSettings = Utils.checkUrlProtocols(_appSettings);

    //Preload resources (if necessary)
    //Utils.preloadImages([_appSettings.backgroundMessage]);
    //Utils.preloadAudios([_appSettings.soundBeep,_appSettings.soundNok,_appSettings.soundOk]); //Preload done through HTML audio tags
    //Utils.preloadVideos(["videos/some_video.mp4"]);
    Utils.log("App settings:", _appSettings);
    return _appSettings;
  }

  function solvePuzzle(_solution) {
    const { hour, minutes, seconds } = _solution;
    const pad = (n) => n.toString().padStart(2, "0");
    let solutionStr = `${hour}:${pad(minutes)}`;
    if (appSettings.useSecondsBoolean) solutionStr += `:${pad(seconds)}`;
    Utils.log("solution: ", solutionStr);
    return checkResult(solutionStr);
  }

  function checkResult(_solution) {
    const escappSettings = escapp.getSettings();
    if ((!escappSettings.linkedPuzzleIds || escappSettings.linkedPuzzleIds.length === 0)) return;
    escapp.checkNextPuzzle(_solution, {}, (success, erState) => {
      Utils.log("Check solution Escapp response", success, erState);
      if (success) {
        setSolved(true);
        try {
          setTimeout(() => {
            submitPuzzleSolution(_solution);
          }, 2000);
        } catch (e) {
          Utils.log("Error in checkNextPuzzle", e);
        }
      }
    });
  }
  function submitPuzzleSolution(_solution) {
    Utils.log("Submit puzzle solution", _solution);
    escapp.submitNextPuzzle(_solution, {}, (success, erState) => {
      Utils.log("Solution submitted to Escapp", _solution, success, erState);
    });
  }

  const renderScreens = (screens) => {
    if (loading === true) {
      return null;
    } else {
      return <>{screens.map(({ id, content }) => renderScreen(id, content))}</>;
    }
  };

  const renderScreen = (screenId, screenContent) => (
    <div key={screenId} className={`screen_wrapper ${screen === screenId ? "active" : ""}`}>
      {screenContent}
    </div>
  );

  let screens = [
    {
      id: MAIN_SCREEN,
      content: (
        <div
          className={`main-background${solved ? " solved" : ""}`}
          style={{ backgroundImage: appSettings?.backgroundImg ? `url(${appSettings.backgroundImg})` : {} }}
        >
          <MainScreen config={appSettings} solvePuzzle={solvePuzzle} solved={solved} />
        </div>
      ),
    },
  ];

  return (
    <div
      id="global_wrapper"
      className={`${
        appSettings !== null && typeof appSettings.skin === "string" ? appSettings.skin.toLowerCase() : ""
      }`}
    >
      {renderScreens(screens)}
    </div>
  );
}
