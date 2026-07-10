import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../context/authContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/create", label: "Create Post" },
  { to: "/communities", label: "Communities" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const { signInWithGithub, signOut, user } = useAuth();
  const displayName = user?.user_metadata.user_name || user?.email;
  const initials = displayName?.slice(0, 2).toUpperCase();

  useEffect(() => {
    const idx = hovered ?? active;
    const el = linkRefs.current[idx];
    const track = trackRef.current;
    if (el && track) {
      const elRect = el.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      setIndicator({ left: elRect.left - trackRect.left, width: elRect.width });
    }
  }, [hovered, active]);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E8E6F5] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo + live badge */}
        <Link to="/" className="flex flex-shrink-0 items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-[#14132B]">
            Social<span className="text-[#3A2FE0]">Media</span>
          </span>
          <span className="hidden items-center gap-1.5 rounded-full bg-[#F2F0FA] px-2.5 py-1 font-mono text-xs font-medium text-[#3A2FE0] sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF5A5F] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF5A5F]" />
            </span>
            1,204 live
          </span>
        </Link>

        {/* Desktop pill-track nav */}
        <div
          ref={trackRef}
          className="relative hidden items-center gap-0.5 rounded-full bg-[#F2F0FA] p-1 md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          <div
            className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm transition-all duration-300"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {navLinks.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              ref={(el) => (linkRefs.current[i] = el)}
              onMouseEnter={() => setHovered(i)}
              onClick={() => setActive(i)}
              className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active === i ? "text-[#14132B]" : "text-[#6E6B85] hover:text-[#14132B]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden flex-shrink-0 items-center gap-3 md:flex">
          <Link
            to="/community/create"
            className="rounded-full bg-[#3A2FE0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2E25B8]"
          >
            + Create Community
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-[#F2F0FA]"
              >
                {user.user_metadata.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full ring-2 ring-white ring-offset-2 ring-offset-white outline outline-2 outline-[#3A2FE0]"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ECEAFB] text-xs font-semibold text-[#3A2FE0] outline outline-2 outline-[#3A2FE0]">
                    {initials}
                  </span>
                )}
                <span className="text-sm font-medium text-[#14132B]">{displayName}</span>
                <ChevronDown size={14} className="text-[#6E6B85]" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] flex min-w-[160px] flex-col gap-0.5 rounded-xl border border-[#E8E6F5] bg-white p-1.5 shadow-lg">
                  <button
                    onClick={() => {
                      signOut();
                      setUserMenuOpen(false);
                    }}
                    className="rounded-lg px-3 py-2 text-left text-sm font-medium text-[#14132B] hover:bg-[#F2F0FA]"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={signInWithGithub}
              className="flex items-center gap-2 rounded-full bg-[#14132B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
            >
              Sign In With Github
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="text-[#14132B] md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile panel */}
      {isOpen && (
        <div className="border-t border-[#E8E6F5] bg-white md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2.5 font-medium text-[#14132B] hover:bg-[#F2F0FA]"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/community/create"
              onClick={() => setIsOpen(false)}
              className="mt-1 rounded-lg bg-[#3A2FE0] px-3 py-2.5 text-center font-semibold text-white hover:bg-[#2E25B8]"
            >
              + Create Community
            </Link>

            <div className="mt-2 flex items-center justify-between border-t border-[#E8E6F5] pt-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    {user.user_metadata.avatar_url && (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="User avatar"
                        className="h-8 w-8 rounded-full outline outline-2 outline-[#3A2FE0]"
                      />
                    )}
                    <span className="text-sm font-medium text-[#14132B]">{displayName}</span>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="rounded-lg border border-[#E8E6F5] px-3 py-1.5 text-sm font-medium text-[#14132B] hover:bg-[#F2F0FA]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    signInWithGithub();
                    setIsOpen(false);
                  }}
                  className="w-full rounded-lg bg-[#14132B] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Sign In With Github
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;