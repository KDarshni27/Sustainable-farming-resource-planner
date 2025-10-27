import React from 'react';
import { TABS } from '../constants';
import { Tab } from '../types';

interface TabsComponentProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-slate-700 mb-6">
            <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            ${activeTab === tab.id
                                ? 'border-green-500 text-green-400'
                                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                            }
                            whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default TabsComponent;