import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import mindImg from "../../../public/svg/mindfull.svg";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Freezlet - Your Study App</title>
        <meta
          name="description"
          content="Learn more about Freezlet, your free study app for mastering foreign language vocabulary and tracking your progress."
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <main className="flex flex-col items-center p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">About Freezlet</h1>
        <div className="w-32 h-32 bg-gray-200 rounded-full mb-6 flex items-center justify-center">
          <div className="my-4 ">
            <Image className="max-h-[250px]" src={mindImg} alt="Well done" />
          </div>
        </div>
        <p className="text-lg text-gray-600 mb-6 text-justify max-w-2xl">
          You know,guys , im sometimes tired about payed services when I am not
          sure about will i use it constantly. And I just need simple stuff to
          practice something. So, if you like me you may like what i create.
          It&apos;s not a copy or kind. It&apos;s just simple app to practice. I
          don&apos;t want to steal clients or kind of. Just for fun, just for
          people.
        </p>
        <p className="text-lg text-gray-600 mb-6 text-justify max-w-2xl">
          Freezlet is a free study app designed to help you master foreign
          language vocabulary, create personalized flashcards, and track your
          learning progress. Built with simplicity and effectiveness in mind,
          it&apos;s your companion for achieving your learning goals.
        </p>

        <div className="w-full max-w-md mt-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Follow Me</h2>
          <div className="flex gap-2 justify-center">
            <Link className=" text-blue-500" href="https://github.com/Oldu8">
              GitHub
            </Link>
            <Link
              className=" text-blue-500"
              href="https://www.linkedin.com/in/oldu8/"
            >
              LinkedIn
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="my-4 font-bold bg-gray-400 text-white p-2 rounded"
        >
          Back on main page
        </Link>
      </main>
    </>
  );
}
