import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { hash, pathname, search } = useLocation();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (hash) {
        const targetId = getHashTargetId(hash);
        const target = document.getElementById(targetId);

        if (target) {
          target.scrollIntoView({ behavior: "auto", block: "start" });
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [hash, pathname, search]);

  return null;
}

function getHashTargetId(hash) {
  const rawTargetId = hash.slice(1);

  try {
    return decodeURIComponent(rawTargetId);
  } catch {
    return rawTargetId;
  }
}

export default ScrollToTop;
