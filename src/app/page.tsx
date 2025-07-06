"use client";

// import { useRouter } from "next/navigation";

// export default function WelcomePage() {
//   const router = useRouter();

//   return (
//     <div className="h-screen flex flex-col items-center justify-center space-y-6 bg-gray-100">
//       <h1 className="text-4xl font-bold text-blue-700">Welcome to EEG Cloud</h1>
//       <p className="text-lg text-gray-700">
//         Your brain data, visualized and understood.
//       </p>

//       <button
//         onClick={() => router.push("/flow/account/login")}
//         className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//       >
//         Get Started
//       </button>
//     </div>
//   );
// }




import { EEGChart } from "@/components/EEGChart";

export default function ParticipantInfoPage() {
  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="w-full h-96">
        <EEGChart />
      </div>
    </div>
  );
}
