export default function Navbar() {
    return (
        <nav className="flex justify-between items-center font-bold font-sans  p-4 border-b border-gray-300">
            <h1 className="text-2xl font-bold">Navbar</h1>
            <ul className="flex gap-4 font-semibold">
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
            <div className="flex gap-4">
                <button className="bg-black text-white px-4 py-2 rounded-md">Login</button> 
                <button className="bg-black text-white px-4 py-2 rounded-md">Signup</button>
            </div>
        </nav>
    );
}
