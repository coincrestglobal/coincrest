export default function GradientBackground({
  clor1 = "rgba(9, 25, 70, 255)",
  colo2 = "rgba(18,49,54,0)",
  size = "30%",
  top = "10%",
  left = "30%",
}) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        background: `radial-gradient(circle, ${clor1} 0%, ${colo2} 60%)`,
        width: size,
        height: size,
        top: top,
        left: left,
        transform: "translate(-50%, -50%)",
        opacity: 0.8,
        filter: "blur(120px)",
      }}
    ></div>
  );
}
