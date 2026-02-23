import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Code, Palette, Users, TrendingUp, Award, Clock, FileText, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const InternshipPrograms = () => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const techStacks = [
    "Frontend Dev", "Backend Dev", "UI/UX Design", "Mobile Dev", 
    "Data Science", "AI & ML", "DevOps", "Cyber Security",
    "Cloud Computing", "Blockchain", "Game Dev", "QA & Testing",
    "Product Mgmt", "Digital Marketing", "General Tech"
  ];

  const domains = [
    {
      id: "hr",
      title: "Human Resources (HR)",
      duration: "3 / 6 Months",
      description: "Gain hands-on exposure to real-world HR practices including recruitment, onboarding, and employee engagement.",
      skills: ["Communication", "Organization", "Confidentiality", "+1"],
      icon: Users
    },
    {
      id: "graphic",
      title: "Graphic Design",
      duration: "3 / 6 Months",
      description: "Shape the visual identity of the brand by creating compelling designs for social media and marketing campaigns.",
      skills: ["Creativity", "Visual Design", "Layout", "+1"],
      icon: Palette
    },
    {
      id: "uiux",
      title: "UI / UX Design",
      duration: "3 / 6 Months",
      description: "Design intuitive and user-centered digital experiences through wireframing, prototyping, and user research.",
      skills: ["Figma", "Prototyping", "User Research", "+1"],
      icon: Palette
    },
    {
      id: "frontend",
      title: "Frontend Development",
      duration: "3 / 6 Months",
      description: "Build visually engaging and high-performance user interfaces using modern web technologies like React.",
      skills: ["React.js", "Tailwind CSS", "JavaScript", "+1"],
      icon: Code
    },
    {
      id: "backend",
      title: "Backend Development",
      duration: "3 / 6 Months",
      description: "Power digital applications by building robust server-side logic, APIs, and managing secure databases.",
      skills: ["Node.js", "Express.js", "MongoDB/SQL", "+1"],
      icon: Code
    },
    {
      id: "fullstack",
      title: "Full Stack Development",
      duration: "3 / 6 Months",
      description: "Master the entire web development lifecycle by working on both client-side interfaces and server-side logic.",
      skills: ["Frontend", "Backend", "Database Mgmt", "+1"],
      icon: Code
    },
    {
      id: "mern",
      title: "MERN Stack Development",
      duration: "3 / 6 Months",
      description: "Specialize in full-stack JavaScript development using MongoDB, Express, React, and Node.js.",
      skills: ["MongoDB", "Express", "React", "+1"],
      icon: Code
    },
    {
      id: "marketing",
      title: "Digital Marketing",
      duration: "3 / 6 Months",
      description: "Drive brand growth through data-driven campaigns, SEO strategies, and performance analytics.",
      skills: ["SEO", "Analytics", "Campaign Mgmt", "+1"],
      icon: TrendingUp
    },
    {
      id: "social",
      title: "Social Media Mgmt",
      duration: "3 / 6 Months",
      description: "Build online communities and manage brand presence through engaging content and strategic planning.",
      skills: ["Content Planning", "Community Mgmt", "Copywriting", "+1"],
      icon: TrendingUp
    },
    {
      id: "content",
      title: "Content Writing",
      duration: "3 / 6 Months",
      description: "Craft value-driven content including blogs, articles, and marketing copy that aligns with brand voice.",
      skills: ["Storytelling", "SEO Writing", "Research", "+1"],
      icon: FileText
    },
    {
      id: "data",
      title: "Data Science & Analytics",
      duration: "3 / 6 Months",
      description: "Transform raw data into actionable insights to support strategic business decision-making.",
      skills: ["Data Cleaning", "Visualization", "Analysis", "+1"],
      icon: BarChart
    },
    {
      id: "video",
      title: "Video Editing",
      duration: "3 Months",
      description: "Produce high-quality video content for marketing and storytelling that captures audience attention.",
      skills: ["Editing Tools", "Storytelling", "Color Grading", "+1"],
      icon: Palette
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Prove Your Skills.<br />Get The Athenura Internship.
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Select your specific tech stack from the list. Pass the 5-question challenge to instantly unlock your application form.
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge className="bg-teal-100 text-teal-700 text-lg px-4 py-2">
              500+ Applicants today
            </Badge>
          </div>
          <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-6 text-lg hover:scale-105 transition-transform">
            Start Your Journey
          </Button>
        </motion.div>

        {/* Quiz Game Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Quiz Game</h2>
            <p className="text-gray-600 mb-6 text-center">Search domain...</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {techStacks.map((stack, index) => (
                <motion.button
                  key={stack}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-3 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg font-medium transition-colors"
                >
                  {stack}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              An Internship That<br />Builds Careers.
            </h2>
            <p className="text-xl text-gray-600">
              Master the software development lifecycle, from architecture to deployment, over a comprehensive 3-8 month journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Live Production</h3>
              <p className="text-gray-600 mb-3">Industrial-Grade Project Work</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CI/CD Pipeline Implementation</li>
                <li>• Microservices Architecture</li>
                <li>• Agile & Jira Workflows</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Duration</h3>
              <p className="text-gray-600 mb-3">3 - 8 Months</p>
              <p className="text-sm text-gray-600">
                Deep-dive mastery. Remote/Hybrid flexible options.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Performance LOR</h3>
              <p className="text-gray-600 mb-3">Signed by CEO</p>
              <p className="text-sm text-gray-600">
                A detailed letter validating your specific contributions, not a generic template.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Career Acceleration</h3>
              <p className="text-gray-600 mb-3">Job Market Ready</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ATS Resume Building</li>
                <li>• Mock Tech Interviews</li>
                <li>• GitHub Portfolio Polish</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-6 rounded-xl text-white text-center">
              <h4 className="font-bold mb-1">Modern Stack</h4>
              <p className="text-sm">Latest tech only</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-6 rounded-xl text-white text-center">
              <h4 className="font-bold mb-1">Peer Coding</h4>
              <p className="text-sm">Collab with talent</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-6 rounded-xl text-white text-center">
              <h4 className="font-bold mb-1">Soft Skills</h4>
              <p className="text-sm">Leadership training</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-xl text-white text-center">
              <h4 className="font-bold mb-1">Alumni Club</h4>
              <p className="text-sm">Lifetime access</p>
            </div>
          </div>
        </motion.div>

        {/* Internship Domains */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Internship Domains</h2>
            <p className="text-xl text-gray-600">
              Structured internships designed to bridge the gap between academic learning and industry requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain, index) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedDomain(domain.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <domain.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <Badge className="bg-teal-50 text-teal-700">{domain.duration}</Badge>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{domain.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{domain.description}</p>
                <div className="flex flex-wrap gap-2">
                  {domain.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <button className="mt-4 text-teal-600 hover:text-teal-700 font-semibold text-sm">
                  Tap to view details →
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Student Portal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Student Portal</h2>
              <Badge className="bg-green-100 text-green-700">System Status: Operational</Badge>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Internship Toolkit</h3>
            <p className="text-gray-600 mb-8">
              A centralized hub for applicants and active interns. Access your dashboard, track progress, and manage administrative tasks efficiently.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-teal-50 rounded-xl">
                <Badge className="bg-red-100 text-red-700 mb-3">Mandatory</Badge>
                <h4 className="text-lg font-bold text-gray-900 mb-2">1-Month Feedback Form</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Help us improve your internship experience by sharing your feedback after one month.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Intern Performance Review</li>
                  <li>• Mentor & Task Feedback</li>
                  <li>• Suggestions & Concerns</li>
                </ul>
                <Button variant="outline" className="w-full">Submit Feedback</Button>
              </div>

              <div className="p-6 bg-blue-50 rounded-xl">
                <Badge className="bg-blue-100 text-blue-700 mb-3">Live Updates</Badge>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Performance Tracker</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Real-time analytics of your growth, tasks, and code quality.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Code Review Scores</li>
                  <li>• Task Velocity Charts</li>
                  <li>• Mentor Feedback History</li>
                </ul>
                <Button variant="outline" className="w-full">Check Yours</Button>
              </div>

              <div className="p-6 bg-purple-50 rounded-xl">
                <Badge className="bg-purple-100 text-purple-700 mb-3">Confidential</Badge>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Certificate Feedback Form</h4>
                <p className="text-sm text-gray-600 mb-4">
                  A safe space to share your thoughts, report issues, or suggest ideas.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Weekly Check-ins</li>
                  <li>• Anonymous Reporting</li>
                  <li>• Incident Logging</li>
                </ul>
                <Button variant="outline" className="w-full">Open Form</Button>
              </div>

              <div className="p-6 bg-green-50 rounded-xl">
                <Badge className="bg-green-100 text-green-700 mb-3">Self-Service</Badge>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Leave Application Form</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Administrative tools to manage your schedule and official documents.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>• Leave Application</li>
                  <li>• Holiday Calendar</li>
                  <li>• Download Offer/LOR</li>
                </ul>
                <Button variant="outline" className="w-full">Access Portal</Button>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
              <h4 className="text-lg font-bold text-gray-900 mb-2">Do You Need Technical Support?</h4>
              <p className="text-gray-600 mb-4">
                Having trouble accessing the tracker or submitting forms?
              </p>
              <Button className="bg-teal-600 hover:bg-teal-700">Contact Support</Button>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default InternshipPrograms;
