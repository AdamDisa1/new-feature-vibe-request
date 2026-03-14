import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

type ChatPhase = 'welcome' | 'conversation';

interface PostBuildMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface BuildStep {
  id: string;
  message: string;
  status: 'pending' | 'active' | 'completed';
}

interface UpsellChatState {
  // Panel visibility
  isUpsellPanelOpen: boolean;
  setIsUpsellPanelOpen: (open: boolean) => void;

  // Chat phase
  phase: ChatPhase;
  setPhase: (phase: ChatPhase) => void;

  // User message (first message that triggers conversation)
  userMessage: string;
  setUserMessage: (msg: string) => void;

  // Blueprint flow
  showBlueprint: boolean;
  setShowBlueprint: (show: boolean) => void;

  // Animation skip flags
  hasStreamed: boolean;
  setHasStreamed: (v: boolean) => void;
  blueprintStreamed: boolean;
  setBlueprintStreamed: (v: boolean) => void;

  // Build state
  appBuilt: boolean;
  setAppBuilt: (v: boolean) => void;
  buildSteps: BuildStep[];
  setBuildSteps: (steps: BuildStep[]) => void;
  buildDone: boolean;
  setBuildDone: (v: boolean) => void;

  // Widget build state
  widgetBuildPhase: 'idle' | 'building' | 'done';
  setWidgetBuildPhase: (phase: 'idle' | 'building' | 'done') => void;
  widgetBuildSteps: BuildStep[];
  setWidgetBuildSteps: (steps: BuildStep[]) => void;
  widgetBuildDone: boolean;
  setWidgetBuildDone: (v: boolean) => void;

  // Post-build
  hideCreatedDate: boolean;
  setHideCreatedDate: (v: boolean) => void;
  postBuildMessages: PostBuildMessage[];
  addPostBuildMessage: (msg: PostBuildMessage) => void;

  // Dashboard created (controls sidebar visibility)
  dashboardCreated: boolean;
  setDashboardCreated: (v: boolean) => void;

  // Summary mode (post-build redirect)
  summaryMode: boolean;
  setSummaryMode: (v: boolean) => void;

  // Coordination: chat signals when build steps can start
  readyForBuildSteps: boolean;
  setReadyForBuildSteps: (v: boolean) => void;

  // Chat input
  chatInputValue: string;
  setChatInputValue: (value: string) => void;

  // Active rule IDs (controls which bundle products are visible)
  activeRuleIds: string[];
  setActiveRuleIds: (ids: string[]) => void;

  // Reset
  resetChat: () => void;
}

const UpsellChatContext = createContext<UpsellChatState | null>(null);

export function UpsellChatProvider({ children }: { children: ReactNode }) {
  const [isUpsellPanelOpen, setIsUpsellPanelOpen] = useState(false);
  const [phase, setPhase] = useState<ChatPhase>('welcome');
  const [userMessage, setUserMessage] = useState('');
  const [showBlueprint, setShowBlueprint] = useState(false);
  const [hasStreamed, setHasStreamed] = useState(false);
  const [blueprintStreamed, setBlueprintStreamed] = useState(false);
  const [appBuilt, setAppBuilt] = useState(false);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([]);
  const [buildDone, setBuildDone] = useState(false);
  const [widgetBuildPhase, setWidgetBuildPhase] = useState<'idle' | 'building' | 'done'>('idle');
  const [widgetBuildSteps, setWidgetBuildSteps] = useState<BuildStep[]>([]);
  const [widgetBuildDone, setWidgetBuildDone] = useState(false);
  const [hideCreatedDate, setHideCreatedDate] = useState(false);
  const [postBuildMessages, setPostBuildMessages] = useState<PostBuildMessage[]>([]);
  const [dashboardCreated, setDashboardCreated] = useState(false);
  const [summaryMode, setSummaryMode] = useState(false);
  const [readyForBuildSteps, setReadyForBuildSteps] = useState(false);
  const [chatInputValue, setChatInputValue] = useState('');
  const [activeRuleIds, _setActiveRuleIds] = useState<string[]>(['1', '2']);
  const ruleChannelRef = useRef<BroadcastChannel | null>(null);

  // BroadcastChannel to sync activeRuleIds across tabs
  useEffect(() => {
    const ch = new BroadcastChannel('upsell-active-rules');
    ruleChannelRef.current = ch;
    ch.onmessage = (e: MessageEvent) => {
      if (Array.isArray(e.data)) _setActiveRuleIds(e.data);
    };
    return () => ch.close();
  }, []);

  // Wrapper that also broadcasts to other tabs
  const setActiveRuleIds = useCallback((ids: string[]) => {
    _setActiveRuleIds(ids);
    ruleChannelRef.current?.postMessage(ids);
  }, []);

  const addPostBuildMessage = useCallback((msg: PostBuildMessage) => {
    setPostBuildMessages(prev => [...prev, msg]);
  }, []);

  const resetChat = useCallback(() => {
    setPhase('welcome');
    setUserMessage('');
    setShowBlueprint(false);
    setHasStreamed(false);
    setBlueprintStreamed(false);
    setAppBuilt(false);
    setBuildSteps([]);
    setBuildDone(false);
    setWidgetBuildPhase('idle');
    setWidgetBuildSteps([]);
    setWidgetBuildDone(false);
    setDashboardCreated(false);
    setHideCreatedDate(false);
    setPostBuildMessages([]);
    setSummaryMode(false);
    setReadyForBuildSteps(false);
    setChatInputValue('');
    setActiveRuleIds(['1', '2']);
  }, []);

  return (
    <UpsellChatContext.Provider
      value={{
        isUpsellPanelOpen,
        setIsUpsellPanelOpen,
        phase,
        setPhase,
        userMessage,
        setUserMessage,
        showBlueprint,
        setShowBlueprint,
        hasStreamed,
        setHasStreamed,
        blueprintStreamed,
        setBlueprintStreamed,
        appBuilt,
        setAppBuilt,
        buildSteps,
        setBuildSteps,
        buildDone,
        setBuildDone,
        widgetBuildPhase,
        setWidgetBuildPhase,
        widgetBuildSteps,
        setWidgetBuildSteps,
        widgetBuildDone,
        setWidgetBuildDone,
        dashboardCreated,
        setDashboardCreated,
        summaryMode,
        setSummaryMode,
        readyForBuildSteps,
        setReadyForBuildSteps,
        hideCreatedDate,
        setHideCreatedDate,
        postBuildMessages,
        addPostBuildMessage,
        chatInputValue,
        setChatInputValue,
        activeRuleIds,
        setActiveRuleIds,
        resetChat,
      }}
    >
      {children}
    </UpsellChatContext.Provider>
  );
}

export function useUpsellChat() {
  const ctx = useContext(UpsellChatContext);
  if (!ctx) throw new Error('useUpsellChat must be used within UpsellChatProvider');
  return ctx;
}
