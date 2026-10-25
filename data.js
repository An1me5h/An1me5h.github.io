// Everything on the Journey timeline and in the Projects grid comes from here.
//
// Each entry:
//   id       unique short name
//   lane     education | work | milestone | engineering | ai | games | software | creative
//   start    "YYYY-MM"            where the bar starts on the timeline
//   end      "YYYY-MM" | "now"    leave out for a single point in time
//   label    optional date text to show instead of the computed one
//   title, sub, text, tags
//   short    optional shorter name for the timeline bar
//   links    [{ label, url }]
//   images   ["images/file.jpg", ...]   first one is the card cover
//   card     false to keep a project off the Projects grid (timeline only)
//   anchor   section to jump to from the timeline, e.g. "#experience"

window.LANES = [
  { id: 'education',   label: 'Education',        group: 'education' },
  { id: 'work',        label: 'Work & teams',     group: 'work' },
  { id: 'milestone',   label: 'Milestones',       group: 'milestone' },
  { id: 'engineering', label: 'Engineering',      group: 'project' },
  { id: 'ai',          label: 'Simulation & AI',  group: 'project' },
  { id: 'games',       label: 'Games',            group: 'project' },
  { id: 'software',    label: 'Software & tools', group: 'project' },
  { id: 'creative',    label: 'Creative',         group: 'project' }
];

window.ENTRIES = [
  // ---------- Education ----------
  {
    id: 'be', short: 'B.E. Mechanical Engineering', lane: 'education', start: '2018-08', end: '2022-06', label: '2018 – 2022',
    title: 'B.E. Mechanical Engineering',
    sub: 'Shri Ramdeobaba College of Engineering and Management, Nagpur',
    text: 'Thesis: strength assessment of parts made by Wire Arc Additive Manufacturing, using a Yaskawa 6-axis industrial robot.',
    anchor: '#education'
  },
  {
    id: 'honours', short: 'Honours', lane: 'education', start: '2020-08', end: '2022-06', label: '2020 – 2022',
    title: 'Honours in Mechanical Engineering',
    sub: 'Shri Ramdeobaba College of Engineering and Management, Nagpur',
    text: 'Digital manufacturing, turbomachinery, tribology, heat exchanger design and tool design.',
    anchor: '#education'
  },
  {
    id: 'msc', short: 'M.Sc. at TH Ingolstadt', lane: 'education', start: '2024-10', end: '2027-03', label: '2024 – 2027 (expected)',
    title: 'M.Sc. Automotive Production Engineering',
    sub: 'Technische Hochschule Ingolstadt, Germany',
    text: 'Cost engineering, production and logistics networks, automation, plant design and innovation management. Thesis on AI training and control of multi-axis robots.',
    anchor: '#education'
  },

  // ---------- Work & teams ----------
  {
    id: 'sae', short: 'SAE E-Baja Team Lead', lane: 'work', start: '2019-06', end: '2022-06',
    title: 'Team Lead, SAE E-Baja · Trident Racing',
    text: 'Led multibody analysis of the rollcage, suspension and steering, validated vehicle dynamics in IPG CarMaker and MSC Adams, and machined parts on CNC/VMC.',
    tags: ['Vehicle dynamics', 'MSC Adams', 'CNC'],
    anchor: '#experience'
  },
  {
    id: 'metro', short: 'Metro Rail intern', lane: 'work', start: '2021-06', end: '2021-07',
    title: 'Intern, Maharashtra Metro Rail',
    text: 'Tested a gearbox prototype while monitoring its temperature in real time, and took part in wheel flange lubrication testing.',
    anchor: '#experience'
  },
  {
    id: 'neema', short: 'Neema Forgings intern', lane: 'work', start: '2022-01', end: '2022-06',
    title: 'Intern, Neema Forgings',
    text: 'CAD fitment, tolerance and interference analysis, revision-controlled drawings, and vendor sourcing.',
    anchor: '#experience'
  },
  {
    id: 'get', short: 'Mahindra · GET', lane: 'work', start: '2022-08', end: '2022-12',
    title: 'Graduate Engineer Trainee, Mahindra & Mahindra',
    text: 'Started in product development for electric vehicle programmes.',
    anchor: '#experience'
  },
  {
    id: 'mahindra', short: 'Mahindra · Assistant Manager', lane: 'work', start: '2023-01', end: '2024-04',
    title: 'Assistant Manager – Product Development, Mahindra & Mahindra',
    text: 'Cooling and NVH components for the BE6 and BE9e EVs, India\'s first PA12 corrugated cooling-pipe localisation with NORMA Group, and ECR/ECN and BOM for ~150 parts and 11 suppliers.',
    tags: ['EV', 'DFMEA', 'PPAP', 'Teamcenter'],
    anchor: '#experience'
  },

  // ---------- Milestones ----------
  {
    id: 'patents', short: '2 patents granted', lane: 'milestone', start: '2021-06', label: '2021',
    title: 'Two patents granted',
    text: '"A Device for Generating Profiles on Pipes" (Indian Patent No. 484900) and "A Device for Making Flower Garlands" (Indian Patent No. 414916).',
    anchor: '#patents'
  },
  {
    id: 'paper', short: 'Journal paper', lane: 'milestone', start: '2022-03', label: '2022',
    title: 'Journal publication',
    text: '"Design & Analysis of an ATV Suspension System using LOTUS", ARAI Journal of Mobility and Technology.',
    anchor: '#patents'
  },
  {
    id: 'germany', lane: 'milestone', start: '2024-09', label: '2024',
    title: 'Moved to Germany',
    text: 'Left Mahindra after close to two years to start my M.Sc. in Ingolstadt.'
  },
  {
    id: 'website', short: 'This website', lane: 'milestone', start: '2026-10',
    title: 'Launched this website',
    text: 'Plain HTML, CSS and JavaScript, hosted on GitHub Pages.',
    links: [{ label: 'Source', url: 'https://github.com/An1me5h/An1me5h.github.io' }]
  },

  // ---------- Engineering ----------
  {
    id: 'thesis', short: 'M.Sc. thesis: RL robot arm', lane: 'engineering', start: '2026-05', end: 'now', card: false,
    title: 'M.Sc. thesis: reinforcement-learning robot control',
    text: 'PPO written from scratch in NumPy trains a 4-joint arm in PyBullet to reach targets (11.8 cm on held-out targets after 4,000 iterations). Next: obstacle avoidance and a policy that generalises across robot shapes.',
    tags: ['PPO', 'NumPy', 'PyBullet'],
    anchor: '#thesis'
  },
  {
    id: 'waam', short: 'WAAM thesis', lane: 'engineering', start: '2022-04', label: '2022',
    title: 'Wire Arc Additive Manufacturing',
    sub: 'B.E. thesis',
    text: '"Strength assessment of parts manufactured by Wire Arc Additive Manufacturing." Trials with a Yaskawa AR1440 6-axis robot on process parameters, deposition behaviour, bead geometry and defects.',
    tags: ['Industrial robots', 'Additive manufacturing']
  },
  {
    id: 'fem', short: 'FEM rollcage & brackets', lane: 'engineering', start: '2019-06', end: '2022-06', label: 'During SAE E-Baja (2019 – 2022)',
    title: 'FEM of rollcage & suspension brackets',
    sub: 'SAE E-Baja',
    text: 'Static and explicit ANSYS analysis (von Mises stress, deformation) used to trade weight against stiffness on the team\'s ATV.',
    tags: ['ANSYS', 'FEM', 'Vehicle design']
  },

  // ---------- Simulation & AI ----------
  {
    id: 'nn', short: 'NN from scratch', lane: 'ai', start: '2026-03',
    title: 'Neural network from scratch',
    text: 'A handwritten-digit classifier using only NumPy: one hidden layer, ReLU and softmax, with backpropagation and gradient descent written by hand.',
    tags: ['Python', 'NumPy', 'Machine learning']
  },
  {
    id: 'atomviz', lane: 'ai', start: '2026-06',
    title: 'AtomViz',
    text: 'An interactive 3D atom viewer. Enter proton and electron counts and it fills orbitals by the aufbau rule, samples each electron cloud with Monte Carlo and renders it in PyVista, with nodal surfaces, a live simulation and a Bohr model.',
    tags: ['Python', 'PyVista', 'Physics']
  },
  {
    id: 'pybullet', short: 'PyBullet lab', lane: 'ai', start: '2026-06', end: '2026-07',
    title: 'PyBullet robotics lab',
    text: 'Side experiments next to the thesis: a cart-pole balancer trained with a from-scratch Cross-Entropy Method, and EvoReacher, where a genetic algorithm evolves a creature\'s body and gait together until it walks 2 m to a target.',
    tags: ['PyBullet', 'NumPy', 'Genetic algorithms']
  },
  {
    id: 'f1', short: 'F1 Strategy Engine', lane: 'ai', start: '2026-08',
    title: 'F1 Race Strategy Engine',
    text: 'A lap-by-lap Formula 1 race simulator built on Heilmeier et al. (ITSC 2018): tyre wear, fuel, pit stops, overtaking and safety cars, with Monte Carlo win probabilities, a strategy optimiser and a live race window.',
    tags: ['Python', 'Monte Carlo', 'Motorsport']
  },
  {
    id: 'nnviz', lane: 'ai', start: '2026-08',
    title: 'NNVisualizer',
    text: 'Drop any .npz file on the page to see the neural network inside drawn as a network, plus every array as readable data. No libraries: the file is unzipped and decompressed by hand in the browser.',
    tags: ['JavaScript', 'Neural networks']
  },

  // ---------- Games ----------
  {
    id: 'pygames', short: 'Python games', lane: 'games', start: '2025-02', end: '2025-10',
    title: 'First games in Python',
    text: 'A Snake game, a VPython 3D course where you steer a dot around obstacles, and a Pygame road-grid experiment.',
    tags: ['Python', 'Pygame', 'VPython']
  },
  {
    id: 'stockpile', lane: 'games', start: '2026-04', end: '2026-09',
    title: 'STOCKPILE',
    sub: 'Logistics tycoon game',
    text: 'A competitive beer-logistics tycoon on a real, fully offline map of the Heilbronn–Heidelberg–Mannheim region. You build a supply chain from factory to bar, trucks drive real roads using A* routing, and you compete on price against AI rivals and online players. Plain JavaScript with its own canvas map engine.',
    tags: ['JavaScript', 'Canvas', 'A* pathfinding', 'Game economy']
  },
  {
    id: 'scenemaker', short: 'Scene Maker', lane: 'games', start: '2026-09',
    title: 'STOCKPILE Scene Maker',
    text: 'A standalone tool for composing the game\'s story scenes: hand-arranged isometric views of the café and its yard, with animations, custom parts and autosave.',
    tags: ['JavaScript', 'Isometric', 'Tools']
  },

  // ---------- Software & tools ----------
  {
    id: 'historymaps', lane: 'software', start: '2026-01',
    title: 'HistoryMaps',
    text: 'A world-history explorer in Streamlit that pulls events from Wikipedia, geocodes the places, sorts them into eras and plots them on an interactive map.',
    tags: ['Python', 'Streamlit', 'Folium']
  },
  {
    id: 'pagemarks', lane: 'software', start: '2026-03', end: '2026-04',
    title: 'PageMarks',
    text: 'A Chrome extension that pins bookmarks to exact positions on any webpage, so they reappear every time you visit.',
    tags: ['JavaScript', 'Chrome extension']
  },
  {
    id: 'wallpaperview', lane: 'software', start: '2026-05', end: '2026-08',
    title: 'WallpaperView',
    text: 'A Windows tray app that hides desktop icons and the taskbar with one click and makes the taskbar transparent on the desktop. Released with an installer.',
    tags: ['C#', '.NET', 'Windows'],
    links: [{ label: 'Code', url: 'https://github.com/An1me5h/WallpaperView' }]
  },
  {
    id: 'scv', short: 'Supply Chain Visualizer', lane: 'software', start: '2026-05', end: '2026-08', label: '2026 (public version)',
    title: 'Supply Chain Network Visualizer',
    text: 'An interactive map of supplier networks, logistics flows and dependencies, built on SAP-style data exports. It started because finding where stock actually sat meant digging through SAP every day. I also used it in my work at Mahindra.',
    tags: ['JavaScript', 'Data viz', 'SAP data'],
    links: [
      { label: 'Live demo', url: 'https://an1me5h.github.io/SupplyChain-visualizer/' },
      { label: 'Code', url: 'https://github.com/An1me5h/SupplyChain-visualizer' }
    ]
  },
  {
    id: 'codeviz', lane: 'software', start: '2026-07', end: '2026-08',
    title: 'Code Visualizer',
    text: 'Turns a folder of Python or JavaScript files into one node graph: every function, class and variable becomes a card on a pan-and-zoom canvas, with arrows showing how data flows. Also built as an installable Windows app.',
    tags: ['JavaScript', 'Tauri', 'Developer tools']
  },
  {
    id: 'remotecontrol', lane: 'software', start: '2026-08',
    title: 'RemoteControl',
    text: 'Turns an Android phone into a wireless trackpad and keyboard for a Windows PC over local Wi-Fi, with auto-discovery and screen mirroring. Kotlin on the phone, a C# .NET 8 tray app on the PC.',
    tags: ['Kotlin', 'C#', 'Networking'],
    links: [{ label: 'Code', url: 'https://github.com/An1me5h/RemoteControl' }]
  },

  // ---------- Creative ----------
  {
    id: 'photoshop', short: 'Photo editing', lane: 'creative', start: '2024-04', end: '2026-03',
    title: 'Photo editing & digital art',
    text: 'Photo composites and edits in Adobe Photoshop.',
    tags: ['Photoshop']
  },
  {
    id: 'video', short: 'Video editing', lane: 'creative', start: '2024-07', end: '2026-05',
    title: 'Video editing',
    text: 'Travel films from Tegernsee, tennis edits and a stop-motion cake time-lapse, cut in DaVinci Resolve, CapCut and Filmora.',
    tags: ['DaVinci Resolve', 'CapCut', 'Filmora']
  }
];
