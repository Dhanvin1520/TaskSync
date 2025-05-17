import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">

        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Manage Your Tasks with Ease
                </h1>
                <p className="text-xl mb-8 opacity-90">
                  Stay organized, focused, and in control with our powerful yet simple task management solution.
                </p>
                <div className="flex space-x-4">
                  <Link to="/register">
                    <Button
                      variant="primary"
                      size="lg"
                      className="border border-white text-blue-600 hover:bg-white hover:text-blue-600 transition duration-200 rounded-md"
                      rightIcon={<ArrowRight size={20} />}
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="primary" size="lg"  className="border border-white text-blue-600 hover:bg-white hover:text-blue-600">
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <div className="bg-white bg-opacity-10 rounded-xl p-6 border border-white border-opacity-20 shadow-lg">
                  <CheckSquare size={180} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to stay organized and productive
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="text-blue-600 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

   
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of users who are already managing their tasks efficiently.
            </p>
            <Link to="/register">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={20} />}
              >
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};


const features = [
  {
    icon: <CheckSquare size={40} />,
    title: 'Task Management',
    description: 'Create, organize, and track your tasks with a clean and intuitive interface.',
  },
  {
    icon: <Check size={40} />,
    title: 'Categories & Priorities',
    description: 'Categorize tasks and set priorities to focus on what matters most.',
  },
  {
    icon: <Check size={40} />,
    title: 'Due Dates & Reminders',
    description: 'Set due dates and never miss an important deadline again.',
  },
];

export default HomePage;