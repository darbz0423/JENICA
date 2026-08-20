import { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import Opening from "./components/cinematic/Opening";
import BootSequence from "./components/cinematic/BootSequence";
import UniverseLayout from "./components/layout/UniverseLayout";

import Universe from "./pages/Universe";
import Memories from "./pages/Memories";
import Gallery from "./pages/Gallery";
import Letters from "./pages/Letters";
import Create from "./pages/Create";
import Wish from "./pages/Wish";
import Celebration from "./pages/Celebration";
import MemoryGame from "./pages/MemoryGame";
import Finale from "./pages/Finale";

function AppContent() {
  const [stage, setStage] = useState("opening");

  const enterUniverse = useCallback(() => {
    setStage("boot");
  }, []);

  const finishBoot = useCallback(() => {
    setStage("universe");
  }, []);

  useEffect(() => {
    document.body.classList.add("memory-universe");

    return () => {
      document.body.classList.remove(
        "memory-universe"
      );
    };
  }, []);

  if (stage === "opening") {
    return <Opening onEnter={enterUniverse} />;
  }

  if (stage === "boot") {
    return <BootSequence onComplete={finishBoot} />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/universe" replace />}
      />

      <Route
        path="/universe"
        element={
          <UniverseLayout>
            <Universe />
          </UniverseLayout>
        }
      />

      <Route
        path="/memories"
        element={
          <UniverseLayout>
            <Memories />
          </UniverseLayout>
        }
      />

      <Route
        path="/gallery"
        element={
          <UniverseLayout>
            <Gallery />
          </UniverseLayout>
        }
      />

      <Route
        path="/letters"
        element={
          <UniverseLayout>
            <Letters />
          </UniverseLayout>
        }
      />

      <Route
        path="/create"
        element={
          <UniverseLayout>
            <Create />
          </UniverseLayout>
        }
      />

      <Route
        path="/wish"
        element={
          <UniverseLayout>
            <Wish />
          </UniverseLayout>
        }
      />

      <Route
        path="/celebration"
        element={
          <UniverseLayout celebration>
            <Celebration />
          </UniverseLayout>
        }
      />

      {/* EXISTING GAME ROUTE — UNCHANGED */}
      <Route
        path="/game"
        element={
          <UniverseLayout>
            <MemoryGame />
          </UniverseLayout>
        }
      />

      {/* MEMORY GAME — ADDED FOR NAVIGATION */}
      <Route
        path="/memorygame"
        element={
          <UniverseLayout>
            <MemoryGame />
          </UniverseLayout>
        }
      />

      <Route
        path="/finale"
        element={<Finale />}
      />

      <Route
        path="*"
        element={<Navigate to="/universe" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}