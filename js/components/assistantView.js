/**
 * AgriNova Platform - Agriculture-Specific Contextual Assistant
 * Pre-seeded with current crop, market, and net value context (Requirements 56–58).
 */

import { Icons } from "./icons.js";
import { store } from "../state/store.js";

export function renderAssistantDrawer(state) {
  const isOpen = state.activeDrawer === "assistant";
  const commodity = store.getCurrentCommodity();
  const mandi = store.getCurrentMandi();
  const history = state.assistantHistory || [];

  const quickQuestions = [
    `What is today's ${commodity.name} rate?`,
    "Which nearby mandi gives best net value?",
    "How does transportation affect my net value?",
    "What are the current market signals?",
    "Which verified buyers match my crop?",
    "What is the weather impact on transport?"
  ];

  return `
    <div class="assistant-drawer-backdrop ${isOpen ? 'open' : ''}" onclick="window.AgriNova.closeDrawer()" aria-hidden="${!isOpen}">
      <aside class="assistant-drawer-panel" onclick="event.stopPropagation()" role="dialog" aria-label="AgriNova Assistant">
        
        <!-- Drawer Header -->
        <div class="assistant-header">
          <div class="assistant-brand-row">
            <div class="assistant-bot-avatar">
              ${Icons.bot("icon-sm text-white")}
            </div>
            <div>
              <h3 class="assistant-title">AgriNova Assistant</h3>
              <span class="assistant-subtitle">Farmer Decision Support System</span>
            </div>
          </div>
          <button class="btn-icon-close" onclick="window.AgriNova.closeDrawer()" aria-label="Close Assistant">
            ${Icons.x("icon-sm")}
          </button>
        </div>

        <!-- Current Context Indicator (Requirement 57) -->
        <div class="assistant-context-pill">
          ${Icons.sparkles("icon-xxs text-accent")}
          <span><strong>Active Context:</strong> ${commodity.name} at ${mandi.name} (Gross ₹${mandi.pricePerQ}/q)</span>
        </div>

        <!-- Chat Conversation Messages Area -->
        <div class="assistant-chat-body" id="assistantChatBody">
          ${history
            .map(
              (msg) => `
            <div class="chat-message-bubble ${msg.sender}">
              <div class="msg-sender-tag">${msg.sender === 'user' ? 'You' : 'AgriNova Assistant'} • ${msg.time}</div>
              <div class="msg-text">${msg.text}</div>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Quick Questions Chips (Requirement 56) -->
        <div class="assistant-quick-prompts">
          <span class="prompts-kicker">Recommended Queries:</span>
          <div class="quick-chips-scroll">
            ${quickQuestions
              .map(
                (q) => `
              <button class="quick-chip-btn" onclick="window.AgriNova.askAssistant('${q.replace(/'/g, "\\'")}')">
                ${q}
              </button>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Question Input Bar -->
        <div class="assistant-input-bar">
          <form onsubmit="window.AgriNova.handleAssistantSubmit(event)" class="assistant-form">
            <input 
              type="text" 
              id="assistantQueryInput" 
              class="assistant-text-input" 
              placeholder="Ask about prices, freight, mandi comparison..." 
              autocomplete="off"
              aria-label="Ask AgriNova question"
            />
            <button type="submit" class="btn btn-primary btn-icon-submit" aria-label="Send Query">
              ${Icons.arrowRight("icon-xs text-white")}
            </button>
          </form>
          <div class="assistant-safety-disclaimer">
            ${Icons.shield("icon-xxs text-subtle")}
            <span>Calculated market context only. Final decisions belong to the farmer. Not financial advice.</span>
          </div>
        </div>

      </aside>
    </div>
  `;
}
