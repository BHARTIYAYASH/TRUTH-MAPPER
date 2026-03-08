
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import hi from './locales/hi.json';
import mr from './locales/mr.json';
import te from './locales/te.json';
import ta from './locales/ta.json';

// English translations
const en = {
    translation: {
        "app_name": "Argument Cartographer",
        "hero_title": "Uncover the Structure of Any Argument",
        "hero_subtitle": "Input a topic, URL, or document. Our AI will deconstruct it into a clear, interactive map of claims, counterclaims, and evidence.",
        "tab_topic": "Topic",
        "tab_url": "URL",
        "tab_document": "Document",
        "placeholder_topic": "e.g., The pros and cons of universal basic income",
        "placeholder_url": "e.g., https://www.example.com/article",
        "placeholder_document": "Paste your document text here or upload a file...",
        "btn_analyze": "✨ Analyze Arguments",
        "analysis_running": "Analysis running...",
        "flip_card": "Flip card to see source",
        "narrative_radar": "Narrative Radar",
        "login": "Login",
        "signup": "Sign Up",
        "logout": "Log out",
        "profile_settings": "Profile Settings",
        "usage_statistics": "Usage Statistics",
        "account_information": "Account Information",
        "analysis_preferences": "Analysis Preferences",
        "accessibility": "Accessibility",
        "security_privacy": "Security & Privacy",
        "email": "Email",
        "password": "Password",
        "forgot_password": "Forgot your password?",
        "dont_have_account": "Don't have an account?",
        "already_have_account": "Already have an account?",
        "create_account_title": "Sign Up",
        "create_account_desc": "Enter your information to create an account",
        "login_title": "Login",
        "login_desc": "Enter your email below to login to your account",
        "btn_login": "Login",
        "btn_create_account": "Create an account",
        "radar_title": "The Narrative Radar",
        "radar_subtitle": "A curated gallery of the most polarized battles currently dominating the Indian information landscape.",
        "live_feed": "Live Feed",
        "updated_live": "Updated: Live (Mock)",
        "click_explore": "Click to Explore Map",
        "high_activity": "High Activity",
        "radar_title_one-nation-one-election": "One Nation, One Election",
        "radar_subtitle_one-nation-one-election": "The push for simultaneous polls vs. federal structure.",
        "radar_title_ipac-vs-ed": "The I-PAC vs. ED Standoff",
        "radar_subtitle_ipac-vs-ed": "Federal Agencies vs. Political Strategy in West Bengal.",
        "radar_title_delimitation-crisis": "The Delimitation Crisis",
        "radar_subtitle_delimitation-crisis": "North vs. South: The battle for political representation.",
        "radar_title_waqf-bill-2025": "The Waqf Amendment Bill 2025",
        "radar_subtitle_waqf-bill-2025": "Reforming usage rights or targeting minority assets?",
        "profile_full_name": "Full Name",
        "profile_account_id": "Account ID",
        "profile_edit": "Edit Profile",
        "stats_analyses_created": "Analyses Created",
        "stats_visualizations": "Visualizations",
        "stats_time_spent": "Time Spent",
        "stats_shared_maps": "Shared Maps",
        "stats_breakdown": "Detailed Breakdown",
        "stats_content_analysis": "Content Analysis",
        "stats_quality_metrics": "Quality Metrics",
        "stats_docs_processed": "Documents Processed",
        "stats_args_identified": "Arguments Identified",
        "stats_sources_analyzed": "Sources Analyzed",
        "stats_fallacies": "Fallacies Detected",
        "stats_avg_depth": "Avg. Analysis Depth",
        "stats_accuracy": "Accuracy Score",
        "preferences_view": "Preferred View",
        "preferences_export": "Export Format",
        "back_to_radar": "Back to Narrative Radar",
        "map_own_topic": "Map Your Own Topic"
    }
};

const resources = {
    en: en,
    hi: { translation: hi },
    mr: { translation: mr },
    te: { translation: te },
    ta: { translation: ta }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
