import wellDoneImg from "../../../public/svg/wellDone.svg";
import Image from "next/image";
import Link from "next/link";

export default function CongratulationsSection({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-xl mx-auto p-4 text-center flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Congratulations! 🎉</h2>
      {children || (
        <p className="mb-4">
          You have completed the study of the words in the set. Well done!
        </p>
      )}
      <div className="my-4 ">
        <Image className="max-h-[250px]" src={wellDoneImg} alt="Well done" />
      </div>
      <div className="mt-4 flex flex-row gap-2 items-center mx-auto justify-center">
        <Link className=" bg-blue-500 text-white px-4 py-2 rounded" href="/">
          Back to Home
        </Link>
        <p>or</p>
        <Link
          className=" bg-blue-500 text-white px-4 py-2 rounded"
          href={`/study/${id}`}
        >
          Back to study page
        </Link>
      </div>
    </div>
  );
}
