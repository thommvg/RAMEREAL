export default function BackButton({

    className = '',
    children = 'Atrás',
    ...props
}) {
    function goBack() {
        window.history.back();
    }

    return (
        <button
            {...props}
            onClick={goBack}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-purple-800 px-6 py-4 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-700 ` + className
            } 
        >
            {children}
        </button>
    );
}

