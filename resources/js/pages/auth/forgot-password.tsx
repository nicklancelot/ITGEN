// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Mail, ArrowLeft } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Mot de passe oublié ?"
            description="Entrez votre email pour recevoir un lien de réinitialisation"
        >
            <Head title="Mot de passe oublié" />

            {status && (
                <div className="mb-6 text-center text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-3">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Adresse email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="off"
                                        autoFocus
                                        placeholder="exemple@email.com"
                                        className="h-12 pl-10 pr-4 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="mt-8">
                                <Button
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        'Envoyer le lien de réinitialisation'
                                    )}
                                </Button>
                            </div>

                            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                                Vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
                            </p>
                        </>
                    )}
                </Form>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <TextLink 
                        href={login()} 
                        className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à la connexion
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}