import { useEffect, useRef } from "react";
import { birthdayData } from "../../data/birthdayData";

export default function MusicPlayer({ enabled = true }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const songs = birthdayData.songs || [];
    if (!songs.length) return;

    const audio = audioRef.current;
    if (!audio) return;

    let songIndex = 0;
    let isStarted = false;

    audio.src = songs[0].src;
    audio.preload = "auto";
    audio.playsInline = true;
    audio.volume = 0.7;

    // --------------------------------------------------
    // START MUSIC
    // --------------------------------------------------

    const startMusic = async () => {
      if (isStarted) return;

      try {
        await audio.play();

        isStarted = true;
        removeListeners();
      } catch {
        // Browser blocked autoplay.
        // First user interaction will start it.
      }
    };

    // --------------------------------------------------
    // MOBILE FALLBACK
    // --------------------------------------------------

    const handleFirstInteraction = () => {
      startMusic();
    };

    const removeListeners = () => {
      document.removeEventListener(
        "touchstart",
        handleFirstInteraction
      );

      document.removeEventListener(
        "pointerdown",
        handleFirstInteraction
      );

      document.removeEventListener(
        "click",
        handleFirstInteraction
      );
    };

    // --------------------------------------------------
    // NEXT SONG
    // --------------------------------------------------

    const handleEnded = () => {
      songIndex = (songIndex + 1) % songs.length;

      audio.src = songs[songIndex].src;

      audio.play().catch(() => {
        isStarted = false;
      });
    };

    audio.addEventListener("ended", handleEnded);

    // --------------------------------------------------
    // TRY AUTOPLAY
    // --------------------------------------------------

    startMusic();

    // If mobile blocks autoplay,
    // start music on the first touch.
    document.addEventListener(
      "touchstart",
      handleFirstInteraction,
      {
        passive: true,
        once: false,
      }
    );

    document.addEventListener(
      "pointerdown",
      handleFirstInteraction,
      {
        passive: true,
        once: false,
      }
    );

    document.addEventListener(
      "click",
      handleFirstInteraction,
      {
        passive: true,
        once: false,
      }
    );

    return () => {
      audio.pause();

      audio.removeEventListener(
        "ended",
        handleEnded
      );

      removeListeners();

      audio.removeAttribute("src");
      audio.load();
    };
  }, [enabled]);

  return (
    <audio
      ref={audioRef}
      playsInline
      preload="auto"
    />
  );
}