import { useState } from 'react';

const settingsTabs = [
  { id: 'general', label: 'General', icon: 'tune' },
  { id: 'apikeys', label: 'API Keys', icon: 'key', active: true },
  { id: 'team', label: 'Team', icon: 'group' },
  { id: 'billing', label: 'Billing', icon: 'credit_card' },
];

const apiKeys = [
  {
    id: 1,
    name: 'Production Scraper',
    key: 'pk_live_*************************7x9q',
    status: 'Active',
    statusType: 'active',
    created: 'Oct 12, 2023',
    lastUsed: '2 mins ago',
  },
  {
    id: 2,
    name: 'CI/D Integration',
    key: 'pk_test_*************************3m2p',
    status: 'Read-Only',
    statusType: 'readonly',
    created: 'Nov 05, 2023',
    lastUsed: '1 day ago',
  },
];

const webhooks = [
  { event: 'graph.node.created', checked: true },
  { event: 'graph.node.deleted', checked: true },
  { event: 'graph.edge.mutated', checked: false },
];

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState('apikeys');

  return (
    <main className="ml-64 pt-14 min-h-screen p-8 flex items-start gap-10">
      <nav className="w-48 flex-shrink-0 flex flex-col gap-1 sticky top-[88px]">
        <h2 className="text-[18px] font-semibold text-white mb-4 px-2">Settings</h2>
        {settingsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded transition-colors text-[13px] text-left ${
              activeTab === tab.id
                ? 'bg-[#1A1A1A] text-white border-l-2 border-white'
                : 'text-zinc-400 hover:text-white hover:bg-[#121212]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 max-w-4xl flex flex-col gap-8">
        <header>
          <h1 className="text-[32px] font-semibold text-white mb-2">API Configuration</h1>
          <p className="text-[14px] text-zinc-400">Manage access tokens and webhook endpoints for programmatic interactions.</p>
        </header>

        <section className="bg-[#0A0A0A] border border-[#1F1F1F] rounded flex flex-col">
          <div className="p-4 border-b border-[#1F1F1F] flex justify-between items-center bg-[#050505]">
            <div>
              <h3 className="text-[16px] font-semibold text-white">Active Keys</h3>
              <p className="text-[13px] text-zinc-500 mt-1">Tokens for accessing the Core Graph API.</p>
            </div>
            <button className="bg-white text-black px-4 py-1.5 rounded text-[12px] font-medium hover:bg-zinc-200 transition-colors">
                Generate New Key
            </button>
          </div>
          <div className="flex flex-col">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-4 border-b border-[#1F1F1F] flex items-center justify-between hover:bg-[#121212] transition-colors group">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-white font-medium">{key.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                      key.statusType === 'active' 
                        ? 'bg-[#003731] text-tertiary-fixed border-[#005047]' 
                        : 'bg-[#353534] text-zinc-300 border-[#474646]'
                    }`}>
                      {key.status}
                    </span>
                  </div>
                  <div className="font-mono text-[13px] text-zinc-500 text-xs flex items-center gap-2 mt-1">
                    <span className="bg-[#050505] border border-[#262626] px-2 py-1 rounded text-zinc-300">{key.key}</span>
                    <button className="material-symbols-outlined text-sm text-zinc-500 hover:text-white transition-colors" title="Copy to clipboard">content_copy</button>
                  </div>
                  <div className="text-[13px] text-zinc-600 text-[11px] mt-1">Created: {key.created} • Last used: {key.lastUsed}</div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="border border-[#262626] text-white px-3 py-1 rounded text-[13px] text-xs hover:border-[#404040] transition-colors">Rotate</button>
                  <button className="border border-error-container text-error px-3 py-1 rounded text-[13px] text-xs hover:bg-error-container/20 transition-colors">Revoke</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0A0A0A] border border-[#1F1F1F] rounded flex flex-col">
          <div className="p-4 border-b border-[#1F1F1F] flex justify-between items-center bg-[#050505]">
            <div>
              <h3 className="text-[16px] font-semibold text-white">Webhooks</h3>
              <p className="text-[13px] text-zinc-500 mt-1">Receive real-time graph mutation events.</p>
            </div>
            <button className="border border-[#262626] text-white px-4 py-1.5 rounded text-[12px] font-medium hover:border-[#404040] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span> Add Endpoint
            </button>
          </div>
          <div className="p-4">
            <form className="flex flex-col gap-4 max-w-2xl">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-medium text-zinc-400 uppercase tracking-widest text-[10px]">Endpoint URL</label>
                <input
                  className="bg-[#050505] border border-[#1F1F1F] text-white font-mono text-[13px] rounded px-3 py-2 focus:border-white focus:ring-0 focus:outline-none transition-colors w-full"
                  type="url"
                  value="https://api.internal-corp.net/v1/hierarchy/sync"
                />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[12px] font-medium text-zinc-400 uppercase tracking-widest text-[10px]">Events to send</label>
                <div className="flex flex-col gap-2 bg-[#050505] border border-[#1F1F1F] p-3 rounded">
                  {webhooks.map((webhook, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                      <input
                        checked={webhook.checked}
                        className="bg-[#131313] border-[#262626] text-white rounded-sm focus:ring-0 focus:ring-offset-0"
                        type="checkbox"
                      />
                      <span className="font-mono text-[13px] text-zinc-300 text-xs">{webhook.event}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button className="bg-white text-black px-6 py-2 rounded text-[12px] font-medium hover:bg-zinc-200 transition-colors" type="button">
                  Save Configuration
                </button>
                <span className="text-[13px] text-zinc-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-tertiary-fixed">check_circle</span>
                  Last pinged 5 mins ago (200 OK)
                </span>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}