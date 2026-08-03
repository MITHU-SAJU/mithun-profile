import { FiArrowRight, FiAward, FiFolder, FiBriefcase } from "react-icons/fi";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  SiReact,
  SiJavascript,
  SiPython,
  SiFastapi,
  SiMongodb,
  SiNodedotjs,
  SiFramer,
  SiGit,
  SiHtml5,
  SiMysql,
  SiFirebase,
} from "react-icons/si";
import { FiMapPin, FiBookOpen } from "react-icons/fi";
import {
  FiHome,
  FiUser,
  FiGrid,
  FiZap,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiExternalLink,
  FiSend,
  FiCode,
  FiLayers,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { supabase } from "./supabaseClient";
import "./global.css";

/* ─────────────────── CONSTANTS ─────────────────── */
const TABS = [
  { id: "home", label: "Home", Icon: FiHome },
  { id: "about", label: "About", Icon: FiUser },
  { id: "projects", label: "Projects", Icon: FiGrid },
  { id: "skills", label: "Skills", Icon: FiZap },
  { id: "contact", label: "Contact", Icon: FiMail },
];

const DEFAULT_PROFILE = {
  name: "Mithun T M",
  title: "Software Developer",
  description:
    "Software Developer with hands-on experience building scalable web applications. Specialized in React.js, JavaScript, and modern CSS to create user-friendly digital experiences with clean UI/UX.",
  email: "mithuntm25@gmail.com",
  location: "Coimbatore, India",
  phrases: [
    "modern web apps.",
    "responsive UIs.",
    "seamless experiences.",
    "React solutions.",
  ],
  stats: { cgpa: "8.0", projects: "5+", internship: "1" },
};

const TIMELINE = [
  {
    year: "2024–Pres.",
    title: "Software & Frontend Developer Intern",
    place: "CTRL-NEXT TECHNOLOGIES",
    description:
      "Developing responsive UI modules using React.js and modern CSS. Built reusable components and integrated REST APIs for dashboards and workflows.",
  },
  {
    year: "2024–2026",
    title: "Master of Computer Applications (MCA)",
    place: "SRMV College, Coimbatore",
    description:
      "Pursuing higher education in computer applications to deepen technical expertise.",
  },
  {
    year: "2021–2024",
    title: "Bachelor of Science (Computer Science)",
    place: "SRMV College, Coimbatore",
    description:
      "Graduated with 8.0 CGPA. Gained strong foundation in software development and CS fundamentals.",
  },
];

/* ─────────────────── DEBOUNCE UTILITY ─────────────────── */
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/* ─────────────────── RESPONSIVE HOOK ─────────────────── */
function useResponsive() {
  const [dims, setDims] = useState(() => ({
    mobile: window.innerWidth < 768,
    tablet: window.innerWidth < 900,
    medDesktop: window.innerWidth < 992,
    width: window.innerWidth,
  }));

  useEffect(() => {
    const handleResize = debounce(() => {
      const w = window.innerWidth;
      setDims({
        mobile: w < 768,
        tablet: w < 900,
        medDesktop: w < 992,
        width: w,
      });
    }, 150);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dims;
}

/* ─────────────────── FLOATING ORBS (CSS-driven, memoized) ─────────────────── */
const STAR_PARTICLES = (() => {
  const particles = [];
  for (let i = 0; i < 12; i++) {
    particles.push({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      color: i % 2 === 0 ? "#10B981" : "#3B82F6",
      duration: `${10 + Math.random() * 20}s`,
      delay: `${Math.random() * 10}s`,
    });
  }
  return particles;
})();

const ORB_DATA = [
  { size: 520, top: "10%", left: "-10%", color: "rgba(16,185,129,0.08)", duration: "15s" },
  { size: 380, top: "55%", left: "70%", color: "rgba(59,130,246,0.07)", duration: "20s" },
  { size: 280, top: "5%", left: "65%", color: "rgba(6,182,212,0.07)", duration: "25s" },
  { size: 200, top: "75%", left: "20%", color: "rgba(16,185,129,0.06)", duration: "30s" },
];

const FloatingOrbs = memo(function FloatingOrbs() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Stardust particles — CSS animated */}
      {STAR_PARTICLES.map((p, i) => (
        <div
          key={`star-${i}`}
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: "50%",
            filter: "blur(0.5px)",
            opacity: 0.3,
            animation: `starFloat ${p.duration} ${p.delay} linear infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {ORB_DATA.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: o.size,
            height: o.size,
            top: o.top,
            left: o.left,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
            animation: `orbFloat${i % 2} ${o.duration} ease-in-out infinite`,
            willChange: "transform",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
});

/* ─────────────────── SIDEBAR NAV (Bright Orange Theme) ─────────────────── */
const Sidebar = memo(function Sidebar({ active, setActive, mobile, profile }) {
  if (mobile) {
    // Bottom nav for mobile
    return (
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "#1C1917",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(232,155,45,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          height: 68,
          padding: "0 8px",
        }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "8px 14px",
                borderRadius: 14,
                border: "none",
                background: isActive ? "rgba(232,155,45,0.18)" : "transparent",
                color: isActive ? "#E89B2D" : "rgba(245,245,244,0.4)",
                cursor: "pointer",
                transition: "all 0.25s ease",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <Icon size={20} />
              {label}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: 240,
        zIndex: 100,
        background: "#1C1917",
        borderRight: "1px solid rgba(232,155,45,0.12)",
        display: "flex",
        flexDirection: "column",
        padding: "40px 18px 32px",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 52, paddingLeft: 10 }}>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 26,
            fontWeight: 700,
            color: "#E89B2D",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {profile?.name?.split(" ")[0] || "Mithun"}
        </div>
        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 10,
            color: "rgba(245,245,244,0.45)",
            letterSpacing: "0.12em",
            marginTop: 8,
            textTransform: "uppercase",
          }}
        >
          {profile?.title || "Frontend Developer"}
        </div>
      </div>

      {/* Nav items */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <motion.button
              key={id}
              onClick={() => setActive(id)}
              whileHover={{ x: isActive ? 0 : 4 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "13px 16px",
                borderRadius: 14,
                border: "none",
                cursor: "pointer",
                background: isActive
                  ? "linear-gradient(135deg, #E89B2D 0%, #D97706 100%)"
                  : "transparent",
                color: isActive ? "#1C1917" : "rgba(245,245,244,0.5)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: isActive ? 600 : 450,
                letterSpacing: "0.01em",
                transition: "all 0.25s ease",
                position: "relative",
                textAlign: "left",
                boxShadow: isActive
                  ? "0 6px 20px rgba(232,155,45,0.3)"
                  : "none",
              }}
            >
              <Icon
                size={17}
                style={{
                  position: "relative",
                  color: isActive ? "#1C1917" : "rgba(245,245,244,0.5)",
                }}
              />
              <span style={{ position: "relative" }}>{label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Social icons */}
      <div
        style={{
          display: "flex",
          gap: 16,
          paddingTop: 28,
          paddingLeft: 10,
          borderTop: "1px solid rgba(232,155,45,0.12)",
        }}
      >
        {[
          { Icon: FiGithub, href: "https://github.com/MITHU-SAJU" },
          { Icon: FiLinkedin, href: "https://linkedin.com/in/mithun-t-m" },
          { Icon: FaWhatsapp, href: "https://wa.me/918524822544" },
        ].map(({ Icon, href }, i) => (
          <motion.a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, color: "#E89B2D" }}
            style={{
              color: "rgba(245,245,244,0.35)",
              transition: "color 0.2s",
            }}
          >
            <Icon size={19} />
          </motion.a>
        ))}
      </div>
    </nav>
  );
});

/* ─────────────────── TYPING ANIMATION ─────────────────── */
function TypingText({ phrases }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = phrases[idx];
    let timeout;
    if (!deleting) {
      if (displayed.length < target.length) {
        timeout = setTimeout(
          () => setDisplayed(target.slice(0, displayed.length + 1)),
          70,
        );
      } else {
        timeout = setTimeout(() => setDeleting(true), 2200);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setDeleting(false);
        setIdx((idx + 1) % phrases.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx, phrases]);

  return (
    <span style={{ color: "#10B981" }}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        _
      </motion.span>
    </span>
  );
}

/* ─────────────────── SECTION WRAPPER ─────────────────── */
function Section({ children, style }) {
  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "48px 52px 48px",
        contain: "content",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────── FADE IN VIEW ─────────────────── */
function FadeIn({ children, delay = 0, y = 24, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────── MARQUEE TEXT (CSS-driven, memoized) ─────────────────── */
const MarqueeText = memo(function MarqueeText({ profile }) {
  const words = [
    profile?.name?.toUpperCase() || "MITHUN T M",
    profile?.title?.toUpperCase() || "FRONTEND DEVELOPER",
    "UI/UX DESIGNER",
    "REACT EXPERT",
    "MOBILE APPS",
  ];

  const wordBlock = Array(4).fill(words).flat();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "10vh 0",
        opacity: 0.04,
        zIndex: 0,
        userSelect: "none",
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            fontSize: "12vh",
            fontWeight: 900,
            whiteSpace: "nowrap",
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "0.2em",
            color: "#fff",
            animation: `${i % 2 === 0 ? "marqueeLeft" : "marqueeRight"} ${60 + i * 10}s linear infinite`,
            willChange: "transform",
            contain: "layout style",
          }}
        >
          {/* Duplicate block for seamless loop */}
          {[...wordBlock, ...wordBlock].map((w, wi) => (
            <span key={wi} style={{ marginRight: "10vw" }}>
              {w}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
});

/* ─────────────────── HOME SECTION (Unique Full-Width Design) ─────────────────── */
const HomeSection = memo(function HomeSection({ setActive, profile, mobile, tablet }) {
  const statsItems = [
    { icon: "🎓", label: "B.Sc CGPA", value: profile?.stats?.cgpa || "8.0" },
    { icon: "📁", label: "Projects Built", value: profile?.stats?.projects || "5+" },
    { icon: "💼", label: "Internship", value: profile?.stats?.internship || "1" },
    { icon: "⚛️", label: "React.js", value: "Expert" },
    { icon: "🐍", label: "Python", value: "Strong" },
    { icon: "🚀", label: "Full Stack", value: "Ready" },
  ];

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        background: "#FDF8F0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Soft background glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,155,45,0.10) 0%, transparent 70%)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(30px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

    {/* Floating circular developer icons */}
{!mobile && (
  <>
    {/* Top Left */}
    <motion.div
      animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        top: "16%",
        left: "7%",
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#FFFFFF",
        border: "1px solid #E7E5E4",
        boxShadow: "0 8px 24px rgba(28,25,23,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        color: "#E89B2D",
        zIndex: 0,
        opacity: 0.9,
      }}
    >
      {"</>"}
    </motion.div>

    {/* Top Right */}
    <motion.div
      animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      style={{
        position: "absolute",
        top: "22%",
        right: "9%",
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "#FFFFFF",
        border: "1px solid #E7E5E4",
        boxShadow: "0 8px 24px rgba(28,25,23,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        zIndex: 0,
        opacity: 0.9,
      }}
    >
      ⚡
    </motion.div>

    {/* Bottom Left */}
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
      transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      style={{
        position: "absolute",
        bottom: "26%",
        left: "11%",
        width: 50,
        height: 50,
        borderRadius: "50%",
        background: "#FFFFFF",
        border: "1px solid #E7E5E4",
        boxShadow: "0 8px 24px rgba(28,25,23,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        zIndex: 0,
        opacity: 0.9,
      }}
    >
      💻
    </motion.div>

    {/* Bottom Right */}
    <motion.div
      animate={{ y: [0, 11, 0], rotate: [0, -6, 0] }}
      transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
      style={{
        position: "absolute",
        bottom: "20%",
        right: "12%",
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "#FFFFFF",
        border: "1px solid #E7E5E4",
        boxShadow: "0 8px 24px rgba(28,25,23,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        zIndex: 0,
        opacity: 0.9,
      }}
    >
      🔧
    </motion.div>
  </>
)}

      <Section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: mobile ? "40px 20px 24px" : "40px 48px 20px",
          position: "relative",
          zIndex: 1,
          background: "transparent",
        }}
      >
        {/* Greeting */}
        <FadeIn delay={0.1}>
          <div
            className="cursive"
            style={{
              fontSize: "clamp(22px, 2.6vw, 28px)",
              color: "#57534E",
              marginBottom: 10,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Hy! I Am
          </div>
        </FadeIn>

        {/* LARGE CENTERED NAME – Full width presence */}
        <FadeIn delay={0.2}>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(52px, 9vw, 110px)",
              fontWeight: 700,
              color: "#E89B2D",
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
              marginBottom: 20,
              textAlign: "center",
              width: "100%",
            }}
          >
            {profile?.name?.split(" ")[0] || "Mithun"}
          </h1>
        </FadeIn>

        {/* Typing line */}
        <FadeIn delay={0.3}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(18px, 2.4vw, 26px)",
              color: "#57534E",
              marginBottom: 24,
              minHeight: "1.4em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              textAlign: "center",
            }}
          >
            I build
            <span style={{ color: "#10B981", fontWeight: 600 }}>
              <TypingText phrases={profile?.phrases || DEFAULT_PROFILE.phrases} />
            </span>
          </div>
        </FadeIn>

        {/* Description */}
        <FadeIn delay={0.4}>
          <p
            style={{
              maxWidth: 580,
              fontSize: mobile ? 14.5 : 16,
              lineHeight: 1.75,
              color: "#78716C",
              marginBottom: 36,
              textAlign: "center",
              padding: "0 8px",
            }}
          >
            {profile?.description || DEFAULT_PROFILE.description}
          </p>
        </FadeIn>

        {/* Buttons */}
        <FadeIn delay={0.5}>
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 48,
            }}
          >
            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: "0 12px 32px rgba(232,155,45,0.35)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive("projects")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #E89B2D 0%, #D97706 100%)",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14.5,
                fontWeight: 600,
                color: "#1C1917",
              }}
            >
              View Projects <FiArrowRight size={16} />
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.04,
                borderColor: "#E89B2D",
                color: "#D97706",
                background: "rgba(232,155,45,0.08)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive("contact")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                borderRadius: 14,
                background: "transparent",
                border: "1.5px solid #E7E5E4",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14.5,
                fontWeight: 500,
                color: "#57534E",
                transition: "all 0.25s ease",
              }}
            >
              Contact Me
            </motion.button>
          </div>
        </FadeIn>
      </Section>

    {/* ───────────── RUNNING SKILLS MARQUEE ───────────── */}
<div
  style={{
    position: "relative",
    zIndex: 2,
    borderTop: "1px solid #E7E5E4",
    background: "linear-gradient(90deg, #FFF7ED 0%, #FFFFFF 50%, #FFF7ED 100%)",
    padding: "22px 0",
    overflow: "hidden",
  }}
>
  <motion.div
    animate={{ x: ["0%", "-50%"] }}
    transition={{
      duration: 36,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{
      display: "flex",
      gap: 52,
      width: "max-content",
      whiteSpace: "nowrap",
      alignItems: "center",
    }}
  >
    {[
      { Icon: SiReact, name: "React.js", color: "#61DAFB" },
      { Icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
      { Icon: SiPython, name: "Python", color: "#3776AB" },
      { Icon: SiFastapi, name: "FastAPI", color: "#009688" },
      { Icon: SiMongodb, name: "MongoDB", color: "#47A248" },
      { Icon: SiNodedotjs, name: "Node.js", color: "#339933" },
      { Icon: SiFramer, name: "Framer Motion", color: "#0055FF" },
      { Icon: SiGit, name: "Git", color: "#F05032" },
      { Icon: SiHtml5, name: "HTML5", color: "#E34F26" },
    
      { Icon: SiMysql, name: "MySQL", color: "#4479A1" },
      { Icon: SiFirebase, name: "Firebase", color: "#FFCA28" },
    ]
      .concat([
        { Icon: SiReact, name: "React.js", color: "#61DAFB" },
        { Icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
        { Icon: SiPython, name: "Python", color: "#3776AB" },
        { Icon: SiFastapi, name: "FastAPI", color: "#009688" },
        { Icon: SiMongodb, name: "MongoDB", color: "#47A248" },
        { Icon: SiNodedotjs, name: "Node.js", color: "#339933" },
        { Icon: SiFramer, name: "Framer Motion", color: "#0055FF" },
        { Icon: SiGit, name: "Git", color: "#F05032" },
        { Icon: SiHtml5, name: "HTML5", color: "#E34F26" },
       
        { Icon: SiMysql, name: "MySQL", color: "#4479A1" },
        { Icon: SiFirebase, name: "Firebase", color: "#FFCA28" },
      ])
      .map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 18px",
            borderRadius: 40,
            background: "#FFFFFF",
            border: "1px solid #E7E5E4",
            boxShadow: "0 4px 14px rgba(28,25,23,0.05)",
          }}
        >
          <item.Icon size={22} color={item.color} />
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#1C1917",
              letterSpacing: "-0.01em",
            }}
          >
            {item.name}
          </span>
        </div>
      ))}
  </motion.div>
</div>
    </div>
  );
});

/* ─────────────────── ABOUT SECTION (Experience first) ─────────────────── */
const AboutSection = memo(function AboutSection({ profile, mobile }) {
  const education = [
    {
      degree: "Master of Computer Applications (MCA)",
      year: "2024 – 2026",
      college: "Sri Ramakrishna Mission Vidyalaya College",
      location: "Coimbatore",
      cgpa: "7.4",
    },
    {
      degree: "B.Sc Computer Science",
      year: "2021 – 2024",
      college: "Sri Ramakrishna Mission Vidyalaya College",
      location: "Coimbatore",
      cgpa: "8.0",
    },
  ];

  const experience = [
    {
      role: "Software Developer",
      company: "BEATS PRODUCTION PRIVATE LIMITED",
      period: "May 2026 – Present",
      location: "Bengaluru, Karnataka",
      points: [
        "Building full-stack business applications with React.js + Python/FastAPI + MongoDB",
        "Architecting reusable components for event, client & employee management",
        "Developing secure REST APIs for quotations, invoices & workflow automation",
        "Exploring Generative AI (Gemini API) for natural language features",
      ],
    },
    {
      role: "Frontend Developer Intern",
      company: "CTRL-NEXT TECHNOLOGIES",
      period: "July 2024 – March 2026",
      location: "Coimbatore, Tamil Nadu",
      points: [
        "Built responsive React.js components and dashboards using modern JavaScript",
        "Integrated REST APIs to power dynamic interfaces and automate workflows",
        "Collaborated with designers & backend developers across the full SDLC",
        "Participated in code reviews and functional testing",
      ],
    },
  ];

  return (
    <Section style={{ background: "#FDF8F0" }}>
      {/* Title */}
      <FadeIn>
        <div style={{ marginBottom: 12 }}>
          <span
            className="cursive"
            style={{
              fontSize: 28,
              color: "#E89B2D",
              display: "block",
              marginBottom: 4,
            }}
          >
            A little about me
          </span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(32px, 4vw, 42px)",
              fontWeight: 700,
              color: "#1C1917",
              letterSpacing: "-0.03em",
            }}
          >
            About Me
          </h2>
        </div>
      </FadeIn>

      {/* ───── Experience (Top) ───── */}
      <FadeIn delay={0.15}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <FiBriefcase size={18} color="#E89B2D" />
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: "#1C1917",
            }}
          >
            Experience
          </h3>
        </div>
      </FadeIn>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginBottom: 52,
        }}
      >
        {experience.map((exp, i) => (
          <FadeIn key={i} delay={0.2 + i * 0.1}>
            <motion.div
              whileHover={{ y: -3 }}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E7E5E4",
                borderRadius: 20,
                padding: "24px 26px",
                boxShadow: "0 6px 24px rgba(28,25,23,0.05)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: "#1C1917",
                      marginBottom: 4,
                    }}
                  >
                    {exp.role}
                  </h4>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#E89B2D",
                      fontWeight: 500,
                    }}
                  >
                    {exp.company}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontFamily: "'Fira Code', monospace",
                      color: "#57534E",
                      marginBottom: 2,
                    }}
                  >
                    {exp.period}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#A8A29E" }}>
                    {exp.location}
                  </div>
                </div>
              </div>

              {/* Points */}
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                }}
              >
                {exp.points.map((point, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: 14,
                      color: "#57534E",
                      lineHeight: 1.55,
                    }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          </FadeIn>
        ))}
      </div>

      {/* ───── Education (Below) ───── */}
      <FadeIn delay={0.35}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <FiBookOpen size={18} color="#E89B2D" />
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: "#1C1917",
            }}
          >
            Education
          </h3>
        </div>
      </FadeIn>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
          gap: 18,
        }}
      >
        {education.map((edu, i) => (
          <FadeIn key={i} delay={0.4 + i * 0.08}>
            <motion.div
              whileHover={{ y: -4 }}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E7E5E4",
                borderRadius: 18,
                padding: "22px 24px",
                boxShadow: "0 6px 24px rgba(28,25,23,0.05)",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "'Fira Code', monospace",
                    color: "#E89B2D",
                    background: "rgba(232,155,45,0.1)",
                    padding: "4px 10px",
                    borderRadius: 20,
                  }}
                >
                  {edu.year}
                </span>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#2563EB",
                  }}
                >
                  {edu.cgpa}
                </span>
              </div>

              <h4
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#1C1917",
                  marginBottom: 6,
                  lineHeight: 1.35,
                }}
              >
                {edu.degree}
              </h4>
              <p style={{ fontSize: 13.5, color: "#78716C", marginBottom: 2 }}>
                {edu.college}
              </p>
              <p style={{ fontSize: 13, color: "#A8A29E" }}>{edu.location}</p>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
});

/* ─────────────────── PROJECTS SECTION ─────────────────── */
/* ─────────────────── PROJECT CARD (Themed UI) ─────────────────── */
const ProjectCard = memo(function ProjectCard({ project, i }) {
  return (
    <FadeIn delay={i * 0.08}>
      <motion.div
        whileHover={{
          y: -6,
          boxShadow: "0 20px 40px rgba(28,25,23,0.1)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{
          borderRadius: 18,
          overflow: "hidden",
          background: "#FFFFFF",
          border: "1px solid #E7E5E4",
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Card header */}
        <div
          style={{
            height: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: project.image_url
              ? "none"
              : `linear-gradient(135deg, ${project.color}18, ${project.color}08)`,
            fontSize: 52,
            borderBottom: "1px solid #F5F5F4",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              loading="lazy"
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          ) : (
            <>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at 70% 30%, ${project.color}22, transparent 60%)`,
                }}
              />
              <span style={{ position: "relative", zIndex: 1 }}>
                {project.emoji || "🚀"}
              </span>
            </>
          )}
        </div>

        {/* Card body */}
        <div
          style={{
            padding: "22px 22px 24px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 17,
                fontWeight: 600,
                color: "#1C1917",
                lineHeight: 1.3,
              }}
            >
              {project.title}
            </h3>
            <FiGrid size={14} color="#A8A29E" />
          </div>

          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.65,
              color: "#78716C",
              marginBottom: 16,
              flex: 1,
            }}
          >
            {project.description}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 20,
            }}
          >
            {Array.isArray(project.tags) &&
              project.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: `${project.color}12`,
                    border: `1px solid ${project.color}30`,
                    fontSize: 11,
                    color: project.color,
                    fontFamily: "'Fira Code', monospace",
                  }}
                >
                  {tag}
                </span>
              ))}
          </div>

          <motion.a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, background: project.color + "22" }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "12px",
              borderRadius: 12,
              background: project.color + "14",
              border: `1px solid ${project.color}40`,
              color: project.color,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            View Project <FiExternalLink size={15} />
          </motion.a>
        </div>
      </motion.div>
    </FadeIn>
  );
});

/* ─────────────────── PROJECTS SECTION (Themed UI) ─────────────────── */
const ProjectsSection = memo(function ProjectsSection({ projects, mobile }) {
  const [activeTab, setActiveTab] = useState("Software");
  const filtered = projects.filter((p) => p.cat === activeTab);

  return (
    <Section style={{ background: "#FDF8F0" }}>
      <FadeIn>
        {/* Title */}
        <div style={{ marginBottom: 8 }}>
          <span
            className="cursive"
            style={{
              fontSize: 26,
              color: "#E89B2D",
              display: "block",
              marginBottom: 4,
            }}
          >
            Selected work
          </span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(32px, 4vw, 42px)",
              fontWeight: 700,
              color: "#1C1917",
              letterSpacing: "-0.03em",
            }}
          >
            Projects
          </h2>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 28,
            marginBottom: 36,
          }}
        >
          {["Software", "Website"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 24px",
                borderRadius: 12,
                border: "1.5px solid",
                borderColor: activeTab === tab ? "#E89B2D" : "#E7E5E4",
                background: activeTab === tab ? "#E89B2D" : "#FFFFFF",
                color: activeTab === tab ? "#1C1917" : "#57534E",
                fontSize: 14,
                fontWeight: activeTab === tab ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.25s ease",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {tab}s
            </button>
          ))}
        </div>
      </FadeIn>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: 28,
          }}
        >
          {filtered.map((p, i) => (
            <ProjectCard key={p.title} project={p} i={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
});

/* ─────────────────── SKILL CARD (Themed) ─────────────────── */
const SkillCard = memo(function SkillCard({ skill, i }) {
  return (
    <FadeIn delay={i * 0.05} y={10}>
      <motion.div
        whileHover={{
          y: -4,
          boxShadow: "0 10px 24px rgba(28,25,23,0.08)",
        }}
        style={{
          padding: "14px 18px",
          borderRadius: 14,
          background: "#FFFFFF",
          border: "1px solid #E7E5E4",
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "default",
          transition: "all 0.25s ease",
        }}
      >
        {/* Color dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: skill.color,
            flexShrink: 0,
            boxShadow: `0 0 0 3px ${skill.color}22`,
          }}
        />
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#1C1917",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {skill.name}
        </span>
      </motion.div>
    </FadeIn>
  );
});

/* ─────────────────── SKILLS SECTION (Themed) ─────────────────── */
const SkillsSection = memo(function SkillsSection({ skills }) {
  const cats = ["Frontend", "Backend", "Mobile"];
  const tools = [
    "Git",
    "GitHub",
    "VS Code",
    "Postman",
    "Firebase",
    "MySQL",
    "MongoDB",
    "Node.js",
  ];

  return (
    <Section style={{ background: "#FDF8F0" }}>
      {/* Title */}
      <FadeIn>
        <div style={{ marginBottom: 8 }}>
          <span
            className="cursive"
            style={{
              fontSize: 26,
              color: "#E89B2D",
              display: "block",
              marginBottom: 4,
            }}
          >
            What I work with
          </span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(32px, 4vw, 42px)",
              fontWeight: 700,
              color: "#1C1917",
              letterSpacing: "-0.03em",
            }}
          >
            Skills
          </h2>
        </div>
      </FadeIn>

      <div style={{ display: "grid", gap: 36, marginTop: 40 }}>
        {cats.map((cat, ci) => (
          <div key={cat}>
            <FadeIn delay={ci * 0.08}>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#E89B2D",
                  marginBottom: 16,
                  fontFamily: "'Fira Code', monospace",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontWeight: 500,
                }}
              >
                {cat}
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "rgba(232,155,45,0.2)",
                  }}
                />
              </div>
            </FadeIn>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 12,
              }}
            >
              {skills
                .filter((s) => s.cat === cat)
                .map((s, i) => (
                  <SkillCard key={s.name} skill={s} i={i} />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tools */}
      <FadeIn delay={0.4}>
        <div style={{ marginTop: 52 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#E89B2D",
              marginBottom: 18,
              fontFamily: "'Fira Code', monospace",
              fontWeight: 500,
            }}
          >
            Tools & Development
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {tools.map((t) => (
              <motion.span
                key={t}
                whileHover={{
                  y: -3,
                  background: "#E89B2D",
                  color: "#1C1917",
                  borderColor: "#E89B2D",
                }}
                style={{
                  padding: "9px 18px",
                  borderRadius: 12,
                  background: "#FFFFFF",
                  border: "1px solid #E7E5E4",
                  fontSize: 13,
                  color: "#57534E",
                  fontWeight: 500,
                  cursor: "default",
                  transition: "all 0.2s ease",
                }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </FadeIn>
    </Section>
  );
});

/* ─────────────────── CONTACT SECTION (Themed UI) ─────────────────── */
const ContactSection = memo(function ContactSection({ profile, mobile, medDesktop }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (form.name && form.email && form.message) {
      setSent(true);

      try {
        const { error: dbError } = await supabase.from("contacts").insert([
          {
            name: form.name,
            email: form.email,
            message: form.message,
          },
        ]);

        if (dbError) {
          console.error("Database storage error:", dbError);
        }

        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (
          serviceId &&
          templateId &&
          publicKey &&
          serviceId !== "your_service_id"
        ) {
          await emailjs.send(
            serviceId,
            templateId,
            {
              from_name: form.name,
              from_email: form.email,
              message: form.message,
              to_name: profile?.name || "Mithun",
            },
            publicKey,
          );
        }
      } catch (err) {
        console.error("Submission process failed:", err);
      }

      setTimeout(() => {
        setSent(false);
        setForm({ name: "", email: "", message: "" });
      }, 3500);
    }
  };

  const inputStyle = (focused) => ({
    display: "block",
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    background: "#FFFFFF",
    border: `1.5px solid ${focused ? "#E89B2D" : "#E7E5E4"}`,
    fontSize: 14.5,
    color: "#1C1917",
    transition: "border-color 0.25s",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
  });

  return (
    <Section style={{ background: "#FDF8F0" }}>
      {/* Title */}
      <FadeIn>
        <div style={{ marginBottom: 8 }}>
          <span
            className="cursive"
            style={{
              fontSize: 26,
              color: "#E89B2D",
              display: "block",
              marginBottom: 4,
            }}
          >
            Let's talk
          </span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(32px, 4vw, 42px)",
              fontWeight: 700,
              color: "#1C1917",
              letterSpacing: "-0.03em",
            }}
          >
            Contact
          </h2>
        </div>
      </FadeIn>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: medDesktop ? "1fr" : "1fr 1fr",
          gap: mobile ? 40 : 56,
          marginTop: 40,
          alignItems: "start",
        }}
      >
        {/* Left – Info + Social */}
        <FadeIn delay={0.1}>
          {/* <p
            style={{
              fontSize: 15.5,
              lineHeight: 1.8,
              color: "#57534E",
              marginBottom: 36,
            }}
          >
            Have a project in mind, a question, or just want to say hello? My
            inbox is always open — I'll try to get back within 24 hours.
          </p> */}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                Icon: FiGithub,
                label: "GitHub",
                sub: "github.com/MITHU-SAJU",
                href: "https://github.com/MITHU-SAJU",
                color: "#1C1917",
              },
              {
                Icon: FiLinkedin,
                label: "LinkedIn",
                sub: "linkedin.com/in/mithun-t-m",
                href: "https://linkedin.com/in/mithun-t-m",
                color: "#0A66C2",
              },
              {
                Icon: FaWhatsapp,
                label: "WhatsApp",
                sub: "+91 85248 22544",
                href: "https://wa.me/918524822544",
                color: "#25D366",
              },
              {
                Icon: FiMail,
                label: "Email",
                sub: profile?.email || "mithuntm25@gmail.com",
                href: `mailto:${profile?.email || "mithuntm25@gmail.com"}`,
                color: "#E89B2D",
              },
            ].map(({ Icon, label, sub, href, color }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 18px",
                  borderRadius: 14,
                  background: "#FFFFFF",
                  border: "1px solid #E7E5E4",
                  textDecoration: "none",
                  color: "#1C1917",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#A8A29E",
                      marginTop: 2,
                    }}
                  >
                    {sub}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </FadeIn>

        {/* Right – Form */}
        <FadeIn delay={0.2}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  textAlign: "center",
                  padding: "60px 32px",
                  borderRadius: 20,
                  border: "1.5px solid #E89B2D",
                  background: "rgba(232,155,45,0.08)",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "#1C1917",
                  }}
                >
                  Message Sent!
                </div>
                <div
                  style={{
                    fontSize: 14.5,
                    color: "#78716C",
                    marginTop: 8,
                  }}
                >
                  I'll get back to you soon.
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  background: "#FFFFFF",
                  border: "1px solid #E7E5E4",
                  borderRadius: 20,
                  padding: "28px 24px",
                }}
              >
                {["name", "email"].map((field) => (
                  <FocusInput
                    key={field}
                    field={field}
                    form={form}
                    setForm={setForm}
                    inputStyle={inputStyle}
                  />
                ))}
                <FocusTextarea
                  form={form}
                  setForm={setForm}
                  inputStyle={inputStyle}
                />
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 28px rgba(232,155,45,0.3)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "15px",
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #E89B2D, #D97706)",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14.5,
                    fontWeight: 600,
                    color: "#1C1917",
                    marginTop: 4,
                  }}
                >
                  Send Message <FiSend size={15} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>
    </Section>
  );
});

function FocusInput({ field, form, setForm, inputStyle }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
      value={form[field]}
      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={inputStyle(focused)}
    />
  );
}

function FocusTextarea({ form, setForm, inputStyle }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      placeholder="Your message…"
      value={form.message}
      onChange={(e) => setForm({ ...form, message: e.target.value })}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      rows={5}
      style={{
        ...inputStyle(focused),
        resize: "vertical",
        minHeight: 120,
      }}
    />
  );
}

/* ─────────────────── SECTION TITLE ─────────────────── */
function SectionTitle({ children }) {
  return (
    <div>
      <h2
        style={{
          fontFamily: "'Space Grotesk',serif",
          fontSize: "clamp(32px,4vw,52px)",
          fontWeight: 700,
          color: "#f8fafc",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
        }}
      >
        {children}
      </h2>
      <div
        style={{
          width: 40,
          height: 3,
          background: "linear-gradient(90deg,#10B981,transparent)",
          marginTop: 12,
          borderRadius: 4,
        }}
      />
    </div>
  );
}

/* ─────────────────── ROOT APP ─────────────────── */
export default function Portfolio() {
  const [active, setActive] = useState("home");
  const { mobile, tablet, medDesktop } = useResponsive();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  // Debounced fetch to prevent triple-fetching on realtime events
  const fetchDataCore = useCallback(async () => {
    const { data: prof } = await supabase.from("profile").select("*").single();
    if (prof) setProfile(prof);

    const { data: projs } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (projs) setProjects(projs);

    const { data: skls } = await supabase
      .from("skills")
      .select("*")
      .order("cat", { ascending: true });
    if (skls) setSkills(skls);
  }, []);

  const fetchDataDebounced = useMemo(
    () => debounce(fetchDataCore, 300),
    [fetchDataCore],
  );

  useEffect(() => {
    fetchDataCore(); // Initial fetch immediately

    // Realtime subscriptions — debounced
    const projectSub = supabase
      .channel("public:projects")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        fetchDataDebounced,
      )
      .subscribe();
    const skillSub = supabase
      .channel("public:skills")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "skills" },
        fetchDataDebounced,
      )
      .subscribe();
    const profileSub = supabase
      .channel("public:profile")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profile" },
        fetchDataDebounced,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectSub);
      supabase.removeChannel(skillSub);
      supabase.removeChannel(profileSub);
    };
  }, [fetchDataCore, fetchDataDebounced]);

  const sideW = mobile ? 0 : 220;

  // Memoized section content to avoid re-creating on every render
  const sectionContent = useMemo(() => {
    const props = { setActive, profile, projects, skills, mobile, tablet, medDesktop };
    switch (active) {
      case "home": return <HomeSection {...props} />;
      case "about": return <AboutSection {...props} />;
      case "projects": return <ProjectsSection {...props} />;
      case "skills": return <SkillsSection {...props} />;
      case "contact": return <ContactSection {...props} />;
      default: return <HomeSection {...props} />;
    }
  }, [active, profile, projects, skills, mobile, tablet, medDesktop, setActive]);

  return (
    <>
      <FloatingOrbs />

      <Sidebar
        active={active}
        setActive={setActive}
        mobile={mobile}
        profile={profile}
      />

      {/* Main content area */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: mobile ? 64 : 0,
          left: sideW,
          zIndex: 10,
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", width: "100%", willChange: "transform, opacity" }}
          >
            {sectionContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
