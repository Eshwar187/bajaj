import { useState } from 'react';

const settingsTabs = [
  { id: 'general', label: 'General', icon: 'tune' },
  { id: 'apikeys', label: 'API Keys', icon: 'key', active: true },
  { id: 'team', label: 'Team', icon: 'group' },
  { id: 'billing', label: 'Billing', icon: 'credit_card' },
];

const apiKeys = [
  { id: 1, name: 'Production Scraper', key: 'pk_live_*************************7x9q', status: 'Active', statusType: 'active', created: 'Oct 12, 2023', lastUsed: '2 mins ago' },
  { id: 2, name: 'CI/D Integration', key: 'pk_test_*************************3m2p', status: 'Read-Only', statusType: 'readonly', created: 'Nov 05, 2023', lastUsed: '1 day ago' },
];

const webhooks = [
  { event: 'graph.node.created', checked: true },
  { event: 'graph.node.deleted', checked: true },
  { event: 'graph.edge.mutated', checked: false },
];

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState('apikeys');

  return (
    <main className="ml-64 pt-14 min-h-screen p-8 flex items-start gap-10" style={{ backgroundColor: 'var(--s0)' }}>
      <nav className="w-48 flex-shrink-0 flex flex-col gap-1 sticky top-[88px]">
        <h2 className="text-[18px] font-semibold mb-4 px-2" style={{ color: 'var(--t0)' }}>Settings</h2>
        {settingsTabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="px-3 py-2 rounded transition-colors text-[13px] text-left"
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--s3)' : 'transparent',
              color: activeTab === tab.id ? 'var(--t0)' : 'var(--t2)',
              borderLeft: activeTab === tab.id ? '2px solid var(--t0)' : '2px solid transparent',
            }}>
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 max-w-4xl flex flex-col gap-8">
        <header>
          <h1 className="text-[32px] font-semibold mb-2" style={{ color: 'var(--t0)' }}>API Configuration</h1>
          <p className="text-[14px]" style={{ color: 'var(--t2)' }}>Manage access tokens and webhook endpoints for programmatic interactions.</p>
        </header>

        <section className="rounded flex flex-col" style={{ backgroundColor: 'var(--s1)', border: '1px solid var(--b1)' }}>
          <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--b1)', backgroundColor: 'var(--s1-deep)' }}>
            <div>
              <h3 className="text-[16px] font-semibold" style={{ color: 'var(--t0)' }}>Active Keys</h3>
              <p className="text-[13px] mt-1" style={{ color: 'var(--t3)' }}>Tokens for accessing the Core Graph API.</p>
            </div>
            <button className="px-4 py-1.5 rounded text-[12px] font-medium transition-colors"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
              Generate New Key
            </button>
          </div>
          <div className="flex flex-col">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-4 flex items-center justify-between group transition-colors"
                style={{ borderBottom: '1px solid var(--b1)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--s2)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium" style={{ color: 'var(--t0)' }}>{key.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono"
                      style={{
                        backgroundColor: key.statusType === 'active' ? 'var(--badge-active-bg)' : 'var(--badge-default-bg)',
                        border: `1px solid ${key.statusType === 'active' ? 'var(--badge-active-border)' : 'var(--badge-default-border)'}`,
                        color: key.statusType === 'active' ? 'var(--badge-active-text)' : 'var(--badge-default-text)',
                      }}>
                      {key.status}
                    </span>
                  </div>
                  <div className="font-mono text-[13px] text-xs flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 rounded" style={{ backgroundColor: 'var(--s1-deep)', border: '1px solid var(--b2)', color: 'var(--t2)' }}>{key.key}</span>
                    <button className="material-symbols-outlined text-sm transition-colors" style={{ color: 'var(--t3)' }} title="Copy to clipboard">content_copy</button>
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: 'var(--t4)' }}>Created: {key.created} • Last used: {key.lastUsed}</div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-3 py-1 rounded text-xs transition-colors" style={{ border: '1px solid var(--b2)', color: 'var(--t0)' }}>Rotate</button>
                  <button className="px-3 py-1 rounded text-xs transition-colors" style={{ border: '1px solid var(--err-border)', color: 'var(--err-text)' }}>Revoke</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded flex flex-col" style={{ backgroundColor: 'var(--s1)', border: '1px solid var(--b1)' }}>
          <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--b1)', backgroundColor: 'var(--s1-deep)' }}>
            <div>
              <h3 className="text-[16px] font-semibold" style={{ color: 'var(--t0)' }}>Webhooks</h3>
              <p className="text-[13px] mt-1" style={{ color: 'var(--t3)' }}>Receive real-time graph mutation events.</p>
            </div>
            <button className="px-4 py-1.5 rounded text-[12px] font-medium transition-colors flex items-center gap-2"
              style={{ border: '1px solid var(--b2)', color: 'var(--t0)' }}>
              <span className="material-symbols-outlined text-sm">add</span> Add Endpoint
            </button>
          </div>
          <div className="p-4">
            <form className="flex flex-col gap-4 max-w-2xl">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-medium uppercase tracking-widest" style={{ color: 'var(--t2)' }}>Endpoint URL</label>
                <input className="font-mono text-[13px] rounded px-3 py-2 focus:ring-0 focus:outline-none transition-colors w-full"
                  style={{ backgroundColor: 'var(--s1-deep)', border: '1px solid var(--b1)', color: 'var(--t0)' }}
                  type="url" defaultValue="https://api.internal-corp.net/v1/hierarchy/sync" />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[10px] font-medium uppercase tracking-widest" style={{ color: 'var(--t2)' }}>Events to send</label>
                <div className="flex flex-col gap-2 p-3 rounded" style={{ backgroundColor: 'var(--s1-deep)', border: '1px solid var(--b1)' }}>
                  {webhooks.map((wh, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer">
                      <input defaultChecked={wh.checked} className="rounded-sm focus:ring-0" type="checkbox"
                        style={{ backgroundColor: 'var(--s0)', borderColor: 'var(--b2)' }} />
                      <span className="font-mono text-xs" style={{ color: 'var(--t2)' }}>{wh.event}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button className="px-6 py-2 rounded text-[12px] font-medium transition-colors" type="button"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
                  Save Configuration
                </button>
                <span className="text-[13px] flex items-center gap-1" style={{ color: 'var(--t3)' }}>
                  <span className="material-symbols-outlined text-sm" style={{ color: 'var(--teal)' }}>check_circle</span>
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