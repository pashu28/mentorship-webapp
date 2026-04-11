import AppLayout from "@/components/feature/AppLayout";
import TutorSidebar from "@/pages/tutor/components/TutorSidebar";
import TutorChat from "@/pages/tutor/components/TutorChat";
import { useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

const STARTER_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "What is UX Research?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    messages: [
      {
        id: "m1",
        role: "user",
        text: "What is UX Research and why does it matter?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      },
      {
        id: "m2",
        role: "ai",
        text: "UX Research is the systematic study of your users — their behaviors, needs, motivations, and pain points — so you can design products that actually solve real problems.\n\nWithout research, you're just guessing. With it, every design decision is grounded in evidence.\n\n**Why it matters:**\n- Reduces costly redesigns by catching problems early\n- Builds empathy for users across your whole team\n- Gives you data to back up design decisions to stakeholders\n- Leads to products people actually want to use\n\n**Common methods include:**\n- User interviews (qualitative, deep insights)\n- Surveys (quantitative, broad patterns)\n- Usability testing (watching people use your product)\n- Card sorting (understanding mental models)\n- Analytics review (what users actually do vs. what they say)\n\nWant me to go deeper on any of these methods?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 5000),
      },
    ],
  },
  {
    id: "c2",
    title: "Figma Auto Layout tips",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    messages: [
      {
        id: "m3",
        role: "user",
        text: "Give me some pro tips for Figma Auto Layout",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
      {
        id: "m4",
        role: "ai",
        text: "Here are the Auto Layout tips that'll level up your Figma game:\n\n**1. Shift+A is your best friend**\nSelect any group of elements and hit Shift+A to instantly wrap them in an Auto Layout frame. Way faster than the right-click menu.\n\n**2. Use \"Hug\" and \"Fill\" strategically**\n- Set the frame to \"Hug contents\" so it resizes with its children\n- Set children to \"Fill container\" to stretch them to fill available space\n- This combo is how you build truly responsive components\n\n**3. Nested Auto Layouts = Flexbox power**\nJust like CSS Flexbox, you can nest Auto Layout frames inside each other. Horizontal inside vertical, vertical inside horizontal — this is how complex layouts stay flexible.\n\n**4. Gap between items**\nUse the gap setting instead of manually spacing elements. When you add or remove items, the spacing adjusts automatically.\n\n**5. Absolute position for overlays**\nNeed a badge or icon that floats over a card? Set it to \"Absolute position\" inside an Auto Layout frame — it won't affect the flow of other elements.\n\nWhich of these do you want to practice first?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5 + 5000),
      },
    ],
  },
];

const SUGGESTED_TOPICS = [
  { icon: "ri-palette-line", label: "Design Systems", prompt: "Explain design systems and how to build one from scratch" },
  { icon: "ri-user-heart-line", label: "User Empathy", prompt: "How do I build genuine empathy for users in my design process?" },
  { icon: "ri-bar-chart-line", label: "UX Metrics", prompt: "What metrics should I track to measure UX success?" },
  { icon: "ri-layout-masonry-line", label: "Layout Principles", prompt: "Teach me the core visual layout principles every designer should know" },
  { icon: "ri-search-eye-line", label: "Usability Testing", prompt: "How do I run a usability test on a tight budget?" },
  { icon: "ri-file-text-line", label: "Case Studies", prompt: "What makes a UX case study stand out to recruiters?" },
  { icon: "ri-contrast-2-line", label: "Accessibility", prompt: "What are the most important accessibility rules for UI design?" },
  { icon: "ri-flow-chart", label: "User Flows", prompt: "How do I map out user flows effectively?" },
];

const AI_RESPONSES: Record<string, string> = {
  default: "That's a great question! Let me break it down for you.\n\nUX design is all about understanding the gap between what users expect and what they actually experience. The best designers are obsessive about that gap — they research it, prototype solutions, test them, and iterate.\n\nCould you tell me more about what specifically you're trying to learn or solve? I can give you a much more targeted answer.",
  figma: "Figma is the industry-standard design tool right now — and for good reason. Here's what makes it powerful:\n\n**Core features to master:**\n- **Auto Layout** — like CSS Flexbox, makes components resize automatically\n- **Components & Variants** — reusable elements that update globally\n- **Styles** — shared colors, typography, and effects\n- **Prototyping** — link frames to simulate user flows\n\n**Pro workflow tips:**\n1. Always design in components from day one\n2. Use a consistent 8px grid system\n3. Name your layers properly — future you will thank you\n4. Use Figma's built-in accessibility checker\n\nWhat aspect of Figma are you working on right now?",
  portfolio: "A strong UX portfolio tells a story — not just shows pretty screens. Here's the formula:\n\n**Each case study should cover:**\n1. **The Problem** — What was broken? Back it with data if possible\n2. **Your Process** — Research → Ideation → Wireframes → Testing → Iteration\n3. **Key Decisions** — Why did you choose this approach over alternatives?\n4. **The Outcome** — Metrics, user feedback, business impact\n\n**Common mistakes to avoid:**\n- Only showing final designs (show the messy middle too)\n- No context for why decisions were made\n- Too many projects — 3 great ones beat 10 mediocre ones\n- No measurable outcomes\n\nWhat project are you thinking of featuring?",
  research: "UX Research is the backbone of good design. Without it, you're just guessing.\n\n**The main research methods:**\n\n**Generative (discover problems):**\n- User interviews — deep qualitative insights\n- Diary studies — understand behavior over time\n- Contextual inquiry — observe users in their environment\n\n**Evaluative (test solutions):**\n- Usability testing — watch people use your product\n- A/B testing — compare two versions with real data\n- First-click testing — see where users click first\n\n**Quick wins for beginners:**\nStart with 5 user interviews. You'll hear the same problems repeated — that's your signal. Then build a simple prototype and test it with 5 more people.\n\nWhat stage of research are you at?",
};

function getAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("figma") || lower.includes("auto layout") || lower.includes("component")) return AI_RESPONSES.figma;
  if (lower.includes("portfolio") || lower.includes("case study") || lower.includes("resume")) return AI_RESPONSES.portfolio;
  if (lower.includes("research") || lower.includes("user interview") || lower.includes("usability")) return AI_RESPONSES.research;
  return AI_RESPONSES.default;
}

export default function TutorPage() {
  const [conversations, setConversations] = useState<Conversation[]>(STARTER_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeConvId) ?? null;

  const handleNewChat = () => {
    setActiveConvId(null);
  };

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
  };

  const handleDeleteConv = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) setActiveConvId(null);
  };

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date(),
    };

    if (!activeConvId) {
      // Create new conversation
      const newConv: Conversation = {
        id: `c-${Date.now()}`,
        title: text.length > 40 ? text.slice(0, 40) + "…" : text,
        messages: [userMsg],
        createdAt: new Date(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(newConv.id);
      setIsTyping(true);
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `m-${Date.now() + 1}`,
          role: "ai",
          text: getAIResponse(text),
          timestamp: new Date(),
        };
        setConversations((prev) =>
          prev.map((c) => (c.id === newConv.id ? { ...c, messages: [...c.messages, aiMsg] } : c))
        );
        setIsTyping(false);
      }, 1400);
    } else {
      // Append to existing conversation
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, messages: [...c.messages, userMsg] } : c
        )
      );
      setIsTyping(true);
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `m-${Date.now() + 1}`,
          role: "ai",
          text: getAIResponse(text),
          timestamp: new Date(),
        };
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId ? { ...c, messages: [...c.messages, aiMsg] } : c
          )
        );
        setIsTyping(false);
      }, 1400);
    }
  };

  return (
    <AppLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <TutorSidebar
          conversations={conversations}
          activeConvId={activeConvId}
          onNewChat={handleNewChat}
          onSelectConv={handleSelectConv}
          onDeleteConv={handleDeleteConv}
        />

        {/* Main chat area */}
        <TutorChat
          conversation={activeConversation}
          isTyping={isTyping}
          suggestedTopics={SUGGESTED_TOPICS}
          onSendMessage={handleSendMessage}
        />
      </div>
    </AppLayout>
  );
}
