import { useEffect, useState } from "react";

// Function to generate random characters
const getRandomChar = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01!@#$%^&*()(*_)(_";
  return chars[Math.floor(Math.random() * chars.length)];
};

// Function to gradually reveal the title
const getTitleWithRandomChars = (title: string, progress: number) => {
  return title
    .split("")
    .map((char, index) => {
      if (index < progress) {
        return char; // Reveal actual character based on progress
      }
      return getRandomChar(); // Random character otherwise
    })
    .join("");
};

// Custom Hook for text animation
export function useAnimatedText(
  title: string,
  speed: number = 100,
  starter = "gw09oejkmf"
) {
  const [animatedText, setAnimatedText] = useState(starter); // Holds the animated text
  const [progress, setProgress] = useState(0); // Tracks the animation progress

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (progress < title.length) {
      intervalId = setInterval(() => {
        setProgress((prev) => prev + 1); // Increment the reveal progress
      }, speed); // Speed controls the interval timing
    }

    return () => clearInterval(intervalId); // Clean up interval
  }, [progress, title.length, speed]);

  useEffect(() => {
    setAnimatedText(getTitleWithRandomChars(title, progress)); // Update the displayed text
  }, [progress, title]);
  useEffect(() => {
    setProgress(0);
  }, [title]);

  return animatedText; // Return the animated text
}
