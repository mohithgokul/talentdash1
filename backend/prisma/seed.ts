import { PrismaClient, Level, Currency, SalarySource, Difficulty, DiscussionTag, OfferStatus, Region } from '@prisma/client';

const prisma = new PrismaClient();

function normalizeCompany(raw: string): string {
  let name = raw.toLowerCase().trim();
  const suffixes = [
    "pvt ltd", "private limited", "pvt. ltd.", "pvt.", "ltd.", "inc.", "inc", "llc", "llp", ".com",
    "technologies", "technology", "solutions", "india", "bpo", "web services", "consulting", "software", "systems", "group", "global"
  ];
  for (const suffix of suffixes) {
    if (name.endsWith(suffix)) {
      name = name.slice(0, -suffix.length).trim();
    }
  }
  const aliases: Record<string, string> = {
    "tata consultancy": "tcs",
    "tata consultancy services": "tcs",
    "amazon web services": "aws",
    "google india": "google",
    "microsoft india": "microsoft",
    "infosys bpo": "infosys",
    "wipro technologies": "wipro",
    "flipkart internet": "flipkart"
  };
  return aliases[name] || name;
}

async function main() {
  console.log("Starting full database seed...");

  // Clean DB
  await prisma.offer.deleteMany();
  await prisma.workplaceIndex.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.review.deleteMany();
  await prisma.salary.deleteMany();
  await prisma.company.deleteMany();

  const companiesData = [
    { rawName: "Google India", name: "Google", industry: "Internet", hq: "Mountain View, CA", founded: 1998, hc: "100k+", score: 4.5 },
    { rawName: "Amazon Web Services", name: "Amazon", industry: "E-commerce & Cloud", hq: "Seattle, WA", founded: 1994, hc: "1M+", score: 3.8 },
    { rawName: "Meta Platforms Inc.", name: "Meta", industry: "Social Media", hq: "Menlo Park, CA", founded: 2004, hc: "50k+", score: 4.2 },
    { rawName: "Microsoft India", name: "Microsoft", industry: "Software", hq: "Redmond, WA", founded: 1975, hc: "100k+", score: 4.4 },
    { rawName: "Flipkart Internet", name: "Flipkart", industry: "E-commerce", hq: "Bengaluru, India", founded: 2007, hc: "10k+", score: 3.9 },
    { rawName: "Meesho", name: "Meesho", industry: "E-commerce", hq: "Bengaluru, India", founded: 2015, hc: "5k+", score: 4.0 },
    { rawName: "NVIDIA Corporation", name: "NVIDIA", industry: "Semiconductors", hq: "Santa Clara, CA", founded: 1993, hc: "20k+", score: 4.7 },
    { rawName: "Tata Consultancy Services", name: "TCS", industry: "IT Services", hq: "Mumbai, India", founded: 1968, hc: "600k+", score: 3.5 },
    { rawName: "Infosys BPO", name: "Infosys", industry: "IT Services", hq: "Bengaluru, India", founded: 1981, hc: "300k+", score: 3.6 },
    { rawName: "Wipro Technologies", name: "Wipro", industry: "IT Services", hq: "Bengaluru, India", founded: 1945, hc: "250k+", score: 3.4 },
    { rawName: "Razorpay Software Pvt Ltd", name: "Razorpay", industry: "Fintech", hq: "Bengaluru, India", founded: 2014, hc: "1k+", score: 4.3 },
    { rawName: "Zepto", name: "Zepto", industry: "Quick Commerce", hq: "Mumbai, India", founded: 2021, hc: "1k+", score: 3.9 }
  ];

  const companyMap = new Map();

  for (const c of companiesData) {
    const norm = normalizeCompany(c.rawName);
    const company = await prisma.company.create({
      data: {
        name: c.name,
        slug: norm,
        normalized_name: norm,
        industry: c.industry,
        headquarters: c.hq,
        founded_year: c.founded,
        headcount_range: c.hc,
        workplace_score: c.score,
      }
    });
    companyMap.set(norm, company.id);

    // Create WorkplaceIndex
    await prisma.workplaceIndex.create({
      data: {
        company_id: company.id,
        overall_score: c.score,
        compensation_score: c.score,
        culture_score: Math.max(1, c.score - 0.2),
        growth_score: Math.min(5, c.score + 0.1),
        wlb_score: Math.max(1, c.score - 0.4),
        diversity_score: c.score,
        recommend_pct: Math.floor(c.score * 20),
        industry: c.industry,
      }
    });

    // Create 3+ Reviews
    for (let i = 0; i < 3; i++) {
      await prisma.review.create({
        data: {
          company_id: company.id,
          reviewer_role: "Software Engineer",
          reviewer_location: "Bengaluru",
          overall_rating: c.score - 0.5 + Math.random(),
          work_life_rating: Math.max(1, c.score - 1 + Math.random() * 2),
          comp_rating: c.score,
          culture_rating: c.score,
          review_text: `Working at ${c.name} is generally a good experience. The teams are smart and the impact is large.`,
          pros: "Great brand, smart peers, good pay.",
          cons: "Can be bureaucratic, WLB depends on team.",
          is_verified: true,
        }
      });
    }

    // Create 3+ Interviews
    const difficulties = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD];
    for (let i = 0; i < 3; i++) {
      await prisma.interview.create({
        data: {
          company_id: company.id,
          role: "SDE",
          difficulty: difficulties[i % 3],
          question_text: `Design a scalable system for ${c.name} specific use-case ${i}.`,
          skill_tags: ["System Design", "Algorithms"],
          is_verified: true,
        }
      });
    }
  }

  // Edge cases normalization demo
  const testNames = ["GOOGLE", "google ", "Google India"];
  for (const tn of testNames) {
    if (normalizeCompany(tn) !== "google") throw new Error("Normalization failed for " + tn);
  }

  // Create 60 Salaries
  const roles = ["Software Engineer", "Backend Engineer", "Frontend Engineer", "Data Scientist", "Product Manager"];
  const locations = ["Bengaluru", "Mumbai", "Hyderabad", "Pune", "Delhi", "San Francisco", "London"];
  const levels = Object.values(Level);
  
  for (let i = 0; i < 60; i++) {
    const cNorm = normalizeCompany(companiesData[i % companiesData.length].rawName);
    const cid = companyMap.get(cNorm);
    const isFaang = ["google", "amazon", "meta", "microsoft"].includes(cNorm);
    
    let base = isFaang ? 3000000 + (i * 100000) : 1000000 + (i * 50000);
    let bonus = Math.floor(base * 0.1);
    let stock = isFaang ? Math.floor(base * 0.5) : Math.floor(base * 0.1);
    let level = levels[i % levels.length];
    
    // Edge cases
    if (i === 0) { bonus = 0; stock = 0; } // zero bonus/stock
    if (i === 1) { stock = base * 3; } // very high equity
    if (i === 2) { level = Level.PRINCIPAL; base = 8000000; stock = 15000000; } // Principal level

    await prisma.salary.create({
      data: {
        company_id: cid,
        role: roles[i % roles.length],
        level: level,
        location: locations[i % locations.length],
        currency: locations[i % locations.length] === "San Francisco" ? Currency.USD : (locations[i % locations.length] === "London" ? Currency.GBP : Currency.INR),
        experience_years: (i % 10) + 1,
        base_salary: BigInt(base),
        bonus: BigInt(bonus),
        stock: BigInt(stock),
        total_compensation: BigInt(base + bonus + stock),
        source: SalarySource.CONTRIBUTOR,
        confidence_score: 0.9,
        is_verified: true,
      }
    });
  }

  // Create Discussions
  for (let i = 0; i < 15; i++) {
    await prisma.discussion.create({
      data: {
        topic: `Discussion topic ${i} regarding hiring and compensation.`,
        body: `I recently got an offer. What do you think about the current market?`,
        tag: i % 3 === 0 ? DiscussionTag.TRENDING : (i % 2 === 0 ? DiscussionTag.HOT : DiscussionTag.NEW),
        reply_count: Math.floor(Math.random() * 50),
        view_count: Math.floor(Math.random() * 1000),
        community: "Software Engineering",
        company_id: i % 2 === 0 ? companyMap.get("google") : null,
      }
    });
  }

  // Create Offers
  for (let i = 0; i < 5; i++) {
    await prisma.offer.create({
      data: {
        company_name: "Google",
        role: "Software Engineer",
        level: Level.L4,
        location: "Bengaluru",
        currency: Currency.INR,
        base_salary: BigInt(3500000),
        bonus: BigInt(500000),
        stock: BigInt(2000000),
        total_compensation: BigInt(6000000),
        offer_score: 85,
        base_benchmark: "Above market",
        status: OfferStatus.EVALUATED
      }
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
