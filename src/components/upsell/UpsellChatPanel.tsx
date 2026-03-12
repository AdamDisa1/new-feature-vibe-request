import { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Check, Loader2, Layers, ArrowRight } from 'lucide-react';
import { useUpsellChat } from './UpsellChatContext';
import { UpsellChatMessage } from './UpsellChatMessage';
import { StreamingResponse } from './StreamingResponse';
import { RichStreamingResponse } from './RichStreamingResponse';
import type { RichSegment } from './RichStreamingResponse';
import { UpsellAppCards } from './UpsellAppCards';

const RESPONSE_TEXT =
  'Here are tools to help you add smart product suggestions and upsells. Browse top-rated third-party apps below to compare features, or use AI to generate a custom capability that fits exactly how you want to control recommendations and validations.';

const BLUEPRINT_SEGMENTS: RichSegment[] = [
  { text: "I've drafted a blueprint for your custom Upsell Capability. Once approved, the system will generate a" },
  { text: 'customer-facing widget', bold: true },
  { text: 'for your storefront and a' },
  { text: 'dashboard page', bold: true },
  { text: 'where you can control all your logic and validation rules.' },
  { text: 'Want to tweak this?', bold: true, paragraphBreak: true },
  { text: "Just let me know what to change in the chat, and I'll update the blueprint." },
];

const BUILD_STEPS_DATA = [
  'Creating dashboard page structure...',
  'Generating CMS collection for suggestion rules...',
  'Defining data schema...',
  'Searching Wix API documentation for cart events...',
  'Implementing add-to-cart listener...',
  'Connecting site widget to CMS...',
  'Generating approval logic (manual / automatic)...',
  'Finalizing UI components...',
];

const CREATED_DATE_KEYWORDS = [
  'remove created date', 'hide created date', 'remove the created date',
  'hide the created date', 'delete created date', 'remove creation date',
  'hide creation date', 'get rid of created date', 'remove created column',
  'hide created column', "don't show created date", 'no created date',
  'remove date created', 'hide date created', 'take out created date',
  'remove the created', 'hide the created', 'remove created',
];

interface UpsellChatPanelProps {
  onNavigate: (page: string) => void;
}

export function UpsellChatPanel({ onNavigate }: UpsellChatPanelProps) {
  const {
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
    buildDone,
    hideCreatedDate: _,
    setHideCreatedDate,
    postBuildMessages,
    addPostBuildMessage,
    chatInputValue,
    setChatInputValue,
    setIsUpsellPanelOpen,
    widgetBuildPhase,
    widgetBuildSteps,
    widgetBuildDone,
  } = useUpsellChat();

  const [isAriaTyping, setIsAriaTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dashboardScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll conversation
  useEffect(() => {
    if (phase !== 'conversation') return;
    const el = scrollRef.current;
    if (!el) return;
    const observer = new MutationObserver(() => {
      el.scrollTop = el.scrollHeight;
    });
    observer.observe(el, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [phase]);

  // Scroll post-build messages
  useEffect(() => {
    if (!appBuilt) return;
    const el = dashboardScrollRef.current;
    if (el) {
      setTimeout(() => { el.scrollTop = el.scrollHeight; }, 100);
    }
  }, [postBuildMessages, appBuilt, isAriaTyping]);

  const detectCreatedDateIntent = (text: string): boolean => {
    const lower = text.toLowerCase();
    return CREATED_DATE_KEYWORDS.some(kw => lower.includes(kw));
  };

  const handleSend = () => {
    const trimmed = chatInputValue.trim();
    if (!trimmed) return;

    // Post-build messaging
    if (appBuilt) {
      addPostBuildMessage({ role: 'user', content: trimmed });
      setChatInputValue('');

      if (detectCreatedDateIntent(trimmed)) {
        setIsAriaTyping(true);
        setTimeout(() => {
          setHideCreatedDate(true);
          addPostBuildMessage({
            role: 'assistant',
            content: 'Done! I\'ve hidden the "Created" date column from your Suggestion Rules Dashboard. Only the "Last Modified" date is now visible in the table. Let me know if you\'d like any other changes.',
          });
          setIsAriaTyping(false);
        }, 1500);
      } else {
        setIsAriaTyping(true);
        setTimeout(() => {
          addPostBuildMessage({
            role: 'assistant',
            content: 'I can help you customize your Bundle Sales Dashboard. Try asking me to modify the dashboard layout, update rule settings, or change how data is displayed — for example, you can ask me to remove the created date from the rules table.',
          });
          setIsAriaTyping(false);
        }, 1200);
      }
      return;
    }

    // Initial conversation
    setUserMessage(trimmed);
    setChatInputValue('');
    setPhase('conversation');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBuild = () => {
    setShowBlueprint(true);
  };

  const handleApproveBlueprint = () => {
    setAppBuilt(false); // will be set true when build completes
    onNavigate('upsell-build');
  };

  // ── Shared CTA cards (used in both renderCompleted and renderBuildProgress) ──
  const renderPostBuildCTAs = () => (
    <>
      {/* Handoff message */}
      <div className="pt-4" style={{ borderTop: '1px solid #e5e8ef' }}>
        <p className="text-sm" style={{ color: '#16161d', maxWidth: 301 }}>
          I built the <span className="font-bold">Bundle Sales Dashboard</span> page for you. Now handing off to the Editor to build the <span className="font-bold">SiteWidget</span> — a customer-facing widget for your storefront.
        </p>

        {/* Dashboard completed card (subtle, green-tinted) */}
        <div
          className="rounded-lg p-3 mt-4 flex items-center gap-3"
          style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#22c55e' }}
          >
            <Check className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold" style={{ color: '#16161d' }}>Bundle Sales Dashboard page created</p>
          </div>
          <button
            onClick={() => onNavigate('creations')}
            className="text-[11px] font-medium flex items-center gap-1 flex-shrink-0 transition-colors"
            style={{ color: '#116dff' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            See my creations <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* SiteWidget action card (prominent) */}
        <div
          className="rounded-lg p-4 mt-3 space-y-3"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e5e8ef', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#e8f1fe' }}
            >
              <Layers className="w-4 h-4" style={{ color: '#116dff' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold" style={{ color: '#16161d' }}>SiteWidget</h4>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
                Ready to build the widget component. Continue in the Editor to start.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('upsell-widget-build')}
              className="flex-1 h-8 rounded flex items-center justify-center gap-1.5 text-xs font-semibold text-white transition-colors"
              style={{ backgroundColor: '#116dff' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0d5fdb')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#116dff')}
            >
              Continue building in Editor <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => onNavigate('creations')}
              className="h-8 px-4 rounded flex items-center justify-center text-xs font-medium transition-colors"
              style={{ color: '#6b7280', border: '1px solid #e5e8ef', backgroundColor: '#ffffff' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f7f8fa')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              Deny
            </button>
          </div>
        </div>
      </div>

      {/* Widget build checklist (when building or done) */}
      {(widgetBuildPhase === 'building' || widgetBuildPhase === 'done') && (
        <div className="pt-4 mt-4" style={{ borderTop: '1px solid #e5e8ef' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#16161d' }}>
            Building your SiteWidget...
          </p>
          <div className="space-y-1.5">
            {widgetBuildSteps.map(step => {
              if (step.status === 'completed') {
                return (
                  <div key={step.id} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#116dff' }} />
                    <p className="text-xs" style={{ color: '#6b7280' }}>{step.message}</p>
                  </div>
                );
              }
              if (step.status === 'active') {
                return (
                  <div key={step.id} className="flex items-start gap-2">
                    <Loader2 className="w-3.5 h-3.5 mt-0.5 animate-spin flex-shrink-0" style={{ color: '#116dff' }} />
                    <p className="text-sm" style={{ color: '#16161d' }}>{step.message}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>

          {widgetBuildDone && (
            <div className="mt-4 space-y-3">
              <div
                className="rounded-lg p-3 flex items-center gap-3"
                style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#22c55e' }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
                </div>
                <p className="text-xs font-semibold flex-1" style={{ color: '#16161d' }}>
                  Your SiteWidget is live!
                </p>
              </div>
              <button
                onClick={() => onNavigate('creations')}
                className="w-full h-9 rounded flex items-center justify-center gap-2 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: '#116dff' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0d5fdb')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#116dff')}
              >
                Manage in My Creations
              </button>
              <button
                onClick={() => window.open('https://editor.wix.com', '_blank')}
                className="w-full h-9 rounded flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                style={{ backgroundColor: '#ffffff', color: '#116dff', border: '1px solid #116dff' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f0f4ff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
              >
                View Editor Page
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );

  // ── Render: Completed state (post-build) ─────────────────────────────────
  const renderCompleted = () => (
    <div className="flex-1 overflow-y-auto px-4 pb-4" ref={dashboardScrollRef}>
      <div className="flex gap-3 mb-4">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
          style={{ backgroundColor: '#116dff' }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm" style={{ color: '#16161d', maxWidth: 301 }}>
              Starting the build process for your Bundle Sales Dashboard...
            </p>
            <div className="space-y-1.5 mt-3">
              {BUILD_STEPS_DATA.map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#116dff' }} />
                  <p className="text-xs" style={{ color: '#6b7280' }}>{step}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs" style={{ color: '#6b7280', maxWidth: 301, fontSize: 11 }}>
              <span className="font-bold">Note:</span> You can view and manage your AI credits{' '}
              <a href="#" className="underline" style={{ color: '#116dff', textUnderlineOffset: 2 }}>here</a>
            </p>
          </div>

          {renderPostBuildCTAs()}
        </div>
      </div>

      {/* Post-build messages */}
      {postBuildMessages.length > 0 && (
        <div className="mt-6 pt-4 space-y-4" style={{ borderTop: '1px solid #e5e8ef' }}>
          {postBuildMessages.map((msg, index) =>
            msg.role === 'user' ? (
              <div key={index} className="flex justify-end">
                <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: '#116dff', maxWidth: 260 }}>
                  <p className="text-sm text-white">{msg.content}</p>
                </div>
              </div>
            ) : (
              <div key={index} className="flex gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ backgroundColor: '#116dff' }}
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
                </div>
                <p className="text-sm flex-1" style={{ color: '#16161d', maxWidth: 301 }}>{msg.content}</p>
              </div>
            ),
          )}
          {isAriaTyping && (
            <div className="flex gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                style={{ backgroundColor: '#116dff' }}
              >
                <Sparkles className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
              </div>
              <div className="flex items-center gap-1 py-1">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="inline-block rounded-full"
                    style={{
                      width: 6, height: 6,
                      backgroundColor: '#6b7280',
                      animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ── Render: Build in progress (steps in chat) ────────────────────────────
  const renderBuildProgress = () => (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <UpsellChatMessage
        role="assistant"
        content={
          <div className="space-y-2">
            <p className="text-sm" style={{ color: '#16161d' }}>
              Starting the build process for your Bundle Sales Dashboard...
            </p>
            <div className="space-y-1 mt-4">
              {buildSteps.map(step => {
                if (step.status === 'completed') {
                  return (
                    <div key={step.id} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#116dff' }} />
                      <p className="text-xs" style={{ color: '#6b7280' }}>{step.message}</p>
                    </div>
                  );
                }
                if (step.status === 'active') {
                  return (
                    <div key={step.id} className="flex items-start gap-2">
                      <Loader2 className="w-3.5 h-3.5 mt-0.5 animate-spin flex-shrink-0" style={{ color: '#116dff' }} />
                      <p className="text-sm" style={{ color: '#16161d' }}>{step.message}</p>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {buildDone && (
              <p className="mt-3 text-xs" style={{ color: '#6b7280', maxWidth: 301, fontSize: 11 }}>
                <span className="font-bold">Note:</span> You can view and manage your AI credits{' '}
                <a href="#" className="underline" style={{ color: '#116dff', textUnderlineOffset: 2 }}>here</a>
              </p>
            )}

            {buildDone && renderPostBuildCTAs()}
          </div>
        }
      />
    </div>
  );

  // ── Render: Welcome ──────────────────────────────────────────────────────
  const renderWelcome = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: '#e8f1fe' }}
      >
        <Sparkles className="w-7 h-7" style={{ color: '#116dff' }} />
      </div>
      <h3 className="text-base font-bold mb-2" style={{ color: '#16161d' }}>
        Hi, I'm your AI assistant
      </h3>
      <p className="text-sm" style={{ color: '#6b7280', maxWidth: 280 }}>
        I can help you build custom capabilities, add features, and optimize your site. Tell me what you'd like to create.
      </p>
    </div>
  );

  // ── Render: Conversation ─────────────────────────────────────────────────
  const renderConversation = () => (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6" ref={scrollRef}>
      {/* User message */}
      <UpsellChatMessage role="user" content={<p className="text-sm">{userMessage}</p>} />

      {/* Assistant streaming response + app cards */}
      <UpsellChatMessage
        role="assistant"
        content={
          <StreamingResponse
            text={RESPONSE_TEXT}
            instant={hasStreamed}
            onComplete={() => setHasStreamed(true)}
          >
            <UpsellAppCards onCreateWithAI={handleBuild} />
          </StreamingResponse>
        }
      />

      {/* Blueprint (after AI card click) */}
      {showBlueprint && (
        <UpsellChatMessage
          role="assistant"
          content={
            <RichStreamingResponse
              segments={BLUEPRINT_SEGMENTS}
              instant={blueprintStreamed}
              onComplete={() => setBlueprintStreamed(true)}
            >
              <div className="space-y-2 mt-3">
                <button
                  onClick={handleApproveBlueprint}
                  className="flex items-center justify-center gap-2 w-full h-9 rounded text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: '#116dff' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0d5fdb')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#116dff')}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Approve & Build
                </button>
                <p className="text-center" style={{ color: '#6b7280', fontSize: 11 }}>
                  Note: This action will deduct AI credits from your account
                </p>
              </div>
            </RichStreamingResponse>
          }
        />
      )}
    </div>
  );

  // ── Determine which content to show ──────────────────────────────────────
  const renderBody = () => {
    if (appBuilt) return renderCompleted();
    if (buildSteps.length > 0) return renderBuildProgress();
    if (phase === 'conversation') return renderConversation();
    return renderWelcome();
  };

  return (
    <div
      className="w-96 h-full flex flex-col border-l flex-shrink-0"
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#e5e8ef',
        animation: 'slideIn 0.2s ease-out',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0"
        style={{ borderColor: '#e5e8ef' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#116dff' }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
          </div>
          <span className="text-sm font-bold" style={{ color: '#16161d' }}>AI Assistant</span>
        </div>
        <button
          onClick={() => setIsUpsellPanelOpen(false)}
          className="p-1 rounded transition-colors"
          style={{ color: '#6b7280' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f7f8fa')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      {renderBody()}

      {/* Input area */}
      <div
        className="px-4 py-3 border-t flex items-center gap-2 flex-shrink-0"
        style={{ borderColor: '#e5e8ef' }}
      >
        <input
          type="text"
          value={chatInputValue}
          onChange={e => setChatInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={appBuilt ? 'Ask me to customize...' : 'Tell me what you need...'}
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
          style={{ backgroundColor: '#f7f8fa', border: '1px solid #e5e8ef', color: '#16161d' }}
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-lg transition-colors"
          style={{ backgroundColor: chatInputValue.trim() ? '#116dff' : '#e5e8ef' }}
        >
          <Send className="w-4 h-4" style={{ color: chatInputValue.trim() ? '#ffffff' : '#9098a9' }} />
        </button>
      </div>
    </div>
  );
}
