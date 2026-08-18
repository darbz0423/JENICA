import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { birthdayData } from "../../data/birthdayData";

export default function MusicPlayer({ enabled = true }) {
  const audioRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const songs = birthdayData.songs || [];
  const current = songs[index];

  useEffect(() => {
    if (!audioRef.current || !current) return;

    audioRef.current.src = current.src;
    audioRef.current.load();
    setProgress(0);

    if (playing) {
      audioRef.current.play().catch(() => {
        setPlaying(false);
      });
    }
  }, [index]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const update = () => {
      if (!audio.duration) return;

      setProgress(
        (audio.currentTime / audio.duration) * 100
      );
    };

    const ended = () => {
      setIndex((currentIndex) =>
        (currentIndex + 1) % songs.length
      );
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("ended", ended);
    };
  }, [songs.length]);

  if (!enabled || !current) return null;

  const toggle = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  const next = () => {
    setIndex(
      (currentIndex) =>
        (currentIndex + 1) % songs.length
    );
    setPlaying(true);
  };

  const previous = () => {
    setIndex(
      (currentIndex) =>
        (currentIndex - 1 + songs.length) %
        songs.length
    );
    setPlaying(true);
  };

  return (
    <>
      <audio ref={audioRef} muted={muted} />

      <div className="fixed right-5 top-5 z-50">
        <div className="flex items-center gap-2 border border-white/10 bg-black/60 p-2 backdrop-blur-xl">
          <button
            onClick={previous}
            className="p-2 text-white/40 transition hover:text-white"
            aria-label="Previous song"
          >
            <SkipBack size={13} />
          </button>

          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white hover:text-black"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause size={13} />
            ) : (
              <Play size={13} />
            )}
          </button>

          <button
            onClick={next}
            className="p-2 text-white/40 transition hover:text-white"
            aria-label="Next song"
          >
            <SkipForward size={13} />
          </button>

          <div className="hidden w-28 md:block">
            <div className="truncate font-mono text-[8px] uppercase tracking-[0.2em] text-white/60">
              {current.title}
            </div>

            <div className="mt-1 h-px bg-white/10">
              <div
                className="h-full bg-white/70"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <button
            onClick={() => setMuted((value) => !value)}
            className="p-2 text-white/40 transition hover:text-white"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <VolumeX size={13} />
            ) : (
              <Volume2 size={13} />
            )}
          </button>
        </div>
      </div>
    </>
  );
}