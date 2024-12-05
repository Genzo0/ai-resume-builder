import { motion } from "framer-motion";
import resumePreviewImage from "@/assets/resume-preview.jpg";

export default function AnimationImage() {
  return (
    <motion.img
      src={resumePreviewImage.src}
      alt="Resume preview"
      className="shadow-md"
      width={500}
      animate={{
        translateY: [-10, 10],
        rotate: [2],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "mirror",
        duration: 3,
        ease: "easeInOut",
      }}
    />
  );
}
