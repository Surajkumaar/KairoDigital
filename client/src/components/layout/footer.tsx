import { Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black py-12 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-3xl font-bold text-white mb-4">
              <img src="/assets/Primary Logo_2 - Transparent.png" alt="Kairo Digital" className="h-12" />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Where Creativity Meets Conversion. Your digital growth partner for meaningful results.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/kairo_digital_?igsh=MW05anJrYTN1emV1ZA==" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="https://x.com/Kairo_Digital" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/under-development" className="hover:text-white transition-colors">Social Media Marketing</a></li>
              <li><a href="/under-development" className="hover:text-white transition-colors">Branding & Identity</a></li>
              <li><a href="/under-development" className="hover:text-white transition-colors">Content Creation</a></li>
              <li><a href="/under-development" className="hover:text-white transition-colors">Growth Strategy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/under-development" className="hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="/under-development" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Kairo Digital. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
