(() => {
  const ROOT_CLASS = "yfc-full-cinema";
  const LIVE_CLASS = "yfc-live";
  let updateFrame = 0;
  let lastPageKey = "";
  let autoTheaterAttempted = false;
  let manualDefaultMode = false;

  const isWatchPage = () => {
    const path = window.location.pathname;
    return path === "/watch" || path.startsWith("/live/");
  };

  const getPageKey = () => `${window.location.pathname}${window.location.search}`;

  const isLiveStream = () => {
    if (window.location.pathname.startsWith("/live/")) {
      return true;
    }

    return Boolean(
      document.querySelector(
        "ytd-watch-flexy[is-live], .ytp-live, .ytp-live-badge, ytd-live-chat-frame:not([collapsed])"
      )
    );
  };

  const enterTheaterMode = () => {
    const watchFlexy = document.querySelector("ytd-watch-flexy");
    if (
      autoTheaterAttempted ||
      !watchFlexy ||
      watchFlexy.hasAttribute("theater") ||
      document.fullscreenElement
    ) {
      return;
    }

    autoTheaterAttempted = true;

    const theaterButton = document.querySelector(".ytp-size-button");
    if (theaterButton instanceof HTMLElement) {
      theaterButton.click();
      return;
    }

    watchFlexy.setAttribute("theater", "");
    watchFlexy.setAttribute("theater-requested_", "");
  };

  const update = () => {
    updateFrame = 0;

    const pageKey = getPageKey();
    if (pageKey !== lastPageKey) {
      lastPageKey = pageKey;
      autoTheaterAttempted = false;
      manualDefaultMode = false;
    }

    if (!isWatchPage()) {
      document.documentElement.classList.remove(ROOT_CLASS);
      document.documentElement.classList.remove(LIVE_CLASS);
      return;
    }

    if (!manualDefaultMode) {
      enterTheaterMode();
    }

    const watchFlexy = document.querySelector("ytd-watch-flexy");
    const shouldEnable = !manualDefaultMode && Boolean(watchFlexy?.hasAttribute("theater"));
    document.documentElement.classList.toggle(ROOT_CLASS, shouldEnable);

    if (!shouldEnable) {
      document.documentElement.classList.remove(LIVE_CLASS);
      return;
    }

    const live = isLiveStream();
    document.documentElement.classList.toggle(LIVE_CLASS, live);
  };

  const scheduleUpdate = () => {
    if (updateFrame) {
      return;
    }

    updateFrame = window.requestAnimationFrame(update);
  };

  document.addEventListener("yt-navigate-finish", scheduleUpdate);
  document.addEventListener("yt-page-data-updated", scheduleUpdate);
  document.addEventListener(
    "click",
    (event) => {
      if (event.target instanceof Element && event.target.closest(".ytp-size-button")) {
        const wasTheater = Boolean(document.querySelector("ytd-watch-flexy[theater]"));
        autoTheaterAttempted = true;
        manualDefaultMode = wasTheater;

        if (manualDefaultMode) {
          document.documentElement.classList.remove(ROOT_CLASS);
          document.documentElement.classList.remove(LIVE_CLASS);
        }

        scheduleUpdate();
        window.setTimeout(scheduleUpdate, 50);
        window.setTimeout(scheduleUpdate, 150);
      }
    },
    true
  );
  window.addEventListener("popstate", scheduleUpdate);
  window.addEventListener("resize", scheduleUpdate);

  const observer = new MutationObserver(scheduleUpdate);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["theater", "is-live", "collapsed", "class"]
  });

  scheduleUpdate();
})();
