import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { Link, Route, Routes } from "react-router";

function App() {
  return (
    <div className="bg-gray-900 h-screen relative">
      <div className="container mx-auto flex items-center justify-center h-full">
        <Routes>
          <Route index element={<Enter />} />
          <Route path="exit-animation" element={<Exit />} />
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
        to="exit-animation"
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
      <button
        className="px-2 py-1 absolute top-2/3 left-[50%] -translate-x-1/2 rounded bg-rose-500 text-white"
        onClick={() => setShow((prev) => !prev)}
      >
        Toggle box
      </button>
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
    </div>
  );
}

export default App;
