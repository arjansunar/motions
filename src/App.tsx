import { frame } from "motion";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import React from "react";
import { Link, Route, Routes } from "react-router";

function App() {
  return (
    <div className="bg-gray-900 h-screen relative">
      <div className="container mx-auto flex items-center justify-center h-full">
        <Routes>
          <Route index element={<Enter />} />
          <Route path="exit-animation" element={<Exit />} />
          <Route path="follow-pointer" element={<FollowPointer />} />
        </Routes>
      </div>
    </div>
  );
}

function Enter() {
  return (
    <>
      <motion.div
        className="bg-pink-500 rounded size-10"
        animate={{
          scale: 2,
          rotate: 360,
          transition: { duration: 1 },
        }}
      />
      <Link
        to="/exit-animation"
        className="bg-purple-500 text-white px-2 py-1 rounded absolute bottom-[10%] right-[10%]"
      >
        next
      </Link>
    </>
  );
}

function Exit() {
  const [show, setShow] = React.useState(true);
  return (
    <div className="space-y-4">
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{
          scale: 1.1,
          transition: {
            duration: 0.2,
          },
        }}
        className="px-2 py-1 hover:cursor-pointer absolute top-3/5 left-[50%] -translate-x-1/2 rounded bg-rose-500 text-white"
        onClick={() => setShow((prev) => !prev)}
      >
        Toggle box
      </motion.button>
      <AnimatePresence>
        {show && (
          <motion.div
            className="bg-pink-500 rounded size-20"
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
          />
        )}
      </AnimatePresence>
      <Link
        to="/follow-pointer"
        className="bg-purple-500 text-white px-2 py-1 rounded absolute bottom-[10%] right-[10%]"
      >
        next
      </Link>
    </div>
  );
}

function FollowPointer() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { x, y } = useFollowPointer(ref);
  return (
    <motion.div
      ref={ref}
      className="size-20 rounded-full bg-rose-800"
      style={{
        x,
        y,
      }}
    />
  );
}

const spring = { damping: 3, stiffness: 50, restDelta: 0.001 };

export function useFollowPointer(ref: React.RefObject<HTMLDivElement | null>) {
  const xPoint = useMotionValue(0);
  const yPoint = useMotionValue(0);
  const x = useSpring(xPoint, spring);
  const y = useSpring(yPoint, spring);

  React.useEffect(() => {
    if (!ref.current) return;

    const handlePointerMove = ({ clientX, clientY }: MouseEvent) => {
      const element = ref.current!;

      frame.read(() => {
        xPoint.set(clientX - element.offsetLeft - element.offsetWidth / 2);
        yPoint.set(clientY - element.offsetTop - element.offsetHeight / 2);
      });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [ref, xPoint, yPoint]);

  return { x, y };
}
export default App;
