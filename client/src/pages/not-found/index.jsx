import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#191919]">
            <h1 className="text-6xl font-bold text-white mb-4">404</h1>
            <p className="text-xl text-gray-400">Page Not Found</p>
            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
            >
                Go Home
            </Link>
        </div>
    );
}

export default NotFound;
