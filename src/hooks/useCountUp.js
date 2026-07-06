import { useState, useEffect } from "react";

/**
 * Custom hook to animate numeric values in strings (e.g., "1,234" or "45,680 FCFA" or "4.8").
 * Parses the number, runs an easing animation on mount or target change,
 * and formats the animated value back to its original formatting.
 *
 * @param {string|number} value - The target value to animate.
 * @param {number} duration - Animation duration in ms.
 * @returns {string|number} - The animated value.
 */
export function useCountUp(value, duration = 1200) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const strValue = String(value);
    
    // Find the first occurrence of a number (optional sign, optional commas/dots, digits)
    const numRegex = /([0-9.,]+)/;
    const match = strValue.match(numRegex);
    
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const numStr = match[1];
    let cleanNumStr = numStr;
    const hasComma = numStr.includes(",");
    const hasDot = numStr.includes(".");
    
    // Normalize thousands separators
    if (hasComma) {
      cleanNumStr = numStr.replace(/,/g, "");
    }
    
    const targetNum = parseFloat(cleanNumStr);
    if (isNaN(targetNum)) {
      setDisplayValue(value);
      return;
    }

    const prefix = strValue.substring(0, match.index);
    const suffix = strValue.substring(match.index + numStr.length);

    let startTimestamp = null;
    const startNum = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentNum = easedProgress * (targetNum - startNum) + startNum;

      // Format decimals
      let formattedNum = "";
      if (hasDot) {
        const decimalParts = numStr.split(".");
        const decimals = decimalParts[1] ? decimalParts[1].length : 1;
        formattedNum = currentNum.toFixed(decimals);
      } else {
        formattedNum = Math.floor(currentNum).toString();
      }

      // Re-apply thousands separators (commas)
      if (hasComma) {
        formattedNum = formattedNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      setDisplayValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [value, duration]);

  return displayValue;
}
