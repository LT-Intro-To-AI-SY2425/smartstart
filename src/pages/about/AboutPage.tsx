import React from "react";
import AboutHero from "./Hero";
import { Container } from "../../components/marketing/Container";
import { Heading, Lead, Subheading } from "../../components/marketing/Text";
import Member from "./Member";

const Header = () => (
  <Container className="mt-16">
    <Heading as="h1">Large heading</Heading>
    <Lead className="mt-6 max-w-3xl">small heading</Lead>
    <section className="mt-16 grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
      <div className="max-w-lg">
        <h2 className="text-2xl font-medium tracking-tight">Our mission</h2>
        <p className="mt-6 text-sm/6 text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          adLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        </p>
        <p className="mt-8 text-sm/6 text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          adLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        </p>
      </div>
      <div className="max-lg:mt-16 lg:col-span-1">
        <Subheading>stats</Subheading>
        <hr className="mt-6 border-t border-gray-200" />
        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <div className="flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4">
            <dt className="text-sm/6 text-gray-600">commidities</dt>
            <dd className="order-first text-6xl font-medium tracking-tight">
              14
            </dd>
          </div>
          <div className="flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4">
            <dt className="text-sm/6 text-gray-600">dates</dt>
            <dd className="order-first text-6xl font-medium tracking-tight">
              10000000
            </dd>
          </div>
          <div className="flex flex-col gap-y-2 max-sm:border-b max-sm:border-dotted max-sm:border-gray-200 max-sm:pb-4">
            <dt className="text-sm/6 text-gray-600">headlines</dt>
            <dd className="order-first text-6xl font-medium tracking-tight">
              4 milon
            </dd>
          </div>
          <div className="flex flex-col gap-y-2">
            <dt className="text-sm/6 text-gray-600">idk</dt>
            <dd className="order-first text-6xl font-medium tracking-tight">
              idk
            </dd>
          </div>
        </dl>
      </div>
    </section>
  </Container>
);

function Mentors() {
  return (
    <Container className="mt-32">
      <Subheading>Menotors</Subheading>
      <Heading as="h3" className="mt-2">
        mentors from cme
      </Heading>
      <Lead className="mt-6 max-w-3xl">
        something like cme profesonals who graciosuly provided their time
      </Lead>
      <Subheading as="h3" className="mt-24">
        mentors
      </Subheading>
      <hr className="mt-6 border-t border-gray-200" />
      <ul
        role="list"
        className="mx-auto mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2"
      >
        <li>
          <div className="flex gap-4">
            <img
              alt="Andy Anderson"
              src="https://westernfinance.org/wp-content/uploads/speaker-3-v2.jpg"
              className="h-18 rounded-full"
            />
            <Heading className="sm:!text-4xl my-auto">Andy Anderson</Heading>
          </div>
          <p className="mt-6 max-w-lg text-sm/6 text-gray-500">
            I have been working in IT for 20+ years. Throughout those years, I
            have mainly supported one application called Oracle Hyperion/Essbase
            which is traditionally used in Finance departments at companies for
            reporting, forecasting, and budgeting. However, in my work on that
            application, I have worked with many other tools and technologies
            that are used along side it. Some examples are:
            Windows/Unix/Mainframe platforms; multiple programming languages
            like C++, Cobol, Visual Basic, Java; security; automation and
            scheduling tools; performance tuning; database technologies
            (Oracle/SQL Server) and others. I am an expert in Microsoft Excel.
            And I have worked as a full-time employee and a consultant in the
            company I started. Additionally, I have worked in many different
            industries including: retail, pharmaceutical, transportation,
            defense, and manufacturing. I have two kids (17 yr old girl, 15 yr
            old boy), and have been married for 24 years. I am relatively handy
            around the house with repairing things, and have designed and built
            an outdoor playset; two hoists in our garage for Jeep Wrangler doors
            and a hard-top; and I also replaced the shocks/struts on our
            vehicles as well as the brakes, calipers, and rotors. But I
            don&apos;t do plumbing :) I enjoy financial discussions and
            investing.
          </p>
        </li>
        <li>
          <div className="flex gap-4">
            <img
              alt="Heidi Salgado"
              src="https://westernfinance.org/wp-content/uploads/speaker-3-v2.jpg"
              className="h-18 rounded-full"
            />
            <Heading className="sm:!text-4xl my-auto">Heidi Salgado</Heading>
          </div>
          <p className="mt-6 max-w-lg text-sm/6 text-gray-500">
            Hi! I am a Platform Engineer at CME Group. Some of my interests
            include Computer Science, Game Design & Development, and Web
            Development
          </p>
        </li>
      </ul>
    </Container>
  );
}

function Team() {
  return (
    <Container className="mt-32">
      <Subheading>Meet the team</Subheading>
      <Heading as="h3" className="mt-2">
        Built by the best.
      </Heading>
      <Lead className="mt-6 max-w-3xl">
        Built in coloaborzation with cme group
      </Lead>
      <Subheading as="h3" className="mt-24">
        The team
      </Subheading>
      <hr className="mt-6 border-t border-gray-200" />
      <ul
        role="list"
        className="mx-auto mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {new Array(9).fill(null).map((_, i) => (
          <Member
            key={i}
            name="andy anderson"
            position="king"
            image={
              "https://westernfinance.org/wp-content/uploads/speaker-3-v2.jpg"
            }
          />
        ))}
      </ul>
    </Container>
  );
}

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      <AboutHero />
      <Header />
      <Team />
      <Mentors />
    </main>
  );
}
