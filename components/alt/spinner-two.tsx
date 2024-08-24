import { motion } from "framer-motion";

const Spinner = ({ size = "3rem" }: {size: string}) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        className={`relative border-4 border-transparent border-b-transparent border-r-black rounded-full`}
        style={{ width: size, height: size }}
        animate={{
          borderRightWidth: ["4px", "4px", "4px", "0px"],
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0,
          },
        }}
      >
        <motion.div
          className="absolute w-1/4 h-1/4 bg-black"
          style={{ top: "0", right: "0" }}
          animate={{
            transform: ["translateX(0)", "translateX(100%)", "translateX(0)"],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 0,
            },
          }}
        />
        <motion.div
          className="absolute w-1/4 h-1/4 bg-black"
          style={{ top: "0", right: "0" }}
          animate={{
            transform: ["translateX(0)", "translateX(100%)", "translateX(0)"],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 0.5,
            },
          }}
        />
        <motion.div
          className="absolute w-1/4 h-1/4 bg-black"
          style={{ top: "0", right: "0" }}
          animate={{
            transform: ["translateX(0)", "translateX(100%)", "translateX(0)"],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
            },
          }}
        />
      </motion.div>
    </div>
  );
};

export default Spinner;
