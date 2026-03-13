"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";
import type { Metadata } from "next";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate form submission
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="section-title">Contact Us</h1>
        <div className="gold-divider mx-auto" />
        <p className="text-gray-500 mt-4">We'd love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-8 text-white h-full">
            <h2 className="font-serif text-xl mb-6">Get In Touch</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <MapPin size={20} className="text-gold-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Our Location</p>
                  <p className="text-gray-400 text-sm">Lahore, Pakistan</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={20} className="text-gold-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Call Us</p>
                  <a href="tel:+923001234567" className="text-gray-400 text-sm hover:text-gold-400 transition-colors">+92 300 1234567</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={20} className="text-gold-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Email Us</p>
                  <a href="mailto:info@luxescents.com" className="text-gray-400 text-sm hover:text-gold-400 transition-colors">info@luxescents.com</a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">Business Hours</p>
              <p className="text-sm text-gray-300 mt-2">Mon - Sat: 10:00 AM - 8:00 PM</p>
              <p className="text-sm text-gray-300">Sunday: 12:00 PM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 shadow-sm p-8">
            <h2 className="font-serif text-xl mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Your Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-luxury" placeholder="Full name" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Email Address</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="input-luxury" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Subject</label>
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="input-luxury" placeholder="How can we help?" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-600 mb-1 block">Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={6} className="input-luxury resize-none" placeholder="Tell us about your inquiry..." />
              </div>
              <button type="submit" disabled={submitting} className="btn-gold flex items-center gap-2 disabled:opacity-50">
                <Send size={16} /> {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
