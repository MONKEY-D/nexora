import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import UserButton from "@/components/UserButton";
import SearchField from "@/components/SearchField";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-6 px-4 py-3">
        <div className="flex items-center gap-1">
          <Image src={logo} alt="logo" className="h-12 w-auto object-contain" />
          <Link href="/" className="text-2xl font-bold text-primary">
            Nexora
          </Link>
        </div>

        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}
