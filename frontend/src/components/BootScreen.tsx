import React, { useEffect } from "react";
import { useBootSequence } from "../services/useBootSequence";

const BootScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const { progress, stage, done } = useBootSequence();

  useEffect(() => {
    const bar = document.querySelector(".boot-progress") as HTMLElement;
    const percent = document.querySelector(".boot-percent");
    const status = document.querySelector(".boot-status");

    if (bar) bar.style.width = `${progress}%`;
    if (percent) percent.textContent = `${progress}%`;
    if (status) status.textContent = stage;

    if (done) {
      const splash = document.getElementById("neuroedge-boot");
      if (splash) {
        splash.style.opacity = "0";
        splash.style.transition = "opacity 0.6s ease";
        setTimeout(() => splash.remove(), 600);
      }
      onDone();
    }
  }, [progress, stage, done, onDone]);

  return null;
};

export default BootScreen;
