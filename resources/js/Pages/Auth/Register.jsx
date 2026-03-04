
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import BackButton from '@/Components/BackButton';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [nameError, setNameError] = useState('');

    const emailRegex =
        /^(?:[a-zA-Z0-9._%+-]+@gmail\.com|[a-zA-Z0-9._%+-]+@hotmail\.com)$/;

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s><'"&\\]).{8,}$/;

    const validateName = (value) => {
        if (!value) {
            setNameError('El nombre es obligatorio');
            return false;
        }
        setNameError('');
        return true;
    };

    const validateEmail = (value) => {
        if (!value) {
            setEmailError('El correo es obligatorio');
            return false;
        }

        if (!emailRegex.test(value)) {
            setEmailError(
                'El correo debe ser Gmail o Hotmail y terminar en .com'
            );
            return false;
        }

        setEmailError('');
        return true;
    };

    const validatePassword = (value) => {
        if (!value) {
            setPasswordError('La contraseña es obligatoria');
            return false;
        }

        if (!passwordRegex.test(value)) {
            setPasswordError(
                'Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial'
            );
            return false;
        }

        setPasswordError('');
        return true;
    };

    const validateConfirmPassword = (value) => {
        if (!value) {
            setConfirmError('Debes confirmar la contraseña');
            return false;
        }

        if (value !== data.password) {
            setConfirmError('Las contraseñas no coinciden');
            return false;
        }

        setConfirmError('');
        return true;
    };

    const submit = (e) => {
        e.preventDefault();

        const isNameValid = validateName(data.name);
        const isEmailValid = validateEmail(data.email);
        const isPasswordValid = validatePassword(data.password);
        const isConfirmValid = validateConfirmPassword(
            data.password_confirmation
        );

        if (
            !isNameValid ||
            !isEmailValid ||
            !isPasswordValid ||
            !isConfirmValid
        ) {
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} noValidate>

                {/* NAME */}
                <div>
                    <InputLabel htmlFor="name" value="Nombre" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => {
                            const value = e.target.value.replace(/^\s+/, '');
                            setData('name', value);
                            validateName(value);
                        }}
                    />

                    {nameError && (
                        <p className="text-red-600 text-sm mt-2">
                            {nameError}
                        </p>
                    )}

                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* EMAIL */}
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => {
                            const value = e.target.value.replace(/\s+/g, '');
                            setData('email', value);
                            validateEmail(value);
                        }}
                    />

                    {emailError && (
                        <p className="text-red-600 text-sm mt-2">
                            {emailError}
                        </p>
                    )}

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* PASSWORD */}
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => {
                            const value = e.target.value.replace(/^\s+/, '');
                            setData('password', value);
                            validatePassword(value);
                        }}
                    />

                    {passwordError && (
                        <p className="text-red-600 text-sm mt-2">
                            {passwordError}
                        </p>
                    )}

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => {
                            const value = e.target.value.replace(/^\s+/, '');
                            setData('password_confirmation', value);
                            validateConfirmPassword(value);
                        }}
                    />

                    {confirmError && (
                        <p className="text-red-600 text-sm mt-2">
                            {confirmError}
                        </p>
                    )}

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* BUTTONS */}
                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900"
                    >
                        ¿Ya estás registrado?
                    </Link>

                    <PrimaryButton
                        className="ms-4"
                        disabled={processing}
                    >
                        Registrarse
                    </PrimaryButton>

                    <BackButton className="ms-4">
                        Volver
                    </BackButton>
                </div>

            </form>
        </GuestLayout>
    );
}
