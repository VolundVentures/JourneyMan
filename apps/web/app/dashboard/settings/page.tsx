'use client';

import { Building2, Crown, Globe, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockOrg } from '@/lib/mock-data';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold text-surface-50">Settings</h1>
        <p className="mt-1 text-sm text-surface-400">Manage your organization settings</p>
      </div>

      {/* Organization Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <CardTitle>Organization</CardTitle>
              <CardDescription>Basic organization settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Organization Name</label>
              <Input defaultValue={mockOrg.name} />
            </div>
            <div>
              <label className="block text-xs text-surface-500 uppercase tracking-wider mb-2">Slug</label>
              <Input defaultValue={mockOrg.slug} className="font-mono" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Badge variant="default">
                <Crown className="w-3 h-3 mr-1" />
                {mockOrg.plan.charAt(0).toUpperCase() + mockOrg.plan.slice(1)} Plan
              </Badge>
              <span className="text-xs text-surface-500">
                Since {new Date(mockOrg.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Button variant="outline" size="sm">Upgrade Plan</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Escalation alerts', desc: 'Get notified when AI employees escalate issues', checked: true },
            { label: 'Approval reminders', desc: 'Daily digest of pending approvals', checked: true },
            { label: 'Performance reports', desc: 'Weekly performance summary email', checked: false },
            { label: 'New employee onboarded', desc: 'Alert when onboarding completes', checked: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-surface-200">{item.label}</p>
                <p className="text-xs text-surface-500">{item.desc}</p>
              </div>
              <button
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  item.checked ? 'bg-brand-500' : 'bg-surface-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    item.checked ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive-500/20">
        <CardHeader>
          <CardTitle className="text-destructive-400">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-200">Pause All AI Employees</p>
              <p className="text-xs text-surface-500">Immediately stop all AI employee activity</p>
            </div>
            <Button variant="outline" size="sm" className="border-warning-500/30 text-warning-400 hover:bg-warning-500/10">
              Pause All
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-surface-200">Emergency Kill Switch</p>
              <p className="text-xs text-surface-500">Halt all activity and disconnect integrations</p>
            </div>
            <Button variant="destructive" size="sm">
              Kill Switch
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="pb-4">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
