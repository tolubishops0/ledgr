import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";

type SidebarProps = {
  collapsed: boolean;
  onLogout: () => void;
};

export function SignOut({ onLogout, collapsed }: SidebarProps) {
  return (
    <button
      onClick={onLogout}
      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 overflow-hidden
                 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-50 hover:bg-gray-100 dark:hover:bg-zinc-800"
    >
      <LogOut size={18} className="shrink-0" />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm whitespace-nowrap overflow-hidden"
          >
            Sign out
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
