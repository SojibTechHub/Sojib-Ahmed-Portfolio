// ============================
// TESTIMONIALS DATA
// ============================

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  quote: string;
  relation: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Jhankar Mahbub',
    role: 'Lead Instructor',
    company: 'Programming Hero',
    avatar: 'JM',
    rating: 5,
    quote: "Sojib is one of those rare learners who goes above and beyond. His dedication to understanding the 'why' behind every concept, not just the 'how', is what sets him apart. His projects demonstrate senior-level thinking for a dedicated full-stack engineer.",
    relation: 'Instructor',
  },
  {
    id: 't2',
    name: 'Arif Hossain',
    role: 'Fellow Developer',
    company: 'Programming Hero Cohort',
    avatar: 'AH',
    rating: 5,
    quote: "Collaborating with Sojib on our group projects was a fantastic experience. He has an incredible ability to break complex problems into manageable pieces. His code is clean, well-documented, and a pleasure to work with.",
    relation: 'Peer',
  },
  {
    id: 't3',
    name: 'Nusrat Jahan',
    role: 'Web Developer',
    company: 'Freelance',
    avatar: 'NJ',
    rating: 5,
    quote: "I was impressed by Sojib's attention to detail when I reviewed his InvestProp AI project. The architecture is thoughtful, the code quality is high, and the UI/UX is genuinely beautiful. A developer with a designer's eye.",
    relation: 'Community Reviewer',
  },
  {
    id: 't4',
    name: 'Rakib Hassan',
    role: 'Full Stack Developer',
    company: 'Tech Community',
    avatar: 'RH',
    rating: 5,
    quote: "Sojib's approach to problem-solving is methodical and efficient. His Pet Adoption Platform is a great example of clean MERN stack implementation. He clearly understands how to build real-world applications, not just tutorial projects.",
    relation: 'Code Reviewer',
  },
  {
    id: 't5',
    name: 'Lamia Akter',
    role: 'UI/UX Designer',
    company: 'Freelance Designer',
    avatar: 'LA',
    rating: 5,
    quote: "Working with Sojib feels effortless — he translates design mockups to pixel-perfect implementations with incredible accuracy. His understanding of animations and transitions makes the end product feel polished and professional.",
    relation: 'Design Collaborator',
  },
  {
    id: 't6',
    name: 'Sabbir Ahmed',
    role: 'React Developer',
    company: 'PH Peer Group',
    avatar: 'SA',
    rating: 5,
    quote: "Sojib helped me debug a complex Redux state management issue in our shared project. His debugging skills and patience are remarkable. He doesn't just fix the bug — he explains why it happened so everyone learns.",
    relation: 'Study Partner',
  },
];
