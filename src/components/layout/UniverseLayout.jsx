import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import UniverseBackground from "../universe/UniverseBackground";
import OrbitNavigation from "../universe/OrbitNavigation";
import MusicPlayer from "../music/MusicPlayer";
import ShootingStar from "../universe/ShootingStar";

export default function UniverseLayout({
  children,
  celebration = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation state
  const [menuOpen, setMenuOpen] = useState(false);

  /*
   * ============================================================
   * NAVIGATION TOGGLE
   * ============================================================
   *
   * This keeps the navigation state controlled by this layout.
   *
   * We are NOT removing the existing navigation system.
   * We are simply making sure the open/close functions are
   * available and stable.
   */

  const openNavigation = () => {
    setMenuOpen(true);
  };

  const closeNavigation = () => {
    setMenuOpen(false);
  };

  const toggleNavigation = () => {
    setMenuOpen((current) => !current);
  };

  /*
   * Reset navigation and scroll when changing pages
   */
  useEffect(() => {
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  /*
   * Prevent the page underneath from scrolling while the
   * navigation is open.
   *
   * This does NOT affect the night/day background.
   */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /*
   * Allow ESC to close the navigation.
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#050505]
        text-white
        ${celebration ? "celebration-world" : ""}
      `}
    >
      {/* ================================================
          BACKGROUND
          ================================================ */}

      <UniverseBackground
        celebration={celebration}
      />

      {/* ================================================
          PAGE CONTENT
          ================================================ */}

      <main className="relative z-30 min-h-screen w-full">
        {children}
      </main>

      {/* ================================================
          SHOOTING STAR
          ================================================ */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-[40]
        "
      >
        <ShootingStar
          onWish={() => navigate("/wish")}
        />
      </div>

      {/* ================================================
          MUSIC PLAYER
          ================================================ */}

      <MusicPlayer />

      {/* ================================================
          NAVIGATION
          
          IMPORTANT:
          Navigation state is controlled here.
          ================================================ */}

      <OrbitNavigation
        navigate={navigate}
        open={menuOpen}
        setOpen={setMenuOpen}

        /*
         * Additional controls.
         *
         * OrbitNavigation can use whichever one it needs.
         * Existing props above are NOT removed.
         */
        onOpen={openNavigation}
        onClose={closeNavigation}
        onToggle={toggleNavigation}
      />
    </div>
  );
}