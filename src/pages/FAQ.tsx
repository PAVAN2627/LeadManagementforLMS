import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>(["program"]);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const faqSections = [
    {
      id: "program",
      title: "Internship Program Overview",
      count: 5,
      questions: [
        {
          id: "paid",
          question: "Is the internship paid?",
          answer: "Internships at Athenura are unpaid and do not include any salary, wages, or monetary stipend. However, we provide significant non-monetary benefits including structured training, mentorship, and real-world project exposure."
        },
        {
          id: "job-guarantee",
          question: "Does the internship guarantee a job offer?",
          answer: "Successful completion of the internship does not guarantee permanent employment or a job placement. Any future employment offers are separate and are explicitly communicated in writing by the company."
        },
        {
          id: "certificate",
          question: "Will I receive a certificate?",
          answer: "Yes. An Internship Completion Certificate is issued upon successful completion of the full duration, satisfactory performance, and compliance with all company policies. Failure to meet these conditions may result in the certificate not being issued."
        },
        {
          id: "remote",
          question: "Can the internship be done remotely?",
          answer: "Yes, internships may be offered in remote format depending on the project requirements and company policy."
        },
        {
          id: "duration",
          question: "What is the duration of the internship?",
          answer: "The internship duration is defined in your official offer letter and depends on the specific role. Extensions or early terminations are at the sole discretion of Athenura."
        }
      ]
    },
    {
      id: "eligibility",
      title: "Eligibility & Selection",
      count: 2,
      questions: [
        {
          id: "eligible",
          question: "Who is eligible to apply?",
          answer: "Internship opportunities are open to students enrolled in a recognized educational institution and fresh graduates seeking practical industry experience."
        },
        {
          id: "selection",
          question: "How are interns selected?",
          answer: "Selection is based on academic or professional qualifications, relevant skills, demonstrated interest, and project requirements. Athenura reserves the right to accept or reject applications at its discretion."
        }
      ]
    },
    {
      id: "roles",
      title: "Roles & Responsibilities",
      count: 3,
      questions: [
        {
          id: "mentor",
          question: "Will I have a mentor?",
          answer: "Yes. Each intern may be assigned a mentor or supervisor who provides guidance, oversight, and regular feedback throughout the internship period."
        },
        {
          id: "responsibilities",
          question: "What are my responsibilities?",
          answer: "Interns are expected to complete assigned tasks responsibly, meet deadlines, maintain professionalism, and comply with all company policies and instructions."
        },
        {
          id: "early-leave",
          question: "What happens if I need to leave early?",
          answer: "Interns may request early termination by providing reasonable written notice. Approval is subject to management discretion and completion of exit formalities."
        }
      ]
    },
    {
      id: "privacy",
      title: "Data Privacy & Security",
      count: 4,
      questions: [
        {
          id: "cookies",
          question: "Does your website use cookies?",
          answer: "No. Athenura does not use cookies, tracking pixels, or behavioral tracking tools. You can browse our website without cookies being placed on your device."
        },
        {
          id: "personal-info",
          question: "What personal information do you collect?",
          answer: "We collect only the information you voluntarily provide, such as your name, email address, and resume, for application evaluation or responding to inquiries."
        },
        {
          id: "third-party",
          question: "Is my data shared with third parties?",
          answer: "We do not share personal information with third parties unless required by law or necessary for internship-related verification with your consent."
        },
        {
          id: "data-security",
          question: "How secure is my data?",
          answer: "We use encrypted systems and strict access controls to protect your data. However, no electronic transmission or storage system can be guaranteed to be 100% secure."
        }
      ]
    }
  ];

  const filteredSections = faqSections.map(section => ({
    ...section,
    questions: section.questions.filter(q =>
      searchQuery === "" ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

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
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Answers to Your Questions</h1>
            <p className="text-xl text-gray-600 mb-8">
              Everything you need to know about our internship program, policies, and privacy standards.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for questions or keywords..."
                className="pl-12 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-6">
            {filteredSections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{section.count} questions in this section</p>
                  </div>
                  {expandedSections.includes(section.id) ? (
                    <ChevronUp className="h-6 w-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-400" />
                  )}
                </button>

                {/* Questions */}
                {expandedSections.includes(section.id) && (
                  <div className="border-t border-gray-200">
                    {section.questions.map((question, questionIndex) => (
                      <div key={question.id} className="border-b border-gray-100 last:border-b-0">
                        <button
                          onClick={() => toggleQuestion(question.id)}
                          className="w-full px-8 py-5 flex items-start justify-between hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex-1 pr-4">
                            <h3 className="text-lg font-semibold text-gray-900">{question.question}</h3>
                            {expandedQuestions.includes(question.id) && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-gray-600 mt-3 leading-relaxed"
                              >
                                {question.answer}
                              </motion.p>
                            )}
                          </div>
                          {expandedQuestions.includes(question.id) ? (
                            <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Need More Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-teal-500 to-cyan-500 p-8 rounded-2xl text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
            <p className="text-lg mb-6">
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="mailto:info.athenura@gmail.com"
                className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors border-2 border-white"
              >
                Email Us
              </a>
            </div>
          </motion.div>

          {/* No Results */}
          {searchQuery && filteredSections.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-xl text-gray-600 mb-4">No results found for "{searchQuery}"</p>
              <p className="text-gray-500">Try searching with different keywords or browse all questions above.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FAQ;
