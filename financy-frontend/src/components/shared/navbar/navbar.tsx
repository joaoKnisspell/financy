import financyLogo from '@/assets/financy-logo.svg'
import { Link, useLocation } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { getInitials } from '@/lib/utils'

const pages = [
    {
        path: '/',
        label: 'Dashboard'
    },
    {
        path: '/transacoes',
        label: 'Transações'
    },
    {
        path: '/categorias',
        label: 'Categorias'
    },

]

export default function Navbar() {

    const { pathname } = useLocation()
    const { user } = useAuth()

    return (
        <header className="w-full h-[69px] border-b border-gray-200 bg-white">
            <div className="w-full max-w-[1184px] h-full flex items-center justify-between mx-auto">
                <img alt="financy logomarca" src={financyLogo} className='w-[100px]' />
                <nav className='flex items-center gap-5'>
                    {pages.map((page) => (
                        <Link data-active={pathname === page.path} key={page.path} to={page.path} className='text-sm data-[active=true]:font-semibold data-[active=true]:text-primary' >
                            {page.label}
                        </Link>
                    ))}
                </nav>
                <Link
                    to="/perfil"
                    title={user ? user.name : 'Perfil'}
                    className='size-9 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer hover:opacity-80'
                >
                    <span className='text-sm font-medium'>{user ? getInitials(user.name) : ''}</span>
                </Link>
            </div>
        </header>
    )
}