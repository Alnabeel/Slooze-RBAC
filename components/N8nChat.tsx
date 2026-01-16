'use client';

import { createChat } from '@n8n/chat';
import '@n8n/chat/dist/style.css';
import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

export const N8nChat = () => {
  const pathname = usePathname();
  const chatInitialized = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  // Don't show chat on welcome and login pages
  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  useEffect(() => {
    if (!chatInitialized.current) {
      createChat({
        webhookUrl: 'https://n8n-latest-mio4.onrender.com/webhook/7c05fbb3-a89b-42b6-90be-104ec896f380/chat',
        mode: 'fullscreen',
        target: '#n8n-chat-container',
        showWelcomeScreen: true,
        initialMessages: [
          '# I’m Slooze AI\nThe in-house assistant for the **Slooze Commodities Management System**.\n\nMy job is to help you manage your inventory, workflow, and user permissions smoothly. Here’s what I can do for you:\n\n### 🛠️ What I can help with:\n- **RBAC**: Explain roles and assist with permission changes.\n- **Inventory**: Guide you through receiving, storing, and dispatching commodities.\n- **Workflows**: Track stock levels, reorder points, and audit trails.\n- **SaaS UI**: Tips on navigating the interface and customizing dashboards.\n\nIf you have a specific task—like checking stock or setting up a new role—just let me know!'
        ],
        i18n: {
          en: {
            title: 'Slooze AI Assistant',
            subtitle: 'Ready to help with your commodities management',
            footer: 'Powered by Slooze AI',
            getStarted: 'New Conversation',
            inputPlaceholder: 'Type your message here...',
            closeButtonTooltip: 'Close Chat',
            welcomeHeader: 'Welcome to Slooze AI',
            welcomeMessage: 'How can I assist you today?',
          }
        },
        theme: {
          buttonColor: '#2563eb',
          primaryColor: '#2563eb',
        },
        allowFileUploads: true,
        enableStreaming: true,
      });
      chatInitialized.current = true;
    }
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95"
        aria-label="Toggle Chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Container */}
      <div 
        className={`fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header with Close Button */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between px-4 z-10">
          <span className="font-semibold text-gray-700 dark:text-zinc-200">Slooze AI</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div id="n8n-chat-container" className="w-full h-full pt-12"></div>
      </div>
    </>
  );
};
