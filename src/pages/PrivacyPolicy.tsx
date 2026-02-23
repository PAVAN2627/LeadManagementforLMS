import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield, Lock, Eye, FileText, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-teal-600 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Your Privacy, Our Responsibility</h1>
            <p className="text-xl text-gray-600">
              At Athenura, we respect your trust. This Privacy Policy explains how we collect, use, protect, and manage your personal information with transparency and integrity.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last Updated: 20 Jan 2026</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-8 w-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">Privacy Commitment</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Athenura values the privacy of individuals and is committed to protecting personal information shared with us. This Privacy Policy explains how information is collected, used, stored, disclosed, and protected across our website, programs, services, and communications.
            </p>
          </div>

          <div className="space-y-6">
            {/* Section 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Scope of This Privacy Policy</h3>
                  <p className="text-gray-600 leading-relaxed">
                    This Privacy Policy applies to all individuals who access the Athenura website or interact with Athenura in any manner, including visitors, clients, prospective clients, partners, vendors, applicants, interns, employees, and consultants. It applies to information collected through online platforms, direct communications, applications, and business operations.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-600 font-bold">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Personal Information We Collect</h3>
                  <div className="space-y-4">
                    <div className="pl-4 border-l-2 border-teal-200">
                      <p className="text-gray-600 leading-relaxed mb-2">
                        <span className="font-semibold text-gray-900">1.</span> Athenura collects personal information only when it is voluntarily and knowingly provided by an individual through inquiries, applications, communications, or participation in programs or services.
                      </p>
                    </div>
                    <div className="pl-4 border-l-2 border-teal-200">
                      <p className="text-gray-600 leading-relaxed mb-2">
                        <span className="font-semibold text-gray-900">2.</span> Collected personal information may include full legal name, email address, phone number, nationality or geographic location, and educational or organizational affiliation for identification, communication, eligibility verification, and service delivery.
                      </p>
                    </div>
                    <div className="pl-4 border-l-2 border-teal-200">
                      <p className="text-gray-600 leading-relaxed mb-2">
                        <span className="font-semibold text-gray-900">3.</span> Professional and academic details such as resumes, CVs, portfolios, employment history, and educational background may be collected for evaluation, recruitment, placement, or program participation.
                      </p>
                    </div>
                    <div className="pl-4 border-l-2 border-teal-200">
                      <p className="text-gray-600 leading-relaxed">
                        <span className="font-semibold text-gray-900">4.</span> Additional sensitive information such as medical conditions, dietary needs, religious considerations, or accessibility requirements may be requested strictly to provide appropriate accommodations and is handled with heightened confidentiality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Technical Information We Collect</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Athenura does not collect, store, or process technical information such as IP addresses, browser details, device information, operating systems, access timestamps, pages visited, or referral sources. The website operates without tracking, monitoring, logging, analytics, or behavioral profiling of users.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Cookies or Tracking Technologies</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Athenura does not use cookies, tracking pixels, behavioral tracking tools, or similar technologies. Visitors may browse the website freely without cookies being placed on their devices, and no cookie-based data collection or preference management is required.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-600 font-bold">5</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Purpose of Information Collection</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Personal information is collected and processed solely for legitimate business and operational purposes, including responding to inquiries, evaluating eligibility for internships, employment, programs, or services, managing applications, delivering services, ensuring effective communication, maintaining security, and complying with legal and regulatory obligations.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-600 font-bold">6</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Information Sharing and Disclosure</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-900">1.</span> Personal information is used primarily to fulfill requests, manage applications, and deliver services. Aggregated and non-identifiable data may be used internally for improvement purposes.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-900">2.</span> Information may be shared with partner organizations, host companies, or service providers only when necessary to confirm placements or fulfill contractual obligations.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-900">3.</span> Athenura may contact educational institutions when required for academic coordination, reporting, compliance, or application of institutional benefits.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-900">4.</span> Personal information is not shared with third parties unless required by law, legal process, or explicit user consent.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-900">5.</span> Non-personally identifiable and aggregated data may be shared for research, analytics, or marketing insights without identifying individuals.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sections 7-12 continue similarly... */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-600 font-bold">7</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Data Protection and Security Measures</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Athenura implements reasonable administrative, technical, and organizational safeguards to protect personal information from unauthorized access, misuse, loss, disclosure, or alteration. Sensitive information is encrypted at rest and in transit where applicable, and system access is restricted using strong authentication controls. While reasonable security measures are maintained, absolute security cannot be guaranteed.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-600 font-bold">9</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Rights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-600">
                      <Eye className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Right to be informed about how personal information is collected and used</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <FileText className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Right to access personal data and request a copy in a reasonable format</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <FileText className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Right to request correction of inaccurate or incomplete information</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <FileText className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Right to request deletion or restriction of data processing, subject to legal requirements</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <FileText className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>Right to opt out of marketing or informational communications at any time</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 bg-gradient-to-r from-teal-500 to-cyan-500 p-8 rounded-2xl text-white text-center"
          >
            <Mail className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Contact Information</h3>
            <p className="text-lg mb-4">
              For any questions, concerns, or requests regarding this Privacy Policy or data practices, please contact us at:
            </p>
            <a href="mailto:official@athenura.in" className="text-xl font-semibold hover:underline">
              official@athenura.in
            </a>
            <div className="mt-6 flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              <p className="text-sm">This Privacy Policy is effective immediately</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
