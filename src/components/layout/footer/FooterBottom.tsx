export function FooterBottom() {
  return (
    <div className="border-t border-slate-100 pt-8 flex items-center justify-between">
      <div className="text-[13px] text-slate-400 font-medium">
        © {new Date().getFullYear()} Litmus Food Analytics. All rights reserved.
      </div>
      <div className="flex items-center gap-6 text-slate-400">
         <span className="hover:text-[#D32F2F] cursor-pointer text-[13px] transition-colors font-medium">Twitter</span>
         <span className="hover:text-[#D32F2F] cursor-pointer text-[13px] transition-colors font-medium">LinkedIn</span>
         <span className="hover:text-[#D32F2F] cursor-pointer text-[13px] transition-colors font-medium">Instagram</span>
      </div>
    </div>
  );
}
