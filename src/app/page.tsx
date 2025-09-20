'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Zap, 
  DollarSign, 
  BarChart3, 
  Upload, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
} from 'lucide-react'
import Link from 'next/link'

const socialIcons = [
  { icon: Instagram, name: 'Instagram', color: 'text-pink-500' },
  { icon: Youtube, name: 'YouTube', color: 'text-red-500' },
  { icon: Linkedin, name: 'LinkedIn', color: 'text-blue-500' },
  { icon: Twitter, name: 'Twitter/X', color: 'text-blue-400' },
]

const features = [
  {
    icon: Shield,
    title: 'Unmatched Security',
    description: 'Your tokens, your control. Each user\'s content is posted with their own credentials—no shared workflows, no security compromises.',
    color: 'text-green-500'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Content',
    description: 'Smart caption writing and hashtag suggestions powered by advanced AI. Create engaging content effortlessly.',
    color: 'text-purple-500'
  },
  {
    icon: Upload,
    title: 'Drag & Drop Simplicity',
    description: 'Upload images, videos, and documents with intuitive file management. One-click publishing to all platforms.',
    color: 'text-blue-500'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Monitor engagement, reach, and growth across all platforms with intelligent insights and custom reporting.',
    color: 'text-orange-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with modern tech stack for optimal performance. Next.js frontend with Django backend.',
    color: 'text-yellow-500'
  },
  {
    icon: DollarSign,
    title: 'Incredibly Affordable',
    description: 'Premium features at startup-friendly prices. 3x the value at 1/3 the cost of competitors.',
    color: 'text-green-600'
  },
]

const pricingTiers = [
  {
    name: 'Starter',
    price: '$9',
    description: 'Perfect for individuals and small creators',
    features: [
      '3 social platforms',
      'Basic analytics',
      'AI caption generation',
      '1GB storage',
      'Email support'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: '$19',
    description: 'Ideal for growing businesses and content creators',
    features: [
      'All platforms (5)',
      'Advanced analytics',
      'AI features & hashtags',
      '10GB storage',
      'Priority support',
      'Custom branding'
    ],
    popular: true
  },
  {
    name: 'Agency',
    price: '$49',
    description: 'For agencies managing multiple clients',
    features: [
      'Unlimited accounts',
      'White-label options',
      'Team collaboration',
      '100GB storage',
      'Dedicated support',
      'Custom integrations'
    ],
    popular: false
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/10 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SyncContents</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-white/80 hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</Link>
              <Link href="#about" className="text-white/80 hover:text-white transition-colors">About</Link>
              <Link href="/auth/login" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            The Future of
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Social Media</span>
            <br />Management
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto"
          >
            Simple, secure, and incredibly affordable. Connect all your social accounts with one-click OAuth, 
            create AI-powered content, and manage everything from one beautiful dashboard.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link href="/auth/signup" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#demo" className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
              Watch Demo
            </Link>
          </motion.div>

          {/* Social Platform Icons */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center items-center gap-8"
          >
            {socialIcons.map((social, index) => (
              <div key={social.name} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-2">
                  <social.icon className={`w-6 h-6 ${social.color}`} />
                </div>
                <span className="text-sm text-white/60">{social.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose SyncContents?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              We&apos;re not just another social media tool—we&apos;re revolutionizing how businesses manage their online presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Premium features at breakthrough prices. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all ${
                  tier.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold text-white mb-2">
                    {tier.price}
                    <span className="text-lg text-white/60">/month</span>
                  </div>
                  <p className="text-white/70">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-white/80">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/auth/signup"
                  className={`w-full py-3 rounded-lg font-semibold transition-all text-center block ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                      : 'border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Social Media?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of businesses already using SyncContents to streamline their social media management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105">
                Start Your Free Trial
              </Link>
              <Link href="#contact" className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SyncContents</span>
              </div>
              <p className="text-white/60">
                The next-generation social media management platform. Simple, secure, and affordable.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="#api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link href="#about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link href="#help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#status" className="hover:text-white transition-colors">Status</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
            <p>&copy; 2025 SyncContents. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
