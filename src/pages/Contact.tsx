import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, Clock, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/919835051934", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Get in Touch with Athenura</h1>
            <p className="text-xl text-gray-600">
              Have questions about our internships or programs? Our experts are always ready to guide you toward your career goals.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="text-4xl font-bold text-teal-600 mb-2">24/7</div>
              <div className="text-gray-600">Query Support</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <div className="text-4xl font-bold text-teal-600 mb-2">&lt; 1 Hr</div>
              <div className="text-gray-600">Avg. Response Time</div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <Input
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us about your inquiry..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                  Send Message
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send via WhatsApp
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. Your number is only used for this inquiry.
                </p>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Info</h2>
                <p className="text-gray-600 mb-6">
                  We'd love to hear from you. Whether you have a question about our program, pricing, or just want to say hello, our team is ready to answer all your questions.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                      <p className="text-sm text-gray-600 mb-2">For general inquiries and partnerships</p>
                      <a href="mailto:info.athenura@gmail.com" className="text-teal-600 hover:underline">
                        info.athenura@gmail.com
                      </a>
                      <br />
                      <a href="mailto:hr.athenura@gmail.com" className="text-teal-600 hover:underline">
                        hr.athenura@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Call us</h3>
                      <a href="tel:+919835051934" className="text-teal-600 hover:underline text-lg">
                        +91 98350 51934
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Working Hours</h3>
                      <p className="text-gray-600">Our support team is available:</p>
                      <p className="text-gray-900 font-medium">Mon - Sat: 10:00 AM - 5:30 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Remote HQ</h3>
                      <p className="text-gray-600">Registered Office:</p>
                      <p className="text-gray-900">Uttar Pradesh, India</p>
                      <p className="text-sm text-gray-500">(Serving Pan-India)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Reach Out */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-8 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-4">Why Reach Out?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="text-2xl">✔</span>
                    <span>Internship guidance & eligibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-2xl">✔</span>
                    <span>Application & onboarding help</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-2xl">✔</span>
                    <span>Career roadmap support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-2xl">✔</span>
                    <span>Fast & reliable communication</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Internship FAQs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How long does Athenura take to respond?</h3>
                <p className="text-gray-600">Our team usually responds within 24–48 business hours. Internship-related queries are prioritized.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is the Athenura internship remote?</h3>
                <p className="text-gray-600">Yes, Athenura internships are completely remote, allowing students to learn and work from anywhere.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Who can apply for the internship?</h3>
                <p className="text-gray-600">Students, freshers, and career beginners from any background with a passion to learn are welcome.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Will I receive a certificate?</h3>
                <p className="text-gray-600">Yes, all interns who successfully complete the program receive a verified internship certificate.</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <a href="/faq" className="text-teal-600 hover:text-teal-700 font-semibold">
                View all FAQs →
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
