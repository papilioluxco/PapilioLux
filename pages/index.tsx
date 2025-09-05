import Image from "next/image";
import Head from "next/head";

export default function Home() {
return (
<>
<Head>
<title>Papilio Lux</title>
<meta name="description" content="Life, Transformed - Papilio Lux" />
</Head>

<main className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
{/* Logo */}
<div className="mt-10">
<Image
src="/logo.png" // <-- place your butterfly logo in /public/logo.png
alt="Papilio Lux Logo"
width={200}
height={200}
/>
</div>

{/* Title */}
<h1 className="text-4xl font-bold mt-6">Welcome to Papilio Lux</h1>
<p className="text-lg mt-4 text-center max-w-lg">
Transform your life with clarity, organization, and purpose.
</p>

{/* Call to Action */}
<a
href="#waitlist"
className="mt-8 px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-800"
>
Join the Waitlist
</a>
</main>
</>
);
}
