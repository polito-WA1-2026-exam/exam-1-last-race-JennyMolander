import { Navbar } from 'react-bootstrap';

function Header() {
    return (
        <Navbar className="flex justify-between items-center w-full bg-gray-800 text-white p-6">
            <h1 className="text-2xl">Last Race</h1>
        </Navbar>
    )
}

export default Header;