"use client";

import { useEffect, useState } from "react";
import { getSettings } from "@/services/settings";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const settingsData = await getSettings();
                setSettings(settingsData);
            } catch (error) {
                console.error("Failed to load settings:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50/30">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-slate-50/30 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between space-y-2 mb-8">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900">Settings</h2>
                        <p className="text-slate-500 font-medium mt-1">Manage your company details and global preferences.</p>
                    </div>
                </div>
                <div className="glass-card rounded-3xl p-8">
                    <SettingsForm settings={settings} />
                </div>
            </div>
        </div>
    );
}
