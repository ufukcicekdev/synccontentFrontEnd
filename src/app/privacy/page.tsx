'use client'

import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Globe, Mail } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Privacy Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-gray-600 mt-4">
              At SocialSync Pro, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our social media management platform.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <a href="#information-collection" className="text-purple-600 hover:text-purple-700 transition-colors">1. Information We Collect</a>
            <a href="#information-use" className="text-purple-600 hover:text-purple-700 transition-colors">2. How We Use Your Information</a>
            <a href="#information-sharing" className="text-purple-600 hover:text-purple-700 transition-colors">3. Information Sharing</a>
            <a href="#data-security" className="text-purple-600 hover:text-purple-700 transition-colors">4. Data Security</a>
            <a href="#social-media" className="text-purple-600 hover:text-purple-700 transition-colors">5. Social Media Integration</a>
            <a href="#data-retention" className="text-purple-600 hover:text-purple-700 transition-colors">6. Data Retention</a>
            <a href="#user-rights" className="text-purple-600 hover:text-purple-700 transition-colors">7. Your Rights</a>
            <a href="#contact" className="text-purple-600 hover:text-purple-700 transition-colors">8. Contact Us</a>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Information Collection */}
          <section id="information-collection" className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Name and email address when you create an account</li>
                  <li>• Profile information you choose to provide</li>
                  <li>• Payment information for subscription services</li>
                  <li>• Communication preferences and settings</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media Account Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Access tokens for connected social media platforms</li>
                  <li>• Profile information from connected accounts (username, profile picture)</li>
                  <li>• Post content and media you create through our platform</li>
                  <li>• Analytics and performance data for your social media posts</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Usage Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Log data including IP addresses, device information, and browser type</li>
                  <li>• Usage patterns and feature interactions within our platform</li>
                  <li>• API usage statistics for connected integrations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Use */}
          <section id="information-use" className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            </div>
            
            <ul className="space-y-3 text-gray-600">
              <li>• <strong>Service Provision:</strong> To provide, maintain, and improve our social media management services</li>
              <li>• <strong>Account Management:</strong> To create and manage your account, process payments, and provide customer support</li>
              <li>• <strong>Social Media Integration:</strong> To connect and manage your social media accounts as requested</li>
              <li>• <strong>Content Publishing:</strong> To schedule and publish content to your connected social media platforms</li>
              <li>• <strong>Analytics:</strong> To provide performance analytics and insights for your social media activity</li>
              <li>• <strong>Communication:</strong> To send service-related notifications, updates, and support communications</li>
              <li>• <strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
              <li>• <strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section id="information-sharing" className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">3. Information Sharing</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:</p>
              
              <ul className="space-y-3">
                <li>• <strong>Social Media Platforms:</strong> We share content with connected social media platforms as directed by you</li>
                <li>• <strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist in operating our platform</li>
                <li>• <strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights and safety</li>
                <li>• <strong>Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
                <li>• <strong>With Your Consent:</strong> We may share information for other purposes with your explicit consent</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section id="data-security" className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">4. Data Security</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>We implement appropriate technical and organizational security measures to protect your information:</p>
              
              <ul className="space-y-3">
                <li>• <strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard encryption</li>
                <li>• <strong>Access Controls:</strong> Strict access controls limit who can access your personal information</li>
                <li>• <strong>Regular Audits:</strong> We regularly review and update our security practices</li>
                <li>• <strong>Secure Infrastructure:</strong> Our platform is hosted on secure, regularly updated servers</li>
                <li>• <strong>Token Security:</strong> Social media access tokens are securely stored and regularly refreshed</li>
              </ul>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <p className="text-yellow-800">
                  <strong>Note:</strong> While we strive to protect your information, no method of transmission over the Internet 
                  or electronic storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </div>
            </div>
          </section>

          {/* Social Media Integration */}
          <section id="social-media" className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">5. Social Media Integration</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>Our platform integrates with various social media platforms. Important points to understand:</p>
              
              <ul className="space-y-3">
                <li>• <strong>OAuth Authorization:</strong> We use OAuth 2.0 to securely connect to your social media accounts</li>
                <li>• <strong>Limited Permissions:</strong> We only request the minimum permissions necessary for our services</li>
                <li>• <strong>Platform Policies:</strong> Your use of connected platforms is subject to their respective privacy policies</li>
                <li>• <strong>Data Access:</strong> We access only the data necessary to provide our services (posting, analytics)</li>
                <li>• <strong>Revocation:</strong> You can revoke our access to your social media accounts at any time</li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-800">
                  <strong>Supported Platforms:</strong> Instagram, YouTube, LinkedIn, Twitter/X, TikTok. 
                  Each platform has its own privacy policy that governs how they handle your data.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section id="data-retention" className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">6. Data Retention</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <ul className="space-y-3">
                <li>• <strong>Account Data:</strong> We retain your account information while your account is active</li>
                <li>• <strong>Content Data:</strong> Post content and analytics data are retained for service provision and improvement</li>
                <li>• <strong>Legal Requirements:</strong> Some data may be retained longer to comply with legal obligations</li>
                <li>• <strong>Account Deletion:</strong> When you delete your account, we will delete or anonymize your personal information within 30 days</li>
                <li>• <strong>Backup Data:</strong> Some information may persist in backups for up to 90 days after deletion</li>
              </ul>
            </div>
          </section>

          {/* User Rights */}
          <section id="user-rights" className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">7. Your Rights</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>You have the following rights regarding your personal information:</p>
              
              <ul className="space-y-3">
                <li>• <strong>Access:</strong> Request access to the personal information we hold about you</li>
                <li>• <strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li>• <strong>Deletion:</strong> Request deletion of your personal information</li>
                <li>• <strong>Portability:</strong> Request a copy of your data in a structured, machine-readable format</li>
                <li>• <strong>Restriction:</strong> Request restriction of processing under certain circumstances</li>
                <li>• <strong>Objection:</strong> Object to processing of your personal information</li>
                <li>• <strong>Withdraw Consent:</strong> Withdraw consent for processing where consent is the legal basis</li>
              </ul>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
                <p className="text-gray-700">
                  To exercise these rights, please contact us using the information provided in the &quot;Contact Us&quot; section below.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">8. Contact Us</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="space-y-2">
                  <p><strong>Email:</strong> privacy@socialsyncpro.com</p>
                  <p><strong>Website:</strong> <Link href="/contact" className="text-purple-600 hover:text-purple-700">Contact Form</Link></p>
                  <p><strong>Response Time:</strong> We aim to respond to privacy inquiries within 72 hours</p>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Privacy Policy Updates</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, 
                legal, or regulatory reasons.
              </p>
              <p>
                When we make changes, we will:
              </p>
              <ul className="space-y-2 ml-4">
                <li>• Update the &quot;Last updated&quot; date at the top of this policy</li>
                <li>• Notify you via email if the changes are significant</li>
                <li>• Post a notice on our platform highlighting the changes</li>
              </ul>
              <p>
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}