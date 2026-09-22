import { useState, useEffect } from "react";
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handler = setWidth(window.innerWidth);

    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return width;
}

function App() {
  const width = useWindowWidth();
  return React.createElement("div", null, `My window width is: ${width}`);
}
