'use client';

import React, { useState } from 'react';
import { Plus, Minus, ArrowUpRight, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const ClimaxScene: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'What does United Carriers do?',
      answer:
        'United Carriers is a global freight forwarding and logistics provider delivering end-to-end supply chain solutions, including airfreight, seafreight, customs brokerage, warehousing, and transport across APAC and international trade corridors.',
    },
    {
      question: 'What industries do you specialise in?',
      answer:
        'We support a broad range of industries including retail, fashion, food & beverage, industrial, project cargo, aerospace, and advanced technology manufacturing.',
    },
    {
      question: 'What shipping methods do you offer?',
      answer:
        'We offer airfreight (express, priority, and charter), seafreight (FCL & LCL), breakbulk, RO/RO, and multimodal transport solutions tailored for timeline and cost predictability.',
    },
    {
      question: 'Do you provide customs clearance services?',
      answer:
        'Yes, we offer fully in-house licensed customs brokerage to manage import and export clearances, biosecurity quarantine, tariff concession applications, and compliance audits efficiently without third-party delays.',
    },
    {
      question: 'How is freight pricing calculated?',
      answer:
        'Pricing depends on factors such as cargo dimensions, chargeable weight, origin, destination, preferred mode of transport, seasonal fuel surcharges, and current market carrier rates. We provide transparent, no-hidden-fee quotes.',
    },
    {
      question: 'Do you offer warehousing and 3PL services?',
      answer:
        'Yes, we provide secure pallet storage, pick and pack, inventory management, temperature monitoring, and scheduled distribution integrated directly with our line-haul fleet.',
    },
    {
      question: 'Can you handle oversized or heavy cargo?',
      answer:
        'Yes, we specialise in project cargo including out-of-gauge (OOG) and heavy lift shipments, complete with route surveys, pilot escorts, and engineered crane configurations.',
    },
    {
      question: 'How do I request a quote?',
      answer:
        'You can contact us directly via our website form, email operations@unitedcarriers.com.au, or call our APAC operations desk with your shipment details for a rapid quote.',
    },
  ];

  return (
    <footer id="faq" className="relative z-10 w-full bg-[#000000] text-white pt-28 pb-16 px-6 sm:px-12 lg:px-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        
        {/* FAQ Section */}
        <div className="flex flex-col gap-12">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#f45300] font-semibold mb-4 block">
              F.A.Q
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-white uppercase leading-[0.98] mb-6">
              Straightforward answers, <br />
              so you move with confidence.
            </h2>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Have questions about APAC customs clearance, cargo lanes, or warehouse integration? Here are the most common inquiries from our commercial partners.
            </p>
          </div>

          {/* Accordion List */}
          <div className="flex flex-col border-t border-white/10">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border-b border-white/10 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full py-7 flex items-center justify-between text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading text-xl sm:text-2xl font-bold uppercase text-white/90 group-hover:text-[#f45300] transition-colors pr-6">
                      {faq.question}
                    </span>
                    <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 transition-colors group-hover:border-[#f45300]">
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-[#f45300]" />
                      ) : (
                        <Plus className="w-4 h-4 text-white group-hover:text-[#f45300]" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pb-8 pr-12 animate-in fade-in duration-300">
                      <p className="text-base sm:text-lg text-white/70 leading-relaxed font-light">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Climax Call-To-Action Banner */}
        <div id="contact" className="relative p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-[#121824] to-[#080c14] border border-white/15 overflow-hidden text-center">
          {/* Ambient Glowing Halo */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(244,83,0,0.2) 0%, rgba(0,22,203,0.15) 50%, transparent 75%)',
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#f45300] font-bold">
              GET IN TOUCH
            </span>

            <h2 className="font-heading text-4xl sm:text-6xl font-bold uppercase tracking-tight text-white leading-[1.0]">
              Ready to move smarter?
            </h2>

            <p className="text-base sm:text-lg text-white/75 font-normal leading-relaxed">
              Still have questions? Our dedicated APAC operations directors and licensed customs brokers are ready to tailor your freight journey.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <a
                href="mailto:operations@unitedcarriers.com.au"
                className="px-8 py-4 rounded-full bg-[#f45300] text-white font-heading font-medium text-sm tracking-tight transition-all duration-300 hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(244,83,0,0.5)] active:scale-95 flex items-center gap-2"
              >
                <span>Talk with us</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="mailto:quotes@unitedcarriers.com.au"
                className="px-8 py-4 rounded-full border border-white/20 text-white font-heading font-medium text-sm tracking-tight transition-all duration-300 hover:bg-white/10 active:scale-95 flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-[#f45300]" />
                <span>Email operations</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-white/60 mt-6 pt-6 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f45300]" />
                APAC HQ: Melbourne, Australia
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Licensed Customs Brokerage
              </span>
              <span>&bull;</span>
              <span>ISO 9001 Accredited</span>
            </div>
          </div>
        </div>

        {/* United Carriers Footer */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-xs font-mono text-white/60">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3">
            <span className="font-heading font-bold text-base text-white uppercase tracking-wider">
              UNITED CARRIERS
            </span>
            <span className="w-2 h-2 rounded-full bg-[#f45300]" />
            <span className="text-white/40">|</span>
            <span className="text-white/60">ONE OPERATOR. EVERY LEG.</span>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6 text-[11px] font-sans">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="#why-us" className="hover:text-white transition-colors">Why Us</a>
            <a href="#insights" className="hover:text-white transition-colors">Insights</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Copyright Notice */}
          <div className="text-[11px] text-white/40 text-center md:text-right">
            &copy; 2026 United Carriers Group Pty Ltd. All rights reserved.
          </div>

        </div>

      </div>
    </footer>
  );
};
