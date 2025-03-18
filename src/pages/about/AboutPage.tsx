import AboutHero from "./Hero";
import { Container } from "../../components/marketing/Container";
import { Heading, Lead, Subheading } from "../../components/marketing/Text";
import Member from "./Member";
import commodity_price_image from "../../assets/get_date_commodity_price.svg";
import drew from "../../assets/members/drew.webp";
import myles from "../../assets/members/myles.webp";
import ethan from "../../assets/members/ethan.webp";
import zach from "../../assets/members/zach.webp";
import camden from "../../assets/members/camden.webp";
import { motion } from "framer-motion";

const stats_list = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const stats_item = {
  hidden: { x: -10, opacity: 1 },
  visible: { x: 0, opacity: 1 },
};

const team_list = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const team_item = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1 },
  }),
};

const Header = () => (
  <Container className="mt-25">
    <Heading as="h1">Cutting-Edge Market Solutions</Heading>
    <Lead className="mt-6 max-w-3xl">
      Unlock the future of historical commodity analysis
    </Lead>
    <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
      <div className="max-w-lg">
        <h2 className="text-2xl font-medium tracking-tight">Our mission</h2>
        <p className="mt-6 text-sm/6 text-gray-600">
          SmartStart is a platform that provides historical commodity data and
          analysis to help users make informed decisions. With access to
          millions of news headlines, you can gain deeper insight into how world
          events impact the market. Our goal is to provide a comprehensive
          solution for investors, researchers, and students to analyze and
          understand the market.
        </p>
        <p className="mt-8 text-sm/6 text-gray-600">
          To achieve this, we have partnered with CME Group to provide
          mentorship and guidance to our team. Our mentors have years of
          experience in the industry and are dedicated to helping us succeed.
          We're excited to share our platform with you.
        </p>
      </div>
      <div className="max-lg:mt-16 lg:col-span-1">
        <Subheading>stats</Subheading>
        <hr className="mt-6 border-t border-gray-200" />
        <motion.ul
          whileInView="visible"
          initial="hidden"
          variants={stats_list}
          viewport={{ once: true, margin: "-180px" }}
        >
          <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
            <motion.li variants={stats_item}>
              <div className="flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4">
                <dt className="text-sm/6 text-gray-600">commodities</dt>
                <dd className="order-first text-6xl font-medium tracking-tight">
                  14
                </dd>
              </div>
            </motion.li>
            <motion.li variants={stats_item}>
              <div className="flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4">
                <dt className="text-sm/6 text-gray-600">dates</dt>
                <dd className="order-first text-6xl font-medium tracking-tight">
                  6,000+
                </dd>
              </div>
            </motion.li>
            <motion.li variants={stats_item}>
              <div className="flex flex-col gap-y-2 max-sm:border-b max-sm:border-dotted max-sm:border-gray-200 max-sm:pb-4">
                <dt className="text-sm/6 text-gray-600">headlines</dt>
                <dd className="order-first text-6xl font-medium tracking-tight">
                  4.5 million
                </dd>
              </div>
            </motion.li>
          </dl>
        </motion.ul>
      </div>
    </section>
  </Container>
);

function Mentors() {
  return (
    <Container className="mt-32">
      <Subheading>Mentorship</Subheading>
      <Heading as="h3" className="mt-2">
        CME Group Mentorship
      </Heading>
      <Lead className="mt-6 max-w-3xl">
        These industry professionals have graciously offered their time to guide
        and support our team.
      </Lead>
      <Subheading as="h3" className="mt-24">
        mentors
      </Subheading>
      <hr className="mt-6 border-t border-gray-200" />
      <motion.ul
        whileInView="visible"
        initial="hidden"
        variants={team_list}
        viewport={{ once: true, margin: "-50px" }}
      >
        <ul
          role="list"
          className="mx-auto mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          <motion.li custom={0} variants={team_item}>
            <li>
              <div className="flex gap-4">
                <img
                  alt="Andy Anderson"
                  src="https://westernfinance.org/wp-content/uploads/speaker-3-v2.jpg"
                  className="h-18 rounded-full"
                />
                <Heading className="sm:!text-4xl my-auto">
                  Andy Anderson
                </Heading>
              </div>
              <p className="mt-6 max-w-lg text-sm/6 text-gray-500">
                I have been working in IT for 20+ years. Throughout those years,
                I have mainly supported one application called Oracle
                Hyperion/Essbase which is traditionally used in Finance
                departments at companies for reporting, forecasting, and
                budgeting. However, in my work on that application, I have
                worked with many other tools and technologies that are used
                along side it. Some examples are: Windows/Unix/Mainframe
                platforms; multiple programming languages like C++, Cobol,
                Visual Basic, Java; security; automation and scheduling tools;
                performance tuning; database technologies (Oracle/SQL Server)
                and others. I am an expert in Microsoft Excel. And I have worked
                as a full-time employee and a consultant in the company I
                started. Additionally, I have worked in many different
                industries including: retail, pharmaceutical, transportation,
                defense, and manufacturing. I have two kids (17 yr old girl, 15
                yr old boy), and have been married for 24 years. I am relatively
                handy around the house with repairing things, and have designed
                and built an outdoor playset; two hoists in our garage for Jeep
                Wrangler doors and a hard-top; and I also replaced the
                shocks/struts on our vehicles as well as the brakes, calipers,
                and rotors. But I don&apos;t do plumbing :) I enjoy financial
                discussions and investing.
              </p>
            </li>
          </motion.li>
          <motion.li custom={1} variants={team_item}>
            <li>
              <div className="flex gap-4">
                <img
                  alt="Heidi Salgado"
                  src="https://westernfinance.org/wp-content/uploads/speaker-3-v2.jpg"
                  className="h-18 rounded-full"
                />
                <Heading className="sm:!text-4xl my-auto">
                  Heidi Salgado
                </Heading>
              </div>
              <p className="mt-6 max-w-lg text-sm/6 text-gray-500">
                Hi! I am a Platform Engineer at CME Group. Some of my interests
                include Computer Science, Game Design & Development, and Web
                Development
              </p>
            </li>
          </motion.li>
        </ul>
      </motion.ul>
    </Container>
  );
}

function Team() {
  return (
    <Container className="mt-32">
      <Subheading>Meet the team</Subheading>
      <Heading as="h3" className="mt-2">
        Built by experienced students
      </Heading>
      <Lead className="mt-6 max-w-3xl">
        Our team is made up of students from various backgrounds and
        experiences, all working together to deliver innovative solutions.
      </Lead>
      <Subheading as="h3" className="mt-24">
        The Team
      </Subheading>
      <hr className="mt-6 border-t border-gray-200" />
      <motion.ul
        whileInView="visible"
        initial="hidden"
        variants={team_list}
        viewport={{ once: true, margin: "-50px" }}
      >
        <ul
          role="list"
          className="mx-auto mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <motion.li custom={0} variants={team_item}>
            <Member
              name="Zach Buchar"
              position="Project Manager & Development"
              image={zach}
            />
          </motion.li>
          <motion.li custom={1} variants={team_item}>
            <Member
              name="Camden Rush"
              position="Communications & Development"
              image={camden}
            />
          </motion.li>
          <motion.li custom={2} variants={team_item}>
            <Member
              name="Myles Vendel"
              position="Timeline Manager & Development"
              image={myles}
            />
          </motion.li>
          <motion.li custom={3} variants={team_item}>
            <Member
              name="Thomas Burgeson"
              position="Testing/Feedback Lead"
              image={
                "https://westernfinance.org/wp-content/uploads/speaker-3-v2.jpg"
              }
            />
          </motion.li>
          <motion.li custom={4} variants={team_item}>
            <Member name="Ethan Hui" position="Research Lead" image={ethan} />
          </motion.li>
          <motion.li custom={5} variants={team_item}>
            <Member
              name="Lynn Ogi"
              position="Data Analyst"
              image={
                "https://westernfinance.org/wp-content/uploads/speaker-3-v2.jpg"
              }
            />
          </motion.li>
          <motion.li custom={6} variants={team_item}>
            <Member
              name="Aden Mei"
              position="Branding Manager"
              image={
                "https://westernfinance.org/wp-content/uploads/speaker-3-v2.jpg"
              }
            />
          </motion.li>
          <motion.li custom={7} variants={team_item}>
            <Member name="Drew Stephens" position="Design Lead" image={drew} />
          </motion.li>
        </ul>
      </motion.ul>
    </Container>
  );
}

function QualityControl() {
  return (
    <Container className="mt-25">
      <Heading as="h1">Data you can trust</Heading>
      <Lead className="mt-6 max-w-3xl">
        Built-in quality control to ensure accuracy
      </Lead>
      <section className="mt-5 grid items-center grid-cols-1 lg:grid-cols-2 lg:gap-12">
        <div className="max-w-lg">
          <p className="mt-6 text-sm/6 text-gray-600">
            SmartStart easily allows users to trace the source of the data used
            to ensure accuracy. Automatic function logs provide a clear audit
            trail of the commodity prices and news headlines have source links
            to original articles.
          </p>
          <p className="mt-8 text-sm/6 text-gray-600">
            Our platform is designed to provide transparency and accountability
            to our users. We understand the importance of reliable data and have
            designed our platform to meet the highest standards of quality
            control.
          </p>
        </div>
        <div className="max-lg:mt-16 lg:col-span-1">
          <img
            src={commodity_price_image}
            alt="commodity prices"
            className="w-full h-90"
          />
        </div>
      </section>
    </Container>
  );
}

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      <AboutHero />
      <Header />
      <QualityControl />
      <Team />
      <Mentors />
    </main>
  );
}
