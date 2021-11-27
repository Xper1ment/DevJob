import React from "react";

const useWindowSize = () => {
  
  const [windowSize, setWindowSize] = React.useState({
    width:  window.innerWidth,
    height: window.innerHeight,
  });

  const  changeWindowSize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }

  React.useEffect(() => {
    window.addEventListener("resize", changeWindowSize);

    return () => {
      window.removeEventListener("resize", changeWindowSize);
    };
  }, []);

  return windowSize;
}

export default useWindowSize;
