import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Github, Mail, Phone, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[linear-gradient(135deg,#0f6f6f_0%,#0b5b5b_45%,#0a4c4c_100%)] text-white">
      <div className="container mx-auto px-6 py-14 font-[\"Manrope\"]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
          <div>
            <div className="mb-5">
              <img
                src="/athenurawhitelogo.png"
                alt="Athenura"
                className="h-10"
              />
            </div>
            <p className="text-sm leading-relaxed text-white/80">
              Athenura delivers enterprise-grade software that scales with your growth.
            </p>
            <p className="text-sm leading-relaxed text-white/80 mt-3">
              Strategy, engineering, and automation for modern organizations.
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-white/70 mt-6">
              All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/career" className="hover:text-white transition-colors">Career</Link></li>
              <li><Link to="/internship" className="hover:text-white transition-colors">Internship Program</Link></li>
              <li><Link to="/internship-policy" className="hover:text-white transition-colors">Internship Policy</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] mb-4">Services</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link to="/services/custom-software" className="hover:text-white transition-colors">Custom Software Development</Link></li>
              <li><Link to="/services/web-apps" className="hover:text-white transition-colors">Web Application Development</Link></li>
              <li><Link to="/services/maintenance" className="hover:text-white transition-colors">Website Maintenance</Link></li>
              <li><Link to="/services/testing" className="hover:text-white transition-colors">Software Testing and QA</Link></li>
              <li><Link to="/services/automation" className="hover:text-white transition-colors">Business Automation Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] mb-4">Contact Us</h3>
            <div className="space-y-4 text-sm text-white/80">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Email</p>
                  <a href="mailto:official@athenura.in" className="hover:text-white transition-colors">
                    official@athenura.in
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Phone</p>
                  <a href="tel:+919835051934" className="hover:text-white transition-colors">
                    +91 98350 51934
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs uppercase tracking-[0.2em] text-white/70 mb-3">Location</h4>
              <div className="rounded-lg overflow-hidden border border-white/20 shadow-sm">
                <iframe
                  title="Athenura location"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14689.457017026245!2d72.5716!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1700000000000"
                  className="h-32 w-full"
                  loading="lazy"
                />
              </div>
              <p className="text-sm text-white/80 mt-3">
                Athenura Towers, Ring Road, Ahmedabad, Gujarat 380001
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 mt-12 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-white/70">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.2em] text-white/70">Follow Us</span>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="LinkedIn"
                className="h-9 w-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="h-9 w-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="h-9 w-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="h-9 w-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
