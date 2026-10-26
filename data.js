// Content for the profile page: the life timeline at the bottom and the tiles above it.
//
// Dates are "YYYY-MM". A part or milestone without `end` is a single point in time.
// `open` on a timeline part opens that tile's story when clicked.

window.TIMELINE = {
  start: '2000-01',
  end: '2027-06',

  // One continuous line. Each era has a colour; the line blends between them in the gaps.
  eras: [
    { id: 'early', from: '2000-01', to: '2018-07', color: 'neutral' },
    {
      id: 'bachelor', from: '2018-08', to: '2022-06', color: 'study',
      label: 'B.E. Mechanical', title: 'B.E. Mechanical Engineering', years: '2018 – 2022',
      parts: [
        { title: 'B.E. Mechanical Engineering', start: '2018-08', end: '2022-06', kind: 'study', open: 'rcoem' },
        { title: 'SAE E-Baja Team Lead', start: '2019-06', end: '2022-06', kind: 'team', open: 'sae' },
        { title: 'Honours in Mechanical Engineering', short: 'Honours', start: '2020-08', end: '2022-06', kind: 'study', open: 'rcoem' },
        { title: 'Maha Metro internship', start: '2021-06', end: '2021-07', kind: 'work', open: 'internships' },
        { title: 'Neema Forgings internship', start: '2022-01', end: '2022-06', kind: 'work', open: 'internships' },
        { title: 'WAAM thesis', start: '2022-04', kind: 'project', open: 'rcoem' }
      ]
    },
    {
      id: 'mahindra', from: '2022-08', to: '2024-04', color: 'work',
      label: 'Mahindra · Automotive R&D', title: 'Mahindra & Mahindra · Automotive R&D', years: '2022 – 2024',
      parts: [
        { title: 'Graduate Engineer Trainee', start: '2022-08', end: '2022-12', kind: 'work', open: 'mahindra' },
        { title: 'Assistant Manager – Product Development', start: '2023-01', end: '2024-04', kind: 'work', open: 'mahindra' }
      ]
    },
    {
      id: 'masters', from: '2024-10', to: '2027-03', color: 'study',
      label: 'M.Eng. · Germany', title: 'M.Eng. in Germany', years: '2024 – 2027',
      parts: [
        { title: 'M.Eng. Automotive Production Engineering', start: '2024-10', end: '2027-03', kind: 'study', open: 'thi' }
      ]
    }
  ],

  // Shown as dots on the line, with the text only on hover
  milestones: [
    { date: '2021-03', type: 'Patent · granted', title: 'A Device for Generating Profiles on Pipes', meta: 'Indian Patent No. 484900 · 2021' },
    { date: '2021-09', type: 'Patent · granted', title: 'A Device for Making Flower Garlands', meta: 'Indian Patent No. 414916 · 2021' },
    { date: '2022-03', type: 'Journal publication', title: 'Design & Analysis of an ATV Suspension System using LOTUS', meta: 'ARAI Journal of Mobility and Technology · 2022' }
  ]
};

// Tiles, grouped into the page's sections (`group`), in the order they appear.
// A tile shows `logos` (image files), a `mono` text badge, or an `icon`.
// `span: 2` makes it two columns wide; `tall` makes it two rows high.
// `facts` is a short at-a-glance list at the top of the story (scope, team, tools...).
// `story` is the step-by-step journey that opens on click.
window.TILES = [
  // ---------- Experience & education ----------
  {
    id: 'mahindra', group: 'experience', span: 2, color: 'work',
    logos: ['images/logos/mahindra.svg'],
    kicker: 'Work · 2022 – 2024',
    title: 'Mahindra & Mahindra',
    teaser: 'Close to two years taking EV components from CAD to series production, and running the suppliers, changes and teams around them.',
    more: 'See the journey',
    facts: [
      { k: 'Roles', v: 'Graduate Engineer Trainee → Assistant Manager – Product Development' },
      { k: 'Platforms', v: 'BE6 and BE9e electric SUVs' },
      { k: 'Scope', v: '~150 parts, ~20 suppliers' }
    ],
    story: [
      { when: 'Aug 2022', title: 'Graduate Engineer Trainee', text: 'Joined product development for Mahindra\'s electric vehicle programmes.' },
      { when: 'Jan 2023', title: 'Assistant Manager – Product Development', text: 'Took over cooling-system hoses, plastic ducts and NVH components for the BE6 and BE9e platforms, from CAD to series production.' },
      { title: 'Prototype builds for two EV platforms', text: 'Coordinated R&D, purchasing, quality, manufacturing and suppliers for the builds, and ran ECR/ECN, BOM and product data for ~150 parts.', open: 'pm-builds' },
      { title: 'India\'s first PA12 corrugated cooling pipes', text: 'Led the localisation with NORMA Group\'s teams in India and Germany.', open: 'pm-pa12' },
      { title: 'From RFQ to purchase order', text: 'Sourced, negotiated and contracted Tier-1 suppliers across India, Europe and China.', open: 'pm-sourcing' },
      { title: 'NW16 quick-fix connectors', text: 'Developed connectors with an integrated temperature sensor and drainage features.' },
      { title: 'Quality gates', text: 'DFMEA, APQP and PPAP documentation, root-cause analysis (8D, 5 Why, Ishikawa), and CMM and Cp/Cpk checks on prototype parts before assembly.' },
      { title: 'Reporting that runs itself', text: 'Power BI, Power Automate and Power Apps tools that cut reporting time by ~30%.', open: 'pm-digital' },
      { when: 'Apr 2024', title: 'On to Germany', text: 'Left after close to two years to start my M.Eng. in Ingolstadt.' }
    ],
    tags: ['EV programmes', 'Project coordination', 'Supplier management', 'DFMEA', 'PPAP', 'SAP MM', 'Teamcenter', 'Power BI']
  },
  {
    id: 'thi', group: 'experience', span: 1, color: 'study',
    logos: ['images/logos/thi.png'],
    kicker: 'M.Eng. · 2024 – 2027',
    title: 'TH Ingolstadt',
    teaser: 'M.Eng. Automotive Production Engineering.',
    more: 'See the journey',
    story: [
      { when: '2024', title: 'Started the M.Eng. Automotive Production Engineering', text: 'Cost engineering & risk management, production & logistics networks, automation & equipment technology, production system & plant design, and technology & innovation management.' },
      { when: '2026', title: 'Thesis on robot learning', text: '"Study on AI robot training and control methods for multiple multi-axis systems."', open: 'thesis' },
      { when: '2027', title: 'Expected graduation' }
    ]
  },
  {
    id: 'rcoem', group: 'experience', span: 1, color: 'study',
    mono: 'RCOEM',
    kicker: 'B.E. · 2018 – 2022',
    title: 'RCOEM, Nagpur',
    teaser: 'B.E. and Honours in Mechanical Engineering.',
    more: 'See the journey',
    story: [
      { when: '2018', title: 'Started B.E. Mechanical Engineering', text: 'Shri Ramdeobaba College of Engineering and Management, Nagpur.' },
      { when: '2019', title: 'Joined SAE E-Baja · Trident Racing', text: 'Later led the team.', open: 'sae' },
      { when: '2020', title: 'Honours in Mechanical Engineering', text: 'Digital manufacturing, turbomachinery, tribology, heat exchanger design and tool design.' },
      { when: '2021 · Patent granted', title: 'A Device for Generating Profiles on Pipes', text: 'Indian Patent No. 484900' },
      { when: '2021 · Patent granted', title: 'A Device for Making Flower Garlands', text: 'Indian Patent No. 414916' },
      { when: '2022 · Journal publication', title: 'Design & Analysis of an ATV Suspension System using LOTUS', text: 'ARAI Journal of Mobility and Technology' },
      { when: '2022', title: 'Thesis: Wire Arc Additive Manufacturing', text: '"Strength assessment of parts manufactured by Wire Arc Additive Manufacturing." Trials with a Yaskawa AR1440 6-axis robot on process parameters, deposition behaviour, bead geometry and defects.' }
    ]
  },
  {
    id: 'sae', group: 'experience', span: 1, color: 'team',
    mono: 'TR',
    kicker: 'Team Lead · 2019 – 2022',
    title: 'SAE E-Baja · Trident Racing',
    teaser: 'Leading a student team that designs, builds and tests an ATV.',
    more: 'See the journey',
    story: [
      { title: 'Vehicle dynamics', text: 'Led multibody analysis of the rollcage, suspension geometry and steering across scenarios, and validated vehicle dynamics in IPG CarMaker and MSC Adams.' },
      { title: 'FEM of rollcage & suspension brackets', text: 'Static and explicit ANSYS analysis (von Mises stress, deformation) to trade weight against stiffness.' },
      { title: 'Making the parts', text: 'Machined suspension and powertrain parts on CNC/VMC, from design to validation, and re-made them when testing showed they had to change.' }
    ],
    tags: ['MSC Adams', 'IPG CarMaker', 'ANSYS', 'CNC']
  },
  {
    id: 'internships', group: 'experience', span: 1, color: 'work',
    logos: ['images/logos/maha-metro.svg'], mono: 'NF',
    kicker: 'Internships · 2021 – 2022',
    title: 'Maha Metro & Neema Forgings',
    teaser: 'Rolling-stock testing and machine design.',
    more: 'See the journey',
    story: [
      { when: 'Jun – Jul 2021', title: 'Maharashtra Metro Rail · Rolling Stock Maintenance', text: 'Tested a gearbox prototype while monitoring its temperature behaviour in real time, took part in wheel flange lubrication system testing, and supported rolling-stock diagnostics.' },
      { when: 'Jan – Jun 2022', title: 'Neema Forgings · Machine Design & Development', text: 'Ran CAD fitment, tolerance and interference analysis, kept revision-controlled drawings, and sourced standard and custom parts with vendors.' }
    ]
  },
  {
    id: 'thesis', group: 'experience', span: 2, color: 'project', icon: 'robot',
    kicker: 'M.Eng. thesis · ongoing',
    title: 'A robot arm that learns',
    teaser: 'PPO written from scratch in NumPy teaches a 4-joint arm in PyBullet to reach targets. Next: dodging obstacles, and one policy for many robot shapes.',
    more: 'See the journey',
    story: [
      { title: 'The question', text: '"Study on AI robot training and control methods for multiple multi-axis systems."' },
      { title: 'Built from scratch', text: 'A PPO pipeline in plain NumPy, with hand-derived backpropagation, GAE, the clipped surrogate objective and Adam.' },
      { title: 'First result', text: 'After 4,000 training iterations, the 4-joint arm reaches held-out targets to within 11.8 cm.' },
      { title: 'A bug worth telling', text: 'The arm kept getting penalised for touching obstacles its own sensors said were far away. The observation measured clearance to the nearest joint, while the reward used the real link surfaces, so an obstacle 5 cm from the middle of a link read as ~25.5 cm. Switching to point-to-segment distance made the two agree.' },
      { title: 'Next', text: 'Obstacle avoidance, and a policy that generalises across link lengths and joint counts using graph and attention architectures, building on NerveNet, SMP, Amorpheus and MetaMorph.' }
    ],
    tags: ['Python', 'NumPy', 'PyBullet', 'PPO', 'Reinforcement learning']
  },

  // ---------- Project management case studies ----------
  {
    id: 'pm-builds', group: 'pm', span: 1, color: 'work', icon: 'layers',
    kicker: 'Case study · Mahindra',
    title: 'Prototype builds for two EV platforms',
    teaser: '~150 parts from ~20 suppliers, kept moving through design changes for the BE6 and BE9e builds.',
    more: 'Read the case study',
    facts: [
      { k: 'My role', v: 'Assistant Manager – Product Development' },
      { k: 'Scope', v: '~150 parts · ~20 suppliers · BE6 & BE9e' },
      { k: 'Team', v: 'R&D, purchasing, quality, manufacturing and suppliers, in a matrix organisation' },
      { k: 'Tools', v: 'Teamcenter, SAP, Excel/VBA, Power BI' }
    ],
    story: [
      { title: 'Challenge', text: 'Prototype builds for two new electric platforms depended on parts from many suppliers while the designs were still changing.' },
      { title: 'My part', text: 'I owned the engineering change process (ECR/ECN), BOM and product data for my components, and coordinated the teams involved in each build.' },
      { title: 'Approach', text: 'Daily part tracking and change management in SAP. PIST reports followed every part\'s inspection status and nonconformities between R&D, the prototype shop, procurement and suppliers. I also supported prototype production scheduling.' },
      { title: 'Changes and old stock', text: 'When a part changed, I decided what happened to the existing stock (rework, use up or scrap), including write-offs.' },
      { title: 'Budget and risk', text: 'Supported cost tracking for proto-tooling and deviation budgets, and wrote decision papers that summarised risks and budget deviations for leadership.' },
      { title: 'What it taught me', text: 'An innovation only counts once engineering, suppliers, purchasing and logistics can all deliver it.' }
    ]
  },
  {
    id: 'pm-pa12', group: 'pm', span: 1, color: 'work', icon: 'handshake',
    kicker: 'Case study · Mahindra × NORMA Group',
    title: 'Localising PA12 cooling pipes',
    teaser: 'India\'s first use of PA12 corrugated pipes, replacing EPDM hoses in battery and motor cooling.',
    more: 'Read the case study',
    facts: [
      { k: 'My role', v: 'Led the localisation' },
      { k: 'Partner', v: 'NORMA Group, India and Germany' },
      { k: 'Stakeholders', v: 'R&D, purchasing, leadership' },
      { k: 'Outcome', v: 'First implementation of this technology in India' }
    ],
    story: [
      { title: 'Challenge', text: 'PA12 corrugated plastic pipes were not yet made in India. Replacing EPDM hoses meant convincing a supplier that localising was worth it.' },
      { title: 'Approach', text: 'Kept NORMA\'s India and Germany teams, our R&D, purchasing and leadership aligned on one plan. Communication between all of them is what made the deal happen.' },
      { title: 'The long-term view', text: 'As a team we showed NORMA where our EV programmes were heading, and that older projects could be upgraded to PA12 too, so localising in India made sense beyond a single order.' },
      { title: 'Result', text: 'The first implementation of PA12 corrugated cooling pipes in India, for battery and motor cooling systems.' },
      { title: 'What it taught me', text: 'A supplier commits when they can see the whole road ahead, not just the next order.' }
    ]
  },
  {
    id: 'pm-sourcing', group: 'pm', span: 1, color: 'work', icon: 'scale',
    kicker: 'Case study · Mahindra',
    title: 'Supplier sourcing from RFQ to PO',
    teaser: 'Comparing quotations, negotiating terms and contracting Tier-1 suppliers for EV components.',
    more: 'Read the case study',
    facts: [
      { k: 'My role', v: 'Technical-commercial interface between R&D and procurement' },
      { k: 'Parts', v: 'Cooling (EPT) and NVH components' },
      { k: 'Suppliers', v: 'India, Europe and China' }
    ],
    story: [
      { title: 'Challenge', text: 'Each RFQ brought several quotations that differed on cost, technical feasibility and manufacturing capability.' },
      { title: 'Evaluating', text: 'Assessed each quotation on cost, feasibility and capability, and benchmarked suppliers on cost, quality and regulatory compliance across India, Europe and China.' },
      { title: 'Negotiating and contracting', text: 'Negotiated price and terms with the shortlisted suppliers and took the contracts from RFQ through to purchase order.' },
      { title: 'When things went wrong', text: 'Ran supplier audits and 8D root-cause analysis on recurring defects, and handled supplier claims.' }
    ]
  },
  {
    id: 'pm-digital', group: 'pm', span: 1, color: 'work', icon: 'chart',
    kicker: 'Case study · Mahindra',
    title: 'Rolling out reporting automation',
    teaser: 'Dashboards and flows built in sprints with their users, cutting reporting time by ~30%.',
    more: 'Read the case study',
    facts: [
      { k: 'Method', v: 'Sprints with user stories from stakeholders' },
      { k: 'Users', v: 'R&D and procurement' },
      { k: 'Tools', v: 'Power BI, Power Automate, Power Apps, SharePoint, Excel/VBA' },
      { k: 'Result', v: '~30% less reporting time' }
    ],
    story: [
      { title: 'Challenge', text: 'Build and supplier status was consolidated by hand from many sources.' },
      { title: 'Approach', text: 'Collected requirements as user stories and built in sprints: Power Automate flows on SharePoint lists, Power Apps prototypes, and Power BI dashboards for build status, supplier readiness and milestones.' },
      { title: 'Adoption', text: 'Ran demos and guidance sessions for R&D and procurement, and tracked how the dashboards were being used.' },
      { title: 'Result', text: 'Reporting time fell by ~30%.' }
    ]
  },

  // ---------- Data analysis ----------
  {
    id: 'data-kpi', group: 'data', span: 2, color: 'project', icon: 'chart',
    kicker: 'Data analysis · Mahindra',
    title: 'KPI dashboards for prototype builds',
    teaser: 'One view of part readiness, shortages, supplier maturity and milestones, replacing manual status reports.',
    more: 'See how',
    facts: [
      { k: 'Question', v: 'Is each build on track, and which parts and suppliers put it at risk?' },
      { k: 'Data', v: 'SAP exports, SharePoint lists, build trackers' },
      { k: 'Tools', v: 'Power BI, Excel/VBA, Power Automate' },
      { k: 'Impact', v: '~30% less reporting time' }
    ],
    story: [
      { title: 'Problem', text: 'Leadership needed the status of each prototype build, and that status lived in many separate trackers.' },
      { title: 'What the dashboards track', text: 'Part readiness %, shortages, supplier performance and maturity, and milestone adherence for each build.' },
      { title: 'How', text: 'Excel/VBA trackers first, then Power BI dashboards fed by Power Automate flows, replacing manual consolidation.' },
      { title: 'Impact', text: 'Reporting time fell by ~30%.' }
    ]
  },
  {
    id: 'data-suppliers', group: 'data', span: 1, color: 'project', icon: 'search',
    kicker: 'Data analysis · Mahindra',
    title: 'Supplier performance & quality',
    teaser: 'Production data, defect trends and delivery performance of ~20 suppliers.',
    more: 'See how',
    story: [
      { title: 'Supplier analysis', text: 'Analysed production data, defect trends and delivery performance of ~20 suppliers to support sourcing and quality decisions.' },
      { title: 'Process capability', text: 'Cp/Cpk analysis on critical components to judge manufacturing stability.' },
      { title: 'Ad-hoc questions', text: 'Analysis of supplier delays, capacity bottlenecks and cost overruns when decisions needed them, plus cost-performance and benchmarking studies.' }
    ],
    tags: ['Excel', 'Power BI', 'Cp/Cpk', 'Statistics']
  },
  {
    id: 'data-layout', group: 'data', span: 1, color: 'project', icon: 'factory',
    kicker: 'Production planning · Mahindra',
    title: 'Takt time & layout study',
    teaser: 'Using MTM and takt time to rethink an assembly area.',
    more: 'See how',
    story: [
      { title: 'Layout', text: 'Assisted in plant layout planning: positioning storage locations around assembly to raise worker efficiency, using MTM (Methods-Time Measurement) studies.' },
      { title: 'Capacity', text: 'Calculated the takt time and proposed adding two parallel lines to cut overall throughput time and meet demand.' }
    ],
    tags: ['MTM', 'Takt time', 'Line balancing']
  },
  {
    id: 'data-scv', group: 'data', span: 2, color: 'project', icon: 'network',
    kicker: 'Personal project · also used at Mahindra',
    title: 'Supply Chain Network Visualizer',
    teaser: 'Upload an SAP stock export and see where every part sits in the network, animated over time.',
    more: 'See how',
    story: [
      { title: 'Problem', text: 'Finding out where stock actually was meant digging through SAP and exporting data by hand every day.' },
      { title: 'What it does', text: 'Reads a standard Excel or CSV export from SAP and draws the supply network: flows animate along the links, a date and time slider steps through any day, and a part filter highlights one part number\'s path.' },
      { title: 'Built with', text: 'Plain HTML, CSS and JavaScript with a visual network editor, groups, saved layouts and undo/redo.' }
    ],
    tags: ['JavaScript', 'SAP data', 'Data viz'],
    links: [
      { label: 'Live demo', url: 'https://an1me5h.github.io/SupplyChain-visualizer/' },
      { label: 'Code', url: 'https://github.com/An1me5h/SupplyChain-visualizer' }
    ]
  },
  {
    id: 'data-python', group: 'data', span: 2, color: 'project', icon: 'code',
    kicker: 'Data analysis · Mahindra',
    title: 'Python tools for test data',
    teaser: 'Scripts that took over manual reporting and watched prototype test datasets, saving ~10 hours a week.',
    more: 'See how',
    story: [
      { title: 'Problem', text: 'Prototype testing produced datasets that were checked and reported by hand.' },
      { title: 'Approach', text: 'Python scripts and Excel tools to automate the reporting workflows and monitor the testing datasets.' },
      { title: 'Impact', text: 'Saved ~10 hours a week.' }
    ],
    tags: ['Python', 'Pandas', 'Excel']
  },

  // ---------- Projects ----------
  {
    id: 'games', group: 'projects', span: 2, tall: true, color: 'project', icon: 'gamepad',
    kicker: 'Game development',
    title: 'Games I\'ve made',
    teaser: 'STOCKPILE, a logistics tycoon played on a real map, and the scene maker built for its story.',
    list: ['STOCKPILE', 'STOCKPILE Scene Maker'],
    more: 'See the games',
    story: [
      { when: 'Apr – Sep 2026', title: 'STOCKPILE', text: 'A competitive beer-logistics tycoon on a real, fully offline map of the Heilbronn–Heidelberg–Mannheim region. You found a company and build a supply chain from factory to distributor, wholesaler and bar. Trucks drive real roads using A* routing, and you compete on price against AI rivals and online players for a population with its own demand model. Plain JavaScript with its own canvas map engine.', tags: ['JavaScript', 'Canvas', 'A* pathfinding', 'Game economy', 'Multiplayer'] },
      { when: 'Sep 2026', title: 'STOCKPILE Scene Maker', text: 'A standalone tool for composing the game\'s story scenes: hand-arranged isometric views of the café and its yard, with animations, custom parts and autosave.', tags: ['JavaScript', 'Isometric', 'Tools'] }
    ]
  },
  {
    id: 'simulation', group: 'projects', span: 1, color: 'project', icon: 'atom',
    kicker: 'Projects',
    title: 'Simulation & AI',
    teaser: 'F1 race strategy, 3D atoms, evolving robots, neural networks.',
    more: 'See the projects',
    story: [
      { when: 'Mar 2026', title: 'Neural network from scratch', text: 'A handwritten-digit classifier using only NumPy: one hidden layer, ReLU and softmax, with backpropagation and gradient descent written by hand.', tags: ['Python', 'NumPy'] },
      { when: 'Jun 2026', title: 'AtomViz', text: 'An interactive 3D atom viewer. Enter proton and electron counts and it fills orbitals by the aufbau rule, samples each electron cloud with Monte Carlo and renders it in PyVista, with nodal surfaces, a live simulation and a Bohr model.', tags: ['Python', 'PyVista', 'Physics'] },
      { when: 'Jun – Jul 2026', title: 'PyBullet robotics lab', text: 'Side experiments next to the thesis: a cart-pole balancer trained with a from-scratch Cross-Entropy Method, and EvoReacher, where a genetic algorithm evolves a creature\'s body and gait together until it walks 2 m to a target.', tags: ['PyBullet', 'Genetic algorithms'] },
      { when: 'Aug 2026', title: 'F1 Race Strategy Engine', text: 'A lap-by-lap Formula 1 race simulator built on Heilmeier et al. (ITSC 2018): tyre wear, fuel, pit stops, overtaking and safety cars, with Monte Carlo win probabilities, a strategy optimiser and a live race window.', tags: ['Python', 'Monte Carlo', 'Motorsport'] },
      { when: 'Aug 2026', title: 'NNVisualizer', text: 'Drop any .npz file on the page to see the neural network inside drawn as a network, plus every array as readable data. No libraries: the file is unzipped and decompressed by hand in the browser.', tags: ['JavaScript'] }
    ]
  },
  {
    id: 'apps', group: 'projects', span: 1, color: 'project', icon: 'code',
    kicker: 'Projects',
    title: 'Apps & tools I built',
    teaser: 'Things I built because I wanted them to exist.',
    more: 'See the projects',
    story: [
      { when: 'Jul – Aug 2026', title: 'Code Visualizer', text: 'Turns a folder of Python or JavaScript files into one node graph: every function, class and variable becomes a card on a pan-and-zoom canvas, with arrows showing how data flows. Also built as an installable Windows app.', tags: ['JavaScript', 'Tauri'] },
      { when: 'Aug 2026', title: 'RemoteControl', text: 'Turns an Android phone into a wireless trackpad and keyboard for a Windows PC over local Wi-Fi, with auto-discovery and screen mirroring. Kotlin on the phone, a C# .NET 8 tray app on the PC.', tags: ['Kotlin', 'C#', 'Networking'],
        links: [{ label: 'Code', url: 'https://github.com/An1me5h/RemoteControl' }] }
    ]
  },
  {
    id: 'creative', group: 'projects', span: 2, color: 'project', icon: 'camera',
    kicker: 'Off the clock',
    title: 'Creative',
    teaser: 'Photo editing and video.',
    more: 'See more',
    story: [
      { when: '2024 – 2026', title: 'Photo editing & digital art', text: 'Photo composites and edits in Adobe Photoshop.', tags: ['Photoshop'] },
      { when: '2024 – 2026', title: 'Video editing', text: 'Travel films from Tegernsee, tennis edits and a stop-motion cake time-lapse, cut in DaVinci Resolve, CapCut and Filmora.', tags: ['DaVinci Resolve', 'CapCut', 'Filmora'] }
    ]
  }
];
