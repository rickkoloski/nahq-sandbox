import React from 'react';
import { motion } from 'framer-motion';
import { Bot, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AIGuideCard({ 
  title = "Your AI Development Guide",
  message,
  actions = [],
  variant = 'default', // 'default', 'compact', 'hero'
  className = ''
}) {
  const sizeClasses = {
    default: 'p-6',
    compact: 'p-4',
    hero: 'p-8'
  };

  const avatarSizes = {
    default: 'w-12 h-12',
    compact: 'w-10 h-10',
    hero: 'w-16 h-16'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        bg-gradient-to-br from-[#00A3E0]/5 via-[#00B5E2]/10 to-[#00A3E0]/5 
        border border-[#00A3E0]/20 rounded-2xl ${sizeClasses[variant]} ${className}
      `}
    >
      <div className="flex gap-4">
        {/* AI Avatar */}
        <div className={`
          ${avatarSizes[variant]} rounded-full 
          bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] 
          flex items-center justify-center flex-shrink-0
          shadow-lg shadow-[#00A3E0]/20
        `}>
          <Bot className="w-1/2 h-1/2 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#3D3D3D] mb-2">{title}</h3>
          
          {message && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {message}
            </p>
          )}

          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {actions.map((action, index) => (
                action.href ? (
                  <Link key={index} to={action.href}>
                    <Button
                      variant={action.primary ? 'default' : 'outline'}
                      size="sm"
                      className={action.primary 
                        ? 'bg-[#00A3E0] hover:bg-[#0093c9] text-white' 
                        : 'border-[#00A3E0] text-[#00A3E0] hover:bg-[#00A3E0]/10'
                      }
                    >
                      {action.icon && <action.icon className="w-4 h-4 mr-1" />}
                      {action.label}
                      {action.arrow && <ArrowRight className="w-4 h-4 ml-1" />}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={index}
                    variant={action.primary ? 'default' : 'outline'}
                    size="sm"
                    onClick={action.onClick}
                    className={action.primary 
                      ? 'bg-[#00A3E0] hover:bg-[#0093c9] text-white' 
                      : 'border-[#00A3E0] text-[#00A3E0] hover:bg-[#00A3E0]/10'
                    }
                  >
                    {action.icon && <action.icon className="w-4 h-4 mr-1" />}
                    {action.label}
                    {action.arrow && <ArrowRight className="w-4 h-4 ml-1" />}
                  </Button>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}