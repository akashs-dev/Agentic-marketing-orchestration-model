import { FileText, Users, Palette, Zap, Target, BarChart3, Lightbulb, Filter, Share2, Sparkles, LineChart } from 'lucide-react';

export type NodeData = {
  id: string;
  title: string;
  lane: 'strategy' | 'design' | 'ops';
  x: number;
  y: number;
  icon: any;
  adobeTool: string;
  agentPush: string;
  humanAction: string;
  dependsOn: string[];
  links?: { targetView: string, label: string }[];
};

export const NODES: NodeData[] = [
  {
    id: 'business_owner_a',
    title: 'Business Owner (Pillar A)',
    lane: 'strategy',
    x: 100, y: 150,
    icon: FileText,
    adobeTool: 'Adobe Workfront',
    agentPush: 'Use Case Planning Agent drafts brief with audience estimates, ROI projections, and channel recommendations via historical/behavioral data.',
    humanAction: 'Reviews projections, adjusts budget/targets, approves brief.',
    dependsOn: []
  },
  {
    id: 'business_owner_b',
    title: 'Business Owner (Pillar B)',
    lane: 'strategy',
    x: 100, y: 350,
    icon: FileText,
    adobeTool: 'Adobe Workfront',
    agentPush: 'Use Case Planning Agent drafts brief with audience estimates, ROI projections, and channel recommendations via historical/behavioral data.',
    humanAction: 'Reviews projections, adjusts budget/targets, approves brief.',
    dependsOn: []
  },
  {
    id: 'business_owner_c',
    title: 'Business Owner (Pillar C)',
    lane: 'strategy',
    x: 100, y: 550,
    icon: FileText,
    adobeTool: 'Adobe Workfront',
    agentPush: 'Use Case Planning Agent drafts brief with audience estimates, ROI projections, and channel recommendations via historical/behavioral data.',
    humanAction: 'Reviews projections, adjusts budget/targets, approves brief.',
    dependsOn: []
  },
  {
    id: 'audience_strategy',
    title: 'Audience Strategy Lead',
    lane: 'strategy',
    x: 600, y: 50,
    icon: Users,
    adobeTool: 'RTCDP',
    agentPush: 'Segmentation Agent proposes cohorts (S1/S2/S3), suppression logic, and propensity-based models using RTCDP and banking attributes.',
    humanAction: 'Reviews/adjusts segmentation logic and targeting criteria.',
    dependsOn: ['business_owner_a', 'business_owner_b', 'business_owner_c'],
    links: [{ targetView: 'ops', label: 'Proceed to Operations' }]
  },
  {
    id: 'campaign_strategy',
    title: 'Campaign Strategy Lead',
    lane: 'strategy',
    x: 600, y: 350,
    icon: Zap,
    adobeTool: 'Adobe Campaign',
    agentPush: 'Campaign Agent generates omnichannel journey blueprint (mix, cadence, trigger events) based on performance history.',
    humanAction: 'Adjusts frequency, timing, and offers.',
    dependsOn: ['business_owner_a', 'business_owner_b', 'business_owner_c'],
    links: [{ targetView: 'creative', label: 'Proceed to Creative' }, { targetView: 'ops', label: 'Proceed to Operations' }]
  },
  {
    id: 'analytics_strategy',
    title: 'Analytics Strategy Lead',
    lane: 'strategy',
    x: 600, y: 650,
    icon: BarChart3,
    adobeTool: 'CJA',
    agentPush: 'Insights Agent provides attribution insights, funnel diagnostics, and anomaly detection.',
    humanAction: 'Defines measurement frameworks and optimization strategy.',
    dependsOn: ['business_owner_a', 'business_owner_b', 'business_owner_c'],
    links: [{ targetView: 'ops', label: 'Proceed to Operations' }]
  },
  {
    id: 'personalisation_strategy',
    title: 'Personalisation Strategy Lead',
    lane: 'strategy',
    x: 1100, y: 50,
    icon: Target,
    adobeTool: 'Adobe Target',
    agentPush: 'Personalisation Agent recommends A/B test ideas and rules based on behavioral signals from Adobe Analytics and CJA.',
    humanAction: 'Approves personalization experiments.',
    dependsOn: ['audience_strategy'],
    links: [{ targetView: 'ops', label: 'Proceed to Operations' }]
  },
  {
    id: 'creative_director',
    title: 'Creative Director',
    lane: 'design',
    x: 600, y: 900,
    icon: Palette,
    adobeTool: 'Adobe GenStudio',
    agentPush: 'Insights Agent provides attribution on past performance, messaging themes by segment, and content gaps.',
    humanAction: 'Defines final narrative and approves messaging strategy.',
    dependsOn: ['business_owner_a', 'business_owner_b', 'business_owner_c']
  },
  {
    id: 'creative_designer',
    title: 'Creative Designer',
    lane: 'design',
    x: 1100, y: 900,
    icon: Palette,
    adobeTool: 'Adobe AEM / DAM',
    agentPush: 'Creative Agent suggests copy variations, image placeholders, and metadata tags aligned to channels.',
    humanAction: 'Designs final assets and uploads to Adobe DAM and AEM.',
    dependsOn: ['creative_director'],
    links: [{ targetView: 'ops', label: 'Proceed to Operations' }]
  },
  {
    id: 'cdp_ops',
    title: 'CDP Operations',
    lane: 'ops',
    x: 1100, y: 1300,
    icon: Users,
    adobeTool: 'RTCDP',
    agentPush: 'Drafts RTCDP segment definitions, eligibility rules, and pre-configured channel sync.',
    humanAction: 'Validates customer eligibility, data quality, and manually triggers creation.',
    dependsOn: ['audience_strategy']
  },
  {
    id: 'campaign_ops',
    title: 'Campaign Operations',
    lane: 'ops',
    x: 1600, y: 1300,
    icon: Zap,
    adobeTool: 'Adobe Campaign',
    agentPush: 'Drafts Adobe Campaign workflows with segments and assets already referenced.',
    humanAction: 'Reviews scheduling rules and manually activates campaigns.',
    dependsOn: ['campaign_strategy', 'cdp_ops', 'creative_designer']
  },
  {
    id: 'target_ops',
    title: 'Target Operations',
    lane: 'ops',
    x: 1600, y: 1600,
    icon: Target,
    adobeTool: 'Adobe Target',
    agentPush: 'Drafts Adobe Target activities with pre-filled segments and experiences.',
    humanAction: 'Validates rules and activates experiments.',
    dependsOn: ['personalisation_strategy', 'cdp_ops', 'creative_designer']
  },
  {
    id: 'analytics_practitioners',
    title: 'Analytics Practitioners',
    lane: 'ops',
    x: 1100, y: 1650,
    icon: BarChart3,
    adobeTool: 'Adobe Analytics',
    agentPush: 'Automates dashboards, scheduled reports, and natural-language query responses.',
    humanAction: 'Validates insights and performs deep-dive analysis.',
    dependsOn: ['analytics_strategy']
  }
];

export const CONNECTIONS = [
  { source: 'business_owner_a', target: 'audience_strategy' },
  { source: 'business_owner_a', target: 'campaign_strategy' },
  { source: 'business_owner_a', target: 'creative_director' },
  { source: 'business_owner_a', target: 'analytics_strategy' },
  { source: 'business_owner_b', target: 'audience_strategy' },
  { source: 'business_owner_b', target: 'campaign_strategy' },
  { source: 'business_owner_b', target: 'creative_director' },
  { source: 'business_owner_b', target: 'analytics_strategy' },
  { source: 'business_owner_c', target: 'audience_strategy' },
  { source: 'business_owner_c', target: 'campaign_strategy' },
  { source: 'business_owner_c', target: 'creative_director' },
  { source: 'business_owner_c', target: 'analytics_strategy' },
  { source: 'audience_strategy', target: 'personalisation_strategy' },
  { source: 'audience_strategy', target: 'cdp_ops' },
  { source: 'campaign_strategy', target: 'campaign_ops' },
  { source: 'creative_director', target: 'creative_designer' },
  { source: 'creative_designer', target: 'campaign_ops' },
  { source: 'creative_designer', target: 'target_ops' },
  { source: 'personalisation_strategy', target: 'target_ops' },
  { source: 'analytics_strategy', target: 'analytics_practitioners' },
  { source: 'cdp_ops', target: 'campaign_ops' },
  { source: 'cdp_ops', target: 'target_ops' },
];

export const AGENTS = [
  { 
    id: 'use_case',
    name: 'Use Case Builder', 
    x: 300, y: 100, 
    icon: Lightbulb, 
    color: 'text-amber-500', 
    bg: 'bg-amber-500/10', 
    border: 'border-amber-400/30',
    shadow: 'shadow-[0_0_40px_rgba(245,158,11,0.2)]',
    adobeTool: 'Adobe Workfront',
    replaces: 'Marketing Strategist, Business Analyst',
    description: 'Translates business goals into actionable campaign briefs, predicting ROI and required resources.',
    agentType: 'brief_generator'
  },
  { 
    id: 'segmentation',
    name: 'Segmentation', 
    x: 800, y: 200, 
    icon: Filter, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-400/30',
    shadow: 'shadow-[0_0_40px_rgba(16,185,129,0.2)]',
    adobeTool: 'Adobe Real-Time CDP',
    replaces: 'Data Analyst, SQL Developer',
    description: 'Converts natural language into complex audience segments and suppression logic.',
    agentType: 'segment_builder'
  },
  { 
    id: 'campaign',
    name: 'Campaign Briefing and Setup', 
    x: 1300, y: 300, 
    icon: Share2, 
    color: 'text-blue-500', 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-400/30',
    shadow: 'shadow-[0_0_40px_rgba(59,130,246,0.2)]',
    adobeTool: 'Adobe Journey Optimizer',
    replaces: 'Campaign Manager, Marketing Ops',
    description: 'Sets up omnichannel journeys, determining optimal mix, cadence, and triggers.',
    agentType: 'journey_orchestrator'
  },
  { 
    id: 'personalization',
    name: 'CRO Hypothesis Builder', 
    x: 1800, y: 150, 
    icon: Sparkles, 
    color: 'text-purple-500', 
    bg: 'bg-purple-500/10', 
    border: 'border-purple-400/30',
    shadow: 'shadow-[0_0_40px_rgba(168,85,247,0.2)]',
    adobeTool: 'Adobe Target & GenStudio',
    replaces: 'CRO Specialist, Copywriter, UI Designer',
    description: 'Generates and tests hyper-personalized content variations and offers in real-time.',
    agentType: 'variant_generator'
  },
  { 
    id: 'insights',
    name: 'Insights Builder', 
    x: 1000, y: 800, 
    icon: LineChart, 
    color: 'text-rose-500', 
    bg: 'bg-rose-500/10', 
    border: 'border-rose-400/30',
    shadow: 'shadow-[0_0_40px_rgba(244,63,94,0.2)]',
    adobeTool: 'Customer Journey Analytics',
    replaces: 'Data Scientist, Reporting Analyst',
    description: 'Proactively identifies anomalies, attributes performance, and suggests optimizations.',
    agentType: 'anomaly_detector'
  },
];
