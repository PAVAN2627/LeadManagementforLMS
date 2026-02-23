import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, Shield, AlertCircle, Mail } from "lucide-react";

const TermsOfService = () => {
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
            <FileText className="h-16 w-16 text-teal-600 mx-auto mb-4" />
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms & Conditions, Clear & Transparent</h1>
            <p className="text-xl text-gray-600">
              These Terms & Conditions define the rules, responsibilities, and legal framework governing your access to and use of Athenura's website, programs, and services.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last Updated: 20 Jan 2026</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">Terms Overview</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              These Terms & Conditions govern your access to and use of Athenura's website, programs, and services. Please read them carefully.
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Acceptance of Terms</h3>
                  <p className="text-gray-600 leading-relaxed">
                    By accessing, browsing, registering, or using Athenura's website, services, programs, platforms, or communications, you acknowledge that you have read, understood, and agree to be legally bound by these Terms & Conditions. If you do not agree to any part of these Terms, you must immediately discontinue use of Athenura's services.
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
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Eligibility</h3>
                  <p className="text-gray-600 leading-relaxed">
                    You must be legally capable of entering into a binding agreement to use Athenura's services. Internship opportunities are open to students, graduates, or individuals who meet the eligibility criteria defined by Athenura. Submission of an application does not guarantee selection or participation.
                  </p>
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
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Use of Website and Services</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-teal-600 font-bold mt-1">1.</span>
                      <span>Use the website, platforms, and services only for lawful and legitimate purposes</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-teal-600 font-bold mt-1">2.</span>
                      <span>Do not interfere with, disrupt, damage, or attempt unauthorized access to systems, servers, or data</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-teal-600 font-bold mt-1">3.</span>
                      <span>Do not submit false, misleading, inaccurate, or fraudulent information</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-teal-600 font-bold mt-1">4.</span>
                      <span>Do not misuse content, communication channels, or company resources</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Section 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-600 font-bold">5</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Internship Programs and Services</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Athenura offers internship programs for educational and skill-development purposes only. Participation is subject to selection criteria, availability, and compliance with company policies. Internship programs do not constitute employment and do not guarantee future job placement or compensation unless explicitly stated in writing.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 8 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-600 font-bold">8</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Intellectual Property Rights</h3>
                  <p className="text-gray-600 leading-relaxed">
                    All content, software, documentation, designs, source code, training materials, and work products created or accessed during internships or services remain the exclusive intellectual property of Athenura. Users and interns may not copy, distribute, publish, or reuse such materials without prior written authorization.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 10 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-600 font-bold">10</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Internship Certificate</h3>
                  <p className="text-gray-600 leading-relaxed">
                    An Internship Completion Certificate is issued only upon successful completion of the internship duration, satisfactory performance, compliance with all policies, and submission of required work or evaluations. Athenura reserves the right to withhold or revoke certificates in cases of misconduct, incomplete participation, or policy violations.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 11 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-200 bg-yellow-50"
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Guarantee of Outcomes</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Athenura does not guarantee employment, job placement, stipend, salary, or financial benefits as a result of participation in any internship or service unless explicitly confirmed in writing.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 16 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-teal-600 font-bold">16</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Governing Law and Jurisdiction</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes shall fall under the exclusive jurisdiction of the courts of India.
                  </p>
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
              For any questions, clarifications, or concerns regarding these Terms & Conditions, please contact us at:
            </p>
            <a href="mailto:info.athenura@gmail.com" className="text-xl font-semibold hover:underline">
              info.athenura@gmail.com
            </a>
            <div className="mt-6 flex items-center justify-center gap-2">
              <FileText className="h-5 w-5" />
              <p className="text-sm">These Terms & Conditions are effective immediately</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
