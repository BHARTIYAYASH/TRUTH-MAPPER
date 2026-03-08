"use client";

import { useUser, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Settings,
  Shield,
  Accessibility,
  BarChart3,
  FileText,
  Share2,
  Clock,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import type { ArgumentMapDocument, AnalysisResult } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// --- Sub-components (could be extracted later) ---

function StatCard({ label, value, subtext, icon: Icon, trend }: { label: string, value: string | number, subtext: string, icon: any, trend?: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">
            {trend && <span className="text-emerald-500 mr-1">{trend}</span>}
            {subtext}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivityItem({ item }: { item: ArgumentMapDocument }) {
  const formattedDate = item.creationDate
    ? formatDistanceToNow(item.creationDate.toDate(), { addSuffix: true })
    : 'recently';

  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="bg-primary/10 p-2 rounded-full">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-medium truncate">{item.name || "Untitled Analysis"}</span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium hidden sm:inline-block">Completed</span>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/analysis/${item.id}`} className="gap-2">
            View <Eye className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function DetailedBreakdown({ stats }: { stats: any }) {
  const { t } = useTranslation();
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{t('stats_breakdown')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">

          {/* Content Analysis Stats */}
          <div className="space-y-4">
            <h4 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">{t('stats_content_analysis')}</h4>
            <div className="flex justify-between py-2 border-b border-dashed">
              <span>{t('stats_docs_processed')}</span>
              <span className="font-mono font-medium">{stats.total}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dashed">
              <span>{t('stats_args_identified')}</span>
              <span className="font-mono font-medium">{stats.argsIdentified}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dashed">
              <span>{t('stats_sources_analyzed')}</span>
              <span className="font-mono font-medium">{stats.sourcesAnalyzed}</span>
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="space-y-4">
            <h4 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">{t('stats_quality_metrics')}</h4>
            <div className="flex justify-between py-2 border-b border-dashed">
              <span className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-amber-500" /> {t('stats_fallacies')}</span>
              <span className="font-mono font-medium">{stats.fallaciesDetected}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dashed">
              <span className="flex items-center gap-2"><TrendingUp className="h-3 w-3 text-blue-500" /> {t('stats_avg_depth')}</span>
              <span className="font-mono font-medium">{stats.avgDepth} levels</span>
            </div>
            <div className="flex justify-between py-2 border-b border-dashed">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> {t('stats_accuracy')}</span>
              <span className="font-mono font-medium text-emerald-600">--</span>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [historyLimit, setHistoryLimit] = useState(5);
  const [activeTab, setActiveTab] = useState('usage');
  const { t } = useTranslation();

  // Fetch History Data
  const historyCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'argumentMaps');
  }, [firestore, user]);

  const historyQuery = useMemoFirebase(() => {
    if (!historyCollectionRef) return null;
    return query(historyCollectionRef, orderBy('creationDate', 'desc'));
  }, [historyCollectionRef]);

  const { data: history, isLoading: isHistoryLoading } = useCollection<ArgumentMapDocument>(historyQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Calculate Real Statistics
  const stats = useMemo(() => {
    if (!history) return {
      total: 0,
      visualizations: 0,
      time: 0,
      shared: 0,
      argsIdentified: 0,
      sourcesAnalyzed: 0,
      fallaciesDetected: 0,
      avgDepth: 0
    };

    let totalArgs = 0;
    let totalSources = 0;
    let totalFallacies = 0;
    let depthSum = 0;

    history.forEach(doc => {
      try {
        const data = JSON.parse(doc.jsonData) as AnalysisResult;
        const blueprint = data.blueprint || [];

        totalArgs += blueprint.length;
        totalSources += blueprint.filter(n => n.source).length;
        totalFallacies += blueprint.reduce((acc: number, n: any) => acc + (n.fallacies?.length || 0), 0);

        // Estimate depth roughly by simple heuristic
        depthSum += Math.min(Math.ceil(Math.log2(blueprint.length + 1)) + 1, 8);
      } catch (e) {
        // Ignore parse errors
      }
    });

    const count = history.length;
    return {
      total: count,
      visualizations: Math.floor(count * 1.5) + (count > 0 ? 2 : 0), // Mock: 1.5 visuals per analysis
      time: (count * 0.4).toFixed(1), // Mock: ~25 mins per analysis
      shared: Math.floor(count / 4), // Mock: 1 in 4 shared
      argsIdentified: totalArgs,
      sourcesAnalyzed: totalSources,
      fallaciesDetected: totalFallacies,
      avgDepth: count > 0 ? (depthSum / count).toFixed(1) : 0
    };
  }, [history]);


  if (isUserLoading || !user) {
    return (
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold">{t('account_information')}</h2>
              <p className="text-sm text-muted-foreground">Manage your personal and academic details</p>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('profile_full_name')}</label>
                    <div className="p-2 border rounded-md bg-muted/50 text-sm">
                      {user.displayName || 'Not provided'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('email')}</label>
                    <div className="p-2 border rounded-md bg-muted/50 text-sm">
                      {user.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('profile_account_id')}</label>
                    <div className="p-2 border rounded-md bg-muted/50 font-mono text-xs">
                      {user.uid}
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline">{t('profile_edit')}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold">{t('analysis_preferences')}</h2>
              <p className="text-sm text-muted-foreground">Customize how the AI analyzes arguments</p>
            </div>
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground relative min-h-[200px] flex items-center justify-center border-dashed">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
                <div className="relative z-10">
                  <Settings className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p>Advanced preferences are coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'usage':
      default:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{t('usage_statistics')}</h2>
                <p className="text-sm text-muted-foreground">Track your analysis activity and productivity metrics</p>
              </div>

              {/* Time Range Selector (Mock) */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border">
                <Clock className="h-3 w-3" />
                <span>All Time</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label={t('stats_analyses_created')}
                value={stats.total}
                subtext="Total maps generated"
                trend={stats.total > 0 ? "+1" : ""}
                icon={FileText}
              />
              <StatCard
                label={t('stats_visualizations')}
                value={stats.visualizations}
                subtext="Views generated"
                icon={BarChart3}
              />
              <StatCard
                label={t('stats_time_spent')}
                value={`${stats.time}h`}
                subtext="Avg: 25m / analysis"
                icon={Clock}
              />
              <StatCard
                label={t('stats_shared_maps')}
                value={stats.shared}
                subtext="External shares"
                icon={Share2}
              />
            </div>

            {/* Breakdown & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <DetailedBreakdown stats={stats} />

              {/* Preferences Summary Card */}
              <Card className="col-span-1 h-fit">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('preferences_view')}</span>
                    <div className="px-2 py-1 bg-muted rounded text-xs font-medium">Flow Map</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('preferences_export')}</span>
                    <div className="px-2 py-1 bg-muted rounded text-xs font-medium">PNG</div>
                  </div>
                  <div className="pt-4 mt-2 border-t">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('preferences')}>{t('profile_edit')}</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                {history && history.length > 5 && (
                  <Button variant="link" size="sm" onClick={() => setHistoryLimit(prev => prev + 5)}>View More</Button>
                )}
              </div>
              <div className="space-y-2">
                {isHistoryLoading ? (
                  <div className="py-8 flex justify-center"><LoadingSpinner className="h-6 w-6" /></div>
                ) : history && history.length > 0 ? (
                  history.slice(0, historyLimit).map(item => (
                    <RecentActivityItem key={item.id} item={item} />
                  ))
                ) : (
                  <div className="p-8 text-center border-2 border-dashed text-muted-foreground rounded-xl bg-muted/10">
                    <p>No activity found yet.</p>
                    <Button variant="link" asChild className="mt-2"><Link href="/">Start your first analysis</Link></Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  }


  return (
    <div className="w-full px-4 md:px-8 py-8 md:py-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

        {/* 1. Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div className="pl-2">
            <h1 className="text-3xl font-bold font-headline mb-1 tracking-tight">{t('profile_settings')}</h1>
            <p className="text-sm text-muted-foreground">Manage your account preferences</p>
          </div>

          <nav className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              className={cn("justify-start gap-3 px-3 relative font-medium transition-all duration-200", activeTab === 'usage' ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground hover:bg-muted/50")}
              onClick={() => setActiveTab('usage')}
            >
              {activeTab === 'usage' && <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-md"></div>}
              <BarChart3 className="h-4 w-4" />
              {t('usage_statistics')}
            </Button>
            <Button
              variant="ghost"
              className={cn("justify-start gap-3 px-3 relative font-medium transition-all duration-200", activeTab === 'account' ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground hover:bg-muted/50")}
              onClick={() => setActiveTab('account')}
            >
              {activeTab === 'account' && <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-md"></div>}
              <User className="h-4 w-4" />
              {t('account_information')}
            </Button>
            <Button
              variant="ghost"
              className={cn("justify-start gap-3 px-3 relative font-medium transition-all duration-200", activeTab === 'preferences' ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground hover:bg-muted/50")}
              onClick={() => setActiveTab('preferences')}
            >
              {activeTab === 'preferences' && <div className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-md"></div>}
              <Settings className="h-4 w-4" />
              {t('analysis_preferences')}
            </Button>
            <Button variant="ghost" className="justify-start gap-3 px-3 text-muted-foreground hover:bg-muted/50 opacity-50 cursor-not-allowed">
              <Accessibility className="h-4 w-4" />
              {t('accessibility')}
            </Button>
            <Button variant="ghost" className="justify-start gap-3 px-3 text-muted-foreground hover:bg-muted/50 opacity-50 cursor-not-allowed">
              <Shield className="h-4 w-4" />
              {t('security_privacy')}
            </Button>
          </nav>

          {/* Mini Profile Card */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={user.photoURL ?? ''} />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user.displayName || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate opacity-70">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Content Area */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
