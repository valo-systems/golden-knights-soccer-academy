export type Post = {
  slug: string;
  title: string;
  date: string;
  category: "Academy news" | "Match reports" | "Community" | "Sponsors";
  excerpt: string;
  img: string;
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: "welcome-to-the-new-website",
    title: "Welcome to the new Golden Knights website",
    date: "June 2026",
    category: "Academy news",
    img: "/img/photos/academy-02.jpg",
    excerpt:
      "Our new home on the web is here, making it easier than ever to join the academy, follow the teams, and partner with us.",
    body: [
      "We are proud to launch the new Golden Knights Soccer Academy website. It brings everything about the academy into one place: our programmes, teams, gallery, news, and the ways businesses can partner with us.",
      "Parents can now learn about age groups and book a trial in a few clicks, while supporters can keep up with fixtures, results, and academy life as the season unfolds.",
      "This is just the beginning. We will keep adding match reports, achievements, and stories from around the academy, so check back often.",
    ],
  },
  {
    slug: "golden-knights-aims-high-in-midrand",
    title: "Golden Knights Soccer Academy aims high in Midrand",
    date: "Featured",
    category: "Community",
    img: "/img/photos/academy-05.jpg",
    excerpt:
      "Since 2016 the academy has taken the Midrand community by storm, empowering young people through football.",
    body: [
      "Golden Knights Soccer Academy has taken the Midrand community by storm and aims to empower and help the youth to become international football stars.",
      "Registered with SAFA through the North Rand Football Association, the academy supports over 100 players and reaches hundreds of family and community members through training, leagues, and outreach.",
      "Beyond football, the academy is committed to seeing its members do well academically and grow in discipline, confidence, and character.",
    ],
  },
  {
    slug: "thank-you-to-our-partners",
    title: "Thank you to the partners backing our players",
    date: "2025/26 season",
    category: "Sponsors",
    img: "/img/photos/academy-03.webp",
    excerpt:
      "Every kit, ball, and tournament entry is made possible by the businesses who choose to invest in young footballers.",
    body: [
      "Partnership is at the heart of what makes the academy possible. From kit and equipment to tournament fees and player support, our sponsors turn ambition into opportunity.",
      "We are grateful to every business and individual standing behind our players, and we work hard to give partners real, visible recognition in return.",
      "Interested in joining them? Our sponsorship options put your brand on our kit, at our matches, and across our community.",
    ],
  },
  {
    slug: "season-kicks-off",
    title: "Season kicks off with strong performances",
    date: "Season",
    category: "Match reports",
    img: "/img/photos/academy-01.jpg",
    excerpt: "Our squads opened the season with committed displays across the age groups.",
    body: [
      "The new season is underway and our teams have started with energy and discipline across every age group.",
      "Match reports and results will be posted here through the season, celebrating the hard work of our players and coaches.",
      "Come and support the teams at our next fixtures, and follow along here and on Instagram.",
    ],
  },
];
