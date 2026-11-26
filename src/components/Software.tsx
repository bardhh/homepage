import Link from 'next/link';
import { publicationPath } from '@/lib/publication-utils';
import { FaCode, FaBookOpen, FaBlog, FaBook } from 'react-icons/fa';

interface WorkedExample {
  question: string;
  readings: [label: string, value: string][];
  explanation: string;
  source: { label: string; href: string };
}

interface Project {
  title: string;
  description: string;
  repo: string;
  link: string;
  blog?: string;
  docs?: string;
  paperKey: string;
  paperName: string;
  example: WorkedExample | 'strem';
  /** Short evidence of adoption or recognition, shown as a list under the description. */
  impact?: string[];
  homepageNote?: string;
}


/** GitHub and citation figures in `impact` were read in November 2026. */
export const projects: Project[] = [
  {
    title: "CBFKit: A Control Barrier Function Toolbox",
    description: "Design and simulate robot controllers with control barrier functions in Python, then run them with ROS 2.",
    repo: "bardhh/cbfkit",
    link: "https://github.com/bardhh/cbfkit",
    blog: "https://bardhh.github.io/cbfkit/",
    paperKey: "IROS2024",
    paperName: "IROS 2024",
    example: {
      question: 'How closely can a robot following a goal command pass a circular obstacle?',
      readings: [['Obstacle radius', '0.50 m'], ['Closest to center', '0.56 m'], ['Clearance', '0.06 m']],
      explanation: 'The goal command points through the obstacle. In the quickstart simulation, the barrier filter adjusts the velocity at each step. At the closest sampled position, the robot clears the perimeter by about six centimeters.',
      source: { label: 'CBFKit quickstart', href: 'https://github.com/bardhh/cbfkit#readme' },
    },
    impact: [
      'Published at IROS 2024',
      '116 GitHub stars',
    ],
  },
  {
    title: "STREM: Spatio-Temporal Pattern Matching over Perception Streams",
    description: "Search annotated video for sequences of spatial events using regular expressions.",
    repo: "cps-atlas/strem",
    link: "https://github.com/cps-atlas/strem",
    docs: "https://cps-atlas.github.io/strem/",
    paperKey: "STTT2024",
    paperName: "STTT 2024",
    example: 'strem',
    impact: [
      'Best paper finalist at RV 2023',
      'Journal version in STTT 2024',
      'Granted US patent 12,361,086 B2',
    ],
  },
  {
    title: "RTAMT: Runtime Robustness Monitors for STL",
    description: "Monitor a signal as it arrives and measure how closely it satisfies a Signal Temporal Logic specification.",
    repo: "nickovic/rtamt",
    link: "https://github.com/nickovic/rtamt",
    paperKey: "STTT2023",
    paperName: "STTT 2023",
    example: {
      question: 'Does a measured gap stay at least 2 m wide for three consecutive samples?',
      readings: [['Sample 1', '2.4 m'], ['Sample 2', '2.1 m'], ['Sample 3', '1.8 m']],
      explanation: 'For this sample trace, always[0,2] (gap >= 2) has robustness −0.2 m at the first sample. The monitor can report that verdict when the third reading arrives.',
      source: { label: 'RTAMT discrete-time monitor', href: 'https://github.com/nickovic/rtamt#discrete-time-online-monitor' },
    },
    impact: [
      '83 GitHub stars, 32 forks',
      'Tool paper cited 40+ times',
    ],
  },
  {
    title: "TLTk: Parallel Robustness Computation for Temporal Logic",
    description: "Compute temporal logic robustness in parallel across recorded signals to evaluate test runs.",
    repo: "versyslab/tltk",
    link: "https://bitbucket.org/versyslab/tltk/src/master/",
    paperKey: "cralley2020tltk",
    paperName: "RV 2020",
    example: {
      question: 'Which point on a recorded trajectory comes closest to an exclusion zone?',
      readings: [['Point A', '0.8 m outside'], ['Point B', '0.2 m outside'], ['Point C', '0.5 m outside']],
      explanation: 'TLTk can compute the signed distances for all three samples in parallel. For the requirement to stay outside the zone, the smallest distance sets the robustness of this illustrative trace. Point B leaves only 0.2 m of clearance.',
      source: { label: 'TLTk paper, Figure 2', href: '/papers/RV2020.pdf#page=5' },
    },
    impact: [
      'Tool paper at RV 2020',
    ],
  },
  {
    title: "S-TaLiRo: Toolbox for Testing and Verification of CPS",
    description: "Search MATLAB and Simulink models for trajectories that violate a temporal logic requirement.",
    homepageNote: "Its falsification benchmarks have been used in ARCH-COMP.",
    repo: "s-taliro/s-taliro",
    link: "https://sites.google.com/a/asu.edu/s-taliro/s-taliro",
    paperKey: "hoxha2014towards",
    paperName: "DIFTS 2014",
    example: {
      question: 'Can a throttle and brake sequence make a transmission shift out of first gear too soon?',
      readings: [['Required dwell', '2.5 s'], ['Example downshift', '8.0 s'], ['Next upshift', '10.0 s']],
      explanation: 'This illustrative trace spends only 2.0 s in first gear after the downshift. S-TaLiRo varies the throttle and brake signals in simulation and uses the robustness score to search for inputs that produce such a violation.',
      source: { label: 'Automatic transmission benchmark', href: '/papers/CASE2017.pdf' },
    },
    impact: [
      'Benchmarks used in the ARCH-COMP falsification competition',
      'Benchmark paper cited 160+ times',
      'Applied to industrial-size automotive models and the UxAS autonomy software',
    ],
  },
  {
    title: "VERITEX: Deep Neural Network Verification",
    description: "Compute the reachable outputs of a neural network and use the resulting sets to guide repairs.",
    repo: "Shaddadi/veritex",
    link: "https://github.com/Shaddadi/veritex",
    paperKey: "yang2022neural",
    paperName: "FORMATS 2022",
    example: {
      question: 'Which aircraft encounter conditions cause a neural network to violate an advisory requirement?',
      readings: [['Networks checked', '45'], ['Violated a property', '11'], ['Repaired', '11']],
      explanation: 'In the aircraft collision-avoidance study, VERITEX propagated sets of encounter conditions through each network. Inputs that reached a prohibited combination of advisory scores guided repair. The authors then checked the repaired networks against all three properties.',
      source: { label: 'Aircraft controller repair study, §6.1', href: 'https://arxiv.org/pdf/2108.04214#page=19' },
    },
    impact: ['Best Software Artifact Award at FORMATS 2022', 'Repair paper cited 60+ times'],
  },
  {
    title: "NDF-CoRoCo: Continuum Robot Control",
    description: "Use learned distance fields to check collisions and plan motions for continuum robots.",
    repo: "cps-atlas/ndf-coroco",
    link: "https://github.com/cps-atlas/ndf-coroco",
    paperKey: "IROS2025",
    paperName: "IROS 2025",
    example: {
      question: 'How does the number of bending links change the route a continuum robot can take?',
      readings: [['4 links', '158 steps'], ['5 links', '82 steps'], ['7 links', '43 steps']],
      explanation: 'In the reported simulations, the planner used a learned distance field to check candidate arm shapes against obstacle points. The four-link arm took a detour. The seven-link arm bent along a more direct route and reached the goal in 43 steps.',
      source: { label: 'Cluttered navigation study, Table IV', href: 'https://arxiv.org/html/2409.13865v2#S6.SS4' },
    },
  }
];

const resourceLink = "inline-flex min-h-7 items-center gap-1.5 rounded-sm text-xs font-medium text-blue-700 underline-offset-4 hover:underline dark:text-blue-300";

function StremExample() {
  return (
    <figure className="my-2 max-w-lg border-l-2 border-slate-300 pl-3 dark:border-slate-600">
      <p className="font-medium text-slate-900 dark:text-slate-100">Where do pedestrian and car detection boxes overlap for two consecutive frames?</p>
      <code className="my-2 block break-words text-xs text-slate-700 dark:text-slate-300">{'[NE([:pedestrian:] & [:car:])]{2}'}</code>
      <ol aria-hidden="true" className="grid max-w-xs grid-cols-3 gap-2">
        {[12, 37, 49].map((left, index) => (
          <li key={left} className="text-center">
            <div className="relative aspect-[100/56] rounded border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
              <span className="absolute left-[43%] top-[41%] h-[36%] w-[43%] border border-dashed border-slate-600 dark:border-slate-300" />
              <span style={{ left: `${left}%` }} className="absolute top-[21%] h-[55%] w-[12%] border border-blue-700 bg-blue-500/20 dark:border-blue-300" />
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Frame {index + 1}</span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">Frames 2–3 match. The pedestrian box overlaps the dashed car box in both frames.</figcaption>
    </figure>
  );
}

function ProjectExample({ project }: { project: Project }) {
  const { example } = project;
  return (
    <details className="col-span-full mt-1 text-sm">
      <summary className="w-fit cursor-pointer rounded-sm py-1 text-xs font-medium text-blue-700 marker:text-slate-400 dark:text-blue-300">
        Example<span className="sr-only"> for {project.title.split(':')[0]}</span>
      </summary>
      {example === 'strem' ? <StremExample /> : (
        <div className="my-2 max-w-lg border-l-2 border-slate-300 pl-3 dark:border-slate-600">
          <p className="font-medium text-slate-900 dark:text-slate-100">{example.question}</p>
          <dl className="my-2 grid grid-cols-3 gap-2">
            {example.readings.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs leading-4 text-slate-600 dark:text-slate-400">{label}</dt>
                <dd className="mt-0.5 text-sm font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm leading-5 text-slate-700 dark:text-slate-300">{example.explanation}</p>
          <a href={example.source.href} className={resourceLink}>{example.source.label}</a>
        </div>
      )}
    </details>
  );
}

const Software = () => {
  return (
    <section tabIndex={-1} id="software" className="scroll-mt-24" role="region" aria-label="Software projects">
      <div className="flex items-center mb-5">

        <h2 className="profile-title">
          Software
        </h2>
      </div>

      <div className="@container grid grid-cols-1 gap-2">
        {projects.map((project) => (
          <div id={`software-${project.paperKey}`} key={project.repo} className="glass-card rounded-lg px-4 py-2.5 @min-[44rem]:grid @min-[44rem]:grid-cols-[minmax(0,1fr)_auto] @min-[44rem]:items-center @min-[44rem]:gap-x-5">
            <div>
              <h3 className="text-base font-semibold leading-5 text-slate-900 dark:text-slate-100">
                {project.title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                {project.description}{project.homepageNote && <> {project.homepageNote}</>}
              </p>
            </div>

            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 @min-[44rem]:mt-0">
              <a href={project.link} target="_blank" rel="noopener noreferrer" className={resourceLink}>
                <FaCode aria-hidden="true" /> Repository
              </a>

              {project.blog && (
                <a href={project.blog} target="_blank" rel="noopener noreferrer" className={resourceLink}>
                  <FaBlog aria-hidden="true" /> Blog
                </a>
              )}

              {project.docs && (
                <a href={project.docs} target="_blank" rel="noopener noreferrer" className={resourceLink}>
                  <FaBook aria-hidden="true" /> Docs
                </a>
              )}

              <Link prefetch={false} href={publicationPath({ citationKey: project.paperKey })} className={resourceLink}>
                <FaBookOpen aria-hidden="true" /> Paper · {project.paperName}
              </Link>
            </div>
            <ProjectExample project={project} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Software;
