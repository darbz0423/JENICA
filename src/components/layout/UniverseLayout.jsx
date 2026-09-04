import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import UniverseBackground from "../universe/UniverseBackground";
import OrbitNavigation from "../universe/OrbitNavigation";
import ShootingStar from "../universe/ShootingStar";

export default function UniverseLayout({
  children,
  celebration = false,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

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
   * Prevent scrolling while navigation is open
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
   * ESC closes navigation
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
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
      {/* BACKGROUND */}
      <UniverseBackground
        celebration={celebration}
      />

      {/* PAGE CONTENT */}
      <main className="relative z-30 min-h-screen w-full">
        {children}
      </main>

      {/* SHOOTING STAR */}
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

      {/* NAVIGATION */}
      <OrbitNavigation
        navigate={navigate}
        open={menuOpen}
        setOpen={setMenuOpen}
        onOpen={openNavigation}
        onClose={closeNavigation}
        onToggle={toggleNavigation}
      />
    </div>
  );
}