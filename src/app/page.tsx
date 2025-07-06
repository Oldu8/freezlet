import Head from "next/head";
import Link from "next/link";
import creationImg from "../../public/svg/creation.svg";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Welcome to Freezlet - Your Study App</title>
        <meta
          name="description"
          content="Improve your skills with our study app. Create flashcards, test yourself, and track your progress easily. Freezlet is perfect for mastering foreign language vocabulary and achieving your learning goals."
        />
        <meta
          name="keywords"
          content="study app, learn words, flashcards, language learning, vocabulary practice, tests, foreign languages"
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="flex flex-col items-center justify-center p-4">
        <div className="w-32 h-32 bg-gray-200 rounded-full mb-6 flex items-center justify-center">
          <div className="my-4 ">
            <Image
              className="max-h-[250px]"
              src={creationImg}
              alt="Well done"
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to Freezlet - Your Study App
        </h1>

        <div className="flex flex-col md:hidden mb-4">
          <p className="text-lg text-gray-600 mb-6 text-center">
            Don&apos;t want to read our text ? No problem, just hit the start
            button and let&apos;s begin.
          </p>
          <div className="flex gap-2">
            <Link
              href="/start"
              className="px-2 md:px-6 py-2 md:py-3 bg-blue-500 text-white rounded-md text-md md:text-lg hover:bg-blue-600 transition"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="px-2 md:px-6 py-2 md:py-3 bg-gray-200 text-gray-700 rounded-md text-md md:text-lg hover:bg-gray-300 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
        <p className="text-md md:text-lg text-gray-600 mb-6 text-justify md:text-center ">
          Freezlet is your ultimate tool for mastering foreign language
          vocabulary. Create personalized flashcards, test your knowledge, and
          track your progress. Designed for language enthusiasts, this app
          simplifies and enhances your learning experience.
        </p>

        <p className="text-md md:text-lg text-gray-600 mb-6 text-justify md:text-center ">
          Whether you are preparing for exams, learning a new language, or
          simply want to improve your vocabulary, Freezlet has everything you
          need. Practice with writing tasks, take quizzes, and ensure you retain
          the knowledge effectively.
        </p>

        <ul className="list-disc">
          <li className="text-md md:text-lg text-gray-600 mb-2 text-start">
            Create and customize your flashcards to suit your learning style.
          </li>
          <li className="text-md md:text-lg text-gray-600 mb-2 text-start">
            Test your knowledge with quizzes and assessments.
          </li>
          <li className="text-md md:text-lg text-gray-600 mb-2 text-start">
            Track your progress and see your improvement over time.
          </li>
        </ul>

        <div className="md:flex flex-col items-center gap-4 hidden">
          <h2 className="text-2xl font-bold">
            Lets start learning terms and definitions
          </h2>
          <div className="flex gap-4">
            <Link
              href="/start"
              className="px-6 py-3 bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600 transition"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md text-lg hover:bg-gray-300 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
