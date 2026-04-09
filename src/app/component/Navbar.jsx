import Link from 'next/link'
import './Navbar.css'
import { useRouter } from 'next/navigation';
export default function Navbar() {
      const router = useRouter();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };
    return (
        <nav className="navbar">
            <div className="nav-brand">
                <h2>Resume Builder</h2>
            </div>
            <ul className="nav-links">
                <li><Link href="/dashboard" className='links'>Home</Link></li>
                <li><Link href="/resume/new" className='links'>Create Resume</Link></li>
                <li><Link href="/resume" className='links'>Saved Resume</Link></li>
            </ul>
            

                <button
                    onClick={handleLogout}
                    className='logout-btn'
                >
                    Logout
                </button>

            
        </nav>
    )
}