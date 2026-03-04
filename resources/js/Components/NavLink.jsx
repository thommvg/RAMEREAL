export default function NavScrollLink({
    active = false,
    className = '',
    children,
    href, // El #Lugares, #Contacto, etc.
    ...props
}) {
    return (
        <a
            {...props}
            href={href}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-purple-400 text-white focus:border-purple-700'
                    : 'border-transparent text-gray-400 hover:border-purple-300 hover:text-white focus:border-gray-300 focus:text-gray-700') +
                className
            }
        >
            {children}
        </a>
    );
}