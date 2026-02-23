import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Users, Target, Award, TrendingUp } from "lucide-react";

const About = () => {
  const values = [
    { icon: TrendingUp, title: "Innovation", description: "Pushing boundaries with cutting-edge technology" },
    { icon: Award, title: "Excellence", description: "Delivering exceptional quality in everything we do" },
    { icon: Users, title: "Collaboration", description: "Working together to achieve remarkable results" },
    { icon: Target, title: "Integrity", description: "Building trust through transparency and honesty" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-8">Who We Are</h1>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <p className="text-lg text-gray-600 mb-6">
              We are a passionate team of innovators, developers, and strategists dedicated to building digital solutions that transform businesses and create lasting impact.
            </p>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-8">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded with a vision to shape the future of digital innovation, Athenura officially established its foundation in 2026 as a focused team driven by creativity, technology, and purpose. Today, we are a growing organization delivering impactful digital solutions to businesses across diverse industries and regions.
            </p>
            <p className="text-gray-600 mb-6">
              Our journey is guided by a clear philosophy: build solutions that create real value. Every strategy we design, every product we develop, and every experience we craft is centered on solving real-world problems and helping our clients grow with confidence in a digital-first world.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-teal-50 rounded-xl"
                >
                  <value.icon className="h-8 w-8 text-teal-600 mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white">
              <h3 className="text-2xl font-bold mb-3">The Mission</h3>
              <p className="text-lg">
                "Athenura bridges the gap between academic theory and industry reality, empowering and building the architects of tomorrow."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
