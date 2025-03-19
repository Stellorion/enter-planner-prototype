import Link from 'next/link';

const NavLinks = () => {
  return (
    <>
      <Link href="./admin" className="text-black hover:underline">
        Admin
      </Link>
      <Link href="#" className="text-black hover:underline">
        Place 2
      </Link>
      <Link href="#" className="text-black hover:underline">
        Place 3
      </Link>
      <Link href="#" className="text-black hover:underline">
        Place 4
      </Link>
    </>
  );
};

export default NavLinks;