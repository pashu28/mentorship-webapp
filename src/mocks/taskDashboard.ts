export type ResourceTag = "Video" | "PDF" | "Article" | "File" | "Link";

export interface TaskResource {
  id: string;
  title: string;
  url: string;
  type: ResourceTag;
  source: string;
}

export interface SubTaskItem {
  id: string;
  text: string;
  done: boolean;
}

export interface VerificationQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface MainTask {
  id: string;
  title: string;
  description: string;
  stepId: number;
  stepLabel: string;
  stepTitle: string;
  color: "violet" | "emerald" | "amber";
  resourceIcon: string;
  subTasks: SubTaskItem[];
  resources: TaskResource[];
  aiTips: string[];
  verificationQuestions: VerificationQuestion[];
  done: boolean;
}

export const mainTasks: MainTask[] = [
  {
    id: "t1",
    title: "Learn Figma Basics",
    description: "Master Auto Layout and Components — the two most essential Figma skills for building scalable, production-ready designs.",
    stepId: 1,
    stepLabel: "Step 1",
    stepTitle: "Build Your Foundation",
    color: "violet",
    resourceIcon: "ri-pen-nib-line",
    subTasks: [
      { id: "t1s1", text: "Open Figma and create a new file", done: false },
      { id: "t1s2", text: "Watch Auto Layout tutorial (20 min)", done: false },
      { id: "t1s3", text: "Practice with a button component", done: false },
      { id: "t1s4", text: "Watch Components tutorial (25 min)", done: false },
      { id: "t1s5", text: "Build a reusable card component", done: false },
    ],
    resources: [
      { id: "r1", title: "Figma Auto Layout — Official Docs", url: "figma.com/docs/auto-layout", type: "Article", source: "Figma" },
      { id: "r2", title: "Auto Layout Full Tutorial", url: "youtube.com/watch?v=figma-autolayout", type: "Video", source: "YouTube" },
      { id: "r3", title: "Components & Variants Guide", url: "figma.com/docs/components", type: "PDF", source: "Figma" },
      { id: "r4", title: "Figma Starter Kit", url: "figma.com/community/starter-kit", type: "File", source: "Figma Community" },
    ],
    aiTips: [
      "Auto Layout in Figma works like CSS Flexbox — elements stack and resize automatically. Start by selecting a frame, then enable Auto Layout from the right panel (or press Shift+A).",
      "Components are reusable design elements. Create a master component, then use instances throughout your design. Change the master and all instances update instantly — huge time saver!",
    ],
    verificationQuestions: [
      {
        question: "What does Auto Layout in Figma primarily help you do?",
        options: [
          "Add animations to your designs",
          "Create frames that resize automatically based on content",
          "Export designs to code",
          "Manage color styles",
        ],
        correct: 1,
        explanation: "Auto Layout creates frames that automatically resize when content changes — just like CSS Flexbox. It's one of Figma's most powerful features for building responsive components.",
      },
      {
        question: "Which of these is a key benefit of using Components in Figma?",
        options: [
          "They make files load faster",
          "They allow you to reuse design elements and update them globally",
          "They automatically generate code",
          "They replace the need for Auto Layout",
        ],
        correct: 1,
        explanation: "Components let you create a master element and reuse it across your design. Update the master and all instances update automatically — huge time saver!",
      },
    ],
    done: false,
  },
  {
    id: "t2",
    title: "Improve Resume Writing",
    description: "Learn how to write a compelling UX case study that showcases your process, not just your final designs — the way recruiters actually want to see it.",
    stepId: 1,
    stepLabel: "Step 1",
    stepTitle: "Build Your Foundation",
    color: "violet",
    resourceIcon: "ri-file-text-line",
    subTasks: [
      { id: "t2s1", text: "Go to nngroup.com/articles", done: false },
      { id: "t2s2", text: "Search for 'UX case study structure'", done: false },
      { id: "t2s3", text: "Read the article (15 min)", done: false },
      { id: "t2s4", text: "Take notes on key structure points", done: false },
    ],
    resources: [
      { id: "r1", title: "UX Case Study Structure — NNGroup", url: "nngroup.com/articles/ux-case-study", type: "Article", source: "NNGroup" },
      { id: "r2", title: "Case Study Template Download", url: "nngroup.com/templates/case-study", type: "PDF", source: "NNGroup" },
      { id: "r3", title: "Portfolio Review Checklist", url: "uxdesign.cc/portfolio-checklist", type: "Link", source: "UX Design" },
    ],
    aiTips: [
      "NNGroup case studies follow a clear structure: Problem → Research → Process → Solution → Outcomes. The key is showing your thinking, not just the final design.",
      "Your 34% drop-off stat is gold — lead with it in your problem statement. Data-backed problem statements immediately grab recruiter attention.",
    ],
    verificationQuestions: [
      {
        question: "According to NNGroup, what is the most important section of a UX case study?",
        options: [
          "The final visual designs",
          "The problem statement and your process",
          "The tools you used",
          "The number of screens designed",
        ],
        correct: 1,
        explanation: "NNGroup emphasizes that recruiters care most about HOW you think and solve problems — your process, research, and decision-making — not just the final visuals.",
      },
    ],
    done: false,
  },
  {
    id: "t3",
    title: "Understand UX Research Methods",
    description: "Get a structured foundation in UX design through Google's industry-recognized certificate program — free to audit on Coursera.",
    stepId: 1,
    stepLabel: "Step 1",
    stepTitle: "Build Your Foundation",
    color: "violet",
    resourceIcon: "ri-graduation-cap-line",
    subTasks: [
      { id: "t3s1", text: "Log in to Coursera", done: false },
      { id: "t3s2", text: "Enroll in Google UX Design Certificate", done: false },
      { id: "t3s3", text: "Complete Module 1 videos", done: false },
      { id: "t3s4", text: "Pass the Module 1 quiz", done: false },
    ],
    resources: [
      { id: "r1", title: "Google UX Design Certificate", url: "coursera.org/google-ux", type: "Video", source: "Coursera" },
      { id: "r2", title: "Module 1 Study Guide", url: "coursera.org/google-ux/module1", type: "PDF", source: "Coursera" },
      { id: "r3", title: "UX Design Glossary", url: "uxdesign.cc/glossary", type: "Article", source: "UX Design" },
    ],
    aiTips: [
      "Module 1 covers the fundamentals — what UX design is, the design process, and the role of a UX designer. It sets the foundation for everything that follows.",
      "The certificate is free to audit on Coursera. Focus on the quizzes and assignments — they reinforce the concepts much better than just watching videos.",
    ],
    verificationQuestions: [
      {
        question: "What is the main focus of Google UX Design Certificate Module 1?",
        options: [
          "Advanced Figma techniques",
          "Foundations of UX design and the design process",
          "Building a portfolio website",
          "Conducting usability tests",
        ],
        correct: 1,
        explanation: "Module 1 covers the fundamentals — what UX design is, the design process, and the role of a UX designer. It sets the foundation for everything that follows.",
      },
    ],
    done: false,
  },
  {
    id: "t4",
    title: "Write Your Problem Statement",
    description: "Craft a clear, data-backed problem statement for your onboarding redesign project — the foundation of every strong UX case study.",
    stepId: 2,
    stepLabel: "Step 2",
    stepTitle: "Document Your Work",
    color: "emerald",
    resourceIcon: "ri-edit-2-line",
    subTasks: [
      { id: "t4s1", text: "Review your onboarding redesign project", done: false },
      { id: "t4s2", text: "Identify the core user problem", done: false },
      { id: "t4s3", text: "Write a 2-sentence problem statement", done: false },
      { id: "t4s4", text: "Add supporting data (34% drop-off stat)", done: false },
    ],
    resources: [
      { id: "r1", title: "How to Write a Problem Statement", url: "nngroup.com/problem-statement", type: "Article", source: "NNGroup" },
      { id: "r2", title: "Problem Statement Examples", url: "uxdesign.cc/problem-statements", type: "Link", source: "UX Design" },
      { id: "r3", title: "Your Onboarding Redesign Notes", url: "#", type: "File", source: "Mentor Shared" },
    ],
    aiTips: [
      "Your problem statement formula: '[User type] needs [need] because [insight/data].' Example: 'New users need a clearer onboarding flow because 34% drop off before completing setup.'",
      "Keep it to 2-3 sentences max. Recruiters skim — make every word count.",
    ],
    verificationQuestions: [
      {
        question: "A strong problem statement should include:",
        options: [
          "The solution you plan to build",
          "The user, their need, and supporting data",
          "A list of competitors",
          "Your personal opinion about the problem",
        ],
        correct: 1,
        explanation: "A great problem statement identifies WHO has the problem, WHAT the problem is, and WHY it matters (backed by data). Your 34% drop-off stat is perfect supporting evidence!",
      },
    ],
    done: false,
  },
  {
    id: "t5",
    title: "Export & Organize Design Assets",
    description: "Export all your Figma screens and organize them into a clean folder structure — a professional habit that impresses hiring managers.",
    stepId: 2,
    stepLabel: "Step 2",
    stepTitle: "Document Your Work",
    color: "emerald",
    resourceIcon: "ri-folder-image-line",
    subTasks: [
      { id: "t5s1", text: "Open your Figma project file", done: false },
      { id: "t5s2", text: "Export all screens as PNG (2x)", done: false },
      { id: "t5s3", text: "Create a folder structure for assets", done: false },
      { id: "t5s4", text: "Label and organize all exported files", done: false },
    ],
    resources: [
      { id: "r1", title: "Figma Export Guide", url: "figma.com/docs/export", type: "Article", source: "Figma" },
      { id: "r2", title: "Asset Naming Conventions", url: "uxdesign.cc/naming-conventions", type: "PDF", source: "UX Design" },
    ],
    aiTips: [
      "In Figma, select all screens → right-click → Export. Choose PNG at 2x. Create folders: /screens, /components, /icons. Label files clearly: 01-onboarding-welcome.png",
      "Organized assets show professionalism. Recruiters and hiring managers often look at your file structure as a signal of how you work.",
    ],
    verificationQuestions: [
      {
        question: "Why should you export Figma assets at 2x resolution?",
        options: [
          "It makes files smaller",
          "It ensures crisp display on high-DPI (Retina) screens",
          "It's required for portfolio submissions",
          "It automatically compresses images",
        ],
        correct: 1,
        explanation: "2x (or @2x) exports ensure your designs look sharp on Retina and high-DPI displays. At 1x, images can appear blurry on modern screens.",
      },
    ],
    done: false,
  },
  {
    id: "t6",
    title: "Draft Your Case Study",
    description: "Use the NNGroup template to write a complete, structured case study for your onboarding redesign — ready to add to your portfolio.",
    stepId: 2,
    stepLabel: "Step 2",
    stepTitle: "Document Your Work",
    color: "emerald",
    resourceIcon: "ri-article-line",
    subTasks: [
      { id: "t6s1", text: "Download NNGroup case study template", done: false },
      { id: "t6s2", text: "Fill in the Overview section", done: false },
      { id: "t6s3", text: "Add your research and process section", done: false },
      { id: "t6s4", text: "Add final designs and outcomes", done: false },
      { id: "t6s5", text: "Proofread and finalize draft", done: false },
    ],
    resources: [
      { id: "r1", title: "NNGroup Case Study Template", url: "nngroup.com/templates", type: "PDF", source: "NNGroup" },
      { id: "r2", title: "Writing Outcomes Section", url: "nngroup.com/outcomes", type: "Article", source: "NNGroup" },
      { id: "r3", title: "Portfolio Case Study Examples", url: "uxdesign.cc/examples", type: "Link", source: "UX Design" },
    ],
    aiTips: [
      "Use the NNGroup template as a skeleton: Overview → Problem → Research → Process → Solution → Outcomes. Fill each section with your actual work.",
      "For your onboarding redesign: Problem = 34% drop-off. Research = user interviews or analytics. Process = wireframes → prototypes → testing. Outcome = improved completion rate.",
    ],
    verificationQuestions: [
      {
        question: "What should the 'Outcomes' section of your case study highlight?",
        options: [
          "All the design iterations you made",
          "Measurable results and what you learned",
          "The tools and software used",
          "Your personal design preferences",
        ],
        correct: 1,
        explanation: "Outcomes should show impact — metrics like 'reduced drop-off by 34%' or 'increased task completion by 20%'. Quantifiable results make your case study stand out.",
      },
    ],
    done: false,
  },
  {
    id: "t7",
    title: "Reach Out to 3 UX Designers",
    description: "Send personalized LinkedIn connection requests to 3 UX designers at companies you admire — the first step to building your professional network.",
    stepId: 3,
    stepLabel: "Step 3",
    stepTitle: "Expand Your Network",
    color: "amber",
    resourceIcon: "ri-linkedin-box-line",
    subTasks: [
      { id: "t7s1", text: "Search for UX designers at target companies", done: false },
      { id: "t7s2", text: "Write a personalized note for Designer 1", done: false },
      { id: "t7s3", text: "Write a personalized note for Designer 2", done: false },
      { id: "t7s4", text: "Write a personalized note for Designer 3", done: false },
      { id: "t7s5", text: "Send all 3 connection requests", done: false },
    ],
    resources: [
      { id: "r1", title: "LinkedIn Outreach Templates", url: "linkedin.com/outreach-guide", type: "Article", source: "LinkedIn" },
      { id: "r2", title: "Networking for UX Designers", url: "uxdesign.cc/networking", type: "Video", source: "YouTube" },
    ],
    aiTips: [
      "Template: 'Hi [Name], I came across your work at [Company] and was really impressed by [specific thing]. I'm transitioning into UX and would love to connect and learn from your journey.'",
      "Keep it under 3 sentences. Don't ask for anything in the first message — just connect. The conversation can grow from there.",
    ],
    verificationQuestions: [
      {
        question: "What makes a LinkedIn outreach message effective?",
        options: [
          "Keeping it generic so it applies to everyone",
          "Personalizing it with a specific reason you admire their work",
          "Asking for a job immediately",
          "Making it as long as possible",
        ],
        correct: 1,
        explanation: "Personalization is key. Mention something specific about their work or career path. People respond to genuine interest, not copy-paste templates.",
      },
    ],
    done: false,
  },
  {
    id: "t8",
    title: "Join ADPList Mentorship",
    description: "Set up your mentee profile on ADPList and connect with experienced UX designers who offer free mentorship sessions.",
    stepId: 3,
    stepLabel: "Step 3",
    stepTitle: "Expand Your Network",
    color: "amber",
    resourceIcon: "ri-team-line",
    subTasks: [
      { id: "t8s1", text: "Go to adplist.org and sign up", done: false },
      { id: "t8s2", text: "Upload your profile photo", done: false },
      { id: "t8s3", text: "Fill in your goals and background", done: false },
      { id: "t8s4", text: "Browse available mentors in UX", done: false },
    ],
    resources: [
      { id: "r1", title: "ADPList — Free Mentorship Platform", url: "adplist.org", type: "Link", source: "ADPList" },
      { id: "r2", title: "How to Get the Most from Mentorship", url: "adplist.org/guide", type: "Article", source: "ADPList" },
    ],
    aiTips: [
      "On ADPList, fill your profile completely — goals, background, what you're looking for. Mentors choose who to help based on your profile.",
      "Search for UX designers at companies you admire. Many offer free 30-min sessions. Book 2-3 to start — each conversation will teach you something different.",
    ],
    verificationQuestions: [
      {
        question: "What is ADPList primarily used for?",
        options: [
          "Selling design assets",
          "Connecting mentees with free mentors in tech and design",
          "Finding freelance design work",
          "Hosting design portfolios",
        ],
        correct: 1,
        explanation: "ADPList is a free mentorship platform where experienced designers and tech professionals offer their time to help others grow. It's a goldmine for career guidance!",
      },
    ],
    done: false,
  },
  {
    id: "t9",
    title: "Explore UI Patterns on Mobbin",
    description: "Spend 30 minutes on Mobbin exploring real-world UI patterns from top apps — save 10 patterns that inspire your design work.",
    stepId: 3,
    stepLabel: "Step 3",
    stepTitle: "Expand Your Network",
    color: "amber",
    resourceIcon: "ri-image-line",
    subTasks: [
      { id: "t9s1", text: "Open mobbin.com", done: false },
      { id: "t9s2", text: "Browse onboarding flows (10 min)", done: false },
      { id: "t9s3", text: "Browse navigation patterns (10 min)", done: false },
      { id: "t9s4", text: "Browse card layouts (10 min)", done: false },
      { id: "t9s5", text: "Save 10 patterns you love", done: false },
    ],
    resources: [
      { id: "r1", title: "Mobbin — UI Pattern Library", url: "mobbin.com", type: "Link", source: "Mobbin" },
      { id: "r2", title: "Building a Design Swipe File", url: "uxdesign.cc/swipe-file", type: "Article", source: "UX Design" },
    ],
    aiTips: [
      "On Mobbin, filter by category (Onboarding, Navigation, Cards, etc.) and platform (iOS/Android/Web). Screenshot patterns that solve problems similar to yours.",
      "Build a personal swipe file — a folder of UI patterns you love. Reference it when you're designing. The best designers steal (and improve) from the best.",
    ],
    verificationQuestions: [
      {
        question: "What is Mobbin best used for?",
        options: [
          "Creating wireframes",
          "Exploring real-world UI patterns and app screenshots for inspiration",
          "Generating design assets with AI",
          "Collaborating on Figma files",
        ],
        correct: 1,
        explanation: "Mobbin is a curated library of real app screenshots organized by pattern type. It's perfect for researching how top apps handle specific UI challenges.",
      },
    ],
    done: false,
  },
];

export const goalRingsData = [
  { id: 1, label: "UX Foundations", stepId: 1, color: "stroke-violet-600", bg: "stroke-violet-200" },
  { id: 2, label: "Portfolio", stepId: 2, color: "stroke-emerald-600", bg: "stroke-emerald-200" },
  { id: 3, label: "Networking", stepId: 3, color: "stroke-amber-500", bg: "stroke-amber-200" },
];
