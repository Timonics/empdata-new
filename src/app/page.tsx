import { redirect } from "next/navigation";

export default function AuthIndexPage() {
  redirect("/admin/login");
}


// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Building2, Briefcase, Shield, ArrowRight } from 'lucide-react';

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
//       <div className="container mx-auto px-4 py-16">
//         {/* Hero Section */}
//         <div className="text-center mb-16">
//           <h1 className="text-5xl font-bold text-gray-900 mb-4">
//             Welcome to <span className="text-blue-600">EMPDATA</span>
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             A comprehensive employee data management platform for insurance companies
//           </p>
//         </div>

//         {/* Login Options */}
//         <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
//           {/* Admin Card */}
//           <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-600">
//             <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
//               <Shield className="h-7 w-7 text-blue-600" />
//             </div>
//             <h2 className="text-2xl font-bold mb-2">Administrator</h2>
//             <p className="text-gray-600 mb-6">
//               Full system access to manage companies, employees, and registrations
//             </p>
//             <Link href="/admin/auth/login">
//               <Button className="w-full">
//                 Admin Login
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </Link>
//           </div>

//           {/* Portal Card */}
//           <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-600">
//             <div className="flex gap-2 mb-4">
//               <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
//                 <Building2 className="h-7 w-7 text-blue-600" />
//               </div>
//               <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
//                 <Briefcase className="h-7 w-7 text-green-600" />
//               </div>
//             </div>
//             <h2 className="text-2xl font-bold mb-2">Company & Employee Portal</h2>
//             <p className="text-gray-600 mb-6">
//               Access your company dashboard or employee profile
//             </p>
//             <Link href="/portal/login">
//               <Button variant="outline" className="w-full">
//                 Portal Login
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Onboarding Link */}
//         <div className="text-center mt-12">
//           <p className="text-gray-600">
//             New to EMPDATA?{' '}
//             <Link href="/onboarding" className="text-blue-600 hover:text-blue-800 font-medium">
//               Start onboarding →
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }