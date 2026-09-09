import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  CircuitBoard,
  Code2,
  Download,
  GraduationCap,
  Github,
  HeartPulse,
  Mail,
  Network,
  Sparkles,
  Users,
  WandSparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import coverArt from "@/assets/grimoire-cover.webp";
import projectAlzheimers from "@/assets/case-mri-segmentation-v2.png";
import projectDiabetes from "@/assets/case-diabetes-validation-v2.jpg";
import projectNanosonics from "@/assets/case-nanosonics-collage-v2.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gauri Sharma | Electrical Engineering & Computer Science" },
      {
        name: "description",
        content:
          "Gauri Sharma's portfolio across electrical engineering, computer science, AI, integrated systems and signal processing.",
      },
    ],
  }),
  component: Portfolio,
});

const pageNames = [
  "Cover",
  "Introduction",
  "Education",
  "Experience",
  "Project Index",
  "Explainable AI",
  "Medical Imaging",
  "Integrated Engineering",
  "Skills & Community",
  "In Progress",
  "Contact",
];

const experience = [
  {
    years: "Nov 2022 to May 2024",
    role: "Customer Service Team Member",
    place: "Woolworths",
    note: "Balanced accuracy, pace and customer needs across 200+ transactions per shift.",
    learning: "Composure and accountability",
  },
  {
    years: "Feb 2023 to Present",
    role: "Engineering Peer Mentor",
    place: "University of Sydney",
    note: "Support 30+ first-year engineers with study, course planning and the transition into university.",
    learning: "Leadership through listening",
  },
  {
    years: "Sep 2023 to Present",
    role: "Team Mentor",
    place: "BIOTech Futures",
    note: "Guide three high-school teams through research, ideation and prototype development.",
    learning: "Turning ambiguity into action",
  },
  {
    years: "Mar 2024",
    role: "Programming Tutor",
    place: "Girls Programming Network",
    note: "Taught Python and problem-solving to groups of 20+ students through interactive challenges.",
    learning: "Explain the idea, not the syntax",
  },
  {
    years: "Dec 2025 to Feb 2026",
    role: "Engineering Intern Consultant",
    place: "Nanosonics",
    note: "Built repeatable tests for 20+ hardware units, completed 50+ cycles and reduced testing turnaround by ~30%.",
    learning: "Evidence must survive the real world",
  },
];

const projects = [
  {
    number: "01",
    title: "Explainable diabetes risk",
    field: "AI · Data · Interface",
    description:
      "An interactive predictor designed to make a model's reasoning easier to interrogate.",
    image: projectDiabetes,
  },
  {
    number: "02",
    title: "MRI classification pipeline",
    field: "Medical imaging · Signals · ML",
    description: "A complete preprocessing and classification workflow for Alzheimer's MRI data.",
    image: projectAlzheimers,
  },
  {
    number: "03",
    title: "Internship Case Study",
    field: "Integrated engineering · Co-Lead",
    description:
      "A multidisciplinary diagnostic system validated at a 33,000 RPM performance target.",
    image: projectNanosonics,
  },
];

function Portfolio() {
  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const activeRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const gestureRef = useRef(false);
  const wheelTotalRef = useRef(0);
  const wheelIdleRef = useRef<number | null>(null);

  const goTo = useCallback((requested: number) => {
    const next = Math.max(0, Math.min(requested, pageNames.length - 1));
    const current = activeRef.current;
    if (next === current || animationRef.current !== null) return;

    setDirection(next > current ? 1 : -1);
    setOutgoing(current);
    activeRef.current = next;
    setActive(next);
    animationRef.current = window.setTimeout(() => {
      setOutgoing(null);
      animationRef.current = null;
    }, 860);
  }, []);

  // Revisiting a chapter should always open at the top, not wherever a
  // scrollable folio (tablet/phone) happened to be left.
  useEffect(() => {
    const activePage = document.querySelector(
      ".curl-page.is-active .folio-page, .curl-page.is-active .cover-page",
    );
    activePage?.scrollTo(0, 0);
  }, [active]);

  useEffect(() => {
    // Below this width a folio may scroll internally (see the tablet tier in
    // styles.css), so the wheel is left free for native scrolling rather than
    // hijacked for page turns.
    const DESKTOP_MIN_WIDTH = 1100;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchIsGesture = false;

    const releaseGesture = () => {
      gestureRef.current = false;
      wheelTotalRef.current = 0;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || window.innerWidth < DESKTOP_MIN_WIDTH) return;
      event.preventDefault();
      if (wheelIdleRef.current !== null) window.clearTimeout(wheelIdleRef.current);
      wheelIdleRef.current = window.setTimeout(releaseGesture, 280);
      if (gestureRef.current) return;

      wheelTotalRef.current +=
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(wheelTotalRef.current) < 55) return;

      gestureRef.current = true;
      goTo(activeRef.current + (wheelTotalRef.current > 0 ? 1 : -1));
    };

    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (["ArrowRight", "PageDown"].includes(event.key)) {
        event.preventDefault();
        goTo(activeRef.current + 1);
      }
      if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goTo(activeRef.current - 1);
      }
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(pageNames.length - 1);
    };

    const onTouchStart = (event: TouchEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      // A tap or drag that starts on a link/button should never be read as a
      // page-turn gesture, so links and the résumé download stay tappable.
      touchIsGesture = event.touches.length === 1 && !target?.closest("a, button");
      touchStartX = event.touches[0]?.clientX ?? 0;
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (!touchIsGesture) return;
      const endX = event.changedTouches[0]?.clientX ?? touchStartX;
      const endY = event.changedTouches[0]?.clientY ?? touchStartY;
      const distanceX = touchStartX - endX;
      const distanceY = touchStartY - endY;
      // Only a swipe that is clearly more horizontal than vertical turns the
      // page; a mostly-vertical drag is a reading scroll, not a navigation.
      if (Math.abs(distanceX) > 45 && Math.abs(distanceX) > Math.abs(distanceY) * 1.5) {
        goTo(activeRef.current + (distanceX > 0 ? 1 : -1));
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (wheelIdleRef.current !== null) window.clearTimeout(wheelIdleRef.current);
      if (animationRef.current !== null) window.clearTimeout(animationRef.current);
    };
  }, [goTo]);

  const pages = [
    <CoverPage key="cover" enter={() => goTo(1)} />,
    <IntroductionPage key="introduction" />,
    <EducationPage key="education" />,
    <ExperiencePage key="experience" />,
    <ProjectIndexPage key="projects" openProject={(index) => goTo(index + 5)} />,
    <DiabetesPage key="diabetes" />,
    <MriPage key="mri" />,
    <IntegratedPage key="integrated" />,
    <CommunityPage key="community" />,
    <CurrentPage key="current" />,
    <ContactPage key="contact" />,
  ];

  return (
    <div className="grimoire-deck">
      <div className="ambient-stars" aria-hidden />
      <CursorTrail />

      <header className="deck-nav">
        <button type="button" onClick={() => goTo(0)} className="deck-brand">
          <span>
            <Sparkles />
          </span>
          <b>Gauri Sharma</b>
        </button>
        <div className="deck-actions">
          <a href="/Gauri-Sharma-Resume.pdf" download>
            <Download /> <span>Résumé</span>
          </a>
        </div>
      </header>

      <main className="page-stage" aria-live="polite">
        {pages.map((page, index) => {
          const isActive = index === active;
          const isOutgoing = index === outgoing;
          return (
            <div
              key={pageNames[index]}
              className={[
                "curl-page",
                isActive ? "is-active" : "",
                isOutgoing ? (direction === 1 ? "curl-out-forward" : "curl-out-back") : "",
                isActive && outgoing !== null
                  ? direction === 1
                    ? "curl-in-forward"
                    : "curl-in-back"
                  : "",
                index === 0 ? "cover-layer" : "",
              ].join(" ")}
              aria-hidden={!isActive}
            >
              {page}
            </div>
          );
        })}
      </main>

      <aside className="chapter-tabs" aria-label="Portfolio chapters">
        {pageNames.map((name, index) => (
          <button
            key={name}
            type="button"
            onClick={() => goTo(index)}
            className={active === index ? "is-active" : ""}
            aria-current={active === index ? "page" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <b>{name}</b>
          </button>
        ))}
      </aside>
    </div>
  );
}

function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!canvas || !cursor) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    type TrailPoint = { x: number; y: number; life: number };
    const points: TrailPoint[] = [];
    let frame = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const move = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      points.push({ x: event.clientX, y: event.clientY, life: 1 });
      if (points.length > 24) points.shift();
    };
    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (points.length > 1) {
        context.lineCap = "round";
        context.lineJoin = "round";
        for (let index = 1; index < points.length; index += 1) {
          const previous = points[index - 1];
          const point = points[index];
          context.beginPath();
          context.moveTo(previous.x, previous.y);
          context.lineTo(point.x, point.y);
          context.strokeStyle = `rgba(83, 35, 142, ${point.life * 0.58})`;
          context.lineWidth = Math.max(0.8, point.life * 7);
          context.shadowColor = "rgba(86, 38, 151, 0.76)";
          context.shadowBlur = 16;
          context.stroke();
          point.life *= 0.91;
        }
        while (points[0]?.life < 0.04) points.shift();
      }
      frame = window.requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    frame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-trail" aria-hidden />
      <div ref={cursorRef} className="magic-cursor" aria-hidden />
    </>
  );
}

function CoverPage({ enter }: { enter: () => void }) {
  return (
    <section className="cover-page" style={{ backgroundImage: `url(${coverArt})` }}>
      <div className="cover-vignette" />
      <div className="cover-inscription">
        <p>THE ENGINEER'S GRIMOIRE</p>
        <h1>
          Gauri
          <br />
          Sharma
        </h1>
        <span>Electrical Engineering · Computer Science</span>
        <button type="button" onClick={enter}>
          <WandSparkles /> Enter the grimoire
        </button>
      </div>
      <p className="cover-hint">Scroll, swipe, or use the arrow keys</p>
    </section>
  );
}

function PageShell({
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`folio-page ${className}`}>
      <div className="folio-rule">
        <span>✦</span>
        <i />
        <span>✦</span>
      </div>
      <div className="folio-heading">
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        {intro && <span>{intro}</span>}
      </div>
      <div className="folio-content">{children}</div>
    </section>
  );
}

function IntroductionPage() {
  return (
    <PageShell
      eyebrow="I · The person behind the work"
      title="I build at the meeting point of hardware, software and intelligence."
      intro="Final-year Electrical Engineering Honours and Computer Science student at the University of Sydney, turning complex technical ideas into systems that can be tested, understood and used."
      className="intro-page"
    >
      <div className="intro-grid">
        <div className="intro-story">
          <blockquote>
            I am most curious when a problem refuses to belong to only one discipline.
          </blockquote>
          <p>
            My degree has taught me to move between physical systems and computation: to understand
            the signal, design the algorithm, test the behaviour and ask whether the result is
            genuinely useful. That has led me from medical imaging and explainable AI to hardware
            verification, programmable networks and human-centred system design.
          </p>
          <p>
            I bring structured problem-solving, careful experimentation and a willingness to learn
            quickly. I want to contribute to teams building intelligent, scalable technology with a
            visible real-world impact, not technology that is impressive only in isolation.
          </p>
          <div className="achievement-line" aria-label="Selected evidence">
            <b>Evidence so far</b>
            <span>20+ hardware units tested</span>
            <span>50+ startup cycles analysed</span>
            <span>30+ engineering students mentored</span>
            <span>Strong results across AI, engineering and design</span>
          </div>
        </div>
        <div className="discipline-grid">
          <Discipline
            icon={<CircuitBoard />}
            title="Electrical engineering"
            text="Physical systems, measurements, electronics and verification."
          />
          <Discipline
            icon={<Code2 />}
            title="Computer science"
            text="Algorithms, software design and practical implementation."
          />
          <Discipline
            icon={<BrainCircuit />}
            title="AI & data"
            text="Models that are useful, explainable and grounded in context."
          />
          <Discipline
            icon={<Network />}
            title="Integrated systems"
            text="Connecting sensing, computation and human needs."
          />
        </div>
      </div>
    </PageShell>
  );
}

function Discipline({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="rune-card">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function EducationPage() {
  return (
    <PageShell
      eyebrow="II · Foundations"
      title="Education"
      intro="The formal chapters that shaped how I approach systems, computation and complex problems."
    >
      <div className="education-path">
        <article>
          <div className="education-year">2022 to 2026</div>
          <span className="education-seal">
            <GraduationCap />
          </span>
          <div>
            <p>University of Sydney</p>
            <h3>Bachelor of Engineering Honours (Electrical)</h3>
            <span className="double-degree-mark">&amp;</span>
            <h3>Bachelor of Science (Computer Science)</h3>
            <ul>
              <li>Computer Science major</li>
              <li>Final-year Honours student</li>
            </ul>
          </div>
        </article>
        <article>
          <div className="education-year">2016 to 2021</div>
          <span className="education-seal">
            <BookOpen />
          </span>
          <div>
            <p>Carlingford High School</p>
            <h3>Higher School Certificate</h3>
            <h4>Year 12 completed in 2021</h4>
          </div>
        </article>
        <aside className="academic-highlights" aria-label="Selected academic highlights">
          <p>Selected academic highlights</p>
          <div>
            <span>
              <b>HD</b> AI, Data, and Society in Health
            </span>
            <span>
              <b>HD</b> Models of Computation
            </span>
            <span>
              <b>D</b> Interdisciplinary Engineering
            </span>
            <span>
              <b>D</b> Design Thinking
            </span>
            <span>
              <b>D</b> Introduction to Artificial Intelligence
            </span>
            <span>
              <b>D</b> Software Defined Networks
            </span>
            <span>
              <b>D</b> Data Governance and Technology Assurance
            </span>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function ExperiencePage() {
  return (
    <PageShell
      eyebrow="III · Field notes"
      title="Experience timeline"
      intro="Not a straight line, but a trail: each role added a different kind of engineering judgement."
      className="experience-page"
    >
      <div className="experience-timeline">
        <svg className="map-trail" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden>
          <path d="M110 70 C280 65 250 190 455 170 S720 80 860 155 S730 310 545 295 S250 265 180 390 S470 475 850 425" />
        </svg>
        {experience.map((item, index) => (
          <article key={`${item.place}-${item.role}`}>
            <span className="timeline-node">👣</span>
            <p>{item.years}</p>
            <h3>{item.role}</h3>
            <h4>{item.place}</h4>
            <div>{item.note}</div>
            <strong>{item.learning}</strong>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

function ProjectIndexPage({ openProject }: { openProject: (index: number) => void }) {
  return (
    <PageShell
      eyebrow="IV · Selected workings"
      title="Projects"
      intro="Three different forms of engineering: understanding data, constructing pipelines and testing physical systems."
      className="project-index"
    >
      <div className="project-cards">
        {projects.map((project, index) => (
          <button type="button" key={project.title} onClick={() => openProject(index)}>
            <img src={project.image} alt="" />
            <span>
              {project.number} · {project.field}
            </span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <i>
              Open case study <ArrowUpRight />
            </i>
          </button>
        ))}
      </div>
    </PageShell>
  );
}

function CaseStudy({
  chapter,
  title,
  image,
  imageClass = "",
  question,
  approach,
  result,
  tags,
  liveUrl,
  repositoryUrl,
  evidence,
  pipeline,
}: {
  chapter: string;
  title: string;
  image: string;
  imageClass?: string;
  question: string;
  approach: string;
  result: string;
  tags: string[];
  liveUrl?: string;
  repositoryUrl?: string;
  evidence?: string[];
  pipeline?: string[];
}) {
  return (
    <PageShell eyebrow={chapter} title={title} className="case-study">
      <div className="case-grid">
        <figure className={pipeline ? "has-pipeline" : undefined}>
          <img className={imageClass} src={image} alt="" />
          {pipeline && (
            <figcaption className="mri-pipeline" aria-label="MRI classification workflow">
              {pipeline.map((step, index) => (
                <span key={step}>
                  {step}
                  {index < pipeline.length - 1 && <i aria-hidden>↓</i>}
                </span>
              ))}
            </figcaption>
          )}
        </figure>
        <div className="case-copy">
          <CaseBeat label="The question" text={question} />
          <CaseBeat label="The approach" text={approach} />
          <CaseBeat label="What I learned" text={result} />
          <div className="case-tags">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {(liveUrl || repositoryUrl || evidence) && (
            <div className="case-evidence">
              {evidence && (
                <div>
                  <p>Project evidence</p>
                  <ul>
                    {evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(liveUrl || repositoryUrl) && (
                <div className="case-actions">
                  {liveUrl && (
                    <a href={liveUrl} target="_blank" rel="noreferrer">
                      Explore live predictor <ArrowUpRight />
                    </a>
                  )}
                  {repositoryUrl && (
                    <a href={repositoryUrl} target="_blank" rel="noreferrer">
                      <Github /> View GitHub repository
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function CaseBeat({ label, text }: { label: string; text: string }) {
  return (
    <article>
      <p>{label}</p>
      <div>{text}</div>
    </article>
  );
}

function DiabetesPage() {
  return (
    <CaseStudy
      chapter="V · AI and interface design"
      title="What if a prediction could explain itself?"
      image={projectDiabetes}
      imageClass="validation-graph"
      question="Diabetes risk depends on interacting health and demographic factors. How could a model provide context, not simply a score?"
      approach="I prepared the data, compared classification approaches, evaluated performance and translated the model into an interactive prototype that makes contributing risk factors visible."
      result="The project taught me to think beyond model accuracy. A useful health prediction system must communicate its reasoning, limitations and evidence clearly enough for a person to interpret responsibly."
      tags={["Python", "Machine learning", "Explainability", "Interface design"]}
      liveUrl="https://diabetes2predictorprototype.netlify.app"
      repositoryUrl="https://github.com/TotallyManiac/diabetes-2-risk-predictor.git"
      evidence={[
        "Interactive risk assessment",
        "Feature-level explanations",
        "Human-centred result presentation",
      ]}
    />
  );
}

function MriPage() {
  return (
    <CaseStudy
      chapter="VI · Signals and medical imaging"
      title="Turning MRI data into a reliable pipeline."
      image={projectAlzheimers}
      imageClass="mri-crop"
      question="A raw MRI is a three-dimensional signal, not a ready-made table. How could anatomy be isolated, aligned and measured consistently?"
      approach="The project was strongly focused on CNN-based medical imaging and computer vision concepts. My implemented pipeline transformed raw scans through anatomical preprocessing and ROI feature extraction before RBF SVM classification."
      result="The work showed me that reliable medical AI depends on the entire image-processing chain. Whether features are learned with CNNs or engineered through anatomical ROIs, every transformation and validation decision must remain traceable."
      tags={["CNN", "Computer vision", "FSL", "NiftyReg", "RBF SVM", "Signal processing"]}
      pipeline={[
        "Raw skull MRI",
        "Skull stripping",
        "Grey matter segmentation",
        "Affine registration",
        "Non-linear registration",
        "AAL ROI extraction",
        "Feature vector",
        "RBF SVM",
        "AD / NC prediction",
      ]}
    />
  );
}

function IntegratedPage() {
  return (
    <PageShell
      eyebrow="VII · Integrated engineering"
      title="Internship Case Study"
      className="internship-page"
    >
      <div className="internship-grid">
        <figure>
          <img
            src={projectNanosonics}
            alt="Collage of the Nanosonics fan diagnostic system, laboratory work and trade show demonstration"
          />
          <figcaption>
            <b>Nanosonics Engineering Internship</b>
            <span>Co-Lead · 9-person multidisciplinary team</span>
          </figcaption>
        </figure>

        <div className="internship-copy">
          <article className="internship-overview">
            <p>Overview</p>
            <div>
              Nanosonics' trophon® device is a global standard for automated high-level disinfection
              of ultrasound probes, and its reliability depends on components that never fail
              silently. I joined a nine-person electrical, mechanical and software team as Co-Lead
              to build a high-speed system that could catch sticky fans unable to reach the required
              rotational speed or airflow before they reached the field.
            </div>
          </article>

          <article>
            <p>The question</p>
            <div>
              Could we reliably detect underperforming fans at 33,000 RPM, within fixed client and
              timeline constraints, then prove the system in a live trade show demonstration?
            </div>
          </article>

          <article className="internship-outcome">
            <p>Outcome</p>
            <div>
              Delivered a working fan diagnostic system, validated to the 33,000 RPM target and
              presented live to stakeholders at Optik's trade show, on schedule despite last-minute
              component failures.
            </div>
          </article>

          <article className="internship-approach">
            <p>The approach · Electrical stream lead</p>
            <ul>
              <li>
                <b>Sensor and signal design:</b> Integrated RPM and airflow sensors, distinguished
                Hall-effect from tachometer signals and applied RC filtering to noisy feedback.
              </li>
              <li>
                <b>Root-cause diagnosis:</b> Isolated the motor driver, PWM and feedback path,
                tracing unstable RPM to the Vref potentiometer configuration.
              </li>
              <li>
                <b>Under-pressure problem-solving:</b> Tested switching frequencies and heat
                dissipation methods when drivers overheated days before the demonstration, weighing
                each fix against cost, available parts and time.
              </li>
              <li>
                <b>System integration:</b> Connected the hardware to the software team's real-time
                GUI and structured test logging.
              </li>
              <li>
                <b>Team leadership:</b> Coordinated three technical streams, resolved design
                trade-offs such as housing access versus airflow accuracy, and supported newer team
                members in the laboratory.
              </li>
            </ul>
          </article>

          <article className="internship-learning">
            <p>What I learned</p>
            <div>
              University teaches you to solve defined problems. This experience taught me to work
              inside ambiguity, where requirements shift, components fail without warning and done
              remains a moving target.
            </div>
            <div>
              I learned to reason from first principles, hold a team together through disagreement
              and tell a client the truth about a system we did not yet trust. I also learned to
              translate engineering trade-offs into language a non-technical stakeholder could act
              on.
            </div>
            <strong>
              Next time, I would begin full integration testing earlier so subsystem feedback loops
              expose late-stage issues sooner.
            </strong>
          </article>

          <aside className="internship-toolkit" aria-label="Nanosonics technical toolkit">
            <p>Technical toolkit</p>
            <ToolkitRow
              label="Hardware"
              text="Arduino Nano · Raspberry Pi · RPM and airflow sensors · RC filters · Motor drivers · PWM control"
            />
            <ToolkitRow
              label="Lab and testing"
              text="Oscilloscopes · Multimeters · Power supplies · Circuit prototyping · Soldering"
            />
            <ToolkitRow
              label="Systems"
              text="Hardware-software integration · Real-time GUI communication · Structured test logging"
            />
            <ToolkitRow
              label="Practice"
              text="Root-cause analysis · Cross-disciplinary coordination · Client communication · WHS and lab safety"
            />
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

function ToolkitRow({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <b>{label}</b>
      <span>{text}</span>
    </div>
  );
}

function CommunityPage() {
  return (
    <PageShell
      eyebrow="VIII · Skills in practice"
      title="Technical practice, teaching and teamwork"
      intro="My toolkit is strongest when it is paired with the ability to explain ideas, guide people and work across disciplines."
      className="community-page"
    >
      <div className="community-layout">
        <div className="community-cards">
          <Discipline
            icon={<Users />}
            title="Engineering Peer Mentor"
            text="Supporting 30+ first-year students taught me to listen before offering a solution, and to adapt guidance to the person rather than the problem alone."
          />
          <Discipline
            icon={<Code2 />}
            title="Programming Tutor"
            text="Teaching Python showed me that genuine understanding means being able to explain the reasoning, not merely reproduce the syntax."
          />
          <Discipline
            icon={<HeartPulse />}
            title="BIOTech Futures Mentor"
            text="Guiding student teams strengthened my ability to turn broad ideas into achievable milestones without taking ownership away from the team."
          />
        </div>
        <aside className="community-toolkit">
          <p>Technical toolkit</p>
          <TechGroup label="Languages" items={["Python", "Java", "C", "MATLAB", "R", "SQL"]} />
          <TechGroup label="AI / ML" items={["PyTorch", "scikit-learn", "OpenCV"]} />
          <TechGroup label="Engineering" items={["MATLAB", "P4", "Mininet"]} />
          <TechGroup label="Tools" items={["Git", "GitHub", "Docker"]} />
        </aside>
      </div>
    </PageShell>
  );
}

function CurrentPage() {
  return (
    <PageShell
      eyebrow="IX · Spells in progress"
      title="What I’m exploring now"
      intro="I am looking for work where I can keep crossing technical boundaries while growing into an engineer trusted with real systems and real consequences."
      className="current-page"
    >
      <div className="constellation-list">
        <article className="quantum-feature">
          <span>Current thesis · 01</span>
          <h3>Simulating open quantum systems</h3>
          <p>
            My current thesis work explores how a driven two-level quantum system evolves under
            relaxation and dephasing. I am building the mathematical foundation through
            Hamiltonians, density matrices and the Lindblad master equation, then translating an
            existing theoretical model into a modular Python and Streamlit simulator with
            Bloch-sphere visualisation.
          </p>
          <div className="current-tags">
            <b>Python</b>
            <b>Quantum systems</b>
            <b>Density matrices</b>
            <b>Streamlit</b>
          </div>
        </article>
        <article>
          <span>02</span>
          <h3>Integrated intelligent systems</h3>
          <p>
            I want to bring sensing, electronics, embedded computation and software together as one
            dependable system, not as isolated components.
          </p>
          <div className="current-tags">
            <b>Embedded systems</b>
            <b>Sensing</b>
            <b>Verification</b>
          </div>
        </article>
        <article>
          <span>03</span>
          <h3>AI with engineering context</h3>
          <p>
            I am interested in models whose behaviour can be tested, explained and connected to
            physical constraints, uncertainty and the people relying on their decisions.
          </p>
          <div className="current-tags">
            <b>Machine learning</b>
            <b>Signals</b>
            <b>Explainability</b>
          </div>
        </article>
      </div>
    </PageShell>
  );
}

function TechGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="tech-group">
      <strong>{label}</strong>
      <div>
        {items.map((item) => (
          <b key={item}>{item}</b>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <PageShell
      eyebrow="X · The next inscription"
      title="Let’s build the next chapter."
      className="contact-page"
    >
      <div className="contact-panel">
        <p>
          I’m interested in graduate and early-career opportunities across electrical engineering,
          software, AI, integrated systems, verification and data-driven engineering.
        </p>
        <div>
          <a href="mailto:gstechland100@gmail.com">
            <Mail /> Send a message
          </a>
          <a href="/Gauri-Sharma-Resume.pdf" download>
            <Download /> Download résumé
          </a>
          <a href="https://github.com/TotallyManiac" target="_blank" rel="noreferrer">
            <Github /> View GitHub
          </a>
        </div>
      </div>
    </PageShell>
  );
}
