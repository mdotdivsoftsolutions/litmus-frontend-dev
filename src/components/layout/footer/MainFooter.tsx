import { Link } from "react-router-dom";

export function MainFooter() {
  return (
    <footer className="hidden lg:block bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-5 gap-6 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-start">
              <img src="/logo.png" alt="Litmus Food Analytics" className="h-10 sm:h-12 object-contain" />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pr-4">
              India's most trusted platform for food testing and certification. NABL accredited & FSSAI certified lab network.
            </p>
          </div>
          {/* Company */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs mb-4 uppercase tracking-wider">Company</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <Link to="/about" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">About Us</Link>
              <Link to="/careers" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Careers</Link>
              <Link to="/blogs" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Blogs</Link>
              <Link to="/contact" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Contact Us</Link>
            </div>
          </div>
          {/* Services */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs mb-4 uppercase tracking-wider">Services</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <Link to="/tests" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Tests</Link>
              <Link to="/packages" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Packages</Link>
              <Link to="/labs" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Labs</Link>
              <Link to="/consultation" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Book Consultation</Link>
              <Link to="/support" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Support</Link>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs mb-4 uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <Link to="/cart" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Cart</Link>
              <Link to="/help" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Help Center</Link>
              <Link to="/faqs" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">FAQs</Link>
              <Link to="/track-order" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Track Order</Link>
            </div>
          </div>
          {/* Policies */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs mb-4 uppercase tracking-wider">Policies</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <Link to="/terms" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Terms & Condition</Link>
              <Link to="/privacy" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">Privacy Policy</Link>
              <Link to="/nabl" className="block hover:text-[#D32F2F] hover:translate-x-1 transition-all">NABL Data</Link>
            </div>
          </div>
        </div>
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
      </div>
    </footer>
  );
}
