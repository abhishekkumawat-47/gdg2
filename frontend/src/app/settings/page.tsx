"use client";

import { Settings, Shield, Bell, Users, Building2, Database, Palette, Save } from "lucide-react";

const settingsSections = [
  {
    title: "Access Control",
    icon: <Shield size={16} className="text-blue-600" />,
    items: [
      { label: "Role Permissions", description: "Manage what each role can view and do", action: "Configure" },
      { label: "Admin Accounts",   description: "Add or remove administrator access",    action: "Manage" },
      { label: "Audit Logs",       description: "View all system access events",          action: "View" },
    ],
  },
  {
    title: "Notifications",
    icon: <Bell size={16} className="text-amber-600" />,
    items: [
      { label: "SMS Provider API", description: "Configure Twilio / MSG91 credentials",  action: "Connect" },
      { label: "Email Alerts",     description: "Set up SMTP for email notifications",    action: "Configure" },
      { label: "Alert Thresholds", description: "Define triggers for auto-alerts",        action: "Set" },
    ],
  },
  {
    title: "Facility Configuration",
    icon: <Building2 size={16} className="text-emerald-600" />,
    items: [
      { label: "Floor Plans",      description: "Upload or update building floor maps",   action: "Upload" },
      { label: "Zone Definitions", description: "Define evacuation zones and exits",      action: "Edit" },
      { label: "Capacity Limits",  description: "Set occupancy limits per zone",          action: "Set" },
    ],
  },
  {
    title: "System",
    icon: <Database size={16} className="text-gray-600" />,
    items: [
      { label: "Data Retention",   description: "Set how long logs and events are kept",  action: "Configure" },
      { label: "Backup & Export",  description: "Schedule automatic data backups",        action: "Setup" },
      { label: "Integrations",     description: "Connect Slack, Teams, webhooks",         action: "Connect" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-[1000px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Configure access control, notifications, and facility parameters.</p>
      </div>

      <div className="space-y-4">
        {settingsSections.map((section) => (
          <div key={section.title} className="card-premium overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              {section.icon}
              <h2 className="text-sm font-bold text-gray-900">{section.title}</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                    <div className="text-xs text-gray-400 font-medium mt-0.5">{item.description}</div>
                  </div>
                  <button className="px-4 py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg transition-all cursor-pointer uppercase tracking-wider">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
