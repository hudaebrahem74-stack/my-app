import { ShoppingCart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      
     
      <main
    className="flex-1 flex flex-col items-start 
               bg-cover bg-center bg-no-repeat
               bg-[url('/images/premium_vector-1719829071159-66b351c8f2d4.avif')]"
  >
    <div className="w-full max-w-4xl mt-16 px-6 ">
      <h1 className="font-bold text-5xl mb-5 text-gray-700">
        Online Store
      </h1>

      <button className="bg-purple-300 text-white px-6 py-3 rounded-lg hover:bg-purple-500 transition duration-300 shadow-md">
        Shop Now
      </button>
    </div>

    <div
      className="mt-28 w-32 h-32 ml-4
                 bg-gradient-to-br from-purple-300 to-purple-400
                 rounded-full 
                 shadow-[0_0_40px_rgba(168,85,247,0.6)]
                 flex items-center justify-center 
                 text-white cursor-pointer
                 animate-spin hover:scale-110 transition-transform duration-500"
    >
      <ShoppingCart size={60} />
    </div>
  </main>
</div>
  );
}
