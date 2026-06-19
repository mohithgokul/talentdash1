import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, MapPin, DollarSign, Clock, Building2 } from "lucide-react";
import { Reveal } from "../components/ui/Reveal";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Jobs — TalentDash" },
      { name: "description", content: "Curated tech roles with verified compensation data." }
    ],
  }),
  component: JobsPage,
});

const MOCK_JOBS = [
  { id: 1, company: "Google", role: "Senior Software Engineer", level: "L5", location: "Bengaluru, India", tc: "₹85L - ₹1.1Cr", type: "Full-time", posted: "2h ago", logo: "G" },
  { id: 2, company: "Stripe", role: "Backend Engineer", level: "L3", location: "Remote", tc: "$160k - $210k", type: "Full-time", posted: "5h ago", logo: "S" },
  { id: 3, company: "Atlassian", role: "Product Manager", level: "P4", location: "Sydney, AU", tc: "$140k - $190k", type: "Full-time", posted: "1d ago", logo: "A" },
  { id: 4, company: "Microsoft", role: "AI Researcher", level: "Principal", location: "Redmond, WA", tc: "$250k - $350k", type: "Full-time", posted: "1d ago", logo: "M" },
  { id: 5, company: "Uber", role: "Data Scientist", level: "Senior", location: "San Francisco, CA", tc: "$180k - $240k", type: "Full-time", posted: "2d ago", logo: "U" },
  { id: 6, company: "Rippling", role: "Frontend Engineer", level: "L4", location: "Remote (India)", tc: "₹65L - ₹90L", type: "Full-time", posted: "2d ago", logo: "R" },
];

function JobsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Reveal>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[#FFF1F2] text-[#FF5A5F]">
          <Briefcase size={22} />
        </span>
      </Reveal>
      <Reveal delay={60}>
        <h1 className="mt-4 text-[36px] font-bold leading-[1.1] text-[#222222]">Verified Tech Jobs</h1>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-3 max-w-2xl text-[15px] text-[#484848]">
          A curated feed of high-paying tech roles. Every job listed here includes verified compensation bands mapped directly from our salary intelligence data.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {MOCK_JOBS.map((job, i) => (
          <Reveal key={job.id} delay={i * 40 + 150}>
            <div className="group cursor-pointer rounded-xl border border-[#EBEBEB] bg-white p-6 transition-all duration-200 hover:border-[#FF5A5F] hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F2F2F2] text-xl font-bold text-[#222222]">
                    {job.logo}
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold text-[#222222] group-hover:text-[#FF5A5F] transition-colors">{job.role}</h2>
                    <div className="mt-1 flex items-center gap-2 text-[14px] text-[#717171]">
                      <span className="flex items-center gap-1 font-medium text-[#222222]"><Building2 size={14}/> {job.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-2.5 py-1 text-[12px] font-bold text-[#2E7D32]">
                    <DollarSign size={12} />
                    {job.tc}
                  </span>
                </div>
              </div>
              
              <div className="mt-5 flex items-center justify-between border-t border-[#F2F2F2] pt-4">
                <div className="flex gap-2">
                  <span className="rounded-md bg-[#F7F7F7] px-2.5 py-1 text-[12px] font-medium text-[#484848]">{job.level}</span>
                  <span className="rounded-md bg-[#F7F7F7] px-2.5 py-1 text-[12px] font-medium text-[#484848]">{job.type}</span>
                </div>
                <span className="flex items-center gap-1 text-[12px] font-medium text-[#717171]">
                  <Clock size={12} /> {job.posted}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
