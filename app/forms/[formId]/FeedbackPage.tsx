
import { BsCheck2Circle } from "react-icons/bs";
import { IoReload } from "react-icons/io5";

const FeedbackPage = () => {
  // const [rating, setRating] = useState<number>(5); // Default rating is 5

  // const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setRating(Number(e.target.value));
  // };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-2 max-w-[30rem]">
        <BsCheck2Circle className="text-green-600" size={64} />
        <p className="text-center mt-3 text-gray-500 px-4">
          Thank you for your submission! We have successfully recorded your
          response and appreciate the time you took to provide your input. Your
          feedback is valuable to us and plays an essential role in improving
          our services. Rest assured, your response has been securely stored and
          will be used responsibly to enhance the experience for everyone. If
          you have any further contributions or questions, feel free to reach
          out. We&apos;re grateful for your support and participation!
        </p>
      </div>
{/* 
      <div className="mt-4 flex flex-col items-center gap-4 border px-16 py-8 rounded-3xl">
       
        <div className="flex flex-col items-center">
          <label className="text-sm text-gray-700 mb-2">
            Rate your experience:
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={rating}
            onChange={handleRatingChange}
            className="w-56 h-2 bg-green-200 rounded-lg appearance-none"
          />
          <span className="text-lg mt-2">{rating}</span>
        </div>
      </div>
       */}
      <button
        onClick={() => {
          window.location.reload();
        }}
        className="mt-4 flex gap-4"
      >
        <div className="flex items-center gap-2 border p-2 border-black hover:bg-black hover:text-white transition-all active:scale-95 rounded-full">
          <IoReload />
          <p className="text-sm ">Fill Form Again</p>
        </div>
      </button>
    </div>
  );
};

export default FeedbackPage;
