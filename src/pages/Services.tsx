import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Code, Globe, Brain, Cloud, Palette, Users } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Custom Software Development",
      description: "Tailor-made solutions designed to address your unique business challenges and drive digital transformation.",
      features: ["Enterprise Applications", "Mobile Solutions", "System Integration", "API Development"],
      projects: "150+ Projects"
    },
    {
      icon: Globe,
      title: "Website Development",
      description: "Modern, responsive websites that deliver exceptional user experiences and drive business growth.",
      features: ["Responsive Design", "E-commerce Solutions", "CMS Integration", "SEO Optimization"],
      projects: "300+ Websites"
    },
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "Intelligent solutions powered by artificial intelligence to automate processes and gain data-driven insights.",
      features: ["Predictive Analytics", "Computer Vision", "NLP Solutions", "AI Integration"],
      projects: "50+ AI Models"
    },
    {
      icon: Cloud,
      title: "Cloud Solutions & DevOps",
      description: "Seamless cloud migration, management, and DevOps implementation for optimal performance and scalability.",
      features: ["Cloud Architecture", "Container Orchestration", "CI/CD Pipelines", "Infrastructure as Code"],
      projects: "100+ Deployments"
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "User-centered design that combines aesthetics with functionality for exceptional digital experiences.",
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
      projects: "500+ Designs"
    },
    {
      icon: Users,
      title: "IT Consulting",
      description: "Strategic guidance to align your technology investments with business objectives for maximum ROI.",
      features: ["Digital Strategy", "Technology Audit", "Vendor Selection", "Implementation"],
      projects: "200+ Clients"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">Digital Solutions That Drive Innovation</h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            We deliver enterprise-grade technology services that transform businesses and accelerate growth in the digital age.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <service.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-teal-600 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-sm font-semibold text-teal-600">{service.projects}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Services;
