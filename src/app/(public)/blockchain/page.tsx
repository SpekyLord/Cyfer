'use client';

import { useState, useEffect } from 'react';
import {
  Blocks, CheckCircle, XCircle, Loader2, Hash, Clock, Database,
  Shield, ChevronDown, FileText, UserCheck, Send, Lock, ArrowDown,
  Network, WifiOff, Wifi
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';

interface Block {
  id: number;
  timestamp: string;
  data: Record<string, unknown>;
  previous_hash: string;
  hash: string;
  nonce: number;
}

const ACTION_CONFIG: Record<string, { label: string; icon: typeof Blocks; variant: 'default' | 'success' | 'info' | 'warning' | 'accent'; color: string }> = {
  genesis: { label: 'Genesis Block', icon: Shield, variant: 'accent', color: 'text-accent' },
  document_upload: { label: 'Document Upload', icon: FileText, variant: 'warning', color: 'text-warning' },
  document_approved: { label: 'Approval', icon: UserCheck, variant: 'info', color: 'text-info' },
  document_published: { label: 'Published', icon: Send, variant: 'success', color: 'text-success' },
  test: { label: 'Test Block', icon: Blocks, variant: 'default', color: 'text-muted' },
};

function getActionConfig(data: Record<string, unknown>) {
  const action = data.action as string;
  if (!action) return ACTION_CONFIG.genesis;
  return ACTION_CONFIG[action] || ACTION_CONFIG.test;
}

interface NodeStatus {
  id: number;
  name: string;
  url_hint: string;
  block_count: number;
  latest_hash: string | null;
  status: 'synced' | 'out_of_sync' | 'unreachable';
}

export default function BlockchainPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [chainValid, setChainValid] = useState<boolean | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [nodes, setNodes] = useState<NodeStatus[]>([]);
  const [nodesLoading, setNodesLoading] = useState(true);
  const [consensus, setConsensus] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchBlockchain() {
      try {
        const res = await fetch('/api/blockchain/validate');
        const json = await res.json();
        if (json.success) {
          setBlocks(json.data.blocks ?? []);
          setChainValid(json.data.valid);
        }
      } catch (err) {
        console.error('Failed to fetch blockchain:', err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchNodes() {
      try {
        const res = await fetch('/api/blockchain/nodes');
        const json = await res.json();
        if (json.success) {
          setNodes(json.data.nodes ?? []);
          setConsensus(json.data.consensus);
        }
      } catch (err) {
        console.error('Failed to fetch nodes:', err);
      } finally {
        setNodesLoading(false);
      }
    }

    fetchBlockchain();
    fetchNodes();
  }, []);

  const reversedBlocks = [...blocks].reverse();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-1.5 text-sm text-primary mb-4">
          <Network size={14} />
          Decentralized &amp; Immutable
        </div>
        <h1 className="text-3xl font-bold text-foreground">Blockchain Explorer</h1>
        <p className="text-muted mt-2 max-w-xl mx-auto">
          Every document action is permanently recorded as a block across <strong>3 independent nodes</strong>.
          Each block is cryptographically linked to the previous one — any tampering is immediately detectable.
        </p>
      </div>

      {/* Network Nodes Panel */}
      <Card className="mb-6">
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2 text-foreground">
              <Network size={18} className="text-accent" />
              Distributed Network
            </h3>
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full
              ${consensus === null ? 'bg-muted/10 text-muted' : consensus ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
              {consensus === null ? (
                <Loader2 size={12} className="animate-spin" />
              ) : consensus ? (
                <CheckCircle size={12} />
              ) : (
                <XCircle size={12} />
              )}
              {consensus === null ? 'Checking consensus...' : consensus ? 'Network Consensus Reached' : 'Consensus Failure Detected'}
            </div>
          </div>

          {nodesLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 size={20} className="animate-spin text-muted" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nodes.map((node) => (
                <div key={node.id} className={`p-3 rounded-xl border flex items-start gap-3
                  ${node.status === 'synced' ? 'bg-success/5 border-success/20' :
                    node.status === 'out_of_sync' ? 'bg-error/5 border-error/20' :
                    'bg-muted/5 border-border'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                    ${node.status === 'synced' ? 'bg-success/15' :
                      node.status === 'out_of_sync' ? 'bg-error/15' : 'bg-muted/15'}`}>
                    {node.status === 'unreachable' ? (
                      <WifiOff size={14} className="text-muted" />
                    ) : (
                      <Wifi size={14} className={node.status === 'synced' ? 'text-success' : 'text-error'} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm font-semibold text-foreground">{node.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider
                        ${node.status === 'synced' ? 'bg-success/15 text-success' :
                          node.status === 'out_of_sync' ? 'bg-error/15 text-error' : 'bg-muted/15 text-muted'}`}>
                        {node.status === 'out_of_sync' ? 'Out of Sync' : node.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted font-mono">{node.block_count} blocks</p>
                    {node.latest_hash && (
                      <p className="text-[10px] text-muted/60 font-mono truncate">{node.latest_hash.slice(0, 16)}...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted mt-3 text-center">
            Each node independently stores the full blockchain. If any node is tampered with, consensus fails immediately.
          </p>
        </div>
      </Card>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Card>
          <div className="p-4 text-center">
            <Database size={20} className="mx-auto text-accent mb-1.5" />
            <div className="text-2xl font-bold text-foreground">{blocks.length}</div>
            <div className="text-xs text-muted">Total Blocks</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            {chainValid === null ? (
              <Loader2 size={20} className="mx-auto text-muted mb-1.5 animate-spin" />
            ) : chainValid ? (
              <CheckCircle size={20} className="mx-auto text-success mb-1.5" />
            ) : (
              <XCircle size={20} className="mx-auto text-error mb-1.5" />
            )}
            <div className={`text-2xl font-bold ${chainValid ? 'text-success' : chainValid === false ? 'text-error' : 'text-muted'}`}>
              {chainValid === null ? '...' : chainValid ? 'Valid' : 'Broken'}
            </div>
            <div className="text-xs text-muted">Chain Integrity</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <FileText size={20} className="mx-auto text-info mb-1.5" />
            <div className="text-2xl font-bold text-foreground">
              {blocks.filter(b => (b.data.action as string) === 'document_published').length}
            </div>
            <div className="text-xs text-muted">Published Docs</div>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <Hash size={20} className="mx-auto text-primary mb-1.5" />
            <div className="text-sm font-mono font-bold text-foreground truncate">
              {blocks.length > 0 ? blocks[blocks.length - 1].hash.slice(0, 10) + '...' : '---'}
            </div>
            <div className="text-xs text-muted">Latest Hash</div>
          </div>
        </Card>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-accent mb-3" />
          <span className="text-muted">Loading blockchain...</span>
        </div>
      ) : blocks.length === 0 ? (
        <div className="text-center py-20 text-muted">No blocks found.</div>
      ) : (
        <div className="relative">
          {/* Central chain line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/40 to-accent/10" />

          {reversedBlocks.map((block, idx) => {
            const isGenesis = block.id === 0;
            const isLatest = idx === 0;
            const isExpanded = expandedId === block.id;
            const config = getActionConfig(block.data);
            const ActionIcon = config.icon;
            const prevBlock = idx < reversedBlocks.length - 1 ? reversedBlocks[idx + 1] : null;

            return (
              <div key={block.id} className={`relative pl-14 md:pl-18 pb-2 animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`}>
                {/* Node dot on the chain line */}
                <div className={`absolute left-4 md:left-6 top-5 w-4 h-4 rounded-full border-2 border-card z-10
                  ${isGenesis ? 'bg-accent animate-pulse-glow' : isLatest ? 'bg-success' : 'bg-primary/60'}`}
                />

                {/* Hash connector showing linkage */}
                {prevBlock && (
                  <div className="absolute left-[1.85rem] md:left-[2.35rem] -top-3 flex flex-col items-center">
                    <ArrowDown size={12} className="text-accent/50" />
                  </div>
                )}

                {/* Block Card */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : block.id)}
                  className="w-full text-left group"
                >
                  <Card className={`transition-all duration-200 group-hover:border-accent/30 group-hover:shadow-md
                    ${isExpanded ? 'ring-2 ring-accent/40 shadow-lg' : ''}
                    ${isGenesis ? 'border-accent/20 bg-gradient-to-r from-accent/5 to-transparent' : ''}
                    ${isLatest && !isGenesis ? 'border-success/20 bg-gradient-to-r from-success/5 to-transparent' : ''}`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {/* Action icon */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                            ${isGenesis ? 'bg-accent/15' : 'bg-primary/5'}`}>
                            <ActionIcon size={18} className={config.color} />
                          </div>

                          <div className="min-w-0 flex-1">
                            {/* Badges row */}
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              <span className="text-xs font-mono font-bold text-primary/50">#{block.id}</span>
                              <Badge variant={config.variant}>{config.label}</Badge>
                              {isGenesis && <Badge variant="accent">Origin</Badge>}
                              {isLatest && !isGenesis && <Badge variant="success">Latest</Badge>}
                            </div>

                            {/* Title */}
                            <p className="text-sm font-medium text-foreground truncate">
                              {(block.data.title as string) ||
                               (block.data.uploaded_by_name as string ? `By ${block.data.uploaded_by_name}` : '') ||
                               (block.data.approved_by_name as string ? `By ${block.data.approved_by_name}` : '') ||
                               (block.data.message as string) ||
                               `Block #${block.id}`}
                            </p>

                            {/* Timestamp + hash preview */}
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                              <span className="flex items-center gap-1 text-xs text-muted">
                                <Clock size={11} />
                                {formatDate(block.timestamp)}
                              </span>
                              <span className="hidden sm:flex items-center gap-1 text-xs text-muted font-mono">
                                <Hash size={11} />
                                {block.hash.slice(0, 12)}...
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Expand chevron */}
                        <ChevronDown
                          size={18}
                          className={`flex-shrink-0 text-muted transition-transform duration-200 mt-2
                            ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-border animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                          {/* Hash visualization */}
                          <div className="space-y-3 mb-4">
                            {/* Previous Hash */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <div className="w-2 h-2 rounded-full bg-info/60" />
                                <span className="text-xs font-semibold text-muted uppercase tracking-wider">Previous Block Hash</span>
                              </div>
                              <div className="px-3 py-2.5 bg-info/5 border border-info/15 rounded-lg">
                                <code className="text-xs font-mono text-info break-all select-all">
                                  {block.previous_hash === '0' ? '0000000000000000000000000000000000000000000000000000000000000000' : block.previous_hash}
                                </code>
                              </div>
                              {isGenesis && (
                                <p className="text-[11px] text-muted mt-1 italic">Genesis block — no previous block exists</p>
                              )}
                            </div>

                            {/* Arrow showing the link */}
                            <div className="flex items-center justify-center gap-2 py-1">
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-semibold">
                                <Lock size={10} />
                                SHA-256
                              </div>
                              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                            </div>

                            {/* Current Hash */}
                            <div>
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <div className="w-2 h-2 rounded-full bg-success" />
                                <span className="text-xs font-semibold text-muted uppercase tracking-wider">This Block&apos;s Hash</span>
                              </div>
                              <div className="px-3 py-2.5 bg-success/5 border border-success/15 rounded-lg">
                                <code className="text-xs font-mono text-success break-all select-all">{block.hash}</code>
                              </div>
                              {!isGenesis && prevBlock && (
                                <p className="text-[11px] text-success/80 mt-1 flex items-center gap-1">
                                  <CheckCircle size={10} />
                                  Links to Block #{block.id - 1}&apos;s hash — chain intact
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Metadata grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                            <div className="p-2.5 bg-card-hover rounded-lg">
                              <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Block ID</span>
                              <p className="text-sm font-mono font-bold text-foreground mt-0.5">{block.id}</p>
                            </div>
                            <div className="p-2.5 bg-card-hover rounded-lg">
                              <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Nonce</span>
                              <p className="text-sm font-mono font-bold text-foreground mt-0.5">{block.nonce.toLocaleString()}</p>
                            </div>
                            <div className="p-2.5 bg-card-hover rounded-lg col-span-2 sm:col-span-1">
                              <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Timestamp</span>
                              <p className="text-sm font-mono text-foreground mt-0.5">{new Date(block.timestamp).toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Block data */}
                          <div>
                            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Block Data</span>
                            <pre className="mt-1.5 px-3 py-2.5 bg-primary/[0.03] border border-border rounded-lg text-xs font-mono text-foreground overflow-x-auto max-h-40 whitespace-pre-wrap break-all">
{JSON.stringify(block.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* How it works */}
      <Card className="mt-10">
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
            <Shield size={20} className="text-accent" />
            How the Blockchain Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                step: '1',
                title: 'Hash',
                desc: "Each block's content is hashed using SHA-256, creating a unique 64-character fingerprint that changes if any data is modified.",
                color: 'bg-accent/10 text-accent border-accent/20',
              },
              {
                step: '2',
                title: 'Chain',
                desc: "Every block stores the previous block's hash, creating an unbreakable chain. Altering one block invalidates all blocks after it.",
                color: 'bg-info/10 text-info border-info/20',
              },
              {
                step: '3',
                title: 'Distribute',
                desc: 'Every new block is broadcast to 3 independent nodes simultaneously. No single server controls the chain — all nodes must agree.',
                color: 'bg-warning/10 text-warning border-warning/20',
              },
              {
                step: '4',
                title: 'Verify',
                desc: 'Anyone can validate the entire chain and check cross-node consensus. If any node disagrees, tampering is instantly detected.',
                color: 'bg-success/10 text-success border-success/20',
              },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className={`p-4 rounded-xl border ${color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-current/10 flex items-center justify-center text-xs font-bold">{step}</span>
                  <span className="font-bold text-lg">{title}</span>
                </div>
                <p className="text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
