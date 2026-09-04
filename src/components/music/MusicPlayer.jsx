import { useEffect, useRef } from "react";
import { birthdayData } from "../../data/birthdayData";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    const song = birthdayData?.songs?.[0];

    if (!audio || !song?.src) return;

    audio.src = song.src;
    audio.volume = 0.5;
    audio.loop = true;

    const startMusic = async () => {
      if (startedRef.current) return;

      try {
        await audio.play();
        startedRef.current = true;
      } catch {
        // Wait for user interaction if autoplay is blocked.
      }
    };

    const handleInteraction = () => {
      startMusic();
    };

    startMusic();

    window.addEventListener("pointerdown", handleInteraction, {
      once: true,
    });

    return () => {
      window.removeEventListener(
        "pointerdown",
        handleInteraction
      );
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      loop
      playsInline
      preload="auto"
      style={{ display: "none" }}
    />
  );
}