import { useEffect, useRef } from "react";
import { birthdayData } from "../../data/birthdayData";

export default function MusicPlayer({ enabled = true }) {
  const audioRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const audio = audioRef.current;
    const song = birthdayData?.songs?.[0];

    if (!audio || !song?.src) {
      console.warn("MusicPlayer: No music found.");
      return;
    }

    // Volume
    audio.volume = 0.10;

    // Loop the song continuously
    audio.loop = true;

    // Mobile-friendly settings
    audio.src = song.src;
    audio.preload = "metadata";
    audio.playsInline = true;

    const startMusic = async () => {
      if (startedRef.current) return;

      try {
        await audio.play();

        startedRef.current = true;
        removeListeners();

        console.log("🎵 Music started");
      } catch {
        // Autoplay blocked — wait for user interaction.
      }
    };

    const handleInteraction = () => {
      startMusic();
    };

    const removeListeners = () => {
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("click", handleInteraction);
    };

    // Try autoplay
    startMusic();

    // Mobile/browser fallback
    window.addEventListener("touchstart", handleInteraction, {
      passive: true,
    });

    window.addEventListener("pointerdown", handleInteraction, {
      passive: true,
    });

    window.addEventListener("click", handleInteraction, {
      passive: true,
    });

    return () => {
      removeListeners();

      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      startedRef.current = false;
    };
  }, [enabled]);

  return (
    <audio
      ref={audioRef}
      preload="metadata"
      playsInline
      loop
      aria-hidden="true"
      style={{ display: "none" }}
    />
  );
}