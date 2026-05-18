(() => {
  const ROOT_CLASS = "yfc-full-cinema";
  const LIVE_CLASS = "yfc-live";
  let updateFrame = 0;
  let lastPageKey = "";
  let autoTheaterAttempted = false;
  let liveChatCollapseAttempted = false;
  let manualDefaultMode = false;

  const isWatchPage = () => {
    const path = window.location.pathname;
    return path === "/watch" || path.startsWith("/live/");
  };

  const getPageKey = () => `${window.location.pathname}${window.location.search}`;

  const isLiveChatCollapsed = () => {
    const watchFlexy = document.querySelector("ytd-watch-flexy");
    const chatFrame = document.querySelector("ytd-live-chat-frame");

    return Boolean(
      watchFlexy?.getAttribute("is-live-chat-collapsed") === "true" ||
        watchFlexy?.isLiveChatCollapsed ||
        chatFrame?.hasAttribute("collapsed") ||
        chatFrame?.collapsed
    );
  };

  const findLiveChatCollapseButton = () => {
    const chatRoot =
      document.querySelector("#chat") ||
      document.querySelector("#chat-container") ||
      document.querySelector("ytd-live-chat-frame");

    if (!chatRoot) {
      return null;
    }

    const preferredButton = chatRoot.querySelector(
      "#show-hide-button button, #show-hide-button [role='button'], button[aria-label*='Hide chat' i], [aria-label*='Hide chat' i]"
    );

    if (preferredButton instanceof HTMLElement) {
      return preferredButton;
    }

    const touchFeedback = chatRoot.querySelector(".ytSpecTouchFeedbackShapeFill");
    return touchFeedback?.closest("button, [role='button'], yt-button-shape, ytd-button-renderer, tp-yt-paper-button") ?? null;
  };

  const collapseLiveChat = () => {
    if (liveChatCollapseAttempted || isLiveChatCollapsed()) {
      return;
    }

    const collapseButton = findLiveChatCollapseButton();
    if (!(collapseButton instanceof HTMLElement)) {
      return;
    }

    liveChatCollapseAttempted = true;
    collapseButton.click();
  };

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
      liveChatCollapseAttempted = false;
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

    if (live) {
      collapseLiveChat();
    }
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
