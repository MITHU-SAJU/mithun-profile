import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiHome, FiUser, FiGrid, FiZap, FiMail,
  FiGithub, FiLinkedin, FiExternalLink, FiSend,
  FiArrowRight, FiCode, FiLayers, FiCpu,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";import emailjs from '@emailjs/browser';
import { supabase } from "./supabaseClient";

/* ─────────────────── GLOBAL STYLES ─────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@200;300;400;500;600&family=Fira+Code:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100vw; height: 100vh;
    overflow: hidden;
    background: #020617;
    color: #f8fafc;
    font-family: 'Inter', sans-serif;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.4); }

  ::selection { background: rgba(16, 185, 129, 0.3); color: #fff; }

  input, textarea {
    font-family: 'Inter', sans-serif;
    background: none; border: none; outline: none;
    color: #f8fafc;
  }

  h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; }
`;

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
  title: "Frontend Developer",
  description: "Frontend Developer with hands-on experience building scalable web applications. Specialized in React.js, JavaScript, and modern CSS to create user-friendly digital experiences with clean UI/UX.",
  email: "mithunmano0001@gmail.com",
  location: "Coimbatore, India",
  phrases: ["modern web apps.", "responsive UIs.", "seamless experiences.", "React solutions."],
  stats: { cgpa: "8.0", projects: "10+", internship: "1" }
};

const TIMELINE = [
  { year: "2024–Pres.", title: "Software & Frontend Developer Intern", place: "CTRL-NEXT TECHNOLOGIES", description: "Developing responsive UI modules using React.js and modern CSS. Built reusable components and integrated REST APIs for dashboards and workflows." },
  { year: "2024–2026", title: "Master of Computer Applications (MCA)", place: "SRMV College, Coimbatore", description: "Pursuing higher education in computer applications to deepen technical expertise." },
  { year: "2021–2024", title: "Bachelor of Science (Computer Science)", place: "SRMV College, Coimbatore", description: "Graduated with 8.0 CGPA. Gained strong foundation in software development and CS fundamentals." },
];

/* ─────────────────── FLOATING ORBS ─────────────────── */
function FloatingOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Stardust particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.5, 1], y: [0, -100, 0] }}
          transition={{ duration: 10 + Math.random() * 20, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
          style={{
            position: "absolute",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            background: i % 2 === 0 ? "#10B981" : "#3B82F6",
            borderRadius: "50%",
            filter: "blur(0.5px)",
            opacity: 0.3,
          }}
        />
      ))}

      {[
        { size: 520, top: "10%", left: "-10%", color: "rgba(16,185,129,0.08)", delay: 0 },
        { size: 380, top: "55%", left: "70%", color: "rgba(59,130,246,0.07)", delay: 3 },
        { size: 280, top: "5%", left: "65%", color: "rgba(6,182,212,0.07)", delay: 6 },
        { size: 200, top: "75%", left: "20%", color: "rgba(16,185,129,0.06)", delay: 9 },
      ].map((o, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -40, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "easeInOut", delay: o.delay }}
          style={{
            position: "absolute",
            width: o.size, height: o.size,
            top: o.top, left: o.left,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />
      ))}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />
    </div>
  );
}

/* ─────────────────── SIDEBAR NAV ─────────────────── */
function Sidebar({ active, setActive, mobile, profile }) {
  if (mobile) {
    // Bottom nav for mobile
    return (
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(8,10,15,0.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(212,175,95,0.12)",
        display: "flex", alignItems: "center", justifyContent: "space-around",
        height: 64, padding: "0 8px",
      }}>
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => setActive(id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "6px 12px", borderRadius: 12, border: "none",
                background: isActive ? "rgba(212,175,95,0.12)" : "transparent",
                color: isActive ? "#d4af5f" : "rgba(232,226,217,0.45)",
                cursor: "pointer", transition: "all 0.25s ease",
                fontSize: 9, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
                fontFamily: "'Outfit', sans-serif",
              }}>
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav style={{
      position: "fixed", left: 0, top: 0, bottom: 0, width: 220, zIndex: 100,
      background: "rgba(8,10,15,0.75)",
      backdropFilter: "blur(24px)",
      borderRight: "1px solid rgba(212,175,95,0.1)",
      display: "flex", flexDirection: "column",
      padding: "40px 20px 32px",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 24, fontWeight: 700, color: "#10B981",
          letterSpacing: "-0.03em", lineHeight: 1,
        }}>
          {profile?.name || "Mithun T M"}
        </div>
        <div style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 9, color: "rgba(16,185,129,0.6)",
          letterSpacing: "0.1em", marginTop: 8, textTransform: "uppercase",
        }}>
          {profile?.title || "Frontend Developer"}
        </div>
      </div>

      {/* Nav items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <motion.button
              key={id}
              onClick={() => setActive(id)}
              whileHover={{ x: 4 }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 16px", borderRadius: 12,
                border: "none", cursor: "pointer",
                background: isActive ? "rgba(16,185,129,0.1)" : "transparent",
                color: isActive ? "#10B981" : "rgba(248,250,252,0.45)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                letterSpacing: "0.01em",
                transition: "color 0.2s, background 0.2s",
                position: "relative", textAlign: "left",
              }}>
              {isActive && (
                <motion.div layoutId="nav-pill"
                  style={{
                    position: "absolute", inset: 0, borderRadius: 12,
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.2)",
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 32 }}
                />
              )}
              <Icon size={16} style={{ position: "relative" }} />
              <span style={{ position: "relative" }}>{label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Social icons */}
      <div style={{ display: "flex", gap: 14, paddingTop: 24, borderTop: "1px solid rgba(16,185,129,0.1)" }}>
        {[
          { Icon: FiGithub, href: "https://github.com/MITHU-SAJU" },
          { Icon: FiLinkedin, href: "https://linkedin.com/in/mithun-t-m" },
          { Icon: FaWhatsapp, href: "https://wa.me/918524822544" },
        ].map(({ Icon, href }, i) => (
          <motion.a key={i} href={href} target="_blank" rel="noopener noreferrer" whileHover={{ y: -2, color: "#10B981" }}
            style={{ color: "rgba(248,250,252,0.35)", transition: "color 0.2s" }}>
            <Icon size={18} />
          </motion.a>
        ))}
      </div>
    </nav>
  );
}

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
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 70);
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
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>_</motion.span>
    </span>
  );
}

/* ─────────────────── SECTION WRAPPER ─────────────────── */
function Section({ children, style }) {
  return (
    <div style={{
      height: "100%", overflowY: "auto", overflowX: "hidden",
      padding: "48px 52px 48px",
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────── FADE IN VIEW ─────────────────── */
function FadeIn({ children, delay = 0, y = 24, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      style={style}>
      {children}
    </motion.div>
  );
}

/* ─────────────────── MARQUEE TEXT ─────────────────── */
function MarqueeText({ profile }) {
  const words = [profile?.name?.toUpperCase() || "MITHUN T M", profile?.title?.toUpperCase() || "FRONTEND DEVELOPER", "UI/UX DESIGNER", "REACT EXPERT", "MOBILE APPS"];
  return (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "10vh 0", opacity: 0.04, zIndex: 0, userSelect: "none"
    }}>
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          animate={{ x: i % 2 === 0 ? [0, -1000] : [-1000, 0] }}
          transition={{ duration: 60 + i * 10, repeat: Infinity, ease: "linear" }}
          style={{
            fontSize: "12vh", fontWeight: 900, whiteSpace: "nowrap",
            fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.2em",
            color: "#fff",
          }}
        >
          {Array(10).fill(words).flat().map((w, wi) => (
            <span key={wi} style={{ marginRight: "10vw" }}>{w}</span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────── HOME SECTION ─────────────────── */
function HomeSection({ setActive, profile }) {
  return (
    <div style={{ position: "relative", height: "100%", width: "100%", overflow: "hidden" }}>
      <MarqueeText profile={profile} />
      <Section style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: window.innerWidth < 768 ? "0 24px" : "0 60px",
        position: "relative", zIndex: 1, background: "transparent"
      }}>
        <FadeIn delay={0.1}>
          <div style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(16,185,129,0.6)", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 10,
          }}>

          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(52px, 6vw, 88px)",
            fontWeight: 700, lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "#f8fafc",
            marginBottom: 12,
          }}>
            {profile?.name || "Mithun T M"}
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(22px, 3vw, 36px)",
            fontWeight: 400, color: "rgba(248,250,252,0.6)",
            marginBottom: 28,
            minHeight: "1.3em",
          }}>
            I build&nbsp;
            <TypingText phrases={profile?.phrases || DEFAULT_PROFILE.phrases} />
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p style={{
            maxWidth: 520, fontSize: 15.5, lineHeight: 1.75,
            color: "rgba(248,250,252,0.52)", marginBottom: 44,
            fontWeight: 300,
          }}>
            {profile?.description || DEFAULT_PROFILE.description}
          </p>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 32px rgba(16,185,129,0.3)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive("projects")}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "14px 28px", borderRadius: 14,
                background: "linear-gradient(135deg,#10B981,#059669)",
                border: "none", cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14, fontWeight: 600, color: "#020617",
                letterSpacing: "0.02em",
              }}>
              View Projects <FiArrowRight size={15} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, borderColor: "rgba(16,185,129,0.6)", color: "#10B981" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive("contact")}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "14px 28px", borderRadius: 14,
                background: "transparent",
                border: "1px solid rgba(16,185,129,0.2)", cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14, fontWeight: 400, color: "rgba(248,250,252,0.7)",
                transition: "all 0.25s ease",
              }}>
              Contact Me
            </motion.button>
          </div>
        </FadeIn>

        {/* Stats row */}
        <FadeIn delay={0.7}>
          <div style={{
            display: "flex", gap: 40, marginTop: 64,
            paddingTop: 40, borderTop: "1px solid rgba(212,175,95,0.1)",
            flexWrap: "wrap",
          }}>
            {[
              { num: profile?.stats?.cgpa || "8.0", label: "B.Sc CGPA" },
              { num: profile?.stats?.projects || "10+", label: "Projects Built" },
              { num: profile?.stats?.internship || "1", label: "Internship" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: label.includes("CGPA") ? "#3B82F6" : "#10B981", lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: 12, color: "rgba(248,250,252,0.4)", marginTop: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}

/* ─────────────────── ABOUT SECTION ─────────────────── */
function AboutSection({ profile }) {
  return (
    <Section>
      <FadeIn>
        <SectionTitle>About Me</SectionTitle>
      </FadeIn>

      <div style={{
        display: "grid",
        gridTemplateColumns: window.innerWidth < 992 ? "1fr" : "1fr 1.2fr",
        gap: window.innerWidth < 768 ? 32 : 52,
        marginTop: 40, alignItems: "start"
      }}>
        {/* Left – Avatar + quick facts */}
        <FadeIn delay={0.1}>
          <div>
            {/* Avatar placeholder */}
            <div style={{
              width: "100%", aspectRatio: "3/2", borderRadius: 20,
              background: "linear-gradient(135deg, rgba(212,175,95,0.1), rgba(79,142,247,0.08))",
              border: "1px solid rgba(212,175,95,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 80, marginBottom: 32,
            }}>
              👨‍💻
            </div>
            {/* Quick facts */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Location", value: profile?.location || "Coimbatore, India" },
                { label: "Email", value: profile?.email || "mithunmano0001@gmail.com" },
                { label: "Education", value: "MCA Pursuing" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 16px", borderRadius: 12,
                  background: "rgba(16,185,129,0.04)",
                  border: "1px solid rgba(16,185,129,0.09)",
                }}>
                  <span style={{ fontSize: 11, color: "rgba(248,250,252,0.4)", fontFamily: "'Fira Code',monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
                  <span style={{ fontSize: 13, color: "#f8fafc", fontWeight: 400 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Right – Bio + timeline */}
        <FadeIn delay={0.2}>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: "rgba(248,250,252,0.65)", fontWeight: 300, marginBottom: 36 }}>
            {profile?.description || DEFAULT_PROFILE.description}
          </p>

          {/* Timeline */}
          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute", left: 54, top: 8, bottom: 8,
              width: 1, background: "linear-gradient(to bottom, rgba(16,185,129,0.4), rgba(16,185,129,0.05))",
            }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {TIMELINE.map(({ year, title, place, description }, i) => (
                <FadeIn key={i} delay={0.1 * i}>
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                    <div style={{ minWidth: 48, textAlign: "right" }}>
                      <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: "#10B981", opacity: 0.7 }}>{year}</span>
                    </div>
                    {/* Dot */}
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%", marginTop: 3, flexShrink: 0,
                      background: "#10B981", boxShadow: "0 0 10px rgba(16,185,129,0.5)",
                      border: "2px solid #020617", outline: "1px solid rgba(16,185,129,0.3)",
                    }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>{title}</div>
                      <div style={{ fontSize: 12, color: "rgba(16,185,129,0.8)", marginBottom: 4, fontWeight: 500 }}>{place}</div>
                      <div style={{ fontSize: 12.5, color: "rgba(248,250,252,0.45)", lineHeight: 1.6 }}>{description}</div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

/* ─────────────────── PROJECTS SECTION ─────────────────── */
function ProjectCard({ project, i }) {
  return (
    <FadeIn delay={i * 0.08}>
      <motion.div
        whileHover={{ y: -6, boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px ${project.color}22` }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{
          borderRadius: 18, overflow: "hidden",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid rgba(255,255,255,0.07)`,
          cursor: "pointer", height: "100%",
        }}>
        {/* Card header */}
        <div style={{
          height: 140, display: "flex", alignItems: "center", justifyContent: "center",
          background: project.image_url ? "none" : `linear-gradient(135deg, ${project.color}18, ${project.color}08)`,
          fontSize: 52,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          position: "relative", overflow: "hidden",
        }}>
          {project.image_url ? (
            <img src={project.image_url} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <>
              <div style={{
                position: "absolute", inset: 0,
                background: `radial-gradient(circle at 70% 30%, ${project.color}20, transparent 60%)`,
              }} />
              <span style={{ position: "relative", zIndex: 1 }}>{project.emoji || "🚀"}</span>
            </>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", height: "calc(100% - 140px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>
              {project.title}
            </h3>
            <FiGrid size={14} color="rgba(232,226,217,0.3)" />
          </div>

          <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(232,226,217,0.5)", marginBottom: 16, fontWeight: 300, flex: 1 }}>
            {project.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {Array.isArray(project.tags) && project.tags.map(tag => (
              <span key={tag} style={{
                padding: "3px 10px", borderRadius: 20,
                background: `${project.color}10`,
                border: `1px solid ${project.color}30`,
                fontSize: 10, color: project.color,
                fontFamily: "'Fira Code',monospace", letterSpacing: "0.02em",
              }}>{tag}</span>
            ))}
          </div>

          <motion.a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, background: project.color + "33" }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "12px",
              borderRadius: 12,
              background: project.color + "22",
              border: `1px solid ${project.color}44`,
              color: project.color,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
          >
            View Project <FiExternalLink size={15} />
          </motion.a>
        </div>
      </motion.div>
    </FadeIn>
  );
}

function ProjectsSection({ projects }) {
  const [activeTab, setActiveTab] = useState("Website");
  const filtered = projects.filter(p => p.cat === activeTab);

  return (
    <Section>
      <FadeIn>
        <SectionTitle>Projects</SectionTitle>
        <div style={{ display: "flex", gap: 12, marginTop: 28, marginBottom: 36 }}>
          {["Website", "Software"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 24px",
                borderRadius: 12,
                border: "1px solid",
                borderColor: activeTab === tab ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.08)",
                background: activeTab === tab ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.03)",
                color: activeTab === tab ? "#10B981" : "rgba(248, 250, 252, 0.5)",
                fontSize: 14,
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "'Inter', sans-serif"
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
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {filtered.map((p, i) => <ProjectCard key={p.title} project={p} i={i} />)}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

/* ─────────────────── SKILLS SECTION ─────────────────── */
function SkillCard({ skill, i }) {
  return (
    <FadeIn delay={i * 0.05} y={10}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02, borderColor: skill.color + "55", backgroundColor: skill.color + "08" }}
        style={{
          padding: "16px 24px",
          borderRadius: 16,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderLeft: `4px solid ${skill.color}`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "relative",
          overflow: "hidden",
          cursor: "default",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${skill.color}12 0%, transparent 100%)`,
          pointerEvents: "none",
        }} />
        <span style={{ fontSize: 14.5, fontWeight: 500, color: "#f8fafc", zIndex: 1, fontFamily: "'Inter', sans-serif" }}>{skill.name}</span>
      </motion.div>
    </FadeIn>
  );
}

function SkillsSection({ skills }) {
  const cats = ["Frontend", "Backend", "Mobile"];
  const tools = ["Git", "GitHub", "VS Code", "Postman", "Firebase", "MySQL", "MongoDB", "Node.js"];

  return (
    <Section>
      <FadeIn><SectionTitle>Skills</SectionTitle></FadeIn>

      <div style={{ display: "grid", gap: 32, marginTop: 40 }}>
        {cats.map((cat, ci) => (
          <div key={cat}>
            <FadeIn delay={ci * 0.08}>
              <div style={{
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(16,185,129,0.6)",
                marginBottom: 16,
                fontFamily: "'Fira Code', monospace",
                display: "flex",
                alignItems: "center",
                gap: 12
              }}>
                {cat}
                <div style={{ flex: 1, height: 1, background: "rgba(16,185,129,0.1)" }} />
              </div>
            </FadeIn>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: 12,
            }}>
              {skills.filter(s => s.cat === cat).map((s, i) => (
                <SkillCard key={s.name} skill={s} i={i} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tools row */}
      <FadeIn delay={0.4}>
        <div style={{ marginTop: 52 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(16,185,129,0.6)", marginBottom: 18, fontFamily: "'Fira Code',monospace" }}>
            Tools &amp; Development
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {tools.map((t, i) => (
              <motion.span key={t}
                whileHover={{ y: -2, background: "rgba(16,185,129,0.1)", color: "#10B981", borderColor: "rgba(16,185,129,0.3)" }}
                style={{
                  padding: "8px 18px", borderRadius: 12,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  fontSize: 11.5, color: "rgba(248,250,252,0.5)",
                  cursor: "default", transition: "all 0.2s",
                }}>
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}

function ContactSection({ profile }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (form.name && form.email && form.message) {
      setSent(true);
      
      try {
        // 1. Store contact message in Supabase database
        const { error: dbError } = await supabase.from('contacts').insert([{
          name: form.name,
          email: form.email,
          message: form.message
        }]);
        
        if (dbError) {
          console.error("Database storage error:", dbError);
        }

        // 2. Notify owner via EmailJS if configured
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (serviceId && templateId && publicKey && serviceId !== 'your_service_id') {
          await emailjs.send(
            serviceId,
            templateId,
            {
              from_name: form.name,
              from_email: form.email,
              message: form.message,
              to_name: profile?.name || "Mithun",
            },
            publicKey
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
    display: "block", width: "100%",
    padding: "14px 18px", borderRadius: 12,
    background: "rgba(255,255,255,0.035)",
    border: `1px solid ${focused ? "rgba(212,175,95,0.4)" : "rgba(255,255,255,0.08)"}`,
    fontSize: 14, color: "#e8e2d9",
    transition: "border-color 0.25s",
    fontFamily: "'Outfit',sans-serif",
  });

  return (
    <Section>
      <FadeIn><SectionTitle>Contact</SectionTitle></FadeIn>

      <div style={{
        display: "grid",
        gridTemplateColumns: window.innerWidth < 992 ? "1fr" : "1fr 1fr",
        gap: window.innerWidth < 768 ? 40 : 52,
        marginTop: 40, alignItems: "start"
      }}>
        {/* Left */}
        <FadeIn delay={0.1}>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(232,226,217,0.55)", fontWeight: 300, marginBottom: 36 }}>
            Have a project in mind, a question, or just want to say hello?
            My inbox is always open — I'll try to get back within 24 hours.
          </p>

          {/* Social */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { Icon: FiGithub, label: "GitHub", sub: "github.com/MITHU-SAJU", href: "https://github.com/MITHU-SAJU", color: "#fff" },
              { Icon: FiLinkedin, label: "LinkedIn", sub: "linkedin.com/in/mithun-t-m", href: "https://linkedin.com/in/mithun-t-m", color: "#00a0dc" },
              { Icon: FaWhatsapp, label: "WhatsApp", sub: "+91 85248 22544", href: "https://wa.me/918524822544", color: "#25d366" },
              { Icon: FiMail, label: "Email", sub: profile?.email || "mithunmano0001@gmail.com", href: `mailto:${profile?.email || "mithunmano0001@gmail.com"}`, color: "#10B981" },
            ].map(({ Icon, label, sub, href, color }) => (
              <motion.a key={label} href={href}
                whileHover={{ x: 4, color }}
                style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "14px 18px", borderRadius: 14,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  textDecoration: "none", color: "rgba(232,226,217,0.7)",
                  transition: "color 0.2s",
                }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 11.5, opacity: 0.5, marginTop: 1, fontFamily: "'DM Mono',monospace" }}>{sub}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </FadeIn>

        {/* Right – form */}
        <FadeIn delay={0.2}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="thanks"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  textAlign: "center", padding: "60px 32px",
                  borderRadius: 20, border: "1px solid rgba(62,207,142,0.25)",
                  background: "rgba(62,207,142,0.05)",
                }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: "#3ecf8e" }}>Message Sent!</div>
                <div style={{ fontSize: 13.5, color: "rgba(232,226,217,0.5)", marginTop: 8 }}>I'll get back to you soon.</div>
              </motion.div>
            ) : (
              <motion.div key="form" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {["name", "email"].map(field => (
                  <FocusInput key={field} field={field} form={form} setForm={setForm} inputStyle={inputStyle} />
                ))}
                <FocusTextarea form={form} setForm={setForm} inputStyle={inputStyle} />
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(16,185,129,0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    padding: "15px", borderRadius: 14,
                    background: "linear-gradient(135deg,#10B981,#059669)",
                    border: "none", cursor: "pointer",
                    fontFamily: "'Inter',sans-serif",
                    fontSize: 14, fontWeight: 600, color: "#020617",
                    marginTop: 4,
                  }}>
                  Send Message <FiSend size={14} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>
    </Section>
  );
}

function FocusInput({ field, form, setForm, inputStyle }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
      value={form[field]}
      onChange={e => setForm({ ...form, [field]: e.target.value })}
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
      onChange={e => setForm({ ...form, message: e.target.value })}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      rows={5}
      style={{ ...inputStyle(focused), resize: "vertical", minHeight: 120 }}
    />
  );
}

/* ─────────────────── SECTION TITLE ─────────────────── */
function SectionTitle({ children }) {
  return (
    <div>
      <h2 style={{
        fontFamily: "'Space Grotesk',serif",
        fontSize: "clamp(32px,4vw,52px)", fontWeight: 700,
        color: "#f8fafc", letterSpacing: "-0.03em", lineHeight: 1.1,
      }}>
        {children}
      </h2>
      <div style={{ width: 40, height: 3, background: "linear-gradient(90deg,#10B981,transparent)", marginTop: 12, borderRadius: 4 }} />
    </div>
  );
}

/* ─────────────────── TAB CONTENT MAP ─────────────────── */
const SECTION_MAP = {
  home: (p) => <HomeSection {...p} />,
  about: (p) => <AboutSection {...p} />,
  projects: (p) => <ProjectsSection {...p} />,
  skills: (p) => <SkillsSection {...p} />,
  contact: (p) => <ContactSection {...p} />,
};

/* ─────────────────── ROOT APP ─────────────────── */
export default function Portfolio() {
  const [active, setActive] = useState("home");
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchData();
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);

    // Realtime subscriptions
    const projectSub = supabase.channel('public:projects').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchData).subscribe();
    const skillSub = supabase.channel('public:skills').on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, fetchData).subscribe();
    const profileSub = supabase.channel('public:profile').on('postgres_changes', { event: '*', schema: 'public', table: 'profile' }, fetchData).subscribe();

    return () => {
      window.removeEventListener("resize", onResize);
      supabase.removeChannel(projectSub);
      supabase.removeChannel(skillSub);
      supabase.removeChannel(profileSub);
    };
  }, []);

  async function fetchData() {
    const { data: prof } = await supabase.from('profile').select('*').single();
    if (prof) setProfile(prof);

    const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (projs) setProjects(projs);

    const { data: skls } = await supabase.from('skills').select('*').order('cat', { ascending: true });
    if (skls) setSkills(skls);
  }

  const sideW = mobile ? 0 : 220;

  return (
    <>
      <style>{globalStyles}</style>
      <FloatingOrbs />

      <Sidebar active={active} setActive={setActive} mobile={mobile} profile={profile} />

      {/* Main content area */}
      <div style={{
        position: "fixed",
        top: 0, right: 0, bottom: mobile ? 64 : 0,
        left: sideW,
        zIndex: 10,
        overflow: "hidden",
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(2px)" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: "100%", width: "100%" }}>
            {SECTION_MAP[active]?.({ setActive, profile, projects, skills })}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
