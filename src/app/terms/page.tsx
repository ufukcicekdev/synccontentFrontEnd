'use client'

import { ArrowLeft, Scale, Shield, User, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function TermsOfServicePage() {
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
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Terms of Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-gray-600 mt-4">
              Welcome to SocialSync Pro. These Terms of Service (&quot;Terms&quot;) govern your use of our 
              social media management platform and services provided by SocialSync Pro.
            </p>
          </div>
        </div>

        {/* Acceptance */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <p>
              By accessing and using SocialSync Pro, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </div>
        </div>

        {/* Service Description */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">2. Service Description</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <p>
              SocialSync Pro is a social media management platform that allows users to:
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Connect and manage multiple social media accounts</li>
              <li>• Schedule and publish content across platforms</li>
              <li>• Access analytics and performance insights</li>
              <li>• Use AI-powered content creation tools</li>
              <li>• Integrate with third-party services through our API</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time.
            </p>
          </div>
        </div>

        {/* User Accounts */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">3. User Accounts</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times.
            </p>
            <p>
              You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
            <ul className="space-y-2 ml-4">
              <li>• You must be at least 13 years old to use our Service</li>
              <li>• One person or legal entity may not maintain more than one free account</li>
              <li>• You must be human - accounts registered by bots are not permitted</li>
              <li>• You are responsible for maintaining the security of your account and password</li>
            </ul>
          </div>
        </div>

        {/* Acceptable Use */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">4. Acceptable Use Policy</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <p>You agree not to use the Service:</p>
            <ul className="space-y-2 ml-4">
              <li>• For any unlawful purpose or to solicit others to unlawful acts</li>
              <li>• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>• To transmit, or procure the sending of, any advertising or promotional material, including any &quot;junk mail&quot;, &quot;chain letter&quot;, &quot;spam&quot;, or any other similar solicitation</li>
              <li>• To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
              <li>• To engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of the website</li>
              <li>• To use the Service in any manner that could disable, overburden, damage, or impair the site</li>
            </ul>
          </div>
        </div>

        {/* Content and Copyright */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">5. Content and Copyright</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain information, 
              text, graphics, videos, or other material (&quot;Content&quot;). You are responsible for the Content that you post to the Service.
            </p>
            <p>
              By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, 
              publicly display, reproduce, and distribute such Content on and through the Service.
            </p>
            <p>
              You retain all of your ownership rights in your Content. However, by submitting Content to SocialSync Pro, 
              you hereby grant SocialSync Pro a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, 
              publish, translate and distribute it in any and all media.
            </p>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">6. Payment Terms</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <ul className="space-y-2">
              <li>• Paid plans are billed in advance on a monthly or annual basis</li>
              <li>• All fees are exclusive of taxes, levies, or duties</li>
              <li>• Refunds are processed according to our refund policy</li>
              <li>• We reserve the right to change our subscription plans or adjust pricing for our service</li>
              <li>• Any price changes will be communicated to you in advance</li>
            </ul>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">7. Termination</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
              including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, 
              you may simply discontinue using the Service.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">8. Disclaimer</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <p>
              The information on this website is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, 
              this Company excludes all representations, warranties, conditions and terms.
            </p>
            <p>
              SocialSync Pro shall not be liable for any damages arising out of or in connection with your use of this website.
            </p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, 
              you agree to be bound by the revised terms.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="space-y-2">
                <p><strong>Email:</strong> legal@socialsyncpro.com</p>
                <p><strong>Website:</strong> <Link href="/contact" className="text-purple-600 hover:text-purple-700">Contact Form</Link></p>
                <p><strong>Address:</strong> SocialSync Pro Legal Department</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}