import { frame, transform } from "motion";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
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
          <Route path="counter" element={<Counter />} />
          <Route path="ios-slider" element={<IOSSlider />} />
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
    <>
      <motion.div
        ref={ref}
        className="size-20 rounded-full bg-rose-800"
        style={{
          x,
          y,
        }}
      />
      <Link
        to="/counter"
        className="bg-purple-500 text-white px-2 py-1 rounded absolute bottom-[10%] right-[10%]"
      >
        next
      </Link>
    </>
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

function Counter() {
  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  React.useEffect(() => {
    const controls = animate(count, 100, { duration: 5, ease: "easeInOut" });
    return () => controls.stop();
  }, [count]);

  return (
    <>
      <motion.div className="text-white text-2xl font-mono">
        {rounded}
      </motion.div>
      <Link
        to="/ios-slider"
        className="bg-purple-500 text-white px-2 py-1 rounded absolute bottom-[10%] right-[10%]"
      >
        next
      </Link>
    </>
  );
}

function IOSSlider() {
  const constraintsRef = React.useRef<HTMLDivElement>(null);
  const _scaleY = useMotionValue(0);
  const scaleY = useSpring(_scaleY, { stiffness: 80 });

  return (
    <div className="bg-gray-700 rounded-xl size-56 grid place-content-center">
      <div ref={constraintsRef}>
        <motion.div
          className="bg-black h-36 w-18 overflow-hidden rounded-3xl relative"
          onDrag={(_, info) => {
            const boundingbox = constraintsRef.current?.getBoundingClientRect();
            if (!boundingbox) return;
            const height = boundingbox.height;
            const progress = info.point.y - boundingbox.top;
            const mapped = transform(progress, [0, height], [1, 0]);
            scaleY.set(mapped);
          }}
          dragElastic={0.01}
          drag="y"
          dragConstraints={constraintsRef}
        >
          <div
            className="cursor-none absolute pointer-events-none bottom-3 left-1/2 -translate-x-1/2 z-20"
            id="sun"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={40}
              height={40}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffdd78"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="none"
            >
              <circle cx={12} cy={12} r={4} stroke="#fecc00" fill="#fecc00" />
              <path d="M12 3v1M12 20v1M3 12h1M20 12h1M18.364 5.636l-.707.707M6.343 17.657l-.707.707M5.636 5.636l.707.707M17.657 17.657l.707.707" />
            </svg>
          </div>
          <motion.div
            id="brightness"
            style={{
              scaleY: scaleY,
              transformOrigin: "50% 100% 0px",
            }}
            className="absolute -inset-1 bg-gray-100 border pointer-events-none"
          ></motion.div>
        </motion.div>
      </div>
    </div>
  );
}
export default App;
