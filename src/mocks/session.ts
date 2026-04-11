export const transcript = [
  { id: 1, speaker: "Sarah", role: "mentor", text: "Let's start by talking about your portfolio. What projects are you most proud of?", time: "0:32" },
  { id: 2, speaker: "You", role: "mentee", text: "I redesigned the onboarding flow for my current company and reduced drop-off by 34%.", time: "0:48" },
  { id: 3, speaker: "Sarah", role: "mentor", text: "That's a great case study. Make sure you document the process — check out nngroup.com for case study templates.", time: "1:15" },
  { id: 4, speaker: "Sarah", role: "mentor", text: "Also, I'd recommend going through the Google UX Design Certificate on Coursera. It's free and very structured.", time: "2:03" },
  { id: 5, speaker: "You", role: "mentee", text: "Should I focus on Figma or also learn Framer?", time: "2:45" },
  { id: 6, speaker: "Sarah", role: "mentor", text: "Figma first, 100%. Once you're comfortable, check out framer.com — it's great for prototyping. Also bookmark mobbin.com for UI inspiration.", time: "3:10" },
  { id: 7, speaker: "Sarah", role: "mentor", text: "For your next step, I'd suggest applying to the ADPList mentorship community. Great for networking.", time: "4:22" },
  { id: 8, speaker: "You", role: "mentee", text: "This is incredibly helpful. What should I prioritize this week?", time: "5:01" },
  { id: 9, speaker: "Sarah", role: "mentor", text: "Three things: finish one case study, complete 2 Figma tutorials, and reach out to 3 designers on LinkedIn.", time: "5:18" },
];

export const resourceVault = [
  { id: 1, title: "NNGroup Case Study Templates", url: "nngroup.com", icon: "ri-file-text-line", color: "bg-emerald-50 text-emerald-600" },
  { id: 2, title: "Google UX Design Certificate", url: "coursera.org", icon: "ri-graduation-cap-line", color: "bg-amber-50 text-amber-600" },
  { id: 3, title: "Framer — Interactive Prototyping", url: "framer.com", icon: "ri-layout-line", color: "bg-violet-50 text-violet-600" },
  { id: 4, title: "Mobbin — UI Inspiration Library", url: "mobbin.com", icon: "ri-image-line", color: "bg-rose-50 text-rose-600" },
  { id: 5, title: "ADPList Mentorship Community", url: "adplist.org", icon: "ri-team-line", color: "bg-sky-50 text-sky-600" },
];

export const roadmapSteps = [
  {
    id: 1,
    step: "Step 1",
    title: "Build Your Foundation",
    description: "Core UX skills and tools",
    color: "from-violet-500 to-violet-600",
    tasks: [
      { id: "t1", text: "Complete 2 Figma tutorials (Auto Layout + Components)", done: false },
      { id: "t2", text: "Read NNGroup article on UX case study structure", done: false },
      { id: "t3", text: "Watch Google UX Certificate Module 1", done: false },
    ],
  },
  {
    id: 2,
    step: "Step 2",
    title: "Document Your Work",
    description: "Create a compelling portfolio case study",
    color: "from-emerald-500 to-emerald-600",
    tasks: [
      { id: "t4", text: "Write the problem statement for your onboarding redesign", done: false },
      { id: "t5", text: "Export and organize all design artifacts from Figma", done: false },
      { id: "t6", text: "Draft the case study using NNGroup template", done: false },
    ],
  },
  {
    id: 3,
    step: "Step 3",
    title: "Expand Your Network",
    description: "Connect with the design community",
    color: "from-amber-500 to-amber-600",
    tasks: [
      { id: "t7", text: "Reach out to 3 UX designers on LinkedIn with personalized notes", done: false },
      { id: "t8", text: "Join ADPList and set up your mentee profile", done: false },
      { id: "t9", text: "Explore Mobbin for 30 min — save 10 UI patterns you love", done: false },
    ],
  },
];

export const goalRings = [
  { id: 1, label: "UX Foundations", percentage: 40, color: "stroke-violet-500", bg: "stroke-violet-100" },
  { id: 2, label: "Portfolio", percentage: 15, color: "stroke-emerald-500", bg: "stroke-emerald-100" },
  { id: 3, label: "Networking", percentage: 25, color: "stroke-amber-500", bg: "stroke-amber-100" },
];

export const aiTutorMessages = [
  {
    id: 1,
    role: "ai",
    text: "Hey! I see you want to learn about **Figma Auto Layout**. This is one of the most powerful features in Figma — let me break it down for you.",
    time: "now",
  },
  {
    id: 2,
    role: "ai",
    text: "Auto Layout lets you create frames that automatically resize based on their content. Think of it like CSS Flexbox — elements stack horizontally or vertically and adjust when content changes.",
    time: "now",
    code: `// Think of Auto Layout like this in CSS:
.container {
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 12px 24px;
  align-items: center;
}`,
  },
];
