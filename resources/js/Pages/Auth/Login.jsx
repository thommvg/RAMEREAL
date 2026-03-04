
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import BackButton from '@/Components/BackButton';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const emailRegex =
        /^(?:[a-zA-Z0-9._%+-]+@gmail\.com|[a-zA-Z0-9._%+-]+@hotmail\.com)$/;

    const validateEmail = (value) => {

        if (!value) {
            setEmailError('El correo es obligatorio');
            return false;
        }

        if (!emailRegex.test(value)) {
            setEmailError('El correo debe ser Gmail o Hotmail válido');
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

        if (value.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        setPasswordError('');
        return true;
    };

    const submit = (e) => {
        e.preventDefault();

        const isEmailValid = validateEmail(data.email);
        const isPasswordValid = validatePassword(data.password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            {status && (
                <div className="mb-4 text-sm font-medium text-red-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} noValidate>

                {/* EMAIL */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
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
                        autoComplete="current-password"
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


                {/* REMEMBER */}
                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />

                        <span className="ms-2 text-sm text-purple-600">
                            Recuérdame
                        </span>
                    </label>
                </div>


                {/* BUTTONS */}
                <div className="mt-4 flex items-center justify-end">

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-purple-600 underline hover:text-purple-900"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}

                    <PrimaryButton
                        className="ms-4"
                        disabled={processing}
                    >
                        Iniciar sesión
                    </PrimaryButton>

                    <BackButton className="ms-4">
                        Volver
                    </BackButton>

                </div>

            </form>
        </GuestLayout>
    );
}

