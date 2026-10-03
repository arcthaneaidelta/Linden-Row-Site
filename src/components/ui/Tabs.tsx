import React from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  theme?: 'light' | 'dark';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 border-b overflow-x-auto no-scrollbar ${
        isDark ? 'border-[#2C3234] bg-[#16191A]' : 'border-border bg-surface'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider transition-colors duration-fast whitespace-nowrap ${
              isActive
                ? isDark
                  ? 'text-hood-accent font-semibold'
                  : 'text-ink font-semibold'
                : isDark
                ? 'text-[#9A958B] hover:text-white'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive
                    ? isDark
                      ? 'bg-hood-accent/20 text-hood-accent'
                      : 'bg-primary text-surface'
                    : isDark
                    ? 'bg-[#2C3234] text-[#9A958B]'
                    : 'bg-secondary text-ink-2'
                }`}
              >
                {tab.badge}
              </span>
            )}
            {isActive && (
              <span
                className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                  isDark ? 'bg-hood-accent' : 'bg-primary'
                }`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
