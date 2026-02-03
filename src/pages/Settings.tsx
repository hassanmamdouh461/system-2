import React from 'react';
import { User, Store, Bell, Lock, HelpCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const sections = [
    {
      title: 'Profile Settings',
      items: [
        { icon: User, label: 'My Account', desc: 'Manage your personal details' },
        { icon: Store, label: 'Restaurant Info', desc: 'Update business information' },
      ]
    },
    {
      title: 'App Settings',
      items: [
        { icon: Bell, label: 'Notifications', desc: 'Configure alert preferences' },
        { icon: Lock, label: 'Privacy & Security', desc: 'Update password and controls' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', desc: 'Get help with using the app' },
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
               <h2 className="font-semibold text-gray-900">{section.title}</h2>
            </div>
            <div className="p-2">
               {section.items.map((item, i) => (
                  <button key={i} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left group">
                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                        <item.icon size={20} />
                     </div>
                     <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.label}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                     </div>
                  </button>
               ))}
            </div>
          </motion.div>
        ))}

        <motion.button 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-semibold hover:bg-red-100 flex items-center justify-center gap-2 transition-colors"
        >
           <LogOut size={20} /> Sign Out
        </motion.button>
      </div>
    </div>
  );
}
