type MenuProps = {
  isOpen: boolean;
  closeMenu: () => void;
};

export function Menu({ isOpen, closeMenu }: MenuProps) {
  return (
    <div>
      {isOpen ? (
        <div className="fixed inset-y-0 left-0 z-50 h-screen w-4/5 max-w-60 bg-blue-950">
          <button
            aria-label="Close menu"
            onClick={closeMenu}
            className="absolute right-4 top-4 w-10 h-10"
          >
            <span className="absolute left-1/2 top-1/2 h-0.5 w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
            <span className="absolute left-1/2 top-1/2 h-0.5 w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white" />
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
