'use client';

import React, { useState } from 'react';
import { Quote, ArrowRight, TrendingUp, Calendar, MapPin } from 'lucide-react';

export const TestimonialScene: React.FC = () => {
  const [activeTesti, setActiveTesti] = useState(0);

  const testimonials = [
    {
      author: 'Thomas Munro',
      role: 'Director',
      company: 'Picha Group',
      quote:
        "My business wouldn't function without this team. Extremely talented with immense experience tailoring each consignment based on its merits. We have our dedicated account managers that know our business, are responsive and provide personalised serviced which we never had with bigger companies. UC for the win.",
    },
    {
      author: 'Francis Fung',
      role: 'APAC Supply Chain Operations Director',
      company: 'Commscope (Fortune 500 Telecom)',
      quote:
        "As a first time supplier shipping equipment to support one of the major Australian infrastructure project I came up against uncharted territories. It was a three months discovery and mobilization period until the first shipment left its origin airborne for Melbourne. Looking back I really appreciate Chris effort in helping a potential customer to understand what are required and how to go about the execution. Our first time right delivery to my Customer's 3PL was no coincident. It was Chris' relentless attention to details and pro-active monitoring of the process that ensured a smooth dock to dock delivery.",
    },
    {
      author: 'Alex Hughes',
      role: 'Senior Management',
      company: 'Factory X',
      quote:
        "I worked closely with Chris over several years to build a seamless, cost effective supply chain for one of Australia's largest fashion retail companies. Chris' knowledge and passion for the industry was apparent from day one. As anyone who works in logistics understands, your freight partner is more than just a service provider, they are an integral part of your business. Chris was not only able to help us streamline our operations throughout Asia and shorten our time to market, but through his willingness to negotiate great rates on our behalf, also provide significant cost savings.",
    },
  ];

  const insights = [
    {
      tag: 'Asia Pacific',
      date: 'October 20, 2026',
      title: 'Typhoon Champi: Ningbo Port Prepares for Potential Container Shipping Disruptions',
      summary: 'Port authorities across East China deploy contingency berth management as seasonal storm fronts impact container schedules.',
    },
    {
      tag: 'Asia Pacific',
      date: 'September 24, 2026',
      title: 'China–Australia Ocean Freight: Rates Are Moving Higher — What Importers Should Watch',
      summary: 'Q4 peak shipping surge drives spot ocean container rates higher across Shanghai to Melbourne and Sydney lanes.',
    },
    {
      tag: 'Middle East & Africa',
      date: 'October 27, 2026',
      title: 'Government extends RELIEF scheme as low-margin exports struggle amid West Asia crisis',
      summary: 'Critical customs duty exemptions and shipping corridor subsidies extended for manufacturing and raw material exporters.',
    },
    {
      tag: 'Asia Pacific',
      date: 'September 8, 2026',
      title: 'China Set to Open Pinglu Canal – Its New Shortcut to South-East Asia',
      summary: 'Historic 134km waterway will directly link inland industrial hubs to the Gulf of Tonkin, shaving weeks off regional transit.',
    },
  ];

  return (
    <section
      id="insights"
      className="relative z-10 w-full bg-[#f4f5f8] text-[#0c1017] py-28 sm:py-36 px-6 sm:px-12 lg:px-20 border-t border-black/10"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        
        {/* Testimonials Deck */}
        <div className="flex flex-col gap-12">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#f45300] font-semibold mb-4 block">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#0c1017] uppercase leading-[1.0] mb-6">
              Trusted by businesses <br />
              across APAC
            </h2>
            <p className="text-base sm:text-lg text-[#4a5568] leading-relaxed">
              From first-time importers to high-volume shippers, our customers keep coming back because we treat their freight like our own.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTesti(idx)}
                className={`p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between border cursor-pointer ${
                  activeTesti === idx
                    ? 'bg-white border-[#f45300]/40 shadow-xl -translate-y-1'
                    : 'bg-white/80 border-black/10 hover:border-black/20'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-[#f45300]/10 flex items-center justify-center mb-6">
                    <Quote className="w-5 h-5 text-[#f45300]" />
                  </div>

                  <p className="text-sm sm:text-base text-[#2d3748] leading-relaxed italic mb-8 font-normal">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-6 border-t border-black/10">
                  <div className="font-heading font-bold text-lg text-[#0c1017]">
                    {t.author}
                  </div>
                  <div className="text-xs text-[#718096] font-medium mt-0.5">
                    {t.role}
                  </div>
                  <div className="text-xs font-mono text-[#f45300] font-semibold mt-1">
                    at {t.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Insights Deck */}
        <div className="flex flex-col gap-12 pt-16 border-t border-black/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#f45300] font-semibold mb-4 block">
                INTELLIGENCE & ANALYSIS
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#0c1017] uppercase leading-[1.05]">
                What&apos;s moving in your industry
              </h2>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 font-heading font-medium text-sm text-[#0c1017] hover:text-[#f45300] transition-colors"
            >
              <span>View all market reports</span>
              <ArrowRight className="w-4 h-4 text-[#f45300]" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {insights.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-black/10 hover:border-[#f45300]/40 transition-all duration-300 flex flex-col justify-between group hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono mb-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#f4f5f8] text-[#f45300] font-bold border border-black/5">
                      {item.tag}
                    </span>
                    <span className="text-[#a0aec0]">&bull;</span>
                    <span className="text-[#718096] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-[#0c1017] mb-3 group-hover:text-[#f45300] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#4a5568] leading-relaxed font-normal">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-black/10 flex items-center justify-between text-xs font-heading font-medium text-[#0c1017] group-hover:text-[#f45300]">
                  <span>Read intelligence brief</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
