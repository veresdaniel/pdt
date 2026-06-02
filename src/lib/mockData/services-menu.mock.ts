
/** Temporary: UX Services mega menu mock until backend provides categoryChildren. Remove injectServicesMenuCategories from layout when BE is ready. */
/** UX Services category mega menu: Discover, Define, Design, Develop, Training with description + services. */
export const uxServicesCategories: Object[] = [
  {
    icon: '1',
    title: 'Discover',
    description:
      '<p>During the <strong>Discover</strong> phase, we gather information about your organization, products, content, goals, and users. By immersing ourselves in your audience and market, we enhance our understanding of effective goal achievement.</p>',
    services: [
      { title: 'Stakeholder Interview', url: '/services/stakeholder-interview' },
      { title: 'Heuristics Analysis', url: '/services/heuristics-analysis' },
      { title: 'Business Goal and KPI Definition', url: '/services/business-goals-kpi' },
      { title: 'Analysis of Web Analytics (Like clicktale)', url: '/services/web-analytics' },
      { title: 'Ethnographic Research', url: '/services/ethnographic-research' },
      { title: 'Diary Study', url: '/services/diary-study' },
      { title: 'Mental Model Research', url: '/services/mental-model-research' },
      { title: 'Best Practice Research', url: '/services/best-practice-research' }
    ]
  },
  {
    icon: '2',
    title: 'Define',
    description:
      '<p>In the <strong>Define</strong> phase we synthesise findings into clear requirements, user personas, and success criteria so that design and development stay aligned with user and business goals.</p>',
    services: [
      { title: 'User Personas', url: '/services/user-personas' },
      { title: 'Journey Mapping', url: '/services/journey-mapping' },
      { title: 'Information Architecture', url: '/services/information-architecture' },
      { title: 'Requirements Definition', url: '/services/requirements' }
    ]
  },
  {
    icon: '3',
    title: 'Design',
    description:
      '<p>The <strong>Design</strong> phase turns insights into interfaces and flows: wireframes, prototypes, and design systems that are validated with users before build.</p>',
    services: [
      { title: 'Wireframing', url: '/services/wireframing' },
      { title: 'Prototyping', url: '/services/prototyping' },
      { title: 'UI Design', url: '/services/ui-design' },
      { title: 'Design Systems', url: '/services/design-systems' }
    ]
  },
  {
    icon: '4',
    title: 'Develop',
    description:
      '<p><strong>Develop</strong> brings designs to life with front-end implementation, component libraries, and close collaboration with engineering for quality and consistency.</p>',
    services: [
      { title: 'Front-end Development', url: '/services/frontend' },
      { title: 'Component Libraries', url: '/services/component-libraries' },
      { title: 'Design–Dev Handoff', url: '/services/handoff' }
    ]
  },
  {
    icon: '+',
    title: 'Training',
    description:
      '<p><strong>Training</strong> programmes upskill your team in UX research, design, and collaboration so you can sustain high-quality product development.</p>',
    services: [
      { title: 'UX Workshops', url: '/services/ux-workshops' },
      { title: 'Design Sprints', url: '/services/design-sprints' },
      { title: 'UX Maturity Assessment', url: '/services/ux-maturity' }
    ]
  },
  {
    icon: '+',
    title: 'Artificial Intelligence Services',
    description:
      '<p>AI in fintech is transforming the industry by enabling intelligent automation and personalized financial services. Agentic AI systems proactively manage tasks, while generative AI creates innovative solutions, enhancing decision-making and customer experiences.</p>',
    services: [
      { title: 'Agentic AI', url: '/' },
      { title: 'Generative UI/Sentient Design', url: '/' }
    ]
  }
];
